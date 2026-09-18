# Xtrata Music desktop app and public hub

The public home is **https://xtrata.xyz/radio/lounge**. It is now the download,
setup, compatibility and news hub. Ordinary users do not install an extension.
`/radio/support` leads to this hub. The free web radio remains `/radio`.

## Listener journey

Download a published installer → open Xtrata Music → copy the automatically
created local wallet address → send STX on Stacks mainnet → refresh the balance →
review and enable support. About 1 STX is recommended, not mandatory. Opening,
creating or funding never enables payments. Returning users open the app and
approve support for the new session. They need no Node installation or terminal.

The app contains the existing local lounge, with artwork, title/artist/album,
playlist, payment history, fixed-fee controls, stop and reviewed returns. Closing
it stops new payments. Existing submitted transactions can still confirm. The
playback/payment rules and default fees have not changed.

Both the public hub and local lounge include a read-only recent-activity reader
for confirmed `xtrata-radio-plays-v1-0` contract logs. It displays the song,
payer, holder recipient and 0.000050 STX holder payment without connecting to or
using the listener's wallet. The network fee remains visible on the linked Hiro
transaction. The public reader refreshes while visible and fails closed to its
last confirmed display.

AI assistants can follow `docs/radio/AI-MUSIC-SUPPORT-INSTALL.md`; the fallback
source package includes the same content as `AI AGENT - INSTALL.md` plus the
reusable `xtrata-music-support-installer` skill. These instructions authorise
installation and free-mode validation only. Funding and Music Support require
separate explicit user choices.

## Wallet storage and existing wizard users

The wallet is under Electron's OS `userData` directory in `support-wallet`.
Use Help → Show wallet folder to locate it. This is outside the installation,
so replacing the app does not replace the wallet. Windows uninstall is configured
to preserve app data. Deleting wallet data can lose funds. The encrypted key and
unlocking material remain on the same computer: this is a small spending wallet,
not secure long-term custody. No cloud recovery or silent migration.

The desktop wallet is separate from the developer wizard at
`.artifacts/radio-wizard`. The app never reads or imports that funded wallet.
Existing users should retain the old installation and return its funds before
retiring it. No real funds are moved by builds or tests.

## Desktop implementation

- `desktop/music/main.mjs`: single instance, automatic local wallet creation,
  `xtrata-music://open` and Help menu. Deep links do not carry payment commands.
- `desktop/music/window.mjs`: sandboxed renderer without Node or preload APIs,
  isolated in-memory session and HTTP-only secret cookie, random loopback port.
- Desktop server mode allows only lounge/media/listening/return endpoints and
  requires the private cookie on every request. The website/extension cannot
  connect to this server. Existing developer server behavior is retained.
- Navigation stays in the local lounge. Only HTTPS links to xtrata.xyz or the
  Hiro explorer can open externally. Permissions are denied except writing to
  the clipboard from the local lounge. Remote inscription HTML is parsed by
  existing media code; it is not executed in the renderer.
- `prepare.mjs` copies an explicit source list into ignored `app/`. App/wallet
  state, `.env` files and journals cannot enter the archive via recursive copying.

## Build and test

From xtrata-2.0:

```sh
npm ci --prefix desktop/music
npm --prefix desktop/music run prepare:app
node scripts/music-support/desktop-smoke.mjs
npm run music:desktop:build
```

The test uses real Electron with local generated audio and a simulated wallet.
It checks renderer isolation, private cookie access, paid/free playback and
pause/resume idempotence. It never accesses the user's wizard or sends funds.
Current smoke runner uses the Mac Electron executable. Target-specific build
commands are `dist:mac`, `dist:win`, `dist:linux` in desktop/music. The manual
GitHub Actions workflow builds previews for Mac ARM/Intel, Windows x64 and Linux
x64. Windows/Linux output is not validated solely by compiling it.

## Release gate and hub downloads

Local build outputs are in ignored `.artifacts/music-desktop`. They are too large
for Cloudflare Pages assets. Publish reviewed installers as GitHub release assets
under stxtrata/xtrata; the hub reads `public/radio/music-releases.json`.

No Apple Developer ID signing identity was available during implementation.
The local Mac build is an unsigned preview, not a smooth public installation.
Before publishing: configure Developer ID signing and Apple notarization, test
install/open/play/stop/return on a clean Mac, then verify signature and Gatekeeper
acceptance. Windows also needs release signing and a clean-machine test. Do not
instruct normal users to disable OS protections. Store the signing credentials
in release secrets, never in Git or the wallet.

The manual workflow accepts MUSIC_CSC_LINK, MUSIC_CSC_KEY_PASSWORD and the Apple
MUSIC_APPLE_ID / MUSIC_APPLE_APP_SPECIFIC_PASSWORD / MUSIC_APPLE_TEAM_ID secrets.
Without them it produces preview artifacts only. No job publishes automatically.
Reference: [Electron security](https://www.electronjs.org/docs/latest/tutorial/security)
and [macOS signing/notarization](https://www.electron.build/v26/docs/notarization/).

After signed platform testing and publishing, run:

```sh
node scripts/music-support/release-manifest.mjs mac-arm64 /path/to/installer.dmg \
  https://github.com/stxtrata/xtrata/releases/download/TAG/installer.dmg \
  'Your tested macOS version and Apple silicon requirement' --signed-and-tested
```

This requires the operator's signing/testing assertion, downloads the published
bytes to verify SHA-256 against the local installer, then updates the manifest.
It does not cryptographically attest signing. Review and commit the manifest,
update dated news/compatibility copy, and deploy the website. Until then the hub
honestly says downloads are not published. Do not add speculative download URLs.

The previous extension route remains experimental at `/radio/browser-lounge`;
it is not part of the customer setup journey. The original extension/native-host
prototype is separate. The primary path is now the self-contained desktop app.

## Implementation verification

44 targeted policy/backend/recovery/return/bridge tests passed. Real Electron
with a simulated funded wallet passed isolation, private-cookie access,
paid-start, free-mode and pause/resume checks. A second test ran the actual app
entrypoint twice with a disposable empty wallet and stubbed networking: the
address persisted and support stayed off on both launches. Hub browser tests
passed at desktop and phone widths, including disabled unpublished downloads
and exclusion of untrusted release links. No user wallet was accessed or funded.

Mac ARM64 DMG and ZIP preview builds completed. They remain unsigned; signing,
notarization, clean-machine release validation and public asset publication are
still required. The current app uses the default Electron installation icon;
release branding can replace it before public distribution. Developer and
preview build artifacts remain local and ignored by Git.
