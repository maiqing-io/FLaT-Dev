/* ---------- Form Spam Protection & Rate Limiting ---------- */

(function() {
  const RATE_LIMIT_KEY = 'flatFormSubmissions';
  const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms
  const MAX_SUBMISSIONS_PER_HOUR = 5;
  const SUBMISSION_COOLDOWN = 3 * 1000; // 3 seconds between submissions

  /**
   * Honeypot Field Protection
   * Hidden field that bots typically fill out, but real users won't see
   */
  function addHoneypotField(form) {
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website_url'; // Bots commonly fill this
    honeypot.style.position = 'absolute';
    honeypot.style.left = '-9999px';
    honeypot.style.opacity = '0';
    honeypot.setAttribute('aria-hidden', 'true');
    honeypot.setAttribute('tabindex', '-1');
    honeypot.setAttribute('autocomplete', 'off');
    form.insertBefore(honeypot, form.firstChild);
  }

  /**
   * Check if honeypot was filled (indicates bot)
   */
  function isHoneypotFilled(form) {
    const honeypot = form.querySelector('input[name="website_url"]');
    return honeypot && honeypot.value.trim().length > 0;
  }

  /**
   * Email Validation
   * More thorough than HTML5 email input alone
   */
  function validateEmail(email) {
    // Basic format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, error: 'Please enter a valid email address.' };
    }

    // Check for common typos/invalid patterns
    if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
      return { valid: false, error: 'Email format is invalid.' };
    }

    // Check length
    if (email.length > 254) {
      return { valid: false, error: 'Email address is too long.' };
    }

    return { valid: true };
  }

  /**
   * Rate Limiting
   * Prevents spam by limiting submissions per IP/session
   */
  function getRateLimitData() {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    if (!stored) {
      return { submissions: [], lastReset: Date.now() };
    }
    try {
      return JSON.parse(stored);
    } catch {
      return { submissions: [], lastReset: Date.now() };
    }
  }

  function isRateLimited() {
    const data = getRateLimitData();
    const now = Date.now();
    const timeSinceReset = now - data.lastReset;

    // Reset if window has passed
    if (timeSinceReset > RATE_LIMIT_WINDOW) {
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ 
        submissions: [], 
        lastReset: now 
      }));
      return false;
    }

    // Check if max submissions reached
    if (data.submissions.length >= MAX_SUBMISSIONS_PER_HOUR) {
      return true;
    }

    return false;
  }

  function recordSubmission() {
    const data = getRateLimitData();
    data.submissions.push(Date.now());
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
  }

  function checkSubmissionCooldown() {
    const data = getRateLimitData();
    if (data.submissions.length === 0) {
      return false; // No cooldown needed
    }

    const lastSubmission = data.submissions[data.submissions.length - 1];
    const timeSinceLastSubmission = Date.now() - lastSubmission;

    return timeSinceLastSubmission < SUBMISSION_COOLDOWN;
  }

  /**
   * Initialize form protection on all forms with data-spam-protection attribute
   */
  function initFormProtection() {
    const forms = document.querySelectorAll('form[data-spam-protection]');

    forms.forEach(form => {
      // Add honeypot field
      addHoneypotField(form);

      // Add form submission handler
      form.addEventListener('submit', function(e) {
        const statusEl = form.querySelector('[role="status"]');
        const submitBtn = form.querySelector('button[type="submit"]');

        // Check honeypot
        if (isHoneypotFilled(form)) {
          e.preventDefault();
          if (statusEl) {
            statusEl.textContent = 'Submission failed. Please try again.';
            statusEl.className = 'apply-status error';
          }
          return false;
        }

        // Check rate limiting
        if (isRateLimited()) {
          e.preventDefault();
          if (statusEl) {
            statusEl.textContent = 'Too many submissions. Please wait an hour before trying again.';
            statusEl.className = 'apply-status error';
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit application';
          }
          return false;
        }

        // Check submission cooldown
        if (checkSubmissionCooldown()) {
          e.preventDefault();
          if (statusEl) {
            statusEl.textContent = 'Please wait a moment before submitting again.';
            statusEl.className = 'apply-status error';
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit application';
          }
          return false;
        }

        // Validate all email fields
        const emailInputs = form.querySelectorAll('input[type="email"]');
        for (let emailInput of emailInputs) {
          if (emailInput.value) {
            const validation = validateEmail(emailInput.value);
            if (!validation.valid) {
              e.preventDefault();
              if (statusEl) {
                statusEl.textContent = validation.error;
                statusEl.className = 'apply-status error';
              }
              emailInput.focus();
              return false;
            }
          }
        }

        // If all checks pass, record the submission
        recordSubmission();
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormProtection);
  } else {
    initFormProtection();
  }

  // Expose validation functions globally for manual use
  window.FLaTFormProtection = {
    validateEmail: validateEmail,
    isRateLimited: isRateLimited
  };
})();
