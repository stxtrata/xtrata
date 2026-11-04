#!/usr/bin/env python3
"""The Stack cabinet model builder.

Writes the-stack-model.json in the packed-cabinet format the ParallaX Casino room loads ({root, geometries, materials,
textures}). Rerunnable; needs numpy (and CairoSVG or node+sharp for textures.py, no browser).
Named parts the room expects: screenMesh, core (the turning stack of slabs, each the official Stacks logo outline
extruded), spinPhysical (the orange STACK cap), lever (matte black, orange knob; pivots on rotation.x) and deck buttons
with userData actions spin, betUp, betDown, auto, pays. Extra roles the test page animates (the room may ignore them):
potBoard (the topper display a host can map to the game's live topper canvas), tickerPanel (the two side panels a host can
map to the game's live ticker canvas), edge / edge2 (purple and orange edge lights that pulse with each spin and each new
block), slab (the three logo slabs, which glow), buttonCap (the four small caps) and lit (the marquee).
Geometry helpers follow tools/the-halving/model/build_model.py; sphere, svg_subpaths, earclip and extrude_logo are new.
"""
import gzip, json, math, os, re
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


def sphere(r, seg=24, rings=16):
    P, N, U, I = [], [], [], []
    for j in range(rings + 1):
        v = j / rings; th = v * math.pi
        for i in range(seg + 1):
            u = i / seg; ph = u * 2 * math.pi
            n = (math.sin(th) * math.cos(ph), math.cos(th), math.sin(th) * math.sin(ph)); P.append(tuple(r * c for c in n)); N.append(n); U.append((u, 1 - v))
    for j in range(rings):
        for i in range(seg):
            a = j * (seg + 1) + i; b = a + seg + 1; I += [a, b, a + 1, a + 1, b, b + 1]
    return _fix_winding(_pack(P, N, U, I))


# ---- the Stacks logo, extruded: its outline is read from the official SVG path (art/logos/stacks.svg), never redrawn
def svg_subpaths(d, curve_steps=6):
    """Flatten an SVG path (absolute M, L, H, V, C, Z, as the Stacks file uses) into closed polygons."""
    toks = re.findall(r'[MLHVCZmlhvcz]|-?\d*\.?\d+(?:e-?\d+)?', d); polys, cur, i, cmd, x, y = [], [], 0, None, 0.0, 0.0
    num = lambda: float(toks[i])
    while i < len(toks):
        tk = toks[i]
        if re.match(r'[A-Za-z]', tk): cmd = tk; i += 1
        if cmd in 'Zz':
            if cur: polys.append(cur); cur = []
            continue
        if cmd == 'M': x, y = float(toks[i]), float(toks[i + 1]); i += 2; cur = [(x, y)]; cmd = 'L'
        elif cmd == 'L': x, y = float(toks[i]), float(toks[i + 1]); i += 2; cur.append((x, y))
        elif cmd == 'H': x = float(toks[i]); i += 1; cur.append((x, y))
        elif cmd == 'V': y = float(toks[i]); i += 1; cur.append((x, y))
        elif cmd == 'C':
            x1, y1, x2, y2, x3, y3 = (float(toks[i + k]) for k in range(6)); i += 6
            for s in range(1, curve_steps + 1):
                t = s / curve_steps; mt = 1 - t
                cur.append((mt ** 3 * x + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t ** 3 * x3, mt ** 3 * y + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t ** 3 * y3))
            x, y = x3, y3
        else: raise ValueError('path command ' + str(cmd))
    if cur: polys.append(cur)
    out = []
    for p in polys:  # drop repeated points
        q = [p[0]]
        for pt in p[1:]:
            if abs(pt[0] - q[-1][0]) + abs(pt[1] - q[-1][1]) > 1e-4: q.append(pt)
        if abs(q[0][0] - q[-1][0]) + abs(q[0][1] - q[-1][1]) < 1e-4: q.pop()
        out.append(q)
    return out


def _area(p): return sum(p[i][0] * p[(i + 1) % len(p)][1] - p[(i + 1) % len(p)][0] * p[i][1] for i in range(len(p))) / 2


