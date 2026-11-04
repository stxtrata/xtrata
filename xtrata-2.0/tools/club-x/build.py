#!/usr/bin/env python3
"""Club X build: game parts -> game.html -> pack.json, plus the test page, vendor three.js and art/sources.json.

Run from anywhere:  python3 tools/club-x/build.py      (run model/build_model.py first if its inputs changed)
Inputs : tools/club-x/src (game script parts, markup, css, the verbatim engine and LAYR adapter, the test page)
         tools/club-x/art/works.json (Chemical X's works the reels are set from)
         tools/club-x/art/bundle.json (optional, written by fetch_art.py: the works' images as small data URIs, so the reels show real art offline)
         tools/club-x/model/club-x-model.json (built by model/build_model.py)
Outputs: public/casino-machines/club-x/{index.html,pack.json,vendor/three.js,art/*,INTEGRATION.md,README.md}
No casino file is read or written.
"""
import json, gzip, base64, os, shutil, datetime
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))
PUB = os.environ.get('CLUBX_OUT') or os.path.join(ROOT, 'public', 'casino-machines', 'club-x')
S = lambda *p: os.path.join(HERE, 'src', *p)
rd = lambda p: open(p, encoding='utf-8').read()
for d in ('vendor', 'art', os.path.join('art', 'cabinet')): os.makedirs(os.path.join(PUB, d), exist_ok=True)

works = json.load(open(os.path.join(HERE, 'art', 'works.json'), encoding='utf-8'))
bundle_path = os.path.join(HERE, 'art', 'bundle.json')
bundle = json.load(open(bundle_path, encoding='utf-8')) if os.path.exists(bundle_path) else None
css = rd(S('game.css')).strip(); body = rd(S('body.html')).strip()
parts = ['p1_head', 'p2_ui', 'p3_art', 'p4_live', 'p5_screen', 'p6_scenes', 'p7_flow', 'p8_draw', 'p9_panels', 'p10_boot']
game = '\n'.join(rd(S('game', p + '.js')).strip('\n') for p in parts)
head = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0a0b0c"><meta name="color-scheme" content="dark"><title>Club X — ParallaX Casino machine</title><meta name="description" content="Club X: a ParallaX Casino fruit machine for Chemical X. London, 1991: follow the chalk X to the warehouse. Block Fortune v2 engine, 94.38% RTP, play-money LAYR.">' f'<style>{css}</style></head><body>')
data = ['<script>window.CLUBX_WORKS=' + json.dumps(works, separators=(',', ':'), ensure_ascii=False) + ';</script>']
tin_path = os.path.join(HERE, 'art', 'brand', 'this-is-number-one-logo.svg')
px_path = os.path.join(HERE, 'art', 'brand', 'cx-pink-x.png')   # the genuine pink X, cut from official tile 7 and keyed to transparent
brand = []
import base64 as _b64
if os.path.exists(tin_path): brand.append('tin:"data:image/svg+xml;base64,' + _b64.b64encode(open(tin_path, 'rb').read()).decode() + '"')
if os.path.exists(px_path): brand.append('pinkX:"data:image/png;base64,' + _b64.b64encode(open(px_path, 'rb').read()).decode() + '"')
if brand: data.append('<script>window.CLUBX_BRAND={' + ','.join(brand) + '};</script>')
# official art supplied by Jim (art/official/*.jpg): always bundled, so these pieces show offline
import base64
off_path = os.path.join(HERE, 'art', 'official', 'official.json')
if os.path.exists(off_path):
    off = json.load(open(off_path, encoding='utf-8'))
    bundle = dict(bundle or {})
    for t in off['tiles']:
        bundle['official:%d' % t['n']] = {'name': t['title'], 'data': 'data:image/jpeg;base64,' + base64.b64encode(open(os.path.join(HERE, 'art', 'official', t['file']), 'rb').read()).decode(), 'source': 'Supplied by Jim: official Chemical X image (art/official/%s)' % t['file'], 'official': True}
