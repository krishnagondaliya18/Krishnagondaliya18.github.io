/**
 * Krishna Gondaliya - Portfolio JavaScript
 * Theme management (Pure Black & White Mode), copy utilities, contact form, and scroll watcher
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCopyEmail();
  initContactForm();
  initScrollEffects();
});

/* -------------------------------------------------------------------------- */
/* 1. THEME SWITCHER (Pure Black & Light Mode)                                */
/* -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;

  // Retrieve saved preference or default to dark (Pure Black OLED)
  const savedTheme = localStorage.getItem('kg_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'dark');
  applyTheme(initialTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  });

  // Listen to system changes if user hasn't explicitly set a preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('kg_theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('kg_theme', theme);

  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;

  if (theme === 'dark') {
    // Show Sun icon (to switch to light)
    themeToggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path>
        <path d="M12 20v2"></path>
        <path d="m4.93 4.93 1.41 1.41"></path>
        <path d="m17.66 17.66 1.41 1.41"></path>
        <path d="M2 12h2"></path>
        <path d="M20 12h2"></path>
        <path d="m6.34 17.66-1.41 1.41"></path>
        <path d="m19.07 4.93-1.41 1.41"></path>
      </svg>
    `;
    themeToggleBtn.setAttribute('title', 'Switch to White theme');
    themeToggleBtn.setAttribute('aria-label', 'Switch to White theme');
  } else {
    // Show Moon icon (to switch to dark)
    themeToggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
      </svg>
    `;
    themeToggleBtn.setAttribute('title', 'Switch to Pure Black theme');
    themeToggleBtn.setAttribute('aria-label', 'Switch to Pure Black theme');
  }
}

/* -------------------------------------------------------------------------- */
/* 2. COPY EMAIL TO CLIPBOARD WITH TOAST                                      */
/* -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyBtns = document.querySelectorAll('[data-copy-email]');
  const toast = document.getElementById('toastNotice');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-copy-email') || 'gondaliyakishan839@gmail.com';
      
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Email copied: ${email}`);
      }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Email copied: ${email}`);
      });
    });
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
}

/* -------------------------------------------------------------------------- */
/* 3. QUICK CONTACT / DIRECT MESSAGE FORM                                     */
/* -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('formSubmitBtn');
  const toast = document.getElementById('toastNotice');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('formName')?.value.trim() || '';
    const email = document.getElementById('formEmail')?.value.trim() || '';
    const message = document.getElementById('formMessage')?.value.trim() || '';

    if (!name || !email || !message) return;

    // Loading state on button
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span>`;
    }

    try {
      // Send directly to FormSubmit endpoint for gondaliyakishan839@gmail.com
      const response = await fetch("https://formsubmit.co/ajax/gondaliyakishan839@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
          _subject: `New Portfolio Message from ${name}`
        })
      });

      if (response.ok) {
        showToast("✓ Message sent successfully! Delivered to Krishna's email.");
        form.reset();
      } else {
        throw new Error("Form submission error");
      }
    } catch (err) {
      // Direct email client fallback
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Hi Krishna,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:gondaliyakishan839@gmail.com?subject=${subject}&body=${body}`;
      showToast("Opening email to send your message...");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    }
  });

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }
}

/* -------------------------------------------------------------------------- */
/* 4. SCROLL PROGRESS & STICKY HEADER                                         */
/* -------------------------------------------------------------------------- */
function initScrollEffects() {
  const header = document.querySelector('.site-header');
  const progressBar = document.getElementById('readingProgress');

  function handleScroll() {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', y > 15);
    }
    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}
