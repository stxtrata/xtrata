# Radio: where a song can live

The radio used to accept two shapes of song: a plain audio inscription (`audio/*`), and an HTML player with its audio embedded as `data:audio`. Three more are songs now. The rules live in one place, `src/lib/radio/song-sources.mjs`, used by the radio (to play them) and the server (to list them), so the station, the catalogue and the album maker agree.

| Shape | Example | How it plays |
|---|---|---|
| Hidden track: an audio file appended to another file, then `XTRATA-HIDDEN-TRACK-v1` and the hidden file's length (8 bytes, big-endian) | #139, "Subterranean (Extended Mix with Phil Hartnoll)" | The radio reads the last 30 bytes, fetches the hidden byte range and plays it as an audio Blob |
| All-audio WebM minted as `video/webm` | #8 | Played as an audio Blob (every track is audio) |
| HTML player linking its audio: `<source src="https://xtrata.xyz/inscription/8">` | #319, "Russian Rampage" | The linked inscription is resolved (one level) and played with the player's own title and cover |

A video with picture and sound (a film) is still not a song.

## Server
- `functions/lib/radio-metadata.ts` reads each HTML or video inscription once and stores `radio_metadata.is_song`: `0` not a song, `1` a song, `2` a hidden track. Video files are read by range only (last 30 bytes, then the first 16 KB). "Not a song" answers from before `SONG_RULES_SINCE` are checked once more. The server's own reading decides: community dud reports no longer stop it.
- `/index/playable` adds `video` (verified video songs) and never lists a verified song as a dud. Hidden tracks (`2`) stay out of the station and the public catalogue.
- The album maker (`createPlayer`) accepts plain audio inscriptions and verified songs, and reads any song the catalogue has not reached yet on the spot (`checkSongsNow`, up to 6). Titles and artists take the supplied credits (`artist-credits.mjs`).

## Hidden tracks in albums
A hidden track in an album is not one of its listed songs (not counted, not searchable). It plays only after a silence (`HIDDEN_TRACK_SILENCE_MS`, 60 s) at the end of the last song, and only when the album ran from its first song to its last with nothing skipped or picked by hand. Pausing and seeking are fine; shuffle is not a run. Pressing play or any tune during the silence ends the wait and the album goes round again. An album must have at least one song that is not hidden.

## Clients
The radio's local dud memory moved to `xtrata.radio.duds.v3`, so verdicts made under the old rules are forgotten. #319 left the hard-coded ignore list.
