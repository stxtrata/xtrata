; ================================================================ screens and game logic
.segment "CODE"

ScrollBG:
  .a8
  A16
  lda frame
  and #1
  bne @s
  dec s1v
@s:
  lda s2v
  sec
  sbc #2
  sta s2v
  A8
  rts

; Y = oam byte offset, A = tile, tb = attr, t8x/t8y = position
PutSpr:
  .a8
  sta a:oam+2,y
  lda t8x
  sta a:oam,y
  lda t8y
  sta a:oam+1,y
  lda tb
  sta a:oam+3,y
  rts

; ---------------------------------------------------------------- TITLE
EnterTitle:
  .a8
  jsr SetupMode1
  stz menu
  ldx #0
@h:
  lda f:$700004,x
  sta hiscore,x
  inx
  cpx #6
  bne @h
  PRT 10,4,2,S_TITLE
  PRT 5,6,5,S_SUB
  PRT 11,14,1,S_M0
  PRT 11,16,1,S_M1
  PRT 11,18,1,S_M2
  PRT 11,20,1,S_M3
  PRT 8,22,3,S_HI
  PRTDIG 17,22,2,hiscore
  PRT 8,24,3,S_PLAYS
  A16
  lda f:$70000A
  sta tmp3
  A8
  PRTNUM 17,24,2
  PRT 1,27,6,S_HELP
  rts

RunTitle:
  .a8
  jsr ScrollBG
  lda padnew+1
  and #PH_UP
  beq @nu
  lda menu
  beq @nu
  dec menu
  lda #2
  jsr SndTone
@nu:
  lda padnew+1
  and #PH_DOWN
  beq @nd
  lda menu
  cmp #3
  bcs @nd
  inc menu
  lda #2
  jsr SndTone
@nd:
  jsr DrawCursor
  jsr DrawTitleSprites
  lda padnew+1
  and #PH_START
  bne @go
  lda padnew
  and #PL_A
  beq @ret
@go:
  lda #5
  jsr SndTone
  lda menu
  inc a
  jsr GoState
@ret:
  rts

DrawCursor:
  .a8
  stz t8x
@l:
  A16
  lda #9
  sta tmpx
  lda t8x
  and #$00FF
  asl
  clc
  adc #14
  sta tmpy
  lda #2
  sta tmpp
  A8
  lda t8x
  cmp menu
  bne @sp
  ldx #.loword(S_CUR)
  bra @p
@sp:
  ldx #.loword(S_SP)
@p:
  jsr PrintChars
  inc t8x
  lda t8x
  cmp #4
  bne @l
  rts

DrawTitleSprites:
  .a8
  jsr HideSprites
  A16
  lda frame
  lsr
  and #$001F
  tay
  A8
  lda SineTbl,y
  sta bob
  clc
  adc #84
  sta t8y
  lda #112
  sta t8x
  lda #$20
  sta tb
  lda frame
  and #8
  lsr
  lsr
  ldy #0
  jsr PutSpr
  ; saucer left
  lda #48
  sta t8x
  lda #100
  sec
  sbc bob
  sta t8y
  lda #$22
  sta tb
  lda frame
  and #8
  lsr
  lsr
  clc
  adc #4
  ldy #4
  jsr PutSpr
  ; crab right
  lda #176
  sta t8x
  lda #$24
  sta tb
  lda frame
  and #8
  lsr
  lsr
  clc
  adc #8
  ldy #8
  jsr PutSpr
  rts

; ---------------------------------------------------------------- GAME
EnterGame:
  .a8
  jsr SetupMode1
  ldx #0
  lda #0
@c:
  sta a:ents,x
  inx
  cpx #(ents_end-ents)
  bne @c
  lda #120
  sta px
  lda #190
  sta py
  lda #3
  sta plives
  lda #90
  sta pinv
  stz pcool
  stz gostate
  stz paused
  stz newhi
  stz level
  lda #30
  sta spawnT
  ldx #0
@h:
  lda f:$700004,x
  sta hiscore,x
  inx
  cpx #6
  bne @h
  A16
  lda f:$70000A
  inc a
  sta f:$70000A
  A8
  lda #3
  jsr SndTone
  rts

