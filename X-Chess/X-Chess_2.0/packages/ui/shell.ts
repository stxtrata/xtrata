import { SCALE_CSS } from './pieces.js';

// The markup and the styling, as strings.
//
// Strings rather than a template library, because the inscription carries every
// byte of whatever produces this and a library would cost more than the markup.
//
// Two rules learned the hard way, and both are enforced by tests:
//
//   NEVER STYLE A BARE STATUS WORD. `.notice info` already meant an info-level
//   message; adding a `.info` rule for icons gave every notice the icon's
//   inline-flex, 15px width and absolutely positioned hit area. Both halves
//   worked perfectly alone. Every modifier here is prefixed with its block.
//
//   NEVER PUT A RAW DOUBLE QUOTE IN AN ATTRIBUTE. It terminates the attribute
//   early, truncating text mid-sentence and leaving stray attributes behind.

export const CSS = `
:root {
  --bg: #12100e;
  --panel: #1b1815;
  --line: #2e2924;
  --ink: #e8e2d9;
  --dim: #9a9187;
  --gold: #d8a24a;
  --warn: #e0733f;
  --good: #6fae5f;
  --light: #b9a98f;
  --dark: #6d5b46;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font: 14px/1.5 ui-sans-serif, system-ui, -apple-system, sans-serif;
}
main { max-width: 1100px; margin: 0 auto; padding: 12px; }
h1 { font-size: 20px; margin: 0; display: flex; align-items: center; gap: 8px; }
h2 { font-size: 15px; margin: 0 0 8px; color: var(--gold); font-weight: 600; }
code, .mono { font-family: ui-monospace, Menlo, Consolas, monospace; }

.topbar {
  display: flex; flex-wrap: wrap; gap: 10px; align-items: center;
  justify-content: space-between; padding: 8px 0 12px;
  border-bottom: 1px solid var(--line); margin-bottom: 12px;
}
.tabs { display: flex; gap: 4px; flex-wrap: wrap; }
.tab {
  background: none; border: 1px solid transparent; color: var(--dim);
  padding: 8px 12px; border-radius: 6px; cursor: pointer; font: inherit;
  min-height: 44px;
}
.tab:hover { color: var(--ink); }
.tab[aria-selected='true'] { color: var(--gold); border-color: var(--line); background: var(--panel); }

.layout { display: grid; grid-template-columns: minmax(280px, 1fr) minmax(260px, 380px); gap: 12px; }
@media (max-width: 780px) { .layout { grid-template-columns: 1fr; } }
/* A phone held sideways is short, not narrow, so the width query above never
   fires for it. */
@media (max-height: 560px) { .layout { grid-template-columns: 1fr; } }

.panel { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 12px; margin-bottom: 12px; }

/* A hash and an address are single unbreakable words.
   A grid item's automatic minimum size is its MIN-CONTENT, so a 64 character
   rules hash and a 41 character principal set the minimum width of the whole
   column. On a 390px phone that column computed to 488px and the thing pushed
   off the right of the screen was the board: the h file and the Refresh button
   were simply not reachable.
   The value is "anywhere" rather than "break-word" on purpose. Only "anywhere"
   also shrinks MIN-CONTENT, which is the number that was doing the damage.
   Set on the body rather than on the panels, because the LAST thing still
   pushing the page wide was the build stamp in the top bar, which is not inside
   the layout grid at all. A word is only ever broken when it would otherwise
   overflow, so this costs nothing anywhere else.
   NOTE: no backticks in this comment. It sits inside a template literal, and
   one backtick ends the string - which is what this very comment did. */
.layout > * { min-width: 0; }
body { overflow-wrap: anywhere; }

/* Capped against the VIEWPORT HEIGHT as well as the column width.
   width:100% with aspect-ratio:1 says nothing about height, and the only media
   query in this file keys on width - so at 844x390 the two-column layout held,
   the board came out about 428px tall in a 390px viewport, and the line saying
   whose turn it is went below the fold. The cap goes on .board-wrap too, or the
   arrow overlay - inset:0, preserveAspectRatio:none over an 8x8 viewBox -
   stretches every pending arrow off its squares. */
.board, .board-wrap { max-width: min(100%, 78svh); margin-inline: auto; }
.board {
  /* Eight columns AND eight rows. With rows left implicit they size to their
     content, so a row holding a piece grew taller than an empty one and the
     board stopped being square. The aspect-ratio on the container is not
     enough on its own: it fixes the outside and says nothing about the inside. */
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  aspect-ratio: 1 / 1;
  width: 100%;
  border: 1px solid var(--line); border-radius: 6px; overflow: hidden;
  /* So a square can size its glyph against the BOARD rather than the viewport.
     A vw-based size is wrong here by construction: the board is one column of a
     two-column layout, and its width has almost nothing to do with the
     window's. */
  container-type: inline-size;
}
.sq {
  border: 0; padding: 0; margin: 0; cursor: default; position: relative;
  display: flex; align-items: center; justify-content: center;
  /* min-* 0 stops a glyph from forcing a track wider than its share. Without
     them a grid item's automatic minimum size is its content, and one big
     character can push a column out. */
  min-width: 0; min-height: 0; overflow: hidden;
  font-size: clamp(14px, 5vw, 34px); line-height: 1;
}
/* A square is an eighth of the board, so this is about 56% of one. */
@supports (font-size: 1cqw) { .sq { font-size: 7cqw; } }
/* Coordinates, in the corners of the edge squares.
   Sized in cqw like the pieces, so they scale with the BOARD rather than the
   viewport - the board is one column of a two-column layout and its width has
   almost nothing to do with the window's. The max() is a legibility floor: on a
   narrow phone 2.1cqw is about five pixels, which is a smudge rather than a
   letter.
   Tinted with the strongest neutral each square can carry rather than the
   opposite square colour. Light-on-dark and dark-on-light square shades measure
   2.82:1, which is too weak to read at this size; --ink on a dark square is
   5.22:1 and --bg on a light one is 8.2:1, and both are variables that already
   exist. No opacity, for the same reason - it would give the contrast straight
   back. */
.co {
  position: absolute; font-size: max(8px, 2.1cqw); font-weight: 700;
  line-height: 1; pointer-events: none; user-select: none;
}
.co--rank { top: 5%; left: 6%; }
.co--file { bottom: 4%; right: 6%; }
.co--on-dark { color: var(--ink); }
.co--on-light { color: var(--bg); }
.sq--light { background: var(--light); }
.sq--dark { background: var(--dark); }
.sq--playable { cursor: pointer; }
/* Reading a game is several round trips. Without a sign that the click landed,
   the board sits showing the PREVIOUS game and the natural response is to click
   again - which starts the whole thing twice. */
.board--loading { opacity: .45; transition: opacity .12s ease-out; }
.board--loading .sq { pointer-events: none; }
/* TWO-TONE, and that is the whole point. --gold #d8a24a against the light square
   #b9a98f measures 1.006:1 - identical luminance, so the ring separating the
   piece you picked up from the rest of the board was distinguishable by hue
   alone, and invisible to anyone who cannot make that separation. The dark inset
   sits inside the gold so one edge always resolves, on either square colour and
   in greyscale. */
.sq--selected {
  outline: 3px solid var(--gold); outline-offset: -3px;
  box-shadow: inset 0 0 0 5px rgba(0, 0, 0, .55);
}
.sq--last { box-shadow: inset 0 0 0 3px rgba(216, 162, 74, 0.45), inset 0 0 0 5px rgba(0, 0, 0, .38); }
.sq--target::after {
  content: ''; position: absolute; width: 26%; height: 26%; border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
}
.sq--capture { outline: 3px solid var(--warn); outline-offset: -3px; }
/* The king that is in check. Loud on purpose: it is the one fact on the board
   that changes which moves are legal, and a player who misses it will try
   moves that get skipped and cost a fee for nothing. */
.sq--check {
  background-image: radial-gradient(circle at 50% 50%,
    rgba(196, 58, 47, .92) 14%, rgba(196, 58, 47, .42) 48%, rgba(196, 58, 47, 0) 74%);
  animation: alarm 1.4s ease-in-out infinite;
}
@keyframes alarm { 0%,100% { filter: none; } 50% { filter: brightness(1.35); } }
/* The pieces.
   BOTH colours use the FILLED glyphs (U+265A-265F) and colour tells them apart.
   The outline block was nominally "white" and has a transparent interior, so
   white could never be solid however it was coloured - and the two blocks have
   different metrics, served from different fonts on some systems, so the two
   sides disagreed about size. One set of six glyphs removes both problems. */
.pc {
  line-height: 1;
  /* Solid, with an edge drawn BEHIND the fill so it defines the shape without
     eating into it. paint-order is what makes a stroke usable on text at all. */
  paint-order: stroke fill;
}
.pc--white {
  color: #ffffff;
  -webkit-text-stroke: 0.055em #241c12;
  /* For anything without text-stroke: a ring of shadows is cruder but keeps a
     white piece legible on a light square, which is the case that fails. */
  text-shadow: 0 0 2px rgba(20, 17, 14, .55);
}
.pc--black {
  color: #17130f;
  -webkit-text-stroke: 0.05em rgba(255, 255, 255, .30);
  text-shadow: 0 0 2px rgba(255, 255, 255, .18);
}
@supports (-webkit-text-stroke: 1px black) {
  .pc--white, .pc--black { text-shadow: none; }
}

/* Optical scale.
   Within one glyph set the proportions are the font designer's, not chess's: a
   pawn fills its em box while a bishop has headroom, so at one size the pawn
   reads LARGER than the bishop. These are ratios of the square's own size, so
   they hold at any board size and in any font. Generated from SCALE in
   pieces.ts, which is the only place the numbers live. */
${SCALE_CSS}

/* A move that has been chosen but has not landed.
   HOLLOW rather than faded: a translucent piece reads as a dim piece, an
   outline reads as a piece that is not there yet. The two states are told apart
   by COLOUR rather than animation speed, which nobody perceives - amber is
   waiting on your wallet, green has been broadcast and is out of your hands.
   The status line says the same thing in words. */
.pc--ghost {
  position: absolute;
  color: transparent;
  text-shadow: none;
  animation: trace 1.9s ease-in-out infinite;
}
.pc--signing { -webkit-text-stroke: 0.055em var(--gold); }
.pc--sent { -webkit-text-stroke: 0.055em var(--good); }
/* Without text-stroke a hollow glyph is invisible, so those browsers get a
   translucent solid instead - worse, and still legible. */
@supports not (-webkit-text-stroke: 1px black) {
  .pc--ghost { opacity: .45; }
  .pc--signing { color: var(--gold); }
  .pc--sent { color: var(--good); }
}
@keyframes trace { 0%,100% { opacity: .6; } 50% { opacity: 1; } }

/* The square the piece left. Empty, with a faint ring saying why. */
.sq--vacated::before {
  content: ''; position: absolute; inset: 22%; border-radius: 50%;
  border: 2px dashed rgba(216, 162, 74, 0.4);
}
.sq--pending { outline: 2px dashed var(--gold); outline-offset: -2px; }
.sq--signing { outline: 3px solid var(--gold); outline-offset: -3px;
               background-image: linear-gradient(rgba(216,162,74,.16), rgba(216,162,74,.16)); }

/* Origin to destination, drawn over the grid.
   The one cue that makes a pending move readable without hunting for the ring
   it came from. */
.board-wrap { position: relative; }
.arrows { position: absolute; inset: 0; pointer-events: none; overflow: visible; }
.arrows line { stroke-width: 1.6; stroke-linecap: round; opacity: .85; }
.arrows .ar--signing { stroke: var(--gold); stroke-dasharray: 4 3; }
.arrows .ar--sent { stroke: var(--good); }
.arrows circle { opacity: .85; }

@media (prefers-reduced-motion: reduce) {
  /* This block used to aim at a path element inside a ghost piece. There is no
     such element - pieceNode builds a span holding a text glyph - so the whole
     block was inert, and the trace kept pulsing for somebody who had asked
     their device for stillness, for as long as a move sat in the mempool. The
     ghost stays identifiable without the pulse: the stroke colour already
     separates signing from sent. */
  .pc--ghost, .sq--check, .live { animation: none; }
  .board--loading { transition: none; }
}

/* The submissions list. */
/* Scoped to beat .list li, which is (0,1,1) and would otherwise win.
   A bare .mv at (0,1,0) lost silently: the grid columns never applied and
   every row ran together. Same shape as the legacy .notice info collision,
   two rules that are each correct alone.
   NOTE: no backticks anywhere in this string. It is a template literal, and
   one backtick in a comment ends it. */
.list li.mv { display: grid; grid-template-columns: 2.6ch 1.6em 1fr auto; gap: 8px;
      align-items: baseline; padding: 6px 8px; border-bottom: 1px solid var(--line); }
.list li.mv:last-child { border-bottom: 0; }
.list li.mv--pending { opacity: .75; border-left: 2px solid var(--gold); }
.mv-num { color: var(--dim); font-size: 11px; font-variant-numeric: tabular-nums; }
.mv-glyph { font-size: 17px; line-height: 1; }

.mv-san { font-weight: 600; }
.mv-piece { color: var(--dim); font-size: 12px; margin-left: 6px; }
.mv-clock { color: var(--dim); font-size: 12px; font-variant-numeric: tabular-nums; margin-left: 6px; }
.mv-who { color: var(--gold); font-size: 12px; text-align: right; white-space: nowrap; }
.mv-rejected .mv-san { color: var(--dim); text-decoration: line-through; }
.mv-reason { color: var(--warn); font-size: 11px; margin-left: 6px; }

.row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.row + .row { margin-top: 8px; }
.spacer { flex: 1; }

button.action {
  background: var(--panel); color: var(--ink); border: 1px solid var(--line);
  border-radius: 6px; padding: 10px 14px; font: inherit; cursor: pointer; min-height: 44px;
}
button.action:hover:not(:disabled) { border-color: var(--gold); color: var(--gold); }
button.action:disabled { opacity: .45; cursor: not-allowed; }
button.action--primary { background: var(--gold); color: #17130c; border-color: var(--gold); font-weight: 600; }

label { display: block; color: var(--dim); font-size: 12px; margin-bottom: 4px; }
input[type='text'], input[type='search'], select {
  width: 100%; background: #14120f; color: var(--ink); border: 1px solid var(--line);
  border-radius: 6px; padding: 10px; font: inherit; min-height: 44px;
}
.field { margin-bottom: 10px; }

.notice { border-radius: 6px; padding: 10px 12px; margin: 8px 0; border: 1px solid var(--line); }
.notice--info { color: var(--dim); }
.notice--warn { color: var(--warn); border-color: var(--warn); }
.notice--good { color: var(--good); border-color: var(--good); }
.notice--loud { color: var(--gold); border-color: var(--gold); }

.list { list-style: none; margin: 0; padding: 0; max-height: 320px; overflow: auto; }
.list li { padding: 6px 8px; border-bottom: 1px solid var(--line); display: flex; gap: 8px; align-items: baseline; }
.list li:last-child { border-bottom: 0; }
.entry--rejected { color: var(--dim); text-decoration: line-through; }
.entry--reason { color: var(--warn); font-size: 12px; text-decoration: none; }
.entry--seq { color: var(--dim); font-size: 11px; min-width: 3ch; }

table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid var(--line); }
th { color: var(--dim); font-weight: 600; font-size: 12px; }
.num { text-align: right; font-variant-numeric: tabular-nums; }

/* The sound panel. One row per entry in the voice table, generated, so the
   controls cannot fall behind the library. Every modifier is prefixed with its
   block - see the rule at the top of this file, which a bare .name or .gain
   here would break for the whole application. */
/* Three lines per event, not one. The row carries a name, a whole library to
   choose from, a volume and a preview, and four controls abreast in a 380px
   column is four controls nobody can hit on a phone. */
.snd {
  display: grid; grid-template-columns: minmax(0, 1fr) 84px auto; gap: 6px 8px;
  align-items: center; padding: 8px 0; border-bottom: 1px solid var(--line);
}
.snd:last-child { border-bottom: 0; }
.snd-name { grid-column: 1 / -1; display: flex; align-items: center; gap: 6px;
      margin: 0; color: var(--ink); font-size: 13px; }
/* Under the row rather than beside it. What an event MEANS is the thing a
   person needs when deciding what to put on it, and a tooltip does not exist on
   touch, which is where most of these will be heard. */
.snd-say { grid-column: 1 / -1; margin: -2px 0 0; }
.snd-pick {
  grid-column: 1; width: 100%; min-width: 0; min-height: 34px;
  background: #14120f; color: var(--ink); border: 1px solid var(--line);
  border-radius: 6px; padding: 6px 8px; font: inherit; font-size: 12px;
}
.snd-pick:disabled { opacity: .5; }
.snd-gain { grid-column: 2; width: 100%; accent-color: var(--gold); }
.snd-test { grid-column: 3; padding: 4px 12px; min-height: 34px; font-size: 12px; }
/* Dimmed, never hidden. A panel that empties itself when the master switch is
   off says the feature went away rather than that it is switched off. */
.snd-list--off { opacity: .45; }

.muted { color: var(--dim); }
.filters { flex-wrap: wrap; gap: 6px; }
.filters .action { padding: 6px 11px; min-height: 34px; font-size: 13px; }
.filters .action[aria-pressed="true"] {
  background: var(--gold); color: var(--bg); border-color: var(--gold);
}
/* A row you asked for by name, so it is findable among the rest. */
tr.found td { background: rgba(216, 162, 74, .10); }
tr.found td:first-child { box-shadow: inset 3px 0 0 var(--gold); }
.badge { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: .04em;
         text-transform: uppercase; padding: 2px 6px; border-radius: 4px;
         border: 1px solid var(--line-2); color: var(--dim); }
.badge--turn { color: var(--bg); background: var(--gold); border-color: var(--gold); }
.small { font-size: 12px; }
.addr { font-family: ui-monospace, monospace; font-size: 12px; color: var(--dim); }
/* Abbreviated, so a row is one line. The full value is on the element, so a
   copy or a screen reader still gets all of it. */
.addr--short { white-space: nowrap; }
.hide { display: none !important; }
`;

