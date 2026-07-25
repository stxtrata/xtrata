import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  bufferCV,
  cvToHex,
  noneCV,
  responseErrorCV,
  responseOkCV,
  someCV,
  tupleCV,
  uintCV
} from '@stacks/transactions';
import { parsePrimaryNameResult, resolvePrimaryBnsName } from '../primary';

const ADDRESS = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7';

const asciiBuffer = (value: string) =>
  bufferCV(Uint8Array.from(value, (char) => char.charCodeAt(0)));

const primaryHex = (name: string, namespace: string) =>
  cvToHex(
    responseOkCV(
      someCV(
        tupleCV({
          name: asciiBuffer(name),
          namespace: asciiBuffer(namespace)
        })
      )
    )
  );

const okResponse = (result: string) => ({
  ok: true,
  status: 200,
  json: async () => ({ okay: true, result })
});

describe('parsePrimaryNameResult', () => {
  it('decodes a name/namespace tuple', () => {
    expect(parsePrimaryNameResult(primaryHex('jim', 'btc'))).toBe('jim.btc');
    expect(parsePrimaryNameResult(primaryHex('jim', 'boom'))).toBe('jim.boom');
  });

  it('returns null when the wallet has no primary', () => {
    expect(parsePrimaryNameResult(cvToHex(responseOkCV(noneCV())))).toBeNull();
  });

  it('returns null for an error response or an unexpected shape', () => {
    expect(
      parsePrimaryNameResult(cvToHex(responseErrorCV(uintCV(1))))
    ).toBeNull();
    expect(parsePrimaryNameResult(cvToHex(uintCV(56554)))).toBeNull();
    expect(parsePrimaryNameResult('not-hex')).toBeNull();
  });

  it('rejects buffers that are not ascii labels', () => {
    const hex = cvToHex(
      responseOkCV(
        someCV(
          tupleCV({
            name: bufferCV(Uint8Array.from([0x00, 0xff])),
            namespace: asciiBuffer('btc')
          })
        )
      )
    );
    expect(parsePrimaryNameResult(hex)).toBeNull();
  });
});

describe('resolvePrimaryBnsName', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('reads the primary name from the BNS-V2 registry', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(okResponse(primaryHex('zed', 'btc')));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(
      resolvePrimaryBnsName({ address: ADDRESS, network: 'mainnet' })
    ).resolves.toBe('zed.btc');

    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain(
      '/v2/contracts/call-read/SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF/BNS-V2/get-primary'
    );
    expect(JSON.parse(String(init.body)).sender).toBe(ADDRESS);
  });

  it('returns null instead of throwing when the node is unreachable', async () => {
    globalThis.fetch = vi
      .fn()
      .mockRejectedValue(new Error('Failed to fetch')) as unknown as typeof fetch;

    await expect(
      resolvePrimaryBnsName({ address: ADDRESS, network: 'mainnet' })
    ).resolves.toBeNull();
  });

  it('skips the call for invalid addresses and networks with no deployment', async () => {
    const fetchMock = vi.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(
      resolvePrimaryBnsName({ address: 'nope', network: 'mainnet' })
    ).resolves.toBeNull();
    await expect(
      resolvePrimaryBnsName({ address: ADDRESS, network: 'testnet' })
    ).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
