# Five instruments for AudioNaut Pro

Open a Pro instrument track, choose the instrument in the indicated picker folder, and select its first demonstration line in the piano roll. All five use the shared keyboard, patch bank, CC learn, mixer, sequencer and exporter. Their two-axis pads can also be played with the arrow keys. CC 74 and 71 address the horizontal and vertical axes. CC 73, 72 and 7 address attack, release and output.

| Instrument | Signal path and playing gesture | Closest stock instrument |
|---|---|---|
| **Portwheel** · Lead | Two band-limited, periodic pressure pulses at the fundamental and octave. The width of an opening in the simulated rotor sets the harmonic cancellations. Each note starts below pitch and accelerates to its target. Harder strikes get there sooner. | jiMS10 can sweep a filter over a lead. Here the port geometry generates the spectrum and a run-up envelope acts directly on rotor speed. |
| **Hushwire** · Pad | A zero-mean noise band amplitude-modulates a sine and its octave. A clear fundamental is mixed back in. Open Width to spread the sidebands around the key and use Air to play their level. Velocity and a seeded starting position give repeated notes different edges. | Mempool supplies noise and drones. Hushwire translates a controllably narrow noise band around the actual played pitch without a grain cloud or swept resonant filter. |
| **Clatterstep** · Mallet | A single strike triggers up to six increasingly close, weaker contacts on a triangle body and an inharmonic sine. Hold to let the striker bounce. Release early to damp the remaining contacts. A harder touch brings out the short contact tone. | Ordinal uses modal decay after a strike. Clatterstep gets its characteristic roll from the timing and strength of multiple physical contacts. |
| **Switchyard** · Keys | A rounded eight-pulse control pattern routes complementary gain to a triangle fundamental and a second sine at a playable interval. Hold a chord for interlocking accents or stagger the keys to start each clock at a different point. | Chip-8 provides oscillator and vibrato colours. Switchyard trades emphasis between two pitches in a rhythmic phrase within each note. The host arp can play it as well. |
| **Neverend** · FX | Three sine voices traverse three octaves on overlapping Hann windows. Each pitch resets at its own silent seam. A stationary fundamental lets a musician anchor a rising or descending illusion to the played chord. Travel at zero parks the belts. | Stacker thickens a pitch with detuned oscillators. Neverend moves each pitch through octaves and uses its level window to conceal the reset. |

## Controls and ownership

The source schemas define every range, step, unit, default, CC assignment, preset override and note line. Each instrument has an XY surface, a shaping section and an envelope/output section. The grid wraps the sections on a narrow dock. All graphs are mono and become stereo through the existing mixer.

| ID | Direct parameters and mapping | Host graph crossfade on edit | Default attack / release |
|---|---|---|---|
| `portwheel` | Upper rotor sets octave gain. Level sets output. | Port width selects a pulse table at 1% steps. Run-up and drop reschedule the pitch excursion. Attack and release reshape the envelope. | 12 / 140 ms |
| `hushwire` | Air controls product gain. Width sets noise playback speed in bandwidth Hz, limited to 72% of the note frequency. Carrier and octave air set their branch gains. Level sets output. | Attack and release. | 160 / 620 ms |
| `clatterstep` | Hardness sets the inharmonic contact gain. Level sets output. | First gap, restitution and shell resonance change contact spacing, energy loss and decay. Attack and release affect the outer gate. | 2 / 190 ms |
| `switchyard` | Speed sets pulses per second. Exchange changes how deeply one rail ducks while the other opens. Interval sets upper-rail detune in semitones. Second rail and level set gain. | Attack and release. | 12 / 220 ms |
| `neverend` | Travel sets octave speed. Focus mixes moving bands. Anchor sets fundamental level. Centre transposes the moving band. Direction changes the pitch ramp polarity while the windows keep moving. Level sets output. | Attack and release. | 230 / 900 ms |

Velocity zero gives zero output. New pitched sources explicitly register for bend, including fundamentals below 20 Hz. Control-buffer sources keep their own clock. Finite notes rise only as far as their gate permits, then decay by 80 dB in the selected release time. Held notes leave the final fade to the voice owner. Clatterstep terminates its sources after the last contact, even with the pedal held. The other instruments continue until release. Finite sources stop within release plus 4 ms, inside the existing generic release-plus-one-second tail allowance. Effects and sends use the host tail planner.

