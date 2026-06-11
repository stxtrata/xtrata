import { describe, expect, it } from 'vitest';
import {
  bufferCV,
  contractPrincipalCV,
  falseCV,
  listCV,
  noneCV,
  responseErrorCV,
  responseOkCV,
  someCV,
  standardPrincipalCV,
  stringAsciiCV,
  trueCV,
  tupleCV,
  uintCV
} from '@stacks/transactions';
import {
  parseGetChunk,
  parseGetChunkBatch,
  parseGetBeginFeeUnit,
  parseGetContractInfo,
  parseGetDependencies,
  parseGetAdmin,
  parseGetFeeUnit,
  parseGetInscriptionMeta,
  parseGetIdByHash,
  parseGetMigrationSource,
  parseGetLastTokenId,
  parseGetMintedCount,
  parseGetMintedId,
  parseGetNextTokenId,
  parseGetOwner,
  parseGetParents,
  parseGetPendingChunk,
  parseGetRoyaltyRecipient,
  parseGetSealFeeUnit,
  parseGetSingleTxFeeUnit,
  parseGetUploadBatchFeeUnit,
  parseGetUploadChunkFeeUnit,
  parseIsPaused,
  parseIsAllowedCaller,
  parseGetSvgDataUri,
  parseGetTokenUri,
  parseGetUploadState
} from '../parsers';
import { ContractCallError } from '../types';

