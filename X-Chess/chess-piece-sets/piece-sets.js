/**
 * chess-piece-sets — ten drawn chess sets, as SVG paths.
 *
 * Self-contained: no build step, no dependencies, no network. Import the ESM
 * module directly, or load `piece-sets.iife.js` and read `window.ChessPieceSets`.
 *
 * THREE RULES THE WHOLE FILE OBEYS, because they are what make the sets
 * interchangeable and what make them drop into an existing board:
 *
 *   1. Every piece is drawn inside the SAME `0 0 45 45` box, and proportion is
 *      built into the artwork rather than applied on top of it. A pawn reaches
 *      y=14 and a king reaches y=4 in every set, so swapping sets never
 *      disturbs the relative sizes and there is no scale table to maintain.
 *
 *   2. Every shape is a `<path>`. Not a `<circle>`, not a `<rect>`, even where
 *      one would be shorter. Board stylesheets almost always select on the
 *      element (`.piece--white path { fill: … }`), and a `<circle>` sitting in
 *      the middle of such a set silently keeps its default black fill.
 *      `pathCircle()` and `pathRoundRect()` below exist for exactly this.
 *
 *   3. Colour is never baked in, and it travels ONLY by inheritance.
 *
 *      This is the one rule that is not a matter of taste, and it is worth
 *      spelling out because getting it wrong produces a board of thirty-two
 *      black pieces with no error anywhere.
 *
 *      A board draws its pieces with `<use href="#xp-k">`, and the content of
 *      a `<use>` lives in a shadow tree. Selectors from the outer document DO
 *      NOT REACH INTO IT. `.piece--white path { fill: white }` matches
 *      nothing; so does `.xcp .xb`. The only things that cross the boundary
 *      are INHERITED properties and CUSTOM properties.
 *
 *      So both of those are all this library uses:
 *
 *        .xb  body     declares no fill and no stroke at all, and inherits
 *                      both from the host `<svg>` around the `<use>`
 *        .xd  detail   inline `fill: var(--xcp-detail)`
 *        .xs  detail   inline `stroke: var(--xcp-detail)`, no fill
 *        .xg  body     inline gradient fill (the turned set only)
 *        .xh  specular inline `fill: var(--xcp-spec)`
 *
 *      Inline rather than in the stylesheet for the same reason: a rule in
 *      piece-sets.css cannot select these elements once they are cloned, but
 *      an inline declaration is cloned along with them, and the `var()` inside
 *      it resolves against the values inherited from the host.
 *
 *      `--xcp-detail` is dark on a white piece and light on a black one, which
 *      is why a bishop's slit and a knight's eye survive the colour flip
 *      instead of disappearing into the fill. Setting it to `transparent` is
 *      how the ghost state drops every detail without a selector.
 *
 *      The classes are still on every path. They do nothing through `<use>`,
 *      but they are how you restyle the inline form and how you find a shape
 *      in devtools, so they are worth their bytes.
 */

export const PIECE_KEYS = ['k', 'q', 'r', 'b', 'n', 'p'];

export const PIECE_NAMES = {
  k: 'king',
  q: 'queen',
  r: 'rook',
  b: 'bishop',
  n: 'knight',
  p: 'pawn'
};

/** Engine piece type (1-6) to the key used here, matching the usual ordering. */
export const KEY_BY_TYPE = { 1: 'p', 2: 'n', 3: 'b', 4: 'r', 5: 'q', 6: 'k' };

/* ------------------------------------------------------------------ *
 * Geometry helpers
 *
 * Rule 2 above means no `<circle>` and no `<rect>`, so the two shapes a
 * chess set cannot do without get written as path data instead.
 * ------------------------------------------------------------------ */

const n = (v) => String(Math.round(v * 100) / 100);

/** A circle, as path data. Two half-arcs, because one full arc is degenerate. */
function pathCircle(cx, cy, r) {
  return `M${n(cx - r)} ${n(cy)}a${n(r)} ${n(r)} 0 1 0 ${n(r * 2)} 0a${n(r)} ${n(r)} 0 1 0 ${n(-r * 2)} 0z`;
}

/** A rounded rectangle, as path data. */
function pathRoundRect(x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  return (
    `M${n(x + rr)} ${n(y)}h${n(w - rr * 2)}a${n(rr)} ${n(rr)} 0 0 1 ${n(rr)} ${n(rr)}` +
    `v${n(h - rr * 2)}a${n(rr)} ${n(rr)} 0 0 1 ${n(-rr)} ${n(rr)}` +
    `h${n(-(w - rr * 2))}a${n(rr)} ${n(rr)} 0 0 1 ${n(-rr)} ${n(-rr)}` +
    `v${n(-(h - rr * 2))}a${n(rr)} ${n(rr)} 0 0 1 ${n(rr)} ${n(-rr)}z`
  );
}

/**
 * A symmetric stepped silhouette, for the pixel set.
 *
 * `bands` is a list of `[yTop, halfWidth]` read top to bottom. Writing the
 * pixel pieces as literal path strings is possible but not checkable by eye -
 * one transposed digit and a piece is quietly lopsided. Generating both sides
 * from one list makes asymmetry impossible rather than unlikely.
 */
function stepped(bands, bottom, cx = 22.5) {
  let d = `M${n(cx - bands[0][1])} ${n(bands[0][0])}H${n(cx + bands[0][1])}`;
  for (let i = 1; i < bands.length; i++) d += `V${n(bands[i][0])}H${n(cx + bands[i][1])}`;
  d += `V${n(bottom)}H${n(cx - bands[bands.length - 1][1])}`;
  for (let i = bands.length - 1; i > 0; i--) d += `V${n(bands[i][0])}H${n(cx - bands[i - 1][1])}`;
  return d + 'Z';
}

/* ------------------------------------------------------------------ *
 * Shared furniture
 *
 * Bases and collars repeat across the pieces of one set. Naming them keeps a
 * set internally consistent - if a king and a queen disagree about where the
 * floor is, the board looks wrong in a way that is hard to point at.
 * ------------------------------------------------------------------ */

// Set 2, classic Staunton.
const ST_FOOT = ['xb', 'M10.5 37.4h24l2.6 5.1H7.9z'];
const ST_COLLAR = ['xb', 'M13 33h19l1.6 4.4H11.4z'];

// Set 3, rounded app-icon. Pills rather than trapezoids.
const RD_FOOT = ['xb', pathRoundRect(8.5, 36, 28, 6.4, 3.2)];
const RD_COLLAR = ['xb', pathRoundRect(12.4, 30.6, 20.2, 5.4, 2.7)];

