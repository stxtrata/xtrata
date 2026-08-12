# How each item is proven

One section per item, in this project's idiom: which suite, what it asserts, and
— for the two defects — the assertion that **fails today**, which is the only
thing that proves a test is testing anything.

The existing harnesses do almost all of this. `tests/e2e/` already mounts the
real shell against a `MockChain` in jsdom (`tests/e2e/pending-move.test.ts:11-70`),
`tests/chain/endpoint.test.ts` already scripts fetches, and `tests/artifact/`
already reads the built file rather than the source.

---

## The rule this project already follows

> A test written after a fix, that has never been seen to fail, proves that the
> code compiles.

Both defects below have a "fails today" line. Run it before the fix. If it
passes, the test is wrong.

---

## Item 24 — board squares are the wrong colour

**Suite** `tests/ui/board-colour.test.ts` (new, ~20 lines)

Assert chess, not the code's arithmetic. The bug is that the arithmetic looks
reasonable, so a test that restates the arithmetic would have shipped the bug
alongside it.

```
a1 renders sq--dark        h1 renders sq--light
a8 renders sq--light       h8 renders sq--dark
d1 renders sq--light   <- the white queen's home square
d8 renders sq--dark    <- the black queen's home square
```

**Fails today:** all six.

Two more worth having, both cheap:

- **Flip invariance.** Render flipped and assert a1 is still `sq--dark`. Flipping
  the board turns it around; it does not repaint it. Nothing tests this either.
- **The built artefact.** In `tests/artifact/`, assert the shipped bundle contains
  no `(file + rank) % 2 === 0`. Cheap, and it catches the fix being reverted by a
  later refactor that "tidies" the expression.

**Not needed:** anything about pieces or positions. `tests/perft` covers that to
590 million nodes and this defect never touched it.

---

## Item 25 — endpoint failover never recovers

**Suite** `tests/chain/endpoint.test.ts` (existing — it already scripts `fetch`)

Three assertions:

1. **Falls forward.** Base 0 refuses, base 1 answers → the request succeeds and
   `ep.base` is base 1. *Passes today.*
2. **Comes back.** Base 0 then recovers → a later request is served by base 0.
   **Fails today** — it stays on base 1 forever.
3. **Wraps around.** Pinned to the last base, that base fails, bases 0 and 1 are
   healthy → the request **succeeds**. **Fails today** — it throws
   `CHAIN_UNAVAILABLE` having tried exactly one host.

Assertion 3 is the tester's bug. Write it first, watch it fail, then fix.

A fourth, for the `limited` flag noted at the end of
[`02-FINDINGS.md`](02-FINDINGS.md): a host that rate-limits by answering 503
rather than 429 should not be reported to the player as "the chain is
unreachable". Assert the error code distinguishes them where the evidence allows
it.

**Also** re-run `npm run test:artifact` after this one. The endpoint list is one
of the few things the Xtrata serve-time rewrite touches (master proposal 16), so
these two interact.

---

## Item 26 — board coordinates

**Suite** `tests/e2e/` for behaviour, the browser gate for appearance.

- Eight file labels and eight rank labels are present.
- **They flip.** With `flipped: true`, the bottom-left label reads `h` and the
  left column reads 1 at the top. A static label row that does not follow the
  board is worse than none.
- They are `aria-hidden`, because each square's accessible name already carries
  its own coordinate (`board.ts:187`) and a screen reader should not read the
  grid twice.

**Cannot be unit tested:** whether the labels fit on a landscape phone. That is
master proposal 18's browser gate, at 844×390 — and it is the reason this item
should land together with master proposal 10, which is already changing the
board's sizing for exactly that viewport.

---

## Item 27 — deep links and getting back to a game

**Manual, first and cheapest:** open `https://xtrata.xyz/i/2988?game=8` in a real
browser and record the result in this folder. That is step 0 of
[`03-PLAN.md`](03-PLAN.md).

**Suite** `tests/e2e/shared-link.test.ts` (existing), extended with:

