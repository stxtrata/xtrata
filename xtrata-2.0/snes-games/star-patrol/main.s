; ================================================================ STAR PATROL
; SNES homebrew test ROM for emulator validation (ca65 / ld65)
.include "defs.inc"

.segment "CODE"

; ---------------------------------------------------------------- boot
Reset:
  sei
  clc
  xce
  rep #$38
  .a16
  .i16
  ldx #$1FFF
  txs
  lda #0
  tcd
  ldx #0
@clr:
  stz a:$0000,x
  inx
  inx
  cpx #$1800
  bne @clr
  A8
  lda #$8F
  sta INIDISP
  stz NMITIMEN
  stz HDMAEN
  stz MDMAEN
  ldx #1
@p:
  stz a:$2100,x
  inx
  cpx #$34
  bne @p
  lda #$8F
  sta INIDISP
  jsr InitSram
  jsr UploadSpc
  A16
  lda #$ACE1
  sta rnd
  A8
  lda #ST_TITLE
  jsr GoState
MainLoop:
  jsr WaitVbl
  jsr ReadPad
  A16
  inc frame
  A8
  jsr RunState
  bra MainLoop

RtiStub:
  rti

; ---------------------------------------------------------------- NMI
Nmi:
  rep #$30
  pha
  phx
  phy
  sep #$20
  .a8
  lda RDNMI
  lda state
  cmp #ST_M7
  bne @mode1
  jmp @m7
@mode1:
  ; OAM
  stz OAMADDL
  stz OAMADDH
  lda #$00
  sta $4300
  lda #$04
  sta $4301
  ldx #.loword(oam)
  stx $4302
  stz $4304
  ldx #544
  stx $4305
  lda #1
  sta MDMAEN
  ; BG3 text map
  lda #$80
  sta VMAIN
  ldx #$0400
  stx VMADDL
  lda #$01
  sta $4300
  lda #$18
  sta $4301
  ldx #.loword(bg3)
  stx $4302
  stz $4304
  ldx #2048
  stx $4305
  lda #1
  sta MDMAEN
  ; scroll registers (BG1 slow vertical, BG2 fast vertical)
  lda s1v
  sta BG1VOFS
  lda s1v+1
  sta BG1VOFS
  lda s2v
  sta BG2VOFS
  lda s2v+1
  sta BG2VOFS
  jmp @done
@m7:
  stz OAMADDL
  stz OAMADDH
  lda #$00
  sta $4300
  lda #$04
  sta $4301
  ldx #.loword(oam)
  stx $4302
  stz $4304
  ldx #544
  stx $4305
  lda #1
  sta MDMAEN
  ; mode 7 matrix for this frame
  A16
  lda m7f
  and #$00FF
  asl
  asl
  asl
  tax
  A8
  lda f:m7mat_data,x
  sta M7A
  lda f:m7mat_data+1,x
  sta M7A
  lda f:m7mat_data+2,x
  sta M7B
  lda f:m7mat_data+3,x
  sta M7B
  lda f:m7mat_data+4,x
  sta M7C
  lda f:m7mat_data+5,x
  sta M7C
  lda f:m7mat_data+6,x
  sta M7D
  lda f:m7mat_data+7,x
  sta M7D
@done:
  lda #1
  sta vbl
  rep #$30
  ply
  plx
  pla
  rti

; ---------------------------------------------------------------- small helpers
WaitVbl:
  .a8
  .i16
@w:
  lda vbl
  beq @w
  stz vbl
  rts

ReadPad:
  A16
  lda pad
  sta padold
  lda JOY1L
  sta pad
  eor padold
  and pad
  sta padnew
  A8
  rts

; returns random byte in A (A8)
Rand:
  A16
  lda rnd
  lsr
  bcc @n
  eor #$B400
@n:
  sta rnd
  A8
  rts

; A = command for tone channel / noise channel
SndTone:
  sta APUIO0
  lda seqA
  inc a
  sta seqA
  sta APUIO1
  rts
SndNoise:
  sta APUIO2
  lda seqB
  inc a
  sta seqB
  sta APUIO3
  rts

; A = |A - tb|
AbsDiff:
  sec
  sbc tb
  bcs @r
  eor #$FF
  inc a
@r:
  rts

