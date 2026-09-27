# Xtrata Music — beta tester installation guide

For all Xtrata Music Beta Testers. This guide takes you from downloading the app to playing music, including the extra clicks needed for these unsigned beta builds.

**Downloads:** https://xtrata.xyz/music/lounge#downloads

Use the latest expanded beta for your operating system. Version numbers in older screenshots may differ from the download. You do not need Node.js, developer tools or a browser wallet extension to run the desktop app.

These steps approve this particular Xtrata Music download. They do not require turning off Windows Defender, SmartScreen or Mac Gatekeeper for your whole computer. Use the download supplied by James or linked from the Lounge. If a warning names a detected threat, rather than an unknown developer or uncommon download, send James the exact warning before continuing.

## 1. Choose your download

| Your computer | Choose |
| --- | --- |
| Windows 11, Intel or AMD processor | Windows · Intel/AMD (`.exe`) |
| Mac with macOS 13 Ventura or newer | Mac · Intel & Apple silicon (`.dmg`) |
| Mac with macOS 12 Monterey | Mac · Monterey preview (`.dmg`) |

Both Mac packages include Intel and Apple silicon. These downloads do not cover Windows ARM or macOS 10 Mojave. Check **Settings → System → About** on Windows or **Apple menu → About This Mac** if unsure.

## 2. Windows: finish the download

### Edge says “isn't commonly downloaded”

This can happen again with each new beta, even if you installed an earlier version successfully.

1. In Edge, press **Ctrl+J** to open Downloads.
2. Find the Xtrata Music download you just started.
3. Click the **three dots (…) beside that download**.
4. Select **Keep**.
5. If another warning appears, select **Show more**, then **Keep anyway**.
6. Wait until the download finishes and its name ends in **.exe**.

An **Unconfirmed…crdownload** file is a temporary download, not an installer. Do not open it or rename it to `.exe`. Complete the Keep steps in the browser. If you started multiple copies, you only need to keep one completed installer.

If the browser says the transfer was interrupted, use **Resume/Retry**. If it has no such option, download a fresh copy from the Lounge. A workplace-managed PC may not offer Keep; ask its administrator or use your personal PC rather than changing organisation policies.

### Optional: check that your download is complete and unchanged

Expand **Verify download (SHA-256)** on the Lounge and compare its value with your downloaded file:

1. Open **PowerShell** from the Start menu.
2. Type `Get-FileHash `, including the space.
3. Drag the completed installer from Downloads into PowerShell to insert its path. If needed, put double quotes around the entire path.
4. Add ` -Algorithm SHA256` and press Enter.

Example — replace the filename if your version differs:

```powershell
Get-FileHash "$env:USERPROFILE\Downloads\Xtrata-Music-1.0.9-windows11-preview-x64.exe" -Algorithm SHA256
```

Compare all characters in the Hash value; uppercase/lowercase does not matter. A mismatch means you should download again and tell James if it repeats.

## 3. Windows: open and install

1. Double-click the completed **Xtrata Music .exe** in Downloads.
2. If **“Windows protected your PC”** appears, click **More info**.
3. Check that the application is the Xtrata Music installer you downloaded. An unknown publisher is expected for this unsigned beta.
4. Click **Run anyway**.
5. In the installer, choose **Only for me** if offered. Keep the suggested installation folder.
6. Click **Next**, then **Install** as prompted.
7. Leave **Run Xtrata Music** ticked and click **Finish**.

If there is no Run anyway button, or a different block such as Smart App Control or an administrator restriction, send James a screenshot. There is no single per-app override for every Windows policy; do not turn off system-wide protection to make this guide work.

If the completed file has an **Unblock** checkbox under **right-click → Properties → General**, you can select it and click **Apply → OK**, then try opening it again. This only removes that file's downloaded-file block; it does not override all Windows controls.

## 4. Mac: copy the app into Applications

1. Open the downloaded **.dmg** file.
2. Drag **Xtrata Music.app** into **Applications**.
3. Wait for copying to finish. If updating, quit the old app first and choose **Replace** when asked.
4. Eject the installer disk image from Finder.
5. Open **Finder → Applications → Xtrata Music**. Run this installed copy, not a copy inside the disk image.

### If macOS says the developer cannot be verified

1. Try opening the app once, then dismiss the warning without moving the app to the Bin.
2. Open **Apple menu → System Settings → Privacy & Security**.
3. Scroll to the security message about Xtrata Music and choose **Open Anyway**.
4. Confirm **Open**, using your Mac login password or Touch ID if asked.

On Monterey, the equivalent is **System Preferences → Security & Privacy → General → Open Anyway**; unlock the padlock if requested. The option normally appears after a blocked launch attempt. On versions that offer it, **Control-click the app → Open → Open** is another way to approve the app.

### Mac fallback: the Terminal command

If the installed beta is still blocked, use this command on the copy in Applications. It removes the quarantine attribute from **Xtrata Music.app and its contents only**. It does not sign the app or disable Gatekeeper globally.

1. Make sure you have already copied **Xtrata Music.app** into **Applications**.
2. Press **Command+Space**, type **Terminal**, and press Return.
3. Copy this entire line, paste it into Terminal, and press Return:

