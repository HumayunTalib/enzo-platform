/* ============================================================
   ENZO — retail selection cart.
   localStorage-backed list of fabric codes that funnels into a
   single pre-filled WhatsApp message. Storage key and the
   RAQI_PRODUCTS global are pre-merge internal names; neither is
   ever shown to a visitor.
   ============================================================ */

var EnzoCart = (function () {
  'use strict';

  var KEY = 'raqi_cart_v1';
  var VERSION = 1;
  var listeners = [];

  var storageOK = (function () {
    try {
      if (typeof localStorage === 'undefined') return false;
      localStorage.setItem('__enzo_t__', '1');
      localStorage.removeItem('__enzo_t__');
      return true;
    } catch (e) { return false; }
  })();

  var memory = { version: VERSION, items: [] };

  function read() {
    if (!storageOK) return memory;
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return { version: VERSION, items: [] };
      var parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== VERSION || !Array.isArray(parsed.items)) {
        return { version: VERSION, items: [] };
      }
      // Shape-validate: codes only. Never trust what's in storage.
      return { version: VERSION, items: parsed.items.filter(function (c) { return typeof c === 'string'; }) };
    } catch (e) {
      return { version: VERSION, items: [] };
    }
  }

  function write(cart) {
    if (!storageOK) { memory = cart; notify(); return; }
    try { localStorage.setItem(KEY, JSON.stringify(cart)); }
    catch (e) { /* quota or private mode — cart just won't persist */ }
    notify();
  }

  function notify() {
    var cart = read();
    listeners.forEach(function (fn) { fn(cart); });
  }

  if (storageOK) {
    window.addEventListener('storage', function (e) { if (e.key === KEY) notify(); });
  }

  return {
    get: read,
    has: function (code) { return read().items.indexOf(code) !== -1; },
    toggle: function (code) {
      var cart = read();
      var i = cart.items.indexOf(code);
      if (i === -1) cart.items.push(code); else cart.items.splice(i, 1);
      write(cart);
      return i === -1;
    },
    remove: function (code) {
      var cart = read();
      var i = cart.items.indexOf(code);
      if (i !== -1) { cart.items.splice(i, 1); write(cart); }
    },
    onChange: function (fn) { listeners.push(fn); }
  };
})();

/* ── Cart UI ── */
(function () {
  'use strict';

  var PHONE = '923218230266';
  var ICON_ADD   = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>';
  var ICON_ADDED = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var bar      = document.getElementById('cart-bar');
  var count    = document.getElementById('cart-count');
  var view     = document.getElementById('cart-view');
  var drawer   = document.getElementById('cart-drawer');
  var backdrop = document.getElementById('cart-backdrop');
  var closeBtn = document.getElementById('cart-close');
  var itemsBox = document.getElementById('cart-items');
  var sendBtn  = document.getElementById('cart-drawer-send');

  if (!bar && !drawer) return;

  function productByCode(code) {
    if (typeof PRODUCTS === 'undefined') return null;
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].name === code) return PRODUCTS[i];
    }
    return null;
  }

  function renderItems(items) {
    if (!itemsBox) return;
    if (!items.length) {
      itemsBox.innerHTML = '<p class="cart-drawer-empty">No fabrics selected yet.</p>';
      return;
    }
    itemsBox.innerHTML = items.map(function (code) {
      var p = productByCode(code) || {};
      return '<div class="cart-item">' +
        '<div class="cart-item-thumb"><img src="' + (p.image || '') + '" alt="" loading="lazy" onerror="this.style.display=\'none\'"></div>' +
        '<div class="cart-item-info"><div class="cart-item-name">' + code + '</div>' +
        '<div class="cart-item-sub">' + (p.id || '') + '</div></div>' +
        '<button type="button" class="cart-item-remove" data-code="' + code + '" aria-label="Remove ' + code + ' from selection">&times;</button>' +
        '</div>';
    }).join('');
  }

  function render() {
    var items = EnzoCart.get().items;
    if (count) count.textContent = items.length;
    if (bar) bar.classList.toggle('visible', items.length > 0);
    document.body.classList.toggle('has-cart', items.length > 0);
    renderItems(items);

    if (sendBtn && items.length) {
      var msg = 'Hello ENZO, I would like more details on: ' + items.join(', ') + '.';
      sendBtn.href = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg);
    }

    // Quick-add buttons can be re-rendered by the shop filter, so sync
    // every button's state from the cart rather than tracking it locally.
    document.querySelectorAll('.quickadd').forEach(function (btn) {
      var added = items.indexOf(btn.getAttribute('data-code')) !== -1;
      btn.innerHTML = added ? ICON_ADDED : ICON_ADD;
      btn.classList.toggle('is-added', added);
      btn.setAttribute('aria-label', (added ? 'Remove ' : 'Add ') + btn.getAttribute('data-code') + (added ? ' from selection' : ' to selection'));
    });
  }

  // Delegated so it survives grid re-renders
  document.addEventListener('click', function (e) {
    var add = e.target.closest('.quickadd');
    if (add) { EnzoCart.toggle(add.getAttribute('data-code')); return; }
    var rm = e.target.closest('.cart-item-remove');
    if (rm) EnzoCart.remove(rm.getAttribute('data-code'));
  });

  if (view && drawer && backdrop) {
    var setOpen = function (open) {
      drawer.classList.toggle('open', open);
      backdrop.classList.toggle('visible', open);
      drawer.setAttribute('aria-hidden', String(!open));
      if (open && closeBtn) closeBtn.focus(); else view.focus();
    };
    view.addEventListener('click', function () { setOpen(true); });
    if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); });
    backdrop.addEventListener('click', function () { setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) setOpen(false);
    });
  }

  EnzoCart.onChange(render);
  render();
  window.EnzoCartUI = { refresh: render };
})();
