# Radio page (radio.xtrata.xyz/radio)

`public/radio.html` is the full-page radio. The real engine is the walnut widget
(`src/home/radio.js`, built to `public/xtrata-radio.js`); the page drives it through
`window.XtrataRadio` and draws its own receiver. Phase 2 of the radio upgrade plan.

## Layout, top to bottom

- **Top bar (sticky):** logo, on-air dot, the pay-per-play button, wallet controls. The pay-per-play
  button (`#ppp-top`, rendered by `src/radio-ppp/page.ts`) shows the next step or the live state:
  Set up pay-per-play · Unlock · keep paying · Finish setup · Add funds / Out of funds · top up ·
  Over 1 STX · On · N plays left · Paying off. Tapping it brings the listening wallet box into view
  (and opens the unlock if it is not already waiting). Browsers only allow the passkey prompt from
  a tap inside the wallet box, so the passkey itself is always that one tap there. Hidden while the
  wallet is not connected ("Connect wallet" sits beside it) and where pay-per-play is off.
- **Receiver:** artwork and the VFD display (station, title, artist, album, inscription). The page
  glow (`--glow`) is the artwork's average colour. Under the display, a live spectrum drawn from the
  radio's own analyser (`XtrataRadio.getSpectrum`); it falls still when paused or where the browser
  gives no analyser (iOS).
- **Controls:** power, previous, play / pause, next, heart (orange while a like is on its way), and
  the FM preset (ALL / CURATED).
- **Tuning strip:** every song in the catalogue (`/radio/counts`) as a tick, in inscription order;
  liked songs in pink; the needle on the playing song. Tap or drag to tune, or focus it and use the
  arrow keys and Enter.
- **Stations:** FM, LIKED, CHAIN as buttons with lamps; choosing one also powers the radio on.
- **Also on this frequency:** parents, children and siblings of the playing song; songs play on tap.
- **Your station (likes):** collapsible (remembered), filter by title, artist or number, and
  reorder by dragging the grip or with the arrows. The order is saved per wallet in this browser
  (`xtrata.radio.likeorder.v1:<address>`) and handed to the engine (`XtrataRadio.setLikedOrder`),
  so the LIKED station plays in it; new likes come first. Reordering is off while filtering.
  "Reset order" goes back to the chain's order.
- **Pay-per-play panel**, then the links strap. On phones everything is one column and the walnut
  widget is the sticky mini-player.

## Checks

`node scripts/test-radio-page-browser.mjs [shots]` drives the page with a stand-in engine (layout,
glow, spectrum, tuning strip, stations, likes filter / reorder / collapse, phone width).
`scripts/test-radio-ppp-browser.mjs` covers the pay-per-play flow and the top bar button.
