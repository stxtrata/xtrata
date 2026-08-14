# Inscribing a successive board

`ops/LAUNCH.md` is a checklist for launching the whole system: a production
contract, a first board, and every acceptance test behind both. It has twenty-two
open items and **most of them are not about this.**

This document is about the other thing, which is what actually happens now:
**a new board, against a contract that is already live and already carrying real
games.** Inscription 2988 went up on 2026-08-09 and has been played on since.

Written 2026-08-14.

---

## What is and is not changing

| | |
|---|---|
| the contract | `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1-canary` — **unchanged**, not redeployed, not migrated |
| the games | every game on it stays exactly as it is; nothing is replayed differently |
| the board | a new inscription, alongside 2988 rather than replacing it |
| 2988 | **stays live and stays broken.** An inscription cannot be edited or withdrawn |

That last row is the one to internalise. A new board does not fix the old one.
It gives people somewhere else to go, and `ops/ERRATA.md` stays the record of
what the old one does.

---

## What this costs if it is wrong

Cheap, and that is the whole reason the bar is lower than `LAUNCH.md`'s.

A bad board costs its inscription fee and is replaced by the next one. What it
cannot do is corrupt a game: the contract is not changing, replay is not changing
for any existing game, and every position on screen is derived from a log that
already exists.

**Except in one direction.** A board that reads a finished game DIFFERENTLY from
2988 would put two boards in disagreement about a result a real player already
has, and no inscription can be withdrawn to settle it. That is the one class of
change worth being slow about, and it is why `first-mover` is `replay-v2` rather
than an edit to v1.

---

## What this build carries that 2988 does not

Enough that it is worth reading before signing anything.

**The two defects the first testers found**, and neither has ever reached a
player: every square drawn the wrong colour, and an endpoint failover that never
came back. See `ops/ERRATA.md`.

**Eleven faults found by putting it in front of a person on a real wallet**, none
of which had a proposal because none was findable by reading. The runtime shim
that froze the tab, the connect timeouts, the disconnect that told nobody, the
game list built for nobody, gold text on a gold button. See
`ops/UPGRADES.md` → *What was built that this review never proposed*.

**Twelve proposals**, including the recovery bound that is consensus-visible
(ADR-0015), the runtime rewrite fix, and the byte budget that made all of it
measurable.

**One new rule.** `first-mover` — a seat that belongs to whoever plays it. It
commits a game to **replay-v2**, so 2988 meets such a game and says "unsupported
protocol" rather than misreading the keyword and skipping every move. No existing
game changes protocol.

---

## Before you build

**Pin the build time.** The artefact stamps itself, so two builds of identical
source disagree the moment they straddle a minute — and the wallet matrix signs
each row against `manifest.htmlSha256`.

```bash
SOURCE_DATE_EPOCH=$(date +%s) npm run build
```

Write that epoch down. Every rebuild from here to the inscription uses the same
one, or the evidence stops matching the artefact.

**Then do not rebuild.** `npm run verify` rebuilds as its last layer. Run verify
FIRST, then build, then gather evidence — in that order, or the matrix rows you
just earned by hand refer to an artefact that no longer exists.

---

## The order that actually works

```
1  npm run verify -- --deep        every machine gate, deep perft included
2  SOURCE_DATE_EPOCH=<n> npm run build
3  note manifest.htmlSha256        this is what everything below signs against
4  the wallet track                dist/xchess-gates.html?track=wallet
5  paste its RESULT block          into harness/wallets/MATRIX.md
6  npm run release                 refuses unless 1-5 all hold
7  inscribe                        dist/xchess-gates.html?track=inscribe
8  record it                       ops/RELEASES.md, and ops/ERRATA.md when it is wrong
```

Steps 4 and 5 are the ones that have never been done. They are now possible;
before 2026-08-14 there was no way to run them at all, and the gate was satisfied
by the *absence* of the words "not run".

---

## What is still unproven, and would be inscribed unproven

Said plainly, because the cost of inscribing something unproven is that it is
unproven forever.

**No wallet has ever signed anything from this build.** Fourteen matrix rows,
zero run. Row 4 — a sponsored move carrying the contract-principal post
condition — has never run anywhere, in any build, and it is the whole product.

**The board has never been driven in a real browser as a gate.** Every UI test
runs in jsdom, which has no layout, no computed styles and no wallet. Every
single one of the eleven faults above was found by a person clicking. That is
proposal 18 and it is not done.

**Nine legacy game results are hand-derived** (`tests/legacy/live-games.test.ts`),
and three of them show "rules unknown".

**The leaderboard walk still grows with the contract.** Affordable now, not
bounded — proposal 34, and windowing it is a decision about what a rating means.

---

## What would make me stop

Not a checklist. Three questions, and any "no" is worth a day rather than a
shrug:

1. **Does anything here change how an EXISTING game reads?** If yes, two boards
   now disagree about a result somebody already has, and neither can be
   withdrawn. `replay-v1` games must replay identically — `tests/legacy/` is the
   assertion, and it is the one that must never be relaxed.

2. **Has a wallet signed a move from THIS artefact?** Not from a similar one,
   not from the dev server. Signing is the one path with no test coverage that
   can be earned any other way.

3. **Is the hash in the matrix the hash of the file being inscribed?** They
   diverge silently, and the gate can only catch it if the build was pinned.
