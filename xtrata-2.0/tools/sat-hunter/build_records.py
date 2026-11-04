#!/usr/bin/env python3
"""Sat Hunter records: every sat on the reels, computed offline with ordinal theory's numbering.

Run:  python3 tools/sat-hunter/build_records.py        -> tools/sat-hunter/art/records.json
Nothing here is fetched or guessed: sat numbers come from the subsidy schedule (first sat of block h = sum of all earlier
subsidies), rarity/degree/name from ord's own rules, and the block lists from public facts recorded in the notes.
Self-checks run before anything is written (supply total, sat 0's name, known epic/palindrome examples).
The Pizza sat ranges need a full ord index; if art/pizza-ranges.json exists (made by fetch_pizza.py on a machine that can
reach ordinals.com) the Pizza tiles use real ranges, otherwise they carry only the verified transaction facts."""
import json, os, sys, datetime
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'art'); os.makedirs(OUT, exist_ok=True)
HALVING, DIFF, CYCLE_E = 210000, 2016, 6
SUPPLY = 2099999997690000          # ord's Sat::SUPPLY (sum of every block subsidy over 33 epochs); self-checked below
sub = lambda h: (50 * 10**8) >> (h // HALVING)
_first = {}
def first_sat(h):
    if h in _first: return _first[h]
    e, r = divmod(h, HALVING); s = 0
    for k in range(e): s += HALVING * ((50 * 10**8) >> k)
    s += r * ((50 * 10**8) >> e); _first[h] = s; return s
last_sat = lambda h: first_sat(h + 1) - 1
def block_of(n):
    lo, hi = 0, 6929999
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if first_sat(mid) <= n: lo = mid
        else: hi = mid - 1
    return lo
def sat_name(n):
    x = SUPPLY - n; s = ''
    while x > 0: s = chr(97 + (x - 1) % 26) + s; x = (x - 1) // 26
    return s
def degree(n):
    h = block_of(n); off = n - first_sat(h)
    return f"{h // (HALVING * CYCLE_E)}°{h % HALVING}′{h % DIFF}″{off}‴"
def rarity(n):
    if n == 0: return 'mythic'
    h = block_of(n); off = n - first_sat(h)
    if off: return 'common'
    if h % HALVING == 0 and h % DIFF == 0: return 'legendary'
    if h % HALVING == 0: return 'epic'
    if h % DIFF == 0: return 'rare'
    return 'uncommon'
def is_pal(n): s = str(n); return s == s[::-1]
def next_pal(n):
    s = str(n); L = len(s); half = s[:(L + 1) // 2]
    mk = lambda hf: int(hf + (hf[:-1] if L % 2 else hf)[::-1])
    p = mk(half)
    if p >= n: return p
    hf = str(int(half) + 1)
    if len(hf) > len(half): return int('1' + '0' * (L - 1) + '1')
    return mk(hf)

# ---- self-checks (any failure stops the build) ----
tot = sum(HALVING * ((50 * 10**8) >> k) for k in range(34))
assert tot == SUPPLY, ('supply', tot)
assert sat_name(0) == 'nvtdijuwxlp', sat_name(0)
assert first_sat(210000) == 1050000000000000 and first_sat(840000) == 1968750000000000
assert is_pal(2708111118072) and block_of(2708111118072) == 541
assert rarity(first_sat(840000)) == 'epic' and rarity(first_sat(2016)) == 'rare' and rarity(first_sat(1260000)) == 'legendary'

PATOSHI = json.load(open(os.path.join(HERE, '..', 'who-is-satoshi', 'art', 'records.json')))['patoshi']
PAT = set(PATOSHI['heights'])
BTC = json.load(open(os.path.join(HERE, '..', '..', 'public', 'casino-machines', 'plebs-legends', 'art', 'sources.json')))['bitcoin']
PZ, GEN = BTC['pizzaDay'], BTC['genesisBlock']
SRC_ORD = 'https://ordinals.com/sat/'
EVENT = {1: 'the first block after genesis', 9: 'a block whose coinbase was spent in the first Bitcoin transaction', 78: 'a block mined by Hal Finney, the first block not mined by Satoshi',
         170: 'the block of the first Bitcoin transaction, 12 Jan 2009', 57043: 'the block that confirmed the 22 May 2010 pizza purchase', 541: 'home of the palindrome sat 2708111118072',
         32256: 'an early difficulty adjustment', 2016: 'the first difficulty adjustment boundary'}
ev = lambda h: EVENT.get(h, '')

def rec(n, kind, story, extra=None):
    h = block_of(n); off = n - first_sat(h)
    tags = []
    if rarity(n) != 'common': tags.append(rarity(n))
    if off == sub(h) - 1 and h != 0: tags.append('black')
    if is_pal(n): tags.append('palindrome')
    if h < 1000: tags.append('vintage')
    if h in PAT: tags.append('nakamoto')
    if h == 9: tags.append('block9')
    if h == 78: tags.append('block78')
    d = {'n': n, 'str': str(n), 'block': h, 'offset': off, 'decimal': f'{h}.{off}', 'degree': degree(n), 'name': sat_name(n),
         'percentile': round(n / (SUPPLY - 1) * 100, 10), 'rarity': rarity(n), 'tags': tags, 'subsidy': sub(h), 'kind': kind,
         'story': story, 'check': SRC_ORD + str(n), 'verified': False, 'mined': True}
    if extra: d.update(extra)
    return d

records = {'generated': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ'), 'supply': SUPPLY, 'types': {}, 'notes': {}}
T = records['types']
# cherry: Uncommon sat = the first sat of a block
UNC = [1, 2, 3, 9, 78, 170, 1000, 5000, 10000, 57043, 100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000, 550000, 600000, 650000, 700000, 750000, 800000, 850000]
T['cherry'] = [rec(first_sat(h), 'cherry', f'The first sat of block {h:,}' + (f', {ev(h)}' if ev(h) else '') + '.') for h in UNC if rarity(first_sat(h)) == 'uncommon']
# lemon: Black sat = the last sat of a block
BLK = [1, 2, 3, 9, 78, 170, 1000, 5000, 10000, 57043, 100000, 150000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 850000, 32255, 209999]
def black_name(h):
    n1 = h + 1
    return 'Black Epic' if n1 % HALVING == 0 else 'Black Rare' if n1 % DIFF == 0 else 'Black Uncommon'
T['lemon'] = [rec(last_sat(h), 'lemon', f'The last sat of block {h:,}, a {black_name(h)}' + (f' ({ev(h)})' if ev(h) else '') + '.', {'blackName': black_name(h)}) for h in BLK]
# chip: Palindrome sat, found inside a real block's range
PALB = [1, 9, 78, 170, 541, 1000, 2016, 5000, 10000, 32256, 57043, 100000, 150000, 200000, 250000, 300000, 400000, 500000, 600000, 700000, 800000]
T['chip'] = []
for h in PALB:
    n = 2708111118072 if h == 541 else next_pal(first_sat(h) + (h * 104729 % (sub(h) // 2)) + 1)
    assert first_sat(h) <= n <= last_sat(h), (h, n)
    T['chip'].append(rec(n, 'chip', f'A palindrome: {n} reads the same both ways. It sits in block {h:,}' + (f' ({ev(h)})' if ev(h) else '') + '.'))
# block: Vintage sat = any sat from the first 1,000 blocks (some indexes count the first 10,000)
VIN = [1, 2, 3, 5, 9, 10, 21, 50, 78, 100, 170, 200, 250, 321, 400, 500, 600, 666, 750, 800, 900, 999]
T['block'] = [rec(first_sat(h) + 1 + (h * 7919 % (sub(h) - 2)), 'block', f'A vintage sat from block {h}, one of the first 1,000 blocks' + (f' ({ev(h)})' if ev(h) else '') + '.') for h in VIN]
# artifact: Pizza sat. The real sat ranges need a full ord index; art/pizza-ranges.json is used when present, else only verified facts.
pr = os.path.join(OUT, 'pizza-ranges.json'); pz_ranges = json.load(open(pr)) if os.path.exists(pr) else None
PZ_FACTS = [('THE PURCHASE', '10,000 BTC for two pizzas'), ('THE TRANSACTION', PZ['tx']), ('THE BLOCK', f"Confirmed in block {PZ['block']:,}"),
    ('THE BLOCK HASH', PZ['blockHash']), ('THE BUYER', 'Laszlo Hanyecz, on bitcointalk.org'), ('THE DATE', f"{PZ['date']}: Bitcoin Pizza Day"),
    ('THE PRICE', 'The first known purchase of goods with bitcoin'), ('THE ORDER', 'Two pizzas, ordered for him by another forum user')]
T['artifact'] = []
for i, (lab, fact) in enumerate(PZ_FACTS):
    d = {'kind': 'artifact', 'label': lab, 'fact': fact, 'tx': PZ['tx'], 'block': PZ['block'], 'blockHash': PZ['blockHash'], 'timeUnix': PZ['timeUnix'], 'date': PZ['date'],
         'rarity': 'pizza', 'tags': ['pizza'], 'check': 'https://ordinals.com/tx/' + PZ['tx'], 'verified': False, 'mined': True, 'satStatus': 'pending',
         'story': 'Pizza sats are the sats spent in the 22 May 2010 pizza purchase.'}
    if pz_ranges and pz_ranges.get('ranges'):
        rg = pz_ranges['ranges'][i % len(pz_ranges['ranges'])]; n = rg[0] + (rg[1] - rg[0]) * ((i * 37) % 97) // 97
        r = rec(n, 'artifact', d['story']); r['tags'] = ['pizza'] + [t for t in r['tags'] if t != 'pizza']; r['rarity'] = r['rarity'] if r['rarity'] != 'common' else 'pizza'
        d.update(r, label=lab, fact=fact, satStatus='indexed', tx=PZ['tx'], check=SRC_ORD + str(n))
    T['artifact'].append(d)
# bitcoin: Epic sat = first sat of a halving epoch (the jackpot symbol); future halvings are real sat numbers not yet mined
T['bitcoin'] = []
WHEN = {1: 'November 2012', 2: 'July 2016', 3: 'May 2020', 4: 'April 2024'}
for k in [k for k in range(1, 24) if k % 6][:19]:
    h = k * HALVING; mined = k <= 4; when = WHEN.get(k) or f'due about {2028 + 4 * (k - 5)}'
    s = f"The first sat of block {h:,}, the start of epoch {k} (subsidy {sub(h) / 1e8:g} BTC), " + (f'mined {when}.' if mined else f'{when}, not yet mined.')
    T['bitcoin'].append(rec(first_sat(h), 'bitcoin', s, {'mined': mined, 'when': when, 'epoch': k, 'subsidyBtc': sub(h) / 1e8}))
# wild: Rare sat = first sat of a difficulty adjustment period
RARE = [2016, 4032, 32256, 50400, 100800, 151200, 201600, 252000, 302400, 352800, 403200, 453600, 504000, 554400, 604800, 655200, 705600, 756000, 806400, 856800]
T['wild'] = [rec(first_sat(h), 'wild', f'The first sat of difficulty period {h // DIFF:,}, block {h:,}' + (f' ({ev(h)})' if ev(h) else '') + '.', {'period': h // DIFF}) for h in RARE if rarity(first_sat(h)) == 'rare']
# scatter: Nakamoto sat = a sat from a Patoshi-pattern block (mined by Satoshi)
NAK = [h for h in PATOSHI['heights'] if h != 9][:26]
T['scatter'] = [rec(first_sat(h) + 1_000_000_000 + (h * 104729 % 3_000_000_000), 'scatter', f'A sat from block {h:,}, a block in the Patoshi pattern (mined by Satoshi).') for h in NAK]
# vault: Block 9 sats
OFFS = [0, 1, 777_777, 10_000_000, 123_456_789, 500_000_000, 999_999_999, 1_000_000_000, 1_618_033_988, 2_000_000_000, 2_222_222_222, 2_718_281_828, 3_141_592_653, 3_333_333_333, 3_500_000_000, 4_000_000_000, 4_200_000_000, 4_500_000_000, 4_700_000_000, 4_900_000_000, 4_999_999_998, 4_999_999_999]
b9s = first_sat(9); T['vault'] = []
for off in OFFS:
    st = ('The very first sat of block 9. ' if off == 0 else 'The last sat of block 9. ' if off == sub(9) - 1 else f'Sat {off:,} of block 9. ') + "Block 9's coinbase was spent in the first Bitcoin transaction (block 170, 12 Jan 2009), so these are the oldest sats known to have moved."
    T['vault'].append(rec(b9s + off, 'vault', st, {'story2': "Satoshi sent 10 BTC to Hal Finney in block 170. Which output a given sat followed is set by ordinal theory's first-in, first-out rule: check it on ordinals.com."}))
# chain: Sat range = a real block's full range under the loupe, with the real sats found in it (first, last, palindromes)
RANGES = [1, 2, 3, 9, 21, 78, 100, 170, 250, 400, 541, 600, 800, 1000, 5000, 10000, 32256, 57043, 100000, 150000, 200000]
HUNTS = []
for h in RANGES:
    a, b = first_sat(h), last_sat(h); finds = [rec(a, 'chain', f'The first sat of block {h:,}.'), rec(b, 'chain', f'The last sat of block {h:,}.')]
    seen = {a, b}
    for i in range(1, 40):
        p = next_pal(a + (b - a) * i // 40 + i)
        if a < p < b and p not in seen: seen.add(p); finds.append(rec(p, 'chain', f'A palindrome inside block {h:,}.'))
    if len(finds) < 17: continue
    finds = finds[:2] + sorted(finds[2:19], key=lambda r: r['n'])
    HUNTS.append({'block': h, 'first': a, 'last': b, 'subsidy': sub(h), 'event': ev(h), 'finds': finds, 'check': f'https://ordinals.com/block/{h}'})
T['chain'] = [{'kind': 'chain', 'block': x['block'], 'first': x['first'], 'last': x['last'], 'subsidy': x['subsidy'], 'event': x['event'], 'check': x['check'], 'rarity': 'range', 'tags': ['range'], 'verified': False, 'mined': True} for x in HUNTS]
records['hunts'] = HUNTS
# the jackpot screen: sat 0, the mythic sat of the genesis block
records['mythic'] = rec(0, 'mythic', "The first sat of the genesis block: Bitcoin's mythic sat. Its 50 BTC subsidy can never be spent.", {'genesis': {'hash': GEN['hash'], 'coinbaseTx': GEN['coinbaseTx'], 'headline': GEN['headline'], 'timeUnix': GEN['timeUnix'], 'timeUtc': GEN['timeUtc'], 'source': 'Plebs & Legends build: mempool.space block and coinbase scriptsig'}})
# the gamble: real sat numbers for Odd Sat or Even Sat (the engine decides the result; the reveal shows a real sat of the right parity)
records['gamble'] = []
for h in [1, 9, 78, 170, 541, 1000, 5000, 10000, 57043, 100000, 210000, 300000, 420000, 500000, 630000, 700000, 840000]:
    for dl in range(4):
        n = first_sat(h) + 17 + dl * 1013 + h % 7
        records['gamble'].append({'n': n, 'str': str(n), 'block': block_of(n), 'parity': 'odd' if n % 2 else 'even', 'check': SRC_ORD + str(n)})
# the Block 9 Vault tubes: exotic sats with a story
records['exotic'] = [rec(0, 'exotic', "Sat 0: the genesis block's first sat.", {'tubeName': 'Mythic'}),
    rec(first_sat(1), 'exotic', 'The first sat of block 1, the first block after genesis.', {'tubeName': 'Block 1'}),
    rec(b9s, 'exotic', 'The first sat of block 9.', {'tubeName': 'Block 9'}), rec(last_sat(9), 'exotic', 'The last sat of block 9.', {'tubeName': 'Block 9 black'}),
    rec(first_sat(78), 'exotic', 'The first sat of block 78, mined by Hal Finney.', {'tubeName': 'Block 78'}),
    rec(first_sat(170), 'exotic', 'The first sat of block 170, which holds the first Bitcoin transaction.', {'tubeName': 'First transaction'}),
    rec(2708111118072, 'exotic', 'A palindrome from block 541.', {'tubeName': 'Palindrome'}),
    rec(first_sat(2016), 'exotic', 'The first sat of difficulty period 1.', {'tubeName': 'Rare'}),
    rec(first_sat(210000), 'exotic', 'The first sat of the first halving epoch.', {'tubeName': 'Epic'}),
    rec(first_sat(840000), 'exotic', 'The first sat of block 840,000, the fourth halving.', {'tubeName': 'Epic'}),
    rec(first_sat(PZ['block']), 'exotic', 'The first sat of the block that confirmed the pizza purchase.', {'tubeName': 'Pizza block'})]
# the Satoshi's Stash timeline: early blocks along 2009 (dates only where recorded)
records['timeline'] = [{'block': 0, 'n': 0, 'label': 'GENESIS', 'date': '3 Jan 2009'}, {'block': 1, 'n': first_sat(1), 'label': 'BLOCK 1', 'date': 'Jan 2009'}, {'block': 9, 'n': first_sat(9), 'label': 'BLOCK 9', 'date': 'Jan 2009'},
    {'block': 170, 'n': first_sat(170), 'label': 'FIRST TX', 'date': '12 Jan 2009'}] + [{'block': h, 'n': first_sat(h) + 1_000_000_000, 'label': f'BLOCK {h}', 'date': ''} for h in (3, 4, 5, 6, 7, 8, 10, 11, 13, 14, 15)]
records['notes'] = {'formula': "Computed offline with ordinal theory's numbering (first sat of block h = sum of all earlier subsidies). Not yet opened on ordinals.com from the build machine, so verified=false until checked.",
    'tiers': {'mythic': 'sat 0 only', 'legendary': 'first sat of a cycle (block divisible by 1,260,000)', 'epic': 'first sat of a halving epoch (block divisible by 210,000)', 'rare': 'first sat of a difficulty adjustment period (block divisible by 2,016)', 'uncommon': 'first sat of a block'},
    'definitions': {'black': "the last sat of a block (a community term, not one of ord's rarities)", 'palindrome': 'a sat whose decimal number reads the same both ways', 'vintage': 'a sat from the first 1,000 blocks (some indexes count the first 10,000)',
        'nakamoto': 'a sat from a block in the Patoshi pattern, mined by Satoshi (list: bensig/patoshi-addresses @ ' + PATOSHI['commit'][:7] + '; pattern by Sergio Demian Lerner, dataset by Jameson Lopp)', 'block9': 'a sat from block 9, the oldest sats known to have moved', 'pizza': 'the sats spent in the 22 May 2010 pizza purchase'},
    'pizzaRanges': 'indexed' if (pz_ranges and pz_ranges.get('ranges')) else 'pending: run tools/sat-hunter/fetch_pizza.py on a machine that can reach ordinals.com, then rebuild'}
json.dump(records, open(os.path.join(OUT, 'records.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print({k: len(v) for k, v in T.items()}, 'hunts', len(HUNTS), 'finds/range', min(len(h['finds']) for h in HUNTS), 'gamble', len(records['gamble']))
print('sat 0 name', sat_name(0), '| epic 840000', first_sat(840000), degree(first_sat(840000)), rarity(first_sat(840000)), '| size', os.path.getsize(os.path.join(OUT, 'records.json')))
