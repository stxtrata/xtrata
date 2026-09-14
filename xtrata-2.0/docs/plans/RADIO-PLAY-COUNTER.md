# Radio play counter — rules v1

## Outcome and scope

Website radio and hosted radio embeds share a playback observer. It reports to
`POST /radio/plays` independently of the music path. Private reporting is at
`/radio/stats.html`, using the existing `/debug` sign-in cookie and
`GET /debug/radio?range=24h|today|7d|30d`.

This implementation measures **browser-reported playback**, not verified humans,
artist royalty entitlements or tournament votes. It does not count the laptop
Icecast stream, external MP3 clients, or independently embedded inscription
players. Signed Rising Tide account integration and tournament vote eligibility
remain separate work; no third-party account identity is accepted by this API.

## Reviewed rules

- Start: 2 seconds of active, unmuted progress.
- Qualified play: `max(2, min(30, duration / 2))` seconds. A track shorter than two
  seconds never qualifies under v1.
- Completion: qualified play plus coverage of at least 90% of distinct track
  positions. Repeated sections do not increase distinct coverage.
- Partial: a started but unqualified session that is closed or idle for 30 minutes.
  An active unfinished session is shown as “in progress,” not an abandonment.
- A session qualifies/completes at most once. Completion is not an additional play.
- Replays after ending/native looping create new sessions. Pause/resume and refresh
  in the same tab retain the session when possible. Seeking/restarting within an
  unfinished session does not create a fresh play. Track switches close it.
- Unique browsers: distinct salted browser identifiers per track/source/reporting
  period. Repeats = qualified plays minus unique browsers in that group. Do not
  add per-track or per-source unique counts to claim site-wide unique people.

Time credit uses continuous media progress capped by monotonic wall time. Pauses,
muting, zero player volume, buffering, seeking jumps and gaps over five seconds
are not credited. Background playback counts when progress is observable; strong
background timer throttling can undercount. Rate changes never turn faster audio
into extra wall-clock listening seconds. Browser-tab/OS mute and human attention
cannot be observed reliably.

Merged timeline spans have a 256-span bound; pathological fragmented listening
may undercount completion instead of growing payloads without limit.

## Reliability and abuse boundaries

- A random first-party localStorage browser ID; sessionStorage for refresh recovery
  and a bounded outbox. Embedded storage partitioning and private browsing can
  create separate identities. No wallet, raw IP, referrer or media URL is stored.
- Server hashes IDs using existing `TELEMETRY_SALT`; changing that salt changes
  identity continuity. Opt-out in `/radio/guide.html`; Global Privacy Control also
  disables the observer. Reload existing tabs after changing the preference.
- Heartbeats are cumulative, approximately every ten seconds, plus boundaries.
  An initial zero-progress observation registers the server-side session clock.
- Outbox preserves the start and latest snapshot per session (maximum 20 sessions),
  retries with bounded exponential backoff, and discards persistently failing
  sessions. Requests time out after five seconds. Best-effort page-exit delivery
  may miss the final update; playback never waits for analytics.
- Server rejects cross-origin requests, malformed/oversized payloads, identity
  changes, decreasing progress/coverage and impossible elapsed-time claims.
- SQL updates compare the old sequence and exclude overlapping credited intervals
  from another session with the same browser hash. Idempotent retries never add
  another qualification. Starts limited to 120/browser/hour; progress updates have
  a 750ms minimum spacing. These limits cannot defeat someone rotating browser IDs.
- Client reports can be forged. There is no claim of bot-proof counting. Production
  edge rate limiting is needed for volumetric abuse; same-origin checks are not
  authentication. Keep any tournament score as explicit authenticated votes.

Expired/closed sessions reject further credit. When rejected, the observer opens a
new session for subsequent listening. Offline retries older than the server idle
window are lost rather than backdated as trusted listens.

## Reporting periods and retention

`24h` is rolling; `today` starts at Europe/London civil midnight, including DST.
7/30-day windows are rolling. Qualifications and completions use server receipt
threshold timestamps, not client-clock timestamps. Delayed delivery can shift the
reported date. Daily charts group qualification dates in UTC and say so explicitly.
Starts/partials/listening seconds are attributed to the session's creation time;
these are not second-accurate allocations of listening across midnight. A completion
in a window may correspond to a play qualified before that window.

The session table retains approximately 90 days. New-session ingestion deletes up
to 500 expired rows at a time. In an inactive deployment cleanup does not run;
operators can schedule `DELETE FROM radio_plays WHERE created_at < ...` in D1 for a
strict retention deadline. No permanent all-time aggregate is currently retained.

## Activation (not run against production by this change)

1. Deploy the application and rebuilt `public/xtrata-radio.js` through the normal
   user-driven push/deployment process.
2. Apply `functions/migrations/011_radio_plays.sql` to the intended D1 database.
   For isolated testing use a separate/local DB; preview currently shares the
   production database in this repository's Wrangler configuration.
3. Configure `RADIO_COUNTER_ENABLED=1`, `TELEMETRY_SALT` and a strong existing
   `DEBUG_VIEW_KEY` for that environment. Secrets never go into this document/Git.
4. Open `/debug` and sign in, then `/radio/stats.html`. Verify a short partial,
   30-second play, replay, completion and embed test in a controlled environment.
5. Monitor row volume and API errors. Roll back ingestion by removing the enabled
   flag; playback is unaffected. No historical listening can be reconstructed.

Before activation the endpoint returns unavailable and the client backs off. No
remote migration, environment change, production listening test or push was made.

## Verification

Targeted Vitest coverage exercises classification, distinct coverage, wall-clock
credit, queue coalescing/retries, browser media lifecycle with simulated events,
refresh persistence, mute/pause/seeking/loop/end, disabled tracking, real SQLite
migration and queries, duplicate/concurrent updates, concurrent tabs, session
expiry, reporting boundaries, DST, malformed input, rate limits and private access.
Existing radio track-selection regression tests also run. Real browser playback
and Cloudflare production smoke tests remain activation checks, not claims made
by the simulated tests.

Validation on 14 September 2026: **36 tests passed across four files**. The radio
production bundle built successfully, the changed plain JavaScript passed ESLint,
and a focused strict TypeScript check passed for the new production modules.
The repository-wide TypeScript check remains blocked by existing errors across
unrelated modules/tests (including the existing Vitest `ExpectStatic` typing).
The radio build retains the existing unresolved-at-build-time `/radio-face.jpg`
asset warning. No media assets were changed.

Run from `xtrata-2.0`:

```sh
npx vitest run src/lib/radio/__tests__ functions/radio/__tests__/plays.test.ts src/home/__tests__/radio-play-token.test.ts
npx tsc --noEmit --strict --target ES2022 --module ESNext --moduleResolution Bundler --skipLibCheck --lib ES2022,DOM functions/cloudflare-types.d.ts src/lib/radio/play-counter.ts src/lib/radio/play-rules.ts functions/radio/plays.ts functions/debug/radio.ts
npx eslint src/home/radio.js public/radio/stats.js public/radio/privacy.js
npm run build:radio
```

The database tests use Node's built-in `node:sqlite` (Node 22.13+); on Node 22
this prints an experimental-feature warning. All database tests use an in-memory
database and never connect to the shared production D1 binding.
