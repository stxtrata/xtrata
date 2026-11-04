"""Texture painter for the Who Is Satoshi? cabinet.

Every texture is written as SVG and rasterised with CairoSVG (no browser needed), so the build runs the same on
any machine with Python. The Xtrata mark and the ParallaX Casino wordmark are embedded exactly as supplied in
./assets (never redrawn, recoloured, stretched or cropped). Fonts: TeX Gyre Pagella (period serif) and DejaVu Sans
Mono (typewriter), both open fonts present on the build machines; the ₿ glyph is set in type (public-domain symbol).
"""
import base64, math, os, random, re
import cairosvg

HERE = os.path.dirname(os.path.abspath(__file__))
SERIF, MONO = 'TeX Gyre Pagella', 'DejaVu Sans Mono'
BRASS, BRASS2, BRASS3 = '#e0b04a', '#f6d98f', '#8a6420'


def asset(name):
    return open(os.path.join(HERE, 'assets', name), encoding='utf-8').read()


def nested(svg_text, x, y, w, h):
    """Place a supplied SVG inside another at (x, y, w, h), keeping its own viewBox (uniform scale, no crop)."""
    s = re.sub(r'<\?xml[^>]*>', '', svg_text).strip()
    s = re.sub(r'<svg\b([^>]*?)\swidth="[^"]*"', r'<svg\1', s, count=1)
    s = re.sub(r'<svg\b([^>]*?)\sheight="[^"]*"', r'<svg\1', s, count=1)
    return s.replace('<svg', f'<svg x="{x}" y="{y}" width="{w}" height="{h}" preserveAspectRatio="xMidYMid meet"', 1)


def png(svg, w, h):
    data = cairosvg.svg2png(bytestring=svg.encode('utf-8'), output_width=w, output_height=h)
    return {'url': 'data:image/png;base64,' + base64.b64encode(data).decode(), 'w': w, 'h': h, 'bytes': len(data)}


def doc(w, h, body, defs=''):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><defs>{defs}</defs>{body}</svg>'


def t(x, y, s, size, fill, family=SERIF, weight='bold', anchor='middle', extra=''):
    s = s.replace('&', '&amp;').replace('<', '&lt;')
    return f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}" {extra}>{s}</text>'


BRASS_GRAD = '<linearGradient id="brass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbe7ad"/><stop offset=".45" stop-color="#e0b04a"/><stop offset="1" stop-color="#8a6420"/></linearGradient>'


def wood(seed=3, w=1024, h=1024, base='#4a1f12', dark='#2b100a', light='#6b2e18'):
    r = random.Random(seed)
    paths = []
    for k in range(70):
        y0 = r.random() * h; amp = 4 + r.random() * 18; freq = 1 + r.random() * 3; ph = r.random() * 6.28
        pts = ' '.join(f'{x},{y0 + amp * math.sin(x / w * freq * 6.28 + ph) + 6 * math.sin(x / 37 + k):.1f}' for x in range(0, w + 16, 16))
        col = dark if k % 3 else light
        paths.append(f'<polyline points="{pts}" fill="none" stroke="{col}" stroke-opacity="{.18 + r.random() * .25:.2f}" stroke-width="{1 + r.random() * 3.5:.1f}"/>')
    for k in range(6):  # knots
        cx, cy = r.random() * w, r.random() * h
        paths.append(f'<ellipse cx="{cx:.0f}" cy="{cy:.0f}" rx="{18 + r.random() * 26:.0f}" ry="{6 + r.random() * 8:.0f}" fill="none" stroke="{dark}" stroke-opacity=".35" stroke-width="3"/>')
    return png(doc(w, h, f'<rect width="{w}" height="{h}" fill="{base}"/>' + ''.join(paths) + f'<rect width="{w}" height="{h}" fill="url(#sheen)"/>',
                   '<linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".06"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient>'), w, h)


