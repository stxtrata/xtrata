# 06. Open questions

Things that are unresolved, things I got wrong on the first pass, and things that
need somebody who is not me.

---

## Regulation

**Not legal advice. Get GB counsel before building anything in this section.**

The commonly cited test for gambling has three elements. Consideration, chance,
prize. Remove any one and you are usually outside it. The design in these docs
removes consideration, which is the cleanest of the three to remove and the hardest
to argue with.

For that to hold, credits must be **all four** of the following, with no exceptions
and no premium tier:

- free, allocated on a schedule
- not purchasable, at any price, in any bundle, ever
- not transferable between users
- not redeemable for cash or cash equivalents

The moment any one of these breaks, you are a gambling operator who did not apply
for a licence. There is no partial version of this. A "buy 50 extra credits" button
is the single change that converts the entire product into a regulated activity,
and it will be proposed by somebody as a growth experiment, so the constraint needs
to be written down somewhere with authority.

Note also that the UK Gambling Commission has publicly flagged that prediction
markets can fall within GB gambling regulation, so the sector already has
attention. Free-entry routes attract scrutiny of their own, and the answer differs
by jurisdiction, particularly across US states.

### A reframe that may be much cleaner than "prizes"

The original brief proposes paying strong forecasters from platform revenue. Framed
as winnings, that drags the prize element back in and invites the whole analysis
again.

Framed as **payment for research contributions**, it is a paid panel with
performance-based compensation. That is an ordinary, boring, well established
business, and it is precisely what SoundOut, HitPredictor and similar services
already do. Paying panelists more when their contributions are more useful is
piecework, not gambling.

Commercially these are identical. Legally they are not remotely the same
conversation, and the second one matches the actual revenue model below. Worth
putting to counsel as the preferred structure rather than presenting the market
framing first.

---

## Who pays

| Source | Verdict |
|---|---|
| Artist submission fees | **No.** Pay to play corrupts the signal and inverts the incentive toward volume of submissions rather than quality of selection. It is also the thing that has historically destroyed the credibility of new music screening services |
| Listener subscription | **Unlikely.** You are asking people to pay for the privilege of doing work. Maybe later, for enhanced features, never as the primary |
| A&R and label data licensing | **Yes, and this is probably the first real revenue.** Labels pay meaningfully for early signal and have budget lines for exactly this |
| Artist audience intelligence | **Yes, medium term.** Genuinely useful, small early |
| Streaming economics | Distant, and see the licensing warning in [README.md](README.md) |

The tension to name out loud: the positioning is "not the music industry" and the
first customer is the music industry. That is survivable, but only if it is stated
plainly from the start rather than discovered by users later. The honest version is
that you are selling the industry a better instrument, not joining it, and the
listener-facing promises about portable reputation and blind listening have to
remain true while you do it.

If a label ever gets to influence which tracks enter markets, or gets to see
resolution cohorts, the instrument stops working and the business dies with it.
That boundary should be contractual, not cultural.

---

## The two-sided problem is not symmetric

Artist supply is effectively unlimited and free. Artists are desperate for
attention and will submit as much as you allow.

Listener supply is the entire business.

Two consequences. Build almost no artist-facing tooling early, because the side
that shows up on its own does not need to be courted. And since submissions are
free and infinite, **the selectivity of the funnel is the product**. A discovery
service that surfaces everything has discovered nothing.

---

## Cohort bias, which is unfixed

Whoever turns up defines the chart.

The early adopters of a music prediction game will skew hard on age, gender,
geography and genre, and the resulting ranking will reflect that skew confidently
and with an air of objectivity that it has not earned. Stratified cohorts and
per-scene reputation help with the framing, because a chart that says "top ten
among UK experimental electronic listeners" is at least honest about whose opinion
it is. They do not fix the underlying sample.

There is no clever mechanism that solves this. It is a recruitment problem and it
has to be treated as one, deliberately and expensively, or the product becomes a
very well instrumented monoculture.

---

## Public failure, which the brief does not consider

A market that publicly says "this will not travel" is attached to a real person's
work, with their name on it.

That is a genuine harm and it is worse here than on Polymarket, because the subject
is an individual artist rather than an election or a share price, and because
early-career artists are exactly the population the product depends on.

Design implications, none of which are free:

- Publish positive signals. Keep negative signals private to the artist, or
  aggregate only.
- Never publish a per-track failure record, and never a public ranking of the
  bottom.
- Be careful with the belief curve UX. A curve that visibly collapses is a nasty
  thing to show somebody about their own record.

This also constrains [05-xtrata-fit.md](05-xtrata-fit.md). Anchoring forecast
commitments is for verification, not publication. A permanent, public, immutable
record that 200 people predicted somebody's song would flop is not a feature, and
it cannot be taken back. Anchor the hashes, keep the reveal policy separate and
deliberate.

---

## Things I cannot resolve from here

**Does forecasting skill persist?** Q2 in [04-pilot.md](04-pilot.md). Empirical,
and the pilot is designed around answering it. Everything about the personalised
feed depends on the answer being yes.

**Does the game stay fun once the mechanism is attached?** Study 0 tests whether
blind listening is tolerable. It does not test whether adding scoring makes it
better or worse, and scoring can easily make a pleasant activity feel like
homework.

**Where does a scene end and collusion begin?** Ten thousand people in a Discord
deciding to back a record is undetectable by any in-system signal, and it is
arguably not an attack at all. It might be the single most valuable thing the
platform could observe. That line is a policy question and somebody has to own it.

**How does the baseline model improve without eating the crowd?** The bar rising
over time is correct and intended. But the crowd's data trains the model, so the
model gets better at exactly the things the crowd is good at, and the measured
human contribution shrinks toward zero by construction. That may be fine, since a
model trained on crowd signal is still a product. It may also mean the human layer
is a bootstrap phase rather than a permanent moat. I do not know which, and it is
worth thinking about before it is discovered accidentally in year three.

**What does an artist actually get on day one?** Listening, some audience
intelligence, and a lottery ticket. That is thin. It is probably enough given how
desperate the supply side is, and it is not a position to be comfortable about.