; ---------------------------------------------------------------- SRAM
InitSram:
  .a8
  ldx #0
@c:
  lda f:$700000,x
  cmp f:SramMagic,x
  bne @fmt
  inx
  cpx #4
  bne @c
  rts
@fmt:
  ldx #0
@w:
  lda f:SramMagic,x
  sta f:$700000,x
  inx
  cpx #4
  bne @w
  lda #0
  ldx #4
@z:
  sta f:$700000,x
  inx
  cpx #16
  bne @z
  rts
SramMagic: .byte "SPV1"

; ---------------------------------------------------------------- SPC700 upload (IPL protocol)
UploadSpc:
  .a8
  A16
  lda #$BBAA
@w1:
  cmp APUIO0
  bne @w1
  A8
  ldy #$0200
  sty APUIO2
  lda #$01
  sta APUIO1
  lda #$CC
  sta APUIO0
@w2:
  cmp APUIO0
  bne @w2
  ldx #0
@send:
  lda f:spc_data,x
  sta APUIO1
  txa
  sta APUIO0
@w3:
  cmp APUIO0
  bne @w3
  inx
  cpx #(spc_end-spc_data)
  bne @send
  ldy #$0200
  sty APUIO2
  stz APUIO1
  txa
  inc a
  sta APUIO0
  ; give the driver a moment to start
  ldx #2000
@d:
  dex
  bne @d
  rts

; ---------------------------------------------------------------- state machine
; A = new state
GoState:
  .a8
  sta state
  A16
  and #$00FF
  asl
  tax
  A8
  lda #$8F
  sta INIDISP
  lda #$01
  sta NMITIMEN
  jsr (EnterTbl,x)
  lda #$0F
  sta INIDISP
  lda #$81
  sta NMITIMEN
  rts

EnterTbl: .word EnterTitle, EnterGame, EnterInput, EnterSound, EnterM7
RunTbl:   .word RunTitle, RunGame, RunInput, RunSound, RunM7

RunState:
  A16
  lda state
  and #$00FF
  asl
  tax
  A8
  jmp (RunTbl,x)

; ---------------------------------------------------------------- video setup
.macro DMA mode, reg, src, bank, size
  lda #mode
  sta $4300
  lda #reg
  sta $4301
  ldx #src
  stx $4302
  lda #bank
  sta $4304
  ldx #size
  stx $4305
  lda #1
  sta MDMAEN
.endmacro

LoadObjPal:
  .a8
  lda #$80
  sta VMAIN
  ldx #$4000
  stx VMADDL
  DMA 1,$18,.loword(spr_data),^spr_data,4096
  stz CGADD
  DMA 0,$22,.loword(pal_data),^pal_data,512
  lda #$02
  sta OBJSEL
  rts

SetupHdma:
  .a8
  lda #$02
  sta $4370
  lda #$32
  sta $4371
  ldx #.loword(HdmaTbl)
  stx $4372
  lda #^HdmaTbl
  sta $4374
  sta $4377
  lda #$43
  sta COLDATA
  stz CGWSEL
  lda #$20
  sta CGADSUB
  lda #$80
  sta HDMAEN
  rts

SetupMode1:
  .a8
  stz HDMAEN
  lda #$09
  sta BGMODE
  lda #$08
  sta BG1SC
  lda #$0C
  sta BG2SC
  lda #$04
  sta BG3SC
  stz BG12NBA
  lda #$01
  sta BG34NBA
  lda #$80
  sta VMAIN
  ldx #$0000
  stx VMADDL
  DMA 1,$18,.loword(bgtiles_data),^bgtiles_data,448
  ldx #$0800
  stx VMADDL
  DMA 1,$18,.loword(bg1map_data),^bg1map_data,2048
  ldx #$0C00
  stx VMADDL
  DMA 1,$18,.loword(bg2map_data),^bg2map_data,2048
  ldx #$1000
  stx VMADDL
  DMA 1,$18,.loword(font_data),^font_data,1024
  jsr LoadObjPal
  lda #$17
  sta TM
  stz TS
  stz M7SEL
  jsr SetupHdma
  A16
  stz s1v
  stz s2v
  A8
  jsr ClearBG3
  jsr InitOam
  rts

ClearBG3:
  A16
  ldx #0
