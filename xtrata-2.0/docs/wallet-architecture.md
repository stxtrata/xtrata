# Wallet Architecture

This document is the canonical contract for first-party wallet behavior. The known-good batch-wizard reference is branch `main-staging-fab-opt` at commit `4f7a1abbec8ee87664b8de9e8105fb8c9bf6b85c`. The recovery/deposit baseline preserved by the wallet-v2 migration is `main-staging-gate` at `b54cf12c`.

## Invariants

- `src/lib/wallet/coordinator.ts` is the only first-party wallet entry point.
- One provider family and one concrete request transport are selected per session. Xverse resolves to `XverseProviders.BitcoinProvider`; there is no operation-by-operation switch to `StacksProvider`.
- The versioned session record is the sole address/network/public-key source of truth. Provider objects are never persisted.
- Mainnet is mandatory. Missing network metadata is inferred from the Stacks address before the guard is applied.
- Every write checks its `stxAddress`/expected sender at the coordinator boundary before a provider popup opens.
- Only one interactive connect, verify, sign or write operation may be active in a tab.
- An unexpected provider/account change moves the session to `RECONNECT_REQUIRED`; it never silently replaces the address. An explicit user-initiated “Change account” establishes the newly selected account.
- Cancellation, timeout, capability absence, account change and provider failure use distinct typed errors.
- Logs may include stage, provider family, method and duration. They must not include raw signed transactions, private values, full post conditions or secrets.
- The `wallet-v2` rollback switch is session-wide: set `localStorage['xtrata.wallet.v2']='0'` before connecting. A session never mixes v1 and v2 calls.

## Provider capability matrix

Status is deliberately split between automated evidence and live evidence. Unit mocks prove routing and response handling; they do not prove an extension release.

| Capability | Xverse transport | Leather transport | Automated evidence | Live evidence |
|---|---|---|---|---|
| Connect/account selection | `BitcoinProvider.wallet_connect` | advertised `getAddresses` | wallet provider tests | required each release |
| Restore | local versioned record; no popup | local versioned record; no popup | session-v2 tests | required each release |
| Active-account verify | `BitcoinProvider.wallet_getAccount` | explicit provider read only when needed | timeout/account tests | Xverse observed at 12–15s on the baseline build |
| STX transfer | `BitcoinProvider.stx_transferStx` | `stx_transferStx` | same-transport contract test | required each release |
| Contract call | `BitcoinProvider.stx_callContract` | `stx_callContract` | request normalization tests | pending matrix sign-off |
| Contract deploy | `BitcoinProvider.stx_deployContract` | `stx_deployContract` | request normalization tests | pending matrix sign-off |
| Sponsored sign-only | `BitcoinProvider.stx_signTransaction`, `broadcast:false` | `stx_signTransaction` with `txHex` | signed-envelope tests | required each release |
| Disconnect | `BitcoinProvider.wallet_disconnect` | supported disconnect method | session propagation tests | required each release |

Do not lock a new Xverse method into production from mocks alone. Run `docs/wallet-live-testing.md`; if the Bitcoin transport cannot perform a required method, establish and retain one complete alternative session. Never connect on one bridge and sign on another.

## Session state machine

```text
DISCONNECTED -> CONNECTING -> CONNECTED
CONNECTED -> VERIFYING -> CONNECTED
CONNECTED -> SIGNING -> CONNECTED
CONNECTED -- account/provider change --> RECONNECT_REQUIRED
RECONNECT_REQUIRED -- explicit connect/change account --> CONNECTING
any state -- disconnect --> DISCONNECTED
```

The serialized v2 record contains version, revision, generation, status, provider id, transport id, wallet family, address, network, optional public key and update time. Revisions increase monotonically; stale cross-tab messages are ignored. Generation changes invalidate in-flight verification.

`BroadcastChannel('xtrata.wallet.session')` provides immediate same-origin updates. The `storage` event is the fallback. Disconnect invalidates other tabs immediately. Each receiving tab resolves its injected provider locally; a missing transport must not be represented as a usable connection.

## Transaction routing

All transaction surfaces call coordinator functions: `showStxTransfer`, `showContractCall`, `showContractDeploy`, or `showSponsoredContractCall`. The coordinator checks the persisted sender, performs at most one action-scoped Xverse verification, marks the low-level transfer as already verified, and holds the interactive-operation lock until finish, cancellation or error.

