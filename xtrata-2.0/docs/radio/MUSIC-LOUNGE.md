# Current customer setup

The normal setup is now the desktop app. The public `/radio/lounge` URL is the
download/news/help hub. See [Desktop Music](DESKTOP-MUSIC.md) for installation,
wallet storage, build tests and release gates. No extension is needed for the app.

The notes below describe the developer/local companion and optional experimental
browser integration. The latter has moved to `/radio/browser-lounge`.

# Your Xtrata Music listening room

The listening room is a simple home for your local music support wallet:
full artwork, song/artist/album details, playback controls, a playlist, balance,
funding address, payment history and a way to return your funds.

## Open it

With the repository installed, run `npm run music:lounge` from `xtrata-2.0`,
then open <http://127.0.0.1:8798/lounge>. Keep that process running.
The existing operator panel remains at <http://127.0.0.1:8798/>.

The public listening room is **https://xtrata.xyz/radio/browser-lounge** after deployment.
It uses the same radio engine as the free radio. To connect your desktop wallet,
install the companion and load the included `extensions/music-support` folder
as an unpacked Chrome extension (Developer mode → Load unpacked). Reload the
public lounge. Select Connect, open the local review link and approve pairing.
The website then offers wallet creation, your funding address, balance checking,
and a separate local review to enable automatic support. Approximately 1 STX is
recommended, not required. Creation, pairing and funding never enable spending.

This is early access, not a signed installer or Chrome Store release. The new
extension supports only `https://xtrata.xyz/radio/browser-lounge` (and `.html`), not preview
domains, arbitrary embeds or other radio pages. It requires the local companion
running on port 8798. The older `extensions/music-wallet` native-host prototype
is separate and is not used. Never expose the companion on the public network.

## Settle in

1. Choose **Create my support wallet**. An existing wallet is reused.
2. Copy the address and send STX on **Stacks mainnet**, with a recommended balance of 1 STX (higher balances are allowed). Refresh the balance to check your deposit.
3. Play a song. This is free until you explicitly turn on support.
4. Review the fee under **Payment details**, approve automatic payments, then
   choose **Turn on music support**. Confirm the amount shown.

Each eligible new song start pays 0.00005 STX to the current master holder, plus
one fixed network fee. The default remains 300 microSTX, making 0.000350 STX per
start; fees never increase automatically. No platform fee is added. The current
song is not charged retrospectively. Continuous support uses the available
balance until it cannot afford another start. Temporary payment trouble leaves
music free and retries checks at subsequent starts, with no catch-up charges.

**Listen free / pause support** stops new payments. Closing/reloading the page
also requires you to enable support again. Keep your computer awake. Pause/resume
and seeking do not charge again. Unknown transactions must resolve before another
payment. A start is not proof of a completed listen.

Your local app stores the signing key outside browser storage. Losing its files
can lose the balance; software with access can spend it. We recommend keeping at most 1 STX here.
Under **Manage or return your balance**, enter your own destination address,
review the return, then confirm it. This stops new support payments.

Artwork and catalogue metadata are optional. Missing images use the Xtrata
record sleeve; missing names use inscription IDs. Your payment activity shows
recipients from the transaction journal and confirmed receipts, not artwork or
artist metadata.

## Website setup and downloadable package

The customer page is `/radio/support` (`public/radio/support.html`). The public
radio and embed guide link to it. `npm run build:music-support` produces a
source-based `.tar.gz` and SHA-256 file under `public/downloads`; prebuild runs
this automatically so Vite includes them in the deployed site. Outputs are
ignored, regenerated from an explicit source allowlist, and contain no wallet
files, history, secrets, node_modules or user media.

Extract into a permanent folder, install Node.js 24, and run `node setup.mjs`.
Setup uses the committed lockfile with `npm ci --omit=dev --ignore-scripts`.
It installs dependencies only; wallet creation and spending remain explicit.
Mac/Windows install and start launchers are included. This is not a signed native
installer. Windows/Linux remain experimental pending actual platform validation.
Never overwrite/delete a funded installation; return funds before replacing it.

## Session mode indicator

**SUPPORT ON** means the session remains authorised for new song starts.
**SUPPORT WAITING** means approval is retained while the connection recovers.
**FREE PLAY** means this tab is not paying. Individual starts can remain free
while another transaction is unresolved; their outcome is shown separately.
The approval stays checked and the enable button confirms support is on.
Select Free play before changing the fixed fee or other payment settings.

## Public lounge connection and tests

The extension holds ephemeral connection tokens in its own session storage,
scoped to the browser document. Tokens and signing keys are never returned to
page JavaScript. The companion accepts only extension-origin bridge requests;
new connections and spending need separate, explicit local approval. Remote
commands allow status, creation, support starts and stop/disconnect only. Returns
remain in the local app. Stopping cancels outstanding approval requests.

The companion owns one paying session. Every audible source start has a unique
ID; duplicates and starts that occur while busy stay free. It independently
checks the song through its media loader before using the existing payment
runner. It does not claim proof of listening. Expiry (12 hours), restart,
disconnection or two minutes without check-ins revokes the connection. Browser
sleep or throttling may therefore require reconnection. Approved pending
transactions may still confirm after Stop. No missed-start payment backlog.

Run `npx vitest run scripts/wizard/__tests__/music-web-bridge.test.ts` and
`node scripts/radio-support/web-lounge-smoke.mjs` (Playwright Chromium required;
`PLAYWRIGHT_CHROMIUM_EXECUTABLE` optionally selects an installed test browser).
The latter uses a temporary profile, unpacked extension, isolated local server,
and simulated wallet. It tests pairing, approval, deduplication and stop without
keys or real chain transactions. Screenshots go to ignored `.artifacts/web-lounge`.

Build with `npm run build:radio` and `npm run build:music-support`; the full
application prebuild already runs both. Deploy the website and restart/update
the local companion code before testing this new connection. Preserve existing
`.artifacts/radio-wizard` when updating; never replace a funded wallet folder.
