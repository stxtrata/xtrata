// @vitest-environment node
import {describe,it,expect} from 'vitest';
import {createRequire} from 'node:module';
const {DatabaseSync}=createRequire(import.meta.url)('node:sqlite');
import {readFileSync} from 'node:fs';
import * as T from '@stacks/transactions';
import {handleProfile} from '../music-profile';
import {profileData,verifyProfile,signProfile,validateChallenge} from '../../../scripts/wizard/music-profile-proof.mjs';
const ownerKey='1'.repeat(64)+'01',supportKey='2'.repeat(64)+'01';
const owner=T.getAddressFromPrivateKey(ownerKey),support=T.getAddressFromPrivateKey(supportKey),now=1700000000000;
function database(){const sql=new DatabaseSync(':memory:');let tail=Promise.resolve();sql.exec(readFileSync('functions/migrations/017_music_profiles.sql','utf8'));return {
 sql,prepare(query:string){let args:any[]=[];return {bind(...v:any[]){args=v;return this;},async first(){return sql.prepare(query).get(...args)||null;},async run(){const r=sql.prepare(query).run(...args);return {meta:{changes:Number(r.changes)}};}};},
 async batch(statements:any[]){const task=tail.then(async()=>{sql.exec('BEGIN');try{const results=[];for(const s of statements)results.push(await s.run());sql.exec('COMMIT');return results;}catch(e){sql.exec('ROLLBACK');throw e;}});tail=task.catch(()=>{});return task;}
};}
function harness(){const DB=database(),env={DB,MUSIC_PROFILE_ENABLED:'1'};let currentOwner=owner,offline=false,transfer:any=null;
 const transport=async(url:any)=>{if(offline)throw Error('offline');if(String(url).includes('/tx/mempool?')||String(url).includes('/transactions?'))return Response.json({results:transfer?[transfer]:[]});if(String(url).startsWith('https://api.mainnet.hiro.so/extended/v1/tx/')&&transfer)return Response.json(transfer);if(!String(url).startsWith('https://api.bnsv2.com/names/'))throw Error('Unexpected network call');return Response.json({owner:currentOwner,status:'active',current_burn_block:900000,renewal_height:'1000000'});};
 const call=async(data:any,time=now)=>{const response=await handleProfile(new Request('https://xtrata.xyz/api/music-profile',{method:'POST',headers:{'content-type':'application/json',origin:'https://xtrata.xyz'},body:JSON.stringify(data)}),env,transport as any,time);return {status:response.status,...await response.json() as any};};
 const begin=async(action='link',method='signature')=>(await call({op:'challenge',support,name:'jim.btc',action,method})).challenge;
 const complete=(c:any,extra={})=>call({op:'complete',id:c.id,supportProof:signProfile(c,supportKey),ownerProof:T.signStructuredData({...profileData(c,'owner'),privateKey:T.createStacksPrivateKey(ownerKey)}).data,...extra});
 return {DB,env,transport,call,begin,complete,setOwner:(v:string)=>currentOwner=v,setOffline:()=>offline=true,setTransfer:(v:any)=>transfer=v};
}
describe('Music profile associations with transactional SQLite',()=>{
 it('links only with both signatures, exposes public evidence and rejects replay',async()=>{const h=harness(),c=await h.begin();expect((await h.complete(c)).ok).toBe(true);expect((await h.complete(c)).status).toBe(400);const response=await handleProfile(new Request('https://xtrata.xyz/api/music-profile?addresses='+support),h.env,h.transport as any,now);const d:any=await response.json();expect(d.profiles[0].name).toBe('jim.btc');expect(JSON.stringify(d)).not.toContain(supportKey);h.DB.sql.close();});
 it('rejects wrong role, changed domain, address, name, amount and expiry',async()=>{const h=harness(),c=await h.begin(),sig=signProfile(c,supportKey);expect(verifyProfile(c,'owner',sig,support)).toBe(false);for(const edit of [{domain:'evil'},{support:owner},{name:'evil.btc'},{amount:1234},{network:'testnet'},{expires:c.expires+1}]){const changed={...c,...edit};if('domain' in edit||'network' in edit)expect(()=>validateChallenge(changed,now)).toThrow();else expect(verifyProfile(changed,'support',sig,support)).toBe(false);}expect((await h.call({op:'complete',id:c.id,supportProof:sig,ownerProof:sig})).status).toBe(400);expect(()=>validateChallenge(c,c.expires+1)).toThrow();h.DB.sql.close();});
 it('rejects an old approval after unlink and preserves address identity',async()=>{const h=harness(),first=await h.begin(),old=await h.begin();await h.complete(first);const unlink=await h.begin('unlink');expect((await h.complete(unlink)).ok).toBe(true);expect((await h.complete(old)).status).toBe(400);expect(h.DB.sql.prepare('SELECT revoked FROM music_profiles').get()!.revoked).toBe(1);h.DB.sql.close();});
 it('allows only one concurrent revision to change the profile',async()=>{const h=harness(),a=await h.begin(),b=await h.begin();const results=await Promise.all([h.complete(a),h.complete(b)]);expect(results.filter(r=>r.ok).length).toBe(1);expect(results.filter(r=>r.status===400).length).toBe(1);h.DB.sql.close();});
 it('fails closed on ownership changes and service outage',async()=>{const h=harness(),c=await h.begin();h.setOwner(support);expect((await h.complete(c)).status).toBe(400);h.setOffline();expect((await h.begin())).toBeUndefined();h.DB.sql.close();});
 it('hides a transferred name permanently until fresh verification',async()=>{const h=harness(),c=await h.begin();await h.complete(c);h.setOwner(support);const r=await handleProfile(new Request('https://xtrata.xyz/api/music-profile?addresses='+support),h.env,h.transport as any,now);expect((await r.json() as any).profiles).toEqual([]);expect(h.DB.sql.prepare('SELECT revoked FROM music_profiles').get()!.revoked).toBe(1);h.DB.sql.close();});
 it('records a confirmed transfer exactly once and retains its public proof',async()=>{
  const h=harness(),c=await h.begin('link','transfer'),txid='0x'+'c'.repeat(64);
  h.setTransfer({tx_id:txid,tx_type:'token_transfer',sender_address:owner,tx_status:'success',canonical:true,is_unanchored:false,block_time:now/1000,token_transfer:{recipient_address:support,amount:String(c.amount),memo:'0x'+Buffer.from('XM'+c.id.slice(0,30)).toString('hex')}});
  expect((await h.complete(c,{txid})).ok).toBe(true);expect(h.DB.sql.prepare('SELECT txid FROM music_profile_transfers').get()!.txid).toBe(txid);expect((await h.complete(c,{txid})).status).toBe(400);h.DB.sql.close();
 });
 it('discovers a matching transfer without a transaction ID and ignores unrelated transfers',async()=>{
  const h=harness(),c=await h.begin('link','transfer'),txid='0x'+'d'.repeat(64);
  expect((await h.complete(c)).pending).toBe(true);
  const tx={tx_id:txid,tx_type:'token_transfer',sender_address:owner,tx_status:'success',canonical:true,is_unanchored:false,block_time:now/1000,token_transfer:{recipient_address:support,amount:String(c.amount),memo:'0x'+Buffer.from('XM'+c.id.slice(0,30)).toString('hex')}};
  h.setTransfer({...tx,sender_address:support});expect((await h.complete(c)).pending).toBe(true);
  h.setTransfer(tx);expect((await h.complete(c)).ok).toBe(true);expect(h.DB.sql.prepare('SELECT txid FROM music_profile_transfers').get()!.txid).toBe(txid);h.DB.sql.close();
 });
 it('rolls back revision changes when a profile write fails',async()=>{
  const h=harness(),c=await h.begin();h.DB.sql.exec("CREATE TRIGGER reject_profile BEFORE INSERT ON music_profiles BEGIN SELECT RAISE(ABORT,'simulated disk failure'); END");
  expect((await h.complete(c)).status).toBe(400);expect(h.DB.sql.prepare('SELECT revision FROM music_profile_versions').get()!.revision).toBe(0);expect(h.DB.sql.prepare('SELECT consumed FROM music_profile_challenges').get()!.consumed).toBe(0);h.DB.sql.close();
 });
 it('enforces atomic request rate limits',async()=>{const h=harness();for(let i=0;i<20;i++)expect((await h.call({op:'invalid'})).status).toBe(400);expect((await h.call({op:'invalid'})).status).toBe(429);h.DB.sql.close();});
 it('rejects cross-origin writes and disabled deployments',async()=>{const h=harness();const r=await handleProfile(new Request('https://xtrata.xyz/api/music-profile',{method:'POST',headers:{origin:'https://evil.test','content-type':'application/json'},body:'{}'}),h.env);expect(r.status).toBe(403);expect((await handleProfile(new Request('https://xtrata.xyz/api/music-profile'),{})).status).toBe(503);h.DB.sql.close();});
});
