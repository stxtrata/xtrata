# Four UX updates — findings and plan

Each item checked against the code first. One is already built (but worth
upgrading for a reason we hit earlier in this project), one needs a small piece
of plumbing that does not exist yet, and two are straightforward.

---

## 1. "Stop this job & refund me" — the are-you-sure check

**Already there, on both surfaces.**

- `suno.html:747` — `confirm('Stop this job and return everything? …')`
- `index.html:1827` — the same guard on `act('cancel', …)`

Both spell out what happens: the upload halts at the next safe point, chunks
already on-chain stay unsealed and cost nothing more, and the whole remaining
deposit plus any escrowed parent goes back to the paying wallet.

**So why it is still worth changing.** It uses `window.confirm`, and this project
has already been bitten by exactly that. The BNS name chooser used `window.prompt`
after an `await`, which Chrome suppressed and an extension wallet dismissed — the
"popped up then disappeared" bug. A native dialog can be suppressed by the browser
("prevent this page from creating additional dialogs"), is dismissed by a stray
Escape, and cannot be styled or explained properly.

For a destructive, money-shaped action that is the wrong tool.

**Plan:** replace both with the same in-page dialog pattern already used for the
BNS chooser (`askForBnsName` in `src/home/main.js`) — an overlay that cannot be
suppressed, with the consequences written out, an explicit **Stop and refund** as
the affirmative and **Keep going** as the default focus. Reuse the markup and CSS
that already exist rather than inventing a third dialog style.

Failure mode to preserve: if the dialog cannot be shown for any reason, the job
must **keep running**. Never cancel on an unanswered question.

---

## 2. Stop sending people to My Xtrata when they connect

**Found it:** `src/home/main.js:9430-9442`, inside `connectWallet()`.

```js
if (PAGE_MODE === 'home' && state.walletSession.isConnected && …) {
  const holdingCount = …;
  if (holdingCount > 0) {
    appendLog('Opening My Wallet with your inscriptions…');
    window.history.pushState(null, '', '/my-wallet');
    void switchToPage('my-wallet');
    return;
  }
}
```

Connecting a wallet is not a navigation request. Worse, it is *conditional on
what you own* — so the same button behaves differently for different people,
which is exactly the kind of thing that makes an interface feel unpredictable.

**Plan:** delete the block. Connect the wallet, update the header, stay put. Two
details worth getting right:

- That `return` currently **skips** the code after it. Check what is being skipped
  before removing it, or the removal changes more than intended.
- Keep `loadWalletInscriptions()` running so My Xtrata is populated when the user
  chooses to go there themselves.

Worth a look at the same time: `disconnectWallet()` and any other `switchToPage`
triggered by wallet state, so the rule is consistent — wallet events change wallet
UI, never the page.

---

## 3. Nothing on the SUNO page should navigate away

**Audit of every link on the page:**

| Link | Where | Today |
|---|---|---|
| "Inscription Wizard" | footer | `href="./"` — **navigates away** |
| "Build it in the main wizard →" | rejected-file hint | `href="./"` — **navigates away** |
| "open wizard History" | recovery notices (×2) | `href="/wizard/"` — **navigates away** |
| inscription links | results | already `target="_blank"` ✓ |
| player link | results | already `target="_blank"` ✓ |
| `href="#"` + `onclick` | retry / log / recover | fine — they `return false` |

**Plan:** add `target="_blank" rel="noopener"` to the four that navigate. Note the
recovery ones are built in JS strings, so they need editing in the template
literals rather than the markup.

The `beforeunload` guard added yesterday already catches a genuine mid-job exit,
but it only raises the browser's generic prompt — better not to offer the exit at
all. Belt and braces: both.

While there, add a test asserting **every** `<a href>` on the page that is not a
`#` handler carries `target="_blank"`, so a future link cannot quietly reintroduce
this.

---

## 4. Receipts should come from the SUNO Wizard, not "Agent One"

**The blocker: the receipt cannot currently tell where the job came from.**

`suno.html` already sends `suno: true` in the job payload — but `createJob()`
destructures a fixed list of fields and `suno` is not among them, so it is dropped
on the floor. The job record has no idea which surface created it.

There is also a dead slot: `receiptData()` at `agent-core.ts:640` reads
`job.sunoPlayer` (title, artist, hasCover, playerBytes) and **nothing ever sets
it**, so every receipt renders that section empty.

**Current branding**, in both the single and batch receipt templates:

- `<title>Xtrata Agent One — Receipt …</title>` (`:651`, `:1256`)
- `<div class="logo"><b>XTRATA</b> <i>Agent One</i></div>` (`:663`, `:1268`)
- `Issued by — Agent One · identity #…` (`:675`, `:1276`)

**Plan, in order:**

1. **Thread the origin through.** Accept `origin` (or `surface`) in `createJob` and
   `createBatchJob`, store it on the job, default `'wizard'`. SUNO sends
   `origin: 'suno'`. This is the piece that makes everything else possible, and it
   is three lines.
2. **Brand the receipt from it.** A small lookup rather than conditionals scattered
   through the template:
   ```
   wizard → "Xtrata Inscription Wizard"
   suno   → "SUNO More"        (the name users actually saw)
   ```
   Applied to `<title>`, the logo block and "Issued by". Keep `XTRATA` as the
   constant mark; the sub-brand is what changes.
3. **Drop "Agent One" from user-facing text generally.** It is an internal name for
   the engine. Worth a sweep of the two wizard pages for the same leak — the SUNO
   header still reads `XTRATA Inscription Wizard · SUNO More`, which is fine, but
   the build-handshake error message mentions "agent bundle", which a user should
   never see in those terms.
4. **Either wire `sunoPlayer` or remove it.** Since the SUNO flow already has
   `title`, `artist`, `hasCover` and `playerBytes` from the build, populating it
   makes the receipt genuinely better — "SUNO More · *Night Drive* by Jim · 6.4 MB
   player" reads like a receipt for a song rather than for a file. If that is not
   wanted, delete the dead reference so the next person does not wonder why it is
   always empty.

**Not renaming internally.** `agent-core.ts`, `XtrataAgent`, `AGENT_BUILD` and the
`[xao]` log prefix stay as they are — this is a user-facing brand change, and
renaming the engine would churn a lot of code and every log line for no user
benefit.

---

## Suggested order

1. **#2 auto-navigation** — smallest, and the most immediately annoying.
2. **#3 SUNO links** — small, and it protects a running job.
3. **#4 receipts** — needs the `origin` plumbing first; the rest follows easily.
4. **#1 cancel dialog** — largest of the four, because it means porting the
   overlay to both pages. Lowest urgency since a guard already exists; it is the
   robustness of the guard that improves, not its presence.

All four are independent, so they can land as separate commits.
