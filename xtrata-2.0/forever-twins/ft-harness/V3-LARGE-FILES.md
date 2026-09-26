# Helper v3: large files (over 512 KB)

Decision D14 (25 Sep 2026). Status: reference prototype, simnet only, **not audited, not
authorised for deployment**.

## Why

`inscribe` mints each twin with the core's `mint-single-tx`, which takes at most 32 chunks of
16,384 bytes (512 KB). Real collections have bigger files: See Yourself Out has 12 of 100 over the
limit (up to 5.7 MB), Bitcoin Monkeys an estimated 12% (up to 1.4 MB). The core itself accepts up
to 2,048 chunks (32 MiB) through its multi-transaction upload, with the same rolling-hash check.

## What changed in `forever-twin-helper-v3.clar.tmpl`

| Change | Detail |
|---|---|
| Record size | `seed-canonical` accepts `total-size` up to `MAX-RECORD-BYTES` (33,554,432) instead of 524,288 |
| Bound entries are fixed | re-seeding a token that is already bound is refused (u215) |
| `large-unbound` | count of record entries over 512 KB not yet bound; kept exact across re-seeding; in `get-twin-interface` and `get-large-unbound` |
| `bind-preinscribed (token-id, xtrata-id)` | owner only, before finalisation. Requires: canonical entry, original exists and isn't in the helper, token not bound, the core inscription is sealed and its `final-hash`, `total-size`, `mime-type` and token-uri equal the record (u220 otherwise), and the caller holds it (u210). Moves the twin from the caller into custody in the same call, writes the same `Bindings` / `TwinToOriginal` entries as `inscribe`, increments `inscribed-count`, prints `inscribed` with `fee: u0` and `route: "preinscribed"`. No fee |
| `finalize-canonical` | refused (u221) while `large-unbound` > 0 |
| `inscribe` | refuses an entry over 512 KB (u220); unreachable after finalisation because such entries are all bound |
| Errors | u220 PREBIND-MISMATCH, u221 PREBIND-PENDING |

Nothing else changed: fee split, admin powers after finalisation (fee, rescue, handover), swaps,
G2 listing guard and custody read-outs are as before. A pre-inscribed twin is indistinguishable
from a sponsored one to swaps, rescue and the resolver.

## Owner procedure (per large file)

1. `begin-inscription(content-hash, mime, total-size, total-chunks)` on the core.
2. `add-chunk-batch(content-hash, chunks)` for each 32 chunks of the art file.
3. `seal-inscription(content-hash, token-uri)` with the record's token-uri; note the xtrata id.
4. `bind-preinscribed(token-id, xtrata-id)` on the helper.

`manifest/seed-plan.mjs` lists these steps per file (`preinscribe`), with args for begin and seal,
the chunk ranges per batch, and estimated core fees. Core fees per file at today's units: begin
0.1 + seal 0.1 + 0.001 per chunk of the first batch + 0.1 per extra batch (e.g. 5.7 MB: ~1.23 STX
over 13 transactions).

## Tests

- `sim/prebind-v3.mjs` (62 checks, G1 Bitcoin Monkeys and G2 See Yourself Out): large records
  and the 32 MiB cap, finalise gate, every bind refusal (non-owner, wrong bytes, wrong token-uri,
  no such inscription, twin held by someone else, twin of another token), bind into custody,
  fixed bound entries, bind after finalisation refused, sponsor inscription of small tokens with
  the 50/50 split, and swaps both ways on a pre-bound twin.
- Mutation checks: removing the hash check, the token-uri check or the finalise gate each makes
  the suite fail.
- `sim/manifest-pipeline.mjs` builds a manifest with a 700 KB token, follows the plan's
  pre-inscription steps in simnet, binds, and confirms the checker reports "not ready" before and
  "ready to finalise" after.
