# replay-v1

How a log becomes a position and a result.

This is the consensus mechanism. Everything the product shows — the board, the
move list, whose turn it is, who won, every rating — is derived by this function
and stored nowhere. Frozen.

---

## 1. The two properties

```
replay(log, rules) -> state
```

**TOTAL.** It never throws, for any input at all. The log is arbitrary strings
written by anyone, by construction: the contract filters on length and nothing
else, so any four or five characters can and eventually will be in a game. A
malformed submission is an ordinary outcome, not an error.

**DETERMINISTIC.** The same log and the same rules give the same output, every
time, in every implementation of this document.

The corollary the UI must state plainly: **a submission that does not count was
still stored and still charged.** It simply does not count.

---

## 2. Order

Submissions are replayed in **`seq` order**, which is the order the contract
assigned. Never by block height and never by timestamp: those can tie within a
block, and a tie would be two readers disagreeing.

`seq` **orders, it does not count plies.** It counts submissions including the
ones replay skips, so it drifts from the ply count. Nothing may treat it as a
chess concept.

`seq` need not start at zero or be contiguous. A reader that used the array
position instead of the field would disagree with one that used the field.

---

## 3. The algorithm

```
position := the rule set's startFen
if the position cannot be parsed:
    every entry is rejected with `bad-start-position`; stop
if the position is ALREADY terminal:
    record that result; terminalSequence is null
for each entry in seq order:
    if the game is over:            reject `game-over`
    if the entry is a control string:
        apply the events-v1 rules
    else:
        if the rules refuse the sender:  reject with that reason
        if the move is not legal here:   reject, classified
        otherwise accept, and clear any standing draw offer
        if the position is now terminal: record the result
```

A start position that is already finished is not hypothetical: king and knight
against a lone king is dead the moment it is set up. Without the check, the log
would report itself as live and label every submission "illegal" — true of each
one individually, and wrong about the game.

---

## 4. Rejection reasons

Frozen. A reader may show them however it likes but must not invent new ones for
`replay-v1`.

| reason | meaning |
|---|---|
| `malformed` | neither a legal UCI move string nor a known control string |
| `empty-square` | well formed, but the origin square is empty |
| `wrong-turn` | well formed, but the piece belongs to the side not to move |
| `illegal` | well formed, and simply not legal here |
| `game-over` | anything at all after the game has ended |
| `not-allowed` | the rules' allow list does not include this sender |
| `wrong-player` | this sender does not hold the side to move |
| `consecutive` | `noConsecutive`, and this sender made the previous move |
| `cooldown` | this sender has not waited long enough |
| `not-a-player` | a control event from somebody who holds neither side |
| `offer-pending` | a draw offer while another offer is standing |
| `no-offer` | a draw acceptance with no offer from the other side |
| `bad-start-position` | the rule set's starting position is not a position |

**The order of the checks is part of the protocol**, not an implementation
detail. A submission can break more than one rule at once, and which reason is
recorded is part of the permanent record. Who may move is settled *before*
whether the move is legal.

---

## 5. Results and terminations

```
result       "1-0" | "0-1" | "1/2-1/2" | null
termination  checkmate | stalemate | repetition | fifty-move |
             insufficient-material | resignation | agreement | null
```

`result` is the score and has exactly four possibilities. `termination` is the
reason and is the part that may gain entries in a future protocol. A reader that
understands `result` and not a new `termination` still knows who won.

### Repetition and the fifty-move rule are AUTOMATIC

Under FIDE both are **claims** a player makes, and only fivefold repetition and
the seventy-five-move rule end a game without one. A claim needs a claimant, a
moment, and an arbiter — none of which exist in a log that anyone may append to
and everyone replays independently.

Making them automatic keeps the result a pure function of the log. **This is a
protocol choice, not an approximation of FIDE**, and it is the single place
where `replay-v1` deliberately differs from over-the-board play.

- Repetition: **threefold**, counting positions by board, side to move, castling
  rights, and an en passant square only when the side to move can actually
  capture onto it.
- Fifty-move: halfmove clock at **100**.

### Insufficient material

King versus king; king and one minor versus king; and bishops that all stand on
one colour of square.

Two knights against a lone king is **excluded**: mate is reachable there with
cooperation, so the game is not dead.

### The order terminal conditions are checked

A position can satisfy more than one at once. The order is fixed so that which
termination is recorded does not depend on how the checks happen to be written:

1. checkmate
2. stalemate
3. insufficient-material
4. repetition
5. fifty-move

Checkmate first, because it ends the game regardless of any counter.

---

## 6. The output

```
position          the position reached
rules             the rules it was replayed under, normalised
fen, startFen
turn              "white" | "black"
inCheck
legalMoves        empty once the game is over, whatever the board says
status            "live" | "over"
result, termination
terminalSequence  the seq of the submission that ended it, or null
accepted[]        in order
rejected[]        in order, each with its reason
log[]             every submission in order, accepted and rejected alike
lastAccepted
moveNumber        the full move number of the position reached
pendingOffer      "white" | "black" | null
pgnMoveText
```

`terminalSequence` is null when the game is unfinished **and** when the start
position was already terminal, because no submission ended it.

---

## 7. The invariant

> **Removing every rejected entry from the log does not change the position, the
> result, or the termination.**

This is the property the whole architecture rests on, and it is asserted over
thousands of seeded random logs in `tests/fuzz`. If it ever failed, the log
would stop being a shared record: a reader who filtered differently would see a
different game.

Two more, also fuzzed:

- Every submission is accounted for exactly once, and `log` preserves the input
  order and every `seq`.
- Nothing is ever accepted after `terminalSequence`.
