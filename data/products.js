// Plain JS array — not JSON — avoids CORS errors on file:// protocol
//
// ENZO's own manufacture. Four qualities, woven in Faisalabad — this is not a
// sourced or traded range. Deliberately focused: the effort goes into the
// quality of what we make, not the width of the list.
//
// `construction` is reed × pick / warp × weft count, confirmed with production
// 2026-08-27. Fibre composition is NOT confirmed for any quality and is
// therefore absent rather than guessed — do not populate it from memory.
//
// Never put stock-on-hand quantities in here. They go stale weekly. Where
// availability matters, say "subject to availability — confirm on WhatsApp".
const PRODUCTS = [
  {
    id: 'bluebird',
    name: 'Bluebird',
    article: 'BB-04',
    line: 'fabric',
    category: 'four-season',
    eyebrow: 'Four-Season Suiting',
    description: 'Four-season suiting woven on our own looms, offered across an eight-shade grey range.',
    construction: '65×58 / 28×28',
    composition: '',
    tag: 'Four-Season',
    inStock: true,
    colors: ['Grey', 'Bright Grey', 'Pink Grey', 'Biscuit Grey', 'Turquoise Grey', 'Green Grey', 'Blue Grey', 'Yellow Grey'],
    colorHex: [],
    imgProduct:   'assets/products/bluebird.webp',
    imgLifestyle: 'assets/lifestyle/bluebird.webp',
    comingSoon: false,
  },
  {
    id: 'loomaura',
    name: 'LoomAura',
    article: '',
    line: 'fabric',
    category: 'four-season',
    eyebrow: 'Four-Season Suiting',
    description: 'A 64×64 / 26×26 four-season construction, woven in Faisalabad. Black and navy blue.',
    construction: '64×64 / 26×26',
    composition: '',
    tag: 'Four-Season',
    inStock: true,
    colors: ['Black', 'Navy Blue'],
    colorHex: [],
    imgProduct:   'assets/products/loomaura.webp',
    imgLifestyle: 'assets/lifestyle/loomaura.webp',
    comingSoon: false,
  },
  {
    id: 'vp-gold',
    name: 'VP Gold',
    article: '',
    line: 'fabric',
    category: 'winter',
    eyebrow: 'Winter Suiting',
    description: 'A 56×52 / 20×20 winter construction, woven in Faisalabad. One shade now, with further shades in production for the season.',
    construction: '56×52 / 20×20',
    composition: '',
    tag: 'Winter',
    inStock: true,
    colors: [],
    colorHex: [],
    imgProduct:   'assets/products/vp-gold.webp',
    imgLifestyle: 'assets/lifestyle/vp-gold.webp',
    comingSoon: false,
  },
  {
    id: 'stan',
    name: 'Stan',
    article: 'ST-01',
    line: 'fabric',
    category: 'two-tone',   // no season confirmed — filed by its own confirmed descriptor
                            // so it stays reachable instead of showing only under "All"

    eyebrow: 'Two-Tone Suiting',
    description: 'A 56×46 / 20×20 construction in a two-tone mid grey. The newest addition to the range.',
    construction: '56×46 / 20×20',
    composition: '',
    tag: 'Two-Tone',
    inStock: true,
    colors: ['Two-Tone Mid Grey'],
    colorHex: [],
    imgProduct:   'assets/products/stan.webp',
    imgLifestyle: 'assets/lifestyle/stan.webp',
    comingSoon: false,
  },
  {
    // ── Fibre: a separate business line. ENZO imports and trades this; it does
    //    not spin or manufacture fibre. Shop never lists it — 1 tonne is not a
    //    consumer quantity. Detail lives on fibre.html.
    id: 'viscose-staple',
    name: 'Viscose Staple Fibre',
    article: '',
    line: 'fibre',
    category: 'fibre',
    eyebrow: 'Imported \u00b7 Traded',
    description: 'Viscose staple fibre in 3D, 4D and 5D, cut 38mm, 44mm or 51mm. Imported from China, limited stock held in Lahore.',
    construction: '3D / 4D / 5D \u00b7 38, 44, 51\u2009mm',
    composition: '',
    tag: 'Fibre',
    inStock: true,
    colors: [],
    colorHex: [],
    imgProduct:   'assets/viscose-fibre.jpg',
    imgLifestyle: 'assets/viscose-fibre.jpg',
    href: 'fibre.html',
    moq: '1 tonne',
    comingSoon: false,
  },
];
