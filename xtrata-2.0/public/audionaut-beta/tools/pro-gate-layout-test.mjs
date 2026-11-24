#!/usr/bin/env node
// The public host leaves the entire viewport to the studio, on phone and desktop.
import assert from 'node:assert/strict';
import {serve,browser} from './serve.mjs';
const {srv,url}=await serve(),b=await browser();
try {
  for(const viewport of [{width:1440,height:950},{width:1024,height:650},{width:390,height:844},{width:320,height:568}]){
    const context=await b.newContext({viewport}),p=await context.newPage(),errors=[];
    p.on('pageerror',error=>errors.push(error.message));
    await context.route('**/*',route=>{
      const target=new URL(route.request().url());
      if(target.origin!==url)return route.abort();
      if(target.pathname==='/audionaut-beta/daw.html')return route.fulfill({contentType:'text/html',body:'<!doctype html><button>Open test instrument</button>'});
      return route.continue();
    });
    await p.goto(url+'/audionaut-beta/');
    const button=p.frameLocator('#daw').getByRole('button',{name:'Open test instrument'});
    await button.click({trial:true});
    const bounds=await p.locator('#daw').boundingBox();
    assert.ok(bounds && bounds.x===0 && bounds.y===0 && bounds.width===viewport.width && bounds.height===viewport.height,JSON.stringify({viewport,bounds}));
    assert.deepEqual(errors,[]);
    await context.close();
  }
  console.log('PASS public Beta host layout: full studio viewport and reachable controls');
}finally{await b.close();await new Promise(resolve=>srv.close(resolve));}
