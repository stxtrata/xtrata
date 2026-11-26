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