def earclip(poly):
    """Triangulate a simple polygon (counter-clockwise) by ear clipping; returns index triples."""
    idx = list(range(len(poly))); tris = []
    def cross(o, a, b): return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    def inside(p, a, b, c): return cross(a, b, p) >= -1e-12 and cross(b, c, p) >= -1e-12 and cross(c, a, p) >= -1e-12
    guard = 0
    while len(idx) > 3 and guard < 20000:
        guard += 1; n = len(idx); found = False
        for k in range(n):
            ia, ib, ic = idx[(k - 1) % n], idx[k], idx[(k + 1) % n]; a, b, c = poly[ia], poly[ib], poly[ic]
            if cross(a, b, c) <= 1e-12: continue
            if any(inside(poly[j], a, b, c) for j in idx if j not in (ia, ib, ic)): continue
            tris.append((ia, ib, ic)); idx.pop(k); found = True; break
        if not found: idx.pop(0)  # degenerate sliver: drop it
    if len(idx) == 3: tris.append(tuple(idx))
    return tris


def extrude_logo(d, size, depth, vb=(10.4487, 10.1968, 29.5508, 29.4676)):
    """The logo's subpaths, centred and scaled so its height is `size`, extruded `depth` along z (front at +depth/2).
    SVG y points down, so y is flipped. Front and back caps from ear clipping, side walls with flat normals."""
    x0, y0, x1, y1 = vb; cx, cy = (x0 + x1) / 2, (y0 + y1) / 2; k = size / (y1 - y0)
    P, N, U, I = [], [], [], []
    for poly in svg_subpaths(d):
        pts = [((x - cx) * k, -(y - cy) * k) for x, y in poly]
        if _area(pts) < 0: pts = pts[::-1]
        tris = earclip(pts)
        for z, nz, flip in ((depth / 2, 1, False), (-depth / 2, -1, True)):
            base = len(P)
            for x, y in pts: P.append((x, y, z)); N.append((0, 0, nz)); U.append((x / size + .5, y / size + .5))
            for a, b, c in tris: I += [base + a, base + c, base + b] if flip else [base + a, base + b, base + c]
        m = len(pts)
        for j in range(m):
            (ax, ay), (bx, by) = pts[j], pts[(j + 1) % m]; ex, ey = bx - ax, by - ay; l = math.hypot(ex, ey) or 1; nx, ny = ey / l, -ex / l
            base = len(P)
            for x, y, z in ((ax, ay, depth / 2), (bx, by, depth / 2), (bx, by, -depth / 2), (ax, ay, -depth / 2)): P.append((x, y, z)); N.append((nx, ny, 0)); U.append((j / m, z / depth + .5))
            I += [base, base + 2, base + 1, base, base + 3, base + 2]
    return _fix_winding(_pack(P, N, U, I))


# ------------------------------------------------------------------ build
def stacks_path():
    svg = open(os.path.join(HERE, '..', 'art', 'logos', 'stacks.svg'), encoding='utf-8').read()
    return re.search(r'<path[^>]*\sd="([^"]+)"', svg).group(1)


