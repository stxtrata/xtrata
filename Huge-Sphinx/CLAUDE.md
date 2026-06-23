# Huge Sphinx — Xtrata Agent 1

Huge Sphinx is Jim's AIBTC agent representing **Xtrata** (xtrata.xyz) on the Bitcoin Agent
Network. This project is its console + outreach tooling. Mission: build relationships with
other agents and accurately communicate what Xtrata does and makes possible.

## Xtrata knowledge base — READ BEFORE making any factual claim about Xtrata
Up-to-date Xtrata docs, all XIPs, and the agent skill are linked under **`xtrata-knowledge/`**
(see `xtrata-knowledge/README.md`). Refresh with `bash scripts/sync-xtrata-knowledge.sh`.
Source repo: sibling folder `../xtrata-1.0`.

Accuracy is mission-critical: outreach and replies go to other autonomous agents who will
act on them. Verify against `xtrata-knowledge/` rather than guessing.

### The two facts most often gotten wrong
1. **Inscription is a Stacks contract call paying STX — not an HTTP/x402 endpoint.**
   Data → 16,384-byte chunks → on-chain → sealed as a SIP-009 NFT. Small payload = one
   `mint-small-single-tx` on `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-small-mint-v1-0`
   (~0.3 STX); larger = `begin-or-get` → `add-chunk-batch` → `seal-inscription` on
   `…xtrata-v2-1-0`. Details + code: `xtrata-knowledge/XTRATA_AGENT_SKILL.md`.
2. **x402 is NOT built** — only a hackathon design (`../xtrata-1.0/Dora-Hacks/x402-mvp.md`).
   As designed it would be a *paywall gateway* for premium content/routes (402 → verify
   on-chain entitlement → session cookie → serve content), **not** a way to inscribe data.

## The console
- `huge-sphinx-console.html` — single-file dashboard (Inbox, Outbox, Outreach Queue, Compose, Segments, Directory, Archive).
- `console-server.mjs` — local server: serves the dashboard, proxies `/api/*` → aibtc.com, and `/local/*` signs/sends with the wallet (loopback-only). Paid sends ON by default; `ALLOW_PAID_SEND=0` for read-only. Optional `ANTHROPIC_API_KEY` enables the ✨ Draft-with-AI button.
- `outreach-queue.js` — `window.OUTREACH` (curated outreach drafts) + `window.REPLY_DRAFTS` (curated follow-ups, keyed by agent STX address).
- AIBTC inbox/outbox is keyed by the **BTC (bc1…) address**, not STX. See `HugeSphinx-Review.md`.

## Conventions
- Inbox messages are capped at **500 characters**.
- Keep outreach specific and truthful; lead with real, current proof points (Forever Twins, XIP-011, recursive inscriptions).
