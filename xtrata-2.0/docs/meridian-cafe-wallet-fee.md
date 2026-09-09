# Meridian café payment bridge support

9 September 2026. Companion to Timeloop Detective v1.3.4.

The runtime STX transfer bridge now forwards an inscription's bounded `fee` request through the existing `parseRuntimeFee` helper. The café asks for 1,000,000 microSTX to its fixed recipient and a separate 3,000 microSTX network fee. Omitted fees retain wallet estimation. The modern Xverse RPC fallback also carries an explicitly supplied fee. A wallet can override or reject a requested fee; the final wallet approval remains authoritative.

The runtime binds a transfer to the connected wallet address and network, rejects a changed requested sender, and passes wallet errors back to the inscription instead of leaving it waiting for a timeout. No recipient or application-specific price is added to the host. Existing inscriptions that do not supply an address or fee remain supported.

Validation: 50 targeted tests in the wallet-connect and runtime-fee suites passed. A Vite production build to a temporary output directory passed. The repository-wide TypeScript check is not clean: an in-memory comparison with the original three modified files found 3,818 baseline diagnostics and 3,822 current diagnostics. The four additional occurrences are the existing `ExpectStatic` call-signature error pattern in the added tests; no new file/code/message diagnostic combination appeared. No changes were made to those unrelated typing problems.

No deployment, signature, payment or blockchain broadcast was performed. These host changes must reach the actual Xtrata viewer before that viewer can forward the café's fee request. The standalone game presents the requested fee honestly and instructs the player to check the wallet's final amount. Compatibility with a real wallet/provider still needs a user-reviewed smoke test.
