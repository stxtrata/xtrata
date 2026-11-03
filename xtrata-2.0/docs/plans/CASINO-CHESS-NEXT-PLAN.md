# ParallaX Casino chess: material, move review, clearer pieces, and an X-Chess 2D view

Status: BUILT 2026-11-03 (chess.js `c6`, page patch step 6), all four parts, with the recommended answers to section 5:
- our own flat piece set;
- X-Chess's browns for the 2D board;
- the navy 3D board kept, with outlines and lighter, less shiny black pieces;
- material shown in the panel and on the 2D board (no "+N" plate on the 3D trays);
- every device starts in 3D, and the X-Chess view is remembered once chosen.

The 3D table spotlight (section 3, step 4) was not added: a light that switches on and off rebuilds every shader in the room, and
two lights that are always on cost every phone frame. A soft glow in the pieces' own material does that job instead. See section 6
for what was checked.

**The ask (Jim's son, after playing, 2026-11-03).**
1. Show material: the pieces each side has taken and a points score.
2. The 3D pieces are hard to make out: more contrast, clearer outlines and more defined shapes, so the board can be read at a glance.
3. A new view, **X-Chess**: a flat 2D board in the X-Chess style, with pieces shaped like chess.com's, for the easiest reading of the position.
4. The same back, forward and return buttons as X-Chess, to look through earlier moves during a game.

**Build order.** Material (1), then move review (4), then clearer 3D pieces (2), then the X-Chess view (3). Each step ships on its own
and the later ones use the earlier ones: the 2D view draws the material rows and works with review from day one. Rough size:
material small, review medium, 3D pieces medium (mostly looking and adjusting), 2D view the largest.

**Where the work goes.** Almost all of it is in `public/casino/chess.js` (to `c6`, then `c7`...). The page needs one small new patch
step, for the X-Chess view button (section 4.6), so the shared page is touched once, briefly, and the other session is told first.
Nothing changes on the room service: every feature works from moves both pages already have.

---

## 1. Material and points

**What you see.** Beside each player's name in the panel (house, two-player and watching), the pieces that player has taken, as small
glyphs grouped by kind (pawns, then knights, bishops, rooks, queen, like ♟♟♟ ♞ ♝), and **+N** on the side that is ahead, e.g.
"jim.btc ♟♟ ♝ +2". Equal material shows no number. The X-Chess view (section 4) puts the same two rows above and below its
board, as chess.com does. The 3D trays beside the board already show the taken pieces. They gain a small "+N" plate on the leading
side's tray (a sprite, hidden when level).

**How it is counted.** Pawn 1, knight 3, bishop 3, rook 5, queen 9, the usual values (chess.com uses the same). It is worked out from
the position each time it is drawn, never kept as a running total, so it can't drift, and it is right after a reload, for a watcher
who arrived mid-game, and in move review (section 2).
- Taken pieces: for each kind, the starting count minus the count on the board, never below zero (`rebuildTrays` already does
  this for the 3D trays: one shared function now serves both).
- Score: (white's points on the board) minus (black's). A promoted pawn therefore counts as a queen in the score, and is not
  shown as a "taken" piece, which is how chess.com shows it.
- End of game: the result line keeps the final material, e.g. "jim.btc wins on time · up +5".

**Code.** A pure `material(squares)` in chess.js returns `{ w: { took: [...], pts }, b: {...}, lead }`. A small node test feeds it
positions: the start, after trades, a promotion, two queens, and bare kings.

**Checks.** The node test, plus a browser check that the panel rows match `material()` for a scripted house game with captures, and
for a watcher who joins after captures.

---

## 2. Move review: back, forward and back to the game

**Like X-Chess.** X-Chess (#3051) has a Replay row: |◀ First, ◀ Back, ▶ Play, ▶ Forward, ▶| Last, "move 12 of 40", and a speed choice.
We use the same symbols and order, plus a return button. Under the moves list in the panel:

`|◀   ◀   ▶   ▶|   · Back to the game ·   move 12 of 40`

- **◀ / ▶** step one move (half-move) back or forward. **|◀ / ▶|** go to the start or the latest move.
- **Back to the game** returns to the live position. It shows only while you are looking back, and lights up gold
  ("Back to the game · your move") when it is your turn.
- Click any move in the moves list to jump to it. The move being shown is highlighted in the list.
- Keyboard (a computer): ← and → step, Home and End jump, Esc returns to the game (a second Esc stands up, as now).
- After a game ends the same row reviews the whole game, with ▶ Play (1 s a move, as X-Chess's default) for a replay.

**While reviewing.**
- Both boards (3D and the X-Chess view) show that position, with that move's last-move squares, the trays and the material for
  that moment.
- A banner over the board says "Move 12 · white played Nf3". The pieces glide between positions as they do in play.
- You can't move while reviewing. Touching one of your pieces takes you straight back to the game (chess.com does the same), so
  nobody is stuck in the past on their turn.
- New moves (the house player, the other player, or the game you're watching) still arrive. You stay where you are, the move
  sound plays, and "Back to the game" gets a dot. Clocks keep running and stay visible.

**Where the moves come from.** Every kind of game already has its moves in UCI: house games (`H.uci`), two-player games
(`S.table.g.uci`, identical on both pages) and watching (the snapshot's `m`). Positions come from XChess's own `Position`: replay from
the start, kept in a small per-move cache of FENs, so stepping is instant. A watched game over 1,000 moves sends no move list (the
existing limit), and then review shows "Only the current position is sent for very long games".

**Code.** In chess.js: a `review` state (`ply` or null), `positionAt(ply)`, the row in `view()`, `act('rv', ...)`, and `key()`
gains ← → Home End (the page already hands keys to the focused table). `paint()` draws `positionAt(review)` while reviewing.
`tapRes` returns to live on a touch while reviewing.

**Checks.**
- A house game of 20 moves: step back to every move and check each FEN matches a fresh replay.
- Go back mid-game, let the house reply, and confirm you stay put, see the dot, and "Back to the game" restores the live position.
- A two-player game in two browsers: one player reviews while the other moves, and nothing goes out of step.
- Watching (three browsers): review works for a watcher.
- Touch (iPad and phone): the buttons are at least 40 px, and touching your piece while reviewing returns to the game.

---

## 3. Clearer 3D pieces

**What is wrong now (from the code and the screenshots).**
- **The black pieces nearly vanish on the dark squares.** They are near-black (`0x15171e`) and quite metallic (0.42), and the dark
  squares are dark navy (`0x16385e`). Metal reflects the dark room, so a black piece on a dark square has almost no edge.
- **No outline.** At the distance you sit, a piece's outline is what tells you what it is. Lit from above, our pieces show a
  bright top and a dark side with no clear edge.
- **Shapes that blur.** The rook is a plain column with a lip, the queen's crown is smooth, the bishop has no mitre cut, and the
  knight's head is small and side-on. At 30-40 px a square they can blur into the pawn, the bishop and the king.

**The plan, in order (each step is checked with screenshots before the next):**

1. **An outline on every piece.** A second, slightly larger copy of each piece drawn from behind (the usual "inverted hull"),
   in a contrasting colour: dark brown on the white pieces, warm light gold on the black ones. These are the same pairing
   X-Chess uses for its glyph outlines (`#241c12` on white, light on black). The width is set in screen pixels (about 2 px, a little
   more on a phone), so it reads the same up close and from the sofa. It is cheap: the same geometry, one flat colour, no
   post-processing (the iPad's memory budget, see plan section 9, rules out full-screen effects).
2. **Black pieces that stand off the board.** Less metal (0.42 → about 0.15), a little lighter (a deep graphite, not near-black),
   and a soft rim light from the camera side, so their edge always catches some light. The white pieces become a slightly cooler
   ivory, so they don't merge with the light squares. Target: the edge of every piece at least 3:1 in brightness against both square
   colours, measured on screenshots.
3. **Shapes you can name at a glance:**
   - **Rook:** a proper crenellated top (four notches).
   - **Bishop:** a mitre slit cut across the head.
   - **Queen:** a coronet of small balls round the crown, taller than the king's body.
   - **King:** a bigger, clearer cross.
   - **Knight:** a larger head with a defined mane and ears, still turned three-quarters to you.
   - **Pawn:** stays the smallest and roundest.
   - The order of heights stays: pawn < rook < knight < bishop < queen < king.
4. **Light on the board.** A soft spotlight over each chess table while you sit there, so the pieces are lit evenly and shadows
   don't hide the dark side.
5. **If it is still hard to read:** move the dark squares from navy towards the X-Chess brown or a lighter blue. That is a look
   choice for Jim, so it isn't part of the default plan (see the decisions below).

**Checks.**
- Screenshots of the same set positions from every view (Table, Seated, Top down) on a computer, an iPad and a phone, before and
  after.
- A small script measures piece edge against square at fixed points.
- A "squint" test: the screenshot shrunk until a square is 24 px, and every piece is still nameable.
- The frame rate is checked on the iPad, since the outlines add about 32 small extra draws, which is fine.
- Jim's son is the real test.

---

## 4. The X-Chess view (2D)

**What it is.** A fourth view button at chess tables, **X-Chess**, after Table, Seated and Top down. It lays a flat 2D board over
the room, in the X-Chess style, with chess.com-like pieces. It is the clearest way to see the position, and the 3D room carries on
behind it. Choosing Table, Seated or Top down goes back to 3D. The choice is remembered in this browser (`parallax.chess.view`), so
someone who prefers 2D always gets it.

### 4.1 The look
- **Board:** X-Chess's own colours (light `#b9a98f`, dark `#6d5b46`, from #3051), a thin gold frame in the casino's style, and
  coordinates a-h and 1-8 inside the edge squares as chess.com does. Your colour is at the bottom.
- **Highlights**, matching the 3D board: last move (gold wash), selected square, legal moves (dots), captures (rings), check (red),
  and the hint (green arrow).
- **Above and below the board:** each player's name, clock and the material row from section 1 (opponent on top, you at the bottom).
- **Pieces:** flat, bold, chess.com-like shapes as SVG. White is white with a dark outline, black is dark with light inner lines, and
  each kind has a distinct silhouette that reads at 20 px. They are SVG, not text glyphs: X-Chess's Unicode glyphs depend on the
  device's font, and on iPhones they can turn into emoji, which is why X-Chess adds ︎. SVG looks the same everywhere.
- **Which piece set** is Jim's choice (decision 1). chess.com's own artwork ("Neo") is chess.com's and can't be copied. The two
  safe ways are drawing our own flat set in that familiar style, or using the open "cburnett" set (Lichess's default, also on
  Wikipedia, CC BY-SA 3.0, needs a credit line and keeps that licence).

### 4.2 Where it sits
- **Computer:** the board fills the space beside the table controls (the docked panel), as large as fits, square and centred.
- **Phone held upright:** full width, above the panel.
- **iPad:** whichever of the two fits.
- It moves when the window changes size or the panel folds. A soft dark backdrop behind it dims the room, so the board stands out.

### 4.3 Playing on it
- Tap a piece then a square, or drag a piece and drop it, with the mouse, touch or a pen.
- It uses exactly the same rules and actions as the 3D board (`select`, `isTarget`, `tryMove`, the promotion choice), so the two
  boards can't disagree. The 3D pieces move behind it too, for anyone watching you play.
- Taps are pointer events, as in the 3D board's fix (plan section 8), so the iPad's cancelled clicks don't matter.
- Move review (section 2) works the same. The board shows the reviewed position, and its |◀ ◀ ▶ ▶| row sits under the bottom
  player row as well as in the panel.
- Watching and two-player games work the same way: it is only another way of drawing the same table.
- Keyboard: ← → for review, Esc goes back to 3D.

### 4.4 What changes in the 3D room while it's open
- No looking around and no mouse capture, as in the overhead view (a drag is for the pieces). Esc first closes the X-Chess view.
- The room can draw less often behind it (only when something changes, or a few frames a second) to save phone batteries. The
  backdrop hides it anyway. This is optional; we measure first.

### 4.5 Accessibility
The board is a grid of buttons with labels ("e4, white knight"), so a screen reader can play: Tab to the board, arrow keys move
between squares, and Enter picks up or drops a piece. X-Chess does the same (role="grid"). The material rows have text versions
("White is up 2: two pawns and a bishop taken").

### 4.6 The page patch (small)
The page decides which view buttons a table has (`setTableView`'s allowed list, `refreshTableViews`). One new patch step lets a
station add its own view:
- `focus.extraViews` gives `['xchess']`;
- the X-Chess button appears after Top down;
- `setTableView('xchess')` keeps the camera on the overhead shot behind the overlay;
- free look and mouse capture stay off in that view, as for overhead;
- `chess.js?v=` is bumped.

It is anchored and idempotent like the earlier steps, and checked against the latest page on disk. The other session is told before
it is written, since it is working in the same file.

**Checks.**
- Screenshots of the view on a computer, an iPad and a phone, landscape and portrait.
- Taps and drags on the 2D board play the same moves as on the 3D board (the existing touch test, reused on the 2D board).
- A promotion, review, a two-player game and watching all work on it.
- The view is remembered after a reload. Esc goes back to 3D, then a second Esc leaves.

---

## 5. Decisions for Jim
1. **Pieces for the X-Chess view:** our own chess.com-like flat set (recommended: ours, no licence to carry), or the open cburnett
   set (familiar to Lichess players; a credit line, and it stays CC BY-SA)?
2. **2D board colours:** X-Chess's browns (recommended, it is "the X-Chess view"), or the casino's ivory and navy?
3. **3D board:** keep the navy dark squares and rely on outlines and lighter black pieces (recommended first), or also lighten the
   dark squares?
4. **Material on the 3D trays:** the small "+N" plate, or the panel only?
5. **Start the X-Chess view as the default** on phones (where 3D squares are about 38 px), or always start in 3D?

## 6. As built (2026-11-03)

- **Material:** `material(squares)` in chess.js, exported as `PXChess.material`. Node test `mat.test` covers the start, captures,
  trades, a promotion (two queens), bare kings, and black ahead. The panel shows the taken pieces and +N by each name (house,
  two-player, watching), and so does the 2D board.
- **Review:** the row is in the panel and under the 2D board. Every move in the list can be clicked, and ← → Home End work.
  - Esc leaves the review (page step 6: Esc asks the table first).
  - A touch on the board, 3D or 2D, goes back to the game.
  - For finished games, ▷ plays the moves through at one a second.
- **3D pieces:**
  - An outline on every piece (back faces pushed out 1.7 px, or 2 px on a narrow screen): dark brown on white, light gold on black.
  - Graphite black pieces with little metal, and ivory white ones, each with a soft rim light.
  - Battlements on the rook, a cut in the bishop's mitre, pearls on the queen's crown, a bigger king's cross, a bigger knight head.
- **X-Chess view:** a View button, shown at chess tables only (`extraViews`). It opens a flat board in X-Chess's colours, with our
  own SVG pieces, the player rows, material, the review row and the promotion choice.
  - Tap or drag the pieces. It uses the same moves code as the 3D board.
  - The room behind keeps the top-down shot. There is no looking around and no mouse capture while it is open.
  - Esc returns to the 3D view.
  - Each square is labelled for screen readers.
- **Page patch, step 6:**
  - the X-Chess button, and `focus.extraViews` in the view list and buttons;
  - `focus.onView`;
  - no free look or mouse capture in that view;
  - `focus.escape()` asked first on Esc;
  - `tableView` and `setView` passed to chess.js;
  - `chess.js?v=c6`.
- **Checks (headless Chrome):**
  - `features.mjs`: computer 27/27 and phone 22/22 (the phone run leaves out the keyboard checks). It covers the 2D board,
    playing on it by tap and drag, review, the material rows, Esc, and the view being remembered after a reload.
  - The earlier tests were rerun on the new pieces, and all pass:
    - touch, iPad and computer (tap, drag, illegal drop, put down, swipe to look);
    - mouse aiming, 22/22;
    - watching a game in three browsers, 14/14.
  - The touch and watching tests now touch a visible part of a piece. From a seat, the taller king in front hides the bottom of the
    e2 pawn, and the old test touched exactly there.
  - Full-quality screenshots of the Table and Seated views show the graphite black pieces standing clear of the navy squares.

