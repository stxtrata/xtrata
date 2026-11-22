import { store } from './state.js';
import { el, action, status } from './pro-ui.js';
import { initControlBar } from './pro-control-bar.js';
const VIEWS = {
  mobile: ['Mobile', () => import('./pro-mobile.js')],
  timeline: ['Timeline', () => import('./pro-timeline-ui.js')],
  mixer: ['Mixer', () => import('./pro-mixer-ui.js')],
  automation: ['Automation', () => import('./pro-automation-ui.js')],
  recording: ['Record & takes', () => import('./pro-recording-ui.js')],
  sampler: ['Sampler', () => import('./pro-sampler-ui.js')],
  devices: ['New instruments', () => import('./pro-devices-ui.js')],
  chain: ['On-chain publishing', () => import('./pro-chain-ui.js')],
  performance: ['Performance', () => import('./pro-diagnostics.js')],
};
const KEY = 'audionaut.beta.workspace';
let dispose, ticket = 0, view = 'sequence';
export async function openWorkspace(next = 'sequence') {
  if (next !== 'sequence' && !VIEWS[next]) next = 'sequence';
  const mine = ++ticket;
  document.body.dataset.workspace = next;
  view = next; dispose?.(); dispose = null;
  if(next!=='sequence'&&document.body.classList.contains('synth-dock-open')){const {closeSynthPanel}=await import('./synth-panel.js');if(ticket!==mine)return;closeSynthPanel();}
  if(ticket!==mine)return;
  const outlet = document.querySelector('#pro-workspace');
  const classic = document.querySelectorAll('#channels,#instruments-wrap,#sequence-bar');
  for (const n of classic) n.hidden = next !== 'sequence';
  outlet.hidden = next === 'sequence';outlet.setAttribute('aria-labelledby',`workspace-tab-${next}`);
  document.querySelectorAll('button[data-workspace]').forEach(n => n.setAttribute('aria-selected', String(n.dataset.workspace === next)));
  try { localStorage.setItem(KEY, next); } catch {}
  if (next === 'sequence') { const [arrange,ui]=await Promise.all([import('./arrange.js'),import('./ui.js')]);if(ticket!==mine)return;ui.renderPattern();ui.renderSequenceBar();for(let i=0;i<store.project.instruments.length;i++)ui.drawInstStrip(i);arrange.renderArrange();return; }
  outlet.replaceChildren(el('p', 'Opening workspace…'));
  try {
    const module = await VIEWS[next][1]();
    if (ticket !== mine) return;
    const host=el('div',null,{className:'pro-workspace-view'});outlet.replaceChildren(host);
    const cleanup = await module.mount(host);
    if(ticket!==mine){cleanup?.();return;}
    dispose=cleanup;
  } catch (error) { if(ticket!==mine)return;outlet.replaceChildren(el('p', error.message)); status(error.message, true); }
}
export function initWorkspace() {
  const nav = el('nav', null, { id: 'pro-workspace-nav', role: 'tablist', 'aria-label': 'Workspaces' });
  for (const [id, label] of [['mobile','Mobile'], ['sequence','Sequences'], ...Object.entries(VIEWS).filter(([id])=>id!=='mobile').map(([id,[label]])=>[id,label])]) {
    nav.append(action(label, () => openWorkspace(id), { id:`workspace-tab-${id}`,'data-workspace': id,role:'tab','aria-controls':id==='sequence'?'channels':'pro-workspace','aria-selected':String(id==='sequence') }));
  }
  nav.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)||!event.target.matches('[role=tab]'))return;const tabs=[...nav.querySelectorAll('[role=tab]')],index=tabs.indexOf(event.target),next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;event.preventDefault();tabs[next].focus();tabs[next].click();});
  nav.append(action('Commands ⌘K', () => import('./pro-commands.js').then(m=>m.openCommands())));
  document.querySelector('#sticky-top').append(nav);
  const outlet = el('section', null, { id: 'pro-workspace', role:'tabpanel', hidden: true, 'aria-label': 'Production workspace' });
  document.querySelector('#channels').before(outlet);
  document.querySelector('.version').textContent = 'beta';
  import('./pro-commands.js').then(m=>m.initCommands()).catch(e=>status(e.message,true));
  document.addEventListener('synth-parameter-edit', event => {
    const {instrument,params}=event.detail||{},track=typeof instrument==='number'?store.instrument(instrument):store.track(instrument);
    if(track)import('./pro-automation-ui.js').then(({recordAutomation})=>{for(const [param,value]of Object.entries(params||{}))recordAutomation({trackId:track.id,kind:'synthParam',param},value);});
  });
  const add = action('+ Instrument', () => { if(!store.addInstrument())throw Error('The 32-instrument limit is reached.');status('Instrument added.'); });
  add.id = 'pro-add-instrument'; document.querySelector('#instruments-wrap .section-label').append(add);
  document.querySelector('#instruments-wrap .section-label').append(action('− Selected instrument',async()=>{const {getMidiTarget,setMidiTarget}=await import('./midi-input.js');const {engine}=await import('./engine.js');const index=getMidiTarget(),track=store.instrument(index);if(!track||store.project.instruments.length<=1)return;if(!confirm(`Remove ${track.name} and its clips? You can undo this change.`))return;engine.stop();if(store.removeInstrument(index)){setMidiTarget(Math.min(index,store.project.instruments.length-1));status('Instrument removed.');}}));
  let saved; try { saved=localStorage.getItem(KEY); } catch {}
  initControlBar(nav);
  if (VIEWS[saved]) openWorkspace(saved);
  else if (saved !== 'sequence' && matchMedia('(max-width: 700px), (pointer: coarse) and (max-width: 1000px)').matches) openWorkspace('mobile');
}
