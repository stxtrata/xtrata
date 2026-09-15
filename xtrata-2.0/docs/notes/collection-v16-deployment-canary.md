# Collection mint v1.6 deployment canary

v1.6 retains v1.5's core-v3.2.3 pin, hash inventory, reservation handling, duplicate guard and payment logic. Its atomic mint ceiling increases from 30 to 32 chunks; older deployed helpers retain their original limit. New standard collection drafts use v1.6. The fee-model recognizer accepts v1.5 and v1.6 only, and client atomic routing selects the version-specific ceiling.

Mainnet target: SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-collection-mint-v1-6

Source: contracts/live/xtrata-collection-mint-v1.6.clar
SHA-256: a3ced7925b6e6f144fbc37a3af394430a8bc4475d7a4459e801f144a93db49ee
Clarity: 4
Canary: /web/deploy-console.html#collection-v16-deployment

The active canary replaces v1.5 with v1.6, including source download, live preflight, wallet deploy, read-only tests and collection management forms. Historical v1.5 source and management modules remain for recovery. Preflight verifies source pin, contract-name availability, core ABI/fees and, after deployment, source/core binding, 32-chunk cap, counts and mint index. Live preflight passed on 2026-09-15; deployment is awaiting the mainnet deployer's wallet signature. The existing wallet deployment fee request is 0.49 STX. Do not describe v1.6 as deployed until a confirmed transaction and matching source are verified.

Validation: 24 Clarinet tests passed, including 30/31/32 full 16 KiB chunks through atomic mint. 32 canary/client/size tests passed. A 32-chunk transaction with a 256-character URI serialized to 525,009 bytes, below the Stacks codec's 2 MiB transaction bound (https://github.com/stacks-network/stacks-core/blob/master/stacks-codec/src/transaction.rs). This establishes local execution and size compatibility, not a successful mainnet 32-chunk mint or universal wallet acceptance. Contract variant verification and Vite build passed.

## v1.5 retirement

Original canary helper: read-only state confirmed paused=true, minted=0, reserved=0; no mutation was needed.
Numbers wizard helper: paused with six confirmations, tx 0x143a0bdacbaae1d9db7f3f1000eb74269c37152c0cf19aea1e87a1800c369130. Backend collection b403e9c4-a57e-4769-93da-e3e4eaf4f115 was returned to draft. Ten optimized JPEGs remain in storage. Neither helper was finalized, and no assets or ownership were deleted/transferred.

After v1.6 deployment, verify source and paused state before configuration. Rebind/register the saved numbered inventory only after checking both old and new reservation/mint states; do not overwrite old receipts or silently repoint an active collection. Keep new minting paused until configuration and disposable-wallet testing are complete.
