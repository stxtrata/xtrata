# chess-piece-sets

Ten chess sets, six pieces each, drawn as SVG paths. No dependencies, no build
step, no network. Drop the folder into a project and import it.

```
chess-piece-sets/
  piece-sets.js        the library and all the artwork (ESM)
  piece-sets.iife.js   the same, as a classic script (generated)
  piece-sets.css       the colours
  piece-sets.d.ts      types
  index.html           preview: every piece, plus a live board
  build.mjs            regenerates the .iife.js and svg/ from piece-sets.js
  svg/                 120 flat .svg files, theme inlined (generated)
```

| id | set | character |
|----|-----|-----------|
| `minimal` | Ultra-Minimal Geometric | triangles, circles, one square |
| `staunton` | Classic Staunton | the tournament standard |
| `rounded` | Rounded Modern | app-icon weight, survives being shrunk |
| `lineart` | Elegant Line-Art | hairline strokes, narrow waists |
| `gothic` | Gothic Ornamental | pointed arches and tracery, the tallest set |
| `bauhaus` | Bauhaus Abstract | circle, half-circle, square, triangle |
| `pixel` | Blocky Pixel | snapped to a 1.5-unit grid |
| `deco` | Art Deco | fluted columns on ziggurat plinths |
| `scifi` | Futuristic | faceted, with a lit core |
| `realistic` | Turned & Shaded | Staunton with a lathe-turned gradient |

Open `index.html` to see them all and click through them on a board.

## Use it

Every piece is drawn in the same `0 0 45 45` box, so sets are interchangeable
and there is no per-set scale table to keep in step.

**A board.** Put the set's symbols in the document once, then reference them:

```js
import { spriteDefs, pieceUse } from './chess-piece-sets/piece-sets.js';

document.body.insertAdjacentHTML('afterbegin', spriteDefs('gothic'));
square.innerHTML = pieceUse('gothic', 'q', 'black');
```

Thirty-two pieces then cost thirty-two references rather than thirty-two
copies of the geometry.

**One piece, standalone.** No sprite sheet needed:

```js
import { pieceSVG } from './chess-piece-sets/piece-sets.js';
el.innerHTML = pieceSVG('deco', 'n', 'white', { size: 64 });
```

**A file.** `svg/<set>/<colour>-<piece>.svg`, theme already inlined, for
`<img src>`, CSS backgrounds, or a design tool.

**No module system.** Load `piece-sets.iife.js` and read `window.ChessPieceSets`.

Either way, load `piece-sets.css`, or set the four custom properties yourself.

## The one thing that will bite you

**Colour reaches a `<use>` only by inheritance. Selectors do not.**

The content of a `<use>` lives in a shadow tree, and selectors from the outer
document do not cross into it. This rule looks obviously correct and does
nothing at all:

```css
.piece--white path { fill: #ffffff; }   /* never matches through <use> */
```

The pieces come out solid black, with no error anywhere to tell you why. Only
**inherited** properties (`fill`, `stroke`, `stroke-dasharray`) and **custom
properties** get through, so those are all this library uses. Colour is set on
the host `<svg>` that wraps the `<use>`, never on the shapes:

```css
.xcp--white { fill: #f6f4ef; stroke: #241c12; --xcp-detail: #241c12; }
```

`pieceUse()` puts `xcp xcp--<set> xcp--<colour>` on that host for you, so this
works as long as `piece-sets.css` is loaded. If you are wiring `<use>` by hand,
put the colour classes on the wrapping `<svg>`, not on the `<symbol>`.

If your board draws pieces by **inlining** paths rather than by `<use>`, none
of this applies and an ordinary `path` selector is fine.

## Theming

Four properties, set on the piece's host element:

| property | what it paints |
|---|---|
| `fill` | the body |
| `stroke` | the outline |
| `--xcp-detail` | anything knocked out of the body: a bishop's slit, a knight's eye, the deco flutes |
| `--xcp-spec` | the highlight on the turned set |

`--xcp-detail` is the one worth understanding. It is dark on a white piece and
light on a black one, which is how a bishop's slit survives the colour flip
instead of vanishing into the fill.

A dark board wants a light rim on the black pieces or they dissolve into the
dark squares. Put `xcp-board--dark` on any ancestor.

The ghost state (a move made but not yet committed) is hollow rather than
faded, because a translucent piece reads as a dim piece while an outline reads
as a piece that is not there yet. Add `xcp--ghost`. Note how it drops the
details: not `display: none`, which could not reach them, but by handing them
a transparent colour to paint themselves with.

The turned set is the only one that needs a symbol per colour, because a
gradient is resolved in the document rather than in the shadow tree and so
sits outside that inheritance chain. `spriteDefs()` and `pieceUse()` handle it;
call `symbolId(set, key, colour)` rather than building `#xp-k` by hand and the
difference stays invisible.

## Editing the artwork

`piece-sets.js` is the source. `piece-sets.iife.js` and `svg/` are generated:

```bash
node build.mjs
```

Two conventions worth keeping:

- **Only `<path>`.** Not `<circle>`, not `<rect>`, even where one would be
  shorter. Host stylesheets select on the element far more often than you
  expect, and a `<circle>` in the middle of a set silently keeps its default
  black fill. `pathCircle()` and `pathRoundRect()` are there for this.
- **Proportion is the artwork.** A pawn reaches y≈14 and a king y≈4 in every
  set. Nothing scales pieces relative to each other at runtime, so if a rook
  ends up taller than its queen, that is now what the set looks like.
