# Agent One recovery ownership fix

## Summary

Recovered inscriptions were successfully transferred on-chain from the Agent One
one-shot wallet to the user's wallet, but Xplorer could continue showing the
one-shot wallet as owner. The mismatch came from cached D1 token summaries and
browser summary caches, not from a failed NFT transfer.

## Permanent behaviour

- Agent One refreshes the D1 ownership summaries for the exact token IDs after
  recovery has completed and on-chain ownership has been verified.
- Index refresh is deliberately best-effort. It runs after the ephemeral key is
  deleted and can never change a successful recovery back to `NEEDS_RECOVERY`.
- Forced index reads bypass both IndexedDB and Cloudflare edge caches.
- Xplorer live-checks the selected token owner against the contract and repairs
  its in-memory and IndexedDB summaries when the indexed owner is stale.
- Hiro wallet holdings are treated as authoritative direct holdings. Injected
  Forever Twins are excluded because their Xtrata owner is intentionally an
  escrow helper contract.
- A detected mismatch requests a targeted D1 refresh for only the affected token
  IDs, avoiding a broad or destructive re-index.

## Existing recovered batch

The chain already reports inscriptions `#2763` through `#2772` in
`SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7` (jim.btc). After deployment,
opening that wallet or selecting one of these inscriptions corrects Xplorer
immediately and repairs the persistent index in the background.

## Verification

- Ownership/recovery regression suite: 37 tests passed.
- Standard pre-merge smoke suite: 81 tests passed.
- ESLint passed with zero warnings.
- Complete production build passed.
- No live transfer or production index mutation was performed by the tests.

Implementation commit: `94e5e326b19068b380df10577e3d7f80637e40a8`.
