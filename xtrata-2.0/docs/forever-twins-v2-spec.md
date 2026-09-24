# Forever Twins v2: self-service helpers, legacy adapters and collection preservation

**Spec id:** FT-SPEC-2 · **Version:** 0.10 (draft for Jim's decisions) · **Date:** 24 September 2026 · **Live facts:** Stacks tip 9,053,980 (section 3.3)
**Repo base inspected:** `stxtrata/xtrata@63d353c` (24 Sep 2026)
**Companion code:** `xtrata-2.0/forever-twins/ft-harness/` (simnet harness, v2 template, screener, live-check)
**Supersedes:** nothing. Extends `docs/forever-twins-linking.md` and `forever-twins/xtrata-twin-index-v1.md`.

> **Not authorised by this document:** deployment, paid inscription, changing any live helper or original
> contract, asset transfers, key handling or admin-role changes. Everything here was produced from source
> reading and local simulation. No transaction was signed or broadcast.

### Evidence tags used throughout

| Tag | Meaning |
|---|---|
| **[SIM x]** | Demonstrated in the local simnet harness; `x` is the scenario id (for example `[SIM V2-B]`). Simnet runs the real Clarity VM through clarinet-sdk 3.24.0, not a mainnet fork. |
| **[SRC]** | Read in source code (repo or pinned archive), not executed. |
| **[PRIOR]** | Carried forward from the September 2026 research notes; not re-verified here. |
| **[LIVE?]** | A live mainnet fact that has **not** been read. `live-check.mjs` reads most of these. |

---

## 1. Decision summary (plain English)

**What we can do without the original creators.** For most reviewed collections, we can preserve the
artwork on-chain and offer reversible twins without any action from the original creator or admin. Anyone,
including you, can pay for the preservation, and paying gives the sponsor no claim on anyone's NFT.
[SIM P1, T03]

**Where creators are optional.** Pointing the *original* NFT at the preserved copy still needs the
original admin, where the contract allows it at all. That is a nice extra, not part of the twin mechanism.

**What is blocked, and why.**

- **ThisIsNumberOne V1 and V2 must not get swaps.** That covers Genesis, No. 1 Smileys, Hash Ones and
  Singularity. Their old sale code lets a token be pulled back out of the helper after deposit. The twin
  then circulates with nothing behind it. [SIM V1-B, V2-A, V2-B]
- **ThisIsNumberOne preservation is still fine.** Preserving and linking the content needs no custody, so
  it can go ahead.

**What the current helpers get wrong.** The live helpers work, but they have three gaps.
[SIM P3, P4, P5]

- **Sponsor-chosen metadata:** a sponsor can choose the permanent mime type and metadata link of a twin.
- **Changeable "genuine" content:** the helper admin can change what counts as genuine content until they
  finalise the list, and inscription does not wait for finalisation.
- **Permanent stranding:** an NFT sent to the helper by ordinary transfer is stuck forever.

**What we built.** The v2 template in the harness closes all three gaps and passes 70 acceptance checks,
including against the real Zombie Wabbits contract. [SIM T01–T20]

**What the first mainnet check showed** (tip 9,053,980):

- **Every Bitcoin Pepe appears to have a twin already.** The helper reports 2,089 inscribed against a
  last token id of 2,089, and every sampled pair is correctly held. A full `--all` scan is needed before
  saying so publicly.
- **The existing twins' metadata links point at Pinata**, the same pinned-IPFS infrastructure the project
  exists to escape. The artwork bytes are on-chain; the link that wallets and marketplaces follow is not
  (F3a).
- **No helper has finalised its canonical list.** For Pepes this no longer matters, since every token is
  bound; for Leo Cats (101 of 10,000) and Miami Degens (1 of 420) it still does.
- **Zombie Wabbits is complete:** all 45 ids minted, none burned, 30 holders. The open-supply question is
  moot for the pilot.

**What to do first:**

1. Finish the live checks listed in section 3.3 ("still open").
2. Make the six decisions in section 13, especially who holds the helper admin key and the stray-token
   policy.
3. Pilot the v2 template on Zombie Wabbits (section 11), with no shared custody contract yet.

---

## 2. Terms and the three outcomes

| Outcome | What changes | Needs original admin? |
|---|---|---|
| **Preserve** | Original media, metadata and dependencies are inscribed on Xtrata, with a verifiable per-token record. | No. |
| **Twin** | Each original is bound to a distinct Xtrata token. One side sits in helper custody while the other circulates. | No, if the source passes the compatibility profile (section 4). |
| **Repoint** | The original contract's metadata URI is changed to a route that resolves the preserved copy. | Yes, where a usable setter exists. Optional. |

Other terms used in this spec:

- **Original:** the NFT in the source collection.
- **Twin:** the Xtrata inscription bound to one original.
- **Helper:** the contract holding bindings and custody.
- **Sponsor:** whoever pays for an inscription.
- **Holder:** the current owner of whichever side circulates.
- **Canonical record:** the admin-seeded, then frozen, per-token description of genuine content.
- **Stray:** a token sitting in the helper that should not be there.

---

## 3. Existing-work assessment (deliverable A)

### 3.1 Inventory

| Item | Location | State | Evidence |
|---|---|---|---|
| Twin registry (viewer source of truth) | `src/lib/twins/registry.ts` | Three entries: Bitcoin Pepes, LeoCats, Miami Degens. Generic resolver over the registry. | [SRC] |
| Resolver | `src/lib/twins/resolver.ts` | Treats "owner is a helper" or the stored flag as escrowed, and shows the source `get-owner` as the real owner. | [SRC] |
| Pepe helper source | `forever-twins/contracts-reference/rapha-fakfun/pepe-4ever-fakfun.clar` | Deployed-name reference. Third-party funding, canonical hashes. | [SRC], [SIM P1–P8] |
| Leo helper source | `…/leo-fakfun-xtrata.clar` | Same logic. Swap functions renamed to `swap-nft-for-xtrata` / `swap-xtrata-for-nft`, so the interface is not uniform. | [SRC] |
| **Miami Degens helper source** | — | **Not in the repo.** Registry points at `…miami-degens-fakfun-xtrata`. | [SRC] |
| stxer "70/70 passed" simulations | `…/SIMULATIONS.md` | Cover `xtrata-collection-registry-v1.0` (owner-gated, no canonical hashes), **not** the deployed `pepe-4ever-fakfun`. | [SRC] |
| Helper deployer / admin | all three helpers | `SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22` (Rapha / Fak.fun). Canonical seeding, finalisation, fees and payouts are controlled there, not by Jim. | [SRC] [LIVE? current `contract-owner`] |
| Core | `xtrata-v3-2-3` | Rolling hash; duplicates allowed; single-transaction path limited to 32 × 16 KiB. | [SRC], [SIM P7] |
| Twin index plan | `forever-twins/xtrata-twin-index-v1.md` | Plan for a global index written by approved helpers. Folded into section 5.4. | [SRC] |
| `docs/app-reference.md` | referenced by `AGENTS.md` | Missing from the repo (also noted in `forever-twins/Recent-Changes.md`). | [SRC] |

### 3.2 Findings

**F1: Third-party funding works and confers no rights.** `inscribe` checks only that the original exists,
that the hash is canonical and that no binding exists yet. The sponsor cannot withdraw the twin.
[SIM P1]

**F2: Redemption follows the circulating token.** When a twin is sold, the buyer can redeem the original
and the seller cannot. [SIM P2]

**F3: The sponsor chooses the twin's mime and token URI, permanently.** The canonical hash pins the
bytes only. `mime` and `token-uri` are free arguments to a permissionless function, and the core stores
them immutably. In simnet a canonical image was inscribed as `text/html` with a third-party URL.
[SIM P3]

- **Live exposure:** every *unbound* canonical token in the live helpers is exposed, whatever the Fak.fun
  frontend sends. At tip 9,053,980 that means Leo Cats and Miami Degens; Bitcoin Pepes appear fully bound.
  All 199 sampled twins carry `image/png`, so no misuse was seen.

**F3a (live): twin metadata links depend on Pinata.** Of the 199 twins sampled, 196 have a token URI
on `https://stxnft.mypinata.cloud`. The other three (all Leo Cats) begin `ipfs://ipfs`, which suggests a
doubled `ipfs/` prefix that most clients will not resolve. [live-check, uriHosts] Token URIs are immutable
in the core, so these cannot be corrected on the existing twins.

- **What still holds:** the artwork bytes are on-chain and Xtrata-aware viewers render them directly.
- **What does not:** a wallet or marketplace that follows the token URI depends on Pinata, exactly like
  the original.
- **Consequence for public wording:** "the artwork is stored on-chain" is accurate; "the twin no longer
  depends on IPFS" is not.
- **Consequence for v2:** decision D3 must be settled before any finalisation, and the canonical token URI
  must not point at a pinning gateway.

**F4: Canonical content is admin-mutable until finalisation, and inscription does not wait for it.**
`seed-canonical` overwrites entries with `map-set`. Bindings created meanwhile are permanent. Until
`finalize-canonical`, the helper admin key decides what "genuine" means for every unbound token.
[SIM P4] [LIVE? `is-finalized` on each helper]

**F5: A plain transfer to the helper strands both sides forever.** If a holder sends an original to the
helper with an ordinary transfer while its twin is escrowed:

- The helper then holds both sides, and both swap directions fail.
- No recovery path exists.
- The stored flag disagrees with the chain, and the viewer would name the helper contract as the "real
  owner".

[SIM P5]

**F6: No content deduplication.** The core mints a fresh token for identical bytes, and `get-id-by-hash`
returns only the first. Distinct redeemable identities per edition are preserved automatically, but the
bytes are stored once per edition. [SIM P7]

**F7: ThisIsNumberOne custody escapes (V1 and V2).**

- **Stale approval (V2):** an approval set before deposit lets a third party transfer the original *out of
  the helper*. [SIM V2-A]
- **Pre-armed buy-now (V1 and V2):** buy-now sale data survives ownership changes. An owner can arm a
  1,000 µSTX buy-now, deposit, take the twin, and anyone paying that price removes the original.
  [SIM V1-B, V2-B]
- **Round trips prove nothing:** an ordinary round trip passes on both contracts. [SIM V1-0, V2-0]
- **Not simulated:** `place-bid` settlement and the admin path in `close-bidding` look similar on reading
  but were not run. [SRC]
- **Consequence:** these contracts fail requirement R3 (section 4.2).

**F8: The Gamma template holds.** Tested on the real archived Bitcoin Pepe source. [SIM G1, G2]

- A listed token cannot be deposited.
- Nobody (holder, former holder or stranger) can list, buy or burn a token the helper holds.
- A round trip with resale works.

**F9: Shared custody is feasible in simnet, with limits.**

- **What works:**
  - Clarity 4 `with-nft` accepts a contract principal and asset name read from a registry at runtime.
    [SIM S1]
  - A wrong asset name is rejected. [SIM S2]
  - Trait calls work on contracts without `impl-trait`, including Clarity 1 V1. [SIM S3]
- **What doesn't:** read-only functions cannot dispatch through a trait [SIM S4], or call a
  constant-bound contract principal [SIM S5]. The v2 template therefore inlines literal principals in
  read-only paths.
- **Still needed:** confirmation on a pinned mainnet fork.

### 3.3 Live facts (read-only, Stacks tip 9,053,980, burn height 968,406, 24 Sep 2026)

Source: `ft-harness/results/live-check-mainnet.json` (1,302 read-only requests). These replace the
[LIVE?] items in earlier sections where they apply.

**Core `xtrata-v3-2-3`:** not paused; admin `SP3JNSEX…743X`; deployed source differs from the repo copy
only in comments or whitespace. None of the three helpers is on the allowlist. That is harmless while the
core is unpaused, but **pausing the core would stop inscription through every helper**.

| Helper | Source vs repo | Admin | Fee | Free tier | Inscribed | Finalised | Sampled | Custody | Twin URI hosts |
|---|---|---|---|---|---|---|---|---|---|
| Bitcoin Pepes | byte-identical | `SPV9K21…DC22` | 4 STX | 87 | 2,089 | **no** | 99 | 99 consistent | Pinata 99 |
| Leo Cats | byte-identical | `SPV9K21…DC22` | 4 STX | 69 | 101 | **no** | 99 | 99 consistent | Pinata 96, `ipfs://ipfs` 3 |
| Miami Degens | no repo reference (deployed SHA-256 `c0fc432d…6513`, saved as `…DEPLOYED.clar`) | `SPV9K21…DC22` | 4 STX | 69 | 1 | **no** | 1 | 1 consistent | Pinata 1 |

- **Pepe fee differs from the source default.** The live fee is 4 STX, not the 3 STX in the source and in
  `forever-twins/data/contracts.json` and campaign copy. Correct those documents.
- **Pepes appear complete.** 2,089 bindings against `last-id` 2,090 (last token id 2,089). A full
  `--only bitcoin-pepes --all` scan must confirm 2,089 distinct token ids, all consistent and all
  `image/png`, before a public "every Pepe" claim.

| Source | Source vs archive | Notable state |
|---|---|---|
| Bitcoin Pepe | byte-identical | `metadata-frozen = false`; `last-id = 2090` |
| Leo Cats | byte-identical | `metadata-frozen = false`; `last-id = 10001` |
| Miami Degens | byte-identical | `last-id = 420` |
| Megapont Ape Club | byte-identical | `metadata-frozen = false`, so repointing is still possible for the deployer |
| ThisIsNumberOne V1 | byte-identical | administrator is still the deployer `SP3QSAJ…FGZQ`; mint counter 5, so **Genesis is 5 tokens (ids 0–4)**, not the ~3,333 in the old chronology |
| ThisIsNumberOne V2 | byte-identical | administrator is still the deployer; mint counter 1,197 (ids 0–1,196) across Smileys, Hash Ones, Singularity and any others |
| Zombie Wabbits | byte-identical | counter 45; census: **45 minted (ids 1–45), 0 burned, 30 distinct holders** |

**Still open** (not covered by this run):

1. **Full Pepe scan:** `--only bitcoin-pepes --all` (needs `HIRO_API_KEY` in practice).
2. **Leo's three `ipfs://ipfs` URIs:** exact values. live-check now records up to three sample URIs per
   host (`uriSamples`).
3. **Miami helper template check:** does the deployed source match the Pepe/Leo logic apart from
   constants and names? Diff `…DEPLOYED.clar` against `leo-fakfun-xtrata.clar`.
4. **Zombie Wabbits closure:** read `wabbit-index` and `rotation` to confirm that a further `mint` call
   cannot create a 46th token (the counter check alone still passes at 45).
5. **Zombie Wabbits contract holders:** confirm whether any Wabbits sit in marketplace or other
   contracts (`census.heldByContracts`).
6. **ThisIsNumberOne sub-collections:** the V2 id ranges for Smileys, Hash Ones and Singularity, from
   `nft-data` edition fields.

---

## 4. Compatibility profile FT-CP-1 (deliverable B)

An Xtrata specification, not an official SIP. **Declaring SIP-009/016/019 never admits a contract. A
successful round trip never admits a contract.**

### 4.1 Tiers

| Tier | Meaning | Route |
|---|---|---|
| **S** Standard | Meets R1–R10 with the standard template unchanged. | Render `forever-twin-helper-v2`. |
| **A** Adapter | Fails a requirement in a way a separate, reviewed adapter can handle (public `get-owner`, capacity limits, external calls, utility rules). | Adapter contract implementing the same discovery interface. |
| **C** Custom review | Fails R3 (custody can be bypassed). Swaps stay disabled until a specific adapter passes adversarial tests. | Preservation-only meanwhile. |
| **P** Preservation-only | Content preserved and linked; no custody. Viewers show **"content preserved; swaps not enabled"**. | Manifest plus a binding-free preservation record (section 7.11). |
| **U** Unassessed | Contract identity or source not established. | Research. |

### 4.2 Requirements

| # | Requirement | How it is established |
|---|---|---|
| R1 | **Exact identity.** Full contract id, native asset name (case-sensitive), `uint` ids, minted-ever census, burns, migration history. | live-check census; manual. |
| R2 | **Owner-signed transfer.** `transfer(uint, principal, principal)` succeeds only when the current owner is `tx-sender`. It must work both when a user calls the helper and when the helper releases via `as-contract?`. | Screener, then exact-source simnet round trip. |
| R3 | **Custody closure.** No public function other than `transfer` can move or burn a token without its current owner signing *in that transaction*. This includes sale, auction or offer state set by a previous owner, approvals and operators, and admin movers. Listing-gated movers pass only if (a) a listing requires the owner and (b) `transfer` refuses listed tokens (the Gamma pattern [SIM G1]). | Screener flags; human review; exact-source adversarial simnet. |
| R4 | **Read-only owner query.** `get-owner` is `define-read-only` and returns `(response (optional principal) _)`. A public `get-owner` gives tier A (read-only discovery cannot call it). | Screener. |
| R5 | **No external calls in `transfer`**, or each one reviewed and simulated (Bitcoin Degens calls BNS/BNSx). | Screener. |
| R6 | **Capacity.** Any bounded per-owner list is at least the planned simultaneous custody count plus margin, otherwise a multi-vault adapter. | Screener (list sizes), manual. |
| R7 | **Ownership-keyed utility reviewed.** Rewards, payouts or rights that follow the original's owner would follow the helper while it holds the token (Boombox). | Manual. |
| R8 | **Content fit.** Each twin's bytes are at most 524,288 (single-tx path), or the large-file route is used (section 7.12). | Manifest. |
| R9 | **Edition structure known.** Shared media is identified; each original still gets a distinct twin. | Manifest. |
| R10 | **Deployed = reviewed.** The deployed source code equals the reviewed source (comment and whitespace differences recorded). | live-check. |

**Exclusions:**

- **E1.** Unknown or unreviewed code is never admitted by default (fail closed).
- **E2.** Open-mint collections must declare a snapshot scope (decision D4).
- **E3.** The open BOOM contract is never "complete"; only defined subsets are.

### 4.3 Admission procedure

1. **Screen:** `npm run screen` (mechanical flags only).
2. **Human review:** a checklist against R1–R9, with the reviewer named in the manifest.
3. **Exact-source simnet suite:** the acceptance suite with the source substituted, plus source-specific
   adversarial tests.
4. **Pinned mainnet-fork run** (stxer or equivalent) of the same suite.
5. **`live-check` at a recorded tip:** R1 census and R10 equality.
6. **Registry entry** with tier, evidence links and tip height.

### 4.4 Collection matrix

Screen results come from `results/screen.json`. Tiers are proposals. "Admin link update" is carried from
prior research [PRIOR] and is independent of twins.

| Contract | Screen | Proposed tier | Reason / next evidence | Admin link update [PRIOR] |
|---|---|---|---|---|
| `bitcoin-pepe` | listing-gated | S (live v1 helper) | [SIM G1, G2] on archived source. Live-check existing bindings. | set-base-uri if unfrozen |
| `leo-cats` | listing-gated | S (live v1 helper) | Same family; run exact-source suite. | set-base-uri if unfrozen |
| `miami-degens` | simple | S (live v1 helper) | Helper source missing: fetch via live-check and review. | set-ipfs-root |
| `megapont-ape-club-nft` | listing-gated | S | Asset `Megapont-Ape-Club` (case). | set-base-uri, 80 chars, only if unfrozen |
| `bitslimes`, `fractal-nft`, `ordinal-pepe`, `stacks-satoshis` | listing-gated | S | Exact-source runs; census. | admin setters if unfrozen |
| `stx-golden-pepe` | listing-gated | S + edition route | Shared metadata root (section 7.11). | admin if unfrozen |
| `zombie-wabbits` | simple | **S (pilot)** | Section 11. Real-source acceptance run passes [SIM T01–T13]. | deployer setters |
| `blocks`, `citadels`, `deruptars`, `nyc-degens` | simple | S | Exact-source runs; media recovery. Deruptars has no usable setter. | deployer setters (Deruptars: none) |
| `the-explorer-guild` | simple | S if identity confirmed, else U | Confirm it is the "Explorers" of the chronology. | admin if unfrozen |
| `byte-fighters` | simple, list 2,500 | S | Designed ~1,000 ids, under the cap; test list bookkeeping. | deployer setters |
| `belles-witches` | simple, list 2,500 | A (multi-vault) | Supply reportedly above 2,500 [PRIOR]; census. | deployer setters |
| `stacks-pops`, `stacks-punks-v3`, `free-punks-v0`, `phases-of-satoshi`, `bitcoin-birds`, `blue-ridge-biker` | **public `get-owner`**; lists 2,500/2,500/1,000/210/400/6 | A | Public owner query; capacity for the first three. Free Punks list starts with a zero entry [PRIOR]. | deployer setters |
| `bitcoin-degens` | 3 external calls in `transfer` | A | BNS/BNSx dependency on recipient. | no setter found |
| `boom-nfts` | simple (screen) | A | Screen misses older metadata/error shapes [PRIOR]; open contract, so subset manifest only. | no rewrite function |
| `boomboxes-cycle-6` | simple (screen) | A | R7 payout follows owner; shared SVG (edition route). | none |
| `thisisnumberone-v1`, `-v2` (Genesis, Smileys, Hash Ones, Singularity) | **unguarded movers** `buy-now`, `place-bid`; V2 approvals | **C, operate as P** | [SIM V1-B, V2-A, V2-B]. Section 7.13. | current admin, global URI |
| Crypto Graffiti | — | U | Two same-named deployments [PRIOR]. | unknown |

The screener's `lists` column counts every `(list N uint)` in a file. That is a prompt for review, not
proof of an owner list.

---

## 5. Architecture recommendation (deliverable C)

### 5.1 Options compared

| Aspect | A. Per-collection template | B. Shared multi-collection custody | C. Adapters | D. Preservation-only |
|---|---|---|---|---|
| Blast radius of a bug or admin key | One collection | **Every collection** | One family | None (no custody) |
| Deploy cost per collection | One contract deploy | Registration transaction | One contract | Inscriptions only |
| Clarity feasibility | Proven [SIM T-suite] | Custody proven in simnet [SIM S1–S3]; **no on-chain read-only custody view** [SIM S4] | Per family | Trivial |
| Asset allowances | Literal, fixed at deploy | Runtime from registry: a registry error equals wrong custody permissions | Literal | n/a |
| Legacy sources | Tier S only | Tier S only (the trait type rejects non-conforming shapes) | Tiers A/C | All |
| Auditability | One small reviewed template, rendered | One larger contract with registration logic | Per adapter | Manifest review |
| Self-service | Render, review, deploy (section 7.2) | Register | Library of adapter families | Upload plus manifest |

### 5.2 Recommendation

1. **Ship option A first**, as `forever-twin-helper-v2`, rendered per collection by
   `scripts/render-helper.mjs`, the seed of the self-service tool.
2. **Add a curated discovery registry** (5.4) so viewers find every helper through one contract.
3. **Keep option C** as separately reviewed adapter families implementing the same discovery interface.
4. **Keep option D** available for any collection that fails R3.
5. **Defer option B** until three conditions hold:
   - several tier-S collections are live;
   - a mainnet-fork run confirms F9;
   - someone accepts that one registry mistake or compromised key affects every collection.

This is a recommendation for decision D1, not an approved decision.

### 5.3 Why not start with the shared helper

- **It saves little.** It saves one contract deploy per collection, a small cost next to inscription
  costs.
- **It concentrates risk.** Every collection's custody would sit behind one admin and one allowance
  table.
- **It cannot offer read-only custody state.** Viewers would need two reads per token instead of one
  `get-custody-state`. [SIM S4]

### 5.4 Discovery registry (`xtrata-twin-registry-v1`, spec only)

A curated, custody-free contract that folds in `xtrata-twin-index-v1.md`.

**Data:**

- `Helpers`: map from helper principal to
  `{ source, source-asset, collection-key, interface-version, route ("standard"|"adapter"|"preservation"), status ("active"|"swaps-disabled"|"retired"), profile: "FT-CP-1", evidence-uri (string-ascii 256), registered-at }`.
- `BySource`: map from `{ source, asset }` to helper. Enforces **one active helper per source**, which
  stops duplicate or misleading campaign registrations.

**Writes:**

- Admin only.
- `register-helper` checks that `get-twin-interface` on the helper reports the same source and asset.
  This requires a literal-principal call, so registration takes the helper as a trait argument in a
  *public* function.
- `set-status` can move a helper to `swaps-disabled` **only as a display flag**. The registry cannot
  touch helper custody.

**Reads:** `get-helper`, `get-helper-for-source`, `list` via events.

It does not replace per-helper bindings. The per-twin reverse lookup lives in each helper
(`get-original-by-twin`).

---

## 6. Trust and authority model

| Role | Who | Can | Cannot |
|---|---|---|---|
| Original-contract admin | Collection deployer or admin | Repoint the original (if a setter exists) | Anything in the helper |
| Helper admin | Decision D5 | Seed canonical records *before* finalisation; finalise once; set fee ≤ `MAX-FEE`, free threshold and fee recipient; pause **new inscriptions**; propose and execute time-locked rescues of strays (if enabled); transfer admin | Pause or block swaps; move any correctly held token; change a canonical record after finalisation; change a binding |
| Sponsor | Anyone | Pay for the inscription of any canonical, unbound, existing original | Choose bytes, mime, size or URI; gain any claim |
| Holder | Current owner of the circulating side | Swap in either direction | Swap a token they do not hold |
| Registry curator | Decision D5 | List or retire helpers for discovery | Affect custody |

The canonical record is the trust anchor. Its authority comes from the published manifest (7.4) and the
reviewer named in it, not from sponsorship. Sponsorship proves nothing about creator endorsement.

---

## 7. v2 helper specification (deliverable D)

Reference implementation: `ft-harness/templates/forever-twin-helper-v2.clar.tmpl`. It is a **prototype
used to prove this spec is implementable**. It is not audited and not authorised for deployment.

### 7.1 Guarantees

- **G1 One-to-one, immutable bindings.** One binding per original and one original per twin
  (`map-insert`, no delete or update of identity). [SIM T04]
- **G2 Twin content fixed by the finalised canonical record.** The finalised record fixes bytes, mime,
  size and token URI. The sponsor supplies chunks only; the ABI is `inscribe(token-id, chunks)`.
  [SIM T03]
- **G3 No inscription before finalisation.** [SIM T02]
- **G4 Funding confers no rights; redemption follows the circulating token.** [SIM T03, T05]
- **G5 Swaps check actual ownership in both contracts,** before and after the deposit leg, not just the
  flag. [SIM T05, T08]
- **G6 The admin cannot pause, block or redirect swaps.** The only admin path that moves a held token is
  the constrained, time-locked stray rescue. [SIM T06, T11]

### 7.2 Configuration and rendering

`render-helper.mjs <config.json>`. It refuses any profile tier other than `S`, rejects malformed
principals or asset names, and never guesses a value. [SIM T13]

| Field | Meaning |
|---|---|
| `collectionKey` | Stable `[a-z0-9-]{1,40}` key, also the viewer registry key. |
| `master` | Core contract id (mainnet `SP3JNSEX….xtrata-v3-2-3`). |
| `source`, `sourceAsset` | Exact source contract and native asset name (case-sensitive). |
| `maxFeeUstx` | Ceiling on `set-fee`, fixed forever at deploy. |
| `rescueEnabled`, `rescueDelayBurnBlocks` | Decision D2. The delay is in Bitcoin blocks (for example 432 ≈ 3 days). |
| `profileTier` | Must be `"S"`. |

**Deployment checklist** (for the eventual self-service tool):

1. Rendered source diffed against the template.
2. Asset name matches the source's `define-non-fungible-token`.
3. Acceptance suite passes with the exact source.
4. Mainnet-fork run passes.
5. Core `paused` is false, or the helper is allowlisted.
6. Admin principal matches D5.

### 7.3 Discovery interface (all v2 helpers and adapters)

Read-only unless marked otherwise.

| Function | Returns | Notes |
|---|---|---|
| `get-twin-interface` | `{ interface-version: u2, collection-key, master, source, source-asset, route, canonical-finalized, canonical-count, manifest-hash, inscribed-count, swaps-enabled, rescue-enabled, rescue-delay, owner }` | One call gives a viewer everything static. |
| `get-binding (token-id)` | `(optional { xtrata-id, content-hash, inscriber, xtrata-escrowed, at })` | **Tuple identical to v1**, so the existing resolver works unchanged. [SIM T12] |
| `get-canonical (token-id)` | `(optional { content-hash, mime, total-size, token-uri })` | |
| `get-original-by-twin (xtrata-id)` | `(optional uint)` | Reverse lookup without an indexer. |
| `get-custody-state (token-id)` | `(optional { xtrata-id, xtrata-escrowed, original-owner, twin-owner, consistent, stranded })` | **Chain truth.** Viewers must display `consistent: false`, not hide it. |
| `stray-side (token-id)` | `(optional "original"\|"twin")` | |
| `get-rescue (token-id)` | pending rescue, if any | |
| `fee-for (payer)`, `get-fee`, `get-free-threshold`, `get-inscribed-count`, `is-finalized`, `get-owner` | as named | v1-compatible getters. |

**Public swap names (standardised):** `swap-original-for-twin`, `swap-twin-for-original`. The v1 names
(`swap-pepe-for-xtrata`, `swap-nft-for-xtrata`) stay supported in the viewer through a per-helper
function-name map (section 8).

**Events** (`print`, all include `collection`): `inscribed` (v1 fields plus `collection`),
`swap-original-for-twin`, `swap-twin-for-original`, `canonical-finalized`, `rescue-proposed`,
`rescue-cancelled`, `rescue-executed`, `owner-changed`.

**Clarity constraint:** read-only paths must call the source and core through **literal** principals. A
constant-bound principal or a trait is rejected by the read-only checker. The template inlines them at
render time. [SIM S4, S5]

### 7.4 Canonical record lifecycle

**Entry:** `{ id, content-hash (xtrata rolling hash), mime (1–64 ascii), total-size (1–524,288), token-uri (1–256 ascii) }`.
Invalid entries reject the whole batch (`u215`). [SIM T01]

**Seeding:**

- Admin only.
- Up to 100 entries per call.
- Allowed only before finalisation.
- Re-seeding an id before finalisation replaces it without inflating the count.

**Finalisation:** `finalize-canonical(manifest-hash, expected-count)`.

- One-way.
- `expected-count` must equal the seeded count (`u209`).
- `manifest-hash` is the SHA-256 of the published manifest file.

**Manifest** (JSON, published with the collection and inscribed on Xtrata as well):

```json
{
  "spec": "FT-SPEC-2", "collectionKey": "zombie-wabbits",
  "source": "SPJW…zombie-wabbits", "sourceAsset": "zombie-wabbits",
  "snapshot": { "stacksTipHeight": 0, "stacksTip": "0x…", "takenAt": "ISO-8601" },
  "scope": "minted-at-snapshot | designed-range | declared-subset",
  "reviewer": "name + date of human FT-CP-1 review",
  "tokens": [{
    "id": 43,
    "original": { "metadataUri": "…", "metadataSha256": "…", "mediaUris": ["…"], "mediaSha256": ["…"] },
    "twin": { "contentHash": "0x… (xtrata rolling hash)", "sha256": "…", "mime": "image/png", "totalSize": 0, "tokenUri": "…" },
    "notes": "resized? regenerated? must say so"
  }],
  "dependencies": [{ "role": "shared-media|runtime|font", "xtrataId": null, "sha256": "…" }]
}
```

**Rules:**

- Preserve original bytes.
- A resized or re-encoded file is a different asset and must be labelled as such.
- The same pipeline produces the sizing report in section 12.

**Open-supply collections (decision D4).** Ids minted after finalisation have no canonical entry and
cannot be twinned by that instance (`u206`). [SIM T04] The options are:

- (a) Declare the snapshot scope and deploy a second instance later.
- (b) Pre-seed the full designed range where the media is known in advance (Zombie Wabbits'
  shared-JSON model may allow this).

### 7.5 Operation semantics and errors

**`inscribe(token-id, chunks)`**, anyone may call:

1. Canonical entry exists (`u206`).
2. Original exists (`u200`).
3. Inscriptions not paused (`u211`).
4. Record finalised (`u208`).
5. Not already bound (`u201`).
6. Original not already held by the helper (`u210`; it would be born stranded).
7. Charge the helper fee to the caller (skipped if zero or if the payer is the recipient).
8. Quote the core single-tx fee, move it into the helper, and mint as the helper with the canonical hash,
   mime, size and URI. The core rejects wrong bytes: `u103` for a hash mismatch, `u102` for a size or
   shape mismatch. [SIM T04]
9. Insert the reverse map and the binding (`xtrata-escrowed: true`), then emit `inscribed`.

**`swap-original-for-twin(token-id)`:**

1. Binding exists (`u202`) and the twin is expected to be escrowed (`u203`).
2. **The helper actually owns the twin** (`u210`).
3. Source `transfer` from caller to helper.
4. **The helper now actually owns the original** (`u210`).
5. Release the twin to the caller; flip the flag; emit the event.

**`swap-twin-for-original(token-id)`:**

1. Binding exists and the original is expected to be escrowed (`u203`).
2. **The helper actually owns the original** (`u210`). This fails loudly if it left by any route.
3. Core `transfer` of the twin from caller to helper.
4. Release the original; flip the flag; emit the event.

Every failure reverts the whole transaction. Swaps are **never** pausable.

| Code | Name | Code | Name |
|---|---|---|---|
| u200 | NO-SUCH-TOKEN | u209 | COUNT-MISMATCH |
| u201 | ALREADY-INSCRIBED | u210 | CUSTODY (chain disagrees with the expected state) |
| u202 | NOT-INSCRIBED | u211 | PAUSED (inscriptions only) |
| u203 | WRONG-STATE | u212 | NO-RESCUE |
| u204 | NOT-AUTHORIZED | u213 | TIMELOCK |
| u206 | NOT-CANONICAL | u214 | FEE-CAP |
| u207 | FINALIZED | u215 | BAD-CANONICAL |
| u208 | NOT-FINALIZED | u216 | RESCUE-DISABLED |

Source and core errors pass through unchanged (for example Gamma `u106` for a listed token, core `u103`).

### 7.6 Strays and rescue (decision D2)

SIP-009 `transfer` cannot refuse a recipient, so strays cannot be prevented. The interface detects them
on-chain (`get-custody-state.stranded`, `stray-side`). [SIM T08–T10]

**Option R1, rescue enabled** (prototype default for the pilot). The admin can
`propose-rescue(token-id, recipient)`, which is valid only when `stray-side` is some value:

- **Stray original with an escrowed twin:** the original goes back.
- **Stray twin with an escrowed original:** only the twin goes back; the original stays escrowed.
- **Unbound original sent directly:** it goes back.

The proposal is announced on-chain. It can be executed after `RESCUE-DELAY` Bitcoin blocks, and only if
the same side is still stray (`u213`, `u212`). Rescue therefore only ever *restores* the one-held,
one-out invariant. It cannot touch a healthy pair. [SIM T11] Recipient choice is an off-chain judgement:
policy says it must be the principal that sent the stray, as shown by the transfer transaction.

**Option R2, rescue disabled.** Strays are permanent. This is the smallest trust surface but punishes
mistakes. [SIM T20]

**Either way:** the UI must warn that "send to helper" is **not** a swap, and viewers must show stranded
pairs.

### 7.7 Admin powers (exhaustive for the template)

`seed-canonical`, `finalize-canonical`, `set-fee` (≤ `MAX-FEE`), `set-free-threshold`,
`set-fee-recipient`, `set-inscribe-paused`, `propose-rescue`, `cancel-rescue`, `execute-rescue`,
`transfer-ownership`.

A static check in the suite confirms that only `swap-original-for-twin`, `swap-twin-for-original` and
`execute-rescue` can release a held token. [SIM T11]

**Recommended after finalisation:** transfer admin to the D5 principal, a multisig if possible.

### 7.8 Fees

Fees are a flat fee per inscription after a free-tier count, paid to one recipient and capped by
`MAX-FEE`. There are no discounts (v1's per-address discount map is dropped for simplicity; it can be
re-added if needed). The core's own fee is quoted at call time and passed through. [SIM T07]

Live fees must be read, never quoted from source defaults.

### 7.9 Twin token URI (decision D3)

The URI is fixed per token in the canonical record. Options:

- (a) An Xtrata resolver URL such as `https://xtrata.xyz/ft/<collection>/<id>.json` returning
  SIP-016 JSON built from on-chain data. Convenient, but an HTTP dependency.
- (b) A `data:` or Xtrata-internal reference to an inscribed metadata JSON. More permanent; client
  support must be verified.
- (c) The original metadata URI, preserved verbatim. Honest provenance, but it may be dead.

**Recommendation:** (a) for display, with the manifest (inscribed) as the permanent source of truth. The
choice is permanent per twin, so decide it before finalising.

### 7.10 Registry and viewer compatibility

The binding tuple is unchanged, so `resolver.ts` works as-is for escrow display. Section 8 lists the
improvements.

### 7.11 Edition and preservation-only routes (specified, not implemented)

**Edition route** (STX Golden Pepe, Boombox, No. 1 Smileys content):

- Inscribe shared media **once**, as a dependency.
- Each original's twin is a small per-token record (JSON with edition number, original id and a
  reference to the dependency), minted via `mint-single-tx-recursive` with `dependencies: [shared-id]`.
