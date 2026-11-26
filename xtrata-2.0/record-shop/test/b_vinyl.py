import asyncio,json,sys,math
sys.path.insert(0,'test')
from common import *
R={}
def ok(name,cond,info=''):
    R[name]=bool(cond); print(('PASS ' if cond else 'FAIL ')+name,info if (info!='' and (not cond or len(str(info))<160)) else '')
HELP='''window.T={V:()=>__QA.app.vinyl,
 disc(x,z){const V=T.V(),g=V.b.g;return V.projectLocal(x-g.gx,V.math.CARRY_Y,z-g.gz)},
 arm(yaw){const V=T.V(),g=V.b.g,P=V.math.PIV,a=yaw-g.off;return V.projectLocal(P.x+.23*Math.sin(a),P.y,P.z+.23*Math.cos(a))},
 yawF(f){const V=T.V(),q=V.qa().groove;return V.math.yawForRadius(q.o-f*(q.o-q.i))},
 yawR(r){return T.V().math.yawForRadius(r)},
 async fall(){let min=9,n=0,q;for(let i=0;i<400;i++){await __QA.step(1/240,1/240);q=T.V().qa();min=Math.min(min,q.tip.y-q.surfaceY);n++;if(q.arm.state!=='falling')break;}return {min,n,q,ana:Math.hypot(q.tip.x-q.tipAnalytic.x,q.tip.y-q.tipAnalytic.y,q.tip.z-q.tipAnalytic.z)}}}'''
