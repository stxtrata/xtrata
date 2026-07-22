# Dimension 06 — Autonomous AI Agents × On-Chain Objects
### Research dossier for Xtrata (xtrata.xyz) — compiled 2026-07-21

**Method:** 27 web searches plus direct retrieval of primary sources: Xtrata's GitHub agent-training docs (`stxtrata/xtrata`, branch `OPTIMISATIONS`), aibtc.com's plaintext/agent docs (served as `text/plain`), the ERC-8004 spec, and the aibtcdev ERC-8004-Stacks contract repo. xtrata.xyz is a JS SPA (all routes return the app shell; its "Train agents" section links out to GitHub). Evidence entries follow the format Claim / Source / URL / Date / Excerpt / Confidence. Numbered citations at the end.

---

## 1. Xtrata's own agent docs — what exists and what they enable

**Where they live.** xtrata.xyz/docs/agents, /agents, /llms.txt all serve the SPA shell — there is no separate HTML docs site. The real agent docs are linked from the homepage "Build with Xtrata → Train agents" section and live in the public GitHub repo `stxtrata/xtrata` [1][2][3]:

- `XTRATA_AGENT_SKILL.md` — canonical agent skill file (frontmatter `name: xtrata-inscription`) [2]
- `docs/ai-skills/README.md` — "AI Skills Training Docs" package index [3]
- `docs/ai-skills/aibtc-agent-training.md` — track for aibtc agents using MCP wallet tools [4]
- `docs/ai-skills/generic-agent-training.md` — track for non-aibtc agents (custom frameworks, direct SDK)
- Runnable companion scripts: `scripts/xtrata-mint-example.js`, `xtrata-transfer-example.js`, `xtrata-query-example.js`

**What workflows they enable for agents (verified from the docs):**

1. **Autonomous mint (inscribe).** Full lifecycle: `begin-or-get` → one or more `add-chunk-batch` → `seal-inscription` / `seal-recursive` / `seal-inscription-batch` against production contract `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0`. Data is chunked at 16,384 bytes (max 2,048 chunks = 32 MiB), hashed with an incremental SHA-256 chain (`sha256(running-hash || chunk)`), deduplicated by canonical hash (`HashToId`, `get-id-by-hash`), and sealed into a SIP-009 NFT. Sealed data is immutable [2].
2. **Batch operations.** `add-chunk-batch` (≤50 chunks/call), `seal-inscription-batch` (≤50 items), enabling bulk agent publishing [2].
3. **Query/verify.** ~30 read-only functions: `get-inscription-meta` (owner, creator, mime, size, sealed, final-hash), `get-chunk`/`get-chunk-batch` (full content reconstruction), `get-dependencies`, `get-id-by-hash`, `get-upload-state`, `is-paused`, `get-fee-unit` [2].
4. **Transfer.** SIP-009 `transfer` with JS reference implementation; works even while writes are paused [2].
5. **Recursive/dependency mints.** `seal-recursive` accepts a `dependencies: (list 50 uint)` argument; `ERR-DEPENDENCY-MISSING (u111)` enforces existence-only references [2].
6. **Resumable uploads & error recovery.** Upload sessions persist 4,320 blocks (~30 days); documented recovery policy: duplicate → resolve canonical ID by hash; expired/not-found → restart begin; hash mismatch → restart clean; `abandon-upload` only as last resort; `purge-expired-chunk-batch` is permissionless cleanup [2][4].
7. **Safety rails for autonomous operation.** `PostConditionMode.Deny` mandatory on fee-paying writes with explicit STX post-conditions; deterministic fee model (begin fee = `fee-unit`, seal fee = `fee-unit × (1 + ceil(chunks/50))`, default fee-unit 0.1 STX, bounded 0.001–1.0 STX); 5s delay between broadcasts; bounded retries with 15/30/60/120s backoff; testnet-first; "avoid exposing raw secret material in prompts, logs, or traces"; log tx IDs and hash/token mappings for auditability [3][4].
8. **MCP-tool integration (aibtc path).** Mapping table from Xtrata operations to aibtc MCP tools (`wallet_get_balance`, `stacks_call_read_only`, `stacks_call_contract`, `stacks_get_transaction`), including a documented critical limitation: some MCP tools silently send empty buffers on large nested list+buffer args (`add-chunk-batch`), detectable when the running hash equals `sha256(32 zero bytes) = 66687aad…d5f2925`; workaround is direct `@stacks/transactions` SDK for chunk uploads [4].

**Notably explicit cross-ecosystem intent:** the skill file's own description says it should be used "whenever an agent needs to inscribe data on-chain via Stacks… **This includes agents from the aibtc platform that hold STX and want to create or trade inscriptions autonomously**" [2].

**Agent-relevant product surface on xtrata.xyz itself (from the rendered homepage):** sponsored claims/drops ("Sponsored claims need no STX to collect, claim, or create"; "Drops settle through the Xtrata drops contract. Claims are sponsored — the creator's deposit covers the network fee, so claimers need zero STX"); market with STX/sBTC/USDCx settlement and sponsored listings ("Sponsored listings can be bought with zero STX — the seller has prepaid the network fee"); on-chain reply threads ("turns your text into an on-chain reply. Anyone can reply to any inscription"); parent→child ownership links (parents escrowed during mint, must be owned); dependency reference links (no ownership needed); "Relationships stay machine-readable. Origins, dependencies, and connected works can be used by apps"; "Objects can be independently rebuilt. The website is a gateway, not the source of truth" [1].

### Evidence entries — Section 1

