# SUNO as a tab on the main page

Goal: a **SUNO** tab beside **Wizard** in the top nav that shows the whole SUNO page in
the same panel area as everything else, instead of navigating away to `/wizard/suno`.

---

## 1. The headline: the two things that broke this before are already fixed

This has been attempted and abandoned. Both plausible causes are now gone, and neither
needs new work.

### The wallet problem is solved, and solved in the right place

Wallet extensions inject their providers into the **top window only**, and
`@stacks/connect` ships an Asigna shim that defines `window.AsignaProvider` inside
*every* iframe. Detecting on the iframe's own window therefore shows Asigna as the only
installed wallet and hides the real ones — that is the July 21 incident, and it is
almost certainly what broke this last time.

It was fixed by `getWalletHostWindow()` in [`src/lib/wallet/connect.ts:106`], which
resolves providers on the top same-origin window. Written up as
**WALLET-PLAYBOOK §5**.

The part that matters here: **`agent-one.js` imports that same module.**
`src/agent-one/agent-one-wallet.ts` pulls in `../lib/wallet/connect`, and SUNO loads
`agent-one.js`. So an embedded SUNO inherits the proven fix automatically — the same
one the embedded wizard has been running on all along.

### The cross-origin-isolation problem is already handled at runtime

SUNO uses the multithreaded ffmpeg core, which needs `SharedArrayBuffer`, which needs
COOP/COEP. That isolation is scoped to `/wizard/suno` in `public/_headers`, and the
home page does not have it.

But `suno-build.js` already checks at runtime:

```js
const isolated = () => typeof crossOriginIsolated !== 'undefined'
  && crossOriginIsolated && typeof SharedArrayBuffer !== 'undefined';
...
const f = iso ? await ffPersistent(onStatus) : await ffFresh(onStatus);
```

An iframe inside a non-isolated parent is not isolated, so the embedded tab
transparently uses the **single-threaded** core. Encoding is slower; nothing breaks.
That is the same core the main wizard has always used.

**Therefore: do not make the home page cross-origin isolated.** It buys a faster
encoder and risks the wallet flow across the entire site. The standalone
`/wizard/suno` keeps its isolation and stays the fast path.

---

## 2. The pattern already exists — copy it exactly

The wizard is *already* a tab rendering a full page in an iframe:

```html
<iframe id="wizardFrame" title="XTRATA Inscription Wizard"
        data-src="/wizard/?embedded=1" loading="lazy" allow="clipboard-write"></iframe>
```

- `src` is set lazily on first visit (`activateWizardFrame`), so other pages never
  download the wizard bundles.
- Visibility is pure CSS on `:root[data-page='wizard']`.
- The wizard detects embedding itself and hides its own header/footer:
  `if (window.self !== window.top || ?embedded) documentElement.dataset.embedded = '1'`.
- There is an **Open standalone ↗** escape hatch in the panel bar.

SUNO needs the same four things. It already has the embedded-detection CSS hooks?
**No — that is one of the small pieces of work** (§4).

Same-origin also means localStorage and IndexedDB are shared, so a job started in the
embedded SUNO is the same job the standalone page sees, and the unfinished-job
reminder works across both.

---

## 3. The one genuine risk, and it exists today

**A live job inside an iframe is not protected by the parent's leave guard.**

The home page's `beforeunload` ([`src/home/main.js:14001`]) guards only `state.busy` —
its own inscribe flow. It knows nothing about a job running inside `#wizardFrame`. The
iframe's own `beforeunload` does not reliably prompt when the *parent* navigates or
closes.

So today, someone can be 400 chunks into a funded job in the embedded wizard, click
another tab in the site nav, and lose the tab that was doing the work — with no
warning. Adding SUNO to the same panel doubles the surface for that.

**This must be fixed as part of this work, and it fixes the existing wizard too.**

A small postMessage contract:

- iframe → parent: `{ type: 'xtrata:job:live', live: true|false, detail }` whenever
  `keepOpenBanner()` changes state (it already computes exactly this).
