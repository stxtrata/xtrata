# Xtrata Music Windows 11 x64 preview

This is the Windows port of **Xtrata Music 1.0.1**, not a second wallet or a
different Music product. It packages the same free radio, optional Music
Support payments, current contract rules and Mac-compatible application
architecture for **Windows 11 x64** only. It is a preview until the native
Windows checks below have passed.

The **1.0.2** Windows installer passed native CI run
https://github.com/stxtrata/xtrata/actions/runs/35749671121 from source
`2e51fadfab73de18ae8d16116d2cf03a1ad2b22b`. It temporarily removes the
paid-start duration gate. Earlier 1.0.1 evidence below is retained as history.
Physical Windows 11 and supervised live verification remain outstanding.

A Windows testing installer is now available from successful CI run
https://github.com/stxtrata/xtrata/actions/runs/35738413241 (attempt 3 of the
five authorised attempts). Build source: `7f28a6ffc347fe42110ee44e2eb5fe8ce9ed584f`.
The hosted runner was Windows Server 2025 x64, image `windows-2025-vs2026`.
Physical Windows 11 testing and supervised live checks remain outstanding.
This is a test candidate, not a fully verified public release.

Artifact: `Xtrata-Music-1.0.1-windows11-preview-x64.exe` (121,152,270 bytes).
SHA-256: `4951ae029b83806d3fc2f2f1b8b431ab3cf721ad75b15ac8e4b2b28b0585e1b0`.
Download the `music-win-x64-preview` artifact on that run (GitHub login may
be required). It contains the installer, checksum and two evidence reports.
A second local hash of the downloaded installer matches the CI checksum.
The CI Authenticode probe returned Unavailable. Independent inspection of the
downloaded PE certificate directory found offset=0, size=0: this installer
has no embedded Authenticode signature. Do not describe it as signed.

## What stays free and what is optional

Free listening never needs a wallet, funding or consent. The player shows
artwork and song, artist and album metadata where it is available. It refreshes
the catalogue every three minutes without interrupting the current track.
In the forthcoming 1.0.2 preview, the temporary 60-second duration gate is
disabled. Every track that can be loaded from the verified catalogue can create
a paid start, including a short track or one whose duration cannot be
established. The payment service still verifies that the selected audio is
available; unavailable media remains free.

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
node desktop/music/node_modules/electron/install.js
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
npm run test:radio-plays -- --isolated

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
| Short, known and unknown-duration starts | RE-RUN REQUIRED for 1.0.2 | Source tests on macOS prove duration is ignored while the temporary gate is disabled; a new native Windows installer and smoke run are required before publishing. |
| Consent/race, duplicate event, mute/unmute and refresh behaviour | PASSED (macOS 26.5.2) | Targeted unit suite plus isolated Electron smoke; no real wallet or payment. |
| Pending/confirmed/failed history, unknown broadcasts and reviewed returns | PASSED (macOS 26.5.2) | Durable journal tests cover prepared/submitted/confirmed/terminal-failed states, no replacement of uncertain starts, and return review/double-submission validation. |
| Local request authentication, protocol validation and second instance | PASSED (macOS 26.5.2) | Isolated Electron smokes reject unauthenticated local/extension routes; actual entrypoint smoke verifies inert protocol parsing and that a second instance exits. |
| Source companion archive closure | PASSED (macOS 26.5.2) | Temporary archive build confirms every relative import and runtime-read asset is present; Windows launcher is intentionally hub-only. |
| Exact 50 microSTX holder payment, fixed fee, ownership changes and no catch-up | PASSED (offline Clarity simulation) | 29 contract/deploy tests include the current-holder transfer after ownership changes, exact 50 microSTX transfer and duplicate prevention. |
| DPAPI persistence, unreadable protected data, interrupted-write, corruption and stale-lock recovery | PASSED (adapter simulation + real filesystem) | Windows-vault tests use a simulated DPAPI adapter and actual temporary files. The native smoke implements the same DPAPI/journal/stale-lock path but has not run here. |
| Existing Mac regression package | PASSED (macOS 26.5.2) | Rebuilt unsigned universal DMG/ZIP and inspected the final ASAR (349 entries; no wallet, test, source-map or TypeScript source files). This is a packaging regression check, not a clean-machine install result. |
| Native Windows DPAPI smoke and Electron smokes | PASSED (Windows Server 2025 CI) | Run 35738413241: actual DPAPI, durable prepared journal, restart identity, corrupt-vault refusal, stale-lock recovery, isolated playback/consent checks and second-instance exit. Physical Windows 11 remains NOT RUN. |
| Native x64 unpacked package, NSIS installer, package inspection and SHA-256 | PASSED (Windows Server 2025 CI) | Clean source 7f28a6ffc; 349 ASAR entries/73 payload files inspected. Downloaded installer hash independently matches CI. |
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

