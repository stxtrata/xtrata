# SDK Completion + Machine-Readable Docs (llms.txt) — Implementation Plan

Date: 2026-07-21. Scope: `xtrata-2.0` repo (packages/, scripts/sdk/, docs/, public/), with `xtrata-1.0/docs/sdk` as the doc source to port.

## Where things stand (audit summary)

**Packages.** `@xtrata/sdk` 0.1.0 and `@xtrata/reconstruction` 0.1.0 exist in both repos and are structurally healthy: full ESM exports map with per-module subpaths and types, `prepack` build, tests per module, export/capability/error contract tests, pack-smoke and examples-tarball smoke, and a full `sdk:release:dry-run` gate wired into the root package.json. No TODO/stub markers in source. This is close to publishable, not half-built.

**Gaps found:**

1. **Docs live in the wrong repo.** `xtrata-2.0` has `scripts/sdk/docs-validate.mjs` pointing at `docs/sdk/`, but that directory only exists in `xtrata-1.0`. So `sdk:docs:validate` (and therefore `sdk:release:dry-run`) cannot pass in 2.0. The 1.0 docs are also stale relative to 2.0 (no sponsored market, no Clarity 4 escrow notes, no wizard).
2. **No payment/asset surface in the SDK.** Zero references to sBTC, USDC/USDT, or sponsored transactions in `packages/xtrata-sdk/src`. The sponsored-buy logic exists only in the app (`src/lib/market/sponsor-client.ts`, `functions/sponsor/`). Per the project goal (payments beyond STX), the SDK needs an asset/payment abstraction and a sponsored-tx planner.
3. **npm-publish metadata missing.** Neither package.json has `license`, `repository`, `description`, `keywords`, `engines`, or `publishConfig` (scoped packages default to private access). No LICENSE file in the package dirs.
4. **No machine-readable docs anywhere.** No `llms.txt`, no typedoc output, no OpenAPI for the worker endpoints, no machine-readable capability/contract manifest. The agent-facing docs (`XTRATA_AGENT_SKILL.md`, `docs/ai-skills/`) are excellent but human-markdown only, and two planned skills (`skill-transfer.md`, `skill-query.md`) are still unwritten.
5. **Version/changelog drift risk.** Both packages sit at 0.1.0 while the 2.0 surface has grown (workflows caps, backup-migration, safe recovery). The 1.0 `docs/sdk/changelog.md` won't match.

## Phase 1 — Bring the SDK docs home and make gates green (½ day)

- Copy `xtrata-1.0/docs/sdk/` → `xtrata-2.0/docs/sdk/` (including archive/), then refresh content for the 2.0 surface: 30-chunk upload ceiling wording (already correct), Clarity 4 sponsored market contracts, collection-mint v1.4 target, wizard entry points.
- Fix cross-repo links the validator will flag (`docs/reconstruction-spec.md`, `docs/standards/...`, `docs/xtrata-backup-migration-service.md` — port or re-point each).
- Run `npm run sdk:docs:validate`, `sdk:typecheck`, `sdk:build`, `sdk:test`, `sdk:pack:smoke` until green. This makes `sdk:release:dry-run` runnable in 2.0 for the first time.

## Phase 2 — Complete the SDK surface (1–2 days)

- **Publish readiness:** add `description`, `license` (+ LICENSE file), `repository`, `homepage`, `keywords`, `engines.node`, `publishConfig.access: "public"` to both packages; bump to 0.2.0; regenerate changelog via `sdk:changelog:generate`.
- **New module `@xtrata/sdk/sponsor`:** port the framework-independent sponsored-tx state machine from `src/lib/market/sponsor-client.ts` (sign with `sponsored: true` → POST txRaw → poll status) into the SDK, with the app re-importing from the package later. Include the Xverse same-bridge constraint as a documented invariant.
- **New module `@xtrata/sdk/payments`:** payment-asset abstraction — `PaymentAsset` union (STX, sBTC, USDCx/USDC/USDT SIP-010 descriptors, plus fiat quote types for USD/GBP display), post-condition builders per asset, price-quote helper interface. This is the SDK-side foundation the multi-asset marketplace plan needs; contract-side work stays out of scope here.
- **Fill the planned skills:** write `docs/ai-skills/skill-transfer.md` and `skill-query.md` to the same template as skill-inscribe/skill-batch-mint.
- **Tests:** exports test updated for new modules; unit tests for sponsor state machine (mock fetch) and payment post-condition builders; keep `sdk:release:dry-run` green.

## Phase 3 — Machine-readable docs for LLMs (1–2 days)

- **`llms.txt` + `llms-full.txt`** at site root (`public/llms.txt`, served at xtrata.app/llms.txt): generated, not hand-written. New script `scripts/sdk/llms-generate.mjs` assembles: project summary, links section (per llmstxt.org spec) pointing at canonical docs URLs, and for llms-full.txt the concatenated content of `docs/sdk/*.md`, `docs/ai-skills/skill-*.md`, and a trimmed `XTRATA_AGENT_SKILL.md`.
- **API reference JSON:** add typedoc with `--json` output over both packages → `docs/machine/sdk-api.json`, plus a generated markdown reference. Wire `sdk:api:docs` script.
- **Capability manifest** `docs/machine/xtrata-capabilities.json`: contract IDs per network (from `docs/contract-inventory.md` / config.ts), fee constants, chunk limits (30 app / 50 ABI), supported workflows, payment assets, worker endpoints. Schema-validated (put the JSON Schema in the existing `schemas/` dir).
- **OpenAPI 3.1 spec** for the Cloudflare worker endpoints (`functions/`: sponsor relay, market listings, index/relations, index/page) → `docs/machine/openapi.yaml`, referenced from llms.txt.
- **Validation:** extend `docs-validate.mjs` (or a sibling `machine-docs-validate.mjs`) to check llms.txt links resolve, JSON parses against schemas, and every exported symbol in `src/index.ts` appears in the API JSON (docs-vs-exports parity gate). Add all generators to `prebuild` so the site always ships current llms.txt.

## Phase 4 — Verification and release (½ day)

- Full `npm run sdk:release:dry-run` green in 2.0; inspect the publish dry-run artifacts.
- Agent smoke test: point Agent One (or a plain Claude session) at the generated llms-full.txt only, and have it plan a single-item inscription — checks the machine docs are actually sufficient.
- Optionally inscribe the lean skill files on-chain (they were sized for it) and tag `@xtrata/sdk@0.2.0`.

## Suggested order of PRs

1. docs/sdk port + validator green (no code changes)
2. package metadata + version bump
3. sponsor + payments modules with tests
4. skill-transfer / skill-query
5. llms.txt + typedoc + capability manifest + OpenAPI generators and gates

Open decisions for Jim: (a) publish scope — is `@xtrata` the npm org you own, and public from 0.2.0? (b) canonical docs URL base for llms.txt links (xtrata.app vs GitHub raw). (c) whether USD/GBP belongs in the SDK as display-quote helpers only, or waits for a payment-processor decision.
