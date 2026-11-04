#!/usr/bin/env python3
"""Checks for The Halving build. Read-only: it never writes to any casino file.

1. The Block Fortune v2 engine and the LAYR adapter inside the game are byte-identical to the ones in Forever Twins
   (read from public/casino/index.html, the 'Forever Twins' entry of PX_MACHINE_PACKS).
2. pack.json decodes: model and game gunzip, the model JSON has root/geometries/materials/textures, the named parts and
   deck actions are there, and the game contains the room's exact screen string once.
3. The pack's css equals the game's head <style>.
4. records.json: every coinbase message decodes from its own hex, and every block's BIP34 height push matches.
5. The casino files still have the hashes recorded before this build (nothing was edited).
Usage: python3 tools/the-halving/verify.py [path/to/casino/index.html]
"""
import json, gzip, base64, hashlib, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))
PUB = os.environ.get('HALVING_OUT') or os.path.join(ROOT, 'public', 'casino-machines', 'the-halving')
CASINO_HASHES = {  # recorded on 2 Nov 2026 at 00:57 UTC, before this build began
    'public/casino/index.html': 'eaa66fd334e8b0319c3dbdb4dbfdfda19cc82a6d6019e8fd313d3848ac0b0656',
    'public/casino/room.js': '35c6b33dba68e9da7d34fec0f786a9978690e5336113403255603287e9545f64',
    'public/casino/passkey-wallet.js': '22c17ba2e2ded8eaa77c2bab4b1c708fdce305af0fe434bc2609f9dc8a7d6aca',
}
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
for r in ('screenMesh', 'core', 'spinPhysical', 'lever', 'flapBoard'): check('named part ' + r, r in roles)
check('screenMesh is unique', roles.count('screenMesh') == 1)
check('deck actions', {'spin', 'betUp', 'betDown', 'auto', 'pays'} <= acts, str(sorted(acts)))
check("game has the room's exact screen string once", game.count('screen=canvas(2800,1920)') == 1)
check('accent / name', pack['accent'] == '#ffd23f' and pack['name'] == 'The Halving')
check('game id', "GAME_ID='the-halving'" in game.replace(' ', '').replace('"', "'"))
check('Bonus Lab gated (test page or ?lab=1)', 'lab=1' in game)
head = re.search(r'<style>(.*?)</style>', game, re.S).group(1)
check('css equals the game head style', head == pack['css'])
eng = find(game, 'Block Fortune v2 engine'); lay = find(game, 'One existing LAYR account')
check('engine and adapter present in game', eng is not None and lay is not None)
src_eng = open(os.path.join(HERE, 'src', 'bf-engine.js'), encoding='utf-8').read()
check('engine in game equals src/bf-engine.js', eng == src_eng)
# records: decoded text really comes from the coinbase hex
sys.path.insert(0, HERE)
rec = json.load(open(os.path.join(HERE, 'art', 'records.json'), encoding='utf-8'))
src_text = open(os.path.join(HERE, 'build_records.py'), encoding='utf-8').read().split('\nhist = ')[0]  # the decoder functions only
ns = {'__file__': os.path.join(HERE, 'build_records.py')}; exec(compile(src_text, 'build_records.py', 'exec'), ns)
bad = []
for m in rec['messages']:
    _, runs = ns['decode']({'height': m['height'], 'coinbaseRaw': m['hex']})
    if ' · '.join(runs) != m['text']: bad.append(m['height'])
check('coinbase messages decode from their own hex (and BIP34 heights match)', not bad, f"{len(rec['messages'])} messages" + (f' mismatch {bad}' if bad else ''))
check('four halving blocks + next halving', [h['height'] for h in rec['halvings']] == [210000, 420000, 630000, 840000] and rec['next']['height'] == 1050000)
casino = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'public', 'casino', 'index.html')
he = lambda s: hashlib.sha256(s.encode()).hexdigest()[:16]
if os.path.exists(casino):
    txt = open(casino, encoding='utf-8', errors='ignore').read(); i = txt.index('window.PX_MACHINE_PACKS=') + len('window.PX_MACHINE_PACKS=')
    packs, _ = json.JSONDecoder().raw_decode(txt[i:]); ft = next(p for p in packs if p['name'] == 'Forever Twins'); fg = dec(ft['game'])
    fe = find(fg, 'Block Fortune v2 engine'); fl = find(fg, 'One existing LAYR account')
    check('engine byte-identical to Forever Twins', eng == fe, f"sha256 {he(eng)} / {he(fe)} · {len(eng)} bytes")
    check('LAYR adapter byte-identical to Forever Twins', lay == fl, f"sha256 {he(lay or '')} / {he(fl)} · {len(lay or '')} bytes")
else: print('SKIP Forever Twins comparison: casino file not found at', casino)
for rel, want in CASINO_HASHES.items():
    p = os.path.join(ROOT, rel)
    if os.path.exists(p):
        got = hashlib.sha256(open(p, 'rb').read()).hexdigest(); check('unchanged ' + rel, got == want, got[:16])
    else: print('SKIP', rel, 'not found')
print('ALL PASS' if ok else 'SOME CHECKS FAILED'); sys.exit(0 if ok else 1)
