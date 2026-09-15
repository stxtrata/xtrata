#!/usr/bin/env node
/** Paused, unminted collection replacement: stage first; cleanup only after chain verification. */
import{readFile,writeFile,rename}from'node:fs/promises';
import{createHash}from'node:crypto';
import{dirname,resolve,join}from'node:path';
import{fileURLToPath}from'node:url';
import{createRequire}from'node:module';
import{loadWizardEnv,killSwitchEngaged}from'./inscribe.mjs';
const root=dirname(fileURLToPath(import.meta.url)),project=resolve(root,'../..'),state=join(root,'.collection-v15'),media=resolve(project,'../media');
const T=createRequire(join(project,'contracts/clarinet/package.json'))('@stacks/transactions'),{Cl}=T;
const phase=process.argv[2]||'stage';if(!['stage','cleanup'].includes(phase))throw new Error('Use stage or cleanup.');
loadWizardEnv();for(const path of['.env.local','.env'])loadWizardEnv({path:join(project,path)});
const json=async p=>JSON.parse(await readFile(p,'utf8')),sha=b=>createHash('sha256').update(b).digest('hex');
const config=await json(join(state,'config.json')),active=await json(join(state,'staging.json')),optimized=await json(join(media,'wizard-numbered-jpegs-optimized/manifest.json')),original=await json(join(media,'wizard-numbered-jpegs/manifest.json'));
const helper=config.address+'/'+config.contractName,origin='https://xtrata.xyz',base='/collections/'+active.collectionId;
const api=async(path,options={})=>{const r=await fetch(new URL(path,origin),{...options,signal:AbortSignal.timeout(30000)});if(!r.ok){const e=new Error('Collection API HTTP '+r.status);e.status=r.status;throw e;}return r.json();};
const read=async(name,args=[])=>{const r=await fetch('https://api.hiro.so/v2/contracts/call-read/'+helper+'/'+name,{method:'POST',signal:AbortSignal.timeout(30000),headers:{'Content-Type':'application/json',...(process.env.HIRO_API_KEY?{'x-api-key':process.env.HIRO_API_KEY}:{})},body:JSON.stringify({sender:config.address,arguments:args.map(T.cvToHex)})});if(!r.ok)throw new Error('Chain read unavailable');const v=await r.json();if(!v.okay)throw new Error('Chain read failed');return T.hexToCV(v.result);};
const expect=(a,b)=>{if(T.cvToHex(a)!==T.cvToHex(b))throw new Error('Replacement safety check failed.');};
const guard=async()=>{if(killSwitchEngaged())throw new Error('Kill switch engaged.');expect(await read('is-paused'),Cl.ok(Cl.bool(true)));expect(await read('get-minted-count'),Cl.ok(Cl.uint(0)));expect(await read('get-reserved-count'),Cl.ok(Cl.uint(0)));const collection=await api(base);if(collection.state!=='draft'||collection.artist_address!==config.address)throw new Error('Only the dedicated draft can be replaced.');};
await guard();
let journal=await json(join(state,'replacement.json')).catch(e=>{if(e.code==='ENOENT')return {collectionId:active.collectionId,old:active,assets:{}};throw e;});
if(journal.collectionId!==active.collectionId)throw new Error('Collection identity mismatch.');
const save=async()=>{await writeFile(join(state,'replacement.json.tmp'),JSON.stringify(journal,null,2)+'\n',{mode:0o600});await rename(join(state,'replacement.json.tmp'),join(state,'replacement.json'));};
// A complete, byte-verified local backup is a prerequisite for any replacement action.
for(const item of original.items){if(sha(await readFile(join(media,'wizard-numbered-jpegs',item.filename)))!==item.sha256)throw new Error('Original backup differs.');}
if(phase==='stage'){
 for(const item of optimized.items){
  const bytes=await readFile(join(media,'wizard-numbered-jpegs-optimized',item.filename));if(sha(bytes)!==item.sha256)throw new Error('Optimized bytes differ.');
  const filename=item.filename.replace('.jpg','-128.jpg');
  const current=await api(base+'/assets');let asset=current.find(a=>a.filename===filename);
  if(asset&&(asset.expected_hash.replace(/^0x/,'')!==item.rollingHash||asset.total_bytes!==bytes.length))throw new Error('Replacement asset differs.');
  if(!asset){let intent=journal.assets[item.filename]?.intent;if(!intent){intent=await api(base+'/upload-url');journal.assets[item.filename]={intent};await save();}
   const url=new URL(intent.uploadUrl,origin);if(url.origin!==origin)throw new Error('Unexpected upload origin');
   const uploaded=await api(url.href,{method:'PUT',headers:{'Content-Type':'image/jpeg'},body:bytes});
   asset=await api(base+'/assets',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({filename,path:filename,mimeType:'image/jpeg',totalBytes:bytes.length,totalChunks:1,expectedHash:item.rollingHash,storageKey:uploaded.key||intent.key,editionCap:1})});}
  const preview=origin+base+'/asset-preview?assetId='+asset.asset_id;const r=await fetch(preview);if(!r.ok||sha(Buffer.from(await r.arrayBuffer()))!==item.sha256)throw new Error('Replacement preview differs.');
  journal.assets[item.filename]={...journal.assets[item.filename],assetId:asset.asset_id,filename,rollingHash:item.rollingHash,previewUrl:preview,tokenUri:'data:application/json,'+JSON.stringify({name:String(item.number),image:preview}),verified:true};await save();console.log(filename+': replacement verified');
 }
 journal.staged=true;await save();
}else{
 const chain=await json(join(state,'journal.json'));if(!chain.replacementComplete)throw new Error('On-chain replacement is not confirmed.');
 for(const item of original.items)expect(await read('get-registered-token-uri',[Cl.bufferFromHex(item.rollingHash)]),Cl.none());
 for(const item of optimized.items){const asset=journal.assets[item.filename];expect(await read('get-registered-token-uri',[Cl.bufferFromHex(item.rollingHash)]),Cl.some(Cl.tuple({'token-uri':Cl.stringAscii(asset.tokenUri)})));const r=await fetch(asset.previewUrl);if(!r.ok||sha(Buffer.from(await r.arrayBuffer()))!==item.sha256)throw new Error('Replacement preview no longer matches.');}
 await guard();
 for(const old of Object.values(journal.old.assets)){
  if(old.removed)continue;
  const list=await api(base+'/assets');
  if(list.some(a=>a.asset_id===old.assetId)){
   const result=await api(base+'/assets?assetId='+encodeURIComponent(old.assetId),{method:'DELETE'});
   if(!result.deleted||!result.storageObjectDeleted)throw new Error('Old asset deletion not fully confirmed; inspect storage before retrying.');
  }else{throw new Error('Old record disappeared without a journaled deletion acknowledgement; inspect storage before marking complete.');}
  old.removed=true;await save();console.log('Removed superseded staging asset '+old.assetId);
 }
 const list=await api(base+'/assets');if(JSON.stringify(list.map(a=>a.expected_hash.replace(/^0x/,'')).sort())!==JSON.stringify(optimized.items.map(a=>a.rollingHash).sort()))throw new Error('Final staged hashes differ.');if(list.length!==10||list.reduce((n,a)=>n+a.total_bytes,0)!==optimized.items.reduce((n,a)=>n+a.bytes,0))throw new Error('Final staging inventory mismatch.');
 journal.complete=true;await save();await writeFile(join(state,'staging.json'),JSON.stringify({collectionId:journal.collectionId,pageUrl:active.pageUrl,complete:true,profile:'optimized-128',assets:journal.assets},null,2)+'\n',{mode:0o600});
 console.log('Replacement complete; ten optimized files, originals preserved locally, no inscriptions.');
}
