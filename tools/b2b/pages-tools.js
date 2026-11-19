const L = require('./layout.js');
const TD = require('../../js/tool-defs.js');
const KM = require('./kc-meta.js');
const { esc, attr, page, head, sec, table, waBtn, rfqBtn, ctaBand, faqHTML, faqLD, SITE, url } = L;
const T = TD.T, out = [];
const DEFN = {
  gsm: ['GSM', 'GSM (grams per square metre) is the mass of one square metre of fabric. For woven fabric it can be calculated from ends per inch, picks per inch, yarn counts and crimp, or measured by weighing a cut sample of known area.'],
  warp: ['Warp consumption', 'Warp consumption is the weight of warp yarn needed to weave one metre of fabric. It depends on the number of ends across the reed, the yarn count, the crimp and the loss in preparation.'],
  weft: ['Weft consumption', 'Weft consumption is the weight of weft yarn needed to weave one metre of fabric. It depends on picks per inch, the width each pick must cross, the yarn count and the loss at the selvedge.'],
  cover: ['Cover factor', 'Cover factor describes how closely threads are packed relative to their thickness. It lets constructions with different counts and densities be compared on a single scale.'],
  yarn: ['Yarn count', 'Yarn count states how fine a yarn is. Indirect systems (Ne, Nm, NeK) give length per unit mass, so a higher number is finer. Direct systems (tex, denier) give mass per unit length, so a higher number is coarser.'],
  units: ['Unit conversion', 'Fabric specifications mix metric and imperial units: metres and yards for length, GSM and oz/yd² for weight, inches and centimetres for width. These converters keep them consistent.'],
  cost: ['Fabric costing', 'Woven fabric cost is built from yarn used per metre, sizing, weaving, dyeing and finishing, adjusted for wastage. The result depends entirely on the prices you enter.'],
  compare: ['Specification comparison', 'Comparing two constructions means putting their weight, density, balance and yarn fineness side by side so that the trade-off between them is visible.']
};
const READ = {
  gsm: ['how-to-calculate-woven-fabric-gsm'], warp: ['how-to-calculate-woven-fabric-gsm'], weft: ['how-to-calculate-woven-fabric-gsm'],
  cover: ['cover-factor-and-fabric-balance'], yarn: ['yarn-count-systems-explained-ne-tex-denier-nm', 'ring-spun-vs-open-end-yarn-for-woven-fabric'],
  units: ['how-to-write-a-woven-fabric-specification-for-an-rfq'], cost: ['ready-stock-vs-custom-weave', 'how-to-write-a-woven-fabric-specification-for-an-rfq'],
  compare: ['cover-factor-and-fabric-balance', 'how-to-write-a-woven-fabric-specification-for-an-rfq']
};
const JOURNAL = {
  gsm: [['how-to-calculate-fabric-gsm-from-epi-ppi', 'How to calculate fabric GSM from EPI, PPI and yarn count']], warp: [['reed-and-pick', 'Reed and pick']], weft: [['reed-and-pick', 'Reed and pick']],
  cover: [['plain-twill-satin-weave-differences', 'Plain, twill and satin weave differences']], yarn: [['yarn-count-conversion-ne-nm-tex-denier', 'Yarn count conversion: Ne, Nm, Tex, Denier'], ['what-is-yarn-count', 'What is yarn count?']],
  units: [['gsm-width-fabric-cost', 'GSM, width and fabric cost']], cost: [['complete-guide-fabric-costing', 'Complete guide to fabric costing'], ['how-fabric-is-priced', 'How fabric is priced']],
  compare: [['how-to-compare-fabrics', 'How to compare fabrics']]
};
const fieldHTML = (part, f) => {
  const id = part + '-' + f.id;
  let ctl;
  if (f.type === 'select') ctl = '<select id="' + id + '" data-f="' + f.id + '">' + f.options.map(o => '<option value="' + attr(o[0]) + '"' + (o[0] === f.def ? ' selected' : '') + '>' + esc(o[1]) + '</option>').join('') + '</select>';
  else ctl = '<input id="' + id + '" data-f="' + f.id + '" type="number" inputmode="decimal" step="' + (f.step || 'any') + '" min="' + (f.min == null ? '' : f.min) + '" value="' + (f.def === '' ? '' : f.def) + '"' + (f.ph ? ' placeholder="' + attr(f.ph) + '"' : '') + '>';
  return '<div class="b2-field"><label for="' + id + '">' + esc(f.label) + (f.unit ? ' <span class="u">(' + esc(f.unit) + ')</span>' : '') + '</label>' + ctl + (f.hint ? '<small>' + esc(f.hint) + '</small>' : '') + '</div>';
};
function calcBox(key, slug, base, title) {
  const d = T[key]; let last = null, inputs = '';
  d.fields.forEach(f => { if (f.grp && f.grp !== last) { inputs += '<div class="grp">' + esc(f.grp) + '</div>'; last = f.grp; } inputs += fieldHTML(key, f); });
  const quote = base + 'quote/';
  return '<section class="b2-calc" data-part="' + key + '" data-slug="' + slug + '" data-quote="' + quote + '" aria-label="' + attr(title) + '"><h2>' + esc(title) + '</h2><div class="b2-calc-body"><div class="b2-in">' + inputs + '</div><div class="b2-out" aria-live="polite"><div class="b2-res"></div><div class="b2-actions"><a class="btn btn-invert" data-rfq href="' + quote + '">Send these specs to ENZO</a>' + L.waBtn(base, 'Discuss on WhatsApp', 'Calculator: ' + title, '', 'btn-secondary') + '<button type="button" class="btn btn-secondary" data-reset>Reset</button></div></div></div></section>';
}
const formulaBlock = d => '<div class="b2-formula">' + d.formula.map(f => '<div>' + esc(f) + '</div>').join('') + '</div>';
function example(key) {
  const d = T[key]; if (!d.compute || key === 'cost') return '';
  const v = {}; d.fields.forEach(f => v[f.id] = f.type === 'select' ? f.def : (f.def === '' ? NaN : f.def));
  const r = d.compute(v); if (!r) return '';
  const inputs = d.fields.filter(f => !(f.def === '' || (key === 'gsm' && 0))).map(f => [esc(f.label), esc(f.type === 'select' ? (f.options.find(o => o[0] === f.def) || [0, f.def])[1] : f.def + (f.unit ? ' ' + f.unit : ''))]);
  const res = r.cols ? r.rows.map(x => [esc(x.k), esc(x.vals[0]) + ' / ' + esc(x.vals[1])]) : r.rows.filter(x => !x.head).map(x => [esc(x.k), esc(x.v + (x.u ? ' ' + x.u : ''))]);
  return '<h2>Worked example</h2><p>' + (key === 'compare' ? 'Placeholder values to show the tool at work; they are not ENZO specifications.' : 'The default values in the calculator give the following result.') + '</p><div class="b2-split"><div><h3>Inputs</h3>' + table(null, inputs) + '</div><div><h3>Results</h3>' + table(null, res) + '</div></div>';
}
const TOOL_ORDER = ['gsm', 'warp', 'weft', 'cover', 'yarn', 'units', 'cost', 'compare'];

