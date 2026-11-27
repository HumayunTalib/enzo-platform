const fs = require('fs');
const L = require('./layout.js');
const { esc, attr, VERIFY, page, head, sec, table, waBtn, rfqBtn, ctaBand, faqHTML, faqLD, SITE, url } = L;
const DATA = JSON.parse(fs.readFileSync('data/b2b-products.json', 'utf8'));
const val = (v, note) => v === 'VERIFY' ? VERIFY : esc(v);
const withVerify = (txt) => esc(txt) + ' ' + VERIFY;
const out = [];

/* ---------------- /products/ hub ---------------- */
(function () {
  const p = 'products/', base = L.baseOf(p), crumbs = [['Home', ''], ['Products', p]];
  const cards = DATA.categories.map(c => '<a class="b2-card" href="' + base + p + c.slug + '/"><span class="b2-kicker">Category</span><h3>' + esc(c.name) + '</h3><p>' + esc(c.short) + '</p><span class="more">View specification →</span></a>').join('');
  const faq = [
    ['Does ENZO sell fabric to consumers?', 'No. ENZO supplies woven fabric to wholesalers, garment manufacturers, brands, sourcing agents and traders. A small ready-stock lot is available in the Ready Stock section for buyers who need fabric already in hand.'],
    ['What is the minimum order quantity?', 'Minimum order quantity depends on the construction and on whether the fabric is ready stock or custom woven. It is confirmed in the quotation for your specification.'],
    ['Can ENZO weave a construction that is not listed?', 'Yes. Custom constructions are ENZO\'s core work: send composition, counts, EPI × PPI, weave and width, and ENZO reviews the specification before quoting.'],
    ['How do I work out the weight of a construction before ordering?', 'Use the GSM calculator with your EPI, PPI and yarn counts; the result is a theoretical weight that ENZO confirms on a sample.']
  ];
  const body = head(base, crumbs, 'Woven Fabric Products for B2B Buyers', 'Bulk woven greige for processors, converters, wholesalers and exporters, and finished fabric in small batches for stitching units, shops and smaller brands. Every order is quoted from a written specification.', rfqBtn(base, 'Request a quote') + waBtn(base, 'Discuss specs on WhatsApp', 'Products overview'), 'wide') +
    sec('<a class="b2-card" href="' + base + p + 'eid-wash-and-wear-112x84/" style="flex-direction:row;gap:var(--s3);align-items:center;flex-wrap:wrap"><img src="' + base + 'assets/products/eid-112x84/eid-112x84-photo.webp" alt="Eid wash and wear 112 x 84 in 11 shades" width="320" height="241" loading="lazy" style="border-radius:var(--r2);max-width:100%;height:auto"><div style="flex:1;min-width:220px"><span class="b2-kicker">New for Eid</span><h3>Eid Wash &amp; Wear 112 × 84</h3><p>Medium weight, 11 shades. Bulk greige by the lot, or finished fabric in small batches.</p><span class="more">View shades and spec →</span></div></a>') +
    sec('<h2>Choose a category</h2><div class="b2-grid c3">' + cards + '</div>') +
    sec('<h2>How to specify what you need</h2><p class="lead">A complete specification removes most of the back-and-forth in a quote. These tools and guides help you build one.</p><div class="b2-grid c3" style="margin-top:var(--s3)">' +
      '<a class="b2-card flat" href="' + base + 'tools/gsm-calculator/"><h3>GSM calculator</h3><p>Weight from EPI, PPI, counts and crimp.</p></a>' +
      '<a class="b2-card flat" href="' + base + 'tools/fabric-construction/"><h3>Construction calculator</h3><p>Cover factor, balance and weave float.</p></a>' +
      '<a class="b2-card flat" href="' + base + 'resources/"><h3>Specification sheet template</h3><p>A print-ready sheet to complete and send.</p></a></div>', 'alt') +
    sec('<div class="b2-split"><div><h2>Small-batch finished fabric</h2><div class="b2-prose"><p>When a buyer cannot take a full lot, ENZO sells finished fabric in small batches, listed with colours and article codes. Bulk orders are woven to specification and sold as greige.</p></div><div class="b2-actions" style="margin-top:var(--s3)"><a class="btn btn-secondary" href="' + base + 'store.html">View small-batch fabric</a></div></div><div><h2>Frequently asked</h2>' + faqHTML(faq) + '</div></div>') +
    ctaBand(base, 'Send the specification you have', 'Partial specifications are fine. ENZO reviews what you send and replies with questions or a quotation.', '', 'Products overview');
  out.push({ path: p, html: page({ path: p, title: 'Woven Fabric Products for B2B Buyers | ENZO Textiles', desc: 'PV suiting, men\'s woven suiting and custom greige or dyed woven fabric from ENZO Textiles, Lahore. Wholesale only. View specifications and request a quote.', crumbs, pageType: 'CollectionPage', ld: [{ '@type': 'ItemList', itemListElement: DATA.categories.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, url: url(p + c.slug + '/') })) }, faqLD(faq)], body, scripts: ['js/motion.js'].slice(0, 0) }) });
})();

