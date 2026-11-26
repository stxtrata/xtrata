import asyncio,json,sys,re,os
sys.path.insert(0,'test')
from common import *
R={}
def ok(n,c,i=''):
    R[n]=bool(c); print(('PASS ' if c else 'FAIL ')+n,i if (not c or (i!='' and len(str(i))<150)) else '')
FX=os.path.join(os.path.dirname(__file__),'fixtures')
FILES={'136':('134.bin','image/jpeg'),'1107':('1107.html','text/html'),'2830':('2830.html','text/html'),'3089':('3089.html','text/html'),'317':('317.html','text/html'),'315':('315.bin','audio/webm'),'134':('134.bin','image/jpeg')}
HITS=[]
async def handler(route):
    req=route.request
    if '/index/' in req.url:
        import json as J
        toks=[{'id':134,'creator':'SPAAA1111','mime':'image/jpeg','totalSize':165034,'sealed':True},{'id':135,'creator':'SPBBB2222','mime':'text/html','totalSize':5000,'sealed':True},{'id':136,'creator':'SPCCC3333','mime':'image/jpeg','totalSize':90000,'sealed':True},{'id':137,'creator':'SPAAA1111','mime':'image/png','totalSize':900,'sealed':True}]
        HITS.append(('index',None)); return await route.fulfill(status=200,headers={'content-type':'application/json','access-control-allow-origin':'*'},body=J.dumps({'mintedCount':6268,'tokens':toks}))
    req=route.request; m=re.search(r'/i/(\d+)',req.url); i=m.group(1) if m else ''
    f,ct=FILES.get(i,FILES['2830']); data=open(os.path.join(FX,f),'rb').read(); HITS.append((i,req.headers.get('range')))
    h={'content-type':ct,'access-control-allow-origin':'*','accept-ranges':'bytes','access-control-expose-headers':'Content-Range, X-Xtrata-Runtime-Total-Size','x-xtrata-runtime-total-size':str(len(data))}
    rg=req.headers.get('range')
    if rg:
        a,b=re.match(r'bytes=(\d+)-(\d*)',rg).groups(); a=int(a); b=min(int(b) if b else len(data)-1,len(data)-1)
        h['content-range']=f'bytes {a}-{b}/{len(data)}'; await route.fulfill(status=206,headers=h,body=data[a:b+1])
    else: await route.fulfill(status=200,headers=h,body=data)
async def start(p,cfg='{}',fail=False):
    b=await p.chromium.launch(headless=True,**({'executable_path':os.environ['CHROME']} if os.environ.get('CHROME') else {'channel':'chrome'}),args=ARGS)
    ctx=await b.new_context(viewport={'width':1280,'height':800}); page=await ctx.new_page(); errs=[]
    page.on('pageerror',lambda e: errs.append(str(e)))
    await page.add_init_script('window.XTRATA_SHOP_CONFIG='+cfg)
    if fail: await page.route('https://xtrata.xyz/**',lambda r: r.abort())
    else: await page.route('https://xtrata.xyz/**',handler)
    await page.goto(URL+'?qa=1&nolock=1&stream=1&sky=rain'); await page.wait_for_function('window.__QA && !document.getElementById("intro").hidden',timeout=90000)
    await page.click('#enterBtn'); return b,page,errs
