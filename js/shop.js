/* ============================================================
   ENZO — shop.html filtering and grid rendering (retail line).
   Renders only real products/colors from RAQI_PRODUCTS — filters
   never invent a facet value that doesn't exist in the data.
   Cards stay minimal: image, name, one spec line, price, CTA —
   full description lives on the product page, not the card.
   ============================================================ */
(function () {
  'use strict';
  if (typeof RAQI_PRODUCTS === 'undefined') return;

  var PHONE = '923218230266';
  var SEASONS = [
    { tag: 'summer', label: 'Summer' },
    { tag: 'winter', label: 'Winter' },
    { tag: 'all-season', label: 'All-Season' }
  ];
  var CHARACTERS = [
    { tag: 'standing', label: 'Standing' },
    { tag: 'fluid', label: 'Fluid' },
    { tag: 'structural', label: 'Structural' },
    { tag: 'neutral', label: 'Neutral' }
  ];

  function getParams() {
    var sp = new URLSearchParams(window.location.search);
    return { season: sp.get('season'), character: sp.get('character') };
  }
  var state = getParams();

  function setParams() {
    var sp = new URLSearchParams();
    if (state.season) sp.set('season', state.season);
    if (state.character) sp.set('character', state.character);
    var qs = sp.toString();
    window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
  }

  function matches(p) {
    if (state.season && p.seasonTag !== state.season) return false;
    if (state.character && p.characterTag !== state.character) return false;
    return true;
  }

  function pillGroup(label, options, activeVal, key) {
    var html = '<div class="filter-group"><span class="label">' + label + '</span><div class="filter-row">';
    html += '<button type="button" class="filter-btn' + (!activeVal ? ' active' : '') + '" data-key="' + key + '" data-val="">All</button>';
    options.forEach(function (o) {
      html += '<button type="button" class="filter-btn' + (activeVal === o.tag ? ' active' : '') + '" data-key="' + key + '" data-val="' + o.tag + '">' + o.label + '</button>';
    });
    html += '</div></div>';
    return html;
  }

  function renderFilters() {
    var html = pillGroup('Season', SEASONS, state.season, 'season') +
               pillGroup('Character', CHARACTERS, state.character, 'character');
    var desktop = document.getElementById('filters-desktop');
    var mobile  = document.getElementById('filters-mobile');
    if (desktop) desktop.innerHTML = html;
    if (mobile)  mobile.innerHTML  = html;
  }

  function productCardHTML(p) {
    var swatches = p.colors.map(function (c) {
      return '<span class="swatch" style="background:' + c.hex + '" title="' + c.name + '"></span>';
    }).join('');
    var href = 'product-' + p.slug + '.html';
    return (
      '<article class="product-card reveal">' +
        '<div class="product-media" data-src="' + p.image + '" data-alt="' + p.code + ' — ENZO finished fabric">' +
          '<div class="product-media-fallback">' + p.id + '</div>' +
          '<a href="' + href + '" class="product-media-link" aria-label="View ' + p.code + '"></a>' +
          '<button type="button" class="quickadd" data-code="' + p.code + '" aria-label="Add ' + p.code + ' to selection">' +
            '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>' +
          '</button>' +
        '</div>' +
        '<h3 class="product-name"><a href="' + href + '">' + p.code + '</a></h3>' +
        '<p class="product-meta">' + p.season + ' · ' + p.gsm + ' GSM</p>' +
        '<p class="product-price">Rs. ' + p.price + ' / metre</p>' +
        '<div class="swatch-row">' + swatches + '</div>' +
        '<a href="' + href + '" class="product-cta">View Fabric →</a>' +
      '</article>'
    );
  }

  function renderGrid() {
    var grid = document.getElementById('shop-grid');
    var filtered = RAQI_PRODUCTS.filter(matches);
    var countEl = document.getElementById('shop-count');
    if (!filtered.length) {
      grid.innerHTML = '<p class="body" style="grid-column:1/-1;text-align:center;padding:64px 0;">No fabrics match this combination. <a href="shop.html" class="link">Clear filters</a></p>';
    } else {
      grid.innerHTML = filtered.map(productCardHTML).join('');
    }
    if (countEl) countEl.textContent = filtered.length + (filtered.length === 1 ? ' fabric' : ' fabrics');
    if (typeof applyImageFallback === 'function') applyImageFallback(grid);
    if (window.EnzoCartUI) window.EnzoCartUI.refresh();

    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.1 });
      grid.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
    } else {
      grid.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    }
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.filter-btn[data-key]');
    if (!btn) return;
    state[btn.dataset.key] = btn.dataset.val || null;
    setParams();
    renderFilters();
    renderGrid();
  });

  var toggle = document.getElementById('filters-toggle');
  var drawer = document.getElementById('filter-drawer');
  var backdrop = document.getElementById('filter-backdrop');
  var drawerClose = document.getElementById('filter-drawer-close');
  if (toggle && drawer && backdrop) {
    var setOpen = function (open) {
      drawer.classList.toggle('open', open);
      backdrop.classList.toggle('visible', open);
      drawer.setAttribute('aria-hidden', String(!open));
    };
    toggle.addEventListener('click', function () { setOpen(true); });
    if (drawerClose) drawerClose.addEventListener('click', function () { setOpen(false); });
    backdrop.addEventListener('click', function () { setOpen(false); });
  }

  renderFilters();
  renderGrid();
})();
