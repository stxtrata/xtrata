import {createStacksWalletAdapter} from '../lib/wallet/adapter';
import {showContractCall} from '../lib/wallet/connect';
import {buildLikeCall,importCandidates,type LikeChange} from '../lib/radio/onchain-likes';
const wallet=createStacksWalletAdapter({appName:'Xtrata Radio',appIcon:'/favicon.ico'});
const el=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
let config:any,tracks:any[]=[],states=new Map<number,{liked:boolean;total:string}>(),busy=false,loading=false,generation=0;
const pendingMemory=new Map<string,string>();
let statesWallet:string|undefined;
let reviewWallet='',reviewChanges:LikeChange[]=[];
const status=(message:string)=>{el('status').textContent=message;};
const pendingKey=()=>`xtrata.radio.chain.pending:${config?.contract}:${wallet.getSession().address}`;
const pending=()=>{try{return localStorage.getItem(pendingKey())||pendingMemory.get(pendingKey())||'';}catch{return pendingMemory.get(pendingKey())||'';}};
async function api(params:Record<string,string>={}){
 const response=await fetch('/radio/chain-likes?'+new URLSearchParams(params),{cache:'no-store',signal:AbortSignal.timeout(20000)});const data=await response.json();if(!response.ok)throw Error(data.error||'Could not read on-chain likes.');return data;
}
function render(){
 const session=wallet.getSession(),connected=session.isConnected&&session.network==='mainnet'&&statesWallet===session.address,waiting=!!pending();
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
function review(changes:LikeChange[]){
 reviewWallet=wallet.getSession().address||'';reviewChanges=changes;el('choices').replaceChildren();
 for(const change of changes){const label=document.createElement('label'),box=document.createElement('input');box.type='checkbox';box.checked=true;box.dataset.id=String(change.id);label.append(box,document.createTextNode(`${change.liked?'Like':'Unlike'} #${change.id} · ${tracks.find(t=>t.id===change.id)?.title||''}`));el('choices').append(label,document.createElement('br'));}
 el('review-note').textContent='Up to 25 songs per transaction. Already confirmed likes are skipped on import. Closing or cancelling this review sends nothing.';
 el<HTMLDialogElement>('review').showModal();
}
async function refresh(){
 const run=++generation;loading=true;states.clear();render();
 try {
  const nextConfig=await api();if(run!==generation)return;config=nextConfig;
  if(!config.enabled){status('On-chain likes are not activated yet. Your saved favourites still work.');return;}
  const session=wallet.getSession(),address=session.network==='mainnet'?session.address:undefined;
  const result=await fetch('/radio/counts?range=all',{cache:'no-store'});if(!result.ok)throw Error('Song catalogue unavailable.');const catalogue=await result.json();if(run!==generation)return;tracks=catalogue.tracks;
  const next=new Map();for(let i=0;i<tracks.length;i+=25){const data=await api({ids:tracks.slice(i,i+25).map(t=>t.id).join(','),...(address?{wallet:address}:{})});if(run!==generation)return;if(data.contract!==config.contract)throw Error('Contract configuration changed. Refresh before continuing.');for(const r of data.rows)next.set(r.id,r);}
  if(run!==generation)return;states=next;statesWallet=address;status('Confirmed on-chain likes. Saved browser favourites are not included.');
  const txid=pending();if(txid&&address){const tx=await api({txid,wallet:address});if(run!==generation)return;if(tx.status==='confirmed'||tx.status==='failed'){pendingMemory.delete(pendingKey());try{localStorage.removeItem(pendingKey());}catch{ /* memory fallback */ }status(tx.status==='confirmed'?'Transaction confirmed. Refresh if the latest count has not appeared yet.':'Transaction failed; it did not change your on-chain likes. A network fee may still have been paid.');}}
 }catch(e){if(run===generation)status(e instanceof Error?e.message:'Unable to refresh.');}
 finally{if(run===generation){loading=false;render();}}
}
el('connect').onclick=async()=>{try{await wallet.connect();await refresh();}catch(e){status(String(e));}};
el('disconnect').onclick=async()=>{await wallet.disconnect();await refresh();};
el('refresh').onclick=()=>void refresh();
el('import').onclick=()=>{try{
 const saved=JSON.parse(localStorage.getItem('xtrata.radio.likes')||'[]');
 const ids=importCandidates(saved,new Set(tracks.map(t=>t.id)),new Set([...states].filter(([,s])=>s.liked).map(([id])=>id)));
 if(!ids.length){status('No unimported saved songs were found in this browser.');return;}
 review(ids.slice(0,25).map(id=>({id,liked:true})));
 if(ids.length>25)el('review-note').textContent=`Showing the first 25 of ${ids.length} remaining favourites. After confirmation, import again to review the next batch.`;
 }catch{status('Saved favourites could not be read.');}};
el('cancel').onclick=()=>el<HTMLDialogElement>('review').close();
el('approve').onclick=async()=>{
 if(busy||loading||pending())return;
 const changes=reviewChanges.filter(c=>el('choices').querySelector<HTMLInputElement>(`input[data-id="${c.id}"]`)?.checked);
 try {
  const session=wallet.getSession();if(session.address!==reviewWallet||session.address!==statesWallet)throw Error('Wallet changed. Review these songs again.');
  const call=buildLikeCall(config.contract,changes,session);const key=pendingKey();busy=true;render();el<HTMLDialogElement>('review').close();status('Review the network fee in your wallet. No platform fee or token transfer is requested.');
  await new Promise<void>((resolve,reject)=>showContractCall({...call,onFinish:result=>{const txid=String(result.txId||'');if(!/^(0x)?[0-9a-f]{64}$/i.test(txid)){reject(Error('Wallet did not return a transaction ID. Check your wallet before trying again.'));return;}const normalized=txid.startsWith('0x')?txid:'0x'+txid;pendingMemory.set(key,normalized);try{localStorage.setItem(key,normalized);}catch{status('Transaction submitted: '+normalized+'. Save this ID; browser storage is unavailable.');}resolve();},onCancel:()=>reject(Error('Cancelled. No on-chain change was requested.')),onError:reject}));
  status('Submitted. Your totals will change after confirmation. Use Refresh to check progress.');
 }catch(e){status(e instanceof Error?e.message:'Wallet request failed.');}finally{busy=false;render();}
};
void refresh();
