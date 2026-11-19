import {isProInstrument,normalizeInstrumentConfig} from './pro-instruments-config.js';
import {prepareChainSongImport} from './chain-library.js';
import {RUNTIME_VERSION} from './runtime-version.js';
import { STORAGE_KEYS } from "./storage-config.js";
// persistence.js — save/load project JSON (native + legacy Audional format), autosave.

import {
  store,
  makeProject,
  makeSequence,
  makeChannel,
  makeInstrument,
  NUM_CHANNELS,
  MAX_CHANNELS,
  NUM_STEPS,
  MAX_SEQUENCES,
  NUM_INSTRUMENTS,
} from "./state.js";
import { validateWordSelection } from "./word-index.js";
import { SYNTH_BANK } from "./synths.js";
import { validateSoundMetadata } from "./onboard-library.js";
import { validateClipSnapshot } from "./clip-contract.js";
import { normalizeOwner, cleanReturns, PLUGIN_TYPES, typeParams } from "./plugins.js";
import { internProjectAssets, portableProject, portableProjectAsync, storageAssets, registerStoredAsset, newProjectId, pruneAssets } from "./assets.js";
import { saveProjectRevision, listProjectRevisions, loadProjectRevision, clearActiveProject, deleteProjectRevisions, pinProjectRevision } from "./project-storage.js";
import { normalizeArp } from "./arpeggiator.js";
import { normalizeProjectModel, MODEL_LIMITS } from "./project-model.js";
import { validateRouting } from './mixer-runtime.js';
import { normalizeLegacyPlayback } from './legacy-bridge/playback.js';
import { prepareLegacyDocumentSync, validateLegacyImport, detectFormat } from './legacy-bridge/index.js';

// Display names the synths carried before the rename. A saved instrument whose name is still
// the old stock name follows the synth to its new name; custom names are never touched.
const LEGACY_SYNTH_NAMES = {
  fm4: "jiFM4",
  vox: "jiVOX",
  pluck: "jiPLUCK",
  jibass: "jiBASS",
  ensemble: "jiENSEMBLE",
  tine: "jiTINE",
  kit: "jiKIT",
  tonewheel: "jiTONEWHEEL",
  morph: "jiMORPH",
  texture: "jiTEXTURE",
  winds: "jiWINDS",
  modal: "jiMODAL",
  lantern: "jiLANTERN",
  prism: "jiPRISM",
};
const finite = (value, fallback, min, max) =>
  Number.isFinite(+value) ? Math.max(min, Math.min(max, +value)) : fallback;
function wordMetadata(value) {
  if (!value) return null;
  try {
    const valid = validateWordSelection(value);
    return {
      ...valid,
      text:
        typeof valid.text === "string"
          ? valid.text.slice(0, 160)
          : "Saved section",
    };
  } catch {
    return null;
  }
}

const AUTOSAVE_KEY = STORAGE_KEYS.legacyProject;
const SETTINGS_KEY = STORAGE_KEYS.settings;

// Pretty-printed for files people may open; compact files omit whitespace.
// Browser recovery stores project objects and shared assets separately in IndexedDB.
export function exportProject({ compact = false, project = store.project } = {}) {
  return JSON.stringify(
    {
      ...portableProject(project),
      format: "audionaut-workstation/3", schemaVersion: 3,
      clipSnapshotVersion: 1,
    },
    null,
    compact ? 0 : 2,
  );
}
export async function exportProjectAsync({compact=false,project=store.project}={}) {
  return JSON.stringify({...await portableProjectAsync(project),format:'audionaut-workstation/3',schemaVersion:3,clipSnapshotVersion:1},null,compact?0:2);
}

