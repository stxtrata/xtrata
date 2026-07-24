# Proof of Free — on-chain reveal & mint-gating

**Goal.** The inscribed engine draws the whole 1,024-tile Xtrata mosaic, but only
editions that actually exist on-chain appear and are playable. New editions are
revealed in **random batches of 32** (32 batches → the full 1,024). This document
is the plan for wiring the mosaic to on-chain state, plus the local **simulation**
(shipped now, behind `?sim=1`) that previews the random reveal before a single
satoshi is spent.

---

## 1 · Source of truth — a Stacks (Clarity) contract

The collection lives on Stacks, so a Clarity contract is the canonical registry of
which editions have been minted / inscribed.

- **State: a 1,024-bit minted bitmap** — one bit per edition (1‥1024), set when that
  edition is minted. Stored as `(define-data-var minted (buff 128) 0x00…)` (128 bytes
  = 1024 bits) or a map of 32-bit words. A bitmap means the **entire** mint state is a
  single, cheap read.
- **Uniqueness** is enforced by the contract at mint (a bit can only flip once).
- **Read path:** the mosaic (running in a browser or an inscription iframe) calls the
  contract's read-only `get-minted` via the Hiro Stacks API
  (`POST /v2/contracts/call-read/{addr}/{name}/get-minted`) or
  `@stacks/transactions` `fetchCallReadOnlyFunction`, then decodes the buffer into a
  `Set` of minted edition IDs.
- **Why not read Bitcoin/ordinals directly:** ordinal indexing is heavier and less
  uniform to query. The Stacks contract gives one authoritative, cheap bitmap that the
  mint process updates in lockstep with each inscription.

## 2 · The random batched reveal (32 at a time)

1,024 ÷ 32 = **32 batches**, each revealing 32 editions **randomly scattered** across
the mosaic — so the Xtrata mark emerges from noise rather than filling in by region.

- **Determinism + fairness.** The reveal order is a **seeded Fisher–Yates shuffle** of
  `[1…1024]`. Batch *i* = `shuffled[i·32 … i·32+32]`. Anyone can recompute the shuffle
  from the seed and confirm the batch assignments match the on-chain bitmap.
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
