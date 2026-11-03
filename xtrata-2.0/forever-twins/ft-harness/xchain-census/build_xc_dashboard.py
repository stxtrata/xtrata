#!/usr/bin/env python3
"""Build the cross-chain census dashboard: python3 build_xc_dashboard.py <base> <out.html> [run date]
<base> is the dump path without .json; reads <base>-classified.json and <base>-triage.csv."""
import json, sys, csv, collections, html, os
base, out = sys.argv[1], sys.argv[2]
run_date = sys.argv[3] if len(sys.argv) > 3 else '16 Oct 2026'
rows = json.load(open(base + '-classified.json'))
tri = list(csv.DictReader(open(base + '-triage.csv')))
ptr = collections.Counter()
for t in tri:
    cats = [c for c in t['pointer_types'].split(',') if c] or ['?']
    # one type per collection: the weakest it uses
    rank = ['ipfs(dead gateway)', 'app host', 'cloud bucket', 'web server', 'ipfs(gateway)', 'other', 'ipfs', 'arweave', 'on-chain', '?']
    ptr[min(cats, key=lambda c: rank.index(c) if c in rank else 5)] += 1
evm = [t for t in tri if t['chain'] != 'tezos']
dead = [r for r in rows if r['bucket'] in ('Walking dead', 'Lost', 'Failing')]
for r in rows:
    r['art_main'] = (r['art_types'].split(':')[0] if r['art_types'] else '')
S = {
    'n': len(rows), 'ntri': len(tri), 'counts': dict(collections.Counter(r['bucket'] for r in rows)), 'ptr': dict(ptr),
    'dead': len(dead), 'dead_repoint': sum(bool(r['owner_can_repoint']) for r in dead),
    'dns_gone': sum('no longer exists in DNS' in (r['notes'] or '') for r in rows),
    'weak': sum(any(k in t['pointer_types'] for k in ('web server', 'cloud bucket', 'app host')) for t in tri),
    'evm': len(evm), 'setters': sum(bool(t['uri_setters']) for t in evm), 'freeze': sum(bool(t['freeze_fn']) for t in evm), 'upg': sum(t['upgradeable'] == 'True' for t in evm),
}
keep = ('chain', 'contract', 'name', 'source', 'why', 'bucket', 'contract_layer', 'index_layer', 'sampled', 'art_loads', 'index_loads', 'art_main', 'ipfs_hosting',
        'upgradeable', 'uri_setters', 'freeze_fn', 'owner_can_repoint', 'example_pointer', 'example_art', 'notes', 'failure_example')
slim = [{k: r.get(k) for k in keep} for r in rows]
tpl = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'xc-dashboard.tpl.html')).read()
page = (tpl.replace('/*__DATA__*/null', json.dumps({'rows': slim, 'summary': S}, separators=(',', ':')))
        .replace('__RUNDATE__', html.escape(run_date)).replace('__NTRI__', str(len(tri))).replace('__NDEEP__', str(len(rows))))
open(out, 'w').write(page)
print('wrote', out, len(page), S)
