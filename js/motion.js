/* ============================================================
   ENZO — scroll reveal. One motion pattern for the whole site.
   The previous custom cursor and page loader were removed in the
   rebuild: both cost perceived speed and neither helped the user
   navigate, choose, or trust.

   Exposed as applyReveal() because the catalog and shop grids
   re-render on filter and must reveal the new nodes; they used to
   each carry their own copy of this observer.
   ============================================================ */
function applyReveal(root) {
  'use strict';
  var els = (root || document).querySelectorAll('.reveal:not(.in)');
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
}
applyReveal();