RunGame:
  .a8
  lda gostate
  cmp #2
  bne @notover
  jmp @over
@notover:
  cmp #0
  beq @pausechk
  jmp @world
@pausechk:
  lda padnew+1
  and #PH_START
  beq @np
  lda paused
  eor #1
  sta paused
  beq @res
  lda #4
  jsr SndTone
  bra @np
@res:
  lda #3
  jsr SndTone
@np:
  lda paused
  beq @clr
  PRT 13,12,2,S_PAUSED
  PRT 6,15,6,S_QUITHINT
  lda padnew+1
  and #PH_SEL
  beq @nq
  jsr SaveHi
  lda #ST_TITLE
  jsr GoState
@nq:
  rts
@clr:
  PRT 13,12,2,S_BLANK6
  PRT 6,15,6,S_BLANK20
@world:
  jsr ScrollBG
  jsr UpdatePlayer
  jsr UpdatePBullets
  jsr UpdateEnemies
  jsr UpdateEBullets
  jsr Collisions
  jsr UpdateExplosions
  jsr Spawn
  jsr DrawSprites
  jsr DrawHud
  lda gostate
  cmp #1
  bne @ret
  dec gotimer
  bne @ret
  lda #2
  sta gostate
  jsr SaveHi
@ret:
  rts
@over:
  jsr ScrollBG
  jsr UpdatePBullets
  jsr UpdateEnemies
  jsr UpdateEBullets
  jsr UpdateExplosions
  jsr DrawSprites
  jsr DrawHud
  PRT 11,11,3,S_GAMEOVER
  PRT 9,14,1,S_PRESS
  lda newhi
  beq @nh
  PRT 8,17,2,S_NEWHI
@nh:
  lda padnew+1
  and #PH_START
  beq @r2
  lda #ST_TITLE
  jsr GoState
@r2:
  rts

SaveHi:
  .a8
  ldx #0
@c:
  lda score,x
  cmp hiscore,x
  bne @d
  inx
  cpx #6
  bne @c
  rts
@d:
  bcc @ret
  ldx #0
@cp:
  lda score,x
  sta hiscore,x
  sta f:$700004,x
  inx
  cpx #6
  bne @cp
  lda #1
  sta newhi
@ret:
  rts

UpdatePlayer:
  .a8
  lda pinv
  beq @a
  dec pinv
@a:
  lda gostate
  beq @ctl
  rts
@ctl:
  lda pad+1
  and #PH_UP
  beq @nu
  lda py
  sec
  sbc #2
  cmp #24
  bcc @nu
  sta py
@nu:
  lda pad+1
  and #PH_DOWN
  beq @nd
  lda py
  clc
  adc #2
  cmp #200
  bcs @nd
  sta py
@nd:
  lda pad+1
  and #PH_LEFT
  beq @nl
  lda px
  sec
  sbc #2
  cmp #8
  bcc @nl
  sta px
@nl:
  lda pad+1
  and #PH_RIGHT
  beq @nr
  lda px
  clc
  adc #2
  cmp #233
  bcs @nr
  sta px
@nr:
  lda pcool
  beq @cd
  dec pcool
  rts
@cd:
  lda pad+1
  and #(PH_B|PH_Y)
  beq @ret
  ldx #0
@f:
  lda pba,x
  beq @free
  inx
  cpx #NPB
  bne @f
  rts
@free:
  lda #1
  sta pba,x
  lda px
  clc
  adc #4
  sta pbx,x
  lda py
  sec
  sbc #4
  sta pby,x
  lda #8
  sta pcool
  lda #1
  jsr SndTone
@ret:
  rts

UpdatePBullets:
  .a8
  ldx #0
@l:
  lda pba,x
  beq @n
  lda pby,x
  sec
  sbc #4
  sta pby,x
  cmp #8
  bcs @n
  lda #0
  sta pba,x
@n:
  inx
  cpx #NPB
  bne @l
  rts

UpdateEnemies:
  .a8
  ldx #0
@l:
  lda et,x
  bne @act
  jmp @n
@act:
  lda frame
  and #1
  bne @np
  inc eph,x
