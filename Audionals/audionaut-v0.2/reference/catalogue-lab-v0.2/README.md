# Audionaut Catalogue Lab v0.2

A first-batch sample and loop curation desk for Jim’s Bitcoin inscription catalogue.

## Status of this delivery

- 195 source records preserved, including the original descriptions and provenance.
- 79 sources have previously reported durations strictly under 20 seconds.
- 22 musical candidates have draft classifications based on Jim’s notes.
- Nine drum candidates retain BPM notes and explicitly unverified two-beat timing hypotheses.
- **Zero real inscription recordings were newly auditioned or measured in this build.**

Direct external audio retrieval failed in the build environment. Reported durations, note-derived instrument suggestions, arithmetic hypotheses and later decoded measurements are kept separate. The actual listening pass is still pending. The full public ord.audio dataset is not pre-imported and this is not a complete Bitcoin census.

## Start the desk

Extract the ZIP into a folder. With Python 3.9 or later installed, open a terminal in that folder and run:

```sh
python3 serve.py
```

The launcher opens the desk at `http://127.0.0.1:8765/`. Stop the server with Control+C. On macOS, `Start_Catalogue.command` runs the same command; terminal launch is available when macOS blocks an unsigned command file. For a port conflict, use `python3 serve.py 8766`.

The server uses the Python standard library only. No npm install, wallet, credentials, subscription or blockchain transaction is required by this package. Python must already be available to use the launcher.

`Audionaut_Catalogue_Lab.html` also contains all interface code and catalogue data in a single file and can be opened directly. Direct browser mode depends on the chosen gateway’s network/CORS behaviour. The optional launcher supplies same-origin content access and a persistent local cache; live upstream access was not verified from the build environment.

## First listening pass

The desk initially displays **First 22 musical candidates**. Select **Measure first 22** to request and decode that batch, or load one source at a time. This performs technical measurement, not listening or instrument recognition.

For each source:

1. Read the preserved original note and proposed classification. Play the complete source, then adopt or change the proposed use and instrument category. Only confirm **I listened** after actually listening.
2. Select a usable region. For a loop, repeat it and inspect the seam, manually count quarter-note beats and check the tempo. The two-beat test control is a hypothesis based on the original BPM note; it does not detect beats or trim the waveform.
3. Make separate clips for different useful regions. Each clip has its own title, category, tags, region, loop, tuning and review fields. Source identity and permission evidence remain shared.
4. Record your name and review decision. Confirm tempo, loop seam and any tuning label independently. Save a catalogue JSON backup regularly.

The source list can also display all 195 records, the 79-item under-20 queue, boundary cases and unknown durations. A longer inscription can contain a shorter useful clip. **New clip** duplicates the selected region as an independently editable record; **Delete clip** deletes only its metadata and never the inscription or source audio.

## Exports and preserving work

- **Save catalogue JSON** backs up the full working database, all clips and annotations. Browser storage alone is not a portable backup.
- **Export draft clips** exports all clips for the visible sources, including unreviewed metadata and unknown permission status.
- The **cleared-library export** is a stricter curator gate: it requires decoding and hashes, an audition confirmation, a reviewer, valid boundaries and recorded permission terms/evidence. Loops additionally require seam/tempo verification and a beat count consistent with their duration. Pitch labels need their own verification.
- When no approved clip passes the checks, the tool writes a readiness report rather than labelling anything ready.

“Cleared” here means the curator completed the recorded checks. The software does not independently certify permission evidence. Unknown-rights items remain discoverable and are included in draft exports.

Import a saved v0.1 or v0.2 catalogue JSON to continue your own annotations. The browser upgrade retains a backup of the old v0.1 storage key and migrates the old single region to a clip. A new local origin or browser cannot read a different origin’s storage; import an exported JSON file in that case. Existing reviews are preserved on import rather than replaced with note-derived suggestions.

The draft manifest is a **proposed Audionaut adapter format**, not a tested importer for the live workstation. See `SCHEMA_AND_INTEGRATION.md` before connecting it.

## Audio access and cache

No source audio files are bundled. The loopback server fetches a requested full inscription ID from a fixed ordinals.com content route and stores the response under `.audio-cache/`. It also exposes one fixed public-catalogue JSON route for the existing full-list import button. It is not an arbitrary URL proxy.

Previously cached sources can be served without an upstream request while the local server is running. Uncached sources still require network access. Custom gateways use direct browser mode and are not cached by this server. Cache retrieval preserves source bytes; it does not re-encode or reinscribe them. Deleting `.audio-cache` discards local copies only.

The server binds to loopback, rejects non-local Host headers and cross-origin API requests, bounds upstream response sizes and does not expose upload or transaction routes. The catalogue does not execute arbitrary inscription HTML/JavaScript to find audio. Single embedded audio data URIs may be decoded; complex recursive engines require a separate parser.

## What technical measurement means

After successful decoding, the desk records decoded duration, frame count, sample rate and channels, response/payload hashes, peak and RMS levels, DC offset and near-full-scale sample fraction. Low-level activity boundaries are suggestions, not automatic trims. Exact payload hashes can highlight byte-identical sources without merging their inscription identities.

Web Audio can resample to the audio context rate. The recorded rate and frame positions therefore describe this decoded buffer, not necessarily the original encoded file. No source bitrate, original sample rate, instrument, key, musical quality or tempo is inferred from these statistics. A gateway-response hash is not an independent Bitcoin inclusion proof.

## Included files

| File | Purpose |
|---|---|
| `Audionaut_Catalogue_Lab.html` | Standalone interface and seeded database |
| `catalogue.json` | Full 195-source database with clip support |
| `first_22_draft_catalogue.json` | The first batch in editable catalogue format |
| `first_22_draft_manifest.json` | Split source/clip integration proposal |
| `first_22_review_queue.csv` | Compact batch queue, original BPM notes and timing hypotheses |
| `under_20_seconds_audition_queue.csv` | The unchanged 79-item discovery queue from v0.1 |
| `BATCH_01_REVIEW.md` | Batch summary and drum timing comparisons |
| `original_catalogue.md` | Exact copy of Jim’s original catalogue |
| `serve.py`, `Start_Catalogue.command` | Optional local launcher and content cache |
| `app.js` | Editable copy of the JavaScript already embedded in the HTML |
| `SCHEMA_AND_INTEGRATION.md` | Proposed source/clip contract and integration boundaries |
| `BUILD_REPORT.json`, `QA_REPORT.json` | Coverage and scoped test results |
| `tests/test_catalogue.py` | Development tests using generated audio; requires Playwright/Chromium |
| `preview_desktop.png`, `preview_mobile.png` | Fresh-seed interface previews, not measured inscription waveforms |
| `SHA256SUMS.txt` | Checksums of package files |

## Testing and limitations

The recorded QA run passed 29 checks using generated two-second audio. It covered real Chromium audio decoding, independent clips, edits/exports, approval invalidation, source hashing and controlled server/cache behaviour. Browser network and storage were mocked because navigation was blocked by the environment; Python loopback HTTP/cache behaviour was tested separately with a generated upstream fixture. This is not evidence that the external gateway, browser-to-server integration or live workstation importer was tested end to end.

For development reruns, install Playwright and a compatible Chromium separately, then run `python3 tests/test_catalogue.py`. Set `CHROMIUM_EXECUTABLE` to a browser path where needed. The runtime application does not depend on Playwright. The QA fixture has no relationship to any actual inscription and no fixture measurement is included in the delivered catalogue.
