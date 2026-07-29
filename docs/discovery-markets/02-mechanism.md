# 02. Mechanism

The three decisions that matter, in order.

1. The opening price is a machine prediction, so human credit is by definition
   payment for information the machine lacked.
2. Forecasts are sealed. You state your belief before you see anyone else's.
3. Scoring is a proper scoring rule per person per round, not an order book.

Everything else is detail.

---

## 1. The baseline model is the opening price

Run an unglamorous recommender. Genre, audio features, artist history,
collaborative filtering over whatever behaviour you already have. Nothing clever.
Its job is not to be good. Its job is to be the thing humans are measured against.

Every market opens at that model's prediction.

This does four jobs at once, which is why it is the first decision rather than an
implementation note.

- **Cold start disappears.** A market with two participants still has a sensible
  price, because the model is participant zero.
- **"Tastemaker" becomes measurable.** Your score is the improvement you made to
  the estimate. Not whether you were right, which is mostly a function of the base
  rate, but whether you knew something the system did not.
- **Piling on stops paying.** Arriving after the price is already correct earns
  close to zero, automatically, with no anti-herding rule needed. The maths does it.
- **The business question gets one number.** Market log score minus model log score,
  across resolved markets. If that is not reliably positive, there is no company
  here, and you can find out cheaply. See [04-pilot.md](04-pilot.md).

The model should be retrained on resolved outcomes and it should be allowed to get
better over time. The bar rising is the point. A crowd that only beats a
deliberately weak model is not a crowd worth having.

## 2. Sealed quotes

You state your probability before seeing the current price or anyone else's
position.

The reason this is safe is worth spelling out, because it looks like it should
break the incentives and it does not. Your expected score is

```
  E[score] = k · ( E[ln p_you(ω)] - E[ln p_open(ω)] )
```

The second term does not contain your answer. It is a constant you cannot
influence, so hiding it changes nothing about which answer maximises your expected
score. Honest reporting stays optimal. You lose no incentive property by hiding the
price, and you remove anchoring completely.

This matters because of Salganik, Dodds and Watts. Showing people what others chose
made outcomes more unequal and less predictable, with early noise amplifying into
apparent consensus. If forecasts are visible while being made, the market measures
its own echo. Sealed quotes are the structural fix, and they cost nothing.

The price is still displayed. It is displayed *after* you commit. The belief curve
in the original brief, moving from 8% to 22% to 61%, is exactly what this produces,
and it is now a curve of independent judgements rather than a curve of people
agreeing with each other.

## 3. Rounds, not a continuous book

Forecasts are collected in rounds. Everyone in a round is scored against that
round's opening price. When the round closes, the weighted aggregate becomes the
next round's opening price.

Why rounds rather than a continuous market:

- **No ordering games.** In a continuous book your payoff depends on who submitted
  three seconds before you. In rounds, everyone in the round faces the same price.
- **Early is still worth more**, because later rounds open from a better informed
  price and therefore have less improvement left to capture. The incentive survives
  without the race.
- **Commit and reveal fits naturally**, which is what makes the on-chain proof in
  [05-xtrata-fit.md](05-xtrata-fit.md) cheap and honest rather than decorative.

### Scoring

Per person, per round, on a resolved market:

```
  score_u = b_u · [ ln p_u(ω) − ln p_open(ω) ]

  where  ω       is the realised outcome
         p_u(ω)  is the probability the user assigned to it, clamped to [0.02, 0.98]
         b_u     = L_u / ln(0.98 / 0.02)  =  L_u / 3.8918
         L_u     is the user's credit budget for this market
```

The `b_u` scaling makes the worst possible outcome exactly `−L_u`, uniformly, and
known in advance. It preserves properness exactly, because scaling a proper scoring
rule by a positive constant leaves the optimal report unchanged. This is why you
scale rather than clamp. Clamping the downside would make confident wrong answers
artificially cheap and would quietly reward overconfidence.

**Worked example.** Model opens a market at 0.30. Alice says 0.70, Bob says 0.25,
both with `L = 100` credits, so `b = 25.70`.

| | Resolves YES | Resolves NO |
|---|---|---|
| Alice (0.70) | 25.70 × (ln .70 − ln .30) = **+21.8** | 25.70 × (ln .30 − ln .70) = **−21.8** |
| Bob (0.25) | 25.70 × (ln .25 − ln .30) = **−4.7** | 25.70 × (ln .75 − ln .70) = **+1.8** |

