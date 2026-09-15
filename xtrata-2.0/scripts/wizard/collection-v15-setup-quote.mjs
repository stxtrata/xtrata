#!/usr/bin/env node
// Read-only quote: unsigned transactions only. No vault access and no broadcast.
import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import{fileURLToPath}from'node:url';
import{loadWizardEnv}from'./inscribe.mjs';
const root=dirname(fileURLToPath(import.meta.url)),project=join(root,'../..');
const T=createRequire(join(project,'contracts/clarinet/package.json'))('@stacks/transactions'),{Cl}=T;
loadWizardEnv();
for(const file of ['.env.local','.env'])loadWizardEnv({path:join(project,file)});
const config=JSON.parse(await readFile(join(root,'.collection-v15/config.json'),'utf8'));
const api=(process.env.COLLECTION_WIZARD_API_URL||'https://api.hiro.so').replace(/\/$/,'');
const request=async(path,options={})=>{const r=await fetch(api+path,{...options,signal:AbortSignal.timeout(30000),headers:{...(process.env.HIRO_API_KEY?{'x-api-key':process.env.HIRO_API_KEY}:{}),...options.headers}});if(!r.ok)throw new Error('Quote API HTTP '+r.status+' '+await r.text());return r.json();};
const info=await request('/v2/info');if(info.network_id!==1)throw new Error('Not mainnet');
const balance=await request(`/v2/accounts/${config.address}?proof=0`);
const opts={publicKey:'0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',network:'mainnet',nonce:0n,fee:0n,postConditionMode:T.PostConditionMode.Deny,postConditions:[]};
const plans=[['Deploy helper',await T.makeUnsignedContractDeploy({...opts,contractName:config.contractName,codeBody:await readFile(join(project,'contracts/live/xtrata-collection-mint-v1.5.clar'),'utf8'),clarityVersion:T.ClarityVersion.Clarity4})]];
for(const [name,args]of [['set-max-supply',[Cl.uint(10)]],['set-collection-metadata',[Cl.stringAscii('Numbers 1-10'),Cl.stringAscii('NUM10'),Cl.stringAscii(''),Cl.stringAscii('Ten numbered JPEGs. Collection setup test.'),Cl.uint(0)]],['set-mint-price',[Cl.uint(0)]],['set-registered-token-uri',[Cl.buffer(new Uint8Array(32)),Cl.stringAscii('x'.repeat(256))]],['set-paused',[Cl.bool(false)]]])plans.push([name,await T.makeUnsignedContractCall({...opts,contractAddress:config.address,contractName:config.contractName,functionName:name,functionArgs:args})]);
const quotes=[];
for(const [name,tx]of plans){
 const raw=tx.serialize();
 try {
  const q=await request('/v2/fees/transaction',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({transaction_payload:T.serializePayload(tx.payload),estimated_len:typeof raw==='string'?raw.length/2:raw.length})});
  const fee=q.estimations?.[1]?.fee;if(!Number.isSafeInteger(fee)||fee<=0)throw new Error('Invalid quote');
  quotes.push({name,count:name==='set-registered-token-uri'?10:1,minerFeeUstx:fee});
 }catch(error){if(!error.message.includes('NoEstimateAvailable'))throw error;quotes.push({name,count:name==='set-registered-token-uri'?10:1,minerFeeUstx:null,reason:'NoEstimateAvailable'});}
}
const available=quotes.every(q=>q.minerFeeUstx!==null);
const total=available?quotes.reduce((n,q)=>n+q.count*q.minerFeeUstx,0):null;
const ceiling=quotes.reduce((n,q)=>n+q.count*Number(config.maxTxFeeUstx),0);
const report={address:config.address,timestamp:new Date().toISOString(),balanceUstx:String(BigInt(balance.balance)),quotes,totalMinerUstx:total,protocolFeesUstx:0,recommendedFundingUstx:Math.ceil(((available?total*1.5:ceiling)+100000)/1000000)*1000000,basis:available?'live estimates plus margin':'per-transaction configured ceiling; not an actual cost estimate',scope:'helper deployment, metadata, supply, zero price, 10 registrations and eventual unpause; no inscriptions; registration quotes use maximum URI length'};
await writeFile(join(root,'.collection-v15/setup-quote.json'),JSON.stringify(report,null,2)+'\n',{mode:0o600});console.log(JSON.stringify(report,null,2));
