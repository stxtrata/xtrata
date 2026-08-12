# The plan

How to sequence the ten items from the first-tester feedback, what each depends
on, and what has to be decided before four of them can start at all.

Read [`01-FEEDBACK.md`](01-FEEDBACK.md) first for what the items are. The
proposals themselves are items 24 to 33 in [`../UPGRADES.md`](../UPGRADES.md).

---

## The constraint that shapes all of it

`dist/xchess.html` is 131,052 bytes. Xtrata uploads in 16,384-byte chunks and
`add-chunk-batch` takes 32 of them, so one transaction carries 524,288 bytes.
The artefact uses **8 of 32, with 393,236 bytes to spare.**

Items 24 to 29 are all inscription-side and together cost roughly **3.9 KB**.
They fit easily.

> **This section previously said the opposite.** It reported 290 bytes of
> headroom and made master proposal 2 a precondition for the whole batch. Eight
> chunks was never a limit — it is just what the artefact occupies. Nothing in
> this folder is gated on freeing bytes.

Master proposal 1 (the byte budget test) is still worth doing first, because it
is what makes any of these costs checkable rather than guessed. It is an
afternoon and it cannot break anything.

---

## Step 0 — done, 2026-08-12

`https://xtrata.xyz/i/2988?game=8` was opened in a browser. **It lands on Play,
and the Game tab says "no game loaded".**

The cause is not a defect. `openFromLink` reads `?game=` and the Xtrata handler
forwards the whole query string — but the function arrived on 2026-08-10 in
`bf8e8b01`, and **inscription 2988 was built on 2026-08-09**. The live board
predates the feature.

So item 27's deep-link half needs **no code**, only the next inscription. It is
now pinned by tests at both real URL shapes — `/i/<id>?game=<n>` and the runtime
address it is rewritten to — neither of which anything covered before.

What is left of item 27 is the part that was always the point: **getting back to
a game you have left**, which no link solves.

---

## Step 1 — the two defects, now

**Items 24 and 25.** Both are in the live inscription, both were found by real
players in one session, and both are small.

Neither can reach players without a new inscription, and a new inscription costs
money and splits the user base — so they should not be inscribed alone. They go
into the next batch. What "now" means here is: **fix them in the tree now, with
their regression tests, so that the next inscription carries them whenever it
happens.**

| | item 24, board colours | item 25, endpoint ratchet |
|---|---|---|
| change | one expression | one loop, plus an index reset |
| bytes | ~0 | ~0.2 KB |
| test | 6 assertions on square colour | 3 assertions in the existing endpoint suite |
| risk | visual, permanent, seen by everyone | it is the read path |

Do item 24 first. It is smaller, it is the more embarrassing of the two, and its
test is the kind that should have existed from the start.

---

## Step 2 — make the bytes countable

**Master proposal 1.** The byte budget test.

Nothing here waits on it, but it is an afternoon and it is what makes every byte
figure in this folder checkable rather than asserted. Do it before the batch, and
the estimates below become a command instead of an argument.

**Master proposal 2** (minify the shell CSS, −9.4 KB) can land whenever. It is
worth doing on its own terms and is not a dependency of anything.

---

## Step 3 — the navigation batch

**Items 26, 27, 28, 29**, in that order. Together they are the whole of "the
biggest quirk is finding the game once you've left the screen", which was the
testers' central complaint.

They are ordered by dependency and by how much each one teaches you about the
next:

1. **26, coordinates.** Self-contained, and it touches the board layout — so it
   should land alongside master proposal 10, which is already changing the board's
   sizing for landscape phones. Doing them separately means measuring the same
   layout twice.
2. **27, deep links and getting back.** After step 0 has told you what already
   works.
3. **28, Explore search and facts.** Builds directly on master proposal 14, which
   already computes who can play and whose turn it is and currently throws it
   away. **Do 14 and 28 as one piece of work** — 28 is largely the presentation
   of what 14 computes, and splitting them means touching `loadExplore` twice.
4. **29, which game am I in and is it my move elsewhere.** Last, because the
   cross-game watcher reads the game list that 28 has just made cheap, and because
   its polling has to be weighed against master proposals 7 and 19, which are both
   about not spending the request budget.

**Batch all of Step 1 and Step 3 into one inscription**, together with whichever
master-list items are ready. Rough budget:

```
today                                    131,052 bytes    8 of 32 chunks
items 24, 25                                 ~200
items 26, 27, 28, 29                       ~3,900
master proposals 7-16 (from the review)    ~4,400
                                          --------
                                         ~139,500 bytes    9 of 32 chunks
```

Comfortably one upload transaction, with or without proposal 2's 9.4 KB.

---

## Step 4 — the blocked four

**Items 30, 31, 32, 33** cannot start. Not because they are bad ideas — they are
the most interesting ideas in the feedback — but because each needs a decision
recorded first. Those are D1 to D5 in
[`05-DECISIONS.md`](05-DECISIONS.md).

The order in which the decisions are worth taking:

| decision | unblocks | why it is first or last |
|---|---|---|
| **D1** transport for words | 30 | Everything social waits on it, and it is the one that can quietly cost the project its serverless claim |
| **D4** how a wager knows who won | 31, and 32's pot | The hardest, and the one where building first would lose somebody real money |
| **D5** what a fast game gives up | 33 | Interacts with master proposal 22 (`time!`), so take them together |
| **D2, D3** permanence and moderation of public words | 30 | Follow from D1 |

**Item 32's free half need not wait.** Tournament standings are derivable from
the chain today with no contract change, because `ranked-v1` already decides what
counts and `elo-v1` already computes it. That half can be built whenever there is
room. Only the prize pool is blocked, on D4.

---

## What not to do

**Do not build wagers first because they are the most exciting.** The contract
cannot know who won. `claim-result` looks like the answer and is not — first
claim wins the slot and cannot be overwritten (`clar:621`), so wiring money to it
hands the pot to whoever claims fastest. See F14 in
[`01-FEEDBACK.md`](01-FEEDBACK.md).

**Do not ship a green "present" dot.** It would be a live status this system
cannot truthfully offer. Derived "last moved four hours ago" is honest and is
probably more useful in correspondence chess anyway.

**Do not inscribe items 24 and 25 on their own.** They are small and they are
real, and the urge to push a quick fix is exactly how a project ends up with two
inscriptions a fortnight and a split user base.

**Do not let items 26 to 29 grow just because there is room.** Each has an obvious
richer version — a full notification centre, a game history sidebar, saved
searches. The 3.9 KB estimate assumes the plain version of each. The constraint is
no longer the byte budget, it is that every byte is permanent and each of these is
meant to solve one stated complaint.

---

## Summary

| step | what | needs a decision | needs an inscription |
|---|---|---|---|
| 0 | Test `?game=8` in a browser | no | no |
| 1 | Items 24, 25 — the two defects | no | yes, batched |
| 2 | Master proposal 1 — make the bytes countable | no | no |
| 3 | Items 26, 27, 28, 29 — navigation | no | yes, same batch |
| 4 | Items 30–33 — social, wagers, tournaments, modes | **yes, D1–D5** | yes, and 31/33 need a new contract |

Steps 0 to 3 are ordinary work with no open questions in them, and none of it is
blocked by anything. That is most of what the testers asked for.
