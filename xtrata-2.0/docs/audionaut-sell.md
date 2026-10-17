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

## Not done yet

The 14 synth faces are CSS drawings. Real captures (WebP stills from the DAW) are the next phase.
