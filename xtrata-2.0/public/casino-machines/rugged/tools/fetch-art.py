#!/usr/bin/env python3
"""Fetches every image and on-chain record the Rugged machine shows, and the evidence for each rescued collection.

    python3 tools/fetch-art.py

Reads only public sources and writes only inside this machine folder:
  * the Forever Twins registry (xtrata.xyz/forever-twins/data/registry.v2.json) and each collection's twin manifest;
  * each approved collection's helper events (token id -> Xtrata id), read through Xtrata's Hiro proxy (api.hiro.so fallback);
  * every twin image from Xtrata (xtrata.xyz/inscription/mainnet/<core>/<xtrata id>), kept only if its SHA-256 matches
    the manifest's twin hash;
  * the source contract's get-token-uri (the art link the collection itself publishes) for token 0 and token 1, and
    whether that link still serves token data from this host;
  * the Welshcorgicoin token metadata (Hiro token metadata API) and the logo file it names.
Output: art/birds/<collection>/<id>.png, art/logos/welsh.png, art/fetched.json (every URL, hash and read, with its time).
Run it again any time; it never edits the casino. make-art.mjs turns the result into art/art.js, manifest.json, sources.json.
"""
import hashlib, json, os, ssl, sys, time, urllib.request, urllib.error

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(HERE, 'art')
XTRATA = 'https://xtrata.xyz'
HIRO = [XTRATA + '/hiro/mainnet', 'https://api.hiro.so']
WELSH = 'SP3NE50GEXFG9SZGTT51P40X2CKYSZ5CC4ZTZ7A2G.welshcorgicoin-token'
ca = '/root/.ccr/ca-bundle.crt'
CTX = ssl.create_default_context(cafile=ca) if os.path.exists(ca) else ssl.create_default_context()
NOW = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())


def get(url, data=None, timeout=30, raw=False):
    req = urllib.request.Request(url, data=data, headers={'user-agent': 'xtrata-rugged-build/1', **({'content-type': 'application/json'} if data else {})})
    with urllib.request.urlopen(req, timeout=timeout, context=CTX) as r:
        body = r.read()
        return (body, r.headers.get('content-type', ''), r.status) if raw else json.loads(body)


def hiro(path, data=None):
    last = None
    for base in HIRO:
        try:
            return get(base + path, data), base
        except Exception as e:  # a failed read is "unknown", never "empty"
            last = e
    raise last


def clarity_string(hexs):
    """Decodes (ok (some "...")) / (ok "...") string results of a read-only call."""
    b = bytes.fromhex(hexs[2:] if hexs.startswith('0x') else hexs)
    i = 0
    while b[i] in (0x07, 0x0a):  # ok, some
        i += 1
    if b[i] in (0x0d, 0x0e):
        n = int.from_bytes(b[i + 1:i + 5], 'big')
        return b[i + 5:i + 5 + n].decode('utf8')
    if b[i] == 0x09:
        return None  # none
    raise ValueError('not a string result: ' + hexs[:40])


def call_read(contract, fn, args):
    addr, name = contract.split('.')
    body = json.dumps({'sender': addr, 'arguments': args}).encode()
    j, base = hiro(f'/v2/contracts/call-read/{addr}/{name}/{fn}', body)
    if not j.get('okay'):
        raise RuntimeError(json.dumps(j))
    return j['result'], base


def uint_arg(n):
    return '0x01' + n.to_bytes(16, 'big').hex()


def probe(url):
    """Does a published art link still serve token data? Records what this host saw; a blocked host is recorded as such."""
    try:
        body, ctype, status = get(url, raw=True, timeout=20)
        try:
            json.loads(body)
            kind = 'json'
        except Exception:
            kind = 'html' if b'<html' in body[:2000].lower() else 'other'
        return {'url': url, 'checkedAt': NOW, 'status': status, 'contentType': ctype, 'bytes': len(body), 'servesTokenData': kind == 'json', 'kind': kind}
    except urllib.error.HTTPError as e:
        return {'url': url, 'checkedAt': NOW, 'status': e.code, 'servesTokenData': False, 'kind': 'http-error'}
    except Exception as e:
        return {'url': url, 'checkedAt': NOW, 'status': None, 'servesTokenData': None, 'kind': 'unreachable-from-build-host', 'error': str(e)[:160]}


