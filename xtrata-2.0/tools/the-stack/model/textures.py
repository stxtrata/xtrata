"""Texture painter for The Stack cabinet: black glass, purple edge light, the Stacks orange.

Every texture is written as SVG and rasterised (CairoSVG when installed; otherwise Node's sharp, which the repo already
has), so the build needs no browser. Supplied files are embedded exactly as supplied, never redrawn, recoloured,
stretched or cropped: the Xtrata mark and the ParallaX Casino wordmark (./assets), the Stacks logo (art/logos/stacks.svg,
the official file as bundled in @leather.io/ui) and the Bitcoin mark (art/bitcoin-mark.svg, public domain, Bitcoin.org).
Fonts: DejaVu Sans, DejaVu Sans Condensed and DejaVu Sans Mono, open fonts present on the build machines.
"""
import base64, math, os, random, re, subprocess, json

HERE = os.path.dirname(os.path.abspath(__file__))
COND, MONO, SANS = 'DejaVu Sans Condensed', 'DejaVu Sans Mono', 'DejaVu Sans'
PURPLE, PURPLE2, PURPLE3, ORANGE, ORANGE2, ORANGE3 = '#5546ff', '#8f84ff', '#2a1fb0', '#fc6432', '#ff9d72', '#b23d14'
INK, GLASS, LINE = '#06060a', '#0b0b12', '#2a2a3d'


def asset(name):
    for p in (os.path.join(HERE, 'assets', name), os.path.join(HERE, '..', 'art', name), os.path.join(HERE, '..', 'art', 'logos', name)):
        if os.path.exists(p): return open(p, encoding='utf-8').read()
    raise FileNotFoundError(name)


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



STACK_GRAD = f'<linearGradient id="sg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{PURPLE2}"/><stop offset=".55" stop-color="#c58cff"/><stop offset="1" stop-color="{ORANGE}"/></linearGradient>'
ORANGE_GRAD = f'<linearGradient id="og" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc3a3"/><stop offset=".5" stop-color="{ORANGE}"/><stop offset="1" stop-color="{ORANGE3}"/></linearGradient>'
GLASS_GRAD = f'<linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1a28"/><stop offset=".5" stop-color="{GLASS}"/><stop offset="1" stop-color="#050508"/></linearGradient>'
GLOW = '<filter id="glow" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
SOFT = '<filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>'


def black_glass(seed=3, w=1024, h=1024, base=GLASS):
    """Black glass: a deep tint with long soft reflections and the faintest grain (procedural, nobody's artwork)."""
    r = random.Random(seed)
    streaks = ''.join(f'<rect x="{r.random() * w:.0f}" y="-400" width="{20 + r.random() * 90:.0f}" height="{h + 800}" fill="#fff" fill-opacity="{.012 + r.random() * .03:.3f}" transform="rotate(24 {w / 2} {h / 2})"/>' for _ in range(7))
    grain = ''.join(f'<rect x="{r.random() * w:.0f}" y="{r.random() * h:.0f}" width="1.4" height="1.4" fill="#fff" fill-opacity="{r.random() * .05:.3f}"/>' for _ in range(900))
    defs = '<linearGradient id="v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".05"/><stop offset=".45" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>'
    return png(doc(w, h, f'<rect width="{w}" height="{h}" fill="{base}"/><rect width="{w}" height="{h}" fill="url(#v)"/>{streaks}{grain}', defs), w, h)


def edge_rule(w, h, inset=14, col=PURPLE, op=.9, sw=3):
    return f'<rect x="{inset}" y="{inset}" width="{w - 2 * inset}" height="{h - 2 * inset}" rx="10" fill="none" stroke="{col}" stroke-opacity="{op}" stroke-width="{sw}"/>'


