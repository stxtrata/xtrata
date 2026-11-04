# Builds the stand-alone machine folder: xtrata-2.0/public/casino-machines/genesis-21/
import json, os, shutil, base64, datetime
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.abspath(os.path.join(R, '..', '..', 'public', 'casino-machines', 'genesis-21'))
rd = lambda p: open(os.path.join(R, p), encoding='utf-8').read()
os.makedirs(os.path.join(OUT, 'art', 'brand'), exist_ok=True)
pack = rd('build/g21.pack.json')
json.loads(pack)  # must parse
wm = open(os.path.join(R, 'brand/parallax-casino-wordmark.svg'), 'rb').read()
page = rd('gen/index.template.html')
for k, v in {'__WORDMARK__': 'data:image/svg+xml;base64,' + base64.b64encode(wm).decode(),
             '/*__THREE__*/': rd('ft/script2.js').replace('</script', '<\\/script'),
             '/*__SOFTWARE__*/': rd('ft/script4.js').replace('</script', '<\\/script'),
             '__PACK__': pack.replace('</', '<\\/')}.items():
    assert page.count(k) == 1, k
    page = page.replace(k, v)
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(page)
open(os.path.join(OUT, 'pack.json'), 'w', encoding='utf-8').write(pack)
# art: twins + sources + brand
for c in os.listdir(os.path.join(R, 'art', 'twins-webp')):
    s = os.path.join(R, 'art', 'twins-webp', c)
    if os.path.isdir(s):
        os.makedirs(os.path.join(OUT, 'art', 'twins', c), exist_ok=True)
        for f in os.listdir(s): shutil.copyfile(os.path.join(s, f), os.path.join(OUT, 'art', 'twins', c, f))
for f in ['xtrata-logo.svg', 'parallax-casino-wordmark.svg', 'this-is-1-logo.svg']: shutil.copyfile(os.path.join(R, 'brand', f), os.path.join(OUT, 'art', 'brand', f))
src = json.load(open(os.path.join(R, 'sources.json')))
src['generated'] = datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%MZ')
src['twinsFolder'] = 'art/twins/ (each "file" in "twins" is relative to it). All twin images are WebP: the PNG pixel art is lossless (pixel-identical, checked), the JPEG art is lossy q90. originalFile/originalSha256 record the file as fetched from xtrata.xyz.'
src['brand'] = [
  {'file': 'art/brand/xtrata-logo.svg', 'use': 'Xtrata mark on the cabinet door texture and in the game header', 'origin': "Brand assets in the series bible (claude/machine-series/brand/xtrata-logo.svg), used exactly as supplied: not redrawn, recoloured, stretched or cropped", 'permission': "Jim's own mark, no permission needed"},
  {'file': 'art/brand/parallax-casino-wordmark.svg', 'use': 'Small wordmark in the test page header only (smaller than the machine name)', 'origin': 'Brand assets in the series bible (claude/machine-series/brand/parallax-casino-wordmark.svg), exactly as supplied', 'permission': "Jim's own mark, no permission needed"}]
src['brand'].append({'file': 'art/brand/this-is-1-logo.svg', 'use': 'The #1 logo: the face of the This Is #1 symbol until its token art loads, and on the Jackpot: Number One intro', 'origin': 'https://thisisnumberone.com/wp-content/themes/thisisnumberone/files/images/thisisnumberone/1-colour.svg, byte for byte (2,084 bytes), not redrawn, recoloured, stretched or cropped', 'permission': "Jim says it may be used (This Is #1 is his collection); confirmed in chat 2026-11-01"})
T1 = json.load(open(os.path.join(R, 'brand', 't1-images.json')))
src['thisIs1'] = {'about': 'Real This Is #1 art, loaded live by the game from thisisnumberone.com (the site allows cross-origin image loading; checked from another origin on 2026-11-01, each file returned 200 with the sizes below). Not bundled in the file: they load when the game starts. The five Genesis NFTs are the power symbols (drawn 8x as often as the rest). Shown grey with NOT YET FOREVER like any Stacks NFT without a twin.', 'pageList': 'https://thisisnumberone.com/collections/', 'loadedLive': T1['items'], 'foundButNotLoaded': T1['notLoaded']}
shutil.copyfile(os.path.join(R, 'brand', 't1-images.json'), os.path.join(OUT, 'art', 'this-is-1-images.json'))
src['logosNeedingPermission'] = []
src['logosNote'] = 'Logos used: the Xtrata mark and ParallaX wordmark (Jim\'s own) and the #1 logo (Jim says it may be used). No Stacks, Bitcoin, Gamma, Boom or other collection logos are used anywhere. The reels show token art only; names are set in plain type. If Jim adds another logo later it must be listed here first.'
json.dump(src, open(os.path.join(OUT, 'art', 'sources.json'), 'w'), indent=1)
shutil.copyfile(os.path.join(R, 'art', 'SUMMARY.md'), os.path.join(OUT, 'art', 'README.md'))
print('ok', OUT, os.path.getsize(os.path.join(OUT, 'index.html')))

