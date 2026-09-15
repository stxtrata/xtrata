# Collection studio UI

The existing `/manage` route now starts with a responsive collection workspace. Nine task cards open the existing collection picker, creator/deployer, artwork staging, page metadata, price/payout, phase, allowlist, storage cleanup and launch panels. The full readiness checklist remains available in a collapsible disclosure.

Pricing, schedule and allowlist shortcuts reveal collection controls and select the relevant action. Category buttons make the remaining contract settings discoverable. Existing signing, network, role, validation, publication and storage deletion checks remain in their existing components. Navigation itself neither signs nor publishes.

Schedules remain block-height based, with phase activation a separate operation. This UI does not introduce a calendar scheduler or deploy the cleanup worker. Temporary file storage and mint-time inscription remain separate. Existing backend access and wallet requirements apply.

Validation: 12 targeted studio, inventory and journey tests passed; Vite production build passed. Isolated mock-data browser preview checked at 1440px and 390px with nine task buttons and no horizontal overflow; no wallet was connected. Repository-wide TypeScript checking remains blocked by errors outside the changed components (including reconstruction export tests and Vite configuration types); no diagnostics named the changed manager components.

No production deployment or on-chain transactions were performed for this UI change.

## Local routing correction

Vite dev and preview now rewrite the exact `/manage` and `/manage/` document paths to `workspace.html`, preserving the browser pathname and query. Previously the local SPA fallback loaded the homepage. `/manage/allowlist` and other API paths are untouched. Verified in isolated Chrome: `/manage` renders the Artist manager wallet gate. The existing approved-wallet requirement remains in place.

## v3.2.3 creator gate

Updated the access screen for collection mint v1.5 / Core v3.2.3 with six setup stages: collection creation, temporary artwork staging, prices and access, mint page preparation, launch and storage management. Removed the previous pre-inscription/gallery instructions. Clarified wallet connection versus transaction approval, workspace access versus collector allowlists, block-height schedules, retention and verified cleanup. Existing access logic is unchanged. Vite production build passed.

## Guided builder

Guided mode now uses a six-step sidebar, a focused workspace, a saved collection preview/summary and Back/Continue controls. Visited forms remain mounted across step navigation to preserve their unsaved inputs. Step position is browser-local, scoped to wallet/network and collection; saving data remains explicit within each existing form. Advanced workspace remains available, with a warning about unsaved edits when switching views.

The implemented order follows existing contract dependencies: basics, artwork, contract, mint rules, launch, management. Readiness gates use existing collection/chain signals; they are navigation aids, not replacements for transaction preflights. Inventory registration checks remain explicit in Prepare contract. Page publication and contract unpausing remain separate actions. Existing deployed collections can inspect their contract without re-staging assets; pre-inscribed collections retain their alternate requirements.

Mint rule shortcuts expose prices, phases, phase activation, global/phase allowlists and wallet limits. Phase access modes use readable options. CSV/text wallet import validates addresses and uint128 allowances, caps batches at 200 unique wallets, deduplicates identical entries and rejects conflicts. Technical deployment diagnostics are collapsed.

Validation: 12 targeted builder/import/inventory tests passed; production build passed. Isolated mock-data layout inspected at 1440px and 390px with no horizontal overflow. Repository-wide TypeScript checking still encounters existing Vitest typing/configuration conflicts; a newly exposed narrowed-mode comparison was corrected. No real-wallet transactions or production deployment.

Remaining backend work from the broader proposal: signed creator sessions and per-collection write authorization, public-access quotas, automatic phase activation, and deployed cleanup workers. The existing creator access gate remains until these protections exist. Preview reflects saved metadata, not every unsaved form keystroke. This change reuses existing artwork/metadata controls rather than introducing a new bulk metadata schema.

## Current versus legacy collections

The collection picker now defaults to helper v1.5 collections targeting Core v3.2.3 (when a core binding is recorded). Older/unversioned active collections remain accessible in a collapsed Legacy collections disclosure; they are no longer auto-selected on resume. The owner-wide oversight section starts collapsed. These are manager display changes, not changes to the public collection listing or chain contracts.

Production storage audit verified all ten Numbers 1–10 optimized JPEGs byte-for-byte against local originals: 548–884 bytes each, 7,273 bytes total. They belong to the disposable setup wallet SP3P8VYRTXYVEH2R85YKASHTD65Z4E4RC13MY7X6M, not the connected deployer. The active D1 rows use the replacement `*-128.jpg` names.

A separate user-authorized storage cleanup targets only expired files in undeployed legacy drafts; local backup inventory, file bytes and deletion acknowledgements are retained under ignored root media/collection-cleanup-backup-2026-09-15. Published/deployed collections and the current Numbers collection are excluded. API reservation and shared-storage-reference guards remain authoritative. No on-chain purge or transaction is performed.

Validation: version classification test and Vite production build passed.
