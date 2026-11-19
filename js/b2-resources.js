/* Resource guides: print button, optional lead capture (never required to read or print). */
(function () {
  var C = window.ENZO_B2B || {};
  document.querySelectorAll('[data-print]').forEach(function (b) {
    b.addEventListener('click', function () { if (window.enzoTrack) window.enzoTrack('spec_guide_downloaded', { guide: b.getAttribute('data-print') }); window.print(); });
  });
  var f = document.getElementById('guide-lead'); if (!f) return;
  f.addEventListener('submit', function (e) {
    e.preventDefault(); if (f.querySelector('[name=_gotcha]').value) return;
    var em = f.elements.email.value.trim(), st = f.querySelector('[data-status]');
    if (!em) { st.textContent = 'Nothing to send — the guides are free to read and print without an email.'; return; }
    if (!f.elements.email.checkValidity()) { st.textContent = 'That email address does not look right.'; return; }
    var fd = new FormData(f); fd.set('_subject', 'Guide request — ' + (f.getAttribute('data-guide') || 'resources')); fd.set('source_page', location.href);
    st.textContent = 'Sending…';
    fetch(C.FORMSPREE, { method: 'POST', body: fd, headers: { Accept: 'application/json' } }).then(function (r) { st.textContent = r.ok ? 'Thank you. ENZO will be in touch.' : 'Could not send. You can still print the guide above.'; if (r.ok) f.reset(); }).catch(function () { st.textContent = 'Could not send. You can still print the guide above.'; });
  });
})();
