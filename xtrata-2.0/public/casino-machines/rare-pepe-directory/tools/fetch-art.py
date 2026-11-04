#!/usr/bin/env python3
"""Downloads card pictures into art/cards for the Rare Pepe Directory machine. Run it on a computer that can reach the internet:

    python3 tools/fetch-art.py                 # the default selection (all of Series 1, five cards of every other series, 60 Fake Rares spread through the list)
    python3 tools/fetch-art.py --names RAREPEPE,GOXPEPE,PEPECASH
    python3 tools/fetch-art.py --all-rare      # every Rare Pepe in art/data/rare-pepe-assets.txt (large!)
    python3 tools/fetch-art.py --dry-run       # only print what it would fetch

For each asset it asks the public Counterparty explorers for the asset's description. For these cards the description is normally
the picture's URL (or a link to a small .json that holds it); it then downloads that picture, checks it really is an image,
shrinks it to at most 480 px on the long side (needs Pillow: pip install pillow, otherwise the original is kept), and saves it as
art/cards/<ASSETNAME>.<ext>. A row per picture goes into art/cards-sources.csv, anything it could not get into art/cards-missing.txt.
Existing files are never overwritten. Standard library only, plus optional Pillow. It waits between requests so it is gentle on the hosts.

The artists own their pictures; every row is recorded as permission "unconfirmed". Get their OK before a public launch.
When it finishes:  python3 tools/make-art.py && node tools/build.mjs
"""
import argparse, csv, io, json, os, re, sys, time, urllib.request, urllib.error, datetime

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
CARDS = os.path.join(ROOT, 'art', 'cards')
UA = {'User-Agent': 'Mozilla/5.0 (rare-pepe-directory art fetch; contact: jim)'}
# Asset description endpoints, tried in order. Each returns JSON with a "description" field (or similar).
DESC = [
    'https://tokenscan.io/api/asset/{n}',
    'https://xchain.io/api/asset/{n}',
    'https://api.counterparty.io:4000/v2/assets/{n}',
    'https://api.xcp.io/api/v1/asset/{n}',
]
SIG = [(b'\xff\xd8\xff', 'jpg'), (b'\x89PNG\r\n\x1a\n', 'png'), (b'GIF87a', 'gif'), (b'GIF89a', 'gif')]

def get(url, timeout=30, binary=False):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        data = r.read(12_000_000)
    return data if binary else data.decode('utf-8', 'replace')

def kind(data):
    for sig, ext in SIG:
        if data.startswith(sig): return ext
    if data[:4] == b'RIFF' and data[8:12] == b'WEBP': return 'webp'
    return None

def find_urls(text):
    return re.findall(r'https?://[^\s"\'<>]+', text or '')

def json_image(obj):
    """The image link inside a token-metadata .json (several spellings are in use)."""
    if isinstance(obj, dict):
        for k in ('image', 'image_url', 'imageUrl', 'img', 'picture', 'url'):
            v = obj.get(k)
            if isinstance(v, str) and v.startswith(('http', 'ipfs://')): return v
        for v in obj.values():
            r = json_image(v)
            if r: return r
    return None

def fix(url):
    if url.startswith('ipfs://'): url = 'https://ipfs.io/ipfs/' + url[7:].lstrip('/')
    return url

def description(name):
    for tpl in DESC:
        try:
            j = json.loads(get(tpl.format(n=name), 20))
        except Exception:
            continue
        stack = [j]
        while stack:
            o = stack.pop()
            if isinstance(o, dict):
                for k, v in o.items():
                    if k in ('description', 'asset_description') and isinstance(v, str) and v.strip(): return v.strip()
                    stack.append(v)
            elif isinstance(o, list): stack.extend(o)
    return None

def picture(name):
    """(bytes, ext, source_url) for an asset, or (None, None, reason)."""
    d = description(name)
    if not d: return None, None, 'no asset description from any explorer'
    urls = find_urls(d) or ([d] if d.startswith('ipfs://') else [])
    if not urls: return None, None, f'description is not a link: {d[:60]!r}'
    url = fix(urls[0])
    try:
        data = get(url, 40, True)
        if kind(data) is None:  # maybe a .json pointing to the picture
            try:
                img = json_image(json.loads(data.decode('utf-8', 'replace')))
            except Exception:
                img = None
            if not img: return None, None, f'{url} is not an image'
            url = fix(img); data = get(url, 40, True)
        ext = kind(data)
        return (data, ext, url) if ext else (None, None, f'{url} is not an image')
    except (urllib.error.URLError, TimeoutError, OSError) as e:
        return None, None, f'{url}: {e}'

