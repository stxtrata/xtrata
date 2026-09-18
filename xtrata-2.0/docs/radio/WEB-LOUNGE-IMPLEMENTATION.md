> Superseded customer flow: `/radio/lounge` is now the download hub. The browser player moved to `/radio/browser-lounge`. See [Desktop Music](DESKTOP-MUSIC.md).

# Website lounge implementation notes — 18 September 2026

Implemented a public listening room at `/radio/lounge`, linked from `/radio` and
the desktop setup page. It offers artwork/metadata, radio controls and a guided
companion install → extension → local pairing → create → fund → local spending
approval journey. Balance and recent payment recipients/transaction links are
shown in the lounge. Free listeners need none of the wallet setup.

The source download includes the new unpacked Chrome extension and local consent
page. It is an early-access developer installation, not a signed desktop app or
Chrome Store distribution. The extension supports production xtrata.xyz only.
Existing installed companions must update their code and restart, preserving
wallet files. This change does not restart the user's running companion, deploy
the website, or enable any existing wallet to spend.

Connection tokens remain extension-side; signing keys remain companion-side.
Only the local page can grant spending permission. No browser withdrawal API.
An explicit stop revokes support; expiry and heartbeat loss do the same. Starts
are deduplicated, including busy starts, with no later catch-up. The existing
payment runner remains responsible for receipt verification and kill switches.
Defaults remain 300 microSTX network fee plus 50 microSTX to the current holder;
fees never rise automatically. Funding does not enable support.

Validation: 651 wizard tests passed in the full suite (one browser test skipped);
an additional stop-during-approval regression also passed;
two additional audible-start identity/muting tests passed. Real Chromium with
the unpacked extension completed the actual lounge pairing/create/balance/
approval/start/stop flow against an isolated simulated wallet. Desktop and
mobile-width layout checks passed. Radio bundle and downloadable package builds
passed; archive inspection confirmed bridge/extension inclusion. Existing
`/radio-face.jpg` build warning remains. No real wallet payments were made.

Remaining release work: user push/deployment, companion update/restart and
loading the extension. Actual Windows/Linux installation and signed/store
packaging remain unverified. A live mainnet rollout is not claimed by these
simulated tests.
