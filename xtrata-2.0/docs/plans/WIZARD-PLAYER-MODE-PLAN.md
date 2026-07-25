# Wizard — on-chain player mode for single files, and metadata you can see

Bringing the opus/player tool into the regular Inscription Wizard
(`xtrata-agent-one/wizard/index.html`): request a player for any song, accept
Suno exports there, and surface the artwork / lyrics / tags that get extracted
from any audio file carrying them.

Companion to [SUNO-MORE-RELATIONSHIPS-PLAN.md](./SUNO-MORE-RELATIONSHIPS-PLAN.md).

**Status:** implemented. Steps 1-4 are done; see the testing caveats in §5, which still stand.

---

## 1. Most of this already exists — read first

**The builder is already format-agnostic.** `XtrataSuno.build()`
(`wizard/suno-build.js:138`) is documented as taking "mp3, wav, flac, m4a —
anything ffmpeg.wasm decodes". It pulls title / artist / album / lyrics /
comment through ffmetadata and the cover through `-map 0:v:0`
(`suno-build.js:100-129`), and it already accepts overrides for **every**
field:

```
{ title, artist, album, lyrics, description, license, bpm, note,
  coverB64, coverMime,     // embed this image
  coverTokenId }           // or reference an inscribed image — zero extra bytes
```

It even detects Suno provenance itself — `isSuno` from the comment tag
(`suno-build.js:160`). So "extract art, lyrics and other metadata from any MP3
that has extra data" is **already built**. Nothing in the extraction layer needs
writing.

**The wizard already has player mode — in batch only.** `BATCH.playerMode`, the
`bAudioMode` radios (`index.html:555-559`), `ensureSunoStack()` (`:1009`),
`queueAudioBuilds()` (`:1024`), and `batchActiveFile()` / `batchActiveMime()`
(`:1062-1073`) are all in place and working, including recursive artwork by
token id and auto-pairing a dropped image to a dropped song (`:843-854`).

So this is not a build-the-feature job. It is: extend it to one file, and show
the user what was found.

## 2. The three gaps

### 2.1 A single song gets no player option — and the two pages bounce it

The wizard splits on file count: `fs.length > 1 || BATCH.items.length` →
`enterBatch()`, otherwise `onFile()` (`index.html:805`, `:808`). Player mode
lives entirely on the batch side. **Dropping one song therefore offers no player
at all** — you have to drop two files to reach the opus tool, which nobody will
guess.

Instead, `#sunoHint` (`index.html:485`) points at the SUNO fast-track. But
suno.html only accepts Suno exports: it probes for embedded cover **and** title
**and** artist, and anything missing one is bounced back with *"use the main
wizard to set them yourself"* (`suno.html:298`, `rejectToWizard`). A WAV, or an
MP3 whose art was stripped, is sent from the wizard to SUNO and straight back to
the wizard — which then has no player affordance for it. That round trip is the
concrete bug this fixes.

### 2.2 Extracted metadata is invisible and uneditable

The batch player build passes artwork overrides only (`index.html:1032-1035`).
Title, artist, album and lyrics are read out of the file and baked into the
player without ever being shown. If the tags are wrong — and Suno's `artist` is
frequently not what the user wants on-chain — the only way to find out is to
inscribe it and look.

suno.html already solved this: `#editPanel` / `#moreMetaPanel` and
`collectEdits()` (`suno.html:352-366`) map one-to-one onto the override keys
`build()` accepts. It is a port, not a design.

### 2.3 Nothing reports what was found

A user dropping an MP3 has no idea whether it carries art or lyrics until the
player is built. Both `probe()` (cheap: tags + cover, no encode) and the
`build()` result already return exactly this — `hasCover`, `hasLyrics`,
`isSuno`, `title`, `artist`, `opusBytes` vs `sourceBytes`.

## 3. What to build

### Step 1 — audio mode on the single flow

In `onFile()` (`index.html:1233`), when the file is audio, show the same choice
the batch card shows, with the same wording:

```
🎵 Audio file — how should it go on-chain?
  ( ) Inscribe the audio file as it is        ← default, today's behaviour
  ( ) Build an on-chain player for this song  — Opus-optimised audio +
      title/artist/lyrics + artwork
```

Default must stay **raw**, so the existing railroad is untouched for anyone who
does not opt in.

