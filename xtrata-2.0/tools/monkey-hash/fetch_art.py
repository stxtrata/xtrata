#!/usr/bin/env python3
"""Monkey Hash art export. Pure standard library.

Reads the Bitcoin Monkeys metadata, scores every monkey by trait rarity, and writes the art bundle the game embeds:
    public/casino-machines/monkey-hash/art/monkey-hash-art.json
and the record of where every picture came from:
    public/casino-machines/monkey-hash/art/image-log.json

Rarity (the treatment's "rarest 5%"):  score = sum over a monkey's traits of ln(N / frequency of that (trait_type, value)),
N = number of monkeys with metadata.  The rarest 5% wear the GOLD frame (tier '2', the jackpot symbol); the rest wear STONE (tier '1').

Pictures (needs a network that can reach the gateways; the build sandbox could only reach xtrata.xyz, so run this on your machine):
    - the forevered twins: https://xtrata.xyz/i/<xtrata id>   (real Xtrata inscriptions of the monkey)
    - original monkeys:    IPFS <art cid>/<id>.png via the Gamma resizing CDN (160px webp), falling back to public IPFS gateways
    - Serums:              one image per batch (MM1, MM2), from the labs collection art folders
    - Mutant Monkeys:      SP125J1ADVYWGWB9NQRCVGKYAG73R17ZNMV17XEJ7.mutant-monkeys (Hiro gives only a token_uri, which is followed)

Usage (from the repo root):
    python3 tools/monkey-hash/fetch_art.py                       # bundle 18 gold + 18 stone originals, the twins, 2 serums
    python3 tools/monkey-hash/fetch_art.py --per-tier 30
    python3 tools/monkey-hash/fetch_art.py --offline             # no network: record-only monkeys (token number + tier), twin pictures from art/twins
    python3 tools/monkey-hash/fetch_art.py --mutant-contract SP....mutant-monkeys --mutants 18
Then:  python3 tools/monkey-hash/build.py
"""
import argparse, base64, json, math, os, sys, time, urllib.request, concurrent.futures as cf

HERE = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.normpath(os.path.join(HERE, '..', '..', 'public', 'casino-machines', 'monkey-hash'))
CONTRACT = 'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys'
MUTANT_CONTRACT = 'SP125J1ADVYWGWB9NQRCVGKYAG73R17ZNMV17XEJ7.mutant-monkeys'  # from the series contracts sheet (kits/CONTRACTS.md), verified on Hiro
ART_CID = 'QmYCnfeseno5cLpC75rmy6LQhsNYQCJabiuwqNUXMaA3Fo'
SERUM_CID = {'MM1': 'QmaELQUAgrcjvokrKmH6ns5QvbipfWGNEWPV57GbSS3N34', 'MM2': 'Qmd5b6m7N9FQatcLBipDXd1b2E2tBwTY7z9fWBirry4KSJ'}
SERUM_RANGE = {'MM1': (1, 3500), 'MM2': (3501, 5000)}
META_HOSTS = ['https://xtrata.xyz/hiro/mainnet', 'https://api.hiro.so']
CACHE = os.path.join(HERE, 'art', 'cache'); os.makedirs(CACHE, exist_ok=True)
UA = {'User-Agent': 'monkey-hash-art/1.0'}

def get(url, timeout=25, binary=False):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout) as r:
        data = r.read(); return (data, r.headers.get('Content-Type', '')) if binary else json.loads(data)

def gateways(cid, path=''):
    return [f'https://images.gamma.io/cdn-cgi/image/width=160,height=160,format=webp/https://stxnft.mypinata.cloud/ipfs/{cid}{path}',
            f'https://stxnft.mypinata.cloud/ipfs/{cid}{path}', f'https://ipfs.io/ipfs/{cid}{path}', f'https://cloudflare-ipfs.com/ipfs/{cid}{path}']

def fetch_image(urls, log, what):
    for u in urls:
        try:
            data, ct = get(u, 30, True)
            if len(data) < 200: continue
            ct = (ct or 'image/png').split(';')[0]
            if not ct.startswith('image/'): ct = 'image/webp' if data[:4] == b'RIFF' else 'image/png'
            log.append({'what': what, 'url': u, 'bytes': len(data), 'type': ct}); return 'data:%s;base64,%s' % (ct, base64.b64encode(data).decode())
        except Exception as e:
            continue
    log.append({'what': what, 'url': None, 'error': 'no source served it'}); return None

def load_meta(path):
    meta = json.load(open(path)) if path and os.path.exists(path) else {}
    out = os.path.join(CACHE, 'bm_meta.json')
    if not meta and os.path.exists(out): meta = json.load(open(out))
    todo = [i for i in range(1, 2501) if str(i) not in meta]
    if todo and not ARGS.offline:
        def one(i):
            for host in META_HOSTS:
                for a in range(3):
                    try:
                        m = get(f'{host}/metadata/v1/nft/{CONTRACT}/{i}')['metadata']
                        return i, {'a': [[x['trait_type'], str(x['value'])] for x in m.get('attributes', [])], 'img': m.get('image', '')}
                    except Exception: time.sleep(1 + a)
            return i, None
        print(f'reading metadata for {len(todo)} monkeys…', flush=True)
        with cf.ThreadPoolExecutor(6) as ex:
            for i, r in ex.map(one, todo):
                if r: meta[str(i)] = r
        json.dump(meta, open(out, 'w'))
    return meta

