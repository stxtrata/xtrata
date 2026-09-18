# Xtrata Music 0.1.0 — first desktop preview

This release is for early testing on Apple-silicon Macs (M1 or later).
The runtime requires macOS 13 or later; automated testing was performed on
macOS 26.5.2. Intel Mac, Windows and Linux installers are not included.

## Install and listen

1. Download the `.dmg` from the Xtrata Music lounge or its linked GitHub preview
   release. No Node.js, terminal setup or wallet extension is required.
2. Open the disk image and drag **Xtrata Music** into **Applications**.
3. Open **Xtrata Music** from Applications. This preview is unsigned and has not
   been notarized by Apple. macOS may block it. If you choose to test this exact
   download, use System Settings → Privacy & Security → Open Anyway. Do not
   disable system protections. If your Mac still refuses, report the message.
4. Wait for the songs to load, choose one and press Play. Start with free
   listening. Check the artwork, title, artist, next/previous and volume.
5. Check that the public activity panel shows recent confirmed paid starts.

The ZIP is an alternative download of the same application. Extract it and move
the app to Applications. Use only one installed copy at a time.

## Optional support test

The app creates a separate local support wallet. It does not import your existing
wizard wallet. Installation, launching and funding do not switch support on.

Copy the address shown by this app. If you want to test support, send a small
amount of STX on Stacks mainnet and refresh the balance. Keeping around 1 STX or
less is recommended. Review Payment details, tick the acknowledgement and select
**Turn on music support**. The default eligible start costs 0.000300 STX network
fee plus 0.000050 STX to the current song holder. Xtrata charges no platform fee.

Check that a new audible start creates one payment, pausing/resuming does not
create another, and switching to free mode stops new payments. Pending payments
may still confirm. You can review a return in **Manage or return your balance**.

## Restart and report

Quit and reopen the app. Confirm the same public funding address is shown and
support is off until enabled again. Your wallet files live separately from the
app; do not delete or share them. There is no cloud recovery.

Report your Mac model, macOS version, app version, what you clicked, what you
expected, and what happened. Include the exact error and a screenshot if useful.
Never send private keys, wallet-data files or signed transaction files.

This is an unsigned preview, not a signed general release. Clean-machine install
testing, other operating systems, signing and notarization remain release gates.
