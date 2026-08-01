# Wizard Collection — Release Runbook

The ordered steps for taking the fleet's work on chain. `WIZARD-PIPELINE-PLAN.md` is the design; this is what you follow on the day.

31 inscriptions, ~24 listings, ~3.19 STX committed of which ~1.99 is spent. Every reference is permanent. The gates below exist because there is no correction, only a second inscription admitting the first was wrong.

## Preconditions

- [ ] Triptych collections built; `npx vitest run scripts/wizard` green.
- [ ] Pipeline harness built and its `--dry` passes all five stages including injected gate failures.
- [ ] Fleet balances checked. Needed per wallet: ~0.37 STX to mint a collection, ~0.64 to list eight, plus the page from one wallet. Floor stays 1 STX supervised.
- [ ] `.env.wizards` present, `--status` reads clean, kill switch absent.
- [ ] You have looked at all 24 plates and approved them.

## Gate A — approve the art

```bash
npm run wizards:collection:preview
node scripts/wizard/collection-run.mjs --collection <id> --write /tmp/plates
```

Look at every plate. A plate that does not read as its subject is a failed plate and is cheaper to fix now than ever again.

**Stop here until you are happy.** Everything downstream cites these bytes.

## Step 1 — Personas (3 inscriptions, ~0.12 STX)

```bash
node scripts/wizard/pipeline.mjs --stage personas --dry
node scripts/wizard/pipeline.mjs --stage personas --broadcast
```

Roots of the whole graph. Nothing cites anything yet, so this is the cheapest stage to get wrong and the only one with no upstream risk.

**Verify:** three inscriptions live, each naming its wizard's address and concern. Record the ids.

## Step 2 — Plates (24 inscriptions, ~0.98 STX)

```bash
node scripts/wizard/pipeline.mjs --stage plates --dry
node scripts/wizard/pipeline.mjs --stage plates --broadcast
```

Each plate cites its wizard's persona from step 1.

**Gate:** before proceeding, every plate must read back byte-identical to its generated source *and* cite the right persona. The harness checks this; do not skip it because the transactions succeeded. A successful transaction proves something was inscribed, not that it was the right thing.

## Step 3 — Manifests (3 inscriptions, ~0.12 STX)

```bash
node scripts/wizard/pipeline.mjs --stage manifests --broadcast
```

Each cites its eight plates and its persona. This is the first irreversible aggregation: after it, those eight ids are that collection permanently.

**Verify:** each manifest's dependency list matches its plates exactly, in order.

## Step 4 — The page (1 inscription, ~0.04 STX)

```bash
node scripts/wizard/pipeline.mjs --stage page --dry
node scripts/wizard/pipeline.mjs --stage page --broadcast
```

Cites all 27. **Test the 27-dependency call first** — the most the fleet has attempted is 8, and the cost of a large dependency list is unproven. If it exceeds the single-transaction budget, the fallback is citing the three manifests only and letting the page resolve plates through them.

**Verify:** load the page from the gateway. The recursive `/i/<id>` references must resolve and the ownership panel must populate. This is the first real test of recursion in the fleet's work.

## Step 5 — Listings (24 listings, ~1.92 STX, 1.2 refundable)

```bash
node scripts/wizard/pipeline.mjs --stage listings --dry
node scripts/wizard/pipeline.mjs --stage listings --broadcast
```

Each wizard lists its own plates at its own price. Sponsored markets only — the rest reject v3 inscriptions.

Manifests and the page are **not** listed. They are the index.

**Verify:** 24 live listings, each owned by the market contract, each priced as its persona intends.

## Post-release

- [ ] `--status` shows the whole pipeline green.
- [ ] The page renders and shows correct current owners.
- [ ] Nothing stranded: no half-listed plate, no NFT in escrow without a listing.
- [ ] Report generated: what was minted, what it cost, what is listed.
- [ ] Round report written, with anything found along the way.

## If something goes wrong

**A stage fails a gate.** The harness halts. Nothing downstream is minted, so the damage is bounded to that stage. Fix the cause and resume — completed items are found by content hash and skipped, not re-minted.

**A transaction is unresolved.** The nonce decides it: `last_executed` below the intended nonce proves the mint never landed and it is safe to retry; at or above proves nothing, so the content hash is the only authority. Never re-broadcast on a guess.

**A plate is wrong after minting.** It cannot be fixed. The options are to leave it and let the manifest cite it honestly, or to abandon that collection and mint a corrected one — which is why Gate A exists.

**A listing is wrong.** This one *is* recoverable: cancel returns the NFT and the full deposit, then relist. The only cost is two miner fees.

## The honest limits

Four things only this run can settle: whether `mint-single-tx` charges the same for `image/svg+xml` as markdown; whether a gallery renders an SVG token-uri; whether the page's recursive references resolve from the gateway; and whether 27 dependencies fit one transaction's budget.

None are code paths. All are chain or consumer behaviour, and all are recorded here so the answers are captured rather than assumed.