- The canonical entry adds `dependency-ids`.
- **Tests to add:**
  - distinct twins per edition;
  - dependency must exist at inscribe;
  - identical per-token records impossible (the id is embedded);
  - reconstruction.

**Preservation-only** (tier P):

- A `forever-preservation-v1` record contract.
- Admin-seeded, then finalised, map from original id to `{ xtrata-ids, content-hash }`.
- No custody.
- `get-twin-interface.route = "preservation"`, `swaps-enabled = false`.

### 7.12 Large-file route (above 512 KiB; specified, not implemented)

The sponsor uploads through the core's staged path (`begin-inscription` / `add-chunk-batch` /
`seal-inscription`) with the canonical URI, then calls `bind-staged(token-id, xtrata-id)`. It checks:

- the caller owns `xtrata-id`;
- the core hash, mime, size and raw URI equal the canonical entry;
- no binding exists.

It then pulls the twin into custody and binds it. The creator field on the twin is then the sponsor, not
the helper; record that in the manifest.

**Tests:** the four mismatches, an unsealed upload, a bound twin reused for another original.

### 7.13 Adapters

Adapters must implement section 7.3 in full, keep guarantees G1–G6, and document which requirement they
satisfy differently.

| Family | Adapter obligation | Minimum extra tests |
|---|---|---|
| Public `get-owner` (Pops, Punks V3, Free Punks, Phases, Bitcoin Birds, Blue Ridge Biker) | Use `get-owner` only in public paths. `get-custody-state` reads twin custody plus a helper-maintained "original held" set, updated in the same transactions, and is documented as derived. | Capacity at list bound; ID zero; list bookkeeping after repeated round trips. |
| Bounded lists (Pops, Punks V3, Free Punks, Belles) | Vault set with deterministic routing; per-vault headroom; redemption from any vault. | Deposit at capacity minus 1, at capacity, and above; cross-vault redemption. |
| Bitcoin Degens | Simulate the BNS/BNSx calls with contract recipients. | Deposit and return with and without names; naming side effects. |
| Boombox | R7 payout review; edition route. | Payout while held. |
| **ThisIsNumberOne V1/V2 (hypothesis only)** | In the deposit transaction, after taking custody, the adapter calls, as the new owner: `set-approval-for(id, helper)` (V2), which overwrites the stale approval, and `set-sale-data(id, 0, …)`, which disarms buy-now and auction. It rejects tokens with open bids or offers. **It cannot neutralise the admin `close-bidding` path**, so admin-key status must be established. | All of [SIM V1-B, V2-A, V2-B] must fail against the adapter; `place-bid` and `accept-offer` variants; admin close-bidding. Until then: tier P. |

