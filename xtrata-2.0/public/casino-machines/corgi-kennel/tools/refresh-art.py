#!/usr/bin/env python3
"""Refresh Corgi Kennel's public-source evidence and artwork without guessing.

Requires Python 3.10+ and Pillow. Run from anywhere:
  python3 tools/refresh-art.py                 # stage a dated refresh
  python3 tools/refresh-art.py --happy-count 18
  python3 tools/refresh-art.py --apply         # apply only already-reviewed art

Changed/new image bytes are staged for visual review, never automatically
substituted. After reviewing an exact image, explicitly accept its SHA-256:
  python3 tools/refresh-art.py --apply --approve CONTRACT=SHA256
Only the fixed exact reel contracts and previously reviewed pedigree contracts
are eligible. Search results are evidence, not a licence or an endorsement.
No wallet, signing key, funded account or transaction is used by this script.
"""

import argparse
import base64
import copy
import datetime as dt
import hashlib
import io
import json
import re
import shutil
import sys
import urllib.error
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / 'art'
API = 'https://api.hiro.so'
NFT = 'SPJW1XE278YMCEYMXB8ZFGJMH8ZVAAEDP2S2PJYG.happy-welsh'
REELS = {
    'cherry': 'SP1Z92MPDQEWZXW36VX71Q25HKF5K2EPCJ304F275.tokensoft-token-v4kjvtr37ht',
    'lemon': 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.generational-welsh',
    'chip': 'SP3S2565C4DP2MGR3CMANMGYDCDA314Q258CG2R7C.phoenix-welsh-faktory',
    'block': 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.liquid-staked-welsh-v2',
    'artifact': 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.anonymous-welsh-cvlt',
    'bitcoin': 'SP3NE50GEXFG9SZGTT51P40X2CKYSZ5CC4ZTZ7A2G.welshcorgicoin-token',
    'vault': 'SP22KATK6MJF40987KB2KSZQ6E027HQ0CPP73C9Y.leo-welsh-v1',
}
GATEWAYS = ['https://ipfs.filebase.io/ipfs/', 'https://ipfs.io/ipfs/',
            'https://gateway.pinata.cloud/ipfs/']
REGISTRIES = ['https://xtrata.xyz/forever-twins/data/registry.v2.json',
              'https://raw.githubusercontent.com/stxtrata/xtrata/main/xtrata-2.0/forever-twins/data/registry.v2.json']


