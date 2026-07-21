# Xtrata Wallet Playbook — hard-won rules for Xverse + Leather

This file is the single source of truth for wallet-connect and signing behaviour
on Xtrata (desktop and mobile). Every rule below was paid for with a production
or staging incident during June–July 2026 testing. **Do not "clean up" code that
looks redundant here without reading this file** — most of these rules exist
because the obvious implementation breaks in a way unit types cannot catch.

Enforced by tests: `src/lib/wallet/__tests__/connect.test.ts`,
`adapter.test.ts`, `wallet-invariants.test.ts`, and
`src/agent-one/__tests__/wallet-payment.test.ts`. If one of those fails, a rule
below is being violated — fix the code, never weaken the test.

## 1. Xverse has TWO provider bridges — session and transaction must use the SAME one

Xverse injects a legacy `XverseProviders.StacksProvider` and a Sats Connect
`XverseProviders.BitcoinProvider`. The per-origin session (created by
`wallet_connect`) lives on the BitcoinProvider object. Any signing request
(`stx_callContract`, `stx_transferStx`, `stx_signTransaction`) sent on the
*other* bridge is rejected as **"Network mismatch"** even with byte-identical
params and the correct network.

Rule: all Xverse RPC goes through `getXverseRpcProvider()` (the BitcoinProvider,
resolved on the host window — see §5). `requestWalletRpc` enforces this for any
provider that identifies as Xverse. The legacy StacksProvider is never used for
Xverse after a modern `wallet_connect` (it has no session, and the legacy
popup flows fail with "Unexpected error creating transaction").

## 2. Xverse validates requests against the sats-connect schema — send spec params ONLY

Out-of-spec fields are not ignored:

- `stx_transferStx` with `network` / `address` / `sponsored` / `fee` / `nonce`
  → rejected as **"Network mismatch"** (July 21 incident; regression of the
  July staging fix). Send only `{recipient, amount, memo}`.
- `stx_callContract` with an explicit `sender` field → Xverse **mobile** reads
  it as "sign as this address", compares with its own (sometimes empty)
  connection record and rejects before any UI ("requesting signature from a
  different address. (undefined)"). Send only
  `{contract, functionName, functionArgs, arguments, postConditionMode, postConditions}`.
  (`arguments` duplicates `functionArgs` because older builds only read the
  former.) Sender correctness is enforced on OUR side by the account preflight.

The payment test asserts `toEqual` on the exact transfer params, so adding any
field fails CI by design.

## 2b. Stale per-origin sessions cause "Network mismatch" that NO preflight can prevent

Xverse's stored per-origin session records the network it was created under. If
the wallet's active network setting has changed since (or the session predates a
wallet update), signing requests are rejected with "There's a mismatch between
your active network and the network you're logged in with on the app" — while
`wallet_getAccount` still answers with the correct address, so the account
preflight passes (July 21 evening incident, diagnosed from the
`[wallet:xverse-preflight]` READ_OK → transfer-rejected log pair).

Rule: every Xverse signing request goes through `requestXverseSigning`, which
on a network-mismatch rejection drops the session (`wallet_disconnect`),
re-runs `wallet_connect` on the same BitcoinProvider, verifies the reconnected
account matches the expected sender, and retries ONCE. User rejections are
never retried (`isNetworkMismatchError` gates the recovery). Tests assert the
exact call sequence and the non-retry of rejections.

## 3. Account preflight: cache → wallet_getAccount (30s cap) → wallet_connect. NEVER stx_getAccounts

Before any Xverse signing request, `ensureXverseSigningAccount` confirms the
active account **on the same BitcoinProvider**:

1. A cached account confirmed within the last 45s is reused
   (`rememberXverseAccount`: seeded by `wallet_connect` at connect time and by
   successful reads; cleared on disconnect). This exists because
   `wallet_getAccount` can take 12–15s or never answer.
2. Otherwise `wallet_getAccount`, bounded by a 30s timeout so a silent wallet
   can't hang the payment.
3. Otherwise re-run `wallet_connect` on that bridge (restores the session for
   fresh browsing sessions / mobile in-app browser, which starts a new dapp
   session each visit).

**`stx_getAccounts` must never be used in this preflight**: on current Xverse
it opens a "Mismatched Network" permission prompt which gets rejected and
surfaces to the user as "Network mismatch" (July 17 + July 21 canaries). The
fallback-order test locks this out.

A mismatch between the confirmed account and the address the post-conditions
were built for **aborts** the call (`WALLET_ADDRESS_MISMATCH`) — never silently
re-target a transaction.

