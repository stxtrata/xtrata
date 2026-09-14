// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
const page=readFileSync('public/radio/catalogue.html','utf8');
afterEach(()=>{vi.unstubAllGlobals();document.body.replaceChildren();});
describe('public catalogue controls',()=>{
 it('sorts, searches, shows details safely and preserves the chosen song when refreshing',async()=>{
 vi.resetModules();document.documentElement.innerHTML=page.replace(/<link[^>]*>/g,'').replace(/<script[\s\S]*?<\/script>/g,'');
 const tracks=[{id:1,title:'<img src=x onerror=alert(1)>',artist:'First',current_likes:7,plays:1,completions:1},{id:2,title:'Second',artist:'Other',thumbnail:'/radio/artwork?id=2',plays:8,completions:2}];
 vi.stubGlobal('fetch',vi.fn(async()=>({ok:true,json:async()=>({tracks,measured_since:Date.now(),until:Date.now(),notice:'Measured'})})));
 await import('../../../../public/radio/catalogue.js');
 await vi.waitFor(()=>expect(document.querySelectorAll('#songs tr')).toHaveLength(2));
 const image=document.querySelector<HTMLImageElement>('#songs img')!;expect(image.getAttribute('src')).toBe('/radio/artwork?id=2');expect(image.getAttribute('width')).toBe('44');image.dispatchEvent(new Event('error'));expect(document.querySelector('#songs img')).toBe(null);expect(document.querySelectorAll('.song-art')).toHaveLength(2);
 expect(document.querySelector('#songs')?.textContent).toContain('♥ 7');
 const buttons=document.querySelectorAll<HTMLButtonElement>('#columns button');buttons[3].click();buttons[3].click();
 expect(document.querySelector('#songs tr')?.textContent).toContain('Second');
 const search=document.querySelector<HTMLInputElement>('#search')!;search.value='First';search.dispatchEvent(new Event('input'));
 expect(document.querySelectorAll('#songs tr')).toHaveLength(1);
 document.querySelector<HTMLButtonElement>('#songs button')!.click();expect(document.querySelector<HTMLElement>('#detail')!.hidden).toBe(false);
 expect(document.querySelector<HTMLAnchorElement>('#detail a')!.href).toContain('tokenId=1');
 document.querySelector<HTMLButtonElement>('#reload')!.click();await vi.waitFor(()=>expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2));
 expect(document.querySelector('#detail h2')?.textContent).toContain('<img');
 });
});