def main():
    rescued = json.load(open(os.path.join(HERE, 'rescued-list.json')))
    reg = get(XTRATA + '/forever-twins/data/registry.v2.json')
    core = reg['core']['contract']
    out = {'fetchedAt': NOW, 'registry': XTRATA + '/forever-twins/data/registry.v2.json', 'core': core, 'collections': [], 'logos': {}}
    for entry in rescued['collections']:
        if not entry.get('approved'):
            continue
        col = next((c for c in reg['collections'] if c['key'] == entry['key']), None)
        rec = {'key': entry['key'], 'name': entry['name'], 'source': entry['source'], 'registryStatus': col and col['status'], 'helper': col and col.get('helper'),
               'registryCoverage': col and col.get('coverage'), 'registryNote': col and (col.get('info') or {}).get('about'), 'tokens': [], 'deadLinks': [], 'failures': []}
        # The source contract's own art link, read from the chain.
        for tid in (0, 1):
            try:
                res, base = call_read(entry['source'], 'get-token-uri', [uint_arg(tid)])
                uri = clarity_string(res)
                rec['deadLinks'].append({'tokenId': tid, 'call': f"{entry['source']}::get-token-uri(u{tid})", 'via': base, 'result': uri, 'readAt': NOW, 'probe': probe(uri) if uri else None})
            except Exception as e:
                rec['failures'].append(f'get-token-uri u{tid}: {e}')
        manifest = {}
        if col and col.get('manifest'):
            murl = XTRATA + col['manifest']['url']
            m = get(murl)
            manifest = {t['id']: t for t in m['tokens']}
            rec['manifest'] = {'url': murl, 'count': m.get('count'), 'registrySha256': col['manifest'].get('sha256')}
        # Helper events: token id -> Xtrata id. Every page is read; a failed page is recorded, never treated as "no twins".
        xid = {}
        if col and col.get('helper'):
            off, count = 0, None
            while True:
                try:
                    j, base = hiro(f"/extended/v1/contract/{col['helper']}/events?limit=50&offset={off}")
                except Exception as e:
                    rec['failures'].append(f'events offset {off}: {e}'); break
                rows = j.get('results') or []
                for ev in rows:
                    repr_ = ((ev.get('contract_log') or {}).get('value') or {}).get('repr', '')
                    import re
                    t, x, n = re.search(r'\(token-id u(\d+)\)', repr_), re.search(r'\(xtrata-id u(\d+)\)', repr_), re.search(r'\(inscribed-count u(\d+)\)', repr_)
                    if t and x:
                        xid[int(t.group(1))] = int(x.group(1))
                    if n:
                        count = max(count or 0, int(n.group(1)))
                if len(rows) < 50:
                    break
                off += 50
            rec['inscribedCount'] = count
        dest = os.path.join(ART, 'birds', entry['key'])
        os.makedirs(dest, exist_ok=True)
        for tid in sorted(set(manifest) | set(xid)):
            m = manifest.get(tid, {})
            want = (m.get('twin') or {}).get('sha256')
            x = xid.get(tid)
            t = {'tokenId': tid, 'xtrataId': x, 'original': (m.get('original') or {}).get('mediaUris', [None])[0], 'sha256': want}
            path = os.path.join(dest, f'{tid}.png')
            if x is not None:
                url = f"{XTRATA}/inscription/mainnet/{core.replace('.', '/')}/{x}"
                t['url'] = url
                try:
                    if os.path.exists(path) and hashlib.sha256(open(path, 'rb').read()).hexdigest() == want:
                        body = open(path, 'rb').read()
                    else:
                        body, _, _ = get(url, raw=True)
                    got = hashlib.sha256(body).hexdigest()
                    t['verified'] = got == want
                    if t['verified']:
                        open(path, 'wb').write(body)
                    else:
                        rec['failures'].append(f'#{tid} hash mismatch {got}')
                except Exception as e:
                    t['verified'] = False
                    rec['failures'].append(f'#{tid} {e}')
            rec['tokens'].append(t)
        print(f"{entry['name']}: {sum(1 for t in rec['tokens'] if t.get('verified'))}/{len(rec['tokens'])} twins verified, {len(rec['failures'])} failures")
        out['collections'].append(rec)
    # WELSH: the official logo is the image named by the token's own metadata.
    try:
        meta, base = hiro(f'/metadata/v1/ft/{WELSH}')
        logo_url = (meta.get('metadata') or {}).get('image') or meta.get('image_canonical_uri')
        body, ctype, _ = get(logo_url, raw=True)
        os.makedirs(os.path.join(ART, 'logos'), exist_ok=True)
        open(os.path.join(ART, 'logos', 'welsh.png'), 'wb').write(body)
        out['logos']['welsh'] = {'name': meta.get('name'), 'symbol': meta.get('symbol'), 'contract': WELSH, 'tokenUri': meta.get('token_uri'), 'metadataVia': base + f'/metadata/v1/ft/{WELSH}',
                                 'image': logo_url, 'sha256': hashlib.sha256(body).hexdigest(), 'bytes': len(body), 'contentType': ctype, 'fetchedAt': NOW, 'description': meta.get('description')}
        print('WELSH logo', len(body), 'bytes from', logo_url)
    except Exception as e:
        out['logos']['welsh'] = {'error': str(e), 'fetchedAt': NOW}
        print('WELSH logo FAILED', e)
    json.dump(out, open(os.path.join(ART, 'fetched.json'), 'w'), indent=1)
    print('wrote art/fetched.json')


if __name__ == '__main__':
    sys.exit(main())
