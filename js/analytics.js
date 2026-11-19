/* ENZO event tracking — privacy-safe, dependency-free.
 * Events: rfq_submitted, whatsapp_cta_clicked, calculator_used, spec_guide_downloaded
 * - Always pushes to window.dataLayer (no network request; GTM can read it).
 * - Calls gtag() only if GA4 is configured and the visitor has not set Do-Not-Track / Global Privacy Control.
 * - GA4 itself loads after the page is idle, so it never blocks rendering. */
(function () {
  var C = window.ENZO_B2B || {};
  var optOut = navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  window.dataLayer = window.dataLayer || [];
  function track(name, params) {
    params = params || {};
    params.page_path = location.pathname;
    try {
      var d = { event: name }; for (var k in params) d[k] = params[k];
      window.dataLayer.push(d);
      if (!optOut && typeof window.gtag === 'function') window.gtag('event', name, params);
      if (C.DEBUG && window.console) console.log('[track]', name, params);
    } catch (e) { /* never break the page */ }
  }
  window.enzoTrack = track;
  if (C.GA4_ID && !optOut) {
    var boot = function () {
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date()); window.gtag('config', C.GA4_ID, { anonymize_ip: true });
      var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(C.GA4_ID); document.head.appendChild(s);
    };
    window.addEventListener('load', function () { (window.requestIdleCallback || function (f) { setTimeout(f, 1500); })(boot); });
  }
  // Delegated click tracking: any element with data-track="event_name" (+ optional data-track-label)
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-track]') : null;
    if (!el) return;
    track(el.getAttribute('data-track'), { label: el.getAttribute('data-track-label') || '', href: el.getAttribute('href') || '' });
  }, true);
})();
