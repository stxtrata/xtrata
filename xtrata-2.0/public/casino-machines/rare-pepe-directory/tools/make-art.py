#!/usr/bin/env python3
"""Writes art/art.js (the bundled art as data URIs) and art/sources.json from the images in art/img and the manifest.
The 14 Bitcoin Pepes are the real twins already inscribed on Bitcoin through Xtrata (ids and checksums recorded in sources.json)."""
import base64, hashlib, json, os
TW = [(2057,2708,'c43ee0443f867710a82a72cce2b9942eb0486e7675ea12b339cb820d36ccddc1'),(1897,2584,'9ea75a2d2bcb29f879341acc76ce55e2c4dccb538bd3b9bab2cd0530fb3edce5'),(2050,2701,'e2ce842475f489ccb7ff8e6dbe68c929a6d5513afe28efff2c88cfd5f09fecc8'),(1903,2590,'f1d9bb978775469aa72fbbd59aecd0d7f097646e6758ab5d3b99c59b6069de16'),(2037,2688,'acea06dcc32828959fa3ad7d4a56f2bfe09f6d71bb9de86d77ba2aee3904cbce'),(1999,2653,'cc4329a38e944c026146a7105813ed10b1b78783983f890da33e08409563a1a1'),(2084,2735,'c07de5c2d0276ea452c6d224ab9447b17f1891f04faaf6d12b6a53b39dd64bd1'),(2043,2694,'6320b871cb93fcbacbe06d72556c75ce74e4ba756693ef0b944f09c056143347'),(2021,2673,'f86da4b38b787043dd9598618437bb5430ddcf82bd5523a82c39469333b061df'),(1937,2619,'2c94f42b64925bfe92fae206cfe636661b9ae826e7d30dd52b999abef78bf696'),(2078,2729,'47a8a30f5e25a2a2689b1ee58d56fab566a64aaa6291aeca0ed23be08b6f7ef7'),(1889,2576,'7bdbc2a99635dda7165de210dd174c4b611188ebe23bee52335d12b626d017fd'),(2072,2723,'659219e77b9ecd7dee9cf81815e477626ef6018853cd997652fcb8611542c877'),(2013,2666,'b27a4e435c9f8619e090ca240d8462e9febdafd36209b991d101b1c1106be281')]
CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X/xtrata-v3-2-3'
pepes, srcs = [], []
for tid, xid, want in sorted(TW):
    data = open(f'art/img/bitcoin-pepes_{tid}.png', 'rb').read(); got = hashlib.sha256(data).hexdigest()
    assert got == want, (tid, got, want)
    pepes.append({'tokenId': tid, 'xtrataId': str(xid), 'src': 'data:image/png;base64,' + base64.b64encode(data).decode()})
    srcs.append({'symbol': 'artifact', 'collection': 'bitcoin-pepes', 'tokenId': tid, 'xtrataId': str(xid), 'url': f'https://xtrata.xyz/inscription/mainnet/{CORE}/{xid}', 'file': f'art/img/bitcoin-pepes_{tid}.png', 'sha256': got, 'format': 'PNG', 'size': [760, 760], 'note': 'native 38px pixel art, inscribed at 20x; the Stacks NFT with a permanent Xtrata twin', 'forever': True})
# Permission-cleared pictures can be dropped in without touching the game: art/cards/<ASSETNAME>.png|jpg|gif|webp for a card
# and art/logos/pepecash.* or art/logos/wallet.* for the two logos. Folders are empty in this build.
# Pictures are bundled at most MAXPX on the long side (default 288, plenty for the card faces) as WebP, so the pack stays small; the
# originals stay in art/cards untouched. Needs Pillow (pip install pillow); without it, or with --full, the originals are bundled as they are.
import io, sys
MAXPX = 288
try:
    from PIL import Image
except ImportError:
    Image = None
FULL = '--full' in sys.argv or Image is None
def bundle(path, ext):
    raw = open(path, 'rb').read()
    if FULL: return raw, {'.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp'}[ext]
    im = Image.open(io.BytesIO(raw))
    if ext == '.gif' and getattr(im, 'n_frames', 1) > 1 and len(raw) < 150_000: return raw, 'image/gif'  # small animated GIFs stay animated
    im.seek(0); im = im.convert('RGBA')
    if max(im.size) > MAXPX: im.thumbnail((MAXPX, MAXPX), Image.LANCZOS)
    out = io.BytesIO(); im.save(out, 'WEBP', quality=76, method=6); return out.getvalue(), 'image/webp'
def pics(folder):
    out = {}
    if os.path.isdir(folder):
        for f in sorted(os.listdir(folder)):
            stem, ext = os.path.splitext(f)
            if ext.lower() not in ('.png', '.jpg', '.jpeg', '.gif', '.webp'): continue
            data, mime = bundle(os.path.join(folder, f), ext.lower()); out[stem] = f'data:{mime};base64,' + base64.b64encode(data).decode()
    return out
