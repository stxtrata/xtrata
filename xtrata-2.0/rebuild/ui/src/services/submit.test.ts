import { describe, expect, it, vi } from 'vitest';
import { Cl, PostConditionMode, hexToCV, postConditionToHex, Pc } from '@stacks/transactions';
import {
  CollectionTxBuilder,
  flatFeeSchedule,
  XtrataClientError,
  type TxDescriptor
} from '@xtrata/collections-client';
import { createSubmitService, toWalletCallParams } from './submit';

const SENDER = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const COLLECTION = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.my-collection-v1';
const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const HASH = 'a'.repeat(64);

const builder = new CollectionTxBuilder({
  collectionContractId: COLLECTION,
  coreContractId: CORE,
  network: 'mainnet',
  sender: SENDER,
  fees: flatFeeSchedule({
    beginFee: 3_000n,
    perChunkFee: 1_500n,
    sealBaseFee: 2_000n,
    mintPrice: 1_000_000n
  })
});

describe('toWalletCallParams — TxDescriptor → wallet call', () => {
  it('carries contract, function and network through unchanged', () => {
    const tx = builder.reserve({ contentHashHex: HASH });
    const params = toWalletCallParams(tx, { stxAddress: SENDER });

    expect(params.contractAddress).toBe('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7');
    expect(params.contractName).toBe('my-collection-v1');
    expect(params.functionName).toBe('reserve');
    expect(params.network).toBe('mainnet');
    expect(params.stxAddress).toBe(SENDER);
  });

  it('serializes every Clarity argument to hex that round-trips to the same value', () => {
    const tx = builder.mintBegin({
      contentHashHex: HASH,
      mimeType: 'image/png',
      totalSize: 40_000,
      totalChunks: 3
    });
    const params = toWalletCallParams(tx);

    expect(params.functionArgs).toHaveLength(tx.functionArgs.length);
    for (const arg of params.functionArgs) {
      expect(arg).toMatch(/^0x[0-9a-f]+$/);
    }
    // Round-trip: the wallet receives exactly the values the builder produced.
    expect(params.functionArgs.map((hex) => hexToCV(hex))).toEqual(tx.functionArgs);
    // ... including the mime type and the chunk count, positionally.
    expect(hexToCV(params.functionArgs[2]!)).toEqual(Cl.stringAscii('image/png'));
    expect(hexToCV(params.functionArgs[4]!)).toEqual(Cl.uint(3));
  });

  it('forwards the spend-cap post-conditions, serialized', () => {
    const tx = builder.mintBegin({
      contentHashHex: HASH,
      mimeType: 'image/png',
      totalSize: 40_000,
      totalChunks: 3
    });
    const params = toWalletCallParams(tx);

    expect(tx.postConditions).toHaveLength(1);
    expect(params.postConditions).toEqual([postConditionToHex(tx.postConditions[0]!)]);
    // The cap is the begin fee, not an unbounded allowance.
    expect(tx.postConditions[0]).toMatchObject({
      type: 'stx-postcondition',
      address: SENDER,
      condition: 'lte',
      amount: '3000'
    });
  });

  it('keeps a zero-spend post-condition on non-spending calls (never an empty list)', () => {
    const tx = builder.cancelReservation(HASH);
    const params = toWalletCallParams(tx);

    expect(params.postConditions).toHaveLength(1);
    expect(tx.postConditions[0]).toMatchObject({ condition: 'lte', amount: '0' });
  });

  it('caps a seal at the seal fee plus the mint price', () => {
    const tx = builder.mintSeal({ contentHashHex: HASH, chunkCount: 3 });
    expect(tx.postConditions[0]).toMatchObject({ amount: String(2_000n + 1_000_000n) });
    expect(toWalletCallParams(tx).postConditions).toHaveLength(1);
  });

  it('always sends deny mode', () => {
    const params = toWalletCallParams(builder.reserve({ contentHashHex: HASH }));
    expect(params.postConditionMode).toBe(PostConditionMode.Deny);
  });

  it('refuses to submit anything that is not deny mode', () => {
    const tampered = {
      ...builder.reserve({ contentHashHex: HASH }),
      postConditionMode: 'allow'
    } as unknown as TxDescriptor;

    expect(() => toWalletCallParams(tampered)).toThrow(XtrataClientError);
    expect(() => toWalletCallParams(tampered)).toThrow(/only deny mode/);
  });

  it('refuses to submit a descriptor with no post-condition list', () => {
    const tampered = {
      ...builder.reserve({ contentHashHex: HASH }),
      postConditions: undefined
    } as unknown as TxDescriptor;

    expect(() => toWalletCallParams(tampered)).toThrow(/no post-condition list/);
  });

  it('serializes a chunk batch without mutating the descriptor', () => {
    const chunks = [new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6])];
    const tx = builder.mintAddChunkBatch({ contentHashHex: HASH, chunks });
    const before = JSON.stringify(tx.functionArgs, (_k, v) =>
      typeof v === 'bigint' ? v.toString() : v
    );
    toWalletCallParams(tx);
    const after = JSON.stringify(tx.functionArgs, (_k, v) =>
      typeof v === 'bigint' ? v.toString() : v
    );
    expect(after).toBe(before);
  });
});

