import { pluginLatencySamples,synthLatencySamples } from './plugins.js';
// Routing is a directed graph. Every edge has compensation; cycles are rejected.
export function validateRouting(project) {
  const owners=[...project.channels,...project.instruments,...(project.buses||[])], ids=new Set(['master',...owners.map(o=>o.id)]);
  const edges=new Map(owners.map(o=>[o.id,[o.output||'master',...(o.auxSends||[]).filter(s=>s.amount>0).map(s=>s.busId)]]));
  for(const owner of [...owners,{...project.master,id:'master'}])for(const slot of [...owner.inserts||[],...owner.fx||[]])if(slot.enabled!==false&&slot.sidechainTrackId&&slot.sidechainTrackId!==owner.id){if(!ids.has(slot.sidechainTrackId))throw new Error('The sidechain source no longer exists.');edges.get(slot.sidechainTrackId)?.push(owner.id);}
  const visiting=new Set(),done=new Set();
  const visit=id=>{if(visiting.has(id))throw new Error('Mixer routing cannot feed back into itself.');if(done.has(id)||id==='master')return;visiting.add(id);for(const to of edges.get(id)||[]){if(!ids.has(to))throw new Error(`Unknown mixer output: ${to}`);visit(to);}visiting.delete(id);done.add(id);};
  for(const id of edges.keys())visit(id);return true;
}
export function projectLatencySeconds(project,sampleRate=48000){
  validateRouting(project);
  const owners=[...project.channels,...project.instruments,...project.buses||[]],graph=new Map([...owners.map(o=>[o.id,[]]),['master',[]]]);
  for(const o of owners)for(const target of [o.output||'master',...(o.auxSends||[]).filter(s=>s.amount>0).map(s=>s.busId)])graph.get(target)?.push(o.id);
  for(const owner of [...owners,{...project.master,id:'master'}])for(const slot of [...owner.inserts||[],...owner.fx||[]])if(slot.enabled!==false&&slot.sidechainTrackId&&slot.sidechainTrackId!==owner.id)graph.get(owner.id)?.push(slot.sidechainTrackId);
  const cache=new Map(),latency=id=>{if(cache.has(id))return cache.get(id);const owner=id==='master'?project.master:owners.find(o=>o.id===id),own=[...owner?.inserts||[],...owner?.fx||[]].reduce((n,s)=>n+(s.enabled===false?0:pluginLatencySamples(s.type,s.params||{},sampleRate)/sampleRate),0),source=owner?.kind==='instrument'&&!owner.sampler?.enabled?synthLatencySamples(owner.synthId,owner.params||{},sampleRate)/sampleRate:0;const total=Math.max(source,...(graph.get(id)||[]).map(latency))+own;cache.set(id,total);return total;};
  return latency('master');
}
export function syncMixer(engine) {
  if (!engine.ctx || !engine.chains) return;
  const project=engine.store.project,ctx=engine.ctx;
  const smooth=(param,value)=>{if(engine.offline)param.value=value;else param.setTargetAtTime(value,ctx.currentTime,.008);};
  validateRouting(project);
  const runtime=engine._mixer ||= {strips:new Map(),links:[],master:null};
  if(!runtime.master) {
    const input=ctx.createGain(); engine._makeChain('master',input);
    const chain=engine.chains.get('master');try{chain.out.disconnect(engine.masterGain);}catch{}
    const pan=ctx.createStereoPanner(),mono=ctx.createGain();mono.channelCount=2;mono.channelCountMode='explicit';
    chain.out.connect(pan).connect(mono).connect(engine.masterGain);runtime.master={input,pan,mono};
    try{engine.delayFx.ret.disconnect(engine.masterGain);engine.delayFx.ret.connect(input);}catch{}
    try{engine.reverbFx.ret.disconnect(engine.masterGain);engine.reverbFx.ret.connect(input);}catch{}
  }
  engine.syncChain('master');
  runtime.master.pan.pan.setValueAtTime(project.master?.pan||0,ctx.currentTime);
  runtime.master.mono.channelCount=project.master?.mono?1:2;
  const entries=[...project.channels.map((o,i)=>({owner:o,key:`c${i}`})),...project.instruments.map((o,i)=>({owner:o,key:`i${i}`})),...(project.buses||[]).map(o=>({owner:o,key:o.id}))];
  const active=new Set(entries.map(e=>e.owner.id));
  for(const [id,s] of runtime.strips)if(!active.has(id)){for(const n of [s.pan,s.fader])n.disconnect();runtime.strips.delete(id);if(engine.chains.has(id))engine._disposeChain(id);}
  for(const {owner,key} of entries) {
    if(!engine.chains.has(key)){const input=ctx.createGain();engine._makeChain(key,input);}
    const chain=engine.chains.get(key);engine.syncChain(key);
    let strip=runtime.strips.get(owner.id);
    if(!strip||strip.chain!==chain){if(strip){strip.pan.disconnect();strip.fader.disconnect();}strip={chain,pan:ctx.createStereoPanner(),fader:ctx.createGain()};runtime.strips.set(owner.id,strip);try{chain.out.disconnect(engine.masterGain);}catch{}chain.out.connect(strip.fader).connect(strip.pan);}
    strip.owner=owner;strip.key=key;
    smooth(strip.pan.pan,owner.pan||0);
    const isBus=(project.buses||[]).includes(owner),solo=entries.some(e=>e.owner.solo);
    // Ancestor buses of a soloed track remain audible; the graph's children are filtered at leaves.
    const audible=!owner.mute&&(isBus||!solo||owner.solo||hasSoloAncestor(owner,project.buses||[]));
    const trim=Math.pow(10,(owner.inputTrimDb||0)/20),volume=audible?(owner.volume??1):0;
    const post=project.mixerVersion>=2||isBus;
    smooth(chain.input.gain,trim*(post?(audible?1:0):volume));
    smooth(strip.fader.gain,post?volume:1);
    for(const send of Object.values(chain.sendFx||{})){const desired=post?strip.pan:chain.out;if(send.source!==desired){try{(send.source||chain.out).disconnect(send.amt);}catch{}desired.connect(send.amt);send.source=desired;send.inst.inp=send.inst.out=desired;}}
  }
  const graph=new Map(entries.map(({owner})=>[owner.id,[]]));graph.set('master',[]);
  const definitions=[];
  for(const {owner} of entries){const strip=runtime.strips.get(owner.id);definitions.push({from:owner.id,to:owner.output||'master',source:strip.pan,amount:1});for(const send of owner.auxSends||[])if(send.amount>0)definitions.push({from:owner.id,to:send.busId,source:send.preFader?strip.chain.out:strip.pan,amount:send.amount});}
  for(const d of definitions)graph.get(d.to).push(d.from);
  for(const {owner} of [...entries,{owner:{...project.master,id:'master'}}])for(const slot of [...owner.inserts||[],...owner.fx||[]])if(slot.enabled!==false&&slot.sidechainTrackId&&slot.sidechainTrackId!==owner.id)graph.get(owner.id)?.push(slot.sidechainTrackId);
  const ownLatency=id=>{const owner=id==='master'?project.master:runtime.strips.get(id)?.owner;return [...owner?.inserts||[],...owner?.fx||[]].reduce((n,s)=>n+(s.enabled===false?0:pluginLatencySamples(s.type,s.params||{},ctx.sampleRate)/ctx.sampleRate),0);};
  const sourceLatency=id=>{const owner=runtime.strips.get(id)?.owner;return owner?.kind==='instrument'&&!owner.sampler?.enabled?synthLatencySamples(owner.synthId,owner.params||{},ctx.sampleRate)/ctx.sampleRate:0;};
  const signature=JSON.stringify([entries.map(({owner,key})=>[owner.id,key,owner.output,owner.auxSends,engine.chains.get(key).sig,[...owner.inserts||[],...owner.fx||[]].map(d=>d.sidechainTrackId),ownLatency(owner.id),sourceLatency(owner.id)]),ownLatency('master'),engine.chains.get('master').sig,[...project.master.inserts||[],...project.master.fx||[]].map(d=>d.sidechainTrackId)]);
  if(runtime.signature===signature)return;runtime.signature=signature;
  for(const link of runtime.links){try{link.source.disconnect(link.delay);}catch{}link.delay.disconnect();link.gain.disconnect();}runtime.links=[];
  const cache=new Map(),arrival=id=>{if(cache.has(id))return cache.get(id);const value=Math.max(sourceLatency(id),...(graph.get(id)||[]).map(source=>arrival(source)))+ownLatency(id);cache.set(id,value);return value;};
  engine.latencySeconds=arrival('master');
  for(const {owner,key}of entries)if(!project.buses.includes(owner)&&engine.chains.get(key).preDelay)engine.chains.get(key).preDelay.delayTime.value=Math.max(0,arrival(owner.id)-ownLatency(owner.id)-sourceLatency(owner.id));
  for(const d of definitions){const target=d.to==='master'?runtime.master.input:runtime.strips.get(d.to)?.chain.input;if(!target)continue;const delay=ctx.createDelay(10),gain=ctx.createGain();delay.delayTime.value=Math.max(0,arrival(d.to)-ownLatency(d.to)-arrival(d.from));gain.gain.value=d.amount;d.source.connect(delay).connect(gain).connect(target);runtime.links.push({...d,delay,gain});}
  // Dedicated detector feeds never replace a compressor's audible program input.
  for(const {owner,key} of [...entries,{owner:{...project.master,id:'master'},key:'master'}])for(const def of [...owner.inserts||[],...owner.fx||[]]){const it=engine.chains.get(key)?.slots.get(def.id);if(!it?.nodes.sidechain)continue;if(it.externalFeed){try{it.externalFeed.source.disconnect(it.externalFeed.delay);}catch{}it.externalFeed.delay.disconnect();it.externalFeed=null;}const source=runtime.strips.get(def.sidechainTrackId)?.pan;it.nodes.setSidechainExternal?.(!!source);if(source){const delay=ctx.createDelay(10);delay.delayTime.value=Math.max(0,arrival(owner.id)-ownLatency(owner.id)-arrival(def.sidechainTrackId));source.connect(delay).connect(it.nodes.sidechain);it.externalFeed={source,delay};}}
}
function hasSoloAncestor(owner,buses){let next=owner.output,seen=new Set();while(next&&next!=='master'&&!seen.has(next)){seen.add(next);const bus=buses.find(b=>b.id===next);if(bus?.solo)return true;next=bus?.output;}return false;}
export function disposeMixer(engine){const r=engine._mixer;if(!r)return;for(const l of r.links){l.delay.disconnect();l.gain.disconnect();}for(const s of r.strips.values()){s.pan.disconnect();s.fader.disconnect();}for(const n of Object.values(r.master||{}))n.disconnect();engine._mixer=null;}
