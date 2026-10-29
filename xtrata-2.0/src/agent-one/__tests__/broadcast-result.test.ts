import { describe, expect, it } from 'vitest';
import { normalizeBroadcastResult } from '../broadcast-result';

const ID = 'a'.repeat(64);

describe('normalizeBroadcastResult', () => {
  it('passes an accepted transaction through', () => {
    expect(normalizeBroadcastResult({ txid: ID })).toEqual({ txid: ID });
    expect(normalizeBroadcastResult(`"${ID}"`)).toEqual({ txid: ID });
  });
  it('keeps a node rejection exactly as it was', () => {
    const r = { error: 'transaction rejected', reason: 'FeeTooLow' };
    expect(normalizeBroadcastResult(r)).toBe(r);
  });
  it('turns a gateway refusal (no error, no txid) into an error', () => {
    const r = normalizeBroadcastResult({ message: 'Forbidden' });
    expect(r.txid).toBeUndefined();
    expect(r.error).toBe('broadcast refused');
    expect(r.reason).toContain('Forbidden');
    expect(r.reason).toContain('Nothing was broadcast');
  });
  it('turns anything else unrecognised into an error, never a txid', () => {
    for (const odd of [{}, null, undefined, 'oops', { txid: 'not-a-txid' }, { txid: {} }, { message: 'Service Unavailable' }]) {
      const r = normalizeBroadcastResult(odd);
      expect(r.error).toBe('broadcast refused');
      expect(r.txid).toBeUndefined();
      expect(r.ambiguous).toBe(true);
    }
    expect(normalizeBroadcastResult({ message: 'Forbidden' }).ambiguous).toBeUndefined();
  });
});
