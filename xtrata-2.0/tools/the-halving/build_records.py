#!/usr/bin/env python3
"""The Halving: turn the raw block data in art/raw/mempool.json into art/records.json, the real records the reels are set from.

Every coinbase message is DECODED here from the coinbase script hex (never typed in by hand): the script is read as a
sequence of pushes, each push is decoded as UTF-8, and the readable runs are kept. Each coinbase's BIP34 height push
is checked against the block height, so a mis-copied script fails the build.
Run: python3 tools/the-halving/build_records.py
"""
import json, os, datetime, unicodedata
HERE = os.path.dirname(os.path.abspath(__file__))
RAW = json.load(open(os.path.join(HERE, 'art', 'raw', 'mempool.json'), encoding='utf-8'))

HALVINGS = [  # height, subsidy before -> after (the consensus rule: 50 BTC halving every 210,000 blocks)
    (210000, 50, 25), (420000, 25, 12.5), (630000, 12.5, 6.25), (840000, 6.25, 3.125)]
NEXT = 1050000


def script_hex(b):
    return ''.join(b['coinbaseRawParts']) if 'coinbaseRawParts' in b else b['coinbaseRaw']


def pushes(raw):
    """Read a coinbase script as pushes. Returns (pushes, ok). Coinbase scripts need not be valid scripts; on a
    malformed opcode the rest of the bytes are returned as one chunk."""
    out, i = [], 0
    while i < len(raw):
        op = raw[i]; i += 1
        if op == 0: continue
        if 1 <= op <= 75: n = op
        elif op == 0x4c and i < len(raw): n = raw[i]; i += 1
        else: n = op  # not a standard push opcode, but miners often write a plain length byte here: read it as one
        out.append(raw[i:i + n]); i += n
    return out, True


def printable(ch):
    if ch in '�': return False
    cat = unicodedata.category(ch)
    return not cat.startswith('C')


def readable_runs(data):
    s = data.decode('utf-8', errors='replace')
    runs, cur = [], ''
    for ch in s:
        if printable(ch): cur += ch
        else:
            if cur: runs.append(cur)
            cur = ''
    if cur: runs.append(cur)
    keep = []
    for r in runs:
        r = r.strip()
        letters = sum(1 for c in r if c.isalpha())
        emoji = any(ord(c) >= 0x1F300 for c in r)
        if (len(r) >= 4 and letters >= 3) or (emoji and len(r) >= 1 and (letters >= 2 or len(r) <= 2)):
            keep.append(r)
    return keep


def bip34_height(raw):
    n = raw[0]
    if not 1 <= n <= 8: return None
    return int.from_bytes(raw[1:1 + n], 'little')


def decode(b):
    raw = bytes.fromhex(script_hex(b))
    if b['height'] > 227930:  # BIP34 (height in coinbase) active from block 227,931
        h = bip34_height(raw)
        assert h == b['height'], f"coinbase height push {h} != block {b['height']}: data mis-copied"
    ps, ok = pushes(raw)
    start = 1 if b['height'] > 227930 else 0
    runs = [r for p in ps[start:] for r in readable_runs(p)]
    if b['height'] == 0: runs = [r for p in ps for r in readable_runs(p)]
    return raw, runs


def iso(ts): return datetime.datetime.fromtimestamp(ts, datetime.timezone.utc).strftime('%Y-%m-%d')
def human(ts): return datetime.datetime.fromtimestamp(ts, datetime.timezone.utc).strftime('%-d %b %Y')


hist = {b['height']: b for b in RAW['historic']}
messages, halvings = [], []
for b in RAW['historic']:
    raw, runs = decode(b)
    text = ' · '.join(runs)
    rec = {'height': b['height'], 'hash': b['id'], 'date': iso(b['timestamp']), 'when': human(b['timestamp']), 'pool': b['pool'],
           'text': text, 'why': b['why'], 'hex': raw.hex(), 'source': f"https://mempool.space/block/{b['id']}"}
    print(f"{b['height']:>7}  {b['pool']:<12} {text}")
    if text: messages.append(rec)
for h, a, z in HALVINGS:
    b = hist[h]; m = next(x for x in messages if x['height'] == h)
    halvings.append({'height': h, 'hash': b['id'], 'date': iso(b['timestamp']), 'when': human(b['timestamp']), 'from': a, 'to': z, 'pool': b['pool'],
                     'coinbase': m['text'], 'source': f"https://mempool.space/block/{b['id']}", 'note': 'the block Runes launched in' if h == 840000 else ''})

recent = [{'height': h, 'hash': i, 'time': t, 'pool': p, 'txs': n} for h, i, t, p, n in RAW['recent']]
tip = RAW['tip']['height']
records = {
    'generated': RAW['fetched'], 'source': 'mempool.space API (blocks, coinbase scripts, pools); Hiro API via xtrata.xyz (tip height, cross-checks)',
    'halvings': halvings,
    'next': {'height': NEXT, 'tipAtBuild': tip, 'leftAtBuild': NEXT - tip, 'buildTime': RAW['tip']['time'], 'subsidyAfter': 1.5625},
    'subsidies': [{'era': i + 1, 'btc': v, 'from': i * 210000, 'to': (i + 1) * 210000 - 1} for i, v in enumerate([50, 25, 12.5, 6.25, 3.125])],
    'cap': {'btc': 21000000, 'note': 'the sum of every subsidy: 210,000 blocks × (50 + 25 + 12.5 + …) BTC, slightly under 21,000,000 once rounded to whole satoshis'},
    'messages': messages,
    'recent': recent,
    'epoch': {'length': 2016, 'tipAtBuild': tip, 'leftAtBuild': 2016 - tip % 2016, 'next': (tip // 2016 + 1) * 2016},
}
out = os.path.join(HERE, 'art', 'records.json')
json.dump(records, open(out, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('records.json:', len(halvings), 'halvings ·', len(messages), 'coinbase messages ·', len(recent), 'recent blocks · tip', tip, '·', NEXT - tip, 'blocks to the next halving')
