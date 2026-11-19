# SEO architecture audit: ENZO Textiles (enzolhr.com)

Date: 19 November 2026 · Branch: `feat/b2b-seo-transformation`
Scope: static site on GitHub Pages, served from the repository root.
Method: file-level inspection of every page, partial, script, sitemap and robots file, plus browser tests of the new build. No search-volume, ranking or traffic data was available, so none is quoted. Prioritisation below is by search intent and page role, not by volume.

## 1. What existed before this work

| Area | Finding |
|---|---|
| Pages | 5 root pages (home, about, journal index, store, admin), 66 Journal articles, a Moses ready-stock catalogue (hash-routed inside `store.html`). |
| Navigation | Three links (Ready Stock, Journal, About) and a "Get a Quote" button that jumped to a form at the bottom of the home page. |
| Commercial pages | None. No product, manufacturing or international-buyer pages. The only RFQ surface was the home-page form. |
| Tools | None. The Journal explained GSM and yarn-count formulas in prose but offered no calculator, so a visitor with a number to check had nowhere to go. |
| Metadata | Every Journal page has a title, description, canonical and JSON-LD. Home and About had metadata but with claims that are now corrected (see section 4). |
| Sitemap / robots | `sitemap.xml` listed 70 URLs without `lastmod`; `robots.txt` allows all and disallows `/queue/`. |
| Build | `build.js` synced header/footer only into root and `journal/` pages; Tailwind scanned only `./*.html`, `./journal/*.html`, `./js/*.js`, so any page in a new folder would have lost its styles. |

## 2. Findings and what was done

| # | Finding | Impact | Action |
|---|---|---|---|
| 1 | No commercial landing pages for the three things buyers search for: PV suiting, men's woven suiting, custom constructions. | High | Added `/products/` plus three category pages with specification blocks, photography slots, RFQ and WhatsApp CTAs. |
| 2 | No page explaining who weaves, who dyes and who inspects. Existing copy implied a vertically integrated mill. | High (trust and accuracy) | Added `/manufacturing/` with the exact operating model and a "what ENZO does not claim" section. Removed integrated-mill wording from Home and About. |
| 3 | No page for overseas buyers. | High | Added `/international-buyers/` (UK, GCC, US, EU, Bangladesh, China, Pakistan). |
| 4 | High-intent technical queries (GSM from EPI/PPI, yarn count conversion, cover factor, cost per metre) answered only in articles. | High | Eight free client-side calculators under `/tools/`, each with formula, derivation, worked example, assumptions, FAQ and `SoftwareApplication` plus `FAQPage` JSON-LD. |
| 5 | One-step form buried at the bottom of the home page. | High | `/quote/` multi-step RFQ (same Formspree endpoint), validation, country picker, query-string prefill from calculators and product pages, WhatsApp hand-off. The original home form is kept as a "Quick enquiry". |
| 6 | Journal is a flat list of 66 articles with no topical hubs. | Medium | `/knowledge-centre/` with four pillars and eight technical articles. Each links to the relevant calculators and existing Journal articles. |
| 7 | **Cannibalisation risk:** Knowledge Centre articles on GSM and yarn count overlap with Journal articles `how-to-calculate-fabric-gsm-from-epi-ppi` and `yarn-count-conversion-ne-nm-tex-denier`. | Medium | New articles link to the Journal versions and vice versa is recommended (add a "Related tool" box to those two Journal pages). Decide later whether to merge. |
| 8 | No printable assets. | Low-medium | `/resources/` with a specification sheet template, a pre-shipment inspection checklist and a PV buyer's reference guide. Optional email capture; never required. |
| 9 | No event measurement. | Medium | `js/analytics.js` fires `rfq_submitted`, `whatsapp_cta_clicked`, `calculator_used`, `spec_guide_downloaded` to `dataLayer`; GA4 loads only when an ID is set and the visitor has not sent Do-Not-Track or Global Privacy Control. |
| 10 | Sitemap lacked the new sections. | Medium | `tools/build-b2b.js` adds every generated URL (with `lastmod`) and never removes or reorders entries owned by the Journal publisher. |
| 11 | Styles for new folders would have been purged. | Technical | New classes live in plain CSS (`css/b2b.css`), appended to `output.css` by `npm run build:css`. |
| 12 | `build.js` ignored nested pages. | Technical | Partial sync now walks every folder and computes the `../` depth. |
| 13 | CSP blocks Google Analytics. | Technical | Left as is (safer). The to-do file lists the two CSP additions needed when a GA4 ID is supplied. |
| 14 | Developer files (`tools/*.js`, `content/`, `docs/`) are publicly served by GitHub Pages. | Low | Not changed. Note that `/tools/` now doubles as a public URL; generated pages sit beside the scripts. Moving scripts to a non-served folder would be tidier. |

