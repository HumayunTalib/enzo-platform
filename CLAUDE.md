# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development — watches CSS and rebuilds on save
npm run dev

# Production build — injects partials, minifies CSS, copies assets to dist/
npm run build

# CSS only (watch mode, writes to dist/output.css)
npm run dev:css

# CSS only (one-shot minified, writes to both output.css and dist/output.css)
npm run build:css
```

There are no tests. Open `dist/*.html` directly in a browser to verify changes (no dev server — the site runs on the file:// protocol).

## Architecture

**Static site with a thin file-copy build step.** There is no framework, bundler, or templating engine. ENZO serves both wholesale (B2B) and retail (B2C, the former RAQI line) under one domain — `enzolhr.com` — as of the merge that retired the separate `raqi-site` repo.

- **Wholesale pages** (`index.html`, `about.html`, `catalog.html`, `calculator.html`, `contact.html`) are self-contained — the loader, nav, and footer are **inlined in every page** so each renders correctly when opened directly (no build step required to preview). Cold navy/glacier-blue design system.
- **Retail pages** (`shop.html`, `product-safa.html`, `product-noor.html`, `product-waqar.html`, `product-daim.html`, `journal.html`) use the same inlined loader/nav/footer, but their body content uses the warm chocolate/ash/gold design system (`css/retail.css`) — this is the former RAQI brand, now sold as ENZO's finished-goods line. `raqi-site/` at the repo root holds thin redirect stubs (meta-refresh + canonical + JS fallback) for every old `enzolhr.com/raqi-site/*` URL, pointing at the new flat-path equivalents — GitHub Pages has no native server-side redirects, so these are the mechanism that preserves old links/SEO after the old repo was retired.
- **`build.js`** (plain Node, no dependencies) wipes `dist/`, generates `js/config.js` from `.env`, copies every page (wholesale + retail) into `dist/`, copies `assets/`, `js/`, `data/`, `raqi-site/` (redirect stubs), `css/retail.css`, and copies `robots.txt` + `sitemap.xml`. **When adding a new top-level page, add its name to the `pages` array in `build.js`** — it is not auto-discovered.
- **`dist/`** is the deployment artifact and is gitignored. Never edit files in `dist/` directly.

**Client config — `.env` → `js/config.js`.** `build.js` reads `.env` (gitignored) and generates `js/config.js` defining `window.ENZO_CONFIG`. Currently holds `FORMSPREE_ID` (consumed by `js/contact.js`). The Formspree ID is public by design — `.env`/gitignore is config hygiene, not a security boundary. `.env.example` and `js/config.example.js` are the committed templates; `js/config.js` is generated and gitignored.

**CSS pipeline — Tailwind for wholesale chrome, a separate hand-written stylesheet for retail body content.**
- Source: `css/input.css` — contains `@tailwind` directives plus all custom component classes (`@layer components { … }`).
- Output: `dist/output.css` (dev watch) or both `output.css` + `dist/output.css` (prod build). Loaded on every page (wholesale and retail) — it owns the shared nav/footer/loader chrome.
- All reusable UI classes are defined here: `.content-rail`, `.section-pad`, `.nav-link`, `.btn-primary`, `.btn-primary-inv`, `.enzo-input`, `.enzo-label`, `.stat-num`, `.swatch-dot`, `.fade-up`, `.card-img-wrap`, `.timeline-line`.
- Tailwind scans `./*.html` and `./js/*.js` for class usage.
- `css/retail.css` — plain CSS (not run through Tailwind), loaded additionally on retail pages only. Owns everything below the nav on those pages: `.store-grid`/`.store-card` (product grid), `.pdp-*` (product detail layout), `.journal-*` (journal typography), `.cart-*` (selection cart), `.wa-float`, filters. Uses its own `:root` custom properties (`--chocolate`, `--ash`, `--gold`, etc.) scoped to this file — intentionally not renamed to the `warm-*` Tailwind tokens below, to avoid touching ~100 low-risk references; the two are meant to describe the same palette, kept in sync by eye.

**JavaScript — vanilla ES5 IIFEs, no modules, no build step.**
- `js/motion.js` — custom cursor (mix-blend-mode difference) + IntersectionObserver scroll fade-up. Respects `prefers-reduced-motion` and `pointer: fine`. Wholesale pages only.
- `js/timeline.js` — fires a CSS `scaleX` draw animation once when the timeline section enters the viewport.
- `js/catalog.js` — dynamically renders wholesale product cards from the global `PRODUCTS` array; manages category filter tabs and touch-device lifestyle-image toggle.
- `js/calculator.js` — fabric cost calculator using an exact formula (reed/width/warp/weft/picks/rates). Generates a WhatsApp deep-link to `+923218230266` with the calculated result pre-filled.
- `js/contact.js` — wholesale quote form handler (`form[data-quote-form]` on `contact.html`). Prefills the Quality/Article field from `?quality=&article=` deep-links, validates name+email, then submits to Formspree (`ENZO_CONFIG.formspreeId`) or falls back to a prefilled WhatsApp deep-link when no ID is set.
- `js/retail.js` — shared retail-page behavior: scroll reveal, image fallback loader, color wall, and the `RaqiCart` localStorage-backed selection cart + its UI wiring. Loaded on every retail page. `RaqiCart`/`RAQI_PRODUCTS`/`raqi_cart_v1` (localStorage key) are internal identifiers only, left over from the pre-merge codename — **"RAQI" must never appear in user-facing text** (titles, copy, WhatsApp messages, schema); the retail line is presented as ENZO throughout.
- `js/shop.js` — `shop.html` only: season/character/color filters and product grid rendering from `RAQI_PRODUCTS`.
- `js/product.js` — `product-*.html` only: color swatch selection, quantity, order/enquire actions. Reads which product it's on from `<main data-product-code="...">`.
- `js/notify.js` — `shop.html` only: shade-lot email signup (`#notify-form`), separate Formspree submission from the wholesale quote form so the two never double-wire the same form.

**Data layer.**
- `data/products.js` — wholesale. Declares a global `const PRODUCTS = [...]` array (plain JS, not JSON, to work on `file://` without CORS). Each entry has `id`, `name`, `article`, `category`, `colors[]`, `colorHex[]`, `imgProduct`, `imgLifestyle`, `comingSoon`. Product images live at `assets/products/<article>.webp` and `assets/lifestyle/<article>.webp`.
- `data/retail-products.js` — ENZO's retail/finished-goods line. Declares a global `var RAQI_PRODUCTS = [...]` array — 4 finished-goods codes (Safa, Noor, Waqar, Daim), each sourced from a real wholesale article (see each entry's `source` field). Consumed by `js/shop.js`, `js/product.js`, `js/retail.js`. **`shop.html` and each `product-*.html` are hand-authored separately for SEO/OG/link-preview correctness** (WhatsApp/social scrapers don't run JS) — update both the data file and the relevant page when a price, color, or spec changes.

**Design tokens — defined in two places that must stay in sync:**
- `tailwind.config.js` → `theme.extend.colors` (for Tailwind utility classes)
- `css/input.css` → `:root` CSS custom properties (for component-layer and inline styles)

Two palettes, deliberately imbalanced — the site should read as ENZO (cold), with chocolate as a restrained accent (roughly 60-70% ice white/neutral, 20-25% obsidian/arctic-navy, 5-10% chocolate/espresso):
- **Cold Technical Core** (ENZO's primary identity, wholesale + retail chrome) — `obsidian #0B0F14` (primary dark anchor: footer, calculator bg, premium section backgrounds), `arctic-navy #1E2A39` (primary brand color: buttons/`.btn-primary`, nav accents, hero, wholesale), `steel-blue #5C7386`, `glacier-blue #9DB4C6`, `silver-mist #D6DEE6`, `ice-white #F5F8FA` (primary page background everywhere, including retail).
- **Coffee / Chocolate Material Accent** (warmth + craftsmanship, used sparingly — never a page background) — `espresso #241510` (darkest, full-bleed premium sections), `dark-chocolate #3A2118` (main accent: `.btn-premium`, premium cards — same value as `css/retail.css`'s `--chocolate`), `coffee-brown #5A3828` (borders on chocolate surfaces — `--chocolate-line`), `warm-mocha #80604C` (micro-labels/thin lines only — `--gold`), `textile-cream #E8DED2` (text/icons on chocolate surfaces — `--ash`).
- `css/retail.css` keeps its original variable *names* (`--chocolate`, `--ash`, `--gold`, `--chocolate-line`, `--ash-line`) pointed at the new values above, to avoid touching ~100 call sites — see the comment at the top of that file before changing any of them. Its page-level backgrounds (`.retail-body`, `.shop-header`, `.filter-drawer`) intentionally use `var(--ice-white)`, not `var(--ash)`, so retail pages stay light.

Fonts loaded via Google Fonts (CDN, in each HTML `<head>`): **Bebas Neue** (headings), **Inter** (body), **JetBrains Mono** (monospaced UI / calculator) everywhere; retail pages additionally load **Fraunces** (retail headings) and **IBM Plex Sans / IBM Plex Mono** (retail body/UI).

## Key conventions

- **Nav, footer, and the page loader are inlined identically in all pages** (wholesale and retail alike) — when changing any of them, apply the same edit to every page (they are intentionally duplicated so pages render standalone). Never edit the copies inside `dist/`.
- **To add a wholesale product**, append an entry to `data/products.js` and place `.webp` images at the matching paths. **To add a retail product**, append to `data/retail-products.js`, add a `product-<slug>.html` page (copy an existing one as a template), and add it to the `pages` array in `build.js` and to `sitemap.xml`.
- **Content-Security-Policy** — every page carries a `<meta http-equiv="Content-Security-Policy">` tag. If a new page needs a script/style/connect origin not already allowed (currently: self, `fonts.googleapis.com`/`fonts.gstatic.com`, `cdnjs.cloudflare.com` for GSAP, `formspree.io`), update the CSP on that page rather than loosening it site-wide.
- **`btn-primary-inv`** is currently identical to `btn-primary`; it exists as a named hook for future light-section inversion — keep them separate in the CSS.
- The calculator formula (§4.3 in the original brief) includes a hidden 16% markup baked into `costMetre`. Do not expose or log intermediate cost values.
- Color swatches on catalog cards must always be visible (not hover-only) — accessibility requirement.
- **Copy states "3 product lines" (Nova Silk, Wostar Wool, Bluebird)** — keep all count references aligned to `data/products.js` (Bluebird ships as two seasonal entries = 4 catalog cards). Do not reintroduce "15"/"18+" claims unless the data grows to match.
- **Catalog product images are not yet committed** — `assets/products/*.webp` and `assets/lifestyle/*.webp` are referenced by `data/products.js` but the directories are empty, so cards render broken images until the `.webp` files are added.
