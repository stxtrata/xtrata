# Continuous support playback

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

Audio metadata is checked before playback: tracks shorter than 60 seconds are
skipped without requesting payment and excluded for the rest of the page session.
Exactly 60 seconds is eligible. Unknown/unreadable duration does not initiate a
payment. If every candidate is too short, playback stops rather than looping
through rejected tracks indefinitely.