```sh
xattr -dr com.apple.quarantine /Applications/Xtrata\ Music.app
```

4. No output usually means it completed. Open **Applications → Xtrata Music** again.
5. If an Open confirmation appears, approve it.

The equivalent quoted-path command is:

```sh
xattr -dr com.apple.quarantine "/Applications/Xtrata Music.app"
```

Use one command, not both. Do not substitute the whole Applications folder or your home folder.

**If Terminal reports an error:**

- **No such file:** check that the app is really in Applications and is named `Xtrata Music.app`. Do not run the command against the `.dmg`.
- **Permission denied / Operation not permitted:** quit the app and send James the exact Terminal message. Do not add broad permission changes or run a command against the wallet folder.
- **App is damaged:** this message can have different causes. Redownload and compare the SHA-256 first; the quarantine command cannot repair a genuinely damaged download.
- **Unsupported macOS:** choose the Monterey build if you run macOS 12. Removing quarantine cannot make an incompatible build work.

For a Mac checksum, type `shasum -a 256 ` in Terminal, drag the downloaded `.dmg` into the window, then press Return. Compare the result with the Lounge's SHA-256.

## 5. First launch: listen free, or enable Music Support

### Listen free

1. Open Xtrata Music and allow the catalogue to load.
2. Choose a song and press **Play / pause**.
3. Leave Music Support off if you only want to listen.

Free listening requires no funding or payment approval. Your computer needs an internet connection and must remain awake for continuous playback.

### Optional: fund your local support wallet

1. Find **Your music support wallet**. The app creates this local spending wallet automatically on first launch.
2. Click **Copy funding address**.
3. From your normal wallet, send a small amount of **STX on Stacks mainnet** to that address. Around **1 STX** is the recommended maximum balance to keep here while testing; less is fine.
4. Use the address in your own app, never one shown in a screenshot. You may send from another device.
5. Wait for confirmation, then click **Refresh balance**. Do not send twice just because the balance is slow to update.
6. Tick the checkbox agreeing to automatic payments.
7. Click **Turn on music support**, review the displayed fee/payment terms and confirm. The latest app uses an in-page confirmation; older screenshots may show a popup.
8. Play music. Check the support label and **Recent plays & payments** for the result.

A supported start pays **50 microSTX (0.000050 STX)** to the current master holder, plus the separate network fee shown by the app. Xtrata takes no platform fee. Follow the current fee/cap displayed by your installed version rather than an old screenshot.

Muted playback does not make support payments. Pause/resume does not create another payment for the same start. A pending payment may confirm after you switch support off. Restarting the app requires fresh support approval. You can stop new support payments with **Listen free / pause support**.

Funding and BNS profile linking are separate operations. You can listen and support without linking a BNS name. If linking from a second device, use **Copy verification link**, open it there, copy the exact transfer details and keep the verification page open for automatic checking.

## 6. Updating without losing your wallet

1. Quit Xtrata Music completely.
2. Download the latest build for your platform from the Lounge.
3. Windows: run the new installer for the same Windows user. Mac: replace the app in Applications.
4. Repeat the app-specific approval steps above if the new download triggers a warning.
5. Open the app and check that the funding address is unchanged before adding money.

Your wallet is stored separately from the installed app. Do not delete its data folder or use a cleanup utility that removes app data. The app's **Help → Show wallet folder** locates it. A Windows protected wallet is tied to its Windows user environment; copying its folder to a different machine is not a supported wallet migration.

## 7. Quick troubleshooting and feedback to James

| What you see | What to do |
| --- | --- |
| Unconfirmed `.crdownload` | Complete Edge's Keep steps; do not rename the temporary file. |
| No cursor / dropdown ignores clicks | Try Alt+Tab away and back; install the latest Windows beta, which includes the confirmation-focus fix. |
| 429 / 503 / balance temporarily unavailable | Leave the app time to retry. Avoid repeatedly clicking Refresh. Do not resend funding just because the display is delayed. |
| Wallet storage needs attention / EPERM / journal rename | Quit fully, check Task Manager for remaining Xtrata Music processes, then reopen. If it persists, restart the PC and report it. Do not delete the wallet, journal or temporary files. |
| Music plays but no payment | Check support is on, sound is not muted, funds are available and the latest payment status. Some starts can remain free when payment cannot safely proceed. |
| Still cannot install | Send the exact warning and a screenshot; do not guess at additional commands. |

Send James your OS version, app version, the exact message, what you clicked, and whether restarting helped. Public transaction IDs and wallet addresses can help with payment diagnosis. Never send private keys, wallet vault files or your whole wallet folder.

## Reference

- Downloads and current compatibility: https://xtrata.xyz/music/lounge
- Microsoft download approval steps: https://learn.microsoft.com/en-us/troubleshoot/microsoft-edge/development/download-failures
- Apple app-specific opening instructions: https://support.apple.com/en-gb/102445

Guide updated 27 September 2026. Button wording can vary with OS and browser version. These instructions cover common unsigned-beta installation gates; they cannot guarantee an override of managed-device restrictions or every security block.
