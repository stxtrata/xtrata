# Automated radio wizard suite

Use only the dedicated funded backend wizard. The suite does not use a browser
wallet, deployer key or personal account. Funding and authorization are separate.

From `xtrata-2.0`, after explicitly authorizing a bounded mainnet run:

```sh
node scripts/wizard/radio-plays-suite.mjs --broadcast
node scripts/wizard/radio-plays-report.mjs
```

The suite performs one 300-microSTX-fee payment, a sequence of two at the same fee,
then one at 257 and one at 200. Each adds a 50-microSTX holder payment. Maximum
planned cost is 1607 microSTX (0.001607 STX). It stops on any failure or uncertain
submission; rerunning does not bypass an unresolved transaction. Do not rerun a
completed suite without intending to create additional paid starts.

Read-only audit output verifies actual fees, canonical status and exact 50-microSTX
holder transfers. Public JSON reports are in `.artifacts/radio-wizard-reports/`;
secret keys and signed bytes are excluded. Failed/unknown transactions remain in
the private journal for investigation. Never clear the journal to bypass its guard.

Run local regression coverage separately:

```sh
npm run test:radio-plays
./node_modules/.bin/vitest run scripts/wizard/__tests__/radio-plays-backend.test.ts src/lib/deploy/__tests__/radio-plays-management.test.ts src/radio-test-wallet/__tests__/wallet.test.ts
```

These 44 checks cover payment/receipt atomicity, replay protection, ownership
changes, invalid inputs, escrow/proxy rejection, rollback, encrypted storage,
limits and uncertain submission. Ownership transfers and deliberately failing
contract calls are simulated; the live suite tests actual successful payment
and fee acceptance only. A test suite cannot prove all future network conditions.
