# Older Audional songs in AudioNaut beta-pro

The bridge adds a staged import path to beta-pro. The original AudioNaut and beta
editions, their storage, and the membership gate are unchanged. Keep the original
song file: conversion writes a new version 3 project and never edits the input.

## Opening a song

Use **Load** and select the original JSON, AUDX or gzip file. The bridge selects
the playback interpretation, checks the song and prepares its samples, then opens
it automatically. There is no required editor/standalone choice or confirmation
when the song and its samples are ready.

Shared sparse and compact formats use the **Audional editor** interpretation by
default. Early boolean grids and the distinct OG instruction wrapper are detected
from their structure. An explicit playback override takes precedence where the
format supports it; a saved converted project retains its selected interpretation.

The supported interpretations are:

- **Audional editor:** saved steps 1–64 become grid positions 0–63; numbered
  sequence gaps remain rests. Trim duration is passed to the source in seconds.
- **Historical standalone player:** saved steps 0–63 play directly; saved 64s
  remain inactive. Stored sequence order is packed. The historical rounding,
  zero-gain fallback, slider-trim precedence and extra duration/rate division are
  preserved, including their differences from editor playback.
- Early boolean grids are positional and detected automatically. The distinct OG
  instruction wrapper retains its established trigger/mute-toggle interpretation.

The bridge does not infer playback intent from a filename. The same old JSON can
have different meaning in the editor and standalone player, and those shared bytes
cannot prove which player the author intended. The editor interpretation is a
documented default, not an inferred historical fact; import reports distinguish
that default from a format-selected or explicitly selected interpretation.
Inactive and repeated events remain in bounded import provenance rather than being
silently discarded.
Unsupported musical fields, conflicting directions in one cell, unresolved
dictionary tokens and ambiguous source alignment block conversion with a report.

Automatic loading resolves the candidate's samples before replacing the current
project. Identical sources load once. Cancel, an intervening edit or a
failed validation leaves the current project intact. Missing sounds offer retry,
cancel or an explicit **Open with missing samples** choice. The latter preserves
the source references and notes for relinking; unavailable channels remain silent.
When a loading problem pauses import, **Advanced playback settings** offers the
historical standalone override for shared formats. A matching pattern dictionary
can be supplied when an unknown serialized song requires one. Import reports can
be downloaded separately from that recovery dialog.

## Supported data and repairs

The reader handles named sparse JSON, dense boolean grids using `projectURLs`,
contextual compact keys 0–16, alphabetic/numeric channel aliases, inclusive ranges,
reverse suffixes/objects, companion pattern dictionaries and gzip bytes regardless
of the filename. Existing AudioNaut v2/v3, Sequencer X and L1xL2 project formats
continue through the native importer. Existing strict chain-song envelopes keep
their runtime and dependency verification requirements.

Bitcoin `/content/…` URLs and bare inscription IDs retain an `ordinal` identity.
Gain up to 3 and playback rate up to 100 are preserved for historical
profiles, including the editor's channel and trim controls. Reverse playback
reverses the decoded buffer and mirrors trim coordinates. Silent sequences and
the ending remain part of a one-pass song. Live playback, mix/stem rendering,
range chase and freeze use the same selected duration rules. Native projects
without a historical profile keep their existing sound.

Eight exact-byte repair entries cover ten paths in the supplied collection:

- Two serialized TRUTH versions use the independently verified historical
  166-pattern companion. The known lost pattern-zero event is restored only for
  the exact affected original, with its sibling evidence recorded.
- Three files receive only verified source/name arrays. Original events, gains,
  playback rates and target trim precision remain unchanged.
- Three gzip originals receive verified trailing empty source slots. Their
  existing source strings and all musical settings remain unchanged.

Repairs require the SHA-256 of the original file bytes and a fresh matching parse;
they never select by title. Companion and canonical result hashes are checked.
Only minimal repair data and hash/count evidence are bundled. The private full
song corpus and original recordings are not included in the repository.

## Architecture and limits

