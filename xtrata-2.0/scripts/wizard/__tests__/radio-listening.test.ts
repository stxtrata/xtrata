import {describe,it,expect,vi} from 'vitest';
import {RadioListening} from '../radio-listening.mjs';
import {RadioMedia,audioDuration} from '../radio-media.mjs';
const tab='a'.repeat(32),id='b'.repeat(32),song=2910;
function fixture(){
 let release;
 const w={stopEpoch:0,running:false,stop(){this.stopEpoch++;},exclusive:async fn=>fn(),optional:async()=>null,journal:async()=>[],reconcile:async()=>{},reconcileReturns:async()=>{},json:async()=>({address:'test'}),returnAccount:async()=>({balance:1000000n}),run:vi.fn(()=>new Promise(resolve=>{release=resolve;}))};
 let duration=61;
 const media={loaded:new Set([song]),tracks:[{id:song,title:'Example',artist:'Artist'}],audio:vi.fn(async requested=>{if(requested!==song)throw Error('not in the verified catalogue');return {duration};})},s=new RadioListening(w,media);
 return {w,s,media,setDuration:value=>{duration=value;},finish:()=>release?.()};
}
const settings={fee:300,max:2,minutes:10,tab};
const paidStart=(token:string,extra:Record<string,unknown>={})=>({id,song,tab,token,duration:61,...extra});
describe('bounded radio sessions',()=>{
 it('requires approval, prevents another tab and does not sign while enabling',async()=>{
  const {s,w}=fixture();await expect(s.start(paidStart('none'))).rejects.toThrow();
  const a=await s.enable(settings);expect(w.run).not.toHaveBeenCalled();
  await expect(s.start(paidStart(a.token,{tab:'c'.repeat(32)}))).rejects.toThrow('another tab');
  await expect(s.enable(settings)).rejects.toThrow('already');s.disable();
 });
 it('keeps one approval across ten confirmed starts and stops at the selected cap',async()=>{
  const {s,w,finish}=fixture(),a=await s.enable({...settings,max:10});
  for(let n=0;n<10;n++){
   await s.start(paidStart(a.token,{id:n.toString(16).padStart(32,'0')}));finish();await new Promise(r=>setTimeout(r,0));
   expect(s.snapshot().enabled).toBe(n<9);
   if(n<9)expect(s.renew({tab,token:a.token}).used).toBe(n+1);
  }
  expect(w.run).toHaveBeenCalledTimes(10);
 });
 it('allows sixteen starts at fee 257 but rejects seventeen',async()=>{
  const {s}=fixture();await expect(s.enable({...settings,fee:257,max:17})).rejects.toThrow('ceiling');
  expect((await s.enable({...settings,fee:257,max:16})).max).toBe(16);s.disable();
 });
 it('deduplicates starts and leaves overlapping starts free without replay',async()=>{
  const {s,w,finish}=fixture(),a=await s.enable(settings),p=paidStart(a.token);
  expect((await s.start(p)).outcome).toBe('requested');await s.start(p);expect(w.run).toHaveBeenCalledTimes(1);
  const other={...p,id:'c'.repeat(32)};expect((await s.start(other)).outcome).toBe('free');finish();await new Promise(r=>setTimeout(r,0));
  expect((await s.start(other)).outcome).toBe('free');expect(w.run).toHaveBeenCalledTimes(1);s.disable();
 });
 it('caps attempts and prevents stale consent, including external Stop and lease expiry',async()=>{
  const {s,w}=fixture(),a=await s.enable({...settings,max:1});await s.start(paidStart(a.token));
  expect((await s.start(paidStart(a.token,{id:'c'.repeat(32)}))).outcome).toBe('free');expect(w.run).toHaveBeenCalledTimes(1);expect(s.snapshot().enabled).toBe(false);
  const second=fixture();await second.s.enable(settings);second.w.stop();const epoch=second.w.stopEpoch;
  expect(second.s.snapshot().enabled).toBe(false);expect(second.w.stopEpoch).toBe(epoch);
  const third=fixture();await third.s.enable(settings);third.s.active.lease=0;expect(third.s.snapshot().enabled).toBe(false);
 });
 it('rejects unsupported audio, funds, fees and lifetime budget',async()=>{
  const {s,w}=fixture();await expect(s.enable({...settings,fee:1000,max:5})).rejects.toThrow('ceiling');
  w.returnAccount=async()=>({balance:1000001n});expect((await s.enable(settings)).enabled).toBe(true);s.disable();
  w.returnAccount=async()=>({balance:1000n});await expect(s.enable(settings)).rejects.toThrow('funds');
  w.returnAccount=async()=>({balance:1000000n});w.journal=async()=>[{fee:9800}];await expect(s.enable(settings)).rejects.toThrow('lifetime');
  w.journal=async()=>[];const a=await s.enable(settings);expect((await s.start(paidStart(a.token,{song:4}))).outcome).toBe('free');expect(w.run).not.toHaveBeenCalled();s.disable();
 });
 it('disables uncertain payments without retrying',async()=>{
  const {s,w}=fixture();w.run=vi.fn(async()=>{w.journal=async()=>[{playbackId:id,status:'prepared',txid:'test'}];throw Error('unknown');});
  const a=await s.enable(settings);await s.start(paidStart(a.token));await new Promise(r=>setTimeout(r,0));
  expect(s.snapshot().enabled).toBe(false);expect(s.events[0].outcome).toBe('unknown');expect(w.run).toHaveBeenCalledTimes(1);
 });
 it('pays playable starts even when a duration is short, unavailable or omitted',async()=>{
  const {s,w,finish,setDuration}=fixture(),a=await s.enable({...settings,max:3});
  setDuration(59);expect((await s.start(paidStart(a.token,{id:'c'.repeat(32),duration:59}))).outcome).toBe('requested');finish();await new Promise(r=>setTimeout(r,0));
  setDuration(null);expect((await s.start(paidStart(a.token,{id:'d'.repeat(32),duration:Number.NaN}))).outcome).toBe('requested');finish();await new Promise(r=>setTimeout(r,0));
  setDuration(61);const {duration,...withoutDuration}=paidStart(a.token,{id:'e'.repeat(32)});expect((await s.start(withoutDuration)).outcome).toBe('requested');
  expect(w.run).toHaveBeenCalledTimes(3);s.disable();
 });
});
const headers={'content-type':'text/html','x-xtrata-runtime-contract':'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3','x-xtrata-runtime-network':'mainnet'};
function wav(seconds){
 const rate=8000,body=Buffer.alloc(rate*seconds),out=Buffer.alloc(44+body.length);
 out.write('RIFF');out.writeUInt32LE(out.length-8,4);out.write('WAVE',8);out.write('fmt ',12);out.writeUInt32LE(16,16);out.writeUInt16LE(1,20);out.writeUInt16LE(1,22);out.writeUInt32LE(rate,24);out.writeUInt32LE(rate,28);out.writeUInt16LE(1,32);out.writeUInt16LE(8,34);out.write('data',36);out.writeUInt32LE(body.length,40);return out;
}
function mp3Frames(count){
 const frame=Buffer.alloc(417);frame.set([0xff,0xfb,0x90,0]);return Buffer.concat(Array.from({length:count},()=>frame));
}
describe('audio extraction without executing inscription code',()=>{
 it.each([59,60,61])('derives %is from verified WAV bytes',seconds=>expect(audioDuration(wav(seconds))).toBeCloseTo(seconds,5));
 it('derives a standard MPEG Layer III duration from verified frames',()=>expect(audioDuration(mp3Frames(2))).toBeCloseTo((2*1152)/44100,8));
 it('refuses unknown or malformed audio duration rather than estimating it',()=>{expect(audioDuration(Buffer.from('not audio'))).toBeNull();expect(audioDuration(Buffer.from('RIFF'))).toBeNull();});
 it('keeps automatic catalogue reads bounded but lets an explicit refresh bypass the cache',async()=>{
  let generation=0;
  const fetcher=vi.fn(async()=>new Response(JSON.stringify({tracks:[{id:song+generation++,status:'Audio player'}]})));
  const media=new RadioMedia(fetcher);
  expect((await media.catalogue())[0].id).toBe(song);
  expect((await media.catalogue())[0].id).toBe(song);
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect((await media.catalogue(true))[0].id).toBe(song+1);
  expect(fetcher).toHaveBeenCalledTimes(2);
 });
 it('keeps an empty catalogue empty and leaves failed refreshes retryable without inventing tracks',async()=>{
  const empty=new RadioMedia(async()=>new Response(JSON.stringify({tracks:[]})));
  expect(await empty.catalogue()).toEqual([]);expect(empty.updated).toBeGreaterThan(0);
  let calls=0;const failed=new RadioMedia(async()=>{calls++;return new Response('temporarily unavailable',{status:503});});
  await expect(failed.catalogue()).rejects.toThrow('503');await expect(failed.catalogue()).rejects.toThrow('503');
  expect(calls).toBe(2);expect(failed.tracks).toEqual([]);expect(failed.updated).toBe(0);
 });
 it('reads only a fixed catalogue and extracts audio bytes, never HTML',async()=>{
  const fetcher=vi.fn(async url=>String(url).includes('/radio/counts')?new Response(JSON.stringify({tracks:[{id:song,status:'Audio player',title:'Song'}]})):new Response('<script>stealKeys()</script><audio src="data:audio/wav;base64,UklGRg=="></audio>',{headers}));
  const media=new RadioMedia(fetcher),result=await media.audio(song);expect(result.mime).toBe('audio/wav');expect(result.body.toString()).toBe('RIFF');expect(media.loaded.has(song)).toBe(true);
  await media.audio(song);expect(fetcher).toHaveBeenCalledTimes(2);await expect(media.audio(999)).rejects.toThrow('catalogue');
 });
 it('rejects missing embedded audio and wrong contract identity',async()=>{
  const media=new RadioMedia(async url=>String(url).includes('/radio/counts')?new Response(JSON.stringify({tracks:[{id:song,status:'Audio player'}]})):new Response('<script>play()</script>',{headers}));
  await expect(media.audio(song)).rejects.toThrow('embedded');expect(media.loaded.size).toBe(0);
  media.request=async()=>new Response('bytes',{headers:{'content-type':'audio/wav'}});await expect(media.audio(song)).rejects.toThrow('verified');
 });
});