TOOL_ORDER.forEach(key => {
  const d = T[key], slug = d.slug, p = 'tools/' + slug + '/', base = L.baseOf(p), crumbs = [['Home', ''], ['Tools', 'tools/'], [d.name, p]];
  let calc = '';
  if (key === 'gsm') calc = calcBox('gsm', slug, base, 'Calculate GSM from construction') + calcBox('gsmSample', slug, base, 'Or: GSM from a weighed cut sample');
  else if (key === 'units') calc = d.parts.map(k => calcBox(k, slug, base, T[k].name)).join('');
  else calc = calcBox(key, slug, base, d.name);
  const extraFormulas = key === 'gsm' ? '<h3>Cut-sample method</h3>' + formulaBlock(T.gsmSample) : key === 'units' ? '<h3>Unit definitions</h3><div class="b2-formula">' + d.parts.map(k => T[k].formula.map(f => '<div>' + esc(f) + '</div>').join('')).join('') + '</div>' : '';
  const dn = DEFN[key];
  const rel = (READ[key] || []).map(s => '<a href="' + base + KM.KC(s) + '">' + esc(KM.bySlug[s].short) + '<small>Knowledge Centre</small></a>').join('') + (JOURNAL[key] || []).map(j => '<a href="' + base + 'journal/' + j[0] + '.html">' + esc(j[1]) + '<small>Journal</small></a>').join('') +
    TOOL_ORDER.filter(k => k !== key).slice(0, 3).map(k => '<a href="' + base + 'tools/' + T[k].slug + '/">' + esc(T[k].name) + '<small>Tool</small></a>').join('');
  const body = head(base, crumbs, esc(d.h1), esc(d.intro), null, 'wide') +
    sec('<p class="small b2-noprint" style="margin-bottom:var(--s2)">Free to use, no sign-up. Calculations run in your browser; nothing is sent to ENZO unless you press a button.</p>' + calc +
      '<div class="b2-def"><strong>Definition: ' + esc(dn[0]) + '</strong>' + esc(dn[1]) + '</div>') +
    sec('<h2>' + (d.formula ? 'Formula' : 'Formulas and definitions') + '</h2>' + (d.formula ? formulaBlock(d) : '') + (d.derivation ? '<div class="b2-prose"><h3>Where it comes from</h3><p>' + esc(d.derivation) + '</p></div>' : '') + extraFormulas + (key === 'yarn' ? '<h3>Conversion table (relative to tex)</h3>' + table(['From', 'Formula to tex', 'Formula from tex'], [['Ne', 'tex = 590.541 ÷ Ne', 'Ne = 590.541 ÷ tex'], ['Nm', 'tex = 1000 ÷ Nm', 'Nm = 1000 ÷ tex'], ['Denier', 'tex = denier ÷ 9', 'denier = tex × 9'], ['NeK (worsted)', 'tex = 885.81 ÷ NeK', 'NeK = 885.81 ÷ tex']]) : ''), 'alt') +
    sec(example(key) + '<h2>Assumptions and limits</h2><ul class="b2-prose">' + d.assume.map(a => '<li>' + esc(a) + '</li>').join('') + d.notes.map(a => '<li>' + esc(a) + '</li>').join('') + '</ul>') +
    sec('<div class="b2-split"><div><h2>Frequently asked</h2>' + faqHTML(d.faq) + '</div><div><h2>Related</h2><div class="b2-related" style="grid-template-columns:1fr">' + rel + '</div></div></div>', 'alt') +
    ctaBand(base, 'Have a construction in mind?', 'Send the figures from this tool with your RFQ. ENZO reviews the specification before quoting.', 'src=' + slug, 'Tool: ' + d.name);
  const ld = [{ '@type': 'SoftwareApplication', name: d.name, description: d.desc, url: url(p), applicationCategory: 'BusinessApplication', operatingSystem: 'Any (web browser)', isAccessibleForFree: true, publisher: { '@id': SITE + '/#organization' }, inLanguage: 'en' }, faqLD(d.faq)];
  out.push({ path: p, html: page({ path: p, title: (d.seoTitle || d.name + ' — Free Online Tool') + ' | ENZO', desc: d.desc, crumbs, ld, body, scripts: ['js/tool-defs.js', 'js/b2-tools.js'] }) });
});

