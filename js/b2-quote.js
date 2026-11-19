/* ENZO RFQ — multi-step form, client-side validation, Formspree submit, WhatsApp hand-off. */
(function () {
  var root = document.getElementById('rfq'); if (!root) return;
  var C = window.ENZO_B2B || {}, form = root.querySelector('form'), panes = [].slice.call(root.querySelectorAll('.b2-pane')), prog = [].slice.call(root.querySelectorAll('.b2-prog li'));
  var step = 0, sent = false;
  var E = function (n) { return form.elements[n]; };
  function val(n) { var el = E(n); if (!el) return ''; if (el.length && el[0] && el[0].type === 'radio') { var c = form.querySelector('input[name="' + n + '"]:checked'); return c ? c.value : ''; } return (el.value || '').trim(); }
  // ---- prefill from query string (calculators, product pages) ----
  var qs = new URLSearchParams(location.search);
  [['category', 'category'], ['composition', 'composition'], ['construction', 'construction'], ['width', 'width'], ['volume', 'volume']].forEach(function (p) { var v = qs.get(p[0]); if (v && E(p[1])) E(p[1]).value = v; });
  var spec = qs.get('spec'); if (spec) { var c = E('construction'); c.value = c.value ? c.value + ' | ' + spec : spec; }
  var ot = qs.get('type'); if (ot) { var r = form.querySelector('input[name="order_type"][value="' + ot + '"]'); if (r) r.checked = true; }
  function show(i) {
    step = i; panes.forEach(function (p, k) { p.classList.toggle('on', k === i); });
    prog.forEach(function (p, k) { p.classList.toggle('on', k === i); p.classList.toggle('done', k < i); });
    root.querySelector('[data-back]').style.visibility = i === 0 ? 'hidden' : 'visible';
    root.querySelector('[data-next]').style.display = i === panes.length - 1 ? 'none' : '';
    root.querySelector('[data-send]').style.display = i === panes.length - 1 ? '' : 'none';
    if (i === panes.length - 1) summary();
    var h = root.getBoundingClientRect().top + window.scrollY - 100; if (window.scrollY > h) window.scrollTo({ top: h, behavior: 'smooth' });
  }
  var RULES = {
    name: [function (v) { return v.length >= 2; }, 'Enter your full name.'],
    company: [function (v) { return v.length >= 2; }, 'Enter your company name.'],
    country: [function (v) { return v.length >= 2; }, 'Choose or type your country.'],
    buyer_role: [function (v) { return !!v; }, 'Select your role.'],
    email: [function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }, 'Enter a valid email address.'],
    phone: [function (v) { return /^[+0-9][0-9\s\-()]{7,20}$/.test(v); }, 'Enter a valid WhatsApp / phone number with country code.'],
    category: [function (v) { return !!v; }, 'Select a fabric category.'],
    composition: [function (v) { return v.length >= 2; }, 'Enter the composition (e.g. polyester/viscose ratio).'],
    volume: [function (v) { return /^[0-9][0-9,\.]*$/.test(v) && parseFloat(v.replace(/,/g, '')) > 0; }, 'Enter the order volume in metres (numbers only).'],
    order_type: [function (v) { return !!v; }, 'Choose ready stock or custom weave.'],
    timeline: [function (v) { return !!v; }, 'Select a target timeline.']
  };
  var STEPS = [['name', 'company', 'country', 'buyer_role', 'email', 'phone'], ['category', 'composition', 'volume', 'order_type', 'timeline'], []];
  function check(names) {
    var ok = true, first = null;
    names.forEach(function (n) {
      var q = form.querySelector('[data-q="' + n + '"]'), rule = RULES[n], v = val(n), good = rule[0](v);
      if (q) { q.classList.toggle('bad', !good); var er = q.querySelector('.err'); if (er) er.textContent = good ? '' : rule[1]; }
      if (!good) { ok = false; if (!first) first = q; }
    });
    if (first) { var f = first.querySelector('input,select,textarea'); if (f) f.focus(); }
    return ok;
  }
  function fields() {
    return [['Name', val('name')], ['Company', val('company')], ['Country', val('country')], ['Buyer role', val('buyer_role')], ['Email', val('email')], ['WhatsApp / phone', val('phone')], ['Fabric category', val('category')], ['Composition', val('composition')], ['Construction / GSM', val('construction')], ['Width', val('width')], ['Order volume (m)', val('volume')], ['Order type', val('order_type')], ['Target timeline', val('timeline')], ['Notes', val('notes')]].filter(function (x) { return x[1]; });
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function summary() { root.querySelector('[data-summary]').innerHTML = '<dl>' + fields().map(function (x) { return '<dt>' + esc(x[0]) + '</dt><dd>' + esc(x[1]) + '</dd>'; }).join('') + '</dl>'; }
  function waText() { return 'Hello ENZO, I just sent an RFQ from enzolhr.com.\n' + fields().filter(function (x) { return ['Email'].indexOf(x[0]) < 0; }).map(function (x) { return x[0] + ': ' + x[1]; }).join('\n'); }
  root.querySelector('[data-next]').addEventListener('click', function () { if (check(STEPS[step])) show(step + 1); });
  root.querySelector('[data-back]').addEventListener('click', function () { show(Math.max(0, step - 1)); });
  form.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') { e.preventDefault(); if (step < panes.length - 1) root.querySelector('[data-next]').click(); } });
  function say(m, ok) { var s = root.querySelector('[data-status]'); s.textContent = m; s.style.color = ok ? 'var(--navy)' : '#A12626'; }
  form.addEventListener('submit', function (e) {
    e.preventDefault(); if (sent) return;
    if (form.querySelector('[name=_gotcha]').value) return;
    if (!check(STEPS[0]) ) { show(0); return; } if (!check(STEPS[1])) { show(1); return; }
    var b = root.querySelector('[data-send]'); b.disabled = true; b.textContent = 'Sending…'; say('', true);
    var fd = new FormData(form); fd.set('_subject', 'RFQ — ' + val('category') + ' — ' + val('company') + ' (' + val('country') + ')'); fd.set('_replyto', val('email')); fd.set('source_page', location.href);
    fetch(form.action, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        if (!x.ok) { say((x.d && x.d.errors && x.d.errors.map(function (er) { return er.message; }).join(' ')) || 'Could not send. Please try again or use WhatsApp.', false); b.disabled = false; b.textContent = 'Send RFQ'; return; }
        sent = true; if (window.enzoTrack) window.enzoTrack('rfq_submitted', { fabric_category: val('category'), buyer_role: val('buyer_role'), order_type: val('order_type') });
        root.querySelector('[data-flow]').style.display = 'none';
        var d = root.querySelector('[data-done]'); d.style.display = 'block';
        var w = d.querySelector('a[data-wa-done]'); w.href = (window.enzoWa || function (t) { return 'https://wa.me/923126418414?text=' + encodeURIComponent(t); })(waText());
        d.setAttribute('tabindex', '-1'); d.focus();
      })
      .catch(function () { say('Could not reach the server. Check your connection, or send the same details on WhatsApp.', false); b.disabled = false; b.textContent = 'Send RFQ'; });
  });
  // WhatsApp instead (no form submission)
  var alt = root.querySelector('[data-wa-alt]'); if (alt) alt.addEventListener('click', function (e) { e.preventDefault(); var t = waText(); window.open((window.enzoWa || function (x) { return 'https://wa.me/923126418414?text=' + encodeURIComponent(x); })(t), '_blank', 'noopener'); if (window.enzoTrack) window.enzoTrack('whatsapp_cta_clicked', { label: 'rfq_form' }); });
  show(0);
})();
