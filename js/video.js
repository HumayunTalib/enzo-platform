/* Lazy, muted, looping stock video with a visible pause control. Respects reduced-motion. */
(function () {
  'use strict';
  var wraps = document.querySelectorAll('[data-video]');
  if (!wraps.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  Array.prototype.forEach.call(wraps, function (w) {
    var v = w.querySelector('video'), b = w.querySelector('.vid-toggle');
    if (!v) return;
    function label() { b.textContent = v.paused ? 'Play' : 'Pause'; b.setAttribute('aria-label', v.paused ? 'Play video' : 'Pause video'); }
    b.addEventListener('click', function () { if (v.paused) { v.play(); } else { v.pause(); } });
    v.addEventListener('play', label); v.addEventListener('pause', label); label();
    if (reduce || !('IntersectionObserver' in window)) return;     // stays on poster; visitor can press Play
    new IntersectionObserver(function (es, io) {
      es.forEach(function (e) {
        if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else if (!v.paused) { v.pause(); }
      });
    }, { threshold: 0.4 }).observe(v);
  });
})();
