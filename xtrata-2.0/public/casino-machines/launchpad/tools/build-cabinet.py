#!/usr/bin/env python3
"""Build the Launchpad cabinet in ParallaX's packed buffer-geometry format.

This is an original Launchpad cabinet. DOG Army's source was unavailable;
the serialized format is taken from the supplied Forever Twins pack.
No Three.js or browser is needed to rebuild the cabinet.
"""
from __future__ import annotations

import base64
import io
import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / 'art' / 'cabinet'
ART.mkdir(parents=True, exist_ok=True)
GEOS, MATS, TEX = [], [], []
GCACHE, MCACHE = {}, {}

WHITE = '#e5e7df'
BRIGHT = '#fbfcf6'
ORANGE = '#f97316'
PALE = '#ffd5a1'
INK = '#101b22'
DARK = '#131d22'
STEEL = '#647078'
CYAN = '#8ce4de'
FONTDIR = Path('/usr/share/fonts/truetype/dejavu')


def font(size, bold=False, mono=False):
    name = 'DejaVuSansMono' if mono else 'DejaVuSans'
    name += '-Bold' if bold else ''
    return ImageFont.truetype(str(FONTDIR / (name + '.ttf')), size)


def txt(d, xy, s, size, fill, bold=False, mono=False, anchor='mm'):
    d.text(xy, s, fill=fill, font=font(size, bold, mono), anchor=anchor)


def spaced(d, xy, s, size, fill, tracking=7, bold=False):
    f = font(size, bold)
    ws = [d.textlength(c, font=f) for c in s]
    x, y = xy
    x -= (sum(ws) + tracking * (len(s)-1))/2
    for c, w in zip(s, ws):
        d.text((x, y), c, font=f, fill=fill, anchor='lm')
        x += w + tracking


