// @vitest-environment happy-dom
import {readFileSync} from 'node:fs';
import {afterEach, expect, it, vi} from 'vitest';
const html=readFileSync('music/lounge.html','utf8');
const script=readFileSync('public/radio/music-hub.js','utf8');
afterEach(()=>{vi.unstubAllGlobals();document.body.innerHTML='';});
it('keeps current downloads and renders beta versions in a closed disclosure',async()=>{
 document.body.innerHTML=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<link\b[^>]*>/g,'');
 const entry=(version:string)=>({platform:'win-x64',version,url:`https://github.com/stxtrata/xtrata/releases/download/test/app-${version}.exe`,sha256:'a'.repeat(64),verified:true,signed:false,preview:true});
 vi.stubGlobal('fetch',vi.fn(async()=>({ok:true,json:async()=>({channel:'preview',downloads:[entry('1.0.6')],betaDownloads:[{...entry('1.0.7'),betaBuild:2}]})})));
 new Function(script)();
 await vi.waitFor(()=>expect(document.querySelector('#beta-downloads-list a')!.textContent).toBe('Download beta 1.0.7 · build 2'));
 expect(document.querySelector('#beta-downloads-list a')!.textContent).toBe('Download beta 1.0.7 · build 2');
 expect(document.querySelector('#downloads-list')!.textContent).toContain('1.0.6');
 expect(document.querySelector('#downloads-list')!.textContent).not.toContain('1.0.7');
 expect((document.querySelector('#beta-versions') as HTMLDetailsElement).open).toBe(false);
 expect(document.querySelector('#beta-versions > summary')!.textContent).toBe('Beta Versions');
});
