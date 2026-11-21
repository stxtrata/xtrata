// Canonical context identity and deterministic event-local random streams. Shared
// resources belong to the AudioContext; disposable voice hosts never own them.
export function seedNumber(value = 1) {
  if (Number.isFinite(value)) return (value >>> 0) || 1;
  let h = 2166136261; for (const c of String(value)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0) || 1;
}
export function seededRandom(seed = 1) {
  let state = seedNumber(seed);
  return () => { state ^= state << 13; state ^= state >>> 17; state ^= state << 5; return (state >>> 0) / 4294967296; };
}
export const canonicalContext = (ctx) => ctx.resourceContext || ctx;
export class ResourceCache {
  constructor(maxBytes = 48 * 1024 * 1024) { this.maxBytes = maxBytes; this.bytes = 0; this.entries = new Map(); this.hits = 0; this.misses = 0; }
  get(key) { const e = this.entries.get(key); if (!e) { this.misses++; return null; } this.hits++; this.entries.delete(key); this.entries.set(key, e); return e.value; }
  set(key, value, bytes) { const old = this.entries.get(key); if (old) this.bytes -= old.bytes; this.entries.delete(key); if (bytes > this.maxBytes) return value; this.entries.set(key, { value, bytes }); this.bytes += bytes; while (this.bytes > this.maxBytes) { const [k, e] = this.entries.entries().next().value; this.entries.delete(k); this.bytes -= e.bytes; } return value; }
  clear() { this.entries.clear(); this.bytes = 0; }
  stats() { return { entries: this.entries.size, bytes: this.bytes, maxBytes: this.maxBytes, hits: this.hits, misses: this.misses }; }
}