---

## 8. Viewer and registry changes

Changes needed in `src/lib/twins/`, mirrored in `index.html` `PEPE_ESCROW_RESOLVERS` and
`forever-twins/data/contracts.json` as `AGENTS.md` requires:

1. **Extend `ForeverTwinCollection`** with:
   - `interfaceVersion: 1 | 2`;
   - `swapFunctions: { toTwin, toOriginal }` (v1 Pepe `swap-pepe-for-xtrata`/`swap-xtrata-for-pepe`;
     v1 Leo and Miami `swap-nft-for-xtrata`/`swap-xtrata-for-nft` [LIVE? Miami]; v2 standard names);
   - `route` and `status`;
   - `collectionKey`.
2. **Use chain truth for v2 helpers.** Call `get-custody-state` and show "Inconsistent custody" or
   "Stranded — contact support" instead of naming the helper as owner. For v1 helpers, compute the same
   state client-side from the two `get-owner` reads, as live-check does.
3. **Show preservation-only status.** For tier P collections, display "content preserved; swaps not
   enabled".
4. **Add tests** in `src/lib/twins/__tests__/` for each state (consistent, stranded, inconsistent,
   preservation-only, v1/v2 function names).

---

## 9. Acceptance tests and coverage (deliverable D)

Run everything with `cd forever-twins/ft-harness && npm ci && npm test`. Result files go in
`ft-harness/results/`.

