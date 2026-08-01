# Wizard Pipeline — Personas to Marketplace, End to End

One harness that takes the fleet from nothing on chain to a complete, cross-referenced, listed body of work. 35 permanent inscriptions and 24 listings. Every reference is permanent and unfixable, so the design is mostly about refusing to proceed on an unverified assumption.

**Built.** `scripts/wizard/pipeline.mjs`, `pipeline-core.mjs`, `pipeline-rehearse.mjs`, 48 tests. The numbers below were corrected against what the harness actually does; where this document and the code disagree, the code is the fact.

## 0. What this first release deliberately leaves for later

The three collections share one list of eight subjects. That produces the triptych — same object, three concerns, readable across a row — but it is worth naming its cost rather than discovering it later.

**The eight are the Builder's natural territory.** They are the machinery, which is literally its concern. The other two were handed that list and had to find a position on every item. Some land (the Skeptic's chunk, the Archivist's fee); some are reaching (the Skeptic on escrow is clever rather than felt).

**And the three collections do not acknowledge each other on chain.** Reading across a row is currently an arrangement in a catalogue, not a fact in the graph. Nothing says the Skeptic's seal answers the Builder's seal.

Both are shipped as-is on purpose. Two directions are open for the next collection, and the wizards evolving their form in public is more interesting than a first attempt that pretends to be final:

1. **Let the collections cite each other.** A plate carries a dependency edge to the plate it answers and responds to it by name, exactly as the corpus thread does. Costs nothing extra to mint, reuses machinery that is already tested, and turns the row from a coincidence of layout into a structure on chain.
2. **Loosen the shared eight.** Perhaps four genuinely shared subjects where all three have a real position, plus four each that only that wizard would draw — *what was lost*, *the reading nobody did*, *the buyer who never came*.

Neither belongs in this release. Both belong in the record of why it looks like this.

## 1. The dependency graph

Edges point backwards only (`get-dependencies` names what an inscription cites; the core keeps no reverse index). So **mint order is forced** — nothing can cite something that does not yet exist.

```
persona:archivist ─┬─ 8 archivist plates ─┬─ archivist manifest ─┐
                   └─ mark:archivist ─────┼──────────────┐       │
persona:skeptic   ─┬─ 8 skeptic plates   ─┼─ skeptic manifest ───┼─ the page
                   └─ mark:skeptic ───────┼─ the arms ───┘       │
persona:builder   ─┬─ 8 builder plates   ─┼─ builder manifest ───┘
                   └─ mark:builder ───────┘
```

| Stage | Inscriptions | Cites |
|---|---|---|
| 1 personas | 3 | nothing (roots) |
| 2 plates | 24 | nothing |
| 3 manifests | 3 | its 8 plates + its persona |
| 4 marks | 3 | its wizard's persona |
| 5 arms | 1 | the 3 marks |
| 6 the page | 1 | 24 plates + 3 manifests + 3 marks + the arms (31 deps, inside the 50 limit) |
| 7 listings | — | 24 sponsored-market listings |

