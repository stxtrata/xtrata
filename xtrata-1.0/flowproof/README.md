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

- **Pattern A — app/agent orchestration.** Autonomous server signer runs the
  FlowVault flow, then inscribes the receipt (`npm run demo`).
- **Pattern B — atomic on-chain composing contract** *(implemented)*. The
  `flowproof-treasury` Clarity contract's `deposit-and-prove` routes a FlowVault
  deposit **and** inscribes the Xtrata receipt in **one transaction** — both
  succeed or both revert (`npm run demo:atomic`). This is the composable
  primitive, not two SDK calls in sequence.

Every receipt is independently checkable with `npm run verify <id>`: it recomputes
the content hash from on-chain chunks, confirms the lineage edges, and cross-checks
the amounts against the **real FlowVault event** (the same tx, for atomic receipts).

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
contracts/
  flowproof-usdcx.clar     faucet SIP-010 stand-in (testnet; official USDCx is bridge-only)
  flowproof-treasury.clar  Pattern B: atomic deposit-and-prove (FlowVault + Xtrata in 1 tx)
src/
  config.ts        env + all contract coordinates (single source of truth)
  types.ts         FlowReceipt schema (mode: orchestrated|atomic) + flow/rule/state types
  receipt.ts       canonical JSON, incremental SHA-256 (matches process-chunk), chunking
  xtrata.ts        Xtrata v3.2.3 client: single-tx (recursive) mint + content/lineage reads
  flowvault.ts     FlowVault SDK wrapper (backend signer, waits for confirmation)
  treasury.ts      Pattern B client: deposit-and-prove (atomic)
  orchestrator.ts  ProofOfFlow.runFlow() + buildReceipt
scripts/
  demo.ts          Pattern A royalty scenario (dry-run + live)
  demo-atomic.ts   Pattern B: atomic sales + withdrawal (full lifecycle)
  verify.ts        independent receipt verifier (integrity + lineage + money)
  lineage.ts       walk the chain -> lineage.json (for explorer.html)
  deploy-token.ts  deploy the faucet USDCx stand-in
  deploy-treasury.ts  deploy the Pattern B composing contract
  faucet.ts / inspect.ts / usdcx-state.ts / smoke.ts   funding + diagnostics
explorer.html      live lineage visualizer (renders lineage.json)
deploy.html        wallet-signed contract deployer (Leather/Xverse)
```

## Run the full thing (testnet)

```bash
npm install
cp .env.example .env          # add STACKS_PRIVATE_KEY (or seed); XTRATA address is preset
npm run deploy-token          # faucet USDCx stand-in (FlowVault takes any SIP-010)
npm run faucet 1000           # mint test USDCx to yourself
npm run deploy-treasury       # Pattern B composing contract
npm run demo:atomic           # atomic deposit+inscribe x2, then a withdrawal receipt
npm run verify <receiptId>    # independently verify any receipt against the chain
npm run lineage && npx serve . # open explorer.html to see the lineage
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

Live on Stacks testnet, end-to-end:
- Xtrata `xtrata-v3-2-3` deployed; full inscription + recursive lineage verified (`npm run smoke`).
- Pattern A orchestrated flow (`npm run demo`) and **Pattern B atomic** `deposit-and-prove` (`npm run demo:atomic`).
- Full lifecycle: deposit, split, time-lock, **withdrawal** receipts — all inscribed and linked.
- Independent verifier (`npm run verify`) and live lineage explorer (`explorer.html`).
