# Cicada.btc v11.3.5 Changelog

## v11.3.7 — Gait Realism Upgrade

Visual-only; traits, rarity, audio fingerprint and metadata are untouched.

### Planted-foot gait (`ground-gait.js`)
- Stride period now follows smoothed body speed (240–620ms) instead of a fixed 420ms clock.
- Foot placement is velocity-predicted: each swing aims ahead of the rest pose by the distance the body will travel during the coming stride.
- Swings use an eased trajectory (fast lift-off, decelerating placement), speed-scaled lift, and a small touchdown grip-settle.
- Each leg carries a fixed golden-ratio phase offset (±8%) so tripods no longer lift in robotic unison.
- Overstretched stance feet (>46 units from rest) trigger a corrective re-step.

### Walk driver (`cicada-renderer.js`)
- Heading lean: the shell rotates part-way (clamped ±38° × 0.45) toward the travel direction so walks read head-first, ramped in/out so nothing snaps.
- Walk-cycle body bob (~1.1px sine) applied to the art group and fed into the gait solver so planted feet stay pinned to the bark while the body bobs.

Export bundle regenerated (`node tools/build-export-bundle.mjs`); nymph renderer inherits the gait upgrades unchanged via the shared `PlantedFootGait` API.

### Wing gesture repertoire (`cicada-renderer.js`)
Five distinct one-shot wing gestures replace the single shuffle, each with its own speed, visibility, and trigger. All are seeded from the idle RNG, gated `:not(.is-flying)`, and suppressed by reduced motion:
- **Shuffle** (kept): slow resettle, 0.7–1.25s — subconscious settling.
- **Flick**: sharp snap-out/snap-back of all four wings, 0.16–0.30s — startle/dust-shake; also the conscious post-landing resettle.
- **One-wing flick**: a single forewing+hindwing flicks alone, small amplitude — subtle grooming tic.
- **Tremble**: rapid 12–16Hz micro-quiver, 1–2.5° for a short burst — conscious wind-down after a signature call ends (~55% chance), occasional idle nerves.
- **Stretch**: slow deliberate part-hold-fold, 2.4–4s — rare comfort move.

Idle weighting: walk 50%, shuffle 18%, flick 12%, one-wing flick 8%, tremble 7%, stretch 5%. Conscious hooks: landing completion → flick/shuffle resettle (seeded delay); `triggerCallVisual` end → tremble.

## v11.3.5 — Call Connection + Sound Variety Upgrade

All changes are playback / network layer only: the acoustic genome, offline signature render, audio fingerprint, and full metadata CSV remain byte-identical to v11.3.4.

### Gallery call connections (`gallery-listener.js`)
- **Rhythmic reply scheduling**: responder delays now follow the source seed's pulse group (e.g. `2-2-3`), landing replies in grouped bursts separated by breath gaps — the gallery answers in the caller's own rhythm genome.
- **Antiphony**: responses of 4+ can split into two alternating choirs, the second offset by half a breath.
- **Echo waves**: Epic/Legendary/Mythic calls can pull up to 3 responders back for a soft, distant second answer (~3–5s later), with a new dashed-blue `gallery-cell-echoing` state.
- **Evolving calls**: the event PRNG is reseeded per call ordinal, so re-clicking the same cicada produces a different — but deterministic — response shape each time.
- **Spatialised replies**: every responder answers from a seeded stereo position, at a slightly individual playback rate, with cascade depth adding distance blur and gain falloff.

### Signature playback (`motion-bridge.js`)
- `playSignatureCall` gained `playbackRate`, `pan`, and `distance` options (post-render WebAudio chain; the rendered call and its fingerprint are untouched). The abdomen rig clock is rate-corrected so motion stays in sync at varied rates.

### Ground movement (`cicada-renderer.js`)
- **Seeded wandering**: while landed, each cicada now occasionally strolls a short path around its perch. The walk transform is applied to the insect art group (`#effect-wrapper`) inside the SVG — the bark backdrop, ambient fields, and motion fields stay pinned to the gallery grid; only the cicada moves — legs scuttle in an alternating gait, the body bobs, and the shell tilts into its heading. Paths are deterministic per seed, stay within a rarity-scaled range of the home position, and steer back when they drift too far.
- **Wing shuffles**: a new one-shot resettle — wings flick out, rustle, and fold back — fires between walks with seeded amplitude and duration.
- Behaviour cadence and range scale with rarity tier (new `wander` field in the finish tier table). Flight, takeoff, landing, and signature calls always take priority; `prefers-reduced-motion` (and the Motion toggle) suppress the whole loop; `idleWander: false` in render instructions disables it. Wander state is cleaned up on `destroy()`.

