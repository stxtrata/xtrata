# First-tester feedback: review, plan, implementation and testing

Feedback from **peacelovemusic.btc** and **3hunnatheartist.btc**, gathered during
game 8 on mainnet while that game was still in play. Received 2026-08-12.

This folder is the working record for that feedback: what was said, what it
turned out to be, what to do about it, in what order, and how each item is
proven. The proposals themselves live in the master list at
[`../UPGRADES.md`](../UPGRADES.md) as items **24 to 33**, so that there is one
list of outstanding work and not two.

---

## The documents

| file | what it is | read it when |
|---|---|---|
| [`01-FEEDBACK.md`](01-FEEDBACK.md) | The raw notes, itemised F1 to F15, each with what it actually turned out to be | You want to know what the testers said, in their words |
| [`02-FINDINGS.md`](02-FINDINGS.md) | The two confirmed defects, with reproductions you can run | You want to see the bugs demonstrated rather than asserted |
| [`03-PLAN.md`](03-PLAN.md) | Sequencing, batching into inscriptions, and what blocks what | You are deciding what to start |
| [`04-TESTING.md`](04-TESTING.md) | What proves each item, in this project's idiom | You are picking an item up |
| [`05-DECISIONS.md`](05-DECISIONS.md) | The six questions only the owner can answer | Four items cannot start until these are settled |

---

## The headline

**Two of the reports are real defects, both confirmed and reproduced.** Neither
was on anybody's list, and both are in the live inscription now.

**The queens are not on the wrong squares. Every square is the wrong colour.**
The testers reported the symptom accurately and reasoned to the nearest cause.
The real cause is one inverted expression in the board renderer, so a1 renders
light when it must be dark and h1 renders dark when it must be light. The pieces
are in exactly the right places — perft over 590 million nodes says so — but the
board underneath them is inverted, which makes the white queen on d1 appear to be
sitting on a dark square. Every chess player knows "light square on your right",
and this board gets that wrong. One expression, `packages/ui/board.ts:169`.

**The failed switch from game 8 to game 1 is a one-way ratchet in the endpoint
failover.** The board keeps three interchangeable chain hosts so that no single
company can take it down. Once it falls back from one to the next, it never
returns, and it never retries a host earlier in the list — so after two bad
moments it is pinned to the last host, and any wobble in *that* one reports
"could not reach any Stacks endpoint" while two healthy hosts sit untried. That
is precisely the message the tester saw. Reproduction in
[`02-FINDINGS.md`](02-FINDINGS.md).

**One ask needs no work at all and should be checked first.** The deep link to a
specific game may already exist: the Xtrata site forwards the whole query string
to the board (`xtrata-2.0/functions/inscription/handler.ts:60`), and the board
already reads `?game=`. So `https://xtrata.xyz/i/2988?game=8` ought to open game
8 today. Worth five minutes before anybody builds anything.

---

## Everything the testers raised, at a glance

Simplicity: 5 is an afternoon, 1 is a major project. Safety: 5 cannot break
anything live, 1 touches money, permanence or consensus.

| # | Item | Simp | Safe | Needs | Status |
|---|---|:---:|:---:|---|---|
| **24** | Board squares are the wrong colour | 5 | 4 | inscription | **Confirmed defect** |
| **25** | Endpoint failover never recovers | 4 | 4 | inscription | **Confirmed defect** |
| **26** | Board coordinates, a–h and 1–8 | 5 | 4 | inscription | Ready |
| **27** | Deep links, and getting back to a game | 4 | 4 | inscription | Ready, check the free half first |
| **28** | Explore: search, filter, and a spectator's facts | 3 | 4 | inscription | Ready, extends proposal 14 |
| **29** | Which game am I watching, and is it my move elsewhere | 3 | 4 | inscription | Ready |
| **30** | Chat, comments and presence | 2 | 2 | **a decision** | Blocked — D1, D2, D3 |
| **31** | Wagers, winner takes the pot | 1 | 1 | **a decision**, new contract | Blocked — D4 |
| **32** | Tournaments | 2 | 3 | part free, pot needs a contract | Partly ready, pot blocked on D4 |
| **33** | A faster game mode, inscribed at the end | 1 | 2 | **a decision**, new contract | Blocked — D5 |

**Items 26 to 29 are the ones to build.** They are the whole of the navigation
and discovery complaint, they are all inscription-side, and together they cost
about 3.9 KB — which does not fit in the 290 bytes of headroom the artefact has,
and does fit comfortably once proposal 2 frees its 9.4 KB. That dependency is the
main thing the plan turns on.

**Items 30 to 33 are the interesting ones and none of them can start yet.** Each
runs into the same wall from a different direction: the contract may filter, but
it may never adjudicate. A wager has to pay somebody, and the contract cannot
know who won. Chat needs somewhere to put words longer than five characters, and
the core contract's `submit` takes `(string-ascii 5)` — a message is not merely
awkward there, it is unrepresentable. These are not refusals. They are real
designs that need a decision recorded before code is written, which is what
[`05-DECISIONS.md`](05-DECISIONS.md) is for.

---

## What the testers got right that nobody had noticed

Worth saying plainly, because it argues for doing this again with more people:

- Both defects were found in ordinary play, and neither was visible to 662 tests,
  a 590-million-node perft run, or eight reviewers reading the source.
- The board-colour bug had survived every screenshot in `shots/`, because a
  reviewer reads a board for its pieces and a chess player reads it for its
  squares.
- "The biggest quirk is finding the game once you've left the screen" is a better
  summary of this application's UX problem than anything in the review, and it
  produced four of the ten items here.