/* ---------------- category pages ---------------- */
DATA.categories.forEach(c => {
  const p = 'products/' + c.slug + '/', base = L.baseOf(p), crumbs = [['Home', ''], ['Products', 'products/'], [c.name, p]];
  const qs = 'category=' + encodeURIComponent(c.formCategory) + (c.formComposition ? '&composition=' + encodeURIComponent(c.formComposition) : '');
  const spec = 'Category: ' + c.name;
  const rows = [
    ['Composition', c.composition.replace(/:$/, '') + (c.composition.endsWith(':') ? ': ' + VERIFY : '')],
    ['Yarn count', esc(c.yarnCount.replace(/:$/, '')) + (c.yarnCount.endsWith(':') ? ': ' + VERIFY : '')],
    ['Weave / construction', esc(c.weave.replace(/:$/, '')) + (c.weave.endsWith(':') ? ': ' + VERIFY : '')],
    ['Width', val(c.width)], ['GSM', c.gsm === 'VERIFY' ? VERIFY : esc(c.gsm)], ['Finish', val(c.finish)],
    ['Applications', esc(c.applications)], ['MOQ', val(c.moq)], ['Custom options', esc(c.custom)]
  ];
  rows[0][1] = esc(c.composition.replace(/:$/, '')) + (c.composition.endsWith(':') ? ': ' + VERIFY : '');
  const photo = c.photos.length
    ? '<div class="b2-photos">' + c.photos.map((s, i) => '<img src="' + base + s + '" alt="' + attr(c.photoAlt[i]) + '" loading="lazy" width="400" height="400">').join('') + '</div><p class="small" style="margin-top:8px">' + esc(c.photoNote) + ' <a class="b2-link" href="' + base + 'store.html">See the ready-stock lot</a>.</p>'
    : '<div class="b2-ph"><div>Product photography for this category to be supplied.<br>' + VERIFY + '</div></div>';
  const faq = [
    ['What information does ENZO need to quote ' + c.name + '?', 'Composition, yarn counts, EPI × PPI, weave, width, GSM target, finish, shade (or greige), order volume in metres and target timeline. Partial information is fine; ENZO replies with what is missing.'],
    ['Is a sample available before a bulk order?', 'Sampling arrangements depend on the construction and are agreed in the quotation. Ask for sample terms in your RFQ.'],
    ['Can I get a GSM figure before ordering?', 'Use the GSM calculator for a theoretical value from your construction. ENZO confirms against a weighed sample.']
  ];
  const process = '<ol class="b2-steps c4"><li class="b2-step"><h3>Specify</h3><p>You send the spec or a reference sample. Tools and templates are on this site.</p></li><li class="b2-step"><h3>Review &amp; quote</h3><p>ENZO checks the construction and replies with questions or a quotation.</p></li><li class="b2-step"><h3>Weave &amp; dye</h3><p>Made to your specification, dyed where required.</p></li><li class="b2-step"><h3>Inspect &amp; dispatch</h3><p>Independent final inspection before the fabric leaves.</p></li></ol>';
  const body = head(base, crumbs, esc(c.h1), esc(c.intro), rfqBtn(base, 'Request a quote for ' + c.name, qs) + waBtn(base, 'Discuss specs on WhatsApp', 'Category: ' + c.name, spec), 'wide') +
    sec('<div class="b2-split"><div><h2>Specification block</h2><p class="small">Items marked <span class="b2-verify">[VERIFY SPEC]</span> are confirmed with ENZO per quality before quoting.</p>' + table(null, rows) + '<div class="b2-actions">' + rfqBtn(base, 'Request a quote', qs) + '<a class="btn btn-secondary" href="' + base + 'tools/gsm-calculator/">GSM calculator</a></div></div><div><h2>Photography</h2>' + photo + '</div></div>') +
    sec('<h2>How an order runs</h2>' + process + '<p class="small" style="margin-top:var(--s3)">Read the full operating model on the <a class="b2-link" href="' + base + 'manufacturing/">manufacturing page</a>.</p>', 'alt') +
    sec('<div class="b2-split"><div><h2>Related tools and guides</h2><div class="b2-related"><a href="' + base + 'tools/yarn-count-converter/">Yarn count converter<small>Ne, Tex, Denier, Nm; 36/1 vs 36/2</small></a><a href="' + base + 'tools/spec-comparison/">Specification comparison tool<small>Compare two constructions</small></a><a href="' + base + 'knowledge-centre/how-to-write-a-woven-fabric-specification-for-an-rfq/">How to write a fabric specification<small>Knowledge Centre</small></a><a href="' + base + 'resources/">Resource guides<small>Printable spec sheet and checklist</small></a></div></div><div><h2>Questions</h2>' + faqHTML(faq) + '</div></div>') +
    ctaBand(base, 'Ready to specify ' + esc(c.name) + '?', 'Send what you have. ENZO reviews the specification before quoting.', qs, spec);
  const ld = [{ '@type': 'Product', name: c.name, description: c.desc, category: 'Woven fabric', brand: { '@type': 'Brand', name: 'ENZO Textiles' }, manufacturer: { '@id': SITE + '/#organization' }, url: url(p), ...(c.photos.length ? { image: c.photos.map(s => url(s)) } : {}) }, faqLD(faq)];
  out.push({ path: p, html: page({ path: p, title: c.title, desc: c.desc, crumbs, ld, body, ogImage: c.photos.length ? url(c.photos[0]) : undefined }) });
});

