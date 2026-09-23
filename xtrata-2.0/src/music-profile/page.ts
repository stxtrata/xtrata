import {showSignStructuredMessage} from '@stacks/connect';
import {profileData} from '../../scripts/wizard/music-profile-proof.mjs';
const $=(id:string)=>document.getElementById(id)!;
const status=(s:string)=>{$('profile-status').textContent=s;};
let proof:{id:string;supportProof:string},challenge:any,busy=false;
async function call(data:any){const r=await fetch('/api/music-profile',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(20000)});const d=await r.json();if(!r.ok)throw Error(d.error||'Verification unavailable.');return d;}
async function finish(extra={}){
 if(busy)return;busy=true;status('Checking your verification…');
 try{const d=await call({op:'complete',...proof,...extra});status(d.pending?d.message:d.action==='unlink'?'Your name link has been removed. Payment history is unchanged.':'Your BNS name is linked. Music Heroes can now show it alongside your wallet.');if(!d.pending)$('profile-actions').hidden=true;}
 catch(e){status((e as Error).message);}finally{busy=false;}
}
$('profile-sign').onclick=async()=>{
 if(busy||!challenge)return;busy=true;status('Approve the profile message in the wallet that owns this BNS name. No transaction is requested.');
 try{await showSignStructuredMessage({...profileData(challenge,'owner'),network:'mainnet',stxAddress:challenge.owner,onFinish:d=>{busy=false;void finish({ownerProof:d.signature});},onCancel:()=>{busy=false;status('Verification cancelled. Nothing changed.');}});}catch(e){busy=false;status((e as Error).message);}
};
$('profile-check').onclick=()=>void finish({txid:($('profile-txid') as HTMLInputElement).value.trim()});
$('profile-remove').onclick=()=>void finish();
async function init(){
 try{
  const fragment=location.hash.slice(1);history.replaceState(null,'',location.pathname);
  if(!fragment||fragment.length>2048)throw Error('Start a new profile request from the music app.');
  proof=JSON.parse(atob(fragment.replace(/-/g,'+').replace(/_/g,'/')));
  if(!/^[a-f0-9]{64}$/.test(proof.id)||!/^[a-f0-9]{130}$/i.test(proof.supportProof))throw Error('Invalid profile request.');
  ({challenge}=await call({op:'review',...proof}));
  $('profile-heading').textContent=challenge.action==='unlink'?'Remove your public name link':`Link ${challenge.name}`;
  $('profile-details').textContent=`Support wallet: ${challenge.support}. ${challenge.action==='link'?'BNS owner: '+challenge.owner+'. ':''}Request expires ${new Date(challenge.expires).toLocaleTimeString()}.`;
  $('profile-actions').hidden=false;$('profile-sign').hidden=challenge.action==='unlink'||challenge.method==='transfer';$('profile-remove').hidden=challenge.action!=='unlink';
  if(challenge.action==='link'&&challenge.method==='transfer'){
   $('profile-transfer').hidden=false;$('profile-transfer-details').textContent=`Amount: 0.${String(challenge.amount).padStart(6,'0')} STX\nTo: ${challenge.support}\nFrom: ${challenge.owner}\nMemo (required): XM${challenge.id.slice(0,30)}`;
  }
 }catch(e){status((e as Error).message);}
}
void init();
