import {removeConfirmedLocalLikes} from '../lib/radio/local-like-cleanup';
import {createStacksWalletAdapter} from '../lib/wallet/adapter';
import {showContractCall,type WalletCallProgress} from '../lib/wallet/connect';
import {buildLikeCall,likeFeeSuggestion,importCandidates,type LikeChange} from '../lib/radio/onchain-likes';
const wallet=createStacksWalletAdapter({appName:'Xtrata Radio',appIcon:'/favicon.ico'});
const el=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
let config:any,tracks:any[]=[],states=new Map<number,{liked:boolean;total:string}>(),busy=false,loading=false,generation=0;
const pendingMemory=new Map<string,string>();
let statesWallet:string|undefined;
let reviewWallet='',reviewChanges:LikeChange[]=[];
const selectedId=new URL(location.href).searchParams.get('id');
const directReview=new URL(location.href).searchParams.get('action')==='review'&&selectedId!==null;
let reviewedWallet:string|undefined;
const status=(message:string)=>{el('status').textContent=message;};
const logStart=Date.now(),logLines:string[]=[];
const diagnostic=(stage:string,details:Record<string,string|number|boolean>={})=>{
 const entry={stage,elapsedMs:Date.now()-logStart,...details};
 // eslint-disable-next-line no-console
 console.info('[radio:likes]',entry);
 logLines.push(JSON.stringify(entry));if(logLines.length>100)logLines.shift();
 const output=document.getElementById('diagnostics');if(output)output.textContent=logLines.join('\n');
};
const progressText:Record<WalletCallProgress,string>={
 'provider-selected':'Wallet provider selected. Preparing the request…',
 'account-read':'Checking the active Xverse account. The transaction prompt has not been requested yet…',
 'account-cached':'Verified wallet account available. Preparing the transaction…',
 'account-read-failed':'Xverse did not provide its account. Trying its connection flow…',
 'account-reconnect':'Waiting for Xverse to confirm account access. Open the extension and check for a connection request.',
 'signing-request':'Transaction approval requested. Open your wallet to review the songs and network fee.',
 'legacy-request':'Wallet popup requested. Check your extension and browser popup permissions.'
};
diagnostic('PAGE_READY',{version:'likes-debug-1'});

