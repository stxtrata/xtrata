"""Texture painter for The Halving cabinet: raw concrete, black steel, amber LEDs and the red breaker.

Every texture is written as SVG and rasterised (CairoSVG when installed; otherwise Node's sharp, which the repo already
has), so the build needs no browser. The Xtrata mark and the ParallaX Casino wordmark are embedded exactly as supplied in
./assets (never redrawn, recoloured, stretched or cropped); the Bitcoin mark is the Bitcoin.org file (art/bitcoin-mark.svg).
Fonts: DejaVu Sans Condensed and DejaVu Sans Mono, open fonts present on the build machines.
"""
import base64, math, os, random, re, subprocess, json

HERE = os.path.dirname(os.path.abspath(__file__))
COND, MONO = 'DejaVu Sans Condensed', 'DejaVu Sans Mono'
AMBER, AMBER2, AMBER3, LED = '#ffd23f', '#ffe88a', '#9c7a0c', '#ffb020'
STEEL, STEEL2, STEEL3, INK = '#16181b', '#25282d', '#3b4047', '#0b0c0e'


def asset(name):
    p = os.path.join(HERE, 'assets', name)
    if not os.path.exists(p): p = os.path.join(HERE, '..', 'art', name)
    return open(p, encoding='utf-8').read()


def nested(svg_text, x, y, w, h):
    """Place a supplied SVG inside another at (x, y, w, h), keeping its own viewBox (uniform scale, no crop)."""
    s = re.sub(r'<\?xml[^>]*>', '', svg_text).strip()
    s = re.sub(r'<svg\b([^>]*?)\swidth="[^"]*"', r'<svg\1', s, count=1)
    s = re.sub(r'<svg\b([^>]*?)\sheight="[^"]*"', r'<svg\1', s, count=1)
    return s.replace('<svg', f'<svg x="{x}" y="{y}" width="{w}" height="{h}" preserveAspectRatio="xMidYMid meet"', 1)


def _raster(svg, w, h):
    try:
        import cairosvg
        return cairosvg.svg2png(bytestring=svg.encode('utf-8'), output_width=w, output_height=h)
    except ImportError:  # fall back to sharp (librsvg) through node
        js = "const s=require('sharp');let b='';process.stdin.on('data',d=>b+=d).on('end',async()=>{const o=await s(Buffer.from(b),{density:72}).resize(%d,%d).png().toBuffer();process.stdout.write(o)})" % (w, h)
        return subprocess.run(['node', '-e', js], input=svg.encode('utf-8'), capture_output=True, check=True, cwd=os.path.join(HERE, '..', '..', '..')).stdout


def png(svg, w, h):
    data = _raster(svg, w, h)
    return {'url': 'data:image/png;base64,' + base64.b64encode(data).decode(), 'w': w, 'h': h, 'bytes': len(data)}


def doc(w, h, body, defs=''):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><defs>{defs}</defs>{body}</svg>'


def t(x, y, s, size, fill, family=COND, weight='bold', anchor='middle', extra=''):
    s = s.replace('&', '&amp;').replace('<', '&lt;')
    return f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}" {extra}>{s}</text>'


AMBER_GRAD = '<linearGradient id="amber" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1a8"/><stop offset=".5" stop-color="#ffd23f"/><stop offset="1" stop-color="#9c7a0c"/></linearGradient>'
STEEL_GRAD = '<linearGradient id="steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2e3238"/><stop offset=".5" stop-color="#1b1d21"/><stop offset="1" stop-color="#121417"/></linearGradient>'
GLOW = '<filter id="glow" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'


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


BOLT = '<radialGradient id="bolt" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#b3bac3"/><stop offset=".6" stop-color="#5f6670"/><stop offset="1" stop-color="#22262b"/></radialGradient>'


def hazard(x, y, w, h, op=1):
    s = f'<g opacity="{op}"><rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{AMBER}"/><clipPath id="hz{x}{y}"><rect x="{x}" y="{y}" width="{w}" height="{h}"/></clipPath><g clip-path="url(#hz{x}{y})">'
    k = -h
    while k < w + h:
        s += f'<path d="M{x + k} {y + h} L{x + k + h * .8} {y + h} L{x + k + h * 1.8} {y} L{x + k + h} {y} Z" fill="{INK}"/>'
        k += h * 1.6
    return s + '</g></g>'


