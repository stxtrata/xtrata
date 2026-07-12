# Inscribe Panel — Collapsed Binary Choice + Streamlined Text + Auto-Prepare (plan)

Refine the on-site `/inscribe` panel so it opens **collapsed to a single binary choice —
Inscribe a file / Inscribe text — and reveals only what the chosen path needs**. The text
path becomes ultra-minimal (input → live cost → one inscribe button, capped at **1 KB**),
and file prep happens **automatically on load** (no Prepare click). Front-end only
(`index.html`, `src/home/styles/home.css`, `src/home/main.js`); the single-tx inscribe
logic is unchanged.

## Review of the current panel (what's there today)

The File/Text tab split already shipped: two always-visible tabs (File active by default),
`#fileFields` (dropzone + name), `#textFields` (textarea + live char/byte + debounced
auto-cost), and shared **Advanced / Relationships / preview + mint-plan meta / actions /
Begin·Upload·Seal steps** below. Files already auto-prepare on drop (`setSelectedFile()` →
`autoPrepareHook()`), and text auto-quotes the live `quote-single-tx-fee`.

Gaps vs. your ask:
- It **defaults straight into file mode** — no collapsed "pick one" landing.
- The **text path still shows the full machinery** (name, Advanced, Relationships, the full
  FILE/NAME/SIZE/TYPE/CHUNKS/HASH mint-plan meta, the 3-step indicators, the Prepare
  button) — not "super simple."
- **No 1 KB cap** on text.
- The **Prepare button is still shown** even though files already auto-prepare.

## Target UX

- **Landing (mode = `none`):** the panel shows only the wallet row + two large choice cards
  ("📄 Inscribe a file", "✍️ Inscribe text"). Everything else hidden.
- **Choose File:** reveal the file path — dropzone (auto-prepares on load), name, Advanced,
  Relationships, preview + mint-plan meta, **Start inscription**, steps. No Prepare button.
- **Choose Text:** reveal a minimal card — big textarea, live **`N characters · M bytes`**,
  a compact **cost line** (`≈ 0.00X STX · ~$Y`), and one **Inscribe text** button. Nothing
  else. Hard **1 KB** cap.
- A small **"← Change"** control returns to the two choices.

## Design — safe, monolith-aware (no logic changes to the inscribe flow)

`main.js` is the ~9,700-line monolith flagged as regression-prone, so: **no element is
removed and no inscribe logic is touched — we only add a mode and toggle visibility.**

1. **Scope hook.** Add `id="inscribePanelBody"` to the inscribe panel's `.panel-body`
   (`index.html:213`) — there are three `.panel-body` blocks, so we scope to this one.
2. **Three-state mode.** `state.inscribeMode ∈ { none, file, text }`, default `none`. Move
   the `data-mode` attribute off `#inscriptionForm` onto `#inscribePanelBody` so CSS can gate
   the shared elements that live *outside* the form (`.prepare-grid`, `.actions`, `.steps`).
3. **CSS visibility matrix** (elements stay in the DOM; only `display` changes, so every
   existing `dom.*` ref keeps working and the file flow is untouched):

   | Element | none | file | text |
   |---|---|---|---|
   | `.inscribe-tabs` (the choice) | show (as cards) | show (compact) | show (compact) |
   | `#fileFields` (dropzone+name) | hide | show | hide |
   | `#textFields` (textarea+cost+btn) | hide | hide | show |
   | `#inscribeAdvancedDetails` | hide | show | hide |
   | `#relationshipsDetails` | hide | show | hide |
   | `.inscribe-wizard-note` | hide | show | hide |
   | `.prepare-grid` (preview + full meta) | hide | show | hide |
   | `.actions` → `#prepareButton` | hide | **hide** | hide |
   | `.actions` → `#inscribeButton` (Start) | hide | show | hide |
   | `.steps` (Begin·Upload·Seal) | hide | show | hide |

   Text mode's cost + button live *inside* `#textFields` (new `#textCost`,
   `#inscribeTextButton`), so the shared meta/actions/steps stay hidden for the simple path.
4. **`setInscribeMode(mode)`** (extends the existing two-state helper): set
   `#inscribePanelBody.dataset.mode`, toggle tab active/`aria-selected`, clear the *other*
   source (→text clears the file, →file clears the draft, →none clears both + resets steps),
   focus the textarea on `text`.
5. **Choice styling:** in `none`, render `.inscribe-tabs` as two tall cards; once a mode is
   picked, they collapse to the slim tab row already styled, with a "Change" affordance
   (either a third small button or making the inactive tab the way back).

## The three behaviours you asked for

**A. File auto-prepare (mostly already done).** `setSelectedFile()` already schedules
`autoPrepareHook()` on drop/pick — prepare is automatic today. Plan: **hide the Prepare
button** in file mode so the flow is purely *drop → prepared → Start inscription*, and add a
guard so a file selected while `mode==='none'` first flips to `file` then prepares. Keep the
Prepare handler wired (hidden) as a safety fallback.

