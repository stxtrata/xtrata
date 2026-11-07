# Xtrata × DEorganized signing integration proposal

Prepared 12 September 2026 against `stacks-passkey-wallet@0.4.0`, commit `1e85e68ab95fcb6e0965b99a19b2f68271854540`, and the Xtrata source hashes in `provenance.json`.

## Current position

The older August discussion is no longer the API baseline. Version 0.4.0 already ships `signStacksTransaction` and `signStacksTransactionWithRoot`. It refuses a mismatched origin address and refuses Allow-mode asset movement unless deliberately opted into. Standard signing returns a final transaction ID; sponsored origin signing does not. Our contribution should integrate and exercise this API, rather than propose a duplicate signer.

Local evidence: 81 upstream tests pass; the independent vector verifier passes and its five negative controls detect their intended errors. Our additional 17 tests include 12 three-way address comparisons, negative identity checks, standard/sponsored adapter behavior, and eight refusal scenarios. These are software checks with public synthetic inputs, not proof of mobile ceremonies or production safety.

## Preserve existing wallet identity

Xtrata generates an independent mnemonic, then seals the derived seed with a passkey-derived encryption key. DEorganized derives a mnemonic deterministically from the PRF output. The same passkey input is therefore not expected to produce the same wallet in these two designs. Changing Xtrata's salt or replacing its seed with DEorganized's PRF-derived root would move users to different addresses.

The compatibility boundary is **the same BIP-39 mnemonic/seed and account-0 path**. The 12 comparisons agree across the exact bundled Xtrata module (Stacks SDK 6.17.0), DEorganized's v0.4.0 pipeline (Stacks SDK 7.5.0), and `@stacks/wallet-sdk` 7.5.0. Four DEorganized vectors were tested on both Stacks networks, plus Xtrata's 24-word known-answer phrase and 12-word import on both networks. Different account indexes and different salts remain different identities. Bitcoin derivation is covered by their verifier, not by an Xtrata Bitcoin implementation.

Recommendation: keep Xtrata's existing envelope wallets as their current wallet type. A DEorganized-derived wallet can be a separately named type or a deliberate new-account path. Do not silently convert an existing wallet or reassign its recovery expectations. Both paths can use the same downstream reviewed-transaction protocol.

## Wallet-owned review and signing boundary

The wallet must live on a dedicated trusted origin if we want an XSS on the public Xtrata app to be unable to read signing secrets. A path or same-origin iframe is not sufficient isolation. The standalone canary is a test origin, not an implementation of this embedded isolation.

The embedding app proposes a transaction. The wallet origin independently decodes it and shows the actual network, target, function, arguments, asset conditions, recipient, fee and payer before asking for authorization. The review policy is created and retained by the wallet, not accepted from the embedding application's untrusted request.

Suggested protocol:

| Method | Input | Result |
|---|---|---|
| `wallet.status` | Requested supported network | Public address, supported capabilities and selected wallet type |
| `wallet.create` | Explicit new-wallet choice | Public account after create **and** a proven PRF get round-trip |
| `wallet.review` (proposed addition) | Serialized unsigned transaction and app intent ID | Public review summary and short-lived opaque approval handle |
| `wallet.sign` | Approval handle; fresh wallet-origin user action | Complete or origin-signed result, as below |
| `wallet.revealPhrase` | Fresh wallet-origin authorization | Acknowledgement only; phrase displayed inside the wallet origin |
| `wallet.preSignReturn` | Separate, explicitly approved session-return policy | Deferred until its nonce/fee/expiry/replay policy has its own review |

Do not implement `preSignReturn` by routing arbitrary supplied bytes through the generic signer without that session policy. Its signature authorizes future movement and deserves separate lifecycle tests.

Exact origin checks are necessary on both sides, together with expected `event.source` checks. The wallet should accept requests only from the embedding parent it initialized with, correlate unguessable IDs, reject duplicate/in-flight IDs and malformed schemas, expire approvals, and require a wallet-origin user gesture for signing. Bind the approval to the exact unsigned bytes and origin, not to an untrusted text description. A digest alone is not authentication; the reviewed bytes must be retained or compared against a trusted approval record. A parent-provided `approved: true` is not approval.

The new `adapter.ts` demonstrates the downstream boundary: it checks exact reviewed bytes, Testnet version **and** chain ID, a pinned contract/function scope, Deny mode, unsigned single-sig origin and miner-fee bounds; calls the shipped signer; verifies the signature; then normalizes away the signature to prove all remaining transaction bytes match the review. It deliberately has no broadcaster.

