import { describe, expect, it } from 'vitest';
import { StacksMainnet } from '@stacks/network';
import {
  ClarityType,
  bufferCV,
  listCV,
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
  buildMintSingleTxWithRelationshipsCall,
  buildSealInscriptionBatchCall,
  buildSealWithRelationshipsCall,
  buildTransferCall,
  createXtrataClient
} from '../client';
import type { ReadOnlyCaller, ReadOnlyCallOptions } from '../client';

describe('xtrata contract client', () => {
  const V2_CONTRACT = {
    ...DEFAULT_CONTRACT,
    contractName: 'xtrata-v2-1-0'
  };
  const V3_CONTRACT = {
    ...DEFAULT_CONTRACT,
    contractName: 'xtrata-v3-2-3'
  };

  it('calls get-last-token-id with correct args', async () => {
    const calls: ReadOnlyCallOptions[] = [];
    const caller: ReadOnlyCaller = {
      callReadOnly: async (options) => {
        calls.push(options);
        return responseOkCV(uintCV(5));
      }
    };

    const client = createXtrataClient({
      contract: DEFAULT_CONTRACT,
      caller
    });

    const value = await client.getLastTokenId(
      'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B'
    );

    expect(value).toBe(5n);
    expect(calls).toHaveLength(1);
    expect(calls[0].functionName).toBe('get-last-token-id');
    expect(calls[0].functionArgs).toHaveLength(0);
    expect(calls[0].network.coreApiUrl).toContain('mainnet');
  });

  it('parses inscription meta', async () => {
    const calls: ReadOnlyCallOptions[] = [];
    const finalHash = new Uint8Array(32).fill(2);
    const metaTuple = tupleCV({
      owner: standardPrincipalCV('SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B'),
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

    const client = createXtrataClient({
      contract: DEFAULT_CONTRACT,
      caller
    });

    const meta = await client.getInscriptionMeta(
      1n,
      'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B'
    );

    expect(meta?.mimeType).toBe('image/png');
    expect(meta?.finalHash).toEqual(finalHash);
    expect(calls[0].functionName).toBe('get-inscription-meta');
  });

  it('builds transfer call options', () => {
    const options = buildTransferCall({
      contract: DEFAULT_CONTRACT,
      network: new StacksMainnet(),
      id: 10n,
      sender: 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B',
      recipient: 'SPD60B1MGZVZR8758E86SR364N95VSP13E5FHYXE'
    });

    expect(options.functionName).toBe('transfer');
    expect(options.functionArgs).toHaveLength(3);
    expect(options.functionArgs[0].type).toBe(ClarityType.UInt);
    expect(options.functionArgs[1].type).toBe(ClarityType.PrincipalStandard);
    expect(options.functionArgs[2].type).toBe(ClarityType.PrincipalStandard);
  });

  it('builds seal-inscription-batch call options', () => {
    const hashA = new Uint8Array(32).fill(1);
    const hashB = new Uint8Array(32).fill(2);
    const options = buildSealInscriptionBatchCall({
      contract: DEFAULT_CONTRACT,
      network: new StacksMainnet(),
      items: [
        { expectedHash: hashA, tokenUri: 'ipfs://xtrata/a' },
        { expectedHash: hashB, tokenUri: 'ipfs://xtrata/b' }
      ]
    });

    expect(options.functionName).toBe('seal-inscription-batch');
    expect(options.functionArgs).toHaveLength(1);
    expect(options.functionArgs[0].type).toBe(ClarityType.List);
  });

  it('builds relationship seal call options', () => {
    const hash = new Uint8Array(32).fill(7);
    const options = buildSealWithRelationshipsCall({
      contract: V3_CONTRACT,
      network: new StacksMainnet(),
      expectedHash: hash,
      tokenUri: 'ipfs://xtrata/child',
      dependencies: [2n],
      parents: [1n, 3n]
    });

    expect(options.functionName).toBe('seal-with-relationships');
    expect(options.functionArgs).toHaveLength(4);
    expect(options.functionArgs[2].type).toBe(ClarityType.List);
    expect(options.functionArgs[3].type).toBe(ClarityType.List);
  });

  it('builds relationship single-tx call options', () => {
    const hash = new Uint8Array(32).fill(8);
    const options = buildMintSingleTxWithRelationshipsCall({
      contract: V3_CONTRACT,
      network: new StacksMainnet(),
      expectedHash: hash,
      mime: 'text/plain',
      totalSize: 5n,
      chunks: [new Uint8Array([1, 2, 3, 4, 5])],
      tokenUri: 'ipfs://xtrata/child',
      dependencies: [2n],
      parents: [1n]
    });

    expect(options.functionName).toBe('mint-single-tx-with-relationships');
    expect(options.functionArgs).toHaveLength(7);
    expect(options.functionArgs[5].type).toBe(ClarityType.List);
    expect(options.functionArgs[6].type).toBe(ClarityType.List);
  });

  it('calls minted index readers for v2 contracts', async () => {
    const calls: ReadOnlyCallOptions[] = [];
    const caller: ReadOnlyCaller = {
      callReadOnly: async (options) => {
        calls.push(options);
        if (options.functionName === 'get-minted-count') {
          return responseOkCV(uintCV(7));
        }
        if (options.functionName === 'get-minted-id') {
          return someCV(uintCV(3));
        }
        throw new Error(`Unexpected function: ${options.functionName}`);
      }
    };
    const client = createXtrataClient({
      contract: V2_CONTRACT,
      caller
    });

    const count = await client.getMintedCount(
      'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B'
    );
    const tokenId = await client.getMintedId(
      1n,
      'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B'
    );

    expect(client.supportsMintedIndex).toBe(true);
    expect(count).toBe(7n);
    expect(tokenId).toBe(3n);
    expect(calls.map((call) => call.functionName)).toEqual([
      'get-minted-count',
      'get-minted-id'
    ]);
  });

  it('calls relationship reader for v3 contracts', async () => {
    const calls: ReadOnlyCallOptions[] = [];
    const caller: ReadOnlyCaller = {
      callReadOnly: async (options) => {
        calls.push(options);
        return listCV([uintCV(1), uintCV(2)]);
      }
    };
    const client = createXtrataClient({
      contract: V3_CONTRACT,
      caller
    });

    const parents = await client.getParents(
      9n,
      'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B'
    );

    expect(parents).toEqual([1n, 2n]);
    expect(calls[0].functionName).toBe('get-parents');
    expect(calls[0].functionArgs[0].type).toBe(ClarityType.UInt);
  });
});
