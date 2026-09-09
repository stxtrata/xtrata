# main-staging-chess — 9 September 2026 push summary

This push preserves the current source, release evidence and documentation on `main-staging-chess`. It includes the branch's existing local commits and the previously uncommitted work described below. It does not deploy a website, publish an inscription or submit blockchain transactions.

## Media policy requested by the user

- The entire root `media/` directory is now ignored, including Bootcamp screenshots, recordings, audio, renders, scripts, captions and working notes. Everything remains on the local filesystem.
- Common image, audio and video extensions are ignored throughout the repository, including uppercase variants. TypeScript `.ts` and `.mts` files are not globally ignored as video files.
- New root `AGENTS.md` records the standing rule: no media staging, committing or pushing without explicit approval of the specific assets. Broad force-adds must not bypass the rule.
- Before these changes, 774 untracked image/audio/video files were visible to Git. None was staged. No files under the root `media/` directory were already tracked, so no index removals or local deletions were needed.
- Existing historical application media elsewhere in Git is retained; this change does not remove old assets or rewrite history. Ignore rules do not suppress edits to already tracked assets, so future staging and outgoing-commit checks must continue to honour the policy.
- Text documentation outside `media/`, including Bootcamp script/treatment and production-guideline documents under `docs/`, remains eligible for version control.

## Existing X Chess work included

The working tree already contained these changes when this publishing pass began. They are being preserved, not represented as newly implemented or comprehensively re-tested by this pass.

- X Chess 2.3.1 peer candidate: signed peer protocol and transport, encrypted recovery, registry contract source, independent verification tooling, browser harnesses, candidate/release evidence and CI workflow.
- Read/cache and interface improvements: shared read transport, endpoint recovery, verified caching, rating state, fee advice, presets, keyboard navigation, tournament/read-request regressions and wallet handling.
- X Chess 2.2.0 and 2.3.1 release records, captured-runtime fixtures and associated review notes. Existing release documents distinguish candidates from deployed/inscribed versions.
- X Chess 3.0 local candidate: new arena UI and local contract/sponsorship work, combined V2/peer support, local configuration, test fixtures and review/rebuild notes. Its Devnet credentials are explicitly documented public, deterministic test-only fixtures; they are not production wallet credentials.
- Preserve the existing limitations and pending live wallet/deployment/inscription checks in each project's README, status and validation records. Archived superseded proposals remain marked as historical material.

## Timeloop Detective companion viewer changes

Commit `552e56fb` forwards bounded STX transfer fees, carries explicit fees through the modern Xverse fallback, binds runtime transfers to the connected wallet/account network and returns wallet errors. The separate local Timeloop Detective v1.3.4 release requests a 1 STX café payment and a 0.003 STX fee. The wallet's final approval remains authoritative.

The viewer changes passed 50 targeted wallet/fee tests and a Vite production build. The full host TypeScript check has existing failures; the baseline comparison is documented in `xtrata-2.0/docs/meridian-cafe-wallet-fee.md`.

The Timeloop Detective source, HTML release, screenshots and local simulation live under the already ignored `AAA-Collection/` directory. They are not force-added by this push. The game's 102 passing automated tests and local browser simulations do not constitute a live mainnet purchase test. The viewer fix still requires deployment before a deployed viewer can forward the requested fee.

## Publishing checks

- Fetched `origin/main-staging-chess`; the local branch had 56 commits ahead and none behind before this summary commit.
- Checked ignore behaviour for the whole `media/` workspace and representative PNG, uppercase PNG, audio and video paths elsewhere.
- Audited visible/staged files and the outgoing commit range for image/audio/video additions or modifications. None is included in this push.
- Reviewed credential-shaped literals in the new files: the release audit matches an existing tracked source; the Devnet file documents its intentional public test fixtures.
- Ran working-tree and staged `git diff --check`. The staged check reports trailing/EOF whitespace in four archived logs/captured-header files; these evidence files are preserved rather than silently rewritten. Application test evidence remains in the existing project reports; this publishing pass is not a new full application validation run.
- Push normally to `origin/main-staging-chess`; no force push or history rewrite.
