# 03. Integrity

A market whose forecast controls the thing it forecasts is not a forecast. It is a
budget for making something happen. This document is about breaking that loop.

The framing to keep hold of: **the platform is a continuous randomised experiment.**
Exposure is the treatment, return behaviour is the outcome, and the exploration
slots are the control arm. Once you see it that way the defences stop being a list
of patches and become a single design constraint.

---

## The two invariants

Everything else here is secondary. These two are structural, cheap, permanent, and
should be enforced in the data model rather than in policy.

### I1. Disjoint populations

> Nobody may contribute to resolving a market they forecast on.

Per track, the forecaster set and the resolver set are disjoint. Enforced at
assignment, not checked afterwards.

This is the direct answer to the failure the FT reported in July 2026, where
traders held positions on a chart outcome that their own activity could plausibly
move. The activity and the measurement were the same population. Separate them and
the attack has nowhere to stand.

### I2. Randomised exposure

> Resolution counts only behaviour following a randomly assigned first exposure.

Not exposure caused by ranking. Not exposure from a shared link. Not exposure from
a playlist the track earned its way onto.

Without I2 the loop reappears through the back door, like this:

```
  market price -> ranking -> more exposure -> more listens -> higher measured rate
       ^                                                             |
       |_____________________________________________________________|
```

With I2, the arrow from ranking into the measured outcome is cut, because the
measured outcome only ever comes from exposures the platform assigned at random.
If a resolution cohort member encounters the track elsewhere before their assigned
exposure, their data point is discarded, not corrected.

**The exploration quota and the measurement instrument are the same thing.** The
random blind slots that give unknown tracks a fair trial are also the only source
of unbiased outcome data. This is convenient. It means the cost of fairness and the
cost of measurement is one cost, paid once, and it means anyone who argues for
cutting exploration to improve short-term engagement is also arguing for blinding
the company.

---

## Why this makes attacks expensive

The argument is quantitative and it is the strongest thing in the design.

An attacker wants a track to resolve high. They must do two things. Forecasting
high is easy, they just make accounts. Causing the *measured* outcome to be high is
the hard part, because I1 means their forecasting accounts are excluded, and I2
means the resolution cohort is a random sample drawn after forecasts close and
never announced.

Suppose the resolution cohort is 200 listeners drawn at random from a base of
100,000, and the attacker controls a fraction `f` of accounts. They expect `f` of
the cohort. To move a measured return rate by roughly `δ` percentage points they
need about `f ≥ δ`.

| Attacker controls | Expected shift in measured rate |
|---|---|
| 1% of the user base | ~1 point. Noise |
| 5% | ~5 points. Detectable, expensive |
| 10% | ~10 points. You have a different problem |

Moving a market meaningfully means owning a tenth of the platform. Compare this to
any system where the attacker can identify or influence who counts, where the cost
falls to approximately nothing.

**Unpredictability of the resolution cohort is therefore the load bearing
property.** Everything that erodes it, publishing cohort membership, letting people
opt in to resolving, letting artists see who heard their track in real time, is a
direct attack on the security model regardless of how reasonable the feature
request sounds.

---

## Threats, ranked by how much they actually worry me

### 1. Artist networks, which are not even malicious

The biggest contaminant is an artist sharing their own link and their own fans
turning up. No bad intent, and it destroys the metric anyway, because return rate
among people who already like the artist is not the quantity anyone wanted to
measure.

Exclude from resolution cohorts anyone who follows the artist, is followed by them,
has prior listening history with them, arrived via a referral or share link, or
shares a collaborator graph edge within some distance. Exclude the artist and their
close graph from forecasting on their own tracks entirely, at market creation.

This one is common, unglamorous, and will do more damage than any deliberate
attack. Build for it first.

### 2. Herding and information cascades

Salganik, Dodds and Watts, 2006, with 14,341 participants, found that showing
people what others had chosen increased both inequality and unpredictability.
Early noise became self-fulfilling. The most important detail is the middle: the
very best songs rarely did badly and the very worst rarely did well, but everything
in between was essentially arbitrary. That middle band is exactly where a discovery
product operates.

Handled structurally by sealed quotes in [02-mechanism.md](02-mechanism.md).
Residual risk remains through side channels, which means no visible "trending"
surface for tracks with live markets, no leaderboard of who backed what until
resolution, and no social feed showing positions in real time.

Accept the product cost of this. A live conviction ticker would be a great screen
and it would quietly destroy the signal it displays.

### 3. Sybil accounts

Cheap to create, and the defence is not to try to prevent creation.

Resolution weight requires established organic history, which means an account
needs weeks of ordinary listening before it counts toward any outcome. This makes
sybils expensive in time rather than in money, which is the right currency, because
attackers can buy compute far more easily than they can buy patience at scale.

Forecasting weight is separately gated by resolved-market reputation with shrinkage,
so a fresh account moves the price by almost nothing no matter how many of them
there are.

### 4. Collusion rings

A ring of real accounts that coordinate. Harder than sybils because the accounts
are genuine.

Structural defence first. The ring cannot verify the link between its forecasting
half and its resolving half, because it cannot see the cohort. Beyond that,
detection through correlation, which means unusually high co-occurrence in
forecasts, shared timing signatures, shared devices or networks, and improbably
similar position sequences.

Correlation-aware weight caps matter here more than bans. If a cluster of accounts
behaves as one, weight them as one. This degrades gracefully, where banning does
not, because the false positive on a ban is a furious real user and the false
positive on a weight cap is a slightly quieter one.

### 5. Influence concentration

Success creates this one. If the mechanism works, a small number of people become
highly weighted in each scene, and at that point attacking or buying those few
people is cheaper than attacking the crowd. A tastemaker with real influence will
eventually be offered money by a label, and some will take it.

Caps on individual and cluster weight, decay on old reputation, and a permanent
floor of exploration that no amount of reputation can suppress. Also worth
accepting that some of this is unfixable and should be handled with disclosure
rather than pretending it does not happen.

### 6. Optimising for the funnel

Once the first-pass panel is known to gate access to markets, people will optimise
for it, and the first thing anyone optimises is a strong opening eight seconds.

The wildcard slice in [01-concept.md](01-concept.md) exists for this. A fraction of
tracks promoted at random regardless of panel performance, which both keeps the
funnel honest and produces the counterfactual data needed to tell whether the panel
is selecting well at all.

---

## Detection is the weaker half

Worth being clear about the relative value here.

Structural defences are cheap, permanent, and do not degrade. Detection is
expensive, adversarial, degrades continuously, and generates false positives
against real users who then leave. Every hour spent on I1 and I2 is worth several
spent on anomaly detection.

Detection is still necessary, but it should be the second line, and it should be
tuned to *reweight* rather than to punish wherever possible.

---

## What this design does not defend against

Stated so that nobody is surprised later.

- **Genuine taste being wrong.** The crowd can be sincerely, unanimously mistaken.
  Markets aggregate belief, and belief is not truth. The baseline comparison in
  [04-pilot.md](04-pilot.md) is the only real check on this.
- **Systematic demographic bias.** If the listener base skews, the ranking skews,
  and it will skew confidently and with an air of objectivity. Stratified cohorts
  help. They do not solve it.
- **Slow manipulation.** Building genuine reputation over a year and then spending
  it once is indistinguishable from being right for a year and then being wrong.
  Reputation decay limits the payload, it does not prevent the attack.
- **Off-platform coordination.** A Discord of ten thousand people deciding to back
  a track is not detectable by any signal inside the system, and is arguably not
  even an attack. It is a scene. Deciding where that line sits is a policy question
  and not a technical one.