`FLOW.activeFile()` (`:789`) already abstracts "the bytes that will actually
inscribe" for the optimised-vs-original choice. Add player as a third source,
mirroring `batchActiveFile()` exactly:

```js
FLOW.activeFile = () =>
  (FLOW.playerMode && FLOW.player?.status === 'ready') ? FLOW.player.file
  : (FLOW.optimized && !FLOW.useOriginal) ? FLOW.optimized.file
  : FLOW.original;
```

with a matching `activeMime()` returning `text/html` for a built player. On a
successful build, rewrite the URI `xtrata:audio/` → `xtrata:song/` as the batch
path does (`:1037`), and re-quote — a player is a different size from the source
and the deposit must reflect it.

Raw mode keeps running `XtrataAudioOptimizer`; player mode must not, since
`build()` does its own Opus encode. That is the same rule as
`queueBatchOptimise()` follows on the batch side (`:1058`).

### Step 2 — one metadata panel, used by both flows

Port suno.html's editor as a shared block rather than duplicating it: artwork
thumbnail + replace, title, artist, then a *More metadata* disclosure for album,
BPM, note, licence, description, lyrics. Prefill from the build result; **Apply
changes** rebuilds and re-quotes.

The batch table gets the same panel per audio row, expanded from the existing
Artwork/player cell — the row already has `it.player.info` holding every value
needed to prefill.

Cheap and worth it: run `probe()` on drop (tags + cover, no encode) so the panel
can be filled in before the user commits to a build.

### Step 3 — a "what's in this file" readout

Under the audio-mode choice, once probed:

```
Found in this file: cover art ✓ · title "…" · artist "…" · lyrics ✓ (42 lines)
Made with Suno                                              ← only when isSuno
```

and after the build, the conversion line suno.html already shows
(`suno.html:309`): `MP3 8.9 MiB → Opus 96k VBR 6.4 MiB (−28%) → +⅓ base64`.
Missing pieces should read as neutral facts, not errors — a song with no art
builds a perfectly good player.

### Step 4 — fix the SUNO handoff

With the wizard able to build players, `rejectToWizard()` (`suno.html:219`)
should stop implying the wizard is only for setting tags by hand. New copy:
*"This MP3 has no embedded artwork/title/artist. The main wizard will still
build you a full player — you just choose the artwork yourself."* That closes
the loop described in §2.1.

## 4. One constraint worth designing around

SUNO gets the **multithreaded** ffmpeg core; the wizard cannot. From
`suno-build.js:10-12`:

> The threaded core needs SharedArrayBuffer → cross-origin isolation, which is
> only enabled on /suno (COEP breaks wallet popups elsewhere).

So wizard builds use the single-threaded core, and every ffmpeg command gets a
fresh instance that is discarded afterwards — a workaround for the 0.11 ST core
leaving its `running` flag stuck after any failed command (`suno-build.js:36-44`).
Consequences to design for, not fight:

- Builds are **noticeably slower** than on the SUNO page. Say so up front rather
  than letting a long spinner speak for itself, and keep the per-song sequential
  queue (`queueAudioBuilds()` already serialises).
- Encoding is the slow part, so `probe()` before build is what makes the panel
  feel instant.
- Do not try to enable COEP on the wizard to get the fast core. It breaks the
  wallet popups, and the wallet is the whole point of the page.

## 5. Testing

- Source assertions in the style of
  `src/home/__tests__/drops-sponsored-claim.test.ts`: the single-flow audio-mode
  ids exist, `FLOW.activeFile()` accounts for a built player, the URI rewrite
  and `text/html` mime are wired, and raw mode remains the default.
- ffmpeg.wasm will not run under vitest/jsdom, so every actual build path is
  manual. Cover at minimum: a Suno MP3 (art + tags + lyrics), an MP3 with tags
  but no art, a bare WAV, and a non-audio file (must be byte-identical to
  today's behaviour).
- `?mock=1` exercises the job flow without chain or funds; the build itself runs
  for real either way, since it is all client-side.

## 6. Sequencing against the relationships plan

Independent — different files, no shared state. If both land, the natural order
is this one first: player mode changes what `activeFile()` returns and therefore
the quote, and the relationships work also touches the quote. Doing the size
change first means the parent work only ever sees one definition of "the bytes
that will inscribe".
