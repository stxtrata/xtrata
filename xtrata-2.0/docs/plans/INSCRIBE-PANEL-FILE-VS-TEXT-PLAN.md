# Inscribe Panel — File vs Text Tabs (corrected plan)

Split the **embedded on-site inscription panel** (the `/inscribe` page) into two tabs —
**Inscribe a file** and **Inscribe text** — and give the text tab a fast, friendly UX:
paste → instant cost → inscribe. Text rides the existing **single-transaction** path
(genuinely one txn, no deposit/escrow), so there is no Wizard involved.

> Correction: an earlier draft (`xtrata-agent-one/TEXT-INSCRIBE-PLAN.md`) mistakenly
> targeted the Inscription Wizard. That work was reverted. This is the right surface:
> the embedded panel in root `index.html` (§202–336), logic in `src/home/main.js`.

## Key discovery — text already works, it's just buried

The panel already inscribes text through the single-tx path; the split is ~90% surfacing
an existing capability plus one small UX addition (auto-cost on typing). Grounding
(line refs are point-in-time, verify before editing):

- **`resolvePayloadFile()`** (`main.js:4277`) already falls back to text when no file is
  selected: `new File([dom.textPayload.value], inferTextFileName(mime), { type: mime })`.
  Empty text throws `Select a file or enter a text payload.`
- **`preparePayload()`** (`main.js:4389`) chunks the bytes and quotes the **real** cost via
  `state.client.quoteSingleTxFee(bytes, chunks, sender)` → `state.prepared.singleTxFeeMicroStx`
  (`main.js:4451`), gated on `chunks.length <= SMALL_MINT_HELPER_MAX_CHUNKS`. That figure is
  rendered into `#preparedMeta` through `formatMicroStxWithUsd(...)` (`main.js:4139`).
- **Files already auto-prepare for instant cost**: `setSelectedFile()` schedules
  `autoPrepareHook()` on drop/pick (`main.js:9207-9215`) — "drop → cost shows, only decision
  left is Start inscription."
- **Text does NOT auto-prepare** — the one real gap. Typing in `#textPayload` only calls
  `markPreparedDirty()` (`main.js:10034`), so the user must click **Prepare** to see a cost.
- **Mutual exclusion already exists**: typing text while a file is selected clears the file
  (`main.js:10031-10033`); `resolvePayloadFile` prioritises `state.selectedFile`.

Net: `resolvePayloadFile` / `preparePayload` / `runInscription` **do not need to change** —
they already handle both sources on the single-tx path. We add a tab UI and make text
auto-quote the way files already do.

## Design — two tabs inside the existing panel

Add a tab bar at the top of the `#inscriptionForm` panel; a `state.inscribeMode`
(`'file' | 'text'`) drives which field group is visible (mirrors the site's existing
data-attribute gating pattern).

- **📄 Inscribe a file** — the existing `#dropzone` + `#nameInput`. Unchanged behaviour.
- **✍️ Inscribe text** — promote `#textPayload` out of the `#textPayloadDetails`
  `<details>` into a first-class group (`#textFields`): a big paste box, a live
  **`characters · bytes · ~cost`** line, and one **Inscribe** button. Default type
  `text/plain`; keep a compact Text/JSON/HTML/SVG toggle (reuses `#payloadType`) since
  it's cheap and changes the on-chain mime.
- **Shared below both tabs** (unchanged): Advanced (Token URI), Relationships (parents),
  payload preview, steps, and the Prepare/Inscribe/Reset/Clear actions.

Markup groups: wrap the file bits in `#fileFields`, the text bits in `#textFields`; CSS
hides the inactive group by `data-mode`.

## The streamlined text UX (paste → instant cost)

Add a **debounced (~500 ms) auto-prepare** on `#textPayload` input *when in text mode* —
the text-mode analogue of the file auto-prepare at `main.js:9207`:

```
textPayload.input → (debounce 500ms) → if text.length>0 && !busy → autoPrepareHook()
```

`autoPrepareHook` → `preparePayload()` already runs `quoteSingleTxFee` + the duplicate
check, so the live cost falls out for free; render `state.prepared.singleTxFeeMicroStx`
inline in the text tab via the existing `formatMicroStxWithUsd`. Debounce keeps us from
hammering `quoteSingleTxFee` / `getIdByHash` (both read-only chain calls) on every
keystroke. The text tab's **Inscribe** button just calls the existing `runInscription()`.

