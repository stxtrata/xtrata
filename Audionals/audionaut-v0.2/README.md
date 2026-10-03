# The Audionaut v0.2

A standalone extension of Audional Sequencer X with Bitcoin audio discovery, timed word sampling and a working Xtrata content reader. The original Sequencer X and Audionaut V2.3 directories remain separate.

## Run

Serve this directory with `npm run serve` and open `http://localhost:8080`. A static HTTP server is sufficient: no build, dependencies, backend or wallet is required. Opening `index.html` directly as `file://` will not load the modules or indexes.

## Workflow

1. Choose **L1 audio library** to browse 1,682 unique Bitcoin inscription entries. The saved 1,621-entry inscription catalogue is combined with curated OB1/Audional samples, 49 saved metadata entries and the sources represented in the transcripts. Search names, IDs or transcript excerpts; filter for word timings, curated samples or metadata. Known song/application landmarks are routed to their own options rather than treated as audio samples.
2. Choose **Find words** to search 16,125 positive-duration word records across 638 recordings. Single-word searches allow partial matches; phrases match consecutive complete words, ignoring case and punctuation. Each word/phrase result has start/end trim sliders, precise seconds fields and **Reset trims** to restore its original timings. Waveforms load automatically for word/phrase results and favourites, with a highlighted selection, draggable cyan edges and dashed original boundaries. Recording downloads are shared across matching words and limited to two at a time; changing the search or closing the browser cancels pending waveform loads. **Refresh waveform** reloads the view, or **Retry waveform** retries an unavailable source. Loading waveforms never starts playback. **Wider view** reveals more surrounding audio. Waveform views retain small peak arrays rather than decoded recordings for every result. Preview, Play all, favourites, WAV export and sampler import use the adjusted bounds. **Load into sampler** uses the selected channel and either its default trim or a particular step. A phrase loaded into an empty channel also activates step 1. Use the same source in one channel to place different spoken sections at different steps.
3. Load Xtrata audio through a channel's **⊕ → Stacks / Xtrata** tab or the browser's **L2 / URL / File** button. The default reader uses the repository's public v3 contract with a v2 fallback at `xtrata.xyz/runtime/content`. Change the gateway template in Settings for other contracts or networks. URL and local-file sources use the same decoder.
4. **Arrange** switches the step grid to waveform regions. Region lengths follow actual sample duration, trim and pitch. Drag edges to trim, edit crossfade boundaries, click a region to open its editor, and right-click to reverse. **Steps** returns to the 64-step buttons. Alt-click a step to edit its exact seconds, reverse, pitch or crossfade. Phrase labels appear on waveform regions and step tooltips.
5. **Audio tools** measures decoded duration, sample rate, channels, peak, RMS, DC offset and the proportion of samples below −60 dBFS. Export CSV analysis or a selected-section PCM WAV. WAV export applies the section's reverse and playback speed, and repeats an active sustain loop for its selected gate; it does not render insert effects. A beat-count field computes loop tempo from the selected duration; it is not automatic beat detection.
6. **Save phrase** creates a favourite without downloading its audio. Favourites persist separately in this version's browser storage and can be exported/imported as a phrase-library JSON. Phrase WAV export is available directly from a search result.
7. **Record mix** captures the master output, including instruments and effects. Start playback, then choose **Stop recording** to download WebM/Opus (or Ogg where supported). This is real-time recording. It records the app's output, not the microphone.
8. A channel's **⊕ → Library → Songs & historic applications** offers native auditioning of the three fixed on-chain songs. **Export song session** saves an editable project with its ordinal sources, tempo, channels, trims, speeds, sequence arrangement and normal/reversed steps. Open that file using the main **Load** button after saving your current project. Audition/export leaves your current session unchanged. Historic applications and the Infinite Remix open their original players; use their Play controls after loading. See [song compatibility and on-chain engine findings](SONG-COMPATIBILITY.md).

