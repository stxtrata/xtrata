# Xtrata (xtrata.xyz) — Documentation & Developer Surface Map

Research date: 2026-07-20/21. Researcher: subagent dim01.
Scope: technical architecture, SDK, agent-training docs, limits/costs, audio features ("Xtrata Radio"), contracts, API endpoints, repos.

Note on branches: the public homepage links docs on the `OPTIMISATIONS` branch of `stxtrata/xtrata`; the repo's own documentation index says the canonical published branch is `main-staging` (paths are identical). Both were consulted. [^3^]

---

## 1. Identity, positioning, and live status

Claim: Xtrata is a fully on-chain inscription protocol on Stacks (Bitcoin L2) — "Ordinals-style inscriptions" moved into a smart-contract environment; media/data stored as SIP-009 NFTs with content in on-chain chunks. Live and functional on mainnet. [^1^][^2^]
Source: https://xtrata.xyz + https://dorahacks.io/buidl/40376 / Date: homepage live 2026-07-20; DoraHacks BUIDL BATTLE #2 page (2026-03-16) / Excerpt: "Xtrata brings Ordinals-style inscriptions to Stacks, enabling permanent, composable media and application data on Bitcoin's fastest smart contract layer… This is not a concept. It is a working on-chain media and application data layer running on Stacks." / Confidence: high

Claim: Deployer / core address is `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X`; canonical live core contract is `xtrata-v3-2-3` (Clarity 3), deployed 2026-06-08; lineage `xtrata-v1-1-1` → `xtrata-v2-1-0` → `xtrata-v3-2-3`, with ID continuity offset (new mints continue from token id 359). [^6^][^21^]
Source: contract-inventory.md + Hiro extended API deploy scan / Date: 2026-07-20 / Excerpt: "The canonical live core is **SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3** (Clarity 3), deployed 2026-06-08. Lineage: xtrata-v1-1-1 → xtrata-v2-1-0 → xtrata-v3-2-3… Continuity offset set so new native mints continue from token id 359." On-chain verification: `get-last-token-id` returns 2807 (v3-2-3), 359 (v2-1-0), 38 (v1-1-1); `get-minted-count` on v3-2-3 = 2,696; `get-fee-unit` = 100,000 µSTX (0.1 STX). / Confidence: high

Claim: Deploy history of first-party contracts (all at SP3JNS…X743X, mainnet): xtrata-v1-1-1 (2026-01-27), xtrata-market-v1-0 & v1-1 (2026-01-31), xtrata-v2-1-0 (2026-02-07), xtrata-arcade-scores-v1-0→v1-3 (2026-02-18→20), xtrata-small-mint-v1-0 (2026-03-06), xtrata-collection-mint-v1-4 (2026-03-06), xtrata-commerce + xtrata-market-usdc-v1-0 + xtrata-market-sbtc-v1-0 (2026-03-08), xtrata-market-stx-v1-0 (2026-03-08), xtrata-vault (2026-03-09), xtrata-v2-1-1 ×2 and xtrata-v3-2-2 (2026-06-06/07), xtrata-v3-2-3 (2026-06-07 & 06-08), sponsored market family xtrata-market-sponsored-{stx,sbtc,usdcx}-v1-0/v1-1 (2026-07-10), xtrata-drops-v1-0 (2026-07-11). [^21^]
Source: https://api.mainnet.hiro.so/extended/v1/address/SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X/transactions (full scan, smart_contract txs) / Date: queried 2026-07-20 / Confidence: high (observed on-chain)

Claim: Code repository is `github.com/stxtrata/xtrata` (user "stxtrata"), with 30+ working branches (OPTIMISATIONS, main-staging, SDKs, Opus-File_generator_ONLY, agent-27, etc.); docs are Markdown inside `xtrata-1.0/docs/`. Social: x.com/XtrataLayers. [^1^][^3^]
Source: homepage footer links + GitHub API / Date: 2026-07-20 / Confidence: high

---

## 2. Technical architecture (storage, chunking, reconstruction)

Claim: Inscriptions are SIP-009 NFTs whose content is stored fully on-chain in fixed 16,384-byte chunks in a `Chunks` map `{context: (buff 32), creator: principal, index: uint} => (buff 16384)`; metadata in `InscriptionMeta` (owner, creator, mime-type, total-size, total-chunks, sealed, final-hash). [^4^][^6^]
Source: handbook + contract-inventory / Excerpt: "Xtrata inscriptions are SIP-009 NFTs with on-chain content stored in chunks." / Confidence: high

