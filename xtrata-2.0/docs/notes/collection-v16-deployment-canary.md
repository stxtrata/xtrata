# Collection mint v1.6 deployment canary

v1.6 retains v1.5's core-v3.2.3 pin, hash inventory, reservation handling, duplicate guard and payment logic. Its atomic mint ceiling increases from 30 to 32 chunks; older deployed helpers retain their original limit. New standard collection drafts use v1.6. The fee-model recognizer accepts v1.5 and v1.6 only, and client atomic routing selects the version-specific ceiling.

Mainnet target: SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-collection-mint-v1-6

Source: contracts/live/xtrata-collection-mint-v1.6.clar
SHA-256: a3ced7925b6e6f144fbc37a3af394430a8bc4475d7a4459e801f144a93db49ee
Clarity: 4
Canary: /web/deploy-console.html#collection-v16-deployment

The active canary replaces v1.5 with v1.6, including source download, live preflight, wallet deploy, read-only tests and collection management forms. Historical v1.5 source and management modules remain for recovery. Preflight verifies source pin, contract-name availability, core ABI/fees and, after deployment, source/core binding, 32-chunk cap, counts and mint index. Deployment verified on 2026-09-15: mainnet source matches the pinned SHA-256. Owner, operator admin and finance admin are the deployer. Initial state is paused, with supply, price, mints and reservations all zero.

Validation: 24 Clarinet tests passed, including 30/31/32 full 16 KiB chunks through atomic mint. 32 canary/client/size tests passed. A 32-chunk transaction with a 256-character URI serialized to 525,009 bytes, below the Stacks codec's 2 MiB transaction bound (https://github.com/stacks-network/stacks-core/blob/master/stacks-codec/src/transaction.rs). This establishes local execution and size compatibility, not a successful mainnet 32-chunk mint or universal wallet acceptance. Contract variant verification and Vite build passed.

## v1.5 retirement

Original canary helper: read-only state confirmed paused=true, minted=0, reserved=0; no mutation was needed.
Numbers wizard helper: paused with six confirmations, tx 0x143a0bdacbaae1d9db7f3f1000eb74269c37152c0cf19aea1e87a1800c369130. Backend collection b403e9c4-a57e-4769-93da-e3e4eaf4f115 was returned to draft. Ten optimized JPEGs remain in storage. Neither helper was finalized, and no assets or ownership were deleted/transferred.

After v1.6 deployment, verify source and paused state before configuration. Rebind/register the saved numbered inventory only after checking both old and new reservation/mint states; do not overwrite old receipts or silently repoint an active collection. Keep new minting paused until configuration and disposable-wallet testing are complete.

## Numbers 1–10 restoration

The canary now includes six prefilled owner-wallet actions: supply 10, NUM10 metadata, 1 STX price, original recipients, original splits and all ten optimized hash/URI registrations. The public inventory is copied from the prior replacement manifest; no secrets or media are bundled. Existing 7,273-byte JPEG inventory is reused. Every write checks both helpers are paused and have zero mints/reservations, then uses the existing source/owner/finalization-guarded wallet call. Recipients and splits are read from the legacy helper when requested, validated before submission. Fixed supply is skipped when already 10.

On-chain configuration remains pending owner signatures. The disposable wizard does not own v1.6. Backend collection b403e9c4-a57e-4769-93da-e3e4eaf4f115 remains a draft bound to the old helper. After confirmations, verify metadata, payouts and each registration, rebind the existing collection without duplicating storage, then separately unpause and publish. No signatures, mint, publication or storage deletion occurred during this preparation.

Validation: 16 targeted setup/console/management tests pass; Vite production build passes. Browser inspection confirms all six setup buttons are visible in the v1.6 section.

## 2026-09-16 API transport fix

The supplied log showed successful deployment verification followed by an admin preflight fetch failure. The canary used direct unauthenticated api.hiro.so requests, bypassing the shared API-key proxy. All canary chain reads now use /hiro/mainnet, handled by Vite locally and the existing Pages proxy in production; no key enters the browser bundle. Read transport errors identify the contract/function. Admin preflight results replace the saved status, and failures enter the audit log and render instead of leaving an old green result.

Verified locally: API key configured (presence only), proxy HTTP 200, browser v1.6 preflight reports OK — already deployed. 19 targeted console/setup/management tests pass, including stale success replacement on admin failure without opening the wallet. Vite build passed. No on-chain transaction or production website deployment performed. The original generic fetch error does not prove rate limiting or establish the API account's paid-plan status.

## Recipient authorization correction

Mainnet transaction 0x88d74b88ef336cd14115d743644f0f40e1b8a8fafc8a9e0c7148edde21b35dd3 aborted with err u100: restoration attempted to change all three recipients to the wizard, but marketplace/operator changes require RecipientEditors flags even for the owner. The canary now reads those permissions before opening the wallet, and exposes set/get-recipient-editor-access with the pinned core. Grants remain explicit wallet actions and check the signer is the core admin. No permission was granted automatically.

The old helper's splits are 0/0/0. This is valid: split-payment assigns the unallocated remainder to the operator, so the old wizard received the entire collection price. Earlier advice describing zero splits as necessarily unfinished was incorrect. Preserve both recipients and splits to retain the previous payout behavior. After restoring recipients, editor rights may be revoked with false/false through the same form.