def door():
    """The lower door: SECURED BY BITCOIN, with the Xtrata mark and the Bitcoin mark, both as supplied."""
    W, H = 1024, 620
    rules = ''.join(f'<rect x="{372 + k * 16}" y="{96 + k * 22}" width="{280 - k * 32}" height="12" rx="6" fill="{PURPLE if k < 3 else ORANGE}" fill-opacity="{.45 + k * .1:.2f}"/>' for k in range(5))
    body = f'''<rect width="{W}" height="{H}" fill="url(#gg)"/>{edge_rule(W, H, 18, PURPLE, .85, 4)}{edge_rule(W, H, 30, PURPLE, .25, 2)}
{rules}
{t(512, 262, 'SECURED BY BITCOIN', 66, 'url(#sg)', SANS, 'bold', 'middle', 'letter-spacing="6" filter="url(#glow)"')}
{t(512, 306, 'STACKS BLOCKS SETTLE ON BITCOIN · PROOF OF TRANSFER', 22, '#b9b7d6', MONO, 'bold', 'middle', 'letter-spacing="2"')}
{nested(asset('xtrata.svg'), 432, 334, 160, 160)}
{nested(asset('bitcoin-mark.svg'), 150, 364, 96, 96)}{nested(asset('bitcoin-mark.svg'), W - 246, 364, 96, 96)}
{t(512, 552, 'THE STACK', 30, ORANGE, SANS, 'bold', 'middle', 'letter-spacing="14"')}'''
    return png(doc(W, H, body, GLASS_GRAD + STACK_GRAD + GLOW), W, H)


def header():
    """The marquee: THE STACK lit purple to orange on black glass, the official Stacks logo either side, the casino wordmark small at its foot."""
    W, H = 2048, 300
    body = f'''<rect width="{W}" height="{H}" fill="#050508"/><rect width="{W}" height="{H}" fill="url(#gg)" fill-opacity=".6"/>
<rect x="10" y="10" width="{W - 20}" height="{H - 20}" rx="14" fill="none" stroke="{PURPLE}" stroke-width="6"/><rect x="22" y="22" width="{W - 44}" height="{H - 44}" rx="10" fill="none" stroke="{PURPLE}" stroke-opacity=".3" stroke-width="2"/>
<rect x="420" y="60" width="{W - 840}" height="150" rx="75" fill="{PURPLE}" fill-opacity=".16" filter="url(#soft)"/>
{t(W / 2, 182, 'THE STACK', 150, 'url(#sg)', SANS, 'bold', 'middle', 'letter-spacing="26" filter="url(#glow)"')}
{nested(asset('parallax-wordmark.svg'), W / 2 - 110, 206, 220, 67)}
{nested(asset('stacks.svg'), 70, 60, 180, 180)}{nested(asset('stacks.svg'), W - 250, 60, 180, 180)}'''
    return png(doc(W, H, body, GLASS_GRAD + STACK_GRAD + GLOW + SOFT), W, H)


def bezel():
    """A thin black bezel round the screen (the screen mesh covers its centre), with a hairline of purple."""
    W, H = 1100, 820
    body = f'''<rect width="{W}" height="{H}" fill="url(#gg)"/><rect x="38" y="64" width="{W - 76}" height="{H - 140}" fill="#030305"/>
<rect x="32" y="58" width="{W - 64}" height="{H - 128}" rx="6" fill="none" stroke="{PURPLE}" stroke-opacity=".8" stroke-width="3"/>
{t(54, 42, 'STACKS · BITCOIN L2', 24, PURPLE2, MONO, 'bold', 'start', 'letter-spacing="3"')}{t(W - 54, 42, 'BLOCKS ▸ LIVE', 24, ORANGE, MONO, 'bold', 'end', 'letter-spacing="3"')}
{t(W / 2, H - 22, 'ONE STACKING CYCLE · 2,100 BITCOIN BLOCKS · THE FLOOR POT PAYS EVERY TWIN', 19, '#9d9bbd', MONO, 'bold', 'middle', 'letter-spacing="1"')}'''
    return png(doc(W, H, body, GLASS_GRAD), W, H)


