#!/usr/bin/env python3
"""Fetches the Megapont art Robot Factory needs, on a computer that can reach api.megapont.com and an IPFS gateway.

    python3 tools/fetch-art.py              # default selection (see below)
    python3 tools/fetch-art.py --per 36     # NFTs per group instead of 24
    python3 tools/fetch-art.py --dry-run

What it does (standard library only; Pillow optional for shrinking):
  1. Apes: reads the metadata of all 2,500 Megapont Ape Club tokens from IPFS (cached in art/data/ape-meta/), scores each by trait rarity
     (sum of 1 / how-many-apes-share-that-trait, summed over every trait) and writes art/tiers.json:  rarest 2% = "G" (gold frame), the
     rest cut into three equal tiers by score: "I" (rarest third, red frame), "II" (blue), "III" (purple).
     Then downloads a spread of ape pictures per tier into art/img/apes/<id>.<ext> (the six on-chain twins are already in art/apes/).
  2. Robots, Robot Components, Space Agency NFTs: reads each token's metadata from api.megapont.com and downloads the picture into
     art/img/robots, art/img/components, art/img/msa.
  3. The Megapont logo (skipped when art/logos/megapont.* already exists, as it does now): tries megapont.com for its social/logo image and saves art/logos/megapont.<ext> (or tell it with --logo URL).
Then:   python3 tools/make-art.py && node tools/build.mjs
Existing files are never overwritten, so it is safe to re-run. Every picture is recorded in art/fetch-log.csv with its source URL.
The artists own their pictures: everything here is recorded as permission "unconfirmed". Get the OK before a public launch."""
import argparse, concurrent.futures as cf, csv, io, json, os, random, re, sys, time, urllib.request

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
A = lambda *p: os.path.join(ROOT, 'art', *p)
UA = {'User-Agent': 'Mozilla/5.0 (robot-factory art fetch)'}
GATEWAYS = ['https://ipfs.io/ipfs/', 'https://cloudflare-ipfs.com/ipfs/', 'https://gateway.pinata.cloud/ipfs/', 'https://dweb.link/ipfs/', 'https://nftstorage.link/ipfs/']
APE_CID = 'QmRhkJToXrJYhAGBNP6NLNUTTrXSmuNAF2fH2JKphaJPLx'
GROUPS = {  # folder: (token count at build time, metadata URL, symbol)
    'robots': (1865, ['https://api.megapont.com/robots/{id}']),
    'components': (59325, ['https://api.megapont.com/components/{id}']),
    'msa': (7500, ['https://api.megapont.com/metadata/msa/{id}', 'https://megapont-api-kh0d.onrender.com/metadata/msa/{id}'])}
SIG = [(b'\xff\xd8\xff', 'jpg'), (b'\x89PNG\r\n\x1a\n', 'png'), (b'GIF87a', 'gif'), (b'GIF89a', 'gif'), (b'RIFF', 'webp')]
LOG = []

def fetch(url, binary=False, tries=3, timeout=40):
    last = None
    for k in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout) as r:
                b = r.read(15_000_000)
            return b if binary else b.decode('utf-8', 'replace')
        except Exception as e:
            last = e; time.sleep(0.5 + k)
    raise last

def ipfs_urls(u):
    if u.startswith('ipfs://'): return [g + u[7:].lstrip('/') for g in GATEWAYS]
    m = re.search(r'/ipfs/(.+)$', u)
    return [u] + ([g + m.group(1) for g in GATEWAYS] if m else [])

def fetch_any(urls, binary=False):
    last = None
    for u in urls:
        try: return fetch(u, binary, tries=2), u
        except Exception as e: last = e
    raise last

def kind(data):
    for sig, ext in SIG:
        if data.startswith(sig): return ext
    return None

def image_url(meta):
    for k in ('image', 'image_url', 'imageUrl', 'img', 'picture'):
        v = meta.get(k) if isinstance(meta, dict) else None
        if isinstance(v, str) and v: return v
    return None

def traits(meta):
    t = meta.get('attributes') or meta.get('traits') or meta.get('properties') or []
    out = []
    if isinstance(t, list):
        for a in t:
            if isinstance(a, dict):
                k = a.get('trait_type') or a.get('type') or a.get('name') or ''
                v = a.get('value')
                out.append((str(k), str(v)))
    elif isinstance(t, dict):
        out = [(str(k), str(v)) for k, v in t.items()]
    return out

def save_image(data, folder, name, source, shrink=480):
    ext = kind(data)
    if not ext: raise ValueError('not an image')
    os.makedirs(folder, exist_ok=True)
    path = os.path.join(folder, f'{name}.{ext}')
    try:
        from PIL import Image
        im = Image.open(io.BytesIO(data))
        if max(im.size) > shrink and ext != 'gif':
            im.seek(0); im = im.convert('RGBA'); im.thumbnail((shrink, shrink)); ext = 'png'
            path = os.path.join(folder, f'{name}.png'); im.save(path, 'PNG', optimize=True); data = None
    except ImportError:
        pass
    if data is not None: open(path, 'wb').write(data)
    LOG.append((os.path.relpath(path, ROOT), source, 'unconfirmed'))
    return path

