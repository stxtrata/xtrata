# Your Xtrata Music listening room

The listening room is a simple home for your local music support wallet:
full artwork, song/artist/album details, playback controls, a playlist, balance,
funding address, payment history and a way to return your funds.

## Open it

With the repository installed, run `npm run music:lounge` from `xtrata-2.0`,
then open <http://127.0.0.1:8798/lounge>. Keep that process running.
The existing operator panel remains at <http://127.0.0.1:8798/>.

This is a listener-facing local app, not yet a hosted wallet service. Every person
runs their own copy locally. A public xtrata.xyz page cannot yet securely drive
this local signer: the current extension/native-host integration is a prototype.
Do not expose the local server publicly or point multiple users at one wallet.
A packaged installer and authenticated browser-to-companion integration remain
separate distribution work before a website-only onboarding experience.

## Settle in

1. Choose **Create my support wallet**. An existing wallet is reused.
2. Copy the address and send STX on **Stacks mainnet**, keeping the balance at
   or below 1 STX. Refresh the balance to check your deposit.
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
can lose the balance; software with access can spend it. Keep at most 1 STX here.
Under **Manage or return your balance**, enter your own destination address,
review the return, then confirm it. This stops new support payments.

Artwork and catalogue metadata are optional. Missing images use the Xtrata
record sleeve; missing names use inscription IDs. Your payment activity shows
recipients from the transaction journal and confirmed receipts, not artwork or
artist metadata.
