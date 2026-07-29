# 01. Concept

## The product in one sentence

A place where you hear new music before you hear anything about it, say how far
you think it will travel, and build a public record of being right.

## The listener loop

The whole thing has to work as a game before it works as a market.

1. A track plays. No artist name, no artwork, no numbers, no market price.
2. You listen. The system knows whether you actually listened, and how far.
3. You are asked one question. Not five. One.
4. You answer, and only then does the screen open up. Artist, current collective
   belief, who else backed it, where you sit relative to them.
5. Later, when the track resolves, you find out whether you were early, late, or wrong.

Step 4 is the reward. The reveal is the dopamine. Getting a genuinely good track
that nobody has heard yet, and finding out you were the eleventh person on the
platform to back it, is the feeling the product sells. The prediction mechanism
exists to make that feeling earned rather than decorative.

Step 3 being a single question matters more than it sounds. Multi-market
interfaces are a trading terminal, and a trading terminal is a different product
with a different, much smaller audience.

## The question to ask

The original note proposes several markets per track, phrased as absolute
thresholds. Retention above 20%, saves above 35%, a thousand listeners in a month.
Those read well but they are fragile, for two reasons covered in
[04-pilot.md](04-pilot.md). Briefly, the threshold has to be recalibrated for every
genre and every traffic level, and at realistic cohort sizes the noise in
measuring a rate swamps the difference between a good track and a mediocre one.

The robust version is relative:

> Of these two tracks, which will more of the people who have not heard either
> come back to?

Common noise cancels. Genre calibration is automatic if both tracks are drawn from
the same stratum. Platform-wide effects like a traffic spike or a quiet Sunday
affect both sides equally. And the output of many pairwise comparisons is a
ranking, which is the thing you actually wanted.

The absolute framing can still be the surface language. "This will break" is a
better button than "I favour track A in this pairing". Derive the copy from the
ranking, do the scoring on the comparison.

## Outcomes worth resolving on

Ordered by how hard they are to fake and how much they are worth.

| Outcome | Resistance to gaming | Signal value |
|---|---|---|
| 7 day return rate among fresh listeners | High | High. Returning is costly to fake at scale |
| Completion rate on first listen | High | Medium. Cheap to measure, correlates with quality |
| Save or add-to-collection rate | Medium | High. Intent is explicit |
| 90 day repeat rate | Highest | Highest, and far too slow for a feedback loop |
| Raw play count | Very low | Near zero. This is the metric that gets botted |

Start with 7 day return rate among a fresh cohort as the primary. Completion rate
is the fast secondary that keeps the loop tight enough to be fun. Ninety day
retention is the prestige market that resolves quarterly and carries most of the
reputation weight, because it is the one nobody can rush.

Never resolve on anything a bot farm can produce, which means never on play count.

## Markets are scarce

The instinct is a market per track. That does not survive contact with scale.
At a million tracks and a hundred thousand listeners, the average track gets a
fraction of a forecast and every price is noise. Forecasting attention is the
constrained resource, not credits, and it has to be concentrated.

So tracks earn their way into a market:

```
  all submissions
       |
       |  random blind exposure, no market, no scoring
       v
  first-pass panel        <- cheap, high volume, every track gets this
       |
       |  top slice by early completion + save, plus a random
       |  wildcard slice so the funnel cannot be gamed by
       |  optimising for the panel
       v
  nominated              <- curators spend credits to nominate
       |
       v
  open market            <- scarce. hundreds per week, not millions
```

Most tracks never get a market and that is correct. A market is a claim on other
people's listening time, and that claim should cost something. The wildcard slice
matters: without it, the funnel becomes a target, and the first thing anyone
optimises is a strong opening eight seconds.

## What this is not

**Not a music casino.** No cash in. See [06-open-questions.md](06-open-questions.md)
for why that line is load bearing rather than merely tasteful.

**Not a token launchpad for songs.** Sound.xyz and its neighbours already tried
song-as-asset. The failure mode is that the asset becomes the product and the
music becomes the pretext, and the buyers are speculators rather than listeners.
Conviction here is a claim about other people's future behaviour, not a claim on
an artist's revenue.

**Not a replacement for streaming.** See the verdict in [README.md](README.md).

**Not blockchain-forward.** The consumer never sees a wallet, a chain or a token.
See [05-xtrata-fit.md](05-xtrata-fit.md) for the small, honest slice that genuinely
benefits from being on chain.

## Precedents worth studying

Independently verify these before citing them anywhere external. They are from
memory and the details matter.

- **Hollywood Stock Exchange.** Play-money market on box office and awards, ran for
  around two decades, and was reported to be competitive with professional
  forecasts. This is the strongest existing evidence that the no-real-money version
  produces real signal, and the closest structural analogue to what is proposed here.
- **Iowa Electronic Markets.** Small-stakes academic markets that repeatedly beat
  polling. Evidence that scale of money is not what makes a market informative.
- **Paid listener panels.** SoundOut, HitPredictor and similar services already sell
  new-music testing to labels using flat paid panels. These are the real incumbents,
  not Spotify. The competitive claim to test is narrow and falsifiable: a
  reputation-weighted market extracts more signal per listener-hour than a flat
  paid panel does.
- **Audius tastemaker rewards** and **Sound.xyz** price discovery, as noted in the
  original brief. Fragments validated, neither is the whole system.
- **Salganik, Dodds and Watts, 2006.** The music lab study. Covered in
  [03-integrity.md](03-integrity.md), because its finding is a direct constraint on
  this design rather than a general caution.
