import {describe,it,expect,vi} from 'vitest';
import {AudibleClock,listenThreshold,supportModeLabel,miningFeeLabel} from '../radio-listening-policy.mjs';
import {encodeListenReceipt,decodePaidReceipt,uniqueListenReceipt} from '../../../public/radio/paid-receipt.mjs';
import {RadioListening} from '../radio-listening.mjs';
const tab='a'.repeat(32),id='b'.repeat(32);
function fixture(duration=61){
 const w={stopEpoch:0,running:false,stop(){this.stopEpoch++;},exclusive:async f=>f(),optional:async()=>null,journal:async()=>[],reconcile:async()=>{},reconcileReturns:async()=>{},json:async()=>({address:'test'}),returnAccount:async()=>({balance:1000000n}),run:vi.fn(async()=>{})};
 const s=new RadioListening(w,{tracks:[{id:315}],audio:async()=>({duration})},{platform:'win32',version:'1.0.7'});
 return {s,w};
}
describe('audible threshold clock',()=>{
 it('uses real elapsed time; skips, pauses, mute and seek cannot advance it',()=>{
  const c=new AudibleClock();c.sample(0,true);expect(c.sample(10000,true)).toBe(10);
  c.sample(20000,true);c.sample(20000,false);c.sample(90000,false);c.sample(90000,true);
  expect(c.sample(95000,true)).toBe(25); // seeking media time has no input
  expect(c.sample(100000,true)).toBe(30);
 });
 it('handles short/unknown and 59/60/61 durations',()=>{
  expect([12,59,60,61,NaN,Infinity,null].map(listenThreshold)).toEqual([11,30,30,30,30,30,30]);
 });
});
describe('listen admission',()=>{
 it('rejects missing begin, early, incorrect, duplicate and overlapping time',async()=>{
  const {s,w}=fixture(),a=await s.enable({fee:257,max:5,minutes:10,tab,continuous:true}),p={token:a.token,tab,id,song:315};
  try{
   await expect(s.qualify({...p,audibleSeconds:30,threshold:30})).rejects.toThrow('begin');
   await s.begin(p);expect(w.run).not.toHaveBeenCalled();
   await expect(s.begin(p)).rejects.toThrow('registered');
   await expect(s.qualify({...p,audibleSeconds:30,threshold:30})).rejects.toThrow('threshold');
   s.begins.get(id).at-=30000;s.active.beganAt-=30000;
   await expect(s.qualify({...p,audibleSeconds:5,threshold:30})).rejects.toThrow('threshold');
   await s.qualify({...p,audibleSeconds:30,threshold:30});expect(w.run).toHaveBeenCalledTimes(1);
   expect(w.run.mock.calls[0][1].listen).toMatchObject({threshold:30,platform:'win32',version:'1.0.7'});
   await expect(s.qualify({...p,audibleSeconds:30,threshold:30})).rejects.toThrow('already');
   const next={...p,id:'c'.repeat(32)};await s.begin(next);s.begins.get(next.id).at-=30000;
   await expect(s.qualify({...next,audibleSeconds:30,threshold:30})).rejects.toThrow('rate');
  }finally{s.disable();}
 });
 it('checks server duration, strict keys and revoked consent',async()=>{
  const {s,w}=fixture(12),a=await s.enable({fee:257,max:5,minutes:10,tab,continuous:true}),p={token:a.token,tab,id,song:315};
  try{expect((await s.begin(p)).threshold).toBe(11);
   await expect(s.qualify({...p,audibleSeconds:11,threshold:11,override:2})).rejects.toThrow('Invalid');
   s.disable();await expect(s.qualify({...p,audibleSeconds:11,threshold:11})).rejects.toThrow('approval');expect(w.run).not.toHaveBeenCalled();
  }finally{s.disable();}
 });
});
describe('receipt codec',()=>{
 const details={platform:'win32',version:'1.0.7',audibleSeconds:32,threshold:30,unknownDuration:false};
 it('encodes versions, flags and capped seconds; decodes legacy separately',()=>{
  const hex=encodeListenReceipt(details,new Uint8Array(6));expect(hex).toHaveLength(32);
  expect(decodePaidReceipt(hex)).toMatchObject({kind:'listen',label:'Listen · 32 s · Windows 1.0.7'});
  expect(decodePaidReceipt(encodeListenReceipt({...details,platform:'darwin',version:'1.0.4',threshold:11,audibleSeconds:70000},new Uint8Array(6)))).toMatchObject({version:'1.0.4',audibleSeconds:65535,threshold:11});
  expect(decodePaidReceipt('aa'.repeat(16)).kind).toBe('start');
 });
 it('regenerates a duplicate before signing',()=>{
  const existing=[{receipt:encodeListenReceipt(details,new Uint8Array(6))}];let calls=0;
  const hex=uniqueListenReceipt(details,existing,()=>new Uint8Array(6).fill(calls++));expect(calls).toBe(2);expect(hex).not.toBe(existing[0].receipt);
 });
});

