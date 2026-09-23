import {chromium} from 'playwright';
import {readFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,channel:'chrome'});
try {
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const contract='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0';
 const events=Array.from({length:103},(_,i)=>({tx_id:'0x'+i.toString(16).padStart(64,'0'),event_type:'smart_contract_log',block_time:1700000000+i*60,contract_log:{contract_id:contract,topic:'print',value:{repr:`(tuple (event "radio-paid-play") (core u3) (id u315) (amount u50) (total u${i+1}) (payer 'SP${i<101?'ONE':'TWO'}) (recipient 'SPHOLDER))`}}}));
 await page.route('**/*',async route=>{
  const u=new URL(route.request().url());
  if(u.pathname.includes('/logs')||u.pathname.includes('/events')){const offset=Number(u.searchParams.get('offset'));return route.fulfill({json:{total:events.length,results:events.slice(offset,offset+20)}});}
  if(u.pathname==='/radio/counts')return route.fulfill({json:{tracks:[{id:315,title:'Entertainment',artist:'melophonic'}]}});
  const files={'/music/heroes':'music/heroes.html','/radio/music-hub.css':'public/radio/music-hub.css','/radio/music-heroes.css':'public/radio/music-heroes.css','/radio/music-heroes.mjs':'public/radio/music-heroes.mjs','/radio/chain-activity.js':'public/radio/chain-activity.js','/radio/paid-receipt.mjs':'public/radio/paid-receipt.mjs'};
  const file=files[u.pathname];if(!file)return route.fulfill({status:404,body:''});
  return route.fulfill({body:await readFile(file),contentType:file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':'text/javascript'});
 });
 await page.setViewportSize({width:1440,height:1100});await page.goto('https://heroes.test/music/heroes');
 await page.waitForFunction(()=>document.querySelector('#hero-status').textContent.includes('Full history loaded'));
 assert.match(await page.locator('#hero-totals').innerText(),/103 paid plays · 2 support wallets · 0.005150 STX/);
 assert.equal(await page.locator('.hero-card').count(),2);await page.locator('.hero-card summary').first().click();
 assert.match(await page.locator('.hero-card').first().innerText(),/Bronze/);
 await mkdir('.artifacts/music-heroes',{recursive:true});await page.screenshot({path:'.artifacts/music-heroes/desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.screenshot({path:'.artifacts/music-heroes/mobile.png',fullPage:true});
 await page.locator('#hero-search').fill('SPTWO');assert.equal(await page.locator('.hero-card').count(),1);
 assert.deepEqual(errors,[]);console.log('Heroes desktop/mobile smoke passed: full history, tiers, filtering, no overflow or JS errors. All network responses mocked.');
}finally{await browser.close();}
