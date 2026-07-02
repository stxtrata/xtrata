# Deploying Xtrata v3.2.3 to testnet (wallet-signed)

Goal: stand up Xtrata on **testnet** so FlowProof runs on one network (FlowVault is
testnet-only). You sign every transaction in your own wallet — no private keys leave your machine.

**Two contracts, deployed in order, Clarity version 3:**

| # | Contract name | File | Notes |
|---|---|---|---|
| 1 | `sip009-nft-trait` | `contracts/sip009-nft-trait.clar` | SIP-009 trait. Deploy first. |
| 2 | `xtrata-v3-2-3` | `contracts/xtrata-v3-2-3.clar` | Inscription protocol (migration trimmed). Depends on #1. |

> Deploy #1 and **wait for it to confirm** (status `success` on the explorer) before deploying #2.
> #2 implements `.sip009-nft-trait`, so the trait must already be on-chain under the same address.

Resulting contract IDs (from `STRNRHWSD7REAEXVTHDQWKPD4MFBG41024WQKBBM`):

```
STRNRHWSD7REAEXVTHDQWKPD4MFBG41024WQKBBM.sip009-nft-trait
STRNRHWSD7REAEXVTHDQWKPD4MFBG41024WQKBBM.xtrata-v3-2-3
```

Safety net: a contract with analysis errors is **rejected at mempool admission with no fee charged**,
so a bad deploy can't silently burn STX.

---

## Method A — one-click page (`deploy.html`)

Talks **directly to your wallet provider** (`window.LeatherProvider.request('stx_deployContract', …)`),
mirroring your `src/lib/wallet/connect.ts`. No `@stacks/connect` modal — that modal (loaded from a CDN) was
the crash you saw. Serve over localhost so the extension injects its provider (extensions don't inject on
`file://` by default):

```bash
cd flowproof
npx serve .            # or: python3 -m http.server 8080
# open the printed URL + /deploy.html  (e.g. http://localhost:3000/deploy.html)
```

0. In Leather (or Xverse): switch to **Testnet** and select the `STRNRHWSD7…` account.
1. Pick your wallet in the dropdown → **Connect** (should show an `ST…` address).
2. **Deploy sip009-nft-trait** → sign → wait for `success` on the explorer link it prints.
3. **Deploy xtrata-v3-2-3** → sign → wait for `success`.

If your wallet build reports `stx_deployContract` unsupported, use Method B — identical result.

## Method B — Hiro Explorer Sandbox (guaranteed, zero code)

1. Go to **https://explorer.hiro.so/sandbox/deploy?chain=testnet** and connect your wallet (`STRNRHWSD7…`).
2. Contract name: `sip009-nft-trait`. Paste all of `contracts/sip009-nft-trait.clar`.
   Set **Clarity version 3**. Deploy → sign → wait for `success`.
3. Contract name: `xtrata-v3-2-3`. Paste all of `contracts/xtrata-v3-2-3.clar`.
   Set **Clarity version 3**. Deploy → sign → wait for `success`.

## Optional pre-flight check (you have Clarinet)

The trimmed contract was statically verified (no legacy contract refs, balanced parens, core
functions intact). To also run Clarity analysis locally, drop it into your Clarinet project and check:

```bash
cp flowproof/contracts/xtrata-v3-2-3.clar contracts/clarinet/contracts/
# add to contracts/clarinet/Clarinet.toml:  [contracts.xtrata-v3-2-3]  path = "contracts/xtrata-v3-2-3.clar"  clarity_version = 3  epoch = 3.0
clarinet check
```

---

## After deploying — wire FlowProof to it

Set these in `flowproof/.env` (copy from `.env.example` first):

```
NETWORK=testnet
STACKS_PRIVATE_KEY=<a funded testnet key for the autonomous orchestrator>
XTRATA_CONTRACT_ADDRESS=STRNRHWSD7REAEXVTHDQWKPD4MFBG41024WQKBBM
XTRATA_CONTRACT_NAME=xtrata-v3-2-3
# FlowVault + USDCx testnet values are already filled in .env.example
```

Note: `xtrata-v3-2-3` deploys **paused by default**, and the **deployer becomes the contract owner/admin**.
`assert-inscription-allowed` permits writes when `(not paused)` **OR** `tx-sender == contract-owner` **OR**
the caller is allow-listed. So:

- **Simplest:** make the orchestrator sign with the **deployer account** (`STRNRHWSD7…`). The owner can
  inscribe even while paused — no extra tx needed. (Put that account's key in `STACKS_PRIVATE_KEY`.)
- **Or** keep a separate orchestrator account and either `set-paused false` (one admin wallet tx) or
  `set-allowed-caller <orchestrator> true`.

Quick read-only sanity check once deployed:

```bash
curl -s https://api.testnet.hiro.so/v2/contracts/interface/STRNRHWSD7REAEXVTHDQWKPD4MFBG41024WQKBBM/xtrata-v3-2-3 | head -c 300
```

Then run the live demo:

```bash
cd flowproof
npm install flowvault-sdk@0.1.1
npm run demo        # inscribes asset, runs 2 royalty flows, prints the on-chain receipt lineage
```