| Suite | File | Result (24 Sep 2026) |
|---|---|---|
| Evidence on current helper and legacy sources | `sim/existing-helper-evidence.mjs` | 60/60 checks, 15 scenarios |
| v2 acceptance (real Zombie Wabbits and Gamma sources) | `sim/acceptance-v2.mjs` | 70/70 checks, 14 scenarios |
| Shared-helper feasibility and Clarity limits | `sim/shared-helper-probe.mjs` | 8/8 checks, 5 scenarios |
| live-check end to end against a simnet-backed mock node | `live-check/test-against-simnet.mjs` | 12/12 checks, 3 scenarios |

**Requirement to test mapping (implemented):**

| Area | Tests |
|---|---|
| Independent sponsorship | T03 |
| Both swap directions | T05 |
| Resale then redemption by the new holder | T05, P2 |
| Wrong callers | T01, T05, T08 |
| Wrong files | T04 |
| Duplicate bindings | T04 |
| Listing conditions | T20, G1 |
| Pause semantics | T06 |
| Fee bounds | T07 |
| Strays and rescue | T08–T11 |
| Discovery shape | T12 |
| Renderer guards | T13 |
| Legacy custody escapes | V1-B, V2-A, V2-B |
| Rollback on failed leg | implicit in every negative swap case; add an explicit core-side failure case |

