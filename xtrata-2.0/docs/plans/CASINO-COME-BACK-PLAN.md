# ParallaX Casino: reasons to come back (phase 3)

Written 2026-11-01. **Status: BUILT 2026-11-01** on the `casino-multi` branch (not deployed). Phase 3 of the engagement and
multiplayer review (Claude Docs: "ParallaX Casino — engagement & multiplayer review"), after phases 1 and 2
(docs/plans/CASINO-PLAY-TOGETHER-PLAN.md).

Everything here is testnet and play money (LAYR). Nothing moves STX or touches a contract. The room Worker must be redeployed for any
of it to appear: the page only uses what the room lists in `features`.

## 1. What a player gets

| Feature | What happens | Where |
| --- | --- | --- |
| Levels | XP for playing (10 a hand, 4 a spin, +5 for a win, +25 for a win of 10x or more), for drinks, the daily drop, missions and tournaments. Level L needs 50·L·(L−1) XP (level 2 at 100, 5 at 1,000, 10 at 4,500). XP never depends on the bet, and play XP stops at 3,000 a day so autoplay cannot farm it. The level is on the player's name tag, for everyone, and a level-up is announced over their head | room `log`; tags in `drawTag` |
| Badges | 15 badges (first win, big winner, monster win, high roller, grand tour, slot fan, regular, generous, life of the party, marathon, contender, champion, jackpot, level 10...). The rarest one held shows on the name tag; new ones are announced | `BADGES` in casino-progress.ts (the page has the same list) |
| Daily missions | Three a day per player (UTC): one to play ("Spin The Drop 20 times"), one social ("Send someone a drink"), one stretch ("Win 3 times"). 2,500 / 2,500 / 5,000 LAYR each, and 5,000 more for all three. None depends on the size of a bet | `missionsFor`, `advanceMissions` |
| Weekly leaderboards | Biggest win, most XP, most hands and spins, most generous; reset Monday 00:00 UTC. Shown in the "This week" tab, with last week's top player | room storage `wk:<week>` |
| Slot tournament | Every evening at 20:00 UTC for 30 minutes, on a different machine each day. Free to join. A player's score is the total of their wins as multiples of the bet over their first 50 spins, so the bet size makes no difference. Prizes 50,000 / 25,000 / 10,000 LAYR, a "Champion" badge. Live standings for everyone; the result is announced to the room | `tourneyAt`, `scoreTourney`, `settleTourney` |
| Progressive jackpot | One jackpot for all machines, starting at 100,000 LAYR. Every paid spin adds 1% of its bet (paid by the house: nothing is taken from the spin) and has the same 1 in 5,000 chance to win it, whatever the bet. The room draws the chance. Shown on a sign above the machines and in the strip at the top | `feedJackpot` |
| Happy hour | 19:00–20:00 UTC, just before the tournament: double XP, a double daily drop, drinks for other people half price | `happyHour` |
| Balance follows you | The room keeps each player's LAYR balance. A page sends its changes as differences, so two devices playing at once both count, and the room adds prizes to it. A new device shows the player's balance; a browser's existing chips join the account the first time it syncs | `bal`; page `syncStart`, `syncOn` |
| Friends | Add or remove a friend from the "Friends" tab (kept by the room, so it follows you). A notice when a friend arrives. A floor map with everyone (friends in gold), and a player card (level, badges, best win) | `friends`, `card` |
| Tonight | A card with this visit's hands, spins, wins, best win, LAYR played and LAYR back. Responsible play: people see what they spent | page only |

The ⭐ button (top right, next to 😊) shows the level and opens the panel (Tonight, Missions, Badges, This week, Tournament, Friends).
A strip under the top bar shows what is on: happy hour, the tournament (with your score while you play), the jackpot.

## 2. Trust (honestly)

LAYR is play money kept by each player's page, and the page reports its own hands and spins. The room checks the shape and the rate
(150 plays and 90 balance changes a minute) and keeps numbers plausible, but a player running modified code could inflate their level,
board entries, tournament score or balance. That is acceptable for play money. Real prizes need on-chain LAYR (phase 4), where the
contracts are the record. The jackpot and tournament are drawn and settled by the room, never by a page.

## 3. The room protocol (additions)

Client to room: `log {k: 'hand' | 'spin', g, bet, won, free?, sh?}` · `bal {init}` / `bal {d}` · `board` · `friends {list}` · `tjoin`
· `card {a}` · `mission` (also returns the tournament and happy hour; the page asks when one begins or ends).

Room to client: `me` (XP, level, badges, stats, missions) · `lvl {a, lv, bd, up}` · `badge {a, id}` · `mission-done` ·
`bal {v, rev, mine?, got?, why?}` · `board` · `friends` · `card` · `tourney` · `tourney-end` · `jp {v}` · `jackpot {a, w, g}` · `hh`.
On arrival `room` also carries `levels`, `jackpot`, `tourney`, `hh`, and for a signed-in player `me`, `bal`, `friends` and `notices`
(prizes won while away, shown once). New features: `progress, missions, boards, tourney, jackpot, bal, friends, hh`.

No timers (the Durable Object still sleeps): a finished tournament is paid when someone next connects, plays or asks for missions.

Storage: `p:<key>` profile, `b:<key>` balance, `f:<key>` friends, `wk:<week>` boards, `t:<n>` tournaments, `jp` the jackpot. Players are
keyed by their key hash, like the daily drop.

Code: `functions/lib/casino-progress.ts` (pure, unit tested in `functions/lib/__tests__/casino-progress.test.ts`), the Durable Object
`workers/casino-room/index.ts`, the client `src/casino-room/main.ts`, and the page `public/casino/index.html` (the phase 3 part of the
`social` block, `drawTag`, and the machines' settle hook).

## 4. Deploy (Jim)

1. Room Worker: `cd workers/casino-room && npx wrangler deploy` (nothing to migrate; records are made on first use). Leave
   `CASINO_SCHEDULE` and `CASINO_JACKPOT_ODDS` unset: they exist only to shorten the schedule and force the jackpot in tests.
2. Room client: already built into `public/casino/room.js`; the page asks for `room.js?v=p5.0`.
3. The page goes out with the usual git push (Pages).

## 5. Tests

- `npx vitest run functions/lib/__tests__/casino-progress.test.ts` (levels, badges, missions, boards, schedule, tournament, jackpot,
  balance).
- `CHROME_PATH=… node scripts/test-casino-together.mjs` (two real browsers; `ONLY=progress` for this phase): a mission paid into the
  balance, levels on the other player's name tags, the weekly boards, friends and cards, the balance on a third, new device and back,
  a tournament from joining to the prize, the jackpot, and a real machine spin reaching the room.

## 6. Not done

Phase 4 (real stakes, after on-chain LAYR): shared blackjack, tips and sending LAYR, real prizes, a craps table. Also still open:
holder badges read from the chain (for example Forever Twins), a leaderboard board on the bar wall in 3D, seasonal room looks.
