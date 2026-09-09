# Consolidation review and user guide

Reviewed: 8 September 2026. Input: astra-consolidation-plan.json, created 10:32:33 UTC. App update: v1.0.12.


## Funding workflow update — v1.0.13

The historical plan reviewed below used the destination as an external fee funder. New plans now nominate the first selected derived source wallet when the funding override is blank. Derivation metadata is not proof of signing access; verify that separately. Public-address-only imports require an explicit funding address.

Every source spends its own available STX first; only its remaining shortfall is funded. A selected source funder uses its observed available STX (not the manual external balance field), includes its own tokens and NFTs, and reserves its distribution costs, own transfer fees, reserve and final sweep fee. The app shows the additional deposit needed at that funding address. Its final sweep is phase 4, dependent on all other proposed tasks. Plan and checklist exports include step identifiers and dependencies. Locked STX and future incoming sweeps do not count as initial funding.

The source funder must be selected and have complete balance/NFT reads; preparation also requires fresh reads. An explicit external funder remains supported, with a manually entered available balance. Execution is still unavailable; these are planning dependencies, not an implemented signing or confirmation engine.

## What this plan actually does

This is a draft moving checklist, not an executable transaction file. Astra discovers public balances and prepares an order of work; it cannot sign or broadcast transfers. Importing a recovery phrase for discovery does not connect a signing wallet. No funds have been moved by this review.

The plan selects 999 source wallets. Only 68 have proposed transfers. Of the other 931, 777 lack a complete Stacks inventory and 154 have too little available STX for a sweep under the entered fee allowance. These are not all empty wallets. Finish the intended discovery range, or explicitly select a smaller group and label the result as partial consolidation.

| Proposed work | Transactions |
| --- | ---: |
| Send STX to pay source-wallet fees | 27 |
| Move ordinary NFTs | 316 |
| Move BNS-name NFTs | 61 |
| Move fungible token balances | 135 |
| Move remaining STX | 68 |
| Total | 607 |

The 135 token transfers are wallet/token holdings, not 135 distinct token types. One sBTC transfer contains 943 base units, or 0.00000943 sBTC. Bitcoin transfers are excluded. The screenshot's 0.000058 BTC is therefore not part of this consolidation. BNS token ownership transfer should not be treated as verification that every name setting or resolver has been updated.

## Where the STX goes

The destination and fee-funding address are the same:

`SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7`

Its ownership has not been verified. Compare the full address with the receiving wallet before using it.

| Estimate | STX |
| --- | ---: |
| Available STX in the 68 actionable sources, reconstructed from plan | 10.259715 |
| Funding sent to 27 source wallets | 2.343956 |
| Fees for those funding transfers | 0.081000 |
| Total initial outlay from the destination/funder | 2.424956 |
| All 607 transaction fee allowances combined | 5.405000 |
| STX swept back to the destination | 7.279671 |
| Net STX added to destination after its initial outlay | 4.854715 |

The 7.279671 STX return includes some of the funding sent out first; it is not all newly recovered value. If the destination really starts with 5 STX and nothing else changes, the estimate leaves it with 9.854715 STX after the whole plan, plus received assets. The entered 5 STX is a manual estimate, not a verified on-chain balance.

The arithmetic reconciles exactly: 10.259715 STX in sources minus 5.405 STX total fees equals 4.854715 STX net recovery. No identical duplicate tasks were found. All values depend on manually entered fees (0.01 STX per asset transfer and 0.003 STX per STX transfer), a 0.005 STX asset-wallet reserve and successful transfers. They are not live network quotes. Failed attempts or contract-specific costs can increase the amount needed. Exact NFT ownership, transfer eligibility, token value and destination receipts were not verified by this arithmetic audit.

## Explain it to a beginner

Think of your old wallets as boxes. Some contain coins, some contain tokens or names, and some need a little STX to pay the cost of moving anything out.

1. **Choose the new home.** Open the receiving wallet, copy its full Stacks mainnet address and check it carefully. Keep its recovery backup. Confirm you can sign from each old account too.
2. **Finish the list.** Scan the wallets you intend to include. An unread wallet means “we do not know,” not “nothing there.” Review every asset and exclusion before paying to move it.
3. **Give the old wallets enough fee money.** The funding wallet sends the reviewed top-ups. Wait until each succeeds and the receiving old wallet shows the funds.
4. **Move tokens and names first.** Use a signing tool that supports each asset's transfer method. Confirm each successful transfer and check that the exact token or NFT arrived at the new address. Do not assume a submitted transaction succeeded.
5. **Move the remaining STX last.** After all asset transfers from that old wallet succeed, read its current balance again and subtract the actual sweep fee. Do not sign the estimate from this JSON.
6. **Check the move is complete.** Match the destination's receipts to the checklist and record anything left behind. An empty old wallet alone does not prove delivery to the intended address.

There is no “execute automatically” button in this release. The sequence describes the required signing workflow; the JSON cannot be uploaded to an arbitrary wallet and assumed to work.

## Gates now shown in Astra

Astra allows draft planning/export even when work remains, but its preparation checklist requires a real plan, complete selected Stacks balance/NFT checks, those checks being less than 15 minutes old, and a sufficient manually entered funding estimate. It then presents ordered user statements about destination control, source signing access, live fees/funding and asset review. Changes invalidate the statements; expired data closes the gates. Checkboxes are explicitly not automated proof. Exported plans retain execution disabled and list unverified requirements.

## Gates a future automated executor must enforce

1. **Scope and custody:** exact selected addresses, network, complete coverage, supported signing access to every source/funder, and verified destination control. Unknown wallets and unsupported assets must be resolved or explicitly excluded.
2. **Transaction construction:** verify each contract's transfer interface, token ID/amount and permissions. Construct appropriate asset-specific post-conditions, normally in deny mode, and review/simulate where supported. Unknown contracts cannot be treated as interchangeable.
3. **Fresh state and budget:** refresh ownership, spendable balances, pending transactions and nonces immediately before building transactions; obtain live fee estimates and a user-approved maximum total budget. Exceeding the budget requires a new review.
4. **Final approval:** show the full destination, assets, exclusions, maximum costs and exact scope. Sign only the reviewed transactions using the chosen signing workflow.
5. **Funding confirmation:** persist the signed transaction ID before broadcast; verify successful confirmation and actual funding receipt before releasing dependent asset transfers.
6. **Asset confirmation:** track each source's nonce sequence and each exact asset receipt. Pending, dropped, aborted or uncertain transactions block dependent work. On restart, reconcile transaction IDs with the chain before sending anything again.
7. **Sweep release:** require all intended asset transfers from that source to have succeeded and reached the destination; then recalculate its current STX balance and live fee. Never sweep using a stale plan estimate.
8. **Completion:** reconcile destination receipts and source balances, report exclusions and unresolved transactions, and retain a public audit record without secrets. Bitcoin needs a separate workflow that classifies UTXOs for inscriptions/runes before spending.

Protocol references: [Stacks post-conditions](https://docs.stacks.co/learn/transactions/post-conditions), [deny mode](https://docs.stacks.co/post-conditions/overview), and [Hiro transaction status semantics](https://docs.hiro.so/en/apis/stacks-blockchain-api/v1-to-v3-migration).
