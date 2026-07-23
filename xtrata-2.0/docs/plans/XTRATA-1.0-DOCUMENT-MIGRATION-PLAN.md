# Xtrata 1.0 documentation migration and safe untracking plan

Date: 2026-07-23

Status: planning complete; no migration, reference rewrite, or removal has been
performed by this plan.

## Objective

Move the documentation still required by the Xtrata 2.0 public and developer
surfaces into `xtrata-2.0`, update all active references to use the 2.0 sources,
prove that the application behaves exactly as it did before the documentation
change, and only then remove `xtrata-1.0` from normal Git tracking.

This is deliberately a two-release operation:

1. Migrate, modernise, link-check, test, deploy, and soak the documentation
   while `xtrata-1.0` remains available as a fallback.
2. In a later commit, archive and untrack `xtrata-1.0`.

The folder must not be copied and removed in the same commit.

## Non-negotiable safety invariants

- Do not modify contract sources, registries, runtime functions, wallet logic,
  mint flows, deployment bindings, or Cloudflare configuration.
- Do not overwrite any existing 2.0 file with a 1.0 version.
- Treat 1.0 documents as migration inputs, not automatically authoritative
  documentation. Contract IDs, fees, limits, routes, commands, and UI ownership
  statements must be checked against 2.0 sources before publication.
- Keep the build root set to `xtrata-2.0`.
- Preserve the current `xtrata-1.0` tree until the migrated documentation has
  passed all gates and soaked successfully in production.
- Preserve unrelated working-tree changes. Never use `git add -A`, broad
  restore commands, or a destructive reset during this migration.
- Use a dedicated branch, recommended name:
  `codex/xtrata-1-docs-migration`.
- Stage and commit only explicitly listed migration files.
- The user handles pushing unless they explicitly request otherwise.

## Confirmed repository state

- `xtrata-1.0` is a normal tracked directory, not a submodule.
- The public 2.0 homepage still links to documentation under
  `xtrata-1.0`.
- The 2.0 build and static-copy scripts do not copy `docs/` into `dist`.
  Adding these documentation files therefore cannot alter deployed runtime
  assets by itself.
- Runtime-visible changes occur only when source files containing GitHub URLs
  are updated.
- Some required files already exist in 2.0 and intentionally differ from their
  1.0 versions. Those files require link edits only; they must not be replaced.
- The existing `v1.0-final-pre-cutover` tag predates two later 1.0 changes. A
  fresh final archive point is required before untracking.

## Migration manifest

The recommended migration contains 48 tracked files. Destination paths are the
same relative paths beneath `xtrata-2.0`.

### Documentation index — 1 file

- `docs/documentation-index.md`

Do not publish this file unchanged. Rebuild its navigation around the current
2.0 documentation set. The 1.0 index links to a much larger archive; retaining
it verbatim expands the migration from 48 files to at least 186 files.

### Artist guides — 5 files

- `docs/artist-guides/README.md`
- `docs/artist-guides/collection-launch-guide.md`
- `docs/artist-guides/collection-mint-setup-flow-blueprint.md`
- `docs/artist-guides/collection-portal-access.md`
- `docs/artist-guides/collection-template-deploy-guide.md`

### Core, integration, and relationship documentation — 7 files

- `docs/xtrata-quickstart.md`
- `docs/xtrata-inscription-handbook.md`
- `docs/recursive-inscriptions.md`
- `docs/xtrata-v2.1.0/api-reference.md`
- `docs/product-contract-ui-reference.md`
- `docs/inscription-relationship-index.md`
- `docs/perf/inscription-index-optimisations.md`

### Standards package — 35 files

