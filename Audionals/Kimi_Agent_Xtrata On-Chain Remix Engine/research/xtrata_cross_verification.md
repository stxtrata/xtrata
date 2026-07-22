# Xtrata Research — Cross-Verification (Phase 4–5)

Date: 2026-07-21. Inputs: xtrata_dim01.md … xtrata_dim06.md.

## High Confidence (≥2 agents, independent sources, consistent)
- Xtrata = fully on-chain object platform on Stacks, anchored to Bitcoin; media stored in 16,384-byte
  chunks as SIP-009 NFTs, sealed immutable, content-addressed via incremental SHA-256 chain hash
  with native dedupe (dim01 verified live on-chain: contract SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3,
  2,807 v3 inscriptions; dim02 independently confirmed via explorer data).
- Object graph primitives: parent→child ownership links (parent escrowed at mint), dependency
  references (existence-only, ≤50), on-chain reply threads, recursive HTML via same-origin /i/{id}
  (dim01 code/contract level; dim03 comparison confirms Ordinals lacks typed dependency/reply semantics).
- Sponsored transactions enable zero-STX claims/creates; drops contract live since 2026-07-10/11
  with 32 campaigns (dim01 contract ABI; dim02 on-chain campaign count).
- Jim Crane (jim.btc, founder of Audionals, co-founder of This Is #1) is the driving force
  (dim02 address-level proof chain; dim01 repo/history; dim04 Audionals background consistent).
- XTRATA FM: shipped on-chain radio widget streaming multi-MB MP3s from /i/{id} via HTTP Range
  (dim01 code-level, verified live 4.53 MB audio in 277 chunks; dim02 PR #204; dim04 no public page — consistent: SDK-distributed widget).
- Prior music-NFT platforms died with media off-chain: Sound.xyz offline 2026-01-16; Nina Protocol
  winding down 2026-07-22; Catalog pinned media on IPFS (dim04 primary sources; dim03 link-rot data
  corroborates the failure mode generally: 3.91% IPFS images + 9.04% metadata gone in 6 months, UCSB).
- Link rot / impermanence is a large documented problem: Pew 2024 (25% of 2013–23 pages gone),
  2025 US gov data purges, YouTube deletion of Syrian war-crime evidence videos (dim05, multiple primary sources).
- AI-agent commerce ecosystem is live on Stacks: aibtc MCP wallets, HTTP-402 agent payments in sBTC,
  ERC-8004-on-Stacks registries mainnet-deployed (dim06 primary); Xtrata ships a 1,106-line agent skill
  doc explicitly targeting aibtc agents (dim01, dim06 consistent).

## Medium Confidence (1 agent, authoritative source)
- Cost-per-MB comparison figures (dim03): Xtrata ~$0.1–2/MB estimated from live fee samples;
  Ordinals $160–315/MB at current low fees; Ethscriptions $34–336/MB; ETH SSTORE $1.3k–13k/MB.
  Sound methodology, live anchors, but single-agent derivation — label as estimates.
- Streaming economics (dim04): Spotify ~$0.003–0.005/stream, 45–60+ day payout lag, top 0.4–1%
  of artists take 60–75% of streams — single agent but multiple primary/official sources (UK CMA/IPO, Luminate).
- Zero Authority DAO bounty is pre-launch (200 STX, 4×50; placeholder config still in code) (dim02, code-level evidence).

## Low Confidence / Flagged
- Audionals traction figures (TRUTH sellout ~1 hour, 50k+ audio ordinals) — self-reported (dim04 caveat).
- XTRATA FM has zero independent web coverage; all evidence is code/on-chain (dim01/dim02/dim04 all flag this).

## Conflict Zones (documented, not suppressed)
- Stacks sBTC TVL reported as both $545M and $437M (dim06) — temporal/source inconsistency; NOT load-bearing for this report; excluded from final deliverable.
- Sound.xyz shutdown narrative: Chartlex post-mortem vs sound.xyz's own notice — primary source (sound.xyz) treated as authoritative (dim04).
- Older Xtrata docs name v2.1.0/v2.1.1 as current; v3-2-3 is canonical per newest inventory + chain state (dim01).
- Stacks 2026 chain-state-pruning proposal could affect very-long-horizon reconstruction claims (dim03) — honest caveat to include.

## Phase 5 decision
No conflict zone affects the report's core theses (all are peripheral metrics or resolved-in-favor-of-primary).
No targeted validation round needed. Proceed to Phase 6 insights.
