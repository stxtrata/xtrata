import { describe, expect, it } from 'vitest';
import {
  AnchorMode,
  FungibleConditionCode,
  PostConditionMode,
  getAddressFromPrivateKey,
  makeContractCall,
  makeStandardSTXPostCondition,
  stringAsciiCV,
  uintCV
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { __testing, isLeatherProviderId } from '../connect';

const ADDRESS = 'SP2MF04VAGYHGAZWGTEDW5VYCPDWWSY08Z1QFNDSN';
const SIGNER_KEY = 'f9d7f5e0d0d81fdd90dcef4e0e2c1b9e3ea361776a5cd91b5c9a52b98b3e1cb601';

describe('wallet connect helpers', () => {
  it('detects Leather provider ids', () => {
    expect(isLeatherProviderId('LeatherProvider')).toBe(true);
    expect(isLeatherProviderId('XverseProviders.StacksProvider')).toBe(false);
    expect(isLeatherProviderId(null)).toBe(false);
  });

  it('builds SIP-030 contract call params with serialized args and post conditions', () => {
    const params = __testing.buildContractCallParams({
      contractAddress: ADDRESS,
      contractName: 'xtrata-core',
      functionName: 'mint',
      functionArgs: [uintCV(42), stringAsciiCV('ok')],
      network: 'mainnet',
      stxAddress: ADDRESS,
      postConditionMode: PostConditionMode.Deny,
      postConditions: [
        makeStandardSTXPostCondition(
          ADDRESS,
          FungibleConditionCode.LessEqual,
          123n
        )
      ]
    });

    expect(params).toMatchObject({
      contract: `${ADDRESS}.xtrata-core`,
      functionName: 'mint',
      network: 'mainnet',
      address: ADDRESS,
      postConditionMode: 'deny'
    });
    expect(params.functionArgs).toHaveLength(2);
    expect(params.functionArgs[0]).toMatch(/^[0-9a-f]+$/);
    expect(params.postConditions?.[0]).toMatch(/^[0-9a-f]+$/);
  });

  it('sends an explicit zero origin fee for sponsored contract calls', () => {
    const params = __testing.buildContractCallParams({
      contractAddress: ADDRESS,
      contractName: 'xtrata-drops-v1-0',
      functionName: 'claim',
      functionArgs: [uintCV(0)],
      network: 'mainnet',
      stxAddress: ADDRESS,
      sponsored: true,
      fee: 0
    });

    expect(params).toMatchObject({
      address: ADDRESS,
      sponsored: true,
      fee: '0'
    });
  });

  it('requests sponsored wallet signing without broadcasting', () => {
    expect(__testing.buildSponsoredSignRequest('deadbeef')).toEqual({
      transaction: 'deadbeef',
      broadcast: false
    });
  });

  it('serializes bigint fees before sending legacy wallet contract calls', () => {
    const options = __testing.toLegacyContractCallOptions({
      contractAddress: ADDRESS,
      contractName: 'xtrata-core',
      functionName: 'add-chunk-batch',
      functionArgs: [uintCV(1)],
      network: 'mainnet',
      stxAddress: ADDRESS,
      fee: 625000n
    });

    expect(options.fee).toBe('625000');
    expect(options.sponsored).toBe(false);
  });

  it('builds SIP-030 STX transfer params for runtime wallet bridge requests', () => {
    const params = __testing.buildStxTransferParams({
      recipient: ADDRESS,
      amount: 10000n,
      memo: 'XB:14:315',
      network: 'mainnet',
      stxAddress: ADDRESS
    });

    expect(params).toMatchObject({
      recipient: ADDRESS,
      amount: '10000',
      memo: 'XB:14:315',
      network: 'mainnet',
      address: ADDRESS,
      sponsored: false
    });
  });

  it('normalizes tx ids from SIP-030 responses', () => {
    expect(__testing.normalizeTxResult({ txid: '0xabc123' })).toMatchObject({
      txId: '0xabc123',
      txid: '0xabc123'
    });
  });

  it('unwraps JSON-RPC transaction results returned by Leather-style request handlers', () => {
    expect(
      __testing.normalizeTxResult({
        jsonrpc: '2.0',
        id: '1',
        result: { txid: '0xdef456' }
      })
    ).toMatchObject({
      txId: '0xdef456',
      txid: '0xdef456'
    });
  });

  it('keeps non-standard wallet finish payloads available for callbacks', () => {
    expect(__testing.normalizeTxResultForCallback({ pending: true })).toEqual({
      pending: true
    });
  });

  it('extracts a stacks address from nested provider payloads', () => {
    expect(
      __testing.extractStacksAddress({
        result: {
          addresses: [{ address: ADDRESS }]
        }
      })
    ).toBe(ADDRESS);
  });

  it('normalizes Leather address responses with public keys', () => {
    expect(
      __testing.extractWalletAddressEntries({
        addresses: [{ symbol: 'STX', address: ADDRESS, publicKey: '02abc' }]
      })
    ).toEqual([{ symbol: 'STX', address: ADDRESS, publicKey: '02abc' }]);
    expect(
      __testing.toWalletSession({
        addresses: [{ symbol: 'STX', address: ADDRESS, publicKey: '02abc' }]
      })
    ).toMatchObject({ isConnected: true, address: ADDRESS, network: 'mainnet' });
  });

  it('normalizes Xverse account responses with public keys', () => {
    expect(
      __testing.extractWalletAddressEntries({
        result: {
          accounts: [{ address: ADDRESS, publicKey: '03def' }]
        }
      })
    ).toEqual([{ address: ADDRESS, publicKey: '03def' }]);
    expect(
      __testing.toWalletSession({ accounts: [{ address: ADDRESS, publicKey: '03def' }] })
    ).toMatchObject({ isConnected: true, address: ADDRESS, network: 'mainnet' });
  });

  it('preserves structured JSON-RPC wallet errors', () => {
    const error = { code: -32601, message: 'Method not found', data: { method: 'wallet_connect' } };
    expect(__testing.isMethodUnsupportedError(error)).toBe(true);
    expect(__testing.formatWalletError(error)).toBe('Method not found (code -32601)');
  });

  it('accepts only zero-fee sponsored transactions from the connected signer', async () => {
    const signerAddress = getAddressFromPrivateKey(SIGNER_KEY);
    const transaction = await makeContractCall({
      contractAddress: ADDRESS,
      contractName: 'xtrata-drops-v1-0',
      functionName: 'claim',
      functionArgs: [uintCV(0)],
      senderKey: SIGNER_KEY,
      network: new StacksMainnet(),
      fee: 0n,
      nonce: 0n,
      sponsored: true,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Deny,
      postConditions: []
    });
    const txHex = Buffer.from(transaction.serialize()).toString('hex');
    expect(__testing.validateSignedSponsoredTransaction(txHex, signerAddress)).toBe(txHex);
    expect(() =>
      __testing.validateSignedSponsoredTransaction(txHex, ADDRESS)
    ).toThrow('different account');

    const selfPaid = await makeContractCall({
      contractAddress: ADDRESS,
      contractName: 'xtrata-drops-v1-0',
      functionName: 'claim',
      functionArgs: [uintCV(0)],
      senderKey: SIGNER_KEY,
      network: new StacksMainnet(),
      fee: 1n,
      nonce: 0n,
      sponsored: false,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Deny,
      postConditions: []
    });
    const selfPaidHex = Buffer.from(selfPaid.serialize()).toString('hex');
    expect(() =>
      __testing.validateSignedSponsoredTransaction(selfPaidHex, signerAddress)
    ).toThrow('self-paid transaction');

    const nonzeroOriginFee = await makeContractCall({
      contractAddress: ADDRESS,
      contractName: 'xtrata-drops-v1-0',
      functionName: 'claim',
      functionArgs: [uintCV(0)],
      senderKey: SIGNER_KEY,
      network: new StacksMainnet(),
      fee: 1n,
      nonce: 0n,
      sponsored: true,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Deny,
      postConditions: []
    });
    const nonzeroOriginFeeHex = Buffer.from(nonzeroOriginFee.serialize()).toString('hex');
    expect(() =>
      __testing.validateSignedSponsoredTransaction(nonzeroOriginFeeHex, signerAddress)
    ).toThrow('origin fee from zero');
  });

  it('normalizes network hints from request payloads', () => {
    expect(__testing.normalizeNetwork('mainnet')).toBe('mainnet');
    expect(__testing.normalizeNetwork({ coreApiUrl: 'https://api.testnet.hiro.so' })).toBe(
      'testnet'
    );
  });

  it('requires an explicit valid nonce response', () => {
    expect(__testing.parseNextNonce({ possible_next_nonce: 12 })).toBe(12n);
    expect(__testing.parseNextNonce({ possible_next_nonce: '13' })).toBe(13n);
    expect(__testing.parseNextNonce({})).toBeNull();
    expect(__testing.parseNextNonce({ possible_next_nonce: -1 })).toBeNull();
  });
});