- `docs/standards/README.md`
- `docs/standards/xtrata-collection-manifest-standard.md`
- `docs/standards/xtrata-manifest-validation.md`
- `docs/standards/xtrata-manifest-templates/00-manifest-index.json`
- `docs/standards/xtrata-manifest-templates/01-collection-minimal-marketplace-manifest.json`
- `docs/standards/xtrata-manifest-templates/02-namespace-manifest.json`
- `docs/standards/xtrata-manifest-templates/03-data-vault-manifest.json`
- `docs/standards/xtrata-manifest-templates/04-runtime-app-manifest.json`
- `docs/standards/xtrata-manifest-templates/05-financial-protocol-manifest.json`
- `docs/standards/xtrata-manifest-templates/06-asset-token-manifest.json`
- `docs/standards/xtrata-manifest-templates/07-treasury-split-manifest.json`
- `docs/standards/xtrata-manifest-templates/CORE-STANDARDS.md`
- `docs/standards/xtrata-manifest-templates/MANIFEST_ALIGNMENT_REPORT.md`
- `docs/standards/xtrata-manifest-templates/MANIFEST_USE_GUIDE.md`
- `docs/standards/xtrata-manifest-templates/README.md`
- `docs/standards/xtrata-manifest-templates/collections/audiovisual-preservation-manifest.json`
- `docs/standards/xtrata-manifest-templates/collections/full-composable-manifest.json`
- `docs/standards/xtrata-manifest-templates/collections/minimal-marketplace-manifest.json`
- `docs/standards/xtrata-manifest-templates/collections/preservation-migration-manifest.json`
- `docs/standards/xtrata-manifest-templates/data/xtrata-bridge-crosschain-manifest.json`
- `docs/standards/xtrata-manifest-templates/data/xtrata-data-vault-manifest.json`
- `docs/standards/xtrata-manifest-templates/data/xtrata-event-log-manifest.json`
- `docs/standards/xtrata-manifest-templates/finance/xtrata-asset-token-manifest.json`
- `docs/standards/xtrata-manifest-templates/finance/xtrata-financial-protocol-manifest.json`
- `docs/standards/xtrata-manifest-templates/finance/xtrata-oracle-index-manifest.json`
- `docs/standards/xtrata-manifest-templates/finance/xtrata-treasury-split-manifest.json`
- `docs/standards/xtrata-manifest-templates/governance-and-rights/xtrata-governance-manifest.json`
- `docs/standards/xtrata-manifest-templates/governance-and-rights/xtrata-rights-license-manifest.json`
- `docs/standards/xtrata-manifest-templates/identity-and-names/xtrata-identity-attestation-manifest.json`
- `docs/standards/xtrata-manifest-templates/identity-and-names/xtrata-namespace-manifest.json`
- `docs/standards/xtrata-manifest-templates/runtime-and-agents/full-composable-runtime-collection-manifest.json`
- `docs/standards/xtrata-manifest-templates/runtime-and-agents/xtrata-agent-memory-manifest.json`
- `docs/standards/xtrata-manifest-templates/runtime-and-agents/xtrata-runtime-app-manifest.json`
- `docs/standards/xtrata-manifest-templates/schemas/xtrata-core-manifest-standard.json`
- `docs/standards/xtrata-manifest-templates/schemas/xtrata-schema-manifest.json`

## Existing 2.0 files that must not be overwritten

The following targets already exist in 2.0. Keep the 2.0 content and update
references in place:

- `docs/sdk/README.md`
- `docs/sdk/quickstart-first-30-minutes.md`
- `docs/sdk/api-overview.md`
- `examples/README.md`
- `docs/contract-inventory.md`
- `docs/ai-skills/README.md`
- `docs/ai-skills/aibtc-agent-training.md`
- `docs/ai-skills/generic-agent-training.md`
- `XTRATA_AGENT_SKILL.md`
- `scripts/xtrata-mint-example.js`
- `scripts/xtrata-transfer-example.js`
- `scripts/xtrata-query-example.js`
- `flowproof/SUBMISSION.md`
- `contracts/clarinet/contracts/xtrata-v3.2.3.clar`
- `docs/app-reference.md`

In particular, the 2.0 SDK README, AI documentation, and app reference have
diverged intentionally from 1.0.

## Content adaptation requirements

### `docs/documentation-index.md`

- Rebuild it as a 2.0 index rather than copying the 1.0 archive index verbatim.
- Link only to files that exist in `xtrata-2.0` or to explicitly tagged
  historical sources.
- Separate current documentation from historical protocol references.
- Use repository-relative links inside documentation where possible.
- Use the canonical public GitHub branch `main` for URLs that must be absolute.

### Quickstart and inscription handbook

- Verify every contract identifier against the current 2.0 contract registry
  and contract inventory.
