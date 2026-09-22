# Xtrata Music Windows 11 x64 preview

This is the Windows port of **Xtrata Music 1.0.1**, not a second wallet or a
different Music product. It packages the same free radio, optional Music
Support payments, current contract rules and Mac-compatible application
architecture for **Windows 11 x64** only. It is a preview until the native
Windows checks below have passed.

No installer or checksum is claimed by this document. A Windows artifact is
publishable only after it has been built on an authorised native Windows
environment, inspected, hashed and tested on a physical Windows 11 x64 PC.

## What stays free and what is optional

Free listening never needs a wallet, funding or consent. The player shows
artwork and song, artist and album metadata where it is available. It refreshes
the catalogue every three minutes without interrupting the current track.
Tracks shorter than 60 seconds, and tracks whose duration cannot be established,
remain free and do not create a paid start. Exactly 60 seconds is eligible.
The payment service derives that decision from the verified WAV or MPEG audio
bytes it serves; a renderer or browser companion's duration field is only a
playback hint and cannot make an unknown or short recording payable.

Music Support starts **off** every time the application starts. The listener
must approve it for that session. An eligible new start can pay exactly 50
microSTX (0.000050 STX) to the master inscription's current eligible holder,
using the listener's chosen fixed network fee (300 microSTX / 0.000300 STX by
default). There is no Xtrata platform fee and the app never raises a fee by
itself. Pause, seek, resume, refresh and repeated media events do not pay the
same start twice. A payment failure leaves ordinary audio playable; the app does
not queue a catch-up charge or silently replace an uncertain submission.

## Windows wallet and data handling

The separate support wallet lives in Electron's stable per-user application-data
folder, at `app.getPath('userData')/support-wallet`, rather than in the
installation or cache directory. Its exact parent path is selected by Windows
and Electron for the signed-in user. The installer is per-user and is configured
not to delete application data on uninstall, so it is designed to preserve the
wallet identity and transaction history through normal replacement, upgrade and
uninstall/reinstall. That installed-path behaviour still needs the manual check
listed below. Deleting application data can lose the wallet and funds.

On Windows, the wallet private key is encrypted by Electron `safeStorage`, which
uses Windows DPAPI. The vault stores only a DPAPI-protected value; it does not
write an `unlock.key`, plaintext private key, wrapping key or browser copy. If
DPAPI is unavailable, the protected value is malformed, a file cannot be safely
read or written, or the wallet state is uncertain, the app fails closed and
does not create, replace or spend from a wallet. Existing legacy/Mac vaults are
not silently migrated or replaced by the Windows preview: they remain untouched
and must be recovered or returned with their original application.

If this safe opening step fails on Windows, Music Support is shown as unavailable
and the application still opens for free listening. The unavailable state has no
wallet address, signing path or return-funds action.

Wallet journal writes use a new temporary file, durable write and atomic rename.
Operation locks carry owner and age metadata. Only a verified stale lock from a
dead process can be recovered, and only after Electron has already obtained its
per-user single-instance lock for the sole application process. A standalone
backend caller cannot recover a stale pathname lock: it fails closed. A live,
malformed or uncertain lock also blocks spending. A payment identity is persisted
before broadcast, then reconciled before any further payment, which prevents
guesswork or duplicate replacement transactions after an interruption.

The Electron shell remains single-instance, sandboxed and context-isolated with
Node disabled in the renderer. Its local server is authenticated by a random
HTTP-only cookie. Navigation, external links and `xtrata-music://open` are
validated; a protocol link or second application instance may focus the window
but can never enable support or sign a transaction.

## Reproducible native Windows build

Run these commands on an authorised **Windows 11 x64** build machine from the
`xtrata-2.0` checkout, using the committed desktop lockfile. They create a
per-user x64 NSIS preview installer with the stable application identity
`xyz.xtrata.music`:

