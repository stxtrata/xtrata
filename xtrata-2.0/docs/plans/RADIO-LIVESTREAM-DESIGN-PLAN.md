# Xtrata Radio — "Live Broadcast" design & implementation plan

Goal: make the radio behave like an actual station. When someone **powers it
on** (as opposed to manually pressing play/next), they should drop into a
**single shared stream** at the point it's "currently" playing — so two people
who switch on at the same moment, on different machines, hear roughly the same
thing at the same time. Manual operation (the existing engine — skip, shuffle,
likes, no‑repeat) stays fully intact as a second, personal mode. The stream is
a growing loop of inscribed songs; new songs join it automatically as they're
discovered on‑chain.

This builds on the existing engine in `src/home/radio.js` (bundled to
`public/xtrata-radio.js`) and the D1‑backed station list at `/index/playable`.
It is an additive layer, not a rewrite.

**Decisions locked in (2026‑07‑06):**

1. **Self‑building timeline** — durations are crowd‑measured by listeners' own
   players and reported back (same shape as the shared dud memory). Order is
   mint/ID order; new songs append to the loop. Zero manual upkeep.
2. **Resume re‑syncs to live** — pausing then resuming rejoins the broadcast at
   the real‑time position. You can't privately rewind the stream.
3. **Skip/pick = go manual** — power‑on drops you into the synced broadcast; any
   hands‑on control tunes you off‑air into the existing personal engine; a
   **LIVE** button rejoins at the current position.

---

## 1. The core idea: a clock is the only thing two strangers share

Two browsers can't hear a byte‑for‑byte identical stream (independent `<audio>`
elements, independent buffering). What they *can* share is **wall‑clock time**
and a **deterministic schedule**. If every client computes "what's on air right
now" from the same clock and the same ordered playlist, they all land on the
same song at the same offset — no central "now playing" server, no polling, no
per‑user state. It keeps working offline of our API once the schedule is cached,
survives page navigation for free (just recompute), and is cheap at any scale.

That's the whole trick. Everything below is in service of making that
computation correct and keeping it correct as the library grows.

### The mapping (wall clock → song + offset)

```
Schedule (ordered):   [ T0 ][ T1 ][ T2 ] ... [ Tn-1 ]   then loops
Durations (s):         d0    d1    d2         d(n-1)
Cumulative starts:     C0=0, C1=d0, C2=d0+d1, ...        Ci = Σ d[0..i-1]
Loop length:           L = Σ d[0..n-1]
Epoch:                 E   (a fixed launch timestamp, constant forever)

now'    = corrected wall clock (see §4 clock skew)
elapsed = ((now' - E) mod L + L) mod L        // seconds into the loop
i       = largest index with Ci <= elapsed    // binary search
offset  = elapsed - Ci                         // seconds into song Ti

⇒ play Ti, seek to `offset`, keep playing; at song end recompute (→ Ti+1 @ ~0)
```

Because `E`, the ordered list, and the durations are identical for everyone, the
output `(i, offset)` is identical for everyone at a given instant. Sync quality
then comes down to clock accuracy (we correct it) and drop‑in/seek latency
(bounded, and it settles).

---

## 2. The missing piece: durations (and how the stream builds itself)

The blocker today: **nothing stores how long a song is.** `inscription_index`
has `mime` and `total_size` (bytes) but no duration, and `/index/playable`
returns only ID arrays. Without per‑song seconds there is no timeline.

We already have the perfect precedent for solving this communally: the
`radio_verdicts` table + `POST /index/verdict`, where one listener's probe
result (dud/ok) is shared with everyone via `/index/playable`. Durations get the
same treatment:

- A listener's `<audio>` element already learns the exact length on
  `loadedmetadata` (`player.duration`). The bytes are identical for every
  listener, so **one honest measurement is the true duration for everyone.**
- The client reports it once (`POST /index/duration`), the server stores it, and
  `/index/schedule` folds it in. The song joins the broadcast on the next
  schedule refresh.

