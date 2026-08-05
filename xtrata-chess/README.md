# Xtrata Open Board

An open chess board. Anyone can submit the next move of any game, by sending a
short coded string to a contract. No wallet is bound to a colour, there is no
cooldown, and there is no throttle.

Version 1 is meant to be the oldest known ancestor on the Xtrata chess lineage,
so the parts that are permanent are the parts that got the care.

## How it works

The contract is an append-only log. It stores strings in a total order and
**does not know the rules of chess**. The rules live in the inscribed board,
which replays the log from the first entry, applies every submission that is
legal in the position reached so far, and skips every submission that is not.
That replay is a pure function of the log, so every reader derives the same
position. The agreement is the consensus.

The invariant that keeps this sound:

> **The contract may filter, never adjudicate.**

Anything the contract rejects never enters the log, so there is nothing to
disagree about. Anything it wrongly accepts is skipped identically by every
reader. What it must never do is make a chess judgement, because then two
referees exist and the board can fork.

Two consequences worth stating plainly:

- **Turn order needs no enforcement on chain.** A move for the wrong side is
  simply not legal in the current position, so replay skips it like anything
  else. Wrong piece, wrong side, moving into check: all one category.
- **Junk cannot corrupt the board.** It costs its sender a fee and changes
  nothing. That is the whole economic argument for leaving version 1 open.

## The permanent format

Descendants inherit these. They are fixed.

| | |
|---|---|
| Move encoding | UCI. Four or five ASCII characters: from-square, to-square, optional promotion piece. `e2e4`, `e7e8q`. |
| Replay order | The `seq` counter and nothing else. Never block height, never timestamps. |
| `seq` semantics | A sequence number, not a ply count. It counts submissions including ones replay skips, so it drifts from the real ply count. Never treat it as a chess concept. |
| Game identity | Contract principal plus game number. A bare game number means nothing outside its contract. |
| Version marker | `FORMAT-VERSION` on chain, `formatVersion` in a sealed game. |
| Rules commitment | `open-game` takes an optional 32-byte hash. `none` means the open board. |

## Games with their own rules

The open board lets anyone move either side. A game can be opened under narrower
rules instead: bind a colour to an address, require a wait between an address's
own moves, start from a given position.

None of that is in the contract, and none of it could be. Every rule is a
question about the log, and the log already records the sender and the block
height of every submission, so replay answers them at exactly the point it
answers "is this legal". A submission that breaks a rule is skipped like any
illegal move, and the sender still paid for it.

What the contract does hold is `sha256` of the rules, written when the game is
opened and never changed. Without it, two boards could claim different rules for
the same game and nothing would say which was the referee. With it, a board
checks itself: if its rules do not hash to the commitment, it says so and tells
you not to trust what it shows.

### Generating one

The board has a panel for it. Set the rules, open the game on chain, then
download the board bound to that game number. What you get is about 600 bytes:

```html
<!doctype html>
<script>window.__XTRATA_CHESS_CHILD__ = { …contract, game, rules… };</script>
<script src="/i/<engine>"></script>
```

The engine is inscribed once and every game after it depends on that one
inscription. A child game is a config block, so making one is a casual act
rather than a 100KB commitment.

Inscribe with `seal-recursive(hash, uri, [<engine id>])`.

Reading is lenient about case and surrounding whitespace, because people type
these into wallets by hand and a stray space should not cost someone a fee.
Everything else is strict.

## Layout

```
contracts/xtrata-chess-log-v1.clar   the log. ~150 lines, no chess in it
src/engine.js                        the referee. full FIDE rules, 0x88 board
src/replay.js                        log -> position. total and deterministic
src/protocol.js                      constants shared by contract and board
src/mock-chain.js                    in-memory stand-in for the contract
src/live-chain.js                    real chain: HTTP reads, wallet writes
src/sealed-chain.js                  a game that carries its own log
src/clarity.js                       minimal Clarity codec, so no SDK is bundled
src/bns.js                           principals -> BNS names, best effort
src/sim-identities.js                real principals and names for simulation
src/block-time.js                    block heights -> wall-clock time
src/board-ui.js  src/app.js          the board
src/bots.js  src/simulation.js       players, including a griefer
```

## Running it

```bash
npm install
npm run dev
```

Then open <http://localhost:4321>. It starts in simulation mode: no wallet, no
fees, nothing on chain.

