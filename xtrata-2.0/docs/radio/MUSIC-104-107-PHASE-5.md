# Phase 5 — build checkpoint and release-default gate

Source revision: `d8f77414e0bfcc0e259f3b5207399e09a771e192` on
`codex/music-104-107`. Report changes do not alter the packaged runtime.

Targets: standard/legacy universal Mac 1.0.4 and native Windows 11 x64 1.0.7.
Public manifests, download links and releases remain unchanged. No live payment
or return test has been authorised or run in this phase.

## Build checkpoint

- Standard Mac: PASS — universal 1.0.4 DMG and ZIP built and inspected.
- Legacy Mac: PASS — universal 1.0.4 DMG and ZIP built and inspected with pinned Electron 43.7.3.
- Windows: BLOCKED pending branch push. GitHub authentication is available, but
  `git ls-remote --heads origin codex/music-104-107` returned no branch. Repository
  rules leave pushing to the user; push or explicit branch-only permission was
  requested. No inaccessible Windows step has been represented as passing.

Initial standard build failed with ENOSPC (118 MiB free). Removed only generated
unpacked inspection apps from Phases 2–4, superseded unpacked Mac app output and
failed build temporary output. Reports/checksums, published archives and all
wallet data were retained. Free space rose to 2.6 GiB before retry.

## Recommended release defaults — awaiting decision

| Setting | Candidate build | Recommendation |
|---|---|---|
| Support on launch | OFF | Keep OFF; fresh session approval required |
| Audible threshold | ON | Keep ON; short/unknown policy documented in Phase 3 |
| Congestion estimate | ON for cap approvals | Keep ON; cached reads and 429 cooldown |
| Automatic fee increase | ON for original cap approval | Keep ON within cap, at most two, head only; canary still pending |
| Default network cap | 1,000 microSTX | Keep 1,000, with usual 257 floor clearly shown |
| Queued paid listens | OFF | Keep OFF for first validation; enable only after native build checks and explicit decision |

Changing a compiled default requires a new build and new checksums. No setting
has been enabled just to pass packaging. Mac hardware support follows the pinned
runtimes: standard macOS 13+, legacy macOS 12+; these are not Mojave builds.

## Verification boundaries

Phase 4 evidence remains applicable to the same runtime revision: 196 tests,
isolated Electron playback smoke, 276 pre-existing repository lint errors.
Package inspection is not an installed-app or physical-machine test. No Windows
PC, Monterey physical machine, four-hour soak or supervised live canary result is
claimed here. Existing desktop wallets were not opened during this build.

## Reproduce

From `xtrata-2.0/desktop/music`:

```sh
npm run dist:mac
npm run dist:mac:legacy
```

After the source branch is on GitHub, dispatch the existing Windows-only workflow:

```sh
gh workflow run music-desktop.yml --ref codex/music-104-107 -f target=windows
```

Verify its reported head SHA before accepting the artifact. That workflow runs
native Windows offline tests, real DPAPI smoke, Electron startup/playback,
NSIS packaging and package inspection. It does not publish a release.

Build logs are local `/tmp/music-phase5-mac.log` and
`/tmp/music-phase5-legacy.log`. Final artifacts and checksums are recorded below
when complete.

## Completed Mac artifacts

Both DMGs pass `hdiutil verify`; both ZIPs pass full CRC integrity and version checks. Both executables contain x86_64 and arm64. Both ASARs (353 entries each) match the runtime source and Mac 1.0.4 metadata; no wallet, test or development files were found. No code signing identity was available; neither build is signed or notarized.

| Artifact (under `.artifacts`) | Bytes | SHA-256 |
|---|---:|---|
| `music-desktop/Xtrata-Music-1.0.4-mac-universal.dmg` | 232631220 | `f29e46eace592ae9669260dba53c9e7fda7eef7992217e9d383d83948038b3e2` |
| `music-desktop/Xtrata-Music-1.0.4-mac-universal.zip` | 224419132 | `ff3b477899899c285afc8e64ab86e77ec87294375fa3bbf52d7bdec565bde709` |
| `music-desktop-legacy/Xtrata-Music-Legacy-1.0.4-mac-universal.dmg` | 226587893 | `b23b64d036af2c13e594326ef808f7cd97058f90ab9736deff9588ccb4560b3a` |
| `music-desktop-legacy/Xtrata-Music-Legacy-1.0.4-mac-universal.zip` | 218386053 | `14b4041297543f23fddf759d45a343b613b7251e70d7cb6cb3adc12189f6eed7` |

Checksums are also beside each artifact as `.sha256`. Structured inventory: `.artifacts/music-phase5/mac-artifacts.json`. Inspection reports: `.artifacts/music-desktop/mac-104-inspection.json` and `.artifacts/music-desktop-legacy/mac-104-legacy-inspection.json`.

The build host runs macOS 26.5.2. Minimum supported-OS installation/hardware checks were not performed. Phase 5 remains **partial**, because Windows 1.0.7 requires the source branch to be pushed before the native workflow can run.
