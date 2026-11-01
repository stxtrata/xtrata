#!/usr/bin/env python3
"""Snow Crash build: game parts -> game.html -> pack.json, plus the test page, vendor three.js and art/sources.json.

Run from anywhere:  python3 tools/snow-crash/build.py
Inputs : tools/snow-crash/src (game script parts, markup, css, the verbatim engine and LAYR adapter, the test page)
         tools/snow-crash/model/snow-crash-model.json (built by model/build_model.py)
         public/casino-machines/snow-crash/art/snow-crash-art.json (bundled punks; made by the art export)
         tools/snow-crash/art/logos/this-is-number-one.svg
Outputs: public/casino-machines/snow-crash/{index.html,pack.json,vendor/three.js,art/sources.json}
No casino file is read or written.
"""
import json, gzip, base64, os, shutil, datetime
HERE = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.normpath(os.path.join(HERE, '..', '..', 'public', 'casino-machines', 'snow-crash'))
S = lambda *p: os.path.join(HERE, 'src', *p)
rd = lambda p: open(p, encoding='utf-8').read()
os.makedirs(os.path.join(PUB, 'vendor'), exist_ok=True); os.makedirs(os.path.join(PUB, 'art'), exist_ok=True)

# ---- art bundle: 108 real punks interleaved by tier so the first reels show a mix
art = json.load(open(os.path.join(PUB, 'art', 'snow-crash-art.json')))
bytier = {}
for k, v in sorted(art['picks'].items(), key=lambda x: int(x[0])): bytier.setdefault(v['tier'], []).append([int(k), v['tier'], v['uri']])
mixed = [bytier[t][i] for i in range(max(map(len, bytier.values()))) for t in ['4', '3', '2', '1', 'R', 'L'] if i < len(bytier.get(t, []))]
SC_ART = {'items': mixed, 'tierString': art['tierString'], 'tierCounts': art['tierCounts'], 'contract': art['contract'], 'collectionId': art['collectionId'], 'lastTokenId': art['lastTokenId'], 'tokensWithMetadata': art['tokensWithMetadata'], 'tokens404': art['tokens404'], 'generated': art['generated']}
svg = open(os.path.join(HERE, 'art', 'logos', 'this-is-number-one.svg'), 'rb').read()
SC_LOGOS = {'numberOneUri': 'data:image/svg+xml;base64,' + base64.b64encode(svg).decode()}

# ---- game.html
css = rd(S('game.css')).strip(); body = rd(S('body.html')).strip()
parts = ['p1_head', 'v_helpers', 'v_infinity', 'v_net1', 'v_net2', 'v_net3', 'p2_ui', 'p3_art', 'p4_live', 'p5_screen', 'p6_scenes', 'p7_flow', 'p8_draw', 'p9_panels', 'p10_boot']
game = '\n'.join(rd(S('game', p + '.js')).strip('\n') for p in parts)
head = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#07040d"><meta name="color-scheme" content="dark"><title>Snow Crash — ParallaX Casino machine</title><meta name="description" content="Snow Crash: a ParallaX Casino fruit machine for Crash Punks, the 2021 Stacks NFT collection by grace.btc. Block Fortune v2 engine, 94.38% RTP, play-money LAYR.">' f'<style>{css}</style></head><body>')
html = '\n'.join([head, body, '<script>' + rd(S('layr-adapter.js')) + '</script>', '<script>' + rd(S('guard.js')).strip() + '</script>', '<script>' + rd(S('bf-engine.js')) + '</script>',
    '<script>window.SC_LOGOS=' + json.dumps(SC_LOGOS, separators=(',', ':')) + ';</script>', '<script>window.SC_ART=' + json.dumps(SC_ART, separators=(',', ':')) + ';</script>', '<script>' + game + '</script>', '</body></html>'])

# ---- pack.json
enc = lambda b: base64.b64encode(gzip.compress(b, 9, mtime=0)).decode()
model = json.load(open(os.path.join(HERE, 'model', 'snow-crash-model.json')))
pack = {'name': 'Snow Crash', 'description': 'Crash Punks · six rarity tiers', 'color': '#1c0d2b', 'accent': '#ff3ea5',
        'model': enc(json.dumps(model, separators=(',', ':')).encode()), 'game': enc(html.encode('utf-8')), 'css': css}
json.dump(pack, open(os.path.join(PUB, 'pack.json'), 'w'), separators=(',', ':'))
shutil.copy(S('page.html'), os.path.join(PUB, 'index.html')); shutil.copy(os.path.join(HERE, 'vendor', 'three.js'), os.path.join(PUB, 'vendor', 'three.js'))

# ---- art/sources.json
slot = {'4': 'cherry', '3': 'lemon', '2': 'chip', '1': 'block', 'R': 'artifact', 'L': 'bitcoin'}
tname = {'4': 'Tier IV (cyan frame)', '3': 'Tier III (green frame)', '2': 'Tier II (violet frame)', '1': 'Tier I (red frame)', 'R': 'Rare (silver frame)', 'L': 'Legendary (gold frame, jackpot symbol)'}
cid = 'Qmb84UcaMr1MUwNbYBnXWHM3kEaDcYrKuPWwyRLVTNKELC'
punks = [{'tokenId': int(k), 'tier': v['tier'], 'tierName': tname[v['tier']], 'engineSlot': slot[v['tier']], 'rarityScore': v['score'], 'traits': v['traits'],
          'metadata': f"https://api.hiro.so/metadata/v1/nft/{art['contract']}/{k}",
          'image': {'ipfs': v['ipfs'], 'resolvedVia': f"https://images.gamma.io/cdn-cgi/image/width=160,height=160/https://stxnft.mypinata.cloud/ipfs/{cid}/{k}.png", 'bundledAs': 'webp, 160px, data URI inside art/snow-crash-art.json and the game'}}
         for k, v in sorted(art['picks'].items(), key=lambda x: (x[1]['tier'], int(x[0])))]
src = json.load(open(os.path.join(HERE, 'sources.template.json')))
src.update({'generated': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ'), 'punkImageCount': len(punks), 'punks': punks})
src['collection'].update({'contract': art['contract'], 'collectionId': art['collectionId'], 'lastTokenId': art['lastTokenId'], 'tokensWithMetadata': art['tokensWithMetadata'], 'tokensWithoutMetadata404': art['tokens404']})
src['tiers'].update({'counts': art['tierCounts'], 'metadataSource': art['metadataSource'], 'imageSource': art['imageSource']})
json.dump(src, open(os.path.join(PUB, 'art', 'sources.json'), 'w'), indent=1)
print('game.html', len(html), 'bytes | pack.json', os.path.getsize(os.path.join(PUB, 'pack.json')), 'bytes |', len(punks), 'punks | items', len(mixed))
