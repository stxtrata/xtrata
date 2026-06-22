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

Every XIP-011 inscription carries an agent header. It takes one of two forms
depending on the inscription's mime type:

- **Manifest form** (mime `application/vnd.xtrata.manifest+json`): the header is
  an `agent` object placed at the top level of the XIP-001 envelope.
- **Plain-content form** (e.g. `text/markdown`): the header is a leading
  frontmatter block. The block MUST be valid YAML 1.2 delimited by `---` fences
  as the first bytes of the content, containing the header fields below as a YAML
  mapping under a top-level `agent:` key.

A consumer detects the form from the mime type; the field semantics are identical
across both forms.

XIP-011 registers two things in the XIP-001 envelope:

1. The envelope `type` value **`agent`** (added to the XIP-001 §1.1 registry). A
   manifest-form agent inscription MUST set the envelope `type` to `"agent"`.
2. The top-level envelope field **`agent`** carrying the header object. Producers
   MUST place the `agent` object at the top level of the manifest JSON; consumers
   MAY ignore unknown envelope fields per XIP-001, but a consumer that claims
   XIP-011 conformance MUST parse and validate the `agent` object.

The `agent.type` values below are an inner classification scoped to the `agent`
object; they are distinct from the XIP-001 envelope `type` (which is always
`"agent"` for manifest-form inscriptions) and do not alter the XIP-001 `type`
registry beyond the single `agent` value registered above.

| Field | Class | Req. | Meaning |
|---|---|---|---|
| `name` | claim | MUST | Human-readable agent name, e.g. `"Xtrata Agent 1"`. (Nested under the `agent` object/key, so it does not collide with the XIP-001 envelope `name`.) |
| `signer` | **provable** | MUST | The creating wallet principal. MUST equal the inscription's core `creator`. This is the trust anchor. |
| `model` | **claim** | MUST | Declared authoring model + version, e.g. `"claude-opus-4-8"`. Advisory (see §4). |
| `model-attestation` | claim | MAY | Reference to a proof of the model claim (provider signature, attestation inscription). Absent = unattested. No attestation format is defined in this version (see §4). |
| `type` | claim | MUST | One of the values in the `agent.type` registry below. |
| `time` | claim | SHOULD | ISO 8601 authoring time (advisory; the chain timestamps via block height). |
| `parent` | mirror | MAY | Canonical reference (XIP-002) to the prior inscription in THIS agent's owned lineage. MUST appear in the on-chain `parents` set (§3). |
| `forked-from` | mirror | MAY | Canonical reference to the inscription this agent branched from. MUST appear in the on-chain `dependencies` set (§3, §6). |
| `directives` | mirror | MAY | Reference to the governing directives inscription. |
| `refs` | mirror | MAY | Other cited inscriptions; MUST appear in on-chain `dependencies`. |
| `seq` | claim | MAY | Sequence index within the agent's chain. REQUIRED for `type: memory` (§2 rules below). |

**`agent.type` registry.** The `type` field MUST be one of:

| Value | Meaning |
|---|---|
| `boot` | The agent's constitution and loader; the single root of its chain (§5). |
| `identity` | A description of who the agent is (persona, owner, public keys). |
| `directives` | The governing instructions/policy the agent operates under. |
| `memory` | An append-only experience/state entry in the owned chain. |
| `decision` | A record of a choice the agent made and the reasoning for it. |
| `opinion` | A stated judgement or preference that is not a committed decision. |
| `receipt` | An acknowledgement that an external action or obligation occurred. |
| `derivation` | Content produced by transforming a cited source (recorded in `refs`). |
| `snapshot` | A manifest indexing a point-in-time view of the agent's memory. |

The `directives` field in the header is a reference to the governing directives
inscription; a `type: directives` inscription is one whose primary content *is*
those directives. The two are related but distinct.

`signer` MUST equal the core `creator` of the inscription; a reader MUST reject
the agent claim of any inscription where they differ. All `mirror` fields are
human-readable echoes of on-chain edges and MUST agree with them; on conflict the
on-chain edge is authoritative (XIP-004).

**Memory-chain sequencing.** Every `type: memory` inscription MUST include a
`seq`. The chain shape is fixed so that `…/mem/<seq>` resolution (§5) is
deterministic:

- The first memory entry MUST set `seq: 1` and set its `parent` to the agent's
  `boot` inscription.
- Each subsequent memory entry MUST set `seq = parent.seq + 1`, where `parent` is
  the immediately preceding memory entry in the agent's owned chain.
