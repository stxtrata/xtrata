# Wallet-paid on-chain likes

## What is implemented

`/radio/endorse` provides wallet-paid likes, unlikes and a reviewable import of up to 25 saved favourites per transaction. Radio and embed links open this page with the current song first. Connecting, loading saved favourites, or cancelling a review never signs or broadcasts. The existing saved-favourites heart remains a browser convenience and has no network fee.

`contracts/live/xtrata-radio-likes-v1.0.clar` is the canonical deployment source. It has no platform fee, token transfers, owner privileges, administrative mutations or fee setters. Wallets pay the Stacks miner/network fee, reviewed in the wallet. No fixed fee is hardcoded; wallet estimation follows network conditions. Deploying the contract itself also costs a one-time network fee. There is no paid inscription operation for a like.

The contract stores one active endorsement per canonical inscription ID and transaction sender. Duplicate states do not change totals or emit another event. A batch is atomic; any invalid new like rolls the entire batch back. Unlikes remain possible even if an underlying NFT later disappears. Immediate contract callers must equal the transaction sender, preventing a proxy from silently endorsing on behalf of a calling user. Deny-mode empty postconditions in the wallet request disallow asset transfers (network fees are separate).

Minted-ID checks cover the existing v3-2-3, v2-1-0 and v1-1-1 mainnet cores and the shared canonical ID namespace used by radio. The contract can verify existence, not parse song bytes: the application restricts presentation/import to the verified song catalogue. A direct caller can endorse a minted non-music inscription, but it will not enter the song catalogue. This is wallet-based data, not one-person-one-vote or a tournament anti-Sybil mechanism.

## Confirmed counts and saved favourites

`/radio/chain-likes` reads the configured contract from mainnet. There are no client-written on-chain totals in D1. The catalogue distinguishes **On-chain likes** from **Saved favourites**; private legacy reporting is labelled saved favourites and links to the on-chain page. Undefined configuration or failed chain reads appear unavailable, never as zero. Read-only state uses the node's canonical tip; transaction tracking also requires a matching wallet/contract call and rejects unanchored or noncanonical results as pending.

Pending transaction IDs persist per contract/wallet. The action is disabled while pending; Refresh checks status, and explorer links remain available after reload. Confirmed chain state is displayed rather than an optimistic increment. An aborted transaction does not change endorsements, though its network fee may still be paid. If the browser's storage is unavailable, tracking survives in memory for the current page only. Lost response/transaction IDs require checking the wallet/explorer before retrying; an idempotent repeat still costs a network fee.

Local favourites are not automatically published or imported. Import reviews only saved IDs still in the song catalogue and not already confirmed for the wallet. Larger lists require separately reviewed batches. Like/unlike transactions and the associated wallet are public permanently; an unlike clears current state, not historical transactions. Local favourite storage and old browser-favourite totals are not rewritten by this feature.

## Activation — not performed by this implementation

1. Review the canonical contract and tests. The three hardcoded mainnet core addresses are intentional. The source needs no SIP-009 trait substitutions, so there are no generated mainnet/testnet trait variants. Simnet tests substitute only the deployer address and exercise real simulated core minting. Do not deploy this mainnet source to testnet unchanged.
2. Deploy the exact source on **mainnet**, recommended name `xtrata-radio-likes-v1-0`, using the chosen deployer wallet. Review the deployment network fee before signing. No wallet was used or transaction broadcast during implementation.
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
