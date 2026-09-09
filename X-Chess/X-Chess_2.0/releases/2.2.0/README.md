# X Chess 2.2.0 — tested inscription candidate

**Inscribe `xchess.html` only.** It is the complete application. The other files are verification evidence.
This package has not been inscribed and no wallet transaction was signed.

- Build: 2.2.0 · 2026-09-07 21:20 UTC · #f9b2817e
- Contract: `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1-canary` on mainnet
- HTML: 254,748 bytes, 16 chunks (16,384 bytes each); within one 32-chunk batch.
- HTML SHA-256: `23774fd3f961b0d801d84555100b0b7e5facc3a43c4ed8e79b0b779c92ad88b6`
- Xtrata rolling chunk hash: `516ba635e5d70439c8543aa37454156e142225f6c9590168e4f4f9f2814aa7c1` — compare this with the inscription UI.
- Validation: 1,686 standard tests, 76 deep engine tests, 62 contract tests and 36 browser checks passed.
- Live verification: 130 ranked entries checked, 124 rated games; no doubled checkpoint prefix.

`verification.json` states scope and remaining manual checks. `tests.json`, `browser-report.json`,
`live-checks.json` and `logs/` hold the evidence. `source-fingerprint.json` records source-file hashes.
`build-config.json` and the repository's `npm run build:candidate` reproduce the bytes.
Real extension/mobile signing and a final on-chain smoke test remain separate manual checks.
