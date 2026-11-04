#!/usr/bin/env python3
"""Degen City art builder (re-runnable).

Fetches Miami Degens / NYC Degens art + logos, resizes to 192x192 WebP and emits:
  art/art.js          window.DC_ART = {twins:{miami,nyc}, logos:{...}}
  art/manifest.json   live twin counts + bundled token ids
  art/sources.json    where every bundled image came from, logo permissions
  art/logos-needing-permission.md

Raw downloads are kept untouched in art/src-cache/ (git-ignored scratch).
Usage:  python3 tools/build-art.py [--target 24] [--offline]

Original (non-forevered) art needs an IPFS gateway. If none is reachable from this
machine, drop files by hand into  art/src-cache/originals/<miami|nyc>/<tokenId>.(png|jpg|webp)
and re-run: they are picked up and recorded as "manual-drop" in sources.json.
Needs: Pillow with WebP support. Network: xtrata.xyz, raw.githubusercontent.com (+ an IPFS gateway).
"""
import base64, datetime, io, json, os, re, sys, time, urllib.request, urllib.error

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ART = os.path.normpath(os.path.join(HERE, '..', 'art'))
CACHE = os.path.join(ART, 'src-cache')
HIRO = 'https://xtrata.xyz/hiro/mainnet'
XTRATA_CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X/xtrata-v3-2-3'
INSCRIPTION = 'https://xtrata.xyz/inscription/mainnet/' + XTRATA_CORE + '/'
SIZE = 192
QUALITY = 80
UA = {'User-Agent': 'degen-city-art-build/1.0'}
GATEWAYS = ['ipfs.io', 'dweb.link', 'cloudflare-ipfs.com', 'w3s.link', 'nftstorage.link',
            'gateway.pinata.cloud', 'ipfs.filebase.io', 'stxnft.mypinata.cloud', 'gateway.ipfs.io', '4everland.io']

TARGET = 24
OFFLINE = False
for i, a in enumerate(sys.argv):
    if a == '--target': TARGET = int(sys.argv[i + 1])
    if a == '--offline': OFFLINE = True

CITIES = {
    'miami': dict(name='Miami Degens', key='miami-degens',
                  helper='SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.miami-degens-fakfun-xtrata',
                  source='SP1SCEXE6PMGPAC6B4N5P2MDKX8V4GF9QDE1FNNGJ.miami-degens'),
    'nyc': dict(name='NYC Degens', key='nyc-degens',
                helper='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.forever-twin-nyc-degens',
                source='SP1SCEXE6PMGPAC6B4N5P2MDKX8V4GF9QDE1FNNGJ.nyc-degens'),
}

LOGOS = {
    'mia': dict(name='MiamiCoin token icon',
                url='https://raw.githubusercontent.com/citycoins/cdn/main/cdn/logos/miamicoin.png',
                page='https://github.com/citycoins/cdn/blob/main/cdn/logos/miamicoin.png', size=128),
    'nyc': dict(name='NYCCoin token icon',
                url='https://raw.githubusercontent.com/citycoins/cdn/main/cdn/logos/newyorkcitycoin.png',
                page='https://github.com/citycoins/cdn/blob/main/cdn/logos/newyorkcitycoin.png', size=128),
    'citycoins': dict(name='CityCoins logo',
                      url='https://raw.githubusercontent.com/citycoins/cdn/main/cdn/logos/citycoin.png',
                      page='https://github.com/citycoins/cdn/blob/main/cdn/logos/citycoin.png', size=128),
    'miamiDegens': dict(name='Miami Degens collection logo',
                        url='https://xtrata.xyz/forever-twins/assets/miami-degens-forever-twin-logo.jpg',
                        page='https://xtrata.xyz/forever-twins/miami-degens/', size=SIZE),
    # nycDegens: no real file found anywhere reachable (registry theme.logo is null) -> omitted, listed in logosMissing
}


def log(*a):
    print(*a, file=sys.stderr)


