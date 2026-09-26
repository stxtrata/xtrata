// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { uintCV } from '@stacks/transactions';
import * as wallet from './wallet';

const ADDR = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const OTHER = 'SP2Z5RE2TDDAE9VGSNQB4DKG5KKZPVP720Z0MV4BB';
const TXID = `0x${'ab'.repeat(32)}`;

const install = (id: string, handler: (method: string, params?: any) => any) => {
  const calls: { method: string; params?: any }[] = [];
  const provider = { request: vi.fn(async (method: string, params?: any) => { calls.push({ method, params }); return handler(method, params); }) };
  const w = window as any;
  if (id.includes('.')) { const [a, b] = id.split('.'); w[a] = { ...(w[a] ?? {}), [b]: provider }; } else w[id] = provider;
  w.btc_providers = [{ id, name: id.toLowerCase().includes('xverse') ? 'Xverse' : 'Leather' }];
  return calls;
};
const choose = (id: string) => async () => id;
const call = (overrides: Partial<wallet.CallOptions> = {}): wallet.CallOptions => ({
  contractAddress: ADDR, contractName: 'helper', functionName: 'set-mint-price', functionArgs: [uintCV(1)],
  postConditions: [], network: 'mainnet', stxAddress: ADDR, ...overrides
});

afterEach(() => {
  const w = window as any;
  delete w.XverseProviders; delete w.LeatherProvider; delete w.btc_providers;
  wallet.__testing.forget();
  vi.restoreAllMocks();
});

