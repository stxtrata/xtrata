# Xtrata (xtrata.xyz) — Team & Traction Investigation
**Date of research:** 2026-07-21 · **Scope:** founders/team, community/socials, Zero Authority DAO bounty, on-chain activity, Xtrata Radio/FM, roadmap/token/funding · **Method:** primary sources (site, GitHub, X, on-chain Hiro API reads, BNS resolution, DAO properties)

---

## 1. Founders / Team

**Claim: Xtrata is built and run pseudonymously; the public engineering presence is a single GitHub account `stxtrata` (repo `stxtrata/xtrata`), created around the project's January 2026 start, with 1,557 contributions in the last year and 1,318 commits on `main`. Development is heavily AI-assisted.** [^1^][^2^]
- Source: https://github.com/stxtrata and https://github.com/stxtrata/xtrata · Date: checked 2026-07-21
- Excerpt: "1,557 contributions in the last year … Created 284 commits in 1 repository (July 2026) … 1,318 Commits … 108 Branches … Contributors 3: stxtrata, claude (Claude bot), shubh2294 (Shubham Mishra) … Languages: HTML 41.3%, JavaScript 36.0%, TypeScript 12.2%, Clarity 8.7%". Repo folders include `Agent-27-claude`, `Fable Multi-Agentic Harness Docs`; a commit reads "full fable optimisation planned then implemented by opus 4.8 then aud…". README: "Xtrata — Recursive Inscription Data Layer for Bitcoin L2 … Where Ordinals treat inscriptions as isolated artefacts, Xtrata treats them as structured, addressable data blocks."
- Confidence: High (observed directly).

**Claim: The only human named contributor on the repo besides the maintainer is "Shubham Mishra" (`shubh2294`, India), who shows 0 contributions in the last year — i.e., not an active core dev; effectively a one-person + AI operation.** [^3^]
- Source: https://github.com/shubh2294 · Date: checked 2026-07-21
- Excerpt: "Shubham Mishra shubh2294 … India … 0 contributions in the last year."
- Confidence: High.

**Claim: Xtrata's on-chain treasury/deployer identity is address `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X`, which owns the BNS name `xtrata.btc`. An earlier personal deployer `SPD60B1MGZVZR8758E86SR364N95VSP13E5FHYXE` deployed the first contract (`xtrata-v1-1-0`) and transferred `xtrata.btc` to the new deployer on 2026-01-27.** [^4^][^5^][^6^]
- Source: Hiro API balances + BNS-V2 `get-bns-from-id` call + tx 0x3cb9f350…83c · Date: checked 2026-07-21
- Excerpt (BNS-V2 `get-bns-from-id u358312`, decoded): `{name: "xtrata", namespace: "btc"}`. Transfer tx: "sender: SPD60B1MGZVZR8758E86SR364N95VSP13E5FHYXE | 2026-01-27T19:29:51Z | BNS-V2 transfer id u358312 → SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X". Deployer balances: STX balance 178.98, total received 501.23 STX, holds 1 BNS-V2 name.
- Confidence: High (on-chain reads).

