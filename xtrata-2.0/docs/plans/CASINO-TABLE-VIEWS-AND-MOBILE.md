# ParallaX Casino: keeping the cards in view, and lighter graphics on phones and tablets

Written 2026-11-01. **Status: BUILT 2026-11-01**, checked with `scripts/check-table-views.mjs` (every table, every view,
desktop and phone, with a hand dealt). The iPad fixes still need a check on a real iPad.

Jim (2026-11-01): "View of the cards is the most precious thing in every view... make sure that we have the control section
minimized enough that it never obscures the view of the table or the cards", and: "this screenshot is from my iPad that often
does this where all characters and some screens turn black... the mobile app needs some serious performance enhancing".

## 1. What was wrong (baseline screenshots, desktop 1440x900 and phone 390x844)

- The table controls were a sheet across the bottom middle of the screen: 245 px tall at blackjack, **592 px at roulette**
  (two thirds of a laptop screen; the roulette table was all but hidden). On a phone the roulette sheet was 540 of 844 px.
- The cameras were aimed for a full screen, so the felt sat behind the sheet.
- In the seated and behind views at the poker tables, your own stack plate ("You · $196") sat on top of your cards.
- On the phone: the video poker sheet repeated the whole paytable (also on the machine); baccarat's bead road and the
  view buttons (two rows) took space for little use.

## 2. What changed (all in `public/casino/index.html`)

| Where | What |
| --- | --- |
| Wide screens (width ≥ 900 and wider than 1.25:1; `body.pxdock`) | The controls stand in a **column on the right** (330-390 px wide, hugging the bottom, scrolling, with the action buttons pinned at its foot). |
| Roulette in the column | The betting layout **stands up the way it does on a real table** (zero at the top, 2:1 at the bottom, dozens and even-money bets down the side). |
| Narrow screens | The sheet stays at the bottom, made shorter: one sideways-scrolling row of view buttons, no game name, smaller notes, compact player boxes, roulette's call bets in one row, a smaller bead road, the video poker paytable folded. |
| Every screen | `measureFrameFit()` / `applyFrameFit()`: the picture is shifted (`camera.setViewOffset`) so the **felt's centre sits in the middle of the space the controls leave free**, and widened a little (`zoom`) so the felt fits there. Eased, measured every 10 frames. Overhead views size the field of view to the free space's shape. |
| ▾ Hide / ▴ Show | A button in the view row folds the controls down to the message and the action buttons. On narrow screens, while bets are locked (cards being dealt, the wheel spinning), the chips and the betting board fold away by themselves (`#panel.busy`). |
| Behind-you view at tables | Camera closer (1.0 m back, 2.1 m up, over the right shoulder); at the roulette and video poker pads further to the side and higher, so your own body does not cover the layout. |
| First-person table view | A little closer in the column layout; backs off less on portrait screens. |
| Poker tables | Your own stack plate is on camera layer 2, hidden in the seated and behind views (the panel shows your stack). |

Test hooks: `window.__casinoView.table` (`sit`, `view`, `act`, `chip`, `setView`, `snap`, `fit`, `panel`, `gl`).

## 3. Phones and tablets (LITE: touch devices; `?lite=0` / `?lite=1` force it)

Measured on the desktop page (`__casinoView.table.gl`): about 360 MB of textures, ~2,300 draw calls a frame, 6 shadow-casting
lights (each draws the room again into its shadow map) and the planar floor reflection (the whole room drawn a second time).

- **Black faces and hands on iPad:** the figures' textures were made with `createImageBitmap`, which on WebKit (every
  iPad/iPhone browser) can come out black under memory pressure. They are now `<img>` elements (as three.js's own GLTFLoader
  does on Safari).
- LITE: the floor reflection starts off (Ambience panel can turn it on); shadow maps redraw every fourth frame; no texture
  larger than 1024 px (scaled once loaded, kept as an image, not a canvas); the screen drawn at most at 1.5x CSS pixels (was 2x),
  lower still when the frame rate drops (the existing adaptive step). The machine screens were already drawn at half size on
  touch devices (2026-10-31).
- Phone page (390x844, LITE): ~900-1,000 draw calls, reflection off, ~250 MB of textures before the 1024 px cap applies.

## 4. How to check

`CHROME_PATH=<chrome> SIZES=desktop,phone,tablet node scripts/check-table-views.mjs <out-dir>` (ONLY=blackjack,roulette to
narrow it; GL=1 prints the graphics numbers). It plays a hand at each table at a tiny size (the software renderer is slow),
then takes each view at full size. Look at the screenshots: the cards and the felt must be clear of the controls.
