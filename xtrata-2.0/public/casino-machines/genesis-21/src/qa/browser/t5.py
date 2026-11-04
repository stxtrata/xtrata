import asyncio, json, time, sys
from lib import *
W=int(sys.argv[1]); H=int(sys.argv[2]); TAG=sys.argv[3]; KINDS=sys.argv[4].split(','); RM=len(sys.argv)>5 and sys.argv[5]=='rm'; MENUS=len(sys.argv)>6 and sys.argv[6]=='menus'
T0=time.time()
def P(*a): print(round(time.time()-T0,1), *a, flush=True)
JS_STATE="""(() => { const G=G21Test.frame.contentWindow.Genesis21, s=G.snapshot(), sc=G.scene(); return {sc: sc?sc.kind+':'+sc.stage:null, pend:G.pending(), free:s.state.free, freeActive:s.state.freeActive, feat:(s.state.features||[]).length, gamble:s.state.gamble, spinning:s.spinning, bal:G21Test.api.ui().balance, fs:G.isFullscreen()}; })()"""
async def main():
    async with async_playwright() as p:
        b, pg, logs = await open_page(p, W, H, touch=(W<700), scale=1, reduced=RM, url='file:///tmp/g21/index.html')
        P('opened; lite screen?', await pg.evaluate("G21Test.api.screen.width"))
        async def tap(sel):
            ok = await pg.evaluate("sel => { const e = G21Test.frame.contentDocument.querySelector(sel); if (!e) return false; e.click(); return true; }", sel)
            if not ok: raise Exception('missing '+sel)
        async def vis(sel):
            return await pg.evaluate("sel => { const e = G21Test.frame.contentDocument.querySelector(sel); return !!e && !e.hidden && e.offsetParent !== null; }", sel)
        async def st(): return await pg.evaluate(JS_STATE)
        async def shot(name): await pg.screenshot(path=f'{TAG}-{name}.png')
        async def canvas(name):
            d = await pg.evaluate("G21Test.api.screen.toDataURL('image/png')")
            import base64; open(f'{TAG}-{name}-screen.png','wb').write(base64.b64decode(d.split(',')[1]))
        if RM: P('reduced motion in game frame:', await pg.evaluate("G21Test.frame.contentWindow.matchMedia('(prefers-reduced-motion: reduce)').matches"))
        await pg.click('#vFs'); await pg.wait_for_timeout(800)
        await pg.evaluate("G21Test.frame.contentWindow.Genesis21.test.slow(30)")
        P('fullscreen', await st()); await shot('00-fs')
        sizes = await pg.evaluate("""(() => { const d = G21Test.frame.contentDocument; return [...d.querySelectorAll('#fsBar button, #fsBar input')].filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return [e.dataset.fs||e.id||e.tagName, Math.round(r.width), Math.round(r.height)]}); })()""")
        P('bar controls (name,w,h):', json.dumps(sizes)); P('smallest', min(min(w,h) for _,w,h in sizes))
        if MENUS:
            for btn, nm in [('pays','roadmap'),('fair','fair'),('history','history'),('test','test')]:
                await tap(f'#fsBar [data-fs={btn}]'); await pg.wait_for_timeout(600); await shot('menu-'+nm)
                P('menu', nm, 'open', await pg.evaluate("G21Test.frame.contentDocument.getElementById('modal').open"))
                await tap('#modal [aria-label*=lose], #modal .close, #modal button'); await pg.wait_for_timeout(300)
                P('  closed:', not await pg.evaluate("G21Test.frame.contentDocument.getElementById('modal').open"))
            for btn in ['bp','bp','bm','turbo','turbo','sound','sound']:
                await tap(f'#fsBar [data-fs={btn}]'); await pg.wait_for_timeout(150)
            P('bet shown', await pg.evaluate("G21Test.frame.contentDocument.getElementById('fsBet').textContent"))
            await tap('#fsBar [data-fs=spin]')
            for i in range(120):
                await pg.wait_for_timeout(400); s = await st()
                if not s['spinning'] and not s['sc'] and not s['feat'] and not s['free']: break
                if s['sc'] and s['pend']: await tap('#fsBar .fs-act')
            P('plain spin done', await st())
        for kind in KINDS:
            await pg.wait_for_timeout(300)
            await tap('#fsBar [data-fs=test]'); await pg.wait_for_timeout(300)
            await tap(f'[data-t={kind}]'); P('armed', kind); b0=(await st())['bal']
            seen=set(); n=0; gam=False
            for i in range(900):
                await pg.wait_for_timeout(300)
                s = await st()
                key = s['sc'] or (f"play-{s['pend']}" if s['pend'] else ('freeplay' if s['free']>0 and not s['spinning'] else ('gambleoffer' if s['gamble']>0 and not s['spinning'] and kind=='win' else None)))
                if key and key not in seen:
                    seen.add(key); n+=1; await pg.wait_for_timeout(400); await shot(f"{kind}-{n:02d}-{key.replace(':','_').replace(' ','')}"); await canvas(f"{kind}-{n:02d}"); P(kind, key, 'bal', s['bal'])
                    if key.endswith(':trigger'): await pg.evaluate("G21Test.frame.contentWindow.Genesis21.skip()")
                if s['spinning']: continue
                if s['sc']:
                    if s['sc'].endswith(':trigger') or (s['sc'].endswith(':play') and not s['sc'].startswith('gamble')): continue
                    if s['sc']=='gamble:intro': await tap('#fsBar [data-fs=odd]' if await vis('#fsBar [data-fs=odd]') else '#fsBar .fs-act')
                    else:
                        await pg.wait_for_timeout(500); await tap('#fsBar .fs-act' if await vis('#fsBar .fs-act') else '#fsBar [data-fs=spin]')
                    continue
                if s['feat']: await tap('#fsBar .fs-act' if await vis('#fsBar .fs-act') else '#fsBar [data-fs=spin]'); continue
                if s['free']>0: await tap('#fsBar [data-fs=spin]'); continue
                if kind=='win' and s['gamble']>0 and not gam: gam=True; await tap('#fsBar [data-fs=odd]'); continue
                if i>8 and not s['freeActive'] and s['gamble']==0 and not s['feat'] and not s['sc']: break
                if s['gamble']>0 and gam: break
            s=await st(); P('done', kind, 'bal', b0, '->', s['bal'], 'state', s['sc'], s['free'], s['feat'], s['gamble'])
        print('\n'.join(l for l in logs if 'Failed to load' not in l)[:600])
        await b.close()
asyncio.run(main())