### Fourth native CI attempt

Run https://github.com/stxtrata/xtrata/actions/runs/35735967417 used
`797fea32a90987252424adac74c07c2e1c8eed57`. All 87 shared tests passed on the
Windows runner, along with contract/deployment checks and source-package
closure. Native DPAPI testing stopped before launching because Electron's
runtime executable was absent. The locked Electron 44.4.1 package has an
explicit install.js entrypoint and no postinstall script. The workflow and
manual recipe now invoke that installer after npm ci, before native tests.
The command succeeds locally with the existing pinned runtime. No runtime
version changed. DPAPI, Electron smokes, NSIS and physical checks remain NOT
RUN until the corrected workflow is pushed and rerun.

### Fifth native CI attempt

Run https://github.com/stxtrata/xtrata/actions/runs/35736782257 used
`18b73b95f906d2881437491b7ed1ab033544c32a`. Runtime installation succeeded,
but the native storage harness timed out. Its main module awaited app.ready
at top level, blocking completion of Electron module startup. It now schedules
the asynchronous test without top-level await, matching the real application's
startup structure. Bounded stage diagnostics contain no keys or wallet data.
Local Electron execution reached readiness and rejected macOS before wallet
creation, confirming the corrected startup path. Syntax checks passed. Native
DPAPI remains unverified and must pass after the corrected harness is pushed.
No installer has been produced; the test gate has not been bypassed.

## Bounded automated build attempts (maximum five)

Attempt 1: https://github.com/stxtrata/xtrata/actions/runs/35737371806
Source `6aad58a29`. Native DPAPI, shared/contract tests, both Electron smokes,
NSIS packaging and payload inspection passed. The final evidence gate refused
a dirty checkout; upload was therefore not reached. No installer is delivered.
Attempt 2 adds pathname-only diagnostics to that refusal to identify what the
runner changed; the clean-source requirement remains unchanged. Four attempts
remain after attempt 1. Physical/live checks remain NOT RUN.

Attempt 2: https://github.com/stxtrata/xtrata/actions/runs/35737749316
Source `56bee3218`. All native tests and packaging/inspection passed again.
Diagnostics identified only `contracts/clarinet/deployments/default.simnet-plan.yaml`
as modified by Clarinet's platform-specific generated plan. Attempt 3 runs
the exact same contract tests in a disposable copy of clarinet/live sources,
using the same locked installed dependencies. No source file is restored or
ignored by the evidence gate, which still requires a clean checkout.

Attempt 3: https://github.com/stxtrata/xtrata/actions/runs/35738413241
Source `7f28a6ffc347fe42110ee44e2eb5fe8ce9ed584f`. SUCCESS. 87 shared tests,
9 contract tests, 20 deployment-console tests, source closure, actual DPAPI,
both Electron smokes, NSIS packaging, payload inspection, clean-source report,
checksum and artifact upload passed. Three of five authorised attempts used;
stop on success. No live transaction or wallet funding was performed.

### Current handoff checkpoint (supersedes earlier attempt notes)

