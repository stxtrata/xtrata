// Continuous controls use AudioParam timestamps. Topology, curve and worklet
// changes are discrete events at the requested render quantum (offline) or the
// next audio-clock service tick (live); they deliberately do not fake a ramp.
const offlineQueues = new WeakMap();
const path = (n, p) => p.split(".").reduce((x, k) => x?.[k], n);
const db = x => Math.pow(10, x / 20);
const mappings = {
  comp: { threshold:[["c.threshold"]], ratio:[["c.ratio"]], attack:[["c.attack"]], release:[["c.release"]], knee:[["c.knee"]], mix:[["wet.gain"],["dry.gain",x=>1-x]] },
  opto: { mix:[["wet.gain"],["dry.gain",x=>1-x]] },
  limiter: { release:[["c.release"]], input:[["inG.gain",db]] },
  filter: { cutoff:[["f1.frequency"],["f2.frequency"]], q:[["f1.Q"]], out:[["out.gain",db]], lfoRate:[["lfo.frequency"]], lfoDepth:[["lfoG.gain",x=>x*2400]], follow:[["folG.gain",x=>x*4800]] },
  drive: { mix:[["wet.gain"],["dry.gain",x=>1-x]] },
  clipper: { mix:[["wet.gain"],["dry.gain",x=>1-x]] },
  delaySend: { amount:[["send.gain"]] }, reverbSend: { amount:[["send.gain"]] },
};
export function scheduleDspBoundary(ctx, nodes, time, fn) {
  if (time <= ctx.currentTime) { if (!nodes.disposed) fn(); return; }
  if (typeof ctx.startRendering === "function") {
    let queue = offlineQueues.get(ctx); if (!queue) offlineQueues.set(ctx, queue = new Map());
    const sample = Math.max(128, Math.floor(time * ctx.sampleRate / 128) * 128);
    if (sample >= ctx.length) return;
    if (queue.has(sample)) { queue.get(sample).push([nodes, fn]); return; }
    const jobs = [[nodes, fn]]; queue.set(sample, jobs);
    ctx.suspend(sample / ctx.sampleRate).then(async () => {
      try { for (const [node, run] of jobs) if (!node.disposed) await run(); }
      finally { queue.delete(sample); await ctx.resume(); }
    }).catch(error => { nodes.automationError = error.message; });
  } else {
    nodes.automationTimers ||= new Set();
    const tick = () => {
      nodes.automationTimers.delete(timer);
      if (nodes.disposed) return;
      if (ctx.currentTime + .0001 >= time) { fn(); return; }
      timer = setTimeout(tick, Math.max(1, Math.min(25, (time - ctx.currentTime) * 1000)));
      nodes.automationTimers.add(timer);
    };
    let timer = setTimeout(tick, Math.max(1, Math.min(25, (time - ctx.currentTime) * 1000)));
    nodes.automationTimers.add(timer);
  }
}
export function installPluginAutomation(registry) {
  for (const [id, type] of Object.entries(registry)) {
    const apply = type.apply, dispose = type.dispose;
    type.apply = (ctx, nodes, params) => { nodes.P = {...params}; return apply(ctx, nodes, params); };
    type.automate = (ctx, nodes, key, value, time = ctx.currentTime, curve = "step") => {
      const schema = type.params.find(p => p.key === key); if (!schema) return false;
      if (schema.options) { if (!schema.options.some(([v]) => v === value)) return false; }
      else { if (!Number.isFinite(value)) return false; value = Math.max(schema.min, Math.min(schema.max, value)); }
      const targets = mappings[id]?.[key];
      if (targets?.every(([p]) => typeof path(nodes, p)?.setValueAtTime === "function")) {
        for (const [p, map = x=>x] of targets) {
          const param = path(nodes, p), v = map(value);
          if (curve === "linear") param.linearRampToValueAtTime(v, time);
          else param.setValueAtTime(v, time);
        }
        scheduleDspBoundary(ctx, nodes, time, () => { nodes.P = {...nodes.P, [key]:value}; });
      } else scheduleDspBoundary(ctx, nodes, time, () => type.apply(ctx, nodes, {...nodes.P, [key]:value}));
      return true;
    };
    type.dispose = nodes => {
      nodes.disposed = true;
      for (const timer of nodes.automationTimers || []) clearTimeout(timer);
      nodes.automationTimers?.clear(); dispose?.(nodes);
    };
  }
}
