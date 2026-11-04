"""Texture painter for the Club X cabinet: corrugated warehouse steel, flyposted club flyers, a chalk X on a doorway.

Every texture is written as SVG and rasterised (CairoSVG when installed; otherwise Node's sharp, which the repo already
has), so the build needs no browser. The Xtrata mark and the ParallaX Casino wordmark are embedded exactly as supplied in
./ (never redrawn, recoloured, stretched or cropped). Everything else is original procedural art in a bold club-flyer spirit:
the X marks, chalk, flyers and mirror facets are drawn fresh and copy no artwork, logo or club brand; no pills, no drug imagery.
Fonts present on the build machine: DejaVu Sans Condensed / DejaVu Sans Mono (open fonts) and Inter (open font).
"""
import base64, math, os, random, re, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
COND, MONO, DISP = 'DejaVu Sans Condensed', 'DejaVu Sans Mono', 'Inter'
ACID, ACID2, ACID3, PINK, WHITE, INK = '#e6ff00', '#f4ff7a', '#8a9a00', '#ff2d95', '#f6f6ee', '#0a0a0b'
STEEL, STEEL2, STEEL3 = '#16181b', '#25282d', '#3b4047'
GREEN = '#39ff6a'


def asset(name):
    p = os.path.join(HERE, name)
    if not os.path.exists(p): p = os.path.join(HERE, 'assets', name)
    return open(p, encoding='utf-8').read()


def nested(svg_text, x, y, w, h):
    """Place a supplied SVG inside another at (x, y, w, h), keeping its own viewBox (uniform scale, no crop)."""
    s = re.sub(r'<\?xml[^>]*>', '', svg_text).strip()
    s = re.sub(r'<svg\b([^>]*?)\swidth="[^"]*"', r'<svg\1', s, count=1)
    s = re.sub(r'<svg\b([^>]*?)\sheight="[^"]*"', r'<svg\1', s, count=1)
    return s.replace('<svg', f'<svg x="{x}" y="{y}" width="{w}" height="{h}" preserveAspectRatio="xMidYMid meet"', 1)


def _raster(svg, w, h, colours=None):
    q = '.png({palette:true,quality:90,colours:%d,effort:8,dither:0.6})' % colours if colours else '.png({compressionLevel:9})'
    js = ("const s=require('sharp');let b='';process.stdin.on('data',d=>b+=d).on('end',async()=>{const o=await s(Buffer.from(b),{density:72}).resize(%d,%d)%s.toBuffer();process.stdout.write(o)})" % (w, h, q))
    try:
        import cairosvg  # noqa: F401
        if not colours:
            return cairosvg.svg2png(bytestring=svg.encode('utf-8'), output_width=w, output_height=h)
    except ImportError:
        pass
    env = dict(os.environ); env.setdefault('NODE_PATH', '/usr/local/lib/node_modules_global:/opt/npm-tools/node_modules')
    return subprocess.run(['node', '-e', js], input=svg.encode('utf-8'), capture_output=True, check=True, cwd=os.path.join(HERE, '..', '..', '..'), env=env).stdout


def png(svg, w, h, colours=None):
    data = _raster(svg, w, h, colours)
    return {'url': 'data:image/png;base64,' + base64.b64encode(data).decode(), 'w': w, 'h': h, 'bytes': len(data)}


def doc(w, h, body, defs=''):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><defs>{defs}</defs>{body}</svg>'


def t(x, y, s, size, fill, family=COND, weight='bold', anchor='middle', extra=''):
    s = s.replace('&', '&amp;').replace('<', '&lt;')
    return f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}" {extra}>{s}</text>'


def fit(s, width, em=.56, cap=400):
    """Font size that makes s about `width` wide (condensed bold ~.56 em/char; Inter black ~.7)."""
    return max(8, min(cap, width / max(1, len(s) * em)))


GLOW = '<filter id="glow" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
NEON = '<filter id="neon" x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b1"/><feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b2"/><feMerge><feMergeNode in="b1"/><feMergeNode in="b2"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
# Chalk: roughen the stroke with noise, then punch tiny holes through it so it reads as dusty chalk on a hard surface.
CHALK = ('<filter id="chalk" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">'
         '<feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n"/>'
         '<feDisplacementMap in="SourceGraphic" in2="n" scale="12" xChannelSelector="R" yChannelSelector="G" result="d"/>'
         '<feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="11" result="g"/>'
         '<feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  5 0 0 0 -0.55" result="holes"/>'
         '<feComposite in="d" in2="holes" operator="in"/></filter>')
BOLT = '<radialGradient id="bolt" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#b3bac3"/><stop offset=".6" stop-color="#5f6670"/><stop offset="1" stop-color="#22262b"/></radialGradient>'
STEEL_GRAD = '<linearGradient id="steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2e3238"/><stop offset=".5" stop-color="#1b1d21"/><stop offset="1" stop-color="#121417"/></linearGradient>'
ACID_GRAD = f'<linearGradient id="acid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbffb0"/><stop offset=".5" stop-color="{ACID}"/><stop offset="1" stop-color="{ACID3}"/></linearGradient>'


