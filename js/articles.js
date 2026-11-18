/* ENZO article catalogue — EDIT THIS FILE to change what the Ready Stock page shows.
 *
 * Each article is one entry. To add a new article, copy a block and change the values.
 *   slug         short address used in the link (store.html#moses). Lower case, no spaces.
 *   name         article name shown in the list
 *   lot          lot / article identification shown in the list
 *   demo         true = placeholder (shows a "Sample listing" tag, cannot be ordered). Set false or delete when real.
 *   summary      one line shown in the list
 *   description  paragraphs on the article page (array of strings)
 *   specs        [label, value] pairs shown on the article page. Add only facts you have confirmed.
 *   colours      one entry per colour:
 *                  name   colour name
 *                  hex    swatch colour (indicative only), e.g. '#1F2F63'
 *                  code   stock code — must match the "code" column in the Google Sheet inventory
 *                  image  optional fabric photo, e.g. 'assets/stock/MOSES-001.webp'
 *   price_pkr    price used before the Google Sheet is connected (the Sheet price wins once connected)
 */
window.ENZO_ARTICLES = [
  {
    slug: 'moses',
    name: 'Moses',
    lot: 'MOSES',
    demo: false,
    summary: 'PV Blend',
    description: [
      'Moses is a PV Blend fabric, held in ready stock in seven colours.',
      'Each colour is a finished piece, reserved for you the moment you place your order. Delivery is available nationwide.'
    ],
    specs: [
      ['Quality', 'PV Blend'],
      ['Price', 'Rs 3,969'],
      ['Delivery', 'Nationwide']
    ],
    price_pkr: 3969,
    colours: [
      { name: 'Teal',         hex: '#1F5F6E', code: 'MOSES-001', image: 'assets/stock/MOSES-001.webp' },
      { name: 'Navy',         hex: '#1F2F63', code: 'MOSES-002', image: 'assets/stock/MOSES-002.webp' },
      { name: 'Black',        hex: '#1A1B1E', code: 'MOSES-003', image: 'assets/stock/MOSES-003.webp' },
      { name: 'Plum',         hex: '#3A2A33', code: 'MOSES-004', image: 'assets/stock/MOSES-004.webp' },
      { name: 'Forest Green', hex: '#1F3A2A', code: 'MOSES-005', image: 'assets/stock/MOSES-005.webp' },
      { name: 'Brown',        hex: '#3B261C', code: 'MOSES-006', image: 'assets/stock/MOSES-006.webp' },
      { name: 'Royal Blue',   hex: '#243B8F', code: 'MOSES-007', image: 'assets/stock/MOSES-007.webp' }
    ]
  },

  /* ---------- DEMO ARTICLES — placeholders only. Replace tomorrow with real content. ---------- */
  {
    slug: 'article-two',
    name: 'Article Two',
    lot: 'LOT 02',
    demo: true,
    summary: 'Details to follow',
    description: ['Article description to be added.'],
    specs: [['Quality', 'To be confirmed'], ['Price', 'To be confirmed'], ['Delivery', 'To be confirmed']],
    price_pkr: 0,
    colours: []
  },
  {
    slug: 'article-three',
    name: 'Article Three',
    lot: 'LOT 03',
    demo: true,
    summary: 'Details to follow',
    description: ['Article description to be added.'],
    specs: [['Quality', 'To be confirmed'], ['Price', 'To be confirmed'], ['Delivery', 'To be confirmed']],
    price_pkr: 0,
    colours: []
  },
  {
    slug: 'article-four',
    name: 'Article Four',
    lot: 'LOT 04',
    demo: true,
    summary: 'Details to follow',
    description: ['Article description to be added.'],
    specs: [['Quality', 'To be confirmed'], ['Price', 'To be confirmed'], ['Delivery', 'To be confirmed']],
    price_pkr: 0,
    colours: []
  }
];
