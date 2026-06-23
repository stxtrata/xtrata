# Connect Xtrata Agent 1 to AIBTC (vouched by Huge Sphinx)

These scripts register **Agent 1** (`SP2B4V8FTKNR1PY325CN3GZ1187H6GN8SG2FS2P4B`) on
aibtc.com as its own listing, using **Huge Sphinx's referral code** so Huge Sphinx
vouches for it (vouch badge + $50-in-BTC referral reward for both).

## Key safety
- Your 24 words are passed **only** as a local `WALLET_MNEMONIC` env var at run time.
  They are never written to disk by these scripts and never sent to aibtc.com.
- Only **signatures** and **public addresses** are sent. The API verifies them; a bad
  signature just returns an error (nothing is spent, nothing breaks).
- Each script asserts the derived address matches the expected agent before sending.

## Prereq (once)
The scripts reuse the AIBTC MCP server's installed libraries. If not present yet:
```
npx @aibtc/mcp-server@latest --install
```
If your modules live elsewhere, set `MCP_MODULES=/path/to/node_modules`.

## Step 1 — Get Huge Sphinx's referral code
```
WALLET_MNEMONIC="<HUGE SPHINX 24 words>" node scripts/get-referral-code.mjs
```
Copy the 6-character `REFERRAL CODE` it prints.

## Step 2 — Preview Agent 1 registration (no network write)
```
DRY_RUN=1 WALLET_MNEMONIC="<AGENT 1 24 words>" REF=<CODE> node scripts/agent1-register.mjs
```
Confirm it prints `✓ Matches Agent 1 signer.` and the right BTC/STX addresses.

## Step 3 — Register Agent 1 (live)
```
WALLET_MNEMONIC="<AGENT 1 24 words>" REF=<CODE> node scripts/agent1-register.mjs
```
**Save** the `displayName` and `claimCode` it returns. → Agent 1 is now Level 1,
vouched by Huge Sphinx.

## Step 4 — Heartbeat (every 5 min)
```
WALLET_MNEMONIC="<AGENT 1 24 words>" node scripts/agent1-heartbeat.mjs
```
Schedule it (cron every 5 min), or ask Claude to set up a scheduled task.

## Step 5 — Genesis (you, the operator)
Tweet Agent 1's `claimCode` + `displayName` + "AIBTC", tag **@aibtcdev**, then POST the
tweet URL to `/api/claims/viral`. → Agent 1 reaches **Genesis (Level 2)**. Then mint its
own ERC-8004 identity (`identity_register` via the MCP tools).

## Note on levels
Levels/reputation are **per-wallet** — Agent 1 does not inherit Huge Sphinx's Genesis or
ERC-8004 #388. The referral is how Huge Sphinx boosts Agent 1; Agent 1 still earns Genesis
itself at Step 5.

## Secrets cleanup (recommended)
`../.env.aibtc` currently holds the Huge Sphinx mnemonic + password in plaintext. Move them
to a password manager and strip them from the file (keep only the addresses).
