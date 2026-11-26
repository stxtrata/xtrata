import asyncio,json,sys
sys.path.insert(0,'test')
from common import *
R={}
def ok(name,cond,info=''):
    R[name]=bool(cond); print(('PASS ' if cond else 'FAIL ')+name,info if (info!='' and (not cond or len(str(info))<220)) else '')
async def main():
    async with async_playwright() as p:
        b,page,errs,reqs=await launch(p); E=page.evaluate
        await enter(page); await page.mouse.move(640,400)
        bq=lambda: E("__QA.app.booth.qa()")
        # layout: booth recessed behind the wall line; back-wall posters clear of the opening
        lay=await E("""(()=>{const a=__QA.app,x=-.6,w=2.74,ox0=x-w/2,ox1=x+w/2,fz=-5.5;
          const recessed=a.booth.root.position.z+1.83/2<=fz+.001,front=!__QA.blocked(x,fz+.5,.3),into=__QA.blocked(x,fz-.3,.3);
          const ps=a.room.posters.map(p=>({x:p.mesh.position.x,z:p.mesh.position.z,w:p.w}));const back=ps.filter(p=>p.z<-5.3);
          const clash=back.filter(p=>p.x+p.w/2>ox0-.08&&p.x-p.w/2<ox1+.08).length;return {recessed,front,into,n:ps.length,back:back.length,clash}})()""")
        ok('booth is set into the back wall and you stand in the room in front of it',lay['recessed'] and lay['front'] and lay['into'],lay)
        ok('all 11 posters still hang, none over the opening',lay['n']==11 and lay['back']==4 and lay['clash']==0,lay)
        FX,FZ=-.6,-5.0
        async def aim(what,a='0',bb='0',x=FX,z=FZ):
            await page.mouse.move(640,400)
            await E("(()=>{const w=__QA.app.booth.world('%s',%s,%s);__QA.teleport(%s,%s);__QA.lookAt(w.x,w.y,w.z)})()"%(what,a,bb,x,z)); await E('__QA.step(.1)'); return (await E(S))['hover']
        async def click(): await page.mouse.down(); await page.mouse.up(); await E('__QA.step(.15)')
        q0=await bq()
        ok('starts on Night Bus v4 with demo forks already in the trees',q0['cur']=='nightbus:v4' and q0['versions']>24 and q0['yours']==0,q0)
        # aiming at hits tells who made them
        hv=await aim('cell','0','0'); 
        ok('aiming at a kick: Amber (demo maker), Night Bus v1, inherited',hv and 'Amber (demo maker)' in hv['sub'] and 'Night Bus v1' in hv['sub'] and 'inherited' in hv['sub'],hv)
        hv=await aim('cell','3','2')
        ok('aiming at a bass note: Bex, v2',hv and 'Bex' in hv['sub'] and 'v2' in hv['sub'],hv)
        st=await E(S)
        ok('free interaction: still walking mode, panel shown with a 6×16 grid',st['mode']=='room' and await page.locator('#station [data-booth]').count()==1 and await page.locator('#station .bc').count()==96,st['mode'])
        # ONE press of the big FORK button
        hv=await aim('btn','"fork"'); await click(); await page.wait_for_timeout(700); await E('__QA.step(.05)'); q=await bq()
        ok('one press of FORK: a new version made by you, parent v4, playing',hv and hv['title']=='FORK' and q['mine'] and q['parent']=='nightbus:v4' and q['label']=='Your fork 1' and q['playing'] and q['audio'],q)
        ok('fork note says what happened, and a layer actually changed',q['last']>=2 and 'forked' in q['note'] and 'changed' in q['note'],q['note'])
        ok('every version in the studio is still unique',q['unique'])
        await E("__QA.teleport(-.6,-5.0,0,0);__QA.lookAt(-.6,1.05,-6.4)"); await E('__QA.step(.1)'); await page.screenshot(path='test/shot_booth_console.png')
        # changed steps stand out (console + panel)
        ch=await page.locator('#station .bc.ch').count()
        ok('changed steps are highlighted in the panel grid',ch>=2,ch)
        # find a changed (new) cell and check its credit
        newcell=await E("""(()=>{const S=__QA.app.booth.studio,v=S.get(S.cur);for(const k of [...v.last.on,...v.last.chg]){const [r,s]=k.split(':').map(Number);return [r,s];}return null})()""")
        if newcell:
            hv=await aim('cell',str(newcell[0]),str(newcell[1]))
            ok('aiming at a changed hit: credited to You, Your fork 1, new',hv and 'You' in hv['sub'] and 'Your fork 1' in hv['sub'] and 'new in this version' in hv['sub'],hv)
        # hear parent without stopping
        hv=await aim('btn','"ab"'); await click(); q=await bq()
        ok('HEAR PARENT switches to v4 while still playing',q['ab'] and q['hearing']=='nightbus:v4' and q['playing'],q)
        s1=q['step']; await page.wait_for_timeout(400); await E('__QA.step(.05)'); q2=await bq()
        ok('music keeps going while switching',q2['playing'] and q2['step']!=s1,(s1,q2['step']))
        await click(); q=await bq()
        ok('press again: back to your fork, still playing',not q['ab'] and q['hearing']==q['cur'] and q['playing'])
        # choose a layer on the wall, then vary it
        hv=await aim('layer','"bass"',x=0.0,z=-5.0); await click(); q=await bq()
        ok('layer block on the right wall chooses the bass',q['layer']=='bass',(hv,q['layer']))
        before=await E("__QA.app.booth.studio.get(__QA.app.booth.studio.cur).cells[3].join()")
        hv=await aim('btn','"vary"'); await click(); q=await bq(); after=await E("__QA.app.booth.studio.get(__QA.app.booth.studio.cur).cells[3].join()")
        ok('VARY on your own fork changes the chosen layer in place',q['label']=='Your fork 1' and before!=after and 'bass' in q['note'].lower(),q['note'])
        inkey=await E("__QA.app.booth.studio.get(__QA.app.booth.studio.cur).cells.slice(3).every(r=>r.every(v=>v==null||Number.isInteger(v)))")
        ok('all notes are scale degrees of the song key',inkey)
        # borrow keys from another song (choose keys with the panel chip, borrow via the 3D button)
        await page.click('#station [data-s="layer:keys"]'); hv=await aim('btn','"borrow"'); await click(); q=await bq()
        info=await E("""(()=>{const S=__QA.app.booth.studio,v=S.get(S.cur);const s=v.cells[4].findIndex(x=>x!=null);return {s,info:S.cellInfo(v.id,4,s),borrows:v.borrows}})()""")
        ok('BORROW brings keys from another song, still credited to its maker, marked borrowed',q['label']=='Your fork 1' and info['borrows'] and info['borrows'][0]['layer']=='keys' and info['info']['how']=='borrowed' and info['info']['song']!='Night Bus',info)
        ok('borrow note mentions key, tempo and credit',('A minor' in q['note']) and ('124 BPM' in q['note']) and ('credited' in q['note']),q['note'])
        hv=await aim('cell','4',str(info['s']))
        ok('aiming at a borrowed chord names its maker and song',hv and info['info']['song'] in hv['sub'] and 'borrowed' in hv['sub'],hv)
        # hand edit on own fork: credited to you
        hv=await aim('cell','0','7'); await click(); c=await E("(()=>{const S=__QA.app.booth.studio;return S.cellInfo(S.cur,0,7)})()")
        ok('punching a step on the console credits it to your fork',c['on'] and c['how']=='new' and c['version']=='Your fork 1',c)
        # tree on the wall: nodes clickable to hear
        await E("__QA.teleport(-.6,-4.6,0,0);__QA.lookAt(-.6,1.66,-7.2)"); await E('__QA.step(.2)'); await page.screenshot(path='test/shot_booth_wall.png')
        hv=await aim('node','"nightbus:v2"',x=-.6,z=-4.8)
        await click(); q=await bq()
        ok('clicking v2 in the family tree plays it',hv and 'v2' in hv['title'] and q['cur']=='nightbus:v2' and q['playing'],(hv,q['cur']))
        # fork of a fork, deep ancestry and credits
        await E("__QA.app.booth.select(__QA.app.booth.studio.families[0].id+':f2')"); await E('__QA.step(.1)')
        for i in range(3):
            await page.click('#station [data-s="fork"]'); await E('__QA.step(.1)')
        q=await bq(); anc=await E("__QA.app.booth.studio.credits(__QA.app.booth.studio.cur)")
        ok('fork of a fork of a fork: ancestry runs all the way back to v1',q['label']=='Your fork 4' and anc['ancestry'][-1]=='v1' and 'Your fork 1' in anc['ancestry'],anc['ancestry'])
        ok('credits shares add up to 100%; the borrow made in Your fork 1 is still listed',sum(m['pct'] for m in anc['makers'])==100 and sum(x['pct'] for x in anc['songs'])==100 and any(x['layer']=='keys' and x['into']=='Your fork 1' for x in anc['borrows']),(anc['makers'],anc['borrows']))
        await page.click('#station [data-s="read"]'); st=await E(S); txt=await page.inner_text('#modalBox')
        ok('Tree & credits dialog shows ancestry, makers, songs and the tree',st['modal']=='boothcredits' and 'Ancestry' in txt and 'Who made' in txt and 'Your fork 4' in txt and 'not money' in txt)
        await page.screenshot(path='test/shot_booth_credits.png'); await page.keyboard.press('Escape'); await E('__QA.step(.1)')
        # song cards on the left wall
        hv=await aim('song','"dustytape"',x=-1.15,z=-5.0); await click(); q=await bq()
        ok('song card on the left wall loads that song',hv and 'Dusty Tape' in hv['title'] and q['fam']=='dustytape' and q['cur']=='dustytape:v4',(hv,q['cur']))
        # about copy: no claims of inscription or payment
        await page.click('#station [data-s="about"]'); txt=await page.inner_text('#modalBox'); href=await page.get_attribute('#modalBox a.btnlink','href')
        ok('How it works explains fork / vary / borrow and says nothing is inscribed or paid',all(w in txt for w in ['Fork','Vary','Borrow','credit','nothing here is saved, inscribed or paid for']) and href=='https://xtrata.xyz/audionaut/')
        await page.keyboard.press('Escape'); await E('__QA.step(.1)')
        # reset
        hv=await aim('reset',x=-1.15,z=-5.0); await click(); q=await bq()
        ok('RESET DEMO plate clears every fork for the next visitor',q['yours']==0 and q['cur']=='nightbus:v4' and q['versions']==q0['versions'],q)
        # ---- information around the booth, tied to the big screen ----
        lb=await E("[[-2.72,-4.95],[1.55,-4.95]].every(([x,z])=>__QA.blocked(x,z,.3))")
        ok('two Learn lecterns stand either side of the opening (solid)',lb)
        hv=await aim('learn','1','0',x=1.2,z=-4.1); await click(); q=await bq()
        ok('Learn lectern tile from the shop floor puts “Paid plays” on the big screen',hv and hv['title']=='Paid plays on Stacks' and q['topic']=='payments',(hv,q['topic']))
        await E("__QA.teleport(-.6,-4.6,0,0);__QA.lookAt(-.6,1.66,-7.2)"); await E('__QA.step(.2)'); await page.screenshot(path='test/shot_booth_info.png')
        hv=await aim('tab','"holder"',z=-4.6); await click(); q=await bq()
        ok('aiming at a tab on the big screen switches topic',hv and 'Who gets paid' in hv['title'] and q['topic']=='holder',(hv,q['topic']))
        hv=await aim('head','"songs"',x=-.2,z=-5.0); await click(); q=await bq()
        ok('the (i) on the SONGS sign explains Audionals on the big screen',hv and q['topic']=='audionals',(hv,q['topic']))
        hv=await aim('head','"sign"',z=-4.2); await click(); q=await bq()
        ok('the booth sign opens “The Audionaut studio” page',q['topic']=='studio',(hv,q['topic']))
        await E("__QA.teleport(-.6,-5.0,0,0)"); await E('__QA.step(.1)')
        await page.click('#station [data-s="topic:payments"]'); await page.click('#station [data-s="read"]'); txt=await page.inner_text('#modalBox'); links=await page.locator('#modalBox a.btnlink').evaluate_all("a=>a.map(x=>x.href)")
        ok('panel Learn + Read: paid plays explained with the live facts and a link to the lounge',all(w in txt for w in ['50 microSTX','no platform fee','passkey','Nothing in the booth is saved, inscribed or paid']) and 'https://xtrata.xyz/music/lounge' in links,(txt[:160],links))
        await page.click('#modalBox [data-m="t:holder"]'); await page.click('#modalBox [data-m="t:creditpay"]'); txt=await page.inner_text('#modalBox'); q=await bq()
        ok('the credits-meet-payments page is labelled an idea, not built',q['topic']=='creditpay' and 'IDEA' in txt and 'not something built' in txt)
        await page.keyboard.press('Escape'); await E('__QA.step(.1)')
        await page.click('#station [data-s="fork"]'); await E('__QA.step(.1)'); q=await bq()
        ok('forking brings the big screen back to the family tree',q['topic']=='tree' and q['mine'])
        cyc=await E("""(async()=>{const B=__QA.app.booth;__QA.teleport(4.3,3.5,0,0);B.topicAt=performance.now()-30000;await __QA.step(.1);const a=B.qa().topic,auto=B.qa().autoTopic;__QA.teleport(-.6,-5.0,0,0);await __QA.step(.1);return {a,auto,back:B.qa().topic}})()""")
        ok('nobody at the booth: the big screen walks through the topics; walking up brings the tree back',cyc['a']!='tree' and cyc['auto'] and cyc['back']=='tree',cyc)
        await page.click('#station [data-s="reset"]'); await E('__QA.step(.1)')
        # walk away: panel hides, radio interplay
        await page.click('#station [data-s="play"]'); rm=await E("__QA.app.radio.muted()")
        ok('radio is silent while the booth plays nearby',rm)
        far=await E("(()=>{__QA.teleport(4.3,3.5,0,0);return __QA.app.radio.muted()})()"); await E('__QA.step(.1)')
        ok('walking away hides the panel; the booth keeps playing and no longer holds the radio silent',far is False and await page.locator('#station').is_hidden() and (await bq())['playing'])
        await E("(()=>{const a=__QA.app,r=a.catalog.releases[0];a.playback.play(r,0,'cd-case',0)})()"); await E('__QA.step(.1)'); q=await bq()
        ok('playing a CD stops the booth',not q['playing'])
        await E("__QA.app.playback.pause()")
        await E("__QA.setAuto(true)"); await page.click('button[data-jump="Audionaut Booth"]'); await page.wait_for_function("!__QA.state().player.travel&&__QA.app.booth.qa().near",timeout=30000); await E("__QA.setAuto(false)"); st=await E(S)
        ok('Audionaut Booth quick-jump walks up to the console and faces it',st['mode']=='room' and st['hover'] and st['hover']['id'].startswith('booth:'),st['hover'])
        ok('no page errors',len(errs)==0,errs[:3])
        await b.close()
        # touch / phone: everything from the panel
        b,page,errs,reqs=await launch(p,w=412,h=860,touch=True); E=page.evaluate
        await enter(page); await E("__QA.teleport(-.6,-5.0,0,0);__QA.lookAt(-.6,1.05,-6.4)"); await E('__QA.step(.2)')
        n=await page.locator('#station [data-booth]').count(); await page.tap('#station [data-s="fork"]'); await E('__QA.step(.1)'); q=await E("__QA.app.booth.qa()")
        ok('phone: compact panel, Fork works from it',n==1 and q['mine'] and q['label']=='Your fork 1',q['label'])
        await page.select_option('#bsong','concrete'); await E('__QA.step(.1)'); q=await E("__QA.app.booth.qa()")
        ok('phone: song picker loads another song',q['fam']=='concrete',q['fam'])
        await page.tap('#station [data-s="layer:bass"]'); await page.tap('#station [data-s="borrow"]'); q=await E("__QA.app.booth.qa()")
        ok('phone: choose bass and Borrow',q['mine'] and 'bass' in q['note'].lower() and 'Borrowed' in q['note'],q['note'])
        await page.tap('#station [data-s="read"]'); st=await E(S)
        ok('phone: tree & credits dialog opens',st['modal']=='boothcredits'); await page.screenshot(path='test/shot_booth_phone.png')
        ok('phone: no page errors',len(errs)==0,errs[:3])
        await b.close()
    print(json.dumps({'passed':sum(R.values()),'total':len(R),'failed':[k for k,v in R.items() if not v]}))
asyncio.run(main())
