import asyncio,json,sys
sys.path.insert(0,'test')
from common import *
async def main():
    async with async_playwright() as p:
        for (w,h,q,touch) in [(1280,800,'?qa=1&nolock=1',False),(1280,800,'?qa=1',False),(430,880,'?qa=1',True)]:
            b,page,errs,reqs=await launch(p,w=w,h=h,query=q,touch=touch); E=page.evaluate
            await (page.tap('#enterBtn') if touch else page.click('#enterBtn')); await E('__QA.setAuto(false)')
            if not touch: await page.mouse.move(w/2,h/2)
            out=[]
            for carry,play in [(0,0),(1,0),(1,1)]:
                await E(f'''(async()=>{{const a=__QA.app,V=a.vinyl,it=V.primary['alb_146ecd98f790'],L=it.lane;if({carry}&&!a.carry)V.pickUp(V.primary['alb_44b88712cd32']);if({play}&&!a.playback.s.rel)a.playback.play(a.catalog.releases[0],0,'cd-case',0);__QA.teleport(L.x,L.zFront+.8,0,0);__QA.lookAt(L.x,.7+L.j.s,it.piv.position.z-.05);await __QA.step(.5)}})()''')
                r=await E('''(()=>{const R=id=>{const e=document.getElementById(id);if(!e||e.hidden)return null;const r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top),Math.round(r.right),Math.round(r.bottom)]};return {tip:R('tip'),carry:R('carry'),mini:R('mini'),jumps:R('jumps'),pad:getComputedStyle(document.getElementById('pad')).display!=='none'?R('pad'):null,look:__QA.state().look,txt:document.getElementById('tip').innerText.slice(0,40)}})()''')
                out.append(r)
                def ov(a,b): return a and b and not(a[2]<=b[0] or b[2]<=a[0] or a[3]<=b[1] or b[3]<=a[1])
                t=r['tip']; assert t, r
                assert t[1]>h*0.62 or t[3]<h*0.2, ('tip not clear of centre',r)
                for k in ['carry','mini','jumps','pad']: assert not ov(t,r[k]),(k,r)
                assert not ov(r['carry'],r['mini']) and not ov(r['carry'],r['jumps']),r
            print(w,h,q,json.dumps(out[-1])); await page.screenshot(path=f'test/shot_tip_{w}_{len(q)}.png')
            assert not errs,errs
            await b.close()
        print('TIP LAYOUT OK')
asyncio.run(main())