- Verify upload limits, chunk sizes, supported helpers, and transaction order
  against current contract and SDK sources.
- Keep the required `begin -> batch/chunk -> seal` sequence.
- Recalculate or remove stale cost examples. Any retained fee claim must follow
  the fee guidance in `AGENTS.md` and must separate fixed protocol fees from
  variable mining fees.
- Replace old app paths with current 2.0 routes, including current wizard and
  workspace paths.
- Prefer current SDK entry points over old ad-hoc examples.

### Recursive inscription documentation

- Verify endpoint aliases against `functions/inscription`, `functions/i`, and
  current redirect configuration.
- Verify content reconstruction behavior against the current viewer and
  reconstruction package.
- Preserve historical behavior descriptions only when explicitly labelled.

### Artist guides

- Verify portal routes and access flow against the current artist-manager
  implementation.
- Verify current collection-mint target and supported contract version.
- Verify deployment steps against the current deploy wizard and current
  allowlist rules.
- Remove references to retired routes or 1.0-only UI.

### v2.1.0 API reference

- Retain this as a versioned historical API reference.
- Add a clear banner stating that it documents v2.1.0 and link to the current
  contract inventory and SDK compatibility matrix.
- Do not rewrite historical function signatures to resemble newer contracts.

### Product/UI ownership reference

- Reconcile the document with current 2.0 screens and modules.
- Add any 2.0 surfaces absent from the old reference, including current Drops,
  sponsored operations, wizard, migration, manifest, marketplace settlement,
  vault, and Living Synth/deploy-console boundaries where applicable.
- Remove claims that assign current behavior to retired 1.0 modules.

### Relationship index and optimisation document

- Verify relationship behavior against the current viewer relationship,
  recursive resolution, runtime content, and migration code.
- Preserve the link from the relationship index to
  `docs/perf/inscription-index-optimisations.md`.
- Label old benchmarks or implementation notes with their original date.

### Standards package

- Copy the package as a unit so templates and their indexes remain aligned.
- Parse every JSON file before staging.
- Validate manifest examples against
  `schemas/xtrata-collection-manifest.schema.json` where the declared schema
  version is compatible.
- Check that contract/version statements match the current SDK compatibility
  matrix.
- Keep standards language stable unless a statement is demonstrably obsolete.

## Reference-update inventory

Use this canonical base for public GitHub links:

`https://github.com/stxtrata/xtrata/blob/main/xtrata-2.0`

Use `/tree/main/xtrata-2.0/...` for directories.

### Active application and documentation sources

Update the following files from 1.0 URLs or local paths to their 2.0 targets:

- `index.html`
- `src/SimplePublicHome.tsx`
- `src/PublicApp.tsx`
- `src/manage/components/SdkToolkitPanel.tsx`
- `XTRATA_AGENT_SKILL.md`
- `docs/ai-skills/README.md`
- `docs/ai-skills/aibtc-agent-training.md`
- `docs/ai-skills/generic-agent-training.md`
- `flowproof/BOUNTY-HELPER.md`
- `flowproof/bounty-form-answers.html`
- `forever-twins/Campaign-Facts-and-Open-Questions.md`
- `forever-twins/Source-Claims-and-Citations.md`
- `forever-twins/contracts-reference/README.md`, but only for local repository
  references
- `recursive-apps/21-arcade/AGENTS.md`

Do not change the two `Rapha-btc/xtrata` URLs in
`forever-twins/contracts-reference/README.md`; they refer to a separate
upstream repository whose path remains `xtrata-1.0`.

### Generated documentation

- Update source documents first.
- Regenerate `public/llms-full.txt` with `npm run sdk:llms:generate`.
- Do not hand-edit generated sections when the generator can produce them.

### Tests

Update URL assertions in:

- `src/lib/skills/__tests__/xtrata-agent-skill.test.ts`

Assertions should verify the canonical 2.0 paths rather than merely removing
the old strings.

### Historical records

The following files describe completed migrations and may retain plain-text
mentions of `xtrata-1.0`:

- `CHANGELOG-2.0.md`
- `docs/plans/CUTOVER-PLAN.md`
- `docs/plans/SDK-COMPLETION-AND-LLMS-DOCS-PLAN.md`

