# Huge Sphinx — Code Review & Fixes

_AIBTC outreach agent + console UI. Reviewed 23 Jun 2026._

This covers the console UI and the logic for sending, receiving, and drafting messages
to other agents. Items marked **✅ Fixed this session** were changed in the code; the
rest are prioritised recommendations.

---

## 1. Executive summary

The console is a capable, well-organised single-file dashboard. Three things needed
attention urgently, and all three are now fixed:

1. **Live send was broken** (`validation_failed` on every new message). Root cause: the
   server's request body didn't match the AIBTC inbox contract. **✅ Fixed.**
2. **Two real security holes in the local server**: it served your `.env` files (which
   hold the wallet mnemonic) over the network, and it listened on every network
   interface — so any device on your LAN could read the seed or, with paid-send on,
   spend your sBTC. **✅ Fixed.**
3. **No "latest news from Xtrata" path exists.** The 30 drafts are static, hand-written
   pitches with no connection to any Xtrata news source. Flagged here with a design
   sketch (Section 6), not yet built — per your call.

Reassuring note on the bug: the inbox API validates the request body on the **first,
unpaid** request, so the failed sends were rejected *before* any payment. You have not
been losing sats on the failures.

---

## 2. The `validation_failed` send bug — root cause & fix

### What was happening
`huge-sphinx-console.html` → `POST /local/send` → `console-server.mjs` builds an
x402 request to `https://aibtc.com/api/inbox/{recipient}` and the AIBTC API rejected the
body with `validation_failed`.

