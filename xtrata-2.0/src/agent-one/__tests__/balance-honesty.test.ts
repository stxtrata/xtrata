import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const agentSource = readFileSync(new URL('../agent-core.ts', import.meta.url), 'utf8');
const bundle = readFileSync(
  new URL('../../../xtrata-agent-one/wizard/agent-one.js', import.meta.url),
  'utf8'
);

const fn = (name: string) => {
  const start = agentSource.indexOf(`async function ${name}(`);
  return start < 0 ? '' : agentSource.slice(start, start + 2600);
};

// Observed live on a deposit wallet holding 11.66 STX:
//   "not funded: need 11660000, have 0"
//   "begin-or-get: fee estimate 621 µSTX (cap 0, try 1)"  → every estimate a "spike"
//   "using bounded fallback fee 0" → "broadcast REJECTED — FeeTooLow"
// One cause: balance() returned 0 for a failed HTTP read, and 0 is indistinguishable
// from an empty wallet.
describe('a failed balance read never looks like an empty wallet', () => {
  const balanceFn = fn('balance');

  it('throws on a bad response instead of reporting zero', () => {
    expect(balanceFn).toContain('if (!r.ok) throw new Error');
    expect(balanceFn).toContain("if (d == null || d.balance == null) throw new Error");
    // The old shape silently defaulted to zero.
    expect(agentSource).not.toContain("BigInt(d.balance || '0')");
  });

  it('never lets a lookup failure drive the fee cap to zero', () => {
    const send = fn('send');
    // Unknown headroom keeps the safe default cap rather than lowering it to 0.
    expect(send).toContain('catch { headroom = null; }');
    expect(send).toContain('if (headroom != null && headroom < effCap) effCap = headroom;');
    // A genuine zero is reported, not broadcast as an unpayable transaction.
    expect(send).toContain('has no headroom left for fees');
  });

  it('separates "could not read the balance" from "not funded"', () => {
    const processFunded = agentSource.slice(
      agentSource.indexOf('let bal = 0n; let reads = 0;'),
      agentSource.indexOf('job.depositReceivedUstx = bal.toString();')
    );
    expect(processFunded).toContain('if (!reads) throw new Error');
    expect(processFunded).toContain('could not read the deposit balance');
    // Still takes the best of several reads — Hiro load-balances across chain tips.
    expect(processFunded).toContain('if (b > bal) bal = b;');
  });

  it('ships the fix in the built bundle', () => {
    expect(bundle).toContain('has no headroom left for fees');
    expect(bundle).toContain('could not read the deposit balance');
  });
});
