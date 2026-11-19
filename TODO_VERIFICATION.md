# TODO: items ENZO must verify or supply

Everything below was deliberately left unfilled rather than guessed. Find every marker on the site with:
`grep -rn "VERIFY SPEC" --include=*.html . | grep -v node_modules` (they are generated from `data/b2b-products.json` and the page generators in `tools/b2b/`).

## 1. Specifications (shown as `[VERIFY SPEC]`)

For each of PV Suiting Fabrics, Men's Woven Suiting and Custom Greige & Dyed Woven (`data/b2b-products.json`):
- [ ] Composition and blend ratio per quality (PV ratio; cotton-blend ratio)
- [ ] Yarn count per quality (36/1, 37/1, 26/1 PV are stated as counts ENZO weaves; which qualities use which?)
- [ ] EPI × PPI and weave per quality (home lists Cotton 112×84, PV Blend 100×80, Poly Linen 80×72; confirm they are current)
- [ ] Width, GSM (with tolerance and basis), finish
- [ ] Minimum order quantity (greige / dyed / ready stock). The old site said 10,000 m: restore only if still true.
- [ ] Lead times by order type (manufacturing, international and RFQ pages say "stated in the quotation")
- [ ] Which finishing steps are done by whom (manufacturing page)
- [ ] Loom type of the 23 shuttleless looms (air-jet, rapier, projectile or water-jet)
- [ ] Blend ratio, widths, GSM and MOQ in the PV buyer's reference guide

## 2. Photography
- [ ] Men's Woven Suiting and Custom Greige/Dyed categories show a "to be supplied" slot
- [ ] Real photos for the manufacturing page (loom shed, inspection) if available
- [ ] PV category uses the real MOSES photos; confirm composition and GSM before claiming specs for MOSES

## 3. Contact and identity
- [ ] Address: new content uses "4th Floor, ENZO Tower, Thokar Niaz Baig, Multan Road, Lahore"; the old site said Main Westwood Road
- [ ] WhatsApp: site number is +92 312 6418414. If the second number is wanted, put it in `WHATSAPP_SECONDARY` in `js/b2b-config.js` and add `data-wa-secondary-ok` to the buttons
- [ ] Confirm "Humayun Ibrahim Textile" should stay as the parent name in the footer and About

## 4. Analytics and search
- [ ] GA4 measurement ID → `GA4_ID` in `js/b2b-config.js`
- [ ] When GA4 is on, add to the CSP meta tag: `script-src https://www.googletagmanager.com`, `connect-src https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com`, `img-src https://www.google-analytics.com`. Events already go to `dataLayer` without it.
- [ ] Google Search Console: verify the property, submit `https://enzolhr.com/sitemap.xml`
- [ ] Bing Webmaster Tools (optional)

## 5. Claims removed from existing pages (restore only if true)
- [ ] Home/About: "own mill in Faisalabad", "own spinning unit (2003)", "10,000 m minimum", "quote in one business day", "Custom order 30 days / next day dispatch"
- [ ] About: "no agent, no markup layer", "Yarn certifications from our suppliers available on request" (replaced with the stock-control wording)
- [ ] Documents for international buyers: which certificates, test reports or inspection documents can ENZO actually supply? (pages say terms and documents are set per order)

## 6. Legacy content that conflicts with the new positioning (not edited)
- [ ] `about.html`: lists Bluebird, LoomAura, VP Gold, Stan and a "Four lines" section
- [ ] Journal CTAs naming those qualities or "our own looms": `complete-guide-mens-fabric-buying.html:175`, `dressing-lahore-summers.html:151`, `identify-good-fabric.html:174`, `summer-vs-winter-fabric-men.html:162`, `what-is-woven-fabric.html:164`; "no intermediary margin": `fabric-supplier-vs-trader.html:166`
- [ ] "within one business day": `buying-fabric-from-pakistan.html:168`, `choose-fabric-supplier.html:190`, `choosing-fabric-garment-manufacturing.html:165`, `reed-and-pick.html:162`, `what-is-yarn-count.html:159`, `wholesale-fabric-pakistan.html:182`, `js/funnel.js:31`
- [ ] `docs/DATA-NEEDED.md` is from August and refers to retail codes; archive or refresh it
- [ ] Ready Stock (Rs prices, checkout) reads as retail. Keep, relabel or move under a "Ready-stock lots" B2B framing?

## 7. SEO decisions
- [ ] Journal vs Knowledge Centre overlap (GSM, yarn count): add "Related tool" links from the two Journal articles, or merge later
- [ ] `Product` JSON-LD has no offers (on purpose). Search Console may show a non-critical notice
- [ ] Ask Google to index the new URLs after deploy

## 8. Git
This work was done on branch `feat/b2b-seo-transformation` in the build environment. In GitHub Desktop, create the same branch name (Current Branch → New Branch) before committing the synced files, then open a pull request into `main`.
