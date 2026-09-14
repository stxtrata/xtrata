# X-Chess 2.6.0 manual wallet deployment

The existing `/web/deploy-console.html#xchess-deployment` console now has an X-Chess card. The helper is an immutable authenticated log and capped reserve contract; it has no owner configuration or relayer setup. The inscribed board remains the chess referee. This change does not publish the website or deploy a contract.

## Manual steps

1. Open the local console in a wallet-enabled browser. During this handoff it is served at http://127.0.0.1:4182/web/deploy-console.html#xchess-deployment. For future development, `npm run dev` serves the same `/web/deploy-console.html` path.
2. In the X-Chess card, use **Load + preflight**. It must show 16,171 bytes, hash `7a40233b69c1406ec92e2672d16add3c30c158e4ffa02cab8c4b4cdbc93d089d`, Clarity 4, and an available name. No wallet connection is needed for this read-only check.
3. Connect the designated deployment wallet yourself. The exact target is `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-browser-house-v2`.
4. Select **Deploy (sign in wallet)**. The console repeats source/name checks before opening the wallet. Review the target, mainnet and fee, then sign manually. The existing fee request is 490,000 microSTX (0.49 STX); it is not a promise of inclusion time. Deployment makes no game deposit. Cancellation leaves deployment unsubmitted.
5. After the transaction confirms, rerun preflight. It fetches deployed source and requires an exact hash match before displaying **Deployed source verified byte-for-byte**. Copy the full contract ID into the board’s helper field. No admin transaction is needed.
6. Engine inscription #3049 and the new board inscription ID/hash are runtime match terms in X-Chess. Source inscription #3048 is archival provenance; it is not the callable contract address. Do not replace embedded constants or reformat the contract.

## Changes and checks

- Exact release copy in `contracts/live/xchess-browser-house-v2.clar`; browser and CLI registries agree on name and Clarity 4. Both pin the source hash.
- Wrong signer, duplicate click, unavailable name lookup, changed availability and mismatched deployed source block wallet opening.
- No auto-connect, private-key entry, automatic signing or additional chess admin calls.
- All 53 deployment-helper tests passed, including eight new simulated-wallet/DOM cases. The console-only Vite production build passed. No personal wallet was used in testing and no public-chain write was made.
- Source inscribed as #3048 and engine #3049 were separately verified sealed and byte-identical to the X-Chess 2.6.0 release on 14 September 2026. Their read-only verification receipt is retained under X-Chess/reviews/finalisation-2.6.0/.
