# Assumptions and Stubs

- Wallet sessions are mainnet-only; anything that resolves to testnet is treated as disconnected.
- If a wallet session omits network info, infer network from address prefix (SP/SM -> mainnet, ST/SN -> testnet) before enforcing mainnet-only behavior.
- The revisioned coordinator record is the sole connected-account source of truth.
  `BroadcastChannel` propagates immediately and the storage event is the fallback.
- An extension account/provider change produces `RECONNECT_REQUIRED`; no tab may
  silently replace the connected address.
- Every write validates its expected sender/funder against the coordinator session.
  Wizard refund, inscription recipient and expected-funder roles remain distinct.
- Xverse uses one transport family for the complete session. There is no
  `stx_getAccounts` fallback, automatic polling, or completed account-read cache.