cards, logos = pics('art/cards'), pics('art/logos')
RARE_SET = set(open('art/data/rare-pepe-assets.txt').read().split()); FAKE_SET = set(open('art/data/fake-rares-assets.txt').read().split())
art = 'window.RPD_ART=' + json.dumps({'pepes': pepes, 'cards': cards, 'logos': logos}, separators=(',', ':')) + ';\n'
open('art/art.js', 'w').write(art)
man = json.load(open('art/manifest.json'))
src = {
  'generated': '2026-11-01',
  'note': 'What is real and what is a stand-in in this build. Real: every asset name, series and card number on the Rare Pepe and Fake Rare cards (taken from the public Counterparty asset lists in art/data and checked against 31 external Series/Card anchors, below), the 14 Bitcoin Pepes images (the on-chain twins), the helper contract for live Bitcoin Pepes, and the card pictures and the PEPECASH and Rare Pepe Wallet logos in art/cards and art/logos (collected from public pages by the project; every one is listed in art/cards-sources.csv with its source and a permission status of unconfirmed). Stand-ins: cards without a picture, and the Ordinal Pepe GIF, show the real asset name or project name set in type on a card face; nothing is drawn or imitated.',
  'core': CORE.replace('/', '.'),
  'collections': {
    'rare-pepe-directory': {'what': 'Rare Pepe Directory: Counterparty assets in 36 series, 50 cards a series (Series 36 holds the last 24)', 'cards': man['rare']['count'], 'order': 'directory order; series = floor(index/50)+1, card = index%50+1', 'listSource': 'art/data/rare-pepe-assets.txt (compare-v3, jonacarbi, commit 42cf03ad6d3b2dd7edbdf2ea9c028126de0cf71c)', 'pictures': f"{len([c for c in cards if c in RARE_SET])} bundled in art/cards (provenance in art/cards-sources.csv, permission unconfirmed)"},
    'fake-rares': {'what': 'Fake Rares: Counterparty assets', 'cards': man['fake']['listed'], 'listSource': 'art/data/fake-rares-assets.txt (same repo and commit); names filtered to A–Z only, 3 to 13 letters', 'pictures': f"{len([c for c in cards if c in FAKE_SET])} bundled in art/cards"},
    'bitcoin-pepes': {'helperContract': 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-4ever-fakfun', 'registry': 'https://xtrata.xyz/forever-twins/data/registry.v2.json', 'inscribedCountAtBuild': 2089, 'note': 'bundled 14; more load live once a player connects (Hiro events, 6-hour cache)'},
    'ordinal-pepe': {'status': 'Xtrata helper contract not deployed yet: shown greyed with NOT YET FOREVER until it is live. All 100 share one GIF (not bundled).'},
    'pepecash': {'status': 'PEPECASH icon bundled (art/logos/pepecash.png, 48 px, from RarePepeWallet.wtf; permission unconfirmed)'},
    'rare-pepe-wallet': {'status': 'Rare Pepe Wallet logo bundled (art/logos/wallet.png, 200 px; permission unconfirmed)'}
  },
  'twins': srcs,
  'anchors': man['anchors'],
  'anchorCheck': 'tools/make-manifest.py asserts that all 31 anchors (a card that external indexes place at a known Series and Card number) match index//50+1 and index%50+1 in the list order',
  'missing': [
    {'what': 'Pictures for every Rare Pepe and Fake Rare not in art/cards (the machine shows the asset name in type)', 'howToAdd': 'python3 tools/fetch-art.py on a computer with internet access, or drop art/cards/<ASSETNAME>.png|jpg|webp|gif, then python3 tools/make-art.py and node tools/build.mjs'},
    {'what': 'Ordinal Pepe GIF (shared by all 100)', 'why': 'no verified project source; the Xtrata helper is not deployed yet'}
  ],
  'logos': {'xtrata-mark': 'vendor/brand/xtrata-mark.svg, used exactly as supplied', 'parallax-wordmark': 'vendor/brand/parallax-casino-wordmark.svg, exactly as supplied'}
}
json.dump(src, open('art/sources.json', 'w'), indent=1, ensure_ascii=False)
open('art/logos-needing-permission.md', 'w').write("""# Logos and marks that need permission before public launch

- **Xtrata mark**: shipped exactly as supplied (vendor/brand/xtrata-mark.svg), on the lower door and the intro. Ours.
- **ParallaX Casino wordmark and sign**: exactly as supplied. Ours.
- **Rare Pepe cards and their artwork**: each card's art belongs to its artist. Any pictures in art/cards (listed in art/cards-sources.csv, permission "unconfirmed") need each artist's (or the Rare Pepe Directory's) OK before a public launch. The asset names and series and card numbers shown are public Counterparty data.
- **Fake Rares artwork**: the same: each belongs to its artist. Pictures bundled are listed in art/cards-sources.csv.
- **Rare Pepe Wallet (Scrilla) logo**: bundled (art/logos/wallet.png, from RarePepeWallet.wtf). Permission unconfirmed: needs the wallet project's OK before launch.
- **PEPECASH logo**: bundled (art/logos/pepecash.png, a 48 px icon from RarePepeWallet.wtf). Permission unconfirmed: needs the PEPECASH project's OK before launch.
- **Bitcoin Pepes artwork** (14 bundled twins): shown as the on-chain twins. The collection belongs to its holders and creators; get the community's thumbs-up before launch.
- **Ordinal Pepe GIF**: not bundled. Needs the project's permission before it is.
- **Matt Furie / Pepe the Frog**: nothing here draws the character. Cards are shown only by asset name unless an artist has agreed to their art being used.
""")
print('art.js', len(art), 'bytes;', len(pepes), 'pepes; sources.json written')
