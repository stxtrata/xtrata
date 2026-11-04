# Needs fix-a.png, fix-b.png, fix-c.png (any small PNGs: stand-ins served for thisisnumberone.com so the live-art path can be tested offline).
import asyncio, re, sys, json, base64
from playwright.async_api import async_playwright
from lib import ARGS
W=int(sys.argv[1]); H=int(sys.argv[2]); TAG=sys.argv[3]
FIX=[open(f'fix-{n}.png','rb').read() for n in 'abc']; cnt=[0]
async def t1(route):
    cnt[0]+=1
    await route.fulfill(status=200, body=FIX[cnt[0]%3], headers={'content-type':'image/png','access-control-allow-origin':'*'})
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=ARGS); ctx=await b.new_context(viewport={'width':W,'height':H},has_touch=W<700,is_mobile=W<700)
        await ctx.route(re.compile(r'^https://thisisnumberone\.com/'), t1)
        await ctx.route(re.compile(r'^https?://(?!127\.0\.0\.1|thisisnumberone\.com)'), lambda r: r.abort())
        pg=await ctx.new_page(); pg.set_default_timeout(90000); errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pg.goto('http://127.0.0.1:8765/index.html?q=low'); await pg.wait_for_function("window.G21Test && G21Test.api",timeout=60000); await pg.wait_for_timeout(4000)
        print('t1 requests served', cnt[0])
        F="G21Test.frame.contentDocument"
        rect="""(sel)=>{const e=%s.querySelector(sel)||document.querySelector(sel); if(!e||!e.offsetParent) return null; const r=e.getBoundingClientRect(); return [Math.round(r.x*10)/10,Math.round(r.y*10)/10,Math.round(r.width*10)/10,Math.round(r.height*10)/10]}"""%F
        seen={'deck':set(),'fs':set()}
        async def sample(kind):
            sel='#dSpin' if kind=='deck' else '#fsBar [data-fs=spin]'
            r=await pg.evaluate("sel=>{const e=(sel[0]=='#'&&sel.indexOf(' ')<0)?document.querySelector(sel):G21Test.frame.contentDocument.querySelector(sel); if(!e||!e.offsetParent) return null; const r=e.getBoundingClientRect(); return [Math.round(r.x*10)/10,Math.round(r.y*10)/10,Math.round(r.width*10)/10,Math.round(r.height*10)/10]}", sel)
            if r: seen[kind].add(tuple(r))
        async def tap(sel, inframe=True):
            await pg.evaluate("([sel,f])=>{const d=f?G21Test.frame.contentDocument:document; const e=d.querySelector(sel); e&&e.click()}", [sel,inframe])
        async def run(kind, armkind):
            # arm via the test panel on the test page (not in the game frame)
            await pg.evaluate("document.getElementById('testBtn').click()"); await pg.wait_for_timeout(300)
            await pg.evaluate("k=>{const e=document.querySelector('[data-t='+k+']')||G21Test.frame.contentDocument.querySelector('[data-t='+k+']'); e&&e.click()}", armkind)
            for i in range(160):
                await pg.wait_for_timeout(250); await sample(kind)
                s=await pg.evaluate("(()=>{const G=G21Test.frame.contentWindow.Genesis21,sc=G.scene();return {sc:sc?sc.kind+':'+sc.stage:null,pend:G.pending(),sp:G.snapshot().spinning,gam:G.snapshot().state.gamble,fr:G.snapshot().state.free,feat:(G.snapshot().state.features||[]).length}})()")
                if s['sp']: continue
                if s['sc']:
                    if s['sc'].endswith(':trigger'): await pg.evaluate("G21Test.frame.contentWindow.Genesis21.skip()")
                    elif s['pend']: 
                        await pg.wait_for_timeout(200)
                        if kind=='fs': await tap('#fsBar .fs-act')
                        else: await pg.evaluate("G21Test.api.action('spin')")
                    continue
                if s['feat'] or s['fr']>0:
                    if kind=='fs': await tap('#fsBar .fs-act' if await pg.evaluate("!!(G21Test.frame.contentDocument.querySelector('#fsBar .fs-act')&&!G21Test.frame.contentDocument.querySelector('#fsBar .fs-act').hidden)") else '#fsBar [data-fs=spin]')
                    else: await pg.evaluate("G21Test.api.action('spin')")
                    continue
                if i>12 and s['gam']==0: break
                if s['gam']>0: break
        # deck first (not fullscreen)
        await sample('deck')
        for k in ['free','win','jackpot']:
            await pg.evaluate("G21Test.api.action('betUp')"); await sample('deck')
            await tap('#dAuto',False); await sample('deck'); await tap('#dAuto',False)
            await run('deck',k); await pg.wait_for_timeout(500)
        print('DECK distinct spin rects:', sorted(seen['deck']))
        await pg.click('#vFs'); await pg.wait_for_timeout(1500)
        await pg.evaluate("G21Test.frame.contentWindow.Genesis21.test.slow(8)")
        for k in ['free','win','jackpot']:
            await tap('#fsBar [data-fs=bp]'); await sample('fs'); await tap('#fsBar [data-fs=auto]'); await sample('fs'); await pg.wait_for_timeout(300); await sample('fs'); await tap('#fsBar [data-fs=auto]'); await sample('fs')
            await tap('#fsBar [data-fs=test]'); await pg.wait_for_timeout(300)
            await pg.evaluate("k=>{const e=G21Test.frame.contentDocument.querySelector('[data-t='+k+']'); e&&e.click()}", k)
            for i in range(240):
                await pg.wait_for_timeout(250); await sample('fs')
                s=await pg.evaluate("(()=>{const G=G21Test.frame.contentWindow.Genesis21,sc=G.scene();return {sc:sc?sc.kind+':'+sc.stage:null,pend:G.pending(),sp:G.snapshot().spinning,gam:G.snapshot().state.gamble,fr:G.snapshot().state.free,feat:(G.snapshot().state.features||[]).length}})()")
                if s['sp']: continue
                if s['sc']:
                    if s['sc'].endswith(':trigger'): await pg.evaluate("G21Test.frame.contentWindow.Genesis21.skip()")
                    elif s['pend']: await tap('#fsBar .fs-act')
                    continue
                if s['feat'] or s['fr']>0: await tap('#fsBar .fs-act' if await pg.evaluate("(()=>{const e=G21Test.frame.contentDocument.querySelector('#fsBar .fs-act');return !!e&&!e.hidden})()") else '#fsBar [data-fs=spin]'); continue
                if s['gam']>0: await sample('fs'); await pg.screenshot(path=f'{TAG}-gamble-offer.png'); break
                if i>14: break
            await sample('fs')
        print('FULLSCREEN distinct spin rects:', sorted(seen['fs']))
        print('errors', errs[:3]); await b.close()
asyncio.run(main())