def door():
    W, H = 1024, 620
    r = random.Random(5)
    frost = ''.join(f'<circle cx="{r.random() * W:.0f}" cy="{r.random() * H:.0f}" r="{r.random() * 2.2:.1f}" fill="#fff" fill-opacity="{r.random() * .12:.2f}"/>' for _ in range(900))
    body = f'''<rect width="{W}" height="{H}" fill="url(#glass)"/>{frost}
<rect x="10" y="10" width="{W - 20}" height="{H - 20}" fill="none" stroke="#2b100a" stroke-width="20"/>
<rect x="24" y="24" width="{W - 48}" height="{H - 48}" fill="none" stroke="url(#brass)" stroke-width="4"/>
<path d="M150 210 Q512 150 874 210" fill="none" stroke="none" id="arc"/>
{t(512, 190, 'S. NAKAMOTO', 96, 'url(#leaf)', SERIF, 'bold', 'middle', 'letter-spacing="10" stroke="#5a3c0c" stroke-width="2"')}
<rect x="300" y="222" width="424" height="4" fill="url(#brass)"/>
{t(512, 288, 'INQUIRIES', 58, 'url(#leaf)', SERIF, 'bold', 'middle', 'letter-spacing="18" stroke="#5a3c0c" stroke-width="1.5"')}
{t(512, 336, 'PLEASE KNOCK · NO ANSWER EXPECTED', 22, '#3a2a14', MONO, 'bold', 'middle', 'letter-spacing="3" fill-opacity=".75"')}
{nested(asset('xtrata.svg'), 432, 372, 160, 160)}
{t(512, 572, 'ParallaX Casino · Who Is Satoshi?', 18, '#3a2a14', SERIF, 'normal', 'middle', 'font-style="italic" fill-opacity=".7"')}'''
    defs = BRASS_GRAD + '''<linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6ddd2"/><stop offset=".5" stop-color="#b9c4b6"/><stop offset="1" stop-color="#93a093"/></linearGradient>
<linearGradient id="leaf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2c4"/><stop offset=".5" stop-color="#e0b04a"/><stop offset="1" stop-color="#9a6e1c"/></linearGradient>'''
    return png(doc(W, H, body, defs), W, H)


def label(text_, w=512, h=128, size=56, fill=BRASS2, bg='#120c06'):
    return png(doc(w, h, f'<rect width="{w}" height="{h}" fill="{bg}"/>' + t(w / 2, h / 2 + size * .36, text_, size, fill, MONO, 'bold', 'middle', 'letter-spacing="4"')), w, h)


def header():
    W, H = 2048, 300
    body = f'''<rect width="{W}" height="{H}" fill="url(#black)"/>
<rect x="12" y="12" width="{W - 24}" height="{H - 24}" fill="none" stroke="url(#brass)" stroke-width="8"/><rect x="28" y="28" width="{W - 56}" height="{H - 56}" fill="none" stroke="#e0b04a" stroke-opacity=".5" stroke-width="2"/>
{t(W / 2, 172, 'WHO IS SATOSHI?', 118, 'url(#leaf)', SERIF, 'bold', 'middle', 'letter-spacing="14" stroke="#5a3c0c" stroke-width="2"')}
<rect x="380" y="208" width="{W - 760}" height="3" fill="url(#brass)"/>
{nested(asset('parallax-wordmark.svg'), W / 2 - 130, 216, 260, 79)}
{t(150, 178, '₿', 130, 'url(#leaf)', SERIF, 'bold')}{t(W - 150, 178, '₿', 130, 'url(#leaf)', SERIF, 'bold')}'''
    defs = BRASS_GRAD + '''<linearGradient id="black" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16110b"/><stop offset="1" stop-color="#050302"/></linearGradient>
<linearGradient id="leaf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2c4"/><stop offset=".55" stop-color="#e0b04a"/><stop offset="1" stop-color="#9a6e1c"/></linearGradient>'''
    return png(doc(W, H, body, defs), W, H)


