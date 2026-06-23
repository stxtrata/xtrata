# Xtrata × Stacks: Pruning, MARF, SIPs & State-Growth Risk Assessment

**Prepared for:** Xtrata (Jim)
**Date:** 23 June 2026
**Scope:** Whether Xtrata's on-chain data is exposed to Stacks chain-state pruning, SIP changes, cost/limit changes, API/indexer changes, or governance/ecosystem pushback — and what to do about it.
**Method:** Primary-source review of Stacks SIPs, the active SIP-042 / chain-state-pruning workstream, stacks-core engineering issues, core-dev forum threads, leadership roadmap statements, and a direct read of Xtrata's live Clarity contracts and reconstruction spec.

> **Important note on confidence.** This report is grounded in primary sources (linked throughout) that are current as of June 2026, including an actively-moving consensus change (SIP-042, "Activation-In-Progress"). Consensus rules, exact block limits, and timelines can change. Where something is inference rather than a documented fact, it is labelled as such.

---

## 1. Executive summary

**Blunt answer: this is a *real but manageable* risk, and the specific fear in the quote — "It lives in the MARF, Stacks can prune us easily, one SIP and it's out" — is *mostly the wrong way round* for Xtrata's current architecture.**

Three findings drive everything below:

1. **Stacks *is* actively building chain-state pruning right now.** It is not hypothetical. Mainnet chainstate is ~1 TB, ~95% of it historical MARF data, growing ~2.73 GB/day, and accelerating since Nakamoto. SIP-042 (*Removal of `at-block`*) is **Activation-In-Progress**, targeted at **Epoch 3.4**, and stacks-core issue #6953 ("feat: pruned nodes") tracks the implementation. This is the single most important fact for Xtrata.

