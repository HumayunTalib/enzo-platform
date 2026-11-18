/* ENZO ready-stock store. No dependencies. Talks to the Google Apps Script web app set in store-config.js */
(function () {
  'use strict';
  var C = window.ENZO_STORE || {};
  var API = C.API || '';
  var $ = function (id) { return document.getElementById(id); };
  var els = { lots: $('st-lots'), listv: $('st-list'), detail: $('st-detail'), count: $('st-count'),
    bar: $('st-bar'), barN: $('st-bar-n'), barT: $('st-bar-t'), open: $('st-open'), ov: $('st-ov'), dr: $('st-dr'),
    scroll: $('st-scroll'), close: $('st-close'), demo: $('st-demo') };
  var ARTICLES = window.ENZO_ARTICLES || [];
  var state = { items: [], cart: [], loaded: false, slug: '', sel: 0, photo: false };
  var raastOn = !!(C.RAAST && C.RAAST.IBAN && C.RAAST.TITLE && C.RAAST.ID);

  var STOCK = [];
  ARTICLES.forEach(function (a) {
    (a.colours || []).forEach(function (c) {
      var q = ''; (a.specs || []).forEach(function (x) { if (x[0] === 'Quality') q = x[1]; });
      STOCK.push({ code: c.code, name: a.name, composition: q, colour: c.name, length_m: null, width_in: null, price_pkr: a.price_pkr, image: c.image || '', status: 'available' });
    });
  });

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
      pruneCart(); render(); updateBar();
    }).catch(function () {
      if (!state.items.length) {
        els.lots.innerHTML = '<li class="st-msg">We could not load the stock list right now. Please try again, or <a href="https://wa.me/' + esc(C.WHATSAPP) + '" target="_blank" rel="noopener noreferrer" style="color:#1E3585;text-decoration:underline">message us on WhatsApp</a>.</li>';
      }
    });
  }
  function pruneCart() {
    state.cart = state.cart.filter(function (c) { var it = byCode(c); return it && it.status === 'available'; });
    ls('enzo_cart', state.cart);
  }

  /* ---------- articles ---------- */
  function artBySlug(sl) { for (var i = 0; i < ARTICLES.length; i++) { if (ARTICLES[i].slug === sl) return ARTICLES[i]; } return null; }
  function colourInfo(a, c) {
    var it = byCode(c.code);
    if (API && !state.loaded) return { ok: false, label: 'Checking stock…', price: a.price_pkr };
    if (!it) return { ok: false, label: 'Not in stock', price: a.price_pkr };
    return { ok: it.status === 'available', label: it.status === 'available' ? 'In stock' : (it.status === 'reserved' ? 'Reserved' : 'Not in stock'), price: it.price_pkr };
  }
  function renderList() {
    els.count.textContent = ARTICLES.length + (ARTICLES.length === 1 ? ' article' : ' articles');
    els.lots.innerHTML = ARTICLES.map(function (a, n) {
      var n2 = ('0' + (n + 1)).slice(-2);
      var meta = a.demo ? '<span class="st-tag">Sample listing</span>' : '<span>' + esc(a.summary || '') + '</span>' + (a.colours.length ? '<span>' + a.colours.length + ' colours</span>' : '');
      return '<li><a class="st-lot' + (a.demo ? ' demo' : '') + '" href="#' + esc(a.slug) + '"><span class="st-n">' + n2 + '</span>' +
        '<span class="st-main-t"><span class="st-lotid">' + esc(a.lot || '') + '</span><span class="st-name">' + esc(a.name) + '</span></span>' +
        '<span class="st-lmeta">' + meta + '</span><span class="st-arr" aria-hidden="true">→</span></a></li>';
    }).join('');
  }
  function renderDetail(a) {
    var cols = a.colours || [], sel = cols[state.sel] || null, info = sel ? colourInfo(a, sel) : null;
    var inCart = sel && state.cart.indexOf(sel.code) > -1;
    var specs = (a.specs || []).map(function (x) { return '<div><dt>' + esc(x[0]) + '</dt><dd>' + esc(x[1]) + '</dd></div>'; }).join('');
    var desc = (a.description || []).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
    var swatches = cols.map(function (c, i) {
      var ci = colourInfo(a, c);
      return '<button type="button" class="st-sw' + (i === state.sel ? ' on' : '') + (ci.ok ? '' : ' off') + '" data-sw="' + i + '" role="radio" aria-checked="' + (i === state.sel) + '" aria-label="' + esc(c.name) + (ci.ok ? '' : ', ' + ci.label) + '" title="' + esc(c.name) + '"><i style="background:' + esc(c.hex || '#999') + '"></i><span>' + esc(c.name) + '</span></button>';
    }).join('');
    var panelStyle = sel ? ' style="background:' + esc(sel.hex || '#999') + '"' : '';
    var photo = sel && sel.image && state.photo ? '<img src="' + esc(sel.image) + '" alt="' + esc(a.name + ' ' + sel.name + ' fabric') + '" width="800" height="600">' : '';
    var h = '<a class="st-back" href="#">← All articles</a>' +
      '<div class="st-dgrid"><div class="st-dleft">' +
      '<p class="st-lotid">' + esc(a.lot || '') + (a.demo ? ' <span class="st-tag">Sample listing</span>' : '') + '</p>' +
      '<h2 class="st-dname">' + esc(a.name) + '</h2>' + '<div class="st-desc">' + desc + '</div>' +
      '<dl class="st-spec">' + specs + '</dl>' +
      ((a.reading && a.reading.length) ? '<div class="st-read"><p class="st-lotid">Related reading</p><ul>' + a.reading.map(function (r) { return '<li><a href="' + esc(r.href) + '">' + esc(r.title) + '</a></li>'; }).join('') + '</ul></div>' : '') + '</div>' +
      '<div class="st-dright">' +
      (cols.length ? '<div class="st-panel"' + panelStyle + '>' + photo + '<span class="st-panel-n">' + esc(sel.name) + '</span></div>' +
        '<p class="st-sel"><span>Colour</span> <b>' + esc(sel.name) + '</b> <em>' + esc(info.label) + '</em></p>' +
        '<div class="st-sws" role="radiogroup" aria-label="Colour">' + swatches + '</div>' +
        (sel.image ? '<button type="button" class="st-link" data-photo="1">' + (state.photo ? 'Hide fabric photo' : 'View fabric photo') + '</button>' : '') +
        '<p class="st-note">Swatch colour is indicative. Please view the fabric photo, or ask us on WhatsApp, to confirm the shade.</p>' +
        '<div class="st-buy"><div class="st-price">' + money(info.price) + '</div>' +
        '<button type="button" class="st-btn' + (inCart ? ' ghost' : '') + '" data-add="' + esc(sel.code) + '"' + (info.ok ? '' : ' disabled') + '>' + (inCart ? 'Remove from order' : (info.ok ? 'Add ' + esc(sel.name) + ' to order' : esc(info.label))) + '</button></div>'
        : '<div class="st-panel empty"><span class="st-panel-n">Colours to be announced</span></div>' +
        '<p class="st-note">Colours and availability for this article will be added soon.</p>' +
        '<a class="st-btn ghost" href="https://wa.me/' + esc(C.WHATSAPP) + '?text=' + encodeURIComponent('Hi ENZO, I would like details about ' + a.name + '.') + '" target="_blank" rel="noopener noreferrer">Ask about this article</a>') +
      '</div></div>';
    els.detail.innerHTML = h;
  }
  function render() {
    var a = artBySlug(state.slug);
    els.listv.hidden = !!a; els.detail.hidden = !a;
    if (a) renderDetail(a); else renderList();
  }
  function route() {
    var sl = decodeURIComponent((location.hash || '').replace(/^#\/?/, ''));
    var a = artBySlug(sl);
    state.slug = a ? sl : ''; state.sel = 0; state.photo = false;
    render();
    if (a) document.title = a.name + ' — Ready Stock | ENZO Textiles';
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  els.detail.addEventListener('click', function (e) {
    var a = artBySlug(state.slug); if (!a) return;
    var sw = e.target.closest('button[data-sw]'), ad = e.target.closest('button[data-add]'), ph = e.target.closest('button[data-photo]');
    if (sw) { state.sel = Number(sw.getAttribute('data-sw')); state.photo = false; render(); var n = els.detail.querySelector('.st-sw.on'); if (n) n.focus(); }
    else if (ad) { toggle(ad.getAttribute('data-add')); }
    else if (ph) { state.photo = !state.photo; render(); }
  });

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
  route();
  load(true);
  setInterval(function () { if (!document.hidden && API) load(); }, 60000);
})();