/* ---------------- /manufacturing/ ---------------- */
(function () {
  const p = 'manufacturing/', base = L.baseOf(p), crumbs = [['Home', ''], ['Manufacturing', p]];
  const desc = 'Any woven fabric can be easily produced by ENZO. Send your specification and ENZO quotes, makes the fabric and inspects it before dispatch.';
  const faq = [
    ['Can ENZO produce any woven fabric?', 'Yes. Any woven fabric can be easily produced. Send the composition, counts, construction, width and shade, and ENZO will quote against that specification.'],
    ['Who inspects the fabric before dispatch?', 'An independent final quality inspection is carried out before dispatch.']
  ];
  const body = head(base, crumbs, 'Any woven fabric, easily produced', 'Send your specification. ENZO quotes, makes the fabric and inspects it before dispatch.', rfqBtn(base, 'Request a quote') + waBtn(base, 'Ask about production on WhatsApp', 'Manufacturing page'), 'wide') +
    sec('<h2>From enquiry to dispatch</h2><ol class="b2-steps c4"><li class="b2-step"><h3>Specification</h3><p>You send composition, counts, EPI × PPI, width and volume. Use the <a class="b2-link" href="' + base + 'quote/">RFQ</a>.</p></li><li class="b2-step"><h3>Quotation</h3><p>ENZO reviews the specification and quotes, with the timeline.</p></li><li class="b2-step"><h3>Production</h3><p>The fabric is made to the approved specification, dyed where the order needs it.</p></li><li class="b2-step"><h3>Inspection &amp; dispatch</h3><p>Independent final inspection, then dispatch.</p></li></ol><p class="small" style="margin-top:var(--s3)">Lead times are given in the quotation ' + VERIFY + '.</p>', 'alt') +
    sec('<h2>Frequently asked</h2>' + faqHTML(faq)) +
    ctaBand(base, 'Need a woven fabric made?', 'Send a specification or a reference sample.', '', 'Manufacturing page');
  out.push({ path: p, html: page({ path: p, title: 'Manufacturing | ENZO Textiles', desc, crumbs, ld: [faqLD(faq)], body }) });
})();

