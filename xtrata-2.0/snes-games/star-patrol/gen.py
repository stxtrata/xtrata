#!/usr/bin/env python3
# Asset generator for STAR PATROL (SNES test game)
import math,random,struct,sys
from PIL import Image
random.seed(7)
def rgb(r,g,b):  # 0..255 -> SNES BGR555
    return ((b>>3)<<10)|((g>>3)<<5)|(r>>3)
# ------------------------------------------------------------------ font
G={}
def glyph(c,rows): G[c]=rows
glyph('A',[".###.","#...#","#...#","#####","#...#","#...#","#...#"])
glyph('B',["####.","#...#","#...#","####.","#...#","#...#","####."])
glyph('C',[".###.","#...#","#....","#....","#....","#...#",".###."])
glyph('D',["####.","#...#","#...#","#...#","#...#","#...#","####."])
glyph('E',["#####","#....","#....","####.","#....","#....","#####"])
glyph('F',["#####","#....","#....","####.","#....","#....","#...."])
glyph('G',[".###.","#...#","#....","#.###","#...#","#...#",".###."])
glyph('H',["#...#","#...#","#...#","#####","#...#","#...#","#...#"])
glyph('I',[".###.","..#..","..#..","..#..","..#..","..#..",".###."])
glyph('J',["..###","...#.","...#.","...#.","...#.","#..#.",".##.."])
glyph('K',["#...#","#..#.","#.#..","##...","#.#..","#..#.","#...#"])
glyph('L',["#....","#....","#....","#....","#....","#....","#####"])
glyph('M',["#...#","##.##","#.#.#","#.#.#","#...#","#...#","#...#"])
glyph('N',["#...#","##..#","#.#.#","#..##","#...#","#...#","#...#"])
glyph('O',[".###.","#...#","#...#","#...#","#...#","#...#",".###."])
glyph('P',["####.","#...#","#...#","####.","#....","#....","#...."])
glyph('Q',[".###.","#...#","#...#","#...#","#.#.#","#..#.",".##.#"])
glyph('R',["####.","#...#","#...#","####.","#.#..","#..#.","#...#"])
glyph('S',[".####","#....","#....",".###.","....#","....#","####."])
glyph('T',["#####","..#..","..#..","..#..","..#..","..#..","..#.."])
glyph('U',["#...#","#...#","#...#","#...#","#...#","#...#",".###."])
glyph('V',["#...#","#...#","#...#","#...#","#...#",".#.#.","..#.."])
glyph('W',["#...#","#...#","#...#","#.#.#","#.#.#","##.##","#...#"])
glyph('X',["#...#","#...#",".#.#.","..#..",".#.#.","#...#","#...#"])
glyph('Y',["#...#","#...#",".#.#.","..#..","..#..","..#..","..#.."])
glyph('Z',["#####","....#","...#.","..#..",".#...","#....","#####"])
glyph('0',[".###.","#...#","#..##","#.#.#","##..#","#...#",".###."])
glyph('1',["..#..",".##..","..#..","..#..","..#..","..#..",".###."])
glyph('2',[".###.","#...#","....#","...#.","..#..",".#...","#####"])
glyph('3',[".###.","#...#","....#","..##.","....#","#...#",".###."])
glyph('4',["...#.","..##.",".#.#.","#..#.","#####","...#.","...#."])
glyph('5',["#####","#....","####.","....#","....#","#...#",".###."])
glyph('6',[".###.","#....","#....","####.","#...#","#...#",".###."])
glyph('7',["#####","....#","...#.","..#..",".#...",".#...",".#..."])
glyph('8',[".###.","#...#","#...#",".###.","#...#","#...#",".###."])
glyph('9',[".###.","#...#","#...#",".####","....#","....#",".###."])
glyph('.',[".....",".....",".....",".....",".....",".##..",".##.."])
glyph(',',[".....",".....",".....",".....",".##..",".##..",".#..."])
glyph(':',[".....",".##..",".##..",".....",".##..",".##..","....."])
glyph(';',[".....",".##..",".##..",".....",".##..",".#...","#...."])
glyph('-',[".....",".....",".....",".###.",".....",".....","....."])
glyph('!',["..#..","..#..","..#..","..#..","..#..",".....","..#.."])
glyph('?',[".###.","#...#","....#","...#.","..#..",".....","..#.."])
glyph('/',["....#","....#","...#.","..#..",".#...","#....","#...."])
glyph('+',[".....","..#..","..#..","#####","..#..","..#..","....."])
glyph('=',[".....",".....","#####",".....","#####",".....","....."])
glyph('(',["...#.","..#..",".#...",".#...",".#...","..#..","...#."])
glyph(')',[".#...","..#..","...#.","...#.","...#.","..#..",".#..."])
glyph('>',["#....",".#...","..#..","...#.","..#..",".#...","#...."])
glyph('<',["....#","...#.","..#..",".#...","..#..","...#.","....#"])
glyph('*',["..#..","#.#.#",".###.","..#..",".###.","#.#.#","..#.."])
glyph('%',["##..#","##..#","...#.","..#..",".#...","#..##","#..##"])
glyph('_',[".....",".....",".....",".....",".....",".....","#####"])
glyph("'",["..#..","..#..",".....",".....",".....",".....","....."])
glyph('^',["..#..",".###.","#.#.#","..#..","..#..","..#..","..#.."])   # up arrow
glyph('\\',["..#..","..#..","..#..","#.#.#",".###.","..#..","....."]) # down arrow
glyph('[',["..#..",".#...","#####",".#...","..#..",".....","....."])   # left arrow
glyph(']',["..#..","...#.","#####","...#.","..#..",".....","....."])   # right arrow
def font_tiles():
    out=bytearray()
    for code in range(32,96):
        c=chr(code)
        rows=G.get(c,["....."]*7)
        px=[[0]*8 for _ in range(8)]
        for y,r in enumerate(rows):
            for x,ch in enumerate(r):
                if ch=='#':
                    px[y][x]=1
        for y in range(7):
            for x in range(5):
                if px[y][x]==1 and px[y+1][x+1]==0: px[y+1][x+1]=2
        for y in range(8):
            p0=p1=0
            for x in range(8):
                v=px[y][x]
                p0|=(v&1)<<(7-x); p1|=((v>>1)&1)<<(7-x)
            out+=bytes([p0,p1])
    return bytes(out)