// Set 4, thin line-art. Shallower and wider, which is what reads as "elegant".
const LA_FOOT = ['xb', 'M10.8 38.4h23.4l2 3.8H8.8z'];
const LA_COLLAR = ['xb', 'M14 33.4h17l1.2 3.2H12.8z'];

// Set 5, gothic. Two stepped plinths.
const GO_FOOT = ['xb', 'M8.8 37.8h27.4l1.8 4.4H7z'];
const GO_STEP = ['xb', 'M11.4 34h22.2l1.4 3.4H10z'];

// Set 8, art deco. A ziggurat, so three steps.
const AD_FOOT = ['xb', 'M9.4 37.2h26.2l1.8 5H7.6z'];
const AD_STEP = ['xb', 'M12.4 33.2h20.2l1.4 3.6H11z'];

// Set 9, sci-fi. One angular flare, no curves anywhere in the set.
const SF_FOOT = ['xb', 'M12.6 34.6h19.8l4.4 7.6H8.2z'];

// Set 6, Bauhaus. A half-disc has depth equal to its radius, so the only way
// to widen one of these bases is to raise it - and every base still has to
// land on y=42 with the others. Four radii, four matching tops.
const BH_DOME = ['xb', 'M9.5 29a13 13 0 0 0 26 0z'];
const BH_DOME_B = ['xb', 'M11 30.5a11.5 11.5 0 0 0 23 0z'];
const BH_DOME_P = ['xb', 'M12 31.5a10.5 10.5 0 0 0 21 0z'];

/* ------------------------------------------------------------------ *
 * The knight
 *
 * The hardest piece in every set, and the reason is structural: the other five
 * read by their outline and are symmetric about the centre line, so a mistake
 * shows up as an obvious lean. The knight reads by PROFILE. It faces left, it
 * is meant to be asymmetric, and so a badly placed jaw does not look like an
 * error - it just looks like a bad horse.
 *
 * Every knight here is built from the same landmarks in the same order, which
 * is what keeps ten different horses recognisably the same animal:
 * muzzle, forehead, ear, crest, neck, shoulder, throat, back to muzzle.
 * ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ *
 * The sets
 * ------------------------------------------------------------------ */

