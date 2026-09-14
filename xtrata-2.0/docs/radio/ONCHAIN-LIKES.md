# Wallet-paid on-chain likes

## What is implemented

`/radio/endorse` provides wallet-paid likes, unlikes and a reviewable import of up to 25 saved favourites per transaction. Radio and embed links open this page with the current song first. Connecting, loading saved favourites, or cancelling a review never signs or broadcasts. The radio heart now displays only confirmed on-chain likes for the connected mainnet wallet. Clicking it opens the wallet action page; it never changes local favourites or publishes a transaction directly. The Liked playlist also uses that wallet’s confirmed on-chain songs.

`contracts/live/xtrata-radio-likes-v1.0.clar` is the canonical deployment source. It has no platform fee, token transfers, owner privileges, administrative mutations or fee setters. Wallets pay the Stacks miner/network fee, reviewed in the wallet. No fixed fee is hardcoded; wallet estimation follows network conditions. Deploying the contract itself also costs a one-time network fee. There is no paid inscription operation for a like.

The contract stores one active endorsement per canonical inscription ID and transaction sender. Duplicate states do not change totals or emit another event. A batch is atomic; any invalid new like rolls the entire batch back. Unlikes remain possible even if an underlying NFT later disappears. Immediate contract callers must equal the transaction sender, preventing a proxy from silently endorsing on behalf of a calling user. Deny-mode empty postconditions in the wallet request disallow asset transfers (network fees are separate).

Minted-ID checks cover the existing v3-2-3, v2-1-0 and v1-1-1 mainnet cores and the shared canonical ID namespace used by radio. The contract can verify existence, not parse song bytes: the application restricts presentation/import to the verified song catalogue. A direct caller can endorse a minted non-music inscription, but it will not enter the song catalogue. This is wallet-based data, not one-person-one-vote or a tournament anti-Sybil mechanism.

## Confirmed counts and saved favourites

`/radio/chain-likes` reads the configured contract from mainnet. There are no client-written on-chain totals in D1. The catalogue distinguishes **On-chain likes** from **Saved favourites**; private legacy reporting is labelled saved favourites and links to the on-chain page. Undefined configuration or failed chain reads appear unavailable, never as zero. Read-only state uses the node's canonical tip; transaction tracking also requires a matching wallet/contract call and rejects unanchored or noncanonical results as pending.

Pending transaction IDs persist per contract/wallet. The action is disabled while pending; Refresh checks status, and explorer links remain available after reload. Confirmed chain state is displayed rather than an optimistic increment. An aborted transaction does not change endorsements, though its network fee may still be paid. If the browser's storage is unavailable, tracking survives in memory for the current page only. Lost response/transaction IDs require checking the wallet/explorer before retrying; an idempotent repeat still costs a network fee.

The radio offers an import link when this browser has saved favourites that are not yet confirmed on-chain for the connected wallet. The action page explains the remaining eligible favourites before the user reviews a batch. Local favourites are not automatically published or imported. Import reviews only saved IDs still in the song catalogue and not already confirmed for the wallet. Larger lists require separately reviewed batches. Like/unlike transactions and the associated wallet are public permanently; an unlike clears current state, not historical transactions. Local entries are removed after a successful confirmed-state read shows the connected wallet already likes those songs, with cleanup deferred while a tracked transaction is pending. Old browser-favourite aggregate totals are not rewritten by this cleanup.

## Activation — not performed by this implementation

1. Review the canonical contract and tests. The three hardcoded mainnet core addresses are intentional. The source needs no SIP-009 trait substitutions, so there are no generated mainnet/testnet trait variants. Simnet tests substitute only the deployer address and exercise real simulated core minting. Do not deploy this mainnet source to testnet unchanged.
2. Open `/web/deploy-console.html#radio-likes-deployment` and use the **Radio on-chain likes** card. Load + preflight, connect the expected deployer wallet, then choose Deploy. It pins the exact source hash, rechecks the name at signing time and verifies deployed bytes afterward. The console uses Clarity 4 (tested alongside Clarity 3) and its existing 0.49 STX deployment fee default, reviewed in the wallet. Alternatively deploy the exact source on **mainnet**, recommended name `xtrata-radio-likes-v1-0`, using the chosen deployer wallet. Review the deployment network fee before signing. No wallet was used or transaction broadcast during implementation.
3. Verify the deployed source matches the reviewed file. Read `get-config`: version 1, canonical v3 core, batch limit 25, platform fee 0. Test reads for real catalogue IDs. Obtain explicit authorization for any live paid like/unlike test; repository testing rules prohibit using personal, deployer or sponsor wallets for testing.
4. Set the Cloudflare Pages production variable `RADIO_LIKES_CONTRACT` to the full deployed `ADDRESS.xtrata-radio-likes-v1-0`. This is a public identifier, not a secret. No D1 migration or sponsor key is needed. Mainnet only is supported by this first UI; a testnet wallet is rejected before requesting a transaction.
5. Build/deploy the branch after review. `prebuild` now includes `build:radio-likes`. Verify `/radio/endorse` loads and the catalogue has two separate columns. Enable the preview variable only deliberately: it also references real mainnet data and wallet-paid transactions.
6. If reads fail, the UI blocks wallet actions. Clear `RADIO_LIKES_CONTRACT` and redeploy to disable the app integration; this does not erase on-chain state or disable the immutable contract itself.

