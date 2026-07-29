# Discovery Markets

A market-powered discovery layer for new music. Working notes, not a spec.

Status: design exploration, nothing built.
Date: 2026-07-29

---

## The thesis in one paragraph

Recommendation systems infer taste from behaviour and keep the inference private.
A discovery market makes collective judgement explicit, scored and attributable.
Listeners hear a track blind, state how well they think it will do with people who
have never heard it, and are scored on how much they improved the platform's
existing estimate. People who repeatedly improve it in a given scene become
weighted sources for that scene. The output is a ranking built from accountable
human conviction rather than from an opaque model.

## What is actually new here

Music prediction markets already exist on Polymarket and Kalshi. They forecast
what the music industry will do, which means chart positions, sales, awards and
streaming milestones. That is betting on an external outcome.

This is different in one specific way. The market does not observe the platform,
the market *is* the platform's ranking function. The forecast is the product.

That difference is also the whole risk. When a market's forecast controls the
thing it forecasts, the market can manufacture its own result. Most of the design
work below is about breaking that loop.

## Read in this order

| Doc | What it covers |
|---|---|
| [01-concept.md](01-concept.md) | Product shape, what it is, what it deliberately is not |
| [02-mechanism.md](02-mechanism.md) | The core mechanism. Sealed quotes, LMSR, reputation |
| [03-integrity.md](03-integrity.md) | Threat model. Reflexivity, sybils, collusion, herding |
| [04-pilot.md](04-pilot.md) | The first experiment, and what it can and cannot prove |
| [05-xtrata-fit.md](05-xtrata-fit.md) | What genuinely belongs on chain, and what does not |
| [06-open-questions.md](06-open-questions.md) | Regulation, revenue, and the things I cannot resolve |
| [07-real-money.md](07-real-money.md) | How Polymarket works and makes money, and what a paid version needs |
| [08-positioning.md](08-positioning.md) | **The current pitch.** The thesis, and four rooms that need four versions |
| [NOTES.md](NOTES.md) | What changed from the original brief, and next actions |
| [PITCH.md](PITCH.md) | The same idea with no jargon, written for artists and listeners |
| [30-SECOND-PITCH.md](30-SECOND-PITCH.md) | The spoken version, plus answers to the questions it provokes |
| [pitch-web.html](pitch-web.html) | Web version of the pitch, sourced. Published as a private artifact |

---

## My verdict, stated plainly

The idea is strong and the strongest version is narrower than the pitch.

**Three things in the original framing I would change.**

1. **Do not build a Spotify.** "Decentralised music indexer" is the weakest part of
   the framing. Replacing a streaming service means winning a licensing war against
   three major labels, and nobody wins that from a standing start. The valuable
   asset is the ranking, not the catalogue. If the ranking is genuinely early and
   genuinely right, the streaming services and the labels become customers, not
   competitors. Aim to be the chart that gets consulted, not the app that gets
   installed instead of Spotify.

2. **The main danger is not manipulation.** The original note treats crowd
   manipulation as the primary risk. I think it is third. The primary risk is
   listener supply. Every mechanism here assumes a steady flow of people
   voluntarily listening to unknown music, all the way through, and reporting
   honestly. That is genuinely hard work and most people do not want to do work.
   If the first sixty seconds are not fun to somebody who has never heard the word
   "market", nothing downstream matters. Manipulation is a problem you get to have
   only if you succeed at the first one.

3. **"Will it be a hit" is the wrong question, but so is "will it exceed 35%".**
   Absolute thresholds are dominated by measurement noise at small cohort sizes and
   need per-genre calibration that will always be arbitrary. Relative questions are
   far more robust and produce a ranking directly. See
   [02-mechanism.md](02-mechanism.md).

**The single most important idea in these docs.** The platform runs a boring
baseline recommender, and that model's prediction is the market's opening price.
Every credit a human earns is therefore, by construction, payment for information
the model did not already have. It makes cold start a non-issue, it makes
"tastemaker" a measurable quantity instead of a vibe, and it makes the central
business question answerable with one number: does the crowd beat the model, and
by how much. If that number is zero, the company does not exist, and you can find
that out in one pilot for very little money.

**The second most important idea.** Nobody may help resolve a market they
forecasted on. Forecaster and resolver populations must be disjoint, per track,
enforced structurally. This is the answer to the failure mode the FT reported in
July 2026, where wagering activity and the metric being wagered on were not
separated. Everything else in [03-integrity.md](03-integrity.md) is secondary to
this one rule.

**What I would want to know before building anything.** Whether people will listen
blind at all. That is a two week test with a landing page and no market
mechanism whatsoever, and it should happen before a line of contract code.