Claim: Mint flow is staged and content-addressed: (1) compute expected hash over ordered chunks; (2) `begin-or-get(expected-hash, mime, total-size, total-chunks)`; (3) `add-chunk-batch(hash, chunks)` repeatedly; (4) `seal-inscription(expected-hash, token-uri-string)` (or `seal-recursive` / `seal-inscription-batch`). `begin-or-get` doubles as dedupe — already-sealed hash returns `(ok (some id))`; `get-id-by-hash` gives canonical id lookup. [^4^][^7^][^10^]
Source: handbook §5 + api-reference + agent skill / Excerpt: "Xtrata is content-addressed… Use `begin-or-get(expected-hash, ...)` to avoid duplicate uploads." / Confidence: high

Claim: Hashing is an incremental SHA-256 chain hash (NOT a plain file hash): start with 32 zero bytes; per chunk `next-hash = sha256(concat(current-hash, data))`; final value = `expected-hash`/`final-hash`. Must match contract `process-chunk`. [^10^][^13^]
Source: XTRATA_AGENT_SKILL.md "Incremental Hashing (Required)" / Excerpt: "The hash is computed as a chain: start with 32 zero bytes, then for each chunk concatenate the current running hash (32 bytes) with the raw chunk bytes and SHA-256 the result." / Confidence: high

Claim: Upload sessions are resumable: `UploadState` tracks current-index/running-hash/last-touched; sessions persist `UPLOAD-EXPIRY-BLOCKS = u4320` blocks (~30 days); `abandon-upload` marks early expiry; `purge-expired-chunk-batch` is a permissionless cleanup anyone can call. [^7^][^10^]
Source: api-reference + agent skill / Confidence: high

Claim: Fee model is one-knob: begin fee = `fee-unit` once; `add-chunk-batch` = no protocol fee; seal fee = `fee-unit * (1 + ceil(total-chunks / 50))`; batch seal sums per-item fees; migration fee = fee-unit; royalty-recipient pays no fee. fee-unit bounds: FEE-MIN u1000 (0.001 STX), FEE-MAX u1000000 (1 STX); current default 100,000 µSTX = 0.1 STX (verified live). [^7^][^10^][^25^]
Source: api-reference "Fee Model (one-knob)" + live call-read / Excerpt: "Begin fee: fee-unit… Seal fee: fee-unit * (1 + ceil(total-chunks / 50))… Default fee-unit: 100_000 microSTX (0.1 STX)" / Confidence: high

Claim: Hard protocol limits: CHUNK-SIZE 16,384 B; MAX-TOTAL-CHUNKS 2,048 → MAX-TOTAL-SIZE 32 MiB; MAX-BATCH-SIZE 50 chunks per contract call, but first-party app/SDK planners cap uploads at 30 chunks/tx; batch seal max 50 items; dependency list max 50 IDs; once sealed, content is immutable. A v3.1.1 contract source adds chunk profiles for larger files: u1 16KiB/32MiB, u2 64KiB/128MiB, u3 128KiB/256MiB (not promoted to public default). [^4^][^6^][^13^]
Source: handbook §3 + contract-inventory + reconstruction-spec / Excerpt: "Chunk size is fixed at 16,384 bytes. Max chunks per inscription: 2,048. Max total size: 32 MiB… first-party app and SDK chunk upload batch size: 30." / Confidence: high

Claim: Cost examples derivable from the fee model: a 1-chunk (≤16 KB) text/file inscription costs begin 0.1 + seal 0.2 = 0.3 STX protocol fee (+ network fees); a maximal 2,048-chunk (32 MiB) inscription costs 0.1 + 0.1×(1+⌈2048/50⌉)=4.3 STX protocol fee plus ~69+ upload transactions' network fees. [^7^][^10^]
Source: derived from documented fee formulas / Confidence: high (arithmetic on documented constants)

Claim: Reconstruction is independent of the website: read `get-inscription-meta`, fetch chunks `0..total-chunks-1` via `get-chunk-batch` (50 max, runtime clamps to 30), concatenate in order, trim to total-size, verify against `final-hash`; migrated tokens may need fallback chunk reads v3→v2.1.0→v1.1.1. A formal "Public Proof Standard" records network, contract IDs, token id, hashes, read mode for third-party re-verification. [^4^][^13^]
Source: reconstruction-spec / Excerpt: "define the public rules required to rebuild a Xtrata inscription without using xtrata.xyz as a trust anchor… No privileged Xtrata API is required." / Confidence: high

Claim: HTTP byte aliases served by a Cloudflare Pages Functions runtime: `https://xtrata.xyz/inscription/{id}` (readable) and `https://xtrata.xyz/i/{id}` (compact, not a redirect) return reconstructed bytes with CORS `*`, `Accept-Ranges: bytes`, `cache-control: immutable`, and proof headers (X-Xtrata-Runtime-Final-Hash, -Total-Chunks, -Reconstruction-* counters). Runtime limits: cpu_ms 30000, subrequests 2000. Verified live: /i/312 returns `audio/mpeg`, 4,533,058 bytes in 277 chunks from xtrata-v3-2-3 (an MP3 "Smalltalk"); /i/1107 returns 697,408-byte text/html app. [^4^][^13^][^23^][^26^]
Source: handbook §6 + live HTTP probes / Date: 2026-07-20 / Confidence: high (observed)

