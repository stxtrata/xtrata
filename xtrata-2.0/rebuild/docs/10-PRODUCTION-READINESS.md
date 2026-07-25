# Production-Readiness Report — Collections & Drops v3

Date: 2026-07-24. Status: **code complete and green; NOT deployed.** Testnet has not been exercised and mainnet requires explicit approval, which has not been given.

## Verification state

| Package | Tests | Other gates |
|---|---|---|
| `rebuild/contracts` | 160 (5 files) | `clarinet check` — 0 errors, 137 check-checker warnings (same class the existing project carries) |
| `rebuild/client` | 209 (17 files) | `tsc --noEmit` clean |
| `rebuild/relayer` | 109 (7 files) | `tsc --noEmit` clean |
| `rebuild/ui` | 487 (27 files) | `tsc --noEmit` clean, `vite build` OK |
| **Total** | **965** | |

Coverage highlights: collection sizes 1/30/31/50/51/100 inscribed end-to-end; the complete brief workflow (100 items → whole-collection drop → concurrent claims → recovery → finalize); 60 fast-check model sequences (~40 ops each) asserting every state invariant after every operation, with mutation testing confirming the assertions bite; 500/1000-item plans at planner level with new-device resume; signature-replay matrix; relayer concurrency, budget and replay tests.

## Definition-of-done assessment

| Requirement | Status |
|---|---|
| New contracts form a clean production baseline | **Met** — three contracts, no v2.1.0 carryover, core pinned to v3.2.3 |
| UI and client built specifically for them | **Met** — new client package, new MPA (Studio, Drop Builder, Canary) |
| Creator can inscribe any finite collection without the Wizard | **Met** — Studio drives the executor directly; Wizard not referenced |
| Interrupted batch work resumes safely | **Met** — reconcile-before-resume, tested at every interruption point incl. broadcast-succeeded-unseen |
| Every item in one ordered collection regardless of batches | **Met** — proven directly: items sealed in reverse order still land at their reserved indexes |
| Whole collection selectable for a Drop in one action | **Met at the UX level** — one button; plans ceil(n/50) range calls (see Known Limitations) |
| Paid, zero-price and sponsored modes behave correctly | **Met on-chain**; sponsored path not yet exercised against a live relayer |
| Inventory cannot be duplicated or claimed twice | **Met** — assignment ledger + `ItemClaimed`, model-tested |
| Sponsor exposure bounded and auditable | **Bounded on-chain; auditability incomplete** — see blocker below |
| All contracts, clients, interfaces documented | **Met** — docs 00–09 + relayer README |
| Comprehensive contract and browser tests pass | **Contract/unit met; no Playwright browser suite** — see gaps |
| Complete workflow succeeds on testnet | **NOT DONE** — requires a funded testnet wallet and an operator |
| Web-wallet canary verifies every deployment stage | **Built, not exercised** — 15 stages implemented; 2 are operator-attested by design |
| Another operator can deploy from the documentation | **Met on paper** (09-OPERATIONS.md); unproven until someone does it |

## Blockers before production

1. **Relayer audit ledger is not persisted.** `sponsor_audit_v3` exists in `schema.sql` but is never written; the audit log and pending-reimbursement map are in-memory per isolate, so sponsor exposure totals reset on Worker restart. The exposure invariant and its auto-shutdown are therefore unreliable across restarts. **Sponsored mode (mode 3) must not go live until this is persisted to D1.** Modes 1 and 2 are unaffected.
2. **No testnet run.** Stages 5–11 of the canary have never executed against a real chain. Every on-chain claim in this report rests on simnet and the mock core. A full testnet workflow is mandatory before mainnet.
3. **No browser test suite.** The UI has 487 unit/component tests but no Playwright coverage of the real flows (import 100 files → run → kill page → resume; select-all in the Builder; canary gating). Logic is well covered; wiring is not.

## Known limitations (accepted, documented)

- **Whole-collection selection is one action, not one transaction.** The collection caps `assign-range-to-drop` at 50 indexes, so `[0, 100)` is 2 calls. Each call consumes one of 25 stored range slots, so **range-based inventory tops out at 1250 items per drop**; beyond that, mix in `add-inventory-items` batches or split across drops. This was a genuine client bug (a single over-wide range would have been rejected on-chain, breaking the flagship 100-item case) — now fixed, with the width enforced in the builder, splitting in the planner, slot-aware capping in the UI, and regression tests at all three layers plus an on-chain e2e assertion.
- **All three drop modes distribute from escrow.** Mode selects economics, not mechanism. Mint-through-drop (inscription deferred to claim time) was deliberately not built — it would require the collection to call back into the drop during seal, coupling the contracts bidirectionally with a partial-mint failure mode. Documented in 01-ARCHITECTURE §4.1.
- **Randomized allocation omitted.** Deterministic sequential allocation only. Any future randomized mode must not be presented as manipulation-proof.
- **Item `parents` relationships cannot be sealed.** Ingest accepts them; the collection's seal path exposes only `dependencies`. Either wire `seal-with-relationships` through or reject `parents` at ingest.
- **Canary stages 2 and 4 are operator-attested**, not machine-verified — the UI and the report both say so explicitly. Stage 10 probes the relayer's request surface rather than forging a real sponsored claim.
- **`fitToRangeCap` lives in the UI**, not the client, so a non-UI consumer of `selectAllUnassigned` can still build an over-cap selection and get `plan-invalid`. Worth promoting into the client.

## Recommended sequence to production

1. Persist the relayer audit ledger to D1 (blocker 1).
2. Add the Playwright suite for the three surfaces (blocker 3).
3. Run the canary on testnet through stage 11, with a real funded wallet, and archive the generated report.
4. Review the testnet report and this document with the operator; obtain explicit mainnet approval.
5. Deploy `xtrata-drops-v3` to mainnet via canary stage 13, verify (stage 14), then activate configuration (stage 15).
6. Enable sponsored mode only after the relayer has run against testnet with persistent auditing.

**No mainnet deployment has been performed or should be performed without explicit approval.**
