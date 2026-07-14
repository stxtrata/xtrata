import {
  connect as connectStacksWallet,
  disconnect as disconnectStacksWallet,
  getStacksProvider as getConnectStacksProvider,
  request as requestStacksWallet,
  showContractCall as legacyShowContractCall,
  showContractDeploy as legacyShowContractDeploy,
  showSTXTransfer as legacyShowSTXTransfer,
  type ContractCallOptions,
  type ContractDeployOptions,
  type MethodParams,
  type MethodResult,
  type Methods,
  type STXTransferOptions,
  type StacksProvider
} from '@stacks/connect';
import {
  getProviderFromId,
  getSelectedProviderId
} from '@stacks/connect-ui';
import {
  AddressVersion,
  AnchorMode,
  AuthType,
  TransactionVersion,
  addressToString,
  deserializeTransaction,
  getAddressFromPublicKey,
  makeUnsignedContractCall,
  PostConditionMode,
  serializeCV,
  serializePostCondition,
  validateStacksAddress
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { getApiBaseUrls } from '../network/config';
import { getNetworkFromAddress } from '../network/guard';
import type { NetworkType } from '../network/types';
import { bytesToHex } from '../utils/encoding';
import type { WalletSession } from './types';

export type { ContractCallOptions, ContractDeployOptions, StacksProvider };

const USER_CANCEL_ERROR_CODES = new Set([4001, -32000, -31001]);
const METHOD_UNSUPPORTED_ERROR_CODES = new Set([-32601]);

type WalletTxResult = {
  txId?: string;
  txid?: string;
  txRaw?: string;
  stacksTransaction?: unknown;
  [key: string]: unknown;
};

type WalletContractFunctionArg = ContractCallOptions['functionArgs'][number];
type WalletContractPostCondition = NonNullable<ContractCallOptions['postConditions']>[number];
type SerializableClarityValue = Parameters<typeof serializeCV>[0];
type SerializablePostCondition = Parameters<typeof serializePostCondition>[0];
const TX_RESULT_NESTED_KEYS = ['result', 'data', 'payload', 'response', 'params'] as const;
const TX_RESULT_RAW_KEYS = [
  'txRaw',
  'rawTx',
  'rawTransaction',
  'transaction',
  'hex',
  'serializedTx'
] as const;

type WalletActionBase = {
  appDetails?: ContractCallOptions['appDetails'];
  postConditionMode?: ContractCallOptions['postConditionMode'];
  postConditions?: ContractCallOptions['postConditions'];
  network?: ContractCallOptions['network'];
  anchorMode?: ContractCallOptions['anchorMode'];
  attachment?: ContractCallOptions['attachment'];
  fee?: ContractCallOptions['fee'] | bigint;
  stxAddress?: ContractCallOptions['stxAddress'];
  senderKey?: ContractCallOptions['senderKey'];
  nonce?: ContractCallOptions['nonce'] | string | bigint;
  authOrigin?: ContractCallOptions['authOrigin'];
  userSession?: ContractCallOptions['userSession'];
  sponsored?: boolean;
  onFinish?: (payload: WalletTxResult) => void;
  onCancel?: () => void;
};

type WalletContractCallOptions = WalletActionBase & {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ContractCallOptions['functionArgs'];
};

type WalletContractDeployOptions = WalletActionBase & {
  contractName: string;
  codeBody: string;
  clarityVersion?: number;
};

type WalletStxTransferOptions = WalletActionBase & {
  recipient: string;
  amount: STXTransferOptions['amount'];
  memo?: string;
};

const disconnectedSession = (): WalletSession => ({ isConnected: false });

type ConnectWalletOptions = NonNullable<Parameters<typeof connectStacksWallet>[0]>;

const buildConnectRequestOptions = (): ConnectWalletOptions => ({
  forceWalletSelect: true,
  persistWalletSelect: true,
  enableOverrides: true,
  enableLocalStorage: true
});

// Self-heal: @stacks/auth's SessionData.fromJSON() throws
// "JSON data version undefined not supported by SessionData" when localStorage
// holds a session written in an incompatible format (a different @stacks/connect
// major used elsewhere on this origin, or a very old session). After that,
// UserSession.isUserSignedIn()/loadUserData() throw during connect and the
// wallet never opens. Drop any stored session that isn't a valid, versioned
// SessionData so connect always starts from a clean state.
const STACKS_SESSION_STORAGE_KEYS = ['blockstack-session', 'blockstack'];
const sanitizeStoredWalletSession = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  for (const key of STACKS_SESSION_STORAGE_KEYS) {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      continue;
    }
    if (!raw) {
      continue;
    }
    let versionOk = false;
    try {
      const parsed = JSON.parse(raw) as { version?: unknown };
      versionOk = typeof parsed?.version === 'string' && parsed.version.length > 0;
    } catch {
      versionOk = false;
    }
    if (!versionOk) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // ignore storage errors
      }
    }
  }
};

