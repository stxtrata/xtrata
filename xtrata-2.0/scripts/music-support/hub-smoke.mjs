import {chromium} from 'playwright';
import {readFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{const page=await browser.newPage();let published=false;
 await page.route('https://xtrata.xyz/**',async route=>{const path=new URL(route.request().url()).pathname;
 if(path==='/radio/music-releases.json'&&published)return route.fulfill({json:{version:'0.1.0',summary:'Test release',downloads:[{platform:'mac-arm64',url:'https://github.com/stxtrata/xtrata/releases/download/test/app.dmg',sha256:'a'.repeat(64),signed:true,verified:true,requirements:'Simulated release only'},{platform:'win-x64',url:'https://evil.test/app.exe',sha256:'a'.repeat(64),signed:true,verified:true}]}});
 const file=path==='/radio/lounge'?'/radio/lounge.html':path;
 try{return route.fulfill({body:await readFile('public'+file),contentType:file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':file.endsWith('.json')?'application/json':'text/javascript'});}catch{return route.abort();}});
 await mkdir('.artifacts/music-hub',{recursive:true});
 for(const width of [1280,390]){await page.setViewportSize({width,height:1000});await page.goto('https://xtrata.xyz/radio/lounge');await page.waitForTimeout(100);assert.equal(await page.locator('a[href*="releases/download"]').count(),0);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'.artifacts/music-hub/hub-'+width+'.png',fullPage:true});}
 published=true;await page.reload();await page.getByRole('link',{name:'Download 0.1.0',exact:true}).waitFor();assert.equal(await page.locator('a[href*="evil.test"]').count(),0);console.log('PASS: hub desktop/mobile, unpublished releases hidden, verified release displayed, untrusted download excluded.');
}finally{await browser.close();}