async def main():
    async with async_playwright() as p:
        b,page,errs=await start(p,'{cdPreviewSeconds:5,radioSeconds:6}'); E=page.evaluate
        await page.wait_for_function("__QA.state().chain.artDone+__QA.state().chain.artFail>=__QA.state().chain.artTotal",timeout=120000)
        st=await E(S); info=await E("(()=>{const a=__QA.app,r=a.relById['alb_e3f84cae0811'],f=a.relById['alb_b75dbf32d363'];return {rec:a.art.cover(r).fallback,emb:a.art.cover(f).fallback,trk:a.art.track(f,f.tracks[0]).fallback,sameTex:a.stock.caseMats(f)[2].map===a.art.cover(f).tex,poster:a.room.posters.length}})()")
        ok('artwork streamed from the on-chain players (embedded + recursive), into the same textures',st['chain']['artDone']==st['chain']['artTotal'] and st['art']['fallback']==0 and info=={'rec':False,'emb':False,'trk':False,'sameTex':True,'poster':11},(st['chain'],st['art'],info))
        ok('only the first part of each player is downloaded for artwork',all(r for i,r in HITS if i not in('134','315','136','index')) and len(HITS)>=st['chain']['artTotal'],[h for h in HITS if not h[1]][:4])
        await page.screenshot(path='test/shot_stream_art.png')
        # shop radio: four positional speakers, artist-by-artist mix of openings, ducks under a listening station
        await page.wait_for_function("__QA.state().radio.state==='playing'&&__QA.state().radio.time>.5&&!__QA.state().radio.paused",timeout=60000); r1=(await E(S))['radio']; hud=await page.inner_text('#brand'); btn=await page.inner_text('#bRadio')
        gains=await E("(async()=>{const a=__QA.app,ctx=a.playback.ctx(),l=ctx.listener;__QA.setAuto(true);__QA.teleport(-7,-4.6,0,0);await new Promise(r=>setTimeout(r,400));const p1=[l.positionX.value,l.positionZ.value];__QA.teleport(7,4.6,0,0);await new Promise(r=>setTimeout(r,400));return {p1,p2:[l.positionX.value,l.positionZ.value],state:ctx.state}})()")
        ok('shop radio plays through 4 positional speakers; the listener moves with you',r1['speakers']==4 and r1['on'] and r1['now'] and 'Shop radio' in hud and 'On' in btn and gains['state']=='running' and abs(gains['p1'][0]+7)<.3 and abs(gains['p2'][0]-7)<.3,(r1,gains,hud))
        await page.wait_for_function("(id)=>__QA.state().radio.now.id!==id&&!__QA.state().radio.paused",arg=r1['now']['id'],timeout=90000); r2=(await E(S))['radio']
        ok('radio moves on through the mix, artist by artist',r2['now']['id']!=r1['now']['id'] and r2['artists'][0]==r2['artists'][1],(r1['now'],r2['now'],r2['artists']))
        await page.wait_for_function("__QA.app.shop.prints.length>=3",timeout=60000); pst=await E("({types:__QA.app.room.posters.map(p=>p.content.type),print:__QA.app.shop.prints.map(p=>[p.id,p.title])})")
        ok('posters: album art, an Xtrata poster, print #1107 and random image inscriptions found via the chain index',set(pst['types'])<={'release','track','print','promo'} and pst['types'].count('print')>=2 and pst['types'].count('promo')==1 and {1107,134,136}<={q[0] for q in pst['print']} and 137 not in {q[0] for q in pst['print']} and 135 not in {q[0] for q in pst['print']},pst)
        for k,ty in enumerate(['print','promo']):
            await E("(()=>{const a=__QA.app,ps=a.room.posters.filter(p=>p.content.type==='%s'&&(p.content.type!=='print'||p.content.print.found)),p=ps[0],m=p.mesh.position,n=new __QA.THREE.Vector3(0,0,1).applyQuaternion(p.mesh.quaternion);__QA.setAuto(true);__QA.teleport(m.x+n.x*1.7,m.z+n.z*1.7,0,0);__QA.lookAt(m.x,m.y,m.z)})()"%ty); await page.wait_for_timeout(700); await page.screenshot(path='test/shot_poster_%s.png'%ty)
        await page.click('#bRadio'); await page.wait_for_timeout(900); r3=(await E(S))['radio']; await page.click('#bRadio'); await page.wait_for_function("__QA.state().radio.on&&!__QA.state().radio.paused",timeout=30000)
        ok('radio button switches it off and on',not r3['on'] and r3['paused'])
        # pick up a 2-track CD: every song's opening is cued at once, without downloading whole songs
        n0=len(HITS)
        await E("(()=>{const a=__QA.app,s=a.stock.primary['alb_146ecd98f790'];__QA.teleport(s.pos.x+1,s.pos.z,0,0);a.stock.extract(s)})()")
        await page.wait_for_function("(()=>{const q=__QA.app.chain.cueInfo(__QA.app.relById['alb_146ecd98f790']);return q&&q.ready===2})()",timeout=60000)
        hits=[h for h in HITS[n0:] if h[0] in('3091',)]+[h for h in HITS if h[0]=='3089'][-1:]; panel=await page.inner_text('#insp'); st=await E(S)
        ok('picking up a CD case cues every track from the chain (range requests only, nothing playing yet)',len(hits)>=1 and all(h[1] and h[1].startswith('bytes=0-') for h in HITS if h[0] in('3089','3091')) and st['playback']['rel'] is None and 'every track starts instantly' in panel,(hits,panel[:200]))
        import time; t0=time.time(); await E("__QA.app.inspector.toggleOpen(true)"); await page.wait_for_function("__QA.state().inspect.open>.99",timeout=30000)
        n1=len(HITS); t0=time.time(); await E("__QA.app.inspector.playTile(0)"); await page.wait_for_function("__QA.state().chain.ready&&!__QA.state().chain.paused&&__QA.state().chain.time>.3",timeout=30000); dt=time.time()-t0; st=await E(S)
        await page.wait_for_function("__QA.state().radio.duck<.2",timeout=10000); ok('radio ducks under the listening station',True)
        ok('cued track starts at once from its opening, with no further download',st['chain']['cur']==3089 and st['chain']['mode']=='cue' and st['chain']['safe']>31 and len([h for h in HITS[n1:] if h[0]=='3089'])==0 and dt<6,(dt,st['chain'],HITS[n1:]))
        await page.wait_for_function("__QA.state().playback.previewEnded===3089&&!__QA.state().playback.playing",timeout=30000); ok('preview of a cued track ends normally',True)
        await E("__QA.app.playback.seek(100);__QA.app.playback.resume()"); await page.wait_for_function("__QA.state().chain.mode==='full'&&__QA.state().chain.ready&&!__QA.state().chain.paused&&__QA.state().chain.time>100.5",timeout=60000); st=await E(S)
        ok('seeking past the cued opening fetches the whole song and carries on there',any(h==('3089',None) for h in HITS[n1:]) and st['chain']['duration']>270 and 100<st['playback']['elapsed']<106,(st['chain'],HITS[n1:]))
        await E("__QA.app.playback.stop();__QA.app.inspector.close()"); await page.wait_for_function("__QA.state().mode==='room'&&!__QA.state().extract&&!__QA.state().inspect",timeout=60000)
        # CD case audition of First Light (#2830, embedded audio)
        n0=len(HITS)
        await E("(()=>{const a=__QA.app,s=a.stock.primary['alb_b75dbf32d363'];__QA.teleport(s.pos.x+1,s.pos.z,0,0);a.stock.extract(s,{playIdx:0})})()")
        await page.wait_for_function("__QA.state().chain.ready&&!__QA.state().chain.paused&&__QA.state().chain.time>1.2",timeout=60000); st=await E(S); mini=await page.inner_text('#mini')
        ok('CD: real audio from inscription #2830 plays; clock follows the audio; honest status',st['chain']['state']=='stream' and st['chain']['cur']==2830 and st['chain']['srcKind']=='embedded' and st['chain']['src'].startswith('blob:') and abs(st["playback"]["elapsed"]-st["chain"]["time"])<.7 and 11<st['chain']['duration']<13 and 'Streaming from the on-chain player · inscription #2830' in mini and '5-second CD preview' in mini and 'PREVIEW' in mini,(st['chain'],mini[-120:]))
        ok('short song: one request, the cue is the whole song',len([h for h in HITS[n0:] if h[0]=='2830'])==1 and st['chain']['mode']=='full',HITS[n0:])
        await page.wait_for_function("()=>{window.__mx=Math.max(window.__mx||0,__QA.state().chain.time);return !__QA.state().playback.playing}",timeout=20000,polling=100); st=await E(S); toast=await page.inner_text('#toasts'); mx=await E('window.__mx')
        ok('CD preview stops the song after ~5 s of real audio and resets it',4.2<mx<6.2 and st['playback']['previewEnded']==2830 and st['playback']['elapsed']==0 and st['chain']['paused'] and st['chain']['time']<.3 and 'preview' in toast.lower(),(mx,st['playback'],st['chain']['time'],toast))
        await page.keyboard.press(' '); await page.wait_for_timeout(1500); st=await E(S)
        ok('pressing play again starts a fresh preview from the top',st['playback']['playing'] and not st['chain']['paused'] and .8<st['chain']['time']<2.6,(st['chain']['time'],))
        await page.keyboard.press(' '); await page.wait_for_timeout(300); st=await E(S); ok('pause pauses the real audio',st['chain']['paused'] and not st['playback']['playing'])
        W=lambda c,t=60000: page.wait_for_function(c,timeout=t)
        await E("__QA.app.inspector.close()"); await W("__QA.state().mode==='room'&&!__QA.state().extract&&!__QA.state().inspect")
        # CD deck preview flash
        await E("(()=>{const a=__QA.app,s=a.stock.primary['alb_b75dbf32d363'];a.stock.extract(s,{autoOpen:true})})()"); await W("__QA.state().inspect&&__QA.state().inspect.open>.99")
        await E("(()=>{const a=__QA.app;a.inspector.takeDisc();a.inspector.close()})()"); await W("__QA.state().mode==='room'&&!__QA.state().extract&&!__QA.state().inspect&&__QA.state().carry")
        await E("__QA.app.deck.focus()"); await E("__QA.app.deck.eject()"); await W("__QA.state().deck.tray==='open'"); await E("__QA.app.deck.trayClick()"); await W("__QA.state().deck.disc"); await E("__QA.app.deck.eject()"); await W("__QA.state().deck.tray==='closed'")
        await E("__QA.app.playback.previewEnded=null;__QA.app.deck.button('play')")
        await W("__QA.state().playback.previewEnded===2830&&!__QA.state().playback.playing&&__QA.app.deck.msg==='PREVIEW END'"); st=await E(S); ok('CD deck: preview ends after the limit of real audio, VFD says PREVIEW END',st['chain']['paused'] and st['playback']['elapsed']==0,st['chain'])
        await E("__QA.app.deck.eject()"); await W("__QA.state().deck.tray==='open'"); await E("(()=>{const a=__QA.app;a.deck.returnDisc();a.deck.eject();a.exitFocus()})()"); await W("__QA.state().deck.tray==='closed'&&!__QA.state().focus")
        # vinyl: recursive player (#317 -> audio #315), unlimited, pitch
        await E("(()=>{const a=__QA.app,V=a.vinyl;__QA.teleport(4.3,-3.45,0,-.35);V.pickUp(V.primary['alb_e3f84cae0811']);V.focus()})()"); await W("__QA.state().vinyl.phase==='ready'&&__QA.app.focus.t>=1")
        for c,ph in [("V.placeSleeve()","sleeved"),("V.extract()","loose"),("V.placeOnSpindle()","parked")]:
            await E("(()=>{const V=__QA.app.vinyl;"+c+"})()"); await W(f"__QA.state().vinyl.phase==='{ph}'")
        await E("(()=>{const V=__QA.app.vinyl;V.setPitch(.08);void V.cueTo(20)})()")
        await W("__QA.state().chain.cur===317&&__QA.state().chain.ready&&!__QA.state().chain.paused"); await W("__QA.state().playback.elapsed>27",90000); st=await E(S); mini=await page.inner_text('#mini')
        ok('vinyl: recursive player streams its audio inscription (#315) and keeps playing past the CD limit',st['chain']['srcKind']=='recursive #315' and 'xtrata.xyz/i/315' in st['chain']['src'] and st['playback']['playing'] and st['playback']['source']=='vinyl' and st['playback']['elapsed']>26 and 'full play on vinyl' in mini,(st['chain'],st['playback']['elapsed']))
        ok('vinyl: audio follows the stylus position and the pitch slider (1.08x)',abs(st['chain']['time']-st['playback']['elapsed'])<.8 and abs(st['chain']['rate']-1.08)<1e-6,(st['chain']['time'],st['playback']['elapsed'],st['chain']['rate']))
        xy=await E("__QA.app.vinyl.project('headshell')"); await page.mouse.move(xy['x'],xy['y']); await page.mouse.down(); await page.wait_for_timeout(250); st=await E(S); await page.keyboard.press('Escape'); await page.mouse.up()
        ok('vinyl: lifting the arm silences the real audio at once',st['chain']['paused'] and not st['playback']['playing'])
        ok('stream run: no page errors',not errs,errs[:3]); await b.close()
        # default limit + offline fallback
        b,page,errs=await start(p,'{}',fail=True); E=page.evaluate
        await E("(()=>{const a=__QA.app,s=a.stock.primary['alb_b75dbf32d363'];__QA.teleport(s.pos.x+1,s.pos.z,0,0);a.stock.extract(s,{playIdx:0})})()"); await page.wait_for_function("__QA.state().chain.state==='error'&&__QA.state().playback.elapsed>1",timeout=60000); st=await E(S); mini=await page.inner_text('#mini')
        ok('default CD preview limit is 30 s',st['playback']['previewLimit']==30)
        ok('unreachable chain: falls back to the labelled demo timer, shop keeps working, art stays fallback',st['chain']['state']=='error' and st['playback']['playing'] and st['playback']['elapsed']>1 and 'Demo timer · could not stream inscription #2830' in mini and st['art']['real']==0 and not errs,(st['chain'],mini[-110:],errs[:2]))
        await b.close()
        print(json.dumps({'passed':sum(R.values()),'total':len(R),'failed':[k for k,v in R.items() if not v]}))
asyncio.run(main())