```powershell
# Install the project and desktop dependencies from their committed lockfiles.
npm ci --ignore-scripts
npm ci --prefix desktop/music
npm ci --prefix contracts/clarinet --ignore-scripts
npm --prefix desktop/music run prepare:app

# Offline targeted suite: real temporary filesystem, mocked network transport.
npx --no-install vitest run `
  scripts/wizard/__tests__/radio-listening.test.ts `
  scripts/wizard/__tests__/radio-listening-policy.test.ts `
  scripts/wizard/__tests__/radio-plays-backend.test.ts `
  scripts/wizard/__tests__/radio-recovery.test.ts `
  scripts/wizard/__tests__/radio-returns.test.ts `
  scripts/wizard/__tests__/radio-windows-vault.test.ts `
  scripts/wizard/__tests__/music-release-policy.test.ts `
  scripts/wizard/__tests__/music-web-bridge.test.ts `
  scripts/music-support/__tests__/desktop.test.ts `
  scripts/music-support/__tests__/source-package.test.ts `
  src/lib/radio/__tests__/audible-start.test.ts

# Prove the standalone Mac/Linux source companion has every runtime module and
# asset it reads, and prove the actual Clarity payment rules offline.
npm run test:music-support-package
npm run test:radio-plays

# Native Windows-only storage and actual Electron smoke checks. Both use
# disposable profiles and mocked/offline transport; they cannot broadcast.
npm --prefix desktop/music run test:win:storage
npm run music:desktop:test
node scripts/music-support/desktop-startup-smoke.mjs

# Build the NSIS installer once. electron-builder leaves the unpacked app from
# that same build in win-unpacked for inspection.
$dirty = git status --porcelain --untracked-files=normal
if ($dirty) { throw 'Build from a clean, committed source tree.' }
npm --prefix desktop/music run dist:win
node scripts/music-support/windows-package-inspect.mjs `
  --asar .artifacts/music-desktop/win-unpacked/resources/app.asar `
  --report .artifacts/music-desktop/windows11-x64-package-inspection.json

# Generate the installer checksum, exact clean source revision and
# Authenticode evidence from the same native Windows host.
node scripts/music-support/windows-preview-report.mjs `
  --artifact-dir .artifacts/music-desktop
```

The build must be run from the exact clean Git revision intended for release.
The evidence generator refuses a dirty tree or a CI revision mismatch. Record
that revision, the installer filename, SHA-256 and the output of the package
inspection with the release evidence. The `app.asar` listing must not contain a
wallet directory, `unlock.key`, vault/journal data, `.env` files, test-only
entrypoints or source maps that are not intentionally packaged.

No signing status is claimed until the native Windows evidence report has
recorded the installer's actual Authenticode status. The current expected
preview state is unsigned unless an authorised build identity signs it. It may
produce Windows security warnings. It uses the bundled Xtrata Windows icon,
whose installed appearance still needs a native Windows check. Do not tell users
to disable Windows security protections; an unsigned preview is only for
informed testers who have independently checked the published checksum.

Platform release metadata is filtered by compatible platform, so Windows-only
and Mac-only assets are not advertised to the other application.

After a real Windows build has passed the checks above, been uploaded to the
actual Xtrata GitHub release, and its checksum has been compared, record the
preview in the public manifest with the real release URL. Do not substitute a
guessed URL:

```powershell
node scripts/music-support/release-manifest.mjs win-x64 `
  .artifacts/music-desktop/Xtrata-Music-1.0.1-windows11-preview-x64.exe `
  <published-Xtrata-GitHub-release-URL> 'Windows 11 x64' --preview-tested
```

## Compact release gate report

Status below is intentionally conservative for this changeset. “Not run” is not
a pass.

