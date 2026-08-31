/* ============================================================
   ENZO — shade-lot notify signup (shop.html only). Email capture
   through the shared Formspree path in js/forms.js; a hidden
   _subject on the form marks it apart in the inbox. No-op if the
   form isn't present on the current page.
   ============================================================ */
(function () {
  'use strict';

  var form = document.getElementById('notify-form');
  if (!form) return;

  var setStatus = EnzoForm.statusWriter(document.getElementById('notify-status'), '#4f8a4a', '#a9432c');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var email = (form.querySelector('[name="email"]') || {}).value || '';
    if (!email.trim()) {
      setStatus('Please enter an email address.', false);
      return;
    }

    EnzoForm.submit(form, setStatus, {
      sending:      'Signing you up…',
      success:      'Done — we will email you when a new shade lot opens.',
      failure:      'Something went wrong. Please email info@enzolhr.com instead.',
      network:      'Network error. Please email info@enzolhr.com instead.',
      unconfigured: 'Signup is unavailable right now — email info@enzolhr.com.'
    });
  });
})();
