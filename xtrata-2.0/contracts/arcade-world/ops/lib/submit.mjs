// Turn compiled scenes into contract calls, show them, and (only when allowed) send them.
import { cvToHex, Cl } from '@stacks/transactions';
import { sceneCv } from './clar.mjs';
import { batches } from './scene.mjs';
import { verifyScenes } from './readback.mjs';
import { explain } from './errors.mjs';

// The calls that would be made: [{ which, fn, scenes, args (Clarity values), argsHex }]
export function planSceneCalls(scenes) {
  return batches(scenes).map((b) => {
    const single = b.length === 1;
    const args = single ? [sceneCv(b[0])] : [Cl.list(b.map(sceneCv))];
    return { which: 'world', fn: single ? 'add-scene' : 'add-scenes', scenes: b, args, argsHex: args.map((a) => cvToHex(a)) };
  });
}

// Walk the plan. `execute` false returns without calling anything. `from` is the sender (simnet address; the network transport
// signs with its attached signer). Stops at the first failure. A batch whose scenes are already on chain is skipped, so a half-finished run can be re-run.
export async function submitScenes(t, scenes, { execute = false, from = null, log = () => {} } = {}) {
  const calls = planSceneCalls(scenes);
  const result = { executed: false, calls: calls.length, sent: 0, skipped: 0, failed: null, verify: null };
  if (!execute) { calls.forEach((c, i) => log(`dry run ${i + 1}/${calls.length}: ${c.which} ${c.fn} (${c.scenes.length} scene${c.scenes.length > 1 ? 's' : ''})`)); return result; }
  result.executed = true;
  for (let i = 0; i < calls.length; i++) {
    const c = calls[i];
    const height = await t.height();
    const already = await verifyScenes(t, c.scenes, { submittedAt: height });
    if (already.ok) { result.skipped++; log(`batch ${i + 1}/${calls.length}: already on chain, skipped`); continue; }
    const r = await t.send(c.which, c.fn, c.args, from);
    if (!r.ok) { result.failed = { batch: i + 1, error: explain('world', Number(r.value)), raw: r.value }; log(`batch ${i + 1}/${calls.length}: FAILED ${result.failed.error}`); return result; }
    result.sent++; log(`batch ${i + 1}/${calls.length}: sent${r.txid ? ' ' + r.txid : ''}`);
  }
  result.verify = await verifyScenes(t, scenes, { submittedAt: await t.height() });
  return result;
}
