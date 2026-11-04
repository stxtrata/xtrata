/* Standalone test host ONLY. One play-money account, never a wallet or a second casino account. */
window.PX_STANDALONE_TEST=true;
(() => {
  'use strict';
  const qa=new URLSearchParams(location.search).get('qa')||window.frameElement?.dataset?.qa;
  const KEY='parallax.launchpad.standalone.v1'+(qa?'.qa.'+qa:'');
  let held=true, revision=0, fault='', memory=null, storageFailed=false;
  const bindings=new WeakMap(), listeners=new Set();
  const copy=x=>JSON.parse(JSON.stringify(x));
  function read(){if(transaction)return transaction;if(storageFailed&&memory)return memory;try{const raw=localStorage.getItem(KEY);if(raw)return JSON.parse(raw);}catch(e){storageFailed=true;fault='Storage unavailable: this session is temporary.';}return memory||{bank:10000,games:{},revision:0};}
  function write(r){r.revision=++revision;memory=copy(r);try{if(!storageFailed)localStorage.setItem(KEY,JSON.stringify(r));}catch(e){storageFailed=true;fault='Storage unavailable: this session is temporary.';}listeners.forEach(fn=>fn());}
  function attach(s,id){bindings.set(s,id);Object.defineProperty(s,'balance',{configurable:true,enumerable:true,get(){return read().bank;},set(v){if(!Number.isFinite(v))throw Error('Invalid play balance');const r=read();r.bank=Math.round(v*100)/100;memory=r;if(transaction)transaction.bank=r.bank;else write(r);}});return s;}
  let transaction=null;
  function transact(s,fn){const id=bindings.get(s);if(!held||!id)throw Error('Test account unavailable');const before=read();transaction=copy(before);const originalRead=memory;try{const result=fn();transaction.games[id]=copy(s);write(transaction);return result;}catch(e){memory=before;throw e;}finally{transaction=null;}}
  // All engine mutations and a pending round are saved synchronously before presentation starts.
  function machine(id,engine){const api={...engine};api.fresh=()=>attach(engine.fresh(),id);api.load=raw=>attach(engine.load(raw),id);for(const name of ['start','settle','pick','respin','collect','endFree','gamble'])api[name]=(s,...args)=>transact(s,()=>engine[name](s,...args));return api;}
  function openGame(id,engine){const r=read();const s=engine.load(r.games[id]);attach(s,id);return s;}
  function saveGame(s){if(!held)return false;const id=bindings.get(s);if(!id)throw Error('Practice state cannot be saved to LAYR');const r=read();r.games[id]=copy(s);write(r);return true;}
  window.ParallaxLAYRAccount=Object.freeze({version:'launchpad-test-1',mode:'standalone-test',onChainConnected:false,acquire:async()=>{held=true;return true;},ready:()=>held,error:()=>fault,balance:()=>read().bank,machine,openGame,saveGame,subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},snapshot:()=>copy(read()),reset(){write({bank:10000,games:{},revision:0});},release(){held=false;}});
})();