def http(url, data=None, headers=None, timeout=30):
    h = dict(UA)
    h.update(headers or {})
    req = urllib.request.Request(url, data=data, headers=h)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read(), r.headers.get('Content-Type', '')


def cached(url, rel, **kw):
    """Download once into src-cache/rel; never overwrite an existing download."""
    path = os.path.join(CACHE, rel)
    if os.path.exists(path) and os.path.getsize(path) > 0:
        with open(path, 'rb') as f:
            return f.read()
    if OFFLINE:
        raise RuntimeError('offline and not cached: ' + rel)
    body, _ = http(url, **kw)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'wb') as f:
        f.write(body)
    return body


def hiro_json(path):
    return json.loads(http(HIRO + path)[0])


def call_read(addr_name, fn, args=None):
    addr, name = addr_name.split('.')
    body = json.dumps({'sender': addr, 'arguments': args or []}).encode()
    out, _ = http('%s/v2/contracts/call-read/%s/%s/%s' % (HIRO, addr, name, fn), data=body,
                  headers={'Content-Type': 'application/json'})
    return json.loads(out)


def clarity_uint(hexs):
    # (ok uN) = 0x07 01 <16 bytes>
    b = bytes.fromhex(hexs[2:])
    assert b[0] == 0x07 and b[1] == 0x01, hexs
    return int.from_bytes(b[2:18], 'big')


def helper_events(helper):
    """All print events of the helper contract, paged. Returns raw repr strings."""
    reprs, off = [], 0
    while True:
        d = hiro_json('/extended/v1/contract/%s/events?limit=50&offset=%d' % (helper, off))
        res = d.get('results', [])
        for r in res:
            v = (r.get('contract_log') or {}).get('value') or {}
            if v.get('repr'):
                reprs.append(v['repr'])
        off += len(res)
        if len(res) < 50:
            break
    return reprs


def parse_inscribed(reprs):
    """Events come newest first. Returns (inscribed_count_of_newest, {tokenId: xtrataId})."""
    twins, newest = {}, None
    for r in reprs:
        if '(event "inscribed")' not in r:
            continue
        tid = int(re.search(r'\(token-id u(\d+)\)', r).group(1))
        xid = int(re.search(r'\(xtrata-id u(\d+)\)', r).group(1))
        cnt = int(re.search(r'\(inscribed-count u(\d+)\)', r).group(1))
        if newest is None:
            newest = cnt
        twins.setdefault(tid, xid)
    return newest, twins


