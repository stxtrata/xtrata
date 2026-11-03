import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { onRequest as artworkRequest } from '../artwork';
import { onRequest as likeRequest } from '../likes';
import { refreshRadioMetadata } from '../../lib/radio-metadata';
import { onRequest } from '../counts';
import { onRequest as sessions } from '../../debug/radio-sessions';
import { RADIO_CONTRACT } from '../../lib/radio-report';
import { SONG_RULES_SINCE, checkSongsNow } from '../../lib/radio-metadata';
import { onRequest as playable } from '../../index/playable';
import { served, webm, withHiddenTrack } from '../../../src/lib/radio/__tests__/song-fixtures';
vi.mock('../../inscription/handler',()=>({onInscriptionRequest:({request}: {request:Request})=>request.headers.has('range')?fetch(request.url,{headers:{range:request.headers.get('range')!}}):fetch(request.url)}));
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
 db.exec(readFileSync(new URL('../../migrations/014_radio_artwork.sql',import.meta.url),'utf8'));
 db.exec(readFileSync(new URL('../../migrations/015_radio_song_classification.sql',import.meta.url),'utf8'));
 db.exec(readFileSync(new URL('../../migrations/016_radio_album.sql',import.meta.url),'utf8'));
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
  likesSetup();db.exec("UPDATE inscription_index SET mime='text/html' WHERE token_id=1");db.exec("INSERT INTO radio_metadata(token_id,title,artist,status,checked_at) VALUES(1,'Cached','Artist','ready',0)");
  const fetcher=vi.fn(async()=>new Response('<source src="data:audio/mpeg;base64,YQ=="><title>Real song</title><script type="application/json">{"artist":"Real artist","album":"Real album"}</script>',{headers:{'content-type':'text/html'}}));vi.stubGlobal('fetch',fetcher);
  await refreshRadioMetadata(env);await refreshRadioMetadata(env);
  expect(fetcher).toHaveBeenCalledTimes(1);expect(fetcher.mock.calls[0][0]).toBe('https://xtrata.xyz/inscription/1');
  const d=await(await get()).json();expect(d.tracks[0].title).toBe('Real song');expect(d.tracks[0].artist).toBe('Real artist');expect(d.tracks[0].album).toBe('Real album');
 });
});

describe('catalogue artwork',()=>{
 it('serves cached images separately from counts and handles missing artwork',async()=>{
  likesSetup();db.prepare("INSERT INTO radio_metadata(token_id,title,artist,status,checked_at,cover) VALUES(1,'Song','Artist','ready',0,?)").run('data:image/png;base64,aGVsbG8=');
  const data=await(await get()).json();expect(data.tracks[0].thumbnail).toBe('/radio/artwork?id=1');expect(JSON.stringify(data)).not.toContain('aGVsbG8=');
  const response=await artworkRequest({env,request:new Request('https://test/radio/artwork?id=1')});expect(response.headers.get('content-type')).toBe('image/png');expect(await response.text()).toBe('hello');
  expect((await artworkRequest({env,request:new Request('https://test/radio/artwork?id=2')})).status).toBe(404);
  expect((await artworkRequest({env,request:new Request('https://test/radio/artwork?id=bad')})).status).toBe(400);
 });
});

describe('song-only catalogue',()=>{
 it('excludes games and unknown HTML, retains audio and verified players',async()=>{
  likesSetup();db.exec("UPDATE inscription_index SET mime='text/html' WHERE token_id IN (2,3)");
  db.exec("INSERT INTO radio_metadata(token_id,title,artist,status,checked_at,is_song) VALUES(2,'X Chess','','ready',0,0),(3,'Song','','ready',0,1)");
  expect((await(await get()).json()).tracks.map((r:any)=>r.id)).toEqual([1,3]);
  db.exec('UPDATE radio_metadata SET is_song=NULL WHERE token_id=3');
  expect((await(await get()).json()).tracks.map((r:any)=>r.id)).toEqual([1]);
 });
});

it('reports inline album names without requiring cached HTML metadata',async()=>{
 db.prepare('UPDATE inscription_index SET token_uri=? WHERE token_id=1').run('data:application/json,'+encodeURIComponent(JSON.stringify({name:'Track',album:{name:'Album title'}})));
 const data=await(await get()).json();expect(data.tracks[0].album).toBe('Album title');expect(data.tracks[1].album).toBe('');
});

it('retains known names and artwork while optional metadata refresh is pending or failed',async()=>{
 likesSetup();db.exec("INSERT INTO radio_metadata(token_id,title,artist,cover,status,checked_at) VALUES(1,'Known title','Known artist','data:image/png;base64,YQ==','pending',0)");
 for(const state of ['pending','failed']){
  db.prepare('UPDATE radio_metadata SET status=? WHERE token_id=1').run(state);
  const data=await(await get()).json();expect(data.tracks[0].title).toBe('Known title');expect(data.tracks[0].artist).toBe('Known artist');expect(data.tracks[0].thumbnail).toBe('/radio/artwork?id=1');
 }
});