def build():
    T = render_all()
    S = Scene(); tx = {}

    def T_(name, **kw):
        if name not in tx: tx[name] = S.tex(T[name]['url'], **kw)
        return tx[name]
    for n in ('glass', 'glassDark', 'deckGlass'): T_(n, wrapS=1000, wrapT=1000)
    # materials: black glass, a purple edge light, the Stacks orange, matte black for the lever
    glassM = S.mat('standard', 0xffffff, .12, .55, map=tx['glass']); glassD = S.mat('standard', 0xffffff, .14, .5, map=tx['glassDark'])
    black = S.mat('standard', 0x0c0c12, .35, .5); matte = S.mat('standard', 0x101014, .92, .05); gun = S.mat('standard', 0x22222e, .32, .8)
    chrome = S.mat('standard', 0xd2d0e6, .16, .95); trim = S.mat('standard', 0x2a2a3a, .25, .85)
    edge = S.mat('basic', 0x6a5cff); edgeHot = S.mat('basic', 0x8f84ff); orangeLit = S.mat('basic', 0xfc6432); slotdark = S.mat('basic', 0x030304)
    orange = S.mat('standard', 0xfc6432, .35, .2, emissive=0x5a1c06, ei=.7); purpleCollar = S.mat('standard', 0x5546ff, .3, .4, emissive=0x14104a, ei=.6)
    knob = S.mat('standard', 0xfc6432, .28, .15, emissive=0x6a2208, ei=.55)
    R = []; add = R.append

    def box(w, h, d, p, m, r=0.0, parent=None, action=None, role='', q=(0, 0, 0, 1)):
        n = node(p, q=q, g=S.geo(('b', w, h, d, r), lambda: rbox(w, h, d, r)), m=m, action=action, role=role); (parent if parent is not None else R).append(n); return n

    def pl(w, h, p, m, q=(0, 0, 0, 1), role='', parent=None, umax=1.0, vmax=1.0, key=''):
        n = node(p, q=q, g=S.geo(('pl', w, h, umax, vmax, key), lambda: plane(w, h, umax, vmax)), m=m, role=role); (parent if parent is not None else R).append(n); return n
    tm = lambda name, **kw: S.mat('basic', 0xffffff, map=T_(name), **kw)

    def edges(w, h, d, c, m=edge, t=.022, role='edge', front=True, back=False):
        """Purple edge light: thin lit bars along the front (and optionally back) edges of a w×h×d box centred at c."""
        x, y, z = c
        for zz in ([z + d / 2] if front else []) + ([z - d / 2] if back else []):
            for sx in (-1, 1): box(t, h, t, (x + sx * w / 2, y, zz), m, role=role)
            for sy in (-1, 1): box(w, t, t, (x, y + sy * h / 2, zz), m, role=role)

    # --- plinth: black glass with a purple light line along its front
    box(3.0, .24, 1.5, (0, .12, 0), black, .03)
    box(2.94, .03, .02, (0, .2, .755), edge, role='edge')
    # --- lower body: black glass, purple edge lighting, the door: SECURED BY BITCOIN, with the Xtrata mark
    box(2.5, 1.52, 1.15, (0, 1.0, 0), glassM, .02); edges(2.5, 1.52, 1.15, (0, 1.0, 0))
    box(1.98, 1.22, .04, (0, 1.0, .585), black, .01)
    pl(1.9, 1.15, (0, 1.0, .607), tm('door'))
    for x, lab in ((.62, 'ticket'), (-.62, 'coin')):  # souvenir ticket slot (right) and LAYR coin slot (left)
        box(.58, .1, .04, (x, .31, .59), gun, .015); box(.46, .045, .05, (x, .31, .6), slotdark, .01)
        pl(.36, .07, (x, .405, .5765), tm(lab), key=lab)
    box(2.56, .07, 1.2, (0, 1.8, .02), trim, .02); box(2.5, .016, .02, (0, 1.8, .615), orangeLit, role='edge2')  # a thin orange belt line

    # --- upper housing: black glass, the screen behind a thin black bezel
    box(2.5, 2.15, .98, (0, 2.925, -.04), glassM, .02); edges(2.5, 2.15, .98, (0, 2.925, -.04))
    box(2.3, 1.72, .05, (0, 2.86, .46), black, .015)
    pl(2.2, 1.64, (0, 2.86, .4855), tm('bezel'))
    add(node((0, 2.85, .495), g=S.geo(('pl', 1.92, 1.32, 'screen'), lambda: plane(1.92, 1.32)), m=S.mat('basic', 0xffffff, map=T_('screen')), role='screenMesh'))
    add(node((0, 2.85, .502), g=S.geo(('pl', 1.92, 1.32, 'glass'), lambda: plane(1.92, 1.32)), m=S.mat('basic', 0xffffff, map=T_('screenGlass'), transparent=True, depthWrite=False)))
    box(1.9, .022, .02, (0, 3.69, .49), edgeHot, role='edge')  # a light bar along the top of the bezel (pulses with each spin)

    # --- marquee: THE STACK lit on black glass, the casino wordmark small at its foot
    box(3.62, .55, 1.24, (0, 4.275, 0), black, .03); edges(3.62, .55, 1.24, (0, 4.275, 0), edgeHot)
    pl(3.4, .5, (0, 4.275, .6225), tm('header'), role='lit')

    # --- side pillars: black glass, purple light down their front edges, a live block ticker on each outer side panel
    for sx in (-1, 1):
        x = sx * 1.47
        box(.44, 3.78, 1.12, (x, 2.11, 0), glassD, .02); edges(.44, 3.78, 1.12, (x, 2.11, 0))
        for k in range(7):  # stacked light slabs on the pillar fronts: purple low, orange high
            y = .7 + k * .42; col = edge if k < 4 else orangeLit
            box(.26, .07, .02, (x, y, .565), col, role='edge' if k < 4 else 'edge2')
        xo = sx * 1.692; q = qaxis('y', 90 * sx)
        box(.02, 2.1, 1.0, (xo, 2.6, 0), black, .006)
        pl(.9, 1.8, (xo + sx * .012, 2.6, 0), tm('ticker'), q=q, role='tickerPanel', key='tick%d' % sx)

    # --- topper: the live Floor Pot board, and over it a slowly turning stack of glowing slabs (role core). Each slab is the
    #     official Stacks logo outline extruded: purple at the base, orange at the top.
    box(2.0, .34, .62, (0, 4.72, 0), black, .03); edges(2.0, .34, .62, (0, 4.72, 0), edgeHot, t=.018)
    pl(1.86, .465 * 1.86 / 1.86 * .5, (0, 4.72, .312), tm('pot'), role='potBoard', key='pot')
    box(.5, .06, .5, (0, 4.92, 0), trim, .02)
    d = stacks_path(); size, depth, gap = .5, .12, .07
    slab_cols = [(0x5546ff, 0x2a1fb0), (0x9a5ce6, 0x4a2280), (0xfc6432, 0x8a2c08)]
    core = [node((0, 0, 0), g=S.geo(('cy', .025, .025, 1.6), lambda: cyl(.025, .025, 1.6, 12)), m=chrome)]
    for k, (col, emi) in enumerate(slab_cols):
        m = S.mat('standard', col, .18, .1, transparent=True, opacity=.78, emissive=emi, ei=1.0)
        y = -.57 + k * (size + gap)
        core.append(node((0, y, 0), q=qaxis('y', k * 14), g=S.geo(('logo', size, depth), lambda: extrude_logo(d, size, depth)), m=m, role='slab'))
    core.append(node((0, -.86, 0), g=S.geo(('to', .34, .02, 'halo'), lambda: torus(.34, .02, 48, 6, 'y')), m=edgeHot, role='edge'))
    add(node((0, 5.82, 0), role='core', children=core))

    # --- deck: black glass with round push buttons in purple collars (AUTO in orange); STACK is the big orange cap
    deck = []
    box(2.4, .5, .16, (0, 0, 0), black, .03, parent=deck)
    pl(2.3, .42, (0, 0, .081), S.mat('standard', 0xffffff, .2, .5, map=tx['deckGlass']), parent=deck, key='deckface')
    deck.append(node((0, .245, .082), g=S.geo(('b', 2.36, .016, .016, 0), lambda: rbox(2.36, .016, .016)), m=edge, role='edge'))

    # Each push button is a fixed collar plus a cap group that travels into the deck when pressed (local −z, the deck's
    # normal). The small caps carry role buttonCap; STACK's cap is the room's spinPhysical (room: position.z = spinZ).
    def push(x, label, action, r=.12, collar=purpleCollar):
        deck.append(node((x, -.01, .11), q=qaxis('x', 90), g=S.geo(('to', r + .03, .02, 'collar', r), lambda: torus(r + .03, .02, 40, 8, 'y')), m=collar, action=action))
        cap = [node((0, 0, .14), g=S.geo(('cy', r, r, .06, 'z'), lambda: cyl(r, r, .06, 40, 'z')), m=gun, action=action),
               node((0, 0, .1715), g=S.geo(('di', r - .004), lambda: disc(r - .004)), m=tm(label), action=action)]
        deck.append(node((x, -.01, 0), role='buttonCap', action=action, children=cap))
    push(-.94, 'lblPays', 'pays'); push(-.6, 'lblDown', 'betDown'); push(-.26, 'lblUp', 'betUp'); push(.1, 'lblAuto', 'auto', collar=orange)
    sx0 = .76
    deck.append(node((sx0, -.01, .1), q=qaxis('x', 90), g=S.geo(('to', .26, .03, 'spincollar'), lambda: torus(.26, .03, 48, 10, 'y')), m=purpleCollar, action='spin'))
    deck.append(node((sx0, -.01, .13), g=S.geo(('cy', .245, .245, .07, 'z'), lambda: cyl(.245, .245, .07, 48, 'z')), m=gun, action='spin'))  # the sleeve (fixed)
    cap = [node((0, 0, .18), g=S.geo(('cy', .225, .225, .065, 'z'), lambda: cyl(.225, .225, .065, 48, 'z')), m=orange, action='spin'),
           node((0, 0, .2135), g=S.geo(('di', .215), lambda: disc(.215, 48)), m=tm('spin'), action='spin')]
    deck.append(node((sx0, -.01, 0), role='spinPhysical', action='spin', children=cap))  # the orange STACK cap sinks into its sleeve
    add(node((0, 1.76, .62), q=qaxis('x', math.degrees(-.72)), children=deck))
    box(1.3, .12, .03, (0, 1.57, .59), gun, .01); pl(1.2, .1, (0, 1.57, .607), tm('nameplate'), key='np')

    # --- the lever: matte black with an orange knob, on the right pillar (role lever, pivots on rotation.x; a pull swings it down)
    box(.3, .92, .4, (1.83, 2.42, .3), black, .02)
    pl(.3 * .96, .3 * .96 / 256 * 560, (1.83, 2.42, .5015), tm('leverPlate'), key='lvp')
    box(.06, .3, .3, (1.99, 2.55, .2), trim, .02)  # pivot boss
    L = []
    def lv(g, m, p=(0, 0, 0), q=(0, 0, 0, 1)): L.append(node(p, q=q, g=g, m=m, action='spin'))
    up = math.radians(30); dv = (0, math.sin(up), math.cos(up))
    lv(S.geo(('cy', .09, .09, .14, 'x'), lambda: cyl(.09, .09, .14, 28, 'x')), matte)
    lv(S.geo(('to', .09, .012, 'lvring'), lambda: torus(.09, .012, 32, 6, 'x')), edge, (.072, 0, 0), qaxis('z', 90))
    lv(S.geo(('cy', .032, .026, .92), lambda: cyl(.032, .026, .92, 20)), matte, (0, dv[1] * .46, dv[2] * .46), qaxis('x', 90 - 30))
    lv(S.geo(('sp', .1), lambda: sphere(.1, 28, 18)), knob, (0, dv[1] * .95, dv[2] * .95))
    add(node((2.08, 2.55, .2), role='lever', children=L))

    root = node(children=R)
    return {'root': root, 'geometries': S.geos, 'materials': S.mats, 'textures': S.texs}, T


def main():
    model, T = build()
    out = os.path.join(HERE, 'the-stack-model.json')
    raw = json.dumps(model, separators=(',', ':'))
    open(out, 'w').write(raw)
    import base64
    art = os.path.normpath(os.path.join(HERE, '..', 'art', 'cabinet')); os.makedirs(art, exist_ok=True)
    for k, v in T.items(): open(os.path.join(art, k + '.png'), 'wb').write(base64.b64decode(v['url'].split(',', 1)[1]))
    gz = len(gzip.compress(raw.encode(), 9))
    print('wrote', out, 'raw %.2f MB' % (len(raw) / 1e6), 'gzip %.2f MB' % (gz / 1e6), 'geoms', len(model['geometries']), 'mats', len(model['materials']), 'texs', len(model['textures']))


if __name__ == '__main__':
    main()
