
'use strict';
const $=id=>document.getElementById(id);
const SOURCE_URL=$('publicUrl').value;
const STORE='audionaut-catalogue-lab-v0.2';
const ID_RE=/^[0-9a-f]{64}i\d+$/;
let db=JSON.parse($('seed').textContent), selected=null, visible=[], audioContext=null, gain=null, currentSource=null, currentBuffer=null, currentBufferId=null, playAt=0, playOffset=0, positionSeconds=0, playLoop=false, playing=false, batchRunning=false, cancelBatch=false, busy=false, loadSerial=0, toastTimer=null, saveTimer=null, tapTimes=[];
const cache=new Map();
const numericFields=new Set(['bpm','beats','trim_start_seconds','trim_end_seconds','loop_start_seconds','loop_end_seconds']);
let storageOK=true;
try{const saved=JSON.parse(localStorage.getItem(STORE)||localStorage.getItem('audionaut-catalogue-lab-v0.1')||'null');if(saved&&saved.schema==='audionaut-sample-catalogue'&&Array.isArray(saved.assets)){validateDatabase(saved);db=saved;}const gw=localStorage.getItem(STORE+':gateway');if(gw)$('gateway').value=gw;}catch(e){storageOK=false;}
function toast(msg,error=false){const el=$('status');el.textContent=msg;el.classList.toggle('error',error);el.style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.style.display='none',error?11000:5500);}
function refreshDerived(){for(const r of db.assets){const d=duration(r);r.discovery.duration_seconds=d;r.discovery.duration_basis=r.technical.duration_seconds_measured>0?'browser_decoded':r.technical.duration_ms_reported>0?'ord_audio_report':d===null?'unknown':'jim_note_rounded';r.discovery.queue=d===null?'unknown':d<20?(r.technical.duration_seconds_measured>0?'under_20_measured':'under_20_reported'):d<=21?'boundary_20_to_21':'longer';}db.coverage.independently_measured_audio_count=db.assets.filter(r=>r.technical.duration_seconds_measured>0).length;}
function persist(){refreshDerived();try{localStorage.setItem(STORE,JSON.stringify(db));localStorage.setItem(STORE+':gateway',$('gateway').value);storageOK=true;}catch(e){storageOK=false;}$('storageInfo').textContent=storageOK?'Annotations saved in this browser. Save catalogue JSON regularly for a portable backup.':'Browser storage unavailable or full. Your edits are in memory only. Save catalogue JSON before closing.';}
function schedulePersist(){clearTimeout(saveTimer);saveTimer=setTimeout(persist,300);}
function current(){return db.assets.find(x=>x.record_id===selected)||null;}
function duration(r){const t=r.technical;if(Number.isFinite(t.duration_seconds_measured)&&t.duration_seconds_measured>0)return t.duration_seconds_measured;if(Number.isFinite(t.duration_ms_reported)&&t.duration_ms_reported>0)return t.duration_ms_reported/1000;const n=r.original_note?.duration_seconds_reported;return Number.isFinite(n)&&n>0?n:null;}
function basis(r){return r.technical.duration_seconds_measured>0?'decoded measurement':r.technical.duration_ms_reported>0?'ord.audio report':r.original_note?.duration_seconds_reported>0?'rounded curator note':'unknown duration';}
function bucket(r){const d=duration(r);return d===null?'unknown':d<20?'short':d<=21?'boundary':'long';}
function isMusical(r){return r.discovery.priority==='musical_candidate'||['drums','percussion','bass','synth','keys','guitar','strings'].includes(r.review.sound_category);}
function stats(){const short=db.assets.filter(r=>bucket(r)==='short');$('statShort').textContent=short.length;$('statMusical').textContent=short.filter(isMusical).length;$('statBoundary').textContent=db.assets.filter(r=>bucket(r)==='boundary').length;$('statUnknown').textContent=db.assets.filter(r=>bucket(r)==='unknown').length;$('statReviewed').textContent=db.assets.filter(r=>r.review.status!=='unreviewed').length;$('statTotal').textContent=db.assets.length;$('sourceSummary').textContent=db.coverage.scope;$('coverageNote').textContent=`${db.assets.length} source records in this working catalogue. Not a complete Bitcoin census. Durations are labelled by source; keyword suggestions are not verified classifications. ${db.assets.filter(r=>r.technical.duration_seconds_measured>0).length} source(s) decoded and measured in this catalogue.`;}
function getVisible(){const q=$('search').value.trim().toLowerCase(),kind=$('queueFilter').value,priority=$('priorityFilter').value;let rows=db.assets.filter(r=>(kind==='all'||bucket(r)===kind)&&(priority!=='musical'||isMusical(r))&&(priority!=='unreviewed'||r.review.status==='unreviewed')&&(priority!=='approved'||r.review.status==='approved')&&(!q||[r.inscription_number,r.inscription_id,r.review.title,r.original_note?.text,...r.discovery.suggested_tags,...r.review.tags].join(' ').toLowerCase().includes(q)));const mode=$('sort').value;rows.sort((a,b)=>mode==='duration'?(duration(a)??Infinity)-(duration(b)??Infinity)||a.inscription_number-b.inscription_number:mode==='priority'?(Number(isMusical(b))-Number(isMusical(a)))||a.inscription_number-b.inscription_number:a.inscription_number-b.inscription_number);return rows;}
function renderList(){visible=getVisible();$('queueCount').textContent=`${visible.length} in this queue`;const frag=document.createDocumentFragment();for(const r of visible){const b=document.createElement('button');b.className='item'+(r.record_id===selected?' selected':'');b.setAttribute('role','option');b.setAttribute('aria-selected',String(r.record_id===selected));b.dataset.recordId=r.record_id;const top=document.createElement('div');top.className='item-top';const n=document.createElement('span');n.textContent='#'+r.inscription_number.toLocaleString();const d=document.createElement('span');d.className='duration';d.textContent=duration(r)===null?'? seconds':duration(r).toFixed(3)+' s';top.append(n,d);const title=document.createElement('div');title.className='item-title';title.textContent=r.review.title||r.description;const tags=document.createElement('div');tags.className='item-tags';tags.textContent=[basis(r),r.review.status!=='unreviewed'?r.review.status:isMusical(r)?'musical candidate':'awaiting audition'].join(' · ');b.append(top,title,tags);b.onclick=()=>selectRecord(r.record_id);frag.append(b);}if(!visible.length){const el=document.createElement('div');el.className='empty';el.textContent='No matches. Change the queue or search.';frag.append(el);}$('queueList').replaceChildren(frag);stats();}
function escapeTxt(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function renderDetail(){const r=current();$('detail').hidden=!r;if(!r)return;$('selectedNumber').textContent='BITCOIN / INSCRIPTION #'+r.inscription_number.toLocaleString();$('selectedTitle').textContent=r.review.title||r.description;$('badges').innerHTML=`<span class="tag ${r.technical.duration_seconds_measured?'good':'warn'}">${escapeTxt(basis(r))}</span><span class="tag">${escapeTxt(r.review.status)}</span><span class="tag">Reuse: ${escapeTxt(r.rights.status)}</span>`;$('sourceLabel').textContent=r.original_note?'Original curator note · '+r.original_note.author+' · source line '+r.original_note.line_start:'Public index discovery · no curator description yet';$('sourceNote').textContent=r.original_note?.text||'No descriptive metadata supplied. Audition before classifying.';$('sourceBpm').textContent=r.original_note?.bpm_reported?`Original noted BPM: ${r.original_note.bpm_reported}. This has NOT been automatically accepted as verified tempo.`:'';for(const el of document.querySelectorAll('[data-field]')){const v=r.review[el.dataset.field];if(el.type==='checkbox')el.checked=Boolean(v);else el.value=Array.isArray(v)?v.join(', '):(v??'');}for(const el of document.querySelectorAll('[data-rights]'))el.value=r.rights[el.dataset.rights]??'';$('sourceId').textContent=r.inscription_id||'Unresolved ID';$('explorer').href='https://ordinals.com/inscription/'+encodeURIComponent(r.inscription_id||r.inscription_number);$('hashes').textContent=r.technical.source_content_sha256?'Source body SHA-256: '+r.technical.source_content_sha256:'';$('issues').textContent=(r.discovery.issues||[]).join(' ');$('useReportedBpm').disabled=!r.original_note?.bpm_reported;updateMeasurement();drawWave();updateRegion();}
function selectRecord(id){if(current()?.record_id===id)return;stop();loadSerial++;selected=id;tapTimes=[];positionSeconds=0;currentBufferId=cache.has(id)?id:null;currentBuffer=cache.get(id)||null;$('nativePlayer').pause();$('nativePlayer').removeAttribute('src');$('nativePlayer').style.display='none';renderList();renderDetail();}
function nextRecord(delta){if(!visible.length)return;const i=visible.findIndex(r=>r.record_id===selected);selectRecord(visible[(Math.max(0,i)+delta+visible.length)%visible.length].record_id);const el=Array.from($('queueList').children).find(e=>e.dataset.recordId===selected);if(el)el.scrollIntoView({block:'nearest'});}
function updateFilters(){renderList();if(!visible.some(r=>r.record_id===selected)){if(visible.length)selectRecord(visible[0].record_id);else{stop();selected=null;renderDetail();}}}
function saveFields(){const r=current();if(!r)return;for(const el of document.querySelectorAll('[data-field]')){const k=el.dataset.field;let v;if(el.type==='checkbox')v=el.checked;else if(k==='tags')v=el.value.split(',').map(x=>x.trim()).filter(Boolean);else if(numericFields.has(k)){v=el.value===''?null:Number(el.value);if(v!==null&&(!Number.isFinite(v)||v<0))continue;}else v=el.value.trim()||null;r.review[k]=v;}for(const el of document.querySelectorAll('[data-rights]'))r.rights[el.dataset.rights]=el.value.trim()||null;r.review.reviewed_at=r.review.status==='unreviewed'?null:new Date().toISOString();schedulePersist();$('selectedTitle').textContent=r.review.title||r.description;updateRegion();drawWave();stats();}
function context(){if(!audioContext){const C=window.AudioContext||window.webkitAudioContext;if(!C)throw new Error('This browser does not support Web Audio.');audioContext=new C();gain=audioContext.createGain();gain.gain.value=Number($('volume').value);gain.connect(audioContext.destination);}return audioContext;}
function gateway(){const url=new URL($('gateway').value.trim());if(!['https:','http:'].includes(url.protocol))throw new Error('Gateway must use http or https.');return url.href.replace(/\/+$/,'');}
async function fetchBytes(url,maxBytes=8*1024*1024){const ac=new AbortController();const timeout=setTimeout(()=>ac.abort(),25000);try{const response=await fetch(url,{signal:ac.signal});if(!response.ok){let detail='';try{detail=(await response.json()).error||'';}catch(e){}throw new Error('HTTP '+response.status+(detail?': '+detail:''));}const announced=Number(response.headers.get('content-length'));if(announced>maxBytes)throw new Error('Source exceeds the 8 MB safety limit.');const mime=response.headers.get('X-Audionaut-Original-Type')||response.headers.get('content-type')||'';if(!response.body){const bytes=await response.arrayBuffer();if(bytes.byteLength>maxBytes)throw new Error('Source too large');return {bytes,mime};}const reader=response.body.getReader(),chunks=[];let total=0;while(true){const{done,value}=await reader.read();if(done)break;total+=value.length;if(total>maxBytes){await reader.cancel();throw new Error('Source exceeds the 8 MB safety limit.');}chunks.push(value);}const bytes=new Uint8Array(total);let at=0;for(const chunk of chunks){bytes.set(chunk,at);at+=chunk.length;}return {bytes:bytes.buffer,mime};}finally{clearTimeout(timeout);}}
async function sha256(bytes){if(!crypto.subtle)return null;const hash=await crypto.subtle.digest('SHA-256',bytes);return Array.from(new Uint8Array(hash),x=>x.toString(16).padStart(2,'0')).join('');}
function embeddedAudio(bytes,mime){const text=new TextDecoder().decode(bytes);if(/text\/html|javascript/i.test(mime)||/^\s*<!doctype|^\s*<html/i.test(text))throw new Error('HTML/JavaScript inscription. Dependency discovery needs a separate review; no code was executed.');if(!/json|text\//i.test(mime)&&!/^\s*[\[{]/.test(text))return {payload:bytes,kind:'direct_audio'};let object;try{object=JSON.parse(text);}catch(e){return{payload:bytes,kind:'direct_audio'};}const found=[];let seen=0;function visit(x,depth=0){if(++seen>15000||depth>14)return;if(typeof x==='string'&&/^data:audio\/[^;,]+;base64,/i.test(x))found.push(x);else if(Array.isArray(x))x.forEach(v=>visit(v,depth+1));else if(x&&typeof x==='object')Object.values(x).forEach(v=>visit(v,depth+1));}visit(object);const unique=[...new Set(found)];if(unique.length!==1)throw new Error(unique.length?'JSON contains multiple embedded audio payloads. Select the intended asset in a dedicated parser.':'JSON audio not recognized. No duration was inferred.');const encoded=unique[0].split(',')[1];const bin=atob(encoded),payload=Uint8Array.from(bin,c=>c.charCodeAt(0)).buffer;return{payload,kind:'json_embedded_audio'};}
async function loadAsset(r){if(cache.has(r.record_id))return cache.get(r.record_id);if(!ID_RE.test(r.inscription_id||''))throw new Error('A valid full inscription ID is required.');const {bytes,mime}=await fetchBytes(gateway()+'/content/'+r.inscription_id);const sourceHash=await sha256(bytes);if(r.technical.source_content_sha256&&sourceHash&&r.technical.source_content_sha256!==sourceHash){r.technical.integrity_error='Source body no longer matches its saved SHA-256.';throw new Error('Source content hash changed. Previous measurement retained; check the gateway and original source before trusting new bytes.');}const {payload,kind}=embeddedAudio(bytes,mime);const payloadHash=await sha256(payload);const c=context();let decoded;try{decoded=await c.decodeAudioData(payload.slice(0));}catch(e){throw new Error('Audio decoding failed in this browser. This is not proof the inscription contains no audio.');}r.technical={...r.technical,duration_seconds_measured:decoded.length/decoded.sampleRate,measurement_method:'WebAudio.decodeAudioData',measured_at:new Date().toISOString(),decoded_sample_rate:decoded.sampleRate,decoded_frames:decoded.length,decoded_channels:decoded.numberOfChannels,source_content_sha256:sourceHash,audio_payload_sha256:payloadHash,body_content_type:mime,payload_kind:kind,integrity_error:null,last_load_error:null};r.discovery.duration_seconds=duration(r);r.discovery.duration_basis='browser_decoded';r.discovery.queue=duration(r)<20?'under_20_measured':duration(r)<=21?'boundary_20_to_21':'longer';cache.set(r.record_id,decoded);if(cache.size>5)cache.delete(cache.keys().next().value);persist();return decoded;}
function region(r,useLoop=false){const d=currentBuffer&&currentBufferId===r.record_id?currentBuffer.duration:duration(r);let start=Number(r.review.trim_start_seconds??0),end=r.review.trim_end_seconds??d;if(useLoop){start=r.review.loop_start_seconds??start;end=r.review.loop_end_seconds??end;}if(!Number.isFinite(start)||!Number.isFinite(end)||start<0||end<=start||d===null||end>d+0.000001)throw new Error('Set a valid region: 0 ≤ start < end ≤ decoded duration.');return {start,end};}
function stop(){if(currentSource){try{currentSource.onended=null;currentSource.stop();currentSource.disconnect();}catch(e){}}currentSource=null;playing=false;$('nativePlayer').pause();$('play').textContent='Load & play';drawWave();}
function playBuffer(offset=null){const r=current();if(!r||!currentBuffer)return;stop();const loop=$('loopPlayback').checked,{start,end}=region(r,loop);const at=offset===null?start:Math.max(start,Math.min(offset,end-1/currentBuffer.sampleRate));const c=context();const s=c.createBufferSource();s.buffer=currentBuffer;s.connect(gain);s.loop=loop;if(loop){s.loopStart=start;s.loopEnd=end;}s.onended=()=>{if(currentSource===s){currentSource=null;playing=false;$('play').textContent='Play selection';}};currentSource=s;playAt=c.currentTime;playOffset=at;playLoop=loop;playing=true;s.start(0,at,loop?undefined:end-at);$('play').textContent='Playing…';animate();}
async function play(){if(playing){stop();return;}const r=current();if(!r||busy||batchRunning)return;saveFields();busy=true;const token=++loadSerial;$('play').disabled=true;$('measureLine').textContent='Fetching and decoding inscription bytes…';try{const c=context();await c.resume();const buffer=await loadAsset(r);if(token!==loadSerial||selected!==r.record_id)return;currentBuffer=buffer;currentBufferId=r.record_id;positionSeconds=0;renderList();renderDetail();playBuffer();}catch(e){r.technical.last_load_error=String(e.message||e);persist();if(selected===r.record_id){updateMeasurement();toast('Could not decode: '+e.message+'. Native playback is available below when supported.',true);$('nativePlayer').volume=Number($('volume').value);$('nativePlayer').loop=$('loopPlayback').checked;$('nativePlayer').src=sourceFetchURL(r);$('nativePlayer').style.display='block';}}finally{busy=false;$('play').disabled=false;}}
function updateMeasurement(){const r=current();if(!r)return;const t=r.technical;if(t.duration_seconds_measured){$('measureLine').textContent=`Decoded: ${t.duration_seconds_measured.toFixed(6)} s · ${t.decoded_frames.toLocaleString()} frames · ${(t.decoded_sample_rate/1000).toFixed(1)} kHz decoded rate · ${t.decoded_channels} channel(s). The browser may resample; this is not necessarily the encoded source sample rate.`;}else $('measureLine').textContent=t.last_load_error?'Last decode error: '+t.last_load_error:`${duration(r)!==null?duration(r).toFixed(3)+' s · '+basis(r)+'. ':''}Load to measure, hash and inspect the waveform.`;}
function updateRegion(){const r=current();if(!r)return;try{const rg=region(r,$('loopPlayback').checked);const n=rg.end-rg.start;$('regionInfo').textContent=`Selected region: ${n.toFixed(6)} s`+(r.review.beats?` · ${Number(r.review.beats)} beats implies ${(60*r.review.beats/n).toFixed(3)} BPM`:'')+'. No beat count or loop seam is assumed.';}catch(e){$('regionInfo').textContent='Region pending measurement or valid boundaries.';}}
function drawWave(){const canvas=$('waveform'),ratio=window.devicePixelRatio||1,w=Math.max(100,canvas.clientWidth),h=130;canvas.width=w*ratio;canvas.height=h*ratio;const ctx=canvas.getContext('2d');ctx.scale(ratio,ratio);ctx.clearRect(0,0,w,h);ctx.strokeStyle='#34434b';ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();const r=current(),buffer=currentBuffer;if(!r||!buffer||currentBufferId!==r.record_id){ctx.fillStyle='#8a9fa8';ctx.font='12px system-ui';ctx.textAlign='center';ctx.fillText('Load a clip to inspect its waveform',w/2,h/2-12);return;}try{const rg=region(r,$('loopPlayback').checked);ctx.fillStyle='#cbea9613';ctx.fillRect(rg.start/buffer.duration*w,0,(rg.end-rg.start)/buffer.duration*w,h);}catch(e){}const data=buffer.getChannelData(0),step=Math.max(1,Math.floor(data.length/w));ctx.strokeStyle='#a6c87f';ctx.beginPath();for(let x=0;x<w;x++){let lo=1,hi=-1;const begin=Math.floor(x*data.length/w),end=Math.min(data.length,begin+step);for(let i=begin;i<end;i++){lo=Math.min(lo,data[i]);hi=Math.max(hi,data[i]);}ctx.moveTo(x,h/2+lo*h*.43);ctx.lineTo(x,h/2+hi*h*.43);}ctx.stroke();if(positionSeconds>=0){const x=positionSeconds/buffer.duration*w;ctx.strokeStyle='#f0deb1';ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}}
function animate(){if(!playing)return;const r=current();if(!r)return;try{const {start,end}=region(r,playLoop);let at=playOffset+audioContext.currentTime-playAt;if(playLoop&&at>=end)at=start+(at-start)%(end-start);positionSeconds=Math.min(at,end);$('position').textContent=positionSeconds.toFixed(3)+' s';drawWave();requestAnimationFrame(animate);}catch(e){stop();}}
function download(name,content,type){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function exportDB(){saveFields();refreshDerived();db.updated_at=new Date().toISOString();download('audionaut-catalogue.json',JSON.stringify(db,null,2),'application/json');}
function safeCSV(value){let s=value===null||value===undefined?'':String(value);if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
function exportCSV(){saveFields();const rows=getVisible();const fields=['inscription_number','inscription_id','title','duration_seconds','duration_basis','review_status','use_type','category','tags','bpm','key','root_note','beats','trim_start_seconds','trim_end_seconds','loop_start_seconds','loop_end_seconds','loop_verified','rights_status','license','creator','evidence_url','original_note','content_url'];const data=rows.map(r=>[r.inscription_number,r.inscription_id,r.review.title,duration(r),basis(r),r.review.status,r.review.usage_type,r.review.sound_category,r.review.tags.join('|'),r.review.bpm,r.review.key,r.review.root_note,r.review.beats,r.review.trim_start_seconds,r.review.trim_end_seconds,r.review.loop_start_seconds,r.review.loop_end_seconds,r.review.loop_verified,r.rights.status,r.rights.license,r.rights.creator,r.rights.evidence_url,r.original_note?.text,gateway()+'/content/'+r.inscription_id]);download('audionaut-audition-queue.csv','\ufeff'+[fields,...data].map(row=>row.map(safeCSV).join(',')).join('\r\n'),'text/csv;charset=utf-8');}
function validateDatabase(value){if(!value||value.schema!=='audionaut-sample-catalogue'||!Array.isArray(value.assets)||!value.coverage)throw new Error('Not a catalogue JSON from this tool.');if(value.assets.length>100000)throw new Error('Catalogue too large for this prototype.');const ids=new Set();for(const r of value.assets){if(!r||typeof r.record_id!=='string'||ids.has(r.record_id)||!r.review||!r.technical||!r.discovery||!r.rights||!Array.isArray(r.review.tags)||!Array.isArray(r.discovery.suggested_tags)||!Number.isSafeInteger(r.inscription_number))throw new Error('Invalid or duplicate catalogue record.');if(r.inscription_id&&!ID_RE.test(r.inscription_id))throw new Error('Invalid inscription ID.');ids.add(r.record_id);}return true;}
function newPublicRecord(s){return{record_id:'btc:ord:'+s.id,inscription_id:s.id,inscription_number:s.num,identity_status:'ord_audio_import',original_id_candidates:[],description:s.name||'Unlabelled audio #'+s.num,original_note:null,technical:{mime_reported:s.mime||null,duration_ms_reported:s.ms??null,duration_report_source:'ord.audio',duration_seconds_measured:null,measurement_method:null,measured_at:null,decoded_sample_rate:null,decoded_frames:null,decoded_channels:null,source_content_sha256:null,audio_payload_sha256:null,last_load_error:null},discovery:{duration_seconds:s.ms/1000,duration_basis:'ord_audio_report',queue:s.ms<20000?'under_20_reported':s.ms<=21000?'boundary_20_to_21':'longer',priority:'standard',suggested_tags:[],suggestion_basis:null,sources:['ord_audio_full_import'],issues:[]},review:{status:'unreviewed',usage_type:'unclassified',sound_category:'unknown',title:s.name||'Unlabelled audio #'+s.num,tags:[],instrument:null,bpm:null,key:null,root_note:null,beats:null,time_signature:null,trim_start_seconds:0,trim_end_seconds:null,loop_start_seconds:null,loop_end_seconds:null,loop_verified:false,notes:'',reviewer:null,reviewed_at:null},rights:{status:'unknown',license:null,creator:null,evidence_url:null,notes:''},content_path:'/content/'+s.id,source_urls:[SOURCE_URL,'https://ordinals.com/inscription/'+s.id]};}
function mergePublic(rows){if(!Array.isArray(rows)||rows.length>100000)throw new Error('Expected an ord.audio JSON array.');for(const s of rows){if(!s||!ID_RE.test(s.id||'')||!Number.isSafeInteger(s.num)||!Number.isFinite(s.ms)||s.ms<=0)throw new Error('Invalid public catalogue row.');}const byId=new Map(db.assets.map(r=>[r.inscription_id,r]));let added=0,updated=0;for(const s of rows){const existing=byId.get(s.id);if(existing){existing.technical.duration_ms_reported=s.ms;existing.technical.mime_reported=s.mime||existing.technical.mime_reported;existing.technical.duration_report_source='ord.audio';if(existing.inscription_number!==s.num)existing.discovery.issues.push('Public index number disagreement: '+s.num+' (ID unchanged).');if(!existing.discovery.sources.includes('ord_audio_full_import'))existing.discovery.sources.push('ord_audio_full_import');updated++;}else{const r=newPublicRecord(s);db.assets.push(r);byId.set(s.id,r);added++;}}db.coverage.full_public_import={row_count:rows.length,imported_at:new Date().toISOString(),max_inscription_number:rows.reduce((m,x)=>m===null?x.num:Math.max(m,x.num),null),source:SOURCE_URL};db.coverage.scope='Jim’s source catalogue plus an imported ord.audio snapshot. Neither source establishes complete chain-wide coverage.';persist();updateFilters();renderDetail();toast(`Imported ${rows.length} public records: ${added} added, ${updated} matched. No existing curator annotations were overwritten.`);}
async function importPublic(){if(batchRunning||busy)return;$('importPublic').disabled=true;toast('Fetching the public metadata snapshot…');try{const {bytes}=await fetchBytes(SOURCE_URL,8*1024*1024);const rows=JSON.parse(new TextDecoder().decode(bytes));mergePublic(rows);db.coverage.full_public_import.source_body_sha256=await sha256(bytes);persist();}catch(e){toast('Public import failed: '+e.message+'. You can import a locally saved songs.json with Import JSON.',true);}finally{$('importPublic').disabled=false;}}
async function importFile(file){if(!file)return;if(file.size>30*1024*1024)throw new Error('Import file exceeds 30 MB.');const value=JSON.parse(await file.text());saveFields();if(Array.isArray(value)){mergePublic(value);return;}validateDatabase(value);if(!confirm('Replace this working catalogue with the imported backup? Export your current JSON first to preserve it.'))return;stop();loadSerial++;cache.clear();currentBuffer=null;currentBufferId=null;db=value;selected=null;persist();updateFilters();toast('Catalogue backup imported.');}
async function measureVisible(){if(batchRunning||busy)return;saveFields();const rows=getVisible();if(!rows.length)return;context();batchRunning=true;cancelBatch=false;$('cancelBatch').disabled=false;$('measureQueue').disabled=true;$('play').disabled=true;stop();let measured=0,failed=0;for(let i=0;i<rows.length;i++){if(cancelBatch)break;const r=rows[i];$('batchStatus').textContent=`Measuring ${i+1}/${rows.length} · #${r.inscription_number} · ${measured} decoded, ${failed} failed.`;try{await loadAsset(r);measured++;}catch(e){r.technical.last_load_error=String(e.message||e);failed++;}if(r.record_id===selected){currentBuffer=cache.get(r.record_id)||null;currentBufferId=currentBuffer?r.record_id:null;renderDetail();}stats();await new Promise(resolve=>setTimeout(resolve,350));}batchRunning=false;$('cancelBatch').disabled=true;$('measureQueue').disabled=false;$('play').disabled=false;persist();renderList();$('batchStatus').textContent=`${cancelBatch?'Stopped':'Finished'}: ${measured} decoded, ${failed} failed. Errors remain in each source record.`;}
function exportLibrary(){saveFields();const approved=db.assets.filter(r=>r.review.status==='approved');const assets=[],omitted=[];for(const r of approved){let reasons=[];const t=r.technical,a=r.review;if(!ID_RE.test(r.inscription_id||''))reasons.push('full ID');if(!Number.isFinite(t.decoded_sample_rate)||t.decoded_sample_rate<=0||!Number.isSafeInteger(t.decoded_frames)||t.decoded_frames<=0)reasons.push('decoded frame basis');if(!a.reviewer)reasons.push('reviewer name');if(t.integrity_error)reasons.push('unresolved source-integrity error');if(!t.duration_seconds_measured||!t.source_content_sha256||!t.audio_payload_sha256)reasons.push('decoded and hashed source');if(!['one_shot','loop','phrase','texture'].includes(a.usage_type))reasons.push('supported use type');if(!['licensed','public_domain'].includes(r.rights.status)||!r.rights.evidence_url||!r.rights.license)reasons.push('permission evidence and terms');const start=a.trim_start_seconds??0,end=a.trim_end_seconds??t.duration_seconds_measured;if(!Number.isFinite(start)||!Number.isFinite(end)||start<0||end<=start||end>t.duration_seconds_measured+1e-6)reasons.push('valid trim');const ls=a.loop_start_seconds??start,le=a.loop_end_seconds??end;if(a.usage_type==='loop'&&(!a.loop_verified||!Number.isFinite(a.bpm)||a.bpm<=0||!Number.isFinite(a.beats)||a.beats<=0||ls<start||le>end||le<=ls))reasons.push('verified loop bounds / BPM / beats');if(reasons.length){omitted.push({inscription_id:r.inscription_id,missing:reasons});continue;}if(a.usage_type==='loop'&&a.bpm>0&&a.beats>0&&le>ls){const implied=60*a.beats/(le-ls);if(Math.abs(a.bpm-implied)/implied>0.02){omitted.push({inscription_id:r.inscription_id,missing:['BPM / beat count disagree with loop duration by more than 2%']});continue;}}const rate=t.decoded_sample_rate;assets.push({id:r.record_id,source:{chain:'bitcoin',protocol:'ordinals',inscription_id:r.inscription_id,content_path:r.content_path,source_content_sha256:t.source_content_sha256,audio_payload_sha256:t.audio_payload_sha256,payload_kind:t.payload_kind},name:a.title,use_type:a.usage_type,category:a.sound_category,tags:a.tags,region:{start_seconds:start,end_seconds:end,start_frame:Math.round(start*rate),end_frame:Math.round(end*rate),frame_rate:rate},loop:a.usage_type==='loop'?{start_seconds:ls,end_seconds:le,beats:a.beats,bpm:a.bpm,verified:true}:null,key:a.key,root_note:a.root_note,instrument:a.instrument,time_signature:a.time_signature,decoded_audio:{duration_seconds:t.duration_seconds_measured,sample_rate:t.decoded_sample_rate,frames:t.decoded_frames,channels:t.decoded_channels,measurement_method:t.measurement_method},rights:r.rights,reviewer:a.reviewer,reviewed_at:a.reviewed_at});}if(!assets.length){toast('No export-ready assets yet. Approve a decoded clip, set a use type, and record permission evidence. Loops also need verified boundaries, BPM and beat count.',true);return;}download('audionaut-reviewed-library.json',JSON.stringify({schema:'audionaut-library-proposal',version:'0.1.0',created_at:new Date().toISOString(),compatibility:'Integration proposal; live workstation import compatibility not verified.',assets,omitted},null,2),'application/json');toast(`Exported ${assets.length} asset(s). ${omitted.length} approved item(s) omitted with reasons.`);}
// V0.2: independent clip records, explicit review states and local cached retrieval.
let localService = false;
const batchId = 'musical-batch-01';
const seed02 = JSON.parse($('seed').textContent);
const seedById = new Map(seed02.assets.map(r => [r.record_id, r]));
const copy = value => JSON.parse(JSON.stringify(value));

function upgradeDatabase(value) {
  value.schema_version = '0.2.0';
  value.batches ||= copy(seed02.batches);
  for (const r of value.assets) {
    const seed = seedById.get(r.record_id);
    if (!r.curation_proposal && seed?.curation_proposal) r.curation_proposal = copy(seed.curation_proposal);
    if (!Array.isArray(r.clips) || !r.clips.length) r.clips = [{clip_id:r.record_id+':clip:001',review:copy(r.review)}];
    for (const c of r.clips) {
      c.review.auditioned ??= false;
      c.review.bpm_verified ??= false;
      c.review.key_verified ??= false;
    }
    const active = r.clips.find(c => c.clip_id === r.active_clip_id) || r.clips[0];
    r.active_clip_id = active.clip_id;
    r.review = active.review; // Legacy active-clip view, not a second review authority.
  }
  return value;
}
upgradeDatabase(db);

const validate01 = validateDatabase;
validateDatabase = function(value) {
  validate01(value);
  for (const r of value.assets) {
    const ids = new Set();
    for (const c of r.clips || []) {
      if (!c || typeof c.clip_id !== 'string' || !c.clip_id.startsWith(r.record_id+':clip:') || ids.has(c.clip_id) || !c.review || !Array.isArray(c.review.tags)) throw new Error('Invalid or duplicate clip record.');
      for (const key of numericFields) {
        const x = c.review[key];
        if (x != null && (!Number.isFinite(x) || x < 0)) throw new Error('Invalid clip timing value.');
      }
      ids.add(c.clip_id);
    }
  }
  return true;
};

function firstBatchRows() {
  const ids = new Set(db.batches?.find(b => b.id === batchId)?.source_record_ids || []);
  return db.assets.filter(r => ids.has(r.record_id));
}
const visible01 = getVisible;
getVisible = function() {
  const rows = visible01();
  if ($('priorityFilter').value !== 'batch01') return rows;
  const ids = new Set(firstBatchRows().map(r => r.record_id));
  return rows.filter(r => ids.has(r.record_id));
};
const stats01 = stats;
stats = function() {
  stats01();
  const rows = firstBatchRows();
  const clips = rows.flatMap(r => r.clips || []);
  $('batchProgress').textContent = `${rows.length} sources · ${rows.filter(r=>r.technical.duration_seconds_measured>0).length} decoded · ${clips.filter(c=>c.review.auditioned).length}/${clips.length} clips marked listened`;
};
const render01 = renderDetail;
renderDetail = function() {
  render01();
  const r = current();
  if (!r) return;
  if (!r.clips) upgradeDatabase(db);
  const frag = document.createDocumentFragment();
  for (const c of r.clips) {
    const option = document.createElement('option');
    option.value = c.clip_id; option.textContent = `${c.review.title || 'Untitled clip'} · ${c.review.status}`;
    frag.append(option);
  }
  $('clipSelect').replaceChildren(frag);
  $('clipSelect').value = r.active_clip_id;
  $('clipIdentity').textContent = r.active_clip_id;
  $('removeClip').disabled = r.clips.length < 2;
  const p = r.curation_proposal;
  $('proposalBox').hidden = !p;
  if (p) {
    $('proposalText').textContent = `From your note: ${p.usage_type.replace('_','-')} / ${p.sound_category}. This is a draft classification, not a new audition.`;
    const h = p.loop_hypothesis;
    $('timingHypothesis').textContent = h ? `Two-quarter-note test at your noted ${h.bpm_from_note} BPM: ${h.duration_seconds.toFixed(6)} s. Reported source: ${h.reported_source_duration_seconds.toFixed(3)} s (${h.reported_minus_hypothesis_ms>=0?'+':''}${h.reported_minus_hypothesis_ms.toFixed(1)} ms difference). Two beats is a hypothesis, not a detected count. Do not trim based on this difference alone.` : '';
    $('applyHypothesis').hidden = !h;
  }
  const a = r.analysis;
  $('analysisSummary').textContent = a ? `Decoded at ${a.frame_rate} Hz / ${a.channels} channel(s). Sample peak ${a.peak_dbfs == null ? '−∞' : a.peak_dbfs.toFixed(2)} dBFS; RMS ${a.rms_dbfs == null ? '−∞' : a.rms_dbfs.toFixed(2)} dBFS. Near-full-scale samples ${(100*a.near_full_scale_fraction).toFixed(3)}%. These are signal measurements, not an audible quality judgment.` : 'No signal measurements yet. Load or batch-measure the source to calculate them.';
  $('analysisCaveat').textContent = a ? `Frame positions use this browser’s decoded sample rate, not necessarily the original file rate. Level threshold bounds are suggestions only: ${a.activity_start_seconds?.toFixed(6) ?? 'none'}–${a.activity_end_seconds?.toFixed(6) ?? 'none'} s. No automatic trim has been applied.` : '';
  const hash = r.technical.audio_payload_sha256;
  const duplicates = hash ? db.assets.filter(x => x.record_id !== r.record_id && x.technical.audio_payload_sha256 === hash) : [];
  $('duplicateInfo').textContent = duplicates.length ? 'Identical fetched audio payload: ' + duplicates.map(x=>'#'+x.inscription_number).join(', ') + '. These remain separate inscription identities.' : '';
};

function switchClip(id) {
  saveFields(); stop();
  const r = current(), c = r?.clips.find(x=>x.clip_id===id);
  if (!c) return;
  r.active_clip_id=id; r.review=c.review;
  positionSeconds=0; persist(); renderDetail(); renderList();
}
function createClip() {
  saveFields(); stop();
  const r=current(); if(!r)return;
  const review=copy(r.review);
  Object.assign(review,{title:(review.title||r.description)+' · clip '+(r.clips.length+1),status:'unreviewed',auditioned:false,auditioned_at:null,loop_verified:false,bpm_verified:false,key_verified:false,reviewed_at:null,reviewer:null});
  const suffix = globalThis.crypto?.randomUUID?.() || Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
  const c={clip_id:r.record_id+':clip:'+suffix,review};
  r.clips.push(c); r.active_clip_id=c.clip_id; r.review=c.review;
  persist(); renderDetail(); renderList();
  toast('Independent clip created. It starts with the current region, but no listening or timing approvals.');
}
function removeClip() {
  const r=current(); if(!r||r.clips.length<2)return;
  if(!confirm('Delete only this clip’s metadata? The inscription and other clips will remain.'))return;
  stop(); r.clips=r.clips.filter(c=>c.clip_id!==r.active_clip_id);
  r.active_clip_id=r.clips[0].clip_id; r.review=r.clips[0].review;
  persist(); renderDetail(); renderList();
}
function applyProposal() {
  const r=current(),p=r?.curation_proposal; if(!p)return;
  saveFields();
  r.review.usage_type=p.usage_type; r.review.sound_category=p.sound_category;
  r.review.tags=[...new Set([...r.review.tags,...p.tags])];
  r.review.classification_basis=p.basis;
  r.review.loop_verified=false;
  persist(); renderDetail(); renderList();
  toast('Note-based classification copied. Listening, tempo and permissions remain separate checks.');
}
function applyHypothesis() {
  const r=current(),h=r?.curation_proposal?.loop_hypothesis;if(!h)return;
  saveFields();r.review.bpm=h.bpm_from_note;r.review.beats=h.quarter_note_beats;
  r.review.bpm_verified=false;r.review.loop_verified=false;
  persist();renderDetail();toast('Loaded the two-beat tempo hypothesis. No trim or loop boundaries were changed.');
}
function analyseSignal(buffer) {
  const n=buffer.length,channels=buffer.numberOfChannels,rate=buffer.sampleRate;
  let peak=0,sum=0,squares=0,near=0;
  for(let c=0;c<channels;c++){
    const d=buffer.getChannelData(c);
    for(let i=0;i<n;i++){const v=d[i];peak=Math.max(peak,Math.abs(v));sum+=v;squares+=v*v;if(Math.abs(v)>=0.999)near++;}
  }
  const total=n*channels,rms=Math.sqrt(squares/Math.max(1,total));
  const threshold=peak*Math.pow(10,-50/20);
  let start=n,end=-1;
  if(peak>0)for(let c=0;c<channels;c++){
    const d=buffer.getChannelData(c);let i=0,j=n-1;
    while(i<n && Math.abs(d[i])<=threshold)i++;
    while(j>=0 && Math.abs(d[j])<=threshold)j--;
    start=Math.min(start,i);end=Math.max(end,j);
  }
  return {method:'All-channel PCM statistics, no perceptual or AI classifier',frame_rate:rate,channels,
    frames:n,peak_linear:peak,peak_dbfs:peak>0?20*Math.log10(peak):null,rms_linear:rms,
    rms_dbfs:rms>0?20*Math.log10(rms):null,dc_offset:sum/Math.max(1,total),
    near_full_scale_fraction:near/Math.max(1,total),near_full_scale_threshold:0.999,
    activity_threshold_db_relative_to_peak:-50,activity_start_seconds:end>=start?start/rate:null,
    activity_end_seconds:end>=start?(end+1)/rate:null,activity_is_trim_suggestion_only:true,
    semantic_classification_performed:false,measured_at:new Date().toISOString()};
}
function sourceFetchURL(r) {
  return localService&&gateway()==='https://ordinals.com' ? '/api/content/'+r.inscription_id : gateway()+'/content/'+r.inscription_id;
}
loadAsset = async function(r) {
  if(cache.has(r.record_id))return cache.get(r.record_id);
  if(!ID_RE.test(r.inscription_id||''))throw new Error('A valid full inscription ID is required.');
  const url=sourceFetchURL(r),{bytes,mime}=await fetchBytes(url);
  const sourceHash=await sha256(bytes);
  if(r.technical.source_content_sha256&&sourceHash&&r.technical.source_content_sha256!==sourceHash){
    r.technical.integrity_error='Source body no longer matches its saved SHA-256.';
    throw new Error('Source content hash changed. The old measurement is retained; no replacement was accepted.');
  }
  const {payload,kind}=embeddedAudio(bytes,mime),payloadHash=await sha256(payload);
  let decoded;
  try{decoded=await context().decodeAudioData(payload.slice(0));}catch(e){throw new Error('This browser could not decode the source. This does not establish that it contains no audio.');}
  const old=r.technical;
  if(old.decoded_sample_rate && (old.decoded_sample_rate!==decoded.sampleRate||old.decoded_frames!==decoded.length)){
    for(const c of r.clips){c.review.loop_verified=false;c.review.bpm_verified=false;}
    r.discovery.issues=[...new Set([...(r.discovery.issues||[]),'Decoded frame basis changed; loop and tempo approvals need rechecking.'])];
  }
  r.technical={...old,duration_seconds_measured:decoded.length/decoded.sampleRate,
    measurement_method:'WebAudio.decodeAudioData at AudioContext sample rate',measured_at:new Date().toISOString(),
    decoded_sample_rate:decoded.sampleRate,decoded_frames:decoded.length,decoded_channels:decoded.numberOfChannels,
    source_content_sha256:sourceHash,audio_payload_sha256:payloadHash,body_content_type:mime,
    payload_kind:kind,integrity_error:null,last_load_error:null,retrieved_via:url,
    verification_scope:'Hash of fetched bytes; not independent verification against a Bitcoin node'};
  r.analysis=analyseSignal(decoded);
  cache.set(r.record_id,decoded);
  if(cache.size>8)cache.delete(cache.keys().next().value);
  persist();return decoded;
};

async function detectLocalService() {
  if(!['localhost','127.0.0.1','[::1]'].includes(location.hostname)){
    $('connectionMode').textContent='Direct browser mode. For cached audio and same-origin retrieval, launch with the included serve.py.';return;
  }
  try{
    const r=await fetch('/api/health',{signal:AbortSignal.timeout(2500)});
    const info=await r.json();
    localService=r.ok && info.service==='audionaut-catalogue-local';
    $('connectionMode').textContent=localService?`Local cached mode ready · ${info.cached_sources} source(s) on disk. The source bytes are fetched only on demand.`:'Direct browser mode; local cache service was not found.';
  }catch(e){$('connectionMode').textContent='Direct browser mode; local cache service was not found.';}
}
importPublic = async function() {
  if(batchRunning||busy)return;
  $('importPublic').disabled=true;
  try{
    const {bytes}=await fetchBytes(localService?'/api/public-catalogue':SOURCE_URL);
    mergePublic(JSON.parse(new TextDecoder().decode(bytes)));upgradeDatabase(db);
    db.coverage.full_public_import.source_body_sha256=await sha256(bytes);
    persist();renderList();renderDetail();
  }catch(e){toast('Public import failed: '+e.message+'. Import a saved songs.json through Import JSON instead.',true);}
  finally{$('importPublic').disabled=false;}
};
const merge01=mergePublic;
mergePublic=function(rows){merge01(rows);upgradeDatabase(db);persist();renderList();renderDetail();};
const import01=importFile;
importFile=async function(file){await import01(file);upgradeDatabase(db);persist();renderList();renderDetail();};

function frameRegion(r,a) {
  const rate=r.technical.decoded_sample_rate,d=r.technical.duration_seconds_measured;
  const start=a.trim_start_seconds??0,end=a.trim_end_seconds??d;
  return {start_seconds:start,end_seconds:end,start_frame:Number.isFinite(rate)&&Number.isFinite(start)?Math.round(start*rate):null,
    end_frame:Number.isFinite(rate)&&Number.isFinite(end)?Math.round(end*rate):null,frame_rate:rate??null,end_is_exclusive:true};
}
function manifestClip(r,c) {
  const a=c.review;
  return {id:c.clip_id,source_id:r.record_id,title:a.title||r.description,usage_type:a.usage_type,
    sound_category:a.sound_category,tags:a.tags,instrument:a.instrument,region:frameRegion(r,a),
    loop:a.usage_type==='loop'?{start_seconds:a.loop_start_seconds??a.trim_start_seconds??0,
      end_seconds:a.loop_end_seconds??a.trim_end_seconds??r.technical.duration_seconds_measured,
      beats:a.beats,bpm:a.bpm,seam_verified:!!a.loop_verified,tempo_verified:!!a.bpm_verified}:null,
    tuning:{key:a.key,root_note:a.root_note,verified:!!a.key_verified},time_signature:a.time_signature,
    review:{status:a.status,auditioned:!!a.auditioned,reviewer:a.reviewer,reviewed_at:a.reviewed_at},
    proposal:r.curation_proposal??null,rights:r.rights};
}
function sourceDescriptor(r) {
  return {id:r.record_id,chain:'bitcoin',protocol:'ordinals',inscription_id:r.inscription_id,
    inscription_number:r.inscription_number,content_path:r.content_path,
    source_content_sha256:r.technical.source_content_sha256,audio_payload_sha256:r.technical.audio_payload_sha256,
    decoded_audio:{duration_seconds:r.technical.duration_seconds_measured,sample_rate:r.technical.decoded_sample_rate,
      frames:r.technical.decoded_frames,channels:r.technical.decoded_channels,method:r.technical.measurement_method},
    reported_duration_seconds:r.technical.duration_ms_reported?r.technical.duration_ms_reported/1000:null,
    source_note:r.original_note,verification_scope:r.technical.verification_scope??'not_measured'};
}
function exportDraft() {
  saveFields();const rows=getVisible();
  download('audionaut-draft-clips.json',JSON.stringify({schema:'audionaut-clip-library-proposal',version:'0.2.0',status:'draft',
    created_at:new Date().toISOString(),compatibility:'Proposed adapter format; not verified against the live workstation.',
    sources:rows.map(sourceDescriptor),clips:rows.flatMap(r=>r.clips.map(c=>manifestClip(r,c)))},null,2),'application/json');
  toast('Exported every clip in the visible source queue, including draft metadata and unknown permissions.');
}
function clearedReasons(r,c) {
  const a=c.review,t=r.technical,reasons=[],rg=frameRegion(r,a);
  if(a.status!=='approved')reasons.push('curator approval');
  if(a.auditioned!==true)reasons.push('listening confirmation');
  if(!a.reviewer)reasons.push('reviewer');
  if(!['one_shot','loop','phrase','texture'].includes(a.usage_type))reasons.push('sample use type');
  if(!ID_RE.test(r.inscription_id||''))reasons.push('full inscription ID');
  if(t.integrity_error)reasons.push('unresolved source-integrity error');
  if(!t.source_content_sha256||!t.audio_payload_sha256||!(t.duration_seconds_measured>0)||!(t.decoded_sample_rate>0)||!Number.isSafeInteger(t.decoded_frames)||t.decoded_frames<=0)reasons.push('decoded and hashed source');
  if(!Number.isFinite(rg.start_seconds)||!Number.isFinite(rg.end_seconds)||rg.start_seconds<0||rg.end_seconds<=rg.start_seconds||rg.end_seconds>t.duration_seconds_measured+1e-6||rg.end_frame<=rg.start_frame)reasons.push('valid clip boundaries');
  if(!['licensed','public_domain'].includes(r.rights.status)||!r.rights.license||!/^https?:\/\//.test(r.rights.evidence_url||''))reasons.push('permission terms and evidence');
  if((a.key||a.root_note)&&!a.key_verified)reasons.push('tuning-label verification');
  if(a.usage_type==='loop'){
    const ls=a.loop_start_seconds??rg.start_seconds,le=a.loop_end_seconds??rg.end_seconds;
    if(!a.loop_verified||!a.bpm_verified||!(a.bpm>0)||!(a.beats>0))reasons.push('loop seam, tempo and beat count');
    if(!Number.isFinite(ls)||!Number.isFinite(le)||ls<rg.start_seconds||le>rg.end_seconds||le<=ls)reasons.push('valid loop bounds');
    else if(a.bpm>0&&a.beats>0&&Math.abs(a.bpm-60*a.beats/(le-ls))/(60*a.beats/(le-ls))>0.02)reasons.push('tempo/beat count differs from region by more than 2%');
  }
  return [...new Set(reasons)];
}
exportLibrary=function(){
  saveFields();const sources=[],clips=[],omitted=[];
  for(const r of db.assets){
    let used=false;
    for(const c of r.clips){
      if(c.review.status!=='approved')continue;
      const reasons=clearedReasons(r,c);
      if(reasons.length)omitted.push({clip_id:c.clip_id,missing:reasons});
      else{clips.push(manifestClip(r,c));used=true;}
    }
    if(used)sources.push(sourceDescriptor(r));
  }
  const value={schema:'audionaut-clip-library-proposal',version:'0.2.0',created_at:new Date().toISOString(),
    status:'curator_approved_with_recorded_permission_evidence',compatibility:'Integration proposal; live workstation compatibility not verified.',
    note:'Evidence and metadata supplied by the curator, not independently certified by this software.',sources,clips,omitted};
  download(clips.length?'audionaut-cleared-clips.json':'audionaut-export-readiness.json',JSON.stringify(value,null,2),'application/json');
  toast(clips.length?`Exported ${clips.length} clip(s) from ${sources.length} source(s).`:`No cleared clips yet. Exported a readiness report for ${omitted.length} approved clip(s).`,!clips.length);
};

$('clipSelect').onchange=e=>switchClip(e.target.value);
$('newClip').onclick=createClip;$('removeClip').onclick=removeClip;
$('applyProposal').onclick=applyProposal;$('applyHypothesis').onclick=applyHypothesis;
$('exportDraft').onclick=exportDraft;
$('startBatch').onclick=()=>{saveFields();$('search').value='';$('queueFilter').value='all';$('priorityFilter').value='batch01';$('sort').value='number';updateFilters();};
$('measureFirstBatch').onclick=()=>{$('startBatch').click();$('measureQueue').click();};
for(const el of document.querySelectorAll('[data-field]'))el.addEventListener('input',()=>{
  const r=current();if(!r)return;
  const field=el.dataset.field;
  if(['bpm','beats','trim_start_seconds','trim_end_seconds','loop_start_seconds','loop_end_seconds'].includes(field)){
    $('bpmVerified').checked=false;$('loopVerified').checked=false;r.review.bpm_verified=false;r.review.loop_verified=false;
  }
  if(['key','root_note'].includes(field)){$('keyVerified').checked=false;r.review.key_verified=false;}
  if(field==='auditioned')r.review.auditioned_at=el.checked?new Date().toISOString():null;
});
// Default to the first batch without fetching any source bytes.
$('priorityFilter').value='batch01';$('queueFilter').value='all';
detectLocalService();

for(const id of ['search','queueFilter','priorityFilter','sort'])$(id).addEventListener(id==='search'?'input':'change',updateFilters);
for(const el of document.querySelectorAll('[data-field],[data-rights]'))el.addEventListener('input',()=>{if(/^(trim|loop)_(start|end)_seconds$/.test(el.dataset.field||'')){if(playing)stop();$('loopVerified').checked=false;}saveFields();if(['title','status','sound_category','tags'].includes(el.dataset.field))renderList();});
$('play').onclick=play;$('stop').onclick=stop;$('prev').onclick=()=>nextRecord(-1);$('next').onclick=()=>nextRecord(1);$('saveNext').onclick=()=>{saveFields();persist();nextRecord(1);};$('volume').oninput=()=>{if(gain)gain.gain.setTargetAtTime(Number($('volume').value),audioContext.currentTime,.02);$('nativePlayer').volume=Number($('volume').value);};$('loopPlayback').onchange=()=>{updateRegion();drawWave();$('nativePlayer').loop=$('loopPlayback').checked;if(playing)try{playBuffer();}catch(e){stop();toast(e.message,true);}};
$('waveform').onclick=e=>{if(!currentBuffer||currentBufferId!==selected)return;const box=e.currentTarget.getBoundingClientRect(),seconds=Math.max(0,Math.min(currentBuffer.duration,(e.clientX-box.left)/box.width*currentBuffer.duration));if(e.shiftKey){stop();$('loopVerified').checked=false;$('trimStart').value=seconds.toFixed(6);saveFields();}else if(e.altKey){stop();$('loopVerified').checked=false;$('trimEnd').value=seconds.toFixed(6);saveFields();}else{positionSeconds=seconds;drawWave();if(playing)try{playBuffer(seconds);}catch(err){toast(err.message,true);}}};
$('useReportedBpm').onclick=()=>{$('bpmVerified').checked=false;$('loopVerified').checked=false;const r=current();if(r?.original_note?.bpm_reported){$('bpm').value=r.original_note.bpm_reported;saveFields();toast('Copied your noted BPM. Verify it against the audio before approval.');}};
$('tapTempo').onclick=()=>{$('bpmVerified').checked=false;$('loopVerified').checked=false;const now=performance.now();if(tapTimes.length&&now-tapTimes.at(-1)>3000)tapTimes=[];tapTimes.push(now);if(tapTimes.length>10)tapTimes.shift();if(tapTimes.length>1){$('bpm').value=(60000*(tapTimes.length-1)/(now-tapTimes[0])).toFixed(3);saveFields();}};
$('calcTempo').onclick=()=>{$('bpmVerified').checked=false;$('loopVerified').checked=false;try{saveFields();const r=current();const {start,end}=region(r,$('loopPlayback').checked);if(!r.review.beats)throw new Error('Enter the beat count first.');$('bpm').value=(60*r.review.beats/(end-start)).toFixed(3);saveFields();toast('BPM calculated from your beat count and selected region; confirm by listening.');}catch(e){toast(e.message,true);}};
$('exportAll').onclick=exportDB;$('exportQueue').onclick=exportCSV;$('exportLibrary').onclick=exportLibrary;$('exportRecord').onclick=()=>{saveFields();const r=current();if(r)download('inscription-'+r.inscription_number+'-metadata.json',JSON.stringify(r,null,2),'application/json');};$('importButton').onclick=()=>$('importFile').click();$('importFile').onchange=async e=>{try{await importFile(e.target.files[0]);}catch(err){toast(err.message,true);}finally{e.target.value='';}};$('importPublic').onclick=importPublic;$('measureQueue').onclick=()=>measureVisible().catch(e=>{batchRunning=false;$('measureQueue').disabled=false;$('play').disabled=false;$('cancelBatch').disabled=true;toast(e.message,true);});$('cancelBatch').onclick=()=>{cancelBatch=true;$('batchStatus').textContent='Stopping after the current bounded request finishes.';};$('resetFilters').onclick=()=>{$('search').value='';$('queueFilter').value='short';$('priorityFilter').value='all';$('sort').value='priority';updateFilters();};$('gateway').onchange=()=>{try{gateway();cache.clear();currentBuffer=null;currentBufferId=null;persist();stop();drawWave();}catch(e){toast(e.message,true);}};
document.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT|BUTTON/.test(e.target.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;if(e.code==='Space'){e.preventDefault();play();}else if(e.key.toLowerCase()==='n')nextRecord(1);else if(e.key.toLowerCase()==='p')nextRecord(-1);});window.addEventListener('resize',drawWave);window.addEventListener('beforeunload',()=>{clearTimeout(saveTimer);persist();});
renderList();if(visible.length)selectRecord(visible[0].record_id);persist();
