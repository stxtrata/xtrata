import { describe, it, expect } from 'vitest';
import { parseStatus, parsePage, stx } from '../protocol';
import { exampleStatus } from '../fake';
describe('read-only support boundary', () => {
  it('validates balance accounting with exact integers', () => {
    expect(parseStatus(exampleStatus).usable).toBe('18650');
    expect(stx('257')).toBe('0.000257 STX');
    expect(() => parseStatus({ ...exampleStatus, usable: '20000' })).toThrow();
  });
  it('rejects privileged extras and malformed values without echoing input', () => {
    for (const key of ['privateKey','nonce','recipient','contract','signedBytes']) {
      expect(() => parseStatus({ ...exampleStatus, [key]: 'secret-fixture' })).toThrow('Invalid fields');
    }
    for (const fee of ['-1','01','1.0','1e3','', '9'.repeat(21)]) expect(() => parseStatus({ ...exampleStatus, fee })).toThrow();
    expect(() => parseStatus({ ...exampleStatus, address: 'ST123' })).toThrow();
    expect(() => parseStatus({ ...exampleStatus, schema: 2 })).toThrow();
  });
  it('rejects unconfirmed money and invalid links', () => {
    const e = { id: '01'.repeat(16), core: 3, masterId: 2910, title: '', artist: '', state: 'unknown', startedAt: '2026-09-17T12:00:00.000Z', fee: null, holder: null, txid: null };
    expect(parsePage({ entries: [e], next: null }).entries).toHaveLength(1);
    for (const patch of [{ fee: '300' }, { txid: 'javascript:alert(1)' }, { state: 'confirmed' }, { core: 4 }]) expect(() => parsePage({ entries: [{ ...e, ...patch }], next: null })).toThrow();
    expect(() => parsePage({ entries: [e,e], next: null })).toThrow();
    expect(() => parsePage({ entries: Array(51).fill(e), next: null })).toThrow();
  });
});
