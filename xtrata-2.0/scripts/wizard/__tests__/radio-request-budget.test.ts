import {describe,it,expect,vi} from 'vitest';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {RadioWizard} from './offline-radio-wallet';
const ok=(value={balance:'1000'})=>({ok:true,json:async()=>value});
describe('shared chain request budget (offline)',()=>{
 it('coalesces concurrent reads and paces different requests',async()=>{
  vi.useFakeTimers();try{
   const transport=vi.fn(async()=>ok());const w=new RadioWizard('/unused',transport);w.readIntervalMs=1000;
   const a=w.api('/one'),b=w.api('/one'),c=w.api('/two');
   await vi.advanceTimersByTimeAsync(0);expect(transport).toHaveBeenCalledTimes(1);
   await vi.advanceTimersByTimeAsync(999);expect(transport).toHaveBeenCalledTimes(1);
   await vi.advanceTimersByTimeAsync(1);await Promise.all([a,b,c]);expect(transport).toHaveBeenCalledTimes(2);
  }finally{vi.useRealTimers();}
 });
 it.each(['90',new Date(190000).toUTCString()])('honours Retry-After %s across reads and submissions',async retry=>{
  let now=100000;const transport=vi.fn(async()=>({ok:false,status:429,headers:new Headers({'retry-after':retry})}));
  const w=new RadioWizard('/unused',transport);w.now=()=>now;
  await expect(w.api('/one')).rejects.toMatchObject({status:429});
  expect(w.cooldownUntil).toBe(190000);
  await expect(w.api('/two')).rejects.toMatchObject({status:429});
  await expect(w.api('/v2/transactions',{method:'POST',body:'fake'})).rejects.toMatchObject({status:429});
  expect(transport).toHaveBeenCalledTimes(1);
  now=190000;transport.mockImplementation(async()=>ok());await w.api('/two');expect(transport).toHaveBeenCalledTimes(2);
 });
 it('does not replay an ambiguous broadcast',async()=>{
  const transport=vi.fn(async()=>{throw Error('connection lost');});const w=new RadioWizard('/unused',transport);
  await expect(w.api('/v2/transactions',{method:'POST',body:'fake'})).rejects.toThrow('connection lost');expect(transport).toHaveBeenCalledTimes(1);
 });
 it('refreshes display balance only once per minute and retains it during outages',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'request-budget-'));try{
   let now=100000;const transport=vi.fn(async()=>ok());const w=new RadioWizard(dir,transport);w.now=()=>now;await w.setup();
   for(let n=0;n<10;n++)expect((await w.status(true)).balanceMicroSTX).toBe('1000');
   expect(transport).toHaveBeenCalledTimes(1);
   now+=60000;transport.mockImplementation(async()=>{throw Error('offline');});
   expect(await w.status(true)).toMatchObject({balanceMicroSTX:'1000',balanceStale:true});expect(transport).toHaveBeenCalledTimes(2);
  }finally{await rm(dir,{recursive:true,force:true});}
 });
});
