/* Generates the B2B pages (products, manufacturing, buyers, tools, knowledge centre, quote, resources)
 * and registers them in sitemap.xml. Idempotent. Run directly or via build.js. */
const fs = require('fs');
const path = require('path');
const SITE = 'https://enzolhr.com';
const modules = ['pages-commercial', 'pages-tools', 'pages-kc', 'pages-quote'];
const pages = [].concat.apply([], modules.map(m => require('./b2b/' + m + '.js')));
const seenT = {}, seenD = {}; let problems = 0;
pages.forEach(pg => {
  const t = (pg.html.match(/<title>(.*?)<\/title>/) || [])[1], d = (pg.html.match(/<meta name="description" content="(.*?)">/) || [])[1];
  if (seenT[t]) { console.error('DUPLICATE TITLE', pg.path, seenT[t]); problems++; } seenT[t] = pg.path;
  if (seenD[d]) { console.error('DUPLICATE DESCRIPTION', pg.path, seenD[d]); problems++; } seenD[d] = pg.path;
  if (t && t.replace(/&amp;/g, '&').length > 70) console.warn('long title (' + t.length + '):', pg.path);
  if (d && d.replace(/&amp;/g, '&').replace(/&quot;/g, '"').length > 165) console.warn('long description (' + d.length + '):', pg.path);
  const dir = pg.path.replace(/\/$/, '');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), pg.html);
});
console.log('b2b pages → ' + pages.length + ' generated');
// sitemap: add any missing URL, never remove or reorder existing ones (the publisher owns the journal entries)
try {
  let sm = fs.readFileSync('sitemap.xml', 'utf8'), add = '';
  const today = '2026-11-19';
  pages.forEach(pg => { const loc = SITE + '/' + pg.path; if (sm.indexOf('<loc>' + loc + '</loc>') === -1) add += '  <url>\n    <loc>' + loc + '</loc>\n    <lastmod>' + today + '</lastmod>\n  </url>\n'; });
  if (add) { sm = sm.replace('</urlset>', add + '</urlset>'); fs.writeFileSync('sitemap.xml', sm); console.log('sitemap → added ' + (add.match(/<url>/g) || []).length + ' URLs'); }
} catch (e) { console.warn('sitemap not updated:', e.message); }
if (problems) process.exitCode = 1;
module.exports = { pages };
