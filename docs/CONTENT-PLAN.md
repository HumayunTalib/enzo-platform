# ENZO Fabric Journal — Content Plan

Written 2026-08-26. Phase 0 (technical remediation), then 26 new posts and 9
rewrites or merges of existing posts, scheduled September 2026 → May 2027.

## Scope

ENZO deals in **men's suiting, shirting and shalwar kameez fabric only**,
wholesale and retail. No women's fabric. No curtains, upholstery or home
textile. Everything in this plan sits inside that boundary; the terms that fall
outside it are listed at the end with the reason, not quietly dropped.

## Publication rule — commercially sensitive figures

**Hard rule, all posts, no exceptions.** The following never appear publicly:

- greige rates
- dyeing costs
- wastage costs
- margins of any kind
- landed cost figures

A post that would need one of these to make its argument is rewritten so the
argument works without it, or it does not run. Where a `[NEEDS INPUT]` below
asked for such a figure, it is now marked **NOT FOR PUBLICATION** — no answer is
wanted and nothing is waiting on it.

This is compatible with the costing pillar (B3). The calculator already takes
yarn rates, machine type, kinara type, FX rate and bag weight **as reader
inputs** — it teaches the model and the reader supplies his own numbers. B3 does
the same in prose: the structure of a cost, not ENZO's costs.

**Audit of the existing 54 against this rule:** clean. Only four posts carry
currency figures and none discloses anything covered above —
`best-fabric-shalwar-kameez` (illustrative shop-counter prices),
`gsm-width-fabric-cost` (a generic A/B worked example),
`what-makes-fabric-worth-its-price` (Safa Rs. 400 and Noor Rs. 500 — public
retail prices already on `shop.html`). `fabric-sourcing-pakistan-international`
uses the phrase "landed cost" with no figure attached; worth a glance on its
next edit, but it discloses nothing.

## The opening

The Journal's 54 published articles are addressed to wholesale buyers and mills.
They cover greige, yarn count, EPI/PPI, costing, inspection and supplier due
diligence — well, and in some places three times over.

**Almost nothing speaks to the man buying fabric for his own tailor.**

That is the gap. Not a category gap, an audience gap. The same fabric, the same
mill, the same expertise — addressed to the person who walks in wanting three
suit lengths instead of the person placing a 10,000-metre order. He asks
different questions, uses different words, and currently finds nothing here.

Measured against the existing 54 files:

| Term | Files containing it |
|---|---|
| latha, khaddar, karandi | **0** |
| kurta, sherwani, prince coat, blazer, waistcoat | **0** |
| linen, jacquard, supima, PC blend, poly-viscose, modal, lyocell | **0** |
| percale, sateen, self-design | **0** |
| shirting | **1** |
| wash-and-wear | 2 |
| viscose | 3 |
| tailor | 4 |
| boski, slub | 4–5 |
| shalwar kameez | 6 |

"Suiting" appears in 10 files and "shalwar kameez" in 6 — but framed as a
wholesale specification problem, not as something a man buys and hands to a
tailor. The vocabulary of retail men's fabric buying is effectively absent.

## How to read this

| Marker | Meaning |
|---|---|
| **NEW** | Post that does not exist. Written from scratch. |
| **EXPAND** | Existing file, kept at its URL, rewritten longer. |
| **MERGE** | Two or more existing files consolidated into one URL. |
| **PILLAR** | Long, comprehensive, linked to by the supporting posts in its cluster. |
| **W** / **R** | Serves a wholesale buyer / a retail customer. **W+R** where genuinely both. |
| `[NEEDS INPUT: …]` | A fact I do not have. Must be filled before that post publishes. |

The current Journal's longest article is 632 words and its four "pillars" run
354–470. The lengths below are a deliberate step up, not a continuation.

---

# PHASE 0 — Technical remediation

**Ships before a single new post is written. Blocking.**

Two defects will compound with every post added. Fixing them costs a scripted
pass over 54 files and one edit to `journal.html`.

## 0.1 — JSON-LD is missing three required properties on all 54 posts

Every post in `journal/` carries an `Article` block with only `headline`,
`author`, `publisher` and `mainEntityOfPage`. **Zero of 54 have
`datePublished`, `dateModified` or `image`** — despite every post already having
a visible publish date rendered on the index.

`datePublished` is required for Article rich-result eligibility. The dates exist
as data in `journal.html`; they are simply not written into the structured data.
Pure plumbing.

**The work:**

1. Parse `journal.html` into a `{ slug → date, cluster, excerpt }` map from the
   54 `.post-row` blocks. The date is the `.post-side` mono `<span>`; the set
   currently spans 2025-06-30 → 2026-08-10.
2. For each `journal/*.html`, rewrite the JSON-LD to add:
   - `datePublished` — from the map, ISO 8601.
   - `dateModified` — the Phase 0 ship date, since every file is genuinely being
     modified. Maintained per edit thereafter.
   - `image` — `https://enzolhr.com/assets/og-image.png`, matching the
     `og:image` each post already declares. Per-post images would be better and
     are out of scope here; the shared OG image is correct and truthful.
   - `description` — mirror the existing `<meta name="description">` while the
     file is open. Cheap, and completes the entity.
3. Verify: all 54 parse as valid JSON, all 54 dates match the index, no file
   changes outside its JSON-LD block.

**Do not invent dates.** All 54 index rows currently carry one; if any is
missing, halt rather than guess.

## 0.2 — Hardcoded article counts break on the first new post

Four places state the count as prose and go wrong the moment post 55 publishes:

| Location | Current text |
|---|---|
| `journal.html` `<meta name="description">` | "…54 articles across 14 topics, wholesale and retail." |
| `journal.html` `og:description` | same string |
| `journal.html` `twitter:description` | same string |
| `journal.html` `.page-head` lead | "Fifty-four articles across fourteen topics — from what GSM actually means to how to evaluate a Pakistani fabric supplier. Everything below is live." |

**Fix by removing the numbers, not by automating them.** The count is not what
makes the sentence work, and a self-updating counter is machinery this site does
not otherwise have.

- Meta/OG/Twitter → "Technical fabric knowledge and buying guides from ENZO —
  GSM, yarn, construction, sourcing, costing and quality control. Wholesale and
  retail."
- Lead → "From what GSM actually means to how to evaluate a Pakistani fabric
  supplier. Written by the people who weave and sell this cloth."

If a count is wanted on the page, render it from
`document.querySelectorAll('.post-row').length` in the existing inline script.

## 0.3 — Two cheap fixes worth doing in the same pass

- **Unify cross-post link paths.** Article bodies use two forms for one
  destination: `href="reed-and-pick.html"` and `href="../journal/reed-and-pick.html"`.
  Both resolve; standardise on the sibling form. 161 cross-post links exist,
  none broken — tidying, not repair.
- **Wire the stage filter.** `data-stage` is already on all 54 rows and
  `.stage.tofu/.mofu/.bofu/.soon` plus `.filter-group` are already styled in
  `css/components.css`, but only cluster is filterable. Roughly six lines of JS
  against markup that already exists.

**Phase 0 touches no article prose.** Ship it, confirm all 54 still render, then
start writing.

---

# PHASE 1 — The retail men's clusters

**September 2026 → March 2027. The priority.**

Clusters A, C, D, E and F below are written for the man buying for his own
tailor. None of them competes with anything published.

## Seasonality

Three cycles matter, and none of them is lawn:

- **Wedding season** — roughly October to February. Sherwani, prince coat,
  blazer, waistcoat, formal suiting. Publishes **September and October 2026**.
- **Winter suiting** — buying starts October, peaks November to January.
  Khaddar, karandi, wool blends. Publishes **September and October 2026**.
- **Eid al-Fitr** — falls around mid-March 2027, so buying and tailoring run
  through January and February. Kurta, shalwar kameez, summer suiting.
  Publishes **December 2026 and January 2027**.

`[NEEDS INPUT: confirm the Eid al-Fitr 2027 date against a local moon-sighting
calendar before C4 is scheduled. I will not state a date I cannot verify.]`

Nothing seasonal publishes in the month it is about. Everything lands two to
four months ahead.

## The range — confirmed 2026-08-26

**Three qualities, all ENZO's own manufacture.** ENZO weaves; it does not source
or trade. That is a positioning strength and every post should treat it as one.

