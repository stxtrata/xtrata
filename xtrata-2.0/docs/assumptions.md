# Assumptions and Stubs

- Wallet sessions are mainnet-only; anything that resolves to testnet is treated as disconnected.
- If a wallet session omits network info, infer network from address prefix (SP/SM -> mainnet, ST/SN -> testnet) before enforcing mainnet-only behavior.
- Wallet selection, address discovery, and JSON-RPC normalization use the Stacks Connect 8 compatibility layer; do not probe Leather/Xverse provider methods directly.
- Sponsored claims are sign-only origin transactions with `broadcast: false` and a zero origin fee. If sponsored signing fails, never silently replace it with a self-paid transaction.
- The Pages sponsor relayer derives and validates its public address from `SPONSOR_KEY` on every request. Before reserving a claim it must match the target contract's public `get-sponsor` value; `/sponsor/quote` returns the derived `sponsorAddress` for operational checks.
- Relayer infrastructure failures return a safe phase-specific code plus a request ID, while detailed causes remain in server logs. A job reserved before a nonce, countersign, or broadcast exception is marked `ABANDONED` instead of remaining indefinitely in `RECEIVED`.
