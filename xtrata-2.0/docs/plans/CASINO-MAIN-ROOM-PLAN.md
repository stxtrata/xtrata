# ParallaX Casino: a main room for side-by-side games, bots only in the Salon

Status: plan written 2026-11-01. Step 1 (the people) built 2026-11-02 with Jim's changes, see section 0; the new game and the Salon move are not built. Page: `/casino` (`public/casino/index.html`); `/casino-b` unchanged.
Replaces `CASINO-NPC-TAGS-PLAN.md` sections 1 and 4.1 (who stays in the room); its tag design still applies to the bots that stay.

**The ask.** The main room keeps the fruit machines and the games several people can play side by side. Texas Hold'em, poker in
general and the player-versus-player games live in the Salon, where players can still play bots. The main room's only people are
the dealers at their tables and the bartender behind the bar: no Hold'em bots, nobody at the bar, nobody playing a machine.

## 0. Built 2026-11-02 (Jim: "remove them all apart from the staff", keep the greeter, Hold'em out of the main room)

- **Gone:** the Texas Hold'em table and its three bots (Ace, Mia, Sam) from the main room, with its rug and welcome button; the woman
  at the bar and the two people on the bar stools; the man playing a machine (his cabinet no longer shows IN USE, so all ten are
  free); the "house regulars" a later change had added (Mia, Sam and Ace standing at machines when the room was quiet; `?regulars=1`
  still shows them, for trying).
- **Stay:** the blackjack, roulette and baccarat dealers, the greeter, the bartender, the two Salon hosts, and the Salon opponents
  (real players, shown during a match).
- **Hold'em with bots** is not played anywhere for now. Its code is still in the page (`makeHoldem`), ready to move into the Salon
  (section 3) if wanted.
- **Room:** the daily mission "Play 5 hands of Hold'em" became "Play 5 hands at any table", in the same place in the list, so
  nobody else's missions change. Needs the room Worker deployed.
- Its spot (right of the room, where the table stood) is empty marble until the replacement is chosen (section 2, or section 8).

## 1. Who and what was in the main room (read from the code, before step 1) (read from the code)

