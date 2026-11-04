# How art/dog/ was fetched (re-runnable)

Everything Bitcoin-side was read in Jim's built-in browser (Claude desktop) with page-context `fetch()`; the cloud container can only reach xtrata.xyz.
Pattern: open a tab on a neutral origin (for example `https://doggotothemoon.io/` or a JSON page on `mempool.space`), then `fetch()` the CORS-open APIs below. `ordinals.com`, `mempool.space`, `assets.hiro.so` and `ordiscan.com` pages answer; `api.hiro.so/runes/v1` no longer exists ("Missing Authentication Token"); magiceden.io sits behind a Cloudflare challenge (not bypassed).
Rate limits seen: mempool.space stops answering after a few thousand requests; blockstream.info answers 429 above 700 requests an hour per IP. Keep job sizes small and save results as you go. Keep the browser pane visible during long jobs (hidden panes throttle timers).
Getting files to the container: the page makes an `<a download>` Blob; Claude desktop writes it as a hidden `.…claudefordesktop.XXXX` file in ~/Downloads (the exact name changes; match by size or content). Copy it into `~/Downloads/_dog-art-staging/`, then `device_stage_files`. Large binary results were wrapped as one JSON with base64 members.

| Item | Endpoint | Notes |
| --- | --- | --- |
| Rune #3 | `https://ordinals.com/rune/DOG•GO•TO•THE•MOON` with `Accept: application/json` (only worked on the first load; the HTML page has the same fields) | id 840000:3, premine 1e16 base units / divisibility 5 = 100B DOG, burned 2440680717188 base units, etching tx, timestamp |
| Rune cross-check | `https://ordiscan.com/rune/DOGGOTOTHEMOON` | page text; `__NEXT_DATA__` trpcState has `rune.getRuneInfo` (spacers, inscription, delegate) |
| Holders, top 20, burned | `https://unisat.io/runes/detail/DOG•GO•TO•THE•MOON` | read `document.body.innerText` after ~6 s; holder count line `holders` |
| Halving block | `https://mempool.space/api/block-height/840000`, then `/api/block/<hash>` | hash 0000000000000000000320283a03…cda83a5, time 1713571767 |
| Candidate snapshot blocks | same endpoints for 840249 and 840269 | both exist; they are only candidates |
| Etching tx | `https://mempool.space/api/tx/e79134080a83fe3e0e06ed6990c5a9b63b362313341745707a2bff7d788a1375` (+ `/outspends`) | fee 290,773,010 sats; output 1 (the premine) spent in block 840,647 |
| Airdrop tree | start at tx `1107d8477c60…3224` (block 840,647); breadth-first: `/api/tx/<txid>` and `/api/tx/<txid>/outspends`; follow outputs paying `bc1pry0ne0yf5pkgqsszmytmqkpzs4aflhr8tfptz9sydqrhxexgujcqqler2t`; every other non-OP_RETURN output (546 sats) is a recipient | 176 txs, depth 74, 75,488 distinct recipient addresses, blocks 840,647 to 840,658 and 850,677 |
| Transfers | pick recipient outputs, take the tx that spends them (`outspends`), open `https://ordiscan.com/tx/<txid>` in a hidden same-origin iframe, read the text after `Inputs & Outputs` (amount line then `DOG•GO•TO•THE•MOON`), keep txs where DOG in = DOG out and a new address receives; block time from `/api/block/<hash>` | 29 kept, Apr 2024 to Oct 2026; compact amounts such as `1.8M` were not used |
| Runestone ids | `https://ordinals.com/r/children/fdb2df5d2b16db1ebcbf09e2d23b3f4e417db44b58e712c99b61f26b52c7cbb5i0/<page>` for pages 0..1130 (100 per page) | 112,384 ids across 82 reveal txs |
| Runestone details | `https://ordinals.com/r/inscription/<id>` | number, height, owner address, delegate |
| Runestone art | `https://ordinals.com/content/ed76bf35…a0i0` (glTF, 3,967,899 bytes) rendered with `<model-viewer>` 3.1.1 (`https://ajax.googleapis.com/ajax/libs/model-viewer/3.1.1/model-viewer.min.js`), `mv.toBlob({mimeType:'image/png'})`, downscaled to 256 px | all children delegate to this one model |
| DOG logos | `https://doggotothemoon.io/wp-content/uploads/2024/11/DOG-logo-black.png` and `DOG-logo-white.png`, fetched from the doggotothemoon.io origin | saved byte-identical; sha256 in data.json |
| Rune icon | `https://ordinals.com/content/618ffb4e23e19566c7567841187a1c424dfd775e4f8cb633a7a3d4836784835fi0` | etching inscription's delegate |
| Stacks tokens | `node tools/fetch-dog-stacks.mjs` (xtrata.xyz proxy) | writes art/dog/stacks.json; contracts are only the ALEX and Pontis ones |
| Stacks token images | `https://assets.hiro.so/api/mainnet/token-metadata-api/<contract>/1.png` | fetched from the browser; downscaled to 192 px |

## Snapshot block (narrowed, not confirmed to one block)
The snapshot height is not an on-chain event, so it was tested indirectly:
1. List spends of the 82 reveal txs' outputs in blocks 840,250 to 840,269 (`/api/tx/<reveal>/outspends` on mempool.space; 102 found, 48 of 82 reveal txs reached before rate limits).
2. Open `https://ordiscan.com/tx/<txid>` for 31 of them in a hidden same-origin iframe and read the full sender (the 546-sat input) and buyer (the second 546-sat output) addresses.
3. For 11 of them, read `/api/tx/<txid>` on mempool.space and the status of the prevout tx, to show the seller got the Runestone in a reveal at block ~834,7xx to 835,8xx and held it unmoved.
4. Match both addresses against the 75,488 airdrop recipient addresses (the airdrop tree above).
Result: 29 of 31 sellers were not paid, 30 of 31 buyers were. A seller holding at 840,249 would have been paid under a 840,249 snapshot, so 840,249 is contradicted. Sellers up to block 840,268 were not paid, so the snapshot is at or after 840,268; 840,269 fits. No upper bound is proven (the two paid sellers may hold more Runestones, and the window ends at 840,269), so `snapshot.height` stays null and status `unconfirmed`. Note blockstream.info allows about 700 requests/hour/IP and mempool.space stalls after a few thousand.

## Build scripts
`art/dog/data.json` was assembled from the raw results by a small Python script (not shipped); every record carries its own source URL.
