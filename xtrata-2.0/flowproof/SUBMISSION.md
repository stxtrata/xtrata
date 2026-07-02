# FlowProof — Proof-of-Flow

**Self-documenting money on Stacks. Every FlowVault money movement mints its own permanent, verifiable, recursively-linked proof on Xtrata.**

FlowVault Builder Bounty submission · live on Stacks testnet.

---

## The problem

On-chain treasuries move money well — but their *history* lives in mutable indexers and block explorers you have to trust. There is no native, tamper-proof, self-contained record of **what a treasury did, and how it routed each flow**. For payroll, creator royalties, and DAO treasuries, provenance and auditability are afterthoughts bolted on off-chain.

## The primitive: Proof-of-Flow

Make the proof a **first-class output of every money movement**.

- **FlowVault** routes the money — split, time-lock, hold — deterministically.
- **Xtrata** inscribes a canonical **receipt** for each flow: stored *fully on-chain* (not a link to off-chain JSON), content-addressed, and **recursively linked** to the asset it concerns and the previous receipt.

The result is a permanent, append-only **financial lineage** — `asset ← R1 ← R2 ← …` — that can't be edited or lost, and that anyone can independently verify against the real on-chain money events.

## Why this is uniquely Xtrata × FlowVault

- FlowVault is the **programmable money layer** — token-agnostic routing (`deposit` takes any SIP-010 trait).
- Xtrata is a **contract-native inscription protocol** with full on-chain storage and **recursive relationships** (`dependencies` + `parents`) — the killer feature.

A linked, self-contained, on-chain audit trail of money flows is impossible without a data layer that has recursion and permanence. **The composition is the moat** — no wallet wrapper or dashboard can replicate it.

## What's live (Stacks testnet)

| Layer | Contract |
|---|---|
| Money | `STD7QG84VQQ0C35SZM2EYTHZV4M8FQ0R7YNSQWPD.flowvault-v2` |
| Record | `STRNRHWSD7REAEXVTHDQWKPD4MFBG41024WQKBBM.xtrata-v3-2-3` (Xtrata v3.2.3, Clarity 3, 106 fns) |
| **Composer** | `STRNRHWSD7REAEXVTHDQWKPD4MFBG41024WQKBBM.flowproof-treasury` |
| Token (test) | `STRNRHWSD7REAEXVTHDQWKPD4MFBG41024WQKBBM.usdcx` (faucet SIP-010 stand-in) |

## Two integration depths

**Pattern A — orchestration.** An autonomous server-signer runs the FlowVault flow, reads vault state, and inscribes the receipt. Zero manual steps.

**Pattern B — atomic composition (the headline).** `flowproof-treasury.deposit-and-prove` calls FlowVault `deposit` **and** Xtrata `mint-single-tx-with-relationships` in **one transaction** — both succeed or both revert. Money routes and its permanent record mint together, atomically. `tx-sender` propagates through the calls, so the user's routing rules and the receipt's ownership are preserved and the contract takes **no custody**.

## Trustless verification

`npm run verify <id>` audits any receipt from public chain data alone:

1. **Integrity** — recompute the content hash from on-chain chunks; must equal the inscription's stored `final-hash`.
2. **Lineage** — on-chain `get-parents`/`get-dependencies` must equal the receipt's links.
3. **Money** — the receipt's amounts must equal the **real FlowVault `deposit`/`withdraw` event**.
4. **Atomicity** — for atomic receipts, the mint tx (found via NFT history) must be the same `flowproof-treasury` tx that carried the deposit.

## On-chain evidence (testnet)

Full lifecycle, all confirmed — `asset#8 ← R9 ← R10 ← R11`:

