import {radioArtist,radioTitle} from './artist-credits.mjs';
import {removeConfirmedLocalLikes} from './local-like-cleanup';
import type {WalletSession} from '../wallet/types';
type Track={id:number;title:string;artist?:string};
/** `by`: which addresses liked it (the wallet and/or its linked listening wallets), when the server reports it. */
export type ConfirmedRadioLike={tokenId:string;title:string;artist:string;by?:string[]};
export type RadioOnchainStatus='disconnected'|'loading'|'ready'|'partial'|'unavailable'|'paused';
/** `checkedAt`: last time this wallet's likes were fully confirmed. `retryAt`: when the next automatic attempt is due after a failure. */
export type RadioOnchainSnapshot={wallet?:string;status:RadioOnchainStatus;likes:ConfirmedRadioLike[];checkedAt?:number;retryAt?:number};
type Snapshot=RadioOnchainSnapshot;
const THROTTLE_MS=60000,BACKOFF_MS=[30000,60000,120000,300000],NETWORK_RETRY_MS=1500;
class HttpFailure extends Error{status:number;retryAfter?:number;constructor(status:number,retryAfter?:number){super('Unavailable');this.status=status;this.retryAfter=retryAfter;}}
const retryAfterOf=(r:Response)=>{const n=Number(r.headers?.get('retry-after'));return Number.isFinite(n)&&n>0?Math.min(n,600)*1000:undefined;};
const pause=(ms:number)=>new Promise<void>(resolve=>setTimeout(resolve,ms));
/** Read-only, wallet-scoped state. No local favourites are merged into confirmed likes. */
export function createRadioOnchainState(options:{wallet:()=>WalletSession;changed:()=>void;metadata?:(id:string)=>{title?:string;artist?:string}|null|undefined;fetcher?:typeof fetch;now?:()=>number;wait?:(ms:number)=>Promise<void>;random?:()=>number}){
 const fetcher=options.fetcher||fetch,now=options.now||Date.now,wait=options.wait||pause,random=options.random||Math.random;
 let contractSeen:string|undefined;
 let state:Snapshot={status:'disconnected',likes:[]},generation=0,nextAt=-Infinity,failures=0,active:AbortController|undefined;
 const address=()=>{const s=options.wallet();return s.isConnected&&s.network==='mainnet'?s.address:undefined;};
 const snapshot=():Snapshot=>{
  if(state.wallet!==address())return {wallet:address(),status:address()?'loading':'disconnected',likes:[]};
  return {...state,likes:state.likes.map(l=>{const meta=options.metadata?.(l.tokenId);return {...l,title:radioTitle(l.tokenId,meta?.title&&!/^(?:Inscription )?#\d+$/.test(meta.title)?meta.title:l.title),artist:radioArtist(l.tokenId,meta?.artist||l.artist)};})};
 };
 /**
  * `force` skips the normal 60 s throttle (focus, visibility) but never an active failure backoff.
  * `manual` (the refresh button, a wallet change) is an explicit user action and always runs.
  */
 async function refresh(force=false,manual=false){
  const wallet=address();
  if(wallet&&wallet===state.wallet&&now()<nextAt&&!manual&&!(force&&!failures))return;
  const run=++generation;active?.abort();active=new AbortController();const signal=active.signal;
  if(!wallet){state={status:'disconnected',likes:[]};failures=0;nextAt=-Infinity;options.changed();return;}
  nextAt=now()+THROTTLE_MS;
  let previous=state.wallet===wallet?state.likes:[];const previousChecked=state.wallet===wallet?state.checkedAt:undefined;
  state={wallet,status:'loading',likes:previous,checkedAt:previousChecked};options.changed();
  // HTTP errors are never retried here (the server already rotated keys); only a dropped connection or timeout gets one quick retry.
  const read=async(url:string)=>{
   for(let attempt=0;attempt<2;attempt++)try{
    const r=await fetcher(url,{cache:'no-store',signal:AbortSignal.any([signal,AbortSignal.timeout(20000)])});
    if(!r.ok)throw new HttpFailure(r.status,retryAfterOf(r));
    return await r.json();
   }catch(error){if(signal.aborted||error instanceof HttpFailure||attempt===1)throw error;await wait(NETWORK_RETRY_MS);if(signal.aborted)throw error;}
  };
  let retryAfter=0;const note=(error:unknown)=>{if(error instanceof HttpFailure&&error.retryAfter)retryAfter=Math.max(retryAfter,error.retryAfter);};
  try{
   const config=await read('/radio/chain-likes');if(!config.enabled){previous=[];throw Error('Not activated');}
   if(contractSeen&&contractSeen!==config.contract)previous=[];contractSeen=config.contract;
   const catalogue=await read('/radio/counts?range=all&chainLikes=0');const tracks=catalogue.tracks as Track[];
   const likes:ConfirmedRadioLike[]=[];const freshlyConfirmed:string[]=[];let failed=0,halted=false;
   for(let i=0;i<tracks.length;i+=25){const batch=tracks.slice(i,i+25);
    // After the server says it is throttled or down, stop asking: keep the remaining batches' last confirmed likes.
    if(halted){failed++;likes.push(...previous.filter(l=>batch.some(t=>String(t.id)===l.tokenId)));continue;}
    try{
     const data=await read('/radio/chain-likes?'+new URLSearchParams({wallet,ids:batch.map(t=>t.id).join(',')}));
     if(data.contract!==config.contract||!Array.isArray(data.rows)||batch.some(t=>!data.rows.some((r:any)=>r.id===t.id&&typeof r.liked==='boolean')))throw Error('Invalid state response');
     for(const row of data.rows){const track=batch.find(t=>t.id===row.id);if(track&&row.liked===true){likes.push({tokenId:String(track.id),title:track.title,artist:track.artist||'',...(Array.isArray(row.by)?{by:row.by.filter((a:unknown)=>typeof a==='string')}:{})});freshlyConfirmed.push(String(track.id));}}
    }catch(error){if(signal.aborted)throw error;if(error instanceof HttpFailure){halted=true;note(error);}failed++;likes.push(...previous.filter(l=>batch.some(t=>String(t.id)===l.tokenId)));}
   }
   if(run!==generation||wallet!==address())return;
   if(failed){failures++;state={wallet,status:'partial',likes,checkedAt:previousChecked};}
   else{failures=0;state={wallet,status:'ready',likes,checkedAt:now()};}
   removeConfirmedLocalLikes(freshlyConfirmed);
  }catch(error){if(run!==generation||wallet!==address())return;note(error);failures++;state={wallet,status:'unavailable',likes:previous,checkedAt:previousChecked};}
  if(failures){
   const base=BACKOFF_MS[Math.min(failures-1,BACKOFF_MS.length-1)],jittered=base*(0.8+random()*0.4);
   const delay=Math.max(jittered,retryAfter);nextAt=now()+delay;
   state={...state,status:failures>=2&&state.status!=='partial'?'paused':state.status,retryAt:nextAt};
  }else nextAt=now()+THROTTLE_MS;
  options.changed();
 }
 return {snapshot,refresh};
}
