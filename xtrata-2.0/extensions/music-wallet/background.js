/* global chrome */
import { validateRead } from './validate.js';
const pending=new Set();
chrome.runtime.onMessage.addListener((message,sender,reply)=>{
  let request;
  try{request=validateRead(message,sender,chrome.runtime.id);}catch{reply({ok:false,error:'unavailable'});return false;}
  const key=`${sender.documentId}:${message.id}`;
  if(pending.has(key)||pending.size>=8){reply({ok:false,error:'busy'});return false;}
  pending.add(key);
  let done=false, port;
  const finish=value=>{if(done)return;done=true;clearTimeout(timer);pending.delete(key);port?.disconnect();reply(value);};
  const timer=setTimeout(()=>finish({ok:false,error:'unavailable'}),2000);
  chrome.storage.local.get('readAccess').then(({readAccess})=>{
    if(done)return;
    if(readAccess!==true){finish({ok:false,error:'not-paired'});return;}
    try{
      port=chrome.runtime.connectNative('xyz.xtrata.music_wallet');
      port.onMessage.addListener(response=>{
        // Host has a fixed public result schema. Never forward arbitrary native data.
        if(response?.id!==message.id || !['unavailable','not-paired'].includes(response?.error) || Object.keys(response).length!==3 || response.ok!==false) {
          finish({ok:false,error:'unavailable'});return;
        }
        finish({ok:false,error:response.error});
      });
      port.onDisconnect.addListener(()=>{void chrome.runtime.lastError;finish({ok:false,error:'unavailable'});});
      port.postMessage(request);
    }catch{finish({ok:false,error:'unavailable'});}
  }).catch(()=>finish({ok:false,error:'unavailable'}));
  return true;
});