## Safety (monolith-aware)

Per the project note that `main.js` (~9,700 lines) must not be fragmented and its shared
state/DOM scope is regression-prone:

- **No file split, no logic refactor.** Keep `resolvePayloadFile` / `preparePayload` /
  `runInscription` exactly as-is.
- **Additive only**: a `state.inscribeMode` field, a `setInscribeMode(mode)` that toggles
  the field groups and clears the *other* source (→text clears `selectedFile` via the
  existing `setSelectedFile(null)`; →file clears `textPayload.value`) then
  `markPreparedDirty()`. This builds directly on the existing mutual-exclusion at
  `main.js:10031`.
- Reuse existing helpers only: `setSelectedFile`, `markPreparedDirty`, `autoPrepareHook`,
  `renderPreparedState`, `formatMicroStxWithUsd`, `formatBytes`.
- Markup → root `index.html` (inside the panel). CSS → `src/home/styles/home.css` under the
  existing `:root[data-page='inscribe']` block. Wiring → appended beside the current
  file/text listeners (`main.js:~10002-10041`). No page-router change (`/inscribe` already
  routes and the panel already shows; tabs live inside it).

## Edge cases

- **Empty / whitespace text** → Inscribe stays disabled; `resolvePayloadFile` already
  guards, and the tab won't auto-prepare until `length>0`.
- **Large text** beyond `SMALL_MINT_HELPER_MAX_CHUNKS` → `preparePayload` leaves
  `singleTxFeeMicroStx=null` and falls back to the staged quote; the text tab should then
  show "large — staged in N transactions" instead of a single flat fee. (Text is normally
  tiny, so single-tx is the common path.)
- **Switch tabs mid-prepare** → `setInscribeMode` clears the other source + marks dirty; no
  cross-contamination between file and text.
- **Duplicate hash** (identical text already inscribed) → existing `#duplicateWarning` +
  "Continue anyway" checkbox still apply.
- **Type toggle** → JSON/HTML/SVG change the `File` mime in `resolvePayloadFile` (already
  wired through `dom.payloadType`).

## Verification plan

- Build the home bundle from the sandbox using the established recipe (rsync repo →
  `/tmp/xbuild`, warm npm cache; **never** build in-place — repo `node_modules` are macOS
  binaries). This change touches `index.html` + `home.css` + `main.js`, so rebuild + run
  `npx vitest run` (713 tests must stay green — inscribe logic is unchanged).
- **Node harness** (no jsdom needed): unit-test `setInscribeMode()` (visibility + source
  clearing) and the debounced text auto-prepare against a stubbed `dom`/`state`, asserting
  `quoteSingleTxFee` is called once after debounce and the cost renders — same style as the
  harness used previously.
- **Manual on `/inscribe`**: switch to Text → paste → confirm the live `chars · bytes · ~cost`
  updates *without* clicking Prepare → Inscribe runs the single-tx flow. Then switch to File
  and confirm the drop flow is byte-for-byte unchanged.

## Step-by-step checklist

1. `index.html`: add the tab bar inside the panel; wrap file bits in `#fileFields`, move
   `#textPayload` into a first-class `#textFields` group (out of `#textPayloadDetails`);
   add the text tab's live-cost line + Inscribe button.
2. `home.css`: `.inscribe-tabs` + active state; `[data-mode='file'] #textFields{display:none}`
   and `[data-mode='text'] #fileFields{display:none}` under the inscribe-page block.
3. `main.js`: `state.inscribeMode`, `setInscribeMode()`, tab click handlers, debounced
   text auto-prepare, inline text cost render, and the text-tab button label — all additive,
   reusing existing functions.
4. Verify (build + vitest + harness + manual walkthrough).

## Out of scope (easy follow-ups)

- Batch text, Markdown/HTML live rendered preview in the text tab, draft persistence.
- Any change to the Wizard (it keeps its own file-oriented deposit/escrow flow).

---
*Scope: `index.html` (panel markup) + `src/home/styles/home.css` (tab styles) +
`src/home/main.js` (mode toggle, text auto-cost, wiring). No contract/svc/agent changes;
text uses the existing single-transaction inscribe path.*
