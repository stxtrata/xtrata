# Audional Sequencer X

A modular rebuild of the Audional Sequencer (B64x): a 16-channel × 64-step sampler/sequencer with up to 64 chained sequences, built with vanilla ES modules and the Web Audio API. No build step, no dependencies.

## Run

ES modules require a server (not `file://`):

```
cd audional-sequencer-x
python3 -m http.server 8080
# open http://localhost:8080
```

## Features

Sample-accurate lookahead scheduling (25 ms tick / 120 ms horizon), swing, per-channel volume, pitch (playback rate), reverse, mute, solo, and waveform trim editor with audition. Steps support accent (shift-click). Pattern tools per channel: shift left/right, clear. Sequence chaining with auto-advance, copy/paste/clear sequences, keyboard transport (Space, ←/→). Autosave to localStorage.

## Beats, synth kit & FX

The **Beats** button opens a preset browser: 32 pre-programmed grooves across 23 genres (house, techno, electro, hip-hop, trap, drill, DnB, jungle, breakbeat, garage, dubstep, footwork, reggaeton, dancehall, afrobeats, amapiano, samba, bossa, rock, punk, funk, ambient, minimal…). Loading a preset sets BPM/swing, loads the kit (OB1 on-chain samples and/or on-board synth drums) into channels with per-channel volume/pitch/FX, and writes the pattern into the current sequence.

The Library modal's **Synth Kit** category holds ~24 generative drum sounds (kicks, snares, claps, hats, toms, cymbals, cowbell, rim, shaker, 808 basses, zap) rendered on demand with OfflineAudioContext — deterministic, fully offline, saved in projects as `synth` sources.

Each channel has an **FX** button: low/high-pass filter with cutoff, drive (waveshaper), BPM-synced dotted-8th delay send, and reverb send (generated impulse). FX settings persist in project JSON.

## Instruments & MIDI rolls

Below the sample channels sit 4 **instrument channels** hosting synths from the on-board bank (js/synths.js): jiMS10 (mono lead, homage to the first on-chain synth), Acidals 303 (acid bass), FMonad (2-op FM), Stacker (supersaw), Chip-8 (PWM chiptune), SubZero (sub bass). Each synth has its own parameter panel UI (schema-driven, uniquely styled) rendered inside the piano-roll modal.

The **♪ MIDI roll** is a canvas piano-roll (A0–C7 × 64 steps): click to add notes, shift-click for accents, click/right-click to delete; note length selector; per-synth **preset lines** (basslines, arps, melodies, chords — 4 per synth); computer-keyboard playing (A–L keys, Z/X octave) and **live recording** quantized to 16ths while the sequencer runs. Notes are stored per sequence and persist in project JSON.

## Sample sources

- **Ordinals inscription ID** — fetched from the configurable Ordinals gateway (default `https://ordinals.com/content/`). Raw audio, audional base64 JSON, and HTML-embedded audio are all handled.
- **Stacks / Xtrata inscription ID** — gateway URL template configurable in Settings (`{id}` placeholder), default `https://xtrata.io/api/content/{id}`. Adjust to the correct Xtrata endpoint.
- **Direct URL** and **local files** (picker or drag-and-drop onto a channel row).

## Project files

Save/Load uses a JSON format (`audional-sequencer-x/1`). Legacy Audional Sequencer presets (B64x `projectSequences` format, e.g. `Basic_Drum_Kit.json`) import automatically — 1-based step arrays, percentage trims, and channel URLs are converted.

## Architecture

```
index.html         shell + modals
css/style.css      theme
js/state.js        store, project model, pub/sub
js/engine.js       Web Audio engine + scheduler
js/loader.js       sample fetching/decoding (ordinals/xtrata/url/file/JSON/HTML)
js/persistence.js  export/import (native + legacy), autosave, settings
js/ui.js           DOM: channels, grid, sequence bar, modals
js/main.js         bootstrap and wiring
```