Claim: IDs in v2+ are non-contiguous (offset/migration); indexers must enumerate with `get-minted-count` + `get-minted-id`; `get-last-token-id` = highest minted ID. [^4^]
Source: handbook §8 / Confidence: high

Claim: Versioning/migration: v2 introduced one-time next-id offset, allowlisted callers while paused, and `migrate-from-v1` (escrow v1 token, re-mint same ID in v2; chunks stay in v1). v3.4.0 (Clarity 4, source-stage) uses trait-based migration params (`migrate-single-tx`, `migrate-staged`). A backup/migration service blueprint ports IPFS-backed collections into SIP-009 with on-chain backup pointers (`xtrata-backup-registry-v1.0`, `xtrata-migrated-ipfs-collection-v1.0` prototypes). [^6^][^3^]
Source: contract-inventory + doc index / Confidence: high

---

## 3. "Recursive inscriptions" meaning

Claim: A recursive inscription explicitly declares on-chain dependencies: `InscriptionDependencies` map `uint -> (list 50 uint)`, sealed via `seal-recursive`, read via `get-dependencies(id)`; dependencies must already exist at seal (`dep-id < next-id`); ordering/dedupe NOT enforced. Parents/children: the app also supports multi-parent "parent→child" ownership links where each parent NFT is escrowed during the mint and returned; the on-chain dependency list doubles as the authoritative relationship index. [^5^][^1^]
Source: recursive-inscriptions.md / Excerpt: "A recursive inscription is an inscription whose content or metadata depends on other inscriptions. Xtrata makes this explicit on-chain by storing a dependency list for each recursive inscription and exposing it via read-only calls." / Confidence: high

Claim: Recursive content composes via the byte aliases: recursive HTML/CSS/JS references other inscriptions through same-origin `/i/{id}` URLs; the Xtrata viewer injects a bridge script allowing sandboxed HTML inscriptions to call whitelisted read-only functions (`get-chunk`, `get-inscription-meta`, `get-token-uri`, `get-owner`, `get-dependencies`, `get-svg`, `get-svg-data-uri`) without API keys. [^5^]
Source: recursive-inscriptions.md §"HTML recursion (viewer bridge)" / Confidence: high

Claim: Batch mint (`seal-inscription-batch`, ≤50 items) is non-recursive only; recursive mints use single-item flow. [^5^][^11^]
Source: recursive-inscriptions.md "Batch mint scope" / Confidence: high

---

## 4. Contract inventory & function surfaces

Core inscription contracts (deployer SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X unless noted) [^6^][^7^][^21^]:

Claim: Core `xtrata-v2.1.0` public surface: `transfer`, `set-royalty-recipient`, `set-fee-unit`, `set-next-id` (one-time), `set-allowed-caller`, `set-paused`, `transfer-contract-ownership`, `migrate-from-v1`, `begin-or-get`, `begin-inscription`, `add-chunk-batch`, `seal-inscription`, `seal-inscription-batch`, `seal-recursive`, `abandon-upload`, `purge-expired-chunk-batch`. Read-only: `get-last-token-id`, `get-next-token-id`, `get-minted-count`, `get-minted-id`, `get-token-uri(-raw)`, `get-owner`, `get-svg`, `get-svg-data-uri`, `get-id-by-hash`, `get-inscription-meta`, `inscription-exists`, `get-inscription-hash/-creator/-size/-chunks`, `is-inscription-sealed`, `get-chunk`, `get-chunk-batch`, `get-dependencies`, `get-upload-state`, `get-pending-chunk`, `get-admin`, `is-allowed-caller`, `get-royalty-recipient`, `get-fee-unit`, `is-paused`. Error codes u100–u115. [^7^]
Source: api-reference.md (full tables captured) / Confidence: high

Claim: Helper `xtrata-small-mint-v1-0` (mainnet default helper): single-transaction mint `mint-small-single-tx` / `mint-small-single-tx-recursive` (≤30 chunks ≈ ≤480 KiB), composes begin→chunks→seal in one call, returns `{token-id, existed}`; dedupe returns canonical id for duplicate hashes. v1-1 targets v3.2.x cores. [^6^][^10^]
Source: contract-inventory + agent skill / Confidence: high