### Root cause
The server's payload diverged from the documented AIBTC contract
([aibtc.com/docs/messaging.txt](https://aibtc.com/docs/messaging.txt)) in two ways:

| | Documented contract | What the code sent |
|---|---|---|
| `paymentSatoshis` | `100` (present in the official x402-stacks example) | **omitted** |
| `toBtcAddress` | recipient's `bc1…` address | **`null`** whenever the agent lookup didn't return a BTC address |
| URL path | `/api/inbox/{btcAddress}` | `/api/inbox/{btc ‖ stx}` — fell back to the STX address |

The deeper issue is an **address-type mismatch**: the whole console works in Stacks
(`SP…`) addresses (the queue, `OUTREACH`, the Crafty Puma archive all key on `SP…`),
but the inbox API addresses messages by **Bitcoin (`bc1…`)** address. When the server
couldn't translate `SP… → bc1…`, it sent `toBtcAddress: null`, which fails validation.

### Fix (✅ `console-server.mjs`)
- Send the body exactly as documented: `{ toBtcAddress, toStxAddress, content, paymentSatoshis: 100 }`, posted to `/api/inbox/{btcAddress}`.
- Added `resolveRecipient()`: resolves `SP… → bc1…` via `/api/agents/{id}`, then falls
  back to scanning the agent directory for a matching STX address.
- **Never send `null`** — if the BTC address can't be resolved, the send is refused with
  a clear message ("Could not resolve a Bitcoin (bc1…) address for …") instead of wasting
  a request.
- Handle `202 Accepted` / `paymentStatus: "pending"` (staged, settling on-chain) as a
  distinct success state, surfacing `paymentId`.
- The UI now passes any address it already knows and shows a "⏳ Staged — settling" state
  (`q-send`, `compose-send`, and bulk send).
- The manual fallback command (`sendCmd`) previously emitted a wrong `{message: …}` body;
  it now emits the correct `send_inbox_message_direct` form.

### How to verify safely
Restart the server, then send **one** message to a known agent from the Outreach Queue.
A success shows `✓ Sent · {messageId}` (or `⏳ Staged`). If anything is still off, the
error text now comes straight from the API (e.g. a nonce/`Retry-After` hint) instead of a
generic failure. I could not run a live paid send from here (it spends real sBTC and needs
the wallet), so this one manual send is the final confirmation.

---

## 3. Security findings (local server)

All three **✅ Fixed** in `console-server.mjs`. These matter because the server holds the
wallet seed and, with `ALLOW_PAID_SEND=1`, can spend money.

**S1 — Served secrets over HTTP (High).** The static handler served any file under the
folder, including `.env.aibtc` (wallet mnemonic) and `.env.local` (wallet password). A
request to `http://localhost:8777/.env.aibtc` returned the seed in plaintext. → Now blocks
dotfiles and serves only known asset types (`.html/.js/.css/.json/.svg/.png/.ico`); `.env*`
and the `.mjs` server source are no longer reachable.

**S2 — Listened on all interfaces (High).** `server.listen(PORT)` binds `0.0.0.0`, so the
console (and S1's file serving, and the money-spending `/local/send`) was reachable from
any device on the same Wi-Fi/LAN. → Now binds `127.0.0.1` only (override with `HOST` env
if you really need remote access).

**S3 — No CSRF / DNS-rebind protection on state-changing routes (Medium-High).**
`/local/send` (spends 100 sats) and `/local/reply` had no origin check, so a malicious web
page you happened to visit could `fetch('http://localhost:8777/local/send', …)` and drive
your wallet. → Added a same-origin loopback guard on `/local/*` and the `/api/*` proxy
(Host must be loopback; Origin, if present, must be loopback).

**Also recommended (not blocking):**
- The wallet auto-unlocks for the whole server lifetime when `WALLET_MNEMONIC` is set.
  Consider a confirmation token or a short idle-lock for paid sends.
- Even though this folder isn't a git repo, add a `.gitignore` for `.env*` and `node_modules`
  before it ever becomes one. The mnemonic must never be committed.

---

## 4. Messaging logic — bugs fixed & remaining

**✅ Fixed this session**
- **Draft clobbering:** clicking "Message →" on an agent who already had a curated draft
  overwrote it with the generic template. `addToQueue` now skips agents already in
  `OUTREACH` and never overwrites an existing body.
- **500-char limit:** the inbox caps `content` at 500 chars, but Compose and the queue
  editor enforced nothing. Added `maxlength` + a live `n/500` counter that turns amber at
  the limit. (Your longest current draft is 471 chars — within limit, but Compose was
  unbounded.)
- **Address validation:** Compose now validates `SP…`/`bc1…` shape before spending,
  with a live hint, so a typo can't burn 100 sats on an unroutable address.
- **Pending sends:** a `202` (staged, awaiting settlement) is now shown distinctly rather
  than looking identical to a confirmed send.
- **Silent mark-read:** the reply path's mark-read call ignored failures; it now logs a
  warning (and sends the `messageId` the PATCH body expects).

**Recommended next**
- **Inbox/Outbox de-duplication & direction.** `loadInbox` pulls `?view=all` (inbound +
  outbound) and `msgCard` guesses direction; sent replies can appear in both Inbox and
  Outbox. Tag direction from a single authoritative field and de-dupe by `messageId`.
- **Rate-limit handling in bulk send.** The bulk loop sleeps a fixed 12s and treats any
  non-OK as a generic failure. The API returns `429` with `Retry-After` and structured
  `409` nonce codes — honour `Retry-After` and surface nonce guidance instead of failing
  the item.
- **Thread the recipient `bc1…` through the client.** Because the queue is STX-only, every
  send forces a server-side lookup. Store `btcAddress` on agent/queue records when the
  Directory loads them, so sends (and the manual command) are self-sufficient.

---

## 5. UI / UX recommendations (deferred)

The UI is clean and the contextual help is genuinely good. Highest-value polish, roughly
in priority order:

1. **Single source of truth for the Xtrata pitch.** The product description ("permanent,
   contract-native inscriptions on Stacks, SIP-009 NFTs, hash chains…") and the
   "continuing Agent 27 (Crafty Puma)" framing are hand-repeated across all 30 drafts and
   the segment pitches. Editing the pitch today means editing ~30 strings. Extract one
   `XTRATA` profile object (name, one-liner, current stats, links) and compose drafts from
   it. This is also the hook the news feature (Section 6) plugs into.
2. **Accessibility.** Tabs, filters, and segment headers are clickable `<div>`s with no
   keyboard focus or roles; status is conveyed by colour alone. Use `<button>`s, add
   `aria-expanded`/`aria-pressed`, and pair colour tags with text/icons. (The
   `design:accessibility-review` skill can do a full WCAG pass.)
3. **Inbox/Outbox search, filter, and paging.** Both render a flat list capped at 100 with
   no search or "load more" — fine now, unusable once conversations accumulate.
4. **Live-send discoverability.** The ⚡ Send buttons only appear when the server runs with
   `ALLOW_PAID_SEND=1`; otherwise users see a small muted note. Make the read-only/replies/
   live-send state and how to upgrade it more prominent than the header chip.
5. **Mobile / narrow widths.** The header, balance bar, and stat rows overflow under
   ~700px; nothing collapses responsively.

---

## 6. The "latest news from Xtrata" workflow (gap — flagged only)

Your brief is "drafting messages to other agents about **latest news from Xtrata**," but
there is no news concept anywhere in the code. `outreach-queue.js` is 30 static pitches
written once; nothing connects them to what's actually new at Xtrata (new inscriptions,
new journal entries rooted at Token #107, protocol updates, adoption numbers).

Recommended shape when you're ready to build it:
- **A news source.** Either a small `xtrata-news.js` the operator updates, or (better) pull
  the latest sealed artifacts/journal entries from chain and treat each as a news item
  (headline, date, link, one-line "why it matters").
- **News → draft composer.** Pick a news item + a target segment; generate a tailored
  message by merging the news headline with that segment's existing pitch angle (the
  `SEGMENTS` pitches are already a good per-audience base). This turns 30 frozen drafts
  into "here's what's new, framed for this audience."
- **Freshness signal.** Show each contact's last-contacted date (the Crafty Puma archive
  already has `lastOutboundDate`) so outreach leads with genuinely new information rather
  than re-pitching the same thing.

This depends on the Section 5.1 refactor (one Xtrata profile object) — worth doing first.

---

## 7. Architecture & maintainability

- **Brittle hardcoded path.** `scripts/aibtc-lib.mjs` and `scripts/aibtc-heartbeat.mjs`
  hardcode `/Users/melophonic/.npm/_npx/2232c00bb1f81919/node_modules`. That npx hash
  changes when the MCP server updates — sends/heartbeats will break silently. Resolve the
  modules dynamically or pin a stable dependency. (`MCP_MODULES` override exists in
  `aibtc-lib` but not in the heartbeat script.)
- **Duplicated signing code.** `aibtc-heartbeat.mjs` and `agent1-heartbeat.mjs` re-derive
  keys instead of importing the shared `aibtc-lib.mjs`. Consolidate.
- **Single 600-line HTML file.** Fine for a local tool, but the command builders, segment
  classifier, and send logic are the parts most worth extracting and unit-testing.
- **No tests.** The pure pieces (address validation, recipient resolution, command
  builders, the security predicates) are easy to cover and would have caught the
  field-name bug.
- **Magic numbers** (100 sats, 12 000 ms pacing, 500-char cap, 60 s refresh) are scattered;
  pull them into named constants. (Server now uses `INBOX_MAX`.)

---

## 8. Changed files (this session)

- **`console-server.mjs`** — fixed inbox payload (`paymentSatoshis`, correct `bc1…` path,
  no null address); added `resolveRecipient()`; `202`/pending handling; bound to loopback;
  blocked dotfiles/secrets in the static handler; same-origin guard on `/local/*` and
  `/api/*`.
- **`huge-sphinx-console.html`** — corrected manual `sendCmd`; fixed `addToQueue`
  clobbering; added 500-char counters + address validation; pass known addresses to
  `/local/send`; show staged/pending state.

Verification run: `node --check` passes on both files; 17/17 unit checks pass on the
security predicates and the send-payload shape. The one remaining check that needs you is a
single live send (Section 2), since it spends real sBTC.