`daw/js/legacy-bridge/` separates bounded reading, contextual adapters, playback
profiles, normalized musical events, project conversion and verified repairs.
Preparation has no store or network side effects. Large JSON and gzip decoding
run in a cancellable local worker. The audio preparation stage holds its buffers
until all synchronous project-load listeners have finished resetting the engine.
The new project and its prepared audio are then installed in the same commit turn.

Legacy inputs are limited to 8 MiB compressed/input and 16 MiB expanded JSON,
64 channels, 64 patterns and 262,144 expanded events. Decoded sample staging has
a 256 MiB budget and three concurrent requests. Native portable documents have a
separate bounded reader limit of 256 MiB. Invalid nesting, unsafe keys, nonfinite
values and excessive structures fail before replacement.

The saved project carries `legacyPlayback` version 1 and bounded `legacyImport`
provenance. It does not duplicate the original document or audio in metadata.
Save/reopen and recovery retain the musical profile. Chain validation recognizes
only the strictly validated provenance as inert; every actual channel source
still requires its ordinary immutable dependency binding.

## Chain runtime

Runtime version `beta-pro-shared-audio-1` bundles automatic loading, the bridge,
decoder worker, verified repair data and existing audio engine into the standalone
HTML artifact.
No new external runtime or sample library is required. Its legacy reader can load
original Bitcoin sample references without a wallet or reinscription. Ordinary
web-hosted sample URLs require the editor and are not accepted as chain-contained
sounds by this standalone path.

This legacy reader is separate from `audionaut-chain-song/1`: it does not weaken
the pinned Stacks manifest format or claim Bitcoin gateway responses are Stacks
dependencies. Existing inscribed runtimes remain immutable. The newly built
runtime is prepared for inscription; this change itself does not inscribe it,
sign a wallet message, pay fees or broadcast a transaction.

## Verification

Public tests cover independent format expectations, malformed inputs, verified
repair boundaries, real worker cancellation, atomic import and the complete editor
flow. Independent audio references cover both historical profiles at 44.1, 48 and
96 kHz, reverse trims, range chase, long tails, freeze and overlapping voices.
The standalone test blocks website modules/CDNs and supplies simulated Bitcoin
content, including missing-source and incompatible-runtime failures.

The optional local corpus harness reads explicitly supplied inventory/evidence
paths. It checks 99 paths / 95 unique file hashes, automatic import of all 88 legacy
inputs (85 editor defaults and three detected boolean grids), 173 explicit legacy
profile cases and 11 native projects. Browser checks import, save, reopen and commit
all 184 explicit/native cases without fetching private songs or remote audio.
The earlier editions' 20 starter
songs, native synth patches, embedded audio and pinned clips retain their existing
compatibility coverage.

The public suite is `node public/audionaut-beta-pro/tools/pro-suite.mjs`. The local
corpus harness additionally requires `AUDIONAUT_LEGACY_INVENTORY`,
`AUDIONAUT_LEGACY_REPAIR_EVIDENCE`, `AUDIONAUT_LEGACY_FILTERED_EVIDENCE` and
`AUDIONAUT_LEGACY_HISTORICAL_REPO`; set
`AUDIONAUT_LEGACY_CORPUS_BROWSER=1` for browser persistence roundtrips.

Original sample gateways returned HTTP 403 during representative recording checks.
Audio references therefore use distinctive synthetic PCM and real song parameters,
not downloaded original recordings. Community listening against original players
remains necessary. WebKit retains the existing restriction on native offline
rendering; its live playback/import tests do not override that restriction.

The local Firefox test browser also stalled on native MP3 decoding in isolated
live/offline controls without app modules. Chrome and WebKit decoded the same
fixture. PCM WAV import uses the existing first-party decoder; other codecs use
the browser decoder with bounded loading time and cancellation. Firefox compressed
audio needs validation on community machines; a timeout retains the open project.

Direct loads, catalogue samples and historical imports share `fetchSourceAudio` and
`decodeAudioBytes`. Unsupported portable PCM layouts fall back to the native decoder;
malformed/truncated PCM does not. Abort releases pending native decoding work.