9. Open **Beats** and choose **L1 beats** in its collection selector for a separate collection of 96 four-bar beats across 82 genre/style labels, using 24 curated Bitcoin audio sources: all 15 catalogued OB1 entries, six OG hits and three short loops. Search by beat, style, sample or inscription ID; filter by genre, and expand each beat’s sample list to see its original inscriptions. Kits use accents, fills, pitched bass steps, short sample regions and effects. Loop sections use the catalogue’s nominal 105 BPM, with playback speed adjusted to the preset tempo; this changes pitch as well as speed. Load prepares all audio before changing the session, with two downloads at a time. Failure, cancellation, a closed picker or edits during loading leave the session intact. Successful loading updates the current pattern and kit, mutes other sample/instrument tracks and loops the current four-bar sequence. Other track data remains editable; unmute it to add your own parts. **Beats** opens the upgraded Original collection of 96 presets; the collection selector switches between Original, L1, Combined and Onboard tonal subdivisions in the same pop-up.

10. In **Beats**, choose **Combined beats** for 128 four-bar presets: 32 new tonal ensembles with L1 percussion, plus **OB1 Pocket**, **Percussion Weave** and **Loop & Hits** versions of each of the 32 original beats. The 96 core combinations now distribute all 144 embedded sounds and all 184 root/layer recordings across eight-part ensembles, with L1 backbeats, hats, percussion accents or short drum loops added on separate channels. Each preset lists original L1 inscription links and labels built-in sources as **local today / planned L2**. Built-in sound keys remain stable for a future verified L2 manifest. These sounds have not yet been inscribed on L2. Combined loading uses the same complete-kit preparation, cancellation, track isolation and save/load behaviour as the L1 collection.

## Inherited music tools

The **Beats** pop-up stays open after loading any collection. Use its **Play/Pause**, **Stop**, **Previous** and **Next** controls to audition the current filtered list. While transport runs, the current beat continues during downloads and the new kit replaces it without stopping or resetting the playhead; its tempo and swing take over for subsequent steps. While stopped, loading stays stopped until Play is pressed. All collections prepare their full kit before assignment. Selecting another beat cancels the older pending load; filters and collection controls remain usable throughout. The loaded row is highlighted, and the latest requested row shows loading. Failed/cancelled loads preserve the current beat. Closing the pop-up cancels pending loading while transport playback continues. Original presets preserve other instrument/sample tracks; L1 and combined kits mute other tracks for isolated auditioning.

**Play all** in the sample loader plays the entire selected category in order. In the L1 catalogue, word search and favourites, it plays every matching result across all pages, in result order. Audio samples play in full; words and phrases play their selected start/end regions (including edited timings on visible results). The same button changes to **Stop all** while running; clicking again cancels pending loading and stops playback immediately. Closing the browser/loader, changing the search/category, or starting a separate preview also stops the queue. Playback does not change the session. Fixed songs play their full arrangements; interactive applications/remixes are skipped with a count because they require their original controls. Unavailable/undecodable files are reported and skipped so the remaining list can continue.

Ordinal sources display their full inscription IDs and links to both the original inscription page and its content. These appear in channel rows (Steps and Arrange), sample/step editors, Audio Tools, library selections, catalogue/word/favourite results and imported song provenance. Song entries also expose their instruction/engine IDs and an expandable list of each channel's sample inscriptions. This includes raw audio, Audional Base64 JSON and HTML-embedded OB1 sources. Canonical links remain independent of the configured loading gateway; local files and generated synth samples do not receive ordinal links.

- 16 default sample channels, expandable to 64; 64 steps per sequence and up to 64 chained sequences.
- Four instrument channels with six synth engines, parameter panels, piano-roll presets, note selection/move/resize/split, velocity editing, copy/paste and computer-keyboard recording.
- On-board synthesized drum kit, beat presets, swing, accents, per-channel pitch/reverse/volume, mute/solo and automatic pattern tools.
- Channel filter/drive/delay/reverb and serial insert-plugin chains; global choke and per-step crossfades.
- Undo/redo, sequence copy/paste and JSON project export/import.
- **Enable MIDI input** in a piano roll connects available MIDI devices only after that button is clicked. Arm REC while transport runs to record notes with quantized starts and durations. Live MIDI audition uses the roll's selected note length. MIDI support and permission handling depend on the browser.

## Saved projects and reliability

This version saves `audionaut-workstation/2` project files and imports the previous `audional-sequencer-l1xl2/1` format and its own autosave/settings keys. Existing Sequencer X and legacy B64x/Audional presets import. This does not convert Audionaut V2.x Tone synth patches or every other experimental sequencer's project format.

