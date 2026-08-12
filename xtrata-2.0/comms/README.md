# comms — the @XtrataLayers posting harness

This directory is the memory of the Xtrata account. It exists so that a future
assistant, with no knowledge of any previous session, can pick up the daily
posting job and be correct on the first attempt.

**If you are an assistant starting a comms run, read this file, then
`registry/voice.md`, then the last three files in `journal/`. That is the whole
briefing.**

---

## The rule that matters most

**Nothing is posted without a human approving it.** The harness drafts, lints,
and queues. Jim approves. A script posts what was approved and nothing else.

This is not a temporary training-wheels arrangement. Posting to a real brand
account is publishing, and the failure mode of an unattended language model
reacting to news in public is bad and permanent. If the mode ever changes, it
changes because Jim said so in writing, and this paragraph gets rewritten.

---

## What the daily run does

1. **Collect.** `npm run comms:signals` writes `signals/YYYY-MM-DD.json`: what
   the chain did, what the repo changed, what the outside world said. Signals
   are facts with sources. Never prose, never opinion.
2. **Refresh.** `npm run comms:refresh` carries yesterday's undecided drafts
   into today and re-checks them against this morning's signals. Three things
   happen, all of them printed:

   - **posted** drafts are dropped from the live queue. They are in
     `archive/` now, and the board reads them from there.
   - **drifted** drafts are carried but forced back to `unverified`, with a
     note naming the old value, the new value, and the words in the text that
     need changing. They cannot be approved until somebody rewrites the line.
   - **expired** drafts, carried more than seven days without going out, are
     dropped. A draft nobody has posted in a week is being avoided, not saved.

   Dated images are cleared from carried drafts so `comms:images` redoes them
   against today. Yesterday's capture is yesterday's page, and a stat card
   built from yesterday's numbers is exactly what this step exists to catch.

3. **Select.** Pick candidates from `registry/surfaces.json`, honouring
   `cooldownDays` and the "no repeated hook" rule enforced against
   `journal/index.jsonl`.
4. **Draft.** Write in the voice defined by `registry/voice.md`. Every factual
   claim must trace to a signal or to a registry field. If it traces to
   neither, it does not go in the post.
5. **Lint.** `npm run comms:lint` rejects em dashes, semicolons, over-length,
   hype vocabulary, and missing links. A post that fails the linter is rewritten,
   not waived.
6. **Illustrate.** `npm run comms:images` gives every post a set of image
   options and writes them back into the queue as an `images` array. Three
   sources, best first:

   - **curated** — a real screenshot somebody framed on purpose, listed in the
     registry as `curated` on a surface or on a single angle. Angle-specific
     art wins, because it was chosen for that argument.
   - **capture** — a fresh headless screenshot of the live page, taken now, so
     it shows what a reader would actually land on today. Configured per
     surface under `capture`. A surface whose interesting screen is behind a
     click can drive the UI with `capture.actions`.
   - **card** — a generated card carrying the post's own leading line, or a
     stat card built from harvested signals. The fallback that guarantees no
     post goes out bare. Replies are excluded on purpose: an image stapled to
     a reply in somebody else's thread reads as an advertisement.

   Captures are reused across runs unless `--force`. `--no-capture` skips the
   network but keeps whatever is already on disk.

   **A stat card may only contain numbers that came from the signals file.**
   The card generator reads them itself rather than taking them as arguments,
   so it cannot be handed a figure nobody checked.

7. **Queue.** `npm run comms:canary` renders `queue/YYYY-MM-DD.json` into the
   posting board at `canary/index.html`.

   Image paths resolve against either this repo or its parent, so
   `X-Chess/shots/05-sponsored-challenge.png` works even though X-Chess sits
   beside `xtrata-2.0` rather than inside it. Every picture is **embedded in
   the page as a data URI**, not linked, so the board is one self-contained
   file. Each distinct image is embedded once and referenced by key, so a
   screenshot shared by four posts is not carried four times. A referenced
   image that cannot be found renders a red warning rather than silently
   disappearing.

   **The controls are always in the same place**, which is the point of the
   layout rather than a detail of it. Assembling a post means one click on
   `Copy text` and one on `Copy` under the image you want, so those two must
   not move. `Copy text` sits directly under the post, above the images, so
   image height cannot shift it. Every image tile is a fixed 124px frame with
   the picture contained inside, so a tall phone screenshot and a wide desktop
   one produce identical tiles and their button rows line up exactly. Letting
   the image set the tile height meant hunting for the controls on every card.

   Per tile: **Copy** puts the real PNG on the clipboard and marks the image
   used, **used** toggles that by hand, **Save** downloads it, and clicking the
   picture zooms it full screen.
