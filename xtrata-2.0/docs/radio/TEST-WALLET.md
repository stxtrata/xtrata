# Radio Test Wallet

The dedicated page is `/radio/test-wallet`, also linked from stage 4 of the paid-play deployment canary. It becomes available after these changes are pushed and deployed. Ordinary radio listening is unchanged.

## First setup

1. Create a new test wallet with a password of at least 12 characters.
2. Download the encrypted backup, then select that file and verify it with your password. Keep both safe: losing the password or backup can mean losing access to funds.
3. The page now shows your actual Stacks mainnet funding address and QR code. Send your intended 1 STX test balance to that address. The transfer has its own network fee. Refresh after confirmation.
4. Select the master contract and song ID, then choose **Preview one paid play**. Check the recipient, fee and total before approving.
5. Audio starting unmuted triggers the approved payment. Watch its status in Payment history, then reconcile confirmation before another test.

Funding alone never enables spending. The private key is generated locally, encrypted at rest and used in a dedicated worker while unlocked. This is a small-balance hot wallet: encryption cannot protect an unlocked wallet from compromised code running on the same site. Use one browser/device for each test wallet; cross-device signing is not coordinated. Do not use personal, deployer or sponsor wallets as the playback test wallet.

## Fee experiments

Each play sends exactly **0.00005 STX** to the master holder at execution, plus the chosen network fee. No platform fee or treasury payment is added.

The default network fee is **0.0003 STX**, making the total **0.00035 STX**. Presets include 0.0002, 0.000257, 0.0003 and 0.0005 STX; custom fees are limited to 0.000001–0.01 STX. The protected transaction measures 257 bytes. A 0.0002 fee is below the 1 microSTX/byte baseline and requires acknowledgement for an individual test. It is not permitted for automatic sessions. No fee is guaranteed to confirm or increased automatically.

The page retains 0.001 STX as a recovery reserve when calculating play funds. History shows requested and actual fees, recipients and confirmation times. Export a public report to compare tests; it excludes passwords, keys, backups and signed transaction bytes.

## Automatic tests

Review a playlist of direct master IDs from one core contract, a maximum number of starts, a total spending limit and an expiry. Limits are at most 20 paid starts, 1 STX and 30 minutes. The default is five starts, 0.002 STX and ten minutes. The worker enforces the approved limits.

Pausing, buffering and seeking do not charge again. A new track or natural playlist loop is a new start. Skipping after a paid start does not undo it. Only one unresolved payment is allowed: if the next song starts too soon, paid mode stops and audio can continue free. There are no catch-up charges.

**Stop paid listening** stops further payments; **Lock** also drops the signing key. Reloading locks the wallet and does not resume paid mode. Resume last song free restores playback without payment. Transactions already broadcast may still confirm.

## Recovery and withdrawal

Refresh/reconcile before retrying. An uncertain submission keeps its original receipt, nonce and signed bytes. The resend control submits those same bytes, never creates a replacement payment. Saved bytes are checked against the approved song, recipient, amount, fee and nonce before submission.

An uncertain or dropped transaction can block new payments and withdrawal until resolved. This prototype does not automatically replace transactions or raise fees. Do not import the same wallet elsewhere to work around that guard.

To restore on another browser, upload the encrypted backup and enter its password, keeping the old instance inactive. To withdraw, resolve pending transactions, enter a mainnet recipient, amount and fee, and review the exact transfer before approval.

## Scope and validation

This is an opt-in mainnet test console, not a subscription rollout. It supports direct audio masters and HTML players containing embedded audio; it does not infer album/edition pointers. The helper records a paid start, not verified listening duration or unique people. Escrow/contract holders and self-payments are rejected.

Validation: nine wallet unit tests, twenty deployment-console regression tests, TypeScript checks, production build and isolated desktop/mobile browser checks passed. Browser checks cover encrypted backup setup, approval, duplicate-start prevention, reload locking, two-tab exclusion, low-fee rejection, capped automatic playback and withdrawal. All browser broadcasts were simulated. No live funds were moved by these tests.

Developer commands (from `xtrata-2.0`):

```sh
npm run test:radio-wallet
npm run test:radio-wallet:browser
npm run build:radio-test-wallet
```

The browser test uses installed Google Chrome and a temporary local server, with mocked chain traffic. The build emits the page bundle and worker under `public/radio`; keep the referenced worker asset with the bundle. The user handles pushing and deployment. Real funding and payment approval are separate, explicit actions in the UI.

## Canary funding buttons

The paid-play canary offers three numbered buttons: Get dedicated wallet address,
Confirm funds received, and Review and run a paid test. They open the dedicated
wallet at the relevant section. Get my dedicated wallet funding address guides
you through setup if no verified backup exists. Confirm funds received reads the
confirmed mainnet balance; it does not sign or start playback. The test button
opens the review controls, where unlocking and explicit approval are still required.