describe('songs that live elsewhere: hidden tracks, all-audio video files and linked audio',()=>{
 const FILES:Record<number,{type:string;bytes:Uint8Array}>={
  8:{type:'video/webm',bytes:webm('A_OPUS')},                                       // audio only, minted as video
  139:{type:'video/webm',bytes:withHiddenTrack(webm('V_VP9'),webm('A_OPUS'))},     // a hidden track
  50:{type:'video/webm',bytes:webm('V_VP9','A_OPUS')},                              // a film: not a song
  319:{type:'text/html',bytes:new TextEncoder().encode('<title>Russian Rampage</title><audio><source src="https://xtrata.xyz/inscription/8" type="audio/webm"></audio><img src="https://xtrata.xyz/inscription/134">')},
  60:{type:'text/html',bytes:new TextEncoder().encode('<title>Linked later</title><source src="/inscription/8">')},
  70:{type:'text/html',bytes:new TextEncoder().encode('<title>A game</title><script>new Audio("x")</script>')}
 };
 const setupFiles=()=>{
  likesSetup();
  for(const [id,f] of Object.entries(FILES))db.prepare('INSERT INTO inscription_index(contract,token_id,sealed,mime) VALUES(?,?,1,?)').run(RADIO_CONTRACT,Number(id),f.type);
  // 60 and 70 were looked at under the old rules and judged "not a song"; 60 was before the rules widened.
  db.prepare("INSERT INTO radio_metadata(token_id,title,artist,album,status,checked_at,cover_checked,is_song) VALUES(60,'','','','ready',?,1,0)").run(SONG_RULES_SINCE-1000);
  db.prepare("INSERT INTO radio_metadata(token_id,title,artist,album,status,checked_at,cover_checked,is_song) VALUES(70,'','','','ready',?,1,0)").run(SONG_RULES_SINCE+1000);
  const fetcher=vi.fn(async(url:string,init?:{headers?:Record<string,string>})=>{const f=FILES[Number(url.split('/').pop())];return f?served(f.bytes,f.type,init?.headers?.range):new Response('',{status:404});});
  vi.stubGlobal('fetch',fetcher);
  return fetcher;
 };
 const song=(id:number)=>(db.prepare('SELECT is_song FROM radio_metadata WHERE token_id=?').get(id) as any)?.is_song;

 it('reads each file once and records song (1), hidden track (2) or not a song (0)',async()=>{
  const fetcher=setupFiles();
  for(let i=0;i<6;i++)await refreshRadioMetadata(env);
  expect([song(8),song(139),song(50),song(319),song(60),song(70)]).toEqual([1,2,0,1,1,0]);
  // video files are read by range only: their last 30 bytes, then their first bytes when there is no hidden track
  const ranged=fetcher.mock.calls.filter((c:any)=>Number(c[0].split('/').pop())===139).map((c:any)=>c[1]?.headers?.range);
  expect(ranged).toEqual(['bytes=-30']);
  const calls=fetcher.mock.calls.length;
  for(let i=0;i<3;i++)await refreshRadioMetadata(env);
  expect(fetcher.mock.calls.length).toBe(calls); // nothing is read twice
  expect((db.prepare('SELECT title FROM radio_metadata WHERE token_id=319').get() as any).title).toBe('Russian Rampage');
 });

 it('verified songs join the catalogue and the station even when listeners once reported them as duds; hidden tracks stay unlisted',async()=>{
  setupFiles();
  db.prepare("INSERT INTO radio_verdicts(contract,token_id,verdict,reason,updated_at) VALUES(?,8,'dud','mime:video/webm',0)").run(RADIO_CONTRACT);
  db.prepare("INSERT INTO radio_verdicts(contract,token_id,verdict,reason,updated_at) VALUES(?,319,'dud','html-no-audio',0)").run(RADIO_CONTRACT);
  for(let i=0;i<6;i++)await refreshRadioMetadata(env);
  const ids=(await(await get()).json()).tracks.map((r:any)=>r.id);
  expect(ids).toEqual(expect.arrayContaining([1,2,3,8,60,319]));
  expect(ids).not.toContain(139);expect(ids).not.toContain(50);expect(ids).not.toContain(70);
  vi.stubGlobal('fetch',vi.fn(async()=>new Response('')));
  const list=await(await playable({env,request:new Request('https://test/index/playable?contract='+RADIO_CONTRACT)} as any)).json();
  expect(list.video).toEqual([8]);
  expect(list.duds).not.toContain(8);expect(list.duds).not.toContain(319);
  expect(list.html).toEqual(expect.arrayContaining([319,60,70]));
  expect([...list.audio,...list.video,...list.html]).not.toContain(139);
 });

 it('checkSongsNow reads named inscriptions straight away, retrying a failed read, and nothing else',async()=>{
  const fetcher=setupFiles();
  db.prepare("INSERT INTO radio_metadata(token_id,status,checked_at) VALUES(139,'failed',?)").run(Date.now());
  await checkSongsNow(env,[139,319,1,99999]);
  expect([song(139),song(319)]).toEqual([2,1]);
  expect(fetcher.mock.calls.every((c:any)=>[139,319].includes(Number(c[0].split('/').pop())))).toBe(true);
 });
});
