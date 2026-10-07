# Audionaut sample packs converted to FLAC (7 Oct 2026)

Source: the two listening-page artifacts (Audionaut Sample Packs, Audionaut Attribution Packs). All 2,438 embedded WAVs matched their approved SHA-256 before conversion.

## Result
| Tier | Packs | Sounds | WAV MB | FLAC pack MB | % of WAV | 16 KB chunks | Approx. STX (data only) |
|---|---|---|---|---|---|---|---|
| core (CC0) | 16 | 1705 | 178.24 | 72.72 | 40.8% | 4445 | 71 |
| attribution (CC-BY) | 5 | 333 | 53.82 | 19.31 | 35.9% | 1180 | 19 |
| unverified (Classic Machines) | 1 | 400 | 13.41 | 6.91 | 51.5% | 422 | 7 |
| **all** | 22 | 2438 | 245.47 | 98.94 | 40.3% | 6047 | 97 |

STX uses the plan's own rate (0.978 STX per MB) plus about 0.1 STX begin fee per inscription; it is not a dry run.

## Per pack
| Pack | Tier | Sounds | WAV MB | Pack MB | % | Chunks |
|---|---|---|---|---|---|---|
| analogkit | core | 213 | 17.54 | 7.91 | 45.1% | 484 |
| bass | core | 113 | 10.92 | 3.35 | 30.7% | 205 |
| plucks | core | 130 | 12.10 | 4.48 | 37.0% | 274 |
| strings | core | 110 | 13.13 | 6.51 | 49.6% | 398 |
| electronic | core | 82 | 5.89 | 2.01 | 34.1% | 123 |
| piano | core | 71 | 10.98 | 3.04 | 27.7% | 186 |
| keyboards | core | 78 | 11.23 | 4.89 | 43.5% | 299 |
| mallets | core | 84 | 13.20 | 4.05 | 30.6% | 247 |
| zithers | core | 68 | 10.74 | 4.04 | 37.6% | 247 |
| guitars | core | 43 | 6.83 | 1.82 | 26.6% | 111 |
| world | core | 85 | 10.82 | 4.37 | 40.4% | 267 |
| worldperc | core | 208 | 13.77 | 5.86 | 42.6% | 358 |
| winds | core | 95 | 10.98 | 6.36 | 57.9% | 389 |
| saxophones | core | 48 | 4.76 | 2.72 | 57.1% | 166 |
| orchestral | core | 110 | 9.88 | 4.68 | 47.4% | 286 |
| brass | core | 167 | 15.45 | 6.64 | 42.9% | 405 |
| classic | unverified | 400 | 13.41 | 6.91 | 51.5% | 422 |
| pianoby | attribution | 54 | 10.66 | 2.67 | 25.1% | 163 |
| epiano | attribution | 56 | 8.59 | 1.84 | 21.5% | 113 |
| voices | attribution | 48 | 11.01 | 5.76 | 52.3% | 352 |
| rockkit | attribution | 115 | 12.56 | 4.96 | 39.5% | 303 |
| byextras | attribution | 60 | 11.01 | 4.07 | 37.0% | 249 |

## What each file is
- `packs/<id>.audpack`: provisional `audpack/1` container. 12-byte header (`AUDP`, u8 version=1, u8 flags (bit0 = index is gzip), u16 reserved, u32le index length), then the index (gzip JSON: pack licence block with full legal text, credits, and per sound id, filename, codec, offset, length, sha256, pcmSha256, samples, wavSha256, wavBytes and the original metadata), then the concatenated FLAC streams. Offsets are relative to the start of the payload. The plan leaves the magic bytes unspecified, so `AUDP` is my choice and easy to change.
- Each FLAC stream: STREAMINFO (with the MD5 of the audio filled in) + a VORBIS_COMMENT carrying the same licence, credit, source and folder text the WAV had in its INFO chunk + audio frames. No padding block. Block size is the encoder default, so the files are streamable-subset FLAC.
- `packs/<id>.manifest.json`: container sha256, size, chunk count. `packs/<id>.pcmhashes.json`: sha256 of each sound's original PCM, for checking.
- `codecs/`: `codec-flac.mjs` (4,211 bytes) and `codec-opus.mjs` (94,174 bytes), each with an extension manifest (sha256, size, chunks, licence notices), plus sources.
- `tools/`: `audpack-reader.mjs` (557 bytes minified), `verify_packs.mjs`, and the Python build scripts.

