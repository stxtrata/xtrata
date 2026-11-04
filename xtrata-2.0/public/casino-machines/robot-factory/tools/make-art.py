#!/usr/bin/env python3
"""Writes art/art.js (the bundled art as data URIs), art/sources.json and art/logos-needing-permission.md.
Inputs:  art/apes/<id>.png          the Forever Twin images already inscribed on Bitcoin (from tools/fetch-apes.py), ids in art/apes-bundle.json
         art/apes-index.json        which ape has a twin, and its Xtrata inscription id
         art/img/{apes,robots,components,msa}/<id>.*   pictures from tools/fetch-art.py (optional)
         art/tiers.json             rarity tier per ape id: G, I, II, III (optional; from tools/fetch-art.py)
         art/logos/megapont.*       the Megapont logo (optional)
Each picture is shrunk to at most 256 px and stored as WebP (needs Pillow; otherwise the original bytes are bundled)."""
import base64, hashlib, io, json, os, sys
try: from PIL import Image
except ImportError: Image = None
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = lambda *p: os.path.join(HERE, 'art', *p)
CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3'
MIME = {'.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp'}
MAXPX = 256
def uri(path, maxpx=MAXPX):
    raw = open(path, 'rb').read(); ext = os.path.splitext(path)[1].lower()
    if Image and '--full' not in sys.argv:
        im = Image.open(io.BytesIO(raw)); im.seek(0); im = im.convert('RGBA')
        if max(im.size) > maxpx: im.thumbnail((maxpx, maxpx), Image.LANCZOS)
        out = io.BytesIO(); im.save(out, 'WEBP', quality=80, method=6); return 'data:image/webp;base64,' + base64.b64encode(out.getvalue()).decode(), hashlib.sha256(raw).hexdigest()
    return f'data:{MIME[ext]};base64,' + base64.b64encode(raw).decode(), hashlib.sha256(raw).hexdigest()
def listing(folder):
    if not os.path.isdir(folder): return []
    return sorted((f for f in os.listdir(folder) if os.path.splitext(f)[1].lower() in MIME), key=lambda f: (len(os.path.splitext(f)[0]), f))
ASRC = lambda a: a  # placeholder

idx = json.load(open(A('apes-index.json')))['tokens']
tiers = json.load(open(A('tiers.json'))) if os.path.exists(A('tiers.json')) else {}
apes, srcs, seen = [], [], set()
for i in json.load(open(A('apes-bundle.json')))['bundled']:
    p = A('apes', f'{i}.png')
    if not os.path.exists(p): continue
    x = int(idx[str(i)][0]); u, h = uri(p); apes.append({'id': i, 'x': x, 'src': u}); seen.add(i)
    srcs.append({'symbol': 'ape', 'collection': 'megapont-ape-club', 'tokenId': i, 'xtrataId': x, 'url': f'https://xtrata.xyz/inscription/mainnet/{CORE.replace(".", "/")}/{x}', 'file': f'art/apes/{i}.png', 'sha256': h, 'forever': True, 'tier': tiers.get(str(i))})
for f in listing(A('img', 'apes')):
    i = int(os.path.splitext(f)[0])
    if i in seen: continue
    x = int(idx.get(str(i), [0])[0]); u, h = uri(A('img', 'apes', f)); apes.append({'id': i, 'x': max(x, 0), 'src': u}); seen.add(i)
    srcs.append({'symbol': 'ape', 'collection': 'megapont-ape-club', 'tokenId': i, 'xtrataId': max(x, 0), 'file': f'art/img/apes/{f}', 'sha256': h, 'forever': x > 0, 'tier': tiers.get(str(i)), 'permission': 'unconfirmed'})
groups = {}
kit = {x['file']: x for x in json.load(open(A('archive', 'kit-sources.json')))} if os.path.exists(A('archive', 'kit-sources.json')) else {}
KITDIR = {'robots': 'robots', 'msa': 'space-agency', 'components': 'components'}
for name, col in (('robots', 'megapont-robots'), ('components', 'megapont-robot-components'), ('msa', 'megapont-space-agency')):
    L = []
    # Recovered historic pictures (art/archive/<group>/, from the Megapont Historic Image Selection kit). Exact token ids were not recovered,
    # so they are labelled A01, A02... and never recorded as a holder cameo.
    for n, f in enumerate(listing(A('archive', name)), 1):
        u, h = uri(A('archive', name, f), 320); L.append({'id': f'A{n:02d}', 'src': u, 'archive': True})
        k = kit.get(f'{KITDIR[name]}/{f}', {})
        srcs.append({'symbol': name, 'collection': col, 'label': f'A{n:02d}', 'title': k.get('title'), 'file': f'art/archive/{name}/{f}', 'sha256': h, 'sourcePage': k.get('source_page'), 'sourceImage': k.get('source_image'), 'date': k.get('date'), 'note': k.get('note'), 'forever': False, 'permission': 'unconfirmed', 'archive': True})
    for f in listing(A('img', name)):
        i = int(os.path.splitext(f)[0]); u, h = uri(A('img', name, f)); L.append({'id': i, 'src': u})
        srcs.append({'symbol': name, 'collection': col, 'tokenId': i, 'file': f'art/img/{name}/{f}', 'sha256': h, 'forever': False, 'permission': 'unconfirmed'})
    groups[name] = L
logos = {}
for f in listing(A('logos')):
    stem = os.path.splitext(f)[0]; logos[stem], h = uri(A('logos', f), 512)
    srcs.append({'symbol': 'logo', 'name': stem, 'file': f'art/logos/{f}', 'sha256': h, 'permission': 'unconfirmed', 'note': 'Official Megapont logo supplied by Jim (Xtrata). The flat dark background was keyed to transparent and the picture cropped to the lettering; the untouched original is art/logos-source/megapont-official-original.png.' if stem == 'megapont' else None})