@np:
  inc ey,x
  lda et,x
  cmp #2
  bne @sw
  lda frame
  and #1
  beq @sw
  inc ey,x
@sw:
  A16
  lda eph,x
  and #$001F
  tay
  A8
  lda SineTbl,y
  clc
  adc ehx,x
  sta ex,x
  lda ey,x
  cmp #226
  bcc @nk
  cmp #240
  bcs @nk
  lda #0
  sta et,x
  jmp @n
@nk:
  lda et,x
  cmp #2
  bne @n
  lda ey,x
  cmp #200
  bcs @n
  lda ecd,x
  beq @shoot
  dec ecd,x
  bra @n
@shoot:
  jsr Rand
  and #$1F
  clc
  adc #50
  sta ecd,x
  jsr EnemyShoot
@n:
  inx
  cpx #NE
  beq @x
  jmp @l
@x:
  rts

EnemyShoot:
  .a8
  stx tmp0
  ldx #0
@f:
  lda eba,x
  beq @free
  inx
  cpx #NEB
  bne @f
  ldx tmp0
  rts
@free:
  lda #1
  sta eba,x
  ldy tmp0
  lda ex,y
  clc
  adc #4
  sta ebx,x
  lda ey,y
  clc
  adc #12
  sta eby,x
  lda px
  sec
  sbc ex,y
  bcs @pos
  eor #$FF
  inc a
  cmp #12
  bcc @zero
  lda #$FF
  bra @st
@pos:
  cmp #12
  bcc @zero
  lda #1
  bra @st
@zero:
  lda #0
@st:
  sta ebdx,x
  ldx tmp0
  rts

UpdateEBullets:
  .a8
  ldx #0
@l:
  lda eba,x
  beq @n
  lda eby,x
  clc
  adc #2
  sta eby,x
  cmp #224
  bcc @ok
  lda #0
  sta eba,x
  bra @n
@ok:
  lda frame
  and #1
  beq @n
  lda ebx,x
  clc
  adc ebdx,x
  sta ebx,x
  cmp #4
  bcc @kill
  cmp #245
  bcc @n
@kill:
  lda #0
  sta eba,x
@n:
  inx
  cpx #NEB
  bne @l
  rts

UpdateExplosions:
  .a8
  ldx #0
@l:
  lda xf,x
  beq @n
  inc a
  sta xf,x
  cmp #17
  bcc @n
  lda #0
  sta xf,x
@n:
  inx
  cpx #NX
  bne @l
  rts

SpawnExp:             ; t8x,t8y
  .a8
  phx
  ldx #0
@f:
  lda xf,x
  beq @free
  inx
  cpx #NX
  bne @f
  plx
  rts
@free:
  lda #1
  sta xf,x
  lda t8x
  sta xx,x
  lda t8y
  sta xy,x
  plx
  rts

AddTen:
  .a8
  ldx #4
@l:
  lda score,x
  inc a
  sta score,x
  cmp #10
  bcc @d
  lda #0
  sta score,x
  dex
  bpl @l
@d:
  rts

AddScore:             ; A = tens
  .a8
  phx
  sta tmp1
@a:
  lda tmp1
  beq @o
  dec tmp1
  jsr AddTen
  bra @a
@o:
  plx
  rts

KillEnemyScore:       ; Y = enemy
  .a8
  lda ex,y
  sta t8x
  lda ey,y
  sta t8y
  jsr SpawnExp
  lda et,y
  cmp #2
  beq @b
  lda #1
  bra @a
@b:
  lda #3
@a:
  jsr AddScore
  lda #0
  sta et,y
  lda #1
  jsr SndNoise
  rts

PlayerHit:
  .a8
  lda pinv
  bne @r
  lda px
  sta t8x
  lda py
  sta t8y
  jsr SpawnExp
  lda #2
  jsr SndNoise
  dec plives
  beq @dead
  lda #120
  sta pinv
  rts
@dead:
  lda #1
  sta gostate
  lda #90
  sta gotimer
@r:
  rts

Collisions:
  .a8
  ; ---- player bullets vs enemies
  ldx #0
@pb:
  lda pba,x
  bne @pbact
  jmp @pbn
@pbact:
  ldy #0