| Gate | Status | Evidence or prerequisite |
| --- | --- | --- |
| Shared playback, support, journal and return tests | PASSED (macOS 26.5.2) | 87 targeted tests, mocked/offline transport and real temporary filesystem; empty and failed catalogue cases remain playable/retryable without a tight loop. |
| 59/60/61 seconds and unknown-duration eligibility | PASSED (macOS 26.5.2) | Renderer and payment-service tests use verified WAV/MPEG bytes; 59/unknown stay free, while 60/61 can request one payment. |
| Consent/race, duplicate event, mute/unmute and refresh behaviour | PASSED (macOS 26.5.2) | Targeted unit suite plus isolated Electron smoke; no real wallet or payment. |
| Pending/confirmed/failed history, unknown broadcasts and reviewed returns | PASSED (macOS 26.5.2) | Durable journal tests cover prepared/submitted/confirmed/terminal-failed states, no replacement of uncertain starts, and return review/double-submission validation. |
| Local request authentication, protocol validation and second instance | PASSED (macOS 26.5.2) | Isolated Electron smokes reject unauthenticated local/extension routes; actual entrypoint smoke verifies inert protocol parsing and that a second instance exits. |
| Source companion archive closure | PASSED (macOS 26.5.2) | Temporary archive build confirms every relative import and runtime-read asset is present; Windows launcher is intentionally hub-only. |
| Exact 50 microSTX holder payment, fixed fee, ownership changes and no catch-up | PASSED (offline Clarity simulation) | 29 contract/deploy tests include the current-holder transfer after ownership changes, exact 50 microSTX transfer and duplicate prevention. |
| DPAPI persistence, unreadable protected data, interrupted-write, corruption and stale-lock recovery | PASSED (adapter simulation + real filesystem) | Windows-vault tests use a simulated DPAPI adapter and actual temporary files. The native smoke implements the same DPAPI/journal/stale-lock path but has not run here. |
| Existing Mac regression package | PASSED (macOS 26.5.2) | Rebuilt unsigned universal DMG/ZIP and inspected the final ASAR (349 entries; no wallet, test, source-map or TypeScript source files). This is a packaging regression check, not a clean-machine install result. |
| Native Windows DPAPI smoke and Electron smokes | NOT RUN | The native smoke is implemented for Electron safeStorage/DPAPI, journal pre-broadcast persistence, interrupted temporary files and stale locks. It requires Windows 11 x64. |
| Native x64 unpacked package, NSIS installer, package inspection and SHA-256 | NOT RUN | Requires an authorised native Windows build. No artifact exists yet. |
| Physical Windows 11 installation/upgrade/uninstall/reinstall | NOT RUN | Requires a named physical Windows 11 x64 PC. |
| Spaces/non-ASCII paths, 100/150/200% scaling, devices, sleep/wake and four-hour soak | NOT RUN | Requires physical Windows hardware and manual observation. |
| Website download and unsigned-security-warning path | NOT RUN | Requires a reviewed published preview asset and clean Windows machine. |
| Supervised live paid start, no-duplicate check, Lounge display and approved return | NOT RUN | Requires separate explicit authorisation, a newly created disposable Windows wallet and a small approved balance. |

Before a public preview, replace each applicable status with the command result,
hardware used, source revision, artifact SHA-256 and any failure. A VM/CI result
may supplement a named physical-machine result but never replaces it.

## Implementation checkpoint

Current source is the `main-music-updates` working revision based on
`27cb7025b`. This implementation adds the Windows x64 NSIS configuration,
DPAPI-only Windows vault, package inspection, native-test harness and shared
payment protections. The final native Windows artifact, its exact clean source
revision and SHA-256 will be written by `windows-preview-report.mjs`; none exists
yet. Next action: run the manual Windows workflow on a native Windows 11 x64
machine, then perform the named physical-machine checks before any publication.

## Retained data and support boundary

The retained per-user folder contains the protected wallet vault and its public
transaction history. It is not a backup, portable wallet, cloud sync or account
recovery system. Support payments are optional local actions; the public Lounge
can read confirmed contract activity without a wallet connection. Closing the
app ends the session's approval for new support payments. Previously submitted
transactions may still settle and are shown as pending until they are reconciled.

## Installer handoff — 2026-09-22

Review follow-up to `b29cc1f28`:
- The committed-file flush now opens a writable handle on Windows, as required
  by FlushFileBuffers. Mac retains its existing handle mode.
