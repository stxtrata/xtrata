#!/usr/bin/env python3
"""Fetch Crash Punks token metadata (traits) through the xtrata.xyz Hiro proxy. Resumable.
Source contract: SP3QSAJQ4EA8WXEDSRRKMZZ29NH91VZ6C5X88FGZQ.crashpunks-v2 (last-token-id 5754 read on 2026-11-01)."""
import json, os, sys, time, urllib.request, concurrent.futures as cf
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'art', 'meta.json')
CONTRACT = 'SP3QSAJQ4EA8WXEDSRRKMZZ29NH91VZ6C5X88FGZQ.crashpunks-v2'
LAST = int(sys.argv[1]) if len(sys.argv) > 1 else 5754
BUDGET = float(sys.argv[2]) if len(sys.argv) > 2 else 140
meta = json.load(open(OUT)) if os.path.exists(OUT) else {}
missing404 = set(meta.get('_404', []))
meta.pop('_404', None)
todo = [i for i in range(1, LAST + 1) if str(i) not in meta and i not in missing404]
t0 = time.time()
def get(i):
    if time.time() - t0 > BUDGET: return i, 'skip'
    for a in range(3):
        try:
            u = f'https://xtrata.xyz/hiro/mainnet/metadata/v1/nft/{CONTRACT}/{i}'
            with urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'snow-crash-build'}), timeout=20) as r:
                m = json.load(r)['metadata']
            return i, {'a': [[x['trait_type'], str(x['value'])] for x in m.get('attributes', [])], 'img': m.get('image', '')}
        except urllib.error.HTTPError as e:
            if e.code == 404: return i, '404'
            time.sleep(1 + a)
        except Exception:
            time.sleep(1 + a)
    return i, 'err'
n = 0
with cf.ThreadPoolExecutor(10) as ex:
    for i, r in ex.map(get, todo):
        if r == 'skip' or r == 'err': continue
        if r == '404': missing404.add(i)
        else: meta[str(i)] = r
        n += 1
meta['_404'] = sorted(missing404)
json.dump(meta, open(OUT, 'w'))
print('fetched', n, 'have', len(meta) - 1, '404', len(missing404), 'remaining', LAST - (len(meta) - 1) - len(missing404), 'secs', round(time.time() - t0))