def texture(name, size, draw):
    im = Image.new('RGBA', size, (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    draw(d, size[0], size[1])
    b = io.BytesIO()
    im.save(b, format='PNG', optimize=True)
    (ART / f'{name}.png').write_bytes(b.getvalue())
    idx = len(TEX)
    TEX.append(dict(image='data:image/png;base64,' + base64.b64encode(b.getvalue()).decode(),
                    wrapS=1001, wrapT=1001, repeat=[1, 1], offset=[0, 0], flipY=True))
    return idx


def mat(color, rough=.45, metal=.15, basic=False, emissive=None, opacity=1, tex=None, side=0):
    c = int(color.lstrip('#'), 16) if isinstance(color, str) else color
    e = int(emissive.lstrip('#'), 16) if isinstance(emissive, str) else emissive or 0
    m = dict(type='basic' if basic else 'standard', color=c, roughness=rough,
             metalness=metal, transparent=opacity < 1 or tex is not None,
             opacity=opacity, side=side, depthWrite=opacity == 1, alphaTest=.01 if tex is not None else 0,
             flatShading=False, map=tex, emissive=e, emissiveIntensity=.5)
    key = json.dumps(m, sort_keys=True)
    if key not in MCACHE:
        MCACHE[key] = len(MATS)
        MATS.append(m)
    return MCACHE[key]


def geo(key, vertices, normals, uvs):
    if key not in GCACHE:
        GCACHE[key] = len(GEOS)
        GEOS.append(dict(attributes={
            'position': dict(size=3, array=[round(v, 6) for v in vertices]),
            'normal': dict(size=3, array=[round(v, 6) for v in normals]),
            'uv': dict(size=2, array=[round(v, 6) for v in uvs])}, index=None, groups=[]))
    return GCACHE[key]


def tri(vs, normals=None, uv=None):
    p, n, u = [], [], []
    if normals is None:
        a, b, c = vs
        ab, ac = [b[i]-a[i] for i in range(3)], [c[i]-a[i] for i in range(3)]
        nn = [ab[1]*ac[2]-ab[2]*ac[1], ab[2]*ac[0]-ab[0]*ac[2], ab[0]*ac[1]-ab[1]*ac[0]]
        norm = math.sqrt(sum(x*x for x in nn)) or 1
        normals = [[x/norm for x in nn]] * 3
    for i, pt in enumerate(vs):
        p.extend(pt); n.extend(normals[i]); u.extend((uv or [(0, 0), (1, 0), (1, 1)])[i])
    return p, n, u


def builder(key):
    p, n, u = [], [], []
    def add(vs, ns=None, uv=None):
        a, b, c = tri(vs, ns, uv); p.extend(a); n.extend(b); u.extend(c)
    def end():
        return geo(key, p, n, u)
    return add, end


def cube_geo():
    if 'cube' in GCACHE: return GCACHE['cube']
    add, end = builder('cube')
    faces = [
        ([[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]],[0,0,1]),
        ([[.5,-.5,-.5],[-.5,-.5,-.5],[-.5,.5,-.5],[.5,.5,-.5]],[0,0,-1]),
        ([[.5,-.5,.5],[.5,-.5,-.5],[.5,.5,-.5],[.5,.5,.5]],[1,0,0]),
        ([[-.5,-.5,-.5],[-.5,-.5,.5],[-.5,.5,.5],[-.5,.5,-.5]],[-1,0,0]),
        ([[-.5,.5,.5],[.5,.5,.5],[.5,.5,-.5],[-.5,.5,-.5]],[0,1,0]),
        ([[-.5,-.5,-.5],[.5,-.5,-.5],[.5,-.5,.5],[-.5,-.5,.5]],[0,-1,0])]
    for v, nn in faces:
        add([v[0],v[1],v[2]], [nn]*3, [(0,0),(1,0),(1,1)])
        add([v[0],v[2],v[3]], [nn]*3, [(0,0),(1,1),(0,1)])
    return end()


def plane_geo():
    if 'plane' in GCACHE: return GCACHE['plane']
    add, end = builder('plane')
    a,b,c,d=[-.5,-.5,0],[.5,-.5,0],[.5,.5,0],[-.5,.5,0]
    add([a,b,c],[[0,0,1]]*3,[(0,0),(1,0),(1,1)])
    add([a,c,d],[[0,0,1]]*3,[(0,0),(1,1),(0,1)])
    return end()


def cylinder_geo(top=1, bottom=1, segments=24):
    key=f'cylinder-{top}-{bottom}-{segments}'
    if key in GCACHE:return GCACHE[key]
    add,end=builder(key)
    slope=bottom-top
    nl=math.sqrt(1+slope*slope)
    for i in range(segments):
        a,b=2*math.pi*i/segments,2*math.pi*(i+1)/segments
        ax,az,bx,bz=math.cos(a),math.sin(a),math.cos(b),math.sin(b)
        v0,v1,v2,v3=[ax*bottom,-.5,az*bottom],[ax*top,.5,az*top],[bx*top,.5,bz*top],[bx*bottom,-.5,bz*bottom]
        na,nb=[ax/nl,slope/nl,az/nl],[bx/nl,slope/nl,bz/nl]
        add([v0,v1,v2],[na,na,nb]);add([v0,v2,v3],[na,nb,nb])
        if top:add([[0,.5,0],v2,v1],[[0,1,0]]*3)
        if bottom:add([[0,-.5,0],v0,v3],[[0,-1,0]]*3)
    return end()


def bevel_geo(w,h,d,r=.04):
    """A chamfered box, with all front-facing edges catching the soft lights."""
    key=f'bevel-{w}-{h}-{d}-{r}'
    if key in GCACHE:return GCACHE[key]
    r=min(r,w/3,h/3,d/3)
    ring=[(-w/2+r,-h/2), (w/2-r,-h/2),(w/2,-h/2+r),(w/2,h/2-r),
          (w/2-r,h/2),(-w/2+r,h/2),(-w/2,h/2-r),(-w/2,-h/2+r)]
    add,end=builder(key)
    front=[(x*(w-2*r)/w,y*(h-2*r)/h,d/2) for x,y in ring]
    midfront=[(x,y,d/2-r) for x,y in ring]
    midback=[(x,y,-d/2+r) for x,y in ring]
    back=[(x*(w-2*r)/w,y*(h-2*r)/h,-d/2) for x,y in ring]
    for i in range(8):
        j=(i+1)%8
        add([(0,0,d/2),front[i],front[j]])
        add([(0,0,-d/2),back[j],back[i]])
        for a,b in [(front,midfront),(midfront,midback),(midback,back)]:
            add([a[i],b[i],b[j]]);add([a[i],b[j],a[j]])
    return end()


def quat(rx=0,ry=0,rz=0):
    cx,sx=math.cos(rx/2),math.sin(rx/2);cy,sy=math.cos(ry/2),math.sin(ry/2);cz,sz=math.cos(rz/2),math.sin(rz/2)
    return [sx*cy*cz+cx*sy*sz,cx*sy*cz-sx*cy*sz,cx*cy*sz+sx*sy*cz,cx*cy*cz-sx*sy*sz]


def node(parent, name='', p=(0,0,0), r=(0,0,0), s=(1,1,1), g=None, m=None, role='', action=None, ud=None):
    out=dict(p=list(p),q=quat(*r),s=list(s),visible=True,role=role, name=name, children=[])
    if g is not None:out.update(g=g,m=m)
    if action:out['action']=action
    out['userData']={**(ud or {})}
    if role:out['userData']['role']=role
    if action:out['userData']['pxMachineAction']=action;out['userData']['action']=action
    if parent is not None:parent['children'].append(out)
    return out


root=node(None,'Launchpad')


def box(parent,w,h,d,x,y,z,m,name='',bevel=0,role='',r=(0,0,0),action=None,ud=None):
    g=bevel_geo(w,h,d,bevel) if bevel else cube_geo()
    return node(parent,name,p=(x,y,z),r=r,s=(1,1,1) if bevel else (w,h,d),g=g,m=m,role=role,action=action,ud=ud)


def plane(parent,w,h,x,y,z,m,name='',role='',r=(0,0,0),action=None):
    return node(parent,name,p=(x,y,z),r=r,s=(w,h,1),g=plane_geo(),m=m,role=role,action=action)


def cyl(parent,rt,rb,h,x,y,z,m,name='',r=(0,0,0),role='',segments=24):
    base=max(rt,rb)
    return node(parent,name,p=(x,y,z),r=r,s=(base,h,base),g=cylinder_geo(rt/base,rb/base,segments),m=m,role=role)


def rod(parent,a,b,r,m,name=''):
    v=[b[i]-a[i] for i in range(3)];L=math.sqrt(sum(x*x for x in v))
    if L==0:return
    v=[x/L for x in v]
    # quaternion rotating the cylinder's +y axis onto the segment
    q=[v[2],0,-v[0],1+v[1]]
    qlen=math.sqrt(sum(x*x for x in q))
    q=[x/qlen for x in q] if qlen>1e-9 else [1,0,0,0]
    n=node(parent,name,p=[(a[i]+b[i])/2 for i in range(3)],s=(r,L,r),g=cylinder_geo(),m=m)
    n['q']=q
    return n


def label_mat(name,size,draw):return mat('#ffffff',basic=True,tex=texture(name,size,draw),side=2)


white=mat(WHITE,.3,.45)
bright=mat(BRIGHT,.28,.25)
steel=mat(STEEL,.25,.86)
chrome=mat('#b9c7c9',.15,.94)
orange=mat(ORANGE,.3,.3)
black=mat(DARK,.42,.5)
rubber=mat('#070c0e',.84,.05)
orangeglow=mat('#ff822b',basic=True)
warmglow=mat('#ffe2b8',basic=True)
cyanglow=mat(CYAN,basic=True)

# Heavy base, machined feet, orange light channel, and a quiet front plaque.
box(root,3.10,.18,1.64,0,.14,0,black,'base',bevel=.035)
box(root,2.98,.025,1.55,0,.244,0,orangeglow,'baseLight')
box(root,2.9,.105,1.47,0,.30,-.01,white,'baseRim',bevel=.025)
for x in [-1.17,1.17]:
    for z in [-.52,.52]:cyl(root,.13,.14,.12,x,.055,z,steel,'levellingFoot')

# Body and front portal. Orange uprights are structural steel gantry rails.
box(root,2.64,3.34,1.1,0,2.03,-.10,white,'mainCase',bevel=.06)
box(root,2.48,2.2,.07,0,2.7,.49,black,'missionPortal',bevel=.028)
for side in [-1,1]:
    x=side*1.40
    box(root,.16,3.67,.27,x,2.13,.38,orange,'gantryUpright',bevel=.018)
    box(root,.045,3.48,.032,x-side*.035,2.12,.53,warmglow,'railLighting')
    box(root,.17,3.67,.2,x,2.13,-.59,steel,'rearUpright',bevel=.018)
    for y in [.51,1.13,1.75,2.37,2.99,3.61]:
        # side outriggers and visible diagonal tension braces
        rod(root,(x,y,-.54),(x,y+.46,.33),.028,steel,'gantryBrace')
        rod(root,(x,y,.33),(x,y+.46,-.54),.028,steel,'gantryBrace')
        box(root,.23,.10,.12,x,y,.49,chrome,'railClamp',bevel=.012)
        cyl(root,.022,.022,.016,x,y,.56,black,'railBolt',r=(math.pi/2,0,0),segments=8)

# Actual screen surface. The host binds its canvas texture to this exact plane.
box(root,2.58,1.84,.14,0,2.81,.58,steel,'screenOuterBezel',bevel=.035)
box(root,2.50,1.76,.08,0,2.81,.677,rubber,'screenRubberGasket',bevel=.018)
for x in [-1.238,1.238]:box(root,.014,1.668,.012,x,2.81,.731,orangeglow,'screenSideLight')
box(root,2.4,.015,.012,0,3.646,.731,warmglow,'screenTopLight')
screen=plane(root,2.38,2.38*1920/2800,0,2.81,.776,mat('#071218',basic=True),'screenMesh',role='screenMesh')
for x in [-1.23,1.23]:
    for y in [2.015,3.605]:
        cyl(root,.025,.025,.018,x,y,.746,chrome,'bezelFastener',r=(math.pi/2,0,0),segments=12)
        box(root,.026,.003,.005,x,y,.758,black,'fastenerSlot')

# Small mission status plate above the screen, with non-numeric state labels.
def mission_label(d,w,h):
    d.rectangle((0,0,w,h),fill=DARK)
    txt(d,(34,h/2),'22',55,ORANGE,True,anchor='lm')
    spaced(d,(w/2,h/2),'MISSION CONTROL',24,WHITE,5,True)
    d.ellipse((w-95,33,w-80,48),fill=CYAN)
    txt(d,(w-30,h/2),'READY',15,CYAN,True,mono=True,anchor='rm')
plane(root,2.42,.19,0,3.78,.648,label_mat('mission-plate',(1300,94),mission_label),'missionPlate')

# Marquee and copper safety-stripe lip.
box(root,3.05,.49,1.21,0,4.10,-.02,black,'marqueeCase',bevel=.045)
box(root,3.10,.035,1.25,0,4.357,-.02,orangeglow,'marqueeTopLight')
box(root,3.10,.055,1.25,0,3.845,-.02,white,'marqueeLintel',bevel=.01)
def title_label(d,w,h):
    d.rectangle((0,0,w,h),fill=DARK)
    txt(d,(70,70),'PARALLAX / MISSION 022',24,'#c5c6bb',True,mono=True,anchor='lm')
    txt(d,(69,197),'LAUNCH',123,WHITE,True,anchor='lm')
    txt(d,(695,197),'PAD',123,ORANGE,True,anchor='lm')
    txt(d,(w-45,195),'STX.CITY\nFAKTORY',28,'#a3b8b7',True,mono=True,anchor='rm')
    d.line((70,285,w-60,285),fill=ORANGE,width=3)
    spaced(d,(w/2,328),'FROM CURVE TO POOL',26,WHITE,12,True)
plane(root,2.89,.437,0,4.102,.601,label_mat('launchpad-marquee',(1540,360),title_label),'launchpadWordmark')

# Jackpot and fund displays are real surface roles that the host updates.
box(root,2.85,.48,.46,0,4.62,-.02,steel,'telemetryHousing',bevel=.04)
def jackpot_label(d,w,h):
    d.rectangle((0,0,w,h),fill='#0b151b')
    spaced(d,(w/2,32),'CASINO JACKPOT',22,'#a4b8b9',4,True)
    txt(d,(w/2,91),'AWAITING ACCOUNT',38,PALE,True,mono=True)
def fund_label(d,w,h):
    d.rectangle((0,0,w,h),fill='#0b151b')
    txt(d,(w/2,24),'MACHINE FUND · ALL LIVE TWINS',18,'#b8c5c0',True,mono=True)
    txt(d,(w/2,57),'PERIOD / LAST PAY: CHECKING',18,CYAN,mono=True)
plane(root,2.67,.275,0,4.693,.217,label_mat('jackpot-display',(1300,135),jackpot_label),'jackpotMeter',role='jackpotMeter')
plane(root,2.67,.14,0,4.485,.219,label_mat('fund-display',(1300,80),fund_label),'fundMeter',role='fundMeter')

# Rocket topper on a restrained rotating platform. No ConeGeometry dependency.
cyl(root,.63,.68,.12,0,4.915,-.06,black,'rocketPad')
cyl(root,.64,.64,.018,0,4.987,-.06,orangeglow,'padLight')
crest=node(root,'crest',p=(0,5.0,-.06),role='crest',ud={'spinAxis':'y','rpm':.7,'winLift':.22})
cyl(crest,.19,.19,.62,0,.43,0,bright,'rocketBody',segments=40)
cyl(crest,.19,.20,.055,0,.16,0,orange,'rocketBand',segments=40)
cyl(crest,0,.19,.30,0,.89,0,orange,'rocketNose',segments=40)
cyl(crest,.12,.18,.14,0,.045,0,steel,'rocketNozzle',segments=24)
cyl(crest,.092,.105,.05,0,-.047,0,orangeglow,'rocketExhaust',role='rocketExhaust',segments=24)
for side in range(4):
    a=side*math.pi/2
    fin=node(crest,'rocketFin',r=(0,a,0))
    add,end=builder(f'fin-{side}')
    vs=[(.13,.28,-.025),(.37,.03,-.025),(.35,-.06,-.025),(.13,.03,-.025)]
    add([vs[0],vs[2],vs[1]]);add([vs[0],vs[3],vs[2]])
    vs2=[(x,y,.025) for x,y,z in vs]
    add([vs2[0],vs2[1],vs2[2]]);add([vs2[0],vs2[2],vs2[3]])
    for i in range(4):
        j=(i+1)%4;add([vs[i],vs[j],vs2[j]]);add([vs[i],vs2[j],vs2[i]])
    node(fin,g=end(),m=steel)
# Porthole, horizontal barrel rings, and tiny recovery panel on the rocket.
cyl(crest,.084,.084,.02,0,.52,.184,chrome,'rocketPortholeRim',r=(math.pi/2,0,0),segments=32)
cyl(crest,.062,.062,.023,0,.52,.199,mat('#102b39',.08,.55,emissive='#16424f'),'rocketPorthole',r=(math.pi/2,0,0),segments=32)
cyl(crest,.193,.193,.018,0,.70,0,steel,'rocketSeam',segments=40)
for x in [-.46,.46]:
    rod(root,(x,4.98,-.09),(x,5.30,-.09),.025,steel,'umbilicalTower')
    rod(root,(x,5.30,-.09),(x*.45,5.30,-.09),.016,orange,'umbilicalFeed')
    # Steam emitters are animated by the host; no baked cloud texture.
    node(root,f'steamEmitter{"L" if x<0 else "R"}',p=(x,5.05,.06),role='steamEmitter',ud={'particleCapReduced':0})

# Front control deck. The spin assembly moves together; other caps and faces share the deck axis.
deck=node(root,'controlDeck',p=(0,1.78,.72),r=(-.62,0,0),role='deck')
box(deck,2.66,.65,.21,0,0,0,steel,'deckBase',bevel=.04)
box(deck,2.58,.58,.035,0,0,.116,black,'deckFace',bevel=.011)
box(deck,2.66,.024,.025,0,-.304,.127,orangeglow,'deckFrontLight')
button_specs=[('CURVE','pays',-.997,.31,WHITE,INK),('−STX','betDown',-.61,.29,WHITE,INK),
              ('LAUNCH','spin',-.06,.68,ORANGE,'#ffffff'),('+STX','betUp',.50,.29,WHITE,INK),
              ('AUTO-APE','auto',.93,.40,WHITE,INK)]


def button(title,action,x,w,color,ink):
    role=f'btn-{action}'
    box(deck,w+.034,.28,.054,x,-.012,.149,rubber,f'{action}Recess',bevel=.016)
    parent=deck
    cap_x,cap_y,cap_z=x,-.012,.192
    if action=='spin':
        parent=node(deck,'spinPhysical',p=(cap_x,cap_y,cap_z),role='spinPhysical')
        cap_x=cap_y=cap_z=0
    cap=box(parent,w,.247,.07,cap_x,cap_y,cap_z,mat(color,.24,.27,emissive=ORANGE if action=='spin' else None),
            role,bevel=.018,role=role,action=action,ud={'restZ':cap_z,'travel':.035,'motionAxis':'z'})
    def draw(d,W,H):
        txt(d,(W/2,H/2),title,56 if action=='spin' else 43,ink,True)
    plane(parent,w-.028,.16,cap_x,cap_y,cap_z+.037,label_mat('button-'+action,(560,150),draw),f'{action}Label',
          role=f'btnface-{action}',action=action)
    return cap


for spec in button_specs:button(*spec)
def lab_label(d,w,h):txt(d,(w/2,h/2),'LAB',30,CYAN,True)
box(deck,.20,.09,.028,1.14,-.23,.153,black,'btn-lab',bevel=.008,role='btn-lab',action='lab',ud={'restZ':.153,'travel':.014})
plane(deck,.18,.065,1.14,-.23,.171,label_mat('button-lab',(200,70),lab_label),'labLabel',role='btnface-lab',action='lab')

def deck_serial(d,w,h):
    txt(d,(20,h/2),'ARM → LAUNCH',22,'#b2c8c7',True,mono=True,anchor='lm')
    txt(d,(w-15,h/2),'20 FIXED LINES · LAYR PLAY BALANCE',17,'#87999a',mono=True,anchor='rm')
plane(deck,2.18,.082,-.15,-.24,.142,label_mat('deck-serial',(1200,58),deck_serial),'deckLegend')

# Guarded launch-key lever, pivoted at the right-hand rail.
box(root,.39,.59,.38,1.66,1.79,.23,white,'armingBox',bevel=.04)
box(root,.33,.52,.025,1.66,1.79,.436,black,'armingPanel',bevel=.01)
def arm_label(d,w,h):
    txt(d,(w/2,28),'ARM',35,ORANGE,True)
    txt(d,(w/2,h-28),'PULL TO LAUNCH',12,WHITE,True,mono=True)
plane(root,.28,.47,1.66,1.79,.452,label_mat('arm-label',(240,380),arm_label),'armingLegend')
lever=node(root,'lever',p=(1.66,1.64,.49),role='lever',ud={'axis':'x','duration':900,'angle':1.05})
cyl(lever,.094,.094,.09,0,0,0,chrome,'leverAxle',r=(math.pi/2,0,0),segments=32)
rod(lever,(0,0,.05),(0,.35,.065),.025,steel,'leverStem')
cyl(lever,.07,.07,.27,0,.35,.065,orange,'launchKeyGrip',r=(0,0,math.pi/2),segments=24)
for x in [-.13,.13]:cyl(lever,.074,.074,.022,x,.35,.065,black,'gripEnd',r=(0,0,math.pi/2),segments=24)
cover=node(root,'launchCover',p=(1.66,2.06,.47),r=(-1.0,0,0),role='launchCover',ud={'hingeAxis':'x','openAngle':-1.85})
box(cover,.31,.36,.025,0,-.17,0,mat('#ffab57',.18,.10,opacity=.45),'safetyCover',bevel=.008)
for x in [-.16,.16]:box(cover,.018,.36,.052,x,-.17,0,orange,'coverEdge',bevel=.004)
cyl(root,.025,.025,.36,1.66,2.06,.47,chrome,'coverHinge',r=(0,0,math.pi/2),segments=16)

# Lower door, ticket port, stencils, and visible ventilation behind slats.
box(root,2.34,1.19,.06,0,.985,.488,steel,'doorFrame',bevel=.025)
box(root,2.25,1.10,.045,0,.985,.532,bright,'lowerDoor',bevel=.018)
def door_label(d,w,h):
    txt(d,(55,80),'FROM CURVE',57,INK,True,anchor='lm')
    txt(d,(55,147),'TO POOL',57,ORANGE,True,anchor='lm')
    d.line((55,196,w-55,196),fill='#a6afac',width=2)
    txt(d,(55,h-48),'LAUNCHPAD / STX NETWORK',20,INK,True,mono=True,anchor='lm')
    txt(d,(w-55,h-48),'022',34,INK,True,mono=True,anchor='rm')
plane(root,2.12,.50,0,1.19,.560,label_mat('door-stencil',(1300,310),door_label),'doorStencil')
box(root,.82,.14,.04,-.47,.695,.567,black,'souvenirTicketSlot',bevel=.018)
box(root,.66,.014,.01,-.47,.711,.594,orangeglow,'ticketSlotLight')
def ticket_label(d,w,h):
    txt(d,(w/2,h/2),'SOUVENIR / FLIGHT RECORD',21,INK,True,mono=True)
plane(root,.9,.075,-.47,.579,.573,label_mat('ticket-caption',(650,55),ticket_label),'ticketLabel')
# Engraved warning stencil and an accessible panel latch.
def caution(d,w,h):
    d.rectangle((0,0,w,h),fill=ORANGE)
    txt(d,(w/2,h/2),'CAUTION / ARM BEFORE LAUNCH',23,INK,True,mono=True)
plane(root,1.84,.075,0,1.571,.557,label_mat('warning-stencil',(1100,60),caution),'warningStencil')
cyl(root,.049,.049,.03,1.02,.96,.573,steel,'doorLatch',r=(math.pi/2,0,0),segments=24)
box(root,.038,.006,.009,1.02,.96,.592,black,'keyhole')
for x in [-1.055,1.055]:
    for y in [.48,1.49]:cyl(root,.019,.019,.017,x,y,.571,steel,'doorFastener',r=(math.pi/2,0,0),segments=8)
for side in [-1,1]:
    box(root,.18,.72,.045,side*1.205,.87,.50,rubber,'ventBacking')
    box(root,.13,.63,.012,side*1.205,.87,.526,orangeglow,'ventInteriorGlow')
    for i in range(9):box(root,.19,.037,.048,side*1.205,.575+i*.075,.550,steel,'ventLouvre',r=(-.25,0,0))

# The exact supplied XLOGO paths, made into vector geometry, never an image.
# Coordinates and gradients are the XLOGO code copied from the Forever Twins
# engine page; stroke geometry follows those source vertices without redesign.
outer=[[31,244],[229,244],[405,439],[227,634],[31,634],[100,559],[196,559],[304,438],[197,320],[100,320]]
inner=[[120,320],[197,320],[304,438],[196,559],[120,559],[221,439]]
paths={
    'blue':[outer,inner,[[851-x,y] for x,y in outer],[[851-x,y] for x,y in inner]],
    'orange':[[[24,691],[250,691],[425.5,500],[601,691],[827,691],[827,784],[563,784],[425.5,635],[288,784],[24,784]]],
    'white':[[[24,70],[290,70],[425.5,218],[561,70],[827,70],[827,186],[606,186],[425.5,382],[245,186],[24,186]]],
    'whiteOpen':[[[24,112],[273,112],[425.5,276],[578,112],[827,112]]],
    'depth':[[[38,192],[68,238]],[[813,192],[783,238]],[[38,683],[68,640]],[[813,683],[783,640]]]
}
mark=node(root,'XLOGO',p=(.65,.737,.592),ud={'source':'XLOGO exact 851-unit source paths','vector':True})
size=.43
gradients={'blue':(['#6593cf','#4675b6','#315c95'],240,640),
           'orange':(['#f2aa5a','#e28c3b','#c9762c'],495,790),
           'white':(['#ffffff','#e2e3e1','#b9bbb8'],64,392)}


def grad_color(k,y):
    cols,lo,hi=gradients['white' if k=='whiteOpen' else k]
    t=max(0,min(1,(y-lo)/(hi-lo)))
    i=0 if t<.5 else 1
    f=t*2 if i==0 else (t-.5)*2
    a=[int(cols[i][j:j+2],16) for j in (1,3,5)];b=[int(cols[i+1][j:j+2],16) for j in (1,3,5)]
    return '#'+''.join(f'{round(a[j]*(1-f)+b[j]*f):02x}' for j in range(3))


for kind,ps in paths.items():
    for poly in ps:
        closed=kind not in ('whiteOpen','depth')
        pairs=list(zip(poly,poly[1:]+poly[:1])) if closed else list(zip(poly,poly[1:]))
        for a,b in pairs:
            A=((a[0]-425.5)/851*size,(425.5-a[1])/851*size,0)
            B=((b[0]-425.5)/851*size,(425.5-b[1])/851*size,0)
            color='#2b4a78' if kind=='depth' else grad_color(kind,(a[1]+b[1])/2)
            rod(mark,A,B,(3 if kind=='depth' else 6.5)/851*size,mat(color,.32,.3,basic=True),'xlogoVectorStroke')

# Side panels carry actual recorded buy prices. These are historic execution
# records, not a fabricated rising curve or a current market quotation.
snapshot = json.loads((ART / 'side-chart-snapshot.json').read_text())
def side_label(d,w,h):
    d.rectangle((0,0,w,h),fill=INK)
    txt(d,(w/2,70),'LAUNCHPAD',48,WHITE,True)
    spaced(d,(w/2,130),'CAPY / STX.CITY',19,ORANGE,3,True)
    txt(d,(w/2,185),'HISTORIC EXECUTION PRICES',17,'#a6b9b8',True,mono=True)
    x0,x1,y0,y1=100,w-47,265,h-270
    prices=[p['price'] for p in snapshot['points']]
    low,high=.00050,.00070
    for j in range(5):
        y=y0+(y1-y0)*j/4;v=high-(high-low)*j/4
        d.line((x0,y,x1,y),fill='#29434c',width=2)
        txt(d,(x0-12,y),f'{v:.5f}',15,'#8aa4aa',mono=True,anchor='rm')
    for j in range(len(prices)):
        x=x0+(x1-x0)*j/(len(prices)-1);d.line((x,y0,x,y1),fill='#223740',width=2)
    pts=[(x0+i*(x1-x0)/(len(prices)-1),y1-(p-low)/(high-low)*(y1-y0)) for i,p in enumerate(prices)]
    d.line(pts,fill=ORANGE,width=7)
    for x,y in pts:d.ellipse((x-7,y-7,x+7,y+7),fill=WHITE)
    txt(d,(w/2,y1+35),'7 OBSERVED BUYS / OLDEST → NEWEST',15,'#b8c6c6',mono=True)
    txt(d,(w/2,y1+65),'STX PER CAPY · INCLUDING FEE',15,'#b8c6c6',mono=True)
    d.line((42,h-158,w-42,h-158),fill='#38515a',width=2)
    txt(d,(w/2,h-126),'JAN–FEB 2025 RECORDS',20,PALE,True,mono=True)
    txt(d,(w/2,h-88),'SNAPSHOT 03 NOV 2026',18,CYAN,True,mono=True)
    txt(d,(w/2,h-46),'NOT A LIVE QUOTE · PARTIAL HISTORY',13,'#a6b9b8',mono=True)
sideMat=label_mat('side-curve-snapshot',(560,1150),side_label)
for side in [-1,1]:
    plane(root,.87,2.38,side*1.334,2.39,-.12,sideMat,'sideCurve',r=(0,side*math.pi/2,0))
    # Visible flexible conduit along the aft outside corner.
    pts=[(side*1.43,.52,-.60),(side*1.55,.75,-.65),(side*1.54,1.58,-.64),
         (side*1.47,2.00,-.64),(side*1.47,2.85,-.64),(side*1.37,3.17,-.60)]
    for a,b in zip(pts,pts[1:]):rod(root,a,b,.037,rubber,'umbilicalCable')
    for y in [.85,1.38,1.92,2.48,2.93]:
        box(root,.16,.035,.08,side*1.46,y,-.62,orange,'cableTie')

# The legacy software renderer sorts whole meshes by their origins, so a
# left-hand cap can otherwise be painted under the deck's large front plane.
# A small painter bias preserves physical surfaces without altering WebGL.
def software_layers(n, parent_role=''):
    role=n.get('role','');name=n.get('name','')
    if role.startswith('btn-'):
        n['userData']['softwareLayer']=1.2
    elif role.startswith('btnface-'):
        n['userData']['softwareLayer']=1.5
    elif name.endswith('Recess'):
        n['userData']['softwareLayer']=.9
    elif name in ['souvenirTicketSlot','ticketSlotLight','ticketLabel','doorLatch','keyhole','doorFastener']:
        n['userData']['softwareLayer']=1.3
    for c in n['children']:software_layers(c,role)
software_layers(root)

model=dict(root=root,geometries=GEOS,materials=MATS,textures=TEX)
(ROOT/'src'/'cabinet.json').write_text(json.dumps(model,separators=(',',':')))
meta={
    'format':'ParallaX packed root/geometries/materials/textures',
    'frontAxis':'+z','upAxis':'+y','nominalHeight':6.04,
    'screen':{'name':'screenMesh','role':'screenMesh','center':[0,2.81,.776],'width':2.38,'height':2.38*1920/2800,'bezelAllowance':.13},
    'deck':{'center':[0,1.78,.72],'rotationX':-.62,'width':2.66,'height':.65,'capAxis':'local z','travel':.035},
    'lever':{'name':'lever','axis':'x','baseRotation':0,'angle':1.05,'pivot':[1.66,1.64,.49]},
    'crest':{'name':'crest','axis':'y','position':[0,5.0,-.06],'rpm':.7,'winLift':.22},
    'labels':{'pays':'CURVE','betDown':'−STX','spin':'LAUNCH','betUp':'+STX','auto':'AUTO-APE','lab':'LAB'},
    'dynamicSurfaces':['jackpotMeter','fundMeter'],'sourceNotes':[
      'Cabinet is new, reference format from verified Forever Twins pack; DOG Army source unavailable.',
      'Xtrata mark is 3D vector geometry from exact supplied XLOGO path coordinates and colors.',
      'Side panels plot seven real historic CAPY execution prices (Jan–Feb 2025), with a 3 Nov 2026 snapshot label and partial-history/live-quote limits.',
      'Lettered project names are plain type, not imitated project logos.'
    ],
    'counts':{'geometries':len(GEOS),'materials':len(MATS),'textures':len(TEX)}
}
(ROOT/'src'/'cabinet-meta.json').write_text(json.dumps(meta,indent=2))
print(json.dumps({'written':str(ROOT/'src'/'cabinet.json'),'bytes':(ROOT/'src'/'cabinet.json').stat().st_size,**meta['counts']}))
