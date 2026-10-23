# Posting real scores on the testnet clone (what was done on 23-24 Oct 2026)

1. `record-runs.cjs <out.json> <wallets.json>`: plays the games headless in the built hall (Playwright, same set-up as `recursive-apps/xtrata-arcade/tests/hall-testgames.test.cjs`)
   as each wizard's wallet and writes real, replay-verified runs. (Edit the two `/home/claude/...` paths at the top to your checkout.)
2. `make-steps.mjs <dir>`: turns those runs into steps files (phases A to G) for `ops/relay-steps.mjs`.
3. Sign with `ops/relay-steps.mjs --execute --keys ~/.xa-testnet-wizards --steps steps-X.json --nonces name=N,...`, relay through a browser that can reach api.testnet.hiro.so.

Result: 20 accepted scores on 5 boards, Top-10 knock-out, own-score improvement, six deliberate refusals (u108 x2, u104 x2, u113, u102), and the pause (u101).
See project doc `testnet-clone-and-test-games.md`.
