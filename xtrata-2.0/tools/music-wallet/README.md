# Music Wallet companion core

`simulation.mjs` is a Node-only SQLite state-machine prototype. It contains no
private keys, transaction builder, network client, native messaging endpoint or
signing/broadcast method. Do not point it at a wizard vault or production database.
It uses Node's `node:sqlite` (tested with Node 24.10.0), WAL and full synchronous
commits. SQLite is experimental in this runtime.

The simulator has fixed costs of 300 microSTX network fee plus 50 holder payment
and a 1000-microSTX reserve. These are test policy values, not a live fee quote.
Native/operator methods approve pairing, change enabled state, credit simulated
funds and reconcile simulated evidence. Those methods must never become page RPCs.

Read/start methods require exact production origin, configured extension ID,
top-level context and a paired installation. This validates an injected context;
it does **not** authenticate it. A future native host must derive that context
from authenticated transport rather than trusting fields sent by a page.

One 15-second durable lease belongs to one document. Same-document acquisition
renews it; expiry allows a new token. Start identity is immutable and unique.
Only one reserved/unknown transaction is allowed. Other starts are recorded free,
with no queue and no catch-up billing. This intentionally implements the narrow
single-in-flight policy before the plan's optional short unsigned queue.

`markUnknown` models the durable pre-submission boundary; it does not sign or send.
Unknown entries survive pause and restart. `reconcile` atomically updates the
simulated balance and receipt and accepts only simulated confirmed/aborted results.
There is no automatic reset, retry, replacement or unknown-to-free conversion.

Status conforms to the read-only panel's status validator. History exposes
simulated states and debits, with stable numeric cursors. It is not yet connected
to the browser panel: chain-confirmed UI rows require real verified transaction
evidence, which this simulator deliberately does not fabricate.

Run `npm run test:radio-support -- --gate companion` from the project root.
Eight companion tests cover pairing/revocation, cross-connection lease ownership,
abrupt child-process exit, atomic rollback, duplicate receipts, low funds, pause,
aborts, immutable identity and input bounds. Temporary databases are removed by
the tests. Reports contain pass/fail labels only.

Remaining before Gate 3 can pass: actual OS keystore and backup/restore, crash
injection at every signing boundary, nonce/reorg handling, withdrawal policy and
full budget enforcement. Gate 4 also requires real native/extension authentication
and browser lifecycle testing. No gate or live-wallet readiness is claimed here.
