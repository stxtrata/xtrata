#!/usr/bin/env python3
"""Who Is Satoshi? build: game parts -> game.html -> pack.json, plus the test page, vendor three.js and art/sources.json.

Run from anywhere:  python3 tools/who-is-satoshi/build.py      (run model/build_model.py first if the cabinet changed)
Inputs : tools/who-is-satoshi/src (game script parts, markup, css, the verbatim engine and LAYR adapter, the test page)
         tools/who-is-satoshi/art/records.json (the real records the reels are set from)
         tools/who-is-satoshi/art/prints/*.jpg (Jim's pop-art prints of the people, cut from art/prints/source-grid.jpg)
         tools/who-is-satoshi/model/who-is-satoshi-model.json (built by model/build_model.py)
Outputs: public/casino-machines/who-is-satoshi/{index.html,pack.json,vendor/three.js,art/*,INTEGRATION.md}
No casino file is read or written.
"""
import json, gzip, base64, os, shutil, datetime
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))
PUB = os.path.join(ROOT, 'public', 'casino-machines', 'who-is-satoshi')
S = lambda *p: os.path.join(HERE, 'src', *p)
rd = lambda p: open(p, encoding='utf-8').read()
for d in ('vendor', 'art', os.path.join('art', 'cabinet')): os.makedirs(os.path.join(PUB, d), exist_ok=True)

records = json.load(open(os.path.join(HERE, 'art', 'records.json')))
css = rd(S('game.css')).strip(); body = rd(S('body.html')).strip()
parts = ['p1_head', 'p2_ui', 'p3_art', 'p4_live', 'p5_screen', 'p6_scenes', 'p7_flow', 'p8_draw', 'p9_panels', 'p10_boot']
game = '\n'.join(rd(S('game', p + '.js')).strip('\n') for p in parts)
head = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0c0a08"><meta name="color-scheme" content="dark"><title>Who Is Satoshi? — ParallaX Casino machine</title><meta name="description" content="Who Is Satoshi?: a ParallaX Casino fruit machine set in a noir detective office around Bitcoin\'s great mystery. Block Fortune v2 engine, 94.38% RTP, play-money LAYR.">' f'<style>{css}</style></head><body>')
# Jim's pop-art prints of the people (art/prints, cut from his own grid), embedded as data URIs so the pack stays one file.
PR = os.path.join(HERE, 'art', 'prints')
prints = {f[:-4]: 'data:image/jpeg;base64,' + base64.b64encode(open(os.path.join(PR, f), 'rb').read()).decode() for f in sorted(os.listdir(PR)) if f.endswith('.jpg') and not f.startswith('source')} if os.path.isdir(PR) else {}
html = '\n'.join([head, body, '<script>' + rd(S('layr-adapter.js')) + '</script>', '<script>' + rd(S('guard.js')).strip() + '</script>', '<script>' + rd(S('bf-engine.js')) + '</script>',
    '<script>window.WIS_RECORDS=' + json.dumps(records, separators=(',', ':'), ensure_ascii=False) + ';window.WIS_PRINTS=' + json.dumps(prints, separators=(',', ':')) + ';</script>', '<script>' + game + '</script>', '</body></html>'])
open(os.path.join(HERE, 'game.html'), 'w', encoding='utf-8').write(html)

enc = lambda b: base64.b64encode(gzip.compress(b, 9, mtime=0)).decode()
model = json.load(open(os.path.join(HERE, 'model', 'who-is-satoshi-model.json')))
pack = {'name': 'Who Is Satoshi?', 'description': 'The Satoshi mystery · noir case file', 'color': '#2a1a0e', 'accent': '#e0b04a',
        'model': enc(json.dumps(model, separators=(',', ':')).encode()), 'game': enc(html.encode('utf-8')), 'css': css}
json.dump(pack, open(os.path.join(PUB, 'pack.json'), 'w'), separators=(',', ':'))
shutil.copy(S('page.html'), os.path.join(PUB, 'index.html'))
three = os.environ.get('WIS_THREE') or os.path.join(ROOT, 'tools', 'snow-crash', 'vendor', 'three.js')
shutil.copy(three, os.path.join(PUB, 'vendor', 'three.js'))
shutil.copy(os.path.join(HERE, 'art', 'records.json'), os.path.join(PUB, 'art', 'records.json'))
cab = os.path.join(HERE, 'art', 'cabinet')
if os.path.isdir(cab):
    for f in os.listdir(cab): shutil.copy(os.path.join(cab, f), os.path.join(PUB, 'art', 'cabinet', f))
if os.path.isdir(PR):
    os.makedirs(os.path.join(PUB, 'art', 'prints'), exist_ok=True)
    for f in os.listdir(PR): shutil.copy(os.path.join(PR, f), os.path.join(PUB, 'art', 'prints', f))
if os.path.exists(os.path.join(HERE, 'INTEGRATION.md')): shutil.copy(os.path.join(HERE, 'INTEGRATION.md'), os.path.join(PUB, 'INTEGRATION.md'))

# ---- art/sources.json: every record's source, and the logos that still need permission
src = json.load(open(os.path.join(HERE, 'sources.template.json')))
src['generated'] = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ')
src['symbols']['scatter']['items'] = [{'text': p['text'], 'date': p['date'], 'where': p['where'], 'source': p['url']} for p in records['posts']]
src['symbols']['chain']['items'] = records['patoshi']['heights']
json.dump(src, open(os.path.join(PUB, 'art', 'sources.json'), 'w'), indent=1, ensure_ascii=False)
print('game.html', len(html), 'bytes | pack.json', os.path.getsize(os.path.join(PUB, 'pack.json')), 'bytes | posts', len(records['posts']), '| patoshi', len(records['patoshi']['heights']), '| prints', len(prints))