Claim: Commerce stack (all live): `xtrata-market-stx-v1-0`, `xtrata-market-usdc-v1-0`, `xtrata-market-sbtc-v1-0` — fixed-price escrow markets (`list-token`, `cancel`, `buy`, `set-fee-bps`); `xtrata-commerce` — USDCx entitlement sales (`create-listing`, `buy-with-usdc`, `has-entitlement`) with NO NFT transfer; `xtrata-vault` — per-asset sBTC reserve vaults (`open-vault`, `deposit-sbtc`, `get-tier-for-amount`, `has-premium-access`) with tier thresholds TIER-1/2/3-MIN; sponsored market family `xtrata-market-sponsored-{stx,usdcx,sbtc}-v1-0/v1-1` (deployed 2026-07-10) enabling zero-STX buyer purchases where seller prepays network fee. Payment tokens: USDCx `SP120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE.usdcx`, sBTC `SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token`. [^6^][^14^][^21^][^1^]
Source: contract-inventory + product-contract-ui-reference + homepage market text / Excerpt (homepage): "Sponsored listings can be bought with zero STX — the seller has prepaid the network fee." / Confidence: high

Claim: Drops: `xtrata-drops-v1-0` (deployed 2026-07-11) — sponsored free claims; ABI (verified live): public `create-drop`, `claim`, `claim-fee`, `cancel`, `settle-refund`, `set-claim-cap`, `set-nft-allowed`, `set-sponsor`; read-only `get-drop`, `get-drop-by-token`, `has-claimed-in-group`, `get-min-fee-budget`, `get-refund-delay`, `get-last-drop-id`, etc. Frontend config: `{label:"Free claims - sponsored", contractName:"xtrata-drops-v1-0", sponsored:true, sponsorApi:"/"}`. [^24^][^20^][^21^]
Source: Hiro contract interface API + main JS bundle / Confidence: high (observed ABI)

Claim: Collection & template contracts: `xtrata-collection-mint-v1.4` (active per-collection mint coordinator: mint price splits artist/marketplace/operator, allowlists, per-wallet caps, `mint-begin`/`mint-add-chunk-batch`/`mint-seal(-batch)`/`mint-small-single-tx(-recursive)`); `xtrata-preinscribed-collection-sale-v1.0` (escrow sale of pre-inscribed inventory: deposit/withdraw/buy, sale windows, splits); `xtrata-arcade-scores-v1.0/v1.1` (live top-10 leaderboards; v1.1 adds secp256k1 attestation signatures, nonces, write fee 0.0001–1 STX, default 0.03 STX). [^6^]
Source: contract-inventory / Confidence: high

Claim: "Forever Twins": helper/escrow contracts porting existing NFT collections into Xtrata with `Bindings` map local-id → {xtrata-id, content-hash, inscriber, xtrata-escrowed} and `swap-pepe-for-xtrata`/`swap-xtrata-for-pepe` escrow flips. Registered: Bitcoin Pepes (`SPV9K21…DC22.pepe-4ever-fakfun`), LeoCats (`…leo-fakfun-xtrata`), Miami Degens (`…miami-degens-fakfun-xtrata`); twins mint into core v3-2-3. [^6^][^10^]
Source: contract-inventory "Forever Twin Helper Contracts" / Confidence: high

---

## 5. SDK surface

Claim: Two workspace packages, both v0.1.0, "production-ready and actively maintained": `@xtrata/sdk` (packages/xtrata-sdk — config, network, client, mint, collection, market, deploy, simple, safe, workflow, type, error exports) and `@xtrata/reconstruction` (packages/xtrata-reconstruction — deterministic chunk assembly, hash verification, dependency graph, fallback sources, diagnostics). NOT published to npm (registry returns "Not found") — repo/distribution via GitHub tarballs. [^3^][^8^][^27^][^28^]
Source: documentation-index + sdk/README + npm probe / Date: 2026-07-20 / Confidence: high

Claim: SDK API layers: `simple` (`createXtrataReadClient`, `createXtrataReconstructionSources`, `createCollectionReadClient`, `createMarketReadClient`, `createSimpleSdk`, token snapshots); `workflows` (deny-mode prebuilt write plans: `buildCoreMintWorkflowPlan`, `buildCollectionMintWorkflowPlan`, `buildMarketListWorkflowPlan`, `buildMarketBuyWorkflowPlan`, `buildMarketCancelWorkflowPlan`, `buildBackupMigrationWorkflowPlan`); `mint` (chunkBytes, computeExpectedHash, fee & post-condition primitives); `safe` (deterministic spend caps, `buildMintRecoveryGuide`); `client`, `deploy`, `collections`, `market`, `backup-migration`. Guardrails: `SdkValidationError` fail-fast, network-mismatch rejection, enforced spend-cap prerequisites. Subpath imports: `@xtrata/sdk`, `/simple`, `/workflows`, `/backup-migration`. [^9^][^12^]
Source: sdk/api-overview.md / Confidence: high

