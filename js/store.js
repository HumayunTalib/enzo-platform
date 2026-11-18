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

  var STOCK = [
    { code: 'MOSES-001', name: 'MOSES', composition: 'PV Blend', colour: 'Teal', length_m: null, width_in: null, price_pkr: 3969, image: '', status: 'available' },
    { code: 'MOSES-002', name: 'MOSES', composition: 'PV Blend', colour: 'Navy', length_m: null, width_in: null, price_pkr: 3969, image: '', status: 'available' },
    { code: 'MOSES-003', name: 'MOSES', composition: 'PV Blend', colour: 'Black', length_m: null, width_in: null, price_pkr: 3969, image: '', status: 'available' },
    { code: 'MOSES-004', name: 'MOSES', composition: 'PV Blend', colour: 'Plum', length_m: null, width_in: null, price_pkr: 3969, image: '', status: 'available' },
    { code: 'MOSES-005', name: 'MOSES', composition: 'PV Blend', colour: 'Forest Green', length_m: null, width_in: null, price_pkr: 3969, image: '', status: 'available' },
    { code: 'MOSES-006', name: 'MOSES', composition: 'PV Blend', colour: 'Brown', length_m: null, width_in: null, price_pkr: 3969, image: '', status: 'available' },
    { code: 'MOSES-007', name: 'MOSES', composition: 'PV Blend', colour: 'Royal Blue', length_m: null, width_in: null, price_pkr: 3969, image: '', status: 'available' }
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
    if (!API) { els.demo.hidden = false; return Promise.resolve({ ok: true, items: STOCK }); }
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
        (src ? '<img src="' + esc(src) + '" alt="' + esc(i.name + ', ' + i.colour + ' ' + i.composition + ' fabric') + '" width="400" height="300" loading="lazy" decoding="async">' : '') +
        '<span class="st-code">' + esc(i.code) + '</span></div>' +
        '<div class="st-body"><h3>' + esc(i.name) + ' — ' + esc(i.colour) + '</h3>' +
        '<p class="st-meta">' + esc(i.composition) + '</p>' +
        '<div class="st-specs">' + (i.length_m ? '<span>' + esc(i.length_m) + ' m</span>' : '') + (i.width_in ? '<span>' + esc(i.width_in) + ' in wide</span>' : '') + '<span>Delivery nationwide</span></div>' +
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
      return '<div class="st-line"><span><b>' + esc(it.code) + '</b> · ' + esc(it.name) + ' ' + esc(it.colour) + '</span><span>' + money(it.price_pkr) +
        ' <button type="button" data-rm="' + esc(c) + '">remove</button></span></div>';
    }).join('');
    var saved = ls('enzo_cust') || {};
    els.scroll.innerHTML = '<div>' + lines + '</div><div class="st-total"><span>Total</span><span>' + money(total()) + '</span></div>' +
      '<form class="st-f" id="st-form" novalidate>' +
      '<label>Your name<input id="f-name" type="text" autocomplete="name" maxlength="80" value="' + esc(saved.name || '') + '" required></label>' +
      '<label>Phone / WhatsApp<input id="f-phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="20" placeholder="03xx xxxxxxx" value="' + esc(saved.phone || '') + '" required></label>' +
      '<div class="st-pay" role="radiogroup" aria-label="Delivery"><label><input type="radio" name="dlv" value="delivery" checked><span>Delivery nationwide<small>' + esc(C.DELIVERY_NOTE || 'Delivery across Pakistan.') + '</small></span></label>' +
      '<label><input type="radio" name="dlv" value="pickup"><span>Pick up from our shop<small>' + esc(C.PICKUP || '') + '</small></span></label></div>' +
      '<div id="f-addr-wrap"><label>Full delivery address<textarea id="f-addr" rows="2" maxlength="200" autocomplete="street-address" placeholder="House / street / area">' + esc(saved.address || '') + '</textarea></label>' +
      '<label style="margin-top:12px">City<input id="f-city" type="text" autocomplete="address-level2" maxlength="60" value="' + esc(saved.city || '') + '"></label></div>' +
      '<label>Note (optional)<textarea id="f-note" rows="2" maxlength="300" placeholder="Questions, preferred courier…"></textarea></label>' +
      '<div class="st-pay" id="f-payopts" role="radiogroup" aria-label="Payment"><label><input type="radio" name="pay" value="transfer" checked><span>Bank / Raast / mobile-wallet transfer<small>Account details and the screenshot upload button appear after you place the order.</small></span></label>' +
      '<label id="f-shoppay" hidden><input type="radio" name="pay" value="pay_at_shop"><span>Pay at shop when you collect<small>Pieces are held for ' + esc(C.HOLD_HOURS || 24) + ' hours.</small></span></label></div>' +
      '<input class="st-hp" id="f-web" type="text" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<p class="st-err" id="st-err" role="alert"></p>' +
      '<button type="submit" class="st-btn" id="st-send">Place order</button></form>';
    syncDlv();
  }
  function syncDlv() {
    var pick = (document.querySelector('input[name=dlv]:checked') || {}).value === 'pickup', w = $('f-addr-wrap'), sp = $('f-shoppay');
    if (!w) return;
    w.hidden = pick; sp.hidden = !pick;
    if (!pick && (document.querySelector('input[name=pay]:checked') || {}).value === 'pay_at_shop') document.querySelector('input[name=pay][value=transfer]').checked = true;
  }
  els.scroll.addEventListener('change', function (e) { if (e.target.name === 'dlv') syncDlv(); });
  els.scroll.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-rm]'); if (b) { toggle(b.getAttribute('data-rm')); drawCheckout(); if (!state.cart.length) closeDr(); }
  });
  function localId() { var d = new Date(), p = function (n) { return ('0' + n).slice(-2); }; return 'ENZ-' + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + '-' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds()); }
  els.scroll.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('f-name').value.trim(), phone = $('f-phone').value.trim(), err = $('st-err'), btn = $('st-send');
    err.textContent = '';
    if (name.length < 2) { err.textContent = 'Please enter your name.'; return; }
    if (!/^[+0-9][0-9\s\-]{8,18}$/.test(phone)) { err.textContent = 'Please enter a valid phone number.'; return; }
    var dlv = (document.querySelector('input[name=dlv]:checked') || {}).value || 'delivery';
    var pay = dlv === 'pickup' ? ((document.querySelector('input[name=pay]:checked') || {}).value || 'transfer') : 'transfer';
    var addr = $('f-addr').value.trim(), city = $('f-city').value.trim();
    if (dlv === 'delivery' && (addr.length < 5 || city.length < 2)) { err.textContent = 'Please enter your full delivery address and city.'; return; }
    var payload = { action: 'order', name: name, phone: phone, note: $('f-note').value, payment: pay, delivery: dlv, address: addr, city: city, codes: state.cart.slice(), website: $('f-web').value };
    ls('enzo_cust', { name: name, phone: phone, address: addr, city: city });
    if (!API) { done({ ok: true, orderId: localId(), total: total(), holdHours: C.HOLD_HOURS || 24, payment: pay === 'pay_at_shop' ? 'Pay at shop' : 'Bank / Raast transfer', delivery: dlv === 'pickup' ? 'Pickup' : 'Nationwide delivery', items: state.cart.map(function (c) { var i = byCode(c); return { code: c, name: i.name, price_pkr: i.price_pkr }; }) }, payload); return; }
    btn.disabled = true; btn.textContent = 'Placing order…';
    fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload), redirect: 'follow' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        btn.disabled = false; btn.textContent = 'Place order';
        if (d.ok) { done(d, payload); return; }
        var msg = {
          unavailable: 'Sorry — someone just reserved ' + (d.codes ? d.codes.join(', ') : 'a piece') + '. It has been removed from your order.',
          address_required: 'Please enter your full delivery address and city.', phone_invalid: 'Please check your phone number.', name_required: 'Please enter your name.',
          too_many_open_orders: 'You already have several open orders. Please collect them or message us on WhatsApp.',
          items_invalid: 'Please choose between 1 and 10 pieces.'
        }[d.error] || 'Something went wrong. Please try again or message us on WhatsApp.';
        err.textContent = msg;
        if (d.error === 'unavailable') { load().then(function () { drawCheckout(); $('st-err').textContent = msg; if (!state.cart.length) { setTimeout(closeDr, 2500); } }); }
      })
      .catch(function () {
        btn.disabled = false; btn.textContent = 'Place order';
        err.textContent = 'Could not reach the server. Please check your connection or message us on WhatsApp.';
      });
  });

  function done(d, p) {
    state.cart = []; ls('enzo_cart', []); updateBar();
    var list = d.items || [];
    var items = list.map(function (i) { return i.code; }).join(', ');
    var shop = d.payment === 'Pay at shop';
    var deliver = d.delivery !== 'Pickup';
    var P = C.PAY || {}, hasPay = !!(P.ACCOUNT || P.IBAN || (C.RAAST && C.RAAST.IBAN));
    var wa = function (text) { return 'https://wa.me/' + encodeURIComponent(C.WHATSAPP) + '?text=' + encodeURIComponent(text); };
    var lines = list.map(function (i) { return '• ' + i.code + ' ' + i.name + ' — ' + money(i.price_pkr); }).join('\n');
    var base = 'Order ' + d.orderId + '\n' + lines + '\nTotal: ' + money(d.total) + '\nName: ' + p.name + '\nPhone: ' + p.phone + '\n' +
      (deliver ? 'Deliver to: ' + (p.address || '') + ', ' + (p.city || '') : 'Pick up from shop');
    var msgPay = 'Hi ENZO, I have paid for my order.\n' + base + '\n(Payment screenshot attached below)';
    var msgShop = 'Hi ENZO, I placed this order and will pay at the shop.\n' + base;
    var rows = '<dt>Pieces</dt><dd>' + esc(items) + '</dd><dt>Total</dt><dd><b>' + money(d.total) + '</b></dd><dt>Name</dt><dd>' + esc(p.name) + '</dd>' +
      '<dt>' + (deliver ? 'Deliver to' : 'Pickup') + '</dt><dd>' + (deliver ? esc((p.address || '') + ', ' + (p.city || '')) : esc(C.PICKUP || 'our shop')) + '</dd>';
    var h = '<div class="st-ok"><p class="hm-eyebrow">' + (API ? 'Order received' : 'Order ready') + '</p><div class="id">' + esc(d.orderId) + '</div>' +
      (API ? '<p>Your pieces are reserved for <b>' + esc(d.holdHours) + ' hours</b>' + (shop ? '.' : ' — pay within that time to confirm them.') + '</p>' : '<p>Follow the steps below so we receive your order.</p>') + '<dl>' + rows + '</dl>';
    if (shop) {
      h += '<p class="st-meta">Show the order number at the counter. Pay when you collect.</p>' +
        '<a class="st-btn" href="' + wa(msgShop) + '" target="_blank" rel="noopener noreferrer">Confirm on WhatsApp</a>';
    } else {
      h += '<div class="st-step"><span>1</span><div><b>Pay ' + money(d.total) + '</b>' +
        (hasPay ? '<dl>' + (P.TITLE || (C.RAAST && C.RAAST.TITLE) ? '<dt>Account title</dt><dd>' + esc(P.TITLE || C.RAAST.TITLE) + '</dd>' : '') +
          (P.BANK ? '<dt>Bank</dt><dd>' + esc(P.BANK) + '</dd>' : '') + (P.ACCOUNT ? '<dt>Account no.</dt><dd>' + esc(P.ACCOUNT) + '</dd>' : '') +
          (P.IBAN || (C.RAAST && C.RAAST.IBAN) ? '<dt>IBAN</dt><dd>' + esc(P.IBAN || C.RAAST.IBAN) + '</dd>' : '') +
          (C.RAAST && C.RAAST.ID ? '<dt>Raast ID</dt><dd>' + esc(C.RAAST.ID) + '</dd>' : '') + '<dt>Reference</dt><dd>' + esc(d.orderId) + '</dd></dl>' :
          '<p class="st-meta">Our account details will be sent to you on WhatsApp — tap the button below.</p>') + '</div></div>' +
        '<div class="st-step"><span>2</span><div><b>Send the payment screenshot</b><p class="st-meta">Tap the button. WhatsApp opens with your order details ready. Then tap the <b>📎 attach</b> icon in WhatsApp, choose your screenshot, and send.</p></div></div>' +
        '<a class="st-btn st-up" href="' + wa(hasPay ? msgPay : 'Hi ENZO, please send payment details for my order.\n' + base) + '" target="_blank" rel="noopener noreferrer"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.4 11.1l-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5"/></svg>Upload payment screenshot on WhatsApp</a>' +
        '<div class="st-step"><span>3</span><div><b>We confirm and dispatch</b><p class="st-meta">Once we verify your payment we message you on WhatsApp' + (deliver ? ' with courier tracking.' : ' and keep your pieces ready.') + '</p></div></div>';
    }
    h += '<button type="button" class="st-btn ghost" id="st-again">Keep browsing</button></div>';
    els.scroll.innerHTML = h;
    $('st-again').addEventListener('click', function () { closeDr(); load(); });
    load();
  }

  state.cart = ls('enzo_cart') || [];
  load(true);
  setInterval(function () { if (!document.hidden && API) load(); }, 60000);
})();
