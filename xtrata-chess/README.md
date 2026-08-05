# Xtrata Open Board

A game of chess that lives on a blockchain, where anyone can play either side.

There is one board. Anyone may move the next piece, whichever colour it is. You
do not sign up, you are not assigned a side, and nobody owns the game. You just
send a move.

---

# Part one · for players

## How a move works

A move is a short piece of text sent to the chain. Four or five characters, and
that is the whole thing:

```
e2e4       the piece on e2 goes to e4
e7e8q      the pawn on e7 goes to e8 and becomes a queen
```

You leave one square and land on another. If a pawn reaches the far end you add
a letter for what it becomes: `q` queen, `r` rook, `b` bishop, `n` knight.

That text is all that goes on the chain. Not a picture of the board, not the
position afterwards. Just the move.

## Why the board can't be broken

The blockchain does not know the rules of chess. It stores your text and asks no
questions. The rules live in the board itself, and the board works like this:

> Read every move ever sent to this game, in order. Play the legal ones. Skip
> the rest.

That one sentence is the whole system, and it explains everything you'll notice:

**You can't move out of turn.** If it's White's move and you send a move for
Black, that isn't legal in the current position, so the board skips it. Nobody
had to write a rule about turns. Turn order falls out of chess itself.

**You can't cheat.** A move that would leave your king in check, a bishop moving
like a rook, a piece that isn't there. All the same category, all skipped.

**Nonsense costs you.** You can send `hello` or `zzzz` if you like. It costs a
transaction fee, it gets skipped, and the board carries on exactly as before.
That's the only defence the open board needs: breaking it isn't impossible, it's
just pointless and you pay for the privilege.

**Everyone sees the same board.** Two people loading the game read the same
moves and apply the same rules, so they reach the same position. There is no
server deciding, and no version that is more official than yours.

## The record keeps everything

The board shows two lists.

**Moves played** is the game: each move, whose turn it was, who sent it, and how
long into the game it happened.

**Every submission** is the truth: every single thing anyone sent, including the
ones that were skipped, with the reason. A move for the wrong side. A piece that
wasn't there. Plain gibberish.

Rejected attempts are kept on purpose. They are what an open board actually
attracted, and hiding them would make the record tidier and less honest.

## Who played each move

Every move carries the address that sent it. Where an address owns a BNS name,
the board shows the name instead, in a different colour. Hovering shows both.

A name is not proof of identity. Anyone can register one, including one that
looks like somebody else's. The address underneath is the only thing that is
genuinely unique, which is why it never goes away.

## When a game ends

At checkmate, stalemate, or a draw, the game is over permanently. No further
moves are ever accepted, from anyone. The board stops offering them.

What replaces them is **replay**. You can step through the whole game from the
first move: play, pause, skip forward and back, or drag the slider.

Two things make this more than a recording:

**It is rebuilt from the chain, not saved.** Each frame is produced by reading
the first N moves and applying the rules again. Every position you see is one
the board genuinely passed through.

**It can run at the real speed.** Every move is stamped with the block it landed
in, and blocks have timestamps, so the board knows the real gap between moves.
Play it back at true speed, or 10×, 60×, 600×, 3600×. If a game sat untouched
for three hours, real speed means three hours. "Cap long waits" shortens the
gaps and tells you when it has.

Moves that landed in the *same block* play together, because they happened
together. On an open board that happens whenever people race.

## Games are kept forever

A finished game can be sealed into a single page and inscribed on Xtrata. The
sealed page carries its own copy of the moves, the names, and the timings, so it
needs nothing else. No server, no lookups. Open it in ten years with no internet
and it still plays the game back.

That is the point of sealing. A link can rot. A page carrying its own game
cannot.

## Making your own game with your own rules

The open board is one game among many. From the board you can start your own and
choose who may play:

- **White is** a particular address, or anyone
- **Black is** a particular address, or anyone
- **A waiting time** between one address's own moves
- **No two moves in a row** from the same person
- **A different starting position**

So you can run a private duel between two addresses, a game where a small group
plays, or one paced so nobody can rattle off ten moves before anyone reacts.

When you set rules, the chain records a fingerprint of them. That fingerprint is
what stops somebody publishing a rival board claiming your game had different
rules: any board can be checked against it, and a board whose rules don't match
says so and tells you not to trust it.

You get a small file, a few hundred bytes, which is your game's board. Inscribe
it and it is yours, permanently.

## What it costs

Watching is free. Reading a board needs no wallet and costs nothing.

Only sending a move costs anything: one ordinary blockchain transaction fee. The
contract's own work is negligible, so you are paying the network, not the game.

## Where to play

- **Simulation** — the board with no wallet, no fees, nothing on chain. Play
  yourself, let two bots play, or press *Send junk* to watch it absorb what a
  griefer would send. Everything works exactly as it does live.