def tile4(px):  # 8x8 list of rows with 0..15
    out=bytearray(32)
    for y in range(8):
        for x in range(8):
            v=px[y][x]
            for p in range(4):
                if v>>p&1:
                    out[(p>>1)*16+y*2+(p&1)]|=0x80>>x
    return bytes(out)
def tile8(px):
    return bytes(px[y][x] for y in range(8) for x in range(8))
# ------------------------------------------------------------------ palette
pal=[0]*256
def setpal(base,cols):
    for i,c in enumerate(cols): pal[base+i]=rgb(*c)
# BG3 text palettes (2bpp, 4 entries each): fill 'pal n' = entries n*4..n*4+3
txt={1:((255,255,255),(70,70,110)),2:((255,220,70),(110,70,10)),3:((255,100,80),(90,20,20)),
     4:((120,255,140),(20,80,40)),5:((110,230,255),(20,70,100)),6:((150,150,170),(40,40,60))}
for n,(a,b) in txt.items(): setpal(n*4,[(0,0,0),a,b,(0,0,0)])
# BG2 stars: 4bpp palette 2 => entries 32..47
setpal(32,[(0,0,0),(90,100,160),(170,185,255),(255,255,255),(255,240,160),(160,255,255)])
# BG1 nebula: palette 3 => entries 48..63 (levels 1..7)
neb=[(0,0,0),(28,16,52),(40,22,74),(56,30,98),(76,40,120),(98,52,138),(120,66,150),(140,84,160)]
setpal(48,neb)
# Mode 7 palette: 4 => entries 64..79
setpal(64,[(0,0,0),(40,70,160),(24,40,110),(220,200,90),(255,255,255),(200,60,60),(60,200,90),(30,30,60)])
# OBJ palettes entries 128+16n
setpal(128,[(0,0,0),(10,20,50),(200,220,255),(90,130,220),(80,240,255),(255,140,30),(255,235,120),(230,50,60)])      # player
setpal(144,[(0,0,0),(40,10,60),(120,255,140),(60,170,90),(255,255,255),(255,90,200),(250,240,100),(20,70,50)])        # enemy A (green saucer)
setpal(160,[(0,0,0),(60,10,10),(255,120,60),(200,50,40),(255,230,160),(255,255,255),(120,60,200),(40,10,30)])        # enemy B (orange/red)
setpal(176,[(0,0,0),(255,255,255),(255,240,120),(255,160,40),(230,60,30),(120,30,20),(180,255,255),(90,120,200)])    # explosion / bullets
# ------------------------------------------------------------------ sprites
def mirror(left): return [r+r[::-1] for r in left]
ship_left=[
 ".......1",
 "......12",
 "......12",
 ".....124",
 ".....124",
 "....1223",
 "...12233",
 "..122333",
 ".1223333",
 "12233333",
 "17233333",
 "12233322",
 "11.1233.",
 ".....12.",
 "........",
 "........"]
def with_flame(rows,len_):
    rows=[list(r) for r in rows]
    for i in range(len_):
        y=13+i
        for x in (6,7,8,9):
            if y<16: rows[y][x]='5' if i==0 else ('6' if x in (7,8) else '5')
    return [''.join(r) for r in rows]
