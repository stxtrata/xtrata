#!/usr/bin/env python3
"""Swap the raised-tail lever for a cat's-paw claw lever.
Reads nine-lives-model.tail.json (the cabinet with the tail lever) and writes nine-lives-model.json.
The lever group keeps role 'lever', pivot (2.0, 2.4, 0.2) and action 'spin', so the page animation and clicks are unchanged."""
import json, math, os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from build_model import _pack, _fix_winding, cyl, torus, node, qaxis

def ellipsoid(rx, ry, rz, seg=24, rings=14):
    P, N, U, I = [], [], [], []
    for j in range(rings + 1):
        v = j / rings * math.pi
        for i in range(seg + 1):
            u = i / seg * 2 * math.pi
            x, y, z = math.sin(v) * math.cos(u), math.cos(v), math.sin(v) * math.sin(u)
            P.append((rx * x, ry * y, rz * z)); n = np.array((x / rx, y / ry, z / rz)); N.append(n / np.linalg.norm(n)); U.append((i / seg, j / rings))
    for j in range(rings):
        for i in range(seg):
            a = j * (seg + 1) + i; b = a + seg + 1; I += [a, a + 1, b + 1, a, b + 1, b]
    return _fix_winding(_pack(P, N, U, I))

def claw(length, r0, curl, seg=10, steps=14):
    """Tapered hooked spike: starts pointing +y, curls toward +z by `curl` radians."""
    pts, ts = [np.zeros(3)], []
    for k in range(1, steps + 1):
        t = (k - .5) / steps; phi = curl * t ** 1.4; d = np.array((0, math.cos(phi), math.sin(phi)))
        pts.append(pts[-1] + d * length / steps)
    P, N, U, I = [], [], [], []
    for k, c in enumerate(pts):
        t = k / steps; phi = curl * t ** 1.4; tan = np.array((0, math.cos(phi), math.sin(phi))); side = np.array((1., 0, 0)); up = np.cross(tan, side)
        r = r0 * (1 - t) ** .85 + .0006
        for i in range(seg + 1):
            a = i / seg * 2 * math.pi; n = side * math.cos(a) + up * math.sin(a)
            P.append(c + n * r * (1.0 if abs(math.cos(a)) > 1e-6 or True else 1)); N.append(n); U.append((i / seg, t))
    for k in range(steps):
        for i in range(seg):
            a = k * (seg + 1) + i; b = a + seg + 1; I += [a, a + 1, b + 1, a, b + 1, b]
    return _fix_winding(_pack(P, N, U, I))

def build(model_in, model_out):
    M = json.load(open(model_in))
    geos, mats = M['geometries'], M['materials']
    def G(g): geos.append(g); return len(geos) - 1
    def mat(color, rough, metal=0., typ='standard', emissive=0, ei=1., transparent=False, opacity=1.):
        mats.append({'type': typ, 'color': color, 'roughness': rough, 'metalness': metal, 'transparent': transparent, 'opacity': opacity, 'side': 0, 'depthWrite': not transparent,
                     'alphaTest': 0.0, 'flatShading': False, 'map': None, 'emissive': emissive, 'emissiveIntensity': ei}); return len(mats) - 1
    chrome, teal = 2, 6
    fur = mat(0xe9e2f6, .92, .0); furShade = mat(0xcdbfe8, .9, .0); bean = mat(0xff7fb4, .55, .0)
    clawm = mat(0xeafffb, .18, .85, emissive=0x0a4a44, ei=.8); tip = mat(0x7ffff0, .3, .1, typ='basic'); halo = mat(0x7ffff0, .5, .0, typ='basic', transparent=True, opacity=.22)
    root = M['root']; lev = next(n for n in _walk(root) if n.get('role') == 'lever')
    keep = lev['children'][:2]                     # pivot hub pieces from the tail build
    L = []
    def add(g, m, p, q=(0, 0, 0, 1), s=(1, 1, 1)): L.append(node(p, q, s, g=g, m=m, action='spin'))
    # shaft + wrist
    add(G(cyl(.042, .046, .56, 20)), chrome, (0, .28, 0))
    add(G(torus(.052, .012, 24, 8)), teal, (0, .10, 0))
    add(G(cyl(.082, .066, .17, 26)), fur, (0, .58, 0))                          # fluffy cuff
    add(G(torus(.078, .016, 28, 8)), teal, (0, .50, 0))                         # glowing collar
    # fluffy fur ring under the paw
    puff = G(ellipsoid(.04, .055, .04, 14, 8))
    for k in range(10):
        a = k / 10 * 2 * math.pi
        add(puff, fur, (math.sin(a) * .085, .675, math.cos(a) * .085), qaxis('x', 0))
    # a few teal rings up the shaft
    for y in (.2, .3, .4): add(G(torus(.047, .008, 20, 6)), teal, (0, y, 0))
    # paw: palm + four toes + dewclaw
    add(G(ellipsoid(.158, .125, .115)), fur, (0, .83, 0))
    toe = G(ellipsoid(.05, .068, .056))
    toes = [(-.105, .95, .012, 12), (-.036, .995, .02, 3), (.036, .995, .02, -3), (.105, .95, .012, -12)]
    cl = G(claw(.135, .021, 1.55)); cl2 = G(claw(.15, .022, 1.6))
    for k, (x, y, z, tz) in enumerate(toes):
        add(toe, fur, (x, y, z), qaxis('z', tz))
        add(cl2 if k in (1, 2) else cl, clawm, (x * 1.04, y + .05, z + .03), qaxis('z', tz * .8))
    add(G(ellipsoid(.05, .06, .05)), fur, (.15, .80, .035), qaxis('z', -40))     # dewclaw thumb
    add(G(claw(.09, .017, 1.4)), clawm, (.172, .835, .05), qaxis('z', -40))
    # pink beans on the face of the paw (front is +z, toward the player)
    add(G(ellipsoid(.092, .07, .035)), bean, (0, .795, .105))                    # main pad
    add(G(ellipsoid(.027, .034, .02, 14, 8)), bean, (-.105, .93, .062), qaxis('z', 12))
    add(G(ellipsoid(.029, .036, .02, 14, 8)), bean, (-.036, .975, .07), qaxis('z', 3))
    add(G(ellipsoid(.029, .036, .02, 14, 8)), bean, (.036, .975, .07), qaxis('z', -3))
    add(G(ellipsoid(.027, .034, .02, 14, 8)), bean, (.105, .93, .062), qaxis('z', -12))
    lev['children'] = keep + L
    json.dump(M, open(model_out, 'w'), separators=(',', ':'))
    print('wrote', model_out, 'geoms', len(geos), 'mats', len(mats), 'lever parts', len(lev['children']))

def _walk(n):
    yield n
    for c in n.get('children', []): yield from _walk(c)
def _qmul(a, b):
    ax, ay, az, aw = a; bx, by, bz, bw = b
    return (aw*bx + ax*bw + ay*bz - az*by, aw*by - ax*bz + ay*bw + az*bx, aw*bz + ax*by - ay*bx + az*bw, aw*bw - ax*bx - ay*by - az*bz)

if __name__ == '__main__':
    build(os.path.join(HERE, 'nine-lives-model.tail.json'), os.path.join(HERE, 'nine-lives-model.json'))
