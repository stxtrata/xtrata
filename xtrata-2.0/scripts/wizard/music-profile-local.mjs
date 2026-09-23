import {validateChallenge,profileName,signProfile} from './music-profile-proof.mjs';
const endpoint='https://xtrata.xyz/api/music-profile';
export async function beginMusicProfile(wizard,input,transport=fetch,now=Date.now()){
 if(input?.approved!==true||!['link','unlink'].includes(input.action)||!['signature','transfer'].includes(input.method))throw Error('Review and approve profile linking first.');
 const name=profileName(input.name);wizard.ensureStorageHealthy();
 const {address}=await wizard.json('vault.json');
 // Do not hold the payment lock while waiting for the remote profile service.
 const response=await transport(endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({op:'challenge',support:address,name,action:input.action,method:input.method}),signal:AbortSignal.timeout(15000)});
 const data=await response.json();if(!response.ok)throw Error(data.error||'Profile service unavailable.');
 const c=validateChallenge(data.challenge,now);
 if(c.support!==address||c.name!==name||c.action!==input.action||c.method!==input.method)throw Error('Profile challenge does not match your approval.');
 const lock=await wizard.acquireLock('run.lock');
 try{
  wizard.ensureStorageHealthy();if((await wizard.json('vault.json')).address!==address)throw Error('Wallet identity changed. Start again.');
  const supportProof=signProfile(c,await wizard.key());
  // Fragment data is never sent in an HTTP request or referrer; only a purpose-bound public signature.
  const fragment=Buffer.from(JSON.stringify({id:c.id,supportProof})).toString('base64url');
  return {url:'https://xtrata.xyz/music/profile#'+fragment};
 }finally{await wizard.releaseLock(lock);}
}
