# AudioNaut beta-pro — update testing notes

This workstation is isolated at `/audionaut-beta-pro/` behind the existing
membership gate. The original AudioNaut and earlier beta are unchanged.
`BETA.md` describes isolation and original-file compatibility.

## Console Mixer — 20 November 2026

- Mixer now presents narrow, equal-height channel strips with long vertical
  volume faders and separate left/right level meters. The Master stays visible
  while the channel bank scrolls horizontally, including on small screens.
- Output, effects, sends and trim sit above aligned pan/fader/mute/solo controls.
  Sends open in a compact inspector with level, pre/post-fader and removal controls.
  Group and bus creation, routing validation, inserts and master mono are retained.
- Faders support pointer/touch, consistent arrow/Home/End keys, double-click unity
  and a true-silence bottom detent. Pan double-clicks back to centre. Control nodes
  survive value updates, preserving drag/focus and one-step gesture undo.
- Stereo meters use disposable post-fader analyser taps, a decaying dBFS display,
  peak hold and click-to-reset overload indication. Taps disconnect on view changes,
  track removal and audio-context replacement; they never feed the audible output.
- Enabled volume/pan automation drives the displayed controls during playback
  without changing stored base values. Editing uses the existing recording modes;
  pointer cancellation, blur and leaving Mixer release active control gestures.
- No audio-engine, song-format, dependency, gate, original AudioNaut or earlier beta
  changes. Existing saved mixes keep their routing and legacy/post-insert fader order.
- Coverage includes actual stereo signals/overload, pointer and keyboard edits,
  undo/redo, routing/sends/effects, automation, file round trips, meter cleanup and
  fixed-Master layouts at desktop, tablet and phone widths in all three browsers.

## Timeline automation overlay — 19 November 2026

- Timeline has an Automation toggle that reveals editable curves over dimmed
  regions. Each track selects one parameter; buses and Master are included.
  The view preference is remembered locally. Hiding curves restores region
  editing without disabling automation or changing the saved song.
- Solid gold lines and dots show saved automation, dashed guides show parameters
  without points, and grey dashed curves identify bypassed lanes. The per-lane
  Read/Bypassed button controls playback separately from the display toggle.
- Timeline and the detailed Automation tab share curve drawing and gestures.
  Single-point lanes and values held after the last point now remain visible.
  Linear ramps and step changes share the same beat/value coordinates, with
  viewport drawing reduction for dense recorded curves.
- Click to add, drag to move, right-click/Delete to remove, or use arrow keys
  and numeric fields for precision. Alt removes snap and Ctrl uses fine snap.
  Completed drags form one undo step; Escape, lost capture, a view change or
  loading another song cancels unfinished edits. Selected Timeline parameters
  follow into the detailed editor.
- Validation: 30 interaction, rendering, responsive-layout and persistence checks
  pass in Chromium, Firefox and WebKit. The regression suite and cross-browser
  CI now include these checks.
- No song-format, audio-runtime, dependency, gate, original AudioNaut or earlier
  beta changes. Existing automation remains compatible with the same saved files
  and on-chain playback runtime.

## Drum Rack keyboard, library and panel — 19 November 2026

- Drum Rack opens at C1 (MIDI 36) and shows its 16 mapped pad notes, with drum
  names in key labels. Computer and piano-roll typing use the same mapping.
  Stored notes and hardware MIDI pitches are unchanged. Other instruments keep
  their existing octave behavior.
- Generic instrument panels put their knobs side by side and wrap on smaller
  screens. Drum Rack includes pad selection, audition and direct sample browsing.
- Each pad can open the existing sample library, including the drum packs and
  Ordinal sources. Assignment reuses the shared decoder and source references,
  creates a sample channel without replacing existing audio, and supports undo.
  Cancelled, failed and stale-project picks preserve the current song.
- Existing packs remain web-hosted until inscribed. No external library or audio
  engine change is introduced; saved pad mappings remain backward compatible.
- Validation: actual keyboard/pad audio, Analog Kit loading, saved mappings,
  failure/stale-project guards and responsive layout are covered in all three
  browser engines; shared keyboard and device integration checks also pass.

## Timeline channel cleanup — 19 November 2026

- Timeline sample channels omit trigger fill/cycle, shift-left, shift-right,
  clear-pattern and pitch/playback-rate controls. These remain in Patterns.
- Shared sample loading, preview, trim, FX/inserts, volume, mute/solo, provenance
  and synth controls remain available. The sequence selector still targets MIDI
  rolls and note copy/paste.
- This is a presentation change: saved trigger patterns and playback rates are
  preserved, with no change to song formats or the audio runtime.

## Shared track controls, region editing and historical audio loading — 19 November 2026

