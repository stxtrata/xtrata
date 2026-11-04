#!/usr/bin/env python3
"""Turn the logo files Jim supplied (art/logos-src, copied unmodified from his Downloads/Logos folder) into the small
trimmed PNGs the game embeds (art/logos/*.png) plus art/logos/manifest.json: {key: {file, w, h, bg, name}}.
Only trimming of empty margins and downscaling (max 420 px wide) is done; colours and shapes are not touched.
Usage: python3 -I art/_gen_logos.py   (needs Pillow and rsvg-convert)"""
import os, json, subprocess, tempfile
from PIL import Image, ImageChops
HERE = os.path.dirname(os.path.abspath(__file__)); SRC = os.path.join(HERE, 'logos-src'); OUT = os.path.join(HERE, 'logos')
# key -> (source file, display name, plate colour override or None to detect)
LOGOS = {
 'mtgox': ('MtGOX.jpg', 'Mt. Gox', None), 'bitstamp': ('Bitstamp-vector-logo_(cropped).svg', 'Bitstamp', None),
 'bitfinex': ('Bitfinex Logo.png', 'Bitfinex', None), 'coincheck': ('Coincheck.png', 'Coincheck', None),
 'zaif': ('Zaif.png', 'Zaif', None), 'cryptopia': ('Cryptopia.png', 'Cryptopia', None), 'quadriga': ('quadrigacx-e1551432579383.jpg', 'QuadrigaCX', None),
 'bithumb': ('bithumb.png', 'Bithumb', None), 'binance': ('Binance_logo.svg', 'Binance', '#0b0e11'), 'upbit': ('UpBit.png', 'Upbit', None),
 'kucoin': ('Kucoin.png', 'KuCoin', None), 'dmm': ('DMM-Bitcoin.png', 'DMM Bitcoin', None), 'wazirx': ('Wazirx.webp', 'WazirX', None),
 'bybit': ('BYBIT.png', 'Bybit', None), 'bitgo': ('bitgo.png', 'BitGo', None), 'ey': ('Ernst_&_Young_Corporate_Logo.svg.webp', 'EY', None)}
def hexc(c): return '#%02x%02x%02x' % c[:3]
os.makedirs(OUT, exist_ok=True); man = {}
for key, (f, name, bgo) in LOGOS.items():
    p = os.path.join(SRC, f); tmp = None
    if f.endswith('.svg'):
        tmp = tempfile.NamedTemporaryFile(suffix='.png', delete=False).name; sp = p
        if key == 'bitstamp':  # the supplied SVG's viewBox misses its own artwork (the group is translated out of frame): re-frame it, nothing else
            import re; t = open(p, encoding='utf8').read(); t = re.sub(r'viewBox="[^"]*"', 'viewBox="0 0 1000 700"', t, count=1); t = re.sub(r'width="[^"]*" height="[^"]*"', 'width="1000" height="700"', t, count=1)
            sp = tmp + '.svg'; open(sp, 'w', encoding='utf8').write(t)
        subprocess.run(['rsvg-convert', '-w', '1400' if key == 'bitstamp' else '900', sp, '-o', tmp], check=True); p = tmp
    im = Image.open(p).convert('RGBA')
    # Plate colour: an opaque border colour if the file has one, else the override, else white.
    corners = [im.getpixel(xy) for xy in [(0, 0), (im.width - 1, 0), (0, im.height - 1), (im.width - 1, im.height - 1)]]
    opaque = all(c[3] > 250 for c in corners) and len({c[:3] for c in corners}) == 1
    bg = hexc(corners[0]) if opaque else (bgo or '#ffffff')
    if opaque and bg in ('#ffffff', '#fefefe', '#fdfdfd'): bg = '#ffffff'
    base = Image.new('RGBA', im.size, (*(int(bg[i:i+2], 16) for i in (1, 3, 5)), 255))
    diff = ImageChops.difference(Image.alpha_composite(base, im).convert('RGB'), base.convert('RGB')).convert('L').point(lambda v: 255 if v > 24 else 0)
    box = diff.getbbox() or (0, 0, im.width, im.height); pad = max(2, int(min(im.size) * .01))
    box = (max(0, box[0] - pad), max(0, box[1] - pad), min(im.width, box[2] + pad), min(im.height, box[3] + pad)); im = im.crop(box)
    if im.width > 420: im = im.resize((420, round(im.height * 420 / im.width)), Image.LANCZOS)
    if opaque: im = Image.alpha_composite(Image.new('RGBA', im.size, (*(int(bg[i:i+2], 16) for i in (1, 3, 5)), 255)), im)
    im.save(os.path.join(OUT, key + '.png'), optimize=True); man[key] = {'file': 'logos/%s.png' % key, 'w': im.width, 'h': im.height, 'bg': bg, 'name': name, 'source': f}
    if tmp: os.unlink(tmp)
json.dump(man, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
print('ok:', len(man), 'logos,', sum(os.path.getsize(os.path.join(OUT, v['file'].split('/')[1])) for v in man.values()) // 1024, 'KB'); print({k: (v['w'], v['h'], v['bg']) for k, v in man.items()})
