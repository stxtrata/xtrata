# Capped congestion fees — Phase 4

New desktop/local approvals explicitly select a maximum network fee per listen
(default 1,000 microSTX). The usual floor is 257 microSTX, plus exactly 50 to the
holder. A higher low estimate is used only within the cap; an estimate above it
leaves the listen free. All pending balance reservations and bounded budgets
include the full cap. This can stop support before the balance reaches zero if
there is not enough balance for the approved maximum; free audio continues.

Estimates are coalesced, checked at most once per minute and share the existing
read queue/cooldown. When unavailable, an estimate younger than ten minutes is
used, otherwise the floor. A 429 cooldown still prevents signing/submission.

After three minutes, the oldest visibly pending payment can be replaced at the
same nonce/receipt, at most twice, within its original cap and only while its
original approval remains active. Missing payments use saved-byte recovery.
Prepared/uncertain payments never trigger an automatic fee increase. Stopping,
closing or restarting does not grant further fee increases. Older fixed-fee
approvals, legacy bridge clients and operator tests do not gain bump permission.

Queued payments remain default OFF pending the Phase 5 release decision. These
changes are not yet published and no mainnet canary has been run.

# Threshold listens — Mac 1.0.4 / Windows 1.0.7

These versions request support after `min(30, max(1, floor(duration)-1))`
audible seconds; unknown duration uses 30 seconds. The timer counts real elapsed
time, excludes pause/mute/zero volume/seeking/buffering, and does not accelerate
with playback speed. Skipping before the threshold remains free. Enabling support
mid-song applies to the next song. The server registers the first audible moment
without charging, checks its own elapsed time, and admits each playback once.

On-chain totals now mix threshold listens with starts from older versions and
legacy bridge clients. Structured receipts distinguish them; reported seconds
are not on-chain proof. See `docs/radio/RECEIPT-FORMAT.md`.

The desktop smoke test uses local 3/4-second tracks (real thresholds 2/3 seconds),
an isolated profile and a simulated wallet. There is no production threshold
override. Minimized looping, consent, mute and duplicate prevention remain tested.

The queued-payment flag remains OFF pending the Phase 5 decision. New release
versions are staged locally; installers and public download metadata are unchanged.

## Previous-release behaviour and investigation

### Continuous support playback

Music support stays enabled for the session until the listener stops it or
closes the player. Each eligible new song start costs the selected network fee
plus 50 microSTX. Continuous mode has no test count/time limit or reserved
balance: it can spend down to less than the cost of the next start.

Muted or zero-volume starts remain free. The player now explains this explicitly;
unmuting can request the current song's payment if it has not already been
observed. Pause/resume, seeking and repeated playback events never charge the
same start twice. Payments already requested are not reversed by muting.

Desktop background throttling is disabled so a minimized window can continue
processing song transitions. The computer must remain awake. Closing the app
ends approval. Pending or uncertain transactions still block new payments until
reconciled; skipped starts are not charged later.

## Regression check

Run `npm --prefix desktop/music run prepare:app`, then
`npm run music:desktop:test` from the project directory.

The Electron test uses a disposable profile, local audio and a simulated wallet:
muted playback sends nothing, unmuting pays once, pause/resume does not duplicate,
automatic loops continue while minimized, three payments exhaust 1,050 microSTX,
and the next start stays free with an insufficient-balance explanation. No real
wallet is loaded or real transaction signed.

The September 18 investigation confirmed two successful transactions from the
reported desktop address. Muting explains the supplied local-player screenshot;
the original unmuted desktop stall has not been reproduced. These changes improve
status clarity and background resilience rather than claiming an unproven cause.

Source changes require a rebuilt desktop app; already installed preview binaries
do not update automatically.

## Playlist updates and song length

The local and desktop player refresh the catalogue every three minutes without
restarting the current audio or its support approval. Discovery follows the public
catalogue, so a newly inscribed song must first appear there. A failed refresh
retains the existing playlist and retries on the next interval.

The visible Refresh songs button bypasses the local catalogue cache. Use it when a
new inscription has just appeared in the public catalogue; it should not require
waiting for the next automatic interval or restarting the app.

The temporary 60-second minimum is disabled. Any track that the player can load
can request a supported start, even when its duration is short or cannot be
read. Audio still has to be available from the verified catalogue; unavailable
media remains free and does not create a payment.

## Versions and updates

The lounge shows the running version and a Check for updates button. This checks
only the public release manifest; it does not access the wallet or approve funds.
Download the newer app, quit the existing app, replace it in Applications, and
reopen. The wallet lives separately in application data and is preserved. Enable
support again when ready. The app does not install updates automatically.

Version 1.0.0 starts the new numbering (the build remains an unsigned preview).
Before each subsequent release, run `npm --prefix desktop/music run release:patch`
from the project root, then build and test. This increments 1.0.0 to 1.0.1, etc.,
and keeps package metadata and the displayed version aligned. Do not bump for
every individual file save. Update the public release manifest only after the
corresponding download exists and its checksum has been verified.

For the repository-based local wizard, pull the code, restart the wizard after
backend changes, and reload the lounge. Keep the existing wallet directory.
