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

## Publication checkpoint — 2026-09-23

- User pushed the implementation. Native Windows CI run
  [35911031582](https://github.com/stxtrata/xtrata/actions/runs/35911031582)
  passed against `63c9f98d81362fcc8b90918f0a3cd070a4ee97cf`.
- Windows: 162 shared tests, 9 ownership/amount contract tests and 20 additional
  contract tests passed. Native DPAPI protected-storage/journal recovery,
  isolated Electron playback and single-instance checks passed. Packaged ASAR
  inspection found 357 entries, required runtime files and no wallet secrets or
  development/test files. No automated test broadcast a payment.
- Installer: `Xtrata-Music-1.0.8-windows11-preview-x64.exe`, 121571670 bytes,
  SHA-256 `d87a13074c46f4bd3612f6e26b230333bceadff3f7feee1f6e24063b3407043f`.
  Local rehash matches the native CI report/checksum. PE certificate-table
  offset/size are both zero: this installer is unsigned.
- Applied migration 017 to the verified existing `xtrata-manage` production D1
  database (six additive schema queries). Enabled `MUSIC_PROFILE_ENABLED=1`
  in production/preview configuration. Production deployment `22f07e7c` serves
  the BNS endpoint; a read-only request for an unused public address returned
  HTTP 200 with an empty profile list. This is service readiness, not a live
  ownership-verification test.
- Lounge changes preserve the three normal downloads and three older beta
  downloads, adding Mac 1.0.5 standard/legacy and Windows 1.0.8 under the same
  collapsed Beta Versions section. Six release/render tests, desktop/mobile
  mocked browser smoke and the full website build passed.

Local Windows evidence: `.artifacts/music-windows-108-beta1/` (installer, checksum,
source-revision report and package inspection); Mac evidence is listed above.
Reproduce Windows via the existing `music-desktop.yml` workflow on the exact
source SHA with `target=windows`; use existing Mac build scripts and lockfiles.

NOT RUN: physical Windows/Intel/Monterey installation and extended hardware
checks, real BNS-owner signature interoperability, supervised live transfer and
unlink checks. No funds were moved. These are unsigned optional testing betas,
not fully validated stable releases.

All 13 uploaded assets (installers, ZIPs, checksum files and reports) matched
GitHub's SHA-256 digest and byte count. Published as optional prereleases:

- [Mac 1.0.5 beta 1](https://github.com/stxtrata/xtrata/releases/tag/music-v1.0.5-mac-beta.1)
- [Windows 1.0.8 beta 1](https://github.com/stxtrata/xtrata/releases/tag/music-v1.0.8-windows-beta.1)

Published website revision: `58e90f86d`.
Production deployment: `776f872c`; branch preview: `1fddc65c`.
Both the production Lounge and `main-music-updates.xtrata.pages.dev` now serve
three normal and six beta downloads. Live isolated-browser checks passed for
correct new version labels, initially collapsed betas and mobile/desktop widths.
All three new installer URLs returned HTTP 200 with expected byte lengths.
The profile page returned HTTP 200; production and preview profile endpoints
returned empty lists for an unused address. These checks do not prove real owner
signature/transfer interoperability.

Preview deployment emitted an existing configuration warning that
`RADIO_LIKES_CONTRACT` is absent from preview vars; it did not prevent this
deployment or BNS readiness check. This release does not change likes settings.
No Git push was performed; the user retains control of pushing the final
website/report commits.

## Profile wallet connection correction — 2026-09-23

The first published page called Connect's legacy structured-signature popup
helper without a Blockstack login session. Its default-option lookup threw
“No user data found” before the wallet opened, despite an explicit owner address.
The page now reuses Xtrata's wallet chooser/session store, displays the connected
address and offers connect/switch/disconnect. Verify connects if needed, checks
the connected owner and expiry, then builds the unsigned structured-message
request directly with the explicit mainnet network/address. It sends that request
to the selected wallet's signing provider (Xverse's Stacks bridge when its Bitcoin
bridge handled account selection). No legacy user-data lookup is required.
Server-side owner-signature verification remains authoritative.

Checks: 17 targeted page/API tests passed, including real request-envelope
serialization without a legacy session, Xverse bridge selection, wrong-owner
rejection and cancellation/retry. Mocked browser transfer/unlink/mobile smoke and
full website build passed. Real extension signing remains user verification; no
personal wallet was accessed and no signature or transaction was requested.
This is a website-only correction; installed desktop betas need no rebuild.

### Wallet chooser delivery correction

A fresh browser displayed the shared chooser correctly, including installed
Leather/Xverse entries. However `/radio/music-profile.js` was served with
`public, max-age=14400, must-revalidate`, while `/music/*` HTML uses no-cache.
Returning users could therefore receive the new button with the earlier script
that never attached its handler. Versioned the script URL to invalidate those
cached copies immediately and added an exact no-cache header for future updates.
The working `/music/` page also versions its wallet script.

`node scripts/music-support/profile-connect-smoke.mjs` passed with the actual
bundled chooser and simulated Leather/Xverse extensions: visible chooser,
selection, connected address, switch and Escape cancellation. All requests are
intercepted; no real wallet/signing/payment access. The first Xverse simulation
omitted its Bitcoin RPC bridge and failed; adding the real two-bridge shape made
the test representative and it passed. Full website build passed.

Live verification found the custom domain still overriding the cache header,
while the immutable Pages deployment correctly returned no-cache. The fix also
uses a distinct `music-profile-wallet-v2.js` filename (not only a query string)
so old cached script URLs cannot be reused. No CDN security settings changed.

## Windows focus recovery fix — prepared 1.0.9 beta

User reproduced non-editable BNS text and an unresponsive verification dropdown
in Windows 1.0.8 after approving Music Support. Alt+Tab restored editing. This
matches Electron's confirmed Windows native alert/confirm focus-loss issue:
https://github.com/electron/electron/issues/40212 . The fields are not disabled by
BNS logic and no drag region/overlay was found over them.

Replaced native `confirm()` in support, BNS profile and operator-test approval
with an in-document modal. Cancel has initial focus; Escape, Stop and page exit
cancel without approving. Only Continue resolves approval. Original approval
text is preserved. Support rechecks its stop generation and agreement before
calling enable after the asynchronous confirmation. No wallet/key/payment
backend changes. Mac release metadata remains 1.0.5; Windows next build is 1.0.9.

Verification: 36 desktop/listening unit tests passed. Real isolated Electron
smoke on this Mac passed, including mouse focus plus keyboard typing in the BNS
field before/after approval, method selection, Escape/Stop causing zero enable
requests, free/muted playback, paid simulated loops, no duplicate resume charge
and sandbox/cookie checks. No real wallet/payment. The initial test attempted
platform-dependent dropdown keyboard navigation and hung during shutdown;
replaced with the selector change assertion while retaining real text typing.
Native Windows focus and popup behaviour is NOT yet verified: push the commit,
run existing native Windows CI, then test the resulting new installer on the PC.
Existing published installers and Lounge links remain unchanged pending that
build. Temporary workaround for installed 1.0.8: Alt+Tab away and back after a
native confirmation. Source changes alone do not update an installed app.
