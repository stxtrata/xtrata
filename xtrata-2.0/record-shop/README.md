# XTRATA MUSIC — The Record Shop

A first-person 3D record shop for Xtrata Music, served at **`/music/shop/`**.
The whole app is one generated HTML file with three.js r170 bundled (MIT licence text retained in the file).

| Path | What it is |
|---|---|
| `src/` | Source modules (room, CD wall, inspector, CD deck, vinyl bench/turntable, playback, chain streaming, radio, shop UI) |
| `template.html` | Page shell and styles |
| `build.mjs` | Bundles everything and writes `dist/Xtrata-Record-Shop-3D.html` and `../music/shop/index.html` |
| `test/` | Browser suites (Python Playwright + Google Chrome) |

The published page is `../music/shop/index.html`. It must not go in `public/music/`: the site's postbuild step
replaces `dist/music` with the `music/` folder, so a page under `public/music/` never reaches the deployed site.

## Build

```sh
npm ci
npm run build        # regenerates ../music/shop/index.html
```

`build.mjs` passes `tsconfigRaw:'{}'` so the bundle does not inherit the site's TypeScript settings.

## Test

```sh
npm run fixtures     # downloads six real on-chain players for the streaming suite (not committed)
npm test             # CHROME=/path/to/chrome to override the browser
```

The suites drive the built file from disk with real mouse, keyboard and touch events. `h_stream.py` replays
real downloaded inscriptions through a mocked route; nothing in the tests talks to the live site or a wallet.

## What it reads from the network

- `https://xtrata.xyz/i/<inscription id>` — each track's on-chain player, for its artwork and audio.
- `https://xtrata.xyz/index/<contract>` — to pick random image inscriptions for the poster frames.
- `https://xtrata.xyz/hiro/mainnet` — one read-only `get-primary` call on the BNS-V2 contract per poster inscriber, so a
  primary BNS name (for example `dyle.btc`) is shown instead of a raw address. A failed lookup leaves the address.
- `https://api.open-meteo.com` and `https://geocoding-api.open-meteo.com` — current weather for the city in
  the visitor's time zone (no location permission is requested). Not yet exercised against the live service.

Offline it still opens, with placeholder artwork and a labelled demo timer instead of audio.

## The Audionaut booth — forking demo

A permanent 9 ft × 6 ft × 8 ft station set into the back wall (`src/booth.js`, quick-jump 8): its open front is flush
with the wall and the booth sits in an alcove behind it. It teaches forking, reuse and attribution in a minute or two.

- **Model** (`src/fork.js`, no three.js, unit-tested in `test/fork.test.mjs`): six starting songs (house, boom bap, lo-fi,
  techno, electro, half-time), each built v1 drums → v2 bass → v3 keys → v4 lead by four placeholder demo makers, plus a
  few demo forks (one already borrows a bassline). Every version is a full 6 × 16 snapshot, and every hit or note stores
  the version where it was made, so any hit can say which song, version and maker it came from and whether it is
  inherited, borrowed or new. Melodic values are scale degrees, so borrowed layers land in the new song's key; steps
  are tempo-free, so they follow its tempo.
- **Fork** copies a version exactly with you as maker, then writes a variation of one layer (chosen, or picked for you).
  **Vary** does another variation; **Borrow** brings a layer from another song; clicking a step edits it. Changes to a
  version that isn't yours start your own fork first. Variations are always in key, must differ from the parent, and
  are checked against every version in the studio so no two are ever identical.
- **Booth**: console grid (inherited, striped = borrowed, white dot = new, gold outline = just changed); FORK / VARY /
  BORROW / PLAY / HEAR PARENT buttons (hear-parent switches without stopping the music); song cards on the left wall;
  layer blocks on the right wall (choose the layer); family tree and credits on the back-wall screen (click a version
  to hear it); RESET DEMO plate. The panel bottom-left (compact on phones) has the same controls plus a Tree & credits
  dialog. Nothing is saved, inscribed or paid for; shares count hits and notes, not money.
- **Information** (`src/booth-info.js`): the back-wall screen has tabs along the top — Tree & credits, Audionals, Why
  on-chain, Forking, Paid plays, Who gets paid, Credits × payments, The studio. Two **Learn** lecterns either side of
  the opening, the (i) on the SONGS and LAYERS signs and the booth's header sign all switch the screen to a topic; the
  panel has the same topics and a Read dialog with links. Each page is marked LIVE, PLANNED, DEMO or IDEA. Payment
  facts follow `docs/radio/XTRATA-MUSIC-THIRD-PARTY-GUIDE.md` (20 Oct 2026); update `booth-info.js` when they change.
  With nobody at the booth the screen cycles the topics; walking up brings the family tree back.
- Sound is synthesised in the browser through the shop's shared AudioContext from a positional source at the console.
  Starting the booth pauses any CD or record, and starting a CD or record stops the booth.

## Shop radio

Quiet background (`radioVolume` defaults to 0.16) through four ceiling speakers with a steep distance roll-off, so you
mostly hear the nearest one. Back-left and front-right sound plain, front-left (by the checkout) is tinny and breaking
up, back-right (above the vinyl bench) has blown tweeters and sounds muffled. It goes silent while a CD (case or
player), a record or the booth is playing, and fades back in afterwards.

## Posters

Clicking a poster offers it as a print first. The print button is switched off and says so: prints open once the
artist has signed a print collection and set a price. Smaller links below it play the music or find the CD or vinyl.

## Playback rules

- CDs (case audition and CD player): free, each song stops after 30 seconds of playback.
- Vinyl: free, plays in full.
- Shop radio: about 32 seconds from the opening of each song, artist by artist.
- No wallet, no play is registered, no holder is paid.

## Options

Set before the page loads, or use the query string:

```js
window.XTRATA_SHOP_CONFIG = {
  cdPreviewSeconds: 30,      // 0 removes the CD limit
  stream: true,              // false = no on-chain audio or artwork
  radio: true, radioSeconds: 32, radioVolume: 0.42,
  sky: 'live',               // 'live' | 'rain' | 'golden'
  weather: true, location: { lat: 53.48, lon: -2.24, name: 'Manchester' },
  randomPosters: true, posterCreators: [/* wallet addresses to limit random posters to */],
  posterInscriptions: [1107]
};
```

`?offline=1` disables every network feature, `?sky=rain` fixes the weather, `?qa=1` exposes the test interface.
