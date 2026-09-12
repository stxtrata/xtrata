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


## Player styles and appearance studio — 2026-09-12

The Music route now loads its own `xtrata-music-player-v1` module. Classic, Sleeve
and Studio share an embedded player engine with visible play/pause, seek, timing
and status, plus optional details and lyrics dialogs. Existing legacy templates
and previously inscribed files are unchanged.

Creators can choose four palettes, a custom accent, three system font families,
whole-image/fill framing, crop position, square/soft corners, progress/waveform,
no-art presentation, and album/details/lyrics visibility. Presentation controls do
not delete the underlying metadata. The appearance and template version are stored
with the file. Custom colours use contrasting black or white play-button text;
other text retains the palette's fixed foreground/background pairs.

The widened desktop editor places the working preview beside appearance controls;
mobile stacks them. Preview size choices include phone and 280 px viewer. Single
changes rebuild from cached audio and invalidate/requote exact output bytes.
Batch defaults have an explicit apply-to-all action; saved per-track overrides stay
independent. Drafts persist appearance, and raw audio bypasses player generation.
Closing a track editor unloads its temporary player.

Waveform peaks are calculated once during creation and cached against prepared
audio, then embedded as bounded SVG bars. There is no listener-side audio decoding
for waveform generation and no runtime network dependency. A decode failure or
12-second waveform timeout falls back to a plain seek bar. The optional waveform
adds markup; the default progress player omits it. System fonts avoid font payloads.
A small test fixture's default player is guarded to stay below 24 KB excluding
substantial audio/art; final quotes always use actual complete output bytes.

Validation: focused unit/regression tests cover input escaping, appearance
validation, raw-byte preservation, generated-script parsing and legacy-template
compatibility. The player smoke covers Classic/Sleeve/Studio with and without art
at 160/200/280/390/492/760 px, visible errors, real local WAV playback, keyboard seek/pause,
and details/lyrics dialogs. Editor smoke covers styles, palette/type/framing,
draft restoration, per-track batch overrides, artwork optimisation and simulated
payments. Real-audio smoke covers 48/96/128/160 kbps encoding, waveform generation,
playback and corrupt-file rejection. No personal wallets or real payments are used.


## Visual release selection — 2026-09-12

The top-level format dropdown is now three persistent icon-and-text radio cards:
Audio only, Audio + metadata, and Audio + metadata + artwork. All remain in one
row at phone widths, with a checked indicator and keyboard focus. Selection uses
the existing output/requote flow, so changes invalidate the prior quote and reuse
prepared audio. Cards lock during preparation and funded jobs. Audio-only hides
the player/metadata editor; metadata adds the player/details; artwork also exposes
cover and crop controls. The selected card follows restored drafts. Batch format
changes update all tracks, hiding appearance when the entire batch is audio-only.

Validation: production build, focused music tests, targeted script lint, and the
browser smoke (card switching, conditional controls, mobile alignment, single and
batch transitions, and existing draft/quote/payment simulations).


## Economy and speed-up — 2026-09-12

Added optional Economy funding and a mobile-friendly Speed up review with explicit additional payment, total approval and service fee. A separate durable policy record preserves pending transaction identity and fee limits across reloads; top-ups activate only after matching canonical confirmation. Standard remains the default. See [Music Economy and speed-up](MUSIC-ECONOMY-SPEED-UP.md) for design, recovery boundaries and validation. Agent build `2026-09-12.1`; 297 focused tests, build and targeted lint pass. No real payments or inscriptions were used for verification.
