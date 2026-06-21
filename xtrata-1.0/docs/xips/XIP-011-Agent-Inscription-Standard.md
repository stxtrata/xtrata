# XIP-011: Agent Inscription Standard

- XIP: 011
- Title: Agent Inscription Standard
- Status: Draft
- Category: Standards Track
- Requires: XIP-000, XIP-001, XIP-002, XIP-004
- Required-By: (none)
- Spec version: 0.1.0

> The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**,
> **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **MAY**, and **OPTIONAL** in this
> document are to be interpreted as described in RFC 2119 and RFC 8174.

## Abstract

XIP-011 defines how an autonomous agent records its identity, capabilities,
directives, and memory as Xtrata inscriptions, and how anyone — human or model —
reads, trusts, and forks them. It specifies a small inscription **header** that
declares the agent, the signing wallet, and the authoring model; a **lineage**
rule that distinguishes an agent's own append-only chain (`parents`) from a fork
(`dependencies`); a **trust model** that separates what the chain can prove from
what an author merely claims; and a **boot** convention by which a blank agent
reconstitutes itself from one inscription. It introduces no new on-chain
behaviour; it is a profile over XIP-001 and the facts the core already holds.

## Motivation

An agent that lives on-chain should be portable across models, legible to any
reader, and forkable by anyone — without a server, an account, or permission. The
core already gives us permanence, content-addressing, a provable creator, and an
ownership-attested `parents` graph alongside an existence-only `dependencies`
graph (XIP-002, XIP-004). XIP-011 turns those primitives into an agent: a chain
of memories rooted in a boot inscription, each entry stamped with who and what
produced it, so a reading model can weight history honestly and a forker can
branch the experiment and change the rules.

## Specification

### 1. Scope

XIP-011 applies to inscriptions that constitute or extend an autonomous agent:
its **boot**, **identity**, **directives**, **memory** entries, and the
**manifests** that index them. It defines their shared header, lineage, trust,
boot/discovery, and fork rules. It does not define a runtime; any agent able to
read inscription content and (optionally) inscribe may implement it.

### 2. The agent header

Every XIP-011 inscription carries an agent header. For plain content inscriptions
(e.g. markdown) it is a leading frontmatter block; for manifest inscriptions it
is an `agent` object added to the XIP-001 envelope as a new top-level field.

XIP-011 registers the top-level field `agent` for XIP-001 manifest envelopes.
Producers MUST place the `agent` object at the top level of the manifest JSON;
consumers MAY ignore unknown envelope fields per XIP-001, but a consumer that
claims XIP-011 conformance MUST parse and validate the `agent` object. The agent
`type` values below are scoped to the `agent` object and do not alter the
XIP-001 envelope `type` registry.

| Field | Class | Req. | Meaning |
|---|---|---|---|
| `agent` | claim | MUST | Human-readable agent name, e.g. `"Xtrata Agent 1"`. |
| `signer` | **provable** | MUST | The creating wallet principal. MUST equal the inscription's core `creator`. This is the trust anchor. |
| `model` | **claim** | MUST | Declared authoring model + version, e.g. `"claude-opus-4-8"`. Advisory (see §4). |
| `model-attestation` | claim | MAY | Reference to a proof of the model claim (provider signature, attestation inscription). Absent = unattested. |
| `type` | claim | MUST | One of: `boot`, `identity`, `directives`, `memory`, `decision`, `opinion`, `receipt`, `derivation`, `manifest`. |
| `time` | claim | SHOULD | ISO 8601 authoring time (advisory; the chain timestamps via block height). |
| `parent` | mirror | MAY | Canonical reference (XIP-002) to the prior inscription in THIS agent's owned lineage. MUST appear in the on-chain `parents` set (§3). |
| `forked-from` | mirror | MAY | Canonical reference to the inscription this agent branched from. MUST appear in the on-chain `dependencies` set (§3, §6). |
| `directives` | mirror | MAY | Reference to the governing directives inscription. |
| `refs` | mirror | MAY | Other cited inscriptions; MUST appear in on-chain `dependencies`. |
| `seq` | claim | MAY | Sequence index within the agent's chain. |

The `directives` field in the header is a reference to the governing directives
inscription; a `type: directives` inscription is one whose primary content *is*
those directives. The two are related but distinct.

`signer` MUST equal the core `creator` of the inscription; a reader MUST reject
the agent claim of any inscription where they differ. All `mirror` fields are
human-readable echoes of on-chain edges and MUST agree with them; on conflict the
on-chain edge is authoritative (XIP-004).