Phrase/source metadata, channel regions, per-step regions, synth notes and effects persist. Newly imported local audio is embedded in project JSON, so it can reopen without the original file picker. Large embedded projects can exceed browser-storage quota; the status bar requests saving a project file when autosave fails. Local files from older projects that stored only a filename must be selected again.

Loads check the destination project/channel before assigning audio. Invalid ranges, cancellation and stale async requests cannot replace the selected channel. Source replacement removes stale per-step overrides. Undo/project restoration reloads matching source buffers. The decoded preview cache and legacy render cache are each limited to approximately 64 MB. Encoded onboard family packs use a separate 24 MB cache; audio actively assigned to channels is retained separately. Imports are limited to 50 MB per encoded source. WAV exports are limited to 200 MB. Long full recordings can still use substantial decoded memory.

## Data provenance and scope

The bundled indexes are recovered snapshots, not a live or complete Bitcoin audio census. Audio availability, CORS and decoding depend on the selected gateway and browser. Stored transcriptions have not been systematically verified against the audio; this version does not run new speech recognition.

- `B64x-v2.0/AudioInscriptions/all_audio_inscriptions.json`: 1,621 saved IDs.
- `on-chain-music/AudioSearchEngine_v1/TranscriptionArrays`: original word timings, via the compact index recovered in Audionaut V2.3.
- `Audional-Base64-Sampl--Loader-Module/v4/audional-sample-metadata.json`: saved analysis and name-derived hints. BPM/key hints are not verified musical analysis.
- Sequencer X's curated library: named OB1, OG Audional and Bitcoin Step samples, plus song/application landmarks.

The word index excludes 121 duplicate transcript files, 143 empty originals and 186 zero-duration word records. All original source files remain in their original repository.

To refresh the combined catalogue after updating those datasets:

```
python3 scripts/build-l1-index.py --audionals /path/to/audionals
```

The refresh script also copies the compact word index from `Audionaut-Sequencer/V2.3/data/word-index.json` to keep the searchable timings and catalogue coverage aligned.

## Verification

Run `npm test` for dependency-free tests covering index completeness, search, exact bounds, source normalization, raw/Base64 decoding, transactional and competing loads, source replacement, native/legacy project compatibility, embedded local files, analysis, WAV output, pitched sampler duration, recovered song fixtures, OG mute automation, compressed zero-based/reverse steps, high playback speeds, gzip limits and song cancellation, plus L1 beat source coverage, loop timing, load cancellation and isolation of other tracks.

Browser verification on 2 October 2026 exercised real L1 phrase sampling, Bitcoin HTML and Base64 JSON decoding, Xtrata inscription 1120, both views, transport, phrase save/load, invalid-range protection, WAV export, catalogue filters, favourites, mix recording, synth roll presets, synthetic MIDI messages and a 390px mobile source-browser layout. Real MIDI hardware has not been tested. L1 beat verification decoded all 24 curated sources, prepared all 96 presets against the live recordings, loaded and played a loop-based beat, and checked filtering, source links, mobile layout and failure/cancellation protection. Full catalogue audio availability has not been exhaustively checked.

`tests/browser-smoke.cjs` reproduces those integration checks using Playwright and Chromium. With Playwright available, serve the app and run `npm run test:browser`. It uses the server at `http://127.0.0.1:8080` by default and writes reports/screenshots to a temporary directory. `SEQUENCER_URL`, `PLAYWRIGHT_MODULE`, `CHROMIUM_EXECUTABLE` and `OUTPUT_DIR` override those locations. This optional test needs network access to the selected L1/L2 samples; the normal `npm test` suite works offline.

`npm run test:songs` auditions all three fixed songs using live Bitcoin audio, checks their session exports, reopens one export and tests playback. Full historical render equivalence and the seed-generated Infinite Remix effects are outside these checks. Native song auditions use corrected Web Audio duration semantics, rather than reproducing historical pitch/duration bugs.

## Implementation map

`js/l1-beats.js` defines the separate on-chain beat collection; `l1-beat-loader.js` prepares and applies complete L1 kits. `js/source-browser.js` owns source discovery/favourites; `source-actions.js` applies validated selections. `loader.js` handles L1/L2/raw/Base64/HTML/file decoding and bounded preview caching. `word-index.js` searches the compact timing dataset. `audio-utils.js` provides analysis and WAV/CSV output; `audio-tools.js` supplies its UI and mix recorder. The original X state, arrangement, step UI, synth, effects and piano-roll modules remain the musical foundation.