Claim: Reconstruction package: `reconstructXtrataInscription({tokenId, sources, strict, batchSize, concurrency})`, `verifyPayload`, `assertVerified`; `strict:true` throws `ReconstructionVerificationError` if rebuilt payload mismatches on-chain `final-hash`; batch-first reads with per-chunk fallback; 30-chunk clamp; ordered fallback sources for migrated content. [^28^][^13^]
Source: packages/xtrata-reconstruction/README.md / Confidence: high

Claim: SDK docs set (15+ quickstarts/references): quickstart-first-30-minutes, quickstart-simple-mode, quickstart-read-only, quickstart-mint, quickstart-collection-mint, quickstart-safe-transactions, quickstart-workflows, quickstart-reconstruction, compatibility-matrix, troubleshooting, migration-guide, test-gates, changelog; release gates via `npm run sdk:*` scripts (docs:validate, typecheck, build, test, pack:smoke, examples:smoke, release:dry-run). Example apps: `examples/xtrata-example-marketplace` (workflow-based buy plans) and `examples/xtrata-example-campaign-engine` (drops/campaign UX with safety caps). [^3^][^8^]
Source: documentation-index + sdk/README / Confidence: high

Claim: SDK code example (quickstart workflow plan): `buildCoreMintWorkflowPlan({contract:{address:'SP3JNS…', contractName:'xtrata-v2-1-1', network:'mainnet'}, senderAddress, payloadBytes, expectedHash, mimeType, tokenUri, mintPrice, protocolFeeMicroStx:100_000n})` returns beginCall/addChunkBatchCalls/sealCall plus safety summaryLines. [^12^]
Source: quickstart-first-30-minutes.md / Confidence: high

---

## 6. AI-agent training surface

Claim: Dedicated AI training package: `XTRATA_AGENT_SKILL.md` (1,106-line canonical skill with YAML frontmatter `name: xtrata-inscription`, explicitly targeting autonomous agents "including agents from the aibtc platform that hold STX and want to create or trade inscriptions autonomously"), plus `docs/ai-skills/` with `skill-inscribe.md`, `skill-batch-mint.md` (planned: skill-transfer, skill-query), and two training tracks: `aibtc-agent-training.md` (MCP wallet tools) and `generic-agent-training.md`. Skill docs are "designed to be small enough to inscribe on-chain where practical." [^10^][^11^][^15^][^16^]
Source: agent skill + ai-skills README / Excerpt: "Self-contained skill documents for teaching AI agents to use Xtrata." / Confidence: high

Claim: Expected autonomous behavior — a documented "Autonomous 10-Step Loop": receive instruction → check balance → chunk to 16,384 B → compute chain hash → dedupe (`get-id-by-hash`) + `get-upload-state` → choose helper route (1..30 chunks, no session) vs staged route → begin/upload (≤50/tx, wait confirmations, ≥5s spacing) → seal with strict spend cap → verify `get-inscription-meta` + canonical id → return structured `{tokenId, txids, hash, mimeType, totalSize, route}`. [^10^]
Source: XTRATA_AGENT_SKILL.md / Confidence: high

Claim: Safety baseline mandated to agents: `PostConditionMode.Deny` on fee-paying writes; check `get-fee-unit` before building spend caps; present costs and get user confirmation before any transaction; bounded retries with 15s→30s→60s→120s backoff on 429/5xx; log txids and hash/token mappings; testnet rehearsal before mainnet; never log keys; aibtc MCP tools unsafe for chunk-bearing list(buff) args (silent empty-buffer bug — detect via running-hash `66687aad…2925` = sha256(32 zero bytes)); use direct `@stacks/transactions` signing for chunk writes. [^10^][^11^][^15^]
Source: agent skill + ai-skills README + aibtc training / Confidence: high

Claim: Agent-facing index API (D1/Cloudflare-backed, no per-token chain reads): `GET /index/<contract>?ids=…` (or `?from=&limit=&order=`) token summaries; `GET /index/page?primary=&lineage=&ids=…` lineage summaries; `GET /index/relations/<contract>?id=<id>` derived parents/ancestors/children/descendants/siblings; manual maintenance `POST /index/<contract>?parents=backfill` gated by `x-admin-token` when `INDEX_ADMIN_TOKEN` set. Auto-syncs new mints. [^10^][^11^]
Source: agent skill "Inscription Index & Relationships" / Confidence: high (endpoints also verified live [^22^])

---

## 7. App surfaces & endpoints map

