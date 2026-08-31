/* ============================================================
   ENZO — shade-lot notify signup (shop.html only). Email capture,
   Formspree, same endpoint as js/contact.js; a hidden _subject marks it
   apart in the inbox. No-op if the
   form isn't present on the current page.
   ============================================================ */
(function () {
  'use strict';
  var FORMSPREE_ID = (window.ENZO_CONFIG && window.ENZO_CONFIG.formspreeId) || '';
  var form = document.getElementById('notify-form');
  if (!form) return;
  var status = document.getElementById('notify-status');

  function setStatus(msg, ok) {
    if (!status) return;
    status.textContent = msg;
    status.style.color = ok ? '#4f8a4a' : '#a9432c';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fd = new FormData(form);
    var email = (fd.get('email') || '').toString().trim();
    if (!email) { setStatus('Please enter your email.', false); return; }

    var btn = form.querySelector('[type="submit"]');
    if (btn) btn.disabled = true;
    setStatus('Sending…', true);

    if (!FORMSPREE_ID) {
      setStatus('Signup is unavailable right now — email info@enzolhr.com.', false);
      return;
    }

    fetch('https://formspree.io/f/' + FORMSPREE_ID, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: fd
    }).then(function (res) {
      if (res.ok) {
        form.reset();
        setStatus("You're on the list — we'll email you when a new lot opens.", true);
      } else {
        setStatus('Something went wrong. Please try again or message us on WhatsApp.', false);
      }
    }).catch(function () {
      setStatus('Network error. Please try again or message us on WhatsApp.', false);
    }).finally(function () {
      if (btn) btn.disabled = false;
    });
  });
})();
