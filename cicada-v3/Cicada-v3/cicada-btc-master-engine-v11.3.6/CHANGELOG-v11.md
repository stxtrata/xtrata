# Cicada.btc Master Engine — v11.0.0 Changelog

v11.0.0 is a **UX / accessibility / performance** release. The generative core is
unchanged: every seed produces the same artwork, audio, traits, rank and score as
v10.4.0. No trait weights, RNG, scoring, rank sort, sound genome, or fingerprint
codec were modified.

## Determinism guarantee

Every change below is output-preserving. `seedToState`, `generateInstructionsFromSeed`,
the rarity scoring + rank sort, `soundGenomeForSeed`, `renderSignatureCall`, and the
18-bit fingerprint codec are byte-for-byte identical to v10.4.0. The synchronous
`getCollectionMetadata()` and the new chunked `buildCollectionMetadataAsync()` run the
**same generator**, so they produce identical caches. To verify: diff this build's
`metadata.json` / `metadata.csv` against v10.4.0's across all 3,301 seeds — they match.
`tests/self-check.html` asserts the collection-level invariants in the browser.

## Performance

- **Non-blocking startup index (A1).** The full 3,301-seed ranking now runs in
  ~256-seed chunks across animation frames (`buildCollectionMetadataAsync`) with a live
  progress bar, instead of freezing the main thread on load. Same output, responsive UI.
- **IntersectionObserver-gated gallery (A3).** Off-screen gallery cells are paused
  (`animation-play-state:paused`), so the 8-wide grid stays smooth.
- **Lazy export bundle.** The heavy inscription module set (`export-bundle-source.js`)
  is now loaded on demand only when you click Export, removing it from the startup
  parse path entirely.

## Accessibility

- **Keyboard + screen-reader access to the artwork (B1).** The stage is a focusable
  `role="application"` control with a descriptive label; press **F / Enter / Space** to
  toggle flight + sound and **C** to play the signature call. This is wired in
  `cicada-core.js`, so it also ships inside every exported inscription HTML (**C1**).
- **Reduced motion (B2).** `prefers-reduced-motion` is honoured globally, and a
  **Motion** toggle (Auto / Reduced / Full) lets the user override it either way.
  The setting persists. Reduced mode freezes decorative animation while keeping the
  full static visual identity. Reduced-motion CSS is shipped in the base page styles,
  so exported inscriptions honour it too.
- **Announcements & state (B3).** `#status`, find results, fingerprint result, and
  chorus status are `aria-live` regions; filter / lock / chorus toggles expose
  `aria-pressed` / `aria-current` instead of relying on colour alone.
- **Focus visibility (B4).** A consistent neon `:focus-visible` ring on every control,
  plus a "Skip to controls" link.

## UX

- **Find a Piece (B5).** Look up by **rank** ("go to rank #1") or filter by **tier +
  trait value**; results are listed in rank order and jump to the seed on click. Pure
  UI over the already-computed metadata.
- **Deep-linkable + persisted seeds (B6).** The current seed is reflected in the URL
  hash (`#seed=2024`) and restored on reload (hash → last seed → 1). Shareable and
  reload-safe; no effect on generation.
- **Touch / keyboard interaction controls (B7).** An always-visible **Fly / Land** and
  **Signature Call** control pair makes the core interaction discoverable on phones and
  operable without a mouse.
- **Export clarity (B8).** The export shows an estimated uncompressed size and file
  count, and announces completion via the live region.

## Deferred (robustness-only, safest to run through a build/test environment)

These were scoped as optional in the plan and are intentionally **not** in v11.0.0 to
avoid shipping untested changes to the audio/visual core:

- **A2** — Web Worker collection indexer (the chunked main-thread path A1 already keeps
  the UI responsive; a worker is a further refinement with a fallback).
- **A4** — caching the parsed SVG template inside the renderer.
- **A5** — replacing the audio `setInterval` rhythm layers with an AudioContext-clock
  scheduler. The audio engine is shipped byte-identical to v10.4.0.

## Build / scaffold note

Two large UNCHANGED artifacts are produced by a script rather than hand-maintained:

- `src/cicada-renderer.js` — copied verbatim from the v10.4.0 sibling (tokens bumped).
- `src/export-bundle-source.js` — generated from the v11 runtime modules.

Run once before serving:

```bash
node tools/scaffold-from-v10.mjs
```

(Keep this folder next to `cicada-btc-master-engine-v10.4.0/`.) `export-bundle-source.js`
can be regenerated any time with `node tools/build-export-bundle.mjs`. The builder loads
the bundle lazily, so the app runs fully without it — only the Export feature needs it.

## File-by-file

| File | Status |
|---|---|
| `index.html` | Updated — a11y markup, Motion toggle, Find panel, touch controls, skip link, version. |
| `styles/builder.css` | Updated — focus-visible, reduced-motion, find/touch/motion styles, gallery pause. |
| `src/builder-ui.js` | Updated — async index, lazy bundle, find, deep-link/persist, observer gallery, export estimate. |
| `src/cicada-core.js` | Updated — focusable/keyboard/aria container, reduced-motion CSS, `toggleFlight()`. |
| `src/cicada-traits.js` | Updated — generator-based build + `buildCollectionMetadataAsync` (identical output). |
| `src/trait-lab-ui.js` | Updated — `aria-pressed` / `aria-expanded`. |
| `src/sound-identity-ui.js` | Updated — `aria-live`, `aria-pressed`, canvas `role/aria-label`. |
| `src/config.js`, `utils.js`, `sound-identity.js`, `cicada-audio.js`, `motion-bridge.js`, `group-chorus.js`, `trait-registry.js`, `zip-utils.js` | Byte-identical logic (cache-bust tokens bumped). |
| `src/cicada-renderer.js` | Verbatim from v10.4.0 via `tools/scaffold-from-v10.mjs`. |
| `src/export-bundle-source.js` | Generated via `tools/build-export-bundle.mjs`. |
| `tools/*.mjs`, `tests/self-check.html` | New. |
