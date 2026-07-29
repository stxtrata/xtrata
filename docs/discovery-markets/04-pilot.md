# 04. Pilot

The original brief proposes 100 tracks and 500 listeners. That is roughly the right
order of magnitude and the wrong shape. This document works through the numbers and
proposes a revised version.

The headline finding: **the proposed pilot is well powered for the question it does
not ask, and underpowered for the question that decides whether the company
exists.**

---

## Study 0, which comes first and costs almost nothing

Before any mechanism, answer this:

> Will anyone listen to unknown music, all the way through, more than once?

A landing page. A queue of unreleased tracks. No market, no credits, no scoring, no
account beyond an email. Two weeks.

Measure completion rate on first track, tracks per session, sessions per user, and
day 7 return. That is it.

If people will not listen blind, every other document here is moot, and no amount
of mechanism design fixes it. This is the cheapest kill switch available and it
should be pulled before anything is built. It also produces the first training data
for the baseline model, which the real pilot needs anyway.

Do not skip this because it feels obvious. Listener supply is the top risk in
[README.md](README.md) and this is the only cheap test of it.

---

## The two questions the real pilot must answer

Co-primary. Both have to pass.

**Q1. Does the crowd beat the model?**
Mean per-track log score of the reputation-weighted market, minus the same for the
baseline recommender, across resolved markets. If this is not reliably above zero,
there is no information here that a boring algorithm did not already have.

**Q2. Is forecasting skill a persistent individual trait?**
Split each forecaster's resolved markets at random into two halves, estimate skill
on each, correlate across users. If that correlation is near zero, tastemakers do
not exist as a stable property, they are just the tail of a coin-flip
distribution, and the entire reputation layer, the personalised feed and the
"people whose taste overlaps with yours" product are fiction.

Q2 is the one people forget, and it is the one I would worry about more. Q1 can
pass on aggregate wisdom-of-crowds alone. The *product* in the original brief,
where your feed is built from specific listeners whose judgement is reliable in
your scenes, requires Q2. A system can have real aggregate signal and still have no
identifiable tastemakers.

---

## Why 100 tracks and 500 listeners is the wrong shape

### Problem 1. Binary thresholds throw away data you cannot spare

Take the proposed framing, "will more than 35% of blind listeners save this".

With 500 listeners split into forecaster and resolver roles, roughly 250 resolvers,
and a realistic budget of about 20 unknown tracks each, you get 5,000 resolution
listens. Spread over 100 tracks that is **50 listens per track**.

At n = 50 and a true rate near 30%, the standard error on a measured rate is 6.5
points, so a 95% interval spans roughly ±13 points.

| True rate | Probability it resolves above a 35% threshold |
|---|---|
| 25% | 5% |
| 30% | 22% |
| 35% | 50% |
| 40% | 77% |

Tracks that genuinely differ by 10 points in quality produce outcomes that overlap
heavily. Forecasters are being scored substantially on sampling noise, which
attenuates every skill estimate and makes Q2 harder to answer than it needs to be.

Then dichotomising makes it worse. Cutting a continuous quantity at a threshold
retains about 64% of its information at best, and less when the threshold sits away
from the centre of the distribution. You are discarding a third of data you already
established was scarce.

**Fix: resolve on the measured rate itself, not on whether it crossed a line.**
Score forecasters against the realised continuous value. Keep the "will it break"
framing as surface copy only.

### Problem 2. Absolute thresholds need per-genre calibration forever

A 35% save rate means something different in ambient than in drill. Somebody has to
set that number for every genre and reset it whenever platform traffic changes.
Every one of those settings is arbitrary and every one is arguable.

**Fix: pairwise comparison within a genre stratum**, as in
[01-concept.md](01-concept.md). No threshold to calibrate, and the output is a
ranking, which is the product.

Be precise about what this buys, because it is easy to oversell. Pairwise cancels
*common mode* noise, which means platform-wide traffic shifts, day-of-week effects,
seasonal drift and cohort composition changes. It does **not** reduce independent
sampling error. Only bigger cohorts do that.

### Problem 3. Power for Q1 is adequate. Power for Q2 is not

