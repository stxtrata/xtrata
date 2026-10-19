// One-time chain set-up steps, as plain functions over a transport. Used by the dress rehearsal and the tests;
// the same calls are listed in TESTNET-RUNBOOK.md for the real thing.
import { Cl } from '@stacks/transactions';
import { lookRegistry } from './catalogue.mjs';

const must = (r, what) => { if (!r.ok) throw new Error(`${what} failed: err ${JSON.stringify(r.value)}`); return r.value; };

export async function registerBuiltinLooks(t, admin) {
  const ids = {};
  for (const l of lookRegistry()) {
    ids[l.key] = must(await t.send('world', 'register-look',
      [Cl.uint(l.kind), Cl.stringAscii(l.name), Cl.uint(0), Cl.stringAscii(l.key), Cl.uint(0), Cl.buffer(new Uint8Array(0)), Cl.uint(0)], admin), `register-look ${l.key}`);
  }
  return ids;
}

export async function registerRoom(t, admin, { id, title, owner, bays }) {
  return must(await t.send('world', 'register-room', [Cl.stringAscii(id), Cl.stringAscii(title), Cl.principal(owner), Cl.uint(bays)], admin), `register-room ${id}`);
}

export async function setPublisher(t, which, admin, who, allowed = true) {
  return must(await t.send(which, 'set-publisher', [Cl.principal(who), Cl.bool(allowed)], admin), `set-publisher ${which}`);
}

// ---- idempotent set-up (what setup-chain.mjs runs): looks, rooms and publishers, skipping whatever is already there ----
import { readLookBook, readRooms } from './readback.mjs';

// plan: { looks: [{key, kind, name}], rooms: [{id, title, owner, bays}], publishers: [address] }
export async function planSetup(t, { owner, publishers = [], withLobby = true, extraRooms = [] }) {
  const have = await readLookBook(t);
  const looks = lookRegistry().filter((l) => !have.some((h) => h.tier === 0 && h.builtin === l.key));
  const wanted = [{ id: 'arcade-hall', title: 'Xtrata Arcade', owner, bays: 2 }, ...(withLobby ? [{ id: 'lobby', title: 'Lobby', owner, bays: 2 }] : []), ...extraRooms];
  const existing = await readRooms(t, wanted.map((r) => r.id));
  const rooms = wanted.filter((r) => !existing[r.id]);
  const pubs = [];
  for (const who of publishers) for (const which of ['world', 'posters']) {
    if (!(await t.ro(which, 'is-publisher', [Cl.principal(who)]))) pubs.push({ which, who });
  }
  return { looks, rooms, publishers: pubs, lookBase: have.length };
}

export async function runSetup(t, plan, { execute = false, from = null, log = () => {} }) {
  const res = { looks: 0, rooms: 0, publishers: 0, failed: null };
  const fail = (what, r) => { res.failed = `${what}: err ${JSON.stringify(r.value)}`; log('FAILED ' + res.failed); return res; };
  for (const l of plan.looks) {
    if (!execute) { log(`dry run: register-look ${l.key} (kind ${l.kind})`); continue; }
    const r = await t.send('world', 'register-look', [Cl.uint(l.kind), Cl.stringAscii(l.name), Cl.uint(0), Cl.stringAscii(l.key), Cl.uint(0), Cl.buffer(new Uint8Array(0)), Cl.uint(0)], from);
    if (!r.ok) return fail('register-look ' + l.key, r); res.looks++; log(`registered look ${l.key} as #${r.value}`);
  }
  for (const r0 of plan.rooms) {
    if (!execute) { log(`dry run: register-room ${r0.id} (${r0.bays} bays, owner ${r0.owner})`); continue; }
    const r = await t.send('world', 'register-room', [Cl.stringAscii(r0.id), Cl.stringAscii(r0.title), Cl.principal(r0.owner), Cl.uint(r0.bays)], from);
    if (!r.ok) return fail('register-room ' + r0.id, r); res.rooms++; log(`registered room ${r0.id}`);
  }
  for (const p of plan.publishers) {
    if (!execute) { log(`dry run: ${p.which} set-publisher ${p.who}`); continue; }
    const r = await t.send(p.which, 'set-publisher', [Cl.principal(p.who), Cl.bool(true)], from);
    if (!r.ok) return fail(`${p.which} set-publisher`, r); res.publishers++; log(`${p.which}: ${p.who} is a publisher`);
  }
  return res;
}