def folder():
    """The screen surround: a typewriter-era case-file folder."""
    W, H = 1100, 820
    r = random.Random(9)
    stains = ''.join(f'<circle cx="{r.random() * W:.0f}" cy="{r.random() * H:.0f}" r="{20 + r.random() * 60:.0f}" fill="#7a5420" fill-opacity="{.04 + r.random() * .06:.2f}"/>' for _ in range(10))
    body = f'''<rect x="0" y="40" width="{W}" height="{H - 40}" rx="10" fill="#c9ab70"/><path d="M40 40 L60 0 L420 0 L440 40 Z" fill="#d6b97f"/>
{t(240, 30, 'CASE FILE No. 2008-10-31', 24, '#3d2d12', MONO, 'bold')}{stains}
<rect x="40" y="70" width="{W - 80}" height="{H - 140}" fill="#16110b"/>
{t(W - 60, 30, 'CONFIDENTIAL', 26, '#b8261d', MONO, 'bold', 'end', 'letter-spacing="3"')}
{t(W / 2, H - 28, 'SUBJECT: S. NAKAMOTO · STATUS: UNIDENTIFIED', 24, '#3d2d12', MONO, 'bold', 'middle', 'letter-spacing="2"')}
'''
    return png(doc(W, H, body), W, H)


def screen_idle():
    W, H = 700, 480
    return png(doc(W, H, f'<rect width="{W}" height="{H}" fill="#120d08"/>' + t(W / 2, H / 2, 'WHO IS SATOSHI?', 52, BRASS, SERIF) + t(W / 2, H / 2 + 50, 'OPENING THE CASE FILE…', 20, '#b3a383', MONO)), W, H)


def glass():
    W, H = 512, 352
    return png(doc(W, H, '<rect width="512" height="352" fill="url(#g)"/>', '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".10"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/><stop offset=".72" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'), W, H)


CLUES = [('31 OCT 2008', 'Whitepaper posted'), ('3 JAN 2009', 'Genesis block'), ('DEC 2010', 'Last forum post'), ('APR 2011', 'Last known email')]


def cork_layout(W, H):
    """Card positions (x, y, rotation) on a cork board of W x H; returns the pin points too (same for the string overlay)."""
    if W > H:  # landscape (outer side)
        cards = [(.2, .28, -6), (.62, .22, 5), (.36, .7, 4), (.8, .66, -5)]
    else:      # portrait (front strip)
        cards = [(.5, .14, -5), (.5, .38, 4), (.5, .62, -4), (.5, .86, 5)]
    return [(x * W, y * H, a) for x, y, a in cards]


def cork(W, H, seed=11):
    r = random.Random(seed)
    grain = ''.join(f'<circle cx="{r.random() * W:.0f}" cy="{r.random() * H:.0f}" r="{.8 + r.random() * 2.4:.1f}" fill="{r.choice(["#5d3a1a", "#a8743c", "#7a4e24", "#c69a5e"])}" fill-opacity=".55"/>' for _ in range(int(W * H / 160)))
    cw, ch = (W * .3, H * .2) if W > H else (W * .78, H * .17)
    cards = ''
    for (x, y, a), (date, what) in zip(cork_layout(W, H), CLUES):
        cards += f'''<g transform="translate({x:.0f},{y:.0f}) rotate({a})"><rect x="{-cw / 2:.0f}" y="{-ch / 2:.0f}" width="{cw:.0f}" height="{ch:.0f}" fill="#f1e6c8" stroke="#8a6a34" stroke-width="2"/>
{t(0, -ch * .05, date, min(ch * .26, cw * .13), '#211a12', MONO, 'bold')}{t(0, ch * .28, what, min(ch * .17, cw * .1), '#5a4422', SERIF, 'normal', 'middle', 'font-style="italic"')}
<circle cx="0" cy="{-ch / 2 + 10:.0f}" r="9" fill="#c0392b" stroke="#6a1510" stroke-width="2"/></g>'''
    body = f'<rect width="{W}" height="{H}" fill="#9c6b37"/>{grain}<rect x="6" y="6" width="{W - 12}" height="{H - 12}" fill="none" stroke="#3a1a0c" stroke-width="12"/>{string_paths(W, H, .55)}{cards}'
    return png(doc(W, H, body), W, H)


def string_paths(W, H, op=1.0, glow=False):
    pts = cork_layout(W, H)
    ch = H * .2 if W > H else H * .17
    pins = [(x, y - ch / 2 + 10) for x, y, a in pts]
    d = 'M' + ' L'.join(f'{x:.0f} {y:.0f}' for x, y in pins + [pins[0]] if True)
    s = ''
    if glow:
        s += f'<path d="{d}" fill="none" stroke="#ff5a3c" stroke-opacity=".35" stroke-width="18" stroke-linejoin="round"/>'
    return s + f'<path d="{d}" fill="none" stroke="#d1291c" stroke-opacity="{op}" stroke-width="{5 if glow else 4}" stroke-linejoin="round"/>'