For Q1, a paired comparison of market against model across N tracks:

| Effect size | Tracks needed for 80% power |
|---|---|
| Large, d = 0.5 | ~32 |
| Moderate, d = 0.3 | ~87 |
| Small, d = 0.2 | ~196 |

So 100 tracks detects a moderate effect and is blind to a small one. **That is
acceptable**, because a small effect would not justify building the company. Inflate
somewhat for outcome measurement noise, which attenuates the observed effect by
roughly the square root of the outcome's reliability, around 0.84 at n = 50 per
track. Call it 120 tracks for a comfortable read on d = 0.3.

For Q2 the constraint is completely different. It is **forecasts per person**, not
tracks. With 500 listeners each forecasting 20 tracks, a split-half skill estimate
rests on 10 observations per half. Skill estimates that thin are so noisy that the
split-half correlation is crushed toward zero even if true skill variance is
substantial. The study would return "no tastemakers exist" as an artefact of its
own design, which is the worst possible outcome because it looks like a real
finding.

**Fix: a smaller, deeper forecaster panel.** 120 to 150 people making 40 to 60
forecasts each beats 500 people making 20. Same total forecasts, dramatically
better answer to Q2, and better engagement data as a bonus.

---

## Revised pilot

| | Original | Revised |
|---|---|---|
| Forecasters | 500, ~20 each | **120 to 150, 40 to 60 each** |
| Resolvers | overlapping | **disjoint per track, roles assigned per (user, track) pair** |
| Tracks | 100 | **120 broad, plus a 20 track deep subset** |
| Resolution per track | ~50 | **~50 broad, ~250 on the deep subset** |
| Outcome | binary threshold | **continuous rate, pairwise within genre stratum** |
| Primary metric | "does it work" | **Q1 and Q2 above, pre-registered** |

**Role assignment.** I1 requires disjoint populations *per track*, not globally, so
each participant can forecast some tracks and resolve others. Assign the role
randomly for each user-track pair. This roughly doubles the effective sample from
the same recruitment, and it is fully compatible with the invariant.

**The deep subset** exists because Q1 and Q2 are served by many shallow tracks,
while *demonstrating* the product needs a handful of tracks measured well enough to
say something confident about any one of them. Those are different studies and they
are cheap to run together. The deep subset also validates the shallow measurements,
by showing how far a 50-listener estimate typically sits from a 250-listener one.

**The wildcard arm.** A random slice of tracks promoted to market regardless of
first-pass panel performance. Without it you cannot tell whether the funnel selects
well, only whether the market forecasts the tracks the funnel selected.

**Timeline.** A 7 day return outcome means at least 7 days after the last exposure,
plus recruitment, plus a ramp. Ten to twelve weeks end to end. Do not promise six.

---

## Pre-register, in writing, before you run it

There are dozens of defensible ways to analyse this and several of them will
produce a positive result from pure noise. Write down first:

- the exact primary metrics for Q1 and Q2
- the exact analysis, including how skill is shrunk and how weights are set
- the exclusion rules for contaminated resolution data
- **the kill criteria**

Kill criteria, stated up front so they cannot be renegotiated afterwards:

- Q1 confidence interval includes zero. The crowd adds nothing over a boring model.
- Q2 split-half skill correlation below roughly 0.2. There are no tastemakers.
- Study 0 completion rate too low to sustain the listening the mechanism needs.

Any one of these failing is worth knowing, and worth knowing before a second round
of funding rather than after.

---

## What the pilot cannot tell you

- **Whether it survives adversaries.** 150 recruited participants will not attack
  the system. Everything in [03-integrity.md](03-integrity.md) is untested by this
  pilot and stays untested until there is something worth attacking.
- **Whether markets stay informative at scale.** Thin markets behave differently
  from deep ones, and a curated 150-person panel is not a real population.
- **Whether anyone wants this.** Recruited participants are not the same as
  retained users. Study 0 gets closer to this than the pilot does.
- **Whether the ranking makes better feeds.** That is an A/B test on live traffic,
  market-ranked against model-ranked, measured on downstream listening. It is the
  real product test and it is study 3, not study 2.
