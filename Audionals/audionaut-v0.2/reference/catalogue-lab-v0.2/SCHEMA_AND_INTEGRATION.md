# Source / clip integration proposal: v0.2

This is a proposed contract for Audionaut integration. No live workstation code was supplied or modified, and compatibility with its importer has not been verified.

## Stable source identity, independent clip identity

A catalogue `assets[]` record represents one source inscription. Preserve the full inscription ID even when two inscriptions contain identical payloads. Its `technical`, `original_note`, source provenance and `rights` describe the source. Its `clips[]` contains independently reviewable musical regions.

Each clip has a `clip_id` and a `review` object. The source’s `active_clip_id` selects the editor’s current clip. `assets[].review` is an active-clip mirror retained for v0.1 compatibility; consumers should treat `clips[]` as authoritative and not flatten multiple clips into that mirror. The interface rehydrates that mirror on load/import.

`curation_proposal` is a note-derived source-level suggestion, not an observed fact or approved region. The seed’s 22 classifications are drafts. Original text, original BPM notes, third-party durations, decoded measurements and reviewer decisions are deliberately separate.

## Manifest shape

`first_22_draft_manifest.json` illustrates the export shape:

```json
{
  "schema": "audionaut-clip-library-proposal",
  "version": "0.2.0",
  "status": "draft",
  "sources": [],
  "clips": []
}
```

A source includes its identity, content path, source/payload SHA-256, measured decoded format when available, reported duration and original note. A clip references `source_id` and has independent name, use, instrument category, region, loop parameters, tuning, review state and a copy of source-level rights. Store source bytes once; do not reinscribe them simply to define a new region.

## Timing and decoding

Regions use start and end seconds, plus frame positions when measured. The end frame is exclusive. Null end/rate/frame fields mean **not measured or selected**, not zero. Reported file duration is not silently used as a sample-accurate region end.

Frame indices reference the recorded decoded frame rate. A consumer decoding at another rate must map by seconds or explicitly reproduce/resample to the recorded frame basis. It should check source/payload hashes and bounds before playback. Browser decoding can differ in resampling and codec treatment; this prototype does not guarantee bit-exact PCM across platforms.

Loop timing uses quarter-note beats. `bpm = 60 * beats / loop_seconds` is a consistency test, not beat detection. The current export gate permits at most 2% relative disagreement. Beat count, tempo interpretation and a click-free seam still need a listening decision; a mathematically consistent region is not necessarily a musical loop.

The nine two-beat hypotheses are arithmetic comparisons against Jim’s notes. They must not be interpreted as observed beat counts, detected silence or recommended automatic trimming.

## Verification and approval

`review.auditioned`, `bpm_verified`, `loop_verified` and `key_verified` are separate curator decisions. Automated decoding never sets them. Changes to timing clear tempo/seam approvals; changes to tuning clear tuning approval. A changed decoded frame basis invalidates timing approval.

The cleared export additionally checks reviewer identity, valid source ID, decoded and hashed audio, region bounds, supported use type, documented permission terms and evidence. It exports only passing approved clips, with an omission report for other approved clips. It does not independently verify licences, rights holders or the truth of curator assertions.

Hashes fingerprint a gateway response and extracted payload, not an independently reconstructed Bitcoin transaction or inclusion proof. A self-hosted trusted indexer or chain-verification component would be a separate integration.

## Revision pinning for saved productions

Recommended future workstation behaviour: save an immutable copy/hash of the chosen clip manifest alongside the source ID, payload hash and precise playback region. Later catalogue edits should not silently alter an existing song. The present app exports dated JSON snapshots; it does not implement a signed or on-chain revision registry.

## Current boundaries

No automatic semantic classification, BPM or key detector is included. No comprehensive audio/video/HTML inscription scan was performed. Single embedded audio data URIs can be parsed without executing code; complex recursive formats and video-audio extraction are not a verified ingestion pipeline here. Project loading/saving in the production Audionaut workstation remains an adapter task.
