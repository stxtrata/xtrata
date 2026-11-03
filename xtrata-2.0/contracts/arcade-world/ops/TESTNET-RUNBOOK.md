# Testnet runbook: arcade world

Status: **prepared, not run.** Nothing in this runbook has been done on any network. Each step that sends something needs Jim's go-ahead first.

Purpose: prove on a public test network, with test coins, that the same order of operations the dress rehearsal (`node ops/rehearsal.mjs`) runs on a simulated chain also works for real: deploy, set-up, scenes, posters, review lane, pause, revert.

## What this proves, and what it does not

Proves: the four contracts deploy and link on a real network; the tools' calls are accepted by the live node; the hall (pointed at the test contracts) reads them; timings in real blocks.
Does not prove: anything about the real Xtrata core (testnet uses a stand-in; the real core is covered by `npm run test:integration`), mainnet fees, or wallet-extension signing (these tools use a key file; the admin wallet flow is a separate manual check at release).

## Before you start (you)

1. Say **go** for the testnet rehearsal. Until then, nothing here runs.
2. Make a disposable key and fund it:
   `node ops/keygen.mjs --out ~/xa-testnet.key`, then request test STX for the address it prints from a testnet faucet. Do not use the admin wallet or any wallet you care about.
3. Optionally make a second disposable key for the publisher role (`keygen.mjs --out ~/xa-publisher.key`) and fund it a little.

Environment for the commands below (replace the address with your key's):
```
export ADMIN=ST...your-disposable-address...
export XA_WORLD=$ADMIN.xtrata-world-v1
export XA_POSTERS=$ADMIN.xtrata-posters-v1
cd xtrata-2.0/contracts/arcade-world && npm install
```
Every sending command below needs `XA_OPS_CONFIRM=broadcast-testnet` and `--key-file ~/xa-testnet.key` on top of `--execute`. Commands without `--execute` are dry runs and safe.

## Steps

Each step: dry run first, read it, then run with `--execute`. Stop at the first thing that does not match "expect".

| # | Command | Expect |
|---|---|---|
| 0 | `node ops/rehearsal.mjs` | `PASS`, 15 of 15 steps. If not, stop. |
| 1 | `node ops/deploy.mjs --network testnet --sender $ADMIN` | Lists 4 contracts in order with hashes. Nothing sent. |
| 2 | same with `--execute` | `mock-xtrata-core`, `xtrata-posters-v1`, `xtrata-world-v1`, `xtrata-door-skins-v1` each confirmed. Takes a few blocks each. A re-run skips what exists. |
| 3 | `node ops/setup-chain.mjs --network testnet --sender $ADMIN --publisher <publisher address>` | "to do: 23 look(s), 2 room(s), 2 publisher grant(s)". |
| 4 | same with `--execute` | 23 looks, 2 rooms, 2 grants. Re-run: nothing to do. |
| 5 | `node ops/validate.mjs ops/examples/launch-story.scene.json --network testnet` | Valid, no warnings, real look ids. |
| 6 | `node ops/preview.mjs ops/examples/launch-story.scene.json --network testnet` and open the page | The story in the hall, block by block. |
| 7 | `node ops/submit.mjs ops/examples/launch-story.scene.json --network testnet` | Dry run, writes calls to `ops/out/`. |
| 8 | same with `--execute` | 1 call sent, read-back OK. Re-run: nothing sent. |
| 9 | `node ops/readback.mjs --network testnet --room arcade-hall --file ops/examples/launch-story.scene.json` | `OK: all 4 scene(s) in the file are on chain`. |
| 10 | `node ops/view.mjs`, open the page, and watch bay 0 change as blocks pass (see "Looking at it" below). | Curtain, then locked door, then open door. |
| 11 | `node ops/campaign.mjs rotation ops/examples/week.items.json --network testnet --days 7 --out ops/out/week.poster.json` | 7 posters, absolute days. |
| 12 | `node ops/bot.mjs ops/out/week.poster.json --network testnet --sender <publisher>` | Dry run: "dry run: add-posters with 7 poster(s)". |
| 13 | same with `--execute --key-file ~/xa-publisher.key` | `sent 7`. Re-run: `nothing-to-do`. |
| 14 | Turn the review lane on (admin), run the bot with new posters, `node ops/review.mjs ...` lists them, release one with `--release ID --execute` | Waiting posters are hidden until released. |
| 15 | `node ops/skins.mjs --network testnet --world $WORLD --posters $POSTERS --skins $SKINS --sender $ADMIN`, then the same with `--execute --key-file ~/xa-admin.key` | "to do: 19 skin(s) to register", then 19 registered. Re-run: "to do: 0". |
| 15 | Drills: `touch ops/KILL` and run the bot with `--execute` | `REFUSED: kill switch is on`. Then `rm ops/KILL`. |
| 16 | `node ops/revert.mjs --network testnet --room arcade-hall --bay 0 --sender $ADMIN` then with `--execute` | Bay 0 shows posters again. |

## Looking at it

`node ops/view.mjs --world $XA_WORLD --posters $XA_POSTERS` writes a local page (`ops/out/testnet-view.html`) that shows the test contracts in the real hall. It is read-only and changes nothing in the hall: the hall's reader already takes its network from the score client's config, and the page sets that to testnet before the first read. Open it, press Walk in, and walk to the far-end bays. The hall's high-score reads on that page will find nothing on testnet; that is expected.

## If something goes wrong

- A call fails: the tool prints the contract's error in words (for example `u212: too many cover, sound or light layers`). Nothing else is sent after a failure.
- A transaction stays pending: the tool says so and stops; check the explorer before re-running (re-runs skip what is already on chain).
- Stop everything: `touch ops/KILL`. Pause a contract: `set-paused` as admin (from the explorer's contract-call page or the tools). Put a bay back: `revert.mjs`.
- Testnet resets happen. If the contracts vanish, re-run steps 2 to 4.

## What to report back

The rehearsal report (`ops/out/rehearsal-report.md`), the contract ids, the transaction ids for deploy, set-up and the story batch, any step that did not match "expect", and anything that took longer than expected.

## Not in this runbook (separate decisions)

Mainnet deployment, inscribing the new hall, pointing `/arcade` at it, and the admin-wallet signing flow. Each needs your explicit instruction.

## Relay through a browser

If the machine running the tools cannot reach the test network, sign here and send from a browser: `node ops/relay.mjs deploy --execute --key-file K --nonce 0`, paste the packed text into a browser page that can reach `api.testnet.hiro.so`, and run the small relay function over it (it POSTs each signed transaction and polls `/extended/v1/tx/{txid}`). Order and nonces: deploy 0..2, fund the publisher, setup, scenes, posters. Nothing in a pack can be changed after signing; a rejected transaction still uses its nonce, so continue from the next one.
