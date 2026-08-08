# elo-v1

How ratings are computed from eligible games.

The exact formula matters less than the fact that two independent
implementations, given the same chain history, produce **identical** numbers.
There is no leaderboard server to be the tie-breaker, so a rating that differed
between readers would simply be wrong for everybody.

---

## 1. Constants

```
initial rating     1200
K                  32
provisional below  10 rated games
win / draw / loss  1 / 0.5 / 0
```

---

## 2. Canonical order

Games are applied in ascending order of:

1. **terminal block height** — the height of the block holding the submission
   that ended the game
2. **game id** — to break a tie

Both are on chain and neither can be disputed.

The second key is not decoration. Two games can finish in the same block, and
without it the order would depend on whatever order a reader happened to fetch
them in. Two readers would then compute different ratings from the same history.

---

## 3. The computation

For a player rated `R` against an opponent rated `Q`:

```
d          = clamp(Q - R, -800, +800)
E_milli    = roundHalfUp( 1000 / (1 + 10^(d/400)) )
S_milli    = 1000 for a win, 500 for a draw, 0 for a loss
delta      = roundHalfUp( 32 * (S_milli - E_milli) / 1000 )
R'         = R + delta
```

**Both players' deltas are computed from the ratings BEFORE the game.** Applying
White's change first and then computing Black's against the new number would
make the result depend on which player was processed first.

### roundHalfUp

Round to the nearest integer, **halves away from zero**.

Specified rather than left to a language's default, because the defaults differ.
JavaScript's `Math.round(-0.5)` is `-0`, which is half *up*, not half away from
zero. An implementation in another language using its own `round` would disagree
on exactly the values where it matters.

### Why the expected score is an integer per-mille

Two reasons, and the second is the important one.

**Integers do not drift.** Ratings are whole numbers, so nothing accumulates a
fractional part that two implementations could round differently after a
thousand games.

**It makes the final rounding unambiguous by construction.** Since `E_milli` is
a whole number, the value being rounded is

```
32 * d / 1000 = 4d / 125,     d an integer in [-1000, 1000]
```

and 125 is odd. For that to be exactly a half-integer we would need
`8d = 125(2k+1)`: an even left side and an odd right side, which is impossible.
So the fractional part is always a multiple of `1/125`, and the closest it can
ever come to `.5` is `1/250` — that is **0.004**, against roughly `1e-13` that a
last-bit difference in a platform's `pow` could contribute.

Eleven orders of magnitude of margin. Two implementations cannot round
differently. A test walks the whole plausible rating range and confirms the
minimum distance is exactly the predicted `1/250`.

### Why the clamp

Beyond ±800 the expected score is within a thousandth of 0 or 1 and the clamp
changes no outcome. It exists to bound the input to `pow` to a range where the
above reasoning is easy to state.

---

## 4. What a profile holds

All derived, none stored:

```
rating, peak, games, wins, draws, losses,
whiteGames, blackGames, provisional, streak,
history[]   the rating after each rated game, starting with 1200
```

`streak` is positive for consecutive wins, negative for consecutive losses, zero
after a draw.

---

## 5. The leaderboard

Ordered by rating descending, then games played descending, then principal
ascending.

The last key is what makes the order **total**. Two players on identical numbers
must still come out in the same order for every reader, and the principal is the
only thing left that is guaranteed unique.

Provisional players may be filtered out for display. That is a presentation
choice and changes no rating.

---

## 6. Identity

The player is the **Stacks principal**. A BNS name is display metadata and is
never the identity.

Anyone can register a name resembling somebody else's, which on a public board is
a plausible way to muddy attribution. If BNS resolution fails, the principal is
shown and every rating still works.

---

## 7. Changing this

A different formula is `elo-v2`, with its own identifier. `elo-v1` keeps
working, because a rating already published under it must stay reproducible
forever. A future rating protocol must not reinterpret history as though the
original algorithm never existed.
