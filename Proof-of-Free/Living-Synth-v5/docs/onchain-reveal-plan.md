# Proof of Free — on-chain reveal & mint-gating

**Goal.** The inscribed engine draws the whole 1,024-tile Xtrata mosaic, but only
editions that exist on-chain **and are in circulation** appear and are playable. A
tile reveals the first time its token **leaves the Xtrata treasury wallet** (gifted
or sold). This document is the plan for wiring the mosaic to on-chain state, plus the
local **simulation** (shipped now, behind `?sim=1`) that previews the random reveal
before a single satoshi is spent. The contract that implements this ships and is
tested in [`../contract/`](../contract) (`proof-of-free-reveal`, 18 passing tests).

---

## 1 · Source of truth — a Stacks (Clarity) contract

The collection lives on Stacks, so a Clarity SIP-009 contract is the canonical
registry of which editions are **inscribed** and which have been **released** (moved
out of treasury).

- **Reveal = first exit from treasury.** Every edition mints into the Xtrata treasury
  wallet; the SIP-009 `transfer` flips a per-token reveal bit the first time the
  `sender` is the treasury. This lets the team gift some and sell some, and the mosaic
  shows exactly what's in circulation.
- **State: a 1,024-bit reveal map** stored as 32 × 32-bit chunks; `get-revealed-chunks`
  returns `(list 32 uint)`, so the mosaic reads the whole set in one call.
- **Read path:** the mosaic calls the contract's read-onlys via the Hiro Stacks API
  (`POST /v2/contracts/call-read/{addr}/{name}/{fn}`) or `@stacks/transactions`
  `fetchCallReadOnlyFunction`, decodes `get-revealed-chunks` → revealed token ids →
  positions via the shuffle.
- **Why not read Bitcoin/ordinals directly:** ordinal indexing is heavier and less
  uniform to query. The Stacks contract is one authoritative, cheap read that the
  distribution process updates in lockstep.

## 2 · Verifiable random placement (pre-committed shuffle)

Token `#k` maps to mosaic position `S[k-1]`, where **S is a seeded Fisher–Yates
shuffle** of `[1…1024]` — so whichever tokens leave treasury, the revealed positions
scatter across the mosaic and the mark emerges from noise. Distributing the first 32
lights up 32 random positions; that's what the `?sim=1` batch preview shows.

- **Determinism + fairness.** The seed is committed as a hash at deploy (`commit-seed`)
  and revealed later (`reveal-seed-value`, verified `sha256(seed)==hash`). The
  permutation is computed off-chain; anyone can recompute it from the revealed seed and
  confirm placements. The contract never stores the permutation.
- **Recording fees.** The same contract collects owner-updatable inscription fees to
  the treasury — **0.1 STX** per parent/child recording, **1 STX** per live set — via
  `pay-recording-fee` (`set-child-recording-fee` / `set-live-set-fee` to change them).
- **Entropy / seed — two models:**
  - **A — committed master shuffle:** one seed fixed at deploy (e.g. the deploy
- **Entropy / seed — two models:**
  - **A — committed master shuffle:** one seed fixed at deploy (e.g. the deploy
    burn-block hash) drives the whole 1,024 order; batches are consecutive slices.
    Simplest and fully verifiable; the order becomes knowable once the seed is public.
  - **B — per-batch entropy:** batch *i*'s 32 IDs derive from
    `hash(masterSeed, burnBlockHash_i)`, drawn from the remaining pool. Harder to
    pre-compute; the contract records each batch's block hash.
- The **simulation implements Model A** with a settable seed (so you can preview many
  distributions). Model B is a drop-in: hash the seed with a per-batch value before the
  shuffle.

## 3 · Rendering rule

- **Minted** → the tile renders and plays exactly as today (brand colour, motif, audio,
  full interaction).
- **Unminted** → a dark **"not yet inscribed"** slot: near-black cell + faint grid
  border, no motif, no animation, no audio, not selectable. The logo materialises as
  batches land.
- **Newly minted** tiles **bloom** (a bright ring + flash) for ~1.6 s, so each batch's
  32 are visible as they arrive.

## 4 · Interaction gating

Every tile action is gated on `isPlayable(edition)` — tap-to-play, open-synth,
volume-drag, solo / mute / group, the arrows, the randomiser, the region scan, and
session record / playback. Unminted tiles are inert; the randomiser and scan only draw
from minted tiles; a loaded session skips `on` events for editions that aren't minted
yet.

## 5 · Client architecture — `MintProvider`

A tiny interface isolates *where mint state comes from* from *how the mosaic uses it*:

```
MintProvider = { isMinted(ed), mintedSet(), count(), enforced }
```

- **`LiveMint(config)`** — production: polls the Stacks read-only bitmap (per block or
  every N s), decodes it, and pushes changes into the mosaic. Degrades gracefully
  (offline → last-known state).
- **`SimMint(seed)`** — testing (shipped): the seeded shuffle, with
  `next() / prev() / all() / reset() / setSeed()`.
- **Default** (no contract configured, no `?sim`): all 1,024 are playable, so the file
  is still a complete instrument/demo.
- **Selection:** `?sim=1` (optionally `&seed=…`) activates `SimMint` and the SIM bar.
  A real deployment injects the contract address/network via a small config block, not
  hard-coded into the immutable engine.

## 6 · Simulation module (ships now, behind `?sim=1`)

Open `living-synth-v5-demo.html?sim=1`. A **SIM** bar appears with:

- a **seed** field + **⚄ reroll** (each seed is a different random distribution),
- **◀ back**, **▶ inscribe 32**, **⏭ reveal all**, **↺ reset**,
- an **▶ auto** toggle that walks the whole 32-batch reveal so you can watch it fill,
- a readout: **`batch k / 32 · N / 1024 inscribed`**.

Start from a dark grid, drop the first random 32, and step batch by batch to see how the
scatter reads against the logo — or hit auto and watch the mark resolve.

## 7 · Inscription notes

- The **engine + mosaic are inscribed once** (immutable). The **mint bitmap lives in the
  mutable Clarity contract**; the mosaic reads it at runtime, so new mints appear with no
  re-inscription of the art.
- The sim/mock is **inert unless `?sim`** — it can stay in the inscribed file as a dev
  tool, or be stripped for the final immutable build via a build flag.
- Network / contract address are injected via config (a `<script id="pof-chain">` JSON
  block or URL params), never baked into the immutable engine.

## 8 · Open decisions (for you)

- Entropy **Model A vs B** (committed shuffle vs per-batch block hash).
- Unminted look — pure black vs the current faint dark slot with a grid border.
- LiveMint **poll interval** vs a websocket/block subscription.
- Whether the **sim stays in the production inscription** or is stripped.
