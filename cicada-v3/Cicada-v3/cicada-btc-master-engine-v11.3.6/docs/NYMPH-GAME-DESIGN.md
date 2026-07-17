# Nymph Mode: Gamified Growth Season — Design Plan

Status: DRAFT v2 (2026-07-16) — reconciled with `cicada-collection-mechanics.md`
and `emirp-generations.md` (the emirp supply lattice + lineage routes).
Scope: cicada-btc-master-engine (scene/renderer/traits) + xtrata-2.0 (wallet, relayer, on-chain claims)

**Where this doc sits:** the companion docs define the macro game — emirp
supply milestones (13 → … → 3301), lineage routes (Rapid Ascension 5-step /
Deep Lineage 7-step), breeding, mirrored traits, and the distributed cipher.
THIS doc defines the **moment-to-moment interaction layer**: what a holder
actually does with a nymph between emergence events, and how that play
produces the "generational value" the emirp layer consumes.

**Canon note:** Genesis brood = **13** nymphs (mirror 31). The mechanics doc
contains two stale references to "31 Genesis nymphs" (§4) from an earlier
draft — 13 is correct; both emirp routes begin at 13.

## 1. Concept

The nymph stage becomes a multi-week **growth season** between mint and reveal.
Every holder's nymph starts visually identical (already true today — the scene
uses one shared character design). Over the season each nymph grows through
staged instars on a block-height clock, digging autonomously through its
underground world. Holders can simply let it grow — idle nymphs still emerge as
full adults — or engage with it: while digging, a nymph periodically
**discovers finds** (food, minerals, cipher shards). Each find offers a
one-time, wallet-signed on-chain claim. Claimed finds are written to an
on-chain **journal** for that token and become traits and rarity weight when
the cicada finally moults and emerges. Journals carry into the next brood
(generational inheritance).

Design pillars:

1. **Idle-safe.** Zero interaction still produces a complete, good-looking
   adult. Interaction shifts probability, never gates the outcome.
2. **Deterministic & verifiable.** Finds and final traits derive from
   seed + block hashes + the on-chain journal. Anyone can recompute a
   cicada's rarity from chain data; the client is presentation only.
3. **One-time moments.** Each find is claimable exactly once; missed windows
   expire. Scarcity of moments, not grinding, drives engagement.
4. **On-brand.** Block heights are the biological clock; 5 instars mirror real
   cicada biology; find types lean into the 3301/prime/cipher mythology the
   trait registry already carries (cipher-glyphs, prime-ticks, 3301-beacon…).

## 2. Life-cycle stages

Real cicada biology maps cleanly onto the mechanic:

| Stage | Visual | Duration (illustrative) | Notes |
|---|---|---|---|
| 0. Egg | egg nested in a twig/root nick above the surface band | ~1 day of blocks | purchase → egg appears; hatch is first shared moment |
| 1. Instar I | tiny pale larva drops from twig, burrows down | ~3 days | smallest sprite, fastest fidget |
| 2. Instar II–IV | current nymph model at growing scale | ~4–6 days each | each transition is a **mini-molt** (reuse molt staging), leaves a small exuvia in the tunnel |
| 3. Instar V (final) | full-size nymph, wing pads pronounced | last week | teneral colours begin to hint through |
| 4. Emergence | existing `_emerge` flow: climb, trunk, ecdysis, flight | one ceremony | rarity resolution happens here |

Stage advancement is a pure function of `(mintBlock, currentBlock, tokenSeed)`
— no server, no timers to trust. Per-token jitter (± a few hundred blocks,
seeded) staggers the brood so the gallery doesn't moult in lock-step.

Engine hooks that already exist and get reused:

- `CicadaNymphGenerator` molt machinery: `beginMolt()`, `setMoltStage()`,
  `setTeneralColors()`, `toExuvia()` — built for the final ecdysis, reusable
  for intermediate instar molts at smaller intensity.
- `FINISH_TIER_SCALE` (fidget/wander per rarity tier) — becomes per-instar
  vitality scaling too.
- `NYMPH_PALETTES` (4 palettes, currently only [0] used) — map to instars so
  the cuticle visibly darkens/hardens as the nymph ages.
- `NymphScene` route/walk system (`walkTo`, tunnel polylines, disturb marks) —
  the find encounter system rides on `onStep` and route waypoints.
- `nymph-scene.js:340` — the `budgetMs` TEMP-TEST timer is replaced by the
  block-clock stage model.

## 3. The find system (core game loop)

### 3.1 Generation (deterministic)

At each **epoch** (e.g. every 144 Bitcoin blocks ≈ daily), a token's find
schedule for that epoch derives from:

