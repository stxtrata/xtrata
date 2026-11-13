# ParallaX Casino: the overhaul (first pass)

Status: **on `casino-fable`, not pushed, not deployed.** The first pass (sections 1 to 8) was built 2026-11-12 and is the
branch's first commit (`90d8898`). The second pass (section 9: inscriptions on screens, reactions and gestures, invite links, a
guided minute, and a fix to the phone bar) was built 12 and 13 November and is its second commit. Brief: `casino-overhaul-prompt.md` (project docs). Base:
`origin/main`. The cube characters have their own note, `CASINO-CHARACTER-PLAN.md`.

This is what a whole-system look found, what was changed in this pass, and what was deliberately left. It is written to be read
before reviewing the diff.

## 1. What I found (verified, not taken from the brief)

- The brief's map of the code is right. Two things it understates: (a) the welcome card already signs you in (built 3 Nov), so
  "everyone ends up in the room" was mostly a matter of what surrounds the card; (b) the missions, the tournament and the Slot fan
  badge were not merely "keyed to the original five": with the new floor, four of the five machine missions could not be completed
  and the tournament ran on machines nobody could reach. That is a live fault, not a tidy-up.
- **The screen was crowded.** About twenty buttons in two bars (top right and bottom right), plus the Room and Chat buttons. On a
  phone they ran into the logo, the balance took three lines, and the jackpot pill sat on top of both (screenshots: before/after).
- **Other players moved in straight glides** between positions sent every 0.4 s, drawn 0.45 s late. That leaves 50 ms for the
  network: a later message froze the walker, then jumped them on. Measured with the page's own code (section 4).
- **Starting and stopping was instant** (full speed in one frame), for you and so for everyone watching you.
- **Graphics memory on a phone page is spread thin**: about 340 MB of textures in roughly 200 pieces, the largest group 43 MB. There
  is no single wasteful texture to remove. The main thread is not the limit either: a CPU profile of walking shows no hot spot in
  the page's code. What is left is fill rate and lights (19 lights, 6 of them casting shadows), which cannot be judged without a
  real device. So this pass adds nothing heavy and removes nothing by guesswork.
- **Each player drawn is a 163-bone skinned figure**, capped at 6 on phones. The cube characters are far cheaper, which changes
  what a busy room costs (see the character note).

## 2. What changed