- Timeline uses the same sample and synth control builders as Patterns: sample
  loading/preview/trim, FX, inserts, provenance links, volume, pitch, pattern tools,
  synth folders/panels, MIDI rolls and MIDI copy/paste. An explicit Edit sequence
  selector identifies the target for sequence-specific operations. Audio channels
  and instruments can be added directly. Smaller screens wrap controls into taller
  lanes, preserving waveform alignment. Focused controls survive redraws.
- Control values and active states refresh from the same store in both views.
  Pattern cycling derives its next state from the song, so switching workspaces
  does not restart its cycle. Shared provenance popovers stay within the viewport.
- Patterns and Timeline now use one interaction controller: grab/move cursors,
  both trim edges, Shift selection, marquee selection, grouped edits, arrow-key
  nudging, Delete, right-click sample reversal, crossfades and cancellation.
  Snap values are shared. Alt moves freely; Ctrl gives fine movement. Previews
  leave the saved song untouched until release, with one undo step per gesture.
- Historical imports, direct sample loading and Samples & Loops share retrieval,
  embedded-audio extraction and decoding. JSON base64 fields, HTML audio elements,
  inline audio data URLs and mislabelled HTML fragments use the same parser.
  Configured fallback gateways apply to import transport failures as well.
- Unsupported portable PCM layouts now reach the browser decoder, matching the
  catalogue fallback. Truncated PCM is still rejected. Cancellation releases a
  pending native decode instead of occupying the catalogue queue indefinitely.
  Existing source/payload hash checks and pinned-source restrictions remain.
- The supplied report identifies OB1 #11 Small Click with “Unsupported PCM WAV
  layout.” Its actual inscription returned HTTP 403 here, so that exact audio
  remains a community retry case; synthetic fixtures verify the failure path.
- The immutable playback runtime advances to `beta-pro-shared-audio-1`. It remains
  prepared, not inscribed, with no new third-party audio dependency. Previously
  published runtime versions are unchanged.
- Regression coverage adds 54 shared gesture checks and nine import wrapper
  fixtures. Chrome/WebKit exercise real unusual-rate browser decoding. Local
  macOS Firefox stalls in native WAV decoding even for ordinary 44.1 kHz audio;
  it verifies wrapper/PCM parity and the fallback/cancellation contract instead.
  Linux Firefox CI exercises the real fallback too.
- The original and earlier beta trees, membership gate and song schema are unchanged.
  A sound-desk mixer layout is planned separately and is not part of this release.

## Continuous timeline and shared keyboards — 19 November 2026

- Timeline opens directly from the loaded song. There is no conversion step:
  ordinary sequences appear consecutively on one scrollable timeline, including
  empty sequences and sample tails that cross sequence boundaries.
- Patterns and Timeline use the same song data, sample timing and cached waveform
  drawing. Audio triggers appear as individual colored waveform regions; synth
  notes appear individually. Missing sounds have a placeholder while loading.
- The ruler shows bars and sequence boundaries. Track names, Mute, Solo and Volume
  stay pinned while scrolling. Zoom and Fit song support detailed or whole-song
  views. Only the visible canvas area is drawn; waveform peaks are cached.
- Timeline has Play/Pause, Stop, Return to start, bar/beat position and a moving
  playhead driven by the audio clock. Click the ruler to seek. Follow playhead is
  optional; manually scrolling during playback turns Follow off.
- Select a region to edit, delete or reverse it; drag to move and drag an audio
  edge to trim. Sample moves can cross sequence boundaries, with collision
  protection and one-step Undo/Redo. Double-click opens the existing step or
  piano-roll editor. Returning to Patterns shows the same edits.
- Existing custom clip arrangements retain their placement and timing. Advanced
  arrangement, loop, punch, tempo and meter controls remain in a collapsed panel.
  Editing a linked pattern changes its other appearances too. Linked note
  continuations and sustained-sample gates use their existing editors rather
  than being silently broken by a timeline trim.
- All horizontal piano keyboards share one key layout and note mapping. Black
  keys now align with white-key boundaries, including Cathedral's final octave.
  Each instrument retains its visual theme. The vertical piano-roll keyboard
  shares note identity and input handling while staying aligned with its rows.
- Mouse, touch and pen use the same note lifecycle, including glissando,
  independent held notes and release on cancellation, lost capture, blur or panel
  disposal. Computer keys and MIDI continue through the central live-note path.

Opening Timeline does not rewrite a song or change its playback mode. Existing
Chain/sequence-loop, song-end and historical playback semantics are retained.
Original AudioNaut files continue loading through the existing importer; there
is no project schema change. No new external library or media was added. The
prepared chain player remains `beta-pro-legacy-bridge-2`, with SHA-256
`47c1f7ecc4cc6a4255310b2586cbcd91b76bb319239faa7663a9c45f48efd749` (1,356,875 bytes).
It is still prepared, not newly inscribed by this update.

