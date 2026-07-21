import { describe, expect, it } from 'vitest';
import { fingerprint, normaliseMessage } from '../fingerprint';

describe('telemetry fingerprint', () => {
  it('collapses volatile values so the same bug shares one fingerprint', () => {
    const a = fingerprint(
      'market_buy',
      'broadcast',
      'NONCE_MISMATCH',
      'nonce mismatch, expected 41 got 39 for SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQVX8X0G'
    );
    const b = fingerprint(
      'market_buy',
      'broadcast',
      'NONCE_MISMATCH',
      'nonce mismatch, expected 12 got 10 for SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X'
    );
    expect(a).toBe(b);
  });

  it('separates different flows', () => {
    const a = fingerprint('market_buy', 'broadcast', 'NONCE_MISMATCH', 'nonce mismatch');
    const b = fingerprint('mint', 'broadcast', 'NONCE_MISMATCH', 'nonce mismatch');
    expect(a).not.toBe(b);
  });

  it('normalises addresses, hex and numbers to a shared template', () => {
    const m1 = normaliseMessage(
      'fee 12,345 ustx at 0xabcdef123456 for SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQVX8X0G'
    );
    const m2 = normaliseMessage(
      'fee 9 ustx at 0x99aa88bb77cc for SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X'
    );
    expect(m1).toBe(m2);
  });

  it('produces a stable 16-char hex id', () => {
    expect(fingerprint('app', undefined, 'UNCAUGHT', 'boom')).toMatch(/^[0-9a-f]{16}$/);
  });
});