describe('contract parsers', () => {
  it('parses last token id', () => {
    const value = responseOkCV(uintCV(12));
    expect(parseGetLastTokenId(value)).toBe(12n);
  });

  it('parses fee unit', () => {
    const value = responseOkCV(uintCV(100000));
    expect(parseGetFeeUnit(value)).toBe(100000n);
  });

  it('parses v3.2.3 fee unit readers', () => {
    expect(parseGetBeginFeeUnit(responseOkCV(uintCV(100000)))).toBe(100000n);
    expect(parseGetUploadChunkFeeUnit(responseOkCV(uintCV(2000)))).toBe(2000n);
    expect(parseGetUploadBatchFeeUnit(responseOkCV(uintCV(100000)))).toBe(100000n);
    expect(parseGetSealFeeUnit(responseOkCV(uintCV(100000)))).toBe(100000n);
    expect(parseGetSingleTxFeeUnit(responseOkCV(uintCV(100000)))).toBe(100000n);
  });

  it('parses v3.2.3 contract info', () => {
    const info = parseGetContractInfo(
      responseOkCV(
        tupleCV({
          version: stringAsciiCV('xtrata-v3.2.3'),
          'chunk-size': uintCV(16384),
          'upload-batch-limit': uintCV(32),
          'upload-payload-limit': uintCV(524288),
          'single-tx-chunk-limit': uintCV(32),
          'single-tx-payload-limit': uintCV(524288),
          'general-list-limit': uintCV(50),
          'seal-batch-limit': uintCV(50),
          'max-total-chunks': uintCV(256),
          'max-total-size': uintCV(4194304)
        })
      )
    );
    expect(info.version).toBe('xtrata-v3.2.3');
    expect(info.chunkSize).toBe(16384n);
    expect(info.generalListLimit).toBe(50n);
    expect(info.maxTotalSize).toBe(4194304n);
  });

  it('parses next token id', () => {
    const value = responseOkCV(uintCV(7));
    expect(parseGetNextTokenId(value)).toBe(7n);
  });

  it('parses minted index readers', () => {
    expect(parseGetMintedCount(responseOkCV(uintCV(25)))).toBe(25n);
    expect(parseGetMintedId(someCV(uintCV(42)))).toBe(42n);
    expect(parseGetMintedId(noneCV())).toBeNull();
  });

  it('parses admin and royalty recipients', () => {
    const principal = standardPrincipalCV('SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B');
    expect(parseGetAdmin(responseOkCV(principal))).toBe(
      'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B'
    );
    expect(parseGetRoyaltyRecipient(responseOkCV(principal))).toBe(
      'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B'
    );
  });

  it('parses pause status', () => {
    const value = responseOkCV(trueCV());
    expect(parseIsPaused(value)).toBe(true);
  });

  it('parses allowed caller status', () => {
    expect(parseIsAllowedCaller(responseOkCV(falseCV()))).toBe(false);
  });

  it('parses token uri option', () => {
    const some = responseOkCV(someCV(stringAsciiCV('ipfs://token')));
    expect(parseGetTokenUri(some)).toBe('ipfs://token');

    const none = responseOkCV(noneCV());
    expect(parseGetTokenUri(none)).toBeNull();
  });

  it('parses owner option', () => {
    const principal = standardPrincipalCV('SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B');
    const value = responseOkCV(someCV(principal));
    expect(parseGetOwner(value)).toBe('SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B');
  });

  it('parses inscription meta tuple', () => {
    const finalHash = new Uint8Array(32).fill(9);
    const tuple = tupleCV({
      owner: standardPrincipalCV('SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B'),
      creator: standardPrincipalCV('SPD60B1MGZVZR8758E86SR364N95VSP13E5FHYXE'),
      'mime-type': stringAsciiCV('image/png'),
      'total-size': uintCV(8192),
      'total-chunks': uintCV(4),
      sealed: trueCV(),
      'final-hash': bufferCV(finalHash)
    });

    const parsed = parseGetInscriptionMeta(someCV(tuple));
    expect(parsed).not.toBeNull();
    if (!parsed) {
      throw new Error('Expected meta');
    }
    expect(parsed.owner).toBe('SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B');
    expect(parsed.creator).toBe('SPD60B1MGZVZR8758E86SR364N95VSP13E5FHYXE');
    expect(parsed.mimeType).toBe('image/png');
    expect(parsed.totalSize).toBe(8192n);
    expect(parsed.totalChunks).toBe(4n);
    expect(parsed.sealed).toBe(true);
    expect(parsed.finalHash).toEqual(finalHash);
  });

  it('parses inscription meta tuple without total chunks', () => {
    const finalHash = new Uint8Array(32).fill(4);
    const tuple = tupleCV({
      owner: standardPrincipalCV('SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B'),
      'mime-type': stringAsciiCV('text/plain'),
      'total-size': uintCV(16385),
      sealed: trueCV(),
      'final-hash': bufferCV(finalHash)
    });

    const parsed = parseGetInscriptionMeta(someCV(tuple));
    expect(parsed).not.toBeNull();
    if (!parsed) {
      throw new Error('Expected meta');
    }
    expect(parsed.totalChunks).toBe(2n);
    expect(parsed.creator).toBeNull();
  });

  it('parses dependencies list', () => {
    const list = listCV([uintCV(1), uintCV(2), uintCV(99)]);
    expect(parseGetDependencies(list)).toEqual([1n, 2n, 99n]);
  });

  it('parses empty dependency list', () => {
    const list = listCV([]);
    expect(parseGetDependencies(list)).toEqual([]);
  });

  it('parses parents list', () => {
    const list = listCV([uintCV(4), uintCV(8)]);
    expect(parseGetParents(list)).toEqual([4n, 8n]);
  });

  it('parses migration source option', () => {
    const parsed = parseGetMigrationSource(
      someCV(
        tupleCV({
          contract: contractPrincipalCV(
            'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B',
            'xtrata-v2-1-0'
          ),
          'token-id': uintCV(19)
        })
      )
    );
    expect(parsed).toEqual({
      contract: 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B.xtrata-v2-1-0',
      tokenId: 19n
    });
    expect(parseGetMigrationSource(noneCV())).toBeNull();
  });

  it('parses large dependency ids', () => {
    const largeId = 9_007_199_254_740_991n;
    const list = listCV([uintCV(0), uintCV(largeId)]);
    expect(parseGetDependencies(list)).toEqual([0n, largeId]);
  });

  it('rejects invalid dependency list entries', () => {
    const list = listCV([trueCV()]);
    expect(() => parseGetDependencies(list)).toThrow();
  });

  it('parses upload state tuple', () => {
    const runningHash = new Uint8Array(32).fill(1);
    const tuple = tupleCV({
      'mime-type': stringAsciiCV('image/webp'),
      'total-size': uintCV(1024),
      'total-chunks': uintCV(2),
      'current-index': uintCV(1),
      'running-hash': bufferCV(runningHash)
    });

    const parsed = parseGetUploadState(someCV(tuple));
    expect(parsed).not.toBeNull();
    if (!parsed) {
      throw new Error('Expected upload state');
    }
    expect(parsed.mimeType).toBe('image/webp');
    expect(parsed.totalSize).toBe(1024n);
    expect(parsed.totalChunks).toBe(2n);
    expect(parsed.currentIndex).toBe(1n);
    expect(parsed.runningHash).toEqual(runningHash);
  });

  it('parses get-id-by-hash option', () => {
    expect(parseGetIdByHash(someCV(uintCV(42)))).toBe(42n);
    expect(parseGetIdByHash(noneCV())).toBeNull();
  });

  it('parses optional chunks', () => {
    const buffer = new Uint8Array([1, 2, 3]);
    expect(parseGetChunk(someCV(bufferCV(buffer)))).toEqual(buffer);
    expect(parseGetPendingChunk(noneCV())).toBeNull();
  });

  it('parses chunk batch lists', () => {
    const first = new Uint8Array([7, 8]);
    const second = new Uint8Array([9]);
    const list = listCV([
      someCV(bufferCV(first)),
      noneCV(),
      someCV(bufferCV(second))
    ]);
    expect(parseGetChunkBatch(list)).toEqual([first, null, second]);
  });

  it('parses svg data uri', () => {
    const value = responseOkCV(someCV(stringAsciiCV('data:image/svg+xml;base64,AA==')));
    expect(parseGetSvgDataUri(value)).toBe('data:image/svg+xml;base64,AA==');
  });

  it('maps contract errors from responses', () => {
    const value = responseErrorCV(uintCV(100));
    try {
      parseGetLastTokenId(value);
      throw new Error('Expected parse failure');
    } catch (error) {
      if (error instanceof ContractCallError) {
        expect(error.code).toBe(100n);
        expect(error.errorName).toBe('ERR_NOT_AUTHORIZED');
        return;
      }
      throw error;
    }
  });

  it('maps paused errors from responses', () => {
    const value = responseErrorCV(uintCV(109));
    try {
      parseGetLastTokenId(value);
      throw new Error('Expected parse failure');
    } catch (error) {
      if (error instanceof ContractCallError) {
        expect(error.code).toBe(109n);
        expect(error.errorName).toBe('ERR_PAUSED');
        return;
      }
      throw error;
    }
  });
});
