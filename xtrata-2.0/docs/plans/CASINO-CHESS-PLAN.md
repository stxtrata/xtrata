# ParallaX Casino: chess at the lounge sofas, powered by XChess

Status: BUILT 2026-11-02 (watching added the same day, section 7), not deployed. Page: `/casino` (`public/casino/index.html` + `public/casino/chess.js`). Room Worker
change needed for player-against-player only (house games work without it).

**The ask (Jim, 2026-11-02).** Playable XChess-powered chessboards on the tables by each sofa: challenge one of the built-in house
players, or another player in the room. Use XChess or parts of it if simple enough, otherwise a dedicated casino engine.

## 1. Decision: XChess's own engine, not a new one

XChess's house engine is inscription **#3049** on Xtrata (`XChessHouseEngine`, `xchess-house-engine-1.1.0`, 25,170 bytes,
SHA-256 `10622134e974b4c3505d2ed935d009647fba0d7c14a72acae6d913036af814ec`). It is one self-contained script with no DOM:

| Part of #3049 | Used for |
| --- | --- |
| `Position` (FEN, legal moves, SAN, check, mate, stalemate, repetition, fifty moves, insufficient material, PGN) | every rule at the table, both kinds of game |
| `PROFILES` (Gambit, Ledger, Mason, Wager, Plumb, Oblique, Fathom, Cadence, Bulwark, Canon) | the ten house players |
| `choose(profile, history, seed, startFen, 'replay-v3')` | the house players' moves (deterministic for a seed; a capped 6,000-node search) |
| `verifyArchive(xchess-house-archive-v1)` | after every house game, the whole game is replayed and each house move compared |
| the events `resgn`, `draw?`, `draw!` | resign and draw offers between players |

The XChess *match contract* (`xchess-browser-house-v2`: mainnet STX deposits, executors, leases) is not used: far too heavy for a
coffee table. Nothing in chess.js re-implements chess.

**Loading.** chess.js fetches `/i/3049` (the inscription, same origin, immutable cache) and checks its SHA-256 against the pinned
hash before running it; if that fails it loads the byte-identical copy `public/casino/xchess-engine-3049.js` (same check). The
search runs in a Web Worker made from the engine's own source, so the room never stutters; without Workers it runs on the page.

## 2. What is in the room

- **Two chess tables**, `chess1` (west lounge, sofa at -8.1, 8.1) and `chess2` (east lounge, 8.1, 8.1). The round coffee table moves
  0.4 m closer to the sofa (centre 1.25 m in front, radius 0.5) to make room for a **velvet armchair** across it; the two glasses move
  to the table's edge. Board: 0.45 m, ivory and navy squares in a gold frame, coordinates on the frame; Staunton-style pieces in ivory
  and obsidian with gold collars; knights turned three-quarters so they read from the seat.
- **Seats** (room spots): `.1` the sofa, `.2` the armchair. Sitting works from the floor (walk up, PLAY) and from the guide.
  The board turns so your colour is on your side, whichever seat you take.
- **Playing:** tap a piece, then a glowing square (blue dot = move, orange ring = capture). The selected piece lifts. Last move in
  gold, a king in check in red. Promotion asks Q / R / B / N. Captured pieces line up beside the board.
- **Cameras:** Table (over your shoulder), Seated (eyes), Top down, from whichever side you sit. On a phone held upright the camera
  comes in steep so the board spans the screen (about 38 px a square at your end).

### House games (free)

Pick a house player (shown weakest to strongest, with their XChess style and your W/D/L against them in this browser) and a colour
(White, Black, Random), then Play. The house player sits in the armchair (or on the sofa, if you took the armchair) while you play.
Hint asks Canon for a move and shows it for five seconds. An unfinished game carries on after a reload or a walk round the room.
At the end the panel shows the XChess check, e.g. "✓ every move Wager made (7) matches engine #3049 for this game's seed", and
"Copy game" puts the PGN (with the engine and seed) on the clipboard.

House games carry **no LAYR stake**: the house players are deterministic and only search 2–3 plies, so a paying bot table would be
farmed. They are play for practice and fun.

### Player against player

