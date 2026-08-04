# Proof of Free — Living Synth v5

A 1,024-tile living mosaic of the Xtrata logo, presented as ONE square
artwork you play. One immutable engine, deterministic genomes, drum NFTs,
distinct synth architectures, MIDI/keyboard input, an owner-driven child
registry, and a full cross-platform live-performance layer.

## Sound: distinct synth architectures

**Brand colour.** Fixed hues — **Bitcoin Orange** (#F7931A) for the core,
**Stacks Blue** (#5546FF) for the field, neutral greys for the head — and every
tile fades between *its* colour and black or white (no rainbow drift). A rare
**gold MYTHIC** (~1%) is the collection's rare: gold, glowing, more alive.
Dormant tiles hold their brand colour and quiet their motifs so the **Xtrata
mark reads clearly**; a tile only blooms to full brightness and motion while it
is playing.

Colour → family → **mix role** (black drums · orange bass/sub · blue leads ·
grey/white bright highs). On top of that, every tile carries a **synth
architecture** so tiles in a family are different *instruments*, not one synth
with effect tweaks:

`supersaw · FM · PWM · ring-mod · reese · pluck · wavetable · dual-osc`

Each core feeds the shared filter / envelope / effects tail so they still sit
together in the mix. Blue leads alone spread across five architectures.

## MIDI & computer keyboard

Open a synth and play it from a **MIDI controller** (Chrome/Edge/Android — the
header shows device status; iOS Safari has no Web MIDI) or the **computer keys
Z–M / Q–U**, snapped to the tile's scale and register. Notes sound through that
tile's architecture and are captured into recordings like pad gestures.

## One square, view-swap

The whole app is a single 1:1 square with controls framing the edges
(modes top, groups left, live/jam right, transport bottom). **Double-tap /
long-press a tile and the centre swaps in place to that synth** — chaos pad or
drum sequencer, its own transport, a **default/child dropdown**, and MIDI
status — with an **✕** to return. The mosaic keeps running underneath, so all
live state is remembered when you come back.

## Live controls (touch + desktop)

TAP MODE toolbar sets what a tap does: **PLAY / SOLO / GROUP / MUTE**. Gestures:
**double-tap/click = open the synth**, **long-press = open**, **vertical
click-drag = that tile's volume** (drag also fades a stopped tile in). Desktop
accelerators: **shift-click = solo · alt-click = group · ⌘/ctrl-click = mute**.
Solo/mute are phase-preserving gain masks. A persistent **state readout** (live
/ finishing / solo / mute / voices) sits top-left, with explicit **unsolo /
unmute** buttons so states are always visible and clearable. Groups A–D launch
phase-locked; **group-solo toggles**. Transport: scan · **stop (finish loops)**
vs **kill (instant)** · voices **8⇄16** · **randomise jam** · **save/recall
scenes** (persisted). Green = live · orange = finishing · dashed = muted ·
brighter = soloed · corner dot = group · left bar = volume.

**Global transport sync.** Every tile aligns to one shared musical zero, so
whenever you start a tile it locks to the same bar/beat grid — tiles launched
seconds apart always stay in sync (loop lengths are whole bars). **Genesis
melodies are deliberately minimal** (~2–3 notes/bar, beat-anchored) so many
tiles layer without turning to mush.

## Default vs recording

Genesis is the starting default. **Opening a synth keeps its default playing**
(latest child, else genesis) so you always hear what you're editing; hitting
**● record** stops the default and captures your take, and **■** switches
playback to that take until you **clear** back to the default / most-recent
child. A local recording plays as the default locally until cleared (one or the
other, not layered). **Publishing a child** is the owner-only step that changes
the on-chain default for everyone; the latest published child wins, and genesis
+ all earlier children stay selectable from the in-view dropdown. **Kaos tone
persists:** shape a tile on the chaos pad and that position rides back into the
mosaic — drums thread it through every hit, melodic tiles hold the filter.

## Session recorder — record a song

Where a synth recording captures one instrument's gestures, the **SESSION**
controls capture the *whole set*. Hit **● rec set** and every move you make —
tiles launched and stopped, solo / mute / volume, voice-cap, groups, scenes,
arrows, the randomiser — streams into one tick-timed timeline against the shared
transport (the tiles already playing are seeded in, so the song stands alone).
Hit **■** to stop, **⇩ save** to download the `xtrata-session` JSON — ready to
inscribe later. **▶ song** replays it hands-off: input locks, a stop button
floats over the mosaic, and the artwork performs itself — the same engine,
non-interactive. **⇪ load** plays back any saved session JSON.

## Mosaic legibility

The base colours reproduce the Xtrata mark exactly, so how loud a **dormant** tile
is allowed to be is a direct trade against whether the mark reads. Those numbers
live in one `TUNING` block at the top of `engine/engine-core.js` and are read every
frame. Live tiles ignore all of it and always draw at full strength, which is what
makes playing a tile the reward.

Open **`apps/tuner/tuner.html`** to drag them against the full 1,024-cell reveal.
It drives the real engine rather than a copy, has a `play 8` button so you judge
dormant tiles against live ones, a `base colours` reference view, hold-to-A/B
against the shipped defaults, and it prints the block to paste back.

## On-chain (Xtrata + one registry contract)

The editions are **Xtrata inscriptions** (natively SIP-009), so ownership,
transfers and marketplaces are Xtrata's, and child recordings are Xtrata
parent-child inscriptions. One bespoke contract,
**[`living-synth-registry`](contract/contracts/living-synth-registry.clar)**, holds
the two facts the chain cannot otherwise answer:

- **Sticky reveal.** A cell lights up the first time its token leaves treasury
  custody and stays lit forever after, even if it comes back. That is history, not
  current state, so it is latched when it happens. All 1,024 flags are bits inside
  8 uints, so **one read-only call returns the whole collection**.
- **Which recording a cell plays.** Parent-child only points upward on chain, so
  children have to be indexed. `register-child` verifies the caller owns both the
  edition and the recording, checks the parent link, and takes the fee, all in one
  transaction. 0.1 STX for a child, 1 STX for a live set, owner-updatable.

Unrevealed tiles render as dark "not yet inscribed" slots and can't be played.

- **Preview the reveal now:** `living-synth-v5-demo.html?sim=1` — seed / reroll / step 32 / auto.
- **Contracts:** `cd contract && clarinet check && npm test` — 3 contracts, 0 errors, 46 tests.

> **Not yet wired.** The mosaic still reads reveal from a `holdersUrl` HTTP endpoint
> and keeps children in `localStorage`. Nothing reads the registry yet, and
> `apps/canary/canary.html` still walks the superseded `recording-fees` deployment.

Architecture: [`docs/onchain-reveal-plan.md`](docs/onchain-reveal-plan.md) · deploy: [`docs/deploy-runbook.md`](docs/deploy-runbook.md) · contracts: [`contract/`](contract).

## Layout

```
packages/genome/               XTRATA_MAP · roles · synth-arch trait · drums · drift
packages/performance-codec/    xtrata-performance v1 (+ pattern + tone) · xtrata-session v1 (song)
engine/engine-core.js          TUNING · pluggable cores · per-instrument mute bus · reveal gating ·
                               phase-locked launch · MIDI/keyboard · drum kit · mosaic
artifacts/proof-of-free-engine-v5.js   built inscription artifact
scripts/build-collection.mjs   builder + invariants + manifest
manifests/collection-v5.json   hashes · roles · archs · loops · map
apps/mosaic/mosaic.html        square shell · view-swap · live controls · MIDI · reveal (sim + live)
apps/tuner/tuner.html          mosaic legibility sliders, driving the real engine
apps/canary/canary.html        one-wallet deploy console (predates the registry)
contract/                      living-synth-registry.clar + mock core + Clarinet tests
docs/onchain-reveal-plan.md    on-chain architecture (Xtrata + registry)
docs/deploy-runbook.md         inscribe · deploy · register · distribute
living-synth-v5-demo.html      self-contained single-file demo
```

## Run

```sh
node scripts/build-collection.mjs       # ALWAYS rerun after editing engine/ or packages/
node scripts/build-collection.mjs --seeds --engine-id 12345
open living-synth-v5-demo.html          # the instrument
open living-synth-v5-demo.html?sim=1    # + the random batched-reveal simulation
open apps/tuner/tuner.html              # mosaic legibility sliders
cd contract && clarinet check && npm test
```

Invariants: byte-identical rebuilds · 1,024 unique genome hashes · loop trait
∈ {1,2,4} · no silent melodic tile · no empty drum pattern. ENGINE_VERSION 3.
