import { describe, expect, it } from 'vitest';
import { musicWalletOptions, MUSIC_WALLET_NAME } from '../connect-choice';

const JIM = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7';
const AUD = 'SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX';
const base = { step: 'intro' as const, solo: true, main: undefined, mainConnected: false, gate: { passkeyOnly: true, here: true, enabled: true } };
const names = (a: string) => (a === JIM ? 'jim.btc' : a === AUD ? 'audionals.btc' : a);

describe('musicWalletOptions (radio connect pop-up)', () => {
  it('offers to make an Xtrata Music Wallet when this device has none', () => {
    const [o, ...rest] = musicWalletOptions(base);
    expect(rest).toEqual([]);
    expect(o).toMatchObject({ action: 'create', label: MUSIC_WALLET_NAME });
    expect(o.detail).toMatch(/Face ID/);
  });

  it('offers to open a passkey-only wallet already on this device', () => {
    expect(musicWalletOptions({ ...base, step: 'locked' })[0].action).toBe('unlock');
  });

  it('just shows a passkey-only wallet that is already open', () => {
    for (const step of ['fund', 'ready', 'over', 'loading'] as const) expect(musicWalletOptions({ ...base, step })[0].action).toBe('show');
  });

  it('gives each linked wallet on the device its own row, named by the Stacks wallet it counts for', () => {
    const rows = musicWalletOptions({ ...base, step: 'connect', solo: false, linked: JIM, others: [AUD] }, names);
    expect(rows.map((r) => [r.action, r.main, r.label])).toEqual([
      ['linked', JIM, 'Xtrata Music Wallet · jim.btc'],
      ['linked', AUD, 'Xtrata Music Wallet · audionals.btc']
    ]);
    expect(rows[0].detail).toMatch(/count for jim\.btc/);
  });

  it('offers linked wallets even where passkey-only wallets are switched off', () => {
    const rows = musicWalletOptions({ ...base, gate: { passkeyOnly: false, here: true, enabled: true }, step: 'connect', solo: false, linked: JIM });
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ action: 'linked', main: JIM });
  });

  it('lists the wallet in use first, and says it is open', () => {
    const rows = musicWalletOptions({ ...base, step: 'ready', solo: false, standIn: AUD, main: AUD, linked: AUD, others: [JIM] }, names);
    expect(rows.map((r) => r.main)).toEqual([AUD, JIM]);
    expect(rows[0].detail).toBe('Open on this device.');
  });

  it('lists a passkey-only wallet beside linked ones', () => {
    const rows = musicWalletOptions({ ...base, others: [JIM] }, names);
    expect(rows.map((r) => r.action)).toEqual(['linked', 'create']);
  });

  it('shows one disabled row where the browser cannot use passkeys', () => {
    expect(musicWalletOptions({ ...base, step: 'unsupported' })).toEqual([expect.objectContaining({ disabled: true, action: null })]);
    expect(musicWalletOptions({ ...base, step: 'unsupported', gate: { passkeyOnly: false } })).toEqual([]);
  });

  it('offers nothing while a Stacks wallet is connected', () => {
    expect(musicWalletOptions({ ...base, main: JIM, mainConnected: true, linked: JIM, solo: false, step: 'ready' })).toEqual([]);
  });

  it('offers nothing without passkey-only or a linked wallet here', () => {
    expect(musicWalletOptions({ ...base, gate: { passkeyOnly: false } })).toEqual([]);
    expect(musicWalletOptions({ ...base, gate: null })).toEqual([]);
  });

  it('offers nothing where pay-per-play is off or lives elsewhere', () => {
    for (const step of ['off', 'elsewhere'] as const) expect(musicWalletOptions({ ...base, step, linked: JIM })).toEqual([]);
    expect(musicWalletOptions({ ...base, step: 'connect', linked: JIM, solo: false, gate: { here: false } })).toEqual([]);
  });
});