art = {'apes': apes, 'robots': groups['robots'], 'components': groups['components'], 'msa': groups['msa'], 'logos': logos, 'tiers': tiers or None}
open(A('art.js'), 'w').write('window.RF_ART=' + json.dumps(art, separators=(',', ':')) + ';\nwindow.RF_APES=' + json.dumps({str(a['id']): a['x'] for a in apes if a['x'] > 0}, separators=(',', ':')) + ';\n')
twins = sum(1 for v in idx.values() if v[0] > 0)
json.dump({
  'generated': '2026-11-02',
  'note': 'What is real and what is pending in this build. Real: the recovered historic Megapont pictures in art/archive (10 robots, 7 Space Agency, 1 Components promo; token ids not recovered, labelled A01…), the Megapont Ape Club twins that exist on Bitcoin through Xtrata (shown in full colour with the infinity badge), and the Megapont contract addresses and token-uri patterns below. Pending until tools/fetch-art.py has been run on a computer that can reach api.megapont.com and IPFS: the rarity-tier map, pictures of apes with no twin, more Robots and Space Agency pictures, individual Robot Component pictures (only one promo image survives in the archive and it is not a single component). Until then those symbols show their real name in type on a tile marked ART PENDING; nothing is drawn or imitated.',
  'contracts': {
    'megapont-ape-club': {'contract': 'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.megapont-ape-club-nft', 'tokens': 2500, 'tokenUri': 'ipfs://QmRhkJToXrJYhAGBNP6NLNUTTrXSmuNAF2fH2JKphaJPLx/{id}', 'helper': 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.forever-twin-megapont-ape-club', 'twinsInscribedAtBuild': twins, 'registry': 'https://xtrata.xyz/ft/megapont-ape-club/{id}.json'},
    'megapont-robots': {'contract': 'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.megapont-robot-nft', 'lastTokenId': 1865, 'tokenUri': 'https://api.megapont.com/robots/{id}', 'twin': 'none yet'},
    'megapont-robot-components': {'contract': 'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.megapont-robot-component-nft', 'lastTokenId': 59325, 'tokenUri': 'https://api.megapont.com/components/{id}', 'twin': 'none yet'},
    'megapont-space-agency': {'contract': 'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.megapont-space-agency', 'lastTokenId': 7500, 'tokenUri': 'https://megapont-api-kh0d.onrender.com/metadata/msa/{id}', 'alsoSeen': 'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.megapont-space-agency-nft (2,500 tokens, uri https://api.megapont.com/metadata/msa/{id}); the machine-series CONTRACTS.md lists megapont-space-agency as the verified one', 'twin': 'none yet'}},
  'tierMethod': 'Rarest 2% of apes by trait-rarity score (sum of 1 / apes sharing each trait) = gold frame; the other 98% cut into three equal tiers by score: I (rarest, red), II (blue), III (purple). Computed by tools/fetch-art.py from the apes\' own metadata.',
  'archiveKit': 'Megapont Historic Image Selection (recovered from historic Megapont newsletters 2021-2022, an X promotional montage and NFT Calendar listings; see art/archive/kit-README.md and kit-sources.json). Not used: the two MSA announcement cards, the spacesuit preview interface and the component marketplace mock-ups (not NFT art).',
  'bundled': {'apes': len(apes), 'robots': len(groups['robots']), 'components': len(groups['components']), 'msa': len(groups['msa']), 'logos': list(logos), 'tiersKnown': bool(tiers)},
  'pictures': srcs,
  'brand': {'xtrata-mark': 'machine-series/brand/xtrata-logo.svg, exactly as supplied', 'parallax-wordmark': 'machine-series/brand/parallax-casino-wordmark.svg, exactly as supplied'}
}, open(A('sources.json'), 'w'), indent=1, ensure_ascii=False)
open(A('logos-needing-permission.md'), 'w').write("""# Logos and marks that need permission before public launch

- **Megapont logo** (the scatter symbol, and the Megapont name on the cabinet's riveted plate): %s Megapont's official mark belongs to Megapont. Get their OK before a public launch.
- **Recovered historic Megapont pictures** (art/archive: 10 robots, 7 Space Agency, 1 Components promo): collected from old Megapont newsletters, an X montage and NFT Calendar listings (sources in art/archive/kit-sources.json). They are Megapont's and the artists' work, shown as references with unconfirmed permission.\n- **Megapont Ape Club, Robots, Robot Components and Space Agency artwork**: each NFT's art belongs to its holders and the Megapont creators. Everything fetched by tools/fetch-art.py is listed in art/fetch-log.csv with its source URL and permission "unconfirmed". The apes shown in full colour are the on-chain Forever Twins, which still need the community's and Megapont's thumbs-up for use in a casino.
- **Xtrata mark and ParallaX Casino wordmark and sign**: shipped exactly as supplied. Ours.
- **"Megapont" as a name on a gambling product**: check with Megapont that naming their collections on the reels and the jackpot ("Megapont Prime") is fine.
- **Stacks / Hiro**: only public read-only API calls are used; no marks are shown.
""" % ('Bundled: the official logo supplied by Jim (art/logos/megapont.png; the untouched original is art/logos-source/megapont-official-original.png).' if 'megapont' in logos else 'NOT bundled yet in this build (the scatter shows the name "MEGAPONT" in type). Run tools/fetch-art.py or save the logo as art/logos/megapont.png.'))
print(f"art.js: {len(apes)} apes ({sum(1 for a in apes if a['x']>0)} twins), {len(groups['robots'])} robots, {len(groups['components'])} components, {len(groups['msa'])} msa, logos {list(logos)}, tiers {'yes' if tiers else 'no'}")