export const SETS = {
  /* 1 ------------------------------------------------------------- */
  minimal: {
    name: 'Ultra-Minimal Geometric',
    note: 'Triangles, circles and one square. No curve that is not a whole circle.',
    strokeWidth: 1.6,
    linejoin: 'miter',
    pieces: {
      k: [
        ['xb', 'M20.8 5h3.4v3.8h3.8v3.4h-3.8V16h-3.4v-3.8H17V8.8h3.8z'],
        ['xb', 'M11 19h23L22.5 30 34 41H11l11.5-11z']
      ],
      q: [
        ['xb', pathCircle(22.5, 10, 3.3)],
        ['xb', 'M11 19h23L22.5 30 34 41H11l11.5-11z']
      ],
      r: [
        ['xb', 'M16.5 11.5h12V19h-12z'],
        ['xb', 'M15 22h15l4 19H11z']
      ],
      b: [
        ['xb', 'M22.5 7.6 28 15.4l-5.5 7.8L17 15.4z'],
        ['xb', 'M22.5 24.6 33.5 41h-22z']
      ],
      n: [
        ['xb', 'M11.5 41V23L21.5 8.8l4.6 3.3-3.9 5.5h11.3V41z'],
        ['xd', 'M11.5 32.6h22V35h-22z']
      ],
      p: [
        ['xb', pathCircle(22.5, 17.4, 3.7)],
        ['xb', 'M22.5 22.6 32 41H13z']
      ]
    }
  },

  /* 2 ------------------------------------------------------------- */
  staunton: {
    name: 'Classic Staunton',
    note: 'The tournament standard: turned collars, a flared foot, a mitre with a slit.',
    strokeWidth: 1.05,
    linejoin: 'round',
    pieces: {
      k: [
        ['xb', 'M21.1 3.4h2.8v3.4h3.4v2.8h-3.4v3.4h-2.8V9.6h-3.4V6.8h3.4z'],
        ['xb', 'M22.5 13.4c-4 0-6.8 2.2-6.8 5.3 0 2.4 1.6 4.4 3.7 5.9h6.2c2.1-1.5 3.7-3.5 3.7-5.9 0-3.1-2.8-5.3-6.8-5.3z'],
        ['xb', 'M18.6 24.6h7.8c.9 3.7 3 6.6 6.1 8.4H12.5c3.1-1.8 5.2-4.7 6.1-8.4z'],
        ST_COLLAR,
        ST_FOOT
      ],
      q: [
        ['xb', pathCircle(8.7, 13.6, 2.3)],
        ['xb', pathCircle(15.6, 10.5, 2.3)],
        ['xb', pathCircle(22.5, 9, 2.5)],
        ['xb', pathCircle(29.4, 10.5, 2.3)],
        ['xb', pathCircle(36.3, 13.6, 2.3)],
        ['xb', 'M9.2 16.9 12.7 28.2h19.6l3.5-11.3-5.7 5.5-3.4-8.5-4.2 8.9-4.2-8.9-3.4 8.5z'],
        ['xb', 'M13 28.8h19c.3 1.6.9 3 1.8 4.2H11.2c.9-1.2 1.5-2.6 1.8-4.2z'],
        ST_COLLAR,
        ST_FOOT
      ],
      r: [
        ['xb', 'M11 9.4h5.1v3.3h4.2V9.4h4.4v3.3h4.2V9.4H34v8.3l-3 2.6v10.1l3 2.6v3.8H11v-3.8l3-2.6V20.3l-3-2.6z'],
        ['xb', 'M9.6 36h25.8l2.6 6.2H7z']
      ],
      b: [
        ['xb', pathCircle(22.5, 9.7, 2.4)],
        ['xb', 'M22.5 11.4c-4.7 3.3-7.5 8-7.5 12.2 0 3 1.7 5.2 4.1 6.3h6.8c2.4-1.1 4.1-3.3 4.1-6.3 0-4.2-2.8-8.9-7.5-12.2z'],
        ['xd', 'M20.4 20.6 25 15.4l1.9 1.7-4.6 5.2z'],
        ['xb', 'M15.4 30.6h14.2l1.3 3.2H14.1z'],
        ST_COLLAR,
        ST_FOOT
      ],
      n: [
        ['xb', 'M9 21.6c1.6-2.7 3.5-5 5.6-6.8l.6-4.8 2.7 3 1.4-5.1 2.3 4.7c4.5.6 8 3.1 10.5 7.4 2.3 4 3.2 8.1 2.9 13.2H11c-.4-2.4.1-4.7 1.5-6.8 1-1.4 1.6-2.8 1.8-4l-4.5 1.6c-1.6.6-2.5-.1-2.4-1.5z'],
        ['xd', pathCircle(16.4, 17.6, 1)],
        ST_COLLAR,
        ST_FOOT
      ],
      p: [
        ['xb', pathCircle(22.5, 17, 4.1)],
        ['xb', 'M18.7 21.6h7.6c-.4 1.9 0 3.7 1.2 5.4 1.5 2.1 2.5 4.1 3.1 6H14.4c.6-1.9 1.6-3.9 3.1-6 1.2-1.7 1.6-3.5 1.2-5.4z'],
        ST_COLLAR,
        ST_FOOT
      ]
    }
  },

  /* 3 ------------------------------------------------------------- */
  rounded: {
    name: 'Rounded Modern',
    note: 'App-icon weight: fat strokes, round joins, pill bases. Survives being shrunk.',
    strokeWidth: 2.1,
    linejoin: 'round',
    linecap: 'round',
    pieces: {
      k: [
        ['xb', 'M21.9 3.4h1.2a1.3 1.3 0 0 1 1.3 1.3v2.6h2.6a1.3 1.3 0 0 1 1.3 1.3v1.2a1.3 1.3 0 0 1-1.3 1.3h-2.6v2.6a1.3 1.3 0 0 1-1.3 1.3h-1.2a1.3 1.3 0 0 1-1.3-1.3v-2.6h-2.6a1.3 1.3 0 0 1-1.3-1.3V8.6a1.3 1.3 0 0 1 1.3-1.3h2.6V4.7a1.3 1.3 0 0 1 1.3-1.3z'],
        ['xb', 'M22.5 15.4c-4.4 0-7.4 2.5-7.4 5.9 0 2.7 1.8 4.9 4.2 6.5h6.4c2.4-1.6 4.2-3.8 4.2-6.5 0-3.4-3-5.9-7.4-5.9z'],
        ['xb', 'M18.6 27.6h7.8c.8 1.7 1.9 2.8 3.4 3.5H15.2c1.5-.7 2.6-1.8 3.4-3.5z'],
        RD_COLLAR,
        RD_FOOT
      ],
      q: [
        ['xb', pathCircle(8.8, 14, 2.9)],
        ['xb', pathCircle(15.6, 10.4, 2.9)],
        ['xb', pathCircle(22.5, 8.8, 3.1)],
        ['xb', pathCircle(29.4, 10.4, 2.9)],
        ['xb', pathCircle(36.2, 14, 2.9)],
        ['xb', 'M9 17.6 12.6 28h19.8l3.6-10.4-6 5-3.5-7.6-4 7.9-4-7.9-3.5 7.6z'],
        ['xb', 'M13 27.8h19c.2 1.2.6 2.1 1.2 2.9H11.8c.6-.8 1-1.7 1.2-2.9z'],
        RD_COLLAR,
        RD_FOOT
      ],
      r: [
        ['xb', 'M13.1 8.8h1.8a1.6 1.6 0 0 1 1.6 1.6v2.2h3.5v-2.2a1.6 1.6 0 0 1 1.6-1.6h1.8a1.6 1.6 0 0 1 1.6 1.6v2.2h3.5v-2.2a1.6 1.6 0 0 1 1.6-1.6h1.8a1.6 1.6 0 0 1 1.6 1.6v7.4l-2.8 2.6v8.6l2.8 2.6v4.6H11.5v-4.6l2.8-2.6v-8.6l-2.8-2.6v-7.4a1.6 1.6 0 0 1 1.6-1.6z'],
        RD_FOOT
      ],
      b: [
        ['xb', pathCircle(22.5, 9.2, 2.6)],
        ['xb', 'M22.5 11c-4.6 3.6-7.2 8.1-7.2 12 0 3.3 2 5.8 4.7 6.9h5c2.7-1.1 4.7-3.6 4.7-6.9 0-3.9-2.6-8.4-7.2-12z'],
        ['xd', 'M20.4 20.9 25 15.6l2.1 1.9-4.6 5.3z'],
        RD_COLLAR,
        RD_FOOT
      ],
      n: [
        ['xb', 'M9.4 22.2c1.7-3.1 3.9-5.6 6.4-7.5l.5-5.2 3 3.2 1.5-5.4 2.5 5c4.7.8 8.2 3.6 10.6 8.2 2.2 4.2 3 8.7 2.6 13.7H11.4c-.6-2.8 0-5.2 1.7-7.3 1.1-1.4 1.7-2.7 1.9-3.9l-4.6 1.7c-1.7.6-2.6-.3-2-2z'],
        ['xd', pathCircle(16.6, 17.6, 1.2)],
        RD_COLLAR,
        RD_FOOT
      ],
      p: [
        ['xb', pathCircle(22.5, 16.4, 4.8)],
        ['xb', 'M18 21.8h9c-.4 2.2.2 4.2 1.6 6 1.3 1.7 2.1 3 2.5 4.1H13.9c.4-1.1 1.2-2.4 2.5-4.1 1.4-1.8 2-3.8 1.6-6z'],
        RD_COLLAR,
        RD_FOOT
      ]
    }
  },

  /* 4 ------------------------------------------------------------- */
  lineart: {
    name: 'Elegant Line-Art',
    note: 'Hairline strokes and narrow waists. Turned rings drawn rather than implied.',
    strokeWidth: 0.85,
    linejoin: 'round',
    pieces: {
      k: [
        ['xb', 'M21.6 2.8h1.8v3.4H27V8h-3.6v3.4h-1.8V8H18V6.2h3.6z'],
        ['xb', 'M22.5 12.2c-3.4 0-5.8 1.9-5.8 4.6 0 2.2 1.4 4 3.3 5.4h5c1.9-1.4 3.3-3.2 3.3-5.4 0-2.7-2.4-4.6-5.8-4.6z'],
        ['xb', 'M19.7 22.8h5.6c.7 4.1 2.9 7.5 6.5 10.2H13.2c3.6-2.7 5.8-6.1 6.5-10.2z'],
        ['xs', 'M17.2 26.6h10.6'],
        LA_COLLAR,
        LA_FOOT
      ],
      q: [
        ['xb', pathCircle(9.2, 13.4, 1.9)],
        ['xb', pathCircle(15.8, 10.4, 1.9)],
        ['xb', pathCircle(22.5, 9, 2.1)],
        ['xb', pathCircle(29.2, 10.4, 1.9)],
        ['xb', pathCircle(35.8, 13.4, 1.9)],
        ['xb', 'M9.6 16.4 13 27.4h19l3.4-11-5.5 5.4-3.4-8.2-4 8.6-4-8.6-3.4 8.2z'],
        ['xb', 'M14 28h17c.3 2.2 1.2 3.9 2.6 5.2H11.4c1.4-1.3 2.3-3 2.6-5.2z'],
        ['xs', 'M12.6 30.8h19.8'],
        LA_COLLAR,
        LA_FOOT
      ],
      r: [
        ['xb', 'M12 9.6h4.6v3.2h4V9.6h3.8v3.2h4V9.6H33v7.8l-2.8 2.4v10.4l2.8 2.4v3.6H12v-3.6l2.8-2.4V19.8L12 17.4z'],
        ['xs', 'M14.8 19.8h15.4M14.8 29.8h15.4'],
        LA_FOOT
      ],
      b: [
        ['xb', pathCircle(22.5, 9.4, 1.9)],
        ['xb', 'M22.5 10.8c-4.4 3.4-7 7.9-7 12 0 3 1.7 5.2 4.1 6.4h5.8c2.4-1.2 4.1-3.4 4.1-6.4 0-4.1-2.6-8.6-7-12z'],
        ['xs', 'M20.6 21.2 25.2 15.8'],
        ['xb', 'M16.4 29.8h12.2c.6 1.8 1.6 3 2.9 3.6H13.5c1.3-.6 2.3-1.8 2.9-3.6z'],
        LA_COLLAR,
        LA_FOOT
      ],
      n: [
        ['xb', 'M9.6 21.2c1.6-2.8 3.5-5 5.5-6.7l.6-4.6 2.7 2.9 1.3-5 2.3 4.6c4.4.7 7.8 3.2 10.2 7.5 2.2 4 3 8.2 2.6 13.3H11.4c-.5-2.5 0-4.8 1.5-6.9 1-1.4 1.6-2.7 1.7-3.8l-4.4 1.6c-1.5.5-2.3-.2-2.2-1.5z'],
        ['xs', 'M20.4 12.6c4 2.2 6.4 5.8 7.2 10.8M17.6 18.6c-1.4 1.6-3 2.8-4.8 3.6'],
        ['xd', pathCircle(16.6, 17.4, .85)],
        LA_COLLAR,
        LA_FOOT
      ],
      p: [
        ['xb', pathCircle(22.5, 16.8, 3.7)],
        ['xb', 'M19.4 21h6.2c-.3 1.9.1 3.6 1.2 5.2 1.5 2.2 2.5 4.6 3 7.2H15.2c.5-2.6 1.5-5 3-7.2 1.1-1.6 1.5-3.3 1.2-5.2z'],
        LA_COLLAR,
        LA_FOOT
      ]
    }
  },

  /* 5 ------------------------------------------------------------- */
  gothic: {
    name: 'Gothic Ornamental',
    note: 'Pointed arches, crocketed crowns, tracery. The tallest set here.',
    strokeWidth: 1,
    linejoin: 'round',
    pieces: {
      k: [
        ['xb', 'M21.4 2.4h2.2v2.8h2.8v2.2h-2.8v2.8h-2.2V7.4h-2.8V5.2h2.8z'],
        ['xb', 'M22.5 10.6c-1.6 1.8-3.4 2.8-5.4 3l1 3.4h8.8l1-3.4c-2-.2-3.8-1.2-5.4-3z'],
        ['xb', 'M13.6 17.6h17.8l-1.6 5.2c1.8 3.4 2.8 7 3 10.8H12.2c.2-3.8 1.2-7.4 3-10.8z'],
        ['xd', 'M22.5 21.6l2.4 4.2-2.4 4.2-2.4-4.2z'],
        ['xs', 'M17 24.4c-1 2.6-1.5 5.4-1.6 8.4M28 24.4c1 2.6 1.5 5.4 1.6 8.4'],
        GO_STEP,
        GO_FOOT
      ],
      q: [
        // A shade below the king's cross. A gothic crown wants to climb, and
        // a queen that out-tops her king is the one proportion error nobody
        // forgives.
        ['xb', pathCircle(11.4, 9.6, 1.7)],
        ['xb', pathCircle(17, 6.6, 1.7)],
        ['xb', pathCircle(22.5, 4.8, 1.8)],
        ['xb', pathCircle(28, 6.6, 1.7)],
        ['xb', pathCircle(33.6, 9.6, 1.7)],
        ['xb', 'M11.4 10.6 13.8 19h17.4l2.4-8.4-5.6 5.4-2.4-8.8-3.1 9-3.1-9-2.4 8.8z'],
        ['xb', 'M13.4 19.8h18.2l-1.4 4.4c1.4 2.8 2.2 5.8 2.4 9H12.4c.2-3.2 1-6.2 2.4-9z'],
        ['xd', 'M22.5 25.2l2 3.6-2 3.6-2-3.6z'],
        ['xs', 'M17.6 26.2c-.9 2.2-1.4 4.6-1.5 7M27.4 26.2c.9 2.2 1.4 4.6 1.5 7'],
        GO_STEP,
        GO_FOOT
      ],
      r: [
        ['xb', 'M10.6 8.8h4.8v3.4h3.6V8.8h7V12.2h3.6V8.8h4.8V16H10.6z'],
        ['xb', 'M12.6 16.8h19.8v16.8H12.6z'],
        ['xd', 'M16 20.4h2.6v6.4H16zM21.2 20.4h2.6v6.4h-2.6zM26.4 20.4h2.6v6.4h-2.6z'],
        ['xs', 'M12.6 29.6h19.8'],
        GO_STEP,
        GO_FOOT
      ],
      b: [
        ['xb', 'M21.5 4h2v2.2h2.2v2h-2.2v2.2h-2V8.2h-2.2v-2h2.2z'],
        ['xb', 'M22.5 9.8c-4.8 4.6-7.4 10.2-7.4 15.4 0 3.6 1.8 6.4 4.4 8.2h6c2.6-1.8 4.4-4.6 4.4-8.2 0-5.2-2.6-10.8-7.4-15.4z'],
        ['xd', 'M22.5 16.4c-1.8 2.2-2.8 4.6-2.8 7 0 1.8.9 3.2 2.8 4.4 1.9-1.2 2.8-2.6 2.8-4.4 0-2.4-1-4.8-2.8-7z'],
        ['xs', 'M17.6 27.8h9.8'],
        GO_STEP,
        GO_FOOT
      ],
      n: [
        ['xb', 'M8.8 21.4c1.8-3 3.9-5.4 6.2-7.2l.4-5.2 3 3.2 1.4-5.6 2.6 5c2.6.4 4.8 1.4 6.6 3l1.8-2.6 1 4.6c2.2 3.8 3.2 8.6 2.8 14.4H11c-.5-2.6.1-5 1.7-7.2 1-1.4 1.6-2.7 1.8-3.9l-4.5 1.6c-1.6.6-2.5-.2-2.2-1.6z'],
        ['xs', 'M24 13.4c2.6 1.8 4.4 4.4 5.4 7.8M22.2 17.2c1.6 1.4 2.7 3.2 3.3 5.4M13.6 20.8c-.8.8-1.7 1.4-2.6 1.8'],
        ['xd', pathCircle(16.6, 17.2, 1)],
        GO_STEP,
        GO_FOOT
      ],
      p: [
        ['xb', pathCircle(22.5, 13, 3.4)],
        ['xb', 'M18.4 16.8h8.2l-1 3.6c1.6 3 2.5 6.4 2.7 10.2H16.7c.2-3.8 1.1-7.2 2.7-10.2z'],
        ['xd', 'M22.5 22.4l1.8 3.2-1.8 3.2-1.8-3.2z'],
        GO_STEP,
        GO_FOOT
      ]
    }
  },

  /* 6 ------------------------------------------------------------- */
  bauhaus: {
    name: 'Bauhaus Abstract',
    note: 'Circle, half-circle, square, triangle. Nothing else is allowed in.',
    strokeWidth: 1.4,
    linejoin: 'miter',
    pieces: {
      k: [
        ['xb', 'M20.9 4.4h3.2V8h3.6v3.2h-3.6v3.6h-3.2v-3.6h-3.6V8h3.6z'],
        ['xb', 'M12.4 19.6a10.1 10.1 0 0 0 20.2 0z'],
        BH_DOME
      ],
      q: [
        ['xb', 'M22.5 5.6 27.4 11l-4.9 5.4L17.6 11z'],
        ['xb', 'M12.4 19.6a10.1 10.1 0 0 0 20.2 0z'],
        BH_DOME
      ],
      r: [
        ['xb', 'M13.9 10.4h4v3h2.6v-3h4v3h2.6v-3h4v10.4H13.9z'],
        ['xb', 'M19.5 21.6h6v10.2h-6z'],
        ['xb', 'M10.5 33.4h24v8.6h-24z']
      ],
      b: [
        ['xb', 'M22.5 6 29 17.4H16z'],
        ['xb', pathCircle(22.5, 22.6, 4.6)],
        ['xs', 'M19.2 25.9 25.8 19.3'],
        BH_DOME_B
      ],
      // Rectangle, quarter-disc, triangle - and the same dome every other
      // piece in the set stands on. An angular wedge would read as a knight
      // too, but it would be the minimal set's knight with a different stroke
      // width, and it would be the one piece here not built from a primitive.
      n: [
        ['xb', 'M9.4 18.2h10.4v6.6H9.4z'],
        ['xb', 'M14.6 29.4V18.6A11 11 0 0 1 25.6 7.6h5.2v21.8z'],
        ['xb', 'M20.4 6.6 24.2 11.6h-7.6z'],
        ['xd', pathCircle(18.4, 15.4, 1.6)],
        BH_DOME
      ],
      p: [
        ['xb', pathCircle(22.5, 20.5, 4.5)],
        BH_DOME_P
      ]
    }
  },

  /* 7 ------------------------------------------------------------- */
  pixel: {
    name: 'Blocky Pixel',
    note: 'Everything snapped to a 1.5-unit grid, so the steps stay square at any size.',
    strokeWidth: 1,
    linejoin: 'miter',
    pieces: {
      k: [
        ['xb', 'M21 4.5h3V9h4.5v3H24v4.5h-3V12h-4.5V9H21z'],
        ['xb', stepped([[16.5, 4.5], [19.5, 6], [22.5, 7.5], [27, 6], [31.5, 7.5], [36, 9], [39, 10.5]], 42)]
      ],
      // The centre spike rises to 7.5 and the rook's merlons start at 12, so
      // the queen out-tops the rook. On the grid it is easy to lose that
      // ordering: the crenellations want to sit high, and a rook taller than
      // its queen looks wrong long before you work out why.
      q: [
        ['xb', 'M10.5 15h3v3h3v-6h3V18h1.5v-12h3V18h1.5v-6h3V18h3v-3h3v6h-24z'],
        ['xb', stepped([[21, 7.5], [24, 6], [28.5, 7.5], [33, 6], [36, 9], [39, 10.5]], 42)]
      ],
      r: [
        ['xb', 'M12 12h4.5v3H21v-3h3v3h4.5v-3H33v6H12z'],
        ['xb', stepped([[18, 10.5], [21, 6], [33, 7.5], [36, 9], [39, 10.5]], 42)]
      ],
      b: [
        ['xb', stepped([[7.5, 1.5], [10.5, 3], [13.5, 4.5], [16.5, 6], [21, 7.5], [27, 4.5], [30, 6], [33, 4.5], [36, 9], [39, 10.5]], 42)],
        ['xd', 'M21 18h3v6h-3z']
      ],
      // Ears at y=9, one cell below the bishop's mitre. On a grid a knight's
      // ear is the highest thing you draw and it wants to keep climbing, but
      // the ear is a detail and the mitre is the piece.
      n: [
        ['xb', 'M18 9H21V12H24V15H27V18H30V21H31.5V24H33V27H34.5V33H36V42H9V33H12V27H13.5V24H10.5V21H9V18H12V15H16.5V12H18Z'],
        ['xd', 'M16.5 15h3v3h-3zM10.5 19.5h3V21h-3z']
      ],
      p: [
        ['xb', stepped([[18, 3], [21, 4.5], [24, 3], [27, 6], [31.5, 4.5], [36, 7.5], [39, 9]], 42)]
      ]
    }
  },

  /* 8 ------------------------------------------------------------- */
  deco: {
    name: 'Art Deco',
    note: 'Fluted columns on ziggurat plinths, everything mirrored about the centre.',
    strokeWidth: 1.05,
    linejoin: 'miter',
    pieces: {
      // A stepped crown rather than the obvious triangle. The pawn is already
      // a triangle on a fluted column, and a king that is the same drawing
      // scaled up is a king you have to measure to identify.
      k: [
        ['xb', 'M20.9 3.2h3.2v2.6h2.8v2.4h2.6v3.4H15.5V8.2h2.6V5.8h2.8z'],
        ['xb', 'M15.4 12.4h14.2l1.6 3.8H13.8z'],
        ['xb', 'M17.2 16.8h10.6v16.2H17.2z'],
        ['xd', 'M19 19h1.4v11.6H19zM21.8 19h1.4v11.6h-1.4zM24.6 19H26v11.6h-1.4z'],
        AD_STEP,
        AD_FOOT
      ],
      // The fan. Five tapered rays, symmetric about 22.5 and wide enough to
      // hold a fill - thin ones read as a comb rather than a crown.
      q: [
        ['xb', 'M13.6 7.6 15.6 17h-4zM18.2 5.2 20.4 17h-4.4zM22.5 4 24.7 17h-4.4zM26.8 5.2 29 17h-4.4zM31.4 7.6 33.4 17h-4z'],
        ['xb', 'M11.4 17h22.2l1.8 4.2H9.6z'],
        ['xb', 'M17.4 21.2h10.2v11.8H17.4z'],
        ['xd', 'M19.2 23.4h1.3v7.4h-1.3zM21.9 23.4h1.3v7.4h-1.3zM24.6 23.4h1.3v7.4h-1.3z'],
        AD_STEP,
        AD_FOOT
      ],
      r: [
        ['xb', 'M12.6 9.4h4.6v3.4h2.8V9.4h5v3.4h2.8V9.4h4.6v6.6H12.6z'],
        ['xb', 'M15 16.6h15v16.4H15z'],
        ['xd', 'M17.4 19.4h1.6v10.8h-1.6zM21.7 19.4h1.6v10.8h-1.6zM26 19.4h1.6v10.8H26z'],
        AD_STEP,
        AD_FOOT
      ],
      b: [
        ['xb', 'M22.5 5.2 28.8 13.4l-6.3 8.6-6.3-8.6z'],
        ['xd', 'M22.5 9.8l2.9 4-2.9 4-2.9-4z'],
        ['xb', 'M16.4 22.4h12.2l1.4 3.4H15z'],
        ['xb', 'M18 26.4h9v6.6h-9z'],
        AD_STEP,
        AD_FOOT
      ],
      n: [
        ['xb', 'M8.6 22.4 14.6 13l.6-5.4 3.2 3.4 1.4-5.4 2.6 5.4 11 12v10H10.8l4-7.4-6.2 2.2z'],
        ['xd', 'M16.4 15.8h2.4v2.4h-2.4z'],
        ['xs', 'M22.8 14.6 30.2 22.8M20.2 18.4l6.4 7'],
        AD_STEP,
        AD_FOOT
      ],
      p: [
        ['xb', 'M22.5 9.4 27 15.6h-9z'],
        ['xb', 'M17 16.4h11l1.2 3.2H15.8z'],
        ['xb', 'M18.6 20.2h7.8v12.8h-7.8z'],
        ['xd', 'M20.3 22.4h1.3v8.2h-1.3zM23.4 22.4h1.3v8.2h-1.3z'],
        AD_STEP,
        AD_FOOT
      ]
    }
  },

  /* 9 ------------------------------------------------------------- */
  scifi: {
    name: 'Futuristic',
    note: 'Faceted, no curve in any silhouette, and a lit core knocked out of each body.',
    strokeWidth: 1.05,
    linejoin: 'miter',
    pieces: {
      k: [
        ['xb', 'M21 3.6h3v3.8h3.8v3h-3.8v3.8h-3v-3.8h-3.8v-3H21z'],
        ['xb', 'M22.5 14.6 30.6 19v9.4h-16.2V19z'],
        ['xd', pathCircle(22.5, 22, 2.5)],
        ['xb', 'M16.4 29h12.2l2.4 5.2H14z'],
        SF_FOOT
      ],
      q: [
        ['xb', 'M9.4 14.6 22.5 5.6l13.1 9-3.6 13.4H13z'],
        ['xd', 'M22.5 12.4 27 18.2l-4.5 5.8-4.5-5.8z'],
        ['xb', 'M14.2 28.8h16.6l1.8 5.4H12.4z'],
        SF_FOOT
      ],
      r: [
        ['xb', 'M11.8 9.6h4.6v3.2h3.8V9.6h4.6v3.2h3.8V9.6h4.6v8.6l-2.8 3v9.4l2.8 3v5.4H11.8v-5.4l2.8-3v-9.4l-2.8-3z'],
        ['xd', 'M17 21.4h11v1.8H17zM17 25h11v1.8H17z'],
        SF_FOOT
      ],
      b: [
        ['xb', 'M22.5 6.2 29.6 15.4l-1.6 10.4h-10.8L15.4 15.4z'],
        ['xd', 'M22.5 12.6l3.2 4.6-3.2 4.6-3.2-4.6z'],
        ['xb', 'M16.6 26.6h11.8l2.4 5.4H14.2z'],
        SF_FOOT
      ],
      n: [
        ['xb', 'M8.4 21.8 15 14.4l.4-6 3.4 3.6 1.6-5.6 2.8 5.6 5.8 4.4 3 9.4-1.2 8.4H11.2l3.6-8-6.4 2.4z'],
        ['xd', 'M16.8 15.4 19 18l-2.2 2.6-2.2-2.6z'],
        ['xs', 'M23.6 15.6l4.8 3.6M21 19.8l6.4 4.8'],
        SF_FOOT
      ],
      p: [
        ['xb', 'M22.5 11.6 27.8 16l-1.4 6.8h-7.8L17.2 16z'],
        ['xd', pathCircle(22.5, 17.6, 1.9)],
        ['xb', 'M18.4 23.6h8.2l2.6 6.4H15.8z'],
        SF_FOOT
      ]
    }
  },

  /* 10 ------------------------------------------------------------ */
  realistic: {
    name: 'Turned & Shaded',
    note: 'Staunton geometry with a lathe-turned gradient. Lit from the left, like the reference photo.',
    strokeWidth: 0.7,
    linejoin: 'round',
    /**
     * The only set that needs a symbol PER COLOUR, and the reason is the
     * gradient rather than the drawing.
     *
     * A `<linearGradient>` referenced by `fill: url(#…)` is resolved in the
     * DOCUMENT, not in the shadow tree that clones the path. So its stops are
     * outside the inheritance chain that carries `--xcp-*` down from a piece,
     * and one gradient cannot be light for a white king and dark for a black
     * one however it is written. Two gradients and two symbols is the honest
     * answer; the other nine sets stay at six symbols each.
     *
     * The stops still read variables, with the literal as the fallback, so a
     * page can retheme the material from `:root` without editing this file.
     */
    perColor: true,
    defs:
      '<linearGradient id="xcp-turned-white" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="var(--xcp-w-lo,#a9a08c)"/>' +
      '<stop offset=".26" stop-color="var(--xcp-w-hi,#ffffff)"/>' +
      '<stop offset=".58" stop-color="var(--xcp-w-mid,#e2dbcc)"/>' +
      '<stop offset="1" stop-color="var(--xcp-w-lo,#a9a08c)"/>' +
      '</linearGradient>' +
      '<linearGradient id="xcp-turned-black" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="var(--xcp-k-lo,#080706)"/>' +
      '<stop offset=".26" stop-color="var(--xcp-k-hi,#544a40)"/>' +
      '<stop offset=".58" stop-color="var(--xcp-k-mid,#231d18)"/>' +
      '<stop offset="1" stop-color="var(--xcp-k-lo,#080706)"/>' +
      '</linearGradient>',
    pieces: {
      k: [
        ['xg', 'M21.1 3.2h2.8v3.5h3.5v2.8h-3.5V13h-2.8V9.5h-3.5V6.7h3.5z'],
        ['xg', 'M22.5 13.2c-4.2 0-7.1 2.3-7.1 5.5 0 2.5 1.7 4.6 3.9 6.1h6.4c2.2-1.5 3.9-3.6 3.9-6.1 0-3.2-2.9-5.5-7.1-5.5z'],
        ['xg', 'M18.4 25.2h8.2c.9 3.7 3 6.5 6.1 8.2H12.3c3.1-1.7 5.2-4.5 6.1-8.2z'],
        ['xg', 'M12.8 32.8h19.4l1.6 4.4H11.2z'],
        ['xg', 'M10.2 37.4h24.6l2.6 5H7.6z'],
        ['xh', 'M18.4 15.4c-.9 1-1.4 2.2-1.4 3.4 0 1.8.7 3.4 2.1 4.8-.4-1.8-.6-3.4-.6-4.8s-.1-2.5-.1-3.4z']
      ],
      q: [
        ['xg', pathCircle(8.8, 13.4, 2.3)],
        ['xg', pathCircle(15.6, 10.4, 2.3)],
        ['xg', pathCircle(22.5, 8.9, 2.5)],
        ['xg', pathCircle(29.4, 10.4, 2.3)],
        ['xg', pathCircle(36.2, 13.4, 2.3)],
        ['xg', 'M9.2 16.8 12.8 28.4h19.4l3.6-11.6-5.8 5.6-3.4-8.6-4.1 9-4.1-9-3.4 8.6z'],
        ['xg', 'M13.2 29h18.6c.3 1.7.9 3 1.8 4.2H11.4c.9-1.2 1.5-2.5 1.8-4.2z'],
        ['xg', 'M12.8 33.4h19.4l1.6 4h-22.6z'],
        ['xg', 'M10.2 37.4h24.6l2.6 5H7.6z'],
        ['xh', 'M17.4 19.6 19 26.6c.2 1.2 0 2.4-.6 3.6-.5-1.4-.9-3-1.2-4.8-.3-1.8-.3-3.7 .2-5.8z']
      ],
      r: [
        ['xg', 'M11.2 9.2h5.1v3.4h4.2V9.2h4.2v3.4h4.2V9.2h5.1v8.4l-3 2.6v10.2l3 2.6v3.4H11.2v-3.4l3-2.6V20.2l-3-2.6z'],
        ['xg', 'M9.6 35.6h25.8l2.6 6.8H7z'],
        ['xh', 'M15.6 20.8h2v8.6h-2z']
      ],
      b: [
        ['xg', pathCircle(22.5, 9.6, 2.4)],
        ['xg', 'M22.5 11.2c-4.8 3.4-7.6 8.2-7.6 12.4 0 3.1 1.7 5.4 4.2 6.5h6.8c2.5-1.1 4.2-3.4 4.2-6.5 0-4.2-2.8-9-7.6-12.4z'],
        ['xd', 'M20.4 20.4 25.1 15.1l1.9 1.8-4.7 5.3z'],
        ['xg', 'M15.2 30.6h14.6l1.4 3.2H13.8z'],
        ['xg', 'M12.8 33.4h19.4l1.6 4h-22.6z'],
        ['xg', 'M10.2 37.4h24.6l2.6 5H7.6z'],
        ['xh', 'M19.4 15.8c-1.6 2.6-2.4 5.2-2.4 7.8 0 1.6.5 3 1.4 4.2-.4-1.8-.6-3.6-.6-5.4 0-2.2.5-4.4 1.6-6.6z']
      ],
      n: [
        ['xg', 'M9 21.6c1.6-2.7 3.5-5 5.6-6.8l.6-4.8 2.7 3 1.4-5.1 2.3 4.7c4.5.6 8 3.1 10.5 7.4 2.3 4 3.2 8.1 2.9 13.2H11c-.4-2.4.1-4.7 1.5-6.8 1-1.4 1.6-2.8 1.8-4l-4.5 1.6c-1.6.6-2.5-.1-2.4-1.5z'],
        ['xd', pathCircle(16.4, 17.5, 1)],
        ['xg', 'M12.8 33.4h19.4l1.6 4h-22.6z'],
        ['xg', 'M10.2 37.4h24.6l2.6 5H7.6z'],
        ['xh', 'M13.8 17.4c-1.4 1.4-2.4 2.9-3 4.6l3.2-1.2c.2-1.2.1-2.3-.2-3.4z']
      ],
      p: [
        ['xg', pathCircle(22.5, 16.8, 4.2)],
        ['xg', 'M18.6 21.4h7.8c-.4 1.9 0 3.7 1.2 5.4 1.5 2.2 2.5 4.2 3.1 6.2H14.3c.6-2 1.6-4 3.1-6.2 1.2-1.7 1.6-3.5 1.2-5.4z'],
        ['xg', 'M12.8 33.4h19.4l1.6 4h-22.6z'],
        ['xg', 'M10.2 37.4h24.6l2.6 5H7.6z'],
        ['xh', 'M19.8 14.2c-1.4.7-2.1 1.7-2.1 3s.7 2.2 2.1 2.8c-.6-1-.9-2-.9-2.9s.3-1.9.9-2.9z']
      ]
    }
  }
};

