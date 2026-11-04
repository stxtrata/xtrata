#!/usr/bin/env python3
"""The Club X cabinet model builder.

Writes club-x-model.json in the packed-cabinet format the ParallaX Casino room loads ({root, geometries, materials, textures}).
Rerunnable; needs numpy (and CairoSVG or node+sharp for textures.py, no browser).
A warehouse-rave cabinet: corrugated steel flyposted with original club flyers, a screen framed as a warehouse doorway, a
fire-door push bar mounted as the lever, a mirror-tiled X turning like a disco ball on the roof, green lasers and haze.
Named parts the room expects: screenMesh, crest (the mirror X; turns), spinPhysical, lever (pivots on rotation.x) and deck
buttons with userData actions spin, betUp, betDown, auto, pays. Extra roles the test page animates (the room may ignore them):
flapBoard (the topper sign, which a host can map to the game's live topper canvas), lasers (the beams; sweep), haze (smoke
layers at the base) and leds (acid-yellow strip lights that pulse with each spin).
Geometry helpers (rbox, cyl, torus, plane, disc, Scene, node) follow tools/who-is-satoshi/model/build_model.py.
"""
import gzip, json, math, os
import numpy as np
from textures import render_all

HERE = os.path.dirname(os.path.abspath(__file__))
# ------------------------------------------------------------------ geometry helpers
def _pack(pos, nrm, uv, idx):
    return {'attributes': {'position': {'size': 3, 'array': np.round(np.asarray(pos, float), 4).ravel().tolist()},
                           'normal': {'size': 3, 'array': np.round(np.asarray(nrm, float), 3).ravel().tolist()},
                           'uv': {'size': 2, 'array': np.round(np.asarray(uv, float), 4).ravel().tolist()}},
            'index': [int(i) for i in np.asarray(idx).ravel()], 'groups': []}


def rbox(w, h, d, r=0.0):
    half = np.array([w, h, d]) / 2
    r = min(r, *(half * .98))
    faces = [((0, 0, 1), (1, 0, 0), (0, 1, 0)), ((0, 0, -1), (-1, 0, 0), (0, 1, 0)),
             ((1, 0, 0), (0, 0, -1), (0, 1, 0)), ((-1, 0, 0), (0, 0, 1), (0, 1, 0)),
             ((0, 1, 0), (1, 0, 0), (0, 0, -1)), ((0, -1, 0), (1, 0, 0), (0, 0, 1))]
    P, N, U, I = [], [], [], []
    for n, ud, vd in faces:
        n, ud, vd = map(np.array, (n, ud, vd))

        def coords(axis_half, axis_inner):
            if r <= 0: return [-axis_half, axis_half]
            return [-axis_half, -(axis_inner + .41 * r), -axis_inner, axis_inner, axis_inner + .41 * r, axis_half]
        iu = abs(np.dot(ud, half)); iv = abs(np.dot(vd, half))
        cu = coords(iu, iu - r); cv = coords(iv, iv - r)
        base = len(P)
        for j, tv in enumerate(cv):
            for i, tu in enumerate(cu):
                pos = n * abs(np.dot(n, half)) + ud * tu + vd * tv
                nn = n.astype(float)
                if r > 0:
                    inner = half - r; c = np.clip(pos, -inner, inner); dv = pos - c; l = np.linalg.norm(dv)
                    if l > 1e-9: nn = dv / l; pos = c + nn * r
                P.append(pos); N.append(nn); U.append(((tu + iu) / (2 * iu), (tv + iv) / (2 * iv)))
        nu = len(cu)
        for j in range(len(cv) - 1):
            for i in range(nu - 1):
                a = base + j * nu + i; I += [a, a + 1, a + nu + 1, a, a + nu + 1, a + nu]
    return _pack(P, N, U, I)


def _orient(axis, P, N):
    P = np.asarray(P, float); N = np.asarray(N, float)
    if axis == 'y': return P, N
    if axis == 'z': f = lambda v: np.stack([v[:, 0], -v[:, 2], v[:, 1]], 1)
    else: f = lambda v: np.stack([v[:, 1], -v[:, 0], v[:, 2]], 1)
    return f(P), f(N)