8. **Journal.** Write `journal/YYYY-MM-DD.md` covering what was seen, what was
   drafted, what was rejected, and why. **The rejections are the valuable part.**
   A future assistant needs to know which angles were already tried and dropped.
9. **Record.** After Jim posts, `npm run comms:record` appends the posted items
   to `journal/index.jsonl`.

---

## The files

| Path | What it is | Who writes it |
| --- | --- | --- |
| `registry/surfaces.json` | Everything the account is allowed to talk about | Human, reviewed |
| `registry/voice.md` | How Xtrata sounds, derived from real posts | Human, reviewed |
| `DAILY-RUN.md` | The daily procedure, invoked as `/comms-daily` | Human, reviewed |
| `NOTES.md` | Why it is built this way, and what is missing | Human, reviewed |
| `signals/YYYY-MM-DD.json` | Harvested facts for one day | `collect-signals.mjs` |
| `queue/YYYY-MM-DD.json` | Candidate posts awaiting approval | The daily run, then `collect-images.mjs` |
| `assets/YYYY-MM-DD/` | Captures and generated cards for that day | `collect-images.mjs` |
| `canary/index.html` | The approval board | `build-canary.mjs` |
| `archive/YYYY-MM-DD.json` | Full text and the image actually used, per posted item | `record.mjs` |
| `journal/YYYY-MM-DD.md` | The narrative diary of one run | The daily run |
| `journal/index.jsonl` | One line per published post | `record.mjs` |

`signals/`, `queue/`, `archive/`, and `journal/` are committed. The diary is
worthless if it does not survive the machine it was written on.

**No imagery is committed.** `assets/` and every image file under `comms/` are
gitignored, along with `canary/index.html`, which is several megabytes of
embedded pictures. All of it is regenerated from the queue in a couple of
minutes:

```bash
npm run comms:images && npm run comms:canary
```

The consequence to know about: after a fresh clone, or for any day older than
your local `assets/`, the image paths recorded in `queue/` and `archive/` will
not resolve. That is expected. The archive records **which** image was used and
what it was, which is the part worth keeping, and the board renders a red
warning rather than pretending the picture is there. A capture is meant to show
what the page looked like today, so restoring an old one from a clone would be
the wrong behaviour anyway.

---

## `journal/index.jsonl` is load-bearing

One JSON object per line, appended, never rewritten:

```json
{"id":"2026-08-11-forever-twins-1","date":"2026-08-11","surface":"forever-twins","angle":"art-disappears","hook":"Your NFT can survive while the art disappears.","url":"https://x.com/XtrataLayers/status/...","chars":54,"signals":["ft-claims-live"],"metrics":null}
```

This file answers, by grep and nothing else:

- Have we used this hook before? (do not repeat within 60 days)
- What have we already said about Forever Twins?
- Which angles produced engagement, once `metrics` is backfilled?

Every anti-repetition guarantee in the harness rests on this file being
complete and honest. If a post goes out manually, add the line by hand.

---

## Claims that must be re-verified before they are repeated

The registry carries a `verifyBeforeUse` array per surface. These are claims
that were true when written and may not be true now: holder counts, fee figures,
partner wording, promo terms, anything with a number in it.

**A claim on that list may not be posted from memory.** Check it against a live
source in the same run, or write a post that does not need it. When a number is
verified, put the value and the date in the journal entry so the next run can
see how stale it is.

This exists because `forever-twins/README.md` states plainly that public
numbers and partner wording need fresh verification before publication, and
because a wrong number about a live grant-funded project is the single most
expensive mistake this harness could make.

---

## Status gating

`registry/surfaces.json` gives every surface a `status`:

- `live` — shipped, public, promotable
- `building` — real but unfinished, may be discussed as work in progress only
  if the post says so
- `not-ready` — **do not post about this at all**

**Only `live` surfaces are eligible for selection.** The selector must check
status, not vibes.

Nothing is `not-ready` right now. X Chess held that status until 2026-08-11,
when it was inscribed as token 2988 and started taking real games. The reason
to keep the field is that the failure it prevents is silent: a surface that is
real, exciting, and visible in the repo is exactly the thing an eager run will
announce a week before it is meant to exist.

---

## Adding a surface

Add one object to `registry/surfaces.json`. Do not touch any script. If adding
a surface requires a code change, the registry schema is wrong and should be
fixed instead of worked around.

Surfaces that also appear on the homepage must match
`src/home/homepage-content.js`. The site and the account describing the same
product differently is a bug that users notice.
