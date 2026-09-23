// @vitest-environment happy-dom
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {mountPaidPlayReaders, PAID_PLAYS_CONTRACT} from '../../../public/radio/chain-activity.js';
const event = (n:number) => ({event_type:'smart_contract_log',tx_id:'0x'+n.toString(16).padStart(64,'0'),contract_log:{contract_id:PAID_PLAYS_CONTRACT,topic:'print',value:{repr:`(tuple (amount u50) (core u3) (event "radio-paid-play") (id u315) (payer 'SP123) (recipient 'SP456) (total u${n}))`}}});
function mount(){
 document.body.innerHTML='<section data-xtrata-chain-plays data-chain-history><button data-chain-refresh>Refresh</button><p data-chain-status></p><div data-chain-list></div></section>';
 mountPaidPlayReaders();
}
beforeEach(()=>vi.stubGlobal('location',new URL('https://xtrata.xyz/music/lounge')));
afterEach(()=>{window.dispatchEvent(new Event('pagehide'));vi.useRealTimers();vi.unstubAllGlobals();document.body.innerHTML='';localStorage.clear();});
describe('automatic public history',()=>{
 it('loads every page without clicks, caches the total and catches new payments',async()=>{
  vi.useFakeTimers();let newest=3;
  vi.stubGlobal('fetch',vi.fn(async(url:string)=>{
   if(url.includes('/radio/counts'))return {ok:true,json:async()=>({tracks:[]})};
   const offset=Number(new URL(url,'https://xtrata.xyz').searchParams.get('offset'));
   const events=Array.from({length:newest},(_,i)=>event(newest-i));
   return {ok:true,json:async()=>({total:newest,results:events.slice(offset,offset+2)})};
  }));
  mount();await vi.advanceTimersByTimeAsync(1000);
  expect(document.querySelector('details')!.open).toBe(false);
  expect(document.querySelector('.chain-totals')!.textContent).toContain('3 total paid starts');
  expect(document.querySelector('.chain-totals')!.textContent).toContain('0.000150 STX');
  newest=4;await vi.advanceTimersByTimeAsync(15000);
  expect(document.querySelector('.chain-totals')!.textContent).toContain('4 total paid starts');
  expect(JSON.parse(localStorage.getItem(`xtrata-paid-play-history-v1:${PAID_PLAYS_CONTRACT}`)!).plays).toHaveLength(4);
  window.dispatchEvent(new Event('pagehide'));
  mount();
  expect(document.querySelector('.chain-totals')!.textContent).toContain('4 paid starts at last complete check');
  expect(document.querySelectorAll('.chain-play')).toHaveLength(4);
  await vi.advanceTimersByTimeAsync(1000);
  expect(document.querySelector('.chain-totals')!.textContent).toContain('4 total paid starts');
 });
 it('ignores malformed cached history while retaining a valid previous total',()=>{
  localStorage.setItem(`xtrata-paid-play-total-v1:${PAID_PLAYS_CONTRACT}`,JSON.stringify({count:7,checkedAt:1}));
  localStorage.setItem(`xtrata-paid-play-history-v1:${PAID_PLAYS_CONTRACT}`,JSON.stringify({count:7,plays:[event(1),{txid:'javascript:bad'}]}));
  vi.stubGlobal('fetch',vi.fn(()=>new Promise(()=>{})));
  mount();
  expect(document.querySelector('.chain-totals')!.textContent).toContain('7 paid starts at last complete check');
  expect(document.querySelectorAll('.chain-play')).toHaveLength(0);
 });
 it('does not present partial history as a complete total when the service fails',async()=>{
  vi.useFakeTimers();
  vi.stubGlobal('fetch',vi.fn(async(url:string)=>{
   if(url.includes('/radio/counts'))return {ok:true,json:async()=>({tracks:[]})};
   if(url.includes('offset=0'))return {ok:true,json:async()=>({total:3,results:[event(3),event(2)]})};
   throw Error('offline');
  }));
  mount();await vi.advanceTimersByTimeAsync(1000);
  expect(document.querySelector('.chain-totals')!.textContent).toContain('Counting all paid starts');
  expect(document.querySelector('[data-chain-status]')!.textContent).toContain('unavailable');
 });
});