def cyl(rt, rb, h, seg=32, axis='y', caps=True, arc=1.0):
    P, N, U, I = [], [], [], []
    slope = (rb - rt) / h
    for k in range(seg + 1):
        t = k / seg; a = t * 2 * math.pi * arc; c, s = math.cos(a), math.sin(a)
        nn = np.array([c, slope, s]); nn /= np.linalg.norm(nn)
        P.append((rt * c, h / 2, rt * s)); N.append(nn); U.append((t, 1))
        P.append((rb * c, -h / 2, rb * s)); N.append(nn); U.append((t, 0))
    for k in range(seg):
        a = 2 * k; I += [a, a + 2, a + 1, a + 1, a + 2, a + 3]
    if caps and arc >= 1:
        for top, rad in ((True, rt), (False, rb)):
            if rad <= 0: continue
            base = len(P); y = h / 2 if top else -h / 2; ny = 1 if top else -1
            P.append((0, y, 0)); N.append((0, ny, 0)); U.append((.5, .5))
            for k in range(seg + 1):
                a = k / seg * 2 * math.pi; P.append((rad * math.cos(a), y, rad * math.sin(a))); N.append((0, ny, 0)); U.append((.5 + .5 * math.cos(a), .5 + .5 * math.sin(a)))
            for k in range(seg):
                I += [base, base + 1 + k + (0 if top else 1), base + 1 + k + (1 if top else 0)]
    P, N = _orient(axis, P, N)
    return _pack(P, N, U, I)


def _fix_winding(g):
    pos = np.array(g['attributes']['position']['array']).reshape(-1, 3); nrm = np.array(g['attributes']['normal']['array']).reshape(-1, 3); idx = np.array(g['index']).reshape(-1, 3)
    a, b, c = pos[idx[:, 0]], pos[idx[:, 1]], pos[idx[:, 2]]
    fn = np.cross(b - a, c - a); vn = nrm[idx[:, 0]] + nrm[idx[:, 1]] + nrm[idx[:, 2]]
    flip = (fn * vn).sum(1) < 0
    idx[flip] = idx[flip][:, [0, 2, 1]]
    g['index'] = [int(i) for i in idx.ravel()]
    return g


def torus(R, r, seg=32, tube=8, axis='y'):
    P, N, U, I = [], [], [], []
    for j in range(tube + 1):
        v = j / tube * 2 * math.pi
        for i in range(seg + 1):
            u = i / seg * 2 * math.pi
            cx, cz = math.cos(u), math.sin(u)
            P.append(((R + r * math.cos(v)) * cx, r * math.sin(v), (R + r * math.cos(v)) * cz))
            N.append((math.cos(v) * cx, math.sin(v), math.cos(v) * cz)); U.append((i / seg, j / tube))
    for j in range(tube):
        for i in range(seg):
            a = j * (seg + 1) + i; b = a + seg + 1; I += [a, a + 1, b + 1, a, b + 1, b]
    P2, N2 = _orient(axis, P, N)
    return _fix_winding(_pack(P2, N2, U, I))


def plane(w, h, umax=1.0, vmax=1.0):
    return _pack([(-w / 2, -h / 2, 0), (w / 2, -h / 2, 0), (w / 2, h / 2, 0), (-w / 2, h / 2, 0)], [(0, 0, 1)] * 4, [(0, 0), (umax, 0), (umax, vmax), (0, vmax)], [0, 1, 2, 0, 2, 3])


def disc(r, seg=40):
    P = [(0, 0, 0)]; U = [(.5, .5)]
    for k in range(seg + 1):
        a = k / seg * 2 * math.pi; P.append((r * math.cos(a), r * math.sin(a), 0)); U.append((.5 + .5 * math.cos(a), .5 + .5 * math.sin(a)))
    I = []
    for k in range(seg): I += [0, 1 + k, 2 + k]
    return _pack(P, [(0, 0, 1)] * len(P), U, I)