const pendingKey=()=>`xtrata.radio.chain.pending:${config?.contract}:${wallet.getSession().address}`;
const pending=()=>{try{return localStorage.getItem(pendingKey())||pendingMemory.get(pendingKey())||'';}catch{return pendingMemory.get(pendingKey())||'';}};
async function api(params:Record<string,string>={}){
 const response=await fetch('/radio/chain-likes?'+new URLSearchParams(params),{cache:'no-store',signal:AbortSignal.timeout(20000)});const data=await response.json();if(!response.ok)throw Error(data.error||'Could not read on-chain likes.');return data;
}
function render(){
 const session=wallet.getSession(),connected=session.isConnected&&session.network==='mainnet'&&statesWallet===session.address,waiting=!!pending();
 let saved:unknown=[];try{saved=JSON.parse(localStorage.getItem('xtrata.radio.likes')||'[]');}catch{ /* no import available */ }
 const localCount=Array.isArray(saved)?new Set(saved.map(row=>String(row?.tokenId))).size:0;
 const remaining=connected&&!loading?importCandidates(saved,new Set(tracks.map(t=>t.id)),new Set([...states].filter(([,s])=>s.liked).map(([id])=>id))).length:localCount;
 el('import-offer').textContent=!directReview&&localCount ? remaining ? `You have ${remaining} saved favourites to review for on-chain import. ${connected?'Use the import button below.':'Connect your wallet to check which ones still need importing.'} Nothing is published automatically.` : 'All eligible saved favourites are already liked by this wallet on-chain.' : '';
 el('wallet').textContent=connected?`Wallet: ${session.address}`:'';
 el<HTMLButtonElement>('disconnect').disabled=!session.isConnected||busy;
 el<HTMLButtonElement>('connect').disabled=busy;
 el<HTMLButtonElement>('import').hidden=Boolean(directReview);
 el<HTMLButtonElement>('import').disabled=Boolean(directReview)||!config?.enabled||!connected||busy||loading||waiting;
 el('pending').replaceChildren();if(waiting){const a=document.createElement('a');a.href='https://explorer.hiro.so/txid/'+pending()+'?chain=mainnet';a.target='_blank';a.rel='noopener';a.textContent='Transaction pending — view on explorer. Use Refresh to check confirmation.';el('pending').append(a);}
 const selected=new URL(location.href).searchParams.get('id');
 el('songs').replaceChildren();for(const track of tracks.filter(t=>!directReview||String(t.id)===selectedId).sort((a,b)=>Number(String(b.id)===selected)-Number(String(a.id)===selected))){
  const row=document.createElement('tr'),title=document.createElement('td'),count=document.createElement('td'),action=document.createElement('td'),button=document.createElement('button');
  title.textContent=`#${track.id} · ${track.title}`;const state=states.get(track.id);count.textContent=state?.total??'—';
  button.textContent=state?.liked?'Unlike on-chain':'Like on-chain';button.disabled=!connected||!state||!config?.enabled||busy||loading||waiting;
  button.onclick=()=>review([{id:track.id,liked:!state?.liked}]);action.append(button);row.append(title,count,action);el('songs').append(row);
 }
}
let feeGeneration=0;
const selectedChanges=()=>reviewChanges.filter(c=>el('choices').querySelector<HTMLInputElement>(`input[data-id="${c.id}"]`)?.checked);
async function updateFeeSuggestion(){
 const run=++feeGeneration,changes=selectedChanges();
 el<HTMLButtonElement>('approve').disabled=true;
 el('fee-suggestion').textContent=changes.length?'Calculating a low-fee suggestion…':'Select at least one song.';
 try {
  if(!changes.length)return;
  const fee=await likeFeeSuggestion(config.contract,changes,wallet.getSession());
  if(run!==feeGeneration)return;
  const panel=el('fee-suggestion');panel.replaceChildren();
  const label=document.createElement('span');label.className='fee-label';label.textContent=fee.count===1?'CUSTOM NETWORK FEE · ONE SONG':'SUGGESTED MINIMUM · BATCH TOTAL';
  const amount=document.createElement('strong');amount.className='fee-amount';amount.textContent=fee.count===1?'0.0002 STX':fee.totalStx+' STX';
  const instructions=document.createElement('p');
  instructions.textContent=fee.count===1?'Choose Custom in your wallet and enter 0.0002 STX (200 microSTX). Pay no more for this like or unlike. If the wallet shows a higher fee, change it or cancel before signing.':'Suggested minimum fee: '+fee.totalStx+' STX total ('+fee.microStx+' microSTX). Approximately '+fee.perSongStx+' STX per song for '+fee.count+' songs. Choose the custom network fee in your wallet if its suggestion is higher.';
  const note=document.createElement('p');note.className='fee-note';note.textContent=fee.count===1?'We request 0.0002 STX from your wallet. Xtrata charges no platform fee. Confirmation may take longer at this fee; if it is not accepted, cancel and try later.':'This is the standard single-signature relay minimum, not a guarantee of fast confirmation. Xtrata charges no platform fee. Check the final fee before signing.';
  panel.append(label,amount,instructions,note);

  el<HTMLButtonElement>('approve').disabled=false;
 }catch{if(run===feeGeneration){el('fee-suggestion').textContent='Fee suggestion unavailable. Review the fee shown by your wallet.';el<HTMLButtonElement>('approve').disabled=false;}}
}
el('choices').addEventListener('change',()=>void updateFeeSuggestion());
function review(changes:LikeChange[]){
 diagnostic('REVIEW_OPEN',{count:changes.length});
 reviewWallet=wallet.getSession().address||'';reviewChanges=changes;el('choices').replaceChildren();
 for(const change of changes){const label=document.createElement('label'),box=document.createElement('input');box.type='checkbox';box.checked=true;box.dataset.id=String(change.id);label.append(box,document.createTextNode(`${change.liked?'Like':'Unlike'} #${change.id} · ${tracks.find(t=>t.id===change.id)?.title||''}`));el('choices').append(label,document.createElement('br'));}
 el('review-note').textContent=changes.length===1?'Review this song and fee, then continue to your wallet. Cancelling sends nothing.':'Up to 25 songs per transaction. Already confirmed likes are skipped on import. Cancelling sends nothing.';
 el('fee-reminder').textContent='';
 void updateFeeSuggestion();
 el<HTMLDialogElement>('review').showModal();
}
async function refresh(){
 diagnostic('REFRESH_START');
 const run=++generation;loading=true;states.clear();statesWallet=undefined;render();
 try {
  const nextConfig=await api();if(run!==generation)return;config=nextConfig;diagnostic('CONFIG_READ',{enabled:Boolean(config.enabled)});
  if(!config.enabled){status('On-chain likes are not activated on this site yet. Your previous favourites remain saved in this browser; imports and new likes will become available after activation.');return;}
  const session=wallet.getSession(),address=session.network==='mainnet'?session.address:undefined;
  const result=await fetch('/radio/counts?range=all&chainLikes=0',{cache:'no-store'});if(!result.ok)throw Error('Song catalogue unavailable.');const catalogue=await result.json();if(run!==generation)return;tracks=catalogue.tracks;
  // Resolve the transaction first, then fetch its resulting on-chain state.
  const txid=pending();let transactionStatus='';
  if(txid&&address){try{const tx=await api({txid,wallet:address});if(run!==generation)return;
   if(tx.status==='confirmed'||tx.status==='failed'){pendingMemory.delete(pendingKey());try{localStorage.removeItem(pendingKey());}catch{ /* memory fallback */ }transactionStatus=tx.status;}
  }catch{diagnostic('TRANSACTION_STATUS_UNAVAILABLE');}}
  const next=new Map<number,{liked:boolean;total:string}>();let failed=0;
  const requested=tracks.filter(t=>!directReview||String(t.id)===selectedId);
  for(let i=0;i<requested.length;i+=25){
   const params={ids:requested.slice(i,i+25).map(t=>t.id).join(','),...(address?{wallet:address}:{})};
   try{
    let data;try{data=await api(params);}catch{data=await api(params);}
    if(run!==generation||address!==(wallet.getSession().network==='mainnet'?wallet.getSession().address:undefined))return;
    if(data.contract!==config.contract)throw Error('Contract configuration changed.');
    for(const r of data.rows)next.set(r.id,r);
    states=new Map(next);statesWallet=address;render();
   }catch{failed++;diagnostic('STATE_BATCH_UNAVAILABLE',{batch:i/25});}
  }
  if(run!==generation)return;states=next;statesWallet=address;
  diagnostic('STATES_READY',{tracks:next.size,connected:Boolean(address),failedBatches:failed});
  status(failed?'Some on-chain likes could not be read. Available totals are shown; Refresh retries missing songs.':transactionStatus==='confirmed'?'Transaction confirmed. On-chain likes refreshed.':transactionStatus==='failed'?'Transaction failed; your like state was not changed.':'Confirmed on-chain likes across all wallets. Your button reflects the connected wallet.');
  // Also reconciles imports completed before this browser version was deployed.
  if(run===generation&&address===wallet.getSession().address&&wallet.getSession().isConnected&&!pending()){
   const removed=removeConfirmedLocalLikes([...states].filter(([,state])=>state.liked===true).map(([id])=>id));
   if(removed)diagnostic('LOCAL_FAVOURITES_CLEANED',{removed});
  }
 }catch(e){if(run===generation)status(e instanceof Error?e.message:'Unable to refresh.');}
 finally{if(run===generation){loading=false;render();
   const session=wallet.getSession(),id=Number(selectedId),state=states.get(id);
   if(directReview&&!busy&&!pending()&&session.isConnected&&session.address===statesWallet&&state&&reviewedWallet!==session.address){reviewedWallet=session.address;review([{id,liked:!state.liked}]);}
  }}
}
el('connect').onclick=async()=>{diagnostic('CONNECT_CLICK');try{await wallet.connect();diagnostic('CONNECT_RETURNED',{connected:wallet.getSession().isConnected,network:wallet.getSession().network||'unknown'});await refresh();}catch(e){diagnostic('CONNECT_FAILED');status(String(e));}};
el('disconnect').onclick=async()=>{await wallet.disconnect();await refresh();};
el('refresh').onclick=()=>void refresh();
el('import').onclick=()=>{diagnostic('IMPORT_CLICK');try{
 const saved=JSON.parse(localStorage.getItem('xtrata.radio.likes')||'[]');
 const ids=importCandidates(saved,new Set(tracks.map(t=>t.id)),new Set([...states].filter(([,s])=>s.liked).map(([id])=>id)));
 diagnostic('IMPORT_FILTERED',{saved:Array.isArray(saved)?saved.length:0,eligible:ids.length});
 if(!ids.length){status('No unimported saved songs were found in this browser.');return;}
 review(ids.slice(0,25).map(id=>({id,liked:true})));
 if(ids.length>25)el('review-note').textContent=`Showing the first 25 of ${ids.length} remaining favourites. After confirmation, import again to review the next batch.`;
 }catch{status('Saved favourites could not be read.');}};
