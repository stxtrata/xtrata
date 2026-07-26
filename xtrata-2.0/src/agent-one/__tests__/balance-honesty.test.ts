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

// Measured through our own keyed proxy (7 keys configured, key confirmed applied),
// 10 concurrent requests per endpoint:
//   /extended/v1/address/:addr/stx          → 10/10 429 "Please update to the v2 endpoint"
//   /extended/v1/address/:addr/stx_inbound  → 10/10 429
//   /extended/v2/addresses/:addr/balances/stx → 10/10 200
//   nonces, transactions, mempool, nft/holdings → 10/10 200
// The API key does not exempt a deprecated endpoint from throttling.
describe('deprecated Hiro endpoints are not on the hot path', () => {
  it('reads balances from v2', () => {
    expect(agentSource).toContain('/extended/v2/addresses/${addr}/balances/stx');
    expect(agentSource).not.toContain('/extended/v1/address/${addr}/stx`');
  });

  it('detects the funder via the endpoint that is not throttled', () => {
    const detect = agentSource.slice(
      agentSource.indexOf('async function detectFunder'),
      agentSource.indexOf('async function resolveFunder')
    );
    // /transactions leads; stx_inbound is only the backstop.
    expect(detect.indexOf('/transactions?limit=50')).toBeLessThan(detect.indexOf('/stx_inbound?limit=50'));
    // Both now check r.ok, so a 429 is a failure rather than an empty result set.
    expect(detect).toContain('if (!r.ok) throw new Error(`tx list ${r.status}`)');
    expect(detect).toContain('if (!r.ok) throw new Error(`stx_inbound ${r.status}`)');
  });
});

describe('the parent gate reads chain state, not the holdings index', () => {
  const parentsStatus = agentSource.slice(
    agentSource.indexOf('async function parentsStatus'),
    agentSource.indexOf('async function returnAllHeldNfts')
  );

  it('decides held/missing from get-owner', () => {
    // The index lags chain state, so gating on it left the escrow checklist saying
    // "arrived at the deposit wallet" on one line and "now send the parent" above it.
    expect(parentsStatus).toContain('(((await ownerOf(pid)) === own) ? held : missing).push(pid)');
    // ...and that ownership decision is NOT derived from the holdings list.
    expect(parentsStatus).not.toContain('required.filter((p) => heldAll!.includes(p))');
  });

  it('still uses the holdings index for strays only', () => {
    expect(parentsStatus).toContain('heldAll.filter((id) => !mine.has(String(id)))');
    expect(parentsStatus).toContain('holdingsUnverified: true');
  });
});
