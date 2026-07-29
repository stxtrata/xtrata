# 05. Where Xtrata actually fits

The test I want to apply throughout: **what breaks if there is no chain at all?**

If the answer is "nothing", it does not go on chain, regardless of how good it
sounds in a deck. Most of this system passes that test by staying off chain.

---

## The honest answer

Two things genuinely need a chain. Everything else is better off in a database.

### 1. Tamper-evident forecast commitments

A forecast log held by the platform is a claim the platform makes about itself.
"This person predicted 70% when the price was 30%" is exactly the kind of record a
company has every incentive to tidy up, and no external party can check it.

This matters commercially before it matters philosophically. The pilot's whole
output is a claim of the form "our crowd beat our model", made by the people who
built both. A label, an investor or a journalist is right to be sceptical of that.
An anchored commitment log makes it checkable by anyone, forever, without trusting
the platform's database.

Reframed that way, this is a research integrity tool, not a crypto feature. That is
a much stronger reason to build it.

### 2. Portable reputation

A tastemaker record that lives only in one company's database is that company's
asset. Signed, anchored snapshots make it the person's.

Be honest about the timing though. Portability is worth very little on day one,
because there is nowhere to port to. It is a credible long term differentiator and
a weak launch feature, and it should be positioned as the former.

---

## The design: commit, reveal, anchor

This falls straight out of the round structure in
[02-mechanism.md](02-mechanism.md), which is the main reason to prefer rounds over
a continuous book.

```
  During round R
    user submits  c_u = H( q_u ‖ salt_u ‖ user_id ‖ market_id ‖ R )
    platform stores c_u, cannot see q_u until reveal

  Round closes
    build Merkle tree over all c_u in round R  ->  root_R

  Daily
    build Merkle tree over the day's round roots  ->  root_day
    inscribe root_day via Xtrata

  Reveal
    platform publishes every q_u and salt_u
    anyone verifies each forecast hashes into an anchored root
```

What this buys:

- **Nothing can be altered or invented after the fact.** Not by the platform, not
  by a user, not by anyone who later acquires the platform.
- **Anchored timestamps.** Stacks settles to Bitcoin, so "I said this on this day"
  is checkable against the strongest timestamp available.
- **"I called it first" becomes provable**, by anyone, without the platform's
  cooperation and after the platform is gone. This is the original brief's
  "prove that you backed something before it emerged", and this is the only part of
  the system that genuinely cannot be done off chain.
- **Sealed quotes get an enforcement mechanism.** The anti-anchoring property in
  [02-mechanism.md](02-mechanism.md) currently rests on the platform behaving
  itself. Commitments make it structural.

**Anchor daily, not per forecast.** One inscription a day covering every round and
every market. Per-forecast inscription would be slower, vastly more expensive, and
would leak positions in real time, which breaks the sealed-quote property it was
supposed to protect.

### Cost

One 32 byte root per day is a single chunk, so a single transaction.

Using the fee figures recorded for v3-2-3, roughly 0.003 STX protocol fee plus
around 0.011 STX for a single chunk transaction, that is on the order of 0.014 STX
per day. Call it a few pence. Annual cost of anchoring the entire forecast history
is in the tens of pounds.

Verify these against current mainnet before quoting them anywhere. Fees have moved
more than once and the figures above are from notes, not from a live estimate.

---

## The properly Xtrata-native version

The Merkle root above is a fingerprint. Any chain does fingerprints, and using
Xtrata for a 32 byte hash uses roughly none of what Xtrata is for.

The version that actually needs this repo's technology is inscribing the **full
round record**, meaning every forecast, every reveal, every resolution, as
reconstructible on-chain data rather than a hash of data held elsewhere.

At a few hundred forecasts per round that is perhaps tens of kilobytes a day, which
is exactly the shape Xtrata's chunked upload and deterministic reconstruction were
built for. The result is a permanently open research dataset that survives the
company, which is both a genuine public good and a strong credibility position when
the entire product rests on a claim about forecasting accuracy.

This needs a real costed estimate against current chunk pricing before committing
to it. Do not assume it is cheap because the root is cheap.

Sensible sequencing: roots from the pilot onward, full records once there is
something worth preserving.

---

## What does not go on chain

**Audio.** Not because Xtrata cannot hold it, but because a discovery layer does
not need to own the catalogue, and the licensing position in
[README.md](README.md) says do not try. On-chain audio is a real Xtrata capability
and a different product.

**Live market state.** Prices update in seconds. Chains do not. The market runs in
a database and anchors its history.

**Anything containing personal data.** This is a hard line rather than a
preference. Resolution cohorts are identifiable people's listening behaviour, and
immutability is in direct and unresolvable conflict with a right to erasure. An
inscription cannot be deleted when someone asks for their data to be deleted.

Inscribe hashes of that data. Never the data.

**Reputation scores themselves**, beyond periodic signed snapshots. They decay,
they get recomputed as the model improves, and a permanent record of every
intermediate value is noise that someone will eventually mistake for signal.

---

## Track provenance and splits

The original brief lists permanent provenance, creator identity and collaborative
splits as Xtrata fits. Agreed, and worth separating clearly: that is Xtrata's
existing proposition, and it is true whether or not any of the market mechanism
gets built. It is not evidence for the discovery market, it is an adjacent product
that happens to share infrastructure.

The genuine overlap is narrow and worth naming precisely. If a track carries an
on-chain identity from the moment it is submitted, then the forecast commitments
reference a stable identifier that cannot be swapped, re-uploaded or quietly
edited after the market resolves. That closes an attack nobody has mentioned yet,
which is resolving a market against a different recording than the one people
heard.

---

## The consumer never sees any of this

No wallet, no signing, no gas, no token, no mention of Bitcoin anywhere in the
product. The platform holds keys and anchors on users' behalf. Users who care can
export their record and verify it independently, and approximately none of them
will, which is fine, because the value of verifiability comes from it being
available rather than from it being used.

If a listener has to understand what an inscription is, the integration is wrong.

---

## Sequencing

| Phase | On chain |
|---|---|
| Study 0 | Nothing |
| Pilot | Daily Merkle roots. Cheap, and it makes the results checkable |
| Live v1 | Daily roots, plus signed reputation snapshots |
| Later | Full round records, track identity at submission |
| Probably never | Audio, market state, anything personal |

Build the mechanism off chain first. Adopt the commitment hash format from the very
first forecast even before anchoring is switched on, because the format is free to
adopt early and impossible to apply retroactively.
