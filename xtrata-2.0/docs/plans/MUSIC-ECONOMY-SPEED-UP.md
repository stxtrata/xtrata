# Music Economy and speed-up

Economy is an opt-in Music funding policy. Standard retains its existing quote and behavior. Economy targets one micro-STX per serialized transaction byte for mining, with fixed transaction allowances plus protocol, delivery, receipt and service costs quoted separately. It does not promise inclusion or a fixed all-in per-MB price.

- A separate durable, non-secret control record tracks approved budget, confirmed mining spend, pending transaction nonces/IDs and one funding request. Long-running job snapshots cannot overwrite it.
- Economy never automatically increases its fee rate. Speed-up reviews show existing funds, additional payment and the approved total including service. Wallet success alone cannot activate an increase.
- Top-ups require canonical confirmed success, the original sender, exact recipient and amount, and a sender nonce newer than the pre-approval confirmed nonce. Unknown wallet outcomes remain pending, with transaction-ID recovery instead of a second payment button.
- Pending transaction arguments, nonce and signed IDs persist before broadcast. Replacements keep the original nonce and monitor every candidate. Stop, discard, handoff and delivery cannot race unresolved funding or mint transactions.
- Fee waits pause instead of triggering the legacy inactivity refund. On-chain expiry is checked against the deployed v3.2.3 Stacks-block window; unreadable expiry pauses new transactions. A higher fee cannot restore expired chunks.
- Each managed job uses an exclusive browser lock. Standard jobs keep their current behavior. Unsupported browsers cannot create Economy jobs.
- Validate only with isolated browsers and simulated chain/wallet calls; deploy to main-music-updates, with main promotion separate.

## Validation — 2026-09-12

- 297 tests pass across the agent and Music suites. New fault-injection cases cover byte-floor fees, Standard/Economy quotes, initial funding persistence, stale nonce APIs, exact signed-transaction retries after an ambiguous broadcast, full staged init/chunks/seal, top-up identity/amount/nonce/block-height validation, duplicate requests, rejection, replacement accounting, expiry and missing control records.
- Production build and focused JavaScript lint pass. Existing Music browser smoke and the new mobile speed-up smoke pass with isolated Chrome and simulated payments. The mobile review was visually inspected at 390px; no horizontal overflow.
- Repository-wide `tsc --noEmit` is not a clean gate: existing Vitest `ExpectStatic` declaration problems affect suites throughout the repository, alongside pre-existing core/wallet type errors. The new policy module has no reported type errors. Build and executable tests are the validation gates for this branch.
- No real wallet signing, transfers or inscriptions were performed. No personal, sponsor or deployer wallet was accessed.

## Rollout limits

Standard remains the default. Economy is offered only by Music for v3.2.3 in browsers supporting Web Locks. It targets mining cost, not an all-in 1 STX/MB price or guaranteed completion. The speed-up upgrades to the quoted Standard reserve; if fees exceed that approved reserve, the job continues waiting. It never requests an unapproved automatic top-up.

While a wallet outcome is uncertain, a saved transaction ID can restore verification; a second payment button is withheld. Delivery and key disposal wait for unresolved payments. Canonical on-chain success is verified through the configured chain API; this cannot eliminate underlying chain reorg or API trust risks. The legacy delivery/recovery subsystem remains in use. Economy jobs cannot be handed off to the server, which does not yet understand this policy record.

Deployment target: `main-music-updates`. Promotion to `main` remains a separate review.
