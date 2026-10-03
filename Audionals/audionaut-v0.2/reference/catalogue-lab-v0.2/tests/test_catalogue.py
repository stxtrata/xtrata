from pathlib import Path
import os, shutil
import importlib.util, threading, tempfile, json, io, wave, math, urllib.request, urllib.error, hashlib, base64
from playwright.sync_api import sync_playwright
OUT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('desk_server',OUT/'serve.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
results=[]
def check(name,ok,details=None):
    results.append({'test':name,'passed':bool(ok),'details':details})
    if not ok: raise AssertionError(name+': '+str(details))
def wav_fixture(seconds=2):
    import struct
    b=io.BytesIO()
    with wave.open(b,'wb') as w:
        w.setnchannels(1);w.setsampwidth(2);w.setframerate(48000)
        w.writeframes(b''.join(struct.pack('<h',int(0.5*32767*math.sin(2*math.pi*220*n/48000))) for n in range(int(48000*seconds))))
    return b.getvalue()
body=wav_fixture()
upstream_calls=[]
def fake_fetch(url):
    upstream_calls.append(url)
    if 'songs.json' in url: return b'[]','application/json'
    return body,'audio/wav'
m.fetch_upstream=fake_fetch
with tempfile.TemporaryDirectory() as tmp:
    m.CACHE=Path(tmp)/'cache'
    server=m.ThreadingHTTPServer(('127.0.0.1',0),m.Handler)
    thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
    base='http://127.0.0.1:'+str(server.server_port)
    first=json.loads((OUT/'catalogue.json').read_text())['batches'][0]['source_record_ids'][0].split('btc:ord:')[1]
    # Server paths and persistent cache, using only generated test audio.
    with urllib.request.urlopen(base+'/api/content/'+first) as r: b1=r.read();cache1=r.headers.get('X-Audionaut-Cache')
    with urllib.request.urlopen(base+'/api/content/'+first) as r: b2=r.read();cache2=r.headers.get('X-Audionaut-Cache')
    check('local_server_fetch_and_cache',b1==body and b2==body and cache1=='upstream' and cache2=='disk')
    check('no_second_upstream_fetch_for_cached_source',len(upstream_calls)==1)
    for route,want in [('/api/content/https://example.com',400),('/.audio-cache/a',403),('/api/anything',404)]:
        try: urllib.request.urlopen(base+route);status=200
        except urllib.error.HTTPError as e: status=e.code
        check('reject_'+route,status==want,{'status':status})
    req=urllib.request.Request(base+'/api/health',headers={'Host':'attacker.example'})
    try: urllib.request.urlopen(req);status=200
    except urllib.error.HTTPError as e: status=e.code
    check('host_guard',status==421)
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or shutil.which('chromium') or shutil.which('chromium-browser'),headless=True,args=['--autoplay-policy=no-user-gesture-required'])
        ctx=browser.new_context(viewport={'width':1440,'height':1000},accept_downloads=True)
        errors=[]
        def load_page(context, saved=None):
            page=context.new_page()
            page.expose_function('__digestFixture',lambda values:list(hashlib.sha256(bytes(values)).digest()))
            page.on('pageerror',lambda e: errors.append(str(e)))
            setup="""
Object.defineProperty(window,'localStorage',{value:{data:STORAGE,getItem(k){return this.data[k]??null},setItem(k,v){this.data[k]=String(v)},removeItem(k){delete this.data[k]}}});
Object.defineProperty(window,'crypto',{value:{subtle:{digest:async(algorithm,bytes)=>new Uint8Array(await window.__digestFixture(Array.from(new Uint8Array(bytes)))).buffer}}});
window.__fixtureRequests=[];
window.fetch=async function(url,options){window.__fixtureRequests.push(String(url));if(String(url).includes('/content/')){const bytes=Uint8Array.from(atob('BASE64'),c=>c.charCodeAt(0));return new Response(bytes,{status:200,headers:{'content-type':'audio/wav','content-length':bytes.length}})}if(String(url).includes('/api/health'))return new Response(JSON.stringify({service:'audionaut-catalogue-local',cached_sources:0}),{status:200});throw new Error('Test harness rejects all real external requests')};
""".replace('STORAGE',json.dumps(saved or {})).replace('BASE64',base64.b64encode(body).decode())
            html=(OUT/'Audionaut_Catalogue_Lab.html').read_text().replace('<head>','<head><script>'+setup+'</script>',1)
            page.set_content(html,wait_until='load')
            return page
        page=load_page(ctx)
        check('initial_no_javascript_errors',not errors,errors)
        check('initial_22_batch',page.locator('#queueList .item').count()==22)
        check('no_automatic_audio_download',page.evaluate('__fixtureRequests.length===0'))
        page.evaluate('localService=true')
        check('local_source_route_selection',page.evaluate('sourceFetchURL(current()).startsWith("/api/content/")'))
        page.locator('#play').click()
        page.wait_for_function('current().technical.duration_seconds_measured > 0')
        page.locator('#stop').click()
        measured=page.evaluate('({seconds:current().technical.duration_seconds_measured,frames:current().technical.decoded_frames,rate:current().technical.decoded_sample_rate,analysis:current().analysis,heard:current().review.auditioned})')
        check('real_decoder_on_generated_fixture',abs(measured['seconds']-2)<=1.1/measured['rate'] and measured['frames']==round(measured['rate']*measured['seconds']),measured)
        check('measurement_does_not_mark_listened',not measured['heard'])
        check('signal_peak_expected',abs(measured['analysis']['peak_dbfs']+6.021)<0.015)
        # Classification carries a source-note basis, not an automated listening claim.
        page.locator('#applyProposal').click()
        check('apply_note_proposal',page.evaluate("current().review.usage_type==='loop'&&current().review.sound_category==='drums'&&!current().review.auditioned"))
        # Two named regions on the same source preserve independent metadata.
        page.locator('#editTitle').fill('Fixture clip A');page.locator('#trimStart').fill('0');page.locator('#trimEnd').fill('1')
        first_clip=page.evaluate('current().active_clip_id')
        page.locator('#newClip').click();page.locator('#editTitle').fill('Fixture clip B');page.locator('#trimStart').fill('1');page.locator('#trimEnd').fill(str(measured['seconds']))
        second_clip=page.evaluate('current().active_clip_id')
        page.locator('#clipSelect').select_option(first_clip)
        check('independent_clip_regions',page.locator('#editTitle').input_value()=='Fixture clip A' and page.locator('#trimStart').input_value()=='0' and page.locator('#trimEnd').input_value()=='1')
        page.locator('#clipSelect').select_option(second_clip)
        check('second_clip_preserved',page.locator('#editTitle').input_value()=='Fixture clip B' and page.locator('#trimStart').input_value()=='1')
        # Simulate curator confirmations on fixture metadata only; never persisted into shipped seed.
        page.evaluate("""() => {const r=current();for(const c of r.clips){Object.assign(c.review,{status:'approved',auditioned:true,reviewer:'Automated test fixture only',usage_type:'loop',bpm:120,beats:2,bpm_verified:true,loop_verified:true,key:null,root_note:null});}Object.assign(r.rights,{status:'licensed',license:'TEST ONLY',evidence_url:'https://example.test/fixture'});renderDetail();}""")
        check('two_clips_pass_consistent_fixture_gate',page.evaluate('current().clips.every(c=>clearedReasons(current(),c).length===0)'))
        with page.expect_download() as dl: page.locator('#exportLibrary').click()
        manifest=json.loads(Path(dl.value.path()).read_text())
        check('multi_clip_library_one_source',len(manifest['sources'])==1 and len(manifest['clips'])==2)
        check('exclusive_frame_regions',manifest['clips'][0]['region']['end_frame']==manifest['clips'][0]['region']['frame_rate'])
        page.locator('#bpm').fill('90')
        check('editing_tempo_clears_checks',page.evaluate('!current().review.bpm_verified&&!current().review.loop_verified'))
        check('bad_tempo_rejected',page.evaluate('clearedReasons(current(),current().clips.find(c=>c.clip_id===current().active_clip_id)).some(x=>x.includes("tempo"))'))
        # Save/reload roundtrip must retain both clips and active selection.
        page.evaluate('persist()');saved=page.evaluate('localStorage.data');page.close();page=load_page(ctx,saved);page.evaluate('localService=true')
        check('reload_multi_clip_data',page.evaluate('current().clips.length===2 && current().review.title === "Fixture clip B"'))
        # Duplicate payload test on a second source.
        page.locator('#next').click();page.locator('#play').click();page.wait_for_function('current().technical.duration_seconds_measured>0');page.locator('#stop').click()
        check('identical_payload_reported_separate_identity', 'Identical fetched audio payload' in page.locator('#duplicateInfo').inner_text())
        # Batch decoding measures sources without flipping any new listening confirmation.
        page.locator('#measureFirstBatch').click()
        page.wait_for_function('batchRunning===true')
        page.wait_for_function('batchRunning===false',{},{'timeout':30000}) if False else None
        page.wait_for_function('batchRunning===false',timeout=30000)
        check('22_batch_decodes',page.evaluate('firstBatchRows().filter(r=>r.technical.duration_seconds_measured>0).length===22'))
        check('batch_not_automatic_audition',page.evaluate('firstBatchRows().filter(r=>r.clips.some(c=>c.review.auditioned)).length===1'))
        # Source-integrity mismatch refuses replacement.
        page.evaluate("() => {const r=current();cache.delete(r.record_id);r.technical.source_content_sha256='0'.repeat(64);}")
        mismatch=page.evaluate("async()=>{try{await loadAsset(current());return false;}catch(e){return e.message.includes('hash changed');}}")
        check('source_hash_mismatch_rejected',mismatch)
        check('html_payload_not_executed',page.evaluate("() => {window.untrustedRan=false;try{embeddedAudio(new TextEncoder().encode('<script>window.untrustedRan=true<\\/script>').buffer,'text/html')}catch(e){}return !window.untrustedRan;}"))
        check('no_javascript_errors_after_workflow',not errors,errors)
        # Screenshot clean, unmodified shipped seed rather than simulated reviewed fixtures.
        clean=browser.new_context(viewport={'width':1440,'height':1000});desktop=load_page(clean)
        desktop.screenshot(path=str(OUT/'preview_desktop.png'),full_page=True)
        mobile=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);mp=load_page(mobile)
        check('mobile_no_horizontal_overflow',mp.evaluate('document.documentElement.scrollWidth<=window.innerWidth'))
        mp.screenshot(path=str(OUT/'preview_mobile.png'),full_page=True)
        browser.close()
    server.shutdown();server.server_close()
report={'suite':'Audionaut Catalogue Lab 0.2','fixture':'Generated 2-second 220 Hz mono WAV; not an inscription recording','browser_test_scope':'Browser admin policy blocks URL navigation. UI injected in memory; fetch and storage mocked; digest delegated to Python hashlib. Actual Chromium decoder used. Python loopback API and disk cache tested separately with generated WAV.', 'live_audio_auditioned':0,'live_audio_measured':0,'external_network_test':'Direct ordinals.com request failed DNS resolution; web retrieval unavailable. External integration not verified.', 'tests':results,'all_passed':all(x['passed'] for x in results)}
(OUT/'QA_REPORT.json').write_text(json.dumps(report,indent=2))
print(json.dumps({'tests':len(results),'all_passed':report['all_passed']},indent=2))