// Run once at module load so legacy pages and the Connect compatibility layer
// start from clean, parseable session storage.
sanitizeStoredWalletSession();

const stripHexPrefix = (value: string) =>
  value.startsWith('0x') || value.startsWith('0X') ? value.slice(2) : value;

const toNonEmptyText = (value: unknown) => {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const normalizeStandaloneTxId = (value: unknown) => {
  const text = toNonEmptyText(value);
  if (!text) {
    return null;
  }
  const normalized = stripHexPrefix(text);
  if (!/^[0-9a-f]+$/i.test(normalized) || normalized.length !== 64) {
    return null;
  }
  return text.startsWith('0x') || text.startsWith('0X') ? text : `0x${normalized}`;
};

const normalizeRawTxHex = (value: unknown) => {
  const text = toNonEmptyText(value);
  if (!text) {
    return null;
  }
  const normalized = stripHexPrefix(text);
  if (
    normalized.length < 128 ||
    normalized.length % 2 !== 0 ||
    !/^[0-9a-f]+$/i.test(normalized)
  ) {
    return null;
  }
  return normalized;
};

const normalizeNetwork = (
  value: unknown,
  fallback: NetworkType = 'mainnet'
): NetworkType => {
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    if (lower.includes('testnet') || lower === 'test') {
      return 'testnet';
    }
    if (lower.includes('mainnet') || lower === 'main') {
      return 'mainnet';
    }
  }
  if (value && typeof value === 'object') {
    const candidate = value as Record<string, unknown>;
    if (typeof candidate.network === 'string') {
      return normalizeNetwork(candidate.network, fallback);
    }
    const api =
      (typeof candidate.coreApiUrl === 'string' && candidate.coreApiUrl) ||
      (typeof candidate.url === 'string' && candidate.url) ||
      '';
    if (api) {
      return normalizeNetwork(api, fallback);
    }
  }
  return fallback;
};

const normalizeBigIntLike = (value: unknown) => {
  if (typeof value === 'undefined' || value === null) {
    return undefined;
  }
  if (typeof value === 'bigint') {
    return value.toString(10);
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : undefined;
  }
  const text = String(value).trim();
  return text.length > 0 ? text : undefined;
};

const normalizeFunctionArg = (value: WalletContractFunctionArg) =>
  typeof value === 'string'
    ? stripHexPrefix(value)
    : bytesToHex(serializeCV(value as SerializableClarityValue));

const normalizePostCondition = (value: WalletContractPostCondition) =>
  typeof value === 'string'
    ? stripHexPrefix(value)
    : bytesToHex(serializePostCondition(value as SerializablePostCondition));

const normalizePostConditionMode = (value?: unknown) =>
  value === PostConditionMode.Allow || value === 'allow' ? 'allow' : 'deny';

