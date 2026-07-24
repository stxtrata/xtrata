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

## On-chain (Xtrata) reveal, fees & deploy

The editions are **Xtrata inscriptions** (natively SIP-009), so ownership, transfers
and marketplaces are Xtrata's. The mosaic starts empty and reveals a tile once its
edition has **left the treasury wallet** (gifted or sold) — read live from Xtrata
ownership through a `pof-chain` config block; unrevealed tiles render as dark "not yet
inscribed" slots and can't be played. Child recordings that evolve a synth are Xtrata
parent-child inscriptions. The one bespoke contract, **`recording-fees`**, charges
0.1 STX / 1 STX (owner-updatable) to inscribe a child / live-set recording.

- **Preview the reveal now:** `living-synth-v5-demo.html?sim=1` — seed / reroll / step 32 / auto.
- **Point at real state:** `?live&holdersUrl=…&treasury=…`, or bake a `pof-chain` block in.
- **Deploy it:** open `apps/canary/canary.html` — a one-wallet, step-through console
  (connect → inscribe engine → deploy `recording-fees` → inscribe mosaic → inscribe
  editions → distribute), each step verified.

Architecture: [`docs/onchain-reveal-plan.md`](docs/onchain-reveal-plan.md) · contract: [`contract/`](contract).

## Layout

```
packages/genome/               XTRATA_MAP · roles · synth-arch trait · drums · drift
packages/performance-codec/    xtrata-performance v1 (+ pattern + tone) · xtrata-session v1 (song)
engine/engine-core.js          pluggable cores · per-instrument mute bus · reveal gating ·
                               phase-locked launch · MIDI/keyboard · drum kit · mosaic
artifacts/proof-of-free-engine-v5.js   built inscription artifact
scripts/build-collection.mjs   builder + invariants + manifest
manifests/collection-v5.json   hashes · roles · archs · loops · map
apps/mosaic/mosaic.html        square shell · view-swap · live controls · MIDI · reveal (sim + live)
apps/canary/canary.html        one-wallet deploy console (Xtrata + Stacks)
contract/                      recording-fees.clar (fees) + Clarinet tests
docs/onchain-reveal-plan.md    on-chain architecture (Xtrata-native)
living-synth-v5-demo.html      self-contained single-file demo
```

## Run

```sh
node scripts/build-collection.mjs
node scripts/build-collection.mjs --seeds --engine-id 12345
open living-synth-v5-demo.html          # the instrument
open living-synth-v5-demo.html?sim=1    # + the random batched-reveal simulation
```

Invariants: byte-identical rebuilds · 1,024 unique genome hashes · loop trait
∈ {1,2,4} · no silent melodic tile · no empty drum pattern. ENGINE_VERSION 3.