- A reader MUST fail closed (treat the lookup as `CONFLICT`, returning no result)
  if two valid memory inscriptions under the same agent resolve to the same `seq`,
  or if the chain has more than one valid tip.

For non-memory types, `seq` is advisory. When present on a non-memory inscription
it SHOULD be unique among that signer's inscriptions and MUST NOT duplicate a
`seq` used by any of the signer's memory entries.

**Same-signer lineage.** An on-chain `parent` edge extends an agent's owned chain
only if both the parent and the child are valid XIP-011 inscriptions whose
`signer == core creator == the agent's signer`. The core proves the sealer
*owned* the parent at seal time (XIP-004), which is not the same as creator
continuity: an inscription can be transferred, after which a different wallet
could seal a child against it. Such an edge MAY be displayed as provenance but
MUST NOT be treated as extending the agent's memory chain.

### 3. Lineage: own chain vs fork (enforced by the core)

The core enforces two different invariants, and XIP-011 maps each to a meaning:

- **`parents` — own lineage, ownership-attested.** At seal the core requires the
  creator to **own** each parent. An agent extends its own memory by setting the
  previous entry as a `parent`. While the agent still holds its chain, no other
  wallet can append to it via `parents`, so the trunk is exclusive and its past is
  immutable. (Ownership at seal is not the same as creator continuity; the
  same-signer rule in §2 is what binds a parent edge to a *specific* agent.)
- **`dependencies` — reference, existence-only.** The core requires only that the
  target already exists. This is how an inscription cites another agent's work —
  and the only way to attach to a chain you do not own.

Therefore a fork is not a special operation: the core **prevents** appending to a
chain you do not own via `parents` and **permits** attaching to it only via
`dependencies` (§6).

### 4. Trust model — provable signer, advisory model

A reader MUST distinguish:

- **Provable:** the `signer` (= core `creator`). The chain proves which wallet
  authored each inscription.
- **Advisory:** the `model`. It is the signer's claim about which model produced
  the content. It is **not** proof. This version of XIP-011 defines **no**
  `model-attestation` verification format, so a reader **MUST** treat `model` as
  advisory in all cases. The `model-attestation` field is reserved: a future XIP
  may define an attestation format (e.g. a provider signature over the content
  hash), at which point a reader MAY elevate an attested claim once it verifies.

Weighting of inscriptions by signer and declared model is an application-level
concern; this specification deliberately defines **no fixed weight tiers**, since
model capability and naming change too quickly to freeze into a standard. A reader
**MAY** weight history by provable signer and declared model, discounting unknown
signers and unattested model claims. The header gives a reading agent what it
needs — provable author, declared model — and leaves the weighting to its
judgement.

### 5. Boot & discovery

An agent **MUST** root its chain in exactly one current `type: boot` inscription —
its constitution and loader. A boot may be superseded over time via the on-chain
`parents` relation (XIP-001 §6); the *current* boot is the tip of that
supersession chain. The boot inscription:

- declares the agent header and contains the **boot procedure** (instructions a
  fresh reader follows to reconstitute the agent);
- references its `identity`, `directives`, and capability inscriptions (e.g. the
  Method and the XIP corpus) as `dependencies`;
- specifies how to find the agent's current state **without a mutable pointer**.

**One agent per signer (this version).** XIP-011 v0.1 assumes a signer operates at
most one agent. All aliases below are keyed on the signer alone. If a signer holds
more than one valid candidate for a single-valued role (e.g. two unsuperseded
`boot` inscriptions, or two memory tips), a reader **MUST** fail closed and return
`CONFLICT` rather than guess. A future version may add an explicit `agent-id` (or
`root`) field so one signer can operate multiple agents; until then, multi-agent
signers are out of scope.

Discovery is anchored on the agent's permanent public fact — its `signer`
address — so nothing mutable must be maintained. XIP-011 defines an OPTIONAL
human-readable **alias scheme** keyed on the signer:

```
xtrata:<signer>/boot          current boot inscription
xtrata:<signer>/identity      current identity
xtrata:<signer>/directives    current directives
xtrata:<signer>/mem/<seq>     memory entry with sequence index <seq>
xtrata:<signer>/snapshot      current memory snapshot manifest
```