const extractStacksAddress = (payload: unknown, depth = 0): string | null => {
  if (depth > 8) {
    return null;
  }
  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    return validateStacksAddress(trimmed) ? trimmed : null;
  }
  if (!payload) {
    return null;
  }
  if (Array.isArray(payload)) {
    for (const entry of payload) {
      const nested = extractStacksAddress(entry, depth + 1);
      if (nested) {
        return nested;
      }
    }
    return null;
  }
  if (typeof payload !== 'object') {
    return null;
  }

  const candidate = payload as Record<string, unknown>;
  const keys = [
    'address',
    'selectedAddress',
    'identityAddress',
    'stxAddress',
    'addresses',
    'accounts',
    'result',
    'profile',
    'authResponsePayload',
    'userData'
  ];

  for (const key of keys) {
    if (!(key in candidate)) {
      continue;
    }
    const nested = extractStacksAddress(candidate[key], depth + 1);
    if (nested) {
      return nested;
    }
  }

  if (typeof candidate.mainnet === 'string' && validateStacksAddress(candidate.mainnet)) {
    return candidate.mainnet.trim();
  }
  if (typeof candidate.testnet === 'string' && validateStacksAddress(candidate.testnet)) {
    return candidate.testnet.trim();
  }

  return null;
};

const toWalletSession = (
  payload: unknown,
  fallbackNetwork: NetworkType = 'mainnet'
): WalletSession => {
  const address = extractStacksAddress(payload);
  if (!address) {
    return disconnectedSession();
  }
  const network = getNetworkFromAddress(address) ?? normalizeNetwork(payload, fallbackNetwork);
  if (network !== 'mainnet') {
    return disconnectedSession();
  }
  return {
    isConnected: true,
    address,
    network
  };
};

type WalletErrorDetails = {
  code?: number;
  message: string;
  data?: unknown;
};

const getWalletErrorDetails = (
  error: unknown,
  depth = 0,
  seen = new Set<unknown>()
): WalletErrorDetails => {
  if (depth > 5 || seen.has(error)) {
    return { message: 'Unknown wallet error' };
  }
  seen.add(error);

  if (error instanceof Error) {
    const candidate = error as Error & { code?: unknown; data?: unknown; cause?: unknown };
    const code = typeof candidate.code === 'number' ? candidate.code : undefined;
    const message = candidate.message.trim() || error.name || 'Wallet request failed';
    if (message !== '[object Object]') {
      return { code, message, data: candidate.data };
    }
    if (candidate.cause) {
      return getWalletErrorDetails(candidate.cause, depth + 1, seen);
    }
  }

  if (error && typeof error === 'object') {
    const candidate = error as Record<string, unknown>;
    if (candidate.error && candidate.error !== error) {
      const nested = getWalletErrorDetails(candidate.error, depth + 1, seen);
      if (nested.message !== 'Unknown wallet error') {
        return nested;
      }
    }
    const code = typeof candidate.code === 'number' ? candidate.code : undefined;
    const message =
      toNonEmptyText(candidate.message) ??
      toNonEmptyText(candidate.reason) ??
      toNonEmptyText(candidate.name);
    if (message) {
      return { code, message, data: candidate.data };
    }
    for (const key of ['cause', 'data', 'response', 'result'] as const) {
      if (!candidate[key] || candidate[key] === error) {
        continue;
      }
      const nested = getWalletErrorDetails(candidate[key], depth + 1, seen);
      if (nested.message !== 'Unknown wallet error') {
        return { code: code ?? nested.code, message: nested.message, data: nested.data };
      }
    }
    try {
      return { code, message: JSON.stringify(candidate) };
    } catch {
      return { code, message: 'Wallet request failed' };
    }
  }

  const message = toNonEmptyText(error) ?? 'Wallet request failed';
  return { message };
};

export const formatWalletError = (error: unknown) => {
  const details = getWalletErrorDetails(error);
  return typeof details.code === 'number'
    ? `${details.message} (code ${details.code})`
    : details.message;
};

const isMethodUnsupportedError = (error: unknown) => {
  const details = getWalletErrorDetails(error);
  const lower = details.message.toLowerCase();
  return (
    (typeof details.code === 'number' && METHOD_UNSUPPORTED_ERROR_CODES.has(details.code)) ||
    lower.includes('method not found') ||
    lower.includes('unsupported') ||
    lower.includes('not implemented') ||
    lower.includes('request function is not implemented')
  );
};

const isUserCancelledError = (error: unknown) => {
  const details = getWalletErrorDetails(error);
  if (typeof details.code === 'number' && USER_CANCEL_ERROR_CODES.has(details.code)) {
    return true;
  }
  const lower = details.message.toLowerCase();
  return (
    lower.includes('cancel') ||
    lower.includes('reject') ||
    lower.includes('denied') ||
    lower.includes('closed')
  );
};

