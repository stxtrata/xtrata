import {catalogueChainTotals} from './radio-chain-totals';
import { safeArtwork } from '../../src/lib/radio/inscription-metadata';
import { queryAll, type Env } from './db';
export const RADIO_CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
export async function catalogueReport(env: Env, url: URL) {
 const range=url.searchParams.get('range') || '24h';
 const hours: Record<string,number>={'24h':24,'7d':168,'30d':720};
 if (range!=='all' && !hours[range]) throw new Error('Invalid period');
 const now=Date.now(), since=range==='all'?0:now-hours[range]*3600000;
 const state=await queryAll(env,'SELECT measured_since FROM radio_reporting_state WHERE id=1');
 const catalogue=await queryAll(env,`SELECT token_id,creator,mime,token_uri FROM inscription_index i
 WHERE contract=? AND sealed=1 AND (mime LIKE 'audio/%' OR mime LIKE 'text/html%')
 AND NOT EXISTS(SELECT 1 FROM radio_verdicts v WHERE v.contract=i.contract AND v.token_id=i.token_id AND v.verdict='dud') ORDER BY token_id`,[RADIO_CONTRACT]);
 const metrics=range==='all' ? await queryAll(env,`SELECT token_id,SUM(starts) starts,SUM(plays) plays,SUM(completions) completions,SUM(seconds) seconds,MAX(last_play) last_play,NULL unique_browsers FROM radio_daily WHERE contract=? GROUP BY token_id`,[RADIO_CONTRACT]) : await queryAll(env,`SELECT token_id,SUM(seconds>=2) starts,SUM(qualified_at IS NOT NULL) plays,SUM(completed_at IS NOT NULL) completions,SUM(seconds) seconds,MAX(qualified_at) last_play,COUNT(DISTINCT CASE WHEN qualified_at IS NOT NULL THEN browser_hash END) unique_browsers FROM radio_plays WHERE contract=? AND created_at>=? GROUP BY token_id`,[RADIO_CONTRACT,since]);
 const active=await queryAll(env,`SELECT token_id,COUNT(*) active FROM radio_plays WHERE contract=? AND created_at>=? AND seconds>=2 AND qualified_at IS NULL AND closed=0 AND updated_at>=? GROUP BY token_id`,[RADIO_CONTRACT,since,now-1800000]);
 const durations=await queryAll(env,'SELECT token_id,MAX(duration) duration FROM radio_plays WHERE contract=? GROUP BY token_id',[RADIO_CONTRACT]);
 const byId=new Map((metrics.results || []).map((r:any)=>[r.token_id,r]));
 const activeById=new Map((active.results || []).map((r:any)=>[r.token_id,r.active]));
 const durationById=new Map((durations.results || []).map((r:any)=>[r.token_id,r.duration]));
 let enriched=new Map<number,any>(),likeCounts=new Map<number,number>(),likesAvailable=false;
 try {
  const names=await queryAll(env,"SELECT token_id,title,artist FROM radio_metadata WHERE title!='' OR artist!=''");
  enriched=new Map((names.results||[]).map((r:any)=>[r.token_id,r]));
  const likes=await queryAll(env,'SELECT token_id,COUNT(*) likes FROM radio_likes GROUP BY token_id');
  likeCounts=new Map((likes.results||[]).map((r:any)=>[r.token_id,r.likes]));likesAvailable=true;
 }catch{ /* migration 013 optional until deployment */ }
 let albums=new Map<number,string>();
 try {const result=await queryAll(env,"SELECT token_id,album FROM radio_metadata WHERE album IS NOT NULL");albums=new Map((result.results||[]).map((r:any)=>[r.token_id,r.album]));}catch{ /* migration 016 optional until applied */ }
 let covers=new Set<number>();
 try {const result=await queryAll(env,"SELECT token_id FROM radio_metadata WHERE cover!=''");covers=new Set((result.results||[]).map((r:any)=>r.token_id));}catch{ /* migration 014 optional */ }
 let verifiedSongs=new Set<number>();
 try {const result=await queryAll(env,'SELECT token_id FROM radio_metadata WHERE is_song=1');verifiedSongs=new Set((result.results||[]).map((r:any)=>r.token_id));}catch{ /* unverified HTML remains outside the catalogue */ }
 const tracks=(catalogue.results || []).filter((row:any)=>row.mime?.startsWith('audio/')||verifiedSongs.has(row.token_id)).map((row:any)=>{
  let meta:any={};
  // Decode indexed inline metadata only. Never fetch arbitrary token URLs.
  try { if(row.token_uri?.startsWith('data:application/json,')) meta=JSON.parse(decodeURIComponent(row.token_uri.slice(22))); } catch { /* absent metadata */ }
  const m:any=byId.get(row.token_id) || {starts:0,plays:0,completions:0,seconds:0,last_play:null,unique_browsers:range==='all'?null:0};
  const inProgress=Number(activeById.get(row.token_id)||0);
  const cached=enriched.get(row.token_id);
  return {id:row.token_id,thumbnail:covers.has(row.token_id)?'/radio/artwork?id='+row.token_id:safeArtwork(meta.image?.url || meta.image || meta.artwork || meta.cover),current_likes:likesAvailable?(likeCounts.get(row.token_id)||0):null,title:cached?.title || (typeof meta.name==='string'?meta.name.slice(0,200):`Inscription #${row.token_id}`),
   album:albums.get(row.token_id) || (typeof meta.album==='string'?meta.album:typeof meta.album?.name==='string'?meta.album.name:typeof meta.inAlbum?.name==='string'?meta.inAlbum.name:'').slice(0,200),
   artist:cached?.artist || (typeof meta.artist==='string'?meta.artist.slice(0,200):''),creator:row.creator,
   status:row.mime?.startsWith('audio/')?'Audio':'Audio player',
   duration:durationById.get(row.token_id)||null,...m,in_progress:inProgress,
   partials:Math.max(0,m.starts-m.plays-inProgress),repeats:m.unique_browsers===null?null:Math.max(0,m.plays-m.unique_browsers),
   completion_rate:m.plays?100*m.completions/m.plays:null};
 });
 const {totals:confirmed,status:chainLikesStatus}=await catalogueChainTotals(env,tracks.map((r:any)=>r.id));
 for(const track of tracks)Object.assign(track,{onchain_likes:confirmed.get(track.id)??null});
 return {range,since,until:now,onchain_likes_status:chainLikesStatus,measured_since:(state.results?.[0] as any)?.measured_since,tracks,
 notice:'Browser-reported listening, not verified people or votes. Periods group sessions by start time; completions follow that same group. All-time unique browsers/repeats are unavailable after session cleanup. HTML entries are included only after embedded audio is verified. Titles/artists are read from inscription metadata and cached. On-chain likes are confirmed wallet endorsements. Saved favourites are synced browser favourites, independent of the period. Neither proves unique people. Livestream listeners are not included.'};
}
