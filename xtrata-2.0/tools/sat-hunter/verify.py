#!/usr/bin/env python3
"""Checks for the Sat Hunter build. Read-only: it never writes to any casino file.

1. The Block Fortune v2 engine and the LAYR adapter inside the game are byte-identical to src/, to the ones recorded when the
   build began (sha256 below), and to Forever Twins' (read from public/casino/index.html, the 'Forever Twins' entry of
   PX_MACHINE_PACKS, and from _claude_scratch/sat-hunter/forever-twins-game.html when it is there).
2. pack.json decodes: model and game gunzip, the model JSON has root/geometries/materials/textures, the named parts
   (screenMesh once, crest, topperPlate, counterL, counterR, spinPhysical, lever, leds) and deck actions are there, and the
   game contains the room's exact screen string once.
3. The pack's css equals the game's head <style>; the game carries window.SAT_RECORDS, needs no network, and none of the
   Halving's words are left in its theme script or markup.
4. Every sat in records.json is recomputed here from Bitcoin's subsidy rule and ordinal theory's numbering (block, offset,
   decimal, degree, name, rarity, tags, check link); the hunts, the Mythic sat, the gamble parities and the timeline too.
5. Every script in the game parses (node --check), and the theme script as one piece, so a name defined twice by two parts is caught.
6. The casino files still have the hashes recorded before this build (public/casino/ was not edited).
Usage: python3 tools/sat-hunter/verify.py [path/to/casino/index.html]
"""
import json, gzip, base64, hashlib, os, re, sys, subprocess, tempfile, shutil
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))
PUB = os.environ.get('SAT_HUNTER_OUT') or os.path.join(ROOT, 'public', 'casino-machines', 'sat-hunter')
ENGINE_SHA = '7f619182ada01119a713c64874eb1a7e024d7c210e0dca0ec2e8afc05c143168'   # src/bf-engine.js, 11,784 bytes
ADAPTER_SHA = '659bea0c6afc283fd851b9cd1d25573c4fc58d4a7968f7c94e3f6ee77882eed4'  # src/layr-adapter.js, 9,572 bytes
BASELINE_FILE = os.path.join(ROOT, '_claude_scratch', 'sat-hunter-casino-baseline.txt')
CASINO_HASHES = {  # recorded on 2 Nov 2026 at 10:26 UTC, before this build began (also in BASELINE_FILE, which wins when present)
    'public/casino/chess.js': '0cc4839849d427d3987c98f093f1a3bc8faa65e17bcfd3eb195e9f90779bca6c',
    'public/casino/index.html': '830216e7513fe56ddd078c8cb4311711dcff89a5be744a10f2a0c15a35ef77b7',
    'public/casino/passkey-wallet.js': '22c17ba2e2ded8eaa77c2bab4b1c708fdce305af0fe434bc2609f9dc8a7d6aca',
    'public/casino/room.js': '378822f95654a73a4d14bac8a95a2f2273678ce5bcb2fb91a437358bcea3d4a6',
    'public/casino/xchess-engine-3049.js': '10622134e974b4c3505d2ed935d009647fba0d7c14a72acae6d913036af814ec',
}
dec = lambda s: gzip.decompress(base64.b64decode(s)).decode('utf-8')
scripts = lambda h: [m.group(1) for m in re.finditer(r'<script>(.*?)</script>', h, re.S)]
def find(h, marker): return next((s for s in scripts(h) if marker in s[:400]), None)
sha = lambda s: hashlib.sha256(s.encode('utf-8') if isinstance(s, str) else s).hexdigest()
he = lambda s: sha(s)[:16]
ok = True
def check(name, cond, extra=''):
    global ok; ok &= bool(cond); print(('PASS ' if cond else 'FAIL ') + name + (' ' + extra if extra else ''))