/**
 * The shell.
 *
 * Every id here has a matching entry in the element map and a matching handler.
 * Add all three in one change: a missing map entry throws inside wiring, so
 * nothing after it runs, and the page renders perfectly and does nothing.
 */
export const HTML = `
<main>
  <div class="topbar">
    <h1><span class="logo">X</span> Chess</h1>
    <span class="muted small mono" id="build-tag"></span>
    <nav class="tabs" role="tablist" aria-label="sections">
      <button class="tab" id="tab-play" role="tab" aria-selected="true">Play</button>
      <button class="tab" id="tab-game" role="tab" aria-selected="false">Game</button>
      <button class="tab" id="tab-explore" role="tab" aria-selected="false">Explore</button>
      <button class="tab" id="tab-leaderboard" role="tab" aria-selected="false">Leaderboard</button>
      <button class="tab" id="tab-profile" role="tab" aria-selected="false">Profile</button>
    </nav>
    <div class="row">
      <!-- The master switch lives up here, not only in the panel, because the
           one thing somebody wants at speed is silence - and the panel is on a
           tab they may not be looking at. -->
      <button class="action" id="sound-toggle" aria-pressed="true"
              title="Every sound on this board, on or off">Sound on</button>
      <button class="action" id="connect">Connect</button>
      <button class="action hide" id="disconnect">Disconnect</button>
    </div>
  </div>

  <div id="chain-notice" class="notice notice--info">Reading the chain.</div>
  <div id="sign-notice" class="notice notice--warn hide"></div>

  <section id="view-play" class="panel">
    <h2>Start a game</h2>
    <div class="field">
      <label for="game-kind">Kind of game</label>
      <select id="game-kind">
        <option value="standard">Standard, both players pay their own gas</option>
        <option value="sponsor-opponent">Sponsored challenge, your opponent may hold nothing</option>
        <option value="sponsor-both">Fully sponsored, neither player needs gas</option>
      </select>
    </div>
    <div class="field">
      <label for="rules-white">White</label>
      <input type="text" id="rules-white" placeholder="a Stacks address, a .btc name, anyone, or anyone-else">
    </div>
    <div class="field">
      <label for="rules-black">Black</label>
      <input type="text" id="rules-black" placeholder="a Stacks address, a .btc name, anyone, or anyone-else">
    </div>
    <div class="field">
      <label for="rules-ranked">
        <input type="checkbox" id="rules-ranked"> Ranked, this game counts towards ratings
      </label>
    </div>
    <div id="rules-summary" class="notice notice--info"></div>
    <div id="price-summary" class="notice notice--loud"></div>
    <div id="rules-problems" class="notice notice--warn hide"></div>
    <div class="row">
      <button class="action action--primary" id="open-game">Open game</button>
      <span class="spacer"></span>
      <label for="join-game" class="hide">Game number</label>
      <input type="text" id="join-game" placeholder="game number" style="max-width:160px">
      <button class="action" id="load-game">Open that game</button>
    </div>
  </section>

  <section id="view-game" class="layout hide">
    <div>
      <div class="panel">
        <div class="row">
          <strong id="game-label">no game loaded</strong>
          <span class="spacer"></span>
          <button class="action" id="copy-link" title="A link carrying this game\u2019s rules, so your opponent\u2019s board can referee it">Copy link</button>
          <button class="action" id="flip">Flip</button>
          <button class="action" id="refresh">Refresh</button>
        </div>
        <div class="board-wrap">
          <div id="board" class="board"></div>
          <!-- Drawn over the grid, not in it: an arrow that lived inside a
               square would be clipped by it. -->
          <svg id="arrows" class="arrows" viewBox="0 0 8 8" preserveAspectRatio="none"
               aria-hidden="true" focusable="false"></svg>
        </div>
        <div id="status" class="notice notice--info"></div>
        <div id="move-hint" class="small muted"></div>
        <div id="promotion" class="notice notice--loud hide" role="group" aria-label="choose a promotion piece"></div>
        <!-- A submission the board thinks is doomed, and the way past it.
             The override is not a courtesy: the board cannot know which account
             the wallet will sign with, and it cannot always confirm a game's
             rules, so it will sometimes be wrong. Being warned is worth a click.
             Being locked out of a game is not. -->
        <div id="override" class="notice notice--warn hide">
          <div id="override-why"></div>
          <div class="row">
            <button id="override-yes" type="button" class="action action--primary">Let me try anyway</button>
          </div>
        </div>
        <div id="send-anyway" class="notice notice--warn hide">
          <div id="send-anyway-why"></div>
          <div class="row">
            <button id="send-anyway-yes" type="button" class="action">Send anyway</button>
            <button id="send-anyway-no" type="button" class="action">Cancel</button>
          </div>
        </div>
      </div>
      <div class="panel">
        <h2>Rules for this game</h2>
        <div id="game-rules-state" class="notice notice--info"></div>
        <div id="game-rules-summary" class="small muted"></div>
        <div id="game-rules-hash" class="addr"></div>
        <!-- When the chain cannot tell the board who is playing, ask.
             The answer is checked against the commitment, so a wrong guess is
             refused rather than believed. -->
        <div id="claim-rules" class="hide">
          <div class="small muted">
            The players are not on chain until somebody moves. If you know them, name them and
            this board will check them against what the game committed.
          </div>
          <div class="row">
            <input id="claim-white" type="text" placeholder="White: address or .btc name" />
            <input id="claim-black" type="text" placeholder="Black: address or .btc name" />
            <button id="claim-check" class="action" type="button">Check</button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="panel">
        <h2>Players</h2>
        <div id="players"></div>
      </div>
      <div class="panel">
        <h2>Your sponsorship</h2>
        <div id="sponsorship" class="small muted">none on this game</div>
        <div class="row"><button class="action" id="top-up">Add more sponsorship</button></div>
      </div>
      <div class="panel">
        <div class="row">
          <h2 id="moves-title" style="margin:0">Moves</h2>
          <span class="spacer"></span>
          <button class="action" id="toggle-skipped">Show skipped</button>
        </div>
        <div id="skipped-note" class="small muted"></div>
        <div class="row">
          <button class="action" id="resign">Resign</button>
          <button class="action" id="offer-draw">Offer draw</button>
          <button class="action" id="accept-draw">Accept draw</button>
        </div>
        <ul id="moves" class="list"></ul>
      </div>
      <div class="panel">
        <h2>Verify</h2>
        <div id="verify" class="small muted">Every position here is derived from the log.</div>
        <div class="row"><button class="action" id="verify-game">Re-derive from chain</button></div>
      </div>
      <!-- Sound.
           One row by default: the switch and the volume, which is all anybody
           adjusts. Everything else is behind "More" - fourteen per-voice rows
           on screen at all times made the panel look like a mixing desk for a
           setting most people touch once. -->
      <div class="panel">
        <div class="row">
          <label for="sound-master" style="margin:0">
            <input type="checkbox" id="sound-master"> All sounds
          </label>
          <input type="range" id="sound-volume" class="snd-gain" min="0" max="100" step="5"
                 style="max-width:130px" aria-label="Overall volume">
          <span class="spacer"></span>
          <button class="action" id="sound-more" aria-expanded="false"
                  aria-controls="sound-detail">More</button>
        </div>
        <div id="sound-detail" class="hide">
          <div class="row">
            <label for="sound-background" style="margin:0">
              <input type="checkbox" id="sound-background"> Keep listening while this tab is in the background
            </label>
            <span class="spacer"></span>
            <button class="action" id="sound-reset">Reset</button>
          </div>
          <!-- For watching rather than playing. A player knows whose move it
               was because they were waiting for it; somebody following a game
               they are not in has no such clue, and twelve identical knocks
               tell them nothing about its shape. -->
          <div class="row">
            <label for="sound-sides" style="margin:0">
              <input type="checkbox" id="sound-sides"> Tell the sides apart, by pitching Black lower
            </label>
          </div>
          <div id="sound-note" class="small muted"></div>
          <div id="sound-list"></div>
        </div>
      </div>
    </div>
  </section>

  <section id="view-explore" class="panel hide">
    <h2>Games</h2>
    <div class="row">
      <button class="action" id="explore-refresh">Refresh</button>
      <span id="explore-count" class="muted small"></span>
    </div>
    <!-- Filters. Every one reads a field the row already carries, so none of
         them touches the chain. The two that ask about "you" are removed
         entirely when nobody is connected, rather than shown empty: there is no
         you to answer for, and an empty result would read as "no such games". -->
    <div class="row filters" id="explore-filters" role="group" aria-label="filter the game list"></div>
    <div class="row">
      <label class="small muted" for="explore-search">Find a game</label>
      <input id="explore-search" type="search" inputmode="numeric" placeholder="game number"
             aria-describedby="explore-found">
      <button class="action" id="explore-find">Find</button>
      <span id="explore-found" class="muted small" role="status"></span>
    </div>
    <table><thead><tr>
      <th>#</th><th>Players</th><th>Rules</th><th>Moves</th><th>State</th><th></th>
    </tr></thead><tbody id="explore-rows"></tbody></table>
  </section>

  <section id="view-leaderboard" class="panel hide">
    <h2>Leaderboard</h2>
    <div id="leaderboard-note" class="notice notice--info"></div>
    <table><thead><tr>
      <th>#</th><th>Player</th><th class="num">Rating</th><th class="num">Games</th>
      <th class="num">W</th><th class="num">D</th><th class="num">L</th>
    </tr></thead><tbody id="leaderboard-rows"></tbody></table>
  </section>

  <section id="view-profile" class="panel hide">
    <h2>Profile</h2>
    <div class="field">
      <label for="profile-who">Address</label>
      <input type="text" id="profile-who" placeholder="a Stacks address">
    </div>
    <div class="row"><button class="action" id="profile-load">Show</button></div>
    <div id="profile-body"></div>
  </section>

  <footer class="small muted" style="padding:12px 0">
    <span id="contract-label"></span>
    <span id="endpoint-label"></span>
  </footer>
</main>
`;

export const SHELL = { css: CSS, html: HTML };
