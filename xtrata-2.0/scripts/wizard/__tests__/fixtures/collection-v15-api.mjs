// Offline integration transport. Unexpected endpoints fail; no network fallback.
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
const T=createRequire(new URL('../../../../contracts/clarinet/package.json',import.meta.url))('@stacks/transactions');
const {Cl}=T;
const config=JSON.parse(readFileSync(process.env.COLLECTION_WIZARD_STATE_DIR+'/config.json'));
const source=readFileSync(new URL('../../../../contracts/live/xtrata-collection-mint-v1.5.clar',import.meta.url),'utf8');
let nonce=0;
const minted=[],registered=new Map();
try {
 const journal=JSON.parse(readFileSync(process.env.COLLECTION_WIZARD_STATE_DIR+'/journal.json'));
 for(const step of Object.values(journal.steps)){
  const tx=T.deserializeTransaction(step.serialized); const args=tx.payload.functionArgs;
  if(tx.payload.functionName?.content==='set-registered-token-uri-batch')for(const entry of args[0].value)registered.set(T.cvToHex(entry.value.hash),entry.value['token-uri']);
  if(tx.payload.functionName?.content==='set-registered-token-uri-batch')for(const entry of args[0].value)registered.set(T.cvToHex(entry.value.hash),entry.value['token-uri']);
  if(tx.payload.functionName?.content==='mint-small-single-tx')minted.push({hash:T.cvToHex(args[1]),chunk:args[4].value[0]});
  nonce++;
 }
} catch(error){ if(error.code!=='ENOENT')throw error; }
const respond = x => new Response(JSON.stringify(x),{status:200});
globalThis.fetch=async (url,options={})=>{
 const path=new URL(url).pathname;
 if(path==='/v2/info')return respond({network_id:1,stacks_tip_height:10});
 if(path.startsWith('/v2/accounts/'))return respond({nonce,balance:'0x5f5e100'});
 if(path.endsWith('/nonces'))return respond({possible_next_nonce:nonce});
 if(path==='/v2/fees/transfer')return respond(1);
 if(path==='/v2/fees/transaction' && process.env.TEST_HIGH_FEE==='1' && nonce>0)return new Response(JSON.stringify({reason:'NoEstimateAvailable'}),{status:400});
 if(path==='/v2/fees/transaction')return respond({estimations:[{fee:1000},{fee:process.env.TEST_HIGH_FEE==='1'?46000000:2000}]});
 if(path==='/v2/transactions'){
  const tx=T.deserializeTransaction(Buffer.from(options.body).toString('hex'));
  const args=tx.payload.functionArgs;
  if(tx.payload.functionName?.content==='set-registered-token-uri-batch')for(const entry of args[0].value)registered.set(T.cvToHex(entry.value.hash),entry.value['token-uri']);
  if(tx.payload.functionName?.content==='mint-small-single-tx')minted.push({hash:T.cvToHex(args[1]),chunk:args[4].value[0]});
  nonce++;return respond('0x'+tx.txid());
 }
 if(path.startsWith('/extended/v1/tx/'))return respond({tx_status:'success',canonical:true,block_height:1});
 if(path.startsWith('/v2/contracts/source/'))return respond({source});
 if(path.startsWith('/v2/contracts/call-read/')){
  const name=path.split('/').pop(), isCore=path.includes('/xtrata-v3-2-3/');
  const args=JSON.parse(options.body).arguments.map(T.hexToCV);
  let result;
  if(name==='is-paused')result=Cl.ok(Cl.bool(!isCore));
  else if(name==='get-owner')result=isCore?Cl.ok(Cl.some(Cl.principal(config.address))):Cl.ok(Cl.principal(config.address));
  else if(name==='get-locked-core-contract')result=Cl.ok(Cl.contractPrincipal('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X','xtrata-v3-2-3'));
  else if(name==='get-mint-price'||name==='get-reserved-count')result=Cl.ok(Cl.uint(0));
  else if(name==='quote-inscription-fee')result=Cl.ok(Cl.tuple({'total-fee':Cl.uint(10000),'single-tx-eligible':Cl.bool(true)}));
  else if(name==='get-id-by-hash'){const i=minted.findIndex(a=>a.hash===T.cvToHex(args[0]));result=i<0?Cl.none():Cl.some(Cl.uint(i));}
  else if(name==='get-chunk')result=Cl.some(minted[Number(args[0].value)].chunk);
  else if(name==='get-registered-token-uri')result=Cl.some(Cl.tuple({'token-uri':registered.get(T.cvToHex(args[0]))}));
  else if(name==='get-hash-reservation')result=Cl.none();
  else if(name==='get-token-mint-context')result=Cl.some(Cl.tuple({owner:Cl.principal(config.address),'phase-id':Cl.uint(0),'minted-at':Cl.uint(1)}));
  else if(name==='get-minted-id')result=Cl.some(Cl.tuple({'token-id':args[0]}));
  else if(name==='get-minted-count')result=Cl.ok(Cl.uint(minted.length));
  else throw new Error('Unexpected read '+name);
  return respond({okay:true,result:T.cvToHex(result)});
 }
 throw new Error('Unexpected endpoint '+path);
};
