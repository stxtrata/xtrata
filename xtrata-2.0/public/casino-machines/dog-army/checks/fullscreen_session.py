"""Fullscreen session check: enter fullscreen on the standalone test page and play using only the bottom bar.
Desktop (1366x900) and phone (390x844, touch). Writes screenshots to checks/screens/ and results to checks/fullscreen.json.
    python3 -m http.server 8765 &   (from the machine folder)
    python3 checks/fullscreen_session.py"""
import asyncio, json, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); OUT = os.path.join(ROOT, 'checks/screens'); os.makedirs(OUT, exist_ok=True)
BASE = os.environ.get('DOGARMY_BASE', 'http://127.0.0.1:8765')
CHROME = '/usr/bin/google-chrome'

async def session(p, label, viewport, mobile):
    b = await p.chromium.launch(executable_path=CHROME if os.path.exists(CHROME) else None, args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    ctx = await b.new_context(viewport=viewport, is_mobile=mobile, has_touch=mobile, device_scale_factor=2 if mobile else 1)
    pg = await ctx.new_page(); errors = []
    pg.on('pageerror', lambda e: errors.append(str(e)))
    await pg.goto(f'{BASE}/index.html?lite=1'); await pg.wait_for_timeout(6000)
    res = {'viewport': viewport, 'steps': []}
    fr = pg.frame_locator('iframe.pxLogicFrame'); frame = [f for f in pg.frames if f != pg.main_frame][0]
    G = lambda js: frame.evaluate(js)
    async def shot(name): await pg.screenshot(path=f'{OUT}/fs-{label}-{name}.png')
    async def step(name, ok, extra=None): res['steps'].append({'step': name, 'ok': bool(ok), **({'info': extra} if extra is not None else {})}); print(label, name, 'OK' if ok else 'FAIL', extra if extra is not None else '')
    async def tapId(sel):   # a genuine pointer click at the element's centre, without waiting for the animating screen to settle
        box = await G(f"(()=>{{const e=document.querySelector('{sel}');if(!e||!e.offsetParent)return null;const r=e.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]}})()")
        if box: await pg.mouse.click(box[0], box[1])
        return bool(box)
    async def bar(id_): await fr.locator(f'#fs_{id_}').click()
    await pg.click('#fsBtn'); await pg.wait_for_timeout(1200)
    st = await pg.evaluate("(()=>{const f=document.querySelector('iframe.pxLogicFrame'),r=f.getBoundingClientRect();return {w:r.width,h:r.height,x:r.x,y:r.y,pos:getComputedStyle(f).position,api:!!document.fullscreenElement}})()")
    await step('enter fullscreen (frame fills the view)', st['w'] >= viewport['width'] - 2 and st['h'] >= viewport['height'] - 2 and await G("document.body.classList.contains('fs')"), st)
    await shot('1-entered')
    # Every bar button is at least 44px.
    sizes = await G("[...document.querySelectorAll('#fsBar .fsb')].filter(b=>b.offsetParent).map(b=>{const r=b.getBoundingClientRect();return [b.id||b.className,Math.round(r.width),Math.round(r.height)]})")
    await step('bar touch targets >= 44px', all(w >= 44 and h >= 44 for _, w, h in sizes), sizes)
    vis = await G("(()=>{const b=document.getElementById('fsBar'),r=b.getBoundingClientRect();return {top:r.top,bottom:r.bottom,h:innerHeight,w:innerWidth,scrollW:b.scrollWidth,clientW:b.clientWidth,rows:new Set([...b.querySelectorAll('.fsb')].filter(x=>x.offsetParent).map(x=>Math.round(x.getBoundingClientRect().top))).size}})()")
    await step('bar fits: one row on desktop, wraps on a phone', vis['bottom'] <= vis['h'] + 1 and (vis['rows'] == 1 and vis['scrollW'] <= vis['clientW'] + 1 if label == 'desktop' else True), vis)
    b0 = await G("DogArmy.snapshot().state.bet")
    await bar('betUp'); await bar('betUp'); b1 = await G("DogArmy.snapshot().state.bet"); await bar('betDown'); await bar('betDown'); b2 = await G("DogArmy.snapshot().state.bet")
    await step('bet − / + from the bar', b1 > b0 and b2 == b0, [b0, b1, b2])
    s0 = await G("DogArmy.snapshot().state.spins"); await bar('spin'); await pg.wait_for_timeout(4200); s1 = await G("DogArmy.snapshot().state.spins")
    await step('spin from the bar', s1 == s0 + 1, [s0, s1]); await shot('2-after-spin')
    for name, closer in [('pays', 'ORDERS'), ('fair', 'FAIR PLAY'), ('history', 'HISTORY'), ('settings', 'SETTINGS'), ('holder', 'HOLDER POT'), ('lab', 'BONUS LAB'), ('test', 'TEST PANEL')]:
        await bar(name); await pg.wait_for_timeout(500)
        opened = await G("document.getElementById('modal').open"); tag = await G("document.getElementById('modalTag').textContent")
        box = await G("(()=>{const r=document.getElementById('modal').getBoundingClientRect();return [Math.round(r.top),Math.round(r.bottom),innerHeight]})()")
        if name in ('pays', 'lab'): await shot(f'3-modal-{name}')
        await fr.locator('#close').click(); await pg.wait_for_timeout(300); closed = not await G("document.getElementById('modal').open")
        await step(f'{name} opens and closes inside fullscreen', opened and closed and box[0] >= 0 and box[1] <= box[2], {'tag': tag, 'box': box})
    await bar('auto'); await pg.wait_for_timeout(400); await fr.locator('[data-auto="10"]').click(); await pg.wait_for_timeout(4500)
    autoOn = await G("DogArmy.snapshot().autoLeft"); await bar('auto'); await pg.wait_for_timeout(300); autoOff = await G("DogArmy.snapshot().autoLeft")
    await step('auto starts and stops from the bar', (autoOn > 0 or (await G("DogArmy.snapshot().state.spins")) > s1) and autoOff == 0, [autoOn, autoOff])
    for t in ['turbo', 'sound']:
        before = await G(f"DogArmy.snapshot().state.{'turbo' if t=='turbo' else 'muted'}"); await bar(t); after = await G(f"DogArmy.snapshot().state.{'turbo' if t=='turbo' else 'muted'}"); await bar(t)
        await step(f'{t} toggles from the bar', before != after, [before, after])
    await pg.wait_for_timeout(5000)
    # Every bonus and the gamble, launched from the Lab on the bar and played with the bar's buttons and taps on the screen.
    items = ['free', 'vault', 'chain', 'jackpot', 'gamble-win'] if label == 'desktop' else ['vault', 'gamble-loss']
    for it in items:
        # The Lab only starts from an idle machine: finish any real spin or bonus the earlier auto-spins landed, using the bar.
        for _ in range(400):
            idle = await G("(()=>{const s=DogArmy.snapshot();return !s.spinning&&!s.scene&&!s.freeMode&&!(s.state.free>0)&&!document.getElementById('modal').open})()")
            if idle: break
            if await G("document.getElementById('modal').open"): await fr.locator('#close').click()
            elif await G("!!(DogArmy.snapshot().scene)"):
                sc0 = await G("DogArmy.snapshot().scene")
                if sc0['kind'] == 'gamble' and sc0['stage'] == 'intro': await tapId('#fs_callMoon')
                elif sc0['kind'] == 'vault' and sc0['stage'] == 'play': await tapId('#fsAction')
                else: await tapId('#fs_spin')
            await pg.wait_for_timeout(700)
        await bar('lab'); await pg.wait_for_timeout(400)
        await fr.locator(f'input[name=labItem][value="{it}"]').check(); await fr.locator('#labAuto').uncheck(); await fr.locator('#labRun').click()
        import time; seen = []; t0 = time.time(); t = 0
        for _ in range(60):
            if await G("DogArmy.lab.active()"): break
            await pg.wait_for_timeout(250)
        while time.time() - t0 < 300 and await G("DogArmy.lab.active()"):
            sc = await G("JSON.stringify(DogArmy.scene())"); sc = json.loads(sc) if sc and sc != 'null' else None
            key = f"{sc['kind']}:{sc['stage']}" if sc else ('free:play' if await G("DogArmy.snapshot().freeMode") else '')
            if key and key not in seen:
                seen.append(key); await pg.wait_for_timeout(700); await shot(f'4-{it}-{len(seen)}-{key.replace(":", "_")}')
                continue   # the scene may have moved on during the capture: read it again before pressing anything
            if sc and sc['kind'] == 'gamble' and sc['stage'] == 'intro': await tapId('#fs_callMoon')
            elif sc and sc['kind'] == 'vault' and sc['stage'] == 'play' and len(sc['picks'] or []) < 3:
                # tap the next tag on the fullscreen canvas
                pos = await G(f"(()=>{{const b=DogArmy.buttons().find(b=>/^tag/.test(b.id));if(!b)return null;const c=document.getElementById('fsCanvas').getBoundingClientRect();return [c.left+(b.x+b.w/2)/1400*c.width,c.top+(b.y+b.h/2)/960*c.height]}})()")
                before = len(sc['picks'] or [])
                if pos and before == 0: await pg.mouse.click(pos[0], pos[1]); await pg.wait_for_timeout(500); res.setdefault('tagTaps', []).append({'pos': pos, 'picksAfterTap': len((await G("DogArmy.scene()") or {}).get('picks') or [])})
                else: await tapId('#fsAction')   # the floating OPEN A BAG button
            elif sc and sc['stage'] == 'trigger': pass   # let the trigger play out so the intro is seen
            elif sc: await tapId('#fs_spin')   # a scene is waiting: the bar's first button (CONTINUE, LIFT OFF, BACK TO THE REELS…)
            await pg.wait_for_timeout(700); t += 1
        await step(f'{it} played from trigger to summary with the bar', not await G("DogArmy.lab.active()") and any(k.endswith('outro') for k in seen), seen)
    await bar('exit'); await pg.wait_for_timeout(800)
    st = await pg.evaluate("(()=>{const f=document.querySelector('iframe.pxLogicFrame'),r=f.getBoundingClientRect();return {w:r.width,x:r.x,inset:f.getAttribute('style')}})()")
    await step('exit fullscreen restores the cabinet view', not await G("document.body.classList.contains('fs')") and st['x'] < -1000, st)
    await shot('5-exited')
    res['errors'] = errors; await step('no page errors', not errors, errors[:5])
    await b.close(); return res

async def main():
    which = sys.argv[1] if len(sys.argv) > 1 else 'both'
    out = {}
    async with async_playwright() as p:
        if which in ('both', 'desktop'): out['desktop'] = await session(p, 'desktop', {'width': 1366, 'height': 900}, False)
        if which in ('both', 'phone'): out['phone'] = await session(p, 'phone', {'width': 390, 'height': 844}, True)
    path = os.path.join(ROOT, f'checks/fullscreen-{which}.json'); json.dump(out, open(path, 'w'), indent=1)
    fails = [(k, s['step']) for k, v in out.items() for s in v['steps'] if not s['ok']]
    print('FAILS:', fails if fails else 'none')

asyncio.run(main())
