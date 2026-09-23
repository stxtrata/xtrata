# Optional Music Heroes BNS links — Mac 1.0.5 / Windows 1.0.8

## Implementation

The local app offers **Name your Music Heroes profile** inside the support-wallet
panel. Linking is optional and independent of playback/payment approval. Users
review the public association, enter a name, choose signature or transfer, and
open a fixed HTTPS Xtrata page. The app signs a SIP-018 purpose-bound challenge
with its existing protected wallet. It does not export a key, generate a payment,
change fees, alter the payment queue or grant spending consent.

The browser completes verification with a free BNS-owner signature or a direct
transfer from that owner to the support address. Transfers require an exact
1,000–9,999 microSTX amount AND a challenge-specific 32-character memo. Funds stay
in the support wallet. Sending-wallet network fees are separate. There is no
platform fee. The transfer is never initiated automatically by Xtrata.

The server pins mainnet, the Xtrata profile domain, signing role, action, name,
support/owner addresses, verification method, nonce, amount and 15-minute expiry.
Only standard single-signature mainnet owners are supported initially, not
subdomains/contract/multisig owners. BNS ownership uses the active-name owner API
at https://api.bnsv2.com/names/{name}/owner (not a resolution/payment alias).
The existing mainnet BNS registry is
SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2. This implementation trusts the
BNS V2 owner's HTTPS API/index, rather than claiming independently verified
contract proofs. API errors fail closed. Public reads recheck owner/status;
changed ownership hides/revokes the association. Browser labels refresh at most
once per five minutes, so a previously displayed label may briefly be stale.

Public evidence contains the challenge and signatures/transfer ID. Ranking always
belongs to the original payer address. Unlink requires its own support-wallet
signature and website confirmation. Database revisions prevent an older approval
from relinking after unlinking. D1 batch transactions atomically update the link,
consume the nonce and reserve a transfer ID. Requests are IP-bucket rate limited;
only hashed buckets are stored, without keys or raw IP addresses.

An observed pending transfer may confirm for up to one additional hour. It must
be registered by checking it before the initial deadline; an unobserved transfer
confirmed after the deadline is not accepted. Users must not resend funds to
resolve slow confirmation. Failed, noncanonical, unanchored, wrong-address,
wrong-amount, wrong-memo and reused transfers are rejected. Refreshing the
verification page requires starting a new request in the app, because the proof
is removed from the URL and is not stored in browser storage.

## Deployment and beta release gates

1. Apply `functions/migrations/017_music_profiles.sql` to the existing D1 DB using
   the usual operator migration process. This only adds profile tables/indexes.
   Production and preview share DB bindings, so review the target before running:
   `npx wrangler d1 execute xtrata-manage --remote --file functions/migrations/017_music_profiles.sql`.
2. Set `MUSIC_PROFILE_ENABLED=1` for the intended Pages environment and deploy the
   website/function build. Without this switch and migration, the endpoint
   reports unavailable; it cannot register links. Nothing changes in anonymous
   listening, paid playback or existing downloads. The desktop URL is pinned to
   `https://xtrata.xyz`, so the service must be active there before publishing the
   new app betas. A branch deployment alone cannot enable the production flow.
3. `npm run build:music-profile` creates the ignored browser bundle. The normal
   `npm run build` includes this step. Pages Functions compile separately in the
   usual deployment. The profile page lives at `/music/profile` and labels appear
   on `/music/heroes`; no protocol handler or extension is added to the local app.
4. Build standard/legacy universal Mac 1.0.5 and native Windows 11 x64 1.0.8 using
   existing lockfiles and release pipelines. Windows CI includes the new real
   wallet/SQLite profile tests. No runtime upgrade or wallet migration is needed.
5. Verify package contents/checksums and perform native install/profile-flow
   checks. No personal wallets or live transfers were used in automated tests.
   Supervised live signature/transfer checks remain separate release evidence.
6. Publish new immutable beta tags/artifacts, then append three entries to
   `betaDownloads` and matching fallback HTML under the existing collapsed
   **Beta Versions** section. Preserve existing beta and normal downloads. Label
   the new feature and genuine test/signing status. No new download URL should be
   advertised until the actual uploaded asset/checksum is verified.

## Reproduction and checkpoint

Targeted tests:
`npx --no-install vitest run functions/api/__tests__/music-profile.test.ts functions/api/__tests__/music-profile-transfer.test.ts scripts/wizard/__tests__/music-profile.test.ts`

Browser (installed Chrome, isolated profile, all requests mocked):
`npm run build:music-profile && node scripts/music-support/profile-smoke.mjs`

Storage tests use Node 24's real in-memory SQLite through a transactional D1
adapter and actual disposable wizard filesystem storage. No broadcast transport
is available. Coverage includes both roles, altered signed fields, replay,
expiry, concurrent revision conflict, unlink invalidation, ownership changes,
API outages, transfer matching/timing/memo, duplicate transfer, transactional
rollback, rate admission, protected-key non-disclosure and empty payment journal.

Shared regression checks: listening, threshold/mute, returns, desktop boundaries,
source-package closure, Heroes and existing beta-download rendering. Website
browser smoke covers transfer/unlink consent, fragment removal and mobile width.
Native BNS-owner wallet UI interoperability, actual Windows DPAPI signing,
physical hardware and live verification payments are NOT RUN in these tests.
