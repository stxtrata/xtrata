// Transactional revision metadata, immutable document bodies and binary audio.
import { PROJECT_DATABASE } from './storage-config.js';
import { assetIds, newProjectId } from './assets.js';
const MAX_PROJECTS = 12, MAX_VERSIONS = 5;
let opening;
const request = req => new Promise((resolve, reject) => { req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error); });
const finished = tx => new Promise((resolve, reject) => { tx.oncomplete = resolve; tx.onabort = tx.onerror = () => reject(tx.error || Error('Browser storage transaction failed.')); });
async function database() {
  if (!globalThis.indexedDB) throw Error('Browser recovery is unavailable. Download a project file to keep your work.');
  if (!opening) opening = new Promise((resolve, reject) => {
    const req = indexedDB.open(PROJECT_DATABASE, 2);
    req.onupgradeneeded = () => {
      const db = req.result, tx = req.transaction;
      for (const name of ['versions', 'documents', 'assets']) if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, {keyPath:'id'});
      if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', {keyPath:'key'});
      const versions = tx.objectStore('versions');
      if (!versions.indexNames.contains('projectId')) versions.createIndex('projectId', 'projectId');
      if (!versions.indexNames.contains('order')) versions.createIndex('order', 'order');
      // Earlier recovery rows contained their document inline. Move it without touching audio.
      versions.openCursor().onsuccess = event => {
        const cursor = event.target.result; if (!cursor) return;
        const value = cursor.value;
        if (value.project) {
          tx.objectStore('documents').put({id:value.id, project:value.project});
          delete value.project; value.order ||= value.updatedAt; value.parentId ||= null;
          cursor.update(value);
        }
        cursor.continue();
      };
    };
    req.onsuccess = () => { const db = req.result; db.onversionchange = () => { db.close(); opening = null; }; resolve(db); };
    req.onerror = () => { opening = null; reject(req.error); };
    req.onblocked = () => { opening = null; reject(Error('Close the other Beta Pro tab to upgrade recovery storage.')); };
  });
  return opening;
}
async function fingerprint(project) {
  const copy = {...project}; delete copy.currentSequence;
  const bytes = new TextEncoder().encode(JSON.stringify(copy));
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(hash)].map(v=>v.toString(16).padStart(2,'0')).join('');
}
function bounded(records) {
  const groups = new Map(), keep = [];
  for (const record of records.sort((a,b)=>(b.order||b.updatedAt)-(a.order||a.updatedAt))) {
    // Named versions and unresolved conflict branches are never silently discarded.
    if (record.pinned) { keep.push(record); continue; }
    if (!groups.has(record.projectId)) { if (groups.size >= MAX_PROJECTS) continue; groups.set(record.projectId,0); }
    if (groups.get(record.projectId) >= MAX_VERSIONS) continue;
    groups.set(record.projectId,groups.get(record.projectId)+1); keep.push(record);
  }
  return keep;
}
export async function saveProjectRevision(project, assets, {isActive=()=>true, baseRevisionId=null, sessionId='', pin=false, name='', reason='autosave',_attempt=0}={}) {
  const hash = await fingerprint(project), db = await database();
  // WebKit private/ephemeral databases can reject Blob records. ArrayBuffers are
  // portable binary values. Convert only absent assets, outside the write transaction.
  const known=new Set(await request(db.transaction('assets').objectStore('assets').getAllKeys()));
  const binary=new Map(await Promise.all(assets.filter(a=>!known.has(a.id)).map(async a=>[a.id,a.blob?{id:a.id,buffer:await a.blob.arrayBuffer(),mime:a.mime||a.blob.type,bytes:a.blob.size}:a])));
  const tx = db.transaction(['versions','documents','assets','meta'],'readwrite'), done=finished(tx);
  const versions=tx.objectStore('versions'), documents=tx.objectStore('documents'), audio=tx.objectStore('assets'), meta=tx.objectStore('meta');
  try {
    const [existing, oldAssetIds, counter] = await Promise.all([request(versions.getAll()),request(audio.getAllKeys()),request(meta.get('revision-order'))]);
    const present=new Set(oldAssetIds);
    if(assets.some(a=>!present.has(a.id)&&!binary.has(a.id))){const error=new Error('Audio storage changed during checkpoint.');error.retryAssets=true;throw error;}
    if([...assetIds(project)].some(id=>!present.has(id)&&!binary.has(id)))throw new Error('An embedded audio asset is missing; the previous recovery version was retained.');
    const head = existing.filter(r=>r.projectId===project.projectId).sort((a,b)=>(b.order||b.updatedAt)-(a.order||a.updatedAt))[0];
    if (head?.hash === hash && !(pin&&head.pinned&&name&&name!==head.name)) {
      if (pin || name) { head.pinned=true; head.name=String(name||head.name||'Named version').slice(0,160); versions.put(head); }
      if (isActive()) meta.put({key:'active',value:head.id});
      await done; return {...head, deduplicated:true};
    }
    const conflict = !!head && head.id !== baseRevisionId;
    const projectId = conflict ? newProjectId() : project.projectId;
    const copy = structuredClone(project); copy.projectId=projectId;
    if (conflict) copy.projectName=`${copy.projectName || 'Untitled'} (conflict copy)`;
    const order = Math.max(counter?.value || 0, ...existing.map(r=>r.order||0), 0)+1;
    const record={id:newProjectId(),projectId,projectName:copy.projectName,updatedAt:Date.now(),order,
      parentId:baseRevisionId,sessionId,hash:conflict?awaitlessHash(hash):hash,assetIds:[...assetIds(copy)],
      pinned:!!pin||conflict,name:String(name|| (conflict?'Conflicting session preserved':'')).slice(0,160),reason,
      ...(conflict?{conflictOf:project.projectId,conflictingHead:head.id}:{})};
    // Preserve the competing head too; neither side can disappear before review.
    if (conflict) { head.pinned=true; head.name ||= 'Preserved before conflicting session'; versions.put(head); }
    const kept=bounded([record,...existing]), keptIds=new Set(kept.map(r=>r.id));
    versions.put(record); documents.put({id:record.id,project:copy}); meta.put({key:'revision-order',value:order});
    for (const old of existing) if (!keptIds.has(old.id)) { versions.delete(old.id); documents.delete(old.id); }
    const refs=new Set(kept.flatMap(r=>r.assetIds));
    for (const asset of assets) if (!present.has(asset.id)) { audio.add(binary.get(asset.id)); present.add(asset.id); }
    for (const id of oldAssetIds) if (!refs.has(id)) audio.delete(id);
    if (isActive()) meta.put({key:'active',value:record.id});
    await done; return record;
  } catch(error) { try{tx.abort();}catch{} await done.catch(()=>{});if(error.retryAssets&&_attempt<2)return saveProjectRevision(project,assets,{isActive,baseRevisionId,sessionId,pin,name,reason,_attempt:_attempt+1});throw error; }
}
// A conflict copy changes identity/name; do not deduplicate its next checkpoint against the original hash.
const awaitlessHash = hash => `fork:${hash}`;
export async function listProjectRevisions() {
  const db=await database(), records=await request(db.transaction('versions').objectStore('versions').getAll());
  const seen=new Set(); return records.sort((a,b)=>(b.order||b.updatedAt)-(a.order||a.updatedAt)).map(r=>{
    const isLatest=!seen.has(r.projectId);seen.add(r.projectId);return {...r,isLatest};
  });
}
export async function loadProjectRevision(id=null) {
  const db=await database(), tx=db.transaction(['versions','documents','assets','meta']);
  if (!id) id=(await request(tx.objectStore('meta').get('active')))?.value;
  if (!id) return null;
  const record=await request(tx.objectStore('versions').get(id));
  if (!record) throw Error('That recovery version is no longer available.');
  const [body,assets]=await Promise.all([request(tx.objectStore('documents').get(id)),Promise.all(record.assetIds.map(key=>request(tx.objectStore('assets').get(key))))]);
  if (!body || assets.some(a=>!a)) throw Error('That recovery version has missing data; the current project was retained.');
  return {...record,project:body.project,assets:assets.map(asset=>{if(!asset.buffer)return asset;const {buffer,...metadata}=asset;return {...metadata,blob:new Blob([buffer],{type:asset.mime||'audio/octet-stream'})};})};
}
export async function pinProjectRevision(id,name,pinned=true) {
  const db=await database(),tx=db.transaction('versions','readwrite'),done=finished(tx),rows=tx.objectStore('versions');
  const row=await request(rows.get(id));if(!row)throw Error('Version no longer available.');
  row.pinned=!!pinned;row.name=String(name||row.name||'Named version').slice(0,160);rows.put(row);await done;return row;
}
export async function clearActiveProject({guard=()=>true,projectId=null}={}) {
  const db=await database(),tx=db.transaction(['meta','versions'],'readwrite'),done=finished(tx);
  const meta=tx.objectStore('meta'),active=await request(meta.get('active'));
  const record=active?await request(tx.objectStore('versions').get(active.value)):null;
  const unchanged=guard();if(unchanged&&(!projectId||!record||record.projectId===projectId))meta.delete('active');await done;return unchanged;
}
export async function deleteProjectRevisions(projectId) {
  const db=await database(),tx=db.transaction(['versions','documents','assets','meta'],'readwrite'),done=finished(tx);
  try {
    const rows=tx.objectStore('versions'),audio=tx.objectStore('assets'),meta=tx.objectStore('meta');
    const [records,keys,active]=await Promise.all([request(rows.getAll()),request(audio.getAllKeys()),request(meta.get('active'))]);
    const remaining=records.filter(r=>r.projectId!==projectId);
    for(const r of records)if(r.projectId===projectId){rows.delete(r.id);tx.objectStore('documents').delete(r.id);}
    const refs=new Set(remaining.flatMap(r=>r.assetIds));for(const id of keys)if(!refs.has(id))audio.delete(id);
    if(active&&!remaining.some(r=>r.id===active.value))meta.delete('active');await done;
  }catch(error){try{tx.abort();}catch{}await done.catch(()=>{});throw error;}
}
