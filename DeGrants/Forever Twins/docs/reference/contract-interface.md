# v3 helper interface

From `forever-twin-helper-v3.clar.tmpl`. G2-only items are marked.

## Public functions

| Function | Who | What it does |
|---|---|---|
| `seed-canonical (entries (list 100 {id, content-hash, mime, total-size, token-uri}))` | owner, before finalisation | Adds or overwrites record entries; rejects invalid entries (u215) |
| `finalize-canonical (manifest (buff 32)) (expected-count uint)` | owner, once | Locks the record; count must match (u209) |
| `inscribe (token-id uint) (chunks (list 32 (buff 16384)))` | anyone | Charges the fee split, pays the core's inscription cost, mints the twin into helper custody |
| `swap-original-for-twin (token-id uint)` | current holder of the original | Original into the helper, twin to the caller. Free. G2: refused if listed (u217) |
| `swap-twin-for-original (token-id uint)` | current holder of the twin | Twin into the helper, original to the caller. Free |
| `propose-rescue (token-id uint) (recipient principal)` | owner | Only for a stray; starts the delay |
| `bind-preinscribed (token-id uint) (xtrata-id uint)` | owner, before finalisation | For art over 512 KB: binds a twin the owner inscribed through the core's multi-transaction upload. Checks the core's hash, size, mime and token-uri against the record (u220), takes the twin from the caller into custody. No fee |
| `cancel-rescue (token-id uint)` | owner | Withdraws a proposed rescue |
| `execute-rescue (token-id uint)` | owner, after the delay | Returns the stray side to the recipient |
| `set-fee (new-fee uint)` | owner | Even, at most `MAX-FEE` |
| `propose-ownership (new-owner principal)` | owner | Step 1 of handover |
| `cancel-ownership-proposal` | owner | Withdraws the proposal |
| `accept-ownership` | proposed owner | Step 2; ownership changes |

## Read-only functions

| Function | Returns |
|---|---|
| `get-twin-interface` | interface-version, collection-key, master, source, source-asset, route, group, canonical-finalized, canonical-count, manifest-hash, inscribed-count, swaps-enabled, large-unbound, fee, max-fee, payee-a, payee-b, rescue-enabled, rescue-delay, owner, pending-owner |
| `get-binding (token-id)` | `{xtrata-id, content-hash, inscriber, xtrata-escrowed, at}` or none |
| `get-canonical (token-id)` | `{content-hash, mime, total-size, token-uri}` or none |
| `get-original-by-twin (xtrata-id)` | original token id or none |
| `get-custody-state (token-id)` | real owners of both sides, `consistent`, `stranded` |
| `stray-side (token-id)` | `"original"`, `"twin"` or none |
| `get-rescue (token-id)` | pending rescue or none |
| `is-source-listed (token-id)` | G2 only: whether the source reports a listing |
| `fee-for (payer)` | exact STX the payer will be charged in fees |
| `get-fee`, `get-payees`, `get-inscribed-count`, `is-finalized`, `get-owner`, `get-pending-owner`, `get-large-unbound` | as named |

## Events (print)

`canonical-finalized`, `inscribed` (includes `fee`; pre-inscribed twins add `route: "preinscribed"` and `fee: u0`), `swap-original-for-twin`,
`swap-twin-for-original`, `rescue-proposed`, `rescue-cancelled`, `rescue-executed`,
`fee-changed` (includes `per-payee`), `owner-proposed`, `owner-proposal-cancelled`,
`owner-changed`. Every event includes `collection`.