describe('createSubmitService', () => {
  const tx = builder.reserve({ contentHashHex: HASH });

  it('resolves with a 0x-prefixed txid from onFinish', async () => {
    const showContractCallImpl = vi.fn((options: { onFinish?: (p: { txId: string }) => void }) => {
      options.onFinish?.({ txId: 'ab'.repeat(32) });
    });
    const submit = createSubmitService({
      stxAddress: SENDER,
      showContractCallImpl: showContractCallImpl as never
    });

    await expect(submit(tx)).resolves.toEqual({ txid: `0x${'ab'.repeat(32)}` });
    expect(showContractCallImpl).toHaveBeenCalledTimes(1);
  });

  it('accepts the txid under either spelling and does not double-prefix', async () => {
    const submit = createSubmitService({
      showContractCallImpl: ((options: { onFinish?: (p: { txid: string }) => void }) => {
        options.onFinish?.({ txid: `0x${'cd'.repeat(32)}` });
      }) as never
    });
    await expect(submit(tx)).resolves.toEqual({ txid: `0x${'cd'.repeat(32)}` });
  });

  it('maps wallet cancellation onto the retryable wallet-rejected code', async () => {
    const submit = createSubmitService({
      showContractCallImpl: ((options: { onCancel?: () => void }) => {
        options.onCancel?.();
      }) as never
    });

    await expect(submit(tx)).rejects.toMatchObject({
      code: 'wallet-rejected',
      retryable: true
    });
  });

  it('maps a wallet error onto broadcast-failed', async () => {
    const submit = createSubmitService({
      showContractCallImpl: ((options: { onError?: (e: unknown) => void }) => {
        options.onError?.(new Error('provider exploded'));
      }) as never
    });

    await expect(submit(tx)).rejects.toMatchObject({
      code: 'broadcast-failed',
      retryable: true
    });
  });

  it('settles once even if the wallet fires several callbacks', async () => {
    const submit = createSubmitService({
      showContractCallImpl: ((options: {
        onFinish?: (p: { txId: string }) => void;
        onCancel?: () => void;
      }) => {
        options.onFinish?.({ txId: 'ef'.repeat(32) });
        options.onCancel?.();
        options.onFinish?.({ txId: '00'.repeat(32) });
      }) as never
    });

    await expect(submit(tx)).resolves.toEqual({ txid: `0x${'ef'.repeat(32)}` });
  });

  it('fails loudly when the wallet returns no txid', async () => {
    const submit = createSubmitService({
      showContractCallImpl: ((options: { onFinish?: (p: Record<string, never>) => void }) => {
        options.onFinish?.({});
      }) as never
    });

    await expect(submit(tx)).rejects.toMatchObject({ code: 'broadcast-failed' });
  });

  it('rejects before touching the wallet when the descriptor is not deny mode', async () => {
    const showContractCallImpl = vi.fn();
    const submit = createSubmitService({ showContractCallImpl: showContractCallImpl as never });
    const tampered = { ...tx, postConditionMode: 'allow' } as unknown as TxDescriptor;

    await expect(submit(tampered)).rejects.toThrow(/only deny mode/);
    expect(showContractCallImpl).not.toHaveBeenCalled();
  });

  it('produces the same hex the wallet layer would have produced itself', () => {
    const pc = Pc.principal(SENDER).willSendLte(3_000n).ustx();
    expect(postConditionToHex(pc)).toBe(
      postConditionToHex(
        builder.mintBegin({
          contentHashHex: HASH,
          mimeType: 'image/png',
          totalSize: 1,
          totalChunks: 1
        }).postConditions[0]!
      )
    );
  });
});