def string_overlay(W, H):
    return png(doc(W, H, string_paths(W, H, 1.0, True)), W, H)


def key_bow():
    """The ₿ cut into the brass key's bow: brass disc with the glyph engraved through it."""
    W = 512
    body = f'''<circle cx="256" cy="256" r="250" fill="url(#brass)"/><circle cx="256" cy="256" r="236" fill="none" stroke="#5a3c0c" stroke-width="6"/>
<circle cx="256" cy="256" r="196" fill="#120c06"/>{t(256, 356, '₿', 300, 'url(#brass)', SERIF, 'bold')}'''
    return png(doc(W, W, body, BRASS_GRAD), W, W)


def key_button(text_, sub='', w=256):
    body = f'<circle cx="{w / 2}" cy="{w / 2}" r="{w / 2 - 2}" fill="#16120d"/><circle cx="{w / 2}" cy="{w / 2}" r="{w / 2 - 10}" fill="none" stroke="#f1e6c8" stroke-opacity=".25" stroke-width="3"/>'
    size = 52 if len(text_) <= 6 else 40 if len(text_) <= 9 else 30
    body += t(w / 2, w / 2 + (size * .36 if not sub else 4), text_, size, '#f1e6c8', MONO, 'bold')
    if sub:
        body += t(w / 2, w / 2 + 46, sub, 22, '#c2ad84', MONO, 'bold')
    return png(doc(w, w, body), w, w)


def spin_face():
    w = 512
    body = f'''<circle cx="256" cy="256" r="254" fill="url(#brass)"/><circle cx="256" cy="256" r="232" fill="none" stroke="#5a3c0c" stroke-width="5"/>
<g transform="translate(256,200)" fill="none" stroke="#2a1d08" stroke-width="16" stroke-linecap="round"><circle cx="-14" cy="-14" r="58"/><path d="M28 28 L80 80"/></g>
{t(256, 352, 'INVESTIGATE', 54, '#2a1d08', MONO, 'bold', 'middle', 'letter-spacing="2"')}{t(256, 404, 'PULL OR PRESS', 24, '#5a3c0c', MONO, 'bold')}'''
    return png(doc(w, w, body, BRASS_GRAD), w, w)


def leather(w=512, h=256):
    r = random.Random(4)
    dots = ''.join(f'<circle cx="{r.random() * w:.0f}" cy="{r.random() * h:.0f}" r="{.6 + r.random() * 1.6:.1f}" fill="#0d2418" fill-opacity=".6"/>' for _ in range(1400))
    body = f'<rect width="{w}" height="{h}" fill="#1f4a33"/>{dots}<rect x="10" y="10" width="{w - 20}" height="{h - 20}" fill="none" stroke="#e0b04a" stroke-opacity=".7" stroke-width="3" stroke-dasharray="10 6"/>'
    return png(doc(w, h, body), w, h)


def render_all():
    out = {
        'wood': wood(3), 'woodDark': wood(8, base='#2b120a', dark='#160805', light='#43200f'),
        'door': door(), 'header': header(), 'folder': folder(), 'screen': screen_idle(), 'glass': glass(),
        'corkFront': cork(256, 900, 11), 'corkSide': cork(1000, 720, 12),
        'stringFront': string_overlay(256, 900), 'stringSide': string_overlay(1000, 720),
        'bow': key_bow(), 'spin': spin_face(), 'leather': leather(),
        'lblPays': key_button('CASE', 'FILE'), 'lblDown': key_button('−CLUES'), 'lblUp': key_button('+CLUES'), 'lblAuto': key_button('AUTO', 'SLEUTH'),
        'ticket': label('SOUVENIR TICKET', 512, 96, 40), 'coin': label('LAYR IN', 512, 96, 44),
        'nameplate': label('S. NAKAMOTO · INQUIRIES', 1024, 96, 44),
    }
    return out
