# Xtrata Knowledge Base (linked)

Up-to-date Xtrata protocol knowledge for **Huge Sphinx / Xtrata Agent 1**. Keep this
accurate — outreach and replies to other agents must be factually correct.

**Source:** copied from the Xtrata repo at `../../xtrata-1.0` (sibling of this project).
**Refresh:** run `scripts/sync-xtrata-knowledge.sh` from the project root to re-pull the
latest docs/XIPs/agent files. (Markdown only; node_modules and zips are excluded.)

## What's here
- `XTRATA_AGENT_SKILL.md` — the canonical agent skill: how to inscribe, mint, transfer, query (contracts, functions, fees, code).
- `AGENTS.md` — agent operating guide.
- `docs/xips/` — XIP-000 … XIP-011 (the standards). XIP-011 = Agent Inscription Standard.
- `docs/xtrata-inscription-handbook.md`, `docs/xtrata-quickstart.md` — how-to.
- `docs/sdk/` — SDK quickstarts and API reference.
- `docs/standards/`, `docs/xtrata-v2.1.0/` — manifest standards + current-version reference.

## Crucial facts (verified 23 Jun 2026)

### Inscription = a Stacks contract call paying STX (no HTTP endpoint, no x402)
- **Production contract:** `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0`
- **Small-file helper:** `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-small-mint-v1-0`
- Data → fixed **16,384-byte chunks** → uploaded on-chain → sealed into a **SIP-009 NFT**. Incremental SHA-256 chain hashing; native dedupe (one canonical token per final hash); resumable; immutable once sealed. Max 32 MiB (2,048 chunks).
- **Two routes:** small helper `mint-small-single-tx` / `-recursive` (1–30 chunks, one tx); or staged `begin-or-get` → `add-chunk-batch` (×N) → `seal-inscription` / `seal-recursive`.
- **Fees (STX micropayments in the tx):** `fee-unit` default 100,000 µSTX = 0.1 STX; FEE-MIN 0.001, FEE-MAX 1.0 STX. begin = 1 fee-unit; seal = fee-unit × (1 + ceil(chunks/50)); `add-chunk-batch` has **no protocol fee** (network gas only). A small 1-chunk inscription ≈ **~0.3 STX**.
- aibtc agents inscribe with their own STX wallet (the AIBTC MCP wallet signs/broadcasts, or use this skill directly). Always `PostConditionMode.Deny` on fee-paying calls.

### x402 status: NOT built — design only
- `../../xtrata-1.0/Dora-Hacks/x402-mvp.md` is a hackathon **design doc**, not deployed. No `functions/demo/x402/` exists; `contract-inventory.md` states "No … x402 logic in this MVP."
- Even as designed, the x402 gateway would **gate access to premium content/routes** (return `402`, verify an on-chain entitlement via `xtrata-commerce` USDCx or `xtrata-vault` sBTC premium state, issue a short-lived session cookie, serve premium HTML/JSON). It is a **paywall for served content — it does NOT inscribe data.**
- Therefore: never tell another agent to "route data into an Xtrata x402 endpoint to inscribe." Inscription is the Stacks contract call above.

### Live production proof points (for outreach claims)
- **Forever Twins** — permanent on-chain twins of NFT collections (e.g. Bitcoin Pepes, LEO Cats, Miami Degens). See `../../xtrata-1.0/forever-twins/` and `docs/forever-twins-linking.md`.
- **XIP-011 Agent Inscription Standard** — `docs/xips/XIP-011-Agent-Inscription-Standard.md`.
- Recursive inscriptions / dependency graphs — `docs/recursive-inscriptions.md`.
