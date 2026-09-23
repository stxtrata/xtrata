# Shared recovery release checkpoint

Latest release: Mac standard/legacy 1.0.3 and Windows 1.0.6.
The earlier 1.0.2/1.0.5 evidence below is retained as release history.
See the request-efficiency build evidence at the end for current artifacts.

Targets: standard/legacy universal Mac 1.0.2; Windows 11 x64 1.0.5.
One shared source revision; platform versions live in desktop/music/release-versions.json.
Mac scripts set installer metadata to 1.0.2; prepare.mjs copies the matching in-app version.

Recovery: passive reads/startup cannot submit. Once support is explicitly enabled,
heartbeat reconciliation may resend the exact signed bytes of one missing payment.
Checks: signed transaction identity, mainnet, unchanged fee/song/receipt, wallet
signer, available account nonce, no indexed pending nonce/gap, sufficient funds,
absent contract receipt, repeated transaction lookup, session consent and kill
switch immediately before committing and before submitting. Three durable retries
maximum with 60-second backoff. No signing, automatic fee increases, journal deletion,
new catch-up payments or wallet migration. Visible pending/receipt delay keeps
support enabled and listening free. Higher-fee replacement remains manual tooling.
Reports after ten failed recovery checks contain public event fields only.

Automated evidence so far: 93 shared tests (three old message expectations initially
failed; the specific “not visible” diagnosis was retained and affected tests passed).
Isolated Mac Electron playback/consent smoke passed with mocked payments. New tests
cover exact-byte retries, durable retry limit, nonce/receipt refusal, consent
revocation after journal save, ambiguous transport backoff and visibility races.
No actual wallet modified or payments broadcast. Physical Windows, Intel Mac,
Monterey and supervised live checks remain NOT RUN.

Checkpoint: builds and release uploads complete. Published installer bytes verified
against local SHA-256 for all three platforms. Lounge manifest and fallback cards
updated together; final page check and deployment follow.

## Final build evidence

Build source: `2449d7f9bf6b438e8db29aa6a8d25adc0125bc60`.
Native Windows CI: https://github.com/stxtrata/xtrata/actions/runs/35842677618 — PASS.
All 93 shared tests passed on the final source. Windows additionally passed
contract, source-package, native DPAPI, desktop and actual-entrypoint gates.
Mac standard and legacy Electron playback/consent simulations passed on arm64
macOS 26.5.2; disposable-wallet startup/persistence passed on standard Electron.
Both Mac DMGs passed hdiutil verification; lipo verified x86_64 + arm64 binaries.
Package and displayed Mac versions both verified as 1.0.2. All three ASARs inspected:
349 entries each, no wallet/test/development files, required runtime files present.
These are unsigned previews, not a claim of physical Windows/Intel/Monterey or
live-payment verification. Those checks remain NOT RUN. No personal wallet used.

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| Xtrata-Music-1.0.2-mac-universal.dmg | 229929011 | f97f3f0b250d25fd9d2058f12674e2564f446abbd48cedb646188f2e70f1152e |
| Xtrata-Music-Legacy-1.0.2-mac-universal.dmg | 223863343 | 37b7f6573b08a92e3462f0ecdd797bcf2ef5e3f9706c17b0f355981233770ee7 |
| Xtrata-Music-1.0.5-windows11-preview-x64.exe | 121154258 | 37e3d9d9b0123426555b534aa71d879aedf1f3011ff3a09ec6681cf88937997f |

Reproduce from that revision with locked dependencies:

- `npm --prefix desktop/music ci` (install pinned Electron runtime if necessary).
- Native Mac: `npm --prefix desktop/music run dist:mac`, then `npm --prefix desktop/music run dist:mac:legacy`.
- Windows: dispatch `music-desktop.yml`, `target=windows`, at the build revision.
- Local artifacts/reports: `.artifacts/music-desktop/`, `.artifacts/music-desktop-legacy/`, `.artifacts/windows-105/`.

Release tags: `music-v1.0.2-mac-preview.1`, `music-v1.0.5-windows-preview.1`.
Future bumps must update release-versions.json and Mac extraMetadata.version
alongside package/lockfile values; platform version and published download
metadata must always agree. Existing Mac 1.0.1 and Windows 1.0.4 assets remain
unchanged. Wallet data remains outside the app installation.

