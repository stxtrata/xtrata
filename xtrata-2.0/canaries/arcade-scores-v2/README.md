# Arcade leaderboard v2 deployment canary

One self-contained page that deploys `xtrata-arcade-scores-v2` from your web
wallet (Xverse or Leather) and proves it works on chain before any player sees it.

Wallet connect and signing use the shared canary wallet module
(`../collection-v17/wallet.ts`, the port of the X Chess v2 canary). It follows
`docs/WALLET-PLAYBOOK.md`: providers found on the top window, the chooser on every
connect, the Xverse preflight order, no `sender` on `stx_callContract`, abort on an
account mismatch, deny mode, a 90s watchdog.

## Build

```bash
npm run build:canary:arcade-scores-v2
```

Writes `canaries/build/arcade-scores-v2-canary.html`. The build refuses to run if the
contract source is not the pinned SHA-256 in
`scripts/build-arcade-scores-v2-canary.mjs`, so the page can only deploy the reviewed
contract. If the contract changes on purpose, update the pin in the same commit.

## Run

Wallet extensions do not inject into `file://`, so serve it:

```bash
cd canaries/build && python3 -m http.server 8080
# open http://localhost:8080/arcade-scores-v2-canary.html
```

Pick the network (a testnet rehearsal first is cheap), then run the steps in order.
Each step unlocks when the one before it passes, and each re-reads the chain. A
reload resumes waiting on a sent transaction instead of sending it again.

| # | Step | Signs | What it proves |
|---|------|-------|----------------|
| 1 | Connect | wallet | The account you pick owns the contract |
| 2 | Preflight | — | Pinned source; the bundled engine flies and verifies a run bound to your address; the name is free; balance |
| 3 | Deploy | wallet | Deploys at Clarity 4 |
| 4 | Verify | — | Deployed source matches; you are owner; not paused; `current-period` reads |
| 5 | Canary board | wallet | `set-board canary` (higher wins, no fee) |
| 6 | Submit | wallet | Real run on chain; stored replay hashes match; re-played from chain bytes |
| 7 | Fund copycat | wallet | Sends 0.06 STX to a throwaway key kept in this browser |
| 8 | Copied run | copycat | Same replay from another wallet is refused with `(err u113)` |
| 9 | Sweep | copycat | Returns what is left to you |
| 10 | Void and bar | wallet ×2 | `void-entry` deletes the entry and replay and bars the wallet; `set-banned false` lifts it |
| 11 | Close | wallet | Disables the canary board |
| + | Production boards | wallet ×2 | After the game is inscribed: `astro3` and `astro3-daily` with its inscription id |

Cost on mainnet: one deploy plus about eight contract calls and the 0.06 STX copycat
float (about 0.03 STX of which pays the refused call's fee). Keep 2 STX free.

"Export report" downloads the run as JSON. Wallet stages log to the console as
`[wallet:connect]` and `[wallet:xverse-preflight]`; include them when reporting a
wallet problem.

## Verified

The built page was run end to end in Chromium against a Clarinet simnet: a mock
Leather provider (the public devnet `wallet_1` account) and simulated Hiro endpoints,
with no real wallet. All 11 required steps and the production step passed, and the
copied run was refused with `(err u113)`.
