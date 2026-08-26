/* ============================================================
   ENZO — wholesale catalog grid (catalog.html).
   Static filterable grid — no autoplay, no carousel. The fabric
   photography is the hero; nothing here should compete with it.
   Renders PRODUCTS (data/products.js) into #catalog-grid.
   ============================================================ */
(function () {
  'use strict';

  var grid = document.getElementById('catalog-grid');
  if (!grid || typeof PRODUCTS === 'undefined') return;

  var countEl = document.getElementById('catalog-count');
  var initialCat = new URLSearchParams(window.location.search).get('cat') || 'all';
  var state = { category: initialCat };

  function cardHTML(p) {
    var href = 'contact.html?quality=' + encodeURIComponent(p.name) +
      (p.article ? '&article=' + encodeURIComponent(p.article) : '');
    // Swatches only when we have real hex values. Shade names without colour
    // data render as text — eight identical placeholder chips say less than
    // the names do, and inventing brand colours is not an option.
    var hasHex = p.colorHex && p.colorHex.length;
    var swatches = hasHex ? p.colors.map(function (name, i) {
      return '<span class="swatch" style="background:' + (p.colorHex[i] || '#68727D') + '" title="' + name + '"></span>';
    }).join('') : '';
    var shadeText = (!hasHex && p.colors.length) ? p.colors.join(' · ') : '';
    var specBits = [p.construction, p.composition].filter(Boolean).join(' · ');

    return (
      '<article class="product-card reveal">' +
        '<div class="product-media" data-src="' + p.imgProduct + '" data-alt="' + p.name + ' — ENZO wholesale fabric">' +
          '<div class="product-media-fallback">' + (p.article || p.name) + '</div>' +
          '<a href="' + href + '" class="product-media-link" aria-label="Enquire about ' + p.name + '"></a>' +
        '</div>' +
        '<h3 class="product-name">' + p.name + '</h3>' +
        '<p class="product-meta">' + (p.eyebrow || '') + (p.comingSoon ? ' · Available Soon' : '') + '</p>' +
        (specBits ? '<p class="product-spec">' + specBits + '</p>' : '') +
        (swatches ? '<div class="swatch-row">' + swatches + '</div>' : '') +
        (shadeText ? '<p class="product-spec">' + shadeText + '</p>' : '') +
        '<a href="' + href + '" class="product-cta">' + (p.comingSoon ? 'Notify Me →' : 'Request Quote →') + '</a>' +
      '</article>'
    );
  }

  function render() {
    var list = state.category === 'all'
      ? PRODUCTS
      : PRODUCTS.filter(function (p) { return p.category === state.category; });

    grid.innerHTML = list.map(cardHTML).join('');
    if (countEl) countEl.textContent = list.length + (list.length === 1 ? ' construction' : ' constructions');
    if (typeof applyImageFallback === 'function') applyImageFallback(grid);

    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.1 });
      grid.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
    } else {
      grid.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    }
  }

  document.querySelectorAll('[data-filter]').forEach(function (btn) {
    // Reflect a ?cat= deep link (e.g. from the wholesale page) in the button state.
    btn.classList.toggle('active', btn.dataset.filter === initialCat);
    btn.setAttribute('aria-pressed', String(btn.dataset.filter === initialCat));
    btn.addEventListener('click', function () {
      state.category = btn.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(function (b) {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      render();
    });
  });

  render();
})();