If they contain clickable source URLs that would break after untracking, point
those URLs to the final archive tag. Do not rewrite historical statements as if
the old folder never existed.

### Repository-level references outside `xtrata-2.0`

Before untracking, classify all remaining repository-wide matches:

- Update `clone-version.sh` to use `xtrata-2.0`, or retire it explicitly if it
  is no longer used.
- Update active agent instructions and skills to current 2.0 paths.
- Point research citations and historical reports to the final archive tag
  rather than silently changing their historical subject to 2.0.
- Keep `.gitignore` handling scoped and explicit.
- Review `xtrata-week-3-git-commits.md` as a historical record rather than
  mechanically rewriting it.

No active, unqualified `xtrata-1.0` path may remain after the final removal.
Allowed residual matches must be one of:

- a historical narrative statement;
- a URL pinned to the final archive tag;
- an external upstream URL that still uses that path.

## Implementation phases

### Phase 0 — Preconditions and recovery points

1. Confirm the current branch and record `HEAD`.
2. Confirm `xtrata-1.0` has no uncommitted changes:

   ```bash
   git status --short -- xtrata-1.0
   git diff --check
   ```

3. Record the current 1.0 tree object:

   ```bash
   git rev-parse HEAD:xtrata-1.0
   ```

4. Confirm Cloudflare production still builds from `xtrata-2.0`.
5. Record a baseline build and test result from `xtrata-2.0`.
6. Do not stage unrelated untracked files elsewhere in the repository.

Stop if 1.0 is dirty, the build root is uncertain, or the baseline does not
pass.

### Phase 1 — Copy into a non-runtime-only change set

1. Create destination directories without replacing existing directories.
2. Copy only the 48 manifest files.
3. Verify that every destination was previously absent, except where the plan
   explicitly calls for rebuilding a newly copied document.
4. Compare source/destination checksums immediately after the mechanical copy.
5. Stage only the copied documentation and inspect the staged diff.

At the end of the mechanical-copy step, no file under `src/`, `functions/`,
`contracts/`, `public/`, or the project root should have changed.

### Phase 2 — Adapt migrated content for 2.0

1. Apply the content-adaptation requirements above.
2. Rebuild `docs/documentation-index.md`.
3. Use relative links between files within `xtrata-2.0`.
4. Add version/history banners where required.
5. Review all contract IDs, function names, routes, fees, limits, and commands
   against current sources.
6. Run documentation and JSON validation before touching application URL
   sources.

Commit this phase independently so it can be reverted without affecting
runtime-visible application files.

### Phase 3 — Update active references and tests

1. Replace active GitHub links with canonical 2.0 links.
2. Update local absolute paths to 2.0 paths.
3. Preserve external upstream and tagged historical links.
4. Update the skill-package tests.
5. Regenerate `public/llms-full.txt`.
6. Review every changed runtime source line to confirm that only documentation
   URLs changed.

Commit this phase separately from the document-copy commit.

### Phase 4 — Add general documentation integrity validation

The current `scripts/sdk/docs-validate.mjs` checks only top-level files inside
`docs/sdk`. Add a separate recursive validator, recommended as
`scripts/docs-validate.mjs`, and expose it as `npm run docs:validate`.

The validator must:

- recursively scan Markdown under `docs/`;
- validate repository-relative Markdown links;
- validate root-relative references such as `docs/...`, `scripts/...`,
  `examples/...`, `packages/...`, `schemas/...`, and `contracts/...`;
- ignore anchors, `mailto:`, and remote URLs for filesystem existence checks;
- report source file and broken target;
- fail on active, unqualified `xtrata-1.0` links;
- allow an explicit, documented exception list for archive-tag and external
  upstream URLs;
- parse every JSON file in `docs/standards`;
- run without network access.

Add focused tests or fixtures for relative links, anchors, directory targets,
root-relative targets, archive exceptions, and malformed JSON.

### Phase 5 — Local validation gates

Run from `xtrata-2.0`:

```bash
npm run docs:validate
npm run sdk:docs:validate
npm run sdk:machine:validate
npm run sdk:llms:generate
npx vitest run src/lib/skills/__tests__/xtrata-agent-skill.test.ts
npm run lint
npm run build
npm run smoke:premerge
npm run test
```

