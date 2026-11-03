// Read the hall from xtrata-world-v2 with the hall's OWN reader (src/parts/world2.js, run in a vm), so what this prints is what the hall
// would draw. Read-only. The transports: a node's HTTP API (testnet), a Clarinet simnet (tests), or any function you give it.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { cvToHex, hexToCV } from '@stacks/transactions';
import { APP } from './catalogue.mjs';

let cached = null;
// Load the hall's score-client (the Clarity codec), world.js (plain / hexList) and world2.js into a sandbox.
export function loadReader() {
  if (cached) return cached;
  const win = { console, Math, Date, JSON, Object, Array, Number, String, Uint8Array, BigInt, TextDecoder, TextEncoder, Promise, setInterval, clearInterval, setTimeout, clearTimeout,
    addEventListener() {}, removeEventListener() {}, location: { search: '', protocol: 'about:', origin: 'null', hostname: '' }, navigator: {}, postMessage() {} };
  win.window = win; win.globalThis = win; win.parent = win;
  vm.createContext(win);
  for (const f of ['score-client.js', 'world.js', 'world2.js']) vm.runInContext(readFileSync(join(APP, 'src', 'parts', f), 'utf8'), win, { filename: f });
  cached = { win, codec: win.XAScores._codec, W: win.XAWorld, W2: win.XAWorld2 };
  return cached;
}

// A read function in the shape world2.js wants: (contractId, fn, [argHex]) -> decoded Clarity value.
export function simnetRead(simnet, sender) {
  const { codec } = loadReader();
  return async (contractId, fn, args) => {
    const name = contractId.slice(contractId.indexOf('.') + 1);
    const res = simnet.callReadOnlyFn(name, fn, (args || []).map((h) => hexToCV(h)), sender).result;
    return codec.decodeCV(cvToHex(res));
  };
}
export function networkRead({ apiBase = 'https://api.testnet.hiro.so', readSender = null, fetchImpl = globalThis.fetch } = {}) {
  const { codec } = loadReader();
  return async (contractId, fn, args) => {
    const i = contractId.indexOf('.'), addr = contractId.slice(0, i), name = contractId.slice(i + 1);
    const res = await fetchImpl(`${apiBase.replace(/\/+$/, '')}/v2/contracts/call-read/${addr}/${name}/${fn}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sender: readSender || addr, arguments: args || [] }),
    });
    if (!res.ok) throw new Error(`read ${fn} failed: HTTP ${res.status}`);
    const body = await res.json();
    if (!body || body.okay !== true || typeof body.result !== 'string') throw new Error(`read ${fn} failed: ${body && body.cause ? body.cause : 'no result'}`);
    return codec.decodeCV(body.result);
  };
}

// What the hall's reader makes of the registry. Same objects the hall gets; plain JSON (the vm's objects are copied across).
export async function readHall({ read, registry, path = ['arcade', 'hall'], lobbyPath = null }) {
  const { W, W2, codec } = loadReader();
  W2.forget();
  const host = { read, plain: W.plain, hexList: W.hexList, codec, registry, path, lobbyPath };
  const r = await W2.load(host);
  return JSON.parse(JSON.stringify(r));
}

const BASE = ['posters', 'wall', 'door'], INTER = ['none', 'knock', 'peek', 'enter'];
const SLOT = ['door', 'cover', 'overlay', 'sound', 'light'];
// Readable dump of a readHall() result.
export function describeHall(r) {
  const lines = [`hall space ${r.meta.hall}, lobby space ${r.meta.lobby}; ${r.meta.objects} objects, ${r.meta.kinds} kinds in use; signature ${r.sig}`];
  const room = (title, bays) => {
    lines.push(title);
    bays.forEach((b, i) => {
      if (!b) { lines.push(`  bay ${i}: (no bay object) posters`); return; }
      const sc = b.scene;
      if (!sc) { lines.push(`  bay ${i}: posters${b.nextHeight != null ? ` (next change at block ${b.nextHeight})` : ''}`); return; }
      const door = sc.doorLook != null && r.looks[sc.doorLook] ? ' ' + r.looks[sc.doorLook].builtin : '';
      lines.push(`  bay ${i}: ${BASE[sc.baseId]}${door}, ${INTER[sc.interaction]}${sc.link ? ', leads to ' + (sc.link['target-room'] || sc.link.path) : ''}${b.nextHeight != null ? ` (next change at block ${b.nextHeight})` : ''}`);
      for (const l of sc.layers) {
        const look = r.looks[l.look];
        lines.push(`      ${SLOT[l.slot]} ${look ? look.builtin : l.look} #${l.obj}${l.state ? ' [' + l.state + ']' : ''} ${typeof l.params === 'string' ? l.params : JSON.stringify(l.params)}`);
      }
    });
  };
  room('hall', r.bays);
  room('lobby', r.lobbyBays);
  return lines.join('\n');
}
