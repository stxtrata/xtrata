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

/**
 * The two arrowheads a pending move can wear, built once as markup.
 *
 * A MARKER, NOT A DRAWN TRIANGLE, for two reasons that are both about cost.
 * Its `refX` sits the head back off the destination in stroke-width units, so
 * the drawing code needs no per-arrow trigonometry to keep the head from
 * covering the ghost it points at - and a marker is immune to
 * preserveAspectRatio="none" on the overlay, which stretches every coordinate
 * inside the viewBox and would skew a hand-drawn triangle on any board that is
 * not exactly square.
 *
 * Two of them because a marker cannot be two colours at once, and the colour is
 * the difference between "being signed" and "sent".
 *
 * WRITTEN ON ONE LINE ON PURPOSE. This is a template literal: its newlines,
 * indentation and any HTML comment inside it are shipped bytes, inscribed
 * permanently. The first version of this cost 1,276 bytes and most of that was
 * an explanation - which is why the explanation is out here, where the minifier
 * takes it away.
 */
const arrowhead = (id: string, fill: string): string =>
  `<marker id="${id}" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 1L9 5L0 9z" fill="var(${fill})"/></marker>`;
const ARROWHEADS = arrowhead('ah-sent', '--good') + arrowhead('ah-signing', '--gold');

