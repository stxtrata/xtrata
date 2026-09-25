# Reporting and evidence

Keep this log current as work lands, so milestone reports are a copy-and-paste job.

## Evidence log

| Date | Milestone item | Evidence | Link / tx id |
|---|---|---|---|
| 2026-09-24 | 1.2 groundwork | G1/G2 templates tested on 11 real archived sources: 428/428 simnet checks | `forever-twins-g1-g2-templates.patch` |
| 2026-09-25 | 1.2 groundwork | v3 fixed-fee template: 341/341 checks in a scratch simnet (core stand-in) | `forever-twins-v3-fixed-fee.patch` |
| 2026-09-25 | 1.2 groundwork | Both patches applied to `xtrata` branch `forever-twins-v3`; every suite run in the real harness with the real `xtrata-v3-2-3` core: existing 60, acceptance-v2 70, families 306, family-suite-v3 453, manifest pipeline 24, registry decoder 26, shared probe 8, live-check-vs-simnet 12 (959/959) | commits `cfabc4c31`, `1265d5979`, `380d2ac1a`, `390420c9b`; `ft-harness/results/*.json` |
| 2026-09-25 | 1.2 groundwork | Core hash check confirmed from source and tests: `mint-single-tx` rejects any chunk that doesn't reproduce the record's content hash (u103) or length (u102). Deployed mainnet core matches the repo copy in every relevant function | `project/architecture.md` |
| 2026-09-25 | 1.6 groundwork | Manifest builder, seeding plan (unsigned) and read-only checker written and tested end to end in simnet | `ft-harness/manifest/`, `results/manifest-pipeline.json` |
| 2026-09-25 | 1.2 research | Candidate research: 3 picks + backup; four Stacks Art collections found with dead metadata (preservation-risk finding) | `project/collections.md` |
| 2026-09-25 | 1.2 groundwork | Large-file support in the v3 helper (D14): `bind-preinscribed`, records up to 32 MiB, finalise gated on all large entries bound. prebind-v3 62/62 (G1 + G2), mutation-checked; full harness 1177/1177. See Yourself Out and Bitcoin Monkeys added to the family suites | `ft-harness/V3-LARGE-FILES.md`, `results/prebind-v3.json` |
| 2026-09-25 | 1.3 groundwork | Registry v1 (JSON + page + verifier) lists the 3 live v1 helpers; read live from mainnet, code hashes match | `ft-harness/registry/`, `results/registry-check.json` |
| | 1.2 | Helper #1 deployed | TBD |
| | 1.2 | Helper #1 canonical record finalised; manifest published | TBD |
| | 1.2 | Helper #2 deployed and finalised | TBD |
| | 1.2 | Helper #3 deployed and finalised | TBD |
| | 1.3 | Registry published | TBD |
| | 1.1 | Preservation service live | TBD |
| | 1.4 | Explainer and guide published | TBD |
| | 1.5 | Onboarding docs published | TBD |
| | 1.6 | Repo public, licence added | TBD |

## Per-collection record

| Collection | Group | Helper contract | Finalised (block) | Canonical count | Manifest hash | Inscriptions | Swaps in | Unique holder wallets |
|---|---|---|---|---|---|---|---|---|
| TBD | | | | | | | | |

Counts come from helper events (`inscribed`, `swap-original-for-twin`, `swap-twin-for-original`)
and from `get-twin-interface` / `get-custody-state`. "Unique wallets with a twin resolved to them"
means distinct current owners of twins, read through the registry.

## Final recap template (Milestone 2)

1. **Collections preserved**: list, group (G1/G2), helper address, date finalised.
2. **Self-serve deployments**: which collections used the self-serve flow (target at least 2).
3. **Forever Twins minted**: total inscriptions, by collection.
4. **Unique wallets with twins resolved to them**: number and how counted (target at least 25).
5. **Custody figures**: originals held by helpers, twins circulating, any inconsistent or
   stranded states reported by `get-custody-state`, rescues executed.
6. **Community response and feedback**.
7. **Preservation-risk findings**: for each collection checked, where the art lived and whether it
   still resolved; collections found already broken.
8. **Key learnings and next steps**.