**B. Streamlined text (input → cost → inscribe).** Reuse the debounced auto-prepare already
added (it quotes `quote-single-tx-fee` live); render the result into the compact `#textCost`
instead of the big shared meta, and wire `#inscribeTextButton` to the **existing**
`runInscription()` (same single-tx path — no new inscribe logic). Default type `text/plain`
(no type selector in the simple view — see decision).

**C. 1 KB cap on text.** On text input, compute UTF-8 bytes; if `> 1024`:
   - show "Text inscriptions are capped at 1 KB — N bytes over",
   - disable `#inscribeTextButton`, and **skip** auto-prepare (no wasted quotes);
   - enforce again in the inscribe handler (hard guard) so it can't be bypassed.
   1 KB is a **product cap**, not a chain limit — single-tx allows 32 × 16384 = 512 KB, so
   1 KB is always a single chunk (cheapest, one transaction). Keeps text tiny and instant.

## Safety / non-regression

- `resolvePayloadFile` / `preparePayload` / `runInscription` **unchanged** — they already
  handle both sources; text just calls the same inscribe.
- Nothing removed from the DOM → all `dom.*` refs stay valid; the file flow is byte-for-byte
  the same, only its container's visibility is mode-gated.
- Other page modes (explorer, wallet, batch) and the other two `.panel-body` blocks are
  untouched (scoped via `#inscribePanelBody`).
- `updateControls` / `renderPreparedState` already tolerate "nothing selected", so `none`
  is a safe initial state.

## Edge cases

- **Restored unfinished inscription** (your screenshot shows one): a restored payload is a
  file, so at boot, if a restore/active job exists, open directly in **file** mode (not
  `none`) so the restored state is visible; otherwise land on `none`.
- **File dropped while on `none`/text:** auto-switch to `file`, then the existing auto-prepare
  runs.
- **Paste > 1 KB into text:** blocked in UI + handler; counter turns into the over-limit
  warning.
- **Switch away mid-prepare:** existing `markPreparedDirty()` + source-clear keep state clean.
- **Wallet not connected:** unchanged — inscribe prompts connect as today.

## Decisions to confirm (sensible defaults chosen)

- **Text type selector:** default **text/plain only** in the simple view (JSON/HTML/SVG stay
  a File-mode/Advanced concern). Easy to add a compact toggle later if you want it.
- **"Change" affordance:** a small "← Change" link above the revealed path (recommended) vs.
  clicking the other tab. Either is trivial.
- **Prepare button:** **removed from file mode** (hidden, logic kept) — confirm you're happy
  losing the manual button entirely.

## Verification plan

- **Node logic harness:** `setInscribeMode` transitions (none↔file↔text) set the right
  `data-mode` + clear the other source; the 1 KB guard disables inscribe at 1025 bytes and
  allows 1024; UTF-8 byte count correct.
- HTML balance + all new IDs present once; `main.js` parses (esbuild), `home.css` sane.
- **Manual (dev, `npm run dev`):** fresh load shows only the two choices → pick Text → only
  textarea+cost+button → type > 1 KB → blocked → pick File → drop a file → auto-prepared →
  Start → "Change" returns to choices. Confirm the file flow is otherwise unchanged.
- **Build note:** the main app bundles `main.js`/`home.css` via `npm run build` for
  production (dev serves source live).

## Step-by-step checklist

1. `index.html`: add `id="inscribePanelBody"` + `data-mode="none"` to the inscribe
   `.panel-body`; move `data-mode` off the form; add `#textCost` + `#inscribeTextButton`
   inside `#textFields`; add the "← Change" control; make the tabs the binary choice.
2. `home.css`: choice-card styling for `none`; the none/file/text visibility matrix scoped
   to `#inscribePanelBody[data-mode=…]`.
3. `main.js`: 3-state `setInscribeMode`; init to `none` (or `file` if a restore/active job);
   wire `#inscribeTextButton` → `runInscription`; render cost into `#textCost`; 1 KB guard in
   the text input + inscribe handler; hide the Prepare button; keep file auto-prepare (+
   auto-switch to file on drop from `none`).
4. Verify (harness + manual + build note).

## Out of scope

- Batch panel, the Inscription Wizard, and payload-type UX for text (text/plain default).
- No change to fees, chunking, or the single-tx contract path.

---
*Scope: `index.html` + `src/home/styles/home.css` + `src/home/main.js`. Additive UI/mode
gating only — the single-transaction inscribe logic (`resolvePayloadFile` / `preparePayload`
/ `runInscription`) is untouched. 1 KB is a product cap; file prepare is already automatic
and just needs its button removed.*
