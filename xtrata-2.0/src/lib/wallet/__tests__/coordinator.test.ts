// @vitest-environment happy-dom

import { beforeEach, describe, expect, it, vi } from 'vitest';

const ADDRESS = 'SP2MF04VAGYHGAZWGTEDW5VYCPDWWSY08Z1QFNDSN';
const OTHER = 'SP1QJJVMB6NQBGMZQVDR22PADW2E3BEP61R2Z8D7V';
const bitcoinProvider = { request: vi.fn() };
const legacyProvider = { request: vi.fn() };
const providerConnect = vi.fn();
const providerDisconnect = vi.fn();
const providerRead = vi.fn();
const providerTransfer = vi.fn();
const providerCall = vi.fn();
const providerDeploy = vi.fn();
const providerSponsoredCall = vi.fn();

vi.mock('../connect', () => ({
  connectWallet: providerConnect,
  disconnectWallet: providerDisconnect,
  getSelectedWalletProviderId: () => 'XverseProviders.StacksProvider',
  getStacksProvider: () => legacyProvider,
  readActiveWalletSession: providerRead,
  showStxTransfer: providerTransfer,
  showContractCall: providerCall,
  showContractDeploy: providerDeploy,
  showSponsoredContractCall: providerSponsoredCall
}));

const coordinator = await import('../coordinator');
const { createStacksWalletAdapter } = await import('../adapter');

describe('wallet coordinator', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    window.localStorage.clear();
    (window as typeof window & {
      XverseProviders?: { StacksProvider: typeof legacyProvider; BitcoinProvider: typeof bitcoinProvider };
    }).XverseProviders = { StacksProvider: legacyProvider, BitcoinProvider: bitcoinProvider };
    coordinator.__testing.recordStore.clear();
    providerConnect.mockResolvedValue({
      isConnected: true,
      address: ADDRESS,
      network: 'mainnet'
    });
    providerRead.mockResolvedValue({
      isConnected: true,
      address: ADDRESS,
      network: 'mainnet'
    });
    providerDisconnect.mockResolvedValue(undefined);
  });

  it('records one Xverse transport and uses one verification for a transfer', async () => {
    await coordinator.connectWallet({ appName: 'test', appIcon: '/icon.svg' });
    expect(coordinator.getWalletCoordinatorState()).toMatchObject({
      status: 'CONNECTED',
      walletType: 'xverse',
      transportId: 'XverseProviders.BitcoinProvider',
      address: ADDRESS
    });

    const finished = vi.fn();
    providerTransfer.mockImplementation((options) => options.onFinish?.({ txId: '0x1' }));
    coordinator.showStxTransfer({
      recipient: ADDRESS,
      amount: '1',
      network: 'mainnet',
      stxAddress: ADDRESS,
      onFinish: finished
    });
    await vi.waitFor(() => expect(finished).toHaveBeenCalledOnce());
    expect(providerRead).toHaveBeenCalledOnce();
    expect(providerTransfer).toHaveBeenCalledWith(
      expect.objectContaining({ coordinatorVerified: true, stxAddress: ADDRESS }),
      bitcoinProvider
    );
  });

  it('publishes one session revision when the shared adapter connects', async () => {
    const changes = vi.fn();
    const unsubscribe = coordinator.subscribeWalletSession(changes);
    const adapter = createStacksWalletAdapter({ appName: 'test', appIcon: '/icon.svg' });

    await adapter.connect();

    expect(providerConnect).toHaveBeenCalledOnce();
    expect(changes).toHaveBeenCalledOnce();
    expect(adapter.getSession()).toMatchObject({ isConnected: true, address: ADDRESS });
    unsubscribe();
  });

  it('routes calls, deploys and sponsored signing through the connected Xverse transport', async () => {
    await coordinator.connectWallet({ appName: 'test', appIcon: '/icon.svg' });
    const callFinished = vi.fn();
    const deployFinished = vi.fn();
    const sponsoredFinished = vi.fn();
    providerCall.mockImplementation((options) => options.onFinish?.({ txId: '0x1' }));
    providerDeploy.mockImplementation((options) => options.onFinish?.({ txId: '0x2' }));
    providerSponsoredCall.mockImplementation((options) => options.onFinish?.({ txRaw: '00' }));

    coordinator.showContractCall({
      contractAddress: ADDRESS,
      contractName: 'contract',
      functionName: 'action',
      functionArgs: [],
      network: 'mainnet',
      stxAddress: ADDRESS,
      onFinish: callFinished
    });
    await vi.waitFor(() => expect(callFinished).toHaveBeenCalledOnce());

    coordinator.showContractDeploy({
      contractName: 'contract',
      codeBody: '(define-public (action) (ok true))',
      network: 'mainnet',
      stxAddress: ADDRESS,
      onFinish: deployFinished
    });
    await vi.waitFor(() => expect(deployFinished).toHaveBeenCalledOnce());

    coordinator.showSponsoredContractCall({
      contractAddress: ADDRESS,
      contractName: 'contract',
      functionName: 'action',
      functionArgs: [],
      network: 'mainnet',
      nonce: 0,
      stxAddress: ADDRESS,
      onFinish: sponsoredFinished
    });
    await vi.waitFor(() => expect(sponsoredFinished).toHaveBeenCalledOnce());

    expect(providerCall).toHaveBeenCalledWith(expect.any(Object), bitcoinProvider);
    expect(providerDeploy).toHaveBeenCalledWith(expect.any(Object), bitcoinProvider);
    expect(providerSponsoredCall).toHaveBeenCalledWith(expect.any(Object), bitcoinProvider);
    expect(providerRead).toHaveBeenCalledTimes(3);
  });

  it('blocks an expected-sender mismatch before invoking a provider', async () => {
    await coordinator.connectWallet({ appName: 'test', appIcon: '/icon.svg' });
    const onError = vi.fn();
    coordinator.showContractCall({
      contractAddress: ADDRESS,
      contractName: 'contract',
      functionName: 'action',
      functionArgs: [],
      network: 'mainnet',
      stxAddress: OTHER,
      onError
    });
    await vi.waitFor(() => expect(onError).toHaveBeenCalledOnce());
    expect(onError.mock.calls[0][0]).toMatchObject({ code: 'ACCOUNT_CHANGED' });
    expect(providerCall).not.toHaveBeenCalled();
    expect(providerRead).not.toHaveBeenCalled();
  });

  it('marks the session reconnect-required when live Xverse account changes', async () => {
    await coordinator.connectWallet({ appName: 'test', appIcon: '/icon.svg' });
    providerRead.mockResolvedValue({ isConnected: true, address: OTHER, network: 'mainnet' });
    const onError = vi.fn();
    coordinator.showContractCall({
      contractAddress: ADDRESS,
      contractName: 'contract',
      functionName: 'action',
      functionArgs: [],
      network: 'mainnet',
      stxAddress: ADDRESS,
      onError
    });
    await vi.waitFor(() => expect(onError).toHaveBeenCalledOnce());
    expect(coordinator.getWalletCoordinatorState().status).toBe('RECONNECT_REQUIRED');
    expect(providerCall).not.toHaveBeenCalled();
  });
});