## Factory sounds

| Instrument | What to listen for in its eight presets, in menu order |
|---|---|
| Portwheel | **Yard call** has a short, audible catch. **Pocket whistle** uses wide ports with little octave energy. **Shift change** starts far below pitch. **Stalled motor** takes nearly the full note to climb. **Teleprinter** has a narrow pulse and immediate pitch. **Twin stack** brings the upper rotor forward. **Fog across the pier** softens the onset and extends the tail. **Scooped brass** rises by an octave on each attack. |
| Hushwire | **Felt current** balances tone and air. **Bare filament** brings the clear sine forward. **Steam chord** spreads a wide band around each chord tone. **Moth wings** slows the noise into a flutter. **Needle spray** puts a bright edge on a short note. **Night antenna** lets high air swell behind the fundamental. **Chalk bass** gives short bass notes a little friction. **Vanishing edge** takes away the clear carrier. |
| Clatterstep | **Six on the sill** makes the accelerating contacts easy to follow. **Deadstick** loses energy after the first hit. **Stairwell** opens the spacing and gives each impact a bright edge. **Domino run** combines a long first gap with short rings. **Bamboo pair** exposes two round contacts. **Zipped teeth** packs bright impacts together. **Brush pickup** lets the bounces emerge after the downstroke. **Heel block** suppresses the upper contact for low-register playing. |
| Switchyard | **Passing loop** alternates emphasis with a fifth. **Slow exchange** makes the octave hand-off easy to hear. **Semaphore bass** moves the answering rail down an octave. **Blue relay** answers in minor thirds. **Octave chatter** accelerates the exchange. **Fifth drone** keeps both rails audible. **Ghost siding** places a quiet answer a twelfth above the key. **Minor descent** answers below the fundamental. |
| Neverend | **Up escalator** rises around a faint anchor. **Service lift** descends through a low centre. **Falling asleep** moves slowly with a long tail. **Spiral stair** raises both speed and centre. **Fixed horizon** foregrounds a steady fundamental. **Undertow** pulls quickly downward below the anchor. **No floor** removes the anchor. **Parked belts** holds a static interval stack. |

## Pairwise originality review

| Pair | Audible distinction under the fingers |
|---|---|
| Portwheel / Hushwire | One resolves a pitch scoop early in the note. The other holds pitch while noise sidebands move around it. |
| Portwheel / Clatterstep | The rotor remains powered under a held key. The striker spends its energy on separate impacts. |
| Portwheel / Switchyard | A rotor makes one continuous run-up. The hocket repeatedly passes the accent between rails. |
| Portwheel / Neverend | The motor reaches its destination. The octave illusion continues through silent resets. |
| Hushwire / Clatterstep | Sidebands continue under a held key. The roll has a countable series of transients. |
| Hushwire / Switchyard | One varies the width and level of noise around a pitch. The other clocks the exchange of two discrete pitches. |
| Hushwire / Neverend | Air broadens the spectrum around a fixed centre. The belts move narrow tonal centres through octaves. |
| Clatterstep / Switchyard | Restitution accelerates and exhausts a finite train. Switchyard maintains its eight-pulse pattern indefinitely. |
| Clatterstep / Neverend | The striker has distinct successive onsets. The glissando masks its resets with overlapping windows. |
| Switchyard / Neverend | One lets the player hear the change of rail as an accent. The other's windows conceal the change of band. |

## Resources and integration

| ID | Sources / total owned nodes per voice, default and maximum fixed topology | Shared resources per canonical audio context |
|---|---:|---|
| portwheel | 2 / 6 | Up to 43 port widths, each with 96 harmonics. Browser wavetable storage is implementation-dependent. |
| hushwire | 3 / 11 | One 8 KiB noise table. An event-local seeded offset selects the excitation phase. |
| clatterstep | 2 / 7 | No buffers. Six contacts reuse the same two sources. |
| switchyard | 3 / 11 | One 8 KiB control cycle. Each note starts its own clock. |
| neverend | 10 / 21 | Two 8 KiB control cycles. Three voices read them at offset phases. |

