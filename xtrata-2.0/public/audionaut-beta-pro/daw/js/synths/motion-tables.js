// Immutable control cycles. One table per fixed shape and canonical context.
// Duration is measured from the actual buffer, so rates are in cycles/second.
import { canonicalContext } from './resources.js';
const tables = new WeakMap();
export function motionTable(ctx, key, shape) {
  const owner = canonicalContext(ctx);
  if (!tables.has(owner)) tables.set(owner, new Map());
  const cache = tables.get(owner);
  if (!cache.has(key)) {
    const b = ctx.createBuffer(1, 2048, ctx.sampleRate);
    const a = b.getChannelData(0);
    for (let i = 0; i < a.length; i++) a[i] = shape(i / a.length);
    cache.set(key, b);
  }
  return cache.get(key);
}
export function motionSource(ctx, buffer, target) {
  const s = ctx.createBufferSource();
  s.buffer = buffer;
  s.loop = true;
  s.connect(target);
  return s;
}
