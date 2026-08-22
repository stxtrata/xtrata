# Playing off chain, and what a result is worth afterwards

A mode where the moves do not go on chain and only the outcome does.

Written against the contract as deployed (`xchess-core-v1-canary`) and the board
as inscribed at 2.1.9. Nothing here is built.

## The rule this collides with

One sentence holds this project up:

> A result is derived by replaying the log. It is never taken from a claim.

Everything rests on it. The leaderboard replays. Explore replays. The checkpoint
is the single exception and it took two separate bugs and a near-miss on chain
before it was safe to write one — see 2.1.9. A mode that records only the result
is, by construction, a claim.

So the question is not "how do we record a result cheaply". It is **what makes a
result believable when the moves are not on chain**, and the answer is different
for each of the four things somebody might mean by "off chain". They are not
variations on one feature. They are four products with four trust models.

## The insight that makes one of them safe

**Moving the moves off chain need not move the TRUTH off chain.**

If every move is signed by its mover and chained to the one before it, the log
still exists, is still complete, and still decides the result by replay — it has
simply travelled by a different road. A verifier fetches it, checks the
signatures, replays it with the pinned engine (2991), and reaches the same
verdict a full on-chain game would.

That is a **transport** change. It keeps the rule intact.

A mode that records only "White won" is a **truth** change. It breaks the rule
and cannot be repaired by any amount of care; it can only be walled off.

Both are worth having. They must not be confused, and the board must never
present them as the same kind of fact.

## The four modes

| | moves on chain | result derived by | transactions | rateable |
|---|---|---|---|---|
| **A. Recorded** (today) | every one | replay | 45+ | yes, main pool |
| **B. Channel, published** | none; log inscribed at the end | replay | 2 | yes, main pool |
| **C. Channel, private** | none; log kept by the players | replay, if they show it | 1 | no |
| **D. Claim** (exists) | none; no log at all | nothing | 1 | never |

### A — Recorded

What every game so far is. Most expensive, always verifiable, works against a
stranger who may vanish.

### B — Channel, published

Players exchange signed moves directly. Each signature covers the contract, the
game id, the sequence number, the move, and the hash of the previous signed
entry — so the chain of moves is tamper-evident and no entry can be lifted into
another game.

At the end: the log is inscribed via Xtrata (a 45-move log is well under one
chunk) and **one** transaction settles the game, naming the result, the terminal
position hash, the final sequence, and the inscription holding the log.

Anyone can then do exactly what the leaderboard does today: fetch, verify,
replay, agree. **This is rateable in the main pool** because its trust model is
identical to A. Nothing is believed; everything is checked.

### C — Channel, private

Identical to B, minus publication. The players hold the log. The contract has
the result and both signatures, so neither player can lie alone — but a third
party cannot check the game happened as claimed, because there is nothing to
replay.

Not rateable. Perfectly reasonable for a private game between friends who want a
permanent record of the outcome without publishing their play.

### D — Claim

`claim-result` already exists and is already honest about itself: first claim
wins, anybody may call it, and the contract calls the map `ResultHints`. The
board does not display hints as results, which is correct.

Leave it exactly as it is. It is the "we played, here is what happened" social
record, and its value comes precisely from nobody pretending it is more.

## Recommendation

**Build B. Offer C as the same machinery with publication skipped. Leave D
alone. Do not build a result-only rated mode at all.**

B gets the cost saving the request is after — two transactions instead of
forty-five — without giving up anything, and it is the only one of the four that
can be rated without inventing a second, weaker notion of what a rating means.

C falls out of B for nearly free and covers the private case honestly.

The user's instinct that this should be "non-ranked only or have its own
ranking" is right for C and D and, usefully, **not needed for B**. That is the
whole point of doing the work properly: a separate rating pool is the price of a
weaker guarantee, and B does not pay it.

## The hard problems

### 1. Abandonment — the one that kills naive designs

A player who is losing simply stops answering.

