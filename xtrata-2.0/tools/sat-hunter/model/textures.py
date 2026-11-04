"""Texture painter for the Sat Hunter cabinet: a Victorian assay bench in dark oak and brushed brass with one cold blue glass light.

Surfaces are procedural. Oak grain and brushed brass are synthesised with numpy (FFT-filtered noise, so they tile and need no
art files), then framed, riveted and lettered in SVG and rasterised (CairoSVG when installed, otherwise Node's sharp, which the
repo already has), so the build needs no browser. The Xtrata mark and the ParallaX Casino wordmark are embedded exactly as
supplied in ./assets (never redrawn, recoloured, stretched or cropped). Fonts: DejaVu Sans Condensed, Mono and Serif.
Ids inside the supplied SVGs (glow, xsh, xblue, xorange, xwhite) are never reused here, so nothing in them is overridden.

Canvas hooks the game maps onto the model (the baked fallbacks below are what shows without the game):
  topperPlate 1024x320 (role topperPlate), counterL / counterR 256x1024 (roles counterL, counterR).
"""
import base64, math, os, random, re, subprocess, struct, zlib
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
COND, MONO, SERIF = 'DejaVu Sans Condensed', 'DejaVu Sans Mono', 'DejaVu Serif'
ACCENT, ACCENT2, ACCENT3 = '#00a6fb', '#6fd3ff', '#05689c'
BRASS, BRASS2, BRASS3, BRASS4 = '#d9a441', '#f3cf7a', '#8a6224', '#4d3612'
OAK, OAK2, OAK3 = '#2a1a10', '#3d2616', '#5a3a22'
INK, PAPER, GLASS = '#07090c', '#f1e9d6', '#0b1a24'
RARITY = [('COMMON', '#c9ccd1'), ('UNCOMMON', '#8be28b'), ('RARE', '#5fd0ff'), ('EPIC', '#ffd23f'), ('LEGENDARY', '#ff9bd2'), ('MYTHIC', '#ffffff')]


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


def _jpeg(data, q):
    js = "const s=require('sharp');const c=[];process.stdin.on('data',d=>c.push(d)).on('end',async()=>{process.stdout.write(await s(Buffer.concat(c)).flatten({background:'#000'}).jpeg({quality:%d,mozjpeg:true}).toBuffer())})" % q
    return subprocess.run(['node', '-e', js], input=data, capture_output=True, check=True, cwd=os.path.join(HERE, '..', '..', '..')).stdout


def pack(data, w, h, jpeg=0):
    """PNG bytes -> texture record; opaque surfaces pass jpeg=quality to keep the pack small (alpha ones stay PNG)."""
    if jpeg: data = _jpeg(data, jpeg); mime = 'image/jpeg'
    else: mime = 'image/png'
    return {'url': f'data:{mime};base64,' + base64.b64encode(data).decode(), 'w': w, 'h': h, 'bytes': len(data)}


def png(svg, w, h, jpeg=0):
    return pack(_raster(svg, w, h), w, h, jpeg)


def doc(w, h, body, defs=''):
    return f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><defs>{defs}</defs>{body}</svg>'


def t(x, y, s, size, fill, family=COND, weight='bold', anchor='middle', extra=''):
    s = s.replace('&', '&amp;').replace('<', '&lt;')
    return f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}" {extra}>{s}</text>'


def engr(x, y, s, size, family=SERIF, anchor='middle', fill=BRASS4, spacing=2):
    """Text engraved into brass: a pale lip below and right, the dark cut on top."""
    ex = f'letter-spacing="{spacing}"'
    return t(x + 1.2, y + 1.6, s, size, BRASS2, family, 'bold', anchor, ex + ' fill-opacity=".55"') + t(x, y, s, size, fill, family, 'bold', anchor, ex)


# ------------------------------------------------------------------ procedural surfaces (numpy)
def arr_url(a, raw_bytes=False):
    """uint8 HxWx3 array -> PNG data URL (tiny zlib writer, no imaging library needed)."""
    h, w, c = a.shape
    raw = b''.join(b'\x00' + a[y].tobytes() for y in range(h))
    def chunk(k, d): return struct.pack('>I', len(d)) + k + d + struct.pack('>I', zlib.crc32(k + d) & 0xffffffff)
    data = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2 if c == 3 else 6, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(raw, 6)) + chunk(b'IEND', b'')
    return data if raw_bytes else 'data:image/png;base64,' + base64.b64encode(data).decode()