| What | Tx |
|---|---|
| Composer deploy | [`d33f3506…`](https://explorer.hiro.so/txid/0xd33f3506973f8d57bbc686071d10152fe7353c9c41b5ed4a08861060ed9ac913?chain=testnet) |
| Asset inscription (#8) | [`5c6c3e7f…`](https://explorer.hiro.so/txid/0x5c6c3e7f0089e9b63869180a50557d5f14e038a3554a5d93eb37ee55a6e11ad1?chain=testnet) |
| **Atomic deposit-and-prove → receipt #9** | [`be12e284…`](https://explorer.hiro.so/txid/0xbe12e2843a5896eda9834d01dab9da9b39c587d2a49a4f3cde2ccd97acc3e07b?chain=testnet) |
| **Atomic deposit-and-prove → receipt #10** | [`846ffe6a…`](https://explorer.hiro.so/txid/0x846ffe6a696432345ee3eaf819327395d2d859ab2d35cc17700e5018be2c73fa?chain=testnet) |
| Withdraw | [`ded661f4…`](https://explorer.hiro.so/txid/0xded661f41e3d2957be889cdc967650ba1eebf85c13139d7c93c4f48af8ed83e4?chain=testnet) |
| Withdrawal receipt (#11) | [`effbfc70…`](https://explorer.hiro.so/txid/0xeffbfc7021edd9cb9d43153ace946ed1f54c53689168173bf1036fdbb01bc21b?chain=testnet) |

Independent verifier output for the atomic receipt #10:

```
PASS  integrity: content hash == on-chain final-hash
PASS  lineage: on-chain parents/deps == receipt links  parents [9] deps [8]
PASS  money: receipt matches real FlowVault deposit event  amount 5000000, split 500000, lock 1000000, hold 4500000
PASS  atomicity: deposit + inscription in one flowproof-treasury tx  0x846ffe6a…
```

## Judging-criteria map

| Criterion | How FlowProof delivers it |
|---|---|
| Financial behavior design | A new behavior: self-documenting money — proof is an output of every flow |
| Automation | Atomic `deposit-and-prove`; orchestrator inscribes with zero manual steps |
| Composability | FlowVault × Xtrata composed in a single on-chain tx; receipts are a reusable lineage object |
| Ecosystem value | Generic across royalties / payroll / DAO; makes *FlowVault itself* auditable for free |
| Deep FlowVault integration | Real routing pipeline (split→lock→hold), `get-vault-state`, token-trait `deposit`, post-conditions |

## Generalizes across the bounty's verticals

One engine, config-only changes: **creator royalties** (shown), **payroll** (vesting lock + split to collaborators), **DAO treasury** (auditable payouts), **goal-based savings** (time-locks). The flagship demo is royalties because it makes the recursion visible.

## Reproduce it (5 commands)

```bash
cd flowproof && npm install
cp .env.example .env            # add STACKS_PRIVATE_KEY (or seed)
npm run deploy-token            # faucet USDCx stand-in (see note)
npm run faucet 1000             # mint test USDCx
npm run deploy-treasury         # the atomic composer
npm run demo:atomic             # atomic deposit-and-prove x2 + withdrawal receipt
npm run verify <receiptId>      # independent on-chain audit
npm run lineage && npx serve .  # open explorer.html for the live lineage view
```

## Honest notes

- **Test token.** Official testnet USDCx (`ST1PQHQKV….usdcx`) is a real Circle CCTP / xReserve bridge token — mintable only with a bridge attestation, not a faucet. FlowVault is token-agnostic, so the demo uses a freely-mintable SIP-010 stand-in (symbol `USDCx`). On mainnet, point `USDCX_*` at the real `SP120…usdcx`; nothing else changes.
- **Xtrata deploy.** The testnet `xtrata-v3-2-3` is the live v3.2.3 with legacy migration functions removed (they reference mainnet-only predecessors) — every function FlowProof uses is byte-identical.

## Links

- Code: `flowproof/` in this repo — `README.md` (run guide), `docs/ARCHITECTURE.md` (design), `DEMO-SCRIPT.md` (video).
- Built on: [FlowVault](https://docs.flow-vault.dev) · [Xtrata](https://xtrata.xyz) · [Stacks](https://stacks.co)