- **Live** — the real game on the real chain.

---

# Part two · for developers

## The one idea

The contract is an append-only log. It stores strings in a total order and
**does not know the rules of chess**. The rules live in the inscribed board,
which replays the log and skips whatever isn't legal. Replay is a pure function
of the log, so every reader derives the same position. That agreement is the
consensus.

The invariant that keeps it sound:

> **The contract may filter, never adjudicate.**

Anything the contract rejects never enters the log, so there is nothing to
disagree about. Anything it wrongly accepts is skipped identically by everyone.
The moment it forms a chess opinion, two referees exist and the board can fork.

Why not put chess in Clarity? It would have shipped with compromises — mate by
challenge window, probably no threefold repetition — and would have been a
single unaudited implementation of the rules that nothing could check against.
Replay gets correct FIDE rules and anyone can re-derive the board with any
engine.

## Permanent format

Descendants inherit these. They are fixed.

| | |
|---|---|
| Move encoding | UCI. Four or five ASCII characters: from-square, to-square, optional promotion piece. |
| Replay order | The `seq` counter and nothing else. Never block height, never timestamps. |
| `seq` semantics | A sequence number, not a ply count. It counts submissions including skipped ones. Never treat it as a chess concept. |
| Game identity | Contract principal plus game number. |
| Rules commitment | `open-game` takes an optional 32-byte hash. `none` means the open board. |
| Version marker | `FORMAT-VERSION` on chain, `formatVersion` in a sealed game. |

Reading is lenient about case and surrounding whitespace, because people type
these into wallets by hand. Everything else is strict.

## The contract

```clarity
(open-game (rules-hash (optional (buff 32))))   → game id
(submit-move (game uint) (mv (string-ascii 5))) → seq

(get-game-count)                → uint
(get-game game)                 → { opened-by, opened-at, next-seq, rules-hash }
(get-move game seq)             → { mv, sender, height }
(get-page game start)           → 50 optional entries
(get-format-version) (get-max-seq)
```

`submit-move`'s only check is that the string is four or five characters. That
is a filter, not a judgement. Character validation is left out deliberately:
replay rejects anything unparseable anyway, and the runtime cost is better spent
nowhere.

Moves live in a map keyed by `(game, seq)` with a counter, not a list in a data
var. Appending to a growing list means reading and rewriting the whole list, so
move eighty would cost far more than move two. Measured under Clarinet: **9,150
runtime units per move against a 5,000,000,000 block limit, and flat** — move 82
costs 1% more than move 1. The binding dimension is `read_count` at 8 of 15,000,
so a block would hold roughly 1,875 moves.

There is also a **version 2** in `contracts/xtrata-chess-log-v2.clar` which
charges a fee per call, defaulting to 0.01 STX, with a hard ceiling no owner can
exceed and ownership that can be renounced permanently. Written and tested, not
deployed.

See [CONTRACT-REPORT.md](CONTRACT-REPORT.md) for a line-by-line walkthrough of
both in plain language.

## Replay

```js
replay(submissions, { rules }) → { fen, accepted, rejected, log, outcome, … }
```

Walk the log in `seq` order. For each entry: game over? sender allowed by the
rules? a legal move? Apply it or record why not. It never throws — the input is
arbitrary strings written by anyone, and a malformed submission is an ordinary
outcome rather than an error.

Rejection reasons: `malformed`, `empty-square`, `wrong-turn`, `illegal`,
`game-over`, plus `not-allowed`, `wrong-player`, `consecutive`, `cooldown` from
a child board's rules.

## Rules without a rule engine on chain

Every rule a child board can impose is a question about the log, and the log
already records the sender and block height of every submission. So replay
answers them at exactly the point it answers "is this legal", and the contract
learns nothing.

What the contract does hold is `sha256` of the canonical rules, written when the
game is opened and never changeable. Without it, two boards could claim
different rules for the same game and nothing would say which was the referee.
With it, a board checks itself and says so when it isn't.

It is a hash rather than an inscription id because the game must be opened
before the board that renders it can be inscribed.

## The inscription lineage

A child game cannot `<script src>` the parent, because the parent is a whole
HTML page. So the engine is its own inscription and everything depends on it:

```
engine.js              136KB   inscribed once
open board             ~250B   depends on [engine]
a child game           ~600B   depends on [engine]
a sealed finished game ~120KB  depends on nothing at all
```

Sealed with `seal-recursive(hash, uri, [engine id])`. A child game is a config
block, which is what makes generating one a casual act rather than a 136KB
commitment.

The engine mounts its own markup when a page doesn't already have it, which is
how a 250-byte page becomes a full board.

Sealed games are the exception: they embed everything, including the names and
block times they knew when sealed, because they have no network. A sealed
artifact that lost its attribution when inscribed would be the opposite of the
point.