Counts include the host gate. A bend may add one constant source. A live rebuild temporarily overlaps graphs during its crossfade. Relative cost is highest for Neverend. The existing per-track limit and freeze operation are the performance fallbacks for dense chords. No instrument renders PCM synchronously per note or requires a sample download.

Each category module exports one definition in `daw/js/synths`. Changes to `synths/index.js` register the five IDs. `performance-voice.js` handles parameter sanitation, native sources, envelope and declarative controls. `motion-tables.js` shares fixed control tables. `voice-lifecycle.js` accepts optional explicit pitch ownership. The panels use the standard dock and a scoped rule in `daw/css/style.css`. The tests are in `tools/five-synth-checks.js`, `tools/five-synth-host-checks.js` and `tools/pro-five-synths-test.mjs`, with the last included in `tools/pro-suite.mjs`.

Projects containing the five IDs need a runtime built with these definitions. A future web release or immutable player must bundle and identify this revision. The local build step prepares a player. The public deployment and historical inscriptions have their own versions.

## Verification · 19 November 2026

All five IDs were implemented and registered in the editable Pro checkout. The reference commit was `482b286`. The checkout also contained subsequent timeline and Drum Rack improvements. The registry still permits imports of local helpers, although an older synth README describes import-free modules.

| Instrument | Default / stock reference RMS | Highest peak across eight presets | RMS during 30–31 s hold | Frozen / restored mix maximum sample error |
|---|---:|---:|---:|---:|
| Portwheel | .0735 / .0488 jiMS10 | .6715 | .1899 | 0 / 0 |
| Hushwire | .0333 / .0300 Layers | .3732 | .1092 | 0 / 0 |
| Clatterstep | .0202 / .0605 Ordinal | .6053 | 0 | 0 / 0 |
| Switchyard | .0708 / .0513 Privkey | .3729 | .1702 | 0 / 0 |
| Neverend | .0537 / .0329 Stacker | .4517 | .1581 | 0 / 0 |

The level comparison used a dry MIDI 60 at velocity .8, a .45-second gate and a three-second analysis window. Clatterstep leaves much of that window silent. The peak comparisons use a single note. Dense chords can be substantially louder. The cost counts above were observed during the same default render.

The Pro build succeeded with `npm run build:audionaut-beta-pro`. The targeted suites exercised 40 presets, 36 schema controls, all 20 note lines, short gates, live release during attack, low and high MIDI notes, 16 overlapping voices, scheduled gain, rapid graph updates, pitch bend, future-note cancellation and repeat renders. The register/chord checks ran at 44.1, 48 and 96 kHz. A virtual MIDI input exercised pedal hold, bend recorded into a project note, arpeggiated pulses and panic for each ID. DOM tests exercised the standard panels, keyboard edits, slot isolation, switching, portable bank restoration, project round-trip and undo/redo. Stereo export and track-stage freeze used the real Pro render, WAV and unfreeze paths at 44.1 kHz. Both channels and frame counts matched before freeze, after freeze and after restoration.

**Test environment.** Those measurements used the independent JavaScript `web-audio-engine` offline implementation and Happy DOM. The renderer came from upstream blob `8641718d09c298311212af28235782cfd782be82` for the test session only. Its public `disconnect(destination)` wrapper passes a public object to an internal-node comparison. A standalone constant-source test measured peak 1 after disconnection. An adapter in the test process unwrapped that single argument and the same probe measured zero. Stock instruments reproduced the original routing discrepancy. No production code or target tolerance was changed to accommodate the renderer.

**Native-browser status.** Run `node public/audionaut-beta-pro/tools/pro-five-synths-test.mjs` from `xtrata-2.0` to repeat the targeted tests with the project's browser harness. The full `tools/pro-suite.mjs` was attempted here. Seven groups passed and 37 failed to complete. The local HTTP listener was blocked and the expected Playwright Chromium executable was unavailable. Some host tests also require files outside this sparse checkout. The native-browser suite, device MIDI, speaker/headphone audition, mobile layout and real-time CPU headroom are open checks. The CSS and DOM tests do not establish touch usability on a physical phone.

The five local WAVs use each instrument's first line and default patch at 108 BPM, 48 kHz and 24-bit PCM. No track effects, normalisation or limiting were applied. They are available for listening; automated signal measurements do not establish an aesthetic judgement.
