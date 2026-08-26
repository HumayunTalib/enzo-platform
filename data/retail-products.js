/* Shop-grid source of truth for ENZO's 4 finished-goods codes (internal
   codename "RAQI" pre-merge — not a public-facing brand). product-*.html pages
   are hand-authored separately for SEO/OG/link-preview correctness
   (WhatsApp/social scrapers don't run JS) — update BOTH when anything changes.
   Never add a product/colour/spec here that isn't confirmed real.

   ENZO manufactures its own fabric; it does not source or trade. The
   `production` field says so and must never be reframed as a supplier.

   2026-08-27: every finished GSM, sett and composition previously held here was
   recorded against discontinued qualities and could not be verified. All of it
   has been REMOVED rather than replaced with a guess. `construction`
   (reed × pick / warp × weft count) is confirmed with production and is the
   only spec published. Shade lists were verbatim copies of discontinued
   qualities' lists and have been removed entirely — shades live on the
   wholesale qualities in data/products.js, not here.

   Prices are ENZO's own retail figures and are correct. */
var RAQI_PRODUCTS = [
  {
    code: 'Safa',
    id: 'RQ-S1',
    slug: 'safa',
    season: 'Spring / Summer',
    seasonTag: 'summer',
    character: 'Standing',
    characterTag: 'standing',
    tagline: 'The dry-hand opener',
    desc: 'Micro-crepe weave with a dry, springy hand that stands slightly away from the body. The first fabric to put in a client’s hand.',
    construction: '65×58 / 28×28',
    price: 400,
    production: 'Woven by ENZO, Faisalabad',
    image: 'assets/products/bluebird.webp',
    colors: []   // removed 2026-08-27 — were verbatim copies of discontinued qualities' shade lists
  },
  {
    code: 'Noor',
    id: 'RQ-S2',
    slug: 'noor',
    season: 'Summer / Mid-Season',
    seasonTag: 'summer',
    character: 'Fluid',
    characterTag: 'fluid',
    tagline: 'The evening code',
    desc: 'Fluid, weighted fall engineered for hall lighting — scatters light rather than flashing under LED or tungsten.',
    construction: '96×80 / 150D × 40VP',
    price: 500,
    production: 'Woven by ENZO, Faisalabad',
    image: 'assets/products/noor.webp',
    colors: []   // removed 2026-08-27 — were verbatim copies of discontinued qualities' shade lists
  },
  {
    code: 'Waqar',
    id: 'RQ-W3',
    slug: 'waqar',
    season: 'Autumn / Winter',
    seasonTag: 'winter',
    character: 'Structural',
    characterTag: 'structural',
    tagline: 'The structural code',
    desc: 'A 30/2 × 30/2 two-ply construction that holds a pressed pleat and a sculptural fold. The range’s quiet authority piece.',
    construction: '52×44 / 30/2 × 30/2',
    price: 400,
    production: 'Woven by ENZO, Faisalabad',
    image: 'assets/products/waqar.webp',
    colors: []   // removed 2026-08-27 — were verbatim copies of discontinued qualities' shade lists
  },
  {
    code: 'Daim',
    id: 'RQ-A4',
    slug: 'daim',
    season: 'All-Season',
    seasonTag: 'all-season',
    character: 'Neutral',
    characterTag: 'neutral',
    tagline: 'The daily driver',
    desc: 'A balanced construction with no knee or seat memory at hour twelve. The permanent core.',
    construction: '',            // [NOT CONFIRMED — omitted rather than guessed]
    price: 400,
    production: 'Woven by ENZO, Faisalabad',
    image: 'assets/products/daim.webp',
    colors: []   // removed 2026-08-27 — were verbatim copies of discontinued qualities' shade lists
  }
];
