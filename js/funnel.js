/* Journal funnel forms → Formspree (https://formspree.io/f/mljjawgw). No dependencies. */
(function () {
  'use strict';
  var forms = document.querySelectorAll('form[data-funnel]');
  if (!forms.length) return;
  var qs = new URLSearchParams(location.search);
  Array.prototype.forEach.call(forms, function (f) {
    function set(n, v) { var el = f.elements[n]; if (el && v) el.value = v; }
    set('page_url', location.href.split('#')[0]);
    set('utm_source', qs.get('utm_source')); set('utm_medium', qs.get('utm_medium')); set('utm_campaign', qs.get('utm_campaign'));
    set('referrer', document.referrer);
    var st = f.querySelector('.fn-status'), btn = f.querySelector('button[type=submit]');
    function say(m, ok) { st.textContent = m; st.className = 'fn-status ' + (ok ? 'ok' : 'err'); }
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (f.elements._gotcha && f.elements._gotcha.value) return;
      var em = f.elements.email;
      if (!em.value.trim() || !em.checkValidity()) { say('Please enter a valid email address.', false); em.focus(); return; }
      var nm = f.elements.name; if (nm && nm.required && nm.value.trim().length < 2) { say('Please enter your name.', false); nm.focus(); return; }
      var co = f.elements.country; if (co && co.required && !co.value.trim()) { say('Please enter your country.', false); co.focus(); return; }
      btn.disabled = true; var label = btn.textContent; btn.textContent = 'Sending…'; say('', true);
      fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (x) {
          if (!x.ok) { var m = (x.d && x.d.errors && x.d.errors.map(function (er) { return er.message; }).join(' ')) || 'Could not send. Please try again, or email info@enzolhr.com.'; say(m, false); return; }
          var dl = f.getAttribute('data-download');
          f.reset();
          if (dl) {
            st.innerHTML = 'Thank you. <a href="' + dl + '" download style="color:#fff;text-decoration:underline;font-weight:600">Download the specification sheet (PDF)</a>';
            st.className = 'fn-status ok';
          } else { say('Thank you. We will reply to your email within one business day.', true); }
        })
        .catch(function () { say('Could not reach the server. Please check your connection or email info@enzolhr.com.', false); })
        .then(function () { btn.disabled = false; btn.textContent = label; });
    });
  });
})();
