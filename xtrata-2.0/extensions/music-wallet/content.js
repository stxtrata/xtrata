/* global chrome */
// Isolated-world script. Announcements are discovery only, never payment authority.
if(window===window.top && location.origin==='https://xtrata.xyz') {
  window.addEventListener('message',event=>{
    if(event.source!==window || event.origin!==location.origin || event.data?.channel!=='xtrata-music-read-request')return;
    const request=event.data.request;
    if(!request || !/^[0-9a-f]{32}$/.test(request.id))return;
    chrome.runtime.sendMessage(request).then(result=>{
      window.postMessage({channel:'xtrata-music-read-response',id:request.id,result},location.origin);
    }).catch(()=>window.postMessage({channel:'xtrata-music-read-response',id:request.id,result:{ok:false,error:'unavailable'}},location.origin));
  });
  chrome.storage.local.get('readAccess').then(({readAccess})=>{
    if(readAccess===true)window.postMessage({channel:'xtrata-music-read-available',schema:1},location.origin);
  });
}
