# Launching the Music Hero awards on mainnet (guided, wallet-signed)

Page: `web/awards-launch.html` (in the site build; also under `npm run dev`). Rules: `src/lib/deploy/awards-launch.ts`.
Jim signs every step in Xverse as xtrata.btc. The page never sees a key and Claude never broadcasts.

## What the page does

It reads mainnet and shows 15 steps. Exactly one is "next". For that step it re-reads the chain, checks the connected
wallet is `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X` on mainnet, opens the wallet for that one transaction, waits for
it to confirm, then reads the chain again. A step turns green only when the chain shows the expected result:

| Steps | What is signed | What "verified" means |
| --- | --- | --- |
| 1-5 | `xtrata-v3-2-3.mint-single-tx` for each template in `public/awards/` (at most the quoted fee may leave) | the inscription exists under the file's hash and every chunk read back equals the file |
| 6 | deploy `xtrata-music-awards-v1-0` (0.49 STX fee) | on-chain source is identical to `contracts/live/xtrata-music-awards-v1.0.clar`, owner is xtrata.btc |
| 7-11 | `set-class` for drop 1, classes 1-5, caps 5 / 10 / 20 / 100 / 865 | `get-class` returns that template number and cap |
| 12 | `set-signer-hash` with the hash printed by `scripts/awards-signer-key.mjs` | `get-signer-hash` equals the hash entered |
| 13 | STX transfer to the contract (exact amount) | `get-balance` covers at least five records |
| 14 | nothing: server settings, then a redeploy | `/radio/awards/config` is on and names this contract and drop |
| 15 | nothing here: a real claim from a throwaway wall player | the contract shows a claimed record |

Anything wrong is a red STOP and locks everything after it: a template whose bytes differ, a contract of that name with
other source, a class with the wrong template or cap, a different signer, a server pointing elsewhere. The state comes
from the chain each time, so the page can be closed and reopened at any point.

## Two things found while building it (16 Nov 2026)

- **The contract is now Clarity 4.** Wallets publish at Clarity 4 whatever is asked (see the note at the top of
  `src/deploy-console.ts`), and the contract used `as-contract`, which Clarity 4 does not have: a wallet deploy would
  have failed and cost its fee. It now uses `as-contract?` with exact allowances (the core's quoted fee for the
  inscription; the one new inscription for the hand-over) and `current-contract`. Behaviour and error codes are
  unchanged: the 15 simulation tests pass at Clarity 4, and it was deployed and exercised on testnet (deploy published
  as Clarity 4, forged note refused, genuine claim, second claim refused, recover, withdraw: 9 of 9).
- **A record costs 0.011 STX on mainnet today, not 0.102.** The live core's single-transaction fee unit is lower than
  the contract source's default. The page reads the fee live; all 1,000 records would need about 11 STX.

## Not covered

The wallet popups themselves (first seen when Jim signs step 1), and whether the Cloudflare signer key matches the hash
set on chain: that is proven only by the first real claim, which is why it is the last step.