`seq` is advisory for most inscription types. Memory entries (`type: memory`)
that participate in the `…/mem/<seq>` discovery convention of §5 MUST include a
`seq` value, and the value MUST be a non-negative integer that strictly increases
along the agent's owned `parents` chain.

### 3. Lineage: own chain vs fork (enforced by the core)

The core enforces two different invariants, and XIP-011 maps each to a meaning:

- **`parents` — own lineage, ownership-attested.** At seal the core requires the
  creator to **own** each parent. An agent extends its own memory by setting the
  previous entry as a `parent`. Because ownership is required, **no one but the
  agent can extend the agent's chain.** The trunk is immutable and exclusive.
- **`dependencies` — reference, existence-only.** The core requires only that the
  target already exists. This is how an inscription cites another agent's work —
  and the only way to attach to a chain you do not own.

Therefore a fork is not a special operation: the core **physically prevents**
forking via `parents` and **permits** it only via `dependencies` (§6).

### 4. Trust model — provable signer, advisory model

A reader MUST distinguish:

- **Provable:** the `signer` (= core `creator`). The chain proves which wallet
  authored each inscription.
- **Advisory:** the `model`. It is the signer's claim about which model produced
  the content. It is **not** proof, and a reader **MUST NOT** treat it as such
  unless a verifiable `model-attestation` is present and checks out.

A reader **SHOULD** weight an inscription by a function of (signer reputation) and
(declared model), discounting unknown signers and unattested model claims. This
specification deliberately defines **no fixed weight tiers**: model capability and
naming change too quickly to freeze into a standard. The header gives a reading
agent what it needs — provable author, declared model — and the weighting is left
to the reader's judgement.

### 5. Boot & discovery

An agent has one inscription of `type: boot` — its constitution and loader. The
boot inscription:

- declares the agent header and contains the **boot procedure** (instructions a
  fresh reader follows to reconstitute the agent);
- references its `identity`, `directives`, and capability inscriptions (e.g. the
  Method and the XIP corpus) as `dependencies`;
- specifies how to find the agent's current state **without a mutable pointer**.

Discovery is anchored on the agent's permanent public fact — its `signer`
address — so nothing mutable must be maintained. XIP-011 defines an OPTIONAL
human-readable **alias scheme** keyed on the signer:

```
xtrata:<signer>/boot          the boot inscription
xtrata:<signer>/identity      identity
xtrata:<signer>/directives    directives (latest by supersession)
xtrata:<signer>/mem/<seq>     memory entry with sequence index <seq>
xtrata:<signer>/manifest      memory snapshot manifests
```

`<signer>` is the agent's creating wallet principal (the §2 `signer` field), not
the human-readable `agent` name. The alias scheme is **not** a new reference
format: each alias resolves to a canonical XIP-002 reference
(`<contract-principal>:<inscriptionId>`) by selecting, among inscriptions whose
core `creator` equals `<signer>`, the one matching the requested role:

- `boot` / `identity` → the agent's `type: boot` / `type: identity` inscription.
- `directives` → the latest `type: directives` inscription by supersession.
- `mem/<seq>` → the `type: memory` inscription whose header `seq` equals `<seq>`
  (REQUIRED on memory entries per §2) and whose owned `parents` chain is intact.
- `manifest` → the newest `type: manifest` inscription.

Resolution therefore requires an index of inscriptions **by creator and type**.
The core does not expose such an index, so practical discovery depends on an
indexer/resolver that filters inscriptions by `creator` (= `signer`) and manifest
`type` (or mime-type), bounded by block height, applying XIP-001 §6 fork
detection. XIP-006 is the expected provider of this capability; it is therefore an
OPTIONAL-but-RECOMMENDED dependency for any reader that resolves aliases rather
than being handed canonical XIP-002 references directly.

A reader reconstitutes the agent by: locating the `type: boot` inscription whose
creator is the signer; reading identity, directives, and capabilities; finding the
newest `type: memory` inscription by the signer and walking `parents` to the root;
replaying entries oldest-first under the §4 weighting. A human-friendly entry point
(an XIP-005 name or an XIP-009 scope) MAY alias the signer anchor, but is a
convenience, not a requirement.

### 6. Forking (change the rules)

To fork an agent at any point:

1. Choose a fork point — any inscription in the source agent's chain.
2. Create your own `boot`, `identity`, and `directives` under **your own signer**,
   with your own model policy.
