#!/usr/bin/env python3
"""Bundle Chemical X's works so the Club X reels show real art offline.

Run this on a computer that can reach api.hiro.so and an IPFS gateway (the build sandbox cannot):
    python3 tools/club-x/fetch_art.py          # reads art/works.json, writes art/bundle.json and art/bundled/*
    python3 tools/club-x/build.py              # embeds the bundle in the game

For each token it reads the metadata (Hiro metadata API get-token-uri), downloads the token's own image through an IPFS gateway, scales it
to at most 480 px (Pillow, if installed) and stores it as a small data URI with its source. Nothing is redrawn or altered beyond scaling.
A token that cannot be fetched is listed at the end and is simply left out (the game then loads it live, or shows a name tile).
"""
import json, os, sys, base64, io, urllib.request, urllib.error
HERE = os.path.dirname(os.path.abspath(__file__))
works = json.load(open(os.path.join(HERE, 'art', 'works.json'), encoding='utf-8'))
GATEWAYS = ['https://ipfs.io/ipfs/', 'https://cloudflare-ipfs.com/ipfs/', 'https://dweb.link/ipfs/']
try: from PIL import Image
except Exception: Image = None
def get(url, binary=False):
    req = urllib.request.Request(url, headers={'User-Agent': 'club-x-fetch-art/1.0'})
    with urllib.request.urlopen(req, timeout=40) as r: b = r.read(); return b if binary else json.loads(b)
def candidates(u):
    if not u: return []
    if u.startswith('ipfs://'): p = u[7:]; p = p[5:] if p.startswith('ipfs/') else p; return [g + p for g in GATEWAYS]
    return [u]
bundle, failed = {}, []
os.makedirs(os.path.join(HERE, 'art', 'bundled'), exist_ok=True)
for w in works['works']:
    if not w.get('contract'): print('skip', w['key'], '(no contract yet)'); continue
    for tid in w['ids']:
        key = f"{w['key']}:{tid}"
        try:
            meta = get(f"https://api.hiro.so/metadata/v1/nft/{w['contract']}/{tid}"); m = meta['metadata']
            data = None; used = None
            for u in candidates(m.get('cached_image')) + candidates(m.get('image')):
                try: data = get(u, True); used = u; break
                except Exception as e: print('  gateway failed', u, e)
            if data is None: raise RuntimeError('no image reachable')
            mime = 'image/png'
            if Image:
                im = Image.open(io.BytesIO(data)); im.thumbnail((480, 480)); out = io.BytesIO()
                if im.mode in ('RGBA', 'LA', 'P'): im.convert('RGBA').save(out, 'PNG', optimize=True)
                else: im.convert('RGB').save(out, 'JPEG', quality=88); mime = 'image/jpeg'
                data = out.getvalue()
            open(os.path.join(HERE, 'art', 'bundled', f"{w['key']}-{tid}.{'jpg' if mime.endswith('jpeg') else 'png'}"), 'wb').write(data)
            bundle[key] = {'name': m.get('name', ''), 'data': f'data:{mime};base64,' + base64.b64encode(data).decode(), 'source': used,
                           'metadata': f"https://api.hiro.so/metadata/v1/nft/{w['contract']}/{tid}", 'tokenUri': meta.get('token_uri')}
            print('ok  ', key, m.get('name', ''), len(data), 'bytes')
        except Exception as e:
            failed.append((key, str(e))); print('FAIL', key, e)
json.dump(bundle, open(os.path.join(HERE, 'art', 'bundle.json'), 'w', encoding='utf-8'), separators=(',', ':'), ensure_ascii=False)
print(f'\n{len(bundle)} bundled, {len(failed)} failed', failed if failed else '')
if not Image: print('note: Pillow is not installed, so the images were bundled at full size (pip install pillow to scale them)')
sys.exit(1 if failed else 0)