Uses the Salon's lobby and relay unchanged (`makeSalonLobby`, `PvpCore.makeRelayChain`): "Find a player" puts you on the room's
waiting list; anyone else at that table sees "Play jim.btc · friendly" (or the stake) and can take you on. The one who waited hosts
the blocks (1.5 s for chess, 3 s at the Salon); each move is an `act` call both pages apply to their own copy (`makeRelayTable` in
chess.js), so they stay identical. Colours are drawn by the host. **10 minutes each plus 3 seconds a move**, kept from the host's
block times; the host calls the flag. Resign, offer a draw, accept a draw. **Friendly, 1,000 or 10,000 LAYR**; the winner takes both
stakes, a draw returns them. Leaving or a broken connection voids the game and returns stakes (the lobby's existing rule).

## 3. Files

| File | Change |
| --- | --- |
| `public/casino/chess.js` | new: engine loader and worker, relay table and session, board and pieces, the two stations |
| `public/casino/xchess-engine-3049.js` | new: byte-identical copy of inscription #3049 (fallback) |
| `public/casino/index.html` | 18 small hooks, applied by anchor (see section 5): loads chess.js; coffee table and glasses; adds the two stations, their placement, signs, seats, verb; no stools at them; a station without dressing; the house player figures; clicks on a focused table's board; a station's own camera framing (`camFor`) and frame centre; the station's own rules sheet; the lobby makes chess sessions on 1.5 s blocks |
| `functions/lib/casino-room.ts` | `SPOTS`: `chess1.1`, `chess1.2`, `chess2.1`, `chess2.2` |
| `functions/lib/casino-social.ts` | `CHESS_TABLES`; chess tables in `TABLES` (table chat, watching); `seek` accepts chess tables and stake 0 there; at chess tables signing in is enough (no BNS name) for waiting, the waiting list and the relay. The Salon's rule is unchanged: a relay message is only exempt when it names a chess table, and the Salon tables ignore messages not addressed to them |
| `functions/lib/__tests__/casino-room-chess.test.ts` | new: the rules above |
| `functions/lib/__tests__/casino-room-spots.test.ts` | also reads chess.js's seats |

## 4. Checks done (2026-11-02, headless Chrome on the real page)

- Engine loads from `/i/3049`, hash verified, runs in the Worker.
- A house game played by clicking the 3D board (desktop 1440×900) and by tapping (phone 390×844): each move answered by the house
  player; reload resumes the same game; resignation; the XChess check passes ("engineCompliant").
- Two players in two browsers through a fake room: wait, join, colours drawn, Fool's Mate played by clicks on both boards; both pages
  identical and both see checkmate; a second game drawn by agreement. Black's page shows the board from black's side.
- Relay table rules (node): wrong player, out of turn, illegal move, promotion needs a piece, draw offer withdrawn by a move, cannot
  accept your own offer, time runs out, resignation.
- Every other table still opens and plays; no page errors.
- Not checked: a real iPad (frame rate with two boards), real wallets and the live room (needs the Worker deployed).

## 5. Applying to a newer page

`index.html` is edited by other work all the time, so the hooks are applied by anchor: `scripts/patch-casino-chess.py
public/casino/index.html` (idempotent; it stops if any anchor is missing or appears twice). Deploy order for player against player:
the room Worker first, then the site.

## 6. Decisions for Jim

1. **No BNS name for chess** (main room, signing in is enough), as built. Or keep the Salon's rule for chess too?
2. **House games are free.** A paying bot table would be beaten by anyone who learns the house players' lines.
3. **Stakes for player against player:** friendly, 1,000 or 10,000 LAYR. Other amounts?
4. **Watching:** built (section 7). Anyone at or near the table sees the game live, guests included.
5. **Missions:** chess does not count towards "Play 5 hands at any table". Should a finished game count?

## 7. Watching a game (added 2026-11-02)

Jim: "people watching should be able to also see it being played live". The two players' moves already travel through the room, but
the Salon relay sends them to one address (the opponent). Chess has no hidden information, so the game can go to the whole table.

**How it travels.** The host of a game (the player who waited) sends a **snapshot** after every move, when asked, and every 15 s:
the position (FEN), every move packed into two characters each (from and to square in a 64-letter alphabet, a mark after a
promotion), the last move, both clocks, the stake, a draw offer and the result. About 150 bytes plus 2 per move; a game too long for
one message (over 500 moves) sends the position only. The room passes it to everyone **sitting at or watching that table** (the room
already knows: a person counts as watching when sat there or walking within 3.2 m, the same audience as table chat), guests who may
see the room included, never to other tables, and never between people who have blocked each other. Someone who arrives mid-game
asks; the room passes the ask to the players seated there, and the host answers at once.

**What a watcher sees.** The 3D board on that table shows the live game on their own page: pieces move, last move and check are
marked. Walking past shows a note at the top, "♟ alice.btc vs bob.btc · tap the table to watch". Clicking the table while two other
people play there puts you **beside the table** (a standing place the room never counts as a seat), looking across the board, with
a panel showing both players, both clocks counting down, the moves and the result. A watcher's clicks never move anything.

**Trust.** The room only takes snapshots from someone seated at that table. Each watcher's page replays the moves with XChess and
uses them only if they reach the position sent; otherwise it shows the position alone. A dishonest player could only mislead
watchers, never the opponent (whose own copy of the game is the truth).

| File | Change |
| --- | --- |
| `functions/lib/casino-social.ts` | `spec` message (snapshot or ask, chess tables only, at most 1,500 bytes); `routeSpec`; feature `spec`; limits: snapshots 40 in 10 s, asks one every 2 s and 10 a minute |
| `workers/casino-room/index.ts` | routes `spec` with its own limits, beside the other social messages |
| `src/casino-room/main.ts` → `public/casino/room.js` | lets `spec` through both ways; a guest may ask. Rebuilt with `npm run build:casino-room` (the rebuild of the unchanged source was byte-identical first) |
| `public/casino/chess.js` | snapshots, watching, the standing place, the note (`c2`) |
| `public/casino/index.html` | step 2 of the patch script: room hooks for chess.js, `spec` to chess.js, `PXRoomHost.taken()`, the standing place in `setFocus`, `chess.js?v=c2`, `room.js?v=p5.3` |
| `functions/lib/__tests__/casino-room-chess.test.ts` | six more tests (parsing, audience, who may send, asks, limits, blocking) |

**Checked:** the room suites (266 tests); three browsers through a stand-in room running the real routing (`routeSpec`,
`routeRelay`, `applySeek`): two players and a guest watcher, who is not given a seat, asks and catches up, sees every move and the
checkmate with clocks, cannot move pieces, sees the next game while walking past (with the note), and catches up again after a
reload. Not checked: the live room (deploy the Worker first) and real phones.

## 8. Touch, pen and mouse: tap or drag the pieces (added 2026-11-03)

Jim, after the first real game (iPad against the Mac): the iPad, playing white, could not select a piece or a square, and from the seat
the squares are hard to see; tap the pieces themselves, and ideally grab and move them.

**Why the iPad failed.** The board listened for `click`. While walking, the room cancels every touch at its end (`endTouch` calls
`preventDefault` so a tap never scrolls the page), and on iOS a cancelled touch never makes a click. Sitting down by walking up leaves
the page in walking mode, so taps never reached the board. The Mac used a real mouse click. The first tests sat down from the overview,
where the click gets through, so they missed it; `touch.mjs` now walks up and sits first, and reproduced the failure.

**What changed (all in `chess.js`, `c3`).**
- The board takes **pointer events** (touch, pen and mouse alike) on the room's canvas, added once, after the page's own listeners. The
  page's click is still swallowed when it repeats a tap already handled.
- **Pieces, not squares:** a press is read in the order you see it: the piece actually drawn under the finger (its head counts, even
  where it overlaps the square behind), else the board square, else (a near miss on a slim piece) the piece whose upright centre line
  passes within half a square. Your piece is picked up; an enemy piece you may capture is taken; a destination square moves there.
- **Two cases found in testing, where a piece stands in front of where you aimed:** the piece you are holding is lifted, so its head
  covers the near part of the square in front of it: a destination there wins over putting the piece down. And an enemy piece you
  cannot take (say a knight in front of the pawn your queen can capture) means nothing to tap, so the destination behind it counts.
- **Tap then tap, or drag:** press one of your pieces and it is picked up (its moves show); tap a destination, or drag: the piece lifts
  and follows the finger, the square under it lights when it is a legal destination, and letting go there makes the move (in a game
  against a player it waits on that square while the move is sent). An illegal drop glides back. Tapping the held piece puts it down.
- **Easier to see and hit:** squares 5.8 cm (board 51 cm, was 45), move dots and capture rings larger, the Seated view 15 cm higher;
  on desktop a hand cursor over your pieces and a small lift on hover.
- While you sit at a chess table the canvas takes `touch-action: none` (no page pan, zoom or press menu), restored when you leave.

**Checked:** iPad-sized touch screen (1180×820), desktop mouse (1440×900) and phone (390×844), each walking up and sitting: tap the
pawn then a square, tap the knight by its head, drag the bishop, an illegal drop, tap a piece twice, capture by tapping the enemy piece,
and more moves played by tapping only. The two-player and watching tests pass with every move made by clicking pieces (the watcher sees
the queen take on f7 behind the knight on f6, mate).

## 9. Seats, looking around, and the iPad board (added 2026-11-03)

Jim, after a three-device test (Mac white, iPad black, iPhone watching): it works; the sofa player sat inside the sofa; seated or
standing at any table you should be free to look around (except the overhead view); and on the iPad the board's squares were black.

**Seats.** The room's seated figures are built for a 0.57 m bar stool, and the sofa's cushion is at 0.71 m, so the sofa player sank
15 cm into it, sitting deep enough that the shins went inside the sofa's front. Now:
- The two lounge sofas stand **15 cm further back** (`chess.js` says where; the page draws them there); the coffee table and the
  armchair stay where they were.
- A seat can say how high it is (`h`): the sofa 0.70 m, the armchair 0.50 m. Seated figures (other players, your own figure in the
  behind view, the house player) are raised or lowered to it.
- The sofa place is near the cushion's front edge (the stool pose has the legs straight down from the knee), so the feet are on the
  floor in front of the sofa, with about 20 cm to the table.

**Looking around (every table).** Seated or standing, drag the room to turn your view, with touch or the mouse; it eases. Choosing a
view (Table, Seated) again re-centres it, and sitting somewhere else starts centred. The overhead view stays put. At the chess table
a press on one of your pieces still picks it up and drags it; a drag that starts anywhere else looks around, and is never also a tap
(nothing is selected or moved). While you look away, the picture is not shifted to keep the felt clear of the controls. While you
sit anywhere, the browser may not pan or zoom the page under your finger. A tip says so the first time you sit.

**The iPad board.** iPad Safari has a fixed budget for the drawing canvases a page makes, and the room already spends most of it,
so the board's 1024 px painted texture came out empty: a black board (pieces, frame and highlights, which use no canvas, showed).
The squares are now **64 tiles** (two meshes), with a thin gold line round them; only the coordinates are painted, on a small canvas
that is turned into an image at once, giving its canvas memory back.

Files: `public/casino/chess.js` (`c4`), and step 4 of `scripts/patch-casino-chess.py` for `public/casino/index.html` (the sofa
positions, seat heights for seated figures, the look, touch handling while seated).


## 10. Look direction, mouse aiming, and who is that (added 2026-11-03)

**The look turns the way walking does.** Step 4's drag moved the view like grabbing the room (drag right, the room went right and
you looked left). Jim: keep it as walking. Now a drag right looks right and a drag up looks up, with walking's own speeds
(`WALK.drag` for the mouse, `WALK.touchLook` for touch), at every table.

