# Radio statistics: public catalogue and private detail

## Where to look after deployment

- Public catalogue: `https://xtrata.xyz/radio/catalogue.html`. Default sort is
  inscription ID. Search titles, artists, creator addresses or IDs, sort by any
  displayed column, or enable More columns. Select a title for its detailed stats
  and a Listen link. `?id=123` links directly to that entry.
- Private dashboard: sign in at `https://xtrata.xyz/debug` using the existing
  `DEBUG_VIEW_KEY`, then follow **Private radio statistics and session log** or
  open `https://xtrata.xyz/radio/stats.html` in that same browser.
- The private page shell is public; its data APIs require the secure debug cookie.
  Never put the dashboard key in a URL or share it. Sign-in lasts eight hours.
- Private top table: starts, closed/idle partials, active unfinished sessions,
  qualified plays, unique browsers, repeat plays, completions and listening time
  by song, player source and rule version. Select 24h, London today, 7d or 30d.
- Private session log: newest 50 attempts with Older/Newest controls, including
  attempts below two seconds. Shows song/contract, radio vs embed, start/update
  timestamps, measured seconds vs duration, outcome and rule version. It does
  not expose browser hashes, session identifiers or raw timeline spans.
- The main radio links to the current song's statistics and displays its total
  qualified plays when available. Hosted embeds have a Song stats link. Counts
  are fetched on state changes at most once per minute, not every playback tick.

## Permanent summaries and measurement meaning

Migration 012 backfills anonymous daily totals from the remaining session data,
then SQL triggers update those totals atomically with successful ingestion.
Repeated updates contribute only their delta; deleting old sessions does not
remove totals. No browser or session identity is retained in these summaries.

Public periods use a **session-start cohort**: starts, plays, completions and
listening time all belong to sessions started in the chosen period. This keeps
completion percentages on the same denominator, including sessions crossing
midnight. An active group can change as listeners finish. The private original
report continues using qualification/completion event timestamps; its counts can
therefore differ at window boundaries. Its daily chart is labelled UTC.

All-time unique browsers and repeat counts display “—”, because those cannot be
recovered accurately from anonymous daily totals after raw sessions expire.
Daily unique counts must not be added together. All-time partials are derived
from starts minus qualified and still-active attempts. Duration is a reported
player duration from retained sessions, not independently verified metadata.

The catalogue uses the existing sealed audio/HTML index, excluding reported duds.
HTML entries are explicitly labelled player candidates: the index cannot prove
that every HTML inscription contains music. Zero-play entries are included.
Title/artist come only from inline JSON token metadata where indexed; otherwise
an inscription ID and creator address identify the entry. No arbitrary metadata
URLs or full media files are fetched to populate this page. The existing radio
index sync controls discovery freshness. Forged tokens absent from the index do
not appear in public results, although browser-reported counts are not bot-proof.

Public responses contain aggregated counts, never session records or identifiers.
Figures are informational, not authenticated votes, royalties or verified human
listeners. The separate Icecast livestream is outside this observer's scope.

## Activation and rollout

1. Deploy this code through the normal user-driven Git push/deployment process.
2. Apply migrations 011 (if needed) and **012_radio_summaries.sql** to the intended
   D1 database through migration tooling exactly once, in order. Test on isolated
   D1 first: this repository's preview may share production resources.
3. Retain `RADIO_COUNTER_ENABLED=1`, `TELEMETRY_SALT` and a strong `DEBUG_VIEW_KEY`
   from the original counter setup. No additional secret is required. Do not
   enable collection cleanup as part of this radio change.
4. Open the public catalogue and private dashboard. Test a partial, qualified
   listen and completed track, then compare the appropriate reporting cohorts.
5. Confirm the existing inscription index is populated. Missing summary migration
   returns unavailable, rather than misleading zero counts.

The measured-since date is the earliest retained session at migration time, or
migration time for a fresh database. Counts before activation, or sessions already
purged before summary migration, cannot be reconstructed. Anonymous summaries
remain indefinitely; detailed sessions retain the original approximately 90-day
bounded-cleanup policy. Update any stricter retention process accordingly.

No remote migration, secrets change, deployment or push is performed by this work.

## Validation (14 September 2026)

50 targeted tests pass across seven files: existing counter lifecycle/ingestion,
real SQLite backfill and trigger deltas, retention survival, zero-play catalogue,
cohort completion rate, unique-browser deduplication, dud filtering, private
pagination/authentication, dashboard routes and simulated DOM sort/search/detail
controls. The UI test also checks metadata is rendered as text rather than HTML.
Strict TypeScript checks for new production modules, changed JavaScript ESLint
and the rebuilt radio bundle pass. The existing `/radio-face.jpg` build warning
remains. No live infrastructure or real-browser listening was used for these tests.

Run from `xtrata-2.0`:

```sh
npx vitest run functions/radio/__tests__ src/lib/radio/__tests__ src/home/__tests__/radio-play-token.test.ts functions/debug/__tests__/routes.test.ts
npx eslint src/home/radio.js public/radio/catalogue.js public/radio/sessions.js public/radio/embed.js
npx tsc --noEmit --strict --target ES2022 --module ESNext --moduleResolution Bundler --skipLibCheck --lib ES2022,DOM functions/cloudflare-types.d.ts functions/lib/radio-report.ts functions/radio/counts.ts functions/debug/radio-sessions.ts
npm run build:radio
```
