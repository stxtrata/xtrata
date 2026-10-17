#!/usr/bin/env python3
"""Classify a cross-chain census dump (XC.dump() from xc-census.js).

Usage: python3 xc-analyse.py xc-results.json
Writes <input>-triage.csv, <input>-classified.csv and <input>-classified.json.

Two layers, as in the Stacks census:
  contract layer  = what the token's own on-chain pointer leads to (tokenURI / uri / Tezos token_metadata)
  index layer     = an indexer's cached copy (Alchemy's CDN for EVM chains, TzKT's metadata cache for Tezos)
"""
import json, sys, csv, os, collections

src = sys.argv[1]
d = json.load(open(src))
base = os.path.splitext(src)[0]

# ---------- triage table ----------
tri = sorted(d.get('triage', {}).values(), key=lambda x: -x.get('score', 0))
with open(base + '-triage.csv', 'w', newline='') as f:
    w = csv.writer(f)
    w.writerow(['score', 'chain', 'contract', 'name', 'source', 'rank', 'pointer_types', 'upgradeable', 'uri_setters', 'freeze_fn', 'example_pointer', 'why', 'error'])
    for t in tri:
        i = t.get('info') or {}
        w.writerow([t.get('score'), t['chain'], t['contract'], t.get('name') or i.get('name'), t.get('source'), t.get('rank'),
                    ','.join(t.get('cats') or []), i.get('upgradeable'), ','.join(i.get('mutators') or []), ','.join(i.get('freezers') or []),
                    (t.get('uris') or [''])[0][:160], t.get('why', ''), t.get('err', '')])

# ---------- deep results ----------
def ok(x):
    return bool(x) and x.get('res') == 'ok'