export const SET_IDS = Object.keys(SETS);

/* ------------------------------------------------------------------ *
 * Rendering
 * ------------------------------------------------------------------ */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function set(setId) {
  const s = SETS[setId];
  if (!s) throw new Error(`chess-piece-sets: unknown set "${setId}" (have: ${SET_IDS.join(', ')})`);
  return s;
}

/**
 * Stroke geometry as presentation attributes on the wrapping `<g>`.
 *
 * Attributes rather than CSS because a set's stroke WIDTH is part of its
 * drawing, not part of its theme: the rounded set stops reading as an app
 * icon at 1px, and the line-art set turns to mud at 2px. Presentation
 * attributes lose to any stylesheet rule, so a host page can still override
 * them - it just has to mean it.
 */
export function setAttrs(setId) {
  const s = set(setId);
  let a = ` stroke-width="${s.strokeWidth}" stroke-linejoin="${s.linejoin || 'round'}"`;
  if (s.linecap) a += ` stroke-linecap="${s.linecap}"`;
  return a;
}

/**
 * The inline declaration each shape role carries.
 *
 * `xb` is deliberately absent: a body path declares nothing and inherits fill
 * and stroke from the host `<svg>`, which is the only route into a `<use>`
 * shadow tree and also leaves a host stylesheet free to restyle bodies.
 */