el('cancel').onclick=()=>{diagnostic('REVIEW_CANCEL');el<HTMLDialogElement>('review').close();};
el('approve').onclick=async()=>{
 diagnostic('APPROVE_CLICK',{busy,loading,pending:Boolean(pending())});
 if(busy||loading||pending()){diagnostic('APPROVE_BLOCKED');return;}
 let waitingTimer:ReturnType<typeof setInterval>|undefined;
 const changes=selectedChanges();
 el('fee-reminder').replaceChildren(...Array.from(el('fee-suggestion').childNodes,node=>node.cloneNode(true)));
 try {
  const session=wallet.getSession();if(session.address!==reviewWallet||session.address!==statesWallet)throw Error('Wallet changed. Review these songs again.');
  const call=buildLikeCall(config.contract,changes,session);const key=pendingKey();busy=true;render();el<HTMLDialogElement>('review').close();status('Review the network fee in your wallet. No platform fee or token transfer is requested.');
  diagnostic('WALLET_CALL_START',{count:changes.length,functionName:call.functionName});
  let lastStage='provider-selected';const requestedAt=Date.now();
  waitingTimer=setInterval(()=>{diagnostic('WALLET_STILL_WAITING',{lastStage,waitingMs:Date.now()-requestedAt});status('Still waiting for the wallet ('+lastStage+'). Check the extension. Do not submit again while this request is pending. See the diagnostic log below.');},35000);
  await new Promise<void>((resolve,reject)=>showContractCall({...call,onProgress:stage=>{lastStage=stage;diagnostic('WALLET_PROGRESS',{walletStage:stage});status(progressText[stage]);},onFinish:result=>{diagnostic('WALLET_FINISH',{hasTransactionId:Boolean(result.txId)});const txid=String(result.txId||'');if(!/^(0x)?[0-9a-f]{64}$/i.test(txid)){reject(Error('Wallet did not return a transaction ID. Check your wallet before trying again.'));return;}const normalized=txid.startsWith('0x')?txid:'0x'+txid;pendingMemory.set(key,normalized);try{localStorage.setItem(key,normalized);}catch{status('Transaction submitted: '+normalized+'. Save this ID; browser storage is unavailable.');}resolve();},onCancel:()=>{diagnostic('WALLET_CANCEL');reject(Error('Cancelled. No on-chain change was requested.'));},onError:error=>{diagnostic('WALLET_ERROR');reject(error);}}));
  status('Submitted. Your totals will change after confirmation. Use Refresh to check progress.');
 }catch(e){diagnostic('APPROVAL_FAILED');status(e instanceof Error?e.message:'Wallet request failed.');}finally{if(waitingTimer)clearInterval(waitingTimer);diagnostic('WALLET_FLOW_SETTLED');busy=false;render();}
};
window.addEventListener('storage',event=>{if(!busy&&(event.key===null||event.key==='xtrata.v15.1.wallet.session')){el<HTMLDialogElement>('review').close();void refresh();}});
window.setInterval(()=>{if(!document.hidden&&!busy&&!loading&&!el<HTMLDialogElement>('review').open)void refresh();},30000);
void refresh();
