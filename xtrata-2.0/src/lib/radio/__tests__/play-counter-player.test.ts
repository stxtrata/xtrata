// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { attachPlayCounter } from '../play-counter';
let player: HTMLAudioElement;
let clock=0;
let finish: (()=>void)[]=[];
const sent: any[]=[];
function set(values:Record<string,unknown>) { for(const [key,value] of Object.entries(values)) Object.defineProperty(player,key,{value,writable:true,configurable:true}); }
function fire(name:string){player.dispatchEvent(new Event(name));}
function listen(seconds:number){ for(let i=0;i<seconds;i++){clock+=1000;set({currentTime:player.currentTime+1});fire('timeupdate');vi.advanceTimersByTime(1000);} }
function attach(){const c=attachPlayCounter(player);c.select('SP123.core',1);finish.push(c.destroy);return c;}
beforeEach(()=>{
  vi.useFakeTimers();vi.setSystemTime(new Date('2026-09-14T12:00:00Z'));clock=0;sent.length=0;finish=[];
  vi.spyOn(performance,'now').mockImplementation(()=>clock);
  localStorage.clear();sessionStorage.clear();
  vi.stubGlobal('fetch',vi.fn(async(_url:string,options:any)=>{sent.push(JSON.parse(options.body));return {status:200};}));
  player=document.createElement('audio');set({currentTime:0,duration:240,paused:false,ended:false,seeking:false,muted:false,volume:1,readyState:4,playbackRate:1,loop:false});
});
afterEach(()=>{finish.forEach(f=>f());vi.useRealTimers();vi.restoreAllMocks();vi.unstubAllGlobals();});
const state=()=>JSON.parse(sessionStorage.getItem('xtrata.radio.counter.v1')!);
describe('player lifecycle integration',()=>{
  it('counts actual progress, excludes muted/paused/buffering time and large seeks',()=>{
    attach();fire('playing');listen(12);
    expect(state().current.event.seconds).toBe(12);
    set({muted:true});fire('volumechange');listen(10);
    expect(state().current.event.seconds).toBe(12);
    set({muted:false});fire('volumechange');listen(5);
    set({paused:true});fire('pause');clock+=5000;vi.advanceTimersByTime(5000);
    expect(state().current.event.seconds).toBe(17);
    set({paused:false});fire('playing');set({seeking:true,currentTime:220});fire('seeking');set({seeking:false});fire('seeked');listen(2);
    expect(state().current.event.seconds).toBe(19);
    fire('waiting');clock+=10000;vi.advanceTimersByTime(10000);
    expect(state().current.event.seconds).toBe(19);
  });
  it('keeps a session across pause and refresh but closes it at track change',()=>{
    const c=attach();fire('playing');listen(12);const id=state().current.event.sessionId;
    set({paused:true});fire('pause');set({paused:false});fire('playing');listen(2);
    expect(state().current.event.sessionId).toBe(id);
    c.destroy();finish=[];
    const restored=attach();fire('playing');listen(1);expect(state().current.event.sessionId).toBe(id);
    restored.select('SP123.core',2);set({currentTime:0});fire('playing');listen(1);
    expect(state().current.event.sessionId).not.toBe(id);
    expect(state().pending.find((e:any)=>e.sessionId===id&&e.sequence>0).closed).toBe(true);
  });
  it('ends session at completion and starts a fresh native loop',()=>{
    attach();set({duration:10,loop:true});fire('playing');listen(9);
    const id=state().current.event.sessionId;
    set({currentTime:0});clock+=1000;fire('timeupdate');vi.advanceTimersByTime(1000);listen(2);
    expect(state().current.event.sessionId).not.toBe(id);
    expect(state().pending.find((e:any)=>e.sessionId===id&&e.sequence>0).closed).toBe(true);
    set({ended:true,paused:true});fire('ended');expect(state().current).toBe(null);
  });
  it('does not create a play when audio never starts; honors opt-out',()=>{
    attach();vi.advanceTimersByTime(11000);expect(sent).toHaveLength(0);
    finish.forEach(f=>f());finish=[];localStorage.setItem('xtrata.radio.analytics.disabled','1');
    attach();fire('playing');listen(40);expect(sent).toHaveLength(0);
  });
  it('records heartbeats without interrupting playback when the network fails',async()=>{
    vi.mocked(fetch).mockRejectedValue(new Error('offline'));
    attach();fire('playing');listen(40);await Promise.resolve();
    expect(state().current.event.seconds).toBe(40);
    expect(state().pending.some((e:any)=>e.sequence===0)).toBe(true);
    expect(player.paused).toBe(false);
  });
  it('discards malformed saved sessions and foreign-browser queued observations',()=>{
    const browserId=crypto.randomUUID();
    localStorage.setItem('xtrata.radio.browser.v1',browserId);
    sessionStorage.setItem('xtrata.radio.counter.v1',JSON.stringify({at:Date.now(),
      current:{touched:Date.now(),event:{browserId,closed:false,spans:null}},
      pending:[null,{sessionId:crypto.randomUUID(),browserId:crypto.randomUUID()}]}));
    attach();fire('playing');listen(3);
    expect(state().current.event.seconds).toBe(3);
    expect(state().pending.every((e:any)=>e.browserId===browserId)).toBe(true);
    expect(player.paused).toBe(false);
  });
});