def rarity(meta):
    N = len(meta); freq = {}
    for v in meta.values():
        for t, x in v['a']: freq[(t, x)] = freq.get((t, x), 0) + 1
    score = {int(k): sum(math.log(N / freq[(t, x)]) for t, x in v['a']) for k, v in meta.items()}
    order = sorted(score, key=lambda k: (-score[k], k)); gold = set(order[:round(N * 0.05)])
    tier = ''.join('0' if str(i) not in meta else ('2' if i in gold else '1') for i in range(1, 2501))
    return score, gold, tier, N

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--meta'); ap.add_argument('--per-tier', type=int, default=18); ap.add_argument('--offline', action='store_true')
    ap.add_argument('--mutant-contract', default=MUTANT_CONTRACT); ap.add_argument('--mutants', type=int, default=18); global ARGS; ARGS = ap.parse_args()
    meta = load_meta(ARGS.meta or '')
    if len(meta) < 2000: sys.exit('Not enough metadata to score rarity (%d). Run with network access, or pass --meta.' % len(meta))
    score, gold, tier, N = rarity(meta)
    counts = {'1': tier.count('1'), '2': tier.count('2'), 'none': tier.count('0')}
    twinfile = os.path.join(HERE, 'art', 'twins.json'); twins = json.load(open(twinfile)) if os.path.exists(twinfile) else {}
    log = []; items = []
    # 1. forevered twins: real Xtrata inscriptions
    for tid, xid in sorted(twins.items(), key=lambda kv: int(kv[0])):
        p = os.path.join(HERE, 'art', 'twins', f'{tid}.webp'); uri = None
        if os.path.exists(p): uri = 'data:image/webp;base64,' + base64.b64encode(open(p, 'rb').read()).decode(); log.append({'what': f'twin {tid}', 'url': f'https://xtrata.xyz/i/{xid}', 'bytes': os.path.getsize(p), 'type': 'image/webp', 'note': 'saved from the Xtrata image route, 160px'})
        elif not ARGS.offline: uri = fetch_image([f'https://xtrata.xyz/i/{xid}'], log, f'twin {tid}')
        items.append([int(tid), tier[int(tid) - 1] if tier[int(tid) - 1] != '0' else '1', uri, 1, str(xid)])
    # 2. original monkeys, spread across the id range in each tier (picture or, offline, the record only)
    have = {i[0] for i in items}
    for tk, pool in (('2', sorted(gold)), ('1', [i for i in range(1, 2501) if tier[i - 1] == '1'])):
        pool = [i for i in pool if i not in have]; step = max(1, len(pool) // ARGS.per_tier); pick = pool[::step][:ARGS.per_tier]
        if ARGS.offline: items += [[i, tk, None, 0, None] for i in pick]; continue
        with cf.ThreadPoolExecutor(6) as ex:
            for i, uri in zip(pick, ex.map(lambda i: fetch_image(gateways(ART_CID, f'/{i}.png'), log, f'monkey {i}'), pick)): items.append([i, tk, uri, 0, None])
    # 3. serums: one image per batch, plus real token ids
    serums = {}
    for t, cid in SERUM_CID.items():
        a, b = SERUM_RANGE[t]; ids = [a + (b - a) * k // 17 for k in range(18)]
        uri = None if ARGS.offline else fetch_image(gateways(cid), log, f'serum {t}')
        serums[t] = {'uri': uri, 'ids': ids, 'cid': cid}
    # 4. mutants (only when the contract is known)
    mutants = None
    if ARGS.mutant_contract and not ARGS.offline:
        mutants = {'contract': ARGS.mutant_contract, 'items': []}
        for i in range(1, ARGS.mutants + 1):
            try:
                j = get(f'{META_HOSTS[0]}/metadata/v1/nft/{ARGS.mutant_contract}/{i}'); m = j.get('metadata') or (get(j['token_uri']) if j.get('token_uri') else {}); img = m.get('image', '')
                urls = gateways(img[7:]) if img.startswith('ipfs://') else [img]
                mutants['items'].append([i, fetch_image(urls, log, f'mutant {i}')])
            except Exception as e: log.append({'what': f'mutant {i}', 'error': str(e)})
    art = {'items': items, 'tierString': tier, 'tierCounts': {'1': counts['1'], '2': counts['2']}, 'serums': serums, 'mutants': mutants, 'contract': CONTRACT, 'tokensWithMetadata': N, 'tokensWithoutMetadata': counts['none'],
           'method': 'score = sum ln(N/frequency) over (trait_type, value); rarest 5% = gold frame', 'generated': time.strftime('%Y-%m-%dT%H:%MZ', time.gmtime())}
    os.makedirs(os.path.join(PUB, 'art'), exist_ok=True)
    json.dump(art, open(os.path.join(PUB, 'art', 'monkey-hash-art.json'), 'w'), separators=(',', ':'))
    json.dump({'generated': art['generated'], 'offline': ARGS.offline, 'images': log, 'goldTokenIds': sorted(gold), 'scores': {str(k): round(score[k], 3) for k in sorted(gold)}}, open(os.path.join(PUB, 'art', 'image-log.json'), 'w'), indent=1)
    print('monkeys with metadata', N, '| gold', counts['2'], '| stone', counts['1'], '| items', len(items), '| pictures', sum(1 for i in items if i[2]), '| serum pictures', sum(1 for s in serums.values() if s['uri']), '| log entries', len(log))

if __name__ == '__main__': main()
