# Wizard Pipeline — Personas to Marketplace, End to End

One harness that takes the fleet from nothing on chain to a complete, cross-referenced, listed body of work. 31 permanent inscriptions and ~24 listings, spending roughly 3 STX. Every reference is permanent and unfixable, so the design is mostly about refusing to proceed on an unverified assumption.

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
persona:archivist ─┬─ 8 archivist plates ── archivist manifest ─┐
persona:skeptic   ─┼─ 8 skeptic plates   ── skeptic manifest   ─┼─ the page
persona:builder   ─┴─ 8 builder plates   ── builder manifest   ─┘
```

| Stage | Inscriptions | Cites |
|---|---|---|
| 1 personas | 3 | nothing (roots) |
| 2 plates | 24 | its wizard's persona |
| 3 manifests | 3 | its 8 plates + its persona |
| 4 the page | 1 | 3 manifests + 24 plates (27 deps, inside the 50 limit) |
| 5 listings | — | 24 sponsored-market listings |

**31 inscriptions.** The existing corpus (#2922–#2928) is *not* re-minted and cannot cite the personas — its lineage closed when it was inscribed. The page may cite it as historical context.

## 2. Cost

| Stage | Cost | Recoverable |
|---|---|---|
| 31 inscriptions × 41,000 µSTX | 1.271 STX | no |
| 24 listings × 30,000 µSTX miner | 0.720 STX | no |
| 24 deposits × 50,000 µSTX | 1.200 STX | yes, on cancel or settle |
| **Total committed** | **3.191 STX** | of which ~1.99 is spent |

Against a fleet of ~14.4 STX. Per wizard the load is uneven — the page comes from one wallet — so the harness must check each wallet against its own floor, not the fleet total.

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

## 7. Dry run

`--dry` must exercise all five stages against a fake chain with synthetic ids, and prove:
- mint order respects the graph — no stage cites something unminted;
- every gate fires, including on injected failures (missing dep, wrong persona ref, byte mismatch, wrong owner);
- the cost model matches the sum of the planned transactions;
- a simulated crash at each stage boundary resumes without re-minting;
- nothing reaches a broadcast endpoint.

A dry run writes no journal to disk. Two consecutive rehearsals produce identical output.

## 8. Halt conditions

Halt: an unresolved broadcast; any rail firing (cap, floor, kill switch, nonce ambiguity); a gate failing; chain state disagreeing with a step that claimed success; a dependency target missing or citing the wrong thing; a plate whose on-chain bytes differ from its generated source.

Continue: a listing that fails for a recoverable reason, isolated and reported; a scenario legitimately skipped.

## 9. Definition of done

- 31 inscriptions live, every reference verified on chain by reading it back.
- Every plate cites its wizard's persona; every manifest cites its 8 plates; the page cites all 27.
- 24 plates listed, each by its maker, at its persona's price.
- Fleet spend within cap and reconciled per wallet.
- `--status` shows the complete pipeline green.
- A final report: what was minted, what it cost, what is listed, and anything left open with the command to recover it.

## 10. What only a real run can prove

That `mint-single-tx` charges the quoted fee for `image/svg+xml` as it does for markdown. That a gallery renders an SVG token-uri. That the page's recursive `/i/<id>` references resolve when served from the gateway. That 27 dependencies in one call stays inside the cost budget — the largest dependency list the fleet has attempted is 8.
