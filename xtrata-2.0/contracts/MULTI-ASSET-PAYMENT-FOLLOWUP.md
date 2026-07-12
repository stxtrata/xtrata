# Multi-asset payment — contract-side follow-up (WS-3.2)

The web app now has everything needed to let users pay the protocol fee in a
non-STX SIP-010 asset (sBTC, USDCx, and USDT once a mainnet contract id is
verified):

- `src/lib/contract/payment-assets.ts` — `getAvailablePaymentAssets(capabilities)`
  and `buildPaymentPostCondition(...)` (exact-amount `Equal` fungible
  post-condition per asset).
- `src/lib/contract/fungible-assets.ts` — the asset registry (USDCx, sBTC).
- `src/lib/pricing/*` — USD/GBP display for every asset amount.

**What is intentionally NOT shipped in the UI:** the payment-asset picker is
gated on `ContractCapabilities.supportsMultiAssetPayment`, which is `false` for
every shipped core version. So today the mint flow is STX-only and the picker is
hidden — we do not present an asset the contract cannot actually accept.

## To enable multi-asset payment

1. **Contract:** add a mint entrypoint (or extend the existing one) that accepts
   a SIP-010 `<ft-trait>` payment principal + amount and performs the
   `contract-call? transfer` for the protocol fee in that asset, with an
   equivalent-value check against the STX-denominated fee. Deploy as a new core
   version.
2. **Capabilities:** set `supportsMultiAssetPayment: true` for that version in
   `src/lib/contract/capabilities.ts`.
3. **USDT registry:** confirm the canonical USDT SIP-010 mainnet contract id on
   the Hiro explorer and add it to `KNOWN_FUNGIBLE_ASSETS` (decimals +
   `priceAssetKey: 'usdt'`). As of 2026-07 no such contract could be verified,
   so it is deliberately omitted rather than hardcoded.
4. **Mint tx:** attach `buildPaymentPostCondition(...)` to the transaction and
   route the payment leg to the new entrypoint.

Pricing already sources USDT (Coinbase `USDT-USD`) and the picker will surface
any registered asset automatically once the capability flag flips.
