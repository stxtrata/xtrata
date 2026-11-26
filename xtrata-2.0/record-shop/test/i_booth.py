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
        # layout: collision footprint, posters moved off the covered back wall onto the booth's side walls
        lay=await E("""(()=>{const a=__QA.app,{x,z,w,d}={x:-.6,z:-4.535,w:2.74,d:1.83};const inside=[[x,z],[x-1,z+.5],[x+1,z-.5]].every(([px,pz])=>__QA.blocked(px,pz,.3));
          const front=!__QA.blocked(x,z+d/2+.6,.3);const ps=a.room.posters.map(p=>({x:p.mesh.position.x,z:p.mesh.position.z}));
          const covered=ps.filter(p=>p.z<-5.3&&p.x>x-w/2-.05&&p.x<x+w/2+.05).length,onSides=ps.filter(p=>Math.abs(p.z-z)<.01&&Math.abs(Math.abs(p.x-x)-w/2)<.06).length;return {inside,front,covered,onSides}})()""")
        ok('booth footprint blocks walking; the front is reachable',lay['inside'] and lay['front'],lay)
        ok('no poster hidden behind the booth; two posters hang on its outer side walls',lay['covered']==0 and lay['onSides']==2,lay)
        # pick from the shop floor with the centre dot
        await E("__QA.teleport(-.6,-2.55,0,0);__QA.lookAt(-.6,1.1,-4.5)"); await E('__QA.step(.2)'); hv=(await E(S))['hover']
        ok('centre dot on the booth shows its tip',hv and hv['id'].startswith('booth') and 'Audionaut' in hv['title'],hv)
        await page.mouse.down(); await page.mouse.up(); await E('__QA.step(1)'); st=await E(S)
        ok('clicking the booth steps up to the console (booth mode, panel shown)',st['mode']=='booth' and st['booth']['view']=='console' and st['zone']=='Audionaut Booth' and await page.locator('#station .bc').count()==64,(st['mode'],st['zone']))
        await page.screenshot(path='test/shot_booth_console.png')
        # 3D play button
        xy=await E("__QA.app.booth.project('btn','play')"); await page.mouse.move(xy['x'],xy['y']); await page.mouse.down(); await page.mouse.up()
        await page.wait_for_timeout(900); await E('__QA.step(.05)'); q=await bq()
        ok('3D PLAY/STOP button starts the sequencer through the shared audio context',q['playing'] and q['audio'] and q['step']>=0,q)
        s1=q['step']; await page.wait_for_timeout(500); await E('__QA.step(.05)'); s2=(await bq())['step']
        ok('playhead advances in time with the audio clock',s2!=s1,(s1,s2))
        rm=await E("__QA.app.radio.muted()")
        ok('shop radio is silenced while the booth plays nearby',rm)
        # click a step on the 3D screen (row 3 SYNTH, step 2)
        g0=(await bq())['grid'][3]; xy=await E("__QA.app.booth.project('cell',3,1)"); await page.mouse.move(xy['x'],xy['y']); await E('__QA.step(.05)'); hvc=(await bq())['hover']
        await page.mouse.down(); await page.mouse.up(); await E('__QA.step(.05)'); g1=(await bq())['grid'][3]
        ok('hovering a screen step outlines it; clicking toggles exactly that step',hvc==[3,1] and g1[1]!=g0[1] and g1[:1]+g1[2:]==g0[:1]+g0[2:],(hvc,g0,g1))
        # panel grid stays in sync and can edit too
        await page.click('#station [data-s="cell:0:1"]'); g2=(await bq())['grid'][0]; c=await page.locator('#station [data-s="cell:3:1"]').get_attribute('class')
        ok('panel grid edits the same pattern and mirrors the screen',g2[1]=='1' and (('on' in c)==(g1[1]=='1')),(g2,c))
        # cards view: load card 3 from the wing
        await page.click('#station [data-s="view:cards"]'); await E('__QA.step(.8)'); await page.screenshot(path='test/shot_booth_cards.png')
        xy=await E("__QA.app.booth.project('card',2)"); await page.mouse.move(xy['x'],xy['y']); await page.mouse.down(); await page.mouse.up(); await E('__QA.step(.6)'); q=await bq()
        ok('cards view: clicking a Paper Play card loads its pattern and tempo',q['view']=='cards' and q['card']==2 and q['bpm']==120 and q['grid'][3]=='1011011010110101',q)
        # stems view: mute bass from the wall
        await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await E('__QA.step(.8)'); await page.screenshot(path='test/shot_booth_stems.png')
        xy=await E("__QA.app.booth.project('stem',2)"); await page.mouse.move(xy['x'],xy['y']); await page.mouse.down(); await page.mouse.up(); await E('__QA.step(.1)'); q=await bq()
        ok('stems view (arrow keys): clicking a stem block mutes that part',q['view']=='stems' and q['muted']==[False,False,True,False],q)
        # keys: tempo, space stop/start
        await page.keyboard.press('t'); q1=await bq(); await page.keyboard.press(' '); q2=await bq(); await page.keyboard.press(' '); q3=await bq()
        ok('T changes tempo; Space stops and starts',q1['bpm']==128 and not q2['playing'] and q3['playing'],(q1['bpm'],q2['playing'],q3['playing']))
        # about dialog with the studio link
        await page.click('#station [data-s="about"]'); st=await E(S); href=await page.get_attribute('#modalBox a.btnlink','href'); txt=await page.inner_text('#modalBox')
        ok('About explains the booth honestly and links to the full studio',st['modal']=='booth' and href=='https://xtrata.xyz/audionaut/' and 'Nothing here is saved, inscribed or paid for' in txt,href)
        await page.keyboard.press('Escape')
        # Esc steps back to the shop floor; the booth keeps playing and fades with distance
        await page.keyboard.press('Escape'); await E('__QA.step(.8)'); st=await E(S)
        ok('Esc steps back to the shop floor',st['mode']=='room' and st['booth']['playing'],st['mode'])
        far=await E("(()=>{__QA.teleport(4.3,3.5,0,0);return __QA.app.radio.muted()})()")
        ok('far from the booth the radio is not held silent by it',far is False,far)
        # a CD audition stops the booth; while it plays the radio is muted
        await E("(()=>{const a=__QA.app,r=a.catalog.releases[0];a.playback.play(r,0,'cd-case',0)})()"); await E('__QA.step(.1)'); q=await bq(); rm=await E("__QA.app.radio.muted()")
        ok('playing a CD stops the booth, and the radio is muted while it plays',not q['playing'] and rm,(q['playing'],rm))
        await E("__QA.app.playback.pause()"); rm2=await E("__QA.app.radio.muted()")
        ok('radio comes back when the CD stops',rm2 is False)
        # jump button and number key 8
        await E("__QA.setAuto(true)"); await page.click('button[data-jump="Audionaut Booth"]'); await page.wait_for_function("__QA.state().mode==='booth'",timeout=30000); await E("__QA.setAuto(false)"); st=await E(S)
        ok('Audionaut Booth quick-jump walks there and focuses the console',st['mode']=='booth' and st['booth']['view']=='console')
        # starting the booth while a CD plays pauses the CD
        await E("(()=>{const a=__QA.app;a.playback.play(a.catalog.releases[0],0,'cd-case',0)})()"); await page.keyboard.press(' '); pb=await E("__QA.state().playback"); q=await bq()
        ok('starting the booth pauses a playing CD',q['playing'] and not pb['playing'],(q['playing'],pb.get('playing')))
        await page.keyboard.press(' ')
        rd=await E("__QA.app.radio.qa()")
        ok('radio speakers have their own characters (two plain, one tinny, one blown)',rd['characters']==['plain','blown','tinny','plain'],rd['characters'])
        await page.keyboard.press('Escape'); await E('__QA.step(.8)'); await E("__QA.teleport(.05,4.22,0,0)"); await E('__QA.step(.1)'); rs=(await E(S))['render']
        print('render from the entrance',rs)
        ok('no page errors',len(errs)==0,errs[:3])
        await b.close()
    print(json.dumps({'passed':sum(R.values()),'total':len(R),'failed':[k for k,v in R.items() if not v]}))
asyncio.run(main())
