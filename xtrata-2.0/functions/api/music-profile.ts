import {PROFILE_TTL,profileName,profileAddress,verifyProfile} from '../../scripts/wizard/music-profile-proof.mjs';
import {resolveProfileOwner,requireSupportProof,verifyProfileTransfer} from '../lib/music-profile';
const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json','cache-control':'no-store','x-content-type-options':'nosniff'}});
const hex=(bytes:Uint8Array)=>Array.from(bytes,v=>v.toString(16).padStart(2,'0')).join('');
async function body(request:Request){
 if(!request.headers.get('content-type')?.startsWith('application/json'))throw Error('JSON required.');
 const reader=request.body?.getReader();if(!reader)throw Error('Body required.');let size=0,text='';const decoder=new TextDecoder();
 while(true){const r=await reader.read();if(r.done)break;size+=r.value.length;if(size>8192){await reader.cancel();throw Error('Request too large.');}text+=decoder.decode(r.value,{stream:true});}return JSON.parse(text+decoder.decode());
}
export async function handleProfile(request:Request,env:any,transport:typeof fetch=fetch,now=Date.now()){
 if(env.MUSIC_PROFILE_ENABLED!=='1'||!env.DB)return reply({error:'Profile linking is not available on this deployment yet.'},503);
 const db=env.DB,url=new URL(request.url);
 try{
  if(request.method==='GET'){
   const addresses=(url.searchParams.get('addresses')||'').split(',');if(addresses.length>5)throw Error('At most 5 profiles per request.');addresses.forEach(profileAddress);
   const profiles=[];
   await Promise.all(addresses.map(async address=>{
    const row=await db.prepare('SELECT * FROM music_profiles WHERE address=? AND revoked=0').bind(address).first();if(!row)return;
    // Ownership is rechecked before displaying a verified label; outages fail anonymous.
    try{if(await resolveProfileOwner(row.name,transport)!==row.owner){await db.prepare('UPDATE music_profiles SET revoked=1 WHERE address=? AND challenge_id=?').bind(address,row.challenge_id).run();return;}profiles.push({address,name:row.name,owner:row.owner,verifiedAt:row.verified_at,proof:JSON.parse(row.proof),transferTxid:row.transfer_txid});}catch{/* No verified label when ownership cannot be established. */}
   }));
   return reply({profiles});
  }
  if(request.method!=='POST')return reply({error:'Method not allowed'},405);
  const origin=request.headers.get('origin');if(origin&&origin!==url.origin)return reply({error:'Wrong origin'},403);
  const b=await body(request);
  // D1 rate admission is atomic and contains only hashed IP buckets. Local apps have no Origin.
  const ip=request.headers.get('CF-Connecting-IP')||'local';
  const key=hex(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip+':'+Math.floor(now/60000)))));
  const rate=await db.prepare('INSERT INTO music_profile_rate(key,started,count) VALUES(?,?,1) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key,now).first();
  if(rate.count>20)return reply({error:'Too many requests. Wait one minute.'},429);
  if(b.op==='challenge'){
   const support=profileAddress(b.support),name=profileName(b.name);
   if(!['link','unlink'].includes(b.action)||!['signature','transfer'].includes(b.method)||b.action==='unlink'&&b.method!=='signature')throw Error('Invalid profile action.');
   const owner=b.action==='link'?await resolveProfileOwner(name,transport):'';
   const id=hex(crypto.getRandomValues(new Uint8Array(32))),amount=1000+crypto.getRandomValues(new Uint32Array(1))[0]%9000;
   const c={id,domain:'xtrata.xyz/music/heroes',network:'mainnet',support,name,owner,action:b.action,method:b.method,issued:now,expires:now+PROFILE_TTL,amount};
   await db.prepare('INSERT OR IGNORE INTO music_profile_versions(address,revision) VALUES(?,0)').bind(support).run();
   const v=await db.prepare('SELECT revision FROM music_profile_versions WHERE address=?').bind(support).first();
   await db.batch([db.prepare('DELETE FROM music_profile_rate WHERE started<?').bind(now-3600000),db.prepare('DELETE FROM music_profile_challenges WHERE expires<?').bind(now-86400000),db.prepare('INSERT INTO music_profile_challenges(id,support,revision,challenge,expires) VALUES(?,?,?,?,?)').bind(id,support,v.revision,JSON.stringify(c),c.expires)]);
   return reply({challenge:c});
  }
  if(!/^[a-f0-9]{64}$/.test(b.id))throw Error('Invalid request ID.');
  const row=await db.prepare('SELECT * FROM music_profile_challenges WHERE id=?').bind(b.id).first();if(!row||row.consumed)throw Error('Request expired or already used.');
  const c=JSON.parse(row.challenge);
  requireSupportProof(c,b.supportProof,now,c.method==='transfer'&&!!row.transfer_seen);
  if(b.op==='review')return reply({challenge:c});
  if(b.op!=='complete')throw Error('Unknown profile operation.');
  let txid:string|null=null;
  if(c.action==='link'){
   if(await resolveProfileOwner(c.name,transport)!==c.owner)throw Error('BNS ownership changed. Start again.');
   if(c.method==='signature'){
    if(!verifyProfile(c,'owner',b.ownerProof,c.owner))throw Error('Approve using the wallet that owns this BNS name.');
   }else{
    txid=String(b.txid||'').toLowerCase();if(!/^0x[a-f0-9]{64}$/.test(txid))throw Error('Enter the transfer transaction ID.');
    if(row.transfer_seen&&row.transfer_seen!==txid)throw Error('A different transfer is already being verified.');
    const used=await db.prepare('SELECT txid FROM music_profile_transfers WHERE txid=?').bind(txid).first();if(used)throw Error('Transfer already used.');
    const base='https://api.mainnet.hiro.so';const headers:Record<string,string>={};if(env.HIRO_API_KEY)headers['x-api-key']=env.HIRO_API_KEY;
    const response=await transport(base+'/extended/v1/tx/'+txid,{headers,signal:AbortSignal.timeout(12000),cache:'no-store'});if(!response.ok)throw Error('Transfer lookup unavailable. Try again later.');
    const outcome=verifyProfileTransfer(c,await response.json(),txid,row.transfer_seen_at,now);
    if(outcome==='pending'){
     await db.prepare('UPDATE music_profile_challenges SET transfer_seen=?,transfer_seen_at=COALESCE(transfer_seen_at,?) WHERE id=? AND consumed=0 AND (transfer_seen IS NULL OR transfer_seen=?)').bind(txid,now,c.id,txid).run();
     return reply({pending:true,message:'Transfer found. Wait for confirmation, then check again. No additional payment is needed.'});
    }
   }
  }
  const proof=JSON.stringify({challenge:c,supportProof:b.supportProof,...(c.method==='signature'&&c.action==='link'?{ownerProof:b.ownerProof}:{}),...(txid?{txid}:{} )});
  // D1 batch is transactional. A revision compare-and-swap defeats concurrent or older approvals.
  const guard='SELECT 1 FROM music_profile_versions WHERE address=? AND last_challenge=?';
  const statements=[db.prepare('UPDATE music_profile_versions SET revision=revision+1,last_challenge=? WHERE address=? AND revision=? AND EXISTS(SELECT 1 FROM music_profile_challenges WHERE id=? AND consumed=0)').bind(c.id,c.support,row.revision,c.id)];
  if(txid)statements.push(db.prepare(`INSERT INTO music_profile_transfers(txid,challenge_id) SELECT ?,? WHERE EXISTS(${guard})`).bind(txid,c.id,c.support,c.id));
  if(c.action==='link')statements.push(db.prepare(`INSERT INTO music_profiles(address,name,owner,verified_at,revoked,challenge_id,proof,transfer_txid) SELECT ?,?,?,?,0,?,?,? WHERE EXISTS(${guard}) ON CONFLICT(address) DO UPDATE SET name=excluded.name,owner=excluded.owner,verified_at=excluded.verified_at,revoked=0,challenge_id=excluded.challenge_id,proof=excluded.proof,transfer_txid=excluded.transfer_txid`).bind(c.support,c.name,c.owner,now,c.id,proof,txid,c.support,c.id));
  else statements.push(db.prepare(`UPDATE music_profiles SET revoked=1,proof=?,challenge_id=? WHERE address=? AND EXISTS(${guard})`).bind(proof,c.id,c.support,c.support,c.id));
  statements.push(db.prepare(`UPDATE music_profile_challenges SET consumed=1 WHERE id=? AND EXISTS(${guard})`).bind(c.id,c.support,c.id));
  const results=await db.batch(statements);if(!results[0].meta.changes)throw Error('Profile changed or request already used. Start again in the app.');
  return reply({ok:true,action:c.action,name:c.name,support:c.support});
 }catch(e){return reply({error:e instanceof Error?e.message:'Profile verification unavailable.'},400);}
}
export const onRequest=({request,env}:any)=>handleProfile(request,env);
