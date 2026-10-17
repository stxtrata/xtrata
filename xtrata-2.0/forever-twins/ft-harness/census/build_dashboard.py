#!/usr/bin/env python3
"""Build the census dashboard HTML from the classified JSON."""
import json, sys, collections, html

rows = json.load(open(sys.argv[1]))
out = sys.argv[2]
run_date = sys.argv[3] if len(sys.argv) > 3 else '13 Oct 2026'

ORDER = ['On chain', 'Healthy', 'Fragile', 'Marketplace copy broken', 'Walking dead', 'Failing', 'Lost', 'Unclear', 'Not artwork']
counts = collections.Counter(r['bucket'] for r in rows)
vol = collections.defaultdict(int)
for r in rows:
    vol[r['bucket']] += r.get('volume_stx') or 0
art_rows = [r for r in rows if r['bucket'] != 'Not artwork']
n_art = len(art_rows)
pinata_only = sum(1 for r in art_rows if r['ipfs_durability'] == 'Pinata only')
gamma_pin = sum(1 for r in art_rows if r['gamma_pinata'])
contract_no_art = sum(1 for r in art_rows if r['bucket'] in ('Walking dead', 'Failing', 'Lost'))
changeable = sum(1 for r in art_rows if r['uri_changeable'])
fixable = sum(1 for r in art_rows if r['bucket'] in ('Walking dead', 'Failing', 'Lost') and r['uri_changeable'])
stacksart = sum(1 for r in art_rows if 'stacksart.com' in (r['art_storage'] or ''))
summary = {
    'n': len(rows), 'n_art': n_art, 'counts': {k: counts.get(k, 0) for k in ORDER}, 'vol': {k: vol.get(k, 0) for k in ORDER},
    'pinata_only': pinata_only, 'gamma_pin': gamma_pin, 'contract_no_art': contract_no_art, 'changeable': changeable, 'fixable': fixable, 'stacksart': stacksart,
    'total_vol': sum(r.get('volume_stx') or 0 for r in rows),
}
slim = [{k: r.get(k) for k in ('rank', 'name', 'id', 'volume_stx', 'year', 'bucket', 'contract_state', 'marketplace_state', 'marketplace_ok',
                                 'art_storage', 'ipfs_durability', 'uri_changeable', 'gamma_pinata', 'notes', 'uri_example', 'img_example', 'market_example', 'works_via')} for r in rows]
tpl = open(__file__.replace('build_dashboard.py', 'dashboard.tpl.html')).read()
page = tpl.replace('/*__DATA__*/null', json.dumps({'rows': slim, 'summary': summary}, separators=(',', ':'))).replace('__RUNDATE__', html.escape(run_date))
open(out, 'w').write(page)
print('wrote', out, len(page), 'bytes', summary['counts'])
