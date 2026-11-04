#!/usr/bin/env python3
"""Nine Lives cabinet model builder (LEO Cats · ParallaX Casino).

Writes nine-lives-model.json in the packed-cabinet format the ParallaX Casino room loads
({root, geometries, materials, textures}). Rerunnable:  python3 tools/nine-lives/model/build_model.py
Needs numpy and Playwright (Chromium) for the textures. Inputs in ./assets, drawn exactly as supplied (never redrawn or recoloured):
  xtrata.svg     the Xtrata mark (lower door)
  parallax.svg   the ParallaX Casino wordmark (marquee foot, far smaller than the machine's name)
Everything else is generated: textures.js paints the night-rooftop art, this file builds the geometry.
Named parts the room and the test page look for are listed in NOTES-cabinet.md.
"""
import base64, gzip, json, math, os, random, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
A = lambda *p: os.path.join(HERE, 'assets', *p)

# ------------------------------------------------------------------ marquee layout (shared by the texture painter and the geometry)
# The header sign is a 1700 x 250 texture on a 3.4 x 0.5 plane, so 1 texture px = 0.002 world units.
MQ_W, MQ_H, MQ_BASE, MQ_PX = 1700, 250, 216, .002
MQ_Y = 4.275          # header centre height
MQ_Z = .6225          # header front face


