# Audio pre-optimisation (automated Opus/WebM)

When a job's asset is **audio**, Agent One now transcodes it to **Opus-in-WebM
(`.weba`, `audio/webm; codecs=opus`)** automatically — the moment the deposit is
funded, *before* inscription — so a smaller, Xtrata-formatted file goes on-chain.

This reuses the exact logic of the site's **opus-file-generator** tool, hardcoded
to its **`Music (High Quality)`** profile. No UI, no extra clicks: pull the trigger
(fund the job) and the smaller file is what gets inscribed.

## What it does

- Module: [`svc/opus-convert.mjs`](svc/opus-convert.mjs) — a self-contained,
  fail-safe transcoder. It is a pure capability; it never touches the money/sign path.
- Hook: `optimizeAudioForInscription()` in [`svc/core.mjs`](svc/core.mjs), called at
  the very start of `runJob()` (so it covers **both** the ⚡ fast-track auto-pilot
  and the manual **Run inscription** button) right after funding is confirmed.
- After a successful convert it adopts the smaller file and **re-derives the chunk
  plan** (`bytes`, `chunks`, `single`, `batches`) so the cheaper route is taken. The
  deposit was sized for the original (larger) file, so the surplus is returned as
  **change** on delivery — the deposit/quote flow is never disturbed.

## The preset (matches `audioProfiles.music_high_quality`)

| setting | value | source |
|---|---|---|
| codec | `libopus` | ffmpeg-handler.js |
| bitrate | **96 kbps** VBR | config-state.js → `bitrate: 96` |
| `-vbr` | `1` (on) | config-state.js → `vbr: 'on'` |
| `-compression_level` | `7` | config-state.js → `compressionLevel: 7` |
| `-application` | `audio` | config-state.js → `application: 'audio'` |
| container / format | WebM (`-f webm`) | AUDIO_OUTPUT_CONFIG.weba |
| mime | `audio/webm; codecs=opus` | AUDIO_OUTPUT_CONFIG.weba |
| stream map | `-map 0:a:0 -map_chapters -1 -vn -sn -dn` | ffmpeg-handler.js |
| sample rate / channels | **passed through from source** (tool never forces `-ar`/`-ac`) | ffmpeg-handler.js |

The same Audional/Xtrata identification tags are written so the output is detected
as Xtrata audio downstream: `AOE-Generator`, `X-AudionalTool-Origin`, `comment`,
`xtrata_mime`, `xtrata_media_kind`, and the stream tags `handler_name=Audio` /
`media_type=audio`.

> Reference measurement: a 3.20 MB, 142 s, 48 kHz stereo MP3 → **1.71 MB** `.weba`
> (**−46.7 %**), codec `opus`, container `matroska,webm`, all tags present.

> Note: when this was first scoped (before the opus tool source was available) the
> bitrate was provisionally set to 128k. The tool's actual `Music (High Quality)`
> profile is **96k / compression 7**, which is what ships here. To change it, edit
> the single `OPUS_MUSIC_HQ` constant in `svc/opus-convert.mjs` or set `OPUS_BITRATE`.

## Setup

The transcoder finds ffmpeg in this order: **`FFMPEG_PATH`** → a **system `ffmpeg`**
on `PATH` → the bundled **`ffmpeg-static`** npm package. Install deps once:

```bash
cd /Users/melophonic/Documents/Claude/Projects/AIBTC
npm install            # pulls ffmpeg-static (a platform binary) added to package.json
```

If you already have a system ffmpeg (`brew install ffmpeg`) it is used and the
download is irrelevant.

## Fail-safe behaviour

The feature can never block an inscription. If ffmpeg is missing, the source can't
be decoded, or the result isn't smaller, the job is left **exactly** as it was and
the original file is inscribed. Every outcome is recorded on `job.audioOptimize`
(and surfaced as an "Audio optimised" line on the receipt when it succeeds).

It is **idempotent** (skips if already converted or already `.weba`), so a job that
resumes after a server restart won't double-encode.

## Try it / test

