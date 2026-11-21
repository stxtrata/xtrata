import { store } from './state.js';
import { engine } from './engine.js';
import { validateRouting } from './mixer-runtime.js';
import { PLUGIN_TYPES, makeSlot, typeParams } from './plugins.js';
import { automationValueAt } from './automation-runtime.js';
import { createStereoMeter } from './mixer-meter.js';
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
        if(slot.type==='hybridReverb')section.append(choice('Impulse response',[['','Generated early reflections'],...store.project.channels.filter((t,i)=>engine.buffers[i]||t.id===slot.irSource?.sourceTrackId).map(t=>[t.id,t.name+(engine.buffers[store.project.channels.indexOf(t)]?'':' (audio unavailable)')])],slot.irSource?.sourceTrackId||'',v=>{patchSlot({irSource:v?{sourceTrackId:v}:undefined});}));
        body.append(section);
      });
    }
  }paint();dialog.addEventListener('cancel',()=>dialog.remove());document.body.append(dialog);dialog.showModal();
}
// Sends stay in a compact inspector so every channel's fader lines up.
function openSends(id) {
  const dialog = el('dialog', null, { className: 'pro-dialog', 'aria-label': 'Mixer sends' }), body = el('div');
  const close = () => { off(); dialog.close(); dialog.remove(); };
  const off = store.on('load', close);
  dialog.append(el('h2', `${owner(id)?.name} sends`), body, action('Close', close));
  function paint() {
    const target = owner(id); if (!target) { close(); return; }
    body.replaceChildren();
    for (const send of target.auxSends || []) {
      const bus = store.project.buses.find(b => b.id === send.busId); if (!bus) continue;
      const patch = value => change(id, 'auxSends', owner(id).auxSends.map(s => s.busId === send.busId ? { ...s, ...value } : s));
      body.append(row(number(`Send: ${bus.name}`, send.amount, value => patch({ amount: value }), { min: 0, max: 2, step: .05 }),
        toggle('Pre-fader', send.preFader, value => patch({ preFader: value })),
        action('Remove send', () => { change(id, 'auxSends', owner(id).auxSends.filter(s => s.busId !== send.busId)); paint(); })));
    }
    const possible = store.project.buses.filter(b => b.id !== id && !target.auxSends?.some(s => s.busId === b.id));
    if (possible.length) {
      let chosen = possible[0].id;
      body.append(row(choice('Send bus', possible.map(b => [b.id, b.name]), chosen, v => chosen = v), action('Add send', () => {
        change(id, 'auxSends', [...(owner(id).auxSends || []), { busId: chosen, amount: .25, preFader: false }]); paint();
      })));
    } else if (!target.auxSends?.length) body.append(el('p', 'Add an effects bus or group to create a send.'));
  }
  paint(); dialog.addEventListener('cancel', close); document.body.append(dialog); dialog.showModal();
}
function removeBus(id) {
  const draft = structuredClone(store.project);
  draft.buses = draft.buses.filter(b => b.id !== id);
  for (const o of [...draft.channels, ...draft.instruments, ...draft.buses, draft.master]) {
    if (o.output === id) o.output = 'master';
    o.auxSends = (o.auxSends || []).filter(s => s.busId !== id);
    for (const slot of [...o.inserts || [], ...o.fx || []]) if (slot.sidechainTrackId === id) slot.sidechainTrackId = null;
  }
  draft.timeline.automation = draft.timeline.automation.filter(l => l.target.trackId !== id);
  store.project.timeline = draft.timeline; store.project.master = draft.master;
  store.project.channels = draft.channels; store.project.instruments = draft.instruments;
  store.setProjectProp('buses', draft.buses);
}
const faderDb = value => value <= 0 ? -61 : Math.max(-60, Math.min(12, db(value)));
const levelText = value => value <= 0 ? '−∞ dB' : `${db(value).toFixed(1)} dB`;

