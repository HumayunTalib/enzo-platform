/* ============================================================
   ENZO — image fallback loader.
   Swaps a photograph into a [data-src] container only once it has
   actually loaded, so a missing asset shows the article-code
   placeholder already in the DOM rather than a broken-image icon.

   Exposed globally because the shop grid re-renders on filter and
   has to re-run this over the new nodes.
   ============================================================ */
function applyImageFallback(root) {
  (root || document).querySelectorAll('[data-src]:not(.has-image)').forEach(function (box) {
    var src = box.getAttribute('data-src');
    if (!src) return;
    var probe = new Image();
    probe.onload = function () {
      var img = document.createElement('img');
      img.src = src;
      img.alt = box.getAttribute('data-alt') || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      box.insertBefore(img, box.firstChild);
      box.classList.add('has-image');
    };
    probe.src = src;
  });
}
applyImageFallback();
