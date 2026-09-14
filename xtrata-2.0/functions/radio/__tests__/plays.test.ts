import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { createRequire } from 'node:module';
const { DatabaseSync } = createRequire(import.meta.url)('node:sqlite');
import { readFileSync } from 'node:fs';
import { onRequest } from '../plays';
import { onRequest as stats } from '../../debug/radio';
let db: any;
const key='test-dashboard-key-with-more-than-24-chars';
let env: any;
const browser='11111111-1111-4111-8111-111111111111';
const session='22222222-2222-4222-8222-222222222222';
const initial={sessionId:session,browserId:browser,contract:'SP123.core',tokenId:1,source:'radio',ruleVersion:1,duration:240,sequence:0,seconds:0,spans:[],closed:false};
const send=(changes:Record<string,unknown>={},headers:Record<string,string>={})=>onRequest({env,request:new Request('https://xtrata.test/radio/plays',{method:'POST',headers:{origin:'https://xtrata.test','content-type':'application/json',...headers},body:JSON.stringify({...initial,...changes})})});
const report=(range='24h')=>stats({env,request:new Request('https://xtrata.test/debug/radio?range='+range,{headers:{'x-debug-key':key}})});
beforeEach(()=>{
  vi.spyOn(Date,'now').mockReturnValue(Date.parse('2026-09-14T12:00:00Z'));
  db=new DatabaseSync(':memory:');db.exec(readFileSync(new URL('../../migrations/011_radio_plays.sql',import.meta.url),'utf8'));
  env={RADIO_COUNTER_ENABLED:'1',TELEMETRY_SALT:'test-salt',DEBUG_VIEW_KEY:key,DB:{prepare(sql:string){let binds:any[]=[];return {bind(...args:any[]){binds=args;return this;},async all(){return {results:db.prepare(sql).all(...binds)};},async run(){return db.prepare(sql).run(...binds);}};}}};
});
afterEach(()=>{db.close();vi.restoreAllMocks();});
const advance=(ms:number)=>vi.mocked(Date.now).mockReturnValue(Date.now()+ms);
describe('radio D1 ingestion and reports using real SQLite',()=>{
  it('counts once, survives duplicate/out of order retries and separates repeat browsers',async()=>{
    expect((await send()).status).toBe(200);advance(31000);
    expect((await send({sequence:1,seconds:30,spans:[[0,30]]})).status).toBe(200);
    expect((await send({sequence:1,seconds:30,spans:[[0,30]]})).status).toBe(200);
    expect((await send()).status).toBe(200);
    let data=await (await report()).json();expect(data.tracks[0].qualified_plays).toBe(1);expect(data.tracks[0].unique_browsers).toBe(1);
    advance(1000);await send({sequence:2,seconds:30,spans:[[0,30]],closed:true});
    const second='33333333-3333-4333-8333-333333333333';await send({sessionId:second});advance(31000);
    await send({sessionId:second,sequence:1,seconds:30,spans:[[0,30]]});
    data=await (await report()).json();expect(data.tracks[0].qualified_plays).toBe(2);expect(data.tracks[0].unique_browsers).toBe(1);
    expect(JSON.stringify(db.prepare('SELECT * FROM radio_plays').all())).not.toContain(browser);
  });
  it('rejects forged progress, identity changes and decreasing coverage',async()=>{
    await send();
    expect((await send({sequence:1,seconds:30,spans:[[0,30]]})).status).toBe(400);
    advance(31000);await send({sequence:1,seconds:30,spans:[[0,30]]});
    expect((await send({sequence:2,browserId:'44444444-4444-4444-8444-444444444444'})).status).toBe(409);
    advance(10000);expect((await send({sequence:2,seconds:31,spans:[[10,31]]})).status).toBe(400);
    expect((await send({sequence:2,seconds:31,spans:[[0,240]]})).status).toBe(400);
    expect((await send({sequence:2,duration:5})).status).toBe(409);
  });
  it('counts completions separately and partials only after close or idle',async()=>{
    await send();advance(12000);await send({sequence:1,seconds:12,spans:[[0,12]]});
    let d=await (await report()).json();expect(d.tracks[0].partials).toBe(0);expect(d.tracks[0].in_progress).toBe(1);
    expect(d.tracks[0].qualified_plays).toBe(0);expect(d.tracks[0].completions).toBe(0);
    advance(1000);await send({sequence:2,seconds:12,spans:[[0,12]],closed:true});
    d=await (await report()).json();expect(d.tracks[0].partials).toBe(1);
    expect((await send({sequence:3,seconds:12,spans:[[0,12]]})).status).toBe(410);
    const second='33333333-3333-4333-8333-333333333333';await send({sessionId:second});advance(217000);
    await send({sessionId:second,sequence:1,seconds:216,spans:[[0,216]],closed:true});
    d=await (await report()).json();expect(d.tracks[0].qualified_plays).toBe(1);expect(d.tracks[0].completions).toBe(1);
  });
  it('excludes overlapping credit from another tab and expires idle sessions',async()=>{
    await send();const other='33333333-3333-4333-8333-333333333333';await send({sessionId:other,tokenId:2});advance(10000);
    const both=await Promise.all([send({sequence:1,seconds:10,spans:[[0,10]]}),send({sessionId:other,tokenId:2,sequence:1,seconds:10,spans:[[0,10]]})]);
    expect(both.map(r=>r.status).sort()).toEqual([200,409]);
    advance(1800001);expect((await send({sequence:2,seconds:11,spans:[[0,11]]})).status).toBe(410);
  });
  it('validates request shape, origin, activation and private reporting',async()=>{
    expect((await send({}, {origin:'https://evil.test'})).status).toBe(403);
    expect((await send({seconds:NaN})).status).toBe(400);
    expect((await send({spans:[[0,-1]]})).status).toBe(400);
    expect((await send({sequence:1,seconds:10,spans:[[0,10]]})).status).toBe(409);
    expect((await stats({env,request:new Request('https://xtrata.test/debug/radio')})).status).toBe(401);
    env.RADIO_COUNTER_ENABLED='0';expect((await send()).status).toBe(503);
  });
  it('cannot add completion coverage without additional listening',async()=>{
    await send();advance(217000);
    await send({sequence:1,seconds:216,spans:[[0,30]]});advance(1000);
    expect((await send({sequence:2,seconds:216,spans:[[0,216]]})).status).toBe(400);
  });
  it('does not double count concurrent updates to the same session',async()=>{
    await send();advance(31000);
    const payload={sequence:1,seconds:30,spans:[[0,30]]};
    const responses=await Promise.all([send(payload),send(payload)]);
    expect(responses.every(r=>r.status===200)).toBe(true);
    expect((await (await report()).json()).tracks[0].qualified_plays).toBe(1);
  });
  it('separates reporting periods at qualification time',async()=>{
    await send();advance(31000);await send({sequence:1,seconds:30,spans:[[0,30]],closed:true});
    advance(86400001);
    expect((await (await report()).json()).tracks).toHaveLength(0);
    expect((await (await report('7d')).json()).tracks[0].qualified_plays).toBe(1);
  });
  it('limits session creation and removes old browser records',async()=>{
    for(let i=0;i<121;i++){
      const id=`${String(i).padStart(8,'0')}-1111-4111-8111-111111111111`;
      expect((await send({sessionId:id})).status).toBe(i===120?429:200);
    }
    advance(91*86400000);await send();expect(db.prepare('SELECT COUNT(*) n FROM radio_plays').get()?.n).toBe(1);
  });
  it('uses rolling 24h and London midnight, including daylight saving boundaries',async()=>{
    const d=await (await report('today')).json();expect(d.since).toBe(Date.parse('2026-09-13T23:00:00Z'));
    vi.mocked(Date.now).mockReturnValue(Date.parse('2026-10-25T12:00:00Z'));
    expect((await (await report('today')).json()).since).toBe(Date.parse('2026-10-24T23:00:00Z'));
    vi.mocked(Date.now).mockReturnValue(Date.parse('2026-03-29T12:00:00Z'));
    expect((await (await report('today')).json()).since).toBe(Date.parse('2026-03-29T00:00:00Z'));
    expect((await (await report()).json()).since).toBe(Date.now()-86400000);
  });
});
