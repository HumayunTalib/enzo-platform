// Static internal-link + anchor checker over every .html file served from the repo root.
const fs = require('fs'), path = require('path');
const SKIP = ['partials', 'node_modules', 'dist', 'queue', 'content', 'docs', 'data', '.git'];
const files = []; (function walk(d) { fs.readdirSync(d).forEach(f => { const p = d === '.' ? f : path.join(d, f); if (fs.statSync(p).isDirectory()) { if (!SKIP.includes(f) && f[0] !== '.') walk(p); } else if (f.endsWith('.html') && !/article-template/.test(f)) files.push(p); }); })('.');
const ids = {}; const getIds = f => ids[f] || (ids[f] = new Set([...fs.readFileSync(f, 'utf8').matchAll(/\sid="([^"]+)"/g)].map(m => m[1])));
let bad = 0, n = 0;
files.forEach(file => {
  const html = fs.readFileSync(file, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
  [...html.matchAll(/(?:href|src)="([^"#][^"]*|#[^"]*)"/g)].forEach(m => {
    let u = m[1]; if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(u)) return;
    const [rawPath, hash] = u.split('#'); const clean = rawPath.split('?')[0]; n++;
    let target = clean === '' ? file : path.normalize(path.join(path.dirname(file), clean));
    if (clean !== '') { if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html'); }
    if (!fs.existsSync(target)) { console.log('BROKEN', file, '->', u); bad++; return; }
    if (hash && target.endsWith('.html') && !getIds(target).has(hash)) { console.log('MISSING ANCHOR', file, '->', u); bad++; }
  });
});
console.log('checked ' + n + ' links in ' + files.length + ' files; problems: ' + bad); process.exit(bad ? 1 : 0);
