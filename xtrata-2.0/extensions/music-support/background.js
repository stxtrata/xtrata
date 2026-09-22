/* global chrome */
import {validate} from './validate.js';
const active=new Set();
chrome.runtime.onMessage.addListener((message,sender,reply)=>{
 try{validate(message,sender,chrome.runtime.id);}catch{reply({error:'Unsupported request or website.'});return false;}
 const key='document:'+sender.documentId;
 const urgent=['stop','disconnect'].includes(message.method);
 if(!urgent&&active.has(key)){reply({error:'Another wallet check is running. Try again shortly.'});return false;}if(!urgent)active.add(key);
 (async()=>{
  let state=(await chrome.storage.session.get(key))[key]||{};
  const call=async body=>{const r=await fetch('http://127.0.0.1:8798/web-bridge',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(55000)});const s=await r.json();if(!r.ok||s.error)throw Error(s.error||'Companion unavailable');return s;};
  const save=()=>chrome.storage.session.set({[key]:state});
  const method=message.method;
  if(method==='connect'){const p=await call({method:'pair'});state={pending:p.id};await save();return {reviewUrl:'http://127.0.0.1:8798/web-approval?id='+p.id};}
  if(method==='poll'){if(!state.pending)return {pending:false};const p=await call({method:'poll',id:state.pending});if(p.token){state.token=p.token;delete state.pending;await save();return {connected:true};}if(p.approved){delete state.pending;await save();return {approved:true};}return {pending:true};}
  if(!state.token)throw Error('Connect this browser first.');
  if(method==='support'){const p=await call({method,token:state.token,fee:message.fee});state.pending=p.id;await save();return {reviewUrl:'http://127.0.0.1:8798/web-approval?id='+p.id};}
  const result=await call({method,token:state.token,...(method==='start'?{song:message.song,id:message.startId,...(Object.hasOwn(message,'duration')?{duration:message.duration}:{})}:{})});
  if(method==='disconnect')await chrome.storage.session.remove(key);
  return result;
 })().then(reply).catch(()=>reply({error:'Wallet connection unavailable. Start your companion, or reconnect and approve locally.'})).finally(()=>{if(!urgent)active.delete(key);});
 return true;
});
