#!/usr/bin/env python3
"""Sat Hunter build: game parts -> game.html -> pack.json, plus the test page, vendor three.js and art/sources.json.

Run from anywhere:  python3 tools/sat-hunter/build.py      (run build_records.py and model/build_model.py first if their inputs changed)
Inputs : tools/sat-hunter/src (game script parts, markup, css, the verbatim engine and LAYR adapter, the test page)
         tools/sat-hunter/art/records.json (every real sat on the reels; embedded in the game as window.SAT_RECORDS)
         tools/sat-hunter/model/sat-hunter-model.json (built by model/build_model.py)
Outputs: public/casino-machines/sat-hunter/{index.html,pack.json,vendor/three.js,art/*,INTEGRATION.md,QA.md}
No casino file is read or written. The game needs no network at runtime: nothing in it fetches.
"""
import json, gzip, base64, os, shutil, datetime, glob
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))
PUB = os.environ.get('SAT_HUNTER_OUT') or os.path.join(ROOT, 'public', 'casino-machines', 'sat-hunter')
S = lambda *p: os.path.join(HERE, 'src', *p)
rd = lambda p: open(p, encoding='utf-8').read()
for d in ('vendor', 'art', os.path.join('art', 'cabinet'), os.path.join('art', 'official')): os.makedirs(os.path.join(PUB, d), exist_ok=True)

NAME, ACCENT, COLOR = 'Sat Hunter', '#00a6fb', '#2a1a10'
DESC = 'Every sat has a story · a Victorian assay bench'
records = json.load(open(os.path.join(HERE, 'art', 'records.json'), encoding='utf-8'))
OFF = os.path.join(HERE, 'art', 'official')  # the official rarity art the owner supplied (Xverse badges, Magic Eden Black-sats tile)
official = {os.path.splitext(n)[0]: 'data:image/png;base64,' + base64.b64encode(open(os.path.join(OFF, n), 'rb').read()).decode() for n in sorted(os.listdir(OFF)) if n.endswith('.png')} if os.path.isdir(OFF) else {}
css = rd(S('game.css')).strip(); body = rd(S('body.html')).strip()
parts = ['p1_head', 'p2_ui', 'p3_art', 'p4_live', 'p5_screen', 'p6_scenes', 'p7_flow', 'p8_draw', 'p9_panels', 'p10_boot']
game = '\n'.join(rd(S('game', p + '.js')).strip('\n') for p in parts)
head = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#07090c"><meta name="color-scheme" content="dark">'
        '<title>Sat Hunter — ParallaX Casino machine</title><meta name="description" content="Sat Hunter: a ParallaX Casino fruit machine, a Victorian assay bench for real Bitcoin sats. Every symbol is a real sat with a check link. Block Fortune v2 engine, 94.38% RTP, play-money LAYR.">'
        f'<style>{css}</style></head><body>')
html = '\n'.join([head, body, '<script>' + rd(S('layr-adapter.js')) + '</script>', '<script>' + rd(S('guard.js')).strip() + '</script>', '<script>' + rd(S('bf-engine.js')) + '</script>',
    '<script>window.SAT_RECORDS=' + json.dumps(records, separators=(',', ':'), ensure_ascii=False).replace('</', '<\\/') + ';</script>', '<script>window.SAT_OFFICIAL=' + json.dumps(official, separators=(',', ':')) + ';</script>', '<script>' + game + '</script>', '</body></html>'])
open(os.path.join(HERE, 'game.html'), 'w', encoding='utf-8').write(html)

enc = lambda b: base64.b64encode(gzip.compress(b, 9, mtime=0)).decode()
mp = os.path.join(HERE, 'model', 'sat-hunter-model.json')
if not os.path.exists(mp):  # tolerate the model script's output name while the cabinet is being built
    found = sorted(glob.glob(os.path.join(HERE, 'model', '*-model.json')))
    if not found: raise SystemExit('No model JSON: run python3 tools/sat-hunter/model/build_model.py first')
    mp = found[0]
model = json.load(open(mp))
pack = {'name': NAME, 'description': DESC, 'color': COLOR, 'accent': ACCENT,
        'model': enc(json.dumps(model, separators=(',', ':')).encode()), 'game': enc(html.encode('utf-8')), 'css': css}
json.dump(pack, open(os.path.join(PUB, 'pack.json'), 'w'), separators=(',', ':'))
shutil.copy(S('page.html'), os.path.join(PUB, 'index.html'))
three = os.environ.get('SAT_HUNTER_THREE') or os.path.join(ROOT, 'tools', 'snow-crash', 'vendor', 'three.js')
shutil.copy(three, os.path.join(PUB, 'vendor', 'three.js'))
shutil.copy(os.path.join(HERE, 'art', 'records.json'), os.path.join(PUB, 'art', 'records.json'))
if os.path.isdir(OFF):
    for f in os.listdir(OFF):
        if f.endswith('.png'): shutil.copy(os.path.join(OFF, f), os.path.join(PUB, 'art', 'official', f))
cab = os.path.join(HERE, 'art', 'cabinet')
if os.path.isdir(cab):
    for f in [x for x in os.listdir(cab) if not x.startswith('review-sheet')]: shutil.copy(os.path.join(cab, f), os.path.join(PUB, 'art', 'cabinet', f))
for doc in ('INTEGRATION.md', 'QA.md'):
    if os.path.exists(os.path.join(HERE, doc)): shutil.copy(os.path.join(HERE, doc), os.path.join(PUB, doc))

# ---- art/sources.json: every data source, and the logos that still need permission
src = json.load(open(os.path.join(HERE, 'sources.template.json'), encoding='utf-8'))
src['generated'] = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ')
T = records['types']
def sat_items(slot): return [{'sat': r['str'], 'block': r['block'], 'degree': r['degree'], 'name': r['name'], 'rarity': r['rarity'], 'tags': r['tags'], 'check': r['check'], 'verified': r['verified']} for r in T[slot]]
for slot in ('cherry', 'lemon', 'chip', 'block', 'bitcoin', 'wild', 'scatter', 'vault'): src['symbols'][slot]['items'] = sat_items(slot)
src['symbols']['artifact']['items'] = [{'label': r['label'], 'fact': r['fact'], 'tx': r['tx'], 'block': r['block'], 'date': r['date'], 'satStatus': r.get('satStatus', 'indexed'), 'check': r['check'], 'verified': r['verified']} for r in T['artifact']]
src['symbols']['chain']['items'] = [{'block': r['block'], 'firstSat': str(r['first']), 'lastSat': str(r['last']), 'event': r['event'], 'check': r['check'], 'verified': r['verified']} for r in T['chain']]
src['hunts'] = {'ranges': len(records['hunts']), 'findsPerRange': sorted({len(h['finds']) for h in records['hunts']}), 'blocks': [h['block'] for h in records['hunts']]}
src['mythic'] = {'sat': records['mythic']['str'], 'name': records['mythic']['name'], 'genesis': records['mythic'].get('genesis')}
every = [r for s in T.values() for r in s] + [f for h in records['hunts'] for f in h['finds']] + [records['mythic']] + records['exotic']
src['verification'] = {'records': len(every), 'checkedOnOrdinalsCom': sum(1 for r in every if r.get('verified')), 'note': 'verified=false means the sat was computed offline by the numbering rules and has not yet been opened on ordinals.com; the machine says "not yet checked" next to it.'}
json.dump(src, open(os.path.join(PUB, 'art', 'sources.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('game.html', len(html), 'bytes | pack.json', os.path.getsize(os.path.join(PUB, 'pack.json')), 'bytes | records', len(every), '| model', os.path.basename(mp), '| out', PUB)
