#!/bin/sh
# Downloads the real on-chain players the streaming suite (h_stream.py) replays through a mocked route.
# They are inscribed media, so they are fetched on demand and never committed.
set -e
cd "$(dirname "$0")" && mkdir -p fixtures && cd fixtures
for f in 2830:2830.html 3089:3089.html 317:317.html 1107:1107.html 315:315.bin 134:134.bin; do
  id=${f%%:*}; name=${f##*:}
  [ -s "$name" ] || curl -fsS -m 180 -o "$name" "https://xtrata.xyz/i/$id"
done
ls -la
