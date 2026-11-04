"""Crop Jim's supplied image grids into tiles and size the picks for the reels.
   python3 tools/prepare-supplied.py   → art/supplied/{popart,mooney-mooney}/*.png, art/ladder/pop/*.jpg"""
import os, json
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); S = os.path.join(ROOT, 'art/supplied'); P = os.path.join(ROOT, 'art/ladder/pop')
PICKS = {  # game key → supplied tile, output size
  'm': ('popart/letter-m.png', 280), 'moo': ('popart/cow-face.png', 280), 'moon': ('popart/moon-full.png', 280), 'mooney': ('popart/cow-over-moon.png', 280),
  'rocket': ('popart/rocket.png', 280), 'mooBurst': ('popart/moo-burst.png', 300), 'astronaut': ('popart/astronaut.png', 300), 'herd': ('popart/cows-herd.png', 360),
  'crescent': ('popart/moon-crescent.png', 280), 'field': ('mooney-mooney/pop-pink.png', 560)}
os.makedirs(P, exist_ok=True); out = {}
for k, (src, size) in PICKS.items():
    im = Image.open(os.path.join(S, src)).convert('RGB').resize((size, size), Image.LANCZOS)
    path = os.path.join(P, f'{k}.jpg'); im.save(path, quality=80, optimize=True, progressive=True); out[k] = {'file': f'art/ladder/pop/{k}.jpg', 'from': f'art/supplied/{src}', 'bytes': os.path.getsize(path)}
json.dump(out, open(os.path.join(P, 'picks.json'), 'w'), indent=1); print(json.dumps(out, indent=1))
