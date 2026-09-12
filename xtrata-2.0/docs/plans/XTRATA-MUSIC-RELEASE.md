# Xtrata Music branch release

Date: 2026-09-12. Target: `main-music-updates`; production promotion is separate.

## Delivered

Independent `/music/` page with neutral identity, homepage entry, and Music receipts.
Audio-only inscriptions carry audio MIME types and exact original bytes when selected.
Details/artwork releases embed audio in the existing player; descriptive metadata is
optional and a versioned `xtrata-music` JSON record preserves extended credits.
Original is the default; explicit Opus 96 kbps VBR optimisation remains available.

The editor supports imported tags, optional cover replacement/removal and fit,
lyrics, musician credits, shared batch artist/album/artwork, per-track format/quality,
local draft save/restore/delete, per-track quotes, failed-item retries, and mixed
raw-audio/player batches. Dirty edits and failed/stale estimates block payment.
Active jobs block new submissions and reuse existing progress/recovery/refund flows.

The shared audio processing module validates decodable audio, caches by File identity,
and is loaded before both the legacy acquisition builder and the neutral builder.
No contracts, fee defaults, wallet secrets, or signing/broadcast policy changed.
New generated test media and screenshots remain in `/tmp`, outside Git.

## Verification

- Production build: passes.
- Targeted music, homepage and agent regression suite: 291 tests pass; the
  prior funding adapter adds 15 passing tests (306 total).
- Existing SUNO More browser funding isolation test: passes (simulated only).
- New browser smoke: optional fields; artwork add/remove; dirty and failed quotes;
  draft restore; original bytes/MIME; mobile width; single and batch simulated
  payment payloads; shared batch metadata; mixed output types; no personal wallet
  access or page errors.
- Real browser audio smoke: generated untagged PCM WAV; byte-identical original;
  actual FFmpeg Opus conversion; embedded playback; original package rebuild;
  corrupt audio rejected. No deposits, inscriptions or transfers broadcast.

Commands from `xtrata-2.0`:

```sh
npm run build
npx vitest run src/lib/music/__tests__/music.test.ts src/agent-one/__tests__ src/home/__tests__/homepage-content.test.ts
XTRATA_BROWSER_TESTS=1 npx vitest run scripts/wizard/__tests__/suno-browser.test.ts
node scripts/music-browser-smoke.mjs
node scripts/music-audio-smoke.mjs
```

Both new browser scripts accept a preview origin as their final argument. Browser
smoke intercepts the agent and extraction to simulate payment deterministically;
audio smoke loads deployed code and the real encoder, reads quotes, and never connects
or funds a wallet. Each launches a new Chrome profile with no user extensions.

## Deployed preview verification

Cloudflare check succeeded for implementation commit `2f7afdeca`.
Immutable deployment: `https://df5a152f.xtrata.pages.dev/music/`.
Branch alias: `https://main-music-updates.xtrata.pages.dev/music/`.

Both browser smoke scripts passed against the deployed branch alias. Browser
fetches verified that the page and all four new shared/editor/style assets match
the committed bytes, return HTTP 200 with correct MIME types, and use `no-cache`.
A live read-only quote returned the protocol, network reserve and required funding
fields. Actual payment, signing, broadcast and mainnet inscription were not run.
The neutral no-artwork player was visually inspected at square dimensions and its
embedded audio played successfully. Screenshots remain local in
`/tmp/xtrata-music-qa/`.

A direct Python HTTP request received 403, while the normal fresh-browser route
and same-origin browser fetches succeeded; deployed browser checks are the
verification evidence. This did not require changing site access controls.

The branch includes the prior disposable-wallet funding adapter plus the music
implementation and these release notes. It is ahead of `main` without missing
upstream commits at review preparation time.

## Promotion scope and limits

Git push to `main-music-updates` triggers the configured Cloudflare Pages branch
preview at `https://main-music-updates.xtrata.pages.dev/music/`. Confirm the deployment
check points at the reviewed commit, then run both smoke scripts against that origin.
Do not merge to `main` until the user authorises production promotion.

Albums/manifests, editions, selling, royalties, stems and an existing-inscribed-art
picker remain separate extensions. A batch is explicitly a group of separate track
inscriptions, not an album object. Current art controls support embedded or uploaded
images; generic relationship fields remain advanced.

Drafts are explicit device-local saves, subject to browser storage capacity, and do
not migrate across preview/production origins. Original bytes may retain source-file
tags even if the added player metadata is cleared. Desktop Chrome is the verified
browser; broader browser/codec/large-file qualification remains a release follow-up.
Live signing, funding and mainnet end-to-end inscription have not been exercised;
existing wallet limits and spending authorisation still apply.

Rollback: revert the music release commits and redeploy. Preserve existing funded
job state; do not clear agent storage or wallet recovery material.

## Preparation progress update

Added a visible preparation panel with elapsed time, an indeterminate engine-load
bar, measured conversion percentage when FFmpeg supplies duration/time, and a
completed state after quoting. A collapsible, copyable log records engine loading,
file size, processing, output packaging and quoting. Only parsed timing/phase data
is logged; raw encoder output, filenames, metadata, audio and wallet data are not.
Engine loading reports a heartbeat every ten seconds and fails retryably after
120 seconds; conversion is not cut off by that engine-load timeout.

Validation includes timeout/retry cleanup, honest progress states, the existing
browser workflow smoke and a generated 35.8 MiB WAV conversion (5.9 MiB output).
The user's recording eventually completed; the progress update makes long work
visible rather than claiming the recording was invalid or the encoder was stuck.

## Audio bitrate and artwork size controls

The music route now offers original, 96 kbps Opus VBR, and 48 kbps Opus VBR
for both single-track and per-track batch edits. The shared encoder explicitly
passes the selected bitrate to FFmpeg and caches 48/96 results separately; legacy
callers retain their 96 kbps default. Bitrate changes are lossy and must be auditioned.

The new artwork helper/editor provides opt-in comparison, original preservation,
resizing without upscaling, and actual byte savings before applying. Presets use
longest edges of 512 px (100 KB target), 256 px (30 KB), 128 px (12 KB) or 1024 px
(200 KB), plus keep-original. It chooses smaller WebP/JPEG candidates, retains
transparency, and warns above 1024 px / 250 KB, with a stronger warning above 1 MiB.
Targets are product guidance, not universal artwork standards or guaranteed sizes.
The default recommendation for this player is 512 × 512 and 50–100 KB or less.
Embedded player covers and batch uploads share these controls. Existing artwork
inside an original audio file remains byte-preserved; separate player-art reduction
does not strip it. Browser preparation accepts still PNG/JPEG/WebP up to 20 MiB;
images above 40 megapixels require prior local resizing.

Validation: 13 focused unit/regression checks; real 48-vs-96 kbps encoding and
playback; browser comparison of a 2048 × 1024 cover reduced to 256 × 128; transparency
and no-upscaling checks; batch resize preserving artist credits and per-track 48 kbps
MIME. Workflow tests use simulated payments only. Test media stays outside Git.

WebP transparency/format background: https://developers.google.com/speed/webp

### Full Opus quality range

Added 128 and 160 kbps VBR alongside 48 and 96 for single releases and per-track batch edits. New sessions default to 96 kbps; original audio and saved draft choices remain available. Encoding caches stay separate for each quality. Verified exact encoder bitrate arguments, local browser flows, and real encoding at all four rates.
