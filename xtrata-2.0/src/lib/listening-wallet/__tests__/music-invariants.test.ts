import { describe, expect, it } from 'vitest';
import { LISTENING_HKDF_INFO, LISTENING_PRF_SALT, slotInfo } from '../derive';
import { costPerPlay, DEFAULT_PLAY_FEE, HOLDER_PAYMENT, LIKE_FEE, RESERVE, TARGET } from '../policy';
import { LIKES_CONTRACT, PLAYS_CONTRACT } from '../tx';
import { LISTEN_SECONDS } from '../../radio/audible-listen';

/**
 * The music overhaul's guardrails in one place (docs/music/HANDBOOK.md, "Invariants"). Every value here is either
 * money a listener or artist already relies on, or a label whose change would move every listener's wallet to an
 * address nobody can reach. A failure means a rule is being broken: fix the code, never this test.
 *
 * The derivation itself is locked by known-answer vectors in listening-wallet.test.ts; this file locks the labels
 * and the payment terms so a rename or a "tidy-up" cannot slip through in an unrelated change.
 */
describe('music invariants', () => {
  it('key derivation labels never change', () => {
    expect(new TextDecoder().decode(LISTENING_PRF_SALT)).toBe('xtrata.radio.listening-wallet.v1');
    expect(LISTENING_HKDF_INFO).toBe('xtrata-radio-listening-key-v1');
    expect(slotInfo(0)).toBe('xtrata-radio-listening-key-v1');
    expect(slotInfo(1)).toBe('xtrata-radio-listening-key-v1/slot/1');
    expect(slotInfo(100)).toBe('xtrata-radio-listening-key-v1/slot/100');
  });

  it('a play pays the holder 50 microSTX plus a 300 microSTX fee, after 30 seconds heard', () => {
    expect(HOLDER_PAYMENT).toBe(50n);
    expect(DEFAULT_PLAY_FEE).toBe(300n);
    expect(costPerPlay(DEFAULT_PLAY_FEE)).toBe(350n);
    expect(LISTEN_SECONDS).toBe(30);
  });

  it('a listening wallet is small: 1 STX target, a return reserve, a fixed like fee', () => {
    expect(TARGET).toBe(1_000_000n);
    expect(RESERVE).toBe(3_000n);
    expect(LIKE_FEE).toBe(200n);
  });

  it('plays and likes go to the deployed contracts, unchanged', () => {
    expect(PLAYS_CONTRACT).toBe('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0');
    expect(LIKES_CONTRACT).toBe('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0');
  });
});
