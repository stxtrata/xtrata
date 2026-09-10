# Repository working rules

## Wallet testing

- Never use the user's personal wallets, hot wallets, deployer wallets, or sponsor
  wallets for testing, even if a browser already has one unlocked or connected.
- Use disposable Xtrata wizard wallets or local simulations. Keep wizard secrets
  out of browser storage, chat, logs, and Git; use the existing ignored wizard
  configuration through its tooling.
- Respect wizard kill switches and spending limits. Testing authorization alone
  does not authorize signing or broadcasting a payment or inscription.

## Local media

- Keep the root `media/` folder and newly generated images, audio, and video local.
  Do not stage or push them unless the user specifically requests those assets.
- Audit explicitly staged paths before committing. Do not delete historical
  tracked assets or rewrite history merely to enforce this policy.
- `.ts` and `.mts` source files are code, not media.

Read the applicable project-level AGENTS.md before changing that project.
