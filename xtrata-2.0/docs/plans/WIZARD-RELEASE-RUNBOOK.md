# Wizard Collection — Release Runbook

The ordered steps for taking the fleet's work on chain. `WIZARD-PIPELINE-PLAN.md` is the design; this is what you follow on the day.

35 inscriptions, 24 listings, 4.405 STX committed of which 3.205 is spent. Every reference is permanent. The gates below exist because there is no correction, only a second inscription admitting the first was wrong.

## The one flag that matters

**The default run cap does not cover this run.** `DEFAULT_RUN_SPEND_CAP_USTX` is 1 STX; the mint half alone is 2.485. The harness refuses to start rather than halting three stages in and leaving 27 inscriptions that no manifest cites. Every command below therefore carries:

```
--run-spend-cap-ustx 2485000
```

It is not raised for you, and it should not be raised further without a reason you can say out loud.

## Preconditions

- [ ] Triptych collections built; `npx vitest run scripts/wizard` green (569 tests).
- [ ] The full rehearsal passes:
      `node scripts/wizard/pipeline.mjs --run-spend-cap-ustx 2485000`
      35/35 mints, seven gates, all verified, nothing left the process.
- [ ] Fleet balances checked against `--cost`. Archivist needs the most (1.563 STX committed) because the arms and the page both come out of its wallet.
- [ ] `.env.wizards` present and **ignored by git** — confirm with
      `git check-ignore -v scripts/wizard/.env.wizards`, which must print a match.
- [ ] Kill switch absent: `ls scripts/wizard/KILL` finds nothing.
- [ ] You have looked at all 24 plates, both marks sets and the arms, and approved them.

## Gate A — approve the art

```bash
npm run wizards:collection:preview
```

Look at every plate. A plate that does not read as its subject is a failed plate and is cheaper to fix now than ever again.

**Stop here until you are happy.** Everything downstream cites these bytes, and a plate cannot be revised — only left in place or abandoned along with its whole collection.

## How to drive it

The CLI takes `--from` and `--to`, not `--stage`. Rehearsal is the default; `--broadcast` is the only thing that spends.

```bash
node scripts/wizard/pipeline.mjs --cost                    # what it commits, per wallet
node scripts/wizard/pipeline.mjs --run-spend-cap-ustx 2485000   # rehearse everything
node scripts/wizard/pipeline.mjs --status                  # where the real run has got to
```

**Run one stage at a time for the first real run.** The harness will do all seven in one command, and it is correct to, but a stage boundary is a free place to stop and look.

## Step 1 — Personas (3 inscriptions, 0.213 STX)

```bash
node scripts/wizard/pipeline.mjs --to personas --broadcast --run-spend-cap-ustx 2485000
```

Roots of the whole graph. They cite nothing, so this is the cheapest stage to get wrong and the only one with no upstream risk.

**Gate:** three inscriptions live, each byte-identical to its generated source, each citing nothing, each created by the right wallet.

## Step 2 — Plates (24 inscriptions, 1.704 STX)

```bash
node scripts/wizard/pipeline.mjs --from plates --to plates --broadcast --run-spend-cap-ustx 2485000
```

Plates cite nothing. The edge to the persona is carried by the manifest — see the plan's §1.

**Gate:** every plate reads back byte-identical to its generated source and was created by its own wizard. Do not skip this because the transactions succeeded. **A successful transaction proves something was inscribed, not that it was the right thing.**

## Step 3 — Manifests (3 inscriptions, 0.213 STX)

```bash
node scripts/wizard/pipeline.mjs --from manifests --to manifests --broadcast --run-spend-cap-ustx 2485000
```

Each cites its eight plates **and its persona**. This is the first irreversible aggregation: after it, those eight ids are that collection permanently.

**Gate:** each manifest's dependency set is exactly its eight plates plus its persona — checked as a set, because the core stores what it was given and promises no order.

## Step 4 — Marks (3 inscriptions, 0.213 STX)

```bash
node scripts/wizard/pipeline.mjs --from marks --to marks --broadcast --run-spend-cap-ustx 2485000
```

Each mark cites its own wizard's persona and nothing else.

