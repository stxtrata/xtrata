# Helper v3

Template: `forever-twins/ft-harness/templates/forever-twin-helper-v3.clar.tmpl`
Renderer: `scripts/render-helper-v3.mjs` · Tests: `npm run test:v3`
Status: reference prototype. **Not audited. Not authorised for deployment.** Mainnet-fork runs
still required.

## Fixed at deploy (never changeable)

- Source collection and the Xtrata core
- `PAYEE-A` (Jim) and `PAYEE-B` (Rapha): each receives exactly half of every fee
- `MAX-FEE` (5 STX in the example configs)
- Whether rescue exists, and `RESCUE-DELAY` (432 Bitcoin blocks, about 3 days)

## Owner powers

Before finalisation: seed and finalise the canonical record.

After finalisation, exactly three things:

1. **Set the fee**: even amounts only, at most `MAX-FEE`. Starts at 1 STX (0.5 STX each).
2. **Rescue a stray**: only a token that should not be in the helper; proposal announced
   on-chain; executable after the delay.
3. **Hand over ownership**: `propose-ownership`, then `accept-ownership` from the new address;
   `cancel-ownership-proposal` withdraws it.

## What nobody can do

Pause or block swaps; change the record; move a paired token; change who is paid or the split.

## Fee behaviour

| Who inscribes | Pays |
|---|---|
| Anyone else | full fee, half to each payee |
| Jim or Rapha | only the other payee's half |

`fee-for(payer)` returns exactly what will be charged. Swaps are free. The inscription cost from
the core is separate and passed through.

## Changes from v2

Removed: free threshold, fee-recipient setter and exemption, pause (u211 retired), one-step
`transfer-ownership`. Added: fixed 50/50 payees, even-fee rule (u218), two-step ownership (u219),
interface version u3 with `fee`, `max-fee`, `payee-a`, `payee-b`, `pending-owner`.

## Test coverage

`family-suite-v3`: **453/453 in the real harness with the real `xtrata-v3-2-3` core** (25 Sep
2026; first written against a stand-in core, where it had 341 checks). Covers the family checks
on 12 real archived sources (Zombie Wabbits, Citadels, Funky Donuts, Blocks, Bitcoin Pepe, The
Guests, Bitslimes, Leo Cats, Tigress, Ordinal Pepe, Megapont Ape Club, Satoshibles), the
unsafe-listing control, the core's hash check through the helper (forged bytes u103, wrong
length u102, no fee taken), and V3-1 to V3-6 (payee pays half, fee rules, handover, cancel,
locked record, removed functions). Breaking the split, the even rule, `accept-ownership` or
`fee-for` each fails the suite (mutation checks from the sandbox run). Results:
`ft-harness/results/family-suite-v3.json`. Mainnet-fork runs still to do.