Then run:

```bash
git diff --check
git status --short
rg -n --hidden --glob '!.git/**' 'xtrata-1\\.0' .
```

Every remaining match must be classified as historical, archive-tagged, or
external upstream. Any unexplained active match is a stop condition.

Build acceptance criteria:

- The build succeeds from a clean 2.0 dependency state.
- The generated route and static-app inventory is unchanged.
- No contract, function, redirect, or Cloudflare binding changes appear.
- Expected output differences are limited to documentation URLs embedded in
  the homepage/React documentation surfaces and regenerated LLM documentation.
- Wallet, mint, viewer, marketplace, wizard, manifest, migration, Drops, and
  static-app smoke gates retain their baseline behavior.

### Phase 6 — Preview deployment and soak

1. Deploy the migration commit to the established preview target.
2. Check every public documentation card on the homepage.
3. Check the artist-manager SDK links.
4. Check AI training links and generated LLM documentation.
5. Confirm all GitHub links resolve to files on the intended branch.
6. Run the normal live preview smoke checklist.
7. Promote the documentation migration without removing 1.0.
8. Soak production for at least 48 hours and monitor build/function errors.

The migration must be reverted if runtime error rates change, build output
contains unexpected files, or public documentation links fail.

### Phase 7 — Final archive point

After the migration has passed production soak:

1. Confirm there have been no further changes beneath `xtrata-1.0`.
2. Create a final annotated archive tag on the last commit containing the
   folder, recommended name:

   `v1.0-archive-final`

3. Push and verify the tag before untracking.
4. Optionally create a dedicated archive branch or subtree repository if
   browsing 1.0 independently is required.
5. Verify archive-tag URLs in historical documents.

Do not proceed if the tag is not visible and browseable remotely.

### Phase 8 — Untrack 1.0 in a separate commit

Only after all previous phases pass:

1. Add `/xtrata-1.0/` to the root `.gitignore`.
2. Remove the folder from Git tracking while retaining the local working copy:

   ```bash
   git rm -r --cached xtrata-1.0
   ```

3. Verify the local directory still exists.
4. Verify the staged deletion contains only `xtrata-1.0` plus the intended
   `.gitignore` update.
5. Re-run the full validation gates from `xtrata-2.0`.
6. Commit the untracking operation independently.
7. Preview-deploy and verify again before production promotion.

Important: other clones will remove their working-tree copy of `xtrata-1.0`
when they pull this commit. The archive tag is therefore mandatory.

## Rollback strategy

### Before untracking

- Revert the reference-update commit to restore old URLs.
- Revert the documentation migration commit to remove the new documentation.
- Because 1.0 remains tracked, no source recovery is necessary.

### After untracking

- Revert the untracking commit to restore `xtrata-1.0` from Git history.
- If needed, restore directly from the `v1.0-archive-final` tag.
- Keep Cloudflare rooted at `xtrata-2.0`; repository restoration must not be
  combined with a production-root change.

## Final completion checklist

- [ ] Exactly the intended migration files were copied.
- [ ] No existing 2.0 file was overwritten with 1.0 content.
- [ ] The documentation index describes the current 2.0 set.
- [ ] All migrated local links pass recursive validation.
- [ ] All standards JSON parses and compatible manifests validate.
- [ ] Contract IDs, routes, limits, fee statements, and commands were checked
      against current 2.0 sources.
- [ ] Active application links use canonical `main/xtrata-2.0` URLs.
- [ ] Generated LLM documentation was regenerated from updated sources.
- [ ] URL assertions were updated and pass.
- [ ] External upstream `Rapha-btc` links remain unchanged.
- [ ] Historical references are retained as history or pinned to the archive
      tag.
- [ ] Build, lint, targeted tests, full tests, and smoke gates pass.
- [ ] Preview and production documentation links resolve.
- [ ] Production soaked for at least 48 hours with no regression.
- [ ] `v1.0-archive-final` exists remotely and is browseable.
- [ ] Untracking occurs in its own later commit.
- [ ] The local 1.0 directory remains available after `git rm --cached`.
