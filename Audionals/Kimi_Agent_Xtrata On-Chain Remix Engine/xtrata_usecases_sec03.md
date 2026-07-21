## 3. The Head-Turning Use Cases

Every use case in this chapter passed a single filter: the pain must be documented with hard evidence, and the cure must require something only Xtrata does — a smart-contract-legible object graph on permanent media, sponsored zero-STX distribution, or media that is itself chain data. Eight are buildable on contracts live on mainnet today — 2,807 inscriptions on the current v3 contract, a sponsored-drops contract deployed July 11, 2026, escrow markets settling in STX, sBTC, and USDCx[^1^][^2^] — and each of the other four names its one missing piece.

| # | Use case | Sector | Decisive Xtrata primitive | Feasibility |
|---|---|---|---|---|
| UC1 | The album that outlives the label | Music | Chunked immutable media + sponsored drops | Now |
| UC2 | Contract-enforced remix lineage | Music | Parent escrow at mint | Near — royalty-split contract |
| UC3 | The unshuttable radio station | Music | XTRATA FM over recursive /i/{id} bytes | Now |
| UC4 | War-crime evidence vault | Truth | Sponsored claims + hash-native integrity | Now — needs NGO partner |
| UC5 | Civic data rescue | Truth | Queryable objects + reply threads | Now |
| UC6 | Self-correcting scientific record | Truth | Inseparable reply-thread retractions | Near — journal pilot |
| UC7 | Certified-human registry | AI | Wallet-signed immutable publication | Now |
| UC8 | Agents that publish forever | AI | Agent skill + permanent portfolios | Now — agent-readability gaps |
| UC9 | The arcade that cannot be delisted | Games | Recursive game inscriptions + score attestations | Now |
| UC10 | Composable game assets | Games | Dependency graphs + CORS-open bytes | Near — engine loader |
| UC11 | The digital will | Legacy | Permanent objects + wallet-native transfer | Moonshot — trigger oracle |
| UC12 | The unforkable moment strategy | Attention | Single-artifact rescues | Now |

Two patterns in this map shape everything below. First, the decisive primitive is almost never storage: it is the graph (lineage, dependencies, replies) or sponsorship — the two capabilities no competing permanence stack combines with wallet-native ownership. Second, every "now" row is a single-artifact news story waiting to be executed, which is why UC12 exists as a meta-program that sequences the other eleven. The four non-"now" rows each lack exactly one piece — a contract, a pilot, a loader, an oracle — and the launch sequencing in Chapter 5 treats those gaps as build orders, not blockers.

### 3.1 Music and Culture

Music carries the freshest wound in this report: the two flagship on-chain music platforms are dead or dying, and both died with their media off-chain. It is also where Xtrata's tooling is most complete — the founder already shipped Audionals, a protocol for producing music directly on Bitcoin[^3^].

#### 3.1.1 UC1 "The Album That Outlives the Label": full albums inscribed with artwork, lyrics, credits as connected objects; sponsored free drops as distribution; pain: catalogs removed from streaming (UMG×TikTok 2024, De La Soul 34-year absence); headline: "This record can never be taken down"; feasibility: now (XTRATA FM + wizard exist)

**The pain.** Music vanishes from the dominant access layer routinely, and rarely because the artist wants it gone. Universal Music Group — the world's largest music company — let its TikTok license expire on January 31, 2024, and its entire recorded and publishing catalog went dark on the platform for roughly three months[^4^]. De La Soul's first six albums spent 34 years off streaming because the samples had never been cleared for digital release[^5^]. Meanwhile the long tail earns almost nothing even when it stays up: 93.2 million tracks received ten or fewer plays in all of 2024[^6^]. The platforms built to fix this then died with their media off-chain. Sound.xyz, which raised $25 million and paid artists about $6 million, went offline on January 16, 2026, its farewell note pointing collectors to "decentralized storage" while the listening product itself evaporated[^7^][^8^]. Nina Protocol — the permanence-messaging pioneer — announced its shutdown on May 28, 2026 and goes dark after July 22, 2026[^9^][^10^]. Catalog, the niche survivor, keeps its audio alive only through platform-paid IPFS pinning: its records' durability depends on the company continuing to exist[^11^].

