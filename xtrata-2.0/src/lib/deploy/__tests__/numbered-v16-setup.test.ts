// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { numberedSetupSteps, renderNumberedSetup } from '../numbered-v16-setup';
import inventory from '../numbered-v16-inventory.json';
const response = (value: unknown) => ({success:true,value:{value}});
const read = vi.fn(async (name: string, _args: unknown[], write: boolean) => write ? 'submitted' : response(name==='is-paused'?true:name==='get-max-supply'?'10':'0'));
describe('Numbers v1.6 restoration',()=>{
 it('only prepares configuration, without minting, publishing or unpausing',()=>{
  const call=vi.fn();renderNumberedSetup(call,vi.fn(),vi.fn());expect(call).not.toHaveBeenCalled();
  expect(numberedSetupSteps().map(s=>s.name)).toEqual(['set-max-supply','set-collection-metadata','set-mint-price','set-recipients','set-splits','set-registered-token-uri-batch']);
  expect(inventory).toHaveLength(10);expect(new Set(inventory.map(a=>a.hash)).size).toBe(10);
  for(const item of inventory){expect(item.hash).toMatch(/^[a-f0-9]{64}$/);expect(item.uri.length).toBeLessThanOrEqual(256);}
 });
 it('blocks writes when legacy state is unsafe',async()=>{
  const call=vi.fn();const root=renderNumberedSetup(call,async()=>{throw Error('legacy reservation');},vi.fn());root.querySelector('button')!.click();
  await vi.waitFor(()=>expect(root.textContent).toContain('legacy reservation'));expect(call).not.toHaveBeenCalled();
 });
 it('skips the immutable supply transaction when already configured',async()=>{
  read.mockClear();const root=renderNumberedSetup(read,async()=>{},vi.fn());root.querySelector('button')!.click();
  await vi.waitFor(()=>expect(root.textContent).toContain('Supply is already 10'));expect(read.mock.calls.some(c=>c[2])).toBe(false);
 });
 it('copies validated payout addresses from the old contract',async()=>{
  read.mockClear();const address='SP3P8VYRTXYVEH2R85YKASHTD65Z4E4RC13MY7X6M';
  const root=renderNumberedSetup(read,async()=>{},async()=>response(Object.fromEntries(['artist','marketplace','operator'].map(k=>[k,{value:address}]))));
  root.querySelectorAll('button')[3].click();await vi.waitFor(()=>expect(read.mock.calls.some(c=>c[0]==='set-recipients'&&c[2])).toBe(true));
 });
});