Bob is barely penalised for a small disagreement and barely rewarded for a small
correct one. Alice took a real position and gets paid for it. That asymmetry is the
whole engine.

### Aggregation

Average in log odds, weighted by reputation, with the model held as a pseudo
forecaster whose weight decays as real forecasts arrive.

```
  logit(p_next) = ( w₀·logit(p_model) + Σ w_u·logit(q_u) ) / ( w₀ + Σ w_u )
```

Two tunables, both fitted on pilot data rather than guessed:

- **`w₀`**, the model's residual weight. High when few humans have forecast, which
  is what stops a three-person market printing a confident price.
- **An extremizing factor** on the aggregate. Averaging independent forecasts
  produces an estimate that is systematically under-confident, and the standard
  correction is to push the aggregate away from 0.5. The correct factor depends on
  how correlated the forecasters are, which you will not know until you have data.
  Fit it, do not assume it.

## 4. Two currencies, kept separate

This distinction gets blurred easily and blurring it breaks the system.

**Credits** govern how much you can do. Finite, allocated on a schedule, not
purchasable, not transferable, not redeemable. Losing them means fewer forecasts
until the next allocation. This is the scarcity that makes stated beliefs
meaningful.

**Reputation** governs how much you move the public price. Earned only from
resolved outcomes. Never bought, never spent, never transferred.

Keeping these apart means a heavy user cannot buy influence through volume, and an
accurate user does not lose influence by being quiet.

## 5. Reputation, done properly

The naive version is average accuracy, and the naive version produces a leaderboard
made entirely of luck. With a handful of resolved markets each, the top of any raw
accuracy ranking is whoever got the most coin flips right.

Three corrections, all standard, all necessary.

**Shrink toward the population.** Estimate skill as

```
  ŝ_u = ( n_u · s̄_u + κ · μ ) / ( n_u + κ )
```

where `s̄_u` is the user's mean score, `n_u` their resolved count, `μ` the
population mean and `κ` a shrinkage constant set from the ratio of within-user to
between-user variance. A user with three resolved markets sits close to `μ`
regardless of how those three went.

**Weight on the lower bound, not the estimate.** For leaderboards and for
aggregation weight, use `ŝ_u − z · SE(ŝ_u)`. This means influence is earned by
demonstrating skill with enough evidence to be confident about it, not by a hot
streak. It is the same instinct behind conservative skill ratings in matchmaking
systems.

**Make it contextual, with partial pooling.** Skill is estimated per genre and per
listener cohort, in a hierarchical model where a user's estimate within ambient
borrows strength from their overall estimate. This is what delivers the property
the original brief wanted, which is that someone can be excellent at underground
hip hop and useless at pop, without needing hundreds of observations in every
bucket before their specialism shows up.

**Cap concentration.** No single user's aggregation weight may exceed some multiple
of the median, and no cluster of correlated users may collectively exceed a
ceiling. Otherwise the mechanism converges on a small number of people whose
influence then becomes worth attacking. See [03-integrity.md](03-integrity.md).

**Decay it.** Taste shifts and scenes move. Weight recent resolutions more heavily,
with a half life measured in months.

## 6. Why not an order book or an AMM

An order book needs counterparties, and a market with four participants has none.
Ruled out on those grounds alone.

The interesting alternative is a logarithmic market scoring rule, Hanson's LMSR,
which is worth understanding because it is the natural upgrade path. LMSR is
simultaneously an automated market maker and a sequentially shared version of the
log scoring rule above. It needs no counterparty, it produces a continuous price,
and the subsidiser's total loss is bounded at `b · ln(n)`.

That bounded loss is the reason to use it, and the reason not to use it yet.
Bounded subsidy matters when payouts are real money and someone has to fund them.
Here, payouts are non-transferable credits, so an unbounded credit pool is not a
problem, and per-person round-based scoring is simpler to build, simpler to explain
and free of ordering effects.

Adopt LMSR if and when real value is paid out per market. Note that the design
above is already the per-round batch form of the same scoring rule, so that
migration is a change of accounting, not a change of mechanism.

## 7. What the listener actually sees

None of the above.

They see a track, a question, a slider or three buttons, and then a reveal. The
scoring rule shows up as a number going up or down and a rank that moves. Nobody
needs to know what a log score is, in the same way nobody needs to know what Elo
is to enjoy a rating going up.

If the interface ever needs to explain properness, the interface is wrong.
