// The built-in door skins: read from the hall's own kit (src/parts/door-skins.js) so the tools cannot drift from it, and registered
// on xtrata-door-skins-v1 as tier 0 (built-in) skins, in a fixed order so skin ids are predictable.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { Cl } from '@stacks/transactions';
import { APP } from './catalogue.mjs';

let kit = null;
export function skinKit() {
  if (kit) return kit;
  const m = { exports: {} };
  delete globalThis.XADoorSkins;
  vm.runInThisContext('(function (module) {' + readFileSync(join(APP, 'src', 'parts', 'door-skins.js'), 'utf8') + '\n})', { filename: 'door-skins.js' })(m);
  kit = m.exports;
  return kit;
}

// [{ key, name, family, builtin, styles (bit mask), sound, frame, hardware, wear }] in registration order
export function builtinSkins() {
  const K = skinKit();
  return K.SKIN_KEYS.map((key) => {
    const s = K.SKINS[key];
    return { key, name: s.name, family: s.familyId, builtin: key, styles: s.mask, sound: s.soundId, frame: s.frame, hardware: s.hardware, wear: s.wear };
  });
}

export const skinArgs = (s) => [Cl.stringAscii(s.key), Cl.stringAscii(s.name), Cl.uint(s.family), Cl.uint(0), Cl.stringAscii(s.builtin), Cl.uint(0), Cl.buffer(new Uint8Array(0)), Cl.uint(0),
  Cl.uint(s.styles), Cl.uint(s.sound), Cl.stringAscii(s.frame), Cl.stringAscii(s.hardware), Cl.uint(s.wear)];

// What is on chain for a key: null, or { id, styles, name, tier, hidden, approved }.
export async function readSkin(t, key) {
  const r = await t.ro('skins', 'get-skin-by-key', [Cl.stringAscii(key)]);
  return r ? { id: r.id, name: r.name, tier: r.tier, styles: r.styles, frame: r.frame, hardware: r.hardware, hidden: !!r.hidden, approved: !!r.approved } : null;
}

// Which built-in skins still need registering, and which on-chain ones differ from the kit (reported, never changed here).
export async function planSkins(t) {
  const todo = [], drift = [];
  for (const s of builtinSkins()) {
    const have = await readSkin(t, s.key);
    if (!have) { todo.push(s); continue; }
    if (have.tier !== 0) drift.push(`${s.key}: on chain it is a tier ${have.tier} skin, not the built-in`);
    else if (Number(have.styles) !== s.styles) drift.push(`${s.key}: on chain it may dress styles mask ${have.styles}, the hall's table says ${s.styles} (admin can change it with set-skin-styles)`);
  }
  return { todo, drift };
}

export async function runSkins(t, plan, { execute = false, from = null, log = () => {} }) {
  const res = { registered: 0, failed: null };
  for (const s of plan.todo) {
    if (!execute) { log(`dry run: register-skin ${s.key} (${s.name})`); continue; }
    const r = await t.send('skins', 'register-skin', skinArgs(s), from);
    if (!r.ok) { res.failed = `register-skin ${s.key}: err ${JSON.stringify(r.value)}`; log('FAILED ' + res.failed); return res; }
    res.registered++; log(`registered skin ${s.key} as #${r.value}`);
  }
  return res;
}