On chain this is visible: the game sits unfinished and everyone can see whose
turn it is. Off chain, if a result requires both signatures, **the losing player
withholds theirs and there is no result at all** — so abandoning is free and
always correct when behind. That single fact makes a mutual-signature-only
design unusable for anything competitive.

The answer is a **unilateral close with a challenge window**, which is the
standard state-channel construction and is genuinely safe:

1. Either player may post the latest state they hold: sequence number, position
   hash, and the opponent's signature over it.
2. A window opens (suggested: 144 blocks, about a day, matching the async spirit
   of the rest of the board).
3. During the window the other player may post a **strictly later** signed
   state. Highest sequence wins. Posting a later state resets nothing — the
   window runs from the first post.
4. When the window closes, the highest posted state is final, and the result is
   read from it.

An abandoning player therefore loses on the last position they signed, which is
exactly right: they signed it, so they agreed to it. Abandoning while losing
gains nothing, which removes the incentive entirely.

**A move signed is a move played.** That is the rule players must understand, and
the board must say it plainly at signing time rather than in a manual.

### 2. Collusion

Two players can agree that one will lose, and produce a perfectly valid signed
game to prove it.

Worth stating clearly: **this is already true on chain today.** Nothing prevents
throwing a game in mode A. So mode B introduces *no new collusion risk* — same
trust model, same exposure — and that is the substantive reason it can share the
rating pool.

Mode C and D are different: there, collusion needs no game at all. Two addresses
can mint results all afternoon. Hence: not rateable, ever, in any pool. A
separate "casual" rating would be a leaderboard of who was most willing to lie,
and it would still be read as a chess rating.

### 3. Signature replay

A signature must be bound to a domain, or a move signed in one game can be
replayed into another. Every signed entry covers:

```
"X-CHESS-CHANNEL/1" || contract-principal || game-id || seq || move || prev-hash
```

Contract and game id stop cross-game reuse; `seq` and `prev-hash` stop
reordering and truncation. The board already has a canonical serialiser
(`packages/protocol/canonical.ts`) and this must use it rather than a second
encoding — the same rule that keeps the rules hash trustworthy.

### 4. Rules divergence

Both sides must replay identically or they will disagree about the result and
both be honest. Handled by what already exists: the game commits to a rules hash
at open time exactly as now, and both sides run the hash-pinned engine.

The settlement carries a **terminal position hash** as well as the result, so a
verifier can tell "we disagree about the position" from "we disagree about the
outcome". Those are different faults and one of them is a bug.

### 5. Transport — the real blocker, and it has no clean answer

**The board is an inscription. It has no server and the serverlessness audit is
a release gate.** Two players cannot exchange moves *through* it.

Options, honestly:

- **Copy and paste a signed blob per move.** Works today, needs nothing, and is
  genuinely serverless. Clunky, and about right for correspondence play — which
  is what an async board already is.
- **A link per move.** The same thing wearing better clothes; the board already
  encodes rules into shareable links (`linkForGame`).
- **One device, both players.** Over-the-board play with a phone between them.
  No transport problem at all, and probably the most pleasant version of this.
- **A relay server.** Solves it properly and breaks a stated property of the
  project. If it is ever done it should be an *optional* relay that carries
  opaque signed blobs it cannot forge, with the copy-paste path still working —
  never a dependency.

My recommendation: build for copy-paste and one-device first. They cost nothing,
break nothing, and prove the machinery. A relay is a separate decision with a
different conversation attached.

### 6. What a spectator sees mid-game

An off-chain game in progress is invisible. The board shows it as opened and
then nothing until it settles. That is honest but disappointing, and it is worth
saying on screen rather than letting a viewer conclude the game is stuck.

Optionally, either player may post a mid-game state as a checkpoint of sorts — a
cheap way to show progress without paying per move. Not required; worth a flag.

## Ranking

