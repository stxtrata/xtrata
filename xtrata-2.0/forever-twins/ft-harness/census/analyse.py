#!/usr/bin/env python3
"""Classify the Forever Twins preservation census.

Usage: python3 analyse.py ft-census-results.json [ft-census-retests.json] [manual-overrides.json]

Inputs
  ft-census-results.json   FT.results + deploys exported from the browser harness (ft-census.js)
  ft-census-retests.json   optional {r1, r2, r3} from the slow re-tests:
                             r1 = marketplace images re-tested slowly (fewer false failures)
                             r2 = template / folder token URIs resolved ($TOKEN_ID, bare CIDs, folders)
                             r3 = errored / image-less contracts re-read and re-resolved
  manual-overrides.json    optional {contract_id: {"contract_state": ..., "note": ...}} from hand checks
Writes <input>-classified.json and .csv
"""
import json, sys, csv, os, collections

src_path = sys.argv[1]
ret = json.load(open(sys.argv[2])) if len(sys.argv) > 2 and os.path.exists(sys.argv[2]) else {}
manual = json.load(open(sys.argv[3])) if len(sys.argv) > 3 and os.path.exists(sys.argv[3]) else {}
data = json.load(open(src_path))
results = data['results']
deploys = data.get('deploys', {})
R1, R2, R3 = ret.get('r1', {}), ret.get('r2', {}), ret.get('r3', {})

NOT_ART = ('BNS', 'Stacking DAO', 'Stackswap', 'Zest', 'Arkadiko', 'NoCodeClarity', 'Pass', 'ALEX Anniversary')

def meta_state(tok):
    m = {k: v for k, v in (tok.get('meta') or {}).items() if k != 'cached'}
    if not m:
        return 'none', None
    for k, v in m.items():
        if v == 'ok':
            return 'ok', k
    if set(m.values()) <= {'cors-blocked', 'host-dead(skipped)'} and 'cors-blocked' in m.values():
        return 'cors', None
    return 'dead', None

def img_state(tok):
    t = tok.get('imgTest')
    if t is None:
        return None
    if not tok.get('img'):
        return 'no-field'
    for k, v in t.items():
        if v == 'ok':
            return 'ok:' + k
    return 'dead'

def storage_label(cat):
    if not cat:
        return None
    if cat.startswith('ipfs'):
        return 'IPFS'
    return {'arweave': 'Arweave', 's3': 'AWS S3', 'gcs': 'Google Cloud', 'cloudfront': 'CloudFront',
            'stacksart': 'stacksart.com', 'web': 'Own server / API', 'data-uri': 'On chain',
            'gamma-cache': 'Gamma cache', 'none': None, 'other': 'Other'}.get(cat, cat)

def contract_from_r2(toks):
    got = [t for t in toks if t.get('via')]
    if not got:
        return 'dead', None, None
    imgs = [t for t in got if (t.get('imgRes') or '').endswith(':ok')]
    cat = got[0].get('imgCat')
    if imgs:
        return 'works-template', cat, imgs[0]['imgRes'].split(':')[0]
    if not any(t.get('img') for t in got):
        return 'no-image-field', cat, None
    return 'image-dead', cat, None

def contract_from_r3(toks):
    if toks and all(t.get('raw') != 'ok' for t in toks):
        return 'uri-error', None
    metas_ok = [t for t in toks if any(m.endswith(':ok') for m in (t.get('meta') or []))]
    if not metas_ok:
        return 'dead', None
    for t in metas_ok:
        im = t.get('img') or ''
        if im.startswith('inline'):
            return 'on-chain', 'data-uri'
        if ':ok' in im or '[200' in im or '[206' in im:
            f = t.get('imgField') or ''
            return 'works', ('arweave' if 'ar' in f[:5] or 'arweave' in f else ('ipfs' if 'ipfs' in f or f.startswith('Qm') else 'web'))
    if not any(t.get('imgField') for t in metas_ok):
        return 'no-image-field', None
    return 'image-dead', None

