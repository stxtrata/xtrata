# ParallaX Casino: fewer NPCs, and tags that tell bots from real players

Status: plan, written 2026-10-31 for Jim. Nothing built yet. Page: `/casino` (`public/casino/index.html`); `/casino-b` unchanged.

**The ask.** Now that real players appear in the room (presence, spin replay), the room should only hold the people who have a
job there, and anyone can see at a glance who is a real person and who is a bot. Keep the croupiers, the three bots at the
Texas Hold'em table and the guest playing the fruit machine; remove the rest; give the bots name tags like real players have,
in a clearly different style.

## 1. Who is in the room today (read from the code)

| Who | Where in the page | Plan |
|---|---|---|
| Blackjack, roulette and baccarat dealers; the hosts of the PvP Hold'em and Liar's Dice tables (house waistcoats) | `XA_HOSTS.add(... livery ...)` in "the people" block | **Keep.** No tag (decision 3). |
| Greeter at the door (midnight waistcoat, waves when you walk past) | `XA_HOSTS.add({ ... role: 'greeter' ... })` and its collider in `solidsExtra` | **Remove** (decision 2). |
| Bartender at the Afterglow | `bartender = addFigure(...)`, `dedicatedBarHost = XA_HOSTS.add(...)` | **Keep** (decision 1): the bar's order screen uses him (tap him to order; `getBartender`). |
| A woman standing at the bar | `patrons`, role `bar`, at (8.8, -7.0), plus a collider | **Remove.** |
| Two people on the end bar stools | `patrons`, role `barseat` | **Remove.** Frees the stools for real players later (spots `bar.1`–`bar.4` are already reserved). |
| Three bots at Texas Hold'em: **Ace** (tight), **Mia** (loose-aggressive), **Sam** (balanced) | `figsAt(byId.holdem.group)`; names from `['You','Ace','Mia','Sam']` in the Hold'em game | **Keep, add NPC tags.** |
| The guest at one fruit machine (presses spin; his machine really runs) | `patrons`, role `machine`; `startNpcMachine(guestMachine)` | **Keep, add an NPC tag.** |
| Opponents at the PvP Hold'em and Liar's Dice tables, shown only while an on-chain match is seated | `showWhen: () => ...userData.oppSeated` | **Keep, no change.** These are real people (from the contract), not bots. A real-player tag for them is a later step. |

Nothing else wanders the floor; "patrons" is those four. No test counts them. The bar screen's `getBarGuests` simply returns
an empty list once the bar patrons are gone (to confirm on the page: ordering, serving and the expanded bar view still work).

## 2. What the tags look like

Every tag is the same pill above the head, same size and fade-out distance (16 m) as today's real-player tags, so a bot never
looks like a missing tag and a player never looks like a bot.

| | Real player (unchanged) | NPC (new) |
|---|---|---|
| Frame | gold | **cyan / steel blue** |
| Fill | dark | dark slate |
| Left of the name | nothing | a small solid **NPC** chip |
| Name | BNS name or short address, cream | the bot's name, pale blue-grey |
| Example | `jim.btc` | `[NPC] Ace` |

Names: the Hold'em bots use the names the table already shows (Ace, Mia, Sam), so the tag and the table plaque agree. The
fruit-machine guest needs a name (decision 4). Suggested: **Reel Ray**; alternatives "Lucky Lou", "Spin Doctor", or just "NPC".

A one-line key, so nobody has to guess: in the Room panel ("Gold tags are real players. Blue NPC tags are the casino's
computer players.") and in the casino guide.

## 3. When a tag shows

- **Ace, Mia, Sam:** always, except while the visitor sits at the Hold'em table (the table's own plaques show names and stacks
  then, and two labels per bot would be clutter).
- **Fruit-machine guest:** whenever he is shown. He and his tag disappear when the visitor plays that cabinet (as he does
  today) and also when a real player takes that cabinet, so a real player never stands inside him. While that real player
  is there his machine already pauses (spin replay); he comes back when they leave.
- Tags work with the room service switched off: they are part of the page, not the room.

## 4. How it is built (page only, plus one line in the room client)

1. **Remove the three bar patrons and the greeter.** Delete their entries where `patrons` is built and the greeter's
   `XA_HOSTS.add` and collider. `updatePatrons` keeps only the `machine` branch. Check `getBarGuests` callers with an empty list.
2. **One tag drawer for everyone.** The presence block's `makeTag()` / `drawTag()` gain a style (`'player'` or `'npc'`). Real
   players keep the current look exactly.
3. **NPC tags.** A small list: the three Hold'em bots and the machine guest, each with a name and the figure to follow. Each
   frame the tag sits above that figure's head (seated 1.60 m, standing 2.02 m, as the presence tags), fades with distance, and
   hides under the rules in section 3. Built after the Adrian figures exist; if a figure is missing, its tag is skipped.
4. **Guest yields to a real player.** When the room lists someone at the guest's cabinet (`machineSpot(guestMachine)`), hide
   the guest figure and tag; show them again when the spot is free.
5. **The key.** One more fact line in the Room panel (`src/casino-room/main.ts`, rebuild `room.js` and bump its `?v=`), and one
   line in the casino guide.

Size: about 120 lines in the page, a few in the client. No room Worker change and no new deploy order.

## 5. Checks

- Page script parses, no new unresolved names (the checks used for spin replay); existing casino tests pass.
- By eye, desktop and iPad: the bar and the door are empty; the croupiers and bartender are there; Ace, Mia, Sam and the guest
  carry blue NPC tags; a real player's tag is gold. Ordering at the bar still works. Sit at Hold'em: the bot tags hide.
  Have a second device sit at the guest's cabinet: the guest steps out, his tag goes, the real player's gold tag shows.
- Frame rate on the iPad: four extra tags are four small sprites, so no measurable cost; three fewer figures is a small saving.

## 6. Decisions for Jim

1. **Bartender:** keep (recommended; the bar's ordering uses him) or remove (then the bar needs another way to order)?
2. **Greeter at the door:** remove (as asked) or keep as staff?
3. **Croupiers and bartender:** no tag (recommended; the waistcoats already say "staff"), or a third tag style ("Dealer",
   "Bartender") in grey?
4. **Name for the fruit-machine guest:** Reel Ray, Lucky Lou, Spin Doctor, or plain "NPC"?
5. **Tag colour for bots:** cyan/steel blue (recommended), or another colour?
