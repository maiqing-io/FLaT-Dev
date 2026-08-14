import json
import os
import logging
from urllib import request, parse

# Netlify Python function entrypoint

def handler(event, context):
    # CORS preflight
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': 'OK'
        }

    try:
        body = json.loads(event.get('body') or '{}')
    except Exception:
        return {'statusCode': 400, 'body': json.dumps({'error': 'Invalid JSON'})}

    # Basic validation
    required = ['role', 'name', 'email']
    missing = [k for k in required if not body.get(k)]
    if missing:
        return {'statusCode': 400, 'body': json.dumps({'error': 'Missing fields', 'missing': missing})}

    # Prepare payload to store
    payload = {
        'Role': body.get('role'),
        'Name': body.get('name'),
        'Email': body.get('email'),
        'Message': body.get('message', ''),
        'Telegram/LinkedIn': body.get('contact', ''),
    }

    # Try to write to Airtable if configured
    airtable_key = os.environ.get('AIRTABLE_API_KEY')
    airtable_base = os.environ.get('AIRTABLE_BASE_ID')
    airtable_table = os.environ.get('AIRTABLE_TABLE', 'Applications')

    if airtable_key and airtable_base:
        try:
            url = f"https://api.airtable.com/v0/{airtable_base}/{parse.quote(airtable_table)}"
            data = json.dumps({'fields': payload}).encode('utf-8')
            req = request.Request(url, data=data, method='POST')
            req.add_header('Authorization', f'Bearer {airtable_key}')
            req.add_header('Content-Type', 'application/json')
            with request.urlopen(req, timeout=10) as resp:
                resp_body = resp.read().decode('utf-8')
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'status': 'ok', 'storage': 'airtable', 'response': json.loads(resp_body)})
            }
        except Exception as e:
            logging.exception('Airtable write failed')
            # fall through to fallback

    # Fallback: attempt to send via SMTP if configured
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', '587')) if os.environ.get('SMTP_PORT') else None
    smtp_user = os.environ.get('SMTP_USER')
    smtp_pass = os.environ.get('SMTP_PASS')
    smtp_to = os.environ.get('SMTP_TO')

    if smtp_host and smtp_port and smtp_user and smtp_pass and smtp_to:
        try:
            import smtplib
            from email.message import EmailMessage
            msg = EmailMessage()
            msg['Subject'] = f"FLaT application: {payload['Role']} — {payload['Name']}"
            msg['From'] = smtp_user
            msg['To'] = smtp_to
            body_text = json.dumps(payload, indent=2)
            msg.set_content(body_text)

            with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as s:
                s.starttls()
                s.login(smtp_user, smtp_pass)
                s.send_message(msg)

            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'status': 'ok', 'storage': 'email'})
            }
        except Exception:
            logging.exception('SMTP send failed')

    # Final fallback: return payload in response (not stored). This is useful during local testing.
    logging.info('No storage configured, returning payload in response')
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'status': 'ok', 'storage': 'none', 'payload': payload})
    }
gsheet_url = os.environ.get('GSHEET_WEBAPP_URL')
gsheet_secret = os.environ.get('GSHEET_SECRET')

if gsheet_url and gsheet_secret:
    try:
        forward_payload = dict(payload)
        forward_payload['secret'] = gsheet_secret
        data = json.dumps(forward_payload).encode('utf-8')
        req = request.Request(gsheet_url, data=data, method='POST')
        req.add_header('Content-Type', 'application/json')
        with request.urlopen(req, timeout=10) as resp:
            resp_body = resp.read().decode('utf-8')
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'status': 'ok', 'storage': 'gsheet'})
        }
    except Exception:
        logging.exception('GSheet forward failed')
        # fall through to Airtable/SMTP/none
