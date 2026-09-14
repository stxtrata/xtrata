import { describe, it, expect } from 'vitest';
import { classify, coverage, credit, mergeSpans } from '../play-rules';
import { PlayOutbox, type Observation } from '../play-counter';
const event = (sequence = 0,sessionId = 'one'): Observation => ({ sessionId,browserId:'browser',contract:'core',tokenId:1,source:'radio',ruleVersion:1,duration:240,sequence,seconds:sequence*10,spans:[],closed:false });
describe('listening classification', () => {
  it('separates starts, partials, qualified plays and completion', () => {
    expect(classify(1,240,[[0,1]])).toEqual({started:false,qualified:false,completed:false});
    expect(classify(12,240,[[0,12]])).toEqual({started:true,qualified:false,completed:false});
    expect(classify(30,240,[[0,30]]).qualified).toBe(true);
    expect(classify(216,240,[[0,216]]).completed).toBe(true);
    expect(classify(215,240,[[0,215]]).completed).toBe(false);
    expect(classify(9,20,[[0,9]]).qualified).toBe(false);
    expect(classify(10,20,[[0,10]]).qualified).toBe(true);
    expect(classify(1,1,[[0,1]]).qualified).toBe(false);
  });
  it('cannot complete a song by looping a small section or seeking to its end', () => {
    expect(coverage([[0,10],[0,10],[5,12]])).toBe(12);
    expect(classify(300,240,[[0,10],[0,10],[230,240]]).completed).toBe(false);
    expect(mergeSpans([[10,20],[0,10],[30,40]])).toEqual([[0,20],[30,40]]);
  });
  it('credits real wall time only, excluding pauses, jumps and throttled gaps', () => {
    expect(credit(0,1,1,1,true)).toBe(1);
    expect(credit(0,2,1,2,true)).toBe(1);
    expect(credit(0,100,1,1,true)).toBe(0);
    expect(credit(10,0,1,1,true)).toBe(0);
    expect(credit(0,1,1,1,false)).toBe(0);
    expect(credit(0,30,30,1,true)).toBe(0);
    expect(credit(0,0,1,1,true)).toBe(0);
  });
});
describe('bounded retry outbox', () => {
  it('preserves start and latest snapshot, not every heartbeat', async () => {
    const sent: number[]=[];
    const q=new PlayOutbox(async e=>{sent.push(e.sequence);return 200;});
    q.add(event());q.add(event(1));q.add(event(2));
    await q.flush();await q.flush();
    expect(sent).toEqual([0,2]);expect(q.pending).toEqual([]);
  });
  it('does not remove a newer snapshot while an old request is in flight', async () => {
    let finish!:(n:number)=>void;
    const q=new PlayOutbox(()=>new Promise(r=>{finish=r;}));
    q.add(event(1));const pending=q.flush();q.add(event(2));finish(200);await pending;
    expect(q.pending[0].sequence).toBe(2);
  });
  it('backs off failures and retains sequence for idempotent retry',async()=>{
    const q=new PlayOutbox(async()=>503);q.add(event());await q.flush(100);
    expect(q.pending).toHaveLength(1);expect(q.nextAttempt).toBe(5100);
    await q.flush(200);expect(q.failures).toBe(1);
  });
  it('bounds queue by complete sessions and drops expired sessions',async()=>{
    const dropped:string[]=[];const q=new PlayOutbox(async()=>410,()=>{},id=>dropped.push(id));
    for(let i=0;i<30;i++){q.add(event(0,String(i)));q.add(event(1,String(i)));}
    expect(q.pending).toHaveLength(40);await q.flush();expect(dropped).toEqual(['10']);
    expect(q.pending).toHaveLength(38);
  });
});