Claim: SPA routes (hash/History router, all serve same shell): `/inscribe` (mint), `/xplorer` (browser w/ galleries: jim-music, stacksboard, code-various), `/market`, `/drops`, `/manage` (allowlisted collection portal), `/manifests`, `/my-wallet`, `/workspace`, `/masterpiece` (bounty), `/web/migrate.html` (v1→v2 migration), `/wizard/` + `/wizard/suno`, `/opus-file-generator/`, `/forever-twins/`. Standalone server-rendered tools: Inscription Wizard, Opus File Generator. [^1^][^17^][^18^][^19^][^20^]
Source: index.html href inventory + fetched tool pages / Confidence: high

Claim: Live index endpoints observed: `/index/playable?contract=<id>` → JSON `{audio:[312,315,1097,1099], html:[4,319,577,…], duds:[…], mintedCount:2696, syncedCount:2696, updatedAt:…}`; `/index/relations/<contract>?id=<id>` (parents/children/siblings + mimes); `/index/verdict` (POST-only, per-token playability verdict). [^22^][^20^]
Source: live probes 2026-07-20 / Confidence: high (observed)

Claim: Inscription Wizard (/wizard/): hands-off paid service — "Drop a file → pay once → it comes back inscribed." Flow: Drop → Review → Pay → Inscribed; all-in deposit over-collected, remainder auto-refunded; optional service margin (µSTX); delivery to alternate address; optional dependencies (existence-only) and parents (ownership, escrowed to deposit wallet with payment, returned with child); optional separate on-chain receipt token (~0.1 STX extra); batch mode up to 40 items from one deposit with @0,@1… intra-batch dependency references and a single batch receipt. [^17^]
Source: https://xtrata.xyz/wizard/ / Confidence: high

Claim: Bounty: "Live bounty · Xtrata × Zero Authority DAO — Inscribe your first masterpiece… enter to win part of 200 STX. Four winners. No theme." Accepts song, artwork, photograph, poem, animation or film. [^1^]
Source: homepage / Confidence: high

---

## 8. Xtrata Radio & audio/music features

Claim: "Xtrata Radio" is a fully on-chain streaming radio built into the site (fixed bottom-left widget, `window.XtrataRadio` global, `?radio=fullscreen` param). Branding/taglines observed: "100% ON-CHAIN RADIO", "♪ MUSIC LIVE FROM THE CHAIN", "EVERY SONG INSCRIBED FOREVER", "THIS RADIO HAS NO PLAYLIST SERVER", "Early on-chain music, audio, samples, stems, and songs." [^20^]
Source: xtrata.xyz/assets/main-BuSmoc1z.js / Date: 2026-07-20 / Confidence: high (code-observed; no external coverage found — web search for "Xtrata Radio" returned zero results)

Claim: Radio mechanics: track universe = live index query `/index/playable?contract=SP3JNS…xtrata-v3-2-3` (audio + html player inscriptions; duds filtered out); playback via `Audio` element against `/i/{id}` byte endpoints with HTTP Range streaming; per-token verdict probes content-type (`audio/*` plays; HTML players parsed for title/artist/cover art); three "bands": FM (curated + chain), CHAIN (full exploration of every indexed song), LIKED (your station — heart-button saves to localStorage); shows "related" tiles from `/index/relations` (parents/children/siblings; playable songs as ♪ buttons, artwork via `/i/{id}`); auto-queues newly indexed songs; no-repeat cycle; watchdog auto-retune; VU meter, album-art panel linking to the inscription. [^20^][^22^]
Source: main JS bundle analysis / Confidence: high

Claim: Verified audio content on-chain: inscription #312 serves `audio/mpeg`, 4,533,058 bytes, 277 chunks, ID3 title "Smalltalk", reconstructed from xtrata-v3-2-3 with byte-range support (direct HTTP probe). [^23^]
Source: https://xtrata.xyz/i/312 / Date: 2026-07-20 / Confidence: high (observed)

Claim: Suno fast-track (/wizard/suno): "SUNO More — do more with your Suno music… Drop a Suno MP3 and pay once: your browser optimises the audio to Opus, pulls in the cover art, title, artist & lyrics, and builds a self-contained player. The agent inscribes the master and returns the token + receipt to your wallet, change refunded." Client-side; editable metadata (album, BPM, license, lyrics); batch of multiple songs, one payment, one receipt; priced on finished player's exact size. [^18^]
Source: https://xtrata.xyz/wizard/suno / Confidence: high

Claim: Opus File Generator (/opus-file-generator/): standalone 4-step browser tool (FFmpeg WASM) — 1) convert audio to WebM/Opus (default 96 kbps VBR, compression level 10; MP3 fallback; batch convert; ZIP export), 2) add cover art embedded or RECURSIVE (reference an existing inscription by token ID/URL), 3) metadata, 4) export inscription-ready HTML player. Audio source can be embedded base64 OR "Recursive: load an existing audio inscription by URL or token ID" via `/inscription/{ID}` or `/i/{ID}` on mainnet/testnet — "Mint note: Add the audio token as a recursive parent." [^19^]
Source: https://xtrata.xyz/opus-file-generator/ / Confidence: high

