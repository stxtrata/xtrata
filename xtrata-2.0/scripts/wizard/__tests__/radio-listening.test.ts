import {describe,it,expect,vi} from 'vitest';
import {RadioListening} from '../radio-listening.mjs';
import {RadioMedia} from '../radio-media.mjs';
const tab='a'.repeat(32),id='b'.repeat(32),song=2910;
function fixture(){
 let release;
 const w={stopEpoch:0,running:false,stop(){this.stopEpoch++;},exclusive:async fn=>fn(),optional:async()=>null,journal:async()=>[],reconcile:async()=>{},reconcileReturns:async()=>{},json:async()=>({address:'test'}),returnAccount:async()=>({balance:1000000n}),run:vi.fn(()=>new Promise(resolve=>{release=resolve;}))};
 const media={loaded:new Set([song])},s=new RadioListening(w,media);
 return {w,s,media,finish:()=>release?.()};
}
const settings={fee:300,max:2,minutes:10,tab};
describe('bounded radio sessions',()=>{
 it('requires approval, prevents another tab and does not sign while enabling',async()=>{
  const {s,w}=fixture();await expect(s.start({id,song,tab,token:'none'})).rejects.toThrow();
  const a=await s.enable(settings);expect(w.run).not.toHaveBeenCalled();
  await expect(s.start({id,song,tab:'c'.repeat(32),token:a.token})).rejects.toThrow('another tab');
  await expect(s.enable(settings)).rejects.toThrow('already');s.disable();
 });
 it('keeps one approval across ten confirmed starts and stops at the selected cap',async()=>{
  const {s,w,finish}=fixture(),a=await s.enable({...settings,max:10});
  for(let n=0;n<10;n++){
   await s.start({id:n.toString(16).padStart(32,'0'),song,tab,token:a.token});finish();await new Promise(r=>setTimeout(r,0));
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
  const {s,w,finish}=fixture(),a=await s.enable(settings),p={id,song,tab,token:a.token};
  expect((await s.start(p)).outcome).toBe('requested');await s.start(p);expect(w.run).toHaveBeenCalledTimes(1);
  const other={...p,id:'c'.repeat(32)};expect((await s.start(other)).outcome).toBe('free');finish();await new Promise(r=>setTimeout(r,0));
  expect((await s.start(other)).outcome).toBe('free');expect(w.run).toHaveBeenCalledTimes(1);s.disable();
 });
 it('caps attempts and prevents stale consent, including external Stop and lease expiry',async()=>{
  const {s,w}=fixture(),a=await s.enable({...settings,max:1});await s.start({id,song,tab,token:a.token});
  expect((await s.start({id:'c'.repeat(32),song,tab,token:a.token})).outcome).toBe('free');expect(w.run).toHaveBeenCalledTimes(1);expect(s.snapshot().enabled).toBe(false);
  const second=fixture();await second.s.enable(settings);second.w.stop();const epoch=second.w.stopEpoch;
  expect(second.s.snapshot().enabled).toBe(false);expect(second.w.stopEpoch).toBe(epoch);
  const third=fixture();await third.s.enable(settings);third.s.active.lease=0;expect(third.s.snapshot().enabled).toBe(false);
 });
 it('rejects unsupported audio, funds, fees and lifetime budget',async()=>{
  const {s,w}=fixture();await expect(s.enable({...settings,fee:1000,max:5})).rejects.toThrow('ceiling');
  w.returnAccount=async()=>({balance:1000001n});await expect(s.enable(settings)).rejects.toThrow('exceeds');
  w.returnAccount=async()=>({balance:1000n});await expect(s.enable(settings)).rejects.toThrow('funds');
  w.returnAccount=async()=>({balance:1000000n});w.journal=async()=>[{fee:9800}];await expect(s.enable(settings)).rejects.toThrow('lifetime');
  w.journal=async()=>[];const a=await s.enable(settings);expect((await s.start({id,song:4,tab,token:a.token})).outcome).toBe('free');expect(w.run).not.toHaveBeenCalled();s.disable();
 });
 it('disables uncertain payments without retrying',async()=>{
  const {s,w}=fixture();w.run=vi.fn(async()=>{w.journal=async()=>[{playbackId:id,status:'prepared',txid:'test'}];throw Error('unknown');});
  const a=await s.enable(settings);await s.start({id,song,tab,token:a.token});await new Promise(r=>setTimeout(r,0));
  expect(s.snapshot().enabled).toBe(false);expect(s.events[0].outcome).toBe('unknown');expect(w.run).toHaveBeenCalledTimes(1);
 });
});
const headers={'content-type':'text/html','x-xtrata-runtime-contract':'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3','x-xtrata-runtime-network':'mainnet'};
describe('audio extraction without executing inscription code',()=>{
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
});

describe('continuous listening',()=>{
 it('keeps consent after count, duration, lease and temporary failures but respects Stop',async()=>{
  const {s,w}=fixture();w.journal=async()=>[{fee:12000}];w.returnAccount=async()=>({balance:350n});
  const a=await s.enable({...settings,max:1,continuous:true});
  s.active.expires=0;s.active.lease=0;
  w.run=vi.fn().mockRejectedValueOnce(Error('Network unavailable')).mockResolvedValue(undefined);
  await s.start({id,song,tab,token:a.token});await new Promise(r=>setTimeout(r,0));
  expect(s.snapshot().enabled).toBe(true);
  await s.start({id:'d'.repeat(32),song,tab,token:a.token});await new Promise(r=>setTimeout(r,0));
  expect(w.run).toHaveBeenCalledTimes(2);expect(w.run.mock.calls[1][1].continuous).toBe(true);
  expect(s.snapshot().enabled).toBe(true);w.stop();expect(s.snapshot().enabled).toBe(false);
 });
});