# ---- src/: what the pack was built from, plus the checks ----
import hashlib, glob
S = os.path.join(OUT, 'src')
def cp(src, dst):
    os.makedirs(os.path.dirname(os.path.join(S, dst)), exist_ok=True); shutil.copyfile(os.path.join(R, src), os.path.join(S, dst))
for f in ['script0.js', 'script1.js', 'script2.js', 'script3.js', 'script4.js', 'script5.js', 'script8.js', 'shell.html']: cp('ft/' + f, 'ft/' + f)
cp('ft/script3.js', 'engine/bf-engine.js')
for f in sorted(glob.glob(os.path.join(R, 'gen', 'p_*.js'))) + [os.path.join(R, 'gen', x) for x in ['make_game.py', 'make_game2.py', 'make_shell.py', 'g21.shell.html', 'test-stops.json', 'index.template.html']]:
    cp(os.path.relpath(f, R), 'game/' + os.path.basename(f))
cp('cab/cabinet.mjs', 'cabinet/cabinet.mjs')
for f in ['assemble.py', 'package.py', 'bundle_art.cjs', 'rebuild.sh']: cp('build/' + f, 'build/' + f)
cp('chain/chain.json', 'data/chain.json')
for f in ['sim.mjs', 'engine.cjs']: cp('qa/' + f, 'qa/' + f)
runs = []
for f in sorted(glob.glob(os.path.join(R, 'qa', 'rtp-*'))):
    t = open(f).read().strip().splitlines()
    for ln in t:
        if ln.startswith('{') and '"rtp"' in ln:
            runs.append(json.loads(ln)); shutil.copyfile(f, os.path.join(S, 'qa', os.path.basename(f))); break
runs.sort(key=lambda r: r['seed'])
mean = sum(r['rtp'] for r in runs) / len(runs)
lines = ['Genesis 21: seeded RTP runs (node qa/sim.mjs 5000000 <seed>), 5,000,000 spins each, design RTP 94.38%', '']
lines += [f"seed {r['seed']:>5}  RTP {r['rtp']:.3f}%  free 1 in {r['oneInFree']}  boombox 1 in {r['oneInVault']}  anchor 1 in {r['oneInChain']}  jackpots {r['jackpots']}" for r in runs]
lines += ['', f'{len(runs)} runs, {len(runs)*5} million spins, mean RTP {mean:.3f}%']
open(os.path.join(S, 'qa', 'rtp-summary.txt'), 'w').write('\n'.join(lines) + '\n')
e = open(os.path.join(R, 'ft', 'script3.js'), encoding='utf-8').read()
idl = ['Block Fortune v2 engine (src/engine/bf-engine.js) sha256 ' + hashlib.sha256(e.encode()).hexdigest(), '']
for n in ['1_Forever_Twins', '3_Block_Fortune', '0_The_Drop']:
    h = open(os.path.join(R, 'packs', n + '.game.html'), encoding='utf-8').read(); idl.append(f'engine text contained verbatim in the room pack {n}: {e in h}')
g = open(os.path.join(R, 'build', 'g21.game.html'), encoding='utf-8').read(); idl.append(f'engine text contained verbatim in the Genesis 21 game: {e in g}')
open(os.path.join(S, 'qa', 'engine-identity.txt'), 'w').write('\n'.join(idl) + '\n')
print('src ok; runs', len(runs), 'mean', round(mean, 3))
