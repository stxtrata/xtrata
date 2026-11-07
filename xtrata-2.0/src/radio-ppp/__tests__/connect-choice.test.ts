import { describe, expect, it } from 'vitest';
import { musicWalletOption, MUSIC_WALLET_NAME } from '../connect-choice';

const base = { step: 'intro' as const, solo: true, main: undefined, gate: { passkeyOnly: true } };

describe('musicWalletOption (radio connect pop-up)', () => {
  it('offers to make an Xtrata Music Wallet when this device has none', () => {
    const o = musicWalletOption(base);
    expect(o).toMatchObject({ action: 'create', label: MUSIC_WALLET_NAME });
    expect(o?.detail).toMatch(/Face ID/);
  });

  it('offers to open the one already on this device', () => {
    expect(musicWalletOption({ ...base, step: 'locked' })?.action).toBe('unlock');
  });

  it('just shows an Xtrata Music Wallet that is already open', () => {
    for (const step of ['fund', 'ready', 'over'] as const) expect(musicWalletOption({ ...base, step })?.action).toBe('show');
    expect(musicWalletOption({ ...base, step: 'loading' })?.action).toBe('show');
  });

  it('shows the row disabled where the browser cannot make a passkey', () => {
    expect(musicWalletOption({ ...base, step: 'unsupported' })).toMatchObject({ disabled: true, action: null });
  });

  it('skips the pop-up when passkey-only wallets are switched off', () => {
    expect(musicWalletOption({ ...base, gate: { passkeyOnly: false } })).toBeNull();
    expect(musicWalletOption({ ...base, gate: null })).toBeNull();
  });

  it('skips it when a Stacks wallet is connected', () => {
    expect(musicWalletOption({ ...base, main: 'SP000000000000000000002Q6VF78' })).toBeNull();
  });

  it('skips it when the passkey here belongs to a Stacks wallet holder', () => {
    expect(musicWalletOption({ ...base, solo: false, step: 'connect' })).toBeNull();
  });

  it('skips it where pay-per-play is off or lives elsewhere', () => {
    for (const step of ['off', 'elsewhere', 'not-invited'] as const) expect(musicWalletOption({ ...base, step })).toBeNull();
  });
});