- **E1.1** — Claim: Xtrata ships a canonical agent skill teaching autonomous create/mint/transfer/query of inscriptions on Stacks, explicitly including aibtc agents. Source: XTRATA_AGENT_SKILL.md (stxtrata/xtrata, OPTIMISATIONS branch). URL: https://github.com/stxtrata/xtrata/blob/OPTIMISATIONS/xtrata-1.0/XTRATA_AGENT_SKILL.md. Date: accessed 2026-07-21. Excerpt: "Skill for autonomously creating, minting, transferring, and querying inscriptions on the Stacks blockchain via the xtrata protocol… This includes agents from the aibtc platform that hold STX and want to create or trade inscriptions autonomously." Confidence: High (primary doc).
- **E1.2** — Claim: Mint pipeline = chunked upload (16,384 B) → seal into SIP-009 NFT; dedupe by canonical hash; immutable when sealed; resumable for ~30 days. Source: same [2]. Excerpt: "Data is split into fixed 16,384-byte chunks, uploaded on-chain, then sealed into a SIP-009 NFT. Content is deduplicated by a canonical hash, uploads are resumable, and sealed data is immutable… sessions expire after 4,320 blocks." Confidence: High.
- **E1.3** — Claim: The AI-skills package has two training tracks (aibtc via MCP wallet tools; generic via SDK) plus runnable mint/transfer/query scripts and a safety baseline. Source: docs/ai-skills/README.md [3]. Excerpt: "Use this folder when you are training autonomous agents to mint, transfer, and query inscriptions on Stacks using Xtrata… Always use PostConditionMode.Deny on fee-paying writes… Log tx IDs and hash/token mappings for auditability." Confidence: High.
- **E1.4** — Claim: aibtc training track specifies an 8-step autonomous run loop and documents a real MCP tool failure mode (empty-buffer chunk uploads) with a contract-level detection hash. Source: docs/ai-skills/aibtc-agent-training.md [4]. Excerpt: "Train an aibtc agent to autonomously run the Xtrata inscription lifecycle… If the contract's running hash after upload equals sha256(32 zero bytes) = 66687aadf862bd776c8fc18b8e9f8e20089714856ee233b3902a591d0d5f2925, the MCP tool sent an empty buffer instead of your chunk data." Confidence: High.
- **E1.5** — Claim: Sponsored transactions let claimers/buyers act with zero STX on drops and sponsored market listings; objects support parent→child ownership links, dependency references, and on-chain reply threads. Source: xtrata.xyz rendered homepage [1]. Excerpt: "Sponsored claims need no STX to collect, claim, or create… Claims are sponsored — the creator's deposit covers the network fee, so claimers need zero STX… Parent→child ownership link — you must own the parent… Dependencies — reference link — no ownership needed… Reply to a thread · optional — turns your text into an on-chain reply." Confidence: High (primary site).

---

## 2. aibtc.com and the "AI agents on Bitcoin" movement; x402 agent payments

### 2.1 aibtc.com — a live agent network on Bitcoin/Stacks (verified primary)

aibtc.com serves its homepage as plaintext markdown and is unambiguous: "**AI agents + Bitcoin. Register your agent, message other agents, and coordinate on open-source work — all through MCP tools.**" [5] Verified live components:

- **Self-custodial agent wallets** via `@aibtc/mcp-server` (npx install; Claude Code/Desktop, Cursor, Windsurf, Gemini CLI, Codex, VS Code). Keys at `~/.aibtc`, AES-encrypted; "your wallet mnemonic and private keys are yours alone" [5][6]. A third-party directory lists the AIBTC MCP server at 120+ tools spanning Bitcoin L1 + Stacks L2: BTC/STX txs, sBTC, DeFi (ALEX, Zest, Bitflow), SIP-010 tokens, SIP-009 NFTs, "automatic x402 payment handling for paid API endpoints" [8].
- **Agent registration & identity:** dual-signature registration (`btc_sign_message` + `stacks_sign_message` over "Bitcoin will be the currency of AIs"), BIP-137/BIP-322 handling, Nostr npub derivation, BNS resolution (`/api/resolve` for BNS name lookups), progression levels (Level 2 "Genesis" via X/Twitter claim linking a human operator) [5][6].
- **Agent-to-agent paid messaging:** "Only sending a new message costs money (100 satoshis sBTC). Everything else is free." Payment flow is literally x402: "POST without payment → 402 response → POST with `payment-signature` header. Use `execute_x402_endpoint` MCP tool to automate. Don't hardcode payment amounts — read from the 402 response" [5].
- **ERC-8004 identity on Stacks:** "ERC-8004 (adapted for Stacks)… enables agents to mint a unique SIP-009 NFT with a sequential agent-id. The reputation registry allows clients to submit feedback that is stored on-chain" [7]; the trading competition requires Genesis level **and** an ERC-8004 on-chain identity [5].
- **Agent-readable docs surface:** `llms.txt`, `llms-full.txt`, `skill.md`, `docs/messaging.txt`, `docs/identity.txt`, `docs/mcp-tools.txt`, `earning.md`, A2A agent card at `/.well-known/agent.json`, OpenAPI at `/api/openapi.json` [6].
- **Economic activity:** paid inbox, "autonomous earning loop," "Earning with your assets" doc, and a live trading competition on Bitflow DEX (28+ allowlisted contracts, txid submission, on-chain verification, leaderboard) [5].

### 2.2 x402 and the agent-payments stack — status mid-2026

- **x402** (Coinbase, launched May 2025; v2 Dec 2025) embeds stablecoin payment into the HTTP 402 status; moved to the **x402 Foundation under the Linux Foundation on April 2, 2026**, with Coinbase + Cloudflare co-founding and members incl. Stripe, AWS, Google, Visa, Mastercard, American Express, Microsoft, Shopify, Circle, Adyen, Fiserv, KakaoPay, Polygon Labs, Solana & Stellar foundations [9][11][14][62].
- **Scale vs substance:** ~165–167M cumulative transactions by April 2026 (~85% on Base; Solana flipped Base in monthly count in Jan 2026), ~$50M cumulative volume, ~69,000 active agents, average tx $0.20–0.30 — but CoinDesk (Mar 2026) estimated real commerce at only ~$28K/day with ~50% testing/self-dealing; Artemis called the boom "still mostly a mirage" [9][11][13].
- **Mainstream crossover:** Stripe shipped native x402 support ("Machine Payments" preview) on Feb 10, 2026 [10]; Cloudflare co-founded the Foundation and built x402 into Workers + pay-per-crawl [12][39]; AWS Bedrock AgentCore Payments adopted x402 (May 2026); World launched AgentKit with x402 (Mar 2026) [12]; Coinbase launched **Agent.market / Agentic.market** (April 2026) — a no-API-key marketplace, 7 service categories, providers incl. OpenAI, Bloomberg, CoinGecko, AWS Lambda [9][11][13].
- **Adjacent protocols:** Google AP2 (authorization mandates, Sep 2025, 60+ orgs), Google UCP (full commerce journey, Jan 2026, with Shopify), Stripe/OpenAI ACP (live in ChatGPT early 2026), Skyfire (Know Your Agent + USDC), MoonPay Agents (Feb 2026), Coinbase Agentic Wallets (Feb 2026: gasless on Base, programmable spend limits) [12][14][16][58][63]. Convergence pattern: "a single production agent workflow may use A2A for communication, x402 for settlement, and Skyfire for identity" [9].
- **First-principles driver:** Brian Armstrong's "first AI-to-AI crypto transaction" (Aug 2024): "Although AI agents cannot get bank accounts, they can get crypto wallets… instant, global, and free" [43].

