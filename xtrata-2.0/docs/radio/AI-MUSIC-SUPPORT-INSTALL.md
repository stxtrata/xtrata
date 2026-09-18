# Xtrata Music installation guide for AI agents

This document is for an AI assistant helping a person install, launch, update or
remove Xtrata Music. Explain each user-visible step in plain language and keep
the person in control of operating-system prompts, wallet funding and payments.

## Outcome

Leave the user with Xtrata Music opening its local listening room, with free
playback available. A successful installation does not require creating or
funding the support wallet. Funding and Music Support are separate, optional
steps that require the user's explicit choice.

## Trust and payment boundaries

- Never request, reveal, copy, log or transmit a seed phrase, private key,
  `vault.json`, `unlock.json`, raw signed transaction or other wallet secret.
- Never use a personal, deployer, sponsor or already-connected wallet for tests.
- Never send STX, create a return, enable Music Support, sign or broadcast a
  transaction unless the user explicitly asks for that exact action and has
  reviewed the destination and amount.
- Do not treat permission to install or launch as permission to fund or spend.
- Do not silently bypass Gatekeeper, SmartScreen, antivirus or other
  operating-system security. Ask the user to handle a named security prompt.
  For the explicitly labelled unsigned Mac preview, an agent may explain the
  documented quarantine fallback only after the user verifies its SHA-256. Do
  not run that command for the user or generalise its path.
- Do not expose the loopback service to a network. It must bind to `127.0.0.1`.
- Do not delete an existing wallet-data folder. If a wallet may contain funds,
  open the existing app and use its reviewed return flow before removal.

## Choose the installation route

1. Check <https://xtrata.xyz/radio/lounge> for a signed, verified installer for
   the user's operating system.
2. Prefer that installer when available. Verify its SHA-256 against the value on
   the hub. It needs no Node.js or browser extension.
3. If no signed installer is published, use the supplied
   `xtrata-music-support.tar.gz` source package. Tell the user that this fallback
   needs Node.js 24 LTS and keeps a terminal window open while the app runs.
4. Do not invent a release URL or recommend an unsigned preview as a normal
   public release.

## Signed desktop installer workflow

1. Confirm that the platform, CPU architecture and supported OS match the hub.
2. Download from the verified `github.com/stxtrata/xtrata/releases/download/`
   link shown by the hub.
3. Calculate SHA-256 locally and compare the whole value with the hub.
4. Open the installer normally. Let the user approve any OS installation prompt.
5. Launch **Xtrata Music** from Applications, Start, or the application menu.
6. Confirm that the local listening room opens, free playback is available and
   Music Support says it is off. Stop if the app starts payments automatically.

For the unsigned Apple-silicon preview, try Apple's **Privacy & Security → Open
Anyway** route first. If that fails, and only after the user confirms the DMG
checksum matches the published value, show the last-resort command from
`DESKTOP-PREVIEW-TESTING.md`:

```sh
xattr -dr com.apple.quarantine "/Applications/Xtrata Music.app"
```

Explain that it recursively removes quarantine from this app and prevents the
normal Gatekeeper assessment of this copy. The user must choose and run it. Do
not add `sudo`, change the target, or run it against an unverified download.

## Source-package workflow

1. Verify that the archive is the one supplied by Xtrata. If a `.sha256` file is
   present, compare it before extracting.
2. Extract it into a new folder. Never run commands from inside the archive.
3. Move `xtrata-music-support` to a permanent user-owned location such as
   Documents. Do not place it in a system folder or run it as administrator.
4. Check `node --version`. Continue only with Node.js major version 24. If it is
   missing, direct the user to <https://nodejs.org/en/download> for Node.js 24
   LTS. Do not use an unofficial download or silently install a package manager.
5. Use the platform launcher:
   - macOS: `START HERE - Mac.command`
   - Windows: `START HERE - Windows.cmd`
   - Linux: `START HERE - Linux.sh`
6. The launcher runs the locked installation with lifecycle scripts disabled,
   starts the service on `127.0.0.1:8798`, and opens
   <http://127.0.0.1:8798/lounge>.
7. Confirm that the page identifies itself as Xtrata Music and shows free mode.
   Do not select **Create my support wallet** unless the user asks to continue
   with wallet setup.

An agent with shell access may run `node open.mjs` from the extracted package
instead of double-clicking the launcher. Keep the process attached; closing it
stops the local app and new support payments. Do not add flags, change the data
directory, expose the port, or run the command with elevated privileges.

## Optional support-wallet setup

Only continue when the user explicitly asks. Select **Create my support wallet**
and show the resulting public funding address in the UI. The user should fund it
from their own wallet; the agent must not take custody of that wallet or its
credentials. Recommend around 1 STX, refresh the confirmed balance, and leave
Music Support off unless the user separately asks to enable it after reviewing
the per-start network fee and 0.000050 STX holder payment.

## Validation checklist

- The app listens only on `127.0.0.1`, normally port `8798`.
- The lounge loads and free playback remains available.
- The package installed from its locked dependency file with install scripts
  disabled.
- No wallet secret appeared in the terminal, chat, logs or repository.
- Funding alone did not enable payments.
- The user knows that closing the app stops new payments and that already
  submitted transactions may still confirm.

Report the installation route, platform, app version where available, checksum
result, local URL and whether the free-mode check passed. Report only the last
six characters of a funding address unless the user needs the complete public
address for funding. Never include secret filenames' contents.

## Updating or removing

Pause Music Support and close the old app before updating. Preserve the external
wallet-data directory and confirm the same public funding address after the
update. An older source package may have kept its wallet inside its program
folder; keep it and return its balance before migration. Before removal, return
any balance through the app's reviewed return flow, wait for confirmation, then
remove the program. Delete wallet data only when the user explicitly requests it
and has confirmed that no funds or pending transactions remain.