Claim: Music positioning is first-class: homepage flagship "Living credits — Music that can live with its story. A song can carry artwork, editions, parent works, tools, and provenance as connected objects." Radio strings include "SUNO TRACK? FAST-TRACK IT → /wizard/suno". [^1^][^20^]
Source: homepage + bundle / Confidence: high

---

## 9. Notable negative results / gaps

Claim: `robots.txt` and `sitemap.xml` return the SPA shell (no crawler directives/sitemap); docs live on GitHub, not under /docs. [^1^]
Source: direct fetch / Confidence: high

Claim: `@xtrata/sdk` and `@xtrata/reconstruction` are NOT on npm (registry "Not found") — distribution is source/GitHub-based despite quickstarts showing `npm install @xtrata/sdk`. [^27^]
Source: npm registry probe 2026-07-20 / Confidence: high

Claim: docs/xtrata-quickstart.md on main-staging is a thin 72-line UI walkthrough; deep docs live in handbook/recon-spec/agent-skill. `xtrata-v2.1.1` docs conflict: contract-inventory calls it "Clarinet-only… never deployed", but two mainnet deploy txs of `xtrata-v2-1-1` appear 2026-06-06 (docs lag the v3.2.3 handover; older docs still name v2.1.0/v2.1.1 as "current public default"). Trust the newest contract-inventory + on-chain state: v3-2-3 is canonical. [^6^][^21^][^4^]
Source: cross-check / Confidence: high (flagged inconsistency)

Claim: x402 integration is roadmap/positioning language on DoraHacks ("x402-style integrations that connect on-chain rights to standard web payment and access flows") — no x402 code surface found in docs or contracts (xtrata-commerce notes say "No auctions, royalties, multi-splits, or x402 logic in this MVP"). [^2^][^6^]
Source: DoraHacks + contract-inventory / Confidence: medium-high

---

## Key technical capabilities relevant to new use cases

- **Fully on-chain file storage as SIP-009 NFTs**: arbitrary bytes (media, HTML/JS apps, JSON) chunked into 16 KiB contract storage, sealed immutably, Bitcoin-anchored via Stacks — no IPFS/external host required.
- **Content addressing + native dedupe**: incremental SHA-256 chain hash → one canonical token per payload (`begin-or-get`, `get-id-by-hash`); safe shared references across collections/views.
- **Resumable staged uploads**: sessions survive interruption ~30 days (4,320 blocks); incremental hash validation lets clients resume mid-file; permissionless purge of expired uploads.
- **On-chain dependency graphs ("recursive inscriptions")**: up to 50 declared dependencies per token, machine-readable via `get-dependencies`; enables modular apps (HTML players referencing audio/art tokens), provenance trees, editions, and composable media — with separate parent→child ownership links (escrowed minting).
- **Trustless reconstruction**: public spec + `@xtrata/reconstruction` rebuild bytes from chain data with strict hash verification; no dependency on xtrata.xyz; formal third-party proof standard for archivists/marketplaces.
- **Permissionless byte CDN**: `/inscription/{id}` and `/i/{id}` serve reconstructed bytes with CORS `*`, Range streaming (audio/video seek), immutable caching — any app can hotlink on-chain content; recursive same-origin references keep whole apps on-chain.
- **Full commerce stack**: STX/USDCx/sBTC escrow markets, sponsored (zero-STX buyer) listings, USDCx entitlement sales without NFT transfer (access/licensing), sBTC reserve vaults with deterministic premium tiers, sponsored free-claim drops contract (claim-cap, fee budget, refunds).
- **Sponsored transactions**: creators prepay network fees → claimers need zero STX (drops; sponsored markets) — Web2-grade UX on Bitcoin rails.
- **Batch minting**: up to 50 items sealed per tx (non-recursive); collection-mint coordinator with artist/marketplace/operator splits, allowlists, per-wallet caps; wizard batch of 40 files/one payment with intra-batch dependency refs.
- **AI-agent readiness**: canonical machine-readable skill doc (YAML-frontmatter agent skill), 10-step autonomous mint loop, MCP-tool mappings for aibtc agents, safety baselines (deny-mode post-conditions, spend caps, confirmation gates), auto-syncing D1 index with relations API for agent queries.
- **On-chain media tooling**: client-side FFmpeg Opus transcoder exporting self-contained HTML players that embed or recursively reference audio/art inscriptions; Suno one-payment pipeline; "Xtrata Radio" proves continuous streaming of multi-MB on-chain audio with zero playlist server.
- **Games/attestation primitives**: arcade leaderboard contracts with secp256k1-signed score attestations, replay protection, per-game/mode top-10 boards — inscriptions double as playable game ROMs/apps.
- **Legacy-collection bridging**: Forever Twins escrow helpers + backup registry/migrated-collection prototypes port existing IPFS NFTs (Bitcoin Pepes, LeoCats, Miami Degens) into permanent Xtrata twins with reversible swaps.
- **Future headroom**: v3.1.1 chunk profiles (64 KiB/128 MiB, 128 KiB/256 MiB), Clarity-4 v3.4.0 single-tx migration, x402 payment-gating positioning.

