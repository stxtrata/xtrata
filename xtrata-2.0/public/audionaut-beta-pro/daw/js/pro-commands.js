import { openWorkspace } from './pro-workspace.js';
import { el, action, field, row, status } from './pro-ui.js';
const KEY='audionaut.beta-pro.shortcuts';
const defaults={palette:'Mod+k',save:'Mod+s',mixer:'Mod+2',timeline:'Mod+1',automation:'Mod+3',stop:'Escape'};
let shortcuts={...defaults},initialized=false;
const click=id=>document.querySelector(id)?.click();
const commands=[
  ['mobile','Open mobile step sequencer',()=>openWorkspace('mobile')],['help','Help and lessons',()=>click('#studio-help')],['timeline','Open song timeline',()=>openWorkspace('timeline')],['patterns','Open sequences',()=>openWorkspace('sequence')],['mixer','Open mixer',()=>openWorkspace('mixer')],['automation','Open automation',()=>openWorkspace('automation')],['recording','Record audio and manage takes',()=>openWorkspace('recording')],['sampler','Open sampler',()=>openWorkspace('sampler')],['performance','Open performance diagnostics',()=>openWorkspace('performance')],
  ['play','Play or pause',()=>click('#btn-play')],['stop','Stop playback',()=>click('#btn-stop')],['panic','Panic: stop every note',()=>click('#live-panic')],['save','Download project',()=>click('#btn-save')],['load','Load project',()=>click('#btn-load')],['new','New project',()=>click('#btn-new')],['undo','Undo',()=>click('#btn-undo')],['redo','Redo',()=>click('#btn-redo')],['export','Export audio or project',()=>click('#btn-publish')],['projects','Projects and recovery',()=>click('#btn-projects')],['shortcuts','Edit keyboard shortcuts',()=>editShortcuts()],
];
export function openCommands() {
  const existing=document.querySelector('#pro-command-dialog');if(existing?.open){existing.querySelector('input')?.focus();return;}existing?.remove();
  const dialog=el('dialog',null,{className:'pro-dialog',id:'pro-command-dialog','aria-label':'Commands'}),search=el('input',null,{type:'search',placeholder:'Find a command…','aria-label':'Search commands'}),list=el('div',null,{className:'pro-command-list'}),opener=document.activeElement;
  const close=()=>{dialog.close();dialog.remove();opener?.focus();};
  const paint=()=>{list.replaceChildren();for(const [id,label,fn]of commands.filter(([,name])=>name.toLowerCase().includes(search.value.toLowerCase())))list.append(action(`${label}${shortcuts[id]?' · '+shortcuts[id]:''}`,async()=>{close();await fn();}));};
  search.addEventListener('input',paint);search.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();list.querySelector('button')?.click();}});dialog.addEventListener('cancel',e=>{e.preventDefault();close();});dialog.append(el('h2','Commands'),field('Search commands',search),list,action('Close',close));document.body.append(dialog);paint();dialog.showModal();search.focus();
}
function editShortcuts(){
  const dialog=el('dialog',null,{className:'pro-dialog','aria-label':'Keyboard shortcuts'}),draft={...shortcuts},opener=document.activeElement;const close=()=>{dialog.close();dialog.remove();if(opener?.isConnected)opener.focus();};dialog.addEventListener('cancel',event=>{event.preventDefault();close();});dialog.append(el('h2','Keyboard shortcuts'),el('p','Use Mod for Command on Mac or Control elsewhere, for example Mod+Shift+s. Leave blank to remove a shortcut.',{className:'pro-help'}));
  for(const[id,label]of[['palette','Open commands'],...commands.filter(c=>c[0]!=='shortcuts')]){const input=el('input',null,{value:draft[id]||''});input.onchange=()=>draft[id]=input.value.trim();dialog.append(field(label,input));}
  dialog.append(row(action('Save shortcuts',()=>{const seen=new Set();for(const value of Object.values(draft).filter(Boolean)){if(seen.has(value.toLowerCase()))throw Error('Choose a different shortcut for each command.');seen.add(value.toLowerCase());}localStorage.setItem(KEY,JSON.stringify(draft));shortcuts=draft;close();}),action('Restore defaults',()=>{shortcuts={...defaults};localStorage.removeItem(KEY);close();}),action('Cancel',close)));document.body.append(dialog);dialog.showModal();
}
function matches(event,shortcut){if(!shortcut)return false;const bits=shortcut.toLowerCase().split('+'),key=bits.at(-1),mod=bits.includes('mod');return event.key.toLowerCase()===key&&Boolean(event.metaKey||event.ctrlKey)===mod&&event.shiftKey===bits.includes('shift')&&event.altKey===bits.includes('alt');}
function modalAccessibility(){
  let active=null,opener=null;
  const update=()=>{
    const next=[...document.querySelectorAll('.modal:not(.hidden)')].filter(n=>getComputedStyle(n).display!=='none').at(-1)||null;
    if(next===active)return;
    const app=document.querySelector('#app');if(app)app.inert=!!next;
    if(next){opener ||= document.activeElement;active=next;const box=next.querySelector('.modal-box')||next;box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');if(!box.getAttribute('aria-label')&&!box.getAttribute('aria-labelledby'))box.setAttribute('aria-label',box.querySelector('h2')?.textContent||'Editor');queueMicrotask(()=>box.querySelector('button:not(:disabled),input:not([type=hidden]),select,[tabindex]')?.focus());}
    else{active=null;opener?.isConnected&&opener.focus();opener=null;}
  };
  new MutationObserver(update).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class'],childList:true});
  document.addEventListener('keydown',e=>{if(e.key!=='Tab'||!active||document.querySelector('dialog[open]'))return;const nodes=[...active.querySelectorAll('button:not(:disabled),input:not(:disabled):not([type=hidden]),select:not(:disabled),textarea,a[href],[tabindex="0"]')].filter(n=>n.getClientRects().length);if(!nodes.length)return;const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&(document.activeElement===first||!active.contains(document.activeElement))){e.preventDefault();last.focus();}else if(!e.shiftKey&&(document.activeElement===last||!active.contains(document.activeElement))){e.preventDefault();first.focus();}},true);
}
export function initCommands(){
  if(initialized)return;initialized=true;try{shortcuts={...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')};}catch{}
  document.addEventListener('keydown',e=>{if(e.repeat)return;if(matches(e,shortcuts.palette)){e.preventDefault();e.stopImmediatePropagation();openCommands();return;}if(e.target?.closest?.('input,textarea,select,[contenteditable],dialog,.modal:not(.hidden)'))return;for(const[id,,fn]of commands)if(matches(e,shortcuts[id])){e.preventDefault();e.stopImmediatePropagation();Promise.resolve(fn()).catch(error=>status(error.message,true));return;}},true);
  modalAccessibility();
}
