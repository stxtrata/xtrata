# Audionaut gate: sell layer

`public/audionaut/sell/audionaut-sell.js` adds a montage, story cards and optional music to the
Audionaut access screen. It only watches `#stage[data-state|data-mode]`; it never edits the gate code.

| Gate state | What shows |
| --- | --- |
| `sealed` / idle (no wallet yet) | blurred, dimmed montage, one story card, music opt-in |
| `denied` (wallet, no Audionaut) | full montage, 5 rotating story cards, GET AN AUDIONAUT, music opt-in |
| scanning, granted, sequencer open | nothing (holders load and hear none of it) |

Music never autoplays. The beat flash is locked to the audio clock when music is on, and to a timer
otherwise. Reduced motion: one face every 4 seconds, no flashing.

## Audio (on-chain)

Music streams from the Super User inscription, `/i/3567` (115 bpm). That inscription is an HTML player
with the audio embedded as a data URI, so the layer fetches it once, only when someone taps the music
button, extracts the audio and loops one section. Nothing is downloaded otherwise. No audio file is
committed to the repo. On localhost the layer reads `https://xtrata.xyz/i/3567` (CORS is open).

The default section is the drop: start 115.59 s, 16 bars (33.39 s), set in `LOOP` at the top of the file.

## Tuning the section

Open `/audionaut/?sell=tune`. Sliders move the start and trim the length, SNAP START TO BAR aligns to
the 115 bpm grid, LENGTH = 16 BARS resets, COPY SETTINGS gives `start=... length=... bpm=...`. Put the
values into `LOOP`.

## Synth and plugin faces

`public/audionaut/sell/faces/` holds real captures of the sequencer's own front panels (WebP, about 1.6 MB
in total, loaded lazily): 14 synths with 3 frames each (idle, a chord held, another preset) and 20 plugins
with 2 frames each (default, knobs moved). The lit panel on each beat swaps to its next frame, so the
panels read as animated. A fresh face is dealt into the grid once a bar.

To recapture after a UI change: serve `public/` and open each synth with `open-synth-panel` (see
`tools/audionaut-test.mjs --shots`), then screenshot the face host; plugins mount through
`js/plugin-faces/runtime.js` `Kit.mount` with a stub link. Names: `s-<synthId>-<frame>.webp`,
`p-<pluginType>-<frame>.webp`.