const ROLE_STYLE = {
  xd: 'fill:var(--xcp-detail);stroke:none',
  xs: 'fill:none;stroke:var(--xcp-detail);stroke-width:.8;stroke-linecap:round',
  xh: 'fill:var(--xcp-spec);stroke:none;opacity:.45'
};

/**
 * The paths for one piece, as an SVG fragment. No `<svg>` wrapper.
 *
 * `color` only matters to the turned set, whose bodies take a per-colour
 * gradient; the other nine ignore it.
 */
export function pieceMarkup(setId, key, color = 'white') {
  const s = set(setId);
  const piece = s.pieces[key];
  if (!piece) throw new Error(`chess-piece-sets: set "${setId}" has no piece "${key}"`);
  return piece
    .map(([cls, d]) => {
      const style = cls === 'xg' ? `fill:url(#xcp-turned-${color})` : ROLE_STYLE[cls];
      return `<path class="${cls}"${style ? ` style="${style}"` : ''} d="${d}"/>`;
    })
    .join('');
}

/**
 * The id a `<use>` should point at.
 *
 * Six ids per set, except the turned set, which needs one per colour. Call
 * this instead of building `#xp-k` by hand and the difference stays invisible.
 */
export function symbolId(setId, key, color = 'white', idPrefix = 'xp-') {
  return set(setId).perColor ? `${idPrefix}${key}-${color}` : `${idPrefix}${key}`;
}

