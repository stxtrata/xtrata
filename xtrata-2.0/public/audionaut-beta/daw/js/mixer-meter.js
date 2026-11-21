import { el, action } from './pro-ui.js';

// UI-only post-fader stereo taps. No connection is added to the audible output.
export function createStereoMeter(name) {
  const element = el('div', null, { className: 'mixer-stereo-meter' });
  const bars = ['left', 'right'].map(side => {
    const bar = el('div', null, { className: 'mixer-meter-bar', role: 'meter', 'aria-label': `${name} ${side} peak`, 'aria-valuemin': -60, 'aria-valuemax': 0, 'aria-valuenow': -60 });
    const fill = el('span', null, { className: 'mixer-meter-fill' }); bar.append(fill); element.append(bar); return { bar, fill, level: -60 };
  });
  let tap = null, held = 0, clipped = false;
  const peak = action('−∞', () => { held = 0; clipped = false; paintPeak(); }, { className: 'mixer-peak', 'aria-label': `${name} peak; click to reset`, title: 'Peak dBFS · click to reset' });
  function paintPeak() {
    peak.textContent = held > 0 ? (20 * Math.log10(held)).toFixed(1) : '−∞';
    peak.classList.toggle('is-clipping', clipped); peak.setAttribute('aria-pressed', String(clipped));
  }
  function disconnect() {
    if (!tap) return;
    try { tap.source.disconnect(tap.split); } catch {}
    for (const node of [tap.split, ...tap.analysers]) node.disconnect(); tap = null;
  }
  function update(source, context, dt) {
    if (tap && (tap.source !== source || tap.context !== context)) disconnect();
    if (source && context?.state === 'running' && !tap) {
      const split = context.createChannelSplitter(2), analysers = [context.createAnalyser(), context.createAnalyser()];
      source.connect(split); analysers.forEach((an, i) => { an.fftSize = 256; split.connect(an, i); });
      tap = { source, context, split, analysers, data: new Float32Array(256) };
    }
    bars.forEach((view, i) => {
      let value = 0;
      if (tap && context.state === 'running') {
        tap.analysers[i].getFloatTimeDomainData(tap.data);
        for (const sample of tap.data) value = Math.max(value, Math.abs(sample));
      }
      held = Math.max(held, value); clipped ||= value >= 1;
      const level = value > 0 ? Math.max(-60, Math.min(0, 20 * Math.log10(value))) : -60;
      view.level = Math.max(level, view.level - 45 * dt);
      view.fill.style.clipPath = `inset(${(1 - (view.level + 60) / 60) * 100}% 0 0)`;
      view.bar.setAttribute('aria-valuenow', level.toFixed(1));
      view.bar.setAttribute('aria-valuetext', value > 0 ? `${(20 * Math.log10(value)).toFixed(1)} dBFS` : 'Silence');
    });
    paintPeak();
  }
  function rename(next) {
    if (next === name) return; name = next;
    bars.forEach((view, i) => view.bar.setAttribute('aria-label', `${name} ${i ? 'right' : 'left'} peak`));
    peak.setAttribute('aria-label', `${name} peak; click to reset`);
  }
  return { element, peak, update, rename, dispose: disconnect };
}
