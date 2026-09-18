# Xtrata Music — easy installation guide

This folder contains the Xtrata Music listening room and its optional Music
Support wallet. You can listen for free. Support payments remain off until you
turn them on inside the listening room.

If the Xtrata Music hub offers a signed installer for your computer, use that:
it is the easiest route and does not require Node.js or a terminal. This source
package is the fallback until tested, signed desktop installers are published.

## The short version

1. Move the extracted **xtrata-music-support** folder somewhere permanent, such
   as Documents. Do not run it from inside the downloaded archive or Downloads.
2. Install **Node.js 24 LTS** from <https://nodejs.org/en/download> if it is not
   already installed. Choose the normal recommended installer for your computer.
3. Double-click the START HERE file for your computer:
   - Mac: **START HERE - Mac.command**
   - Windows: **START HERE - Windows.cmd**
   - Linux: **START HERE - Linux.sh**
4. The first launch installs the required program files and then opens the
   listening room automatically. Later launches skip installation and open it.

Keep the terminal window that appears open while listening. You may minimise it.
Closing it closes Xtrata Music and stops new support payments.

## Mac: step by step

1. Double-click the downloaded `.tar.gz` file to extract it.
2. Drag the resulting **xtrata-music-support** folder into Documents.
3. If Node.js is not installed, visit <https://nodejs.org/en/download>, download
   Node.js 24 LTS for macOS, open the downloaded installer and follow its steps.
4. Open the Xtrata folder and double-click **START HERE - Mac.command**.
5. If macOS says the file cannot be opened because it is from an unidentified
   developer, close that message. Control-click the START HERE file, choose
   **Open**, check that the filename is correct, then choose **Open**. You may
   instead use System Settings → Privacy & Security → Open Anyway for this exact
   file. Never disable Mac security globally.
6. Wait for “Starting Xtrata Music”. Your browser opens the listening room.

## Windows: step by step

1. Right-click the downloaded `.tar.gz` and extract all files. If Windows cannot
   extract it, use its built-in `tar` support or a reputable archive application.
2. Move the extracted **xtrata-music-support** folder into Documents.
3. If Node.js is not installed, visit <https://nodejs.org/en/download>, download
   Node.js 24 LTS for Windows and follow the normal installer steps.
4. Double-click **START HERE - Windows.cmd**.
5. If Windows asks whether you trust the script, check that it came from the
   official Xtrata download and that the filename is correct before continuing.
   Do not disable SmartScreen or antivirus protection.
6. Wait for “Starting Xtrata Music”. Your browser opens the listening room.

## First use: create, fund and enable support

1. Select **Create my support wallet**. If you have used this installation
   before, the app reuses its separate local wallet. This does not send money
   or enable payments.
2. Select **Copy funding address**. In your usual Stacks wallet, send STX on
   Stacks mainnet to that address. We recommend about **1 STX**. You may send
   less or more; the app warns above 1 STX but does not block listening.
3. Select **Refresh balance** until the deposit appears. Check the complete
   address before sending. Cryptocurrency transfers cannot normally be reversed.
4. Start a song. Listening is free by default.
5. When ready, read **Payment details**, tick the approval box and select
   **Turn on music support**. Confirm the amount shown.

Funding never turns payments on. Only the separate approval in the listening
room enables Music Support, and it can be stopped there at any time.

At the default setting, each eligible new song start uses a 0.000300 STX network
fee and sends 0.000050 STX to the current song holder: 0.000350 STX total.
Xtrata takes no platform fee. The fee does not increase automatically. Pausing,
resuming or seeking within the same song does not pay again. A paid start records
that the song started; it does not prove the whole song was heard.

Select **Listen free / pause support** at any time. If a payment is still being
checked, music continues free and missed starts are never charged later.

## Where your wallet is kept

The wallet is kept outside this program folder so that replacing the program
does not replace your wallet:

- Mac: `Library/Application Support/Xtrata Music` inside your user folder
- Windows: `AppData\Roaming\Xtrata Music` inside your user folder
- Linux: `.local/share/xtrata-music` unless `XDG_DATA_HOME` is configured

The app manages its signing key locally; there is no cloud recovery. Anyone or
any software with access to those wallet files may be able to spend the balance.
Treat this as a small listening wallet, not savings. Do not delete, rename or
share its wallet files. Keep the recommended balance around 1 STX.

Before removing Xtrata Music, use **Manage or return your balance** in the
listening room. Carefully enter your own Stacks mainnet address, review it, and
confirm the return. A network fee applies. Wait for unresolved payments first.

## Updating safely

1. In the old listening room, select **Listen free / pause support**.
2. Close the old terminal window.
3. Keep the wallet-data folder listed above. Do not delete it.
4. Extract the new program into a new permanent folder and use its START HERE
   file. It will reuse the separate wallet-data folder.
5. Confirm that the same funding address appears before deleting the old program
   folder. If it differs, stop and use the support information on the Xtrata
   Music hub: <https://xtrata.xyz/radio/lounge>.

The separate wallet-data location starts with this simplified package. If you
previously used an older source package that kept its wallet inside the program
folder, keep that old folder and return its balance before moving to this one.
The new package will not silently copy or move an older signing key.

## Troubleshooting

**The START HERE file says Node.js is missing.** Install Node.js 24 LTS from the
official Node.js site, restart your computer if its installer asks, and try the
START HERE file again.

**A browser did not open.** Keep the terminal window open and visit
<http://127.0.0.1:8798/lounge> manually. This address works only on your own
computer while Xtrata Music is running.

**The page says it cannot connect.** Another copy may be starting or port 8798
may be in use. Close other Xtrata Music terminal windows, wait ten seconds, then
try START HERE once. Never expose port 8798 to the internet.

**Installation stops with a network error.** Check the internet connection and
run START HERE again. Installation uses the locked dependency list and disables
third-party installation scripts.

**The balance or catalogue will not load.** Listening data needs an internet
connection. The funding address should remain visible. Do not send funds until
you have checked the entire address and can refresh the balance successfully.

**I closed the terminal.** Open Xtrata Music again with START HERE. Your wallet
is reused. Music support must be approved again for the new session.

## What this package cannot do

- It cannot run while the computer is asleep, offline or switched off.
- It cannot recover deleted wallet files or reverse blockchain transactions.
- It does not need a browser extension for the local listening room.
- It is an early-access source package rather than a signed app-store installer.
- Windows and Linux remain experimental until tested on clean machines.

For current downloads, release notes and help, visit
<https://xtrata.xyz/radio/lounge>.

## Installing with an AI assistant

This package includes **AI AGENT - INSTALL.md** and a reusable skill in
`skills/xtrata-music-support-installer`. Give the whole extracted folder to an
assistant and ask it to install Xtrata Music using that guide. The agent guide
keeps installation separate from wallet funding and payment approval, forbids
access to wallet secrets, and includes checks for a safe local installation.

You can say: “Install Xtrata Music from this folder. Follow AI AGENT - INSTALL,
leave Music Support off, and stop when free playback works.”
