# Upgrades, enhancements and extensions

A review of X Chess 2.0 as it stands on 2026-08-12, with thirty-three proposals
ordered by what they are worth against what they cost.

**Proposals 1 to 23** come from a review of the code. **Proposals 24 to 33** come
from the first testers, peacelovemusic.btc and 3hunnatheartist.btc, playing game 8
on mainnet — including two confirmed defects that the code review did not find.
Their full working record is in
[`ops/feedback-2026-08-12/`](feedback-2026-08-12/README.md).

Every claim here carries a `file:line`. Check them rather than believing them:
several proposals below exist because a comment in this repository states a rule
and the function underneath it breaks the rule.

---

## Contents

- [How this was produced](#how-this-was-produced)
- [The state of the tree as reviewed](#the-state-of-the-tree-as-reviewed)
- [Progress](#progress)
- [What was built that this review never proposed](#what-was-built-that-this-review-never-proposed)
- [The three constraints that price everything](#the-three-constraints-that-price-everything)
- [How to read each proposal](#how-to-read-each-proposal)
- [Everything, at a glance](#everything-at-a-glance)
- [Tier 1 — do these first](#tier-1--do-these-first)
- [Tier 2 — high value, more work](#tier-2--high-value-more-work)
- [Tier 3 — strategic, needs a decision](#tier-3--strategic-needs-a-decision)
- [Tier 4 — worth knowing about](#tier-4--worth-knowing-about)
- [Part two — from the first testers](#part-two--from-the-first-testers)
- [Tier 5 — found by using it, 2026-08-14](#tier-5--found-by-using-it-2026-08-14)
- [Suggested order of work](#suggested-order-of-work)

---

## How this was produced

Eight independent reviewers read the code along one dimension each: gameplay
UX, contract and protocol, performance and read economics, build and artefact,
accessibility and mobile, ops and documentation, growth and discovery, and
security. Each was given the six hard constraints and told that a proposal
violating one is worthless.

Every proposal was then handed to an adversarial verifier whose job was to
knock it down by reading the code — checking each cited line, and checking
`ops/DECISIONS.md` for an ADR that already rejected the idea.

Eighty-eight proposals were raised. None was killed outright: fifty-eight were
confirmed, and thirty were corrected as overstated and kept in their corrected
form. A completeness critic then looked for what nobody had covered, and a
synthesiser merged the survivors down to the twenty-three below and dropped the
marginal ones.

**Where a verifier corrected a reviewer, the corrected version is what appears
here.** Several corrections were load-bearing — see proposal 12, where the
described failure mode was wrong even though the defect was real.

---

## The state of the tree as reviewed

Measured, not quoted:

| | |
|---|---|
| commit | `c0dd8d8d` "Sounds for the people watching…", tree clean |
| `npx vitest run` | **662 passed, 16 skipped**, 95 s |
| `npm run typecheck` | clean |
| `dist/xchess.html` | **130,782 bytes** |
| `dist/xchess-gates.html` | 128,615 bytes |
| live inscription | 2988, 123,062 bytes, build hash `c2861564` |
| bound contract | `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1-canary` |

**That table is a record of the moment this review was written, and stays as
one.** Correcting it would falsify the thing it exists to be. Where the tree is
now, measured the same way on 2026-08-14:

| | |
|---|---|
| commit | `0b9eb2a8` "A finished game should not read like a live one" |
| `npx vitest run` | **839 passed, 17 skipped**, 93 s |
| `npm run typecheck` | clean |
| `dist/xchess.html` | **156,029 bytes** — 10 of 32 chunks, 368,259 to spare |
| `dist/xchess-gates.html` | 149,631 bytes |
| live inscription | 2988, 123,062 bytes, build hash `c2861564`, **unchanged** |

Two figures worth reading together. The artefact has grown 25,247 bytes since the
review — two chunks — and 177 tests have arrived with it. Nothing has reached a
player: **2988 is exactly what it was**, and everything below that says "needs an
inscription" still does.

The engineering here is unusually good, and the review reflects that: almost
nothing below is "you forgot to build X". Most of it is either a rule this
codebase states and then breaks in one place, or a cost that is invisible today
and permanent tomorrow.

**Every byte here is permanent, and until now nothing counted them.** Xtrata
uploads in 16,384-byte chunks, and `add-chunk-batch` takes
`(list 32 (buff 16384))` — so 32 chunks, 524,288 bytes, go up in a single
transaction. `dist/xchess.html` is 131,052 bytes.

```
8 of the 32 chunks in one upload transaction, 393,236 bytes to spare
```

**There is plenty of room. What there was not, was a way to know it.** The only
size gate permitted 250,000 bytes without comment, `verify` and `release` had no
byte gate at all, and the build printed the chunk count and formed no opinion.
Two features landed spending 1,620 bytes and nothing said so. That is why
proposal 1 comes first — not because the artefact is nearly full, but because
"about 0.4 KB" is meaningless until something has a denominator.

> **A correction worth reading, because it changed this document's ordering.**
> The first draft treated eight chunks as a ceiling and reported 290 bytes of
> headroom. That was wrong: eight is simply what the artefact occupies, and it
> was mistaken for a limit. The consequence was priority rather than code — it
> made proposal 2 look like a precondition for everything else, and made the
> navigation work in proposals 26 to 29 look blocked. Neither was true. The
> figure comes from the contract now, not from the current build.

---

## Progress

Updated 2026-08-12. Implemented proposals carry a **✅ Implemented** block naming
the commit, what was actually built, and what was learned doing it.

| # | Proposal | State | Commit |
|---|---|---|---|
| **1** | Price the artefact in Xtrata chunks | ✅ **Done** | `d420f699`, `749cc433` |
| **24** | Every square is the wrong colour | ✅ **Done** | `a893ea24` |
| **25** | The endpoint failover never comes back | ✅ **Done** | `fb7d2ced` |
| **26** | Coordinates around the board | ✅ **Done** | `cbeae473` |
| **27** | Deep links (the link half only) | ✅ **Already built**, pinned by tests | `bf8e8b01` |
| **4** | Reconcile ops/ with the chain | ✅ **Done** | `2a605bc4` |
| **6** | Freeze the nine live games | ✅ **Done** | `fc9c0993` |
| **7** | Stop the cold load overspending | ✅ **Done** | `489bdbe5` |
| **8** | Copy link survives its page | ✅ **Done** | `f45e0131` |
| **9** | A promotion you can back out of | ✅ **Done** | `e286dbcd` |
| **10** | Five stylesheet faults | ✅ **Done** | `cafacb6b` |
| **11** | Never guess a post condition | ✅ **Done** | `3a733c41` |
| **12** | Follow a move to its end | ✅ **Done** | `ca4af332` |
| **14** | The list says who can play | ✅ **Done** | `e418b97c` |
| **15** | Sound that survives a phone | ✅ **Done** | `b960247a` |
| **23** | Runbook and errata | ✅ **Done** | `25dc5ea3` |
| **13** | Bound the rules-recovery search | ✅ **Done** | `6eb7d0a0` |
| **16** | Keep a real host after the rewrite | ✅ **Done** | `784f70a9` |
| **28a** | Filter the game list | ✅ **Done** | `d2f5fe1c` |
| **28b** | Find a game outside the window | ✅ **Done** | `17ccc106` |
| **28e** | Sponsored filter | ✅ **Done** | `5cfbc568` |
| **19** | Tail reads (the cache half only) | ◐ **Half** | `7d95eee6` |

**Twenty-one of thirty-three built, plus one found already built, plus one
half.**

Every proposal scoring 4 or 5 on both simplicity and safety is done, and so are
the two rated 4/3 — proposals 13 and 16, both of which were actively wrong in the
live inscription and both consensus-visible, which is what held their safety
score down rather than any doubt about the fix.

Proposal 2 (minify, −9.4 KB) is deliberately deferred to keep the source readable
while this work continues. It has got MORE attractive rather than less: the
artefact has grown two chunks since this review, so the same saving now buys back
most of one. Both defects the testers found are fixed in the tree.
Neither reaches a player until the next inscription, which is deliberate: they
are small, and pushing a new inscription per fix is how a project ends up with a
split user base.

---

## What was built that this review never proposed

Between 2026-08-13 and 2026-08-14 the board was put in front of a person on a
real wallet for the first time. That found eleven things, none of which is a
proposal below, and several of which were more serious than anything that is.
Recorded here because a reader comparing the tree to this document otherwise
cannot account for the difference.

| what | where it was | commit |
|---|---|---|
| **The runtime shim answered "connect" by asking itself to connect** — an infinite loop of promise continuations that starved the microtask queue, so no timer in the tab ever fired again | `xtrata-2.0/public/runtime/wallet-shim.js` | `888b33af` |
| The connect timeout was a probe's patience, then a dialog's, and never both | `packages/wallet/connect.ts` | `94563203`, `754eba47` |
| The shim outranked every real wallet even with no bridge to forward to | `packages/wallet/providers.ts` | `b066f4ea` |
| Disconnect forgot the address locally and told nobody, so reconnecting read the old session straight back | `packages/wallet/connect.ts` | `5cfbc568` |
| Disconnect then took up to fifty-four seconds, sequentially | same | `0b9eb2a8` |
| A game list built before connecting was built for nobody, and advertised your own games back to you as open seats | `packages/ui/app.ts` | `7d5f947f` |
| "Yours" read whether you could act, not whether you were in the game | same | `7d5f947f` |
| Gold text on a gold button: every pressed filter lost its label under the cursor | `packages/ui/shell.ts` | `a80c6015` |
| `--line-2` used twice, defined nowhere, so every plain badge had no border | same | `0b9eb2a8` |
| "Send it anyway" held the move but not the game, so it could submit into a different one | `packages/ui/app.ts` | `46a78d8e` |
| A move declared a 0.1 STX ceiling it could never use, and the wallet read it out as a charge | `packages/chain/client.ts` | `46a78d8e` |

Two of those are worth generalising from.

**The wallet shim had no tests at all.** It is 29 KB, it decides whether any
inscribed application can reach a wallet, and it was the only substantial piece
of the runtime with no suite. The fault in it could not be found by a timeout,
because it had eaten the timers. That is the strongest argument this repository
has yet produced for **proposal 17**.

**Nothing here was findable by reading.** Every one was found by a person
clicking, and eight reviewers had already read the same code. **Proposal 18** is
the standing form of that lesson.

### And one feature

**A seat claimed by playing it** (`first-mover`, `46a78d8e`). Neither `anyone`
nor `anyone-else` ever locked a game to two people: the first is anybody on every
move, and the second excludes only a NAMED opponent. `first-mover` gives a colour
to whoever plays it and to nobody afterwards, on one side or both. It commits the
game to **replay-v2**, so inscription 2988 says "unsupported protocol" rather
than misreading the keyword as a principal and skipping every move.

---

**The free check is done.** `https://xtrata.xyz/i/2988?game=8` was opened in a
browser on 2026-08-12 and does **not** work — but only because inscription 2988
was built on 2026-08-09, the day before `openFromLink` was written. The code has
been right since; it has never been inscribed. Half of proposal 27 therefore
needs no work at all, and is now covered by regression tests at the real URL
shapes rather than the `example.test` fixtures that let it go unnoticed.

---

## The three constraints that price everything

Every proposal was checked against these, and each entry says how it complies.

**1. Permanence has a price per byte.** The shipped app is one HTML file that
loads nothing. Every byte is paid for once and kept forever. A feature that
costs 4 KB must be worth 4 KB in a hundred years.

**2. Inscription 2988 cannot be patched or repointed.** Anything marked
*new inscription* means a new id, new money, and a split user base — so those
proposals should be batched into one release, never shipped one at a time. The
proposals marked *neither* (docs, tooling, harness, tests, owner transactions)
are free of that constraint entirely, which is most of Tier 1 by design.

**3. The contract may filter, never adjudicate.** Not one proposal below teaches
the contract about chess. Proposal 22 adds a whole time-control feature with no
contract change at all, which is the `events-v1` design paying off a second
time.

---

## How to read each proposal

Every one of the twenty-three opens with **In plain terms** — what is actually
going on, what happens if it is left alone, what the change does, and what the
decision turns on. No file paths, no jargon. If you only read one part of a
proposal, read that one.

Everything after it is the evidence: the exact lines of code the claim rests on,
the implementation steps, the risks, and how to prove the change worked. That
half is written for whoever picks the work up.

**Simplicity** — 5 is an afternoon. 1 is a major project.

**Safety** — 5 cannot break anything live. 1 touches money, permanence or
consensus.

A proposal is *consensus-visible* when two boards running different versions
would disagree about a game. Those are the dangerous ones (13, 22), because
disagreement is permanent.

---

## Everything, at a glance

| # | Proposal | Simp | Safe | Bytes | Needs |
|---|---|:---:|:---:|---|---|
| **1** | ✅ [Price the artefact in Xtrata chunks](#1-price-the-artefact-in-xtrata-chunks-and-gate-on-the-boundary) | 5 | 5 | — | neither |
| **2** | [Minify the shell CSS and HTML](#2-minify-the-shell-css-and-strip-its-html-comments-at-build-time) | 3 | 3 | **−9.2 KB** | inscription |
| **3** | [Deterministic build, unstuck release gate, inscription ledger](#3-make-the-build-deterministic-unstick-the-release-gate-and-give-inscriptions-a-ledger) | 3 | 4 | — | neither |
| **4** | ✅ [Reconcile `ops/` with the chain](#4-reconcile-ops-with-what-is-actually-on-chain) | 4 | 5 | — | neither |
| **5** | [Restore the sponsorship constants](#5-restore-the-sponsorship-constants-and-stop-the-canary-breaking-them-again) | 4 | 3 | — | owner tx |
| **6** | ✅ [Freeze the nine live games as regression fixtures](#6-freeze-the-nine-live-mainnet-games-and-regression-test-them-offline) | 4 | 5 | — | neither |
| **7** | ✅ [Stop the cold load spending the whole allowance](#7-stop-the-cold-load-spending-the-whole-minutes-allowance) | 4 | 4 | ~0.4 KB | inscription |
| **8** | ✅ [Make Copy link survive the page it was copied from](#8-make-copy-link-survive-the-page-it-was-copied-from) | 4 | 4 | ~0.4 KB | inscription |
| **9** | ✅ [Make the promotion picker dismissable](#9-make-the-promotion-picker-dismissable-and-never-let-it-fire-a-stale-move) | 5 | 4 | ~0.3 KB | inscription |
| **10** | ✅ [Fix the shell CSS: motion, contrast, landscape, targets](#10-fix-the-shell-css-a-dead-reduced-motion-selector-a-10061-selection-ring-and-a-board-taller-than-a-landscape-phone) | 4 | 4 | ~0.4 KB | inscription |
| **11** | ✅ [Never write a post condition from a guess](#11-never-write-a-post-condition-from-a-guess) | 4 | 4 | ~net 0 | inscription |
| **12** | ✅ [Watch the transaction to its end](#12-watch-the-transaction-to-its-end-so-a-burned-fee-is-never-silent) | 4 | 5 | ~1.0 KB | inscription |
| **13** | ✅ [Bound the rules-recovery search](#13-bound-the-rules-recovery-search-which-a-hostile-log-can-turn-into-a-permanent-freeze) | 4 | 3 | ~0.3 KB | inscription |
| **14** | ✅ [Explorer rows that say who can play](#14-make-the-explorer-rows-say-who-can-play-and-whose-move-it-is) | 4 | 4 | ~0.9 KB | inscription |
| **15** | ✅ [Make the sound survive a phone](#15-make-the-sound-survive-a-phone) | 4 | 4 | ~0.4 KB | inscription |
| **16** | ✅ [Stop the runtime rewrite eating the primary fallback](#16-stop-the-runtimes-serve-time-rewrite-from-eating-the-boards-primary-public-fallback) | 4 | 3 | ~0.05 KB | inscription |
| **17** | [A wallet matrix runner](#17-a-wallet-matrix-runner-built-from-the-step-machinery-that-already-exists) | 3 | 4 | — | neither |
| **18** | [Run the artefact in a real browser as a gate](#18-run-the-built-artefact-in-a-real-browser-headless-as-a-gate) | 3 | 5 | — | neither |
| **19** | ◐ [Tail reads and a memoised leaderboard](#19-read-the-log-from-where-you-left-off-and-memoise-the-leaderboard-walk) — cache done, leaderboard not | 3 | 3 | ~1.0 KB | inscription |
| **20** | [PGN, FEN and sealed games](#20-make-a-finished-game-portable-pgn-fen-and-a-sealed-page) | 3 | 4 | ~1.1 KB | inscription |
| **21** | [A keyboard board, an announcer and game review](#21-a-keyboard-board-real-grid-semantics-an-announcer-and-game-review) | 3 | 3 | ~4 KB | inscription |
| **22** | [`time!` — end abandoned games](#22-time--end-abandoned-games-with-a-block-height-deadline) | 2 | 4 | ~2 KB | inscription |
| **23** | ✅ [Post-launch runbook and errata](#23-write-the-post-launch-runbook-and-a-permanent-errata-list) | 4 | 5 | — | neither |

**From the first testers** — see [`ops/feedback-2026-08-12/`](feedback-2026-08-12/README.md).

| # | Proposal | Simp | Safe | Bytes | Needs |
|---|---|:---:|:---:|---|---|
| **24** | ✅ [Every square is the wrong colour](#24-every-square-on-the-board-is-the-wrong-colour) **defect** | 5 | 4 | — | inscription |
| **25** | ✅ [The endpoint failover never comes back](#25-the-endpoint-failover-never-comes-back) **defect** | 4 | 4 | ~0.2 KB | inscription |
| **26** | ✅ [Coordinates around the board](#26-coordinates-around-the-board) | 5 | 4 | ~0.4 KB | inscription |
| **27** | [Deep links, and getting back to a game](#27-deep-links-to-a-game-and-getting-back-to-one) | 4 | 4 | ~0.8 KB | inscription |
| **28** | ◐ [Explore: search, filter, spectator facts](#28-explore-search-filter-and-the-facts-a-spectator-needs) — a, b and sponsored done; c, d and the expiry not | 3 | 4 | ~1.5 KB | inscription |
| **29** | [Which game am I in, is it my move elsewhere](#29-which-game-am-i-watching-and-is-it-my-move-somewhere-else) | 3 | 4 | ~1.2 KB | inscription |
| **30** | [Chat, comments and presence](#30-chat-comments-and-presence) | 2 | 2 | tbd | **decision** + contract |
| **31** | [Wagers, winner takes the pot](#31-wagers-winner-takes-the-pot) | 1 | 1 | tbd | **decision** + contract |
| **32** | [Tournaments](#32-tournaments) | 2 | 3 | tbd | pot needs **decision** |
| **33** | [A faster game mode](#33-a-faster-game-mode-inscribed-at-the-end) | 1 | 2 | tbd | **decision** + contract |

**Found by using it** — 2026-08-14, and see
[what was built that this review never proposed](#what-was-built-that-this-review-never-proposed).

| # | Proposal | Simp | Safe | Bytes | Needs |
|---|---|:---:|:---:|---|---|
| **34** | [Bound the leaderboard walk](#34-bound-the-leaderboard-walk-which-grows-without-limit) | 3 | 2 | ~0.5 KB | **decision** |
| **35** | [Make en passant reachable by the obvious click](#35-make-en-passant-reachable-by-the-obvious-click) | 4 | 5 | ~0.2 KB | inscription |
| **36** | [Say which game you are looking at](#36-say-which-game-you-are-looking-at) **incident** | 5 | 5 | ~0.3 KB | inscription |

**Eight of the thirty-three need no new inscription and no new contract** — 1, 3,
4, 5, 6, 17, 18 and 23. They are the cheapest and safest work in this document,
they include the only proposal scoring 5/5 on both axes, and none of them can
break anything that is live.

**Two are confirmed defects in the live inscription** — 24 and 25, both found by
testers in a single session of ordinary play, and neither visible to 662 tests, a
590-million-node perft run, or eight reviewers reading the source.

---

# Tier 1 — do these first

Everything here is either free of the permanence constraint, or is the thing
that makes the permanence constraint affordable.

---

## 1. Price the artefact in Xtrata chunks, and gate on the boundary

**Simplicity 5 · Safety 5 · Bytes none · Needs neither**

> ### ✅ Implemented — commit `d420f699`, amended by `749cc433`
>
> `tests/artifact/budget.test.ts` carries three assertions: the artefact fits in
> one upload transaction, a coarse per-package table gives a regression an
> address, and no package may reach the bundle without a budget row. The build
> prints `8/32 chunks in one upload transaction, 393,236 bytes to spare`, and
> `npm run release` refuses an extra chunk without `--allow-chunk`. ADR-0014.
>
> **Proven to fail first:** 1,200 bytes of dead CSS took the artefact to 132,572
> bytes and the suite named exactly that.
>
> **What it caught immediately:** proposal 25, the very next change, tipped the
> artefact over the budget as it then stood. That is what led to discovering the
> eight-chunk figure was wrong — so the gate found a real defect in its own
> premise within a day.

### In plain terms

Xtrata uploads in 16-kilobyte chunks, and thirty-two of them go up in one transaction.
Your page uses **8 of those 32**, so there is a great deal of room — but nothing in the
project could tell you that, or tell you when it changed.

The only size check permitted 250,000 bytes without comment, and neither the verify nor
the release gate looked at size at all. Two features landed spending 1,620 bytes between
them and nothing mentioned it.

This adds a test that fails if the artefact ever outgrows a single upload transaction, a
per-package table that says *where* bytes went when something grows, and a line on every
build showing what is left. It changes nothing a player sees.

**Why it is first:** every other idea in this document has a byte cost, and those costs
are meaningless without a denominator. This is what turns "about 0.4 KB" into an answer.
In practice the per-package rows are what will fire — they sit far below the transaction
limit, so a package that starts growing is caught while it is still surprising.

An afternoon's work, and it cannot break anything.

### The problem

`dist/xchess.html` is 131,052 bytes — 8 of the 32 chunks that fit in one
`add-chunk-batch` transaction, with 393,236 bytes to spare. There is room. What
there was no way to do is *notice*, because nothing measured or asserted it:

- `tests/artifact/artifact.test.ts:154` is `toBeLessThan(250_000)`, which permits sixteen chunks
- `harness/verify.mjs:25-77` has no byte gate
- `harness/release.mjs:74-116` has no byte gate
- `packages/build/build.mjs:360` prints the chunk count and forms no opinion

The precedent for doing this properly already exists for exactly one module:
`tests/artifact/sounds.test.ts:29` sets `BUDGET = 16_000` and fails on an esbuild
metafile sum.

### The proposal

Make the chunk the unit of account.

Write `tests/artifact/budget.test.ts` in the voice of `sounds.test.ts`: one
metafile build, a committed coarse per-package ceiling table, one assertion per
row naming module, bytes and ceiling. Replace the 250,000 line with
`expect(manifest.xtrataChunks).toBe(8)` — the boundary is what costs money.
Print bytes, chunks and bytes-to-next-chunk in the build summary. Refuse a
release whose chunk count rose, unless `--allow-chunk` and an ADR.

### Why it is worth doing

Every inscription-side proposal in this document becomes decidable. Today
"~0.4 KB" has no denominator; afterwards it is an answer, and usually the answer
is "that fits comfortably".

It also catches what just happened: two features landed, 1,620 bytes went, and
nothing said so. And it caught the very next change made after it landed —
proposal 25 tipped the artefact over the budget as it then stood, by name and
figure, which is exactly the job.

### Steps

1. Write `tests/artifact/budget.test.ts`, reusing the metafile measurement at
   `tests/artifact/sounds.test.ts:96-117`, with a `BUDGETS` table seeded from a
   measured run (`app.ts` ~36,054, `shell.ts` ~24,659, `chain/client.ts` ~6,845,
   sounds group ~13,596) and a comment naming the commit it was measured on.
2. Replace `tests/artifact/artifact.test.ts:154` with a chunk-count assertion
   whose failure message states ceiling and headroom.
3. Extend the summary near `packages/build/build.mjs:360` to print bytes, chunks
   and bytes-to-next-chunk for both artefacts.
4. Add a `chunks` field to the release record and a refusal in
   `harness/release.mjs` after `:77-88`, guarded by `--allow-chunk`.
5. Write the ADR fixing the unit of account, and correct the sound commit's
   recorded 12,847 to the measured 13,596.

**Files** `tests/artifact/budget.test.ts` · `tests/artifact/artifact.test.ts` ·
`packages/build/build.mjs` · `harness/release.mjs` · `ops/DECISIONS.md`

### Risks

A per-package table is a table somebody raises rather than obeys. Seed it from
measurement not aspiration, keep rows coarse so refactors do not churn it, and
put the review pressure on the chunk assertion — a single number with a price,
needing a flag and an ADR to move.

### How to prove it

The test is the deliverable, so prove it fails: add 900 bytes of dead string to
`packages/ui/shell.ts`, rebuild, confirm both the shell row and the chunk
assertion go red naming true figures. Remove, confirm green.

---

## 2. Minify the shell CSS and strip its HTML comments at build time

**Simplicity 3 · Safety 3 · Bytes −9,418 measured · Needs a new inscription**

> **Not blocking.** An earlier draft of this document treated this proposal as a
> precondition for everything else, on the mistaken belief that the artefact had
> 290 bytes of headroom. It has 393,236. This is worth doing because 9.4 KB of
> permanent weight is worth removing on its own terms, not because anything is
> waiting on it.

### In plain terms

Your stylesheet and page skeleton are being inscribed on Xtrata with every space,
indent and explanatory comment still in them. The build does have a minifier, but it
only compacts code, and these are stored as text, so it walks straight past them.

Squeezing them out saves **9.4 KB forever** and changes nothing on screen. That is more
than the entire sound system weighs.

**Why it matters beyond the saving:** it is the only change here that makes the artefact
*smaller*, and every permanent byte removed is removed forever. It is not urgent — there
is room for everything in this document several times over — but 9.4 KB of indentation
and prose comments inscribed for eternity is a poor use of the space.

**The catch:** the stylesheet has a piece of generated code spliced into the middle of
it. Split the file in the wrong place and every chess piece silently renders at the wrong
size. That is a known trap with a known guard, not a reason to avoid the change.

### The problem

`packages/ui/shell.ts:18` is `export const CSS = ` (14,236 source bytes) and
`:319` is `export const HTML = ` (9,882). Both are template literals, so
`minify: true` at `packages/build/build.mjs:149` does nothing to their contents:
esbuild minifies JavaScript, not the strings inside it.

The raw bytes ship. `dist/xchess.html` contains `  --bg: #12100e;` with its
two-space indent verbatim, and every explanatory prose comment in that CSS is
inscribed on Xtrata.

Measured against the resolved esbuild 0.25.12:

| | source | after | saved |
|---|---:|---:|---:|
| CSS through `transform(loader:'css', minify:true)` | 14,236 | 7,340 | 6,896 |
| HTML comment and leading-indent strip | 9,882 | 7,360 | 2,522 |
| | | | **9,418** |

7.2% of a permanent artefact, for no behaviour change. No ADR covers
minification.

### The proposal

Move both literals into `packages/ui/shell.css` and `shell.html`, and add an
esbuild plugin in `build.mjs` loading them as `text` after transforming: CSS
through `esbuild.transform(loader:'css', minify:true)` so a stray brace fails the
build, HTML through a narrow comment-and-leading-indent strip only. The prose
comments stay in source where a developer reads them and stop being inscribed.

> **The trap.** `shell.ts:1` imports `SCALE_CSS` and `shell.ts:165` interpolates
> it *inside* the CSS literal. The file must split at that point — two text
> imports concatenated around `SCALE_CSS`, or a placeholder the plugin
> substitutes — or every per-piece font-size rule from `packages/ui/pieces.ts:87`
> silently vanishes and pieces render at default size.

### Why it is worth doing

9,418 fewer permanent bytes — larger than the entire sound subsystem, for no
change on screen at all. `dist/xchess-gates.html` shrinks too, since `packages/ui/canary.ts:25`
imports `CSS` as `APP_CSS` and `:89` rebuilds `CANARY_CSS` from it.

### Steps

1. Create `packages/ui/shell.css` and `shell.html`, splitting `shell.css` at the
   `SCALE_CSS` interpolation point (`shell.ts:165`).
2. Rewrite `shell.ts` to import the text and re-export `CSS` and `HTML` under
   the existing names, so `boot.ts` `mountShell` and `canary.ts:25` are untouched.
3. Add a `shellAssets()` plugin to the plugins array of `bundle()` in
   `packages/build/build.mjs` (currently absent, ~line 143).
4. Add `declare module '*.css'` / `'*.html'` shims so `tsc --noEmit` passes, and
   register the same plugin in `vitest.config.ts`.
5. Assert in `tests/artifact/artifact.test.ts` that the built HTML does **not**
   contain `NOTE: no backticks` and **does** contain a `.pc--wk { font-size:`
   rule. The second is the guard against the `SCALE_CSS` trap.

**Files** `packages/ui/shell.ts` · `shell.css` · `shell.html` ·
`packages/build/build.mjs` · `vitest.config.ts` · `tsconfig.json` ·
`tests/artifact/artifact.test.ts`

### Risks

CSS minification can rewrite shorthands and colour notations, and the board's
layout is grid-and-aspect-ratio sensitive — a subtle regression here is
permanent. The HTML transform must collapse leading indentation only, never all
whitespace runs. Making text imports resolve under esbuild *and* tsc *and*
vitest is three configs, not one plugin.

### How to prove it

`npm run build`, then `npx vitest run tests/artifact tests/runtime tests/ui`.
Tighten the size assertion to the chunk gate from proposal 1. Then
`npm run serve:runtime -- --framed` and compare the board side by side against
the current build.

---

## 3. Make the build deterministic, unstick the release gate, and give inscriptions a ledger

**Simplicity 3 · Safety 4 · Bytes none · Needs neither**

### In plain terms

Three related problems with how releases are made.

First, the build stamps the current clock time into the page, so building the same code
twice produces two different files. That means you can never prove that what is
inscribed was built from what is in the repository. Your own checklist asks for exactly
that proof and cannot ever tick it.

Second, the safety check that is supposed to refuse a bad release can never pass. It
demands a human signature on a file that it only creates after the signature would have
had to be given. Nobody noticed because other refusals fire first.

Third, nothing records what was actually inscribed. The built files are not kept, and
inscription 2988's exact bytes now exist nowhere.

**The decision:** keep the clock for everyday builds — it is genuinely useful for telling
a stale browser tab from a fresh one — and make releases use a fixed timestamp instead.
Then start a simple ledger of what was inscribed and when.

**Be realistic:** 2988 can never be reproduced after the fact. The ledger records its
fingerprints; it cannot prove them. This is about the next one.

### The problem

Three linked defects.

**(a) The build is not reproducible, by construction.** `build.mjs:81` bakes
`new Date().toISOString()` into the page config at `:252`, so two builds of an
identical tree differ. `ops/LAUNCH.md:59` ("the build is byte-reproducible from a
clean checkout") is unclosable — while `LAUNCH.md:53` ticks "manifest.json with
reproducible provenance" as done, which the wall clock makes false.

**(b) The release gate deadlocks.** `release.mjs:51` rebuilds, `:70-72` hashes
what it just built, and `:106-108` refuses unless `harness/wallets/MATRIX.md`
already carries that hash — a hash no human could have signed against.
`npm run release` is structurally unpassable. Four other refusals fire first, so
nobody has noticed.

**(c) No provenance and no record.** `grep -c commit dist/manifest.json` is 0
while `ops/RELEASES.md:16` requires it. `.gitignore:3` ignores `dist`, so
inscription 2988's bytes exist nowhere. And
`tests/artifact/xtrata-hash.test.ts:47` is
`expect(chain(known,16384)).toBe(chain(known,16384))` under a test named "agrees
with the value Xtrata displayed for the FIRST inscription" — a tautology
asserting nothing about the recorded vector four lines above it.

### The proposal

Keep wall-clock `BUILT` as the default for `npm run build` — `build.mjs:73-80`
explains it exists so a stale tab is distinguishable from a fresh one — and make
the reproducible timestamp an explicit release input (`--built` /
`SOURCE_DATE_EPOCH`) that `release.mjs` always passes. It already forwards
`process.argv.slice(2)` at `:51`, so no new plumbing.

Add `commit`, `treeClean`, `targetSource` (`argument` | `remembered` |
`placeholder`) and `esbuildVersion` to the manifest, and **refuse a release whose
`targetSource` is not `argument`**. The most expensive irreversible decision in
the project should not be inherited from the gitignored
`.xchess-build-target.json`.

Extract `release.mjs:60-116` into a pure `harness/gates.mjs`
`refusalsFor({html, manifest, matrix, launch})` and test it. Add
`ops/INSCRIPTIONS.md`, append-only, and backfill 2988.

### Why it is worth doing

The one gate standing between this project and a wrong permanent artefact
becomes capable of returning success, and tamper-evident: today a MATRIX row
saying `pending`, or an indented LAUNCH bullet, silently disarms two bare regexes
(`release.mjs:100`, `:114`). And the next inscription becomes reproducible from a
commit, which is the only real answer to "is the thing on Xtrata the thing in
this repo".

### Steps

1. Add `resolveBuiltAt()` to `build.mjs`: `--built` wins, else
   `SOURCE_DATE_EPOCH`, else wall clock. Never throw when git is absent.
2. Add `gitProvenance()` and put `commit`, `treeClean`, `targetSource` and
   `esbuildVersion` into the manifest at `build.mjs:306-332`.
3. Have `harness/release.mjs` pass `--built`, and add the `targetSource` refusal.
4. Move `release.mjs:60-116` into `harness/gates.mjs` as a pure `refusalsFor()`,
   and add `tests/harness/release-gate.test.ts` driving every refusal over
   fixture strings, including the tamper cases.
5. Create `ops/INSCRIPTIONS.md` and backfill the 2988 row (2.0.0, 2026-08-09,
   123,062 bytes, build hash `c2861564`), recording honestly that it cannot be
   reproduced retroactively.
6. Rewrite the tautological assertion at `tests/artifact/xtrata-hash.test.ts:47`,
   and add `tests/artifact/reproducible.test.ts` building twice at a fixed
   `--built` into temp dirs.

**Files** `packages/build/build.mjs` · `harness/release.mjs` ·
`harness/gates.mjs` · `tests/harness/release-gate.test.ts` ·
`tests/artifact/reproducible.test.ts` · `tests/artifact/xtrata-hash.test.ts` ·
`ops/INSCRIPTIONS.md` · `ops/LAUNCH.md` · `ops/RELEASES.md`

### Risks

Reproducibility decays: a transitive dependency or a Node change breaks byte
equality months later and produces a confusing red gate. Record `nodeVersion` and
`esbuildVersion`, and treat a failure as "investigate and record why", never by
weakening the check.

**Note plainly: 2988 can never be reproduced retroactively.** No commit was
recorded, `dist` was never tracked, and the tree has moved — 123,062 bytes at
`c2861564` then, 130,782 now. The ledger records its hashes; it cannot prove them.

### How to prove it

`tests/harness/release-gate.test.ts` must return a non-empty refusal array for a
matrix whose state column reads `pending`, which today's regex passes clean.
`tests/artifact/reproducible.test.ts` builds twice into two temp dirs and asserts
identical sha256.

---

## 4. Reconcile `ops/` with what is actually on chain

**Simplicity 4 · Safety 5 · Bytes none · Needs neither**

> ### ✅ Implemented — commit `2a605bc4`
>
> Nine claims corrected against the manifest and the suite, and STATUS.md's fossil Not-started block replaced. The lasting part is harness/docs-audit.mjs, a layer-1 verify gate checking only what a machine can: byte figures against the manifest, test counts against each other, every suite in the README, and the specific "must not be inscribed" contradiction. Two false positives were designed out rather than tolerated.

### In plain terms

Your two most authoritative documents currently tell a new reader that the
application does not exist and **must not be inscribed** — while it is live on
mainnet with 80 real moves played on it.

They also contradict themselves internally. One file says a risk is closed and, forty
lines later, says the same thing never happened. The file sizes quoted are half what they
actually are. The test count is wrong in three different places, three different ways.
One section of the README describes a design that was tried and reversed.

**Why this is worth real time:** the concrete cost is somebody arriving, reading that
nothing has been proven with a real wallet, and redoing weeks of work that is already
done. Or worse, reading that a dangerous piece of the system is unproven and being unable
to tell whether it is.

**The good news:** you do not need to go back to the chain to fix it. The evidence is
already written down in your own decision records, which list sixteen real transactions.
This is reconciliation, not investigation. Then a small automatic check keeps the numbers
from drifting again.

### The problem

`ops/` has exactly one commit (`172b1a11`, 2026-08-08) while
`packages/`, `contracts/` and `apps/` moved through six and an actual mainnet
launch. The files now contradict themselves *internally*:

- `ops/STATUS.md:151-165` lists under "Not started" nine things STATUS.md itself
  calls Done sixty lines earlier — the application, the cache, legacy adapters,
  the build and manifest, the runtime emulator, the artefact tests,
  `npm run release`.
- `ops/RISKS.md:57-63` says "No request has reached a real extension", 44 lines
  after R1 at `:13-27` records a mainnet txid with a transfer event.
- `RISKS.md:13` says R1 is CLOSED and `:42-44` says the sponsored submit "has
  still never reached a wallet". Same event, two answers.
- `ops/LAUNCH.md:8` says NOT READY and `:44` says "nothing has ever been signed",
  against `README.md:451`'s eighty signed moves.

The numbers are all wrong too. `STATUS.md:7` and `LAUNCH.md:51` say 68KB; the
files are 130,782 and 128,615. `STATUS.md:24` says 405 tests, `README.md:50` says
~345, `npx vitest run` gives 662 passed and 16 skipped. And `README.md:215-216`
documents a *reverted* design, naming `dist/target.json` when `build.mjs:55` uses
`.xchess-build-target.json` and `build.mjs:48-53` explains that living in `dist` was the
bug.

### The proposal

Correct the five files against evidence *in the repository*, not memory. The R1
contradiction is settled by `ops/DECISIONS.md:534-635` (ADR-0009) and `:866-932`
(ADR-0013), which tabulate sixteen real mainnet transactions and reconcile the
sponsored wallet's balance to the uSTX. No chain read is needed.

Delete STATUS.md's fossil "Not started" block. Retitle `LAUNCH.md:8` to
"LAUNCHED, with N gates still open". Add the 2.0.0 entry to RELEASES.md.

Then add `harness/docs-audit.mjs` to `harness/verify.mjs`'s GATES, checking only
mechanically verifiable things: byte figures within 5% of `manifest.bytes`, test
counts against `vitest list --json`, and every directory under `tests/` appearing
in the README listing — it omits `tests/ui` and `tests/engine`, which exist.

### Why it is worth doing

The two files `README.md:421-422` ranks as authoritative currently tell an
arriving contributor that the application does not exist and must not be
inscribed, while it is live on mainnet holding a sponsorship reserve.

The concrete cost: a contributor reads R2, believes no wallet path has ever been
exercised, and re-derives it. Or reads R1 and cannot determine whether the most
dangerous encoding in the system has been proven.

### Steps

1. Reconcile `RISKS.md` R1/R2/R3 against ADR-0009 and ADR-0013 rather than
   re-reading the chain; delete the contradicting paragraph at `RISKS.md:42-44`.
2. Delete `STATUS.md:151-165`, replace with an "Open after launch" list carrying
   only what is genuinely open; fix `:3`, `:7`, `:17-18`, `:24`.
3. Tick the LAUNCH.md items closed by mainnet with inline txids, and change the
   `:8` status line.
4. Fix `README.md:215-216` to name `.xchess-build-target.json` citing
   `build.mjs:48-53`; add `tests/ui` and `tests/engine` to the listing at
   `:128-142`; correct `:50` and `:188-189`.
5. Write `harness/docs-audit.mjs` with the three **measurable** checks, each
   failure naming file, line, claim and truth. Make any date-freshness check a
   warning, not a failure, or it becomes a ratchet fixed by bumping a date line.
6. Register it in `harness/verify.mjs` GATES after the serverlessness audit
   (`verify.mjs:32-37`).

**Files** `ops/STATUS.md` · `ops/RISKS.md` · `ops/LAUNCH.md` · `ops/RELEASES.md` ·
`README.md` · `harness/docs-audit.mjs` · `harness/verify.mjs` ·
`tests/harness/docs-audit.test.ts`

### Risks

The byte and test-count extractors can false-positive on unrelated numbers, so
scope both to `README.md` and `ops/*.md` and print the matched text so a false
positive is obvious in a second. The git dependency must degrade to a skip
outside a checkout, never a failure.

### How to prove it

`tests/harness/docs-audit.test.ts` drives each check over fixture strings rather
than the live files, so it does not fail whenever a doc is legitimately edited.
Then `npm run verify` end to end with corrected docs.

---

## 5. Restore the sponsorship constants, and stop the canary breaking them again

**Simplicity 4 · Safety 3 · Bytes none · Needs one owner transaction**

### In plain terms

Your headline feature is that somebody holding no money at all can be funded on
chain by their opponent and play a full game. Right now the live contract is set to give
that person **2 gas rebates instead of 45** — enough for two moves of a game that needs
forty.

The cause was found. A test procedure deliberately drains the setting down to 2 to prove
the "what happens when it runs out" path works, and nothing ever puts it back. Every
sponsorship sold since has been sold in that state.

**The fix is one transaction from the owner**, plus about five lines so the test restores
the setting when it finishes.

**What is safe about it:** anyone already funded keeps the terms they were funded under —
that is built into the contract and there is a test proving it. And the board already
reads the real price from the chain and shows it honestly, so the wrong number is in your
published documents, not in front of players.

**What to be careful about:** this changes live pricing, so put the numbers in correctly.
And restore the documented values only. Raising the price is a separate decision that
belongs to whoever is paying for it.

### The problem

`README.md:447` records `get-rebate-count = 2` read off chain on 2026-08-11,
against `SPONSORSHIP-V1.md:70-91` which still publishes 45 rebates, 0.450 STX
liability and "Sponsor Opponent 1.56 STX".

The cause was found. `apps/canary/main.ts:775-779` — the `exhaust` step — sends
`setSponsorship(60_000n, 10_000n, 2n, 50_000n)` whenever liability exceeds
20,000. That is ADR-0013's step-14 exhaustion procedure
(`ops/DECISIONS.md:917-919`), and **nothing in the file ever restores it**.

So every sponsorship sold since buys the beneficiary exactly two rebates. The
product's headline claim is live in a near-useless configuration.

A differ already exists and is not being re-run: `apps/canary/main.ts:388-402`
(`configured`) reads `get-sponsor-price` and `get-open-fee` and refuses unless
bootstrap=60000, liability=450000, margin=50000. Against a live count of 2, that
gate would fail today.

### The proposal

Three parts, in order of durability.

1. **Make the exhaust step restore count 45 when it finishes.** Five lines, and
   it stops this recurring. The cheapest fix, and nobody had proposed it.
2. **Send one `set-sponsorship`** restoring the documented constants (rebate
   10000, count 45, margin 50000, bootstrap unchanged) from the owner via the
   gates page. Do **not** bundle the bootstrap rise to 300000: ADR-0009
   (`DECISIONS.md:625-628`) explicitly declines to change constants automatically
   and says the decision "belongs to whoever is paying". Restoring documented
   values is a repair; raising a price is a separate ADR.
3. **Lift the existing `configured` check into `harness/live-config.mjs`**, diff
   eleven getters against a committed `ops/live-config.json`, and run it as the
   final gate of `npm run release` — refusing, never skipping, when the network
   is unavailable.

### Why it is worth doing

Sponsored onboarding is what makes this project different from a chess app with
a wallet attached, and it is currently sold in a configuration that strands a
player after two moves.

Existing rows are provably unaffected: each captures its rebate at funding time
(`contracts/xchess-core-v1.clar:176-179`), asserted by
`tests/clarity/core.test.ts:287-303`, which halves the rebate and proves the
funded row still pays its own. All four values sit inside the compiled ceilings
(`clar:90-93`, asserted at `clar:678-681`).

### Steps

1. Amend the exhaust step at `apps/canary/main.ts:775-779` to restore
   `setSponsorship(..., 45n, ...)` on completion, with a Clarinet assertion that
   it does.
2. Write ADR-0014 stating the exhaustion configuration is a test fixture and
   never a launch value, superseding the constants half of ADR-0013.
3. Send one `set-sponsorship` from the owner through the gates page rather than a
   script; record before and after in `ops/RELEASES.md`.
4. Add `harness/live-config.mjs` and `ops/live-config.json`; add
   `npm run check:live` and a release gate entry.
5. Add `tests/chain/live-config.test.ts` driving the differ against a recorded
   fixture with no network.
6. Correct `SPONSORSHIP-V1.md` section 4 and the price table, and README's
   live-state table.

**Files** `apps/canary/main.ts` · `ops/DECISIONS.md` · `ops/live-config.json` ·
`harness/live-config.mjs` · `harness/release.mjs` · `package.json` ·
`tests/chain/live-config.test.ts` · `SPONSORSHIP-V1.md` · `README.md`

### Risks

`set-sponsorship` changes live pricing, so a wrong number misprices every
sponsorship sold afterwards. It cannot strand anyone already funded (see above).

The board is already honest on screen — `drawPrice`
(`packages/ui/app.ts:1089-1113`) reads the price live and prints
"0.020000 held for rebates" — so the stale number is in the document, not the UI.
`getSponsorPrice` caches per session (`packages/chain/client.ts:328`), so 2988
quotes the corrected price on the next load, not instantly.

### How to prove it

`npm run check:live` before and after the transaction, the before run failing on
`rebate-count`, both saved into `ops/RELEASES.md`. Offline,
`tests/chain/live-config.test.ts` feeds a one-field-different fixture and asserts
a non-zero exit naming the field.

---

## 6. Freeze the nine live mainnet games and regression-test them offline

**Simplicity 4 · Safety 5 · Bytes none · Needs neither**

> ### ✅ Implemented — commit `fc9c0993`
>
> Nine real games and 112 submissions frozen from the bound contract and replayed offline: the accepted/rejected split ADR-0007 moved a string across, whether each game's rules can be recovered, game 6's result and final position, and the leaderboard two real players see. Flipping a checkmate's winner fires both.

### In plain terms

You have 662 tests. Not one of them checks a single game that a real person actually
played. Your 9 live games and 80 signed moves are recorded nowhere except the chain
itself.

**Why that is dangerous here specifically:** the whole design rests on the idea that the
same moves always produce the same result, for every reader, forever. If a future change
altered how a game is read, nothing would catch it.

And this is not hypothetical. It has already happened once: a game was re-read under a
newer rule and its winner flipped from White to Black. Same moves, opposite result. That
was caught by luck, after the fact.

**The change:** capture the real games once, then assert their results, final positions
and ratings offline in the normal test run.

**The one part not to skip:** hand-check the expected results before committing them. A
generated expectation captured from a bug is a bug promoted to a specification, which is
exactly how the earlier wrong result got locked in.

### The problem

`ls harness/fixtures/` returns exactly one file, `legacy-mainnet.json`, and
`tests/legacy/fetch-live.test.ts:28` iterates only `LEGACY_CONTRACTS`.

The live contract holding **9 games, 80 signed moves and 5 ranked results is
frozen nowhere.** Grepping for `xchess-core-v1-canary` across `tests/` returns
only `tests/wallet/outflows.test.ts:20`, using it as a post-condition string.

So all 649 offline tests contain not one assertion about a game a real person
played on the current protocol — while replay is a pure total function whose
output every reader sees forever.

This is not hypothetical. ADR-0007 (`ops/DECISIONS.md:387`) documents exactly
this: a legacy Scholar's Mate reading 0-1 by resignation instead of 1-0 by
checkmate. Opposite winners from identical bytes.

Worse, the pattern being copied is half-built: `grep -rn legacy-mainnet` returns
one hit, `fetch-live.test.ts:52`, which is the **write**. Nothing reads the
fixture.

### The proposal

Two files.

`tests/legacy/fetch-canary.test.ts`, `LIVE=1`-gated exactly as
`fetch-live.test.ts:22` gates its cases: read `getGameCount`, then
`getGame`/`getAllEntries` per game, plus `getRankedCount`/`getRankedGame` and
`getResultHint`. Assert `entries.length === game.nextSeq` per game, so a partial
read cannot be frozen as complete.

`tests/legacy/live-games.test.ts`, offline and in the default run, replaying each
frozen game and asserting against a committed expectation block: result, terminal
sequence, final FEN, ranked eligibility, and the exact per-player `elo-v1`
ratings across the five ranked games in chain order, plus the totals 9 games /
80 entries.

Write it to consume `legacy-mainnet.json` as well, or the new fixture inherits
the old one's fate.

### Why it is worth doing

This is the test that would have caught ADR-0007 *before* it reached a real game
rather than after. It protects the property the whole architecture rests on —
identical bytes give identical answers forever — at the one place where being
wrong costs a real player their real win.

It also makes `ops/LAUNCH.md` Gate 8 §79 executable for the first time, from
frozen chain bytes and nothing else.

### Steps

1. Take the canary contract identity from `dist/manifest.json`'s `contract` field
   so it cannot drift from what the board is bound to.
2. Write `tests/legacy/fetch-canary.test.ts`, LIVE-gated, asserting
   `entries.length === nextSeq` per game; make the freeze additive and assert the
   new capture is a superset before writing.
3. Run `LIVE=1 npx vitest run tests/legacy/fetch-canary.test.ts` and commit
   `harness/fixtures/canary-mainnet.json`.
4. Write `tests/legacy/live-games.test.ts` asserting per-game result, terminal
   seq, final FEN, ranked eligibility and the derived `elo-v1` table, consuming
   **both** fixtures.
5. Generate the expectation block once, **hand-check every line** against the
   live explorer, then commit it. A golden file generated from a bug is a bug
   promoted to a specification, which is how ADR-0007's wrong fixture happened.
6. Add `test:live:canary` to `package.json`.

**Files** `tests/legacy/fetch-canary.test.ts` · `tests/legacy/live-games.test.ts` ·
`harness/fixtures/canary-mainnet.json` · `packages/chain/legacy.ts` ·
`package.json` · `ops/LAUNCH.md`

### Risks

The real cost is not the LIVE fetch — that is a copy of an existing file — it is
hand-checking the generated expectation block, which must not be skipped. Real
games contain real principals, already public on chain, so freezing discloses
nothing new.

### How to prove it

The decisive check is a mutation: temporarily invert a condition in
`packages/replay/replay.ts`'s result determination and confirm the suite names
the specific real game whose result moved.

---

## 7. Stop the cold load spending the whole minute's allowance

**Simplicity 4 · Safety 4 · Bytes ~0.4 KB · Needs a new inscription**

> ### ✅ Implemented — commit `489bdbe5`
>
> Opening a shared link read seven games where it needed one. Both label resolvers now go through a three-wide pool, measured at 40 in flight before and 3 after. And both cached a REFUSAL as an answer, twelve lines below a sibling that deliberately does not and explains why.

### In plain terms

Three things make the first few seconds more expensive than they need to be.

Opening a shared game link — your entire invitation path — quietly loads the full game
list that nobody asked for, alongside the game the person actually clicked. That is about
**18 network requests where 3 would do**.

Long games ask for every move's timestamp at once, dozens of simultaneous requests, with
no limit and no regard for the allowance the wallet also draws from.

And the worst of the three: when a server replies "you are asking too often", the app
files that refusal away as though it were an answer. For the rest of that visit it
believes there is no name and no clock time. One busy moment and the move list stays blank
until the page is reloaded, which reads to a player as the board being broken.

**What is striking:** the code already knows this rule. Twelve lines further down the same
file, a different function deliberately does the opposite and explains why — "a refusal is
not an answer". The rule is written down and broken next door to itself.

### The problem

Three faults on the first-paint path.

**(a)** `checkContract` fires `void this.loadExplore()` unconditionally at
`packages/ui/app.ts:733`, so following a shared game link — the entire onboarding
path — pays for a game list nobody asked for, concurrently with the board's own
read. `loadExplore`'s own comment at `app.ts:2322-2324` says the spend is why it
never runs on a poll, and does not notice it runs on every boot. At the live count
of 9 that is ~18 requests.

**(b)** `resolveLabels` (`app.ts:698-720`) hands every distinct block height
straight to a bare `Promise.all`. `packages/chain/block-time.ts:94` and
`packages/chain/bns.ts:114` have no concurrency limit and never consult
`endpoint.remaining`, which `packages/chain/endpoint.ts:120-131` exposes precisely
so callers can be polite ("The WALLET spends from the same budget"). A 33-move
game fires up to 33 simultaneous requests.

**(c) The strongest single finding in this review.** `bns.ts:99-104` and
`block-time.ts:74-79` both do `.catch(() => null).then(name => this.cache.set(key, name))`
— caching a **refusal** as an answer for the session. Twelve lines below,
`bns.ts:165-171` does the opposite deliberately, and says why:

> A refusal is not an answer, and remembering one would make a passing rate limit
> permanent for the session.

The file states the rule and its sibling method breaks it.

### The proposal

**(a)** Delete the boot-time `loadExplore` and call it from `show('explore')`
beside the existing leaderboard branch at `app.ts:858`, memoised on
`getGameCount` alone. Render a placeholder so an unopened tab does not read as
broken.

**(b)** Add `packages/chain/pool.ts`, an eight-line `pool(limit, tasks)`, and
route `Names.resolveAll` (`bns.ts:111-117`) and `BlockTimes.resolveAll`
(`block-time.ts:89-96`) through it at limit 3, ordering heights newest-first since
that is the end of the move list a reader looks at.

**(c)** In both `resolve()` methods, cache `null` **only** when the lookup
completed and said there is no name / no block time. On `RATE_LIMITED` or
`CHAIN_UNAVAILABLE` (the codes `endpoint.ts:244` and `:255` already set) leave the
key unasked so the next pass retries.

> Drop the obvious-looking `remaining` floor. `remaining` is null until a response
> carries a recognised header (`endpoint.ts:177-188`), so on hosts sending neither
> it is dead code.

### Why it is worth doing

Opening a shared link costs 3 requests instead of ~18 — the single largest item
in the cold load, and the one paid by every new player following an invitation.

And a transient 429 stops permanently blanking a move list. Today one busy moment
means a game whose clocks are blank until reload, which reads as the board being
broken rather than the host being busy.

### Steps

1. Delete `void this.loadExplore();` from `app.ts:733` and call it from
   `show('explore')` at `app.ts:858`; add `exploreLoadedCount` memoised on
   `getGameCount`, plus a placeholder row.
2. Add `packages/chain/pool.ts` exporting `pool<T>(limit, tasks)`.
3. Route `bns.ts:111-117` and `block-time.ts:89-96` through it at limit 3; sort
   the height list newest-first in `resolveLabels` (`app.ts:713`).
4. Replace the blanket `.catch(() => null)` in `bns.ts:98-104` and
   `block-time.ts:73-79` with a catch that caches only non-`RATE_LIMITED`,
   non-`CHAIN_UNAVAILABLE` outcomes, mirroring `bns.ts:165-171`.
5. Add to `tests/e2e/request-budget.test.ts`: mount with `?game=1` and assert
   `getGame` is called once, not ten times.
6. In `tests/chain/endpoint.test.ts`, script a fetch recording concurrent
   in-flight count and assert it never exceeds 3 for a 40-height log; script a 429
   for one height, assert the null is **not** cached, then a 200 and assert it
   resolves.

**Files** `packages/ui/app.ts` · `packages/chain/pool.ts` · `packages/chain/bns.ts` ·
`packages/chain/block-time.ts` · `tests/chain/endpoint.test.ts` ·
`tests/e2e/request-budget.test.ts`

### Risks

Labels arrive more slowly on a long game — 33 heights at concurrency 3 is ~11
round trips, so clocks populate over seconds rather than one paint. That is the
right trade: the position draws from replay immediately and neither resolver has
ever blocked the board (`bns.ts:11-15` says so).

Retrying an unanswered lookup on every redraw could loop if the endpoint is down;
the in-flight map in both resolvers already prevents duplicate concurrent work,
and the poll cadence bounds the retry rate.

---

## 8. Make Copy link survive the page it was copied from

**Simplicity 4 · Safety 4 · Bytes ~0.4 KB · Needs a new inscription**

> ### ✅ Implemented — commit `f45e0131`
>
> linkForGame takes the whole href and keeps every parameter it does not own, dropping game, rules and the per-session bridge token. A deny list on purpose: a permanent artefact cannot learn the name of a parameter Xtrata adds next year.

### In plain terms

The Copy link button produces a broken link for the only people who can actually
make a move.

Playing through the Xtrata site, the page address carries information the site needs to
run the app at all. Copy link throws all of it away and keeps only the game number. Send
that to somebody and they land on an error box.

It works fine when tested from a plain address, which is why it has never been caught —
every test uses a plain address rather than the one a real player is on.

**Why this one is disproportionately important:** with no server, a link is the only way
one player reaches another. This single button is the whole onboarding path, and it
currently does not survive being used.

**Worth knowing:** the fix must strip out the one-time wallet key from the copied link, so
the person receiving it still has to enter through Xtrata to sign. That makes the
accompanying "Open in Xtrata" button the important half of this, not an optional extra.

### The problem

`copyLink` builds the shareable link from `href.split(/[?#]/)[0]`
(`packages/ui/app.ts:1009`) and `linkForGame` strips it again at
`packages/protocol/known-rules.ts:121-125`, appending only `?game=N&rules=...`.

That is harmless at `/i/2988` and **fatal at the only URL a player who can
actually move is ever on.**

Signing needs the bridge: `bridgeToken()` reads `walletBridgeToken` from
`location.search` (`packages/wallet/providers.ts:38-40`) and `usingHostBridge()`
at `:60-62` requires it. The Xtrata runtime page is top-level —
`xtrata-2.0/public/runtime/index.html:326-337` does `document.open()`/`write()` —
so a mover's href is
`/runtime/?contractId=...&tokenId=2988&network=mainnet&walletBridgeToken=...`,
and Copy link yields `/runtime/?game=5&rules=...`, which hits `:348-353` and
renders **"Missing runtime parameters."**

The recipient sees a dark box.

Ironically `openFromLink`'s own comment at `app.ts:492-494` already says "the
Xtrata runtime serves an inscription from a path that already carries a query of
its own". And every fixture in `tests/e2e/shared-link.test.ts` is
`https://example.test/xchess.html` or `/i/9002` — never the runtime URL a real
player is on.

### The proposal

Change `linkForGame` to take the page's **full** href and rebuild the query from
it, preserving every parameter it does not own and deleting a short explicit
list: `game` and `rules` (which it replaces) and `walletBridgeToken` (a
per-session secret that must never be pasted into a public post). No host is ever
named — everything comes from `location.href`.

Handle the second dead case: under a sandboxed `srcdoc` embedding,
`location.href` is `about:srcdoc`, so detect a non-`http(s)` href and show the
game number and rules payload in the notice, rather than a link that cannot work
anywhere.

Then add an **Open in Xtrata** button to the no-bridge notice at
`app.ts:467-469`, posting the open-runtime intent the host already handles.

### Why it is worth doing

The single link that constitutes the entire onboarding path stops being dead.
Today an established player copies the link from the board they are playing on,
sends it, and the newcomer lands on an error box.

Be honest about the limit: the deny-list correctly removes the bridge token, so
the recipient still cannot sign until they enter through Xtrata. That makes the
button the important half, not the optional one.

### Steps

1. Change `linkForGame` in `known-rules.ts:121-125` to
   `linkForGame(href, game, rules)`, parsing the query by hand as the file already
   does at `:109-112`, copying every parameter into a fresh `URLSearchParams`,
   deleting `game`, `rules` and `walletBridgeToken`, then setting `game` and
   `rules`.
2. Update the caller at `app.ts:1008-1009` to pass the whole href.
3. Add a non-`http(s)` branch putting the game number and rules payload in
   `#chain-notice`.
4. Add an open-in-xtrata button to the sign-notice block at
   `packages/ui/shell.ts:343` **and its id to IDS at `app.ts:144-167` in the same
   change** — a missing id throws by design at `app.ts:302`.
5. Extend `tests/e2e/shared-link.test.ts` with a `boardAt` fixture at the real
   runtime URL, asserting the produced link still contains `contractId`,
   `tokenId` and `network`, does **not** contain the token, and that a second
   board booted at it reports the right game.

**Files** `packages/protocol/known-rules.ts` · `packages/ui/app.ts` ·
`packages/ui/shell.ts` · `tests/e2e/shared-link.test.ts` ·
`tests/protocol/known-rules.test.ts`

### Risks

A deny-list means a future Xtrata parameter is carried by default. An allow-list
is the safer shape and the wrong one here: this artefact is permanent and cannot
learn tomorrow's parameter names, and `buildRuntimeOpenUrl` can already set
`source`, `fallbackContractId` and `moduleBase`, which must pass through.

The open-runtime button depends on a host handler this repo does not own. It must
degrade to nothing visible when there is no parent, and must never be the only
route to the game number.

---

# Tier 2 — high value, more work

---

## 9. Make the promotion picker dismissable, and never let it fire a stale move

**Simplicity 5 · Safety 4 · Bytes ~0.3 KB · Needs a new inscription**

> ### ✅ Implemented — commit `e286dbcd`
>
> hidePromotion() now exists and is called from all five ways out. Cancel and Escape added, the latter registered once and guarded on state - {once:true} fires on the first KEY, not the first Escape. Three of eight cases fail against the old code, including both money-losing ones.

### In plain terms

When a pawn reaches the far end you choose what it becomes. There is no Cancel and no
Escape, and there are two ways this costs a player money or confuses them.

If you change your mind and click a different piece, the chooser is still open and still
holding the **old** move. Choose Queen and it submits and pays for a move you abandoned.
Clicking the pawn again to put it down — the obvious way to back out — leaves the chooser
live, so the natural undo gesture is the trap.

And if your opponent's move arrives while the chooser is open, it stays on screen with
every button silently doing nothing.

**Why it is worth doing despite being small:** it is an afternoon's work, it removes a way
to spend a real network fee by accident, and every chess interface a player has ever used
lets them back out of a promotion. Nothing currently tests this screen at all.

`askPromotion()` (`packages/ui/app.ts:2067-2086`) removes `hide` from
`#promotion`, and the only place that adds it back is inside the per-piece click
handler at `app.ts:2082`.

**Stale submission.** `onSquare()` sets `pendingPromotion` and returns at
`app.ts:2038-2043` without clearing `this.selected` and without calling
`drawGame()`, so the pawn stays visibly selected with its dots lit and the squares
stay live. Clicking a different piece re-selects (`app.ts:2029-2035`) while the
picker still holds the old from/to — and Queen then submits an abandoned move and
pays for it. Clicking the promoting pawn again hits the deselect branch at
`app.ts:2034-2038` and leaves a live picker: **the obvious undo gesture is the
trap.**

**Dead panel.** Any poll landing an entry calls `derive()`, which nulls
`pendingPromotion` at `app.ts:1329` without hiding the node. The panel stays on
screen and every button silently returns at `if (!pending) return;`
(`app.ts:2081`). There is no Cancel and no Escape. No test anywhere exercises the
picker.

**The fix.** Add `hidePromotion()` clearing `pendingPromotion` and adding `hide`,
called from the top of `onSquare()`, from `derive()` in place of the bare null,
from `load()`, and from `submit()`'s failure branch. Clear `this.selected` when
the picker opens and pass from/to in so it can label itself ("Promote the e7 pawn
on e8:"). Add a Cancel button and an Escape handler, both restoring focus to the
origin square, plus `role=group` and an `aria-label`.

**Files** `packages/ui/app.ts` · `packages/ui/shell.ts` ·
`tests/e2e/pending-move.test.ts`

**Prove it** — three assertions on the existing JSDOM+MockChain harness
(`pending-move.test.ts:11-70`): after choosing a promotion square then clicking an
unrelated piece, `#promotion` has class `hide` and `chain.submissions` is empty;
after a poll lands a new entry, `#promotion` is hidden; Cancel and Escape both
hide it with no submission.

---

## 10. Fix the shell CSS: a dead reduced-motion selector, a 1.006:1 selection ring, and a board taller than a landscape phone

**Simplicity 4 · Safety 4 · Bytes ~0.4 KB · Needs a new inscription**

> ### ✅ Implemented — commit `cafacb6b`
>
> Five measured faults: a dead reduced-motion selector, a ring at 1.006:1 against the light square, a board taller than a landscape phone, three untappable escape hatches, and a rule pointing at keyframes nobody wrote. tests/artifact/contrast.test.ts computes the ratios from the shipped bytes.

### In plain terms

Four measured faults in the styling, all in the permanent file.

A single-word typo means the "reduce motion" setting does not work. A piece keeps pulsing
for people who have specifically asked their device for stillness, and it can pulse for
several minutes while a move is pending.

The highlight showing which piece you have picked up is, by measurement, **the same
brightness as the square underneath it**. On light squares it is invisible to anyone who
cannot separate the two by colour alone.

Hold a phone sideways and the board grows taller than the screen, pushing the line that
says whose turn it is out of view.

And the three buttons that let you escape a stuck board are the smallest tap targets in
the app, because they were never given the class that sets a minimum size.

**Decision note:** one part of this was deliberately left out. Converting every size in the
stylesheet to scalable units sounds tidy, but it is a mechanical rewrite of every
measurement in a file that can never be corrected, for a benefit browser zoom already
provides. Not worth the risk.

Four measured defects in `packages/ui/shell.ts`.

**(a) The reduced-motion block is dead.** `:209-211` reads
`.pc--ghost path, .sq--check { animation: none; }` and `.pc--ghost path` matches
**nothing** — `pieceNode` (`packages/ui/board.ts:35-44`) builds a span with a text
glyph, there is no `path` in a piece. The trace animation (`:177`, keyframes
`:188`, 1.9s infinite) keeps pulsing for a user who asked for no motion, and a
pending move can sit in the mempool for many minutes. **The typo is in the shipped
artefact.**

**(b) Contrast, recomputed from the hex values.**

| pair | ratio |
|---|---:|
| `.sq--light` #b9a98f vs `.sq--dark` #6d5b46 | 2.82:1 |
| `.pc--white` on light | 2.30:1 |
| **`--gold` #d8a24a (`.sq--selected`, `:115`) vs #b9a98f** | **1.006:1** |

Identical luminance. The selection ring and last-move ring are distinguishable by
hue alone.

**(c) Landscape.** `.board` at `:79-95` is `width:100%` / `aspect-ratio:1` with no
height constraint, and the only media query in the file is `max-width:780px` at
`:58`. At 844×390 the two-column layout holds and the board is ~428px tall in a
390px viewport, pushing `#status` and `#move-hint` below the fold.

**(d) The escape hatches are the smallest targets.** `#override-yes` (`shell.ts:408`),
`#send-anyway-yes` and `#send-anyway-no` (`shell.ts:414-415`) carry no `class=action`, so
none picks up `min-height:44px` at `:242`. The three buttons that keep the move
lock from becoming a trap are untappable.

Also `.live-dot` at `:233-234` references an undefined `@keyframes breathe` and no
element ever gets that class. Dead CSS.

**The fix.** Correct the selector to `.pc--ghost` and widen it; the ghost stays
identifiable without the pulse because `:179-180` already distinguishes signing
from sent by stroke colour. Give `.sq--selected` and `.sq--last` a two-tone ring
(`box-shadow: inset 0 0 0 5px rgba(0,0,0,.55)` beside the gold) so one edge always
resolves on both square colours and in greyscale. Cap the board with
`max-width: min(100%, 78svh); margin-inline: auto` and add
`@media (max-height: 560px) { .layout { grid-template-columns: 1fr; } }`.

> Apply the same `max-width` **and** `margin-inline` to `.board-wrap` (`:202`), or
> the arrow overlay — `position:absolute; inset:0` with `preserveAspectRatio=none`
> over `viewBox 0 0 8 8` (`shell.ts:394`) — stretches every pending arrow off its squares.

Add `class=action` to the three buttons. Delete `.live-dot`. Add
`prefers-contrast: more` and `forced-colors: active` blocks — but **not**
`forced-color-adjust:auto` on `.sq--selected`, which would hand those squares'
backgrounds to the OS exactly where the checkerboard matters most.

> **Do not** do the px-to-rem conversion. Browser zoom already satisfies 1.4.4,
> and a mechanical rewrite of every size in a permanent artefact is the riskiest
> edit proposed here for the smallest gain.

**Files** `packages/ui/shell.ts` · `tests/artifact/contrast.test.ts`

**Prove it** — `tests/artifact/contrast.test.ts` extracts the shipped
declarations from `dist/xchess.html` and computes WCAG ratios in ~10 lines of
arithmetic, plus a string assertion that no `.pc--ghost path` selector survives.
Layout and ring changes verified by the browser gate (proposal 18) at 844×390,
390×844 and 1280×800.

---

## 11. Never write a post condition from a guess

**Simplicity 4 · Safety 4 · Bytes ~net zero · Needs a new inscription**

> ### ✅ Implemented — commit `3a733c41`
>
> Every submission declares the protocol ceiling rather than a guess at what this caller is owed - the board cannot know which account will sign. The pre-signing read is gone with it, and two tests encoding the old rule are superseded. The mirrored constant is pinned to the contract in Clarinet.

### In plain terms

Before your wallet signs anything, the board declares the most money that can move.
If it declares too little, the network throws the transaction away **after the contract has
already done the work** — you pay the fee, and the move does not count.

That is not theoretical. It happened on mainnet and cost 0.1 STX.

The board works the figure out from the account you connected with. But the wallet may
well sign with a different account, and the code says so in plain English in two places
while doing the opposite in a third.

**The fix is neat:** stop guessing entirely. The contract has a hard built-in maximum it
can never exceed, so declare that instead. It is always sufficient, it is never wrong
whoever signs, and it costs the player nothing, because a cap on money moving *toward*
somebody cannot take anything from them.

**The one cosmetic downside:** the wallet will say "this contract may send up to 0.1 STX"
on every move, which looks alarming until the wording next to it explains that it is a
ceiling, not a charge.

Two ways the board caps a transfer using a number it does not know is true.

**(a) Signer mismatch.** `app.ts:2176-2182` derives the contract-side cap from the
sponsorship row for `this.address`, the account named at connect time — while
`app.ts:1615-1619` and `packages/wallet/postconditions.ts:164-180` both state in
prose that the board cannot know which account the wallet will sign with, which is
why the *sender* side correctly uses the origin principal.

`apps/chess/main.ts:49-55` only demands a connection when `call.sends > 0n`, and
`client.ts:551` sets `sends: 0n` for submit, so an unconnected signer path is real.
If the signer *is* sponsored while the board believes otherwise, `maybe-rebate`
(`clar:489-527`) pays them, the transfer is uncovered, and
`abort_by_post_condition` discards a transaction the contract already completed.
**That is ADR-0008's exact shape, which cost 0.1 STX on mainnet.**

The bug is invisible to the type checker: `client.ts:171` declares
`submit(game, value)` while the implementation at `:546` is
`submit(game, value, rebate=0n)`, so `app.ts:2184` has to cast through
`Chain & { submit(g,v,r?) }`.

**(b) Stale price.** `client.ts:228-231` caches `openFee` and `price` for the
session under the comment "The fee does not change mid-session" — but both are
owner-mutable at any height (`set-open-fee` `clar:661`, `set-sponsorship`
`clar:675`), and the contract charges the *current* values at execution.

**The fix.** Take the contract-side cap from the protocol's hard ceiling instead
of a guess. `REBATE-CEILING` is `u100000` (`clar:91`), `set-sponsorship` refuses
anything above it (`clar:684`), and `maybe-rebate` pays at most once per call to
`tx-sender` — so "this contract sends at most 100000 uSTX" is always sufficient and
never wrong, whoever signs. It costs the user nothing: an LTE cap on money moving
*towards* a player cannot take a satoshi from them.

> `max(rowRebate, get-rebate-amount)` is **not** a safe substitute: a row captures
> its rebate at funding time (`:176-179`) and a signer may hold an older, larger
> one.

Refresh the two cached values immediately before building any call that quotes
them, and re-confirm on screen only when the total the user was shown has gone
**up** — a drop is harmless under LTE, only a rise aborts. Fix the
`ChainWriter.submit` signature at `client.ts:171` and `mock.ts:305` so the
money-carrying argument stops being invisible.

**Files** `packages/wallet/postconditions.ts` · `packages/chain/client.ts` ·
`packages/chain/mock.ts` · `packages/ui/app.ts` · `apps/canary/main.ts` ·
`tests/wallet/outflows.test.ts` · `ops/DECISIONS.md`

**Risks** — the wallet dialog will show "contract may send up to 0.100000 STX" on
every move including for unsponsored players, which reads as alarming until the
copy explains it is a cap and not a charge. If a future core contract raises
`REBATE-CEILING`, the constant here silently becomes too small — hence pinning it
to a named line and asserting the contract's own ceiling in
`tests/clarity/core.test.ts`.

**Prove it** — **invert** `tests/wallet/outflows.test.ts:88` (which asserts
`contractSends` is `0n` for an unsponsored submit) rather than merely extending
it, and add a case asserting a guard built from `0n` does *not* cover a 10,000
payout.

---

## 12. Watch the transaction to its end, so a burned fee is never silent

**Simplicity 4 · Safety 5 · Bytes ~1.0 KB · Needs a new inscription**

> ### ✅ Implemented — commit `ca4af332`
>
> Lifted the gates page's watcher into packages/chain/tx-status.ts and gave it the endpoint list. Success is silent; a failure says what the chain said, and whether the fee was spent. Degrades on a null or all-zero txid, one watch at a time, nothing polls while a wallet dialog is open.

### In plain terms

When you send a move the board says "Sent" and then never looks again.

If the transaction fails, the move simply **vanishes** off the board a few seconds later,
with no explanation and no mention that you were charged for it. The player is left
wondering whether they clicked the wrong thing.

The capability already exists in this project — the deployment page follows a transaction
to its conclusion and reports the chain's own verdict. It was just never given to players.

**What it would say:** nothing at all when a move succeeds. When one fails, it says which
of the handful of things went wrong, in the chain's own terms, and whether a fee was
spent.

**Why it is safe:** it only does anything on a path where something has already gone
wrong, it makes one request, and everything it does is display. It cannot cause a failure,
only describe one.

`app.ts:2184-2185` awaits `submit()` and **discards the result**, so the txid —
which `apps/chess/main.ts:79-85` already extracts from four possible payload
shapes into `WriteResult` (`client.ts:123-128`) — never leaves the call. The board
says "Sent. It counts once it is in a block" (`app.ts:2195-2202`) and never looks
again.

> **A verifier corrected the reviewer here, and the correction changes the pitch.**
> `settleIntent` (`app.ts:1512-1521`) clears the ghost as soon as the value string
> appears in the log **or in the mempool** (`inMempool`, `:1517-1520`). So a
> transaction that reaches the mempool and later aborts does not leave a stuck
> ghost — the move quietly **vanishes** from the board within a poll or two, with
> no explanation and no mention that a fee was paid. Arguably worse.

That is ADR-0008's documented failure (`ops/DECISIONS.md:448-470`:
`abort_by_post_condition` on `(ok u3)`, 0.1 STX gone).

**The capability already exists and was not given to the players.**
`packages/ui/canary.ts:182-219` polls `/extended/v1/tx/<id>` every ten seconds
until the status is not pending, reports the chain's own word, and gives up after
twenty minutes. The gates page can see what the board cannot.

**The fix.** Lift `confirm()` out of `canary.ts` into
`packages/chain/tx-status.ts`, taking an `Endpoint` rather than a bare `fetch` and
a hardcoded base, so it inherits the failover and rate-limit handling
`canary.ts:184` currently lacks — and have the canary use it too. Capture the txid
and start the watch without awaiting it. Key `settleIntent` on the watched txid so
any terminal status clears the intent.

Say what happened in the chain's own terms: success is silence;
`abort_by_post_condition` says the contract succeeded, a transfer went uncovered,
nothing was recorded and the network fee was spent (the wording exists at
`apps/canary/main.ts:722`); `abort_by_response` decodes through
`describeContractError` (`client.ts:640`, already imported at `app.ts:37`);
`dropped_*` says the fee was too low and nothing was charged.

> Degrade silently on a null or all-zero txid. `WriteResult.txid` is nullable by
> design (`client.ts:125`) and `harness/runtime/serve.mjs:246` returns a fake zero
> txid, so a naive reader reports nonsense in the emulator. Key off `tx_status`
> alone; `post_condition_aborted` is not a field in the shape assumed.

Obey ADR-0011 decision 4: no watching while a wallet dialog is open, ten-second
interval, twenty-minute deadline, one watch at a time.

**Files** `packages/chain/tx-status.ts` · `packages/ui/canary.ts` ·
`packages/ui/app.ts` · `apps/chess/main.ts` · `tests/e2e/pending-move.test.ts`

---

## 13. Bound the rules-recovery search, which a hostile log can turn into a permanent freeze

**Simplicity 4 · Safety 3 · Bytes ~0.3 KB · Needs a new inscription · Consensus-visible**

> ### ✅ Implemented — commit `6eb7d0a0`
>
> Six distinct senders past the opener, in SEQUENCE order, plus a hard stop at 512 candidates: 14.4 seconds becomes 3 milliseconds and stays there at any number of senders. Order matters as much as the number — sorting alphabetically is the wrong end to truncate, because an attacker chooses where in the alphabet they land. The viewer and any offered candidate stay outside the cap. ADR-0015, and consensus-visible.

### In plain terms

This is the one genuine security problem in the list.

To confirm a game's rules, the board tries combinations built from everyone who has ever
submitted anything to that game. Anyone can submit anything to any game — that is by
design, and harmless on its own.

But the work grows with the *square* of the number of people involved. Measured: 100
senders takes a sixth of a second. 1,000 senders takes **14 seconds**, and considerably
worse on a phone.

Now the sharp end: this runs for every game in the game list and every rated game on the
leaderboard. So one ranked game stuffed with junk freezes the leaderboard for every
visitor — permanently, in an application that cannot be patched.

**The fix is cheap:** stop after a fixed number of attempts.

**The thing to understand before agreeing:** this narrows what counts as a confirmable
game, and confirmation decides whether a game is rated. Every player must be running the
same version or two boards could disagree about whether a game counts. That makes it one
of the two changes here that must be got right the first time.

`recoverRules` (`packages/protocol/recover.ts:99-161`) searches every ordered pair
of sides, and the side list is built from **every distinct sender in the log**
(`:74-83`) — attacker-controlled, because the contract filters on length alone and
anyone may submit to any game. The loop at `:138-158` is O(2(n+3)²) canonical
hashings, synchronous, on the main thread.

A verifier reproduced the measurement by bundling `recover.ts` and running it:

| distinct senders | candidates | time |
|---:|---:|---:|
| 100 | 21,218 | 150 ms |
| 500 | 506,018 | 3.68 s |
| 1,000 | 2,012,018 | **13.8 s** |

A phone is several times worse.

It is called from three places, so one poisoned game poisons more: `adoptRules`
(`app.ts:1292`, re-run whenever the log changes), the explorer per game
(`:2353-2360`), and `rulesForRanked` per ranked game (`:2540-2549`). **A single
ranked game stuffed with junk senders makes the leaderboard unusable for every
reader, forever, in an artefact that cannot be patched.**

The CPU is only half of it: the explorer also fetches every entry of that game at
`PAGE_SIZE` 50 (`client.ts:308-320`), so a 1,000-entry game costs 20 rate-limited
requests before a hash is computed.

**The fix.** Cap the search deterministically inside `recoverRules`, computed from
the log alone. Build the side list from the opener, the viewer, and the first
K distinct senders in ascending seq order — K = 6 covers every rule set this
application can create, which names at most two players — and hard-stop at
`MAX_CANDIDATES = 512`, returning `{ confirmed: false }` when hit. Keep
`input.candidates` (the remembered rule set and the shared link) **outside** the
cap and tried first as they are at `:111-117`. Also cap the entries the explorer
fetches per game, or the request limb of the attack survives untouched.

> **Two cautions.** `recover.ts:120-121` already appends the caller's own viewer,
> so confirmability is *already* reader-dependent — the viewer must sit inside the
> kept window or a bound turns an existing widening into a divergence. And
> switching participants from `.sort()` to seq order is itself consensus-visible,
> so it must land in the **same inscription** as the cap, never separately.

**Files** `packages/protocol/recover.ts` · `packages/ui/app.ts` · `RULES-V1.md` ·
`ops/DECISIONS.md` · `tests/rules/recover.test.ts`

**Risks** — this narrows what can be confirmed, and confirmation gates ranked
eligibility, so every reader must adopt the same K and the same ordering or two
boards will disagree about whether a game is rated. A game whose real player is
the seventh distinct sender would recover today and not after; no such game can
exist for a two-player rule set unless five other people have already submitted
junk into it first, which is the case being defended against.

**Prove it** — a game with 200 junk senders plus the two real players in the first
two seqs still recovers with `tried` under `MAX_CANDIDATES`; the same log with the
real players buried at seq 300 returns `confirmed:false`; and a timing assertion
that recovery over 1,000 senders completes in under 50 ms, pinned as a regression
since only a timing test catches its return.

---

## 14. Make the explorer rows say who can play, and whose move it is

**Simplicity 4 · Safety 4 · Bytes ~0.9 KB · Needs a new inscription**

> ### ✅ Implemented — commit `e418b97c`
>
> Rows carry "Your move" and "Open seat", computed from checkSender so there is one rule and not a copy. Gated on rules being confirmed AND the game still being live. Recovery now runs for a game with no submissions - the only kind a stranger can walk up to. Costs no chain reads, asserted.

### In plain terms

The game list already works out, for every game, whether you are allowed to play in
it and whose turn it is. Then it throws that away and prints one bare sentence.

So a player with four games running has to open all four to find out where they owe a
move. And somebody arriving with a wallet and no invitation has exactly one option: pay
1 STX to start a game and hope somebody notices it.

Second gap: a game with no moves yet is the only kind a stranger can walk up to and join.
It is also the only kind the list refuses to describe, because the code that works out the
rules sits inside a branch that only runs once a game has moves in it.

**Cost:** nothing extra. Every number needed is already being fetched and computed.

**The line not to cross:** if the board cannot confirm a game's rules, it must not claim
it is your move. Saying so would be the board asserting a turn under rules nobody agreed
to. Some rows will correctly say nothing.

Two gaps in one function.

**(a) The answer is computed and thrown away.** `loadExplore` already replays
every listed game and recovers its rules — it computes `rules.rules.white`,
`rules.rules.black` and `state.turn` at `app.ts:2354-2372`, having passed
`this.address` in as `viewer` — and then reduces all of it to the string
`` `${state.turn} to move` `` at `:2371-2375`. So the answer to "which of these am
I in, and which am I holding up" is fully derived and discarded, and a
correspondence player with four games must open each to find out where they owe a
move. `connect()` (`app.ts:2230-2243`) never reloads the list either.

**(b) Empty games are invisible.** Rule recovery *and* the
`knownRules(game.rulesHash)` lookup at `app.ts:2360` both sit inside
`if (game.nextSeq > 0)` at `:2351`, so a game with no submissions renders "not yet
known" at `:2420`. **A game with no submissions is exactly a game nobody has
claimed** — the only kind a stranger can walk up to. Recovery works there
(`recover.ts:119-124` builds sides from opener, viewer, anyone and anyone-else) and
costs no extra chain read.

**The fix.** Hoist the `knownRules` lookup out of the `nextSeq` guard first — a
one-line change that lets the board describe its own freshly-opened game with no
search at all. Then run `recoverRules` for empty games too. Add
`mine: 'your-move'|'waiting'|null` and `seat: 'open'|null` to `ExploreRow`
(`app.ts:52-60`), computed from `checkSender`
(`packages/protocol/rules.ts:147-188`) — the same pure function that decides who
may move — and render badges. Sort actionable rows first, and reload from
`connect()`.

> **Gate the your-move badge on `rules.confirmed` AND `state.status === 'live'`.**
> Replay returns `position.turn` for finished games too
> (`packages/replay/replay.ts:406-409`), so without that gate every finished game
> where you hold the side-to-move claims "Your move".

Say two things on screen: that the list is the newest 25 games (the bound at
`app.ts:2350` is real, and a player's game can fall off it), and that the order is
"sorted for you", since a connected and a disconnected viewer see different orders.

**Why it matters** — a visitor with a wallet and no invitation currently has one
path: pay 1 STX to open a game and hope somebody finds it. Afterwards they can see
"Game 7 · xtrata.btc v anyone except xtrata.btc · open seat" and move into it.

**Risks** — overclaiming. A row whose rules cannot be confirmed must not say "your
move"; that would be the board asserting a turn under rules nobody agreed to,
which is the line ADR-0012 draws.

---

## 15. Make the sound survive a phone

**Simplicity 4 · Safety 4 · Bytes ~0.4 KB · Needs a new inscription**

> ### ✅ Implemented — commit `b960247a`
>
> The gesture listener was one-shot; it now persists. iOS's interrupted state is treated as asleep, because a context that is not running will not make a noise. A statechange listener re-renders the panel when the browser takes the sound away, recorded from observation rather than a user-agent sniff.

### In plain terms

You have just built a sound library where any sound can go on any event. Three
faults stop it working where it matters most.

The page listens for your first tap to switch audio on — browsers require that — and then
**permanently stops listening**. A correspondence board is open for hours, so once
anything interrupts the audio it never comes back.

On iPhone, a phone call or switching apps puts audio into a state this code does not
recognise. It is neither "off" nor "on", so the code that would restart it does nothing,
and the panel confidently tells the player that sounds are working while nothing plays.

And nothing watches for the system taking audio away, so the screen never updates.

**Why this matters more than it sounds:** the entire point is a sound arriving on its own,
hours later, while the player is doing something else. All three faults break exactly that
case, and they break it into silence with a panel saying everything is fine — which the
code's own comments name as the worst possible outcome.

Three linked defects in code that landed days ago and no reviewer had looked at.

**(a) The unlock is one-shot.** `Sound.listen()`
(`packages/ui/audio.ts:318-327`) early-returns if `this.wake` is set, and its
handler calls `stopListening()` the moment the context reaches running.
`stopListening` (`:330-339`) removes the listeners and nulls `wake`. Nothing calls
`listen()` again — grep finds exactly one call site, `app.ts:378`. The page arms
its gesture handler once, disarms it, and never re-arms. A correspondence board is
open for hours.

**(b) `interrupted` is not handled.** `unlock()` (`:316-330`) resumes only if
`state === 'suspended'`. iOS Safari uses the WebKit-only `'interrupted'` state
after a phone call, an alarm, or backgrounding — neither suspended nor running —
so `unlock()` does nothing, `emit()` (`:440-442`) schedules into a context that
will never play, and `waitingForATap` (`:152-155`) returns **false**, so
`soundNote()` (`packages/ui/sound-panel.ts:145-160`) says "Sounds play while this
tab is in front" while nothing plays.

That is exactly the failure `audio.ts:168-171` was written to prevent:

> Silence with no explanation is the worst outcome here.

**(c) Nothing watches.** `grep -c statechange packages/ui/audio.ts` is 0, so a
context suspended by the OS changes nothing on screen.

**The fix**, all three inside the sound module, all making the panel's existing
honesty mechanism work rather than adding a feature:

- Delete the `stopListening()` call from the wake handler so the gesture listeners
  persist for the life of the page. They are capture and passive, argued at
  `audio.ts:311-317`, so they cost nothing and cannot interfere with a square
  click. Keep the method for `close()`.
- Widen the comparison in `unlock()` and `waitingForATap` to `state !== 'running'`
  (needing a widened string type, since `AudioContextState` does not contain
  `'interrupted'`). A context that is not running will not make a noise, and that
  is the only question either method asks.
- Add one `statechange` listener when the context is built, calling
  `this.changed()`, so the panel re-renders the moment the browser takes the sound
  away. Where background listening is on and the context has been observed to stop
  while `visibilityState` is hidden, have `soundNote()` say so **from evidence,
  never a user-agent sniff** — a sniff in a permanent artefact ages badly.

**Why it matters** — the thing the module exists for is a sound arriving on its
own, from the chain, hours later, while the player is doing something else. All
three defects break exactly that, into silence with a panel saying everything is
fine. A player who has just spent time assigning voices across fifteen events has
invested in a feature that can stop working with no indication, and the panel is
where they would look.

**Budget note** — the sound group is ~13,596 of its 16,000-byte budget and the
artefact has room for it many times over. Worth watching the sound group's own
budget row rather than the transaction limit, since that is what will fire first.

**Prove it** — `tests/ui/sounds.test.ts` already injects a fake context factory: a
context reporting `'interrupted'` makes `waitingForATap` true and `unlock()` call
`resume`; **a second pointerdown after the first unlock calls `resume` again** —
the regression pinning the one-shot bug; a `statechange` fires an `onChange`
listener.

---

## 16. Stop the runtime's serve-time rewrite from eating the board's primary public fallback

**Simplicity 4 · Safety 3 · Bytes ~0.05 KB · Needs a new inscription**

> ### ✅ Implemented — commit `784f70a9`
>
> PUBLIC_API spells the first host as a join of two pieces, which defeats the rewrite pattern without changing the value. It must stay a join: esbuild folds string concatenation back into a matchable literal, which is why the test is over the BUILT file. The emulator was made faithful too — two of four rules and a relative path is why nobody noticed.

### In plain terms

The board deliberately keeps three different chain servers, so no single company
going down can stop it working. The comments explain that a fourth was removed once
because "the list had one live host and looked like it had two".

The Xtrata site, when it serves your page, rewrites the first server's address in the text
to point at its own. That is reasonable on its own. But the rewrite is a blind
find-and-replace, so it also rewrites the copy sitting in your **fallback list**.

The result: the served page no longer contains that server at all, and two of the three
fallbacks now point at the same place. They fail together.

The existing test cannot catch it, because it checks that the rewrite *happened* — so the
very thing that proves the fallback was lost reads as a pass.

**The fix is one line:** write the address in a way the find-and-replace cannot match.

**Worth being clear-eyed about:** this deliberately sidesteps a protection the Xtrata
operator added, permanently. It is defensible because the board picks the proxy on other
evidence anyway, but it is a decision, not a bug fix.

`packages/chain/endpoint.ts:44-48` holds three interchangeable mainnet hosts with
`api.mainnet.hiro.so` first, and the comment at `:28-43` frames the list as
"insurance against a host being DOWN" — even recording that a dead fourth entry
was removed because "the list had one live host and looked like it had two".

The Xtrata runtime rewrites that literal in any `text/html` it serves (the real
worker is `xtrata-2.0/functions/runtime/html-hiro-rewrite.ts`), and the rewrite is
**textual**, so it does not distinguish a URL the page will fetch from a constant
in a fallback table. The literal survives minification: `dist/xchess.html` contains
the three-host array verbatim, exactly once.

So under the runtime the served bytes no longer contain the board's primary public
host at all, and `endpointsFor` (`:102-114`) unshifts the proxy path on top,
leaving the first two entries both pointing at the proxy. **They fail together.**

Nothing catches it: `tests/runtime/xtrata-runtime.test.ts:164-168` asserts the
rewrite *happened* — the served bytes must not contain the host — so the very
assertion that would have flagged the loss reads as a pass. `ops/LAUNCH.md:65`
ticks "the API base is chosen correctly under the runtime" as done.

**The fix.** Spell the two public Hiro hosts so the rewrite's literal pattern
cannot match while the runtime value is unchanged:

```js
['https://api', 'mainnet.hiro.so'].join('.')
```

A verifier confirmed esbuild folds `'https://api.' + 'mainnet.hiro.so'` back into a
matchable literal but leaves the `join` alone.

> Do **not** use a `[...new Set(bases)]` dedupe. The real worker rewrites to an
> *absolute* URL (`${proxyOrigin}${proxyPath}`, "because rewritten HTML may end up
> inside `blob:` documents"), so the served list is not an exact duplicate and the
> Set would never fire.

Separately, fix the emulator: `harness/runtime/serve.mjs:76-79` and
`tests/runtime/xtrata-runtime.test.ts:37-42` both omit the origin prefix and both
omit two of the worker's four rules. **A faithful emulator would have surfaced this
on its own.**

**Risks** — the `join` spelling depends on esbuild continuing not to fold it
(verified against 0.25.12), so the assertion belongs in `tests/runtime` against the
**built** file, where it fails exactly when the minifier changes. More seriously,
this deliberately defeats a rate-limit protection the Xtrata operator added,
permanently. It is defensible only because `underXtrataRuntime()` (`:74-82`)
chooses the proxy on its own evidence — the injected script tags — and does not
depend on the rewritten string.

**Prove it** — a test applying the corrected rewrite to the built artefact and
asserting the executed page still contains a working spelling of the mainnet host
with `/hiro/mainnet` first. **It fails on the current artefact, which is the proof
the bug is live.**

---

## 17. A wallet matrix runner, built from the step machinery that already exists

**Simplicity 3 · Safety 4 · Bytes none in `dist/xchess.html` · Needs neither**

### In plain terms

The single largest thing blocking this project is a fourteen-row checklist of wallet
tests that nobody has any way to run. Every row still says "not run". One of them — a
sponsored move — is described in your own notes as "the whole product".

Worse, the release gate checks that checklist by searching the file for the words "not
run". So editing the table to say "done" satisfies the gate with no evidence whatsoever,
and typing "pending" satisfies it by accident.

**The good news:** you already built the machinery. The deployment page has steps,
prerequisites, confirmations for irreversible actions, and progress that survives a
reload. It was written to take more than one list of steps, and it already takes two.

**What to build:** a third page that walks the fourteen rows, records the transaction id
and — importantly — which wallet actually served each request, and then writes the results
back out in the checklist's own format.

**The subtle risk:** a test page that signs through its own code proves nothing about the
board. It has to use the identical code the board uses, and that needs to be asserted.

The largest blocking item in the project is a Markdown table nobody has a way to
run. `harness/wallets/MATRIX.md:35-48` is fourteen rows, every one ending
`| not run |`, with a blank sign-off block at `:80-89`. `ops/RISKS.md:57-63` R2 is
critical and open. Row 4 — a sponsored submit carrying the contract-principal post
condition — is described at `MATRIX.md:50` as "the one that has never run
anywhere" and "the whole product".

Worse, `harness/release.mjs:100` detects incompleteness by searching for the
literal string `not run`. **The table's only machine-readable property is a string
whose absence is treated as proof of work done**: marking every row "done"
satisfies the gate with no evidence, and "pending" satisfies it by accident.

Eight reviewers proposed changes depending on the matrix, and not one proposed a
way to run it.

**The machinery exists and is built to be extended.** `packages/ui/gates.ts`
defines `StepDef` (`:35-52`) and exports **two** separate lists, `STEPS` (`:58`) and
`INSCRIBE_STEPS` (`:451`), with every helper taking the list as a parameter —
`initialStates(steps = STEPS)` at `:343`, `blockedBy` at `:362`, `invalidateFrom`
at `:375`, `progress` at `:406`. `packages/ui/canary.ts` already persists progress
across a reload (`:290-330`) and refuses two steps at once because two signatures
take the same nonce (`:352-364`).

**The fix.** Add `WALLET_STEPS` to `gates.ts` and build a third page,
`dist/xchess-wallets.html`, from `apps/wallet-matrix/main.ts` —
`packages/build/build.mjs:163-215` already proves a second self-contained page is a
near-copy. One step per matrix row in the table's order, each carrying the row's
`expected` text as its `why`, with `needs` wiring row 4 behind rows 1-3. The five
refusal rows (10-14: no wallet, locked, cancelled, wrong network, late provider)
are `manual: true` — the page cannot lock an extension, so it states the setup,
waits, and records what the person saw.

Each step records what a hand-edited table cannot be trusted to: the txid, **the
provider entry that actually served the request** (`entry.label`, which
`apps/chess/main.ts:85` already returns in `WriteResult` and every caller
discards), the network, and the build's `htmlSha256`.

> Keep `htmlSha256`, **not** `codeHash`. `codeHash` is sha256 over the esbuild
> bundle alone (`build.mjs:256`/`:313`) and the contract binding lives in the
> separately-stringified config at `:248-258` — so two boards bound to different
> contracts have identical `codeHash`.

Then `copyReport()` emits the MATRIX.md table itself with state/evidence/build
columns, and `harness/gates.mjs` gets a presence-based parser: refuse on any state
outside `pass|fail|n/a|not run`, on fewer than 14 rows, and on any `pass` lacking a
64-hex txid or the literal `no-tx`.

**Risks** — the page signs real transactions with real money, so every signing step
must be `irreversible: true` behind Canary's existing confirmation. The larger risk
is subtler: **a runner signing through its own code path proves nothing about the
board** — it must import the same `requests.ts` and `postconditions.ts`, asserted by
a test over the built page. And a txid proves a transaction happened, not that a
person watched one prompt with the right cap on it; the prompt-behaviour rows
(`MATRIX.md:60-75`) stay human observations and the report must mark them as such.

---

## 18. Run the built artefact in a real browser, headless, as a gate

**Simplicity 3 · Safety 5 · Bytes none · Needs neither**

### In plain terms

Every one of your 662 tests runs in a simulated browser. That simulation has no
layout, no sound, no database and no concept of what a colour actually looks like.

So: whether the board fits on a phone has never been checked. Whether the piece sizing
works has never been checked. Nothing in the sound system has ever run in a real audio
engine. The local storage has never actually opened. And every contrast figure in this
review — including the invisible highlight in proposal 10 — is arithmetic on colour codes,
not a measurement of a real screen.

Your own history says this matters: three bugs were found only once the tests started
reading the built file instead of the source, and every one of them looked correct in every
source file.

**Why this ranks high:** it is the only remaining blocking item that needs no wallet, no
second person and no money. And it turns several proposals here from "trust me" into
"here is a command that fails before the change and passes after it".

**Keep it honest:** a headless browser is not an iPhone. It can prove the layout fits. It
cannot prove audio survives a phone call.

`ops/RISKS.md:65-73` R3 is open ("the runtime emulator has only ever run under
jsdom") and `ops/LAUNCH.md:66` is unchecked. Across eight reviewers and eighty-eight
proposals, nobody offered a way to close either — and **it is the one open blocking
item needing no wallet, no counterparty and no money.**

Every test is jsdom. `vitest.config.ts` has no browser environment and
`tests/runtime/xtrata-runtime.test.ts` reproduces the injection and
`document.write` in that engine. jsdom cannot see what a permanent artefact gets
wrong:

- no layout, so the board overflowing a 390px-tall landscape viewport is invisible
- no container queries, so the `7cqw` piece sizing at `shell.ts:106` is never exercised
- no `AudioContext`, so nothing in the 13,596-byte sound module has run in a real audio engine
- no IndexedDB, so `packages/storage/verified-cache.ts:76` has never opened a database
- no computed styles, so **every contrast figure in this review is arithmetic on hex strings**

Read the accessibility proposals: each ends with "no unit test can see layout, so
this is verified through the harness" by hand — and that has never been run, with
no artefact of it anywhere. `ops/RISKS.md` C5 already records three artefact-only
bugs found *only* once `tests/artifact` started reading `dist/`.

**The fix.** `harness/browser/run.mjs`: start `harness/runtime/serve.mjs --framed`,
drive a headless Chromium over it, assert the handful of things only a real engine
can answer, and register it in `harness/verify.mjs`'s GATES with
`skip: !process.env.BROWSER`, in the idiom already used for `PERFT_DEEP` and `LIVE`.

Assert: the page boots exactly once through the real `document.open`/`write`/`close`
with no console error; at 390×844, 844×390 and 1280×800 the board's bounding box
fits the viewport, `#status` is above the fold, and `scrollWidth <= clientWidth`;
`getComputedStyle` on `.sq--light`, `.sq--dark`, `.pc--white` and the
`.sq--selected` outline with WCAG ratios computed from **resolved** colours; one
glyph's computed font-size is non-zero and scales with the board; `AudioContext`
constructs and `sound.audition` schedules without throwing; `indexedDB.open`
resolves. Plus a screenshot per viewport into `shots/`.

It does **not** attempt a wallet — that is Gate 6 and stays the matrix runner's
job, and the gate's own output must say so.

**Risks** — a browser dependency rots: a Chromium update changes a computed value,
the gate goes red, and the fastest fix is loosening the assertion. Defend by
asserting **properties, never pixels** — "the board fits" and "the ratio is at
least 3:1", never "the board is 428px". And a headless engine is not a phone: it
emulates a viewport, not iOS Safari, so it can prove the layout fits and cannot
prove the audio session survives backgrounding. That limit must be written into the
gate's output, or ticking `LAUNCH.md:66` overclaims.

**Prove it** — the gate is the test and must be shown to fail: remove the
`max-width` from `.board`, rebuild, confirm the 844×390 case reports the overflow
by a named number of pixels. Restore, confirm green.

---

# Tier 3 — strategic, needs a decision

These are good, and each one needs somebody to decide something before it starts.

---

## 19. Read the log from where you left off, and memoise the leaderboard walk

**Simplicity 3 · Safety 3 · Bytes ~1.0 KB · Needs a new inscription**

### In plain terms

Two costs that grow the longer people use the thing.

Every few seconds the board re-downloads the entire game from move one. At today's longest
game, 33 moves, that is one request and completely fine. At 250 moves it is seven, every
few seconds, from every open board.

And clicking the leaderboard tab three times does three complete walks of every rated
game, because nothing is remembered between clicks.

**Be honest about the benefit:** today it is close to zero. Nothing is slow. The entire
argument is permanence — this file cannot be changed later, so the cost of getting it
wrong is paid for as long as the application exists.

**Also worth knowing:** the risk register says a local cache softens this. It does not. The
cache class exists but nothing uses it, so the build strips it out, and the live inscription
contains no cache at all.

**What to defer:** storing computed ratings locally. That would cross the line from
"remember things that can never change" to "remember conclusions", which is the one idea in
this document that brushes against the principle that everything is derived and nothing is
stored. It deserves its own decision, separately.

Two costs that scale with how long people play.

**(a)** `LiveChain.getAllEntries` (`packages/chain/client.ts:310-321`) always
paginates from `let start = 0`, and it is the hot-path read: `refreshQuietly`
calls it every poll (`app.ts:658-661`), as does `load` (`:1238-1241`). So a poll
costs `ceil((n+1)/50)+1`, not the flat 2 ADR-0011 negotiated — true today at 33
entries, 4 at 100, 7 at 250.

The suite cannot see this. `tests/e2e/request-budget.test.ts:51` says verbatim
`// getAllEntries is one page for any game this size, so count it as one` and
asserts only `reads.length <= 2` at `:93`, blind to page count **by
construction**.

**(b)** `loadLeaderboard` (`app.ts:2448-2515`) walks serially at 3+ requests per
ranked game with no memo, and `show()` at `:859` is a bare
`if (tab === 'leaderboard') void this.loadLeaderboard()` — so three tab clicks are
three full walks.

> **R7's stated mitigation is false.** "Local cache accelerates it" —
> `grep -rn CachingReader` over `packages/` and `apps/` returns **only** the class
> definition at `packages/storage/verified-cache.ts:122`. It is tree-shaken, and
> inscription 2988 contains no cache, contradicting `ops/STATUS.md:102`.

**The fix — take the two cheap halves, defer the expensive one.** Add
`getEntriesFrom(game, start)` to `ChainReader` and reduce `getAllEntries` to
`getEntriesFrom(game, 0)` so the verification path is untouched; have
`refreshQuietly` fetch from `this.entries.length` and append. Leave `reload()` and
`reverify()` on the full walk — the button whose whole job is to prove it re-reads
every byte. Memoise `loadLeaderboard` on `getRankedCount` plus a re-check of the
games that were unfinished at the last walk (the ranked index is append-only:
`clar:300-301` writes it once).

> **Defer the persistent rated cache.** It would move `CachingReader` from
> "remembers only what can never change" (`verified-cache.ts:116-120`) to
> "derivations keyed by their inputs" — a design change deserving its own ADR, and
> the closest thing in this document to violating "everything is derived".

Fold in two cheap Profile fixes: route `profile-who` through the same `.btc`
resolution the create form uses instead of the `.toUpperCase()` at `app.ts:2553`,
and make the leaderboard principal cell (`:2505-2511`) a button that opens that
profile.

> Do **not** call `loadProfile` on connect. That schedules a multi-dozen-request
> scan at the moment a wallet is about to broadcast, which is precisely what
> ADR-0011 was written about.

**Be honest about the benefit today: it is near zero.** The longest live game is 33
entries, one page. The whole case rests on permanence — a poll costs exactly 2
requests for a 33-entry game and exactly 2 for a 3,000-entry game, in an artefact
that cannot be patched later.

**Prove it** — make `tests/e2e/request-budget.test.ts` parametric over log length
(40, 120, 300 entries), counting `getPage` calls not `getAllEntries` calls, and
**delete the excuse at line 51**. Today the 300 case is 7.

---

## 20. Make a finished game portable: PGN, FEN and a sealed page

**Simplicity 3 · Safety 4 · Bytes ~1.1 KB in the board · Needs a new inscription**

### In plain terms

Two halves of the same gap.

The app already works out standard chess notation — the format every chess program on
earth reads — on every single screen refresh. It then shows it nowhere. There is no way for
a player to take their game anywhere else.

And a "sealed game" is designed for throughout this codebase and does not exist. Four
separate files mention it in their comments to justify decisions they made. It would be a
single file containing one finished game, complete, that opens in ten years on a laptop
with no internet.

**Why it fits this project particularly well:** you own no server, so you cannot offer a
game as a web page, and a shared link previews as nothing anywhere it is posted. A file
somebody can keep is the version of that promise you can actually deliver.

**A neat side effect:** it solves the "old games are not in the explorer" item without
spending permanent bytes on a browser for four short historical games — you seal them
instead.

**One real bug found along the way:** the notation is numbered wrongly for any game that
does not start from the standard position with White to move.

Two halves of one gap.

**(a) The notation already exists and is rendered nowhere.**
`ReplayState.pgnMoveText` is computed on **every** replay
(`packages/replay/replay.ts:116` and `:418`, from `Position.pgnMoveText()` at
`packages/chess/engine.ts:358-367`), ships in `dist/xchess.html`, and grep across
`packages/ui` and `apps` returns zero hits. The player's only route to notation is
a FEN buried inside a four-sentence prose notice at `app.ts:2304`.

For an application whose premise is that it owns no server, an export path is the
only way a player can take their game anywhere. And `/i/<id>` serves the
inscription's own bytes, so there is no HTML shell to carry Open Graph tags and
adding one would be a server — a shared link unfurls as nothing.

**(b) The sealed game is designed throughout and does not exist.**
`ops/LAUNCH.md:47` lists "sealed-game generation" as not done, and grep confirms no
`SealedChain`. Yet the whole system is shaped around it:

- `packages/chain/client.ts:4-7` — "One interface, three implementations: the live contract, an in-memory mock, and **a sealed game that carries its own log and touches no network**"
- `bns.ts:51`'s `known` option — "A sealed game has these"
- `rules.ts:249` and `:355` justify storing addresses on the grounds that "a sealed board has no network"
- `engine.ts:204` documents SAN as existing "for the PGN a sealed game carries"

Two of the three implementations exist.

**The fix.** Add `packages/ui/share.ts` with a pure `pgnFor(state, meta)` and a
Copy PGN / Copy FEN pair in the Verify panel (`shell.ts:464-468`), reusing the
clipboard-with-visible-fallback of `copyLink` (`app.ts:1010-1024`).

> **Fix a real defect while there.** `Position.pgnMoveText` (`engine.ts:358-367`)
> pairs `sanHistory` two at a time and numbers from 1 unconditionally, assuming the
> standard start with White to move. For a rule set with a custom `startFen`
> (`packages/protocol/rules.ts:39, 51, 112`) where Black moves first, it emits
> `1. e5` where PGN requires `1... e5`. Take the start position's turn and fullmove
> number, both already parsed, or refuse to export non-standard starts and say why.

`pgnMoveText` carries no result token, so append `1-0`/`0-1`/`1/2-1/2`/`*` in the
caller. Escape backslash and double-quote in **every** tag value, not only BNS
names. Where rules are unconfirmed the roster must say `?` rather than name the
opener, since `app.ts:2317-2320` records that the opener is often neither player.
Add `XChessSkipped` (`state.rejected.length`), because a PGN is lossy about the log
and the count is the honest way to say so.

Then build the sealed page behind its **own** entry point, `apps/sealed/main.ts`,
so esbuild never pulls `SealedChain` into the board and never pulls `LiveChain` or
the wallet layer into the sealed page. `packages/build/seal.mjs` reads a game live
once, **refuses** unless status is over and unless rules are confirmed, and emits
`dist/xchess-game-<n>.html` plus its PGN.

**Its first application is the legacy archive.** Seal all four legacy games rather
than spending ~3 KB of permanent board bytes on an explorer section for a 7-move
game, a 2-move game, one opening move and an empty row.

**Why it matters** — a PGN drops into any chess tool on earth and replays, the most
direct possible answer to LAUNCH Gate 8 §79. A sealed page is a finished game as an
object: emailable, keepable, inscribable on its own, openable in ten years on a
laptop with no internet. That is the serverless promise made concrete for the one
artefact players care about keeping.

**Prove it** — `tests/artifact/sealed.test.ts`: build a sealed page from
`harness/fixtures/legacy-mainnet.json`, boot it in jsdom **with `globalThis.fetch`
replaced by a function that throws**, assert the final FEN, result and full move
list render. Then run `harness/serverless-audit.mjs` over the generated file, which
is the mechanical proof it has no host dependency.

---

## 21. A keyboard board: real grid semantics, an announcer, and game review

**Simplicity 3 · Safety 3 · Bytes ~4 KB · Needs a new inscription**

### In plain terms

As things stand, somebody using a screen reader or a keyboard cannot play at all.

The board is not reachable by keyboard. Nothing is ever announced, so a move by the
opponent is silent. And even if you get focus onto a square, the automatic refresh rebuilds
the board every few seconds and throws your place away.

The descriptive labels on each square are already written and already good. They are simply
unreachable.

The same underlying change also delivers the feature everybody misses most: stepping
backwards and forwards through a finished game. That comes almost free, because it is
literally the same operation the application already performs — replay the moves up to a
point.

**Why it is not higher up:** at roughly 4 KB it is the largest single item here, and it does
not fit at all unless the stylesheet saving happens first. That makes it a deliberate
decision rather than an obvious yes.

**The risk to manage:** the change swaps a browser-level lock for one written in code, and
that lock is what stands between a mistaken tap and a wallet prompt.

**The largest single ask in this document, and the reason it is Tier 3: it does not
fit without proposal 2 and a deliberate decision.**

Four compounding defects plus a missing feature, all on the same machinery.

**(a)** `packages/ui/board.ts:160` sets `role=grid` and `:175` sets `role=gridcell`
on all 64 buttons with **no `role=row` between them** — `:236` appends each button
straight onto root — so the grid mapping is invalid and nothing announces which
rank you are on.

**(b)** `board.ts:232` does `button.disabled = !playable`, and when `readOnly` is
true `playable` is false for all 64, so **the whole board leaves the tab order**.

**(c)** There is no keyboard handling at all. `grep -rn keydown packages/ apps/`
returns only `audio.ts:295` and `:303`, and there is no `:focus-visible` rule
anywhere.

**(d)** `board.ts:159` `replaceChildren()` destroys every node, and `drawGame` runs
on every poll (2.5-15s) **and** on selection (`app.ts:2017`) — so focus falls to
body every few seconds, and selecting a piece throws focus off the board.

**(e)** Nothing is ever spoken. `grep` for `aria-live|role=status|role=alert|sr-only`
across `packages/` and `apps/` returns **nothing**. There is not one live region.
And `shell.ts:309`'s `.hide` is `display:none`, which removes an element from the
accessibility tree too.

**(f)** No game review. `drawMoves` (`app.ts:1796-1898`) builds inert `li` elements
from spans, the board always renders `state.position`, and `lastMoveSquares` always
reverses `this.state.accepted` — so a finished game shows a final position and a
list of text you cannot click.

**The fix — one change to the board's rendering contract, which pays for all of
it.** Chunk the already-ordered array (`board.ts:164`) into 8 `role=row` wrappers
with `display:contents` and `aria-rowindex`, plus `aria-colindex` per cell. Replace
`disabled` with `aria-disabled` plus an early return in the click listener at
`:235`, so every square becomes focusable and readable and none becomes clickable
that was not. Add `focusSquare` to `BoardView`, a roving tabindex, and a single
`keydown` listener on root implementing arrows (**in current visual order, so flip
is honoured**), Home/End, PageUp/PageDown, Enter/Space, Escape.

**Capture `hadFocus` before `replaceChildren()` and restore focus after — that is
what makes polling survivable.**

Add a `.sr-only` class and one
`<div id="say" role="status" aria-live="polite" aria-atomic="true">` after
`#status`, driven by a **change-gated** helper.

> `notice()` (`app.ts:748-753`) rewrites `textContent` unconditionally on every
> poll, so a naive `aria-live` on `#status` would re-announce the same sentence
> every few seconds, which is worse than silence. And **name it `say()`, not
> `announce()`** — `ChessApp` already has a private
> `announce(before: ReplayState|null)` at `app.ts:1342`, and the collision will not
> compile.

Then game review rides free on `focusSquare`: make each accepted-move row a button
carrying `record.seq`, add `viewSeq`, and render `replay(prefix, { rules })` — the
**same pure function on a prefix of the same log**, mapping entries exactly as
`derive()` does at `app.ts:1318-1323`. While browsing, force `readOnly` and empty
`legalMoves` so every square is inert.

**Why it matters** — a blind player can arrow the board and hear "rank 8, e8, black
king, in check". The `aria-label` at `board.ts:187-192` is already excellent and
simply unreachable by tab today. A keyboard-only player stops having focus thrown
to the top of the document every 2.5 seconds. And everybody gets the single
most-missed feature: stepping through the game — which is also what makes the
project's own claim legible, since each step is literally "replay the log up to
here".

**Risks** — two real ones. Swapping `disabled` for `aria-disabled` moves the
submission lock from the browser to a JS guard, and that lock is what stands
between a mis-tap and a wallet dialog for a submission replay will skip; assert the
guard directly in `tests/e2e/submission-gate.test.ts`. And any programmatic focus
move driven from `drawOverride` (`app.ts:1621`, on the poll path) must fire on
"panel **just became** shown", never on "panel **is** shown" — get that wrong and
the app steals focus every 2.5s, permanently, which is worse for the target users
than the status quo.

**Prove it** — the regression that matters most: focus e2, run a poll tick,
`document.activeElement` is still e2. Plus: 8 `role=row` elements each holding 8
gridcells; on a `readOnly` board all 64 remain in the tab order; ArrowUp from e2
lands on e3 and after Flip lands on e1; five `drawGame` calls with no state change
leave `#say` untouched.

---

# Tier 4 — worth knowing about

---

## 22. `time!` — end abandoned games with a block-height deadline

**Simplicity 2 · Safety 4 · Bytes ~2 KB · Needs a new inscription · No contract change · Consensus-visible**

### In plain terms

If your opponent simply stops playing, the game never ends. It stays live forever, it
can never count towards ratings, and neither player can do anything about it. The only ways
out are resigning or agreeing a draw, and both need the person who has gone away to come
back.

This adds a five-character message meaning "claim the win, they ran out of time", and a
per-game deadline measured in blocks.

**The genuinely elegant part:** it needs **no contract change at all**. No deployment, no
migration, no new function. Your own protocol document anticipated exactly this and says
the contract must not change for it. That is the original design paying off a second time,
which is worth demonstrating.

**Why it is last:** it permanently changes what a game means, so it must be got right the
first time. It also interacts with proposal 13 — adding a setting makes games harder to
recover — so the deadline has to be limited to a few fixed values, and this must ship after
that fix.

**The most likely mistake:** a creator choosing a short deadline and building a game that
ends while their opponent is asleep, with no way to undo it.

A game where the opponent stops has no ending. Replay reaches no result so the game
is permanently live, it can never satisfy `ranked-v1` condition 8
(`packages/ratings/eligibility.ts:103`), and the pairing is stuck forever because
`submit` has no turn gate, no state gate and no expiry — ADR-0012 says so in terms
(`ops/DECISIONS.md:808`). The only exits are resignation and draw agreement, both
needing the absent player to act.

**The ingredient is present and unused.** Every submission carries the
chain-assigned height (`clar:159`), the client passes it into replay
(`app.ts:2363`), and replay carries it on every record
(`packages/replay/replay.ts:264-266`) without a single decision reading it.

The verifier could not knock this down: `EVENTS-V1.md:127-137` pre-authorises
exactly this shape — a new control string is `events-v2`, games commit to their
protocol, and "**The core contract does not need to change, and must not.**"

**The proposal.** A fourth control string, `time!` — exactly five characters, so it
passes the contract's only filter (`clar:541-542`) unchanged, and `ti` is not a
square so it can never parse as UCI (the same argument that protects `resgn` and
`draw?`). `rules-v2` appends an eleventh line, `deadline`, a decimal block count
with 0 meaning none. `replay-v2` handles it in the events branch
(`replay.ts:285-345`) in this frozen order: allow list → `sideOf` or not-a-player →
no-deadline → no-reference → not-waiting → too-soon → accept, with the claimant
winning and termination `timeout`.

Every input is in the log, so replay stays pure and total.

> **The load-bearing coupling nobody flagged.** A `rules-v2` deadline is an
> eleventh committed field, and `packages/protocol/recover.ts:90-97` says the
> search covers "two named sides, or an open board, from the standard position —
> and nothing else", with "every extra dimension multiplies the space". So a timed
> game becomes unrecoverable from the chain alone the moment its creator's
> localStorage is cleared. **Constrain the deadline to a tiny enumerable set** — 0
> plus four fixed values — so `recoverRules` can still search it.
>
> This must ship **after** proposal 13. And any open-challenge idea (a first-comer
> side) must ship after **this**, or you get "let any stranger bind themselves to
> your ranked game with one legal move and walk away, permanently".

**Why it matters** — abandoned games end, which is the difference between a rating
system that settles and one that accumulates permanent unfinished pairings. And it
gives the product a real time control in the only unit both players can verify
without trusting a clock.

Note what it does **not** need: no new contract function, no argument, no
deployment, no migration. The `events-v1` argument paying off a second time, which
is worth demonstrating.

**Risks** — a deadline is committed in a hash nobody can edit, so a generous
default matters more than the feature does: a creator who picks 100 blocks has
built a game that ends while their opponent is asleep, with no fixing it
afterwards. The reference height must be the last **accepted** entry, or a
stranger's rejected junk resets somebody's clock. And a game with an empty log has
no reference and never times out, which is honest but is the commonest case a
poster will hit, so say it at creation.

**Prove it** — the legacy test asserting **opposite readings of one byte string
under the two events protocols** is the one that must never be deleted. Exactly as
ADR-0007 does for `resgn`.

---

## 23. Write the post-launch runbook and a permanent errata list

**Simplicity 4 · Safety 5 · Bytes none · Needs neither**

> ### ✅ Implemented — commit `25dc5ea3`
>
> ops/RUNBOOK.md organised by lever, with all five owner-gated functions, their bounds and what they do not affect. ops/ERRATA.md lists what is permanently wrong with 2988. The lever list is pinned by a Clarinet test that reads the contract, so a sixth setter fails with a message naming the runbook.

### In plain terms

Everything written down describes getting **to** launch. Nothing describes running a
permanent thing, which is what this has been since August.

So the question this architecture makes unavoidable has no written answer: a bug is found
in a file that cannot be changed — now what?

The answer is knowable and small. There are exactly eight settings the owner can still
change with a single transaction, and everything else means a new contract and a new
inscription, or means nothing can be done at all. Nobody has ever written those eight in
one place.

**One finding here deserves promoting on its own.** A sponsorship expires about
fifteen hours after it is funded, and once expired, **anyone at all** can end it. Not just
the players — anyone. After that the game can never be sponsored again by anybody, and the
leftover money becomes withdrawable by you. So a live correspondence game's funding can be
permanently killed by a passing stranger after half a day, and the operator has a financial
incentive to do it.

Your risk register currently says "no game's reserve is ever stranded", which reads as
reassurance against exactly this.

**Part of the fix is free:** one owner transaction extends the expiry. The rest needs a new
contract and can wait.

Every operational document describes getting **to** launch. `ls ops/` is STATUS,
LAUNCH, RISKS, DECISIONS, RELEASES and measurements — nothing about operating a
permanent thing, which is its state since 2026-08-09, and no ERRATA. The gates page
is a one-way ratchet: `packages/ui/gates.ts` `INSCRIBE_STEPS` end at `first-move`
(`:531-540`) with nothing after.

So the question the architecture makes unavoidable has no written answer: **a bug
is found in 130,782 bytes that cannot be changed — what happens?**

The levers are knowable, small, and nowhere written together: `open-fee`
(`clar:103`, set at `clar:661`), `bootstrap-amount` / `rebate-amount` / `rebate-count` /
`sponsor-margin` (`clar:115-118`, set at `clar:675`), `expiry-blocks` (`clar:119`, set at
`clar:705` — **and note this one has no ceiling assertion, unlike the others**), plus
`withdraw` (`clar:651-659`) and `transfer-ownership` (`clar:722-736`). That is eight
levers, not six.

**The fix.** `ops/RUNBOOK.md` organised **by lever** rather than by scenario,
because the lever set is what is finite.

1. **What can change**, in order of cost: nothing (a display bug in the inscribed
   page); one owner transaction (each of the eight levers, its Clarity function, its
   ceiling or the honest absence of one, and its effect on already-funded games); a
   new contract plus a new inscription (anything else, at the cost of splitting the
   user base); and **nothing anybody can do** (a replay defect that has already
   produced a wrong result for a completed game — the log is the log).
2. **Triage**: does it affect money, a result already recorded, or only display.
3. `ops/ERRATA.md`, per inscription id, append-only. Seed 2988 with the
   runtime-rewrite fallback loss (proposal 16) and the reduced-motion selector
   (proposal 10).
4. **The deferred decisions written as decisions with triggers, not open
   questions**: is `xchess-core-v1-canary` the production contract
   (`README.md:462-469` defers it, while `LAUNCH.md` Gate 7 already sequences a
   production contract *after* the canary inscription), and under what circumstances
   ownership would ever be renounced.
5. **The contract work deliberately not being done, and why.**

> **One finding from this section deserves promoting.** `expiry-blocks` is 4320
> (~15-19 hours post-Nakamoto), which is shorter than a correspondence game — and
> `settle-sponsorship` (`clar:581-605`) asserts only `(not settled)` and
> `(>= stacks-block-height expiry)`. **Any principal may call it.** After that,
> `top-up-sponsorship` refuses at `clar:443` and funding refuses at `clar:356`, so that
> beneficiary can never be sponsored on that game again by anyone, and the leftover
> becomes withdrawable treasury.
>
> So a **live** correspondence game's rebate reserve can be permanently and
> irrecoverably killed by a passing stranger after about half a day — and the
> operator has a direct financial incentive to do it. `ops/RISKS.md` R10's "no
> game's reserve is ever stranded" currently reads as reassurance against exactly
> this.
>
> **Part A is free**: send `set-expiry-blocks(120960)` from the owner, one
> transaction. Part B — refunding the remainder to `funded-by`, adding
> MIN/MAX-EXPIRY-BLOCKS, extending expiry on each rebate — needs a new contract, and
> refunding overturns a published decision (`SPONSORSHIP-V1.md:170-174`:
> "Settlement moves no money").
>
> **If Part B is ever built:** `settle-sponsorship` today moves no money and
> `packages/chain/client.ts:566-573` declares `contractSends: 0n` for it. Making it
> refund turns it into a paying call, and shipping the contract without changing
> that guard **reproduces ADR-0008 exactly** — every settlement aborts after the
> contract has already succeeded.

**Risks** — a runbook written from source rather than experience can be confidently
wrong about what a lever does. Check each entry against
`tests/clarity/core.test.ts`, which already exercises the setters. The renouncement
decision is genuinely irreversible and must be presented with a bias against, not
as a routine option.

`set-expiry-blocks` applies only to rows funded or topped up **afterwards**, because
expiry is captured absolutely at `clar:364` — so publish the expiry of every live
sponsorship and top up any still in play.

**Prove it** — assert in `tests/clarity/core.test.ts` that the set of owner-gated
public functions is exactly the set the runbook enumerates, so a new setter cannot
be added without the runbook failing a test.

---

---

# Part two — from the first testers

Ten further proposals, from feedback by **peacelovemusic.btc** and
**3hunnatheartist.btc** during game 8 on mainnet, 2026-08-12.

The full working record — what was said, what each item turned out to be,
reproductions for the two defects, the sequencing, the test plan and the five
decisions that block four of these — is in
[`ops/feedback-2026-08-12/`](feedback-2026-08-12/README.md).

**Two of these are confirmed defects that nobody had found**, in the live
inscription now, neither visible to 662 tests, a 590-million-node perft run, or
eight reviewers reading the source. That is the argument for doing this again
with more players.

---

## 24. Every square on the board is the wrong colour

**Simplicity 5 · Safety 4 · Bytes none · Needs a new inscription**

> ### ✅ Implemented — commit `a893ea24`
>
> `packages/ui/board.ts` now reads `(file + rank) % 2 === 1`, anchored on a1 with
> a comment naming the test so it cannot be "tidied" back.
> `tests/ui/board-colour.test.ts` asserts chess rather than arithmetic: both
> queens on their own colour, all four corners, and colours surviving a flip.
> `tests/artifact` guards the shipped bundle by matching the parity test against
> the class it decides, which survives minification.
>
> **Proven to fail first:** six of the seven cases go red against the old
> expression. The seventh — thirty-two squares of each colour — passes either
> way, and is kept precisely because it shows counting would never have caught
> this.
>
> **Reaches players at the next inscription, not before.**

### In plain terms

The testers reported that the queens start on the wrong squares. They were right
that something is wrong and reasonable about the cause, but the cause is
bigger and simpler: **the whole board is drawn in inverted colours.**

a1 comes out light when it must be dark. h1 comes out dark, when "light square on
your right" is the first thing every player learns. The white queen belongs on
d1, a light square, and this board draws d1 dark — so she looks like she is on
the wrong colour, which is exactly how a chess player would describe it.

**The pieces are fine.** The engine is verified against 590 million positions and
no game's result is affected. This is purely how it is painted. But it is painted
that way on the first screen, for everybody, permanently.

**Why it survived:** nothing anywhere asserts what colour a square should be. The
expression looks perfectly reasonable, which is why a test that restates the
arithmetic would be useless — the test has to assert chess.

### The problem

`packages/ui/board.ts:169` is `const dark = (file + rank) % 2 === 0`. `FILES` is
`'abcdefgh'` (`board.ts:90`), so `file` is 0-indexed while `rank` is the literal
digit 1–8. For a1 that is `(0 + 1) % 2 === 0` → false → light. All sixty-four
squares are inverted. Truth table and a runnable check in
[`ops/feedback-2026-08-12/02-FINDINGS.md`](feedback-2026-08-12/02-FINDINGS.md).

### The proposal

`const dark = (file + rank) % 2 === 1;`, with a comment naming a1 as the anchor
so the next reader cannot "tidy" it back.

### Steps

1. Change the expression at `packages/ui/board.ts:169` and comment the anchor.
2. Add `tests/ui/board-colour.test.ts` asserting a1/h1/a8/h8 dark-light-light-dark
   plus d1 light and d8 dark — the two queens' home squares, which is the check a
   player actually performs.
3. Add a flip-invariance case: rendered flipped, a1 is still dark.
4. Assert in `tests/artifact/` that the built bundle contains no
   `(file + rank) % 2 === 0`.

**Files** `packages/ui/board.ts` · `tests/ui/board-colour.test.ts` ·
`tests/artifact/artifact.test.ts`

### Risks

It changes the appearance of every board every player has ever seen, permanently.
That is the correct change, but it means the screenshots in `shots/` are all of
an inverted board and should be retaken. Check it through
`npm run serve:runtime -- --framed` before inscribing, because jsdom has no
colours.

### How to prove it

The six assertions must **fail before the fix**. If they pass, they are asserting
the code's arithmetic rather than chess, and they are worthless.

---

## 25. The endpoint failover never comes back

**Simplicity 4 · Safety 4 · Bytes ~0.2 KB · Needs a new inscription**

> ### ✅ Implemented — commit `fb7d2ced`
>
> The request loop wraps instead of walking one way, and the preference now
> **expires after a minute** — wrapping alone never brings the primary back,
> because once pinned to the second host that host answers first. `preferredAt`
> records when the preference moved, not when it last worked, or every successful
> request would restart the window. A rate limit is also believed on evidence now
> (a `Retry-After`, or an allowance header reading zero) rather than only on a
> literal 429.
>
> **Proven to fail first:** three of four new cases go red against the old loop.
> The fourth — every base tried at most once per call — passes both ways and is
> kept because the wrap is exactly the change that could cause a retry loop.
>
> **Worth knowing:** a byte-saving edit made during this work introduced a real
> bug. `Number(null)` is `0`, so dropping a null guard read every header-less
> response as an exhausted allowance. The new test and an existing one both caught
> it. Trading correctness for bytes under pressure is how that happens.

### In plain terms

A tester tried to switch from game 8 to game 1 and got *"Could not reach any
Stacks endpoint… The chain is fine; this page cannot see it."* The chain was
indeed fine. So were two of the three servers the board keeps.

The board holds three interchangeable chain hosts so that no single company can
take it down. But the failover only ever moves **forwards**. Once it drops from
the first host to the second it never returns, even when the first recovers, and
it never tries a host earlier in the list again. After a couple of bad moments it
is pinned to the last host — at which point the redundancy is gone and any wobble
in that one host looks like the whole chain being unreachable.

**Why it showed up when switching games:** nothing about switching is special.
What is special is time. The board polls every few seconds, so a long session
gives the ratchet plenty of chances to advance. By the time they clicked Open,
there was one host left to try.

Reproduction you can run in
[`ops/feedback-2026-08-12/02-FINDINGS.md`](feedback-2026-08-12/02-FINDINGS.md).

### The problem

`packages/chain/endpoint.ts:214` is
`for (let attempt = index; attempt < bases.length; attempt++)`. It starts at the
remembered base, so earlier bases are never retried, and `index` is only ever
assigned forward on a successful fallback, so a recovered host is never returned
to. The file's own comment (`endpoint.ts:28`) says the list exists so that no host
becomes "a permanent dependency of a permanent artefact" — which is precisely
what the last entry becomes.

### The proposal

Try every base per call, starting from the remembered one and wrapping:
`const attempt = (index + n) % bases.length`. Then let the preference decay —
reset `index` to 0 on the first failure of the pinned base — so a recovered
primary is actually returned to.

Separately, `limited` is only set on a literal 429 (`endpoint.ts:228`), so a host
that rate-limits by answering 503 is reported as chain unavailability. Those need
different advice: one says wait a minute, the other says something is wrong.

### Steps

1. Rewrite the loop at `packages/chain/endpoint.ts:214` to wrap.
2. Reset `index` when the pinned base fails, so the preference decays.
3. Widen the rate-limit signal beyond a literal 429 where the evidence allows.
4. Add three cases to `tests/chain/endpoint.test.ts`: falls forward, comes back,
   and — the one that fails today — pinned to the last base with earlier bases
   healthy, the request succeeds.
5. Re-run `npm run test:artifact`, because master proposal 16 touches this same
   list.

**Files** `packages/chain/endpoint.ts` · `tests/chain/endpoint.test.ts`

### Risks

This is the read path for everything. A wrapping loop can turn one dead host into
N attempts per call, so the per-call attempt count must stay bounded at
`bases.length` and be asserted. Read alongside master proposal 7, which is about
not spending the request budget.

### How to prove it

Assertion 3 above throws `CHAIN_UNAVAILABLE` today after trying exactly one host.
That is the tester's bug, and it is the test to write first.

---

## 26. Coordinates around the board

**Simplicity 5 · Safety 4 · Bytes ~0.4 KB · Needs a new inscription**

> ### ✅ Implemented — commit `cbeae473`
>
> Drawn in the corners of the edge squares rather than in a ring, so it costs no
> vertical space and cannot fight master proposal 10's landscape work. The
> position comes from the index in the array the squares are already drawn from
> and the text from the square's own name, so a flip carries both — asserted:
> flipped, the bottom-left square is h8 and carries an `8` and an `h`.
>
> **Contrast was measured, and the obvious choice was wrong.** Tinting with the
> opposite square colour reads 2.82:1, a smudge at this size. `--ink` on a dark
> square is 5.22:1 and `--bg` on a light one 8.2:1, both already-existing
> variables, so the better answer also cost nothing. `max(8px, 2.1cqw)` floors
> the size, since 2.1cqw on a narrow phone is about five pixels.
>
> Checked visually at 320px and 150px, both orientations, through the real
> renderer and stylesheet — jsdom has no layout and this is permanent.

### In plain terms

> "Please can we add grid markings A-G, 1-8 around the edges of the board?"

Files are a–h, so eight of them. There are none at present.

The part not to get wrong: the board flips, so the labels have to flip with it. A
static label row on a flipped board is worse than no labels, because it is
confidently wrong.

### The proposal

Render a file row and a rank column derived from the same ordered array the
squares come from (`board.ts:164`), so flipping cannot desynchronise them. Mark
them `aria-hidden` — each square's accessible name already carries its coordinate
(`board.ts:187`), and a screen reader should not read the grid twice.

### Steps

1. Build the labels in `renderBoard` from the same `ordered` array.
2. Add grid rules to the shell CSS beside the existing board block.
3. Add a flip case to the board tests.
4. Check the landscape fit through the browser gate.

**Files** `packages/ui/board.ts` · `packages/ui/shell.ts` · `tests/ui/`

### Risks

It costs vertical space, and master proposal 10 has already found the landscape
phone layout to be the tightest dimension in the application. **Land these two
together** — separately means measuring the same layout twice and possibly
shipping a board that no longer fits.

---

## 27. Deep links to a game, and getting back to one

**Simplicity 4 · Safety 4 · Bytes ~0.8 KB · Needs a new inscription**

### In plain terms

> "The biggest quirk is finding the game once you've left the screen."

There is no history and no list of your own games. Once you leave a board, the
only way back is retyping its number.

**The deep-link half is already built, and cannot work until the next
inscription.** Tested 2026-08-12: `https://xtrata.xyz/i/2988?game=8` lands on
Play with "no game loaded". Not a defect — `openFromLink` reads `?game=` and the
Xtrata site forwards the query, but that function landed on 2026-08-10 and
**2988 was built on 2026-08-09**. The live board never had it. It now has
regression tests at the real URL shapes, which nothing covered before.

What is missing regardless: somewhere the board remembers the games you have
opened, and a link the board itself produces correctly — which is master
proposal 8, currently broken for exactly the people who can move.

### The proposal

A short recent-games list, kept locally, shown on Play and in Explore, surviving
a reload and capped. Plus, if the tidy `2988-8` form is wanted, about five lines
in `normalizeTokenId` (`handler.ts:41`) to split on `-` and set `game` in the
forwarded query — **in `xtrata-2.0`, a different project with its own review**.

### Steps

1. ~~Open `https://xtrata.xyz/i/2988?game=8` and record the result.~~ **Done
   2026-08-12** — it does not work live, because 2988 predates `openFromLink`.
   No code needed; it ships with the next inscription. Covered by tests in
   `tests/e2e/shared-link.test.ts`.
2. Add recent games to the disposable local store, capped, newest first.
3. Render them on Play and Explore, with the game number and state.
4. Extend `tests/e2e/shared-link.test.ts` with a fixture at the **real runtime URL
   shape** — every fixture there today uses a plain address, which is why master
   proposal 8's defect survived.
5. Only if wanted: the `2988-8` path form, in `xtrata-2.0`.

**Files** `packages/ui/app.ts` · `packages/storage/verified-cache.ts` ·
`tests/e2e/shared-link.test.ts` · (separately) `xtrata-2.0/functions/inscription/handler.ts`

### Risks

Recent games are a convenience and must never become authoritative — the list is
a set of game numbers, never a cached position. A list that empties itself when
the chain has a bad moment loses your games at the worst possible time, so it must
survive a game being briefly unreachable.

---

## 28. Explore: search, filter, and the facts a spectator needs

**Simplicity 3 · Safety 4 · Bytes ~1.5 KB · Needs a new inscription**

### In plain terms

> "a searchable, filterable explore section that is also very useful for finding
> your own games as well as searching for other games you might like to watch"

> "which address or BNS created each game? Sponsorship details including who and
> how much and what remains"

Explore lists the newest 25 games with no search, no filter, and no idea which
are yours.

Almost everything needed is **already fetched**. Master proposal 14 already
computes whether you can play in each game and whose turn it is, then discards
it. The creator is already in the row. The sponsorship's remaining rebates and
its **expiry** are already decoded (`packages/chain/client.ts:58`) — and no
interface file reads that expiry at all.

That last one is not cosmetic. A sponsorship expires about fifteen hours after
funding, and once expired **anyone at all** can end it permanently. Showing
"expires in about four hours" is the difference between a sponsored game a player
can protect and one that quietly dies.

**Build this as one piece of work with master proposal 14** — this is largely the
presentation of what that proposal computes, and splitting them means touching
`loadExplore` twice.

### The proposal

Filters for mine / open / live / finished / ranked, computed from `checkSender`
so there is one rule and not a second copy. Search by game number or player,
which must reach **past** the newest-25 bound at `app.ts:2334` and say how it
found something outside the window. Creator shown by BNS name where one resolves.
Sponsorship shown as who, how much is left, and how long it has.

### Steps

1. Do master proposal 14 first, or at the same time.
2. Add the filter set, driven by `checkSender`.
3. Add search that falls back to a direct `getGame` for a number outside the
   window, and says so on screen.
4. Render creator and sponsorship, with expiry as a duration and never a block
   height.
5. Assert in `tests/e2e/request-budget.test.ts` that filtering and searching add
   **zero** reads over the existing burst.

**Files** `packages/ui/app.ts` · `packages/ui/shell.ts` · `tests/e2e/explore.test.ts` ·
`tests/e2e/request-budget.test.ts`

### Risks

Search is the one part that can spend chain reads without limit. Bound it: one
direct lookup for an out-of-window game number, never a walk. If the zero-extra-reads
assertion is hard to write, the feature has been built wrong.

---

## 29. Which game am I watching, and is it my move somewhere else

**Simplicity 3 · Safety 4 · Bytes ~1.2 KB · Needs a new inscription**

### In plain terms

Two asks that share machinery.

> "clear markings / visual feedback showing which game is currently being
> viewed/heard"

The testers run several tabs at once and every tab looks identical. The document
title never changes, so the browser tab strip — the one place a person actually
tells tabs apart — says nothing.

> "is there also a way that we could add something to update a player in one game
> that it is their move in another game?"

Yes, with one honest limit stated up front: **no server means no push
notifications.** A tab has to be open. What is achievable is "this open tab also
watches your other games and tells you", not "your phone buzzes". The board
already polls while hidden when a live game is loaded and sound is on
(`app.ts:98`), and the sound system already exists — what is missing is that it
only ever watches the game in front of you.

### The proposal

Put the game number and whose turn it is in `document.title`. Then, for a
connected address, poll a short list of that player's other live games at the
background rate, and say so when one of them turns — in the Explore badge from
proposal 14, in the title, and through the existing sound system.

### Steps

1. Set `document.title` from the loaded game and turn; restore it on leaving.
2. Derive the watch list from the games the connected address can play in.
3. Watch at the background rate only, never the foreground rate.
4. Announce a turn once, and never again for the same state.
5. Assert per-tick read count against a fixed ceiling with four games loaded.

**Files** `packages/ui/app.ts` · `packages/ui/sounds.ts` · `tests/e2e/`

### Risks

**This is the one item in the feedback that wants to spend more of the request
budget**, while master proposals 7 and 19 are both about spending less. The watch
must be cheap per game and must stop entirely when no wallet is connected.

The other risk is nagging: a watcher that re-announces the same unchanged state
every twenty seconds is worse than none. The silent-when-nothing-changed
assertion is the load-bearing test, and it is the same property master proposal 21
needs for its screen-reader announcer — build it once.

---

## 30. Chat, comments and presence

**Simplicity 2 · Safety 2 · Bytes unknown until decided · Needs a decision, and probably a new contract**

### In plain terms

> "Players have requested a chat panel (some said for 'trash talking')"

Wanted, and it hits the two hardest constraints in the project at once.

**On chain, through the current contract, is not awkward — it is impossible.**
`submit` takes `(string-ascii 5)` (`contracts/xchess-core-v1.clar:535`). Five
characters. A message cannot be represented at all, so this needs a new contract
whatever else is decided.

**Off chain means a server**, which the serverlessness audit mechanically refuses
in shipped code, and which breaks the one claim the whole project rests on.

On presence, the honest answer is a qualified no: a live green dot needs a
heartbeat, and there is nowhere to put one. What *is* free and truthful is
**derived** — "last moved about four hours ago, usually replies within a day",
computed from block heights already fetched. In correspondence chess that is
probably the more useful fact anyway.

**This cannot start until decisions D1, D2 and D3 are settled.** They are written
up with options, costs and a recommendation in
[`ops/feedback-2026-08-12/05-DECISIONS.md`](feedback-2026-08-12/05-DECISIONS.md).

### The one property to fix now, whatever is decided

**The board must work with the message layer entirely absent.** Point it at
nothing, or at a host that refuses everything, and every existing test still
passes. Write that assertion before anything else; it is what stops a chat
feature quietly making a server load-bearing.

---

## 31. Wagers, winner takes the pot

**Simplicity 1 · Safety 1 · Needs a decision and a new contract**

### In plain terms

> "Can we add ability for users to add a wager to their games? Both parties lock
> some stacks into the contract and the winner takes all?"

Locking the stake is easy — the contract already holds STX and proves solvency
after every operation. **Paying it out is the hard part, and it is hard in a way
that can lose somebody real money.**

The contract cannot know who won, and must never learn: "the contract may filter,
never adjudicate" is the invariant everything rests on.

There is a function called `claim-result` that looks like the answer. It is not,
and its own comment says so — it is an unvalidated hint, and "a dishonest hint
costs its sender a network fee and convinces nobody". True for a hint. Attach
money and it becomes **whoever claims first takes the pot**, because the first
claim wins the slot and cannot be overwritten (`clar:621`). A losing player who
claims quickly wins the money.

So this needs a real adjudication design. The shape most likely to survive is
both players signing the outcome, with a fair timeout for the one who walks away —
and that timeout is the same hole master proposal 22 (`time!`) was designed to
fill, so **build the clock first and this gets much simpler**.

**Blocked on decision D4**, which lays out four options and what each costs.

**Do this last.** Everything else in this list makes the application better. This
is the one that can make it harmful.

---

## 32. Tournaments

**Simplicity 2 · Safety 3 · The standings are nearly free; the prize pool is blocked**

### In plain terms

> "Check we can set up a tournament … that can be its own referee and compute the
> results at the end … then we can have a tournament with a prize pool/bounty"

This splits cleanly, and the good half is available now.

**Nearly free:** a tournament is a set of games. Standings are already derivable
from the chain — `ranked-v1` decides which games count and `elo-v1` computes the
ratings, both purely by replay. "Its own referee" is a fair description of what
replay already is. A named group of games plus a derived standings table needs
**no contract change at all**.

**Blocked:** the prize pool, which is decision D4 again. Paying somebody means
knowing who won.

### The proposal

Build the derived half: a tournament as a named set of game ids, with standings
computed by the existing rating code and a shareable link. Test it offline against
the frozen real games from master proposal 6 — a fixed set of games must produce a
hand-checked table.

Leave the pot until D4 is settled.

---

## 33. A faster game mode, inscribed at the end

**Simplicity 1 · Safety 2 · Needs a decision and a new contract**

### In plain terms

> "a faster game mode where the results are inscribed only at the end … using
> stacked hashing throughout the game to ensure the start and end hash match …
> rather than inscribing every move the whole match json is inscribed at the end"

**A good instinct, correctly reasoned.** What is being described is a state
channel, and the stacked hash is exactly the right primitive — the project already
has one, since the Xtrata chunk chain is `sha256(running || chunk)`
(`packages/protocol/sha256.ts`).

Two things it has to answer:

**Abandonment.** With no moves on chain during play, a losing player just stops
signing and the game has no ending. Same hole as the wager, same answer: it needs
a clock first.

**The reconstruction promise.** The architecture guarantees that the chain plus
the published documents are enough to rebuild every game. A final hash alone
breaks that — unless the full signed move list goes on chain at the end, which is
what the tester actually proposed. That works, and it is a different storage shape
from the five-character entries, so it means a new contract or an inscription per
game.

**It composes well with master proposal 20's sealed game**, which is already "one
finished game as a self-contained object". Building that first makes this much
smaller later.

**Blocked on decision D5**, whose recommendation is *not yet* — and to find out
first whether pace is really what stops people playing. The testers said finding
games was the problem, not slowness.


# Suggested order of work

The dependencies are real, and two of them are load-bearing.

### First — done

**`https://xtrata.xyz/i/2988?game=8` was tested on 2026-08-12. It does not work
live**, and the reason is that inscription 2988 was built the day before
`openFromLink` was written. The code is correct and is now pinned by tests at the
real URL shapes; the fix is the next inscription, not an edit.

What remains of proposal 27 is the half a link never solved: **getting back to a
game you have left.**

### Now — free of permanence, no inscription, no contract

Eight proposals — 1, 3, 4, 5, 6, 17, 18, 23 — none of which can break anything
live.

**Start with 1** (the chunk budget). It is the only 5/5 in the document, it takes
an afternoon, and it is what gives every other byte cost a denominator.

Then in any order: **4** (reconcile ops/), **6** (freeze the live games), **3**
(deterministic build and the ledger), **18** (browser gate), **17** (matrix runner),
**23** (runbook and errata).

**5** (restore the sponsorship constants) is one owner transaction and should not
wait — the product's headline feature is currently sold in a two-rebate
configuration.

**23** carries a second free owner transaction: `set-expiry-blocks`.

Fix **24** and **25** in the tree at the same time. Both are defects in the live
inscription and both are small, but neither reaches a player without a new
inscription — so they wait for the batch rather than being pushed out alone.

### Next — batch into one new inscription

Never ship these one at a time. Each inscription costs money and splits the user
base, so the whole batch goes together:

Start with the four things that are actively wrong in 2988 today — **24** (board
colours), **25** (endpoint ratchet), **13** (recovery cap) and **16** (the eaten
fallback) — then **7**, **8**, **9**, **10**, **11**, **12**, **14**, **15**.

Then the navigation batch, which is the whole of the testers' central complaint:
**26**, **27**, **28**, **29**. Two pairings matter here. **26 goes with 10**,
because both change the board's landscape sizing and doing them apart means
measuring the same layout twice. **28 goes with 14**, because 28 is largely the
presentation of what 14 already computes and discards.

**2** can land anywhere in this batch. It is worth 9.4 KB of permanent weight on
its own terms, and nothing waits on it.

Rough budget:

```
today                                     131,052 bytes   8 of 32 chunks
proposals 7-16                              ~4,400
proposals 26-29                             ~3,900
proposal 2                                  -9,418
                                          ---------
                                          ~129,900 bytes   still 8 of 32 chunks
```

Even without proposal 2 the whole batch is about 139 KB — nine chunks, and still
comfortably one upload transaction. The budget is not what constrains this work.

### Then — decide, then build

**19**, **20**, **21** each need a decision before they start. **21** is ~4 KB, the
largest single item here — which is a reason to decide on it deliberately, not a
reason it cannot fit.

### Later — a protocol version

**22** is `events-v2`, and must ship **after 13**. It needs three new frozen
protocol documents and a golden vector set, and it changes what a game means
forever.

### Blocked — five questions, then four proposals

**30** (chat and presence), **31** (wagers), **32**'s prize pool and **33** (fast
mode) cannot start until decisions **D1 to D5** are settled. Each is written up
with real options, what each costs, and a recommendation, in
[`ops/feedback-2026-08-12/05-DECISIONS.md`](feedback-2026-08-12/05-DECISIONS.md).

Take **D1** first — it decides where words live, and it is the one that can
quietly cost the project its serverless claim. Take **D4** last: the contract
cannot know who won a game, so a wager built before that is settled is the one
change here that could lose somebody real money.

**32's derived half needs no decision.** Tournament standings already fall out of
`ranked-v1` and `elo-v1` with no contract change at all. Only the pot is blocked.

---

# Tier 5 — found by using it, 2026-08-14

Three proposals that this review could not have produced, because each came from
watching the board be used rather than from reading it.

---

## 34. Bound the leaderboard walk, which grows without limit

**Simplicity 3 · Safety 2 · needs a decision · ~0.5 KB**

### In plain terms

The leaderboard reads **every ranked game there has ever been**, one after
another, every time somebody opens the tab. That is fine with nine games. It is
not a thing that gets slowly worse; it is a thing that stops working.

### The problem

`loadLeaderboard` walks `0..getRankedCount()` and for each one reads the ranked
index, the game row and its whole log — about three round trips a game,
sequentially, with no window at all.

Measured today: the explorer costs **51 reads** for its 25-game window and the
same 51 for a contract with 100 games, because the window bounds it. The
leaderboard has no equivalent. At 100 ranked games it is roughly 300 sequential
reads: **around forty-five seconds**, and it grows for the life of the contract.

### Why this is not simply "add a window"

Ratings computed over the newest N games are a **different number** from ratings
computed over all of them. Elo is path-dependent: it is the whole sequence that
produces a rating, and truncating the sequence silently changes every figure on
the page.

So this needs a decision about what the leaderboard MEANS, not just a bound:

| option | what it costs | what it changes |
|---|---|---|
| Read concurrently, keep it complete | ~3× faster, still unbounded | nothing |
| Cache per game, recompute the table | after the first visit, near free | nothing — the entries are immutable and already cached |
| Window it | bounded forever | **every rating on the page** |

**Recommendation: the second, then the first.** The entry cache landed today
(`7d95eee6`), and a finished ranked game can never change — so the second visit
should cost one read a game rather than three, and the walk should be three-wide
like the explorer. That is proposal 19's other half, and it buys the time to
decide the third question rather than being forced into it.

---

## 35. Make en passant reachable by the obvious click

**Simplicity 4 · Safety 5 · needs an inscription · ~0.2 KB**

### In plain terms

En passant is the one capture in chess where you do not move onto the piece you
are taking. A player tried it, found nothing happened, and reasonably concluded
the board did not implement the rule.

### The problem

It is implemented and it was offered. Replaying the real game 2 at the moment it
mattered, the legal moves from f5 were `f5f6, f5g6` and the position carried
`g6` as the en passant square. The player clicked **g5** — where the enemy pawn
is — and g5 is not a square their pawn can reach, so nothing happened and there
was no way to tell that from "not implemented".

### The proposal

Two small things, either alone worth having:

1. When a pawn is picked up and an en passant capture is available, **highlight
   the captured pawn as well as the destination**. It is the only capture where
   those are different squares, and nothing on the board says so.
2. **Accept the click on the captured pawn** when the en passant capture is the
   only legal interpretation of it. Unambiguous, and it removes the one place
   where knowing the rules is not enough to play the move.

### Why it is worth doing

It is a rule every club player knows and almost no casual player does, on a
board whose whole claim is that the rules are refereed correctly. Getting it
right and appearing not to is the worst of both.

---

## 36. Say which game you are looking at

**Simplicity 5 · Safety 5 · needs an inscription · ~0.3 KB**

This is **proposal 29a**, and it is repeated here because it stopped being a
convenience.

On 2026-08-14 the same move was submitted to two different games, three minutes
apart, by the same wallet. The chain shows it plainly: `g7g5` in game 2 at block
8757147 and in game 1 at block 8757168. Both games were `xtrata.btc v
anyone-else`, both black to move, both opened 1.e4, and the board says which one
you are in exactly once, in small text, above a board that looks identical.

It was not a software fault — there is no automatic resubmission anywhere, and a
duplicate listener fires in the same tick rather than three minutes later. It was
two deliberate clicks in a board that could not tell two games apart.

**Raise 29a to the top of the navigation work.** The permanent connected-wallet
line landed the same day (`46a78d8e`) for the same reason; the game needs the
same treatment, and the document title is the cheapest place to put it.

---

*Produced 2026-08-12 against commit `c0dd8d8d`. Every measurement in that first
pass was taken from the tree at that commit; re-measure before quoting any of it.
**Audited and extended 2026-08-14 against `0b9eb2a8`**, which is where every
figure in "the state of the tree now", "what was built that this review never
proposed", and proposals 34 to 36 comes from.*

*A browsable version of this document, with the same twenty-three proposals
sortable and filterable by what they cost, is published at
<https://claude.ai/code/artifact/0e03ed3f-2593-4d0e-82d0-7c50383dffbb>. It is
generated from the same data; this file is the source.*
