#!/usr/bin/env python3
"""Monkey Hash cabinet model builder.

Writes monkey-hash-model.json in the packed-cabinet format the ParallaX Casino room loads
({root, geometries, materials, textures}). Rerunnable. Inputs in ./assets:
  xtrata.svg, parallax.svg  extracted from the brief, drawn as given (never redrawn or recoloured).
  (No logo file is needed: the cabinet carries the machine's name and carved ornament only.)
"""
import base64, gzip, json, math, os, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
A = lambda *p: os.path.join(HERE, 'assets', *p)

# ------------------------------------------------------------------ textures (Chromium)
def render_textures():
    from playwright.sync_api import sync_playwright
    b64 = lambda path: base64.b64encode(open(path, 'rb').read()).decode()
    args = {'xtrata': b64(A('xtrata.svg')), 'parallax': b64(A('parallax.svg'))}
    with sync_playwright() as p:
        br = p.chromium.launch()
        pg = br.new_page(viewport={'width': 800, 'height': 600})
        pg.set_content('<html><body></body></html>')
        pg.add_script_tag(content=open(os.path.join(HERE, 'textures.js')).read())
        out = pg.evaluate('(a)=>window.renderAll(a)', args)
        br.close()
    return out

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
    if axis == 'z': f = lambda v: np.stack([v[:, 0], -v[:, 2], v[:, 1]], 1)   # y -> +z
    else: f = lambda v: np.stack([v[:, 1], -v[:, 0], v[:, 2]], 1)              # y -> +x
    return f(P), f(N)

def cyl(rt, rb, h, seg=32, axis='y', caps=True):
    P, N, U, I = [], [], [], []
    slope = (rb - rt) / h
    for k in range(seg + 1):
        t = k / seg; a = t * 2 * math.pi; c, s = math.cos(a), math.sin(a)
        nn = np.array([c, slope, s]); nn /= np.linalg.norm(nn)
        P.append((rt * c, h / 2, rt * s)); N.append(nn); U.append((t, 1))
        P.append((rb * c, -h / 2, rb * s)); N.append(nn); U.append((t, 0))
    for k in range(seg):
        a = 2 * k; I += [a, a + 2, a + 1, a + 1, a + 2, a + 3]
    if caps:
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
    # winding check: make sure outward normals agree with triangle orientation
    P2, N2 = _orient(axis, P, N)
    return _fix_winding(_pack(P2, N2, U, I))

def _fix_winding(g):
    pos = np.array(g['attributes']['position']['array']).reshape(-1, 3); nrm = np.array(g['attributes']['normal']['array']).reshape(-1, 3); idx = np.array(g['index']).reshape(-1, 3)
    a, b, c = pos[idx[:, 0]], pos[idx[:, 1]], pos[idx[:, 2]]
    fn = np.cross(b - a, c - a); vn = nrm[idx[:, 0]] + nrm[idx[:, 1]] + nrm[idx[:, 2]]
    flip = (fn * vn).sum(1) < 0
    idx[flip] = idx[flip][:, [0, 2, 1]]
    g['index'] = [int(i) for i in idx.ravel()]
    return g

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


def sphere(r, seg=28, rings=16):
    P, N, U, I = [], [], [], []
    for j in range(rings + 1):
        v = j / rings; phi = v * math.pi
        for i in range(seg + 1):
            u = i / seg; th = u * 2 * math.pi
            n = (math.sin(phi) * math.cos(th), math.cos(phi), math.sin(phi) * math.sin(th)); P.append(tuple(r * x for x in n)); N.append(n); U.append((u, 1 - v))
    for j in range(rings):
        for i in range(seg):
            a = j * (seg + 1) + i; b = a + seg + 1; I += [a, b, a + 1, a + 1, b, b + 1]
    return _fix_winding(_pack(P, N, U, I))

