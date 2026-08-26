# ENZO — Data Needed

Everything blocking the Fabric Journal work, in one place. Fill in the answer
lines and hand the file back. **Leave anything you can't confirm blank** — a
blank stays flagged; a guess ships to a live page.

Nothing on the live site changes until this comes back.

Compiled 2026-08-27 against a full sweep of every specification figure on the
site. Line references are exact.

---

## How to fill this in

Type your answer on the `ANSWER:` line under each question. Free text is fine —
"70/30 viscose poly", "same as before", "don't know yet" are all useful. If a
question doesn't make sense, say so on the line and I'll rework it.

The **Priority** column says what unblocks when that answer lands.

---

# SECTION A — The three weaving qualities

Blocks: the whole of Cluster A, the catalog data file, and the catalog page.

### A1. Fibre composition of each quality

The range statement gave constructions but not fibre content. Without this, no
post can say whether ENZO weaves a boski, a wash-and-wear, a blend or a pure —
and that decides whether the Cluster A pillar survives at all.

```
Bluebird   ANSWER: ______________________________________________
LoomAura   ANSWER: ______________________________________________
VP Gold    ANSWER: ______________________________________________
```

**Priority: highest.** Blocks 2 planned posts and the pillar structure.

### A2. Bluebird's construction spec

LoomAura is 64×64 / 26×26 and VP Gold is 56×52 / 20×20. Bluebird has no spec on
record — the field in `data/products.js` is blank.

```
Bluebird construction   ANSWER: _____________________________________
```

### A3. Article codes

Bluebird is BB-04. The other two have none on record, so the catalog card falls
back to showing the quality name and the contact deep-link omits the article
parameter. It degrades cleanly, but both are placeholders.

```
LoomAura article code   ANSWER: _____________________________________
VP Gold article code    ANSWER: _____________________________________
```

### A4. VP Gold's current shade name

One shade exists today, unnamed in the data. More are in production for winter.

```
VP Gold current shade   ANSWER: _____________________________________
```

### A5. What do PET and PURE denote?

You listed **PET and PURE yarn fabric, wholesale purchasers only.** I don't know
whether these are fibre types, yarn types, or separate product lines — and the
post that covers them can't be written either way round without it.

```
PET is a ______________________________________________________
PURE is a _____________________________________________________
Sold as part of the three qualities, or separately?  ANSWER: __________
```

**Priority: high.** Blocks 1 planned post.

---

# SECTION B — The four retail codes

Blocks: 4 product pages, the shop grid, and **10 published journal posts**.

## The problem, in one line

All four retail codes had their specs recorded against wholesale qualities that
are now discontinued. Their shade lists are **verbatim copies** of those
qualities' shade lists — identical names, identical counts. So the numbers
beside them were most likely copied the same way.

| Retail code | Was recorded against | Shade list matches it |
|---|---|---|
| Safa (RQ-S1) | Bluebird — Summer | 8 for 8, exactly |
| Noor (RQ-S2) | Nova Silk | 1 for 1, exactly |
| Waqar (RQ-W3) | Wostar Wool | 8 for 8, exactly |
| Daim (RQ-A4) | Bluebird — Winter | 8 for 8, exactly |

**Prices are not in question** — Rs. 400 / 500 / 400 / 400 are ENZO's own retail
figures, not inherited. They stay as they are.

## B1. Waqar's composition — the urgent one

Waqar is described on live pages as a **"Wool Blend"** and a **"poly-wool
worsted"**. But the current range contains no wool quality: Bluebird and
LoomAura are four-season, VP Gold is winter, and none is stated as wool.

Either Waqar is woven from something outside the three qualities, or the wool
description is inherited from Wostar Wool and wrong.

**This claim is live in ten places** — `product-waqar.html` lines 8, 15, 20, 34,
84, 111 and 121, plus `journal/best-fabric-shalwar-kameez.html:106` and
`journal/summer-vs-winter-fabric-men.html:103`.

```
Is Waqar wool at all?          ANSWER: _______________________________
If not, real composition:      ANSWER: _______________________________
```

**Priority: highest in this section.**

## B2. Specifications for all four

```
         COMPOSITION                    WEIGHT (GSM)   SETT
Safa     ____________________________   ___________    ______________
Noor     ____________________________   ___________    ______________
Waqar    ____________________________   ___________    ______________
Daim     ____________________________   ___________    ______________
```

Current values, for reference — treat all as unverified:

| Code | Composition on file | GSM | Sett |
|---|---|---|---|
| Safa | 20% Viscose / 80% Polyester | 150 | 108 × 76 |
| Noor | 70% Viscose / 30% Polyester | 166 | 128 × 84 |
| Waqar | Wool Blend, Winter Weight | 247 | 96 × 72 |
| Daim | 20% Viscose / 80% Polyester | 192 | 124 × 88 |

Noor also carries a **"boski construction"** claim at
`journal/what-makes-fabric-worth-its-price.html:105` — boski was Nova Silk's
construction. Confirm or drop:

```
Is Noor a boski?   ANSWER: ___________________________________________
```

## B3. The shade model — one question, two very different fixes

I can prove the shade lists were **copied**. I cannot prove they are **wrong** —
those are different things, and which one it is decides what gets edited.

`shop.html:73` currently tells customers the four codes are *"drawn from ENZO's
own live shade range… every option maps to something real on the shelf."*