def shrink(data, ext, limit=480):
    try:
        from PIL import Image
    except ImportError:
        return data, ext
    im = Image.open(io.BytesIO(data))
    if ext == 'gif' and getattr(im, 'n_frames', 1) > 1 and len(data) < 400_000: return data, ext  # small animated GIFs stay animated
    if max(im.size) <= limit and len(data) < 120_000: return data, ext
    im.seek(0); im = im.convert('RGBA' if ext in ('png', 'gif', 'webp') else 'RGB')
    im.thumbnail((limit, limit))
    out = io.BytesIO()
    if ext == 'jpg': im.save(out, 'JPEG', quality=86, optimize=True)
    else: im.save(out, 'PNG', optimize=True); ext = 'png'
    return out.getvalue(), ext

def selection(args):
    rare = [l.strip() for l in open(os.path.join(ROOT, 'art/data/rare-pepe-assets.txt')) if l.strip()]
    fake = [l.strip() for l in open(os.path.join(ROOT, 'art/data/fake-rares-assets.txt')) if l.strip()]
    meta = {n: ('rare', i // 50 + 1, i % 50 + 1) for i, n in enumerate(rare)}
    meta.update({n: ('fake', 0, 0) for n in fake if n not in meta})
    if args.names: return [n.upper() for n in args.names.split(',') if n.strip()], meta
    if args.all_rare: return rare, meta
    pick = rare[:50]
    for s in range(1, 36):
        base = s * 50
        cards = [5, 15, 25, 35, 45] if s < 35 else [5, 10, 15, 20, 24]
        pick += [rare[base + c - 1] for c in cards if base + c - 1 < len(rare)]
    step = max(1, len(fake) // 60); pick += fake[::step][:60]  # an even spread through the Fake Rares list
    return pick, meta

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--names'); ap.add_argument('--all-rare', action='store_true')
    ap.add_argument('--dry-run', action='store_true'); ap.add_argument('--delay', type=float, default=0.6)
    args = ap.parse_args(); os.makedirs(CARDS, exist_ok=True)
    names, meta = selection(args); have = {os.path.splitext(f)[0] for f in os.listdir(CARDS)}
    todo = [n for n in dict.fromkeys(names) if n not in have]
    print(f'{len(names)} wanted, {len(names) - len(todo)} already in art/cards, {len(todo)} to fetch')
    if args.dry_run: print(' '.join(todo)); return
    src_path, miss_path = os.path.join(ROOT, 'art/cards-sources.csv'), os.path.join(ROOT, 'art/cards-missing.txt')
    new = not os.path.exists(src_path)
    ok = bad = 0
    with open(src_path, 'a', newline='') as sf, open(miss_path, 'a') as mf:
        w = csv.writer(sf)
        if new: w.writerow(['asset', 'collection', 'series', 'card', 'file', 'source_url', 'artist_if_known', 'retrieved_date', 'permission'])
        for k, n in enumerate(todo, 1):
            data, ext, info = picture(n)
            if not data:
                bad += 1; mf.write(f'{n}: {info}\n'); mf.flush(); print(f'[{k}/{len(todo)}] {n}: MISSING ({info})')
            else:
                data, ext = shrink(data, ext); fn = f'{n}.{ext}'
                open(os.path.join(CARDS, fn), 'wb').write(data)
                c, s, cd = meta.get(n, ('?', 0, 0))
                w.writerow([n, c, s, cd, f'art/cards/{fn}', info, '', datetime.date.today().isoformat(), 'unconfirmed']); sf.flush()
                ok += 1; print(f'[{k}/{len(todo)}] {n}: {fn} ({len(data) // 1024} KB)')
            time.sleep(args.delay)
    print(f'done: {ok} saved, {bad} missing. Next: python3 tools/make-art.py && node tools/build.mjs')

if __name__ == '__main__':
    main()