| Quality | Season | Construction | Shades |
|---|---|---|---|
| **Bluebird** | Four-season | `[NEEDS INPUT]` | 8 — Grey, Bright Grey, Pink Grey, Biscuit Grey, Turquoise Grey, Green Grey, Blue Grey, Yellow Grey |
| **LoomAura** | Four-season | 64×64 / 26×26 | 2 — black, navy blue |
| **VP Gold** | Winter | 56×52 / 20×20 | 1 currently, more in production for winter |

Plus **PET and PURE yarn fabric, wholesale purchasers only.**

**Weight class: shalwar kameez and shirting only.** No sherwani, jamawar, coat
or jacket weight. Any post implying otherwise is cut, not softened.

**Not stocked:** latha, khaddar, karandi, cambric, linen, jacquard. Posts
covering these are **education-only** — explain the fabric honestly, then close
by pointing at what ENZO does make. Never imply stock that does not exist.

### Positioning constraint

ENZO is not a speciality house carrying a broad catalogue. It produces a focused
range and is currently improving manufacturing rather than widening it.
**Anything it produces is the speciality.** No post may position ENZO as
offering a wide selection.

This has a direct consequence for Cluster A, and it is worth deciding before
Phase 1 starts — see the recommendation under that cluster.

### Never publish stock-on-hand quantities

Stock figures go stale weekly. Where availability matters, write **"in stock,
subject to availability — confirm on WhatsApp"** — never a number. The 10,000 m
MOQ is a separate thing: it is the **wholesale minimum**, it remains correct,
and it must never be conflated with stock on hand.

---

## Correction pass — completed before Phase 1

Nova Silk and Wostar Wool were discontinued but hardcoded across the site. All
of it is now corrected. No new posts were written.

| Area | What changed |
|---|---|
| `data/products.js` | Rewritten to the three real qualities. Unknown fields left blank with inline `[NEEDS INPUT]`, never guessed |
| `data/retail-products.js` | `source:` → `production: 'Woven by ENZO, Faisalabad'` on all four codes; header note added that ENZO manufactures and does not source |
| `product-safa/noor/waqar/daim.html` | Spec row **Source → Production**, "Woven by ENZO, Faisalabad" |
| `product-safa.html`, `product-noor.html` | Meta/OG "Sourced from ENZO's own mill" → "Woven at ENZO's own mill in Faisalabad" (3 instances) |
| `catalog.html` | Meta, OG and Twitter descriptions rewritten; filters **Wash & Wear / Winter / Summer → Four-Season / Winter**; page lead rewritten to the focused-range position |
| `index.html` | Product grid 4 cards → 3; "Four constructions" → "Three qualities"; "Sourcing at volume?" → "Buying at volume?" |
| `wholesale.html` | Three category cards rewritten to Bluebird / LoomAura / VP Gold; `?cat=` deep links updated |
| `about.html` | Three quality cards rewritten; MOQ relabelled **Wholesale MOQ**; thaan noted as 20 m; dispatch row added |
| `contact.html` | Quality-field placeholder → "e.g. Bluebird, LoomAura, VP Gold" |
| `js/catalog.js` | Renders shade **names as text** when no hex exists rather than eight identical placeholder chips; falls back to the quality name when there is no article code; omits `&article=` from the deep link when blank |
| `journal/what-is-woven-fabric.html`, `journal/ring-spun-vs-polyester-yarn.html` | CTA copy and body claims naming the old range rewritten. The ring-spun post cited specific discontinued compositions — replaced with the general principle, not a substituted claim |
| Six MOQ locations | All now read explicitly as a **wholesale** minimum |
| Five journal posts | **"4 to 4.5 metres" → 4 metres** for a full men's shalwar kameez, per confirmed spec |

**Verified:** zero references to Nova Silk, Wostar Wool, NS-01, WW-07 or the
Bluebird summer/winter split remain anywhere outside one deliberate `[NEEDS
INPUT]` comment. No tier vocabulary exists on the site. No stock-on-hand
quantity is published anywhere. All three data/JS files pass `node --check`;
`node build.js` clean.

**Two things the correction surfaced that need you:**

- **Noor and Waqar's specs are unverified.** Their weight, sett and composition
  were recorded against Nova Silk and Wostar Wool. The numbers are still on the
  pages because removing real specs on suspicion would be worse than flagging
  them — but they need re-confirming against current production.
- **LoomAura and VP Gold have no photography and no article codes.** The grid
  degrades gracefully to a name card, so nothing is broken, but both are
  placeholders until you supply them.

---

# PHASE 2 — Cluster B as expansion, not new posts

Cluster B is the trade knowledge nobody else publishes — and it is the one part
of the brief the Journal has **already covered**. EPI/PPI, Ne yarn count, GSM,
warp and weft, greige, finishing and costing all have live posts. New ones would
put ENZO in competition with itself.

The real defect is the opposite of missing content: **four posts are labelled
pillar and are not.**

| File | Length | Labelled |
|---|---|---|
| `complete-guide-greige-fabric.html` | ~470 words | pillar |
| `complete-guide-woven-fabric.html` | **354 words** | pillar |
| `complete-guide-fabric-costing.html` | ~390 words | pillar |
| `complete-guide-mens-fabric-buying.html` | ~430 words | pillar |

`reed-and-pick.html` — a TOFU supporting post — runs 632 words. Every one of
these four is shorter than the posts meant to point up at it. A pillar thinner
than its own supporting posts is a stub with a grand title.

### B1 — Complete Guide to Buying Men's Fabric — EXPAND to PILLAR
**`complete-guide-mens-fabric-buying.html` · 430 → 2,600 words · R (with a W section) · October 2026**

**The most important rewrite in the plan.** This is the one existing file
already pointed at the retail reader, and it is 430 words. Rebuilt properly it
becomes the hub the entire Phase 1 programme links up to.

**Reader's question:** *"I'm buying unstitched fabric for myself and I don't know
what any of it means. Walk me through it."*

Absorbs, by 301 redirect:
- `mens-unstitched-fabric-guide.html`
- `buying-mens-fabric-by-the-metre.html`

Both answer the same question — how a man buys unstitched fabric — and splitting
it across three files serves nobody.

Keeps as supporting: `best-fabric-shalwar-kameez.html` (575 words),
`summer-vs-winter-fabric-men.html`.

New sections the current file lacks: **boski**, **wash-and-wear** and **latha**
named properly, with Nova Silk (NS-01) and Wostar Wool (WW-07) as worked
examples; how many metres to buy; what to hand a tailor; what a suit length
actually is. Links down into A1, D1, D2 and F1.

### B2 — Complete Guide to Woven Fabric — EXPAND to PILLAR
**`complete-guide-woven-fabric.html` · 354 → 2,600 words · W+R · November 2026**

**Reader's question:** *"How is cloth actually built, and which numbers on a spec
sheet tell me how it will behave?"*

Absorbs: `what-is-woven-fabric.html` (near-duplicate of the pillar's own
opening).

Keeps as supporting: `warp-vs-weft.html` (535 words), `reed-and-pick.html`.

New sections: the three base weaves — plain, twill, satin — and what each does
on the body. This is where **percale and sateen** belong: they are plain and
satin weave under trade names, and framing them as weave structure is the honest
way to cover them for a company that sells no bedding. Also **thread count**,
and why it is a weaker signal than EPI and PPI read separately. The bridge from
here to shirting (A4) is direct — shirting is where weave structure is most
legible to a retail buyer.

### B3 — Complete Guide to Fabric Costing — EXPAND to PILLAR
**`complete-guide-fabric-costing.html` · 390 → 2,800 words · W · December 2026**

**Reader's question:** *"Break down what I'm paying for, line by line, so I can
tell a fair quote from a padded one."*

The site's natural anchor: the only pillar with a working tool behind it. It
already links to `calculator.html` twice; the rebuild should walk the reader
through the calculator's actual inputs — reed, width, warp and weft count,
picks, yarn rates, machine type, kinara type, FX rate, bag weight — so the post
and the tool teach one model.

Absorbs nothing outright. Becomes the destination for the B6 merge. Keeps
`how-fabric-is-priced.html` (587 words), `why-fabric-prices-differ.html` and
`gsm-width-fabric-cost.html` as supporting.

New sections: why the same word "cotton" spans a wide price band — staple
length, combed versus carded, count — and where conversion cost sits against
yarn cost.

