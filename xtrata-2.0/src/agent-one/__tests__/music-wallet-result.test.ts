import { beforeEach, describe, expect, it, vi } from 'vitest';
const bridge = vi.hoisted(() => ({ transfer: vi.fn() }));
vi.mock('../../lib/wallet/adapter', () => ({ createStacksWalletAdapter: () => ({ getSession: () => ({ address: 'SP-SIMULATED' }) }) }));
vi.mock('../../lib/wallet/connect', () => ({ showStxTransfer: bridge.transfer, showContractCall: vi.fn() }));
beforeEach(async () => {
  (globalThis as any).window = {};
  vi.resetModules(); bridge.transfer.mockReset();
  await import('../agent-one-wallet');
});
describe('tracked Music wallet payments', () => {
  it('returns the real transaction ID for verification', async () => {
    bridge.transfer.mockImplementation(opts => opts.onFinish({ txId: 'a'.repeat(64) }));
    await expect((window as any).XtrataWallet.pay({ recipient: 'SP-SIMULATED-DEPOSIT', amount: '750000', trackResult: true })).resolves.toEqual({ txId: 'a'.repeat(64) });
    expect(bridge.transfer.mock.calls[0][0].stxAddress).toBe('SP-SIMULATED');
  });
  it('distinguishes explicit cancellation from an ambiguous error', async () => {
    bridge.transfer.mockImplementation(opts => opts.onCancel());
    await expect((window as any).XtrataWallet.pay({ recipient: 'SP-SIMULATED-DEPOSIT', amount: '750000', trackResult: true })).rejects.toMatchObject({ code: 'USER_CANCELLED' });
    bridge.transfer.mockImplementation(opts => opts.onError(new Error('Connection lost')));
    await expect((window as any).XtrataWallet.pay({ recipient: 'SP-SIMULATED-DEPOSIT', amount: '750000', trackResult: true })).rejects.toThrow('Connection lost');
  });
  it('preserves the original untracked payment cancellation behavior', async () => {
    bridge.transfer.mockImplementation(opts => opts.onCancel());
    await expect((window as any).XtrataWallet.pay({ recipient: 'SP-SIMULATED-DEPOSIT', amount: '750000' })).resolves.toBeUndefined();
  });
});