**Tick one:**

```
[ ]  A — Retail pieces are finished from the cloth we weave, so their shades
         must come from the current range. The 25 shade names are wrong.
         → I replace the shade lists. shop.html:73 stays as written.

         Real shades:
           Safa   ANSWER: ________________________________________
           Noor   ANSWER: ________________________________________
           Waqar  ANSWER: ________________________________________
           Daim   ANSWER: ________________________________________

[ ]  B — We finish retail pieces in shades we don't offer wholesale.
         The shade names are fine; they were just filed under the wrong parent.
         → Shade lists stay. I rewrite shop.html:73 so it stops claiming the
           codes come from the weaving range.

[ ]  C — Something else. ANSWER: ______________________________________
```

## B4. Season and drape

Descriptive rather than measured, but recorded at the same time as the rest.

| Code | Season on file | Drape on file |
|---|---|---|
| Safa | Spring / Summer | Standing |
| Noor | Summer / Mid-Season | Fluid |
| Waqar | Autumn / Winter | Structural |
| Daim | All-Season | Neutral |

```
Correct as they stand?   ANSWER: _____________________________________
If not, corrections:     ANSWER: _____________________________________
```

---

# SECTION C — Metreage

Blocks: one planned post (the fabric-quantity guide).

**Confirmed already:** a full men's suit — shalwar and kameez — is **4 metres**.
That correction has been applied across five published posts.

Still needed, for the same standard width:

```
Kurta        ANSWER: ____________
Trousers     ANSWER: ____________
Shirt        ANSWER: ____________
Waistcoat    ANSWER: ____________

What width do these assume?   ANSWER: ____________
And at the narrower 44–45"?   ANSWER: ____________
```

The 44–45" row in the quantity post is currently marked "confirm" rather than
carrying an unverified number.

---

# SECTION D — Retail operations

Blocks: one planned post (buying fabric in Lahore).

**Confirmed already:** retail at ENZO Tower, **Monday to Saturday**. Retail is
**in-person only, no shipping**. Retail minimum is **4 metres**.

```
Opening hours              ANSWER: ___________________________________
Walk-ins, or appointment only?   ANSWER: _____________________________
If appointment — how is one booked?   ANSWER: ________________________
```

`shop.html` currently says "by appointment" and no post can contradict it until
this is settled.

---

# SECTION E — Not blocking, but noted

```
Product photography for LoomAura and VP Gold
    Status: not available. Posts are being written so none depends on an image.
    Catalog cards fall back to a name card. No action needed from you.

Colour hex values for the eleven shades
    Status: skipped by your instruction. Swatches render shade names as text
    instead of eleven identical grey chips. No action needed.
```

---

# APPENDIX — What changes when each answer lands

So you can see the blast radius before deciding.

| Answer | Files touched | Notable |
|---|---|---|
| **Waqar composition** | 9 locations across `product-waqar.html` (7) and 2 journal posts | The wool claim is in published editorial prose, not just a data field |
| **Safa GSM** | 8 locations | Named in `dressing-lahore-summers`, `best-fabric-shalwar-kameez`, `what-makes-fabric-worth-its-price`, `what-is-gsm` |
| **Safa sett (108 × 76)** | **9 locations** | ⚠ This is the site's standard worked example for fabric density. It appears in `reed-and-pick` (×2), `ends-per-inch-picks-per-inch` (×2), `complete-guide-woven-fabric`, `how-greige-fabric-is-manufactured`, plus the journal index excerpt. Changing it edits the density teaching across six posts |
| **Noor GSM** | 7 locations, incl. `fabric-for-formal-wear:90` | |
| **Waqar GSM** | 7 locations, incl. `summer-vs-winter-fabric-men:103` | |
| **Daim GSM** | 8 locations, incl. `fabric-for-everyday-wear:94` and `width-gsm-variation:93` | ⚠ `width-gsm-variation:93` uses 192 GSM in a worked tolerance calculation — the arithmetic has to be recomputed, not just the number swapped |
| **Shade model A** | `data/retail-products.js`, shop grid, 4 product pages | |
| **Shade model B** | `shop.html:73` only | Much smaller change |
| **Fibre compositions (A1)** | `data/products.js`, catalog page, and unblocks 2 posts | |
| **PET / PURE (A5)** | Unblocks 1 post | |
| **Metreage (C)** | 1 post + the quantity post's table | |
| **Retail hours (D)** | 1 post | |

## Journal posts affected by the retail specs — all ten

`best-fabric-shalwar-kameez` · `dressing-lahore-summers` · `what-is-gsm` ·
`what-makes-fabric-worth-its-price` · `width-gsm-variation` ·
`fabric-for-everyday-wear` · `fabric-for-formal-wear` ·
`summer-vs-winter-fabric-men` · `reed-and-pick` ·
`ends-per-inch-picks-per-inch`

Plus `complete-guide-woven-fabric` and `how-greige-fabric-is-manufactured` if
Safa's sett changes, and the `journal.html` index excerpt.

**This is four more posts than I reported earlier.** The sweep that produced
this file found `fabric-for-everyday-wear:94`, `fabric-for-formal-wear:90` and
`summer-vs-winter-fabric-men:103` and `:106` naming codes with their specs —
none of which were in the six-post list I gave you. The list above is the
complete one.