def screen_idle():
    W, H = 700, 480
    defs = f'<linearGradient id="bgx" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b1460"/><stop offset=".6" stop-color="#0a0a12"/><stop offset="1" stop-color="#5a2410"/></linearGradient>'
    return png(doc(W, H, f'<rect width="{W}" height="{H}" fill="url(#bgx)"/>' + t(W / 2, H / 2, 'THE STACK', 64, '#fff', SANS) + t(W / 2, H / 2 + 50, 'READING THE CHAIN…', 20, '#b9b7d6', MONO), defs), W, H)


def glass():
    W, H = 512, 352
    return png(doc(W, H, '<rect width="512" height="352" fill="url(#g)"/>', '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".09"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/><stop offset=".72" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'), W, H)


def pot_board(rec):
    """The topper display as baked into the model: the cycle and the Bitcoin block it ends at, as read at build time. A host
    that maps the game's live topper canvas onto the potBoard part shows the live Floor Pot and countdown instead."""
    W, H = 1024, 256
    p = rec['pox']
    body = f'''<rect width="{W}" height="{H}" fill="#040406"/><rect x="8" y="8" width="{W - 16}" height="{H - 16}" rx="12" fill="none" stroke="{PURPLE}" stroke-width="4"/>
{t(W / 2, 62, 'THE FLOOR POT · EVERY FOREVER TWIN', 30, PURPLE2, SANS, 'bold', 'middle', 'letter-spacing="4"')}
{t(W / 2, 150, f"CYCLE {p['cycle']}", 92, '#ffffff', SANS, 'bold', 'middle', 'letter-spacing="6"')}
{t(W / 2, 214, f"ENDS AT BITCOIN BLOCK {p['nextRewardStart']:,} · LIVE ON THE SCREEN", 24, ORANGE2, MONO, 'bold', 'middle', 'letter-spacing="1"')}'''
    return png(doc(W, H, body), W, H)


def ticker_panel(rec):
    """A side panel's ticker as baked into the model (heights at build time, marked so). A host that maps the game's live
    ticker canvas onto the tickerPanel parts shows live heights instead."""
    W, H = 512, 1024
    tip = rec['tip']
    def row(y, label, col, val):
        return (f'<rect x="40" y="{y}" width="{W - 80}" height="300" rx="16" fill="#08080d" stroke="{col}" stroke-width="4"/>' + t(W / 2, y + 74, label, 40, col, SANS, 'bold', 'middle', 'letter-spacing="6"')
                + t(W / 2, y + 182, val, 74, '#ffffff', COND) + t(W / 2, y + 252, 'AT BUILD · 2 NOV 2026', 24, '#8b89a8', MONO))
    body = f'''<rect width="{W}" height="{H}" fill="url(#gg)"/>{edge_rule(W, H, 14, PURPLE, .9, 4)}
{t(W / 2, 92, 'LATEST BLOCKS', 40, '#d9d7f2', SANS, 'bold', 'middle', 'letter-spacing="6"')}
{row(150, 'BITCOIN', ORANGE, f"{tip['burn']:,}")}{row(500, 'STACKS', PURPLE2, f"{tip['stacks']:,}")}
{t(W / 2, 900, 'READ FROM THE HIRO API', 26, '#8b89a8', MONO)}{t(W / 2, 950, 'A SOFT CHIME ON EVERY NEW BLOCK', 22, '#8b89a8', MONO)}'''
    return png(doc(W, H, body, GLASS_GRAD), W, H)


def plate_label(text_, w=512, h=128, size=56, fill='#e7e5ff', bg='#07070b', sub=''):
    s = f'<rect width="{w}" height="{h}" fill="{bg}"/><rect x="4" y="4" width="{w - 8}" height="{h - 8}" rx="8" fill="none" stroke="{PURPLE}" stroke-opacity=".7" stroke-width="4"/>' + t(w / 2, h / 2 + size * .36 - (size * .3 if sub else 0), text_, size, fill, SANS, 'bold', 'middle', 'letter-spacing="4"')
    if sub: s += t(w / 2, h - 18, sub, size * .38, '#9d9bbd', MONO, 'bold', 'middle', 'letter-spacing="2"')
    return png(doc(w, h, s), w, h)


