import {radioArtist} from './artist-credits.mjs';
import {removeConfirmedLocalLikes} from './local-like-cleanup';
import type {WalletSession} from '../wallet/types';
type Track={id:number;title:string;artist?:string};
export type ConfirmedRadioLike={tokenId:string;title:string;artist:string};
type Snapshot={wallet?:string;status:'disconnected'|'loading'|'ready'|'partial'|'unavailable';likes:ConfirmedRadioLike[]};
/** Read-only, wallet-scoped state. No local favourites are merged into confirmed likes. */
export function createRadioOnchainState(options:{wallet:()=>WalletSession;changed:()=>void;metadata?:(id:string)=>{title?:string;artist?:string}|null|undefined;fetcher?:typeof fetch;now?:()=>number}){
 const fetcher=options.fetcher||fetch,now=options.now||Date.now;
 let contractSeen:string|undefined;
 let state:Snapshot={status:'disconnected',likes:[]},generation=0,last=-Infinity,active:AbortController|undefined;
 const address=()=>{const s=options.wallet();return s.isConnected&&s.network==='mainnet'?s.address:undefined;};
 const snapshot=():Snapshot=>{
  if(state.wallet!==address())return {wallet:address(),status:address()?'loading':'disconnected',likes:[]};
  return {...state,likes:state.likes.map(l=>{const meta=options.metadata?.(l.tokenId);return {...l,title:meta?.title&&!/^(?:Inscription )?#\d+$/.test(meta.title)?meta.title:l.title,artist:radioArtist(l.tokenId,meta?.artist||l.artist)};})};
 };
 async function refresh(force=false){
  const wallet=address();
  if(!force&&wallet===state.wallet&&now()-last<60000)return;
  last=now();const run=++generation;active?.abort();active=new AbortController();const signal=active.signal;
  if(!wallet){state={status:'disconnected',likes:[]};options.changed();return;}
  let previous=state.wallet===wallet?state.likes:[];
  state={wallet,status:'loading',likes:previous};options.changed();
  const read=async(url:string)=>{
   for(let attempt=0;attempt<2;attempt++)try{const r=await fetcher(url,{cache:'no-store',signal:AbortSignal.any([signal,AbortSignal.timeout(20000)])});if(!r.ok)throw Error('Unavailable');return await r.json();}catch(error){if(signal.aborted||attempt===1)throw error;}
  };
  try{
   const config=await read('/radio/chain-likes');if(!config.enabled){previous=[];throw Error('Not activated');}
   if(contractSeen&&contractSeen!==config.contract)previous=[];contractSeen=config.contract;
   const catalogue=await read('/radio/counts?range=all&chainLikes=0');const tracks=catalogue.tracks as Track[];
   const likes:ConfirmedRadioLike[]=[];const freshlyConfirmed:string[]=[];let failed=0;
   for(let i=0;i<tracks.length;i+=25){const batch=tracks.slice(i,i+25);
    try{
     const data=await read('/radio/chain-likes?'+new URLSearchParams({wallet,ids:batch.map(t=>t.id).join(',')}));
     if(data.contract!==config.contract||!Array.isArray(data.rows)||batch.some(t=>!data.rows.some((r:any)=>r.id===t.id&&typeof r.liked==='boolean')))throw Error('Invalid state response');
     for(const row of data.rows){const track=batch.find(t=>t.id===row.id);if(track&&row.liked===true){likes.push({tokenId:String(track.id),title:track.title,artist:track.artist||''});freshlyConfirmed.push(String(track.id));}}
    }catch(error){if(signal.aborted)throw error;failed++;likes.push(...previous.filter(l=>batch.some(t=>String(t.id)===l.tokenId)));}
   }
   if(run!==generation||wallet!==address())return;
   state={wallet,status:failed?'partial':'ready',likes};
   removeConfirmedLocalLikes(freshlyConfirmed);
  }catch{if(run!==generation||wallet!==address())return;state={wallet,status:'unavailable',likes:previous};}
  if(state.status==='partial'||state.status==='unavailable')last=now()-50000; // Retry a cold-start failure on the next 15s tick.
  options.changed();
 }
 return {snapshot,refresh};
}
