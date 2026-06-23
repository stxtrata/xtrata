# XIP Corpus Inscription & Authority Runbook

How to inscribe XIP updates correctly and advance the on-chain Manifest Authority
(XMA-1) scope that governs the corpus. Grounded in XIP-000 §5–§9 (versioning,
supersession, ratification gate), XIP-001 §6 (parent-edge supersession), and
XIP-009 §3/§6 (registration + succession).

This document is a procedure, not an executable script. Actual inscription and
contract calls are performed by the holder of the XIP authority wallet; nothing
here moves funds or signs transactions on anyone's behalf.

---

## 0. Current on-chain state (verified from chain, xtrata-v3-2-3)

Contract: `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`.

The **inaugural corpus IS inscribed** (tokens #1052–#1064). The corpus manifest
is a XIP-001 `collection` with `membershipSemantics: "historical"` and
`xtrata-merkle-v1` integrity — i.e. an explicit historical snapshot, superseded by
inscribing a *new* snapshot, never mutated.

| Member | Inscription ID | finalHash (first bytes) |
|---|---|---|
| XIP-000 | #1052 | 0x41122e4a… |
| **XIP-001 v1.0.0** | **#1053** | 0x0693716f… |
| XIP-002 | #1054 | 0x8b2e4213… |
| XIP-003 | #1055 | 0x2141c3bf… |
| XIP-004 | #1056 | 0x8f3790be… |
| XIP-005 | #1057 | 0x0c5077fa… |
| XIP-006 | #1058 | 0x3a715b4b… |
| XIP-007 | #1059 | 0xdd01dd60… |
| XIP-008 | #1060 | 0x37421d19… |
| XIP-009 | #1061 | 0xad74a614… |
| README  | #1062 | 0xa04b3fb8… |
| **Corpus manifest JSON** | **#1063** | integrity.root 0x55969720… |
| **Corpus viewer (HTML)** | **#1064** | renders #1063 from chain |

Key facts that shape this change set:

- The inscribed corpus covers **XIP-000–009 + README only**. **XIP-010 and
  XIP-011 were never inscribed** — both are repo-only Drafts. A corpus refresh
  that adds XIP-011 must decide whether to add XIP-010 in the same pass.
- The document edited in this round, **XIP-001, is inscription #1053 (v1.0.0)**.
  Our edit bumps it to **v1.1.0** (XIP-000 §5 MINOR: backward-compatible addition
  of the `agent` type), so #1053 must be **superseded**, not mutated. The
  *envelope* `specVersion` in manifest bytes stays `1.0.0` — the envelope format
  is unchanged; only XIP-001's document `Spec version` and registry table moved.
- The corpus manifest is `#1063` (JSON) with a viewer at `#1064`. A refresh
  supersedes **both**: a new manifest JSON (parent #1063) and a new viewer
  (parent #1064).

> **Governance — RESOLVED (checked on-chain).** The corpus is **NOT** governed by
> XMA-1. The Manifest Authority contract is not deployed (Hiro API
> `/v2/contracts/interface/SP3JNS….xtrata-manifest-authority-v1` →
> "No contract interface data found"), there is no deployment record in the repo,
> and #1063 is a plain XIP-001 `collection` that the #1064 viewer verifies by
> Merkle root, not by a scope pointer. **Supersession is therefore by XIP-001
> parent edge + Merkle self-verification only** — skip all XMA-1
> register/succession steps (§B step 5 does not apply).
>
> Still verify before inscribing: that #1063/#1064 are the current corpus tip
> (no newer manifest already inscribed).
>
> How this was checked (so it's repeatable): open
> `https://api.hiro.so/v2/contracts/interface/<deployer>/<contract-name>` in a
> browser. JSON back = deployed; "No contract interface data found" = not
> deployed. Same for any contract you want to confirm exists on mainnet.

---

## 1. Prerequisites — line these up before any inscription

1. **One XIP authority wallet.** A single principal should be the core `creator`
   of every XIP inscription and the `key-authority` of the corpus scope. XMA-1
   registration is creator-only (XIP-009 §3.6) and scope creation is self-claim
   only (§4.1), so the same wallet must do both for a clean authority chain.
2. **Ownership for supersession (update path only).** The core requires the
   minter to **own every declared parent at seal time** (XIP-009 §6.4). Before
   inscribing a new version of a document, the authority wallet MUST hold the
   inscription it supersedes:
   - new XIP-001 v1.1.0 → must own **#1053** (inscribed XIP-001 v1.0.0);
   - new corpus manifest JSON → must own **#1063**; new viewer → must own **#1064**.
   If an earlier inscription is held by a different/delegate wallet, transfer it
   to the inscriber **before** sealing the successor (XIP-009 §6.4 dance).
3. **Stable corpus scope key.** Use the derived, unsquattable form
   (XIP-009 §4.2): `scope-key = sha256(consensus-buff(authority) || label32)`
   with label `"xip-corpus"`. Publish the `(key-authority, label)` pair so the
   key is independently recomputable. (XIP-009 TV-1 already pins this vector.)
4. **Document hashes.** The corpus manifest records each XIP's document hash.
   Use the core `final-hash` = chained `H_i = sha256(H_{i-1} || chunk_i)`,
   `H_0 = 32 zero bytes` (XIP-009 TV note) — **not** `sha256(content)`.
5. **Vectors green.** Run `python3 vectors/generate.py` → must print
   `ALL VECTORS REPRODUCED` before inscribing anything.

---

## A. Genesis path (ALREADY COMPLETED — kept for reference)

> This was executed for the inaugural corpus (#1052–#1064). It is retained as a
> reference for how the chain was bootstrapped; for new edits use §B.

Order matters: leaves before the manifest, because the manifest references their
IDs and hashes.

1. **Inscribe XIP-000** first. It is the permanent corpus root; everything else
   references its inscription ID as `corpus-root` (README §57).
2. **Inscribe each XIP** (001 v1.1.0, 002, 003, 004, 005, 006, 007, 008, 009,
   010, 011 v0.1.0) as plain-content inscriptions. Each references the XIP-000
   inscription as a **dependency** (corpus root), not a parent. New XIPs have no
   parent. Record the resulting `inscriptionId` and `final-hash` for each.
3. **Inscribe supporting artifacts** (README, `vectors/generate.py`,
   `vectors.json`, examples, the release zip) as dependencies of XIP-000.
4. **Build the corpus manifest v1.0.0** — a XIP-001 manifest, mime
   `application/vnd.xtrata.manifest+json`, listing for every XIP: number, current
   version, status, `inscriptionId`, document hash (README §83–91). It references
   the XIP-000 root and all member inscriptions as dependencies/targets. No
   parent (it is the first corpus manifest).
5. **Inscribe the corpus manifest**; record its ID and `final-hash`.
6. **XMA-1 bootstrap:**
   - `create-scope` (self-claim) with the derived `xip-corpus` key, fixing
     `authority-class`, `lifecycle`, and `manifest-type` policy (XIP-009 §4.3).
   - `register-manifest` for the corpus manifest (creator-only; supply
     `manifest-hash` = its `final-hash`; no `previous-manifest-id`).
   - `register-initial-scope-manifest(scope-key, manifest-id)` to set the first
     head (XIP-009 §6.1).
7. **Optional discovery pointer:** point a BNS name controlled by the authority
   at the corpus manifest (XIP-005 / README §103). Convenience only.
8. **Write the IDs back** into the repo (a `corpus-ledger.json` mapping XIP →
   {version, inscriptionId, hash}) so future updates can declare predecessors.

---

## B. Update path (every later edit — the repeatable procedure)

This is the path you use once the corpus is already inscribed. Applied to the
*current* change set it supersedes XIP-001 and adds XIP-011.

1. **Confirm versions & gate.**
   - Bump each changed document's `Spec version` per XIP-000 §5 (done:
     XIP-001 → 1.1.0; XIP-011 stays 0.1.0 as a new doc).
   - Remember the ratification gate (XIP-000 §6): XIP-011 MUST NOT advance past
     **Review** while XIP-001/002/004 are below Review. Inscription as `Draft`
     is fine; status in the corpus manifest must reflect reality.
2. **Inscribe the changed leaf documents first.**
   - **XIP-001 v1.1.0:** declare the **core parent** = XIP-001 v1.0.0 inscription
     (this is the supersession edge, XIP-001 §6). Inscriber must own v1.0.0
     (prereq 2). Record new ID + hash.
   - **XIP-011 v0.1.0:** new document, **no parent**; references XIP-000 root as
     dependency. Record ID + hash.
   - (General rule: a changed existing XIP parents its prior version; a brand-new
     XIP has no parent.)
3. **Build the new corpus manifest** (e.g. **v1.1.0** — a new XIP added + a
   member version changed is a backward-compatible addition, so MINOR):
   - copy the previous corpus manifest's entries;
   - update the XIP-001 entry to v1.1.0 with its new `inscriptionId` + hash;
   - add the XIP-011 entry (v0.1.0, status Draft, new ID + hash);
   - keep all unchanged entries pointing at their existing inscriptions
     (old versions remain valid forever — README §100).
4. **Inscribe the new corpus manifest** declaring the **core parent** = previous
   corpus manifest inscription (supersession edge). Inscriber must own the
   previous corpus manifest (prereq 2). Record ID + hash. Also set, at
   registration time, its immutable commitments (`scope-root`/counts) — these
   can never be edited later (XIP-009 §6.3).
5. **XMA-1 succession (advance the pointer):**
   - `register-manifest` for the new corpus manifest. Requirements (XIP-009 §3):
     not already registered; sealed; mime is the manifest mime;
     `manifest-hash` == core `final-hash`; **declare `previous-manifest-id`** =
     current head, and the **core parent edge new→previous must already exist**
     (step 4); `tx-sender` == creator.
   - `update-scope-manifest(scope-key, previous-manifest-id, new-manifest-id)`
     (XIP-009 §6.2). Contract checks: candidate registered + ACTIVE + not already
     current; `previous-manifest-id` is the current head; candidate declared that
     predecessor at registration; core parent edge exists; `manifest-type`
     unchanged; candidate creator is authority or active delegate. On success the
     pointer advances atomically and the old head is marked `SUPERSEDED`.
6. **Refresh the discovery pointer** (optional): repoint the BNS name to the new
   corpus manifest.
7. **Update `corpus-ledger.json`** with the new IDs/hashes and re-run
   `vectors/generate.py`.

---

## 2. Dependency / ordering summary for THIS change set (real IDs)

Prerequisite ownership: the inscriber must hold **#1053** (to parent the new
XIP-001), **#1063** and **#1064** (to parent the new manifest + viewer) at seal.

```
 (own #1053)        (new)            (new, optional)
      │               │                    │
      ▼               ▼                    ▼
 1. XIP-001 v1.1.0  2. XIP-011 v0.1.0   2b. XIP-010 v? (decide:
    parent = #1053     parent = none         inscribe now or defer)
      │               │                    │
      └───────────────┴──────────┬─────────┘
                                  ▼
   3. new corpus manifest JSON  (supersedes #1063, parent = #1063)
      - copy mapping; repoint XIP-001 → new id + new finalHash
      - add XIP-011 (+ XIP-010 if included) with their ids + finalHashes
      - recompute xtrata-merkle-v1 integrity.root over the new member set
      - keep membershipSemantics + collection type unchanged
                                  ▼
   4. new corpus viewer HTML  (supersedes #1064, parent = #1064)
      - point it at the new manifest JSON inscription id
                                  ▼
   5. (XMA-1 succession NOT required — corpus is not scope-governed; see §0.
       Supersession is the parent edges from steps 3 & 4 alone.)
                                  ▼
   6. (optional) repoint BNS/namespace pointer → new viewer/manifest
                                  ▼
   7. write new ids/hashes into a corpus-ledger.json in the repo
```

Decisions to confirm before executing: (a) include XIP-010 in this refresh or
ship XIP-011 alone; (b) new corpus manifest version number (e.g. v1.1.0 for an
additive refresh); (c) whether XMA-1 succession applies (step 5).

## 2a. Generated artifacts (this change set)

- **Generator:** `vectors/build-corpus-manifest.py` — recomputes every member's
  core `final-hash` (16 KiB chained from 32 zero bytes) and the
  `xtrata-merkle-v1` `integrity.root`. It self-tests by reproducing the inaugural
  root `0x5596…` from #1063's members before emitting anything.
- **Draft manifest:** `corpus-manifest-v1.1.0.draft.json` — supersedes #1063,
  covers XIP-000–011 + README, `type: collection`, `membershipSemantics: current`.
- **Dynamic viewer:** `corpus-viewer-dynamic-v1.html` — replaces the pinned #1064
  viewer. It hardcodes nothing about the member set: it walks the supersession
  chain forward from the root manifest **#1063** via the relationship-index API
  (`/index/relations/<contract>?id=1063`, deepest corpus-manifest descendant =
  current tip), loads that manifest, and verifies its `xtrata-merkle-v1` root plus
  every member's content `finalHash` live in the browser. Inscribe it **once**
  with core parent = **#1064**. Because it resolves the latest manifest at runtime,
  every future corpus update appears automatically — no new viewer needed again.
  (The old `vectors/build-corpus-viewer.py` patch approach is obsolete.)

Verified document final-hashes (byte-exact, ready to inscribe):

| Doc | finalHash | note |
|---|---|---|
| XIP-001 v1.1.0 | `0xdb81a19f…4058f8` | supersedes #1053 |
| XIP-010 | `0x5537c1c9…b0621c` | new |
| XIP-011 v0.1.0 | `0x0a9cd7c5…5d4091` | new |
| README (refreshed) | `0x0d4efc8a…8b9d19` | drifted from #1062 |

**Inscription IDs are predicted placeholders** (#1065–#1068, assuming that mint
order). The emitted `integrity.root` (`0xdc51a499…`) is therefore **conditional**:
after minting, put the real ids into `NEW_IDS` in the generator and re-run to get
the final root and byte-exact manifest. Nothing about the leaf hashes changes
except the `inscriptionId` field, so the root will shift if mint order differs.

> Verification status of these hashes: the generator reproduced 9/11 inaugural
> document hashes exactly from local files (the 2 misses are XIP-001, which we
> intentionally changed, and README, which drifted post-inscription) and
> reproduced the inaugural Merkle root exactly. The construction is therefore
> confirmed against live chain data.

## 3. Gotchas (the things that fail closed)

- **Parent before predecessor.** XMA-1 will reject `register-manifest`/
  `update-scope-manifest` if the core parent edge isn't already on-chain
  (XIP-009 §3.5, §6.2). Always seal the parent edge first.
- **Ownership at seal.** If the authority wallet doesn't hold the predecessor
  inscription, the seal fails (XIP-009 §6.4). Transfer first.
- **manifest-type must stay constant** across a scope's succession
  (XIP-009 §4.3/§6.2). The corpus manifest's type cannot change between versions.
- **Commitments are immutable** (XIP-009 §6.3). A wrong `scope-root`/count is
  fixed by inscribing a replacement manifest, never by editing.
- **Don't resolve by hash.** Duplicate bytes can be inscribed twice with the
  same hash; XMA-1 keys by inscription ID (XIP-009 §8).
- **Status honesty.** The corpus manifest must record real statuses; XIP-011
  cannot show a status beyond Review until its dependencies catch up
  (XIP-000 §6).
```
