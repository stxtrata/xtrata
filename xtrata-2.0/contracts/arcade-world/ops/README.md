# Arcade world: operator toolkit

Tools for running the Xtrata Arcade's world contracts (`xtrata-world-v1` rooms, bays, scenes and looks; `xtrata-posters-v1` the poster registry).
Everything here is **local-first and dry-run by default**. Nothing is deployed, signed or sent unless every confirmation below is in place.
Phase 4 (scenes), 4b (posters) and 5 (testnet rehearsal) of `claude/arcade-world-contracts-plan.md`.

Run from `contracts/arcade-world` (`npm install` once). Node 20+.

## The safety model

A real send needs **all** of these (see `lib/guard.mjs`; every sending tool checks them before it reads or builds anything):
1. `--execute` on the command line (otherwise: dry run).
2. `XA_OPS_CONFIRM=broadcast-testnet` (or `broadcast-mainnet`) in the environment.
3. A key file (`--key-file` or `XA_OPS_KEY_FILE`) holding one hex private key. On testnet it must not be the admin wallet's key.
4. Mainnet only: `--i-mean-mainnet` as well. `deploy.mjs` refuses mainnet altogether (mainnet contracts come from `contracts/live` and are a separate decision).
5. No kill file: if `ops/KILL` exists (or the path in `XA_OPS_KILL`), every sending tool stops.

The tools never hold or print keys, and the key file is read only at the moment of sending. Make a disposable testnet key with `keygen.mjs`.
Output files go to `ops/out/` (git-ignored); the bot's journal is `ops/.run-<file>.json` (git-ignored).

## What is here

| Tool | What it does |
|---|---|
| `validate.mjs file.scene.json` | Checks a scene file against the contract's rules and the hall's drawing rules, then prints the timeline. Offline, or against a chain with `--network`. |
| `preview.mjs file.scene.json` | Writes one local HTML page: the real hall showing your scenes, with buttons to jump to each key block. |
| `submit.mjs file.scene.json` | Compiles scenes into `add-scenes` calls (8 per call, all-or-nothing). Dry run writes the calls as hex to `out/`. With the confirmations, sends and reads back. Re-running skips what is already on chain. |
| `readback.mjs` | Reads a room's bays from a chain and compares with a scene file; `--at h1,h2` shows what will show at those blocks. |
| `revert.mjs` | Puts a bay back to posters now (one scene). |
| `validate-posters.mjs file.poster.json` | Checks a poster file, including your caps and live count when run against a chain. |
| `campaign.mjs rotation\|calendar list.json` | Generates a poster file from a short list (a rotation over N days, or events with a lead time). |
| `bot.mjs file.poster.json` | The publisher bot: sends posters in safe batches within the contract's caps, remembers what it sent, stops on the kill file, pause, lost whitelist or any cap error. |
| `review.mjs` | Review lane: lists posters waiting hidden; releases chosen ones (admin only). |
| `deploy.mjs` | Test network only. Deploys the stand-in core, the poster contract and the world contract in order. |
| `setup-chain.mjs` | One-time: registers the 22 built-in looks, the rooms and the publishers. Skips what exists. |
| `view.mjs` | Builds a local page showing a test network's contracts in the real hall (read-only). |
| `rehearsal.mjs` | The whole launch sequence on a simulated chain. Writes `out/rehearsal-report.md`. |
| `keygen.mjs` | Makes a disposable test-network key file. |

## Scene file

```json
{ "format": "arcade-scene-file/1", "room": "arcade-hall",
  "scenes": [
    { "bay": 0, "at": "+6h", "base": "door", "door": "door-gothic", "interaction": "knock",
      "layers": [ { "look": "curtain-house", "params": { "color": "#7a1020" }, "state": "closed" },
                  { "look": "sign-board", "params": { "text": "coming soon", "tone": "gold" } } ],
      "link": { "room": "lobby", "arrivalBay": 0 } } ] }
```
- `at`: a block height, or `+N` blocks, `+Nm` minutes, `+Nh` hours, `+Nd` days from the current height (10 minutes a block). Relative times are fixed when the file is compiled, so use absolute heights for anything you will submit later.
- `base`: `posters`, `wall` or `door`. `door`: `door-rect`, `door-arch`, ... (defaults to `door-rect` for a door). `interaction`: `none`, `knock`, `peek`, `enter` (`enter` needs a `link`).
- `look`: a built-in key (`curtain-house`, `sign-board`, `caution-tape`, `work-site`, `hum`, `light-steady`, `light-pulse`, `light-flicker`), a registered look name, or a look id. A sign board sits on the wall behind a curtain; add `"front": true` to hang one on the cloth.
- At most one cover, one sound and one light per scene; at most 8 layers; params up to 256 characters; a bay's timeline holds 48 scenes.
- Warnings (not errors) tell you where the hall will clamp a value or ignore a key.

## Poster file

```json
{ "format": "arcade-poster-file/1", "defaults": { "set": "community", "weight": 5 },
  "posters": [ { "head": "TOURNAMENT FRIDAY", "sub": "Brick Breaker, 8pm", "art": "trophy", "colour": "orange",
                 "from": "+1d", "days": 3, "action": { "kind": "path", "path": "/arcade" } } ] }
```
Posters always start after today (a Bitcoin day is 144 blocks). Publishers add community posters only, weight 1 to 20, within the daily and live caps; the admin can add core posters (weight to 100), evergreen posters and anything else. The generators write absolute day numbers so the same file means the same thing on every run.

## Tests

`npm test` runs the contract tests and the toolkit tests (`tests/ops-*.test.mjs`), including a check that the validator and the contracts agree on every rejection, and that no sending tool will send without its confirmations. The preview page is checked in a real browser by `recursive-apps/xtrata-arcade/tests/ops-preview.test.cjs`.