**Still to write before any deployment:**

1. The same suites on a **pinned mainnet fork** (stxer) with the real deployed source and core.
2. An exact-source run for every tier-S collection admitted.
3. Capacity boundaries for list-bounded sources.
4. Edition and large-file routes.
5. Adapter adversarial suites (section 7.13).
6. Viewer unit tests (section 8).
7. An explicit test where the release leg fails and the deposit leg rolls back.
8. A fuzz or property run over random swap and transfer sequences asserting "exactly one side held" or
   "stranded is detected".

---

## 10. Live verification procedure

`npm run live-check` (optionally set `HIRO_API_KEY`, `--api <own node>`, `--all`).

- **Read-only by construction:** GET requests plus the node's read-only call endpoint; no keys.
- **Targets:** in `live-check/targets.mainnet.json`.

**What it reads and flags:**

- Chain tip.
- Core `paused`, admin, allowlist status per helper, current quote.
- Source equality of the core, helpers and sources against repo and archive references (byte-identical,
  whitespace-only, comment-only or **CODE-DIFFERS**).
- Helper admin, fee, threshold, count and finalisation (flags `canonical-not-finalised`).
- For each `inscribed` event:
  - binding presence;
  - canonical hash still equal to the bound hash (flags `canonical-hash-changed-after-binding`);
  - actual owners on both sides (consistent, inconsistent or stranded);
  - twin mime and URI host tallies with pattern flags.
