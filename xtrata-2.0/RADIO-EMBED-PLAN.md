# Xtrata FM: embeddable radio, and the read-batch bug found on the way

Status: design agreed, nothing built yet. One production bug found and not yet
fixed (see part 1, which is independent of the embed work and more urgent).

---

## Part 1: the read-batch ceiling (production bug, unfixed)

### What happens

`getChunkBatch` reads of 30 chunks exceed the Clarity read-only cost limit. The
node rejects the whole batch:

```
RuntimeCheck(CostBalanceExceeded(
  ExecutionCost { read_length: 513703, read_count: 33, runtime: 327846388 },
  ExecutionCost { read_length: 500000, read_count: 1500, runtime: 1000000000 }))
```

Chunks are 16,384 bytes (`CHUNK_SIZE`), so 30 of them plus overhead lands at
~513KB against a 500KB `read_length` ceiling. Every batch fails. The reader then
either falls back to reading chunks one at a time, or on larger tokens gives up
entirely with `missing-chunk`.

### Measured, mainnet, public Hiro, strict verification on

| Token | Size | batchSize 30 (current default) | batchSize 24 |
|---|---|---|---|
| 1107 | 697KB | 19.1s | **1.9s** |
| 1105 | 3.3MB | 37.1s | **14.5s** |
| 1101 | 3.8MB | **fails after 36s** (`missing-chunk`) | **3.4s** |
| 785 | 3.5MB | **fails after 36s** (`missing-chunk`) | **4.2s** |

Every run verified `ok: true` against the on-chain final-hash at batchSize 24.

### Where the 30 comes from

- `packages/xtrata-reconstruction/src/index.ts:362` clamps `batchSize` to 30.
- `functions/runtime/lib.ts:29-30` sets `RUNTIME_MAX_READ_BATCH_SIZE = 30` and
  uses it as `DEFAULT_RUNTIME_READ_BATCH_SIZE`.

So the live site runs this default on every cold reconstruction. It is
overridable per-environment via `RUNTIME_CONTENT_READ_BATCH_SIZE`, but the
default is above the ceiling, which means roughly 24x more Hiro calls than
necessary and outright failure on large audio inscriptions.

### Suggested fix

Drop both the clamp ceiling and the default to 24. Worth deriving the number
from the cost limit rather than hardcoding it, since a future chunk-size change
would silently reintroduce this.

### Unproven hypothesis, worth checking after the fix

A lot of machinery in `src/home/radio.js` exists to work around reconstructions
that fail for no visible reason: the persisted dud cache (`DUDS_KEY`), the
D1-backed verdict reporting (`/index/verdict`), the transient-failure cooldown,
and the `/warm` pings. Some of that may be compensating for this bug rather than
for genuinely bad inscriptions. If so, the dud store will need clearing after
the fix, because it has cached "not playable" verdicts for tokens that were only
ever failing on batch size.

---

## Part 2: the embed

### Goal

People embed the radio on their own sites, and the data comes off the chain into
their listener's browser. No Xtrata bandwidth for audio, no Xtrata API key, no
per-listener cost.

### It is mostly already built

`packages/xtrata-reconstruction` reads chunks, rebuilds bytes, and verifies the
incremental hash chain. Only dependency is `@noble/hashes`, pure ESM, no Node
APIs, so it runs in a browser unchanged. Paired with `createXtrataReadClient`
from `@xtrata/sdk/simple`, which accepts `apiBaseUrl`, it can pull a whole song
from a Stacks node with xtrata.io never touched.

Proven end to end during this session against `https://api.mainnet.hiro.so`.

### The seam in radio.js

`resolveTrack` (`src/home/radio.js:405`) returns `{ src, title, artist, cover,
tokenId }` and everything downstream just hands `src` to an `Audio` element.
`src` is already sometimes a URL and sometimes a `data:` URI, so a chain-backed
resolver returning a `blob:` URL drops straight in and the rest of the engine
works untouched.

Most of the existing resolver's complexity is discovery over unknown token ids.
The embed has a fixed playlist, so the cores ladder, dud caching, verdict
reporting and warm pings all fall away.

### Decisions taken

**API endpoint.** Default `https://api.mainnet.hiro.so`, no key. Rate limits are
per-IP so they land on the listener, never on us. `data-api` lets an embedder
point at their own node or keyed endpoint.

