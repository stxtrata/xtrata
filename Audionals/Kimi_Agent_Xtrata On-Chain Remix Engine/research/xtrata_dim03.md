# Xtrata (xtrata.xyz) — Technical Differentiation Analysis: Permanent / On-Chain Content Alternatives

**Dimension 03 — Competitive & technical differentiation**
**Date:** 2026-07-21
**Method:** ≥15 web searches; primary docs opened and quoted (docs.ordinals.com, docs.stacks.co, docs.ethscriptions.com, eips.ethereum.org, circle.com, EIP-4844, etc.); live network data pulled from mempool.space API and Hiro mainnet API on 2026-07-21.
**Scope note:** Xtrata's properties below are taken from its public product surface (xtrata.xyz, captured 2026-07-21). Xtrata's mainnet contract code was not independently audited in this pass; competitor claims are sourced from primary docs and dated market data.

---

## 1. Xtrata baseline (what the platform claims and shows publicly)

Captured from xtrata.xyz on 2026-07-21 [1]:

- **Storage model:** "Media lives in inscription data. No required external media host."
- **Reconstruction:** "Objects can be independently rebuilt. The website is a gateway, not the source of truth."
- **Typed relationships (machine-readable):**
  - *Parent→child ownership link* — "you must own the parent. Each parent is escrowed for the mint and returned to you with the new inscription." (multi-parent supported)
  - *Dependencies* — "existence-only references… You do not need to own them — anything can reference anything."
  - *On-chain reply threads* — "turns your text into an on-chain reply. Anyone can reply to any inscription."
- **Ownership/market:** wallet-held objects; market settles in **STX, sBTC, or USDCx**; sponsored listings buyable with zero STX.
- **Sponsored UX:** free "Drops" claims — "the creator's deposit covers the network fee, so claimers need zero STX."
- **Anchoring:** "Made through Stacks. Anchored to Bitcoin. Stacks settles with Bitcoin finality."
- **Payload model:** up to **16 KB text per transaction**; "Inscription Wizard" for large files ("optimises, inscribes and delivers it for a single payment"), Begin→Upload→Seal pipeline.
- **Identity:** wallet lookup by address **or .btc name** (BNS).
- **Open builder layer:** SDKs, contract references, reconstruction tools, and "AI-agent training docs."

---

## 2. Evidence entries by competitor

### 2.1 Bitcoin Ordinals + recursive inscriptions

**E1 — Inscription storage mechanism and cost structure**
- *Claim:* Inscription content is stored entirely on-chain in taproot script-path spend scripts (witness data), benefiting from the SegWit witness discount; created via two-phase commit/reveal; individual data pushes ≤ 520 bytes.
- *Source:* Ordinal Theory Handbook — Inscriptions
- *URL:* https://docs.ordinals.com/inscriptions.html
- *Date:* opened 2026-07-21 (living doc)
- *Excerpt:* "Inscription content is entirely on-chain, stored in taproot script-path spend scripts… additionally receive the witness discount, making inscription content storage relatively economical… individual data pushes may not be larger than 520 bytes."
- *Confidence:* High (primary protocol docs).

**E2 — Ordinals HAS native parent/child provenance (correction to the briefing premise)**
- *Claim:* Ordinals natively supports parent/child provenance: the owner of a parent inscription must spend the parent as an input of the child's inscribe transaction; tag `3` carries the parent ID; children can have children; multi-parent is supported (the `/r/parents` endpoint returns multiple parents); a collection can be closed by burning the parent.
- *Source:* Ordinal Theory Handbook — Provenance
- *URL:* https://docs.ordinals.com/inscriptions/provenance.html
- *Date:* opened 2026-07-21
- *Excerpt:* "The owner of an inscription can create child inscriptions, trustlessly establishing the provenance of those children on-chain… Spend the parent P in one of the inputs of T. Include tag 3…"
- *Confidence:* High. **Implication:** the briefing's "no native parent/child ownership semantics" for Ordinals is **inaccurate**. Xtrata's real edge is not the existence of parent/child links but: (a) contract-escrowed multi-parent minting UX, (b) dependency (existence-only) references and reply threads — which Ordinals lacks as typed relationships, (c) the graph being legible to smart contracts, not only to off-chain indexers, (d) cost/speed/sponsorship. See §5.