```bash
# unit: synth a tone, encode, verify it shrinks to Opus/WebM
node xtrata-agent-one/svc/opus-convert.mjs --selftest

# one-off convert any file
node xtrata-agent-one/svc/opus-convert.mjs input.mp3 out.weba

# full flow, offline (no chain, no spend) — fund is simulated, conversion is real
cd xtrata-agent-one && XTRATA_MOCK=1 node server/server.mjs
# open http://127.0.0.1:8787/  → pick an audio file → Estimate → Create (fast-track auto-runs)
```

## Env

| var | default | meaning |
|---|---|---|
| `FFMPEG_PATH` | — | explicit ffmpeg binary (checked first) |
| `OPUS_BITRATE` | `96` | override the preset bitrate (kbps) without editing code |

---

# SUNO mode — a full player in one inscription

With **SUNO mode** on, an audio job doesn't inscribe the bare `.weba` — it builds and
inscribes a **single, self-contained HTML player**: the optimised Opus audio, the
song's **cover art**, and its **title / artist** all combined into one file, using the
*exact* player the opus-file-generator renders on its main page. One MP3 in → one
playable inscription out, in the same automated, funds-triggered flow.

## Pipeline (the instant funds land, before inscription)

1. **Optimise** the MP3 → Opus/WebM (the Music HQ preset above).
2. **Extract** the embedded metadata with ffmpeg alone — `title`, `artist`, `album`,
   `comment`, **`lyrics`** via `-f ffmetadata`, and the **cover art** (attached picture) via
   `-f image2pipe` with a magic-byte mime sniff. No ffprobe needed.
3. **Base64** the Opus + the cover.
4. **Build** the player by running the vendored, byte-identical
   [`svc/vendor/HTML_Template.js`](svc/vendor/HTML_Template.js) in a Node `vm` shim
   (`buildXtrataAudioPlayerHtml`, template `xtrata-opus-player-v4`) — embedded mode,
   so audio + art live in the file as `data:` URIs.
5. **Inscribe that HTML** (`text/html`) as the asset; the chunk plan is re-derived
   from the player's size.

Module: [`svc/suno-player.mjs`](svc/suno-player.mjs). Detection: a `made with suno`
comment (or `suno` anywhere in the tags) marks a Suno export, recorded on the receipt.

## One transaction / one token

The player is a **single inscription** — one token, one payment, delivered to the
buyer's wallet in the same fast-track flow (no recursive second inscription). For a
real Suno song the player is actually **smaller than the source MP3** (Opus at 96k
roughly halves the audio, which more than offsets base64's ~33% inflation), so the
deposit — still sized on the original MP3 — stays comfortably over-collected and the
surplus refunds as change.

> Reference: the 3.20 MB `Local Drive Offline - BVST` MP3 → a **2.33 MB** player
> (`text/html`, 143 chunks) embedding 1.71 MB of Opus + a 360×360 JPEG cover, with
> title `Local Drive Offline - BVST` and artist `jimdotbtc` pulled straight from the
> file — plus its 44 lines of lyrics, shown in a toggleable **Lyrics** panel.

## How a user turns it on

In the wizard, pick an audio file — the **🎵 SUNO track** checkbox appears (on by
default). Leave it checked and run the normal flow (fast-track or manual). The
create call sends `suno: true`; `createJob` stores it; `runJob` does the rest.
Uncheck it to inscribe the plain Opus `.weba` instead.

## Fail-safe layering

Never blocks an inscription. If the player can't be built (no cover, decode error,
template issue) it falls back to the **plain Opus**, and if even that fails, to the
**original file**. Each outcome is recorded on `job.sunoPlayer` / `job.audioOptimize`.

## Test

```bash
node xtrata-agent-one/svc/suno-player.mjs --selftest          # offline build + verify
node xtrata-agent-one/svc/suno-player.mjs track.mp3 out.html  # one-off: MP3 → player
```

## Re-syncing the player template

`svc/vendor/HTML_Template.js` started as a byte-identical copy of the opus tool's
template, plus one Agent One enhancement: a **toggleable Lyrics panel** — a Lyrics
tab + scrollable panel that renders only when the source carries lyrics tags
(`lyrics-eng` / `lyrics` / `unsyncedlyrics`), and tab clicks now toggle the drawer
open/closed. If the upstream tool changes, re-copy it and re-apply that lyrics block
(it's marked with an "Xtrata Agent One" comment).