- A board booted at the real runtime URL shape —
  `/runtime/?contractId=…&tokenId=2988&network=mainnet&game=8` — opens game 8.
  Every fixture in that file today uses a plain address, which is why master
  proposal 8's defect survived.
- Recent games persist across a remount and are capped.
- A recent-games entry survives the game being unreachable — a list that empties
  itself when the chain has a bad moment is a list that loses your games at the
  worst time.

**If the `2988-8` path form is built**, it is tested in `xtrata-2.0`, not here.
Different project, different suite, its own review.

---

## Item 28 — Explore search, filter, and a spectator's facts

**Suite** `tests/e2e/explore.test.ts` (new, or the one master proposal 14 adds —
they should be the same file)

- Filtering to *mine* with a connected address shows only games that address can
  play in, computed through `checkSender` and not a second copy of the rule.
- Searching a game number that falls outside the newest-25 window **finds it**,
  and says how it was found. The bound at `app.ts:2334` is real; a search that
  silently only searches the visible page is worse than no search.
- With no wallet connected, the *mine* filter is absent rather than empty.
- Sponsorship expiry renders as a duration and not a block height, and a
  sponsorship inside its last hour says so.

**Request budget:** extend `tests/e2e/request-budget.test.ts` to assert that
filtering and searching add **zero** chain reads over the existing explore burst.
Everything they need is already fetched. If that assertion is hard to make, the
feature has been built wrong.

---

## Item 29 — which game, and is it my move elsewhere

**Suite** `tests/e2e/` on the jsdom harness.

- `document.title` carries the game number and turn, and **changes when the turn
  changes**. Assert the change, not the initial value.
- The cross-game watcher reads only games the connected address is in.
- **It is silent when nothing changed.** Ten poll ticks with no new entry produce
  no sound and no title churn. This is the same anti-spam property master
  proposal 21 needs for its announcer, and it is the one most likely to be got
  wrong.
- With no wallet connected, the watcher does not run at all.

**Budget assertion, load-bearing:** watching N other games must not cost N full
game reads per tick. Assert the per-tick read count against a fixed ceiling with
4 games loaded. Master proposals 7 and 19 are both about not spending this
budget, and this item is the one thing in the feedback that wants to spend more
of it.

---

## Items 30 to 33 — the blocked four

**No test plan yet, deliberately.** Each is blocked on a decision in
[`05-DECISIONS.md`](05-DECISIONS.md), and the decision determines what there is
to test. Writing a test plan now would be inventing the design by the back door.

What can be said about each in advance:

**Item 30, chat and presence.** Whatever the transport, one property is
non-negotiable and should be written as a test before anything else: **the board
works with the message layer entirely absent.** Point it at nothing, or at a host
that refuses every request, and every existing test must still pass. That single
assertion is what keeps a chat feature from quietly making a server load-bearing,
and `harness/serverless-audit.mjs` is the mechanical half of it.

**Item 31, wagers.** The tests are adversarial before they are functional. The
first one to write, whatever the design: *a player who has lost claims the pot
first and does not get it.* If that test cannot be written, the design is not
finished.

**Item 32, tournaments.** The derived half is testable now, offline, against
frozen games — which is exactly what master proposal 6 builds. Standings computed
from a fixed set of real games must match a hand-checked table.

**Item 33, fast game mode.** Two properties carry it: the stacked hash over the
move list is reproducible by an independent reader, and **§79 still holds** —
given only the chain and the published documents, the whole game reconstructs. If
the second cannot be asserted, the mode is not compatible with this architecture
and that is worth discovering in a test rather than after inscribing.

---

## Before any of this reaches players

The full existing gate, unchanged:

```bash
npm run typecheck
npm test                    # 662 passing today
npm run test:clarity        # needs Clarinet
npm run build
npm run test:artifact       # reads dist/, not source
```

Plus, for anything touching the board's appearance — items 24, 26, and 29's title
work — a look through the runtime harness, because jsdom has no layout:

```bash
npm run serve:runtime -- --framed
```

And the chunk check from master proposal 1, which after that item exists is the
thing that tells you whether the batch still fits in eight chunks.
