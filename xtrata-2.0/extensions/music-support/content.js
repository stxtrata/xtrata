/* global chrome */
if(window===window.top&&location.origin==='https://xtrata.xyz'){
 window.addEventListener('message',event=>{
  if(event.source!==window||event.origin!==location.origin||event.data?.channel!=='xtrata-support-request')return;
  const request=event.data.request;if(!/^[a-f0-9]{32}$/.test(request?.id||''))return;
  chrome.runtime.sendMessage(request).then(result=>window.postMessage({channel:'xtrata-support-response',id:request.id,result},location.origin)).catch(()=>window.postMessage({channel:'xtrata-support-response',id:request.id,result:{error:'Extension disconnected. Reload this page.'}},location.origin));
 });
}