@en:
  lda et,y
  beq @enn
  lda pbx,x
  sec
  sbc #4
  sta tb
  lda ex,y
  jsr AbsDiff
  cmp #12
  bcs @enn
  lda pby,x
  sec
  sbc #4
  sta tb
  lda ey,y
  jsr AbsDiff
  cmp #12
  bcs @enn
  lda #0
  sta pba,x
  jsr KillEnemyScore
  jmp @pbn
@enn:
  iny
  cpy #NE
  bne @en
@pbn:
  inx
  cpx #NPB
  beq @pd
  jmp @pb
@pd:
  ; ---- player vs enemies / enemy bullets
  lda gostate
  beq @pc
  rts
@pc:
  lda pinv
  beq @pc2
  rts
@pc2:
  ldy #0
@pe:
  lda et,y
  beq @pen
  lda px
  sta tb
  lda ex,y
  jsr AbsDiff
  cmp #12
  bcs @pen
  lda py
  sta tb
  lda ey,y
  jsr AbsDiff
  cmp #12
  bcs @pen
  lda ex,y
  sta t8x
  lda ey,y
  sta t8y
  jsr SpawnExp
  lda #0
  sta et,y
  jmp PlayerHit
@pen:
  iny
  cpy #NE
  bne @pe
  ldx #0
@eb:
  lda eba,x
  beq @ebn
  lda px
  clc
  adc #4
  sta tb
  lda ebx,x
  jsr AbsDiff
  cmp #8
  bcs @ebn
  lda py
  clc
  adc #4
  sta tb
  lda eby,x
  jsr AbsDiff
  cmp #8
  bcs @ebn
  lda #0
  sta eba,x
  jmp PlayerHit
@ebn:
  inx
  cpx #NEB
  bne @eb
  rts

Spawn:
  .a8
  lda spawnT
  beq @do
  dec spawnT
  rts
@do:
  ldx #0
@f:
  lda et,x
  beq @free
  inx
  cpx #NE
  bne @f
  lda #8
  sta spawnT
  rts
@free:
  lda score+3
  cmp #8
  bcc @lv
  lda #7
@lv:
  sta level
  jsr Rand
  and #3
  bne @ta
  lda level
  beq @ta
  lda #2
  bra @ty
@ta:
  lda #1
@ty:
  sta et,x
  jsr Rand
  and #$7F
  sta tmp0
  jsr Rand
  and #$3F
  clc
  adc tmp0
  clc
  adc #24
  sta ehx,x
  sta ex,x
  lda #240
  sta ey,x
  jsr Rand
  sta eph,x
  and #$1F
  clc
  adc #40
  sta ecd,x
  lda level
  asl
  asl
  sta tmp0
  lda #50
  sec
  sbc tmp0
  sta spawnT
  rts

DrawSprites:
  .a8
  jsr HideSprites
  lda frame
  and #8
  lsr
  lsr
  sta tmp1
  ; player
  lda gostate
  bne @noship
  lda pinv
  beq @show
  lda frame
  and #4
  bne @noship
@show:
  lda px
  sta t8x
  lda py
  sta t8y
  lda #$20
  sta tb
  lda tmp1
  ldy #0
  jsr PutSpr
@noship:
  ; enemies (slots 1-6)
  ldx #0
  ldy #4
@e:
  lda et,x
  beq @en
  lda ex,x
  sta t8x
  lda ey,x
  sta t8y
  lda et,x
  cmp #2
  beq @b
  lda #$22
  sta tb
  lda #4
  bra @t
@b:
  lda #$24
  sta tb
  lda #8
@t:
  clc
  adc tmp1
  jsr PutSpr
@en:
  iny
  iny
  iny
  iny
  inx
  cpx #NE
  bne @e
  ; explosions (slots 7-10)
  ldx #0
  ldy #28
@x:
  lda xf,x
  beq @xn
  dec a
  lsr
  and #6
  clc
  adc #32
  pha
  lda xx,x
  sta t8x
  lda xy,x
  sta t8y
  lda #$26
  sta tb
  pla
  jsr PutSpr
@xn:
  iny
  iny
  iny
  iny
  inx
  cpx #NX
  bne @x
  ; player bullets (slots 11-14)
  ldx #0
  ldy #44
