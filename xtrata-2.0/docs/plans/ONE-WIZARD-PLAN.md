# One wizard — a single guided path for any file

Goal: someone drops a file, any type, any size, and is walked through to a
finished inscription. The SUNO path stays dedicated to music, but it stops being
a *different product* — it becomes one shape the same wizard takes when you hand
it a song.

---

## 1. What is actually wrong today (measured, not assumed)

Two pages, `index.html` (2,071 lines) and `suno.html` (1,145), have
**independently reimplemented the same things**:

| Capability | Wizard | SUNO |
|---|---|---|
| Batch upload | full table, per-row deps + parents | its own simpler batch (`sunoBatch`) |
| Relationships | multi-parent, per-ID owner checks | single parent (`sParent`) |
| Escrow checklist | own implementation | own implementation |
| Receipt toggle | own, persisted (`RECEIPT_KEY`) | own, session-only |
| Cancel confirmation | own copy of `confirmDanger` | own copy |
| Song details editor | `metaOverlay` | `#editPanel` |
| Player build | batch + single | its own flow |

That duplication has a measurable cost. **Every fix this week had to be applied
twice** — the escrow checklist, the cancel dialog, the self-custody copy, the
parent-arrival latch. Twice the work, and twice the chance of the two drifting,
which is exactly what produced the parent-gate bug (the wizard and SUNO answered
"has the parent arrived?" from different sources).

**Correcting one assumption up front:** SUNO is not the more capable page — it is
the *simpler* one, which is why it feels better. Cloning it and generalising would
throw away things only the wizard has:

- the batch table with per-row dependencies and `@0, @1` back-references
- multi-parent escrow with per-ID ownership status
- job History across sessions
- manual recovery (`act('recover')`)
- send-the-inscription-to-a-different-address
- the raw-audio Opus optimiser (SUNO always builds a player instead)
- the dependency-graph composer

So the move is not "clone SUNO". It is: **take SUNO's shape and give it the
wizard's capability**, on one shared core.

---

## 2. The one constraint that decides the architecture

`public/_headers` gives cross-origin isolation (COOP/COEP) to `/wizard/suno` only.
SUNO needs it for the **multithreaded** ffmpeg core; the main wizard runs the
single-threaded core and is markedly slower at encoding.

The stated reason for scoping it is that "COEP breaks wallet popups elsewhere".

**That claim needs verifying before anything else, because it decides the whole
design.** SUNO has COEP *and* a working wallet — people have paid through it
repeatedly. So either the claim is stale, or it applies to a specific wallet or a
specific call (`sendInscription`?) that SUNO does not exercise.

- **If COEP is safe** → one page, one URL, isolation on for everyone. Simplest
  possible outcome, and the fast encoder for all audio.
- **If COEP genuinely breaks a wallet** → two thin entry points sharing one core
  (§3), because a page cannot be both isolated and not.

**Do this test first.** It is an afternoon, and building the wrong architecture
around a stale comment would cost far more.

---

## 3. Target architecture

One core, one guided flow, thin entry points.

```
wizard/core/
  flow.js         drop → detect → options → quote → pay → work → done
  panels/
    relationships.js   parent + dependencies (one implementation)
    escrow.js          the two-send checklist
    receipt.js         opt-in on-chain receipt
    details.js         title/artist/artwork/lyrics (song), name/type/URI (everything)
    danger.js          confirmDanger
    keepopen.js        keep-tab-open banner + leave guard
    history.js         jobs on this browser
  handlers/          <-- the file-type-aware part
    audio.js         raw Opus | build a player
    image.js         re-encode to the smallest format
    video.js         (today: as-is)
    document.js      (today: as-is)
    default.js       as-is
wizard/index.html    the single entry
wizard/suno.html     thin: preset the audio handler to "player", SUNO branding
```

Everything in `panels/` exists twice today. Merging them is mostly deletion.

---

## 4. The file-type model — the heart of the request

A **handler** owns everything type-specific, behind one interface:

