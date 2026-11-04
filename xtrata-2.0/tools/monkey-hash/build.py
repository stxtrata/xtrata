#!/usr/bin/env python3
"""Monkey Hash build: game parts -> game.html -> pack.json, plus the test page, vendor three.js and art/sources.json.

Run from anywhere:  python3 tools/monkey-hash/build.py
Inputs : tools/monkey-hash/src (game script parts, markup, css, the verbatim Block Fortune v2 engine and LAYR adapter, the test page)
         tools/monkey-hash/model/monkey-hash-model.json (built by model/build_model.py)
         public/casino-machines/monkey-hash/art/monkey-hash-art.json (bundled art; made by tools/monkey-hash/fetch_art.py)
         tools/monkey-hash/art/logos/{banana,bitcoin-monkeys,monkey-store}.{svg,png,webp,jpg}  (optional official logos; typed tiles are used until they exist)
Outputs: public/casino-machines/monkey-hash/{index.html,pack.json,vendor/three.js,art/sources.json}
No casino file is read or written.
"""
import json, gzip, base64, os, shutil, datetime
HERE = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.normpath(os.path.join(HERE, '..', '..', 'public', 'casino-machines', 'monkey-hash'))
S = lambda *p: os.path.join(HERE, 'src', *p)
rd = lambda p: open(p, encoding='utf-8').read()
os.makedirs(os.path.join(PUB, 'vendor'), exist_ok=True); os.makedirs(os.path.join(PUB, 'art'), exist_ok=True)

# ---- art bundle
art = json.load(open(os.path.join(PUB, 'art', 'monkey-hash-art.json')))
MH_ART = {k: art[k] for k in ('items', 'tierString', 'tierCounts', 'serums', 'mutants', 'contract', 'tokensWithMetadata', 'tokensWithoutMetadata', 'generated')}
MIME = {'svg': 'image/svg+xml', 'png': 'image/png', 'webp': 'image/webp', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg'}
logos, logo_files = {}, {}
for key, name in (('bananaUri', 'banana'), ('monkeysUri', 'bitcoin-monkeys'), ('storeUri', 'monkey-store')):
    for ext in MIME:
        p = os.path.join(HERE, 'art', 'logos', f'{name}.{ext}')
        if os.path.exists(p): logos[key] = f'data:{MIME[ext]};base64,' + base64.b64encode(open(p, 'rb').read()).decode(); logo_files[name] = os.path.relpath(p, os.path.join(HERE, '..', '..')); break
MH_LOGOS = logos

# ---- game.html
css = rd(S('game.css')).strip(); body = rd(S('body.html')).strip()
parts = ['p1_head', 'v_helpers', 'v_infinity', 'v_net1', 'v_net2', 'v_net3', 'p2_ui', 'p3_art', 'p4_live', 'p5_screen', 'p6_scenes', 'p7_flow', 'p8_draw', 'p9_panels', 'p10_boot']
game = '\n'.join(rd(S('game', p + '.js')).strip('\n') for p in parts)
head = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#050d09"><meta name="color-scheme" content="dark"><title>Monkey Hash — ParallaX Casino machine</title><meta name="description" content="Monkey Hash: a ParallaX Casino fruit machine for Bitcoin Monkeys, BANANA, the Serums and the Mutant Monkeys. Block Fortune v2 engine, 94.38% RTP, play-money LAYR.">' f'<style>{css}</style></head><body>')
html = '\n'.join([head, body, '<script>' + rd(S('layr-adapter.js')) + '</script>', '<script>' + rd(S('guard.js')).strip() + '</script>', '<script>' + rd(S('bf-engine.js')) + '</script>',
    '<script>window.MH_LOGOS=' + json.dumps(MH_LOGOS, separators=(',', ':')) + ';</script>', '<script>window.MH_ART=' + json.dumps(MH_ART, separators=(',', ':')) + ';</script>', '<script>' + game + '</script>', '</body></html>'])

# ---- pack.json
enc = lambda b: base64.b64encode(gzip.compress(b, 9, mtime=0)).decode()
model = json.load(open(os.path.join(HERE, 'model', 'monkey-hash-model.json')))
pack = {'name': 'Monkey Hash', 'description': 'Bitcoin Monkeys · BANANA · Serums', 'color': '#1d2b22', 'accent': '#d9a300',
        'model': enc(json.dumps(model, separators=(',', ':')).encode()), 'game': enc(html.encode('utf-8')), 'css': css}
json.dump(pack, open(os.path.join(PUB, 'pack.json'), 'w'), separators=(',', ':'))
shutil.copy(S('page.html'), os.path.join(PUB, 'index.html')); shutil.copy(os.path.join(HERE, 'vendor', 'three.js'), os.path.join(PUB, 'vendor', 'three.js'))

# ---- art/sources.json
src = json.load(open(os.path.join(HERE, 'sources.template.json')))
log = json.load(open(os.path.join(PUB, 'art', 'image-log.json')))
n_pics = sum(1 for i in art['items'] if i[2]); n_rec = len(art['items']) - n_pics
src.update({'generated': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ'),
            'bundled': {'monkeysWithPicture': n_pics, 'monkeysRecordOnly': n_rec, 'serumPictures': sum(1 for s in art['serums'].values() if s.get('uri')), 'mutantPictures': len((art.get('mutants') or {}).get('items', [])), 'fetchLogOffline': log.get('offline')},
            'logosBundled': logo_files, 'images': log['images']})
src['collection'].update({'contract': art['contract'], 'tokensWithMetadata': art['tokensWithMetadata'], 'tokensWithoutMetadata': art['tokensWithoutMetadata']})
src['tiers'].update({'counts': art['tierCounts'], 'goldTokenIds': log['goldTokenIds'], 'scores': log['scores']})
json.dump(src, open(os.path.join(PUB, 'art', 'sources.json'), 'w'), indent=1)
print('game.html', len(html), 'bytes | pack.json', os.path.getsize(os.path.join(PUB, 'pack.json')), 'bytes | pictures', n_pics, '| record-only', n_rec, '| logos', list(logo_files) or 'none (typed tiles)')
