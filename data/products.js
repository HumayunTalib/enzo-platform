// Plain JS array — not JSON — avoids CORS errors on file:// protocol
//
// ENZO's own manufacture. Three qualities, produced in Faisalabad — this is
// not a sourced or traded range. Deliberately focused: the effort goes into
// the quality of what we make, not the width of the list.
//
// Never put stock-on-hand quantities in here. They go stale weekly. Where
// availability matters, say "subject to availability — confirm on WhatsApp".
const PRODUCTS = [
  {
    id: 'bluebird',
    name: 'Bluebird',
    article: 'BB-04',
    category: 'four-season',
    eyebrow: 'Four-Season Suiting',
    description: 'ENZO’s four-season suiting quality, produced in Faisalabad and offered across an eight-shade grey range.',
    construction: '',            // [NEEDS INPUT: construction spec]
    composition: '',             // [NEEDS INPUT: fibre composition]
    tag: 'Four-Season',
    inStock: true,
    colors: ['Grey', 'Bright Grey', 'Pink Grey', 'Biscuit Grey', 'Turquoise Grey', 'Green Grey', 'Blue Grey', 'Yellow Grey'],
    colorHex: [],                // [NEEDS INPUT: hex values — names render as text until filled]
    imgProduct:   'assets/products/bb-04-summer.webp',
    imgLifestyle: 'assets/lifestyle/bb-04-summer.webp',
    comingSoon: false,
  },
  {
    id: 'loomaura',
    name: 'LoomAura',
    article: '',                 // [NEEDS INPUT: article code]
    category: 'four-season',
    eyebrow: 'Four-Season Suiting',
    description: 'A 64×64 / 26×26 four-season construction, produced in Faisalabad. Offered in black and navy blue.',
    construction: '64×64 / 26×26',
    composition: '',             // [NEEDS INPUT: fibre composition]
    tag: 'Four-Season',
    inStock: true,
    colors: ['Black', 'Navy Blue'],
    colorHex: [],                // [NEEDS INPUT: hex values]
    imgProduct:   'assets/products/loomaura.webp',   // [NEEDS INPUT: photography — falls back to name card]
    imgLifestyle: 'assets/lifestyle/loomaura.webp',
    comingSoon: false,
  },
  {
    id: 'vp-gold',
    name: 'VP Gold',
    article: '',                 // [NEEDS INPUT: article code]
    category: 'winter',
    eyebrow: 'Winter Suiting',
    description: 'A 56×52 / 20×20 winter construction, produced in Faisalabad. Further shades in production for the winter season.',
    construction: '56×52 / 20×20',
    composition: '',             // [NEEDS INPUT: fibre composition]
    tag: 'Winter',
    inStock: true,
    colors: [],                  // [NEEDS INPUT: name of the current shade]
    colorHex: [],
    imgProduct:   'assets/products/vp-gold.webp',    // [NEEDS INPUT: photography — falls back to name card]
    imgLifestyle: 'assets/lifestyle/vp-gold.webp',
    comingSoon: false,
  },
];