@l:
  stz a:bg3,x
  inx
  inx
  cpx #2048
  bne @l
  A8
  rts

InitOam:
  .a8
  ldx #0
  lda #240
@l:
  stz a:oam,x
  inx
  sta a:oam,x
  inx
  stz a:oam,x
  inx
  stz a:oam,x
  inx
  cpx #512
  bne @l
  ldx #0
  lda #0
@h:
  sta a:oam+512,x
  inx
  cpx #32
  bne @h
  lda #$AA
  sta oam+512
  sta oam+513
  lda #$2A
  sta oam+514
  rts

HideSprites:
  .a8
  ldx #1
  lda #240
@l:
  sta a:oam,x
  inx
  inx
  inx
  inx
  cpx #513
  bcc @l
  rts

; ---------------------------------------------------------------- text
; CalcPos: tmpx,tmpy,tmpp -> Y = address in bg3 mirror, tmpp = attribute word. (A16 in/out)
CalcPos:
  .a16
  lda tmpy
  asl
  asl
  asl
  asl
  asl
  asl
  sta tmp0
  lda tmpx
  asl
  clc
  adc tmp0
  clc
  adc #.loword(bg3)
  tay
  lda tmpp
  asl
  asl
  ora #$0020
  xba
  and #$FF00
  sta tmpp
  rts

; X -> chars (zero terminated); tmpx,tmpy,tmpp (palette 0-7) set. returns A8
PrintChars:
  A16
  jsr CalcPos
@lp:
  lda a:0,x
  and #$00FF
  beq @done
  sec
  sbc #32
  ora tmpp
  sta a:0,y
  iny
  iny
  inx
  bra @lp
@done:
  A8
  rts

; X -> 6 digit array (values 0..9)
PrintDigits:
  A16
  stx tmp1
  jsr CalcPos
  ldx #6
@l:
  lda (tmp1)
  and #$000F
  clc
  adc #16
  ora tmpp
  sta a:0,y
  iny
  iny
  inc tmp1
  dex
  bne @l
  A8
  rts

; print tmp3 as 4 hex digits
PrintHex16:
  A16
  jsr CalcPos
  ldx #4
@n:
  lda tmp3
  lsr
  lsr
  lsr
  lsr
  lsr
  lsr
  lsr
  lsr
  lsr
  lsr
  lsr
  lsr
  and #$000F
  cmp #10
  bcc @d
  adc #22
  bra @w
@d:
  adc #16
@w:
  ora tmpp
  sta a:0,y
  iny
  iny
  lda tmp3
  asl
  asl
  asl
  asl
  sta tmp3
  dex
  bne @n
  A8
  rts

; print tmp3 as 5 digit decimal using the hardware divider
PrintNum5:
  A16
  jsr CalcPos
  tya
  clc
  adc #8
  tay
  ldx #5
@d:
  lda tmp3
  sta WRDIVL
  A8
  lda #10
  sta WRDIVB
  nop
  nop
  nop
  nop
  nop
  nop
  nop
  nop
  nop
  A16
  lda RDDIVL
  sta tmp3
  lda RDMPYL
  and #$00FF
  clc
  adc #16
  ora tmpp
  sta a:0,y
  dey
  dey
  dex
  bne @d
  A8
  rts

.macro PRT cx,cy,cp,str
  A16
  lda #cx
  sta tmpx
  lda #cy
  sta tmpy
  lda #cp
  sta tmpp
  ldx #.loword(str)
  jsr PrintChars
  .a8
.endmacro
.macro PRTNUM cx,cy,cp
  A16
  lda #cx
  sta tmpx
  lda #cy
  sta tmpy
  lda #cp
  sta tmpp
  jsr PrintNum5
  .a8
.endmacro
.macro PRTHEX cx,cy,cp
  A16
  lda #cx
  sta tmpx
  lda #cy
  sta tmpy
  lda #cp
  sta tmpp
  jsr PrintHex16
  .a8
.endmacro
.macro PRTDIG cx,cy,cp,arr
  A16
  lda #cx
  sta tmpx
  lda #cy
  sta tmpy
  lda #cp
  sta tmpp
  ldx #.loword(arr)
  jsr PrintDigits
  .a8
.endmacro
.macro ABSA
  bcs :+
  eor #$FF
  inc a
:
.endmacro

.include "states.s"
