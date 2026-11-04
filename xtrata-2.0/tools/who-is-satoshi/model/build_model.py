#!/usr/bin/env python3
"""Who Is Satoshi? cabinet model builder.

Writes who-is-satoshi-model.json in the packed-cabinet format the ParallaX Casino room loads
({root, geometries, materials, textures}). Rerunnable; needs numpy and cairosvg (textures.py, no browser).
Named parts the room expects: screenMesh, crest (the turning brass key), spinPhysical, lever (brass arm with a
magnifying-glass grip) and deck buttons with userData actions spin, betUp, betDown, auto, pays.
Extra roles the test page animates: string (the cork-board red string, glows on wins), lamp (the banker's lamp).
Geometry helpers (rbox, cyl, torus, plane, disc, curved, Scene, node) follow tools/snow-crash/model/build_model.py.
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


# ------------------------------------------------------------------ build
def build():
    T = render_all()
    S = Scene(); tx = {}

    def T_(name, **kw):
        tx[name] = S.tex(T[name]['url'], **kw); return tx[name]
    for n in ('wood', 'woodDark'): T_(n, wrapS=1000, wrapT=1000)
    # materials: mahogany, brass, green banker's glass, leather, typewriter keys
    mahog = S.mat('standard', 0xc89a80, .48, .08, map=tx['wood']); mahogDark = S.mat('standard', 0xb08a74, .55, .06, map=tx['woodDark'])
    brass = S.mat('standard', 0xe0b04a, .26, .92); brassDark = S.mat('standard', 0x9a7428, .34, .88); chrome = S.mat('standard', 0xcdd0d6, .16, .95)
    black = S.mat('standard', 0x0d0b09, .5, .2); keyTop = S.mat('standard', 0x16120d, .35, .3)
    greenGlass = S.mat('standard', 0x2f7a4a, .2, .25, emissive=0x1d5a34, ei=1.0, side=2); lampGlow = S.mat('basic', 0xcff5c8, transparent=True, opacity=.85)
    gold = S.mat('basic', 0xe0b04a); warm = S.mat('basic', 0xffe2a8); slotdark = S.mat('basic', 0x050302)
    glass = S.mat('standard', 0xd8e4e8, .05, .3, transparent=True, opacity=.16, depthWrite=False)
    lens = S.mat('standard', 0xcfe6f2, .02, .4, transparent=True, opacity=.32, side=2, depthWrite=False)
    R = []; add = R.append

    def box(w, h, d, p, m, r=0.0, parent=None, action=None, role='', q=(0, 0, 0, 1)):
        n = node(p, q=q, g=S.geo(('b', w, h, d, r), lambda: rbox(w, h, d, r)), m=m, action=action, role=role); (parent if parent is not None else R).append(n); return n

    def pl(w, h, p, m, q=(0, 0, 0, 1), role='', parent=None, umax=1.0, vmax=1.0, key=''):
        n = node(p, q=q, g=S.geo(('pl', w, h, umax, vmax, key), lambda: plane(w, h, umax, vmax)), m=m, role=role); (parent if parent is not None else R).append(n); return n
    tm = lambda name, **kw: S.mat('basic', 0xffffff, map=tx[name], **kw)

    # --- plinth with brass kick plate and the floor-glow strip
    box(2.95, .22, 1.5, (0, .14, 0), mahogDark, .04)
    box(2.9, .02, 1.45, (0, .012, 0), gold)
    box(2.72, .05, .02, (0, .2, .752), brass, .01)
    # --- lower body and the frosted-glass office door (S. NAKAMOTO · INQUIRIES, with the Xtrata mark)
    box(2.5, 1.52, 1.15, (0, 1.01, 0), mahog, .05)
    box(1.92, 1.16, .05, (0, 1.0, .58), mahogDark, .02)
    T_('door'); pl(1.72, 1.04, (0, 1.0, .607), tm('door'))
    box(.05, .16, .05, (.74, .98, .63), brass, .02)  # door handle
    add(node((.74, .98, .67), g=S.geo(('cy', .045, .045, .05, 'z'), lambda: cyl(.045, .045, .05, 24, 'z')), m=brass))
    # souvenir ticket slot (right) and LAYR coin slot (left), brass rims
    for x, lab in ((.62, 'ticket'), (-.62, 'coin')):
        box(.56, .09, .03, (x, .32, .585), brass, .015); box(.46, .045, .04, (x, .32, .598), slotdark, .01)
        T_(lab); pl(.36, .07, (x, .41, .582), tm(lab), key=lab)
    box(2.56, .08, 1.2, (0, 1.81, .02), brassDark, .02)

    # --- upper housing: mahogany, the case-file folder round the screen
    box(2.5, 2.15, .98, (0, 2.925, -.04), mahog, .05)
    box(2.3, 1.72, .06, (0, 2.86, .46), mahogDark, .02)
    T_('folder'); pl(2.2, 1.64, (0, 2.86, .495), tm('folder'))
    T_('screen'); add(node((0, 2.85, .505), g=S.geo(('cv', 1.92, 1.32, .008), lambda: curved(1.92, 1.32, .008)), m=S.mat('basic', 0xffffff, map=tx['screen']), role='screenMesh'))
    T_('glass'); add(node((0, 2.85, .516), g=S.geo(('cv', 1.92, 1.32, .008), lambda: curved(1.92, 1.32, .008)), m=S.mat('basic', 0xffffff, map=tx['glass'], transparent=True, depthWrite=False)))
    # brass corner protectors on the folder
    for sx in (-1, 1):
        for sy in (-1, 1):
            box(.12, .12, .03, (sx * 1.07, 2.86 + sy * .79, .5), brass, .01)

    # --- the green-shaded banker's lamp over the screen (role lamp)
    lamp = []
    lamp.append(node((0, 0, 0), g=S.geo(('cy', .02, .02, .26), lambda: cyl(.02, .02, .26, 16)), m=brass))
    lamp.append(node((0, .14, -.02), g=S.geo(('b', .14, .03, .14, .01), lambda: rbox(.14, .03, .14, .01)), m=brass))
    lamp.append(node((0, -.2, .1), g=S.geo(('cy', .15, .15, 1.18, 'x', 'half'), lambda: cyl(.15, .15, 1.18, 32, 'x', False, .5)), m=greenGlass, q=qaxis('x', -90)))
    for sx in (-1, 1): lamp.append(node((sx * .59, -.2, .1), q=qaxis('x', -90), g=S.geo(('to', .15, .012, 'rim', sx), lambda: torus(.15, .012, 32, 6, 'x')), m=brass))
    lamp.append(node((0, -.2, .1), q=qaxis('x', 90), g=S.geo(('pl', 1.14, .2, 'glow'), lambda: plane(1.14, .2)), m=lampGlow))
    lamp.append(node((0, -.21, .1), g=S.geo(('cy', .03, .03, 1.0, 'x'), lambda: cyl(.03, .03, 1.0, 16, 'x')), m=warm))
    lamp.append(node((0, -.75, .25), g=S.geo(('cy', .02, .55, 1.0, 'cone'), lambda: cyl(.02, .55, 1.0, 32, 'y', False)), m=S.mat('basic', 0xbff0b8, transparent=True, opacity=.05, side=2, depthWrite=False)))
    add(node((0, 3.92, .42), role='lamp', children=lamp))

    # --- marquee: black glass and gold leaf, small ParallaX Casino wordmark at its foot
    box(3.62, .55, 1.24, (0, 4.275, 0), mahog, .04); box(3.66, .04, 1.26, (0, 4.565, 0), brass, .01); box(3.66, .04, 1.26, (0, 3.99, 0), brass, .01)
    T_('header'); pl(3.4, .5, (0, 4.275, .6225), tm('header'))

    # --- side towers: mahogany, brass sconces, cork boards with the clue cards and the red string (role string)
    T_('corkFront'); T_('corkSide'); T_('stringFront'); T_('stringSide')
    strF = S.mat('basic', 0xffffff, map=tx['stringFront'], transparent=True, depthWrite=False); strS = S.mat('basic', 0xffffff, map=tx['stringSide'], transparent=True, depthWrite=False)
    for sx in (-1, 1):
        x = sx * 1.53
        box(.56, 3.78, 1.12, (x, 2.11, 0), mahog, .04)
        box(.62, .06, 1.18, (x, .27, 0), brass, .02); box(.62, .06, 1.18, (x, 4.0, 0), brass, .02)
        box(.5, 1.84, .03, (x, 2.62, .56), mahogDark, .01)
        pl(.44, 1.76, (x, 2.62, .577), tm('corkFront'), key='cf')
        pl(.44, 1.76, (x, 2.62, .581), strF, role='string', key='sf')
        # brass sconce with a warm bulb below the board
        add(node((x, 1.42, .6), g=S.geo(('cy', .09, .06, .14), lambda: cyl(.09, .06, .14, 24)), m=brass))
        add(node((x, 1.56, .6), g=S.geo(('cy', .055, .055, .11), lambda: cyl(.055, .055, .11, 20)), m=warm))
        add(node((x, 1.62, .6), g=S.geo(('cy', .1, .07, .05, 'cap'), lambda: cyl(.1, .07, .05, 24)), m=brassDark))
        # outer side face
        xo = sx * 1.812; q = qaxis('y', 90 * sx)
        box(.03, 1.98, 1.02, (xo - sx * .01, 2.5, 0), mahogDark, .01)
        pl(.98, 1.9 * .72 * 1.0, (xo + sx * .006, 2.5, 0), tm('corkSide'), q=q, key='cs')
        pl(.98, 1.9 * .72 * 1.0, (xo + sx * .011, 2.5, 0), strS, q=q, role='string', key='ss')

    # --- topper: brass plinth and the slowly turning brass key with ₿ cut into its bow (role crest)
    add(node((0, 4.6, 0), g=S.geo(('cy', .34, .38, .06), lambda: cyl(.34, .38, .06, 40)), m=brass))
    add(node((0, 4.66, 0), g=S.geo(('cy', .22, .3, .08), lambda: cyl(.22, .3, .08, 40)), m=mahogDark))
    T_('bow'); bowM = S.mat('standard', 0xffffff, .3, .7, map=tx['bow'], side=2)
    key = []
    key.append(node((0, .42, 0), g=S.geo(('to', .24, .05, 'bow'), lambda: torus(.24, .05, 48, 12, 'z')), m=brass))
    key.append(node((0, .42, 0), g=S.geo(('di', .225), lambda: disc(.225, 48)), m=bowM))
    key.append(node((0, .42, 0), q=qaxis('y', 180), g=S.geo(('di', .225), lambda: disc(.225, 48)), m=bowM))
    key.append(node((0, .12, 0), g=S.geo(('to', .07, .025, 'collar'), lambda: torus(.07, .025, 32, 8, 'y')), m=brass))
    key.append(node((0, -.18, 0), g=S.geo(('cy', .045, .045, .62), lambda: cyl(.045, .045, .62, 24)), m=brass))
    key.append(node((0, -.04, 0), g=S.geo(('to', .06, .02, 'ring2'), lambda: torus(.06, .02, 32, 8, 'y')), m=brassDark))
    for k, (dy, w) in enumerate(((-.38, .16), (-.3, .11), (-.44, .13))):
        key.append(node((w / 2 + .03, dy, 0), g=S.geo(('b', w, .05, .05, .005), lambda w=w: rbox(w, .05, .05, .005)), m=brass))
    add(node((0, 5.3, 0), s=(1.35, 1.35, 1.35), role='crest', children=key))

    # --- deck: mahogany desk edge with a green leather inlay and typewriter-key buttons
    deck = []
    box(2.4, .5, .16, (0, 0, 0), mahogDark, .03, parent=deck)
    T_('leather'); pl(2.3, .42, (0, 0, .085), tm('leather'), parent=deck, key='leather')

    def type_key(x, label, action, r=.13):
        T_(label)
        deck.append(node((x, -.01, .12), g=S.geo(('cy', r + .02, r + .02, .05, 'z'), lambda: cyl(r + .02, r + .02, .05, 40, 'z')), m=chrome, action=action))
        deck.append(node((x, -.01, .16), g=S.geo(('cy', r, r, .06, 'z'), lambda: cyl(r, r, .06, 40, 'z')), m=keyTop, action=action))
        deck.append(node((x, -.01, .192), g=S.geo(('di', r - .005), lambda: disc(r - .005)), m=tm(label), action=action))
    type_key(-.94, 'lblPays', 'pays'); type_key(-.6, 'lblDown', 'betDown'); type_key(-.26, 'lblUp', 'betUp'); type_key(.1, 'lblAuto', 'auto')
    T_('spin'); sx0 = .76
    deck.append(node((sx0, -.01, .13), g=S.geo(('cy', .25, .25, .07, 'z'), lambda: cyl(.25, .25, .07, 48, 'z')), m=brassDark, action='spin'))
    deck.append(node((sx0, -.01, .18), g=S.geo(('cy', .225, .225, .065, 'z'), lambda: cyl(.225, .225, .065, 48, 'z')), m=brass, action='spin', role='spinPhysical'))
    deck.append(node((sx0, -.01, .2135), g=S.geo(('di', .215), lambda: disc(.215, 48)), m=tm('spin'), action='spin'))
    add(node((0, 1.76, .62), q=qaxis('x', math.degrees(-.72)), children=deck))
    # nameplate under the deck
    T_('nameplate'); box(1.3, .12, .03, (0, 1.58, .59), brass, .01); pl(1.2, .1, (0, 1.58, .607), tm('nameplate'), key='np')

    # --- the lever: a long brass arm ending in a magnifying-glass grip (role lever, pivots on rotation.x)
    L = []
    def lv(g, m, p=(0, 0, 0), q=(0, 0, 0, 1)): L.append(node(p, q=q, g=g, m=m, action='spin'))
    lv(S.geo(('cy', .09, .09, .24, 'x'), lambda: cyl(.09, .09, .24, 28, 'x')), brassDark)
    lv(S.geo(('cy', .03, .03, .86), lambda: cyl(.03, .03, .86, 20)), brass, (0, .43, 0))
    lv(S.geo(('to', .04, .015, 'ferrule'), lambda: torus(.04, .015, 24, 6, 'y')), brassDark, (0, .86, 0))
    lv(S.geo(('cy', .045, .038, .26), lambda: cyl(.045, .038, .26, 24)), mahogDark, (0, 1.0, 0))  # wooden handle
    lv(S.geo(('to', .16, .028, 'lens'), lambda: torus(.16, .028, 48, 10, 'z')), brass, (0, 1.3, 0))
    lv(S.geo(('di', .155, 'lens'), lambda: disc(.155, 48)), lens, (0, 1.3, 0))
    add(node((2.0, 2.3, .2), role='lever', children=L))
    box(.08, .5, .5, (1.86, 2.3, .2), brass, .02)

    root = node(children=R)
    return {'root': root, 'geometries': S.geos, 'materials': S.mats, 'textures': S.texs}, T


def main():
    model, T = build()
    out = os.path.join(HERE, 'who-is-satoshi-model.json')
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