export const CSS = `
:root {
  --bg: #12100e;
  --panel: #1b1815;
  --line: #2e2924;
  /* A second line tone, one step up from --line.
     It was used by .badge and never defined: an invalid var() in a shorthand
     makes the whole declaration invalid at computed-value time, so every plain
     badge had NO BORDER and "Open seat" rendered as bare uppercase text. It
     looked deliberate, which is why it survived. */
  --line-2: #453d33;
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
/* The pawn an en passant capture would take.
   Dashed rather than solid, because it is not a square you can move to - it is
   the piece that disappears if you take the square beside it. En passant is the
   only capture in chess where those are different squares, and nothing else on
   the board had ever needed to say so. */
.sq--en-passant { outline: 3px dashed var(--warn); outline-offset: -3px; }
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

/* The piece that is on its way out, still standing where it is.
   THREE STATES THAT MUST NOT LOOK ALIKE: a real piece is filled and steady, a
   departing one is filled and FADING, an arriving one is a hollow outline. The
   fade goes low enough that it cannot be counted as material at a glance, which
   was the whole objection to drawing it at all.
   The ring that used to mark this square is gone: it said "something left here"
   and the piece now says it better. */
.pc--leaving { animation: leaving 1.9s ease-in-out infinite; }
@keyframes leaving { 0%, 100% { opacity: .34; } 50% { opacity: .13; } }
.sq--pending { outline: 2px dashed var(--gold); outline-offset: -2px; }
.sq--signing { outline: 3px solid var(--gold); outline-offset: -3px;
               background-image: linear-gradient(rgba(216,162,74,.16), rgba(216,162,74,.16)); }

/* Origin to destination, drawn over the grid.
   The one cue that makes a pending move readable without hunting for the ring
   it came from. */
.board-wrap { position: relative; }
.arrows { position: absolute; inset: 0; pointer-events: none; overflow: visible; }
.arrows line { stroke-width: 2.4; stroke-linecap: round; opacity: .9; }
.arrows .ar--signing { stroke: var(--gold); stroke-dasharray: 4 3; }
.arrows .ar--sent { stroke: var(--good); }
/* The heads are markers in the shell markup and carry their own fill, so there
   is nothing to style here. Left as a note because looking for the arrowhead
   rule and finding nothing is otherwise a minute wasted.
   NOTE: no backticks in here. This is a template literal and one ends it. */

@media (prefers-reduced-motion: reduce) {
  /* This block used to aim at a path element inside a ghost piece. There is no
     such element - pieceNode builds a span holding a text glyph - so the whole
     block was inert, and the trace kept pulsing for somebody who had asked
     their device for stillness, for as long as a move sat in the mempool. The
     ghost stays identifiable without the pulse: the stroke colour already
     separates signing from sent. */
  .pc--ghost, .pc--leaving, .sq--check, .live { animation: none; }
  /* Stillness must not mean invisible: without the pulse this needs a fixed
     opacity, or a departing piece would sit at whatever the last frame was. */
  .pc--leaving { opacity: .3; }
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

/* The tournament tab.
   A verdict is a fact about a game and gets a word, not only a colour: colour
   alone fails for anyone who cannot separate these two hues, and this is
   precisely the information a reader came to check.
   NOTE: no backticks in this comment. It sits inside a template literal, and
   one backtick ends the string. */
.tn-standings { width: 100%; margin: 10px 0 16px; }
.tn-round { margin: 14px 0 0; }
.tn-round h3 { font-size: 13px; margin: 0 0 6px; color: var(--gold); font-weight: 600; }
.tn-game {
  /* id · players · moves · result · verdict. The moves column was added after
     the fact and the grid still said four, so the verdict wrapped to a line of
     its own on every row. */
  display: grid; grid-template-columns: 3.4ch 1fr auto auto auto; gap: 8px;
  align-items: baseline; padding: 5px 8px; border-bottom: 1px solid var(--line);
}
.tn-game:last-child { border-bottom: 0; }
.tn-id { color: var(--dim); font-size: 11px; font-variant-numeric: tabular-nums; }
.tn-result { font-variant-numeric: tabular-nums; }
.tn-mark { font-size: 11px; white-space: nowrap; }
.tn-mark--verified { color: var(--good); }
.tn-mark--unverified { color: var(--warn); }
.tn-mark--missing { color: var(--dim); }
.tn-live { color: var(--dim); font-size: 12px; }
/* Which kind of manifest this is, which is a claim about the DOCUMENT rather
   than about the tournament — so it should not read as more of the same prose
   as the description above it.
   The accent carries the strength: committed was promised before a move was
   played, compiled was written afterwards and is accepted only because its
   games predate the rule, refused is neither. The words say all of that, so the
   colour is an accent and never the message. */
/* Written .notice.tn-prov, not .tn-prov, and that is the whole trick. Both are
   one class, so specificity ties and the LATER rule wins — .notice comes after
   this block and was quietly repainting the border back to --line. Checked with
   getComputedStyle rather than by eye: the class was applied and the colour was
   not. Exactly the collision the note at the top of this file describes. */
/* The manifest number and the two buttons that act on it, on one line. */
.tn-controls { align-items: center; gap: 8px; flex-wrap: wrap; }
.tn-controls label { color: var(--dim); font-size: 12px; }
/* Sized to what it holds. An inscription id is four figures today and the
   field allows twelve, which is more than Xtrata will mint this century.

   Qualified by .tn-controls and by the element, and the specificity is the
   point rather than fussiness: the base rule is input[type='text'] at (0,1,1)
   and a bare class is (0,1,0), so it loses and the box stays full width. Same
   collision the provenance banner had, caught the same way, by measuring the
   element rather than trusting the class to be applied.

   No backticks in here. This stylesheet lives inside a template literal, so one
   ends the string and the error arrives as a TypeScript parse failure hundreds
   of lines away with nothing to do with CSS. */
.tn-controls input.tn-manifest { width: 8.5em; flex: 0 0 auto; }
/* Its own line, deliberately. It is a sentence, and letting it share a row with
   the controls is what pushes the buttons away from the box they act on. */
/* The question mark is one character, so it needs a shape rather than a width. */
.tab--help { font-weight: 700; min-width: 34px; text-align: center; }

/* The manual, filling the tab. Tall because it is a document: a short frame
   would put a page with its own contents sidebar into a letterbox. */
.help-frame { width: 100%; height: 78vh; min-height: 460px; display: block;
              border: 1px solid var(--line); border-radius: 8px; background: var(--bg); }

/* The way out of the frame, always offered. A browser can refuse to embed and
   this board cannot see that it did. */
.help-open { display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
             border: 1px solid var(--gold); border-radius: 8px;
             padding: 12px 14px; margin: 4px 0 14px; }
.help-open b { color: var(--gold); }
.help-open .why { color: var(--dim); font-size: 12px; flex: 1 1 22ch; }

/* A group: one question, its controls, and what it produced. */
.tn-group { border: 1px solid var(--line); border-radius: 8px; padding: 10px 12px; margin: 4px 0 12px; }
.tn-group__head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
.tn-group__title { color: var(--gold); font-size: 12px; font-weight: 600;
                   letter-spacing: .04em; text-transform: uppercase; margin-right: auto; }
/* Filters and their search box share a line, because they narrow one list and
   reading them as two separate controls is what made four rows unreadable. */
.tn-line { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin: 6px 0; }
.tn-line .tn-list { margin: 0; }
.tn-line--games { margin-bottom: 10px; }
/* Wide enough for its own placeholder. At 8.5em these read "entrant name o"
   and "address or nam", which looks like a rendering fault rather than a box.

   Qualified by the element, and this file has needed that three times today.
   The base rule input[type='text'] carries width:100% at (0,1,1); any bare
   class is (0,1,0) and loses, so the width does nothing, the box fills the
   panel, and every control meant to sit beside it wraps. It never presents as
   a specificity problem - it presents as flex layout not working.

   NO BACKTICKS IN THIS FILE. The stylesheet lives inside a template literal, so
   a backtick ends the string. An ODD number is caught immediately; an EVEN
   number is worse, because the text between them is parsed as JavaScript, tsc
   and the build both pass, and the artefact ships with a hole in its CSS. That
   is what happened while writing this very comment. */
.tn-line input.tn-search { width: 18em; max-width: 100%; flex: 0 1 auto; }
.tn-moves { color: var(--dim); font-variant-numeric: tabular-nums; margin-right: 8px; }

/* Whose move it is, in a tournament round. Same word the Explore list uses,
   because it is the same fact and a second wording would read as a second one. */
.tn-turn { font-size: 11px; color: var(--dim); }
/* What a game IS, when the manifest says so. Reads before the players, because
   it changes how the rest of the row is read. */
.tn-stage { font-size: 10px; font-weight: 700; letter-spacing: .05em;
            text-transform: uppercase; color: var(--gold);
            border: 1px solid var(--gold); border-radius: 3px; padding: 0 5px; }
.tn-yours { font-size: 10px; font-weight: 600; letter-spacing: .04em;
            background: var(--gold); color: #1a1713; border-radius: 3px; padding: 1px 5px; }

/* Set apart, because it is the way in for a tournament the board could not
   find rather than the way in. */
.tn-byhand { margin-top: 18px; padding-top: 12px; border-top: 1px solid var(--line); }

/* The list form of the picker, used once buttons stop fitting. */
.tn-picker { max-width: 100%; margin: 8px 0 2px; }

/* The inscriptions a tournament is made of, offered rather than described. */
.tn-entry { font-size: 11px; color: var(--dim); text-decoration: none;
            border: 1px solid var(--line); border-radius: 999px; padding: 1px 6px; }
.tn-entry:hover { color: var(--gold); border-color: var(--gold); }
.tn-read a { color: var(--gold); text-decoration: none; border-bottom: 1px dotted var(--gold); }
.tn-read a:hover { border-bottom-style: solid; }

/* The list of tournaments found on chain. Buttons rather than links: this
   loads into the tab it is in, and nothing navigates. */
.tn-list { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0 2px; }
.tn-pick { background: var(--panel-2); border: 1px solid var(--line); color: var(--text);
           border-radius: 999px; padding: 4px 10px; font-size: 12px; cursor: pointer; }
.tn-pick:hover { border-color: var(--gold); }
.tn-pick[aria-pressed="true"] { border-color: var(--gold); color: var(--gold); }
/* Asked for and not yet arrived. Dimmed rather than animated: this sits beside
   a live tournament and a spinner next to real results reads as the results
   being provisional. */
.tn-pick--loading { border-color: var(--gold); color: var(--gold); opacity: .6; }
.tn-pick .n { color: var(--dim); margin-left: 5px; }
/* Held but not minted by the organiser. Listed, and not dressed as theirs. */
.tn-pick--planted { border-style: dashed; }

/* The fee note. Quiet by default and legible on purpose: it is present in
   every game, so it has to survive being seen a hundred times without becoming
   either noise or wallpaper. The number is the only loud part. */
.fee-advice { font-size: 12px; line-height: 1.5; }
.fee-advice b { color: var(--gold); font-weight: 600; }
.fee-advice em { font-style: normal; color: var(--text); background: var(--line);
                 border-radius: 3px; padding: 0 4px; }
.fee-advice .how { display: block; margin-top: 4px; color: var(--dim); }

/* A count beside a tab name. Not a dot: the number is the useful part, and a
   player with one game waiting and a player with nine need different urgency. */
.tab-count { margin-left: 6px; padding: 1px 6px; border-radius: 999px; font-size: 11px;
             font-weight: 600; background: var(--gold); color: #1a1713; }

.notice.tn-prov { border-left-width: 3px; border-left-color: var(--line-2); }
.notice.tn-prov--committed { border-left-color: var(--good); }
.notice.tn-prov--compiled { border-left-color: var(--gold); }
.notice.tn-prov--refused { border-left-color: var(--warn); }
/* The manifest a person copies out and inscribes themselves. Monospace because
   every character of it matters and a proportional font hides a stray space. */
.claim-out {
  background: var(--bg); border: 1px solid var(--line); border-radius: 6px;
  padding: 10px; margin: 8px 0 0; overflow-x: auto;
  font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 12px;
  white-space: pre; color: var(--ink);
}
/* The pairing, which opens the game. Styled as text rather than as a button so
   a round reads as a list and not as a wall of controls, but it IS a button, so
   it is reachable by keyboard and announced as one.
   Underlined on hover and focus rather than by default: twenty-one underlined
   rows is noise, and an underline that appears on interaction still tells a
   mouse user it is live. */
.tn-open {
  background: none; border: 0; padding: 0; margin: 0; font: inherit;
  color: var(--ink); cursor: pointer; text-align: left;
}
.tn-open:hover, .tn-open:focus-visible { color: var(--gold); text-decoration: underline; }

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

/* A gold button, hovered.
   The rule above turns the LABEL gold, which on a gold background is the same
   colour twice: 1:1, and the text disappears at the exact moment somebody is
   pointing at it. It reached a person on the filter row, and "Open game" had it
   too - the only reason that went unreported is that a label you are hovering
   over is one you have already read.
   It wins on specificity, (0,3,1) against (0,3,0) for the filters and (0,1,1)
   for the primary, so these two have to outrank it rather than merely follow
   it. Both are written to do that without relying on source order. */
button.action.action--primary:hover:not(:disabled),
.filters button.action[aria-pressed='true']:hover:not(:disabled) {
  background: #e6b264; border-color: #e6b264; color: #17130c;
}

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
/* A result. Legible rather than dimmed - the result is the most interesting
   thing about a finished game, so it gets MORE contrast than the row around it
   and not less. Neutral rather than gold, because gold means "you can act". */
.badge--over {
  color: var(--ink); background: #322c25; border-color: var(--line-2);
  letter-spacing: .02em;
}
/* The row itself. A tint and an edge rather than opacity: dimming a whole row
   takes contrast away from the text as well, which is the fault this stylesheet
   has already been caught with twice. */
tr.over td { background: rgba(255, 255, 255, .022); }
tr.over td:first-child { box-shadow: inset 3px 0 0 var(--line-2); }
/* A live game nobody has touched in hours. Deliberately QUIETER than a result:
   this is an observation about elapsed blocks, not an outcome, and a badge
   loud enough to compete with "1-0 checkmate" would read as one. Outlined
   rather than filled for the same reason. */
.badge--quiet {
  color: var(--dim); background: transparent; border-color: var(--line-2);
  letter-spacing: .02em;
}
tr.quiet td:first-child { box-shadow: inset 3px 0 0 var(--line); }
.small { font-size: 12px; }
.addr { font-family: ui-monospace, monospace; font-size: 12px; color: var(--dim); }
/* Abbreviated, so a row is one line. The full value is on the element, so a
   copy or a screen reader still gets all of it. */
.addr--short { white-space: nowrap; }
/* An explainer, built from a details element rather than a hover tooltip: it
   opens on a click and on a keyboard, a screen reader can read it, and it costs
   no script. No backticks in here - this whole block is a template literal. */
.info { display: inline-block; vertical-align: middle; margin-left: 6px; }
.info > summary {
  list-style: none; cursor: pointer; width: 17px; height: 17px; line-height: 17px;
  border-radius: 50%; border: 1px solid var(--line-2); color: var(--dim);
  font-size: 11px; font-weight: 700; text-align: center; font-style: italic;
}
.info > summary::-webkit-details-marker { display: none; }
.info > summary:hover, .info[open] > summary { color: var(--gold); border-color: var(--gold); }
.info > p {
  margin: 6px 0 0; padding: 8px 10px; max-width: 46ch;
  background: var(--panel); border: 1px solid var(--line); border-radius: 6px;
  color: var(--dim); font-size: 12px; font-style: normal; line-height: 1.45;
}

/* Who is connected. A standing fact rather than a message, so it is styled
   apart from .notice on purpose: a notice is something that happened, and this
   is something that is true until it stops being true. */
.whoami {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  padding: 7px 11px; margin-bottom: 8px;
  background: var(--panel); border: 1px solid var(--line); border-radius: 6px;
  font-size: 12px;
}
.whoami-dot {
  width: 7px; height: 7px; border-radius: 50%; background: var(--good); flex: none;
}
.whoami-name { color: var(--gold); font-weight: 600; }
.whoami-addr { color: var(--dim); font-size: 11px; }

.hide { display: none !important; }
`;

