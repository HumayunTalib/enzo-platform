/**
 * ENZO Ready-Stock Store — Google Apps Script backend
 * -----------------------------------------------------
 * Bound to a Google Sheet with three tabs: Inventory, Orders, Sales.
 * Deploy as Web app: Execute as "Me", access "Anyone". Put the Web app URL in js/store-config.js.
 * Set the admin PIN in Project Settings > Script properties: ADMIN_PIN = your PIN.
 */
var CFG = {
  HOLD_HOURS: 24,          // unpaid online reservations are released after this many hours
  MAX_ITEMS: 10,           // pieces per order
  MAX_OPEN_PER_PHONE: 3,   // open (New) orders per phone number — stops stock hoarding
  OWNER_EMAIL: ''          // leave empty to use the account that owns the script
};
var INV = 'Inventory', ORD = 'Orders', SALES = 'Sales';
var INV_COLS = ['code', 'name', 'composition', 'colour', 'length_m', 'width_in', 'price_pkr', 'image', 'status', 'reserved_at', 'order_id', 'notes'];
var ORD_COLS = ['order_id', 'created_at', 'name', 'phone', 'items', 'total_pkr', 'payment', 'status', 'note', 'delivery', 'address', 'city'];
var SALES_COLS = ['sold_at', 'code', 'name', 'price_pkr', 'buyer', 'source'];

/* ---------------- helpers ---------------- */
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
function sheet_(name, cols) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); }
  if (sh.getLastRow() === 0) { sh.getRange(1, 1, 1, cols.length).setValues([cols]); sh.setFrozenRows(1); }
  return sh;
}
function clean_(v, max) {           // trim, cap length, block spreadsheet-formula injection
  var s = String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max || 200);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}
function readAll_(sh, cols) {
  var last = sh.getLastRow();
  if (last < 2) return [];
  var vals = sh.getRange(2, 1, last - 1, cols.length).getValues();
  return vals.map(function (r, i) {
    var o = { _row: i + 2 };
    cols.forEach(function (c, j) { o[c] = r[j]; });
    return o;
  });
}
function setRow_(sh, row, cols, obj) {
  var vals = cols.map(function (c) { return obj[c] == null ? '' : obj[c]; });
  sh.getRange(row, 1, 1, cols.length).setValues([vals]);
}
function now_() { return new Date(); }
function cache_() { return CacheService.getScriptCache(); }
function bust_() { cache_().remove('inv'); }
function pubItem_(o) {
  return {
    code: String(o.code), name: o.name, composition: o.composition, colour: o.colour,
    length_m: o.length_m === '' || o.length_m == null ? null : Number(o.length_m), width_in: o.width_in === '' ? null : Number(o.width_in),
    price_pkr: Number(o.price_pkr), image: o.image || '', status: o.status
  };
}
function ownerEmail_() { return CFG.OWNER_EMAIL || Session.getEffectiveUser().getEmail(); }

/* ---------------- expiry of unpaid holds ---------------- */
function releaseExpired_() {            // call while holding the script lock
  var inv = readAll_(sheet_(INV, INV_COLS), INV_COLS);
  var osh = sheet_(ORD, ORD_COLS), ords = readAll_(osh, ORD_COLS);
  var status = {}; ords.forEach(function (o) { status[o.order_id] = o.status; });
  var cutoff = now_().getTime() - CFG.HOLD_HOURS * 3600 * 1000;
  var expired = {}, ish = sheet_(INV, INV_COLS), changed = false;
  inv.forEach(function (it) {
    if (it.status === 'reserved' && it.reserved_at && new Date(it.reserved_at).getTime() < cutoff && status[it.order_id] === 'New') {
      expired[it.order_id] = true;
      it.status = 'available'; it.reserved_at = ''; it.order_id = '';
      setRow_(ish, it._row, INV_COLS, it); changed = true;
    }
  });
  ords.forEach(function (o) {
    if (expired[o.order_id]) { o.status = 'Expired'; setRow_(osh, o._row, ORD_COLS, o); }
  });
  if (changed) bust_();
}

/* ---------------- GET: public inventory ---------------- */
function doGet(e) {
  var a = (e && e.parameter && e.parameter.action) || 'inventory';
  if (a === 'ping') return json_({ ok: true });
  if (a !== 'inventory') return json_({ ok: false, error: 'unknown_action' });
  var c = cache_().get('inv');
  if (c) return ContentService.createTextOutput(c).setMimeType(ContentService.MimeType.JSON);
  var lock = LockService.getScriptLock();
  if (lock.tryLock(3000)) { try { releaseExpired_(); } finally { lock.releaseLock(); } }
  var items = readAll_(sheet_(INV, INV_COLS), INV_COLS)
    .filter(function (o) { return o.code !== '' && (o.status === 'available' || o.status === 'reserved'); })
    .map(pubItem_);
  var out = JSON.stringify({ ok: true, items: items, updated: now_().toISOString() });
  cache_().put('inv', out, 20);
  return ContentService.createTextOutput(out).setMimeType(ContentService.MimeType.JSON);
}

