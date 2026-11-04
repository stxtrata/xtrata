#!/usr/bin/env python3
"""Checks for the Nine Lives build. Read-only.

1. The Block Fortune v2 engine and the LAYR adapter inside the game are byte-identical to the ones in Forever Twins
   (read from public/casino/index.html, PX_MACHINE_PACKS[1], never written).
2. pack.json decodes: model and game gunzip, the model JSON has root/geometries/materials/textures, and the game
   contains the engine, the room's exact screen string and the Nine Lives script.
3. The pack's css equals the game's head <style>.
Usage: python3 tools/nine-lives/verify.py [path/to/casino/index.html]
"""
import json, gzip, base64, hashlib, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))
PUB = os.path.join(ROOT, 'public', 'casino-machines', 'nine-lives')
dec = lambda s: gzip.decompress(base64.b64decode(s)).decode('utf-8')
scripts = lambda h: [m.group(1) for m in re.finditer(r'<script>(.*?)</script>', h, re.S)]
def find(h, marker): return next((s for s in scripts(h) if marker in s[:400]), None)
ok = True
def check(name, cond, extra=''):
    global ok; ok &= bool(cond); print(('PASS ' if cond else 'FAIL ') + name + (' ' + extra if extra else ''))
pack = json.load(open(os.path.join(PUB, 'pack.json')))
check('pack keys', sorted(pack) == sorted(['name', 'description', 'color', 'accent', 'model', 'game', 'css']), str(sorted(pack)))
model = json.loads(dec(pack['model'])); game = dec(pack['game'])
check('model decodes', all(k in model for k in ('root', 'geometries', 'materials', 'textures')), f"{len(model['geometries'])} geometries, {len(model['materials'])} materials, {len(model['textures'])} textures")
roles = []; acts = set()
def walk(n):
    if n.get('role'): roles.append(n['role'])
    if n.get('action'): acts.add(n['action'])
    for c in n['children']: walk(c)
walk(model['root'])
for r in ('screenMesh', 'crest', 'spinPhysical', 'lever'): check('named part ' + r, r in roles)
check('deck actions', {'spin', 'betUp', 'betDown', 'auto', 'pays'} <= acts, str(sorted(acts)))
check('game has the room\'s exact screen string', game.count('screen=canvas(2800,1920)') == 1)
check('accent / name', pack['accent'] == '#12b5a6' and pack['name'] == 'Nine Lives')
head = re.search(r'<style>(.*?)</style>', game, re.S).group(1)
check('css equals the game head style', head == pack['css'])
eng = find(game, 'Block Fortune v2 engine'); lay = find(game, 'One existing LAYR account')
check('engine and adapter present in game', eng is not None and lay is not None)
casino = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'public', 'casino', 'index.html')
if os.path.exists(casino):
    txt = open(casino, encoding='utf-8', errors='ignore').read(); i = txt.index('window.PX_MACHINE_PACKS=') + len('window.PX_MACHINE_PACKS=')
    packs, _ = json.JSONDecoder().raw_decode(txt[i:]); ft = next(p for p in packs if p['name'] == 'Forever Twins'); fg = dec(ft['game'])
    fe = find(fg, 'Block Fortune v2 engine'); fl = find(fg, 'One existing LAYR account')
    he = lambda s: hashlib.sha256(s.encode()).hexdigest()[:16]
    check('engine byte-identical to Forever Twins', eng == fe, f"sha256 {he(eng)} / {he(fe)} · {len(eng)} bytes")
    check('LAYR adapter byte-identical to Forever Twins', lay == fl, f"sha256 {he(lay)} / {he(fl)} · {len(lay)} bytes")
else: print('SKIP Forever Twins comparison: casino file not found at', casino)
print('ALL PASS' if ok else 'SOME CHECKS FAILED'); sys.exit(0 if ok else 1)