def curved(w, h, bulge, nx=28, ny=20):
    P, N, U, I = [], [], [], []
    for j in range(ny + 1):
        for i in range(nx + 1):
            u, v = i / nx, j / ny; x, y = (u - .5) * w, (v - .5) * h
            z = bulge * math.cos(math.pi * x / w) * math.cos(math.pi * y / h)
            dzx = -bulge * (math.pi / w) * math.sin(math.pi * x / w) * math.cos(math.pi * y / h)
            dzy = -bulge * (math.pi / h) * math.cos(math.pi * x / w) * math.sin(math.pi * y / h)
            n = np.array([-dzx, -dzy, 1.0]); n /= np.linalg.norm(n)
            P.append((x, y, z)); N.append(n); U.append((u, v))
    for j in range(ny):
        for i in range(nx):
            a = j * (nx + 1) + i; I += [a, a + 1, a + nx + 2, a, a + nx + 2, a + nx + 1]
    return _pack(P, N, U, I)


class Scene:
    def __init__(self):
        self.geos, self.gkey, self.mats, self.mkey, self.texs = [], {}, [], {}, []

    def geo(self, key, make):
        if key not in self.gkey: self.gkey[key] = len(self.geos); self.geos.append(make())
        return self.gkey[key]

    def mat(self, typ='standard', color=0xffffff, rough=.5, metal=0., map=None, transparent=False, opacity=1., side=0, depthWrite=True, alphaTest=0., emissive=0, ei=1.):
        k = (typ, color, rough, metal, map, transparent, opacity, side, depthWrite, alphaTest, emissive, ei)
        if k not in self.mkey:
            self.mkey[k] = len(self.mats)
            self.mats.append({'type': typ, 'color': color, 'roughness': rough, 'metalness': metal, 'transparent': transparent, 'opacity': opacity, 'side': side,
                              'depthWrite': depthWrite, 'alphaTest': alphaTest, 'flatShading': False, 'map': map, 'emissive': emissive, 'emissiveIntensity': ei})
        return self.mkey[k]

    def tex(self, image, wrapS=1001, wrapT=1001, repeat=(1, 1)):
        self.texs.append({'image': image, 'wrapS': wrapS, 'wrapT': wrapT, 'repeat': list(repeat), 'offset': [0, 0], 'flipY': True}); return len(self.texs) - 1


def node(p=(0, 0, 0), q=(0, 0, 0, 1), s=(1, 1, 1), g=None, m=None, role='', action=None, children=None, visible=True):
    n = {'p': [round(float(x), 4) for x in p], 'q': [round(float(x), 5) for x in q], 's': list(s), 'visible': visible, 'role': role, 'children': children if children is not None else []}
    if g is not None: n['g'] = g; n['m'] = m
    if action: n['action'] = action
    return n


def qaxis(axis, deg):
    a = math.radians(deg) / 2; s = math.sin(a); v = {'x': (s, 0, 0), 'y': (0, s, 0), 'z': (0, 0, s)}[axis]
    return (*v, math.cos(a))



def qmul(a, b):
    x1, y1, z1, w1 = a; x2, y2, z2, w2 = b
    return (w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2, w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2, w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2, w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2)


def tiled(g, tile):
    """Re-map a box's UVs to world metres / tile so a repeating texture keeps its scale on any face (dominant-axis projection)."""
    pos = np.array(g['attributes']['position']['array']).reshape(-1, 3); nrm = np.array(g['attributes']['normal']['array']).reshape(-1, 3)
    uv = np.zeros((len(pos), 2))
    for i, (p, n) in enumerate(zip(pos, nrm)):
        a = np.argmax(np.abs(n))
        uv[i] = (p[2], p[1]) if a == 0 else (p[0], p[2]) if a == 1 else (p[0], p[1])
    g['attributes']['uv']['array'] = np.round(uv / tile, 4).ravel().tolist()
    return g


