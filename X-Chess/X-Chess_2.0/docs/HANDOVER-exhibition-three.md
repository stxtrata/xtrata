# Handover: Exhibition Three

Everything below landed between `19201931` and `22674575` on
`main-staging-chess`. Working tree clean, `npx tsc --noEmit` clean, **1,484
tests passing**, 17 skipped.

Exhibition Three is running now. Rounds 1 and 2 are played or playing. Do not
re-run rounds that have already gone; the chain is the record.

---

## What is on chain, and what each thing is

| | id | note |
|---|---|---|
| engine | 2991 | fetched and executed by the runner, hash-pinned |
| manifest builder | 2992 | |
| entry validator | 2994 | parses every sheet before it is paid for |
| character sheets | 2995–3000, **3010–3013** | ten of them, all parse under 2994 |
| **board** | **3014** | version 2.1.2, hash `acc7e9b1`, 13 chunks |
| **tournament** | **3016** | 90 games, 10 entrants, 18 rounds, `cooldown: 1` |
| abandoned manifest | 3015 | see below. Do not cite it, do not delete it |

Contract is unchanged: `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1-canary`.

---

## The three things you need to know before touching anything

### 1. A pairing gets one ranked game, ever

A game's rules hash commits white, black, ranked and the protocol, and nothing
that says which tournament it is. Exhibitions One and Two used all thirty
pairings available to their six players (21 + 9 = 30, the complete double round
robin). A third tournament among the same field could not open a single game.

**Exhibition Three exists because it declares `cooldown: 1`.** That changes the
rules hash and frees every pairing. In a two-player game a cooldown of 1 can
never reject anything — it is counted in moves, "wait for one other to play",
and the opponent always has — so it costs no gameplay. It is a tournament
discriminator wearing a rule's clothes, and `Tournament.cooldown` says so in
its own comment rather than pretending otherwise.

**It must be declared or nothing verifies.** A verifier rebuilds the rules from
the pairing and compares. Rebuilt with the wrong cooldown, every game reports
"the rules this game committed to are not this pairing" — a false accusation on
a board whose purpose is never to repeat an unchecked claim.

There is now **one** `rulesFor()` in `packages/protocol/tournament.ts`, and the
three sites that used to build rules inline all call it. If you add a fourth,
call it too.

### 2. `--after` on a tournament manifest means REVISION, not sequence

`inscribe-manifest.mjs --after N` is documented as "the manifest this one
follows". `resolveTournament` reads any dependency that parses as a manifest as
an **ancestor** and returns the root of that walk as the tournament id. Those
are different relationships and the format has one link.

Exhibition Three went up at **3015** declaring 3001 and resolved to **3001** —
Exhibition Two's id, with a finished tournament appearing to have been revised
into a ninety-game one. It was re-inscribed at **3016** with no dependency, for
0.03 STX, before any game was played.

The inscriber now **refuses** `--after` on a tournament manifest and explains
why. `--revises` is the escape hatch for a deliberate revision.

**The walk-back chain `--after` promises does not exist.** It needs a second
link kind the format does not have. That is real work and is unstarted.

### 3. The board is inscribed and is now behind the source

3014 does not have the last three commits. **Three things are queued for the
next board inscription:**

- the collapsed chooser (one chip per tournament)
- the `revisedInTime` gate on the open path
- whatever else lands before you inscribe

A board inscription is 13 chunks and cost **0.236 STX** all in last time.

---

## New in the protocol

**`Tournament.cooldown`** — declared, validated as a whole non-negative number,
absent means 0 so 2993 and 3001 keep parsing unchanged.

**`TournamentEntrant.depth`** — an OFFSET on the engine's own piece-count
curve, `depthFor(fen) + depth`, capped at `MAX_DEPTH_OFFSET = 2`. Not an
absolute depth: `depthFor` returns 3 in a full opening and 7 in a bare ending
because a fixed number is unplayably slow at one end and useless at the other.

Depth **retires a rule that was true until now**. `personalities.mjs` opens by
saying a personality is a prompt and nothing else, "not a search depth",
because everyone getting the same engine was what made the comparison fair.
Exhibition Three is a handicap event. That was a deliberate decision by the
organiser, not a drift.

Depth is **the one claim a manifest makes that nobody can check**. It leaves no
trace in a game log, because characters deviate from the engine by style and
the setting cannot be read back off the moves. The board shows it as
`declared`, dotted, with the reason in its title. Any UI that shows it must
keep that distinction.

**`revisesSameTournament(child, parent)`** — a revision must share at least one
game with the manifest it declares. One game, not all: a correction may add,
drop or repair games, and demanding an exact match would refuse the corrections
the mechanism exists for.

**`revisedInTime`** was written with the revision rule and **was never called by
anything** until now. It is called in `loadTournament`, where the first-move
height is already in hand.

---

## The correction mechanism, and why it is safe

A manifest is permanent, so the only remedy for a wrong one is a better one
inscribed **by the same wallet** that declares it. Four rules make that safe,
all now asserted together in `tests/protocol/tournament.test.ts`:

1. the correction keeps the original id rather than becoming a new tournament;
2. a different wallet is refused as a **fork**, so nobody can adopt your
   tournament by inscribing a manifest that declares it;
