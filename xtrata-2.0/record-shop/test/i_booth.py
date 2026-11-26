import asyncio,json,sys
sys.path.insert(0,'test')
from common import *
R={}
def ok(name,cond,info=''):
    R[name]=bool(cond); print(('PASS ' if cond else 'FAIL ')+name,info if (info!='' and (not cond or len(str(info))<200)) else '')
async def main():
    async with async_playwright() as p:
        b,page,errs,reqs=await launch(p); E=page.evaluate
        await enter(page); await page.mouse.move(640,400)
        bq=lambda: E("__QA.state().booth")
        # layout: booth recessed behind the wall line; back-wall posters clear of the opening
        lay=await E("""(()=>{const a=__QA.app,x=-.6,w=2.74,ox0=x-w/2,ox1=x+w/2,fz=-5.5;
          const recessed=a.booth.root.position.z+1.83/2<=fz+.001,front=!__QA.blocked(x,fz+.5,.3),into=__QA.blocked(x,fz-.3,.3);
          const ps=a.room.posters.map(p=>({x:p.mesh.position.x,z:p.mesh.position.z,w:p.w}));const back=ps.filter(p=>p.z<-5.3);
          const clash=back.filter(p=>p.x+p.w/2>ox0-.08&&p.x-p.w/2<ox1+.08).length;return {recessed,front,into,n:ps.length,back:back.length,clash}})()""")
        ok('booth is set into the back wall: its front is flush with the wall and you stand in the room in front of it',lay['recessed'] and lay['front'] and lay['into'],lay)
        ok('all 11 posters still hang; the four on the back wall sit either side of the opening',lay['n']==11 and lay['back']==4 and lay['clash']==0,lay)
        # free interaction: stand in the open front strip and aim with the centre dot; the view never locks
        FX,FZ=-.6,-5.0
        async def aim(what,a=0,b=0,x=FX,z=FZ):
            await page.mouse.move(640,400)  # back over the canvas (a panel click leaves the pointer on the panel) before setting the view
            await E("(()=>{const w=__QA.app.booth.world('%s',%s,%s);__QA.teleport(%s,%s);__QA.lookAt(w.x,w.y,w.z)})()"%(what,a,b,x,z)); await E('__QA.step(.1)'); return (await E(S))['hover']
        async def click(): await page.mouse.down(); await page.mouse.up(); await E('__QA.step(.1)')
        hv=await aim('btn','"play"'); st=await E(S)
        ok('standing at the booth: still in normal walking mode, panel shown, Play button tip',st['mode']=='room' and st['booth']['near'] and await page.locator('#station [data-booth]').count()==1 and await page.locator('#station .bc').count()==64 and hv and hv['title']=='Play / Stop',(st['mode'],hv))
        await page.screenshot(path='test/shot_booth_console.png')
        await click(); await page.wait_for_timeout(900); await E('__QA.step(.05)'); q=await bq()
        ok('clicking the 3D Play button starts the sequencer through the shared audio context',q['playing'] and q['audio'] and q['step']>=0,q)
        s1=q['step']; await page.wait_for_timeout(500); await E('__QA.step(.05)'); s2=(await bq())['step']
        ok('playhead advances in time with the audio clock',s2!=s1,(s1,s2))
        ok('shop radio is silenced while the booth plays nearby',await E("__QA.app.radio.muted()"))
        g0=(await bq())['grid'][3]; hv=await aim('cell',3,1); hvc=(await bq())['hover']
        await click(); g1=(await bq())['grid'][3]; hv2=(await E(S))['hover']
        ok('aiming at a screen step shows its tip and outlines it; clicking toggles exactly that step',hv and hv['title']=='SYNTH · step 2' and hvc==[3,1] and g1[1]!=g0[1] and g1[:1]+g1[2:]==g0[:1]+g0[2:] and hv2['sub']!=hv['sub'],(hv,hvc,g0,g1))
        hv=await aim('label',1); await click(); q=await bq()
        ok('clicking a track label on the screen mutes that part',hv and 'PERC' in hv['title'] and q['muted']==[False,True,False,False],(hv,q['muted']))
        await page.click('#station [data-s="mute:1"]'); await page.click('#station [data-s="cell:0:1"]'); q=await bq(); c=await page.locator('#station [data-s="cell:3:1"]').get_attribute('class')
        ok('panel grid edits the same pattern and mirrors the screen',q['grid'][0][1]=='1' and q['muted'][1] is False and (('on' in c)==(g1[1]=='1')),(q['grid'][0],c))
        # cards on the left wing, from the front strip
        hv=await aim('card',2,0,-1.15,-5.0); await page.screenshot(path='test/shot_booth_cards.png'); await click(); await E('__QA.step(.6)'); q=await bq()
        ok('aiming at a Paper Play card and clicking loads its pattern and tempo',hv and 'COSMIC ARPS' in hv['title'] and q['card']==2 and q['bpm']==120 and q['grid'][3]=='1011011010110101',(hv,q['card']))
        hv=await aim('stem',2,0,-.05,-5.0); await page.screenshot(path='test/shot_booth_stems.png'); await click(); q=await bq()
        ok('aiming at a stem on the right wall and clicking mutes it',hv and 'BASS' in hv['title'] and q['muted']==[False,False,True,False],(hv,q['muted']))
        hv=await aim('btn','"tempo"'); await click(); q=await bq()
        ok('3D Tempo button cycles the tempo',q['bpm']==128,q['bpm'])
        await E("__QA.teleport(-.6,-5.0,0,-.9)"); await E('__QA.step(.1)');
        # walking is never blocked by the booth: walk back out with S
        z0=(await E(S))['player']['z']; await page.keyboard.down('s'); await E('__QA.step(.6)'); await page.keyboard.up('s'); z1=(await E(S))['player']['z']
        ok('you can walk away from the console at any time (no step-in mode)',z1>z0+.5 and (await E(S))['mode']=='room',(z0,z1))
        hv=await aim('about'); await click(); st=await E(S); href=await page.get_attribute('#modalBox a.btnlink','href'); txt=await page.inner_text('#modalBox')
        ok('back-wall panel opens About, which explains the booth honestly and links to the full studio',st['modal']=='booth' and href=='https://xtrata.xyz/audionaut/' and 'Nothing here is saved, inscribed or paid for' in txt,href)
        await page.keyboard.press('Escape'); await E('__QA.step(.1)')
        ok('panel returns after closing the dialog',await page.locator('#station [data-booth]').count()==1 and not await page.locator('#station').is_hidden())
        far=await E("(()=>{__QA.teleport(4.3,3.5,0,0);return __QA.app.radio.muted()})()"); await E('__QA.step(.1)')
        ok('walking away hides the booth panel; the booth keeps playing and no longer holds the radio silent',far is False and await page.locator('#station').is_hidden() and (await bq())['playing'],far)
        await E("(()=>{const a=__QA.app,r=a.catalog.releases[0];a.playback.play(r,0,'cd-case',0)})()"); await E('__QA.step(.1)'); q=await bq(); rm=await E("__QA.app.radio.muted()")
        ok('playing a CD stops the booth, and the radio is muted while it plays',not q['playing'] and rm,(q['playing'],rm))
        await E("__QA.app.playback.pause()"); rm2=await E("__QA.app.radio.muted()")
        ok('radio comes back when the CD stops',rm2 is False)
        await E("__QA.setAuto(true)"); await page.click('button[data-jump="Audionaut Booth"]'); await page.wait_for_function("!__QA.state().player.travel&&__QA.state().booth.near",timeout=30000); await E("__QA.setAuto(false)"); st=await E(S)
        ok('Audionaut Booth quick-jump walks up to the console and faces it, without changing mode',st['mode']=='room' and st['hover'] and st['hover']['id'].startswith('booth:'),(st['mode'],st['hover']))
        await E("(()=>{const a=__QA.app;a.playback.play(a.catalog.releases[0],0,'cd-case',0)})()"); await page.click('#station [data-s="play"]'); pb=await E("__QA.state().playback"); q=await bq()
        ok('starting the booth pauses a playing CD',q['playing'] and not pb['playing'],(q['playing'],pb.get('playing')))
        await page.click('#station [data-s="play"]')
        rd=await E("__QA.app.radio.qa()")
        ok('radio speakers have their own characters (two plain, one tinny, one blown)',rd['characters']==['plain','blown','tinny','plain'],rd['characters'])
        await E("__QA.teleport(.05,4.22,0,0)"); await E('__QA.step(.1)'); rs=(await E(S))['render']
        print('render from the entrance',rs)
        ok('no page errors',len(errs)==0,errs[:3])
        await b.close()
    print(json.dumps({'passed':sum(R.values()),'total':len(R),'failed':[k for k,v in R.items() if not v]}))
asyncio.run(main())