# ---------------------------------------------------------------- 2. the pack
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
for r in ('screenMesh', 'crest', 'topperPlate', 'counterL', 'counterR', 'spinPhysical', 'lever', 'leds'): check('named part ' + r, r in roles)
check('screenMesh is unique', roles.count('screenMesh') == 1)
check('deck actions', {'spin', 'betUp', 'betDown', 'auto', 'pays'} <= acts, str(sorted(acts)))
check("game has the room's exact screen string once", game.count('screen=canvas(2800,1920)') == 1)
check('name / accent / colour', pack['name'] == 'Sat Hunter' and pack['accent'] == '#00a6fb' and pack['color'].startswith('#'), f"{pack['name']} {pack['accent']} {pack['color']}")
check('game id', "GAME_ID='sat-hunter'" in game.replace(' ', '').replace('"', "'"))
check('Bonus Lab gated (test page or ?lab=1)', 'lab=1' in game)
head = re.search(r'<style>(.*?)</style>', game, re.S).group(1)
check('css equals the game head style', head == pack['css'])

# ---------------------------------------------------------------- 1. engine and adapter
eng = find(game, 'Block Fortune v2 engine'); lay = find(game, 'One existing LAYR account')
check('engine and adapter present in game', eng is not None and lay is not None)
src_eng = open(os.path.join(HERE, 'src', 'bf-engine.js'), encoding='utf-8').read(); src_lay = open(os.path.join(HERE, 'src', 'layr-adapter.js'), encoding='utf-8').read()
check('engine in game equals src/bf-engine.js', eng == src_eng)
check('adapter in game equals src/layr-adapter.js', lay == src_lay)
check('engine sha256 matches the recorded Forever Twins hash', sha(eng or '') == ENGINE_SHA, f"{he(eng or '')} · {len((eng or '').encode())} bytes")
check('adapter sha256 matches the recorded Forever Twins hash', sha(lay or '') == ADAPTER_SHA, f"{he(lay or '')} · {len((lay or '').encode())} bytes")
casino = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'public', 'casino', 'index.html')
if os.path.exists(casino):
    txt = open(casino, encoding='utf-8', errors='ignore').read(); i = txt.index('window.PX_MACHINE_PACKS=') + len('window.PX_MACHINE_PACKS=')
    packs, _ = json.JSONDecoder().raw_decode(txt[i:]); ft = next(p for p in packs if p['name'] == 'Forever Twins'); fg = dec(ft['game'])
    fe = find(fg, 'Block Fortune v2 engine'); fl = find(fg, 'One existing LAYR account')
    check('engine byte-identical to Forever Twins (casino/index.html)', eng == fe, f"sha256 {he(eng or '')} / {he(fe)}")
    check('LAYR adapter byte-identical to Forever Twins (casino/index.html)', lay == fl, f"sha256 {he(lay or '')} / {he(fl)}")
else: print('SKIP Forever Twins comparison: casino file not found at', casino)
snap = os.path.join(ROOT, '_claude_scratch', 'sat-hunter', 'forever-twins-game.html')
if os.path.exists(snap):
    sg = open(snap, encoding='utf-8').read(); se, sl = find(sg, 'Block Fortune v2 engine'), find(sg, 'One existing LAYR account')
    check('engine and adapter byte-identical to the saved Forever Twins game', se == eng and sl == lay, f"{he(se or '')} / {he(sl or '')}")

# ---------------------------------------------------------------- 3. theme script, markup, network, wording
theme = next((s for s in scripts(game) if "GAME_ID='sat-hunter'" in s), '')
check('theme script found', len(theme) > 50000, f'{len(theme):,} chars')
body = re.search(r'</style></head><body>(.*?)<script>', game, re.S).group(1)
check('window.SAT_RECORDS is embedded', any(s.startswith('window.SAT_RECORDS=') for s in scripts(game)))
no_net = [t for t in ('fetch(', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'sendBeacon', 'importScripts', 'mempool.space', 'hiro.so', 'xtrata.xyz/hiro', 'registry.v2') if t in theme]
check('no network call anywhere in the theme script', not no_net, ', '.join(no_net))
STALE = ['THE HALVING', 'The Halving', 'HALVING CYCLE', 'Halving Cycle', 'COINBASE MESSAGE', 'Coinbase message', 'HASHRATE', 'EPOCH POT', 'Epoch Pot', 'HALVE OR DOUBLE', 'Halve or Double',
         'NOT YET FOREVER', 'AUTO-MINE', 'MAX HASH', 'HALVING_RECORDS', 'SPINNING UP THE FANS', 'bitcoin-mark']
