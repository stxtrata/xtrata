# Rules audit

An audit of the chess rules the board enforces, looking for edge cases where it
might accept something illegal or refuse something legal. Written after reading
`packages/chess/moves.ts`, `packages/chess/engine.ts` and `packages/chess/fen.ts`
line by line and then writing 64 named tests against them
(`tests/engine/rules-audit.test.ts`).

The short answer: **the rules are sound.** Castling out of check, through check
and into check are all correctly refused, and so are the rarer relatives of those
cases. One genuine bug was found, and it was not in move generation at all.

Why this matters more here than in an ordinary chess app: an illegal move that
the board offers becomes a submission, a submission costs a transaction fee, and
replay then skips it. The player pays for nothing and the move never happened.
A rules bug in this application is charged to the user in STX.

---

## 1. The bug that was found

**`parseFen` accepted positions where the side NOT to move was already in
check.** Fixed in [`packages/chess/fen.ts:119`](packages/chess/fen.ts).

Such a position is illegal under FIDE - the check could never have been left
standing, so no legal game reaches it. That sounds like pedantry. It is not.

Nothing in move generation refuses a capture of a king, because in a legal game
the situation cannot arise, so no engine spends the time checking for it. Given
a position where the waiting king is attacked, the side to move can simply take
it. What follows:

```
position:  4R3/4k3/8/8/8/8/8/4K3 w - - 0 1     (black king on e7, attacked by Re8)
parse:     accepted
move e7e8: legal, and it CAPTURES THE BLACK KING
after:     4R3/8/8/8/8/8/8/4K3 b - - 0 1
outcome:   {"result":"1/2-1/2","termination":"stalemate","winner":null}
```

The board reports the game as **a draw by stalemate**, because the side with no
king has no legal moves. `kings[BLACK]` now points at a square holding a white
rook, and every legality test downstream is asking about the wrong piece.

This was reachable rather than theoretical. A start position arrives from a rule
set somebody committed on chain in `rules-v1` and cannot edit afterwards. The
fix makes `parseFen` return `null` for such a position, which makes it a rule
set replay reports as unusable. That is the honest answer, and it is a great
deal better than a game that ends in a draw by regicide.

Covered by `refuses a position where the side NOT to move is already in check`,
`accepts the same positions with the other side to move`, and a walk that
asserts `never generates a move that captures a king`.

---

## 2. Castling

This is where the question started, so it gets the most detail. Castling has
more preconditions than any other move and they are easy to implement partially.

| Case | Behaviour | Test |
|---|---|---|
| Out of check | **refused** | `is REFUSED out of check` |
| Through check (the square the king crosses) | **refused** | `is REFUSED through check` |
| Into check (the square the king lands on) | **refused** | `is REFUSED into check` |
| Only `b1`/`b8` attacked | **allowed** | `is ALLOWED when only b1 is attacked` |
| The **rook** is attacked | **allowed** | `is ALLOWED when the ROOK is attacked` |
| A piece stands between king and rook | refused | `is REFUSED when a piece stands between` |
| King moved and came back | right gone permanently | `loses the right permanently once the king has moved` |
| One rook moved and came back | that side only | `loses one side only when that rook has moved` |
| Rook **captured** on its home square | right gone | `loses the right when the rook is CAPTURED` |
| A right the position cannot support | refused | `refuses a right the position cannot support` |
| Black | identical | `works identically for Black` |

Two of these are the rare ones worth being explicit about, because they are
opposites and both are frequently got wrong:

**Queenside castling when `b1` is attacked is legal.** The king travels
`e1 → d1 → c1`. It never touches `b1`. Only the rook passes over it, and a rook
may pass through an attacked square. An engine that tests "every square between
king and rook" instead of "every square the king occupies or crosses" refuses
this legal move.

**Castling when the rook itself is attacked is legal.** Only the king's
squares matter. An engine that tests the rook's safety refuses this one too.

X Chess gets both right. `packages/chess/moves.ts` tests exactly three squares
for the king: where it stands, where it crosses, where it lands.

Two guards were added during the audit that the legacy implementation did not
have. They are not reachable in a game that started from a legal position, but
they are reachable from a committed rule set with a hand-written start FEN:

- `if (from !== homeSquare) continue;` - a castling right is meaningless if the
  king is not on `e1`/`e8`, and without this the move generator would emit a
  two-square king move from wherever the king happened to be.
- `rookHere(from + 3)` / `rookHere(from - 4)` - the right does not imply a rook
  is there.

Both are covered by `refuses a right the position cannot support`.

---

## 3. En passant

| Case | Behaviour |
|---|---|
| Immediately after a double push | available |
| One move later | expired |
| After a single push | never offered |
| The captured pawn | removed from **its own** square, not the destination |
| Opens a rank onto the capturing side's own king | **refused** |
| The same capture when the rank is not open | allowed |
| An en passant square nobody can use | not reported in the FEN |

The pin case is the famous one, and it is the only move in chess that removes
**two** pieces from a rank at once:

```
8/8/8/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1
after g2g4:  f4g3 e.p. would remove the g4 pawn AND move the f4 pawn off rank 4,
             opening Rb4 through to the black king on h4.
```

