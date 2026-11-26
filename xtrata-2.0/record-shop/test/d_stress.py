import asyncio,json,sys,math
sys.path.insert(0,'test')
from common import *
R={}
def ok(name,cond,info=''):
    R[name]=bool(cond); print(('PASS ' if cond else 'FAIL ')+name,info if (info!='' and (not cond or len(str(info))<160)) else '')
async def main():
    async with async_playwright() as p:
        b,page,errs,reqs=await launch(p); E=page.evaluate
        await page.mouse.move(640,400); await enter(page); await E('__QA.step(.2)')
        # right against the shelves: adjacent spines at 0.4 m and oblique angles
        r=await E('''(()=>{const a=__QA.app,ST=a.stock;let bad=0,n=0,occl=0;const sp=ST.slots.filter(s=>s.fixture==='wall'&&s.kind==='spine');for(let i=0;i<sp.length;i+=7){const s=sp[i];for(const dz of [0,.25,-.25]){n++;__QA.teleport(-6.98,s.pos.z+dz,0,0);__QA.lookAt(s.pos.x+__QA.CD.W/2,s.pos.y+.03,s.pos.z);const t=__QA.pick();if(!t)bad++;else if(t.id!=='cd:'+s.id){const o=ST.slots.find(x=>'cd:'+x.id===t.id);if(dz===0||o.kind!=='face'||Math.abs(o.pos.z-s.pos.z)>.14)bad++;else occl++;}}}return {n,bad,occl}})()''')
        ok('7 hard against the wall, oblique aim selects the exact spine (or the face-out physically covering it)',r['bad']==0 and r['n']>300,r)
        WALK="(async()=>{for(let k=0;k<3;k++)for(const [x,z,y] of [[-6.9,0,1.57],[6,4,3.1],[-6.9,-3,1.57],[0,4.5,0],[-7,2,1.2],[3,1,0],[4.3,-3.4,0],[-5.3,-3.4,0],[-4.9,2.7,3.14]]){__QA.teleport(x,z,y,-.1);await __QA.step(.1);}})()"
        await E(WALK)
        tex0=await E("({t:__QA.app.renderer.info.memory.textures,g:__QA.app.renderer.info.memory.geometries,ids:__QA.app.catalog.releases.map(r=>__QA.app.stock.caseMats(r)[2].map.uuid+__QA.app.art.cover(r).canvas.width).join()})")
        await E(WALK)
        tex1=await E("({t:__QA.app.renderer.info.memory.textures,g:__QA.app.renderer.info.memory.geometries,ids:__QA.app.catalog.releases.map(r=>__QA.app.stock.caseMats(r)[2].map.uuid+__QA.app.art.cover(r).canvas.width).join()})")
        ok('2 walking near/far keeps identical texture objects and allocations',tex0==tex1,(tex0['t'],tex1['t']))
        # rapid open/close/flip/zoom, repeated inspections: no leak, consistent state
        leak=await E('''(async()=>{const a=__QA.app,I=a.inspector,s=a.stock.primary['alb_e3f84cae0811'];__QA.teleport(s.pos.x+.6,s.pos.z,0,0);let m0;
          for(let k=0;k<8;k++){if(k===2)m0={...a.renderer.info.memory};a.stock.extract(s);await __QA.step(1.4);for(let j=0;j<5;j++){I.toggleOpen();await __QA.step(.08);I.flipCase();I.wheel(j%2?1:-1);await __QA.step(.05);}I.toggleOpen(true);await __QA.step(.7);I.playTile(k%3);I.step(1);await __QA.step(.2);I.step(-1);await __QA.step(.2);I.close();await __QA.step(.2);I.close();await __QA.step(2.2);}
          const m1={...a.renderer.info.memory};return {m0,m1,out:a.stock.slots.filter(x=>x.out).length,mode:a.state.mode,pb:a.playback.s.playing,fg:a.fgScene.children.filter(c=>c.isGroup).length}})()''')
        ok('7 repeated rapid open/close/flip/zoom/step: stock intact, temporary resources disposed',leak['out']==0 and leak['mode']=='room' and leak['m1']['geometries']==leak['m0']['geometries'] and leak['m1']['textures']==leak['m0']['textures'] and leak['fg']==0,leak)
        # jump while inspecting closes case then travels; Escape cancels travel
        await E("(()=>{const a=__QA.app,s=a.stock.primary['alb_e3f84cae0811'];a.stock.extract(s)})()"); await E('__QA.step(1.6)')
        await page.keyboard.press('Escape'); await E('__QA.step(.05)')
        await page.click('button[data-jump="Window"]', force=True) if False else await E("__QA.app.jump('Window')")
        await E('__QA.step(2.6)'); st=await E(S); await page.keyboard.press('Escape'); await E('__QA.step(.3)'); st2=await E(S)
        ok('3 jump during inspection returns the case first; Escape cancels travel',st['inspect'] is None and st['player']['travel'] and not st2['player']['travel'] and await E("__QA.app.stock.slots.filter(x=>x.out).length")==0,(st['mode'],st['player']['travel']))
        # vinyl playing, then modal during gestures, release over HUD, station switching, resize
        await E('''(async()=>{const a=__QA.app,V=a.vinyl;__QA.teleport(4.3,-3.45,0,-.35);V.pickUp(V.primary['alb_2713ad171d27']);V.focus();await __QA.step(1);V.placeSleeve();await __QA.step(1.5);V.extract();await __QA.step(1.2);})()''')
        xy=await E("__QA.app.vinyl.project('disc')"); await page.mouse.move(xy['x'],xy['y']); await page.mouse.down(); await E('__QA.step(.4)')
        bb=await page.locator('#bCrate').bounding_box(); await page.mouse.move(bb['x']+10,bb['y']+10,steps=4); await E('__QA.step(.2)'); hid=(await E(S))['cursorHidden']; await page.mouse.up(); await E('__QA.step(1.6)'); st=await E(S)
        ok('7 cursor stays hidden over UI while holding; release over HUD is a safe drop, no stray UI click',hid and st['modal'] is None and st['vinyl']['phase']=='loose' and not st['cursorHidden'],(hid,st['modal'],st['vinyl']['phase']))
        xy=await E("__QA.app.vinyl.project('disc')"); await page.mouse.move(xy['x'],xy['y']); await page.mouse.down(); await E('__QA.step(.4)'); await page.keyboard.press('/'); st=await E(S); await E('__QA.step(1.6)'); st2=await E(S); await page.mouse.up(); await page.keyboard.press('Escape')
        ok('7 opening a modal mid-gesture cancels it safely and restores the cursor',st['modal']=='finder' and not st['cursorHidden'] and st2['vinyl']['phase']=='loose' and st2['vinyl']['gesture'] is None,(st['modal'],st2['vinyl']['phase']))
        await E("(async()=>{const V=__QA.app.vinyl;V.placeOnSpindle();await __QA.step(1.8);V.cueTo(200);await __QA.step(3);})()"); v1=await E(S)
        await page.set_viewport_size({'width':500,'height':900}); await page.wait_for_timeout(200); await E('__QA.step(1.2)'); v2=await E(S)
        vis=await E("['pad','rest','spindle','headshell'].map(n=>__QA.app.vinyl.project(n))")
        await page.set_viewport_size({'width':1280,'height':800}); await page.wait_for_timeout(200); await E('__QA.step(1.2)'); v3=await E(S)
        ok('7 resize to portrait and back mid-play keeps state; controls stay on screen',v1['playback']['playing'] and v2['vinyl']['arm']['state']=='down' and v2['playback']['playing'] and v3['playback']['playing'] and all(0<q['x']<500 and 0<q['y']<900 for q in vis[2:]),vis)
        # arm held → modal → safe
        xy=await E("__QA.app.vinyl.project('headshell')"); await page.mouse.move(xy['x'],xy['y']); await page.mouse.down(); await E('__QA.step(.2)'); await page.keyboard.press('/'); st=await E(S); await E('__QA.step(.5)'); st2=await E(S); await page.mouse.up(); await page.keyboard.press('Escape')
        ok('7 modal while holding the tonearm leaves it safely raised, playback paused',st['modal']=='finder' and not st['cursorHidden'] and st2['vinyl']['arm']['state']=='raised' and st2['vinyl']['gesture'] is None and not st2['playback']['playing'],(st['modal'],st2['vinyl']['arm']['state']))
        if st['modal'] is None:
            await E("__QA.app.vinyl.cancelGesture('t')")
        # switch stations: vinyl playing then CD deck → only one song
        await E("(async()=>{const a=__QA.app,V=a.vinyl;V.cueTo(60);await __QA.step(3);})()"); pv=await E(S)
        await E('''(async()=>{const a=__QA.app;a.exitFocus();await __QA.step(1);const s=a.stock.primary['alb_ae7c1b7ba264'];__QA.teleport(s.pos.x+1,s.pos.z,0,0);a.stock.extract(s,{autoOpen:true});await __QA.step(2.6);a.inspector.takeDisc();a.inspector.close();await __QA.step(3);a.deck.focus();await __QA.step(1);a.deck.eject();await __QA.step(.8);a.deck.trayClick();await __QA.step(.7);a.deck.eject();await __QA.step(.8);a.deck.button('play');await __QA.step(1);})()''')
        st=await E(S)
        ok('18 switching source stops the previous one (vinyl stylus cued up, CD plays) — never two songs',pv['playback']['source']=='vinyl' and pv['playback']['playing'] and st['playback']['source']=='cd-deck' and st['playback']['playing'] and st['vinyl']['arm']['state']=='raised' and st['vinyl']['onPlatter'],(st['playback']['source'],st['vinyl']['arm']['state']))
        # back to vinyl via its cue lever → CD pauses; mini "Return to playing station"
        await E("(async()=>{const a=__QA.app;a.exitFocus();await __QA.step(1);a.vinyl.cueLever();await __QA.step(1.5);})()"); st=await E(S)
        ok('18 lowering the stylus again takes over from the CD',st['playback']['source']=='vinyl' and st['playback']['playing'] and st['deck']['disc']=='alb_ae7c1b7ba264')
        await page.click('#mini button[data-p="station"]'); await E('__QA.step(8)'); st=await E(S)
        ok('18 "Return to playing station" travels to the turntable',st['mode']=='vinyl' and st['zone']=='Vinyl Listening Bench')
        # full tidy-up via UI and final consistency
        await page.keyboard.press('r'); await E('__QA.step(10)'); await page.keyboard.press('Escape'); await E('__QA.step(1)')
        await E("(async()=>{const a=__QA.app;a.deck.focus();await __QA.step(1);a.deck.eject();await __QA.step(.8);a.deck.returnDisc();a.deck.eject();await __QA.step(.8);a.exitFocus();await __QA.step(1);})()"); st=await E(S)
        fin=await E("({out:__QA.app.stock.slots.filter(x=>x.out).length,vout:__QA.app.vinyl.items.filter(x=>x.out).length,fg:__QA.app.fgScene.children.filter(c=>c.isGroup).length})")
        ok('14 everything returned: no media out, no duplicates, idle state',st['carry'] is None and st['cd']['state']=='none' and st['vinyl']['phase']=='empty' and st['playback']['rel'] is None and fin=={'out':0,'vout':0,'fg':0} and st['mode']=='room',(st['cd'],fin))
        # keys in odd modes + end-cap extraction
        cap=await E('''(async()=>{const a=__QA.app,E=a.stock.endcaps[0],s=E.slots[0];__QA.teleport(-1.9,-3.3,Math.PI,-.25);await __QA.step(.6);const ang0=E.group.rotation.y;const ok=a.stock.extract(s);await __QA.step(1.6);const rel=a.inspector.item&&a.inspector.item.rel.id,paused=E.paused,a1=E.group.rotation.y;await __QA.step(.5);const still=E.group.rotation.y===a1;a.inspector.close();await __QA.step(2.5);await __QA.step(.3);return {ok,rel:rel===s.rel.id,paused,still,vis:s.mesh.visible,resumed:E.group.rotation.y!==a1,mode:a.state.mode}})()''')
        ok('5 rotating end-cap display case extracts and returns (rotation pauses while out)',cap['ok'] and cap['rel'] and cap['paused'] and cap['still'] and cap['vis'] and cap['resumed'] and cap['mode']=='room',cap)
        await E("__QA.teleport(.05,4.22,0,0)"); await E('__QA.step(.3)'); st=await E(S); await page.screenshot(path='test/shot_final_entrance.png')
        print('   render info at entrance:',st['render'])
        ok('no console errors',len(errs)==0,errs[:5])
        await b.close()
        print(json.dumps({'passed':sum(R.values()),'total':len(R),'failed':[k for k,v in R.items() if not v]}))
asyncio.run(main())