export function mount(root) {
  root.append(el('h2', 'Mixer'), el('p', 'Drag a fader to balance the mix. Double-click for 0 dB; double-click pan to centre. Scroll sideways for more channels. Click a peak readout to reset it.', { className: 'pro-help' }));
  const bar = row(), desk = el('div', null, { className: 'mixer-desk' }),
    strips = el('div', null, { className: 'pro-mixer', tabindex: 0, 'aria-label': 'Mixer channels. Scroll horizontally for more channels.' }),
    master = el('div', null, { className: 'mixer-master' });
  desk.append(strips, master); root.append(bar, desk);
  const views = new Map(), gestures = new Set();
  let raf = 0, pending = 0, dead = false, structure = '', previousTick = 0;
  function addBus(kind) {
    if (store.project.buses.length >= 32) throw Error('The 32-bus limit is reached.');
    store.setProjectProp('buses', [...store.project.buses, { id: uid(), kind, name: `${kind === 'group' ? 'Group' : 'Bus'} ${store.project.buses.length + 1}`, volume: 1, pan: 0, inserts: [], fx: [], output: 'master', auxSends: [] }]);
  }
  // Native ranges provide touch, pointer and keyboard operation. Keep their nodes
  // stable while editing and always release automation overrides on interruption.
  function bindRange(input, target, set, reset) {
    let active = false;
    const begin = () => { if (!active) { active = true; gestures.add(finish); engine.beginAutomationGesture?.(target); } };
    const finish = () => { if (active) { active = false; gestures.delete(finish); engine.endAutomationGesture?.(target); } };
    const update = value => { set(value); recordAutomation(target, value); };
    input.addEventListener('pointerdown', e => { if (e.button !== 0) return; begin(); input.setPointerCapture(e.pointerId); });
    input.addEventListener('keydown', e => {
      if (!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End','PageUp','PageDown'].includes(e.key)) return;
      e.preventDefault(); e.stopPropagation(); begin();
      const min = Number(input.min), max = Number(input.max), amount = Number(input.step) * (e.shiftKey || e.key.startsWith('Page') ? 10 : 1);
      const next = e.key === 'Home' ? min : e.key === 'End' ? max : Number(input.value) + (['ArrowUp','ArrowRight','PageUp'].includes(e.key) ? amount : -amount);
      input.value = Math.max(min, Math.min(max, next)); input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    input.addEventListener('input', () => { begin(); update(target.kind === 'volume' ? Number(input.value) <= -61 ? 0 : gain(Number(input.value)) : Number(input.value)); });
    for (const event of ['pointerup','pointercancel','lostpointercapture','keyup','change','blur']) input.addEventListener(event, finish);
    input.addEventListener('dblclick', () => { begin(); update(reset); finish(); });
    return { finish, get active() { return active; } };
  }
  function build(t, index) {
    const strip = el('section', null, { className: 'pro-strip', 'data-track-id': t.id, 'aria-label': `${t.name} channel strip` });
    strip.style.setProperty('--strip-color', t.id === 'master' ? '#d5b96b' : t.kind === 'instrument' ? '#ad8be9' : ['bus','group'].includes(t.kind) ? '#77c5c8' : `hsl(${index * 37 % 360} 65% 65%)`);
    const title = el('input', null, { type: 'text', value: t.name, className: 'mixer-name', 'aria-label': `${t.name} name`, title: 'Channel name' });
    title.readOnly = t.id === 'master';
    title.addEventListener('change', () => { if (t.id !== 'master') change(t.id, 'name', title.value); });
    const badge = el('span', t.kind === 'master' ? 'STEREO OUT' : t.kind === 'instrument' ? 'INSTRUMENT' : t.kind === 'group' ? 'GROUP' : t.kind === 'bus' ? 'AUX' : 'AUDIO', { className: 'mixer-kind' });
    const top = el('div', null, { className: 'mixer-strip-top' });
    const fx = action('Effects', () => openEffects(t.id), { 'aria-label': 'Effects' }), sends = action('Sends', () => openSends(t.id), { 'aria-label': 'Sends' });
    sends.disabled = t.id === 'master';
    const outputField = t.id === 'master' ? el('div', 'Stereo output', { className: 'mixer-output-label' }) : choice('Output', [['master','Master'], ...store.project.buses.filter(b => b.id !== t.id).map(b => [b.id,b.name])], t.output || 'master', value => {
      try { change(t.id, 'output', value); } finally { sync(); }
    });
    const trim = t.id === 'master' ? el('div', 'MASTER', { className: 'mixer-trim-placeholder' }) : number('Trim dB', t.inputTrimDb || 0, value => change(t.id, 'inputTrimDb', value), { min: -60, max: 24, step: .5 });
    top.append(outputField, fx, sends, trim);
    const pan = el('input', null, { type: 'range', min: -1, max: 1, step: .01, value: t.pan || 0, className: 'mixer-pan', 'aria-label': `${t.name} pan` }), panText = el('output', 'C');
    const panBox = el('label', null, { className: 'mixer-pan-box' }); panBox.append(el('span', 'PAN'), pan, panText);
    const panGesture = bindRange(pan, { trackId: t.id, kind: 'pan' }, value => { change(t.id, 'pan', value); sync(); }, 0);
    const volume = el('input', null, { type: 'range', min: -61, max: 12, step: .1, value: faderDb(t.volume ?? 1), className: 'mixer-fader', 'aria-label': `${t.name} volume dB`, 'aria-orientation': 'vertical', title: 'Volume · double-click for 0 dB' });
    const volumeGesture = bindRange(volume, { trackId: t.id, kind: 'volume' }, value => { change(t.id, 'volume', value); sync(); }, 1);
    const scale = el('div', null, { className: 'mixer-fader-scale', 'aria-hidden': true });
    for (const value of [12, 0, -12, -24, -48, -61]) { const mark = el('span', value === -61 ? '−∞' : String(value)); mark.style.top = `${(12 - value) / 73 * 100}%`; scale.append(mark); }
    const meter = createStereoMeter(t.name), faderBank = el('div', null, { className: 'mixer-fader-bank' });
    faderBank.append(scale, volume, meter.element);
    const readout = el('output', null, { className: 'mixer-level', 'aria-label': `${t.name} volume readout` });
    const buttons = row(), mute = action('M', () => change(t.id, 'mute', !owner(t.id).mute), { 'aria-label': `${t.name} mute`, title: 'Mute' }),
      solo = action('S', () => change(t.id, 'solo', !owner(t.id).solo), { 'aria-label': `${t.name} solo`, title: 'Solo' });
    buttons.classList.add('mixer-ms');
    if (t.id !== 'master') buttons.append(mute, solo);
    else buttons.append(el('span', 'MASTER', { className: 'mixer-master-label' }));
    const footer = el('div', null, { className: 'mixer-strip-footer' });
    if (['group','bus'].includes(t.kind)) footer.append(action('Remove bus', () => removeBus(t.id)));
    strip.append(title, badge, top, panBox, meter.peak, faderBank, readout, buttons, footer);
    return { strip, title, fx, sends, volume, volumeGesture, pan, panGesture, panText, meter, readout, mute, solo, output: outputField.querySelector('select'), trim: trim.querySelector('input') };
  }
  function effective(t, kind) {
    const base = kind === 'volume' ? t.volume ?? 1 : t.pan || 0;
    if (!engine.isPlaying || store.project.automationMode === 'write' || engine._automationOverrides?.has(JSON.stringify({ trackId: t.id, kind }))) return base;
    const lane = store.project.timeline.automation.find(l => l.enabled !== false && l.target.trackId === t.id && l.target.kind === kind);
    return lane ? automationValueAt(lane, engine.getMusicalPosition().beat) ?? base : base;
  }
  function sync(levelsOnly = false) {
    for (const t of owners()) {
      const v = views.get(t.id); if (!v) continue;
      const volume = effective(t, 'volume'), pan = effective(t, 'pan');
      if (!v.volumeGesture.active) v.volume.value = faderDb(volume);
      v.volume.setAttribute('aria-valuetext', levelText(volume)); v.readout.textContent = levelText(volume);
      if (!v.panGesture.active) v.pan.value = pan;
      v.panText.textContent = Math.abs(pan) < .005 ? 'C' : `${pan < 0 ? 'L' : 'R'} ${Math.round(Math.abs(pan) * 100)}`;
      v.pan.setAttribute('aria-valuetext', v.panText.textContent);
      if (levelsOnly) continue;
      if (document.activeElement !== v.title) v.title.value = t.name;
      v.strip.setAttribute('aria-label', `${t.name} channel strip`); v.meter.rename(t.name);
      v.title.setAttribute('aria-label', `${t.name} name`); v.readout.setAttribute('aria-label', `${t.name} volume readout`);
      v.volume.setAttribute('aria-label', `${t.name} volume dB`); v.pan.setAttribute('aria-label', `${t.name} pan`);
      v.mute.setAttribute('aria-label', `${t.name} mute`); v.solo.setAttribute('aria-label', `${t.name} solo`);
      v.mute.setAttribute('aria-pressed', String(!!t.mute)); v.solo.setAttribute('aria-pressed', String(!!t.solo));
      v.strip.classList.toggle('is-muted', !!t.mute);
      v.fx.title = [...t.inserts || [], ...t.fx || []].map(s => PLUGIN_TYPES[s.type]?.name || s.type).join(', ') || 'Add inserts and effects';
      v.fx.dataset.count = [...t.inserts || [], ...t.fx || []].length;
      v.sends.dataset.count = (t.auxSends || []).length;
      if (v.output) v.output.value = t.output || 'master';
      if (v.trim && document.activeElement !== v.trim) v.trim.value = t.inputTrimDb || 0;
    }
  }
  function render() {
    if (dead) return;
    const list = owners(), next = JSON.stringify([list.map(t => [t.id, t.kind]), store.project.buses.map(b => [b.id,b.name])]);
    if (next !== structure) {
      for (const finish of [...gestures]) finish();
      for (const v of views.values()) v.meter.dispose(); views.clear();
      strips.replaceChildren(); master.replaceChildren(); structure = next;
      list.forEach((t, i) => { const v = build(t, i); views.set(t.id, v); (t.id === 'master' ? master : strips).append(v.strip); });
      bar.replaceChildren(action('+ Group', () => addBus('group')), action('+ Effects bus', () => addBus('bus')),
        choice('Fader position', [['1','Legacy: before inserts'],['2','After inserts']], String(store.project.mixerVersion), value => { store.setProjectProp('mixerVersion', Number(value)); if (engine.ctx) engine.syncMixer(); }),
        toggle('Master mono', store.project.master.mono, value => change('master', 'mono', value)));
    }
    bar.querySelector('select').value = String(store.project.mixerVersion);
    bar.querySelector('input[type=checkbox]').checked = !!store.project.master.mono;
    sync();
  }
  const refresh = () => { if (!pending) pending = requestAnimationFrame(() => { pending = 0; render(); }); };
  const interrupt = () => { for (const finish of [...gestures]) finish(); };
  const offs = ['channels','instruments','project','channel','instrument'].map(e => store.on(e, refresh));
  offs.push(store.on('load', () => { interrupt(); structure = ''; render(); }));
  window.addEventListener('blur', interrupt);
  function tick(time) {
    if (dead) return;
    if (time - previousTick >= 33) {
      const dt = Math.min(.2, (time - previousTick) / 1000); previousTick = time;
      sync(true);
      for (const [id, v] of views) v.meter.update(id === 'master' ? engine.masterGain : engine._mixer?.strips.get(id)?.pan, engine.ctx, dt);
    }
    raf = requestAnimationFrame(tick);
  }
  render(); raf = requestAnimationFrame(tick);
  return () => { dead = true; interrupt(); cancelAnimationFrame(raf); cancelAnimationFrame(pending); offs.forEach(off => off()); window.removeEventListener('blur', interrupt); for (const v of views.values()) v.meter.dispose(); };
}