describe('Xverse (X Chess canary rules)', () => {
  const xverse = (overrides: Record<string, (params?: any) => any> = {}) => install('XverseProviders.BitcoinProvider', (method, params) => {
    if (overrides[method]) return overrides[method](params);
    if (method === 'wallet_connect') return { result: { addresses: [{ address: 'bc1qxyz', purpose: 'payment' }, { address: ADDR, purpose: 'stacks', publicKey: `02${'11'.repeat(32)}` }] } };
    if (method === 'wallet_getAccount') return { result: { addresses: [{ address: ADDR }] } };
    if (method === 'stx_callContract' || method === 'stx_transferStx' || method === 'stx_deployContract') return { result: { txid: TXID } };
    return { result: null };
  });

  it('connect drops the old permission, then asks for the chosen network', async () => {
    const calls = xverse();
    const result = await wallet.connect('mainnet', choose('XverseProviders.BitcoinProvider'));
    expect(result).toMatchObject({ isConnected: true, address: ADDR, publicKey: '11'.repeat(32).padStart(66, '02') });
    expect(calls.map((c) => c.method)).toEqual(['wallet_disconnect', 'wallet_connect']);
    expect(calls[1].params).toEqual({ addresses: ['stacks', 'payment'], network: 'Mainnet', message: 'Xtrata collection v1.7 canary' });
  });

  it('reports a wrong-network account instead of connecting', async () => {
    const testnet = () => ({ result: { addresses: [{ address: 'ST2Z5RE2TDDAE9VGSNQB4DKG5KKZPVP720Z0MV4BB' }] } });
    xverse({ wallet_connect: testnet, stx_getAccounts: testnet, wallet_getAccount: testnet });
    const result = await wallet.connect('mainnet', choose('XverseProviders.BitcoinProvider'));
    expect(result).toMatchObject({ isConnected: false, wrongNetwork: 'testnet' });
  });

  it('contract call: cached account, no sender, arguments duplicated, network + address sent', async () => {
    const calls = xverse();
    await wallet.connect('mainnet', choose('XverseProviders.BitcoinProvider'));
    const tx = await wallet.contractCall(call());
    expect(tx.txId).toBe(TXID);
    const methods = calls.map((c) => c.method);
    expect(methods).not.toContain('stx_getAccounts');
    expect(methods.slice(-1)).toEqual(['stx_callContract']);
    const params = calls.at(-1)!.params;
    expect(params).not.toHaveProperty('sender');
    expect(params.arguments).toEqual(params.functionArgs);
    expect(params).toMatchObject({ contract: `${ADDR}.helper`, functionName: 'set-mint-price', network: 'mainnet', address: ADDR, postConditionMode: 'deny' });
  });

  it('preflight without a cache: wallet_getAccount, never stx_getAccounts', async () => {
    const calls = xverse();
    await wallet.connect('mainnet', choose('XverseProviders.BitcoinProvider'));
    wallet.__testing.forget();
    await wallet.contractCall(call());
    const after = calls.map((c) => c.method).slice(2);
    expect(after).toEqual(['wallet_getAccount', 'stx_callContract']);
  });

  it('aborts when the active account is not the connected one', async () => {
    const calls = xverse({ wallet_getAccount: () => ({ result: { addresses: [{ address: OTHER }] } }) });
    await wallet.connect('mainnet', choose('XverseProviders.BitcoinProvider'));
    wallet.__testing.forget();
    await expect(wallet.contractCall(call())).rejects.toMatchObject({ code: wallet.ADDRESS_MISMATCH });
    expect(calls.map((c) => c.method)).not.toContain('stx_callContract');
  });

  it('network mismatch: sign-only broadcast first', async () => {
    const calls = xverse({ stx_callContract: () => { throw new Error('Network mismatch'); }, stx_signTransaction: () => ({ result: { txid: TXID } }) });
    await wallet.connect('mainnet', choose('XverseProviders.BitcoinProvider'));
    const tx = await wallet.contractCall(call({ buildUnsigned: async () => 'ff'.repeat(80) }));
    expect(tx.txId).toBe(TXID);
    expect(calls.at(-1)).toEqual({ method: 'stx_signTransaction', params: { transaction: 'ff'.repeat(80), broadcast: true } });
  });

  it('network mismatch without sign-only: one reconnect and retry', async () => {
    let first = true;
    const calls = xverse({ stx_callContract: () => { if (first) { first = false; throw new Error('Network mismatch'); } return { result: { txid: TXID } }; } });
    await wallet.connect('mainnet', choose('XverseProviders.BitcoinProvider'));
    await wallet.contractCall(call());
    expect(calls.map((c) => c.method).slice(2)).toEqual(['stx_callContract', 'wallet_disconnect', 'wallet_connect', 'stx_callContract']);
  });

  it('user rejection is never retried', async () => {
    const calls = xverse({ stx_callContract: () => { throw Object.assign(new Error('User rejected request'), { code: 4001 }); } });
    await wallet.connect('mainnet', choose('XverseProviders.BitcoinProvider'));
    await expect(wallet.contractCall(call())).rejects.toThrow(/refused|cancelled/);
    expect(calls.filter((c) => c.method === 'stx_callContract')).toHaveLength(1);
  });

  it('deploy sends Clarity 4 source with the account check', async () => {
    const calls = xverse();
    await wallet.connect('testnet' as any, choose('XverseProviders.BitcoinProvider')).catch(() => null);
    await wallet.connect('mainnet', choose('XverseProviders.BitcoinProvider'));
    await wallet.deployContract({ contractName: 'helper', codeBody: '(define-read-only (x) (ok u1))', clarityVersion: 4, network: 'mainnet', stxAddress: ADDR });
    expect(calls.at(-1)).toEqual({ method: 'stx_deployContract', params: { name: 'helper', clarityCode: '(define-read-only (x) (ok u1))', clarityVersion: 4, network: 'mainnet', address: ADDR, sponsored: false, postConditionMode: 'deny' } });
  });
});

describe('Leather', () => {
  it('connects with getAddresses and signs with the full request shape', async () => {
    const calls = install('LeatherProvider', (method) => {
      if (method === 'supportedMethods') return { result: { methods: [{ name: 'x' }] } };
      if (method === 'getAddresses') return { result: { addresses: [{ symbol: 'BTC', address: 'bc1q' }, { symbol: 'STX', address: ADDR, publicKey: `03${'22'.repeat(32)}` }] } };
      if (method === 'stx_callContract') return { result: { txid: TXID.slice(2) } };
      return { result: null };
    });
    const result = await wallet.connect('mainnet', choose('LeatherProvider'));
    expect(result).toMatchObject({ isConnected: true, address: ADDR });
    expect(calls.map((c) => c.method)).toEqual(['supportedMethods', 'getAddresses']);
    const tx = await wallet.contractCall(call());
    expect(tx.txId).toBe(TXID);
    expect(calls.at(-1)!.params).toMatchObject({ address: ADDR, network: 'mainnet', sponsored: false });
    expect(calls.at(-1)!.params).not.toHaveProperty('sender');
  });
});