2. **But pruning is explicitly designed to *not* delete the things Xtrata depends on.** The pruning design (#6953) *squashes historical MARF tries* below a snapshot height while it **preserves (a) current/latest contract state and (b) full block data.** Xtrata stores sealed inscription bytes in **current contract state** (a `Chunks` map of `(buff 16384)` values) and **does not use `at-block` anywhere**. So the mechanism people fear (pruning removes historical state, gated on `at-block`) does not touch Xtrata's data. Your sealed chunks are in the part that survives.

3. **The *real* risk is the inverse of the stated one.** Because Xtrata writes large blobs into *current* state, it becomes **permanent, un-prunable weight** — exactly the kind of state growth the core team is spending 2026 trying to relieve. The threat is therefore **not deletion**; it is **future cost/limit/economic changes and social/governance pushback** aimed at data-heavy contracts, plus **availability fragility in the read/indexer layer** (you already hit public-node `read_length` budgets on large reconstructions). That is a positioning and engineering problem, not an existential one.

**Net assessment by layer:**

| Concern | Verdict |
|---|---|
| "Pruning will delete Xtrata's sealed inscriptions" | **Mostly FUD** for current architecture (data is in current state + block data, both preserved). |
| "A SIP like SIP-042 breaks Xtrata" | **Low** — Xtrata uses no `at-block`; not in the 124-contract impact list. |
| "Xtrata creates un-prunable state growth that invites future limits/fees/pushback" | **Real, medium** — this is the legitimate core of the concern. |
| "Reconstruction depends on third-party APIs / hits node read budgets" | **Real, medium** — availability/usability risk, already partially mitigated. |
| "Storing bytes in events / historical state / at-block would be fragile" | **True in general — and Xtrata correctly avoids all three.** |

**Recommended stance: proceed, but reposition and harden.** Do not pivot the architecture wholesale — storing sealed records in *current* state is actually the *correct, pruning-resilient* choice. Instead: (1) stop framing Xtrata as cheap bulk storage; (2) formalise a content-addressed off-chain mirror + your own archive/gateway with on-chain hashes; (3) document that you don't use `at-block` and don't rely on historical reads; (4) engage the core team proactively as an aligned builder, not a chain-bloat outlier.

---

## Direct answers to your 10 specific questions

**1. Is it technically accurate to say Xtrata data "lives in the MARF" if bytes/chunks pass through contract calls?**
Partly, and the distinction matters. The MARF is an *authenticated index* over key/value state; the *values themselves* are stored in a separate data store the node keeps, keyed by hash (SIP-004). When Xtrata writes a chunk to the `Chunks` map, the bytes become **current contract state** that the node must retain as part of the latest materialized view, and the MARF indexes them. So "it lives in chain state that the MARF commits to" is accurate. But "it lives in the *historical* MARF that pruning targets" is **not** accurate — current state is not what gets squashed. If instead you only passed bytes as transaction *arguments* without storing them, they would live in **block data** (the transaction log), not in state — also retained, but only retrievable by scanning transactions, not by a state read.

**2. If Stacks introduces chain-state pruning, what exactly is likely to be pruned?**
Per stacks-core #6953: **historical MARF trie nodes below a snapshot height H are dropped ("MARF squashing"), while full block data and the current state are preserved**, and consensus root-hash behaviour above H stays correct. In plain terms: the chain forgets *old versions* of state (what a map contained 200k blocks ago), not the *current* value and not the raw transactions. The enabling change (SIP-042) is simply removing `at-block`, the only feature that forces nodes to keep all old versions.

**3. Could future pruning remove or make inaccessible Xtrata inscription data?**
For the **current architecture: no.** Sealed chunk bytes are current state; the latest value of every `Chunks` entry is retained through a squash, and raw block data is preserved regardless. The only way pruning could hurt you is if you *relied on reading historical state at old heights* (via `at-block`) — which you do not. The residual accessibility risk is in the **read path** (RPC/indexer availability and per-call read budgets), not in whether the bytes still exist on nodes.

**4. Is the risk different by storage method?** Yes — materially. Ranked safest → riskiest for *durability under pruning + protocol evolution*:

| Storage method | Pruning durability | Notes |
|---|---|---|
| Bytes in **current contract maps** (Xtrata today) | **Safest** vs pruning | Survives squash; but is permanent un-prunable weight + write-cost exposure. |
| **Hash/manifest in maps, bytes in an external archive** with on-chain hash | **Safest overall** | Minimal chain weight, deterministic verification, best political optics. Recommended primary pattern at scale. |
| Bytes in **token URI** (pointer to off-chain) | Safe | This is the SIP-009/SIP-016 norm; URI is a 256-char pointer, not the bytes. |
| Bytes in **transaction call data** only (not stored) | Bytes persist (block data preserved) but **not state-readable**; needs an indexer/archive to retrieve. | Acceptable only with a robust archive layer. |
| Bytes in **contract source code** | Persist as part of contract, but immutable, costly to deploy, and abuse-flavoured | Avoid for media. |
| Bytes in **many child inscriptions** | Same durability as parent map storage, **but multiplies state weight and call/indexer load** | Manage carefully; biggest political-optics risk. |
| Bytes in **events / `print` logs** | **Riskiest** | Events are **not** consensus state, not in the MARF, and carry **no protocol guarantee** of perpetual historical queryability. Never use as a system of record. |
| Bytes readable only via **historical `at-block`** | **Broken by SIP-042** | Do not build on this. |

**5. Safest architecture to survive pruning + protocol evolution?**
A **hash-anchored, content-addressed model**: keep the *canonical record* (owner, MIME, size, chunk count, rolling hash, manifest, dependency edges) in **current contract state**; keep **bytes either in current state for small/"forever" items or in a content-addressed archive (Arweave/IPFS/Xtrata gateway) referenced by on-chain hash** for large media; never depend on `at-block`, event history, or any single third-party API for reconstruction. You already do most of this (rolling SHA-256 chain hash, public read-only reconstruction, Arweave token URI). Section 7 makes it concrete.

**6. What should Xtrata avoid because it could become politically/technically indefensible?**
(a) Marketing Stacks as a cheap CDN / "dump big files on-chain because it's cheap." (b) Pushing *unbounded* media into *current* state with no off-chain mirror option. (c) Any reliance on `at-block` or deep historical reads. (d) Reliance on event logs as a system of record. (e) Designs that assume Hiro's public API/indexer will always serve unlimited historical data for free. (f) Recursive child-inscription graphs that multiply per-token state and indexer load without bounds.

**7. What would a core dev or grant reviewer object to?**
"You are deliberately writing large blobs into *current* state, which is exactly the un-prunable weight we're spending 2026 trying to reduce, and you're doing it because block writes are underpriced relative to their permanent cost to every node operator forever." That is the steel-man objection (Section 9). It is about **economics and node sustainability**, not about deletion.

**8. What aligns Xtrata with Stacks' scalability/decentralisation goals?**
You don't use `at-block`, so you impose **zero** historical-retention burden — you are *already compatible with pruned nodes*. Your canonical records are compact; bytes are content-addressed and verifiable off-chain; you run (or will run) your own archive/gateway so you don't externalise availability costs onto Hiro or hobbyist node operators. You treat Stacks as **settlement / source-of-truth for provenance and integrity**, not as bulk storage. (Section 6 gives the language.)

**9. Questions to ask leadership/core devs?** See Section 8 — framed collaboratively around pruning compatibility, write-cost roadmap, and node-sustainability expectations for data-heavy contracts.

**10. SIPs to cite explicitly in docs/grants/whitepaper?**
SIP-004 (MARF / what state is), SIP-005 (blocks & transactions), SIP-002 + SIP-042 (`at-block` and its removal — to show you're unaffected), SIP-006 + SIP-012 (cost functions / block budget — to show you respect block economics), SIP-009 / SIP-016 / SIP-019 (NFT + off-chain metadata norms), SIP-021 (Nakamoto, why growth accelerated). Section 2 details each.

---

## 2. Relevant SIPs and roadmap items

> Source index: the canonical SIP list lives at [stacksgov/sips](https://github.com/stacksgov/sips). Status values are from that repo / the linked PRs as of June 2026.

### Directly load-bearing for Xtrata

**SIP-042 — Removal of `at-block`** · Status: **Activation-In-Progress** · Type: Consensus (hard fork), Epoch 3.4 · [PR #262](https://github.com/stacksgov/sips/pull/262) · Discussion: [forum thread](https://forum.stacks.org/t/chain-state-pruning-and-at-block-proposed-change/18685)
- **Key detail:** Removes the `at-block` built-in from all Clarity versions starting Epoch 3.4. New contracts referencing it fail static analysis; already-deployed contracts calling it fail at runtime (`AtBlockUnavailable`). Activates as a rider on SIP-039's voting procedure. Reference impl: [stacks-core PR #6937](https://github.com/stacks-network/stacks-core/pull/6937).
- **Why it matters:** This is "the one SIP" the concern alludes to. It removes the *only* mechanism that forces nodes to keep the full historical MARF, unlocking pruning. **Impact on Xtrata: none directly.** Xtrata's live contracts contain **zero** `at-block` calls, and Xtrata is **not** in the published list of 124 direct / 96 indirect affected contracts (all of which are DeFi/staking/governance: ALEX, Arkadiko, Velar, Zest, Granite, Bitflow, etc.).
- **Risk to Xtrata: LOW.** (It's arguably *good* for you — see Section 6.)

**stacks-core #6953 — "feat: pruned nodes"** · Status: New / tracked under "Stacks Core Eng" · [issue](https://github.com/stacks-network/stacks-core/issues/6953)
- **Key detail:** The implementation plan for pruned/snapshot nodes. Verbatim goals: *"squash MARF state at snapshot height H (drop historical trie nodes), preserve full block data (so nodes can still serve genesis-syncing peers), keep consensus root-hash behavior correct above H, support proof generation/verification on squashed state."*
- **Why it matters:** This is the authoritative statement of **what pruning keeps vs. drops.** It confirms current state and block data are preserved. **Cite this issue** in your docs — it is your strongest evidence that Xtrata's sealed data is not a pruning target.
- **Risk to Xtrata: LOW** (and clarifying).

**Chain-state pruning forum thread** (Alex Huth, Stacks Labs product lead; core devs Brice, Francesco) · [forum](https://forum.stacks.org/t/chain-state-pruning-and-at-block-proposed-change/18685)
- **Key detail:** Frames the whole effort. Confirms ~95% of chainstate is historical MARF, ~2.73 GB/day growth, Nakamoto as the accelerant. Proposes (initially) limiting `at-block` to a 6-cycle window, then escalates to full removal. Core dev (brice): "Other popular chains do not support this kind of thing, and it doesn't seem to be a necessary feature." Notes **archive nodes will remain** to serve full history / the API.
- **Why it matters:** Shows leadership intent and direction of travel: leaner nodes, fewer historical guarantees, archive nodes as an opt-in for those who need history. Also surfaces a node-operator question (Haddy) about whether signers/miners should be required to run full nodes and whether Governance CAB reviews this — relevant to your flare-up map.
- **Risk to Xtrata: LOW-MEDIUM** (directional signal you must align with).

### State, cost & limit foundations (cite to show fluency)

**SIP-004 — Cryptographic Commitment to Materialized Views (MARF)** · Ratified · [SIP-004](https://github.com/stacksgov/sips/blob/main/sips/sip-004/sip-004-materialized-view.md)
- Defines the MARF. Crucial line: the chain *"separates the concern of maintaining an authenticated index over data from storing a copy of the data itself … peers commit to the digest of the authenticated index, but can store the data however they want."* Leaves are *value hashes*; the value store is implementation-defined. Within a fork *"no data is ever removed"* (deletes are tombstones) — which is precisely why unbounded history became unsustainable and why squashing is now needed.
- **Why it matters to Xtrata:** This is the textbook you cite to explain *what "lives in the MARF" actually means* (an index over hashes), and to distinguish current-state values from historical tries.

**SIP-005 — Blocks, Transactions, and Accounts** · Ratified · [SIP-005](https://github.com/stacksgov/sips/blob/main/sips/sip-005/sip-005-blocks-and-transactions.md)
- Defines block/transaction structure and Clarity value serialization. Relevant for "raw transaction payload" durability (Layer A) and for byte-length cost accounting.

**SIP-002 — Clarity** · Ratified · [SIP-002](https://github.com/stacksgov/sips/blob/main/sips/sip-002/sip-002-smart-contract-language.md) — defines Clarity incl. the original unbounded `at-block`. SIP-042 amends it.

**SIP-006 — Clarity Cost Assessment** + **SIP-012 — Cost-Limits Network Upgrade** · Ratified · [SIP-012](https://github.com/stacksgov/sips/blob/main/sips/sip-012/sip-012-cost-limits-network-upgrade.md)
- **Key detail:** Every block has a 5-dimension execution budget. The SIP-012 (Stacks 2.05) mainnet limits:
  `write_length 15,000,000 (~15 MB)`, `write_count 15,000`, `read_length 100,000,000 (~100 MB)`, `read_count 15,000`, `runtime 5,000,000,000`.
  SIP-012 also moved storage cost accounting from *maximum* declared size to **actual byte length** for `map-set/insert/delete`, `var-set/get`, `concat`, and the `nft-*` ops — i.e. **writing a 16 KB chunk now costs ~16 KB of `write_length` budget**, dynamically. It also notes the **maximum size of a single Clarity value is ~2 MB**.
- **Why it matters to Xtrata:** This is the economic surface where your write-heavy and read-heavy patterns compete with all other network activity. Large inscriptions consume scarce, shared block budget; large reconstructions hit read budgets. If the core team wants to discourage state bloat, **this is the lever they'd pull** (raise write costs / add storage-specific pricing) — not deletion. Cite it to show you understand and respect block economics.

**SIP-021 — Nakamoto** · Ratified · [SIP-021](https://github.com/stacksgov/sips/blob/main/sips/sip-021/sip-021-nakamoto.md)
- **Why it matters:** Nakamoto's fast blocks (~5s vs ~10 min) are *the* reason MARF growth accelerated to ~2.73 GB/day, per core devs. It's the backdrop that made pruning urgent. Indirect to Xtrata, but explains the timing.

### Token / metadata / events standards (the off-chain norm)

**SIP-009 (NFT)**, **SIP-013 (SFT)**, **SIP-010 (FT)** · Ratified — Xtrata implements SIP-009 (`define-non-fungible-token xtrata-inscription uint`). The standard's `get-token-uri` returns a *pointer*, establishing that **content normally lives off-chain**.

**SIP-016 — Token Metadata** · Ratified · [SIP-016](https://github.com/stacksgov/sips/blob/main/sips/sip-016/sip-016-token-metadata.md) — Compliant contracts expose a resolvable **URI to off-chain metadata JSON** (image, media, attributes). The ecosystem default is on-chain pointer + off-chain content (e.g. Hiro's Token Metadata API scans the chain and caches metadata in its own DB). **This is the norm you cite to justify content-addressed off-chain mirrors as standard practice, not a hack.**

**SIP-019 — Token Metadata Update Notifications** · Ratified · [SIP-019](https://github.com/stacksgov/sips/blob/main/sips/sip-019/sip-019-token-metadata-update-notifications.md) — Uses `print` **events** to *notify indexers* to refresh metadata. Confirms events' role: **indexer signalling, not a system of record.**

### Roadmap / leadership posture

**Stacks R&D 2026 Lookahead** (Alex Miller, Stacks Labs CEO, Dec 2025) · [forum](https://forum.stacks.org/t/stacks-r-d-update-self-custodial-bitcoin-staking-and-beyond/18559)
- North Star: Stacks as **"Default Bitcoin Rails"** — self-custodial BTC staking, scalable trust-minimised **payments**, privacy, Bitcoin DeFi; explicit goals to **"reduce smart contract risk"** and enable "super scalable transactions."
- **Why it matters:** The stated 2026 vision is **financial throughput, not data storage.** Inscriptions/rich media are not part of the roadmap narrative, and "reduce node costs / scale transactions" is. Xtrata must position itself as *compatible with* (not a tax on) that throughput vision. (Inference: there is no published core-dev statement endorsing *or* banning large-data use; the directional signal is toward leaner state.)

---

## 3. Stacks data-retention model (plain English)

Think of a Stacks node as holding four different things, with very different durability guarantees:

**1. Block data (the transaction log) — Layer A.**
The raw blocks and the transactions inside them (including function arguments / payloads). This is what nodes replay to compute state. **Pruned nodes keep this** ("preserve full block data," #6953) so they can still bootstrap peers. Durability: **high.** *But:* retrieving a specific old byte-payload from block data requires an indexer/archive that parses transactions — it is **not** a Clarity state read. Existence ≠ convenient retrieval.

**2. Current contract state — Layer B.**
The *latest* value of every data-var, map entry, NFT owner, and token balance. This is the live materialized view every validating node must have to check the next transaction. **This is never pruned** — a squash collapses history *into* the current snapshot at height H and keeps going. Durability: **highest.** This is where Xtrata's sealed chunks live.

**3. Historical contract state / old MARF versions — Layer C.**
What a map/var contained at some *past* block height. Today nodes keep all of it because `at-block` can reach any height. **This is the ~95% that pruning squashes away.** After SIP-042 + pruning, a pruned node can no longer answer "what did key K equal at height H<snapshot." Archive nodes can still answer it. Durability: **becoming optional (archive-only).**

**4. Events / `print` logs — Layer D.**
Side-effects emitted during execution and delivered to *event observers* (the node's event dispatcher → the Stacks API / indexers). **Events are not in the MARF, are not consensus state, and a node can run without an event observer at all.** They are recorded for indexers' convenience. There is **no protocol-level guarantee** that arbitrary historical events remain queryable forever the way state does. Durability: **weakest / indexer-dependent.**

**MARF, precisely.** The MARF (SIP-004) is an *authenticated index* — a forest of Merklized radix tries plus a skip-list — that lets a node prove "key K = value V at this chain tip." The **values** are stored separately, keyed by hash. Miners commit the MARF root in each block. So "lives in the MARF" really means "is part of committed key/value state." Pruning doesn't attack the *concept* of the MARF; it drops the *old trie versions* while keeping the *current* one and the proof machinery (squash-shunt proofs, #6953).

**Indexers / archive nodes / gateways — Layer E.**
- A **full archive node** keeps everything (all historical state). Post-pruning it becomes a deliberate, heavier configuration that someone must choose to run.
- **Hiro's public API / Token Metadata API** is a *centralised convenience*: it scans the chain into its own DB and serves REST queries, with its own rate limits and clamps. **Hiro is not a protocol guarantee.** Hiro even ships "Hiro Archive" snapshots so others can bootstrap their own indexers — an implicit acknowledgement that you should not assume their public endpoint is your permanent backend.
- A **gateway** (like Xtrata's `/runtime/content`) reads state via RPC and serves bytes over HTTP.

**What pruning would affect, in one line:** it removes the ability to *read old versions of state at past heights* on non-archive nodes. It does **not** remove current state or block data.

---

## 4. Xtrata-specific risk assessment by storage method

Grounded in the live contracts (`xtrata-v3.4.0.clar` et al.) and `docs/reconstruction-spec.md`.

**What Xtrata actually does today:**
- **Bytes:** stored in a current-state map `Chunks { context:(buff 32), creator:principal, index:uint } → (buff 16384)`. 16 KB chunks, up to 2,048 chunks / 32 MB per token (v3.1.1 adds 64 KB/128 KB profiles up to 256 MB).
- **Canonical record:** `InscriptionMeta` (mime, total-size, total-chunks, sealed, `final-hash`, creator), `TokenURIs (string-ascii 256)`, `HashToId (buff 32)→uint`, `InscriptionDependencies/Parents (list 50 uint)`, `MigrationSource`. All **current state**.
- **Integrity:** incremental **rolling SHA-256 chain hash** (`sha256(prev || chunk)`), content-addressed and independently verifiable.
- **Events:** only 3 informational `print`s (`inscription-sealed`, `upload-started`, `inscription-migrated`) — **not used to reconstruct bytes.**
- **`at-block`:** **none.**
- **Token URI:** points off-chain (the XTRATA collection URI resolves to **Arweave**).
- **Reconstruction:** public read-only calls (`get-inscription-meta`, `get-chunk-batch`, `get-chunk`) or direct map-entry reads; *"No privileged Xtrata API is required."*

| Storage method | In Xtrata? | Pruning durability | Other risk | Overall |
|---|---|---|---|---|
| **Current contract state** (chunks, meta, hashes, manifests) | Yes (primary) | **Preserved through squash** | Permanent un-prunable weight; write-cost & political exposure | **LOW durability risk / MEDIUM economic-political risk** |
| **Historical state / old MARF versions** | **Not relied on** | Squashed away | Would break a design that read past heights — Xtrata doesn't | **LOW** (you're clear) |
| **Transaction payloads** (Layer A) | Implicit (chunks arrive as args, then stored) | Block data preserved | Retrieval needs indexer if not also stored in state | **LOW** (you also store in state) |
| **Events / `print` logs** (Layer D) | Informational only | Weakest; indexer-dependent | Dangerous *if* used as record — you don't | **LOW** (correct usage) |
| **Token metadata / URIs** (SIP-016) | Yes (Arweave) | Pointer in state; content off-chain | Off-chain availability = your responsibility | **LOW-MEDIUM** |
| **Manifests / dependency graphs** | Yes (`Dependencies`/`Parents` maps + JSON manifests) | Current state preserved | Unbounded recursive graphs multiply state + indexer load | **MEDIUM** (bound traversal) |
| **Off-chain mirror + on-chain hash** | Partially (Arweave URI; rolling hash) | Best of both | Requires you to run/guarantee the mirror | **LOWEST overall — make this the default at scale** |
| **Archive-node / gateway model** | Yes (`/runtime/content`) | Depends on who runs it | Hits public-node `read_length` budgets; Hiro clamps | **MEDIUM** (run your own; see §7) |

**The one genuine technical sore point you already documented:** heavy read-only reconstruction (large `get-chunk-batch`, `get-inscription-summary`) can **exceed public-node `read_length` budgets even when the data is valid**, forcing your runtime to clamp to 30 chunks and fall back to direct map reads. That is the *availability/usability* edge of the risk — not pruning. It argues for your own archive/RPC + a content-addressed mirror so large media never depends on a single budget-limited public endpoint.

---

## 5. Potential flare-up points

| Who | The concern they'd raise | How to head it off |
|---|---|---|
| **Stacks core devs** (jcnelson/obycode/Brice/Francesco et al.) | "You write large blobs into *current* state — permanent weight on every node, the opposite of what pruning is trying to fix." | Lead with: zero `at-block`, pruned-node compatible, content-addressed off-chain mirror, your own archive. Show you cut, not add, marginal node burden. (§6, §9) |
| **Stacks Foundation / Governance CAB** | Is unbounded data storage aligned with the "Bitcoin rails / scalable payments" North Star and node decentralisation? Should data-heavy contracts face review? | Frame Xtrata as **provenance & settlement infrastructure**, not storage; commit publicly to off-chain mirrors for large media and to running your own infra. |
| **Grant reviewers** | "Is this a chain-bloat vector dressed up as infrastructure? Does it externalise costs onto node operators and Hiro?" | Quantify your *marginal* footprint, cite SIP-012 awareness, show the hash-anchored model and self-hosted archive. Avoid "cheap storage" language entirely. (§6) |
| **Node operators** | "Data-heavy contracts inflate the chainstate I pay to store; I want pruned nodes to stay cheap." | Emphasise you're already pruned-node-compatible and that your bytes are content-addressed/mirrorable; support running light against your gateway. |
| **App developers** | "If I depend on Xtrata, am I betting on a fragile read path / a single API?" | Publish the deterministic reconstruction spec (you have it), keep "no privileged API required," provide multiple resolvers. |
| **NFT / ordinals community** | "Is this just 'ordinals on Stacks' that congests blocks and competes for budget?" | Differentiate: canonical records + verifiable manifests + composability, not novelty JPEGs; respect block budget; throttle/queue large uploads. |
| **Marketplace / indexer operators (Hiro, Gamma)** | "Reconstructing your tokens blows our read budgets / storage." | Conform to an indexer/resolver standard (you have XIP-006), keep reads bounded, offer batch endpoints + your own archive snapshots à la Hiro Archive. |

---

## 6. Defensive positioning (recommended public language)

**The trap to avoid:** anything that sounds like *"Stacks is cheap on-chain storage, so we put big files on it."* That single sentence converts you from "aligned infra" to "chain-bloat threat" in a core dev's mind.

**Recommended framing — use these phrases:**

- **"Stacks as settlement and source-of-truth, not a CDN."** Xtrata uses Stacks for *canonical records, ownership, provenance, and cryptographic integrity* — not as a free content-delivery network.
- **"Content-addressed and deterministically reconstructable."** Every inscription is verified by an on-chain rolling hash; identical bytes verify identically anywhere; reconstruction follows a public spec with *no privileged Xtrata API required.*
- **"Compact canonical records; bytes are mirrorable."** The on-chain record (hashes, manifest, dependency edges, ownership) is small and permanent; large media can live in current state for small/"forever" items *or* in a content-addressed archive (Arweave/IPFS/Xtrata gateway) referenced by on-chain hash.
- **"Pruning-compatible by construction."** Xtrata uses **no `at-block`** and **no historical-state reads**, so it imposes **zero** historical-retention burden and is fully compatible with pruned/snapshot nodes (SIP-042 / #6953).
- **"We run our own archive & gateway."** Availability of bytes is Xtrata's responsibility, not Hiro's or hobbyist node operators'. Optional indexer/gateway layers, conforming to a published resolver standard.
- **"We respect node sustainability and block economics."** Bounded chunk sizes, batched/queued uploads, awareness of the SIP-012 block budget, and a roadmap that keeps marginal node burden low.
- **"User ownership and permanence of the *record*."** What Stacks guarantees is the *canonical, owned, verifiable record*; the bytes are made permanent through content addressing + archival, not by externalising storage onto every validator forever.

**One-paragraph boilerplate (drop into docs / grant intro):**
> *Xtrata is durable provenance infrastructure on Stacks. It anchors canonical, owned, cryptographically verifiable records of digital artifacts — manifests, dependency graphs, and content hashes — to Bitcoin via Stacks, and reconstructs the underlying bytes deterministically from a public, API-agnostic specification. Xtrata stores sealed records in current contract state (which is preserved across chain-state pruning), uses no `at-block` or historical-state reads (so it is fully compatible with pruned and snapshot nodes per SIP-042 and stacks-core #6953), and serves large media through content-addressed archives referenced by on-chain hashes rather than treating the chain as a content-delivery network. Xtrata is designed to reduce, not add to, the marginal burden it places on node operators.*

---

## 7. Architecture recommendations (concrete)

**Keep in *current* contract state (small, permanent, validation-relevant):**
- The canonical record: token id ↔ owner (NFT), MIME, total-size, total-chunks, `sealed`, **rolling `final-hash`**, creator, chunk-profile.
- Integrity anchors: `HashToId`, per-chunk or per-file content hashes.
- Relationship indexes: bounded `Dependencies`/`Parents` edges, manifest authority pointers.
- **Rule of thumb:** anything needed to *verify* or *locate* content belongs on-chain; the bulk bytes do not have to.

**Hash, don't store (at scale):**
- For large media (audio/video/app bundles), store **only the content hash + manifest on-chain**, and the bytes in a content-addressed archive. Make "bytes-in-current-state" an option reserved for small/"forever twin" artifacts the user explicitly wants fully on-chain.

**Emit (events) — for indexers only:**
- Keep `print` events as *notifications* (sealed, migrated), SIP-019-style, to tell indexers to refresh. **Never** require event history to reconstruct bytes. (You already comply.)

**Index — conform, don't depend:**
- Finalise **XIP-006 (Indexer/Resolver Conformance)** as a public standard so any indexer (yours, Hiro, Gamma) can resolve Xtrata tokens identically. Publish **Hiro-Archive-style snapshots** of your own so third parties can bootstrap without hammering public RPC.

**Mirror — content-addressed, multi-backend:**
- Primary: Arweave/IPFS keyed by the same hash the contract commits. Secondary: Xtrata gateway. The on-chain rolling hash makes any mirror trustless — a client verifies bytes against the chain regardless of source.

**What Xtrata archive nodes should preserve:**
- Full inscription bytes + the canonical record + a mapping from token id → content hash → mirror locations, so you can serve and *prove* any historical inscription even against pruned upstream nodes.

**Design manifests for future pruning:**
- Manifests should be **self-contained and content-addressed**: include MIME, size, chunk count, chunk size/profile, ordered chunk hashes, the rolling final hash, dependency ids *with their content hashes*, and mirror hints. A manifest plus mirrors must be sufficient to reconstruct and verify **without any historical-state read.** (Your reconstruction spec is ~90% there; add per-dependency content hashes and explicit mirror hints.)

**Design dependency graphs safely:**
- Store edges as current-state lists (bounded — you cap at 50). **Bound traversal depth/breadth** in resolvers (you already warn against untrusted graph expansion). Carry each dependency's content hash in the manifest so a child can be verified even if fetched from a mirror.

**Prove integrity when bytes come from Xtrata gateways:**
- Always return the on-chain `final-hash` alongside bytes; have clients recompute the rolling hash and compare. Expose your existing proof headers (`X-Xtrata-Runtime-Reconstruction-*`). A gateway that can't tamper undetectably is politically and technically defensible.

**Avoid dependence on historical `at-block` reads:**
- You already do. Codify it as a **design invariant** ("Xtrata contracts MUST NOT use `at-block`; resolvers MUST NOT depend on historical-height reads") so it can't creep in later.

**Avoid dependence on third-party APIs:**
- Keep "no privileged API required." Ship a resolver that accepts *any* RPC base (self-hosted node, Hiro, alternates), with budget-aware batching (your 30-chunk clamp) and terminal-error handling. Treat Hiro as one interchangeable backend, never the system of record.

---

## 8. Questions to ask Stacks leadership / core devs

Framed as an aligned builder ("we want to be compatible with your pruning and node-sustainability roadmap"), not defensively.

1. **Pruning scope:** Our reading of SIP-042 + #6953 is that pruning *squashes historical MARF tries* but *preserves current contract state and full block data.* Is that correct, and is current-state retention considered stable long-term?
2. **Snapshot semantics:** After a squash at height H, are *all* current values (including entries written long before H and never modified) fully retained and readable via standard read-only calls on a pruned node?
3. **Block-data retention:** Will pruned nodes indefinitely retain full block/transaction data, or is there a future direction toward pruning block bodies too (which would affect transaction-payload retrieval)?
4. **Write-cost roadmap:** Are there plans to change cost functions or add storage-specific pricing/limits for large `map-set`/`buff` writes (SIP-012 lineage) to discourage current-state growth? We'd like to design within whatever the intended economics are.
5. **Data-heavy contract posture:** Is there an explicit ecosystem stance (Foundation/CAB) on contracts that store large data in current state? We want to position Xtrata as aligned, and to know if a review path exists.
6. **Read-budget guidance:** For legitimately large read-only reconstruction, what's the recommended pattern given per-call `read_length` budgets — is running our own archive/RPC the expected answer, and are there plans to standardise archive snapshots?
7. **Archive-node commitment:** Is there a long-term commitment (Foundation/Hiro) to maintained archive infrastructure and snapshots, or should app teams assume they must self-host history?
8. **Signer/miner node requirements:** Will signers/miners be required to run full (non-pruned) nodes, and does that change any assumptions about state availability for read-only queries?
9. **Standards collaboration:** Would the core/standards group be open to a SIP or reference pattern for "content-addressed inscriptions with off-chain mirrors and on-chain hashes" so data-heavy apps have a blessed, node-friendly pattern?
10. **Early warning:** Is there a channel where we'd be notified of proposed cost/limit/Clarity changes that affect data-storage patterns before activation, so we can adapt contracts ahead of an epoch?

---

## 9. Red-team critique (harsh) — and responsible answers

**Critique 1 — "You're the exact bloat we're killing ourselves to prune."**
*Steel-man:* The team is burning 2026 building MARF squashing because nodes are drowning at 2.73 GB/day. Xtrata deliberately writes 16 KB–128 KB blobs into *current* state — the one tier squashing can never reclaim. You're not pruning-victims; you're pruning-*causes*.
*Answer:* Fair on direction, wrong on magnitude and remedy. (a) The growth crisis is ~95% *historical* MARF from high-frequency DeFi state churn, not current-state blobs from a nascent inscription app. (b) Xtrata adds **zero** historical-retention burden (no `at-block`), so we're already pruned-node-compatible. (c) Our roadmap moves *large* media to content-addressed off-chain mirrors with on-chain hashes, keeping only compact canonical records in state. We can commit to size thresholds above which bytes go off-chain. We reduce marginal node burden; we don't externalise it.

**Critique 2 — "Underpriced writes mean you're subsidised by every node operator forever."**
*Steel-man:* A one-time `write_length` fee buys permanent storage on every validator in perpetuity. That's a cost/price mismatch you're arbitraging.
*Answer:* Correct in principle, and we'll design for the economics you intend. We track SIP-012 and will adapt to any storage-specific pricing. Meanwhile our off-chain-mirror-by-default policy for large media means we *opt out* of the subsidy precisely where it would matter, and we run our own archive so retrieval cost isn't dumped on others.

**Critique 3 — "Reconstruction is fragile — it falls over on public node read budgets."**
*Steel-man:* Your own spec admits large `get-chunk-batch` calls exceed `read_length` budgets and you clamp to 30 chunks. That's a system that breaks under its own weight and leans on Hiro.
*Answer:* The read budget is a *retrieval* constraint, not a durability one — the bytes are safe in state. We handle it with budget-aware batching, direct map reads, our own RPC/archive, and a content-addressed mirror so big media never depends on a single budget-limited endpoint. "No privileged Xtrata API required" is a published, testable property.

**Critique 4 — "Recursive child inscriptions are a state-amplification bomb."**
*Steel-man:* Parent/child + dependency graphs multiply per-token state and indexer traversal without bound.
*Answer:* Edges are bounded (≤50) and current-state; resolvers bound traversal and treat dependency lists as authoritative *indexes*, not auto-render scripts. Each dependency carries a content hash so it's verifiable from a mirror. We'll publish explicit graph-size and depth limits.

**Critique 5 — "This is ordinals-style chain spam with better branding."**
*Steel-man:* Strip the language and it's arbitrary data on a financial chain whose North Star is payments.
*Answer:* The difference is *records vs. payloads.* Xtrata's on-chain footprint is canonical provenance — ownership, hashes, manifests, composability — which is exactly the kind of trust-minimised, Bitcoin-anchored record Stacks is for. The heavy bytes are content-addressed and mirrorable. We compete for block budget responsibly (throttled/queued uploads) and we're aligned with, not parasitic on, the throughput vision.

**Critique 6 — "One governance vote could still make your pattern non-viable."**
*Steel-man:* Even without deletion, a cost change or a storage cap could make inscriptions uneconomic overnight via a hard fork you don't control.
*Answer:* True, and it's the residual risk we accept and plan for. Mitigation: keep canonical records compact (resilient to write-cost hikes), make large bytes off-chain-portable (so a cap doesn't strand content), engage governance early (Section 8), and maintain our own archive so a protocol change degrades *cost/UX*, never *data availability.*

---

## 10. Final recommended stance

**Proceed — confidently on the core thesis, cautiously on bulk on-chain bytes. Do not pivot the architecture; reposition and harden it.**

**Change now**
- Codify a **design invariant**: no `at-block`, no historical-height reads in any Xtrata contract or resolver. (You already comply — make it a rule.)
- Introduce a **size threshold policy**: above a set size, large media defaults to **content-addressed off-chain mirror + on-chain hash/manifest**, with full on-chain bytes reserved for explicitly-chosen small/"forever" artifacts.
- Stand up / formalise **Xtrata's own archive + RPC + gateway** and publish **archive snapshots** so you never depend on Hiro's public endpoint as a system of record.
- Add **per-dependency content hashes and mirror hints** to manifests so reconstruction never needs historical state or a privileged API.

**Document**
- A short "**Stacks Durability & Pruning**" page citing **SIP-004, SIP-005, SIP-002/042, SIP-006/012, SIP-009/016/019, SIP-021, and stacks-core #6953**, stating plainly: *current state and block data are preserved through pruning; Xtrata uses no `at-block`; Xtrata is pruned-node-compatible.* (This directly neutralises the "one SIP and we're out" fear with primary sources.)
- The reconstruction spec as a public, API-agnostic standard (you have it — link it from the whitepaper and grant).
- The **defensive boilerplate** from Section 6 in your README, docs, grant intro, and whitepaper.

**Ask**
- The Section 8 questions, in a forum post or core-dev call, *as an aligned builder.* Getting an on-record core-dev confirmation that current-state + block data are preserved is worth more than any amount of self-assertion.

**Avoid saying**
- "Stacks is cheap storage / a CDN / put your files on-chain." Ever. Replace with "settlement, provenance, verification, content-addressing."

**Bottom line:** The fear as stated ("it lives in the MARF, one SIP prunes us out") is **largely mistaken** for how Xtrata is actually built — your sealed data is in the tier pruning preserves, and the pruning-enabling SIP doesn't touch you. The **legitimate** version of the concern is economic and political: writing large blobs into permanent state invites future cost/limit changes and core-dev/grant skepticism, and your retrieval path has real budget limits. Both are **manageable** with the repositioning and the hash-anchored, self-archived, mirror-by-default model above — most of which you've already started. Xtrata can be one of the *better-behaved* data citizens on Stacks, and should say so loudly, with sources.

---

## Appendix — Primary sources

- SIP index — https://github.com/stacksgov/sips
- SIP-004 (MARF) — https://github.com/stacksgov/sips/blob/main/sips/sip-004/sip-004-materialized-view.md
- SIP-002 (Clarity) — https://github.com/stacksgov/sips/blob/main/sips/sip-002/sip-002-smart-contract-language.md
- SIP-005 (Blocks & Transactions) — https://github.com/stacksgov/sips/blob/main/sips/sip-005/sip-005-blocks-and-transactions.md
- SIP-012 (Cost-Limits / block budget) — https://github.com/stacksgov/sips/blob/main/sips/sip-012/sip-012-cost-limits-network-upgrade.md
- SIP-016 (Token Metadata) — https://github.com/stacksgov/sips/blob/main/sips/sip-016/sip-016-token-metadata.md
- SIP-019 (Metadata Update Notifications) — https://github.com/stacksgov/sips/blob/main/sips/sip-019/sip-019-token-metadata-update-notifications.md
- SIP-021 (Nakamoto) — https://github.com/stacksgov/sips/blob/main/sips/sip-021/sip-021-nakamoto.md
- **SIP-042 (Removal of `at-block`)** — PR https://github.com/stacksgov/sips/pull/262 ; impl https://github.com/stacks-network/stacks-core/pull/6937
- **stacks-core #6953 (feat: pruned nodes)** — https://github.com/stacks-network/stacks-core/issues/6953
- **Chain State Pruning & `at-block` forum thread** — https://forum.stacks.org/t/chain-state-pruning-and-at-block-proposed-change/18685
- Stacks R&D 2026 Lookahead (Alex Miller) — https://forum.stacks.org/t/stacks-r-d-update-self-custodial-bitcoin-staking-and-beyond/18559
- Hiro Token Metadata API / Hiro Archive — https://docs.hiro.so/stacks/token-metadata-api
- Xtrata internal: `contracts/live/xtrata-v3.4.0.clar`, `docs/reconstruction-spec.md`, `docs/xips/` (XIP-006 Indexer/Resolver Conformance)