export async function downloadProject() {
  const project=store.project;
  const blob = new Blob([await exportProjectAsync({project})], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${(store.project.projectName || "audional-project").replace(/[^\w\- ]+/g, "")}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  updateStatus({ message: "Project exported as a portable file." });
}

export async function importProjectAsync(json,{guard=()=>true,...options}={}) {
  const data=typeof json==='string'?JSON.parse(json):json;
  if(data?.format!=='audionaut-chain-song/1')return commitPreparedProject(prepareProject(data),{guard});
  if(data.manifest?.runtime?.version!==RUNTIME_VERSION)throw Error('This song requires a different AudioNaut runtime version. Open its pinned chain player.');
  const {currentRuntime}=await import('./chain-publishing.js');
  const runtime=await currentRuntime(options);
  if(data.manifest.runtime.sha256!==runtime.sha256||data.manifest.runtime.bytes!==runtime.bytes)throw Error('This song uses different playback code. Open its exact inscribed runtime.');
  const staged=await prepareChainSongImport(data,options);
  if(!guard())throw Error('The project changed during chain verification. Open the song again.');
  const project=importProject({...staged.project,format:'audionaut-workstation/3'});
  project.chain=staged.manifest;
  return project;
}

// Preparation is side-effect free: an importer can validate and resolve every
// sample before replacing the current project or its decoded audio.
export function prepareProject(json) {
  const data = typeof json === "string" ? JSON.parse(json) : json;
  if (!data || typeof data !== "object")
    throw new Error("Choose an Audional project JSON.");
  validateDocument(data);
  const native=new Set(['audional-sequencer-x/1','audional-sequencer-l1xl2/1','audionaut-workstation/2','audionaut-workstation/3']);
  if(data.format && !native.has(data.format)) throw new Error(`Unsupported project version: ${String(data.format)}. The current project was retained.`);
  if(!native.has(data.format)){
    // The established synchronous API explicitly means the old editor. The file
    // chooser uses the staged bridge and asks when a historical player is unknown.
    const detection=detectFormat(data);
    const profileId=detection.dense||detection.kind==='og'?undefined:'audionals-editor-v1';
    const staged=prepareLegacyDocumentSync(data,{profileId});
    if(!staged.project)throw new Error(staged.report.issues.map(issue=>issue.message).join(' ')||'This file is not a supported Audional project.');
    return prepareProject(staged.project);
  }
  const project = normalizeProjectModel(normalizeNative(data));
  validateCandidate(project,data.format==='audionaut-workstation/3');
  return project;
}

export function commitPreparedProject(project,{guard=()=>true}={}) {
  if(!guard())throw new Error('The project changed while the song was opening. Your current work was retained.');
  validateDocument(project);
  validateCandidate(project,true);
  internProjectAssets(project);
  store.loadProject(project);
  pruneAssets();
  return project;
}

export function importProject(json) {
  return commitPreparedProject(prepareProject(json));
}

function validateDocument(data) {
  normalizeLegacyPlayback(data.legacyPlayback);
  validateLegacyImport(data.legacyImport);
  let nodes=0;const seen=new WeakSet();
  function visit(value,depth=0){
    if(typeof value==='number'&&!Number.isFinite(value))throw new Error('Project contains a non-finite number.');
    if(!value||typeof value!=='object')return;
    if(seen.has(value))throw new Error('Project contains circular references.');seen.add(value);
    if(depth>64||++nodes>2000000)throw new Error('Project exceeds the supported document size.');
    for(const key of Object.keys(value)){
      if(['__proto__','constructor','prototype'].includes(key))throw new Error('Project contains an unsafe property.');
      visit(value[key],depth+1);
    }
    seen.delete(value);
  }visit(data);
  for(const [key,max]of [['channels',MODEL_LIMITS.channels],['instruments',MODEL_LIMITS.instruments],['sequences',MAX_SEQUENCES],['buses',MODEL_LIMITS.buses]])
    if(data[key]!=null&&(!Array.isArray(data[key])||data[key].length>max))throw new Error(`Project ${key} exceed the supported limit (${max}); nothing was removed.`);
  if(data.timeline?.clips?.length>MODEL_LIMITS.clips)throw new Error('Too many timeline clips.');
  if(data.format==='audionaut-workstation/3'&&data.schemaVersion!=null&&data.schemaVersion!==3)throw new Error('Unsupported project schema version.');
  for(const seq of data.sequences||[]){
    if(!seq||typeof seq!=='object'||!Array.isArray(seq.steps)||!Array.isArray(seq.notes))throw new Error('Invalid pattern data.');
    if(seq.steps.length>(data.channels?.length||MAX_CHANNELS)||seq.notes.length>MODEL_LIMITS.instruments)throw new Error('Pattern refers to unavailable tracks.');
    for(const row of seq.steps)if(!Array.isArray(row)||row.length>NUM_STEPS)throw new Error('Unsupported pattern length; nothing was truncated.');
    for(const notes of seq.notes)if(!Array.isArray(notes)||notes.length>100000)throw new Error('Invalid or oversized note list.');
  }
  if(data.format==='audionaut-workstation/3'){
    // Validate supplied values before model defaults/clamps can conceal malformed
    // data (including a disabled legacy tempo map that normalization resynchronizes).
    const timeline=data.timeline;
    if(timeline!=null){
      if(typeof timeline!=='object'||Array.isArray(timeline))throw new Error('Invalid timeline.');
      for(const key of ['tempo','meter','markers','clips','automation'])if(timeline[key]!=null&&!Array.isArray(timeline[key]))throw new Error(`Invalid timeline ${key}.`);
      if(timeline.lengthBeats!=null)numeric(timeline.lengthBeats,'timeline length',.001,1000000);
      for(const point of timeline.tempo||[]){numeric(point?.beat,'tempo position',0,1000000);numeric(point?.bpm,'tempo',20,420);}
      for(const meter of timeline.meter||[]){numeric(meter?.beat,'meter position',0,1000000);numeric(meter?.numerator,'meter numerator',1,32);if(!Number.isInteger(meter.numerator)||![1,2,4,8,16,32].includes(meter.denominator))throw new Error('Invalid time signature.');}
      for(const key of ['loop','punch'])if(timeline[key]!=null){numeric(timeline[key].start,`${key} start`,0,1000000);numeric(timeline[key].end,`${key} end`,timeline[key].start+.001,1000000);}
      for(const clip of timeline.clips||[]){numeric(clip?.start,'clip start',0,1000000);numeric(clip?.duration,'clip duration',.001,1000000);for(const key of ['offset','sourceOffsetSeconds','fadeIn','fadeOut'])if(clip[key]!=null)numeric(clip[key],key,0,1000000);if(clip.gain!=null)numeric(clip.gain,'clip gain',0,4);if(clip.playbackRate!=null)numeric(clip.playbackRate,'clip playback rate',.01,100);if(clip.tailSeconds!=null)numeric(clip.tailSeconds,'audio clip tail',0,120);}
      for(const lane of timeline.automation||[]){if(!Array.isArray(lane?.points))throw new Error('Invalid automation points.');for(const point of lane.points){numeric(point?.beat,'automation position',0,1000000);numeric(point?.value,'automation value');}}
    }
    for(const instrument of data.instruments||[])if(!instrument||!Object.hasOwn(SYNTH_BANK,instrument.synthId))throw new Error('This project uses an unsupported instrument.');
    for(const owner of [...data.channels||[],...data.instruments||[],...data.buses||[],data.master||{}]){
      for(const list of [owner.inserts,owner.fx])if(list!=null){
        if(!Array.isArray(list))throw new Error('Version 3 effect chains must be arrays.');
        for(const slot of list)if(!slot||!Object.hasOwn(PLUGIN_TYPES,slot.type))throw new Error('This project uses an unsupported effect.');
      }
    }
    for(const seq of data.sequences||[])for(const notes of seq.notes)for(const note of notes)validateNote(note);
  }
}

function numeric(value,label,min=-Infinity,max=Infinity){if(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max)throw new Error(`Invalid ${label}; the current project was retained.`);return value;}
function validateNote(note,maxStep=64){
  if(!note||typeof note!=='object')throw new Error('Invalid note.');
  numeric(note.step,'note start',0,maxStep-.000001);numeric(note.dur,'note duration',.001,262144);numeric(note.pitch,'note pitch',0,127);
  if(!Number.isInteger(note.pitch))throw new Error('Note pitch must be an integer.');
  if(note.vel!=null)numeric(note.vel,'note velocity',0,1.5);
  if(note.rawStep!=null)numeric(note.rawStep,'unquantized note start',0,262144);
  if(note.rawDur!=null)numeric(note.rawDur,'unquantized note duration',.001,262144);
  if(note.expression!=null){if(!Array.isArray(note.expression))throw new Error('Invalid note expression.');for(const point of note.expression){if(point.offset!=null)numeric(point.offset,'expression offset',0,262144);if(point.value!=null)numeric(point.value,'expression value',-16384,16384);}}
}
function validateCandidate(project,strict){
  const tracks=[...project.channels,...project.instruments],owners=[...tracks,...project.buses],busIds=new Set(project.buses.map(b=>b.id));
  const unique=(items,label)=>{const ids=new Set();for(const item of items){if(typeof item.id!=='string'||!item.id||item.id.length>200||ids.has(item.id))throw new Error(`Invalid or duplicate ${label} ID.`);ids.add(item.id);}return ids;};
  const trackIds=unique(owners,'track'),sequenceIds=unique(project.sequences,'pattern');
  if(trackIds.has('master'))throw new Error('Track ID master is reserved.');
  for(const owner of owners){
    if(owner.output!=='master'&&!busIds.has(owner.output))throw new Error('A track routes to a missing bus.');
    if(!Array.isArray(owner.auxSends))throw new Error('Invalid auxiliary sends.');
    for(const send of owner.auxSends){if(!busIds.has(send.busId))throw new Error('An auxiliary send routes to a missing bus.');numeric(send.amount,'send amount',0,4);}
    for(const slot of [...owner.inserts||[],...owner.fx||[]])if(slot.sidechainTrackId&&!trackIds.has(slot.sidechainTrackId))throw new Error('An effect refers to a missing sidechain track.');
  }
  const sampleIds=new Set(project.channels.map(t=>t.id));
  for(const instrument of project.instruments)if(isProInstrument(instrument.synthId)){
    instrument.sampleInstrument=normalizeInstrumentConfig(instrument.synthId,instrument.sampleInstrument);
    for(const source of instrument.sampleInstrument.sources)if(!sampleIds.has(source.sourceTrackId))throw Error('An instrument sample needs an existing sample track. Import the audio into a track first.');
  }
  for(const owner of [...owners,project.master])for(const slot of [...owner.inserts||[],...owner.fx||[]])if(slot.irSource&&!sampleIds.has(slot.irSource.sourceTrackId))throw Error('The impulse response sample track is missing.');
  validateRouting(project);
  const timeline=project.timeline;
  numeric(timeline.lengthBeats,'timeline length',.001,1000000);
  for(const key of ['tempo','meter','markers','clips','automation'])if(!Array.isArray(timeline[key]))throw new Error(`Invalid timeline ${key}.`);
  for(const point of timeline.tempo){numeric(point.beat,'tempo position',0,1000000);numeric(point.bpm,'tempo',20,420);}
  for(const meter of timeline.meter){numeric(meter.beat,'meter position',0,1000000);numeric(meter.numerator,'meter numerator',1,32);if(!Number.isInteger(meter.numerator)||![1,2,4,8,16,32].includes(meter.denominator))throw new Error('Invalid time signature.');}
  for(const key of ['loop','punch']){numeric(timeline[key].start,`${key} start`,0,1000000);numeric(timeline[key].end,`${key} end`,timeline[key].start+.001,1000000);}
  unique(timeline.clips,'clip');
  for(const clip of timeline.clips){
    if(!tracks.some(t=>t.id===clip.trackId))throw new Error('A clip refers to a missing track.');
    if(!['pattern','audio','midi'].includes(clip.type))throw new Error('Unsupported clip type.');
    numeric(clip.start,'clip start',0,1000000);numeric(clip.duration,'clip duration',.001,1000000);numeric(clip.offset,'clip offset',0,1000000);numeric(clip.gain,'clip gain',0,4);
    if(clip.type==='pattern'&&!sequenceIds.has(clip.sequenceId))throw new Error('A clip refers to a missing pattern.');
    if(clip.type==='audio'){
      if(!project.channels.some(t=>t.id===clip.trackId)||!project.channels.some(t=>t.id===(clip.sourceTrackId||clip.trackId)))throw new Error('An audio clip refers to a missing sample track.');
      for(const key of ['sourceOffsetSeconds','fadeIn','fadeOut'])if(clip[key]!=null)numeric(clip[key],key,0,1000000);
      if(clip.playbackRate!=null)numeric(clip.playbackRate,'audio clip playback rate',.01,100);
      if(clip.tailSeconds!=null)numeric(clip.tailSeconds,'audio clip tail',0,120);
    }
    if(clip.type==='midi'){
      if(!project.instruments.some(t=>t.id===clip.trackId)||!Array.isArray(clip.notes)||clip.notes.length>100000)throw new Error('Invalid MIDI clip.');
      for(const note of clip.notes)validateNote(note,4000000);
    }
  }
  for(const lane of timeline.automation){
    const target=lane.target,owner=target?.trackId==='master'?project.master:owners.find(t=>t.id===target?.trackId);
    if(!owner||!['volume','pan','bend','synthParam','effectParam'].includes(target.kind)||!Array.isArray(lane.points))throw new Error('Invalid automation target or points.');
    let bounds=null;
    if(target.kind==='effectParam'){
      const slot=[...owner.inserts||[],...owner.fx||[]].find(s=>s.id===target.slotId);
      bounds=slot&&typeParams(PLUGIN_TYPES[slot.type]).find(p=>p.key===target.param);
      if(!bounds)throw new Error('Automation refers to an unavailable effect parameter.');
    }
    if(target.kind==='synthParam'){
      bounds=SYNTH_BANK[owner.synthId]?.params?.find(p=>p.key===target.param);if(!bounds)throw new Error('Automation refers to an unavailable synth parameter.');
    }
    for(const point of lane.points){numeric(point.beat,'automation position',0,1000000);numeric(point.value,'automation value',bounds?.min??(target.kind==='pan'?-1:target.kind==='volume'?0:-16384),bounds?.max??(target.kind==='pan'?1:target.kind==='volume'?4:16384));if(point.curve&&!['step','linear'].includes(point.curve))throw new Error('Invalid automation curve.');}
  }
  if(strict)for(const seq of project.sequences)for(const notes of seq.notes)for(const note of notes)validateNote(note);
}

function normalizeNative(data) {
  data=structuredClone(data);
  const p = makeProject();
  const legacyPlayback=normalizeLegacyPlayback(data.legacyPlayback);
  if(legacyPlayback)p.legacyPlayback=legacyPlayback;
  p.mixerVersion=data.format==='audionaut-workstation/3'?(data.mixerVersion??2):1;
  p.choke = !!data.choke;
  p.fadeMs = +data.fadeMs || 15;
  p.playEmptySequences = !!data.playEmptySequences;
  if (
    data.songOrigin &&
    ["audx", "compressed-b64x"].includes(data.songOrigin.format)
  )
    p.songOrigin = data.songOrigin;
  if (data.songEndStep != null)
    p.songEndStep = finite(data.songEndStep, 64, 1, MAX_SEQUENCES * NUM_STEPS);
  Object.assign(p, {
    projectId: typeof data.projectId === "string" && /^[\w-]{1,100}$/.test(data.projectId) ? data.projectId : newProjectId(),
    projectName: data.projectName ?? p.projectName,
    artistName: data.artistName ?? "",
    bpm: +data.bpm || 120,
    swing: +data.swing || 0,
    masterVolume: data.masterVolume ?? 0.9,
    continuous: data.continuous ?? true,
    currentSequence: 0,
  });
  for(const key of ['schemaVersion','renderSeed','timeline','recording','buses','master','mixerVersion','extensions'])
    if(data[key]!=null)p[key]=structuredClone(data[key]);
  if(data.format==='audionaut-workstation/3')for(const [key,value]of Object.entries(data))
    if(!['channels','instruments','sequences','format','projectId','projectName','artistName','bpm','swing','masterVolume','currentSequence'].includes(key))p[key]=structuredClone(value);
  p.projectName=String(p.projectName||'Untitled').slice(0,200);p.artistName=String(p.artistName||'').slice(0,200);
  if (Array.isArray(data.channels)) {
    const count = Math.max(1, Math.min(data.channels.length, MAX_CHANNELS));
    while (p.channels.length < count)
      p.channels.push(makeChannel(p.channels.length));
    p.channels.length = count;
    data.channels.slice(0, count).forEach((c, i) => {
      if (!c || typeof c !== "object")
        throw new Error("The project contains an invalid channel.");
      Object.assign(p.channels[i], c);
      const channel = p.channels[i];
      if (
        c.clipSnapshot &&
        (!Number.isFinite(c.trimStart) ||
          !Number.isFinite(c.trimEnd) ||
          c.trimStart < 0 ||
          c.trimEnd > 1 ||
          c.trimEnd <= c.trimStart ||
          !Number.isFinite(c.pitch) ||
          c.pitch < 0.1 ||
          c.pitch > 4 ||
          (c.gateSteps != null &&
            (!Number.isFinite(c.gateSteps) ||
              c.gateSteps < 0 ||
              c.gateSteps > 64)))
      )
        throw new Error(
          "Invalid saved clip playback settings; the current project was retained.",
        );
      channel.name = String(channel.name || `Channel ${i + 1}`).slice(0, 64);
      channel.sampleName = String(channel.sampleName || "").slice(0, 160);
      if(legacyPlayback){
        if(c.volume!=null)numeric(c.volume,'historical channel gain',0,3);
        if(c.pitch!=null)numeric(c.pitch,'historical playback rate',.1,100);
      }
      channel.volume = finite(channel.volume, 0.9, 0, p.songOrigin || legacyPlayback ? 3 : 1.5);
      channel.pitch = finite(channel.pitch, 1, 0.1, p.songOrigin || legacyPlayback ? 100 : 4);
      if(legacyPlayback&&!c.clipSnapshot){
        channel.trimStart=numeric(c.trimStart??0,'historical trim start',0,1);
        channel.trimEnd=numeric(c.trimEnd??1,'historical trim end',channel.trimStart,1);
      }else{
        channel.trimStart = finite(channel.trimStart, 0, 0, 1 - 1e-7);
        channel.trimEnd = finite(channel.trimEnd, 1, channel.trimStart + 1e-7, 1);
      }
      channel.wordSelection = wordMetadata(c.wordSelection);
      channel.clipSnapshot = c.clipSnapshot
        ? validateClipSnapshot(c.clipSnapshot)
        : null;
      if (
        channel.clipSnapshot && !channel.source?.chainRef &&
        ((channel.source?.collectedFrom || channel.source)?.type !== "ordinal" ||
          (channel.source.collectedFrom || channel.source).value !== channel.clipSnapshot.source.inscriptionId ||
          (channel.source.collectedFrom || channel.source).audioSha256 !==
            channel.clipSnapshot.retrieved.payloadHash ||
          (channel.source.collectedFrom || channel.source).sourceSha256 !==
            channel.clipSnapshot.retrieved.sourceHash)
      )
        throw new Error(
          "Channel source differs from its pinned clip snapshot.",
        );
      channel.soundMetadata = c.soundMetadata
        ? ((c.source?.collectedFrom||c.source?.chainRef) ? structuredClone(c.soundMetadata) : validateSoundMetadata(c.soundMetadata))
        : null;
      if(channel.soundMetadata?.loop){const loop=channel.soundMetadata.loop;if(!Number.isFinite(loop.start)||!Number.isFinite(loop.end)||loop.start<0||loop.end<=loop.start)throw new Error('Invalid archived sample loop.');}
      channel.gateSteps = finite(
        c.gateSteps,
        channel.soundMetadata?.loop ? 8 : 0,
        0,
        64,
      );
      channel.sampleMidi =
        c.sampleMidi == null ? null : finite(c.sampleMidi, 60, 0, 127) | 0;
      // fx/inserts: current chains, or the old fixed FX object + 4 insert slots
      channel.inserts = c.inserts;
      channel.fx = c.fx && typeof c.fx === "object" ? c.fx : [];
      channel.sends = c.sends; // delay / reverb send values; older files hold them as FX slots
      normalizeOwner(channel);
    });
  }
  const chCount = p.channels.length;
  if (
    data.lastBeat &&
    ["original", "l1", "combined", "tonal", "analog"].includes(
      data.lastBeat.collection,
    ) &&
    typeof data.lastBeat.id === "string" &&
    /^[\w-]{1,180}$/.test(data.lastBeat.id)
  )
    p.lastBeat = {
      id: data.lastBeat.id,
      name: String(data.lastBeat.name || "Saved beat").slice(0, 180),
      collection: data.lastBeat.collection,
    };
  p.lastPresetChannels = finite(data.lastPresetChannels, 0, 0, chCount) | 0;
  if (Array.isArray(data.instruments)) {
    if(data.format==='audionaut-workstation/3')p.instruments=Array.from({length:data.instruments.length},(_,i)=>makeInstrument(i));
    else while(p.instruments.length<data.instruments.length)p.instruments.push(makeInstrument(p.instruments.length));
    data.instruments.forEach((inst, i) => {
      if(!inst||typeof inst!=='object')throw new Error('The project contains an invalid instrument.');
      Object.assign(p.instruments[i], inst);
      if (!SYNTH_BANK[p.instruments[i].synthId])
        p.instruments[i].synthId = "jims10";
      p.instruments[i].volume = finite(p.instruments[i].volume, 0.8, 0, 1.5);
      p.instruments[i].arp = normalizeArp(p.instruments[i].arp);
      if(inst.params){
        if(typeof inst.params!=='object'||Array.isArray(inst.params))throw new Error('Invalid instrument patch.');
        for(const def of SYNTH_BANK[p.instruments[i].synthId]?.params||[]){
          if(!(def.key in inst.params))continue;
          const value=inst.params[def.key];
          if(def.type==='range')p.instruments[i].params[def.key]=finite(value,def.def,def.min,def.max);
          else if(def.options&&!def.options.some(option=>(Array.isArray(option)?option[0]:option)===value))p.instruments[i].params[def.key]=def.def;
        }
      }
      p.instruments[i].fx =
        inst && inst.fx && typeof inst.fx === "object" ? inst.fx : [];
      p.instruments[i].inserts = inst?.inserts;
      p.instruments[i].sends = inst?.sends;
      normalizeOwner(p.instruments[i]);
      {
        const cur0 = p.instruments[i];
        const legacy = LEGACY_SYNTH_NAMES[cur0.synthId];
        if (legacy && String(cur0.name || "").trim().toLowerCase() === legacy.toLowerCase())
          cur0.name = SYNTH_BANK[cur0.synthId].name;
      }
      // Projects saved before the Coinbase / Gm / Taproot synths had every slot on
      // jiMS10. Move slots that were never touched (stock name, no tweaks, no notes
      // in any sequence) onto the new default synth for that slot.
      const cur = p.instruments[i];
      const hasNotes = (data.sequences || []).some(
        (s) => Array.isArray(s?.notes?.[i]) && s.notes[i].length,
      );
      if (
        i > 0 &&
        cur.synthId === "jims10" &&
        !cur.params &&
        /^Synth \d+$/.test(String(cur.name || "")) &&
        !hasNotes
      ) {
        const fresh = makeInstrument(i);
        cur.synthId = fresh.synthId;
        cur.name = fresh.name;
      }
    });
  }
  if (Array.isArray(data.sequences) && data.sequences.length) {
    p.sequences = data.sequences.slice(0, MAX_SEQUENCES).map((s) => {
      const seq = makeSequence(chCount);
      if(data.format==='audionaut-workstation/3'){const steps=seq.steps;Object.assign(seq,structuredClone(s));seq.steps=steps;}
      if(s.id)seq.id=String(s.id);
      seq.notes=Array.from({length:p.instruments.length},()=>[]);
      (s.steps || []).slice(0, chCount).forEach((row, ch) => {
        row.slice(0, NUM_STEPS).forEach((v, st) => {
          if (v && typeof v === "object") {
            if(legacyPlayback&&v.pitch!=null)numeric(v.pitch,'historical step playback rate',.1,100);
            if(legacyPlayback&&!p.channels[ch].clipSnapshot){
              const start=numeric(v.trimStart??p.channels[ch].trimStart,'historical step trim start',0,1);
              numeric(v.trimEnd??p.channels[ch].trimEnd,'historical step trim end',start,1);
            }
            seq.steps[ch][st] = {
              v: v.v === 2 ? 2 : 1,
              ...(v.rev != null && { rev: !!v.rev }),
              ...(v.trimStart != null && { trimStart: +v.trimStart }),
              ...(v.trimEnd != null && { trimEnd: +v.trimEnd }),
              ...(v.pitch != null && { pitch: +v.pitch }),
              ...(v.xfade != null && { xfade: +v.xfade }),
              ...(v.off != null &&
                finite(v.off, 0, 0, 0.999) > 0 && {
                  off: finite(v.off, 0, 0, 0.999),
                }),
              ...(v.gateSteps != null && {
                gateSteps: finite(v.gateSteps, 0, 0, 64),
              }),
              ...(v.sampleMidi != null && {
                sampleMidi: finite(v.sampleMidi, 60, 0, 127) | 0,
              }),
            };
            if (v.wordSelection)
              seq.steps[ch][st].wordSelection = wordMetadata(v.wordSelection);
          } else {
            seq.steps[ch][st] = v ? (v === 2 ? 2 : 1) : 0;
          }
        });
      });
      (s.notes || []).forEach((list, i) => {
        if(i>=p.instruments.length)throw new Error('Notes refer to an unavailable instrument.');
        seq.notes[i] = (list || [])
          .filter(
            (n) =>
              n &&
              n.step >= 0 &&
              n.step < NUM_STEPS &&
              n.pitch >= 0 &&
              n.pitch < 128,
          )
          .map((n) => ({
            ...structuredClone(n),
            step: data.format==='audionaut-workstation/3' ? finite(n.step,0,0,63.999999) : n.step | 0,
            dur: finite(n.dur,1,0.001,262144),
            pitch: n.pitch | 0,
            vel: finite(n.vel,1,0,1.5),
          }));
      });
      return seq;
    });
  }
  p.bpm = finite(p.bpm, 120, 20, 420);
  p.swing = finite(p.swing, 0, 0, 60);
  p.masterVolume = finite(p.masterVolume, 0.9, 0, 1.5);
  p.fadeMs = finite(p.fadeMs, 15, 1, 500);
  if (data.returns && typeof data.returns === "object") p.returns = cleanReturns(data.returns);
  p.currentSequence =
    finite(data.currentSequence, 0, 0, p.sequences.length - 1) | 0;
  return p;
}

// Convert the original Audional Sequencer (B64x / BETA_XI) preset format.
// --- async browser recovery ---
let revision = 0, saveQueue = Promise.resolve(), clearedProject = null;
const knownHeads=new Map(), sessionId=newProjectId();
let status = { state: "dirty", dirty: true, message: "Not saved yet.", savedAt: null };
const statusListeners = new Set();
function updateStatus(next) {
  status = { ...status, ...next };
  for (const listener of statusListeners) listener({ ...status });
}
export function subscribeSaveStatus(listener) {
  statusListeners.add(listener); listener({ ...status });
  return () => statusListeners.delete(listener);
}
store.on("dirty", () => {
  revision++;
  updateStatus({ state: store.settings.autosave ? "dirty" : "disabled", dirty: true,
    message: store.settings.autosave ? "Changes awaiting browser recovery." : "Browser recovery is off. Export a project file." });
});
function reportStorageError(error) {
  updateStatus({ state: "error", dirty: true, message: `Browser recovery failed: ${error.message || error}. Export a project file to keep your work.` });
}
export function autosave({ force = false, pin=false, name='', reason='autosave' } = {}) {
  if (!force && !store.settings.autosave) {
    updateStatus({ state: "disabled", message: "Browser recovery is off. Export a project file." });
    return Promise.resolve(null);
  }
  const project = store.project, savedRevision = revision;
  // Capture a small immutable project now; storageAssets captures its audio records
  // before asynchronous hashing, so later edits cannot change the pending save.
  const pending = storageAssets(structuredClone(project));
  updateStatus({ state: "saving", message: "Saving browser recovery…" });
  const task = saveQueue.catch(() => {}).then(async () => {
    const prepared = await pending;
    const saved = await saveProjectRevision(prepared.project, prepared.assets, {
      isActive: () => project === store.project && project !== clearedProject,
      baseRevisionId:knownHeads.get(project.projectId)||null,sessionId,pin,name,reason,
    });
    knownHeads.set(saved.projectId,saved.id);
    if(saved.conflictOf && project===store.project){
      project.projectId=saved.projectId;project.projectName=saved.projectName;
      store.emit('identity',{projectId:saved.projectId},{dirty:false});
    }
    if (project === store.project && savedRevision === revision)
      updateStatus({ state: "saved", dirty: false, conflict:!!saved.conflictOf, revisionId:saved.id,projectId:saved.projectId,
        message: saved.conflictOf?'Another tab changed this song. Both sessions were kept as pinned versions; this session is a conflict copy.':"Saved in this browser.", savedAt: saved.updatedAt });
    else updateStatus({ state: "dirty", dirty: true, message: "Newer changes awaiting browser recovery.", savedAt: saved.updatedAt });
    return saved;
  }).catch((error) => { reportStorageError(error); throw error; });
  // Attach a handler immediately, including when callers intentionally fire-and-forget.
  task.catch(() => {}); pending.catch(() => {});
  saveQueue = task;
  return task;
}
async function applyRecovery(saved,guard=()=>true) {
  if (!saved) return false;
  for (const asset of saved.assets) await registerStoredAsset(asset);
  if(!guard()){pruneAssets();return false;}
  importProject({ ...saved.project, format: "audionaut-workstation/3" });
  knownHeads.set(store.project.projectId,saved.id);
  updateStatus({ state: "saved", dirty: false, message: "Restored browser recovery.", savedAt: saved.updatedAt });
  return true;
}
export async function restoreAutosave() {
  const initialProject = store.project, initialRevision = revision;
  const unchanged = () => store.project === initialProject && revision === initialRevision;
  let loaded = false;
  try {
    const saved = await loadProjectRevision();
    if (!unchanged()) return false; // never replace edits made while storage was opening
    if (saved) return await applyRecovery(saved,unchanged);
    const raw = globalThis.localStorage?.getItem(AUTOSAVE_KEY);
    if (!raw) return false;
    importProject(raw);
    loaded = true;
    const migratedProject = store.project, migratedRevision = revision;
    // Keep legacy recovery until its replacement is committed successfully.
    const prepared = await storageAssets(structuredClone(migratedProject));
    const migrated = await saveProjectRevision(prepared.project, prepared.assets, {
      isActive: () => store.project === migratedProject && migratedProject !== clearedProject,
    });
    knownHeads.set(migrated.projectId,migrated.id);
    globalThis.localStorage?.removeItem(AUTOSAVE_KEY);
    if (store.project === migratedProject && revision === migratedRevision)
      updateStatus({ state: "saved", dirty: false, message: "Migrated browser recovery.", savedAt: migrated.updatedAt });
    return true;
  } catch (error) {
    reportStorageError(error);
    if (loaded) return true; // migration failure must not re-import over subsequent edits
    if (!unchanged()) return false;
    // A disabled/unavailable IndexedDB must not make an existing legacy save vanish.
    try {
      const raw = globalThis.localStorage?.getItem(AUTOSAVE_KEY);
      if (raw) { importProject(raw); reportStorageError(error); return true; }
    } catch { /* retained current project and the original recovery data */ }
    throw error;
  }
}
export const listSavedProjects = () => listProjectRevisions();
export async function restoreSavedProject(id) {
  const previous = store.project, previousRevision = revision;
  try {
    const saved = await loadProjectRevision(id);
    if (store.project !== previous || revision !== previousRevision)
      throw new Error("The project changed while recovery loaded; your current work was retained.");
    const applied=await applyRecovery(saved,()=>store.project===previous&&revision===previousRevision);
    if(!applied)throw new Error('The project changed while recovery loaded; your current work was retained.');
    return true;
  }
  catch (error) { reportStorageError(error); throw error; }
}
export async function deleteSavedProject(projectId){
  await deleteProjectRevisions(projectId);knownHeads.delete(projectId);
  if(store.project.projectId===projectId)updateStatus({state:'dirty',dirty:true,savedAt:null,message:'Browser versions were deleted. Save again or download a project file to keep the open project.'});
}
export const pinSavedVersion = (id,name,pinned=true) => pinProjectRevision(id,name,pinned);
export const checkpoint = ({reason='checkpoint',...options}={}) => autosave({...options,reason});
export function startCheckpoints({idleMs=800,maxMs=10000}={}) {
  let idle=null,deadline=null,disposed=false;
  const clear=()=>{clearTimeout(idle);clearTimeout(deadline);idle=deadline=null;};
  const save=()=>{clear();if(!disposed&&status.dirty)autosave().catch(()=>{});};
  const off=store.on('dirty',change=>{
    if(change?.event==='load')return;
    clearTimeout(idle);idle=setTimeout(save,idleMs);
    if(!deadline)deadline=setTimeout(save,maxMs);
  });
  const hidden=()=>{if(document.visibilityState==='hidden')save();};
  const before=event=>{if(status.dirty){save();event.preventDefault();event.returnValue='';}};
  globalThis.addEventListener?.('pagehide',save);globalThis.addEventListener?.('beforeunload',before);
  globalThis.document?.addEventListener('visibilitychange',hidden);
  return ()=>{disposed=true;clear();off();globalThis.removeEventListener?.('pagehide',save);globalThis.removeEventListener?.('beforeunload',before);globalThis.document?.removeEventListener('visibilitychange',hidden);};
}
export function getSaveStatus(){return {...status};}
export async function clearAutosave({ guard = () => true } = {}) {
  const project = store.project;
  clearedProject = project;
  try {
    await saveQueue.catch(() => {});
    if (!guard()) { if (clearedProject === project) clearedProject = null; return false; }
    const cleared = await clearActiveProject({ guard, projectId: project.projectId });
    if (!cleared || !guard()) { if (clearedProject === project) clearedProject = null; return false; }
    globalThis.localStorage?.removeItem(AUTOSAVE_KEY);
    return true;
  } catch (error) { if (clearedProject === project) clearedProject = null; throw error; }
}

function syncAutosaveStatus() {
  if (!store.settings.autosave)
    updateStatus({ state: "disabled", message: "Browser recovery is off. Export a project file." });
  else if (status.state === "disabled")
    updateStatus({ state: status.dirty ? "dirty" : "saved", message: status.dirty ? "Changes awaiting browser recovery." : "Saved in this browser." });
}
export function saveSettings() {
  syncAutosaveStatus();
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(store.settings));
  } catch {
    /* storage unavailable */
  }
}

export function restoreSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) Object.assign(store.settings, JSON.parse(raw));
    syncAutosaveStatus();
  } catch {
    /* ignore */
  }
}
