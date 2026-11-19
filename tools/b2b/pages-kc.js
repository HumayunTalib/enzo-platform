const L = require('./layout.js');
const KM = require('./kc-meta.js');
const A = require('./kc-articles.js');
const TD = require('../../js/tool-defs.js');
const { esc, attr, page, head, sec, ctaBand, faqHTML, faqLD, rfqBtn, waBtn, SITE, url } = L;
const out = [];
const pillarOf = id => KM.PILLARS.find(p => p.id === id);
const SEO = {
  'yarn-count-systems-explained-ne-tex-denier-nm': 'Yarn Count Systems: Ne, Nm, Tex, Denier, 36/1 vs 36/2 | ENZO',
  'ring-spun-vs-open-end-yarn-for-woven-fabric': 'Ring-Spun vs Open-End Yarn for Woven Fabric | ENZO',
  'how-to-calculate-woven-fabric-gsm': 'Woven Fabric GSM Formula: EPI, PPI and Yarn Count | ENZO',
  'cover-factor-and-fabric-balance': 'Cover Factor and Fabric Balance in Woven Fabric | ENZO',
  'how-to-write-a-woven-fabric-specification-for-an-rfq': 'How to Write a Woven Fabric Specification for an RFQ | ENZO',
  'ready-stock-vs-custom-weave': 'Ready Stock vs Custom Weave for Bulk Fabric | ENZO',
  'shuttleless-looms-for-suiting-fabric': 'Shuttleless Looms: Air-Jet, Rapier, Projectile, Water-Jet | ENZO',
  'bulk-fabric-pre-shipment-inspection': 'Pre-Shipment Fabric Inspection and the 4-Point System | ENZO'
};
const DATE = '2026-11-19', DATE_H = '19 November 2026';

/* hub */
(function () {
  const p = 'knowledge-centre/', base = L.baseOf(p), crumbs = [['Home', ''], ['Knowledge Centre', p]];
  const chips = '<div class="b2-chips" role="group" aria-label="Filter by topic"><button type="button" class="b2-chip" data-filter="all" aria-pressed="true">All topics</button>' + KM.PILLARS.map(pl => '<button type="button" class="b2-chip" data-filter="' + pl.id + '" aria-pressed="false">' + esc(pl.name) + '</button>').join('') + '</div>';
  const blocks = KM.PILLARS.map(pl => {
    const list = KM.ARTICLES.filter(a => a.pillar === pl.id);
    return '<div data-pillar-block="' + pl.id + '" style="margin-top:var(--s5)" id="' + pl.id + '"><h2>' + esc(pl.name) + '</h2><p class="lead">' + esc(pl.blurb) + '</p><div class="b2-grid c2" style="margin-top:var(--s3)">' + list.map(a => '<a class="b2-card" data-pillar="' + pl.id + '" href="' + base + 'knowledge-centre/' + a.slug + '/"><span class="b2-kicker">' + esc(pl.name) + '</span><h3>' + esc(a.title) + '</h3><p>' + esc(a.desc) + '</p><span class="more">Read article →</span></a>').join('') + '</div></div>';
  }).join('');
  const faq = [['What is the Knowledge Centre?', 'A set of technical guides on yarn, fabric construction, buying and quality control for people who specify or buy woven fabric. Each article shows its formulas and sources.'], ['How is it different from the Journal?', 'The Journal covers fabric topics in a general buyer-guide style. The Knowledge Centre is organised into four technical topics and links directly to the calculators.']];
  const body = head(base, crumbs, 'Knowledge Centre: Woven Fabric Engineering and B2B Sourcing', 'Technical guides for buyers, designers and mills: how yarn counts work, how GSM and cover factor are calculated, how to write a specification, how looms insert the weft and how inspection is scored.', rfqBtn(base, 'Request a quote') + '<a class="btn btn-secondary" href="' + base + 'tools/">Open the calculators</a>', 'wide') +
    sec(chips + blocks) +
    sec('<div class="b2-split"><div><h2>Also on ENZO</h2><div class="b2-related"><a href="' + base + 'journal.html">The Journal<small>General fabric buyer guides</small></a><a href="' + base + 'tools/">Calculators<small>GSM, yarn count, cost and more</small></a><a href="' + base + 'resources/">Resource guides<small>Printable templates and checklists</small></a><a href="' + base + 'products/">Products<small>Specification blocks and RFQ</small></a></div></div><div><h2>Frequently asked</h2>' + faqHTML(faq) + '</div></div>', 'alt') +
    ctaBand(base, 'Need a fabric specified, not just explained?', 'Send what you know; ENZO reviews the specification before quoting.', '', 'Knowledge Centre');
  out.push({ path: p, html: page({ path: p, title: 'Knowledge Centre: Woven Fabric Guides | ENZO Textiles', desc: 'Technical guides on yarn count, GSM, cover factor, fabric specification, shuttleless looms and inspection for woven-fabric buyers and mills.', crumbs, pageType: 'CollectionPage', ld: [{ '@type': 'ItemList', itemListElement: KM.ARTICLES.map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: a.title, url: url(KM.KC(a.slug)) })) }, faqLD(faq)], body, scripts: ['js/b2-kc.js'] }) });
})();

