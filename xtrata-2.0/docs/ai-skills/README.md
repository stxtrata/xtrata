> ## ⚠️ Contract version: read this before following anything below
>
> **The live core is `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`.**
>
> This document still carries `xtrata-v2-1-0` in its header, examples and API
> tables. **Those references are stale. Ignore them.** They are not a second
> supported option and not a "legacy but still fine" path — v2-1-0 is
> superseded. Mint, seal, transfer and query against `xtrata-v3-2-3`.
>
> **The only legitimate use of an old core is migration.** To move an
> inscription you already own from v2 to v3, call `migrate-from-v2-1-0` (or
> `migrate-from-v1`) **on `xtrata-v3-2-3`**. You never send a transaction to
> the old contract yourself; the new core pulls the token across. Anything
> else that asks you to target v2-1-0 or v1-1-1 directly is wrong.
>
> **Why this matters beyond tidiness.** An inscription minted into v2-1-0 today
> lands in a superseded contract. The marketplace contracts that accept v2-1-0
> (`xtrata-market-{stx,sbtc,usdc}-v1-0`) weld that core in at deploy time and
> cannot be changed, and the markets that accept v3 will not take a v2 token.
> Picking the wrong core strands the asset on the wrong side of that line.
>
> The shapes below (chunking, hashing, post-conditions, the staged
> begin/upload/seal flow) are still correct. Only the contract name is wrong.
> v3-2-3 additionally offers `mint-single-tx` for anything up to 32 chunks,
> which is the preferred route for most single files.


# AI Skills

Self-contained skill documents for teaching AI agents to use Xtrata. Each skill
doc follows the `skill-<name>.md` naming convention and is designed to be small
enough to inscribe on-chain where practical.

## Skills

| File | Description |
|------|-------------|
| [`skill-inscribe.md`](skill-inscribe.md) | Single-item inscription skill. Covers helper-route single-tx minting for `<=30` chunks plus the standard staged flow, with cost estimation and user confirmation gate. |
| [`skill-batch-mint.md`](skill-batch-mint.md) | Batch mint skill for coordinated drops of `1..50` non-recursive items. Covers core `seal-inscription-batch` and collection `mint-seal-batch`, with deterministic ordering, dedupe, staged uploads, and final batch seal. |
| [`skill-transfer.md`](skill-transfer.md) | Transfer inscriptions between wallets with ownership checks, escrow/twin detection, deny-mode NFT post condition, and post-transfer verification. |
| [`skill-query.md`](skill-query.md) | Read-only queries: metadata, ownership, content reconstruction, dependencies, and the relationship index. No wallet or fees. |

## Canonical Skill File

The comprehensive reference covering all Xtrata operations (inscribe, transfer,
query, batch seal, full API tables) remains at:

- [`XTRATA_AGENT_SKILL.md`](../../XTRATA_AGENT_SKILL.md)

Individual `skill-*.md` files are lean subsets optimised for single-purpose
agent training and on-chain inscription.

## Index & Relationship Maintenance

Reading and displaying inscription relationships (parents/children/descendants)
is backed by the D1 inscription index, which **stays current automatically** —
new mints with parents are indexed during normal sync, with no agent action
required. Agents that read relationships should use:

- `GET /index/relations/<contract>?id=<id>` — derived relationship graph.
- `GET /index/page?primary=&lineage=&ids=…` — lineage summaries in one query.

The one manual maintenance action is the **parent-edge backfill**
(`POST /index/<contract>?parents=backfill`), needed only after the edge table is
introduced or old rows are imported. When `INDEX_ADMIN_TOKEN` is configured it
requires a matching `x-admin-token` header (else `401`). Full procedure, auth,
pagination, and troubleshooting:
[`../inscription-relationship-index.md`](../inscription-relationship-index.md).

## Training Tracks

- **aibtc track**: [`aibtc-agent-training.md`](aibtc-agent-training.md) — For
  agents using MCP wallet tools and Hiro endpoints through aibtc flows.
- **Generic agent track**: [`generic-agent-training.md`](generic-agent-training.md) —
  For non-aibtc agents (custom frameworks, direct SDK/library integrations).

## Suggested Order

1. Read the relevant `skill-*.md` for your use case:
   - [`skill-inscribe.md`](skill-inscribe.md) for one-item mints.
   - [`skill-batch-mint.md`](skill-batch-mint.md) for coordinated drops of `2..50` items.
2. Choose a training track (`aibtc` or `generic`) for environment-specific setup.
3. Rehearse all supported routes separately before production use:
   - helper-route single-item
   - staged single-item
   - staged batch seal
4. Promote to mainnet only after successful dry runs, confirmation gating, and post-condition checks.

## Safety Baseline

- Always use `PostConditionMode.Deny` on fee-paying writes.
- Check `get-fee-unit` before building spend caps.
- Present costs to the user and get confirmation before any transaction.
- Keep retry logic bounded and back off on `429` / `5xx` responses.
- Log tx IDs and hash/token mappings for auditability.
- Treat ordered manifests as authoritative for batch jobs so token-to-file mapping remains deterministic.
- Batch seal is currently non-recursive only. If dependencies are required, mint items individually.
- There is no current multi-file helper path. `mint-small-single-tx` remains single-item only.

## Canonical GitHub References

- [`XTRATA_AGENT_SKILL.md`](https://github.com/stxtrata/xtrata/blob/OPTIMISATIONS/xtrata-1.0/XTRATA_AGENT_SKILL.md)
- [`scripts/xtrata-mint-example.js`](https://github.com/stxtrata/xtrata/blob/OPTIMISATIONS/xtrata-1.0/scripts/xtrata-mint-example.js)
- [`scripts/xtrata-transfer-example.js`](https://github.com/stxtrata/xtrata/blob/OPTIMISATIONS/xtrata-1.0/scripts/xtrata-transfer-example.js)
- [`scripts/xtrata-query-example.js`](https://github.com/stxtrata/xtrata/blob/OPTIMISATIONS/xtrata-1.0/scripts/xtrata-query-example.js)
