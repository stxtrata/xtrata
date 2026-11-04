# ParallaX Casino: playing together (phases 1 and 2)

Written 2026-11-01. **Status: BUILT 2026-11-01** (local commits, not pushed). Jim: "Please proceed with phases 1 and 2", after the
engagement and multiplayer review (Claude Docs: "ParallaX Casino — engagement & multiplayer review").

Everything here is testnet, play money (LAYR kept in each player's browser). Nothing moves STX or touches a contract. The room
Worker must be redeployed for any of it to appear (the page only uses what the room lists in `features`).

## 1. What a player gets

### Phase 1: the room feels alive

| Feature | What happens | Where |
| --- | --- | --- |
| Reactions | A 😊 button (top right, signed-in players) opens a tray of 8 reactions: wave, cheer, clap, thumbs up, laugh, wow, "nooo", raise a glass. Everyone in the room sees the emoji over the player's head and their avatar makes the matching gesture | room `react`; page `social` |
| Speech bubbles | Every chat line also appears for a few seconds over the speaker's head (blue for table chat) | page `social` (`say`) |
| Big wins | A win of 10x the bet or more (any table, or a machine spin) is announced: a banner for everyone ("Mia just won 35x on roulette · +3,500 LAYR"), a 🎉 over the winner, and the house regulars cheer. The last 8 big wins are kept by the room and listed in the tray, so a new arrival sees people winning | room `win` (feed in storage `wins`); page `outcome()` and the machines' `settle` hook |
| Daily drop | Sign in once a day (UTC) for free LAYR: 5,000 on the first day, then 7,500, 10,000, 15,000, 20,000, 30,000 and 50,000 from the seventh day in a row; missing a day starts again. One per player (by key), shown as a "DAILY DROP" banner | room `daily` (storage `d:<key>`) |
| House regulars | When fewer than 3 people are in the room (or the room is off), up to three characters sit at the machines, labelled "Mia · house regular", react now and then, cheer big wins and (on desktop) play their machines. They move every few minutes and give way to real players. `?regulars=0` turns them off | page `social` |
| Usage counters | Per UTC day, with no address or message kept: connections, sign-ins (new / returning), peak connections, chat lines, reactions, big wins, bets, drinks, daily drops, Salon messages. `GET /casino/room/stats` | room storage `c:<date>`; `functions/casino/room/stats.ts` |

### Phase 2: play together

| Feature | What happens | Where |
| --- | --- | --- |
| Shared roulette | Signed-in players at the roulette table all play the same spin. Rounds run on the room's clock: 32 s each, bets close after 17 s, then the wheel spins for everyone. Other players' chips show on the felt (smaller) and in the panel ("also betting: Mia 300"). The SPIN button becomes the countdown | `casino-rounds.ts`; roulette station |
| Shared baccarat | The same at baccarat: 30 s rounds, bets close after 15 s, the same cards dealt on every page | baccarat station |
| Fair rounds | Each round's result comes from a seed = HMAC-SHA256(room secret, "table:round"). While bets are open the room only shows sha256(seed); after they close it reveals the seed, and each browser checks it against the commitment and works out the number or the cards itself (`window.PXRounds`). A seed that does not match voids the round and returns the bets | `casino-rounds.ts` |
| Watch from the rail | Standing near a shared table (within a few metres) shows its rounds without sitting; the table counts you as watching (for table chat) | `watch`; `social.tableNow()` |
| Table chat | A "Table" button in the chat sends only to the people sitting at, or standing by, your table. Table lines are tagged and blue | room `say` with `ch: 'table'`; chat.ts |
| Salon player vs player | At Salon Hold'em and Liar's Dice: "Find a player" puts you on the room's waiting list; anyone else at that table sees "Play Jim · 25 LAYR" and can take you on. The practice bot is still there | `makeSalonLobby`, `PvpCore.makeRelayChain` |
| Drinks | "Buy your table a round" (everyone else at your table) or "Send someone a drink" (anyone in the room): champagne 500, cocktail 250, whisky 100, beer 80, espresso 140, water 20 LAYR each. The room announces it; recipients get a notice and the drink appears over their heads | room `gift`; page `social` |
| Invite links | "Invite a friend here" copies `…/casino/?meet=<table>`; the friend gets "A friend invited you to the roulette table. [Take me there]" | page `social` |

## 2. How the Salon match works

The player who waited is the **host**. Their browser runs a relay chain: every 3 s a new block (height, random hash, its time, the
calls made in that block, in order). Each call is a method name and plain arguments (`act`, `bid`, `reveal`...), never code. The
host runs each block on its own copy of the table and sends it to the guest, whose browser runs the same calls on its copy, so the two
stay identical (checked call by call in `scripts/test-salon-relay.mjs`). The guest's own calls go to the host and come back in a
block; a call made "as" the other player is dropped. Each player's cards or dice still come from their own secret seed, committed
before the deal, so neither can see the other's hand.

Limits, honestly: the host makes the block hashes, so a host running modified code could choose them. With play money this is
acceptable; the real stakes version is the casino-holdem / casino-liars-dice contracts already modelled by the same rules. If either
player leaves, stops answering for 20 s, or a block goes missing, the game is void and each player gets their own stake back.

## 3. The room protocol (additions)

Client to room: `react {e, to?}` · `win {g, x, w}` · `daily` · `watch {tb}` · `round {tb}` · `bet {tb, n, bets}` ·
`gift {to: address | 'table', d}` · `seek {tb, stake}` / `seek {off}` · `pvp {to, d}` · `say {text, ch: 'table'}`.

Room to client: `react` · `win` · `daily {got, streak, next}` · `round {n, period, close, commit, seed?, prev, bets}` · `bet` ·
`gift {a, to[], d, round}` · `seek` · `pvp {a, d}` · `say` with `ch` and `tb` · and on arrival `room` now carries `wins`, `bets`,
`seekers` and the new `features`: `react, win, daily, table, rounds, gift, pvp`.

Limits: reactions 1 per 0.8 s (40 a minute), wins 1 per 3 s, drinks 1 per 3 s (15 a minute), Salon relay 30 per 10 s, all apart
from the seat and chat limit. Bets only while that round is open. Blocking hides reactions, table chat, drinks and the relay both ways.

Code: `functions/lib/casino-social.ts` and `functions/lib/casino-rounds.ts` (pure, unit tested in
`functions/lib/__tests__/casino-social.test.ts`), the Durable Object `workers/casino-room/index.ts`, the client
`src/casino-room/main.ts` (a general `px-room-send` / `PXRoomHost.on` bus) and `chat.ts`, and the page `public/casino/index.html`
(the `shared` registry, the two shared stations, `makeSalonLobby`, the `social` block in the presence section).

## 4. Deploy (Jim)

1. Room Worker: `cd workers/casino-room && npx wrangler deploy` (new features; nothing to migrate: the round secret is made on first use).
2. Room client: already built into `public/casino/room.js` (`npm run build:casino-room`); the page asks for `room.js?v=p4.0`.
3. The page and the stats function go out with the usual git push (Pages).

Nothing changes for players until the Worker is deployed: an older room lists none of the new features, so the page behaves as before
(apart from the house regulars, which are page-only).

## 5. Tests

- `npx vitest run functions/lib/__tests__/casino-social.test.ts` (parsing, routing, limits, daily drop, counters, round clock, commit
  and reveal, results from a seed).
- `node scripts/test-salon-relay.mjs` (a Hold'em hand and a liar's dice game between two simulated browsers over JSON).
- `CHROME_PATH=… node scripts/test-casino-together.mjs` (two real browsers on the real page and the real room code: daily drop,
  reaction, win banner, a drink, table chat, shared roulette and baccarat give the same result on both pages, a liar's dice game
  between the two players, the day counters).

## 6. Not done (phase 3 and later)

Levels and badges, missions, weekly leaderboards, slot tournaments, a shared progressive jackpot, the balance following the address
across devices, friends and a floor map, shared blackjack (turns), real tips and prizes (need on-chain LAYR).
