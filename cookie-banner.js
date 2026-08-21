/* ---------- Cookie Banner & Consent Management ---------- */

(function() {
  const COOKIE_CONSENT_KEY = 'flatSocietyCookieConsent';
  const COOKIE_CONSENT_EXPIRY = 365 * 24 * 60 * 60 * 1000; // 365 days in ms

  function createCookieBanner() {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.id = 'cookieBanner';
    banner.innerHTML = `
      <div class="cookie-banner-content">
        <p class="cookie-banner-text">
          We use cookies and analytics to understand how you use our site and improve your experience. 
          By continuing, you accept our use of cookies. See our <a href="/FLaT-Dev/privacy.html" target="_blank">privacy policy</a> for details.
        </p>
      </div>
      <div class="cookie-banner-actions">
        <button class="cookie-btn cookie-btn-decline" id="cookieDecline">Decline Analytics</button>
        <button class="cookie-btn cookie-btn-accept" id="cookieAccept">Accept All</button>
      </div>
    `;
    document.body.appendChild(banner);
    return banner;
  }

  function setCookieConsent(accepted) {
    const expiryDate = new Date(Date.now() + COOKIE_CONSENT_EXPIRY).toUTCString();
    document.cookie = `${COOKIE_CONSENT_KEY}=${accepted ? 'accepted' : 'declined'}; expires=${expiryDate}; path=/; SameSite=Lax`;
    localStorage.setItem(COOKIE_CONSENT_KEY, accepted ? 'accepted' : 'declined');
  }

  function getCookieConsent() {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) return stored;

    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === COOKIE_CONSENT_KEY) return value;
    }
    return null;
  }

  function hideCookieBanner(banner) {
    banner.classList.remove('visible');
    setTimeout(() => banner.remove(), 300);
  }

  function initCookieBanner() {
    const consent = getCookieConsent();
    
    // If user has already made a choice, don't show banner
    if (consent) {
      if (consent === 'declined') {
        disableGoogleAnalytics();
      }
      return;
    }

    // Show banner
    const banner = createCookieBanner();
    setTimeout(() => banner.classList.add('visible'), 100);

    document.getElementById('cookieAccept').addEventListener('click', () => {
      setCookieConsent(true);
      hideCookieBanner(banner);
      // GA already enabled by default in HTML
      console.log('Analytics enabled');
    });

    document.getElementById('cookieDecline').addEventListener('click', () => {
      setCookieConsent(false);
      hideCookieBanner(banner);
      disableGoogleAnalytics();
      console.log('Analytics disabled');
    });
  }

  function disableGoogleAnalytics() {
    // Disable Google Analytics by preventing gtag from tracking
    window['ga-disable-G-XXXXXXXXXX'] = true;
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'default', {
        'analytics_storage': 'denied'
      });
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieBanner);
  } else {
    initCookieBanner();
  }
})();
