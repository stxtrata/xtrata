# On-chain likes and paid plays: one source

Every number the app shows for on-chain likes or paid plays comes from
`functions/lib/onchain-counts.ts` (per song) or the paid-play index behind it (lists and
totals). Nothing else reads these from the chain for display, and browsers never page the
contract logs from Hiro themselves.

| Number | Source | Read by |
| --- | --- | --- |
| ♥ likes per song | likes contract `get-state` totals (`radio-chain-likes.ts`, 25 songs a read) | `/radio/counts` (catalogue, radio, homepage, lounge), `/radio/song-stats` |
| ▶ paid plays per song | paid-play index: `music_paid_plays`, a copy of `xtrata-radio-plays-v1-0`'s event log | `/radio/counts`, `/radio/song-stats` |
| paid-play totals, supporters, latest | same index | `/api/music-stats` (homepage tally) |
| paid-play history | same index, newest first, with each song's running total | `/api/music-plays` (Music Heroes, lounge history) |

## Why the index, and why it is accurate

The paid-plays contract keeps a per-song counter (`get-total`) but has no batch read, so a
catalogue of ~80 songs would cost ~80 chain reads per page view. The index copies every
`radio-paid-play` event once (oldest first, by log position, no gaps) and counts from there. Each
event is exactly one increment of the contract's counter, so once the index has caught up its
per-song count equals `get-total` (checked live on 2026-10-13: index 5,033 plays = contract log
5,033 events).

Every reader calls `freshenPaidPlayIndex` first: at most one chain check every 20 s, new events
copied as they confirm. `/radio/song-stats` waits for it, so the radio's ▶ counter is current;
list endpoints refresh in the background.

## Never a false number

- A count that could not be read is `null` (shown as "—" or hidden), never 0.
- While the index is still catching up, `paid_plays_status` is `syncing` and
  `/api/music-plays` reports `total: null`, so pages say "loading", not "complete".
- 0 paid plays means the index is complete and has none for that song.
