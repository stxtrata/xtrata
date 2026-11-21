import {store} from './state.js';
import {prepareDependencyPackage,serializeChainDraft,prepareChainPublication} from './chain-publishing.js';
import {SOURCE_HASH_VERSION,projectFingerprint,draftMatchesProject,validatePublishingDraft,savePublishingDraft,loadPublishingDraft,CHAIN_DRAFT_MAX_BYTES} from './chain-draft-storage.js';
import {prepareInscription} from './publish.js';
import {downloadBlob} from './audio-utils.js';
import {zipFiles} from './zip-files.js';
import {el,action,row,textField,choice} from './pro-ui.js';

export function mount(root){
  let draft=null,prepared=null,controller=null,disposed=false,network='mainnet',contractId='',revision=0,draftRevision=null;
  let saveTimer=null,maxSaveTimer=null,saveQueue=Promise.resolve(),draftGeneration=0;
  const message=el('p','Prepare the runtime and sounds first.',{role:'status'}),saved=el('p','',{role:'status','aria-live':'polite'}),body=el('div'),manualReview=el('div'),input=el('input',null,{type:'file',accept:'.json,application/json',hidden:true});
  root.append(el('h2','On-chain publishing'),el('p','A chain song stores the musical instructions and immutable references to its runtime and sounds. Prepare those dependencies, inscribe them through the normal review, then enter their confirmed IDs here. Verification must pass before a song can be published.',{className:'pro-help'}),row(choice('Network',['mainnet','testnet'],network,v=>network=v),textField('Xtrata contract',contractId,v=>contractId=v)),row(action('Prepare dependencies',()=>run(prepare)),action('Open saved publishing draft',()=>input.click()),action('Cancel',()=>controller?.abort())),message,saved,manualReview,body,input);
  async function run(fn){if(controller)throw Error('Wait for preparation or cancel it.');controller=new AbortController();try{await fn(controller.signal);}catch(error){message.textContent=error.name==='AbortError'?'Cancelled.':error.message;if(error.code==='HANDOFF_STORAGE'&&['/wizard/','/inscribe'].includes(error.manualReviewUrl)){manualReview.replaceChildren(el('p','Your publishing draft is saved. Download the dependency package and extract its files, or download the prepared instruction song, then choose those files in review.'),action('Open review for manual upload',()=>window.location.assign(error.manualReviewUrl)));}}finally{controller=null;}}
  function clearSaveTimers(){clearTimeout(saveTimer);clearTimeout(maxSaveTimer);saveTimer=maxSaveTimer=null;}
  function persistNow(){
    clearSaveTimers();if(!draft)return Promise.resolve();
    let snapshot;try{snapshot=validatePublishingDraft(draft);}catch(error){saved.textContent=error.message;return Promise.reject(error);}
    const generation=draftGeneration;
    const task=saveQueue.catch(()=>{}).then(()=>savePublishingDraft(snapshot));saveQueue=task;
    task.then(()=>{if(!disposed&&generation===draftGeneration)saved.textContent='Publishing draft saved in this browser. Dependency files must be prepared again after a reload.';},error=>{if(!disposed)saved.textContent=error.message;});
    return task;
  }
  function queueSave(){
    saved.textContent='Saving publishing draft…';clearTimeout(saveTimer);
    saveTimer=setTimeout(()=>{persistNow().catch(()=>{});},250);
    if(!maxSaveTimer)maxSaveTimer=setTimeout(()=>{persistNow().catch(()=>{});},1000);
  }
  function changed(){prepared=null;draftGeneration++;queueSave();}
  function reuseReferences(previous,next){
    const old=[previous?.manifest?.runtime,...previous?.manifest?.assets||[]].filter(Boolean);
    for(const ref of [next.manifest.runtime,...next.manifest.assets]){
      const same=old.find(item=>item.network===ref.network&&item.sha256===ref.sha256&&item.bytes===ref.bytes&&item.mediaType===ref.mediaType&&item.version===ref.version);
      if(same){ref.contractId=same.contractId;ref.tokenId=same.tokenId;}
    }
  }
  async function prepare(signal){
    manualReview.replaceChildren();prepared=null;const generation=revision,source=structuredClone(store.project),hash=await projectFingerprint(source);
    const candidate=await prepareDependencyPackage(source,{network,contractId,signal,onProgress:p=>message.textContent=`Preparing sound ${p.completed}/${p.total}…`});
    if(generation!==revision||disposed||store.project.projectId!==source.projectId)throw Error('The project changed. Prepare its dependencies again.');
    reuseReferences(draft,candidate);Object.assign(candidate,{sourceProjectId:source.projectId,sourceProjectHash:hash,sourceHashVersion:SOURCE_HASH_VERSION});
    draft=candidate;draftRevision=revision;draftGeneration++;paint();await persistNow();
    message.textContent=`Prepared ${draft.manifest.assets.length} unique sounds and one playback runtime. Matching confirmed references were kept; these files still need inscription review.`;
  }
  async function assertCurrent(){
    const candidate=draft,generation=revision;
    if(draftRevision!==null&&draftRevision!==revision||!await draftMatchesProject(candidate,store.project)||generation!==revision||candidate!==draft)throw Error('The project changed or this draft has no matching project fingerprint. Prepare dependencies again; confirmed references with matching bytes will be kept.');
  }
  function referenceField(label,value,update){const field=textField(label,value,update);field.querySelector('input').addEventListener('input',event=>update(event.target.value));return field;}
  function paint(){
    body.replaceChildren();if(!draft)return;
    const refs=[['Playback runtime',draft.manifest.runtime],...draft.manifest.assets.map(a=>[a.id,a])];
    body.append(el('p','Enter the chain locations returned after each inscription completes. Identical sounds are stored once and reused. References and the prepared project snapshot save locally as you edit.'));
    for(const [label,ref]of refs){const card=el('section',null,{className:'pro-take'});card.append(el('strong',label),el('p',`${(ref.bytes/1024).toFixed(1)} KiB · SHA-256 ${ref.sha256}`,{style:'overflow-wrap:anywhere'}),row(referenceField('Contract',ref.contractId,v=>{ref.contractId=v;changed();}),referenceField('Inscription ID',ref.tokenId,v=>{ref.tokenId=v.trim();changed();})));body.append(card);}
    body.append(row(
      action('Save publishing draft',()=>run(async()=>{downloadBlob(new Blob([serializeChainDraft(draft)],{type:'application/json'}),'audionaut-publishing-draft.json');await persistNow();})),
      action('Download dependency package',()=>run(async signal=>{if(!draft.files?.length)throw Error('Re-prepare this project to download its dependency files. Confirmed references with matching bytes will be kept.');const files=[...draft.files,{name:'audionaut-publishing-draft.json',blob:new Blob([serializeChainDraft(draft)],{type:'application/json'})}];downloadBlob(await zipFiles(files,{signal}),'audionaut-chain-dependencies.zip');})),
      action('Review dependency inscriptions',()=>run(async()=>{
        if(!draft.files?.length)throw Error('Re-prepare this project to recover its dependency files. Confirmed references with matching bytes will be kept.');
        await assertCurrent();const candidate=draft,generation=revision;await persistNow();
        const files=draft.files.map(f=>new File([f.blob],f.name,{type:f.blob.type})),url=await prepareInscription(files);
        if(candidate!==draft||generation!==revision||disposed)throw Error('The project changed. Prepare its dependencies again.');
        await persistNow();if(candidate!==draft||generation!==revision||disposed)throw Error('The project changed. Prepare its dependencies again.');window.location.assign(url);
      })),
      action('Verify and prepare song',()=>run(async signal=>{
        prepared=null;const generation=revision;await assertCurrent();const candidate=draft,snapshot=serializeChainDraft(candidate);
        const result=await prepareChainPublication(candidate,{signal,onProgress:p=>message.textContent=`Verifying dependency ${p.completed}/${p.total}…`});
        if(generation!==revision||candidate!==draft||snapshot!==serializeChainDraft(draft)||disposed){prepared=null;throw Error('The draft changed. Verify it again.');}
        prepared=result;message.textContent='Every dependency matched its chain bytes. The instruction song is ready for inscription review.';
      })),
      action('Download instruction song',()=>{if(!prepared)throw Error('Verify and prepare the song first.');downloadBlob(prepared,prepared.name);}),
      action('Review song inscription',()=>run(async()=>{
        if(!prepared)throw Error('Verify and prepare the song first.');await assertCurrent();const file=prepared;await persistNow();
        const url=await prepareInscription(file);if(prepared!==file||disposed)throw Error('The prepared song changed. Verify it again.');
        await persistNow();if(prepared!==file||disposed)throw Error('The prepared song changed. Verify it again.');window.location.assign(url);
      }))
    ));
  }
  input.onchange=()=>run(async()=>{
    const file=input.files[0];input.value='';if(!file)return;if(file.size>CHAIN_DRAFT_MAX_BYTES)throw Error('Publishing draft exceeds 64 MiB.');
    const value=validatePublishingDraft(JSON.parse(await file.text()));draft=value;draftRevision=null;prepared=null;draftGeneration++;paint();
    const matches=await draftMatchesProject(value,store.project);if(matches)draftRevision=revision;
    await persistNow();message.textContent=matches?'Publishing draft opened. Verify its dependencies before publishing.':'Publishing draft opened. Its project differs or its fingerprint is missing. Prepare dependencies again; matching confirmed references will be kept.';
  });
  const off=store.on('dirty',()=>{revision++;if(draft)message.textContent='The project changed. Prepare a new dependency draft to include the edits.';prepared=null;});
  const sourceId=store.project.projectId,initialRevision=revision;
  loadPublishingDraft(sourceId).then(async value=>{
    if(!value||disposed||draft||controller||initialRevision!==revision||sourceId!==store.project.projectId)return;
    const matches=await draftMatchesProject(value,store.project);
    if(disposed||draft||controller||initialRevision!==revision||sourceId!==store.project.projectId)return;
    draft=value;draftRevision=matches?revision:null;draftGeneration++;network=value.manifest.network;contractId=value.manifest.runtime.contractId;
    root.querySelector('select[aria-label="Network"]').value=network;root.querySelector('input[aria-label="Xtrata contract"]').value=contractId;
    paint();message.textContent=matches?'Publishing draft restored. Confirmed references and its project snapshot were recovered. Verify before publishing; re-prepare if you need dependency files.':'Publishing draft restored, but the project changed. Prepare dependencies again; matching confirmed references will be kept.';
    saved.textContent='Recovered from this browser.';
  }).catch(error=>{if(!disposed)saved.textContent=error.message;});
  const flush=()=>{if(saveTimer||maxSaveTimer)persistNow().catch(()=>{});};window.addEventListener('pagehide',flush);
  return()=>{flush();disposed=true;clearSaveTimers();controller?.abort();off();window.removeEventListener('pagehide',flush);};
}