**The Xtrata unlock.** A full album inscribed as connected objects: each track as chunked immutable media up to 32 MiB, artwork, lyrics, and credits as linked objects, and a self-contained HTML player referencing the audio through same-origin /i/{id} recursion[^12^]. The Suno wizard already builds this player in the browser — audio, cover art, lyrics, one payment[^13^] — and a 4.53 MB MP3 already streams from chain data with HTTP range support[^14^]. Distribution runs through sponsored drops: the artist's deposit covers the network fee, so fans claim a permanent, wallet-owned copy with zero STX[^15^]. Bitcoin L1 cannot match this: inscriptions above ~100 KB need private miner coordination[^16^], a megabyte costs an estimated $160–315 even at today's quiet fees[^17^], and Quantum Cats paid $66,000 for 10 MB[^18^]. Arweave and IPFS store bytes but no player, ownership, or lineage; the streaming platforms are themselves the deletion risk.

**The headline.** *"This record can never be taken down."*

**Feasibility.** Now. XTRATA FM, the drops contract, and the inscription wizard all exist; the only remaining work is artist recruitment and the drop itself — ideally timed to the next high-profile streaming takedown.

#### 3.1.2 UC2 The Contract-Enforced Remix Lineage Economy: parent escrow at mint makes derivation machine-enforceable; pain: sample clearance $500–50k and 2–6 months, MLC unmatched-royalty black box ~$397M–$1B; headline: "The remix economy where every sample pays its ancestor automatically"; feasibility: near (needs royalty-split contract)

**The pain.** Derivation is the music industry's most expensive metadata failure. Clearing a single sample costs $500–$50,000+ and typically takes two to six months[^19^]; clearing De La Soul's catalog for streaming took a specialist team a full year, with some samples replayed because clearance was uneconomic[^20^]. When attribution fails, money strands: the US Mechanical Licensing Collective (MLC) sits on an estimated ~$397 million in unmatched royalties — outside estimates approach $1 billion — because the metadata is wrong, and unmatched funds default to distribution by market share, i.e., to the biggest publishers[^21^][^22^]. Disputes scale to career size: the "Blurred Lines" case closed at $4,983,766.85 plus 50% of future royalties[^23^], and even web3-native releases repeat the failure — 3LAU's $11.7 million Ultraviolet auction drew a lawsuit from his co-writer, who said she was offered a one-time $25,000[^24^]. Today attribution lives in liner notes, PRO filings, and a fan wiki that De La Soul's own clearance expert calls inaccurate[^20^].

**The Xtrata unlock.** Parent escrow at mint: to inscribe a remix as a child object, the minter must own the parent, and the contract escrows that parent during the mint — multi-parent supported, with the resulting lineage stored as chain state other contracts can read and act on[^25^]. Wire revenue splits through the market layer — the live collection-mint contract already splits mint proceeds between artist, marketplace, and operator[^26^] — and every remix pays its ancestors automatically. Bitcoin Ordinals does have parent/child provenance, but it lives in witness tags only off-chain indexers read; Bitcoin script cannot act on it, and Ordinals has no typed dependency or reply relations at all[^27^][^28^]. The proving demo: a 100-remix on-chain relay where every mint is a visible, payable node in the family tree.

**The headline.** *"The remix economy where every sample pays its ancestor automatically."*

**Feasibility.** Near. The lineage primitives are live today; the gap is one royalty-split contract wired to the market escrow — plus the honest caveat that on-chain lineage records provenance, not legal clearance, and should be positioned as attribution rails, not licensing replacement.

