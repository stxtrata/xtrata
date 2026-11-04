#!/usr/bin/env python3
"""Builds art/manifest.json from the two asset lists in art/data/ (real Counterparty asset names, in directory order) and
checks the series/card numbering against independent Series/Card references (the anchors below). Usage: python3 tools/make-manifest.py"""
import json, re, os, sys
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rare = [l.strip() for l in open(f'{HERE}/art/data/rare-pepe-assets.txt') if l.strip()]
fake_all = [l.strip() for l in open(f'{HERE}/art/data/fake-rares-assets.txt') if l.strip()]
fake = [f for f in fake_all if re.fullmatch(r'[A-Z]{3,13}', f)]   # named assets that fit a card face (numeric A… assets and dotted sub-assets are left out)
SERIES_SIZE = 50
def sc(i): return i // SERIES_SIZE + 1, i % SERIES_SIZE + 1
# Independent references: "ASSET | Series S Card C" titles of the Rare Pepe collection listed on explorer.reservoir.tools (read 1 Nov 2026).
ANCHORS = {'RAREPEPE':(1,1),'PEPECASH':(1,11),'RPEPELIGHTER':(4,38),'GUARDSPEPE':(5,3),'RAREPEPENEWS':(6,46),'PEPEMOON':(7,9),'PEPETHUGLIFE':(7,17),'SIXTYSIXPEPE':(7,24),'MASTROPEPE':(8,37),'THEPEPE':(9,4),'PEPEDEX':(9,24),'PEPEREPUBLIC':(10,1),'LIKEPEPEBRO':(10,24),'PEPEMEETUPBK':(11,9),'CSAT':(11,29),'MINIONPEPE':(13,12),'RICHPEPE':(14,11),'PEPEFREEDOM':(15,5),'PEPEPAMPERS':(15,9),'MEDICINEPEPE':(16,34),'PEPESPIDER':(17,20),'SPIRITPEPE':(18,15),'PEPEZENMSTR':(19,37),'NEUROPEPE':(20,24),'PEPELETTERA':(26,22),'SODAPEPENSKI':(27,9),'PEPEGRAM':(27,17),'PEPESAILORV':(27,24),'PEPESINLOVE':(32,8),'CLUBSPEPE':(32,37),'CERSEIPEPE':(32,48)}
bad = [(a, sc(rare.index(a)), want) for a, want in ANCHORS.items() if sc(rare.index(a)) != want]
if bad: sys.exit(f'Series/card numbering disagrees with {len(bad)} anchors: {bad}')
groups = {'S1': (1, 1), 'S2-12': (2, 12), 'S13-25': (13, 25), 'S26-36': (26, 36)}
count = {g: sum(1 for i in range(len(rare)) if lo <= sc(i)[0] <= hi) for g, (lo, hi) in groups.items()}
out = {'generated': '2026-11-01',
  'note': 'Real Counterparty asset names. Rare Pepe names are in Rare Pepe Directory order: series = floor(index divided by 50) + 1, card = (index mod 50) + 1 (checked against %d independent Series/Card references; Series 36 holds the last %d cards).' % (len(ANCHORS), len(rare) - 35 * SERIES_SIZE),
  'rare': {'count': len(rare), 'seriesSize': SERIES_SIZE, 'groups': count, 'names': rare},
  'fake': {'count': len(fake), 'listed': len(fake_all), 'names': fake},
  'anchors': {a: list(v) for a, v in ANCHORS.items()}}
json.dump(out, open(f'{HERE}/art/manifest.json', 'w'), indent=0, separators=(',', ':'))
print('rare', len(rare), count, '| fake', len(fake), 'of', len(fake_all), '| anchors OK:', len(ANCHORS))