**Claim: The central person behind Xtrata is `jim.btc` — Jim Crane, founder of Audionals (Bitcoin on-chain music protocol, 2023) and co-founder of "This Is #1" (the first curated NFT marketplace on Stacks, 2021). The evidence is on-chain and on-site, though Xtrata itself never names him.** [^7^][^8^][^9^][^10^][^11^]
- Source: multiple, cross-verified:
  - jim.btc resolves (BNS-V2) to owner hash160 `41c139d4…b518` = address `SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7` (Hiro API validates it; ~600 STX balance, 13,459 STX lifetime received). [^7^]
  - Xtrata's own app config (xtrata.xyz main JS bundle) sets this address as the `creator` of the "Dropped collection" drops (dropIds 4–12+). [^8^]
  - The newest inscription (#2807) is owned by `jim.btc` per the Xplorer; `get-owner(2807)` on v3-2-3 returns the same hash160 as jim.btc's BNS owner. [^9^]
  - This wallet holds 116 `thisisnumberone-v2` NFTs (This Is #1), 87 Boom NFTs, 3 BNS names, and `aibtcdev-airdrop-2` NFTs. [^7^]
  - xtrata.xyz homepage flagship gallery "jim-music" (inscription #1107, "Music that carries its own history") and the persistent XTRATA FM radio widget. [^10^]
  - Jim Crane bio sources below. [^11^]
- Confidence: High that jim.btc/Jim Crane controls the drops-creator wallet and is the driving force; Medium-High that he is the (sole) founder (no explicit "team" page exists).

**Claim: Jim Crane ("Jim.btc", X: @jimdotbtc) is a Brighton-based former music producer/sound engineer who imported the UK's first Bitcoin ATM in 2014, co-founded This Is #1 on Stacks in 2021 (featuring Fatboy Slim, Orbital, Cara Delevingne), and created the Audionals protocol on Bitcoin Ordinals in 2023 (OB1 sample library, Audional Sequencer, "TRUTH" — the first recursive music collection on Bitcoin).** [^11^][^12^][^13^]
- Source: https://app.leather.io/support/guide/what-are-audionals (Leather, 2025-08-28); https://audionals.com/web3/key-figures; https://audionals.com/audionals/the-audionals-show · Date: checked 2026-07-21
- Excerpt (Leather): "Jim.btc, a former musician and sound engineer, is the mastermind behind Audionals… His persistence led to the creation of a new protocol for putting audio on-chain, culminating in the first recursive music collection on Bitcoin, which sold out in just over an hour."
- Excerpt (audionals.com key-figures): "Jim.btc (Jim Crane) — Founder of Audionals — Former music producer who pioneered the Audionals protocol on Bitcoin in 2023…"
- Excerpt (audionals.com show page): "Jim Crane (Jim.BTC) presents Audionals at Bitcoin Unleashed. He discusses his background as a music producer and tour manager… importing the UK's first Bitcoin ATM in 2014, meeting Stacks core developer Mike Cohen, and co-founding 'This is #1', the first NFT marketplace on Stacks… collaborating with artists like Fatboy Slim, Orbital, and Cara Delevingne."
- Confidence: High (multiple independent sources).

**Claim: A second associated creator is `dyle.btc` — an artist/inscriber who created early v3 inscriptions (e.g. #100), owns the art piece featured on the homepage (#296), and listed v2 inscriptions on the Xtrata STX market (2 listings at 10 STX each, created ~block 7,200,268). Role (team vs. community artist) is unconfirmed.** [^9^][^14^]
- Source: BNS-V2 owner read (dyle.btc → hash160 `3b07c532…b484`); xtrata-market-stx-v1-0 `get-listing` reads (ids 2–3: seller 3b07c532…, price 10,000,000 µSTX = 10 STX, tokens #149/#156 on xtrata-v2-1-0); xtrata.xyz homepage ("Art that can travel · inscription #296 · wallet=dyle.btc").
- Confidence: High on on-chain facts; Low on team affiliation.

**Claim: Official X account is `@XtrataLayers` ("Xtrata"), joined January 2026, with 370 posts, 117 followers, 233 following — small but active. The same account is registered in the AIBTC agent network as agent "Huge Sphinx" (registered 2026-04-09, earned 12,028 sats, last seen 2026-04-22).** [^15^][^16^]
- Source: https://x.com/XtrataLayers · Date: checked 2026-07-21 · Excerpt: "Xtrata @XtrataLayers — A graph-based, immutable execution reference layer. Built on Stacks, anchored to Bitcoin. Boring infrastructure for Exciting Web3 apps. xtrata.xyz — Joined January 2026 — 233 Following, 117 Followers, 370 posts."
- Source: https://aibtc.com/agents · Excerpt: "Huge Sphinx @XtrataLayers | 12,028 sats | Apr 9, 2026 | Apr 22, 2026". (The repo also contains a `Huge-Sphinx` folder.) [^1^]
- Confidence: High.

---

## 2. Community & Socials

**Claim: There is no evidence of a Discord or Telegram community — the site and app link only X, GitHub docs, and in-app surfaces. Blog/Medium/Substack presence: none for Xtrata itself (xtrata.xyz/blog just renders the homepage).** [^10^][^17^]
- Source: xtrata.xyz footer (only "Xtrata on X" external social link); grep of the full app JS bundle for discord.gg/discord.com/t.me returned zero matches. [^17^]
- Confidence: High (negative result, checked both HTML and JS bundle).

**Claim: Press coverage is essentially absent; the only third-party coverage found is (a) a listing/mindshare page on aixbt.tech and (b) automatic indexing of the v2 collection on Gamma.io. No CoinDesk/TheBlock/Stacksmag coverage found.** [^18^][^19^]
- Source: https://aixbt.tech/projects/Xtrata-69cbe7e162fd35aabfaf2e0a · Excerpt: "Xtrata is an executable data layer anchored to Bitcoin via the Stacks blockchain, enabling permanent on-chain inscription of executable content such as HTML…" (page shell loads; minimal chatter data).
- Source: https://stacks.gamma.io/collections/SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0/270 · Excerpt: "Minted for 0.8 STX … This item has never been sold before."
- Confidence: High (negative result after varied searches).

---

## 3. Zero Authority DAO bounty ("Inscribe your first masterpiece")

**Claim: The bounty landing page is live at xtrata.xyz/masterpiece: "Xtrata × Zero Authority DAO — Inscribe your first masterpiece", 200 STX prize pool, 4 winners × 50 STX, open creative category (image/audio/text/photo/video/code). BUT it is pre-launch: deadline "TBA", the entries gallery is empty, and the "Official bounty" button still shows the developer placeholder "Add the official Zero Authority bounty URL in CONFIG before launch."** [^20^]
- Source: https://xtrata.xyz/masterpiece · Date: checked 2026-07-21
- Excerpts: "200 STX creative bounty · Deadline to be announced … Presented by XTRATA · Sponsored by ZERO AUTHORITY DAO … Prize pool 200 STX, Equal awards 4 × 50 STX, Network Stacks, Time remaining TBA" … "Campaign gallery — This area is ready for approved live entries once the campaign begins." … (clicking Official bounty ↗) "Add the official Zero Authority bounty URL in CONFIG before launch." Steps: Create → Inscribe via Xtrata Wizard → Share publicly → "Submit your inscription link and public post through the official Zero Authority bounty."
- Confidence: High.

**Claim: Zero Authority DAO is a Stacks-ecosystem "reputation and bounty platform" (per Stacks Foundation's 2025 review), legally "Zero Authority DAO LLC", publishing on Substack (blog.zeroauthority.xyz, latest post 2026-07-03), and it received a US$5,000 DeGrants community grant ("Zero Authority - Nova AI"). Its main site zeroauthority.xyz was unreachable (connection closed) during this research. The bounty is NOT listed on the related aibtc.com bounty board.** [^21^][^22^][^23^][^24^][^25^]
- Source: https://www.stacks.co/blog/stacks-2025-in-review-becoming-the-default-bitcoin-layer (2026-03-05) · Excerpt: "Leo, Welsh, and other communities collaborated with Tenero, Skullcoin, DeOrganized Media, and Zero Authority, which took a leading role as a reputation and bounty platform for contributors."
- Source: https://blog.zeroauthority.xyz/archive · Excerpt: "BEYOND HODLING — Zero Authority Series | 1 July 2026 — Jul 3 • Zero Authority DAO … © 2026 Zero Authority DAO LLC". (Archive API search for "xtrata": zero posts.)
- Source: https://chronosagora.com/funding/projects · Excerpt: "Zero Authority - Nova AI — Community — Funding: $5,000 — Zero Authority DAO is a community-driven protocol that helps people discover, fund, and build on Bitcoin L2 through gigs, bounties, and open collaboration." (No Xtrata grant listed.)
- Source: https://github.com/zeroauthority-dao · Excerpt: org hosts `aibtcdev-backend`, `aibtcdev-frontend`, `agent-tools-ts`, `Zero-Authority-MCP`, `Nova-MCP`, `mission` — ties Zero Authority DAO to the aibtcdev/AIBTC agent economy. [^25^]
- Source: https://aibtc.com/api/bounties (all statuses checked 2026-07-21): no Xtrata masterpiece bounty present. [^24^]
- Confidence: High on each fact; the Xtrata×ZAD bounty therefore appears to be a direct sponsorship arrangement, announced but not yet formally opened.

---

## 4. On-chain activity (all read live from chain, 2026-07-21)

**Claim: Contract lineage & launch timeline (mainnet): v1-1-0 deployed 2026-01-27 by SPD60…HYXE (5 inscriptions); v1-1-1 on 2026-01-27 (38 inscriptions); v2-1-0 on 2026-02-07 (359 inscriptions); arcade-scores-v1-1 on 2026-02-19; market contracts USDCx/sBTC on 2026-03-08 and STX shortly after; current core v3-2-3 on 2026-06-08; drops-v1-0 on 2026-07-11.** [^6^][^26^]
- Source: Hiro API `/extended/v1/contract/{id}` block heights + `/extended/v1/block/by_height` timestamps; `get-last-token-id` call-reads. Excerpts: v1-1-1 last-id 38; v2-1-0 last-id 359; v3-2-3 last-id 2807.
- Confidence: High.

**Claim: Total inscriptions ≈ 3,209 across versions, with 2,807 on the current v3-2-3 contract (≈65/day since its 2026-06-08 deployment). The Xplorer confirms "2807 inscriptions available" (176 pages). Content spans images, HTML apps, plain text, code, and audio; Xtrata's own indexer reports 2,696 synced, with 4 audio and 23 HTML "playable" items (many small test/"dud" inscriptions exist).** [^26^][^27^]
- Source: https://xtrata.xyz/xplorer ("2807 inscriptions available · Page 176/176"); https://xtrata.xyz/index/playable?contract=…v3-2-3 → `{"audio":[312,315,1097,1099],"html":[4,319,577,…],"duds":[…],"mintedCount":2696,"syncedCount":2696}`.
- Confidence: High.

**Claim: Usage is still predominantly team/insider-driven. Sampling v3 creators: #1/#2 = deployer; #100 = dyle.btc; #2800/#2807 = jim.btc; large mid-range runs (#500, #1500, #2000, #2500) were minted via a contract principal (batch/collection or drops mints). jim.btc's wallet alone received 103 v3 + 73 v2 inscriptions.** [^7^][^28^]
- Source: `get-inscription-creator` call-reads; Hiro NFT holdings for SP10W2…
- Confidence: High on data; Medium on interpretation.

**Claim: Market traction is minimal: lifetime listings = 6 (STX market), 1 (sBTC), 0 (USDCx); the market page currently shows "no live listings right now — list one from My Wallet." Historical asks were 10–13 STX on v2 items; no secondary sales visible on Gamma ("This item has never been sold before").** [^29^][^19^]
- Source: https://xtrata.xyz/market (2026-07-21); `get-last-listing-id` on xtrata-market-stx-v1-0 (6), xtrata-market-usdc-v1-0 (0), xtrata-market-sbtc-v1-0 (1); `get-listing` reads: ids 2–6 = tokens #149/#156/#102/#110/#113 at 10/10/11/12/13 STX (id 1 cancelled/none). The STX market charges a fee (`set-fee-bps`, `buy`, `cancel`, `list-token`).
- Confidence: High.

**Claim: Drops (sponsored free claims) are real and recent: 32 drop campaigns created since the drops contract deployed 2026-07-11; claims are sponsored so claimers need zero STX; the drops escrow currently holds 0 v3 NFTs (campaigns claimed or emptied). A sponsor relayer backend exists (`/sponsor/quote`, `/sponsor/drop-policy`).** [^30^]
- Source: `get-last-drop-id` on xtrata-drops-v1-0 = 32; Hiro NFT holdings of the drops contract = 0; xtrata.xyz/drops copy: "Claim free inscriptions — no STX needed. The creator has prepaid the network fee."
- Confidence: High.

**Claim: Monetization is fee-based (no token): v3 fees are 0.1 STX per begin/seal/upload-batch op, 0.01 STX single-tx mint, 0.001 STX per upload chunk; royalty/fee recipient = the deployer address, whose lifetime STX received is ~501 STX (~a few hundred USD) — an upper bound on protocol fee revenue. A third-party v2 mint on Gamma cost 0.8 STX (earlier fee schedule).** [^31^][^6^][^19^]
- Source: call-reads `get-fee-unit`=100,000 µSTX, `get-single-tx-fee-unit`=10,000, `get-upload-chunk-fee-unit`=1,000, `get-royalty-recipient`=deployer contract principal.
- Confidence: High.

**Claim: No Xtrata token, no fundraising/investor announcements, no DeGrants listing, no public roadmap beyond shipped features and the pending bounty launch. Docs posture is "infrastructure + SDK + agent" oriented.** [^32^][^22^]
- Source: searches across repo docs (`documentation-index.md`, handbook, contract inventory), funding lists, and web. SDK packages `@xtrata/sdk` and `@xtrata/reconstruction` exist as workspace packages v0.1.0 (not yet published releases). Docs include "Train agents — AI-agent training docs" and `XTRATA_AGENT_SKILL.md`.
- Confidence: High (negative result).

---

## 5. "Xtrata Radio" → **XTRATA FM** (live product)

**Claim: Xtrata's radio product is "XTRATA FM" — a persistent radio widget on every xtrata.xyz page that streams songs inscribed on-chain ("EVERY SONG INSCRIBED FOREVER", "BROADCASTING FROM THE BLOCKCHAIN", "THIS RADIO HAS NO PLAYLIST SERVER", "♪ MUSIC LIVE FROM THE CHAIN"). It received a dedicated engineering push in July 2026 (PR #204 "feat(radio): photoreal receiver faceplate + playback reliability fixes", merged Jul 4). The on-chain playlist currently corresponds to the 4 audio inscriptions (#312, #315, #1097, #1099) plus playable HTML music apps.** [^10^][^33^][^27^]
- Source: xtrata.xyz (widget with ⏮ ▶ ⏭ controls, "/radio-face…" artwork, taglines in the JS bundle); https://github.com/stxtrata/xtrata/pull/204 (2026-07-04).
- Confidence: High.

---

## Traction snapshot — demonstrably live vs aspirational

**Demonstrably live (verified on-chain or in-app today):**
- Full inscription pipeline (chunked uploads up to 16 KB/chunk, single-tx mints, parent/child + dependency links, reply threads) across 4 deployed core contracts; 2,807 v3 inscriptions.
- Xplorer, Inscribe page, Inscription Wizard, Manifest Studio, Opus audio tool, Artist portal, Workspace, v3 migration tool.
- XTRATA FM radio streaming on-chain audio.
- Drops: 32 sponsored campaigns since 2026-07-11; sponsor relayer backend live.
- Market contracts deployed for STX/sBTC/USDCx with escrow listing logic.
- SDK source + extensive docs + AI-agent skill files; indexer backend.
- xtrata.btc BNS identity; Gamma indexing of v2.

**Live but embryonic:**
- Community: 117 X followers; no Discord/Telegram; zero live market listings; market lifetime volume ≤ ~66 STX of asks; fee revenue ≤ ~501 STX lifetime; most content minted by team wallets.
- SDK published packages (workspace v0.1.0 only, no release).
- Third-party usage: a handful of external creators visible (e.g. "stacksboard" app #394 by an unrelated address).

**Aspirational / not yet launched:**
- The 200 STX Zero Authority DAO bounty (page live; official bounty URL placeholder; deadline TBA; no entries yet).
- Marketplace liquidity, collection launchpad adoption ("Launch a collection" guides exist; no external collection found), agent-economy integrations (AI skills docs, but the account's AIBTC agent "Huge Sphinx" has been idle since 2026-04-22).
- Any token, DAO, or fundraise.

## Ecosystem relationships
- **Jim Crane / jim.btc (Audionals, This Is #1)** — founder figure; Xtrata is effectively the Stacks L2 continuation of his Audionals on-chain-music work (XTRATA FM, Opus tooling, "jim-music" gallery). [^7^][^11^]
- **Zero Authority DAO** — bounty sponsor/partner ("Sponsored by ZERO AUTHORITY DAO"); ZAD is the Stacks reputation/bounty platform tied to the aibtcdev/AIBTC circle. [^20^][^21^]
- **AIBTC / aibtcdev agent network** — @XtrataLayers registered as agent "Huge Sphinx"; jim.btc wallet holds aibtcdev airdrop NFTs; Zero Authority's GitHub org hosts aibtcdev code. [^16^][^7^][^25^]
- **Stacks / Hiro / BNS** — infrastructure: SIP-009 NFTs, BNS identities (xtrata.btc, jim.btc, dyle.btc), sBTC + USDCx settlement, Stacks "settles with Bitcoin finality" marketing. [^4^][^6^]
- **Gamma.io** — indexes Xtrata v2 as a standard SIP-009 collection; Jim's Audionals tracks historically hosted on Gamma. [^19^][^13^]
- **Leather wallet / Stacks media** — prior coverage of Jim's Audionals work (Leather guide, Leather Lounge Ep. 11, Stacks YouTube "Bitcoin Unleashed"). [^11^][^13^]
- **Stacks NFT creator scene** — jim.btc wallet is an OG collector (Boomboxes, Crash Punks, Bitcoin Monkeys, Stacks Parrots, Melophonic, built-on-bitcoin podcast), consistent with deep scene ties; aixbt.tech tracks the project. [^7^][^18^]

---

## Citations
[^1^] https://github.com/stxtrata/xtrata — repo page (commits, branches, contributors, README, folders), checked 2026-07-21.
[^2^] https://github.com/stxtrata — account overview (1,557 contributions; 284 commits July 2026), checked 2026-07-21.
[^3^] https://github.com/shubh2294 — Shubham Mishra profile (0 contributions last year), checked 2026-07-21.
[^4^] Hiro API `POST /v2/contracts/call-read/SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF/BNS-V2/get-bns-from-id` → "xtrata.btc"; `/extended/v1/address/SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X/balances`, checked 2026-07-21.
[^5^] Hiro API `/extended/v1/tx/0x3cb9f350350f61799992d5972ce5e4db734402790d67803e95ff09cb717f883c` — BNS transfer SPD60…→SP3J…, 2026-01-27.
[^6^] Hiro API `/extended/v1/contract/{…}` and `/extended/v1/block/by_height/{h}` — deploy dates: v1-1-0 2026-01-27; v1-1-1 2026-01-27; v2-1-0 2026-02-07; arcade 2026-02-19; markets 2026-03-08+; v3-2-3 2026-06-08; drops 2026-07-11.
[^7^] BNS-V2 `get-id-from-bns`/`get-owner` (jim.btc → hash160 41c139d4…b518); Hiro `/extended/v1/address/SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7/balances` (STX, thisisnumberone-v2 ×116, boom ×87, aibtcdev-airdrop-2, xtrata v1/v2/v3 holdings), checked 2026-07-21.
[^8^] xtrata.xyz app bundle `/assets/main-BuSmoc1z.js` — drops config: `creator: "SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7"`, contracts `xtrata-v1-1-1/v2-1-0/v3-2-3/drops-v1-0` under SP3JNSEX…, fetched 2026-07-21.
[^9^] Hiro call-reads on `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`: `get-owner(2807)`, `get-inscription-creator` samples; BNS-V2 owner of dyle.btc (3b07c532…b484).
[^10^] https://xtrata.xyz — homepage (flagship galleries jim-music #1107, dyle.btc #296, stacksboard #394; XTRATA FM widget; bounty banner), checked 2026-07-21.
[^11^] https://app.leather.io/support/guide/what-are-audionals — "Jim.btc … mastermind behind Audionals" (2025-08-28).
[^12^] https://audionals.com/web3/key-figures — "Jim.btc (Jim Crane), Founder of Audionals".
[^13^] https://audionals.com/audionals/the-audionals-show — Jim Crane bio: UK first Bitcoin ATM 2014, This Is #1 co-founder, @jimdotbtc.
[^14^] Hiro call-reads `xtrata-market-stx-v1-0.get-listing` ids 1–6 (seller 3b07c532… = dyle.btc; 10–13 STX; tokens on xtrata-v2-1-0).
[^15^] https://x.com/XtrataLayers — bio, joined Jan 2026, 370 posts, 117 followers, checked 2026-07-21.
[^16^] https://aibtc.com/agents — "Huge Sphinx @XtrataLayers … 12,028 sats … Apr 9, 2026 … Apr 22, 2026".
[^17^] Grep of xtrata.xyz HTML + full JS bundle for discord/telegram/invite links: no matches; footer shows only "Xtrata on X" (x.com/XtrataLayers).
[^18^] https://aixbt.tech/projects/Xtrata-69cbe7e162fd35aabfaf2e0a — project mindshare page.
[^19^] https://stacks.gamma.io/collections/SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0/270 — "Minted for 0.8 STX … never been sold".
[^20^] https://xtrata.xyz/masterpiece — bounty page incl. placeholder "Add the official Zero Authority bounty URL in CONFIG before launch", checked 2026-07-21.
[^21^] https://www.stacks.co/blog/stacks-2025-in-review-becoming-the-default-bitcoin-layer — Zero Authority "reputation and bounty platform" (2026-03-05).
[^22^] https://blog.zeroauthority.xyz/archive (+ `/api/v1/archive`) — Substack activity, "© 2026 Zero Authority DAO LLC"; no Xtrata posts.
[^23^] https://chronosagora.com/funding/projects — DeGrants "Zero Authority - Nova AI — $5,000"; no Xtrata entry.
[^24^] https://aibtc.com/api/bounties (statuses open/judging/winner-announced/paid/abandoned/cancelled) — no Xtrata masterpiece bounty, checked 2026-07-21.
[^25^] https://github.com/zeroauthority-dao — org repos incl. aibtcdev-backend, Zero-Authority-MCP, Nova-MCP.
[^26^] Hiro call-reads `get-last-token-id`: v1-1-0=5, v1-1-1=38, v2-1-0=359, v3-2-3=2807, checked 2026-07-21.
[^27^] https://xtrata.xyz/index/playable?contract=SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 — indexer stats (audio/html/duds; mintedCount 2696).
[^28^] Hiro call-read `get-inscription-creator` for v3 ids {1,2,100,394,500,1107,1500,2000,2500,2800,2807}.
[^29^] https://xtrata.xyz/market — "no live listings right now"; `get-last-listing-id` reads (STX=6, USDC=0, sBTC=1).
[^30^] Hiro call-read `xtrata-drops-v1-0.get-last-drop-id`=32; drops-contract NFT holdings=0; https://xtrata.xyz/drops copy.
[^31^] Hiro call-reads v3-2-3 fee getters (0.1/0.01/0.001 STX) and `get-royalty-recipient`.
[^32^] https://github.com/stxtrata/xtrata/blob/main-staging/xtrata-1.0/docs/documentation-index.md — docs/SDK map (@xtrata/sdk, @xtrata/reconstruction v0.1.0; agent skill docs).
[^33^] https://github.com/stxtrata/xtrata/pull/204 — "feat(radio): photoreal receiver faceplate + playback reliability fixes" (2026-07-04).