**E3 — Recursion is a rendering/indexer feature, not typed object semantics**
- *Claim:* Recursive inscriptions fetch other inscriptions' content via whitelisted HTTP endpoints (`/content/<id>`, `/r/children/<id>` …) served by `ord server`; recursion has backwards-compatibility guarantees, but the relationships exist only for off-chain renderers/explorers — Bitcoin script cannot read them.
- *Source:* Ordinal Theory Handbook — Recursion
- *URL:* https://docs.ordinals.com/inscriptions/recursion.html
- *Date:* opened 2026-07-21
- *Excerpt:* "Recursive endpoints are whitelisted endpoints that allow access to on-chain data, including the content of other inscriptions… Recursive endpoints will not be removed."
- *Confidence:* High.
- *Corollary (E3a):* On-chain Ordinals games already hit scaling pain from indexer round-trips: "For a 10k collection with an average of 50 children… we need 2,000,000 requests to determine the state of the game fully on-chain." (ordinals/ord issue #3719, https://github.com/ordinals/ord/issues/3719, 2024-05-02). High.

**E4 — Size limits: 4 MB per block, ~100 kvB per standard tx**
- *Claim:* Bitcoin Core treats transactions above 400,000 weight units (100 kvB) as non-standard and does not relay them; the famous 3.94 MB Taproot Wizard inscription (block 774628, 2023-02-01) was only possible because the Luxor pool mined its own zero-fee, non-standard transaction directly. Other giant inscriptions (850–992 kvB) were also non-standard miner-direct inclusions paying 0.5–0.75 BTC in fees.
- *Sources:* b10c.me non-standard transaction survey; ordinals/ord issue #1240; Bitcoin StackExchange
- *URLs:* https://b10c.me/observations/09-non-standard-transactions/ ; https://github.com/ordinals/ord/issues/1240 ; https://bitcoin.stackexchange.com/questions/117277/
- *Date:* 2024-01-29 / n.d. / 2023-02-20
- *Excerpt:* "Bitcoin Core does not relay and rejects transactions larger than 100 kvB (400 kWU; MAX_STANDARD_TX_WEIGHT)… The Luxor pool mined the 985 kvB (3.94 MWU), zero-fee transaction… in block 774628… inscribes an 1803×1803 pixel JPEG… with a size of 3.9 MB and fills nearly the entire block."
- *Confidence:* High. **Implication:** a single Bitcoin inscription is practically capped at ~<100 KB via public mempools; >100 KB requires private miner coordination. Xtrata's 16 KB/tx chunking + Wizard is a normal-conditions pipeline, not an exception path.

**E5 — Ordinals cost per MB (live and historical)**
- *Claim:* ~1 MB of inscription content ≈ ~262,600 vB of witness data + commit/reveal overhead. At live fee rates (2026-07-21, mempool.space API: fastestFee 2 sat/vB, hourFee 1 sat/vB) that is ≈ **$160–315 per MB** at BTC ≈ $60k. At historical busy regimes (25–100 sat/vB) ≈ **$3,900–15,800 per MB**. Real-world anchor: Taproot Wizards' Quantum Cats collection paid **$66,000 to inscribe 10 MB (~$6,600/MB)** in Jan 2024.
- *Sources:* mempool.space API (live pull 2026-07-21); The Defiant on Quantum Cats; statmuse/crypto.news for BTC price
- *URLs:* https://mempool.space/api/v1/fees/recommended ; https://thedefiant.io/news/nfts-and-web3/quantum-cats-ordinals-collection-pays-homage-to-satoshi ; https://www.statmuse.com/money/ask/bitcoin-price-in-july-01-2026 ; https://crypto.news/bitcoin-price-prediction-july-2026-fed-decides/
- *Date:* 2026-07-21 / 2024-01-12 / 2026-07-01 / 2026-07-10
- *Excerpt:* "the total cost of inscribing the collection on the Bitcoin blockchain reached a whopping $66,000… the collection uses 10 MB of data."
- *Confidence:* High for the measured data points; Medium for forward fee regimes.
- *Related nuance:* recursive inscriptions exist partly to *avoid* this cost — The Block (2023-06-12): recursion "could have saved over a million dollars in transaction fees in the case of Bitcoin Apes" by inscribing traits once and rendering programmatically (https://www.theblock.co/post/234195/ordinals-recursive-inscriptions-bitcoin-video-games).

**E6 — Ordinals ownership/transfer semantics**
- *Claim:* Ordinals have no smart contracts; ownership = control of the UTXO holding the inscribed sat; trading is via PSBT-based marketplaces; no sponsored transactions (the inscriber/buyer must fund fee inputs); ~10-minute blocks with reorg risk until buried.
- *Source:* learnblockchain / YBB Capital overviews; consistent with Ordinal Theory Handbook.
- *URL:* https://www.odaily.news/post/5191885 ; https://docs.ordinals.com/inscriptions.html
- *Date:* 2023-12-21
- *Excerpt:* "Ordinals NFT 并没有智能合约，其交易是基于比特币的 UTXO 模型… 每个铭刻 NFT 绑定在某个 UTXO 里" (Ordinals NFTs have no smart contracts; trading follows the UTXO model; each inscription is bound to a UTXO).
- *Confidence:* High.

### 2.2 Ethereum NFTs + IPFS/Arweave metadata (the link-rot problem)

**E7 — Documented off-chain media exposure (industry studies)**
- *Claim:* YourNFTS analysis (Jan 2022, independently verified by ClubNFT data science): **~9–10% of NFTs are fully on-chain, ~40% sit on private servers, ~50% on IPFS**. A wider snapshot of 12.36M Ethereum NFTs: 66.44% HTTP, 23.81% IPFS, 9.06% on-chain, 0.69% Arweave. A 2024 academic replication (top-100 OpenSea collections): 31.68% centralized servers, 38.84% IPFS, only 25.62% on-chain.
- *Sources:* Decrypt (2023-05-06); Right Click Save (2022-06-20); arXiv 2408.13281
- *URLs:* https://decrypt.co/138676/are-your-nfts-safe-how-to-protect-digital-assets-from-disaster ; https://www.rightclicksave.com/article/how-many-nfts-are-actually-on-the-blockchain ; https://arxiv.org/html/2408.13281v1
- *Excerpt:* "roughly 10% of NFTs were stored on-chain, with another 40% of NFTs on private servers and the remaining 50% on IPFS."
- *Confidence:* High (multiple independent corroborations).

**E8 — Documented disappearance cases and losses**
- *Claim:* When platforms die, server-hosted media dies: "Such was the case with FTX NFTs and other platforms like Ascribe, RARE Art Labs, Editional, and Digital Objects that closed following the crypto crash of early 2018." A UC Santa Barbara study (Jun–Dec 2021): **3.91% of images and 9.04% of metadata records hosted on IPFS disappeared within months**; lost non-IPFS NFTs represented **"$160,761,805 in revenue from 118,294 transactions."** IPFS pinning lapses cause garbage collection.
- *Source:* Decrypt, 2023-05-06 (citing UCSB paper)
- *URL:* https://decrypt.co/138676/are-your-nfts-safe-how-to-protect-digital-assets-from-disaster
- *Excerpt:* "once the server is turned off, the NFT won't point to an artwork or file but a broken link… '3.91% of the assets (images) and 9.04% of metadata records hosted on IPFS' between June and December of that year disappeared."
- *Confidence:* High.
- *Corollary (E8a):* CoinDesk via xtz.news: "Just because a file is available 'on BitTorrent' doesn't mean there are any seeders… the file that the IPFS address points to can be lost as easily as any file on any random web server." (https://xtz.news/adoption/clubnft-…, 2023-10-18). Medium-High.

**E9 — Why Ethereum NFTs go off-chain: L1 storage cost**
- *Claim:* Ethereum contract storage costs 20,000 gas per new 32-byte slot (SSTORE) ⇒ **1 MB ≈ 655M gas ≈ 0.66 ETH at 1 gwei (≈ $1,300/MB at ETH $2,000; ≈ $13,100/MB at 10 gwei)**; calldata costs 16 gas/non-zero byte ⇒ ≈ $34–336/MB. ClubNFT: "one megabyte of data on Ethereum can cost thousands of dollars at recent market rates."
- *Sources:* evm.codes opcode reference; Right Click Save — The NFT Apocalypse
- *URLs:* https://evm.codes/ ; https://www.rightclicksave.com/article/the-nft-apocalypse
- *Excerpt:* "To put it into perspective, one megabyte of data on Ethereum can cost thousands of dollars at recent market rates."
- *Confidence:* High for gas constants; Medium for USD (ETH ≈ $2,000 mid-2026 assumption — see §4).

### 2.3 Arweave permaweb

**E10 — Permanence model and 200-year endowment**
- *Claim:* One-time upfront payment funds a storage endowment designed to cover ≥200 years; the model assumes storage costs decline 0.5%/yr (historically ~30.5%/yr over 50 years); even with zero further decline the fee covers 200 years at current prices. Data cannot be deleted.
- *Sources:* ArDrive (Arweave ecosystem) explainer; chainscorelabs comparisons
- *URLs:* https://ardrive.io/what-is-arweave ; https://chainscorelabs.com/comparisons/storage-ipfs-vs-arweave-vs-filecoin/permanent-vs-ephemeral-storage/filecoin-vs-arweave-storage-market-vs-endowment-model
- *Date:* 2026-04-02 / 2026-06-17
- *Excerpt:* "the one-time storage fee cover[s] the cost of data storage for 200 years… storage prices for data have decreased by 30.5% over the past 50 years."
- *Confidence:* High on the model's design; the 200-year figure is an economic projection, not a guarantee (state this when used).

**E11 — Arweave cost per MB (mid-2026)**
- *Claim:* ~10.45 AR/GiB × AR ~$1.85 ⇒ **≈ $19/GiB ≈ $0.019/MB one-time** (June 2026 network snapshot; independent sources put 2026 figures in a $0.005–0.03/MB band).
- *Sources:* kkdemian Arweave dashboard (2026-06-28, citing ViewBlock); chainscorelabs
- *URLs:* https://kkdemian.com/blog/arweave-ar-permanent-storage-endowment-demand-risk ; https://chainscorelabs.com/comparisons/storage-ipfs-vs-arweave-vs-filecoin/storage-provider-selection-criteria/data-redundancy-strategies-ipfs-vs-arweave-vs-filecoin
- *Excerpt:* "Storage cost: Around 10.45 AR/GiB" with "AR price: Around $1.8-$1.9" (2026-06-28).
- *Confidence:* Medium-High (price of AR is volatile; AR/GiB rate moves slowly).

**E12 — Arweave's missing object layer**
- *Claim:* Arweave stores immutable files/transactions with tags; ownership, transfer, royalties, parent/child graphs and markets must be built elsewhere (SmartWeave/AO compute is a separate layer; tokens/NFTs referencing Arweave media live on other chains — e.g., Solana/Ethereum NFTs pointing at ar:// URIs). Arweave itself provides no wallet-native ownership of stored objects, no sponsored claims, and no Bitcoin settlement.
- *Source:* chainscorelabs (SmartWeave "lazy evaluation", retrieval via gateways); corroborated by arweave architecture descriptions.
- *URL:* https://chainscorelabs.com/comparisons/storage-ipfs-vs-arweave-vs-filecoin/storage-token-economics-models/filecoins-deal-making-vs-arweaves-endowment-model
- *Confidence:* Medium-High (absence-of-feature claim based on protocol docs).

### 2.4 Ethscriptions / Base (EVM L2) / Solana compressed NFTs

**E13 — Ethscriptions: calldata artifacts, indexer-dependent, ~40× cheaper than NFTs**
- *Claim:* Ethscriptions encode data as Data URIs in Ethereum calldata — 100% on-chain *data*, permissionless, and significantly cheaper than contract storage (creator Middlemarch: "similar to NFTs but 40× cheaper"); but they carry **no smart-contract logic** ("Ethscriptions 不包含任何智能合约逻辑，这使得它们比传统的 NFT 更难组合" — harder to compose than traditional NFTs) and ownership state is derived by an off-chain indexer or the Stage-2 AppChain (0xeeee), not by Ethereum L1 contracts.
- *Sources:* docs.ethscriptions.com; protocol coverage quoting creator
- *URLs:* https://docs.ethscriptions.com/ ; http://mp.weixin.qq.com/s?__biz=Mzk0OTQ0MDAxNA==&mid=2247484783&idx=1&sn=a2359b3cbe5a019ee87c9e0c241c462c
- *Date:* opened 2026-07-21 / 2025-07-25
- *Excerpt:* "Unlike smart contract-based NFTs that store data in contract storage, ethscriptions use calldata—making them significantly cheaper while remaining 100% on-chain… Traditional Indexer: Off-chain service that indexes L1 transactions and maintains state in a database."
- *Confidence:* High.
- *Cost:* calldata 16 gas/byte ⇒ ≈ $34–336/MB (E9 math) — i.e., ~10–50× Xtrata's estimated per-MB cost, with no typed relationship layer.

**E14 — EVM L2 "permanence" via blobs expires in ~18 days**
- *Claim:* Post EIP-4844, cheap L2 data (Base/Optimism/Arbitrum-style) rides in blobs that "cannot be accessed by EVM execution," are downloaded by consensus nodes but "can be deleted after only a relatively short delay" — `MIN_EPOCHS_FOR_BLOB_SIDECARS_REQUESTS = 4096` epochs ≈ **18 days**. L2 history survives only via full nodes/indexers/archives, not via Ethereum consensus storage.
- *Source:* EIP-4844 (Final)
- *URL:* https://eips.ethereum.org/EIPS/eip-4844
- *Excerpt:* "blob data… can be deleted after only a relatively short delay… which is around 18 days, a much shorter delay compared to proposed… one-year rotation times for execution payload history."
- *Confidence:* High. **Implication:** "Base inscriptions" and blob-priced L2 content are cheap but have *no* L1-enforced permanence; Xtrata objects persist as Stacks chain state anchored to Bitcoin.

**E15 — Solana: full on-chain storage is rent-priced; cNFTs move data off-chain**
- *Claim:* Solana account storage (rent-exempt) ≈ 6,960 lamports/byte ⇒ **~7.3 SOL per MB (~$1,100/MB at $150 SOL)**. Compressed NFTs cut mint cost to ~0.00000005 SOL/NFT (vs ~0.012 SOL for a regular mint): "100,000 NFTs for ~4 SOL; 1B for 500 SOL" (Metaplex, Breakpoint 2023); Helius: "1M NFTs for <$150." **But a cNFT is only a 32-byte Merkle leaf on-chain — metadata and media live off-chain** (typically Arweave/IPFS via URI) and are served through the DAS/RPC indexing layer.
- *Sources:* SolanaCompass Breakpoint notes; Helius (via learnblockchain); chaincatcher Solana report; typefully cNFT explainer
- *URLs:* https://solanacompass.com/learn/breakpoint-23/breakpoint-2023-compressed-nfts-bubblegum-goes-brrr ; https://learnblockchain.cn/article/12641 ; https://www.chaincatcher.com/article/2118054 ; https://typefully.com/BintuParis/exploring-solanas-compressed-nfts-cnfts-aHhO8Xz
- *Date:* 2023-11-09 / 2023-10-12 / 2024-03-21 / 2026-03-01
- *Excerpt:* "cNFT数据存储在链下，因此需要…RPC提供程序" — cNFT data is stored off-chain, requiring separate programs/RPC providers; modifying cNFTs involves "复杂且昂贵的过程" (complex, costly processes) around off-chain data.
- *Confidence:* High on architecture; Medium on USD conversions.

### 2.5 Stacks-specific substrate (Xtrata's platform layer)

**E16 — Nakamoto: ~5-second blocks, 100% Bitcoin finality**
- *Claim:* The Nakamoto upgrade (hard fork Q4 2024) decoupled Stacks block production from Bitcoin blocks: "user-submitted transaction[s]… will now take on the order of seconds" and "Once a transaction is confirmed, reversing it is at least as hard as reversing a Bitcoin transaction. The Stacks blockchain no longer forks on its own" (70%+ Stacker signature required to fork). Secondary coverage: confirmation ~5 s, fees "only a few cents," Bitcoin finality in ~30 min.
- *Sources:* docs.stacks.co (Nakamoto); chaincatcher deep-dive
- *URLs:* https://docs.stacks.co/learn/block-production/what-was-the-nakamoto-upgrade ; https://www.chaincatcher.com/en/article/2196162
- *Date:* 2026-06-01 (doc snapshot) / 2025-08-11
- *Confidence:* High.

**E17 — Sponsored transactions are a native, productionized Stacks feature**
- *Claim:* Stacks protocol supports third-party fee payment (sponsored transactions): sBTC fee sponsorship lets users transact without STX ("Users don't need to hold STX to use sBTC"); wallets run zero-fee sponsored programs (Xverse: "zero-fee Bitcoin NFT transactions… anyone can sponsor Bitcoin NFT transactions on Stacks"); 2026-era infra productizes gasless flows (aibtc x402 sponsor relay: build with `sponsored: true, fee: 0n`).
- *Sources:* docs.stacks.co sBTC fee sponsorship; Xverse; GitHub x402-sponsor-relay
- *URLs:* https://docs.stacks.co/concepts/sbtc/auxiliary-features/fee-sponsorship ; https://www.xverse.app/bitcoin-nft-wallet ; https://github.com/aibtcdev/x402-sponsor-relay
- *Date:* 2024-10-28 / n.d. / 2026-03-31
- *Confidence:* High. **Implication:** Xtrata's free-claim Drops and sponsored listings are protocol-native UX, impossible as a first-class flow on Bitcoin L1 (no sponsored fees) and rare elsewhere.

**E18 — Stacks fees today (live sample) and throughput headroom**
- *Claim:* Live Hiro mainnet API sample (2026-07-21): token transfers 180–956 µSTX; typical contract calls 417–10,000 µSTX (0.0004–0.01 STX → sub-cent at STX $0.19–0.69). Block capacity: write-length limit 15,000,000 bytes per block (tenure), so ~1 MB of inscriptions fits in a single fast block; the 16 KB/tx ceiling is Xtrata's chunking choice, with the Wizard orchestrating multi-tx files.
- *Sources:* api.mainnet.hiro.so (live pull); Stacks forum block-dimensions thread
- *URLs:* https://api.mainnet.hiro.so/extended/v1/tx ; https://forum.stacks.org/t/stacks-block-and-tenure-dimensions-expectations-and-discussion/17665
- *Date:* 2026-07-21 / 2024-10-29
- *Confidence:* High for samples; Medium when extrapolated to per-MB estimates (§4).

**E19 — Clarity: decidable contracts = enforceable object logic**
- *Claim:* Clarity is interpreted (what you see is what executes), decidable (predictable, finite execution), with no reentrancy and transaction post-conditions — properties that let object relationships (escrow of parents, dependency checks, royalty/market rules, sponsored-drop accounting) be enforced by the settlement layer itself rather than by an indexer's convention.
- *Source:* CertiK Clarity best-practices
- *URL:* https://www.certik.com/resources/blog/clarity-best-practices-and-checklist
- *Date:* 2024-08-14
- *Confidence:* High.

**E20 — Bitcoin-native assets & identity: sBTC, USDCx, BNS .btc**
- *Claim:* sBTC (1:1 BTC, threshold-signature peg, live since Dec 2024) and **USDCx** (USDC-backed stablecoin issued via Circle xReserve, live on Stacks mainnet Dec 17–18, 2025; contract `SP120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE.usdcx`; first stablecoin built to Circle's Machine Payments Protocol spec, published 2026-06-23, aimed at AI-agent payments) give Xtrata's market BTC- and USD-denominated settlement. BNS (.btc) provides globally unique, strongly-owned names (zone files ~40 KB; BNSv2 names are SIP-09 NFTs) — the identity layer Xtrata's wallet lookup uses.
- *Sources:* circle.com blog; cryptobriefing; docs.stacks.co BNS history; spark.money sBTC explainer
- *URLs:* https://www.circle.com/blog/usdcx-on-stacks-now-available-via-circle-xreserve ; https://cryptobriefing.com/stacks-usdcx-usdc-mpp-stablecoin/ ; https://docs.stacks.co/learn/network-fundamentals/bitcoin-name-system/history ; https://www.spark.money/research/sbtc-bridge-bitcoin-defi-stacks
- *Date:* 2025-12-18 / 2026-07-02 / 2025-08-05 / 2026-06-22
- *Confidence:* High.

**E21 — Honest caveat: Stacks chain-state pruning proposal (2026)**
- *Claim:* A 2026 core-dev proposal would limit `at-block` lookback to six cycles and allow nodes to prune older state (archive nodes retain full history). If Xtrata media is held in contract state, long-horizon retrievability could come to depend on archive/API nodes rather than every full node — analogous in spirit (though far less severe) to the indexer dependence Xtrata criticizes elsewhere.
- *Source:* Stacks forum — "Chain State Pruning and at-block Proposed Change"
- *URL:* https://forum.stacks.org/t/chain-state-pruning-and-at-block-proposed-change/18685
- *Date:* 2026-02-21
- *Confidence:* Medium (proposal stage; impact on Xtrata's storage layout unverified).

### 2.6 Filecoin / Sia / Storj — storage without object semantics

**E22 — Filecoin: deal-based, finite terms, renewal risk**
- *Claim:* Filecoin storage is sold as time-limited deals; sector/deal lifetimes center on 540 days (SEC-filed miner disclosure: "the mining process… is typically a 540 days process"; lotus dev: "for pledged sectors the min lifetime is 540 days"). Deals "must be actively renewed" — "liveness risk if deals lapse"; retrieval is a separate, immature market. Market prices ~$0.0000002–0.001/GB/month.
- *Sources:* SEC filing (BitFuFu 20-F correspondence); filecoin-project/lotus discussion #6463; chainscorelabs
- *URLs:* https://www.sec.gov/Archives/edgar/data/1296774/000110465923110394/filename1.htm ; https://github.com/filecoin-project/lotus/discussions/6463 ; https://chainscorelabs.com/comparisons/storage-ipfs-vs-arweave-vs-filecoin/permanent-vs-ephemeral-storage/filecoin-vs-arweave-storage-market-vs-endowment-model
- *Date:* 2023-10-20 / n.d. / 2026-06-17
- *Confidence:* High.

**E23 — Sia: renter-funded contracts (~90 days), auto-renewal or data loss**
- *Claim:* Sia splits files into 30 erasure-coded segments (any 10 recover); renters prepay file contracts that "typically last 90 days" and auto-renew from the renter's allowance — stop funding and the data is gone; ~$1–2/TB/month.
- *Sources:* datarecovery.com explainer; cryptopolitan
- *URLs:* https://datarecovery.com/rd/siacoin-change-data-storage/ ; https://www.cryptopolitan.com/siacoin-wallet-best-use-crypto-wallet/
- *Date:* 2019-12-04 / 2022-06-25 (mechanics unchanged; renterd/hostd current)
- *Confidence:* Medium-High.

**E24 — Storj: subscription object storage; non-payment ⇒ deletion**
- *Claim:* Storj tiers run $6–15/TB-month (legacy $4/TB-month) + egress; it is explicitly a subscription: "If you opt-out, your account will be frozen and data deleted within 45 days" (2026 pricing docs).
- *Sources:* storj.dev pricing docs; mixpeek S3-storage survey
- *URLs:* https://storj.dev/dcs/pricing/tiered ; https://mixpeek.com/curated-lists/best-s3-compatible-object-storage
- *Date:* 2026 (pricing effective 2026-07-01)
- *Confidence:* High.

**E25 — The structural gap**
- *Claim:* Filecoin/Sia/Storj provide bytes-as-a-service: no native notion of an *owned object* with provenance, dependencies, replies, marketplace escrow, or Bitcoin settlement. An NFT on another chain pointing at these stores still dies by link if deals/renewals lapse (E7/E8). Xtrata collapses storage + ownership + relationships + market into one anchored layer.
- *Source:* synthesis of E7, E8, E22–E24
- *Confidence:* High (synthesis).

---

## 3. Comparison table

**Cost per MB stored (USD, best-available mid-2026 anchors; ranges = fee-regime dependent):**

| Technology | Cost per MB (approx.) | Basis |
|---|---|---|
| **Xtrata (Stacks)** | **~$0.1–2.0 (est.)** | 64 × 16 KB txs/MB × est. 0.005–0.05 STX/tx (live fee samples E18) × STX $0.19–0.69; claimable free via sponsorship |
| Bitcoin Ordinals | **$160–315 today; $3.9k–15.8k busy; measured $6.6k** | 262.6k vB/MB × 1–2 sat/vB (live) / 25–100 sat/vB; Quantum Cats actuals |
| Ethereum SSTORE | ~$1.3k–13.1k | 20k gas/32 B × 1–10 gwei × ETH $2k |
| Ethereum calldata / Ethscriptions | ~$34–336 | 16 gas/B × 1–10 gwei × ETH $2k |
| Solana full on-chain (rent-exempt) | ~$1.1k | 6,960 lamports/B × SOL $150 |
| Solana cNFT | ~$0 on-chain (32 B leaf only) — media off-chain | 100k cNFTs ≈ 4 SOL total (tree rent) |
| Arweave | ~$0.019 one-time | 10.45 AR/GiB × $1.85 (Jun 2026) |
| Filecoin | ~$0.0000002–0.001/GB/mo + renewal ops | deal market |
| Sia | ~$1–2/TB/mo (~$0.001–0.002/GB/mo) | renter contracts |
| Storj | ~$6–15/TB/mo + egress | subscription |

**Capabilities matrix:**

| Dimension | Xtrata | Bitcoin Ordinals | ETH NFT + IPFS/Arweave | Ethscriptions | Solana cNFT | Arweave | Filecoin/Sia/Storj |
|---|---|---|---|---|---|---|---|
| Media fully on-chain | ✅ in inscription data | ✅ witness data | ❌ (mostly off-chain; ~10% on-chain) | ✅ calldata | ❌ 32 B leaf; media off-chain | ✅ blockweave | ✅ (but off any asset chain) |
| Permanence model | Stacks chain state + Bitcoin anchoring (finality ~1 BTC block); watch pruning proposal E21 | Bitcoin itself (strongest L1) | IPFS pinning / server ops; Arweave endowment if used | Ethereum calldata history | Solana ledger + off-chain media store | 200-yr endowment (economic) | Renewable deals/contracts; lapse ⇒ loss |
| Wallet-native ownership & market | ✅ STX/sBTC/USDCx escrow contracts | ✅ UTXO/PSBT (no contracts) | ✅ ERC-721/1155 contracts | ⚠️ indexer/AppChain-derived | ✅ (via DAS indexers) | ❌ | ❌ |
| Typed object graph (multi-parent, dependency, replies) | ✅ contract-enforced | ⚠️ parent/child only (tag 3); no deps/replies; indexer-legible only | ❌ (custom per-contract, no media graph) | ❌ | ❌ | ❌ (tags only) | ❌ |
| Smart-contract legibility of relationships | ✅ Clarity reads/acts on graph | ❌ Bitcoin script cannot | ✅ on EVM | ❌ (indexer-only) | ⚠️ via proofs/DAS | ❌ | ❌ |
| Sponsored / zero-gas user UX | ✅ native sponsored txs (drops, listings) | ❌ | ⚠️ meta-tx relayers (fragile, non-native) | ❌ | ⚠️ relayers possible | ❌ | ❌ |
| Bitcoin finality | ✅ via Stacks PoX (~100% BTC finality) | ✅ native (10-min blocks) | ❌ | ❌ (Ethereum) | ❌ | ❌ | ❌ |
| Confirm speed | ~5 s blocks | ~10 min | ~12 s (L1) | ~12 s | ~0.4 s | ~2 min block | minutes (deals) |
| Cost per MB (table above) | ~$0.1–2 | $160–15.8k | $1.3k–13k (SSTORE) | $34–336 | ~$1.1k full / $0 cNFT | ~$0.019 | ~$0.0002–0.015/GB/mo |
| Size limits per object | 16 KB/tx, chunked by Wizard (15 MB block write budget) | ~<100 KB standard; 4 MB block; >100 KB needs miner collab | contract-size/gas limits | calldata/tx (~128 KB practical) | account-based | 12 MiB native / bundlers more | GB–TB |
| Machine/agent ecosystem | SDKs + AI-agent training docs + USDCx MPP (machine payments) | ord API/indexers | EVM tooling | indexer API | DAS API | gateway HTTP | S3/API |

---

## 4. Cost-model assumptions & sensitivities

- **Prices (2026-07-21 unless noted):** BTC ≈ $60k (statmuse Jul-1 close $60,010.85; crypto.news "near $60,000" Jul-10); ETH ≈ $2,000 (assumption — mid-2026 bear; direct quote not obtained, sensitivity shown via gas-price range); STX ≈ $0.19 (coingape Jul-2026 model $0.165–0.23; Jul-2025 actual $0.69 — both ends used in ranges); AR ≈ $1.85 (Jun-28-2026 dashboard); SOL $150 reference for 2023–24 SOL-denominated figures.
- **Live fee inputs (2026-07-21):** Bitcoin 1–2 sat/vB (mempool.space API); Stacks contract calls 417–10,000 µSTX typical (Hiro API sample).
- **Xtrata per-MB estimate is an extrapolation** (16 KB chunks × typical contract-call fees). Xtrata may add service margins (Wizard is a paid, single-payment service). Treat as order-of-magnitude: **~10–100× more expensive than Arweave raw storage; ~100–10,000× cheaper than Bitcoin L1 inscriptions; ~30–300× cheaper than Ethscriptions calldata.**
- Bitcoin inscription math: 1 MB content ≈ 1 MB witness ≈ 262,144 vB + ~0.4–1k vB overhead (commit+reveal), witness discount applied.

---

## 5. Xtrata's defensible differentiators

1. **The only typed, contract-enforced object graph on anchored, on-chain media.** Multi-parent ownership links (parents escrowed by contract during mint), existence-only dependency references, and on-chain reply threads — all machine-readable *by smart contracts at the settlement layer*. Ordinals' tag-3 provenance (E2) is the closest rival but is single-purpose, indexer-legible only (Bitcoin script can't act on it), and offers no dependencies or replies (E3); everyone else's "relationships" are off-chain metadata conventions.
2. **Bitcoin-finality objects at Stacks cost and speed.** On-chain media with Bitcoin settlement (~100% BTC finality post-Nakamoto) at ~$0.1–2/MB and ~5-second confirmations — versus $160–15,800/MB and ~10-minute blocks for the equivalent on Bitcoin L1, with Ordinals >100 KB requiring private miner coordination (E4, E5).
3. **Sponsored, zero-STX distribution as a protocol-native flow.** Free-claim Drops and sponsored listings (creator/seller prepay) are first-class: Bitcoin L1 has no sponsored fees at all; EVM chains need fragile meta-tx relayers. This converts "claiming a permanent object" into a Web2-grade UX (E17).
4. **True permanence without a renewal operator — with ownership attached.** Unlike IPFS pinning, Filecoin/Sia/Storj (deals lapse, data deleted — E22–E24) or ETH NFTs pointing at servers (10% on-chain; $160M+ in documented lost assets — E7, E8), the object *and* its media persist in the same layer that records who owns them. Arweave matches permanence more cheaply per MB (~$0.019/MB) but has no native ownership/market/graph — the asset layer must be glued on elsewhere (E12).
5. **Object programmability in a decidable language (Clarity).** Escrowed minting, market settlement, drop accounting and future remix/royalty logic execute under Clarity's decidable, no-reentrancy, post-condition-guarded semantics — a materially safer envelope for "living objects" than Solidity NFT contracts (E19).
6. **Bitcoin-native commerce rails: sBTC and USDCx (first MPP machine-payments stablecoin).** The market denominates in BTC- and USD-equivalents that settle to Bitcoin; USDCx being first to Circle's Machine Payments Protocol spec (2026-06-23) aligns Xtrata's "AI-agent training docs" with agentic, machine-payable object commerce — a combination no Ordinals/EVM/storage-network stack currently ships (E20).
7. **Human identity + agent legibility in one layer.** BNS .btc names (globally unique, strongly owned, SIP-09 NFTs) as the identity primitive for the same wallets that hold objects — no ENS-vs-chain split, and resolvable straight into market/ownership flows (E20).
8. **Independent reconstructability ("website is a gateway").** Objects rebuild from chain data alone — the same self-sovereign property Ordinals popularized, but delivered with 5-second reads, an open SDK/reconstruction toolset, and without L1 fee barriers to writing (E1, E16, E18).

**Honest weaknesses to keep in the narrative (credibility):**
- (a) Ordinals *does* have parent/child provenance — never claim it doesn't; differentiate on contract-legibility, dependencies/replies, multi-parent escrow UX, cost, speed, sponsorship (E2).
- (b) Arweave is ~5–100× cheaper per MB for pure storage; Xtrata's pitch must be semantics+ownership+Bitcoin anchoring, not raw $/MB (E11).
- (c) Stacks' 2026 chain-state-pruning proposal could shift old-state retrievability toward archive nodes — watch impact on "independent reconstruction" claims (E21).
- (d) Xtrata contract code/mainnet addresses not independently verified in this pass; fee-per-MB is an estimate (§4).

---

## 6. Numbered citations

1. Xtrata — homepage/product surface. https://xtrata.xyz (captured 2026-07-21)
2. Ordinal Theory Handbook — Inscriptions. https://docs.ordinals.com/inscriptions.html
3. Ordinal Theory Handbook — Provenance. https://docs.ordinals.com/inscriptions/provenance.html
4. Ordinal Theory Handbook — Recursion. https://docs.ordinals.com/inscriptions/recursion.html
5. b10c.me — An overview of recent non-standard Bitcoin transactions (2024-01-29). https://b10c.me/observations/09-non-standard-transactions/
6. ordinals/ord issue #1240 — Account for MAX_STANDARD_TX_WEIGHT. https://github.com/ordinals/ord/issues/1240
7. Bitcoin StackExchange — Maximum relayed transaction size. https://bitcoin.stackexchange.com/questions/117277/
8. ordinals/ord issue #3719 — Recursive-endpoint request scaling for on-chain games (2024-05-02). https://github.com/ordinals/ord/issues/3719
9. The Block — Ordinals recursive inscriptions (2023-06-12). https://www.theblock.co/post/234195/ordinals-recursive-inscriptions-bitcoin-video-games
10. The Defiant — Quantum Cats: $66k to inscribe 10 MB (2024-01-12). https://thedefiant.io/news/nfts-and-web3/quantum-cats-ordinals-collection-pays-homage-to-satoshi
11. mempool.space — live recommended fees API (pulled 2026-07-21). https://mempool.space/api/v1/fees/recommended
12. StatMuse Money — BTC price Jul 1 2026 ($60,010.85 close). https://www.statmuse.com/money/ask/bitcoin-price-in-july-01-2026
13. crypto.news — Bitcoin price prediction July 2026 (BTC near $60k; Jan $93k; Oct-2025 peak $126k). https://crypto.news/bitcoin-price-prediction-july-2026-fed-decides/
14. YBB Capital — Bitcoin ecosystem overview (Ordinals UTXO mechanics) (2023-12-21). https://www.odaily.news/post/5191885
15. Decrypt — Are Your NFTs Safe? (YourNFTS/ClubNFT 10/40/50; UCSB 3.91%/9.04%; $160.7M; FTX NFTs) (2023-05-06). https://decrypt.co/138676/are-your-nfts-safe-how-to-protect-digital-assets-from-disaster
16. Right Click Save — How many NFTs are actually on the blockchain? (66.44% HTTP / 23.81% IPFS / 9.06% on-chain / 0.69% Arweave of 12.36M) (2022-06-20). https://www.rightclicksave.com/article/how-many-nfts-are-actually-on-the-blockchain
17. Right Click Save — The NFT Apocalypse (~$16B of NFTs on doomed private servers; ETH MB cost "thousands"). https://www.rightclicksave.com/article/the-nft-apocalypse
18. arXiv:2408.13281 — Hidden Risks: The Centralization of NFT Metadata (top-100 OpenSea: 31.68% centralized, 38.84% IPFS, 25.62% on-chain). https://arxiv.org/html/2408.13281v1
19. xtz.news — ClubNFT backup tool (CoinDesk quote on IPFS persistence) (2023-10-18). https://xtz.news/adoption/clubnft-a-tool-to-download-all-of-the-ipfs-data-associated-with-all-of-your-nfts-with-the-click-of-a-button/
20. evm.codes — EVM opcode gas reference (SSTORE 20,000 gas/slot; calldata 16 gas/byte). https://evm.codes/
21. ArDrive — What is Arweave? (endowment; 30.5%/yr storage decline; 200-year floor) (2026-04-02). https://ardrive.io/what-is-arweave
22. ChainScore Labs — Filecoin vs Arweave: Storage Market vs Endowment (2026-06-17). https://chainscorelabs.com/comparisons/storage-ipfs-vs-arweave-vs-filecoin/permanent-vs-ephemeral-storage/filecoin-vs-arweave-storage-market-vs-endowment-model
23. kkdemian — Arweave dashboard: 10.45 AR/GiB; AR $1.8–1.9 (2026-06-28). https://kkdemian.com/blog/arweave-ar-permanent-storage-endowment-demand-risk
24. ChainScore Labs — Data redundancy: IPFS vs Arweave vs Filecoin (~$0.02/MB one-time; Filecoin renewal risk) (2026-06-14). https://chainscorelabs.com/comparisons/storage-ipfs-vs-arweave-vs-filecoin/storage-provider-selection-criteria/data-redundancy-strategies-ipfs-vs-arweave-vs-filecoin
25. Ethscriptions docs — Introducing Ethscriptions (calldata Data URIs; indexer/AppChain). https://docs.ethscriptions.com/
26. Weixin/odaily-style explainer — Middlemarch: Ethscriptions "40× cheaper than NFTs" (2025-07-25). http://mp.weixin.qq.com/s?__biz=Mzk0OTQ0MDAxNA==&mid=2247484783&idx=1&sn=a2359b3cbe5a019ee87c9e0c241c462c
27. EIP-4844 — Shard Blob Transactions (blob data deleted after ~18 days; not EVM-accessible). https://eips.ethereum.org/EIPS/eip-4844
28. SolanaCompass — Breakpoint 2023: 100k cNFTs ≈ 4 SOL; 1B ≈ 500 SOL (2023-11-09). https://solanacompass.com/learn/breakpoint-23/breakpoint-2023-compressed-nfts-bubblegum-goes-brrr
29. Helius (via learnblockchain) — Solana state compression: 1M NFTs <$150 (2023-10-12). https://learnblockchain.cn/article/12641
30. ChainCatcher — Solana research report: cNFT data off-chain, RPC/DAS dependency (2024-03-21). https://www.chaincatcher.com/article/2118054
31. Typefully — cNFT explainer: 0.012 SOL mint vs 0.00000005 SOL; 32-byte leaf (2026-03-01). https://typefully.com/BintuParis/exploring-solanas-compressed-nfts-cnfts-aHhO8Xz
32. Stacks Docs — What was the Nakamoto Upgrade? (fast blocks; 100% Bitcoin finality). https://docs.stacks.co/learn/block-production/what-was-the-nakamoto-upgrade
33. ChainCatcher — Stacks/Nakamoto deep dive: ~5 s confirmations, cents-level fees, ~30-min BTC finality (2025-08-11). https://www.chaincatcher.com/en/article/2196162
34. Stacks Docs — sBTC Transaction Fee Sponsorship. https://docs.stacks.co/concepts/sbtc/auxiliary-features/fee-sponsorship
35. Xverse — Bitcoin NFT wallet FAQ: zero-fee sponsored Stacks NFT transactions. https://www.xverse.app/bitcoin-nft-wallet
36. aibtcdev — x402-sponsor-relay: gasless Stacks transactions (`sponsored: true, fee: 0n`) (2026-03-31). https://github.com/aibtcdev/x402-sponsor-relay
37. Hiro mainnet API — live tx fee sample (pulled 2026-07-21). https://api.mainnet.hiro.so/extended/v1/tx
38. Stacks Forum — Block and tenure dimensions (write-length limit 15,000,000 bytes) (2024-10-29). https://forum.stacks.org/t/stacks-block-and-tenure-dimensions-expectations-and-discussion/17665
39. CertiK — Clarity: Best Practices and Checklist (decidable; no reentrancy; post-conditions) (2024-08-14). https://www.certik.com/resources/blog/clarity-best-practices-and-checklist
40. Circle — USDCx on Stacks now available via Circle xReserve (contract address) (2025-12-18). https://www.circle.com/blog/usdcx-on-stacks-now-available-via-circle-xreserve
41. CryptoBriefing — USDCx first stablecoin under Circle's Machine Payments Protocol spec (2026-07-02). https://cryptobriefing.com/stacks-usdcx-usdc-mpp-stablecoin/
42. Stacks Docs — History of BNS (.btc identity; zone files ~40 KB; BNSv2 SIP-09) (2025-08-05). https://docs.stacks.co/learn/network-fundamentals/bitcoin-name-system/history
43. Spark — sBTC: How Stacks Bridges Native Bitcoin Into DeFi (Nakamoto activated Oct 2024) (2026-06-22). https://www.spark.money/research/sbtc-bridge-bitcoin-defi-stacks
44. Stacks Forum — Stacks 2025 Year in Review: USDCx launch (2025-12-30). https://forum.stacks.org/t/stacks-2025-year-in-review/18583
45. Stacks Forum — Chain State Pruning and `at-block` Proposed Change (2026-02-21). https://forum.stacks.org/t/chain-state-pruning-and-at-block-proposed-change/18685
46. SEC (BitFuFu 20-F correspondence) — Filecoin mining "typically a 540 days process" (2023-10-20). https://www.sec.gov/Archives/edgar/data/1296774/000110465923110394/filename1.htm
47. filecoin-project/lotus discussion #6463 — 540-day min sector lifetime. https://github.com/filecoin-project/lotus/discussions/6463
48. Datarecovery.com — How Siacoin works (30-segment erasure coding; ~90-day file contracts) (2019-12-04). https://datarecovery.com/rd/siacoin-change-data-storage/
49. Cryptopolitan — Sia storage $1–2/TB-month (2022-06-25). https://www.cryptopolitan.com/siacoin-wallet-best-use-crypto-wallet/
50. Storj Docs — Tiered pricing ($6–15/TB-month; opt-out ⇒ frozen, data deleted in 45 days; effective 2026-07-01). https://storj.dev/dcs/pricing/tiered
51. Mixpeek — S3-compatible storage survey 2026 (Storj $4/TB-month + $7/TB egress) (2026-04-10). https://mixpeek.com/curated-lists/best-s3-compatible-object-storage
52. CoinGape — STX price model July 2026 ($0.165–0.23) (2026-07-19). https://coingape.com/price-predictions/stacks-stx-price-prediction/
53. Blockworks — What Was Inside Bitcoin's Biggest Block? (3.94 MB inscription; miner-direct) (2023-02-02). https://blockworks.co/news/inside-bitcoin-biggest-block

*Search-volume note: this report reflects 15 distinct search rounds (30+ queries) plus direct opens of primary documentation and two live API pulls, per mission requirements.*
