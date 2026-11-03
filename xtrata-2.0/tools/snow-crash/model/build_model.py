#!/usr/bin/env python3
"""Snow Crash cabinet model builder.

Writes snow-crash-model.json in the packed-cabinet format the ParallaX Casino room loads
({root, geometries, materials, textures}). Rerunnable. Optional inputs in ./assets:
  crashpunks-logo.png   official Crash Punks logo (topper hologram). Missing -> loud placeholder tile.
  xtrata.svg, parallax.svg  extracted from the brief, drawn as given (never redrawn or recoloured).
"""
import base64, gzip, json, math, os, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
A = lambda *p: os.path.join(HERE, 'assets', *p)

# ------------------------------------------------------------------ textures (Chromium)
def render_textures():
    from playwright.sync_api import sync_playwright
    b64 = lambda path: base64.b64encode(open(path, 'rb').read()).decode()
    logo = None
    if os.path.exists(A('crashpunks-logo.png')):
        logo = 'data:image/png;base64,' + b64(A('crashpunks-logo.png'))
    elif os.path.exists(A('crashpunks-logo.svg')):
        logo = 'data:image/svg+xml;base64,' + b64(A('crashpunks-logo.svg'))
    args = {'xtrata': b64(A('xtrata.svg')), 'parallax': b64(A('parallax.svg')), 'logo': logo}
    with sync_playwright() as p:
        br = p.chromium.launch()
        pg = br.new_page(viewport={'width': 800, 'height': 600})
        pg.set_content('<html><body></body></html>')
        pg.add_script_tag(content=open(os.path.join(HERE, 'textures.js')).read())
        out = pg.evaluate('(a)=>window.renderAll(a)', args)
        br.close()
    return out, bool(logo)

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