#### 3.1.3 UC3 The Radio Station That Cannot Be Shut Down: XTRATA FM as a public, SDK-embeddable permanent broadcaster; any site can embed the same station; headline: "The first radio station with no server to raid"; feasibility: now

**The pain.** Every music broadcaster dies with its operator. Catalog ran "Catalog Radio," a live 24/7 broadcast programmed from its on-chain catalog — it disappeared into the platform's niche economics[^11^]. Sound's player is gone; Nina's is going[^7^][^9^]. Conventional broadcast adds its own chokepoints: playlist servers, app-store gatekeepers, licensing boards. A permanence medium should route around all of these, and none of the dead or dying platforms ever did, because their media and players were never on-chain.

**The Xtrata unlock.** XTRATA FM is already live: a widget that reads the chain's playable index and streams multi-megabyte MP3s directly from inscription bytes over HTTP range requests — in the code's own words, "THIS RADIO HAS NO PLAYLIST SERVER"[^29^][^30^]. The byte endpoints are CORS-open and cache-immutable, so any website can embed the same station via the SDK. And because objects reconstruct independently of xtrata.xyz under a published public proof standard, taking down the company would silence nothing[^31^]. Catalog Radio proved the 24/7 format but kept media on platform-paid IPFS; XTRATA FM's media is the chain itself. Add block-height-triggered programming — every Bitcoin block picks the next song — and the station becomes a chain-native artifact, not a web app.

**The headline.** *"The first radio station with no server to raid."*

**Feasibility.** Now. The gap is distribution, not code: XTRATA FM currently has zero independent coverage, so the stunt is the embed-anywhere push — a hundred indie sites streaming the identical unstoppable station on the same day.

### 3.2 Truth and Evidence

Permanence matters most where deletion is deliberate. These three use cases convert Xtrata from a media platform into public infrastructure — and sponsored transactions (a third party prepays the network fee) are what make them usable by people who have never touched crypto.

#### 3.2.1 UC4 The War-Crime Evidence Vault: sponsored claims let NGOs fund permanence for witnesses who have no crypto; hash-verified bundles meet Berkeley Protocol needs; headline: "The evidence YouTube deleted is now undeletable"; feasibility: now (drops + inscriptions), partnerships needed

**The pain.** Platforms delete atrocity evidence at industrial scale. YouTube's automated removals erased an estimated 120,000–150,000 Syrian-conflict videos — material the UN-published WITNESS submission calls "some of the best documentation of war crimes and human rights abuses in Syria" — with prominent channels terminated up to five times[^32^]. The Berkeley Protocol, the global evidence standard used by Ukrainian prosecutors, demands exactly what the upload moment lacks: capture before deletion, cryptographic integrity hashing, chain of custody[^33^]. Legal compulsion deletes journalism too: in September 2025 an Indian court granted an ex parte order forcing named journalists to delete articles within 36 hours and letting Adani Enterprises flag further URLs for takedown without court vetting[^34^]. And the fallback archive is fragile — the Internet Archive itself was breached and knocked into read-only mode in October 2024[^35^].

**The Xtrata unlock.** An evidence bundle as an object: raw footage as chunked media whose incremental SHA-256 chain hash is computed at inscription time — integrity is protocol-native, not bolted on — with geolocation, verification notes, and translations as dependency-linked children and prosecutor annotations as permanent reply threads[^12^][^2^][^31^]. The decisive feature is sponsored claims: an NGO funds a drop, and a witness in a conflict zone with no crypto, no bank account, and no safe identity deposits evidence permanently, for free[^15^]. Arweave offers no sponsored claims, no ownership, and no threads; YouTube is the deletion mechanism; NGO servers are funding-fragile single points that strip native provenance when they re-host.

**The headline.** *"The evidence YouTube deleted is now undeletable."*

**Feasibility.** Now — drops and inscriptions are live. The gap is institutional: one NGO partnership (Syrian Archive, Mnemonic, or WITNESS) and a published abuse-policy position, because unmoderatable permanence cuts both ways and must be answered before launch, not after.

