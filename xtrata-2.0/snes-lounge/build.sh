#!/bin/sh
# Rebuilds snes-lounge/index.html and copies it to public/snes/index.html.
# Run from the repo root: sh snes-lounge/build.sh   (embeds the pinned emulator and star-patrol/star_patrol.sfc)
set -e
cd "$(dirname "$0")"
python3 patch.py
python3 - <<'PY'
import base64
s=open('src.html',encoding='utf-8').read()
emu=open('../canaries/snes-catalogue/assets/emulator/snes-emulator-v1.0.html','rb').read()
rom=open('../snes-games/star-patrol/star_patrol.sfc','rb').read()
open('index.html','w',encoding='utf-8').write(s.replace('/*__EMULATOR_B64__*/',base64.b64encode(emu).decode()).replace('/*__ROM_B64__*/',base64.b64encode(rom).decode()))
PY
mkdir -p ../public/snes && cp index.html ../public/snes/index.html
