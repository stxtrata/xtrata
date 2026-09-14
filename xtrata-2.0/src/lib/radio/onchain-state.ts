import {removeConfirmedLocalLikes} from './local-like-cleanup';
import type {WalletSession} from '../wallet/types';
type Track={id:number;title:string;artist?:string};
export type ConfirmedRadioLike={tokenId:string;title:string;artist:string};
type Snapshot={wallet?:string;status:'disconnected'|'loading'|'ready'|'unavailable';likes:ConfirmedRadioLike[]};
/** Read-only, wallet-scoped state. No local favourites are merged into confirmed likes. */
export function createRadioOnchainState(options:{wallet:()=>WalletSession;changed:()=>void;fetcher?:typeof fetch;now?:()=>number}){
 const fetcher=options.fetcher||fetch,now=options.now||Date.now;
 let state:Snapshot={status:'disconnected',likes:[]},generation=0,last=-Infinity,active:AbortController|undefined;
 const address=()=>{const s=options.wallet();return s.isConnected&&s.network==='mainnet'?s.address:undefined;};
 const snapshot=():Snapshot=>state.wallet===address()?state:{wallet:address(),status:address()?'loading':'disconnected',likes:[]};
 async function refresh(force=false){
  const wallet=address();
  if(!force&&wallet===state.wallet&&now()-last<60000)return;
  last=now();const run=++generation;active?.abort();active=new AbortController();const signal=active.signal;
  if(!wallet){state={status:'disconnected',likes:[]};options.changed();return;}
  state={wallet,status:'loading',likes:state.wallet===wallet?state.likes:[]};options.changed();
  const read=async(url:string)=>{const r=await fetcher(url,{cache:'no-store',signal:AbortSignal.any([signal,AbortSignal.timeout(15000)])});if(!r.ok)throw Error('Unavailable');return r.json();};
  try{
   const config=await read('/radio/chain-likes');if(!config.enabled)throw Error('Not activated');
   const catalogue=await read('/radio/counts?range=all');const tracks=catalogue.tracks as Track[];const likes:ConfirmedRadioLike[]=[];
   for(let i=0;i<tracks.length;i+=25){const batch=tracks.slice(i,i+25),data=await read('/radio/chain-likes?'+new URLSearchParams({wallet,ids:batch.map(t=>t.id).join(',')}));
    if(data.contract!==config.contract||!Array.isArray(data.rows))throw Error('Contract changed');
    for(const row of data.rows){const track=batch.find(t=>t.id===row.id);if(track&&row.liked===true)likes.push({tokenId:String(track.id),title:track.title,artist:track.artist||''});}
   }
   if(run!==generation||wallet!==address())return;
   state={wallet,status:'ready',likes};
   removeConfirmedLocalLikes(likes.map(l=>l.tokenId));
  }catch{if(run!==generation||wallet!==address())return;state={wallet,status:'unavailable',likes:[]};}
  options.changed();
 }
 return {snapshot,refresh};
}