The elegant consequence: **the manual/exploration engine feeds the broadcast.**
Any song a listener plays by hand gets measured and, next refresh, becomes part
of the live loop. The stream literally builds itself as people listen and as new
songs are inscribed. A song with no known duration simply isn't in the loop yet
(it still plays fine in manual mode) — so the timeline is always exact, never
guessed.

One‑time bootstrap: seed durations for the current ~1h of songs once (a quick
scripted pass that loads each `jim-music` / known‑playable id, reads
`loadedmetadata`, and POSTs), so LIVE has content from day one instead of
waiting for organic measurement.

---

## 3. Backend design

### 3.1 Migration `009_radio_durations.sql`

```sql
-- Communal, self-healing song-length memory. Mirrors radio_verdicts: the
-- client measures duration on loadedmetadata and reports it; /index/schedule
-- uses it to place the song on the broadcast timeline. Bytes are identical for
-- every listener, so a single honest report is authoritative; `reports` and the
-- bounds/rounding below harden it against a bad actor.
CREATE TABLE IF NOT EXISTS radio_durations (
  contract   TEXT    NOT NULL,
  token_id   INTEGER NOT NULL,
  seconds    REAL    NOT NULL,          -- measured length, rounded to 0.1s
  reports    INTEGER NOT NULL DEFAULT 1,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (contract, token_id)
);
CREATE INDEX IF NOT EXISTS idx_radio_durations_contract ON radio_durations (contract);
```

### 3.2 `POST /index/duration`  (mirror of `verdict.ts`)

Body: `{ contract, tokenId, seconds }`. Validate `contract` regex (as elsewhere),
`tokenId` integer in range, and `1 <= seconds <= 1800` (reject absurd values;
songs, not films). Round to 0.1s. Upsert:

```sql
INSERT INTO radio_durations (contract, token_id, seconds, reports, updated_at)
VALUES (?, ?, ?, 1, ?)
ON CONFLICT (contract, token_id) DO UPDATE SET
  reports    = radio_durations.reports + 1,
  -- keep the majority value; only move if a materially different length keeps
  -- getting reported (guards against a one-off bad read without freezing a
  -- genuinely wrong seed forever). v1 can simply keep the first in-bounds value.
  seconds    = CASE WHEN ABS(radio_durations.seconds - excluded.seconds) > 1.0
                    THEN excluded.seconds ELSE radio_durations.seconds END,
  updated_at = excluded.updated_at;
```

Advisory‑only, exactly like verdicts: a wrong report can nudge the timeline but
never breaks manual playback, and consensus/rounding + a future admin override
(via a programming manifest, §8) contain it.

### 3.3 `GET /index/schedule?contract=<addr.name>`

The broadcast manifest. Reuses the same D1 reads as `/index/playable` and joins
in durations. Returns the **ordered, known‑duration, non‑dud** tracks plus the
sync anchors:

```jsonc
{
  "contract": "SP3…​.xtrata-v3-2-3",
  "epoch": 1735689600,          // FIXED station launch (UNIX s) — never changes
  "serverNow": 1751824530.412,  // server time at response (for skew correction)
  "version": "a1b9…",           // hash of ordered [id:seconds] + epoch
  "total": 3987.4,              // loop length L (seconds)
  "count": 42,
  "tracks": [                   // ordered by token_id ASC (== mint order == append)
    { "tokenId": 577,  "seconds": 92.3 },
    { "tokenId": 785,  "seconds": 145.0 },
    …
  ]
}
```

- **Selection:** `sealed = 1` AND (`audio/%` OR `text/html%`) AND not in
  `radio_verdicts` (dud) AND present in `radio_durations`. (Same base query as
  playable, `INNER JOIN radio_durations`.)
- **Order:** `token_id ASC`. Mint order == id order, so new inscriptions append
  to the tail — the loop grows, existing positions don't reshuffle.
- **Epoch:** a single constant baked into the endpoint. Changing it resequences
  the entire stream, so it's set once at launch and left alone.
- **version:** cheap hash so a LIVE client can notice the schedule changed and
  re‑sync (§6). Edge‑cache identically to playable: `s-maxage=60,
  stale-while-revalidate=300` — clients converge on the same schedule within the
  cache window.

