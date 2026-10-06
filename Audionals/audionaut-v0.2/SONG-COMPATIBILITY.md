# On-chain Audional songs and session compatibility

Inspected on 2 October 2026 using public inscription content and its referenced scripts. These entries were incorrectly treated as audio samples. The library now distinguishes fixed song instructions, historic applications and the Infinite Remix. The Opus test remains a normal audio sample.

## Confirmed song/player lineage

| Library entry                                           | Actual instructions                                                                                                   | Original engine                                                                                                            | Editable export                    |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| First Audional Song: I Love Cheese                      | [AUDX song JSON](https://ordinals.com/content/4521e117df5bf3f9495f22e2b453d1d379b2432ac7ec56403d46b35474e490eai0)     | [OG sampler, August 2023](https://ordinals.com/content/62457dbf41153a12f96abc351cd2f16e62e897b43aa9d2893e9a837966ff0357i0) | 8 channels, 105 BPM, 17 sequences  |
| First New Engine Song + visualiser: TRUTH               | [Gzip song settings](https://ordinals.com/content/5527d0cc95ce5ce6eedf4e275234da8b1fe087512d0db618b6de1aaad437c96bi0) | [Module loader](https://ordinals.com/content/d43e19008669597a77865b71018d78c64f83ca36eb961c885ca2a7403f7bf32ci0)           | 16 channels, 120 BPM, 44 sequences |
| New Engine Song / ON DAY ONE wrapper: How We Be - Based | [Gzip song settings](https://ordinals.com/content/633100d631767ddb9a309f5a2a66f5a66d5abd839f3b1c55642690d484189971i0) | Same newer engine                                                                                                          | 16 channels, 100 BPM, 14 sequences |

The OG wrapper points `window.playerPath` to the AUDX JSON. Its text/image loader creates an iframe containing the OG sampler above; its controls send `load`, `play`, `pause`, and `stop` messages. This is the correct sampler lineage for the first song, rather than the earlier original-sequencer landmark.

The newer visualiser wrapper points to [its song-loader module](https://ordinals.com/content/2645c7edb4140c53e80624ff9294150fb041526fef3ea37a2a5906b7288735bfi0), which selects TRUTH. The [on-chain deserializer](https://ordinals.com/content/1db9ef42162943bb969ee9d331f02ea77cd3be8a1fb5e607b4e9cda2d7274403i0) expands numeric keys, lettered channels, `{r:[start,end]}` ranges and `52r` reverse markers. Its [JSON preparation module](https://ordinals.com/content/1b036f9d60a04f0612af8c53753273f66339e69d7843138007eb3573703b1218i0) and [scheduler](https://ordinals.com/content/a3d8a40fcde6935f16b49ad7c9e9aa185f01d1618f4e35828415f6cc27377a47i0) establish the actual step convention.

## Audition and import workflow

Open a channel loader and select **Songs & historic applications**. For the three fixed songs, **Audition** reads the original instruction inscription, decodes each referenced ordinal sample and plays the arrangement through a separate compatibility scheduler. **Stop**, switching selection, closing the loader or loading another project cancels loading and stops those voices. Audition does not change channel assignments or the current project.

**Export song session** downloads an `audional-sequencer-l1xl2/1` project. Save your current session if needed, then use the main **Load** button to open the downloaded project. This fetches each ordinal sample into its channel and restores the tempo, volume, playback speed, trim, normal/reversed steps, sequences and source provenance. You can edit it in Arrange or Steps, add L2 samples, instruments or effects, and save normally. Exporting requires only the instruction file; auditioning or loading the session requires the audio inscriptions too.

An export creates a separate project rather than merging over occupied channels. For merging into an existing session, the recommended next feature is a destination-channel/sequence chooser plus a conflict preview. Songs have one global tempo, so a merge also needs an explicit tempo choice. This version does not implement that merge.

## Sequencing details that matter

- OG AUDX `triggers` are **one-based**, but `toggleMuteSteps` is compared to the **zero-based running totalStepCount**, before triggering. The adapter expands initial mute states and later toggles into an editable sequence arrangement. The I Love Cheese wrapper stops after 1,030 steps; its export uses 17 sequences, with inactive padding in the last sequence. Imported sessions loop as editable patterns, including that padding; the audition stops at the original wrapper boundary and lets final voices finish.
- The newer on-chain player compares saved steps directly to `currentStep` **0–63**. A saved `1` therefore becomes the second UI step. The files also contain `64` entries, which that original scheduler never plays; those inactive entries are omitted, not shifted into a new sequence. Reverse markers remain per-step reverse overrides.
- Numeric trim keys `9` and `10` are percentage slider positions. `12`/`13` are alternative saved trim fields. Reading only `start`/`end` would miss many of these songs' trims.
- TRUTH includes a **5.96×** channel speed. Imported song channels and their editors support up to 100×, matching the original engine's accepted range; ordinary projects retain X's 4× range.
- Empty sequences remain timed rests for imported songs. X's previous skip/wrap-on-empty behaviour would otherwise shorten an arrangement.

This is format-compatible playback, not a byte-for-byte execution of the historical engines. The adapter uses precise source-second duration, exact stored trims, correct zero-volume handling and X's master output. The old newer-engine code rounds trim fractions to three decimals and divides source duration by pitch before Web Audio applies playback rate again; the adapter does not reproduce those bugs. Original visualisers, cover animation and broadcast messages are not included in fixed-song native playback. `globalPlaybackSpeed` is retained only in the raw test fixture because the inspected newer scheduler does not use it; channel speeds control playback.

## Infinite Remix and historical applications

The [Infinite Ordinal Remix](https://ordinals.com/content/a5e9d3fe0cb8e3378e478b2c2ae1f222d01536f069ce4d42ac2c9b7989b74a75i0) loads multiple songs and generates seed-dependent effects, gain chains and metadata through its own modules. It cannot be faithfully represented by merely copying a fixed step list. **Audition** opens the original remote player in an isolated iframe; press its Play control once loading finishes. Stop or closing the loader removes the iframe. A future editable import needs to freeze a selected seed and translate its generated effect/settings state, or record the output as audio.

The first Audinal sample-library HTML, Basic Sequencer, jiMS10 synth and original sequencer entries are applications. Their original interfaces open the same way; they are not sent to the audio decoder. Their existing buttons remain interactive inside the isolated frame. Third-party availability and browser embedding policy can affect these original players.

## Validation and limits

`npm test` includes recovered on-chain fixtures for all three songs, full OG mute-timeline checks, compressed/reversed step decoding, high playback speed persistence, bounded gzip expansion, cancellation and preservation of empty sequences. Fixtures are the instruction JSON only, not downloaded audio.

`npm run test:songs` is the optional Playwright browser check. It auditions all three songs against live ordinal audio, checks that the existing session is unchanged, verifies their exported channel/sequence counts, reopens the static-artwork song as a session, starts its transport, and verifies song/application UI routing. It uses the same `PLAYWRIGHT_MODULE`, `CHROMIUM_EXECUTABLE`, `SEQUENCER_URL` and `OUTPUT_DIR` environment variables as the existing browser tests. It checks sample starts rather than comparing a complete rendered song against a historical recording. Original remote application/remix playback has not been audio-compared.

Instruction files and decompressed JSON are limited to 4 MB; audition buffers including reversed copies are limited to 256 MB; the existing 50 MB encoded-source limit still applies. Loading an exported full song into channels can use more decoded memory. Network/CORS/source failures are reported without changing the auditioned session.
