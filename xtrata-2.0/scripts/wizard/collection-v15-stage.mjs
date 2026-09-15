#!/usr/bin/env node
/** Dedicated collection draft and R2/D1 staging only. No wallet or on-chain writes. */
import {readFile,writeFile,rename}from'node:fs/promises';
import{createHash}from'node:crypto';
import{dirname,join,resolve}from'node:path';
import{fileURLToPath}from'node:url';
const root=dirname(fileURLToPath(import.meta.url)),state=join(root,'.collection-v15'),origin='https://xtrata.xyz',slug='wizard-numbers-1-10';
const json=async p=>JSON.parse(await readFile(p,'utf8'));
const config=await json(join(state,'config.json')),chain=await json(join(state,'journal.json'));
if(chain.steps.deploy?.status!=='confirmed')throw new Error('Confirmed dedicated deployment required before staging.');
const manifest=await json(resolve(root,'../../../media/wizard-numbered-jpegs/manifest.json'));
const request=async(path,options={})=>{const r=await fetch(new URL(path,origin),{...options,signal:AbortSignal.timeout(30000)});if(!r.ok){const e=new Error(`Staging API ${r.status}: ${(await r.text()).slice(0,300)}`);e.status=r.status;throw e;}return r.json();};
const post=(path,value)=>request(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(value)});
const journal=await json(join(state,'staging.json')).catch(e=>{if(e.code==='ENOENT')return {assets:{}};throw e;});
const persist=async()=>{await writeFile(join(state,'staging.json.tmp'),JSON.stringify(journal,null,2)+'\n',{mode:0o600});await rename(join(state,'staging.json.tmp'),join(state,'staging.json'));};
let collection;
try{collection=await request('/collections/'+slug);}catch(e){if(e.status!==404)throw e;collection=await post('/collections',{slug,artistAddress:config.address,contractAddress:config.address+'.'+config.contractName,displayName:'Numbers 1–10',metadata:{templateVersion:'xtrata-collection-mint-v1.5',collection:{name:'Numbers 1-10',symbol:'NUM10',description:'Ten numbered JPEGs staged for buyer minting.'},mintType:'standard',contractName:config.contractName,contractId:config.address+'.'+config.contractName,coreContractId:'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3',deployTxId:chain.steps.deploy.txid,collectionPage:{showOnPublicPage:false},description:'Ten simple numbered JPEGs. Staged off-chain for buyer minting.'}});}
if(collection.artist_address!==config.address || collection.contract_address!==config.address+'.'+config.contractName)throw new Error('Existing collection identity mismatch.');
await request('/collections/'+collection.id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({metadata:{templateVersion:'xtrata-collection-mint-v1.5',collection:{name:'Numbers 1-10',symbol:'NUM10',description:'Ten numbered JPEGs staged for buyer minting.'},collectionPage:{showOnPublicPage:false,description:'Numbers 1-10 — staged in R2 for buyer minting. No artwork has been inscribed yet.'}}})});
journal.collectionId=collection.id;journal.pageUrl=origin+'/collection/'+slug;await persist();
const base='/collections/'+collection.id;
for(const item of manifest.items){
 const bytes=await readFile(resolve(root,'../../../media/wizard-numbered-jpegs',item.filename));
 if(createHash('sha256').update(bytes).digest('hex')!==item.sha256)throw new Error('JPEG bytes changed.');
 const assets=await request(base+'/assets');
 let asset=assets.find(a=>a.filename===item.filename);
 if(asset && (asset.expected_hash.replace(/^0x/,'')!==item.rollingHash || asset.total_bytes!==bytes.length))throw new Error('Existing staged asset differs.');
 if(!asset){
  let intent=journal.assets[item.filename]?.intent;
  if(!intent){intent=await request(base+'/upload-url');journal.assets[item.filename]={intent};await persist();}
  const target=new URL(intent.uploadUrl,origin);
  if(target.origin!==origin)throw new Error('Unexpected upload destination; refusing to send fixtures.');
  const uploaded=await request(target.href,{method:'PUT',headers:{'Content-Type':'image/jpeg'},body:bytes});
  asset=await post(base+'/assets',{path:item.filename,filename:item.filename,mimeType:'image/jpeg',totalBytes:bytes.length,totalChunks:item.chunks,expectedHash:item.rollingHash,storageKey:uploaded.key||intent.key,editionCap:1});
 }
 const preview=origin+base+'/asset-preview?assetId='+asset.asset_id;
 const response=await fetch(preview,{signal:AbortSignal.timeout(30000)});
 if(!response.ok||createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex')!==item.sha256)throw new Error('Staged preview byte verification failed.');
 journal.assets[item.filename]={...journal.assets[item.filename],assetId:asset.asset_id,rollingHash:item.rollingHash,previewUrl:preview,tokenUri:'data:application/json,'+JSON.stringify({name:String(item.number),image:preview}),verified:true};await persist();
 console.log(item.filename+': uploaded and byte-verified');
}
journal.complete=true;await persist();console.log('Draft mint page: '+journal.pageUrl);
