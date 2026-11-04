#!/usr/bin/env python3
"""The Stack build: game parts -> game.html -> pack.json, plus the test page, vendor three.js, art/ and art/sources.json.

Run from anywhere:  python3 tools/the-stack/build.py      (run model/build_model.py first if the cabinet changed)
Inputs : tools/the-stack/src (game script parts, markup, css, the verbatim engine and LAYR adapter, the test page)
         tools/the-stack/art/records.json (the real chain records), art/logos/*.svg (official logo files), art/bitcoin-mark.svg
         tools/the-stack/logos.json (where each logo file came from), tools/the-stack/model/the-stack-model.json
Outputs: public/casino-machines/the-stack/{index.html,pack.json,vendor/three.js,art/*,INTEGRATION.md,QA.md}
No casino file is read or written.
"""
import json, gzip, base64, os, shutil, datetime, copy
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))
PUB = os.environ.get('STACK_OUT') or os.path.join(ROOT, 'public', 'casino-machines', 'the-stack')
S = lambda *p: os.path.join(HERE, 'src', *p)
rd = lambda p: open(p, encoding='utf-8').read()
b64svg = lambda p: 'data:image/svg+xml;base64,' + base64.b64encode(open(p, 'rb').read()).decode()
for d in ('vendor', 'art', os.path.join('art', 'cabinet'), os.path.join('art', 'logos')): os.makedirs(os.path.join(PUB, d), exist_ok=True)

records = json.load(open(os.path.join(HERE, 'art', 'records.json'), encoding='utf-8'))
logos = json.load(open(os.path.join(HERE, 'logos.json'), encoding='utf-8'))
game_records = copy.deepcopy(records)
game_records['logo'] = b64svg(os.path.join(HERE, 'art', 'bitcoin-mark.svg'))
game_records['logos'] = {k: b64svg(os.path.join(HERE, v['file'])) for k, v in logos.items()}   # bundled as data URIs: the reels show real logos offline
game_records['logoInfo'] = {k: {'file': v['from'], 'url': v['url'], 'permission': v['permission']} for k, v in logos.items()}
css = rd(S('game.css')).strip(); body = rd(S('body.html')).strip()
parts = ['p1_head', 'p2_ui', 'p3_art', 'p4_live', 'p5_screen', 'p6_scenes', 'p7_flow', 'p8_draw', 'p9_panels', 'p10_boot']
game = '\n'.join(rd(S('game', p + '.js')).strip('\n') for p in parts)
head = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#07070b"><meta name="color-scheme" content="dark"><title>The Stack — ParallaX Casino machine</title><meta name="description" content="The Stack: a ParallaX Casino fruit machine about Stacks today: the wallets, the apps, sBTC, stacking and fast blocks. Block Fortune v2 engine, 94.38% RTP, play-money LAYR.">' f'<style>{css}</style></head><body>')
html = '\n'.join([head, body, '<script>' + rd(S('layr-adapter.js')) + '</script>', '<script>' + rd(S('guard.js')).strip() + '</script>', '<script>' + rd(S('bf-engine.js')) + '</script>',
    '<script>window.STACK_RECORDS=' + json.dumps(game_records, separators=(',', ':'), ensure_ascii=False) + ';</script>', '<script>' + game + '</script>', '</body></html>'])
open(os.path.join(HERE, 'game.html'), 'w', encoding='utf-8').write(html)

enc = lambda b: base64.b64encode(gzip.compress(b, 9, mtime=0)).decode()
model = json.load(open(os.path.join(HERE, 'model', 'the-stack-model.json')))
pack = {'name': 'The Stack', 'description': 'Stacks today · sBTC, stacking and fast blocks', 'color': '#0b0b12', 'accent': '#fc6432',
        'model': enc(json.dumps(model, separators=(',', ':')).encode()), 'game': enc(html.encode('utf-8')), 'css': css}
json.dump(pack, open(os.path.join(PUB, 'pack.json'), 'w'), separators=(',', ':'))
shutil.copy(S('page.html'), os.path.join(PUB, 'index.html'))
three = os.environ.get('STACK_THREE') or os.path.join(ROOT, 'tools', 'snow-crash', 'vendor', 'three.js')
if not os.path.exists(three): three = os.path.join(ROOT, 'public', 'casino-machines', 'the-halving', 'vendor', 'three.js')
shutil.copy(three, os.path.join(PUB, 'vendor', 'three.js'))
for f in ('records.json', 'bitcoin-mark.svg'): shutil.copy(os.path.join(HERE, 'art', f), os.path.join(PUB, 'art', f))
for f in os.listdir(os.path.join(HERE, 'art', 'logos')): shutil.copy(os.path.join(HERE, 'art', 'logos', f), os.path.join(PUB, 'art', 'logos', f))
cab = os.path.join(HERE, 'art', 'cabinet')
want = set(json.load(open(os.path.join(HERE, 'model', 'cabinet-textures.json')))) if os.path.exists(os.path.join(HERE, 'model', 'cabinet-textures.json')) else None
for f in os.listdir(cab):
    if want is None or f[:-4] in want: shutil.copy(os.path.join(cab, f), os.path.join(PUB, 'art', 'cabinet', f))
for doc in ('INTEGRATION.md', 'QA.md'):
    if os.path.exists(os.path.join(HERE, doc)): shutil.copy(os.path.join(HERE, doc), os.path.join(PUB, doc))

# ---- art/sources.json: every image's and record's source, and the logos that still need permission
src = json.load(open(os.path.join(HERE, 'sources.template.json'), encoding='utf-8'))
src['generated'] = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ')
for slot, sym in src['symbols'].items():
    if sym.get('logo'):
        L = logos[sym['logo']]; sym['file'] = L['file']; sym['sha256'] = L['sha256']; sym['source'] = L['from']; sym['project'] = L['url']; sym['permission'] = L['permission']
        if L.get('alt'): sym['alternative'] = L['alt']
src['symbols']['scatter']['items'] = [{'cycle': c['cycle'], 'startBlock': c['startBlock'], 'stackedUstx': c['stackedUstx'], 'signers': c['signers'], 'source': c['source']} for c in records['cycles']]
src['symbols']['scatter']['pox'] = records['pox']
src['symbols']['chain']['items'] = [{'height': b['height'], 'hash': b['hash'], 'burn': b['burn'], 'time': b['time'], 'source': b['source']} for b in records['blocks']]
src['symbols']['chain']['anchors'] = records['burn']
src['logosNeedingPermission'] = [{'logo': L['name'], 'where': 'reels' + (' · marquee · topper slabs' if k == 'stacks' else ''), 'ask': L['url'], 'status': 'not yet asked'} for k, L in logos.items()]
src['readVia'] = records.get('readVia')
json.dump(src, open(os.path.join(PUB, 'art', 'sources.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('game.html', len(html), 'bytes | pack.json', os.path.getsize(os.path.join(PUB, 'pack.json')), 'bytes | blocks', len(records['blocks']), '| cycles', len(records['cycles']))
