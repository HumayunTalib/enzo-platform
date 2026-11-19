/* Knowledge Centre: pillar filter chips (works as plain links without JS). */
(function () {
  var chips = [].slice.call(document.querySelectorAll('.b2-chip[data-filter]')), cards = [].slice.call(document.querySelectorAll('[data-pillar]'));
  if (!chips.length) return;
  function apply(f) {
    chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-filter') === f)); });
    cards.forEach(function (c) { c.style.display = (f === 'all' || c.getAttribute('data-pillar') === f) ? '' : 'none'; });
    document.querySelectorAll('[data-pillar-block]').forEach(function (b) { b.style.display = (f === 'all' || b.getAttribute('data-pillar-block') === f) ? '' : 'none'; });
  }
  chips.forEach(function (c) { c.addEventListener('click', function () { var f = c.getAttribute('data-filter'); apply(f); try { history.replaceState(null, '', f === 'all' ? location.pathname : '#' + f); } catch (e) {} }); });
  var h = (location.hash || '').slice(1); if (h && chips.some(function (c) { return c.getAttribute('data-filter') === h; })) apply(h);
})();
