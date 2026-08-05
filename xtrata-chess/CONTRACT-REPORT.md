# The contract, in plain language

A walkthrough of `xtrata-chess-log-v1.clar` written to be read rather than
skimmed, so you can decide whether it is what you want before it becomes
permanent.

**File:** `contracts/xtrata-chess-log-v1.clar`
**Size:** 8,311 bytes
**sha256:** `fae33656a47d948f93348d04d90d5a4f35e8dc7c83d710b75cd9e1f2e5fc3bc9`
**Clarity version:** 3

---

## In one paragraph

It is a notebook. Anyone can open a new page, and anyone can write a short line
on any page. It writes down who wrote each line and when. It never reads what
was written, never decides whether a line was sensible, and has no way to erase
or change anything. That is the entire contract.

## What it stores

Two tables and one number.

**A counter** of how many games have ever been opened. Games are numbered from 1
upwards, so a board can walk 1, 2, 3… without needing a directory.

**A table of games.** For each game:

| | |
|---|---|
| `opened-by` | the address that opened it |
| `opened-at` | the block it was opened in |
| `next-seq` | how many things have been submitted so far |
| `rules-hash` | a fingerprint of its rules, or nothing |

**A table of submissions**, keyed by game number and position in that game. For
each one:

| | |
|---|---|
| `mv` | the text, up to 5 characters |
| `sender` | the address that sent it |
| `height` | the block it landed in |

That is everything. There is no board position stored anywhere, no notion of
whose turn it is, no record of who is winning.

## What you can do to it

**Two** actions. That is worth sitting with, because a small surface is the main
security property here.

### `open-game`

Starts a new game and gives you its number. Anyone can call it. You may attach a
32-byte fingerprint of the rules the game is played under, or attach nothing,
which means the open board where anyone may move either side.

### `submit-move`

Adds a line to a game. It does exactly three checks:

1. **Does this game exist?** If not, it refuses.
2. **Is the text four or five characters?** If not, it refuses.
3. **Has this game hit its ceiling?** If so, it refuses.

If all three pass, it writes down the text, your address, and the block height,
then adds one to the counter.

**It does not check whether the text is a chess move.** `zzzz` is stored just as
happily as `e2e4`. That is deliberate, and the next section explains why.

## Why the contract is ignorant on purpose

The obvious design is a contract that knows chess and rejects illegal moves.
This one refuses to, and the reason matters.

Chess in Clarity is possible but ugly. Detecting checkmate means generating
every legal move and finding none, which is expensive enough that it would have
shipped with compromises: mate decided by a challenge window, probably no
threefold repetition. It would also be a single implementation of the rules that
nothing else could check against.

Instead, the rules live in the board that reads the log. The board replays every
submission in order, plays the legal ones, and skips the rest. Two people
reading the same log with the same rules reach the same position, so agreement
comes from the rules being fixed and public, not from an authority.

The invariant that keeps this from being a mess:

> **The contract may filter, never adjudicate.**

Anything the contract rejects never reaches the log, so there is nothing to
disagree about. Anything it wrongly accepts is skipped identically by everyone.
What it must never do is form a chess opinion, because then two referees exist
and the board can fork.

The length check is a filter. It stops arbitrary junk taking up storage without
the contract having any view on chess. Character validation was deliberately
left out: the board rejects anything unparseable anyway, so checking would cost
gas to learn nothing.

**A consequence worth understanding:** turn order is not enforced on chain and
does not need to be. A move for the wrong side simply is not legal in the
current position, so replay skips it exactly like any other illegal move.

## What it cannot do

This is the part to check against your intentions, because none of it can be
added later.

- **Nobody can change or delete anything.** There is no edit, no delete, no
  admin. Once a line is written it is there forever.
- **Nobody owns it.** No owner, no admin key, no privileged address. The
  deployer has no more power over it than anyone else.
- **It cannot be paused, upgraded, or turned off.** There is no kill switch, and
  no way to point it at new code.
- **It never touches money.** It holds no funds and moves no tokens. The only
  cost is the ordinary network fee, paid to the network, not to the contract.
- **It cannot call anything else.** No other contract, no external dependency.
  Nothing it relies on can change underneath it.
- **It cannot decide a winner.** It does not know one exists.

If you wanted any of those, this contract is wrong and now is the moment to say
so.

## The rules fingerprint