Targeted validation: 121 timeline/geometry checks and 12 keyboard lifecycle/layout
checks pass in Chromium, Firefox and WebKit. All 31 instrument panels pass layout
checks; Cathedral and jiMS10 pass the deeper real-pointer, multitouch, typing,
MIDI and audio checks. Synthetic local audio was used; real controller and iOS
hardware testing remains community work. No wallet was used to sign or pay.

## Performance and editing

- The Play instrument control, highlighted instrument row, Dock and Roll share a
  target. Clicking another track's Mute or Volume does not redirect MIDI.
- The live arp works with held computer, mouse and MIDI notes, including when
  transport is stopped. Rate, order, octaves and gate are saved per instrument.
- MIDI tracks each port/channel/note independently, supports CC64 sustain and
  pitch bend (±2 semitones), and releases notes on disconnect or Disable MIDI.
  Panic cancels queued notes, playback, previews, arps and effect tails.
- Sustained voices use managed note lifetimes and release on note-off. Polyphony
  is bounded; note lights account for overlapping voices. Stop cancels both
  sounding and future scheduled sources. Scheduler stalls skip missed events.
- The five synths without custom faces now have usable parameter panels. Each
  instrument remembers each synth's last patch when switching away and back;
  selecting the same synth again leaves its patch intact.
- Roll recording uses the audio clock for every input, continues notes across
  sequence boundaries, and cancels stale pending recordings on project changes.
  Undo/load rebuild its controls and selection; arrow keys nudge notes correctly.
- Effect drags, XY controls and the filter graph support Shift for fine movement
  without a value jump; double-click restores their defaults.

## Undo, saving and recovery

- Undo stores reversible changes grouped by gesture, with a limit of 100 entries
  and 8 MiB of change data. A new edit invalidates Redo immediately. Playback and
  navigation do not create edits. Restoring volume also restores the audio gain.
- Embedded audio lives once outside the edit/history objects. Undo may retain up
  to 64 MiB of old audio beyond the assets needed by the current project; oldest
  entries expire when a limit is reached.
- Browser autosave uses IndexedDB, with a visible status and a Projects panel.
  It keeps up to 12 projects and five versions per project, deduplicates stored
  audio and removes unreferenced assets. Failed writes preserve prior versions.
- Existing localStorage recovery migrates after a successful database write.
  Portable JSON still includes local audio and imports older project formats.
  Malformed imports leave the current project intact; legacy tempo is clamped.
- Load, Starter, New and recovery guard against overwriting work changed during
  an asynchronous operation. Downloaded project files are separate backups;
  browser storage remains subject to the browser's quota and eviction policy.

## Export and inscription

Export / Inscribe prepares either a stereo WAV (whole song once or current
sequence, with a chosen effect tail) or editable project JSON. Rendering uses a
separate audio context and leaves live playback and edits alone. Missing audio
and unsupported offline effects produce a visible error. Changes invalidate a
prepared file so an older mix cannot accidentally be submitted as current work.

Review inscription saves the project and hands the file to the existing Create
or large-file Wizard review. Fees, signing and publication remain in that flow.
No wallet transactions were performed during these checks. Local audio is
embedded in project JSON; remote audio keeps its original references. Use WAV
when the intended artifact is the finished recording.

## Try the branch

From the repository root, serve the public directory:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory xtrata-2.0/public
```

For workstation-only checks, open `http://127.0.0.1:8000/audionaut-beta-pro/daw.html`.
The gated entry at `/audionaut-beta-pro/` requires the normal built gate bundle. The
final inscription review uses the main application's routing and should be
checked in the normal app preview.

1. Select an instrument, enable Arp, hold a chord and change its rate/order.
2. Enable a real MIDI controller; try sustain, bend, disconnect/reconnect, Stop
   and Panic. Confirm Mute/Volume on another track leave the target unchanged.
3. Switch synths after adjusting a patch, then switch back. Record across a
   sequence boundary, nudge notes, undo and redo while playing.
4. Import local audio, make edits, reload, and open an older Projects version.
   Export JSON and reopen it in a fresh browser session.
5. Prepare and download WAV and project files; listen to the mix. Test the
   inscription review handoff in the app preview without authorizing a payment.

## Automated checks and remaining listening work

The scripts documented in `tools/README.md` cover input lifecycle, all synth
pickers, held notes, recording, bounded history, recovery failures/races, export,
handoff and responsive controls. The audio suite checks all 28 default voices
and 23 sustain-capable defaults after 30.5 seconds. Interface checks use Chrome
at desktop, tablet and 390-pixel phone widths.

Natural plucks, drums, struck mallets and Tine retain their decaying character.
Rendered FM and some modal/glass textures sustain a crossfaded sample region;
their long-hold timbre needs musical listening tests. Native synth graphs keep
their own modulators running. MIDI automation uses simulated devices, so real
controllers and hours-long sessions still need hands-on testing. Offline export
caps its stereo render buffer at 256 MiB; long songs can use sequence export.