- Shared backend/recovery/return tests use a test-only Windows vault adapter
  with real wallet/filesystem code and default-denied network transport.
  The native Electron smoke still requires actual DPAPI; the adapter is not
  packaged or used by the application.
- The manual Music desktop preview workflow defaults to `target=windows`.
  `target=all` retains the existing other desktop build choices.

After the user pushes this follow-up commit to `main-music-updates`, run:

```sh
gh workflow run music-desktop.yml --repo stxtrata/xtrata --ref main-music-updates -f target=windows
```

Watch that run and download its `music-win-x64-preview` artifact only when all
Windows gates pass. The bundle must contain the NSIS `.exe`, `.sha256`, exact
source/signing report and package-inspection JSON. A hosted Windows runner is
CI evidence, not a physical Windows 11 test. No release is published by this
workflow. No funds are needed for the automated checks.

On the separate Windows 11 x64 PC, compare the checksum, install as the normal
user and test free audio first. Record hardware/OS, artwork, metadata, loops,
scaling, audio devices, network recovery, restart and the four-hour soak.
Verify the same wallet address/history after upgrade and uninstall/reinstall.
Only then perform separately authorised funding, paid-start and return tests.
The installed application bundles its runtime; the tester does not need Node
or developer tools. Keep Windows security protections enabled.

Current blocker: GitHub authentication is available and the remote branch is
at `b29cc1f28`, but the corrected source must be pushed by the user before a
build is dispatched. No Windows installer has been produced in this follow-up.

Follow-up validation: 30 backend, Windows-adapter, recovery and return tests
passed on macOS with offline transport. Workflow YAML parsed successfully with
Windows as the default. Native Windows DPAPI/build/installation remain NOT RUN.

### First native CI attempt

Run https://github.com/stxtrata/xtrata/actions/runs/35731089585 used
`d2ecf08b5905b57715c1bc1caa2d11627031700f`. It failed during checkout because
three unrelated Narrate-AI audio paths exceed Windows filename limits. No
application tests or packaging ran; no installer was created. The workflow
now checks out only `xtrata-2.0` and `.github` (plus Git cone-mode root files).
Retry is justified once that checkout correction is pushed. This preserves
all unrelated repository files and leaves the application build inputs intact.

### Second native CI attempt

Run https://github.com/stxtrata/xtrata/actions/runs/35732645259 used
`ba169f157ea03a3dbf8c02ce1715f40cf0b65b97`. Checkout and dependency installation
passed. 36 tests passed; five suites could not import the shared backend due
to a parser SyntaxError. Converting only `scripts/wizard/inscribe.mjs` to CRLF
locally reproduced the exact same error at the same backend import location;
restoring LF removed it. The pinned Vite/Vitest transform and this module's
hashbang require LF source here. Project attributes now enforce LF for `.mjs`
and `.clar`; the latter also preserves exact deployed-contract source hashes.
No tests were bypassed and no dependencies upgraded. The full 87-test shared
suite passes locally after the fix. Git attributes resolve to LF for both the
affected module and paid-play contract. Native rerun remains required after
the user pushes the correction; packaging/installer/physical/live gates remain
NOT RUN.

### Third native CI attempt

Run https://github.com/stxtrata/xtrata/actions/runs/35734640000 used
`89ef8c6ffc1c4ee876e992c3a557ddc079be8a46`. All suites imported successfully;
86 of 87 shared tests passed on Windows. The sole failure asserted POSIX
0600 permission bits on the public return quote, but Windows reported 0666.
The test now verifies the persisted quote equals the reviewed quote on every
platform and asserts Unix mode bits only on POSIX. Windows vault protection
and native DPAPI gates remain required, unchanged. The 12 return tests pass
locally after this correction. Packaging and native DPAPI stages have not yet
run because the shared-suite gate stopped the workflow. Retry requires this
small test correction to be pushed; no runtime change or gate bypass is made.