**NOT FOR PUBLICATION — conversion cost.** Per the publication rule, no
conversion-cost figure appears. B3 teaches the *structure* of a cost — which
inputs move the number and in which direction — and the reader supplies his own
rates, exactly as `calculator.html` already requires him to. Nothing is waiting
on this.

### B4 — Complete Guide to Greige Fabric — EXPAND to PILLAR
**`complete-guide-greige-fabric.html` · 470 → 2,600 words · W · January 2027**

**Reader's question:** *"Suppliers keep saying 'greige'. What is it, how is it
made, what goes wrong with it, and what am I agreeing to when I buy it?"*

Absorbs: `what-is-greige-fabric.html` (TOFU definition → section 1),
`how-greige-fabric-is-manufactured.html` (502 words → section 2).

Keeps as supporting, all with distinct intent: `greige-vs-finished-fabric.html`
(comparison), `wholesale-greige-fabric.html` (BOFU commercial),
`greige-fabric-defects.html` (problem-led).

New sections: **thaan** as the unit greige actually trades in; the greige-to-
finished weight and width shrinkage that catches first-time buyers; how greige
specification maps onto the calculator.

`[NEEDS INPUT: ENZO's standard thaan length in metres, and whether greige is
quoted per thaan or per metre.]`

### B5 — MERGE: EPI/PPI into reed and pick
**`ends-per-inch-picks-per-inch.html` → `reed-and-pick.html` · → 1,300 words · W · November 2026**

The same topic under two names — how woven density is measured and what the
numbers mean. `reed-and-pick.html` is already the stronger file at 632 words.
Merge into it, redirect the other, and fold in **thread count** as the retail-
facing version of the same measurement.

### B6 — MERGE: the Value-for-Money cluster, three files into one
**→ `what-makes-fabric-worth-its-price.html` · → 1,600 words · W+R · December 2026**

Cluster 11 holds four posts circling one question:

- `fabric-quality-vs-price.html` — "how to judge what a fabric is worth"
- `avoid-overpaying-for-fabric.html` — "how not to overpay"
- `what-makes-fabric-worth-its-price.html` — "a value framework"
- `fabric-finishing-and-price.html` — *distinct; keep*

The first three are one post wearing three hats. Merge into the third, redirect
the other two, link up to B3. Keep `fabric-finishing-and-price.html` separate —
finishing is a mechanism, not a restatement of value.

## Flagged, not scheduled — your call

Cluster 14 plus parts of 7 and 8 hold **five posts answering "how do I pick a
supplier"** — `choose-fabric-supplier`, `evaluate-pakistani-fabric-supplier`,
`bulk-fabric-supplier-evaluation`, `questions-before-bulk-fabric-order`,
`fabric-supplier-vs-trader` — and **two answering "how do I inspect fabric"** —
`fabric-inspection-checklist`, `inspect-fabric-before-bulk-order`.

Same over-fragmentation as Cluster 11, at larger scale, on ENZO's most
commercially valuable BOFU terms. A fifth pillar — *How to Choose and Verify a
Fabric Supplier* — consolidating five files into one 2,500-word page is the
obvious move. Not scheduled, because you specified four and because these are
the pages most likely earning traffic today. Say the word and it takes February
2027.

---

# The schedule

**23 new posts** · 4 pillar rebuilds · 2 merges · 3 expansions.
Three posts were cut outright by the range statement — see below the table.
Phase 0 has shipped; the correction pass has shipped.

| Month | Type | Post | Cl. | Aud. | Words |
|---|---|---|---|---|---|
| **Sep 26** | — | **Phase 0 technical remediation** | — | — | — |
| Sep 26 | NEW | Khaddar and Karandi: The Men's Winter Fabrics | A | R | 1,400 |
| Sep 26 | NEW | Wedding Season Fabric for Men | C | R | 1,500 |
| Sep 26 | NEW | What Actually Keeps You Warm in Winter Suiting | C | R | 1,200 |
| Oct 26 | NEW | **Boski, Wash-and-Wear and Poly-Viscose** — PILLAR | A | R | 2,200 |
| Oct 26 | NEW | The Men's Fabric Calendar: What to Buy When | C | W+R | 1,600 |
| Oct 26 | EXPAND | Complete Guide to Buying Men's Fabric — PILLAR | B | R | 2,600 |
| Nov 26 | NEW | Latha and Cambric: The Everyday Men's Cottons | A | R | 1,300 |
| Nov 26 | NEW | Shirting: What Separates a Good Shirt Fabric | A | W+R | 1,600 |
| Nov 26 | NEW | **Shalwar Kameez: Cut and Cloth** — PILLAR | F | R | 1,700 |
| Nov 26 | NEW | Buying for Your Tailor: What to Bring, What to Ask | D | R | 1,300 |
| Nov 26 | NEW | Will It Fade? Reactive vs Pigment Printing | D | R | 1,300 |
| Nov 26 | EXPAND | Complete Guide to Woven Fabric — PILLAR | B | W+R | 2,600 |
| Nov 26 | MERGE | Reed, Pick and Thread Count | B | W | 1,300 |
| Dec 26 | NEW | Eid Fabric for Men: Heat, Deadline, Tailor | C | R | 1,300 |
| Dec 26 | EXPAND | How Much Fabric You Actually Need | D | R | 1,700 |
| Dec 26 | EXPAND | Complete Guide to Fabric Costing — PILLAR | B | W | 2,800 |
| Dec 26 | MERGE | What Makes a Fabric Worth Its Price | B | W+R | 1,600 |
| Jan 27 | NEW | The Colours ENZO Actually Stocks | C | R | 1,200 |
| Jan 27 | NEW | Stitched vs Unstitched: Which Actually Costs Less | D | R | 1,300 |
| Jan 27 | NEW | Buying Men's Fabric in Lahore | E | R | 1,600 |
| Jan 27 | EXPAND | Complete Guide to Greige Fabric — PILLAR | B | W | 2,600 |
| Feb 27 | NEW | Men's Kurta Fabric | F | R | 1,200 |
| Feb 27 | EXPAND | How to Judge Fabric by Hand | D | R | 1,400 |
| Mar 27 | NEW | Cotton Isn't One Fabric: Staple, Comb and Count | A | W+R | 1,800 |
| Mar 27 | NEW | Linen and Cotton Slub in Pakistani Heat | A | R | 1,200 |
| Mar 27 | NEW | Why Your Kameez Came Back Shorter: Shrinkage | D | R | 1,200 |
| Mar 27 | NEW | Will It Stay Soft After Washing? | D | R | 1,200 |
| Apr 27 | NEW | Viscose, Modal and Lyocell in Men's Suiting | A | W+R | 1,400 |
| Apr 27 | NEW | Jacquard and Self-Design: When the Pattern Is Woven | A | R | 1,200 |
| Apr 27 | NEW | What MOQ Means, and Who Wholesale Is Actually For | D | W+R | 1,500 |
| May 27 | NEW | PC Blend, Poly-Viscose and Recycled Polyester | A | W+R | 1,400 |
| May 27 | EXPAND | Faisalabad, and Why ENZO Produces There | E | W+R | 1,600 |

Wedding and winter content lands September–October, ahead of an
October–February season. Eid content lands December–January, ahead of Eid
al-Fitr around **9–10 March 2027** — locally confirmed nearer the date by moon
sighting, so no post states it as fixed. Nothing seasonal publishes in the month
it is about.

### Cut by the range statement

| Post | Why |
|---|---|
| **Sherwani and Prince Coat Fabric** (F3) | ENZO makes no sherwani, jamawar, coat or jacket weight. The post would have sold cloth that does not exist |
| **Blazer and Waistcoat Fabric** (F4) | Same. Jacketing is outside the weight class entirely — and it took **bouclé** with it |
| **Buying From Karachi, Peshawar, or Not-Lahore** (E3) | Retail is **in-person only, no shipping**. The honest version of this post is one sentence long |

Cutting F3 and F4 removes the wedding cluster's formalwear spine. **C2 survives
in narrowed form** — wedding-season shalwar kameez and shirting for guests, not
groomwear.

---

# Cluster A — Fabric education, men's

