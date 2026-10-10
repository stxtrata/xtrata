#!/usr/bin/env python3
# SPC700 driver + samples + song for STAR PATROL. Produces spc.bin (image loaded at $0200) and spc.inc
import math,random,struct
random.seed(3)
ORG=0x0200
class Asm:
    def __init__(s,org): s.org=org;s.buf=bytearray();s.labels={};s.fix=[]
    def pc(s): return s.org+len(s.buf)
    def L(s,n): s.labels[n]=s.pc()
    def b(s,*x): s.buf.extend(v&255 for v in x)
    def rel(s,op,t): s.b(op,0);s.fix.append(('r',len(s.buf)-1,t))
    def ab(s,op,t): s.b(op,0,0);s.fix.append(('a',len(s.buf)-2,t))
    def at(s,addr,data=b''):
        if addr<s.pc(): raise Exception('overlap at %x pc %x'%(addr,s.pc()))
        s.buf.extend(b'\0'*(addr-s.pc())); s.buf.extend(data)
    def done(s):
        for k,i,t in s.fix:
            v=s.labels[t] if isinstance(t,str) else t
            if k=='r':
                d=v-(s.org+i+1)
                assert -128<=d<=127,(t,d)
                s.buf[i]=d&255
            else:
                s.buf[i]=v&255;s.buf[i+1]=v>>8
        return bytes(s.buf)
a=Asm(ORG)
# helpers (instruction emitters)
def dspw(reg,val): a.b(0x8F,reg,0xF2);a.b(0x8F,val,0xF3)          # mov $F2,#reg ; mov $F3,#val
def movdp_i(dp,v): a.b(0x8F,v,dp)
def mova_i(v): a.b(0xE8,v)
def mova_dp(dp): a.b(0xE4,dp)
def movdp_a(dp): a.b(0xC4,dp)
def movx_i(v): a.b(0xCD,v)
def movy_i(v): a.b(0x8D,v)
def call(t): a.ab(0x3F,t)
def jmp(t): a.ab(0x5F,t)
def ret(): a.b(0x6F)
def bra(t): a.rel(0x2F,t)
def beq(t): a.rel(0xF0,t)
def bne(t): a.rel(0xD0,t)
def bcs(t): a.rel(0xB0,t)
def bcc(t): a.rel(0x90,t)
# dp variables
STEPT=5
STEPT=5
TICK,STEP,LASTA,LASTB,KOFF,MUSON,TMP,TMP2,PIT=0x00,0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08
# DSP registers
FLG,MVOLL,MVOLR,EVOLL,EVOLR,KON,KOFF_R,NON,EON,PMON,DIR,EFB=0x6C,0x0C,0x1C,0x2C,0x3C,0x4C,0x5C,0x3D,0x4D,0x2D,0x5D,0x0D
a.L('start')
movx_i(0xEF); a.b(0xBD)                       # mov sp,x
movdp_i(0xF1,0x30)                              # clear CPU input ports, timers off
dspw(FLG,0x60)                                  # mute + echo write off while we set up
for r in (EVOLL,EVOLR,EFB,EON,PMON,KON,KOFF_R): dspw(r,0)
dspw(NON,0x10)                                  # voice 4 = noise
dspw(DIR,0x08)
dspw(MVOLL,0x58);dspw(MVOLR,0x58)
# per-voice setup: (voice,srcn,adsr1,adsr2,volL,volR)
voices=[(0,0,0xCF,0xAC,0x58,0x58),(1,2,0xDF,0xA8,0x40,0x30),(2,1,0xEF,0x4E,0x28,0x38),
        (3,3,0xDF,0x3C,0x48,0x48),(4,0,0x8F|0x30,0x0C,0x60,0x60)]
for v,srcn,a1,a2,vl,vr in voices:
    b=v*16
    dspw(b+0,vl);dspw(b+1,vr);dspw(b+4,srcn);dspw(b+5,a1);dspw(b+6,a2);dspw(b+7,0)
