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
- Targeted music, homepage and agent regression suite: 291 tests pass.
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
