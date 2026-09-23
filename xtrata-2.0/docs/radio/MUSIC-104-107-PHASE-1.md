# Phase 1 — fee sizing, diagnostics and consent boundaries

Branch: codex/music-104-107. Builds and publication remain gated.

Implemented:
- Construct an unsigned play using the pinned SDK and explicit fee/nonce, reject
  any serialized size other than 257 before signing, then apply max(chosen,257).
- Apply effective fee to run budgets/balance checks. Listening approval below
  257 is refused for review rather than silently increasing an approved fee.
- Explicit authorization callback checked after asynchronous preparation and
  again after durable journal save, immediately before broadcast. The existing
  kill switch, storage health and stop-epoch checks remain in force.
- Add decimal nonce, bytes, chosen/effective fee, reason, estimate slot,
  submission/confirmation times, block and elapsed confirmation seconds. Estimates
  are null until the Phase 4 estimator exists; no estimate is fabricated.
- Persist bounded node rejection reason on HTTP 4xx while keeping uncertain
  submissions prepared and blocking a second signature.
- Explicit diagnostic field projection strips raw bytes, nested attempt bytes,
  unknown fields and listening session credentials from UI/report output.
- Default play fee is 257 in local/lounge controls and Windows storage smoke;
  return-transfer fee remains 300 (different transaction type).

Tests:
- Existing browser signer already asserts 257-byte serialization; it is retained
  and passed. Browser signing behaviour was not changed.
- Recovery fixture now explicitly creates a pre-upgrade signed 200-microSTX
  journal; existing expected recovery behaviour is unchanged. A new signer can
  no longer be used to manufacture that legacy below-floor fixture.
- Added floor/size-drift rejection, actual 257-byte signed transaction inspection,
  persisted 4xx rejection, safe nested diagnostics and consent revocation after
  save tests. Transport is mocked and profiles disposable.
- Targeted lint passes for listening logic/UI, report and Windows storage entry.
  Whole-repository lint reports 274 errors. Backend has the same two pre-existing
  no-unsafe-finally findings in baseline and working versions; no rules disabled.
  Other reported examples are unused variables in unrelated dataing/collection
  scripts. These are recorded rather than silently fixed in the payment change.

Not yet implemented: queued nonces, threshold listens, structured receipts,
fee estimation/automatic bumps, version bumps and installers. The old sequential
payment path remains in place until subsequent phases pass.

The supplied brief says “Phases — stop at each gate and report”. This is the
Phase 1 checkpoint; no mainnet signing, funded-wallet access, contract edits,
installer publication or manifest change occurred.