- parent: keeps a `Set` of live embedded jobs; its `beforeunload` returns a warning if
  the set is non-empty, and switching to another *tab* keeps the iframe mounted (CSS
  hides it) so the work continues.

Note the second half: because tabs are CSS visibility over a persistent iframe, moving
to another tab does **not** kill the job. Only leaving the site does. That is the
behaviour to preserve and to warn about.

---

## 4. Work list

Small, and each step is independently shippable.

1. **Nav + route.** Add a `suno` entry to the page list in `index.html` (the
   `seg === 'drops'` chain), its title, and a nav link beside Wizard. Keep
   `/wizard/suno` working standalone.
2. **Panel + iframe.** A `.panel-suno` section mirroring `.panel-wizard`, with
   `data-src="/wizard/suno?embedded=1"`, lazy activation on first visit, and an
   **Open standalone ↗** link — which for SUNO genuinely matters, since standalone is
   the cross-origin-isolated, fast-encode path. Say so in the link's title text.
3. **Embedded mode in `suno.html`.** Copy the wizard's detection block and the
   `:root[data-embedded='1']` rules to hide its own header/footer.
4. **Stop the double radio.** `suno.html` loads `/xtrata-radio.js` unconditionally;
   `index.html` guards it behind `data-embedded !== '1'`. Without this the embedded tab
   gets a second radio player fighting the shell's.
5. **Suppress the unfinished-job banner when embedded.** It is `position: fixed`, so
   inside an iframe it pins to the iframe's viewport, and the parent already shows its
   own. One `dataset.embedded` check in `unfinishedBanner()`.
6. **The leave guard contract (§3).** Do this one even if the rest slips.
7. **Height.** `.panel-wizard iframe` is `calc(100vh - 220px)` with a `640px` floor and
   the page scrolls internally. SUNO is longer; either accept internal scrolling
   (simplest, consistent with the wizard) or add a postMessage height sync. Recommend
   accepting it first and looking at it with real content.

---

## 5. What to verify, and how

The failure modes here are precisely the ones a test suite does not catch, so this
needs a real browser on a static serve (`vite dev` silently breaks the agent bundle —
see CLAUDE.md).

- **Wallet chooser opens inside the embedded tab**, lists Xverse/Leather rather than
  Asigna, and connects. This is the regression that killed the last attempt — check it
  first, before anything else is polished.
- **A payment signs from the embedded tab** on desktop and mobile.
- **The encoder falls back**: confirm `crossOriginIsolated === false` in the embedded
  tab and that a song still builds (slower). Confirm it is `true` standalone.
- **A job survives a tab switch** — start one, switch to Explore, come back, still
  running.
- **The leave guard fires** when navigating away with a live embedded job.
- **No second radio**, no duplicated header, no fixed-position banner trapped in the
  iframe.

Add to the automated suite what can be held there: the parse/element/div guards in
`wizard-pages-parse.test.ts` already cover `suno.html`, and the embedded-mode markup and
radio guard are source assertions worth locking.

---

## 6. What this is not

- **Not a rewrite of SUNO.** It is the same page, in an iframe, with an embedded flag.
  That is what makes it safe: the standalone URL stays byte-identical in behaviour and
  remains the fallback if anything goes wrong.
- **Not the wizard unification** from `ONE-WIZARD-PLAN.md`. That plan still stands and
  this does not block it — if SUNO later becomes a preset of one shared flow, the tab
  stays and only its `data-src` changes.
- **Not a reason to touch `_headers`.** The isolation scoping stays exactly as it is.

---

## 7. Effort

Steps 1–5 are a few hours and mostly copying the wizard's existing pattern. Step 6 is
the only real design work, and it pays for itself by closing a hole that is already
live. Step 7 is a judgement call best made against real content.

The honest summary: **this is much lower risk than it was**, because the thing that
broke it last time was fixed for a different reason and the encoder already degrades
gracefully. The part to be careful about is not SUNO — it is that embedding a
money-handling flow behind a CSS-hidden tab makes it easy to walk away from a running
job, and that is worth fixing before adding a second way to do it.