## Validation

- `npm --prefix contracts/clarinet test -- --run tests/xtrata-radio-likes-v1.0.test.ts`
- `npx vitest run src/radio-likes/__tests__ src/lib/radio/__tests__ functions/radio/__tests__`
- `npm run build:radio && npm run build:radio-likes`

The wallet tests use mocked providers only. Contract tests use disposable simnet accounts and cover duplicate likes, distinct wallets, unlike idempotency, no STX transfer, atomic rollback, batch import deduplication, read totals and proxy rejection.

Implementation checks: 51 application tests and 3 simnet contract tests passed, along with strict TypeScript checks, relevant ESLint checks, contract variant verification and both radio builds. An isolated headless browser with mock data verified desktop/mobile rendering; the mobile page has no horizontal overflow. No live wallet connection, signature, deployment or like transaction was performed.

Deploy-console validation: 16 radio/X-Chess console regression tests and 6 radio-contract tests (Clarity 3 and 4) pass. The radio card uses the established 490,000 microSTX deployment default, independently of the wallet-estimated transaction fees for likes and unlikes. No live wallet was connected during these tests.

Radio migration validation: 46 targeted tests across 10 files passed, including wallet switching, disconnects, stale responses, unavailable reads and import review. Radio ESLint and both radio builds passed. Confirmed state refreshes when returning to the radio and periodically while visible; failures show unavailable and do not substitute browser favourites. No live wallet or paid transaction was used.

## Migration visibility and activation fix — 2026-09-14

The previous release removed browser favourites from the lit heart correctly, but its small import link was easy to miss, and the heart returned without action before a track was selected. The radio now opens a migration dialog once per browser session when saved favourites exist, listing the preserved song names and an explicit import link. The heart and import link can reopen this dialog at any time; with no selected song it offers wallet connection/song selection. Actions proceed through the existing review page and require explicit wallet approval. The heart remains off until a like is confirmed.

Production `/radio/chain-likes` returned `enabled:false` during diagnosis. The deployed `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0` source was verified byte-for-byte against the canonical file (SHA-256 `7e7fca966af587f48b2923adc081710b36b80c4bf4fef351b9499d9584d378db`). `wrangler.toml` now sets the production `RADIO_LIKES_CONTRACT` variable for the next deployment. Preview is deliberately not enabled. This change does not itself deploy the site or send any transaction. The earlier activation checklist remains useful for other environments.

Validation: 11 targeted tests passed, including real radio DOM initialization with saved favourites and heart clicks before playback; both bundles and radio ESLint passed. An isolated headless Chrome check at 390px width confirmed the import dialog and link are visible with no horizontal overflow. All test favourites and wallet responses were mocked. No personal wallet was used.

## Wallet/import diagnostics — 2026-09-14

The endorsement page now includes an expandable **Import / wallet diagnostic log**, also written to the console under `[radio:likes]`. It records relative timing for configuration, wallet connection, import eligibility counts, review/approval, provider selection, account read/cache/reconnection, signing request, completion/cancellation/error and settlement. Every 35 seconds an unresolved request reports its latest stage without retrying or releasing the duplicate-request guard. The new log is bounded to 100 in-memory lines and omits wallet addresses, song IDs/titles, keys, signatures and raw provider payloads/errors. Existing shared wallet logs remain separate.

The reported Xverse error was `account-preflight` timing out at 90 seconds, preceding the signing request. The shared wallet implementation caches a confirmed account for 45 seconds, then reads it again and falls back to wallet connection if that read fails. New optional progress callbacks expose this sequence without changing signing/account checks or retry behavior. A diagnostic callback failure cannot interrupt a wallet request. These changes help identify the stalled provider step; they do not claim to fix the underlying Xverse timeout.

Validation: 45 page/wallet tests passed, including simulated preflight/reconnection failure and log privacy assertions; the on-chain bundle built successfully. The repository ESLint configuration cannot parse these TypeScript files, so it was not used as validation for them. A standalone TypeScript check also reports shared wallet provider/options type incompatibilities, so a clean typecheck is not claimed. No live wallet was used and no transaction was sent.

## Fee suggestions in review