def concrete(seed=3, w=1024, h=1024, base='#7d7a74'):
    """Board-formed concrete: plank lines, the formwork's tie holes, aggregate and staining."""
    r = random.Random(seed)
    body = f'<rect width="{w}" height="{h}" fill="{base}"/>'
    body += specks(r, w, h, 5200, ['#5a5752', '#9a968f', '#6a6762', '#a8a49c', '#4a4844'], .5, 2.2, (.25, .7))
    for y in range(0, h, 128):  # plank joints and the grain of the boards
        body += f'<rect x="0" y="{y}" width="{w}" height="3" fill="#3e3c39" fill-opacity=".55"/><rect x="0" y="{y + 3}" width="{w}" height="1.5" fill="#fff" fill-opacity=".12"/>'
        for k in range(5):
            yy = y + 18 + r.random() * 100
            pts = ' '.join(f'{x},{yy + 3 * math.sin(x / 70 + k):.1f}' for x in range(0, w + 32, 32))
            body += f'<polyline points="{pts}" fill="none" stroke="#4d4a46" stroke-opacity=".18" stroke-width="{1 + r.random() * 2:.1f}"/>'
    for y in range(64, h, 256):
        for x in range(128, w, 256):
            body += f'<circle cx="{x}" cy="{y}" r="11" fill="#2b2a28"/><circle cx="{x}" cy="{y}" r="11" fill="none" stroke="#a9a59d" stroke-opacity=".35" stroke-width="2"/><circle cx="{x - 3}" cy="{y - 3}" r="4" fill="#4a4844"/>'
    for k in range(9):  # water stains running down
        x = r.random() * w; body += f'<rect x="{x:.0f}" y="{r.random() * h * .5:.0f}" width="{8 + r.random() * 30:.0f}" height="{120 + r.random() * 400:.0f}" fill="#3a3835" fill-opacity="{.05 + r.random() * .07:.2f}"/>'
    return png(doc(w, h, body), w, h)


def steel(seed=5, w=512, h=512, base='#1d2024'):
    r = random.Random(seed)
    body = f'<rect width="{w}" height="{h}" fill="{base}"/>' + ''.join(f'<rect x="0" y="{y}" width="{w}" height="1" fill="#fff" fill-opacity="{r.random() * .05:.3f}"/>' for y in range(0, h, 2))
    body += specks(r, w, h, 400, ['#000', '#3b4047'], .5, 1.6, (.2, .5))
    return png(doc(w, h, body), w, h)


def door():
    W, H = 1024, 620
    body = f'''<rect width="{W}" height="{H}" fill="url(#steel)"/><rect x="0" y="0" width="{W}" height="{H}" fill="none" stroke="#000" stroke-width="16"/>
<rect x="22" y="22" width="{W - 44}" height="{H - 44}" fill="none" stroke="{STEEL3}" stroke-width="3"/>{bolts(W, H, 40, 118, 9)}
{hazard(60, 70, W - 120, 26)}
{t(512, 190, 'EVERY 210,000 BLOCKS', 64, 'url(#amber)', COND, 'bold', 'middle', 'letter-spacing="4" filter="url(#glow)"')}
{t(512, 244, '50 → 25 → 12.5 → 6.25 → 3.125 → 1.5625 BTC', 30, '#d9dde2', MONO, 'bold', 'middle', 'letter-spacing="1"')}
{nested(asset('xtrata.svg'), 432, 282, 160, 160)}
{t(512, 486, 'THE HALVING', 34, AMBER, COND, 'bold', 'middle', 'letter-spacing="10"')}
{hazard(60, 518, W - 120, 26)}'''
    return png(doc(W, H, body, AMBER_GRAD + STEEL_GRAD + BOLT + GLOW), W, H)


