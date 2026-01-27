import { describe, expect, it } from 'vitest';
import { StacksTestnet } from '@stacks/network';
import {
  ClarityType,
  bufferCV,
  responseOkCV,
  someCV,
  standardPrincipalCV,
  stringAsciiCV,
  trueCV,
  tupleCV,
  uintCV
} from '@stacks/transactions';
import { DEFAULT_CONTRACT } from '../config';
import {
  buildTransferCall,
  createXStrataClient
} from '../client';
import type { ReadOnlyCaller, ReadOnlyCallOptions } from '../client';

describe('xstrata contract client', () => {
  it('calls get-last-token-id with correct args', async () => {
    const calls: ReadOnlyCallOptions[] = [];
    const caller: ReadOnlyCaller = {
      callReadOnly: async (options) => {
        calls.push(options);
        return responseOkCV(uintCV(5));
      }
    };

    const client = createXStrataClient({
      contract: DEFAULT_CONTRACT,
      caller
    });

    const value = await client.getLastTokenId(
      'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA'
    );

    expect(value).toBe(5n);
    expect(calls).toHaveLength(1);
    expect(calls[0].functionName).toBe('get-last-token-id');
    expect(calls[0].functionArgs).toHaveLength(0);
    expect(calls[0].network.coreApiUrl).toContain('testnet');
  });

  it('parses inscription meta', async () => {
    const calls: ReadOnlyCallOptions[] = [];
    const finalHash = new Uint8Array(32).fill(2);
    const metaTuple = tupleCV({
      owner: standardPrincipalCV('ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA'),
      'mime-type': stringAsciiCV('image/png'),
      'total-size': uintCV(100),
      'total-chunks': uintCV(1),
      sealed: trueCV(),
      'final-hash': bufferCV(finalHash)
    });

    const caller: ReadOnlyCaller = {
      callReadOnly: async (options) => {
        calls.push(options);
        return someCV(metaTuple);
      }
    };

    const client = createXStrataClient({
      contract: DEFAULT_CONTRACT,
      caller
    });

    const meta = await client.getInscriptionMeta(
      1n,
      'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA'
    );

    expect(meta?.mimeType).toBe('image/png');
    expect(meta?.finalHash).toEqual(finalHash);
    expect(calls[0].functionName).toBe('get-inscription-meta');
  });

  it('builds transfer call options', () => {
    const options = buildTransferCall({
      contract: DEFAULT_CONTRACT,
      network: new StacksTestnet(),
      id: 10n,
      sender: 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA',
      recipient: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6'
    });

    expect(options.functionName).toBe('transfer');
    expect(options.functionArgs).toHaveLength(3);
    expect(options.functionArgs[0].type).toBe(ClarityType.UInt);
    expect(options.functionArgs[1].type).toBe(ClarityType.PrincipalStandard);
    expect(options.functionArgs[2].type).toBe(ClarityType.PrincipalStandard);
  });
});
