import asyncio, json, time, sys, base64
from lib import *
W=int(sys.argv[1]); H=int(sys.argv[2]); TAG=sys.argv[3]; KINDS=sys.argv[4].split(','); RM=sys.argv[5]=='rm'
T0=time.time()
def P(*a): print(round(time.time()-T0,1), *a, flush=True)
JS="""(() => { const G=G21Test.frame.contentWindow.Genesis21, s=G.snapshot(), sc=G.scene(); return {sc: sc?sc.kind+':'+sc.stage:null, pend:G.pending(), free:s.state.free, feat:(s.state.features||[]).length, gamble:s.state.gamble, spinning:s.spinning, bal:G21Test.api.ui().balance}; })()"""
async def main():
    async with async_playwright() as p:
        b, pg, logs = await open_page(p, W, H, touch=(W<700), scale=1, reduced=RM, url='file:///tmp/g21/index.html')
        if RM: P('reduced motion in game frame:', await pg.evaluate("G21Test.frame.contentWindow.matchMedia('(prefers-reduced-motion: reduce)').matches"))
        async def tap(sel):
            ok = await pg.evaluate("sel => { const e = G21Test.frame.contentDocument.querySelector(sel); if (!e) return false; e.click(); return true; }", sel)
            if not ok: raise Exception('missing '+sel)
        async def vis(sel): return await pg.evaluate("sel => { const e = G21Test.frame.contentDocument.querySelector(sel); return !!e && !e.hidden && e.offsetParent !== null; }", sel)
        await pg.click('#vFs'); await pg.wait_for_timeout(800)
        for kind in KINDS:
            await tap('#fsBar [data-fs=test]'); await pg.wait_for_timeout(300); await tap(f'[data-t={kind}]'); s=await pg.evaluate(JS); b0=s['bal']; P('armed',kind,'bal',b0)
            seen=[]; skipped=set(); shot=False
            for i in range(700):
                await pg.wait_for_timeout(300); s=await pg.evaluate(JS)
                if s['sc'] and (not seen or seen[-1]!=s['sc']): seen.append(s['sc']); P(kind,'stage',s['sc'],'bal',s['bal'])
                if s['spinning']: continue
                if s['sc']:
                    st=s['sc'].split(':')[1]
                    if st in('trigger','intro','play') and s['sc'] not in skipped and not(kind=='win' and st=='intro'):
                        skipped.add(s['sc']); await pg.evaluate("G21Test.frame.contentWindow.Genesis21.skip()"); P('  skip at',s['sc']); continue
                    if st=='outro' and not shot:
                        shot=True; await pg.wait_for_timeout(2500); await pg.screenshot(path=f'{TAG}-{kind}-outro.png')
                    if s['sc']=='gamble:intro': await tap('#fsBar [data-fs=odd]' if await vis('#fsBar [data-fs=odd]') else '#fsBar .fs-act')
                    else: await pg.wait_for_timeout(300); await tap('#fsBar .fs-act' if await vis('#fsBar .fs-act') else '#fsBar [data-fs=spin]')
                    continue
                if s['feat']: await tap('#fsBar .fs-act' if await vis('#fsBar .fs-act') else '#fsBar [data-fs=spin]'); continue
                if s['free']>0: await tap('#fsBar [data-fs=spin]'); continue
                if kind=='win' and s['gamble']>0: await tap('#fsBar [data-fs=odd]'); continue
                if i>40: break
            s=await pg.evaluate(JS); P('done',kind,'stages',seen,'bal',b0,'->',s['bal'])
        print('\n'.join(l for l in logs if 'Failed to load' not in l)[:600]); await b.close()
asyncio.run(main())