Published-byte verification passed for all three downloads. Both Mac recovery/UI
payloads were compared byte-for-byte against the tested source.
Final lounge verification passed on desktop/mobile. Its previous hard-coded Mac
1.0.1 expectation was replaced with checks of all three current manifest entries:
exact link, visible version and checksum. Published-byte comparisons passed before
the lounge update was committed. The release remains a testing preview.

## Request-efficiency update — Mac 1.0.3 / Windows 1.0.6

Implementation checkpoint (2026-09-23): overlapping balance/recovery polling and
local full-history scanning were found in the current source. They plausibly
explain the reported increase in 429s; no server-side trace proves the exact
request that exhausted the provider quota.

Shared read requests are serialized at one-second intervals and identical active
requests are coalesced. Immutable deployed source is cached for an hour, network
identity for five minutes; spending balance/nonce/ownership/receipt checks remain
fresh. Display balance refreshes at most once per minute and keeps a labelled
last-known value during outages. Confirmation polling is every 30 seconds;
passive balance refresh no longer independently reconciles play transactions.
Recovery scans only unresolved payments. The local public-payments feed uses the
same coordinator, refreshes once per minute and loads older history on request
(three seconds between pages). Website automatic history loading is retained.

HTTP 429 applies a shared cooldown respecting Retry-After (seconds or date), with
30-second exponential fallback up to five minutes. No queued write/replay or fee
increase is introduced by the transport. Existing consent-bound, exact-byte
reconciliation remains in place. Normal audio is independent of chain service
availability. Public quotas still mean zero 429s cannot be guaranteed.

Validation: 98 offline/shared tests passed across 12 suites, including new tests
for read coalescing/pacing, Retry-After, zero requests during cooldown, no transport
replay and retained cached balance. All transaction transport was mocked. At the initial implementation checkpoint, native Windows verification and
publication were pending; completed build evidence follows below. No real payments or funded-wallet changes were made.

## Request-efficiency build evidence

Source: `7b6c9e409f6433f836a19aa52215e2ee7bf7f3d5`.
Native Windows CI: https://github.com/stxtrata/xtrata/actions/runs/35849837995 — PASS.
Shared tests, contract ownership/amount checks, native DPAPI, desktop playback,
actual-entrypoint persistence, package inspection and NSIS build all passed.
Standard and legacy Mac simulated playback checks passed on Apple silicon.
Both universal binaries contain x86_64 and arm64, report 1.0.3, match critical
source payloads and pass disk-image integrity checks. ASAR inspection: 349 entries
each, no wallet/test/development files. Physical Windows, Intel Mac, Monterey,
four-hour soak and live payments remain NOT RUN for this release. Unsigned previews.

Reproduce using the commands above at this source revision (Windows target only
for CI); platform versions are Mac 1.0.3 and Windows 1.0.6.

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| Xtrata-Music-1.0.3-mac-universal.dmg | 229952797 | e6dfca2dbc6e43398f7e9d34ae2213b5ac98925ae511316489a4ff455130b5e2 |
| Xtrata-Music-Legacy-1.0.3-mac-universal.dmg | 223858057 | 3599e0076e73db198c5b81ac2269669c023c99891c3b34baf34294e2c9a27371 |
| Xtrata-Music-1.0.6-windows11-preview-x64.exe | 121155294 | 97f6fb693b49d9debec049cc5a5c71eb3d54233a55e5286db5fe7d7b6e34d014 |

Published previews: `music-v1.0.3-mac-preview.1` and
`music-v1.0.6-windows-preview.1`. Installer/checksum/inspection reports accompany
the downloads. Lounge version labels and fallback URLs updated together.

Published installer bytes verified against local SHA-256 for all three downloads.

## Illustrated Lounge guides

Added the two user-supplied compressed WebP guides beneath the Lounge introduction,
installation first and app use second. Large responsive previews open a native
modal with a full-resolution scrollable image, fixed Close control and Escape
support. Direct image links remain available without JavaScript. The supplied
images are unchanged; nearby copy notes that screenshots show an earlier preview.
Desktop/mobile browser checks passed for both images, scrolling, Close, Escape,
and existing download/version/checksum behaviour. No desktop rebuild is needed.
