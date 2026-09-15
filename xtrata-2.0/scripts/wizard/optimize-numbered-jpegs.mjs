#!/usr/bin/env node
/** Prepare smaller replacement candidates without touching staged/on-chain inventory. */
import sharp from 'sharp';
import{createHash}from'node:crypto';
import{readFile,writeFile,mkdir}from'node:fs/promises';
import{resolve,join,dirname}from'node:path';
import{fileURLToPath}from'node:url';
export async function optimizeNumberedJpegs(source,output){
 if(resolve(source)===resolve(output))throw new Error('Keep the originals in a separate directory.');
 const original=JSON.parse(await readFile(join(source,'manifest.json'),'utf8'));
 if(original.items.length!==10)throw new Error('Expected ten numbered originals.');
 await mkdir(output,{recursive:true});
 const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
 const items=[];
 for(const item of original.items){
  if(item.filename!==`${String(item.number).padStart(2,'0')}.jpg`)throw new Error('Unexpected fixture filename.');
  const before=await readFile(join(source,item.filename));
  if(hash(before)!==item.sha256)throw new Error('Original fixture changed.');
  const bytes=await sharp(before).resize(128,128).greyscale().jpeg({quality:60,mozjpeg:true}).toBuffer();
  if(bytes.length>=before.length||bytes.length>16384)throw new Error('Optimization did not produce a smaller single-chunk JPEG.');
  await writeFile(join(output,item.filename),bytes);
  items.push({...item,width:128,height:128,bytes:bytes.length,chunks:1,sha256:hash(bytes),rollingHash:createHash('sha256').update(Buffer.alloc(32)).update(bytes).digest('hex'),tokenUri:null});
 }
 const manifest={...original,state:'optimized local candidates; not uploaded or registered',items};
 await writeFile(join(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 return {beforeBytes:original.items.reduce((n,i)=>n+i.bytes,0),afterBytes:items.reduce((n,i)=>n+i.bytes,0),items};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const media=resolve(dirname(fileURLToPath(import.meta.url)),'../../../media');
 const result=await optimizeNumberedJpegs(join(media,'wizard-numbered-jpegs'),join(media,'wizard-numbered-jpegs-optimized'));
 console.log(JSON.stringify({beforeBytes:result.beforeBytes,afterBytes:result.afterBytes,reductionPercent:Number((100*(1-result.afterBytes/result.beforeBytes)).toFixed(1)),state:'Local candidates only. Existing staging and registrations unchanged.'},null,2));
}
