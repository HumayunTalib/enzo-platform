/* ENZO calculators — wires the server-rendered forms to the maths in tool-defs.js. No network calls. */
(function () {
  var TD = window.ENZO_TOOLS; if (!TD) return;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function read(root, def) {
    var v = {};
    def.fields.forEach(function (f) {
      var el = root.querySelector('[data-f="' + f.id + '"]'); if (!el) return;
      v[f.id] = f.type === 'select' ? el.value : (el.value === '' ? NaN : parseFloat(el.value));
    });
    return v;
  }
  function render(out, res) {
    if (!res) { out.querySelector('.b2-res').innerHTML = '<p class="empty">Enter valid numbers to see the result.</p>'; return; }
    var h;
    if (res.cols) {
      h = '<div class="b2-table-wrap" style="margin:0;background:transparent;border-color:rgba(255,255,255,.2)"><table class="b2-table" style="min-width:0;color:#fff"><thead><tr><th style="background:transparent;color:#9FB0EE"></th>' + res.cols.map(function (c) { return '<th style="background:transparent;color:#9FB0EE">' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        res.rows.map(function (r) { return '<tr><th style="color:#C9D3F2;font-weight:500;width:auto">' + esc(r.k) + '</th>' + r.vals.map(function (x) { return '<td style="font-family:var(--mono);' + (r.hl ? 'font-weight:600;font-size:1.1rem' : '') + '">' + esc(x) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>' +
        '<ul style="margin:12px 0 0;padding-left:1.1rem;font-size:.85rem;color:#C9D3F2">' + res.read.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
    } else {
      h = '<dl>' + res.rows.map(function (r) {
        if (r.head) return '<div class="row head"><dt>' + esc(r.k) + '</dt><dd></dd></div>';
        return '<div class="row' + (r.hl ? ' hl' : '') + '"><dt>' + esc(r.k) + '</dt><dd>' + esc(r.v) + (r.u ? '<span class="u">' + esc(r.u) + '</span>' : '') + '</dd></div>';
      }).join('') + '</dl>';
    }
    out.querySelector('.b2-res').innerHTML = h;
  }
  document.querySelectorAll('.b2-calc[data-part]').forEach(function (box) {
    var key = box.getAttribute('data-part'), def = TD.T[key]; if (!def) return;
    var out = box.querySelector('.b2-out'), tracked = false, quote = box.getAttribute('data-quote') || 'quote/', slug = box.getAttribute('data-slug') || key;
    var wa = out.querySelector('a[data-wa]'), rq = out.querySelector('a[data-rfq]');
    function toggleDeps() { var sh = box.querySelector('[data-f="shape"]'), d2 = box.querySelector('[data-f="d2"]'); if (sh && d2) d2.closest('.b2-field').style.display = sh.value === 'rect' ? '' : 'none'; }
    function run(user) {
      toggleDeps();
      var res; try { res = def.compute(read(box, def)); } catch (e) { res = null; }
      render(out, res);
      var s = res && res.summary ? res.summary : '';
      if (wa) { wa.setAttribute('data-wa-spec', s); if (window.enzoWire) window.enzoWire(); }
      if (rq) rq.href = quote + '?src=' + encodeURIComponent(slug) + (s ? '&spec=' + encodeURIComponent(s) : '');
      if (user && !tracked && res && window.enzoTrack) { tracked = true; window.enzoTrack('calculator_used', { tool: slug, part: key }); }
    }
    box.addEventListener('input', function () { run(true); });
    box.addEventListener('change', function () { run(true); });
    box.querySelectorAll('[data-reset]').forEach(function (b) { b.addEventListener('click', function () { def.fields.forEach(function (f) { var el = box.querySelector('[data-f="' + f.id + '"]'); if (el) el.value = f.def; }); run(false); }); });
    run(false);
  });
})();