def specks(r, w, h, n, cols, smin=.6, smax=2.4, op=(.15, .5)):
    return ''.join(f'<circle cx="{r.random() * w:.0f}" cy="{r.random() * h:.0f}" r="{smin + r.random() * (smax - smin):.1f}" fill="{r.choice(cols)}" fill-opacity="{op[0] + r.random() * (op[1] - op[0]):.2f}"/>' for _ in range(n))


def bolts(w, h, inset, step, r=7):
    out = ''
    xs = [inset + k * step for k in range(int((w - 2 * inset) / step) + 1)]
    ys = [inset + k * step for k in range(int((h - 2 * inset) / step) + 1)]
    for x in xs:
        for y in (inset, h - inset): out += f'<circle cx="{x}" cy="{y}" r="{r}" fill="url(#bolt)"/><circle cx="{x - r * .3:.1f}" cy="{y - r * .3:.1f}" r="{r * .3:.1f}" fill="#fff" fill-opacity=".3"/>'
    for y in ys[1:-1]:
        for x in (inset, w - inset): out += f'<circle cx="{x}" cy="{y}" r="{r}" fill="url(#bolt)"/><circle cx="{x - r * .3:.1f}" cy="{y - r * .3:.1f}" r="{r * .3:.1f}" fill="#fff" fill-opacity=".3"/>'
    return out


def chevrons(x, y, w, h, op=1, a=ACID, b=INK, tag=''):
    """Acid-yellow and black hazard chevrons (the plinth, the door tape)."""
    s = f'<g opacity="{op}"><rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{a}"/><clipPath id="hz{x}{y}{tag}"><rect x="{x}" y="{y}" width="{w}" height="{h}"/></clipPath><g clip-path="url(#hz{x}{y}{tag})">'
    k = -h
    while k < w + h:
        s += f'<path d="M{x + k} {y + h} L{x + k + h * .8} {y + h} L{x + k + h * 1.8} {y} L{x + k + h} {y} Z" fill="{b}"/>'
        k += h * 1.6
    return s + '</g></g>'


# ------------------------------------------------------------------ chalk marks
def chalk_x(cx, cy, size, rot=-6, op=.95, width=None):
    """A hand-chalked X: two rough strokes, a second pass over each, a tail flick. Pure vector, noise-roughened."""
    s, wd = size / 2, width or max(6, size * .075); r = random.Random(int(cx * 7 + cy * 3))
    def stroke(x0, y0, x1, y1, extra=0):
        mx, my = (x0 + x1) / 2 + r.uniform(-s * .06, s * .06), (y0 + y1) / 2 + r.uniform(-s * .06, s * .06)
        return f'<path d="M{x0:.1f} {y0:.1f} Q{mx:.1f} {my:.1f} {x1:.1f} {y1:.1f}" fill="none" stroke="#f1f1e6" stroke-width="{wd + extra:.1f}" stroke-linecap="round"/>'
    g = stroke(-s, -s * .95, s * .95, s) + stroke(-s * .97, -s * .88, s * .9, s * 1.02, -wd * .35) + stroke(s * 1.02, -s * .92, -s * .95, s * .97) + stroke(s * .94, -s * .96, -s * 1.0, s * .9, -wd * .35)
    g += f'<path d="M{s * .98:.1f} {s:.1f} q{s * .22:.1f} {s * .12:.1f} {s * .42:.1f} {-s * .04:.1f}" fill="none" stroke="#f1f1e6" stroke-width="{wd * .55:.1f}" stroke-linecap="round"/>'
    return f'<g transform="translate({cx} {cy}) rotate({rot})" opacity="{op}" filter="url(#chalk)">{g}</g>'


def chalk_text(x, y, s, size, rot=0, anchor='middle', op=.9):
    return f'<g transform="rotate({rot} {x} {y})" opacity="{op}" filter="url(#chalk)">{t(x, y, s, size, "#f1f1e6", COND, "bold", anchor, "letter-spacing=\"3\"")}</g>'


def tally(x, y, n=5, h=44, gap=11):
    out = ''
    for k in range(min(4, n)): out += f'<line x1="{x + k * gap}" y1="{y}" x2="{x + k * gap + 2}" y2="{y + h}" stroke="#f1f1e6" stroke-width="5" stroke-linecap="round"/>'
    if n >= 5: out += f'<line x1="{x - 12}" y1="{y + h * .78}" x2="{x + 4 * gap + 6}" y2="{y + h * .12}" stroke="#f1f1e6" stroke-width="5" stroke-linecap="round"/>'
    return f'<g filter="url(#chalk)" opacity=".85">{out}</g>'


