# Xtrata Music Mac 1.0.4 / Windows 1.0.7 beta release

Publication explicitly authorised on 23 September 2026. These are unsigned beta
builds, not a claim of full hardware or live-payment verification. Existing Mac
1.0.3 / Windows 1.0.6 Lounge downloads remain visible. New builds are in the
collapsed-by-default **Beta Versions** section. `betaDownloads` is separate from
regular update metadata, so existing apps do not advertise these as regular updates.

## Behaviour and defaults

- Support OFF after launch; explicit session approval remains required.
- Audible listening threshold ON. See Phase 3 for timing/short/unknown policy.
- Congestion estimate ON for cap approvals; cached/coalesced requests and cooldown.
- Default network cap 1,000 microSTX. Actual chosen fee may be lower; normal
  serialized-size floor 257 microSTX. Holder payment 50 microSTX; no platform fee.
- At most two automatic fee increases for the oldest pending transaction,
  within the original approved cap. No new blanket spending approval.
- Queued paid starts OFF. No contract deployment or configuration switch.
- New supplied Xtrata logo and current public-history count correction included.

## Build provenance

Mac runtime: `1a8c4e77a81f538616b6247b1755db52958f6a7f`; standard Electron
44.4.1, legacy Electron 43.7.3. Universal Intel/Apple silicon; minimum OS 13 and
12 respectively. Built on macOS 26.5.2. Both packaged runtimes match source.

Windows: native CI run 35887901449, source
`3c26ec854ed97dcca0206184eef925d2ab5f1038`. Final outcome recorded below.

Reproduce from `xtrata-2.0/desktop/music`: `npm ci`, `npm run dist:mac`,
`npm run dist:mac:legacy`. Windows uses the locked dependencies and native
Windows-only `music-desktop.yml` workflow (`target=windows`). No funded wallet
or real transaction transport is used by automated checks.

## Verification

- PASS: 197 tests across 27 suites, plus the subsequent additional beta-update
  isolation regression test (5/5 release-policy tests).
- PASS: browser smoke at desktop/mobile sizes, guide dialogs, release validation,
  per-artifact version labels and beta mouse/keyboard disclosure behaviour.
- PASS: full website build.
- PASS: both Mac DMG checksums, ZIP CRCs, ASAR version/source/content inspection;
  no wallet, test or development payload files. GitHub digests match local assets.
- NOT RUN: physical Windows 11 / Intel Mac / Monterey hardware checks, four-hour
  soak, real download-security/installation path and supervised live payments or
  returns for these beta builds. Existing wallets were not opened for packaging.
- Repository-wide lint retains 276 pre-existing errors; this release does not
  claim a clean global lint result.

## Mac artifacts

Published prerelease: https://github.com/stxtrata/xtrata/releases/tag/music-v1.0.4-mac-beta.1

| Artifact | SHA-256 |
|---|---|
| Xtrata-Music-1.0.4-mac-universal.dmg | ecab7ae4e75fb544d3bdc496fe9fcbb6e968d972ebf9584b4f2219fe5ff23d2a |
| Xtrata-Music-1.0.4-mac-universal.zip | 6f767ca8931a7da2ab91603d7e5b28eaee8ae8c45d91d76cb93de97f963c537b |
| Xtrata-Music-Legacy-1.0.4-mac-universal.dmg | 6b930ffad160ca0a3cb7956b8698cbf5e862e391258123b3acb23109522cfe17 |
| Xtrata-Music-Legacy-1.0.4-mac-universal.zip | 8717caa5cab3021372c3e965e155758f941e88df82b7a0f59183c302692454e5 |

Each asset has a companion `.sha256`. Earlier Phase 5 hashes refer to superseded
local builds; this table is the published Mac build inventory.

## Windows verification and artifact

Native run 35887901449 **PASS**: 146 shared tests in 14 suites; contract checks
(9 plus 20 tests); source closure; actual Windows DPAPI persistence, interrupted
write/dead-lock/corruption checks; isolated Electron audible playback, looping,
minimize and no duplicate pause/resume payment; real-entrypoint isolated startup,
wallet reuse and single instance; NSIS build; final ASAR inspection (353 entries).

Installer: `Xtrata-Music-1.0.7-windows11-preview-x64.exe`, 121,553,778 bytes.
SHA-256: `1001f7e9f577d34a2adcf80a384f5519708e6394da35d955258dfcee311484fa`.
Downloaded bytes match native CI report and checksum. CI's PowerShell
Get-AuthenticodeSignature module was unavailable, recorded honestly in its report.
Independent PE inspection of the downloaded installer found a zero address/size
certificate table: the installer is unsigned. No signature verification is claimed.

Local Windows artifacts/evidence: `.artifacts/music-windows-107/`. CI log:
`/tmp/music-windows-107-ci.log`. First artifact download suffered a connection
reset; a second download succeeded and its hash matched. No build retry was needed
for that transfer failure.

Release: https://github.com/stxtrata/xtrata/releases/tag/music-v1.0.7-windows-beta.1
(publication/upload completion tracked below).

## Publication completion

Both GitHub prereleases published with `latest=false`. All eight Mac assets and
all four Windows assets were verified against GitHub's uploaded SHA-256 digests.
The Lounge manifest and HTML fallback contain both Mac 1.0.4 variants and Windows
1.0.7 under the closed Beta Versions disclosure. Existing downloads and the
regular-update version field remain byte-for-byte equivalent as JSON values.
Website deployment verification is recorded after deployment below.

Production deployed successfully to Cloudflare Pages project `xtrata`, branch
`main`, from release-page commit `2d5a2b238`. Deployment:
https://f51df96a.xtrata.pages.dev — live URL https://xtrata.xyz/music/lounge .
All six existing/beta artifact links returned HTTP 200. Live Chromium verification
confirmed three existing cards, three beta cards, correct labels, collapsed initial
state, mouse expansion and keyboard collapse. Screenshot and structured check:
`.artifacts/music-beta-live/downloads.png` and `verification.json`. Final site build
and desktop/mobile browser smoke passed. Publication is complete. Source/report
commits still need the user-managed push so future repository deployments retain
these links; no Git push was performed by the agent.

## Subsequent in-app branding change (not in published installers)

The supplied Xtrata X now replaces the text X in the local/desktop Lounge header
and default artwork placeholder. The WebP is copied into both desktop variants
and the source companion, and served through the authenticated desktop route.
Source archive closure and 14 packaging/desktop tests passed. Isolated Chromium
verified both images decode/render without accessing any wallet. Screenshot:
`.artifacts/music-logo/lounge.png`. Existing published installers are immutable
and do not contain this subsequent change; a new installer build is required.