dspw(FLG,0x20|0x08)                             # unmute, echo write disabled, noise rate 8
movdp_i(0xFA,125)                               # timer0: 8000/125 = 64 Hz
movdp_i(0xF1,0x01)                              # start timer0
for dp in (TICK,STEP,LASTA,LASTB,KOFF,MUSON): movdp_i(dp,0)
movdp_i(MUSON,1)
a.L('main')
# ---- commands from CPU: port0/1 = tone channel, port2/3 = noise channel
mova_dp(0xF5); a.b(0x64,LASTA); beq('chkB')       # cmp a,LASTA
movdp_a(LASTA); mova_dp(0xF4); call('doTone')
a.L('chkB')
mova_dp(0xF7); a.b(0x64,LASTB); beq('chkT')
movdp_a(LASTB); mova_dp(0xF6); call('doNoise')
a.L('chkT')
mova_dp(0xFD); beq('main')                        # T0OUT (cleared on read)
a.b(0x60)                                         # clrc
a.b(0x84,TICK); movdp_a(TICK)                     # adc a,TICK
a.b(0x68,STEPT); bcc('main')                      # cmp a,#N ; <N -> wait
a.b(0xA8,STEPT); movdp_a(TICK)                    # sbc a,#N (carry set by cmp)
call('musicStep')
bra('main')
# ---------------- doTone: A = cmd
a.L('doTone')
a.b(0x68,1); bne('t2')                            # 1 = shoot
mova_i(62); bra('playTone')
a.L('t2'); a.b(0x68,2); bne('t3')                 # 2 = menu blip (lower)
mova_i(40); bra('playTone')
a.L('t3'); a.b(0x68,3); bne('t4')                 # 3 = music on
movdp_i(MUSON,1); ret()
a.L('t4'); a.b(0x68,4); bne('t5')                 # 4 = music off: key off voices 0-2
movdp_i(MUSON,0)
mova_dp(KOFF); a.b(0x08,0x07); movdp_a(KOFF)       # or a,#7
movy_i(KOFF_R); call('wdsp'); ret()
a.L('t5'); a.b(0x68,5); bne('t6')                 # 5 = pickup / start blip (high)
mova_i(68); bra('playTone')
a.L('t6'); a.b(0x68,0x20); bcc('t7')              # >= $20: keyboard note
a.b(0xA8,4)                                       # sbc a,#4 (C=1) -> idx = cmd-4  ($20 = C4)
bra('playTone')
a.L('t7'); ret()
# ---------------- playTone: A = note index (1-based) on voice 3
a.L('playTone')
movx_i(3)
call('voiceOn')
ret()
# ---------------- doNoise: A = cmd (1 = boom, 2 = hit)
a.L('doNoise')
a.b(0x68,1); bne('n2')
mova_i(0x0A); bra('noiseGo')
a.L('n2'); mova_i(0x18)
a.L('noiseGo')
a.b(0x08,0x20); movy_i(FLG); call('wdsp')          # FLG = $20|rate
movx_i(4); call('voiceKon'); ret()
# ---------------- voiceOn: X = voice, A = note idx: set pitch + key on
a.L('voiceOn')
a.b(0x1C)                                          # asl a  (idx*2)
a.b(0xD8,TMP)                                      # mov TMP,x  (voice)
a.b(0x5D)                                          # mov x,a
a.ab(0xF5,'ptab'); movdp_a(TMP2)                   # TMP2 = lo
a.b(0x3D)                                          # inc x
a.ab(0xF5,'ptab'); movdp_a(PIT)                    # PIT = hi
mova_dp(TMP); a.b(0x1C,0x1C,0x1C,0x1C); a.b(0x08,2)  # A = voice*16+2
movdp_a(0xF2); mova_dp(TMP2); movdp_a(0xF3)
mova_dp(TMP); a.b(0x1C,0x1C,0x1C,0x1C); a.b(0x08,3)  # pitch high reg
movdp_a(0xF2); mova_dp(PIT); movdp_a(0xF3)
a.b(0xF8,TMP)                                      # mov x,TMP
a.L('voiceKon')                                    # X = voice
a.ab(0xF5,'nbit'); a.b(0x24,KOFF); movdp_a(KOFF)   # KOFF &= ~bit
movy_i(KOFF_R); call('wdsp')
a.ab(0xF5,'bit'); movy_i(KON); call('wdsp')
ret()
# wdsp: A = value, Y = reg
a.L('wdsp'); a.b(0xCB,0xF2); movdp_a(0xF3); ret()
# ---------------- music step
a.L('musicStep')
mova_dp(MUSON); beq('msRet')
for voice in range(3):
    mova_dp(STEP); a.b(0x60); a.b(0x88,voice); a.b(0x5D)   # clrc ; adc a,#voice ; mov x,a
    a.ab(0xF5,'song')                               # mov a,!song+x
    beq(f'ms{voice}n')                              # 0 = hold
    a.b(0x68,0x80); bne(f'ms{voice}p')
    mova_i(1<<voice); a.b(0x04,KOFF); movdp_a(KOFF)  # rest: KOFF |= bit
    movy_i(KOFF_R); call('wdsp'); bra(f'ms{voice}n')
    a.L(f'ms{voice}p')
    movx_i(voice); call('voiceOn')
    a.L(f'ms{voice}n')
