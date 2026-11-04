#!/usr/bin/env python3
"""Bundle the real art for Xtrata Originals into art/xo-art.json (data URIs, the Forever Twins art.js pattern)
plus art/images/ copies and the records sources.json needs. Inputs are the raw captures in ./raw (made by
fetch_auds.py, fetch_eds.py, render_auds.cjs, render_cicadas.cjs, astro2.cjs, layers.py, fetch_layer_imgs.py)."""
import json, base64, io, os, subprocess, struct, math
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); R = os.path.join(HERE, 'raw'); OUT = os.path.normpath(os.path.join(HERE, '..', 'art')); ROOT = os.path.normpath(os.path.join(HERE, '..', '..', '..')); os.makedirs(OUT + '/images', exist_ok=True)
# Raw captures (made by the scripts beside this file) go in art-src/raw/; they are not committed.
def webp(im, size=224, q=82, name=None):
    im = im.convert('RGB'); im.thumbnail((size, size), Image.LANCZOS) if im.size[0] >= im.size[1] else im.thumbnail((size, size), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, 'WEBP', quality=q, method=6); d = b.getvalue()
    if name: open(f'{OUT}/images/{name}.webp', 'wb').write(d)
    return 'data:image/webp;base64,' + base64.b64encode(d).decode()
def sq(im, box, size=224): return im.crop(box).resize((size, size), Image.LANCZOS)
art = {'generated': '2026-11-01', 'audionauts': [], 'cicadas': [], 'calls': [], 'astro': [], 'layers': [], 'logos': {}}
# Audionauts: 30 minted editions, portraits rendered from master player #3060 with each edition's own seed.
eds = json.load(open(f'{R}/aud-editions.json')); names = json.load(open(f'{R}/aud-names.json'))
for e in eds:
    im = Image.open(f"{R}/aud/{e['edition']:03d}.png")
    art['audionauts'].append({'edition': e['edition'], 'tokenId': e['tokenId'], 'name': names.get(str(e['edition'])), 'seed': e['seed'], 'mintTx': e['tx'], 'uri': webp(im.resize((224, 224), Image.LANCZOS), 224, 84, f"audionaut-{e['edition']:03d}-{e['tokenId']}")})
# Cicadas: 18 seeds across the rarity ranks, rendered by the Cicada.btc master engine v11.3.6 (framing offsets zeroed).
allc = {x[0]: x for x in json.load(open(f'{R}/cicada-all.json'))}
CSEEDS = [1639, 2710, 2654, 1854, 3188, 443, 597, 151, 1046, 682, 1629, 401, 2829, 2453, 1889, 3137, 2741, 1753]
for s in CSEEDS:
    im = Image.open(f'{R}/cicada/seed-{s}.png'); x = allc[s]
    art['cicadas'].append({'seed': s, 'rank': x[1], 'tier': x[2], 'bark': x[3], 'color': x[4], 'family': x[5], 'uri': webp(sq(im, (160, 120, 440, 400)), 224, 82, f'cicada-seed-{s}')})