def sha(data):
    return hashlib.sha256(data).hexdigest()


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--apply', action='store_true')
    ap.add_argument('--happy-count', type=int, default=18, choices=range(1, 19))
    ap.add_argument('--approve', action='append', default=[], metavar='CONTRACT=SHA256')
    args = ap.parse_args()
    current = json.loads((ART / 'assets.json').read_text())
    sources = json.loads((ART / 'sources.json').read_text())
    next_assets = copy.deepcopy(current)
    stamp = dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%dT%H-%M-%SZ')
    day = stamp[:10]
    stage = ART / 'refresh' / stamp
    stage.mkdir(parents=True, exist_ok=False)
    logs, pending, resolved = [], [], []
    approved = {}
    for rec in [*current['symbols'].values(), *current['family'], *current.get('happyWelsh', [])]:
        if rec.get('image') and rec.get('sha256'):
            approved.setdefault(rec['contract'], set()).add(rec['sha256'])
    for entry in args.approve:
        contract, sep, digest = entry.partition('=')
        if not sep or not re.fullmatch(r'[0-9a-fA-F]{64}', digest):
            ap.error('--approve must be an exact CONTRACT=SHA256 pair')
        approved.setdefault(contract, set()).add(digest.lower())

    def read(url, body=None, filename=None):
        if url.startswith('data:image/'):
            return base64.b64decode(url.split(',', 1)[1], validate=True)
        req = urllib.request.Request(url, data=None if body is None else json.dumps(body).encode(),
                                     headers={'User-Agent': 'Corgi-Kennel-Art-Refresh/1.0',
                                              **({'Content-Type': 'application/json'} if body else {})})
        try:
            with urllib.request.urlopen(req, timeout=25) as response:
                data = response.read(25_000_001)
                if len(data) > 25_000_000:
                    raise ValueError('Response exceeds 25 MB asset limit')
                logs.append({'uri': url, 'status': response.status, 'bytes': len(data), 'sha256': sha(data)})
            if filename:
                (stage / filename).write_bytes(data)
            return data
        except Exception as exc:
            logs.append({'uri': url, 'error': str(exc)})
            raise

    def read_json(url, filename, body=None):
        return json.loads(read(url, body, filename))

    def image_urls(uri):
        if uri.startswith('ipfs://'):
            return [gateway + uri[7:] for gateway in GATEWAYS]
        return [uri]

    def art(rec, uris):
        for original_uri in dict.fromkeys(u for u in uris if u):
            for url in image_urls(original_uri):
                try:
                    raw = read(url)
                    im = Image.open(io.BytesIO(raw))
                    im.verify()  # Reject HTML/error responses masquerading as successful images.
                    im = Image.open(io.BytesIO(raw)).convert('RGBA')
                    if im.width * im.height > 40_000_000:
                        raise ValueError('Image exceeds 40 megapixels')
                    digest = sha(raw)
                    candidate = f"{rec['key']}-{digest[:12]}"
                    (stage / (candidate + '.original')).write_bytes(raw)
                    im.thumbnail((480, 480), Image.Resampling.LANCZOS)
                    if im.getextrema()[3] == (255, 255):
                        im = im.convert('RGB')
                    buffer = io.BytesIO()
                    im.save(buffer, format='WEBP', lossless=True, method=4)
                    webp = buffer.getvalue()
                    if not webp:
                        raise ValueError('WebP encoder returned an empty result')
                    Image.open(io.BytesIO(webp)).verify()
                    (stage / (candidate + '.webp')).write_bytes(webp)
                    rec.update(sha256=digest, retrieved_from=url, snapshotDate=day)
                    if digest not in approved.get(rec['contract'], set()):
                        pending.append({'contract': rec['contract'], 'name': rec['name'],
                                        'sha256': digest, 'file': candidate + '.webp',
                                        'reason': 'New image bytes require visual review; not activated.'})
                        return None
                    filename = rec['key'] + '.webp'
                    if args.apply:
                        temporary = ART / (filename + '.tmp')
                        temporary.write_bytes(webp)
                        temporary.replace(ART / filename)
                    rec.update(image='art/' + filename, availability='bundled',
                               bundledSha256=sha((stage / (candidate + '.webp')).read_bytes()))
                    resolved.append(rec)
                    return rec
                except Exception:
                    continue
        return None

    # Keep the reviewed pedigree set. New search entries never enter the reels
    # automatically, so offensive/changed artwork cannot sneak in on a refresh.
    try:
        search = read_json(API + '/metadata/v1/ft?name=welsh&limit=60', 'family-search.json')
        logs.append({'familyTotalReported': search.get('total'), 'pageCount': len(search.get('results', []))})
    except Exception:
        pass
    selected = {x['contract']: copy.deepcopy(x) for x in current['family']}
    for slot, contract in REELS.items():
        selected[contract] = copy.deepcopy(current['symbols'][slot])
    refreshed = {}
    for contract, old in selected.items():
        try:
            meta = read_json(API + '/metadata/v1/ft/' + contract, old['key'] + '-metadata.json')
            returned = meta.get('contract_principal') or meta.get('asset_identifier', '').split('::')[0]
            if returned != contract:
                raise ValueError('Exact contract mismatch: ' + repr(returned))
            if not meta.get('name') or not meta.get('symbol') or not (meta.get('image_uri') or meta.get('image_canonical_uri')):
                raise ValueError('Name, symbol or logo metadata missing')
            if 'welsh' not in meta['name'].lower():
                raise ValueError('Pedigree token name no longer contains Welsh')
            rec = {**old, 'name': meta['name'], 'symbol': meta['symbol'],
                   'metadataSource': API + '/metadata/v1/ft/' + contract,
                   'image_uri': meta.get('image_uri'), 'image_canonical_uri': meta.get('image_canonical_uri')}
            result = art(rec, [meta.get('image_canonical_uri'), meta.get('image_uri')])
            if result:
                refreshed[contract] = result
        except Exception as exc:
            logs.append({'contract': contract, 'error': str(exc)})

    # The launch record is resolved from the exact WELSH deployment metadata.
    try:
        meta = read_json(API + '/metadata/v1/ft/' + REELS['bitcoin'], 'welsh-deploy-metadata.json')
        tx = read_json(API + '/extended/v1/tx/' + meta['tx_id'], 'day-one-tx.json')
        if tx.get('tx_type') != 'smart_contract' or tx.get('smart_contract', {}).get('contract_id') != REELS['bitcoin']:
            raise ValueError('Transaction is not the required WELSH contract deployment')
        next_assets['dayOne'] = {'contract': REELS['bitcoin'], 'txId': tx['tx_id'],
            'blockHeight': tx['block_height'], 'burnBlockHeight': tx['burn_block_height'],
            'date': tx['block_time_iso'], 'source': API + '/extended/v1/tx/' + tx['tx_id'],
            'status': 'verified', 'snapshotDate': day}
    except Exception as exc:
        logs.append({'dayOneError': str(exc), 'action': 'Previous verified snapshot retained'})

    # Read-only, never a signed transaction. Decode (ok (some (string-ascii))).
    try:
        address, name = NFT.split('.', 1)
        result = read_json(API + '/v2/contracts/call-read/' + address + '/' + name + '/get-token-uri',
                           'happy-get-token-uri.json', {'sender': address, 'arguments': ['0x0100000000000000000000000000000001']})
        encoded = bytes.fromhex(result['result'].removeprefix('0x'))
        if not result.get('okay') or encoded[:3] != bytes.fromhex('070a0d'):
            raise ValueError('Unexpected get-token-uri response')
        length = int.from_bytes(encoded[3:7], 'big')
        template = encoded[7:7 + length].decode('ascii')
        if not template.startswith('ipfs://') or '{id}' not in template:
            raise ValueError('Unexpected NFT URI template; inspect before accepting a changed source')
        happy = []
        for token_id in range(1, args.happy_count + 1):
            try:
                indexed = read_json(API + '/metadata/v1/nft/' + NFT + '/' + str(token_id),
                                    f'happy-{token_id}-metadata.json')
                if indexed['token_uri'] != template.replace('{id}', str(token_id)):
                    raise ValueError('NFT metadata URI differs from live read-only contract')
                metadata = indexed['metadata']
                rec = {'key': 'happy-welsh-' + str(token_id), 'name': metadata['name'],
                       'symbol': 'HAPPY', 'contract': NFT, 'token_id': token_id,
                       'token_uri': indexed['token_uri'], 'image_uri': metadata['image'],
                       'permission': 'Project / artist permission required before public use'}
                item = art(rec, [metadata['image'], metadata.get('cached_image')])
                if item:
                    happy.append(item)
            except Exception as exc:
                logs.append({'happyToken': token_id, 'error': str(exc)})
        if happy:
            next_assets['happyWelsh'] = happy
            next_assets['symbols']['wild'] = happy[0]
    except Exception as exc:
        logs.append({'happyWelshError': str(exc), 'action': 'Previous verified artwork retained'})

    for url in REGISTRIES:
        try:
            registry = read_json(url, 'registry.v2.json')
            if registry.get('registry') != 'forever-twins' or registry.get('version') != 2:
                raise ValueError('Unexpected registry identity/version')
            match = next((c for c in registry['collections'] if c.get('source') == NFT), None)
            next_assets['registry'] = {'status': 'snapshot-verified', 'source': url,
                'snapshotDate': day, 'happyWelshListed': match is not None,
                'happyWelshHelper': bool(match and match.get('helper') and match.get('status') == 'live'),
                'note': 'Registry snapshot only; not a live eligible-twin count.'}
            break
        except Exception:
            continue
    for slot, contract in REELS.items():
        if contract in refreshed:
            next_assets['symbols'][slot] = refreshed[contract]
    next_assets['family'] = [refreshed.get(x['contract'], x) for x in current['family']]
    sources['latestRefresh'] = {'timestamp': stamp, 'log': str(stage.relative_to(ART)),
                                'resolved': len(resolved), 'pendingReview': len(pending)}
    by_identity = {(x.get('contract'), x.get('token_id')): x for x in sources.get('sources', [])}
    for rec in resolved:
        by_identity[(rec['contract'], rec.get('token_id'))] = rec
    sources['sources'] = list(by_identity.values())
    sources['registry'] = next_assets.get('registry')
    sources['dayOne'] = next_assets.get('dayOne')
    (stage / 'requests.json').write_text(json.dumps(logs, indent=2))
    (stage / 'pending-review.json').write_text(json.dumps(pending, indent=2))
    (stage / 'assets.json').write_text(json.dumps(next_assets, indent=2))
    (stage / 'sources.json').write_text(json.dumps(sources, indent=2))
    if args.apply:
        (ART / 'assets.json').write_text(json.dumps(next_assets, indent=2))
        (ART / 'sources.json').write_text(json.dumps(sources, indent=2))
    print(json.dumps({'stage': str(stage), 'applied': args.apply,
                      'resolved': len(resolved), 'pendingReview': len(pending),
                      'requestErrors': sum('error' in x for x in logs)}, indent=2))


if __name__ == '__main__':
    main()