### Group chorus (`group-chorus.js`)
- **Two new rhythm modes**: *Wave relay* (rhythm sweeps across the stereo field) and *Pulse train* (chorus locks to the seed's pulse group counts). A seeded ~22% of seeds adopt the new modes; all other seeds keep their exact pre-11.3.5 chorus identity (legacy draw lists preserved, verified across the collection).
- **Pulse-group accents**: every voice's phrase is now accented by the seed's solo pulse group, so the chorus carries the same rhythmic DNA as the signature call.
- **Swarm hush**: a new `silenceBreaks` gene (~42% of seeds, drawn after all legacy toggles so they keep their values) makes the whole forest fall near-silent for a breath roughly every 75 seconds, then swell back.

## v11.3.5 — Hardening Release

Metadata is byte-identical to v11.3.4 (full-CSV diff verified; `tools/verify-determinism.mjs` all pass).

- Removed the unreachable `'eye'` accent branch in `makeRareTier` (the accent picker never emits `'eye'`); dead code only, no distribution change.
- `weightedPick` no longer falls back to the full unfiltered table when a filter combination empties the list — it now falls back to the single most common entry, so gated high-tier traits can never silently leak into lower tiers. (This path never fires with current tables; behavioural output unchanged.)
- Deduplicated `mulberry32`: `gallery-listener.js` and `gallery-flight-network.js` now import it from `utils.js` instead of carrying local copies (drift risk removed).
- `renderCicada().destroy()` now removes the seed badge from `document.body` (small DOM leak fix when `showSeedBadge: true`).
- Bumped all module cache-busters to `?v=11.3.5` and regenerated `src/export-bundle-source.js`.

# Cicada.btc v11.3.4 Changelog

## v11.3.4 — Queued Calls + Source-Linked Flight

- Reworked `src/gallery-listener.js` so a new source call no longer clears the existing gallery response network.
- Added per-cicada call queues: if a cicada is already singing, another triggered call is queued and begins after the current signature finishes.
- Added delayed wildfire-style acoustic cascades. Similarity still chooses who hears the call, while rarity controls direct caps, total event budget, cascade depth, and bridge potential.
- Common calls remain tightly capped to a tiny local pocket; Rare/Epic calls can sometimes chain; Legendary/Mythic calls can build longer delayed waves.
- Reworked `src/gallery-flight-network.js` so triggered followers are linked to the source flight window.
- If the clicked source cicada stays flying, its triggered followers stay flying too; when the source lands, its linked followers land with it.
- Added queue and linked-flight CSS states for clearer testing feedback.

## v11.3.2 — Rarity-Capped Gallery Listening

- Added rarity caps to gallery call-and-response: similarity chooses likely responders, rarity controls how powerful the source call is.
- Common calls are hard-capped to a small local pocket, while Legendary and Mythic calls can create large or whole-gallery responses.

## Visual Direction

v11.3 builds on the v11.2 photographic-bark foundation with three focused improvements:

1. **Seeded bark placement.** Every seed now receives a deterministic crop, scale,
   and micro-rotation of its assigned bark photograph. The same tree type can appear
   on hundreds of seeds, but each seed frames the bark differently, so no two
   backgrounds are identical.
2. **Bark family metadata.** The 16 tree slugs are grouped into families
   (deciduous hardwoods, evergreens, Australian natives, orchard/fruit trees,
   softwood/weeping, and legume) and surfaced as a new trait and gallery filter.
3. **Self-contained export option.** The builder now offers an "Inline bark images"
   toggle. When enabled, the 16 bark JPEGs are base64-encoded into a single shared
   `bark-assets.js` module inside the export ZIP, so every seed HTML renders its
   backdrop without relying on an external `assets/bark/` folder. The default
   remains external files for a smaller ZIP.

## Implementation Notes

- Added `barkPlacementForSeed()` in `cicada-traits.js` (post-rank, PRNG-driven).
- Added `barkFamilyForSeed()` and `barkFamilyLabel()`; exposed via `item.barkFamily`
  and the `"Bark Family"` trait.
- `cicada-renderer.js` `_applyBarkBackdrop()` now applies the seeded transform to
  the bark `<image>` and reads from `instructions.barkAssetMap[slug]` when present.
- `cicada-core.js` opportunistically imports `./bark-assets.js` and passes the map
  through to the renderer.
- `builder-ui.js` gained the inline-bark toggle, a `barkFamily` gallery group/filter,
  and the export logic that writes either `bark-assets.js` (inline) or the raw
  `assets/bark/*.jpg` files.
- `trait-registry.js` now includes `barkBackdrop` in `LAB_CONTROL_ORDER`, allowing
  the Trait Lab to audition any of the 16 backdrops.

## Compatibility

- Collection size remains 3,301.
- Existing v11 rarity (rank / tier / rarityScore) is identical to v10.4.0.
- Bark placement and family are assigned post-rank and do not feed rarity scoring.
- All existing UX, accessibility, audio, motion, metadata, and export flows are retained.