/**
 * One piece as a standalone `<svg>` element.
 *
 * `color` is 'white' or 'black' and only sets a class - the actual colours
 * live in piece-sets.css, so a host page can restyle without regenerating.
 */
export function pieceSVG(setId, key, color = 'white', opts = {}) {
  const s = set(setId);
  const { size, className = '' } = opts;
  const dim = size ? ` width="${size}" height="${size}"` : '';
  const cls = `xcp xcp--${setId} xcp--${color}${className ? ` ${className}` : ''}`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"${dim} class="${cls}" role="img" aria-label="${esc(color)} ${PIECE_NAMES[key]}">` +
    (s.defs ? `<defs>${s.defs}</defs>` : '') +
    `<g${setAttrs(setId)}>${pieceMarkup(setId, key, color)}</g>` +
    '</svg>'
  );
}

/**
 * The whole set defined once, as `<symbol>`s, for `<use>` on a board.
 *
 * This is the form a board should use: geometry appears in the document once
 * however many pieces are on it, so thirty-two men cost thirty-two references
 * rather than thirty-two copies.
 *
 * `overflow="visible"` on each symbol is not optional. Without it a stroked
 * outline is clipped at the viewBox edge and every piece gets a shaved side.
 */
export function spriteDefs(setId, opts = {}) {
  const { idPrefix = 'xp-' } = opts;
  const s = set(setId);
  const variants = s.perColor ? ['white', 'black'] : ['white'];
  const symbols = variants
    .flatMap((color) =>
      PIECE_KEYS.map(
        (key) =>
          `<symbol id="${symbolId(setId, key, color, idPrefix)}" viewBox="0 0 45 45" overflow="visible">` +
          `<g${setAttrs(setId)}>${pieceMarkup(setId, key, color)}</g></symbol>`
      )
    )
    .join('');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" class="xcp-defs xcp--${setId}" aria-hidden="true" focusable="false">` +
    `<defs>${s.defs || ''}${symbols}</defs></svg>`
  );
}

