import asyncio,json,sys,math
sys.path.insert(0,'test')
from common import *
R={}
def ok(name,cond,info=''):
    R[name]=bool(cond); print(('PASS ' if cond else 'FAIL ')+name,info if (info!='' and (not cond or len(str(info))<160)) else '')
async def main():
    async with async_playwright() as p:
        b,page,errs,reqs=await launch(p); E=page.evaluate
        await page.screenshot(path='test/shot_intro.png')
        intro=await page.inner_text('#intro')
        # keyboard-only entry and real-time loop sanity (auto on)
        await page.keyboard.press('Enter'); await page.wait_for_timeout(2500); st=await E(S)
        ok('19 keyboard Enter enters; real-time frame loop runs cleanly',st['entered'] and 'WASD' in intro and len(errs)==0,errs[:3])
        await page.keyboard.down('w'); await page.wait_for_timeout(1200); await page.keyboard.up('w'); st2=await E(S)
        ok('3 real-time walking with W (delta-time)',st2['player']['z']<st['player']['z']-.3,(st['player']['z'],st2['player']['z']))
        await E('__QA.setAuto(false)'); await page.mouse.move(640,400)
        # category sign opens filtered browser
        await E("__QA.teleport(-5.6,1,Math.PI/2,0);__QA.lookAt(-7.32,2.2,.97)"); await E('__QA.step(.2)'); hv=(await E(S))['hover']
        await page.keyboard.press('Enter'); st=await E(S); n=await page.locator('#fres .res').count(); chip=await page.inner_text('#fchips .on')
        ok('15 physical category sign opens the filtered browser',hv and hv['id']=='sign:cd-albums' and st['modal']=='finder' and n==9 and 'Albums' in chip,(hv,n,chip)); await page.keyboard.press('Escape')
        # keyboard-only vinyl flow incl. Enter helpers and sleeve drag-right
        await E("(async()=>{const a=__QA.app,V=a.vinyl;__QA.teleport(4.3,-3.45,0,-.35);V.pickUp(V.primary['alb_699bc9e1954f']);V.focus();await __QA.step(1.2)})()")
        await page.keyboard.press('Enter'); await E('__QA.step(1.5)'); q1=(await E(S))['vinyl']
        xy=await E("__QA.app.vinyl.project('sleeve')"); await page.mouse.move(xy['x'],xy['y']); await page.mouse.down(); await page.mouse.move(xy['x']+90,xy['y'],steps=5); await page.mouse.up(); await E('__QA.step(1.4)'); q2=(await E(S))['vinyl']
        ok('10 optional rightward sleeve drag also slides the record out',q1['phase']=='sleeved' and q2['phase']=='loose')
        await page.keyboard.press('Enter'); await E('__QA.step(2)'); q3=(await E(S))['vinyl']; await page.keyboard.press('2'); await E('__QA.step(3)'); pb=(await E(S))['playback']
        await page.keyboard.press(' '); await E('__QA.step(.5)'); pb2=(await E(S))['playback']; await page.keyboard.press(']'); pt=(await E(S))['vinyl']['pitch']
        ok('19 keyboard alternatives: Enter places/seats, digit cues a track, Space cues up, ] pitch',q3['phase']=='parked' and pb['trackId']==1731 and pb['playing'] and not pb2['playing'] and abs(pt-.01)<1e-9,(pb['trackId'],pt))
        await page.keyboard.press('r'); await E('__QA.step(9)'); await page.keyboard.press('Escape'); await E('__QA.step(1)'); st=await E(S)
        ok('14 keyboard R returns the pressing',st['vinyl']['phase']=='empty' and st['mode']=='room' and await E("__QA.app.vinyl.items.filter(i=>i.out).length")==0)
        # CD deck keyboard
        await E("(async()=>{const a=__QA.app,s=a.stock.primary['alb_b75dbf32d363'];__QA.teleport(s.pos.x+1,s.pos.z,0,0);a.stock.extract(s,{autoOpen:true});await __QA.step(2.6)})()")
        await page.keyboard.press('t'); await page.keyboard.press('r'); await E('__QA.step(3)'); await page.keyboard.press('3'); await E('__QA.step(7)'); s0=await E(S)
        for k,w in [('e',.8),('Enter',.7),('e',.8),(' ',.4)]:
            await page.keyboard.press(k); await E(f'__QA.step({w})')
        st=await E(S)
        ok('19 keyboard CD flow: T take, 3 jump, E eject, Enter load, E close, Space play',s0['mode']=='cd' and st['playback']['source']=='cd-deck' and st['playback']['trackId']==2830 and st['playback']['playing'],(s0['mode'],st['playback']))
        await E('__QA.step(13)'); st=await E(S)
        ok('18 track end: 12 s single stops cleanly at its exact length',not st['playback']['playing'] and st['playback']['elapsed']==0 and st['deck']['disc']=='alb_b75dbf32d363')
        await page.keyboard.press('e'); await E('__QA.step(.8)'); await page.keyboard.press('r'); await page.keyboard.press('e'); await E('__QA.step(.8)'); await page.keyboard.press('Escape'); await E('__QA.step(1)')
        ok('no console errors',len(errs)==0,errs[:5]); await b.close()
        # lane paging with a larger supplied catalogue
        b,page,errs,reqs=await launch(p); E=page.evaluate
        cat=json.loads(await E("JSON.stringify({albums:__QA.app.catalog.albums,singles:__QA.app.catalog.singles,feed_songs:123})")); await b.close()
        extra=[]
        for i in range(30):
            extra.append({'id':f'alb_extra{i:03d}','type':'single','artist':'Test Press','title':f'Extra Single {i}','trust':'named','minutes':1,'cover':f'k{i}','flags':[],'tracks':[{'n':1,'id':90000+i,'seconds':60+i,'img':f'k{i}','title':f'Extra Single {i}'}]})
        cat['singles']+=extra
        b,page,errs,reqs=await launch(p,init='window.XTRATA_SHOP_DATA='+json.dumps(cat)); E=page.evaluate
        await enter(page); await E('__QA.step(.2)')
        pg=await E('''(async()=>{const a=__QA.app,V=a.vinyl,L=V.lanes[2],r=a.relById['alb_extra029'];const it=V.primary[r.id];const before={pages:L.pages,page:L.page,vis:L.items.filter(i=>i.piv.visible).length};
          a.shop.routeVinyl(r);for(let i=0;i<60;i++){await __QA.step(.25);if(!a.player.travel&&i>1)break;}await __QA.step(.8);const t=__QA.pick();const L2=it.lane;
          const cds=a.stock.slots.filter(s=>s.rel===r).length;return {before,lane:L2.id,pages:L2.pages,page:L2.page,pg:it.pg,pick:t&&t.id,want:'vin:'+it.id,cds,all:a.shop.search('').length,spines:a.stock.count.spines}})()''')
        ok('9 larger catalogue: lanes paginate; finder turns to the right page; every release still stocked on CD',pg['pages']>1 and pg['page']==pg['pg'] and pg['pick']==pg['want'] and pg['cds']>=1 and pg['all']==51,pg)
        ok('paging run: no console errors',len(errs)==0,errs[:3]); await b.close()
        print(json.dumps({'passed':sum(R.values()),'total':len(R),'failed':[k for k,v in R.items() if not v]}))
asyncio.run(main())