Like, unlike and import reviews now calculate the serialized size of an unsigned standard single-signature transaction using the actual contract and selected changes. They display the minimum-relay suggestion at 1 microSTX/byte in STX and microSTX, plus approximate per-song cost for batches. No network request or signature is needed for this calculation. Deselecting songs recalculates the suggestion, including changing a one-song remainder to the single-call format. Empty selections disable approval. Guidance stays visible after opening the wallet, explains custom fees, and distinguishes the relay minimum from timely confirmation. The wallet request still leaves fee selection to the wallet/user; no automatic fee override was introduced.

Validation: eight targeted tests passed, including the deployed-name sizes (193 bytes for a like/unlike, 404 for seven songs, 980 for 25), visible guidance and deselection behavior. The on-chain bundle built successfully. No wallet was used or transaction sent.

## Cleanup after import

Both the radio and endorsement page reconcile local favourites against the connected wallet’s confirmed on-chain likes. Matching local entries are removed, including imports completed before this update; unconfirmed/unimported entries are preserved. Cleanup reads the current storage value so other saved songs survive, deletes the key when empty, and tolerates unavailable or malformed storage without disturbing chain state. A tracked pending transaction defers cleanup; a failed transaction with no confirmed like leaves the song saved. No cleanup runs from a stale wallet response or a failed state read. The endorsement page reports the number removed in its diagnostic log.

Validation: 14 targeted tests passed, including pending-to-confirmed cleanup, failed import preservation, older import reconciliation, duplicate entries and unavailable/malformed storage. Both radio bundles built successfully. No live wallet or transaction was used.

## Catalogue total read reliability

The catalogue reads the contract’s global `total` for each song, independently of the listener’s `liked` flag. During diagnosis the live API returned total 2 for songs 2883 and 2885, while the earlier screenshot displayed unavailable values. Previously any one failed batch discarded every total. `radio-chain-totals.ts` now retries configuration and each failed batch once, preserves successful batches, and returns ready/partial/unavailable/disabled status. The catalogue requests fresh data and explicitly explains missing totals with a Refresh instruction. Unavailable remains null, never a fabricated zero.

Validation: 13 targeted catalogue/chain-total tests passed, covering cross-wallet totals, transient failures, partial results and unavailable configuration. Catalogue JavaScript ESLint passed. No signing or wallet access was performed.

## Album display

The radio now passes album metadata to its standalone song information, and the catalogue shows Album immediately beside Song. The column is sortable, searchable and included in song details. Migration 016 adds the cached album field; existing HTML metadata is rechecked in bounded background batches on catalogue requests after deployment. Album names can therefore populate gradually. No album is fabricated when metadata omits it.

Migration 016 was applied successfully to the production `xtrata-manage` database on 2026-09-14. The UI/enrichment code still requires deployment.

## Connected-wallet import prompt correction

The automatic local-favourites popup has been removed. The radio now offers imports only after the connected wallet has a successful on-chain state read, filtering out its already-confirmed likes. Manual wallet guidance explains when connection/verification is still needed. A separate pending transaction no longer blocks radio cleanup of songs that are already confirmed liked: no unconfirmed state is promoted or deleted. The existing wallet-switch/stale-response guards still apply. Nine targeted prompt/state/cleanup tests and the radio build passed.

## Single-song custom fee — supersedes the earlier wallet-estimated default

A single like or unlike now requests exactly 200 microSTX (0.0002 STX). Review and the persistent wallet reminder display a prominent fee card instructing users to choose Custom, enter 0.0002 STX, and change a higher fee or cancel. The wallet can override a requested fee; this is not an enforceable wallet fee cap. Confirmation speed is not guaranteed, and users are advised to cancel/try later if that fee is not accepted. Batch requests remain separately sized and do not inherit the single-song fee.

Validation: 12 targeted page/helper tests passed, including exact single-state fee requests, batch isolation and the persistent reminder. The on-chain bundle built successfully. No live signing or transaction was performed.

## Direct heart flow and endorsement refresh

A radio heart click with a selected song now opens `/radio/endorse?id=…&action=review`, bypassing the intermediate radio dialog. This mode shows only that song and automatically opens its fee review after the connected wallet’s confirmed state is available. A confirmed like selects Unlike; otherwise it selects Like. Connecting preserves the selection. Review never sends a transaction; Continue to wallet remains the explicit signing trigger. The all-song/import page remains available by link, and import controls are hidden in single-song mode.

Endorsement reads retry a failed batch once and preserve successful batches. Pending transaction status is checked before reading song states, so confirmation is followed by fresh counts. Visible pages refresh every 30 seconds except during review, loading or wallet approval. Missing batches are explicitly reported; unavailable is never treated as zero or an actionable false like. Wallet storage changes invalidate the review and reload state.

Validation: 12 targeted page/radio UI tests passed, including direct unlike selection, selection preserved through connect and transient state-read recovery. Both bundles and radio JavaScript lint passed. No live signing was performed.
