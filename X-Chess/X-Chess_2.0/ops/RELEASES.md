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

## 2.0.0 — 2026-08-09  ·  **inscription 2988, live on mainnet**

Written retroactively on 2026-08-14. **This entry was missing**, which is the
worst gap a ledger of this kind can have: the one build that actually shipped was
the one with no record of what it was.

```
commit            (not recorded at the time)
contract          SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1-canary
html sha256       (not recorded at the time)
build hash        c2861564
bytes             123,062
inscription       2988   <https://xtrata.xyz/i/2988>
verify            passing at the time
wallet matrix     0/14 rows, unsigned
```

**Known limitations, all confirmed after it went up.** Every square drawn the
wrong colour; an endpoint failover that never recovers; a promotion that cannot
be cancelled and can fire a move that was abandoned; reduced motion inert; the
selection ring at 1.006:1 on light squares; Copy link producing a dead link from
the one page a player can sign on; a failed move vanishing without explanation;
a rules-recovery search anybody can freeze; the runtime rewrite eating the
primary chain host; and `?game=` deep links that do nothing, because
`openFromLink` was written the day after this was built.

Each is described, with what it costs and whether the tree still has it, in
`ops/ERRATA.md`. **An inscription cannot be corrected, so that list is the only
remedy this build will ever have.**

**What it does establish:** two people played real games on it, with real
transactions, from a permanent inscription against a live contract. Everything
above was found because of that.

---

## Before the next entry

A release candidate needs, at minimum:

- a real deployed contract, canary or production, named in the build
- a version that is not `dev`
- the wallet matrix signed against that exact build hash
- `ops/LAUNCH.md` with no open items

`npm run release` checks all four and refuses without them.

**Two of those have changed since this was written**, and both are worth knowing
before the next entry is attempted:

The matrix can now be RUN, at `dist/xchess-gates.html?track=wallet`, and the gate
reads evidence rather than the absence of the words "not run" — fourteen RESULT
lines carrying the build hash, the provider that served each call and a
transaction id. Editing the table no longer satisfies anything.

And the build is only reproducible if it is PINNED. It stamps itself with the
clock, so two builds of identical source disagree across a minute boundary, and
`verify` rebuilds as its last layer. Build with `SOURCE_DATE_EPOCH` set and do
not rebuild after gathering evidence, or every signed row refers to an artefact
that no longer exists. See `ops/INSCRIBING.md`. It is not a
formality: an inscription is permanent and a contract is immutable, so the
expensive mistake is not a failed release, it is one that should have failed.
