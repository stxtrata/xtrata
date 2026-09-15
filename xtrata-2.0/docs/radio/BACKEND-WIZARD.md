# Radio backend wizard

This supersedes the browser-wallet test flow in the paid-play canary. The backend creates and signs with a separate random mainnet wizard key. No extension, browser storage, personal wallet or deployer wallet is used for signing.

Start from `xtrata-2.0`:

```sh
node scripts/wizard/radio-plays-server.mjs
```

Open http://127.0.0.1:8798, or use the canary’s backend wizard link.

1. **Create / get wizard funding address** returns the existing address, or creates it once. It refuses to overwrite a partially created wallet.
2. Fund that address externally, then **Confirm funds / refresh results** checks its confirmed mainnet balance. Funding does not authorise spending.
3. Choose core, song, network fee in microSTX and test count. Approve the bounded run. The backend signs and submits automatically, with no manual transaction popups.

CLI address setup: `node scripts/wizard/radio-plays-server.mjs setup`. Read-only balance/status: `node scripts/wizard/radio-plays-server.mjs status`.

## Key storage and scope

State is in ignored `.artifacts/radio-wizard/`. A random AES-256-GCM encrypted signing key is stored separately from its random local unlock key. Files use mode 0600 and directory 0700. Back up the entire folder securely. This protects against accidentally publishing plaintext keys, not against someone who can read both files or control the computer. An automatically signing wallet is technically hot while the backend uses it.

The HTTP service binds only 127.0.0.1:8798 and rejects unexpected Host/Origin, non-JSON and non-POST commands. It sends no private keys, unlock keys or signed bytes to the browser. There is no remotely exposed funding or signing API.

## Limits and recovery

Runs allow 1–5 transactions, 1–1000 microSTX fixed network fee each, at most 5000 microSTX total per run, and a conservative lifetime ceiling of 10000 microSTX (0.01 STX). Each transaction additionally pays 50 microSTX to the master holder. A 1000 microSTX reserve remains. These small limits are deliberate for initial tests; this is not an unrestricted subscription signer.

The deployed helper source hash and mainnet network are verified. Each call has an exact 50 microSTX spend post-condition. Only one run/process and one unresolved payment are allowed. The backend persists signed bytes before sending and waits for the matching confirmed receipt before the next call. No automatic fee increase or replacement transaction is made. A rejected/failed/uncertain submission blocks further runs until operator investigation; do not delete its journal to bypass this.

Stop halts future payments. Already broadcast payments can confirm. The existing wizard `KILL` file and `WIZARD_KILL_SWITCH` are respected. After a crash, inspect whether a runner is alive before removing a stale run.lock. This prototype has no backend withdrawal endpoint; preserve the vault and unused funds for a separately reviewed recovery operation.

Tests exercise contract payments and receipts, not audible playback. A receipt proves this payment call, not listening duration. Failed transactions can consume network fees.

Validation: backend tests use disposable temporary identities and mocked chain responses, including an unknown-submission recovery guard. Canary input tests and production build pass. Implementation performed no mainnet signing or broadcasts. User handles pushing; the local panel works without a website deployment.