NOTES = {  # hand checks, keyed by lower-case contract
    'kt1mxdwchidwd6wbvs24g1njeruok622zefp': 'UNCLEAR: on-chain pointer is http://localhost:9999/ (unusable); the art is likely kept elsewhere in contract storage, which this harness does not read (not checked)',
    '0xe052113bd7d7700d623414a0a4585bcae754e9d5': 'UNCLEAR: no tokenURI or uri function answered; check this is the right Nifty Gateway contract',
    # pilot hand checks (16 Oct 2026, server-side fetch)
    '0xabefbc9fd2f806065b4f3c237d4b59d9a97bcac7': 'pointers name ipfs.fleek.co, a gateway that did not answer; the sampled metadata could not be fetched through other gateways (one folder has no IPFS hosts, others answered slowly or not at all)',
    '0xcb45dce241a6f6f1e874e9925bea5840f3fd7d3a': 'server-side fetch of the metadata also failed (client error), so the bucket looks closed',
    'kt1mql8vjvqckk5a6ubfn9qv2yuvjstg1cyh': 'FRAGILE: metadata confirmed by a server-side fetch (the server blocks browser reads); art on the project\'s own image server',
    'kt1nvvpsndchrlrh5k2cy6sc9r1uuuwdizqd': 'pointer host proxy.dogami.com no longer exists in DNS (checked 16 Oct 2026); art survives in the TzKT copy, whose image is on IPFS',
    # full-run hand checks (16 Oct 2026): DNS over HTTPS from the browser, plus server-side fetches where the host allowed them
    'kt1cabpghuwvksa9bxmpkqsgabgsjtmryeda': 'pointer host proxy.dogami.com no longer exists in DNS (checked 16 Oct 2026); art survives in the TzKT copy, whose image is on IPFS',
    '0x730151b8286ca0508a19a9d5c47fe91fdd9a6737': 'pointer host drops.niftyisland.com no longer exists in DNS (checked 16 Oct 2026), and the indexer copy has no image that loads',
    '0xa9ba1a433ec326bca975aef9a1641b42717197e7': 'pointer host gangsterallstar.nonfungiblecdn.com no longer exists in DNS (checked 16 Oct 2026)',
    '0xef9c21e3ba31a74910fc7e7cb3fc814ad842ad6e': 'pointer host api.warriorsofaradena.com no longer exists in DNS (checked 16 Oct 2026)',
    '0xacf63e56fd08970b43401492a02f6f38b6635c91': 'pointer host prod.kanpaidev.com no longer exists in DNS (checked 16 Oct 2026)',
    '0x5bd815fd6c096bab38b4c6553cfce3585194dff9': 'pointer host nfts.renga.app no longer exists in DNS (checked 16 Oct 2026)',
    '0x5d4aa6ff9de7963ead5a17b454dc1093ca9e98e7': 'pointer host api.runiverse.world no longer exists in DNS (checked 16 Oct 2026)',
    '0x0c2e57efddba8c768147d1fdf9176a0a6ebd5d83': 'pointer host api.kaijukingz.io still points at Heroku, but no app answers there',
    '0x466cfcd0525189b573e794f554b8a751279213ac': 'pointer host metadata.artlab.xyz resolves but refuses connections; server-side check blocked by robots rules (verify)',
    '0x09233d553058c2f42ba751c87816a8e9fae7ef10': 'pointer host api.mypethooligan.com timed out from the browser; server-side check blocked by robots rules, so not confirmed dead',
    '0x913ae503153d9a335398d0785ba60a2d63ddb4e2': 'http:// pointer on somniumspace.io; the domain now resolves to a domain-parking address and timed out (verify)',
    '0x23581767a106ae21c074b2276d25e5c3e136a68b': 'tokenURI reverts on public RPCs today; the last pointer the indexer recorded (a Google Cloud Run app) still serves metadata server-side, so check the contract before calling it broken (verify)',
    '0x7ea3cca10668b8346aec0bf1844a49e995527c8b': 'FRAGILE: http:// pointer, which an https page blocks; over https the Heroku app serves the metadata and the image loads from a DigitalOcean bucket (harness fixed in v1.4)',
    '0xac2cfaf0c34af97804597a71f2e90e3632097b72': 'FRAGILE: http:// pointer; the server answers server-side and the image loads from metadata.wade.club (one web server)',
    'kt1rj6pbjhpwc3m5rw5s2nbmefwbuwbdxton': 'shared hic et nunc / Teia contract; pointers are ipfs://',
}
rows = []
for k, r in d.get('results', {}).items():
    toks = r.get('tok') or []
    info = r.get('info') or {}
    n = len(toks)
    with_uri = [t for t in toks if t.get('uri')]
    meta_ok = [t for t in toks if any(v == 'ok' for v in (t.get('meta') or {}).values())]
    art_ok = [t for t in toks if ok(t.get('art'))]
    idx_ok = [t for t in toks if ok((t.get('idx') or {}).get('art'))]
    idx_has = [t for t in toks if (t.get('idx') or {}).get('cached') or (t.get('idx') or {}).get('has')]
    via = collections.Counter((t.get('art') or {}).get('via') for t in art_ok)
    written_dead = sum(1 for t in art_ok if (t.get('art') or {}).get('via') not in ('as-written', 'inline', None) and str(t.get('uri', '')).startswith('http'))
    uri_cats = collections.Counter(t.get('uriCat') for t in with_uri if t.get('uriCat'))
    art_cats = collections.Counter(t.get('imgCat') for t in toks if t.get('imgCat'))
    prov = list((r.get('cids') or {}).values())
    orgs = sorted({w for p in prov for w in (p.get('who') or [])})
    min_prov = min([p.get('n', 0) for p in prov], default=None)
    if not prov:
        ipfs = None
    elif min_prov == 0:
        ipfs = 'not found on IPFS'
    elif set(orgs) <= {'pinata'}:
        ipfs = 'Pinata only'
    elif set(orgs) <= {'other'} and min_prov <= 4:
        ipfs = 'few unknown hosts'
    else:
        ipfs = 'several hosts'
    onchain = any(c == 'on-chain' for c in list(uri_cats) + list(art_cats))
    # contract layer state
    if not toks:
        c = 'no sample'
    elif not with_uri and not any(t.get('meta', {}).get('inline') for t in toks):
        c = 'no token pointer'
    elif art_ok and len(art_ok) >= 0.8 * n:
        c = 'works' if len(art_ok) == n else f'works ({n - len(art_ok)} of {n} failed)'
    elif art_ok:
        c = 'partly works'
    elif meta_ok:
        c = 'metadata only (art dead)'
    else:
        c = 'dead'
    # index layer state
    if not idx_has:
        i_state = 'no index copy'
    elif len(idx_ok) == len(idx_has):
        i_state = 'index copy loads'
    elif idx_ok:
        i_state = 'index copy partly loads'
    else:
        i_state = 'index copy dead'
    main_art = (art_cats.most_common(1) or [(None, 0)])[0][0]
    mutable = bool(info.get('upgradeable') or (info.get('mutators') and not info.get('freezers')))
    weak_pointer = any(k in ('web server', 'cloud bucket', 'app host', 'ipfs(dead gateway)') for k in uri_cats)
    via_indexer = sum(1 for t in toks if t.get('metaVia'))
    works = c.startswith('works')
    # bucket
    if onchain and works:
        b = 'On chain'
    elif works:
        if (main_art == 'arweave' or ipfs == 'several hosts') and not weak_pointer:
            b = 'Healthy'
        else:
            b = 'Fragile'
    elif c == 'partly works':
        b = 'Failing'
    elif c in ('dead', 'metadata only (art dead)', 'no token pointer'):
        b = 'Walking dead' if i_state == 'index copy loads' else ('Failing' if i_state == 'index copy partly loads' else 'Lost')
    else:
        b = 'Unclear'
    if c == 'no token pointer' and i_state == 'no index copy':
        b = 'Unclear'
    note = NOTES.get(r['contract'].lower(), '')
    if note.startswith('UNCLEAR:'):
        b = 'Unclear'; note = note[8:].strip()
    elif note.startswith('FRAGILE:'):
        b = 'Fragile'; c = 'works (server-side check)'; note = note[8:].strip()
    if via_indexer:
        note = (note + '; ' if note else '') + f'server blocks browser reads of its metadata, so the art address came from the indexer copy ({via_indexer} tokens)'
    if any('api.artblocks.io' in str(t.get('uri', '')) for t in toks):
        note = (note + '; ' if note else '') + "the generating script is stored on chain, but the token pointer and the rendered image come from Art Blocks' servers"
    if weak_pointer and works:
        note = (note + '; ' if note else '') + 'token pointer depends on one web server or bucket'
    rows.append({
        'chain': r['chain'], 'contract': r['contract'], 'name': r.get('name') or info.get('name'), 'source': r.get('source'), 'why': r.get('why', ''),
        'bucket': b, 'contract_layer': c, 'index_layer': i_state, 'sampled': n, 'art_loads': len(art_ok), 'index_loads': len(idx_ok),
        'pointer_types': ', '.join(f'{k}:{v}' for k, v in uri_cats.items()), 'art_types': ', '.join(f'{k}:{v}' for k, v in art_cats.items()),
        'reached_via': ', '.join(f'{k}:{v}' for k, v in via.items() if k), 'written_link_dead_but_content_alive': written_dead,
        'ipfs_hosting': ipfs, 'ipfs_hosts': ','.join(orgs), 'upgradeable': info.get('upgradeable'), 'uri_setters': ','.join(info.get('mutators') or []),
        'freeze_fn': ','.join(info.get('freezers') or []), 'owner_can_repoint': mutable, 'total_tokens': r.get('total') or info.get('totalSupply'),
        'example_pointer': (with_uri[0]['uri'] if with_uri else '')[:160], 'example_art': ((toks[0].get('img') or toks[0].get('anim') or '') if toks else '')[:160],
        'notes': note,
        'failure_example': next(((t.get('art') or {}).get('detail') or '' for t in toks if t.get('art') and not ok(t.get('art'))), '')[:160],
    })

order = ['Lost', 'Failing', 'Walking dead', 'Fragile', 'Unclear', 'Healthy', 'On chain']
rows.sort(key=lambda x: (order.index(x['bucket']) if x['bucket'] in order else 99, x['chain'], str(x['name'])))
json.dump(rows, open(base + '-classified.json', 'w'), indent=1)
if rows:
    with open(base + '-classified.csv', 'w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
print('triage', len(tri), 'deep', len(rows))
print('triage pointer types', collections.Counter(c for t in tri for c in (t.get('cats') or ['?'])).most_common())
print('buckets', collections.Counter(r['bucket'] for r in rows).most_common())
for r in rows:
    print(f"  {r['bucket']:13} {r['chain']:8} {str(r['name'])[:30]:30} contract={r['contract_layer']:24} index={r['index_layer']:22} ipfs={r['ipfs_hosting']}")
