// Shared layout + helpers for generated B2B pages. Header/footer/mobile-nav are filled by build.js syncPartials().
const fs = require('fs');
const SITE = 'https://enzolhr.com';
const ORG = { '@type': 'Organization', '@id': SITE + '/#organization', name: 'ENZO Textiles', url: SITE + '/' };
const CSP = (fs.readFileSync('about.html', 'utf8').match(/Content-Security-Policy" content="([^"]*)"/) || [])[1];
const CSS_V = 14;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attr = esc;
const VERIFY = '<span class="b2-verify">[VERIFY SPEC]</span>';
const VERIFY_X = t => '<span class="b2-verify">[VERIFY SPEC]</span>' + (t ? ' <span class="small">' + t + '</span>' : '');

function depthOf(p) { return p.replace(/\/$/, '').split('/').filter(Boolean).length; }
function baseOf(p) { return '../'.repeat(depthOf(p)); }
const url = p => SITE + '/' + p;

function breadcrumbLD(items) {
  return { '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it[0], item: it[1].startsWith('http') ? it[1] : url(it[1]) })) };
}
function crumbsHTML(items, base) {
  return '<nav class="b2-crumbs" aria-label="Breadcrumb">' + items.map((it, i) => i === items.length - 1 ? '<span aria-current="page">' + esc(it[0]) + '</span>' : '<a href="' + base + (it[1].replace(SITE + '/', '') || 'index.html') + '">' + esc(it[0]) + '</a><span aria-hidden="true">/</span>').join(' ') + '</nav>';
}
const WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/></svg>';
function waBtn(base, label, extra, spec, cls) {
  return '<a class="btn ' + (cls || 'btn-wa') + '" href="https://wa.me/923126418414" data-wa="' + attr(extra || '') + '"' + (spec ? ' data-wa-spec="' + attr(spec) + '"' : '') + ' data-track="whatsapp_cta_clicked" data-track-label="' + attr(label) + '">' + WA_ICON + esc(label || 'Discuss specs on WhatsApp') + '</a>';
}
function rfqBtn(base, label, qs, cls) { return '<a class="btn ' + (cls || 'btn-primary') + '" href="' + base + 'quote/' + (qs ? '?' + qs : '') + '" data-track="rfq_cta_clicked" data-track-label="' + attr(label || 'Request a quote') + '">' + esc(label || 'Request a quote') + '</a>'; }
function ctaBand(base, h, p, qs, spec) {
  return '<section class="b2-cta"><div class="container"><h2>' + h + '</h2><p>' + p + '</p><div class="b2-actions">' + rfqBtn(base, 'Request a quote', qs, 'btn-invert') + waBtn(base, 'Discuss specs on WhatsApp', '', spec, 'btn-ghost-light') + '</div></div></section>';
}
function faqHTML(list) { return '<div class="b2-faq">' + list.map(q => '<details><summary>' + esc(q[0]) + '</summary><p>' + esc(q[1]) + '</p></details>').join('') + '</div>'; }
function faqLD(list) { return { '@type': 'FAQPage', mainEntity: list.map(q => ({ '@type': 'Question', name: q[0], acceptedAnswer: { '@type': 'Answer', text: q[1] } })) }; }
function table(head, rows, opt) {
  opt = opt || {};
  return '<div class="b2-table-wrap"><table class="b2-table">' + (head ? '<thead><tr>' + head.map(h => '<th scope="col">' + h + '</th>').join('') + '</tr></thead>' : '') + '<tbody>' + rows.map(r => '<tr>' + r.map((c, i) => (i === 0 && !opt.noRowHead ? '<th scope="row">' + c + '</th>' : '<td>' + c + '</td>')).join('') + '</tr>').join('') + '</tbody></table></div>';
}

/* page({ path:'products/', title, desc, ogImage, crumbs:[[name,path]], ld:[...], body, scripts:[...], head: custom head html, headerClass }) */
function page(o) {
  const base = baseOf(o.path), canonical = url(o.path), og = o.ogImage || (SITE + '/assets/og-image.png');
  const graph = [{ '@type': o.pageType || 'WebPage', '@id': canonical + '#webpage', url: canonical, name: o.title, description: o.desc, isPartOf: { '@id': SITE + '/#website' }, publisher: { '@id': SITE + '/#organization' }, inLanguage: 'en' }]
    .concat(o.crumbs ? [breadcrumbLD(o.crumbs)] : []).concat(o.ld || []);
  const scripts = ['js/b2b-config.js', 'js/analytics.js', 'js/b2b.js', 'js/nav.js'].concat(o.scripts || []);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<title>${esc(o.title)}</title>
<meta name="description" content="${attr(o.desc)}">
<meta name="robots" content="${o.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="${o.ogType || 'website'}">
<meta property="og:site_name" content="ENZO Textiles">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${attr(o.ogTitle || o.title)}">
<meta property="og:description" content="${attr(o.desc)}">
<meta property="og:image" content="${og}">
<meta property="og:locale" content="en_PK">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${attr(o.ogTitle || o.title)}">
<meta name="twitter:description" content="${attr(o.desc)}">
<meta name="twitter:image" content="${og}">
${o.articleMeta || ''}<link rel="icon" href="${base}assets/logo/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="${base}assets/logo/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="${base}assets/logo/favicon-16.png">
<link rel="apple-touch-icon" href="${base}assets/logo/favicon-180.png">
<meta name="theme-color" content="#1E3585">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap">
<link rel="stylesheet" href="${base}output.css?v=${CSS_V}">
<script type="application/ld+json">
${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2)}
</script>
</head>
<body class="page-offset">
<!--#header-->
<header class="site-header is-static" id="site-header"></header>
<!--/#header-->
<!--#mobile-nav-->
<!--/#mobile-nav-->
<main id="main">
${o.body}
</main>
<!--#footer-->
<!--/#footer-->
${scripts.map(s => '<script src="' + base + s + '"></script>').join('\n')}
</body>
</html>
`;
  return html;
}

function head(base, crumbs, h1, lead, actions, cls) {
  return '<section class="b2-head ' + (cls || '') + '"><div class="container">' + crumbsHTML(crumbs, base) + '<h1>' + h1 + '</h1>' + (lead ? '<p class="lead">' + lead + '</p>' : '') + (actions ? '<div class="b2-actions">' + actions + '</div>' : '') + '</div></section>';
}
const sec = (inner, cls) => '<section class="b2-sec ' + (cls || '') + '"><div class="container">' + inner + '</div></section>';

module.exports = { SITE, ORG, esc, attr, VERIFY, VERIFY_X, depthOf, baseOf, url, breadcrumbLD, crumbsHTML, waBtn, rfqBtn, ctaBand, faqHTML, faqLD, table, page, head, sec, WA_ICON };