describe('reconciled activity',()=>{
 it('refreshes an unknown outcome from the durable journal without re-enabling spending',async()=>{
  const {s,w}=fixture();s.events=[{id,song,outcome:'unknown',reason:'Receipt verification failed.'}];
  w.journal=async()=>[{playbackId:id,status:'confirmed',txid:'confirmed-tx',title:'Example song',artist:'Example artist',recipient:'recipient-address'}];
  const view=await s.refreshedSnapshot();expect(view.events[0]).toMatchObject({title:'Example song',artist:'Example artist',recipient:'recipient-address'});expect(view.enabled).toBe(false);expect(view.events[0].outcome).toBe('confirmed');expect(view.events[0].reason).toBe('Paid start confirmed.');expect(w.run).not.toHaveBeenCalled();
 });
 it('shows a canonical failed payment as failed rather than pending',async()=>{
  const {s,w}=fixture();s.events=[{id,song,outcome:'unknown',reason:'Saved payment awaits reconciliation.'}];
  w.journal=async()=>[{playbackId:id,status:'failed',txid:'failed-tx',failedTxid:'failed-tx',failureStatus:'abort_by_response',title:'Example song',artist:'Example artist',recipient:'recipient-address'}];
  const view=await s.refreshedSnapshot();expect(view.events[0]).toMatchObject({outcome:'failed',txid:'failed-tx',recipient:'recipient-address'});expect(view.events[0].reason).toContain('not retried');expect(w.run).not.toHaveBeenCalled();
 });
});