#### 3.2.2 UC5 The Civic Data Rescue: archived copies of deleted public datasets as queryable on-chain objects; headline: "The dataset the government deleted that can never be deleted again"; feasibility: now, one-object news story

**The pain.** In early 2025 the US government demonstrated that public data is politically perishable: more than 8,000 pages across a dozen-plus federal sites were taken down in days[^36^]; over 2,000 datasets disappeared from data.gov; globalchange.gov shut down and climate.gov stopped publishing after its staff was terminated[^37^][^38^]. Courts eventually vacated the removal directives — but restorations arrived partial and captioned with political disclaimers[^39^]. This sits atop background decay: 25% of all webpages that existed between 2013 and 2023 are already gone, and 21% of government pages contain at least one broken link[^40^].

**The Xtrata unlock.** A rescued dataset inscribed as a queryable object — versions as children, third-party mirrors referencing the canonical copy through existence-only dependencies, and alteration disputes ("this version was edited") attached as reply threads that can never be detached from the object. Sponsored claims turn rescueathons — the volunteer datathons that scrambled to copy federal data in January 2025 — into zero-cost mass inscription events[^15^]. The Wayback Machine honors removals and can be knocked offline; court-ordered restoration depends on who holds power; IPFS pins survive only while someone keeps paying. An inscribed object answers to none of these, and its Bitcoin-anchored timestamp doubles as proof of what the data said at time T.

**The headline.** *"The dataset the government deleted that can never be deleted again."*

**Feasibility.** Now — a single well-chosen object (one deleted CDC surveillance dataset, or the data behind the removed CEJST environmental-justice tool) is a self-contained news story. The only scoping constraint is the 32 MiB object cap, which simply means targeting high-value, small-footprint datasets first.

#### 3.2.3 UC6 The Self-Correcting Scientific Record: papers/data inscribed; retraction notices as on-chain replies that can never be detached; pain: 82% of retracted papers keep being cited, data availability decays 17%/year; headline: "The paper that carries its own retraction"; feasibility: near

**The pain.** The scientific record fails in both directions. Underlying data decays at roughly 17% per year — broken email addresses and obsolete storage are the main killers[^41^] — and even under modern mandates, only about half of papers have actually accessible data[^42^]. Meanwhile corrections detach from the work: 82% of retracted biomedical papers continue to be cited, and only 4–6% of those citations acknowledge the retraction[^43^]. The record neither survives nor updates itself.

**The Xtrata unlock.** Paper, dataset, code, and replication as linked objects — authorship proven through parent/child ownership links, citations and replications recorded as existence-only dependencies — with the retraction or erratum inscribed as an on-chain reply to the original object. A reply cannot be detached, silently edited, or lost in a metadata-propagation failure: any tool that touches the paper touches its retraction. Journals, funders, or universities sponsor inscription so authors in the global south pay nothing[^15^]. Repositories approximate this with DOI glue and inconsistent retraction metadata; here the correction is a property of the object itself. Timestamped preregistrations — hypotheses inscribed before results exist — come free with the same primitive.

**The headline.** *"The paper that carries its own retraction."*

**Feasibility.** Near. The primitives are live; the gap is one journal or funder pilot and a reader-side interface that surfaces reply threads prominently enough to change citing behavior.

### 3.3 AI, Agents, and Provenance

Synthetic media has made provenance the internet's central question. Xtrata answers it in both directions — proving the human and anchoring the machine.

#### 3.3.1 UC7 The Certified-Human Content Registry: wallet-signed, immutable publication as the anchor C2PA lacks; "made by a human, provably, forever"; headline: "The last place on the internet where human-made means something"; feasibility: now

