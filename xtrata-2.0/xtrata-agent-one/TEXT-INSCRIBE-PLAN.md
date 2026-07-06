# Text Inscribe — Two-Tab Wizard Split Design Plan

Split the Inscription Wizard's single inscription panel into two tabs — **Inscribe a file**
(today's dropzone flow, untouched) and **Inscribe text** (new) — and give the text tab a
deliberately tiny, friendly UI: paste → instant cost → one button. The whole thing is a
pure front-end change to `xtrata-agent-one/wizard/index.html`; **no agent-core, svc, or
contract changes are required.**

## Why this is low-risk (the key insight)

The wizard is backendless: every `/api/*` call routes to `window.XtrataAgent` via the
`api()` shim (`index.html:364`). Two facts make text a first-class citizen for free:

- **Cost estimation is byte-count only.** `A.estimate({ bytes, marginUstx, parentCount })`
  (`src/agent-one/agent-core.ts:218`) takes a raw byte count — it never inspects the file.
  For text, `new Blob([text]).size` is the exact UTF‑8 byte length that will go on-chain.
- **`createJob` already accepts any Blob/File.** It does `new Uint8Array(await file.arrayBuffer())`
  and reads `file.name` (`agent-core.ts:454`). The core comment even notes *"conversion
  happens in the UI BEFORE createJob (the File passed in is already the final bytes)"*
  (`agent-core.ts:160`). So `new File([text], 'note.txt', {type:'text/plain'})` flows
  through the **identical** estimate → job → escrow → inscribe → receipt pipeline.

So the text tab reuses the entire money/chain path. The only net-new code is a textarea,
a live counter, and a thin wrapper that turns a string into a `File`.

## Safety principle: isolate new state, reuse shared pipeline

Per the project's standing guidance (don't fragment the monolith's shared state/DOM scope),
we **do not split `index.html` into files** and we **do not touch `FLOW` or `BATCH`**. The
text tab gets its own small state object and its own estimate/inscribe functions, then
funnels into the *shared* job renderer that both flows already use.

```
                 ┌─ Tab: Inscribe a file ─┐   FLOW state  (unchanged)
  Tab bar  ──────┤                         ├──┐
                 └─ Tab: Inscribe text ────┘   TEXT state  (new, isolated)
                                               │
                     both create a job ────────┼──▶  createJob()  (shared)
                                               │
                        startJobsPoll() + jobsTick() + #activeJobDetail  (shared render)
```

What stays **100% untouched**: `#dropzone`, `onFile()`, `renderPreview()`, `quote()`,
`#reviewCard`, all of BATCH mode, `#inscribeBtn`, the graph composer, history, the job
poller, and every agent-core/svc/contract file. A regression in the file flow is therefore
structurally impossible from this change — the file flow's code is not edited, only wrapped
in a container `<div>`.

## DOM changes (index.html only)

**1. Add a tab bar** directly under the `<header>`, above the stepper (~line 127):

```html
<div class="tabs" role="tablist">
  <button class="tab on" id="tabFile" role="tab" aria-selected="true">📄 Inscribe a file</button>
  <button class="tab"    id="tabText" role="tab" aria-selected="false">✍️ Inscribe text</button>
</div>
```

**2. Wrap the existing flow** (stepper + dropzone + `#reviewCard` + `#batchCard`) in a
container — no inner edits, just an opening/closing tag:

```html
<div id="panelFile">   … existing markup, verbatim …   </div>
```

**3. Add the new text panel** as a sibling, hidden by default:

```html
<div id="panelText" hidden>
  <section class="card">
    <h3>Inscribe text</h3>
    <div class="hint">Paste anything — a note, a poem, JSON, a manifesto. It goes on-chain byte-for-byte.</div>
    <textarea id="txtBody" rows="10" placeholder="Paste or type your text here…"
              style="min-height:200px;resize:vertical;font-family:var(--mono)"></textarea>
    <div class="quote-summary">
      <span class="lbl"><span id="txtCount" class="mono">0 characters · 0 bytes</span></span>
      <span class="big-num" id="txtQuoteTotal">—</span>
    </div>
    <div class="btnrow">
      <button class="btn big" id="txtInscribeBtn" disabled>Inscribe</button>
    </div>
    <div class="muted" style="font-size:11.5px;margin-top:6px">
      ⚡ Pay from your connected wallet — the inscription + any change return to it automatically.
    </div>
    <div class="err" id="txtErr"></div>
  </section>
</div>
```

**Both `#activeJobDetail` and `#historySection` stay outside both panels** (shared), so the
payment card and history work identically regardless of which tab created the job.

**4. Minimal CSS** (append to the existing `<style>` — reuses all existing tokens):

```css
.tabs{display:flex;gap:6px;max-width:760px;margin:0 auto 4px;padding:0 22px}
.tab{flex:1;padding:11px 14px;border:1px solid var(--line);border-bottom:0;
     border-radius:12px 12px 0 0;background:var(--panel2);color:var(--mut);
     font-weight:700;font-size:13.5px;cursor:pointer}
.tab.on{background:var(--panel);color:var(--ink);border-color:var(--line)}
```

## Behaviour (new JS, ~40 lines, all additive)

**Tab switching** — pure show/hide, guarded so it never disturbs an active job:

```js
function showTab(which){
  const file = which==='file';
  $('#tabFile').classList.toggle('on', file);
  $('#tabText').classList.toggle('on', !file);
  $('#tabFile').setAttribute('aria-selected', file);
  $('#tabText').setAttribute('aria-selected', !file);
  $('#panelFile').hidden = !file;
  $('#panelText').hidden = file;
  $('#stepper').hidden   = !file;   // stepper is file-flow copy; text flow is simpler
}
$('#tabFile').onclick = ()=>showTab('file');
$('#tabText').onclick = ()=>showTab('text');
```

**Isolated text state + live estimate** (debounced, mirrors `quote()` but byte-only):

```js
const TEXT = { bytes:0, quote:null, quoteRun:0 };
const txtEnc = new TextEncoder();

function txtEstimate(){
  const s = $('#txtBody').value;
  const bytes = txtEnc.encode(s).length;             // exact UTF-8 on-chain size
  TEXT.bytes = bytes;
  $('#txtCount').textContent = `${s.length.toLocaleString()} characters · ${bytes.toLocaleString()} bytes`;
  if(!bytes){ $('#txtQuoteTotal').textContent='—'; $('#txtInscribeBtn').disabled=true; TEXT.quote=null; return; }
  const run = ++TEXT.quoteRun;
  $('#txtQuoteTotal').textContent='…'; $('#txtInscribeBtn').disabled=true;
  api('/api/estimate',{method:'POST',body:{bytes,marginUstx:'0',parentCount:0}})
    .then(e=>{ if(run!==TEXT.quoteRun) return;
      TEXT.quote=e;
      const usd = e.stxUsd ? ` (~$${(Number(e.requiredUstx)/1e6*e.stxUsd).toFixed(2)})` : '';
      $('#txtQuoteTotal').textContent = stx(e.requiredUstx)+usd;
      $('#txtInscribeBtn').disabled=false;
      $('#txtInscribeBtn').textContent = `Inscribe — pay ${stx(e.requiredUstx)}`;
    }).catch(err=>{ if(run===TEXT.quoteRun){ $('#txtQuoteTotal').textContent='—';
      $('#txtErr').textContent=err.message; } });
}
let txtTimer=null;
$('#txtBody').addEventListener('input',()=>{ $('#txtErr').textContent='';
  clearTimeout(txtTimer); txtTimer=setTimeout(txtEstimate,250); });
```

**Inscribe** — build a `File` from the string, reuse the exact `createJob` payload shape
from `#inscribeBtn` (`index.html:1043`), then hand off to the shared poller:

```js
$('#txtInscribeBtn').onclick = async ()=>{
  const err=$('#txtErr'); err.textContent='';
  const s=$('#txtBody').value;
  if(!s.trim()){ err.textContent='Type or paste some text first.'; return; }
  if(!WALLET){ const a=await connectWallet();
    if(!a){ err.textContent='Connect your wallet to inscribe — it receives the inscription + change.'; return; } }
  $('#txtInscribeBtn').disabled=true;
  try{
    const stamp=new Date().toISOString().slice(0,16).replace(/[-:T]/g,'');
    const file=new File([s], `text-${stamp}.txt`, {type:'text/plain'});
    const payload={ file, uri:`xtrata:text/note-${stamp}`, mime:'text/plain',
      deps:[], parents:[], marginUstx:'0', fastTrack:true,
      user:WALLET, expectedFunder:WALLET };
    const {job}=await api('/api/jobs',{method:'POST',body:payload});
    TEXT.jobId=job.jobId;
    startJobsPoll(); jobsTick();
    if(!SERVER.mock) openWallet(job.depositAddress, job.requiredUstx);
    setTimeout(()=>{ const el=$('#activeJobDetail'); if(el&&el.firstChild)
      el.scrollIntoView({behavior:'smooth',block:'start'}); },250);
  }catch(e){ err.textContent=e.message; $('#txtInscribeBtn').disabled=false; }
};
```

That's the whole feature. From here the shared `#activeJobDetail` card renders the deposit
address, payment, progress, receipt, and "Inscribe another" exactly as it does for files.

## Defaults chosen for the ultra-minimal tab

| Field | File tab | Text tab (auto) |
|---|---|---|
| filename | dropped name | `text-<UTCstamp>.txt` |
| mime | detected | `text/plain` (always) |
| content URI | `xtrata:<cat>/<slug>` | `xtrata:text/note-<UTCstamp>` |
| delivery | manual toggle | fast-track to connected wallet |
| parents / deps / margin | exposed | none (empty / 0) |

No category picker, no options accordion, no preview pane — the textarea *is* the preview.
(Format toggle for Markdown/HTML and a title field were explicitly deferred; see Out of scope.)

## Edge cases & guards

- **Empty / whitespace-only** → button stays disabled; the handler double-checks `.trim()`.
  (agent-core also treats an empty file as a fatal `empty file`, so we never reach it.)
- **Very large paste** → `estimate` already returns `single` vs `staged (N batches)`; the
  quote stays correct either way. Optional friendly touch: if `!e.single`, show a one-line
  note "Large text — inscribed in N staged batches." No blocking needed.
- **Tab switch mid-job** → `showTab()` only toggles `hidden`; the poller and `#activeJobDetail`
  live outside both panels, so a running job keeps rendering. Switching tabs never cancels.
- **Wallet not connected** → same lazy `connectWallet()` prompt as the file flow.
- **"Inscribe another"** → today's job card calls `resetFlow()` (file tab). Minor polish:
  track `activeOrigin='text'` and, when set, reset the textarea + return to the text tab
  instead. Optional; not required for a correct first cut.
- **`?mock=1`** → works unchanged (routes through the same `api()` shim), so the whole text
  flow can be rehearsed offline before any real STX.

## Verification plan (before commit)

Build/test from the sandbox using the established recipe (repo `node_modules` are macOS
binaries — never build in-place):

1. `rsync` repo → `/tmp/xbuild` (exclude `node_modules`, `dist`, `.git`), then
   `npm install --prefer-offline --no-audit --no-fund` (warm the cache with one capped run,
   a second finishes in ~5s).
2. `npx vitest run` — confirm the 713 existing tests still pass (this change is UI-only, so
   they must be unaffected; that's the regression proof for the money path).
3. Build the wizard bundle order (agent-one-wallet → agent-one → radio → vite build →
   copy-static-apps) is **not** needed for this change — we only edit `wizard/index.html`,
   which ships as-is. Sanity-open it with `?mock=1`.
4. **Manual mock walkthrough** (`wizard/index.html?mock=1`): paste text → confirm the live
   `characters · bytes` counter and instant STX/USD quote update as you type → click
   Inscribe → confirm the shared job card drives the mock deposit → "Inscribed". Then flip
   to the file tab and drop a file to confirm the original flow is byte-for-byte unchanged.
5. `npm run lint` is expected to fail on a *fresh* install (environmental eslint-plugin
   version skew, not a code fault) — ignore, or lint against the repo's own `node_modules`.

## Step-by-step implementation checklist

1. Append the 4 CSS rules for `.tabs` / `.tab`.
2. Insert the tab bar above `#stepper`.
3. Wrap the existing stepper+dropzone+reviewCard+batchCard in `<div id="panelFile">…</div>`
   (no inner edits).
4. Add the `<div id="panelText" hidden>…</div>` panel markup.
5. Add `showTab()` + the two tab `onclick`s; call `showTab('file')` once on load.
6. Add `TEXT` state, `txtEstimate()` (debounced input), and the `#txtInscribeBtn` handler.
7. (Optional) `activeOrigin` tracking so "Inscribe another" returns to the text tab.
8. Verify per the plan above; commit `wizard/index.html` only.

## Out of scope (deferred, easy follow-ups)

- Markdown / HTML format toggle (would set `mime` to `text/markdown` or `text/html` — both
  already exist in `CONTENT.document`) and a live rendered preview.
- Optional title/URI field and parents/deps for text (full-parity mode).
- Batch/multi-note text. Emoji/byte-vs-char warnings for exotic Unicode.
- Persisting a draft across reloads.

---
*Scope of this change: `xtrata-agent-one/wizard/index.html` only. Est. ~15 lines HTML +
~5 lines CSS + ~40 lines JS. No agent-core, svc, contract, or build-config changes.*