This adapter does **not** implement the entire iframe transport, a production user-consent system, login verification, persistent nonce reservation or application-specific asset-policy validation. Those belong to the wallet/sponsor integration before production adoption.

## Return shapes and sponsorship

Upstream returns `Uint8Array` transaction bytes. Xtrata's existing `assertNoSecrets` rejects all raw byte arrays on the bridge, so returning upstream's object directly does not fit that protocol. The adapter encodes only the signed transaction as hex and returns an explicit public schema:

```ts
type WalletSignResult =
  | { kind: 'complete'; transactionHex: string; txid: string; publicKey: string }
  | { kind: 'origin-signed'; transactionHex: string; publicKey: string };
```

An origin-signed sponsored transaction has no final txid to persist as a broadcast receipt. Persist the operation intent and reserved **origin nonce**, then hand the bytes to the sponsor. The sponsor re-decodes and validates its contract/function/arguments, post-conditions, origin signature, fee policy and intended beneficiary, reserves its own nonce, signs, persists final bytes and final ID, and only then broadcasts. Retries use the identical final bytes. Our adapter test uses origin nonce 3 to ensure sponsorship does not incorrectly zero it; origin fee is zero, with the sponsor paying its own approved fee.

For protocol payments, Deny mode is necessary but not a complete spending policy. The trusted application policy must validate the relevant payer conditions and an independent absolute ceiling. Miner fees require a separate budget; they are not bounded by STX transfer post-conditions. No Allow-mode override is exposed by the test adapter.

## Memory, errors and claims to narrow

- PRF output **does reach browser JavaScript**. The authenticator's underlying secret is protected; the returned PRF output is usable key material. Xtrata's envelope comment saying the returned secret never leaves the authenticator should not be used as a security claim.
- Root/buffer wiping is best effort in JavaScript. Strings and derived-key copies can remain until garbage collection. Neither implementation should promise that `fill(0)` proves every copy disappeared.
- Xtrata's `assertNoSecrets` is a naming/type heuristic, not proof that arbitrary strings contain no secret. Use exact result schemas and discard unexpected fields. Its current generic bridge error path forwards a handler's error message; production handlers should return controlled error codes and sanitized messages rather than arbitrary library exceptions.
- Origin allowlisting alone does not distinguish the intended parent window from another window at that origin. Add expected-source and approval/replay handling around the existing bridge host before treating it as a production consent boundary.
- Upstream's backup-eligibility gate runs at creation. Its `get` path does not apply that gate. The canary records this distinction instead of labeling every successful sign-in as a proven synced credential.

These are review findings and integration requirements. This work does not silently modify the live Xtrata wallet or claim a demonstrated exploit against deployed wallets.

## Shared browser test plan

The canary requests `userVerification: required` and uses the library's frozen salt. Creation is followed by a dedicated get operation. Repeated sign-in compares the public address; a second device can paste the first device's public expected address. Offline signing verifies a Testnet contract-call signature and discards the bytes. The report exports only structured public results plus explicitly entered device notes, never PRF values, credential IDs or signed transaction bytes.

Use disposable credentials. Do not import or test an existing funded wallet. The software button uses only published synthetic vectors. For a shared phone trial, both teams must agree one HTTPS origin and RP-ID policy before creating credentials. Localhost is useful for desktop software checks but cannot provide a common origin across two devices.

Record exact OS/browser/provider versions, origin, creation/get outcome, expected-address comparison, signing result, cancellation/QR behavior and Stolen Device Protection state where relevant. `NotAllowedError` is an inconclusive ceremony failure, not proof of absent PRF support. A timeout on a starved main thread is also not reliable evidence; runtime responsiveness needs its own watchdog/diagnostic test outside that blocked execution context.

Still pending: real Safari/iOS and Chrome/iOS runs, Android/desktop provider combinations, device-sync continuity, recovery export/import on test wallets, and the embedded origin-isolation/replay tests. The page is ready to collect the first set; it does not claim all those tests are implemented or passed.

## Dependency and rollout notes

The locked install reported five audit findings in development-only dependencies: Vitest/mocker, esbuild, nanoid and PostCSS. All reported affected nodes are marked dev-only in the lockfile. We kept the upstream lockfile intact for reproduction. Refresh and retest that build toolchain before exposing a shared development server; the local canary is served by a small Node static server, not Vite's development server.

Suggested next agreement in issue #12: adopt the shipped v0.4.0 result union, agree the wallet-owned review/source-validation boundary, nominate the shared HTTPS canary origin, and exchange the resulting device reports. This is a compatibility contribution and test prototype, not a request to replace either team's wallet identity.