---

## Citations

[^1^] https://xtrata.xyz (homepage SPA shell incl. market/drops panels, inscribe UI; fetched 2026-07-20)
[^2^] https://dorahacks.io/buidl/40376 (Xtrata BUIDL BATTLE #2 page; 2026-03-16)
[^3^] https://github.com/stxtrata/xtrata/blob/main-staging/xtrata-1.0/docs/documentation-index.md
[^4^] https://github.com/stxtrata/xtrata/blob/main-staging/xtrata-1.0/docs/xtrata-inscription-handbook.md
[^5^] https://github.com/stxtrata/xtrata/blob/main-staging/xtrata-1.0/docs/recursive-inscriptions.md
[^6^] https://github.com/stxtrata/xtrata/blob/main-staging/xtrata-1.0/docs/contract-inventory.md
[^7^] https://github.com/stxtrata/xtrata/blob/main-staging/xtrata-1.0/docs/xtrata-v2.1.0/api-reference.md
[^8^] https://github.com/stxtrata/xtrata/blob/main-staging/xtrata-1.0/docs/sdk/README.md
[^9^] https://github.com/stxtrata/xtrata/blob/main-staging/xtrata-1.0/docs/sdk/api-overview.md
[^10^] https://github.com/stxtrata/xtrata/blob/main-staging/xtrata-1.0/XTRATA_AGENT_SKILL.md
[^11^] https://github.com/stxtrata/xtrata/blob/main-staging/xtrata-1.0/docs/ai-skills/README.md
[^12^] https://github.com/stxtrata/xtrata/blob/main-staging/xtrata-1.0/docs/sdk/quickstart-first-30-minutes.md
[^13^] https://github.com/stxtrata/xtrata/blob/main-staging/xtrata-1.0/docs/reconstruction-spec.md
[^14^] https://github.com/stxtrata/xtrata/blob/main-staging/xtrata-1.0/docs/product-contract-ui-reference.md
[^15^] https://github.com/stxtrata/xtrata/blob/OPTIMISATIONS/xtrata-1.0/docs/ai-skills/aibtc-agent-training.md
[^16^] https://github.com/stxtrata/xtrata/blob/OPTIMISATIONS/xtrata-1.0/docs/ai-skills/generic-agent-training.md
[^17^] https://xtrata.xyz/wizard/ (Inscription Wizard; fetched 2026-07-20)
[^18^] https://xtrata.xyz/wizard/suno (Suno fast-track; fetched 2026-07-20)
[^19^] https://xtrata.xyz/opus-file-generator/ (Opus audio tool; fetched 2026-07-20)
[^20^] https://xtrata.xyz/assets/main-BuSmoc1z.js (frontend bundle: Xtrata Radio UI/logic, drops config, index endpoints; analyzed 2026-07-20)
[^21^] https://api.mainnet.hiro.so/extended/v1/address/SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X/transactions (deploy history scan; 2026-07-20)
[^22^] https://xtrata.xyz/index/playable?contract=SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 (live JSON; 2026-07-20)
[^23^] https://xtrata.xyz/i/312 (live audio inscription HTTP probe: audio/mpeg, 4,533,058 bytes, 277 chunks; 2026-07-20)
[^24^] https://api.mainnet.hiro.so/v2/contracts/interface/SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X/xtrata-drops-v1-0 (ABI; 2026-07-20)
[^25^] https://api.mainnet.hiro.so/v2/contracts/call-read/SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X/xtrata-v3-2-3/{get-fee-unit,get-minted-count,get-last-token-id} (live reads; 2026-07-20)
[^26^] https://xtrata.xyz/i/1107 (697,408-byte on-chain HTML app; 2026-07-20)
[^27^] https://registry.npmjs.org/@xtrata%2Fsdk and /@xtrata%2Freconstruction ("Not found"; 2026-07-20)
[^28^] https://github.com/stxtrata/xtrata/blob/main-staging/xtrata-1.0/packages/xtrata-reconstruction/README.md