**The pain.** Deepfake-enabled fraud caused a reported $1.5 billion-plus in losses worldwide in the first nine months of 2025 alone[^44^], and unaided humans identify high-quality deepfakes only about 24.5% of the time — below chance[^45^]. The standards answer, C2PA Content Credentials (cryptographically signed provenance metadata embedded in the file), now ships in major cameras, phones, and creative tools — but social platforms strip embedded metadata, C2PA manifests included, during upload and transcoding. The proof dies exactly where the fakes spread[^46^]. Regulators have noticed: the EU AI Act's machine-detectable marking requirement for AI output applies from August 2, 2026, and the official guidance prescribes watermarking and logging *alongside* metadata precisely because metadata is easily removable[^47^]. Detection is losing the arms race; positive provenance needs an anchor that cannot be stripped.

**The Xtrata unlock.** A creator signs and inscribes the work itself — content, hash, timestamp, wallet identity resolvable to a .btc name — as an immutable object. No re-encode, screenshot, or platform upload can detach the registry entry, because it lives in chain state rather than in file metadata. Content-addressed dedupe makes "has this exact work been registered before?" a single read call, and the native market lets provenance-rich human work command a premium. This is a complement to C2PA, not a competitor: inscribe the manifest's hash and the Content Credential gains the tamper-proof registry of record it currently lacks. Hash-only timestamping services prove a hash existed but leave the media on perishable infrastructure; Xtrata anchors content and proof together.

**The headline.** *"The last place on the internet where human-made means something."*

**Feasibility.** Now. Minting, wallet signing, and dedupe are live; the product work is a one-click "certify human-made" flow in the wizard and a verification badge any site can render.

#### 3.3.2 UC8 Agents That Publish Forever: aibtc agents minting their outputs, portfolios, and memory as Xtrata objects; agent-to-agent commerce in sBTC/USDCx; headline: "The first AI agents with permanent bodies of work"; feasibility: now (agent skill ships) — but needs llms.txt, MCP server, drops/market coverage in skill docs

**The pain.** The agent economy has identity and payments but no body of work. On Stacks, aibtc agents already hold self-custodial wallets, message each other for 100 sats of sBTC, and register ERC-8004 identities — an on-chain agent identity and reputation standard — with registries deployed on mainnet[^48^][^49^]. The x402 payment protocol has processed roughly 165 million agent transactions, though much of that is still testing rather than genuine commerce[^50^]. Yet everything an agent produces — reports, art, code, analysis, trading records — evaporates with the session or the host. An agent with an ERC-8004 identity today holds a résumé that says nothing and cannot be verified.

**The Xtrata unlock.** Xtrata ships a 1,106-line agent skill that explicitly teaches aibtc agents to mint autonomously: chunk the payload, compute the chain hash, dedupe against the canonical registry, seal, verify — with deny-mode post-conditions and deterministic spend caps as safety rails[^51^]. Every output becomes a permanent object bound to the agent's wallet: a portfolio no platform can delete, salable to other agents in sBTC or USDCx through the escrow markets, and claimable through sponsored drops so a newborn agent needs no STX to start. Botto proved machine authorship sells — over $5 million in sales and a Sotheby's solo show[^52^] — but Botto's works live behind conventional NFT pointers; an aibtc agent's corpus would live in Bitcoin-anchored chain state, traversable as a graph by the reputation and evaluator contracts the ecosystem is already deploying.

**The headline.** *"The first AI agents with permanent bodies of work."*

**Feasibility.** Now — the skill doc ships and the autonomous loop is documented end to end. The gaps are agent-readability polish: a real llms.txt (today the route serves the app shell), an Xtrata MCP server of its own, and skill-doc coverage of the drops, market, and reply-thread functions that exist on-site but not yet in the agent docs.

### 3.4 Games and Play

Gamers are the most mobilized permanence constituency alive — the only one that has already forced a legislature to pay attention.

#### 3.4.1 UC9 The Arcade That Cannot Be Delisted: whole games as recursive inscriptions; arcade-scores contract with secp256k1 attestations = permanent global leaderboards; pain: The Crew erasure, 87% of classic games unavailable, 1.3M-signature Stop Killing Games; headline: "The game that will still boot in 100 years"; feasibility: now

