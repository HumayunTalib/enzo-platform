/* ============================================================
   ENZO — scroll reveal. One motion pattern for the whole site.
   The previous custom cursor and page loader were removed in the
   rebuild: both cost perceived speed and neither helped the user
   navigate, choose, or trust.
   ============================================================ */
(function () {
  'use strict';

  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(function (el) { io.observe(el); });
})();
