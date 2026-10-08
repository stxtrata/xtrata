# Music Supporters: homepage banner and hero

The homepage shows how many addresses have paid for a song start through Xtrata Music
("music supporters") and how many on-chain paid plays they have made in total. A slim banner
sits under the site header and a larger hero sits above the Music shelf. Both are filled from
one endpoint so they cannot disagree, and both agree with the counts on `/music/heroes`.

## How the numbers are produced

- The paid-plays contract (`xtrata-radio-plays-v1-0`) has no global counter, so
  `functions/lib/music-stats.ts` copies each `radio-paid-play` receipt into D1 once and counts there.
- The parser is `public/radio/paid-play-event.mjs`. The Music Heroes page uses the same module
  (through `chain-activity.js`), so both count the same events the same way: one play per
  transaction, amount exactly 50 microSTX, a valid core and a valid payer.
- Sync is oldest-first by log position with one contiguous cursor (`music_stats_state.cursor`).
  A failed or shifted wave never advances the cursor past a gap, and re-reading a page is harmless.
- Supporters are `COUNT(DISTINCT payer)`. An address is a wallet, not necessarily a different person.
- `GET /api/music-stats` answers from D1. When the last chain read is more than 20 seconds old (3 seconds while history is still being copied) it
  starts a refresh in the background. An idle refresh is one Hiro request. The very first request
  waits for the first batch so the first visitor sees real numbers.

## Deploy

1. Apply the migration to the production D1 database (binding `DB`, `xtrata-manage`):
   `npx wrangler d1 execute xtrata-manage --remote --file=functions/migrations/022_music_paid_plays.sql`
2. The server reads the chain with the same Hiro keys and base URL as the `/hiro` proxy
   (`HIRO_API_KEY_1…`, `HIRO_API_KEYS`, `HIRO_API_KEY`, in that order, then a keyless attempt),
   rotating to the next key on 401, 403 or 429. Keyless requests from Cloudflare are often refused,
   so make sure at least one key is set for the Pages environment you are deploying.
3. History fills in within a few seconds. Pages of 50 events are read 8 at a time in parallel,
   then one total read confirms nothing arrived meanwhile (otherwise the wave is re-aimed). One
   refresh copies up to 1,600 events in about 37 chain reads, which stays inside the 50 outbound
   requests a Pages Function may make. While history is incomplete the next batch may start after
   3 seconds and the page asks every 4 seconds, so ~4,700 plays are counted in roughly 10-15 seconds.
   Once complete, chain reads are 20 seconds apart. While it is incomplete, `complete` is `false`
   and the page says it is still counting, so partial totals are never presented as final.

## Diagnosing a count that stays at zero

`curl -s https://xtrata.xyz/api/music-stats` includes `syncError`:

- `null`: the last chain read worked. If `plays` is 0 and `complete` is `false`, the first batch is
  still being copied; call again after 20 seconds.
- `403`, `401` or `429`: Hiro refused the request. Check the Hiro key variables above.
- `-1`: the request did not reach Hiro (network error or timeout).
- `-2`: Hiro answered, but not with a contract log page (unexpected body).

Hiro's v2 logs endpoint rejects offsets above 1000 (HTTP 400) and its v1 events endpoint reports no
total, so old history is read through v1 and each wave is followed by a one-event v2 read to
confirm no new play arrived while reading. Both endpoints cap `limit` at 50.

The page treats "nothing counted yet" as warming up, or unavailable when `syncError` is set. It never
shows it as zero.

Until the migration is applied the endpoint answers 503 and the page hides the banner and shows
a dash in the hero. It never shows zero for a failed read.

## Song details in the hero

Each of the three latest plays shows the song's artwork, title and artist when they are known, and
falls back to `Song #id` with a note tile otherwise. The details come from the same catalogue the Songs
page and `/music/heroes` use (`radio_metadata`, with the supplied artist and title corrections), so they
exist only for core 3 songs the catalogue has already read. Other cores, songs not yet read, and
placeholder names such as `Inscription #3088` stay empty rather than being guessed. Artwork is served by
the existing `/radio/artwork?id=` route and the page accepts only that path. The banner is unchanged.

## Page behaviour

- The banner and hero are `home-only` in `index.html`. Remove that class from `#musicBanner` to
  show the banner on every page.
- The page polls every 30 seconds while the tab is visible and remembers the last good totals
  in `localStorage` so a return visit does not start from nothing.
- Stale (server unreachable after a good read) keeps the last totals and says when they were updated.

## Tests

- `functions/api/__tests__/music-stats.test.ts` covers sync, resume, shifting pages, rate limits,
  throttling, and agreement with `aggregateHeroes`.
- `src/home/__tests__/music-supporters.test.ts` covers formatting, every display state, polling and
  cleanup, using the real markup from `index.html`.