Installer and JSON/checksum reports were downloaded to ignored local folder
`.artifacts/windows-preview-35738413241/`. Hash matches the published CI
artifact. No public release/download manifest was changed. The documentation
commit recording results is later than the installer source; the installer
remains tied to the exact 7f28a6ffc revision above.

On the tester's Windows 11 PC: download the artifact ZIP from the successful
run, extract it, compare SHA-256 with the companion file, and launch the EXE.
Use normal Windows security handling; do not disable protections. Start with
free listening and confirm support starts OFF after a restart. Record the
physical hardware, OS version and the manual checks in the gate table. Wallet
funding and live return/payment tests need separate explicit authorisation.

## Lounge download publication

At the user's request, the verified installer and evidence were published as
https://github.com/stxtrata/xtrata/releases/tag/music-v1.0.1-windows-preview.1
The release targets the original 7f28a6ffc build revision. The manifest utility
streamed the public EXE and verified its SHA-256 before adding win-x64.
The lounge has a matching static fallback card and Windows installation steps,
with unsigned/physical-testing-pending labels. A DOM check verified all three
platform cards, correct Windows URL/checksum and warning. No app rebuild or
version change was necessary; this publishes the existing 1.0.1 PC preview.

## Windows 1.0.2 release — 2026-09-22

Installer: `Xtrata-Music-1.0.2-windows11-preview-x64.exe` (121,152,217 bytes).
SHA-256: `1c3feb155a656478f9bdae52106ae842aa4cee2c7c2961123edd90af560c325a`.
The downloaded installer matches the CI checksum and source report.
Run 35749671121 passed automated Windows wallet/storage, playback, contract,
Electron, NSIS and package-inspection checks. Unsigned testing preview;
physical-PC, four-hour soak and live payment/return checks are NOT RUN.

Release: https://github.com/stxtrata/xtrata/releases/tag/music-v1.0.2-windows-preview.1

Lounge labels now use each platform download version independently, retaining
Mac 1.0.1 while Windows advances to 1.0.2. Release-policy unit tests (4), source
package closure and desktop/mobile lounge browser smoke passed locally.

### Song-picker report after 1.0.2 publication

User reports the Windows native dropdown does not open on mouse click. Added
an isolated Electron regression check that selects both songs, verifies track
and artist/album changes, starts free audio and checks zero support charges.
This check and the existing playback/payment smoke passed on macOS. It verifies
the change handler, not Windows native popup rendering; the reported Windows
mouse-opening issue remains unverified/unresolved. No runtime workaround has
been shipped. Try keyboard navigation (Alt+Down, arrows, Enter) on the affected
PC; a website-only change cannot replace the installed app.asar UI.

### Song-picker patch 1

The lounge now displays a native eight-row list instead of a popup select.
Actual mouse option selection, free playback and the existing payment smoke
passed in isolated Electron on macOS. Physical Windows popup/list verification
remains for the reporter. No wallet/payment code changed.

A 524 KiB ZIP contains a replacement app.asar, checksum, payload-diff report
and manual installation/rollback instructions. It is derived from the released
Windows 1.0.2 installer, not a newly assembled runtime. Every archive file was
compared; only app/scripts/wizard/music-lounge.html differs. The builder rejects
any input except the exact verified Windows 1.0.2 archive hash.

Reproduce after extracting resources/app.asar from the release installer:
`node scripts/music-support/build-song-picker-patch.mjs <original-app.asar> <output-directory>`
Copy `docs/radio/WINDOWS-102-SONG-PICKER-PATCH.txt` as README.txt into that directory,
then ZIP the four files. The app remains version 1.0.2 with patch identifier
song-picker-1. Existing installers are unchanged; future builds include the fix.

The public lounge now includes the 524 KB patch link and ZIP checksum below
its platform downloads. This section survives dynamic release-card rendering.
It explicitly states that the current 1.0.2 installer is unchanged and does
not include the patch. Future builds from the patched source include it.
