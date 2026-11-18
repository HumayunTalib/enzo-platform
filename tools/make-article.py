#!/usr/bin/env python3
"""Build a Journal article for the publish queue.
Usage: python3 tools/make-article.py content/<slug>.json
The JSON holds the metadata; the article body is HTML in content/<slug>.body.html.
Output: queue/<slug>.html + queue/<slug>.meta.json + assets/journal/og-<slug>.png
Then publish with:  node tools/publish-queue.js   (publishes everything whose publish_date has arrived)
"""
import json, re, sys, os, html, textwrap, datetime
from PIL import Image, ImageDraw, ImageFont
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = json.load(open(sys.argv[1]))
slug = spec['slug']
body = open(os.path.join(root, 'content', slug + '.body.html')).read()
text = re.sub(r'<[^>]+>', ' ', body); words = len(re.findall(r"[A-Za-z0-9’'×./%-]+", html.unescape(text)))
read = max(3, round(words / 200))
esc = lambda x: html.escape(x, quote=True)
t = open(os.path.join(root, 'tools/article-template.html')).read()
rep = {'{{SLUG}}': slug, '{{H1}}': esc(spec['h1']), '{{SEO_TITLE}}': esc(spec['seo_title']), '{{DESC}}': esc(spec['desc']),
       '{{KEYWORDS}}': esc(spec['keywords']), '{{WORDS}}': str(words), '{{READ}}': str(read), '{{CATEGORY}}': esc(spec['category']), '{{BODY}}': body}
for k, v in rep.items(): t = t.replace(k, v)
# JSON-LD headline uses H1 inside JSON: undo html-escaping of quotes/amps there is unnecessary because h1 has none of them by rule
t = t.replace('funnel_stage" value="mofu"', 'funnel_stage" value="%s"' % spec.get('stage', 'mofu'))
open(os.path.join(root, 'queue', slug + '.html'), 'w').write(t)
meta = {'slug': slug, 'publish_date': spec.get('publish_date', datetime.date.today().isoformat()), 'h1': spec['h1'], 'excerpt': spec['excerpt'],
        'category': spec['category'], 'cluster': str(spec['cluster']), 'stage': spec.get('stage', 'mofu'), 'pk': spec['pk'],
        'chips': spec.get('chips', []), 'backlinks': spec.get('backlinks', [])}
json.dump(meta, open(os.path.join(root, 'queue', slug + '.meta.json'), 'w'), indent=2, ensure_ascii=False)
# OG image in the existing style
W, H = 1200, 630
im = Image.new('RGB', (W, H)); d = ImageDraw.Draw(im)
for y in range(H):
    k = y / H; d.line([(0, y), (W, y)], fill=(int(14 + (30 - 14) * k), int(22 + (53 - 22) * k), int(64 + (133 - 64) * k)))
logo = Image.open(os.path.join(root, 'assets/logo/enzo-textiles-white.png')).convert('RGBA'); lw = 260; logo = logo.resize((lw, int(logo.height * lw / logo.width)))
im.paste(logo, (72, 70), logo)
fb = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 54); fs = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 28)
fm = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', 26)
y = 230
for line in textwrap.wrap(spec['og_title'], 28)[:3]:
    d.text((72, y), line, font=fb, fill='white'); y += 72
d.text((72, y + 8), spec['og_sub'], font=fs, fill=(159, 176, 238))
d.rectangle([72, 548, 132, 553], fill=(79, 107, 216)); d.text((72, 568), 'enzolhr.com  ·  The Fabric Journal', font=fm, fill=(213, 220, 247))
im.save(os.path.join(root, 'assets/journal/og-%s.png' % slug), optimize=True)
print(slug, words, 'words', read, 'min')
