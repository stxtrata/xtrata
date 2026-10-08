// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cvToHex, stringAsciiCV, tupleCV, uintCV } from '@stacks/transactions';

const mocks = vi.hoisted(() => ({ id: vi.fn(), provider: vi.fn() }));
vi.mock('../connect', () => ({
  getSelectedWalletProviderId: mocks.id,
  getStacksProvider: mocks.provider
}));

import { requestStructuredSignature } from '../structured-sign';

const domain = tupleCV({ name: stringAsciiCV('Xtrata'), version: stringAsciiCV('1'), 'chain-id': uintCV(1) });
const message = tupleCV({ handle: stringAsciiCV('jim') });
const params = { domain, message, network: 'mainnet' as const, stxAddress: 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7' };
const SIG = 'ab'.repeat(65);

beforeEach(() => {
  vi.clearAllMocks();
  mocks.id.mockReturnValue('LeatherProvider');
});
afterEach(() => vi.unstubAllGlobals());

const LEGACY_GONE = 'This legacy method is no longer supported. Upgrade to the LeatherProvider.request() RPC API, see https://leather.gitbook.io/developers';
const rpcOk = () => vi.fn().mockResolvedValue({ jsonrpc: '2.0', id: '1', result: { signature: SIG, publicKey: '02' } });

describe('requestStructuredSignature', () => {
  it('a wallet that signs through the legacy bridge today keeps doing exactly that (request() never called)', async () => {
    const request = rpcOk();
    const legacy = vi.fn().mockResolvedValue({ signature: SIG });
    mocks.provider.mockReturnValue({ request, structuredDataSignatureRequest: legacy });
    await expect(requestStructuredSignature(params)).resolves.toBe(SIG);
    expect(legacy).toHaveBeenCalledOnce();
    expect(request).not.toHaveBeenCalled();
  });

  it('a Leather build with only the legacy bridge still works', async () => {
    const legacy = vi.fn().mockResolvedValue({ signature: SIG });
    mocks.provider.mockReturnValue({ structuredDataSignatureRequest: legacy });
    await expect(requestStructuredSignature(params)).resolves.toBe(SIG);
  });

  it('new Leather: the legacy-removed answer moves the request to request("stx_signStructuredMessage")', async () => {
    const request = rpcOk();
    const legacy = vi.fn().mockRejectedValue(new Error(LEGACY_GONE));
    mocks.provider.mockReturnValue({ request, structuredDataSignatureRequest: legacy });
    await expect(requestStructuredSignature(params)).resolves.toBe(SIG);
    expect(legacy).toHaveBeenCalledOnce();
    expect(request).toHaveBeenCalledWith('stx_signStructuredMessage', { message: cvToHex(message).replace(/^0x/, ''), domain: cvToHex(domain).replace(/^0x/, '') });
  });

  it('new Leather with the legacy bridge removed entirely goes straight to the RPC', async () => {
    const request = rpcOk();
    mocks.provider.mockReturnValue({ request });
    await expect(requestStructuredSignature(params)).resolves.toBe(SIG);
    expect(request).toHaveBeenCalledOnce();
  });

  it('accepts a bare result as well as a JSON-RPC envelope', async () => {
    mocks.provider.mockReturnValue({ request: vi.fn().mockResolvedValue({ signature: SIG }) });
    await expect(requestStructuredSignature(params)).resolves.toBe(SIG);
  });

  it('a user cancel on the legacy bridge is surfaced and never re-prompted through the RPC', async () => {
    const request = rpcOk();
    const legacy = vi.fn().mockRejectedValue(new Error('User rejected the request'));
    mocks.provider.mockReturnValue({ request, structuredDataSignatureRequest: legacy });
    await expect(requestStructuredSignature(params)).rejects.toThrow('User rejected');
    expect(request).not.toHaveBeenCalled();
  });

  it('a user cancel on the RPC is surfaced as is', async () => {
    mocks.provider.mockReturnValue({
      request: vi.fn().mockRejectedValue(Object.assign(new Error('User rejected the request'), { code: 4001 }))
    });
    await expect(requestStructuredSignature(params)).rejects.toThrow('User rejected');
  });

  it('surfaces a JSON-RPC error envelope as an error', async () => {
    mocks.provider.mockReturnValue({ request: vi.fn().mockResolvedValue({ error: { code: 4001, message: 'Denied by user' } }) });
    await expect(requestStructuredSignature(params)).rejects.toThrow('Denied by user');
  });

  it('Xverse keeps its Stacks bridge, never uses request(), and never moves to the RPC', async () => {
    mocks.id.mockReturnValue('XverseProviders.BitcoinProvider');
    const request = vi.fn();
    mocks.provider.mockReturnValue({ request });
    const legacy = vi.fn().mockResolvedValue({ signature: SIG });
    vi.stubGlobal('XverseProviders', { StacksProvider: { structuredDataSignatureRequest: legacy } });
    await expect(requestStructuredSignature(params)).resolves.toBe(SIG);
    expect(request).not.toHaveBeenCalled();
    legacy.mockRejectedValueOnce(new Error(LEGACY_GONE));
    await expect(requestStructuredSignature(params)).rejects.toThrow('no longer supported');
    expect(request).not.toHaveBeenCalled();
  });

  it('says so plainly when the wallet can sign neither way', async () => {
    mocks.provider.mockReturnValue({});
    await expect(requestStructuredSignature(params)).rejects.toThrow('cannot sign messages');
    mocks.provider.mockReturnValue({ request: vi.fn().mockRejectedValue(Object.assign(new Error('Method not found'), { code: -32601 })) });
    await expect(requestStructuredSignature(params)).rejects.toThrow('cannot sign messages');
  });
});
