# Forever Twins — Campaign Plan

**Making Bitcoin Pepes permanent on Xtrata, and turning that into the standard every collection follows.**

Prepared June 14, 2026 · Flagship collection: Bitcoin Pepes · Protocol: Xtrata (Stacks / Bitcoin L2)

---

## 1. The one-sentence pitch

> Your NFT is a pointer to a file that will eventually rot. Xtrata mints a **forever twin** — a permanent, on-chain copy bound 1:1 to your original — so the art survives even when the link dies. Bitcoin Pepes is the first collection to do it.

The whole campaign hangs on a single, emotionally legible idea: **the art you own is one expired invoice away from disappearing, and there is finally a way to fix it without re-minting, migrating, or trusting a startup to keep paying a hosting bill.**

---

## 2. Why this campaign can win right now (the market backdrop)

Two research reports in hand establish that link rot is not a fringe worry — it is a measured, mainstream failure mode that the market has personally felt. The campaign's credibility comes from leading with these facts, not from hype.

**The scale of the problem is documented, not speculative.**

- A scan of ~498,000 NFTs found roughly **1 in 5 (about 20%) already broken** — dead `tokenURI`s, broken image paths, or IPFS links that no longer resolve.
- Independent scans of 400,000+ NFTs corroborate the ~20% figure; even newer enterprise chains like Hedera showed ~7.6% already erroring.
- Of the **top 1,000 collections by volume**, only 327 (~32%) even use IPFS, 277 (~27%) sit entirely on centralized servers, and **98 already point at URLs that no longer exist.** Blue-chip status is no protection.

**The failures are famous, recent, and visceral.** These are the "remember when…" anchors that make the abstract concrete:

- **FTX / Coachella** — ~$1.5M of lifetime-pass NFTs went to blank gray boxes the moment the FTX.us domain was redirected to a bankruptcy page. On-chain ownership intact; the thing you owned, gone.
- **nft.storage Classic** (decommissioned mid-2024, frontend carnage by late 2025) — data was *cryptographically safe on Filecoin*, but millions of contracts hardcoded the dead `nftstorage.link` gateway, so the art vanished from wallets anyway. The cruel-paradox story.
- **CloneX / RTFKT (Nike)** — ~19,000 NFTs replaced with a Cloudflare "terms of service violation" message in April 2025 after a downgrade to a free plan. Even Nike-backed art is hostage to a billing tier.
- **Infura gateway deprecation (Aug 2022)** — thousands of tokens bricked overnight because the gateway URL was baked into immutable contracts.

**The market timing is sharp.** Binance has announced its NFT marketplace shutdown finalizing **mid-2026** — right now — forcibly orphaning tokens that lean on Binance's proprietary servers. KnownOrigin's server shutdown has preservationists scrambling for private keys. The "wave of orphans" the reports predicted is arriving on schedule. **We are launching into the news cycle, not ahead of it.**

**The competitive gap we exploit:** Every existing solution is a *backup* tool (ClubNFT, Brave pinning, alwaysNFT, Filebase). They keep a copy of the data alive — but the original token's immutable pointer still blindly seeks the rotted CID. As the report states plainly: moving data to Arweave "does absolutely nothing to fix the original token's immutable pointer." **Backups treat the symptom. Xtrata's forever twin gives the holder a second, permanent token they actually own — one that doesn't depend on anyone continuing to pay a pinning bill.** That's the wedge.

---

## 3. What we're actually shipping (the mechanic, in plain language)

This section is the campaign's spine — every piece of content must be able to explain it in under 30 seconds, because the model is genuinely novel and the novelty is the story.

**Verified on-chain (contract `SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-4ever-fakfun`):**

- The contract is bound to two real collections: `SOURCE` = the original `SP16SRR777TVB1WS5XSS9QT3YEZEC9JQFKYZENRAJ.bitcoin-pepe`, and `MASTER` = `xtrata-v3-2-3`, the Xtrata permanence layer that holds the canonical, on-chain copy.
- **You `inscribe` your Pepe → a forever twin is created and bound to it 1:1.** A `CanonicalHash` (a 32-byte fingerprint of the true artwork) is recorded for each token and can be **finalized** — after `finalize-canonical`, the canonical record is locked and cannot be altered by anyone, including the contract owner. That finalization is the "forever" guarantee, and it should be treated as a headline event (see §6).
- **One twin is always escrowed in the contract.** At any moment you hold exactly one of the pair and the contract locks the other. `swap-pepe-for-xtrata` takes your Pepe in and releases the Xtrata twin (only possible while the twin is escrowed); `swap-xtrata-for-pepe` does the reverse. They can never both be loose, and they can never be separated — **the pair moves as one economic unit.** This is exactly the model that makes it safe to repoint an existing collection: nothing about the original is destroyed, holders gain a permanent counterpart, and the two are mechanically inseparable.

