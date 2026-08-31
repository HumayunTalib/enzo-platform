/* ============================================================
   ENZO — Formspree submit, shared by the quote form (contact.html)
   and the shade-lot signup (shop.html). Both previously carried
   their own fetch, their own status handling and — at one point —
   two different form IDs, which is how the quote form silently
   stopped emailing. One path now, one ID, one set of messages.
   ============================================================ */
var EnzoForm = (function () {
  'use strict';

  var ENDPOINT = 'https://formspree.io/f/';

  function formspreeId() {
    return (window.ENZO_CONFIG && window.ENZO_CONFIG.formspreeId) || '';
  }

  /* Paints a status line and colours it. Shared so success and failure
     read the same on both forms. */
  function statusWriter(el, okColor, badColor) {
    return function (msg, ok) {
      if (!el) return;
      el.textContent = msg;
      el.style.color = ok ? okColor : badColor;
    };
  }

  /* POSTs the form and drives the button + status line.
     onSuccess lets each caller decide what "done" says. */
  function submit(form, setStatus, messages) {
    var id = formspreeId();
    if (!id) { setStatus(messages.unconfigured, false); return Promise.resolve(false); }

    var btn = form.querySelector('[type="submit"]');
    if (btn) btn.disabled = true;
    setStatus(messages.sending, true);

    return fetch(ENDPOINT + id, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    }).then(function (res) {
      if (res.ok) { form.reset(); setStatus(messages.success, true); return true; }
      setStatus(messages.failure, false);
      return false;
    }).catch(function () {
      setStatus(messages.network, false);
      return false;
    }).finally(function () {
      if (btn) btn.disabled = false;
    });
  }

  return { submit: submit, statusWriter: statusWriter, id: formspreeId };
})();