def helix(R, r, h, turns, seg_per_turn=24, tube=6):
    """A tube following a helix around the y axis, from y=-h/2 to y=h/2 (the vine wrapped round the bamboo)."""
    steps = int(turns * seg_per_turn); P, N, U, I = [], [], [], []
    for k in range(steps + 1):
        t = k / steps; a = t * turns * 2 * math.pi; cx, cy, cz = R * math.cos(a), -h / 2 + t * h, R * math.sin(a)
        T = np.array([-R * math.sin(a) * turns * 2 * math.pi, h, R * math.cos(a) * turns * 2 * math.pi]); T /= np.linalg.norm(T)
        up = np.array([math.cos(a), 0, math.sin(a)]); B = np.cross(T, up); B /= np.linalg.norm(B); Nn = np.cross(B, T)
        for j in range(tube + 1):
            v = j / tube * 2 * math.pi; n = math.cos(v) * Nn + math.sin(v) * B
            P.append((cx + r * n[0], cy + r * n[1], cz + r * n[2])); N.append(tuple(n)); U.append((t * turns, j / tube))
    for k in range(steps):
        for j in range(tube):
            a = k * (tube + 1) + j; b = a + tube + 1; I += [a, a + 1, b + 1, a, b + 1, b]
    return _fix_winding(_pack(P, N, U, I))

# ------------------------------------------------------------------ scene container
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
REPEAT, CLAMP = 1000, 1001