| What | Where | Plan |
|---|---|---|
| Texas Hold'em table (you plus three bots, Ace, Mia and Sam), at (6.6, -2.6) on the right of the room | `makeHoldem()`, `placement.holdem`, its two stools, three bot figures (`figsAt(byId.holdem.group)`) | **Moves to the Salon** (section 3). A new game takes its place (section 2). |
| Dealers at blackjack, roulette and baccarat | `XA_HOSTS.add(... livery ...)` | **Stay.** |
| Bartender | `bartender`, `dedicatedBarHost` (the bar's order screen uses him) | **Stays.** |
| Greeter by the door, waving | `XA_HOSTS.add({ role: 'greeter' })` and its collider | **Goes.** |
| A woman standing at the bar, two people on the end bar stools | `patrons`, roles `bar` and `barseat` | **Go.** The four bar stools are then free for real players (spots `bar.1` to `bar.4` exist). |
| The guest playing one fruit machine (his cabinet runs by itself and shows IN USE) | `patrons`, role `machine`; `guestMachine`; `startNpcMachine()` | **Goes.** His cabinet becomes playable, so all ten are free. |
| Video poker (a cabinet, no dealer) | `makeVideoPoker()` | **Stays.** |

Everything in the Salon stays: its two hosts, the Salon Hold'em and Liar's Dice tables, and the opponent figures shown during a
match.

## 2. What replaces Hold'em in the main room

"Side by side" here means several people at one table at once, each betting against the house, as at roulette and baccarat
today. Those two already run **shared rounds** through the room (everyone at the table sees the same number or cards, with a
committed result: `functions/lib/casino-rounds.ts`), so the new game should be one that can join them.

| Game | What it is | Fit | Work |
|---|---|---|---|
| **Sic Bo (recommended)** | Three dice shaken under a glass dome; bet Big or Small, totals, doubles, triples, single numbers | Shared round, like roulette: one roll for the whole table. Fast, easy to learn, very social. Something the room does not have: dice for the house, cards at blackjack and baccarat, a wheel at roulette | New table with a betting layout, a dome and three dice (the Liar's Dice dice can be reused), payouts. Room: a third shared-round table (dice from the round's seed, bet keys, timing). About 500 lines in the page, 60 in the room |
| Three Card Poker | You and the dealer get three cards; Ante, Play, Pair Plus | Keeps a poker table in the main room, played against the dealer rather than bots. Each player has their own hand (like blackjack), not a shared round | New table, the poker hand ranking (the Hold'em code has one), dealer qualifying. About 450 lines in the page, no room change |
| Money wheel (Big Six) | A tall upright wheel; bet on the symbol it stops on | Shared round; the simplest of all to play | Cheapest to build, but it is a second wheel next to roulette |
| Craps | The classic dice table | Very social, but the rules are long and the table is large | The most work, and the hardest to learn on a phone |

Dragon Tiger was ruled out: it plays almost exactly like baccarat, which is already there.

The new table keeps the Hold'em table's place, its two seats and its stools, and gets a dealer in a house waistcoat (a new
livery colour). Spots in the room: `sicbo.1` and `sicbo.2` (or the id of the game chosen).

## 3. Hold'em with bots moves to the Salon

**Recommended: move the existing table as it is.** The four-handed game (you plus Ace, Mia and Sam, fixed limit) is unchanged,
and so are its bots. Only its place changes: it becomes the Salon's third table. The Salon's inner box is 10.4 m by 9 m (x -11.2
to -0.8, z -20 to -11). The two tables there now sit side by side at z = -16, so:

- Salon Hold'em and Liar's Dice move forward to z = -14.6 (still about 2 m clear in front of the arch).
- The bot Hold'em table goes at the back, in the middle, at about (-6, -18.2). Its dealer stands just in front of the back wall.
- The layout is checked from the camera views and by walking it before anything else is built on it. If it is too tight, the
  fallback is option B below.

**Option B (later, bigger):** Salon Hold'em gets an "Add bots" choice that fills empty seats with one to three bots. The Salon
Hold'em code is written for two players, the way the contract plays, so this means a new multi-player game there. Not
recommended now.

**The Salon's rule applies to it:** you need a BNS name to go into the Salon (decision 2 of the Salon plan), so the bot table
needs a name too, unless Jim wants to change that (decision 3 below).

## 4. What changes, file by file

**Page (`public/casino/index.html`):**
1. Remove the greeter, the three bar patrons and the machine guest: their figures, colliders, `startNpcMachine(guestMachine)`, the
   cabinet's `occupied` flag (the cabinet becomes free), and `updatePatrons`. The bar screen's `getBarGuests` gets an empty list.
   Check that ordering and the expanded bar view still work.
2. Move `holdem` to the Salon: `placement`, its stools and its sign; the Salon tables' new places; the Salon colliders. Its bots
   stay with it. The camera presets that point at the Salon are moved to match.
3. Add the new game (`makeSicBo()` or the one chosen), with its dresser, sign, two seats, dealer, help text and round log hooks.
4. Every list of games: the welcome panel's table buttons ("Texas Hold'em, three opponents" becomes the new game; a "Hold'em vs
   bots" button joins the Salon buttons), the table menu, `VERB`, `TAGS`, `SEATS`, `?meet=` links, the casino guide, the page
   description ("ten fruit machines", unchanged).
5. The Salon door from the Salon plan covers the moved table: `setFocus` refuses `holdem` too without a name.

**Room (`functions/lib/casino-room.ts`, `casino-social.ts`, `casino-rounds.ts`, `casino-progress.ts`):**
1. `SPOTS`: add the new game's two spots; `holdem.1` and `holdem.2` stay (the table keeps its id) but count as Salon spots
   (`isSalonSpot`), so the room refuses them without a name.
2. For Sic Bo: a third shared-round table (`ROUND_TABLES`, timing, bet keys, the three dice from the seed), with the same commit and
   reveal checks the other two have.
3. Missions: "Play 5 hands of Hold'em" stays (it is still played), and "5 rounds of Sic Bo" is added to the list.
4. Tests that sit at `holdem.*` without a name (the room unit tests, the end-to-end idle test, `scripts/test-casino-together.mjs`)
   move to the new game's spots.

**Room client (`src/casino-room/main.ts`):** the shared-round code learns the new table (Sic Bo only). Rebuild `room.js`, bump `?v=`.

Deploy order as before: the room Worker first, then the site.

## 5. Checks

- Unit tests for the new round table (seed to dice, payouts, bet keys); the existing room, social, progress and wallet suites; the
  end-to-end suite against a local room.
- The real page in a browser: the Adrians load; the main room has exactly the three dealers, the new game's dealer and the
  bartender; no greeter, no bar guests; all ten cabinets playable; the new game plays a round with two players seeing the same
  roll; the bot Hold'em table plays a hand in the Salon; the Salon still closes without a name and opens with one; walking
  around all three Salon tables works; ordering at the bar works; no page errors.
- Pictures of the main room and the Salon from the overview cameras, for Jim to look at.
- By eye on the iPad (Jim): frame rate should be a little better, with six fewer people drawn.

## 6. Order of work

1. Finish and ship the Salon door (the BNS rule), already built and in testing.
2. This plan, in one change: people out, Hold'em into the Salon, the new game in.
   The people removal (step 1 in section 4) can ship on its own first, if Jim wants the quiet room sooner.

## 7. Decisions for Jim

1. **The new game:** Sic Bo (recommended), Three Card Poker, money wheel, or craps?
2. **Hold'em with bots:** move the table into the Salon as a third table (recommended), or option B (bots at the Salon Hold'em
   table, more work)?
3. **The bot table and the BNS rule:** the whole Salon needs a name, so practising against the bots does too (as decided for the
   Salon). Keep that, or let anyone play the bot table?
4. **NPC tags** (from the earlier plan): give Ace, Mia and Sam a blue NPC tag in the Salon (recommended), or no tags?
5. **The greeter:** remove (as asked: "just the dealers and the bartender"), or keep him as staff by the door?
6. **Ship the people removal first**, on its own, or all together?

## 8. More fruit machines: making room

The room is 26 m by 22 m. Each machine design has two cabinets, one on each side wall, 3.4 m apart; five designs fill five bays a
side. Ways to add more, simplest first:

| Option | Room for | Work |
|---|---|---|
| **A. One more bay by the entrance** | 1 more design (2 cabinets) | Small: a sixth position on each side wall near the front door (where the earlier Plebs & Legends attempt went). No change to the room's shape |
| **B. A machine island in the empty Hold'em spot** | 4 to 6 cabinets, back to back | Small to medium: a new layout for cabinets in the middle of the floor (today they only stand against walls); colliders and camera views for it. Uses the space instead of a new table |
| **C. A slot hall: a new wing through an arch, like the Salon** | 10 to 16 cabinets | Medium: the Salon's build (an arch in a wall, an inner box with its own walls, floor, lights and colliders) is already written and can be reused. The main room is untouched. Best fit for the 15-machine series |
| **D. Stretch the whole room** | as many as wanted | Largest: the size is two numbers, but about 30 positions are written in by hand (walls, columns, wall lights, the door, the greeter, camera views, colliders), and each has to be moved and checked |

Every new design adds its game to the page (about 2 MB each; the page is about 24 MB now) and its spots to the room service
(`SPOTS`, the `MACH` list), and a phone or iPad holds one more idle screen in memory. More cabinets of an existing design cost
almost nothing. Suggested: A or B for the next one or two designs; C if the series is going to grow.
