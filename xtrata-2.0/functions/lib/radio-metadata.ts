import {queryAll,run,type Env} from './db';
import {inscriptionMetadata} from '../../src/lib/radio/inscription-metadata';
import {RADIO_CONTRACT} from './radio-report';
/** At most two bounded immutable-inscription reads per refresh. Failed reads retry tomorrow. */
export async function refreshRadioMetadata(env:Env) {
 try {
  const now=Date.now();
  const rows=await queryAll(env,`SELECT i.token_id FROM inscription_index i LEFT JOIN radio_metadata m ON m.token_id=i.token_id
   WHERE i.contract=? AND i.sealed=1 AND i.mime LIKE 'text/html%' AND (m.token_id IS NULL OR (m.status!='ready' AND m.checked_at<?))
   AND NOT EXISTS(SELECT 1 FROM radio_verdicts v WHERE v.contract=i.contract AND v.token_id=i.token_id AND v.verdict='dud')
   ORDER BY COALESCE(m.checked_at,0),i.token_id LIMIT 2`,[RADIO_CONTRACT,now-86400000]);
  for(const row of (rows.results||[]) as {token_id:number}[]) {
   // A conditional RETURNING claim prevents simultaneous refreshes downloading the same file.
   const claim=await queryAll(env,`INSERT INTO radio_metadata(token_id,checked_at,status) VALUES(?,?,'pending')
    ON CONFLICT(token_id) DO UPDATE SET checked_at=excluded.checked_at,status='pending'
    WHERE radio_metadata.status!='ready' AND radio_metadata.checked_at<? RETURNING token_id`,[row.token_id,now,now-86400000]);
   if(!claim.results?.length) continue;
   try {
    const response=await fetch('https://xtrata.xyz/inscription/'+row.token_id,{signal:AbortSignal.timeout(15000),redirect:'error'});
    if(!response.ok||!response.headers.get('content-type')?.includes('text/html')) {await response.body?.cancel();throw Error('Unavailable');}
    const reader=response.body!.getReader(),decoder=new TextDecoder();let html='',size=0;
    while(true){const r=await reader.read();if(r.done)break;size+=r.value.length;if(size>32*1024*1024){await reader.cancel();throw Error('Too large');}html+=decoder.decode(r.value,{stream:true});}
    html+=decoder.decode();const meta=inscriptionMetadata(html);
    await run(env,"UPDATE radio_metadata SET title=?,artist=?,status='ready' WHERE token_id=?",[meta.title,meta.artist,row.token_id]);
   } catch {await run(env,"UPDATE radio_metadata SET status='failed' WHERE token_id=?",[row.token_id]);}
  }
 }catch { /* optional enrichment never takes down reports */ }
}