/**
 * A `<use>` reference to a sprite symbol, for one square.
 *
 * The colour classes on this wrapper are what make the piece white or black:
 * they set `fill`, `stroke` and the `--xcp-*` variables, all of which are
 * inherited and therefore reach the cloned content. Nothing inside the symbol
 * knows which side it is on.
 */
export function pieceUse(setId, key, color = 'white', opts = {}) {
  const { idPrefix = 'xp-', size, className = '' } = opts;
  const dim = size ? ` width="${size}" height="${size}"` : '';
  const cls = `xcp xcp--${setId} xcp--${color}${className ? ` ${className}` : ''}`;
  const id = symbolId(setId, key, color, idPrefix);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"${dim} class="${cls}" aria-hidden="true" focusable="false">` +
    `<use href="#${id}" xlink:href="#${id}"/></svg>`
  );
}

/** The default light/dark theme, and the only place literal colours appear. */
export const THEMES = {
  white: { fill: '#f6f4ef', line: '#241c12', detail: '#241c12', spec: '#ffffff' },
  black: { fill: '#191512', line: '#0d0b09', detail: '#f2ede3', spec: '#8e8478' }
};

/**
 * One piece as a fully self-contained SVG file: theme inlined, nothing
 * inherited from a host. This is the form that survives `<img src>`, a CSS
 * background, and being dragged into a design tool - all contexts where the
 * page around it cannot reach in to colour it.
 */
export function pieceStandalone(setId, key, color = 'white', theme = {}) {
  const s = set(setId);
  const t = { ...THEMES[color], ...theme };
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="180" height="180" ' +
    `role="img" aria-label="${esc(color)} ${PIECE_NAMES[key]}" ` +
    `style="--xcp-detail:${t.detail};--xcp-spec:${t.spec}" fill="${t.fill}" stroke="${t.line}">` +
    (s.defs ? `<defs>${s.defs}</defs>` : '') +
    `<g${setAttrs(setId)}>${pieceMarkup(setId, key, color)}</g>` +
    '</svg>'
  );
}

export default {
  SETS, SET_IDS, PIECE_KEYS, PIECE_NAMES, KEY_BY_TYPE, THEMES,
  pieceSVG, pieceUse, pieceMarkup, spriteDefs, pieceStandalone, setAttrs, symbolId
};