```
findSeed = sha256(tokenId || epochStartBlockHash || genesisSeed)
```

This yields 0–N finds for the epoch, each with: type, tunnel position,
appearance window (block range), and claim window (e.g. 24–48h of blocks after
discovery). The client renders them; the contract (or relayer attestation)
validates any claim against the same derivation. Nothing the client says is
trusted.

### 3.2 Find types (thematic, tied to existing trait registry)

| Find | Buried as | On claim → journal effect |
|---|---|---|
| **Root sap** (food) | glowing root nodule | +growth vitality; feeds `size`/finish tier at reveal |
| **Mineral vein** | glinting stone seam | weights `thoraxSkin`/`abdomenSkin` material rolls (magma, iridescent, porcelain…) |
| **Cipher shard** | faint glyph in the soil | weights `markingLayer` (cipher-glyphs, prime-ticks, hash-fragments) |
| **Prime residue** | pulsing dot cluster | weights `motionField`/`primeSet` (ulam-spiral, 3301-beacon…) |
| **Old exuvia** (rare) | translucent shell fragment | generational echo — pulls one weighted trait from a prior brood |
| **Tymbal resonance** (very rare) | humming spot near a root | weights experimental `tymbalLayer` / sound-identity flourishes |

Claimed finds also apply an **immediate visible change** to the nymph (a glyph
mark on the cuticle, eye tint shift, extra sheen) so interaction is legible in
the gallery right away — traits aren't only a reveal-day payoff.

### 3.3 Encounter & claim flow

1. Nymph wanders its tunnel (existing route system). When its route passes
   within range of an active find, it pauses, digs (disturb marks burst), and
   the find glows.
2. UI chip appears on the panel: **"Your nymph found a mineral vein — make it
   official"** with a claim countdown in blocks.
3. Player connects wallet (if not already) and signs. The claim goes through
   the **sponsored relayer** in xtrata-2.0 (same pattern as drops claims:
   policy check → D1 reservation → sponsored broadcast), so claims are
   gas-free for holders.
4. Contract records `(tokenId, epochId, findId) → claimed` — once, ever.
   The chip flips to "Sealed ✓" and the trait mark renders on the nymph.
5. Unclaimed finds expire at window end. Optionally they decay into a tiny
   ambient vitality trickle so idle holders aren't punished, just less lucky.

### 3.4 Manual play mode (optional layer)

"Take the controls": tap/hold or arrow keys steer the nymph along tunnel
polylines (the walk API already supports scripted targets). Manual digging
raises the **encounter rate** — you sweep more of the map before windows
close — but does not mint extra finds. Idle and active players draw from the
same deterministic pool; active play just surfaces more of it in time. This
keeps it fair, keeps it fun, and means no play-to-win treadmill.

## 4. On-chain design (Stacks)

New Clarity contract, working name `cicada-nymph-journal`:

- `claim-find(token-id, epoch-id, find-id, proof)` — validates the find is in
  the token's deterministic schedule and inside its window, asserts
  `tx-sender` owns the token, asserts not already claimed. Emits an event.
- `get-journal(token-id)` — accumulated claims; read by the reveal derivation
  and by the gallery for vitals display.
- `seal-emergence(token-id)` — callable once the final instar completes;
  freezes the journal and emits the emergence event the reveal listens for.
- Rarity resolution at reveal: `finalTraits = f(seed, journal, revealBlockHash)`
  — journal entries are *weights* into the existing trait tables in
  `cicada-traits.js`, with caps and diminishing returns per find type so a
  hyperactive wallet can't brute-force a mythic.

Infrastructure reuse from xtrata-2.0:

- Sponsored claim relayer (`functions/sponsor/[[path]].ts`) — the drops policy
  system (one-per-wallet, D1 reservations, event-backed history) is almost
  exactly the shape needed; add a `nymph-find` policy family.
- Event-backed history (`src/lib/drops/history.ts` pattern) — powers the
  per-nymph journal timeline in the UI.
- Wallet connect + ownership refresh flows already hardened (see recent
  ownership-recovery commits).

Fairness caps (tune in balancing pass):