def header():
    """The marquee: backlit amber stencil on black steel, the Bitcoin.org mark either side, the casino wordmark small at its foot."""
    W, H = 2048, 300
    r = random.Random(4)
    dots = ''.join(f'<circle cx="{x}" cy="{y}" r="2" fill="{AMBER}" fill-opacity=".09"/>' for x in range(16, W, 22) for y in range(16, H, 22))
    body = f'''<rect width="{W}" height="{H}" fill="#08090b"/>{dots}
<rect x="10" y="10" width="{W - 20}" height="{H - 20}" fill="none" stroke="{STEEL3}" stroke-width="10"/>{hazard(10, 10, W - 20, 16)}{hazard(10, H - 26, W - 20, 16)}
{t(W / 2, 184, 'THE HALVING', 150, 'url(#amber)', COND, 'bold', 'middle', 'letter-spacing="22" filter="url(#glow)"')}
{nested(asset('parallax-wordmark.svg'), W / 2 - 110, 206, 220, 67)}
{nested(asset('bitcoin-mark.svg'), 70, 60, 180, 180)}{nested(asset('bitcoin-mark.svg'), W - 250, 60, 180, 180)}'''
    return png(doc(W, H, body, AMBER_GRAD + GLOW), W, H)


def bezel():
    """The steel bezel round the screen; the screen mesh sits over its dark centre. A schedule rail runs under it."""
    W, H = 1100, 820
    body = f'''<rect width="{W}" height="{H}" fill="url(#steel)"/><rect x="38" y="64" width="{W - 76}" height="{H - 140}" fill="#050607"/>
<rect x="30" y="56" width="{W - 60}" height="{H - 124}" fill="none" stroke="#000" stroke-width="8"/>{bolts(W, H, 18, 98, 7)}
{t(54, 44, 'BLOCK SUBSIDY · 50 → 3.125 BTC', 24, AMBER, MONO, 'bold', 'start', 'letter-spacing="2"')}{t(W - 54, 44, 'TIP ▸ LIVE', 24, '#46c37b', MONO, 'bold', 'end', 'letter-spacing="2"')}
{hazard(30, H - 58, W - 60, 18)}{t(W / 2, H - 16, 'HALVINGS AT 210,000 · 420,000 · 630,000 · 840,000 · NEXT 1,050,000', 19, '#c9cdd3', MONO, 'bold', 'middle', 'letter-spacing="1"')}'''
    return png(doc(W, H, body, STEEL_GRAD + BOLT), W, H)


def screen_idle():
    W, H = 700, 480
    return png(doc(W, H, f'<rect width="{W}" height="{H}" fill="#0b0c0e"/>' + t(W / 2, H / 2, 'THE HALVING', 60, AMBER, COND) + t(W / 2, H / 2 + 50, 'SPINNING UP THE FANS…', 20, '#a7a39a', MONO)), W, H)


def glass():
    W, H = 512, 352
    return png(doc(W, H, '<rect width="512" height="352" fill="url(#g)"/>', '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".09"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/><stop offset=".72" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'), W, H)


def flap_board(lines=('NEXT HALVING · BLOCK', '1,050,000'), sub='LIVE COUNT ON THE SCREEN · EVERY 210,000 BLOCKS'):
    """The topper's split-flap board as baked into the model: the next halving block (always true). A host that maps the
    game's live topper canvas onto the flapBoard part shows the real blocks-to-go count instead."""
    W, H = 1024, 320
    cells, x0, cw, ch, gap = list(lines[1]), 0, 0, 150, 10
    widths = [44 if c == ',' else 96 for c in cells]; total = sum(widths) + gap * (len(cells) - 1); x = (W - total) / 2; s = ''
    for c, w in zip(cells, widths):
        if c == ',': s += t(x + w / 2, 244, ',', 80, AMBER2, COND); x += w + gap; continue
        s += f'<rect x="{x}" y="87" width="{w}" height="{ch}" rx="10" fill="url(#flap)" stroke="#000" stroke-width="2"/>{t(x + w / 2, 212, c, 124, "#fff6d0", COND)}<rect x="{x}" y="160" width="{w}" height="4" fill="#000"/>'
        x += w + gap
    body = f'''<rect width="{W}" height="{H}" fill="#0b0c0e"/><rect x="24" y="22" width="{W - 48}" height="{H - 44}" fill="#000" stroke="{STEEL3}" stroke-width="4"/>
{t(W / 2, 66, lines[0], 32, AMBER, COND, 'bold', 'middle', 'letter-spacing="6"')}{s}{t(W / 2, 280, sub, 22, '#cfd5dc', COND, 'bold', 'middle', 'letter-spacing="2"')}'''
    return png(doc(W, H, body, '<linearGradient id="flap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2d33"/><stop offset=".5" stop-color="#121417"/><stop offset="1" stop-color="#1d2025"/></linearGradient>'), W, H)


