// Minimal Clarity value decoder + read-only caller for the registry page.
// Isomorphic (browser + Node >= 20), no dependencies. Read-only by construction:
// it only calls /v2/contracts/call-read and /v2/contracts/source.

const C32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const hex = (u8) => Array.from(u8, (b) => b.toString(16).padStart(2, '0')).join('');
const fromHex = (h) => Uint8Array.from((h.replace(/^0x/, '').match(/../g) || []).map((x) => parseInt(x, 16)));
const sha256 = async (u8) => new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', u8));

function c32encode(u8) {
  // Stacks c32: big-endian base-32 of the bytes, one '0' per leading zero byte.
  let n = 0n;
  for (const b of u8) n = (n << 8n) | BigInt(b);
  let s = '';
  while (n > 0n) { s = C32[Number(n & 31n)] + s; n >>= 5n; }
  for (const b of u8) { if (b === 0) s = '0' + s; else break; }
  return s;
}
export async function c32address(version, hash160) {
  const cs = (await sha256(await sha256(new Uint8Array([version, ...hash160])))).slice(0, 4);
  return 'S' + C32[version] + c32encode(new Uint8Array([...hash160, ...cs]));
}

// Decode a serialized Clarity value into plain JS: uint/int -> string, bool, principal -> string,
// buffer -> '0x..', strings, optional -> value|null, response -> {ok}|{err}, list -> [], tuple -> {}.
export async function decode(input) {
  const b = typeof input === 'string' ? fromHex(input) : input;
  let i = 0;
  const u32 = () => { const v = (b[i] << 24 >>> 0) + (b[i + 1] << 16) + (b[i + 2] << 8) + b[i + 3]; i += 4; return v; };
  const big = (signed) => { let n = 0n; for (let k = 0; k < 16; k++) n = (n << 8n) | BigInt(b[i + k]); i += 16; if (signed && n >= (1n << 127n)) n -= 1n << 128n; return n.toString(); };
  async function principal() { const v = b[i++]; const h = b.slice(i, i + 20); i += 20; return c32address(v, h); }
  async function val() {
    const t = b[i++];
    switch (t) {
      case 0x00: return big(true);
      case 0x01: return big(false);
      case 0x02: { const n = u32(); const x = '0x' + hex(b.slice(i, i + n)); i += n; return x; }
      case 0x03: return true;
      case 0x04: return false;
      case 0x05: return principal();
      case 0x06: { const p = await principal(); const n = b[i++]; const name = new TextDecoder().decode(b.slice(i, i + n)); i += n; return `${p}.${name}`; }
      case 0x07: return { ok: await val() };
      case 0x08: return { err: await val() };
      case 0x09: return null;
      case 0x0a: return val();
      case 0x0b: { const n = u32(); const out = []; for (let k = 0; k < n; k++) out.push(await val()); return out; }
      case 0x0c: { const n = u32(); const o = {}; for (let k = 0; k < n; k++) { const l = b[i++]; const key = new TextDecoder().decode(b.slice(i, i + l)); i += l; o[key] = await val(); } return o; }
      case 0x0d: case 0x0e: { const n = u32(); const s = new TextDecoder().decode(b.slice(i, i + n)); i += n; return s; }
      default: throw new Error(`unknown Clarity type 0x${t.toString(16)}`);
    }
  }
  return val();
}

export function makeReader(api = 'https://api.hiro.so', { delayMs = 350, apiKey } = {}) {
  const base = api.replace(/\/$/, '');
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const headers = { 'content-type': 'application/json', ...(apiKey ? { 'x-api-key': apiKey } : {}) };
  async function req(url, init) {
    for (let a = 0; a < 5; a++) {
      await wait(delayMs);
      const r = await fetch(url, init);
      if (r.status === 429 || r.status >= 500) { await wait(1500 * 2 ** a); continue; }
      return r;
    }
    throw new Error(`gave up: ${url}`);
  }
  return {
    // No-argument read-only calls only (all the registry needs).
    async call(contractId, fn) {
      const [addr, name] = contractId.split('.');
      const r = await req(`${base}/v2/contracts/call-read/${addr}/${name}/${fn}`, { method: 'POST', headers, body: JSON.stringify({ sender: addr, arguments: [] }) });
      const j = await r.json();
      if (!j.okay) throw new Error(`${fn}: ${j.cause || 'call-read failed'}`);
      return decode(j.result);
    },
    async sourceSha256(contractId) {
      const [addr, name] = contractId.split('.');
      const r = await req(`${base}/v2/contracts/source/${addr}/${name}?proof=0`, { headers });
      if (r.status === 404) return null;
      const j = await r.json();
      return hex(await sha256(new TextEncoder().encode(j.source)));
    },
  };
}

// Reads one registry entry. v3 helpers expose get-twin-interface; the v1 Fak.fun
// helpers predate it, so they are read through their own getters.
export async function readHelper(reader, e) {
  const out = { key: e.key, helper: e.helper, interface: e.interface, ok: true, problems: [] };
  try {
    if (e.expectedSourceSha256) {
      out.sourceSha256 = await reader.sourceSha256(e.helper);
      if (out.sourceSha256 === null) out.problems.push('helper contract not found');
      else if (out.sourceSha256 !== e.expectedSourceSha256) out.problems.push('deployed code does not match the recorded hash');
    }
    if (e.interface === 'v3') {
      const i = await reader.call(e.helper, 'get-twin-interface');
      out.state = {
        finalized: i['canonical-finalized'], canonicalCount: i['canonical-count'], inscribed: i['inscribed-count'],
        fee: i.fee, maxFee: i['max-fee'], group: i.group, manifestHash: i['manifest-hash'], swapsEnabled: i['swaps-enabled'],
        payeeA: i['payee-a'], payeeB: i['payee-b'], owner: i.owner, pendingOwner: i['pending-owner'], version: i['interface-version'], largeUnbound: i['large-unbound'],
      };
      if (i.source !== e.source) out.problems.push(`interface source ${i.source} != registry ${e.source}`);
      if (i['collection-key'] !== e.key) out.problems.push(`interface collection-key ${i['collection-key']} != registry ${e.key}`);
    } else {
      const [fee, inscribed, finalized, owner] = [
        await reader.call(e.helper, 'get-fee'), await reader.call(e.helper, 'get-inscribed-count'),
        await reader.call(e.helper, 'is-finalized'), await reader.call(e.helper, 'get-owner'),
      ];
      out.state = { fee: fee.ok ?? fee, inscribed: inscribed.ok ?? inscribed, finalized: finalized.ok ?? finalized, owner: owner.ok ?? owner };
    }
  } catch (err) { out.problems.push(String(err.message || err)); }
  out.ok = out.problems.length === 0;
  return out;
}

// Registry rule: exactly one helper per source collection, and only listed statuses.
export function registryProblems(reg) {
  const p = [], seen = new Map();
  for (const e of reg.helpers) {
    if (seen.has(e.source)) p.push(`two helpers for ${e.source}: ${seen.get(e.source)} and ${e.helper}`);
    seen.set(e.source, e.helper);
    if (!/^S[PM][0-9A-Z]+\.[a-z0-9-]+$/i.test(e.helper)) p.push(`bad helper id ${e.helper}`);
  }
  return p;
}
