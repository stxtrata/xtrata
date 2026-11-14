# ParallaX Casino: overhaul brief (for Fable 5.2)

You are taking a fresh, whole-system look at the ParallaX Casino and have a free hand to improve it. Attached: the "Xtrata Cube Comparison & Material Lab" (`Xtrata-Cube-Comparison-Lab.html`), described under CUBE AVATARS.

## What this is
A 3D walk-around casino at xtrata.xyz/casino, the "LAYR Lounge". Players walk a room with slot machines, table games (blackjack, roulette, video poker, Sic Bo, baccarat, Hold'em, Liar's Dice), a bar, dealers and NPCs, other live players, chess tables with spectator betting, and a private Salon. It runs on **Stacks testnet with play money**: nothing real is at stake. LAYR is the casino's chip currency, bought with testnet STX at the in-room exchange. The founder (Jim, Xtrata) is building this as a flagship demo of what Xtrata can do, so first impressions matter.

## How it is built (verify, don't trust this summary)
- **Page:** `xtrata-2.0/public/casino/index.html`, one large self-contained Three.js file, plus `machine-rotation.js` (which machines stand on the floor), `room.js` (built from `src/casino-room/`), `passkey-wallet.js`, `chess.js`.
- **Machines:** `public/casino-machines/<id>/` packs (model plus playable game). Five originals are built in; the rest load from packs. A deploy step splits packs into cached files. Large assets live in `public/casino-assets/`, hashed and served immutable. A boot screen shows real download progress. Keep this loading pipeline healthy.
- **Multiplayer:** a Cloudflare Worker with a Durable Object (`workers/casino-room/`, `functions/lib/casino-*.ts`). It handles sign-in sessions, who-is-here presence, walking positions, play-together (seated players' spins shown to watchers), chat and messages, chess rooms with spectator bets, and the Salon. It hibernates between messages; keep it cheap.
- **Wallets:** one free signature to join the room, with Leather, Xverse, or the casino's **passkey wallet** (Face ID or fingerprint, no extension, free testnet STX). Guests can look around without signing. Some features are gated by sign-in level. The Salon requires a primary BNS name, looked up on **mainnet**, because the room's identity is the testnet address.
- **Honour-system balances:** chess stakes and bets are tracked by the room, not by contracts. On-chain settlement is a documented future plan (`docs/plans/CASINO-ONCHAIN-LAYR-PLAN.md`), not built.
- **Server-side touch points:** missions, the daily slot tournament and the Slot fan badge are keyed to the original five machines (`functions/lib/casino-machines.ts`). The floor was recently changed to a different five, so check how this should be reconciled.
- **Devices:** touch devices get a LITE mode and a five-machine floor, because a 27-machine layout crashed an iPad Air through GPU and texture memory. Memory is the main constraint on tablets and phones.
- **Variants:** `/casino-b` and `/casino-c` are older or experimental copies. Leave them alone unless told otherwise.

## Where the decisions are written down
The `docs/plans/CASINO-*.md` set (main room, welcome/join, who-is-here, play-together, presence, salon-BNS, passkey wallet, on-chain LAYR, machine migration, table views and mobile, chess), `CHANGELOG-2.0.md`, `docs/WALLET-PLAYBOOK.md`, and `docs/PASSKEY-WALLET.md`. Read what bears on a change before making it. Early external feedback is in `public/casino-b/parallax-casino-feedback-for-jim.md`: show balances in the exchange, make "waiting for confirmation" visible, put exits inside games, add rules pop-ups, let people reopen the welcome panel.

## The outcome I'm after
- **Obvious on arrival.** Someone landing from a link should understand within seconds what this place is, that it is a testnet play-money casino, who else is here, and what to do next, without exploring menus. Nothing important should depend on discovery.
- **Everyone ends up in the room.** Joining the shared room should be the natural default, easy and reassuring, with "look around first" as a gentle alternative. The testnet and play-money nature should be clear in the wallet and join flow and on the exchange, so nobody mistakes it for real funds.
- **Multiplayer that feels solid.** Presence, walking, chat, play-together, spectating and chess should be consistent, smooth, and low in lag and jitter.
- **Movement and controls that feel good** on keyboard and mouse and on touch.
- **Streamlined and organised.** Simpler menus and flows, less clutter, one coherent way to do each thing, all existing utilities kept and room for more.
- **Fast and light.** Loading, memory and frame rate, with low-end tablets and phones as the bar. Better graphics wherever there is headroom that does not cost performance.

## CUBE AVATARS
The attached lab builds Xtrata's cube-headed characters: three body types (classic CubeBot, a humanoid cube, and a floating "hover" cube), each with six independently programmable screens, material and finish controls, idle/walk/run movement with personality styles, saveable "looks" as JSON, and GLB export. Bring these into the casino as player characters. People should be able to choose a humanoid or the floating-cube version as their profile, customise it, and be seen as it by everyone in the room. Work out selection, persistence, and how a look reaches other players, keeping it light enough for phones and cheap for the room Worker.

## Ground rules
- Keep all existing functionality. Improve, merge and reorganise, but don't silently drop features.
- Other sessions work in this repo (chess/betting, homepage, machines). Check `git status` first, avoid overwriting their edits, and keep changes reviewable.
- Test in a real browser, including touch-emulated, before calling anything done. Say plainly what you couldn't test (real iPad, two real devices, real wallets).
- Don't commit or deploy. Report what changed, what to test, and any room-Worker deploy steps and their order.
- If this brief conflicts with what you find, say so and use your judgement.
