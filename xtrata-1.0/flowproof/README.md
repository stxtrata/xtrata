# FlowProof

**Self-documenting money on Stacks.** Every FlowVault flow emits a permanent,
recursively-linked **Xtrata v3.2.3** inscription. FlowVault moves the money;
Xtrata makes the movement provable forever and chains it into a verifiable
financial lineage.

Built for the **FlowVault Builder Bounty**. Flagship behavior: provenance-bound
creator royalties — inscribe a work, route its sales through FlowVault
(auto-split + time-lock), and mint a recursive royalty receipt for every payout.
The same engine runs payroll and DAO treasuries with one config change.

> Why it can't be cloned: the differentiator — recursive, fully on-chain
> receipts with a queryable lineage graph — *is* Xtrata's core protocol, not a
> contest add-on.

---

## How it composes

```
User/Agent ─▶ FlowVault (money)            ─▶ split → lock → hold      [flowvault-v2]
                  │ get-vault-state
                  ▼
            Proof-of-Flow orchestrator ─▶ canonical receipt (JSON, 1 chunk)
                  │
                  ▼
            Xtrata (record)  mint-single-tx-with-relationships          [xtrata-v3-2-3]
                  deps   = [assetInscription]   (the work; must exist)
                  parents = [prevReceipt]        (lineage chain)
                  ▼
            asset ◀ R1 ◀ R2 ◀ …   permanent, verifiable, queryable
```

Two integration patterns (see `docs/ARCHITECTURE.md`):

- **Pattern A — app/agent orchestration** *(this scaffold)*. Autonomous server
  signer runs the FlowVault flow, then inscribes the receipt. Ships fast.
- **Pattern B — on-chain composing contract** *(roadmap)*. A `flowproof-treasury`
  Clarity contract that deposits to FlowVault and inscribes via Xtrata
  atomically in one tx.

## Modeled on the live contracts

| Layer | Contract | Key calls used |
|---|---|---|
| Money | `STD7QG84VQQ0C35SZM2EYTHZV4M8FQ0R7YNSQWPD.flowvault-v2` (testnet) | `set-routing-rules`, `deposit`, `get-vault-state`, `get-current-block-height` |
| Record | `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3` (mainnet live) | `mint-single-tx`, **`mint-single-tx-with-relationships`**, `quote-single-tx-fee`, `get-inscription-summary`, `get-parents`, `get-dependencies` |

v3.2.3 inscribes a receipt **and** its lineage edges in a single transaction —
no staged upload, no helper contract.

## Network coherence (read this first)

FlowVault is **testnet-only**; Xtrata v3.2.3 is **live on mainnet**. For one
coherent demo, deploy `xtrata-v3.2.3.clar` (in this repo at
`../contracts/clarinet/contracts/xtrata-v3.2.3.clar`) to **testnet** and point
`XTRATA_CONTRACT_ADDRESS` at it. Keep `NETWORK`, FlowVault, and Xtrata on the
same network.

## Quick start

```bash
cd flowproof
npm install

# 1) See it work with zero setup — builds + hashes real receipts, prints the
#    exact Xtrata v3.2.3 call + lineage that would be made. No keys, no network.
npm run demo:dry

# 2) Live testnet run
cp .env.example .env        # fill STACKS_PRIVATE_KEY + your testnet XTRATA address
npm install flowvault-sdk@0.1.1
npm run demo
```

`npm run typecheck` builds the types without emitting.

## Layout

```
src/
  config.ts        env + both protocols' coordinates (single source of truth)
  types.ts         FlowReceipt schema + flow/rule/state types
  receipt.ts       canonical JSON, incremental SHA-256 (matches process-chunk), chunking
  xtrata.ts        Xtrata v3.2.3 client: single-tx (recursive) mint + reads
  flowvault.ts     FlowVault SDK wrapper (backend signer mode)
  orchestrator.ts  ProofOfFlow.runFlow(): money → state → receipt → inscribe
scripts/
  demo.ts          royalty scenario (+ payroll), dry-run and live
```

## Judging-criteria map

| Criterion | Where it shows up |
|---|---|
| Financial behavior design | Self-documenting money — receipts are a first-class output of every flow |
| Automation | Server-signer orchestrator inscribes each deposit with zero manual steps |
| Composability | FlowVault × Xtrata; receipts form a reusable on-chain lineage object |
| Ecosystem value | Generic across royalties / payroll / DAO; raises FlowVault's own utility |
| Deep FlowVault integration | Real routing pipeline + `get-vault-state`, principal-scoped rules, post-conditions |

See `../FlowVault-Bounty-Strategy-and-Build-Plan.md` for full strategy, demo
script, and the day-by-day plan.

## Status

Pattern A scaffold: clients, orchestrator, receipt pipeline, dry-run demo.
Next: deploy Xtrata to testnet, wire a funded key, record the live run; then the
minimal lineage UI and the Pattern B composing contract.
