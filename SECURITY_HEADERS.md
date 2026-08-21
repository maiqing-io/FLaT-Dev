# Security Headers for FLaT Society Website

## Content Security Policy (CSP)
Restricts where scripts, styles, and other resources can be loaded from. Prevents XSS attacks.

```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; 
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
  font-src 'self' https://fonts.gstatic.com; 
  connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com; 
  img-src 'self' https: data:; 
  frame-ancestors 'none'; 
  base-uri 'self'
```

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

### For GitHub Pages (using Netlify redirects)
If you migrate to Netlify, add to `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com; img-src 'self' https: data:; frame-ancestors 'none'; base-uri 'self'"
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
```

### For GitHub Pages (via `_headers` file)
Create `_headers` in the root directory with the headers above. Note: GitHub Pages with a custom domain supports some headers.

### Current Recommendation
Since you're on GitHub Pages, security headers are partially enforced by GitHub. For full control, consider:
- **Netlify** (free tier, full header control)
- **Vercel** (free tier, full header control)
- **Cloudflare** (free tier, add security headers via Page Rules)

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