const requestProvider = async <M extends keyof Methods>(
  provider: StacksProvider,
  method: M,
  params?: MethodParams<M>
): Promise<MethodResult<M>> =>
  requestStacksWallet(
    {
      provider,
      enableOverrides: true,
      enableLocalStorage: true,
      persistWalletSelect: true
    },
    method,
    params
  );

const deriveTxIdFromRawPayload = (value: unknown) => {
  const rawTxHex = normalizeRawTxHex(value);
  if (!rawTxHex) {
    return null;
  }
  try {
    const txId = deserializeTransaction(rawTxHex).txid();
    return txId.startsWith('0x') ? txId : `0x${txId}`;
  } catch {
    return null;
  }
};

const normalizeTxResultPayload = (
  payload: unknown,
  depth = 0
): WalletTxResult | null => {
  if (depth > 6 || typeof payload === 'undefined' || payload === null) {
    return null;
  }

  const standaloneTxId =
    normalizeStandaloneTxId(payload) ?? deriveTxIdFromRawPayload(payload);
  if (standaloneTxId) {
    return {
      txId: standaloneTxId,
      txid: standaloneTxId
    };
  }

  if (Array.isArray(payload)) {
    for (const entry of payload) {
      const nested = normalizeTxResultPayload(entry, depth + 1);
      if (nested) {
        return nested;
      }
    }
    return null;
  }

  if (typeof payload !== 'object') {
    return null;
  }

  const candidate = payload as Record<string, unknown>;
  const explicitTxId =
    toNonEmptyText(candidate.txId) ||
    toNonEmptyText(candidate.txid) ||
    toNonEmptyText(candidate.transactionId);
  if (explicitTxId) {
    return {
      ...candidate,
      txId: explicitTxId,
      txid: explicitTxId
    };
  }

  for (const key of TX_RESULT_RAW_KEYS) {
    const txId = deriveTxIdFromRawPayload(candidate[key]);
    if (txId) {
      return {
        ...candidate,
        txId,
        txid: txId,
        txRaw: toNonEmptyText(candidate[key]) ?? undefined
      };
    }
  }

  for (const key of TX_RESULT_NESTED_KEYS) {
    const nestedPayload = candidate[key];
    const nested = normalizeTxResultPayload(nestedPayload, depth + 1);
    if (nested) {
      return {
        ...candidate,
        ...(nestedPayload && typeof nestedPayload === 'object'
          ? (nestedPayload as Record<string, unknown>)
          : {}),
        ...nested,
        txId: nested.txId,
        txid: nested.txid ?? nested.txId
      };
    }
  }

  return null;
};

const normalizeTxResult = (payload: unknown): WalletTxResult => {
  const normalized = normalizeTxResultPayload(payload);
  if (normalized) {
    return normalized;
  }
  throw new Error('Wallet response did not include a transaction id.');
};

const normalizeTxResultForCallback = (payload: unknown): WalletTxResult => {
  const normalized = normalizeTxResultPayload(payload);
  if (normalized) {
    return normalized;
  }
  if (payload && typeof payload === 'object') {
    return payload as WalletTxResult;
  }
  return { result: payload };
};

const toLegacyContractCallOptions = (
  options: WalletContractCallOptions
): ContractCallOptions =>
  ({
    ...options,
    fee: normalizeBigIntLike(options.fee),
    nonce: normalizeBigIntLike(options.nonce),
    sponsored: options.sponsored === true
  }) as ContractCallOptions;

const toLegacyContractDeployOptions = (
  options: WalletContractDeployOptions
): ContractDeployOptions =>
  ({
    ...options,
    fee: normalizeBigIntLike(options.fee),
    nonce: normalizeBigIntLike(options.nonce),
    sponsored: options.sponsored === true
  }) as ContractDeployOptions;