- Source data variables (freeze flags, roots, V1/V2 administrator).
- Mint census via mint events plus `get-owner`.

**Rate limits:** the default delay is 1.1 s per request without a key, and the binding scan is capped at
50 per helper unless `--all` is passed.

**What anomalies mean:** they are observations at the recorded tip, not verdicts. Take any stranded or
inconsistent pair, or changed canonical hash, to the helper admin (Rapha for v1 helpers) before public
claims. Record the report file and tip height in any public statement.

---

## 11. Smallest complete pilot: Zombie Wabbits

**Why:** tier S by screen and review; small designed scope; read-only `get-owner`; owner-only `transfer`
and `burn`; no market, approvals or owner lists. The real source passes the full acceptance suite.
[SIM T01–T13]

**Facts from source** [SRC]:

- `ITEM-COUNT` is 45.
- Ids 45, 1, 44 and 2 were minted to the deployer at deploy.
- The public mint (150 STX) is guarded by `counter ≤ 45`. In simnet the mints after deploy produced
  43, 3, 42, so ids are not sequential. [SIM acceptance setup]
- **Live:** counter 45; all ids 1–45 minted, none burned, 30 holders (section 3.3). The supply is
  effectively complete; confirm open item 4 in section 3.3 before finalising.
- **Every token's metadata URI is the same shared JSON**
  (`https://www.stacksart.com/assets/zombie-wabbits.json`). The token-to-art mapping must be recovered
  from that file.
