const T = require('../../js/tool-defs.js'); let fails = 0;
function eq(name, got, exp, tol) { tol = tol == null ? 0.011 : tol; const ok = Math.abs(got - exp) <= tol; if (!ok) fails++; console.log((ok ? 'ok  ' : 'FAIL') + ' ' + name + ' got ' + got + ' expected ' + exp); }
eq('tex of Ne30', T.tex(30), 19.68, 0.01);
eq('Ne36 tex', T.tex(36), 16.40, 0.01);
const c = T.allCounts(T.TO_TEX.ne(30)); eq('Ne30 denier', c.den, 177.2, 0.1); eq('Ne30 Nm', c.nm, 50.8, 0.05); eq('Ne30 NeK', c.nek, 30 * 885.81 / 590.541 / 30 * 1 === 0 ? 0 : 885.81 / 19.68, 0.1);
eq('gsm 100/80 Ne36', T.gsm(100, 80, 36, 36, 0, 0).total, 116.3, 0.1);
eq('gsm const 23.25', T.consts.IN_PER_M * T.consts.TEX_NE / 1000, 23.25, 0.01);
eq('warp g/m 100epi 58in Ne36', T.warpUse(100, 58, 36, 0, 0, 0).gPerM, 95.1, 0.1);
eq('weft g/m 80 ppi 58in Ne36', T.weftUse(80, 58, 36, 0).gPerM, 76.0, 0.2);
eq('cover K 100/80 Ne36', T.cover(100, 80, 36, 36).k, 16.667 + 13.333 - 16.667 * 13.333 / 28, 0.01);
eq('oz/yd2', 1 * T.consts.OZYD2_GSM, 33.906, 0.001);
// 36/2 resultant Ne 18
eq('ply 36/2 -> Ne', T.FROM_TEX.ne(T.TO_TEX.ne(36) * 2), 18, 0.001);
// consistency: warp+weft g/m per reed = gsm*width when width = reed (no crimp)
const w = T.warpUse(100, 58, 36, 0, 0, 0).gPerM + T.weftUse(80, 58, 36, 0).gPerM; eq('GSM x width equals warp+weft', T.gsm(100, 80, 36, 36, 0, 0).total * 58 * 0.0254, w, 0.01);
// every tool computes on its defaults
const defs = T.T; Object.keys(defs).forEach(function (k) { const t = defs[k]; if (!t.compute) return; const v = {}; t.fields.forEach(function (f) { v[f.id] = f.type === 'select' ? f.def : (f.def === '' ? NaN : f.def); }); const r = t.compute(v); const ok = r && r.rows && r.rows.length; if (!ok) fails++; console.log((ok ? 'ok  ' : 'FAIL') + ' defaults compute: ' + k); });
const kg = defs.uKg.compute({ mode: 'm2kg', qty: 1000, w: 58, g: 120 }); eq('1000 m 58in 120gsm kg', parseFloat(kg.rows[0].v), 176.8, 0.1);
process.exit(fails ? 1 : 0);