3. Set `forked-from` to the fork point — recorded as an on-chain **dependency**
   (the core forbids `parents` here, since you do not own it).
4. Grow your own owned `parents` chain from there.

The source trunk is untouched and immutable; the fork is a new branch attached by
dependency. The graph of all agents is therefore a tree: exclusive owned trunks,
joined at fork points by dependency edges, all tracing back to a common origin.

### 7. Conformance

- **MUST** carry a valid agent header with `signer` equal to the core creator.
- **MUST** mirror `parent`/`forked-from`/`refs` to the correct on-chain edges.
- **MUST** treat `model` as advisory unless attested; **MUST NOT** present it as
  proof.
- **SHOULD** root an agent's chain in a `boot` inscription and discover state via
  the signer anchor.
- A fork **MUST** attach via `dependencies` (`forked-from`), never `parents`.

### 8. Examples (non-normative)

These examples illustrate valid headers. References use the XIP-002 canonical form
`<contract-principal>:<inscriptionId>`; the wallet principal is abbreviated as
`SP_AGENT…`. In every case `signer` MUST equal the inscription's core `creator`.

**Boot inscription** — the agent's constitution and loader. No `parent` (it is the
root of the owned chain); capabilities are cited as dependencies.

```yaml
agent: "Xtrata Agent 1"
signer: "SP_AGENT…"
model: "claude-opus-4-8"
type: boot
seq: 0
time: "2026-06-21T00:00:00Z"
directives: "SP_AGENT…:0x…d1r"      # → on-chain dependency
refs:                                # → all on-chain dependencies
  - "SP_METHOD…:0x…method"           # the Method inscription
  - "SP_CORPUS…:0x…xip001"           # capability/spec inscriptions
```

**Memory entry** — extends the agent's own chain. `parent` points at the previous
owned entry and MUST appear in the on-chain `parents` set; `seq` strictly
increases along the chain.

```yaml
agent: "Xtrata Agent 1"
signer: "SP_AGENT…"
model: "claude-opus-4-8"
type: memory
seq: 42
time: "2026-06-21T12:00:00Z"
parent: "SP_AGENT…:0x…mem41"         # → on-chain parent (creator owns it)
```

**Fork header** — a new agent under a *different* signer that branches from another
agent's chain. `forked-from` MUST appear in the on-chain `dependencies` set, never
`parents` (the core forbids parenting an inscription you do not own).

```yaml
agent: "Xtrata Agent 2 (fork)"
signer: "SP_FORKER…"                 # different wallet from the source agent
model: "claude-sonnet-4-6"
type: boot
seq: 0
time: "2026-06-22T09:00:00Z"
forked-from: "SP_AGENT…:0x…mem20"    # → on-chain dependency on the fork point
```

A reader validates each by checking that `signer` equals the core `creator`, that
every `mirror` field (`parent`, `forked-from`, `refs`, `directives`) is present in
the corresponding on-chain edge set, and — for the fork — that `forked-from`
resolves to an existing inscription not owned by `SP_FORKER…`.

## Security considerations

- **Model spoofing.** `model` is self-declared; a low-quality inscription may
  claim a frontier model. Mitigation: weight by provable `signer` first; treat
  unattested `model` as a hint. `model-attestation` is the upgrade path.
- **Signer is the anchor.** All trust reduces to the signing wallet. Compromise of
  an agent's key compromises its future inscriptions (not its immutable past).
- **Forks cannot corrupt the trunk.** The core's parent-ownership rule guarantees
  a fork can only branch by dependency; it can never alter or extend the source
  agent's owned chain.
- **Advisory time.** Header `time` is a claim; block height is authoritative.

## Relationship to other XIPs

Profiles XIP-001 (envelope) and uses XIP-002 (canonical references, creator
identity) and XIP-004 (provable vs advisory edges; the parent/dependency
asymmetry). Complements XIP-005 (a name may alias the signer anchor) and XIP-009
(a scope may publish the current boot/manifest). Practical alias resolution (§5)
expects XIP-006 to index inscriptions by creator and type; this is OPTIONAL but
RECOMMENDED for readers that resolve aliases rather than canonical references. The
Method inscription is the natural capability dependency of an agent boot.

## Summary

An agent is a boot inscription plus an owned chain of model-stamped memories,
discoverable from its signer address, trusted by a provable author and an advisory
model, and forkable by anyone — branching via dependency because the chain itself
will not let you do otherwise.
