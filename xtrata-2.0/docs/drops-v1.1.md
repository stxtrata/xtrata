# Xtrata Drops v1.1

Drops v1.1 adds immutable campaign policy to the v1.0 sponsored free-drop
escrow. It is designed for collections prepared over multiple Wizard jobs, such
as 32 batches of 32 inscriptions, without resetting claim limits between jobs.

The contract is additive. Legacy `create-drop`, `claim`, `claim-fee`, `cancel`,
`settle-refund`, `get-listing`, and related reads retain their v1.0 behaviour.
Campaign drops use the new entry points below.

## Campaign lifecycle

1. The permanent creator calls `create-campaign` once with the recursive engine
   id, maximum supply, and claim rules. For the Proof of Free collection the
   intended values are supply `u1024` and all three rules enabled.
2. The creator authorises the Wizard's inscription wallet with
   `set-campaign-operator`. Operators can contribute NFTs and sponsorship
   budgets but cannot change policy, cancel drops, or receive refunds.
3. Each successful inscription is passed to `create-campaign-drop`. The
   contract uses the campaign id as the group id and assigns the next edition.
4. A claimant obtains a short-lived BNS attestation from the sponsor service,
   signs `claim-campaign`, and submits it through the normal sponsored flow.
5. Claim fee reimbursement and unused-budget settlement use the existing
   `claim-fee` and `settle-refund` calls.

Campaign policy has no mutation entry point. Only `active` and the authorised
operator set can change. A creator may pause creation and claims without losing
the cancellation escape hatch.

## Campaign identity and limits

Campaign ids are globally unique inside one Drops contract. The on-chain claim
indexes are:

```text
CampaignWalletClaims { campaign-id, claimer }
CampaignBnsClaims    { campaign-id, bns-key }
```

When `one-per-wallet` is enabled, a successful campaign claim also populates the
legacy `GroupClaims { creator, group-id, claimer }` index. Existing readers can
therefore treat `group-id == campaign-id` as the collection-wide group.

`max-supply` counts campaign editions ever created. Cancelling an edition
retires it; v1.1 deliberately does not reuse edition numbers. The Wizard must
validate every artifact before calling `create-campaign-drop` and should only
cancel when retiring that edition is intended.

## BNS attestation

The contract stores a rotatable hash160 of the BNS attestor public key via
`set-bns-attestor-pubkey-hash`. A valid `claim-campaign` signature covers the
Clarity consensus serialization of:

```clarity
{
  bns-key: (optional (buff 32)),
  campaign-id: uint,
  chain-id: uint,
  claimer: principal,
  contract: principal,
  drop-id: uint,
  expires-at: uint
}
```

The digest is `sha256(payload)` and the signature is recoverable secp256k1 RSV.
The BNS service must normalise a name, verify current ownership by `claimer`,
and use `sha256(utf8(normalised-name))` as `bns-key` before signing.

This preserves claimant control: the relayer cannot redirect the NFT, and a
permit cannot be replayed by another wallet, against another drop or campaign,
on another chain, or against another contract. A self-paid caller still cannot
bypass BNS because the attestation is enforced by the contract rather than by
the sponsorship path alone.

## Wizard integration contract

The planned `inscribe-to-drop` composition call should finish by invoking
`create-campaign-drop`, not legacy `create-drop`. The transaction sender must be
the campaign creator or an authorised campaign operator. If inscription or
escrow fails, Clarity rolls back the entire composition call.

Before each 32-item job, the Wizard should read `get-campaign` and require exact
matches for contract id, campaign id, creator, engine id, supply, all rule flags,
active state, and expected `drops-created` edition.

## Deployment prerequisites

Do not deploy v1.1 for public use until all of the following are complete:

- deploy from the intended immutable source and confirm the mainnet SIP-009 and
  Xtrata v3.2.3 principals;
- set the fee sponsor and BNS attestor public-key hash;
- add the v1.1 contract id to the web and sponsor-service allowlists;
- add the BNS attestation endpoint and teach the sponsor validator to accept the
  new `claim-campaign` argument shape;
- update Drops reads to recognise campaign metadata while preserving the
  existing market-shaped `get-listing` path;
- update the Wizard to create/read campaigns, authorise its operator, and call
  `create-campaign-drop` through the atomic inscription composition contract;
- run a testnet rehearsal covering create campaign, a 32-item boundary, claim,
  fee reimbursement, refund, pause, cancellation, and recovery.

The Clarity contract and its tests do not deploy or mutate v1.0 state. v1.1 is a
new contract deployment with independent storage.

## Deployment console

The browser deployment workflow is available at `/web/deploy-console.html`.
Its Drops v1.1 card bundles `contracts/live/xtrata-drops-v1.1.clar`, verifies
the mainnet trait and Xtrata v3.2.3 principal, hashes the exact source, checks
whether the contract name is already deployed, and unlocks the Clarity 4 wallet
publish only for the production deployer.

After confirmation, run the card's chain check again. The post-deploy buttons
then submit `set-sponsor` and `set-bns-attestor-pubkey-hash` as separate wallet
transactions. The attestor field accepts only a 20-byte hash160 in hexadecimal;
never enter a private key. The card keeps the latest 100 preflight and wallet
events in local browser storage and can copy them as a plain-text deployment
log. A CLI fallback is registered under `xtrata-drops-v1-1` in
`scripts/mainnet-deploy-contract.mjs`.
