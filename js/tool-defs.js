/* ENZO textile calculators — definitions + pure maths.
 * Used in the browser (window.ENZO_TOOLS) and by the page generator / tests (Node require).
 * Every formula is shown on the page; constants are exact unit definitions:
 *   1 lb = 453.59237 g, 840 yd (Ne hank) = 768.096 m, 560 yd (worsted hank) = 512.064 m, 1 in = 25.4 mm. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(); else root.ENZO_TOOLS = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var IN_PER_M = 1000 / 25.4;                    // 39.3701 inches per metre
  var TEX_NE = 453.59237 / 0.768096;             // 590.541  : tex = 590.541 / Ne
  var TEX_NEK = 453.59237 / 0.512064;            // 885.81   : tex = 885.81 / NeK (worsted)
  var OZYD2_GSM = 28.349523125 / 0.83612736;     // 33.9057 g/m² per oz/yd²
  var YD = 0.9144;

  function num(v) { v = parseFloat(v); return isFinite(v) ? v : NaN; }
  function fmt(n, d) { if (!isFinite(n)) return '—'; d = d == null ? 2 : d; var s = n.toFixed(d); return s.replace(/\.?0+$/, function (m) { return d > 0 && s.indexOf('.') > -1 ? '' : m; }); }
  function tex(ne) { return TEX_NE / ne; }

  /* ---- conversions between yarn count systems (everything goes through tex) ---- */
  var TO_TEX = { ne: function (x) { return TEX_NE / x; }, nm: function (x) { return 1000 / x; }, tex: function (x) { return x; }, den: function (x) { return x / 9; }, nek: function (x) { return TEX_NEK / x; } };
  var FROM_TEX = { ne: function (t) { return TEX_NE / t; }, nm: function (t) { return 1000 / t; }, tex: function (t) { return t; }, den: function (t) { return t * 9; }, nek: function (t) { return TEX_NEK / t; } };
  function allCounts(t) { return { ne: FROM_TEX.ne(t), nm: FROM_TEX.nm(t), tex: t, den: FROM_TEX.den(t), nek: FROM_TEX.nek(t) }; }

  function gsm(epi, ppi, neW, neF, crimpW, crimpF) {
    var w = epi * IN_PER_M * (1 + crimpW / 100) * tex(neW) / 1000;
    var f = ppi * IN_PER_M * (1 + crimpF / 100) * tex(neF) / 1000;
    return { warp: w, weft: f, total: w + f };
  }
  function cover(epi, ppi, neW, neF) {
    var kw = epi / Math.sqrt(neW), kf = ppi / Math.sqrt(neF);
    return { kw: kw, kf: kf, k: kw + kf - kw * kf / 28 };
  }
  function warpUse(epi, reedIn, ne, crimp, waste, selvEnds) {
    var ends = epi * reedIn + (selvEnds || 0);
    var lenPerM = ends * (1 + crimp / 100);                     // metres of yarn per metre of fabric
    var gPerM = lenPerM * tex(ne) / 1000 * (1 + waste / 100);   // grams per metre of fabric
    return { ends: ends, lenPerM: lenPerM, gPerM: gPerM, kgPer100: gPerM / 10 };
  }
  function weftUse(ppi, reedIn, ne, waste) {
    var picksPerM = ppi * IN_PER_M;
    var lenPerM = picksPerM * reedIn * 0.0254;
    var gPerM = lenPerM * tex(ne) / 1000 * (1 + waste / 100);
    return { picksPerM: picksPerM, lenPerM: lenPerM, gPerM: gPerM, kgPer100: gPerM / 10 };
  }

  var WEAVES = { plain: { n: 2, tr: 2, label: 'Plain (1/1)' }, twill21: { n: 3, tr: 2, label: '2/1 twill' }, twill22: { n: 4, tr: 2, label: '2/2 twill' }, twill31: { n: 4, tr: 2, label: '3/1 twill' }, satin5: { n: 5, tr: 2, label: '5-end satin / sateen' } };
  var WEAVE_OPTS = Object.keys(WEAVES).map(function (k) { return [k, WEAVES[k].label]; });

  var T = {};

  /* =============== 1. GSM =============== */
  T.gsm = {
    slug: 'gsm-calculator', name: 'Fabric GSM Calculator', short: 'GSM from EPI, PPI, counts and crimp',
    h1: 'Fabric GSM Calculator: Weight from EPI, PPI, Yarn Count and Crimp',
    desc: 'Free woven fabric GSM calculator. Enter EPI, PPI, warp and weft count (Ne) and crimp to get GSM, oz/yd² and the warp/weft split, with the formula shown.',
    kw: 'fabric GSM calculator, GSM from EPI PPI, woven fabric weight formula',
    intro: 'Calculate the theoretical weight of a woven fabric from its construction. The result is the weight of the yarn in the cloth; finishing, sizing residue and moisture change the real figure.',
    fields: [
      { id: 'epi', label: 'Ends per inch (EPI)', unit: 'ends/in', def: 100, min: 1, step: 1 },
      { id: 'ppi', label: 'Picks per inch (PPI)', unit: 'picks/in', def: 80, min: 1, step: 1 },
      { id: 'neW', label: 'Warp count', unit: 'Ne', def: 36, min: 0.5, step: 0.5 },
      { id: 'neF', label: 'Weft count', unit: 'Ne', def: 36, min: 0.5, step: 0.5 },
      { id: 'crW', label: 'Warp crimp', unit: '%', def: 0, min: 0, step: 0.5, hint: 'Extra yarn length vs fabric length. Leave 0 to ignore.' },
      { id: 'crF', label: 'Weft crimp', unit: '%', def: 0, min: 0, step: 0.5 }
    ],
    compute: function (v) {
      var g = gsm(v.epi, v.ppi, v.neW, v.neF, v.crW, v.crF);
      if (!isFinite(g.total)) return null;
      return { rows: [
        { k: 'Fabric weight', v: fmt(g.total, 1), u: 'GSM (g/m²)', hl: 1 },
        { k: 'Fabric weight', v: fmt(g.total / OZYD2_GSM, 2), u: 'oz/yd²' },
        { k: 'Warp share', v: fmt(g.warp, 1), u: 'g/m² (' + fmt(100 * g.warp / g.total, 0) + '%)' },
        { k: 'Weft share', v: fmt(g.weft, 1), u: 'g/m² (' + fmt(100 * g.weft / g.total, 0) + '%)' }
      ], summary: 'EPI ' + v.epi + ', PPI ' + v.ppi + ', warp Ne ' + v.neW + ', weft Ne ' + v.neF + ', crimp ' + v.crW + '/' + v.crF + '% → ' + fmt(g.total, 1) + ' GSM (theoretical)' };
    },
    formula: ['GSM = 23.25 × [ EPI × (1 + warp crimp) ÷ Ne(warp) + PPI × (1 + weft crimp) ÷ Ne(weft) ]', 'where 23.25 = 39.3701 in/m × 0.590541 (tex = 590.541 ÷ Ne) ÷ 1000'],
    derivation: 'One metre of fabric width holds EPI × 39.3701 warp ends. Each end needs 1 m × (1 + crimp) of yarn, and a yarn of count Ne weighs 590.541 ÷ Ne grams per 1,000 m. Adding the weft the same way gives the formula above.',
    assume: ['Count is English cotton count (Ne); for other systems convert first with the yarn count converter.', 'Crimp % = (yarn length − fabric length) ÷ fabric length × 100, measured on a sample.', 'EPI and PPI are measured on the finished or greige fabric you are weighing; the result matches that state.'],
    notes: ['Theoretical GSM ignores sizing, finishing chemicals and moisture. Always confirm against a cut-sample weight.', 'If you only know the fabric on the loom, remember that finished width and density differ from reed width and loom density.'],
    faq: [['How do I calculate GSM from EPI and PPI?', 'Multiply (EPI ÷ warp Ne + PPI ÷ weft Ne) by 23.25. With 100 EPI, 80 PPI and Ne 36 for both, that is 180 ÷ 36 × 23.25 = 116.3 GSM before crimp.'], ['Why is real GSM higher than the calculated value?', 'Crimp adds yarn length, and sizing, finishing and moisture add mass. Enter crimp from a sample to close part of the gap.']]
  };

  T.gsmSample = {
    slug: 'gsm-calculator', name: 'Cut-sample weight to GSM', short: 'GSM from a weighed sample', sub: true,
    fields: [
      { id: 'mass', label: 'Sample mass', unit: 'g', def: 1.16, min: 0.001, step: 0.01 },
      { id: 'shape', label: 'Sample shape', type: 'select', def: 'circle', options: [['circle', 'Circle (diameter, cm)'], ['rect', 'Rectangle (width × length, cm)']] },
      { id: 'd1', label: 'Diameter or width', unit: 'cm', def: 11.28, min: 0.1, step: 0.01, hint: '11.28 cm diameter = 100 cm² (standard GSM cutter).' },
      { id: 'd2', label: 'Length (rectangle only)', unit: 'cm', def: 10, min: 0.1, step: 0.1 }
    ],
    compute: function (v) {
      var area = v.shape === 'rect' ? v.d1 * v.d2 : Math.PI * Math.pow(v.d1 / 2, 2);
      var g = v.mass / (area / 10000);
      if (!isFinite(g)) return null;
      return { rows: [{ k: 'Fabric weight', v: fmt(g, 1), u: 'GSM (g/m²)', hl: 1 }, { k: 'Fabric weight', v: fmt(g / OZYD2_GSM, 2), u: 'oz/yd²' }, { k: 'Sample area', v: fmt(area, 2), u: 'cm²' }], summary: 'Sample ' + v.mass + ' g over ' + fmt(area, 1) + ' cm² → ' + fmt(g, 1) + ' GSM' };
    },
    formula: ['GSM = sample mass (g) ÷ sample area (m²)', 'Area (circle) = π × (d ÷ 2)²   ·   Area (rectangle) = width × length   ·   1 cm² = 0.0001 m²']
  };

  /* =============== 2. Warp consumption =============== */
  T.warp = {
    slug: 'warp-consumption', name: 'Warp Consumption Calculator', short: 'Warp yarn weight per metre and per 100 m',
    h1: 'Warp Consumption Calculator: Yarn Weight per Metre and per 100 Metres',
    desc: 'Calculate warp yarn consumption for woven fabric from EPI, reed space, warp count (Ne), crimp and waste. Shows grams per metre, kg per 100 m and total ends.',
    kw: 'warp consumption calculator, warp yarn weight per metre, warp weight formula',
    intro: 'Work out how much warp yarn a metre of fabric uses, so you can plan yarn purchase and compare constructions before weaving.',
    fields: [
      { id: 'epi', label: 'Ends per inch (EPI)', unit: 'ends/in', def: 100, min: 1, step: 1 },
      { id: 'reed', label: 'Reed space (warp width on loom)', unit: 'in', def: 58, min: 1, step: 0.5 },
      { id: 'ne', label: 'Warp count', unit: 'Ne', def: 36, min: 0.5, step: 0.5 },
      { id: 'crimp', label: 'Warp crimp', unit: '%', def: 0, min: 0, step: 0.5 },
      { id: 'waste', label: 'Warp waste / loss', unit: '%', def: 0, min: 0, step: 0.5, hint: 'Knots, tails, beam ends, sizing loss. Use your own mill figure.' },
      { id: 'selv', label: 'Extra selvedge ends', unit: 'ends', def: 0, min: 0, step: 1 }
    ],
    compute: function (v) {
      var r = warpUse(v.epi, v.reed, v.ne, v.crimp, v.waste, v.selv);
      if (!isFinite(r.gPerM)) return null;
      return { rows: [
        { k: 'Warp yarn per metre of fabric', v: fmt(r.gPerM, 1), u: 'g/m', hl: 1 },
        { k: 'Warp yarn per 100 m of fabric', v: fmt(r.kgPer100, 2), u: 'kg' },
        { k: 'Total warp ends', v: fmt(r.ends, 0), u: 'ends' },
        { k: 'Yarn length per metre of fabric', v: fmt(r.lenPerM, 0), u: 'm' },
        { k: 'Yarn count in tex', v: fmt(tex(v.ne), 2), u: 'tex' }
      ], summary: 'Warp: EPI ' + v.epi + ', reed ' + v.reed + ' in, Ne ' + v.ne + ', crimp ' + v.crimp + '%, waste ' + v.waste + '% → ' + fmt(r.kgPer100, 2) + ' kg per 100 m' };
    },
    formula: ['Total ends = EPI × reed space (in) + selvedge ends', 'Yarn length per metre of fabric = total ends × (1 + crimp)', 'Warp weight (g/m) = yarn length (m) × (590.541 ÷ Ne) ÷ 1000 × (1 + waste)'],
    derivation: 'Each warp end runs the full length of the fabric. If the fabric is 1 m long and crimp is c, each end consumes 1 + c metres of yarn. Multiply by the number of ends and by the yarn mass per metre (tex ÷ 1000).',
    assume: ['Count in Ne; weight is for the greige beam width (reed space).', 'Crimp and waste are inputs you supply; no default is assumed.'],
    notes: ['Reed space is wider than finished fabric width because fabric shrinks in width after weaving and finishing.', 'Compare with the GSM calculator: warp weight per metre ÷ finished width (m) gives the warp share of GSM when crimp and width basis match.'],
    faq: [['How do I calculate warp weight per metre?', 'Total ends × (1 + crimp) × (590.541 ÷ Ne) ÷ 1000. For 5,800 ends of Ne 36 with no crimp that is about 95.1 g per metre.'], ['What is reed space?', 'The width of warp threads across the reed on the loom, before the fabric shrinks in width.']]
  };

  /* =============== 3. Weft consumption =============== */
  T.weft = {
    slug: 'weft-consumption', name: 'Weft Consumption Calculator', short: 'Weft yarn weight per metre and per 100 m',
    h1: 'Weft Consumption Calculator: Weft Yarn per Metre and per 100 Metres',
    desc: 'Calculate weft yarn consumption for woven fabric from PPI, reed space, weft count (Ne) and waste. Shows grams per metre, kg per 100 m and picks per metre.',
    kw: 'weft consumption calculator, weft yarn weight per metre, weft weight formula',
    intro: 'Estimate the weft yarn each metre of fabric consumes, using the pick density and the width each pick has to cross.',
    fields: [
      { id: 'ppi', label: 'Picks per inch (PPI)', unit: 'picks/in', def: 80, min: 1, step: 1 },
      { id: 'reed', label: 'Reed space (pick length)', unit: 'in', def: 58, min: 1, step: 0.5 },
      { id: 'ne', label: 'Weft count', unit: 'Ne', def: 36, min: 0.5, step: 0.5 },
      { id: 'waste', label: 'Weft waste / tails', unit: '%', def: 0, min: 0, step: 0.5, hint: 'Selvedge tails and loss. Use your own mill figure.' }
    ],
    compute: function (v) {
      var r = weftUse(v.ppi, v.reed, v.ne, v.waste);
      if (!isFinite(r.gPerM)) return null;
      return { rows: [
        { k: 'Weft yarn per metre of fabric', v: fmt(r.gPerM, 1), u: 'g/m', hl: 1 },
        { k: 'Weft yarn per 100 m of fabric', v: fmt(r.kgPer100, 2), u: 'kg' },
        { k: 'Picks per metre', v: fmt(r.picksPerM, 0), u: 'picks' },
        { k: 'Weft yarn length per metre', v: fmt(r.lenPerM, 0), u: 'm' }
      ], summary: 'Weft: PPI ' + v.ppi + ', reed ' + v.reed + ' in, Ne ' + v.ne + ', waste ' + v.waste + '% → ' + fmt(r.kgPer100, 2) + ' kg per 100 m' };
    },
    formula: ['Picks per metre = PPI × 39.3701', 'Weft length per metre of fabric = picks per metre × reed space (m)', 'Weft weight (g/m) = weft length (m) × (590.541 ÷ Ne) ÷ 1000 × (1 + waste)'],
    derivation: 'Each pick crosses the full reed space once. A metre of fabric has PPI × 39.3701 picks, so the weft length is picks × pick length; multiplying by tex ÷ 1000 converts length to grams.',
    assume: ['Count in Ne. Pick length = reed space. Waste is your own figure.', 'PPI is the loom pick density; finished PPI is usually higher after width shrinkage.'],
    notes: ['If you enter finished PPI with reed space, the weft figure is slightly overstated; use loom PPI for loom planning.'],
    faq: [['How is weft consumption calculated?', 'Picks per metre × reed space in metres gives yarn length; multiply by tex ÷ 1000. 80 PPI, 58 in, Ne 36 gives about 76 g per metre.'], ['Why does weft use depend on reed space?', 'Every pick travels across the whole reed width, so wider reed means more yarn per pick.']]
  };

  /* =============== 4. Cover factor =============== */
  T.cover = {
    slug: 'fabric-construction', name: 'Fabric Construction & Cover Factor Calculator', short: 'Cover factor, balance and weave interlacing',
    h1: 'Fabric Construction and Cover Factor Calculator for Woven Fabric', seoTitle: 'Cover Factor & Fabric Construction Calculator',
    desc: 'Calculate warp, weft and total cover factor (Ne basis), EPI:PPI balance and average float length for plain, twill and satin weaves, with formulas shown.',
    kw: 'cover factor calculator, woven fabric cover factor, EPI PPI balance, fabric construction calculator',
    intro: 'Cover factor compares how tightly threads are packed relative to their thickness, so constructions with different counts can be compared on one scale.',
    fields: [
      { id: 'epi', label: 'Ends per inch (EPI)', unit: 'ends/in', def: 100, min: 1, step: 1 },
      { id: 'ppi', label: 'Picks per inch (PPI)', unit: 'picks/in', def: 80, min: 1, step: 1 },
      { id: 'neW', label: 'Warp count', unit: 'Ne', def: 36, min: 0.5, step: 0.5 },
      { id: 'neF', label: 'Weft count', unit: 'Ne', def: 36, min: 0.5, step: 0.5 },
      { id: 'weave', label: 'Weave', type: 'select', def: 'plain', options: WEAVE_OPTS }
    ],
    compute: function (v) {
      var c = cover(v.epi, v.ppi, v.neW, v.neF); if (!isFinite(c.k)) return null;
      var w = WEAVES[v.weave] || WEAVES.plain;
      var cls = c.k < 10 ? 'below the 10–22 “open set” range quoted for plain fabrics' : c.k <= 22 ? 'open set (10–22) on the plain-fabric scale' : c.k <= 35 ? 'close set (22–35) on the plain-fabric scale' : 'above the 35 upper range quoted for plain fabrics';
      return { rows: [
        { k: 'Warp cover factor (Kw)', v: fmt(c.kw, 2), u: '' },
        { k: 'Weft cover factor (Kf)', v: fmt(c.kf, 2), u: '' },
        { k: 'Fabric cover factor (K)', v: fmt(c.k, 2), u: '', hl: 1 },
        { k: 'Position on scale', v: cls, u: '' },
        { k: 'EPI : PPI balance', v: fmt(v.epi / v.ppi, 2) + ' : 1', u: '' },
        { k: 'Weave repeat', v: w.n + ' ends × ' + w.n + ' picks', u: '' },
        { k: 'Average float length', v: fmt(w.n / w.tr, 1), u: 'threads' }
      ], summary: 'Construction ' + v.epi + '×' + v.ppi + ', Ne ' + v.neW + '×' + v.neF + ', ' + w.label + ' → cover factor ' + fmt(c.k, 1) };
    },
    formula: ['Kw = EPI ÷ √Ne(warp)     Kf = PPI ÷ √Ne(weft)', 'K (fabric) = Kw + Kf − (Kw × Kf ÷ 28)', 'Average float length = repeat size ÷ number of up/down changes per thread in the repeat'],
    derivation: 'Yarn diameter is proportional to 1 ÷ √count, so EPI ÷ √Ne tracks how much of the cloth width each thread system occupies. The −Kw·Kf ÷ 28 term corrects for the overlap of the two thread systems.',
    assume: ['Ne basis. The 10–22 (open) and 22–35 (close) ranges are quoted for plain fabrics; they are a reference scale, not a quality grade.', 'Float length is derived from the weave repeat: plain 1.0, 2/1 twill 1.5, 2/2 and 3/1 twill 2.0, 5-end satin 2.5 threads.'],
    notes: ['Longer floats allow more threads to be packed than in plain weave, but need more care against snagging; cover factor alone does not predict hand or durability.', 'Compare constructions only on the same weave and fibre type.'],
    faq: [['What is cover factor?', 'A number combining thread density and yarn fineness: EPI ÷ √Ne for warp, PPI ÷ √Ne for weft, combined with a correction term.'], ['What is a good cover factor?', 'It depends on end use. For plain fabrics the reference ranges are 10–22 (open) and 22–35 (close); tight cloth is not automatically better for every use.']]
  };

  /* =============== 5. Yarn count converter =============== */
  var SYS = [['ne', 'Ne — English cotton count'], ['nm', 'Nm — metric count'], ['tex', 'Tex'], ['den', 'Denier'], ['nek', 'NeK — worsted count']];
  T.yarn = {
    slug: 'yarn-count-converter', name: 'Yarn Count Converter', short: 'Ne, Tex, Denier, Nm, NeK and ply',
    h1: 'Yarn Count Converter: Ne, Tex, Denier, Nm and NeK with Ply Calculation',
    desc: 'Convert yarn count between Ne, Tex, Denier, Nm and NeK in either direction, and see the resultant count of plied yarns such as 36/1 versus 36/2.',
    kw: 'yarn count converter, Ne to tex, Ne to denier, Nm to Ne, 36/1 vs 36/2',
    intro: 'Type a count in any system and see it in all the others. Add a ply number to see the resultant count of a plied yarn.',
    fields: [
      { id: 'val', label: 'Count value', unit: '', def: 36, min: 0.01, step: 0.5 },
      { id: 'sys', label: 'System', type: 'select', def: 'ne', options: SYS },
      { id: 'ply', label: 'Ply (36/1 → 1, 36/2 → 2)', unit: 'ply', def: 1, min: 1, step: 1 }
    ],
    compute: function (v) {
      var ply = Math.max(1, Math.round(v.ply || 1)); var t1 = TO_TEX[v.sys](v.val); if (!isFinite(t1)) return null;
      var s = allCounts(t1), r = allCounts(t1 * ply), indirect = (v.sys === 'ne' || v.sys === 'nm' || v.sys === 'nek');
      var nm = { ne: 'Ne', nm: 'Nm', tex: 'Tex', den: 'Denier', nek: 'NeK' };
      var rows = ['ne', 'tex', 'den', 'nm', 'nek'].map(function (k) { return { k: nm[k] + ' (single yarn)', v: fmt(s[k], k === 'tex' ? 2 : 2), u: '', hl: k === v.sys ? 1 : 0 }; });
      if (ply > 1) {
        rows.push({ k: '— Plied yarn ' + v.val + '/' + ply + ' (' + nm[v.sys] + ') —', v: '', u: '', head: 1 });
        ['ne', 'tex', 'den', 'nm', 'nek'].forEach(function (k) { rows.push({ k: 'Resultant ' + nm[k], v: fmt(r[k], 2), u: '' }); });
      }
      return { rows: rows, summary: 'Yarn ' + v.val + '/' + ply + ' ' + nm[v.sys] + ' → ' + fmt(r.ne, 1) + ' Ne resultant (' + fmt(r.tex, 1) + ' tex)' };
    },
    formula: ['tex = 590.541 ÷ Ne   ·   tex = 1000 ÷ Nm   ·   tex = denier ÷ 9   ·   tex = 885.81 ÷ NeK', 'Ply (indirect systems Ne, Nm, NeK): resultant count = single count ÷ number of plies', 'Ply (direct systems tex, denier): resultant = single value × number of plies'],
    derivation: 'Ne counts 840-yard hanks per pound, NeK counts 560-yard hanks per pound, Nm counts 1,000 m per kg, tex is grams per 1,000 m and denier grams per 9,000 m. Converting any system to tex first and then to the target keeps every conversion consistent.',
    assume: ['36/1 means one single yarn of Ne 36. 36/2 means two Ne 36 yarns plied, resultant Ne 18.', 'Counts are nominal values; real yarn varies along its length.'],
    notes: ['A 36/2 yarn is twice as heavy per metre as 36/1 and is not a finer yarn.', 'Round trips can differ in the last digit because of rounding.'],
    faq: [['What is the difference between 36/1 and 36/2?', '36/1 is a single yarn of Ne 36 (16.4 tex). 36/2 is two Ne 36 yarns plied together: resultant Ne 18, 32.8 tex.'], ['How do I convert Ne to tex?', 'Divide 590.541 by the Ne count: Ne 30 = 19.68 tex.']]
  };

  /* =============== 6. Unit converters (4 small tools) =============== */
  T.uLen = { slug: 'fabric-unit-converter', name: 'Length: metres ↔ yards', sub: true, fields: [{ id: 'm', label: 'Metres', unit: 'm', def: 1000, min: 0, step: 1 }, { id: 'yd', label: 'Yards (leave blank to use metres)', unit: 'yd', def: '', min: 0, step: 1 }],
    compute: function (v) { var m = isFinite(v.yd) && v.yd !== '' ? v.yd * YD : v.m; if (!isFinite(m)) return null; return { rows: [{ k: 'Metres', v: fmt(m, 2), u: 'm', hl: 1 }, { k: 'Yards', v: fmt(m / YD, 2), u: 'yd', hl: 1 }], summary: fmt(m, 1) + ' m = ' + fmt(m / YD, 1) + ' yd' }; },
    formula: ['1 yard = 0.9144 m exactly   ·   yards = metres ÷ 0.9144'] };
  T.uGsm = { slug: 'fabric-unit-converter', name: 'Weight: GSM ↔ oz/yd²', sub: true, fields: [{ id: 'g', label: 'GSM', unit: 'g/m²', def: 120, min: 0, step: 1 }, { id: 'oz', label: 'oz/yd² (leave blank to use GSM)', unit: 'oz/yd²', def: '', min: 0, step: 0.1 }],
    compute: function (v) { var g = isFinite(v.oz) && v.oz !== '' ? v.oz * OZYD2_GSM : v.g; if (!isFinite(g)) return null; return { rows: [{ k: 'GSM', v: fmt(g, 1), u: 'g/m²', hl: 1 }, { k: 'Ounces per square yard', v: fmt(g / OZYD2_GSM, 2), u: 'oz/yd²', hl: 1 }], summary: fmt(g, 1) + ' GSM = ' + fmt(g / OZYD2_GSM, 2) + ' oz/yd²' }; },
    formula: ['1 oz/yd² = 33.9057 g/m²   ·   (28.3495 g ÷ 0.836127 m²)'] };
  T.uKg = { slug: 'fabric-unit-converter', name: 'Linear metres ↔ kilograms', sub: true, fields: [{ id: 'mode', label: 'Convert', type: 'select', def: 'm2kg', options: [['m2kg', 'Metres → kg'], ['kg2m', 'Kg → metres']] }, { id: 'qty', label: 'Quantity (metres or kg)', unit: '', def: 1000, min: 0, step: 1 }, { id: 'w', label: 'Fabric width', unit: 'in', def: 58, min: 1, step: 0.5 }, { id: 'g', label: 'Fabric weight', unit: 'GSM', def: 120, min: 1, step: 1 }],
    compute: function (v) { var wm = v.w * 0.0254, kgPerM = wm * v.g / 1000; var o = v.mode === 'kg2m' ? v.qty / kgPerM : v.qty * kgPerM; if (!isFinite(o)) return null; return { rows: [{ k: v.mode === 'kg2m' ? 'Length' : 'Weight', v: fmt(o, 2), u: v.mode === 'kg2m' ? 'm' : 'kg', hl: 1 }, { k: 'Weight per linear metre', v: fmt(kgPerM * 1000, 1), u: 'g/m' }, { k: 'Fabric width', v: fmt(wm * 100, 1), u: 'cm' }], summary: (v.mode === 'kg2m' ? fmt(v.qty, 1) + ' kg' : fmt(v.qty, 1) + ' m') + ' at ' + v.w + ' in, ' + v.g + ' GSM = ' + fmt(o, 1) + (v.mode === 'kg2m' ? ' m' : ' kg') }; },
    formula: ['kg per metre = width (m) × GSM ÷ 1000   ·   kg = metres × kg per metre   ·   metres = kg ÷ kg per metre'] };
  T.uWidth = { slug: 'fabric-unit-converter', name: 'Width: inches ↔ centimetres', sub: true, fields: [{ id: 'in', label: 'Inches', unit: 'in', def: 58, min: 0, step: 0.5 }, { id: 'cm', label: 'Centimetres (leave blank to use inches)', unit: 'cm', def: '', min: 0, step: 0.5 }],
    compute: function (v) { var i = isFinite(v.cm) && v.cm !== '' ? v.cm / 2.54 : v.in; if (!isFinite(i)) return null; return { rows: [{ k: 'Inches', v: fmt(i, 2), u: 'in', hl: 1 }, { k: 'Centimetres', v: fmt(i * 2.54, 1), u: 'cm', hl: 1 }], summary: fmt(i, 1) + ' in = ' + fmt(i * 2.54, 1) + ' cm' }; },
    formula: ['1 inch = 2.54 cm exactly'] };
  T.units = { slug: 'fabric-unit-converter', name: 'Fabric Unit & Weight Converter', short: 'Metres/yards, GSM/oz, metres/kg, inches/cm',
    h1: 'Fabric Unit and Weight Converter: Metres, Yards, GSM, oz/yd², Kg and Width',
    desc: 'Convert fabric length (metres ↔ yards), weight (GSM ↔ oz/yd²), linear metres ↔ kilograms for a given width and GSM, and width (inches ↔ cm).',
    kw: 'fabric unit converter, meters to yards fabric, GSM to oz/yd2, meters to kg fabric',
    intro: 'Four converters for the units that appear on fabric specifications and invoices.', parts: ['uLen', 'uGsm', 'uKg', 'uWidth'],
    assume: ['Metres to kilograms uses nominal GSM and nominal width; real rolls vary with moisture, width and weight tolerance.'],
    notes: ['Always state in an order whether quantity is in metres, yards or kilograms and the weight basis (greige or finished).'],
    faq: [['How many yards are in a metre?', '1.0936 yards (1 yd = 0.9144 m).'], ['How do I convert fabric metres to kilograms?', 'Multiply metres × width (m) × GSM ÷ 1000. 1,000 m at 58 in and 120 GSM is about 176.8 kg.']] };

  /* =============== 7. Cost estimator =============== */
  T.cost = {
    slug: 'fabric-cost-estimator', name: 'Woven Fabric Cost Estimator', short: 'Yarn, sizing, weaving, dyeing, wastage per metre/yard',
    h1: 'Woven Fabric Cost Estimator: Cost per Metre and per Yard',
    desc: 'Costing worksheet for woven fabric: yarn, sizing, weaving, dyeing, finishing and wastage give cost per metre and per yard. You enter the prices.',
    kw: 'fabric cost calculator, woven fabric costing, cost per metre fabric, greige fabric cost',
    intro: 'Enter your own prices. No market rates are built in, so the cost lines stay empty until you fill them.',
    fields: [
      { id: 'epi', label: 'EPI', unit: 'ends/in', def: 100, min: 1, step: 1, grp: 'Construction' },
      { id: 'ppi', label: 'PPI', unit: 'picks/in', def: 80, min: 1, step: 1, grp: 'Construction' },
      { id: 'reed', label: 'Reed space', unit: 'in', def: 58, min: 1, step: 0.5, grp: 'Construction' },
      { id: 'neW', label: 'Warp count', unit: 'Ne', def: 36, min: 0.5, step: 0.5, grp: 'Construction' },
      { id: 'neF', label: 'Weft count', unit: 'Ne', def: 36, min: 0.5, step: 0.5, grp: 'Construction' },
      { id: 'crW', label: 'Warp crimp', unit: '%', def: 0, min: 0, step: 0.5, grp: 'Construction' },
      { id: 'wasteY', label: 'Yarn waste', unit: '%', def: 0, min: 0, step: 0.5, grp: 'Construction' },
      { id: 'pW', label: 'Warp yarn price', unit: 'per kg', def: '', min: 0, step: 1, grp: 'Your prices', ph: 'enter price' },
      { id: 'pF', label: 'Weft yarn price', unit: 'per kg', def: '', min: 0, step: 1, grp: 'Your prices', ph: 'enter price' },
      { id: 'size', label: 'Sizing cost', unit: 'per kg warp', def: '', min: 0, step: 1, grp: 'Your prices', ph: 'enter price' },
      { id: 'wMode', label: 'Weaving charge basis', type: 'select', def: 'pm', options: [['pm', 'Per metre of fabric'], ['pp', 'Per 1,000 picks']], grp: 'Your prices' },
      { id: 'weave', label: 'Weaving charge', unit: 'per unit above', def: '', min: 0, step: 0.1, grp: 'Your prices', ph: 'enter rate' },
      { id: 'dye', label: 'Dyeing / finishing', unit: 'per metre', def: '', min: 0, step: 0.5, grp: 'Your prices', ph: 'enter price' },
      { id: 'other', label: 'Other (freight, packing…)', unit: 'per metre', def: '', min: 0, step: 0.5, grp: 'Your prices', ph: 'optional' },
      { id: 'lossP', label: 'Fabric wastage / seconds', unit: '%', def: 0, min: 0, step: 0.5, grp: 'Your prices' },
      { id: 'qty', label: 'Order quantity (optional)', unit: 'm', def: '', min: 0, step: 100, grp: 'Your prices', ph: 'metres' }
    ],
    compute: function (v) {
      var w = warpUse(v.epi, v.reed, v.neW, v.crW, v.wasteY, 0), f = weftUse(v.ppi, v.reed, v.neF, v.wasteY);
      if (!isFinite(w.gPerM) || !isFinite(f.gPerM)) return null;
      var z = function (x) { return isFinite(x) ? x : 0; };
      var warpC = w.gPerM / 1000 * z(v.pW), weftC = f.gPerM / 1000 * z(v.pF), sizeC = w.gPerM / 1000 * z(v.size);
      var weaveC = v.wMode === 'pp' ? f.picksPerM / 1000 * z(v.weave) : z(v.weave);
      var sub = warpC + weftC + sizeC + weaveC + z(v.dye) + z(v.other);
      var tot = sub / (1 - Math.min(z(v.lossP), 95) / 100);
      var rows = [
        { k: 'Warp yarn used', v: fmt(w.gPerM, 1), u: 'g/m' }, { k: 'Weft yarn used', v: fmt(f.gPerM, 1), u: 'g/m' },
        { k: 'Warp yarn cost', v: fmt(warpC, 2), u: 'per m' }, { k: 'Weft yarn cost', v: fmt(weftC, 2), u: 'per m' }, { k: 'Sizing', v: fmt(sizeC, 2), u: 'per m' },
        { k: 'Weaving', v: fmt(weaveC, 2), u: 'per m' }, { k: 'Dyeing / finishing + other', v: fmt(z(v.dye) + z(v.other), 2), u: 'per m' },
        { k: 'Cost before wastage', v: fmt(sub, 2), u: 'per m' },
        { k: 'Estimated cost per metre', v: fmt(tot, 2), u: '', hl: 1 }, { k: 'Estimated cost per yard', v: fmt(tot * YD, 2), u: '', hl: 1 }
      ];
      if (isFinite(v.qty) && v.qty > 0) rows.push({ k: 'Order total (' + fmt(v.qty, 0) + ' m)', v: fmt(tot * v.qty, 0), u: '' });
      if (sub === 0) rows.push({ k: 'Note', v: 'Enter your prices above to see cost.', u: '' });
      return { rows: rows, summary: 'Costing worksheet: EPI ' + v.epi + ', PPI ' + v.ppi + ', reed ' + v.reed + ' in, Ne ' + v.neW + '/' + v.neF + (sub ? ', estimate ' + fmt(tot, 2) + ' per m (own inputs)' : '') };
    },
    formula: ['Warp cost/m = warp g/m ÷ 1000 × warp price per kg   ·   Weft cost/m likewise', 'Sizing/m = warp g/m ÷ 1000 × sizing cost per kg   ·   Weaving/m = rate per metre, or picks per metre ÷ 1000 × rate per 1,000 picks', 'Cost before wastage = yarn + sizing + weaving + dyeing/finishing + other', 'Cost per metre = cost before wastage ÷ (1 − wastage %)   ·   per yard = per metre × 0.9144'],
    derivation: 'Yarn quantities come from the warp and weft consumption formulas. Wastage is treated as a share of fabric lost, so the saleable metre carries that cost: dividing by (1 − wastage) recovers it.',
    assume: ['Currency is whatever you type in; the tool does not convert.', 'No prices, conversion rates or wastage percentages are assumed.', 'Dyeing/finishing is entered per metre of finished fabric.'],
    notes: ['This is an estimating worksheet, not a quotation. Taxes, financing and margin are not included.', 'ENZO quotes custom constructions after reviewing the full specification.'],
    faq: [['How is woven fabric cost calculated?', 'Yarn used per metre × yarn price, plus sizing, weaving, dyeing and finishing, then adjusted for wastage.'], ['Why divide by (1 − wastage)?', 'If 5% of fabric is lost, the good 95% must carry the whole cost.']]
  };

  /* =============== 8. Comparison =============== */
  function band(g) { return g < 100 ? 'very light' : g < 130 ? 'light' : g < 170 ? 'medium' : g < 220 ? 'medium-heavy' : 'heavy'; }
  var cmpFields = [];
  ['a', 'b'].forEach(function (p, i) {
    var d = i === 0 ? { epi: 100, ppi: 80, neW: 36, neF: 36, w: 58, wv: 'plain' } : { epi: 84, ppi: 72, neW: 26, neF: 26, w: 58, wv: 'plain' }, G = 'Fabric ' + p.toUpperCase();
    cmpFields.push({ id: p + 'epi', label: 'EPI', unit: 'ends/in', def: d.epi, min: 1, step: 1, grp: G }, { id: p + 'ppi', label: 'PPI', unit: 'picks/in', def: d.ppi, min: 1, step: 1, grp: G }, { id: p + 'neW', label: 'Warp count', unit: 'Ne', def: d.neW, min: 0.5, step: 0.5, grp: G }, { id: p + 'neF', label: 'Weft count', unit: 'Ne', def: d.neF, min: 0.5, step: 0.5, grp: G }, { id: p + 'wv', label: 'Weave', type: 'select', def: d.wv, options: WEAVE_OPTS, grp: G }, { id: p + 'wd', label: 'Width', unit: 'in', def: d.w, min: 1, step: 0.5, grp: G });
  });
  T.compare = {
    slug: 'spec-comparison', name: 'Fabric Specification Comparison Tool', short: 'Compare two constructions side by side',
    h1: 'Fabric Specification Comparison Tool: Compare Two Woven Constructions',
    desc: 'Compare two woven fabric constructions side by side: GSM, cover factor, balance and yarn weight per metre. Sample values are placeholders, not specs.',
    kw: 'fabric comparison tool, compare fabric constructions, 36/1 vs 26/1 fabric, EPI PPI comparison',
    intro: 'Enter two builds to see the numerical differences. The sample values are placeholders to show how the tool works; they are not ENZO specifications.',
    fields: cmpFields,
    compute: function (v) {
      function one(p) { var g = gsm(v[p + 'epi'], v[p + 'ppi'], v[p + 'neW'], v[p + 'neF'], 0, 0), c = cover(v[p + 'epi'], v[p + 'ppi'], v[p + 'neW'], v[p + 'neF']), wv = WEAVES[v[p + 'wv']] || WEAVES.plain; return { g: g.total, k: c.k, bal: v[p + 'epi'] / v[p + 'ppi'], kgm: g.total * v[p + 'wd'] * 0.0254 / 1000, tw: tex(v[p + 'neW']), tf: tex(v[p + 'neF']), wv: wv, wd: v[p + 'wd'] }; }
      var A = one('a'), B = one('b'); if (!isFinite(A.g) || !isFinite(B.g)) return null;
      var pct = function (x, y) { return fmt((x - y) / y * 100, 1) + '%'; };
      var rows = [
        { k: 'Theoretical GSM', vals: [fmt(A.g, 1), fmt(B.g, 1)], hl: 1 }, { k: 'Weight class (indicative)', vals: [band(A.g), band(B.g)] },
        { k: 'Fabric cover factor', vals: [fmt(A.k, 1), fmt(B.k, 1)] }, { k: 'EPI : PPI', vals: [fmt(A.bal, 2), fmt(B.bal, 2)] },
        { k: 'Warp / weft tex', vals: [fmt(A.tw, 1) + ' / ' + fmt(A.tf, 1), fmt(B.tw, 1) + ' / ' + fmt(B.tf, 1)] }, { k: 'Weave', vals: [A.wv.label, B.wv.label] },
        { k: 'Yarn weight per metre', vals: [fmt(A.kgm * 1000, 0) + ' g', fmt(B.kgm * 1000, 0) + ' g'] }
      ];
      var read = [];
      read.push('A is ' + pct(A.g, B.g).replace('-', '') + (A.g >= B.g ? ' heavier' : ' lighter') + ' than B on a theoretical GSM basis.');
      read.push((A.k >= B.k ? 'A' : 'B') + ' is the more densely covered construction (cover factor ' + fmt(Math.max(A.k, B.k), 1) + ' vs ' + fmt(Math.min(A.k, B.k), 1) + ').');
      read.push('The heavier fabric will generally hang with more weight and suit cooler-weather wear; the lighter will feel airier. Handfeel also depends on fibre, weave and finishing, which this tool does not model.');
      return { cols: ['Fabric A', 'Fabric B'], rows: rows, read: read, summary: 'Compare A ' + v.aepi + '×' + v.appi + ' Ne ' + v.aneW + '/' + v.aneF + ' (' + fmt(A.g, 0) + ' GSM) vs B ' + v.bepi + '×' + v.bppi + ' Ne ' + v.bneW + '/' + v.bneF + ' (' + fmt(B.g, 0) + ' GSM)' };
    },
    formula: ['GSM = 23.25 × [ EPI ÷ Ne(warp) + PPI ÷ Ne(weft) ]   (crimp not included)', 'K = Kw + Kf − Kw·Kf ÷ 28, with Kw = EPI ÷ √Ne(warp), Kf = PPI ÷ √Ne(weft)', 'Yarn weight per metre = GSM × width (m)'],
    derivation: 'The tool applies the same GSM and cover factor formulas used in the individual calculators to both fabrics and reports the differences.',
    assume: ['Weight classes (very light < 100, light 100–130, medium 130–170, medium-heavy 170–220, heavy ≥ 220 GSM) are ENZO working bands for comparison only; they are not an industry standard.', 'Crimp is ignored so both fabrics are compared on the same basis.'],
    notes: ['Use a lab-measured GSM for decisions. This tool is for early-stage comparison of constructions.'],
    faq: [['How do I compare two fabric constructions?', 'Compare GSM, cover factor, EPI:PPI balance and yarn tex. A heavier, more densely covered build will usually feel firmer and hang with more weight.'], ['Is a higher cover factor better?', 'Not always. It signals a tighter build, which suits some uses and not others.']]
  };

  var PAGES = ['gsm', 'warp', 'weft', 'cover', 'yarn', 'units', 'cost', 'compare'];
  return { T: T, PAGES: PAGES, fmt: fmt, num: num, tex: tex, gsm: gsm, cover: cover, warpUse: warpUse, weftUse: weftUse, TO_TEX: TO_TEX, FROM_TEX: FROM_TEX, allCounts: allCounts, consts: { IN_PER_M: IN_PER_M, TEX_NE: TEX_NE, TEX_NEK: TEX_NEK, OZYD2_GSM: OZYD2_GSM } };
});
