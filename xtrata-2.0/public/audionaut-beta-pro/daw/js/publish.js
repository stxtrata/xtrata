import { HANDOFF_SOURCE } from "./storage-config.js";
import { store } from "./state.js";
import { engine } from "./engine.js";
import { exportProjectAsync, autosave } from "./persistence.js";
import { downloadBlob } from "./audio-utils.js";
import { renderMix, renderStems } from "./render-mix.js";
import {collectProjectAssets} from './loader.js';
import {zipFiles} from './zip-files.js';
import { classifyCreateFiles, storeCreateHandoff, takeCreateHandoff, createHandoffUrl } from "../../../create-routing.js";

const $ = selector => document.querySelector(selector);
const filename = name => (String(name || "Audionaut project").replace(/[^\w\- ]+/g, "").trim() || "Audionaut project");

export async function prepareInscription(file) {
  const decision = classifyCreateFiles([file]);
  const id = await storeCreateHandoff([file], { reason: decision.reason, source: HANDOFF_SOURCE });
  return createHandoffUrl(decision.destination === "wizard" ? "/wizard/" : "/inscribe", id, HANDOFF_SOURCE);
}

export function initPublish({ samplesReady = async () => {} } = {}) {
  const modal = $("#modal-publish");
  const option=(value,text)=>{const e=document.createElement('option');e.value=value;e.textContent=text;return e;};
  $('#publish-format').append(option('archive','Project with every sample (JSON)'),option('stems','Individual track stems (ZIP)'));
  $('#publish-tail').prepend(option('auto','Automatic instrument / effect tails'));$('#publish-tail').value='auto';
  const field=(id,label,values,initial)=>{const row=document.createElement('label');row.className='publish-field';row.textContent=label+' ';const select=document.createElement('select');select.id=id;for(const [value,text]of values)select.append(option(value,text));select.value=initial;row.append(select);$('#publish-tail').closest('label').after(row);return select;};
  field('publish-rate','Sample rate',[[22050,'22.05 kHz'],[44100,'44.1 kHz'],[48000,'48 kHz'],[88200,'88.2 kHz'],[96000,'96 kHz']],'48000');
  field('publish-depth','Resolution',[[16,'16-bit PCM'],[24,'24-bit PCM'],['float32','32-bit float']],'24');
  const cancel=document.createElement('button');cancel.id='publish-cancel';cancel.textContent='Cancel preparation';$('#publish-prepare').after(cancel);
  let prepared = null, controller = null;
  const status = message => { $("#publish-status").textContent = message; };
  const clear = () => {
    controller?.abort(); controller = null; prepared = null;
    $("#publish-download").disabled = true;
    $("#publish-continue").disabled = true;
    status("Prepare a file, download it if you wish, then continue to review inscription costs.");
  };
  $("#btn-publish").addEventListener("click", () => { clear(); modal.classList.remove("hidden"); });
  $("#publish-close").addEventListener("click", () => { clear(); modal.classList.add("hidden"); });
  cancel.addEventListener('click',()=>{clear();status('Export cancelled.');});
  for (const id of ["publish-format", "publish-scope", "publish-tail",'publish-rate','publish-depth'])
    $("#" + id).addEventListener("change", clear);
  // A prepared file is a snapshot. Edits require preparation again, so an old mix
  // cannot be mistaken for the project currently visible in the workstation.
  store.on("dirty", () => { if (prepared||controller) clear(); });
  store.on("load", clear);
  $("#publish-prepare").addEventListener("click", async () => {
    clear();
    const mine = controller = new AbortController();
    const button = $("#publish-prepare"); button.disabled = true;
    try {
      const cancelled=new Promise((_,reject)=>mine.signal.addEventListener('abort',()=>reject(new DOMException('Export cancelled.','AbortError')),{once:true}));
      await Promise.race([samplesReady(),cancelled]);
      if(mine.signal.aborted)return;
      const project = structuredClone(store.project);
      const kind = $("#publish-format").value;
      const revision = store.project;
      let changed = false;
      const unsubscribe = store.on("dirty", () => { changed = true; });
      let blob;
      try {
        const progress=value=>status(`${value.name?value.name+' · ':''}${value.phase} ${value.progress!=null?Math.round(value.progress*100)+'%':value.total?`${value.completed}/${value.total}`:''}`);
        const options={scope:$('#publish-scope').value,tail:$('#publish-tail').value==='auto'?'auto':+$('#publish-tail').value,sampleRate:+$('#publish-rate').value,bitDepth:$('#publish-depth').value==='float32'?'float32':+$('#publish-depth').value,signal:mine.signal,onProgress:progress};
        status(kind==='audio'||kind==='stems'?'Rendering the mix with its synths and effects…':'Preparing the portable project…');
        if(kind==='audio')blob=await renderMix(project,engine.buffers.slice(),options);
        else if(kind==='stems')blob=await zipFiles(await renderStems(project,engine.buffers.slice(),options),options);
        else {
          const copy=kind==='archive'?await collectProjectAssets(project,options):project;
          blob=new Blob([await exportProjectAsync({project:copy,compact:true})],{type:'application/json'});
        }
      } finally { unsubscribe(); }
      if (mine.signal.aborted || controller !== mine) return;
      if (changed || store.project !== revision) throw new Error("The project changed during preparation. Prepare it again to include the latest edits.");
      prepared = new File([blob], `${filename(project.projectName)}.${kind === "audio" ? "wav" : kind==='stems'?'zip':'json'}`, { type: blob.type });
      status(`${prepared.name} · ${(prepared.size / 1024 / 1024).toFixed(2)} MB. ${kind === "audio" ? "Stereo WAV mix with latency compensation and the selected tail." : kind==='stems'?'Aligned wet track stems. Nonlinear bus/master processing can make their sum differ from the stereo mix.':kind==='archive'?'Editable project with every sample embedded for offline reopening.':"Editable project with embedded local audio; remote audio keeps its source references."} Continue opens the inscription review; you choose whether to publish there.`);
      $("#publish-download").disabled = false;
      $("#publish-continue").disabled = false;
    } catch (error) {
      if (error.name !== "AbortError") status(`Preparation failed: ${error.message}`);
    } finally { button.disabled = false; }
  });
  $("#publish-download").addEventListener("click", () => prepared && downloadBlob(prepared, prepared.name));
  $("#publish-continue").addEventListener("click", async () => {
    if (!prepared) return;
    const button = $("#publish-continue"); button.disabled = true;
    const file = prepared, preparation = controller;
    let handoffId = null;
    const unchanged = () => prepared === file && controller === preparation && !preparation?.signal.aborted;
    try {
      await autosave({ force: true });
      if (!unchanged()) throw new Error("The prepared file changed while saving. Prepare the current project again.");
      const url = await prepareInscription(file);
      handoffId = new URL(url, location.origin).searchParams.get("handoffId");
      if (!unchanged()) throw new Error("The project changed before the inscription review opened. Prepare it again.");
      // Same-origin handoff reuses the established Create/Wizard review and wallet flow.
      window.location.assign(url);
    } catch (error) {
      // A canceled navigation must not leave a potentially large WAV orphaned in handoff storage.
      if (handoffId) await takeCreateHandoff(handoffId).catch(() => {});
      status(`Could not continue: ${error.message}. Download the file and keep this project open.`);
      button.disabled = !prepared;
    }
  });
}
