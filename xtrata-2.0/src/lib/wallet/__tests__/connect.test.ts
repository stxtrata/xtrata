// @vitest-environment happy-dom

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  AuthType,
  createAddress,
  createStacksPrivateKey,
  FungibleConditionCode,
  getAddressFromPublicKey,
  getPublicKey,
  PostConditionMode,
  publicKeyToString,
  TransactionSigner,
  deserializeTransaction,
  makeStandardSTXPostCondition,
  stringAsciiCV,
  uintCV
} from '@stacks/transactions';
import { __testing, isLeatherProviderId, isXverseProviderId } from '../connect';

const ADDRESS = 'SP2MF04VAGYHGAZWGTEDW5VYCPDWWSY08Z1QFNDSN';

describe('wallet connect helpers', () => {
  afterEach(() => {
    window.localStorage.clear();
    delete (window as typeof window & { LeatherProvider?: unknown }).LeatherProvider;
    delete (window as typeof window & { XverseProviders?: unknown }).XverseProviders;
    delete (window as typeof window & { xverseProviders?: unknown }).xverseProviders;
  });

  it('detects Leather provider ids', () => {
    expect(isLeatherProviderId('LeatherProvider')).toBe(true);
    expect(isLeatherProviderId('XverseProviders.StacksProvider')).toBe(false);
    expect(isLeatherProviderId(null)).toBe(false);
  });

  it('detects Xverse provider ids', () => {
    expect(isXverseProviderId('XverseProviders.StacksProvider')).toBe(true);
    expect(isXverseProviderId('LeatherProvider')).toBe(false);
    expect(isXverseProviderId(null)).toBe(false);
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
      postConditions: [makeStandardSTXPostCondition(ADDRESS, FungibleConditionCode.LessEqual, 123n)]
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

  it('preserves Leather/Xverse transaction fields as canonical txRaw when a txid is also present', async () => {
    const { AnchorMode, contractPrincipalCV, makeContractCall } =
      await import('@stacks/transactions');
    const { StacksMainnet } = await import('@stacks/network');
    const tx = await makeContractCall({
      contractAddress: ADDRESS,
      contractName: 'xtrata-drops-v1-0',
      functionName: 'claim',
      functionArgs: [contractPrincipalCV(ADDRESS, 'xtrata-core'), uintCV(7)],
      senderKey: 'f9d7f5e0d0d81fdd90dcef4e0e2c1b9e3ea361776a5cd91b5c9a52b98b3e1cb601',
      network: new StacksMainnet(),
      fee: 0n,
      nonce: 0n,
      sponsored: true,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Deny,
      postConditions: [makeStandardSTXPostCondition(ADDRESS, FungibleConditionCode.Equal, 0n)]
    });
    const transaction = Buffer.from(tx.serialize()).toString('hex');
    for (const response of [
      { status: 'success', result: { txid: tx.txid(), transaction } },
      { jsonrpc: '2.0', id: '1', result: { txid: tx.txid(), transaction: `0x${transaction}` } }
    ]) {
      expect(__testing.normalizeTxResult(response).txRaw?.replace(/^0x/, '')).toBe(transaction);
    }
    expect(__testing.normalizeTxResult(transaction).txRaw).toBe(transaction);
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

  it('normalizes network hints from request payloads', () => {
    expect(__testing.normalizeNetwork('mainnet')).toBe('mainnet');
    expect(__testing.normalizeNetwork({ coreApiUrl: 'https://api.testnet.hiro.so' })).toBe(
      'testnet'
    );
  });

  it('resolves the provider id returned by the wallet modal and persists Leather', () => {
    const provider = { request: vi.fn() };
    (window as typeof window & { LeatherProvider?: unknown }).LeatherProvider = provider;

    expect(__testing.resolveProviderSelection('LeatherProvider')).toBe(provider);
    expect(window.localStorage.getItem('STX_PROVIDER')).toBe('LeatherProvider');
  });

  it('extracts the public key belonging to the connected Stacks address', () => {
    const publicKey = `02${'ab'.repeat(32)}`;
    expect(
      __testing.extractStacksPublicKey(
        {
          result: {
            addresses: [
              { address: 'bc1qexample', publicKey: `03${'cd'.repeat(32)}` },
              { address: ADDRESS, publicKey }
            ]
          }
        },
        ADDRESS
      )
    ).toBe(publicKey);
  });

  it('does not misclassify a wallet transaction failure named cancel as user cancellation', () => {
    expect(__testing.isUserCancelledError(new Error('cancel'))).toBe(false);
    expect(__testing.isUserCancelledError(new Error('SignatureValidation'))).toBe(false);
    expect(__testing.isUserCancelledError(new Error('Wallet request cancelled.'))).toBe(true);
    expect(__testing.isUserCancelledError({ code: 4001 })).toBe(true);
  });

  it('recognizes Leather JSON-RPC method-not-supported errors as capability misses', () => {
    expect(
      __testing.isMethodUnsupportedError(
        Object.assign(new Error('"wallet_connect" is not supported.'), { code: -32601 })
      )
    ).toBe(true);
  });

  it('uses Leather capability discovery to select its documented getAddresses connect path', async () => {
    window.localStorage.setItem('STX_PROVIDER', 'LeatherProvider');
    const provider = {
      request: vi.fn(async (method: string) => {
        expect(method).toBe('supportedMethods');
        return { result: ['getAddresses', 'stx_signTransaction', 'stx_callContract'] };
      })
    };

    await expect(__testing.getConnectAttempts(provider as never)).resolves.toEqual([
      'getAddresses'
    ]);
  });

  it('connects Leather through getAddresses after capability discovery', async () => {
    window.localStorage.setItem('STX_PROVIDER', 'LeatherProvider');
    const provider = {
      request: vi.fn(async (method: string) => {
        if (method === 'supportedMethods') {
          return { result: ['getAddresses', 'stx_signTransaction'] };
        }
        expect(method).toBe('getAddresses');
        return { result: { addresses: [{ symbol: 'STX', address: ADDRESS }] } };
      })
    };

    await expect(__testing.connectViaRequest(provider as never)).resolves.toMatchObject({
      isConnected: true,
      address: ADDRESS,
      network: 'mainnet'
    });
    expect(provider.request.mock.calls.map(([method]) => method)).toEqual([
      'supportedMethods',
      'getAddresses'
    ]);
  });

  it('connects Xverse through BitcoinProvider without calling the legacy request stub', async () => {
    const privateKey = createStacksPrivateKey(
      'f9d7f5e0d0d81fdd90dcef4e0e2c1b9e3ea361776a5cd91b5c9a52b98b3e1cb601'
    );
    const publicKey = publicKeyToString(getPublicKey(privateKey));
    const address = getAddressFromPublicKey(publicKey);
    const legacyProvider = { request: vi.fn() };
    const rpcProvider = {
      request: vi.fn(async (method: string) => {
        expect(method).toBe('wallet_connect');
        return { status: 'success', result: { addresses: [{ address, publicKey }] } };
      })
    };
    window.localStorage.setItem('STX_PROVIDER', 'XverseProviders.StacksProvider');
    (
      window as typeof window & {
        XverseProviders?: { StacksProvider: unknown; BitcoinProvider: unknown };
      }
    ).XverseProviders = {
      StacksProvider: legacyProvider,
      BitcoinProvider: rpcProvider
    };

    await expect(__testing.connectViaRequest(legacyProvider as never)).resolves.toMatchObject({
      isConnected: true,
      address,
      publicKey,
      network: 'mainnet'
    });
    expect(legacyProvider.request).not.toHaveBeenCalled();
    expect(rpcProvider.request).toHaveBeenCalledOnce();
  });

  it('builds a sponsored origin transaction and requests signing without broadcast', async () => {
    const privateKey = createStacksPrivateKey(
      'f9d7f5e0d0d81fdd90dcef4e0e2c1b9e3ea361776a5cd91b5c9a52b98b3e1cb601'
    );
    const publicKey = publicKeyToString(getPublicKey(privateKey));
    const address = getAddressFromPublicKey(publicKey);
    const provider = {
      request: vi.fn(async (method: string, params: Record<string, unknown>) => {
        expect(method).toBe('stx_signTransaction');
        expect(params.broadcast).toBe(false);
        const transaction = String(params.transaction);
        const unsigned = deserializeTransaction(transaction);
        expect(unsigned.auth.authType).toBe(AuthType.Sponsored);
        expect(unsigned.auth.spendingCondition.fee).toBe(0n);
        expect(unsigned.auth.spendingCondition.nonce).toBe(9n);
        return { transaction };
      })
    };

    const result = await __testing.requestSponsoredContractCall(provider as never, {
      contractAddress: ADDRESS,
      contractName: 'xtrata-drops-v1-0',
      functionName: 'claim',
      functionArgs: [uintCV(1)],
      network: 'mainnet',
      stxAddress: address,
      publicKey,
      nonce: 9n,
      postConditionMode: PostConditionMode.Deny,
      postConditions: [makeStandardSTXPostCondition(ADDRESS, FungibleConditionCode.Equal, 0n)],
      sponsored: true
    });

    expect(provider.request).toHaveBeenCalledOnce();
    expect(result.txRaw).toMatch(/^[0-9a-f]+$/i);
  });

  it('routes Xverse account lookup and origin-only signing through BitcoinProvider', async () => {
    const privateKey = createStacksPrivateKey(
      'f9d7f5e0d0d81fdd90dcef4e0e2c1b9e3ea361776a5cd91b5c9a52b98b3e1cb601'
    );
    const publicKey = publicKeyToString(getPublicKey(privateKey));
    const address = getAddressFromPublicKey(publicKey);
    const legacyProvider = { request: vi.fn() };
    const signingProvider = {
      request: vi.fn(async (method: string, params?: Record<string, unknown>) => {
        if (method === 'stx_getAccounts') {
          return { status: 'success', result: { addresses: [{ address, publicKey }] } };
        }
        expect(method).toBe('stx_signTransaction');
        expect(params?.broadcast).toBe(false);
        const transaction = String(params?.transaction);
        const unsigned = deserializeTransaction(transaction);
        expect(unsigned.auth.authType).toBe(AuthType.Sponsored);
        expect(unsigned.auth.spendingCondition.nonce).toBe(0n);
        expect(unsigned.auth.spendingCondition.fee).toBe(0n);
        const signer = new TransactionSigner(unsigned);
        signer.signOrigin(privateKey);
        expect(() => signer.transaction.verifyOrigin()).not.toThrow();
        const signedTransaction = Buffer.from(signer.transaction.serialize()).toString('hex');
        return { status: 'success', result: { transaction: signedTransaction } };
      })
    };
    window.localStorage.setItem('STX_PROVIDER', 'XverseProviders.StacksProvider');
    (
      window as typeof window & {
        XverseProviders?: { StacksProvider: unknown; BitcoinProvider: unknown };
      }
    ).XverseProviders = {
      StacksProvider: legacyProvider,
      BitcoinProvider: signingProvider
    };

    const result = await __testing.requestSponsoredContractCall(legacyProvider as never, {
      contractAddress: ADDRESS,
      contractName: 'xtrata-drops-v1-0',
      functionName: 'claim',
      functionArgs: [uintCV(1)],
      network: 'mainnet',
      stxAddress: address,
      nonce: 0n,
      postConditionMode: PostConditionMode.Deny,
      postConditions: [makeStandardSTXPostCondition(ADDRESS, FungibleConditionCode.Equal, 0n)],
      sponsored: true
    });

    expect(legacyProvider.request).not.toHaveBeenCalled();
    expect(signingProvider.request.mock.calls.map(([method]) => method)).toEqual([
      'stx_getAccounts',
      'stx_signTransaction'
    ]);
    expect(result.txRaw).toMatch(/^[0-9a-f]+$/i);
    expect(() => deserializeTransaction(result.txRaw).verifyOrigin()).not.toThrow();
  });

  it('builds a nonce-0 Leather origin from the connected address and uses txHex', async () => {
    const privateKey = createStacksPrivateKey(
      'f9d7f5e0d0d81fdd90dcef4e0e2c1b9e3ea361776a5cd91b5c9a52b98b3e1cb601'
    );
    const address = getAddressFromPublicKey(publicKeyToString(getPublicKey(privateKey)));
    window.localStorage.setItem('STX_PROVIDER', 'LeatherProvider');
    const provider = {
      request: vi.fn(async (method: string, params: Record<string, unknown>) => {
        expect(method).toBe('stx_signTransaction');
        expect(params).toMatchObject({ stxAddress: address, network: 'mainnet' });
        expect(params).not.toHaveProperty('transaction');
        const txHex = String(params.txHex);
        const unsigned = deserializeTransaction(txHex);
        expect(unsigned.auth.authType).toBe(AuthType.Sponsored);
        expect(unsigned.auth.spendingCondition.nonce).toBe(0n);
        expect(unsigned.auth.spendingCondition.fee).toBe(0n);
        expect(unsigned.auth.spendingCondition.signer).toBe(createAddress(address).hash160);
        const signer = new TransactionSigner(unsigned);
        signer.signOrigin(privateKey);
        expect(() => signer.transaction.verifyOrigin()).not.toThrow();
        const signedTxHex = Buffer.from(signer.transaction.serialize()).toString('hex');
        return { jsonrpc: '2.0', id: '1', result: { txHex: signedTxHex } };
      })
    };

    const result = await __testing.requestSponsoredContractCall(provider as never, {
      contractAddress: ADDRESS,
      contractName: 'xtrata-drops-v1-0',
      functionName: 'claim',
      functionArgs: [uintCV(1)],
      network: 'mainnet',
      stxAddress: address,
      nonce: 0n,
      postConditionMode: PostConditionMode.Deny,
      postConditions: [makeStandardSTXPostCondition(ADDRESS, FungibleConditionCode.Equal, 0n)],
      sponsored: true
    });

    expect(provider.request).toHaveBeenCalledOnce();
    expect(result.txRaw).toMatch(/^[0-9a-f]+$/i);
  });
});
