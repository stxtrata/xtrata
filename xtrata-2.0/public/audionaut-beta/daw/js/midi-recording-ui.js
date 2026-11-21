import { store } from './state.js';
import { engine } from './engine.js';
import { el,action,row,choice,status } from './pro-ui.js';
export function mount(container) {
  const controls=row(),takes=el('div');container.append(el('h3','MIDI recording & takes'),controls,takes);
  controls.append(action('Start MIDI recording',async()=>{
    if(!store.project.instruments.some(t=>t.armed))throw new Error('Arm an instrument below before recording.');
    await engine.play();status('Recording armed instruments. Play keys or a MIDI controller.');
  }),action('Stop MIDI recording',()=>{engine.pause();status('MIDI take captured.');}));
  function paint(){takes.replaceChildren();for(const t of store.project.instruments){const choices=(t.takes||[]).filter(take=>take.type!=='audio');if(!choices.length)continue;takes.append(row(el('span',t.name),choice(`${t.name} MIDI take`,choices.map(take=>[take.id,take.name]),t.activeTakeId||choices.at(-1).id,id=>{store.selectTake(t.id,id);status('MIDI take selected.');})));}if(!takes.childElementCount)takes.append(el('p','Recorded MIDI takes appear here. Armed instruments capture together while the transport runs.'));}
  const refresh=()=>queueMicrotask(paint),offs=['load','notes','instruments','instrument'].map(e=>store.on(e,refresh));document.addEventListener('transport',refresh);paint();
  return()=>{offs.forEach(off=>off());document.removeEventListener('transport',refresh);};
}