if bundle: data.append('<script>window.CLUBX_ART=' + json.dumps(bundle, separators=(',', ':'), ensure_ascii=False) + ';</script>')
html = '\n'.join([head, body, '<script>' + rd(S('layr-adapter.js')) + '</script>', '<script>' + rd(S('guard.js')).strip() + '</script>', '<script>' + rd(S('bf-engine.js')) + '</script>'] + data + ['<script>' + game + '</script>', '</body></html>'])
open(os.path.join(HERE, 'game.html'), 'w', encoding='utf-8').write(html)

enc = lambda b: base64.b64encode(gzip.compress(b, 9, mtime=0)).decode()
model = json.load(open(os.path.join(HERE, 'model', 'club-x-model.json')))
pack = {'name': 'Club X', 'description': 'Chemical X · follow the chalk X to the warehouse', 'color': '#15171a', 'accent': '#e6ff00',
        'model': enc(json.dumps(model, separators=(',', ':')).encode()), 'game': enc(html.encode('utf-8')), 'css': css}
json.dump(pack, open(os.path.join(PUB, 'pack.json'), 'w'), separators=(',', ':'))
shutil.copy(S('page.html'), os.path.join(PUB, 'index.html'))
three = os.environ.get('CLUBX_THREE') or os.path.join(ROOT, 'tools', 'snow-crash', 'vendor', 'three.js')
shutil.copy(three, os.path.join(PUB, 'vendor', 'three.js'))
shutil.copy(os.path.join(HERE, 'art', 'works.json'), os.path.join(PUB, 'art', 'works.json'))
cab = os.path.join(HERE, 'art', 'cabinet')
if os.path.isdir(cab):
    for f in os.listdir(cab): shutil.copy(os.path.join(cab, f), os.path.join(PUB, 'art', 'cabinet', f))
for doc in ('INTEGRATION.md', 'README.md', 'QA.md'):
    if os.path.exists(os.path.join(HERE, doc)): shutil.copy(os.path.join(HERE, doc), os.path.join(PUB, doc))

if os.path.exists(tin_path):
    os.makedirs(os.path.join(PUB, 'art', 'brand'), exist_ok=True); shutil.copy(tin_path, os.path.join(PUB, 'art', 'brand', 'this-is-number-one-logo.svg')); os.path.exists(px_path) and shutil.copy(px_path, os.path.join(PUB, 'art', 'brand', 'cx-pink-x.png'))
# ---- art/sources.json: every image's source, and the logos / works that still need permission
src = json.load(open(os.path.join(HERE, 'sources.template.json'), encoding='utf-8'))
src['generated'] = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ')
src['wallet'] = works.get('wallet')
src['works'] = [{'key': w['key'], 'name': w['name'], 'contract': w.get('contract'), 'tokenIds': w.get('ids', []), 'status': w.get('status'), 'source': w.get('source'), 'gamma': w.get('gamma'),
                 'imageSource': 'Hiro metadata API get-token-uri -> the token\'s own image (IPFS gateway); bundled copies in bundle.json when fetch_art.py has been run' } for w in works['works']]
src['bundledArt'] = bool(bundle)
if bundle: src['bundle'] = {k: {'name': v.get('name'), 'source': v.get('source'), 'metadata': v.get('metadata')} for k, v in bundle.items()}
if os.path.exists(off_path):
    od = os.path.join(PUB, 'art', 'official'); os.makedirs(od, exist_ok=True)
    for t in off['tiles']: shutil.copy(os.path.join(HERE, 'art', 'official', t['file']), os.path.join(od, t['file']))
    shutil.copy(off_path, os.path.join(od, 'official.json'))
    src['officialArt'] = {'about': off['_about'], 'source': off['source'], 'files': ['art/official/' + t['file'] for t in off['tiles']], 'titles': {t['file']: t['title'] for t in off['tiles']}, 'note': 'Supplied by Jim as official Chemical X images. Several pieces are pill mosaics and one is a bottle silhouette; Club X\'s own drawn art has no pills or drug imagery. Four are character portraits (CX hoodie), a candidate for the Wild.'}
json.dump(src, open(os.path.join(PUB, 'art', 'sources.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('game.html', len(html), 'bytes | pack.json', os.path.getsize(os.path.join(PUB, 'pack.json')), 'bytes | works', sum(len(w.get('ids', [])) for w in works['works']), '| bundled art', len(bundle) if bundle else 0)
