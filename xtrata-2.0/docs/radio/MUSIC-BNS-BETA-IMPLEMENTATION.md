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
wrong-amount, wrong-memo and reused transfers are rejected. After refreshing the
verification page, reopen the original Continue link in the app to resume while
the request is valid. The proof is removed from the website URL and is not stored
in browser storage; the app retains its Continue link for the current session.

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

## Completed evidence and release checkpoint — 2026-09-23

Desktop payload source: `c4444716d`. Follow-up changes only clarify website resume
instructions, correct the existing desktop smoke expectation for muted status,
and record evidence.

- 78 targeted/shared tests passed, including 14 new profile tests.
- Profile browser smoke passed: transfer, explicit unlink, fragment cleanup and
  390px mobile layout. Full website build and Pages Functions compilation passed.
- Isolated Electron desktop smoke passed: new profile controls, free playback,
  consent, mute/unmute and payment-event regression assertions. No live wallets.
- Source-package runtime closure passed. Both Mac ASARs contain 357 files; profile
  runtime files match committed source, version is 1.0.5, and wallet, environment
  and test-entry files are absent.
- Standard and Monterey DMG integrity and ZIP CRC checks passed. Both builds are
  unsigned/not notarized. This is not physical Intel/Monterey installation or real
  BNS-owner wallet interoperability verification.

Local artifacts, under `.artifacts/` (not committed):

| Artifact | SHA-256 |
| --- | --- |
| `music-desktop/Xtrata-Music-1.0.5-mac-universal.dmg` | `1b311d09284a806f5f6fd2f7e87adab7416a8676c7a6d52dffebff8133587207` |
| `music-desktop/Xtrata-Music-1.0.5-mac-universal.zip` | `f648094652f7fa7bd5f5320d99f6b8bedfc1838f7016d5118389dfcfb36de9bf` |
| `music-desktop-legacy/Xtrata-Music-Legacy-1.0.5-mac-universal.dmg` | `7126ac8065a71a3c0f1452cf743bf7e590f1e16d19dbf0fbcba110021a006ea3` |
| `music-desktop-legacy/Xtrata-Music-Legacy-1.0.5-mac-universal.zip` | `437915556a510eb3e176cd59bd21a4fc40da57b87bd5cf0d977426251a41ad35` |

Each artifact has an adjacent `.sha256`. Detailed package evidence is in
`.artifacts/music-profile/mac-package-report.json`.

Pending: permission to push this branch (requested), native Windows CI build/test
of 1.0.8, production D1 migration and `MUSIC_PROFILE_ENABLED=1` activation, real
BNS-owner signature and supervised transfer checks, then release publication and
additional Lounge beta links. Existing normal/beta downloads remain unchanged.
No live payment or production migration was made.