**Manual testing.** Click a piece and a destination, or type any string into the
submit box. Typing junk is the point — the board shows you exactly what replay
does with it and why. "Send junk" submits what a griefer would. "Autoplay" runs
two bots against each other with roughly one junk submission in four.

**Automated testing.**

```bash
npm run test:all
```

That runs `clarinet check`, the JavaScript suite, the deep perft set, and the
Clarinet contract suite. For games rather than assertions:

```bash
npm run sim -- --games 20 --grief 0.4
npm run sim -- --seed 5 --verbose --pgn
```

Every simulation is seeded, so a game that misbehaves replays exactly.

## What the tests actually prove

- **`engine.perft.test.js`** — node counts of the legal move tree against the six
  standard positions, to depth 5 on two of them. This is the measure that says
  move generation is correct rather than approximately correct. `PERFT_DEEP=1`
  runs the full set, about 16M nodes.
- **`engine.rules.test.js`** — the rules named one at a time, so a regression says
  which rule broke: castling through check, en passant that would expose the
  king along the rank, underpromotion, threefold, the fifty move rule, the
  insufficient material cases, SAN disambiguation.
- **`replay.test.js`** — replay is total (never throws on any input, including
  entries that are not strings), deterministic, and order-sensitive in exactly
  one way.
- **`contract.test.js`** — contract behaviour, plus a parity suite that runs the
  same scenarios against the contract and `MockChain` and compares. Simulation
  mode is only a trustworthy test surface while that passes.
- **`simulation.test.js`** — twenty full games end to end with a griefer in the
  mix, asserting they finish, that replay agrees with forward play, and that
  stripping every rejected entry leaves the position unchanged.
- **`clarity.test.js`** — the hand-rolled Clarity codec checked byte for byte
  against `@stacks/transactions`, which is a dev dependency and never reaches
  the inscription.
- **`bns.test.js`** — name resolution is cosmetic, so what is defended is that it
  cannot break or slow the board: never throws, never re-asks, never touches the
  position.
- **`playback.test.js`** — simulated identities are valid Stacks principals, and
  every playback frame is a position the game actually reached. Also that a
  skipped submission never advances the board.
- **`block-time.test.js`** — the height-to-timestamp lookup, one call per block
  rather than per move, and the two awkward cases: same-block submissions give a
  zero gap rather than a rounding error, and an unknown timestamp is reported as
  unknown rather than guessed at.

## Who played what

Every move carries its sender, and the board shows it in both the move list and
the submission log. Where an address owns a BNS name, the name is shown in place
of the principal, in a different colour so the two are never confused; the
tooltip always carries `name · principal` so the address is one hover away.

Resolution is best effort and off the critical path. The position is drawn from
replay immediately, names land afterwards, and a lookup that fails or finds
nothing is cached as "no name" so a board with dozens of anonymous senders does
not re-ask on every poll. Simulation and sealed senders are never looked up.

One caveat worth knowing: BNS names are chosen by whoever registers them, so a
name is not proof of identity and can be picked to resemble someone else's. The
principal underneath is the only thing that is unique, which is why it stays in
the tooltip.

Simulation uses genuine, well-formed mainnet principals derived from the seed,
some carrying a name and some not, rather than labels like `BOT-WHITE`. A
preview that tidies away the hard part is not a preview, and the name column was
the one thing simulation could not previously exercise.

A sealed game embeds the names it knew when it was sealed. It has no network, so
anything it did not carry is lost, and attribution should get more durable when
a game is inscribed rather than less.

## A finished game is finished

When a game reaches a terminal position the board stops offering moves. The
submit box, the bot controls and the griefer all go away rather than sitting
there greyed out, and the contract would refuse anything further anyway: replay
rejects every submission past the end with `game-over`.

What replaces them is playback. Each frame is `replay(log.slice(0, n))` — the
same replay the live board runs, applied to a prefix of the same log — so every
position shown is one the board genuinely passed through. Nothing is recorded
and nothing is interpolated.

Stepping onto a skipped submission is the tell that this is the real log rather
than a move list: the counter advances and the board does not.

### Real time

The contract stores `stacks-block-height` on every submission, which is the
right thing to store: it is free, it is already there, and it is a key into the
block's timestamp rather than a second copy of it. Putting a clock in the
contract would have paid storage on every move to record something the chain
already knows.

The cost of that choice is one lookup per distinct block —
`/extended/v2/blocks/{height}` returns `block_time` as a unix timestamp — and
that is what makes real-time playback possible. Paces are Steady, Real time, and
multipliers up to 3600×. The move list carries a running clock so the rhythm of
a game is readable without playing it at all.