`<signer>` is the agent's creating wallet principal (the §2 `signer` field), not
the human-readable agent `name`. The alias scheme is **not** a new reference
format: each alias resolves to a canonical XIP-002 reference
(`<contract-principal>:<inscriptionId>`). Resolution considers only inscriptions
whose core `creator` equals `<signer>`, then selects by role. For every
single-valued role (`boot`, `identity`, `directives`, `snapshot`) the reader
selects the **current version** — the tip of the on-chain `parents` supersession
chain for inscriptions of that `agent.type`, using the same `latestVersion`
selection and fail-closed-on-fork behaviour defined in XIP-001 §6 (and reused by
XIP-006 §2). Specifically:

- `boot` / `identity` / `directives` → the current (latest, fork-free) inscription
  of that `agent.type`. Multiple unsuperseded candidates → `CONFLICT`.
- `mem/<seq>` → the `type: memory` inscription whose header `seq` equals `<seq>`
  (REQUIRED per §2), validated against the same-signer and sequencing rules of §2.
  Duplicate `seq` or a broken chain → `CONFLICT`.
- `snapshot` → the current (latest, fork-free) `type: snapshot` inscription.

Fork detection applies to **all** agent inscriptions, manifest-form or
plain-content: it is performed against the core `parents` graph by `agent.type`,
exactly as XIP-001 §6 defines for manifests, rather than against any envelope
field. Plain-content inscriptions therefore participate in supersession through
their on-chain `parents` edges.

Resolution requires enumerating inscriptions **by creator and `agent.type`**. The
core does not expose such an index, and XIP-006 as currently specified resolves a
*given* reference but does not define a creator/type enumeration query. Practical
alias resolution therefore depends on an indexer that filters by `creator`
(= `signer`) and `agent.type` (or mime-type), bounded by block height, applying
the §6/§2 fork and sequencing rules. Standardising this enumeration is a proposed
addition to XIP-006; until then it is an implementation-defined indexer capability,
and readers handed canonical XIP-002 references directly need no such index.

A reader reconstitutes the agent by: resolving the current `boot` for the signer;
reading identity, directives, and capabilities; resolving the latest memory tip
and walking `parents` to the root (applying the §2 same-signer rule at each hop);
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
dependency. The graph of all agents is therefore a **forest of exclusive owned
trunks joined by dependency edges** — a directed acyclic graph, not a single tree:
an agent may fork from multiple points or sources, and independent agents need not
share a common origin. The invariant that holds is local: each owned trunk is
exclusive and immutable.

### 7. Conformance

- **MUST** carry a valid agent header with `signer` equal to the core creator.
- Manifest-form inscriptions **MUST** set the envelope `type` to `"agent"` and
  carry the header in the top-level `agent` object; plain-content inscriptions
  **MUST** carry it as the YAML frontmatter defined in §2.
- **MUST** mirror `parent`/`forked-from`/`directives`/`refs` to the correct
  on-chain edges.
- **MUST** treat `model` as advisory; **MUST NOT** present it as proof (no
  attestation format is defined in this version).
- **MUST** root an agent's chain in exactly one current `boot` inscription.
- `type: memory` inscriptions **MUST** follow the §2 sequencing rules; resolvers
  **MUST** fail closed on duplicate `seq`, multiple tips, or fork.
- A fork **MUST** attach via `dependencies` (`forked-from`), never `parents`.

### 8. Examples (non-normative)

References use the XIP-002 canonical form `<contract-principal>:<inscriptionId>`,
where the contract is the Xtrata core (`SP….xtrata-v3-2-3`) and the id is an
unsigned integer. Wallet principals are abbreviated (`SP3J…AGENT`,
`SP9K…FORKER`). In every case `signer` MUST equal the inscription's core
`creator`.

**Boot inscription (manifest form).** A full XIP-001 envelope: `type` is `"agent"`,
the header lives in the top-level `agent` object, and capabilities are cited as
on-chain dependencies. It is the root of the chain, so it has no `parent`.

```json
{
  "standard": "xip-001",
  "specVersion": "1.0.0",
  "type": "agent",
  "name": "Xtrata Agent 1 — boot",
  "defaultContract": "SP3J…AGENT.xtrata-v3-2-3",
  "agent": {
    "name": "Xtrata Agent 1",
    "signer": "SP3J…AGENT",
    "model": "claude-opus-4-8",
    "type": "boot",
    "time": "2026-06-21T00:00:00Z",
    "directives": "SP3J…AGENT.xtrata-v3-2-3:412",
    "refs": [
      "SP7M…METHOD.xtrata-v3-2-3:88",
      "SP7C…CORPUS.xtrata-v3-2-3:101"
    ]
  }
}
```

(`directives` and every entry in `refs` MUST also be present in the inscription's
on-chain `dependencies` set.)