def to_tile(img, size, nearest_ok=True):
    """Fit into size x size keeping aspect, pad with transparency. Nearest for small pixel art, else Lanczos."""
    img = img.convert('RGBA')
    w, h = img.size
    pixel_art = nearest_ok and max(w, h) <= 128
    scale = size / max(w, h)
    nw, nh = max(1, round(w * scale)), max(1, round(h * scale))
    img = img.resize((nw, nh), Image.NEAREST if pixel_art else Image.LANCZOS)
    canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    canvas.paste(img, ((size - nw) // 2, (size - nh) // 2))
    return canvas, ('nearest' if pixel_art else 'lanczos')


def webp_uri(img):
    buf = io.BytesIO()
    img.save(buf, 'WEBP', quality=QUALITY, method=6)
    return 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode('ascii'), len(buf.getvalue())


def pick_spread(ids, n):
    if n <= 0 or not ids:
        return []
    if n >= len(ids):
        return list(ids)
    return [ids[round(i * (len(ids) - 1) / (n - 1))] if n > 1 else ids[0] for i in range(n)]


def find_gateway(probe_cid_path):
    """Return (gateway or None, probe log)."""
    tried = []
    for g in GATEWAYS:
        url = 'https://%s/ipfs/%s' % (g, probe_cid_path)
        try:
            body, _ = http(url, timeout=10)
            if body:
                tried.append({'gateway': g, 'ok': True})
                return g, tried
        except Exception as e:  # noqa
            tried.append({'gateway': g, 'ok': False, 'error': str(e)[:80]})
    return None, tried


def original_media_uri(city, token_id, nyc_manifest):
    """ipfs:// URI of the original art: NYC manifest first, then Hiro token metadata."""
    if city == 'nyc' and nyc_manifest and token_id in nyc_manifest:
        return nyc_manifest[token_id], 'ft-manifest'
    meta = hiro_json('/metadata/v1/nft/%s/%d' % (CITIES[city]['source'], token_id))
    uri = (meta.get('metadata') or {}).get('image')
    return uri, 'hiro-token-metadata'


def main():
    os.makedirs(CACHE, exist_ok=True)
    now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    art = {'twins': {}, 'logos': {}}
    manifest, sources = {}, {'generated': now, 'twins': {}, 'logos': {}, 'gatewayProbe': {}}

    nyc_manifest = {}
    try:
        mf = json.loads(cached('https://xtrata.xyz/ft/data/nyc-degens.manifest.json', 'nyc-degens.manifest.json'))
        for t in mf['tokens']:
            uris = (t.get('original') or {}).get('mediaUris') or []
            if uris:
                nyc_manifest[int(t['id'])] = uris[0]
        manifest_count = mf.get('count')
    except Exception as e:
        log('NYC manifest unavailable:', e)
        manifest_count = None

    for city, c in CITIES.items():
        log('==', c['name'])
        total = clarity_uint(call_read(c['source'], 'get-last-token-id')['result'])
        reprs = helper_events(c['helper'])
        with open(os.path.join(CACHE, 'events-%s.json' % city), 'w') as f:
            json.dump(reprs, f)
        inscribed_count, twins = parse_inscribed(reprs)
        log('  tokens (get-last-token-id):', total, ' twins:', twins, ' inscribed-count:', inscribed_count)
        mf = {'name': c['name'], 'helper': c['helper'], 'source': c['source'], 'tokenCount': total,
              'inscribedCount': inscribed_count if inscribed_count is not None else 0,
              'twinned': [{'tokenId': t, 'xtrataId': x} for t, x in sorted(twins.items())],
              'bundled': [], 'eventsRead': len(reprs)}
        if city == 'nyc':
            mf['manifestCount'] = manifest_count

        out, srcs = [], []
        # 1. every forevered twin (up to TARGET), art from the Xtrata inscription (png)
        for tid, xid in sorted(twins.items())[:TARGET]:
            url = INSCRIPTION + str(xid)
            raw = cached(url, 'twins/%s-%d-xtrata-%d.png' % (city, tid, xid))
            tile, how = to_tile(Image.open(io.BytesIO(raw)), SIZE)
            uri, nbytes = webp_uri(tile)
            out.append({'tokenId': tid, 'xtrataId': str(xid), 'forever': True, 'src': uri, 'source': url})
            srcs.append({'city': city, 'tokenId': tid, 'xtrataId': xid, 'forever': True, 'source': url,
                         'obtained': 'HTTP GET from xtrata.xyz inscription endpoint (image/png), resized %s, WebP q%d' % (how, QUALITY),
                         'status': 'ok', 'webpBytes': nbytes})

        # 2. fill with unforevered originals, spread across the token range
        want = TARGET - len(out)
        ids = [i for i in range(1, total + 1) if i not in twins]
        picks = pick_spread(ids, want)
        gateway, probe = None, []
        if not OFFLINE and picks:
            # probe with the first pick's real media CID
            try:
                uri0, _ = original_media_uri(city, picks[0], nyc_manifest)
                gateway, probe = find_gateway(uri0[len('ipfs://'):])
            except Exception as e:
                probe = [{'error': str(e)[:120]}]
        sources['gatewayProbe'][city] = {'working': gateway, 'tried': probe}
        unfetched = []
        for tid in picks:
            data, origin, url = None, None, None
            # manual drop-in first
            for ext in ('png', 'jpg', 'jpeg', 'webp'):
                p = os.path.join(CACHE, 'originals', city, '%d.%s' % (tid, ext))
                if os.path.exists(p):
                    data, origin, url = open(p, 'rb').read(), 'manual-drop', p
                    break
            uri_ipfs = None
            if data is None and not OFFLINE:
                try:
                    uri_ipfs, via = original_media_uri(city, tid, nyc_manifest)
                except Exception as e:
                    unfetched.append({'tokenId': tid, 'reason': 'metadata lookup failed: ' + str(e)[:100]})
                    continue
                if gateway and uri_ipfs:
                    url = 'https://%s/ipfs/%s' % (gateway, uri_ipfs[len('ipfs://'):])
                    ext = os.path.splitext(uri_ipfs)[1] or '.png'
                    try:
                        data = cached(url, 'originals/%s/%d%s' % (city, tid, ext))
                        origin = 'IPFS gateway ' + gateway + ' (' + via + ')'
                    except Exception as e:
                        unfetched.append({'tokenId': tid, 'ipfs': uri_ipfs, 'reason': str(e)[:100]})
                        continue
                else:
                    unfetched.append({'tokenId': tid, 'ipfs': uri_ipfs, 'reason': 'no reachable IPFS gateway from this machine'})
                    continue
            if data is None:
                unfetched.append({'tokenId': tid, 'reason': 'offline and no manual drop-in'})
                continue
            tile, how = to_tile(Image.open(io.BytesIO(data)), SIZE)
            uri, nbytes = webp_uri(tile)
            out.append({'tokenId': tid, 'xtrataId': None, 'forever': False, 'src': uri, 'source': url})
            srcs.append({'city': city, 'tokenId': tid, 'xtrataId': None, 'forever': False, 'source': url,
                         'ipfs': uri_ipfs, 'obtained': origin + ', resized %s, WebP q%d' % (how, QUALITY),
                         'status': 'ok', 'webpBytes': nbytes})
        out.sort(key=lambda e: e['tokenId'])
        art['twins'][city] = out
        mf['bundled'] = [e['tokenId'] for e in out]
        mf['bundledForever'] = sum(1 for e in out if e['forever'])
        mf['bundledUnforevered'] = sum(1 for e in out if not e['forever'])
        mf['unfetched'] = unfetched
        manifest[city] = mf
        sources['twins'][city] = {'bundled': srcs, 'unfetched': unfetched}

    # logos
    for k, L in LOGOS.items():
        try:
            ext = os.path.splitext(L['url'])[1]
            raw = cached(L['url'], 'logos/%s%s' % (k, ext))
            tile, how = to_tile(Image.open(io.BytesIO(raw)), L['size'], nearest_ok=False)
            uri, nbytes = webp_uri(tile)
            art['logos'][k] = uri
            sources['logos'][k] = {'name': L['name'], 'source': L['url'], 'page': L['page'],
                                   'status': 'ok', 'webpBytes': nbytes, 'px': L['size']}
        except Exception as e:
            sources['logos'][k] = {'name': L['name'], 'source': L['url'], 'status': 'failed: ' + str(e)[:100]}

    missing = [{'key': 'nycDegens', 'name': 'NYC Degens collection logo',
                'searched': ['registry.v2.json community "nyc-dgens" (links: [], no logo)',
                             'registry collection "nyc-degens" theme.logo = null',
                             'xtrata.xyz/forever-twins/community/nyc-dgens and /collection/nyc-degens (no logo asset)',
                             'xtrata.xyz/ft/nyc-degens/<id>.json and the manifest (twin art only)',
                             'X/Twitter, Gamma and other hosts are blocked from the build machine'],
                'howToFix': 'Drop the official file at art/src-cache/logos/nycDegens.png (or .jpg) and set its URL in LOGOS, or ask the NYC Degens team for it.'}]
    for k, v in sources['logos'].items():
        if not v['status'] == 'ok':
            missing.append({'key': k, 'name': v['name'], 'reason': v['status']})
    sources['logosMissing'] = missing

    perm = [
        dict(key='mia', name='MiamiCoin token icon', source=LOGOS['mia']['url'], owner='CityCoins (MiamiCoin / CityCoins DAO)',
             why='Third-party brand mark. The citycoins/cdn repo has no licence file, so reuse rights are not stated.',
             ask='CityCoins team via citycoins.co or the CityCoins Discord / GitHub org (github.com/citycoins).'),
        dict(key='nyc', name='NYCCoin token icon', source=LOGOS['nyc']['url'], owner='CityCoins (NewYorkCityCoin / CityCoins DAO)',
             why='Third-party brand mark. The citycoins/cdn repo has no licence file, so reuse rights are not stated.',
             ask='CityCoins team via citycoins.co or the CityCoins Discord / GitHub org (github.com/citycoins).'),
        dict(key='citycoins', name='CityCoins logo', source=LOGOS['citycoins']['url'], owner='CityCoins',
             why='Third-party brand mark. No licence file in the source repo.',
             ask='CityCoins team via citycoins.co or the CityCoins Discord / GitHub org (github.com/citycoins).'),
        dict(key='miamiDegens', name='Miami Degens collection logo', source=LOGOS['miamiDegens']['url'],
             owner='Miami Degens artist / Fak.fun (collection creators); hosted by the Xtrata Forever Twins site',
             why='Collection artwork made by another project. Hosting it on xtrata.xyz does not by itself grant reuse in a game.',
             ask='Fak.fun / the Miami Degens artist.'),
        dict(key='nycDegens', name='NYC Degens collection logo', source=None, owner='NYC Degens team / community (NYC DGENs)',
             why='Not found. Whatever file is used will be another project\'s artwork, so permission is needed too.',
             ask='NYC Degens team / community admins.'),
    ]
    sources['logosNeedingPermission'] = perm
    sources['note'] = ('Twin art is the holders\' collection artwork (Miami Degens / NYC Degens); it is shown in-game as the collection '
                       'display, with unforevered tokens desaturated and stamped NOT YET FOREVER.')

    # write outputs
    js = 'window.DC_ART = ' + json.dumps(art, ensure_ascii=True, separators=(',', ':')) + ';\n'
    with open(os.path.join(ART, 'art.js'), 'w') as f:
        f.write('// Generated by tools/build-art.py on %s. Do not edit by hand.\n' % now)
        f.write(js)
    for name, obj in (('manifest.json', manifest), ('sources.json', sources)):
        with open(os.path.join(ART, name), 'w') as f:
            json.dump(obj, f, indent=2, ensure_ascii=True)
            f.write('\n')
    md = ['# Logos needing permission', '',
          'Generated by tools/build-art.py. None of these were drawn or altered by hand; each is a real file from the source named.', '']
    for p in perm:
        md.append('- **%s** (`%s`): %s Ask: %s Source: %s' % (p['name'], p['key'], p['why'], p['ask'], p['source'] or 'not found'))
    md += ['', '## Missing', '']
    for m in missing:
        md.append('- `%s` %s: %s' % (m['key'], m['name'], m.get('howToFix') or m.get('reason')))
    with open(os.path.join(ART, 'logos-needing-permission.md'), 'w') as f:
        f.write('\n'.join(md) + '\n')
    # git-ignore scratch
    with open(os.path.join(ART, '.gitignore'), 'w') as f:
        f.write('src-cache/\n')

    size = os.path.getsize(os.path.join(ART, 'art.js'))
    for city in CITIES:
        m = manifest[city]
        log('%s: tokens=%s inscribed=%s bundled=%d (forever %d, unforevered %d) unfetched=%d' % (
            city, m['tokenCount'], m['inscribedCount'], len(m['bundled']), m['bundledForever'], m['bundledUnforevered'], len(m['unfetched'])))
    log('logos:', sorted(art['logos']), ' art.js bytes:', size)


if __name__ == '__main__':
    main()
