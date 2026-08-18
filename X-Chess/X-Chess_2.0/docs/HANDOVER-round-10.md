# Handover: tournament two, round 10 unfinished

Written 2026-08-18. Nothing here is a code change waiting to be made by me —
this is the state, the open issues, and what I would do next.

## Where tournament two actually is

Manifest **3001** ("Exhibition Two"), nine games, rounds 8–10. Verified against
chain: 9/9 pairings match their games' rules hashes, 6/6 addresses match the
fleet.

```
round 8   game 34  Wager  v Gambit    0-1        complete
          game 35  Mason  v Plumb     1/2-1/2    complete
          game 36  Ledger v Oblique   1-0        complete
round 9   game 37  Gambit v Mason     0-1        complete
          game 38  Wager  v Ledger    0-1        complete
          game 39  Plumb  v Oblique   1-0        complete
round 10  game 40  Ledger v Gambit    4 moves    UNFINISHED
          game 41  Oblique v Mason   49 moves    UNFINISHED
          game 42  Plumb  v Wager    15 moves    UNFINISHED
```

Resuming is safe and needs no state: `--round 10` re-reads each game from chain
and continues. It never replays a move — the growth guard exists to make that
impossible.

## The uncommitted change, and the failing test

`git status` shows six modified files. **Two are mine and they are the problem:**

- `harness/wizards/run-tournament.mjs`
- `tests/wizards/tournament.test.ts`

The other four (`README.md`, `harness/docs-audit.mjs`, `ops/LAUNCH.md`,
`ops/STATUS.md`) are another session's and are unrelated.

**What I changed:** a round runs its three games under `Promise.all`, which
rejects the moment one throws — so the other two keep playing into a process
that is already exiting. That is why round 10 lost all three games when only
game 40 had a problem: 41 and 42 were 49 and 15 moves in and entirely healthy.
I replaced it with a `settleAll` helper so each game fails on its own, and made
the round summary name any game that stopped.

**What is broken:** one test fails.

```
tests/wizards/tournament.test.ts
  > saying that a round is over > collects what playGame actually returned
  expected the file to match /const played = await Promise\.all\(/
```

That assertion was written when `Promise.all` was the right answer and now
pins the bug. It needs updating to expect `settleAll`, not reverting — but
verify the change is what you want first rather than making a test agree with it.

**1,381 of 1,382 pass.** Nothing else is red.

## The bug pattern worth knowing before you touch this

Five failures today, all the same shape: **a normal outcome treated as a
failure.**

| what happened | what it looked like |
|---|---|
| `/extended/v1/address/…/balances` is deprecated and throttled | a rate limit no waiting would fix |
| Stacks took 25 minutes to confirm | a dead move (settle gave up at 10) |
| the fee ladder moved the fee out of `spendUstx` | "a broadcast must plan to spend something" |
| the ladder's own replacement won the race | a lost transaction, waited on for 30 minutes |
| the indexer lagged one read behind | a lost move (twice: games 35 and 40) |

None was the chess. Across every round the players have produced **zero
rejected submissions**. When something stops, suspect the harness first.

The last one bit twice because I fixed the *route* rather than the *question*:
the first fix polled only after a superseded rung, and game 40 came through the
ordinary success path. The waiting now sits next to the growth guard itself.

**Do not soften the growth guard.** It is what stands between a confused runner
and game 12, which played `e2e4` five times — each accepted by the contract,
each skipped by replay as landing on an empty square, each charged. Making it
wait longer before answering is fine; making it willing to answer wrongly is not.

## Running it

```
node harness/wizards/run-tournament.mjs --live --round 10 \
  --model claude-sonnet-5 --via-claude-code
```

`--via-claude-code` is not optional. Without it the runner bills Console
credit, which is a separate empty account from the Max subscription — the run
dies on a zero balance before choosing a move. The header line says which it
picked; read it.

Never run two live rounds at once against the same wallets. Three games to a
round is the nonce limit: six characters, three games, nobody signing twice.
Game 40 shares Ledger and Gambit with nothing else in round 10, so `--round 10`
alone is correct.

Wallets held 1.1–1.7 STX each at last check; a round costs about 0.01–0.12.

## After round 10

Tournament three is planned in `docs/PLAN-tournament-three.md`. The short
version: everything defining a tournament is now inscribed and almost none of it
is read. The engine is fetched and executed from 2991, but characters still come
from `personalities.mjs` on this machine and the schedule from the runner —
so "these six characters played" rests on a file nobody else can see. Three
should read characters from chain (2995–3000, parsed by the validator at 2994)
and inscribe its manifest BEFORE any game opens, which no tournament has done
and which is the only way the revision window ever gets exercised.