/* ---------------- /international-buyers/ ---------------- */
(function () {
  const p = 'international-buyers/', base = L.baseOf(p), crumbs = [['Home', ''], ['International Buyers', p]];
  const regions = [
    ['United Kingdom', 'Wholesalers, menswear and uniform garment makers, brands and sourcing agents buying woven suiting by the roll or lot.', 'Composition and width, GSM tolerance, your preferred test methods, destination port and Incoterm.'],
    ['GCC: UAE and Saudi Arabia', 'Wholesalers, traders, uniform suppliers and garment makers buying PV and blended woven fabric.', 'Shade reference (physical swatch or lab dip), roll length and packing, destination port or consignee, payment instrument preferred.'],
    ['United States', 'Brands, importers and garment manufacturers that buy woven fabric against written specifications.', 'Fibre-content and labelling needs for your market, inspection method (for example the four-point system), roll length, delivery window.'],
    ['European Union', 'Importers, brands and garment manufacturers with documented supplier requirements.', 'Composition, applicable ISO test methods, your restricted-substances requirements and the documents you need with the shipment.'],
    ['Pakistan', 'Wholesalers, garment manufacturers and traders in Lahore, Faisalabad, Karachi and Peshawar.', 'Construction and quantity, whether you want ready stock or custom weave, delivery location.'],
    ['Bangladesh', 'Garment manufacturers and traders sourcing woven suiting fabric.', 'Composition, construction, width, shade, quantity and delivery terms.'],
    ['China', 'Sourcing agents and trading companies buying woven fabric on behalf of overseas clients.', 'Full written specification, reference sample if available, destination and the end-client\'s inspection requirements.']
  ];
  const faq = [
    ['Does ENZO export fabric?', 'ENZO supplies B2B buyers outside Pakistan. Shipping terms, documentation and payment terms are agreed per order and set out in the quotation.'],
    ['What is the minimum order for export?', 'Minimum order quantity is confirmed per construction and order type in the quotation.'],
    ['Can I get a reference sample before ordering?', 'Sampling is arranged per order. Ask for sample terms in your RFQ.'],
    ['How do I know the quality before shipment?', 'ENZO carries out an independent final quality inspection before dispatch. If you need your own inspector or an inspection method such as the four-point system, say so in the RFQ.']
  ];
  const body = head(base, crumbs, 'Buying Woven Fabric from Pakistan: Information for International Buyers', 'ENZO Textiles supplies woven suiting fabric to B2B buyers in Pakistan and abroad. This page explains who ENZO works with, what to prepare for an enquiry and how an order is agreed.', rfqBtn(base, 'Request a quote') + waBtn(base, 'Discuss an export enquiry on WhatsApp', 'International buyers'), 'wide') +
    sec('<h2>Buyer markets</h2><div class="b2-grid c3">' + regions.map(r => '<div class="b2-card"><span class="b2-kicker">' + esc(r[0]) + '</span><h3>Who this is for</h3><p>' + esc(r[1]) + '</p><h3 style="margin-top:12px">What to prepare</h3><p>' + esc(r[2]) + '</p></div>').join('') + '</div><p class="small" style="margin-top:var(--s3)">Import duties, labelling rules and product-compliance requirements differ by destination. Confirm them with your customs broker; tell ENZO your destination so the quotation covers the right documents.</p>') +
    sec('<h2>How an international order is agreed</h2><ol class="b2-steps c4"><li class="b2-step"><h3>Send the RFQ</h3><p>Complete the <a class="b2-link" href="' + base + 'quote/">RFQ form</a> with specification, volume and destination.</p></li><li class="b2-step"><h3>Specification review</h3><p>ENZO checks the construction and asks for what is missing.</p></li><li class="b2-step"><h3>Quotation &amp; terms</h3><p>Price, timeline, Incoterm, payment terms and documents ' + VERIFY + '.</p></li><li class="b2-step"><h3>Production &amp; inspection</h3><p>Weaving, dyeing if required, independent final inspection, dispatch.</p></li></ol>', 'alt') +
    sec('<div class="b2-split"><div><h2>What to include in your RFQ</h2><ul class="b2-prose"><li>Composition and, if known, yarn counts (Ne) and EPI × PPI</li><li>Weave, width and target GSM with tolerance</li><li>Greige or dyed, shade reference, finish</li><li>Quantity in metres and whether ready stock or custom weave</li><li>Packing needs, destination port and Incoterm</li><li>Inspection method and any test standards you require</li></ul><p class="small" style="margin-top:var(--s2)">Use the <a class="b2-link" href="' + base + 'resources/">specification sheet template</a> to collect these in one place.</p></div><div><h2>Frequently asked</h2>' + faqHTML(faq) + '</div></div>') +
    ctaBand(base, 'Tell ENZO where the fabric is going', 'Include destination and documentation needs in your RFQ so the quotation covers them.', '', 'International buyers');
  out.push({ path: p, html: page({ path: p, title: 'Buy Woven Fabric from Pakistan — International Buyers | ENZO', desc: 'For UK, GCC, US, EU, Bangladesh, China and Pakistan buyers sourcing woven suiting fabric from ENZO Textiles, Lahore: what to prepare and how orders work.', crumbs, ld: [faqLD(faq)], body }) });
})();

module.exports = out;
