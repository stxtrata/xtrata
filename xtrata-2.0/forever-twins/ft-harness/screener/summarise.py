#!/usr/bin/env python3
"""Print a one-line-per-contract summary of screen_sources.py output."""
import json, sys
rows = json.load(open(sys.argv[1]))
for r in rows:
    lists = ','.join(r['bounded_owner_lists']) or '-'
    print(f"{r['contract']:24} owner:{r['get_owner_kind']:9} lists:{lists:10} "
          f"unguarded:{','.join(r['unguarded_non_transfer_movers']) or '-':18} "
          f"listing-gated:{','.join(r['listing_gated_movers']) or '-':12} "
          f"ext-calls-in-transfer:{len(r['transfer_external_calls'])}  -> {r['screen_verdict']}")