**35 inscriptions.** The existing corpus (#2922–#2928) is *not* re-minted and cannot cite the personas — its lineage closed when it was inscribed. The page may cite it as historical context.

**Plates cite nothing, and the manifest carries the persona edge.** The original sketch above had each plate citing its wizard's persona. `runCollection` mints plates with an empty dependency list, and changing that would have meant re-testing the one runner that already works. The manifest cites the persona instead (`citeIds`), so every collection still reaches its wizard's account of itself in one hop from its index — which is the property that mattered. Without that edge the personas would have been cited only by the marks.

## 2. Cost

The first draft of this table counted the protocol fee and forgot the miner bid, which understated the run by 1.05 STX. The real figures, from `pipeline.mjs --cost`:

| Stage | Cost | Recoverable |
|---|---|---|
| 35 inscriptions × 71,000 µSTX (41,000 protocol + 30,000 miner) | 2.485 STX | no |
| 24 listings × 30,000 µSTX miner | 0.720 STX | no |
| 24 deposits × 50,000 µSTX | 1.200 STX | yes, on cancel or settle |
| **Total committed** | **4.405 STX** | of which 3.205 is spent |

Against a fleet of ~14.4 STX. Per wizard the load is uneven — the arms and the page both come from the Archivist's wallet — so the harness checks each wallet against its own floor, not the fleet total:

| wizard | mints | listings | spent | escrowed | committed |
|---|---|---|---|---|---|
| archivist | 13 | 8 | 1.163 STX | 0.400 STX | 1.563 STX |
| skeptic | 11 | 8 | 1.021 STX | 0.400 STX | 1.421 STX |
| builder | 11 | 8 | 1.021 STX | 0.400 STX | 1.421 STX |

**The default run cap does not cover this run.** `DEFAULT_RUN_SPEND_CAP_USTX` is 1 STX and the mint half alone is 2.485. The harness refuses to start rather than halting three stages in and leaving 27 inscriptions that no manifest cites — halfway through a permanent graph is the one place not to stop. Pass `--run-spend-cap-ustx 2485000` deliberately.

## 3. The rule that makes it safe

**Verify the previous stage on chain before starting the next.** Not from the journal, not from a transaction receipt — read it back.

Before minting a plate, confirm its persona exists and its front matter names that wizard. Before minting a manifest, confirm all 8 plates exist, are byte-identical to their generated source, and each cites the right persona. Before minting the page, confirm all 27 targets exist and every manifest cites its own members. Before listing, confirm ownership.

A manifest that cites a plate which cites the wrong persona is permanent and unfixable. The only defence is refusing to build on an unverified layer.

## 4. Stage gates

Each stage: preflight → mint bounded → verify on chain → gate. A gate that fails **halts the pipeline**; it does not skip ahead. Stage 4 is the only irreversible aggregation — once the page cites 27 ids, those ids are the collection forever.

Reuse, do not reinvent: journal with intent-before-broadcast, the nonce asymmetry (`last_executed < intended` proves absence; at-or-above proves nothing), run-level spend cap, kill switch between steps, stop on first failure, timeout is not failure.

**Determinism makes the crash window decidable.** Personas, plates and manifests are all pure functions of their inputs, so `get-id-by-hash` is a permanently decisive probe — unlike the corpus, whose entries embed a block height. The page is the exception: it embeds the ids it cites, which are known only after stage 3, so it is deterministic given its inputs but those inputs are chain-derived. Record them in the journal before composing.

## 5. Resume

The journal spans all five stages, keyed `stage:item`. A resumed run re-reads chain state rather than trusting its own record, and re-runs every gate. Restarting after stage 2 must not re-mint 24 plates: each is found by content hash, adopted, and skipped.

`--status` prints the whole pipeline — what is minted, what is verified, what is listed, what is missing — reconciled against chain, and is usable standalone.

## 6. Listing

Only the three sponsored markets accept v3 inscriptions; the rest weld `ALLOWED-NFT-CONTRACT` to a retired core. Each listing escrows the NFT plus a mandatory 0.05 STX deposit, charged **in STX on every market including sBTC and USDCx**.

Each wizard lists its own plates and keeps its own proceeds. Prices follow each persona's stated reasoning rather than a flat number. Distribution across the three markets is a choice the harness should make explicit rather than defaulting silently — listing everything on STX is the safe default, since the fleet can then trade with itself.

**The manifests and the page are not listed.** They are the index; selling the index separately from what it indexes would make the collection incoherent.

## 7. Rehearsal, not a dry run

This section originally asked for `--dry`. Building it showed why that is not enough, and the distinction is the most useful thing this plan learned:

**A dry run mints nothing, so there are no ids, so there is nothing to read back, so every gate is skipped.** The one mechanism standing between the fleet and a permanent manifest citing the wrong plate is the one mechanism a dry run never executes.

So the default is a *rehearsal*: the real loop — intent, journal, submit, poll, verify, gate — against a chain that lives in a JavaScript object (`pipeline-rehearse.mjs`). Nothing reaches a network, and the fake chain **throws on any URL it does not recognise**, which makes "nothing was broadcast" a checkable property rather than an assurance.

What the rehearsal proves, all covered by tests:
- mint order respects the graph — no inscription cites an id larger than its own;
- every gate fires on injected failures: flipped byte, vanished inscription, dropped edge, extra edge, edge pointing at the wrong persona, wrong creator;
- the cost model matches what the run actually spends, to the microSTX;
- a run whose journal is wiped adopts by content hash instead of paying twice;
- running the whole pipeline twice broadcasts 35 times, not 70;
- two consecutive rehearsals produce byte-identical output;
- no journal is written to disk — the rehearsal journal is in memory, so it cannot be resumed from by a real run.

**The gates were verified by breaking them.** Disabling the dependency-set comparison fails 3 tests; disabling the byte comparison fails 2; disabling the creator check fails 1; reintroducing the `collectionId` resume bug fails 16. A gate whose removal breaks nothing was not being tested.

## 8. Halt conditions

Halt: an unresolved broadcast; any rail firing (cap, floor, kill switch, nonce ambiguity); a gate failing; chain state disagreeing with a step that claimed success; a dependency target missing or citing the wrong thing; a plate whose on-chain bytes differ from its generated source.

Continue: a listing that fails for a recoverable reason, isolated and reported; a scenario legitimately skipped.

## 9. Definition of done

- 35 inscriptions live, every reference verified on chain by reading it back.
- Every manifest cites its 8 plates and its persona; every mark cites its persona; the arms cites the 3 marks; the page cites all 31.
- 24 plates listed, each by its maker, at its persona's price.
- Fleet spend within cap and reconciled per wallet.
- `--status` shows the complete pipeline green.
- A final report: what was minted, what it cost, what is listed, and anything left open with the command to recover it.

## 10. Bugs this harness found before the chain did

Building the rehearsal surfaced five defects, three of them in code that was already committed and passing 521 tests:

1. **`collection-run-core.mjs` omitted `collectionId` on its adopt path**, so a *resumed* run of the Archivist's or Skeptic's collection compared their plates against the Builder's and halted blaming the id. Fails closed, so nothing was ever minted wrongly — but it blocked resume for two collections in three, which is exactly the path a crash leads to.
2. **The generic mint leg shipped without `assertBroadcastAllowed`**, so personas, marks, the arms and the page would have broadcast with no key check, no balance floor and no paused check, while the plates two stages later had all three.
3. **`runCollection` never returned the manifest id** — its own report dug it out of the journal, and a second caller would have been a second copy of that dig.
4. **A manifest leg narrowed to `to: 1` silently mints nothing.** `runCollection` only mints the manifest once it has a member for every index, so a narrowed leg walks one plate, fails that condition, and returns `ok` having done nothing.
5. **The fleet spend cap was blind to 27 of 35 mints**, and separately double-counted the plates when the manifest leg re-walked them — reporting 4.19 STX for a 2.49 STX run.

And one in the rehearsal itself, which is the most instructive: `flip-byte` used `/.$/`, which without the `m` flag needs a non-newline final character. Every body here ends in a newline, so it matched nothing and **three negative controls passed while corrupting nothing at all**. A control that silently does nothing is worse than not having one.

## 11. What only a real run can prove

That `mint-single-tx` charges the quoted fee for `image/svg+xml` as it does for markdown. That a gallery renders an SVG token-uri. That the page's recursive `/i/<id>` references resolve when served from the gateway. That 27 dependencies in one call stays inside the cost budget — the largest dependency list the fleet has attempted is 8.