> **Standing note — read before writing any of these.**
>
> **Not stocked, confirmed: latha, khaddar, karandi, cambric, linen, jacquard.**
> Those posts are education-only and stay that way. Each explains the fabric
> properly, then closes by naming what ENZO actually weaves — no implied stock,
> no hedging.
>
> **Fibre composition is still unknown for all three qualities.** The range
> statement gave constructions (LoomAura 64×64/26×26, VP Gold 56×52/20×20) but
> not fibre content. Until that lands, no post can say whether ENZO's cloth is
> a boski, a wash-and-wear, a blend, or a pure. **A1, A7 and A9 are blocked on
> question 1.**
>
> **PET and PURE yarn fabric are wholesale-only offerings.** They belong in A9,
> not in a retail post.

### ⚠ Cluster A is too wide for the positioning

Nine fabric-education posts, six of them about fabrics ENZO does not make, reads
as a broad catalogue however carefully each one is worded. That is exactly the
positioning you ruled out.

**Recommendation: cut Cluster A from nine posts to six.** Drop A6 (linen), A7
(viscose/modal/lyocell) and A8 (jacquard) — the three furthest from what ENZO
weaves and the three where the education-only close does the most work for the
least return. That leaves the fabrics a man actually chooses between when buying
shalwar kameez or shirting cloth, and takes the plan to **20 new posts**.

I have not cut them — they are still listed below and still in the schedule.
**Your call.**

Nine posts. Grouped by how fabrics behave and where a man would use them, not
one per fabric name. A reader asking "khaddar or karandi?" is asking one
question.

### A1 — Boski, Wash-and-Wear and Poly-Viscose: The Men's Suiting Family
**PILLAR · NEW · October 2026 · Retail · 2,200 words · BACKING UNCONFIRMED**

**Reader's question:** *"What is boski, why does it cost what it costs, and is
wash-and-wear just the cheap version of it?"*

Secondary terms: boski fabric, wash and wear fabric, poly viscose suiting,
viscose polyester blend, men's suiting fabric, silk-like drape, suit length.

Nova Silk is discontinued, so the old boski backing is gone. Whether this post
is product-backed now turns entirely on the fibre content of Bluebird, LoomAura
and VP Gold — none of which I have. If one of them is a boski or a wash-and-wear
construction, this is the strongest CTA post in the plan. If none is, it becomes
education-only and closes by naming what ENZO does weave. **Blocked on question
1** — do not start it before that answer.

Answers the pricing confusion honestly: wash-and-wear is not a lesser boski, it
is a different fibre balance solving a different problem — crease recovery
versus drape. Links to `catalog.html`, `shop.html`, up to B1, down to F1 and F2.

### A2 — Khaddar and Karandi: The Men's Winter Fabrics
**NEW · September 2026 · Retail · 1,400 words · education-only**

**Reader's question:** *"It's getting cold. Khaddar or karandi — what's the
difference and which one do I want?"*

Secondary terms: khaddar fabric, karandi fabric, men's winter fabric, winter
unstitched, khaddar vs karandi, handloom texture, winter suit length.

**Education-only — ENZO weaves neither.** Closes by pointing at **VP Gold**,
the winter quality ENZO does make, with further shades in production for the
season.

Zero coverage in all 54 existing files, and the first thing a man asks in
October. Two fabrics, two textures, one decision. Covers weave and weight of
each and which suits shalwar kameez versus a suit. Supporting post under A1;
links to C3.

### A3 — Latha and Cambric: The Everyday Men's Cottons
**NEW · November 2026 · Retail · 1,300 words · education-only**

**Reader's question:** *"What's the plain cotton my tailor keeps recommending,
and why is it so much cheaper?"*

Secondary terms: latha fabric, cambric fabric, plain weave cotton, everyday
kameez fabric, white latha, cotton shalwar kameez.

**Education-only — ENZO stocks neither latha nor cambric.** **Latha appears in
zero of the 54 files** and it is the highest-volume everyday
men's cotton in the market — the default white kameez cloth. Covers what
separates latha from cambric, where each is honestly good enough, and when it
isn't. Supporting under A1.

### A4 — Shirting: What Separates a Good Shirt Fabric From a Cheap One
**NEW · November 2026 · Wholesale + Retail · 1,600 words · W+R**

**Reader's question:** *"Why does one white shirt fabric cost three times
another when they look identical folded?"*

Secondary terms: shirting fabric, shirting cotton, twill shirting, poplin,
shirting thread count, collar structure, shirt fabric weight.

Shirting is one of ENZO's three stated product lines and appears in **one** of
54 files. This is the largest single-category gap in the Journal. It is also
where weave structure is most visible to a retail buyer, which makes it the
cleanest bridge from the rebuilt woven pillar (B2) into consumer language.
Links to B2, `reed-and-pick.html`, A5.

### A5 — Cotton Isn't One Fabric: Staple, Comb and Count
**NEW · March 2027 · Wholesale + Retail · 1,800 words · W+R**

**Reader's question:** *"Two shops both say 100% cotton and the price is double.
What am I missing?"*

Secondary terms: supima cotton, cotton slub, combed vs carded cotton, staple
length, Ne count, cotton quality, why cotton prices differ.

The strongest bridge between the retail clusters and the existing trade content
— the wholesale buyer's question in the retail customer's words. **Supima**
lands here as the long-staple reference point. Links directly to
`what-is-yarn-count.html`, to the costing pillar (B3), and to `calculator.html`.

### A6 — Linen and Cotton Slub in Pakistani Heat
**NEW · March 2027 · Retail · 1,200 words · education-only**

**Reader's question:** *"Is linen worth it here, or does it just crease?"*

Secondary terms: linen fabric, linen blend, cotton slub, linen creasing,
breathable fabric, summer suiting, slub texture.

**Education-only — ENZO does not weave linen.** **One of the three posts I
recommend cutting** — furthest of all from the range, and the reader it attracts
is not one ENZO can serve.

Honest about the trade-off rather than selling linen as a premium word. Covers
where **cotton slub** sits as the cheaper texture substitute — a term already
appearing in five existing files with no post that explains it.

### A7 — Viscose, Modal and Lyocell in Men's Suiting
**NEW · April 2027 · Wholesale + Retail · 1,400 words · BACKING UNCONFIRMED**

**Reader's question:** *"These feel lovely in the shop. Will they survive a year
of washing?"*

Secondary terms: viscose fabric, modal fabric, lyocell fabric, regenerated
cellulose, viscose blend, fabric pilling, drape.

Viscose was backed by Nova Silk, now discontinued. Whether viscose is still an
ENZO fibre at all depends on question 1. Modal and lyocell are education-only
regardless — ENZO weaves neither. **This is one of the three posts I recommend
cutting**: two of its three fabrics are things ENZO does not make, and the third
is unconfirmed. Links to D7.

### A8 — Jacquard and Self-Design: When the Pattern Is Woven, Not Printed
**NEW · April 2027 · Retail · 1,200 words · education-only**

**Reader's question:** *"Why does this self-design cost more than a printed
fabric with the same pattern?"*

Secondary terms: jacquard fabric, self design fabric, woven pattern, dobby,
textured suiting, self print.

**Education-only — ENZO does not weave jacquard.** **One of the three posts I
recommend cutting** — self-design is a real market segment, but ENZO has nothing
in it, and a post about patterned cloth from a mill that weaves plain suiting
invites the wrong expectation.

Self-design men's suiting is a large and completely uncovered segment —
**jacquard and self-design both appear in zero of 54 files**. Answers a real
pricing confusion: woven-in pattern is a loom operation, print is a surface
operation, and the cost structures are nothing alike. Links up to B2 and B3.

### A9 — PC Blend, Poly-Viscose and Recycled Polyester
**NEW · May 2027 · Wholesale + Retail · 1,400 words · BACKING UNCONFIRMED**

**Reader's question:** *"Is a blend a compromise, or is it engineered on
purpose?"*

Secondary terms: PC blend fabric, polyester cotton blend, poly viscose,
recycled polyester, rPET fabric, blended fabric durability, crease recovery.

**This is where PET and PURE yarn fabric belong** — both are real ENZO
offerings, both **wholesale purchasers only**, which makes this a W post with a
retail-facing explainer rather than the reverse. That is genuine backing and the
only confirmed product hook in Cluster A.

What the post cannot yet do is state what ENZO's blends actually are: the
compositions of Bluebird, LoomAura and VP Gold are unknown. **Recycled
polyester** stays as market context only. **Partly blocked on question 1**, and
fully blocked on question 6 (what PET and PURE denote here).

