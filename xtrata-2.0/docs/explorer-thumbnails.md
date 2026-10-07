# Explorer thumbnails

Songs and other HTML inscriptions are 3 to 6 MB each and run their own scripts, so the Explorer
grid does not load them. Each tile shows a small stored picture (or a text poster) and the real
inscription loads only when a tile is selected, with one click.

## How it fits together

- **Picture:** a 256 px WebP in the `THUMBNAILS` R2 bucket (`xtrata-thumbnails`) at
  `thumbs/<contract>/<tokenId>.webp`.
- **Index:** D1 table `inscription_thumbnails` (migration `021`). `status` is `ready` (a picture exists),
  `none` (inspected, no cover; the title and artist are still kept) or `failed` (retried on the next run).
- **Serving:** `GET /thumb/<contract>/<tokenId>?v=<version>` (`functions/thumb/`). The version is the
  picture's hash, so a URL with `?v=` never changes and is cached for a year.
- **Telling the grid:** `/index/page` adds `thumb` (the version, or null), `title` and `artist` to each token
  (`functions/index/page.ts`). The client keeps them as `thumbVersion`, `thumbTitle` and `thumbArtist`.
- **Drawing it:** `renderGridPoster` in `src/home/main.js`. A tile is an `<img>` plus a caption. It has no
  iframe, no script and no click handler of its own, so a click reaches the card and selects the token.
  Titles and artists come from untrusted files and are only ever set with `textContent`.
- **Not covered:** relationship (parent/child) thumbnails keep their own click-to-run path.

If the bucket binding, the table or a picture is missing, nothing breaks: the tile shows a text poster.

## One-time setup

```
npx wrangler r2 bucket create xtrata-thumbnails
npx wrangler d1 execute xtrata-manage --remote --file functions/migrations/021_inscription_thumbnails.sql
```

Create the bucket **before** deploying: `wrangler.toml` binds it, and a deploy that binds a bucket that
does not exist fails.

## Filling it

```
npx wrangler whoami                    # must be logged in
npm i --no-save sharp                  # only if `node -e "require('sharp')"` fails
node scripts/backfill-thumbnails.mjs --dry-run --limit 5     # look, change nothing
node scripts/backfill-thumbnails.mjs --limit 20              # first real batch
node scripts/backfill-thumbnails.mjs                         # everything outstanding
```

Safe to re-run: finished songs are skipped, failed ones are retried, and a failure never overwrites a stored
picture. `--token 3058 --force` redoes one song. At present it covers the radio catalogue
(`radio_metadata`, contract `xtrata-v3-2-3`); other HTML needs Phase 3.

## Checking it

- Network tab on a fresh browser profile, page 1 of the Explorer: no `/runtime/content` request until a tile
  is clicked; `/thumb/...` requests are a few KB each.
- Console: `copy(xtrataPerfReport())` after a click shows the click-to-preview timing.
- A tile's `data-thumbnail-state` is `server-thumb` (picture) or `poster` (text).
- D1: `SELECT status, COUNT(*) FROM inscription_thumbnails GROUP BY status;`

## Rolling back

Remove the `THUMBNAILS` binding or drop the table and the grid shows text posters. Nothing else depends on
them. The click change (no live iframes in the main grid) is in `renderGridLiveMedia` and the card builder.

## Later phases

- **Phase 2:** generate thumbnails automatically for new songs and move the base64 covers out of D1.
- **Phase 3:** thumbnails for HTML with no cover (declared preview image, then a Browser Rendering screenshot).
- **Phase 4:** performance telemetry and the daily report.