const toLegacyStxTransferOptions = (
  options: WalletStxTransferOptions
): STXTransferOptions =>
  ({
    ...options,
    fee: normalizeBigIntLike(options.fee),
    nonce: normalizeBigIntLike(options.nonce),
    sponsored: options.sponsored === true
  }) as STXTransferOptions;

const buildContractCallParams = (options: WalletContractCallOptions) => {
  const postConditions =
    options.postConditions && options.postConditions.length > 0
      ? options.postConditions.map((entry) =>
          normalizePostCondition(entry)
        )
      : undefined;

  return {
    contract: `${options.contractAddress}.${options.contractName}`,
    functionName: options.functionName,
    functionArgs: options.functionArgs.map((entry) => normalizeFunctionArg(entry)),
    network: normalizeNetwork(options.network),
    address: options.stxAddress,
    fee: normalizeBigIntLike(options.fee),
    nonce: normalizeBigIntLike(options.nonce),
    sponsored: options.sponsored ?? false,
    postConditionMode: normalizePostConditionMode(options.postConditionMode),
    postConditions
  };
};

const buildContractDeployParams = (options: WalletContractDeployOptions) => {
  const postConditions =
    options.postConditions && options.postConditions.length > 0
      ? options.postConditions.map((entry) =>
          normalizePostCondition(entry)
        )
      : undefined;

  return {
    name: options.contractName,
    clarityCode: options.codeBody,
    clarityVersion: options.clarityVersion,
    network: normalizeNetwork(options.network),
    address: options.stxAddress,
    fee: normalizeBigIntLike(options.fee),
    nonce: normalizeBigIntLike(options.nonce),
    sponsored: options.sponsored ?? false,
    postConditionMode: normalizePostConditionMode(options.postConditionMode),
    postConditions
  };
};

const buildStxTransferParams = (options: WalletStxTransferOptions) => ({
  recipient: options.recipient,
  amount: normalizeBigIntLike(options.amount) ?? '0',
  memo: options.memo,
  network: normalizeNetwork(options.network),
  address: options.stxAddress,
  fee: normalizeBigIntLike(options.fee),
  nonce: normalizeBigIntLike(options.nonce),
  sponsored: options.sponsored ?? false
});

const requestContractCall = async (
  provider: StacksProvider,
  options: WalletContractCallOptions
) => {
  const response = await requestProvider(
    provider,
    'stx_callContract',
    buildContractCallParams(options) as unknown as MethodParams<'stx_callContract'>
  );
  return normalizeTxResult(response);
};

const requestStxTransfer = async (
  provider: StacksProvider,
  options: WalletStxTransferOptions
) => {
  const response = await requestProvider(
    provider,
    'stx_transferStx',
    buildStxTransferParams(options)
  );
  return normalizeTxResult(response);
};

const requestContractDeploy = async (
  provider: StacksProvider,
  options: WalletContractDeployOptions
) => {
  const response = await requestProvider(
    provider,
    'stx_deployContract',
    buildContractDeployParams(options) as unknown as MethodParams<'stx_deployContract'>
  );
  return normalizeTxResult(response);
};

export const isLeatherProviderId = (providerId: string | null | undefined) =>
  typeof providerId === 'string' && providerId.toLowerCase().includes('leather');

export const getSelectedWalletProviderId = () => getSelectedProviderId();

export const getStacksProvider = (): StacksProvider | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const connectProvider = getConnectStacksProvider() as StacksProvider | undefined;
  if (connectProvider) {
    return connectProvider;
  }

  const selectedProviderId = getSelectedProviderId();
  const selectedProvider = selectedProviderId
    ? (getProviderFromId(selectedProviderId) as StacksProvider | undefined)
    : undefined;

  if (selectedProvider) {
    return selectedProvider;
  }

  const walletWindow = window as typeof window & {
    LeatherProvider?: StacksProvider;
    XverseProvider?: StacksProvider;
    XverseProviders?: {
      BitcoinProvider?: StacksProvider;
      StacksProvider?: StacksProvider;
    };
    BlockstackProvider?: StacksProvider;
    StacksProvider?: StacksProvider;
  };

  return (
    walletWindow.LeatherProvider ??
    walletWindow.XverseProvider ??
    walletWindow.XverseProviders?.BitcoinProvider ??
    walletWindow.XverseProviders?.StacksProvider ??
    walletWindow.StacksProvider ??
    walletWindow.BlockstackProvider
  );
};

