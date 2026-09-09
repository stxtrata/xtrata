// Bounded, resumable mainnet acceptance test for inscription 3037.
// Only the existing disposable chess wizards are used. No seed/key is logged.
import {readFileSync,writeFileSync,existsSync,mkdirSync,renameSync} from 'node:fs';
import {createHash,createCipheriv,createDecipheriv,randomBytes} from 'node:crypto';
import assert from 'node:assert/strict';
import {Cl,Pc,PostConditionMode,ClarityVersion,deserializeTransaction,makeContractCall,makeContractDeploy,getAddressFromPrivateKey} from '@stacks/transactions';
import {endpoint,api,balanceOf,nextNonce,broadcastWithRetry} from '../../harness/wizards/play.mjs';
import {readFleet,RESERVED_ADDRESSES,scrub} from '../../harness/wizards/wizards-core.mjs';
import * as m from './modules.mjs';
const DIR='reviews/3037',FILE=DIR+'/live-state.json',LIMIT=1_000_000n,LIVE=process.argv.includes('--live');
const env={};for(const line of readFileSync('harness/wizards/.env.wizards','utf8').split('\n')){const x=/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);if(x)env[x[1]]=x[2].replace(/^["']|["']$/g,'');}
const fleet=readFleet(env);assert(fleet.ready,'Wizard fleet unavailable');
const get=id=>fleet.wizards.find(w=>w.id===id),white=get('wizard-1'),black=get('wizard-2'),patron=get('wizard-3');
for(const w of [white,black,patron]){assert(w);assert(!RESERVED_ADDRESSES.includes(w.address));assert.equal(getAddressFromPrivateKey(w.key,'mainnet'),w.address);}
const CORE='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1-canary',XTRATA=CORE.split('.')[0]+'.xtrata-v3-2-3',REGISTRY=patron.address+'.xchess-peer-v1';
const state=existsSync(FILE)?JSON.parse(readFileSync(FILE,'utf8')):{inscription:3037,createdAt:new Date().toISOString(),limitUstx:String(LIMIT),transactions:[],checks:[]};
const save=()=>{writeFileSync(FILE+'.tmp',JSON.stringify(state,null,2)+'\n');renameSync(FILE+'.tmp',FILE);};
const ep=await endpoint();const pause=ms=>new Promise(r=>setTimeout(r,ms));
const stringify=o=>JSON.stringify(o,(_,v)=>typeof v==='bigint'?v.toString():v,2);
async function ro(contract,fn,args=[]){const r=await ep.request('/v2/contracts/call-read/'+contract.replace('.','/')+'/'+fn,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sender:white.address,arguments:args.map(a=>typeof a==='string'?a:Cl.serialize(a))})});assert(r.ok,'Chain read failed');const j=await r.json();assert(j.okay,'Contract read failed: '+fn);return m.decode(j.result);}
async function chainTx(txid){try{return await api('/extended/v1/tx/0x'+txid.replace(/^0x/,''));}catch{return null;}}
async function wait(row){
 const end=Date.now()+600000;while(Date.now()<end){const tx=await chainTx(row.txid);if(tx?.tx_status&&tx.tx_status!=='pending'){row.status=tx.tx_status;row.blockHeight=tx.block_height;row.feeUstx=tx.fee_rate;row.result=tx.tx_result;row.events=tx.events;save();assert.equal(tx.tx_status,'success',row.label+' failed: '+tx.tx_status);return tx;}await pause(5000);}throw Error('Confirmation pending: '+row.label+'; rerun to resume the same transaction');
}
const allowed=new Map([[CORE,new Set(['open-game','open-sponsored-game','submit'])],[REGISTRY,new Set(['create-peer-game','join-peer-game'])],[XTRATA,new Set(['mint-single-tx-recursive'])]]);
async function send(label,w,contract,fn,args,cost=0n,pcs=[],deploy=false){
 let row=state.transactions.find(t=>t.label===label);if(row){if(row.status==='prepared'){assert(LIVE);const tx=deserializeTransaction(readFileSync(DIR+'/signed-transactions/'+row.txid+'.hex','utf8'));assert.equal(tx.txid(),row.txid);await broadcastWithRetry(tx,label);row.status='pending';save();}return wait(row);}
 assert(LIVE,'Use --live only after checking the dry plan');assert(allowed.get(contract)?.has(fn)||(deploy&&contract===REGISTRY&&w===patron&&fn==='deploy'));
 const fee=deploy?30000n:contract===XTRATA?20000n:3000n;
 const spent=state.transactions.reduce((n,t)=>n+BigInt(t.maxCostUstx),0n);assert(spent+cost+fee<=LIMIT,'Session spend cap would be exceeded');assert(await balanceOf(w.address,{maxAgeMs:0})-cost-fee>=200000n,'Wizard balance floor');
 const nonce=await nextNonce(w.address),common={senderKey:w.key,network:'mainnet',fee,nonce,postConditionMode:PostConditionMode.Deny,postConditions:pcs};
 const tx=deploy?await makeContractDeploy({...common,contractName:'xchess-peer-v1',codeBody:readFileSync('contracts/xchess-peer-v1.clar','utf8'),clarityVersion:ClarityVersion.Clarity4}):await makeContractCall({...common,contractAddress:contract.split('.')[0],contractName:contract.split('.')[1],functionName:fn,functionArgs:args,validateWithAbi:false});
 row={label,contract,function:fn,sender:w.address,nonce:String(nonce),txid:tx.txid(),maxCostUstx:String(cost+fee),status:'prepared'};state.transactions.push(row);save();mkdirSync(DIR+'/signed-transactions',{recursive:true});writeFileSync(DIR+'/signed-transactions/'+row.txid+'.hex',tx.serialize());
 console.log('Broadcast',label,row.txid,'max',row.maxCostUstx,'uSTX');
 await broadcastWithRetry(tx,label);
 row.status='pending';save();return wait(row);
}
function resultNumber(tx){const result=m.decode(tx.tx_result.hex);assert(result.ok);const value=typeof result.value==='bigint'?result.value:result.value?.['token-id'];assert(typeof value==='bigint','Unexpected transaction result');return Number(value);}
function checked(name,data){if(!state.checks.some(x=>x.name===name))state.checks.push({name,passed:true,...data});save();console.log('PASS',name,data?stringify(data):'');}
const openFee=await ro(CORE,'get-open-fee'),price=await ro(CORE,'get-sponsor-price'),fu=await ro(XTRATA,'get-fee-unit');const feeUnit=fu.ok?fu.value:fu;
state.plan={core:CORE,registry:REGISTRY,xtrata:XTRATA,openFeeUstx:String(openFee),sponsorPriceUstx:String(price.total),inscriptionProtocolFeeUstx:String(feeUnit*3n),maxSessionUstx:String(LIMIT),newGames:'standard + one-player sponsorship + named peer game; all unranked',wizardAddresses:[white.address,black.address,patron.address]};save();
if(!LIVE){console.log(stringify(state.plan));process.exit(0);}
try{
 if(!state.startBalances){state.startBalances={};for(const w of [white,black,patron])state.startBalances[w.address]=String(await balanceOf(w.address,{maxAgeMs:0}));save();}
 const rules=m.normaliseRules({...m.DEFAULT_RULES,white:white.address,black:black.address,ranked:false,cooldown:0}),rh=m.rulesHash(rules);state.legacyRules=rules;save();
 for(const kind of ['standard','sponsored']){
  const sponsor=kind==='sponsored',cost=openFee+(sponsor?price.total:0n),pcs=[Pc.principal(white.address).willSendLte(cost).ustx()];
  if(sponsor)pcs.push(Pc.principal(CORE).willSendLte(price.bootstrap).ustx());
  const tx=await send(kind+'-open',white,CORE,sponsor?'open-sponsored-game':'open-game',[Cl.some(Cl.bufferFromHex(rh)),Cl.bool(false),...(sponsor?[Cl.standardPrincipal(black.address)]:[])],cost,pcs);
  const id=resultNumber(tx);state[kind+'Game']=id;save();
  if(sponsor){const sr=await ro(CORE,'get-sponsorship',[Cl.uint(id),Cl.standardPrincipal(black.address)]);const used=state.transactions.filter(t=>t.label.startsWith('sponsored-move-')&&t.sender===black.address&&t.status==='success').length;assert.equal(sr['rebates-left'],45n-BigInt(used));checked('Mainnet sponsorship bootstrap and reserve created',{game:id,bootstrapUstx:String(price.bootstrap),reservedUstx:String(sr.reserved)});}
  for(const [index,value] of ['f2f3','e7e5','g2g4','d8h4'].entries()){
   const actor=index%2===0?white:black,pc=sponsor&&actor===black?[Pc.principal(CORE).willSendLte(2000n).ustx()]:[];
   await send(kind+'-move-'+(index+1),actor,CORE,'submit',[Cl.uint(id),Cl.stringAscii(value)],0n,pc);
  }
  const chain=new m.LiveChain({contractAddress:CORE.split('.')[0],contractName:CORE.split('.')[1],network:'mainnet',override:ep.base});const entries=await chain.getAllEntries(id);const r=m.replayLegacy(entries.map(e=>({seq:e.seq,mv:e.value,sender:e.sender,height:e.height})),{rules});assert.equal(r.result,'0-1');assert.equal(r.termination,'checkmate');assert.equal(r.rejected.length,0);checked('Mainnet '+kind+' game replays to checkmate',{game:id,moves:r.accepted.length});
  if(sponsor){const sr=await ro(CORE,'get-sponsorship',[Cl.uint(id),Cl.standardPrincipal(black.address)]);assert.equal(sr['rebates-left'],43n);checked('Two sponsored moves received contract rebates',{remainingRebates:43,reservedUstx:String(sr.reserved)});}
 }
 const sourceResponse=await ep.request('/v2/contracts/source/'+REGISTRY.replace('.','/')+'?proof=0');
 if(sourceResponse.status===404)await send('peer-registry-deploy',patron,REGISTRY,'deploy',[],0n,[],true);else assert(sourceResponse.ok,'Cannot establish registry deployment status');
 const deployed=await(await ep.request('/v2/contracts/source/'+REGISTRY.replace('.','/')+'?proof=0')).json();assert.equal(deployed.source,readFileSync('contracts/xchess-peer-v1.clar','utf8'));state.peerRegistry=REGISTRY;checked('Deployed peer registry source matches the reviewed immutable contract');
 const keyFile=DIR+'/private-peer-keys.enc.json',encryptionKey=createHash('sha256').update('xchess-3037-test-recovery:'+patron.key).digest();let keys;
 if(existsSync(keyFile)){const e=JSON.parse(readFileSync(keyFile,'utf8')),d=createDecipheriv('aes-256-gcm',encryptionKey,Buffer.from(e.iv,'hex'));d.setAuthTag(Buffer.from(e.tag,'hex'));const decoded=JSON.parse(Buffer.concat([d.update(Buffer.from(e.cipher,'hex')),d.final()]).toString());keys={};for(const side of ['white','black'])keys[side]={public:decoded[side].public,secret:await crypto.subtle.importKey('jwk',decoded[side].jwk,{name:'ECDSA',namedCurve:'P-256'},true,['sign'])};}
 else {keys={white:await m.generateKey(),black:await m.generateKey()};const decoded={};for(const side of ['white','black'])decoded[side]={public:keys[side].public,jwk:await crypto.subtle.exportKey('jwk',keys[side].secret)};const iv=randomBytes(12),c=createCipheriv('aes-256-gcm',encryptionKey,iv);const cipher=Buffer.concat([c.update(JSON.stringify(decoded)),c.final()]);writeFileSync(keyFile,JSON.stringify({iv:iv.toString('hex'),tag:c.getAuthTag().toString('hex'),cipher:cipher.toString('hex')}),{mode:0o600});}
 if(!state.peerDescriptor){state.peerDescriptor=m.descriptor();save();}
 const created=await send('peer-create',white,REGISTRY,'create-peer-game',m.createArgs(black.address,true,keys.white.public,state.peerDescriptor).map(x=>Cl.deserialize(x)));const gameId=resultNumber(created);state.peerGame=gameId;save();
 const registry=new m.PeerRegistry(REGISTRY,'mainnet',ep.base),invitation=await registry.game(gameId);assert.equal(invitation.creatorKey,keys.white.public);
 await send('peer-join',black,REGISTRY,'join-peer-game',m.joinArgs(invitation,keys.black.public).map(x=>Cl.deserialize(x)));
 let opening;for(let i=0;i<100;i++){try{opening=await registry.confirmed(gameId);break;}catch(e){if(!String(e.message).includes('confirmations'))throw e;await pause(5000);}}assert(opening,'Waiting for registry confirmations');checked('Named player keys and full joined descriptor confirmed on mainnet',{registry:REGISTRY,game:gameId});
 let game=m.emptyGame(opening);for(const value of ['f2f3','e7e5','g2g4','d8h4']){const actor=m.actorTurn((await m.replay(game)).position),payload=await m.makeMove(game,actor,value);game.line.moves.push(await m.sign(payload,keys[actor].secret));await m.replay(game);}
 const archive=existsSync(DIR+'/registered-peer-result.json')?JSON.parse(readFileSync(DIR+'/registered-peer-result.json','utf8')):await m.archive(game);assert.equal((await m.verifyArchive(archive,opening)).summary.result,'0-1');const bytes=Buffer.from(m.canonical(archive)+'\n');writeFileSync(DIR+'/registered-peer-result.json',bytes);checked('Registered off-chain signed Fool’s Mate verifies against the live opening',{bytes:bytes.length,historyRoot:archive.final.root,fileSha256:createHash('sha256').update(bytes).digest('hex'),moves:4});
 assert(bytes.length<=16384,'Test archive must stay one chunk');const rolling=createHash('sha256').update(Buffer.concat([Buffer.alloc(32),bytes])).digest();
 const minted=await send('peer-result-inscription',black,XTRATA,'mint-single-tx-recursive',[Cl.buffer(rolling),Cl.stringAscii('application/json'),Cl.uint(bytes.length),Cl.list([Cl.buffer(bytes)]),Cl.stringAscii('data:text/plain,xchess-peer-v1-3037-acceptance-test'),Cl.list([Cl.uint(3037)])],feeUnit*3n,[Pc.principal(black.address).willSendLte(feeUnit*3n).ustx()]);
 const inscriptionId=resultNumber(minted);state.resultInscription=inscriptionId;save();
 const reader=new m.XtrataReader({endpoint:ep});const sealedText=await reader.text(inscriptionId);assert.equal(sealedText,bytes.toString());await m.verifyArchive(JSON.parse(sealedText),opening);checked('Sealed on-chain result bytes match and independently verify',{inscription:inscriptionId,sha256:createHash('sha256').update(sealedText).digest('hex')});
 state.endBalances={};for(const w of [white,black,patron])state.endBalances[w.address]=String(await balanceOf(w.address,{maxAgeMs:0}));state.completedAt=new Date().toISOString();state.success=true;if(state.lastError){state.recoveredHarnessError=state.lastError;delete state.lastError;}save();console.log('COMPLETE',stringify({standardGame:state.standardGame,sponsoredGame:state.sponsoredGame,registry:REGISTRY,peerGame:gameId,resultInscription:inscriptionId,maxBookedUstx:state.transactions.reduce((n,t)=>n+BigInt(t.maxCostUstx),0n)}));
}catch(e){state.lastError=scrub(e instanceof Error?e.message:String(e));save();console.error(state.lastError);process.exitCode=1;}