3. a revision counts only if it landed **strictly before** the first move —
   `revisedInTime(100, 100)` is `false`, because a tie must not favour the
   organiser;
4. lineage depth is capped at `MAX_REVISIONS`.

The chooser applies the **creator** gate, where it is free (`official` is
already `mintedHere`). The **window** gate is applied on open, where the
heights are already being fetched. Splitting them is deliberate: the cheap
check is in the list, the expensive one is where the data lives, and neither is
skipped.

**Do not "simplify" this by hiding revisions.** That was my first version and it
is worse: it makes a correction invisible rather than authoritative, which is
the opposite of the point. The comment in `collapseRevisions` says so.

---

## The harness

**`wizardRules(white, black, { cooldown })`** and a single seam
`tournamentRules()` in `run-tournament.mjs`. Five call sites used to reach past
that seam straight to `wizardRules`, which was harmless while every tournament
shared the defaults. A cooldown applied when a game is OPENED and forgotten
when its hash is CHECKED gives a game the runner refuses to play into,
permanently, having already paid the open fee.

The number reaches the seam from whichever source is authoritative: **`--cooldown`
when opening**, because nothing is written down yet, and **the manifest when
playing**, because that is the record. Passing both and disagreeing is refused
rather than quietly resolved.

**`play.mjs fund --float N`** — `planFunding` always took a target; only the CLI
had no way to say it. Capped at the house float so a mistyped `--float 20` is
refused before the first transfer.

**`inscribe-manifest.mjs`** accepts `X-CHESS-ENTRY/1` and parses each sheet with
the validator **fetched from 2994**, not the local copy. A repo drifted ahead of
the chain would approve a sheet no reader could parse, permanently, and the fee
is spent by then.

**`harness/shots.mjs`** — screenshot driver, no dependencies. Node ships a
WebSocket and Chrome speaks DevTools over one. It shoots the inscription rather
than a local build, because the images go under posts claiming the board is on
chain. It waits for elements rather than sleeping: every chip is read from
chain and takes ~15 seconds, and the standings replay ninety games and take
minutes. A missing chip and an unclicked one are identical in a PNG.

---

## The characters

Four added: **Fathom** (simplifier, +2), **Cadence** (initiative, +1),
**Bulwark** (counter-attacker, +0), **Canon** (classical, +1).

They are written **sheet-first**. The file in `harness/wizards/entries/` is the
source and the prompt in `personalities.mjs` is exactly what `entryToPrompt`
renders from it. `tests/wizards/entries.test.ts` asserts they are identical,
not similar.

The original six went the other way — prompt first, sheet transcribed
afterwards — so their inscribed sheets at 2995–3000 carry the same words with
the paragraph breaks joined away. That is a real confound and is recorded in
`docs/PLAN-tournament-three.md`. Do not "fix" it: those sheets are on chain and
their games are played.

`AWAITING_INSCRIPTION` in `tests/chess/skill.test.ts` is empty and should stay
in the file. It held these four between writing and inscribing, which is the
window it exists for: a character whose sheet is a file on one machine must not
play.

---

## The depth ladder, and what it is for

```
+0   Ledger, Plumb, Bulwark
+1   Gambit, Mason, Cadence, Canon
+2   Wager, Oblique, Fathom
```

Set **against** Exhibition One's finish, not with it. Plumb won that tournament
and stays level; Wager and Oblique took two points each and get the deepest
search. If depth decides chess the table should invert. If character decides
it, Plumb wins again from the bottom of the ladder.

Two rounds in, **Plumb has beaten Oblique +2 and Wager +2** and leads on 2 from
2. That is two games and should be said as two games.

---

## Known open, and none of it is started

- **`ops/STATUS.md` is stale.** It says the board is not inscribed and that
  every open gate is a reason not to inscribe. It was wrong when I read it and
  I acted on it. Correct it before it misleads the next reader.
- **The sequence link does not exist.** See point 2 above.
- **3015 is abandoned on chain.** Nothing points at it. The chooser now hides
  it because its declared parent shares none of its games. It is still openable
  by number, which is correct: it is a real document.
- **The one-ply control arm has never completed.** Everything claimed about the
  engine's effect rests on the on-chain record rather than a controlled
  comparison. That is lab work and belongs in `lab.mjs`, where it costs nothing.
- **`tests/ui/tournament-cache.test.ts`** had `as never` erasing the deps
  object's shape, which broke `tsc` for everyone. Fixed in passing; mentioning
  it because it was not mine.

---

## Costs actually measured, not estimated

- a move: **400 µSTX**, confirmed by game 15 paying exactly 23 × 400
- opening a game: **0.010 STX** plus a miner fee
- opening all 90: **1.206 STX**
- round 1, five games to checkmate: **0.035 STX**
- four one-chunk sheets: **0.124 STX all in**, so 11,000 µSTX protocol each
- the board, 13 chunks: **0.236 STX all in**

**`get-fee-unit` is not a price.** It returns 100,000 µSTX and a one-chunk mint
costs 11,000. The "spend cap 300000" the inscriber prints is a `willSendLte`
post condition, deliberately loose, because an exact-match condition aborts and
burns the miner fee. I quoted 1.3 STX for a board off that number and it was
wrong by 5x.