No new sync/write paths on the hot audio route — the schedule is a cached read,
the clock does the rest.

---

## 4. Client design (`src/home/radio.js`)

### 4.1 Mode state machine

```
        power on (switchOn)               press LIVE / power-cycle
   ┌───────────────────────► LIVE ◄───────────────────────────┐
   │                          │                                │
   │        next / prev / shuffle / pick a song / scrub        │
   │                          ▼                                │
   └──────────────────────  MANUAL  ───────────────────────────┘
                     (existing engine, unchanged)
```

- `broadcastMode ∈ {LIVE, MANUAL}`; default on `switchOn()` is **LIVE** when the
  schedule is non‑empty, else fall back to MANUAL (cold start).
- **Leaves LIVE → MANUAL:** `skip('next'|'prev')`, `setShuffle`, `playToken`
  (related‑track / liked pick), user scrub. These already funnel through known
  entry points, so the hook is small.
- **Enters LIVE:** new **LIVE** control, or power‑off→on. Recomputes position
  from the clock and drops in.
- **Untouched by mode:** volume, like (likes the on‑air song), fullscreen,
  minimise, band/preset viewing.
- **Pause/resume in LIVE:** stays LIVE but "detached" while paused; on resume,
  recompute from the clock and seek → you rejoin the live position (the locked
  decision). Pausing does *not* drop you to MANUAL; only a transport/pick does.

### 4.2 The sync engine (LIVE)

A small, pure, exported module `radio-schedule.js` (so it's unit‑testable in
isolation) holds the math from §1:

```js
// pure — no DOM, no clock; caller passes `now`
export function positionAt(schedule, now) {
  const { epoch, total, cum, tracks } = schedule;      // cum precomputed once
  if (!tracks.length || total <= 0) return null;
  const elapsed = (((now - epoch) % total) + total) % total;
  let lo = 0, hi = tracks.length - 1;                  // binary search cum[]
  while (lo < hi) { const m = (lo + hi + 1) >> 1; if (cum[m] <= elapsed) lo = m; else hi = m - 1; }
  return { index: lo, tokenId: tracks[lo].tokenId, offset: elapsed - cum[lo], loopAt: epoch + Math.ceil((now - epoch) / total) * total };
}
```

Engine wiring in `radio.js`:

- **Drop‑in:** on entering LIVE, fetch/refresh the schedule, compute
  `positionAt(now')`, resolve the tokenId via the existing three‑core resolver
  ladder, `player.currentTime = offset` (the resume path already does this), play
  after the tuning sweep. The sweep nicely masks the drop‑in.
- **Advance:** on `ended`, in LIVE **do not** call `pickNext()`; recompute from
  the clock (normally the next track at offset ≈ 0) and play it.
- **Drift correction (`syncTick`, ~every 20s while LIVE + playing):** recompute
  expected `(index, offset)`.
  - expected track ≠ current → retune to expected (tab was hidden, or we crossed
    a boundary): the common "catch back up" case.
  - same track, `|player.currentTime − offset| > 2s` → seek to `offset`.
  - small drift → ignore (a hard seek every 20s would be audible; 2s tolerance
    keeps it smooth). Optional refinement: nudge `playbackRate` to ±2% to bleed
    off sub‑second drift inaudibly instead of seeking.
