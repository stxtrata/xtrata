// Mock chain for the arcade-launch canary: core inscription contract + leaderboard, in memory.
const fs=require('fs'), crypto=require('crypto');
const T=require('/home/claude/mirror/node_modules/@stacks/transactions');
const {chromium}=require('/home/claude/build/node_modules/playwright');
const {tupleCV,uintCV,boolCV,bufferCV,stringAsciiCV,principalCV,someCV,noneCV,responseOkCV,listCV,cvToHex,hexToCV,cvToString,deserializeTransaction,addressToString,PayloadType}=T;
const HTML=process.argv[2]; const ARCADE=fs.readFileSync('/home/claude/build/xtrata-arcade-INSCRIBE.html');
const DEPLOYER='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const CORE='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const sha=b=>crypto.createHash('sha256').update(b).digest();
const S={core:{uploads:new Map(),chunks:new Map(),meta:new Map(),byHash:new Map(),next:3100},sc:{deployed:false,src:'',boards:new Map(),slots:new Map(),replays:new Map()},tx:new Map(),bal:new Map(),nonce:5,blk:1000,log:[],inscribeFees:[]};
const hex=b=>Buffer.from(b).toString('hex');
const hash160=addr=>Buffer.from(T.createAddress(addr).hash160,'hex');
let txn=0; const newTx=(status,repr)=>{const id='0x'+crypto.createHash('sha256').update('tx'+(++txn)).digest('hex'); S.tx.set(id,{tx_status:status,tx_result:{repr},block_height:++S.blk}); return id};
const num=cv=>BigInt(cv.value); const buf=cv=>Uint8Array.from(cv.buffer);
function callWrite(contract,fn,args,sender){
  const log=(...a)=>S.log.push([contract.split('.')[1],fn,...a]);
  if(contract===CORE){
    const C=S.core;
    if(fn==='begin-or-get'){const h=hex(buf(args[0])); const k=sender+h; if(!C.uploads.has(k)){C.uploads.set(k,{mime:args[1].data,size:Number(num(args[2])),n:Number(num(args[3])),idx:0,run:Buffer.alloc(32)});C.chunks.set(k,[])} log(h.slice(0,8)); return ['success','(ok none)']}
    if(fn==='add-chunk-batch'){const h=hex(buf(args[0])); const k=sender+h; const u=C.uploads.get(k); if(!u) return ['abort_by_response','(err u101)']; const items=args[1].list; if(items.length>32||u.idx+items.length>u.n) return ['abort_by_response','(err u102)'];
      for(const it of items){const d=Buffer.from(buf(it)); const want=u.idx<u.n-1?16384:u.size-u.idx*16384; if(d.length!==want) return ['abort_by_response','(err u102)']; u.run=sha(Buffer.concat([u.run,d])); C.chunks.get(k).push(d); u.idx++} log(items.length,u.idx); return ['success','(ok true)']}
    if(fn==='seal-inscription'){const h=hex(buf(args[0])); const k=sender+h; const u=C.uploads.get(k); if(!u) return ['abort_by_response','(err u101)']; if(u.idx!==u.n) return ['abort_by_response','(err u102)']; if(hex(u.run)!==h) return ['abort_by_response','(err u103)']; if(!args[1].data.length) return ['abort_by_response','(err u107)'];
      const id=C.next++; C.meta.set(id,{creator:sender,mime:u.mime,size:u.size,n:u.n,hash:h}); C.byHash.set(h,id); C.uploads.delete(k); C.sealed=(C.sealed||0)+1; log(id); return ['success',`(ok u${id})`]}
  } else {
    const B=S.sc, name=x=>x.data;
    if(fn==='set-board'){B.boards.set(name(args[0]),{mode:num(args[1]),max:num(args[2]),fee:num(args[3]),eid:num(args[4]),daily:args[5].type===T.ClarityType.BoolTrue,en:args[6].type===T.ClarityType.BoolTrue}); return ['success','(ok true)']}
    if(fn==='set-board-enabled'){const b=B.boards.get(name(args[0])); if(!b) return ['abort_by_response','(err u102)']; b.en=args[1].type===T.ClarityType.BoolTrue; return ['success','(ok true)']}
    if(fn==='submit-score'){const id=name(args[0]); const b=B.boards.get(id); if(!b) return ['abort_by_response','(err u102)']; if(!b.en) return ['abort_by_response','(err u103)'];
      const rep=Buffer.from(buf(args[4])); if(!rep.subarray(4,24).equals(hash160(sender))) return ['abort_by_response','(err u113)'];
      const score=num(args[2]); const arr=B.slots.get(id)||[]; arr.push({player:sender,name:name(args[3]),score,hash:sha(rep)}); arr.sort((a,c)=>Number(c.score-a.score)); B.slots.set(id,arr.slice(0,10)); B.replays.set(id+sender,rep); return ['success','(ok u1)']}
  }
  return ['abort_by_response','(err u999)'];
}
function callRead(contract,fn,args){
  if(contract===CORE){const C=S.core;
    if(fn==='is-paused') return responseOkCV(boolCV(false));
    if(fn==='get-admin') return responseOkCV(principalCV(DEPLOYER));
    if(fn==='quote-staged-fee'){const n=Number(num(args[1])); const seal=100000+Math.min(n,32)*1000+Math.ceil(Math.max(n-32,0)/32)*100000; return responseOkCV(tupleCV({'begin-fee':uintCV(100000),'seal-fee':uintCV(seal)}))}
    if(fn==='get-id-by-hash'){const id=C.byHash.get(hex(buf(args[0]))); return id?someCV(uintCV(id)):noneCV()}
    if(fn==='get-upload-state'){const u=C.uploads.get(cvToString(args[1])+hex(buf(args[0]))); return u?someCV(tupleCV({'current-index':uintCV(u.idx)})):noneCV()}
    if(fn==='get-inscription-meta'){const m=C.meta.get(Number(num(args[0]))); return m?someCV(tupleCV({creator:principalCV(m.creator),'mime-type':stringAsciiCV(m.mime),'total-size':uintCV(m.size),'total-chunks':uintCV(m.n),sealed:boolCV(true),'final-hash':bufferCV(Buffer.from(m.hash,'hex')),owner:principalCV(m.creator)})):noneCV()}
    if(fn==='get-chunk-batch'){const m=C.meta.get(Number(num(args[0]))); const ch=C.chunks.get(m.creator+m.hash); return listCV(args[1].list.map(i=>bufferCV(ch[Number(num(i))])))}
  } else {const B=S.sc;
    if(fn==='get-owner') return principalCV(DEPLOYER);
    if(fn==='is-paused') return boolCV(false);
    if(fn==='current-period') return uintCV(1234);
    if(fn==='get-board'){const b=B.boards.get(args[0].data); return b?someCV(tupleCV({mode:uintCV(b.mode),'max-score':uintCV(b.max),fee:uintCV(b.fee),'engine-id':uintCV(b.eid),daily:boolCV(b.daily),enabled:boolCV(b.en)})):noneCV()}
    if(fn==='get-top10'){const arr=B.slots.get(args[0].data)||[]; return listCV(Array.from({length:10},(_,i)=>arr[i]?someCV(tupleCV({player:principalCV(arr[i].player),name:stringAsciiCV(arr[i].name),score:uintCV(arr[i].score),'stacks-height':uintCV(1),'burn-height':uintCV(1),'engine-id':uintCV(1),'replay-hash':bufferCV(arr[i].hash)})):noneCV()))}
    if(fn==='get-replay'){const r=B.replays.get(args[0].data+cvToString(args[2])); return r?someCV(bufferCV(r)):noneCV()}
  }
  throw new Error('mock read not implemented: '+contract+' '+fn);
}
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required']});
 const ctx=await b.newContext({viewport:{width:1000,height:900}}); const p=await ctx.newPage(); const errs=[]; p.on('crash',()=>console.log('PAGE CRASH')); p.on('close',()=>console.log('PAGE CLOSED')); p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error'&&!/ERR_FAILED|permissions policy|WebGL|GPU/i.test(m.text()))errs.push('console: '+m.text().slice(0,160))});
 await p.route(/^https?:\/\//,async r=>{
   const u=new URL(r.request().url()); const path=u.pathname; const json=o=>r.fulfill({contentType:'application/json',body:JSON.stringify(o)});
   if(/xtrata\.xyz$/.test(u.hostname)&&path.startsWith('/i/')) return r.fulfill({contentType:'text/html',body:ARCADE});
   if(/xtrata\.xyz$/.test(u.hostname)&&path==='/arcade/submit') return r.fulfill({contentType:'text/html',body:'<html><script src="/arcade/submit.js"></script></html>'});
   if(/xtrata\.xyz$/.test(u.hostname)&&path==='/arcade/submit.js') return r.fulfill({contentType:'text/javascript',body:'const ALLOWED=["astro3","astro3-daily"]'});
   if(!/hiro/.test(u.pathname+u.hostname)&&!/api\.hiro\.so/.test(u.hostname)) return r.abort();
   const q=path.replace(/^\/hiro\/(mainnet|testnet)/,'');
   let m;
   if((m=q.match(/^\/v2\/contracts\/call-read\/([^/]+)\/([^/]+)\/([^/]+)$/))){const args=JSON.parse(r.request().postData()).arguments.map(hexToCV); try{return json({okay:true,result:cvToHex(callRead(m[1]+'.'+m[2],m[3],args))})}catch(e){return json({okay:false,cause:String(e.message)})}}
   if((m=q.match(/^\/v2\/contracts\/source\/([^/]+)\/([^/]+)/))){return S.sc.deployed&&m[2]==='xtrata-arcade-scores-v2'?json({source:S.sc.src}):r.fulfill({status:404,body:'{}'})}
   if((m=q.match(/^\/extended\/v1\/address\/([^/]+)\/stx$/))){return json({balance:String(S.bal.get(m[1])??100_000_000n)})}
   if((m=q.match(/^\/extended\/v1\/address\/([^/]+)\/nonces$/))){return json({possible_next_nonce:S.nonce++})}
   if((m=q.match(/^\/extended\/v1\/tx\/(0x[0-9a-f]+)$/))){const t=S.tx.get(m[1]); return t?json(t):r.fulfill({status:404,body:'{}'})}
   if(q==='/v2/transactions'){const raw=r.request().postDataBuffer(); const tx=deserializeTransaction(raw.toString('hex')); const sender=T.addressFromVersionHash?addr(tx):addr(tx);
      let id;
      if(tx.payload.payloadType===PayloadType.ContractCall){const res=callWrite(tx.payload.contractAddress?addressToString(tx.payload.contractAddress)+'.'+tx.payload.contractName.content:'',tx.payload.functionName.content,tx.payload.functionArgs,sender); id=newTx(res[0],res[1])}
      else {const to=cvToString(tx.payload.recipient), amt=tx.payload.amount; S.bal.set(sender,(S.bal.get(sender)??0n)-BigInt(amt)); S.bal.set(to,(S.bal.get(to)??100_000_000n)+BigInt(amt)); id=newTx('success','(ok true)')}
      return json(id.slice(2))}
   return r.fulfill({status:404,body:'{}'});
 });
 function addr(tx){return T.addressToString(T.addressFromVersionHash(tx.auth.spendingCondition.hashMode===0?22:22, tx.auth.spendingCondition.signer))}
 await p.exposeFunction('__wallet',async(method,params)=>{
   if(method==='getAddresses') return {result:{addresses:[{symbol:'STX',address:DEPLOYER}]}};
   if(method==='stx_callContract'){const args=params.functionArgs.map(hexToCV); const res=callWrite(params.contract,params.functionName,args,DEPLOYER); return {result:{txid:newTx(res[0],res[1])}}}
   if(method==='stx_deployContract'){S.sc.deployed=true;S.sc.src=params.clarityCode||params.codeBody||params.code; return {result:{txid:newTx('success','(ok true)')}}}
   if(method==='stx_transferStx'){S.bal.set(params.recipient,(S.bal.get(params.recipient)??0n)+BigInt(params.amount)); return {result:{txid:newTx('success','(ok true)')}}}
   throw Object.assign(new Error('unsupported '+method),{code:-32601});
 });
 await p.addInitScript(()=>{window.LeatherProvider={request:async(m,pr)=>{ const r=await window.__wallet(m,pr); return r }}});
 console.log('goto'); await p.goto('file://'+HTML); console.log('loaded'); await p.waitForTimeout(1500);
 const ids=['connect','preflight','deploy','verify','begin','upload','seal','inscription','board','submit','fund','copy','sweep','close','production','audit'];
 const only=process.argv[3]?Number(process.argv[3]):ids.length;
 for(const id of ids.slice(0,only)){
   if(id==='deploy'){}
   console.log('click',id); await p.click(`[data-step="${id}"]`,{timeout:20000}); console.log('clicked'); await new Promise(r=>setTimeout(r,4000)); console.log('DBG',await p.evaluate(()=>document.querySelector('#status').textContent+' || '+document.querySelector('#log').textContent.slice(0,500)+' || chooser:'+document.querySelectorAll('.chooser').length+' prov:'+typeof window.LeatherProvider)); 
   if(id==='connect'){ await p.waitForSelector('.chooser__item',{timeout:15000}); await p.click('.chooser__item',{timeout:8000}); }
   const t0=Date.now(); let badge='';
   for(;;){ await p.waitForTimeout(500); badge=await p.evaluate(i=>{const b=document.querySelector(`[data-step="${i}"]`).closest('section'); return b.querySelector('.badge').textContent+'|'+(b.querySelector('.note')||{textContent:''}).textContent},id); if(/^(pass|fail)/.test(badge)) break; if(Date.now()-t0>170000){badge='TIMEOUT|'+badge; break} }
   console.log(id.padEnd(12),badge.slice(0,330));
   if(!badge.startsWith('pass')) break;
 }
 console.log('core log',S.core.sealed,'boards',S.sc.boards.size,'errors',errs.slice(0,4));
 await b.close();
})();