## Verification (all passed)
1. Source: 2,438 of 2,438 embedded WAVs match their approved SHA-256.
2. Build: every FLAC decoded by ffmpeg equals the original PCM exactly.
3. End to end: `node tools/verify_packs.mjs packs codecs/codec-flac.mjs` reads each container, checks the sha256 of each stored FLAC, decodes with the inscribable JS decoder (CRC-8 and CRC-16 on), and compares the PCM hash with the original: 2,438 of 2,438, about 410x realtime.
4. Third decoder: libFLAC (via libsndfile) decodes all 2,438 files and every STREAMINFO MD5 matches; ffprobe reads the licence tags.
5. Opus module: 96 of 96 test sounds decode from `opus-pkt/1` payloads, within -85 dBFS of ffmpeg's decoder.
6. Tags: all 2,438 files compared field by field with the source WAV INFO chunk (INAM to TITLE, IART to ARTIST, ICOP to COPYRIGHT, ICMT to COMMENT, IGNR to GENRE, ISFT to ENCODED-BY): 0 mismatches, 0 fields missing in a source, and every file has exactly STREAMINFO plus VORBIS_COMMENT (no padding block).
7. Determinism: 89 randomly chosen sounds (about 4 percent) were re-encoded from the original PCM from scratch: 89 of 89 byte-identical to the stored files.

## Encoder pin
ffmpeg 6.1.1-3ubuntu5, `-compression_level 12 -exact_rice_parameters 1 -flags +bitexact -fflags +bitexact`, default block size. `tools/build_all.py` encodes raw PCM and `tools/flactools.py` rewrites the header (STREAMINFO with the audio MD5, VORBIS_COMMENT with the licence tags, no padding). Other ffmpeg versions are untested and may emit different bytes for the same audio; verify by decoding and comparing `pcmSha256`, not by re-encoding.

## Open decisions (see the plan, section 15)
- Freeze the container layout (`AUDP`, 12-byte header).
- Decoder licence and author, proposed: MIT for `codec-flac` with the line `Copyright (c) 2026 jim.btc`; `codec-opus` stays `MIT AND BSD-3-Clause`; manifest author is the inscribing Stacks address with BNS name `jim.btc`. The manifests still have `author` (and, for FLAC, `license`) set to null.
- Approve the new hashes.

## Things to know
- **Analog Kit (renamed 8 Oct 2026).** The pack formerly called the Real Kit is now the Analog Kit: pack id `analogkit` (was `realkit`), file `analogkit.audpack`, sound ids and keys `analogkit-...` / `onboard:v2:analogkit-...`, category and tag `analogkit`, labels and filenames "Analog Kit — ...". Audio, `pcmSha256` and every sound's stored-byte `sha256` are unchanged (the FLAC tags never contained the old name); only the container index changed, so the pack's container sha256 is new. `packs/analogkit.renamed-from-realkit.json` maps every old sound id and key to the new one so saved songs can be migrated. The old WAV files in the listening pages still carry "Real Kit" in their own INFO text; they are the approved originals and were left untouched.
- Overall 40.3% of WAV, not the 35% projected from the 96-sound test: the real packs have more sustained instruments (strings 50%, winds 58%, saxophones 57%) and per-sound headers add about 2%.
- Classic Machines (51.5%) did not compress better than the rest: it is many short sounds, so the header share is larger, and normalisation to PCM16 removes low-bit-depth structure.
- The legacy WAV SHA-256 is kept as `wavSha256`. The new identity of a sound is `pcmSha256` (stable, because FLAC decoding is exact); the transport check is `sha256` of the stored bytes. The old WAV bytes are not reproduced byte-for-byte.
- Pack parts: with FLAC every pack is far below the 32 MB limit, so each family is one inscription (the Analog Kit is one pack, not three).
- Opus decoder licence: upstream ships no LICENSE file; MIT comes from package.json and README. libopus BSD-3 text is verbatim from xiph/opus.
- Not done: nothing is inscribed or broadcast; no browser test (Node only), including whether the xtrata.xyz page allows WebAssembly; nothing auditioned (lossless, so the sound is unchanged).