def build():
    T = render_textures()
    S = Scene(); tx = {}
    def T_(name, wrap=CLAMP, repeat=(1, 1), key=None):
        k = key or name
        if k not in tx: tx[k] = S.tex(T[name]['url'], wrapS=wrap, wrapT=wrap, repeat=repeat)
        return tx[k]
    GOLD, GOLD2 = 0xd9a300, 0xffd34d
    # materials: carved stone, gold inlay, bamboo, vine
    T_('stone', REPEAT, (2, 2)); T_('stoneDark', REPEAT, (1, 1)); T_('plinth', REPEAT, (2, 1))
    stone = S.mat('standard', 0xffffff, .88, .04, map=tx['stone']); stoneD = S.mat('standard', 0xcfd8cf, .9, .03, map=tx['stoneDark']); plinthM = S.mat('standard', 0xffffff, .85, .05, map=tx['plinth'])
    goldM = S.mat('standard', GOLD, .28, .92, emissive=0x3a2800, ei=.6); goldB = S.mat('basic', GOLD2)
    dark = S.mat('standard', 0x07120b, .8, .05); slotdark = S.mat('basic', 0x020604)
    bamboo = S.mat('standard', 0x9ab24a, .55, .05); bambooNode = S.mat('standard', 0x5f7a2c, .6, .05); vine = S.mat('standard', 0x2f7a3a, .7, .02)
    leaf = S.mat('standard', 0x4fae5a, .7, .02, side=2); fly = S.mat('basic', 0xfff3a0)
    root_children = []; add = root_children.append

    def box(w, h, d, p, m, r=0.0, parent=None, action=None, role=''):
        n = node(p, g=S.geo(('b', w, h, d, r), lambda: rbox(w, h, d, r)), m=m, action=action, role=role); (parent if parent is not None else root_children).append(n); return n
    def pl(w, h, p, m, role='', q=(0, 0, 0, 1), key=None, umax=1.0, vmax=1.0):
        n = node(p, q=q, g=S.geo(key or ('pl', w, h, umax, vmax), lambda: plane(w, h, umax, vmax)), m=m, role=role); add(n); return n

    # --- plinth, gold line, lower body
    box(2.95, .22, 1.5, (0, .14, 0), plinthM, .04)
    box(2.9, .02, 1.45, (0, .012, 0), goldB)
    box(2.70, .03, .03, (0, .14, .752), goldB); box(.03, .03, 1.2, (-1.478, .14, 0), goldB); box(.03, .03, 1.2, (1.478, .14, 0), goldB)
    box(2.5, 1.52, 1.15, (0, 1.01, 0), stone, .05)
    # lower door: a carved stone tablet, BITCOIN MONKEYS · FOREVER ON STACKS, with the Xtrata mark
    T_('door'); pl(1.72, 1.04, (0, 1.0, .5785), S.mat('basic', 0xffffff, map=tx['door']))
    box(2.0, .025, .02, (0, 1.62, .58), goldB); box(2.0, .025, .02, (0, .465, .58), goldB)
    # souvenir ticket slot (right) and LAYR slot (left)
    for x, lab in ((.55, 'ticket'), (-.55, 'coin')):
        box(.56, .09, .03, (x, .30, .585), goldM); box(.46, .045, .04, (x, .30, .598), slotdark, .01)
        T_(lab); pl(.36, .09, (x, .39, .581), S.mat('basic', 0xffffff, map=tx[lab]))
    box(2.56, .08, 1.2, (0, 1.81, .02), stoneD, .02); box(2.5, .02, .02, (0, 1.855, .62), goldB)

    # --- upper housing, the doorway, the live screen
    box(2.5, 2.15, .98, (0, 2.925, -.04), stone, .05)
    box(2.16, 1.56, .1, (0, 2.88, .45), stoneD, .03); box(2.06, 1.46, .06, (0, 2.88, .5), dark, .02)
    T_('screen'); add(node((0, 2.88, .535), g=S.geo(('cv', 1.98, 1.36, .035), lambda: curved(1.98, 1.36, .035)), m=S.mat('basic', 0xffffff, map=tx['screen']), role='screenMesh'))
    T_('glass'); add(node((0, 2.88, .548), g=S.geo(('cv', 1.98, 1.36, .035), lambda: curved(1.98, 1.36, .035)), m=S.mat('basic', 0xffffff, map=tx['glass'], transparent=True, depthWrite=False)))
    T_('arch'); add(node((0, 2.88, .566), g=S.geo(('pl', 2.46, 1.845), lambda: plane(2.46, 1.845)), m=S.mat('standard', 0xffffff, .85, .05, map=tx['arch'], transparent=True, alphaTest=.5)))
    # stepped temple crown over the doorway, with a gold edge on every step
    for k, (w, y) in enumerate(((2.3, 3.855), (1.9, 3.92), (1.4, 3.985))):
        box(w, .065, .22 - k * .02, (0, y, .52), stoneD if k % 2 == 0 else stone, .015); box(w + .02, .014, .014, (0, y + .035, .632 - k * .02), goldB)

    # --- header: the carved name, small ParallaX wordmark, a frieze below it
    box(3.62, .55, 1.24, (0, 4.275, 0), stone, .04); box(3.66, .03, 1.26, (0, 4.565, 0), goldM, .01)
    T_('header'); pl(3.4, .5, (0, 4.275, .6225), S.mat('basic', 0xffffff, map=tx['header']))
    box(3.4, .02, .02, (0, 3.995, .6), goldB)

    # --- hanging vines across the header and down both sides of the doorway, with firefly lights
    T_('vines'); T_('vinesTall')
    vinesM = S.mat('basic', 0xffffff, map=tx['vines'], transparent=True, depthWrite=False); vinesT = S.mat('basic', 0xffffff, map=tx['vinesTall'], transparent=True, depthWrite=False)
    pl(3.4, .5, (0, 3.74, .64), vinesM, key=('pl', 3.4, .5, 'v'))
    for sx in (-1, 1): pl(.4, 1.9, (sx * 1.36, 3.0, .625), vinesT, key=('pl', .4, 1.9, 'vt'))
    fgeo = S.geo(('sp', .016), lambda: sphere(.016, 10, 6))
    for k, (x, y, z) in enumerate([(-1.45, 3.55, .66), (-1.05, 3.25, .66), (-.62, 3.72, .66), (-.2, 3.4, .66), (.35, 3.68, .66), (.8, 3.3, .66), (1.25, 3.6, .66), (1.5, 3.1, .66), (-1.2, 2.5, .64), (1.2, 2.45, .64), (-1.28, 1.95, .64), (1.3, 2.0, .64), (-.9, 4.0, .66), (.95, 3.95, .66)]):
        add(node((x, y, z), g=fgeo, m=fly, role='firefly'))

    # --- towers: left a glyph pillar wrapped in vines, right the lit waterfall
    T_('towerL'); T_('towerR'); T_('sideL'); T_('sideR'); T_('waterfall', REPEAT, (1, 2), key='wfFront'); T_('waterfall', REPEAT, (2, 1), key='wfSide')
    for sx in (-1, 1):
        x = sx * 1.53; face = S.mat('basic', 0xffffff, map=tx['towerL' if sx < 0 else 'towerR']); side = S.mat('basic', 0xffffff, map=tx['sideL' if sx < 0 else 'sideR'])
        box(.56, 3.78, 1.12, (x, 2.11, 0), stone, .04); box(.62, .06, 1.18, (x, .27, 0), stoneD, .02)
        pl(.46, 3.5, (x, 2.12, .562), face, key=('pl', .46, 3.5, 'tw'))
        if sx > 0:
            wf = S.mat('basic', 0xffffff, map=tx['wfFront'], transparent=True, depthWrite=False); pl(.40, 3.5, (x, 2.12, .568), wf, role='waterfall', key=('pl', .40, 3.5, 'wf'))
        box(.025, 3.5, .02, (sx * 1.255, 2.12, .565), goldB); box(.02, 3.5, .02, (sx * 1.795, 2.12, .565), goldB)
        xo = sx * 1.812; q = qaxis('y', 90 * sx)
        pl(1.0, 3.5, (xo, 2.12, 0), side, q=q, key=('pl', 1.0, 3.5, 'sd'))
        if sx > 0:
            wfs = S.mat('basic', 0xffffff, map=tx['wfSide'], transparent=True, depthWrite=False); pl(.8, 3.5, (xo + sx * .005, 2.12, 0), wfs, role='waterfall', q=q, key=('pl', .8, 3.5, 'wfs'))

    # --- topper: a turning stone wheel with glyphs and a gold coin at the hub (role core)
    box(.14, .62, .14, (0, 4.87, 0), stoneD, .02); box(.22, .06, .22, (0, 4.6, 0), goldM, .02)
    WR = .62
    T_('wheel'); T_('hub'); wheelM = S.mat('standard', 0xffffff, .85, .05, map=tx['wheel'], transparent=True, alphaTest=.4, side=2); hubM = S.mat('standard', 0xffffff, .3, .6, map=tx['hub'])
    wheel = [node(g=S.geo(('cy', WR, WR, .16, 'z'), lambda: cyl(WR, WR, .16, 56, 'z')), m=stoneD),
             node((0, 0, 0), g=S.geo(('to', WR, .018, 'wr'), lambda: torus(WR, .018, 56, 8, 'z')), m=goldM),
             node((0, 0, .085), g=S.geo(('di', WR - .01), lambda: disc(WR - .01, 56)), m=wheelM),
             node((0, 0, -.085), q=qaxis('y', 180), g=S.geo(('di', WR - .01), lambda: disc(WR - .01, 56)), m=wheelM),
             node(g=S.geo(('cy', .21, .21, .24, 'z'), lambda: cyl(.21, .21, .24, 40, 'z')), m=goldM),
             node((0, 0, .121), g=S.geo(('di', .19), lambda: disc(.19, 40)), m=hubM), node((0, 0, -.121), q=qaxis('y', 180), g=S.geo(('di', .19), lambda: disc(.19, 40)), m=hubM)]
    add(node((0, 5.28, 0), role='core', children=wheel))
    for sx in (-1, 1): box(.05, .5, .05, (sx * .3, 4.93, 0), goldM, .01)

    # --- deck with the five buttons (tilted group)
    deck_kids = []
    box(2.4, .5, .16, (0, 0, 0), stoneD, .03, parent=deck_kids); box(2.34, .44, .02, (0, 0, .09), dark, 0, parent=deck_kids); box(2.4, .02, .02, (0, .255, .09), goldB, parent=deck_kids)
    # Each button is a fixed gold bezel plus a moving cap group (cap + label, role deck*): the page slides the cap in along the deck's z axis when pressed and lets it spring back out.
    def rect_button(x, w, topcol, action, lbl, role):
        T_(lbl); fh = (w - .05) / 2.5
        box(w, .22, .07, (x, -.02, .13), goldM, .025, parent=deck_kids, action=action)
        cap = node((0, 0, 0), g=S.geo(('b', round(w - .025, 3), .2, .065, .025), lambda: rbox(w - .025, .2, .065, .025)), m=S.mat('standard', topcol, .6, .05), action=action)
        lab = node((0, 0, .036), g=S.geo(('pl', round(w - .05, 3), round(fh, 3)), lambda: plane(w - .05, fh)), m=S.mat('basic', 0xffffff, map=tx[lbl]), action=action)
        deck_kids.append(node((x, -.02, .18), role=role, action=action, children=[cap, lab]))
    rect_button(-.92, .40, 0xc9b27a, 'pays', 'lblPays', 'deckPays'); rect_button(-.48, .42, 0xc9b27a, 'betDown', 'lblDown', 'deckDown')
    rect_button(-.03, .42, 0xc9b27a, 'betUp', 'lblUp', 'deckUp'); rect_button(.42, .50, 0x8fd49a, 'auto', 'lblAuto', 'deckAuto')
    T_('spin'); sx0 = .98
    deck_kids.append(node((sx0, -.02, .13), g=S.geo(('cy', .25, .25, .07, 'z'), lambda: cyl(.25, .25, .07, 40, 'z')), m=goldM, action='spin'))
    spin_cap = node((0, 0, 0), g=S.geo(('cy', .225, .225, .065, 'z'), lambda: cyl(.225, .225, .065, 40, 'z')), m=S.mat('standard', GOLD2, .3, .5), action='spin')
    spin_lab = node((0, 0, .036), g=S.geo(('di', .205), lambda: disc(.205)), m=S.mat('basic', 0xffffff, map=tx['spin']), action='spin')
    deck_kids.append(node((sx0, -.02, .18), role='spinPhysical', action='spin', children=[spin_cap, spin_lab]))
    add(node((0, 1.76, .62), q=qaxis('x', math.degrees(-.72)), children=deck_kids))

    # --- lever: a vine-wrapped bamboo pole with a carved stone knob (role lever, pivots on rotation.x)
    L = []
    def lv(g, m, p=(0, 0, 0), q=(0, 0, 0, 1), s=(1, 1, 1)): L.append(node(p, q=q, s=s, g=g, m=m, action='spin'))
    lv(S.geo(('cy', .09, .09, .24, 'x'), lambda: cyl(.09, .09, .24, 28, 'x')), stoneD)
    lv(S.geo(('to', .092, .012, 'pv', 'x'), lambda: torus(.092, .012, 28, 6, 'x')), goldM, (0, 0, 0))
    lv(S.geo(('cy', .042, .042, 1.0), lambda: cyl(.042, .042, 1.0, 20)), bamboo, (0, .55, 0))
    ring = S.geo(('to', .044, .0105, 'bam'), lambda: torus(.044, .0105, 20, 6))
    for k in range(5): lv(ring, bambooNode, (0, .14 + k * .2, 0))
    lv(S.geo(('hx', .056, .011, .86, 4.5), lambda: helix(.056, .011, .86, 4.5)), vine, (0, .55, 0))
    lf = S.geo(('sp', .035), lambda: sphere(.035, 12, 8))
    for k, (y, a) in enumerate(((.22, 0.5), (.42, 2.6), (.62, 4.7), (.8, 1.4), (.34, 3.7))): lv(lf, leaf, (math.cos(a) * .075, y, math.sin(a) * .075), s=(1.6, .35, 1.0))
    lv(S.geo(('sp', .11), lambda: sphere(.11, 32, 18)), stone, (0, 1.12, 0)); lv(S.geo(('to', .11, .012, 'kn'), lambda: torus(.11, .012, 32, 6)), goldM, (0, 1.12, 0))
    lv(S.geo(('cy', .052, .052, .05), lambda: cyl(.052, .052, .05, 20)), stoneD, (0, 1.03, 0))
    add(node((2.0, 2.4, .2), role='lever', children=L))
    box(.08, .5, .5, (1.86, 2.4, .2), stoneD, .02); box(.09, .04, .5, (1.86, 2.66, .2), goldM, .01)

    root = node(children=root_children)
    return {'root': root, 'geometries': S.geos, 'materials': S.mats, 'textures': S.texs}

def main():
    model = build()
    out = os.path.join(HERE, 'monkey-hash-model.json'); raw = json.dumps(model, separators=(',', ':')); open(out, 'w').write(raw)
    print('wrote', out, 'raw %.2f MB' % (len(raw) / 1e6), 'gzip %.2f MB' % (len(gzip.compress(raw.encode(), 9)) / 1e6), 'geoms', len(model['geometries']), 'mats', len(model['materials']), 'texs', len(model['textures']))

if __name__ == '__main__':
    main()