# ------------------------------------------------------------------ steel
def corrugated(seed=7, w=512, h=512, base=('#454c52', '#7d878e', '#aeb8be')):
    """Corrugated warehouse sheet: 4 ribs across the tile (0.1 m each in the model), rust weeping from the bolt line, grime at the foot,
    a sheet seam through the middle. Tiles seamlessly across and down."""
    r = random.Random(seed); rib = w // 4
    grads = f'<linearGradient id="rib" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{base[0]}"/><stop offset=".22" stop-color="{base[1]}"/><stop offset=".5" stop-color="{base[2]}"/><stop offset=".78" stop-color="{base[1]}"/><stop offset="1" stop-color="{base[0]}"/></linearGradient>'
    body = ''.join(f'<rect x="{k * rib}" y="0" width="{rib}" height="{h}" fill="url(#rib)"/>' for k in range(4))
    body += ''.join(f'<rect x="{k * rib + rib * .47:.0f}" y="0" width="3" height="{h}" fill="#fff" fill-opacity=".22"/><rect x="{k * rib}" y="0" width="3" height="{h}" fill="#000" fill-opacity=".35"/>' for k in range(4))
    for k in range(7):  # rust streaks from the fixings
        x = r.choice([rib * i + r.uniform(rib * .15, rib * .85) for i in range(4)]); y0 = r.uniform(0, h * .5); ln = r.uniform(120, 340); wd = r.uniform(6, 22)
        body += f'<rect x="{x:.0f}" y="{y0:.0f}" width="{wd:.0f}" height="{ln:.0f}" fill="#8a4a22" fill-opacity="{r.uniform(.07, .2):.2f}" filter="url(#soft)"/>'
    body += f'<rect x="0" y="{h * .6:.0f}" width="{w}" height="{h * .4:.0f}" fill="url(#grime)"/>'
    body += f'<rect x="0" y="{h // 2 - 3}" width="{w}" height="6" fill="#000" fill-opacity=".5"/><rect x="0" y="{h // 2 + 3}" width="{w}" height="2" fill="#fff" fill-opacity=".18"/>'
    for k in range(8):  # seam bolts, each on a rib crest
        x = rib * (k % 4) + rib * .5 + (0 if k < 4 else 0); y = h // 2 + (0 if k < 4 else 0)
        if k < 4: body += f'<circle cx="{x}" cy="{y}" r="9" fill="url(#bolt)"/><rect x="{x - 4}" y="{y + 8}" width="8" height="46" fill="#8a4a22" fill-opacity=".28" filter="url(#soft)"/>'
    body += specks(r, w, h, 900, ['#000', '#2c2f33', '#c7d0d5'], .5, 1.6, (.08, .3))
    for k in range(10):  # scratches
        x0, y0 = r.uniform(0, w), r.uniform(0, h); body += f'<line x1="{x0:.0f}" y1="{y0:.0f}" x2="{x0 + r.uniform(-30, 30):.0f}" y2="{y0 + r.uniform(20, 90):.0f}" stroke="#d8e0e4" stroke-opacity=".2" stroke-width="1.2"/>'
    defs = grads + BOLT + '<filter id="soft"><feGaussianBlur stdDeviation="4"/></filter><linearGradient id="grime" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#1a1410" stop-opacity=".45"/></linearGradient>'
    return png(doc(w, h, body, defs), w, h, 96)


def steel(seed=5, w=512, h=512, base='#1d2024'):
    r = random.Random(seed)
    body = f'<rect width="{w}" height="{h}" fill="{base}"/>' + ''.join(f'<rect x="0" y="{y}" width="{w}" height="1" fill="#fff" fill-opacity="{r.random() * .05:.3f}"/>' for y in range(0, h, 2))
    body += specks(r, w, h, 400, ['#000', '#3b4047'], .5, 1.6, (.2, .5))
    return png(doc(w, h, body), w, h, 32)


# ------------------------------------------------------------------ flyers
def _torn(x, y, w, h, r, j=5, step=22):
    """A paper rectangle with a ragged torn border (points in absolute coords)."""
    pts = []
    for xx in range(0, int(w) + 1, step): pts.append((x + xx, y + r.uniform(-j, j)))
    for yy in range(0, int(h) + 1, step): pts.append((x + w + r.uniform(-j, j), y + yy))
    for xx in range(int(w), -1, -step): pts.append((x + xx, y + h + r.uniform(-j, j)))
    for yy in range(int(h), -1, -step): pts.append((x + r.uniform(-j, j), y + yy))
    return ' '.join(f'{px:.1f},{py:.1f}' for px, py in pts)