Two details that are honest rather than tidy:

- **Submissions that shared a block have no gap.** They land together during
  playback, because they landed together on chain. On an unthrottled board that
  is common, so the simulation generates it too.
- **Real gaps can be enormous.** An open board might sit untouched for hours.
  "Cap long waits" clamps any single wait to 8 seconds and says so in the
  caption; turn it off for genuinely real time, and be prepared to wait.

A sealed game embeds its block times along with its names, for the same reason:
it has no network, and the record should get more durable when it is inscribed.

## Building and inscribing

Three artifacts, in the order they go on chain:

```bash
node scripts/build.mjs --engine                  # the engine, ~136KB, inscribed once
node scripts/build.mjs --board --engine-id <id>  # the open board, ~100 bytes
node scripts/build.mjs                           # a self-contained board, for local use
```

The engine carries every module and the markup it mounts when a page has none.
The open board and every child game are thin pages that depend on it, sealed
with `seal-recursive(hash, uri, [<engine id>])`.

The self-contained build is one file with everything inlined. It needs no
inscription id, which makes it the right thing for local use and the wrong thing
to inscribe, since each copy would pay for the engine again.

A finished game seals into a standalone artifact:

```bash
node scripts/build.mjs --seal path/to/game.json
```

The sealed page embeds its own log, so it renders with no node, no API, and no
dependency on the contract that hosted it still being the one people read. Same
renderer, two modes — that is what makes an inscribed game durable rather than
a link.

## Launching

Two routes. Both deploy the same bytes.

### The canary, signed by your wallet

```bash
node scripts/build.mjs --canary
```

Produces `dist/xtrata-chess-launch-canary.html`: one file, the contract source
inlined, no external requests. Open it in a browser with Leather or Xverse
installed and it walks the whole launch — deploy, open game #1, play `1. e4` —
with every transaction signed by the wallet.

**No seed phrase is asked for, entered, or stored.** The page holds no keys and
can sign nothing itself. It builds each request, shows it in full, and hands it
over. Nothing is sent without a click, and the deploy step asks you to type the
contract name first.

Each step is gated on the one before it having confirmed *and been read back*.
Deploy is not done when the transaction succeeds; it is done when the on-chain
source hashes to the same bytes the page carried. Opening game #1 is not done
until `get-game` answers. The first move is not done until the log replays to
`1. e4`. The failure worth catching is a transaction that succeeds and does not
mean what you intended.

`stx_deployContract` has never been exercised in this repo, unlike every other
call here, so that step offers three parameter shapes to fall back through.

### The script, with a seed phrase

```bash
XTRATA_MAINNET_MNEMONIC="…" node scripts/deploy.mjs --broadcast
```

Same preflight, same pinned Clarity version, but the key material is yours to
handle. Prefer the canary unless you are automating.

`clarinet check` passes clean against Clarity 3. The contract holds no funds,
moves no tokens, and has no admin, so there is nothing to configure.

```bash
node scripts/deploy.mjs                                  # preflight, nothing sent
XTRATA_MAINNET_MNEMONIC="…" node scripts/deploy.mjs      # dry run, builds the tx
XTRATA_MAINNET_MNEMONIC="…" node scripts/deploy.mjs --broadcast
```

Dry run is the default and the preflight runs either way, so the safe thing is
also what you get if you forget a flag. It checks the source is the one that was
tested, derives the deployer, confirms the contract name is free, confirms the
balance covers the fee, and asks for typed confirmation before broadcasting.

Measured cost per move, under Clarinet: 9,150 runtime units against a block
limit of 5,000,000,000, and flat — move 82 costs 1% more than move 1. The
binding dimension is `read_count` at 8 of 15,000, so a block would hold roughly
1,875 moves. Execution is not what a move costs; the transaction fee is.

Reading a board is free and needs no wallet. Only submitting costs anything.

## What version 1 deliberately does not do

- No cooldown and no per-address limit. It will get botted. That is the
  experiment, and the log keeps the evidence.
- No colour bound to an address.
- No stakes, no pot, no payout. Money would mean the *result* has to be
  enforceable on chain, which needs result settlement (claim a result, open a
  challenge window, let anyone refute it by submitting one legal move from the
  claimed final position). None of that is built, and none of it is blocked.
- No on-chain sealing of finished games. Worth doing once there is a game worth
  sealing.
