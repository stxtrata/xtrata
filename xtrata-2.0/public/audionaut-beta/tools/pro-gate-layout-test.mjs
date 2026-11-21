#!/usr/bin/env node
// Keep the real shared story script: its injected layout previously covered the
// Pro wallet action. Trial clicks check reachability without opening any wallet.
import assert from 'node:assert/strict';
import {serve,browser} from './serve.mjs';
const {srv,url}=await serve(),b=await browser();
try{
 for(const viewport of [{width:1440,height:950},{width:1024,height:650},{width:390,height:844},{width:320,height:568}]){
  const context=await b.newContext({viewport}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await context.route('**/*',route=>{
   const target=new URL(route.request().url());if(target.origin!==url)return route.abort();
   if(target.pathname==='/api/audionaut-beta/session')return route.fulfill({contentType:'application/json',body:JSON.stringify({signedIn:false,allowed:false})});
   return route.continue();
  });
  await page.goto(url+'/audionaut-beta/');await page.waitForSelector('#stage.sell-on .sell-card');
  for(const state of ['sealed','denied']){
   await page.evaluate(state=>{const stage=document.querySelector('#stage');stage.dataset.state=state;stage.dataset.mode=state==='denied'?'denied':'idle';stage.scrollTop=0;},state);
   await page.waitForTimeout(100);
   const bounds=await page.evaluate(()=>{const controls=document.querySelector('.controls').getBoundingClientRect(),card=document.querySelector('.sell-card').getBoundingClientRect();return {controlsBottom:controls.bottom,cardTop:card.top,contentFits:[...document.querySelectorAll('#stage>.panel,#stage>.controls,#stage>.sell-card,#stage>.sell-music')].every(element=>{const r=element.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;})};});
   assert.ok(bounds.cardTop>=bounds.controlsBottom,JSON.stringify({viewport,state,bounds}));assert.equal(bounds.contentFits,true,JSON.stringify({viewport,state,bounds}));
   const targets=['#action','#sound','.sell-music button',...(state==='denied'?['#switch','#get','#leave-denied']:[])];
   for(const selector of targets){const button=page.locator(selector);await button.scrollIntoViewIfNeeded();await button.click({trial:true});const visible=await button.evaluate(element=>{const r=element.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return element===hit||element.contains(hit);});assert.equal(visible,true,`${viewport.width}px ${state}: ${selector} is covered`);}
  }
  await page.evaluate(()=>{const stage=document.querySelector('#stage');stage.dataset.state='sealed';stage.dataset.mode='idle';stage.scrollTop=0;});await page.waitForTimeout(100);
  await page.screenshot({path:`/tmp/audionaut-pro-gate-layout-${viewport.width}.png`});assert.deepEqual(errors,[]);await context.close();
 }
 console.log('PASS Pro gate layout: real story layer, desktop/mobile sealed and denied states, no overlapping controls, all actions reachable without wallet interaction');
}finally{await b.close();await new Promise(resolve=>srv.close(resolve));}