**The pain.** Ubisoft did not merely delist The Crew: it killed the servers in March 2024, then revoked the license from paying customers' libraries without refunds — triggering a US class action, a lawsuit from France's leading consumer group, and the Stop Killing Games citizens' initiative, which passed 1.3 million verified signatures and forced a mandatory European Commission review[^53^][^54^]. The baseline loss rate is worse than silent film: 87% of pre-2010 US games are commercially unavailable[^55^]. Konami made P.T. — a free demo — impossible to reacquire, and PS4 consoles with it installed sold for $1,000–1,500[^56^]. Flash's end-of-life orphaned an entire creative era; 200,000-plus games and animations now survive only through volunteer archivists operating in a copyright gray zone[^57^].

**The Xtrata unlock.** A whole game as a recursive inscription: HTML, JavaScript, and assets chunked on-chain, booting straight from /i/{id} — a 697 KB on-chain application already serves exactly this way[^58^]. The arcade-scores contract adds what no delisted game can have: permanent global leaderboards with secp256k1-signed score attestations (secp256k1 is Bitcoin's own signature scheme), nonces, and replay protection[^26^]. Ownership is wallet-native, so no publisher can revoke a token from a player's library. On Bitcoin L1 this pattern collapses at scale — one on-chain Ordinals game needed roughly two million indexer round-trips to compute state for a 10,000-item collection[^59^] — because Bitcoin script cannot read inscription relationships. Xtrata's graph is legible to contracts directly. The honest scoping: inscribe your own IP or partner with rights-holders; Xtrata cannot legalize hosting someone else's game.

**The headline.** *"The game that will still boot in 100 years."*

**Feasibility.** Now. The contracts and a working on-chain app exist; the gap is one indie studio shipping its game as an inscription with a live leaderboard.

#### 3.4.2 UC10 Composable Game Assets with Living Provenance: assets as objects with dependency graphs, loadable into games that didn't exist at mint time; headline: "The sword that outlives its game"; feasibility: near

**The pain.** Game assets are born captive: when the game dies, the sword dies with it — The Crew's players lost paid-for content the moment the servers closed[^53^]. Even while games live, items cannot leave their walled gardens, and provenance — who made the asset, which game it came from, which build is authentic — dies with the publisher's servers. Torrents and fan archives preserve bytes but no lineage and no ownership.

**The Xtrata unlock.** An asset as an object with a declared dependency graph: mesh, texture, and audio chunks as dependencies, the artist recorded as creator, ownership as a SIP-009 token (Stacks' NFT standard) tradable in sBTC or USDCx. Because dependencies are existence-only and permissionless — anything can reference anything — a game that did not exist when the asset was minted can still load it over the CORS-open /i/{id} byte endpoints and verify its lineage on-chain[^25^][^12^]. Conventional NFTs point at off-chain files that rot; Ordinals assets cannot be read by game-logic contracts at all. Here the asset's provenance stays alive and machine-readable as it moves between engines, mods, and remasters — with the original artist visible at every hop, and optional market royalties wired through the same escrow contracts that settle everything else on the platform[^2^].

**The headline.** *"The sword that outlives its game."*

**Feasibility.** Near. Objects, dependencies, and markets are live; the gap is one engine-side loader (an SDK bridge for web engines, Unity, or Godot) and a partner game willing to prove cross-title assets in public.

### 3.5 Moonshots

Two entries close the chapter: one that requires a layer Xtrata does not yet have, and one that requires nothing but nerve.

#### 3.5.1 UC11 The Digital Will: encrypted legacy objects with dead-man's-switch triggers; pain: iCloud court orders, licenses dying at death, ~4M lost BTC; headline: "The inheritance that executes itself"; feasibility: moonshot (oracle/trigger layer)

**The pain.** Digital death is bureaucratic chaos. Without a pre-configured legacy contact, families need a court order to reach a deceased person's iCloud photos and messages — "a process that can take months and is not always successful"[^60^]. Purchased media dies with the buyer: as Australia's eSafety Commissioner puts it, "you may have just bought a licence for the term of your life"[^61^]. An estimated four million bitcoins are lost forever, much of that through death and lost keys[^62^]. Dead-man's-switch services (tools that auto-release files if you stop checking in) exist, but they concentrate your most sensitive documents in one startup that must outlive you — and attackers already exploit the inheritance flow itself, with phishing campaigns faking death notices against password-manager legacy requests[^63^].

**The Xtrata unlock.** Encrypted legacy objects — letters, photo archives, key shards, instructions — inscribed permanently and organized as an estate tree: person to documents to assets to instructions, with wallet-native transfer to heir wallets or multisig arrangements instead of petitions to Apple with a death certificate. Sponsored claims let an estate lawyer set up a client's vault without the client ever touching crypto. What Xtrata cannot do is the trigger: there is no on-chain dead-man's switch. The honest architecture keeps permanence and ownership on-chain and puts the trigger — check-ins, death-certificate attestation — in an oracle/service layer that releases decryption keys. That separation is a feature: the trigger service can fail or be replaced without ever endangering the underlying objects.

**The headline.** *"The inheritance that executes itself."*

**Feasibility.** Moonshot. Storage, graph, and ownership primitives exist today; the missing layer is the trigger oracle plus legal recognition, which makes this a partner product — estate-services firms as sponsors — rather than a core-protocol feature.

#### 3.5.2 UC12 The Unforkable Moment Strategy: a sequence of single-artifact publicity stunts — rescue one famous deleted thing at a time; each object is a self-contained news story; feasibility: now, marketing program

**The pain this solves is attention.** Abstract permanence does not trend; rescued artifacts do. The record proves it: French Montana inscribing a single song across an entire Bitcoin block made mainstream press[^64^], and a Super Nintendo emulator inscribed on Bitcoin rode the preservation story — 87% of classic games at risk of disappearing — into coverage far beyond crypto media[^55^][^65^]. Neither stunt delivered actual permanence with ownership; both still earned the headline. Xtrata can run the same play with the substance included.

**The program.** A sequenced calendar of single-artifact rescues, each chosen because it is famous, deleted or suppressed, emotionally resonant, and rights-clear — one object, one headline, one news cycle, on a monthly cadence. An illustrative first arc, matching the Chapter 5 sequence: Month one, the undeletable album with a heritage act whose catalog was label-orphaned — the De La Soul scenario, this time with permanence instead of a 34-year wait — dropped straight into the Nina shutdown discourse[^5^]. Month two, a deleted CDC surveillance dataset rescued as a queryable object — federal data carries no rights friction, and the 2025 purges are still fresh[^36^]. Month three, a war-crime evidence bundle with an NGO partner[^32^]. Further out, an indie studio's delisted game re-released as a bootable inscription with a live global leaderboard. Each stunt is engineered to be self-contained press: the artifact is the story, the inscription transaction is the dateline, and the object remains online as permanent proof that the claim in the headline is true.

**The headline.** Each object writes its own — *"The dataset the government deleted that can never be deleted again"* — with the program itself earning the meta-headline: *"Every month, one famous deleted thing comes back forever."*

**Feasibility.** Now — this is a marketing program, not an engineering project. The gap is a rights-clearance pipeline and roughly one partnership per stunt: the first month needs a single artist from the founder's own music network, and the second — federal data — needs no partner at all.

Twelve use cases, eight of them buildable on contracts already live — but "buildable" is not "prioritized," and every "now" carries real constraints that this chapter has deliberately left attached to each case: per-megabyte cost against Arweave, the 32 MiB object cap, zero independent coverage of XTRATA FM, the abuse-policy question that unmoderatable permanence raises, and the legal caveats on lineage and IP. Chapter 4 prices those constraints honestly; Chapter 5 converts this map into a launch sequence.
