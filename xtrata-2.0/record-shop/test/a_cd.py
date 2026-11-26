import asyncio,json,sys
sys.path.insert(0,'test')
from common import *
R={}
def ok(name,cond,info=''):
    R[name]=bool(cond); print(('PASS ' if cond else 'FAIL ')+name,info if (info!='' and (not cond or len(str(info))<200)) else '')
async def main():
    async with async_playwright() as p:
        b,page,errs,reqs=await launch(p)
        E=page.evaluate
        await page.mouse.move(640,400)
        await enter(page); await E('__QA.step(0.3)')
        st=await E(S)
        c=st['catalog']; ok('1 catalogue 9+12=21/49',c['albums']==9 and c['singles']==12 and c['releases']==21 and c['tracks']==49 and c['feed']==123,c)
        both=await E('''(()=>{const a=__QA.app;return a.catalog.releases.every(r=>a.stock.primary[r.id]&&a.vinyl.primary[r.id]&&a.vinyl.primary[r.id].lane.size===(r.type==='single'?7:12))})()''')
        ok('1 every release on CD and correct vinyl size',both)
        ok('2 no network requests',all(r.startswith('file://') or r.startswith('data:') or r.startswith('blob:') for r in reqs),[r for r in reqs if not r.startswith('file')][:3])
        # 3 look without buttons, centre pick independent of cursor
        y0=(await E(S))['player']['yaw']
        await page.mouse.move(700,400,steps=4); await E('__QA.step(0.05)')
        y1=(await E(S))['player']['yaw']; ok('3 mouse move (no button) turns view',abs(y1-y0)>0.05,(y0,y1))
        # walk into the wall: stays inside
        await E('__QA.teleport(-6.5,0,Math.PI/2,0)'); await page.keyboard.down('w'); await E('__QA.step(3)'); await page.keyboard.up('w')
        pl=(await E(S))['player']; ok('3 collision stops at CD wall',pl['x']>-7.1 and not await E(f'__QA.blocked({pl["x"]},{pl["z"]},0.29)'),pl)
        # travel routes never pass through furniture
        bad=await E('''(async()=>{const a=__QA.app;let bad=[];for(const n of ['CD Wall','Vinyl Crates','Checkout','Window','Entrance','CD Wall','Window']){a.jump(n);for(let i=0;i<900;i++){await __QA.step(1/60);if(__QA.blocked(a.player.x,a.player.z,.27))bad.push([n,a.player.x,a.player.z]);if(!a.player.travel&&i>5)break;}
          const j=a.jumps[n];if(Math.hypot(a.player.x-j.x,a.player.z-j.z)>.05)bad.push(['notarrived',n,a.player.x,a.player.z]);}return bad})()''')
        ok('3 quick-jump routes collision-safe and arrive',len(bad)==0,bad[:3])
        # 4 every slot individually selected by the centre ray
        res=await E('''(()=>{const a=__QA.app,ST=a.stock;let bad=[],n=0;for(const s of ST.slots){if(s.fixture==='endcap')continue;n++;const d=s.kind==='spine'?1.1:1.2;
          const tx=s.kind==='spine'?s.pos.x+s.normal.x*__QA.CD.W/2:s.pos.x,px=s.pos.x+s.normal.x*d;__QA.teleport(px+ (s.kind==='spine'?s.normal.x*__QA.CD.W/2:0),s.pos.z,0,0);__QA.lookAt(tx,s.pos.y,s.pos.z);const t=__QA.pick();if(!t||t.id!=='cd:'+s.id)bad.push([s.id,t&&t.id]);}return {n,bad:bad.slice(0,5),nbad:bad.length}})()''')
        ok('4 all %d wall+island slots picked exactly'%res['n'],res['nbad']==0 and res['n']>900,res)
        # hover stability: aim near slot boundary, animate, check target never changes
        osc=await E('''(async()=>{const a=__QA.app,s=a.stock.rows[2].slots[40];__QA.teleport(s.pos.x+.9+__QA.CD.W/2,s.pos.z,0,0);__QA.lookAt(s.pos.x+__QA.CD.W/2,s.pos.y+.02,s.pos.z+.004);let ids=new Set();for(let i=0;i<90;i++){await __QA.step(1/60);const t=__QA.pick();ids.add(t&&t.id);}return {ids:[...ids],hover:s.hover,want:'cd:'+s.id}})()''')
        ok('4 hover peek does not oscillate',len(osc['ids'])==1 and osc['ids'][0]==osc['want'] and abs(osc['hover']-0.28)<1e-6,osc)
        # 5 numerical clearance, all slots, several viewer positions
        cl=await E('''(()=>{const a=__QA.app,ST=a.stock,V=__QA.THREE.Vector3;let m={swivel:9,lip:9,ceil:9,rot:0,n:0};for(const s of ST.slots){for(const [d,o] of [[.45,0],[1.2,.9],[1.2,-.9],[2.5,0],[.5,.5]]){if(s.fixture==='endcap')continue;const cp=new V(s.pos.x+s.normal.x*d-s.normal.z*o,1.62,s.pos.z+s.normal.z*d+s.normal.x*o+o);const c=ST.clearance(s,cp);m.swivel=Math.min(m.swivel,c.swivel);m.lip=Math.min(m.lip,c.lip);m.ceil=Math.min(m.ceil,c.ceil);m.rot+=c.rotInside;m.n++;}}
          for(const E of ST.endcaps)for(const s of E.slots){const c=ST.clearance(s,a.camera.position);m.swivel=Math.min(m.swivel,c.swivel);m.rot+=c.rotInside;}return m})()''')
        ok('5 swivel corner clearance >=0.10 m, lip/ceiling clear, no rotation inside shelf',cl['swivel']>=0.10 and cl['lip']>0.02 and cl['ceil']>0.02 and cl['rot']==0,cl)
        # real extraction by centre click, cancel midway, return restores exact instance
        ex=await E('''(async()=>{const a=__QA.app,ST=a.stock,out=[];const m4=new __QA.THREE.Matrix4();
          for(const ri of [0,1,2,3,4,5,6,7]){const R=ST.rows[ri];for(const s of [R.slots[3],R.slots.find(x=>x.kind==='face')]){const before=new __QA.THREE.Matrix4();s.mesh.getMatrixAt(s.inst,before);
            __QA.teleport(s.pos.x+1.0,s.pos.z+.2,0,0);__QA.lookAt(s.kind==='spine'?s.pos.x+__QA.CD.W/2:s.pos.x,s.pos.y,s.pos.z);await __QA.step(.3);
            a.clickCentre();await __QA.step(.3);const mid=ST.active&&ST.active.p;ST.cancelExtract();await __QA.step(1.2);const out2=s.out;__QA.teleport(0,3,0,0);await __QA.step(.6);s.mesh.getMatrixAt(s.inst,m4);const same=m4.equals(before)&&!out2&&!s.out&&!ST.active&&a.state.mode==='room';out.push([s.id,mid>0&&mid<1,same]);}}
          return out})()''')
        ok('5 cancel mid-extraction restores exact slot (all 8 tiers, spine+face)',all(x[1] and x[2] for x in ex),ex[:3])
        # 6 close against wall: full extraction via real mouse click at off-centre coordinate
        await E('''(()=>{const a=__QA.app,s=a.stock.primary['alb_2713ad171d27'];window.SL=s;__QA.teleport(s.pos.x+.5,s.pos.z,0,0);__QA.lookAt(s.pos.x,s.pos.y,s.pos.z);})()''')
        await E('__QA.step(.2)')
        await page.mouse.move(640,400); await E('__QA.lookAt(SL.pos.x,SL.pos.y,SL.pos.z)')
        hv=(await E(S))['hover']
        await page.mouse.down(); await page.mouse.up()
        await E('__QA.step(.4)'); mid=await E(S)
        await E('__QA.step(1.5)'); st=await E(S)
        ok('6 centre click pulls the aimed case (Proof of Sound)',hv and 'Proof of Sound' in hv['title'] and mid['extract'] and st['mode']=='inspect' and st['inspect']['rel']=='alb_2713ad171d27',st['inspect'])
        fgc=await E('''(()=>{const a=__QA.app,I=a.inspector,m=I.item.model;return {inFg:m.group.parent===a.fgScene,sameTex:m.cover.material.map===a.art.cover(I.item.rel).tex,slotHidden:SL.out,autoClear:a.renderer.autoClear,bg:a.fgScene.background,dist:-m.group.position.z,others:a.stock.slots.filter(s=>s.out).length}})()''')
        ok('6 held case in separate foreground scene, depth-cleared pass, only selected copy hidden',fgc['inFg'] and fgc['autoClear']==False and fgc['bg'] is None and fgc['slotHidden'] and fgc['others']==1,fgc)
        ok('2 close-up reuses identical cover texture object',fgc['sameTex'])
        await page.screenshot(path='test/shot_inspect_wall.png')
        # front click opens; UV tile picks
        async def part_xy(part,lx=0,ly=0):
            return await E(f'''(()=>{{const m=__QA.app.inspector.item.model;const o={{front:m.cover,rear:m.rear,book:m.book,disc:m.disc}}['{part}'];return __QA.fgProject(o,new __QA.THREE.Vector3({lx},{ly},0))}})()''')
        for _ in range(3):
            xy=await part_xy('front'); await page.mouse.move(xy['x'],xy['y']); await E('__QA.step(.4)')
        xy=await part_xy('front'); pk=await E(f"__QA.app.inspector.pick({xy['x']},{xy['y']})")
        ok('6 real geometric pick on front cover',pk and pk['part']=='front',pk and pk['part'])
        await page.keyboard.press('f'); await E('__QA.step(.8)'); xy=await part_xy('rear'); pk=await E(f"__QA.app.inspector.pick({xy['x']},{xy['y']})")
        ok('6 flipped: rear card is hit, no track starts',pk and pk['part']=='rear' and (await E(S))['playback']['rel'] is None,pk and pk['part'])
        await page.keyboard.press('f'); await E('__QA.step(.8)')
        for _ in range(3):
            xy=await part_xy('front'); await page.mouse.move(xy['x'],xy['y']); await E('__QA.step(.3)')
        await page.mouse.down(); await page.mouse.up(); await E('__QA.step(1.2)')
        st=await E(S); ok('6 clicking the cover opens the hinged lid',st['inspect']['open']>0.99,st['inspect'])
        tiles=await E('''(()=>{const m=__QA.app.inspector.item.model;return m.tiles.map(t=>({i:t.i,...__QA.fgProject(m.book,new __QA.THREE.Vector3(-((t.au0+t.au1)/2-.5)*m.W*.97*-1*-1,(((t.av0+t.av1)/2)-.5)*m.H*.97,0))}))})()''')
        # booklet plane is rotated PI about Y: local +x maps to u; compute by uv -> local x = (u-.5)*w
        tiles=await E('''(()=>{const m=__QA.app.inspector.item.model;return m.tiles.map(t=>({i:t.i,id:m.rel.tracks[t.i].id,...__QA.fgProject(m.book,new __QA.THREE.Vector3(((t.au0+t.au1)/2-.5)*m.W*.97,(((t.av0+t.av1)/2)-.5)*m.H*.97,0))}))})()''')
        good=True; info=[]
        for t in tiles:
            await page.mouse.click(t['x'],t['y']); await E('__QA.step(.1)'); pb=(await E(S))['playback']
            info.append((t['id'],pb['trackId'],pb['playing'])); good=good and pb['trackId']==t['id'] and pb['playing'] and pb['source']=='cd-case'
        ok('7 each artwork tile plays its exact inscription (6 tiles incl. duplicate titles)',good and len(tiles)==6,info)
        t=tiles[2]; await page.mouse.click(t['x'],t['y']); await E('__QA.step(.1)'); pb=(await E(S))['playback']
        await E('__QA.step(2)'); pb1=(await E(S))['playback']
        await page.mouse.click(t['x'],t['y']); await E('__QA.step(.1)'); pb2=(await E(S))['playback']
        await page.mouse.click(t['x'],t['y']); await E('__QA.step(1)'); pb3=(await E(S))['playback']
        ok('7 same tile: pause then resume from offset',pb1['playing'] and pb1['elapsed']>1.9 and (not pb2['playing']) and pb2['trackId']==t['id'] and pb3['playing'] and pb3['elapsed']>pb2['elapsed']+.9,(pb1['elapsed'],pb2['playing'],pb3['elapsed']))
        dxy=await part_xy('disc',.05,0); await page.mouse.click(dxy['x'],dxy['y']); await E('__QA.step(.1)'); pb4=(await E(S))['playback']
        await page.mouse.click(dxy['x'],dxy['y']); await E('__QA.step(.1)'); pb5=(await E(S))['playback']
        ok('7 physical disc click toggles current track',(not pb4['playing']) and pb5['playing'] and pb5['trackId']==t['id'])
        print('DBG',await E('''(()=>{const a=__QA.app,r=a.relById['alb_2713ad171d27'];const sum=c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let s=0;for(let i=0;i<d.length;i+=40)s+=d[i];return s};
          return {trk:sum(a.art.track(r,r.tracks[1]).canvas),cov:sum(a.art.cover(r).canvas),book:sum(a.inspector.item.model.book.material.map.image),ctxLost:a.art.cover(r).canvas.getContext('2d').isContextLost&&a.art.cover(r).canvas.getContext('2d').isContextLost()}})()'''))
        await page.wait_for_timeout(500)
        await page.screenshot(path='test/shot_case_open.png')
        pt=await E('''(()=>{const I=__QA.app.inspector;for(let y=140;y<660;y+=24)for(let x=20;x<880;x+=24){if(document.elementFromPoint(x,y)===__QA.app.canvas&&!I.pick(x,y))return [x,y]}return null})()''')
        await page.mouse.click(pt[0],pt[1]); await E('__QA.step(1)'); st=await E(S)
        ok('7 click outside closes lid, playback continues',st['inspect']['open']<.01 and st['playback']['playing'] and st['mode']=='inspect',st['inspect'])
        # prev/next case, then back to the original
        await page.keyboard.press('ArrowRight'); await E('__QA.step(.5)'); s2=await E(S)
        await page.keyboard.press('ArrowLeft'); await E('__QA.step(.5)'); s3=await E(S)
        ok('6 previous/next case swaps stock correctly',s2['inspect']['slot']!=s3['inspect']['slot'] and s3['inspect']['slot']==await E('SL.id') and await E('__QA.app.stock.slots.filter(s=>s.out).length')==1)
        # 8 take disc, return case, carry to deck
        await page.keyboard.press('t'); await E('__QA.step(1.2)'); await page.keyboard.press('t'); await E('__QA.step(.3)'); st=await E(S)
        ok('8 take CD: disc leaves this copy, carried, case playback stopped',st['carry'] and st['carry']['kind']=='cd' and st['cd']['state']=='carried' and st['inspect']['discVisible']==False and st['playback']['rel'] is None,st['cd'])
        await E('__QA.app.inspector.playTile(0)'); ok('8 empty case cannot play / create a second disc',(await E(S))['playback']['rel'] is None)
        await page.keyboard.press('Escape'); await E('__QA.step(.8)'); await page.keyboard.press('Escape'); await E('__QA.step(2.2)'); st=await E(S)
        ok('5 return: case back in its exact slot',st['mode']=='room' and st['inspect'] is None and st['extract'] is None and await E('!SL.out'),st['mode'])
        # second disc guard
        g=await E('''(async()=>{const a=__QA.app,s=a.stock.primary['alb_9c4f80239be6'];__QA.teleport(s.pos.x+1,s.pos.z,0,0);__QA.lookAt(s.pos.x,s.pos.y,s.pos.z);a.stock.extract(s,{autoOpen:true});await __QA.step(2.5);const r=a.inspector.takeDisc();const st=a.cd.rel.id;a.inspector.close();await __QA.step(3);return [r,st,a.state.mode]})()''')
        ok('8 conflicting second disc refused',g[0]==False and g[1]=='alb_2713ad171d27' and g[2]=='room',g)
        await page.click('button[data-jump="CD Player"]'); await E('__QA.step(6)'); st=await E(S)
        ok('8 jump to CD Player focuses deck, carried disc preserved',st['mode']=='cd' and st['carry']['kind']=='cd',st['mode'])
        async def btn(n):
            xy=await E(f"__QA.app.deck.project('{n}')"); await page.mouse.click(xy['x'],xy['y'])
        await btn('play'); await E('__QA.step(.2)'); ok('8 play with no disc guarded',(await E(S))['playback']['rel'] is None)
        await btn('tray'); await E('__QA.step(.2)'); ok('8 closed tray refuses disc',(await E(S))['deck']['disc'] is None and (await E(S))['carry'] is not None)
        await btn('eject'); await E('__QA.step(.3)'); await btn('tray'); await E('__QA.step(.1)'); ok('8 moving tray refuses disc',(await E(S))['deck']['tray']=='opening' and (await E(S))['carry'] is not None)
        await E('__QA.step(.6)'); d=(await E(S))['deck']; ok('8 eject animates tray open (~0.64s)',d['tray']=='open' and d['t']==1,d)
        await page.screenshot(path='test/shot_deck_open.png')
        await btn('tray'); await E('__QA.step(.2)'); d1=(await E(S))['deck']; await E('__QA.step(.6)'); st=await E(S)
        ok('8 click exposed tray: carried disc animates onto recess',d1['loading'] and st['deck']['disc']=='alb_2713ad171d27' and st['carry'] is None and st['cd']['state']=='tray',st['deck'])
        await btn('play'); await E('__QA.step(.2)'); ok('8 no playback before tray closes',(await E(S))['playback']['rel'] is None)
        await btn('eject'); await E('__QA.step(1)'); await btn('play'); await E('__QA.step(1.5)'); st=await E(S)
        ok('8 close + Play plays track 1 from deck',st['deck']['tray']=='closed' and st['playback']['source']=='cd-deck' and st['playback']['playing'] and st['playback']['trackId']==577 and st['cd']['state']=='loaded',st['playback'])
        await btn('next'); await E('__QA.step(.5)'); a1=(await E(S))['playback']; await btn('pause'); await E('__QA.step(.5)'); a2=(await E(S))['playback']; await btn('prev'); await E('__QA.step(.2)'); a3=(await E(S))['playback']
        ok('8 next / pause / prev agree with shared playback',a1['trackId']==688 and a1['playing'] and not a2['playing'] and a3['trackId']==577,(a1['trackId'],a2['playing'],a3['trackId']))
        await btn('play'); await E('__QA.step(.5)')
        mini=await page.inner_text('#mini'); ok('18 mini-player + demo label agree',('Stacks Transmission' in mini) and ('Demo timer' in mini) and ('CD PLAYER' in mini),mini[:120])
        await page.keyboard.press('Escape'); await E('__QA.step(1)'); st=await E(S)
        ok('8 step back keeps loaded state and playback',st['mode']=='room' and st['deck']['disc'] and st['playback']['playing'],st['mode'])
        # case of loaded disc shows empty tray
        em=await E('''(async()=>{const a=__QA.app;__QA.teleport(SL.pos.x+1,SL.pos.z,0,0);a.stock.extract(SL,{autoOpen:true});await __QA.step(2.5);const v=a.inspector.item.model.disc.visible;const p=a.inspector.playTile(1);a.inspector.close();await __QA.step(3);return [v,p,a.playback.s.source]})()''')
        ok('8 original case shows empty tray while disc is loaded',em[0]==False and em[1]==False and em[2]=='cd-deck',em)
        await page.click('button[data-jump="CD Player"]'); await E('__QA.step(6)'); st=await E(S)
        ok('8 re-enter retains loaded state',st['mode']=='cd' and st['deck']['disc']=='alb_2713ad171d27' and st['deck']['tray']=='closed')
        await btn('eject'); await E('__QA.step(1)'); st=await E(S); ok('8 eject pauses',not st['playback']['playing'] and st['deck']['tray']=='open')
        await page.click('#station button[data-s="return"]'); await E('__QA.step(.3)'); st=await E(S)
        ok('8 return from open tray restores disc to original case',st['cd']['state']=='none' and st['deck']['disc'] is None and st['playback']['rel'] is None,st['cd'])
        await btn('eject'); await E('__QA.step(1)'); await page.keyboard.press('Escape'); await E('__QA.step(1)')
        v=await E('''(async()=>{const a=__QA.app;__QA.teleport(SL.pos.x+1,SL.pos.z,0,0);a.stock.extract(SL,{autoOpen:true});await __QA.step(2.5);const v=a.inspector.item.model.disc.visible;a.inspector.close();await __QA.step(3);return v})()''')
        ok('8 disc is back in its case',v==True)
        ok('no console errors',len(errs)==0,errs[:5])
        await b.close()
        print(json.dumps({'passed':sum(R.values()),'total':len(R),'failed':[k for k,v in R.items() if not v]}))
asyncio.run(main())