## Wallets

`src/wallet.js` replicates Astro Blaster's provider discovery. The rules are
copied deliberately rather than rewritten, because each exists for a specific
wallet on a specific platform:

- Named wallets also publish `window.StacksProvider` and `window.stacks`
  pointing at the same extension. Offering those separately double-prompts.
- `window.btc` is Leather's btckit alias; a contract call through it lands on
  the deprecated screen with Confirm disabled. Same for `window.BitcoinProvider`
  and Xverse.
- Xverse's `StacksProvider` is a stub whose `request()` throws
  "request function is not implemented", alongside a `BitcoinProvider` that
  works. Ranking must be on `request()`, the path actually used.
- One refusing provider must not end the attempt; connect walks method by method
  across every provider. A genuine user rejection stops immediately.

Inside the Xtrata sandbox the runtime shim *is* `window.StacksProvider` and
routes over postMessage to the host, so calling `provider.request` is correct
whether the wallet is in this frame, the parent, or the opener. The shim
installs at load and again at 400ms, 1400ms, 3200ms and on focus, so providers
are resolved per call, never cached at startup.

## Layout

```
contracts/xtrata-chess-log-v1.clar   the log. no chess in it
src/engine.js                        the referee. full FIDE rules, 0x88 board
src/replay.js                        log → position. total and deterministic
src/rules.js                         child-board rules and their commitment
src/protocol.js                      constants shared by contract and board
src/mock-chain.js                    in-memory stand-in for the contract
src/live-chain.js                    real chain: HTTP reads, wallet writes
src/sealed-chain.js                  a game that carries its own log
src/child.js                         generating a child board
src/clarity.js                       minimal Clarity codec, so no SDK is bundled
src/wallet.js                        provider discovery and calling
src/bns.js  src/block-time.js        names and timestamps, best effort
src/board-ui.js  src/app.js          the board
src/bots.js  src/simulation.js       players, including a griefer
```

## Running it

```bash
npm install
npm run dev          # http://localhost:4321
```

Serve it rather than opening the file: wallet extensions do not inject into
`file://` pages.

```bash
npm run test:all                       # 266 tests + deep perft + clarinet check
npm run sim -- --games 20 --grief 0.4  # whole games, seeded and reproducible
```

## What the tests prove

- **`engine.perft.test.js`** — node counts of the legal move tree against the six
  standard positions, depth 5 on two of them, about 16M nodes. This is the
  measure that says move generation is correct rather than approximately so.
- **`engine.rules.test.js`** — the rules named one at a time, so a regression
  says which broke: castling through check, en passant that would expose the
  king along the rank, underpromotion, threefold, fifty-move, insufficient
  material, SAN disambiguation.
- **`replay.test.js`** — replay is total, deterministic, and order-sensitive in
  exactly one way.
- **`contract.test.js`** — contract behaviour, plus a parity suite running the
  same scenarios against the contract and `MockChain` and comparing.
- **`rules.test.js`** — every child-board rule is a pure function of the log, and
  the hash is stable and pins the game.
- **`simulation.test.js`** — twenty full games end to end with a griefer.
- **`clarity.test.js`** — the hand-rolled codec checked byte for byte against
  `@stacks/transactions`, including `c32address` over 3,000 hashes.
- **`wallet.test.js`** — the provider rules above, each as the record of the
  wallet behaviour that caused it.
- **`playback.test.js`** / **`block-time.test.js`** — every playback frame is a
  position the game reached, and a skipped submission never moves the board.

## Building

```bash
node scripts/build.mjs --engine                       # the engine, inscribed once
node scripts/build.mjs --board --engine-id <id> \
                       --contract SP….xtrata-chess-log-v1
node scripts/build.mjs --canary                       # the launch canary
node scripts/build.mjs                                # self-contained, for local use
node scripts/build.mjs --seal game.json               # a finished game
```

Every build stamps a version, a content-derived id and a timestamp, and writes
`dist/build-manifest.json`. The canary shows its stamp and checks it against the
manifest, so a stale page says so instead of quietly deploying old bytes.

## Launching

See [RUNBOOK.md](RUNBOOK.md). In short: open the launch canary in a browser with
a wallet, and work down the steps. No seed phrase is involved; every transaction
is signed by the wallet. Each step is gated on the previous one having confirmed
*and been read back*, because a transaction that succeeds without meaning what
you intended is the failure worth catching.

## What version 1 deliberately does not do

- No cooldown on the open board. It will get botted. That is the experiment, and
  the log keeps the evidence.
- No stakes, no pot, no payout. Money would mean the *result* has to be
  enforceable on chain, which needs result settlement — claim a result, open a
  challenge window, let anyone refute it with one legal move from the claimed
  final position. Not built, not blocked.
- No on-chain sealing of finished games. Worth doing once there is a game worth
  sealing.
