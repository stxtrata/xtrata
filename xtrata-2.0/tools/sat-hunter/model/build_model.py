#!/usr/bin/env python3
"""The Sat Hunter cabinet model builder: a Victorian assay bench in dark oak and brass.

Writes sat-hunter-model.json in the packed-cabinet format the ParallaX Casino room loads ({root, geometries, materials, textures}).
Rerunnable; needs numpy (and CairoSVG or node+sharp for textures.py, no browser).
Named parts (node roles): screenMesh (once), crest (the brass jeweller's loupe over a glowing sat; the room turns it on its own clock),
spinPhysical, lever (the brass gold-panning rocker; pivots on rotation.x, action spin), leds (blue glass lamps that pulse with each
spin) and deck buttons with userData actions spin (HUNT), betUp (+SATS), betDown (-SATS), auto (AUTO-HUNT), pays (RARITY).
Extra roles a host can map the game's live canvases onto (the room may ignore them): topperPlate (1024x320, the `topper` canvas),
counterL and counterR (256x1024 each, the `counter` canvas); each carries a baked fallback texture.
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


def sphere(r, seg=24, rings=14):
    P, N, U, I = [], [], [], []
    for j in range(rings + 1):
        v = j / rings; a = v * math.pi
        for i in range(seg + 1):
            u = i / seg; b = u * 2 * math.pi
            n = (math.sin(a) * math.cos(b), math.cos(a), math.sin(a) * math.sin(b)); P.append(tuple(r * c for c in n)); N.append(n); U.append((u, 1 - v))
    for j in range(rings):
        for i in range(seg):
            a0 = j * (seg + 1) + i; b0 = a0 + seg + 1; I += [a0, a0 + 1, b0 + 1, a0, b0 + 1, b0]
    return _fix_winding(_pack(P, N, U, I))


# ------------------------------------------------------------------ build
RAR = {'uncommon': 0x8be28b, 'rare': 0x5fd0ff, 'epic': 0xffd23f, 'legendary': 0xff9bd2, 'mythic': 0xffffff, 'black': 0x3a3f47, 'palindrome': 0xc79bff,
       'vintage': 0xd8b07a, 'nakamoto': 0xe8e3d3, 'pizza': 0xff8a3d, 'block9': 0x7fe3d0, 'range': 0x00a6fb, 'coinbase': 0xffd23f}
TUBE_A = ('uncommon', 'rare', 'epic', 'legendary', 'black', 'palindrome', 'mythic')  # same order as textures.TUBES[0]
TUBE_B = ('vintage', 'nakamoto', 'pizza', 'block9', 'range', 'mythic', 'coinbase')   # textures.TUBES[1]
Y_UP = lambda a: qaxis('y', a)


def build():
    T = render_all()
    S = Scene(); tx = {}

    def T_(name, **kw):
        if name not in tx: tx[name] = S.tex(T[name]['url'], **kw)
        return tx[name]
    for n in ('oak', 'oakV', 'oakDark', 'brass'): T_(n, wrapS=1000, wrapT=1000)
    # materials: dark oak, brushed brass, blue glass lamps, specimen glass, cork
    oak = S.mat('standard', 0xffffff, .62, .0, map=tx['oak']); oakV = S.mat('standard', 0xffffff, .62, .0, map=tx['oakV']); oakD = S.mat('standard', 0xe6e0da, .7, .0, map=tx['oakDark'])
    brass = S.mat('standard', 0xe0c890, .34, .6, map=tx['brass']); brassDark = S.mat('standard', 0x8c6a38, .42, .55, map=tx['brass'])
    brassBright = S.mat('standard', 0xfff0c8, .22, .7, map=tx['brass']); darkGlass = S.mat('standard', 0x0b1a24, .2, .3)
    led = S.mat('basic', 0x6fd3ff); ledDeep = S.mat('basic', 0x00a6fb); glowStrip = S.mat('basic', 0x00a6fb); slotdark = S.mat('basic', 0x030304)
    tubeGlass = S.mat('standard', 0xcfe8f2, .05, .2, transparent=True, opacity=.2, depthWrite=False); cork = S.mat('standard', 0xb98a55, .9, .0)
    caseGlass = S.mat('standard', 0xd8eaf4, .05, .3, transparent=True, opacity=.08, depthWrite=False)
    R = []; add = R.append

    def box(w, h, d, p, m, r=0.0, parent=None, action=None, role='', q=(0, 0, 0, 1)):
        n = node(p, q=q, g=S.geo(('b', w, h, d, r), lambda: rbox(w, h, d, r)), m=m, action=action, role=role); (parent if parent is not None else R).append(n); return n

    def pl(w, h, p, m, q=(0, 0, 0, 1), role='', parent=None, umax=1.0, vmax=1.0, key=''):
        n = node(p, q=q, g=S.geo(('pl', w, h, umax, vmax, key), lambda: plane(w, h, umax, vmax)), m=m, role=role); (parent if parent is not None else R).append(n); return n

    def cy(rt, rb, h, p, m, axis='y', seg=24, parent=None, role='', action=None, q=(0, 0, 0, 1)):
        n = node(p, q=q, g=S.geo(('cy', rt, rb, h, axis, seg), lambda: cyl(rt, rb, h, seg, axis)), m=m, role=role, action=action); (parent if parent is not None else R).append(n); return n

    def sph(r, p, m, role='', parent=None, seg=20):
        n = node(p, g=S.geo(('sp', r, seg), lambda: sphere(r, seg, max(8, seg // 2))), m=m, role=role); (parent if parent is not None else R).append(n); return n
    tm = lambda name, **kw: S.mat('basic', 0xffffff, map=T_(name), **kw)
    tl = lambda name, c=0xffffff, rough=.45, metal=.35: S.mat('standard', c, rough, metal, map=T_(name))  # lit plate that still takes the room's light

    def lamp(x, y, z, r=.04, parent=None):
        """A blue glass lamp in a brass collar (role leds: it pulses with each spin)."""
        cy(r + .012, r + .018, .03, (x, y, z), brass, 'z', 20, parent, q=(0, 0, 0, 1)); sph(r, (x, y, z + .012), led, 'leds', parent)

    # --- plinth: oak base, brass kick plate, the #00a6fb floor-glow strip
    box(3.0, .24, 1.5, (0, .12, 0), oakD, .03)
    box(2.94, .02, 1.46, (0, .012, 0), glowStrip)
    pl(2.94, .14, (0, .13, .7515), tl('plinthPlate', 0xf0e0b8, .38, .5), key='plinth')
    for sx in (-1, 1): box(.2, .26, .2, (sx * 1.44, .13, .67), brass, .015)  # brass corner caps
    # --- lower body: oak with brass corner plates, the door ("EVERY SAT HAS A STORY" + the Xtrata mark)
    box(2.5, 1.52, 1.15, (0, 1.0, 0), oak, .02)
    box(1.98, 1.22, .05, (0, 1.0, .585), brassDark, .01)
    pl(1.9, 1.15, (0, 1.0, .612), tm('door'))
    for sx in (-1, 1):
        for y in (.38, 1.62): box(.27, .27, .04, (sx * 1.13, y, .59), tl('brassPlate', 0xe8d4a0, .34, .5), .008)
    for x, lab in ((.62, 'ticket'), (-.62, 'coin')):  # souvenir ticket slot (right) and LAYR coin slot (left)
        box(.58, .1, .04, (x, .31, .59), brassDark, .015); box(.46, .045, .05, (x, .31, .6), slotdark, .01)
        pl(.36, .07, (x, .405, .5765), tl(lab, 0xffffff, .4, .4), key=lab)
    box(2.56, .08, 1.2, (0, 1.8, .02), oakD, .02); box(2.6, .02, 1.22, (0, 1.845, .02), brass, .005)

    # --- upper housing: oak, the screen under a sheet of glass in a riveted brass bezel (a specimen case)
    box(2.5, 2.15, .98, (0, 2.925, -.04), oak, .02)
    box(2.3, 1.72, .06, (0, 2.86, .46), oakD, .015)
    pl(2.2, 1.64, (0, 2.86, .4955), tl('bezel', 0xf2e6c4, .36, .5))
    add(node((0, 2.85, .505), g=S.geo(('pl', 1.92, 1.32, 'screen'), lambda: plane(1.92, 1.32)), m=S.mat('basic', 0xffffff, map=T_('screen')), role='screenMesh'))
    add(node((0, 2.85, .512), g=S.geo(('pl', 1.92, 1.32, 'glass'), lambda: plane(1.92, 1.32)), m=S.mat('basic', 0xffffff, map=T_('glass'), transparent=True, depthWrite=False)))
    for dy in (-1, 1): box(2.0, .04, .035, (0, 2.85 + dy * .68, .518), brassBright, .008)   # glass retaining strips
    for dx in (-1, 1): box(.04, 1.4, .035, (dx * .98, 2.85, .518), brassBright, .008)
    for sx in (-1, 1):  # brass corner plates
        for sy in (-1, 1): box(.2, .2, .045, (sx * 1.07, 2.86 + sy * .79, .505), tl('brassPlate', 0xe8d4a0, .34, .5), .008)
    box(1.9, .03, .03, (0, 3.69, .5), brass, .008)
    for k in range(5): lamp(-.76 + k * .38, 3.745, .5, .035)
    # --- marquee: oak with brass rails, a lit SAT HUNTER sign; the casino wordmark small at its foot (inside the texture)
    box(3.62, .55, 1.24, (0, 4.275, 0), oakD, .03); box(3.66, .04, 1.26, (0, 4.565, 0), brass, .01); box(3.66, .04, 1.26, (0, 3.99, 0), brass, .01)
    pl(3.4, .5, (0, 4.275, .6225), tm('header'))

    # --- side towers: oak pillars. Front: a glass-covered sat tape (counterL / counterR) over drawers of labelled samples.
    # Outer side: drawers below and a glass-fronted case of labelled sample tubes above.
    TUBE_Y = (2.90, 3.38)
    for sx in (-1, 1):
        x = sx * 1.53; side = 'L' if sx < 0 else 'R'
        box(.56, 3.78, 1.12, (x, 2.11, 0), oakV, .02)
        box(.62, .06, 1.18, (x, .25, 0), brass, .02); box(.62, .06, 1.18, (x, 4.0, 0), brass, .02)
        box(.46, 1.5, .04, (x, 3.1, .56), brassDark, .01)
        pl(.34, 1.36, (x, 3.1, .5835), tm('counter' + side), role='counter' + side, key='counter' + side)
        pl(.34, 1.36, (x, 3.1, .589), caseGlass, key='counterglass')
        for y in (3.86, 2.34): box(.5, .1, .05, (x, y, .565), tl('brassPlate', 0xe8d4a0, .34, .5), .008)
        pl(.5, 1.9, (x, 1.3, .5635), tl('drawersFront', 0xffffff, .6, .0), key='dfront')
        for k in range(6): box(.14, .022, .03, (x, 2.25 - (k + .68) * 1.9 / 6, .58), brassBright, .008)
        # outer side
        xo = sx * 1.812; q = Y_UP(90 * sx)
        box(.03, 3.4, 1.02, (xo - sx * .005, 2.25, 0), oakD, .01)
        pl(.98, 2.25, (xo + sx * .0165, 1.65, 0), tl('drawers' + side, 0xffffff, .6, .0), q=q, key='dside' + side)
        for r in range(6):
            for c in range(3): box(.028, .022, .12, (xo + sx * .03, 2.775 - (r + .68) * .375, -sx * ((c + .5) * .98 / 3 - .49)), brassBright, .008)
        pl(.98, .96, (xo + sx * .0165, 3.38, 0), S.mat('standard', 0x0b1a24, .7, .0), q=q, key='tubeback')
        for k, shelf in enumerate(TUBE_Y):
            box(.12, .062, .98, (xo + sx * .07, shelf, 0), oakD, .004)
            pl(.98, .0613, (xo + sx * .1315, shelf, 0), tl('tubeRail' + 'AB'[k], 0xffffff, .4, .4), q=q, key='rail' + str(k))
            names = TUBE_A if k == 0 else TUBE_B
            for i, n in enumerate(names):
                z = -sx * (i - 3) * .13; base = shelf + .031; px = xo + sx * .07
                cy(.03, .03, .34, (px, base + .17, z), tubeGlass, 'y', 16)
                sph(.021, (px, base + .03, z), S.mat('basic', RAR[n]), seg=12)
                cy(.034, .034, .018, (px, base + .32, z), brass, 'y', 16); cy(.026, .032, .05, (px, base + .355, z), cork, 'y', 14)
        box(.012, .98, 1.0, (xo + sx * .15, 3.38, 0), caseGlass)
        box(.04, .03, 1.03, (xo + sx * .14, 3.885, 0), brass, .006); box(.04, .03, 1.03, (xo + sx * .14, 2.875, 0), brass, .006)
        for z in (-.5, .5): box(.04, 1.0, .03, (xo + sx * .14, 3.38, z), brass, .006)

    # --- topper: the plate that shows the game's live topper canvas (role topperPlate) under a brass loupe over a glowing sat (role crest)
    box(1.9, .1, .7, (0, 4.64, 0), oakD, .02); box(1.94, .02, .72, (0, 4.70, 0), brass, .005)
    box(1.54, .5, .22, (0, 4.95, 0), oak, .02)
    pl(1.4, .4375, (0, 4.95, .1115), tm('topperPlate'), role='topperPlate', key='topperPlate')
    for y in (5.18, 4.72): box(1.48, .03, .02, (0, y, .115), brassBright, .006)
    for sx in (-1, 1): box(.03, .46, .02, (sx * .725, 4.95, .115), brassBright, .006); lamp(sx * .84, 4.95, .11, .035)
    cy(.12, .16, .06, (0, 5.23, 0), brass, 'y', 32)
    haloM = S.mat('basic', 0xffffff, map=T_('halo'), transparent=True, side=2, depthWrite=False); lensM = S.mat('basic', 0xffffff, map=T_('lens'), transparent=True, side=2, depthWrite=False)
    satM = S.mat('basic', 0xe6f7ff); C = []
    cy(.028, .036, .27, (0, .125, 0), brassDark, 'y', 20, C); cy(.05, .04, .06, (0, .24, 0), brassBright, 'y', 20, C)
    for y in (.05, .16): C.append(node((0, y, 0), g=S.geo(('to', .04, .012, 'band'), lambda: torus(.04, .012, 24, 6, 'y')), m=brass))
    ry = .55; C.append(node((0, ry, 0), g=S.geo(('to', .27, .026, 'ring'), lambda: torus(.27, .026, 56, 10, 'z')), m=brassBright))
    C.append(node((0, ry, 0), g=S.geo(('to', .238, .008, 'rim'), lambda: torus(.238, .008, 56, 6, 'z')), m=brassDark))
    C.append(node((0, ry, 0), g=S.geo(('di', .262, 'lens'), lambda: disc(.262, 48)), m=lensM))
    for a in range(0, 360, 45):
        C.append(node((.27 * math.cos(math.radians(a)), ry + .27 * math.sin(math.radians(a)), 0), g=S.geo(('sp', .02, 10), lambda: sphere(.02, 10, 6)), m=brass))
    sph(.07, (0, ry, 0), satM, parent=C, seg=24)
    for a in range(0, 360, 60): C.append(node((.12 * math.cos(math.radians(a)), ry + .12 * math.sin(math.radians(a)), 0), g=S.geo(('sp', .008, 8), lambda: sphere(.008, 8, 5)), m=satM))
    C.append(node((0, ry, 0), g=S.geo(('pl', .56, .56, 'halo'), lambda: plane(.56, .56)), m=haloM)); C.append(node((0, ry, 0), q=Y_UP(90), g=S.geo(('pl', .56, .56, 'halo'), lambda: plane(.56, .56)), m=haloM))
    add(node((0, 5.26, 0), role='crest', children=C))

    # --- deck: an oak desk edge with a felt inlay and brass-collared push buttons
    deck = []
    box(2.4, .5, .16, (0, 0, 0), oakD, .03, parent=deck); box(2.44, .03, .17, (0, .255, 0), brass, .008, parent=deck)
    pl(2.3, .42, (0, 0, .081), S.mat('standard', 0xffffff, .95, .0, map=T_('felt')), parent=deck, key='felt')

    def push(x, label, action, r=.12):
        deck.append(node((x, -.01, .11), q=qaxis('x', 90), g=S.geo(('to', r + .03, .02, 'collar', r), lambda: torus(r + .03, .02, 40, 8, 'y')), m=brassBright, action=action))
        deck.append(node((x, -.01, .14), g=S.geo(('cy', r, r, .06, 'z'), lambda: cyl(r, r, .06, 40, 'z')), m=brassDark, action=action))
        deck.append(node((x, -.01, .1715), g=S.geo(('di', r - .004), lambda: disc(r - .004)), m=tm(label), action=action))
    push(-.94, 'lblPays', 'pays'); push(-.6, 'lblDown', 'betDown'); push(-.26, 'lblUp', 'betUp'); push(.1, 'lblAuto', 'auto')
    sx0 = .76
    deck.append(node((sx0, -.01, .1), q=qaxis('x', 90), g=S.geo(('to', .26, .03, 'spincollar'), lambda: torus(.26, .03, 48, 10, 'y')), m=brassBright, action='spin'))
    deck.append(node((sx0, -.01, .13), g=S.geo(('cy', .245, .245, .07, 'z'), lambda: cyl(.245, .245, .07, 48, 'z')), m=brassDark, action='spin'))
    deck.append(node((sx0, -.01, .18), g=S.geo(('cy', .225, .225, .065, 'z'), lambda: cyl(.225, .225, .065, 48, 'z')), m=S.mat('standard', 0xf3cf7a, .3, .6, emissive=0x4a3510, ei=.5), action='spin', role='spinPhysical'))
    deck.append(node((sx0, -.01, .2135), g=S.geo(('di', .215), lambda: disc(.215, 48)), m=tm('spin'), action='spin'))
    add(node((0, 1.76, .62), q=qaxis('x', math.degrees(-.72)), children=deck))
    box(1.3, .12, .03, (0, 1.57, .59), brassDark, .01); pl(1.2, .1125, (0, 1.57, .607), tl('nameplate', 0xffffff, .4, .4), key='np')
    for sx in (-1, 1): lamp(sx * .78, 1.57, .61, .032)

    # --- the lever: a brass gold-panning rocker on the right side (role lever, pivots on rotation.x; a pull swings it down)
    box(.3, .92, .5, (1.96, 2.38, .2), oak, .02); box(.32, .06, .52, (1.96, 1.94, .2), brass, .01); box(.32, .06, .52, (1.96, 2.82, .2), brass, .01)
    pl(.288, .288 * 560 / 256, (1.96, 2.38, .4515), tl('rocker', 0xffffff, .4, .4), key='rocker')
    box(.06, .34, .34, (2.13, 2.5, .2), brassDark, .02)
    L = []
    def lv(g, m, p=(0, 0, 0), q=(0, 0, 0, 1)): L.append(node(p, q=q, g=g, m=m, action='spin'))
    up = math.radians(35); d = (0, math.sin(up), math.cos(up)); end = (0, d[1] * .7, d[2] * .7)
    lv(S.geo(('cy', .1, .1, .16, 'x'), lambda: cyl(.1, .1, .16, 28, 'x')), brassDark)
    lv(S.geo(('to', .1, .018, 'lvcollar'), lambda: torus(.1, .018, 32, 6, 'x')), brassBright, (.085, 0, 0), qaxis('z', 90))
    for ox in (-.055, .055): lv(S.geo(('b', .035, .045, .7, .008), lambda: rbox(.035, .045, .7, .008)), brassBright, (ox, d[1] * .35, d[2] * .35), qaxis('x', -35))
    lv(S.geo(('cy', .03, .03, .22, 'x'), lambda: cyl(.03, .03, .22, 20, 'x')), brassDark, (0, d[1] * .3, d[2] * .3))
    lv(S.geo(('cy', .21, .07, .05, 'y'), lambda: cyl(.21, .07, .05, 40, 'y')), brassBright, end)                  # the pan
    lv(S.geo(('to', .21, .014, 'panrim'), lambda: torus(.21, .014, 40, 6, 'y')), brass, (0, end[1] + .025, end[2]))
    lv(S.geo(('di', .185, 'pandish'), lambda: disc(.185, 40)), S.mat('standard', 0x8a6224, .5, .5, side=2), (0, end[1] + .026, end[2]), qaxis('x', -90))
    for ox, oz in ((-.05, .02), (.04, -.03), (.07, .06), (-.02, -.06)):  # a few gold nuggets in the pan
        lv(S.geo(('sp', .022, 10), lambda: sphere(.022, 10, 6)), S.mat('standard', 0xffd23f, .25, .8, emissive=0x3a2a00, ei=.5), (ox, end[1] + .04, end[2] + oz))
    add(node((2.2, 2.5, .2), role='lever', children=L))

    root = node(children=R)
    return {'root': root, 'geometries': S.geos, 'materials': S.mats, 'textures': S.texs}, T


def main():
    model, T = build()
    out = os.path.join(HERE, 'sat-hunter-model.json')
    raw = json.dumps(model, separators=(',', ':'))
    open(out, 'w').write(raw)
    # keep copies of the cabinet artwork for review (art/cabinet/)
    import base64
    art = os.path.normpath(os.path.join(HERE, '..', 'art', 'cabinet')); os.makedirs(art, exist_ok=True)
    for k, v in T.items(): open(os.path.join(art, k + ('.jpg' if v['url'].startswith('data:image/jpeg') else '.png')), 'wb').write(base64.b64decode(v['url'].split(',', 1)[1]))
    gz = len(gzip.compress(raw.encode(), 9))
    print('wrote', out, 'raw %.2f MB' % (len(raw) / 1e6), 'gzip %.2f MB' % (gz / 1e6), 'geoms', len(model['geometries']), 'mats', len(model['materials']), 'texs', len(model['textures']))


if __name__ == '__main__':
    main()
