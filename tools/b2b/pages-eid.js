/* Eid Wash & Wear 112x84 product page. Facts only from the owner (2026-11-27):
 * construction 112 x 84 reed x pick, wash & wear, 11 shades (from the shade photo), weight "Medium" (GSM not yet determined),
 * sold as bulk greige by the lot and as small-batch finished fabric. Everything else is "confirmed in the quotation". */
const L = require('./layout.js');
const { esc, attr, page, head, sec, table, waBtn, rfqBtn, ctaBand, faqHTML, faqLD, SITE, url } = L;
const out = [];

const SHADES = [
  ['Navy Blue', '344F7C'], ['Steel Blue', '495A77'], ['Teal Blue', '457F9C'], ['Sky Blue', '6F95CB'],
  ['Cream', 'F4EDD9'], ['Off White', 'F4F2EC'], ['Ice Blue', 'D4DBF2'], ['Olive', '535246'],
  ['Sand Beige', 'EFDBB9'], ['Taupe', 'AB9D95'], ['Khaki Brown', '8C7F72']];
const IMG = 'assets/products/eid-112x84/';
const slugOf = n => n.toLowerCase().replace(/ /g, '-');

(function () {
  const p = 'products/eid-wash-and-wear-112x84/', base = L.baseOf(p);
  const name = 'Eid Wash & Wear 112 × 84';
  const crumbs = [['Home', ''], ['Products', 'products/'], [name, p]];
  const qs = 'category=' + encodeURIComponent("Men's Woven Suiting") + '&notes=' + encodeURIComponent('Eid Wash & Wear 112x84');
  const spec = 'Eid Wash & Wear 112x84';

  const weight = '<div class="eid-weight" role="img" aria-label="Fabric weight: medium on a low to high scale">' +
    ['Low', 'Medium', 'High'].map((t, i) => '<div class="eid-w' + (i === 1 ? ' on' : '') + '"><span></span><small>' + t + '</small></div>').join('') +
    '</div><p class="small" style="margin-top:6px">GSM is confirmed on a weighed sample.</p>';

  const rows = [
    ['Construction', '112 × 84 (reed × pick)'],
    ['Fabric type', 'Wash &amp; wear, woven'],
    ['Fabric weight', weight],
    ['Shades', '11 (see the shade card below)'],
    ['Width', '64 inches'],
    ['Season', 'All season'],
    ['Bulk supply', 'Greige, by the lot. MOQ 12,000 m (depends on the specification)'],
    ['Small batches', 'Finished fabric, for buyers who cannot take a full lot'],
    ['Quotation', 'Within 1 day of receiving your specification'],
    ['Production time', 'Greige: about 20 days. Finished: about 1 month'],
    ['Export payment', '70:30 against LC'],
    ['Price', 'Quote on request']
  ];

  const swatches = '<div class="eid-shades">' + SHADES.map((s, i) =>
    '<figure class="eid-shade"><img src="' + base + IMG + 'shade-' + String(i + 1).padStart(2, '0') + '-' + slugOf(s[0]) + '.webp" alt="' + attr(s[0] + ' shade, Eid wash and wear 112 x 84') + '" loading="lazy" width="240" height="240" style="background:#' + s[1] + '">' +
    '<figcaption><b>' + esc(s[0]) + '</b><span>' + String(i + 1).padStart(2, '0') + '</span></figcaption></figure>').join('') + '</div>' +
    '<p class="small" style="margin-top:var(--s2)">Colours are taken from the mill photo and vary by screen. Ask about samples before you book bulk.</p>';

  const usp = '<div class="b2-grid c3">' +
    '<div class="b2-card flat"><h3>The spec is written down</h3><p>Construction, shade and quantity go on a written quotation, so both sides agree what is being bought.</p></div>' +
    '<div class="b2-card flat"><h3>Sample matches bulk</h3><p>The bulk cloth matches the approved sample. Final finishing can differ slightly from lab dips, never the quality. An independent final inspection is done before dispatch.</p></div>' +
    '<div class="b2-card flat"><h3>Greige or finished</h3><p>Take bulk greige for your own processing, or finished fabric in a small batch that fits your shop or stitching unit.</p></div></div>';

  const faq = [
    ['What does 112 × 84 mean?', '112 is the reed (ends per inch in the warp) and 84 is the pick (picks per inch in the weft). Together they describe how closely the cloth is woven.'],
    ['Can I buy greige and finish it myself?', 'Yes. Bulk greige is sold by the lot to processors, converters, wholesalers and exporters.'],
    ['I only need a small quantity. Can I still buy?', 'Yes. Finished fabric is available in small batches for stitching units, shops and smaller brands. The batch size is confirmed in the quotation.'],
    ['When should I book for Eid?', 'Wholesalers stock before Ramadan, so book early. Greige takes about 20 days and finished fabric about 1 month from booking. Send your quantity and shades on WhatsApp for a quote within a day.'],
    ['What is the GSM?', 'The fabric sits in the medium weight range. GSM varies by quality and is confirmed on a weighed sample before you book bulk.'],
    ['What is the minimum order?', 'For bulk greige the minimum is 12,000 metres, depending on the specification. Finished fabric is sold in smaller batches.'],
    ['Will bulk match my sample?', 'Yes. Bulk matches the approved sample. Lab dips can differ slightly from the final finish, but quality is not compromised.']
  ];

  const body = head(base, crumbs, 'Eid Wash &amp; Wear 112 × 84: Bulk Greige and Small-Batch Finished',
      'A medium-weight wash &amp; wear woven at 112 × 84, 64 inches wide, in 11 shades for the Eid season. Buy it as bulk greige by the lot, or as finished fabric in small batches. Every order is quoted from a written spec.',
      rfqBtn(base, 'Request a quote', qs) + waBtn(base, 'Book on WhatsApp', 'Eid Wash & Wear 112x84', spec), 'wide') +
    sec('<div class="b2-split"><div><h2>Specification</h2>' + table(null, rows) + '<div class="b2-actions">' + rfqBtn(base, 'Request a quote', qs) + waBtn(base, 'Ask about samples', 'Eid 112x84 sample request', spec, 'btn-secondary') + '</div></div>' +
      '<div><h2>The fabric</h2><img src="' + base + IMG + 'eid-112x84-photo.webp" alt="Eleven rolls of ENZO Eid wash and wear 112 x 84 fabric in navy, steel blue, teal, sky blue, cream, off white, ice blue, olive, sand beige, taupe and khaki brown" width="1280" height="963" style="width:100%;height:auto;border-radius:var(--r2)"><p class="small" style="margin-top:8px">Mill photo of the 11 shades.</p></div></div>') +
    sec('<h2>Shade card</h2>' + swatches, 'alt') +
    sec('<h2>Why buyers order from ENZO</h2>' + usp) +
    sec('<div class="b2-split"><div><h2>Related guides</h2><div class="b2-related"><a href="' + base + 'journal/wash-and-wear-fabric-guide.html">What is wash &amp; wear fabric?<small>Fabric Journal</small></a><a href="' + base + 'journal/reed-and-pick.html">Reed and pick explained<small>Fabric Journal</small></a><a href="' + base + 'journal/greige-vs-finished-fabric.html">Greige vs finished fabric<small>Fabric Journal</small></a><a href="' + base + 'tools/gsm-calculator/">GSM calculator<small>Weight from a construction</small></a></div></div><div><h2>Questions</h2>' + faqHTML(faq) + '</div></div>', 'alt') +
    ctaBand(base, 'Book your Eid wash &amp; wear', 'Send quantity, shades and greige or finished. ENZO replies with a written quotation.', qs, spec) +
    '<style>.eid-weight{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;max-width:320px}.eid-w span{display:block;height:10px;border-radius:5px;background:var(--line)}.eid-w.on span{background:var(--navy)}.eid-w small{display:block;text-align:center;font-size:var(--fs-xs);color:var(--slate);margin-top:4px}.eid-w.on small{color:var(--navy);font-weight:700}' +
    '.eid-shades{display:grid;gap:var(--s2);grid-template-columns:repeat(2,1fr)}@media(min-width:720px){.eid-shades{grid-template-columns:repeat(4,1fr)}}@media(min-width:1000px){.eid-shades{grid-template-columns:repeat(6,1fr)}}' +
    '.eid-shade{margin:0}.eid-shade img{width:100%;height:auto;aspect-ratio:1;object-fit:cover;border-radius:var(--r2);border:1px solid var(--line)}.eid-shade figcaption{display:flex;justify-content:space-between;font-size:var(--fs-sm);margin-top:6px}.eid-shade figcaption span{color:var(--slate)}</style>';

  const desc = 'Eid wash & wear woven at 112 × 84 in 11 shades, medium weight. Bulk greige by the lot or small-batch finished fabric from ENZO Textiles. Quote on request.';
  const ld = [{ '@type': 'Product', name: 'Eid Wash & Wear 112 × 84', description: desc, category: 'Woven fabric', material: 'Wash and wear woven fabric',
    color: SHADES.map(s => s[0]).join(', '), brand: { '@type': 'Brand', name: 'ENZO Textiles' }, manufacturer: { '@id': SITE + '/#organization' }, url: url(p),
    image: [url(IMG + 'eid-112x84-photo.webp'), url(IMG + 'eid-112x84-shade-card.webp')] }, faqLD(faq)];
  out.push({ path: p, html: page({ path: p, title: 'Eid Wash & Wear Fabric 112×84 — Greige & Finished | ENZO', desc, crumbs, ld, body, ogImage: url(IMG + 'eid-112x84-hero.webp') }) });
})();

module.exports = out;
