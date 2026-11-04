#!/usr/bin/env python3
"""Nine Lives build: game parts -> game.html -> pack.json, plus the test page, vendor three.js and art/sources.json.

Run from anywhere:  python3 tools/nine-lives/build.py
Inputs : tools/nine-lives/src (game script parts, markup, css, the verbatim Block Fortune v2 engine and LAYR adapter, the test page)
         tools/nine-lives/model/nine-lives-model.json (built by model/build_model.py)
         tools/nine-lives/art/{twin-items.json, tierString.txt, twins.json, logos.json, logos/leo-token-144.webp.datauri}
Outputs: public/casino-machines/nine-lives/{index.html,pack.json,vendor/three.js,art/sources.json,art/nine-lives-art.json}
No casino file is read or written.
"""
import json, gzip, base64, os, shutil, datetime
HERE = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.normpath(os.path.join(HERE, '..', '..', 'public', 'casino-machines', 'nine-lives'))
S = lambda *p: os.path.join(HERE, 'src', *p)
A = lambda *p: os.path.join(HERE, 'art', *p)
rd = lambda p: open(p, encoding='utf-8').read()
os.makedirs(os.path.join(PUB, 'vendor'), exist_ok=True); os.makedirs(os.path.join(PUB, 'art'), exist_ok=True)

# ---- art bundle: the 101 Forever Twins that existed on 2 Nov 2026, interleaved by tier so the first reels show a mix
GENERATED = '2026-11-02'
tier_string = rd(A('tierString.txt')).strip(); assert len(tier_string) == 10000
twin_items = json.load(open(A('twin-items.json')))          # [[tokenId, xtrataId, dataUri], ...]
bytier = {}
for it in twin_items: bytier.setdefault(tier_string[it[0] - 1], []).append(it)
order = ['1', '2', '3', 'S', 'G']
mixed = [bytier[t][i] for i in range(max(map(len, bytier.values()))) for t in order if i < len(bytier.get(t, []))]
assert len(mixed) == len(twin_items)
counts = {k: tier_string.count(k) for k in order}
NL_ART = {'items': mixed, 'tierString': tier_string, 'tierCounts': counts, 'contract': 'SP2N959SER36FZ5QT1CX9BR63W3E8X35WQCMBYYWC.leo-cats', 'twinCount': len(twin_items), 'generated': GENERATED}
logos = json.load(open(A('logos.json')))
NL_LOGOS = {'leo': rd(A('logos', 'leo-token-144.webp.datauri')).strip(), 'fakfun': logos['fakfun'], 'foreverTwin': logos['foreverTwin']}
json.dump(NL_ART, open(os.path.join(PUB, 'art', 'nine-lives-art.json'), 'w'), separators=(',', ':'))

# ---- game.html
css = rd(S('game.css')).strip(); body = rd(S('body.html')).strip()
parts = ['p1_head', 'v_helpers', 'v_infinity', 'v_net1', 'v_net2', 'v_net3', 'p2_ui', 'p3_art', 'p4_live', 'p5_screen', 'p6_scenes', 'p7_flow', 'p8_draw', 'p9_panels', 'p10_boot']
game = '\n'.join(rd(S('game', p + '.js')).strip('\n') for p in parts)
head = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#050a18"><meta name="color-scheme" content="dark"><title>Nine Lives — ParallaX Casino machine</title><meta name="description" content="Nine Lives: a ParallaX Casino fruit machine for LEO Cats, the 10,000-cat Stacks collection, and $LEO. Block Fortune v2 engine, 94.38% RTP, play-money LAYR.">' f'<style>{css}</style></head><body>')
html = '\n'.join([head, body, '<script>' + rd(S('layr-adapter.js')) + '</script>', '<script>' + rd(S('guard.js')).strip() + '</script>', '<script>' + rd(S('bf-engine.js')) + '</script>',
    '<script>window.NL_LOGOS=' + json.dumps(NL_LOGOS, separators=(',', ':')) + ';</script>', '<script>window.NL_ART=' + json.dumps(NL_ART, separators=(',', ':')) + ';</script>', '<script>' + game + '</script>', '</body></html>'])

# ---- pack.json
enc = lambda b: base64.b64encode(gzip.compress(b, 9, mtime=0)).decode()
model = json.load(open(os.path.join(HERE, 'model', 'nine-lives-model.json')))
pack = {'name': 'Nine Lives', 'description': 'LEO Cats · $LEO · Forever Twins', 'color': '#0a1530', 'accent': '#12b5a6',
        'model': enc(json.dumps(model, separators=(',', ':')).encode()), 'game': enc(html.encode('utf-8')), 'css': css}
json.dump(pack, open(os.path.join(PUB, 'pack.json'), 'w'), separators=(',', ':'))
shutil.copy(S('page.html'), os.path.join(PUB, 'index.html')); shutil.copy(os.path.join(HERE, 'vendor', 'three.js'), os.path.join(PUB, 'vendor', 'three.js'))

# ---- art/sources.json
slot = {'1': 'lemon', '2': 'chip', '3': 'block', 'S': 'artifact', 'G': 'bitcoin'}
tname = {'1': 'Tier III (teal frame)', '2': 'Tier II (blue frame)', '3': 'Tier I (violet frame)', 'S': 'Silver (silver frame)', 'G': 'Gold (gold frame, jackpot symbol)'}
twins = json.load(open(A('twins.json')))
cats = [{'tokenId': it[0], 'xtrataId': it[1], 'tier': tier_string[it[0] - 1], 'tierName': tname[tier_string[it[0] - 1]], 'engineSlot': slot[tier_string[it[0] - 1]],
         'tokenUri': f"https://api.hiro.so/metadata/v1/nft/{NL_ART['contract']}/{it[0]}", 'inscriptionTx': twins.get(str(it[0]), {}).get('tx'),
         'image': {'twinArt': f"https://xtrata.xyz/inscription/mainnet/SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X/xtrata-v3-2-3/{it[1]}", 'bundledAs': 'webp data URI inside art/nine-lives-art.json and the game'}}
        for it in sorted(twin_items, key=lambda x: (order.index(tier_string[x[0] - 1]), x[0]))]
src = json.load(open(os.path.join(HERE, 'sources.template.json')))
src.update({'generated': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ'), 'twinSnapshot': GENERATED, 'twinImageCount': len(cats), 'twins': cats})
json.dump(src, open(os.path.join(PUB, 'art', 'sources.json'), 'w'), indent=1)
print('game.html', len(html), 'bytes | pack.json', os.path.getsize(os.path.join(PUB, 'pack.json')), 'bytes |', len(cats), 'twins | items', len(mixed))
