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
