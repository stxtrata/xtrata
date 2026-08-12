# Build notes

`README.md` is how to run the harness. `journal/` is what it did on a given
day. This file is why it is built the way it is, and what is still missing.

Built 2026-08-11 and 2026-08-12.

---

## What already existed, and what happened to it

- `xtrata-1.0/Launch-Campaign/07-automation-plan.md` and `08-no-api-automation.md`
  planned a six-platform campaign tool in July 2026. Never built. This harness
  does the X-shaped part of it and nothing else.
- `src/lib/campaign/` has a draft/approve/schedule state machine with **zero
  consumers**, backed by localStorage and IndexedDB, so it cannot support a
  scheduled job. It is superseded by this directory and should probably be
  deleted.
- `X-Chess/shots/tweets.html` is a hand-written posting board with grouped
  threads, character counts, image paths, per-post editorial notes and posted
  ticks. The canary is a generalisation of it. It is also the voice corpus that
  `registry/voice.md` is derived from. It is the single most useful artefact in
  this whole area and it predates the harness.

---

## Decisions worth not relitigating

**Nothing posts unattended.** See the README. This is the one rule that is not
a tradeoff.

**A failed read is never a zero.** Every collector returns `{ value, ok, error }`.
This is the house convention from `CLAUDE.md` and it earned itself immediately:
the first X Chess read came back 429 across the board, and a naive collector
would have reported "no games" on launch day.

**Staleness is measured in blocks, not days.** `state/mainnet-xtrata-v3-2-3.json`
deliberately carries no wall clock, precisely so a routine block-height change
does not read as a fee change in the diff. The first version of the staleness
check invented a timestamp field that does not exist and silently produced
`ageDays: null`.

**Numbers are declared, not scanned.** The copy spells figures out in words, so
`facts` entries carry `path`, `was` and `asWritten`. Scanning the text for
digits would find nothing at all.

**Submissions are not moves.** X Chess `next-seq` counts submissions, and the
app itself reports that some did not count while still being stored on chain
and still costing a fee. Say "signed transactions". This was caught by looking
at a screenshot, not by reading the contract.

**Captures use `domcontentloaded` plus a timer.** The site is a SPA that polls
and never goes network-idle, so `networkidle` timed out on 7 of 8 pages.

**Captures never use `loading="lazy"`.** The `src` is assigned by script after
parse, and a lazily-loaded image whose src arrives late does not reliably
re-arm its intersection observer. It presents as images stuck at 2x2 forever,
intermittently, depending on scroll position at assignment time.

**Imagery is not committed.** Jim's call, 2026-08-12. Old image paths will not
resolve after a clone and the board renders a red warning rather than
pretending. The archive records which image was used by path, which is the part
worth keeping.

**The archive has no buttons.** Anything actionable in a list of things already
posted is a way to post them twice.

---

## Open items

- **No X API access.** Approved posts are copied and published by hand. When
  credentials exist, the poster is one small script behind the same approval
  gate. Nothing else changes.
- **The daily routine is not scheduled.** `.claude/commands/comms-daily.md`
  exists and is runnable as `/comms-daily`, but no recurring job creates it.
- **`journal/index.jsonl` is empty and correct.** Nothing has been posted yet.
- **Forever Twins: 2,089 / 2,089 Bitcoin Pepes Forevered.** Surfaced by the
  capture of our own live page on 2026-08-11. A completed migration, and
  probably the strongest unused story available. It needs one confirmation
  against the helper contract rather than against our own marketing page,
  because the registry says every Forever Twins number needs verifying.
- **Two claims in the X Chess corpus are still `UNVERIFIED`** in
  `X-Chess/shots/tweets.html`, both about mobile and passkey flows. They were
  never confirmed and are excluded from the queue.
- **X Chess inscription 2988 hardcodes `xchess-core-v1-canary`** and is
  permanent. If `xchess-core-v1` is ever deployed as the real contract, 2988
  keeps talking to the canary and cannot be repointed. Recorded in
  `X-Chess/X-Chess_2.0/README.md`.
- **Two stale manifests found in passing**, neither fixed here:
  `state/mainnet-xtrata-v3-2-3.json` is tens of thousands of blocks behind, and
  the x-board version manifest was generated 2026-06-08 and names v1.34 as
  latest while v1.42 exists on disk. Any post quoting a fee or an x-board
  version would be wrong until those are re-run.

---

## Things that would improve it next

- Backfill `metrics` into `journal/index.jsonl` so the selector can learn which
  angles landed rather than only which ones ran.
- A `comms:news` step. The news sweep is currently done by the assistant during
  the run and written into the signals file by hand, which means it is skipped
  whenever the run is rushed.
- Stat cards only exist for X Chess. The generator is generic, the mapping is
  not.
