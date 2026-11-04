#!/usr/bin/env python3
"""Reads the Forever Twins record for Megapont Ape Club from xtrata.xyz (twin metadata for all 2,500 tokens) and writes
art/apes-index.json: for each token its Xtrata inscription id when the twin exists. Then downloads a seeded bundle of
twin images (full colour) into art/apes/. Needs only https://xtrata.xyz.
  python3 tools/fetch-apes.py [bundle=96]"""
import json, sys, os, random, urllib.request, concurrent.futures as cf
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGIN = 'https://xtrata.xyz'
CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X/xtrata-v3-2-3'
BUNDLE = int(sys.argv[1]) if len(sys.argv) > 1 else 96
def get(url, binary=False, tries=4):
    for k in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'curl/8'}), timeout=40) as r:
                b = r.read(); return b if binary else json.loads(b)
        except Exception as e:
            last = e
    raise last
def one(i):
    try:
        j = get(f'{ORIGIN}/ft/megapont-ape-club/{i}.json')
        t = (j.get('properties') or {}).get('twin') or {}
        return i, int(t['xtrata_id']) if t.get('xtrata_id') else 0, (j.get('properties') or {}).get('status', '')
    except Exception as e:
        return i, -1, str(e)[:40]
out = os.path.join(HERE, 'art/apes-index.json')
if os.path.exists(out): idx = json.load(open(out))
else:
    with cf.ThreadPoolExecutor(14) as ex: rows = list(ex.map(one, range(1, 2501)))
    idx = {'collection': 'megapont-ape-club', 'core': CORE.replace('/', '.'), 'source': ORIGIN + '/ft/megapont-ape-club/{id}.json', 'tokens': {str(i): [x, s] for i, x, s in rows}}
    json.dump(idx, open(out, 'w'))
tk = idx['tokens']; ok = [int(i) for i, v in tk.items() if v[0] > 0]; bad = [i for i, v in tk.items() if v[0] < 0]
print('twins with an Xtrata id:', len(ok), '· not inscribed:', sum(1 for v in tk.values() if v[0] == 0), '· read errors:', len(bad))
rnd = random.Random(20261101); pick = sorted(rnd.sample(ok, min(BUNDLE, len(ok))))
def img(i):
    f = os.path.join(HERE, f'art/apes/{i}.png')
    if os.path.exists(f) and os.path.getsize(f) > 200: return i, True
    try:
        open(f, 'wb').write(get(f'{ORIGIN}/inscription/mainnet/{CORE}/{tk[str(i)][0]}', True)); return i, True
    except Exception as e: return i, False
with cf.ThreadPoolExecutor(10) as ex: res = list(ex.map(img, pick))
print('bundled images:', sum(1 for _, k in res if k), 'of', len(pick))
json.dump({'bundled': [i for i, k in res if k]}, open(os.path.join(HERE, 'art/apes-bundle.json'), 'w'))
