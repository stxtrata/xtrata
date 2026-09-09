# Rebuildable candidate source

Run `npm ci`, `npm run build:candidate`, and `npm run test:peer`.
The source snapshot includes the full application/build modules and focused peer tests.
The parent workspace contains the full historical regression harness.
Run the peer registry test with `npx vitest run -c vitest.clarinet.config.ts tests/clarity/peer.test.ts`.
Local browser tests use `CHROME_BIN` to select Chrome. No command deploys a contract.