| Goal | Change | Where |
| --- | --- | --- |
| Obvious on arrival | The welcome card opens with one plain line: "A free, play-money casino on Stacks testnet... Nothing here costs or pays real money." Its kicker says TESTNET · PLAY MONEY. The join step now names who is here ("Here now: bob.btc at Roulette · +2 more") before asking for anything, and its small print ends "Testnet only: every chip here is play money." | `index.html` (card text), `main.ts` (`paintIntro`, `hereLine`) |
| | The balance is a button that opens the exchange; while it is empty it reads "0 LAYR · Get chips" and pulses. | `hud.js` |
| | M opens the menu from the keyboard, which is the way to it while the mouse is held for looking around. | `hud.js` |
| Streamlined | **One bar, one menu.** The bar: back (only at a table), balance, Room, Chat, Explore/Grand hall, Menu. The Menu holds everything else in four groups (Go to, You, View and sound, Help), with a line of explanation each and the state of each setting. On a phone it is a sheet from the bottom. Every original button is still in the page with its id and handler, in a hidden holder, and each menu entry presses its original: nothing is rewired. `/casino/?hud=classic` puts the two bars back. | `hud.js` (new), two lines in `index.html` |
| Cube avatars | Humanoid cube and floating cube as player characters, with a panel, a preview, persistence and a 19-character look sent through the room. | `cube-avatars.js`, `character.js` (new), `index.html` (presence code), `main.ts`, the Worker. See `CASINO-CHARACTER-PLAN.md` |
| Multiplayer | Walkers no longer freeze and jump when a message is late: they carry on along their heading for up to 0.3 s, slowing, and the figure follows its target through a 60 ms lag that rounds corners. Every position says whether it was taken walking or standing (`s`, feature `move-still`) and stopping is reported at once, so a stop is exact and is never overshot; a player on an older cached page is drawn the old way. No extra messages while walking; two more per stop. | `index.html` (`walkFrame`, `ownMoveFrame`), `casino-room.ts`, `main.ts` |
| Movement | A short run-up and run-out (about a tenth of a second); top speeds unchanged (they are pinned to the Arcade hall's by a test in the arcade repo). The touch stick has a dead centre and a gentle curve. | `index.html` (`walkMove`, the touch stick) |
| Missions, tournament, badge | Built from the five machines on the standard floor (`FLOOR_MACHINES`), with a test that reads `machine-rotation.js` and fails if the two lists differ. Forever Twins keeps its place in the list. | `casino-machines.ts`, `casino-progress.ts`, tests |

Nothing was removed. The page (`index.html`) changed by +154 / -44 lines (the presence code for cubes and walkers, the walking
code, the card's text and three script tags); the rest is in new files (`hud.js` 16 KB, `character.js` 22 KB, `cube-avatars.js` 39 KB).

## 3. What I left alone, and why

- **The exchange and the wallet code.** The earlier feedback (balances in the exchange, a visible wait, a faucet) is already
  answered there, and `docs/WALLET-PLAYBOOK.md` is clear that wallet code is not to be tidied. Not touched.
- **Table cameras and the table controls.** Tuned on 1 Nov so the cards are never covered; rules pop-ups, in-table Stand up and the
  Guide are already in the table panel. Not touched.
- **Lights, shadows, reflections, texture sizes.** No change without a device to judge it on (section 1).
- **`/casino-b`, `/casino-c`.** Not touched.
- **Chess, betting, the Salon, the bar, the machines' own code.** Not touched.

## 4. Measurements

**Remote walkers** (the page's own walker code at 60 frames a second, fed positions as its sender sends them; a walk, a turn, a
stop, a walk back; network delay 50 ms plus the jitter shown):

| Jitter | | Frozen while walking | Fastest drawn speed (true: 3 m/s) | Biggest change of speed in one frame | Overshoot at the stop |
| --- | --- | --- | --- | --- | --- |
| 0 ms | before | 0% | 4.3 m/s | 4.3 m/s | 0 |
| | after | 0% | 4.0 | 1.5 | 0 |
| 80 ms | before | 0% | 5.1 | 4.5 | 0 |
| | after | 0% | 4.6 | 2.2 | 0 |
| 200 ms | before | 8% | 21.2 | 21.2 | 0 |
| | after | 0% | 3.9 | 1.5 | 0 |

("After" is the worse of two runs; frame timing varies a little between runs.) The cost is a slightly larger lag behind the true
position (0.08 to 0.15 m on average, from 0.05). Through the real room code, with two pages and 40 to 160 ms each way: the second
page drew the first walking, then at rest within 1 cm of where it stopped.

**Room Worker.** No new timers, no new storage reads on arrival, one profile write per saved look, two extra small messages per
stop (the stop, and the same again 0.6 s later in case the first was refused). The least gap between two moves from one connection
goes from 250 to 150 ms so a stop reported 0.26 s after a position is not refused on an uneven connection; the cap of 200 moves a
minute, which is what bounds the cost, is unchanged. The `room` message grows by the look codes of the cube players in it (at most 19 characters each).

## 5. Deploying (in this order)

1. **The room Worker first**: `npx wrangler deploy --config workers/casino-room/wrangler.toml`. It only adds things (the `look`
   and `move-still` features, `s` on a move, `lk` on a player), and an older page ignores all of them. **Not between 20:00 and
   20:30 UTC**: the tournament's machine for the day changes with this deploy (a tournament already running keeps its machine).
2. **Then the site.** A new page against the old Worker also works: it sends looks and standing marks only to a room that lists
   the features, so until the Worker is deployed everyone is simply drawn as before and nothing is saved to profiles.
3. Check `/casino/` on a desktop and a phone; `/casino/?hud=classic` is the switch if the menu misbehaves.

On the day of the Worker deploy, a player whose "play" mission for the day was a machine mission will see its machine change
(for example The Drop to Who Is Satoshi?), keeping the count they had. From the next day it is simply right.

## 6. Decisions for Jim

1. **Missions, tournament and badge from the floor's five.** This answers question 3 of `CASINO-MACHINE-MIGRATION-PLAN.md`
   differently from that plan's recommendation (a `core` flag on the original five). I chose the floor because the alternative
   leaves missions nobody can complete. If you would rather keep the original five, it is one line (`MACHINES = CORE_MACHINES` in
   `casino-progress.ts`) and one test. Players who already hold the Slot fan badge keep it.
2. **Cube size.** 1.65 m standing (a human figure is about 1.8 m). At 1.92 m a seated neighbour's head covered a third of the
   screen at a table. Cubes within 1.5 m of the camera are drawn as ghosts.
3. See also the four questions in `CASINO-CHARACTER-PLAN.md`.

## 7. Not done in this pass (in the order I would take them)

1. **A real-device pass** (iPad Air, a mid-range Android phone): frame rate and memory with and without cube players, then decide
   on lights and shadows on LITE with numbers. Everything here was verified in headless Chromium with software rendering, which is
   exact for layout, logic and draw counts and useless for frame rate.
2. **Cubes as the default body on phones** for other players (drawing everyone as a cube on LITE would cut the heaviest thing a
   phone draws). Worth trying once the real-device numbers exist.
3. ~~A first-steps coach after entering.~~ Built in the second pass (section 9).
4. **Frame textures** for the cubes, and the Classic CubeBot body. (Per-face screens: built in the second pass, as inscriptions.)
5. **`index.html` is still one 3.4 MB file.** Moving the presence and social code into their own files would make every later
   change smaller to review. Mechanical, but it touches everything, so not in a pass shared with other sessions.

## 8. How it was tested, and what was not

- Unit tests: the casino suites (rules, room, looks, moves, machines), all passing.
- The real page with the real room code in headless Chromium (two players, a late arrival, a guest, a second device).
- Desktop (1440 x 900, 1280 x 720), phone (390 x 844, touch emulated).
- **Not tested: a real iPad or phone, two real devices on a real network, real wallets (Leather, Xverse, a passkey), the deployed
  Worker.** Frame rate could not be measured at all here.

## 9. The second pass (2026-11-12): four additions and one fix

Asked for after the first pass: programmable screens showing inscriptions from the player's wallet, reactions and gestures, invite
links, and a guided minute that can be left. Nothing was removed.

| | What | Where |
| --- | --- | --- |
| Inscriptions on cubes | All six of a cube's screens, the front included, can show Xtrata inscriptions the player's wallet holds (on the front an inscription takes the place of the face), chosen in Your character and checked on the chain before the room is told. Each visitor can hide them all; one Pages variable switches the feature off. Full account: `CASINO-CHARACTER-PLAN.md`, section 8. | `casino-screens.ts`, `casino-room-screens.ts`, `functions/casino/room/screens.ts` (new); `casino-room.ts`, the Worker, `main.ts`, `cube-avatars.js`, `character.js`, `index.html` |
| Reactions and gestures | A cube wears the reaction on its face and moves to fit: twelve gestures, for the humanoid and the floating cube. Three more reactions (heart, dance, bow). `CASINO-CHARACTER-PLAN.md`, section 9. | `cube-avatars.js`, `index.html`, `casino-social.ts` |
| Invite links | The link now says who asked (`?meet=<table>&by=<address>`; the old `?meet=` links still work). The friend is told who invited them and where that player is right now (a table, a machine, walking the floor), and "Take me to them" sits them at that table or stands them a step and a half away, facing them, with a wave. When the player is not in the room, the table in the link is offered instead. On a phone the link goes to the share sheet. Also in Menu, You, "Invite a friend". | `index.html` (`inviteLink`, `invite`, the arrival bar), `hud.js` |
| A guided minute | The first time somebody walks into the room, a small card in a corner takes them through five steps: look around, walk, sit down and play, your chips, everything else. The first three finish themselves when the visitor does the thing. "Leave the tour" and "Next" are on every step (keys X and N while walking; at a table those keys are the game's, so only the buttons act). It is not a dialog: nothing waits for it and the room works under it. Once only; again from Menu, Help, "Show me around". `?tour=0` never starts it. | `tour.js` (new), `hud.js`, one getter in `index.html` |
| **Fix: the phone bar when signed in** | A signed-in player has three more things in the top bar than a guest (their level, reactions, their name on the Room button). On a 390 px phone that pushed Chat, Explore and Menu off the right edge of the screen: **a fault in the first pass**, which I had only looked at as a guest on a phone. Now on phones the name and the level's progress line are dropped and Explore moves into the menu ("Walk the floor"), and a test checks the bar at 430, 390, 375, 360 and 340 px signed in. | `hud.js` |

The page (`index.html`) changed by a further +120 / -30 lines; `tour.js` is 12 KB, and `cube-avatars.js`, `character.js` and `hud.js`
are now 59, 39 and 19 KB.

**Decision for Jim (also in the character note, section 6.5):** any still image a wallet holds is shown to everyone in the room,
unreviewed. The controls are the holder check, each visitor's own switch, and `CASINO_SCREENS_DISABLED`.

**The link carries an address.** `&by=` is the inviter's testnet address, which is public and already shown in the room. It is
only added for a signed-in player; the page takes it only when it has the shape of a Stacks address.

**Deploying the second pass (after or together with the first):**

1. **The room Worker first**: `npx wrangler deploy --config workers/casino-room/wrangler.toml` (the same command; it now also
   carries `screens`, `react-more`, the `/screens` route and `sc` on players). Not between 20:00 and 20:30 UTC, as before.
2. **Then the site** (the page, `room.js?v=p5.9`, `tour.js`, and the new Pages Function `/casino/room/screens`, which uses the
   variables the other room Functions already have: the room binding, `CASINO_ROOM_SECRET`, the Hiro key).
3. Nothing new to configure. `CASINO_SCREENS_DISABLED = "1"` (Pages) is the switch if inscriptions need turning off.
4. A new page against the old Worker: no screens section is offered, the three new reactions are not shown, everything else works.
   The new Worker against an old page: old pages ignore `sc` and show a new reaction as a thumbs-up.

**Tested** (headless Chromium, the real page and the real room code; one page at a time is all this machine holds):
408 casino unit tests (22 new). End to end: screens (see the character note), all eleven reactions between two players, invite
links (at a table, walking, not here, a table only, a bad link, your own link, the menu's entry), the tour with a real mouse and
keyboard at 1280 x 720 and with real touch events at 390 x 844 (starts once, each step finishes itself, N and X while walking and not at a table, Finish, not
again after a reload, again from the menu, `?tour=0`, typing never moves it), the phone bar at five widths. The earlier look,
keyboard and touch tests were run again.
**Not tested:** a real phone or tablet (including the share sheet, which a desktop test browser does not have), two real devices,
real wallets, real inscriptions and thumbnails from the live site, the live Hiro API, the deployed Worker and Function.
