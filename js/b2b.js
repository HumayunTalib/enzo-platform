/* ENZO B2B helpers: WhatsApp links with page context, quote deep-links. */
(function () {
  var C = window.ENZO_B2B || {};
  function wa(text, num) { return 'https://wa.me/' + (num || C.WHATSAPP) + '?text=' + encodeURIComponent(text); }
  window.enzoWa = wa;
  // <a data-wa="optional extra text"> becomes a WhatsApp link that carries page title + URL (+ data-wa-spec).
  function wire() {
    var base = location.origin + location.pathname;
    document.querySelectorAll('a[data-wa]').forEach(function (a) {
      var extra = a.getAttribute('data-wa') || '';
      var spec = a.getAttribute('data-wa-spec') || '';
      var msg = 'Hello ENZO, I would like to discuss specifications.\nPage: ' + document.title.replace(/\s*\|\s*ENZO.*$/, '') + '\n' + base +
                (extra ? '\n' + extra : '') + (spec ? '\nSpecs: ' + spec : '');
      a.href = wa(msg); a.target = '_blank'; a.rel = 'noopener noreferrer';
      if (!a.hasAttribute('data-track')) { a.setAttribute('data-track', 'whatsapp_cta_clicked'); }
      var second = C.WHATSAPP_SECONDARY;
      if (second && !a.getAttribute('data-wa-2') && a.hasAttribute('data-wa-secondary-ok')) {
        var b = a.cloneNode(true); b.href = wa(msg, second); b.textContent = (a.textContent || 'WhatsApp') + ' (2)'; b.setAttribute('data-wa-2', '1'); a.after(b);
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
  window.enzoWire = wire;
})();
