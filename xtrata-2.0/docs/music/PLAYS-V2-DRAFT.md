# Paid plays, version 2 (draft, testnet only)

`contracts/drafts/xtrata-radio-plays-v2.0.clar` · tests `contracts/clarinet/tests/xtrata-radio-plays-v2.0.test.ts`

Not live, not wired into the player. Version 1 (`contracts/live/xtrata-radio-plays-v1.0.clar`) is unchanged and stays in use.

## What it does

One transaction settles 1 to 10 plays. Each play is paid straight from the listener to the song's current holder.
The contract never holds money. Two settings, changed together by the owner (`set-settings rate batch`):

| Setting | Meaning | Starts at | Fixed limits |
|---|---|---|---|
| `rate` | microSTX the holder gets for each play | 50 (as version 1) | 50 to 1,000 |
| `batch` | most plays one transaction may settle | 1 (as version 1) | 1 to 10 |

The owner can change those two numbers and hand ownership on (`set-owner`), and nothing else.

## Two ways to call it

- `settle-packed (data (buff 68))`: rate (2 bytes) + receipt (16) + core (1) and song id (4) per play. Ten plays are
  274 bytes, so the transaction still fits the 0.0003 STX network fee a single play pays today. **This is the one the player would use.**
- `settle (plays (list 10 {core, id})) receipt agreed-rate`: the same thing written out. Easier to read in an
  explorer, but five plays are 472 bytes and the network refuses that below a 0.000472 STX fee.

Both go through the same code and share receipts.

## Rules

- The listener signs the rate. If the owner changed it since, nothing is paid (`u107`) and the player asks again.
- A receipt (one per settlement, per payer) works once (`u103`).
- More plays than the `batch` setting, or none: `u108`. Fewer is fine: a listener who stops early still pays.
- A play that cannot be paid is reported (`radio-play-skipped`) and skipped; the rest are paid. Reasons: no such song
  (`u104`), the listener holds it (`u105`), a contract holds it (`u106`). One song changing hands between the play and
  the settlement can therefore never block the others.
- Whoever holds the song when the settlement lands is paid.
- Unknown core `u101`, bad receipt `u102`, malformed packed data `u109`, called through another contract `u100`,
  not the owner `u110`, rate out of limits `u111`, batch out of limits `u112`.
- One `radio-paid-play` event per paid play (version 2, with the receipt and the play's place in the settlement), and
  running `get-total` / `get-earned` per song.

## What a play costs the listener

Network fee 300 per transaction in every row.

| Setting | Holder gets, per play | Listener pays, per play | Plays in a 50-play player today |
|---|---|---|---|
| Version 1 (now) | 50 | 350 | 50 |
| 5 plays at 290 | 290 | 350 | 50 |
| 5 plays at 300 | 300 | 360 | 48 |
| 10 plays at 320 | 320 | 350 | 50 |
| 10 plays at 500 | 500 | 530 | 32 |

## Proof

- Simulated: 24 tests, as Clarity 3 and as Clarity 4.
- Testnet (throwaway keys): 16 of 16 steps on `ST2TWXJXAMKPR1ECZCMJHNC932QBF78NVWJMCQRCV.plays-v2-gmex`.
  Five plays packed: 249 bytes, accepted at fee 300, artists received 900 and 600. Ten plays packed at 500: 274 bytes,
  accepted at fee 300, artists received 3,000 and 2,000. Five written out: refused at 300 (`FeeTooLow`, expected 472),
  accepted at 500.

## In the code so far

`src/lib/listening-wallet/settle.ts` (tested, imported by nothing yet): the packed format, the one transaction shape a
settlement may be (Deny mode, a ceiling of plays x rate), and the sums for plays left and amounts at any setting.
`SETTLE_CONTRACT` is `null` until a reviewed contract is on mainnet.

## Not done

- Nothing in the wallet box, the radio page, the award counting or the play statistics knows this contract.
- When a settlement is sent (every N plays, on pause, on closing) is a player decision that is not designed yet.
  Until a settlement lands, up to `batch - 1` plays are unpaid.
- Mainnet fee behaviour is only indicated by testnet: the size rule is the same, how quickly miners pick up a
  300 fee is not.
- No independent review of the contract.