mova_dp(STEP); a.b(0x60); a.b(0x88,3); movdp_a(STEP)  # STEP += 3
a.b(0x68,192); bcc('msRet'); movdp_i(STEP,0)
a.L('msRet'); ret()
code_end=a.pc()
# tables
bit=bytes([1,2,4,8,16]); nbit=bytes([0xFE,0xFD,0xFB,0xF7,0xEF])
a.L('bit'); a.buf.extend(bit)
a.L('nbit'); a.buf.extend(nbit)
# pitch table: index 0 unused; idx n -> midi 32+n  (A1=33 -> idx1)
ptab=bytearray(2)
for n in range(1,96):
    m=32+n; f=440*2**((m-69)/12); p=int(round(f*2.048)); p=min(p,0x3FFF)
    ptab+=struct.pack('<H',p)
a.L('ptab'); a.buf.extend(ptab)
# song: 64 steps x 3 voices, values = note idx or 0x80 rest or 0 hold
def n(m):
    v=m-32; assert 1<=v<=90,(m,v); return v
chords=[(57,3),(53,4),(60,4),(55,4)]  # Am F C G: root midi, third interval
lead_notes=[
 [69,0,0,72, 0,0,71,0, 69,0,0,0, 64,0,0,0],
 [65,0,0,69, 0,0,72,0, 69,0,0,0, 65,0,0,0],
 [67,0,0,72, 0,0,76,0, 72,0,0,0, 67,0,0,0],
 [71,0,0,74, 0,0,71,0, 67,0,0,0, 74,0,0,0x80]]
song=[]
for ci,(root,t) in enumerate(chords):
    for s in range(16):
        bass=0;lead=0;arp=0
        if s%4==0: bass=n(root-12+(12 if s==8 else 0))
        if s in (6,14): bass=n(root-12+7)
        if s%2==0: arp=n(root+12+[0,t,7,12,7,t,0,t][(s//2)%8])
        m=lead_notes[ci][s]
        lead=m if m==0x80 else (n(m) if m else 0)
        song.append((bass,lead,arp))
songb=bytearray()
for b,l,r in song: songb+=bytes([b,l,r])
assert len(songb)==192
a.L('song'); a.buf.extend(songb)
# sample directory + BRR samples at $0400 / $0410
end_code=a.pc()
def brr_block(samples,shift=12,loop=True):
    nib=[max(-8,min(7,int(v)))&15 for v in samples]
    hdr=(shift<<4)|(0x03 if loop else 0)
    out=bytearray([hdr])
    for i in range(0,16,2): out.append((nib[i]<<4)|nib[i+1])
    return bytes(out)
tri=[0,2,4,6,7,6,4,2,0,-2,-4,-6,-8,-6,-4,-2]
saw=[-8+i for i in range(16)]
pulse25=[6]*4+[-6]*12
sq=[6]*8+[-6]*8
samples=[tri,saw,pulse25,sq]   # srcn 0..3: 0=tri 1=saw 2=pulse25 3=square
# note: voice setup above: bass uses srcn0 (tri), arp srcn1 (saw), lead srcn2 (pulse25), tone sfx srcn3 (square)
DIR_ADDR=0x0800; SMP=0x0810
assert end_code<=DIR_ADDR,hex(end_code)
d=bytearray()
for i in range(4): d+=struct.pack('<HH',SMP+i*9,SMP+i*9)
a.at(DIR_ADDR,bytes(d))
smp=b''.join(brr_block(s) for s in samples)
a.at(SMP,smp)
img=a.done()
open('spc.bin','wb').write(img)
print('spc image',len(img),'bytes; code end %x'%code_end, 'labels start=%x'%a.labels['start'])
