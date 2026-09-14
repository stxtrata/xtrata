import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { onRequest as likeRequest } from '../likes';
import { refreshRadioMetadata } from '../../lib/radio-metadata';
import { onRequest } from '../counts';
import { onRequest as sessions } from '../../debug/radio-sessions';
import { RADIO_CONTRACT } from '../../lib/radio-report';
const {DatabaseSync}=createRequire(import.meta.url)('node:sqlite');
let db:any,env:any;
const key='private-test-key-longer-than-24-characters';
function insert(id:string,token=1,created=Date.now()-60000){db.prepare(`INSERT INTO radio_plays(session_id,browser_hash,contract,token_id,source,rule_version,duration,sequence,created_at,updated_at) VALUES(?,?,?,?,'radio',1,60,0,?,?)`).run(id,'private-browser',RADIO_CONTRACT,token,created,created);}
function update(id:string,seconds=60){db.prepare('UPDATE radio_plays SET seconds=?,qualified_at=?,completed_at=?,sequence=1,closed=1 WHERE session_id=?').run(seconds,Date.now()-1000,seconds>=54?Date.now():null,id);}
const get=(range='all')=>onRequest({env,request:new Request('https://test/radio/counts?range='+range)});
beforeEach(()=>{db=new DatabaseSync(':memory:');for(const name of ['002_create_inscription_index.sql','003_inscription_index_token_uri.sql','008_radio_verdicts.sql','011_radio_plays.sql'])db.exec(readFileSync(new URL('../../migrations/'+name,import.meta.url),'utf8'));
insert('before');update('before');db.exec(readFileSync(new URL('../../migrations/012_radio_summaries.sql',import.meta.url),'utf8'));
for(const id of [1,2,3])db.prepare("INSERT INTO inscription_index(contract,token_id,sealed,mime,token_uri) VALUES(?,?,1,'audio/mpeg',?)").run(RADIO_CONTRACT,id,'data:application/json,'+encodeURIComponent(JSON.stringify({name:'Song '+id,artist:'Artist'})));
env={DEBUG_VIEW_KEY:key,DB:{prepare(sql:string){let values:any[]=[];return {bind(...v:any[]){values=v;return this;},async all(){return {results:db.prepare(sql).all(...values)};},async run(){return db.prepare(sql).run(...values);}};}}};});
afterEach(()=>{db.close();vi.restoreAllMocks();vi.unstubAllGlobals();});
describe('public catalogue and private sessions',()=>{
 it('backfills, counts once, survives deletion, and includes zero-play songs',async()=>{
 insert('after');update('after');update('after');db.exec("DELETE FROM radio_plays WHERE session_id='before'");
 const data=await (await get()).json();expect(data.tracks.map((r:any)=>r.id)).toEqual([1,2,3]);expect(data.tracks[0].plays).toBe(2);expect(data.tracks[0].completions).toBe(2);expect(data.tracks[0].seconds).toBe(120);expect(data.tracks[0].unique_browsers).toBe(null);expect(data.tracks[1].plays).toBe(0);expect(data.tracks[1].title).toBe('Song 2');expect(JSON.stringify(data)).not.toContain('private-browser');expect(JSON.stringify(data)).not.toContain('session_id');
 });
 it('uses one start-time cohort for completion rates and deduplicates browsers',async()=>{
 insert('old',1,Date.now()-2*86400000);update('old');insert('repeat');update('repeat');
 const data=await (await get('24h')).json();expect(data.tracks[0].plays).toBe(2);expect(data.tracks[0].completion_rate).toBe(100);expect(data.tracks[0].unique_browsers).toBe(1);expect(data.tracks[0].repeats).toBe(1);
 });
 it('excludes reported duds and unindexed claimed tokens',async()=>{
 db.prepare("INSERT INTO radio_verdicts(contract,token_id,verdict,updated_at) VALUES(?,2,'dud',0)").run(RADIO_CONTRACT);insert('fake',999);update('fake');
 const data=await (await get()).json();expect(data.tracks.map((r:any)=>r.id)).toEqual([1,3]);expect((await get('invalid')).status).toBe(400);
 });
 it('authenticates and paginates private logs without exposing identifiers',async()=>{
 expect((await sessions({env,request:new Request('https://test/debug/radio-sessions')})).status).toBe(401);
 for(let i=0;i<51;i++)insert('page-'+i);
 const response=await sessions({env,request:new Request('https://test/debug/radio-sessions',{headers:{'x-debug-key':key}})});const data=await response.json();expect(data.sessions).toHaveLength(50);expect(data.nextOffset).toBe(50);expect(JSON.stringify(data)).not.toContain('private-browser');expect(response.headers.get('cache-control')).toBe('private, no-store');
 });
 it('fails clearly before summary migration rather than showing false zero totals',async()=>{db.exec('DROP TABLE radio_reporting_state');expect((await get()).status).toBe(503);});
});

function likesSetup(){
 db.exec(readFileSync(new URL('../../migrations/013_radio_metadata_likes.sql',import.meta.url),'utf8'));
 env.TELEMETRY_SALT='test-only-salt';
 env.DB.batch=async(statements:any[])=>{db.exec('BEGIN');try{const results=[];for(const s of statements)results.push(await s.run());db.exec('COMMIT');return results;}catch(e){db.exec('ROLLBACK');throw e;}};
}
describe('current likes and inscription metadata',()=>{
 it('deduplicates likes, removes unlikes, ignores stale snapshots and hides browser identities',async()=>{
  likesSetup();let now=Date.now();vi.spyOn(Date,'now').mockImplementation(()=>now);
  const browserId='11111111-1111-4111-8111-111111111111';
  const send=(ids:number[],revision=now)=>likeRequest({env,request:new Request('https://test/radio/likes',{method:'PUT',headers:{origin:'https://test','content-type':'application/json'},body:JSON.stringify({browserId,operationId:crypto.randomUUID(),revision,ids})})});
  expect((await send([1,1,2,999])).status).toBe(200);
  expect((await send([1,1,2,999])).status).toBe(200);
  let d=await(await get()).json();expect(d.tracks[0].current_likes).toBe(1);expect(d.tracks[1].current_likes).toBe(1);
  now+=2000;expect((await send([2])).status).toBe(200);expect((await send([1,2],now-2000)).status).toBe(200);
  d=await(await get('24h')).json();expect(d.tracks[0].current_likes).toBe(0);expect(d.tracks[1].current_likes).toBe(1);expect(JSON.stringify(d)).not.toContain(browserId);
  expect((await send(Array(201).fill(1))).status).toBe(400);
 });
 it('reads artist from immutable HTML once and reuses cached metadata',async()=>{
  likesSetup();db.exec("UPDATE inscription_index SET mime='text/html' WHERE token_id=1");
  const fetcher=vi.fn(async()=>new Response('<title>Real song</title><script type="application/json">{"artist":"Real artist"}</script>',{headers:{'content-type':'text/html'}}));vi.stubGlobal('fetch',fetcher);
  await refreshRadioMetadata(env);await refreshRadioMetadata(env);
  expect(fetcher).toHaveBeenCalledTimes(1);expect(fetcher.mock.calls[0][0]).toBe('https://xtrata.xyz/inscription/1');
  const d=await(await get()).json();expect(d.tracks[0].title).toBe('Real song');expect(d.tracks[0].artist).toBe('Real artist');
 });
});
