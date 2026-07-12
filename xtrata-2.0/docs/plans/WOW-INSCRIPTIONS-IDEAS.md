# "Wow" Inscriptions — 20 ideas, top 5, build plan

The unlock that makes all of these possible: an Xtrata HTML inscription is a
**live program** that can (a) load other inscriptions by id through the runtime
(recursion), (b) read chain state through the public API from inside the
inscription, and (c) treat **transactions as input** — a contract call or a tiny
child inscription becomes a button press. That means inscriptions that change,
respond, and connect people. The showcase page is `/wow` — a gallery where every
tile does something.

## The 20

**Play together (transactions as game moves)**
1. **On-Chain Chess** — the board is one inscription; each move is a contract call (`move e2e4`). The inscription replays the event log to render the current position. Every finished game is a permanent artifact anyone can replay move-by-move.
2. **One Pixel Each (Million-Sat Canvas)** — a shared canvas inscription; a tx sets one pixel (x, y, color). Watch the artwork emerge from thousands of wallets. The canvas IS the community.
3. **Exquisite Corpse** — a story/drawing where each contributor inscribes the next line/panel as a child of the previous one. The parent inscription renders the whole chain. Nobody controls where it goes.
4. **On-Chain Battleship** — two players commit hashed board layouts, then fire shots as transactions; hits are provable against the commitment. Hidden-information gaming with cryptographic honesty.
5. **The Auction House That Lives Inside Its Lot** — an artwork inscription that displays its own live bid history and current owner by reading the chain — the provenance plaque is part of the art.

**Living artifacts (chain state as art material)**
6. **Block Garden** — a generative garden that grows one plant per Stacks block since inscription. Visit in a year: it's a forest. The art literally ages on-chain.
7. **The Mood Ring** — art that recolors itself from live chain data (fee rates, mempool depth, BTC price via oracle contract). Calm chain = cool blues; congestion = storm.
8. **Dead Man's Switch Letter** — an inscription that stays sealed until its owner's wallet is inactive for N blocks, then renders its message. Provable, unstoppable time capsules.
9. **The Hodler's Portrait** — art that gets richer the longer the same wallet holds it (reads its own transfer history); sells and resets to a seed. Loyalty rendered visible.
10. **Countdown Monument** — inscribed for a future block height (halving, anniversary); renders a live countdown until the moment, then permanently transforms. One-time event, on-chain forever.

**Agents (yes — agents can use them)**
11. **Agent Guestbook** — an inscription that invites AI agents to sign it via a documented contract call (name, model, message). Renders the growing roll of machine visitors. First guestbook for AIs, and a live demo of Agent One's skill docs.
12. **The Oracle Duel** — two AI agents each own a prediction inscription; they post predictions as transactions, and a referee inscription scores them against outcomes. A public, permanent leaderboard of machine judgment.
13. **Self-Describing Inscription** — an inscription whose content teaches an agent how to interact with it (embedded machine-readable API + human explanation). Point any agent at it; it figures out how to play. The XTRATA_AGENT_SKILL made recursive.

**Music & radio (build on what we have)**
14. **The Infinite Remix** — stems inscribed separately; a player inscription loads them recursively and lets anyone mix live. Each "save" is a tiny recipe inscription (volumes/pattern) — thousands of songs from five stems, each remix a few hundred bytes.
15. **Chain Sequencer** — a drum machine whose pattern is seeded by recent block hashes; every listener at the same block height hears the same groove. The blockchain as a band member.
16. **Jukebox Wars** — the homepage radio, democratized: paying a micro-tx queues your inscribed song on everyone's radio. The station's playlist is a public fee market.

**Tools & tricks that read as magic**
17. **The Recursive Website** — a complete multi-page site where every page, image and script is a separate inscription, glued by one 2KB index. "This entire website has no server" is a hell of a demo.
18. **Inscription Tamagotchi** — a pet whose hunger is time-since-last-feed (feeding = micro-tx from anyone). Community keeps it alive; if everyone forgets, it visibly perishes — permanently.
19. **Proof-of-Moment Camera** — a page that inscribes a photo + timestamp + block hash in one flow; the inscription self-verifies its capture moment. Notarized memories.
20. **The Treasure Map** — a puzzle inscription hiding a private key behind riddles whose clues live in other inscriptions (recursive scavenger hunt). First solver sweeps the prize wallet — publicly, on-chain.

## Top 5 (impact × feasibility × "you can do it together")

| # | Pick | Why it wins | Build sketch |
|---|------|-------------|--------------|
| 1 | **On-Chain Chess (1)** | The purest "tx = move" story; spectators, replays, permanence. Chess is universally legible. | Small Clarity contract (`new-game`, `move`, san string + game id) + one HTML inscription with an embedded chess engine for legality + event-log replay via `/hiro` reads. ~3–4 days incl. testnet games. |
| 2 | **One Pixel Each (2)** | Maximum participation, minimum friction; makes a mesmerizing time-lapse for social. | Contract with `set-pixel (x y color)` map + canvas inscription that streams events; time-lapse scrubber from event history. ~2–3 days. |
| 3 | **Block Garden (6)** | Zero interaction needed for the wow — it grows by itself; perfect first tile on /wow. | Pure client: seeded generative art parameterised by (current-block − mint-block); one read-only API call. ~1–2 days. |
| 4 | **The Infinite Remix (14)** | Shows recursion + your music DNA; remixes-as-tiny-inscriptions is the deep Xtrata pitch. | Inscribe 4–6 stems (Opus), mixer UI inscription (WebAudio), remix recipes as ~300-byte child inscriptions via Agent One. ~4–5 days incl. stems. |
| 5 | **Agent Guestbook (11)** | The "agents use inscriptions" proof, and it markets Agent One every time an AI signs. | Tiny contract (`sign name model message`) + renderer inscription + a signing skill doc; get 2–3 known agents to sign at launch. ~2 days. |

**Honourable mentions to keep on the roadmap:** Tamagotchi (18) as the follow-up
community toy, Recursive Website (17) as the developer-facing demo, Jukebox
Wars (16) once the radio has an audience.

## The /wow page

One gallery page (same pattern as /g): each tile is a live iframe of the real
inscription with a one-liner ("Every move in this chess game was a Bitcoin-anchored
transaction"), a **Try it** button (testnet or read-only interaction), and a
"How it works" flip side linking the contract + inscription ids. The page itself
should eventually be inscribed — the showcase of recursive inscriptions, as a
recursive inscription.

## Suggested order

1. **Block Garden** — fastest wow, no contract needed; ships the /wow page with it.
2. **One Pixel Each** — first multiplayer; seeds social content (time-lapse).
3. **On-Chain Chess** — the flagship; announce with a live exhibition match.
4. **Agent Guestbook** — the agent story, timed with Agent One promotion.
5. **The Infinite Remix** — the music finale, cross-promoted from SUNO More.
