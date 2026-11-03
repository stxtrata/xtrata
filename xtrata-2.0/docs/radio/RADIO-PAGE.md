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

## Two looks: paying and not paying

Pay-per-play sets `<html data-ppp>` (src/radio-ppp/page.ts `renderMode`):

- `on`: the listening wallet is unlocked, paying is on and plays are left. The receiver gets a
  gold trim with screws and a slow sheen, a warm amber display, a lit **ON AIR** lamp ("Paying
  artists · N plays left"), gold controls, waveform and spectrum.
- `off`: pay-per-play is available but not paying (not connected, not set up, locked, out of
  funds, over 1 STX, or switched off). The radio goes drab (grey display, desaturated artwork),
  the lamp reads "Not paying" in orange, the top bar adds "· ARTISTS UNPAID", and an orange strip
  under the receiver says what is missing, that 1 STX (less than $1) pays for about 2,857 plays,
  and offers the one next step (Set up, Unlock, Top up, Switch on…).
- unset: pay-per-play is not offered (config off, unsupported). The normal cyan look.

The "less than $1" wording is fixed text: revisit it if STX trades above $1.

## This song on-chain

The display shows the current song's **♥ likes** and **▶ paid plays** from
`GET /radio/song-stats?id=N`, which reads the same shared source as the catalogue and every other
page (see [ONCHAIN-COUNTS.md](ONCHAIN-COUNTS.md)). Asked again on each song change and when a like
or unlike confirms. A count that could not be read is hidden, never shown as 0.

## Timeline

Under the receiver: the whole song's waveform, played part lit, with elapsed and total time. Tap
or drag to jump; arrow keys move 5 s. The engine exposes `getPosition()`, `seek(seconds)` and
`currentSource()`. Peaks come from decoding the song once at a low sample rate (skipped for files
over 20 MB or low-memory devices, which keep a plain bar). Skipped-over audio never counts towards
a listen or a paid play.

## Play and pause

The radio plays when the listener presses play (or picks a song: a tuning-strip tick, a liked
song, "Play" on the likes list) and keeps playing in a background tab. Once stopped, by the pause
button, media keys, headphones or the OS, it stays stopped until play is pressed again: the stuck
watchdog, the no-signal retry and the media-error retune all respect the pause, the pause is saved
so the next page does not start playing either, and nothing starts on a click elsewhere on the
page (no "tap anywhere"). Choosing a station only changes what is cued.

## Checks

`node scripts/test-radio-page-browser.mjs [shots]` drives the page with a stand-in engine (layout,
glow, spectrum, tuning strip, stations, likes filter / reorder / collapse, phone width).
`scripts/test-radio-ppp-browser.mjs` covers the pay-per-play flow and the top bar button.
