import asyncio,json,sys,math,base64
sys.path.insert(0,'test')
from common import *
R={}
def ok(name,cond,info=''):
    R[name]=bool(cond); print(('PASS ' if cond else 'FAIL ')+name,info if (info!='' and (not cond or len(str(info))<160)) else '')
PNG='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGP8z8Dwn4GBgYmBgYGBAQAOCgEDf2n3OAAAAABJRU5ErkJggg=='
async def main():
    async with async_playwright() as p:
        b,page,errs,reqs=await launch(p)
        E=page.evaluate
        await page.mouse.move(640,400); await enter(page); await E('__QA.step(.2)')
        # ---------- 15 finder ----------
        p0=(await E(S))['player']
        await page.keyboard.press('/'); st=await E(S)
        await page.keyboard.type('#3089'); n=await page.locator('#fres .res').count(); txt=await page.inner_text('#fres')
        ok('15 "/" opens Finder; #3089 exact → A Tribute To BIG✭BUCK$✭BAND',st['modal']=='finder' and n==1 and 'A Tribute To BIG' in txt and '#3089 Its Not Enough' in txt,txt[:80])
        await page.fill('#fq','MATRIMONIAL'); n=await page.locator('#fres .res').count(); txt=await page.inner_text('#fres')
        ok('15 "Matrimonial" (any case) finds the same release via track title',n==1 and 'A Tribute To BIG' in txt and '#3091' in txt)
        await page.fill('#fq','wasd wasd'); await page.keyboard.type('wwwaaa'); await E('__QA.step(.5)'); p1=(await E(S))['player']
        ok('15/19 typing in the search box does not walk the camera',p0['x']==p1['x'] and p0['z']==p1['z'])
        res=await E('''(()=>{const S=__QA.app.shop;return {all:S.search('').length,cic:S.search('cicada').map(r=>r.rel.title),id:S.search('alb_ae7c1b7ba264').length,origin:S.search('deep dive demo').map(r=>r.rel.title),fmt7:S.search('7-inch').length,single:S.search('single').length,dupA:S.search('#689').length,dupB:S.search('#1050')[0].tracks[0].id,v12:S.search('',"v12").length,v7:S.search('',"v7").length,hash:S.search('#30').length,trackid:S.search('2830')[0].rel.title}})()''')
        ok('15 search covers title/artist/format/id/origin/track ids; #digits exact; all releases discoverable',res['all']==21 and len(res['cic'])==2 and res['id']==1 and res['origin']==['First Light'] and res['fmt7']==12 and res['single']==12 and res['dupA']==1 and res['dupB']==1050 and res['v12']==9 and res['v7']==12 and res['hash']==0 and res['trackid']=='First Light',res)
        hud_inert=await E("document.getElementById('hud').inert"); await page.keyboard.press('Escape'); st=await E(S)
        ok('19 modal makes HUD inert; Escape closes it',hud_inert and st['modal'] is None and not await E("document.getElementById('hud').inert"))
        # route every release to exact physical CD and vinyl
        rt=await E('''(async()=>{const a=__QA.app,bad=[];for(const r of a.catalog.releases){a.shop.routeCD(r);for(let i=0;i<60;i++){await __QA.step(.25);if(!a.player.travel&&i>1)break;}await __QA.step(.3);const t=__QA.pick(),s=a.stock.primary[r.id],bc=a.shop.beacon;
            if(!t||t.id!=='cd:'+s.id||!bc||bc.pos.distanceTo(s.pos)>.05||__QA.blocked(a.player.x,a.player.z,.28))bad.push(['cd',r.title,t&&t.id]);
            a.shop.routeVinyl(r);for(let i=0;i<60;i++){await __QA.step(.25);if(!a.player.travel&&i>1)break;}await __QA.step(.8);const t2=__QA.pick(),it=a.vinyl.primary[r.id],L=it.lane;
            const flipped=L.items.filter(x=>x.idx<it.idx).every(x=>x.ang>.8);if(!t2||t2.id!=='vin:'+it.id||!flipped||L.page!==it.pg||!a.shop.beacon)bad.push(['vinyl',r.title,t2&&t2.id,flipped]);}return bad})()''')
        ok('15 all 21 releases route to and highlight the exact CD slot and vinyl sleeve (beacon, intervening sleeves flipped)',len(rt)==0,rt[:3])
        await page.screenshot(path='test/shot_beacon.png')
        # finder button + Inspect opens matching release
        await page.keyboard.press('/'); await page.keyboard.type('long table'); await page.click('#fres button[data-m^="inspect:"]'); await E('__QA.step(9)'); st=await E(S)
        ok('15 Inspect opens the matching release in hand',st['mode']=='inspect' and st['inspect']['rel']=='alb_929c07085e29' and st['inspect']['open']>.9,st['inspect'])
        # ---------- 17 crate ----------
        await page.keyboard.press('c'); await E('__QA.step(.1)'); await page.keyboard.press('Escape'); await E('__QA.step(.8)'); await page.keyboard.press('Escape'); await E('__QA.step(2.5)')
        await E('''(async()=>{const a=__QA.app,it=a.vinyl.primary['alb_929c07085e29'];const L=it.lane;__QA.teleport(L.x,L.zFront+.8,0,0);__QA.lookAt(L.x,.7+L.j.s,it.piv.position.z-.05);await __QA.step(.6);})()''')
        await page.mouse.move(640,400); await E("(()=>{const it=__QA.app.vinyl.primary['alb_929c07085e29'],L=it.lane;__QA.lookAt(L.x,.7+L.j.s,it.piv.position.z-.05)})()"); await page.mouse.down(); await page.mouse.up(); await E('__QA.step(1)'); st=await E(S)
        ok('9 click inspects that vinyl sleeve in 3D',st['mode']=='inspect' and st['inspect']['kind']=='vinyl' and st['inspect']['rel']=='alb_929c07085e29',st['inspect'])
        await page.screenshot(path='test/shot_jacket.png')
        await page.click('#insp button[data-a="crate"]'); await page.click('#insp button[data-a="peek"]'); await E('__QA.step(.6)'); await page.click('#insp button[data-a="flip"]'); await E('__QA.step(.6)'); await page.click('#insp button[data-a="ret"]'); await E('__QA.step(1.2)'); st=await E(S)
        hudc=await page.inner_text('#bCrate')
        ok('17 same release as separate CD + Vinyl entries; HUD count',st['crate']==[{'id':'alb_929c07085e29','format':'cd'},{'id':'alb_929c07085e29','format':'vinyl'}] and '2' in hudc and st['mode']=='room' and await E("__QA.app.vinyl.items.filter(i=>i.out).length")==0,st['crate'])
        ls=await E("localStorage.getItem('xtrata-music/crate-v1')")
        ok('17 crate persisted to localStorage',ls and json.loads(ls)==st['crate'],ls)
        # POS terminal by centre click
        await E("__QA.teleport(-4.9,2.72,Math.PI,-.33)"); await E('__QA.step(.3)'); hv=(await E(S))['hover']; await page.mouse.move(640,400); await E("__QA.teleport(-4.9,2.72,Math.PI,-.33)"); await page.mouse.down(); await page.mouse.up(); st=await E(S)
        ok('17 physical checkout terminal opens the Crate List',hv and hv['id']=='pos' and st['modal']=='crate' and await page.locator('#cbody .res').count()==2,hv)
        await page.screenshot(path='test/shot_crate.png')
        await E("window.__prints=[];window.print=()=>{window.__prints.push(1)};0")
        await page.click('#modalBox button[data-m="receipt"]'); st=await E(S); rtxt=await page.inner_text('#receipt')
        async with page.expect_download() as dl:
            await page.click('#modalBox button[data-m="json"]')
        d=await dl.value; pth=await d.path(); J=json.load(open(pth))
        await page.click('#modalBox button[data-m="copy"]'); await page.click('#modalBox button[data-m="print"]'); await page.wait_for_timeout(100)
        cp=await E('__QA.app.ui.lastCopy'); pr=len(await E('window.__prints'))
        good=(J['schema']=='xtrata-music/crate-receipt-v1' and J['status']=='catalogue-reference-only' and J['payment'] is None and J['transaction_id'] is None and J['network']=='Stacks' and J['platform']=='Xtrata' and J['totals']=={'items':2,'tracks':2}
              and [i['format'] for i in J['items']]==['CD','7-inch vinyl'] and J['items'][0]['tracks']==[{'n':1,'id':2985,'seconds':225.3,'img':'2245dc7a85','title':'The Long Table'}] and J['receipt_id'].startswith('XM-') and 'T' in J['created_at'])
        ok('17 receipt JSON export exact (schema, null payment/tx, exact track metadata)',good,J['totals'])
        ok('17 printable receipt, Copy and Print work; explicit no-purchase wording',st['modal']=='receipt' and 'REFERENCE RECEIPT' in rtxt and '#2985' in rtxt and 'No payment was taken' in rtxt and cp and '#2985' in cp and 'payment: none' in cp and pr==1,(pr,))
        await page.screenshot(path='test/shot_receipt.png')
        await page.keyboard.press('Escape')
        # ---------- 16 shuffle / posters / weather ----------
        before=await E("({seed:__QA.app.shop.seed,p:__QA.app.room.posters.map(p=>p.content.type==='release'?p.content.rel.id+p.content.tag:(p.content.t?p.content.t.id:p.content.slogan?p.content.slogan[0]:'print')),prim:Object.values(__QA.app.stock.primary).map(s=>s.rel.id+s.id).join(),tex:__QA.app.art.cover(__QA.app.catalog.releases[0]).tex.uuid,ptex:__QA.app.room.posters[0].tex.uuid})")
        await E("__QA.app.vinyl.pickUp(__QA.app.vinyl.primary['alb_44b88712cd32'])")
        await page.click('button[data-act="shuffle"]'); await E('__QA.step(.3)')
        after=await E("({seed:__QA.app.shop.seed,p:__QA.app.room.posters.map(p=>p.content.type==='release'?p.content.rel.id+p.content.tag:(p.content.t?p.content.t.id:p.content.slogan?p.content.slogan[0]:'print')),prim:Object.values(__QA.app.stock.primary).map(s=>s.rel.id+s.id).join(),tex:__QA.app.art.cover(__QA.app.catalog.releases[0]).tex.uuid,ptex:__QA.app.room.posters[0].tex.uuid,carry:__QA.app.carry&&__QA.app.carry.rel.id,tags:__QA.app.room.posters.filter(p=>p.content.type==='release').map(p=>p.content.tag).sort()})")
        det=await E("(()=>{const S=__QA.app.shop;S.shuffle(1234,true);const a=__QA.app.room.posters.map(p=>p.content.type==='release'?p.content.rel.id:(p.content.t?p.content.t.id:p.content.slogan?p.content.slogan[0]:'print')).join();S.shuffle(99,true);S.shuffle(1234,true);return a===__QA.app.room.posters.map(p=>p.content.type==='release'?p.content.rel.id:(p.content.t?p.content.t.id:p.content.slogan?p.content.slogan[0]:'print')).join()})()")
        ok('16 Shuffle Displays reseeds posters/tags; primary stock, held media and textures preserved; seeded = deterministic',before['seed']!=after['seed'] and before['p']!=after['p'] and before['prim']==after['prim'] and before['tex']==after['tex'] and before['ptex']==after['ptex'] and after['carry']=='alb_44b88712cd32' and det and after['tags']==sorted(['Staff Picks','Fresh On-Chain Press','Listening Station Feature','Audionauts Spotlight','Limited Edition Single','Now Spinning']),after['tags'])
        await E("__QA.app.vinyl.returnCarried()")
        # poster click by centre ray, then open release + play selected track
        pinfo=await E('''(()=>{const a=__QA.app,p=a.room.posters.find(p=>p.content.type==='release'&&p.content.rel.tracks.length>1&&p.mesh.position.z<-5);window.PP=p;const m=p.mesh.position;__QA.teleport(m.x,-2.6,0,0);__QA.lookAt(m.x,m.y,m.z);return {rel:p.content.rel.id,tid:p.content.rel.tracks[1].id,ar:p.canvas.width/p.canvas.height,war:p.w/p.h}})()''')
        await E('__QA.step(.3)'); hv=(await E(S))['hover']; await page.mouse.move(640,400); await E("__QA.lookAt(PP.mesh.position.x,PP.mesh.position.y,PP.mesh.position.z)"); await page.mouse.down(); await page.mouse.up(); st=await E(S)
        nob=await E("__QA.app.room.posters.every(p=>['release','track','print','promo'].includes(p.content.type))&&__QA.app.room.posters.filter(p=>p.content.type==='release').length===6&&__QA.app.room.posters.filter(p=>p.content.type==='promo').length===1&&!!__QA.app.shop.logo")
        ok('posters: six album covers, one Xtrata-logo poster, the rest track artwork (chain finds join when online)',nob)
        ok('16 posters are clickable and enlarge with matching metadata; aspect preserved',hv and hv['id'].startswith('poster') and st['modal']=='poster' and abs(pinfo['ar']-pinfo['war'])<.01 and await page.locator('#modalBox .trk li').count()>=2,hv)
        await page.click('#modalBox .trk li:nth-child(2) button'); await E('__QA.step(12)'); st=await E(S)
        ok('16 release poster opens that actual release and plays the selected track',st['mode']=='inspect' and st['inspect']['rel']==pinfo['rel'] and st['playback']['trackId']==pinfo['tid'] and st['playback']['playing'],(st['inspect'],st['playback']['trackId']))
        await page.keyboard.press('Escape'); await E('__QA.step(.8)'); await page.keyboard.press('Escape'); await E('__QA.step(2.5)')
        # weather
        WQ="(()=>{const R=__QA.app.room;return {m:__QA.app.state.weather,e:{...R.env},rain:R.rain.visible,snow:R.snow.visible,bg:__QA.app.scene.background.getHex(),sun:R.sun.intensity,patch:R.patches[0].opacity,n:__QA.app.stock.slots.length,g:__QA.app.renderer.info.memory.geometries}})()"
        w0=await E(WQ)
        await page.click('#bWeather'); await E('__QA.step(1.6)'); lab=await page.inner_text('#bWeather'); w1=await E(WQ)
        await E("__QA.teleport(2,1.5,Math.PI,.05)"); await E('__QA.step(.2)'); await page.screenshot(path='test/shot_golden.png')
        await page.click('#bWeather'); await E('__QA.step(1.6)'); lab2=await page.inner_text('#bWeather'); wl=await E(WQ)
        await page.click('#bWeather'); await E('__QA.step(1.6)'); w2=await E(WQ)
        ok('16 outside cycles Late-Night Rain > Golden Hour > Live > back, live and reversible without rebuilding stock',w0['m']=='rain' and w0['e']['day']==0 and w0['rain'] and w1['m']=='golden' and not w1['rain'] and w1['bg']!=w0['bg'] and w1['sun']>1 and w1['patch']>.2 and 'Golden' in lab and wl['m']=='live' and 'Live' in lab2 and 'local time' in lab2 and w1['n']==w0['n'] and w2['g']==w0['g'] and w2['m']=='rain' and w2['rain'] and w2['bg']==w0['bg'] and w2['patch']==0 and w2['e']==w0['e'],(w0,w1,wl,w2,lab2))
        async def live(h,code,cloud=None):
            wx='null' if code is None else '{code:%d,cloud:%s,temp:7}'%(code,'null' if cloud is None else cloud)
            await E("(()=>{const R=__QA.app.room;R.clock=()=>new Date(2026,5,21,%d,%d,0).getTime();R.live.wx=%s;R.live.place='Testville';R.setWeather('live',true)})()"%(int(h),int((h%1)*60),wx)); await E('__QA.step(.1)'); return await E(WQ)
        noon=await live(13,0); night=await live(1,0); dusk=await live(20.2,1); rain=await live(13,65); snw=await live(13,75); fog=await live(13,45); oc=await live(13,3,100); storm=await live(23,95)
        lab3=await page.inner_text('#bWeather'); await live(13,73); await E("__QA.teleport(2,1.5,Math.PI,.12)"); await E('__QA.step(.3)'); await page.screenshot(path='test/shot_snow.png'); await live(13,2,40); await E('__QA.step(.3)'); await page.screenshot(path='test/shot_day.png')
        dz=await E("(()=>{const d=__QA.app.room.decal,T=__QA.THREE,a=d.localToWorld(new T.Vector3(-1,0,0)),b=d.localToWorld(new T.Vector3(1,0,0)),n=new T.Vector3(0,0,1).transformDirection(d.matrixWorld);return {z:d.position.z,nz:n.z,ax:a.x,bx:b.x}})()")
        ok('16 live sky follows the clock: bright clear noon, dark night with lamps, golden dusk',noon['e']['day']==1 and noon['e']['gold']<.2 and noon['sun']>.5 and night['e']['day']==0 and night['sun']==0 and dusk['e']['gold']>.6 and len({noon['bg'],night['bg'],dusk['bg']})==3,(noon['e'],night['e'],dusk['e']))
        ok('16 live weather: rain, snow, fog, overcast and thunderstorm each change the street',rain['rain'] and not rain['snow'] and rain['e']['rain']==1 and snw['snow'] and not snw['rain'] and snw['e']['snow']==1 and fog['e']['fog']>.8 and oc['e']['cloud']==1 and oc['sun']<.05<noon['sun'] and storm['e']['rain']==1 and 'Thunderstorm' in lab3 and 'Testville' in lab3 and '7°' in lab3 and len({noon['bg'],rain['bg'],oc['bg']})==3,(rain['e'],snw['e'],fog['e'],lab3))
        ok('window lettering is on the outer face of the glass, facing the street (mirrored from inside)',dz['z']>5.6 and dz['nz']>.99 and dz['ax']<dz['bx'],dz)
        await E("(()=>{const R=__QA.app.room;R.clock=null;R.live.wx=null;R.setWeather('rain',true)})()"); await E('__QA.step(.2)')
        par=await E('''(()=>{const f=(x)=>{__QA.teleport(x,2.5,Math.PI,0);return [__QA.project(5.7,2,8.1).x,__QA.project(3.3,2,15.5).x,__QA.project(3,6,17.9).x,__QA.project(3,12,27).x]};const a=f(1),b=f(3);return a.map((v,i)=>b[i]-v)})()''')
        ok('16 exterior shows real perspective parallax (near lamp > far lamp > façade > skyline)',abs(par[0])>abs(par[1])>abs(par[2])>abs(par[3])>0,[round(x) for x in par])
        # ---------- stress: modal during gesture; resize; mouse look toggle ----------
        await E("__QA.teleport(.05,4.2,0,0)"); await page.keyboard.press('m'); s1=await E(S); await page.keyboard.press('m'); s2=await E(S)
        ok('3 Mouse Look toggle',s1['look']=='off' and s2['look']=='free')
        # 2D canvas loss recovery
        rec=await E('''(()=>{const a=__QA.app;const sum=c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let s=0;for(let i=0;i<d.length;i+=40)s+=d[i];return s};const cs=[...a.art.entries.values()].map(e=>e.canvas).concat(a.room.posters.map(p=>p.canvas),[a.deck.vfdTex.image,a.room.posTex.image,a.art.spine(a.catalog.releases[0]).image,a.art.groove().image]);
          for(const c of cs){c.getContext('2d').clearRect(0,0,c.width,c.height);}const z0=cs.filter(c=>sum(c)===0).length;for(const c of cs)c.dispatchEvent(new Event('contextrestored'));return {n:cs.length,z0,z1:cs.filter(c=>sum(c)===0).length}})()''')
        ok('2 artwork/texture canvases redraw themselves after a 2D context loss',rec['z0']==rec['n'] and rec['z1']==0,rec)
        ok('no console errors',len(errs)==0,errs[:5])
        await b.close()

        # ---------- 1/2 override, corrupt art, persistence, corrupt storage ----------
        b,page,errs,reqs=await launch(p); E=page.evaluate
        cat=await E("JSON.stringify({albums:__QA.app.catalog.albums,singles:__QA.app.catalog.singles,feed_songs:123})"); await b.close()
        C=json.loads(cat); k_ok=C['albums'][0]['cover']; k_bad=C['albums'][1]['cover']
        C['images']={k_ok:{'t':PNG,'c':'data:image/png;base64,AAAA'},k_bad:{'t':'data:image/png;base64,ZZZZ','c':'not-a-url://x'}}
        sub={'albums':C['albums'][:2],'singles':C['singles'][:3],'feed_songs':5,'images':C['images']}
        b,page,errs,reqs=await launch(p,init='window.XTRATA_SHOP_DATA='+json.dumps(sub)+";try{localStorage.setItem('xtrata-music/crate-v1','{broken json')}catch(e){}"); E=page.evaluate
        await enter(page); await E('__QA.step(.3)'); st=await E(S)
        info=await E(f"({{okFb:__QA.app.art.cover(__QA.app.relById['{C['albums'][0]['id']}']).fallback,badFb:__QA.app.art.cover(__QA.app.relById['{C['albums'][1]['id']}']).fallback,note:__QA.app.shop.storageNote,spines:__QA.app.stock.count.spines}})")
        ok('1 valid supplied data override accepted (2+3 releases)',st['catalog']['source']=='window.XTRATA_SHOP_DATA' and st['catalog']['releases']==5 and st['catalog']['albums']==2,st['catalog'])
        ok('2 real image used via thumbnail when cover bytes are corrupt; fully corrupt art falls back; shop still starts',info['okFb']==False and info['badFb']==True and st['art']['real']>=1 and st['art']['failed']>=1 and info['spines']>700,(info,st['art']))
        ok('17 corrupt saved crate falls back safely',st['crate']==[] and info['note'] and all('ERR_UNKNOWN_URL_SCHEME' in e or 'ERR_INVALID_URL' in e for e in errs),(info['note'],errs[:2]))
        await page.screenshot(path='test/shot_override.png'); await b.close()
        b,page,errs,reqs=await launch(p,init='window.XTRATA_SHOP_DATA={albums:[["x","ep","A","T","named",1,"k",[],null,[[1,5,-3,"k","bad"]]]],singles:[]}'); E=page.evaluate
        st=await E(S); toast=await page.inner_text('#toasts')
        ok('1 invalid override rejected → embedded 21/49 fallback, reported',st['catalog']['source']=='embedded snapshot' and st['catalog']['releases']==21 and st['catalog']['tracks']==49 and 'rejected' in toast,toast[:90])
        await b.close()

        # ---------- 18 adapter ----------
        AD='''window.__AD=[];window.XTRATA_AUDIO_ADAPTER={async play(p){__AD.push(['play',p.release.id,p.track.id,p.source,p.offset,p.rate,p.playing,Object.keys(p).sort().join()]);if(window.__FAIL)throw new Error('no licence')},async pause(p){__AD.push(['pause',p.track.id,p.source,p.playing])},async seek(p){__AD.push(['seek',p.track.id,p.offset])},async setRate(p){__AD.push(['setRate',p.track.id,p.rate])},levels(){return [.5,.25]}}'''
        b,page,errs,reqs=await launch(p,init=AD); E=page.evaluate
        await enter(page); await E('__QA.step(.2)')
        await E('''(async()=>{const a=__QA.app,s=a.stock.primary['alb_146ecd98f790'];__QA.teleport(s.pos.x+1,s.pos.z,0,0);a.stock.extract(s,{playIdx:1});await __QA.step(3);a.playback.seek(30);a.playback.pause();})()''')
        ad=await E('__AD'); mini=await page.inner_text('#mini')
        ok('18 adapter payload: release/track/source/offset/rate/playing, exact inscription ID',ad[0][:7]==['play','alb_146ecd98f790',3091,'cd case',0,1,True] and ad[0][7]=='offset,playing,rate,release,source,track' and ad[1]==['seek',3091,30] and ad[2]==['pause',3091,'cd case',False] and 'adapter connected' in mini,ad[:3])
        # vinyl through adapter: rate = 1+pitch
        await E('''(async()=>{const a=__QA.app,V=a.vinyl;a.inspector.close();await __QA.step(3);V.pickUp(V.primary['alb_146ecd98f790']);V.focus();await __QA.step(1);V.placeSleeve();await __QA.step(1.5);V.extract();await __QA.step(1.2);V.placeOnSpindle();await __QA.step(1.6);window.__AD.length=0;V.setPitch(.05);V.cueTo(100);await __QA.step(3);V.setPitch(-.03);await __QA.step(.2);})()''')
        ad=await E('__AD'); lv=await E('__QA.app.playback.levels()')
        ok('18 vinyl adapter: source vinyl, rate=1+pitch, setRate on pitch change, live levels',ad[0][0]=='play' and ad[0][3]=='vinyl' and abs(ad[0][5]-1.05)<1e-9 and ad[0][2]==3089 and abs(ad[0][4]-100)<1.5 and ad[-1][0]=='setRate' and abs(ad[-1][2]-.97)<1e-9 and lv==[.5,.25],ad)
        await E("window.__FAIL=1;void __QA.app.vinyl.transport('track',1)"); await E('__QA.step(3)'); await page.wait_for_timeout(50); st=await E(S); toast=await page.inner_text('#toasts')
        ok('18 adapter failure handled gracefully (toast + demo timer continues)',st['playback']['trackId']==3091 and 'adapter reported an error' in toast and 'demo timer' in st['playback']['status'],st['playback']['status'])
        ok('adapter run: no console errors',len(errs)==0,errs[:3]); await b.close()

        # ---------- 19 portrait + touch ----------
        b,page,errs,reqs=await launch(p,w=430,h=880,query='?qa=1',touch=True); E=page.evaluate
        await page.tap('#enterBtn'); await E('__QA.setAuto(false)'); await E('__QA.step(.2)')
        cdp=await page.context.new_cdp_session(page)
        async def swipe(x0,y0,x1,y1):
            await cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x0,'y':y0}]})
            for i in range(1,6): await cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x0+(x1-x0)*i/5,'y':y0+(y1-y0)*i/5}]})
            await cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
        y0=(await E(S))['player']['yaw']; await swipe(300,400,150,400); y1=(await E(S))['player']['yaw']
        pad=await E("getComputedStyle(document.getElementById('pad')).display")
        p0=(await E(S))['player']; bb=await page.locator('#pad button[data-k="w"]').bounding_box()
        await cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':bb['x']+20,'y':bb['y']+20}]}); await E('__QA.step(1)'); await cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]}); p1=(await E(S))['player']
        ok('19 touch: swipe looks, movement pad walks',abs(y1-y0)>.3 and pad=='grid' and p1['z']<p0['z']-1.5,(y1-y0,pad,p1['z']-p0['z']))
        await E('''(()=>{const s=__QA.app.stock.primary['alb_2366ae7e8449'];window.SL=s;__QA.teleport(s.pos.x+1.1,s.pos.z,0,0);__QA.lookAt(s.pos.x,s.pos.y,s.pos.z)})()'''); await E('__QA.step(.2)')
        await page.touchscreen.tap(215,420); await E('__QA.step(2)'); st=await E(S)
        ok('19 centre tap pulls the aimed case',st['mode']=='inspect' and st['inspect']['rel']=='alb_2366ae7e8449',st['mode'])
        xy=await E("__QA.fgProject(__QA.app.inspector.item.model.cover,new __QA.THREE.Vector3(0,0,0))"); await page.touchscreen.tap(xy['x'],xy['y']); await E('__QA.step(1.2)')
        geo=await E('''(()=>{const I=__QA.app.inspector,m=I.item.model,t=m.tiles[0];const a=__QA.fgProject(m.book,new __QA.THREE.Vector3((t.au0-.5)*m.W*.97,0,0)),b=__QA.fgProject(m.book,new __QA.THREE.Vector3((t.au1-.5)*m.W*.97,0,0));const r=document.getElementById('insp').getBoundingClientRect();
           const d=__QA.fgProject(m.disc,new __QA.THREE.Vector3(.0816,0,0)),l=__QA.fgProject(m.book,new __QA.THREE.Vector3(-m.W*.48,0,0));return {tile:Math.abs(b.x-a.x),panelTop:r.top,left:Math.min(l.x,d.x),right:Math.max(l.x,d.x),cy:a.y,open:m.open}})()''')
        t3=await E("(()=>{const m=__QA.app.inspector.item.model,t=m.tiles[3];return __QA.fgProject(m.book,new __QA.THREE.Vector3(((t.au0+t.au1)/2-.5)*m.W*.97,(((t.av0+t.av1)/2)-.5)*m.H*.97,0))})()")
        await page.touchscreen.tap(t3['x'],t3['y']); await E('__QA.step(.2)'); st=await E(S)
        ok('7/19 portrait: opened booklet + disc fit above the panel, tiles tappable',geo['open']>.9 and geo['left']>=-2 and geo['right']<=432 and geo['cy']<geo['panelTop'] and geo['tile']>55 and st['playback']['trackId']==2189,geo)
        await page.screenshot(path='test/shot_portrait.png')
        await E("__QA.app.inspector.close()"); await E('__QA.step(3)')
        await E("__QA.app.vinyl.pickUp(__QA.app.vinyl.primary['alb_2366ae7e8449']);__QA.app.vinyl.focus()"); await E('__QA.step(1.2)')
        vis=await E("(()=>{const V=__QA.app.vinyl;return ['pad','rest','spindle'].map(n=>V.project(n))})()")
        pr=await E("document.getElementById('station').getBoundingClientRect().top")
        ok('19 portrait bench view shows pad, rest and platter together above the help panel',all(0<v['x']<430 and 40<v['y']<pr for v in vis),(vis,pr))
        xy=vis[0]; await page.touchscreen.tap(xy['x'],xy['y']); await E('__QA.step(1.5)'); q=(await E(S))['vinyl']
        ok('19 touch tap on the physical pad places the sleeve',q['phase']=='sleeved')
        await page.screenshot(path='test/shot_portrait_bench.png')
        ok('portrait run: no console errors',len(errs)==0,errs[:3]); await b.close()

        # ---------- 3 real pointer lock attempt (no nolock flag) ----------
        b,page,errs,reqs=await launch(p,query='?qa=1'); E=page.evaluate
        await page.click('#enterBtn'); await page.wait_for_timeout(600); st=await E(S)
        y0=st['player']['yaw']; await page.mouse.move(640,400); await page.mouse.move(700,400,steps=3); await page.wait_for_timeout(200); st2=await E(S)
        print('   pointer lock in this headless browser:',st['look'],'→ after move yaw Δ',round(st2['player']['yaw']-y0,3),'look',st2['look'])
        ok('3 mouse look works with native lock or documented fallback state',st['look'] in('locked','released','free'))
        if st2['look']=='released':
            await page.mouse.click(640,400); await page.wait_for_timeout(300); await page.mouse.click(640,400); await page.wait_for_timeout(300); await page.mouse.click(640,400); await page.wait_for_timeout(300); st3=await E(S)
            await page.mouse.move(760,400,steps=3); await page.wait_for_timeout(200); st4=await E(S)
            print('   after clicks:',st3['look'],'yaw Δ',round(st4['player']['yaw']-st3['player']['yaw'],3))
            ok('3 denied lock falls back to unbuttoned mouse-movement look',st3['look'] in('locked','free') and abs(st4['player']['yaw']-st3['player']['yaw'])>.05)
        await b.close()
        print(json.dumps({'passed':sum(R.values()),'total':len(R),'failed':[k for k,v in R.items() if not v]}))
asyncio.run(main())