rows = []
for cid, x in results.items():
    s = x.get('src') or {}
    sig = s.get('sig') or {}
    toks = x.get('tok') or []
    idx = dict(x.get('idx') or {})
    name = x.get('n') or ''
    notes = []
    # ---------- contract layer ----------
    uri_cats = sorted({t.get('uriCat') for t in toks if t.get('uriCat')})
    img_cats = sorted({t.get('imgCat') for t in toks if t.get('imgCat')})
    with_uri = [t for t in toks if t.get('uri')]
    shared = len(with_uri) > 1 and len({t['uri'] for t in with_uri}) == 1
    onchain = s.get('style') == 'data-uri' or 'data-uri' in uri_cats or 'data-uri' in img_cats
    metas = [meta_state(t) for t in toks if not t.get('uriErr')]
    imgs = [img_state(t) for t in toks if t.get('imgTest') is not None]
    meta_ok = [m for m in metas if m[0] == 'ok']
    img_ok = [i for i in imgs if i and i.startswith('ok')]
    via = sorted({m[1] for m in meta_ok} | {i.split(':', 1)[1] for i in img_ok})
    if onchain:
        c = 'on-chain'
    elif toks and all(t.get('uriErr') for t in toks):
        c = 'uri-error'
    elif meta_ok and img_ok:
        c = 'works'
    elif meta_ok and imgs and all(i == 'no-field' for i in imgs):
        c = 'no-image-field'
    elif meta_ok:
        c = 'image-dead'
    elif metas and all(m[0] == 'cors' for m in metas):
        c = 'unverified'
    else:
        c = 'dead'
    if shared and c != 'works':
        c = 'shared-file'
    # re-tests
    if cid in R2:
        c2, cat2, via2 = contract_from_r2(R2[cid])
        if c2 != 'dead' or c in ('shared-file', 'dead'):
            c = c2 if c2 != 'dead' else ('shared-file' if shared else 'dead')
            if cat2:
                img_cats = [cat2]
            if via2:
                via = [via2]
            notes.append('token URI uses a placeholder or folder that marketplaces fill in')
    if cid in R3:
        c3, cat3 = contract_from_r3(R3[cid].get('tokens', []))
        c = c3
        if cat3:
            img_cats = [cat3]
    if cid in manual:
        c = manual[cid].get('contract_state', c)
        if manual[cid].get('note'):
            notes.append(manual[cid]['note'])
    if sig.get('svgFn'):
        notes.append('contract can rebuild the image on chain (SVG function)')
    # ---------- IPFS durability ----------
    prov = list((x.get('cids') or {}).values())
    orgs = set(w for p in prov for w in (p.get('who') or []))
    min_prov = min([p.get('n', 0) for p in prov], default=None)
    if not prov:
        ipfs_dur = None
    elif min_prov == 0:
        ipfs_dur = 'not found on IPFS'
    elif orgs <= {'pinata'}:
        ipfs_dur = 'Pinata only'
    else:
        ipfs_dur = 'several hosts'
    # ---------- marketplace (index) layer ----------
    n, ok = idx.get('n', 0), idx.get('ok', 0)
    if cid in R1:
        rr = R1[cid]
        rate_limited = sum(1 for z in rr.get('res', []) if (z.get('head') or '').startswith('429'))
        n, ok = rr.get('n', n), rr.get('ok', ok) + rate_limited
        if rate_limited:
            notes.append(f'{rate_limited} marketplace images rate-limited by their gateway (counted as loading)')
    if not n:
        i_state = 'no items'
    elif ok == n:
        i_state = 'all load'
    elif ok == 0:
        i_state = 'none load'
    elif ok / n >= 0.8:
        i_state = 'mostly load'
    else:
        i_state = 'partial'
    hosts = idx.get('hosts') or {}
    gamma_pinata = any('stxnft.mypinata' in h for h in hosts)
    idx_main = max((idx.get('cats') or {'none': 0}).items(), key=lambda kv: kv[1])[0]
    # ---------- storage ----------
    art_cat = img_cats[0] if img_cats else None
    if c in ('shared-file',) and uri_cats:
        art_storage = 'None per token (one shared file on ' + (storage_label(uri_cats[0]) or uri_cats[0]) + ')'
    elif c == 'on-chain':
        art_storage = 'On chain'
    else:
        art_storage = storage_label(art_cat) or (storage_label(uri_cats[0]) if uri_cats else None)
    # ---------- bucket ----------
    alive = c in ('works', 'works-template', 'on-chain')
    dead = c in ('dead', 'image-dead', 'shared-file', 'uri-error', 'no-image-field')
    mk_ok = i_state in ('all load', 'mostly load')
    if any(k.lower() in name.lower() for k in NOT_ART) and 'Punk' not in name:
        bucket = 'Not artwork'
    elif c == 'on-chain' or (sig.get('svgFn') and alive):
        bucket = 'On chain'
    elif alive and mk_ok:
        bucket = 'Healthy' if (art_cat == 'arweave' or ipfs_dur == 'several hosts') else 'Fragile'
    elif alive and not mk_ok:
        bucket = 'Marketplace copy broken'
    elif dead and mk_ok:
        bucket = 'Walking dead'
    elif dead and i_state == 'partial':
        bucket = 'Failing'
    elif dead and i_state == 'none load':
        bucket = 'Lost'
    else:
        bucket = 'Unclear'
    dep = deploys.get(cid) or {}
    rows.append({
        'rank': x.get('r'), 'name': name.strip(), 'id': cid, 'volume_stx': x.get('v'), 'last_token_id': x.get('last'),
        'deployed': (dep.get('time') or '')[:10], 'year': (dep.get('time') or '')[:4],
        'bucket': bucket, 'contract_state': c, 'marketplace_state': i_state, 'marketplace_ok': f'{ok}/{n}',
        'art_storage': art_storage, 'uri_storage': ', '.join(filter(None, (storage_label(u) for u in uri_cats))),
        'ipfs_durability': ipfs_dur, 'ipfs_min_providers': min_prov,
        'works_via': ', '.join(via), 'uri_changeable': bool(s.get('mutable')),
        'marketplace_host': idx_main, 'gamma_pinata': gamma_pinata,
        'onchain_signals': ','.join(k for k, v in sig.items() if v),
        'notes': '; '.join(notes),
        'uri_example': next((t.get('uri') for t in toks if t.get('uri')), '') or next((t.get('uri') for t in (R3.get(cid) or {}).get('tokens', []) if t.get('uri')), '') or next((t.get('variant') for t in R2.get(cid, []) if t.get('variant')), ''),
        'img_example': next((t.get('img') for t in toks if t.get('img')), '') or next((t.get('imgField') for t in (R3.get(cid) or {}).get('tokens', []) if t.get('imgField')), '') or next((t.get('img') for t in R2.get(cid, []) if t.get('img')), ''),
        'market_example': ((x.get('idx') or {}).get('eg') or [[None, '']])[0][1],
    })

rows.sort(key=lambda r: r.get('rank') or 9999)
base = os.path.splitext(src_path)[0]
json.dump(rows, open(base + '-classified.json', 'w'), indent=1)
with open(base + '-classified.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    w.writeheader()
    w.writerows(rows)

c = collections.Counter(r['bucket'] for r in rows)
print('collections', len(rows))
for k, v in c.most_common():
    vol = sum(r.get('volume_stx') or 0 for r in rows if r['bucket'] == k)
    print(f'  {k:24s} {v:4d}  volume {vol:,} STX')
print('contract states', collections.Counter(r['contract_state'] for r in rows).most_common())
print('art storage', collections.Counter(r['art_storage'] for r in rows).most_common())
print('marketplace hosts', collections.Counter(r['marketplace_host'] for r in rows).most_common())
print('gamma pinata dependency', sum(1 for r in rows if r['gamma_pinata']))
print('ipfs durability', collections.Counter(r['ipfs_durability'] for r in rows).most_common())
print('by year x bucket')
for y in sorted({r['year'] for r in rows}):
    print('  ', y or '?', dict(collections.Counter(r['bucket'] for r in rows if r['year'] == y)))