export const connectWallet = async (_params: {
  appName: string;
  appIcon: string;
}): Promise<WalletSession> => {
  // Re-sanitize right before connecting: a forever-twins page (or another tab)
  // may have written an incompatible session after this module first loaded.
  sanitizeStoredWalletSession();
  try {
    // Keep address discovery on Connect's canonical parameter-free path.
    // Connect 8 maps Xverse's getAddresses request to wallet_connect and
    // otherwise forwards the params unchanged. Xverse documents network as an
    // optional wallet_connect hint, so it is unnecessary here; we enforce
    // mainnet from the returned STX address below for every wallet.
    const response = await connectStacksWallet(buildConnectRequestOptions());
    const session = toWalletSession(response, 'mainnet');
    if (!session.isConnected) {
      throw new Error(
        'Wallet did not return a mainnet STX address. Unlock the wallet, select a Mainnet account, and reconnect.'
      );
    }
    return session;
  } catch (error) {
    if (isUserCancelledError(error)) {
      return disconnectedSession();
    }
    throw error;
  }
};

export const disconnectWallet = async () => {
  disconnectStacksWallet();
};

export const showContractCall = (
  options: WalletContractCallOptions,
  provider?: StacksProvider
) => {
  const activeProvider = provider ?? getStacksProvider();
  const legacyOptions = toLegacyContractCallOptions(options);

  // Prefer the modern stx_callContract request for any provider that exposes a
  // request() bridge (Xverse, Leather, other WBIP wallets). The legacy popup
  // flow is rejected by current Xverse builds, so it is only a fallback.
  if (!activeProvider || typeof activeProvider.request !== 'function') {
    return legacyShowContractCall(legacyOptions, provider);
  }

  return void requestContractCall(activeProvider, options)
    .then((payload) => {
      options.onFinish?.(payload);
    })
    .catch((error) => {
      if (isMethodUnsupportedError(error)) {
        legacyShowContractCall(legacyOptions, activeProvider);
        return;
      }
      // eslint-disable-next-line no-console
      console.error('[wallet] contract call request failed', error);
      options.onCancel?.();
    });
};

// ---------------------------------------------------------------------------
// Sponsored signing WITHOUT broadcast.
//
// Xverse's modern stx_callContract request signs AND broadcasts regardless of
// the `sponsored` flag; a sponsored transaction broadcast without its sponsor
// signature is rejected by the node with SignatureValidation. The reliable
// path is: build the unsigned sponsored transaction ourselves (using the
// wallet's public key), then ask the wallet to sign it via stx_signTransaction
// with broadcast: false, and hand the signed hex to the sponsor relayer.
// ---------------------------------------------------------------------------

const fetchWalletPublicKey = async (
  provider: StacksProvider,
  stxAddress: string
): Promise<string> => {
  const response = await requestProvider(provider, 'stx_getAddresses', {
    network: 'mainnet'
  });
  const addresses = extractWalletAddressEntries(response);
  const match =
    addresses.find((entry) => entry.address === stxAddress && entry.publicKey) ??
    addresses.find((entry) => entry.publicKey && validateStacksAddress(String(entry.address ?? '')));
  if (!match?.publicKey) {
    throw new Error('Wallet did not return a public key for the connected address.');
  }
  return match.publicKey;
};

type WalletAddressEntry = {
  address?: string;
  publicKey?: string;
  symbol?: string;
};

const extractWalletAddressEntries = (
  payload: unknown,
  depth = 0
): WalletAddressEntry[] => {
  if (!payload || depth > 6) {
    return [];
  }
  if (Array.isArray(payload)) {
    const direct = payload.filter(
      (entry): entry is WalletAddressEntry =>
        Boolean(entry && typeof entry === 'object' && 'address' in entry)
    );
    if (direct.length > 0) {
      return direct;
    }
    return payload.flatMap((entry) => extractWalletAddressEntries(entry, depth + 1));
  }
  if (typeof payload !== 'object') {
    return [];
  }
  const candidate = payload as Record<string, unknown>;
  for (const key of ['addresses', 'accounts', 'result', 'data', 'response'] as const) {
    if (!(key in candidate)) {
      continue;
    }
    const entries = extractWalletAddressEntries(candidate[key], depth + 1);
    if (entries.length > 0) {
      return entries;
    }
  }
  return [];
};

