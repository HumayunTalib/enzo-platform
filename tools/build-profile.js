/* Renders assets/enzo-company-profile.pdf from docs/company-profile/*.html
   Requires: npm install --no-save puppeteer */
const fs = require('fs'), path = require('path'), puppeteer = require('puppeteer');
const root = path.join(__dirname, '..');
const src  = path.join(root, 'docs', 'company-profile');
const out  = path.join(root, 'assets', 'enzo-company-profile.pdf');

(async () => {
  const logo = 'data:image/png;base64,' +
    fs.readFileSync(path.join(root, 'assets/logo/enzo-logo.png')).toString('base64');
  const html = (fs.readFileSync(path.join(src, 'profile.head.html'), 'utf8') +
                fs.readFileSync(path.join(src, 'profile.body.html'), 'utf8'))
                .replace(/LOGO_SRC/g, logo);
  const tmp = path.join(src, '.build.html');
  fs.writeFileSync(tmp, html);

  const b = await puppeteer.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const p = await b.newPage();
  await p.goto('file://' + tmp, { waitUntil: 'networkidle0', timeout: 60000 });
  try { await p.evaluate(() => document.fonts.ready); } catch (e) {}
  await p.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true,
                margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await b.close();
  fs.unlinkSync(tmp);
  console.log('rendered →', path.relative(root, out),
              (fs.statSync(out).size / 1024).toFixed(0) + ' KB');
})();