left = [t for t in STALE if t in theme or t in body or t in head]
check("none of the Halving's words are left in the theme script, markup or css", not left, ', '.join(left))
need = ['HUNT', 'SATS · TOTAL BET', 'AUTO-HUNT', 'RARITY', 'ODD SAT', 'EVEN SAT', 'WARMING THE LAMPS', 'FAIR PLAY', 'HOLDER POT', 'SETTINGS', 'LAYR', 'linkBitcoinWallet', 'readWalletSats', 'recordCameos']
miss = [t for t in need if t not in theme and t not in body]
check('required wording and holder stubs present', not miss, ', '.join(miss))
check('WALLET LINKING: NOT LIVE YET and SHARE PER WALLET are in the game', 'WALLET LINKING: NOT LIVE YET' in theme and 'SHARE PER WALLET' in theme)

# ---------------------------------------------------------------- 5. every script parses; the theme script as one piece
node = shutil.which('node')
if node:
    with tempfile.TemporaryDirectory() as td:
        for k, s in enumerate(scripts(game)):
            p = os.path.join(td, f's{k}.js'); open(p, 'w', encoding='utf-8').write(s)
            r = subprocess.run([node, '--check', p], capture_output=True, text=True)
            check(f'node --check script {k} ({len(s):,} chars)', r.returncode == 0, (r.stderr.strip().splitlines() or [''])[-1][:200] if r.returncode else '')
else: print('SKIP node --check: node not found')

