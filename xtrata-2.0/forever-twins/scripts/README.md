# Scripts

## `measure-collection.mjs` (working)

Sizes a collection for Forever Twins: reads supply from the source contract, samples
the art its token URI points at, and reports total on-chain bytes, chunks per item,
and the Xtrata protocol fee for the whole collection.

```bash
node scripts/measure-collection.mjs SP2N959SER36FZ5QT1CX9BR63W3E8X35WQCMBYYWC.leo-cats --samples 20
```

Run it from the repo root so it can resolve `@stacks/transactions`. Accepts several
contract ids and `--json`. Results and method notes live in `../COLLECTION-SIZING.md`.

A collection whose art cannot be fetched prints `unreachable`, never a zero — a read
that failed and a read that returned nothing are different answers.

## Stubs (not yet implemented)

The helper contract source for `pepe-4ever-fakfun` is now copied into `../contracts-reference/rapha-fakfun/pepe-4ever-fakfun.clar`.

Confirmed helper read-only functions:

- `get-inscribed-count`
- `get-free-threshold`
- `get-fee`
- `fee-for`
- `get-binding`
- `is-inscribed`
- `get-canonical-hash`
- `is-finalized`
- `get-payouts`
- `get-owner`

Next step: implement these scripts against the Stacks API or Xtrata SDK.
