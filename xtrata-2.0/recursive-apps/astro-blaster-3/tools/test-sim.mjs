import { simSource } from './build-sim.mjs';
import { writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
writeFileSync(new URL('../release/sim.js', import.meta.url), simSource());
await import('../release/sim.js');
const A = globalThis.AB3;
const results = [];
const log = (...a) => { console.log(...a); };

function runBot(opts, maxFrames = 400000, record = true) {
  const st = A.createGame(opts);
  const rec = new A.Recorder();
  let f = 0;
  const t0 = Date.now();
  while (st.phase !== 'over' && f < maxFrames) {
    const inp = A.botInput(st, opts.bot || {});
    if (record) rec.push(inp);
    A.step(st, inp);
    f++;
    if (opts.stopAtLoop != null && st.loop >= opts.stopAtLoop) break;
  }
  return { st, rec, frames: f, ms: Date.now() - t0 };
}

// 1. dsin accuracy
let maxErr = 0;
for (let x = -50; x < 50; x += 0.0137) maxErr = Math.max(maxErr, Math.abs(A.dsin(x) - Math.sin(x)), Math.abs(A.dcos(x) - Math.cos(x)));
log('dsin max error', maxErr.toExponential(2)); assert.ok(maxErr < 1e-8);

// 2. determinism + replay round trip
{
  const a = runBot({ seed: 777 }, 30000), b = runBot({ seed: 777 }, 30000);
  assert.equal(A.stateHash(a.st), A.stateHash(b.st)); assert.equal(a.st.score, b.st.score);
  const bytes = await A.encodeReplay(a.st, a.rec);
  const v = await A.verifyReplay(bytes);
  log('replay round trip:', v.ok, 'score', v.score, 'frames', v.frames, 'bytes', bytes.length);
  assert.ok(v.ok, v.reason);
  // tampered score in header
  const t1 = bytes.slice(); new DataView(t1.buffer).setFloat64(40, a.st.score + 1000, true);
  const v1 = await A.verifyReplay(t1); assert.equal(v1.ok, false); log('tampered header rejected:', v1.reason);
  // claimed score differs from replay
  const v2 = await A.verifyReplay(bytes, { score: a.st.score + 1 }); assert.equal(v2.ok, false);
  // different seed in header
  const t3 = bytes.slice(); new DataView(t3.buffer).setUint32(28, 778, true);
  const v3 = await A.verifyReplay(t3); assert.equal(v3.ok, false); log('tampered seed rejected:', v3.reason);
  // pilot binding: the same inputs under another pilot do not reproduce the run
  const pA = new Uint8Array(20).fill(7), pB = new Uint8Array(20).fill(8);
  const ra = runBot({ seed: 55, pilot: pA, pilotVersion: 22 }, 20000);
  const rab = await A.encodeReplay(ra.st, ra.rec);
  assert.ok((await A.verifyReplay(rab, { pilot: pA })).ok);
  assert.equal((await A.verifyReplay(rab, { pilot: pB })).ok, false);
  const forged = rab.slice(); forged.set(pB, 4); // re-label the pilot
  const vf = await A.verifyReplay(forged);
  assert.equal(vf.ok, false); log('re-labelled pilot rejected:', vf.reason);
  // daily runs: same waves for everyone, but a copied daily run still desyncs under another pilot
  const da = runBot({ mode: 1, period: 9, pilot: pA, pilotVersion: 22 }, 20000);
  const dab = await A.encodeReplay(da.st, da.rec); const dforged = dab.slice(); dforged.set(pB, 4);
  assert.ok((await A.verifyReplay(dab, { period: 9, mode: 1 })).ok);
  assert.equal((await A.verifyReplay(dforged, { period: 9 })).ok, false); log('re-labelled daily pilot rejected');
  // frame cap and trailing input after game over
  const big = rab.slice(); new DataView(big.buffer).setUint32(36, 0xFFFFFFFF, true);
  const t0 = Date.now(); const vb = await A.verifyReplay(big); assert.equal(vb.ok, false); log('huge frame count rejected in', Date.now() - t0, 'ms:', vb.reason);
  const over = runBot({ seed: 77, pilot: pA }, 400000);
  assert.equal(over.st.phase, 'over');
  over.rec.push({ ax: 0, ay: 0, cmd: 0 }); over.rec.push({ ax: 4, ay: 0, cmd: 0 });
  const vo = await A.verifyReplay(await A.encodeReplay(over.st, over.rec)); assert.equal(vo.ok, false); log('input after game over rejected:', vo.reason);
  // chunked verification gives the same answer
  const vc = await A.verifyReplay(rab, { chunk: 1000 }); assert.ok(vc.ok);
  // daily
  const d = runBot({ mode: 1, period: 6700 }, 20000);
  const db = await A.encodeReplay(d.st, d.rec);
  assert.ok((await A.verifyReplay(db, { period: 6700 })).ok);
  assert.equal((await A.verifyReplay(db, { period: 6701 })).ok, false);
  log('daily replay ok; wrong period rejected');
}

// 3. god-mode runs through a full loop (all 30 stages) with no soft-lock
for (const seed of [1, 2, 3]) {
  const r = runBot({ seed, testGod: true, stopAtLoop: 1 }, 600000);
  log(`god seed ${seed}: loop ${r.st.loop} sector ${r.st.sector} frames ${r.frames} (${(r.frames/3600).toFixed(1)} min) score ${r.st.score} wlv ${r.st.player.wlv} ${r.st.player.weapon} ${r.ms}ms`);
  assert.equal(r.st.loop, 1, 'did not complete the campaign');
  const bytes = await A.encodeReplay(r.st, r.rec);
  const v = await A.verifyReplay(bytes);
  assert.equal(v.ok, false, 'a god-mode run must never verify'); log(`  god replay correctly fails verification (${v.reason})`);
}

// 4. normal bot difficulty probe
for (const seed of [11, 12, 13, 14, 15]) {
  const r = runBot({ seed }, 600000);
  const bytes = await A.encodeReplay(r.st, r.rec);
  log(`bot seed ${seed}: died at loop ${r.st.loop} sector ${r.st.sector + 1} wave ${r.st.wave + 1} (${r.st.flow}), ${(r.frames/3600).toFixed(1)} min, score ${r.st.score}, replay ${bytes.length} B, ${r.ms}ms`);
}