`[NEEDS INPUT: does ENZO offer any recycled-content option, or is rPET here
purely as market context? The framing changes on the answer.]`

---

# Cluster C — Season and occasion

Five posts on three real cycles: wedding season, winter, Eid. No lawn cycle.

**C2 is narrowed and F3/F4 are cut** — ENZO makes no sherwani, coat or jacket
weight, so the wedding cluster now covers what a *guest* wears, not groomwear.

### C1 — The Men's Fabric Calendar: What to Buy When
**NEW · October 2026 · Wholesale + Retail · 1,600 words**

**Reader's question:** *"When should I actually be buying, and why is what I want
never there when I want it?"*

Secondary terms: wedding season fabric, winter fabric season, Eid fabric timing,
fabric buying calendar, suit length timing, tailor lead time.

The organising post for the cluster, and one of the few that serves both
audiences off the same argument: a wholesale reader planning production against
a retail reader trying to beat his tailor's queue. States the thing the market
knows and nobody publishes — wedding fabric is bought in September, not
December, and the tailor's calendar is the real constraint, not the shop's.

Links out to C2–C5, to D2 (buying for your tailor) and to D6 (MOQ).

**Lead times confirmed:** a custom order dispatches in **30 days**; from prior
stock, **next day**. That contrast is the post's spine — it is the difference
between "I want this exact construction" and "I want cloth this week", and it is
the single most useful thing ENZO can tell a wholesale reader about timing.

Stock availability is never quantified: "subject to availability — confirm on
WhatsApp", never a number.

`[NEEDS INPUT: typical tailoring turnaround in peak wedding season, to set the
retail half of the calendar. Question 8.]`

### C2 — Wedding Season Fabric for Men: What Each Event Actually Asks For
**NEW · September 2026 · Retail · 1,500 words**

**Reader's question:** *"I've got three weddings this month and I'm not the
groom. What do I get made?"*

Secondary terms: wedding fabric men, mehndi outfit fabric, barat fabric, walima
shalwar kameez, shaadi season fabric, wedding guest fabric, formal shirting.

**Narrowed to the guest, not the groom.** ENZO makes no sherwani, jamawar, coat
or jacket weight, so the post covers what it can actually dress: shalwar kameez
and shirting for the guest who needs three outfits in a fortnight and a tailor
who is already busy. That is the larger audience anyway — every wedding has one
groom and two hundred guests.

Publishes September, ahead of an October–February season. Structured by event —
mehndi is informal and hot, barat is photographed, walima is the formal one.
Links to F1, D2 and C5.

### C3 — What Actually Keeps You Warm in Winter Suiting
**NEW · September 2026 · Retail · 1,200 words**

**Reader's question:** *"Is a heavier fabric warmer, or is that not how it
works?"*

Secondary terms: winter suiting, wool blend fabric, winter fabric weight, warm
fabric GSM, winter unstitched, khaddar warmth.

Winter backing now rests on **VP Gold**, not Wostar Wool (WW-07), which is not
in the current range — VP Gold has one shade today with more coming for winter.
Corrects the weight-equals-warmth assumption, which links
straight back to `what-is-gsm.html` — the Journal's own opening argument that
GSM and behaviour are different questions. Supporting post under A2.

### C4 — Eid Fabric for Men: Heat, a Deadline, and a Tailor's Queue
**NEW · December 2026 · Retail · 1,300 words**

**Reader's question:** *"Eid is six weeks out, my tailor is already booked, and
it's going to be hot. What do I buy and when do I hand it over?"*

Secondary terms: Eid fabric men, Eid kurta fabric, Eid shalwar kameez, summer
suiting Eid, unstitched Eid, tailor deadline.

Frames the decision as the reader actually experiences it — a queue, a
temperature, a date. Publishes December for a mid-March Eid. Links to D2, F1, F2.

**Eid al-Fitr 2027 falls around 9–10 March**, confirmed locally by moon
sighting nearer the date. The post uses it to set the tailoring countdown but
**never states it as a fixed date** — "around the second week of March", with
the sighting caveat where it matters.

### C5 — The Colours ENZO Actually Stocks, and What They're For
**NEW · January 2027 · Retail · 1,200 words**

**Reader's question:** *"What shade do I pick, and will it look the same at a
wedding as it does in daylight?"*

Secondary terms: charcoal suiting, midnight blue fabric, stone beige, camel,
burgundy, men's suit colour, seasonal shades, colour under photography.

### ⚠ This post is now a different post — and mint, sage and powder blue are gone

You approved keeping mint, sage and powder blue on my evidence that they were
confirmed Bluebird shades. **They were not.** They came from the stale
`data/products.js`, and the real Bluebird eight are:

**Grey · Bright Grey · Pink Grey · Biscuit Grey · Turquoise Grey · Green Grey ·
Blue Grey · Yellow Grey**

Plus LoomAura's **black and navy blue**, plus VP Gold's one current shade. That
is the entire palette: eleven shades, eight of them greys.

So the seasonal-colour post as planned does not exist. There is no pastel range,
no ivory, no burgundy, no rust or olive. **Every colour term in the original
brief is now unplaceable** — see the vocabulary ledger.

**What the post should be instead:** *Why Everything We Weave Is a Grey* — a
post about a deliberately narrow palette, which is a far more interesting piece
than a trend guide and sits exactly on the positioning. Eight greys is a
statement about restraint and about what a man actually wears to work. Turquoise
Grey and Pink Grey are grey with a cast, and explaining that distinction is
genuinely useful to someone choosing cloth in a shop under bad light.

Retitled and rescoped. **Confirm you want it this way before I write it.**

Written as a men's shade guide, not a trend listicle: which shades survive
artificial light, which show sweat, which read formal. The **pastel and Eid
women's palette is out of scope** and does not appear — see the vocabulary
ledger for the specific terms excluded and why.

---

# Cluster D — Buying guides

The cluster that is the whole point. Six new posts and two expansions, every one
of them addressed to a man buying fabric to hand to a tailor — the reader the
existing 54 files never speak to.

### D1 — EXPAND: How Much Fabric You Actually Need
**EXPAND `shalwar-kameez-fabric-quantity.html` · December 2026 · Retail · → 1,700 words**

**Reader's question:** *"How many metres — for a kameez, a kurta, a shalwar,
trousers, a waistcoat — and does my height change it?"*

Secondary terms: fabric quantity shalwar kameez, suit length metres, kurta
fabric quantity, trouser fabric, waistcoat fabric, fabric width consumption.

The brief asked for a quantity guide. **This post already exists** and covers
shalwar kameez only. The expansion adds kurta, shalwar, trousers, shirt and
waistcoat, plus how fabric width changes the answer — which the Journal already
explains for wholesale in `fabric-width-garment-consumption.html`. Publishing a
second quantity post would split one topic across two URLs for nothing.

**Confirmed: a full men's suit — shalwar and kameez together — is 4 metres.**
The existing posts said "4 to 4.5 metres"; that has been corrected in five files
during the correction pass. The expansion builds its table on the 4 m figure.

`[NEEDS INPUT: metreage for kurta, trousers, shirt and waistcoat, and for the
narrower 44–45" width. The quantity post's 44–45" row is currently marked
"confirm" rather than carrying an unverified number. Question 7.]`

### D2 — Buying for Your Tailor: What to Bring, What to Ask, What Goes Wrong
**NEW · November 2026 · Retail · 1,300 words**

**The flagship post of the whole plan.** Nobody publishes this and every
unstitched buyer needs it. It is the clearest statement of the audience shift:
the existing Journal tells a mill how to inspect a 10,000-metre lot; this tells a
man what to say when he puts four metres on a counter.

**Reader's question:** *"I'm handing this to a tailor. What does he need from me
so it comes back right?"*

Secondary terms: fabric for tailor, unstitched to tailor, suit length, lot
matching, shrink allowance, pre-wash fabric, tailor instructions.

Covers lot matching across pieces, shrink allowance, what to say about finish,
and the three things that most often come back wrong. Links to D1, D3, D5 and up
to B1.

### D3 — Why Your Kameez Came Back Shorter: Fabric Shrinkage
**NEW · March 2027 · Retail · 1,200 words**

**Reader's question:** *"It fitted when I collected it and it doesn't now. Whose
fault is that?"*

