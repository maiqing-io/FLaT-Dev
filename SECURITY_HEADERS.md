# Security Headers for FLaT Society Website

## Content Security Policy (CSP)
Restricts where scripts, styles, and other resources can be loaded from. Prevents XSS attacks.

```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'sha256-<hash-per-inline-script>' https://www.googletagmanager.com https://www.google-analytics.com; 
  style-src 'self' https://fonts.googleapis.com; 
  font-src 'self' https://fonts.gstatic.com; 
  connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com; 
  img-src 'self' https: data:; 
  frame-ancestors 'none'; 
  base-uri 'self'
```

Inline `<script>` blocks are allow-listed by SHA-256 hash instead of `'unsafe-inline'`, and there are no inline `style` attributes or `<style>` blocks left in the markup, so `style-src` no longer needs `'unsafe-inline'` either. Any edit to an inline script's content changes its hash — after editing an inline `<script>` block in any `.html` file, recompute its SHA-256 (base64) and update the matching entry in `netlify.toml`, or the browser will silently block that script.

## Additional Security Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

## Implementation

### Current setup (Netlify)
The site is deployed on Netlify; headers are defined in `netlify.toml` and applied to every route via `[[headers]]` `for = "/*"`. That file is the source of truth — this doc is descriptive, not authoritative.

## What Each Header Does
- **CSP**: Whitelist allowed sources for scripts/styles, preventing injection attacks
- **X-Content-Type-Options**: Prevent browsers from guessing MIME types (blocks some XSS)
- **X-Frame-Options: DENY**: Prevents your site from being embedded in iframes (clickjacking protection)
- **X-XSS-Protection**: Older XSS protection (modern browsers use CSP instead)
- **Referrer-Policy**: Controls what referrer info is sent to other sites
- **Permissions-Policy**: Disable browser APIs you don't use (camera, mic, geolocation)
- **HSTS**: Force HTTPS-only, prevents downgrade attacks

## Testing
Test your headers at: https://securityheaders.com
