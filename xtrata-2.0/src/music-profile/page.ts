import {signStructuredMessage, legacyNetworkFromConnectNetwork} from '@stacks/connect';
import {connectWallet, disconnectWallet, getStacksProvider, getSelectedWalletProviderId} from '../lib/wallet/connect';
import {createWalletSessionStore} from '../lib/wallet/session';
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
const store=createWalletSessionStore();
let wallet=store.load();
function renderWallet(){
 $('profile-wallet-address').textContent=wallet.address?`Connected: ${wallet.address}`:'Connect the wallet that owns your BNS name.';
 $('profile-connect').textContent=wallet.isConnected?'Switch wallet':'Connect wallet';
 $('profile-disconnect').hidden=!wallet.isConnected;
}
async function connect(){
 wallet=await connectWallet({appName:'Xtrata Music Heroes',appIcon:location.origin+'/favicon.ico'});
 store.save(wallet);renderWallet();
 return wallet.isConnected;
}
$('profile-connect').onclick=async()=>{if(busy)return;busy=true;try{await connect();status(wallet.isConnected?'Wallet connected. You can now verify your BNS link.':'Connection cancelled.');}catch(e){status((e as Error).message);}finally{busy=false;}};
$('profile-disconnect').onclick=async()=>{if(busy)return;busy=true;try{await disconnectWallet();store.clear();wallet=store.load();renderWallet();status('Wallet disconnected.');}catch(e){status((e as Error).message);}finally{busy=false;}};
renderWallet();
$('profile-sign').onclick=async()=>{
 if(busy||!challenge)return;busy=true;status('Approve the profile message in the wallet that owns this BNS name. No transaction is requested.');
 try{
  if(!wallet.isConnected&&!(await connect())){status('Connect your BNS wallet to verify.');return;}
  if(wallet.address!==challenge.owner)throw Error('The connected wallet does not own this BNS name. Use Switch wallet to select '+challenge.owner+'.');
  if(Date.now()>challenge.expires)throw Error('This request expired. Start a new request in the music app.');
  let provider=getStacksProvider();
  // Xverse's account picker uses its Bitcoin bridge; structured signing lives
  // on its Stacks bridge. Keep the user's selected wallet family.
  if(/xverse/i.test(getSelectedWalletProviderId()||'')&&typeof provider?.structuredDataSignatureRequest!=='function'){
   const w=window as any;provider=w.XverseProviders?.StacksProvider??w.xverseProviders?.StacksProvider;
  }
  if(typeof provider?.structuredDataSignatureRequest!=='function')throw Error('This wallet does not expose structured-message signing. Try a supported Stacks wallet or choose transfer verification in the music app.');
  // Build an unsigned request envelope directly. The legacy popup helper reads
  // Blockstack user data even when an explicit address was supplied.
  const token=await signStructuredMessage({...profileData(challenge,'owner'),network:legacyNetworkFromConnectNetwork('mainnet'),stxAddress:challenge.owner});
  const result=await provider.structuredDataSignatureRequest(token);
  if(!result?.signature)throw Error('The wallet did not return a signature. Nothing was linked.');
  busy=false;await finish({ownerProof:result.signature});
 }catch(e){status((e as Error).message||'Verification cancelled. Nothing changed.');}finally{busy=false;}
};
$('profile-check').onclick=()=>void finish({txid:($('profile-txid') as HTMLInputElement).value.trim()});
$('profile-remove').onclick=()=>void finish();
async function init(){
 try{
  const fragment=location.hash.slice(1);history.replaceState(null,'',location.pathname);
  if(!fragment||fragment.length>2048)throw Error('Reopen “Continue on Xtrata” in the music app to resume your request, or start there if you have not created one. Do not resend a pending transfer.');
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