/* ---------------- POST ---------------- */
function doPost(e) {
  var d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'bad_request' }); }
  try {
    if (d.action === 'order') return json_(placeOrder_(d));
    if (String(d.action).indexOf('admin_') === 0) return json_(admin_(d));
  } catch (err) {
    return json_({ ok: false, error: 'server_error' });
  }
  return json_({ ok: false, error: 'unknown_action' });
}

function placeOrder_(d) {
  if (d.website) return { ok: false, error: 'rejected' };                       // honeypot
  var name = clean_(d.name, 80), phone = String(d.phone == null ? '' : d.phone).trim().slice(0, 20), note = clean_(d.note, 300);
  var delivery = d.delivery === 'pickup' ? 'Pickup' : 'Nationwide delivery';
  var address = clean_(d.address, 200), city = clean_(d.city, 60);
  var method = delivery === 'Pickup' && d.payment === 'pay_at_shop' ? 'Pay at shop' : 'Bank / Raast transfer';
  var codes = (d.codes || []).map(function (c) { return clean_(c, 40); }).filter(String);
  var uniq = {}; codes = codes.filter(function (c) { return uniq[c] ? false : (uniq[c] = true); });
  if (name.length < 2) return { ok: false, error: 'name_required' };
  if (!/^[+0-9][0-9\s\-]{8,18}$/.test(phone)) return { ok: false, error: 'phone_invalid' };
  if (delivery !== 'Pickup' && (address.length < 5 || city.length < 2)) return { ok: false, error: 'address_required' };
  if (codes.length < 1 || codes.length > CFG.MAX_ITEMS) return { ok: false, error: 'items_invalid' };
  var digits = phone.replace(/\D/g, '');

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    releaseExpired_();
    var ish = sheet_(INV, INV_COLS), osh = sheet_(ORD, ORD_COLS);
    var ords = readAll_(osh, ORD_COLS);
    var open = ords.filter(function (o) { return o.status === 'New' && String(o.phone).replace(/\D/g, '') === digits; }).length;
    if (open >= CFG.MAX_OPEN_PER_PHONE) return { ok: false, error: 'too_many_open_orders' };

    var inv = readAll_(ish, INV_COLS), byCode = {};
    inv.forEach(function (o) { byCode[String(o.code)] = o; });
    var bad = codes.filter(function (c) { return !byCode[c] || byCode[c].status !== 'available'; });
    if (bad.length) return { ok: false, error: 'unavailable', codes: bad };       // nothing is changed

    var props = PropertiesService.getScriptProperties();
    var seq = Number(props.getProperty('ORDER_SEQ') || 0) + 1; props.setProperty('ORDER_SEQ', String(seq));
    var tz = Session.getScriptTimeZone();
    var orderId = 'ENZ-' + Utilities.formatDate(now_(), tz, 'yyMMdd') + '-' + ('000' + seq).slice(-4);
    var total = 0, lines = [];
    codes.forEach(function (c) {
      var it = byCode[c]; total += Number(it.price_pkr);
      it.status = 'reserved'; it.reserved_at = now_(); it.order_id = orderId;
      setRow_(ish, it._row, INV_COLS, it);
      lines.push({ code: c, name: it.name, price_pkr: Number(it.price_pkr) });
    });
    setRow_(osh, osh.getLastRow() + 1, ORD_COLS, {
      order_id: orderId, created_at: now_(), name: name, phone: "'" + phone, items: codes.join(', '),
      total_pkr: total, payment: method, status: 'New', note: note,
      delivery: delivery, address: address, city: city
    });
    bust_();
  } finally { lock.releaseLock(); }

  try {
    MailApp.sendEmail(ownerEmail_(), 'New ENZO order ' + orderId + ' — Rs ' + total,
      'Order: ' + orderId + '\nName: ' + name + '\nPhone: ' + phone + '\nPayment: ' + method + '\nDelivery: ' + delivery + '\nAddress: ' + address + ', ' + city +
      '\nPieces: ' + codes.join(', ') + '\nTotal: Rs ' + total + '\nNote: ' + note);
  } catch (err) { /* email quota or permission issue must never fail the order */ }
  return { ok: true, orderId: orderId, total: total, holdHours: CFG.HOLD_HOURS, items: lines, payment: method, delivery: delivery };
}

