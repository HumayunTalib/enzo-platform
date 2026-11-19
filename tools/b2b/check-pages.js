const fs = require('fs'), path = require('path');
const pages = []; (function walk(d) { fs.readdirSync(d).forEach(f => { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) { if (f !== 'b2b' && f !== 'store-backend') walk(p); } else if (f === 'index.html') pages.push({ path: d + '/' }); }); })('.');
const ROOTS = ['products', 'manufacturing', 'international-buyers', 'tools', 'knowledge-centre', 'quote', 'resources'];
for (let i = pages.length - 1; i >= 0; i--) { const p = pages[i].path.replace(/^\.\//, ''); if (!ROOTS.includes(p.split('/')[0])) pages.splice(i, 1); else pages[i].path = p; }
let bad = 0; const titles = new Set();
pages.forEach(pg => {
  const f = pg.path + 'index.html', h = fs.readFileSync(f, 'utf8'), e = m => { console.log('FAIL', pg.path, m); bad++; };
  if ((h.match(/<h1[ >]/g) || []).length !== 1) e('h1 count ' + (h.match(/<h1[ >]/g) || []).length);
  [...h.matchAll(/<img\b[^>]*>/g)].forEach(m => { if (!/\balt="/.test(m[0])) e('img without alt'); });
  if (!/<link rel="canonical" href="https:\/\/enzolhr\.com\/[^"]*">/.test(h)) e('canonical');
  const t = (h.match(/<title>(.*?)<\/title>/) || [])[1]; if (!t || titles.has(t)) e('title dup/missing'); titles.add(t);
  [...h.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)<\/script>/g)].forEach(m => { try { const j = JSON.parse(m[1]); if (!j['@graph']) e('no graph'); } catch (x) { e('JSON-LD invalid: ' + x.message); } });
  if (/\{\{|undefined|\[object/.test(h.replace(/<script[\s\S]*?<\/script>/g, ''))) e('template leak');
  if (!/<footer class="site-footer">/.test(h) || !/class="nav"/.test(h)) e('chrome missing');
  if (/lorem|TODO|FIXME/i.test(h)) e('placeholder text');
});
console.log('pages checked', pages.length, 'problems', bad); process.exit(bad ? 1 : 0);
