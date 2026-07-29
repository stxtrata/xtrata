# Working notes

2026-07-29. First pass on the discovery markets idea. Design only, nothing built,
nothing decided.

---

## What changed from the original brief

Recorded so the reasoning is not lost, since most of these look like small changes
and are not.

| Original | Now | Because |
|---|---|---|
| Market opens at 50% or at nothing | Opens at a baseline recommender's prediction | Kills cold start, makes "tastemaker" measurable, makes piling on stop paying |
| Predictions visible while being made | Sealed until you commit | Salganik. And it costs no incentive property to hide the price |
| Absolute thresholds, "over 35% saves" | Continuous rate, pairwise within genre | Thresholds need per-genre calibration forever and throw away a third of scarce data |
| A market per track | Markets are scarce, tracks earn one | Forecasting attention is the constraint, not credits |
| Manipulation is the main danger | Listener supply is the main danger | Everything assumes people will listen blind, which is work |
| 500 listeners, 20 forecasts each | 120 to 150, 40 to 60 each | Split half skill estimates on 10 observations return "no tastemakers" as an artefact |
| Reputation from accuracy | Shrunk, lower bounded, contextual, decayed | Raw accuracy leaderboards are made entirely of luck |
| Decentralised Spotify | Discovery and ranking layer | Replacing streaming means a licensing war nobody wins from a standing start |

## The two rules that everything else rests on

Written here separately because they need to survive into any implementation, and
because both will look like removable friction to somebody later.

1. **Nobody helps resolve a market they forecast on.** Disjoint per track, enforced
   at assignment.
2. **Resolution counts only randomly assigned exposures.** Never exposure caused by
   ranking, sharing or a playlist.

Rule 2 is the one that cuts the ranking-to-outcome loop. Without it the market
funds its own result, which is the failure mode in the FT piece from earlier this
month.

Corollary worth remembering: the exploration quota and the measurement instrument
are the same thing. Anyone arguing to cut exploration for short term engagement is
arguing to blind the company.

## Next actions, in order

1. **Study 0.** Landing page, queue of unreleased tracks, no market, no scoring, two
   weeks. Does anyone listen blind at all. Near zero cost, and it is the cheapest
   kill switch available. Nothing else should start before this.
2. **Baseline model.** Needed as the opening price. Study 0 produces its first
   training data, so these are sequential and not parallel.
3. **Pre-register the pilot.** Q1, Q2, analysis, exclusions, kill criteria, in
   writing, before running anything. See [04-pilot.md](04-pilot.md).
4. **Counsel on the paid panel framing**, before any credit or reward mechanism is
   designed. See [06-open-questions.md](06-open-questions.md).

## Decisions that need Jim

- Whether to run Study 0 at all, and under what name. It needs no infrastructure
  and no mention of markets, chains or Xtrata.
- Whether selling early signal to A&R is acceptable positioning. It is the likely
  first revenue and it sits against the "not the music industry" framing.
- Where a scene ends and collusion begins. Policy question, not technical, and
  somebody has to own it.

## To verify before any of this leaves the building

- Xtrata fee figures in [05-xtrata-fit.md](05-xtrata-fit.md) are from memory notes,
  not a live mainnet estimate.
- Precedents in [01-concept.md](01-concept.md), meaning HSX, Iowa, SoundOut and
  HitPredictor, are still from memory. Everything else has now been checked.
- Cost of inscribing full round records rather than just Merkle roots has not been
  estimated at all.

## Verified 2026-07-29

Checked against primary or named sources, and now safe to quote. Full list with
links is in the Sources section of [pitch-web.html](pitch-web.html).

- **Salganik, Dodds & Watts**, Science, 10 Feb 2006. 14,341 participants, 48 songs
  by unknown bands, eight parallel worlds plus an independent control. Primary
  source confirms the design and the quality-measure role of the control condition.
- **Lockdown by 52metro**, 1st of 48 in one world, 40th in another. From Watts' own
  NYT Magazine account, corroborated across secondary sources.
- **Luminate 2025 Year-End**. 106,000 uploads a day, 253m tracks on streaming
  services, 88% under a thousand plays, 120.5m under ten plays.
- **Kalshi and Spotify, June 2026**. Contract on most streamed US song in June,
  ~$3m traded. Earrings by Malcolm Todd rose ~70% in a day on 29 June to number
  one, Spotify removed 500,000+ streams, track fell to fourth, Kalshi had already
  paid out. **Carry the exculpatory clause every time this is used: there is no
  suggestion the artist or his team was involved.**
