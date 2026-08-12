# The daily comms run

The procedure for one day's pass on @XtrataLayers. Invoked as `/comms-daily`,
which is a thin pointer at this file so the procedure lives in the repo rather
than in a gitignored local directory.

Read `README.md` first, then `registry/voice.md`, then the three most recent
files in `journal/`. That is the whole briefing. Do not skip it, even if the
conversation already seems to contain context.

**You never post anything.** You draft, lint, queue, and journal. Jim approves
on the canary board and publishes. If you find yourself reaching for a posting
tool, stop.

---

## 1. Harvest

```bash
npm run comms:signals
```

Then carry yesterday forward and re-check it against what you just harvested:

```bash
npm run comms:refresh
```

**Read the refresh output properly, it is the most useful thing you will see
all run.** Posted drafts drop into the archive. Drafts citing a number that
moved come back as `unverified` with the old value, the new value, and the
exact words to change. Fix those before writing anything new: a draft that is
already written and merely out of date is the cheapest good post available.

A post that cites a number must declare it, or nothing can check it later:

```json
"facts": [
  { "path": "chain.xchess.value.movesTotal", "was": 88, "asWritten": "Eighty eight" }
]
```

`asWritten` matters because the corpus spells numbers out, so scanning the text
for digits finds nothing. Add `facts` to every post carrying a figure. A post
without them will silently go stale.

Read `signals/<today>.json` and note which collectors returned `ok:false`.
**A failed read is not a zero.** If `lastTokenId` failed you do not know that
nothing was inscribed, so you may not write a post implying either way.

Then do the news sweep with WebSearch. Run at least these, plus your own:

- `Stacks blockchain` news from the last week
- `Bitcoin ordinals inscriptions` news from the last week
- `on-chain storage NFT permanence` discussion
- `Xtrata` mentions
- one query aimed at whatever the signals file made interesting today

Write findings into the `news` array of the signals file as
`{ id, headline, url, source, date, whyItMatters, respondable }`. Set
`respondable: true` only where an Xtrata reply adds something the reader does
not already have. Most news is not respondable, and an account that replies to
everything is noise.

## 2. Select

From `registry/surfaces.json`, take every surface with `status: "live"` and
skip everything else. Check the status field rather than going from memory:
X Chess was `not-ready` until it was inscribed on 2026-08-11, and the next
thing to ship will sit in the same trap.

For each live surface, check `journal/index.jsonl`:

- Skip the surface if it was posted within its `cooldownDays`.
- Never reuse a `hook` that appears in the last 60 days.
- Prefer an angle that has not run recently.

## 3. Draft

Coverage rather than volume. Per eligible surface:

- **two standalone variants** on different angles, so Jim picks rather than edits
- **one thread** where the surface has an argument needing more than one post

Then across the whole day, **two to four reply drafts** aimed at real posts from
the news sweep. Each needs a filled `target` with `url`, `author`, `excerpt`
and `why`. A reply with a placeholder target stays `unverified` and cannot be
approved.

Voice rules are in `registry/voice.md` and are enforced. Short sentences. No em
dashes, no semicolons, no hashtags, no emoji, no hype. State the mechanism
rather than the adjective.

**Every factual claim must trace to a signal id or a registry field.** Put the
ids in the post's `signals` array. If a claim traces to neither, cut it or mark
the post `unverified` with a `verifyNote` naming the unchecked claim.

Anything on a surface's `verifyBeforeUse` list may not be posted from memory,
numbers especially. Verify it in this run and record the value and its source
in the journal.

Write to `queue/<today>.json`. Copy the shape from `queue/2026-08-11.json`,
which is the reference example.

## 4. Lint, illustrate, build

```bash
npm run comms:lint comms/queue/<today>.json
```

Rewrite anything that fails. Do not waive a lint error and do not edit the
linter to make a post pass.

```bash
npm run comms:images
npm run comms:canary
```

`comms:images` gives every post curated, captured and generated options. It
takes a couple of minutes because it screenshots every live surface. Read its
output: a `capture FAILED` line means that surface has no fresh picture today,
and an `action failed` line means the screenshot is of the wrong screen, which
is worse because it looks fine.

If a surface's interesting screen is behind a click, give it `capture.actions`
in the registry rather than accepting a screenshot of a landing form.

## 5. Journal

Write `journal/<today>.md`, covering:

- what the signals showed, including anything that failed to read
- what news you found, and what you deliberately did not respond to
- what you drafted and why those angles
- **what you rejected and why.** The most valuable section, because it stops a
  future run re-proposing an angle that was already dismissed
- any claim you verified, with the value and source, so the next run knows how
  stale it is
- anything in the registry that looks wrong or out of date

Then tell Jim: how many drafts, across how many surfaces, how many unverified
and why, and to open `comms/canary/index.html`.

## 6. After Jim posts

He ticks what went out on the board. Copying an image marks it used, so the
export carries the picture actually attached. Then:

```bash
npm run comms:record -- --date <today> --paste
```

Or for a whole thread at once, which is how threads are normally posted:

```bash
npm run comms:record -- --date <today> --thread <thread-id>
```

That writes the index line in `journal/index.jsonl`, the full text and image
used in `archive/<today>.json`, and a `posted` mark in the queue. From then on
the board shows it under Archive on any machine, and tomorrow's refresh drops
it rather than offering it again.

If something went out that is not in the queue, add it to the journal by hand.
An unrecorded post is invisible to every future run, so the harness will
cheerfully suggest saying the same thing again next week.
