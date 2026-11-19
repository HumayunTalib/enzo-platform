const TD = require('../../js/tool-defs.js');
const f = TD.fmt, tex = TD.tex;
const B = '../../';
const h2 = (id, t) => '<h2 id="' + id + '">' + t + '</h2>';
const tbl = (head, rows) => '<div class="b2-table-wrap"><table class="b2-table"><thead><tr>' + head.map(h => '<th scope="col">' + h + '</th>').join('') + '</tr></thead><tbody>' + rows.map(r => '<tr>' + r.map(c => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
const fm = lines => '<div class="b2-formula">' + lines.map(l => '<div>' + l + '</div>').join('') + '</div>';
const def = (t, x) => '<div class="b2-def"><strong>' + t + '</strong>' + x + '</div>';
const tool = (s, t) => '<a href="' + B + 'tools/' + s + '/">' + t + '</a>';
const art = (s, t) => '<a href="' + B + 'knowledge-centre/' + s + '/">' + t + '</a>';
const jr = (s, t) => '<a href="' + B + 'journal/' + s + '.html">' + t + '</a>';
const cnt = ne => { const t = tex(ne), c = TD.allCounts(t); return [String(ne), f(t, 2), f(c.den, 1), f(c.nm, 1)]; };

const A = {};

/* ===== 1. yarn count ===== */
A['yarn-count-systems-explained-ne-tex-denier-nm'] = {
  updated: '2026-11-19', sources: [['Textile School — Yarn count conversions', 'https://www.textileschool.com/179/yarn-count-conversions/']],
  related: ['ring-spun-vs-open-end-yarn-for-woven-fabric', 'how-to-calculate-woven-fabric-gsm'], tools: ['yarn-count-converter', 'gsm-calculator'], journal: [['yarn-count-conversion-ne-nm-tex-denier', 'Yarn count conversion: Ne, Nm, Tex, Denier'], ['what-is-yarn-count', 'What is yarn count?']],
  faq: [['What does 36/1 mean in yarn count?', 'It is a single yarn (one ply) with an English cotton count of Ne 36. The number before the slash is the count of each single yarn; the number after is the number of plies.'], ['What is the difference between 36/1 and 36/2?', '36/2 is two Ne 36 yarns plied together. Its resultant count is about Ne 18 and it is twice as heavy per metre as 36/1. It is not a finer yarn.'], ['How do I convert Ne to tex?', 'Divide 590.541 by the Ne count. Ne 30 is 19.68 tex.']],
  body: `<p>Every woven-fabric specification starts with yarn counts, and every supplier quotes them in a different system. A buyer who cannot convert between Ne, Nm, tex and denier cannot compare quotations, check a construction or work out a fabric weight. This article sets out the systems, the formulas that connect them and how to read a ply notation such as 36/1 or 36/2.</p>
${def('Definition', 'Yarn count is a measure of yarn fineness expressed as length per unit mass (indirect systems: Ne, Nm, NeK) or mass per unit length (direct systems: tex, denier).')}
<div id="toc-anchor"></div>
${h2('direct-indirect', 'Direct and indirect systems')}
<p>In an <strong>indirect</strong> system the count is the length of yarn that weighs one unit of mass, so a <em>higher</em> number means a <em>finer</em> yarn. Ne (English cotton count), Nm (metric count) and the worsted count NeK are indirect. In a <strong>direct</strong> system the count is the mass of a fixed length, so a <em>higher</em> number means a <em>coarser</em> yarn. Tex and denier are direct.</p>
${tbl(['System', 'Definition', 'Type', 'Higher number means'], [['Ne', 'Number of 840-yard hanks per pound', 'Indirect', 'Finer'], ['Nm', 'Kilometres of yarn per kilogram (metres per gram)', 'Indirect', 'Finer'], ['NeK (worsted)', 'Number of 560-yard hanks per pound', 'Indirect', 'Finer'], ['Tex', 'Grams per 1,000 m', 'Direct', 'Coarser'], ['Denier', 'Grams per 9,000 m', 'Direct', 'Coarser']])}
${h2('formulas', 'Conversion formulas')}
<p>Because every system can be expressed through tex, conversions are one step each way. The constants follow from the unit definitions (1 lb = 453.59 g; 840 yd = 768.1 m). They match the values published by Textile School (Ne = 590.5 ÷ tex; Nm = Ne × 1.693).</p>
${fm(['tex = 590.541 ÷ Ne', 'tex = 1000 ÷ Nm', 'tex = denier ÷ 9', 'tex = 885.81 ÷ NeK', 'Nm = 1.693 × Ne'])}
<p>Worked values for counts commonly seen in suiting specifications:</p>
${tbl(['Ne', 'Tex', 'Denier', 'Nm'], [26, 30, 36, 37].map(cnt))}
<p>Try other values in the ${tool('yarn-count-converter', 'yarn count converter')}.</p>
${h2('ply', 'Reading 36/1 and 36/2')}
<p>In the notation <code>36/2</code> the first number is the count of each single yarn and the second is the number of plies twisted together. <code>36/1</code> is therefore a single Ne 36 yarn. <code>36/2</code> is two Ne 36 yarns plied.</p>
<p>For indirect systems the resultant count is the single count divided by the number of plies; for direct systems the value is multiplied by the number of plies. Two Ne 36 yarns have a resultant count of Ne 18, which is ${f(tex(36) * 2, 1)} tex against ${f(tex(36), 1)} tex for a single Ne 36 yarn. This is a nominal figure: twisting the plies together takes up a little length, so measured counts differ slightly.</p>
${tbl(['Notation', 'Plies', 'Resultant Ne', 'Resultant tex'], [['36/1', '1', '36', f(tex(36), 1)], ['36/2', '2', '18', f(tex(36) * 2, 1)], ['26/1', '1', '26', f(tex(26), 1)], ['26/2', '2', '13', f(tex(26) * 2, 1)]])}
${h2('buyers', 'What this means for a specification')}
<ul><li><strong>State the system.</strong> Write "Ne 36" or "36/1 Ne", not just "36". A bare number is ambiguous because Ne 36 and Nm 36 are very different yarns.</li><li><strong>State warp and weft separately.</strong> They are often different. The ${tool('gsm-calculator', 'GSM calculator')} takes both.</li><li><strong>State single or plied.</strong> A plied yarn changes the fabric weight and handle.</li><li><strong>Finer yarn, lighter cloth.</strong> At the same ends and picks per inch, a finer yarn gives a lighter fabric. The weight formula is in ${art('how-to-calculate-woven-fabric-gsm', 'How to calculate woven fabric GSM')}.</li></ul>
<p>Counts such as 36/1, 37/1 and 26/1 PV are among those ENZO weaves; the count for any order is confirmed in the quotation.</p>`
};

/* ===== 2. ring vs open-end ===== */
A['ring-spun-vs-open-end-yarn-for-woven-fabric'] = {
  updated: '2026-11-19', sources: [['Islam, M. R. (2019). European Scientific Journal, 15(3) — comparison of ring and rotor yarn properties (PDF)', 'https://core.ac.uk/download/236409368.pdf']],
  related: ['yarn-count-systems-explained-ne-tex-denier-nm', 'how-to-write-a-woven-fabric-specification-for-an-rfq'], tools: ['yarn-count-converter', 'spec-comparison'], journal: [['ring-spun-vs-polyester-yarn', 'Ring-spun vs polyester yarn']],
  faq: [['Is ring-spun yarn stronger than open-end yarn?', 'In the study cited here, ring-spun yarn had a higher count-strength product (about 2,300 against about 1,700 for rotor yarn). Results depend on fibre, count and machine settings.'], ['Which yarn is hairier?', 'In the same study, rotor yarn was about 12% less hairy than ring-spun yarn.'], ['Can I assume the same result for a PV blend?', 'No. Test data for your fibre blend and count is needed before assuming the same difference.']],
  body: `<p>Ring spinning and rotor (open-end) spinning are the two dominant ways to make staple yarn for woven fabric. They differ in how fibres are assembled and twisted, and that changes yarn strength, evenness and hairiness. This article summarises one published comparison and lists what to ask a supplier before you specify either.</p>
${def('Definition', 'Ring spinning drafts a fibre strand and twists it with a traveller running on a ring, then winds it onto a bobbin. Rotor (open-end) spinning feeds a sliver into a rapidly rotating rotor where individual fibres are collected and twisted into a yarn.')}
${h2('how', 'How the two methods differ')}
<p>In ring spinning the fibres stay in a continuous strand from drafting to winding, and twist is inserted along that strand. In rotor spinning the sliver is broken into individual fibres, which are carried into the rotor groove and twisted into a yarn as it is drawn out. Rotor spinning is a higher-throughput process, and the paper cited below puts rotor yarn at around 20% of staple-yarn production.</p>
${h2('data', 'What one study measured')}
<p>Islam (2019), published in the <em>European Scientific Journal</em>, compared ring-spun and rotor yarns at yarn level. In the samples tested:</p>
${tbl(['Property', 'Ring-spun', 'Rotor (open-end)'], [['Count-strength product (CSP)', 'About 2,300', 'About 1,700 (roughly a quarter lower)'], ['Hairiness', 'Higher', 'About 12% lower'], ['Evenness', 'Less even', 'More even']])}
<p>Read this as one data point, not a rule. The numbers come from the yarns and settings in that study; fibre, count, twist and machine condition all shift them. The paper measures yarn, not woven fabric, so it does not tell you how a fabric will behave in use. Check the paper for the fibre and count tested before comparing with your blend.</p>
${h2('weaving', 'Why it matters in weaving')}
<p>Warp yarns are under more tension and abrasion on the loom than weft yarns, so warp strength and evenness matter for weaving efficiency. Hairiness affects how the surface looks and feels and how much fibre sheds during preparation. A buyer who cares about surface and handle will want hairiness and evenness in the conversation; one who cares about robustness will ask about strength.</p>
${h2('ask', 'What to ask a supplier')}
<ul><li>Is the warp ring-spun or rotor? Is the weft the same?</li><li>What is the count, in Ne, for each (see ${art('yarn-count-systems-explained-ne-tex-denier-nm', 'yarn count systems')})?</li><li>Is there test data for strength and evenness on the lot being used?</li><li>Is the fabric specification written around the spinning method, or does the supplier choose?</li></ul>
<p>ENZO procures yarn independently to the specification of each order, so the spinning system for warp and weft should be stated in your RFQ if it matters to you.</p>`
};

/* ===== 3. GSM ===== */
(function () {
  const g0 = TD.gsm(100, 80, 36, 36, 0, 0), g1 = TD.gsm(100, 80, 36, 36, 8, 5);
  A['how-to-calculate-woven-fabric-gsm'] = {
    updated: '2026-11-19', sources: [['Textile School — Yarn count conversions (Ne and tex constants)', 'https://www.textileschool.com/179/yarn-count-conversions/']],
    related: ['yarn-count-systems-explained-ne-tex-denier-nm', 'cover-factor-and-fabric-balance'], tools: ['gsm-calculator', 'warp-consumption', 'weft-consumption'], journal: [['how-to-calculate-fabric-gsm-from-epi-ppi', 'How to calculate fabric GSM from EPI, PPI and yarn count'], ['what-is-gsm', 'What is GSM?']],
    faq: [['What is the GSM formula for woven fabric?', 'GSM = 23.25 × [EPI × (1 + warp crimp) ÷ Ne warp + PPI × (1 + weft crimp) ÷ Ne weft], where crimp is a fraction.'], ['How do I measure GSM without a formula?', 'Cut a sample of known area (a 100 cm² circle is common), weigh it in grams and multiply by 100.'], ['Why does my measured GSM differ from the calculated value?', 'Crimp, sizing, finishing chemicals and moisture all change the real weight; the calculation covers only the yarn in the cloth.']],
    body: `<p>GSM (grams per square metre) is the number buyers quote most often and the one most often disputed. For woven fabric you can calculate it from the construction or measure it from a sample. This article derives the formula, works an example and explains why the two methods disagree.</p>
${def('Definition', 'GSM is the mass of one square metre of fabric in grams. Woven-fabric GSM is the sum of the warp yarn and the weft yarn in that square metre, plus anything added in finishing.')}
${h2('derivation', 'Deriving the formula')}
<p>Start with one square metre: 1 m wide and 1 m long.</p>
<ol><li>The width holds <strong>EPI × 39.3701</strong> warp ends (there are 39.3701 inches in a metre).</li><li>Each end runs the full 1 m of fabric length but, because it weaves over and under the picks, it uses <strong>1 + crimp</strong> metres of yarn.</li><li>A yarn of count tex weighs <strong>tex ÷ 1000</strong> grams per metre, and tex = 590.541 ÷ Ne.</li></ol>
<p>Warp weight = EPI × 39.3701 × (1 + crimp<sub>w</sub>) × 590.541 ÷ Ne<sub>w</sub> ÷ 1000. Collecting constants, 39.3701 × 590.541 ÷ 1000 = 23.25. The weft follows the same logic with PPI.</p>
${fm(['GSM = 23.25 × [ EPI × (1 + crimp<sub>w</sub>) ÷ Ne<sub>warp</sub> + PPI × (1 + crimp<sub>f</sub>) ÷ Ne<sub>weft</sub> ]'])}
${h2('example', 'Worked example')}
<p>A construction of 100 ends × 80 picks per inch with Ne 36 warp and Ne 36 weft, ignoring crimp:</p>
${fm(['Warp = 23.25 × 100 ÷ 36 = ' + f(g0.warp, 1) + ' g/m²', 'Weft = 23.25 × 80 ÷ 36 = ' + f(g0.weft, 1) + ' g/m²', 'GSM = ' + f(g0.total, 1)])}
<p>If the same fabric has illustrative crimps of 8% in the warp and 5% in the weft, the figure becomes ${f(g1.total, 1)} GSM. Crimp is measured on a sample; the 8% and 5% here are examples only.</p>
${h2('sample', 'The cut-sample method')}
<p>Cut a sample of known area, weigh it and scale to one square metre. A 100 cm² circle (diameter 11.28 cm) weighs one-hundredth of a square metre, so GSM = mass in grams × 100. A 5 cm × 20 cm rectangle is also 100 cm². Take several samples across the width and along the length and average them.</p>
${h2('limits', 'Why calculated and measured values differ')}
<ul><li><strong>Crimp.</strong> Ignoring it understates weight; the figure depends on weave, density and tension.</li><li><strong>Sizing and finishing.</strong> Size on the warp and finishing chemicals add mass the formula does not include.</li><li><strong>Moisture.</strong> Fibres hold different amounts of water, so the same fabric weighs differently at different humidity.</li><li><strong>Width basis.</strong> EPI on the loom and EPI on the finished fabric are different numbers because the fabric shrinks in width. Use the basis that matches the state you are weighing.</li></ul>
<p>Treat a calculated GSM as a planning figure and the weighed sample as the specification. State which one you mean and give a tolerance.</p>
<p>Use the ${tool('gsm-calculator', 'GSM calculator')} for the formula and the sample method, ${tool('warp-consumption', 'warp')} and ${tool('weft-consumption', 'weft consumption')} for yarn weights, and ${tool('fabric-unit-converter', 'unit converter')} for oz/yd².</p>`
  };
})();

/* ===== 4. cover factor ===== */
(function () {
  const c1 = TD.cover(100, 80, 36, 36), c2 = TD.cover(84, 72, 26, 26), g1 = TD.gsm(100, 80, 36, 36, 0, 0).total, g2 = TD.gsm(84, 72, 26, 26, 0, 0).total;
  A['cover-factor-and-fabric-balance'] = {
    updated: '2026-11-19', sources: [['Textile Learner — Cover factor of woven fabric', 'https://textilelearner.net/?p=1555']],
    related: ['how-to-calculate-woven-fabric-gsm', 'how-to-write-a-woven-fabric-specification-for-an-rfq'], tools: ['fabric-construction', 'spec-comparison'], journal: [['plain-twill-satin-weave-differences', 'Plain, twill and satin weave differences']],
    faq: [['What is cover factor?', 'A number combining thread density and fineness: EPI ÷ √Ne for the warp, PPI ÷ √Ne for the weft, combined into one fabric figure.'], ['What cover factor range is open or close set?', 'For plain fabrics the source quoted here gives roughly 10–22 for open set and 22–35 for close set.'], ['Does a higher cover factor mean better fabric?', 'No. It means a tighter build, which suits some uses and not others.']],
    body: `<p>Two fabrics with different yarn counts and different EPI × PPI cannot be compared by density alone. Cover factor puts them on one scale. This article explains the calculation, the reference ranges and how the weave changes what is possible.</p>
${def('Definition', 'Cover factor measures how much of a fabric\'s area is covered by its threads, based on thread density and yarn fineness. Warp cover factor, weft cover factor and a combined fabric cover factor are all in use.')}
${h2('formulas', 'The formulas')}
<p>Yarn diameter varies with 1 ÷ √count, so EPI ÷ √Ne tracks the share of the width each thread system fills. The combined figure corrects for overlap between the two systems (formulas as given by Textile Learner):</p>
${fm(['K<sub>w</sub> = EPI ÷ √Ne<sub>warp</sub>', 'K<sub>f</sub> = PPI ÷ √Ne<sub>weft</sub>', 'K = K<sub>w</sub> + K<sub>f</sub> − (K<sub>w</sub> × K<sub>f</sub> ÷ 28)'])}
<p>For 100 × 80 at Ne 36 / Ne 36: K<sub>w</sub> = ${f(c1.kw, 2)}, K<sub>f</sub> = ${f(c1.kf, 2)}, K = ${f(c1.k, 2)}.</p>
${h2('range', 'Reading the range')}
<p>For plain fabrics the same source puts open-set fabrics at about 10 to 22 and close-set fabrics at about 22 to 35. These are reference bands, not a grade. A fabric at the edge of a band is simply near the boundary.</p>
${h2('compare', 'Comparing two constructions')}
${tbl(['', 'Fabric A', 'Fabric B'], [['EPI × PPI', '100 × 80', '84 × 72'], ['Warp / weft Ne', '36 / 36', '26 / 26'], ['Cover factor K', f(c1.k, 1), f(c2.k, 1)], ['Theoretical GSM (no crimp)', f(g1, 1), f(g2, 1)]])}
<p>Fabric A is denser on the cover-factor scale yet lighter, because its yarn is finer. Neither number alone describes the cloth. These are example constructions, not ENZO specifications. Compare your own in the ${tool('spec-comparison', 'specification comparison tool')}.</p>
${h2('balance', 'Balance and weave')}
<p><strong>Balance</strong> is the EPI : PPI ratio. Many suiting constructions have more ends than picks, so the ratio is above 1. A strongly unbalanced cloth behaves differently in the two directions.</p>
<p>The weave sets how threads interlace. The <strong>average float length</strong> is the weave repeat divided by the number of interlacing changes: plain weave 1.0; 2/1 twill 1.5; 2/2 and 3/1 twill 2.0; five-end satin 2.5. Fewer interlacings leave more room to pack threads, which is why twill and satin constructions can reach higher densities than plain weave. Longer floats also snag more easily, so density is not the only factor in choosing a weave.</p>
<p>Calculate all of this in the ${tool('fabric-construction', 'fabric construction calculator')}.</p>`
  };
})();

/* ===== 5. spec for RFQ ===== */
A['how-to-write-a-woven-fabric-specification-for-an-rfq'] = {
  updated: '2026-11-19', sources: [], related: ['ready-stock-vs-custom-weave', 'bulk-fabric-pre-shipment-inspection'], tools: ['gsm-calculator', 'fabric-unit-converter'], journal: [['questions-before-bulk-fabric-order', 'Questions before a bulk fabric order'], ['yarn-specs-before-bulk-order', 'Yarn specs before a bulk order']],
  faq: [['What is the minimum information for a fabric RFQ?', 'Composition, construction or reference sample, width, quantity and whether the fabric is greige or dyed. A supplier can ask for the rest.'], ['Should GSM be a single number?', 'State a target and a tolerance, and say whether it applies to greige or finished fabric.'], ['Can I send a sample instead of a specification?', 'A reference sample is useful alongside the specification, and many details can be read from it, but written figures remove ambiguity.']],
  body: `<p>A request for quotation that leaves out a field gets a quotation that makes an assumption. When the assumption is wrong, the price changes after the order. A written specification, even a partial one, moves those decisions to the beginning.</p>
${def('Definition', 'A woven fabric specification is the written description of a fabric precise enough that two suppliers could make the same cloth from it: fibre, yarn, construction, size, weight, finish, colour and acceptance criteria.')}
<div id="toc-anchor"></div>
${h2('fields', 'The fields')}
${tbl(['Field', 'What to write', 'Common mistake'], [
    ['Composition', 'Fibre content and ratio, e.g. polyester/viscose with the percentages', 'Giving the blend name only'],
    ['Yarn count', 'Warp and weft count with system, ply and spinning method if it matters (e.g. Ne 36/1)', 'A bare number with no system'],
    ['Construction', 'EPI × PPI, and whether measured on greige or finished cloth', 'Mixing loom and finished density'],
    ['Weave', 'Plain, twill type, satin or a drawing/reference', 'Leaving it implied'],
    ['Width', 'Width and basis (selvedge to selvedge or usable)', 'Not stating the basis'],
    ['Weight', 'GSM target with tolerance and basis (greige or finished)', 'A single number with no tolerance'],
    ['Finish', 'Required finishing steps and performance targets', 'Omitting finishing'],
    ['Colour', 'Greige, or shade reference and approval method (swatch, lab dip)', 'Describing colour by name only'],
    ['Quantity and packing', 'Total metres, roll length range, packing and labelling', 'Quantity in yards in one place, metres in another'],
    ['Inspection', 'Method, sample size and acceptance limit (see the pre-shipment inspection article)', 'No acceptance criteria'],
    ['Delivery', 'Destination, Incoterm and target date', 'Leaving the destination until after the quote']])}
${h2('numbers', 'Getting the numbers right')}
<ul><li>Convert counts with the ${tool('yarn-count-converter', 'yarn count converter')} so the quote and your internal spec use the same system.</li><li>Check that GSM, EPI, PPI and counts agree with the ${tool('gsm-calculator', 'GSM calculator')}. A target GSM that does not match the construction is a common source of disputes.</li><li>Use the ${tool('fabric-unit-converter', 'unit converter')} for metres, yards and oz/yd².</li></ul>
${h2('ratio', 'Partial specifications are fine')}
<p>You do not need every field to start. State what you know and mark the rest "open". ENZO reviews the specification before quoting and replies with what is missing. The ${'<a href="' + B + 'quote/">RFQ form</a>'} carries the key fields, and a printable <a href="${B}resources/">specification sheet template</a> collects them all.</p>
${h2('check', 'Checklist before you send')}
<ul><li><span class="box"></span>Composition with percentages</li><li><span class="box"></span>Warp and weft count, with system and ply</li><li><span class="box"></span>EPI × PPI and the basis</li><li><span class="box"></span>Width and basis</li><li><span class="box"></span>GSM target and tolerance</li><li><span class="box"></span>Greige or dyed; shade reference</li><li><span class="box"></span>Quantity in metres</li><li><span class="box"></span>Inspection method and acceptance limit</li><li><span class="box"></span>Destination and target date</li></ul>`
};

/* ===== 6. ready stock vs custom ===== */
A['ready-stock-vs-custom-weave'] = {
  updated: '2026-11-19', sources: [], related: ['how-to-write-a-woven-fabric-specification-for-an-rfq', 'bulk-fabric-pre-shipment-inspection'], tools: ['fabric-cost-estimator', 'spec-comparison'], journal: [['greige-vs-finished-fabric', 'Greige vs finished fabric'], ['what-is-greige-fabric', 'What is greige fabric?']],
  faq: [['Is ready stock cheaper than custom weave?', 'Not necessarily. Ready stock saves time and avoids a production run; price depends on the quality and quantity, so compare quotations.'], ['Can I change the colour on a ready-stock lot?', 'No. Ready stock is fabric already finished in the colours held. A different colour needs a custom run.'], ['What decides the timeline of a custom order?', 'Yarn availability, dyeing, the weaving schedule and the final inspection. ENZO states the timeline in the quotation.']],
  body: `<p>Bulk fabric can be bought two ways: from stock that already exists, or woven to your specification. The right choice depends on how much of the specification you can compromise and how much time you have.</p>
${def('Definition', 'Ready stock is finished fabric already held, in the construction and colours available. Custom weave is fabric made to a buyer\'s specification: yarn is procured, woven and, if required, dyed.')}
${h2('compare', 'The two options compared')}
${tbl(['', 'Ready stock', 'Custom weave'], [['Construction', 'Fixed: what has been woven', 'Yours to specify'], ['Colour', 'The colours held', 'Greige, or dyed to your shade'], ['Quantity', 'What is held', 'Set by the order'], ['Time', 'Shorter: no production run', 'Includes yarn, weaving, dyeing, inspection'], ['Sampling', 'You can see the finished cloth', 'Approval of a sample or reference before the run'], ['Flexibility', 'Low', 'High']])}
${h2('timeline', 'What sets the timeline for custom orders')}
<p>For a custom order the timeline is the sum of its stages, and each can be the slowest. At ENZO those stages are yarn procurement, weaving, dyeing through external partners if the order is dyed, and an independent final inspection before dispatch. ENZO states the timeline in the quotation for your specification, not as a general figure.</p>
${h2('greige', 'Greige or dyed')}
<p>Greige fabric is woven but not yet dyed or finished. A buyer with their own dyeing arrangement may want greige; a buyer who wants fabric ready to cut will want it dyed. If you order dyed fabric, state the shade reference and how it will be approved, because colour is the commonest source of rejection.</p>
${h2('choose', 'A simple way to choose')}
<ul><li>If the construction and colour you need already exist in stock and the quantity fits, ready stock is the shorter route.</li><li>If you need a specific construction, count, width or shade, or a larger quantity, specify a custom weave.</li><li>If you are not sure, send the specification anyway and ask which route fits.</li></ul>
<p>See the current ready-stock lot on the <a href="${B}store.html">Ready Stock page</a>, or write the specification for a custom weave using ${art('how-to-write-a-woven-fabric-specification-for-an-rfq', 'the specification guide')}. The ${tool('fabric-cost-estimator', 'fabric cost estimator')} helps you compare routes with your own prices.</p>`
};

/* ===== 7. shuttleless looms ===== */
A['shuttleless-looms-for-suiting-fabric'] = {
  updated: '2026-11-19', sources: [['e-PG Pathshala (INFLIBNET) — Shuttleless looms', 'https://ebooks.inflibnet.ac.in/hsp08/?p=126']],
  related: ['bulk-fabric-pre-shipment-inspection', 'cover-factor-and-fabric-balance'], tools: ['warp-consumption', 'weft-consumption'], journal: [['plain-twill-satin-weave-differences', 'Plain, twill and satin weave differences']],
  faq: [['What is a shuttleless loom?', 'A loom that inserts the weft without a conventional shuttle: projectile, rapier, air-jet and water-jet systems are the main types.'], ['Which shuttleless loom is used for cotton?', 'Water-jet looms are limited to hydrophobic yarns, so they are not used for cotton or viscose weft. The other three types can handle a wider range.']],
  body: `<p>"Shuttleless" describes how the weft yarn crosses the warp, not a single machine. The four main systems differ in how they carry the weft, what yarns they suit and where their limits lie. Knowing the difference helps you ask a mill the right question.</p>
${def('Definition', 'A shuttleless loom inserts the weft pick across the warp shed by a carrier other than a conventional shuttle: a projectile, a rapier, a jet of air or a jet of water.')}
${h2('types', 'The four types')}
${tbl(['Type', 'How the weft crosses', 'Notes from the source'], [
    ['Projectile', 'A small gripper projectile carries the weft across the shed', 'The projectile is described as about 90 mm long and 40 g'],
    ['Rapier', 'A rigid or flexible rapier carries the weft across the shed', 'Among the most commercially successful systems'],
    ['Air-jet', 'A jet of compressed air carries the weft', 'Among the most commercially successful systems'],
    ['Water-jet', 'A jet of water carries the weft', 'Suited only to hydrophobic yarns; maximum fabric width about 230 cm in the source']])}
<p>The source names projectile, rapier and air-jet as the most commercially successful types.</p>
${h2('buyers', 'What it means for a buyer')}
<ul><li><strong>Fibre.</strong> A water-jet loom needs a hydrophobic weft, so it is not an option for cotton or viscose in the weft. The other types are not restricted in the same way.</li><li><strong>Width.</strong> Loom type and reed width limit the widths that can be woven. If your spec needs an unusual width, say so early.</li><li><strong>Not the whole story.</strong> Loom type is one input. Yarn quality, preparation, settings and inspection decide what arrives.</li></ul>
${h2('enzo', 'ENZO\'s loom shed')}
<p>Any woven fabric can be easily produced. Ask for the loom type if it matters to your specification. More on the <a href="${B}manufacturing/">manufacturing page</a>.</p>
<p>Yarn used per metre depends on the construction, not the loom type: see the ${tool('warp-consumption', 'warp')} and ${tool('weft-consumption', 'weft')} calculators.</p>`
};

/* ===== 8. inspection ===== */
A['bulk-fabric-pre-shipment-inspection'] = {
  updated: '2026-11-19', sources: [['V-Trust — ASTM D5430 4-Point System', 'https://www.v-trust.com/en/our-services/inspection-standards/other-reference-standards']],
  related: ['how-to-write-a-woven-fabric-specification-for-an-rfq', 'shuttleless-looms-for-suiting-fabric'], tools: ['gsm-calculator', 'fabric-unit-converter'], journal: [['fabric-inspection-checklist', 'Fabric inspection checklist'], ['inspect-fabric-before-bulk-order', 'Inspect fabric before a bulk order'], ['greige-fabric-defects', 'Greige fabric defects']],
  faq: [['What is the four-point system?', 'A method of scoring visible fabric defects with 1 to 4 penalty points according to their size, then comparing the total with an agreed limit per 100 square yards.'], ['What is an acceptable score?', 'There is no universal limit. Some factories treat up to 40 points per 100 square yards as acceptable, but buyers set their own standards.'], ['Who should carry out the inspection?', 'The party named in the contract. ENZO carries out an independent final inspection before dispatch; a buyer can also appoint its own inspector.']],
  body: `<p>Most fabric disputes are decided at the dock, not the loom. A pre-shipment inspection is the check made on the finished fabric before it is released, and the agreement on how it will be done belongs in the RFQ, not after the problem.</p>
${def('Definition', 'A pre-shipment fabric inspection examines a defined sample of finished rolls for defects, width, weight, shade continuity and packing against the agreed specification and acceptance limit before the goods are shipped.')}
<div id="toc-anchor"></div>
${h2('scope', 'What it covers')}
<ul><li><strong>Visual defects</strong> found on an inspection frame, scored by a system such as the four-point system.</li><li><strong>Width</strong> measured across several points.</li><li><strong>Weight (GSM)</strong> from cut samples; see ${art('how-to-calculate-woven-fabric-gsm', 'how to calculate and measure GSM')}.</li><li><strong>Shade continuity</strong> within a roll and between rolls of the same lot.</li><li><strong>Roll length, packing and labelling</strong> against the order.</li></ul>
${h2('four-point', 'How the four-point system scores defects')}
<p>Each visible defect is given 1 to 4 penalty points by size. The V-Trust summary of ASTM D5430 gives:</p>
${tbl(['Defect length', 'Penalty points'], [['3 inches or less', '1'], ['Over 3 to 6 inches', '2'], ['Over 6 to 9 inches', '3'], ['Over 9 inches', '4']])}
<p>A single flaw is capped at 4 points, and per that source only major defects are penalised, not minor ones. The total is converted to a score per 100 square yards:</p>
${fm(['Points per 100 yd² = total points × 3,600 ÷ (yards inspected × fabric width in inches)'])}
<p>The source notes that some factories treat up to 40 points per 100 square yards as acceptable, and that buyers set their own standards. The system can be used with "criteria and tolerance agreed previously between buyers and sellers". So the limit is a commercial term, not a fixed rule.</p>
${h2('agree', 'What to agree before the order')}
${tbl(['Item', 'Decide'], [['Method', 'Four-point system or another named method'], ['Acceptance limit', 'Points per 100 yd², or other criteria'], ['Sample size', 'How many rolls, and how much of each is inspected'], ['Who inspects', 'Supplier, buyer, or a third party'], ['Remedy', 'What happens if a lot fails: re-inspection, credit, replacement']])}
${h2('enzo', 'ENZO\'s inspection role')}
<p>ENZO carries out an independent final quality inspection before dispatch. The inspector is separate from loom operations and is compensated from the unit\'s profit (see the <a href="${B}manufacturing/">manufacturing page</a>). If your contract requires a specific method or a third-party inspector, put it in the RFQ and the quotation will reflect it.</p>`
};

module.exports = A;