# ------------------------------------------------------------------ build
def build():
    T, has_logo = render_textures()
    S = Scene()
    tx = {}
    def T_(name, **kw): tx[name] = S.tex(T[name]['url'], **kw); return tx[name]
    PINK, CYAN = 0xff3ea5, 0x29e6ff
    # materials
    body = S.mat('standard', 0x1d0e2e, .28, .65); chrome = S.mat('standard', 0xb9b4d2, .14, .95); steel = S.mat('standard', 0x9fb3c2, .18, .92)
    dark = S.mat('standard', 0x05030a, .4, .3); rubber = S.mat('standard', 0x050308, .8, .05); darkchrome = S.mat('standard', 0x1d1233, .22, .85)
    pink = S.mat('basic', PINK); cyan = S.mat('basic', CYAN); slotdark = S.mat('basic', 0x020106)
    glass = S.mat('standard', 0x241236, .05, .6, transparent=True, opacity=.14, depthWrite=False)
    root_children = []
    add = root_children.append

    def box(w, h, d, p, m, r=0.0, parent=None, action=None, role=''):
        n = node(p, g=S.geo(('b', w, h, d, r), lambda: rbox(w, h, d, r)), m=m, action=action, role=role); (parent if parent is not None else root_children).append(n); return n

    # --- plinth, glow, lower body
    box(2.95, .22, 1.5, (0, .14, 0), darkchrome, .04)
    box(2.9, .02, 1.45, (0, .012, 0), pink)
    box(2.70, .03, .03, (0, .14, .752), pink); box(.03, .03, 1.2, (-1.478, .14, 0), pink); box(.03, .03, 1.2, (1.478, .14, 0), pink)
    box(2.5, 1.52, 1.15, (0, 1.01, 0), body, .05)
    # lower door plate: chrome, Xtrata mark, CRASH PUNKS · FOREVER ON STACKS
    T_('door'); add(node((0, 1.0, .5785), g=S.geo(('pl', 1.72, 1.04), lambda: plane(1.72, 1.04)), m=S.mat('basic', 0xffffff, map=tx['door'])))
    box(2.0, .025, .02, (0, 1.62, .58), pink); box(2.0, .025, .02, (0, .465, .58), cyan)
    # souvenir ticket slot (right) and LAYR coin slot (left)
    for x, rim, lab in ((.55, pink, 'ticket'), (-.55, cyan, 'coin')):
        box(.56, .09, .03, (x, .30, .585), rim); box(.46, .045, .04, (x, .30, .598), slotdark, .01)
        T_(lab); add(node((x, .39, .581), g=S.geo(('pl', .36, .09), lambda: plane(.36, .09)), m=S.mat('basic', 0xffffff, map=tx[lab])))
    # shelf under the deck
    box(2.56, .08, 1.2, (0, 1.81, .02), steel, .02)

    # --- upper housing, bezel, curved CRT
    box(2.5, 2.15, .98, (0, 2.925, -.04), body, .05)
    box(2.16, 1.56, .1, (0, 2.88, .45), steel, .03); box(2.06, 1.46, .06, (0, 2.88, .5), S.mat('standard', 0x030205, .75, .05), .02)
    T_('screen'); add(node((0, 2.88, .535), g=S.geo(('cv', 1.98, 1.36, .035), lambda: curved(1.98, 1.36, .035)), m=S.mat('basic', 0xffffff, map=tx['screen']), role='screenMesh'))
    T_('glass'); add(node((0, 2.88, .548), g=S.geo(('cv', 1.98, 1.36, .035), lambda: curved(1.98, 1.36, .035)), m=S.mat('basic', 0xffffff, map=tx['glass'], transparent=True, depthWrite=False)))

    # --- header with SNOW CRASH sign + small ParallaX wordmark
    box(3.62, .55, 1.24, (0, 4.275, 0), body, .04); box(3.66, .03, 1.26, (0, 4.565, 0), pink, .01)
    T_('header'); add(node((0, 4.275, .6225), g=S.geo(('pl', 3.4, .5), lambda: plane(3.4, .5)), m=S.mat('basic', 0xffffff, map=tx['header'])))
    box(3.4, .02, .02, (0, 3.995, .6), cyan)

    # --- glass towers: city signs + rain planes (role rain) on front and outer side
    T_('towerSign'); T_('sideSign'); T_('rain', wrapS=1000, wrapT=1000, repeat=(1, 2))
    sign_f = S.mat('basic', 0xffffff, map=tx['towerSign']); sign_s = S.mat('basic', 0xffffff, map=tx['sideSign'])
    rain = S.mat('basic', 0xffffff, map=tx['rain'], transparent=True, depthWrite=False)
    for sx in (-1, 1):
        x = sx * 1.53
        box(.56, 3.78, 1.12, (x, 2.11, 0), body, .04)
        box(.62, .06, 1.18, (x, .27, 0), steel, .02)
        add(node((x, 2.12, .562), g=S.geo(('pl', .46, 3.5), lambda: plane(.46, 3.5)), m=sign_f))
        add(node((x, 2.12, .567), g=S.geo(('pl', .46, 3.5, 1, 1), lambda: plane(.46, 3.5)), m=rain, role='rain'))
        add(node((x, 2.12, .572), g=S.geo(('pl', .46, 3.5, 'g'), lambda: plane(.46, 3.5)), m=glass))
        box(.025, 3.5, .02, (sx * 1.255, 2.12, .565), pink); box(.02, 3.5, .02, (sx * 1.795, 2.12, .565), cyan)
        # outer side face
        xo = sx * 1.812; q = qaxis('y', 90 * sx)
        add(node((xo, 2.12, 0), q=q, g=S.geo(('pl', 1.0, 3.5), lambda: plane(1.0, 3.5)), m=sign_s))
        add(node((xo + sx * .005, 2.12, 0), q=q, g=S.geo(('pl', 1.0, 3.5, 'rain'), lambda: plane(1.0, 3.5, 2.17, 1.0)), m=rain, role='rain'))
        add(node((xo + sx * .010, 2.12, 0), q=q, g=S.geo(('pl', 1.0, 3.5, 'g'), lambda: plane(1.0, 3.5)), m=glass))

    # --- topper: post, ring, turning hologram (role crest)
    box(.1, .16, .1, (0, 4.66, 0), chrome, .02)
    add(node((0, 4.6, 0), g=S.geo(('cy', .3, .3, .05), lambda: cyl(.3, .3, .05, 40)), m=chrome))
    add(node((0, 4.635, 0), g=S.geo(('to', .3, .014), lambda: torus(.3, .014, 48, 8)), m=pink))
    add(node((0, 4.68, 0), g=S.geo(('cy', .33, .09, .2, 'cone'), lambda: cyl(.33, .09, .2, 32, 'y', False)), m=S.mat('basic', CYAN, transparent=True, opacity=.16, side=2, depthWrite=False)))
    T_('crest'); holo = S.mat('basic', 0xffffff, map=tx['crest'], transparent=True, side=2, depthWrite=False)
    hp = S.geo(('pl', 1.36, .85, 'holo'), lambda: plane(1.36, .85))
    add(node((0, 5.2, 0), role='crest', children=[node(g=hp, m=holo), node(q=qaxis('y', 90), g=hp, m=holo)]))

    # --- deck with the five buttons (tilted group, like Forever Twins)
    deck_kids = []
    box(2.4, .5, .16, (0, 0, 0), S.mat('standard', 0x0d1620, .08, .85) if False else darkchrome, .03, parent=deck_kids)
    box(2.34, .44, .02, (0, 0, .09), dark, 0, parent=deck_kids)
    def rect_button(title, x, w, topcol, action, lbl):
        T_(lbl); fh = (w - .05) / 2.4
        box(w, .22, .07, (x, -.02, .13), steel, .025, parent=deck_kids, action=action)
        box(w - .025, .2, .065, (x, -.02, .18), S.mat('standard', topcol, .25, .3), .025, parent=deck_kids, action=action)
        deck_kids.append(node((x, -.02, .216), g=S.geo(('pl', round(w - .05, 3), round(fh, 3)), lambda: plane(w - .05, fh)), m=S.mat('basic', 0xffffff, map=tx[lbl]), action=action))
    rect_button('MANUAL', -.92, .40, 0xcfc8e6, 'pays', 'lblPays'); rect_button('-CRED', -.48, .38, 0xcfc8e6, 'betDown', 'lblDown')
    rect_button('+CRED', -.05, .38, 0xcfc8e6, 'betUp', 'lblUp'); rect_button('AUTOPILOT', .40, .50, CYAN, 'auto', 'lblAuto')
    T_('spin'); sx0 = .92
    deck_kids.append(node((sx0, -.02, .13), g=S.geo(('cy', .25, .25, .07, 'z'), lambda: cyl(.25, .25, .07, 40, 'z')), m=steel, action='spin'))
    deck_kids.append(node((sx0, -.02, .18), g=S.geo(('cy', .225, .225, .065, 'z'), lambda: cyl(.225, .225, .065, 40, 'z')), m=S.mat('standard', PINK, .25, .3), action='spin', role='spinPhysical'))
    deck_kids.append(node((sx0, -.02, .216), g=S.geo(('di', .205), lambda: disc(.205)), m=S.mat('basic', 0xffffff, map=tx['spin']), action='spin'))
    add(node((0, 1.76, .62), q=qaxis('x', math.degrees(-.72)), children=deck_kids))

    # --- throttle-grip lever (role lever), pivots on rotation.x
    L = []
    def lv(g, m, p=(0, 0, 0)): L.append(node(p, g=g, m=m, action='spin'))
    lv(S.geo(('cy', .09, .09, .24, 'x'), lambda: cyl(.09, .09, .24, 28, 'x')), chrome)
    lv(S.geo(('cy', .035, .035, .52), lambda: cyl(.035, .035, .52, 20)), chrome, (0, .26, 0))
    lv(S.geo(('cy', .08, .08, .03), lambda: cyl(.08, .08, .03, 28)), chrome, (0, .535, 0))
    lv(S.geo(('cy', .062, .062, .42), lambda: cyl(.062, .062, .42, 24)), rubber, (0, .76, 0))
    ribs = S.geo(('to', .062, .011, 'rib'), lambda: torus(.062, .011, 24, 6))
    for k in range(8): lv(ribs, S.mat('standard', 0x14101a, .85, .05), (0, .60 + k * .047, 0))
    lv(S.geo(('cy', .056, .056, .04), lambda: cyl(.056, .056, .04, 24)), chrome, (0, .98, 0))
    lv(S.geo(('to', .066, .008, 'pk'), lambda: torus(.066, .008, 24, 6)), pink, (0, .955, 0))
    add(node((2.0, 2.4, .2), role='lever', children=L))
    box(.08, .5, .5, (1.86, 2.4, .2), chrome, .02)

    root = node(children=root_children)
    model = {'root': root, 'geometries': S.geos, 'materials': S.mats, 'textures': S.texs}
    return model, has_logo

def main():
    model, has_logo = build()
    out = os.path.join(HERE, 'snow-crash-model.json')
    raw = json.dumps(model, separators=(',', ':'))
    open(out, 'w').write(raw)
    gz = len(gzip.compress(raw.encode(), 9))
    print('wrote', out, 'raw %.2f MB' % (len(raw) / 1e6), 'gzip %.2f MB' % (gz / 1e6), 'logo:', 'REAL' if has_logo else 'PLACEHOLDER',
          'geoms', len(model['geometries']), 'mats', len(model['materials']), 'texs', len(model['textures']))

if __name__ == '__main__':
    main()
