#!/usr/bin/env python3
"""Makes the small test pictures and clips for the testnet screen reel (canaries/arcade-v2-launch/reel-assets).
Needs: Pillow, ffmpeg, Playwright (chromium). The twins in reel-assets/twins are real forevered Bitcoin Pepes / Birds
fetched once from mainnet through the xtrata.xyz gateway (see fetch note in the README); they are not changed here beyond scaling.
Frames are 2:1 (the screen's full-screen shape)."""
import glob, os, subprocess, sys, tempfile, random
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.join(os.path.dirname(__file__), '..', 'canaries', 'arcade-v2-launch', 'reel-assets')
HERE = os.path.abspath(HERE)
W, H = 1240, 620
F = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf'
font = lambda s: ImageFont.truetype(F, s)
def twins(kind): return sorted(glob.glob(os.path.join(HERE, 'twins', kind + '*.png')))
def tw(path, s):
    im = Image.open(path).convert('RGBA'); im = im.resize((s, s), Image.NEAREST if im.width < 200 else Image.LANCZOS)
    return im
def bg(c1=(8, 10, 24), c2=(28, 8, 52)):
    im = Image.new('RGB', (W, H)); d = ImageDraw.Draw(im)
    for y in range(H):
        t = y / H; d.line([(0, y), (W, y)], fill=tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3)))
    return im
def text(d, xy, s, size, fill, anchor='la'): d.text(xy, s, font=font(size), fill=fill, anchor=anchor)

# 1. FOREVER TWINS slideshow GIF: a Pepe and a Bird side by side, six pairs
def forever_gif():
    P, B = twins('pepe'), twins('bird'); frames = []
    for i in range(6):
        im = bg((6, 16, 30), (4, 40, 52)); d = ImageDraw.Draw(im)
        im.paste(tw(P[i], 400), (110, 120), tw(P[i], 400)); im.paste(tw(B[i], 400), (730, 120), tw(B[i], 400))
        text(d, (620, 330), '=', 90, (0, 220, 255), 'mm')
        text(d, (620, 60), 'FOREVER TWINS', 56, (255, 255, 255), 'mm')
        text(d, (620, 560), 'YOUR NFT. ON BITCOIN. FOREVER.', 28, (0, 220, 255), 'mm')
        frames.append(im.resize((620, 310), Image.LANCZOS).quantize(64))
    frames[0].save(os.path.join(HERE, 'forever-twins.gif'), save_all=True, append_images=frames[1:], duration=1100, loop=0, optimize=True)

