// Publishing recovery contains JSON metadata only, isolated from project/audio
// recovery and from wallet state. Files are regenerated or imported separately.
import {storageAssets,internProjectAssets} from './assets.js';
import {normalizeProjectModel} from './project-model.js';
import {normalizeOwner} from './plugins.js';
import {normalizeArp} from './arpeggiator.js';
import {isProInstrument,normalizeInstrumentConfig} from './pro-instruments-config.js';
import {scanProjectSources,validateChainReference,CHAIN_LIMITS} from './chain-manifest.js';

export const CHAIN_DRAFT_DB='audionaut-beta-chain-drafts';
export const CHAIN_DRAFT_MAX_BYTES=64*1024*1024;
const STORE='drafts',MAX_DRAFTS=20,HASH_VERSION=1;
const forbidden=new Set(['__proto__','prototype','constructor','wallet','wallets','privatekey','secretkey','mnemonic','seedphrase','recoveryphrase']);
const plain=value=>value&&typeof value==='object'&&!Array.isArray(value)&&[Object.prototype,null].includes(Object.getPrototypeOf(value));
function checkedJson(value){
  let nodes=0;const seen=new Set();
  function visit(item,depth=0){
    if(++nodes>CHAIN_LIMITS.maxNodes||depth>CHAIN_LIMITS.maxDepth)throw Error('Publishing draft exceeds its document limits.');
    if(item===null||typeof item==='string'||typeof item==='boolean')return;
    if(typeof item==='number'&&Number.isFinite(item))return;
    if(!Array.isArray(item)&&!plain(item)||seen.has(item))throw Error('Publishing drafts contain plain JSON metadata only.');
    seen.add(item);for(const [key,child]of Object.entries(item)){if(forbidden.has(key.toLowerCase()))throw Error('Publishing drafts cannot contain wallet secrets or unsafe fields.');visit(child,depth+1);}seen.delete(item);
  }
  visit(value);const text=JSON.stringify(value);if(new TextEncoder().encode(text).byteLength>CHAIN_DRAFT_MAX_BYTES)throw Error('Publishing draft exceeds 64 MiB.');return JSON.parse(text);
}
function id(value,label){if(typeof value!=='string'||!value.length||value.length>160)throw Error(`${label} needs a valid identifier.`);return value;}
function stable(value){if(Array.isArray(value))return value.map(stable);if(plain(value))return Object.fromEntries(Object.keys(value).sort().filter(key=>value[key]!==undefined).map(key=>[key,stable(value[key])]));return value;}
// Recovery changes local asset IDs and fills defaults. Hash their canonical
// content identities and the same musical defaults on both sides of a reload.
export async function canonicalPublishingProject(project){
  const copy=structuredClone(project);internProjectAssets(copy);
  const normalized=normalizeProjectModel((await storageAssets(copy)).project);
  for(const owner of [...normalized.channels,...normalized.instruments,...normalized.buses,normalized.master])normalizeOwner(owner);
  for(const channel of normalized.channels){channel.wordSelection??=null;channel.clipSnapshot??=null;channel.soundMetadata??=null;channel.gateSteps??=channel.soundMetadata?.loop?8:0;channel.sampleMidi??=null;}
  for(const instrument of normalized.instruments){instrument.arp=normalizeArp(instrument.arp);if(isProInstrument(instrument.synthId))instrument.sampleInstrument=normalizeInstrumentConfig(instrument.synthId,instrument.sampleInstrument);}
  normalized.playEmptySequences=!!normalized.playEmptySequences;normalized.lastPresetChannels??=0;
  for(const key of ['currentSequence','chain','format','clipSnapshotVersion','sourceProjectHash','sourceProjectId','sourceHashVersion'])delete normalized[key];
  return stable(normalized);
}
export async function projectFingerprint(project){
  const bytes=new TextEncoder().encode(JSON.stringify(await canonicalPublishingProject(project)));
  if(bytes.byteLength>CHAIN_DRAFT_MAX_BYTES)throw Error('The project exceeds the publishing draft size limit.');
  const hash=await crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(hash)].map(v=>v.toString(16).padStart(2,'0')).join('');
}
export function validatePublishingDraft(value){
  if(!plain(value)||value.format!=='audionaut-chain-draft/1')throw Error('Choose an AudioNaut publishing draft.');
  // In-memory preparations additionally own Blob files; intentionally never copy
  // them (nor arbitrary top-level fields) into the durable record.
  const draft=checkedJson(Object.fromEntries(['format','project','bindings','manifest','sourceProjectId','sourceProjectHash','sourceHashVersion'].filter(key=>value[key]!==undefined).map(key=>[key,value[key]])));
  if(!plain(draft.project)||!Array.isArray(draft.project.channels)||!Array.isArray(draft.project.instruments)||!Array.isArray(draft.project.sequences)||!plain(draft.bindings))throw Error('Publishing draft is missing its project or dependency bindings.');
  id(draft.project.projectId,'Draft project');
  if(draft.sourceProjectId!==undefined)id(draft.sourceProjectId,'Source project');
  if(draft.sourceProjectHash!==undefined&&(!/^[a-f0-9]{64}$/.test(draft.sourceProjectHash)||draft.sourceHashVersion!==HASH_VERSION||!draft.sourceProjectId))throw Error('Publishing draft has an invalid source-project fingerprint.');
  const m=draft.manifest;if(!plain(m)||m.format!=='audionaut-chain-manifest/1'||!['mainnet','testnet'].includes(m.network)||!Array.isArray(m.assets)||m.assets.length>4096)throw Error('Publishing draft has an invalid dependency manifest.');
  const placeholder=(m.network==='mainnet'?'SP':'ST')+'000000000000000000002Q6VF78.draft';
  const ref=(r,runtime=false)=>{
    if(!plain(r)||typeof r.contractId!=='string'||r.contractId.length>200||typeof r.tokenId!=='string'||r.tokenId.length>64)throw Error('Publishing draft has an invalid dependency location.');
    const allowed=runtime?['network','contractId','tokenId','sha256','bytes','mediaType','version']:['id','kind','network','contractId','tokenId','sha256','bytes','mediaType'];
    if(Object.keys(r).some(key=>!allowed.includes(key)))throw Error('Publishing draft has unsupported dependency metadata.');
    validateChainReference({...Object.fromEntries(Object.entries(r).filter(([key])=>!['id','kind'].includes(key))),contractId:placeholder,tokenId:'0'},{network:m.network});
    if(runtime&&!r.version)throw Error('Publishing draft is missing its playback runtime version.');
  };
  ref(m.runtime,true);let total=m.runtime.bytes;const ids=new Set();
  for(const asset of m.assets){ref(asset);if(!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,95}$/.test(asset.id)||ids.has(asset.id)||!['audio','impulse-response','wavetable','library','code','asset'].includes(asset.kind))throw Error('Publishing draft has invalid or duplicate dependency IDs.');ids.add(asset.id);total+=asset.bytes;}
  if(total>CHAIN_LIMITS.maxTotalBytes)throw Error('Publishing dependencies exceed the 512 MiB package limit.');
  const scan=scanProjectSources(draft.project);if(scan.unresolved.length)throw Error('Publishing draft has an unresolved resource: '+scan.unresolved[0].path);
  const paths=new Set(scan.sources.map(source=>source.path));
  for(const [path,asset]of Object.entries(draft.bindings))if(!paths.delete(path)||!ids.has(asset))throw Error('Publishing draft has an invalid dependency binding.');
  if(paths.size)throw Error('Publishing draft is missing a dependency binding.');
  return draft;
}
export async function draftMatchesProject(draft,project){return !!draft.sourceProjectHash&&draft.sourceHashVersion===HASH_VERSION&&draft.sourceProjectId===project.projectId&&draft.sourceProjectHash===await projectFingerprint(project);}
async function database(){
  return new Promise((resolve,reject)=>{
    let request;try{if(!globalThis.indexedDB)throw Error('IndexedDB is unavailable.');request=indexedDB.open(CHAIN_DRAFT_DB,1);}catch(error){reject(error);return;}
    let settled=false;const timer=setTimeout(()=>{settled=true;reject(Error('Publishing draft storage did not respond.'));},5000);
    request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains(STORE))request.result.createObjectStore(STORE,{keyPath:'projectId'});};
    request.onsuccess=()=>{clearTimeout(timer);if(settled){request.result.close();return;}const db=request.result;db.onversionchange=()=>db.close();resolve(db);};
    request.onerror=()=>{clearTimeout(timer);reject(request.error||Error('Publishing draft storage could not open.'));};
    request.onblocked=()=>{clearTimeout(timer);settled=true;reject(Error('Close another publishing tab and retry saving the draft.'));};
  });
}
function storageError(error){return new Error('Publishing draft could not be saved in this browser. Download a draft backup before leaving. '+(error?.message||''));}
export async function savePublishingDraft(value){
  const draft=validatePublishingDraft(value),projectId=draft.sourceProjectId||draft.project.projectId;let db;
  try{db=await database();await new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,'readwrite'),object=tx.objectStore(STORE);object.put({projectId,savedAt:Date.now(),draft});
    const request=object.getAll();request.onsuccess=()=>{const older=request.result.filter(record=>record.projectId!==projectId).sort((a,b)=>b.savedAt-a.savedAt);for(const record of older.slice(MAX_DRAFTS-1))object.delete(record.projectId);};
    tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error||Error('The draft save was interrupted.'));tx.onerror=()=>reject(tx.error||Error('The draft save failed.'));
  });return draft;}catch(error){throw storageError(error);}finally{db?.close();}
}
export async function loadPublishingDraft(projectId){
  id(projectId,'Project');let db;
  try{db=await database();const record=await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly'),request=tx.objectStore(STORE).get(projectId);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);tx.onabort=()=>reject(tx.error);});return record?validatePublishingDraft(record.draft):null;}
  catch(error){throw Error('Publishing draft recovery is unavailable. '+(error?.message||''));}finally{db?.close();}
}
export const SOURCE_HASH_VERSION=HASH_VERSION;