```js
{
  id: 'audio',
  match(file),                  // extension + mime
  async probe(file),            // cheap: what is in this file?
  options(file, probe),         // the choices to offer, with a default
  async prepare(file, choice),  // returns { file, mime, uri } — what actually inscribes
  summary(result)               // "what you're about to inscribe", per type
}
```

The flow never knows what a song is. It asks the handler what to offer and what
to inscribe. Adding a type later is one file, not a new page.

`EXT` at `index.html:844` already maps extension → category (`audio`, `image`,
`video`, `document`, `data`), so the routing exists — it just drives a dropdown
today instead of behaviour.

**What each handler offers on day one:**

- **audio** — *Inscribe the file as it is* (Opus-optimised, existing behaviour,
  default) or *Build an on-chain player* (artwork, title, artist, lyrics). Probe
  reports what the file already carries. This is the SUNO experience, available
  for any audio.
- **image** — re-encode to the smallest format that preserves it
  (`XtrataImageOptimizer`), showing before/after. Already built, currently
  automatic and invisible.
- **video / document / data** — as-is, with the size and cost stated plainly.
  Deliberately no options rather than invented ones.

**SUNO becomes a preset, not a product**: the audio handler with *player* chosen,
the strict Suno-export probe, and SUNO branding. The `origin: 'suno'` field already
threaded through for receipts is exactly the hook.

---

## 5. Size and chunking — say it once, clearly

Today the size story leaks: `#largeFileNotice` pushes big files to the wizard,
SUNO says nothing until it is uploading, and "512 KiB" appears as an
implementation detail. It should be one sentence in the flow:

> 4.9 MB · 305 chunks · 10 batches · about 6 minutes.

Everything downstream already knows this — `quoteFee` returns `single` and
`batches`. It just is not shown as a plain-English expectation before payment.

---

## 6. Migration — incremental, never a big-bang rewrite

The wizards handle live money. Every step below leaves both pages working.

1. **Verify the COEP claim.** Decides one page or two. Nothing else starts first.
2. **Extract `panels/` one at a time**, wizard and SUNO switching to the shared
   version as each lands. Start with `danger.js` and `keepopen.js` — smallest, no
   money logic. Then `escrow.js` and `relationships.js`, which is where the
   drift actually hurt.
3. **Introduce the handler interface** with `default.js` only, so behaviour is
   unchanged, then move audio and image behind it.
4. **Rebuild the flow around the handlers** on the main wizard, keeping SUNO
   untouched.
5. **Reduce SUNO to a preset** once the audio handler matches what it does today.
6. **Delete the duplicates.**

Each step is independently shippable and revertible.

---

## 7. What this is not

- **Not a rewrite of the agent.** `agent-core.ts` is untouched. This is entirely
  the UI layer above it.
- **Not a redesign of the money flow.** Quote, deposit, escrow, refund all stay
  exactly as they are — they have had a week of hardening and should not be
  disturbed by a UI merge.
- **Not a reason to drop capability.** If a step would lose the batch table,
  multi-parent, history or recovery, the step is wrong.

---

## 8. Open questions for you

1. **One URL or two?** If COEP turns out to be safe, `/wizard/suno` could become a
   redirect with a preset — one page, one thing to maintain. Worth deciding
   whether SUNO keeps a distinct URL for marketing reasons regardless.
2. **Does batch stay?** Two batch implementations exist and neither is obviously
   the survivor. The wizard's is more capable; SUNO's is friendlier. My inclination
   is the wizard's table with SUNO's presentation, but it is real work.
3. **Video and documents** — leave as pass-through for now, or is there a
   compression story you want there too?

---

## 9. Rough shape of the effort

- COEP test: half a day, and it gates everything.
- Panel extraction: the bulk, but low-risk and incremental.
- Handler interface + audio/image: moderate.
- SUNO reduced to a preset: small once the above lands.
- Batch reconciliation: the largest single unknown — worth deciding (2) early.

The honest summary: **most of this is deletion.** The capability already exists;
it exists twice, in two shapes, and that is the actual problem to solve.