Secondary terms: fabric shrinkage, pre-shrunk fabric, sanforised, cotton
shrinkage, wash shrinkage, shrink allowance, kameez length.

A specific, high-frustration problem with a real technical answer, and a natural
place to connect the retail reader to finishing — which the Journal currently
only discusses as a wholesale pricing input. Distinct from D7 (softness): this is
dimension, that is hand. Links to D2, D7, `fabric-finishing-and-price.html`.

### D4 — Will It Fade? Reactive vs Pigment Printing
**NEW · November 2026 · Retail · 1,300 words**

**Reader's question:** *"I've had a suit go pale after three washes. How do I
not buy that again?"*

Secondary terms: reactive printing, pigment printing, colourfastness, fabric
fading, wash fastness, dyed vs printed, self-design fastness.

A merge of two briefed topics that answer one question — "will it fade" is the
retail form of "reactive versus pigment", and separating them produces two half
posts. The trade explanation is the answer to the consumer worry. Links to A8
and D7.

### D5 — Stitched vs Unstitched: Which Actually Costs Less
**NEW · January 2027 · Retail · 1,300 words**

**Reader's question:** *"Ready-made is easier. Is unstitched genuinely cheaper,
or is that just what people say?"*

Secondary terms: stitched vs unstitched, ready to wear vs unstitched, unstitched
suit, tailoring cost, fabric by the metre, suit length price.

Runs the arithmetic — fabric plus tailoring against ready-made — instead of
asserting a conclusion. ENZO's retail line is priced from Rs. 400/metre, which
gives one honest side of the sum.

**Written as a formula, no figure needed.** The reader supplies his own tailor's
rate; the post supplies the arithmetic and the fabric side of it. A full suit is
**4 metres**, retail minimum is **4 metres**, and the retail line is priced from
**Rs. 400/metre** — all confirmed and already public — which is enough to make
the sum work end to end.

### D6 — What MOQ Means, and Who Wholesale Is Actually For
**NEW · April 2027 · Wholesale + Retail · 1,500 words**

**Reader's question:** *"I need 300 metres. Am I a wholesale customer or not?"*

Secondary terms: MOQ meaning, minimum order quantity fabric, thaan, wholesale vs
retail fabric, bulk fabric order, fabric roll length.

**Confirmed and usable:** a standard **thaan is 20 metres**; loose fabric thaan
can exceed 100 m. The **wholesale MOQ is 10,000 metres** — a minimum, never a
stock figure, and the two must not be conflated. Retail minimum is **4 metres**.
That ladder is the post: 4 m is a suit, 20 m is a thaan, 10,000 m is a wholesale
order, and most readers sit at the bottom of it.

The qualifying post. It tells most readers they are **not** wholesale buyers and
routes them to `shop.html`. That is the feature, not a failure. 10,000 metres is
a genuinely large number and is better stated plainly than buried. **Thaan** gets
its primary explanation here. **PET and PURE yarn fabric are wholesale-only**,
which gives the post a second concrete reason the wholesale door exists.

**Overlap noted:** `wholesale-fabric-pakistan.html` covers MOQ and lead times for
international B2B buyers. Different reader — that post assumes you already know
you are buying bulk; this one answers whether you are. Cross-link both ways, and
D6 must not restate its lead-time content. Links to `calculator.html`,
`wholesale.html`, `shop.html`.

### D7 — Will It Stay Soft After Washing?
**NEW · March 2027 · Retail · 1,200 words**

**Reader's question:** *"It felt beautiful in the shop and stiff after one wash.
What happened?"*

Secondary terms: fabric softness, finishing, softener finish, fabric after
washing, pilling, hand feel, fabric care.

The retail counterpart to the existing wholesale-facing
`fabric-finishing-and-price.html`. **Overlap noted and deliberate** — same
mechanism, different reader, different question. The two must cross-link and D7
must not repeat the pricing argument. Also links to the existing
`fabric-care.html` and to D3.

### D8 — EXPAND: How to Judge Fabric by Hand
**EXPAND `identify-good-fabric.html` · February 2027 · Retail · → 1,400 words**

**Reader's question:** *"I'm standing at a counter with the cloth in my hand.
What am I checking for?"*

The brief asked for a fabric-quality guide. `identify-good-fabric.html` already
is one — at 611 words it is the Journal's second-longest article and its
strongest existing buying guide. **No new post.** The expansion adds the
counter-side hand test a retail buyer can actually perform: crush and release,
hold to light, edge check, rub test. Currently the post reads as an inspection
checklist for a buyer with a lot in front of him.

---

# Cluster E — Place and market

Two new posts and one expansion. Local intent is at zero — DHA, Gulberg and
Johar Town appear in none of the 54 files.

### E1 — Buying Men's Fabric in Lahore: Where to Go, and What Each Route Costs
**NEW · January 2027 · Retail · 1,600 words**

**Reader's question:** *"Where in Lahore do I actually buy suiting, and is the
market cheaper than going direct?"*

Secondary terms: fabric shops Lahore, Lahore fabric market, Thokar Niaz Baig,
DHA, Gulberg, Johar Town, men's unstitched Lahore, manufacturer direct fabric.

The highest local-intent post in the plan. Honest about the trade-offs between
market, brand outlet and manufacturer-direct — including where ENZO sits, at
ENZO Tower, Thokar Niaz Baig. The retail line is already sold **by appointment**
in Lahore, per `shop.html`, so the mechanism is established.

**Overlap noted:** `lahore-fabric-sourcing.html` exists but is wholesale-facing
MOFU for commercial buyers. Different reader entirely. Cross-link both ways.

**Confirmed: retail at ENZO Tower, Monday to Saturday.**

`[NEEDS INPUT: opening hours, and whether walk-ins are accepted or it is strictly
by appointment. `shop.html` currently says "by appointment" and the post cannot
contradict it without the answer. Question 9.]`

**Retail is in-person only — no shipping.** The post says so plainly rather than
letting a reader outside Lahore find out at the end.

### E2 — EXPAND: Faisalabad, and Why ENZO Produces There
**EXPAND `faisalabad-textile-industry.html` · May 2027 · W+R · → 1,600 words**

**Reader's question:** *"Why is production in Faisalabad and sales in Lahore — is
there a middleman in between?"*

The existing post explains Faisalabad as Pakistan's textile hub in general
terms. The expansion adds the specific and answers the trust question a buyer
actually has: ENZO produces in Faisalabad and sells from ENZO Tower, Thokar Niaz
Baig, Lahore, under Humayun Ibrahim Textile — manufacturer-direct, not a trading
layer. That is exactly the argument `fabric-supplier-vs-trader.html` makes in the
abstract, and this is the post that makes it concrete. A second Faisalabad post
would compete with the first for one topic.

### E3 — ~~Buying From Karachi, Peshawar, or Anywhere That Isn't Lahore~~ — **CUT**

**Retail is in-person only. No shipping.** The post's premise was that a reader
outside Lahore could buy remotely; he cannot. Written honestly it is one
sentence, and written any other way it implies a nationwide retail service that
does not exist.

The footer's "Serving Lahore, Faisalabad, Karachi, Peshawar" is a **wholesale**
statement and must not be borrowed into retail copy. I checked — no existing
page reads it the other way.

If retail shipping ever launches, this becomes worth writing on day one.

---

# Cluster F — Garment categories, men's

Four posts. The brief's garment terms are not one topic each — a man choosing
between a sherwani and a prince coat is making one decision, so it is one post.

### F1 — Shalwar Kameez: Cut and Cloth, and Why They're Linked
**PILLAR · NEW · November 2026 · Retail · 1,700 words**

**Reader's question:** *"Does the cut change what fabric I should buy, or can I
use anything?"*

Secondary terms: men's shalwar kameez fabric, straight kameez, shalwar fabric,
kameez drape, structured vs fluid fabric, suit length, collar and cuff.

The single largest retail category ENZO sells into, and the existing coverage
(`best-fabric-shalwar-kameez.html`, 575 words) treats it as a specification
question. This treats it as a garment question: the cut determines whether you
need cloth that holds structure or cloth that falls — which is the Journal's own
GSM-versus-drape argument applied to something a man wears. Links back to
`what-is-gsm.html`, across to `best-fabric-shalwar-kameez.html`, down to D1.

### F2 — Men's Kurta Fabric
**NEW · February 2027 · Retail · 1,200 words**