shipA=mirror(ship_left); shipB=mirror(ship_left)
shipA=with_flame(shipA,2); shipB=with_flame(shipB,3)
# fix flame chars: center brighter
def enemyA(frame):
    L=["........","........","....1111","...12222","..122222","..123344","1.123333","12222222","12333333","1.123344","..122222","...1.1.1","....1..1" if frame==0 else "...1..1.","........","........"]
    return mirror(L)
def enemyB(frame):
    wing=["1.......","11......","12.....1","122...12","1232.123","12322232","1.123222","..122322" if frame==0 else "..123222","..1232.2","...123.4","...12..4","....1...","........","........","........"]
    # build a crab/bat: use mirrored wings
    L=["........","...1....","..121...","1.1221..","12122.11" if frame==0 else "12122111","12222221","12332322","1.123222","..122322","..123.12","...1...1","........","........","........","........","........"]
    return mirror(L)
def explosion(f):
    px=[['.']*16 for _ in range(16)]
    r=[2.2,4.0,6.0,7.6][f]; r0=[0,0,1.8,4.0][f]
    for y in range(16):
        for x in range(16):
            d=math.hypot(x-7.5,y-7.5)
            if r0<=d<=r:
                t=(d-r0)/max(0.1,r-r0)
                c='1' if t<0.3 else '2' if t<0.55 else '3' if t<0.8 else '4'
                if random.random()<(0.15 if f>=2 else 0.0): c='.'
                px[y][x]=c
    return [''.join(r) for r in px]
def pix(rows,w=16,h=16):
    return [[0 if ch=='.' else int(ch) for ch in r.ljust(w,'.')] for r in rows]
sheet=[[0]*128 for _ in range(64)]    # 128 x 64 (16 tiles x 8 rows)
def blit(rows,tx,ty):
    p=pix(rows)
    for y in range(len(p)):
        for x in range(16): sheet[ty*8+y][tx*8+x]=p[y][x]
blit(shipA,0,0);blit(shipB,2,0)
blit(enemyA(0),4,0);blit(enemyA(1),6,0)
blit(enemyB(0),8,0);blit(enemyB(1),10,0)
for f in range(4): blit(explosion(f),12+f*0 if False else 12,0) if False else None
for f in range(4): blit(explosion(f),f*2,2)
# bullets (8x8) row 4
bul_player=["...11...","..1221..","..1221..","..1221..","..1331..","..1331..","...11...","........"]
bul_enemy=["........","..1111..",".122221.",".123321.",".123321.",".122221.","..1111..","........"]
spark=[".1....1.","..1..1..","...11...","1.1221.1","1.1221.1","...11...","..1..1..",".1....1."]
def blit8(rows,tx,ty):
    for y in range(8):
        for x in range(8):
            ch=rows[y][x]; sheet[ty*8+y][tx*8+x]=0 if ch=='.' else int(ch)
blit8(bul_player,0,4);blit8(bul_enemy,1,4);blit8(spark,2,4)
# the bullet palette is #3 (176): player bullet uses 1(white)/2(yellow)/3(orange); enemy bullet 4(red)/5/...  remap
for y in range(8):
    for x in range(8,16):
        v=sheet[4*8+y][x]
        sheet[4*8+y][x]={0:0,1:4,2:3,3:2}[v]    # enemy bullet: red outline, orange, yellow core
def sprite_bin():
    out=bytearray()
    for ty in range(8):
        for tx in range(16):
            out+=tile4([[sheet[ty*8+y][tx*8+x] for x in range(8)] for y in range(8)])
    return bytes(out)
# ------------------------------------------------------------------ backgrounds
BAYER=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]]
def nebula_tiles():
    tiles=[bytes(32)]
    for lvl in range(1,8):
        px=[[0]*8 for _ in range(8)]
        for y in range(8):
            for x in range(8):
                # dither between colour lvl-1 and lvl
                t=BAYER[y&3][x&3]
                px[y][x]=lvl if t<8 else max(lvl-1,0)
        tiles.append(tile4(px))
    return b''.join(tiles)
def star_tiles():
    tiles=[]
    for i in range(1,7):
        px=[[0]*8 for _ in range(8)]
        n=1 if i<4 else 2
        for k in range(n):
            px[random.randrange(8)][random.randrange(8)]=[1,2,3,2,4,5][i-1]
        tiles.append(tile4(px))
    return b''.join(tiles)
def build_bg_tiles():
    t=nebula_tiles()           # tiles 0..7
    t+=star_tiles()            # tiles 8..13
    return t