@p:
  lda pba,x
  beq @pn
  lda pbx,x
  sta t8x
  lda pby,x
  sta t8y
  lda #$26
  sta tb
  lda #64
  jsr PutSpr
@pn:
  iny
  iny
  iny
  iny
  inx
  cpx #NPB
  bne @p
  ; enemy bullets (slots 15-20)
  ldx #0
  ldy #60
@q:
  lda eba,x
  beq @qn
  lda ebx,x
  sta t8x
  lda eby,x
  sta t8y
  lda #$26
  sta tb
  lda #65
  jsr PutSpr
@qn:
  iny
  iny
  iny
  iny
  inx
  cpx #NEB
  bne @q
  rts

DrawHud:
  .a8
  PRT 1,1,1,S_SCORE
  PRTDIG 7,1,2,score
  PRT 17,1,1,S_HI
  PRTDIG 20,1,3,hiscore
  PRT 1,26,1,S_LIVES
  A16
  lda #7
  sta tmpx
  lda #26
  sta tmpy
  lda #2
  sta tmpp
  lda plives
  and #$00FF
  clc
  adc #16
  sta tmp3
  A8
  ; single digit: write directly
  A16
  jsr CalcPos
  lda tmp3
  ora tmpp
  sta a:0,y
  A8
  PRT 24,26,1,S_LV
  A16
  lda #27
  sta tmpx
  lda #26
  sta tmpy
  lda #2
  sta tmpp
  jsr CalcPos
  lda level
  and #$00FF
  clc
  adc #16
  ora tmpp
  sta a:0,y
  A8
  rts

; ---------------------------------------------------------------- INPUT TEST
EnterInput:
  .a8
  jsr SetupMode1
  PRT 11,2,2,S_INTITLE
  PRT 7,26,6,S_INBACK
  PRT 6,19,1,S_JOY1
  PRT 6,21,1,S_JOY2
  PRT 6,23,1,S_FRM
  rts

RunInput:
  .a8
  jsr ScrollBG
  jsr HideSprites
  ldx #0
@b:
  A16
  lda a:InputTbl,x
  and pad
  beq @off
  lda #4
  bra @s
@off:
  lda #6
@s:
  sta tmpp
  lda a:InputTbl+2,x
  and #$00FF
  sta tmpx
  lda a:InputTbl+2,x
  xba
  and #$00FF
  sta tmpy
  phx
  lda a:InputTbl+4,x
  tax
  jsr PrintChars
  plx
  inx
  inx
  inx
  inx
  inx
  inx
  cpx #(12*6)
  bne @b
  A16
  lda pad
  sta tmp3
  A8
  PRTHEX 13,19,2
  A16
  lda JOY2L
  sta tmp3
  A8
  PRTHEX 13,21,2
  A16
  lda frame
  sta tmp3
  A8
  PRTNUM 13,23,2
  lda pad+1
  and #(PH_SEL|PH_START)
  cmp #(PH_SEL|PH_START)
  bne @r
  lda #ST_TITLE
  jsr GoState
@r:
  rts

; ---------------------------------------------------------------- SOUND TEST
EnterSound:
  .a8
  jsr SetupMode1
  lda #4
  jsr SndTone
  stz musicon
  lda #12
  sta snote
  PRT 11,2,2,S_SNTITLE
  PRT 6,5,1,S_SN1
  PRT 6,7,1,S_SN2
  PRT 6,9,1,S_SN3
  PRT 6,11,1,S_SN4
  PRT 6,13,1,S_SN5
  PRT 6,15,1,S_SN6
  PRT 6,17,1,S_SN7
  PRT 6,20,5,S_NOTE
  PRT 6,22,5,S_MUSIC
  PRT 7,26,6,S_SNBACK
  rts

RunSound:
  .a8
  jsr ScrollBG
  jsr HideSprites
  lda padnew+1
  and #PH_LEFT
  beq @nl
  lda snote
  beq @nl
  dec snote
@nl:
  lda padnew+1
  and #PH_RIGHT
  beq @nr
  lda snote
  cmp #36
  bcs @nr
  inc snote