**The pricing mechanic is a built-in campaign engine:**

- **The first 87 inscriptions are free** (`free-threshold` = 87; while `inscribed-count` < 87, the fee is `u0`). This is our scarcity/urgency lever — a literal countdown.
- After that, **3 STX** per inscription (`inscribe-fee` = 3,000,000 µSTX), with optional per-wallet discounts the team can grant (allowlists, OG holders, partner collections).
- Fees split between two payout addresses — useful for a transparent "where the money goes" / treasury story if we want one.

**Talking points we must keep honest (the report demands it, and credibility is the moat):**

- The forever twin's permanence comes from the **finalized canonical record on Xtrata**, not from a promise to keep paying a host. That's the differentiator — say it precisely.
- The model requires trust in the canonical seed being correct *before* finalization; once finalized it's immutable. Be transparent that the seeding/finalize step is the trust moment, and show it happening publicly.
- We are not claiming the original Pepe IPFS art is "fixed" in place — we're giving it a permanent, owned twin. Precision here is what separates us from the "just pin it" crowd.

---

## 4. Positioning & messaging architecture

**Master narrative:** *Ownership without permanence is a rental with extra steps. Forever twins make Web3 ownership finally mean what everyone always claimed it meant.*

**Three message tracks, one per audience (sequenced per §5):**

| Audience | Core message | Proof we lead with | Primary CTA |
|---|---|---|---|
| **Bitcoin Pepes holders** (flagship/ignition) | "Your Pepe is iconic. Make it permanent before twin #87 is gone." | Free-87 countdown; the swap demo; finalize event | Inscribe your twin |
| **Stacks / Ordinals community** (amplification) | "Bitcoin gets permanence right. Here's the first collection proving it on Stacks." | Pepes as live case study; on-chain verifiability | Follow / verify the contract / collect |
| **Other NFT founders** (conversion to standard) | "You can repoint your existing collection without re-minting or migrating. The Pepes did it — here's the playbook." | The mechanic + the Pepes result | Book a repointing consult / read the integration guide |

**Taglines to test (A/B in ads and pinned posts):**

- *"Forever, or it doesn't count."*
- *"The twin that can't die."*
- *"Your art shouldn't depend on someone's AWS bill."*
- *"One link away from gone. Unless it's inscribed."*
- *"Pin it and pray, or inscribe it and forget."*

**Words we own:** *forever twin · inscribe · canonical · repoint · link rot · the 20%.* Repeat them until they're ours.

---

## 5. Phased rollout (sequenced: ignite the Pepes, then scale the protocol)

### Phase 0 — Pre-launch (Week 0, "the receipts") 
Build the credibility substrate before any sell. Goal: make link rot undeniable and Xtrata the obvious answer.

- Publish the **"State of Link Rot 2026"** content piece (the §2 facts, sourced) as the anchor asset. Everything else links back to it.
- Ship a **public contract verification page**: anyone can paste a Pepe ID and see its binding, canonical hash, and escrow state. Verifiability *is* the marketing.
- Seed and **publicly finalize the canonical hashes** on a livestream / Space — turn the trust moment into a transparency flex.
- Line up 3–5 Stacks/Ordinals KOLs and 1–2 crypto-media contacts under embargo, hooked on the Binance-shutdown timing.

### Phase 1 — Ignition: the Free 87 (Weeks 1–2)
Flagship push to Pepe holders. The free tier is the entire engine — urgency is real and on-chain.

- Launch with a **live inscription counter** ("X of 87 forever twins claimed"). Countdown scarcity, verifiable, no fake numbers.
- Daily holder-targeted posts; a 60-second **"inscribe + swap" screen-recording** as the hero creative (show the twin appearing and the pair swapping — the "aha").
- Discord/X "first 87" leaderboard; early inscribers get an OG role and a public shout-out. Make claiming a status move.
- Hold a few twins from the 87 for KOLs/partners so influential wallets are visibly in.

### Phase 2 — Amplification: the Pepes as proof (Weeks 3–6)
Now broaden to the Stacks/Ordinals community with the Pepes as a *finished, verifiable* case study, not a promise.

- Publish the **flagship case study**: "How Bitcoin Pepes became the first collection to go forever" — mechanic, before/after, on-chain links.
- "Verify it yourself" campaign — lean into Bitcoin-native culture's trust-minimized ethos. Every claim has a contract call behind it.
- Threads dissecting each famous failure (FTX, nft.storage, CloneX) ending with "here's what forever would have done instead."
- Begin paid 3-STX inscriptions; introduce **discount allowlists** for partner communities to seed cross-collection word of mouth.

### Phase 3 — Conversion: the standard (Weeks 6–12+)
Turn proof into adoption by other projects. This is where the business actually scales.