# Cicada calls: nine seeds' signature calls (renderSignatureCall, 6.5 s, the seed is fingerprinted into the sound) as MP3, plus a 72-bin envelope.
CALLS = [1639, 1854, 3188, 2654, 443, 597, 151, 682, 1753]
for s in CALLS:
    pcm = open(f'{R}/cicada/seed-{s}.pcm', 'rb').read(); n = len(pcm) // 2; a = struct.unpack(f'<{n}h', pcm)
    bins = 72; env = []
    for k in range(bins):
        seg = a[k * n // bins:(k + 1) * n // bins]; env.append(round(math.sqrt(sum(v * v for v in seg[::7]) / max(1, len(seg[::7]))) / 32768, 3))
    pk = max(env) or 1; env = [round(v / pk, 3) for v in env]
    mp3 = subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-f', 's16le', '-ar', '44100', '-ac', '1', '-i', 'pipe:0', '-ar', '32000', '-b:a', '40k', '-f', 'mp3', 'pipe:1'], input=pcm, capture_output=True, check=True).stdout
    open(f'{OUT}/images/cicada-call-seed-{s}.mp3', 'wb').write(mp3); x = allc[s]
    art['calls'].append({'seed': s, 'tier': x[2], 'family': x[5], 'seconds': round(n / 44100, 2), 'env': env, 'uri': 'data:audio/mpeg;base64,' + base64.b64encode(mp3).decode()})
# Astro Blaster 3 (#3074): its title screen and attract-mode frames from the game canvas.
t = Image.open(f'{R}/astro-cdp.png'); art['astro'].append({'frame': 'title', 'uri': webp(sq(t, (270, 110, 690, 530)), 224, 84, 'astro-blaster-3-title')})
for k in range(8): art['astro'].append({'frame': f'attract-{k}', 'uri': webp(sq(Image.open(f'{R}/astro-cv-{k}.png'), (320, 300, 640, 620)), 224, 84, f'astro-blaster-3-attract-{k}')})
# Layers: real inscription IDs held by xtrata.btc and jim.btc, with mime type, size and the block of the holding transfer; image layers carry a thumbnail.
for x in json.load(open(f'{R}/layers-pick.json')):
    rec = {'id': x['id'], 'wallet': x['wallet'], 'mime': x.get('mime'), 'bytes': x.get('bytes'), 'block': x.get('block'), 'tx': x.get('tx')}
    for ext in ('png', 'jpg', 'webp'):
        p = f"{R}/layers/{x['id']}.{ext}"
        if os.path.exists(p): rec['thumb'] = webp(Image.open(p), 160, 80, f"layer-{x['id']}")
    p = f"{R}/layers/{x['id']}.svg"
    if os.path.exists(p): rec['thumb'] = 'data:image/svg+xml;base64,' + base64.b64encode(open(p, 'rb').read()).decode()
    art['layers'].append(rec)
# Logos and Xtrata assets, as supplied.
ft = Image.open(os.path.join(ROOT, 'forever-twins', 'assets', 'forever-twins-logo.webp')).convert('RGB'); ft.thumbnail((360, 360))
b = io.BytesIO(); ft.save(b, 'WEBP', quality=86); open(f'{OUT}/images/forever-twins-logo.webp', 'wb').write(b.getvalue())
art['logos']['foreverTwins'] = 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
art['logos']['audionaut'] = 'data:image/svg+xml;base64,' + base64.b64encode(open(f'{R}/aud-lockup.svg', 'rb').read().replace(b'width="176" height="64" ', b'width="927" height="337" ').replace(b' class="lockup"', b' xmlns="http://www.w3.org/2000/svg"')).decode()
open(f'{OUT}/images/the-audionaut-lockup.svg', 'wb').write(open(f'{R}/aud-lockup.svg', 'rb').read())
# Session Mode beat: five CC0 hits from the Audionaut sample library's Analog Kit pack (audionaut-library/packs/analogkit.audpack),
# extracted with extract-analogkit.mjs (audpack-reader) and trimmed to MP3.
K = {'kick': ('analogkit-kicks-unruly-20in-unruly-20in-clean-hard', .6), 'snare': ('analogkit-snares-standard-14in-modern-a', .6), 'hat': ('analogkit-hi-hats-closed-rusty-tight', .35), 'open': ('analogkit-hi-hats-open-swirly-open', .9), 'rim': ('analogkit-rim-and-stick-jazz-cross-stick-hard', .4)}
art['kit'] = {}
for k, (f, d) in K.items():
    mp3 = subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', f'{R}/kit/{f}.flac', '-t', str(d), '-af', f'afade=t=out:st={d - .08}:d=0.08', '-ac', '1', '-ar', '32000', '-b:a', '48k', '-f', 'mp3', 'pipe:1'], capture_output=True, check=True).stdout
    open(f'{OUT}/images/kit-{k}.mp3', 'wb').write(mp3); art['kit'][k] = {'id': f + '@hit@1', 'uri': 'data:audio/mpeg;base64,' + base64.b64encode(mp3).decode(), 'bytes': len(mp3)}
json.dump(art, open(f'{OUT}/xo-art.json', 'w'), separators=(',', ':'))
print({k: (len(v) if isinstance(v, list) else list(v)) for k, v in art.items() if k != 'generated'}, os.path.getsize(f'{OUT}/xo-art.json'))