The internal `connect.ts` module remains a one-release compatibility transport while its implementation is split. It is not an application API. Provider resolution belongs under `wallet/providers/`; session revisioning belongs in `wallet/session.ts`; stable failures belong in `wallet/errors.ts`; write invariants belong in `wallet/transactions.ts`.

## Production surface inventory

| Group | Production surfaces | Owner/entry point | Test target |
|---|---|---|---|
| Public SPA | Home, Inscribe, Xplorer, My Xtrata, Market, Drops | `src/home/main.js`, React screens | wallet surface gate + relevant screen/drop tests |
| Wizard tools | Main Wizard, SUNO, Manifest Studio | `src/agent-one/agent-one-wallet.ts` global facade | Agent One wallet test + bundle gate + browser suite |
| React portals | workspace, admin, manage, live collection mint | shared adapter/coordinator | wallet surface gate + app tests |
| Operations | migration, deploy, v3.2.3 handover, sponsor consoles | coordinator imports | wallet surface gate |
| Forever Twins | generated wallet bundle | `src/forever-twins/wallet.ts` | bundle build + surface gate |
| Runtime/recursive apps | sandboxed runtime wallet API | host `postMessage` bridge -> coordinator | runtime tests + browser suite |

Historical version snapshots under `recursive-apps/x-board/xboard-version-testing`, copied `public/x-board` releases, standalone arcade experiments, and archived HTML are reference artifacts, not first-party wallet owners. Do not migrate them by global search-and-replace. Current runtime apps must use the documented host bridge.

## Cross-tab behavior

- Connect publishes one connected record with provider and transport identity.
- Disconnect publishes a higher-revision disconnected record and clears the legacy record.
- Account mismatch publishes `RECONNECT_REQUIRED` while retaining the old address only as diagnostic context.
- A stale connected record cannot overwrite a newer disconnect.
- “Change account” opens selection within the same provider family; it does not disconnect first.

## Expected-funder rules

Wizard jobs remain locked to `expectedFunder`. Deposit recovery, refund destination and inscription recipient remain independent concepts. The coordinator treats the connected session address as the signing authority and rejects a write when it differs from `stxAddress`/expected sender. It never rewrites a job payer from an extension response.

## Timeout and error policy

Xverse account verification has a 30-second timeout because the observed baseline response is 12–15 seconds. Only the in-flight promise is shared; a completed result is not cached. There is no automatic account polling and no `stx_getAccounts` fallback after timeout or cancellation.

Stable error codes are `ACCOUNT_CHANGED`, `RECONNECT_REQUIRED`, `PROVIDER_TIMEOUT`, `CAPABILITY_UNAVAILABLE`, `USER_CANCELLED`, `BUSY`, `MAINNET_REQUIRED`, `SESSION_UNAVAILABLE`, and `PROVIDER_FAILURE`.

## Adding a wallet

1. Add one provider resolver under `src/lib/wallet/providers/` with a stable family and transport id.
2. Add capability mocks for connect, restore, writes, cancellation, timeout and unsupported methods.
3. Run the live matrix without spending first, then with the documented low-value limits.
4. Add the wallet/browser versions and evidence to `docs/wallet-live-testing.md`.
5. Run `npm run smoke:wallet`, `npm run smoke:premerge`, `npm test`, and `npm run build`.

## Forbidden patterns

- Importing `wallet/connect.ts` from a UI, console or runtime surface.
- Reading `window.XverseProviders`, `window.LeatherProvider`, or other injected providers outside provider modules/internal transport.
- Connecting through one Xverse bridge and writing through another.
- Falling back to `stx_getAccounts` after Xverse timeout/cancellation.
- Page-level account polling, account caches across user actions, or page-owned timeout policy.
- Persisting provider objects, raw transactions or secrets.
- Silently accepting an account change or bypassing expected-sender validation.
- Maintaining wizard bundle query versions independently.

## Required gates

Run `npm run smoke:wallet`. CI also retains `npm run smoke:premerge`, `npm test`, and `npm run build`. Live extension sign-off is manual and cannot be replaced by a green mock suite.