- **Visibility:** on `visibilitychange → visible`, resync immediately (hidden
  tabs throttle timers and audio, so we'll have fallen behind).
- **Stall / no‑signal / element error:** the existing self‑healing retunes, but
  in LIVE it recomputes from the clock so you rejoin *where the broadcast is
  now*, not where you stalled.
- **Cross‑page:** LIVE is a one‑bit flag in the `xtrata.radio.v1` state blob;
  each page just recomputes from the clock on load — continuity for free, and it
  actually *self‑corrects* across the navigation gap.

### 4.3 Clock‑skew correction

Never trust raw `Date.now()` for position — a device clock that's 30s off would
put that listener 30s out. On each schedule fetch, read `serverNow` and compute
`skew = serverNow − Date.now()/1000` at receipt; thereafter
`now' = Date.now()/1000 + skew`. This is NTP‑lite: it aligns everyone to *server*
time regardless of local clock error, to well under a second. Re‑measure on each
schedule refresh. (Round‑trip asymmetry adds a few hundred ms of uncertainty —
negligible for "feels in sync".)

### 4.4 Measuring & reporting durations

On `loadedmetadata` for any track (LIVE or MANUAL), if `player.duration` is
finite and in‑bounds and we don't already have it, `POST /index/duration` once
per song per session (dedupe set, exactly like `reportedVerdicts`). This is the
data pump that makes new songs joinable and is worth shipping first (§7, P0),
since it can populate silently long before LIVE exists.

### 4.5 UI / VFD

- Line 1 shows **`◉ ON AIR — XTRATA FM`** in LIVE, the band/mode text in MANUAL;
  the existing self‑paced ticker (title/artist/plugs) is unchanged.
- A **LIVE** affordance (repurpose one of the seven top buttons from the v2
  faceplate, or a small "◉ LIVE" pill): lit when on air, and the one‑tap way to
  rejoin from MANUAL. Pressing it plays the between‑station squelch and drops in.
- Power‑on = tuning sweep → drop into the broadcast mid‑song. Feels like tuning
  into a station that was already playing.

---

## 5. How this reuses the existing engine (not a rewrite)

| Need | Already in `radio.js` |
|---|---|
| Resolve a tokenId to a playable `src` (raw audio or opus‑player data:audio) | three‑core resolver ladder in `resolveTrack` |
| Seek to an offset before play | the session‑resume path already sets `player.currentTime` |
| Mask the drop‑in | `playTuning()` sweep / squelch |
| Warm content so seeking doesn't stall | `warmHttpCache` / `pingWarm` / preload queue |
| Duds never air | `radio_verdicts` + client probe (also filtered out of the schedule) |
| Cross‑page continuity | `xtrata.radio.v1` state blob + double‑init guard |
| Manual mode | everything as‑is — LIVE just sits in front of it |

LIVE mode is essentially: *"compute (tokenId, offset) from the clock instead of
`pickNext()`, then use the engine's existing resolve → seek → play path, and
recompute on end / drift / resync."*

---

## 6. Playlist growth without breaking sync

Because order is `token_id ASC` and additions are always higher ids, **new songs
append to the tail** — every existing `Ci` is unchanged; only `L` grows and the
loop gets longer. Consequences and handling:

- All clients pull the same edge‑cached schedule, so within the 60s window they
  compute identically. When the `version` changes, LIVE clients pick it up on
  their next `syncTick` and re‑anchor **together** (deterministic — same new `L`,
  same clock), so they stay in sync with each other through the change; the only
  artefact is a one‑time, shared re‑sequence past the old loop point.
- Refinement if that artefact is ever audible: **apply schedule changes only at a
  loop boundary** — a client that's mid‑loop keeps its current schedule until the
  wrap, then adopts the new `version`. Keeps additions invisible. (Optional; not
  needed for v1 with occasional additions and an hour‑plus loop.)
- Durations are advisory and self‑healing: if a bad value slips in, a corrected
  report (or admin override) fixes it for everyone next refresh.

---

## 7. Phased rollout

Each phase is independently shippable; **P0 can go out immediately** and starts
gathering the durations everything else depends on.

- **P0 — Duration pump (½ day).** Migration 009, `POST /index/duration`, client
  reports on `loadedmetadata`. Invisible to users; begins populating
  `radio_durations` from real listening today. Add the one‑time seed pass for the
  current library.
- **P1 — Schedule endpoint (½ day).** `GET /index/schedule` (epoch, serverNow,
  version, ordered known‑duration tracks). Unit‑test selection/order/hash.
- **P2 — Client LIVE engine (1–1.5 days).** `radio-schedule.js` pure module +
  skew + position math + drop‑in seek + drift/catch‑up + visibility resync +
  ended‑recompute + cross‑page recompute. Gate behind `?radio=live` so it's
  testable before it's default.
- **P3 — Mode hand‑off + LIVE button (½ day).** Power‑on → LIVE default,
  transport/pick → MANUAL, LIVE rejoin, pause→resume re‑sync, `◉ ON AIR` VFD.
- **P4 — Polish & hardening (½ day).** Duration consensus, `playbackRate` micro‑
  correction (optional), mobile, rebuild + sync `public/xtrata-radio.js`,
  `?radiodebug=1` audit, and a hidden sync self‑test overlay (shows computed
  index/offset/skew).

Total ≈ 3–3.5 days.

---

## 8. Risks, edge cases, and how each is handled

- **Cold start (no durations)** → LIVE would be empty. Mitigation: one‑time seed
  pass; and LIVE gracefully falls back to MANUAL until the schedule has ≥ a few
  tracks.
- **Bad/malicious duration report** skews the timeline for all. Mitigation:
  bounds (1–1800s) + rounding + majority‑keep in the upsert; advisory‑only so
  manual playback is never broken; future admin override via a programming
  manifest.
- **Seek buffering on large/remote files** → laggy drop‑in. Mitigation: warm
  cache + prefer in‑memory opus `data:audio`; the tuning sweep covers it; songs
  are short.
- **Very wrong device clock** → that listener out of sync. Mitigation: `serverNow`
  skew correction means we align to server time, not the device.
- **Backgrounded/throttled tabs** → audio and timers stall. Mitigation:
  `visibilitychange` resync + the 20s `syncTick`.
- **Autoplay policy** → needs a gesture. The power‑on click *is* the gesture; the
  LIVE button is a gesture too. Deep‑link `?radio=live` shows the existing
  tap‑to‑start prompt.
- **Short loop (~1h)** → repetition is obvious. Acceptable and expected now; the
  loop lengthens automatically as songs are added. "Daily‑seeded shuffle" (from
  the options) remains a drop‑in future variation if repetition grates.
- **Perfect sample sync is impossible** with independent `<audio>` elements —
  target is "roughly in sync" (typically well under ~1–2s apart after settle,
  tightened by drift correction), which is the stated goal.
- **Bundle drift** → `public/xtrata-radio.js` must be rebuilt (`build:radio`) and
  committed whenever `radio.js` changes; the standalone bundle carries LIVE to
  all side pages.

---

## 9. Testing strategy

- **Pure schedule module** (`radio-schedule.js`): unit tests for boundary
  instants, loop wrap, binary search, growth reflow determinism, and skew — no
  DOM needed (like the existing no‑repeat sim).
- **Multi‑client determinism:** feed the same schedule + a spread of clocks to N
  instances; assert identical `(index, offset)` for all → proves sync.
- **Drift/catch‑up:** simulate a hidden‑tab time jump; assert `syncTick` selects
  the right track+offset.
- **Manual QA:** two browsers / two devices side by side; measure the audible
  offset; verify power‑on sync, LIVE rejoin, pause→resume re‑sync, and
  skip→MANUAL hand‑off.
- **Regression:** re‑run the manual‑mode no‑repeat simulation; confirm MANUAL is
  unchanged.

---

## 10. Future / explicitly out of scope for v1

- **Authored programming manifest** (the "Authored program" option): an optional
  inscribable manifest that overrides order and can pin durations — real station
  programming / "shows" — layered on top of the auto schedule when present.
- **Listener presence** ("N tuned in") via a lightweight ping.
- **Share‑the‑moment deep links** (`?live` already syncs; a share button is
  trivial once LIVE lands).
- **Server‑side duration probing** (container metadata parse) to reduce reliance
  on listener measurement.

---

## 11. Open questions to settle before P2

1. **Epoch value** — pick the fixed launch timestamp (any instant; just set once
   and never change).
2. **Duration consensus** — is "first in‑bounds value, majority‑keep" enough for
   v1, or do we want median‑of‑N before a song is eligible for the schedule?
3. **LIVE control placement** — repurpose one of the seven faceplate buttons, or
   add a dedicated `◉ LIVE` pill?
4. **Boundary‑only schedule adoption** (§6 refinement) — ship in v1, or defer
   until additions are frequent enough to notice?
