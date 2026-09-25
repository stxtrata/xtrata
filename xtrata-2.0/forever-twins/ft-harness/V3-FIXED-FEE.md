# Forever Twins helper v3: fixed 50/50 fee split, simple admin

`templates/forever-twin-helper-v3.clar.tmpl` supersedes v2 **for new deployments**. v2 and its
suites stay in place as evidence. v3 keeps everything that matters for holders (canonical record,
G1/G2 groups and the G2 listing guard, swaps that can never be paused, stray-only time-locked
rescue, the custody read-outs) and changes only the fee and admin model.

Status: reference prototype, simnet only, **not audited, not authorised for deployment**.
Mainnet-fork runs are still required before any deploy.

## What changed from v2

| Area | v2 | v3 |
|---|---|---|
| Fee recipient | one address, owner could change it | two payees fixed at deploy (`PAYEE-A`, `PAYEE-B`), no setter |
| Split | n/a | exactly 50/50; each payee gets `fee / 2` |
| Fee | owner sets, <= `MAX-FEE` | owner sets, <= `MAX-FEE` **and even** (u218 otherwise) |
| Starting fee | 0 | `initialFeeUstx` in the config (1 STX = 1000000) |
| Free threshold | yes | removed |
| Fee-recipient exemption | recipient paid nothing, but `fee-for` still quoted the fee | a payee pays only the other payee's half, and `fee-for` quotes exactly that |
| Pause | owner could pause inscribing | removed (u211 retired) |
| Ownership | one-step `transfer-ownership` | `propose-ownership` -> `accept-ownership` from the new address; `cancel-ownership-proposal` |
| Interface version | u2 | u3; `get-twin-interface` adds `fee`, `max-fee`, `payee-a`, `payee-b`, `pending-owner` |

After `finalize-canonical` the owner can do exactly three things: `set-fee`, the stray-only
rescue, and hand over ownership. Nobody can pause or block swaps, change the record, move a
paired token, or change who is paid.

The `Bindings` value tuple is unchanged, so resolvers built for v1/v2 keep working.

## Error codes added

| Code | Name | Meaning |
|---|---|---|
| u218 | FEE-ODD | `set-fee` with an odd amount |
| u219 | NO-PENDING-OWNER | accept or cancel with no proposal outstanding |

## Rendering

```bash
node scripts/render-helper-v3.mjs scripts/configs/<collection>.json contracts/out.clar
node scripts/render-helper-v3.mjs --example scripts/configs/mainnet-megapont-ape-club.v3.EXAMPLE.json
```

The renderer refuses: payees that are not valid **standard** principals, the same payee twice,
payees on a different network from the master contract, an odd `initialFeeUstx`, or an
`initialFeeUstx` above `maxFeeUstx`. The mainnet EXAMPLE configs carry `<JIM-PAYOUT-ADDRESS>` and
`<RAPHA-PAYOUT-ADDRESS>`; they only render with `--example`, and that output is deliberately not
valid Clarity, so it cannot be deployed by accident.

Choose payout addresses that are your own wallets with a backed-up seed phrase, never an
exchange deposit address. They can never be changed after deploy.

## Tests

`npm run test:v3` renders every simnet instance (`scripts/render-all-v3.mjs`, helpers `ft3-*`) and
runs `sim/family-suite-v3.mjs`: the G1/G2 family checks (F-1..F-6, F-L1, F-L2, F-L4) on every
prepared source with a v3 helper, plus:

- V3-1 a payee inscribing pays only the other half; `fee-for` matches exactly
- V3-2 `set-fee`: owner only, even only, capped; the new fee splits 50/50; a zero fee works
- V3-3 two-step handover: wrong acceptor refused, old owner powerless after, payees unchanged
- V3-4 a proposal can be cancelled and then cannot be accepted
- V3-5 seeding and finalising are refused after finalisation
- V3-6 the removed functions do not exist
