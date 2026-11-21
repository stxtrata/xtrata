# Repository working rules

## Read first: AI development workflow

Read [AI_DEVELOPMENT_GUIDE.md](AI_DEVELOPMENT_GUIDE.md) before beginning a new task.
It defines how to turn short, informal requests into complete, verified work and
how to report missing context. Apply it alongside the relevant project-level
instructions. Read it once per session and again if it changes or context is lost.
For Audionaut work, also read
[the Audionaut supplement](xtrata-2.0/AUDIONAUT_AI_GUIDE.md).

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