**Mouse aiming at a chess table (a computer).** A click on the room (not the board, not the panel) captures the mouse, as walking
does. The mouse then looks around (walking's `WALK.look`), a dot marks the middle of the screen, and it rings gold when it is on one
of your pieces or a square you can move to. A click picks up (or moves to) whatever the dot is on; holding the button on a piece and
turning the view carries the piece, and letting go over a square plays it. While the mouse is captured the picture holds still (the
felt is not re-fitted beside the panel), so what is under the dot stays there. Esc gives the cursor back for the panel and stays at
the table; a second Esc leaves. Standing up keeps the captured mouse for walking; sitting at another table gives it back; the
overhead view never captures. chess.js does the aiming (every press, move and release is at the middle while the mouse is captured,
and how far the mouse moved since the press decides drag or click); the page does the capturing, the look and the dot.
Not on touch screens, which have no mouse to capture.

**Who is that.** A click or tap on another player (their figure, or their name tag when it shows within 16 m) opens their menu in
chat: their BNS name, and their full address twice, each with Copy: the testnet `ST…` address the casino plays with, and the mainnet
`SP…` address of the same key. BNS names live on mainnet and the Salon looks a player's name up on that mainnet address, so a BNS
name for the Salon is sent to the `SP…` address. The same menu opens from a name in chat or in Here now, keeps Message, Block and
Report, and shows even when chat is hidden. Your own address (both) is in the Room panel. It works walking (mouse, captured mouse,
touch), seated at a table, and at a chess table with the mouse captured (the player under the dot). From the overview a click on a
table still sits you there. House regulars are not players (no address) and open nothing. Without room.js the page copies the
address and says so. The LAYR dispenser's short wallet address copies the whole one when tapped.

Files: `public/casino/chess.js` (`c5`); step 5 of `scripts/patch-casino-chess.py`; `scripts/patch-casino-people.py` (run after it);
`src/casino-room/address-card.ts` (new), `chat.ts` and `main.ts`, built into `public/casino/room.js` (`p6`).