def fan_grille():
    """An ASIC fan guard: concentric wire rings and spokes (transparent between)."""
    W = 512; c = W / 2
    rings = ''.join(f'<circle cx="{c}" cy="{c}" r="{rr}" fill="none" stroke="#9aa1aa" stroke-width="5"/>' for rr in range(40, 240, 36))
    spokes = ''.join(f'<line x1="{c + 30 * math.cos(a):.1f}" y1="{c + 30 * math.sin(a):.1f}" x2="{c + 236 * math.cos(a):.1f}" y2="{c + 236 * math.sin(a):.1f}" stroke="#9aa1aa" stroke-width="5"/>' for a in [k * math.pi / 4 for k in range(8)])
    body = f'{rings}{spokes}<circle cx="{c}" cy="{c}" r="34" fill="#2b2f35" stroke="#9aa1aa" stroke-width="5"/><circle cx="{c}" cy="{c}" r="12" fill="{AMBER}"/><circle cx="{c}" cy="{c}" r="246" fill="none" stroke="#2b2f35" stroke-width="12"/>'
    return png(doc(W, W, body), W, W)


def fan_blades():
    W = 512; c = W / 2; body = ''
    for k in range(7):
        a = k / 7 * 360
        body += f'<path transform="rotate({a} {c} {c})" d="M{c} {c - 40} C {c + 70} {c - 90}, {c + 120} {c - 170}, {c + 60} {c - 226} C {c + 20} {c - 200}, {c - 10} {c - 120}, {c - 18} {c - 40} Z" fill="#202328" stroke="#3b4047" stroke-width="3"/>'
    body += f'<circle cx="{c}" cy="{c}" r="46" fill="#15171a"/>'
    return png(doc(W, W, f'<circle cx="{c}" cy="{c}" r="240" fill="#050607"/>' + body), W, W)


def plate_label(text_, w=512, h=128, size=56, fill=AMBER2, bg='#0b0c0e', sub=''):
    s = f'<rect width="{w}" height="{h}" fill="{bg}"/><rect x="4" y="4" width="{w - 8}" height="{h - 8}" fill="none" stroke="{STEEL3}" stroke-width="4"/>' + t(w / 2, h / 2 + size * .36 - (size * .3 if sub else 0), text_, size, fill, COND, 'bold', 'middle', 'letter-spacing="4"')
    if sub: s += t(w / 2, h - 18, sub, size * .38, '#a7a39a', MONO, 'bold', 'middle', 'letter-spacing="2"')
    return png(doc(w, h, s), w, h)


def button_face(top, sub='', fill=AMBER, ink=INK, size=None):
    W = 256; c = W / 2
    size = size or (54 if len(top) <= 5 else 40 if len(top) <= 7 else 30)
    body = f'<circle cx="{c}" cy="{c}" r="126" fill="{fill}"/><circle cx="{c}" cy="{c}" r="112" fill="none" stroke="{ink}" stroke-opacity=".35" stroke-width="3"/>' + t(c, c + size * .36 - (14 if sub else 0), top, size, ink, COND, 'bold') + (t(c, c + 46, sub, 22, ink, MONO, 'bold') if sub else '')
    return png(doc(W, W, body), W, W)


