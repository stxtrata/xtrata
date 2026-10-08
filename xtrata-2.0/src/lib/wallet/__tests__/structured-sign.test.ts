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

describe('requestStructuredSignature', () => {
  it('Leather: signs through request("stx_signStructuredMessage") and never touches the legacy bridge', async () => {
    const request = vi.fn().mockResolvedValue({ jsonrpc: '2.0', id: '1', result: { signature: SIG, publicKey: '02' } });
    const legacy = vi.fn();
    mocks.provider.mockReturnValue({ request, structuredDataSignatureRequest: legacy });
    await expect(requestStructuredSignature(params)).resolves.toBe(SIG);
    expect(request).toHaveBeenCalledWith('stx_signStructuredMessage', { message: cvToHex(message), domain: cvToHex(domain) });
    expect(legacy).not.toHaveBeenCalled();
  });

  it('accepts a bare result as well as a JSON-RPC envelope', async () => {
    mocks.provider.mockReturnValue({ request: vi.fn().mockResolvedValue({ signature: SIG }) });
    await expect(requestStructuredSignature(params)).resolves.toBe(SIG);
  });

  it('older Leather without the RPC method falls back to the legacy bridge', async () => {
    const request = vi.fn().mockRejectedValue(Object.assign(new Error('Method not found'), { code: -32601 }));
    const legacy = vi.fn().mockResolvedValue({ signature: SIG });
    mocks.provider.mockReturnValue({ request, structuredDataSignatureRequest: legacy });
    await expect(requestStructuredSignature(params)).resolves.toBe(SIG);
    expect(request).toHaveBeenCalledOnce();
    expect(legacy).toHaveBeenCalledOnce();
  });

  it('a Leather build with only the legacy bridge still works', async () => {
    const legacy = vi.fn().mockResolvedValue({ signature: SIG });
    mocks.provider.mockReturnValue({ structuredDataSignatureRequest: legacy });
    await expect(requestStructuredSignature(params)).resolves.toBe(SIG);
    expect(legacy).toHaveBeenCalledOnce();
  });

  it('does not re-prompt through the legacy bridge when the user cancels or the wallet errors', async () => {
    const legacy = vi.fn();
    mocks.provider.mockReturnValue({
      request: vi.fn().mockRejectedValue(Object.assign(new Error('User rejected the request'), { code: 4001 })),
      structuredDataSignatureRequest: legacy
    });
    await expect(requestStructuredSignature(params)).rejects.toThrow('User rejected');
    expect(legacy).not.toHaveBeenCalled();
  });

  it('surfaces a JSON-RPC error envelope as an error', async () => {
    mocks.provider.mockReturnValue({ request: vi.fn().mockResolvedValue({ error: { code: 4001, message: 'Denied by user' } }) });
    await expect(requestStructuredSignature(params)).rejects.toThrow('Denied by user');
  });

  it('Xverse keeps its Stacks bridge and does not use request()', async () => {
    mocks.id.mockReturnValue('XverseProviders.BitcoinProvider');
    const request = vi.fn();
    mocks.provider.mockReturnValue({ request });
    const legacy = vi.fn().mockResolvedValue({ signature: SIG });
    vi.stubGlobal('XverseProviders', { StacksProvider: { structuredDataSignatureRequest: legacy } });
    await expect(requestStructuredSignature(params)).resolves.toBe(SIG);
    expect(request).not.toHaveBeenCalled();
  });

  it('says so plainly when the wallet can sign neither way', async () => {
    mocks.provider.mockReturnValue({});
    await expect(requestStructuredSignature(params)).rejects.toThrow('cannot sign messages');
  });
});