def noise_field(n=32):
    ph=[random.random()*6.28 for _ in range(6)]
    f=[[0]*n for _ in range(n)]
    for y in range(n):
        for x in range(n):
            v=0
            for k,(fx,fy) in enumerate([(1,1),(2,1),(1,2),(3,2),(2,3),(4,1)]):
                v+=math.sin(2*math.pi*(fx*x/n)+ph[k])*math.sin(2*math.pi*(fy*y/n)+ph[(k+2)%6])/(1+0.3*k)
            f[y][x]=v
    return f
nf=noise_field()
mn=min(min(r) for r in nf);mx=max(max(r) for r in nf)
def bg1_map():
    out=bytearray()
    for y in range(32):
        for x in range(32):
            v=(nf[y][x]-mn)/(mx-mn)
            lvl=max(0,min(7,int((v-0.45)*16)))
            out+=struct.pack('<H',lvl|(3<<10))
    return bytes(out)
def bg2_map():
    out=bytearray()
    for y in range(32):
        for x in range(32):
            t=0
            if random.random()<0.07: t=8+random.randrange(6)
            out+=struct.pack('<H',t|(2<<10))
    return bytes(out)
# ------------------------------------------------------------------ mode 7
def m7_tiles():
    t=[bytes(64)]
    def mk(f): return tile8([[f(x,y) for x in range(8)] for y in range(8)])
    t.append(mk(lambda x,y: 1 if (x>>2^y>>2)&1 else 2))     # 1 checker blue
    t.append(mk(lambda x,y: 3 if (x>>2^y>>2)&1 else 7))     # 2 checker gold
    t.append(mk(lambda x,y: 5 if (x in(0,7) or y in(0,7)) else 4))   # 3 border red/white
    t.append(mk(lambda x,y: 6 if (x==0 or y==0) else 7))   # 4 grid green
    return b''.join(bytes(64+b if b else 0 for b in x) if False else x for x in t)
def m7_tiles_pal():
    raw=m7_tiles()
    return bytes((64+b if b else 0) for b in raw)
# ------------------------------------------------------------------ tables
def hdma_gradient():
    # per-scanline COLDATA writes (mode 2: two writes): [0x20|R][0x80|B]; G constant via initial fixed colour
    out=bytearray()
    for y in range(224):
        t=y/223
        r=int(2+ 10*t**1.5); b=int(14-9*t)
        out+=bytes([1,0x20|r,0x80|b])
    out+=b'\x00'
    return bytes(out)
def m7_matrices():
    out=bytearray()
    for f in range(256):
        th=2*math.pi*f/256
        z=1.25+0.65*math.sin(2*math.pi*f/128)
        a=int(round(math.cos(th)/z*256)); b=int(round(math.sin(th)/z*256))
        out+=struct.pack('<hhhh',a,b,-b,a)
    return bytes(out)
def sine_table():
    return bytes((int(round(math.sin(2*math.pi*i/32)*6))&255) for i in range(32))
def m7_map():
    out=bytearray()
    for ty in range(128):
        for tx in range(128):
            if tx in (0,127) or ty in (0,127): t=3
            elif tx%16==0 or ty%16==0: t=4
            else: t=1+(((tx>>2)^(ty>>2))&1)
            out.append(t)
    return bytes(out)
open('m7map.bin','wb').write(m7_map())
# ------------------------------------------------------------------ write
open('font.bin','wb').write(font_tiles())
open('spr.bin','wb').write(sprite_bin())
open('bgtiles.bin','wb').write(build_bg_tiles())
open('bg1map.bin','wb').write(bg1_map())
open('bg2map.bin','wb').write(bg2_map())
open('pal.bin','wb').write(b''.join(struct.pack('<H',c) for c in pal))
open('m7tiles.bin','wb').write(m7_tiles_pal())
open('hdma.bin','wb').write(hdma_gradient())
open('m7mat.bin','wb').write(m7_matrices())
open('sine.bin','wb').write(sine_table())
# preview
def preview():
    W=16*8*4+16
    im=Image.new('RGB',(512,200),(20,20,30))
    def col(i): 
        c=pal[128+i]; return ((c&31)<<3,((c>>5)&31)<<3,((c>>10)&31)<<3)
    for y in range(64):
        for x in range(128):
            v=sheet[y][x]
            pb=0
            # palette per region: ship pal0, enemyA pal1, enemyB pal2, explosion/bullets pal3
            tx=x//8; ty=y//8
            if ty<2: pb=0 if tx<4 else (1 if tx<8 else 2)
            else: pb=3
            c=pal[128+pb*16+v]; 
            im.putpixel((x*3+0,y*3),(0,0,0))
            for dy in range(3):
                for dx in range(3):
                    im.putpixel((x*3+dx,y*3+dy),(((c&31)<<3),(((c>>5)&31)<<3),(((c>>10)&31)<<3)) if v else (20,20,30))
    im.save('preview_sprites.png')
preview()
print('ok')