- Whether that shared JSON URL still resolves is not yet known. That is gate P1.

**Gates** (each needs the previous one):

| Gate | Work | Output |
|---|---|---|
| P0 | `live-check` census and source equality at a recorded tip | **Done at tip 9,053,980:** ids 1–45, 0 burned, source byte-identical. Close open items 4–5 of 3.3. |
| P1 | Recover the shared JSON and every media file; verify MIME and magic bytes; sha256 plus xtrata hash | Draft manifest; byte totals |
| P2 | Decisions D2, D3, D4, D5 for this collection | Config JSON |
| P3 | Render; run the acceptance suite with the real source (already green); run it on a mainnet fork | Fork run link |
| P4 | Separate written authorisation to deploy (not given here) | — |
| P5 | Deploy; seed; reviewer re-checks on-chain entries against the manifest; finalise with manifest hash and count | Finalisation transaction |
| P6 | First sponsored inscriptions; `live-check` shows all consistent | Report file |
| P7 | Registry and viewer entry (section 8); public copy per `Campaign-Facts-and-Open-Questions.md` rules | Live page |

**Fallback:** if P0 or P1 fails (for example the shared JSON is gone and the media cannot be recovered
authentically), move to Blocks or Citadels. Both are tier S by screen, still subject to their own P0–P1.

