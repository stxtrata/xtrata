---
name: xtrata-music-support-installer
description: Install, launch, update, diagnose, or remove Xtrata Music and its optional local Music Support wallet for a user. Use for the signed desktop app or the fallback source package; do not use for funding or authorising payments unless the user separately requests that action.
---

# Xtrata Music Support Installer

Help the user reach a working local listening room with free mode confirmed.

Prefer a signed and verified desktop installer published by the official Xtrata
Music hub. Check its platform requirements and SHA-256. If none is published,
use the supplied source package, Node.js 24 LTS, and its platform-specific
`START HERE` launcher. Do not invent download links or present unsigned preview
builds as public releases.

Before acting, read `AI-MUSIC-SUPPORT-INSTALL.md` when it is available in the
repository, or `AI AGENT - INSTALL.md` when working inside the distributed
package. Follow its install, validation, update and removal procedures.

Keep these boundaries:

- Installation or launch does not authorise wallet funding or payments.
- Never access, display, copy or transmit wallet secrets or wallet data files.
- Never use a personal, deployer, sponsor or connected wallet for testing.
- Never bypass OS security or bind the companion service beyond `127.0.0.1`.
- Never delete a wallet-data folder that may contain funds or pending activity.
- Let the user handle funding from their own wallet. Enable Music Support only
  after a separate explicit request and clear review of the displayed cost.

Validate observable results: the expected checksum, the local lounge identity,
free playback, Music Support off, and loopback-only service. Report what was
installed and what remains for the user without including wallet secrets.
