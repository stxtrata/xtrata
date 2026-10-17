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

## Audio (kept out of git)

- Track: Super User (inscription 3567), measured at **115 bpm**.
- `public/audionaut/sell/super-user-loop.mp3`: the 16-bar loop (start 115.59 s, 33.39 s). Git-ignored.
  If the file is missing the music button never appears.
- `public/audionaut/sell/_local/super-user-full.mp3`: full track for tuning. Git-ignored.
- To ship the loop for real, delete its line from `.gitignore` (or move it to an inscription later).

## Tuning the section

Open `/audionaut/?sell=tune` against the dev server. Sliders move the start and trim the length,
SNAP START TO BAR aligns to the 115 bpm grid, LENGTH = 16 BARS resets, COPY SETTINGS gives
`start=... length=... bpm=...`. Re-cut the clip with:

    ffmpeg -ss START -t LENGTH -i SuperUser__Universal.wav -af "afade=t=in:d=0.015,afade=t=out:st=LENGTH-0.015:d=0.015" -b:a 160k super-user-loop.mp3

## Not done yet

The 14 synth faces are CSS drawings. Real captures (WebP stills from the DAW) are the next phase.
