#!/bin/sh
# Builds star_patrol.sfc (needs cc65: ca65 + ld65 on PATH, python3 + pillow + numpy).
set -e
cd "$(dirname "$0")"
python3 gen.py >/dev/null
python3 spc.py >/dev/null
ca65 -g -l game.lst -o game.o main.s
ld65 -C snes.cfg -Ln game.lbl -m game.map -o star_patrol.sfc game.o
python3 - <<'PY'
d=bytearray(open('star_patrol.sfc','rb').read())
assert len(d)==131072,len(d)
d[0x7FDC:0x7FE0]=b'\xff\xff\x00\x00'
s=sum(d)&0xFFFF
d[0x7FDE]=s&255; d[0x7FDF]=s>>8
c=s^0xFFFF
d[0x7FDC]=c&255; d[0x7FDD]=c>>8
open('star_patrol.sfc','wb').write(d)
print('star_patrol.sfc',len(d),'bytes checksum %04X'%s)
PY
