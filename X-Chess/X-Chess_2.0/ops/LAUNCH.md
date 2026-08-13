# Launch checklist

Nothing here is a formality. Every unchecked line is a reason not to inscribe.

An inscription is permanent and a deployed contract is immutable. There is no
patch, no rollback and no "we will fix that next week".

**Status: LAUNCHED 2026-08-09**, as Xtrata inscription 2988. Updated 2026-08-13.

The gates below that are still unchecked are the ones a SECOND inscription
should close, not reasons the first should not have happened. Read them that way.

---

## Gate 1 — Protocol frozen

- [x] `RULES-V1.md`, with golden vectors committed
- [x] `EVENTS-V1.md`
- [x] `REPLAY-V1.md`
- [x] `RANKED-V1.md`
- [x] `RATING-V1.md`
- [x] `SPONSORSHIP-V1.md`
- [x] `ARCHITECTURE.md`
- [x] ADRs for every decision that changed the brief

## Gate 2 — Correctness

- [x] engine passes deep perft (76 tests, ~590M nodes)
- [x] replay is total and deterministic under seeded fuzzing
- [x] canonical rule hashes have golden vectors
- [x] the Clarity codec matches the SDK byte for byte
- [x] contract passes Clarinet, including absence assertions
- [x] mock and contract agree (parity suite)
- [x] economic properties hold over long random operation sequences
- [x] sponsorship reserve is provably solvent
- [x] zero-STX flow works at the contract layer
- [x] `npm run verify` passes
- [x] legacy golden games replay identically, under the protocol they were played under

## Gate 3 — The application

- [x] wallet adapters implemented against the conformance suite
- [x] every screen: play, game, explore, leaderboard, profile
- [x] local cache, and the cache-destruction test
- [x] legacy adapter, labelled by contract version
- [x] chain READS against a live endpoint (all three legacy contracts, end to end)
- [ ] **chain WRITES against a live endpoint** (nothing has ever been signed)
- [x] endpoint independence, run against mainnet (`LIVE=1`)
- [ ] legacy games surfaced in the explorer
- [ ] sealed-game generation

## Gate 4 — The artefact

- [x] build produces a single self-contained HTML file (138,685 bytes)
- [x] exactly one unescaped `</script>` in the output
- [x] `dist/manifest.json` with reproducible provenance
- [x] `tests/artifact` reads `dist/`, not source
- [x] boots exactly once, even if the bundle itself runs twice
- [x] the built artefact contains no localhost and no server reference
- [x] `npm run release` refuses when any gate fails
- [ ] **one move is one wallet request**, proved against a real wallet
- [ ] the build is byte-reproducible from a clean checkout

## Gate 5 — The runtime

- [x] the injection sequence and `document.write` reproduced against the artefact
- [x] framed and unframed both behave correctly
- [x] the API base is chosen correctly under the runtime (proxy, never the public host)
- [x] the emulator serves the real runtime scripts from xtrata-2.0
- [ ] **the emulator run in a real browser**, not only jsdom
- [ ] recursion resolves against the live site

## Gate 6 — Wallets

- [ ] `harness/wallets/MATRIX.md` signed off against **this** build
- [ ] **row 4: a sponsored move, with the contract-principal post condition**
- [ ] Xverse desktop and mobile
- [ ] Leather desktop and mobile
- [ ] framed and unframed
- [ ] locked, absent, wrong network, cancelled

## Gate 7 — On chain

Driven by `dist/xchess-gates.html`, which gates each of these on the one before
it having been read back off chain.

- [x] the gates page exists, is built, and its gating is tested
- [ ] Clarinet simnet, then devnet
- [ ] testnet where applicable
- [ ] **mainnet canary contract**, clearly labelled
- [ ] on the canary: standard, sponsor-opponent, sponsor-both, zero-STX,
      exhaustion, top-up, expiry, settlement, treasury, ranked
- [ ] canary findings resolved
- [ ] **canary Xtrata inscription**, and the whole matrix run against it
- [ ] production contract deployed and recorded in `RELEASES.md`

## Gate 8 — The acceptance tests

- [ ] **§78.** A brand-new wallet with exactly 0 STX. A funded user opens a
      Sponsored Challenge naming it, from the permanent inscription. The
      contract sends the bootstrap. The empty wallet plays a whole game, each
      transaction paying its own network fee and receiving its rebate. Replay
      reconstructs exactly what counted. If ranked, the rating follows. **No
      server, database, private key, daemon, indexer or private API takes part
      at any point.**

- [ ] **§79.** Assume xchess.xyz, the team, GitHub and every X Chess machine are
      gone, and the browser cache is cleared. Given only the inscription, the
      contracts, the chain and the published protocol documents, an independent
      developer reconstructs games, history, positions, results, ranked
      eligibility and ratings.

---

## The rule

If a line is unchecked, the answer is no. Not "probably fine", not "we tested
something like it". The permanence is the product; a launch that skips a gate to
save a day spends that saving forever.