**Reader's question:** *"Can I use my kameez fabric for a kurta, or is that a
different thing?"*

Secondary terms: kurta fabric, men's kurta, kurta weight, kurta drape, everyday
kurta, formal kurta, summer kurta fabric.

**Kurta appears in zero of the 54 files.** Distinct from F1 because a kurta is
worn alone and often lighter — weight and opacity carry the whole decision.
Links to A3, A1, F1.

### F3 — ~~Sherwani and Prince Coat Fabric~~ — **CUT**

ENZO weaves **no sherwani, jamawar, coat or jacket weight** — shalwar kameez and
shirting weight only. The post would have attracted a groom and had nothing to
sell him. Cut rather than softened: a wedding post that opens by explaining what
it cannot supply is worse than no post.

Wedding-season intent is now served by **C2**, narrowed to the guest.

### F4 — ~~Blazer and Waistcoat Fabric: The Structured Layer~~ — **CUT**

Same reason — jacketing sits outside ENZO's weight class entirely. This was also
**bouclé**'s only home in the plan, so bouclé leaves with it.

### Not written — already covered
**Suiting** is the Journal's most-covered category: an entire Men's Fabric
cluster of five posts plus the pillar rebuilt in B1. A suiting category post
would compete directly with work that already exists.

---

# The existing 54, placed in this structure

Every published post mapped to a plan cluster with a disposition. **Nothing is
deleted.** Absorbed and merged files keep their URLs as 301 redirects to the
consolidated post.

**KEEP** = unchanged · **KEEP+X** = unchanged, gains cross-links to new posts ·
**ABSORB** = folded into a pillar, redirected · **MERGE** = consolidated,
redirected · **EXPAND** = rewritten at its own URL

| # | Existing post | Old cluster | → Plan | Disposition |
|---|---|---|---|---|
| 1 | what-is-gsm | Terminology | B | KEEP+X — linked from A1, C3, F1 |
| 2 | reed-and-pick | Terminology | B | **MERGE target** (B5) → 1,300 w |
| 3 | warp-vs-weft | Woven | B | KEEP — supporting under B2 |
| 4 | identify-good-fabric | Buying Guides | D | **EXPAND** (D8) → 1,400 w |
| 5 | what-is-greige-fabric | Greige | B | **ABSORB** → B4 |
| 6 | greige-vs-finished-fabric | Greige | B | KEEP — distinct comparison intent |
| 7 | what-is-woven-fabric | Woven | B | **ABSORB** → B2 |
| 8 | how-greige-fabric-is-manufactured | Greige | B | **ABSORB** → B4 |
| 9 | mens-unstitched-fabric-guide | Men's | B | **ABSORB** → B1 |
| 10 | best-fabric-shalwar-kameez | Men's | F | KEEP+X — supporting under F1 |
| 11 | shalwar-kameez-fabric-quantity | Retail Ed. | D | **EXPAND** (D1) → 1,700 w |
| 12 | summer-vs-winter-fabric-men | Men's | C | KEEP+X — supporting under C3 |
| 13 | how-fabric-is-priced | Costing | B | KEEP — supporting under B3 |
| 14 | why-fabric-prices-differ | Costing | B | KEEP — supporting under B3 |
| 15 | fabric-quality-vs-price | Value | B | **MERGE** → B6 |
| 16 | gsm-width-fabric-cost | Costing | B | KEEP — supporting under B3 |
| 17 | what-is-yarn-count | Yarn | B | KEEP+X — linked from A5 |
| 18 | ring-spun-vs-polyester-yarn | Yarn | B | KEEP+X — linked from A9 |
| 19 | ends-per-inch-picks-per-inch | Woven | B | **MERGE** → B5 |
| 20 | yarn-count-fabric-weight | Yarn | B | KEEP |
| 21 | fabric-inspection-checklist | QC | B | KEEP — *see supplier-pillar flag* |
| 22 | greige-fabric-defects | QC | B | KEEP — supporting under B4 |
| 23 | width-gsm-variation | QC | B | KEEP |
| 24 | inspect-fabric-before-bulk-order | QC | B | KEEP — *see supplier-pillar flag* |
| 25 | buying-fabric-from-pakistan | Sourcing | E | KEEP |
| 26 | faisalabad-textile-industry | Sourcing | E | **EXPAND** (E2) → 1,600 w |
| 27 | lahore-fabric-sourcing | Sourcing | E | KEEP+X — cross-link E1 |
| 28 | evaluate-pakistani-fabric-supplier | Supplier | E | KEEP — *see supplier-pillar flag* |
| 29 | fabric-consumption-and-yield | Garment Mfg | B | KEEP |
| 30 | fabric-width-garment-consumption | Garment Mfg | B | KEEP+X — linked from D1 |
| 31 | reducing-fabric-wastage | Garment Mfg | B | KEEP |
| 32 | choosing-fabric-garment-manufacturing | Garment Mfg | B | KEEP |
| 33 | fabric-supplier-vs-trader | Supplier | E | KEEP+X — linked from E2 |
| 34 | questions-before-bulk-fabric-order | Supplier | B | KEEP — *see supplier-pillar flag* |
| 35 | choose-fabric-supplier | Supplier | B | KEEP — *see supplier-pillar flag* |
| 36 | wholesale-greige-fabric | Greige | B | KEEP — BOFU, supporting under B4 |
| 37 | fabric-for-everyday-wear | Retail Ed. | D | KEEP+X — cross-link A3, F2 |
| 38 | fabric-for-formal-wear | Retail Ed. | C | KEEP+X — cross-link C2, F3, F4 |
| 39 | fabric-for-uniforms | Applications | D | KEEP |
| 40 | buying-mens-fabric-by-the-metre | Men's | B | **ABSORB** → B1 |
| 41 | avoid-overpaying-for-fabric | Value | B | **MERGE** → B6 |
| 42 | fabric-finishing-and-price | Value | B | KEEP+X — cross-link D3, D7 |
| 43 | how-to-compare-fabrics | Buying Guides | D | KEEP+X — cross-link D8 |
| 44 | what-makes-fabric-worth-its-price | Value | B | **MERGE target** (B6) → 1,600 w |
| 45 | fabric-sourcing-pakistan-international | Sourcing | E | KEEP |
| 46 | wholesale-fabric-pakistan | Sourcing | E | KEEP+X — cross-link D6 |
| 47 | bulk-fabric-supplier-evaluation | Garment Mfg | B | KEEP — *see supplier-pillar flag* |
| 48 | yarn-specs-before-bulk-order | Yarn | B | KEEP |
| 49 | complete-guide-greige-fabric | Greige | B | **EXPAND to PILLAR** (B4) → 2,600 w |
| 50 | complete-guide-woven-fabric | Woven | B | **EXPAND to PILLAR** (B2) → 2,600 w |
| 51 | complete-guide-fabric-costing | Costing | B | **EXPAND to PILLAR** (B3) → 2,800 w |
| 52 | complete-guide-mens-fabric-buying | Men's | B | **EXPAND to PILLAR** (B1) → 2,600 w |
| 53 | dressing-lahore-summers | Retail Ed. | C | KEEP+X — cross-link C1, E1 |
| 54 | fabric-care | Applications | D | KEEP+X — cross-link D7, D3 |

## Overlaps flagged — update, don't compete

Five proposed topics collided with published posts. All five became expansions
or cross-links rather than new URLs:

| Proposed topic | Collides with | Resolution |
|---|---|---|
| Fabric quantity per garment | `shalwar-kameez-fabric-quantity` | **EXPAND** it (D1) |
| Judging fabric quality | `identify-good-fabric` | **EXPAND** it (D8) |
| Why ENZO produces in Faisalabad | `faisalabad-textile-industry` | **EXPAND** it (E2) |
| Suiting as a category post | Men's Fabric cluster, 5 posts + B1 | **Not written** |
| Softness after washing | `fabric-finishing-and-price` | **Both kept** — same mechanism, wholesale vs retail reader, must cross-link (D7) |

Two proposed topics also collide with each other and were merged before writing:
"will it fade" + "reactive vs pigment" → **D4**; "sherwani fabric" + "prince coat
fabric" → **F3**.

## Pillars after this plan

