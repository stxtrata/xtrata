import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {endpoint,balanceOf} from '../../harness/wizards/play.mjs';
import {Cl} from '@stacks/transactions';
const addr='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const ep=await endpoint();
const output={testedAt:new Date().toISOString(),readings:{}};
for(const [contract,fn,args] of [['xchess-core-v1-canary','get-open-fee',[]],['xchess-core-v1-canary','get-sponsor-price',[]],['xchess-core-v1-canary','get-game-count',[]],['xtrata-v3-2-3','get-fee-unit',[]],['xtrata-v3-2-3','get-inscription-meta',[Cl.serialize(Cl.uint(3037))]]]){
 const r=await ep.request(`/v2/contracts/call-read/${addr}/${contract}/${fn}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sender:addr,arguments:args})});const j=await r.json();if(!j.okay)throw Error(JSON.stringify(j));output.readings[contract+'/'+fn]=Cl.deserialize(j.result);
}
const registry='SPARQA0T0GWJZADHRMGNVTJ51D014V8P7XPDSTNH.xchess-peer-v1';
const source=await ep.request('/v2/contracts/source/'+registry.replace('.','/')+'?proof=0');output.registry={contract:registry,status:source.status};if(source.ok){const j=await source.json();output.registry.sourceMatches=j.source===readFileSync('contracts/xchess-peer-v1.clar','utf8');}
writeFileSync('reviews/3037/preflight.json',JSON.stringify(output,(_,v)=>typeof v==='bigint'?v.toString():v,2)+'\n');console.log(JSON.stringify(output,(_,v)=>typeof v==='bigint'?v.toString():v,2));
