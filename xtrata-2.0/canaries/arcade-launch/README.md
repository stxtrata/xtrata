# Xtrata Arcade launch canary

One self-contained page that ships an arcade release in the only safe order, from your web wallet (Xverse or Leather). Each step unlocks only when the one
before it has passed, and each re-reads the chain rather than trusting the page. A reload
resumes waiting on a sent transaction, and re-running after "Forget local progress" resumes
from what the chain already holds (upload progress, inscription, boards).

Wallet connect and signing use the shared canary module (`../collection-v17/wallet.ts`,
the port of the X Chess v2 canary) and follow `docs/WALLET-PLAYBOOK.md`: providers found on
the top window, the chooser on every connect, the Xverse preflight order, no `sender` on
`stx_callContract`, abort on an account mismatch, deny mode, a 90s watchdog.

## v1.4.1: the parent loads from the gateway

v1.4 (parent #3081, packs #3079 engine and #3080 hall) read every chunk from the chain: about 270
reads per visit. v1.4.1 is a new parent only. It takes #3078 and both packs whole from the
xtrata.xyz gateway (`/i/<id>?raw=1`, served from R2) and uses each one only if its SHA-256 equals
the hash written into the parent; otherwise it reads that inscription from the chain as before.
The score client reads the Top 10 through the same hosts as the parent.

The packs are unchanged, so the canary finds #3079 and #3080 by hash and sends nothing for them;
only the parent is inscribed (1 signature). Boards already on #3081 are left alone:
`EQUIVALENT_PARENTS` in the build script lists earlier parents, and preflight proves on chain that
each one loads exactly the same packs over the same bundle before treating it as the same engine.
A parent-only release therefore needs about 4 signatures, not 35.

## What it inscribes (v1.4, recursive)

From v1.4 the arcade is built from parts grouped into five packs
(`recursive-apps/xtrata-arcade/README.md`). The canary inscribes only what changed since the
single-file bundle #3078 (v1.3):

| Inscription | Size | Chunks | Relationships |
|---|---|---|---|
| `engine` pack (score client, room, …) | 147 KB | 10 | child of #55 |
| `hall` pack (3D hall) | 189 KB | 12 | child of #55 |
| parent (text/html, the arcade people open) | 19 KB | 2 | child of #55, depends on #3078 + both packs |

`assets`, `three` and `games` are read out of #3078 by the parent. The parent is written in the
page with the pack ids the canary has just inscribed, by the same renderer as
`node build/modular.mjs build` (`build/parent-render.cjs`), so it is exactly what the build would
produce with those ids in `parent/ids.json`. If identical bytes are already inscribed (a re-run,
or a later release that re-uses a pack), that inscription is re-used and nothing is sent.

## Build

```bash
npm run build:canary:arcade-launch
```

Writes `canaries/build/arcade-launch-canary.html`. The build:

- checks the leaderboard contract against `PINNED_CONTRACT` and `release/xtrata-arcade.html`
  against the bundle #3078 pin, and computes the bundle's chain hash (the canary checks #3078
  on chain against it);
