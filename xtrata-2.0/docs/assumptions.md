# Assumptions and Stubs

- Wallet sessions are mainnet-only; anything that resolves to testnet is treated as disconnected.
- If a wallet session omits network info, infer network from address prefix (SP/SM -> mainnet, ST/SN -> testnet) before enforcing mainnet-only behavior.
- Wallet selection, address discovery, and JSON-RPC normalization use the Stacks Connect 8 compatibility layer; do not probe Leather/Xverse provider methods directly.
- Sponsored claims are sign-only origin transactions with `broadcast: false` and a zero origin fee. If sponsored signing fails, never silently replace it with a self-paid transaction.