def have(folder, name):
    return any(os.path.exists(os.path.join(folder, f'{name}.{e}')) for e in ('png', 'jpg', 'gif', 'webp'))

def ape_meta(i):
    p = A('data', 'ape-meta', f'{i}.json')
    if os.path.exists(p):
        try: return i, json.load(open(p))
        except Exception: pass
    try:
        txt, _ = fetch_any(ipfs_urls(f'ipfs://{APE_CID}/{i}'))
        m = json.loads(txt); os.makedirs(os.path.dirname(p), exist_ok=True); json.dump(m, open(p, 'w')); return i, m
    except Exception as e:
        return i, None

def do_apes(per, dry):
    print('Apes: reading metadata for 2,500 tokens (cached after the first run)…')
    if dry: return
    with cf.ThreadPoolExecutor(12) as ex: metas = dict(ex.map(ape_meta, range(1, 2501)))
    ok = {i: m for i, m in metas.items() if m}
    print(f'  metadata read for {len(ok)} of 2500')
    if len(ok) < 2000: print('  too few to rank fairly: tiers.json NOT written (check the connection and re-run)'); return
    freq = {}
    for m in ok.values():
        for t in set(traits(m)): freq[t] = freq.get(t, 0) + 1
    score = {i: sum(1.0 / freq[t] for t in set(traits(m))) for i, m in ok.items()}
    order = sorted(score, key=lambda i: (-score[i], i)); n = len(order)
    gold = max(1, round(n * 0.02)); rest = order[gold:]; third = len(rest) / 3
    tiers = {}
    for k, i in enumerate(order):
        tiers[i] = 'G' if k < gold else ('I' if k - gold < third else 'II' if k - gold < 2 * third else 'III')
    json.dump({str(i): t for i, t in tiers.items()}, open(A('tiers.json'), 'w'), separators=(',', ':'))
    cnt = {t: sum(1 for v in tiers.values() if v == t) for t in ('G', 'I', 'II', 'III')}
    print('  tiers written:', cnt)
    rnd = random.Random(20261101)
    pick = {t: rnd.sample([i for i in tiers if tiers[i] == t], min(per if t != 'G' else max(6, per // 2), cnt[t])) for t in cnt}
    jobs = [i for t in pick for i in pick[t]]
    def get_img(i):
        folder = A('img', 'apes')
        if have(folder, i): return i, True
        try:
            u = image_url(ok[i]); data, src = fetch_any(ipfs_urls(u), True); save_image(data, folder, str(i), src); return i, True
        except Exception as e: return i, False
    with cf.ThreadPoolExecutor(8) as ex: res = list(ex.map(get_img, jobs))
    print(f'  ape pictures: {sum(1 for _, k in res if k)} of {len(jobs)}')

def do_group(name, per, dry):
    count, url = GROUPS[name]
    rnd = random.Random(20261101 + len(name)); ids = sorted(rnd.sample(range(1, count + 1), per))
    print(f'{name}: fetching {per} of {count}')
    if dry: return
    folder = A('img', name)
    def one(i):
        if have(folder, i): return i, True
        try:
            txt, murl = fetch_any([u.format(id=i) for u in url]); meta = json.loads(txt); iu = image_url(meta)
            data, src = fetch_any(ipfs_urls(iu), True); save_image(data, folder, str(i), src); return i, True
        except Exception as e: return i, False
    with cf.ThreadPoolExecutor(6) as ex: res = list(ex.map(one, ids))
    print(f'  {name}: {sum(1 for _, k in res if k)} of {len(ids)} downloaded')

def do_logo(url, dry):
    print('Megapont logo…')
    if dry: return
    folder = A('logos')
    if have(folder, 'megapont'): print('  already present'); return
    cands = [url] if url else []
    if not url:
        for page in ('https://www.megapont.com', 'https://megapont.com'):
            try:
                html = fetch(page, tries=2)
                for pat in (r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)', r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image', r'<link[^>]+rel=["\'](?:apple-touch-icon|icon)["\'][^>]+href=["\']([^"\']+)'):
                    for m in re.findall(pat, html):
                        cands.append(urllib.request.urljoin(page, m))
                if cands: break
            except Exception: pass
    for u in cands:
        try:
            data = fetch(u, True); save_image(data, folder, 'megapont', u, shrink=512); print('  saved from', u); return
        except Exception: continue
    print('  could not get the logo automatically: save one as art/logos/megapont.png (or run with --logo URL)')

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('--per', type=int, default=24); ap.add_argument('--dry-run', action='store_true'); ap.add_argument('--logo', default='')
    a = ap.parse_args()
    do_apes(a.per, a.dry_run)
    for g in GROUPS: do_group(g, a.per, a.dry_run)
    do_logo(a.logo, a.dry_run)
    if LOG:
        new = not os.path.exists(A('fetch-log.csv'))
        with open(A('fetch-log.csv'), 'a', newline='') as f:
            w = csv.writer(f)
            if new: w.writerow(['file', 'source', 'permission'])
            w.writerows(LOG)
    print('Done. Next: python3 tools/make-art.py && node tools/build.mjs')
