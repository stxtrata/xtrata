// @vitest-environment happy-dom
import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {initXtrataRadio} from '../radio';
vi.mock('../../lib/radio/play-counter',()=>({attachPlayCounter:()=>({setTrack:vi.fn()})}));
beforeEach(()=>{
 document.body.replaceChildren();localStorage.clear();sessionStorage.clear();
 vi.useFakeTimers();
 vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify({tracks:[]}))));
});
afterEach(()=>{vi.clearAllTimers();vi.useRealTimers();vi.unstubAllGlobals();});
it('offers preserved local favourites on first visit without changing the heart or opening a wallet',()=>{
 const saved=JSON.stringify([{tokenId:'12',title:'My saved song'}]);localStorage.setItem('xtrata.radio.likes',saved);
 const api=initXtrataRadio({tokenIds:['12'],resumePlayback:false});
 const dialog=document.querySelector<HTMLDialogElement>('.xtrata-radio-likes-dialog')!;
 expect(dialog.open).toBe(true);expect(dialog.textContent).toContain('My saved song');
 expect(dialog.querySelector('a[href="/radio/endorse?import=1"]')).not.toBeNull();
 expect(localStorage.getItem('xtrata.radio.likes')).toBe(saved);expect(api!.getLikes()).toEqual([]);
 expect(document.querySelector('.xtrata-radio__btn--heart')?.getAttribute('aria-pressed')).toBe('false');
});
it('heart opens wallet guidance even before a song starts; saved likes remain accessible after dismissal',()=>{
 sessionStorage.setItem('xtrata.radio.import-offered.v1','1');
 localStorage.setItem('xtrata.radio.likes',JSON.stringify([{tokenId:'12',title:'Saved'}]));
 initXtrataRadio({tokenIds:['12'],resumePlayback:false});
 const dialog=document.querySelector<HTMLDialogElement>('.xtrata-radio-likes-dialog')!;
 expect(dialog.open).toBe(false);
 document.querySelector<HTMLButtonElement>('.xtrata-radio__btn--heart')!.click();
 expect(dialog.open).toBe(true);expect(dialog.textContent).toContain('Connect wallet / choose a song');
 dialog.close();document.querySelector<HTMLAnchorElement>('.xtrata-radio__chain-like')!.click();
 expect(dialog.open).toBe(true);expect(dialog.textContent).toContain('Saved');
});
