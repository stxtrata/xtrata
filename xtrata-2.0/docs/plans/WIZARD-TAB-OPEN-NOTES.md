# Why the tab has to stay open, and what now protects you when it doesn't

Notes for anyone picking this up later — including future me. Plain language
first, mechanics second.

---

## The short version

The Wizard creates a **brand new, empty wallet inside your browser** for each job.
You send it exactly the quoted amount. It spends that money inscribing your file,
sends you the finished inscription plus the change, and then its key is destroyed.
A paper cup, not a bank account.

**Your payment does not go to Xtrata.** It goes to that temporary wallet, and the
only thing in the world that can spend from it is the open tab. Inscribing a 5 MB
song is fifteen-plus separate signatures over five to fifteen minutes — upload a
batch, wait for it to confirm, upload the next, seal, deliver, refund. Every one
of those has to be signed by that wallet. Close the tab and there is nobody left
to sign step four.

That buys something real: **at no point does Xtrata, or anyone else, hold the key
to your money.** The cost is that you have to stay in the room.

Browsers deliberately will not let a page keep working after you close it —
background workers are killed within seconds, and the one API designed for this
is Chrome-desktop-only and throttled to hours. So "just run it in the background"
is not available, and pretending otherwise would be building on sand.

---

## What now happens when the tab closes anyway

Four protections, added 2026-07-26 (agent build `2026-07-26.1`).

### 1. Storage the browser is asked not to throw away

The deposit key lives in `localStorage`, the file in IndexedDB. Both are on disk
and survive a restart — but a browser treats site storage as **disposable by
default** and may evict it under disk pressure without asking. We never told it
otherwise.

`requestDurableStorage()` now runs when a job is created and records the answer on
the job (`granted` / `refused` / `unsupported`). If the browser refuses, the UI
says so rather than assuming.

Second hole closed: a failed IndexedDB write used to be a `console.warn` and
nothing more, so the job looked healthy while having quietly lost the ability to
resume — the user found out when reopening produced a refund instead of their
inscription. It is now a visible warning.

### 2. A banner that stays on screen

The keep-open message used to be one of the rotating tips: easy to miss, gone a
second later. It is now a permanent banner while a job is live, with concrete
progress — *"uploading — 416 of 459 chunks on-chain so far"* — because a progress
bar that stops moving is indistinguishable from a crash.

It also warns specifically when storage is fragile, because in that case closing
the tab is genuinely destructive rather than merely a pause.

The `beforeunload` guard now exists on SUNO too; the main wizard already had one.
Note it can only trigger the browser's own generic "Leave site?" prompt — the
wording and buttons are not ours to control, which is why the banner does the
actual explaining.

### 3. A paused job is not a stalled job

The reaper expires jobs on wall-clock "no progress since", with a five-minute
window mid-inscribe. But the agent only runs while the tab is open — so closing
the tab for ten minutes could get a **healthy job refunded on reopen** rather than
resumed. It was punishing the pause.

A heartbeat (`xtrata.agent.lastSeen`, written every 10 s) records when the agent
was last alive. On load, any gap longer than 30 s is credited back to every
unfinished job by shifting its timestamps forward. `fundedAt` is shifted too, so
the fifteen-minute parent-escrow window does not run while nobody can act on it.

### 4. Finish without me

`handoffJob(id, consent)` hands **one job** to a server so it completes
unattended. This is the only place a deposit key leaves the browser, so it is
gated three ways: the endpoint must be configured, the caller must pass an
explicit consent token, and the job must still be in a handoff-able state.

What is sent is scoped to that job — its id, its ephemeral key, the deposit
address, and enough state to resume. Never the user's own wallet, never other
jobs.

**The local copy is deliberately kept, not wiped.** If the server never picks it
up, the browser can still resume or refund exactly as before. A handoff that
fails must not be a handoff that strands.

The consent dialog states plainly that the wallet can *currently* only be spent by
that tab, and that this changes for this one job until it completes. Burying that
would be the whole failure.

**Status: client half only.** The button is hidden unless `XAO_CONFIG.handoffEndpoint`
is set, so a half-deployed feature is never offered.

---

## What the server half still needs

The engine already exists: `xtrata-agent-one/svc/core.mjs` is the same state
machine, 1,266 lines, written and unused by the website.

What it does not have is a home. Cloudflare Pages Functions are request-scoped and
cannot run a ten-minute job, so this needs Durable Objects, a queue plus cron, or
`svc/core.mjs` hosted somewhere conventional. That is a deployment decision, not
an engineering one.

The contract the client expects:

```
POST <handoffEndpoint>
{
  jobId, core, net,
  depositAddress, ephemeralMnemonic,
  uri, mime, deps[], parents[],
  user, recipient, expectedFunder,
  requiredUstx, depositReceivedUstx,
  status,
  consent: "i-agree-xtrata-may-finish-this-job"
}
→ 200 { runner?: "<identifier shown to the user>" }
```

Requirements for whoever builds it:

- **Reject any request without the exact consent string.** The client sends it;
  the server must not treat its presence as decorative.
- **Never log the mnemonic.** Not in request logs, not in error traces.
- **Deliver and refund to the addresses in the payload**, not to anything derived
  server-side — those are what the user was shown.
- **Destroy the key on completion**, as the browser agent does.
- Expect duplicates. The browser keeps its copy and may still be running; the job
  must be idempotent (it already is — uploads resume from the on-chain chunk
  index).

---

## Things deliberately not done

- **A custom "are you sure" dialog on tab close.** Browsers do not allow it. Any
  design that assumes custom buttons there will not survive contact.
- **Blocking resume behind a prompt.** Tempting, but a job that sits waiting for a
  click while its clocks run is worse than one that resumes visibly with a stop
  button next to it. The clocks are now pause-aware, which removes most of the
  reason to block.
- **Wiping the local key on handoff.** Would make the handoff a one-way door with
  no fallback if the server never answers.
