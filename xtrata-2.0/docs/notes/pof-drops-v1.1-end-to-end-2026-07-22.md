# Proof of Free Drops v1.1 end-to-end handoff — 2026-07-22

## What is wired

- The public Drops registry includes the deployed `xtrata-drops-v1-1` contract
  alongside legacy v1.0 drops.
- Campaign metadata is read from `get-drop` and immutable campaign rules are
  read from `get-campaign`.
- The collector chooses a BNS name held by the connected wallet and requests a
  short-lived permit from `POST /sponsor/attest-campaign`.
- The server verifies current BNS ownership, hashes the normalized name, and
  signs the exact Clarity consensus payload required by `claim-campaign`.
- The wallet signs the five-argument sponsored call with fee 0, deny mode, and
  one exact escrow-NFT post-condition.
- Both the browser and relayer inspect every signed argument. The relayer also
  recovers the attestor public key and checks its hash before spending a fee.
- Existing `claim-fee` and `settle-refund` job settlement remains unchanged.

## Production activation

1. Retrieve the private attestor key that corresponds to the already configured
   on-chain hash `0x0a58ec2d974c832a3e81347865103babe4fd226e`.
2. Use the existing Cloudflare Pages secret `BNS_ATTESTATION_PRIVATE_KEY`. Do not reuse the
   sponsor hot-wallet key and do not place either key in the repository.
3. Deploy the current site build. No `SPONSOR_MARKETS` override is needed when
   using the default allowlist; if an override is present, it must explicitly
   include the v1.1 contract id.
4. Create campaign `0` with engine inscription id, supply `1024`, and all three
   claim rules enabled; authorise the Wizard operator.
5. Escrow one validated inscription with `create-campaign-drop` and use it as
   the canary before starting the remaining batches.
6. Claim the canary from a different, STX-empty wallet that owns a BNS name.
   Confirm the claim, sponsor reimbursement, creator refund, and claimed-only
   mosaic registry entry before continuing.

## Automated evidence

- Canonical BNS hashing, Clarity serialization, signature recovery, and binding
  mutation tests.
- Real signed v1.1 sponsored transaction fixture covering all five arguments.
- Production Pages handler test covering attest -> wallet transaction ->
  sponsor -> broadcast.
- Forged-attestation test proving rejection before any sponsor broadcast.
- Production Vite build completes successfully.

The full repository lint and TypeScript commands currently report unrelated
pre-existing failures; the focused PoF test suites pass.
