/* ============================================================
   ENZO — quote form (contact.html). Prefills from catalog deep
   links, validates, then hands off to the shared Formspree path
   in js/forms.js. Keeps a WhatsApp fallback for the case where
   no form ID is configured, so an inquiry is never simply lost.
   ============================================================ */
(function () {
  'use strict';

  var form = document.querySelector('form[data-quote-form]');
  if (!form) return;

  var PHONE     = '923218230266';
  var setStatus = EnzoForm.statusWriter(document.getElementById('form-status'), '#1A5A2A', '#8B3A2A');

  // ── Prefill Quality / Article from ?quality= & ?article= (catalog deep-links) ──
  try {
    var params  = new URLSearchParams(window.location.search);
    var quality = params.get('quality');
    var article = params.get('article');
    var qEl     = document.getElementById('f-quality');
    if (qEl && (quality || article)) {
      qEl.value = [quality, article ? 'Art. ' + article : ''].filter(Boolean).join(' — ');
    }
  } catch (e) { /* URLSearchParams unsupported — non-fatal */ }

  // ── WhatsApp fallback (used when no Formspree ID is configured) ──
  function waLink(data) {
    var lines = [
      'Hello ENZO, I would like to request a quote.',
      data.name     ? 'Name: ' + data.name : '',
      data.company  ? 'Company: ' + data.company : '',
      data.email    ? 'Email: ' + data.email : '',
      data.phone    ? 'Phone: ' + data.phone : '',
      data.quantity ? 'Quantity: ' + data.quantity + ' m' : '',
      data.quality  ? 'Quality/Article: ' + data.quality : '',
      data.location ? 'Location: ' + data.location : '',
      data.message  ? 'Message: ' + data.message : ''
    ].filter(Boolean);
    return 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(lines.join('\n'));
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v.toString().trim(); });

    if (!data.name || !data.email) {
      setStatus('Please provide at least your name and email.', false);
      return;
    }

    // No backend configured → hand the inquiry off to WhatsApp rather than drop it
    if (!EnzoForm.id()) {
      setStatus('Opening WhatsApp to send your inquiry…', true);
      window.open(waLink(data), '_blank', 'noopener');
      return;
    }

    EnzoForm.submit(form, setStatus, {
      sending:      'Sending…',
      success:      'Thank you — we will respond within 1 business day.',
      failure:      'Something went wrong. Please reach us on WhatsApp instead.',
      network:      'Network error. Please reach us on WhatsApp instead.',
      unconfigured: 'Please reach us on WhatsApp instead.'
    });
  });
})();