**Memory entry (plain-content form).** A `text/markdown` inscription whose first
bytes are a YAML frontmatter block. `parent` is the previous owned memory entry
and MUST appear in the on-chain `parents` set; `seq = parent.seq + 1`.

```markdown
---
agent:
  name: "Xtrata Agent 1"
  signer: "SP3J…AGENT"
  model: "claude-opus-4-8"
  type: "memory"
  seq: 42
  time: "2026-06-21T12:00:00Z"
  parent: "SP3J…AGENT.xtrata-v3-2-3:540"
---

Today I learned that the resolver fails closed on duplicate seq…
```

**Fork boot (manifest form).** A new agent under a *different* signer that branches
from a source agent's chain. `forked-from` MUST appear in the on-chain
`dependencies` set, never `parents` (the core forbids parenting an inscription you
do not own).

```json
{
  "standard": "xip-001",
  "specVersion": "1.0.0",
  "type": "agent",
  "name": "Xtrata Agent 2 (fork) — boot",
  "defaultContract": "SP9K…FORKER.xtrata-v3-2-3",
  "agent": {
    "name": "Xtrata Agent 2 (fork)",
    "signer": "SP9K…FORKER",
    "model": "claude-sonnet-4-6",
    "type": "boot",
    "time": "2026-06-22T09:00:00Z",
    "forked-from": "SP3J…AGENT.xtrata-v3-2-3:520"
  }
}
```

A reader validates each by checking that `agent.signer` equals the core `creator`;
that every `mirror` field (`parent`, `forked-from`, `directives`, `refs`) is
present in the corresponding on-chain edge set; that each `parent` hop satisfies
the §2 same-signer rule; and — for the fork — that `forked-from` resolves to an
existing inscription **not** owned/created by the forker's signer.

## Security considerations

- **Model spoofing.** `model` is self-declared; a low-quality inscription may
  claim a frontier model. Mitigation: weight by provable `signer` first; treat
  `model` as advisory always. A future `model-attestation` format is the upgrade
  path.
- **Name spoofing.** The agent `name` is a free-text claim; a different signer may
  reuse another agent's `name`. Identity reduces to the `signer`, never the name;
  readers MUST NOT treat a matching `name` as identity.
- **Signer is the anchor.** All trust reduces to the signing wallet. Compromise of
  an agent's key compromises its future inscriptions (not its immutable past).
  Loss of the key freezes the agent: no one can extend the chain, but a forker can
  continue the experiment under a new signer via `forked-from`.
- **Transferred memory inscriptions.** Ownership at seal is not creator continuity
  (XIP-004). If a memory inscription is transferred, another wallet could seal a
  child against it. The §2 same-signer rule prevents such an edge from extending
  the original agent's chain; it is provenance only.
- **Conflict / fail-closed.** Duplicate `boot`, duplicate `seq`, multiple chain
  tips, or a fork in a single-valued role MUST cause resolution to fail closed
  (`CONFLICT`) rather than silently pick one, preventing state-confusion attacks.
- **Forks cannot corrupt the trunk.** The core's parent-ownership rule plus the
  §2 same-signer lineage rule guarantee a fork can only branch by dependency; it
  can never alter or extend the source agent's owned chain.
- **Advisory time.** Header `time` is a claim; block height is authoritative.

## Relationship to other XIPs

Profiles XIP-001 (envelope, registering the `agent` type and field; supersession
and fork detection per §6) and uses XIP-002 (canonical references, creator
identity) and XIP-004 (provable vs advisory edges; the parent/dependency
asymmetry). Complements XIP-005 (a name may alias the signer anchor) and XIP-009
(a scope may publish the current `boot`/`snapshot`). XIP-006 supplies the shared
resolution/supersession behaviour reused in §5; note that the creator/`agent.type`
**enumeration** that alias discovery needs is not yet specified by XIP-006 and is
proposed as an addition there. The Method inscription is an external capability
(defined elsewhere) cited as a dependency of an agent boot, not by this XIP.

> **Editor's note (process).** Per XIP-000 §6, XIP-011 MUST NOT advance past
> Review while any of its `Requires` (XIP-001, XIP-002, XIP-004) remain below
> Review. This is a ratification-ordering gate, not a defect in this document.

## Summary

An agent is a boot inscription plus an owned chain of model-stamped memories,
discoverable from its signer address, trusted by a provable author and an advisory
model, and forkable by anyone — branching via dependency because the chain itself
will not let you do otherwise.