# ---------------------------------------------------------------- 4. records, recomputed independently
HALVING, DIFF, CYCLE = 210000, 2016, 6 * 210000
SUPPLY = 2099999997690000
sub = lambda h: (50 * 10**8) >> (h // HALVING)
check('supply = sum of every block subsidy', sum(HALVING * ((50 * 10**8) >> k) for k in range(34)) == SUPPLY)
def first_sat(h):
    e, r = divmod(h, HALVING); return sum(HALVING * ((50 * 10**8) >> k) for k in range(e)) + r * ((50 * 10**8) >> e)
def block_of(n):
    lo, hi = 0, 6929999
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if first_sat(mid) <= n: lo = mid
        else: hi = mid - 1
    return lo
def name_of(n):
    x = SUPPLY - n; s = ''
    while x > 0: s = chr(97 + (x - 1) % 26) + s; x = (x - 1) // 26
    return s
def rarity_of(n):
    if n == 0: return 'mythic'
    h = block_of(n)
    if n != first_sat(h): return 'common'
    return 'legendary' if h % CYCLE == 0 else 'epic' if h % HALVING == 0 else 'rare' if h % DIFF == 0 else 'uncommon'
rec = json.load(open(os.path.join(HERE, 'art', 'records.json'), encoding='utf-8'))
check('records.json supply constant', rec['supply'] == SUPPLY)
check('sat 0 is nvtdijuwxlp; first sat of block 210,000 is 1050000000000000', name_of(0) == 'nvtdijuwxlp' and first_sat(210000) == 1050000000000000)
pat = None
try: pat = set(json.load(open(os.path.join(ROOT, 'tools', 'who-is-satoshi', 'art', 'records.json')))['patoshi']['heights'])
except Exception: print('SKIP Patoshi membership check: tools/who-is-satoshi/art/records.json not found')
bad = []; count = 0
def sat_ok(r, where):
    global count; count += 1
    n = r['n']; h = block_of(n); off = n - first_sat(h)
    exp = set()
    if rarity_of(n) != 'common': exp.add(rarity_of(n))
    if off == sub(h) - 1 and h != 0: exp.add('black')
    if str(n) == str(n)[::-1]: exp.add('palindrome')
    if h < 1000: exp.add('vintage')
    if pat is not None and h in pat: exp.add('nakamoto')
    if h == 9: exp.add('block9')
    if h == 78: exp.add('block78')
    got = set(r['tags']) - {'pizza'}
    if pat is None: exp.discard('nakamoto'); got.discard('nakamoto')
    prob = [k for k, c in (('str', r['str'] != str(n)), ('block', r['block'] != h), ('offset', r['offset'] != off), ('decimal', r['decimal'] != f'{h}.{off}'),
        ('degree', r['degree'] != f"{h // CYCLE}°{h % HALVING}′{h % DIFF}″{off}‴"), ('name', r['name'] != name_of(n)),
        ('rarity', r['rarity'] != rarity_of(n) and not (r['rarity'] == 'pizza' and rarity_of(n) == 'common')), ('tags %s vs %s' % (sorted(got), sorted(exp)), got != exp),
        ('subsidy', r['subsidy'] != sub(h)), ('check link', r['check'] != f'https://ordinals.com/sat/{n}'), ('offset range', not (0 <= off < sub(h)))) if c]
    if prob: bad.append((where, n, prob))
T = rec['types']
check('ten symbol pools', sorted(T) == sorted(['cherry', 'lemon', 'chip', 'block', 'artifact', 'bitcoin', 'wild', 'scatter', 'vault', 'chain']), str({k: len(v) for k, v in T.items()}))
check('8 to 26 records per symbol', all(8 <= len(v) <= 26 for v in T.values()))
slot_rules = {'cherry': lambda r: r['offset'] == 0 and r['rarity'] == 'uncommon', 'lemon': lambda r: r['offset'] == sub(r['block']) - 1 and 'black' in r['tags'] and r.get('blackName', '').startswith('Black '),
    'chip': lambda r: str(r['n']) == str(r['n'])[::-1], 'block': lambda r: r['block'] < 1000, 'bitcoin': lambda r: r['offset'] == 0 and r['block'] % HALVING == 0 and r['rarity'] == 'epic' and isinstance(r.get('mined'), bool),
    'wild': lambda r: r['offset'] == 0 and r['block'] % DIFF == 0 and r['rarity'] == 'rare', 'scatter': lambda r: 'nakamoto' in r['tags'], 'vault': lambda r: r['block'] == 9}
for slot, fn in slot_rules.items():
    for r in T[slot]:
        sat_ok(r, slot)
        if not fn(r): bad.append((slot + ' rule', r['n'], ['does not belong in this pool']))
for r in T['bitcoin']:
    if r['mined'] is False and 'due about' not in str(r.get('when', '')): bad.append(('bitcoin when', r['n'], ['unmined epic needs a due year']))
for r in T['artifact']:
    if re.fullmatch(r'[0-9a-f]{64}', r.get('tx', '')) is None or r.get('block') != 57043 or r.get('date') != '22 May 2010' or not r.get('label') or not r.get('fact'): bad.append(('artifact facts', r.get('label'), ['tx/block/date/label/fact']))
    if r.get('satStatus') == 'indexed': sat_ok(r, 'artifact')
    elif r.get('satStatus') != 'pending': bad.append(('artifact satStatus', r.get('label'), [str(r.get('satStatus'))]))
for r in T['chain']:
    if r['first'] != first_sat(r['block']) or r['last'] != first_sat(r['block'] + 1) - 1 or r['subsidy'] != sub(r['block']) or r['check'] != f"https://ordinals.com/block/{r['block']}": bad.append(('chain range', r['block'], ['range']))
hn = 0; chain_blocks = {r['block'] for r in T['chain']}
for hu in rec['hunts']:
    if hu['first'] != first_sat(hu['block']) or hu['last'] != first_sat(hu['block'] + 1) - 1: bad.append(('hunt range', hu['block'], ['range']))
    ns = [f['n'] for f in hu['finds']]
    if len(set(ns)) != len(ns) or len(ns) < 17 or ns[0] != hu['first'] or ns[1] != hu['last']: bad.append(('hunt finds', hu['block'], ['%d finds, duplicates or wrong ends' % len(ns)]))
    for f in hu['finds']:
        hn += 1; sat_ok(f, 'hunt %d' % hu['block'])
        if not (hu['first'] <= f['n'] <= hu['last']): bad.append(('hunt find outside range', f['n'], []))
    if hu['block'] not in chain_blocks: bad.append(('hunt not in the chain pool', hu['block'], []))
my = rec['mythic']; sat_ok(my, 'mythic')
if not (my['n'] == 0 and my['name'] == 'nvtdijuwxlp' and my['degree'] == '0°0′0″0‴' and my['block'] == 0 and my['rarity'] == 'mythic' and my['genesis']['hash'].startswith('000000000019d668') and 'Chancellor' in my['genesis']['headline']): bad.append(('mythic', 0, ['sat 0 / genesis data']))
for r in rec['exotic']: sat_ok(r, 'exotic')
gp = 0
for g in rec['gamble']:
    gp += 1
    if g['parity'] != ('odd' if g['n'] % 2 else 'even') or g['block'] != block_of(g['n']) or g['check'] != f"https://ordinals.com/sat/{g['n']}": bad.append(('gamble', g['n'], ['parity/block/check']))
check('gamble has both parities', {g['parity'] for g in rec['gamble']} == {'odd', 'even'}, f'{gp} sats')
for t in rec['timeline']:
    if block_of(t['n']) != t['block']: bad.append(('timeline', t['block'], ['sat is not in that block']))
check('every sat recomputed from the subsidy rule and the naming algorithm', not bad, f'{count} sats, {len(rec["hunts"])} hunt ranges ({hn} finds), {len(rec["exotic"])} exotic, {gp} gamble sats' + ('' if not bad else f' · {len(bad)} PROBLEMS, first: {bad[:4]}'))
unver = sum(1 for s in T.values() for r in s if not r.get('verified'))
print(f'NOTE {unver} of {sum(len(v) for v in T.values())} pool records are verified=false: the machine marks each "not yet checked" until it is opened on ordinals.com')

# ---------------------------------------------------------------- art files, test page
src_json = os.path.join(PUB, 'art', 'sources.json')
if os.path.exists(src_json):
    sj = json.load(open(src_json, encoding='utf-8')); dump = json.dumps(sj)
    check('sources.json lists the rules and sources and the official art that needs permission (Xverse, Magic Eden)', len(sj.get('logosNeedingPermission') or []) == 2 and 'xverse' in dump.lower() and 'magic eden' in dump.lower() and 'GetBlockSubsidy' in dump and 'patoshi' in dump.lower() and 'ordinals' in dump.lower() and 'pizza' in dump.lower() and 'genesis' in dump.lower())
else: check('art/sources.json exists in the output folder', False)
page = os.path.join(PUB, 'index.html')
if os.path.exists(page):
    pg = open(page, encoding='utf-8').read(); check('test page maps the topper and the counters onto the cabinet', all(t in pg for t in ('topperPlate', 'counterL', 'counterR', 'crest')) and 'flapBoard' not in pg)
else: check('test page exists', False)

# ---------------------------------------------------------------- 6. casino files untouched
hashes = dict(CASINO_HASHES)
if os.path.exists(BASELINE_FILE):
    for line in open(BASELINE_FILE, encoding='utf-8'):
        m = re.match(r'([0-9a-f]{64})\s+(\S+)', line.strip())
        if m: hashes[m.group(2)] = m.group(1)
for rel, want in hashes.items():
    p = os.path.join(ROOT, rel)
    if os.path.exists(p):
        got = hashlib.sha256(open(p, 'rb').read()).hexdigest(); check('unchanged ' + rel, got == want, got[:16])
    else: print('SKIP', rel, 'not found')
print('ALL PASS' if ok else 'SOME CHECKS FAILED'); sys.exit(0 if ok else 1)