/**
 * An explainer, as a plain `<details>`.
 *
 * No script, no positioning, no library, and it works with a keyboard and a
 * screen reader because it is the element the platform already has for exactly
 * this. A tooltip built out of a div and a hover handler would be none of those
 * things and would cost bytes to be worse.
 *
 * NEVER a raw double quote in the text: this goes inside an attribute-bearing
 * template and a stray quote truncates the sentence. There is a test.
 */
const info = (id: string, text: string): string =>
  `<details class="info" id="${id}"><summary aria-label="What is this?">i</summary>` +
  `<p>${text}</p></details>`;

/**
 * The seats a side can be given.
 *
 * The keywords first, because they are what most games use, and a specific
 * person last because it is the one that needs typing. `named` is not a value
 * the rules ever see - it reveals the text field beside it, and the address or
 * name typed there is what gets committed.
 */
const seatOptions = [
  ['anyone', 'Anyone, every move'],
  ['first-mover', 'Whoever plays it first, then locked to them'],
  ['anyone-else', 'Anyone except the other player'],
  ['named', 'A specific address or .btc name']
]
  .map(([value, label]) => `<option value="${value}">${label}</option>`)
  .join('');

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
      <button class="tab" id="tab-explore" role="tab" aria-selected="false">Explore<span class="tab-count hide" id="explore-waiting"></span></button>
      <button class="tab" id="tab-leaderboard" role="tab" aria-selected="false">Leaderboard</button>
      <button class="tab" id="tab-tournaments" role="tab" aria-selected="false">Tournaments</button>
      <button class="tab" id="tab-profile" role="tab" aria-selected="false">Profile</button>
      <!-- A question mark, and last. It is the tab nobody is looking for until
           they are, so it should not take a word's worth of the row from the
           tabs people use constantly. -->
      <button class="tab tab--help" id="tab-help" role="tab" aria-selected="false"
              title="How this works" aria-label="Help">?</button>
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

  <!-- WHO YOU ARE, permanently.
       Above every message and never replaced by one. This used to be a notice
       like any other, so "Connected as SP3J..." was the thing that got
       overwritten the moment anything else needed saying - and on a board where
       one wallet is xtrata.btc and another is audionals.btc, whose turn it is
       depends entirely on which one is connected. A player must be able to see
       that without doing anything. -->
  <div id="whoami" class="whoami hide">
    <span class="whoami-dot" aria-hidden="true"></span>
    <span id="whoami-name" class="whoami-name"></span>
    <span id="whoami-addr" class="whoami-addr mono"></span>
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
      <label for="rules-white">White ${info(
        'white-help',
        'Who is allowed to play the white pieces. Every rule here is committed to the chain when the game is opened, and cannot be changed afterwards.'
      )}</label>
      <select id="rules-white">${seatOptions}</select>
      <input type="text" id="rules-white-who" class="hide"
             placeholder="a Stacks address or a .btc name">
    </div>
    <div class="field">
      <label for="rules-black">Black ${info(
        'black-help',
        'Who is allowed to play the black pieces. A game can name one side and leave the other open, which is how a challenge anybody can accept is made.'
      )}</label>
      <select id="rules-black">${seatOptions}</select>
      <input type="text" id="rules-black-who" class="hide"
             placeholder="a Stacks address or a .btc name">
    </div>
    <div class="field">
      <label for="rules-ranked">
        <input type="checkbox" id="rules-ranked"> Ranked, this game counts towards ratings
      </label>
      ${info(
        'ranked-help',
        'Ranked games are the only ones the leaderboard counts. Both sides have to be specific people by the end, the game has to reach a real result, and nobody can add this to a game afterwards: it is part of what the game committed to when it was opened.'
      )}
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
               aria-hidden="true" focusable="false"><defs>${ARROWHEADS}</defs></svg>
        </div>
        <div id="status" class="notice notice--info"></div>
        <div id="move-hint" class="small muted"></div>
        <!-- Filled from MOVE_FEE_USTX in app.ts so the number has one source.
             Present in every game rather than only while a wallet is open,
             because the moment the wallet IS open is a bad moment to be
             reading something for the first time. -->
        <div id="fee-advice" class="notice notice--info fee-advice"></div>
        <div id="promotion" class="notice notice--loud hide" role="group" aria-label="choose a promotion piece"></div>
        <!-- There was a second panel here - "Let me try anyway" - that unlocked
             a board the referee had locked. It is gone, and the reasoning is in
             eligibility.ts: every refusal strong enough to lock the squares is
             now one the board can prove, and the fix for the case it was built
             for is to reconnect with the account you meant, which each verdict
             says in its own sentence. It became unreachable before it was
             deleted; the deletion is bookkeeping.

             What survives is below: a warning the board is genuinely unsure
             about, which never locks anything and can be sent on a second
             click. -->
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
      <div class="panel hide" id="sponsorship-panel">
        <h2>Your sponsorship</h2>
        <div id="sponsorship" class="small muted"></div>
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
      <th>#</th><th>Players</th><th>Rules</th><th>Event</th><th>Moves</th><th>State</th><th></th>
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

  <section id="view-tournaments" class="panel hide">
    <h2>Tournaments</h2>
    <!-- ORDERED BY WHAT PEOPLE DO. The picker is how a tournament is chosen now
         that the board finds them itself, so it comes first; typing an
         inscription number is the fallback and sits at the bottom.

         Refresh stays HERE, apart from that box, because the two are unrelated:
         the number opens a different tournament, Refresh re-reads the one
         already on screen. It belongs beside the line that says how old that
         reading is, which is what prompts anybody to press it. -->
    <!-- TWO QUESTIONS, ASKED IN ORDER, and the layout should say which is which.
         Everything above the note answers "which tournament"; everything below
         it answers "which of its games". They were a flat stack of four
         near-identical filter-and-search rows, so a reader could not tell that
         two of them narrowed a list of tournaments and two narrowed a list of
         games inside one. -->
    <div class="tn-group">
      <div class="tn-group__head">
        <span class="tn-group__title">Choose a tournament</span>
        <button class="action" id="tournament-refresh"
                title="Read every game again. A tournament in progress changes on chain, not here.">Refresh</button>
        <span id="tournament-fresh" class="muted small" role="status"></span>
      </div>
      <!-- Filters over the PICKER. Entrant search is free; state comes from
           what has been opened before. -->
      <div class="tn-line">
        <div id="picker-filters" class="tn-list"></div>
        <input type="text" id="picker-who" class="tn-search"
               aria-label="Find a tournament by entrant"
               placeholder="find by entrant name or address">
        <span id="picker-shown" class="muted small" role="status"></span>
      </div>
      <!-- Filled from the director's wallet, so a reader never has to know a
           number. See ManifestDirectory: holdings finds them, the mint says
           which the organiser actually made. -->
      <div id="tournament-list" class="tn-list"></div>
    </div>

    <div id="tournament-note" class="notice notice--info"></div>
    <div id="tournament-field" class="notice hide"></div>
    <div id="tournament-provenance" class="notice notice--info hide"></div>

    <!-- Below the note, because these narrow the tournament the note just
         named. Nothing here reads the chain: every field they test was
         computed when it was scored. -->
    <div class="tn-line tn-line--games">
      <div id="tournament-filters" class="tn-list"></div>
      <input type="text" id="tournament-who" class="tn-search"
             aria-label="Show only this entrant's games"
             placeholder="only this entrant">
      <span id="tournament-shown" class="muted small" role="status"></span>
    </div>
    <div id="tournament-body"></div>
    <!-- The fallback, and last because it is one: for a tournament this board
         cannot find - inscribed to a wallet it does not watch, or newer than
         the directory has read - and for anybody who already knows the number. -->
    <div class="row tn-controls tn-byhand">
      <label for="tournament-id">Open by inscription number</label>
      <input type="text" id="tournament-id" class="tn-manifest" inputmode="numeric"
             maxlength="12" size="12" placeholder="2993">
      <button class="action" id="tournament-load">Show</button>
    </div>
  </section>

  <section id="view-help" class="panel hide">
    <h2>How this works</h2>
    <!-- The essentials are BUILT IN and need no reads, because a manual that
         only exists when a lookup succeeds is not a manual. The rest is
         inscribed and found by wallet, so it can be corrected after this board
         is permanent - see packages/protocol/docs.ts. -->
    <div id="help-body"></div>
    <div id="help-note" class="notice notice--info"></div>
  </section>

  <section id="view-profile" class="panel hide">
    <h2>Profile</h2>
    <div class="field">
      <label for="profile-who">Address ${info(
        'i-profile-who',
        'Any Stacks address. This reads what the chain says about it and nothing else - ' +
          'there is no account here to look up, because there are no accounts.'
      )}</label>
      <input type="text" id="profile-who" placeholder="a Stacks address">
    </div>
    <div class="row"><button class="action" id="profile-load">Show</button></div>
    <div id="profile-body"></div>

    <h2 style="margin-top:18px">Claim a name ${info(
      'i-claim-what',
      'A short document you inscribe from this wallet, saying what it should be called. ' +
        'Inscribing costs a signed transaction, so a manifest made BY an address is that ' +
        'key attesting - which is why a name cannot be bought, sold or given away. It can ' +
        'only be inscribed by the key it names.'
    )}</h2>
    <div id="claim-name-why" class="small muted"></div>

    <div class="notice notice--info" id="claim-order">
      <b>Four things can name an address, and the strongest wins.</b>
      ${info(
        'i-name-order',
        'A BNS name is owned in a registry and can be transferred, so it is the strongest ' +
          'claim and outranks anything inscribed here - if you own one, this board shows it ' +
          'whatever your manifest says. Below that: a manifest the address inscribed about ' +
          'itself, then a name a tournament organiser gave it, then the shortened address, ' +
          'which is simply true. The board says which of the four it is using.'
      )}
    </div>

    <div class="field">
      <label for="claim-name">Name ${info(
        'i-claim-name',
        'Up to 24 characters, because this appears beside a game rather than on a profile ' +
          'page, and a name that does not fit a column is one the board has to truncate.'
      )}</label>
      <input type="text" id="claim-name" maxlength="24" placeholder="what the board should call you">
    </div>
    <div class="field">
      <label for="claim-about">About ${info(
        'i-claim-about',
        'Optional, one line, 140 characters. Every byte is inscribed once and kept for ever, ' +
          'so this is a label rather than a biography.'
      )}</label>
      <input type="text" id="claim-about" maxlength="140" placeholder="optional, one line">
    </div>
    <div class="row"><button class="action" id="claim-build">Build my manifest</button></div>
    <div id="claim-problems" class="notice notice--warn hide"></div>
    <pre id="claim-manifest" class="claim-out hide"></pre>
    <div class="small muted" id="claim-next">
      This board cannot inscribe it. ${info(
        'i-claim-next',
        'It holds no key and never will, being an inscription itself - a page that collected ' +
          'one would be wrong for ever. Copy the text above and inscribe it from this wallet ' +
          'with your own Xtrata tooling. Once it is on chain, this board finds it by reading ' +
          'what the wallet holds and checks that the same wallet minted it.'
      )}
    </div>
  </section>

  <footer class="small muted" style="padding:12px 0">
    <span id="contract-label"></span>
    <span id="endpoint-label"></span>
  </footer>
</main>
`;

export const SHELL = { css: CSS, html: HTML };
