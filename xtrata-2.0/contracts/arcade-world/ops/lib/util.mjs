// Small shared helpers for the arcade-world operator tools. No network, no keys.
import { cvToJSON } from '@stacks/transactions';

export const DAY_BLOCKS = 144;       // Bitcoin blocks per "Bitcoin day" (what the contracts call a day)
export const BLOCK_MINUTES = 10;

// Plain JS from a Clarity value: uint/int -> Number, optional none -> null, tuple -> object, list -> array,
// response -> { ok, value }, buffers -> '0x..' strings, strings and principals -> strings, bool -> boolean.
export function toJs(cv) {
  return conv(cvToJSON(cv));
}
function conv(j) {
  const t = j.type, v = j.value;
  if (typeof t === 'string') {
    if (t.startsWith('(response')) return { ok: j.success === true, value: conv(v) };
    if (t.startsWith('(optional')) return v === null ? null : conv(v);
    if (t.startsWith('(tuple')) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, conv(x)]));
    if (t.startsWith('(list')) return v.map(conv);
    if (t === 'uint' || t === 'int') return Number(v);
  }
  return v;
}

// "+30" blocks, "+90m", "+6h", "+2d" (relative to base), or a plain integer (absolute). Returns an absolute number.
export function parseWhen(at, base, label = 'at') {
  if (typeof at === 'number' && Number.isInteger(at) && at >= 0) return at;
  if (typeof at === 'string') {
    const m = /^\+(\d+)(m|h|d)?$/.exec(at.trim());
    if (m && base == null) throw new Error(`${label}: "${at}" is relative; give a base height (--height N) or read one from a network (--network)`);
    if (m) {
      const n = Number(m[1]);
      const blocks = m[2] === 'm' ? Math.ceil(n / BLOCK_MINUTES) : m[2] === 'h' ? Math.ceil(n * 60 / BLOCK_MINUTES) : m[2] === 'd' ? n * DAY_BLOCKS : n;
      return base + blocks;
    }
    if (/^\d+$/.test(at.trim())) return Number(at);
  }
  throw new Error(`${label}: expected a block height, or "+N" blocks / "+Nm" / "+Nh" / "+Nd" from the base height (got ${JSON.stringify(at)})`);
}

// Printable ASCII only, as Clarity's string-ascii needs.
export const isAscii = (s) => typeof s === 'string' && /^[\x20-\x7e]*$/.test(s);

export class Findings {
  constructor() { this.errors = []; this.warnings = []; }
  error(where, msg) { this.errors.push({ where, msg }); }
  warn(where, msg) { this.warnings.push({ where, msg }); }
  get ok() { return this.errors.length === 0; }
  print(log = console.log) {
    this.errors.forEach((e) => log(`  ERROR   ${e.where}: ${e.msg}`));
    this.warnings.forEach((w) => log(`  warning ${w.where}: ${w.msg}`));
  }
}
