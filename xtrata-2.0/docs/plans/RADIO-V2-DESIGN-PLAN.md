# Xtrata Radio v2 — "The Receiver" redesign plan

Target: the rendered concept — walnut cabinet, brushed-steel face, seven top
buttons, large two-line cyan VFD, four small pots (BAND / PRESET / TONE /
BALANCE) and a hero VOLUME knob. Everything below maps that faceplate onto the
existing `src/home/radio.js` engine, which already has: three-core resolver
ladder, preload queue, ignore/dud lists, silence detector, stall watchdog,
tuning sounds, VU/pulse analyser, volume knob logic, history, localStorage
continuity, and cross-page persistence. This is a reskin + feature layer, not
a rewrite.

## 1. Visual build (CSS only, no images)

- **Cabinet:** widen to ~340×220px (desktop; ~280px mobile), walnut gradient +
  grain (existing technique, deepened), rounded 18px, inner steel face plate
  (`linear-gradient` brushed texture via repeating fine vertical lines +
  radial sheen), 1px bevels top/bottom.
- **Header row:** logo + XTRATA wordmark left (existing assets); seven
  steel buttons right — pill-shaped, inset-shadow press states, engraved-icon
  color `rgba(0,0,0,.55)`.
- **Display:** two-line VFD, cyan `#5ee9ff` glow (swap from green), dot-matrix
  look (existing scanline overlay + `letter-spacing`), line 1 = station/mode
  (`XTRATA FM`, `LIKED`, `CHAIN`), line 2 = the existing self-paced ticker
  (title/artist/plugs, scroll-fully-offscreen behaviour retained). VU meter
  moves inside the display's right edge as slim cyan bars.
- **Pot row:** four small knobs with engraved labels + tick marks, − / + end
  labels; indicator line rotates via the existing knob transform technique.
  Big VOLUME knob right, orange accent ring (already have the drive-glow var —
  ring brightness = `--pulse`).
- **Size strategy:** this is a hero unit; default it to a **minimized pill**
  (logo + power + now-playing marquee, current footprint) that expands to the
  full receiver on click, state remembered. Keeps side pages unobtrusive.
- Speaker grille disappears from the face (per render); bass pulse moves to
  the volume ring + cabinet glow (both already driven by `--pulse`).

## 2. Button wiring (top row, left → right)

| Button | Function | Behaviour |
|---|---|---|
| ☰ List | **Liked list viewer** | Cycles liked songs on the VFD (`LIKED 3/7 — <title>`); long-press/second-click on an entry = remove. Also logs full list to console in debug mode. |
| 🔀 Shuffle | **Shuffle mode** toggle | ON (default, current behaviour): random pick per rules below. OFF: sequential — liked list in saved order, then curated order, then ascending chain ids. LED-style engraved highlight when active. |
| ♥ Like | **Like current song** | Adds `{tokenId, title, artist, likedAt}` to `xtrata.radio.likes` (localStorage, cap 200). VFD flashes `♥ SAVED TO YOUR STATION`. Toggle: pressing on an already-liked song unlikes. Heart stays lit while the playing song is liked. |
| 🔁 Loop | **Loop mode** cycle | OFF → ONE (repeat current song) → LIKED (rotate liked list only) → OFF. VFD announces; icon shows `1` badge in ONE mode. |
| ⏮ Prev | existing history-back | unchanged |
| ⏯ Play/Pause | **new: pause without power-off** | Pauses/resumes the element (ticker pauses too); distinct from the volume knob's power-off click. |
| ⏭ Next | existing skip | unchanged |

## 3. Play-order logic (the "liked songs first" rule)

On power-on (and cross-page resume when the previous song ended):
1. Build session queue: **all liked songs first** (shuffled if shuffle ON,
   saved order if OFF), each played once,
2. then fall through to the existing rotation (curated seeds + chain
   exploration), which continues indefinitely,
3. liked songs remain in the general pool afterwards (no repeat-suppression
   beyond the existing `recent` window).
Loop=LIKED overrides: queue cycles the liked list forever. Loop=ONE overrides
everything. Implementation: a `likedQueue` array consulted in
`tuneToNextTrack` before `preloadQueue`; preloader warms liked ids first.

## 4. Pot wiring — all four get real jobs

The audio graph gains two nodes (both cheap, WebAudio):
`source → toneFilter(BiquadFilter) → panner(StereoPanner) → analyser → destination`

- **VOLUME (hero pot):** existing knob logic verbatim — scroll/drag, 0–10,
  anticlockwise past 0 clicks off, default 8. Just restyled bigger.
- **TONE:** tilt EQ. Pot range −5…+5; negative = low-shelf boost + high cut
  (warm), positive = high-shelf boost (bright), centre = bypass. Same
  scroll/drag interaction, VFD flash `TONE ◄▮▮▮▮▯► WARM/BRIGHT`.
- **BALANCE:** `StereoPannerNode.pan` −1…+1 in 0.2 steps, centre-detent
  (snaps to 0 within one step). VFD flash `BALANCE L◄▮▮·▮▮►R`.
- **BAND:** the station selector — this is the best idea of the four rather
  than locking it. Three positions: **FM** (current mix: curated + chain
  exploration), **LIKED** (your saved station only — same as Loop=LIKED but as
  a "band" metaphor), **CHAIN** (pure full-chain exploration, no curation —
  radio roulette). Turning it plays the between-station squelch and retunes.
  Line 1 of the VFD shows the band name.
- **PRESET:** cycles curated sources within the FM band: `MUSIC` (jim-music
  gallery), future listening manifests (each L2 listening manifest published
  via the Manifest Studio becomes a preset automatically — fetched from
  `/g/<name>?format=json`). Until more manifests exist it has two stops
  (MUSIC / ALL) — functional, not locked, and it grows with the platform.

Persistence: shuffle, loop, band, preset, tone, balance all join the existing
`xtrata.radio.v1` state blob; likes live in their own key so clearing playback
state never destroys the library.

## 5. Sound design additions

Reuse the synth engine: button clacks (existing `playClick` at low strength)
on every top-row button; centre-detent tick on BALANCE; band-change gets the
full between-station squelch; like gets a warm two-note "ding" (two short sine
blips, major third).

## 6. Phasing & estimates

1. **P1 — Engine features behind current skin (½ day):** likes + liked-first
   queue, loop, shuffle, pause; tone + balance nodes wired to temporary
   keyboard/scroll targets. All logic testable before any visual change.
2. **P2 — Faceplate rebuild (1 day):** new markup + CSS to match the render;
   minimized-pill mode; VU into display; buttons/pots styled and bound.
3. **P3 — Band/Preset (½ day):** band switcher + preset cycling incl. manifest
   -sourced presets; squelch transitions.
4. **P4 — Polish pass (½ day):** press animations, engraved states, mobile
   sizing, cross-page state checks on all side pages, `?radiodebug=1` audit.

Total ≈ 2½ days. Each phase ships independently; P1 alone already delivers
the liked-songs behaviour you asked for.

## 7. Risks / notes

- `createMediaElementSource` is already wired once per element; inserting
  tone/panner means building the chain at first `wireAnalyser` — one-time
  refactor of that function, done in P1 while the skin is untouched.
- Liked songs referencing legacy-core content rely on the resolver ladder
  (already in place); the ignore list (#1065-style) always wins over likes.
- The expanded unit is large for mobile — the minimized-pill default and
  remembered expansion state are the mitigation.
- Keep the standalone `xtrata-radio.js` bundle in sync (it shares radio.js, so
  everything lands on side pages automatically; only re-test bundle size —
  currently 23KB, expect ~30KB).