def poster(x, y, w, h, rot, bg, fg, accent, title, sub, foot, deco, seed, tid):
    r = random.Random(seed); cx, cy = x + w / 2, y + h / 2
    g = f'<g transform="rotate({rot} {cx:.0f} {cy:.0f})">'
    g += f'<polygon points="{_torn(x + 5, y + 7, w, h, r, 0, 40)}" fill="#000" fill-opacity=".45" filter="url(#psh)"/>'
    g += f'<polygon points="{_torn(x, y, w, h, r)}" fill="{bg}"/>'
    g += f'<clipPath id="pc{tid}"><rect x="{x}" y="{y}" width="{w}" height="{h}"/></clipPath><g clip-path="url(#pc{tid})">'
    if deco == 'bigx':
        s = min(w, h) * .62
        g += f'<g transform="translate({cx} {y + h * .48}) rotate(-4)"><path d="M{-s / 2} {-s / 2} L{s / 2} {s / 2} M{s / 2} {-s / 2} L{-s / 2} {s / 2}" stroke="{accent}" stroke-width="{s * .22:.0f}" stroke-linecap="butt" fill="none"/></g>'
    elif deco == 'burst':
        n = 28
        for k in range(n):
            a0, a1 = k / n * 2 * math.pi, (k + .5) / n * 2 * math.pi; R = max(w, h)
            g += f'<path d="M{cx} {y + h * .45} L{cx + R * math.cos(a0):.0f} {y + h * .45 + R * math.sin(a0):.0f} L{cx + R * math.cos(a1):.0f} {y + h * .45 + R * math.sin(a1):.0f} Z" fill="{accent}" fill-opacity=".9"/>'
    elif deco == 'dots':
        g += f'<pattern id="dp{tid}" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="13" cy="13" r="7" fill="{accent}"/></pattern><rect x="{x}" y="{y + h * .12}" width="{w}" height="{h * .62}" fill="url(#dp{tid})"/>'
    elif deco == 'bars':
        for k in range(9): g += f'<rect x="{x}" y="{y + h * .14 + k * h * .075:.0f}" width="{w}" height="{h * .03:.0f}" fill="{accent}"/>'
    elif deco == 'check':
        sq = w / 8
        for i in range(8):
            for j in range(5):
                if (i + j) % 2 == 0: g += f'<rect x="{x + i * sq:.0f}" y="{y + h * .12 + j * sq:.0f}" width="{sq:.0f}" height="{sq:.0f}" fill="{accent}"/>'
    elif deco == 'rings':
        for k in range(7): g += f'<circle cx="{cx}" cy="{y + h * .46}" r="{(k + 1) * w * .085:.0f}" fill="none" stroke="{accent}" stroke-width="{w * .03:.0f}"/>'
    # type block
    tsz = fit(title, w * .86, .6, h * .2)
    g += t(cx, y + h * .1 + tsz * .8, title, tsz, fg, DISP, '900', 'middle', f'letter-spacing="-1" stroke="{bg}" stroke-width="{tsz * .02:.1f}"')
    ssz = fit(sub, w * .9, .6, h * .075)
    g += f'<rect x="{x}" y="{y + h * .72:.0f}" width="{w}" height="{ssz * 1.8:.0f}" fill="{fg}"/>' + t(cx, y + h * .72 + ssz * 1.28, sub, ssz, bg, COND, 'bold', 'middle', 'letter-spacing="2"')
    fsz = fit(foot, w * .9, .6, h * .05)
    g += t(cx, y + h * .72 + ssz * 1.8 + fsz * 1.7, foot, fsz, fg, MONO, 'bold', 'middle')
    g += f'<line x1="{x}" y1="{cy:.0f}" x2="{x + w}" y2="{cy + r.uniform(-3, 3):.0f}" stroke="#000" stroke-opacity=".16" stroke-width="2"/><line x1="{cx:.0f}" y1="{y}" x2="{cx + r.uniform(-3, 3):.0f}" y2="{y + h}" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>'
    g += '</g>'
    for tx_, ty_, rr in ((x + 6, y + 4, -32), (x + w - 28, y + h - 14, 38)):  # strips of tape
        g += f'<rect x="{tx_:.0f}" y="{ty_:.0f}" width="46" height="16" fill="#e9e4c9" fill-opacity=".72" transform="rotate({rr} {tx_ + 23:.0f} {ty_ + 8:.0f})"/>'
    return g + '</g>'


FLYERS = [  # (bg, fg, accent, title, sub, foot, deco)
    (ACID, INK, INK, 'WAREHOUSE 91', 'FRI 25 OCT 1991', 'DOORS 12 TIL LATE · £8 ON THE DOOR', 'bigx'),
    (INK, WHITE, PINK, 'FOLLOW THE X', 'SAT 14 SEPT 1991', 'LOCATION GIVEN 2 HOURS BEFORE', 'bigx'),
    (WHITE, INK, ACID, 'NIGHTSHIFT', 'SUN 3 NOV 1991', 'THE LONG ONE · SIX TIL LATE', 'bars'),
    (PINK, INK, WHITE, 'LOW CEILING', 'FRI 23 AUG 1991', 'NO LIST · NO NAME · NO PHONES', 'rings'),
    (INK, ACID, ACID, 'DOWNSTAIRS', 'SAT 9 NOV 1991', 'FOUR ON THE FLOOR · ALL NIGHT', 'dots'),
    (ACID, INK, PINK, 'THE FOURTH FLOOR', 'TUE 31 DEC 1991', 'NEW YEAR · ONE DOOR · ONE X', 'burst'),
    (WHITE, INK, PINK, 'BASS BOX', 'SAT 21 DEC 1991', 'WATCH FOR THE X ON THE DOOR', 'check'),
    (INK, PINK, ACID, 'DOORS OPEN AT MIDNIGHT', 'FRI 13 SEPT 1991', 'FIND THE X · FIND THE PARTY', 'bars'),
]


