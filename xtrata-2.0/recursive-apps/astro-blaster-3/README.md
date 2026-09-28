# Astro Blaster 3

A vertical neon shooter whose Top 10 lives on Stacks, with every entry's full replay stored on-chain and re-playable by anyone.

## Layout

- `src/sim/` — deterministic engine (core, data, game, enemies, bosses, replay) plus `bot.js` (test/attract autopilot).
- `src/client/` — renderer, audio, input, chain reads + submit hand-off, UI (`main.js`), `shell.html`, `style.css`.
- `tools/build.mjs` — builds `release/astro-blaster-3.html` (production, no test hooks), `release/astro-blaster-3.test.html` (with hooks for automated checks) and `release/sim.js` (engine used by verifiers).
- `tools/test-sim.mjs` — determinism, replay round-trip, tamper/pilot/frame-cap rejection, full-campaign soft-lock check, difficulty probe.
- `tools/calibrate.mjs` — difficulty calibration with reaction-limited bots.

```bash
node tools/build.mjs        # build
node tools/test-sim.mjs     # engine tests
```

`src/arcade-submit/ab3-engine.js` in the site must be byte-identical to `release/sim.js` (a test enforces it). After changing the engine: rebuild, copy `release/sim.js` there, and bump `ENGINE_VERSION` if old replays would no longer reproduce.

## Determinism rules (the replay proof depends on them)

The sim never reads the clock, `Math.random`, the DOM or device state, and never uses `Math.sin/cos/atan2/pow/exp` (engines may differ); `dsin/dcos` are polynomials. Only `+ - * /`, `Math.floor/abs/min/max/sqrt/imul` and bit operations. Anything cosmetic (particles, flicker) lives in the renderer.

## Replay format v2

A 52-byte little-endian header followed by the deflate-raw input log:
`0-2 "AB3" · 3 format · 4-23 pilot hash160 · 24 pilot version · 25 mode · 26-27 engine · 28-31 seed · 32-35 period · 36-39 frames · 40-47 score (f64) · 48-51 state hash`.
The contract requires bytes 4-23 to equal the submitting wallet's hash160.

## Launch checklist

1. **Contract.** Deploy `xtrata-arcade-scores-v2` with the web-wallet canary: `npm run build:canary:arcade-scores-v2`, serve `canaries/build/`, and run steps 1–11 (see `canaries/arcade-scores-v2/README.md`). It deploys at Clarity 4 and proves submit, copy refusal, void and ban on chain. The game and the submit page assume deployer `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X`; if you deploy from another address, change `CHAIN_CONFIG` in `src/client/chain.js` and `ARCADE_CONTRACT` in `src/arcade-submit/core.ts`, then rebuild **before** inscribing.
2. **Inscribe** `release/astro-blaster-3.html` as `text/html` (about 192 KB, fits a single-transaction mint).
3. **Register the boards** (owner) — the canary's last step does this once you enter the inscription id:
   - `set-board "astro3" u0 u10000000000 u0 <inscription-id> false true`
   - `set-board "astro3-daily" u0 u10000000000 u0 <inscription-id> true true`
   (mode 0 = higher wins; cap 10 billion; no entry fee; engine id = the inscription.)
4. **Site.** Merge the branch and deploy; `prebuild` builds `/arcade/submit.js`. Swap token `73n` in `src/home/config.js` (`code-various`) for the new inscription id.
5. **Canary (WALLET-PLAYBOOK §10), disposable wallet only**, on desktop and on a phone wallet browser: set that wallet as pilot, play a short run, submit from inside the xtrata.xyz viewer and from the raw inscription page, confirm the entry appears and shows **Verified**, and that a different wallet is refused.
6. Retire `xtrata-arcade-scores-v1-3` from any registry (newest-only rule); leave its history alone.

## What the proof does and does not cover

It proves the score came from a real run of this engine, flown for that wallet, and that nobody can copy it. It cannot tell a skilled human from a bot or tool-assisted run built with genuine inputs, and the daily seed is public, so days can be practised in advance. Mismatched replays can be voided (which also bars that wallet from the board).