The one part that is subtle.

When you open a game you may attach 32 bytes. The contract stores them and never
looks at them. They are a fingerprint of the rules the game is played under: who
may move white, who may move black, whether an address must wait between its own
moves.

Why it exists: without it, anyone could publish a board claiming your game had
different rules, and nothing would say which board was right. With it, any board
can be checked — hash its rules, compare to the chain. A board whose rules don't
match says so and tells you not to trust it.

Why a fingerprint and not the rules themselves: the rules are a question about
the log, which the board answers using the sender and height already recorded.
Storing them on chain would pay for something the contract could never use.

Why a hash and not an inscription id: the game has to be opened before the board
that renders it can be inscribed, so at the moment of committing, the
inscription does not exist yet.

**It is written once and can never be changed.** There is no setter, and the
test suite asserts that absence deliberately rather than by accident.

## The ceiling

A game accepts at most 65,536 submissions. Real games run to roughly eighty
moves, so this is far above anything genuine.

It started at 4,096 and was raised before deployment, for a reason worth
recording. On a board with no throttle, a low ceiling is a weapon: a spammer
could freeze a legitimate game part-played for a few tens of STX. The ceiling
protects nothing that the per-move fee does not already bound, so the only thing
a low one achieves is making that attack cheap.

At 65,536 the attack still exists but costs roughly sixteen times more, and no
honest game will ever come close.

## What it costs to run

Measured under Clarinet, not estimated:

| | runtime | share of a block |
|---|---|---|
| `open-game` | 7,049 | 0.00014% |
| `submit-move` | 9,150 | 0.00018% |

The number that matters most: **move 82 costs 1% more than move 1.** The cost
does not grow with the length of the game. That is a direct consequence of
storing moves in a table keyed by game and position rather than in a list — a
list would have to be read and rewritten in full on every move, so late moves
would cost far more than early ones.

The binding constraint is not runtime but read count, at 8 of 15,000 allowed per
block, which works out to roughly **1,875 moves per block**. Traffic is not a
concern at any plausible scale.

In practical terms the contract's own work is negligible. What a move costs is
the ordinary transaction fee.

## Reading it

Four read-only functions, all free and needing no wallet:

- `get-game-count` — how many games exist
- `get-game` — a game's opener, opening block, submission count, rules hash
- `get-move` — one submission
- `get-page` — fifty consecutive submissions, for walking a whole game

Plus `get-format-version` and `get-max-seq`, so anything reading the contract can
check what it is dealing with rather than assuming.

## Things that are permanent

Once deployed, none of these can change. They are inherited by everything built
on top.

| | |
|---|---|
| The contract name | Part of every game's identity forever. A name, once used, can never be reused, even by you. |
| Move format | Four or five ASCII characters. |
| Ordering | The sequence counter, and nothing else. Never block height or timestamps, which can tie. |
| What `seq` means | A count of submissions, including ones the board skips. It is not a move number and must never be treated as one. |
| The rules fingerprint | 32 bytes, optional, write-once. |
| The ceiling | 65,536 per game. |

## How it was checked

- `clarinet check` passes with no errors and no warnings.
- 24 contract tests under Clarinet, including a parity suite that runs the same scenarios
  against the real contract and against the simulator and compares every result,
  so the simulation cannot quietly drift from reality.
- Costs measured with Clarinet's cost tracking, including the flat-cost check at
  move 82.
- The absence of a rules setter is asserted by a test, not assumed.
- Deployment has been rehearsed as far as a wallet prompt: Xverse rendered a
  proper `deploy-contract` confirmation showing the right contract name and
  "no transfers (beside fees) will be made from your account", which is the
  contract correctly declaring that it never touches money.

## What has not been checked

- **The contract has never run on a real chain.** Everything above is from
  Clarinet's simulator, which is faithful but is not mainnet.
- **No transaction has been broadcast.** The deploy prompt was opened and
  cancelled.

## The question to answer before deploying

Everything above follows from one decision: **the chain remembers, and the board
decides.**

If that is what you want — a permanent, public, unownable record that no one can
alter, with the rules living in code anyone can read and re-run — then this
contract is right, and its smallness is the point.

If you want the chain itself to enforce the rules, refuse illegal moves, know
who won, or ever pay anybody, then this is the wrong contract, and it is much
easier to say so now than after the name is spent.
