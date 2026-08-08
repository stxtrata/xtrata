# rules-v1

How a game's rules are written down, and the exact bytes they hash to.

This is a permanent protocol artefact. A game committed under it must still hash
to the same bytes in ten years, computed by somebody who has only this document
and never saw the implementation. **Nothing here may change.** A change is
`rules-v2`, with its own identifier, and `rules-v1` keeps working.

---

## 1. Why there is a hash at all

The contract stores a **hash** of a game's rules and never the rules. That keeps
it ignorant of chess and keeps opening a game cheap.

Without a commitment, two boards could claim different rules for the same game
and nothing would decide between them. With one, anyone can hash a proposed rule
set and check it against the chain.

A hash cannot be turned back into rules. It can only **confirm** them. If what
somebody proposes hashes to what a game committed, that is proof — no other rule
set could have produced it.

Worth knowing: for simple rule sets this is a short search, so a game's rules are
not private. They were never meant to be.

---

## 2. The fields

| field | type | meaning |
|---|---|---|
| `replayProtocol` | protocol id | which replay definition applies |
| `eventsProtocol` | protocol id | which control strings mean something |
| `white` | side | who may play White |
| `black` | side | who may play Black |
| `allow` | list of principals | if non-empty, only these may submit at all |
| `cooldown` | whole number | how many other moves a sender waits before moving again |
| `noConsecutive` | boolean | nobody may submit twice in a row |
| `ranked` | boolean | this game counts towards ratings |
| `startFen` | FEN | the position the game starts from |

A **side** is a Stacks principal, or one of two distinguished words:

- `anyone` — no restriction.
- `anyone-else` — everybody except whoever holds the other side. It exists
  because naming White and leaving Black open lets the named player answer their
  own moves, which is a different game. When the other side is not a specific
  person there is nobody to exclude, so this reads as `anyone`.

**`cooldown` is counted in MOVES, not blocks.** A Stacks block is seconds, so a
wait in blocks stopped nobody. A wait of 1 is exactly `noConsecutive`. A wait of
N needs N+1 different people able to move, or the game deadlocks permanently —
which is refused at creation, not warned about, because the rules are already
hashed on chain and there is no fixing it afterwards.

---

## 3. The canonical encoding

**Ten fields, separated by a single newline (`0x0A`), encoded UTF-8, hashed with
SHA-256.**

```
line 0   "rules-v1"          this encoding's own name
line 1   replayProtocol
line 2   eventsProtocol
line 3   white
line 4   black
line 5   allow               comma-joined, sorted, deduplicated; "" for none
line 6   cooldown            decimal, no sign, no leading zeros
line 7   noConsecutive       "0" or "1"
line 8   ranked              "0" or "1"
line 9   startFen
```

There is no trailing newline.

### Why not JSON

JSON looks fine and hides two traps. Its string escaping is implementation-
defined at the edges — which characters get `\u` escapes, and in which case — and
its number formatting has no single spelling for every value. Neither matters
until the day it does, and by then the games are on chain.

This encoding has exactly one spelling for any rule set, and an independent
implementation is about twenty lines.

### The character sets

Every field is validated against a set that **cannot contain a newline**, which
is what makes the encoding unambiguous by construction rather than by escaping.

| field | permitted |
|---|---|
| protocol ids | `[a-z0-9-]+` |
| sides | `anyone`, `anyone-else`, or `^S[0-9A-HJKMNP-TV-Z]{5,}$` |
| allow entries | the principal pattern only |
| cooldown | a non-negative integer, written in decimal |
| booleans | exactly `0` or `1` |
| startFen | `[a-zA-Z0-9/ -]+` |

The principal pattern is Crockford base32 without `I`, `L`, `O` or `U`, which is
what c32 addresses use. It is always upper case: a rule set is compared byte for
byte against a transaction's sender, and two spellings of one address would be
two different commitments.

Neither sides nor allow entries may contain a comma, which is what makes the
comma-joined allow list unambiguous.

### What is refused

Canonicalisation **throws** rather than guessing. It is only ever called to
produce a commitment, and a commitment made from a value nobody checked is a
side somebody may be unable to play, permanently.

- A **BNS name** where a principal belongs. Replay compares principals, and a
  sealed board has no network, so a name must become an address *before* it is
  hashed. A name that reached the hash would be a side nobody could ever play.
- Anything non-ASCII, or containing a newline or comma.
- Letters c32 does not use (`I`, `L`, `O`, `U`) — those are typos, not addresses.
- A non-integer or negative cooldown.
- A duplicate in the allow list.
- A `startFen` containing a character FEN does not have.

### Sorting

The allow list is **sorted and deduplicated during canonicalisation**, not
trusted from the caller, so that two people who listed the same wallets in a
different order commit to the same bytes.

---

## 4. Golden vectors

The full set is `tests/rules/golden-rules-v1.json`, and it is a permanent
artefact: a vector may be added, never changed.

The open board, which commits to nothing:

```
rules-v1\nreplay-v1\nevents-v1\nanyone\nanyone\n\n0\n0\n0\nrnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```
```
sha256 = 4a346f8d55d7ba322adeb2a778f6032df6ed28784245ebec92e922856231b368
```

Two named players, ranked:

```
rules-v1\nreplay-v1\nevents-v1\nSP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7\nSP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X\n\n0\n0\n1\nrnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```
```
sha256 = c5798f469b3b8d72c673fd3c75a74e673225229cca3dfcb37bfc5cd8e2568f50
```

The same players, unranked, differ only in line 8 and hash to
`7c149311a6f5134feb20b99ce52c258a029377d916610ecbd38db9935f15abb4`. Ranked
status is inside the commitment, which is what stops it being retrofitted onto a
game that was not offered as one.

---

## 5. Matching a commitment

```
rulesMatchCommitment(rules, committedHex)
```

- A game that committed to **nothing** matches **nothing**. A board that
  refereed such a game would be enforcing rules the game never agreed to, and
  would skip submissions every other reader accepts.
- The comparison ignores a `0x` prefix and is case-insensitive on the hex.
- Rules that cannot be canonicalised match nothing, and this returns false
  rather than throwing.

Every path that is not an exact hash match ends with the board refereeing
nothing and saying so.
