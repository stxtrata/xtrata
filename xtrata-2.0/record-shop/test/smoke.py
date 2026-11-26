import asyncio,json,sys
sys.path.insert(0,'test')
from common import *
async def main():
    async with async_playwright() as p:
        b,page,errs,reqs=await launch(p)
        await enter(page)
        await page.evaluate('__QA.step(0.5)')
        st=await page.evaluate(S)
        print(json.dumps({k:st[k] for k in ['mode','look','catalog','stock','art','render','zone']},indent=1))
        await page.screenshot(path='test/shot_entrance.png')
        for name,(x,z,yaw,pitch) in {'cdwall':(-6.0,-.5,1.5708,-.05),'crates':(3.1,1.1,0,-.6),'bench':(4.3,-3.3,0,-.4),'booth':(-5.3,-3.3,0,-.3),'window':(2,1.5,3.1416,.05),'island':(-0.3,-0.5,1.5708,-.15)}.items():
            await page.evaluate(f'__QA.teleport({x},{z},{yaw},{pitch});__QA.step(0.1)')
            await page.screenshot(path=f'test/shot_{name}.png')
        print('errors',errs[:10]); print('requests',[r for r in reqs if not r.startswith('file://')][:5], len(reqs))
        await b.close()
asyncio.run(main())