@nr:
  lda padnew
  and #PL_A
  beq @na
  lda snote
  clc
  adc #$20
  jsr SndTone
@na:
  lda padnew
  and #PL_X
  beq @nx
  lda #2
  jsr SndNoise
@nx:
  lda padnew
  and #PL_R
  beq @nrr
  lda #5
  jsr SndTone
@nrr:
  lda padnew
  and #PL_L
  beq @nl2
  lda musicon
  eor #1
  sta musicon
  beq @off
  lda #3
  bra @snd
@off:
  lda #4
@snd:
  jsr SndTone
@nl2:
  lda padnew+1
  and #PH_B
  beq @nb
  lda #1
  jsr SndNoise
@nb:
  lda padnew+1
  and #PH_Y
  beq @ny
  lda #1
  jsr SndTone
@ny:
  A16
  lda snote
  and #$00FF
  sta tmp3
  A8
  PRTNUM 12,20,2
  lda musicon
  beq @mo
  PRT 12,22,4,S_ON
  bra @ex
@mo:
  PRT 12,22,3,S_OFF
@ex:
  lda padnew+1
  and #PH_START
  beq @r
  lda #3
  jsr SndTone
  lda #ST_TITLE
  jsr GoState
@r:
  rts

; ---------------------------------------------------------------- MODE 7
EnterM7:
  .a8
  stz HDMAEN
  lda #$07
  sta BGMODE
  lda #$80
  sta M7SEL
  lda #$00
  sta VMAIN
  ldx #0
  stx VMADDL
  DMA 0,$18,.loword(m7map_data),^m7map_data,16384
  lda #$80
  sta VMAIN
  ldx #0
  stx VMADDL
  DMA 0,$19,.loword(m7tiles_data),^m7tiles_data,320
  jsr LoadObjPal
  lda #$11
  sta TM
  stz TS
  jsr SetupHdma
  lda #$00
  sta M7X
  lda #$02
  sta M7X
  lda #$00
  sta M7Y
  lda #$02
  sta M7Y
  lda #$80
  sta BG1HOFS
  lda #$01
  sta BG1HOFS
  lda #$90
  sta BG1VOFS
  lda #$01
  sta BG1VOFS
  stz m7f
  lda #5
  sta m7spd
  stz m7pause
  jsr InitOam
  rts

RunM7:
  .a8
  lda padnew+1
  and #PH_LEFT
  beq @nl
  lda m7spd
  beq @nl
  dec m7spd
@nl:
  lda padnew+1
  and #PH_RIGHT
  beq @nr
  lda m7spd
  cmp #8
  bcs @nr
  inc m7spd
@nr:
  lda padnew
  and #PL_A
  beq @na
  lda m7pause
  eor #1
  sta m7pause
@na:
  lda m7pause
  bne @np
  lda m7f
  clc
  adc m7spd
  sec
  sbc #4
  sta m7f
@np:
  jsr HideSprites
  lda #112
  sta t8x
  lda #96
  sta t8y
  lda #$20
  sta tb
  lda frame
  and #8
  lsr
  lsr
  ldy #0
  jsr PutSpr
  lda padnew+1
  and #PH_START
  beq @r
  lda #ST_TITLE
  jsr GoState
@r:
  rts

