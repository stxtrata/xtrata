// @vitest-environment happy-dom
import {describe,it,expect,vi,afterEach} from 'vitest';
afterEach(()=>{vi.unstubAllGlobals();localStorage.clear();});
describe('likes snapshot sync',()=>{
 it('sends the latest persisted set, preserving browser identity across an unlike',async()=>{
  vi.resetModules();localStorage.clear();const bodies:any[]=[];
  vi.stubGlobal('fetch',vi.fn(async(_url:string,options:any)=>{bodies.push(JSON.parse(options.body));return {ok:true};}));
  const {syncRadioLikes}=await import('../likes-sync');
  localStorage.setItem('xtrata.radio.likes',JSON.stringify([{tokenId:'1'},{tokenId:'1'},{tokenId:'2'}]));syncRadioLikes();
  await vi.waitFor(()=>expect(bodies.length).toBe(1));await Promise.resolve();
  localStorage.setItem('xtrata.radio.likes',JSON.stringify([{tokenId:'2'}]));syncRadioLikes();
  await vi.waitFor(()=>expect(bodies.length).toBe(2),{timeout:4000});
  expect(bodies[0].ids).toEqual([1,2]);expect(bodies[1].ids).toEqual([2]);expect(bodies[1].browserId).toBe(bodies[0].browserId);expect(bodies[1].revision).toBeGreaterThan(bodies[0].revision);
 });
});