/* tools hub */
(function () {
  const p = 'tools/', base = L.baseOf(p), crumbs = [['Home', ''], ['Tools', p]];
  const cards = TOOL_ORDER.map(k => '<a class="b2-card" href="' + base + 'tools/' + T[k].slug + '/"><span class="b2-kicker">Calculator</span><h3>' + esc(T[k].name) + '</h3><p>' + esc(T[k].short) + '.</p><span class="more">Open tool →</span></a>').join('');
  const faq = [['Are the calculators free?', 'Yes. They run in your browser, need no sign-up and send nothing to ENZO unless you press a button.'], ['How accurate are the results?', 'Results are theoretical values from standard textile formulas using the numbers you enter. Real fabric varies with crimp, sizing, finishing and moisture, so confirm against a weighed sample.'], ['Can I send a result to ENZO?', 'Yes. Each tool has a button that carries your inputs into the RFQ form or into a WhatsApp message.']];
  const body = head(base, crumbs, 'Textile Calculators for Woven Fabric Buyers and Mills', 'Eight free tools for the numbers behind a woven-fabric specification: weight, consumption, construction, yarn counts, units, cost and side-by-side comparison. Formulas are shown on every page.', rfqBtn(base, 'Request a quote') + waBtn(base, 'Discuss specs on WhatsApp', 'Tools hub'), 'wide') +
    sec('<div class="b2-grid c4">' + cards + '</div>') + sec('<div class="b2-split"><div><h2>How to use them together</h2><ol class="b2-prose"><li>Convert counts to a common basis with the yarn count converter.</li><li>Calculate GSM and cover factor for your construction.</li><li>Compare two candidate constructions side by side.</li><li>Estimate yarn consumption and cost with your own prices.</li><li>Send the figures to ENZO with your RFQ.</li></ol></div><div><h2>Frequently asked</h2>' + faqHTML(faq) + '</div></div>', 'alt') +
    ctaBand(base, 'Turn the numbers into a quotation', 'Every tool can pass its inputs to the RFQ form.', '', 'Tools hub');
  out.push({ path: p, html: page({ path: p, title: 'Textile Calculators: GSM, Yarn Count, Cost | ENZO Textiles', desc: 'Free calculators for woven fabric: GSM, warp and weft consumption, cover factor, yarn count converter, unit converter, cost estimator and specification comparison.', crumbs, pageType: 'CollectionPage', ld: [{ '@type': 'ItemList', itemListElement: TOOL_ORDER.map((k, i) => ({ '@type': 'ListItem', position: i + 1, name: T[k].name, url: url('tools/' + T[k].slug + '/') })) }, faqLD(faq)], body }) });
})();
module.exports = out;
