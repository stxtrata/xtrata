# Operator Guide — Collections & Drops v3

Everything a second operator needs to build, verify, deploy and run the system. Read 01-ARCHITECTURE.md first for the design; this document is procedure.

## Repository layout

```
rebuild/
  contracts/   Clarinet project — xtrata-collection-v3.clar, xtrata-drops-v3.clar, mock-xtrata-core.clar
  client/      @xtrata/collections-client — hashing, manifests, planner, executor, typed contract clients
  relayer/     Sponsor relayer — platform-agnostic core + Cloudflare adapter
  ui/          Vite MPA — studio.html, drops.html, canary.html
  docs/        This documentation set
```

The approved core is **`xtrata-v3-2-3`** (mainnet `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`). v2.1.0 is out of scope. Core limits that govern everything downstream: 16 KiB chunks, **32** chunks per upload batch, **32** chunks (512 KiB) for a single-transaction mint, **50** seals per batch, **25** NFTs per escrow batch.

## Build and verify locally

```bash
cd rebuild/contracts && clarinet check && npm install && npm test
```
```bash
cd rebuild/client && npm install && npx tsc --noEmit && npm test
```
```bash
cd rebuild/relayer && npm install && npx tsc --noEmit && npm test
```
```bash
cd rebuild/ui && npm install && npx tsc --noEmit && npm test && npm run build
```

All four must be green before any deployment stage. The client is consumed by the UI over a `file:` link, so client changes take effect without publishing.

## Deployment

**Deployed Clarity contracts cannot be overwritten.** Recovery from a bad deploy means deploying a new version name and re-pointing the application and relayer. Plan version numbers accordingly (`-v3-0-0`, `-v3-0-1`, …).

Dependency order is fixed:

1. Core (`xtrata-v3-2-3`) — already deployed and approved; verify only.
2. `xtrata-drops-v3` — the singleton, one per network. Clarity **4**.
3. Collection contracts — one per collection, template-substituted, deployed from the Studio. Clarity **3**.

Use the **deployment canary** (`canary.html`) for every network. It walks the 15 required stages, blocks each deployment behind a typed confirmation, and produces a downloadable JSON + Markdown report. Two stages (contract tests, client/UI tests) are *operator-attested*, not machine-verified — the report records them as such along with the pasted output and attester name. Do not treat an attested stage as evidence you did not personally produce.

Never skip stage 12 (production approval) or stage 14 (post-deployment verification). Stage 15 is the only point at which application configuration should start pointing at the new contracts.

After deployment, set the collection contracts' `drops-authority` to the deployed drops-v3 principal — the assignment ledger rejects everything otherwise.

## Running the relayer

See `rebuild/relayer/README.md` for the endpoint contract and error codes. Required configuration: `SPONSOR_KEY` (hot wallet), `ATTESTOR_KEY` (only for signed-eligibility drops — its hash160 must match the on-chain `attestor-pubkey-hash`), the D1 binding, and the contract allowlist (drops-v3 only, per network).

Operational limits worth knowing before you enable sponsorship: the relayer refuses to sponsor below a 5 STX float, rate-limits per wallet and per origin, and trips a shutdown flag when fronted-minus-reimbursed exposure crosses the configured threshold. Rotate `set-sponsor` on-chain to revoke a compromised relayer instantly.

**Known limitation:** the per-drop audit ledger is currently in-memory per isolate. `sponsor_audit_v3` exists in `schema.sql` but is not yet written, so exposure totals reset on Worker restart. Persist it before enabling sponsored mode in production.

## Creator workflow (Studio → Drop Builder)

1. **Studio → Setup**: configure the collection, deploy the template, verify the deployed source hash.
2. **Import**: add files; ordering is deterministic and duplicates are detected locally before any transaction.
3. **Plan**: review chunk/transaction/cost breakdown. Batch size is an execution limit, not a collection-size limit.
4. **Run**: the executor reserves, uploads, seals and indexes each item. Interruptions are safe — every resume reconciles against chain state first. Export the checksummed manifest if the work will continue on another device.
5. **Complete**: review the report, then `close-supply` / `finalize`, then hand off to the Drop Builder.
6. **Drop Builder**: select the collection, use *select all unassigned* (one action, index-based — works regardless of how many transaction batches the collection took), review the resolved inventory, choose the mode, configure limits and timing, review sponsor exposure, fund and activate.

## Mode language (do not deviate)

Only a **sponsored** drop may be described as free. A **zero-price mint** charges no mint price but the collector still pays the network transaction fee, and the UI must say so. See the cost table in 01-ARCHITECTURE.md §6 for who pays inscription storage, mint price, transaction fees, and retries in each mode.

## Recovery

- **Abandoned reservations**: expire after the configured window and are releasable by anyone; the index returns to the free list and the collection stays dense.
- **Interrupted collection work**: re-open the Studio, import the manifest if on a new device, and resume — chain state is authoritative and a retry for an already-indexed item is a no-op.
- **Unclaimed drop inventory**: `end-drop` or `cancel-drop`, then `recover-batch` in bounded batches; NFTs return, assignments clear, remaining budget refunds.
- **Bad deployment**: deploy a new contract version and re-run the canary. There is no in-place fix.

## Source of truth

The blockchain and the approved contracts are authoritative. Browser storage, exported manifests, and indexers are caches. Any tool that disagrees with chain state is wrong.
