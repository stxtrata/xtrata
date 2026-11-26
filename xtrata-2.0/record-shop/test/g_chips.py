import asyncio,json,sys
sys.path.insert(0,'test')
from common import *
R={}
def ok(n,c,i=''):
    R[n]=bool(c); print(('PASS ' if c else 'FAIL ')+n,i if not c else '')
async def main():
    async with async_playwright() as p:
        for (w,h,touch) in [(1280,800,False),(1440,900,False),(430,880,True)]:
            tag=f'[{w}x{h}] '
            b,page,errs,reqs=await launch(p,w=w,h=h,query='?qa=1&nolock=1',touch=touch); E=page.evaluate
            await (page.tap('#enterBtn') if touch else page.click('#enterBtn')); await E('__QA.setAuto(false)')
            async def click(n):
                r=(await E('__QA.app.inspector.chipRects()'))[n]; x,y=(r[0]+r[2])/2,(r[1]+r[3])/2
                el=await E(f"document.elementFromPoint({x},{y}).closest('button')?.dataset.c")
                assert el==n,(n,el,r)
                await (page.touchscreen.tap(x,y) if touch else page.mouse.click(x,y))
            def bounds_js(): return '''(()=>{const I=__QA.app.inspector,it=I.item,m=it.model,V=__QA.THREE.Vector3;const pts=[];const hw=(it.kind==='cd'?m.W:m.dim.s)/2,hh=(it.kind==='cd'?m.H:m.dim.s)/2;const o=it.kind==='cd'?m.group:m.group;for(const [x,y] of [[-hw,-hh],[hw,-hh],[hw,hh],[-hw,hh]])pts.push(__QA.fgProject(o,new V(x,y,0)));return {l:Math.min(...pts.map(p=>p.x)),r:Math.max(...pts.map(p=>p.x)),t:Math.min(...pts.map(p=>p.y)),b:Math.max(...pts.map(p=>p.y))}})()'''
            for kind,rel in [('vinyl','alb_04596c4461b5'),('vinyl','alb_4c6883677c73'),('cd','alb_04596c4461b5')]:
                if kind=='vinyl': await E(f"(async()=>{{const a=__QA.app,it=a.vinyl.primary['{rel}'],L=it.lane;__QA.teleport(L.x,L.zFront+.8,0,0);a.vinyl.inspect(it);await __QA.step(1)}})()")
                else: await E(f"(async()=>{{const a=__QA.app,s=a.stock.primary['{rel}'];__QA.teleport(s.pos.x+1,s.pos.z,0,0);a.stock.extract(s);await __QA.step(2)}})()")
                if not touch: await page.mouse.move(w*.3,h*.45); await E('__QA.step(.6)')
                await E("__QA.app.inspector.yawT=0;__QA.app.inspector.pitchT=0"); await E('__QA.step(.8)')
                cr=await E('__QA.app.inspector.chipRects()'); bd=await E(bounds_js()); pr=await E("(()=>{const r=document.getElementById('insp').getBoundingClientRect();return [r.left,r.top,r.right,r.bottom]})()")
                def ov(a,b): return not(a[2]<=b[0]+1 or b[2]<=a[0]+1 or a[3]<=b[1]+1 or b[3]<=a[1]+1)
                item=[bd['l'],bd['t'],bd['r'],bd['b']]; names=list(cr)
                ok(tag+kind+' chips shown, labelled, on screen, clear of the artwork, the panel and each other',len(cr)==7 and all(c[0]>=0 and c[2]<=w and c[1]>=0 and c[3]<=h for c in cr.values()) and not any(ov(c,item) for c in cr.values()) and not any(ov(c,pr) for c in cr.values()) and not any(ov(cr[a],cr[b2]) for i,a in enumerate(names) for b2 in names[i+1:]) and cr['flip'][4]=='Flip' and 'Back to' in cr['ret'][4],(cr,item,pr))
                # stays put while item tilts
                if not touch:
                    await page.mouse.move(w*.55,h*.2); await E('__QA.step(.6)'); cr2=await E('__QA.app.inspector.chipRects()'); yaw=await E('__QA.app.inspector.yaw')
                    ok(tag+kind+' chips hold still while the item turns',abs(yaw)>.05 and all(cr2[n][:4]==cr[n][:4] for n in cr),yaw)
                    r=cr['flip']; await page.mouse.move((r[0]+r[2])/2,(r[1]+r[3])/2,steps=6); y1=await E('__QA.app.inspector.yawT'); await page.mouse.move((r[0]+r[2])/2+3,(r[1]+r[3])/2+2); y2=await E('__QA.app.inspector.yawT')
                    ok(tag+kind+' item stops turning while the cursor is over a chip',y1==y2)
                await click('flip'); await E('__QA.step(.7)'); f1=await E('__QA.app.inspector.flip'); await click('flip'); await E('__QA.step(.7)')
                await click('crate'); c1=await E(f"__QA.app.shop.inCrate(__QA.app.relById['{rel}'],'{kind}')"); lab=(await E('__QA.app.inspector.chipRects()'))['crate'][4]; await click('crate')
                await click('main'); await E('__QA.step(.9)'); m1=await E("__QA.app.inspector.item.kind==='cd'?__QA.app.inspector.item.model.open:__QA.app.inspector.peek"); cr3=await E('__QA.app.inspector.chipRects()')
                ok(tag+kind+' Flip, Crate List and Open/Peek chips work by real click',f1==1 and c1 and lab=='In Crate List' and m1>.9 and all(c[0]>=0 and c[2]<=w for c in cr3.values()),(f1,c1,lab,m1))
                s0=await E("__QA.app.inspector.item.slot.id"); await click('next'); await E('__QA.step(.5)'); s1=await E("__QA.app.inspector.item.slot.id"); await click('prev'); await E('__QA.step(.5)'); s2=await E("__QA.app.inspector.item.slot.id")
                ok(tag+kind+' previous / next chips step through neighbours',s1!=s0 and s2==s0,(s0,s1,s2))
                if kind=='vinyl' and rel=='alb_04596c4461b5':
                    await click('carry'); await E('__QA.step(1)'); st=await E(S)
                    ok(tag+'Carry chip: walk away holding the sleeve',st['mode']=='room' and st['carry'] and st['carry']['rel']==rel,st['carry'])
                    await E("__QA.app.vinyl.returnCarried()")
                elif kind=='vinyl':
                    if not touch:
                        await page.keyboard.press('w'); await E('__QA.step(1)'); st=await E(S); ok(tag+'pressing W while holding a sleeve carries it',st['mode']=='room' and st['carry'] is not None); await E("__QA.app.vinyl.returnCarried()")
                    else:
                        await click('ret'); await E('__QA.step(1.2)'); st=await E(S); ok(tag+'Back to crate chip returns the sleeve',st['mode']=='room' and st['carry'] is None and await E("__QA.app.vinyl.items.filter(i=>i.out).length")==0)
                else:
                    await click('carry'); await E('__QA.step(1.2)'); await click('carry'); await E('__QA.step(.3)'); st=await E(S); lab=(await E('__QA.app.inspector.chipRects()'))['carry'][4]
                    await click('carry'); await E('__QA.step(.3)'); st2=await E(S)
                    ok(tag+'Take disc chip (opens case, takes disc, puts it back)',st['carry'] and st['carry']['kind']=='cd' and lab=='Put disc back' and st2['carry'] is None,(st['carry'],lab))
                    await click('ret'); await E('__QA.step(.8)'); hid=await E("document.getElementById('chips').hidden"); await E("__QA.app.inspector.close()"); await E('__QA.step(3)'); st=await E(S)
                    ok(tag+'Back to shelf chip returns the case; chips hide',st['mode']=='room' and hid and await E("__QA.app.stock.slots.filter(x=>x.out).length")==0,st['mode'])
                if kind=='vinyl' and rel=='alb_04596c4461b5' : pass
            await E(f"(async()=>{{const a=__QA.app,it=a.vinyl.primary['alb_146ecd98f790'],L=it.lane;__QA.teleport(L.x,L.zFront+.8,0,0);a.vinyl.inspect(it);await __QA.step(1.2)}})()"); await page.screenshot(path=f'test/shot_chips_{w}.png')
            ok(tag+'no console errors',not errs,errs[:3]); await b.close()
        print(json.dumps({'passed':sum(R.values()),'total':len(R),'failed':[k for k,v in R.items() if not v]}))
asyncio.run(main())