def fnoise(h, w, cx, cy, seed):
    """Periodic filtered noise in 0..1: cx / cy are the cut-off frequencies in cycles per image (small = long smooth features)."""
    rng = np.random.default_rng(seed)
    f = np.fft.fft2(rng.standard_normal((h, w)))
    fy = np.fft.fftfreq(h)[:, None] * h; fx = np.fft.fftfreq(w)[None, :] * w
    f *= np.exp(-(fx / cx) ** 2 - (fy / cy) ** 2)
    n = np.real(np.fft.ifft2(f)); n -= n.min(); return n / max(n.max(), 1e-9)


def ramp(v, stops):
    """Map 0..1 values to an RGB array through (position, '#rrggbb') stops."""
    pos = [p for p, _ in stops]; cols = np.array([[int(c[i:i + 2], 16) for i in (1, 3, 5)] for _, c in stops], float)
    return np.stack([np.interp(v, pos, cols[:, k]) for k in range(3)], -1)


def oak_array(w, h, seed=3, planks=4, dark=1.0, vertical=False):
    """Dark quarter-sawn oak: planks with their own ring pattern, long fibres, medullary flecks and open pores."""
    if vertical: w, h = h, w
    v = np.zeros((h, w)); ph = h // planks
    for p in range(planks):
        rs = seed * 31 + p * 7
        warp = (fnoise(ph, w, 2, 2, rs) - .5) * 1.7 + (fnoise(ph, w, 12, 4, rs + 1) - .5) * .35
        yy = (np.arange(ph)[:, None] / ph) * (9 + (p % 3) * 2) + warp + p * .37
        ring = np.abs(np.sin(np.pi * yy)) ** .6               # late-wood bands
        fibre = fnoise(ph, w, 7, 150, rs + 2)
        fleck = (fnoise(ph, w, 60, 22, rs + 3) > .83) * .5     # medullary rays across the grain
        pores = (fnoise(ph, w, 120, 190, rs + 4) > .86) * -.55
        tone = np.clip(.5 * ring + .34 * fibre + .22 * fleck + pores + .1, 0, 1)
        tone *= .86 + .22 * fnoise(ph, w, 2, 2, rs + 5)          # slow board-to-board colour
        v[p * ph:(p + 1) * ph] = tone
    img = ramp(np.clip(v, 0, 1), [(0, '#120a05'), (.35, '#2a1a10'), (.62, '#43291a'), (.85, '#5e3d25'), (1, '#7a5233')]) * dark
    for p in range(1, planks):                                    # plank seams
        y = p * ph; img[y - 1:y + 1] *= .35; img[y + 1:y + 2] *= 1.25
    img = np.clip(img, 0, 255).astype(np.uint8)
    return np.ascontiguousarray(np.rot90(img)) if vertical else img