- runs `modular.mjs check` (the parts still rebuild #3078 byte for byte) and `build`;
- works out which packs differ from #3078, and refuses unless the packs, the parent shell and
  every part's hash match `PINNED_RELEASE` (it prints the new value for an intended release);
- refuses if `parent/ids.json` lists single-part overrides, a BOM or a CDN
  reference in the arcade, or a `boards.json` without 26 valid unique ids;
- embeds the single-file build of the same parts, which the canary uses to fly and re-play runs.

## Run

Wallet extensions do not inject into `file://`, so serve it:

```bash
cd canaries/build && python3 -m http.server 8080
# open http://localhost:8080/arcade-launch-canary.html
```

| # | Step | Signs | What it proves |
|---|------|-------|----------------|
| 1 | Connect | wallet | The account that owns the leaderboard and #55 |
| 2 | Preflight | none | Pins; #3078 on chain is the pinned bundle; #55 owned; core open; every fee quoted; a real run flown in v1.4; anything already inscribed found |
| 3 | Deploy | wallet | Skipped: `xtrata-arcade-scores-v2` is already on chain with the pinned source |
| 4 | Verify contract | none | Source matches; you own it; not paused |
| 5 | Inscribe engine pack | wallet x 3 | begin, upload, `seal-with-relationships` (child of #55); fees capped by post-conditions |
| 6 | Inscribe hall pack | wallet x 3 | same |
| 7 | Inscribe parent | wallet x 3 | Written with the pack ids; child of #55; depends on #3078, engine, hall |
| 8 | Verify release | none | Every new inscription read back byte for byte (type, size, hash, parents, dependencies); #3078 and the packs read from the chain and all 34 parts resolved as the parent does, each matching the pinned v1.4 source; xtrata.xyz serves the parent |
| 9 | Canary board | wallet | `set-board arcade-canary` with the parent as engine id |
| 10 | Submit | wallet | A real run (Swerve) under your address, stored, hash-checked, re-played from the chain bytes in v1.4 (skipped if your entry from an earlier launch is already as good) |
| 11-13 | Copycat | wallet, copycat | The stored replay from another wallet is refused with `(err u113)`; funds swept back |
| 14 | Close canary board | wallet | Test board disabled before the production boards move |
| 15 | Production boards | wallet x 3, then automatic | The temporary wallet is funded (about 0.6 STX), made contract owner, signs `set-board` for all 26 boards with the parent as engine id, hands ownership back and is swept. Top 10s and stored replays are kept |
| 16 | Audit | none | Every board and inscription re-read; lists the repo and site changes to make |

Cost on mainnet: three inscriptions, each in one transaction (`mint-single-tx-with-relationships`,
0.01 STX plus 0.001 STX per chunk, so about 0.02 STX each), so 3 wallet signatures for the
inscriptions and 3 for the boards (fund, hand ownership over, accept it back; the 26 board updates are signed
automatically), plus about 0.6 STX of network fees that is mostly spent on the board updates. Files over 32 chunks or a half-done
upload fall back to the staged route (begin, chunks, seal). Keep at least 4 STX free.

See `../CANARY-NOTES.md` for notes on writing canaries.

## After a launch

The audit step prints the ids. Then, in one commit:

- `recursive-apps/xtrata-arcade/parent/ids.json`: the `engine` and `hall` pack ids, as the
  record of the launch (the canary ignores pack ids and finds any
  pack that is already inscribed by its hash);
- `public/_redirects` (`/arcade`) and the homepage arcade tile: the parent id;
- `src/arcade-submit/arcade-boards.ts`: add the parent id to `ARCADE_INSCRIPTION_IDS` (the wallet
  dialog's arcade wording).

## Tests

```bash
NODE_PATH=<playwright + @stacks/transactions v6> CHROME_PATH=<chromium> \
  node canaries/arcade-launch/mock-chain-test.cjs
```

Runs every step against an in-memory chain that starts where mainnet is (leaderboard deployed,
boards on #3078, #3078 holding v1.3, #55 owned) with a stub Leather wallet that refuses `0x`
post-conditions and `sender`. Then boots the parent it inscribed from that chain (21 games, all
parts, no errors), and re-runs after "Forget local progress" to prove the release is found on
chain and nothing is sent twice.

## What this cannot cover

- Wallet signing was not exercised here (extensions need a real browser session).
- Step 10 uses a bot pilot, not a human run.
- Loading from the live gateway is only seen on mainnet: open the parent after the launch, in
  the grid, the preview and at `/i/<id>`, and play one run.

## Updating the production boards automatically

`set-board` only works for the leaderboard contract's owner, so a funded temporary wallet cannot sign it on
its own. Step 15 therefore does a short, resumable hand-over:

1. It saves the temporary wallet's key to a file and asks you to confirm.
2. Your wallet sends the temporary wallet enough for the fees (Xverse cannot sign a plain transfer from a
   page: the canary shows the address and amount, and waits for it to arrive).
3. Your wallet calls `propose-owner` for the temporary wallet, which calls `accept-owner`.
4. The temporary wallet signs every `set-board` itself, one after another, each confirmed before the next.
5. The temporary wallet calls `propose-owner` back to you; your wallet calls `accept-owner`.
6. Leftover funds are swept to your wallet.

Where it stands is read from the chain (`get-owner`, `get-pending-owner`), not from this page, so a reload,
a crash or a rejected signature resumes at the right place. If it stops while the temporary wallet owns the
contract, the step says so; press the step's button again or **Return ownership to my wallet**. Keep the
saved key file until the step reports ownership is back with you: v2 has no other admin.

## Catching up after an earlier session

A re-run recognises finished work from the chain: inscriptions are found by hash and re-used, and once the
canary board is closed on this parent the board, fund and copycat steps pass without sending anything.
