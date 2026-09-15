# Collection v1.5 deployment canary

The HTML deployment console now includes collection v1.5 at
`/web/deploy-console.html#collection-v15-deployment`.

Read-only preflight validates pinned mainnet source, principals, target name,
core ABI presence and current core fees/pause state. Existing deployments also
require byte-identical source, expected core binding, the atomic chunk limit,
supply/reservation invariants and matching minted/index counters. Admin,
metadata, pricing, recipients, splits and dependency reads are logged for review.
API failures fail closed. Reads are sequential to avoid a new burst.

Deployment is intentionally blocked in this publisher: Clarinet tests the
candidate as Clarity 3, whereas the existing console uses a Clarity 4 wallet
publisher (including documented wallet version override behaviour). The source
must not be silently published as Clarity 4. A tested version-preserving publish
path or a separately tested Clarity 4 migration is required before enabling it.
The source can be downloaded for review. No wallet or on-chain tests were run.

Before launch, configure inventory and collection terms while paused; run local
simulations/disposable-wallet tests for duplicate rejection, reservations,
staged and atomic minting and receipt attribution. Separate storage-worker
configuration and recovery/reconstruction verification are required for cleanup.
Never purge core chunks belonging to sealed inscriptions.

Validation: targeted canary tests and production Vite build. No deployment.
