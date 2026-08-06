# Dataing × Xtrata — integration demo and notes

Dataing (dataing.io) is an anti-swipe dating app built around an AI assistant.
Taste is central to how it describes people; its own copy talks about "a song for
every season" and someone who "lights up around live music".

This is the smallest real thing that connects the two products: read a listener's
music and personality signals from Dataing, and turn them into an ordered station
of Xtrata song inscriptions that `xtrata-radio` can play.

Run it:

```
node scripts/dataing-station.mjs --fixture         # no token needed
DATAING_PROFILE_TOKEN=dtok_… node scripts/dataing-station.mjs
node scripts/dataing-station.mjs --fixture --json  # station only
```

## The token never reaches a browser, and that is the architecture

Dataing's developer guidance is explicit: keep the profile token "out of browser
bundles, repos, logs, analytics, and shared screenshots". A `dtok_` is a bearer
credential for somebody's **dating profile**.

So the split is:

| | sees the `dtok_` | sees the station |
|---|---|---|
| `scripts/dataing-station.mjs` (node) | yes | yes |
| the browser / `initXtrataRadio` | **never** | yes |

What crosses the boundary is a list of token ids — public, on-chain, and boring.
This is not a demo shortcut; any real integration has to keep this shape.

The script reads the token from `DATAING_PROFILE_TOKEN` and refuses to run
without it. It is never logged, never put in a query string, and never written to
disk. `scripts/fixtures/dataing-me.sample.json` is invented data so the pipeline
can be exercised with no token at all — never replace it with a real response.

## What the API does and does not allow

**Read-only.** No mutations. Confirmed against `api.dataing.io/openapi.json`.

The arrow points one way: Dataing can inform Xtrata, Xtrata cannot enrich a
Dataing profile. Anything that puts an Xtrata object *inside* their app needs
them to build surface area first. Worth knowing before promising anything.

Where the signals actually live, which is not where you would guess:

- `linkedSignals` — the music. An `APPLE_MUSIC` provider carrying playlist and
  artist detail. This is the taste data.
- `topTraits` — **personality**, not taste (`weekend_getaway_ready`,
  `night_owl`). Useful as mood inference, weaker evidence than a named genre.
- `latestBio` — free text, weakest signal, still worth reading.

The scorer weights genre highest, then artist and track names, then personality,
then bio.

## Matching is explainable on purpose

Every point in a song's score comes from a word appearing in both the listener's
signals and the song's token URI, and the reasons are printed. A black-box score
would be worse here: Dataing's whole pitch is "a reason to look closer, never a
verdict", so a station that cannot say *why* is off-message for them.

Sample run against the fixture:

```
► #1097  local-drive-offline-bvst          15.5  matched: local, drive, offline, bvst
► #1099  drop-vst-load-bvst-nu-disco-mix   10.5  matched: bvst, disco, mix
► #1107  vst-late-night                     7.8  matched: late, night
```

Unmatched songs still play, ranked last, so the station is never empty.

## The finding worth acting on

**5 of the 11 songs carry no descriptive token URI.** They use the default
Arweave metadata document, so they contain nothing to match against and can never
be selected by any taste signal, however good it is.

Matching quality here is capped by **inscription metadata, not by Dataing's
data**. Before this becomes a product, songs want genre, mood and artist recorded
at inscribe time. That is a change on the Xtrata side and it is cheap to make.

## Open questions for the collaboration

**Their developer programme has no stated revenue model.** Nothing describes
monetisation or incentives. That is the gap the radio-sponsorship idea fills, and
it is a stronger opening than asking for distribution.

**Radio royalties — the hard parts are not the payment.** The payment rail exists
(sponsored relay, accrue-then-claim as the market contracts already do; per-play
on-chain payments would be ruinous). The hard parts are:

- *Attribution.* An advertiser pays against plays reported by a browser client
  that cannot be trusted. `radio.js` already POSTs a per-track verdict, but that
  was built for playability diagnostics, not money. The moment plays pay, it
  becomes an attack surface and must be designed as one.
- *Rights.* "Royalties to inscription owners" assumes inscription ownership
  equals music rights. It does not. Fine when the inscriber is the rights-holder,
  a real problem the first time somebody inscribes a track they do not control.

**Wallets.** Their users have none and will not install one. The passkey wallet
(`docs/PASSKEY-WALLET.md`) is what makes minting plausible — Face ID, no app, and
the sponsor relay covers fees. Not shippable yet: Android and desktop Safari are
unsampled and the sandboxed wallet origin is not built. Do not demo it as done.

**Permanence is our feature and their liability.** An inscription cannot be
deleted. Anything encoding *who matched with whom* is a permanent public record
of a private relationship that survives the breakup. Answerable — mint the song,
never the pairing, and keep relational meaning off-chain — but it should be
raised by us in the first conversation rather than by them in the third.