| Pillar | Cluster | Status | Words |
|---|---|---|---|
| Complete Guide to Buying Men's Fabric | B / retail hub | EXPAND | 2,600 |
| Complete Guide to Fabric Costing | B / wholesale hub | EXPAND | 2,800 |
| Complete Guide to Woven Fabric | B | EXPAND | 2,600 |
| Complete Guide to Greige Fabric | B | EXPAND | 2,600 |
| Boski, Wash-and-Wear and Poly-Viscose | A | NEW | 2,200 |
| Shalwar Kameez: Cut and Cloth | F | NEW | 1,700 |

Everything else is a supporting post. The two retail pillars — B1 and A1 — are
the ones the whole Phase 1 programme links up to; every new Cluster A, C, D and
F post should point at one of them.

---

# Vocabulary ledger

## Placed

| Term | Home |
|---|---|
| latha, cambric | A3 |
| boski, wash-and-wear, poly-viscose | A1, B1 |
| khaddar, karandi | A2 |
| shirting | A4 |
| suiting | A1, B1, C3 + existing Men's cluster |
| cotton, supima, combed/carded, staple, Ne count | A5 |
| cotton slub, linen | A6 |
| viscose, modal, lyocell | A7 |
| jacquard, self-design, dobby | A8 |
| PC blend, recycled polyester | A9 |
| shalwar kameez, straight kameez, shalwar | F1 |
| kurta | F2 |
| thread count, EPI, PPI, reed | B5 |
| percale, sateen | B2 — **as weave structure only**, not as bedding |
| warp, weft | existing `warp-vs-weft`, linked from B2 |
| GSM | existing `what-is-gsm`, linked from A1, C3, F1 |
| greige, thaan | B4 (thaan primary home: D6) |
| reactive vs pigment printing | D4 |
| finishing | D7 + existing `fabric-finishing-and-price` |
| fabric costing, why cotton varies in price | B3, A5 |
| Eid | C4 |
| wedding, mehndi, barat, walima | C2 |
| winter suiting | C3 |
| Grey, Bright Grey, Pink Grey, Biscuit Grey, Turquoise Grey, Green Grey, Blue Grey, Yellow Grey, black, navy blue | C5 — the entire real palette |
| PET, PURE yarn fabric | A9, D6 — wholesale only |
| thaan (20 m) | D6, B4 |
| Lahore, Thokar Niaz Baig, DHA, Gulberg, Johar Town | E1 |
| Faisalabad | E2 |
| MOQ | D6 |

## Left out, and why

**Out of scope by instruction — ENZO does not deal in these:**

lawn · chiffon · organza · net · dupatta · angrakha · two-piece · women's
unstitched · the pastel and Eid women's palette. Removed entirely.

**Out of the weight class — shalwar kameez and shirting only:**

- **sherwani, jamawar, prince coat, blazer, waistcoat** — no coat or jacket
  weight is made. F3 and F4 cut.
- **bouclé** — a jacketing texture. It had exactly one home and that post is
  gone, so bouclé is now genuinely unplaceable. Left out.

**Not woven by ENZO, so education-only or dropped:**

- **latha, khaddar, karandi, cambric** — kept as education-only posts (A2, A3).
  They are what a man is choosing *between* when he walks in, so explaining them
  earns the reader even with nothing to sell against them.
- **linen, jacquard, modal, lyocell** — kept for now in A6, A7, A8, but these
  are the three posts I recommend cutting on positioning grounds.
- **dhanak, cotton voile, canvas** — women's wear or home textile. No home.

**The entire colour vocabulary is now unplaceable.**

This is the biggest change from the previous version. ENZO's real palette is
**eight greys, black, navy blue, and one VP Gold shade.** Every colour term in
the original brief — mint, sage green, powder blue, periwinkle, lavender, lilac,
olive, rust, stone beige, powder pink, deep blue, ivory, charcoal, maroon — has
**no matching ENZO shade**.

I previously reported mint, sage and powder blue as confirmed stock and you
approved keeping them on that basis. That was wrong: they came from the stale
data file. They are out along with the rest.

C5 is rescoped from a seasonal-colour guide to a post about why the palette is
deliberately narrow — which is a better post and actually true.

**Forced nowhere.** No post exists to host a term. Where a briefed term had no
honest home it is in this list, not wedged into a paragraph.

---

# NEEDS INPUT register

**The count moved from eleven to thirteen live, plus two withdrawn.** Two of
the original eleven asked for figures the publication rule now excludes and are
withdrawn — no answer wanted. The range statement replaced one question with
five, because reconciling Bluebird / LoomAura / VP Gold against the catalog data
raises more than "which fabrics do you stock".

Nothing here blocks Phase 0.

| # | Needed | Blocks | Status |
|---|---|---|---|
| 1 | **Composition and construction of LoomAura and VP Gold.** Are either boski, wash-and-wear, or a viscose/poly blend? | A1, A7, A9, C3, F4 | **Live — answer first.** Governs five posts and the whole product-backed / education-only split |
| 2 | **Which eight shades is Bluebird now?** The stale data carries sixteen across a summer/winter split that no longer exists | C5 | Live. Mint, sage and powder blue confirmed in; the other five unknown |
| 3 | **Are 200 m / 1,000 m / 990 m stock on hand, or purchasable minimums?** The site states a 10,000 m MOQ in six places | D6 | Live. If they are minimums, six live pages are wrong |
| 4 | **Are Signature / Reserve / Select tiers live, planned, or retired?** They appear nowhere on the site | C5, catalog copy | Live |
| 5 | **Sources for Noor and Waqar.** They currently source from Nova Silk and Wostar Wool, both out of range | A1, product pages | Live. Two of four retail codes have no stated source |
| 6 | **Eid al-Fitr 2027 date**, locally confirmed | C4 | Live. Sets the Phase 1 publish window |
| 7 | **Standard thaan length; quoted per thaan or per metre** | B4, D6 | Live. Length and unit only — no rate |
| 8 | **Production lead time, order → dispatch; tailoring turnaround in peak season** | C1 | Live. The post's whole argument rests on these |
| 9 | **ENZO's recommended metreage per garment and height band.** The existing post carries figures — confirm they are correct before I build on them | D1 | Live |
| 10 | **How a retail appointment at ENZO Tower is booked** — days, hours, walk-in policy. `shop.html` says "by appointment" but not how | E1 | Live |
| 11 | **Retail shipping nationwide? Delivery cost? Swatches before purchase?** | E3 | Live. Delivery charge is a customer-facing price, not a cost disclosure |
| 12 | **Any recycled-content option?** Or is rPET market context only? | A9 | Live. Framing changes on the answer |
| 13 | **Does ENZO supply sherwani-weight or jamawar-type cloth?** | F3 | Live. If not, F3 is education-only with an honest close |

**Withdrawn under the publication rule — no answer wanted:**

| — | Was | Now |
|---|---|---|
| ~~Conversion cost per metre~~ | B3 costing pillar | **NOT FOR PUBLICATION.** B3 teaches the cost *model* and the reader supplies his own rates, exactly as `calculator.html` already does |
| ~~Lahore tailoring cost~~ | D5 stitched vs unstitched | **Written as a formula.** The reader fills in his own tailor's rate. No figure published, nothing waiting |

Also resolved without asking: **retail minimum is 4 metres**, stated on all four
product pages. D5 and D6 can use it.

**Answer 1, 2 and 3 and most of the plan unblocks.**

# What Stage 2 will need

Nothing in this plan requires replacing the Journal. The structural work is:

- **A 15th–20th cluster or two.** New clusters needed: *Men's Fabric Education*,
  *Season & Occasion*, *Garment Categories*. Adding one is a `<button>` in
  `.cluster-nav` and a `data-cluster` value — the filter JS already handles it.
- **Post template + markdown pipeline.** 54 files currently duplicate ~120 lines
  of boilerplate each. Worth building before writing 26 more.
- **`datePublished` in the generator**, so Phase 0's fix does not regress.
- **A redirect mechanism** for the six absorbed/merged URLs. This is the one
  genuinely new capability the plan requires and it does not exist today.
- **Index rows generated, not hand-written**, so title, excerpt, date, cluster
  and keywords stop living in two places.

Everything else — `.article-body`, `.article-callout`, `.data-table`,
`.faq-item`, `.post-row`, `.kw-chip`, `.stage`, the cluster filter, per-post OG
and Twitter tags, the WhatsApp CTA, the mobile shell — already exists and works.