def marquee_layout():
    """Rooftop silhouettes left and right of the machine's name. Windows are either static (painted lit or dark) or 'flicker':
    a flicker window is painted dark in the texture and has a lit overlay mesh named win0..winN that the host can toggle."""
    left = [dict(x=52, w=96, top=118, roof='flat', chim=[24, 68]), dict(x=154, w=84, top=92, roof='gable', chim=[58]),
            dict(x=244, w=100, top=132, roof='flat', chim=[50]), dict(x=350, w=80, top=106, roof='gable', chim=[22])]
    right = [dict(x=1272, w=84, top=110, roof='gable', chim=[60]), dict(x=1362, w=100, top=128, roof='flat', chim=[30, 74]),
             dict(x=1468, w=84, top=90, roof='gable', chim=[22]), dict(x=1558, w=92, top=122, roof='flat', chim=[48])]
    buildings = left + right
    rnd = random.Random(7)
    cands = []
    for b in buildings:
        ww, wh = 20, 26
        cols = int((b['w'] - 16) // 30)
        x0 = b['x'] + (b['w'] - (cols * 30 - 10)) / 2
        y = b['top'] + (40 if b['roof'] == 'gable' else 24)
        while y + wh <= MQ_BASE - 6:
            for i in range(cols): cands.append(dict(x=round(x0 + i * 30, 1), y=y, w=ww, h=wh))
            y += 38
    n_flick = 14
    step = len(cands) / n_flick
    flick = {int(i * step + step / 2) for i in range(n_flick)}
    wins = []
    for k, c in enumerate(cands):
        c = dict(c); c['mode'] = 'flicker' if k in flick else ('lit' if rnd.random() < .35 else 'dark'); wins.append(c)
    return dict(buildings=buildings, windows=wins, base=MQ_BASE)

# ------------------------------------------------------------------ textures (Chromium)
def render_textures(layout):
    from playwright.sync_api import sync_playwright
    b64 = lambda path: base64.b64encode(open(path, 'rb').read()).decode()
    args = {'xtrata': b64(A('xtrata.svg')), 'parallax': b64(A('parallax.svg')), 'marquee': layout}
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

# ------------------------------------------------------------------ extra geometry for Nine Lives
def sphere(r=1.0, ws=24, hs=16):
    P, N, U, I = [], [], [], []
    for j in range(hs + 1):
        v = j / hs; th = v * math.pi
        for i in range(ws + 1):
            u = i / ws; ph = u * 2 * math.pi
            n = (math.sin(th) * math.cos(ph), math.cos(th), math.sin(th) * math.sin(ph))
            P.append((n[0] * r, n[1] * r, n[2] * r)); N.append(n); U.append((u, 1 - v))
    for j in range(hs):
        for i in range(ws):
            a = j * (ws + 1) + i; b = a + ws + 1; I += [a, a + 1, b + 1, a, b + 1, b]
    return _fix_winding(_pack(P, N, U, I))


def sweep(path, radii, seg=16, normal=(0, 0, 1), cap_start=False, cap_end=False):
    """A tube swept along a planar polyline; `normal` is the plane's normal. Radius varies per point."""
    path = np.asarray(path, float); radii = np.asarray(radii, float); n = len(path)
    T = np.gradient(path, axis=0); T /= np.linalg.norm(T, axis=1)[:, None]
    N1 = np.asarray(normal, float); N1 /= np.linalg.norm(N1)
    P, N, U, I = [], [], [], []
    for i in range(n):
        N2 = np.cross(T[i], N1); N2 /= np.linalg.norm(N2)
        for j in range(seg + 1):
            a = 2 * math.pi * j / seg; d = math.cos(a) * N1 + math.sin(a) * N2
            P.append(path[i] + radii[i] * d); N.append(d); U.append((i / (n - 1), j / seg))
    for i in range(n - 1):
        for j in range(seg):
            a = i * (seg + 1) + j; b = a + seg + 1; I += [a, b, a + 1, a + 1, b, b + 1]
    for end, on in ((0, cap_start), (n - 1, cap_end)):
        if not on: continue
        c = len(P); sgn = -1 if end == 0 else 1
        P.append(path[end]); N.append(T[end] * sgn); U.append((.5, .5))
        for j in range(seg + 1):
            a = 2 * math.pi * j / seg; N2 = np.cross(T[end], N1); N2 /= np.linalg.norm(N2)
            P.append(path[end] + radii[end] * (math.cos(a) * N1 + math.sin(a) * N2)); N.append(T[end] * sgn); U.append((.5 + .5 * math.cos(a), .5 + .5 * math.sin(a)))
        for j in range(seg): I += [c, c + 1 + j, c + 2 + j]
    return _fix_winding(_pack(P, N, U, I))


def prism(w, h, d):
    """Triangular prism (a gable): base on y=-h/2, apex at y=+h/2, depth d along z."""
    hw, hh, hd = w / 2, h / 2, d / 2
    P, N, U, I = [], [], [], []
    def face(pts, n, uvs):
        base = len(P)
        for p, uv in zip(pts, uvs): P.append(p); N.append(n); U.append(uv)
        for k in range(1, len(pts) - 1): I.extend([base, base + k, base + k + 1])
    face([(-hw, -hh, hd), (hw, -hh, hd), (0, hh, hd)], (0, 0, 1), [(0, 0), (1, 0), (.5, 1)])
    face([(hw, -hh, -hd), (-hw, -hh, -hd), (0, hh, -hd)], (0, 0, -1), [(0, 0), (1, 0), (.5, 1)])
    ln = math.hypot(hw, h); nl = (-h / ln, hw / ln, 0); nr = (h / ln, hw / ln, 0)
    face([(-hw, -hh, hd), (0, hh, hd), (0, hh, -hd), (-hw, -hh, -hd)], nl, [(0, 0), (1, 0), (1, 1), (0, 1)])
    face([(0, hh, hd), (hw, -hh, hd), (hw, -hh, -hd), (0, hh, -hd)], nr, [(0, 0), (1, 0), (1, 1), (0, 1)])
    face([(-hw, -hh, -hd), (hw, -hh, -hd), (hw, -hh, hd), (-hw, -hh, hd)], (0, -1, 0), [(0, 0), (1, 0), (1, 1), (0, 1)])
    return _fix_winding(_pack(P, N, U, I))


def catmull(pts, per=10):
    pts = [np.asarray(p, float) for p in pts]; out = []
    ext = [pts[0] * 2 - pts[1]] + pts + [pts[-1] * 2 - pts[-2]]
    for i in range(1, len(ext) - 2):
        p0, p1, p2, p3 = ext[i - 1], ext[i], ext[i + 1], ext[i + 2]
        for k in range(per):
            t = k / per
            out.append(.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3))
    out.append(pts[-1]); return np.array(out)


