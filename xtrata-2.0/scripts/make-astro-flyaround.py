#!/usr/bin/env python3
"""Astro Blaster 3 cabinet fly-around: builds recursive-apps/astro-blaster-3/flyaround/astro-blaster-3-flyaround.html (self-contained, the arcade's own cabinet model
and art) and captures it frame by frame into an animated GIF sized for the arcade screen (2:1). Needs Playwright chromium and ffmpeg.
  python3 scripts/make-astro-flyaround.py [frames=36] [width=620] [colors=96]"""
import base64, os, subprocess, sys, tempfile
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
D = os.path.join(ROOT, 'recursive-apps', 'astro-blaster-3', 'flyaround'); CAB = os.path.join(ROOT, 'recursive-apps', 'astro-blaster-3', 'cabinet')
frames = int(sys.argv[1]) if len(sys.argv) > 1 else 36; W = int(sys.argv[2]) if len(sys.argv) > 2 else 620; colors = int(sys.argv[3]) if len(sys.argv) > 3 else 96
H = W // 2
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
t = open(os.path.join(D, 'flyaround.template.html')).read()
html = (t.replace('@@THREE@@', open(os.path.join(ROOT, 'public', 'fruit-machine-room', 'vendor', 'three.r128.min.js')).read().replace('</script', '<\\/script'))
         .replace('@@CABINET@@', open(os.path.join(ROOT, 'recursive-apps', 'xtrata-arcade', 'src', 'parts', 'cabinet-astro3.js')).read().replace('</script', '<\\/script'))
         .replace('@@SIDE@@', 'data:image/webp;base64,' + b64(os.path.join(CAB, 'astro-blaster-3-cabinet.webp'))).replace('@@MARQUEE@@', 'data:image/webp;base64,' + b64(os.path.join(CAB, 'cabinet-marquee.webp'))))
out_html = os.path.join(D, 'astro-blaster-3-flyaround.html'); open(out_html, 'w').write(html)
from playwright.sync_api import sync_playwright
tmp = tempfile.mkdtemp()
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']); pg = b.new_page(viewport={'width': W, 'height': H})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.goto('file://' + out_html); pg.wait_for_function('window.XA_FLY', timeout=30000); pg.evaluate('window.XA_FLY.ready')
    for i in range(frames):
        pg.evaluate(f'window.XA_FLY.frame({i}/{frames})'); pg.screenshot(path=os.path.join(tmp, f'f{i:03d}.png'))
    b.close()
if errs: print('page errors:', errs)
gif = os.path.join(D, 'astro-blaster-3-flyaround.gif')
subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', '12', '-i', os.path.join(tmp, 'f%03d.png'), '-vf', f'split[a][b];[a]palettegen=max_colors={colors}:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4', '-loop', '0', gif])
print('html', os.path.getsize(out_html), 'gif', os.path.getsize(gif), f'{W}x{H}', frames, 'frames')