Critical: the embed must never use the `/hiro/<network>` proxy path that
`packages/xtrata-sdk/src/network.ts:64` defaults to. On our own site that is our
Cloudflare function burning our `HIRO_API_KEY`. Using it from an embed would
move the bill rather than remove it.

**Controls.** Play/pause and volume only. No skip, no seek. Fixed playlist in
order, one track buffering ahead.

The reason is rate-limit headroom, not speed. At batchSize 24 reconstruction is
2 to 15 seconds, so it is not slow. But every skip fires a fresh burst of
read-only calls, and a listener hammering next would blow through Hiro's free
tier. No-skip keeps a whole session comfortably inside it. It also just feels
like radio, which is the better story anyway.

Keeping: the like button (local storage only, no `/index/verdict` call) and the
fullscreen receiver.

**Both script tag and iframe.** The iframe version is the script tag on a bare
page we host, so one bundle serves both.

Script tag is primary, because:

- Fullscreen works. An iframe cannot resize itself, so fullscreen inside one is
  clipped to the frame box and needs a postMessage handshake the host site has
  to cooperate with.
- Storage is first-party. The whole design rests on the IndexedDB track cache,
  and in a script tag that cache lives in the host site's own origin, persists,
  and is shared across their pages. In a third-party iframe it is partitioned,
  and Safari's ITP can block or evict it. An embedder whose cache keeps getting
  wiped goes back to hitting the chain on every play.

iframe is the fallback for locked-down platforms (WordPress.com, Substack,
Ghost, Squarespace, Notion) that strip script tags but allow embeds, and for
hosts whose CSP allows `frame-src` but not third-party `script-src`. Fullscreen
degrades to opening the full receiver in a new tab. The weaker caching should be
documented honestly rather than left for people to discover.

### Proposed snippet

```html
<script src="https://xtrata.io/fm.js"
        data-tracks="1107,1105,1101,1099"
        data-station="DYLE FM"
        data-api="https://api.mainnet.hiro.so"></script>
```

### The cache

Reconstruction already verifies against the on-chain final-hash, which makes a
perfect cache key. Store assembled bytes in IndexedDB keyed by final-hash and a
second play costs zero chain reads. Byte-identical by construction, so there is
no staleness question.

Gives the embed a real character: cold on first play, warm as it goes, instant
on a return visit. Frame it as the station learning its listener, not as
caching.

### Files to add

- `src/home/embed/chain-source.js` - chain-backed resolver plus IndexedDB cache.
- `src/home/embed/fm-embed.js` - entry, reads `data-*` off its own script tag.
- `vite.fm-embed.config.ts` - builds to `public/fm.js`, IIFE, CSS inlined.
- A bare host page for the iframe variant.

### Edits needed in radio.js

- Accept an injectable resolver plus embed options (locked band/preset, no
  skip, discovery off).
- Guard `/index/*`, `/warm`, `/inscription` and `/i/` behind a discovery flag,
  since none of them exist on an embedder's origin.
- Add an `is-embed` class. `.xtrata-radio` is `position: fixed` at
  `src/home/radio.css:8`, which is wrong for an inline embed. There is precedent
  in the existing `is-docked` handling.
- Wire up `stationName`. `radio-standalone.js` already passes it but
  `initXtrataRadio` never destructures it, and the brand is hardcoded in the
  markup at `src/home/radio.js:71`. White-labelling is the first thing an
  embedder will want.

### Open item: the faceplate

`public/radio-face.jpg` is 290KB and referenced as an absolute path at
`src/home/radio.css:32`, so it breaks off-origin. Options are inlining an
optimised WebP into the bundle, or inscribing the faceplate and having the embed
reconstruct its own chassis from the chain before it plays anything. The second
is zero bandwidth and a much better story, but it depends on an inscription that
does not exist yet, so build with a `data-face` override and an inlined default.

### Server side is already ready

No work needed. `/inscription` via `functions/runtime/content.ts:47` sends
`Access-Control-Allow-Origin: *` with Range support, every `/index/*` endpoint
does the same, and there is no `X-Frame-Options` or `frame-ancestors` anywhere
except `functions/debug.ts`. Framing is already permitted.