def collage(w, h, seed, picks, rows, name):
    """Layered, overlapping, flyposted club flyers: wheatpaste on corrugated steel, torn, taped, creased."""
    r = random.Random(seed)
    body = f'<rect width="{w}" height="{h}" fill="#2a2f33"/>'
    for k in range(w // 64): body += f'<rect x="{k * 64}" y="0" width="30" height="{h}" fill="#4a5258" fill-opacity=".5"/>'
    y = -h * .02
    for i, (hh, rot, dx) in enumerate(rows):
        f = FLYERS[picks[i % len(picks)]]; ph = h * hh; pw = w * (.93 - .06 * (i % 2))
        body += poster(w * .035 + dx, y, pw, ph, rot, *f[:3], f[3], f[4], f[5], f[6], r.randint(0, 9999), f'{name}{i}')
        y += ph * .83
    body += specks(r, w, h, 700, ['#000', '#fff'], .5, 1.5, (.05, .22))
    for k in range(5): body += f'<rect x="{r.uniform(0, w):.0f}" y="{r.uniform(0, h * .3):.0f}" width="{r.uniform(4, 14):.0f}" height="{r.uniform(120, 420):.0f}" fill="#000" fill-opacity=".1" filter="url(#psh)"/>'
    return png(doc(w, h, body, '<filter id="psh"><feGaussianBlur stdDeviation="4"/></filter>'), w, h, 96)


# ------------------------------------------------------------------ the cabinet's printed parts
def door():
    """The lower door: steel, a big chalk X, THIS IS NUMBER ONE, the Xtrata mark as supplied."""
    W, H = 1024, 620
    body = f'''<rect width="{W}" height="{H}" fill="url(#steel)"/><rect x="0" y="0" width="{W}" height="{H}" fill="none" stroke="#000" stroke-width="16"/>
<rect x="22" y="22" width="{W - 44}" height="{H - 44}" fill="none" stroke="{STEEL3}" stroke-width="3"/>{bolts(W, H, 40, 118, 9)}
{chevrons(60, 66, W - 120, 24, tag="a")}
{chalk_x(250, 320, 330, -7)}
{t(655, 214, 'THIS IS', 58, WHITE, DISP, '900', 'middle', 'letter-spacing="8"')}
{t(655, 300, 'NUMBER ONE', 84, 'url(#acid)', DISP, '900', 'middle', 'letter-spacing="-2" filter="url(#glow)"')}
{t(655, 346, 'DOORS OPEN AT MIDNIGHT · FOLLOW THE X', 21, '#d9dde2', MONO, 'bold', 'middle', 'letter-spacing="1"')}
{nested(asset('xtrata.svg'), 585, 372, 140, 140)}
{chevrons(60, 522, W - 120, 24, tag="b")}'''
    return png(doc(W, H, body, ACID_GRAD + STEEL_GRAD + BOLT + GLOW + CHALK), W, H, 128)


def header():
    """The marquee: CLUB X in acid-yellow neon tube on black steel, the casino wordmark small at its foot."""
    W, H = 2048, 300
    r = random.Random(4)
    dots = ''.join(f'<circle cx="{x}" cy="{y}" r="2" fill="{ACID}" fill-opacity=".07"/>' for x in range(16, W, 22) for y in range(16, H, 22))
    def tube(cx, y, s, size, sp):
        a = t(cx, y, s, size, 'none', DISP, '900', 'middle', f'letter-spacing="{sp}" stroke="{ACID}" stroke-width="13" stroke-linejoin="round" filter="url(#neon)"')
        b = t(cx, y, s, size, 'none', DISP, '900', 'middle', f'letter-spacing="{sp}" stroke="#fbffd0" stroke-width="4" stroke-linejoin="round"')
        return a + b
    def x_mark(cx, cy, s):
        p = f'M{cx - s} {cy - s} L{cx + s} {cy + s} M{cx + s} {cy - s} L{cx - s} {cy + s}'
        return f'<path d="{p}" stroke="{PINK}" stroke-width="22" stroke-linecap="round" fill="none" filter="url(#neon)"/><path d="{p}" stroke="#ffd0e8" stroke-width="6" stroke-linecap="round" fill="none"/>'
    body = f'''<rect width="{W}" height="{H}" fill="#08090b"/>{dots}
<rect x="10" y="10" width="{W - 20}" height="{H - 20}" fill="none" stroke="{STEEL3}" stroke-width="10"/>{chevrons(10, 10, W - 20, 16, tag="c")}{chevrons(10, H - 26, W - 20, 16, tag="d")}
{tube(W / 2, 196, 'CLUB X', 168, 26)}{x_mark(250, 130, 62)}{x_mark(W - 250, 130, 62)}
{nested(asset('parallax-wordmark.svg'), W / 2 - 110, 212, 220, 67)}'''
    return png(doc(W, H, body, NEON + GLOW), W, H, 128)


def brick_reveal(x, y, w, h, seed=2, tag='br'):
    r = random.Random(seed); s = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#5a2f27"/><clipPath id="{tag}"><rect x="{x}" y="{y}" width="{w}" height="{h}"/></clipPath><g clip-path="url(#{tag})">'
    bh, bw = 22, 54
    for j, yy in enumerate(range(int(y), int(y + h) + bh, bh)):
        off = (bw // 2) * (j % 2)
        for xx in range(int(x) - bw, int(x + w) + bw, bw):
            tone = r.choice(['#6b382d', '#7a4033', '#5d3028', '#6f3b30', '#84483a', '#4f2a23'])
            s += f'<rect x="{xx + off + 1}" y="{yy + 1}" width="{bw - 2}" height="{bh - 2}" fill="{tone}"/>'
    return s + f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#000" fill-opacity=".28"/></g>'


def bezel():
    """A warehouse doorway round the screen: steel frame, brick reveal, a steel lintel with a chalk X above. The screen mesh sits over
    the dark centre (x 70-1030, y 215-875 of 1100x950 = the same 960x660 px at 500 px/m as before)."""
    W, H = 1100, 950
    body = f'''<rect width="{W}" height="{H}" fill="url(#steel)"/>
{brick_reveal(30, 56, W - 60, 168, 3, "brA")}
{brick_reveal(30, 224, 40, 660, 5, "brB")}{brick_reveal(1030, 224, 40, 660, 6, "brC")}
<rect x="70" y="215" width="960" height="660" fill="#050607"/>
<rect x="62" y="207" width="976" height="676" fill="none" stroke="#000" stroke-width="12"/>
<rect x="0" y="0" width="{W}" height="56" fill="url(#steel)"/><rect x="0" y="50" width="{W}" height="6" fill="#000" fill-opacity=".6"/>
<rect x="0" y="0" width="30" height="{H}" fill="url(#steel)"/><rect x="1070" y="0" width="30" height="{H}" fill="url(#steel)"/>
{bolts(W, H, 16, 96, 7)}
<rect x="0" y="884" width="{W}" height="66" fill="url(#steel)"/>{chevrons(30, 892, W - 60, 22, tag="e")}
{t(W / 2, 937, 'THRESHOLD · MIND THE STEP · NO LIST, JUST X', 17, '#c9cdd3', MONO, 'bold', 'middle', 'letter-spacing="2"')}
{chalk_x(W / 2, 140, 118, -8, .95)}
{chalk_text(270, 154, 'FOLLOW', 44, -6)}{chalk_text(W - 250, 154, 'THE X', 50, 5)}
{tally(78, 110, 5)}{tally(W - 130, 100, 3)}
{t(54, 40, 'DOORS 00:00', 22, ACID, MONO, 'bold', 'start', 'letter-spacing="2"')}{t(W - 54, 40, 'THIS IS NUMBER ONE', 22, ACID, MONO, 'bold', 'end', 'letter-spacing="2"')}'''
    return png(doc(W, H, body, STEEL_GRAD + BOLT + CHALK), W, H, 128)


def screen_idle():
    W, H = 700, 480
    return png(doc(W, H, f'<rect width="{W}" height="{H}" fill="#0b0c0e"/>' + t(W / 2, H / 2, 'CLUB X', 90, ACID, DISP, '900') + t(W / 2, H / 2 + 50, 'DOORS OPEN AT MIDNIGHT', 20, '#a7a39a', MONO)), W, H, 16)


def glass():
    W, H = 512, 352
    return png(doc(W, H, '<rect width="512" height="352" fill="url(#g)"/>', '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".09"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/><stop offset=".72" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'), W, H)


def flap_board():
    """The topper sign as baked into the model. A host that maps the game's live topper canvas onto the flapBoard part shows the
    real Holder Pot, the Number One meter and the cause line instead."""
    W, H = 1024, 320
    body = f'''<rect width="{W}" height="{H}" fill="#0b0c0e"/><rect x="24" y="22" width="{W - 48}" height="{H - 44}" fill="#000" stroke="{STEEL3}" stroke-width="4"/>
{t(W / 2, 74, 'THIS IS NUMBER ONE HOLDER POT', 36, ACID, COND, 'bold', 'middle', 'letter-spacing="5"')}
{t(W / 2, 168, 'PAID PER TWIN · EVERY WEEK', 60, WHITE, DISP, '900', 'middle', 'letter-spacing="1"')}
{t(W / 2, 226, 'NUMBER ONE JACKPOT · LIVE ON THE SCREEN', 28, '#cfd5dc', COND, 'bold', 'middle', 'letter-spacing="3"')}
{t(W / 2, 270, '10% OF EVERY PAYOUT GOES TO A CAUSE CHEMICAL X CHOOSES', 22, PINK, MONO, 'bold', 'middle')}'''
    return png(doc(W, H, body), W, H, 48)


def woofer():
    W = 256; c = W / 2
    rings = ''.join(f'<circle cx="{c}" cy="{c}" r="{rr}" fill="none" stroke="#2c3036" stroke-width="3"/>' for rr in range(30, 112, 14))
    body = f'<circle cx="{c}" cy="{c}" r="124" fill="#08090a" stroke="#4b5159" stroke-width="8"/><circle cx="{c}" cy="{c}" r="108" fill="#16181b"/>{rings}<circle cx="{c}" cy="{c}" r="34" fill="#0c0d0f" stroke="#3b4047" stroke-width="4"/><circle cx="{c}" cy="{c}" r="12" fill="{ACID}" fill-opacity=".85"/>'
    body += ''.join(f'<circle cx="{c + 114 * math.cos(a):.1f}" cy="{c + 114 * math.sin(a):.1f}" r="6" fill="url(#bolt)"/>' for a in [k * math.pi / 2 + math.pi / 4 for k in range(4)])
    return png(doc(W, W, body, BOLT), W, W, 32)


def mirror_atlas():
    """4x4 atlas of mirror facets: three rows of silvers with a hint of blue and pink, one row of hot self-lit tiles."""
    W = 512; c = 128; r = random.Random(12); body = '<rect width="512" height="512" fill="#06070a"/>'; defs = ''
    tints = [('#f2f6ff', '#9fb0c8', '#4a566b'), ('#ffffff', '#b8c4d6', '#5d6a80'), ('#fbeffa', '#c4a9c6', '#6a5070'), ('#eaf4ff', '#8fa7c8', '#3f5272')]
    hot = [ACID, PINK, '#ffffff', '#3df0ff']
    for j in range(4):
        for i in range(4):
            x, y = i * c, j * c; gid = f'm{i}{j}'
            if j < 3:
                a, b, d = tints[(i + j) % 4]
                defs += f'<linearGradient id="{gid}" x1="{r.choice([0, 1])}" y1="0" x2="{r.choice([0, 1])}" y2="1"><stop offset="0" stop-color="{a}"/><stop offset=".5" stop-color="{b}"/><stop offset="1" stop-color="{d}"/></linearGradient>'
                body += f'<rect x="{x + 5}" y="{y + 5}" width="{c - 10}" height="{c - 10}" fill="url(#{gid})"/><rect x="{x + 5}" y="{y + 5}" width="{c - 10}" height="{c - 10}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3"/><path d="M{x + 12} {y + c - 14} L{x + c - 14} {y + 12}" stroke="#fff" stroke-opacity=".35" stroke-width="4"/>'
            else:
                col = hot[i]
                defs += f'<radialGradient id="{gid}" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="{col}"/><stop offset="1" stop-color="{col}" stop-opacity=".8"/></radialGradient>'
                body += f'<rect x="{x + 5}" y="{y + 5}" width="{c - 10}" height="{c - 10}" fill="url(#{gid})"/>'
    return png(doc(W, W, body, defs), W, W, 96)


def beam():
    """Laser beam: soft green core, faded at both ends and across (transparent PNG)."""
    W, H = 256, 64
    defs = f'<linearGradient id="v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{GREEN}" stop-opacity="0"/><stop offset=".38" stop-color="{GREEN}" stop-opacity=".55"/><stop offset=".5" stop-color="#e8ffee" stop-opacity="1"/><stop offset=".62" stop-color="{GREEN}" stop-opacity=".55"/><stop offset="1" stop-color="{GREEN}" stop-opacity="0"/></linearGradient><linearGradient id="u" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".7" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="mk"><rect width="{W}" height="{H}" fill="url(#u)"/></mask>'
    return png(doc(W, H, f'<rect width="{W}" height="{H}" fill="url(#v)" mask="url(#mk)"/>', defs), W, H)


def haze():
    """Soft smoke: layered blurred blobs, transparent."""
    W = 512; r = random.Random(9); defs = '<filter id="b" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="34"/></filter><radialGradient id="e" cx=".5" cy=".5" r=".5"><stop offset=".55" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><mask id="em"><rect width="512" height="512" fill="url(#e)"/></mask>'
    blobs = ''.join(f'<circle cx="{r.uniform(90, 420):.0f}" cy="{r.uniform(90, 420):.0f}" r="{r.uniform(40, 100):.0f}" fill="#d9e2ee" fill-opacity="{r.uniform(.25, .55):.2f}"/>' for _ in range(16))
    return png(doc(W, W, f'<g mask="url(#em)"><g filter="url(#b)">{blobs}</g></g>', defs), W, W)


def hazard_strip():
    return png(doc(2048, 96, chevrons(0, 0, 2048, 96, tag="p")), 2048, 96, 16)


def plate_label(text_, w=512, h=128, size=56, fill=ACID2, bg='#0b0c0e', sub=''):
    s = f'<rect width="{w}" height="{h}" fill="{bg}"/><rect x="4" y="4" width="{w - 8}" height="{h - 8}" fill="none" stroke="{STEEL3}" stroke-width="4"/>' + t(w / 2, h / 2 + size * .36 - (size * .3 if sub else 0), text_, size, fill, COND, 'bold', 'middle', 'letter-spacing="4"')
    if sub: s += t(w / 2, h - 18, sub, size * .38, '#a7a39a', MONO, 'bold', 'middle', 'letter-spacing="2"')
    return png(doc(w, h, s), w, h, 16)


def button_face(top, sub='', fill=ACID, ink=INK, size=None):
    W = 256; c = W / 2
    size = size or (54 if len(top) <= 5 else 40 if len(top) <= 7 else 32)
    body = f'<circle cx="{c}" cy="{c}" r="126" fill="{fill}"/><circle cx="{c}" cy="{c}" r="112" fill="none" stroke="{ink}" stroke-opacity=".35" stroke-width="3"/>' + t(c, c + size * .36 - (14 if sub else 0), top, size, ink, COND, 'bold') + (t(c, c + 46, sub, 22, ink, MONO, 'bold') if sub else '')
    return png(doc(W, W, body), W, W, 16)


def spin_face():
    W = 512; c = W / 2
    body = f'<circle cx="{c}" cy="{c}" r="254" fill="url(#acid)"/><circle cx="{c}" cy="{c}" r="228" fill="none" stroke="{INK}" stroke-opacity=".5" stroke-width="6"/>' \
           + t(c, c + 52, 'DROP', 150, INK, DISP, '900', 'middle', 'letter-spacing="2"') \
           + f'<path d="M{c - 70} {c - 150} L{c - 24} {c - 98} M{c + 70} {c - 150} L{c + 24} {c - 98}" stroke="{INK}" stroke-width="22" stroke-linecap="round" fill="none"/>' \
           + t(c, c + 122, 'THE BEAT', 32, '#3a4200', MONO, 'bold', 'middle', 'letter-spacing="8"')
    return png(doc(W, W, body, ACID_GRAD), W, W, 24)


def push_plate():
    """The fire-door sign on the lever housing (the lever is a push bar)."""
    W, H = 256, 560
    body = f'''<rect width="{W}" height="{H}" fill="#2a2e33"/><rect x="6" y="6" width="{W - 12}" height="{H - 12}" fill="none" stroke="#6a727b" stroke-width="6"/>
{chevrons(16, 16, W - 32, 28, tag="f")}
{t(W / 2, 112, 'PUSH', 64, ACID, DISP, '900', 'middle', 'letter-spacing="4"')}{t(W / 2, 154, 'TO OPEN', 30, WHITE, COND, 'bold', 'middle', 'letter-spacing="4"')}{t(W / 2, 192, 'THE DOORS', 30, WHITE, COND, 'bold', 'middle', 'letter-spacing="4"')}
<rect x="40" y="226" width="{W - 80}" height="130" rx="10" fill="#0d0e10"/>{t(W / 2, 306, '▼', 90, ACID, COND)}
{t(W / 2, 410, 'FIRE DOOR', 34, '#d9dde2', COND)}{t(W / 2, 450, 'KEEP CLEAR', 26, '#9aa1aa', MONO)}
{chevrons(16, H - 44, W - 32, 28, tag="g")}'''
    return png(doc(W, H, body), W, H, 32)


def render_all():
    return {
        'corr': corrugated(7), 'corrDark': corrugated(21, base=('#2d3338', '#5a636a', '#838d94')), 'steel': steel(5),
        'door': door(), 'header': header(), 'bezel': bezel(), 'screen': screen_idle(), 'glass': glass(), 'flap': flap_board(),
        'hazard': hazard_strip(), 'spin': spin_face(), 'pushplate': push_plate(), 'woofer': woofer(), 'mirror': mirror_atlas(), 'beam': beam(), 'haze': haze(),
        'flyerFrontL': collage(384, 1536, 3, [0, 1, 2, 5], [(.3, -2, 0), (.3, 3, -4), (.3, -3, 2), (.3, 2, -2), (.3, -2, 4)], 'fl'),
        'flyerFrontR': collage(384, 1536, 8, [4, 7, 3, 6], [(.3, 3, 0), (.3, -2, 3), (.3, 2, -3), (.3, -3, 2), (.3, 2, -2)], 'fr'),
        'flyerSideL': collage(768, 1920, 15, [7, 0, 4, 2, 5, 1], [(.22, -2, 0), (.22, 3, -10), (.22, -3, 8), (.22, 2, -6), (.22, -2, 10), (.22, 3, -4)], 'sl'),
        'flyerSideR': collage(768, 1920, 27, [3, 6, 1, 5, 0, 4], [(.22, 3, 0), (.22, -2, 8), (.22, 2, -8), (.22, -3, 6), (.22, 2, -10), (.22, -2, 6)], 'sr'),
        'lblPays': button_face('SETLIST', 'PAYS', '#cfd5dc', size=32), 'lblDown': button_face('−BPM', 'BET', '#cfd5dc', size=44), 'lblUp': button_face('+BPM', 'BET', '#cfd5dc', size=44), 'lblAuto': button_face('AUTO-DJ', 'AUTO', ACID, size=32),
        'ticket': plate_label('SOUVENIR TICKET', 512, 96, 40), 'coin': plate_label('LAYR IN', 512, 96, 44),
        'nameplate': plate_label('CLUB X · FOLLOW THE X', 1024, 96, 40),
    }
