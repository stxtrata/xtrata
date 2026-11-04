#!/usr/bin/env python3
"""Checks for the Who Is Satoshi? build. Read-only: it never writes to any casino file.

1. The Block Fortune v2 engine and the LAYR adapter inside the game are byte-identical to the ones in Forever Twins
   (read from public/casino/index.html, the 'Forever Twins' entry of PX_MACHINE_PACKS).
2. pack.json decodes: model and game gunzip, the model JSON has root/geometries/materials/textures, the named parts and
   deck actions are there, and the game contains the room's exact screen string once.
3. The pack's css equals the game's head <style>.
4. The casino files still have the hashes recorded at the last build (casino-baseline.json): this build edits none of them.
   Use --rebaseline after someone else changes the casino.
Usage: python3 tools/who-is-satoshi/verify.py [path/to/casino/index.html] [--rebaseline]
"""
import json, gzip, base64, hashlib, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))
PUB = os.path.join(ROOT, 'public', 'casino-machines', 'who-is-satoshi')
# The casino files' hashes from the last time this machine was built, in casino-baseline.json. The check proves this
# build did not edit them. If someone else changes the casino between builds, re-record with --rebaseline.
BASE = os.path.join(HERE, 'casino-baseline.json'); CASINO_FILES = ['public/casino/index.html', 'public/casino/room.js', 'public/casino/passkey-wallet.js']
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
    for c in n.get('children', []): walk(c)
walk(model['root'])
for r in ('screenMesh', 'crest', 'spinPhysical', 'lever'): check('named part ' + r, r in roles)
check('deck actions', {'spin', 'betUp', 'betDown', 'auto', 'pays'} <= acts, str(sorted(acts)))
check("game has the room's exact screen string once", game.count('screen=canvas(2800,1920)') == 1)
check('accent / name', pack['accent'] == '#e0b04a' and pack['name'] == 'Who Is Satoshi?')
check('game id', "GAME_ID='who-is-satoshi'" in game.replace(' ', '').replace('"', "'"))
check('no cloud adapter stub in the game', 'CLOUD TEST STUB' not in game)
check('Bonus Lab gated (test page or ?lab=1)', 'lab=1' in game or "get('lab')" in game)
head = re.search(r'<style>(.*?)</style>', game, re.S).group(1)
check('css equals the game head style', head == pack['css'])
eng = find(game, 'Block Fortune v2 engine'); lay = find(game, 'One existing LAYR account')
check('engine and adapter present in game', eng is not None and lay is not None)
src_eng = open(os.path.join(HERE, 'src', 'bf-engine.js'), encoding='utf-8').read()
check('engine in game equals src/bf-engine.js', eng == src_eng)
casino = next((a for a in sys.argv[1:] if not a.startswith('--')), None) or os.path.join(ROOT, 'public', 'casino', 'index.html')
he = lambda s: hashlib.sha256(s.encode()).hexdigest()[:16]
if os.path.exists(casino):
    txt = open(casino, encoding='utf-8', errors='ignore').read(); i = txt.index('window.PX_MACHINE_PACKS=') + len('window.PX_MACHINE_PACKS=')
    packs, _ = json.JSONDecoder().raw_decode(txt[i:]); ft = next(p for p in packs if p['name'] == 'Forever Twins'); fg = dec(ft['game'])
    fe = find(fg, 'Block Fortune v2 engine'); fl = find(fg, 'One existing LAYR account')
    check('engine byte-identical to Forever Twins', eng == fe, f"sha256 {he(eng)} / {he(fe)} · {len(eng)} bytes")
    check('LAYR adapter byte-identical to Forever Twins', lay == fl, f"sha256 {he(lay or '')} / {he(fl)} · {len(lay or '')} bytes")
else: print('SKIP Forever Twins comparison: casino file not found at', casino)
import datetime
cur = {rel: hashlib.sha256(open(os.path.join(ROOT, rel), 'rb').read()).hexdigest() for rel in CASINO_FILES if os.path.exists(os.path.join(ROOT, rel))}
if '--rebaseline' in sys.argv or not os.path.exists(BASE):
    json.dump({'recorded': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ'), 'hashes': cur}, open(BASE, 'w'), indent=1); print('RECORDED casino baseline', BASE)
base = json.load(open(BASE))
for rel, want in base['hashes'].items(): check('unchanged since ' + base['recorded'] + ' ' + rel, cur.get(rel) == want, (cur.get(rel) or 'missing')[:16])
print('ALL PASS' if ok else 'SOME CHECKS FAILED'); sys.exit(0 if ok else 1)