See [PLAN.md](PLAN.md#onboard-sound-library-review-and-expansion-plan--2-october-2026) for the original audit, 144-sound expansion scope and completed implementation checks. The original implementation decisions and checklist remain in that document.

## Expanded onboard library — implemented 2 October 2026

Open a channel’s **⊕ → Library**. The default is **Onboard · Studio kit**; choose another family in the selector and filter by name or tag. The bank contains **144 named sounds**: 24 improved studio versions of the original kit, 16 basses, 16 plucks, 16 synthesized keys, 12 bells/mallets, 12 leads, 12 pads, 12 baked chord stabs and 24 new percussion sounds. The **Legacy kit** category keeps the original 24 keys and renders intact for existing projects.

There are **184 canonical PCM16 WAV assets**, including three octave roots for the first four bass/pluck/key patches and soft/bright layers for four keys and four mallets. Root and layer selectors change the selected recorded asset. Audition plays that recording at its root. A step’s **Note** selector converts the requested note to playback rate; ordinary transposition changes duration. Chords transpose their labelled baked voicings as a whole. **Sustain** sets pad gate length in sequencer steps; One-shot disables repeating. Reversing a pad or trimming away its loop also disables sustain. Arrange shows repeated loop geometry and note labels; WAV export uses the same gate duration. Root, layer, audio hash, region, note and gate survive save/reopen.

The new **Onboard tonal beats** subdivision contains 32 complete local ensembles. **Combined beats** upgrades its core 96 arrangements with the full embedded bank and retains 32 of those ensembles with genuine L1 percussion, bringing it to 128. Every group uses the same popup and continuous audition controls.

The nine lazily loaded family packs total **30,813,832 bytes (29.39 MiB)**; the WAV audio inside them totals **22,962,570 bytes**. Packs range from approximately 1.15 to 8.31 MiB. Nothing from the bank is decoded at startup. The family download links preserve embedded audio, recipe and metadata. The source manifest records stable IDs, versions, roots, velocity layers, seeds, loop bounds, voicings, audio hashes and duration/peak/RMS/DC measurements. The finalizer checks finite values, removes DC, trims trailing silence, fades edges and sets family headroom; legacy cached buffers are never mutated.

Local assets live in `media/onboard-v2/`: family JSON packs, `manifest.json`, planar Float32 working renders in `working/`, and 184 individual embedded audio payloads in `publication/`. The publication manifest records each payload’s exact bytes and SHA-256 alongside its audio hash. They are **local and unpublished**. No L2 inscription IDs are assigned. These files have not been staged or pushed.

For future deployment, fill the separate `audionaut-l2-sounds/1` reference manifest with actual `assetId`, matching `audioSha256`, `network`, `contractId` and numeric `tokenId` fields. **Import L2 replacement manifest** fetches and verifies every referenced audio file, then replaces matching onboard channels while preserving their settings and steps. Any failed verification or session edit prevents migration. This is a read-only import and does not inscribe, sign or pay. The empty template intentionally contains no invented references.

Run `npm run sounds:audit` to verify all packaged hashes, PCM measurements, silent edges, pad seams and stereo mono compatibility. Run `npm run sounds:package` to regenerate individual publication payloads after an audit. `npm run sounds:build` rerenders the full bank in Chromium, replaces the canonical manifest and retains local Float32 audio; it needs Playwright and a running local server. `PLAYWRIGHT_MODULE`, `CHROMIUM_EXECUTABLE` and `AUDIONAUT_URL` configure the render environment. Static playback does not require this tooling.

The inherited 50 offline regression tests cover the original sound library, and `npm run test:onboard` verifies all 184 assets in a real browser, correct sub-root tuning, legacy compatibility, rooted/layered selection, pitched and sustained playback, save/reopen, uninterrupted beat changes, integrity rejection and a 390px library layout. The browser check supports `PLAYWRIGHT_MODULE`, `CHROMIUM_EXECUTABLE` and `SEQUENCER_URL`. Measured peak is at most 0.707916 (approximately −3 dBFS); maximum absolute decoded PCM DC is 0.0000103. Full measurements are in [the expansion audit](reports/onboard-expansion-audit.json).

Numerical checks and representative playback do not certify the taste or realism of every patch. These are deliberately synthesized sounds, ready for a human listening review; the labels do not claim sampled acoustic instruments. L2 deployment and its real-network verification remain a later action after publication.

## Original and Combined beat upgrade

**Original beats** now contains 96 four-bar presets: **Studio Pocket**, **Melodic Motion**, and **Texture & Fills** versions of each of the 32 historic styles. Each uses eight embedded tracks: kick, backbeat, top percussion, percussion colour, bass, two melodic parts, and a pad or baked chord stab. The styles retain their original tempo, swing and core groove, with different ghost notes, pickups, bass lines, melodic rhythms and fourth-bar fills in each variation. This group requires only the local embedded banks, without external sample downloads.

Both Original’s 96 presets and Combined’s 96 core presets cover **all 144 named sounds and all 184 recorded assets**. Every sound appears at least three times. Allocation rotates through the role-appropriate studio and new percussion, every bass, pluck, key, bell/mallet, lead, pad and chord. The four multi-root layered keys get six appearances apiece so all their root/layer combinations appear; redundant fourth appearances of selected plucks and bells are redistributed while preserving their coverage. Melodic lines follow the chord’s major, minor or suspended palette, with octave/register variations, editable sample notes, sustain gates and short voice crossfades.

**Combined beats** keeps the same 96 core preset IDs, names, tempos, and three L1 lanes, upgrading their embedded ensembles. The 32 extra tonal/L1 ensembles remain available, so its visible total stays **128**. **L1 beats** remains its separate unchanged 96-preset collection. The 32 Onboard tonal demonstration presets also remain available. Existing project audio and steps are not rewritten; the historic 32 recipes remain in `js/legacy-beats.js`.

Source details now list sound families, recorded roots and soft layers. Search accepts family names such as pads, keys or plucks. Root/layer variants load independently; repeated identical variants share a decode. Save/reopen retains the chosen beat ID and kit size as well as audio, notes and settings.

`npm run beats:audit` regenerates [the complete coverage report](reports/beat-library-coverage.json). `npm run test:beats` checks all 192 upgraded presets against real embedded and Bitcoin audio, plus live replacement, popup browsing, source details, save/reopen and mobile layout; configure Playwright/Chromium and the local server as for the other browser checks.

## Samples & Loops — v0.2 integration

Open **Samples & Loops** in the workstation toolbar. The first 22 musical
candidates appear initially; select **All sources** for the full supplied
195-source catalogue. Its 79 reported sources under 20 seconds remain a
separate discovery filter. Longer sources can contain short clips; unknown
reported durations remain searchable. This is Jim's working catalogue, not a
complete Bitcoin audio census or the full public ord.audio dataset.

Preview a source or its selected region, adjust the region's seconds or trim
sliders, select the destination channel, then choose **Load region into channel**.
An empty pattern activates step 1. The normal sequencer, Arrange view, channel
FX, reverse/rate controls, sample editor, Undo, WAV export and mix recording
remain available. **One-shot** is the default even for proposed loops. Select
**Repeat loop for gate duration** explicitly to use repeat playback; the gate
uses existing sequencer steps. Loop bounds must lie within the playable region.
Reverse loop playback is unavailable; reverse one-shot playback is supported.
Playback rate changes pitch as well as duration. No pitch-preserving stretch,
automatic beat detection, key detection or automatic tempo sync is implemented.
Draft BPM/key notes never enable synchronisation or set review approvals.

The browser displays original notes, reported versus decoded duration, full
ordinal links, draft/verified musical labels, curator review and permission
status. **Preview** uses the existing audio context at a conservative level and
never assigns a sound, edits the project or stops its transport. **Stop preview /
cancel load**, selection changes, destination changes and closing the browser
cancel pending work. Loading prepares and validates the full selected region
before replacement. Failed or stale loads leave the old sound intact.

### Integration map (real file paths)

All paths below are relative to `Audionals/audionaut-v0.2/` in Xtrata.

| Area                                          | File / extension point                                                                                                                                                                                                    |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App entry and toolbar                         | `index.html`, `js/main.js`: Samples & Loops button and native tool initialisation.                                                                                                                                        |
| Validated adapters and timing                 | `js/clip-contract.js`: editable catalogue / split manifest parsing, explicit v0.1 migration, strict bounds and canonical snapshot contracts.                                                                              |
| Native catalogue browser                      | `js/samples-loops-browser.js`, `css/style.css`: search, first-22/all sources, filters, source details, waveform trims, playback and channel destination.                                                                  |
| Curated library and personal overlays         | `js/clip-library.js`: imported revisions, independent clips, source measurements, backup/draft/curator-readiness exports.                                                                                                 |
| Resolver, decoding and assignment             | `js/loader.js`: existing `ordinalId`, `resolveSource`, `extractAudio`, `fetchAndDecode`, assignment tickets and transactional `assignDecodedSample`.                                                                      |
| Bounded catalogue retrieval                   | `js/catalogue-retrieval.js`: shared cancellable jobs, two requests at a time, timeouts, payload/decoded caches and source/payload SHA-256 checks. Uses the real resolver, extractor and AudioContext.                     |
| Real preview, channel loading and restoration | `js/clip-actions.js`: `previewClip`, `loadClip`, `restoreClipChannel`, immutable snapshots and normal Undo.                                                                                                               |
| Existing transport / sampler                  | `js/engine.js`: existing preview route and trigger scheduler; explicit selected loops use the same channel graph and clock.                                                                                               |
| Gate/waveform/WAV behaviour                   | `js/onboard-library.js` (`sampleLoop`, `sustainDuration`), `js/arrange.js`, `js/ui.js`, `js/audio-tools.js`: shared loop semantics for onboard and ordinal clips.                                                         |
| Project format and unresolved sources         | `js/persistence.js`, `js/loader.js`, `js/ui.js`: native v2 format, old native/legacy imports, strict pinned-snapshot validation and retained unresolved source information.                                               |
| Existing tools and attribution                | `js/source-actions.js`, `js/source-browser.js`, `js/ordinal-links.js`, `js/song-format.js`, `js/song-player.js`: word sampling, separate v0.2 favourites, original Bitcoin/Xtrata references and historic song behaviour. |
| Supplied catalogue                            | `data/samples-loops-catalogue.json`: the unchanged 195-source editable catalogue.                                                                                                                                         |
| Maintainer reference package                  | `reference/catalogue-lab-v0.2/`: checksum-verified source package, schema, reports, original notes, reference app and optional fixture/helper code. It is not embedded or initialised by the workstation.                 |

### Adapter, migration and export contracts

Supported imports are `audionaut-sample-catalogue` / `schema_version: 0.2.0`
with `assets[].clips[]`, and `audionaut-clip-library-proposal` / `version: 0.2.0`
with split `sources[]` and `clips[]`. Source identity is `btc:ord:<full ID>`;
clips have independent `<source ID>:clip:<suffix>` IDs. Separate inscriptions
remain separate even with identical encoded payloads. `active_clip_id` is not
playback selection, and the editable source's active `review` mirror is ignored
in favour of the complete authoritative `clips[]` collection.

| Editable catalogue                                                         | Native meaning / manifest equivalent                                                                                                                                       |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inscription_id`, `record_id`                                              | Full Bitcoin identity; manifest `sources[].inscription_id`, `id`.                                                                                                          |
| `clips[].clip_id`                                                          | Independent clip ID; manifest clip `id` plus `source_id`.                                                                                                                  |
| `review.trim_start_seconds`, `trim_end_seconds`                            | Source-timeline region; manifest `region.start_seconds`, `end_seconds`.                                                                                                    |
| `review.trim_start_frame`, `trim_end_frame`, `frame_rate` when present     | Reference frame basis; manifest `region.start_frame`, `end_frame`, `frame_rate`. End frame is exclusive.                                                                   |
| `review.loop_start_seconds`, `loop_end_seconds`, `beats`, `bpm`            | Manifest loop bounds, quarter-note beats and BPM; manual metadata, not detected timing.                                                                                    |
| `review.loop_verified`, `bpm_verified`                                     | Manifest `loop.seam_verified`, `tempo_verified`.                                                                                                                           |
| `review.key`, `root_note`, `key_verified`                                  | Manifest `tuning.key`, `root_note`, `verified`.                                                                                                                            |
| `review.status`, `auditioned`, `reviewer`, `reviewed_at`                   | Curator decisions preserved independently from decoding and playback.                                                                                                      |
| `technical`, `original_note`, `rights`, `source_urls`, `curation_proposal` | Technical/reported data, original attribution, permission evidence, provenance and note-derived proposals. Original source/clip records are retained in export extensions. |

Null ends, frames, rates, BPM, keys and review flags stay unknown/unselected;
they are not converted to zero/false. Seconds are authoritative when present;
frame-only regions map through their recorded frame rate, never through the new
decoder's frame rate. The decoder may resample. Selected numeric regions are
validated against the decoded source and never silently clamped. An unset end
previews to the decoded end; loading pins an explicit project-local resolved end
without approving or changing the curated clip. Timing/frame-basis edits clear
tempo/seam approvals; tuning edits clear tuning approval. Measurement never sets
audition, tempo, seam or key verification.

v0.1 editable catalogues require checking **Convert v0.1 single-region
catalogues on import**. Each original review/region becomes exactly one new clip;
no automatic ambiguous migration occurs. Unsupported versions, duplicate IDs,
missing references, invalid hashes, inconsistent frames and numeric ranges are
rejected with record errors before committing. The existing library/project is
retained on failure.

### Refreshing and editing the library

Use **Import catalogue / manifest** to import reviewed v0.2 JSON from the
maintainer desk without rebuilding the app. Imports update curated records by
identity and retain personal overlays, independent local clips and up to three
previous curated revisions in the workstation backup. **Save personal clip
edits** creates an overlay; **New independent clip** creates a separately editable
clip from the same source without copying approvals. Source audio is not copied
or reinscribed merely to define another region.

**Export draft clips** includes all effective clips, unknown permissions,
original source records, notes, review evidence and separately labelled
workstation measurements. **Back up personal edits** retains the curated base,
overlays, personal clips, measurements and revision history; import that JSON
through the same button to restore it. **Curator-cleared export + omissions** is
a separate optional readiness report/export. It requires curator approval,
listening/reviewer, decoded hashes, explicit valid region, supported use, recorded
licensed/public-domain terms and HTTP(S) evidence. Loops also require tempo/seam
review and the prototype's 2% arithmetic consistency check. This is no beat
detector and no independent legal certification. None of those gates restricts
normal draft browsing, playback, project saving or draft export.

### Production snapshots and compatibility

Projects save `format: audionaut-workstation/2`, `clipSnapshotVersion: 1` and a
per-channel `clipSnapshot`. The snapshot contains full source and clip identity,
original attribution/rights/review/proposal records, fetched response/payload
hashes, precise resolved region, decoded frame basis, explicit mode/gate/rate/
reverse choices and effective verification state. Its SHA-256 is calculated from
UTF-8 canonical JSON: recursively sorted object keys, array order retained,
undefined object fields omitted, standard JSON primitives; `snapshotHash` itself
is excluded. This fingerprint detects changed metadata; it is not a signature
or Bitcoin inclusion proof.

Later catalogue edits do not mutate snapshots. Loading the revised clip again
is the explicit update action. Projects reopen using their pinned ordinal
reference without requiring an installed/current catalogue. Existing channel and
step overrides remain saved by the native format. Restoration maps native
channel trims through the saved measured source timeline before applying the new
decoded rate, preserving later trim/rate/reverse edits. An incompatible region or
unavailable recording leaves an unresolved channel with its original references,
snapshot and settings; it is not dropped or replaced with another sound.
Decoded PCM is not claimed byte-identical across browsers.

v0.1 native L1xL2, Sequencer X and legacy Audional/B64x project imports remain
supported. v0.2 has separate project/settings/favourites/library browser keys;
it never overwrites v0.1 autosave. Transfer existing productions with Save/Load,
and favourites using their export/import controls. v0.2 clip projects require a
v0.2-capable player; v0.1 cannot interpret the new ordinal clip loop semantics.

### Retrieval, resources and offline boundaries

No audio downloads at startup or merely opening the catalogue. Requested
inscriptions use the workstation's configured Ordinals gateway, with optional
explicit `settings.ordinalsFallbacks` retrieval templates. Changing a gateway
never changes source identity. Catalogue requests share pending work by full ID
and expected hashes, run at most two at a time, time out after 30 seconds and
bound encoded source responses to 50 MB. Gateway/timeout, unsupported format and
hash mismatch errors are distinguished. A hash failure never substitutes audio.

Catalogue source/payload bytes are retained unchanged in a 32 MB memory cache;
decoded catalogue buffers have a separate 64 MB memory cache. Buffers actively
assigned to channels remain owned by the existing engine. Cache entries are
keyed by full inscription identity rather than deduplicating different
inscriptions by content hash. Closing/switching preview disconnects nodes; the
browser releases its selected waveform buffer reference. Metadata and edits are
stored locally, but audio caches are memory-only. Warm retained sources may
preview offline during that running page; uncached sources and reopening after
closing the page still need a gateway. A metadata search result is not an offline
audio file. Bundled onboard sounds remain local as before.

Raw audio, supported Audional Base64 JSON and one embedded audio data URI are
parsed through the existing safe extractor. Arbitrary HTML/JavaScript never
executes. Recursive/external HTML references, multiple embedded recordings and
video extraction fail explicitly in this catalogue route; their source records
remain available for review. Gateway byte hashes are not independent chain
proofs. Normal deployment only needs a static server; the reference package's
Python caching helper is optional and not part of the workstation runtime.

### Verification and demonstration

Run offline contracts/regressions with `npm test`. Run the generated-audio
browser integration with `npm run test:clips`. Run unmocked Bitcoin retrieval and
playback checks with `npm run test:clips:live`. Browser scripts accept
`PLAYWRIGHT_MODULE`, `CHROMIUM_EXECUTABLE` and `SEQUENCER_URL`; the runtime has no
Playwright dependency. The inherited regression browser check is
`npm run test:browser`. Reports distinguish fixture and live scope in
`reports/samples-loops-browser-fixtures.json` and `reports/samples-loops-live.json`.
Live checks are automated decode/audio-graph playback, not human listening or
seam approval; no curator flags are granted. The supplied lab's 29 mocked
fixture checks are not counted as workstation/live verification.

Demonstrate: open this v0.2 app → **Samples & Loops** → preview the first drum
source → set start 0.1 s/end 0.6 s → select a channel → **Load region into channel**
→ close the browser and Play the normal sequencer → Save → reopen using Load.
The full inscription ID, region, hashes and playback settings remain pinned.

### Delivery boundary

The entry point loads `js/main.js` and relative modules from this folder. It is
not pinned to an on-chain application engine. Historic songs keep their original
on-chain instruction/engine references, and onboard-bank L2 migration retains
its existing identity checks. Local v0.2 edits are available at
`http://127.0.0.1:8768/audionaut-v0.2/index.html` on the current server. They do not
update v0.1, a previously downloaded ZIP or an immutable published inscription.
Serving/deploying this folder or distributing a new ZIP delivers the update;
any later on-chain publication is a separate step. No wallet, payment, mint,
signing, contract change or new inscription was performed.


Release verification: **68 offline tests passed (zero failed/skipped)**, the
controlled stereo-fixture browser acceptance flow passed, and unmocked Chromium
retrieval/preview succeeded for three public Bitcoin sources. The first also
passed explicit loop playback and the complete preview → region → channel →
sequencer → save → close/reopen flow with hash verification. The existing
workstation browser regression passed word sampling, real L2/HTML/Base64 loading,
Arrange, transport, WAV export, favourites, synth/MIDI controls, mix recording and
mobile layout. Mobile testing uses Chromium viewport emulation; no physical
phone or Safari/Firefox result is claimed. All live runs were automated playback
checks, not human seam/listening/permission review. The full 195-source listening
pass remains a curation task. See [release verification](reports/samples-loops-validation.json).

### Source-control snapshot

Generated `media/` sound packs and downloadable ZIPs remain local under the
repository media policy. This source commit includes the renderer, catalogues,
metadata, tests and documentation, but does not bundle the generated audio.
The previously delivered ZIP contains the ready-to-run sound packs. For an
exact local restoration, copy that ZIP's `media/` directory into this app folder.
To render a new bank instead, serve this folder, set `AUDIONAUT_URL` to its
HTTP entry point, configure Playwright/Chromium and run `npm run sounds:build`.
Then run `npm run sounds:audit`; `npm run sounds:package` optionally produces
local publication payloads without publishing anything. A new renderer/browser
may produce different hashes: retain the matching generated manifest and
review saved productions before distributing a regenerated bank.