def button_face(top, sub='', fill='#15151f', ink='#e7e5ff', ring=PURPLE, size=None):
    W = 256; c = W / 2
    size = size or (52 if len(top) <= 4 else 40 if len(top) <= 6 else 30)
    body = (f'<circle cx="{c}" cy="{c}" r="126" fill="{fill}"/><circle cx="{c}" cy="{c}" r="110" fill="none" stroke="{ring}" stroke-width="5"/>'
            + t(c, c + size * .36 - (14 if sub else 0), top, size, ink, SANS, 'bold') + (t(c, c + 48, sub, 22, '#9d9bbd', MONO, 'bold') if sub else ''))
    return png(doc(W, W, body), W, W)


def spin_face():
    W = 512; c = W / 2
    bars = ''.join(f'<rect x="{c - 70 + k * 6}" y="{c - 150 + k * 22}" width="{140 - k * 12}" height="14" rx="7" fill="{INK}" fill-opacity="{.85 - k * .12:.2f}"/>' for k in range(4))
    body = (f'<circle cx="{c}" cy="{c}" r="254" fill="url(#og)"/><circle cx="{c}" cy="{c}" r="228" fill="none" stroke="{INK}" stroke-opacity=".45" stroke-width="6"/>{bars}'
            + t(c, c + 52, 'STACK', 112, INK, SANS, 'bold', 'middle', 'letter-spacing="4"') + t(c, c + 114, 'SPIN', 34, '#4a1a06', MONO, 'bold', 'middle', 'letter-spacing="10"'))
    return png(doc(W, W, body, ORANGE_GRAD), W, W)


def lever_plate():
    """The lever's mounting plate on the right pillar."""
    W, H = 256, 560
    bars = ''.join(f'<rect x="{88 + k * 4}" y="{220 + k * 34}" width="{80 - k * 8}" height="16" rx="8" fill="{PURPLE if k < 3 else ORANGE}" fill-opacity=".75"/>' for k in range(6))
    body = f'<rect width="{W}" height="{H}" fill="#0b0b12"/>{edge_rule(W, H, 8, PURPLE, .9, 4)}{t(W / 2, 80, "PULL", 52, "#e7e5ff", SANS)}{t(W / 2, 124, "TO STACK", 30, ORANGE, SANS)}{bars}{t(W / 2, 500, "▼", 44, ORANGE, SANS)}'
    return png(doc(W, H, body), W, H)


def render_all():
    rec = json.load(open(os.path.join(HERE, '..', 'art', 'records.json'), encoding='utf-8'))
    return {
        'glass': black_glass(3), 'glassDark': black_glass(8, base='#07070c'), 'deckGlass': black_glass(11, 512, 512, '#0d0d16'),
        'door': door(), 'header': header(), 'bezel': bezel(), 'screen': screen_idle(), 'screenGlass': glass(), 'pot': pot_board(rec), 'ticker': ticker_panel(rec),
        'spin': spin_face(), 'leverPlate': lever_plate(),
        'lblPays': button_face('DOCS', 'PAYS'), 'lblDown': button_face('−STX', 'BET'), 'lblUp': button_face('+STX', 'BET'), 'lblAuto': button_face('AUTO', 'STACK', ring=ORANGE),
        'ticket': plate_label('SOUVENIR TICKET', 512, 96, 40), 'coin': plate_label('LAYR IN', 512, 96, 44),
        'nameplate': plate_label('Nº 10 · THE STACK · SECURED BY BITCOIN', 1024, 96, 38),
    }


if __name__ == '__main__':
    import time; t0 = time.time(); T = render_all(); print({k: v['bytes'] for k, v in T.items()}, round(time.time() - t0, 1), 's')