# ------------------------------------------------------------------ build
def build():
    T = render_all()
    S = Scene(); tx = {}

    def T_(name, **kw):
        if name not in tx: tx[name] = S.tex(T[name]['url'], **kw)
        return tx[name]
    for n in ('corr', 'corrDark', 'steel', 'mirror'): T_(n, wrapS=1000, wrapT=1000)
    # materials: corrugated warehouse steel, black steel, acid-yellow tube light, mirror tiles, laser green
    corr = S.mat('standard', 0xd0d6dc, .72, .35, map=tx['corr']); corrDark = S.mat('standard', 0xc6ccd2, .76, .3, map=tx['corrDark'])
    steelM = S.mat('standard', 0xb8bec6, .42, .75, map=tx['steel']); black = S.mat('standard', 0x111316, .5, .6); gun = S.mat('standard', 0x3b4047, .35, .85)
    chrome = S.mat('standard', 0xcdd0d6, .16, .95); acid = S.mat('standard', 0xe6ff00, .45, .15, emissive=0x2a3000, ei=.7)
    acidBtn = S.mat('standard', 0xe6ff00, .4, .2, emissive=0x3a4400, ei=.8)
    mirror = S.mat('standard', 0xffffff, .22, .45, map=tx['mirror'], emissive=0x2c3444, ei=1.0)
    led = S.mat('basic', 0xe6ff00); glowStrip = S.mat('basic', 0xe6ff00); slotdark = S.mat('basic', 0x030304)
    beamM = S.mat('basic', 0xffffff, map=T_('beam'), transparent=True, depthWrite=False, side=2)
    hazeM = [S.mat('basic', 0xffffff, map=T_('haze'), transparent=True, opacity=o, depthWrite=False, side=2) for o in (.5, .34, .24, .16)]
    glass = S.mat('basic', 0xffffff, map=T_('glass'), transparent=True, depthWrite=False)
    R = []; add = R.append

    def box(w, h, d, p, m, r=0.0, parent=None, action=None, role='', q=(0, 0, 0, 1), tile=0):
        n = node(p, q=q, g=S.geo(('b', w, h, d, r, tile), (lambda: tiled(rbox(w, h, d, r), tile)) if tile else (lambda: rbox(w, h, d, r))), m=m, action=action, role=role); (parent if parent is not None else R).append(n); return n

    def pl(w, h, p, m, q=(0, 0, 0, 1), role='', parent=None, umax=1.0, vmax=1.0, key=''):
        n = node(p, q=q, g=S.geo(('pl', w, h, umax, vmax, key), lambda: plane(w, h, umax, vmax)), m=m, role=role); (parent if parent is not None else R).append(n); return n
    tm = lambda name, **kw: S.mat('basic', 0xffffff, map=T_(name), **kw)

    # --- plinth: black steel, hazard chevrons along the front, an acid floor-glow strip
    box(3.0, .24, 1.5, (0, .12, 0), black, .03)
    box(2.94, .02, 1.46, (0, .012, 0), glowStrip)
    pl(2.94, .14, (0, .13, .7515), tm('hazard'), key='hz')
    # --- lower body: corrugated steel, a bolted steel door with a chalk X and THIS IS NUMBER ONE, the Xtrata mark
    box(2.5, 1.52, 1.15, (0, 1.0, 0), corr, .02, tile=.4)
    box(1.98, 1.22, .05, (0, 1.0, .585), black, .01)
    pl(1.9, 1.9 * 620 / 1024, (0, 1.0, .612), tm('door'), key='door')
    for x, lab in ((.62, 'ticket'), (-.62, 'coin')):  # souvenir ticket slot (right) and LAYR coin slot (left)
        box(.58, .1, .04, (x, .31, .59), gun, .015); box(.46, .045, .05, (x, .31, .6), slotdark, .01)
        pl(.36, .36 * 96 / 512, (x, .405, .5765), tm(lab), key=lab)
    box(2.56, .08, 1.2, (0, 1.8, .02), gun, .02)

    # --- upper housing: dark corrugated steel; the screen sits in a warehouse doorway (steel frame, brick reveal, lintel with a chalk X)
    box(2.5, 2.15, .98, (0, 2.925, -.04), corrDark, .02, tile=.4)
    box(2.3, 1.98, .06, (0, 2.99, .46), black, .015)
    pl(2.2, 1.9, (0, 2.99, .4955), tm('bezel'), key='bezel')
    add(node((0, 2.85, .505), g=S.geo(('pl', 1.92, 1.32, 'screen'), lambda: plane(1.92, 1.32)), m=S.mat('basic', 0xffffff, map=T_('screen')), role='screenMesh'))
    add(node((0, 2.85, .512), g=S.geo(('pl', 1.92, 1.32, 'glass'), lambda: plane(1.92, 1.32)), m=glass))
    for sx in (-1, 1):  # steel door hinges / corner brackets
        for sy in (-1, 1): box(.14, .14, .04, (sx * 1.09, 2.85 + sy * .8, .5), gun, .01)
    box(1.92, .025, .02, (0, 3.525, .514), led, .006, role='leds')  # acid tube along the top edge of the opening

    # --- marquee: black steel, CLUB X in acid neon tube, the casino wordmark small at its foot
    box(3.62, .55, 1.24, (0, 4.275, 0), black, .03); box(3.66, .04, 1.26, (0, 4.565, 0), gun, .01); box(3.66, .04, 1.26, (0, 3.99, 0), gun, .01)
    pl(3.4, 3.4 * 300 / 2048, (0, 4.275, .6225), tm('header'), key='hdr')

    # --- side towers: flyposted corrugated steel, speaker woofers, acid strip lights pulsing with each spin
    def woofer(r, p, q=(0, 0, 0, 1)):
        add(node(p, q=q, children=[node((0, 0, -.01), g=S.geo(('cy', r + .03, r + .03, .03, 'z'), lambda: cyl(r + .03, r + .03, .03, 40, 'z')), m=black),
                                   node((0, 0, .008), g=S.geo(('di', r, 'wf'), lambda: disc(r, 40)), m=tm('woofer'))]))
    for sx in (-1, 1):
        x = sx * 1.53
        box(.56, 3.78, 1.12, (x, 2.11, 0), corrDark, .02, tile=.4)
        box(.62, .06, 1.18, (x, .25, 0), gun, .02); box(.62, .06, 1.18, (x, 4.0, 0), gun, .02)
        woofer(.21, (x, .78, .565)); woofer(.12, (x, 3.58, .565))
        pl(.46, .46 * 1536 / 384, (x, 2.1, .5625), tm('flyerFrontL' if sx < 0 else 'flyerFrontR'), key='ff%d' % sx)
        box(.035, 3.0, .02, (x - sx * .26, 2.1, .575), led, .005, role='leds')  # acid strip on the inner edge, clear of the flyers
        xo = sx * 1.812; q = qaxis('y', 90 * sx)
        pl(.96, .96 * 1920 / 768, (xo + sx * .001, 2.4, 0), tm('flyerSideL' if sx < 0 else 'flyerSideR'), q=q, key='fs%d' % sx)
        box(.02, 2.9, .04, (xo + sx * .012, 2.4, .5), led, .005, role='leds')

    # --- topper: the sign (flapBoard) on a black plinth, and above it the mirror-tiled X that turns like a disco ball (role crest)
    box(1.9, .12, .7, (0, 4.645, 0), black, .02); box(1.7, .02, .6, (0, 4.715, 0), gun, .005)
    add(node((0, 4.84, 0), g=S.geo(('cy', .06, .06, .26), lambda: cyl(.06, .06, .26, 20)), m=chrome))  # the axle post
    box(1.62, .5, .22, (0, 4.99, 0), black, .02); box(1.66, .54, .18, (0, 4.99, -.01), gun, .02)
    pl(1.52, 1.52 * 320 / 1024, (0, 4.99, .1115), tm('flap'), role='flapBoard', key='flapF')
    pl(1.52, 1.52 * 320 / 1024, (0, 4.99, -.1115), tm('flap'), q=qaxis('y', 180), key='flapB')
    X = []
    for sgn in (-1, 1):  # two mirror-tiled bars crossed at 45 degrees; deep enough that the X is solid as it turns
        X.append(node((0, 0, 0), q=qaxis('z', 45 * sgn), g=S.geo(('b', 1.5, .3, .3, .03, .34), lambda: tiled(rbox(1.5, .3, .3, .03), .34)), m=mirror))
    for sx in (-1, 1):
        for sy in (-1, 1): X.append(node((sx * .54, sy * .54, 0), g=S.geo(('b', .12, .12, .12, .02), lambda: rbox(.12, .12, .12, .02)), m=acid, role='leds'))
    X.append(node((0, 0, 0), g=S.geo(('b', .22, .22, .36, .03), lambda: rbox(.22, .22, .36, .03)), m=acid))
    add(node((0, 5.78, 0), role='crest', children=X))
    # green lasers from the crest: eight crossed-plane beams, sweeping as a group (role lasers)
    beams = []
    for k in range(8):
        yaw, pitch = k * 45 + 22.5, -(12 if k % 2 else 26)
        q = qmul(qaxis('y', yaw), qaxis('z', pitch))
        pair = [node((1.7, 0, 0), g=S.geo(('pl', 3.4, .14, 'beam'), lambda: plane(3.4, .14)), m=beamM),
                node((1.7, 0, 0), q=qaxis('x', 90), g=S.geo(('pl', 3.4, .14, 'beam'), lambda: plane(3.4, .14)), m=beamM)]
        beams.append(node((0, 0, 0), q=q, children=pair))
    add(node((0, 5.78, 0), role='lasers', children=beams))
    # haze at the base: soft smoke layers drifting round the plinth (role haze)
    for y, w, d, m in ((.04, 5.0, 3.8, 0), (.3, 4.4, 3.2, 1), (.55, 4.0, 2.9, 2), (.85, 3.8, 2.6, 3)):
        add(node((0, y, .25), q=qaxis('x', -90), g=S.geo(('pl', w, d, 'haze'), lambda w=w, d=d: plane(w, d)), m=hazeM[m], role='haze'))

    # --- deck: a black steel console with acid-yellow push buttons
    deck = []
    box(2.4, .5, .16, (0, 0, 0), black, .03, parent=deck)
    pl(2.3, .42, (0, 0, .081), S.mat('standard', 0xffffff, .5, .6, map=tx['steel']), parent=deck, key='deckface')

    def push(x, label, action, r=.12):  # each button is one group (role btn_<action>) so the page can sink the whole cap when it is pressed
        deck.append(node(role='btn_' + action, children=[
            node((x, -.01, .11), q=qaxis('x', 90), g=S.geo(('to', r + .03, .02, 'collar', r), lambda: torus(r + .03, .02, 40, 8, 'y')), m=acidBtn, action=action),
            node((x, -.01, .14), g=S.geo(('cy', r, r, .06, 'z'), lambda: cyl(r, r, .06, 40, 'z')), m=gun, action=action),
            node((x, -.01, .1715), g=S.geo(('di', r - .004), lambda: disc(r - .004)), m=tm(label), action=action)]))
    push(-.94, 'lblPays', 'pays'); push(-.6, 'lblDown', 'betDown'); push(-.26, 'lblUp', 'betUp'); push(.1, 'lblAuto', 'auto')
    sx0 = .76
    deck.append(node(role='btn_spin', children=[
        node((sx0, -.01, .1), q=qaxis('x', 90), g=S.geo(('to', .26, .03, 'spincollar'), lambda: torus(.26, .03, 48, 10, 'y')), m=acidBtn, action='spin'),
        node((sx0, -.01, .13), g=S.geo(('cy', .245, .245, .07, 'z'), lambda: cyl(.245, .245, .07, 48, 'z')), m=gun, action='spin'),
        node((sx0, -.01, .18), g=S.geo(('cy', .225, .225, .065, 'z'), lambda: cyl(.225, .225, .065, 48, 'z')), m=acid, action='spin', role='spinPhysical'),
        node((sx0, -.01, .2135), g=S.geo(('di', .215), lambda: disc(.215, 48)), m=tm('spin'), action='spin')]))
    add(node((0, 1.76, .62), q=qaxis('x', math.degrees(-.72)), children=deck))
    box(1.3, .12, .03, (0, 1.57, .59), gun, .01); pl(1.2, 1.2 * 96 / 1024, (0, 1.57, .607), tm('nameplate'), key='np')

    # --- the lever: a fire-door push bar on the right tower, mounted as a lever (role lever, pivots on rotation.x; a pull swings it down)
    box(.3, .92, .5, (1.96, 2.42, .2), S.mat('standard', 0x9aa1aa, .45, .6), .02)  # push-bar housing
    pl(.3 * .96, .3 * .96 / 256 * 560, (1.96, 2.42, .4515), tm('pushplate'), key='pp')
    box(.06, .34, .34, (2.13, 2.55, .2), gun, .02)  # pivot boss
    L = []

    def lv(g, m, p=(0, 0, 0), q=(0, 0, 0, 1)): L.append(node(p, q=q, g=g, m=m, action='spin'))
    up = math.radians(35); d = (0, math.sin(up), math.cos(up))
    lv(S.geo(('cy', .1, .1, .16, 'x'), lambda: cyl(.1, .1, .16, 28, 'x')), gun)
    lv(S.geo(('to', .1, .018, 'lvcollar'), lambda: torus(.1, .018, 32, 6, 'x')), acid, (.085, 0, 0), qaxis('z', 90))
    for ox in (-.055, .055):  # the two arms
        lv(S.geo(('b', .035, .045, .7, .008), lambda: rbox(.035, .045, .7, .008)), steelM, (ox, d[1] * .35, d[2] * .35), qaxis('x', -35))
    lv(S.geo(('cy', .04, .04, .5, 'x'), lambda: cyl(.04, .04, .5, 24, 'x')), chrome, (0, d[1] * .7, d[2] * .7))  # the push bar
    lv(S.geo(('b', .42, .07, .1, .012), lambda: rbox(.42, .07, .1, .012)), gun, (0, d[1] * .7, d[2] * .7 + .02))  # the paddle behind it
    lv(S.geo(('b', .42, .018, .104, .004), lambda: rbox(.42, .018, .104, .004)), acid, (0, d[1] * .7 + .02, d[2] * .7 + .022))  # acid stripe along the paddle
    for ox in (-.25, .25): lv(S.geo(('cy', .05, .05, .04, 'x'), lambda: cyl(.05, .05, .04, 20, 'x')), acid, (ox, d[1] * .7, d[2] * .7))
    add(node((2.2, 2.55, .2), role='lever', children=L))

    root = node(children=R)
    return {'root': root, 'geometries': S.geos, 'materials': S.mats, 'textures': S.texs}, T


def main():
    model, T = build()
    out = os.path.join(HERE, 'club-x-model.json')
    raw = json.dumps(model, separators=(',', ':'))
    open(out, 'w').write(raw)
    # keep PNG copies of the cabinet artwork for review (art/cabinet/)
    import base64
    art = os.path.normpath(os.path.join(HERE, '..', 'art', 'cabinet')); os.makedirs(art, exist_ok=True)
    for k, v in T.items(): open(os.path.join(art, k + '.png'), 'wb').write(base64.b64decode(v['url'].split(',', 1)[1]))
    gz = len(gzip.compress(raw.encode(), 9))
    print('wrote', out, 'raw %.2f MB' % (len(raw) / 1e6), 'gzip %.2f MB' % (gz / 1e6), 'geoms', len(model['geometries']), 'mats', len(model['materials']), 'texs', len(model['textures']))


if __name__ == '__main__':
    main()