describe('continuous listening',()=>{
 it('keeps consent after count, duration, lease and temporary failures but respects Stop',async()=>{
  const {s,w}=fixture();w.journal=async()=>[{fee:12000}];w.returnAccount=async()=>({balance:350n});
  const a=await s.enable({...settings,max:1,continuous:true});
  s.active.expires=0;s.active.lease=0;
  w.run=vi.fn().mockRejectedValueOnce(Error('Network unavailable')).mockResolvedValue(undefined);
  await s.start(paidStart(a.token));await new Promise(r=>setTimeout(r,0));
  expect(s.snapshot().enabled).toBe(true);
  await s.start(paidStart(a.token,{id:'d'.repeat(32)}));await new Promise(r=>setTimeout(r,0));
  expect(w.run).toHaveBeenCalledTimes(2);expect(w.run.mock.calls[1][1].continuous).toBe(true);
  expect(s.snapshot().enabled).toBe(true);w.stop();expect(s.snapshot().enabled).toBe(false);
 });
});

describe('lounge artwork',()=>{
 it('accepts bounded raster artwork and refuses executable image formats',async()=>{
  const media=new RadioMedia(async()=>new Response('png-bytes',{headers:{'content-type':'image/png'}}));
  expect((await media.artwork(2910)).mime).toBe('image/png');
  await expect(media.artwork(-1)).rejects.toThrow('Invalid');
  media.request=async()=>new Response('<svg/>',{headers:{'content-type':'image/svg+xml'}});
  await expect(media.artwork(2910)).rejects.toThrow('unavailable');
 });
});

describe('support approval with an unresolved saved payment',()=>{
 it('keeps approval active, performs recovery only with consent, and stops on revocation',async()=>{
  const {s,w}=fixture();w.journal=async()=>[{status:'unknown'}];w.reconcile=vi.fn(async(_log,guard)=>{guard?.();throw Object.assign(Error('Checking earlier payment'),{code:'PAYMENT_UNRESOLVED'});});
  await s.refreshedSnapshot();expect(w.reconcile).not.toHaveBeenCalled();
  const a=await s.enable({...settings,continuous:true});expect(a.enabled).toBe(true);
  await s.refreshedSnapshot();expect(s.snapshot().recovery).toBe('Checking earlier payment');expect(s.snapshot().enabled).toBe(true);
  s.disable();w.reconcile.mockClear();s.nextRecovery=0;await s.refreshedSnapshot();expect(w.reconcile).not.toHaveBeenCalled();
 });
});
