import { describe, expect, it } from 'vitest';
import {
  activePhaseOpen,
  finalizePreflight,
  phaseWindowPreflight,
  requiredSignerRole,
  signerPreflight,
  splitsPreflight,
  splitsWarning
} from '../contract-preflight';

const OWNER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const OPS = 'SP2SA0DJXM5106NWT4S45AE442ZHYQPR0T5VSJA19';
const OTHER = 'SP3KMZE3WQ082AK2F3XTZEYZ3N5S9C0S0BHSH5ZZZ';
const roles = { owner: OWNER, pendingOwner: null, operatorAdmin: OPS, financeAdmin: OWNER };

describe('signer preflight', () => {
  it('maps helper functions to the roles the contract enforces', () => {
    expect(requiredSignerRole('set-max-supply')).toBe('owner');
    expect(requiredSignerRole('set-mint-price')).toBe('finance');
    expect(requiredSignerRole('set-paused')).toBe('config');
    expect(requiredSignerRole('set-marketplace-recipient')).toBe('recipient-editor');
  });
  it('lets the right wallet through and names the one that is needed otherwise', () => {
    expect(signerPreflight('set-max-supply', OWNER, roles)).toBeNull();
    expect(signerPreflight('set-paused', OPS, roles)).toBeNull();
    expect(signerPreflight('set-max-supply', OPS, roles)).toMatch(/owner's wallet \(SP3JNS…743X\)/);
    expect(signerPreflight('set-mint-price', OTHER, roles)).toMatch(/can't make this change/);
  });
  it('says "could not check" when roles are unknown', () => {
    expect(signerPreflight('set-paused', OWNER, null)).toMatch(/Could not read/);
  });
});

describe('splits, phases, finalize', () => {
  it('blocks splits over 100% and explains where remainders go', () => {
    expect(splitsPreflight(9500n, 250n, 251n)).toMatch(/100%/);
    expect(splitsPreflight(9500n, 250n, 250n)).toBeNull();
    expect(splitsWarning({ artist: 0n, marketplace: 0n, operator: 0n }, 1n)).toMatch(/100% of each payout/);
    expect(splitsWarning({ artist: 0n, marketplace: 0n, operator: 0n }, 0n)).toBeNull();
  });
  it('mirrors the contract phase rules', () => {
    expect(phaseWindowPreflight(10n, 5n)).toMatch(/starts after it ends/);
    expect(phaseWindowPreflight(10n, 0n)).toBeNull();
    const phase = { phaseId: 1n, enabled: true, startBlock: 100n, endBlock: 200n };
    expect(activePhaseOpen(phase, 150n).ok).toBe(true);
    expect(activePhaseOpen(phase, 50n).hint).toMatch(/starts at block 100/);
    expect(activePhaseOpen({ ...phase, enabled: false }, 150n).hint).toMatch(/disabled/);
    expect(activePhaseOpen(phase, null).ok).toBe(false);
    expect(activePhaseOpen(null, null).ok).toBe(true);
  });
  it('only allows finalize when sold out with no reservations', () => {
    expect(finalizePreflight({ maxSupply: 10n, minted: 9n, reserved: 0n })).toMatch(/9 of 10/);
    expect(finalizePreflight({ maxSupply: 10n, minted: 10n, reserved: 1n })).toMatch(/Release/);
    expect(finalizePreflight({ maxSupply: 10n, minted: 10n, reserved: 0n })).toBeNull();
    expect(finalizePreflight({ maxSupply: null, minted: 1n, reserved: 0n })).toMatch(/Could not read/);
  });
});
