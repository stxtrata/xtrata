import assert from "node:assert/strict";
import {serve,browser,page} from "./serve.mjs";
const server=await serve(),b=await browser(),logs=[];
try {
 const p=await page(b,server.url,{logs});await p.goto(server.url+"/audionaut-beta-pro/daw.html");
 await p.waitForFunction(()=>document.querySelector("#synth-front"),{timeout:30000});
 const result=await p.evaluate(async()=>{
  const base="/audionaut-beta-pro/daw/js/",{store}=await import(base+"state.js"),{SYNTH_BANK}=await import(base+"synths.js"),{openSynthPanel}=await import(base+"synth-panel.js"),{Kit}=await import(base+"synth-faces/index.js"),{Kit:Effects}=await import(base+"plugin-faces/index.js"),{PLUGIN_TYPES,pluginDefaults}=await import(base+"plugins.js");
  const failures=[];
  for(const id of Object.keys(SYNTH_BANK)){store.setInstrumentProp(0,"synthId",id);store.setInstrumentProp(0,"params",null);openSynthPanel(0);await Kit.load(id);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));const host=document.querySelector("#synth-front");if(!host.querySelector("#sfp-bank-save"))failures.push(`${id}: missing bank`);if(Kit.has(id)&&!host.querySelector(".sfp-face-host")?.querySelector("div")?.querySelector("div")?.shadowRoot)failures.push(`${id}: missing custom face`);}
  // Verify rendered piano geometry on every face and the fallback keyboard.
  for(const id of Object.keys(SYNTH_BANK)){
    store.setInstrumentProp(0,"synthId",id);openSynthPanel(0);await Kit.load(id);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    const host=document.querySelector('#synth-front'),sh=host.querySelector('.sfp-face-host')?.firstElementChild?.firstElementChild?.shadowRoot||host;
    const keys=[...sh.querySelectorAll('.kb-w,.kb-b')];
    for(const black of keys.filter(k=>k.classList.contains('kb-b'))){const white=keys.find(k=>+k.dataset.base===+black.dataset.base-1),a=black.getBoundingClientRect(),b=white?.getBoundingClientRect();if(!b||Math.abs(a.left+a.width/2-b.right)>1)failures.push(`${id}: misaligned black key ${black.dataset.base}`);}
  }
  const host=document.createElement("div");host.style.width="900px";document.body.append(host);
  for(const id of Object.keys(PLUGIN_TYPES)){if(!Effects.has(id))continue;await Effects.load(id);let params=pluginDefaults(id);const listeners=new Set(),link={getEnabled:()=>true,setEnabled:()=>{},getParams:()=>params,setParams:p=>{params={...params,...p};for(const f of listeners)f();},onChange:f=>{listeners.add(f);return()=>listeners.delete(f);},inst:()=>null,taps:()=>null,bus:()=>null};try{const handle=Effects.mount(host,id,link);if(!handle)failures.push(`${id}: missing plugin face`);handle?.dispose();}catch(e){failures.push(`${id}: ${e.message}`);}}
  host.remove();return{failures,synths:Object.keys(SYNTH_BANK).length};
 });
 await p.locator(".sfp-bank summary").click();
 await p.locator("#sfp-preset-name").fill("Browser test sound");await p.locator("#sfp-bank-save").click({force:true});
 await p.setViewportSize({width:390,height:844});
 const bankBounds=await p.locator(".sfp-bank > div").boundingBox();assert.ok(bankBounds.x>=-1&&bankBounds.x+bankBounds.width<=391,`Mobile bank overflows: ${JSON.stringify(bankBounds)}`);
 if(process.env.SCREENSHOT_DIR)await p.screenshot({path:process.env.SCREENSHOT_DIR+"/sounds-bank-mobile.png"});
 console.log(JSON.stringify({result,bankBounds,logs},null,2));assert.deepEqual(result.failures,[]);assert.deepEqual(logs,[]);
}finally{await b.close();await new Promise(r=>server.srv.close(r));}
