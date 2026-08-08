# Releases

Every canary and every release candidate, with enough detail to reproduce it or
to work out what somebody was looking at when they reported a problem.

An entry is written when the artefact is BUILT, not when it is inscribed, so
that a build which never shipped still leaves a record of why.

---

## Format

```
### <version>  <date>

commit            <sha>
contract          <principal>.<name>          deployed in <tx>
html sha256       <64 hex>
bytes             <n>
manifest          replayHash / rulesHash / ratingHash / contractHash
inscription       <id>, or "not inscribed"
verify            <pass/fail>, <n> tests
wallet matrix     <n>/14 rows, signed by <who> on <date>
known limitations <the things a user would notice>
```

---

## 2.0.0-dev — 2026-08-08

The first build that exists. **Not a release candidate and not inscribable.**

```
commit            (working tree, uncommitted)
contract          SP000000000000000000002Q6VF78.xchess-core-v1   PLACEHOLDER, not deployed
html sha256       recorded in dist/manifest.json per build
bytes             ~68,000
inscription       not inscribed
verify            passing
wallet matrix     0/14 rows
```

**Why it is not a candidate.** `npm run release` refuses it, and correctly, on
four counts:

1. the contract is a placeholder that is not deployed anywhere
2. the version string still says `dev`
3. no wallet matrix row has been run
4. `ops/LAUNCH.md` has open items

**Known limitations, as of this build:**

- Nothing has ever been signed by a real wallet.
- Nothing has been read from a live endpoint; only the mock and simnet.
- The contract-principal post condition that every sponsored move depends on has
  never reached a wallet. Risk R1.
- The runtime emulator has been exercised under jsdom, not a real browser.
- Sealed-game generation is not implemented.
- The explorer does not yet surface legacy games, though the adapter exists.

**What this build does establish:**

- The engine is correct by perft (~590M nodes).
- Replay is total and deterministic under fuzzing, and honours the protocol a
  game committed to.
- The contract is solvent under property testing, and a zero-STX wallet plays a
  full game at the design fee with its bootstrap untouched.
- The artefact boots once, loads nothing, and carries no server reference.

---

## Before the next entry

A release candidate needs, at minimum:

- a real deployed contract, canary or production, named in the build
- a version that is not `dev`
- the wallet matrix signed against that exact build hash
- `ops/LAUNCH.md` with no open items

`npm run release` checks all four and refuses without them. It is not a
formality: an inscription is permanent and a contract is immutable, so the
expensive mistake is not a failed release, it is one that should have failed.