**Gate:** byte-identical, right creator, exactly one dependency and it is the right persona.

## Step 5 — The arms (1 inscription, 0.071 STX)

```bash
node scripts/wizard/pipeline.mjs --from arms --to arms --broadcast --run-spend-cap-ustx 2485000
```

Cites all three marks. Minted from the Archivist's wallet: it belongs to all three, somebody has to hold it, and custody is that wizard's stated concern.

**Gate:** the dependency set is exactly the three marks.

## Step 6 — The page (1 inscription, 0.071 STX)

```bash
node scripts/wizard/pipeline.mjs --from page --to page --broadcast --run-spend-cap-ustx 2485000
```

Cites all 31: 24 plates, 3 manifests, 3 marks, the arms. Inside the core's bound of 50, but **the largest dependency list the fleet has ever attempted is 8** and the cost of a 31-entry list is unproven. If it exceeds the single-transaction budget, the fallback is citing the three manifests, the three marks and the arms only, and letting the page reach the plates through the manifests.

The page is the one inscription that is not regenerable from nothing: it embeds the ids it cites. The harness writes the id map to the journal *before* composing, which is what keeps a crash between composing and confirming recoverable. Do not delete the journal at this step.

**Verify by eye:** load the page from the gateway. The recursive `/i/<id>` references must resolve. This is the first real test of recursion in the fleet's work, and no rehearsal can prove it.

## Step 7 — Listings (24 listings, 0.72 STX spent, 1.2 escrowed)

```bash
node scripts/wizard/pipeline.mjs --from listings --to listings --broadcast --run-spend-cap-ustx 2485000
node scripts/wizard/collection-run.mjs --collection <id> --list --broadcast
```

The pipeline's listings stage **gates ownership only** — it confirms every plate is still owned by its maker and broadcasts nothing. The listing itself is `collection-run.mjs --list`, per collection, because the market runner owns that path.

Each wizard lists its own plates at its own price. Sponsored markets only — the rest weld `ALLOWED-NFT-CONTRACT` to a retired core and will reject a v3 inscription.

Manifests, marks, the arms and the page are **not** listed. They are the index, and selling the index separately from what it indexes would make the collection incoherent.

## Post-release

- [ ] `--status` shows all seven stages verified.
- [ ] The page renders from the gateway and its references resolve.
- [ ] Nothing stranded: no half-listed plate, no NFT in escrow without a listing.
- [ ] The four open questions in the plan's §11 answered and written down.
- [ ] Round report written, with anything found along the way.

## If something goes wrong

**A stage fails a gate.** The harness halts and nothing downstream is minted, so the damage is bounded to that stage. Fix the cause and re-run the same command — completed items are found by content hash and adopted, not re-minted. Running the whole pipeline twice broadcasts 35 times, not 70; there is a test for that.

**A transaction is unresolved.** The nonce decides it: `last_executed` **below** the intended nonce proves the mint never landed and it is safe to compose again; at or above proves **nothing**, so the content hash is the only authority. Never re-broadcast on a guess. Every body in this pipeline is a pure function of its inputs, so `--status` can settle the question definitively at any point in the future — including years later.

**A plate is wrong after minting.** It cannot be fixed. The options are to leave it and let the manifest cite it honestly, or to abandon that collection and mint a corrected one. That is why Gate A exists.

**A listing is wrong.** This one *is* recoverable: cancel returns the NFT and the full deposit, then relist. The only cost is two miner fees.

**The journal is lost.** Personas, plates, manifests, marks and the arms all resume by content hash. The page does not — it embeds ids the journal was holding. If the journal is lost before the page is minted, recover the ids from the explorer and rebuild the map before running step 6.

## The honest limits

Four things only a real run can settle:

1. whether `mint-single-tx` charges the same for `image/svg+xml` as for markdown;
2. whether a gallery renders an SVG token-uri;
3. whether the page's recursive `/i/<id>` references resolve from the gateway;
4. whether 31 dependencies fit one transaction's budget.

None are code paths. All are chain or consumer behaviour, and all are recorded here so the answers are captured rather than assumed.
