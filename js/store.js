/* ENZO ready-stock store. No dependencies. Talks to the Google Apps Script web app set in store-config.js */
(function () {
  'use strict';
  var C = window.ENZO_STORE || {};
  var API = C.API || '';
  var $ = function (id) { return document.getElementById(id); };
  var els = { grid: $('st-grid'), q: $('st-q'), ql: $('st-quality'), cl: $('st-colour'), count: $('st-count'),
    bar: $('st-bar'), barN: $('st-bar-n'), barT: $('st-bar-t'), open: $('st-open'), ov: $('st-ov'), dr: $('st-dr'),
    scroll: $('st-scroll'), close: $('st-close'), demo: $('st-demo') };
  var state = { items: [], cart: [], loaded: false };
  var raastOn = !!(C.RAAST && C.RAAST.IBAN && C.RAAST.TITLE && C.RAAST.ID);

  var DEMO = [
    { code: 'DEMO-001', name: 'PV Suiting 65/35', composition: '65% polyester / 35% viscose', colour: 'Navy', length_m: 18, width_in: 58, price_pkr: 14400, image: '', status: 'available' },
    { code: 'DEMO-002', name: 'Poly Linen', composition: 'Sample composition', colour: 'Sand', length_m: 12, width_in: 58, price_pkr: 7800, image: '', status: 'available' },
    { code: 'DEMO-003', name: 'Cotton 112x84', composition: '100% cotton', colour: 'White', length_m: 25, width_in: 60, price_pkr: 11250, image: '', status: 'reserved' },
    { code: 'DEMO-004', name: 'PV Suiting 65/35', composition: '65% polyester / 35% viscose', colour: 'Charcoal', length_m: 20, width_in: 58, price_pkr: 16000, image: '', status: 'available' }
  ];

  /* ---------- utils ---------- */
  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }
  function money(n) { return 'Rs ' + Number(n).toLocaleString('en-PK'); }
  function ls(k, v) {
    try { if (v === undefined) { return JSON.parse(localStorage.getItem(k)); } localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; }
  }
  function imgSrc(it) {
    var im = String(it.image || '').trim();
    if (/^assets\/[\w\/.\-]+$/.test(im)) return im;
    var safe = String(it.code).replace(/[^\w\-]/g, '');
    if (!im && safe) return 'assets/stock/' + safe + '.webp';
    if (/^[\w.\-]+$/.test(im)) return 'assets/stock/' + im;
    return '';
  }
  function byCode(c) { for (var i = 0; i < state.items.length; i++) { if (state.items[i].code === c) return state.items[i]; } return null; }

  /* ---------- data ---------- */
  function fetchInventory() {
    if (!API) { els.demo.hidden = false; return Promise.resolve({ ok: true, items: DEMO }); }
    return fetch(API + (API.indexOf('?') > -1 ? '&' : '?') + 'action=inventory', { redirect: 'follow' })
      .then(function (r) { return r.json(); });
  }
  function load(showSkeleton) {
    var cached = !API ? null : ls('enzo_inv');
    if (cached && cached.items && !state.loaded) { state.items = cached.items; render(); }
    return fetchInventory().then(function (d) {
      if (!d || !d.ok) { throw new Error('bad'); }
      state.items = d.items; state.loaded = true; ls('enzo_inv', { items: d.items, t: Date.now() });
      pruneCart(); fillFilters(); render(); updateBar();
    }).catch(function () {
      if (!state.items.length) {
        els.grid.innerHTML = '<div class="st-msg" style="grid-column:1/-1">We could not load the stock list right now. Please try again, or <a href="https://wa.me/' + esc(C.WHATSAPP) + '" target="_blank" rel="noopener noreferrer" style="color:#1E3585;text-decoration:underline">message us on WhatsApp</a>.</div>';
      }
    });
  }
  function pruneCart() {
    state.cart = state.cart.filter(function (c) { var it = byCode(c); return it && it.status === 'available'; });
    ls('enzo_cart', state.cart);
  }

  /* ---------- listing ---------- */
  function fillFilters() {
    function uniq(k) { var s = {}; state.items.forEach(function (i) { if (i[k]) s[i[k]] = 1; }); return Object.keys(s).sort(); }
    function fill(sel, vals, keep) {
      sel.innerHTML = sel.options[0].outerHTML + vals.map(function (v) { return '<option>' + esc(v) + '</option>'; }).join('');
      sel.value = vals.indexOf(keep) > -1 ? keep : '';
    }
    fill(els.ql, uniq('name'), els.ql.value); fill(els.cl, uniq('colour'), els.cl.value);
  }
  function render() {
    var q = els.q.value.trim().toLowerCase(), ql = els.ql.value, cl = els.cl.value;
    var list = state.items.filter(function (i) {
      if (ql && i.name !== ql) return false; if (cl && i.colour !== cl) return false;
      if (q && (i.code + ' ' + i.name + ' ' + i.colour + ' ' + i.composition).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    els.count.textContent = list.length + (list.length === 1 ? ' piece' : ' pieces');
    if (!list.length) {
      els.grid.innerHTML = '<div class="st-empty" style="grid-column:1/-1">' + (state.items.length ? 'No pieces match your search.' : 'No finished pieces are listed right now. Please check back soon or <a href="index.html#contact" style="color:#1E3585;text-decoration:underline">request a quote</a>.') + '</div>';
      return;
    }
    els.grid.innerHTML = list.map(function (i) {
      var src = imgSrc(i), inCart = state.cart.indexOf(i.code) > -1, res = i.status !== 'available';
      var btn = res ? '<button class="st-btn" disabled>Reserved</button>' :
        '<button class="st-btn' + (inCart ? ' ghost' : '') + '" data-code="' + esc(i.code) + '">' + (inCart ? 'Remove from order' : 'Add to order') + '</button>';
      return '<article class="st-card"><div class="st-img' + (src ? '' : ' noimg') + '">' +
        (src ? '<img src="' + esc(src) + '" alt="' + esc(i.name + ', ' + i.colour + ', ' + i.length_m + ' metre piece') + '" width="400" height="300" loading="lazy" decoding="async">' : '') +
        '<span class="st-code">' + esc(i.code) + '</span></div>' +
        '<div class="st-body"><h3>' + esc(i.name) + ' — ' + esc(i.colour) + '</h3>' +
        '<p class="st-meta">' + esc(i.composition) + '</p>' +
        '<div class="st-specs"><span>' + esc(i.length_m) + ' m</span>' + (i.width_in ? '<span>' + esc(i.width_in) + ' in wide</span>' : '') + '</div>' +
        '<div class="st-price">' + money(i.price_pkr) + '</div>' + btn + '</div></article>';
    }).join('');
    // broken images -> pattern placeholder
    Array.prototype.forEach.call(els.grid.querySelectorAll('.st-img img'), function (im) {
      im.addEventListener('error', function () { im.parentNode.classList.add('noimg'); im.remove(); });
    });
  }

  /* ---------- cart ---------- */
  function total() { return state.cart.reduce(function (s, c) { var it = byCode(c); return s + (it ? Number(it.price_pkr) : 0); }, 0); }
  function updateBar() {
    var n = state.cart.length;
    els.barN.textContent = n + (n === 1 ? ' piece' : ' pieces'); els.barT.textContent = money(total());
    els.bar.classList.toggle('on', n > 0);
  }
  function toggle(code) {
    var i = state.cart.indexOf(code);
    if (i > -1) state.cart.splice(i, 1); else if (state.cart.length < 10) state.cart.push(code);
    ls('enzo_cart', state.cart); render(); updateBar();
  }
  els.grid.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-code]'); if (b) toggle(b.getAttribute('data-code'));
  });
  [els.q, els.ql, els.cl].forEach(function (x) { x.addEventListener('input', render); });

  /* ---------- drawer ---------- */
  function openDr() { drawCheckout(); els.dr.classList.add('on'); els.ov.classList.add('on'); els.dr.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; els.close.focus(); }
  function closeDr() { els.dr.classList.remove('on'); els.ov.classList.remove('on'); els.dr.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
  els.open.addEventListener('click', openDr); els.close.addEventListener('click', closeDr); els.ov.addEventListener('click', closeDr);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDr(); });

  function drawCheckout() {
    if (!state.cart.length) { els.scroll.innerHTML = '<p class="st-meta">Your order is empty. Add a piece to begin.</p>'; return; }
    var lines = state.cart.map(function (c) {
      var it = byCode(c); if (!it) return '';
      return '<div class="st-line"><span><b>' + esc(it.code) + '</b> · ' + esc(it.name) + ' ' + esc(it.colour) + ' · ' + esc(it.length_m) + ' m</span><span>' + money(it.price_pkr) +
        ' <button type="button" data-rm="' + esc(c) + '">remove</button></span></div>';
    }).join('');
    var saved = ls('enzo_cust') || {};
    els.scroll.innerHTML = '<div>' + lines + '</div><div class="st-total"><span>Total</span><span>' + money(total()) + '</span></div>' +
      '<form class="st-f" id="st-form" novalidate>' +
      '<label>Your name<input id="f-name" type="text" autocomplete="name" maxlength="80" value="' + esc(saved.name || '') + '" required></label>' +
      '<label>Phone / WhatsApp<input id="f-phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="20" placeholder="03xx xxxxxxx" value="' + esc(saved.phone || '') + '" required></label>' +
      '<label>Note (optional)<textarea id="f-note" rows="2" maxlength="300" placeholder="Pickup time, questions…"></textarea></label>' +
      '<div class="st-pay" role="radiogroup" aria-label="Payment"><label><input type="radio" name="pay" value="pay_at_shop" checked><span>Pay at shop when you collect<small>Pieces are held for ' + esc(C.HOLD_HOURS || 24) + ' hours.</small></span></label>' +
      (raastOn ? '<label><input type="radio" name="pay" value="raast"><span>Pay now by Raast transfer (free)<small>Bank details shown after you send the order.</small></span></label>' : '') + '</div>' +
      '<input class="st-hp" id="f-web" type="text" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<p class="st-err" id="st-err" role="alert"></p>' +
      '<button type="submit" class="st-btn" id="st-send">Send order</button></form>';
  }
  els.scroll.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-rm]'); if (b) { toggle(b.getAttribute('data-rm')); drawCheckout(); if (!state.cart.length) closeDr(); }
  });
  els.scroll.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('f-name').value.trim(), phone = $('f-phone').value.trim(), err = $('st-err'), btn = $('st-send');
    err.textContent = '';
    if (name.length < 2) { err.textContent = 'Please enter your name.'; return; }
    if (!/^[+0-9][0-9\s\-]{8,18}$/.test(phone)) { err.textContent = 'Please enter a valid phone number.'; return; }
    var pay = (document.querySelector('input[name=pay]:checked') || {}).value || 'pay_at_shop';
    var payload = { action: 'order', name: name, phone: phone, note: $('f-note').value, payment: pay, codes: state.cart.slice(), website: $('f-web').value };
    ls('enzo_cust', { name: name, phone: phone });
    if (!API) { done({ ok: true, orderId: 'ENZ-DEMO-0001', total: total(), holdHours: C.HOLD_HOURS || 24, payment: pay === 'raast' ? 'Raast transfer' : 'Pay at shop', items: state.cart.map(function (c) { var i = byCode(c); return { code: c, name: i.name, price_pkr: i.price_pkr }; }) }, payload); return; }
    btn.disabled = true; btn.textContent = 'Sending…';
    fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload), redirect: 'follow' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        btn.disabled = false; btn.textContent = 'Send order';
        if (d.ok) { done(d, payload); return; }
        var msg = {
          unavailable: 'Sorry — someone just reserved ' + (d.codes ? d.codes.join(', ') : 'a piece') + '. It has been removed from your order.',
          phone_invalid: 'Please check your phone number.', name_required: 'Please enter your name.',
          too_many_open_orders: 'You already have several open orders. Please collect them or message us on WhatsApp.',
          items_invalid: 'Please choose between 1 and 10 pieces.'
        }[d.error] || 'Something went wrong. Please try again or message us on WhatsApp.';
        err.textContent = msg;
        if (d.error === 'unavailable') { load().then(function () { drawCheckout(); $('st-err').textContent = msg; if (!state.cart.length) { setTimeout(closeDr, 2500); } }); }
      })
      .catch(function () {
        btn.disabled = false; btn.textContent = 'Send order';
        err.textContent = 'Could not reach the server. Please check your connection or message us on WhatsApp.';
      });
  });

  function done(d, p) {
    state.cart = []; ls('enzo_cart', []); updateBar();
    var items = (d.items || []).map(function (i) { return i.code; }).join(', ');
    var raast = d.payment === 'Raast transfer' && raastOn;
    var msg = 'Hi ENZO, my order ' + d.orderId + ' (' + items + ', ' + money(d.total) + ') — ' + (raast ? 'I have paid by Raast. Receipt attached.' : 'I will collect and pay at the shop.');
    var wa = 'https://wa.me/' + encodeURIComponent(C.WHATSAPP) + '?text=' + encodeURIComponent(msg);
    els.scroll.innerHTML = '<div class="st-ok"><p class="hm-eyebrow">Order received</p><div class="id">' + esc(d.orderId) + '</div>' +
      '<p>Your pieces are reserved for <b>' + esc(d.holdHours) + ' hours</b>. Total <b>' + money(d.total) + '</b>.</p>' +
      '<dl><dt>Pieces</dt><dd>' + esc(items) + '</dd><dt>Name</dt><dd>' + esc(p.name) + '</dd><dt>Payment</dt><dd>' + esc(d.payment) + '</dd></dl>' +
      (raast ? '<dl><dt>Account title</dt><dd>' + esc(C.RAAST.TITLE) + '</dd><dt>IBAN</dt><dd>' + esc(C.RAAST.IBAN) + '</dd><dt>Raast ID</dt><dd>' + esc(C.RAAST.ID) + '</dd><dt>Reference</dt><dd>' + esc(d.orderId) + '</dd></dl><p class="st-meta">Send the exact total from any bank or wallet app that supports Raast, using the order number as the reference. Then send us the receipt on WhatsApp.</p>' :
        '<p class="st-meta">Collect from <b>' + esc(C.PICKUP || 'our shop') + '</b>. Show this order number at the counter.</p>') +
      '<a class="st-btn" href="' + wa + '" target="_blank" rel="noopener noreferrer">Confirm on WhatsApp</a>' +
      '<button type="button" class="st-btn ghost" id="st-again">Keep browsing</button></div>';
    $('st-again').addEventListener('click', function () { closeDr(); load(); });
    load();
  }

  state.cart = ls('enzo_cart') || [];
  load(true);
  setInterval(function () { if (!document.hidden && API) load(); }, 60000);
})();