- Release the **"Repoint Your Collection" playbook** + integration guide for founders (how the twin model maps onto any existing Stacks collection).
- Direct outreach to 10–20 at-risk collections (those reports flag: centralized-server and dead-gateway collections) with a free audit: "here's your link-rot exposure, here's the fix."
- "Powered by Xtrata Forever" badge/program — social proof flywheel as collections adopt.
- Position Xtrata at Bitcoin/Stacks events and on podcasts as *the permanence layer*, with the Pepes as the reference customer everyone cites.

---

## 6. Tentpole moments (things worth a coordinated push)

1. **The Finalize** — the public moment canonical hashes lock forever. Frame as "the Pepes just became un-deletable." Livestream it.
2. **Twin #87 claimed** — the free tier sells out. Pre-write the "free era is over, here's what's next" announcement.
3. **First outside collection repoints** — proof the model generalizes. Co-marketed case study.
4. **A real-time link-rot incident** — when the next FTX/nft.storage-style break hits the news (Binance mid-2026 is the obvious candidate), have a rapid-response post ready: *"This is exactly what forever twins prevent."* Newsjacking, pre-loaded.

---

## 7. Channel plan

- **X (primary)** — daily during Phases 1–2; threads, the hero video, the live counter, KOL quote-tweets. Bitcoin/Stacks NFT discourse lives here.
- **Discord** — holder activation, leaderboard, OG roles, founder-to-founder repointing conversations.
- **Long-form** (Mirror / project blog) — the State of Link Rot piece, the case study, the founder playbook. These are the durable, search-and-share assets.
- **Crypto media / newsletters** — pitch the Binance-timing angle and the "first collection to go forever" story; the data does the convincing.
- **Spaces / podcasts** — the Finalize event, plus founder-focused appearances in Phase 3.
- **Stacks/Ordinals-native surfaces** — marketplaces, ecosystem aggregators, and community calls where the trust-minimized framing lands hardest.

---

## 8. Content checklist (production backlog)

**Evergreen / anchor**
- [ ] "State of Link Rot 2026" report (sourced from the two research docs)
- [ ] Bitcoin Pepes forever case study
- [ ] "Repoint Your Collection" founder playbook + integration guide
- [ ] Public contract-verification page + live inscription counter

**Social / short-form**
- [ ] 60-sec "inscribe + swap" hero video
- [ ] Explainer carousel: "What's a forever twin?" (the §3 mechanic in 5 cards)
- [ ] Failure-autopsy thread series (FTX, nft.storage, CloneX, Infura)
- [ ] "Verify it yourself" how-to thread
- [ ] Free-87 countdown graphics (daily)

**Ops / rapid-response**
- [ ] Pre-written newsjack post for the next public link-rot break
- [ ] "Twin #87 claimed" announcement (pre-drafted)
- [ ] Finalize-event livestream run-of-show

---

## 9. Metrics

**Phase 1 (ignition):** all 87 free twins inscribed; inscription-video views; Discord OG claims; counter-page traffic.

**Phase 2 (amplification):** paid (3-STX) inscription count and STX volume; case-study reach; "verify it yourself" engagement; share of voice in Stacks/Ordinals discourse.

**Phase 3 (standard):** # of outside collections in audit pipeline → # repointed; "Powered by Xtrata Forever" adopters; inbound founder requests; media placements.

**North-star:** total forever twins inscribed across all collections, and number of collections repointed. Everything else is a leading indicator of those two.

---

## 10. Risks & honest guardrails

- **Don't overclaim.** Permanence = the finalized canonical record on Xtrata, not the original IPFS art being repaired in place. Saying it precisely is what beats the "just pin it" competitors on trust.
- **The trust moment is finalization.** Be loud and public about seeding + finalizing so no one can claim a rug. Verifiability is the whole brand.
- **"Why two tokens?" confusion** is the #1 objection. The hero video and the 5-card explainer exist specifically to kill it: one pair, mechanically inseparable, one always escrowed, you always hold one.
- **Free-87 mercenaries.** Some free claimers won't stick — fine. The 87 exist to manufacture the case study and the countdown, not revenue. Measure them as awareness, not conversion.
- **Regulatory tone.** Keep messaging about *permanence and ownership*, not price/return. No financial promises.

---

### Appendix — source anchors

- Contracts: original `SP16SRR777TVB1WS5XSS9QT3YEZEC9JQFKYZENRAJ.bitcoin-pepe`; forever `SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-4ever-fakfun`; Xtrata master `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`.
- Mechanic verified from on-chain contract source (inscribe / swap escrow / canonical-hash finalize / free-87 + 3-STX fee).
- Statistics and failure cases drawn from the two research reports in *Research/IPFS and Link Rot/* (AlwaysNFT ~498k scan, Pinata top-1000 study, Hedera scans, FTX/Coachella, nft.storage Classic, CloneX/RTFKT, Infura, Binance 2026 shutdown).
