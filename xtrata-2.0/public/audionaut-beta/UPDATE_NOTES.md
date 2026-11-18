# AudioNaut beta — update testing notes

This separate beta contains the workstation updates from commit `b45f7a9`, based
on main commit `cd7e7f0`. Enter at `/audionaut-beta/` through the same membership
gate as the original. The production workstation and older prototypes are
unchanged. `BETA.md` describes isolation and original-file compatibility.

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

For workstation-only checks, open `http://127.0.0.1:8000/audionaut-beta/daw.html`.
The gated entry at `/audionaut-beta/` requires the normal built gate bundle. The
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