The engine refuses `f4g3`. I asserted during the audit that it should be allowed
and I was wrong; the engine was right. It gets this for free rather than by
special case, because legality is decided by making the move and asking whether
the mover's king is attacked, which is the only formulation that catches this
without an explicit rule for it.

The last row is a subtlety that matters for **repetition**, not for legality.
Under FIDE, two positions differing only by an en passant square that nobody can
capture onto are the same position. `epString` reports `-` unless the side to
move actually has a pawn placed to make the capture, so a repetition that has
genuinely occurred is seen as one.

---

## 4. Pins, checks and king safety

Verified: a pinned piece cannot leave the pinning line but **can** move along
it; a king cannot retreat along the ray it is being checked on (the classic
`Kd8` after a rook check on the d-file, where the king is still on the ray);
the same for a diagonal check; double check leaves king moves only; capturing
the checker and blocking a check are both offered; a king can never stand
adjacent to the other king; discovered checks are seen.

The retreat-along-the-ray case is the one an engine gets wrong when it tests
legality by asking whether the destination is attacked *in the position before
the move*: the king is still standing on the ray and blocking it. X Chess makes
the move first and then asks, so the sliding piece's line is already clear when
the question is put.

---

## 5. Promotion

All four pieces are offered. A promotion move without a piece named is not
offered, because replay would skip it. A piece name on a move that is not a
promotion is refused. Promotion to a king or a pawn is refused. Promotion on a
capture works. A promotion that does not answer an existing check is refused,
same as any other move. The promoted piece is actually placed - a promotion that
generated correctly and then left a pawn on the eighth rank would be a much
quieter bug than it sounds.

---

## 6. Terminal positions

Checkmate, stalemate, insufficient material, fifty-move and threefold
repetition are all covered, along with the ordering between them: **checkmate is
reported ahead of any counter it also satisfies.** A position that is both
checkmate and the hundredth halfmove is a win, not a draw. Under FIDE that is
explicit, and it decides who won a real game.

Insufficient material is drawn correctly for K vs K, K+minor vs K, and bishops
on a single colour. It is correctly **not** drawn for two knights against a lone
king - mate is possible there, only not forcible - or for any position holding a
pawn, rook or queen.

### The two deliberate deviations from FIDE

Both are documented in [REPLAY-V1.md](REPLAY-V1.md#repetition-and-the-fifty-move-rule-are-automatic)
and neither is a bug:

- **Threefold repetition and the fifty-move rule end the game automatically.**
  Under FIDE these are *claims* a player makes, and only fivefold and
  seventy-five-move end a game without one. A claim needs a claimant, a
  claimant needs a message, and a message is a transaction somebody has to pay
  for. Making them automatic is what lets replay stay a pure function of the
  log.
- **Repetition counts positions by board, side to move, castling rights and a
  usable en passant square** - which is exactly FIDE's definition of the same
  position. The test `does NOT treat positions differing by castling rights as
  the same` pins this down, and it is more interesting than it looks. Shuffling
  a rook out and back returns the pieces but not the rights, so the position
  after the shuffle is a *different* position from the start. Running that
  sequence twice gives two occurrences, not three, and the engine correctly
  declines to call it a draw. Two more plies and it does draw - on an
  *intermediate* position, not the tidy one. Every position counts, not only the
  ones a human would notice.

---

## 7. A documented limitation

`applyMove(position, uci)` - the functional wrapper - **cannot see a
repetition**, because each call constructs a fresh position with no history.
The test `CANNOT see a repetition, because each call starts a fresh history`
asserts this rather than hiding it.

This is not a problem in practice: replay drives a single long-lived `Position`
through the whole log, which is where repetition is actually decided. It is
recorded so that nobody later reaches for `applyMove` in a loop and quietly
loses threefold detection.

---

## 8. Structural cross-checks

Two tests that do not target a rule but would catch a wide class of mistakes:

- **`counts the same through the fast and slow paths on tricky positions`** -
  the same node counts through both code paths on positions chosen for their
  awkwardness.
- **`leaves every position untouched after a full walk`** - generate every legal
  move, make it, unmake it, and assert the position is byte-identical to what it
  was. `makeMove`/`unmakeMove` restoring state imperfectly is the classic engine
  bug, and it produces symptoms that look like rules bugs everywhere else.

This sits on top of the existing perft suite (63 passing positions), which is
the real proof that move generation is correct: perft compares exact node counts
against published values, and a single missing or extra move at any depth shows
up as a mismatch.

---

## 9. The honest summary

**One genuine bug in the engine, and roughly nineteen wrong fixtures of mine.**

Almost every failing test in this audit was my expectation being wrong, not the
engine. The en passant pin, the castling-rights repetition, the "one more round
trip" that was two plies too long, the Scholar's mate line I used for a
check-not-mate fixture - each looked like a bug and was not.

That ratio is the useful finding. When a chess test fails, the fixture is the
first suspect, not the engine. The engine is verified by perft against published
node counts; a hand-written fixture is verified by nothing until somebody checks
it.

---

## Running it

```bash
npx vitest run tests/engine/rules-audit.test.ts
```

64 tests. Perft, which is the broader guarantee underneath:

```bash
npm run test:perft
```
