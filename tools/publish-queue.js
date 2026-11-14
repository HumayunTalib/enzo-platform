#!/usr/bin/env node
/* Publishes scheduled Journal articles.
 *   node tools/publish-queue.js              publish everything due today (UTC)
 *   node tools/publish-queue.js --date 2026-12-01   pretend it is that date (testing)
 *   node tools/publish-queue.js --dry        show what would be published
 * Queue layout: queue/<slug>.html (page with {{PUB_DATE}} tokens) + queue/<slug>.meta.json
 * Each article goes live on the day the script actually runs it, and that real date is what
 * appears on the page, in the schema, the Journal list and the sitemap.
 */
var fs = require('fs'), path = require('path');
var root = path.resolve(__dirname, '..');
var args = process.argv.slice(2);
var dry = args.indexOf('--dry') > -1;
var di = args.indexOf('--date');
var today = di > -1 ? args[di + 1] : new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) { console.error('bad date'); process.exit(1); }
var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function human(d) { var p = d.split('-'); return parseInt(p[2], 10) + ' ' + MONTHS[parseInt(p[1], 10) - 1] + ' ' + p[0]; }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function rd(p) { return fs.readFileSync(path.join(root, p), 'utf8'); }
function wr(p, s) { fs.writeFileSync(path.join(root, p), s); }

var qdir = path.join(root, 'queue');
if (!fs.existsSync(qdir)) { console.log('no queue folder'); process.exit(0); }
var metas = fs.readdirSync(qdir).filter(function (f) { return /\.meta\.json$/.test(f); })
  .map(function (f) { return JSON.parse(rd('queue/' + f)); })
  .filter(function (m) { return m.publish_date <= today; })
  .sort(function (a, b) { return a.publish_date < b.publish_date ? -1 : 1; });
if (!metas.length) { console.log('nothing due on ' + today); process.exit(0); }

var published = [];
metas.forEach(function (m) {
  var pagePath = 'queue/' + m.slug + '.html';
  if (!fs.existsSync(path.join(root, pagePath))) { console.warn('missing page for ' + m.slug); return; }
  console.log((dry ? '[dry] ' : '') + 'publish ' + m.slug + ' (scheduled ' + m.publish_date + ', live ' + today + ')');
  if (dry) return;

  /* 1. page */
  var html = rd(pagePath).split('{{PUB_DATE_H}}').join(human(today)).split('{{PUB_DATE}}').join(today)
    .replace('<meta name="robots" content="noindex,nofollow">', '<meta name="robots" content="index,follow,max-image-preview:large">');
  wr('journal/' + m.slug + '.html', html);

  /* 2. Journal list (top of list) */
  var jl = rd('journal.html');
  if (jl.indexOf('journal/' + m.slug + '.html') < 0) {
    var row = '    <div class="post-row" data-cluster="' + m.cluster + '" data-stage="' + m.stage + '">\n' +
      '      <div class="post-index">NEW</div>\n      <div>\n' +
      '        <a href="journal/' + m.slug + '.html" class="post-title" style="display:block;">' + esc(m.h1) + '</a>\n' +
      '        <p class="post-excerpt">' + esc(m.excerpt) + '</p>\n' +
      '        <div class="kw-row"><span class="kw-chip primary">' + esc(m.pk) + '</span>' + (m.chips || []).map(function (c) { return '<span class="kw-chip">' + esc(c) + '</span>'; }).join('') + '</div>\n      </div>\n' +
      '      <div class="post-side">\n        <span class="stage ' + m.stage + '">' + m.stage.toUpperCase() + '</span>\n' +
      '        <span class="xs" style="font-family:var(--mono);">' + today + '</span>\n' +
      '        <span class="xs" style="color:var(--slate-soft);">' + esc(m.category) + '</span>\n      </div>\n    </div>\n';
    jl = jl.replace('<div class="post-list" id="post-list">\n', '<div class="post-list" id="post-list">\n' + row);
    if (m.cluster === '16' && jl.indexOf('data-cluster-filter="16"') < 0) {
      jl = jl.replace(/(data-cluster-filter="15">[^<]*<\/button>)/, '$1<button type="button" class="filter-btn" data-cluster-filter="16">Trade &amp; Compliance</button>');
    }
    wr('journal.html', jl);
  }

  /* 3. sitemap */
  var sm = rd('sitemap.xml'), loc = 'https://enzolhr.com/journal/' + m.slug + '.html';
  if (sm.indexOf(loc) < 0) {
    sm = sm.replace('</urlset>', '  <url>\n    <loc>' + loc + '</loc>\n    <lastmod>' + today + '</lastmod>\n  </url>\n</urlset>');
    wr('sitemap.xml', sm);
  }

  /* 4. contextual links from existing articles to the new one */
  (m.backlinks || []).forEach(function (slug) {
    var p = 'journal/' + slug + '.html';
    if (!fs.existsSync(path.join(root, p))) return;
    var t = rd(p);
    if (t.indexOf('href="' + m.slug + '.html"') > -1) return;
    var li = '<li><a href="' + m.slug + '.html">' + esc(m.h1) + '</a></li>';
    if (t.indexOf('class="article-related"') > -1) {
      t = t.replace(/(<div class="article-related">[\s\S]*?<ul>[\s\S]*?)(<\/ul>)/, '$1' + li + '$2');
    } else if (t.indexOf('<div class="card mt-6"') > -1) {
      t = t.replace('<div class="card mt-6"', '<div class="article-related"><p class="label">Related guides</p><ul>' + li + '</ul></div>\n    <div class="card mt-6"');
    } else return;
    wr(p, t);
  });

  /* 5. remove from queue */
  fs.unlinkSync(path.join(root, pagePath));
  fs.unlinkSync(path.join(root, 'queue/' + m.slug + '.meta.json'));
  published.push({ slug: m.slug, scheduled: m.publish_date, live: today });
});

if (published.length) {
  var logp = 'queue/published.json', log = fs.existsSync(path.join(root, logp)) ? JSON.parse(rd(logp)) : [];
  wr(logp, JSON.stringify(log.concat(published), null, 2) + '\n');
}
console.log('done: ' + published.length + ' published');
