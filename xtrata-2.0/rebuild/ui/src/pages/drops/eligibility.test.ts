import { describe, expect, it } from 'vitest';
import type { DropRow } from '@xtrata/collections-client';
import { evaluateEligibility, type EligibilityInput } from './eligibility';

const WALLET = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

const drop = (patch: Partial<DropRow> = {}): DropRow => ({
  creator: DEPLOYER,
  collection: `${DEPLOYER}.my-collection`,
  mode: 1,
  status: 1,
  statusName: 'active',
  startBlock: 0,
  endBlock: 0,
  totalLimit: 0,
  perWalletLimit: 1,
  eligibility: 1,
  feeBudgetTotal: 0n,
  feeBudgetRemaining: 0n,
  feesSettled: 0,
  inventoryCount: 10,
  rangesTotal: 10,
  rangeCount: 1,
  explicitCount: 0,
  escrowedCount: 10,
  claimedCount: 0,
  reservedCount: 0,
  freeCount: 0,
  cursor: 0,
  createdAt: 1,
  endedAt: null,
  ...patch
});

const input = (patch: Partial<EligibilityInput> = {}): EligibilityInput => ({
  drop: drop(),
  wallet: WALLET,
  contractPaused: false,
  tipHeight: 500,
  remaining: 10,
  walletClaims: 0,
  allowlistAllowance: null,
  reservation: null,
  attestorConfigured: true,
  ...patch
});

describe('evaluateEligibility — public drops', () => {
  it('lets an eligible wallet claim', () => {
    const verdict = evaluateEligibility(input());
    expect(verdict.kind).toBe('eligible');
    expect(verdict.canClaim).toBe(true);
    expect(verdict.entrypoint).toBe('claim');
  });

  it('asks for a wallet before anything else', () => {
    const verdict = evaluateEligibility(input({ wallet: null, remaining: 0 }));
    expect(verdict.kind).toBe('connect-wallet');
    expect(verdict.canClaim).toBe(false);
  });

  it('stops a wrong-network session', () => {
    expect(evaluateEligibility(input({ wrongNetwork: true })).kind).toBe('wrong-network');
  });

  it('reports the contract pause before the drop status', () => {
    expect(evaluateEligibility(input({ contractPaused: true })).kind).toBe('contract-paused');
  });
});

describe('evaluateEligibility — the window and the status', () => {
  it.each([
    ['draft', 'has not been activated'],
    ['paused', 'is paused'],
    ['ended', 'is ended'],
    ['cancelled', 'is cancelled']
  ] as const)('refuses a %s drop', (statusName, fragment) => {
    const verdict = evaluateEligibility(input({ drop: drop({ statusName, status: 0 }) }));
    expect(verdict.kind).toBe('not-active');
    expect(verdict.message).toContain(fragment);
  });

  it('counts down to a start block in the future', () => {
    const verdict = evaluateEligibility(input({ drop: drop({ startBlock: 800 }), tipHeight: 500 }));
    expect(verdict.kind).toBe('window-not-open');
    expect(verdict.message).toContain('300');
  });

  it('refuses after the end block', () => {
    const verdict = evaluateEligibility(input({ drop: drop({ endBlock: 400 }), tipHeight: 500 }));
    expect(verdict.kind).toBe('window-closed');
  });

  it('treats end block 0 as no end', () => {
    expect(evaluateEligibility(input({ drop: drop({ endBlock: 0 }), tipHeight: 10_000 })).kind).toBe(
      'eligible'
    );
  });

  it('does not guess about the window when the tip is unknown', () => {
    expect(
      evaluateEligibility(input({ drop: drop({ startBlock: 9_999 }), tipHeight: null })).kind
    ).toBe('eligible');
  });
});

describe('evaluateEligibility — limits and lists', () => {
  it('refuses when nothing is left', () => {
    expect(evaluateEligibility(input({ remaining: 0 })).kind).toBe('sold-out');
  });

  it('enforces the per-wallet limit', () => {
    const verdict = evaluateEligibility(input({ walletClaims: 1 }));
    expect(verdict.kind).toBe('wallet-limit');
    expect(verdict.message).toContain('1 of its 1');
  });

  it('ignores the per-wallet limit when it is zero', () => {
    expect(
      evaluateEligibility(input({ drop: drop({ perWalletLimit: 0 }), walletClaims: 12 })).kind
    ).toBe('eligible');
  });

  it('refuses a wallet that is not on the allowlist', () => {
    const verdict = evaluateEligibility(
      input({ drop: drop({ eligibility: 2 }), allowlistAllowance: null })
    );
    expect(verdict.kind).toBe('not-allowlisted');
  });

  it('refuses a wallet that has used its allowance', () => {
    const verdict = evaluateEligibility(
      input({
        drop: drop({ eligibility: 2, perWalletLimit: 0 }),
        allowlistAllowance: 2,
        walletClaims: 2
      })
    );
    expect(verdict.kind).toBe('allowance-used');
  });

  it('lets an allowlisted wallet with allowance left claim', () => {
    const verdict = evaluateEligibility(
      input({
        drop: drop({ eligibility: 2, perWalletLimit: 0 }),
        allowlistAllowance: 3,
        walletClaims: 1
      })
    );
    expect(verdict.kind).toBe('eligible');
  });
});

describe('evaluateEligibility — signed drops', () => {
  it('routes to claim-signed', () => {
    const verdict = evaluateEligibility(input({ drop: drop({ eligibility: 3 }) }));
    expect(verdict.entrypoint).toBe('claim-signed');
  });

  it('asks for an attestation before allowing a claim', () => {
    const verdict = evaluateEligibility(input({ drop: drop({ eligibility: 3 }) }));
    expect(verdict.kind).toBe('attestation-required');
    expect(verdict.canClaim).toBe(false);
  });

  it('allows the claim once an attestation is held', () => {
    const verdict = evaluateEligibility(
      input({ drop: drop({ eligibility: 3 }), hasAttestation: true })
    );
    expect(verdict.kind).toBe('eligible');
  });

  it('says so plainly when no attestor is configured on the contract', () => {
    const verdict = evaluateEligibility(
      input({ drop: drop({ eligibility: 3 }), attestorConfigured: false, hasAttestation: true })
    );
    expect(verdict.kind).toBe('attestor-not-configured');
    expect(verdict.message).toMatch(/nobody can claim/i);
  });
});

describe('evaluateEligibility — reservations', () => {
  it('short-circuits the limits when the wallet already holds a reservation', () => {
    const verdict = evaluateEligibility(
      input({
        reservation: { index: 7, reservedAt: 100 },
        walletClaims: 5,
        remaining: 0
      })
    );
    expect(verdict.kind).toBe('holds-reservation');
    expect(verdict.canClaim).toBe(true);
    expect(verdict.reservedIndex).toBe(7);
  });

  it('still refuses a reservation on a drop that is no longer claimable', () => {
    const verdict = evaluateEligibility(
      input({ drop: drop({ statusName: 'ended', status: 3 }), reservation: { index: 7, reservedAt: 1 } })
    );
    expect(verdict.kind).toBe('not-active');
  });
});