/* ---------------- admin (PIN) ---------------- */
function pinOk_(pin) {
  var real = PropertiesService.getScriptProperties().getProperty('ADMIN_PIN');
  if (!real) return false;
  var c = cache_(), fails = Number(c.get('pinfail') || 0);
  if (fails >= 5) return false;
  if (String(pin) === String(real)) { c.remove('pinfail'); return true; }
  c.put('pinfail', String(fails + 1), 600);
  return false;
}
function admin_(d) {
  if (!pinOk_(d.pin)) return { ok: false, error: 'auth' };
  var a = d.action;
  if (a === 'admin_list') {
    var items = readAll_(sheet_(INV, INV_COLS), INV_COLS).filter(function (o) { return o.code !== ''; }).map(function (o) {
      var p = pubItem_(o); p.order_id = o.order_id; p.reserved_at = o.reserved_at ? new Date(o.reserved_at).toISOString() : ''; return p;
    });
    var ords = readAll_(sheet_(ORD, ORD_COLS), ORD_COLS).slice(-150).reverse().map(function (o) {
      return { order_id: o.order_id, created_at: new Date(o.created_at).toISOString(), name: o.name, phone: String(o.phone).replace(/^'/, ''), items: o.items, total_pkr: o.total_pkr, payment: o.payment, status: o.status, note: o.note, delivery: o.delivery, address: o.address, city: o.city };
    });
    return { ok: true, items: items, orders: ords };
  }
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var ish = sheet_(INV, INV_COLS), inv = readAll_(ish, INV_COLS), by = {};
    inv.forEach(function (o) { by[String(o.code)] = o; });
    if (a === 'admin_sell') {                                  // walk-in POS sale
      var it = by[String(d.code)];
      if (!it) return { ok: false, error: 'not_found' };
      if (it.status === 'sold') return { ok: false, error: 'already_sold' };
      if (it.status === 'reserved' && !d.force) return { ok: false, error: 'reserved', order_id: it.order_id };
      var price = d.price ? Number(d.price) : Number(it.price_pkr);
      if (!(price >= 0)) return { ok: false, error: 'bad_price' };
      it.status = 'sold'; it.reserved_at = ''; it.order_id = '';
      setRow_(ish, it._row, INV_COLS, it);
      var s = sheet_(SALES, SALES_COLS);
      setRow_(s, s.getLastRow() + 1, SALES_COLS, { sold_at: now_(), code: it.code, name: it.name, price_pkr: price, buyer: clean_(d.buyer, 80), source: 'shop' });
      bust_(); return { ok: true };
    }
    if (a === 'admin_status') {
      var it2 = by[String(d.code)];
      if (!it2) return { ok: false, error: 'not_found' };
      if (['available', 'hidden', 'sold'].indexOf(d.status) < 0) return { ok: false, error: 'bad_status' };
      it2.status = d.status; it2.reserved_at = ''; it2.order_id = '';
      setRow_(ish, it2._row, INV_COLS, it2); bust_(); return { ok: true };
    }
    if (a === 'admin_order') {
      var osh = sheet_(ORD, ORD_COLS), ords2 = readAll_(osh, ORD_COLS), o = null;
      ords2.forEach(function (x) { if (x.order_id === d.orderId) o = x; });
      if (!o) return { ok: false, error: 'not_found' };
      if (['Paid', 'Collected', 'Cancelled'].indexOf(d.status) < 0) return { ok: false, error: 'bad_status' };
      var codes = String(o.items).split(',').map(function (c) { return c.trim(); }).filter(String);
      codes.forEach(function (c) {
        var p = by[c]; if (!p || p.order_id !== o.order_id && p.status !== 'sold') return;
        if (d.status === 'Cancelled' && p.status === 'reserved') { p.status = 'available'; p.reserved_at = ''; p.order_id = ''; setRow_(ish, p._row, INV_COLS, p); }
        if (d.status === 'Collected' && p.status !== 'sold') {
          p.status = 'sold'; p.reserved_at = ''; setRow_(ish, p._row, INV_COLS, p);
          var s2 = sheet_(SALES, SALES_COLS);
          setRow_(s2, s2.getLastRow() + 1, SALES_COLS, { sold_at: now_(), code: p.code, name: p.name, price_pkr: p.price_pkr, buyer: o.name, source: 'online ' + o.order_id });
        }
      });
      o.status = d.status; setRow_(osh, o._row, ORD_COLS, o); bust_(); return { ok: true };
    }
  } finally { lock.releaseLock(); }
  return { ok: false, error: 'unknown_action' };
}

/** Run once from the editor to create the three tabs with headers. */
function setup() {
  sheet_(INV, INV_COLS); sheet_(ORD, ORD_COLS); sheet_(SALES, SALES_COLS);
}