## 3. New information architecture

```
/                                   Home (B2B positioning, tool previews, RFQ + WhatsApp)
/products/                          Hub
  /products/pv-suiting-fabrics/
  /products/mens-woven-suiting/
  /products/custom-greige-dyed-woven/
/manufacturing/                     Operating model, four-party accountability
/international-buyers/              Market guidance, RFQ checklist
/tools/                             Hub
  /tools/gsm-calculator/  /warp-consumption/  /weft-consumption/  /fabric-construction/
  /tools/yarn-count-converter/  /fabric-unit-converter/  /fabric-cost-estimator/  /spec-comparison/
/knowledge-centre/                  Hub with pillar filter
  8 articles (2 per pillar)
/resources/                         Hub
  3 printable guides
/quote/                             Multi-step RFQ
/store.html                         Ready stock (unchanged)
/journal.html + /journal/*          Journal (unchanged, 66 articles)
/about.html
```

Internal linking model: every Knowledge Centre article links to its calculators, one or two Journal articles and sibling articles; every calculator links to the matching articles, other tools and the RFQ with its inputs prefilled; every product page links to the tools, the specification guide and the manufacturing page; every page ends with an RFQ and a context-aware WhatsApp button that carries the page title, URL and any calculated specification.

Intent map (qualitative, no volumes):

| Intent | Landing page |
|---|---|
| "wholesale PV suiting fabric", "polyester viscose suiting Pakistan" | `/products/pv-suiting-fabrics/` |
| "men's unstitched suiting wholesale" | `/products/mens-woven-suiting/` |
| "custom woven fabric manufacturer", "greige fabric to spec" | `/products/custom-greige-dyed-woven/` |
| "fabric GSM calculator", "GSM from EPI PPI" | `/tools/gsm-calculator/` |
| "Ne to tex", "36/1 vs 36/2" | `/tools/yarn-count-converter/` |
| "cover factor calculator" | `/tools/fabric-construction/` |
| "buy fabric from Pakistan" | `/international-buyers/` |
| "how to write a fabric spec", "fabric RFQ" | KC article + `/resources/` + `/quote/` |

## 4. Content conflicts resolved (decisions made, all reversible)

| Conflict | Decision |
|---|---|
| Home claimed "own mill in Faisalabad", "own spinning unit 2003", "10,000 m minimum", "quote in one business day". | Replaced with the confirmed operating model. Minimum order and response time now say "confirmed in the quotation". The 2003 spinning milestone was removed from Home and About. |
| Address: site said Main Westwood Road; brief said Multan Road. | New content and the footer use "4th Floor, ENZO Tower, Thokar Niaz Baig, Multan Road, Lahore". Please confirm. |
| WhatsApp: site number +92 312 6418414 vs a different number in the brief. | Site number is used everywhere; `js/b2b-config.js` has an optional `WHATSAPP_SECONDARY` that adds a second button when filled. |
| Ready Stock (prices, checkout) looks retail; the brief says never retail. | Kept, because it works and was requested earlier; labelled as a small ready-stock lot on B2B pages. Owner decision pending. |
| Legacy Journal and About copy about Bluebird/LoomAura/VP Gold/Stan, "our own looms", "no intermediary margin", "one business day". | Not edited (owner knowledge needed). Locations are listed in `TODO_VERIFICATION.md`. |

## 5. Structured data

Organization (ENZO Textiles; Lahore address, Faisalabad and Lahore production locations), WebSite, WebPage/CollectionPage, BreadcrumbList on every new page, `Product` on the three category pages (no offers, ratings or prices), `SoftwareApplication` on each tool (`isAccessibleForFree`, no prices), `FAQPage` where visible FAQs exist, `Article` on Knowledge Centre posts (author and publisher: ENZO Textiles), `LearningResource` on guides. Search Console may report "offers missing" as a non-critical notice on `Product`; no fake offer was added on purpose.

## 6. AI-search structure

Each tool and article opens with a boxed definition, shows formulas in plain text, uses comparison tables, includes worked examples computed from the same code as the calculator, and states assumptions and limits. The manufacturing page states operating facts and non-claims in plain sentences.

## 7. Known limits

- Specification values that ENZO has not confirmed are shown as `[VERIFY SPEC]` rather than guessed.
- Articles cite only sources that were opened during the work; none quotes search volumes.
- No Lighthouse or Search Console data was available in this environment.
