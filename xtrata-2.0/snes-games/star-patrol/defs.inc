; ---------------------------------------------------------------- STAR PATROL: definitions
.p816
.smart +

.macro A8
  sep #$20
  .a8
.endmacro
.macro A16
  rep #$20
  .a16
.endmacro
.macro XY16
  rep #$10
  .i16
.endmacro

; ---- PPU / CPU registers
INIDISP   = $2100
OBJSEL    = $2101
OAMADDL   = $2102
OAMADDH   = $2103
OAMDATA   = $2104
BGMODE    = $2105
BG1SC     = $2107
BG2SC     = $2108
BG3SC     = $2109
BG12NBA   = $210B
BG34NBA   = $210C
BG1HOFS   = $210D
BG1VOFS   = $210E
BG2HOFS   = $210F
BG2VOFS   = $2110
VMAIN     = $2115
VMADDL    = $2116
VMDATAL   = $2118
M7SEL     = $211A
M7A       = $211B
M7B       = $211C
M7C       = $211D
M7D       = $211E
M7X       = $211F
M7Y       = $2120
CGADD     = $2121
CGDATA    = $2122
TM        = $212C
TS        = $212D
CGWSEL    = $2130
CGADSUB   = $2131
COLDATA   = $2132
APUIO0    = $2140
APUIO1    = $2141
APUIO2    = $2142
APUIO3    = $2143
NMITIMEN  = $4200
WRMPYA    = $4202
WRMPYB    = $4203
WRDIVL    = $4204
WRDIVB    = $4206
MDMAEN    = $420B
HDMAEN    = $420C
RDNMI     = $4210
HVBJOY    = $4212
RDDIVL    = $4214
RDMPYL    = $4216
JOY1L     = $4218
JOY2L     = $421A

; pad high byte (padX+1)
PH_B=$80
PH_Y=$40
PH_SEL=$20
PH_START=$10
PH_UP=$08
PH_DOWN=$04
PH_LEFT=$02
PH_RIGHT=$01
; pad low byte
PL_A=$80
PL_X=$40
PL_L=$20
PL_R=$10

NPB=4
NE=6
NEB=6
NX=4

ST_TITLE=0
ST_GAME=1
ST_INPUT=2
ST_SOUND=3
ST_M7=4

; ---- zero page
.segment "ZEROPAGE" : zeropage
vbl:     .res 1
state:   .res 1
pad:     .res 2
padold:  .res 2
padnew:  .res 2
frame:   .res 2
rnd:     .res 2
tmp0:    .res 2
tmp1:    .res 2
tmp3:    .res 2
tmpx:    .res 2
tmpy:    .res 2
tmpp:    .res 2
tb:      .res 1
t8x:     .res 1
t8y:     .res 1
s1v:     .res 2
s2v:     .res 2
seqA:    .res 1
seqB:    .res 1
menu:    .res 1
px:      .res 1
py:      .res 1
plives:  .res 1
pinv:    .res 1
pcool:   .res 1
gostate: .res 1
gotimer: .res 1
paused:  .res 1
spawnT:  .res 1
level:   .res 1
snote:   .res 1
musicon: .res 1
m7f:     .res 1
m7spd:   .res 1
m7pause: .res 1
newhi:   .res 1
bob:     .res 1

; ---- work RAM
.segment "BSS"
oam:     .res 544
bg3:     .res 2048
ents:
pba:     .res NPB
pbx:     .res NPB
pby:     .res NPB
et:      .res NE
ex:      .res NE
ey:      .res NE
ehx:     .res NE
eph:     .res NE
ecd:     .res NE
eba:     .res NEB
ebx:     .res NEB
eby:     .res NEB
ebdx:    .res NEB
xf:      .res NX
xx:      .res NX
xy:      .res NX
score:   .res 6
hiscore: .res 6
ents_end:
