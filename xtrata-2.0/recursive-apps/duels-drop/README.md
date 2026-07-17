# XTRATA DUELS — first drop (fighters + weapons)

Deterministic generator for the free drop: 100 fighter PFPs + 100 weapon
relics as compact pixel-art SVGs (~1.5KB each). Same seed => byte-identical
files; every file's sha256 (the stat source on-chain) is recorded in
`out/manifest.json`.

## Commands

```bash
node generate.mjs --out ./out --seed 1        # regenerate the collection + manifest + preview.html + stat audit
node build-demo.mjs --in ./out --outfile ../../public/duels/demo/index.html  # rebuild the playable demo
```

The repo intentionally commits only `generate.mjs`, `build-demo.mjs`,
`out/manifest.json` and `out/preview.html` — the 200 SVGs regenerate
byte-identically from the generator and are verified against the manifest
hashes by `build-demo.mjs`.

## Seed-1 stat audit (what gets inscribed if we ship this batch)

- fighter PWR 0..99: full spread, avg 43.7
- weapon DMG 0..59: full spread, avg 31.6
- style bytes 28/30/22/20 across the four synergy classes

If a future batch audits badly (clumped stats, missing top-end), bump
`--seed` and regenerate BEFORE inscribing. Never regenerate after inscribing:
the art's bytes ARE the stats.

## Demo

`public/duels/demo/index.html` is fully self-contained (all 200 pieces +
their real hashes embedded) and playable offline: pick fighter/relic/twin,
fight a random rival, watch the seeded bout, see the exact contract
breakdown. The stat formula is parity-locked with
`xtrata-arcade-duels-v1.clar`.

The local-contract dress rehearsal lives at
`contracts/clarinet/tests/duels-e2e-demo.test.ts` (mints the pool with the
real manifest hashes, claims for two twins, duels, resolves, checks custody).