---

## 12. Size and cost workstream (unchanged objective)

The manifest pipeline (7.4) also produces the sizing record, so the economic aim of affordable, complete
preservation stays in view.

**Per collection, record:**

- Minted-ever versus advertised supply.
- Gross per-token bytes, and unique bytes deduplicated by sha256.
- Manifest bytes and dependency bytes.
- Both chunk counts:
  - `ceil(total/16384)`, consolidated;
  - `Σ ceil(file/16384)`, independent.
- Status COMPLETE only when every in-scope token and object is verified.

**Costs:** read the live core quote and helper fee from `live-check` at the time. Never use source
defaults.

**Leads, not results** [PRIOR]: Hash Ones (91 × ~21 KB creator-reported) and Bitcoin Pepes (largest
under 10 KB claimed). No cheapest-to-most-expensive ranking exists yet.

---

## 13. Decisions needed from Jim

| # | Decision | Recommendation |
|---|---|---|
| D1 | Architecture | Per-collection v2 template plus discovery registry now; shared custody deferred (5.2). |
| D2 | Stray policy | Rescue enabled with a 432-burn-block delay and a published recipient rule; disabled only if the admin is a key you would not trust with that power. |
| D3 | Twin token-URI policy | Resolver URL plus inscribed manifest (7.9). |
| D4 | Open-supply scope | Declare a snapshot; pre-seed the designed range only where media is provably fixed. Moot for the Zombie Wabbits pilot if 3.3 item 4 confirms closure. |
| D5 | Who holds helper admin and registry curation | Jim or an Xtrata multisig for new helpers; explicit, written arrangement with Rapha for any co-branded ones. |
| D6 | Fees | Zero helper fee during the pilot; `MAX-FEE` set conservatively at deploy. |
| D7 | Existing v1 helpers | Live-check done (3.3). Ask Rapha to finalise Leo and Miami canonical records (Pepes are fully bound, so finalisation is now cosmetic there), to confirm what the Fak.fun frontend passes as mime and token URI, and to correct the 3 STX fee in copy. Share F3, F3a, F4 and F5. They cannot be upgraded in place. |
| D8 | ThisIsNumberOne | Preservation-only now; fund the adapter work in 7.13 only if the custody tests can be made to fail against it. The administrator is still the original deployer, so the admin `close-bidding` path is in the creator's hands. |
| D9 | Existing twins' Pinata dependency (F3a) | Say publicly that the artwork is on-chain and the metadata link is still IPFS-hosted. Have Xtrata viewers and the resolver serve metadata from on-chain data regardless of the stored URI. Ask Rapha whether the frontend can switch future Leo and Miami twins to a non-gateway URI now, because each twin's URI is fixed at mint. |

---

## 14. Evidence ledger and limitations

**Tools:**

- Node 22.
- `@stacks/clarinet-sdk` 3.24.0 simnet with Clarity 4 for the helpers, and Clarity 1/2/3 for the legacy
  and core contracts as deployed.
- `@stacks/transactions` v7.

**Core copy:** `xtrata-v3.2.3` from `contracts-reference`, with the two migration functions removed
(marked `[simnet]`). The legacy-reader stubs exist only so it compiles.

**Legacy sources:** `boomcrypto/clarity-deployed-contracts@45a7af60…`, verbatim except for localised
trait references, the Gamma test mint, and the removed V1 mainnet `impl-trait`. Each file's first line
records its provenance.

**Limitations:**

- No mainnet reads were possible from the research sandbox.
- No mainnet-fork runs.
- No media downloads or byte measurements.
- The screener is regex-based flagging and has known blind spots (BOOM metadata shapes, Boombox utility).
- Simnet ≠ mainnet node version.
- The v2 template is unaudited.
- The ThisIsNumberOne adapter design is a hypothesis.
- `place-bid` and `close-bidding` were not simulated.

**Sources:**

- Repo files cited inline.
- Archived deployed contracts (above).
- The SIP-009 and SIP-016 texts in `stacksgov/sips` for standard shapes.
- The prior research bundle (6–7 Sep 2026 addendum, four-contract report, plain-English report, sizing
  brief), used as [PRIOR] only.

## Appendix: harness map

```
forever-twins/ft-harness/
  Clarinet.toml, settings/          simnet manifest (self-contained; does not touch contracts/clarinet)
  contracts/core/                   xtrata v3.2.3 (migration removed), traits, legacy-reader stubs
  contracts/legacy/                 archived ThisIsNumberOne V1/V2, Gamma bitcoin-pepe, zombie-wabbits
  contracts/test-doubles/           mock-pepe, mock-commission, probe-shared
  contracts/rendered/               ref-helper-* (current helper logic) and ft2-* (v2 instances)
  templates/                        forever-twin-helper-v2.clar.tmpl
  scripts/render-helper.mjs         renderer (+ configs/)
  sim/                              lib, existing-helper-evidence, acceptance-v2, shared-helper-probe, probes/
  screener/                         screen_sources.py, summarise.py, fetch-sources.sh, sources.txt, sources/
  live-check/                       live-check.mjs, targets.mainnet.json, test-against-simnet.mjs
  results/                          latest JSON outputs of every suite
```