const getSponsoredOriginAddress = (transaction: ReturnType<typeof deserializeTransaction>) =>
  addressToString({
    version: AddressVersion.MainnetSingleSig,
    hash160: (transaction.auth.spendingCondition as { signer: string }).signer,
    type: 0
  } as Parameters<typeof addressToString>[0]);

const validateSignedSponsoredTransaction = (
  txRaw: unknown,
  expectedAddress: string
) => {
  const normalized = normalizeRawTxHex(txRaw);
  if (!normalized) {
    throw new Error('Wallet did not return valid signed transaction hex.');
  }
  let transaction: ReturnType<typeof deserializeTransaction>;
  try {
    transaction = deserializeTransaction(normalized);
  } catch {
    throw new Error('Wallet returned an unreadable signed transaction.');
  }
  if (transaction.auth.authType !== AuthType.Sponsored) {
    throw new Error('Wallet changed the claim to a self-paid transaction.');
  }
  if (BigInt(transaction.auth.spendingCondition.fee ?? 0n) !== 0n) {
    throw new Error('Wallet changed the sponsored origin fee from zero.');
  }
  if ((transaction as unknown as { version: TransactionVersion }).version !== TransactionVersion.Mainnet) {
    throw new Error('Wallet signed the claim for the wrong network.');
  }
  const originAddress = getSponsoredOriginAddress(transaction);
  if (originAddress.toUpperCase() !== expectedAddress.toUpperCase()) {
    throw new Error('Wallet signed the claim with a different account.');
  }
  return normalized;
};

const buildSponsoredSignRequest = (transaction: string) => ({
  transaction,
  broadcast: false as const
});

const parseNextNonce = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }
  const value = (payload as { possible_next_nonce?: unknown }).possible_next_nonce;
  if (typeof value !== 'number' && typeof value !== 'string') {
    return null;
  }
  try {
    const nonce = BigInt(value);
    return nonce >= 0n ? nonce : null;
  } catch {
    return null;
  }
};

