#!/usr/bin/env python3
"""Xtrata Originals build: game parts -> game.html -> pack.json, plus the test page, vendor files and art/.

Run from anywhere:  python3 tools/xtrata-originals/build.py
Inputs : tools/xtrata-originals/src (game script parts, markup, css, the verbatim engine and LAYR adapter, the test page)
         tools/xtrata-originals/vendor/xlogo.js (the house XLOGO vector code, identical to the Forever Twins pack)
         tools/xtrata-originals/model/xtrata-originals-model.json (built by model/build-cabinet.mjs)
         tools/xtrata-originals/art/xo-art.json (made by art-src/build_art.py from the raw captures)
Outputs: public/casino-machines/xtrata-originals/{index.html, pack.json, pack.js, vendor/, art/}
No casino file is read or written.
"""
import json, gzip, base64, os, shutil, datetime
HERE = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.normpath(os.path.join(HERE, '..', '..', 'public', 'casino-machines', 'xtrata-originals'))
S = lambda *p: os.path.join(HERE, 'src', *p)
rd = lambda p: open(p, encoding='utf-8').read()
for d in ('vendor', 'art'): os.makedirs(os.path.join(PUB, d), exist_ok=True)
# The Xtrata mark exactly as given in the series bible (part 5), as its base64 data URI.
XMARK_URI = rd(os.path.join(HERE, 'art', 'xtrata-mark.datauri.txt')).strip()
ART = json.load(open(os.path.join(HERE, 'art', 'xo-art.json')))
# ---- game.html
css = rd(S('game.css')).strip(); body = rd(S('body.html')).strip()
parts = ['p1_head', 'v_helpers', 'p2_ui', 'p3_art', 'p4_live', 'p5_screen', 'p6_scenes', 'p7_flow', 'p8_draw', 'p9_panels', 'p10_boot', 'p11_lab']
game = '\n'.join(rd(S('game', p + '.js')).strip('\n') for p in parts)
head = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#05070b"><meta name="color-scheme" content="dark"><title>Xtrata Originals — ParallaX Casino machine</title><meta name="description" content="Xtrata Originals: the ParallaX Casino house machine. Audionauts, cicadas, Astro Blaster 3, Audionals, Forever Twins and real Xtrata layers, all born on chain. Block Fortune v2 engine, 94.38% RTP, play-money LAYR.">' f'<style>{css}</style></head><body>')
html = '\n'.join([head, body, '<script>' + rd(S('layr-adapter.js')) + '</script>', '<script>' + rd(S('guard.js')).strip() + '</script>', '<script>' + rd(S('bf-engine.js')) + '</script>',
    '<script>' + rd(os.path.join(HERE, 'vendor', 'xlogo.js')) + '</script>',
    '<script>window.XO_XMARK_URI=' + json.dumps(XMARK_URI) + ';</script>', '<script>window.XO_ART=' + json.dumps(ART, separators=(',', ':')) + ';</script>', '<script>' + game + '</script>', '</body></html>'])
open(os.path.join(HERE, 'game.html'), 'w', encoding='utf-8').write(html)
# ---- pack.json (the PX_MACHINE_PACKS entry) and pack.js (the same pack as a script, so the test page also opens from disk)
enc = lambda b: base64.b64encode(gzip.compress(b, 9, mtime=0)).decode()
mp = os.path.join(HERE, 'model', 'xtrata-originals-model.json')
model = json.load(open(mp)) if os.path.exists(mp) else {'root': {'p': [0, 0, 0], 'q': [0, 0, 0, 1], 's': [1, 1, 1], 'visible': True, 'role': '', 'children': []}, 'geometries': [], 'materials': [], 'textures': []}
pack = {'name': 'Xtrata Originals', 'description': 'Born on chain · the house machine', 'color': '#0b0e14', 'accent': '#4675b6',
        'model': enc(json.dumps(model, separators=(',', ':')).encode()), 'game': enc(html.encode('utf-8')), 'css': css}
json.dump(pack, open(os.path.join(PUB, 'pack.json'), 'w'), separators=(',', ':'))
open(os.path.join(PUB, 'pack.js'), 'w').write('window.XO_PACK=' + json.dumps(pack, separators=(',', ':')) + ';\n')
shutil.copy(S('page.html'), os.path.join(PUB, 'index.html'))
for f in ('three.js', 'software-renderer.js'): shutil.copy(os.path.join(HERE, 'vendor', f), os.path.join(PUB, 'vendor', f))
# ---- art/: the bundled images as files, and sources.json
src_imgs = os.path.join(HERE, 'art', 'images')
if os.path.isdir(src_imgs): shutil.copytree(src_imgs, os.path.join(PUB, 'art', 'images'), dirs_exist_ok=True)
src = json.load(open(os.path.join(HERE, 'art', 'sources.template.json')))
src['generated'] = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ')
src['images'] = {
  'audionauts': [{k: a[k] for k in ('edition', 'name', 'tokenId', 'seed', 'mintTx')} | {'file': f"art/images/audionaut-{a['edition']:03d}-{a['tokenId']}.webp"} for a in ART['audionauts']],
  'cicadas': [{k: c[k] for k in ('seed', 'rank', 'tier', 'family', 'bark', 'color')} | {'file': f"art/images/cicada-seed-{c['seed']}.webp"} for c in ART['cicadas']],
  'cicadaCalls': [{k: c[k] for k in ('seed', 'tier', 'family', 'seconds')} | {'file': f"art/images/cicada-call-seed-{c['seed']}.mp3"} for c in ART['calls']],
  'astroBlaster3': [{'frame': a['frame'], 'file': f"art/images/astro-blaster-3-{a['frame']}.webp"} for a in ART['astro']],
  'layers': [{k: l.get(k) for k in ('id', 'wallet', 'mime', 'bytes', 'block', 'tx')} | ({'file': f"art/images/layer-{l['id']}.webp"} if l.get('thumb', '').startswith('data:image/webp') else {}) for l in ART['layers']],
  'sessionKit': [{'part': k, 'soundId': v['id'], 'file': f'art/images/kit-{k}.mp3'} for k, v in ART['kit'].items()]}
json.dump(src, open(os.path.join(PUB, 'art', 'sources.json'), 'w'), indent=1, ensure_ascii=False)
print('game.html', len(html), 'bytes | pack.json', os.path.getsize(os.path.join(PUB, 'pack.json')), 'bytes | model', 'yes' if os.path.exists(mp) else 'placeholder')