- Max journal score per epoch (so a whale of attention can't stack a day).
- Diminishing returns per find type (2nd mineral vein worth less than 1st).
- Floor guarantee: unclaimed/idle tokens still roll from the full base tables.

## 5. Gallery & UI

- **Colony view** (existing NymphScene): all nymphs identical at a glance, each
  moving independently — exactly as today. Hover/tap a nymph → vitals card:
  - instar stage + progress bar (blocks until next molt)
  - size / vitality
  - claimed finds as small icons (= provisional trait marks)
  - journal timeline (from chain events)
- **My nymph view**: single-actor scene (count=1) with the find chips, claim
  buttons, manual-control toggle, and molt-ceremony camera moments.
- Molts and emergences are **appointments**: the vitals card shows the block
  ETA, so holders can show up to watch — and finds could cluster slightly
  around molt windows to make showing up worth it.

## 6. Phased build plan

**Phase 1 — Growth state machine (engine only, no chain)**
`nymph-growth.js`: pure module mapping `(mintBlock, nowBlock, seed)` →
`{ stage, sizeScale, palette, vitality }`. Wire into `NymphScene` actor spawn
(size, palette index, fidget scale) and replace the TEMP-TEST `budgetMs` with
stage-driven emergence. Add egg + instar-I sprites to the nymph renderer.
Mini-molt transition reusing molt staging. Vitals overlay (static data).
*Everything testable with a mocked block height.*

**Phase 2 — Find engine (client-side, deterministic)**
`nymph-finds.js`: epoch schedule derivation (sha256, mirrors future contract
logic exactly). Scene rendering of buried finds + encounter pause/dig
behaviour + glow. Claim chip UI with expiry countdown; claims stored locally
(stub for chain). Balancing harness: simulate a season, chart journal-score
distributions idle vs active.

**Phase 3 — On-chain journal**
Clarity contract (`claim-find`, `get-journal`, `seal-emergence`) + clarinet
tests. Relayer route in xtrata-2.0 following the drops policy/reservation
pattern. Wallet flow: connect → sign → sponsored broadcast → chip seals.
Gallery vitals read journal from chain events.

**Phase 4 — Manual play**
Direct-control mode (pointer/keys → `walkTo` targets constrained to tunnel
polylines), dig action, encounter-rate boost, mobile touch pass,
reduced-motion fallback (finds appear as static markers with the same claim
windows).

**Phase 5 — Emergence & rarity resolution**
`f(seed, journal, revealBlockHash)` trait derivation feeding the existing
`generateInstructionsFromSeed` override path. Emergence ceremony: journal
recap → ecdysis (existing staged molt, teneral palette already previews the
true adult) → reveal. Metadata pipeline update.

**Phase 6 — Generations**
Journal echo into next brood: parent's sealed journal contributes weighted
inheritance to offspring seeds; "old exuvia" finds surface ancestor traits.
See §7 for how the nymph game feeds the emirp generational system.

## 7. Plugging into the emirp system (supply, lineage, generations)

The companion docs give the macro structure; the nymph game is its engine
room. The join works like this:

```
find claims (§3)  →  journal score  →  generational value (emirp doc §19)
nymph season      →  quiet period between mint events (mechanics doc §4)
emergence event   →  mint event: lineage power converts to offspring slots
adult seed draw   →  genome bank placement (§7.2 below)
```

### 7.1 Journal score IS generational value

The emirp doc (§19) needs each lineage to accumulate a "generational value"
toward its next emirp target (37 or 31, then onward to 3301) built from
population, diversity, stored energy, lineage value. The nymph find system
supplies exactly this, concretely and on-chain:

- **Root sap** → stored energy;
- **Mineral veins** → environmental adaptation;
- **Cipher shards / prime residue** → collective intelligence;
- **Old exuvia** → lineage depth;
- **Tymbal resonance** → the sound/coordination axis (feeds the 389
  Resonant Brood mechanics on the Deep Lineage route).

So "reach the 37 Generation" stops being abstract: a lineage's nymphs must
collectively claim enough of the right finds before the emergence event. The
emirp target is the *colony's* bar; the nymph journal is the *individual's*
contribution to it. Idle nymphs still contribute a base trickle — the
idle-safe pillar (§1) survives intact at the colony scale.

### 7.2 The genome bank (placement within a sealed 3,301 space)

The engine already defines a fixed, deterministic **3,301-seed space** with
rank-based rarity (`COLLECTION_SIZE = 3301`, itself an emirp: 3301 ↔ 1033).
This is a perfect complement to the emirp supply lattice: cumulative supply
seals at exactly 3,301 tokens, and every token that ever mints is one
canonical seed, claimable **once, ever**.

- Gameplay determines *which seed a nymph emerges into*, never what traits
  exist — rarity stays legible and rank-based forever.
- At each emergence event, the cohort resolves in **draft order by journal
  score**: the highest scorer draws first from a rarity-weighted pool; each
  draw depletes the rare strata for later picks. Ties and idle nymphs resolve
  by the emergence block hash.
- The bank depletes across all mint generations, so the Genesis 13 sample the
  fullest pool — a structural first-mover advantage that needs no boosts.
- Everything is recomputable from chain data: seed traits are deterministic,
  draft order is a pure function of on-chain journals, the draw uses the
  emergence block hash.

(Deliberately NOT doing open-ended trait synthesis per generation: the
`instructionOverrides` path makes it technically easy, but it breaks the
canonical rarity table and invites trait inflation. Open-endedness comes from
lineage, routes, and mirrors instead.)

### 7.3 Route selection through nymph play style (emergent selection)

The emirp doc (§17) prefers route selection to *emerge from play*. The nymph
game gives the perfect observable signal, per lineage, during the Genesis
season:

- Concentrated claiming — hammering one find type, manual-mode sprints,
  specialisation → **Rapid Ascension** (13 → 37 → 167 → 743 → 3301).
- Diverse claiming — spreading across find types, discovering mirrored finds,
  patient coverage → **Deep Lineage** (13 → 31 → 71 → 167 → 389 → 1151 → 3301).

The route a lineage is drifting toward can be hinted in the vitals UI
("your brood is specialising…") with an explicit confirm at season end —
the hybrid the emirp doc recommends. The same telemetry, aggregated across
all 13 Genesis lineages, can drive the **world-level** route vote for the
mint schedule (mechanics doc §1: "let the collection choose").

### 7.4 Mirrored finds (the 13 ↔ 31 mechanic underground)

Every find type gets a hidden **mirror state** (emirp doc §20): claimed finds
normally record their visible value, but under specific conditions — claimed
during a molt window, claimed at tunnel positions that mirror an earlier
claim, or revealed by an "old exuvia" — the find flips and records its
reversed reading. Mirrored claims:

- reveal the lineage's dormant/mirror stat (the reversed emirp),
- render visibly on the nymph as a reversed glyph mark,
- and matter later: the distributed cipher (mechanics doc §4) requires
  rune-fragments read *both* ways, so mirrored journal entries are the
  mechanism by which a token's fragment gains its reversed reading.

This makes the mirror mythology playable from day one, underground, before
any adult exists.

### 7.5 Inheritance & offspring slots at emergence events

At each mint event (First Emergence, etc.), a lineage's accumulated emirp
power converts to **offspring slots** (mechanics doc §4): journal score sets
how many eggs each adult earns toward the next generation's mint, consistent
with consent-based pairing — two holders agree to pair, the pairing's
combined journals shape the offspring.

- An offspring egg inherits **weighting, not copies**: its find schedule
  biases toward its parents' claimed find types, its emergence draw nudges
  toward the parents' trait families, and mutation odds ride the randomness
  beacon.
- Egg rights are the whitelist for the next mint event — hatch, gift, or
  sell. Lineage is recorded on-chain back to a Genesis nymph.

### 7.6 Timing constants

Defer to the docs' numerology rather than inventing a new ladder: **13** and
**17** are the timing constants (real brood cycles; mechanics doc §1). e.g.
Genesis nymph season 13 weeks (mechanics doc suggests this for the First
Emergence); find claim windows 13 or 17 hours-in-blocks; molt ceremonies at
17:00 UTC; announcements January 4. Season length per generation is a supply
-layer decision (§8) — the nymph engine just consumes a block schedule.

## 8. Open questions (decide before Phase 1)

1. **Genesis season length**: 13 weeks (mechanics doc suggestion) is long for
   a first game loop — consider 13-day *instars* (5 × 13 days ≈ 9 weeks) or a
   compressed 13-day Genesis season as a proving run. Sets all block math.
2. **Chain for the journal**: Stacks contract (fits existing relayer/drops
   stack) vs. Bitcoin inscriptions via Xtrata protocol. Recommendation:
   Stacks for gameplay claims, one Xtrata composable inscription per sealed
   generation (emirp doc §25) as the permanent lineage layer.
3. **Trait visibility during nymph stage**: mysterious icons recommended
   ("something metallic…") — protects reveal-day drama and suits the lore.
4. **Brood clock**: shared season clock for the Genesis 13 (with per-nymph
   molt jitter) recommended — the draft resolution (§7.2) and the emergence
   event need a common block.
5. **Missed-find decay**: expire to nothing, or trickle into vitality?
6. **Offspring slot curve** (§7.5): how steep? Steeper = more cutthroat
   fitness competition at each emergence.
7. **Genome bank strata for Genesis**: full 3,301 space reachable day one, or
   apex seeds (the 3301-beacon mythics) reserved for completed 3301-Generation
   lineages? Reserving them ties the rarest art to the endgame — recommended.
8. **Layer coupling** (mechanics doc §7.0): soft gate recommended — journal/
   emirp progress scales offspring slots and draw weighting, never blocks
   participation.
9. **Genesis canon**: confirm 13 (not 31) and fix the two stale "31 Genesis
   nymphs" references in `cicada-collection-mechanics.md` §4.
