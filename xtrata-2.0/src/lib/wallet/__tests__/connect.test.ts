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
import {
  __testing,
  isLeatherProviderId,
  isXverseProviderId,
  showContractCall,
  showStxTransfer
} from '../connect';

const ADDRESS = 'SP2MF04VAGYHGAZWGTEDW5VYCPDWWSY08Z1QFNDSN';

describe('wallet provider chooser', () => {
  afterEach(() => {
    delete (window as typeof window & { XverseProviders?: unknown }).XverseProviders;
    delete (window as typeof window & { btc_providers?: unknown }).btc_providers;
    delete (window as typeof window & { LeatherProvider?: unknown }).LeatherProvider;
  });

  // Reproduces the Xverse in-app browser: Xverse injects its WBIP provider AND
  // the legacy XverseProviders.StacksProvider stub that DEFAULT_PROVIDERS names.
  // Same wallet, same display name, two different ids — which listed Xverse
  // twice in the chooser (www.xverse.app and xverse.app).
  const XVERSE_REGISTERED = {
    id: 'XverseProviders.BitcoinProvider',
    name: 'Xverse Wallet',
    webUrl: 'https://www.xverse.app'
  };
  const XVERSE_DEFAULT = {
    id: 'XverseProviders.StacksProvider',
    name: 'Xverse Wallet',
    webUrl: 'https://xverse.app'
  };
  const LEATHER_DEFAULT = {
    id: 'LeatherProvider',
    name: 'Leather',
    webUrl: 'https://leather.io'
  };

  const installXverseMobile = () => {
    const win = window as typeof window & {
      XverseProviders?: Record<string, unknown>;
      btc_providers?: unknown[];
    };
    win.XverseProviders = {
      BitcoinProvider: { request: () => undefined },
      StacksProvider: { request: () => undefined }
    };
    win.btc_providers = [XVERSE_REGISTERED];
  };

  it('lists a wallet once when its injected and default entries share a name', () => {
    installXverseMobile();
    const installed = __testing.getInstalledProvidersOnHost([XVERSE_DEFAULT, LEATHER_DEFAULT]);
    const xverseRows = installed.filter((entry) => entry.name === 'Xverse Wallet');
    expect(xverseRows).toHaveLength(1);
    // The injected entry must be the survivor — it is the bridge that answers.
    expect(xverseRows[0].id).toBe('XverseProviders.BitcoinProvider');
  });

  it('still lists a genuinely different installed wallet', () => {
    installXverseMobile();
    (window as typeof window & { LeatherProvider?: unknown }).LeatherProvider = {
      request: () => undefined
    };
    const installed = __testing.getInstalledProvidersOnHost([XVERSE_DEFAULT, LEATHER_DEFAULT]);
    expect(installed.map((entry) => entry.name).sort()).toEqual(['Leather', 'Xverse Wallet']);
  });

  it('does not list a default provider that is not injected at all', () => {
    installXverseMobile();
    const installed = __testing.getInstalledProvidersOnHost([XVERSE_DEFAULT, LEATHER_DEFAULT]);
    expect(installed.some((entry) => entry.name === 'Leather')).toBe(false);
  });

  it('treats id and case-insensitive name as the same wallet', () => {
    expect(__testing.isSameWalletProvider(XVERSE_REGISTERED, XVERSE_DEFAULT)).toBe(true);
    expect(
      __testing.isSameWalletProvider(XVERSE_REGISTERED, { ...XVERSE_DEFAULT, name: 'XVERSE WALLET' })
    ).toBe(true);
    expect(__testing.isSameWalletProvider(XVERSE_REGISTERED, LEATHER_DEFAULT)).toBe(false);
  });
});

