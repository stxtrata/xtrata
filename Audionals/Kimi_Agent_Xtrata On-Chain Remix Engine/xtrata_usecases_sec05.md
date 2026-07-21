## 5. The Launch Sequence: What To Do First

The whole report collapses into one sequence: fix the surface that machines and developers touch, then manufacture attention, then build the economy that monetizes it. The order is not optional — the stunts fail if the surface is broken, and the economy fails if nobody is watching. With 117 followers and zero press, attention cannot be bought, so it must be manufactured with artifacts[^1^][^2^]. And one deadline is immovable: Nina Protocol goes offline on July 22, 2026 — the day after this report — making the music stunt a this-week decision, not a this-quarter one[^3^].

### 5.1 Fix the Developer-Agent Surface (Week 0–4)

#### 5.1.1 Publish SDK to npm, ship llms.txt and an Xtrata MCP server, extend agent skill to drops/market/replies — cheap, high-leverage

Four fixes, each measured in days, and all four gate the value of every stunt that follows. First, publish `@xtrata/sdk` and `@xtrata/reconstruction` to npm: both exist only as v0.1.0 workspace packages, so a developer who reads a stunt headline cannot install the tool that made it[^4^]. Second, ship a real `llms.txt` — the route currently serves the app shell — and an Xtrata MCP server; aibtc.com already treats llms.txt, skill files, and MCP tooling as table stakes, and MCP is the de-facto agent tool layer (~97 million monthly SDK downloads)[^5^][^6^][^7^]. Third, extend the 1,106-line agent skill beyond mint/transfer/query to cover the drops, market, and reply-thread functions that exist on-site but are absent from the agent documentation[^8^]. Fourth, finish the Zero Authority DAO bounty — 200 STX across four winners — which is live but pre-launch: deadline TBA, gallery empty, the official-bounty button still showing the developer placeholder "Add the official Zero Authority bounty URL in CONFIG before launch"[^9^].

This precedes publicity because every stunt in 5.2 ends in a call to action — claim a copy, verify the hash, build the next object. If the arriving agent or developer cannot act within minutes, attention converts to nothing — and with engineering running through a single founder account, each fix is scoped to what one person can ship in four weeks[^10^].

### 5.2 Fire the First Three Stunts (Month 1–3)

#### 5.2.1 Sequence: music drop timed to Nina shutdown discourse → civic data rescue → evidence vault pilot with an NGO partner

Stunt one, this week: the undeletable music drop. Sound.xyz has been offline since January 16, 2026[^11^]; Nina — roughly 40,000 monthly users at its peak — winds down tomorrow[^3^][^12^]. Recruit one artist from the founder's music network, inscribe the album as connected objects (tracks, artwork, self-contained player), and distribute through sponsored drops so displaced listeners claim a permanent copy with zero STX. The headline writes itself — *"This record can never be taken down"* — and the discourse window is days wide.

Stunt two, month two: the civic data rescue. One deleted federal dataset — a CDC surveillance file or the data behind a removed climate tool — inscribed as a queryable, versioned object. More than 8,000 pages were purged from US government sites in early 2025 and over 2,000 datasets vanished from data.gov[^13^][^14^]; federal data carries no rights friction, so this stunt needs no partner at all.

Stunt three, month three: the evidence-vault pilot with one NGO partner — Syrian Archive, Mnemonic, or WITNESS. YouTube's classifiers erased an estimated 120,000–150,000 Syrian war-crime videos[^15^]; sponsored claims let a witness deposit evidence permanently, for free. Publish the abuse-policy position before launch, not after — unmoderatable permanence cuts both ways. And launch the bounty properly as its own stunt: filled-in config, a real deadline, a public gallery. In the Stacks scene, a functioning 200 STX creative bounty is itself news[^9^].

### 5.3 Build the Remix Economy (Month 3–9)

#### 5.3.1 Royalty-split contracts on parent/child mints; position XTRATA FM as the venue

The one genuinely new contract on the roadmap is the royalty split: wire revenue shares through the market escrow to parent/child mints so every remix pays its ancestors automatically. The lineage primitive is live — parents are escrowed at mint and the lineage is chain state other contracts can read[^16^] — and the collection-mint contract already splits proceeds between artist, marketplace, and operator, so the pattern exists to extend[^17^]. The pain justifies the build: clearing one sample costs $500–$50,000 and takes months, and the US Mechanical Licensing Collective sits on an estimated ~$397 million in unmatched royalties because attribution metadata fails[^18^][^19^]. The build waits for month three because it needs an audience — the stunts manufacture exactly that — with XTRATA FM as the venue and a 100-remix on-chain relay as the proving demo. The honest framing stands: attribution rails, not legal clearance.

### 5.4 Prioritization Table

#### 5.4.1 Table: use case × attention potential × pain severity × build effort × time-to-launch × recommended order

| Order | Use case | Attention potential | Pain severity | Build effort | Time-to-launch |
|---|---|---|---|---|---|
| 0 | Developer-agent surface fixes (npm, llms.txt, MCP, skill, bounty config) | Low direct — gates everything | Gating: converts all future press | Days | Week 0–4 |
| 1 | UC1 The album that outlives the label | Very high — Nina goes dark 2026-07-22 [^3^] | Very high | Low — tooling live | This week |
| 2 | UC12 Monthly rescue cadence | Very high — meta-headline per stunt | High (attention is the pain) | Low — marketing program | Month 1, ongoing |
| 3 | UC5 Civic data rescue | High | High | Low — rights-free federal data | Month 2 |
| 4 | UC4 War-crime evidence vault | High | Very high — 120–150k videos erased [^15^] | Medium — NGO partner + abuse policy | Month 3 |
| 5 | UC3 XTRATA FM embed-anywhere push | High | Medium | Low — radio already live | Month 3–4 |
| 6 | UC2 Remix royalty economy | High | Very high — ~$397M unmatched royalties [^19^] | Medium-high — one new contract | Month 3–9 |
| 7 | UC7 Certified-human registry | Medium — EU AI Act rule hits 2026-08-02 [^20^] | High | Low — wizard flow + badge | Month 4–6 |
| 8 | UC8 Agents that publish forever | Medium | Medium | Low — once 5.1 lands | Month 4–6 |
| 9 | UC9 The arcade that cannot be delisted | High — 1.3M-signature movement [^21^] | High | Medium — needs one indie studio | Month 6–9 |
| 10 | UC6 Self-correcting scientific record | Medium | High | Medium — journal or funder pilot | Month 6–12 |
| 11 | UC10 Composable game assets | Medium | Medium | High — engine loader needed | Month 9–12 |
| 12 | UC11 The digital will | Low near-term | High | High — trigger oracle + legal | Year 2 moonshot |

The ordering rule is attention per unit of engineering. Everything before row 6 requires zero new contracts — the top five use-case rows all run on code already on mainnet, so the binding constraint is nerve and rights-clearance, not engineering capacity. Pain severity and attention do not always travel together: UC6 and UC11 sit on severe pain but demand partners and layers that do not yet exist, so they queue behind rows that convert press into users first. The table also encodes Chapter 4's discipline: every row sells relationships, ownership, or sponsorship — never bulk storage. Execute only rows 0–3 and Xtrata enters the autumn with press, claiming users, and an agent-readable surface — the assets the heavy builds need to land.

What happens next is dated. Nina Protocol's servers go dark tomorrow, and every week of silence cedes the "permanent home for music" narrative to whoever ships first — a narrative whose last two claimants died with their media off-chain. The machine is built; the audience is the deliverable. Inscribe the first artifact this week.
