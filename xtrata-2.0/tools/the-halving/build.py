#!/usr/bin/env python3
"""The Halving build: game parts -> game.html -> pack.json, plus the test page, vendor three.js and art/sources.json.

Run from anywhere:  python3 tools/the-halving/build.py      (run build_records.py and model/build_model.py first if their inputs changed)
Inputs : tools/the-halving/src (game script parts, markup, css, the verbatim engine and LAYR adapter, the test page)
         tools/the-halving/art/records.json (the real records the reels are set from) and art/bitcoin-mark.svg
         tools/the-halving/model/the-halving-model.json (built by model/build_model.py)
Outputs: public/casino-machines/the-halving/{index.html,pack.json,vendor/three.js,art/*,INTEGRATION.md}
No casino file is read or written.
"""
import json, gzip, base64, os, shutil, datetime
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))
PUB = os.environ.get('HALVING_OUT') or os.path.join(ROOT, 'public', 'casino-machines', 'the-halving')
S = lambda *p: os.path.join(HERE, 'src', *p)
rd = lambda p: open(p, encoding='utf-8').read()
for d in ('vendor', 'art', os.path.join('art', 'cabinet')): os.makedirs(os.path.join(PUB, d), exist_ok=True)

records = json.load(open(os.path.join(HERE, 'art', 'records.json'), encoding='utf-8'))
mark = rd(os.path.join(HERE, 'art', 'bitcoin-mark.svg'))
import copy; game_records = copy.deepcopy(records); game_records['logo'] = 'data:image/svg+xml;base64,' + base64.b64encode(mark.encode()).decode()
for m in game_records['messages']: m.pop('hex', None)   # the decoded text ships in the game; the raw hex stays in records.json
css = rd(S('game.css')).strip(); body = rd(S('body.html')).strip()
parts = ['p1_head', 'p2_ui', 'p3_art', 'p4_live', 'p5_screen', 'p6_scenes', 'p7_flow', 'p8_draw', 'p9_panels', 'p10_boot']
game = '\n'.join(rd(S('game', p + '.js')).strip('\n') for p in parts)
head = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0b0c0e"><meta name="color-scheme" content="dark"><title>The Halving — ParallaX Casino machine</title><meta name="description" content="The Halving: a ParallaX Casino fruit machine, a brutalist mining rig for Bitcoin\'s halvings and the 21 million cap. Block Fortune v2 engine, 94.38% RTP, play-money LAYR.">' f'<style>{css}</style></head><body>')
html = '\n'.join([head, body, '<script>' + rd(S('layr-adapter.js')) + '</script>', '<script>' + rd(S('guard.js')).strip() + '</script>', '<script>' + rd(S('bf-engine.js')) + '</script>',
    '<script>window.HALVING_RECORDS=' + json.dumps(game_records, separators=(',', ':'), ensure_ascii=False) + ';</script>', '<script>' + game + '</script>', '</body></html>'])
open(os.path.join(HERE, 'game.html'), 'w', encoding='utf-8').write(html)

enc = lambda b: base64.b64encode(gzip.compress(b, 9, mtime=0)).decode()
model = json.load(open(os.path.join(HERE, 'model', 'the-halving-model.json')))
pack = {'name': 'The Halving', 'description': "Bitcoin's halvings · a brutalist mining rig", 'color': '#1b1d20', 'accent': '#ffd23f',
        'model': enc(json.dumps(model, separators=(',', ':')).encode()), 'game': enc(html.encode('utf-8')), 'css': css}
json.dump(pack, open(os.path.join(PUB, 'pack.json'), 'w'), separators=(',', ':'))
shutil.copy(S('page.html'), os.path.join(PUB, 'index.html'))
three = os.environ.get('HALVING_THREE') or os.path.join(ROOT, 'tools', 'snow-crash', 'vendor', 'three.js')
shutil.copy(three, os.path.join(PUB, 'vendor', 'three.js'))
shutil.copy(os.path.join(HERE, 'art', 'records.json'), os.path.join(PUB, 'art', 'records.json'))
shutil.copy(os.path.join(HERE, 'art', 'bitcoin-mark.svg'), os.path.join(PUB, 'art', 'bitcoin-mark.svg'))
cab = os.path.join(HERE, 'art', 'cabinet')
if os.path.isdir(cab):
    for f in os.listdir(cab): shutil.copy(os.path.join(cab, f), os.path.join(PUB, 'art', 'cabinet', f))
for doc in ('INTEGRATION.md', 'QA.md'):
    if os.path.exists(os.path.join(HERE, doc)): shutil.copy(os.path.join(HERE, doc), os.path.join(PUB, doc))

# ---- art/sources.json: every record's source, and the logos that still need permission
src = json.load(open(os.path.join(HERE, 'sources.template.json'), encoding='utf-8'))
src['generated'] = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ')
src['symbols']['cherry']['items'], src['symbols']['lemon']['items'], src['symbols']['chip']['items'], src['symbols']['block']['items'] = (
    [{'height': h['height'], 'hash': h['hash'], 'date': h['date'], 'pool': h['pool'], 'coinbase': h['coinbase'], 'source': h['source']}] for h in records['halvings'])
src['symbols']['vault']['items'] = [{'height': m['height'], 'hash': m['hash'], 'text': m['text'], 'coinbaseHex': m['hex'], 'pool': m['pool'], 'source': m['source']} for m in records['messages']]
src['symbols']['chain']['items'] = [{'height': b['height'], 'hash': b['hash'], 'pool': b['pool'], 'source': f"https://mempool.space/block/{b['hash']}"} for b in records['recent']]
json.dump(src, open(os.path.join(PUB, 'art', 'sources.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('game.html', len(html), 'bytes | pack.json', os.path.getsize(os.path.join(PUB, 'pack.json')), 'bytes | messages', len(records['messages']), '| recent', len(records['recent']))