## 4. Users choose their wallet AND account on every connect

- `connectWallet` always opens the provider-select modal
  (`forceWalletSelect: true`); `adapter.connect()` must never short-circuit on
  the persisted localStorage session (cancelling the chooser keeps the previous
  session).
- Xverse only shows its account picker on a *fresh* `wallet_connect`; while a
  per-origin permission exists it silently reuses the old account. Connect
  therefore issues a best-effort `wallet_disconnect` on the BitcoinProvider
  first, forcing the account chooser every time. Older builds without the
  method fall through unchanged.

## 5. Iframes: detect and resolve providers on the TOP same-origin window

The wizard runs at `/wizard/?embedded=1` inside a same-origin iframe. Wallet
extensions inject providers into the **top window only**, and @stacks/connect
ships an Asigna shim that defines `window.AsignaProvider` inside *every*
iframe. Detecting on the iframe window therefore shows Asigna as "installed"
and hides the real wallets (July 21 incident).

Rule: `getWalletHostWindow()` returns the top same-origin window (cross-origin
parents fall back to the local window). `getInstalledProvidersOnHost` (chooser
modal) detects on the host window ONLY; `resolveProviderById`,
`getStacksProvider`, `getXverseRpcProvider` and `isSelectedXverseProvider` all
resolve through it. Never call connect-ui's `getInstalledProviders` directly.

## 6. Mobile-specific behaviour

- Xverse mobile can reject a request with only an in-app toast and leave the
  RPC promise pending forever. Every Xverse contract call runs under a 90s
  watchdog (`XVERSE_SIGNING_TIMEOUT`, kept below the arcade bridge's 180s
  timeout) that reports which stage hung and with which addresses.
- The mobile in-app browser starts a fresh dapp session per visit — the
  preflight's `wallet_connect` fallback (§3) is what makes signing work there.
- `wallet_connect` results can mix BTC + STX purposes in one `addresses` list;
  `extractStacksAddress` walks the payload and validates rather than assuming a
  shape.

## 7. Leather

- Connect order: `getAddresses`, `stx_getAccounts`, `stx_getAddresses`,
  `stx_requestAccounts`, `wallet_connect`, filtered by the advertised
  `supportedMethods` when available (advisory only — older builds expose
  `getAddresses` without `supportedMethods`).
- Leather's documented `getAddresses` response may omit the STX public key: the
  sponsored-signing path binds the spending-condition signer to the validated
  connected address instead of requiring the key.
- Disconnect tries `stx_disconnect` / `wallet_disconnect` / `disconnect` /
  `deactivate` in order, tolerating unsupported responses.

## 8. Sponsored (origin-only) signing

`stx_callContract` broadcasts immediately — a sponsored claim must use
`stx_signTransaction` with `broadcast: false` (Xverse) or Leather's
`stx_signTransaction` with `txHex`, so the relayer can attach the sponsor
signature. Current Xverse reports a premature broadcast as SignatureValidation.

## 9. Sessions self-heal

`@stacks/auth` throws "JSON data version undefined not supported" when
localStorage holds a session written by a different @stacks/connect major.
`sanitizeStoredWalletSession()` drops unparsable/unversioned sessions at module
load AND at the start of every `connectWallet` (another tab may have written
one in between). Without this the wallet simply never opens.

## 10. Ship checklist for ANY wallet change

1. `npx vitest run src/lib/wallet/__tests__ src/agent-one/__tests__/wallet-payment.test.ts`
   — all suites green, no assertions weakened.
2. Rebuild BOTH wizard bundles: `npx vite build -c vite.agent-one-wallet.config.ts`
   and `npx vite build -c vite.agent-one.config.ts`, then `npx vite build`.
3. Bump `agent-one.js?v=<n>` in `xtrata-agent-one/wizard/{index,manifests,suno}.html`
   (all three MUST match — the cache-bust test enforces it) and sync
   `dist/wizard/`.
4. Update `CHANGELOG-2.0.md`.
5. Manual canary after ANY Xverse/Leather extension update: connect (expect the
   wallet chooser, then Xverse's account picker), pay a small STX transfer from
   the embedded wizard, and sign one contract call — desktop AND mobile. The
   wallet extensions change under us; §1–§3 all originated from Xverse-side
   changes no unit test could predict.

Console logging: all wallet stages log under `[wallet:connect]`,
`[wallet:xverse-preflight]`, `[wallet:contract-call]`, `[wallet:sponsored-sign]`
— ask users for these lines when reporting wallet issues.