# ------------------------------------------------------------------ build
def build():
    layout = marquee_layout()
    T = render_textures(layout)
    S = Scene()
    tx = {}
    def T_(name, **kw): tx[name] = S.tex(T[name]['url'], **kw); return tx[name]
    TEAL, GOLD, TEAL_HI, MOONC = 0x12b5a6, 0xffc765, 0x7ff3ea, 0xe8f6f0
    # materials
    body = S.mat('standard', 0x0b1a3a, .3, .55); steel = S.mat('standard', 0x9fb3c2, .18, .92); chrome = S.mat('standard', 0xb7c6d6, .14, .95)
    dark = S.mat('standard', 0x03060e, .4, .3); rubber = S.mat('standard', 0x050308, .8, .05); darkchrome = S.mat('standard', 0x0e1c38, .22, .85)
    teal = S.mat('basic', TEAL); gold = S.mat('basic', GOLD); slotdark = S.mat('basic', 0x01030a)
    slate = S.mat('standard', 0x16233f, .55, .35); roof = S.mat('standard', 0x2d4a78, .5, .3); earm = S.mat('standard', 0x16306a, .4, .4); brick = S.mat('standard', 0x1b2c4d, .8, .1); terracotta = S.mat('standard', 0x9a5a3c, .8, .05); roofplate = S.mat('standard', 0x0c1a36, .6, .3)
    glass = S.mat('standard', 0x0b2038, .05, .6, transparent=True, opacity=.14, depthWrite=False)
    root_children = []
    add = root_children.append

    def box(w, h, d, p, m, r=0.0, parent=None, action=None, role='', q=(0, 0, 0, 1), s=(1, 1, 1)):
        n = node(p, q=q, s=s, g=S.geo(('b', w, h, d, r), lambda: rbox(w, h, d, r)), m=m, action=action, role=role); (parent if parent is not None else root_children).append(n); return n

    # --- plinth, floor glow, lower body
    box(2.95, .22, 1.5, (0, .14, 0), darkchrome, .04)
    box(2.9, .02, 1.45, (0, .012, 0), teal)
    box(2.70, .03, .03, (0, .14, .752), teal); box(.03, .03, 1.2, (-1.478, .14, 0), teal); box(.03, .03, 1.2, (1.478, .14, 0), teal)
    box(2.5, 1.52, 1.15, (0, 1.01, 0), body, .05)
    # lower door plate: Xtrata mark + LEO CATS · FOREVER ON STACKS
    T_('door'); add(node((0, 1.0, .5785), g=S.geo(('pl', 1.72, 1.04), lambda: plane(1.72, 1.04)), m=S.mat('basic', 0xffffff, map=tx['door'])))
    box(2.0, .025, .02, (0, 1.62, .58), teal); box(2.0, .025, .02, (0, .465, .58), gold)
    # souvenir ticket slot (right) and LAYR coin slot (left)
    for x, rim, lab in ((.55, teal, 'ticket'), (-.55, gold, 'coin')):
        box(.56, .09, .03, (x, .30, .585), rim); box(.46, .045, .04, (x, .30, .598), slotdark, .01)
        T_(lab); add(node((x, .39, .581), g=S.geo(('pl', .36, .09), lambda: plane(.36, .09)), m=S.mat('basic', 0xffffff, map=tx[lab])))
    box(2.56, .08, 1.2, (0, 1.81, .02), steel, .02)       # shelf under the deck

    # --- upper housing + the attic window: wooden frame, a sill, a small gable above. The play area itself is never covered.
    box(2.5, 2.15, .98, (0, 2.925, -.04), body, .05)
    box(2.06, 1.46, .06, (0, 2.88, .50), dark, .01)
    T_('screen'); add(node((0, 2.88, .535), g=S.geo(('cv', 1.98, 1.36, .035), lambda: curved(1.98, 1.36, .035)), m=S.mat('basic', 0xffffff, map=tx['screen']), role='screenMesh'))
    T_('glass'); add(node((0, 2.88, .548), g=S.geo(('cv', 1.98, 1.36, .035), lambda: curved(1.98, 1.36, .035)), m=S.mat('basic', 0xffffff, map=tx['glass'], transparent=True, depthWrite=False)))
    T_('wood', wrapS=1000, wrapT=1000); T_('woodV', wrapS=1000, wrapT=1000)
    wood = S.mat('standard', 0xffffff, .78, 0., map=tx['wood']); woodV = S.mat('standard', 0xffffff, .78, 0., map=tx['woodV']); woodLight = S.mat('standard', 0xe8b898, .72, 0., map=tx['wood'])
    OPW, OPH, BAR, FZ, FD = 2.0, 1.38, .15, .52, .16       # opening, bar thickness, frame centre z and depth
    box(OPW, BAR, FD, (0, 2.88 + OPH / 2 + BAR / 2, FZ), wood, .012); box(OPW, BAR, FD, (0, 2.88 - OPH / 2 - BAR / 2, FZ), wood, .012)
    for sx in (-1, 1): box(.14, OPH + 2 * BAR, FD, (sx * (OPW / 2 + .07), 2.88, FZ), woodV, .012)
    for sx in (-1, 1):
        for sy in (-1, 1): box(.19, .19, FD + .03, (sx * (OPW / 2 + .07), 2.88 + sy * (OPH / 2 + BAR / 2), FZ), woodLight, .02)
    box(2.62, .08, .30, (0, 2.045, .56), wood, .012)         # the sill
    for sx in (-1, 1): box(.08, .12, .22, (sx * 1.22, 1.975, .53), woodV, .01)
    pw, ph, pd = 2.56, .26, .20
    add(node((0, 2.88 + OPH / 2 + BAR + ph / 2 + .0, FZ), g=S.geo(('pr', pw, ph, pd), lambda: prism(pw, ph, pd)), m=roof))   # gable over the window
    ang = math.degrees(math.atan2(ph, pw / 2)); ln = math.hypot(pw / 2, ph)
    for sx in (-1, 1):
        box(ln, .022, .022, (sx * pw / 4, 2.88 + OPH / 2 + BAR + ph / 2, FZ + pd / 2 + .002), teal, q=qaxis('z', -sx * ang))

    # --- header: marquee sign, rooftop chimneys, cat ears at the top corners
    box(3.62, .55, 1.24, (0, MQ_Y, 0), body, .04); box(3.66, .03, 1.26, (0, 4.565, 0), roofplate, .01)
    box(3.66, .032, .022, (0, 4.566, .629), teal); box(3.66, .032, .022, (0, 4.566, -.629), teal); box(.022, .032, 1.26, (-1.83, 4.566, 0), teal); box(.022, .032, 1.26, (1.83, 4.566, 0), teal)
    T_('header'); add(node((0, MQ_Y, MQ_Z), g=S.geo(('pl', 3.4, .5), lambda: plane(3.4, .5)), m=S.mat('basic', 0xffffff, map=tx['header'])))
    box(3.4, .02, .02, (0, 3.995, .6), gold)
    # flicker windows: lit overlays on the painted dark panes. Role win0..winN; the host toggles .visible (see NOTES-cabinet.md)
    litA = S.mat('basic', GOLD); litB = S.mat('basic', TEAL_HI); k = 0
    for w in layout['windows']:
        if w['mode'] != 'flicker': continue
        cx = (w['x'] + w['w'] / 2 - MQ_W / 2) * MQ_PX; cy = MQ_Y + (MQ_H / 2 - (w['y'] + w['h'] / 2)) * MQ_PX
        gw, gh = round((w['w'] - 4) * MQ_PX, 4), round((w['h'] - 4) * MQ_PX, 4)
        add(node((cx, cy, MQ_Z + .003), g=S.geo(('pl', gw, gh, 'win'), lambda: plane(gw, gh)), m=litA if k % 3 else litB, role=f'win{k}', visible=(k % 3 != 2)))
        k += 1
    N_WIN = k
    ear_g = S.geo(('cy', 0, .2, .38, 4), lambda: cyl(0, .2, .38, 4, 'y', True)); ear_in = S.geo(('cy', 0, .12, .24, 4), lambda: cyl(0, .12, .24, 4, 'y', True))
    for sx in (-1, 1):
        x = sx * 1.69
        add(node((x, 4.58 + .19, 0), q=qaxis('z', -sx * 11), s=(1, 1, .42), g=ear_g, m=earm))
        add(node((x + sx * .005, 4.58 + .15, .045), q=qaxis('z', -sx * 11), s=(1, 1, .42), g=ear_in, m=teal))
    for x in (-1.18, .80, 1.26):                   # chimneys with pots on the roof of the header
        box(.16, .30, .22, (x, 4.73, -.14), brick, .01); box(.21, .04, .27, (x, 4.90, -.14), slate, .008)
        for dx in (-.045, .045): add(node((x + dx, 4.985, -.14), g=S.geo(('cy', .035, .042, .13), lambda: cyl(.035, .042, .13, 20)), m=terracotta))

    # --- side towers: night rooftops painted on the glass (no animated rain on this machine)
    T_('towerSign'); T_('sideSign')
    sign_f = S.mat('basic', 0xffffff, map=tx['towerSign']); sign_s = S.mat('basic', 0xffffff, map=tx['sideSign'])
    for sx in (-1, 1):
        x = sx * 1.53
        box(.56, 3.78, 1.12, (x, 2.11, 0), body, .04)
        box(.62, .06, 1.18, (x, .27, 0), steel, .02)
        box(.64, .07, 1.2, (x, 4.035, 0), darkchrome, .02)
        for dz in (-.28, .12): add(node((x + sx * .1, 4.1 + .05, dz), g=S.geo(('cy', .042, .05, .15), lambda: cyl(.042, .05, .15, 20)), m=terracotta))
        add(node((x, 2.12, .562), g=S.geo(('pl', .46, 3.5), lambda: plane(.46, 3.5)), m=sign_f))
        add(node((x, 2.12, .572), g=S.geo(('pl', .46, 3.5, 'g'), lambda: plane(.46, 3.5)), m=glass))
        box(.025, 3.5, .02, (sx * 1.255, 2.12, .565), teal); box(.02, 3.5, .02, (sx * 1.795, 2.12, .565), gold)
        xo = sx * 1.812; q = qaxis('y', 90 * sx)
        add(node((xo, 2.12, 0), q=q, g=S.geo(('pl', 1.0, 3.5), lambda: plane(1.0, 3.5)), m=sign_s))
        add(node((xo + sx * .010, 2.12, 0), q=q, g=S.geo(('pl', 1.0, 3.5, 'g'), lambda: plane(1.0, 3.5)), m=glass))

    # --- topper (role crest): a turning crescent moon with a cat sitting in its curve, lit teal from behind.
    # The node origin is the moon's centre, so the room's rotation.y turn is about the vertical axis through it.
    box(.1, .14, .1, (0, 4.66, 0), chrome, .02)
    add(node((0, 4.6, 0), g=S.geo(('cy', .3, .3, .05), lambda: cyl(.3, .3, .05, 40)), m=darkchrome))
    add(node((0, 4.635, 0), g=S.geo(('to', .3, .014), lambda: torus(.3, .014, 48, 8)), m=teal))
    RM, RMAX = .42, .10
    arc = [(RM * math.cos(math.radians(a)), RM * math.sin(math.radians(a)), 0) for a in np.linspace(145, 395, 96)]
    rad = [RMAX * math.sin(math.pi * i / 95) ** .8 + .006 for i in range(96)]
    moon_m = S.mat('standard', MOONC, .5, .15, emissive=0x2cd6c4, ei=.8)
    kids = [node(g=S.geo('moon', lambda: sweep(arc, rad, 20, (0, 0, 1))), m=moon_m)]
    T_('halo'); halo = S.mat('basic', 0xffffff, map=tx['halo'], transparent=True, side=2, depthWrite=False); hg = S.geo(('pl', 1.0, 1.0, 'halo'), lambda: plane(1.0, 1.0))
    kids += [node(g=hg, m=halo), node(q=qaxis('y', 90), g=hg, m=halo)]
    # the cat: navy body with a teal rim hull (back-faced copies slightly larger) so it reads as backlit
    inner = RM - RMAX; bh = .085; body_c = -inner + bh; body_top = -inner + 2 * bh; hr = .048; head_c = body_top - .012 + hr * .85
    cat_m = S.mat('standard', 0x050b1d, .55, .1); rim_m = S.mat('basic', TEAL, side=1)
    unit = S.geo(('sp', 1), lambda: sphere(1.0, 24, 16))
    def blob(p, r3, mat=cat_m, hull=True):
        kids.append(node(p, s=r3, g=unit, m=mat))
        if hull and mat is cat_m: kids.append(node(p, s=tuple(v * 1.16 + .004 for v in r3), g=unit, m=rim_m))
    blob((0, body_c, 0), (.068, bh, .06)); blob((0, head_c, .008), (hr, hr * .92, hr))
    ear = S.geo(('cy', 0, .03, .07, 4), lambda: cyl(0, .03, .07, 4, 'y', True))
    for sx in (-1, 1):
        kids.append(node((sx * .03, head_c + hr * .8 + .02, .006), q=qaxis('z', -sx * 16), s=(1, 1, .5), g=ear, m=cat_m))
        kids.append(node((sx * .03, head_c + hr * .8 + .02, .006), q=qaxis('z', -sx * 16), s=(1.35, 1.3, .7), g=S.geo(('cy', 0, .03, .07, 4, 'h'), lambda: cyl(0, .03, .07, 4, 'y', True)), m=rim_m))
    for sx in (-1, 1): kids.append(node((sx * .021, head_c + .006, hr * .94), s=(.011, .013, .008), g=unit, m=S.mat('basic', TEAL_HI)))
    tail = catmull([(x, y, 0) for x, y in [(.07, -inner + .03), (.14, -inner + .008), (.20, -inner + .045), (.235, -inner + .11), (.225, -inner + .17), (.19, -inner + .205)]], 8)
    tr = np.linspace(.019, .011, len(tail))
    kids.append(node(g=S.geo('cat-tail', lambda: sweep(tail, tr, 10, (0, 0, 1), True, True)), m=cat_m))
    kids.append(node(g=S.geo('cat-tail-rim', lambda: sweep(tail, tr * 1.55 + .003, 10, (0, 0, 1), True, True)), m=rim_m))
    for (x, y, z) in [(-.5, .2, .04), (.52, .19, -.03), (-.28, .31, .02), (.3, .3, -.02), (-.6, -.05, 0), (.62, -.08, .03)]:
        kids.append(node((x, y, z), s=(.013, .013, .013), g=unit, m=S.mat('basic', 0xfff3c8)))
    add(node((0, 5.2, 0), role='crest', children=kids))

    # --- deck with the five buttons (tilted group). Labels: POUNCE, + / - TREATS, AUTO-PROWL, PAWS.
    deck_kids = []
    box(2.4, .5, .16, (0, 0, 0), darkchrome, .03, parent=deck_kids)
    box(2.34, .44, .02, (0, 0, .09), dark, 0, parent=deck_kids)
    def rect_button(x, w, topcol, action, lbl):
        T_(lbl); fh = (w - .05) / 2.4
        box(w, .22, .07, (x, -.02, .13), steel, .025, parent=deck_kids, action=action)
        box(w - .025, .2, .065, (x, -.02, .18), S.mat('standard', topcol, .25, .3), .025, parent=deck_kids, action=action)
        deck_kids.append(node((x, -.02, .216), g=S.geo(('pl', round(w - .05, 3), round(fh, 3)), lambda: plane(w - .05, fh)), m=S.mat('basic', 0xffffff, map=tx[lbl]), action=action))
    rect_button(-.92, .40, 0xf3e9cf, 'pays', 'lblPays'); rect_button(-.48, .38, 0xf3e9cf, 'betDown', 'lblDown')
    rect_button(-.05, .38, 0xf3e9cf, 'betUp', 'lblUp'); rect_button(.40, .50, GOLD, 'auto', 'lblAuto')
    T_('spin'); sx0 = .92
    deck_kids.append(node((sx0, -.02, .13), g=S.geo(('cy', .25, .25, .07, 'z'), lambda: cyl(.25, .25, .07, 40, 'z')), m=steel, action='spin'))
    deck_kids.append(node((sx0, -.02, .18), g=S.geo(('cy', .225, .225, .065, 'z'), lambda: cyl(.225, .225, .065, 40, 'z')), m=S.mat('standard', TEAL, .25, .3), action='spin', role='spinPhysical'))
    deck_kids.append(node((sx0, -.02, .216), g=S.geo(('di', .205), lambda: disc(.205)), m=S.mat('basic', 0xffffff, map=tx['spin']), action='spin'))
    add(node((0, 1.76, .62), q=qaxis('x', math.degrees(-.72)), children=deck_kids))

    # --- the lever (role lever): a curved tail raised like a cat's, glowing teal tip. Pivots on rotation.x at its base.
    L = []
    def lv(g, m, p=(0, 0, 0), q=(0, 0, 0, 1), s=(1, 1, 1)): L.append(node(p, q=q, s=s, g=g, m=m, action='spin'))
    lv(S.geo(('cy', .09, .09, .24, 'x'), lambda: cyl(.09, .09, .24, 28, 'x')), chrome)
    lv(S.geo(('cy', .105, .105, .03, 'x'), lambda: cyl(.105, .105, .03, 28, 'x')), S.mat('standard', TEAL, .3, .6), (.11, 0, 0))
    pts = [(0, 0, 0), (0, .20, 0), (0, .40, -.045), (0, .60, -.025), (0, .76, .055), (0, .87, .13), (0, .91, .20), (0, .87, .255)]
    pts = [(0, y, z) for (_, y, z) in pts]
    tail_path = catmull(pts, 9)
    tail_r = np.linspace(.056, .028, len(tail_path))
    tail_m = S.mat('standard', 0x0a1a3a, .45, .35); ring_m = S.mat('basic', TEAL)
    lv(S.geo('tail-lever', lambda: sweep(tail_path, tail_r, 20, (1, 0, 0), True, True)), tail_m)
    for f in (.14, .27, .40, .53, .66, .79):          # teal stripes around the tail, like a tabby's
        i = int(f * (len(tail_path) - 1)); p = tail_path[i]; tg = tail_path[min(i + 1, len(tail_path) - 1)] - tail_path[max(i - 1, 0)]
        th = math.degrees(math.atan2(tg[2], tg[1]))
        lv(S.geo(('to', round(float(tail_r[i]), 3), .009, 'st'), lambda r=float(tail_r[i]): torus(r, .009, 24, 6)), ring_m, (0, float(p[1]), float(p[2])), qaxis('x', th))
    tip = tail_path[-1]
    lv(S.geo(('sp', 1), lambda: sphere(1.0, 24, 16)), S.mat('basic', TEAL_HI), (0, float(tip[1]), float(tip[2])), s=(.05, .05, .05))
    lv(S.geo(('sp', 1), lambda: sphere(1.0, 24, 16)), S.mat('basic', TEAL, transparent=True, opacity=.28, depthWrite=False), (0, float(tip[1]), float(tip[2])), s=(.095, .095, .095))
    add(node((2.0, 2.4, .2), role='lever', children=L))
    box(.08, .5, .5, (1.86, 2.4, .2), chrome, .02)

    root = node(children=root_children)
    model = {'root': root, 'geometries': S.geos, 'materials': S.mats, 'textures': S.texs}
    return model, N_WIN


def main():
    model, n_win = build()
    out = os.path.join(HERE, 'nine-lives-model.json')
    raw = json.dumps(model, separators=(',', ':'))
    open(out, 'w').write(raw)
    gz = len(gzip.compress(raw.encode(), 9))
    print('wrote', out, 'raw %.2f MB' % (len(raw) / 1e6), 'gzip %.2f MB' % (gz / 1e6), 'flicker windows', n_win,
          'geoms', len(model['geometries']), 'mats', len(model['materials']), 'texs', len(model['textures']))


if __name__ == '__main__':
    main()
