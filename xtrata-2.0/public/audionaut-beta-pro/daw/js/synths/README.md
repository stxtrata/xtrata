# Synth folders

Every synth lives in exactly one folder. The folder is what the instrument-channel and MIDI-roll
pickers show as the tree, so putting a module in `synths/<folder>/` files it there automatically.

| Folder | Picker label | What belongs here | Contents |
|---|---|---|---|
| `bass/` | Bass | sub, acid, analog and growl bass | Whale (`bass/jibass.js`); Acidals 303, SubZero (in `synths.js`) |
| `lead/` | Leads | mono and poly lead voices, supersaws | jiMS10, Stacker (in `synths.js`) |
| `pad/` | Pads & String Machines | warm sustained pads, ensembles, string machines | Layers (`pad/ensemble.js`) — string machine / pad / choir |
| `keys/` | Pianos & Electric Pianos | piano, Rhodes/Wurli-style, clav | Privkey (`keys/tine.js`) — Rhodes / Wurli / piano / clav models |
| `organ/` | Organs | drawbar / tonewheel / combo / church | Cathedral (`organ/tonewheel.js`) — drawbar organ with rotary |
| `fm/` | FM Keys & Bells | DX-style FM keys, bells and basses | Coinbase (`synths-voices.js`), FMonad (`synths.js`) |
| `pluck/` | Plucked & Struck Strings | Karplus-Strong strings: nylon, harp, koto | Taproot (`synths-voices.js`) |
| `mallet/` | Mallets & Modal Percussion | marimba, kalimba, vibes, bowls, gongs | Ordinal (`mallet/modal.js`) — marimba, xylophone, vibes, glock, kalimba, bell, bowl, pan, wood |
| `reed/` | Brass, Winds & Bowed | brass stabs, flute/reed, bowed strings | Muneeb (`reed/winds.js`) — brass, flute, reed (clarinet↔oboe), bowed |
| `voice/` | Voice & Choir | formant vowels, choirs, vocoder-style | Gm (`synths-voices.js`) |
| `chip/` | Chip & Retro | PWM, NES/Game Boy-style, 8-bit | Chip-8 (`synths.js`) |
| `wave/` | Wavetable, Phase & West-Coast | wavetable morph, CZ phase distortion, wavefolder | Szabo (`wave/morph.js`) — 12-table wavetable morph, wavefolder, FM, low-pass gate |
| `drums/` | Drum Voices | synthesised kick, snare, hat, clap, tom voices played as notes | ASIC (`drums/kit.js`) — 808 / 909 / lo-fi kit on a GM note map |
| `fx/` | Noise, Textures & FX | granular, risers, drones, sci-fi, noise | Mempool (`fx/texture.js`) — wind, riser, drone, grain cloud, impact |
| `glass/` | Glass & Crystal | inharmonic partials that settle into pitch: bells, shards, bloom | KILN, ANNEAL, PALINODE, FAULTGLASS, Morrowglass, VITREOUS, Lightnode, Schnorr, TIDAL GLASS, TIDELACE (`glass/*.js`) |

## Adding a synth
1. Drop `<id>.js` into the right folder (self-contained ES module, no imports, exports `<ID>_SYNTHS`;
   contract in the project's synth-module brief).
2. Add its import and one `...inFolder("<folder>", <ID>_SYNTHS)` line to `index.js`.
3. That's it — `synths.js` spreads `EXTRA_SYNTHS` into `SYNTH_BANK`, and the pickers pick it up.

The folder list itself (ids, labels, order, blurbs) is `CATEGORIES` in `../synth-categories.js`.

## Not moved yet
The original nine synths (`jims10`, `acidals`, `fmonad`, `stacker`, `chip8`, `subzero` in `../synths.js`;
`fm4`, `vox`, `pluck` in `../synths-voices.js`) are still defined where they were, because they share
helpers and the voices module is imported by `synth-panel.js`. They are filed into the correct folders in the
pickers via `SYNTH_CATEGORY`; splitting them into files is a mechanical follow-up.

No folder is empty any more. Remaining folders that only hold the original synths (lead, fm, pluck, voice, chip) keep a README.

## Notes on the drum kit
`drums/kit.js` follows the General-MIDI drum map (C1 kick, D2 snare, D#2 clap, F#2 closed hat, A#2 open hat, F2/A2/C3 toms, C#3 crash, D#3 ride, G#3 cowbell...), notes outside 35-59 fold onto the same drums by pitch class.