- **B shares the main pool.** Same guarantees, same replay, same eligibility
  checks. `checkEligibility` needs to learn that a channel game's log comes from
  an inscription rather than from `Entries`, and nothing else changes.
- **C and D are unrated, permanently, with no separate pool.** A second pool
  sounds fair and is a trap: it would be labelled "casual rating", displayed
  beside a real one, and read as the same kind of number by everybody who did not
  read the manual.
- The leaderboard should say how many of a player's rated games were channel
  games. Not as a warning — they are equally valid — but because a reader
  comparing two players is entitled to know how the evidence was gathered.

## Contract surface

The current contract cannot do this: it has no signature verification (no
`secp256k1-verify` anywhere in `contracts/`). A new version is needed. Sketch:

```
(define-public (open-channel-game (rules-hash (buff 32)) (ranked bool)))
(define-public (post-state (game uint) (seq uint) (position (buff 32))
                           (result (string-ascii 7)) (log (optional uint))
                           (sig (buff 65))))
(define-public (finalise (game uint)))
(define-read-only (get-channel (game uint)))
```

with:

- `post-state` verifying `sig` against the OPPONENT's key over the canonical
  message, and refusing a `seq` not higher than the one already posted;
- the challenge window opening on the first `post-state` and measured in blocks;
- `finalise` refusing before the window closes;
- `log` being the Xtrata inscription id, required when `ranked` is true — which
  is the whole difference between B and C, expressed as one optional field.

Note the asymmetry that makes this safe: **you post the state your opponent
signed, not the one you signed.** You cannot forge their signature, and posting
their latest signed state is exactly the thing you would do if you were winning
on it.

## What this unlocks: timed games

`docs/PLAN-timed-games.md` was shelved with a real obstacle:

> Replay turns a log into a result with nothing but the log, and a clock is not
> in the log.

and its answer was to anchor deadlines to block times, because a browser's clock
cannot be trusted. That works for correspondence play and cannot work for blitz,
because **a move that must wait for a block cannot take five seconds.**

A channel changes that completely. Moves are instant, so a real clock becomes
possible, and each signed entry can carry the mover's declared elapsed time —
which both sides sign, making it as checkable as the move itself. A player who
signs an entry claiming four seconds when it took forty has an opponent who
simply will not sign the next one.

**Timed chess is a consequence of this work, not a separate project.** That is
probably the strongest argument for doing it, and it is worth deciding the
signed-entry format with timing in mind even if timing ships later — the entry
format is the thing that is expensive to change afterwards.

## Staging

1. **The entry format and its canonical encoding.** Everything else depends on
   it and it is the part that cannot be changed later. Include the timing field
   now, unused.
2. **Replay from a channel log**, in `packages/replay`, sharing the engine and
   eligibility with on-chain games. Provable entirely offline, with tests, before
   any contract exists.
3. **The board's play surface** for copy-paste and one-device play, still with no
   contract — two browsers can play a complete game and produce a settlement
   payload that goes nowhere. This is the point at which it can be *felt*.
4. **The contract**, on the canary first, with the challenge window exercised by
   an abandonment test that actually abandons.
5. **Settlement and inscription** of the log, then eligibility and the
   leaderboard.
6. **Timed games**, if wanted, on the format decided in step 1.

Steps 1 to 3 are worth doing regardless: they are the whole design, they cost no
chain, and if the answer at step 4 turns out to be no, nothing has been spent
that was not worth spending.

## What would make this wrong

- **If nobody wants correspondence-by-copy-paste.** Then the transport question
  is the whole project and the answer is a relay, which is a different decision.
- **If the challenge window is too long to be pleasant and too short to be safe.**
  144 blocks is a guess. It should be measured against how people actually
  abandon, and the only data is the on-chain games — game 15 sat seventy hours.
- **If signature prompts per move are as annoying as transaction prompts.** They
  are cheaper and faster but they are still a wallet dialog. Worth a real test on
  a phone before step 3 is called finished.
