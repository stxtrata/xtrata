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

## 1. Xverse has separate request and legacy transaction bridges

Xverse exposes a Sats Connect/WBIP BitcoinProvider for account connection and
contract calls. Its older Stacks bridge varies by frame: the standalone wizard
gets `XverseProviders.StacksProvider`, while the embedded wizard can get only a
generic `StacksProvider` whose `request()` is an intentional unimplemented stub
but whose `transactionRequest()` still works.

Rule: connection, reads, contract calls and sponsored signing stay on the real
registered BitcoinProvider. STX payment prefers the exact dotted StacksProvider
`request()` used by `main-staging-sol`; when embedding removes that object, use
the generic legacy `transactionRequest()` bridge. Never call `request()` on the
generic `StacksProvider`. BitcoinProvider transfer is a minimal-params last
resort only when neither legacy bridge exists.

## 2. Request shape follows the provider bridge

Out-of-spec contract-call fields are not ignored:

- `stx_transferStx` on the exact dotted StacksProvider uses the complete
  `buildStxTransferParams` shape: recipient, amount, memo, network, connected
  address, sponsored, fee and nonce. This is the request proven by the working
  `main-staging-sol` wizard. Do not substitute the minimal BitcoinProvider
  `{recipient, amount, memo}` request: that route caused the July 21 production
  mismatch loop. The generic embedded `transactionRequest` path receives the
  legacy signed token built by @stacks/connect. The BitcoinProvider fallback,
  if no legacy transaction bridge exists, receives only those three spec fields.
- `stx_callContract` on BitcoinProvider with an explicit `sender` field → Xverse **mobile** reads
  it as "sign as this address", compares with its own (sometimes empty)
  connection record and rejects before any UI ("requesting signature from a
  different address. (undefined)"). Send only
  `{contract, functionName, functionArgs, arguments, postConditionMode, postConditions}`.
  (`arguments` duplicates `functionArgs` because older builds only read the
  former.) Sender correctness is enforced on OUR side by the account preflight.

Tests cover all three routes and, critically, assert that the embedded generic
StacksProvider's unimplemented `request()` is never touched.

## 2b. Contract-call recovery remains bounded to the BitcoinProvider

Xverse's stored per-origin BitcoinProvider session can retain an obsolete
network binding. A contract call can therefore be rejected even when
`wallet_getAccount` still answers with the expected address. The original July
21 assumption that this also explained STX payment failures was falsified by a
field log in which disconnect/connect succeeded and the retried transfer failed
identically. That transfer now prefers the legacy Stacks transaction bridge (§1).

Rule: Xverse BitcoinProvider contract calls and the no-legacy payment fallback go through `requestXverseSigning`, which
on a network-mismatch rejection drops the session (`wallet_disconnect`),
re-runs `wallet_connect` on the same BitcoinProvider, verifies the reconnected
account matches the expected sender, and retries ONCE. User rejections are
never retried (`isNetworkMismatchError` gates the recovery). Tests assert the
exact contract-call sequence. The primary legacy STX payment routes are outside
this wrapper; only the last-resort BitcoinProvider payment uses it.

## 3. Account preflight: cache → wallet_getAccount (30s cap) → wallet_connect. NEVER stx_getAccounts

Before an Xverse BitcoinProvider contract call, `ensureXverseSigningAccount` confirms the
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
parents fall back to the local window). `getInstalledProvidersOnHost` merges
current `btc_providers`/`webbtc_providers` metadata with legacy
`webbtc_stx_providers` on the host window ONLY; `resolveProviderById`,
`getStacksProvider`, `getXverseRpcProvider` and `isSelectedXverseProvider` all
resolve through it. The obsolete `XverseProviders.StacksProvider` chooser id is
an alias for the registered request bridge if the dotted object is missing, and
an `undefined` modal callback is recovered from the id connect-ui already
persisted. Never call connect-ui's `getInstalledProviders` directly.

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
3. Bump the build stamp. `AGENT_BUILD` in `src/agent-one/agent-core.ts` is the
   source of truth (`YYYY-MM-DD.N`); `deploy-freshness.test.ts` requires every
   `agent-one.js?v=` in `xtrata-agent-one/wizard/{index,manifests,suno}.html` to
   equal it, and suno's `XAO_MIN_AGENT_BUILD` to be no newer than it. That is
   **five** references across four files, not three. Then sync `dist/wizard/`.

   Bump it whenever the bundle's behaviour or API surface changes, not only for
   wallet work: a stale buster leaves the browser on an old bundle, which
   presents as a feature reporting itself "unavailable (old agent bundle)"
   rather than as an error.
4. Update `CHANGELOG-2.0.md`.
5. Manual canary after ANY Xverse/Leather extension update: connect (expect the
   wallet chooser, then Xverse's account picker), pay a small STX transfer from
   the embedded wizard, and sign one contract call — desktop AND mobile. The
   wallet extensions change under us; §1–§3 all originated from Xverse-side
   changes no unit test could predict.

Console logging: all wallet stages log under `[wallet:connect]`,
`[wallet:xverse-preflight]`, `[wallet:stx-transfer]`, `[wallet:contract-call]`, `[wallet:sponsored-sign]`
— ask users for these lines when reporting wallet issues.