it('rejects empty catalogue and failed media before registering a chargeable listen',async()=>{
 const {s,w}=fixture(),a=await s.enable({fee:257,max:5,minutes:10,tab,continuous:true}),p={token:a.token,tab,id,song:315};
 try{s.media.tracks=[];await expect(s.begin(p)).rejects.toThrow('catalogue');
 s.media.tracks=[{id:315}];s.media.audio=async()=>{throw Error('media unavailable');};
 await expect(s.begin(p)).rejects.toThrow('unavailable');await expect(s.qualify({...p,audibleSeconds:30,threshold:30})).rejects.toThrow('begin');expect(w.run).not.toHaveBeenCalled();
 }finally{s.disable();}
});
it('keeps unknown duration free when the track ends before thirty seconds',async()=>{
 const {s,w}=fixture(NaN),a=await s.enable({fee:257,max:5,minutes:10,tab,continuous:true}),p={token:a.token,tab,id,song:315};
 try{expect(await s.begin(p)).toEqual({threshold:30,unknownDuration:true});s.begins.get(id).at-=10000;
 await expect(s.qualify({...p,audibleSeconds:10,threshold:30})).rejects.toThrow('threshold');expect(w.run).not.toHaveBeenCalled();
 }finally{s.disable();}
});
it('requires explicit cap semantics and budgets the full cap before approving',async()=>{
 const {s}=fixture();
 await expect(s.enable({fee:1000,max:5,minutes:10,tab,continuous:false,feeMode:'cap'})).rejects.toThrow('ceiling');
 try{await s.enable({fee:1000,max:4,minutes:10,tab,continuous:false,feeMode:'cap'});expect(s.active.feeMode).toBe('cap');}finally{s.disable();}
 await expect(s.enable({fee:1000,max:4,minutes:10,tab,continuous:false,feeMode:'unknown'})).rejects.toThrow();
});

describe('player support and fee labels',()=>{
 it('shows mute or zero volume without clearing support and restores the live label on unmute',()=>{
  const text='SUPPORT ON · 2 listens · network fee cap 1000 microSTX + 50 to holder';
  expect(supportModeLabel(text,true,true,1)).toContain('MUTED');
  expect(supportModeLabel(text,true,false,0)).toContain('no new payment requests');
  expect(supportModeLabel(text,true,true,1)).toContain('Earlier requests may still complete');
  expect(supportModeLabel(text,true,false,1)).toBe(text);
  expect(supportModeLabel('FREE PLAY · support off',false,true,0)).toBe('FREE PLAY · support off');
 });
 it('shows the winning transaction fee rather than its cap or replacement fee',()=>{
  expect(miningFeeLabel({outcome:'confirmed',actualFee:257,fee:900,feeCap:1000})).toBe('Mining fee paid: 257 microSTX (0.000257 STX)');
  expect(miningFeeLabel({outcome:'failed',actualFee:400})).toContain('paid: 400');
  expect(miningFeeLabel({outcome:'submitted',feeChosen:300})).toContain('selected (not yet confirmed): 300');
  expect(miningFeeLabel({outcome:'confirmed',fee:300})).toBe('Mining fee paid: unavailable');
  expect(miningFeeLabel({outcome:'free'})).toBe('');
 });
});