# 2. FOREVER TWINS wall: full-screen still, a grid of real twins
def forever_wall():
    im = bg((4, 8, 20), (20, 4, 40)); d = ImageDraw.Draw(im); P, B = twins('pepe'), twins('bird'); allt = [p for pair in zip(P, B) for p in pair]
    s = 128; cols = 8
    for i, p in enumerate(allt[:16]):
        x = 60 + (i % cols) * (s + 14); y = 150 + (i // cols) * (s + 14)
        t = tw(p, s); im.paste(t, (x, y), t)
    text(d, (620, 70), 'FOREVER TWINS', 62, (255, 255, 255), 'mm')
    text(d, (620, 108), 'REAL PEPES AND BIRDS · FOREVERED ON XTRATA', 22, (0, 220, 255), 'mm')
    text(d, (620, 480), 'TWIN YOURS AT XTRATA.XYZ', 36, (255, 200, 0), 'mm')
    im.save(os.path.join(HERE, 'forever-twins-wall.png'), optimize=True)
    Image.open(os.path.join(HERE, 'forever-twins-wall.png')).quantize(96).save(os.path.join(HERE, 'forever-twins-wall.png'), optimize=True)

# 3. Astro Blaster still (cabinet marquee over the poster, cropped to 2:1)
def astro():
    cab = os.path.abspath(os.path.join(HERE, '..', '..', '..', 'recursive-apps', 'astro-blaster-3', 'cabinet'))
    poster = Image.open(os.path.join(cab, 'cabinet-poster.webp')).convert('RGB'); marq = Image.open(os.path.join(cab, 'cabinet-marquee.webp')).convert('RGB')
    im = bg((2, 2, 12), (14, 2, 30)); d = ImageDraw.Draw(im)
    ph = 560; pw = int(poster.width * ph / poster.height); p2 = poster.resize((pw, ph), Image.LANCZOS); im.paste(p2, (60, 30))
    m2 = marq.resize((680, 170), Image.LANCZOS); im.paste(m2, (480, 60))
    text(d, (820, 330), 'FLY. SHOOT. POST YOUR SCORE.', 30, (255, 255, 255), 'mm')
    text(d, (820, 380), 'TOP 10 ON BITCOIN', 30, (255, 200, 0), 'mm')
    text(d, (820, 470), 'IN THE ARCADE NOW', 24, (0, 220, 255), 'mm')
    im.quantize(128).save(os.path.join(HERE, 'astro-blaster.png'), optimize=True)

# 4. rent-this-slot still
def rent():
    im = bg((10, 10, 10), (30, 20, 0)); d = ImageDraw.Draw(im)
    text(d, (620, 130), 'THIS SLOT IS FOR RENT', 64, (255, 255, 255), 'mm')
    text(d, (620, 215), '5 STX A DAY · PAID ON-CHAIN · NO MIDDLEMAN', 28, (255, 200, 0), 'mm')
    d.rectangle([160, 290, 1080, 520], outline=(90, 90, 90), width=3)
    d.rectangle([180, 310, 450, 500], outline=(0, 220, 255), width=3); text(d, (315, 405), 'SCORERS', 26, (0, 220, 255), 'mm')
    d.rectangle([470, 310, 1060, 500], fill=(255, 200, 0)); text(d, (765, 405), 'YOUR AD HERE', 40, (0, 0, 0), 'mm')
    im.quantize(32).save(os.path.join(HERE, 'rent-slot.png'), optimize=True)

# HTML pages rendered to clips (the screen cannot run HTML; it plays pictures and clips)
HTML_AD = """<html><body style="margin:0;width:640px;height:320px;overflow:hidden;background:#12002a;font-family:DejaVu Sans Mono,monospace;color:#fff">
<style>@keyframes sl{from{transform:translateX(-700px)}to{transform:translateX(0)}}@keyframes pu{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
.b{position:absolute;left:0;height:56px;line-height:56px;font-size:32px;font-weight:bold;padding-left:30px;animation:sl .6s ease-out both}
.big{position:absolute;right:30px;bottom:14px;font-size:44px;font-weight:bold;color:#ffc800;animation:pu 1s infinite}</style>
<div class="b" style="top:40px;width:420px;background:#00dcff;color:#000;animation-delay:0s">BUILT ON BITCOIN</div>
<div class="b" style="top:110px;width:520px;background:#ff2d95;animation-delay:.5s">RENDERED FROM HTML</div>
<div class="b" style="top:170px;width:600px;background:#7a1fff;animation-delay:1s">PLAYED AS A CLIP</div>
<div class="big">HTML AD</div></body></html>"""
HTML_PLAYER = """<html><body style="margin:0;width:640px;height:320px;overflow:hidden;background:#0b0f1a;font-family:DejaVu Sans Mono,monospace;color:#fff">
<style>@keyframes eq{0%,100%{height:12px}50%{height:var(--h)}}@keyframes pr{from{width:0}to{width:520px}}
.bar{position:absolute;bottom:110px;width:22px;background:linear-gradient(#ff2d95,#00dcff);animation:eq .7s infinite}</style>
<div style="position:absolute;left:30px;top:22px;font-size:14px;color:#00dcff">XTRATA RADIO · NOW PLAYING</div>
<div style="position:absolute;left:30px;top:48px;font-size:30px;font-weight:bold">TEST TONE (SILENT CLIP)</div>
<div style="position:absolute;left:60px;top:90px;height:120px;width:520px" id="e"></div>
<div style="position:absolute;left:60px;top:250px;width:520px;height:8px;background:#233"><div style="height:8px;background:#ffc800;animation:pr 4s linear infinite"></div></div>
<div style="position:absolute;left:60px;top:272px;font-size:14px;color:#8899aa">0:00 ──────────────── 0:04 · PRESS R IN THE HALL FOR REAL RADIO</div>
<script>var e=document.getElementById('e');for(var i=0;i<22;i++){var b=document.createElement('div');b.className='bar';b.style.left=(i*24)+'px';b.style.setProperty('--h',(30+((i*37)%80))+'px');b.style.animationDelay=(-(i*0.09))+'s';b.style.bottom='0';e.appendChild(b)}</script></body></html>"""
def render(html, name, secs, fps, gif=False):
    from playwright.sync_api import sync_playwright
    tmp = tempfile.mkdtemp(); n = int(secs * fps)
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={'width': 640, 'height': 320}); pg.set_content(html)
        for i in range(n):
            pg.evaluate("t=>document.getAnimations().forEach(a=>{a.pause();a.currentTime=t})", i * 1000 / fps); pg.screenshot(path=os.path.join(tmp, f'f{i:03d}.png'))
        b.close()
    out = os.path.join(HERE, name)
    if gif:
        subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(fps), '-i', os.path.join(tmp, 'f%03d.png'), '-vf', 'split[a][b];[a]palettegen=max_colors=48[p];[b][p]paletteuse', '-loop', '0', out])
    else:
        subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(fps), '-i', os.path.join(tmp, 'f%03d.png'), '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '40', '-an', out])
if __name__ == '__main__':
    forever_gif(); forever_wall(); astro(); rent()
    render(HTML_AD, 'html-ad.webm', 3, 15); render(HTML_AD, 'html-ad.gif', 3, 10, gif=True); render(HTML_PLAYER, 'radio-player.webm', 4, 15)
    for f in sorted(os.listdir(HERE)):
        if os.path.isfile(os.path.join(HERE, f)): print(f, os.path.getsize(os.path.join(HERE, f)))