async def main():
    async with async_playwright() as p:
        b,page,errs,reqs=await launch(p)
        E=page.evaluate
        await page.mouse.move(640,400); await enter(page); await E(HELP); await E('__QA.step(.2)')
        Q=lambda: E('__QA.app.vinyl.qa()')
        async def run(size, relid):
            tag=f'[{size}in] '
            # ---- 9 crate cascade + exact pick ----
            r=await E(f'''(async()=>{{const a=__QA.app,V=a.vinyl,it=V.items.filter(i=>i.rel.id==='{relid}').slice(-1)[0],L=it.lane;window.IT=it;__QA.teleport(L.x,L.zFront+.8,0,0);
              const top=.7+L.j.s;__QA.lookAt(L.x,top,it.piv.position.z-.05);let ids=new Set();for(let i=0;i<70;i++){{await __QA.step(1/60);const t=__QA.pick();ids.add(t&&t.id);}}
              // now aim lower at the revealed cover: target must stay the same
              __QA.lookAt(L.x,top-.12,it.piv.position.z-.03);for(let i=0;i<30;i++){{await __QA.step(1/60);const t=__QA.pick();ids.add(t&&t.id);}}
              return {{ids:[...ids],want:'vin:'+it.id,idx:it.idx,front:L.items.filter(i=>i.idx<it.idx).map(i=>+i.ang.toFixed(2)),back:L.items.filter(i=>i.idx>=it.idx).map(i=>+i.ang.toFixed(2)),hover:a.state.modal}}}})()''')
            ok(tag+'9 aiming down the lane cascades preceding jackets, target stable',r['ids']==[r['want']] and all(a>.85 for a in r['front']) and all(a<-.1 for a in r['back']) and r['idx']>0,r)
            if size==12: await page.screenshot(path='test/shot_cascade.png')
            await page.keyboard.press('e'); await E('__QA.step(.5)'); st=await E(S)
            ok(tag+'9 E picks up that exact sleeve; crate copy hidden',st['carry'] and st['carry']['rel']==relid and await E('IT.out&&!IT.piv.visible') and await E('__QA.app.vinyl.items.filter(i=>i.out).length')==1,st['carry'])
            await page.click('button[data-jump="Turntable"]'); await E('__QA.step(7)'); st=await E(S); q=st['vinyl']
            ok(tag+'9 arrival focuses bench and waits: clickable placeholder, nothing auto-placed',st['mode']=='vinyl' and q['phase']=='ready' and q['placeholder']['visible'] and q['sleeve'] is None and st['carry'] is not None,q['phase'])
            if size==12: await page.screenshot(path='test/shot_bench_ready.png')
            xy=await E("__QA.app.vinyl.project('rest')"); await page.mouse.click(xy['x'],xy['y']); await E('__QA.step(.5)'); xy=await E("__QA.app.vinyl.project('spindle')"); await page.mouse.click(xy['x'],xy['y']); await E('__QA.step(.5)')
            q=await Q(); ok(tag+'9 clicking elsewhere does not auto-place',q['phase']=='ready' and q['sleeve'] is None)
            await page.keyboard.press('Escape'); await E('__QA.step(1)'); st=await E(S)
            ok(tag+'9 backing out retains the sleeve',st['mode']=='room' and st['carry'] and st['vinyl']['phase']=='empty',st['mode'])
            await page.click('button[data-jump="Turntable"]'); await E('__QA.step(4)')
            # ---- 10 pad click docking, sleeve click extraction ----
            xy=await E("__QA.app.vinyl.project('pad')"); pk=await E(f"__QA.app.vinyl.pickAt({xy['x']},{xy['y']})")
            await page.mouse.click(xy['x'],xy['y']); await E('__QA.step(.45)'); q1=await Q(); await E('__QA.step(1.2)'); q2=await Q(); st=await E(S)
            M=await E('({S:__QA.app.vinyl.math.SLEEVE,R:__QA.app.vinyl.math.REST,P:__QA.app.vinyl.math.SPIN,D:__QA.app.vinyl.math.DECK})')
            ok(tag+'10 real pad click docks the same sleeve along a raised path',pk['ctl']=='pad' and q1['phase']=='docking' and q1['sleeve']['y']>.12 and q2['phase']=='sleeved' and abs(q2['sleeve']['x']-M['S']['x'])<1e-6 and abs(q2['sleeve']['y']-M['S']['y'])<1e-6 and st['carry'] is None,(q1['sleeve'],q2['phase']))
            xy=await E("__QA.app.vinyl.project('sleeve')"); pk=await E(f"__QA.app.vinyl.pickAt({xy['x']},{xy['y']})"); await page.mouse.click(xy['x'],xy['y']); await E('__QA.step(.4)'); q1=await Q(); await E('__QA.step(1)'); q=await Q()
            rc=q['restClear']; half=q['sleeve']['half']
            ok(tag+'10 real sleeve click slides record onto the separate rest',pk['ctl']=='sleeve' and q1['phase']=='extracting' and q['phase']=='loose' and abs(q['rec']['x']-M['R']['x'])<1e-6 and abs(q['sleeve']['x']-M['S']['x'])<1e-6,(pk,q['phase']))
            ok(tag+'10 record at rest wholly clear of sleeve and deck (>9 cm to deck)',rc['toDeck']>0.09 and rc['toSleeve']>0.05 and (q['rec']['x']-q['rec']['r'])>(q['sleeve']['x']+half) and (q['rec']['x']+q['rec']['r'])<M['D']['x0'],rc)
            if size==12: await page.screenshot(path='test/shot_bench_loose.png')
            # ---- 11 hold disc ----
            async def grab():
                xy=await E("__QA.app.vinyl.project('disc')"); await page.mouse.move(xy['x'],xy['y']); await page.mouse.down(); return xy
            cam0=(await E(S))['cam']; q0=await Q(); xy=await grab(); st=await E(S)
            await E('__QA.step(.08)'); qa=await Q(); await E('__QA.step(.3)'); qb=await Q(); cam1=(await E(S))['cam']
            ok(tag+'11 hold on real disc hides cursor instantly',st['cursorHidden'] and st['vinyl']['gesture']=='disc' and st['canvasCursor']=='none',st['canvasCursor'])
            ok(tag+'11 lifts vertically in place first; camera frozen',qa['rec']['y']>q0['rec']['y']+.02 and abs(qa['rec']['x']-q0['rec']['x'])<.004 and abs(qa['rec']['z']-q0['rec']['z'])<.004 and abs(qb['rec']['y']-M['S']['y'])>.2 and cam0==cam1,(qa['rec'],qb['rec']['y']))
            # drag off-target and release -> returns to rest
            t=await E(f"T.disc({M['R']['x']+.12},{M['R']['z']+.1})"); await page.mouse.move(t['x'],t['y'],steps=5); await E('__QA.step(.3)'); qd=await Q()
            ok(tag+'11 record follows the mouse on the carry plane',abs(qd['rec']['x']-(M['R']['x']+.12))<.01 and abs(qd['rec']['z']-(M['R']['z']+.1))<.01 and not qd['engaged'] and qd['ring']['visible'] and not qd['ring']['green'],qd['rec'])
            await page.mouse.up(); st=await E(S); await E('__QA.step(1.5)'); q=await Q()
            ok(tag+'11 invalid drop returns gently to rest; cursor restored',(not st['cursorHidden']) and q['phase']=='loose' and abs(q['rec']['x']-M['R']['x'])<1e-6 and abs(q['rec']['y']-M['R']['y'])<1e-6 and not q['ring']['visible'],q['rec'])
            # escape cancel
            await grab(); await E('__QA.step(.4)'); t=await E(f"T.disc({M['R']['x']+.2},{M['R']['z']})"); await page.mouse.move(t['x'],t['y'],steps=3); await E('__QA.step(.2)'); await page.keyboard.press('Escape'); st=await E(S); await E('__QA.step(1.5)'); q=await Q(); await page.mouse.up()
            ok(tag+'11 Escape cancels the gesture first (stays at bench), cursor restored',st['mode']=='vinyl' and not st['cursorHidden'] and q['phase']=='loose' and abs(q['rec']['x']-M['R']['x'])<1e-6)
            # lost pointer capture
            await grab(); await E('__QA.step(.4)'); await E("(()=>{const c=__QA.app.canvas;for(const id of [1,2,3])try{c.releasePointerCapture(id)}catch(e){}})()"); await E('__QA.step(.1)'); st=await E(S)
            if st['cursorHidden']: await E("__QA.app.canvas.dispatchEvent(new Event('lostpointercapture'))"); st=await E(S)
            await E('__QA.step(1.5)'); q=await Q(); await page.mouse.up()
            ok(tag+'19 lost pointer capture: safe return, cursor restored',not st['cursorHidden'] and q['phase']=='loose' and q['gesture'] is None)
            # window blur
            await grab(); await E('__QA.step(.4)'); await E("window.dispatchEvent(new Event('blur'))"); st=await E(S); await E('__QA.step(1.5)'); q=await Q(); await page.mouse.up()
            ok(tag+'19 window blur: safe return, cursor restored',not st['cursorHidden'] and q['phase']=='loose')
            # valid drop with magnetic alignment, released over HUD (window-level release)
            await grab(); await E('__QA.step(.4)')
            t=await E(f"T.disc({M['P']['x']-.19},{M['P']['z']+.02})"); await page.mouse.move(t['x'],t['y'],steps=6); await E('__QA.step(.3)'); qn=await Q()
            t=await E(f"T.disc({M['P']['x']-.1},{M['P']['z']+.03})"); await page.mouse.move(t['x'],t['y'],steps=4); await E('__QA.step(.4)'); qe=await Q()
            dist=math.hypot(qe['rec']['x']-M['P']['x'],qe['rec']['z']-M['P']['z'])
            ok(tag+'11 ring amber outside, green + magnetic pull inside engage radius',(not qn['engaged']) and (not qn['ring']['green']) and qe['engaged'] and qe['ring']['green'] and dist<.03,(dist,))
            await page.mouse.up(); st=await E(S); await E('__QA.step(.25)'); qm=await Q(); await E('__QA.step(2)'); q=await Q()
            ok(tag+'11 valid drop: aligns, lowers onto spindle, parented to platter',(not st['cursorHidden']) and qm['phase']=='placing' and q['phase']=='parked' and q['onPlatter'] and abs(q['rec']['x']-M['P']['x'])<1e-5 and abs(q['rec']['z']-M['P']['z'])<1e-5 and abs(q['rec']['y']-M['P']['y'])<1e-5,q['rec'])
            if size==12: await page.screenshot(path='test/shot_deck_parked.png')
            # ---- 12 motor / pitch / controls ----
            rpm=45 if size==7 else 100/3
            pk={n:(await E(f"(()=>{{const p=__QA.app.vinyl.project('{n}');return __QA.app.vinyl.pickAt(p.x,p.y)}})()")) for n in ['start','b33','b45','power','pitch','cue','headshell']}
            ok(tag+'12 visible controls hit their own targets (no hitbox conflict)',[pk[n]['ctl'] for n in ['start','b33','b45','power','pitch','cue','headshell']]==['start','33','45','power','pitch','cue','arm'] and pk['pitch']['tier']==1 and pk['headshell']['tier']==1,{k:v['ctl'] for k,v in pk.items()})
            xy=await E("__QA.app.vinyl.project('start')"); await page.mouse.click(xy['x'],xy['y']); await E('__QA.step(.3)'); qa=await Q(); await E('__QA.step(2)'); q=await Q()
            want=rpm*2*math.pi/60
            ok(tag+f'12 motor accelerates smoothly to {rpm:.2f} rpm (delta-time)',q['motor']['on'] and 0<qa['motor']['speed']<want and abs(q['motor']['speed']-want)<1e-6 and q['rpm']==(45 if size==7 else 33),(qa['motor']['speed'],q['motor']['speed'],want))
            xy=await E("__QA.app.vinyl.project('pitch')"); await page.mouse.move(xy['x'],xy['y']); await page.mouse.down(); st=await E(S)
            t=await E("__QA.app.vinyl.projectLocal(.252,.08,.105+.085*1.4)"); await page.mouse.move(t['x'],t['y'],steps=4); await page.mouse.up(); await E('__QA.step(1)'); q=await Q()
            ok(tag+'12 pitch slider drags to +8% (bounded) and changes platter speed',st['vinyl']['gesture']=='pitch' and abs(q['pitch']-.08)<1e-9 and abs(q['motor']['speed']-want*1.08)<1e-6,(q['pitch'],q['motor']['speed']))
            await E('__QA.app.vinyl.setPitch(0)'); await E('__QA.step(.5)')
            # ---- 13 tonearm ----
            cam0=(await E(S))['cam']
            xy=await E("__QA.app.vinyl.project('headshell')"); await page.mouse.move(xy['x'],xy['y']); await page.mouse.down(); st=await E(S)
            ok(tag+'13 hold on real headshell (next to pitch slider) grabs the arm, hides cursor',st['vinyl']['gesture']=='arm' and st['vinyl']['arm']['state']=='held' and st['cursorHidden'],st['vinyl']['gesture'])
            rel=await E(f"(()=>{{const r=__QA.app.relById['{relid}'];return {{total:r.seconds,tr:r.tracks.map(t=>[t.id,t.seconds])}}}})()")
            def expect(f):
                side=f*rel['total']; acc=0
                for i,(tid,sec) in enumerate(rel['tr']):
                    if side<acc+sec or i==len(rel['tr'])-1: return tid,side-acc
                    acc+=sec
            allok=True; info=[]
            for name,f in [('START',.06),('MIDDLE',.5),('END',.93)]:
                y=await E(f'T.yawF({f})'); t=await E(f'T.arm({y})'); await page.mouse.move(t['x'],t['y'],steps=5); await E('__QA.step(.25)'); qh=await Q(); cam1=(await E(S))['cam']; tagtxt=await page.inner_text('#cuetag')
                await page.mouse.up(); st=await E(S); fr=await E('T.fall()'); q=fr['q']; pb=(await E(S))['playback']
                G=q['groove']; f_act=(G['o']-q['tipRadius'])/(G['o']-G['i']); tid,off=expect(f_act)
                good=(qh['arm']['phi']>.07 and qh['cue']['legal'] and qh['cue']['zone']==name and name in tagtxt and cam0==cam1 and not st['cursorHidden'] and st['vinyl']['arm']['state']=='falling'
                      and fr['n']>12 and fr['min']>-1e-7 and abs(q['tip']['y']-q['surfaceY'])<1e-6 and fr['ana']<1e-6 and q['arm']['state']=='down' and abs(f_act-f)<.02
                      and pb['source']=='vinyl' and pb['playing'] and pb['trackId']==tid and abs(pb['elapsed']-off)<.6 and pb['lastFoley']=='needle')
                allok=allok and good; info.append((name,round(f_act,3),pb['trackId'],tid,round(pb['elapsed'],1),round(off,1),fr['n'],fr['min']))
                if size==12 and name=='MIDDLE': await page.screenshot(path='test/shot_playing.png')
                # re-grab while playing
                xy=await E("__QA.app.vinyl.project('headshell')"); await page.mouse.move(xy['x'],xy['y']); e0=(await E(S))['playback']['elapsed']; await page.mouse.down(); pb2=(await E(S))['playback']
                allok=allok and (not pb2['playing']) and abs(pb2['elapsed']-e0)<1e-9 and (await E(S))['vinyl']['arm']['state']=='held'
            ok(tag+'13 swing to start/middle/end: damped gravity contact, no penetration, exact song+offset; grab mid-play pauses with offset kept',allok,info)
            # drop on centre label -> parks
            y=await E(f"T.yawR(__QA.app.vinyl.qa().groove.i-.012)"); t=await E(f'T.arm({y})'); await page.mouse.move(t['x'],t['y'],steps=4); await E('__QA.step(.2)'); qh=await Q(); await page.mouse.up(); await E('__QA.step(.05)'); q1=await Q(); await E('__QA.step(2)'); q=await Q(); pb=(await E(S))['playback']
            ok(tag+'13 release over centre label is rejected and parks safely',(not qh['cue']['legal']) and qh['cue']['where']=='centre label' and q1['arm']['state']=='parking' and q['arm']['state']=='rest' and abs(q['arm']['yaw'])<1e-6 and not pb['playing'],(qh['cue']['where'],q['arm']))
            # outer edge -> parks ; Escape while holding over groove -> stays raised
            xy=await E("__QA.app.vinyl.project('headshell')"); await page.mouse.move(xy['x'],xy['y']); await page.mouse.down()
            y=await E(f"T.yawR(__QA.app.vinyl.qa().groove.o+.004)"); t=await E(f'T.arm({y})'); await page.mouse.move(t['x'],t['y'],steps=4); await E('__QA.step(.2)'); qh=await Q(); await page.mouse.up(); await E('__QA.step(2)'); q=await Q()
            ok(tag+'13 outer edge rejected as non-playing',qh['cue']['where']=='outer edge' and q['arm']['state']=='rest')
            xy=await E("__QA.app.vinyl.project('headshell')"); await page.mouse.move(xy['x'],xy['y']); await page.mouse.down()
            y=await E('T.yawF(.3)'); t=await E(f'T.arm({y})'); await page.mouse.move(t['x'],t['y'],steps=4); await E('__QA.step(.2)'); await page.keyboard.press('Escape'); st=await E(S); await E('__QA.step(.5)'); q=await Q(); await page.mouse.up()
            ok(tag+'13 Escape while holding arm: left safely raised, cursor restored',st['mode']=='vinyl' and not st['cursorHidden'] and q['arm']['state']=='raised' and q['arm']['phi']>.07)
            # cue lever lowers under gravity; motor stop pauses; restart resumes
            xy=await E("__QA.app.vinyl.project('cue')"); await page.mouse.click(xy['x'],xy['y']); fr=await E('T.fall()'); pb=(await E(S))['playback']
            await E('__QA.step(3)'); pb1=(await E(S))['playback']; y1=(await Q())['arm']['yaw']
            xy=await E("__QA.app.vinyl.project('start')"); await page.mouse.click(xy['x'],xy['y']); pbs=(await E(S))['playback']; await E('__QA.step(2)'); pb2=(await E(S))['playback']; await E('__QA.step(1)'); pb3=(await E(S))['playback']
            await page.mouse.click(xy['x'],xy['y']); await E('__QA.step(2)'); pb4=(await E(S))['playback']
            ok(tag+'13 cue lever drop plays; arm tracks inward; motor stop pauses, restart resumes',fr['q']['arm']['state']=='down' and pb['playing'] and pb1['elapsed']>pb['elapsed']+2.9 and y1<fr['q']['arm']['yaw'] and (not pbs['playing']) and abs(pb3['elapsed']-pb2['elapsed'])<1e-6 and pb4['playing'] and pb4['elapsed']>pb3['elapsed']+1,(pb['elapsed'],pb1['elapsed'],pb2['elapsed'],pb4['elapsed']))
            # mini-player seek / next drive the real arm
            q0=await Q()
            if len(rel['tr'])>1:
                await page.click('#mini button[data-p="next"]'); await E('__QA.step(.3)'); qc=await Q(); await E('__QA.step(2.5)'); q=await Q(); pb=(await E(S))['playback']
                ok(tag+'18 mini-player Next physically re-cues the arm to the next song',qc['arm']['state'] in('cueing','falling') and q['arm']['state']=='down' and pb['playing'] and pb['trackId']==rel['tr'][pb['idx']][0] and pb['idx']>=1 and pb['elapsed']<3 and q['arm']['yaw']<q0['arm']['yaw'],(pb['idx'],pb['elapsed']))
            await E("(()=>{const s=document.getElementById('mSeek');s.value=Math.min(+s.max-1,10);s.dispatchEvent(new Event('change',{bubbles:true}))})()"); await E('__QA.step(3)'); pb=(await E(S))['playback']; q=await Q()
            lab=await E("__QA.app.vinyl.b.labelIdx"); mini=await page.inner_text('#mini')
            ok(tag+'18 seek slider positions the arm; label, mini-player, state agree',q['arm']['state']=='down' and 9<pb['elapsed']<14 and lab==pb['idx'] and ('VINYL' in mini) and (('45 RPM' in mini) if size==7 else ('33' in mini)),(pb['elapsed'],lab))
            # pitch affects vinyl rate
            await E('__QA.app.vinyl.setPitch(.08)'); await E('__QA.step(1)'); e0=(await E(S))['playback']; await E('__QA.step(5)'); e1=(await E(S))['playback']
            ok(tag+'12 pitch +8% plays 1.08x (rate in shared state)',abs((e1['elapsed']-e0['elapsed'])-5*1.08)<.02 and abs(e1['rate']-1.08)<1e-6,(e1['elapsed']-e0['elapsed'],e1['rate']))
            await E('__QA.app.vinyl.setPitch(0)')
            # end of side lifts safely
            await E(f"void __QA.app.vinyl.cueTo({rel['total']}-1.5)"); await E('__QA.step(1.5)'); await E('__QA.step(4)'); q=await Q(); pb=(await E(S))['playback']
            ok(tag+'13 end of side: arm lifts and parks, motor stops',q['arm']['state']=='rest' and not q['motor']['on'] and not pb['playing'],q['arm'])
            # ---- 14 leave / revisit / return ----
            await page.keyboard.press('Escape'); await E('__QA.step(1)'); s1=await E(S)
            await page.click('button[data-jump="Vinyl Crates"]'); await E('__QA.step(5)')
            g=await E('''(()=>{const a=__QA.app,it=a.vinyl.items.find(i=>!i.out&&i.rel!==IT.rel);const r=a.vinyl.pickUp(it);return [r,!!a.carry,it.out]})()''')
            await page.click('button[data-jump="Turntable"]'); await E('__QA.step(7)'); s2=await E(S)
            ok(tag+'14 leave and revisit keeps the loaded deck; second record refused',s1['mode']=='room' and s2['mode']=='vinyl' and s2['vinyl']['phase']=='parked' and s2['vinyl']['onPlatter'] and g==[False,False,False],g)
            await page.keyboard.press('r'); await E('__QA.step(.4)'); qm=await Q(); await E('__QA.step(9)'); st=await E(S); q=st['vinyl']
            cnt=await E("(()=>{let n=0;__QA.app.vinyl.root.traverse(o=>{if(o.geometry&&o.geometry.type==='CylinderGeometry'&&Math.abs(o.geometry.parameters.radiusTop-.172)<1e-6)n++});return n})()")
            ok(tag+'14 return: lifted clear, resleeved, exact crate slot restored, no duplicate media',q['phase']=='empty' and q['rec'] is None and q['sleeve'] is None and st['carry'] is None and cnt==0 and await E('!IT.out&&IT.piv.visible') and await E('__QA.app.vinyl.items.filter(i=>i.out).length')==0 and st['playback']['rel'] is None,(q['phase'],cnt))
            await page.keyboard.press('Escape'); await E('__QA.step(1)')
        await run(12,'alb_04596c4461b5')
        await run(7,'alb_4c6883677c73')
        ok('no console errors',len(errs)==0,errs[:5])
        await b.close()
        print(json.dumps({'passed':sum(R.values()),'total':len(R),'failed':[k for k,v in R.items() if not v]}))
asyncio.run(main())