def spin_face():
    W = 512; c = W / 2
    body = f'<circle cx="{c}" cy="{c}" r="254" fill="url(#amber)"/><circle cx="{c}" cy="{c}" r="228" fill="none" stroke="{INK}" stroke-opacity=".5" stroke-width="6"/>' \
           + t(c, c + 40, 'MINE', 118, INK, COND, 'bold', 'middle', 'letter-spacing="6"') + t(c, c + 104, 'SPIN', 34, '#3b2f06', MONO, 'bold', 'middle', 'letter-spacing="8"') \
           + f'<path transform="translate(0 -42) scale(.8) translate({c * .25} {c * .25 - 30})" d="M{c - 26} {c - 150} L{c + 4} {c - 150} L{c - 10} {c - 104} L{c + 26} {c - 104} L{c - 18} {c - 40} L{c - 6} {c - 92} L{c - 34} {c - 92} Z" fill="{INK}"/>'
    return png(doc(W, W, body, AMBER_GRAD), W, W)


def breaker_plate():
    W, H = 256, 560
    body = f'''<rect width="{W}" height="{H}" fill="#9aa1aa"/><rect x="6" y="6" width="{W - 12}" height="{H - 12}" fill="none" stroke="#3b4047" stroke-width="6"/>
{hazard(16, 16, W - 32, 28)}{t(W / 2, 92, 'MAIN', 44, INK, COND)}{t(W / 2, 136, 'BREAKER', 40, INK, COND)}
{t(W / 2, 214, 'ON ▲', 40, '#1d6b3f', COND)}<rect x="40" y="244" width="{W - 80}" height="120" rx="10" fill="#1b1d21"/>{t(W / 2, 410, 'OFF ▼', 40, '#b02018', COND)}
{t(W / 2, 470, 'PULL TO MINE', 24, INK, MONO)}{hazard(16, H - 44, W - 32, 28)}'''
    return png(doc(W, H, body), W, H)


def breaker_lamp(on=True):
    """The breaker's indicator window: a green lamp and POWER ON (the test page redraws it live; the room shows this)."""
    W, H = 352, 240
    body = f'''<defs><radialGradient id="g" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="#d9ffe6"/><stop offset=".35" stop-color="#46e08a"/><stop offset="1" stop-color="#0d4a27"/></radialGradient>
<radialGradient id="h" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#46e08a" stop-opacity=".55"/><stop offset="1" stop-color="#46e08a" stop-opacity="0"/></radialGradient></defs>
<rect width="{W}" height="{H}" rx="14" fill="#101214"/><rect x="6" y="6" width="{W - 12}" height="{H - 12}" rx="10" fill="none" stroke="#2b2f35" stroke-width="4"/>
<circle cx="80" cy="96" r="70" fill="url(#h)"/><circle cx="80" cy="96" r="40" fill="url(#g)" stroke="#0a0b0c" stroke-width="6"/><circle cx="268" cy="96" r="40" fill="#2a0d0b" stroke="#0a0b0c" stroke-width="6"/>
{t(176, 196, 'POWER ON', 40, '#7dffb0', MONO)}'''
    return png(doc(W, H, body), W, H)


def render_all():
    out = {
        'concrete': concrete(3), 'concreteDark': concrete(8, base='#5f5c57'), 'steel': steel(5),
        'door': door(), 'header': header(), 'bezel': bezel(), 'screen': screen_idle(), 'glass': glass(), 'flap': flap_board(),
        'grille': fan_grille(), 'hazard': png(doc(2048, 96, hazard(0, 0, 2048, 96)), 2048, 96), 'blades': fan_blades(), 'spin': spin_face(), 'breaker': breaker_plate(), 'lamp': breaker_lamp(),
        'lblPays': button_face('SCHEDULE', 'PAYS', '#cfd5dc', size=34), 'lblDown': button_face('−HASH', 'BET', '#cfd5dc'), 'lblUp': button_face('+HASH', 'BET', '#cfd5dc'), 'lblAuto': button_face('AUTO', 'MINE', AMBER),
        'ticket': plate_label('SOUVENIR TICKET', 512, 96, 40), 'coin': plate_label('LAYR IN', 512, 96, 44),
        'nameplate': plate_label('RIG Nº 15 · THE HALVING · 21,000,000 CAP', 1024, 96, 40),
    }
    return out
