/* global chrome */
document.getElementById('allow').onclick=async()=>{await chrome.storage.local.set({readAccess:true});document.getElementById('status').textContent='Availability checks allowed. Reload xtrata.xyz. No payment permission granted.';};
document.getElementById('revoke').onclick=async()=>{await chrome.storage.local.set({readAccess:false});document.getElementById('status').textContent='Access revoked.';};
