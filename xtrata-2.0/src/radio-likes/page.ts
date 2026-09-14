import {createStacksWalletAdapter} from '../lib/wallet/adapter';
import {showContractCall,type WalletCallProgress} from '../lib/wallet/connect';
import {buildLikeCall,likeFeeSuggestion,importCandidates,type LikeChange} from '../lib/radio/onchain-likes';
const wallet=createStacksWalletAdapter({appName:'Xtrata Radio',appIcon:'/favicon.ico'});
const el=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
let config:any,tracks:any[]=[],states=new Map<number,{liked:boolean;total:string}>(),busy=false,loading=false,generation=0;
const pendingMemory=new Map<string,string>();
let statesWallet:string|undefined;
let reviewWallet='',reviewChanges:LikeChange[]=[];
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
 el('import-offer').textContent=localCount ? remaining ? `You have ${remaining} saved favourites to review for on-chain import. ${connected?'Use the import button below.':'Connect your wallet to check which ones still need importing.'} Nothing is published automatically.` : 'All eligible saved favourites are already liked by this wallet on-chain.' : '';
 el('wallet').textContent=connected?`Wallet: ${session.address}`:'';
 el<HTMLButtonElement>('disconnect').disabled=!session.isConnected||busy;
 el<HTMLButtonElement>('connect').disabled=busy;
 el<HTMLButtonElement>('import').disabled=!config?.enabled||!connected||busy||loading||waiting;
 el('pending').replaceChildren();if(waiting){const a=document.createElement('a');a.href='https://explorer.hiro.so/txid/'+pending()+'?chain=mainnet';a.target='_blank';a.rel='noopener';a.textContent='Transaction pending — view on explorer. Use Refresh to check confirmation.';el('pending').append(a);}
 const selected=new URL(location.href).searchParams.get('id');
 el('songs').replaceChildren();for(const track of [...tracks].sort((a,b)=>Number(String(b.id)===selected)-Number(String(a.id)===selected))){
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
  el('fee-suggestion').textContent=`Suggested minimum fee: ${fee.totalStx} STX total (${fee.microStx} microSTX).`+(fee.count>1?` Approximately ${fee.perSongStx} STX per song for ${fee.count} songs.`:'')+' In your wallet, choose the custom network fee if its suggestion is higher. This is the standard single-signature relay minimum, not a promise of fast confirmation; a higher fee may be needed when busy. Check the final wallet fee before signing. Xtrata charges no platform fee.';
  el<HTMLButtonElement>('approve').disabled=false;
 }catch{if(run===feeGeneration){el('fee-suggestion').textContent='Fee suggestion unavailable. Review the fee shown by your wallet.';el<HTMLButtonElement>('approve').disabled=false;}}
}
el('choices').addEventListener('change',()=>void updateFeeSuggestion());
function review(changes:LikeChange[]){
 diagnostic('REVIEW_OPEN',{count:changes.length});
 reviewWallet=wallet.getSession().address||'';reviewChanges=changes;el('choices').replaceChildren();
 for(const change of changes){const label=document.createElement('label'),box=document.createElement('input');box.type='checkbox';box.checked=true;box.dataset.id=String(change.id);label.append(box,document.createTextNode(`${change.liked?'Like':'Unlike'} #${change.id} · ${tracks.find(t=>t.id===change.id)?.title||''}`));el('choices').append(label,document.createElement('br'));}
 el('review-note').textContent='Up to 25 songs per transaction. Already confirmed likes are skipped on import. Closing or cancelling this review sends nothing.';
 el('fee-reminder').textContent='';
 void updateFeeSuggestion();
 el<HTMLDialogElement>('review').showModal();
}
async function refresh(){
 diagnostic('REFRESH_START');
 const run=++generation;loading=true;states.clear();render();
 try {
  const nextConfig=await api();if(run!==generation)return;config=nextConfig;diagnostic('CONFIG_READ',{enabled:Boolean(config.enabled)});
  if(!config.enabled){status('On-chain likes are not activated on this site yet. Your previous favourites remain saved in this browser; imports and new likes will become available after activation.');return;}
  const session=wallet.getSession(),address=session.network==='mainnet'?session.address:undefined;
  const result=await fetch('/radio/counts?range=all',{cache:'no-store'});if(!result.ok)throw Error('Song catalogue unavailable.');const catalogue=await result.json();if(run!==generation)return;tracks=catalogue.tracks;
  const next=new Map();for(let i=0;i<tracks.length;i+=25){const data=await api({ids:tracks.slice(i,i+25).map(t=>t.id).join(','),...(address?{wallet:address}:{})});if(run!==generation)return;if(data.contract!==config.contract)throw Error('Contract configuration changed. Refresh before continuing.');for(const r of data.rows)next.set(r.id,r);}
  if(run!==generation)return;states=next;statesWallet=address;diagnostic('STATES_READY',{tracks:tracks.length,connected:Boolean(address)});status('Confirmed on-chain likes. Saved browser favourites are not included.');
  const txid=pending();if(txid&&address){const tx=await api({txid,wallet:address});if(run!==generation)return;if(tx.status==='confirmed'||tx.status==='failed'){pendingMemory.delete(pendingKey());try{localStorage.removeItem(pendingKey());}catch{ /* memory fallback */ }status(tx.status==='confirmed'?'Transaction confirmed. Refresh if the latest count has not appeared yet.':'Transaction failed; it did not change your on-chain likes. A network fee may still have been paid.');}}
 }catch(e){if(run===generation)status(e instanceof Error?e.message:'Unable to refresh.');}
 finally{if(run===generation){loading=false;render();}}
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
 el('fee-reminder').textContent=el('fee-suggestion').textContent;
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
void refresh();
