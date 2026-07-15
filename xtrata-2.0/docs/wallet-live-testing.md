# Wallet Live Testing

Use a dedicated browser profile and accounts containing only the minimum test value. Never paste keys or raw signed transactions into logs. Record extension/browser versions, UTC time, result and txid (when broadcast) in the tables below.

## Capability matrix

| Date | Browser/version | Wallet/version | Transport | Connect | Restore | Transfer | Call | Deploy | Sign-only | Cancel/locked/unsupported | Tester |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pending | pending | Xverse/pending | BitcoinProvider candidate | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| pending | pending | Leather/pending | LeatherProvider | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |

Before spending, use injected-provider mocks to confirm every request remains on the connection transport. In the live profile, connect once and inspect safe diagnostics for provider family/transport and method only. If a required Xverse method fails on `BitcoinProvider`, stop the release; do not add a per-operation fallback.

## Low-value transaction matrix

Recommended ceiling per broadcast test: 0.01 STX transfer, the smallest protocol-supported contract action, and one deliberately low-value NFT owned by the test account. Adjust only when the contract minimum requires it and record the reason.

| Wallet | Flow | Expected result | Result/txid |
|---|---|---|---|
| Xverse | connect, refresh, second-tab restore | local render; no restore popup | |
| Xverse | STX payment | one verification, one transfer popup | |
| Xverse | standard contract call | BitcoinProvider only | |
| Xverse | NFT/parent transfer | sender-bound deny-mode call | |
| Xverse | sponsored claim | signed origin bytes, no wallet broadcast | |
| Xverse | deploy | BitcoinProvider only, where supported | |
| Leather | repeat all rows above | LeatherProvider only | |

For every write repeat: cancel the popup; lock the wallet; switch account before the action; switch account while the action is pending; delay the response past timeout. Confirm no second-method cascade occurs and no transaction is sent on failure.

## Cross-tab and navigation flows

1. Connect in tab A; confirm tab B updates immediately without a popup.
2. Start a wizard job and retain its expected funder. Change the extension account; confirm the next write becomes `RECONNECT_REQUIRED` and the job payer is unchanged.
3. Disconnect in tab B; confirm Home, Wizard, SUNO, Manifest Studio, workspace and runtime frames invalidate.
4. Refresh each surface and confirm local restoration has no extension query.
5. Navigate SPA Home → Inscribe → Xplorer → My Xtrata → Market → Drops and confirm one address/provider identity.
6. Exercise migration, deploy/sponsor consoles and Forever Twins with the same connection.

## Expected diagnostics

Allowed: stage, provider family, transport id, method, duration, stable error code, session generation/revision. Forbidden: raw transactions, signatures, private keys, full serialized post conditions and sensitive request payloads.

Expected Xverse account reads may take 12–15 seconds on the baseline extension. A read beyond 30 seconds returns `PROVIDER_TIMEOUT`; it must not call `stx_getAccounts` afterward.

## Rollback procedure

1. Stop new wallet actions and record the failing surface, wallet/browser versions and safe diagnostic stages.
2. Disconnect all tabs.
3. Set `localStorage['xtrata.wallet.v2']='0'` before reconnecting to use the one-release compatibility path.
4. Roll back the deployment to the last signed-off release if the compatibility path does not restore the flow.
5. Never toggle the switch during a connected session and never combine v1 connection with v2 writes.

## Release sign-off

| Gate | Xverse | Leather | Evidence/owner |
|---|---|---|---|
| Automated `npm run smoke:wallet` | ☐ | ☐ | |
| Main SPA matrix | ☐ | ☐ | |
| Wizard/SUNO/Manifest matrix | ☐ | ☐ | |
| Portals/consoles/Forever Twins | ☐ | ☐ | |
| Runtime host bridge | ☐ | ☐ | |
| Two-tab/account-change/disconnect | ☐ | ☐ | |
| Rollback rehearsed | ☐ | ☐ | |

Promotion requires every row for both wallets. Add txids only for broadcasts; sign-only tests record the relayer job/settlement evidence without raw transaction bytes.
