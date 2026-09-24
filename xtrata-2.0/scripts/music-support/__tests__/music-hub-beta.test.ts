// @vitest-environment happy-dom
import {readFileSync} from 'node:fs';
import {afterEach, expect, it, vi} from 'vitest';
const html=readFileSync('music/lounge.html','utf8');
const script=readFileSync('public/radio/music-hub.js','utf8');
const setup=()=>{document.body.innerHTML=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<link\b[^>]*>/g,'');};
afterEach(()=>{vi.unstubAllGlobals();document.body.innerHTML='';});
it('unifies downloads, sorts versions numerically and opens only the latest beta per platform',async()=>{
 setup();const entry=(version:string,platform='win-x64')=>({platform,version,url:`https://github.com/stxtrata/xtrata/releases/download/test/app-${version}.exe`,sha256:'a'.repeat(64),verified:true,signed:false,preview:true});
 vi.stubGlobal('fetch',vi.fn(async()=>({ok:true,json:async()=>({channel:'preview',downloads:[entry('1.0.6')],betaDownloads:[{...entry('1.0.9'),betaBuild:2},{...entry('1.0.10'),betaBuild:1},{...entry('1.0.6','mac-universal'),betaBuild:1}]})})));
 new Function(script)();
 await vi.waitFor(()=>expect(document.querySelectorAll('#downloads-list > details')).toHaveLength(4));
 const rows=[...document.querySelectorAll<HTMLDetailsElement>('#downloads-list > details')];
 expect(rows.map(r=>r.open)).toEqual([true,true,false,false]);
 expect(rows[0].querySelector('a')!.textContent).toContain('1.0.10 · Beta');
 expect(rows[0].querySelector('a')!.getAttribute('href')).toContain('app-1.0.10.exe');
 expect(rows[1].textContent).toContain('Mac');expect(rows[2].textContent).toContain('1.0.9');
 expect(rows[3].textContent).toContain('1.0.6 · Preview');expect(document.querySelector('#beta-versions')).toBeNull();
});
it('keeps the same unified defaults when release metadata is unavailable',async()=>{
 setup();vi.stubGlobal('fetch',vi.fn(async()=>{throw Error('offline');}));new Function(script)();
 const rows=[...document.querySelectorAll<HTMLDetailsElement>('#downloads-list > details')];
 expect(rows).toHaveLength(12);expect(rows.filter(r=>r.open)).toHaveLength(3);
 expect(rows.slice(0,3).every(r=>r.open&&r.textContent!.includes('Latest beta'))).toBe(true);
 expect(rows[0].textContent).toContain('1.0.9');expect(rows.slice(3).every(r=>!r.open)).toBe(true);
});