/* articles */
KM.ARTICLES.forEach(a => {
  const d = A[a.slug]; if (!d) throw new Error('missing article ' + a.slug);
  const p = KM.KC(a.slug), base = L.baseOf(p), pl = pillarOf(a.pillar), crumbs = [['Home', ''], ['Knowledge Centre', 'knowledge-centre/'], [a.title, p]];
  let bodyHtml = d.body.replace('<div id="toc-anchor"></div>', '');
  const heads = []; bodyHtml.replace(/<h2 id="([^"]+)">(.*?)<\/h2>/g, (m, id, t) => { heads.push([id, t.replace(/<[^>]+>/g, '')]); return m; });
  const words = bodyHtml.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length, mins = Math.max(2, Math.round(words / 200));
  const toc = heads.length ? '<nav class="b2-toc" aria-label="Table of contents"><strong>In this article</strong><ol>' + heads.map(h => '<li><a href="#' + h[0] + '">' + esc(h[1]) + '</a></li>').join('') + '</ol></nav>' : '';
  const sources = d.sources.length ? '<h2 id="sources">Sources</h2><ul class="b2-sources">' + d.sources.map(s => '<li><a href="' + s[1] + '" rel="noopener noreferrer" target="_blank">' + esc(s[0]) + '</a></li>').join('') + '</ul>' : '';
  const faqBlock = '<h2 id="faq">Frequently asked questions</h2>' + faqHTML(d.faq);
  const rel = d.related.map(s => '<a href="' + base + KM.KC(s) + '">' + esc(KM.bySlug[s].short) + '<small>Knowledge Centre</small></a>').join('') + d.tools.map(s => '<a href="' + base + 'tools/' + s + '/">' + esc(s.replace(/-/g, ' ').replace(/^./, c => c.toUpperCase())) + '<small>Calculator</small></a>').join('') + d.journal.map(j => '<a href="' + base + 'journal/' + j[0] + '.html">' + esc(j[1]) + '<small>Journal</small></a>').join('');
  const specLine = 'Article: ' + a.title;
  const body = '<section class="b2-head wide"><div class="container">' + L.crumbsHTML(crumbs, base) + '<p class="b2-kicker" style="margin-top:var(--s2)">' + esc(pl.name) + '</p><h1>' + esc(a.title) + '</h1><p class="b2-meta">By ENZO Textiles · Published <time datetime="' + DATE + '">' + DATE_H + '</time> · ' + mins + ' min read</p></div></section>' +
    sec('<div class="b2-article">' + toc + bodyHtml + faqBlock + sources + '<h2 id="related">Keep reading</h2><div class="b2-related">' + rel + '</div></div>') +
    ctaBand(base, 'Turn this into a specification', 'Send ENZO your construction. We review the specification before quoting.', 'src=' + a.slug, specLine);
  const ld = [{ '@type': 'Article', '@id': url(p) + '#article', headline: a.title, description: a.desc, datePublished: DATE, dateModified: d.updated || DATE, author: { '@type': 'Organization', name: 'ENZO Textiles', url: SITE + '/' }, publisher: { '@type': 'Organization', name: 'ENZO Textiles', url: SITE + '/', logo: { '@type': 'ImageObject', url: SITE + '/assets/logo/enzo-textiles.png' } }, mainEntityOfPage: { '@id': url(p) + '#webpage' }, articleSection: pl.name, keywords: a.kw, inLanguage: 'en', wordCount: words, image: SITE + '/assets/og-image.png' }, faqLD(d.faq)];
  const meta = '<meta property="article:published_time" content="' + DATE + '">\n<meta property="article:modified_time" content="' + (d.updated || DATE) + '">\n<meta property="article:section" content="' + attr(pl.name) + '">\n';
  out.push({ path: p, html: page({ path: p, title: SEO[a.slug], ogTitle: a.title, desc: a.desc, crumbs, ld, body, ogType: 'article', articleMeta: meta, pageType: 'WebPage' }), words });
});
module.exports = out;