; ================================================================ read-only data
.segment "RODATA"
S_TITLE:   .byte "STAR PATROL",0
S_SUB:     .byte "SNES EMULATOR TEST ROM",0
S_M0:      .byte "START GAME",0
S_M1:      .byte "INPUT TEST",0
S_M2:      .byte "SOUND TEST",0
S_M3:      .byte "MODE 7 TEST",0
S_CUR:     .byte "]",0
S_SP:      .byte " ",0
S_HI:      .byte "HI-SCORE",0
S_PLAYS:   .byte "PLAYS",0
S_HELP:    .byte "B FIRE  START PAUSE  ^\[] MOVE",0
S_PAUSED:  .byte "PAUSED",0
S_BLANK6:  .byte "      ",0
S_BLANK20: .byte "                    ",0
S_QUITHINT:.byte "SELECT: QUIT TO MENU",0
S_GAMEOVER:.byte "GAME OVER",0
S_PRESS:   .byte "PRESS START",0
S_NEWHI:   .byte "NEW HI-SCORE!",0
S_SCORE:   .byte "SCORE",0
S_LIVES:   .byte "LIVES",0
S_LV:      .byte "LV",0
S_INTITLE: .byte "INPUT TEST",0
S_INBACK:  .byte "SELECT+START: BACK",0
S_JOY1:    .byte "JOY1",0
S_JOY2:    .byte "JOY2",0
S_FRM:     .byte "FRAME",0
S_SNTITLE: .byte "SOUND TEST",0
S_SN1:     .byte "A  PLAY NOTE",0
S_SN2:     .byte "B  BOOM",0
S_SN3:     .byte "X  HIT",0
S_SN4:     .byte "Y  LASER",0
S_SN5:     .byte "R  BLIP",0
S_SN6:     .byte "L  MUSIC ON/OFF",0
S_SN7:     .byte "[] CHANGE NOTE",0
S_NOTE:    .byte "NOTE",0
S_MUSIC:   .byte "MUSIC",0
S_ON:      .byte "ON ",0
S_OFF:     .byte "OFF",0
S_SNBACK:  .byte "START: BACK TO MENU",0

; strings for input test
I_UP:    .byte "UP",0
I_DOWN:  .byte "DOWN",0
I_LEFT:  .byte "LEFT",0
I_RIGHT: .byte "RIGHT",0
I_SEL:   .byte "SELECT",0
I_START: .byte "START",0
I_L:     .byte "L",0
I_R:     .byte "R",0
I_A:     .byte "A",0
I_B:     .byte "B",0
I_X:     .byte "X",0
I_Y:     .byte "Y",0
InputTbl:
  .word $0800, 14|(7<<8),  .loword(I_UP)
  .word $0400, 14|(13<<8), .loword(I_DOWN)
  .word $0200, 7|(10<<8),  .loword(I_LEFT)
  .word $0100, 19|(10<<8), .loword(I_RIGHT)
  .word $2000, 8|(17<<8),  .loword(I_SEL)
  .word $1000, 18|(17<<8), .loword(I_START)
  .word $0020, 3|(5<<8),   .loword(I_L)
  .word $0010, 28|(5<<8),  .loword(I_R)
  .word $0080, 28|(11<<8), .loword(I_A)
  .word $8000, 25|(13<<8), .loword(I_B)
  .word $0040, 25|(9<<8),  .loword(I_X)
  .word $4000, 22|(11<<8), .loword(I_Y)

SineTbl: .incbin "sine.bin"
HdmaTbl: .incbin "hdma.bin"

; ================================================================ assets in banks 1-3
.segment "ASSET1"
spr_data:      .incbin "spr.bin"
font_data:     .incbin "font.bin"
bgtiles_data:  .incbin "bgtiles.bin"
bg1map_data:   .incbin "bg1map.bin"
bg2map_data:   .incbin "bg2map.bin"
pal_data:      .incbin "pal.bin"
.segment "ASSET2"
m7map_data:    .incbin "m7map.bin"
m7tiles_data:  .incbin "m7tiles.bin"
m7mat_data:    .incbin "m7mat.bin"
.segment "ASSET3"
spc_data:      .incbin "spc.bin"
spc_end:

; ================================================================ header + vectors
.segment "HEADER"
  .byte "STAR PATROL          "   ; 21 bytes
  .byte $20          ; LoROM, slow
  .byte $02          ; ROM + RAM + battery
  .byte $07          ; 128 KB
  .byte $03          ; 8 KB SRAM
  .byte $01          ; USA
  .byte $33
  .byte $00
  .word $FFFF        ; checksum complement (patched)
  .word $0000        ; checksum (patched)
.segment "VECTORS"
  .word 0,0
  .word RtiStub      ; native COP
  .word RtiStub      ; BRK
  .word RtiStub      ; ABORT
  .word Nmi          ; NMI
  .word 0
  .word RtiStub      ; IRQ
  .word 0,0
  .word RtiStub      ; emu COP
  .word 0
  .word RtiStub      ; emu ABORT
  .word RtiStub      ; emu NMI
  .word Reset        ; RESET
  .word RtiStub      ; IRQ/BRK
