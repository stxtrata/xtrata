import { store } from './state.js';
import { engine } from './engine.js';
import { validateRouting } from './mixer-runtime.js';
import { PLUGIN_TYPES, makeSlot, typeParams } from './plugins.js';
import { recordAutomation } from './pro-automation-ui.js';
import { el, action, row, number, choice, toggle, textField, tracks, uid, status, db, gain } from './pro-ui.js';

const owners=()=>[...tracks(store),...(store.project.buses||[]),{...store.project.master,id:'master',name:'Master',kind:'master',volume:store.project.masterVolume}];
function owner(id){return id==='master'?store.project.master:owners().find(o=>o.id===id);}
function change(id,prop,value){
  if(['output','auxSends','inserts','fx'].includes(prop)){const candidate=structuredClone(store.project),target=id==='master'?candidate.master:[...candidate.channels,...candidate.instruments,...candidate.buses].find(t=>t.id===id);if(!target)throw Error('This mixer track no longer exists.');target[prop]=value;validateRouting(candidate);}
  if(id==='master'){if(prop==='volume'){store.setProjectProp('masterVolume',value);engine.setMasterVolume(value);}else{store.project.master[prop]=value;store.emit('project',{prop:'master'});}}
  else if(store.track(id))store.setTrackProp(id,prop,value);else{owner(id)[prop]=value;store.emit('project',{prop:'buses'});}
  if(engine.ctx)engine.syncMixer();
}
export function openEffects(id){
  const dialog=el('dialog',null,{className:'pro-dialog','aria-label':'Mixer effects'}),body=el('div');dialog.append(el('h2',`${id==='master'?'Master':owner(id)?.name} effects`),body,action('Close',()=>{dialog.close();dialog.remove();}));
  function paint(){
    const target=owner(id);body.replaceChildren();
    for(const kind of ['inserts','fx']){
      body.append(el('h3',kind==='inserts'?'Inserts':'Effects'));
      const choices=Object.entries(PLUGIN_TYPES).filter(([,p])=>!p.shared).map(([type,p])=>[type,p.name||type]);let selected=choices[0]?.[0];
      body.append(row(choice('Effect',choices,selected,v=>selected=v),action('Add effect',()=>{change(id,kind,[...(target[kind]||[]),makeSlot(selected)]);paint();})));
      (target[kind]||[]).forEach((slot,i)=>{
        const type=PLUGIN_TYPES[slot.type];if(!type)return;
        const section=el('div',null,{className:'pro-take'}),patchSlot=patch=>change(id,kind,owner(id)[kind].map(s=>s.id===slot.id?{...s,...patch}:s));
        section.append(row(el('strong',type.name||slot.type),toggle('Enabled',slot.enabled!==false,v=>patchSlot({enabled:v})),action('Move up',()=>{if(i){const slots=[...owner(id)[kind]];[slots[i-1],slots[i]]=[slots[i],slots[i-1]];change(id,kind,slots);paint();}}),action('Remove',()=>{change(id,kind,target[kind].filter(s=>s.id!==slot.id));paint();})));
        const params=row();for(const p of typeParams(type)){
          const set=value=>{const current=owner(id)[kind].find(s=>s.id===slot.id);patchSlot({params:{...current.params,[p.key]:value}});recordAutomation({trackId:id,kind:'effectParam',param:p.key,slotId:slot.id},value);};
          if(p.options)params.append(choice(p.label||p.key,p.options,slot.params[p.key]??p.def,set));
          else params.append(number(p.label||p.key,slot.params[p.key]??p.def,set,{min:p.min??0,max:p.max??1,step:p.step??.01}));
        }section.append(params);
        if(type.sidechain||['opto','gate'].includes(slot.type))section.append(choice('Sidechain source',[['','Internal detector'],...tracks(store).filter(t=>t.id!==id).map(t=>[t.id,t.name])],slot.sidechainTrackId||'',v=>{try{patchSlot({sidechainTrackId:v||null});}catch(error){paint();throw error;}}));
        body.append(section);
      });
    }
  }paint();dialog.addEventListener('cancel',()=>dialog.remove());document.body.append(dialog);dialog.showModal();
}
export function mount(root){
  root.append(el('h2','Mixer'),el('p','Route tracks through groups and effects buses, balance the stereo field, and shape the master. Imported songs keep their original fader order.',{className:'pro-help'}));
  const bar=row(),strips=el('div',null,{className:'pro-mixer'});root.append(bar,strips);let meters=[],raf=0,renderPending=0;
  function addBus(kind){if(store.project.buses.length>=32)throw Error('The 32-bus limit is reached.');const bus={id:uid(),kind,name:`${kind==='group'?'Group':'Bus'} ${store.project.buses.length+1}`,volume:1,pan:0,inserts:[],fx:[],output:'master',auxSends:[]};store.setProjectProp('buses',[...store.project.buses,bus]);render();}
  function render(){
    bar.replaceChildren(action('+ Group',()=>addBus('group')),action('+ Effects bus',()=>addBus('bus')),choice('Fader position',[['1','Legacy: before inserts'],['2','After inserts']],String(store.project.mixerVersion),v=>{store.setProjectProp('mixerVersion',Number(v));engine.syncMixer?.();}),toggle('Master mono',store.project.master.mono,v=>change('master','mono',v)));
    strips.replaceChildren();meters=[];
    const liveIds=new Set(owners().map(t=>t.id));for(const[id,tap]of taps)if(!liveIds.has(id)){try{tap.source.disconnect(tap.node);}catch{}for(const n of[tap.node,tap.left,tap.right])n.disconnect();taps.delete(id);}
    for(const t of owners()){
      const strip=el('section',null,{className:'pro-strip','data-track-id':t.id}),meter=el('meter',null,{min:0,max:1,value:0,'aria-label':`${t.name} peak`});meters.push({id:t.id,meter});strip.append(el('h3',t.name),meter);
      if(t.id!=='master')strip.append(textField('Name',t.name,v=>change(t.id,'name',v)));
      const volume=el('input',null,{type:'range',min:-60,max:12,step:.1,value:Math.max(-60,db(t.volume??1)),'aria-label':`${t.name} volume dB`}),readout=el('output',`${db(t.volume??1).toFixed(1)} dB`);
      volume.addEventListener('pointerdown',()=>engine.beginAutomationGesture?.({trackId:t.id,kind:'volume'}));volume.addEventListener('input',()=>{const value=gain(Number(volume.value));readout.textContent=`${volume.value} dB`;change(t.id,'volume',value);recordAutomation({trackId:t.id,kind:'volume'},value);});volume.addEventListener('change',()=>engine.endAutomationGesture?.({trackId:t.id,kind:'volume'}));
      strip.append(volume,readout,number('Pan',t.pan||0,v=>{change(t.id,'pan',v);recordAutomation({trackId:t.id,kind:'pan'},v);},{min:-1,max:1,step:.05}));
      if(t.id!=='master')strip.append(number('Input trim dB',t.inputTrimDb||0,v=>change(t.id,'inputTrimDb',v),{min:-60,max:24,step:.5}),row(toggle('Mute',t.mute,v=>change(t.id,'mute',v)),toggle('Solo',t.solo,v=>change(t.id,'solo',v))),choice('Output',[['master','Master'],...store.project.buses.filter(b=>b.id!==t.id).map(b=>[b.id,b.name])],t.output||'master',v=>change(t.id,'output',v)));
      strip.append(action('Effects',()=>openEffects(t.id)));
      if(t.id!=='master'){
        for(const send of t.auxSends||[]){const b=store.project.buses.find(b=>b.id===send.busId);if(!b)continue;strip.append(number(`Send: ${b.name}`,send.amount,v=>change(t.id,'auxSends',t.auxSends.map(s=>s===send?{...s,amount:v}:s)),{min:0,max:2,step:.05}),toggle('Pre-fader',send.preFader,v=>change(t.id,'auxSends',t.auxSends.map(s=>s===send?{...s,preFader:v}:s))));}
        const possible=store.project.buses.filter(b=>b.id!==t.id&&!t.auxSends?.some(s=>s.busId===b.id));if(possible.length){let chosen=possible[0].id;strip.append(choice('Send bus',possible.map(b=>[b.id,b.name]),chosen,v=>chosen=v),action('Add send',()=>{change(t.id,'auxSends',[...(t.auxSends||[]),{busId:chosen,amount:.25,preFader:false}]);render();}));}
        if(['group','bus'].includes(t.kind))strip.append(action('Remove bus',()=>{const draft=structuredClone(store.project);draft.buses=draft.buses.filter(b=>b.id!==t.id);for(const o of [...draft.channels,...draft.instruments,...draft.buses,draft.master]){if(o.output===t.id)o.output='master';o.auxSends=(o.auxSends||[]).filter(s=>s.busId!==t.id);for(const slot of[...o.inserts||[],...o.fx||[]])if(slot.sidechainTrackId===t.id)slot.sidechainTrackId=null;}draft.timeline.automation=draft.timeline.automation.filter(l=>l.target.trackId!==t.id);store.project.timeline=draft.timeline;store.project.master=draft.master;store.project.channels=draft.channels;store.project.instruments=draft.instruments;store.setProjectProp('buses',draft.buses);render();}));
      }
      strips.append(strip);
    }
  }
  const taps=new Map();function tick(){if(!root.isConnected)return;for(const {id,meter}of meters){const output=id==='master'?engine.masterGain:engine._mixer?.strips.get(id)?.pan;if(!output)continue;let tap=taps.get(id);if(!tap||tap.source!==output){if(tap){try{tap.source.disconnect(tap.node);}catch{}tap.node.disconnect();tap.left.disconnect();tap.right.disconnect();}const split=engine.ctx.createChannelSplitter(2),left=engine.ctx.createAnalyser(),right=engine.ctx.createAnalyser();left.fftSize=right.fftSize=256;output.connect(split);split.connect(left,0);split.connect(right,1);tap={source:output,node:split,left,right,data:new Float32Array(256)};taps.set(id,tap);}let peak=0;for(const an of[tap.left,tap.right]){an.getFloatTimeDomainData(tap.data);for(const v of tap.data)peak=Math.max(peak,Math.abs(v));}meter.value=peak;meter.title=`${peak>0?(20*Math.log10(peak)).toFixed(1):'−∞'} dBFS`; }raf=requestAnimationFrame(tick);}
  let refreshAfterFocus=false;const refresh=()=>{if(root.contains(document.activeElement)&&document.activeElement.matches('input,select')){refreshAfterFocus=true;return;}refreshAfterFocus=false;if(!renderPending)renderPending=requestAnimationFrame(()=>{renderPending=0;render();});};const focusOut=event=>{if(refreshAfterFocus&&!root.contains(event.relatedTarget))queueMicrotask(refresh);},afterClick=event=>{if(refreshAfterFocus&&event.target.closest('button'))queueMicrotask(refresh);};root.addEventListener('focusout',focusOut);root.addEventListener('click',afterClick);const offs=['load','channels','instruments','project','channel','instrument'].map(e=>store.on(e,refresh));render();tick();
  return()=>{cancelAnimationFrame(raf);cancelAnimationFrame(renderPending);offs.forEach(off=>off());root.removeEventListener('focusout',focusOut);root.removeEventListener('click',afterClick);for(const tap of taps.values()){try{tap.source.disconnect(tap.node);}catch{}tap.node.disconnect();tap.left.disconnect();tap.right.disconnect();}};
}
