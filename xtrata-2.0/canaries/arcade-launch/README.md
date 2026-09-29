# Xtrata Arcade launch canary

One self-contained page that takes the arcade from nothing to live, in the only safe
order, from your web wallet (Xverse or Leather). Each step unlocks only when the one
before it has passed, and each re-reads the chain rather than trusting the page. A reload
resumes waiting on a sent transaction, and re-running after "Forget local progress" resumes
from what the chain already holds (upload progress, inscription, boards).

Wallet connect and signing use the shared canary module (`../collection-v17/wallet.ts`,
the port of the X Chess v2 canary) and follow `docs/WALLET-PLAYBOOK.md`: providers found on
the top window, the chooser on every connect, the Xverse preflight order, no `sender` on
`stx_callContract`, abort on an account mismatch, deny mode, a 90s watchdog.

## Build

```bash
# 1. build the arcade for inscription (self-contained: no CDN, no font host, no dev keys)
#    then copy it to recursive-apps/xtrata-arcade/release/xtrata-arcade.html
# 2. pin its sha256 as PINNED_ARCADE in scripts/build-arcade-launch-canary.mjs
npm run build:canary:arcade-launch
```

Writes `canaries/build/arcade-launch-canary.html`. The build refuses to run unless both the
leaderboard contract and the arcade file match their pinned SHA-256, the arcade has no CDN
references, and `recursive-apps/xtrata-arcade/boards.json` holds 26 valid unique board ids.

## Run

Wallet extensions do not inject into `file://`, so serve it:

```bash
cd canaries/build && python3 -m http.server 8080
# open http://localhost:8080/arcade-launch-canary.html
```

| # | Step | Signs | What it proves |
|---|------|-------|----------------|
| 1 | Connect | wallet | The account you pick deploys, inscribes and owns the boards |
| 2 | Preflight | none | Both pins; arcade hashed the way the core hashes it; core open; fees quoted; real arcade run flown; balance; anything already done is detected |
| 3 | Deploy | wallet | `xtrata-arcade-scores-v2` at Clarity 4 (skipped if already there with the pinned source) |
| 4 | Verify contract | none | Source matches; you own it; not paused |
| 5 | Inscribe 1/3 begin | wallet | `begin-or-get` on `xtrata-v3-2-3`, fee capped by a post-condition |
| 6 | Inscribe 2/3 upload | wallet x ~8 | `add-chunk-batch`, 30 chunks each, resuming from the chain's own counter |
| 7 | Inscribe 3/3 seal | wallet | `seal-inscription`; the core refuses unless its running hash equals the declared hash |
| 8 | Verify inscription | none | Sealed, yours, `text/html`, right size; every chunk read back; SHA-256 equals the pin; xtrata.xyz serves the same bytes |
| 9 | Canary board | wallet | `set-board arcade-canary` with the inscription id as engine id |
| 10 | Submit | wallet | A real arcade run (Swerve), flown under your address, stored on chain, hash-checked, re-played from the chain bytes |
| 11-13 | Copycat | wallet, copycat | Same replay from another wallet is refused with `(err u113)`; funds swept back |
| 14 | Close canary board | wallet | Test board disabled before real boards exist |
| 15 | Production boards | wallet x 26 | `set-board` for all 26 boards with the inscription id (21 score, 5 time) |
| 16 | Audit | none | Every board and the inscription re-read; reports whether the xtrata.xyz submit page already lists the arcade boards |

Void and ban are already proven on chain by the `arcade-scores-v2` canary, so they are not
repeated here.

Cost on mainnet (about 3.8 MB, 239 chunks): inscription fee about 0.93 STX (begin 0.1 plus
seal about 0.83) plus network fees for the deploy, 8 upload transactions and about 35 small
calls. Keep at least 5 STX free. Uploading is slow and chunky: each batch is about 490 KB.

## What this cannot cover

- Wallet signing was not exercised here (extensions need a real browser session).
- Step 10 uses a bot pilot, not a human run.
- The xtrata.xyz `/arcade/submit` page still has to learn the arcade board ids
  (`ALLOWED_BOARDS` in `src/arcade-submit/core.ts`) and accept a replay for each; step 16 reports
  whether it does.
- The homepage tile must be pointed at the new inscription id after step 16.