const fetchAccountNonce = async (address: string): Promise<bigint> => {
  let lastError: unknown = null;
  for (const base of getApiBaseUrls('mainnet')) {
    try {
      const response = await fetch(`${base}/extended/v1/address/${address}/nonces`);
      if (!response.ok) {
        throw new Error(`nonce endpoint returned ${response.status}`);
      }
      const nonce = parseNextNonce(await response.json());
      if (nonce === null) {
        throw new Error('nonce endpoint returned an invalid response');
      }
      return nonce;
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`Unable to read the wallet nonce: ${formatWalletError(lastError)}`);
};

/**
 * Sign a sponsored (fee 0) contract call and return the signed hex WITHOUT
 * broadcasting. Throws with a descriptive message when the wallet cannot do
 * this. Resolves null when the user rejects in the wallet. Callers must not
 * silently replace this with a self-paid transaction.
 */
export const signSponsoredContractCall = async (
  options: WalletContractCallOptions
): Promise<{ txRaw: string } | null> => {
  const provider = getStacksProvider();
  if (!provider || typeof provider.request !== 'function') {
    throw new Error('No wallet request bridge available for sponsored signing.');
  }
  if (!options.stxAddress) {
    throw new Error('Connect a wallet first.');
  }
  const publicKey = await fetchWalletPublicKey(provider, options.stxAddress);
  const publicKeyAddress = getAddressFromPublicKey(publicKey, TransactionVersion.Mainnet);
  if (publicKeyAddress.toUpperCase() !== options.stxAddress.toUpperCase()) {
    throw new Error('Wallet public key does not match the connected account.');
  }
  const nonce = await fetchAccountNonce(options.stxAddress);
  const transaction = await makeUnsignedContractCall({
    contractAddress: options.contractAddress,
    contractName: options.contractName,
    functionName: options.functionName,
    functionArgs: options.functionArgs as unknown as Parameters<
      typeof makeUnsignedContractCall
    >[0]['functionArgs'],
    publicKey,
    network: new StacksMainnet(),
    fee: 0n,
    nonce,
    sponsored: true,
    anchorMode: AnchorMode.Any,
    postConditionMode: (options.postConditionMode ?? PostConditionMode.Deny) as PostConditionMode,
    postConditions: (options.postConditions ?? []) as unknown as Parameters<
      typeof makeUnsignedContractCall
    >[0]['postConditions']
  });
  const unsignedHex = bytesToHex(transaction.serialize());
  try {
    const response = (await requestProvider(
      provider,
      'stx_signTransaction',
      buildSponsoredSignRequest(unsignedHex)
    )) as {
      result?: { transaction?: string; txHex?: string };
      transaction?: string;
      txHex?: string;
    };
    const signed =
      response?.result?.transaction ??
      response?.result?.txHex ??
      response?.transaction ??
      response?.txHex ??
      null;
    return {
      txRaw: validateSignedSponsoredTransaction(signed, options.stxAddress)
    };
  } catch (error) {
    if (isUserCancelledError(error)) {
      return null;
    }
    throw error;
  }
};

export const showContractDeploy = (
  options: WalletContractDeployOptions,
  provider?: StacksProvider
) => {
  const activeProvider = provider ?? getStacksProvider();
  const legacyOptions = toLegacyContractDeployOptions(options);

  // Prefer the modern stx_deployContract request for any provider that exposes
  // it (Xverse, Leather, and other WBIP-compatible wallets). The legacy
  // showContractDeploy popup flow is rejected by current Xverse builds with
  // "Unexpected error creating transaction", so it is only used as a fallback
  // when the provider has no request() bridge or reports the method unsupported.
  if (!activeProvider || typeof activeProvider.request !== 'function') {
    return legacyShowContractDeploy(legacyOptions, provider);
  }

  return void requestContractDeploy(activeProvider, options)
    .then((payload) => {
      options.onFinish?.(payload);
    })
    .catch((error) => {
      if (isMethodUnsupportedError(error)) {
        legacyShowContractDeploy(legacyOptions, activeProvider);
        return;
      }
      // eslint-disable-next-line no-console
      console.error('[wallet] contract deploy request failed', error);
      options.onCancel?.();
    });
};

export const showStxTransfer = (
  options: WalletStxTransferOptions,
  provider?: StacksProvider
) => {
  const activeProvider = provider ?? getStacksProvider();
  const legacyOptions = toLegacyStxTransferOptions({
    ...options,
    onFinish: (payload) => {
      options.onFinish?.(normalizeTxResultForCallback(payload));
    }
  });

  // Prefer the modern stx_transferStx request for any provider with a request()
  // bridge; legacy popup is only a fallback (rejected by current Xverse).
  if (!activeProvider || typeof activeProvider.request !== 'function') {
    return legacyShowSTXTransfer(legacyOptions, provider);
  }

  return void requestStxTransfer(activeProvider, options)
    .then((payload) => {
      options.onFinish?.(payload);
    })
    .catch((error) => {
      if (isMethodUnsupportedError(error)) {
        legacyShowSTXTransfer(legacyOptions, activeProvider);
        return;
      }
      // eslint-disable-next-line no-console
      console.error('[wallet] STX transfer request failed', error);
      options.onCancel?.();
    });
};

export const __testing = {
  buildConnectRequestOptions,
  buildContractCallParams,
  buildContractDeployParams,
  buildSponsoredSignRequest,
  buildStxTransferParams,
  extractStacksAddress,
  isMethodUnsupportedError,
  isUserCancelledError,
  normalizeNetwork,
  parseNextNonce,
  extractWalletAddressEntries,
  formatWalletError,
  getWalletErrorDetails,
  toLegacyContractCallOptions,
  toWalletSession,
  validateSignedSponsoredTransaction,
  normalizeTxResultForCallback,
  normalizeTxResultPayload,
  normalizeTxResult
};