def brass_array(w, h, seed=11, vertical=False, tint=1.0):
    """Brushed brass: fine streaks along the brushing direction, a soft bloom and a few scratches."""
    if vertical: w, h = h, w
    streak = fnoise(h, w, 3, 260, seed); fine = fnoise(h, w, 8, 400, seed + 1); bloom = fnoise(h, w, 2, 2, seed + 2)
    rng = np.random.default_rng(seed + 3); sc = np.zeros((h, w))
    for _ in range(26):
        y = int(rng.integers(0, h)); x = int(rng.integers(0, w)); L = int(rng.integers(w // 8, w // 2)); sc[y, x:x + L] = rng.random() * .5
    v = np.clip(.38 + .42 * streak + .22 * fine + .3 * (bloom - .5) + sc * .35, 0, 1)
    img = ramp(v, [(0, BRASS4), (.3, BRASS3), (.62, BRASS), (.88, BRASS2), (1, '#fff1bf')]) * tint
    img = np.clip(img, 0, 255).astype(np.uint8)
    return np.ascontiguousarray(np.rot90(img)) if vertical else img


_CACHE = {}
def cached(key, fn):
    if key not in _CACHE: _CACHE[key] = fn()
    return _CACHE[key]


def oak_img(w, h, x=0, y=0, seed=3, vertical=False, dark=1.0, op=1):
    u = cached(('oak', w, h, seed, vertical, dark), lambda: arr_url(oak_array(w, h, seed, 4, dark, vertical)))
    return f'<image x="{x}" y="{y}" width="{w}" height="{h}" xlink:href="{u}" href="{u}" opacity="{op}" preserveAspectRatio="none"/>'


def brass_img(w, h, x=0, y=0, seed=11, vertical=False, tint=1.0):
    u = cached(('brass', w, h, seed, vertical, tint), lambda: arr_url(brass_array(w, h, seed, vertical, tint)))
    return f'<image x="{x}" y="{y}" width="{w}" height="{h}" xlink:href="{u}" href="{u}" preserveAspectRatio="none"/>'


RIVET = '<radialGradient id="shRivet" cx=".36" cy=".32" r=".75"><stop offset="0" stop-color="#fff1bf"/><stop offset=".35" stop-color="#d9a441"/><stop offset="1" stop-color="#4d3612"/></radialGradient>'
BGLOW = '<filter id="shBglow" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
BRASS_GRAD = f'<linearGradient id="shBrassG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1bf"/><stop offset=".45" stop-color="{BRASS2}"/><stop offset=".55" stop-color="{BRASS}"/><stop offset="1" stop-color="{BRASS3}"/></linearGradient>'
BLUE_GRAD = '<linearGradient id="shBlueG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6f7ff"/><stop offset=".5" stop-color="#6fd3ff"/><stop offset="1" stop-color="#05689c"/></linearGradient>'


def rivet(x, y, r=7):
    return f'<circle cx="{x}" cy="{y}" r="{r + 1.5}" fill="#000" fill-opacity=".45"/><circle cx="{x}" cy="{y}" r="{r}" fill="url(#shRivet)"/><path d="M{x - r * .55:.1f} {y + r * .1:.1f} h{r * 1.1:.1f}" stroke="{BRASS4}" stroke-width="{max(1, r * .22):.1f}" stroke-opacity=".6"/>'


def rivets_border(w, h, inset, step, r=7, skip_top=None):
    xs = [inset + k * step for k in range(int((w - 2 * inset) / step) + 1)]; ys = [inset + k * step for k in range(int((h - 2 * inset) / step) + 1)]
    s = ''
    for x in xs:
        for y in (inset, h - inset):
            if skip_top and y == inset and skip_top[0] < x < skip_top[1]: continue
            s += rivet(x, y, r)
    for y in ys[1:-1]:
        for x in (inset, w - inset): s += rivet(x, y, r)
    return s


def loupe_glyph(cx, cy, r, color=BRASS2, lens='#6fd3ff', width=None):
    """A jeweller's loupe in line art (ring, handle, one glint) used as an ornament; original drawing, not a logo."""
    sw = width or max(3, r * .16); a = math.radians(45); hx, hy = cx + r * math.cos(a), cy + r * math.sin(a)
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{lens}" fill-opacity=".14" stroke="{color}" stroke-width="{sw:.1f}"/>'
            f'<line x1="{hx:.1f}" y1="{hy:.1f}" x2="{cx + r * 1.75 * math.cos(a):.1f}" y2="{cy + r * 1.75 * math.sin(a):.1f}" stroke="{color}" stroke-width="{sw * 1.7:.1f}" stroke-linecap="round"/>'
            f'<path d="M{cx - r * .62:.1f} {cy - r * .1:.1f} A{r * .62:.1f} {r * .62:.1f} 0 0 1 {cx - r * .1:.1f} {cy - r * .62:.1f}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="{sw * .6:.1f}" stroke-linecap="round"/>')


# ------------------------------------------------------------------ tiling surfaces
def oak(seed=3, w=1024, h=1024, vertical=False, dark=1.0):
    return pack(arr_url(oak_array(w, h, seed, 4, dark, vertical), True), w, h, 86)


def brass(seed=11, w=512, h=512):
    return pack(arr_url(brass_array(w, h, seed), True), w, h, 88)


def brass_plate(w=512, h=512):
    """Corner plate: brushed brass, a bevelled inner rule and four domed rivets."""
    body = brass_img(w, h, seed=21) + f'<rect x="14" y="14" width="{w - 28}" height="{h - 28}" fill="none" stroke="{BRASS4}" stroke-opacity=".7" stroke-width="5"/><rect x="19" y="19" width="{w - 38}" height="{h - 38}" fill="none" stroke="#fff1bf" stroke-opacity=".5" stroke-width="2"/>'
    body += ''.join(rivet(x, y, 20) for x in (60, w - 60) for y in (60, h - 60))
    body += f'<path d="M{w / 2 - 70} {h / 2} h140 M{w / 2} {h / 2 - 70} v140" stroke="{BRASS4}" stroke-opacity=".35" stroke-width="5"/>'
    return png(doc(w, h, body, RIVET), w, h, jpeg=90)


def plinth_plate():
    W, H = 2048, 96
    body = brass_img(W, H, seed=23) + f'<rect x="6" y="6" width="{W - 12}" height="{H - 12}" fill="none" stroke="{BRASS4}" stroke-opacity=".7" stroke-width="4"/>' + rivets_border(W, H, 20, 120, 6)
    body += engr(W / 2, 62, 'ASSAY BENCH  ·  SAMPLES CATALOGUED  ·  SAT HUNTER', 40, SERIF, 'middle', BRASS4, 12)
    return png(doc(W, H, body, RIVET), W, H, jpeg=90)


def felt(w=1024, h=188):
    """The bench's felt inlay: deep blue baize with a brass inlay line."""
    rng = np.random.default_rng(5); n = rng.random((h, w)); lo = fnoise(h, w, 20, 20, 6)
    img = ramp(np.clip(.25 + .3 * n + .35 * lo, 0, 1), [(0, '#06121b'), (.5, '#0c2433'), (1, '#173d55')])
    body = f'<image x="0" y="0" width="{w}" height="{h}" href="{arr_url(np.clip(img, 0, 255).astype(np.uint8))}" xlink:href="{arr_url(np.clip(img, 0, 255).astype(np.uint8))}"/>'
    body += f'<rect x="10" y="10" width="{w - 20}" height="{h - 20}" fill="none" stroke="{BRASS}" stroke-width="3" stroke-opacity=".85"/><rect x="16" y="16" width="{w - 32}" height="{h - 32}" fill="none" stroke="{BRASS3}" stroke-width="1.5" stroke-opacity=".8"/>'
    return png(doc(w, h, body), w, h, jpeg=90)


# ------------------------------------------------------------------ cabinet faces
def door():
    W, H = 1024, 620
    body = oak_img(W, H, seed=7, dark=.9) + f'<rect x="0" y="0" width="{W}" height="{H}" fill="none" stroke="#000" stroke-width="16"/>'
    body += f'<rect x="20" y="20" width="{W - 40}" height="{H - 40}" fill="none" stroke="{BRASS3}" stroke-width="10"/><rect x="26" y="26" width="{W - 52}" height="{H - 52}" fill="none" stroke="{BRASS2}" stroke-width="2" stroke-opacity=".7"/>'
    body += rivets_border(W, H, 40, 118, 9)
    body += f'<rect x="150" y="104" width="{W - 300}" height="2" fill="{BRASS}"/><rect x="150" y="214" width="{W - 300}" height="2" fill="{BRASS}"/>'
    body += t(512, 176, 'EVERY SAT HAS A STORY', 66, 'url(#shBrassG)', COND, 'bold', 'middle', 'letter-spacing="5" filter="url(#shBglow)"')
    body += t(512, 252, 'EVERY SAMPLE LABELLED · EVERY SAT CHECKABLE', 25, PAPER, MONO, 'bold', 'middle', 'letter-spacing="1" fill-opacity=".85"')
    body += f'<circle cx="512" cy="372" r="104" fill="{GLASS}" stroke="{BRASS}" stroke-width="7"/><circle cx="512" cy="372" r="95" fill="none" stroke="{ACCENT}" stroke-opacity=".5" stroke-width="2"/>'
    body += nested(asset('xtrata.svg'), 432, 292, 160, 160)
    body += t(512, 528, 'SAT  HUNTER', 40, 'url(#shBrassG)', SERIF, 'bold', 'middle', 'letter-spacing="14"')
    for x in (212, 812): body += loupe_glyph(x, 372, 40, BRASS2)
    return png(doc(W, H, body, RIVET + BRASS_GRAD + BGLOW), W, H, jpeg=90)


def header():
    """The marquee: lit brass letters on blue-black glass in a riveted brass frame, loupes either side, the casino wordmark small at its foot."""
    W, H = 2048, 300
    body = f'<rect width="{W}" height="{H}" fill="{INK}"/><radialGradient id="shHalo" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="{ACCENT3}" stop-opacity=".55"/><stop offset="1" stop-color="{ACCENT3}" stop-opacity="0"/></radialGradient>'
    body += f'<rect x="20" y="20" width="{W - 40}" height="{H - 40}" fill="url(#shHalo)"/>'
    body += ''.join(f'<circle cx="{x}" cy="{y}" r="1.6" fill="{ACCENT2}" fill-opacity=".1"/>' for x in range(30, W - 20, 20) for y in range(30, H - 20, 20))
    body += brass_img(W, 22, 0, 0, 31) + brass_img(W, 22, 0, H - 22, 32) + brass_img(22, H, 0, 0, 33, True) + brass_img(22, H, W - 22, 0, 34, True)
    body += f'<rect x="22" y="22" width="{W - 44}" height="{H - 44}" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="3"/>'
    body += ''.join(rivet(x, y, 6) for x in range(60, W, 160) for y in (11, H - 11))
    body += t(W / 2 + 8, 192, 'SAT HUNTER', 156, '#000', COND, 'bold', 'middle', 'letter-spacing="24" fill-opacity=".5"')
    body += t(W / 2, 184, 'SAT HUNTER', 156, 'url(#shBrassG)', COND, 'bold', 'middle', 'letter-spacing="24" filter="url(#shBglow)"')
    for cx, s in ((250, 1), (W - 250, -1)):
        body += loupe_glyph(cx, 128, 62, BRASS2) + f'<circle cx="{cx}" cy="128" r="9" fill="#e6f7ff" filter="url(#shBglow)"/>'
        body += f'<path d="M{cx - 120 * s} 214 h{240 * s}" stroke="{BRASS}" stroke-width="3" stroke-opacity=".7"/>' + ''.join(f'<path d="M{cx - 120 * s + k * 24 * s} 214 v{14 if k % 5 == 0 else 8}" stroke="{BRASS}" stroke-width="3" stroke-opacity=".7"/>' for k in range(11))
    body += nested(asset('parallax-wordmark.svg'), W / 2 - 110, 206, 220, 67)
    return png(doc(W, H, body, RIVET + BRASS_GRAD + BGLOW), W, H, jpeg=90)


def bezel():
    """The brass bezel round the screen; the screen mesh sits over its dark centre. Rails above and below carry engraved text."""
    W, H = 1100, 820
    body = brass_img(W, H, seed=41) + f'<rect x="38" y="64" width="{W - 76}" height="{H - 140}" fill="#050607"/>'
    body += f'<rect x="30" y="56" width="{W - 60}" height="{H - 124}" fill="none" stroke="{BRASS4}" stroke-width="10"/><rect x="40" y="66" width="{W - 80}" height="{H - 144}" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="3"/>'
    body += rivets_border(W, H, 20, 98, 8, (110, W - 110))
    body += engr(64, 48, 'SPECIMEN CASE', 20, SERIF, 'start', BRASS4, 5) + engr(W - 64, 48, 'GLASS  ·  PLEASE DO NOT TAP', 20, SERIF, 'end', BRASS4, 3)
    body += f'<rect x="30" y="{H - 66}" width="{W - 60}" height="3" fill="{BRASS4}" fill-opacity=".8"/>'
    body += engr(W / 2, H - 31, 'COMMON · UNCOMMON · RARE · EPIC · LEGENDARY · MYTHIC', 20, SERIF, 'middle', BRASS4, 3)
    return png(doc(W, H, body, RIVET), W, H, jpeg=90)


def screen_idle():
    W, H = 700, 480
    body = f'<rect width="{W}" height="{H}" fill="{GLASS}"/><radialGradient id="shIdle" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="{ACCENT3}" stop-opacity=".7"/><stop offset="1" stop-color="{INK}" stop-opacity="0"/></radialGradient><rect width="{W}" height="{H}" fill="url(#shIdle)"/>'
    body += loupe_glyph(350, 170, 66, BRASS2) + t(W / 2, 330, 'SAT HUNTER', 66, 'url(#shBrassG)', COND, 'bold', 'middle', 'letter-spacing="8"') + t(W / 2, 376, 'WARMING THE LAMPS', 20, ACCENT2, MONO, 'bold', 'middle', 'letter-spacing="4"')
    return png(doc(W, H, body, BRASS_GRAD), W, H, jpeg=90)


def glass():
    """Specimen-case glass: a soft window reflection, a diagonal sheen, a cold blue edge and a little dust (alpha only)."""
    W, H = 512, 352
    r = random.Random(9); dust = ''.join(f'<circle cx="{r.random() * W:.0f}" cy="{r.random() * H:.0f}" r="{.5 + r.random() * 1.1:.1f}" fill="#fff" fill-opacity="{.05 + r.random() * .1:.2f}"/>' for _ in range(70))
    defs = ('<linearGradient id="shG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".11"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".62" stop-color="#fff" stop-opacity="0"/>'
            '<stop offset=".66" stop-color="#fff" stop-opacity=".07"/><stop offset=".72" stop-color="#fff" stop-opacity="0"/></linearGradient>'
            f'<linearGradient id="shEdge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{ACCENT2}" stop-opacity=".1"/><stop offset=".08" stop-color="{ACCENT2}" stop-opacity="0"/><stop offset=".92" stop-color="{ACCENT2}" stop-opacity="0"/><stop offset="1" stop-color="{ACCENT2}" stop-opacity=".12"/></linearGradient>')
    body = (f'<rect width="{W}" height="{H}" fill="url(#shG)"/><rect width="{W}" height="{H}" fill="url(#shEdge)"/><rect x="40" y="26" width="150" height="84" rx="4" fill="#fff" fill-opacity=".035"/>'
            f'<rect x="196" y="26" width="150" height="84" rx="4" fill="#fff" fill-opacity=".025"/>{dust}')
    return png(doc(W, H, body, defs), W, H)


# ------------------------------------------------------------------ canvas hooks (the game maps its live canvases over these)
def topper_plate(w=1024, h=320):
    """Baked topperPlate (1024x320). The game's live `topper` canvas replaces it when present."""
    body = f'<rect width="{w}" height="{h}" fill="{GLASS}"/><radialGradient id="shTp" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="{ACCENT3}" stop-opacity=".6"/><stop offset="1" stop-color="{INK}" stop-opacity="0"/></radialGradient><rect width="{w}" height="{h}" fill="url(#shTp)"/>'
    body += f'<rect x="14" y="14" width="{w - 28}" height="{h - 28}" fill="none" stroke="{BRASS}" stroke-width="5"/><rect x="24" y="24" width="{w - 48}" height="{h - 48}" fill="none" stroke="{BRASS3}" stroke-width="2"/>'
    body += loupe_glyph(50, 226, 24, BRASS2) + loupe_glyph(w - 84, 226, 24, BRASS2)
    body += t(w / 2, 142, 'EVERY SAT HAS A STORY', 62, 'url(#shBrassG)', COND, 'bold', 'middle', 'letter-spacing="4" filter="url(#shBglow)"')
    body += f'<rect x="200" y="178" width="{w - 400}" height="2" fill="{BRASS}" fill-opacity=".7"/>'
    for i, (n, c) in enumerate(RARITY):
        x = 150 + i * (w - 300) / 5
        body += f'<circle cx="{x:.0f}" cy="236" r="9" fill="{c}"/><circle cx="{x:.0f}" cy="236" r="12" fill="none" stroke="{BRASS2}" stroke-opacity=".6" stroke-width="2"/>' + t(f'{x:.0f}', 282, n, 18, PAPER, COND, 'bold', 'middle', 'letter-spacing="1" fill-opacity=".9"')
    return png(doc(w, h, body, BRASS_GRAD + BGLOW), w, h, jpeg=90)


def counter(side=1, w=256, h=1024):
    """Baked counterL / counterR (256x1024): a sat tape with the rarity ladder. The game's live `counter` canvas replaces it."""
    body = f'<rect width="{w}" height="{h}" fill="{GLASS}"/><linearGradient id="shCg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{ACCENT3}" stop-opacity=".5"/><stop offset=".5" stop-color="{ACCENT3}" stop-opacity="0"/><stop offset="1" stop-color="{ACCENT3}" stop-opacity=".45"/></linearGradient><rect width="{w}" height="{h}" fill="url(#shCg)"/>'
    body += f'<rect x="8" y="8" width="{w - 16}" height="{h - 16}" fill="none" stroke="{BRASS}" stroke-width="4"/>'
    rx = 22 if side > 0 else w - 22
    for k in range(0, 61):
        y = 40 + k * 15.6; L = 22 if k % 5 == 0 else 11
        body += f'<line x1="{rx}" y1="{y:.1f}" x2="{rx + L * (1 if side > 0 else -1)}" y2="{y:.1f}" stroke="{BRASS}" stroke-opacity=".75" stroke-width="2"/>'
    body += loupe_glyph(w / 2 + 8 * side, 120, 38, BRASS2) + t(w / 2 + 8 * side, 226, 'SAT TAPE', 36, 'url(#shBrassG)', COND, 'bold', 'middle', 'letter-spacing="4"')
    for i, (n, c) in enumerate(reversed(RARITY)):
        y = 330 + i * 98
        body += f'<rect x="{w / 2 - 80 + 8 * side}" y="{y - 38}" width="160" height="76" rx="6" fill="#000" fill-opacity=".35" stroke="{c}" stroke-opacity=".6" stroke-width="2"/><circle cx="{w / 2 - 52 + 8 * side}" cy="{y}" r="11" fill="{c}"/>'
        body += t(w / 2 - 32 + 8 * side, y + 7, n, 21 if len(n) < 8 else 16 if len(n) == 8 else 15, PAPER, COND, 'bold', 'start', 'letter-spacing="1"')
    return png(doc(w, h, body, BRASS_GRAD), w, h, jpeg=90)


def drawers(W, H, cols, rows, labels, seed=5):
    """A bank of oak drawers with brass label holders (the 3D pulls are added by the model at the same grid)."""
    cw, ch = W / cols, H / rows
    body = oak_img(W, H, seed=seed, dark=.85) + f'<rect width="{W}" height="{H}" fill="#000" fill-opacity=".25"/>'
    for r in range(rows):
        for c in range(cols):
            x, y = c * cw, r * ch; lab = labels[(r * cols + c) % len(labels)]
            body += f'<rect x="{x + 7:.1f}" y="{y + 7:.1f}" width="{cw - 14:.1f}" height="{ch - 14:.1f}" rx="5" fill="none" stroke="#000" stroke-opacity=".75" stroke-width="5"/>'
            body += f'<rect x="{x + 13:.1f}" y="{y + 13:.1f}" width="{cw - 26:.1f}" height="{ch - 26:.1f}" rx="3" fill="none" stroke="#fff" stroke-opacity=".07" stroke-width="2"/>'
            lw, lh = cw * .74, ch * .2; lx, ly = x + (cw - lw) / 2, y + ch * .2
            body += f'<rect x="{lx - 5:.1f}" y="{ly - 5:.1f}" width="{lw + 10:.1f}" height="{lh + 10:.1f}" rx="4" fill="{BRASS}"/><rect x="{lx - 5:.1f}" y="{ly - 5:.1f}" width="{lw + 10:.1f}" height="{lh + 10:.1f}" rx="4" fill="none" stroke="{BRASS4}" stroke-width="2"/>'
            body += f'<rect x="{lx:.1f}" y="{ly:.1f}" width="{lw:.1f}" height="{lh:.1f}" fill="{PAPER}"/>' + t(f'{x + cw / 2:.1f}', f'{ly + lh * .7:.1f}', lab, min(lh * .6, cw * .5 / max(len(lab), 6) * 1.3), '#2a1a10', SERIF, 'bold', 'middle', 'letter-spacing="1"')
    return png(doc(W, H, body, RIVET), W, H, jpeg=90)


SIDE_L = ['UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC', 'BLACK', 'PALINDROME', 'VINTAGE', 'NAKAMOTO', 'PIZZA', 'BLOCK 9', 'SAT RANGE', 'COINBASE', 'HALVING', 'GENESIS', 'DEGREES', 'ORDINAL', 'SAT 0']
SIDE_R = SIDE_L[9:] + SIDE_L[:9]
FRONT = ['UNCOMMON', 'BLACK', 'PALINDROME', 'VINTAGE', 'NAKAMOTO', 'BLOCK 9']
TUBES = (['UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'BLACK', 'PALINDROME', 'MYTHIC'], ['VINTAGE', 'NAKAMOTO', 'PIZZA', 'BLOCK 9', 'SAT RANGE', 'SAT 0', 'COINBASE'])


def tube_rail(k, w=1024, h=64):
    """Brass label rail under one shelf of sample tubes; seven tags at the tubes' spacing (0.13 m on a 0.98 m rail)."""
    body = brass_img(w, h, seed=60 + k) + f'<rect x="2" y="2" width="{w - 4}" height="{h - 4}" fill="none" stroke="{BRASS4}" stroke-width="3" stroke-opacity=".8"/>'
    for i, n in enumerate(TUBES[k]):
        cx = w / 2 + (i - 3) * w * .13 / .98
        body += f'<rect x="{cx - 62:.1f}" y="9" width="124" height="{h - 18}" rx="3" fill="{PAPER}" stroke="{BRASS4}" stroke-width="2"/>' + t(f'{cx:.1f}', 41, n, 18 if len(n) < 7 else 15 if len(n) < 9 else 13, '#2a1a10', SERIF, 'bold', 'middle')
    return png(doc(w, h, body, RIVET), w, h, jpeg=90)


# ------------------------------------------------------------------ controls and small plates
def button_face(top, sub='', fill=PAPER, ink='#2a1a10', size=None):
    W = 256; c = W / 2
    size = size or (54 if len(top) <= 5 else 40 if len(top) <= 7 else 31)
    body = f'<circle cx="{c}" cy="{c}" r="126" fill="{fill}"/><circle cx="{c}" cy="{c}" r="116" fill="none" stroke="{BRASS3}" stroke-width="5"/><circle cx="{c}" cy="{c}" r="106" fill="none" stroke="{ink}" stroke-opacity=".3" stroke-width="2"/>'
    body += t(c, c + size * .36 - (14 if sub else 0), top, size, ink, COND, 'bold', 'middle', 'letter-spacing="1"') + (t(c, c + 46, sub, 22, ink, MONO, 'bold', 'middle', 'letter-spacing="2"') if sub else '')
    return png(doc(W, W, body), W, W)


def spin_face():
    W = 512; c = W / 2
    body = f'<circle cx="{c}" cy="{c}" r="254" fill="url(#shSpin)"/><circle cx="{c}" cy="{c}" r="228" fill="none" stroke="{INK}" stroke-opacity=".5" stroke-width="6"/><circle cx="{c}" cy="{c}" r="212" fill="none" stroke="#fff1bf" stroke-opacity=".6" stroke-width="2"/>'
    body += loupe_glyph(c - 8, 168, 52, INK, '#00a6fb', 12) + t(c, c + 98, 'HUNT', 130, INK, COND, 'bold', 'middle', 'letter-spacing="6"')
    defs = f'<radialGradient id="shSpin" cx=".4" cy=".32" r=".85"><stop offset="0" stop-color="#fff1bf"/><stop offset=".45" stop-color="{BRASS2}"/><stop offset="1" stop-color="{BRASS3}"/></radialGradient>'
    return png(doc(W, W, body, defs), W, W)


def rocker_plate():
    W, H = 256, 560
    body = brass_img(W, H, seed=71) + f'<rect x="8" y="8" width="{W - 16}" height="{H - 16}" fill="none" stroke="{BRASS4}" stroke-width="6"/>' + rivets_border(W, H, 24, 128, 8)
    body += engr(W / 2, 104, 'GOLD PAN', 30, SERIF, 'middle', BRASS4, 2) + engr(W / 2, 148, 'ROCKER', 30, SERIF, 'middle', BRASS4, 3)
    body += engr(W / 2, 236, 'UP ▲', 30, SERIF, 'middle', BRASS4, 2) + f'<rect x="44" y="262" width="{W - 88}" height="110" rx="10" fill="{GLASS}" stroke="{BRASS4}" stroke-width="4"/>'
    body += loupe_glyph(W / 2 - 6, 312, 24, BRASS2) + engr(W / 2, 416, 'DOWN ▼', 30, SERIF, 'middle', BRASS4, 2) + engr(W / 2, 486, 'PULL TO HUNT', 21, SERIF, 'middle', BRASS4, 1)
    return png(doc(W, H, body, RIVET), W, H, jpeg=90)


def plate_label(text_, w=512, h=96, size=40):
    body = brass_img(w, h, seed=81) + f'<rect x="4" y="4" width="{w - 8}" height="{h - 8}" fill="none" stroke="{BRASS4}" stroke-width="4"/>' + engr(w / 2, h / 2 + size * .34, text_, size, SERIF, 'middle', BRASS4, 4)
    return png(doc(w, h, body, RIVET), w, h, jpeg=90)


def halo(w=256):
    c = w / 2
    body = f'<circle cx="{c}" cy="{c}" r="{c}" fill="url(#shHalo2)"/>'
    return png(doc(w, w, body, '<radialGradient id="shHalo2" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#e6f7ff" stop-opacity=".95"/><stop offset=".22" stop-color="#6fd3ff" stop-opacity=".6"/><stop offset=".6" stop-color="#00a6fb" stop-opacity=".16"/><stop offset="1" stop-color="#00a6fb" stop-opacity="0"/></radialGradient>'), w, w)


def lens(w=256):
    c = w / 2
    body = f'<circle cx="{c}" cy="{c}" r="{c}" fill="url(#shLens)"/><path d="M{c * .42:.0f} {c * .75:.0f} A{c * .62:.0f} {c * .62:.0f} 0 0 1 {c * .78:.0f} {c * .4:.0f}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="7" stroke-linecap="round"/>'
    return png(doc(w, w, body, '<radialGradient id="shLens" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#bfe9ff" stop-opacity=".05"/><stop offset=".8" stop-color="#6fd3ff" stop-opacity=".12"/><stop offset="1" stop-color="#00a6fb" stop-opacity=".35"/></radialGradient>'), w, w)


def render_all():
    out = {
        'oak': oak(3), 'oakV': oak(8, vertical=True), 'oakDark': oak(14, dark=.8), 'brass': brass(11), 'brassPlate': brass_plate(),
        'plinthPlate': plinth_plate(), 'felt': felt(), 'door': door(), 'header': header(), 'bezel': bezel(), 'screen': screen_idle(), 'glass': glass(),
        'topperPlate': topper_plate(), 'counterL': counter(1), 'counterR': counter(-1),
        'drawersL': drawers(640, 1470, 3, 6, SIDE_L, 5), 'drawersR': drawers(640, 1470, 3, 6, SIDE_R, 6), 'drawersFront': drawers(512, 1946, 1, 6, FRONT, 9),
        'tubeRailA': tube_rail(0), 'tubeRailB': tube_rail(1), 'halo': halo(), 'lens': lens(),
        'spin': spin_face(), 'rocker': rocker_plate(),
        'lblPays': button_face('RARITY', 'PAYS', size=36), 'lblDown': button_face('-SATS', 'BET', size=46), 'lblUp': button_face('+SATS', 'BET', size=46),
        'lblAuto': button_face('AUTO-HUNT', '', ACCENT2, '#04202e', size=32),
        'ticket': plate_label('SOUVENIR TICKET', 512, 96, 38), 'coin': plate_label('LAYR IN', 512, 96, 44),
        'nameplate': plate_label('ASSAY BENCH  ·  SAT HUNTER', 1024, 96, 42),
    }
    return out


if __name__ == '__main__':  # write review PNGs of every texture to ../art/cabinet
    d = os.path.normpath(os.path.join(HERE, '..', 'art', 'cabinet')); os.makedirs(d, exist_ok=True)
    for k, v in render_all().items(): open(os.path.join(d, k + ('.jpg' if v['url'].startswith('data:image/jpeg') else '.png')), 'wb').write(base64.b64decode(v['url'].split(',', 1)[1]))