describe('wallet connect helpers', () => {
  afterEach(() => {
    __testing.clearXverseAccountCache();
    window.localStorage.clear();
    delete (window as typeof window & { LeatherProvider?: unknown }).LeatherProvider;
    delete (window as typeof window & { XverseProviders?: unknown }).XverseProviders;
    delete (window as typeof window & { xverseProviders?: unknown }).xverseProviders;
    delete (window as typeof window & { BitcoinProvider?: unknown }).BitcoinProvider;
    delete (window as typeof window & { StacksProvider?: unknown }).StacksProvider;
    delete (window as typeof window & { webbtc_stx_providers?: unknown }).webbtc_stx_providers;
    delete (window as typeof window & { webbtc_providers?: unknown }).webbtc_providers;
    delete (window as typeof window & { btc_providers?: unknown }).btc_providers;
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

  it('recovers Xverse when connect-ui persists its legacy id but returns no iframe provider', () => {
    const rpcProvider = { request: vi.fn() };
    window.localStorage.setItem('STX_PROVIDER', 'XverseProviders.StacksProvider');
    (
      window as typeof window & {
        XverseProviders?: { BitcoinProvider: unknown };
      }
    ).XverseProviders = { BitcoinProvider: rpcProvider };

    expect(__testing.resolveProviderSelection(undefined)).toBe(rpcProvider);
    expect(__testing.resolveProviderById('XverseProviders.StacksProvider')).toBe(rpcProvider);
  });

  it('resolves a current Xverse WBIP registry entry from its host provider id', () => {
    const rpcProvider = { request: vi.fn() };
    (window as typeof window & { BitcoinProvider?: unknown }).BitcoinProvider = rpcProvider;
    (
      window as typeof window & {
        btc_providers?: Array<{ id: string; name: string }>;
      }
    ).btc_providers = [{ id: 'BitcoinProvider', name: 'Xverse Wallet' }];
    window.localStorage.setItem('STX_PROVIDER', 'BitcoinProvider');

    expect(__testing.resolveProviderSelection(undefined)).toBe(rpcProvider);
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
        // Stale per-origin permission is dropped first so Xverse re-shows its
        // account chooser on every connect.
        if (method === 'wallet_disconnect') {
          return { status: 'success', result: null };
        }
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
    expect(rpcProvider.request.mock.calls.map(([method]) => method)).toEqual([
      'wallet_disconnect',
      'wallet_connect'
    ]);
  });

  it('routes Xverse STX payments through the selected StacksProvider', async () => {
    const legacyProvider = {
      request: vi.fn(async (method: string, params?: Record<string, unknown>) => {
        expect(method).toBe('stx_transferStx');
        // This is the exact request shape used by the working
        // main-staging-sol wizard. In particular, the selected address and
        // mainnet are carried to the provider that opens the payment popup.
        expect(params).toEqual({
          recipient: ADDRESS,
          amount: '2550000',
          memo: 'Xtrata Agent One',
          network: 'mainnet',
          address: ADDRESS,
          fee: undefined,
          nonce: undefined,
          sponsored: false
        });
        return { status: 'success', result: { txid: '0xabc123' } };
      })
    };
    const rpcProvider = {
      request: vi.fn(async () => {
        throw new Error('BitcoinProvider must not receive the Xverse STX payment');
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

    await expect(
      __testing.requestStxTransfer(legacyProvider as never, {
        recipient: ADDRESS,
        amount: '2550000',
        memo: 'Xtrata Agent One',
        network: 'mainnet',
        stxAddress: ADDRESS
      })
    ).resolves.toMatchObject({ txId: '0xabc123' });

    expect(legacyProvider.request).toHaveBeenCalledOnce();
    expect(rpcProvider.request).not.toHaveBeenCalled();
  });

  it('finds the embedded Xverse transaction bridge behind the generic StacksProvider stub', () => {
    const transactionRequest = vi.fn();
    const stubProvider = {
      request: vi.fn(async () => {
        throw new Error('`request` function is not implemented');
      }),
      transactionRequest
    };
    const rpcProvider = { request: vi.fn() };
    window.localStorage.setItem('STX_PROVIDER', 'XverseProviders.StacksProvider');
    (
      window as typeof window & {
        XverseProviders?: { BitcoinProvider: unknown };
        StacksProvider?: unknown;
      }
    ).XverseProviders = { BitcoinProvider: rpcProvider };
    (window as typeof window & { StacksProvider?: unknown }).StacksProvider = stubProvider;

    expect(__testing.resolveProviderSelection(undefined)).toBe(rpcProvider);
    expect(__testing.getLegacyXverseTransactionProvider()).toBe(stubProvider);
  });

  it('routes an embedded Xverse payment through transactionRequest instead of its request stub', async () => {
    const transactionRequest = vi.fn(async () => {
      throw Object.assign(new Error('test cancellation'), { code: 4001 });
    });
    const stubProvider = {
      request: vi.fn(async () => {
        throw new Error('`request` function is not implemented');
      }),
      transactionRequest
    };
    const rpcProvider = { request: vi.fn() };
    window.localStorage.setItem('STX_PROVIDER', 'XverseProviders.StacksProvider');
    (
      window as typeof window & {
        XverseProviders?: { BitcoinProvider: unknown };
        StacksProvider?: unknown;
      }
    ).XverseProviders = { BitcoinProvider: rpcProvider };
    (window as typeof window & { StacksProvider?: unknown }).StacksProvider = stubProvider;

    showStxTransfer({
      recipient: ADDRESS,
      amount: '2550000',
      memo: 'Xtrata Agent One',
      network: 'mainnet',
      stxAddress: ADDRESS
    });

    await vi.waitFor(() => expect(transactionRequest).toHaveBeenCalledOnce());
    expect(stubProvider.request).not.toHaveBeenCalled();
    expect(rpcProvider.request).not.toHaveBeenCalled();
  });

  it('uses minimal Sats Connect params when only Xverse BitcoinProvider is available', async () => {
    const seenMethods: string[] = [];
    const rpcProvider = {
      request: vi.fn(async (method: string, params?: Record<string, unknown>) => {
        seenMethods.push(method);
        expect(method).toBe('stx_transferStx');
        expect(params).toEqual({
          recipient: ADDRESS,
          amount: '2550000',
          memo: 'Xtrata Agent One'
        });
        return { status: 'success', result: { txid: '0xmodern' } };
      })
    };
    window.localStorage.setItem('STX_PROVIDER', 'XverseProviders.StacksProvider');
    (
      window as typeof window & {
        XverseProviders?: { BitcoinProvider: unknown };
      }
    ).XverseProviders = { BitcoinProvider: rpcProvider };
    __testing.rememberXverseAccount(ADDRESS);

    await expect(
      __testing.requestStxTransfer(rpcProvider as never, {
        recipient: ADDRESS,
        amount: '2550000',
        memo: 'Xtrata Agent One',
        network: 'mainnet',
        stxAddress: ADDRESS
      })
    ).resolves.toMatchObject({ txId: '0xmodern' });
    expect(seenMethods).toEqual(['stx_transferStx']);
  });

  it('surfaces an Xverse STX payment rejection without rerouting or retrying it', async () => {
    const legacyProvider = {
      request: vi.fn(async () => {
        throw Object.assign(new Error('User rejected the Stacks transaction signing request'), {
          code: 4001
        });
      })
    };
    const rpcProvider = { request: vi.fn() };
    window.localStorage.setItem('STX_PROVIDER', 'XverseProviders.StacksProvider');
    (
      window as typeof window & {
        XverseProviders?: { StacksProvider: unknown; BitcoinProvider: unknown };
      }
    ).XverseProviders = {
      StacksProvider: legacyProvider,
      BitcoinProvider: rpcProvider
    };

    await expect(
      __testing.requestStxTransfer(legacyProvider as never, {
        recipient: ADDRESS,
        amount: '1000000',
        network: 'mainnet',
        stxAddress: ADDRESS
      })
    ).rejects.toThrow(/User rejected/);
    expect(legacyProvider.request).toHaveBeenCalledOnce();
    expect(rpcProvider.request).not.toHaveBeenCalled();
  });

  const scoreSubmitOptions = () => ({
    contractAddress: ADDRESS,
    contractName: 'xtrata-arcade-scores-v1-3',
    functionName: 'submit-score',
    functionArgs: [stringAsciiCV('astro-blaster'), uintCV(0), uintCV(883), stringAsciiCV('MOB')],
    network: 'mainnet' as const,
    stxAddress: ADDRESS,
    postConditionMode: PostConditionMode.Deny,
    postConditions: [
      makeStandardSTXPostCondition(ADDRESS, FungibleConditionCode.LessEqual, 30000n)
    ]
  });

  const installXverseProviders = (legacyProvider: unknown, rpcProvider: unknown) => {
    window.localStorage.setItem('STX_PROVIDER', 'XverseProviders.StacksProvider');
    (
      window as typeof window & {
        XverseProviders?: { StacksProvider: unknown; BitcoinProvider: unknown };
      }
    ).XverseProviders = {
      StacksProvider: legacyProvider,
      BitcoinProvider: rpcProvider
    };
  };

  it('routes Xverse contract calls through the session-holding BitcoinProvider with spec-only params', async () => {
    const scoreTxId = `0x${'ab'.repeat(32)}`;
    const legacyProvider = {
      request: vi.fn(async () => {
        throw new Error('legacy StacksProvider must not receive the Xverse contract call');
      })
    };
    const seenMethods: string[] = [];
    const rpcProvider = {
      request: vi.fn(async (method: string, params?: Record<string, unknown>) => {
        seenMethods.push(method);
        if (method === 'wallet_getAccount') {
          return { status: 'success', result: { addresses: [{ address: ADDRESS }] } };
        }
        expect(method).toBe('stx_callContract');
        // Exactly the sats-connect schema fields (plus the legacy `arguments`
        // alias) — the shape proven end-to-end on real Xverse mobile and
        // desktop by the wallet canary. No sender/network/fee/nonce/sponsored.
        expect(Object.keys(params ?? {}).sort()).toEqual([
          'arguments',
          'contract',
          'functionArgs',
          'functionName',
          'postConditionMode',
          'postConditions'
        ]);
        expect(params).toMatchObject({
          contract: `${ADDRESS}.xtrata-arcade-scores-v1-3`,
          functionName: 'submit-score',
          postConditionMode: 'deny'
        });
        expect(params?.functionArgs).toHaveLength(4);
        expect(params?.arguments).toEqual(params?.functionArgs);
        expect(params?.postConditions).toHaveLength(1);
        return { status: 'success', result: { txid: scoreTxId } };
      })
    };
    installXverseProviders(legacyProvider, rpcProvider);

    await expect(
      __testing.requestWalletContractCall(legacyProvider as never, scoreSubmitOptions())
    ).resolves.toMatchObject({ txId: scoreTxId });

    expect(legacyProvider.request).not.toHaveBeenCalled();
    expect(seenMethods).toEqual(['wallet_getAccount', 'stx_callContract']);
  });

  it('recovers a BitcoinProvider contract call from a stale-session network mismatch once', async () => {
    const scoreTxId = `0x${'ef'.repeat(32)}`;
    const legacyProvider = { request: vi.fn() };
    const seenMethods: string[] = [];
    let callAttempts = 0;
    const rpcProvider = {
      request: vi.fn(async (method: string) => {
        seenMethods.push(method);
        if (method === 'wallet_getAccount') {
          return { status: 'success', result: { addresses: [{ address: ADDRESS }] } };
        }
        if (method === 'wallet_disconnect') {
          return { status: 'success', result: null };
        }
        if (method === 'wallet_connect') {
          return { status: 'success', result: { addresses: [{ address: ADDRESS }] } };
        }
        expect(method).toBe('stx_callContract');
        callAttempts += 1;
        if (callAttempts === 1) {
          throw new Error('Network mismatch.');
        }
        return { status: 'success', result: { txid: scoreTxId } };
      })
    };
    installXverseProviders(legacyProvider, rpcProvider);

    await expect(
      __testing.requestWalletContractCall(legacyProvider as never, scoreSubmitOptions())
    ).resolves.toMatchObject({ txId: scoreTxId });

    expect(seenMethods).toEqual([
      'wallet_getAccount',
      'stx_callContract',
      'wallet_disconnect',
      'wallet_connect',
      'stx_callContract'
    ]);
    expect(legacyProvider.request).not.toHaveBeenCalled();
  });

  it('does not retry a genuine Xverse contract-call rejection', async () => {
    const legacyProvider = { request: vi.fn() };
    const seenMethods: string[] = [];
    const rpcProvider = {
      request: vi.fn(async (method: string) => {
        seenMethods.push(method);
        if (method === 'wallet_getAccount') {
          return { status: 'success', result: { addresses: [{ address: ADDRESS }] } };
        }
        throw Object.assign(new Error('User rejected the Stacks transaction signing request'), {
          code: 4001
        });
      })
    };
    installXverseProviders(legacyProvider, rpcProvider);

    await expect(
      __testing.requestWalletContractCall(legacyProvider as never, scoreSubmitOptions())
    ).rejects.toThrow(/User rejected/);

    expect(seenMethods).toEqual(['wallet_getAccount', 'stx_callContract']);
    expect(legacyProvider.request).not.toHaveBeenCalled();
  });

  it('re-runs wallet_connect on the same Xverse provider when the session has no readable account', async () => {
    const scoreTxId = `0x${'cd'.repeat(32)}`;
    const legacyProvider = { request: vi.fn() };
    const seenMethods: string[] = [];
    const rpcProvider = {
      request: vi.fn(async (method: string) => {
        seenMethods.push(method);
        if (method === 'stx_getAccounts' || method === 'wallet_getAccount') {
          throw Object.assign(new Error('Access denied.'), { code: -32002 });
        }
        if (method === 'wallet_connect') {
          // Mobile-style wallet_connect result: BTC + STX purposes together.
          return {
            status: 'success',
            result: {
              addresses: [
                { address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4', purpose: 'payment' },
                { address: ADDRESS, purpose: 'stacks' }
              ],
              walletType: 'software'
            }
          };
        }
        expect(method).toBe('stx_callContract');
        return { status: 'success', result: { txid: scoreTxId } };
      })
    };
    installXverseProviders(legacyProvider, rpcProvider);

    await expect(
      __testing.requestWalletContractCall(legacyProvider as never, scoreSubmitOptions())
    ).resolves.toMatchObject({ txId: scoreTxId });

    // stx_getAccounts must NEVER appear here — on current Xverse it opens a
    // "Mismatched Network" prompt that gets rejected ("Network mismatch").
    expect(seenMethods).toEqual(['wallet_getAccount', 'wallet_connect', 'stx_callContract']);
    expect(legacyProvider.request).not.toHaveBeenCalled();
  });

  it('aborts the Xverse contract call when the active account differs from the connected address', async () => {
    const otherAddress = 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ';
    const legacyProvider = { request: vi.fn() };
    const rpcProvider = {
      request: vi.fn(async (method: string) => {
        if (method === 'wallet_getAccount') {
          return { status: 'success', result: { addresses: [{ address: otherAddress }] } };
        }
        throw new Error(`stx_callContract must not be sent after an address mismatch (${method})`);
      })
    };
    installXverseProviders(legacyProvider, rpcProvider);

    await expect(
      __testing.requestWalletContractCall(legacyProvider as never, scoreSubmitOptions())
    ).rejects.toMatchObject({ code: 'WALLET_ADDRESS_MISMATCH' });

    expect(rpcProvider.request).toHaveBeenCalledOnce();
  });

  it('fails with a stage diagnostic when Xverse abandons the signing request', async () => {
    const legacyProvider = { request: vi.fn() };
    const rpcProvider = {
      request: vi.fn(async (method: string) => {
        if (method === 'wallet_getAccount') {
          return { status: 'success', result: { addresses: [{ address: ADDRESS }] } };
        }
        // Xverse mobile can toast an error and leave the promise pending.
        return new Promise(() => {});
      })
    };
    installXverseProviders(legacyProvider, rpcProvider);

    __testing.setXverseSigningWatchdogMs(50);
    try {
      await expect(
        __testing.requestWalletContractCall(legacyProvider as never, scoreSubmitOptions())
      ).rejects.toMatchObject({
        code: 'XVERSE_SIGNING_TIMEOUT',
        stage: 'stx_callContract',
        message: expect.stringContaining('stx_callContract')
      });
    } finally {
      __testing.setXverseSigningWatchdogMs(90_000);
    }
  });

  it('surfaces real Xverse wallet errors through onError without a legacy fallback', async () => {
    const legacyProvider = {
      request: vi.fn(async () => {
        throw new Error('legacy StacksProvider must not receive a fallback contract call');
      }),
      transactionRequest: vi.fn(async () => {
        throw new Error('legacy transactionRequest must not be used for Xverse');
      })
    };
    const rpcProvider = {
      request: vi.fn(async (method: string) => {
        if (method === 'wallet_getAccount') {
          return { status: 'success', result: { addresses: [{ address: ADDRESS }] } };
        }
        throw Object.assign(new Error('Invalid parameters for stx_callContract.'), {
          code: -32602
        });
      })
    };
    installXverseProviders(legacyProvider, rpcProvider);

    const onFinish = vi.fn();
    const onCancel = vi.fn();
    const error = await new Promise<unknown>((resolve) => {
      showContractCall(
        {
          ...scoreSubmitOptions(),
          onFinish,
          onCancel,
          onError: resolve
        },
        legacyProvider as never
      );
    });

    expect(error).toMatchObject({ message: 'Invalid parameters for stx_callContract.' });
    expect(onFinish).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
    expect(legacyProvider.request).not.toHaveBeenCalled();
    expect(legacyProvider.transactionRequest).not.toHaveBeenCalled();
  });

  it('keeps Leather contract calls on the selected provider with the full param shape', async () => {
    const txId = `0x${'ef'.repeat(32)}`;
    const seenMethods: string[] = [];
    const leatherProvider = {
      request: vi.fn(async (method: string, params?: Record<string, unknown>) => {
        seenMethods.push(method);
        expect(method).toBe('stx_callContract');
        expect(params).toMatchObject({
          contract: `${ADDRESS}.xtrata-arcade-scores-v1-3`,
          functionName: 'submit-score',
          network: 'mainnet',
          address: ADDRESS,
          postConditionMode: 'deny'
        });
        return { status: 'success', result: { txid: txId } };
      })
    };
    window.localStorage.setItem('STX_PROVIDER', 'LeatherProvider');

    await expect(
      __testing.requestWalletContractCall(leatherProvider as never, scoreSubmitOptions())
    ).resolves.toMatchObject({ txId });

    expect(seenMethods).toEqual(['stx_callContract']);
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