### 2.3 Stacks/Bitcoin ecosystem context

Stacks Q1 2026: sBTC TVL reported at $545M (deposit caps removed; Phemex's English write-up says $437M — sources differ), $121M DeFi deployed capital (Zest $75.9M, Granite $26M, StackingDAO $20M), 400k+ wallets, Fireblocks/BitGo/Circle USDC integrations live, SIP-034 capacity upgrade up to 30x [60][64]. On Bitcoin L1, Ordinals inscriptions store data directly on-chain ("permanent and immutable… digital artifacts") [41], and recursive inscriptions let inscriptions reference each other to compose larger applications and public code libraries [42] — the conceptual parent of Xtrata's dependency links.

### Evidence entries — Section 2

- **E2.1** — Claim: aibtc.com operates a live agent network on Bitcoin/Stacks with MCP wallets, free registration, and x402-paid agent-to-agent messaging at 100 sats sBTC. Source: aibtc.com homepage/llms.txt [5]. Date: accessed 2026-07-21. Excerpt: "AI agents + Bitcoin… Only sending a new message costs money (100 satoshis sBTC)… POST without payment → 402 response → POST with payment-signature header." Confidence: High (primary).
- **E2.2** — Claim: aibtc ties into ERC-8004 identity on Stacks (SIP-009 NFT agent-id + on-chain reputation) and requires it for competition eligibility. Sources: aibtc identity doc [7]; aibtc API doc [5]. Excerpt: "ERC-8004 (adapted for Stacks)… mint a unique SIP-009 NFT with a sequential agent-id… feedback… stored on-chain." Confidence: High (primary).
- **E2.3** — Claim: x402 processed ~165M+ transactions across ~69k agents by April 2026 but genuine commerce is small (~$28K/day; ~50% gamified). Sources: RZLT explainer [9]; presenc.ai tracker [11]; AgentLux [13]. Excerpt: "165 million+ x402 transactions across 69,000 active agents by April… roughly half of that volume appears to be testing rather than genuine commerce." Confidence: High (multiple concordant sources).
- **E2.4** — Claim: x402 is now neutral-governance infrastructure (Linux Foundation x402 Foundation, April 2 2026) backed by Coinbase, Cloudflare, Stripe, AWS, Google, Visa, Mastercard, Microsoft, Shopify, Circle et al. Sources: [11][14][62]. Excerpt: "The Linux Foundation launched the x402 Foundation on April 2 with Coinbase, Cloudflare, and Stripe as founding members." Confidence: High.
- **E2.5** — Claim: Stripe shipped native x402 support ("Machine Payments") Feb 10, 2026; Cloudflare runs pay-per-crawl on HTTP 402 since July 2025. Sources: devtoollab [10]; webscraft [39]. Excerpt: "on February 10, 2026, Stripe shipped native x402 support under a preview API called Machine Payments." Confidence: High/Medium (single secondary source for Stripe date; Cloudflare widely corroborated).
- **E2.6** — Claim: Stacks ecosystem Q1 2026: sBTC TVL ~$545M (caps removed), $121M DeFi deployed, institutional integrations live. Sources: broadchain/bingx flash [60]; Phemex ($437M variant) [64]. Confidence: Medium-High (figure varies by source).

---

## 3. Agent identity & reputation — standards status mid-2026

### 3.1 ERC-8004 "Trustless Agents" (Ethereum, multi-chain)

- **What it is:** an Ethereum standards-track proposal (Draft) from the Ethereum Foundation dAI team with Google, Coinbase, MetaMask; three singleton registries per chain — **Identity** (each agent = ERC-721 NFT with a registration file listing services: A2A endpoint, MCP endpoint, DID/ENS, and an `x402Support` flag), **Reputation** (on-chain feedback linkable to payments/escrow), **Validation** (third-party verification: TEE, zkML, stake-secured re-execution) [15][17][19].
- **Status:** launched on mainnet **January 29, 2026**; in its first months **~83,000 agents registered across 18 networks** [16][20]. Identity + Reputation shipped; Validation "remains under active revision and is not production-deployed" [18]. Live deployments include 0G mainnet (canonical vanity addresses merged via PR #83, June 11, 2026) and Monad [17][24].
- **Honest critiques:** "Identity and reputation: shipped. Trustlessness: pending" [18]; "who validates the validators?" — validator corruption/cartelization; Sybil/collusion on reputation; "best indexer wins" gatekeeping [20]. Before ERC-8004, "an AI agent on-chain was a wallet address. Nothing more" [18].
- **Composition stack emerging:** ERC-8263 (on-chain proof/anchor layer binding action digests to ERC-8004 agent IDs) + OCP (Observation Commitment Protocol — independent recompute-and-verify from raw ledger data) = an execution-attestation stack for "what did this agent commit, and when" [22]. Chainlink frames ERC-8004 as the authentication layer for non-human economic actors [23].

### 3.2 ERC-8004 on Stacks — already deployed by the aibtc ecosystem

- Repo `aibtcdev/erc-8004-stacks`: "Clarity smart contracts implementing the ERC-8004 agent identity, reputation, and validation protocol for Stacks blockchain (v2.0.0). Cross-chain standard — same protocol on Ethereum (Solidity), Solana (Rust), and Stacks (Clarity)" — with **mainnet deployments** (`identity-registry-v2`, `reputation-registry-v2`, `validation-registry-v2` at `SP1NMR7MY0TJ1QA7WQBZ6504KC79PZNTRQH4YGFJD`), 149 tests, CAIP-2 multichain agent IDs (`stacks:1:<registry>:<agentId>`), and an `AGENTS.md` LLM-friendly integration guide [21].
- Stacks governance is formally tracking this: forum.stacks.org lists **"SIP-XXX Agent Registries (ERC-8004 on Stacks) — Open for Comment"** [61].

### 3.3 MCP / A2A adoption status 2026

- **MCP (Anthropic, Nov 2024; donated to the Linux Foundation's Agentic AI Foundation Dec 2025):** the de-facto agent↔tool standard — **97M monthly SDK downloads** (16 months, ~970x growth), 8,600–9,400+ public servers (17,000+ indexed across registries by Zuplo), native support from Anthropic, OpenAI, Google, Microsoft, AWS; **78% of enterprise AI teams report at least one MCP-backed agent in production** [25][26][27]. Security watch-items: tool poisoning, prompt injection via tool outputs [25][28].
- **A2A (Google, Apr 2025; donated to Linux Foundation June 2025; v1.0 early 2026):** **150+ supporting organizations** (AWS, Microsoft, Salesforce, SAP, ServiceNow, Cisco, IBM…), production deployments in supply chain, finance, insurance, IT; Salesforce Agentforce, SAP Joule, ServiceNow Now Assist expose A2A endpoints — but "most A2A implementations in the wild are still proofs of concept," and developer-level maturity trails MCP by 12–18 months [26][27][28]. Signed Agent Cards (v1.0) address agent impersonation [28].
- **Layering consensus:** MCP = agent↔tools (vertical), A2A = agent↔agent (horizontal); complementary, both under Linux Foundation governance; neither provides on-chain identity or reputation — which is precisely the gap ERC-8004 fills [18][25].

### 3.4 Related: agent commerce standards & Know-Your-Agent

- **ERC-8183 "Agentic Commerce"** (Ethereum Foundation dAI + Virtuals Protocol, draft): permissionless escrow-based job system — Open → Funded → Submitted → Terminal, with an independent Evaluator and reputation hooks feeding ERC-8004 [52].
- **KYA (Know Your Agent):** Skyfire is the leading standard; compliance = KYA + attribution to a pre-authorizing human/business principal + audit trails surviving machine-speed flows [9][30].

### Evidence entries — Section 3

- **E3.1** — Claim: ERC-8004 defines Identity/Reputation/Validation registries and reached ~83k registered agents across 18 networks within months of its Jan 29, 2026 mainnet launch. Sources: Odaily panorama [15]; ChainCatcher [16]; CryptoSlate [20]; EIP-8004 [19]. Excerpt: "'Trustless Agents Standard' (launched January 2026)… in its first months, 83,000 registered agents across 18 networks." Confidence: High.
- **E3.2** — Claim: ERC-8004 registration files natively reference A2A, MCP, DID/ENS endpoints and an `x402Support` flag — identity spec already wired for the agent-payment stack. Source: EIP-8004 spec [19]. Confidence: High (primary spec).
- **E3.3** — Claim: ERC-8004 is deployed on Stacks mainnet (aibtcdev Clarity contracts: identity/reputation/validation registries, SIP-009-based, CAIP-2 IDs) and a Stacks SIP for "Agent Registries (ERC-8004 on Stacks)" is open for comment. Sources: GitHub aibtcdev/erc-8004-stacks [21]; forum.stacks.org [61]. Confidence: High (primary repo + governance forum).
- **E3.4** — Claim: MCP won the tool layer (97M monthly downloads; 78% of enterprise AI teams with MCP in production); A2A crossed 150 orgs with v1.0 but remains early. Sources: Pickaxe [26]; PrimeAIcenter [27]; orbilontech [25]. Confidence: High (multiple concordant).
- **E3.5** — Claim: Neither MCP nor A2A provides on-chain identity or verifiable reputation; A2A Agent Cards are self-declared — the gap ERC-8004 targets. Source: Decipher Club analysis [18]. Excerpt: "an A2A Agent Card is self-declared… No on-chain history of whether that claim is true." Confidence: High.

---

## 4. Verifiable AI output provenance — why immutable, timestamped, signed publication channels matter

### 4.1 The deepfake/misinfo pressure (scale evidence)

- **$1.5B+ in reported deepfake-fraud losses worldwide in Jan–Sep 2025 alone** (Surfshark dataset from AI Incident Database + Resemble, via Veriff); investment fraud with deepfaked celebrities/executives = $900M (57%); FBI probing 100+ companies that unknowingly hired synthetic-identity remote IT workers; the Arup case (~$25M) remains the canonical executive-impersonation loss [29].
- Deepfake fraud attempts **+2,137% in three years**; voice cloning needs ~3 seconds of audio; **human detection accuracy of high-quality deepfakes ≈ 24.5% — below chance**; documented org losses >$1.28B; synthetic-identity theft $20–40B/yr (LexisNexis, 116B transactions analyzed); election disinformation moving to "near-zero-lag deployment" [30].

### 4.2 The provenance stack and its structural gap

- **C2PA** (Content Credentials; 2.1 ratified 2025 as ISO/IEC 22144) has 6,000+ members/affiliates (Jan 2026): Adobe (writes manifests across CC), OpenAI (C2PA + SynthID on DALL·E/ChatGPT/Sora, steering committee), Google (reads C2PA in Search/Chrome/Gemini; SynthID on 100B+ images/videos + ~60,000 years of audio), Meta, Microsoft, Amazon; hardware signing in Samsung Galaxy S25, Sony (PXW-Z300, Alpha), Nikon Z-series, Leica M11-P, Canon EOS newsroom workflows [31][32][34][35].
- **Regulation:** EU AI Act Article 50 machine-detectable marking of AI output applies **August 2, 2026**; the Code of Practice prescribes a *multi-layer* approach (C2PA metadata + imperceptible watermarking + logging) because metadata is "easily removable through screenshots, social media uploads, or file conversion" [31]. A 2026 arXiv study found Content Credentials systematically stripped from AI images shared on a major social platform [32].
- **The structural gap:** C2PA is tamper-*evident*, not tamper-*proof* — provenance lives in the file's metadata, dies with re-encoding/screenshots, and "no Content Credential found" means *unknown*, not *fake* [32][33]. Industry pivot: "instead of asking *is this fake?*, prove what is real by attaching tamper-evident metadata at the moment of creation, and let everything unsigned be treated as unverified by default" [33]. A chain-anchored publication record (immutable bytes + timestamp + signer identity) is the complementary anchor that survives any file transformation.

### 4.3 Existing on-chain AI-publication experiments & primitives

- **Bitcoin Ordinals inscriptions:** fully on-chain, "permanent and immutable… Rodarmor refers to inscriptions as 'digital artifacts'" — the base primitive for un-erasable publication [41]. **Recursive inscriptions** (June 2023) let inscriptions reference each other, compose apps >4MB, and publish reusable public code on Bitcoin (OnChainMonkey's OCM Dimensions; Asprey Bugatti generative eggs) [42].
- **Execution attestation for agents:** ERC-8263 anchor proofs + OCP give "what did this agent commit, and when… verified independently, without trusting anyone," explicitly composable with ERC-8004 identity (L1 identity → L2 input provenance → L3 commitment verification → L4 infrastructure attestation) [22].
- **Autonomous artists with durable sales records:** Botto (below, §6) shows market acceptance of machine authorship; Xtrata itself is the Stacks-native publication channel, and its agent skill is explicitly written so that aibtc agents "create or trade inscriptions autonomously" [2] — i.e., the "AI inscribing its outputs on Bitcoin-security" pattern is live and documented rather than hypothetical.

### Evidence entries — Section 4

- **E4.1** — Claim: Deepfake fraud caused $1.5B+ reported losses in the first 9 months of 2025; human deepfake detection (~24.5%) is below chance. Sources: Veriff [29]; Adaptive Security [30]. Confidence: High (concordant secondary sources citing Surfshark/LexisNexis/FBI).
- **E4.2** — Claim: C2PA is broadly adopted (6,000+ members; OpenAI/Google/Adobe; Samsung/Sony/Nikon/Leica/Canon hardware; EU AI Act Art. 50 from Aug 2, 2026) but structurally removable — regulators themselves require watermark + logging fallbacks. Sources: Truescreen [31]; FindSkill [32]; internet-pros [33]; Presenc [34]. Confidence: High.
- **E4.3** — Claim: On-chain inscription gives what metadata provenance cannot: permanent, immutable, independently reconstructable publication ("digital artifacts"), composable via recursive references. Sources: Chainalysis [41]; The Block [42]. Confidence: High.
- **E4.4** — Claim: An execution-attestation stack (ERC-8004 + ERC-8263 + OCP) is being specified so third parties can verify what an agent committed and when, without trusting the agent's infra. Source: ethresear.ch composition note [22]. Confidence: High (primary research post), Medium on adoption (early).

---

## 5. Machine-readable content graphs vs scraping the mutable web

**Why a permanent, relationship-typed object graph is categorically different for an agent:**

1. **The web's machine-readability layer is a patchwork of declarations, not state.** `llms.txt` (Jeremy Howard, Sept 2024) gives agents a curated markdown map — adopted by Anthropic, Cloudflare, Perplexity — but "helps agents *read* a site efficiently, not *interact* with it responsibly" [36][37]. Adjacent files multiply (`agents.txt`, `ai.txt`, `agent-permissions.json`, LLM-LD's `.well-known/llm-index.json`, A2A `agent.json`) — all are revocable, mutable, self-asserted publisher statements [36][37][38].
2. **Scraping economics are collapsing into paywalls and adversarial controls.** AI crawlers are 50–80% of bot traffic; publisher organic traffic fell 25–38% YoY; Cloudflare's pay-per-crawl (July 2025) turns content access into per-request HTTP-402 micropayments with signed-bot authentication; 14% of top domains already block AI bots via robots.txt [39][40]. An agent scraping the web faces rising cost, consent gates, and mutation risk on every fetch.
3. **The "agent-first web" research agenda** (arXiv, Nov 2025) explicitly calls for machine-readable capability declarations, an agent-facing markup format (ATML) parallel to HTML, **cryptographic provenance chains built on C2PA**, and agent search indices — a 3-phase migration that acknowledges today's HTML web was never designed for agents [35].
4. **Empirical behavior:** AI coding agents compress multi-page documentation navigation into 1–2 requests, breaking web analytics and rewarding machine-readable surfaces (AGENTS.md, llms.txt, skill.md, MCP feedback channels) [38].
5. **What an on-chain object graph adds that none of the above can:** (a) **immutability** — content and links cannot be edited or 404 (sealed Xtrata inscriptions are immutable; the site is "a gateway, not the source of truth"; objects are independently reconstructable from chain data) [1][2]; (b) **typed, traversable relationships as chain state** — parent→child (ownership-proven), dependency (existence-proven), reply threads — queryable via read-only contract calls (`get-dependencies`, `get-inscription-meta`) rather than inferred from HTML [1][2]; (c) **identity-bound authorship** — creator/owner are wallet principals, resolvable to BNS names and (increasingly) ERC-8004 agent IDs [1][7][21]; (d) **economic actions on the same surface** — the graph edge and the payment/settlement are the same medium (market in STX/sBTC/USDCx; sponsored claims) [1]. This is the difference between *reading assertions about content* and *reading the content's canonical state*.

### Evidence entries — Section 5

- **E5.1** — Claim: llms.txt is a growing but unratified convention for agent-readable sites; it aids reading, not governed interaction. Sources: txt-llms.com [36]; LAS-WG permission-manifests paper [37]. Confidence: High.
- **E5.2** — Claim: AI-crawler pressure is pushing the web toward pay-per-crawl (HTTP 402 micropayments, signed bots) and robot exclusions — scraping is getting expensive and adversarial. Sources: webscraft [39]; firstaimovers [40]. Confidence: Medium-High (secondary; Cloudflare launch widely corroborated).
- **E5.3** — Claim: Academic "agent-first web" proposals call for provenance chains + parallel agent-facing formats, conceding HTML was not designed for agents. Source: arXiv 2606.19116 [35]. Confidence: High (primary paper).
- **E5.4** — Claim: Xtrata's object model stores relationships as machine-readable chain state ("Origins, dependencies, and connected works can be used by apps"), reconstructable independent of the website. Source: xtrata.xyz [1]; agent skill read-only API [2]. Confidence: High (primary).

---

## 6. Novel concepts already emerging — status mid-2026

- **Agents paying agents:** Coinbase's first AI-to-AI crypto transaction (Aug 2024) [43] → x402 at ~165M txs (Apr 2026) [9][11] → **Olas: 18.2M+ lifetime agent transactions, 13.2M+ agent-to-agent, with a live 15% protocol fee on agent-to-agent payments (Marketplace fee + OLAS burn, Q2 2026)** [54] → **Virtuals ACP: escrowed agent-hires-agent lifecycle (request→negotiate→escrow→deliver→evaluate→settle), $1M/month Revenue Network (Feb 2026), x402 integration (Oct 2025) drove weekly txs from <5k to >25k; 15,800+ agent projects, ~$477M "Agentic GDP"** [50][51][57] → **aibtc: agents pay 100 sats sBTC per message to other agents' inboxes** [5]. arXiv now frames "agent-to-agent finance" as a financial-market-infrastructure research topic requiring a "delegated decision chain" record [59].
- **AI-run/AI-associated treasuries:** Truth Terminal (Andy Ayrey) received **$50,000 in BTC from Marc Andreessen** (July 2024), endorsed the $GOAT memecoin (Oct 2024), and saw its wallet become a "crypto millionaire" as GOAT hit ~$700M–1B market cap within weeks; Ayrey announced plans to move the AI's wallets into legal trusts — while critics note ToT is semi-autonomous and the wallet was human-controlled [44][45][46]. Precursor to genuinely agent-controlled treasuries: agent policy wallets (Coinbase Agentic Wallets, Turnkey/Privy/Safe policy layers) now encode spend limits at the infrastructure level [16].
- **Autonomous artists:** **Botto** (Mario Klingemann + ElevenYellow, est. Oct 2021): decentralized autonomous artist governed by BottoDAO; ~70k weekly generations → 350 fragments → 1 canonical weekly NFT; **$5M+ total sales**; Sotheby's solo "Exorbitant Stage" (Oct 2024) sold **$351,600 across six lots**; 30+ exhibitions incl. Art Basel; DAO treasury splits proceeds with voters [47][48][49].
- **Agent marketplaces:** Coinbase Agent.market (Apr 2026, 7 categories) [11]; Olas Pearl "agent app-store" (834 daily active agents Q1 2026) + Mech Marketplace "AI Agent Bazaar" [54][55]; Virtuals (40,000+ agents claimed on-site; Unicorn launchpad; Butler human↔agent interface) [53]; Fetch.ai/SingularityNET/Ocean (ASI Alliance), Akash compute [56][57]; x402 Bazaar discovery [56].
- **Agent identity commoditizing:** ERC-8004 registries live on 18 networks [16]; Virtuals + EF dAI co-developed ERC-8183 commerce standard feeding ERC-8004 reputation [51][52]; "the single biggest concentration of unverified agent identity anywhere in Web3" critique shows demand for independent identity/reputation rails [51].
- **Honest counter-signal:** real x402 commerce ~$28K/day [11]; Virtuals revenue down sharply from Jan 2025 peak with >90% of wallets underwater [50]; ToT was not truly autonomous [44]. The infra is real and converging; durable demand is still being proven.

### Evidence entries — Section 6

- **E6.1** — Claim: Agent-to-agent payment volume is real and growing across three independent ecosystems (x402 ~165M txs; Olas 13.2M A2A txs with a live fee; Virtuals ACP escrow + $477M aGDP). Sources: [9][54][57]. Confidence: High.
- **E6.2** — Claim: Truth Terminal received $50k BTC from Marc Andreessen and became a "crypto millionaire" via $GOAT (~$700M–1B peak mcap); plans existed to move AI wallets into trusts; autonomy was partial. Sources: Odaily [44]; Cointelegraph [45]; IQ.wiki [46]. Confidence: High.
- **E6.3** — Claim: Botto is a working autonomous-artist economy: $5M+ sales, Sotheby's solo show ($351,600), DAO-governed treasury splitting proceeds with curators. Sources: Botto/Sotheby's press [47]; CNBC via NBC [48]; ThomasNet [49]. Confidence: High.
- **E6.4** — Claim: Agent marketplaces are proliferating (Coinbase Agent.market, Olas Pearl/Mech, Virtuals, Fetch.ai/SingularityNET, Akash). Sources: decentralised.news [56][57]; Olas [54][55]; presenc [11]. Confidence: High.

---

## 7. Agent-native use cases Xtrata is uniquely positioned for

Grounded strictly in verified Xtrata features: **sponsored transactions** (zero-STX claim/create for the counterparty) [1]; **machine-readable object graph** (parent→child ownership links with escrow-at-mint, existence-only dependency references, on-chain reply threads) [1][2]; **permanence** (immutable sealed inscriptions, 16KB chunks up to 32MiB, canonical-hash dedupe, independent reconstruction) [2]; **open SDK + contract API + agent training docs incl. an aibtc/MCP track** [2][3][4]; **Stacks/Bitcoin security + BNS/.btc identity + ERC-8004-on-Stacks registries in the same ecosystem** [5][7][21][61]; **x402-style flows already adjacent** (aibtc agents pay sBTC via 402 headers) [5].

1. **Agent publication chain of record (provenance anchor).** Agents inscribe outputs (reports, art, music, model cards, datasets, code) as immutable, timestamped, creator-attributed inscriptions — the durable complement to strippable C2PA metadata (§4). Canonical-hash dedupe (`get-id-by-hash`) makes "did this exact content already exist?" a single read-only call. Fit: permanence + SDK + PostCondition safety rails [2][3].
2. **Zero-friction agent onboarding via sponsored transactions.** The blocker for autonomous agents is acquiring native gas tokens; Xtrata's sponsored claims/drops and sponsored market purchases let an agent claim its first objects and even get created *for* — the aibtc model (agents holding STX/sBTC) plus Xtrata sponsorship removes the cold-start that most chains impose on agents [1][5].
3. **Agent-to-agent conversation & threading with economic weight.** On-chain reply threads = a permanent, wallet-signed discussion substrate; combined with aibtc's 100-sat x402 messaging, Xtrata threads could host paid or reputation-gated agent discourse that no platform can delete (spam-resistant via sponsorship economics or fee-unit pricing) [1][5].
4. **Verifiable supply chains for AI-generated media.** Parent→child links enforce *ownership-proven derivation* (an agent must own the parent to mint a child — parents are escrowed at mint); dependency links give *permissionless citation* (existence-only). Remix lineages, model→output lineages, and dataset→fine-tune lineages become traversable chain state, not self-declared metadata [1][2].
5. **Agent-authored software & composable objects.** Recursive inscriptions/dependencies let an agent publish code (≤32MiB across chunks) that other inscriptions reference — the Ordinals recursive pattern (§4.3) with a contract API (`seal-recursive`, `get-dependencies`) and an SDK; agents can ship on-chain apps/instruments that later agents compose without trust [2][42].
6. **Agent commerce objects with built-in settlement.** Market listings settle in STX/sBTC/USDCx through Xtrata contracts; sponsored listings mean a buyer-agent with zero STX can still purchase (fee prepaid by seller). Agents can sell outputs, editions, and access tokens directly to other agents — aligning with the x402/ACP agent-commerce wave while keeping Bitcoin settlement [1][9][54].
7. **On-chain résumé/portfolio for ERC-8004 agents.** ERC-8004 identity lives on Stacks mainnet (SIP-009 agent NFTs) [21]; an agent's Xtrata inscriptions are a permanent, queryable body of work bound to the same wallet principal — a verifiable portfolio that reputation registries and evaluator agents (ERC-8183-style) can reference when scoring past performance [19][21][52].
8. **Bounty/challenge rails for agent labor.** Xtrata's live bounty model (Zero Authority DAO "inscribe your first masterpiece," sponsored claims, gallery flywheel) is directly portable to agent work: challenge objects → agent submissions as inscriptions → public gallery → collecting = payment; "the submission is the object… not merely proof that something happened" [1].
9. **Agent memory/knowledge persistence.** Sessions, datasets, and configuration inscribed as objects survive infra churn (30-day resumable uploads; purge only of expired sessions) — agents get durable memory anchored to Bitcoin finality that successor agents can reconstruct independently [2].
10. **MCP-native Stacks presence.** With MCP the universal tool layer (97M monthly downloads) and aibtc's MCP server already mapping Xtrata ops to `stacks_call_contract` tools — including a documented workaround for the empty-buffer failure — Xtrata is one of the few content protocols anywhere with a tested MCP integration path for autonomous agents [4][8][26].

**Strategic gap / watch-items:** Xtrata's own agent docs currently cover mint/transfer/query but not yet sponsored-transaction APIs, drops/market contract calls, or reply-thread functions in the skill file (grep for sponsor/x402/drop/reply in the repo docs returned nothing) — product surface exists on-site [1] but agent-doc coverage of it would close the loop. Also missing so far: an xtrata.xyz/llms.txt real content file (route serves the SPA shell) and an Xtrata MCP server of its own — both are cheap, high-leverage agent-readiness wins given the ecosystem norm set by aibtc.com [5][6].

---

## Citations

1. xtrata.xyz — homepage + Build/Train agents section (rendered SPA). https://xtrata.xyz (accessed 2026-07-21)
2. XTRATA_AGENT_SKILL.md — stxtrata/xtrata (OPTIMISATIONS). https://github.com/stxtrata/xtrata/blob/OPTIMISATIONS/xtrata-1.0/XTRATA_AGENT_SKILL.md
3. AI Skills Training Docs README — stxtrata/xtrata. https://github.com/stxtrata/xtrata/blob/OPTIMISATIONS/xtrata-1.0/docs/ai-skills/README.md
4. AIBTC Agent Training Guide — stxtrata/xtrata. https://github.com/stxtrata/xtrata/blob/OPTIMISATIONS/xtrata-1.0/docs/ai-skills/aibtc-agent-training.md
5. AIBTC — homepage/llms.txt (plaintext). https://aibtc.com/llms.txt (accessed 2026-07-21)
6. AIBTC — onboarding skill. https://aibtc.com/skill.md (accessed 2026-07-21)
7. AIBTC — Identity & reputation (ERC-8004 on Stacks). https://aibtc.com/docs/identity.txt (accessed 2026-07-21)
8. AIBTC MCP server listing (120+ tools, x402 handling) — MCP Market. https://mcpmarket.com/server/aibtc
9. RZLT — "Agentic Payments in 2026: What They Are and How the x402 Protocol Works" (2026-07-14). https://www.rzlt.io/blog/agentic-payments-2026-x402-explainer
10. DevToolLab — "x402 Protocol Explained" (2026-07-12). https://devtoollab.com/blog/x402-ai-agent-payments-guide
11. Presenc AI — "x402 Protocol Adoption Tracker 2026" (2026-05-15). https://presenc.ai/research/x402-protocol-adoption-tracker-2026
12. AgentLux — "Agent Payments Showdown: x402 vs AP2 vs MPP vs ACP in 2026" (2026-05-11). https://agentlux.ai/blog/the-agent-payments-showdown-x402-vs-ap2-vs-mpp-vs-acp-in-2026
13. AgentLux — "The Agent Payment Stack in 2026" (2026-04-24). https://agentlux.ai/blog/the-agent-payment-stack-in-2026-x402-ap2-and-the-race-to-pay-agents
14. BlockEden — "UCP vs x402 vs PayPal: Inside the 2026 Protocol War" (2026-04-18). https://blockeden.xyz/blog/2026/04/18/google-ucp-vs-x402-paypal-ai-agent-payment-protocol-war/
15. Odaily — "Panorama of Crypto AI Protocols… ERC-8004" (2026-04-16). https://www.odaily.news/en/post/5210292
16. ChainCatcher — "Bank card payments vs. stablecoin payments: which is better for AI agents?" (2026-03-11). https://www.chaincatcher.com/article/2251080
17. 0G — "0G Now Supports ERC-8004, the Trustless Agents Standard" (2026-07-14). https://0g.ai/blog/0g-supports-erc-8004
18. Decipher Club — "So, what exactly are 'Trustless Agents' up to?" (2026-06-17). https://www.decipherclub.com/so-what-exactly-are-trustless-agents-up-to/
19. EIP-8004: Trustless Agents — official spec. https://eips.ethereum.org/EIPS/eip-8004
20. CryptoSlate — "Ethereum aims to stop rogue AI agents… ERC-8004" (2026-01-29). https://cryptoslate.com/ethereum-aims-to-stop-rogue-ai-agents-from-stealing-trust-with-new-erc-8004-but-can-it-really/
21. aibtcdev/erc-8004-stacks — Clarity ERC-8004 contracts (mainnet deployed). https://github.com/aibtcdev/erc-8004-stacks
22. Ethereum Research — "Composition Note: ERC-8004 + ERC-8263 + OCP" (2026-05-28). https://ethresear.ch/t/composition-note-erc-8004-erc-8263-ocp-a-reference-guide-for-implementers-building-on-the-ai-agent-verification-stack/24995
23. Chainlink — "ERC-8004 Agent Identity Standard." https://chain.link/article/erc-8004-agent-identity
24. Monad Docs — "How to register and build with ERC-8004 on Monad" (2026-07-17). https://docs.monad.xyz/guides/erc-8004
25. Orbilon Tech — "What Is MCP vs A2A? (2026)" (2026-07-15). https://orbilontech.com/mcp-vs-a2a-ai-agent-protocols-2026/
26. Pickaxe — "MCP vs A2A Protocol: What AI Agent Builders Need to Know in 2026" (2026-05-19). https://pickaxe.co/post/mcp-vs-a2a-protocol
27. PrimeAIcenter — "MCP vs A2A Protocol 2026" (2026-04-22). https://primeaicenter.com/mcp-vs-a2a-protocol/
28. AI Growth Agent — "A2A Protocol Explained: Agent Interoperability in 2026" (2026-07-13). https://aigrowthagent.co/articles/a2a-protocol-explained-2026/
29. Veriff — "What deepfake fraud actually costs businesses in 2025–2026" (2026-07-17). https://www.veriff.com/fraud/deepfake-fraud-cost-2026
30. Adaptive Security — "AI Deepfake Trends: 2025-2026 Guide" (2026-07-10). https://www.adaptivesecurity.com/blog/ai-deepfake-trends-the-complete-2025-2026-guide-to-statistics-threats-detection-and-defense-stra
31. Truescreen — "C2PA Standard: History, Promises and Structural Limitations" (2026-07-19). https://truescreen.io/articles/c2pa-standard-history-limitations/
32. FindSkill — "What Is C2PA? Content Credentials Explained (2026)" (2026-06-25). https://findskill.ai/learn/c2pa/
33. Internet-Pros — "AI Content Provenance… 2026" (2026-04-30). https://internet-pros.com/blog/ai-content-provenance-watermarking-c2pa-2026/
34. Presenc AI — "SynthID and C2PA Content Credentials at Google I/O 2026" (2026-05-26). https://presenc.ai/research/google-io-2026-synthid-content-credentials
35. arXiv — "Towards an Agent-First Web: Redesigning the Web for AI Agents" (2025-11). https://arxiv.org/html/2606.19116v1
36. txt-llms.com — "What Is LLMs.txt? — The Open Standard for AI-Readable Websites." https://txt-llms.com/about-llms-txt
37. arXiv — "Permission Manifests for Web Agents (LAS-WG)" (2025-06). https://arxiv.org/html/2601.02371v2
38. arXiv — "Developer Experience with AI Coding Agents: HTTP Behavioral Signatures in Documentation Portals." https://arxiv.org/html/2604.02544v1
39. Webscraft — "Pay-per-Crawl by Cloudflare in 2025–2026" (2025-12-11). https://webscraft.org/blog/paypercrawl-vid-cloudflare-u-20252026-chi-varto-prodavati-sviy-kontent-iibotam?lang=en
40. First AI Movers — "The Internet's New Business Model in 2025: Charge AI Crawlers with Cloudflare Pay-Per-Crawl" (2025-07-31). https://www.firstaimovers.com/p/cloudflare-pay-per-crawl-content-monetization-2025
41. Chainalysis — "Ordinals: A New Innovation Powering Bitcoin NFTs and Maybe More." https://www.chainalysis.com/blog/ordinals-protocol-bitcoin-nfts/
42. The Block — "Ordinals recursive inscriptions could unlock 3D video games on Bitcoin" (2023-06). https://www.theblock.co/post/234195/ordinals-recursive-inscriptions-bitcoin-video-games
43. Odaily — "AI sends coins to AI? Explaining Coinbase's first AI-agent crypto transaction" (2024-09-02). https://www.odaily.news/en/post/5198093
44. Odaily — "OpenAI promotes AI Agent craze… Crypto AI Agent trajectory" (2024-11-20). https://www.odaily.news/en/post/5199887
45. Cointelegraph — "Is Goatseus Maximus (GOAT) a scam?" (2024-10-25). https://cointelegraph.com/learn/is-goatseus-maximus-goat-a-scam
46. IQ.wiki — "Goatseus Maximus (GOAT)." https://iq.wiki/wiki/goatseus-maximus-goat
47. Botto — "Autonomous AI Artist Botto Breaks $350K in Sales at Sotheby's" (2024-10-24). https://botto.com/autonomous-ai-artist-botto-350k-sales-sothebys
48. NBC Connecticut/CNBC — "Meet Botto, the AI 'machine artist' making millions" (2024-12-23). https://www.nbcconnecticut.com/news/business/money-report/meet-botto-the-ai-machine-artist-making-millions-of-dollars/3460213/
49. ThomasNet — "How AI Artist Botto Is Changing the Creative Landscape" (2025-02-25). https://www.thomasnet.com/insights/ai-artist-botto/
50. Datawallet — "What is Virtuals Protocol? AI Agents, Tokenomics & Risks" (2026-04-12). https://www.datawallet.com/crypto/what-is-virtuals-protocol
51. RNWY — "Trust Scoring for Virtuals Protocol Agents" (2026-03-12). https://rnwy.com/blog/virtuals-protocol-trust-scoring
52. Tekedia — "Ethereum Foundation and Virtuals Protocol to Introduce Trustless Commerce Layer [ERC-8183]" (2026-03-11). https://www.tekedia.com/ethereum-foundation-and-virtuals-protocol-to-introduce-trustless-commerce-layer-tailored-for-ai-agents/
53. Virtuals Protocol — official site (agent counts, ACP). https://virtuals-protocol.com/
54. Olas — "Q2 2026 Roundup" (2026-07-01). https://olas.network/blog/q2-2026
55. Olas — "Q1 2026 Roundup" (2026-04-06). https://olas.network/blog/olas-q1-2026-roundup
56. Decentralised News — "AI Agents Need App Stores — These 8 Crypto Marketplaces Are Building Them" (2026-03-30). https://decentralised.news/ai-agents-need-app-stores-these-8-crypto-marketplaces-are-building-them
57. Decentralised News — "The Complete AI Agents Directory 2026" (2026-05-16). https://decentralised.news/the-complete-ai-agents-directory-2026-every-real-world-use-case-ranked-and-reviewed
58. MoonPay — "Why Agentic Payments Are The Future of AI and Crypto" (2026-04-08). https://www.moonpay.com/learn/cryptocurrency/why-agentic-payments-are-the-future-of-ai-crypto
59. arXiv — "Agent-to-Agent Finance: Blockchain Payments and Trust Infrastructure for Autonomous AI Agents" (2026-06-30). https://arxiv.org/html/2607.00245v1
60. BingX/BroadChain — "Stacks Q1 2026 Ecosystem Update: sBTC TVL Hits $545M" (2026-04-28). https://bingx.com/en/flash-news/post/stacks-q-sbtc-tvl-hits-million-as-defi-deployed-capital-reaches-million
61. Stacks Forum — topic list incl. "SIP-XXX Agent Registries (ERC-8004 on Stacks) — Open for Comment"; "BNS Upgrade: sBTC." https://forum.stacks.org/ (accessed 2026-07-21)
62. Nevermined — "Coinbase x402 Alternatives for AI Payments in 2026" (2026-06-04). https://nevermined.ai/blog/coinbase-x402-alternatives
63. ATXP — "Every Agent Payment Protocol Compared: X402, ACP, UCP, AP2 (2026)" (2026-03-04). https://atxp.ai/blog/agent-payment-protocols-compared/
64. Phemex — "Stacks Network Reports $437M sBTC TVL in Q1 2026" (2026-04-28). https://phemex.com/news/article/stacks-network-reports-437m-sbtc-tvl-in-q1-2026-76789
