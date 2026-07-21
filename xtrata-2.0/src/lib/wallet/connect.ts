import { AppConfig, UserSession, type UserData } from '@stacks/auth';
import {
  DEFAULT_PROVIDERS,
  disconnect as disconnectLegacyProvider,
  showConnect as legacyShowConnect,
  showContractCall as legacyShowContractCall,
  showContractDeploy as legacyShowContractDeploy,
  showSTXTransfer as legacyShowSTXTransfer,
  type ContractCallOptions,
  type ContractDeployOptions,
  type STXTransferOptions,
  type StacksProvider
} from '@stacks/connect';
import {
  clearSelectedProviderId,
  getProviderFromId,
  getSelectedProviderId,
  setSelectedProviderId,
  type WebBTCProvider
} from '@stacks/connect-ui';
import { defineCustomElements } from '@stacks/connect-ui/loader';
import {
  AnchorMode,
  createAddress,
  deserializeTransaction,
  getAddressFromPublicKey,
  makeUnsignedContractCall,
  PostConditionMode,
  serializeCV,
  serializePostCondition,
  validateStacksAddress
} from '@stacks/transactions';
import { getNetworkFromAddress } from '../network/guard';
import type { NetworkType } from '../network/types';
import { bytesToHex } from '../utils/encoding';
import type { WalletSession } from './types';

export type { ContractCallOptions, ContractDeployOptions, StacksProvider };

const DEFAULT_SCOPES = ['store_write'];
const MANIFEST_PATH = '/manifest.json';
const USER_CANCEL_ERROR_CODES = new Set([4001, -31001]);
const XVERSE_SIGNING_PROVIDER_IDS = [
  'XverseProviders.BitcoinProvider',
  'xverseProviders.BitcoinProvider',
  'BitcoinProvider'
] as const;
const PLACEHOLDER_COMPRESSED_PUBLIC_KEY = `02${'00'.repeat(32)}`;

type WalletRpcProvider = {
  request: (method: string, params?: Record<string, unknown>) => Promise<unknown>;
};

type ConnectModalElement = HTMLElement & {
  defaultProviders: WebBTCProvider[];
  installedProviders: WebBTCProvider[];
  persistSelection: boolean;
  callback?: (selection: string | StacksProvider) => void;
  cancelCallback?: () => void;
};

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
  'txHex',
  'rawTx',
  'rawTransaction',
  'transaction',
  'signedTransaction',
  'hex',
  'serializedTx'
] as const;

export const isLeatherProviderId = (providerId: string | null | undefined) =>
  typeof providerId === 'string' && providerId.toLowerCase().includes('leather');

export const isXverseProviderId = (providerId: string | null | undefined) =>
  typeof providerId === 'string' && providerId.toLowerCase().includes('xverse');

// The wizard runs inside a same-origin iframe (/wizard/?embedded=1 on the
// homepage). Wallet extensions (Leather, Xverse) inject their providers into
// the TOP window only, while @stacks/connect ships an Asigna shim that defines
// window.AsignaProvider inside EVERY iframe. Detecting providers against the
// iframe window therefore lists Asigna as "installed" and hides the real
// wallets. All provider detection and resolution goes through the top
// same-origin window when one exists; cross-origin embeds fall back to the
// local window.
const getWalletHostWindow = (): Window | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  try {
    const top = window.top;
    if (top && top !== window.self && top.location.origin === window.location.origin) {
      return top;
    }
  } catch {
    // Cross-origin parent: its providers are unreachable, use this window.
  }
  return window;
};

const resolveProviderOnWindow = (win: Window | undefined, id: string | null | undefined) => {
  if (!win || !id) {
    return undefined;
  }
  return id
    .split('.')
    .reduce<unknown>(
      (acc, part) => (acc as Record<string, unknown> | undefined)?.[part],
      win
    ) as StacksProvider | undefined;
};

// Resolution for an already-chosen provider id: prefer the host (top) window,
// then this window (covers the Asigna iframe shim if the user explicitly
// picked Asigna), then connect-ui's own registry.
const resolveProviderById = (id: string | null | undefined): StacksProvider | undefined => {
  if (typeof window === 'undefined' || !id) {
    return undefined;
  }
  const host = getWalletHostWindow();
  return (
    resolveProviderOnWindow(host, id) ??
    (host === window ? undefined : resolveProviderOnWindow(window, id)) ??
    (getProviderFromId(id) as StacksProvider | undefined)
  );
};

// Detection for the wallet-chooser modal: host window ONLY, so the iframe
// Asigna shim never shows up as an installed wallet.
const getInstalledProvidersOnHost = (defaultProviders: WebBTCProvider[]): WebBTCProvider[] => {
  const host = getWalletHostWindow();
  if (!host) {
    return [];
  }
  const registered = ((host as Window & { webbtc_stx_providers?: WebBTCProvider[] })
    .webbtc_stx_providers ?? []) as WebBTCProvider[];
  const additional = defaultProviders.filter(
    (candidate) =>
      !registered.find((entry) => entry.id === candidate.id) &&
      !!resolveProviderOnWindow(host, candidate.id)
  );
  return registered.concat(additional);
};

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
  onError?: (error: unknown) => void;
};

type WalletContractCallOptions = WalletActionBase & {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ContractCallOptions['functionArgs'];
};

type SponsoredWalletContractCallOptions = WalletContractCallOptions & {
  nonce: ContractCallOptions['nonce'] | string | bigint;
  stxAddress: string;
  publicKey?: string;
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

// Run once at module load so any UserSession use (including inside
// @stacks/connect's showConnect) starts from a clean, parseable session.
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
  if (normalized.length < 128 || normalized.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(normalized)) {
    return null;
  }
  return normalized;
};

const normalizeNetwork = (value: unknown, fallback: NetworkType = 'mainnet'): NetworkType => {
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

const normalizePostConditionMode = (value?: number) =>
  value === PostConditionMode.Allow ? 'allow' : 'deny';

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

const normalizePublicKey = (value: unknown) => {
  const text = toNonEmptyText(value);
  if (!text) {
    return null;
  }
  const normalized = stripHexPrefix(text);
  return /^[0-9a-f]{66}$/i.test(normalized) ? normalized : null;
};

const extractStacksPublicKey = (
  payload: unknown,
  expectedAddress?: string,
  depth = 0
): string | null => {
  if (depth > 8 || !payload) {
    return null;
  }
  if (Array.isArray(payload)) {
    for (const entry of payload) {
      const nested = extractStacksPublicKey(entry, expectedAddress, depth + 1);
      if (nested) {
        return nested;
      }
    }
    return null;
  }
  if (typeof payload !== 'object') {
    return expectedAddress ? null : normalizePublicKey(payload);
  }

  const candidate = payload as Record<string, unknown>;
  const directAddress = [candidate.address, candidate.stxAddress, candidate.selectedAddress]
    .map((value) => toNonEmptyText(value))
    .find((value) => value && validateStacksAddress(value));
  const directPublicKey = [candidate.publicKey, candidate.public_key, candidate.stxPublicKey]
    .map((value) => normalizePublicKey(value))
    .find(Boolean);

  if (
    directPublicKey &&
    (!expectedAddress || (directAddress && directAddress === expectedAddress))
  ) {
    return directPublicKey;
  }

  for (const key of [
    'addresses',
    'accounts',
    'result',
    'data',
    'payload',
    'response',
    'params',
    'profile',
    'userData'
  ]) {
    if (!(key in candidate)) {
      continue;
    }
    const nested = extractStacksPublicKey(candidate[key], expectedAddress, depth + 1);
    if (nested) {
      return nested;
    }
  }

  return null;
};

const deriveWalletSession = (userData: UserData): WalletSession => {
  const profile = (userData.profile ?? {}) as {
    stxAddress?:
      | string
      | {
          mainnet?: string;
          testnet?: string;
          [key: string]: unknown;
        };
  };

  const profileAddress =
    typeof profile.stxAddress === 'string'
      ? profile.stxAddress
      : typeof profile.stxAddress?.mainnet === 'string'
        ? profile.stxAddress.mainnet
        : userData.identityAddress;

  const address =
    typeof profileAddress === 'string' && validateStacksAddress(profileAddress)
      ? profileAddress.trim()
      : null;

  if (!address) {
    return disconnectedSession();
  }

  const network = getNetworkFromAddress(address);
  if (network !== 'mainnet') {
    return disconnectedSession();
  }

  return {
    isConnected: true,
    address,
    network
  };
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
  const publicKey = extractStacksPublicKey(payload, address);
  return {
    isConnected: true,
    address,
    network,
    ...(publicKey ? { publicKey } : {})
  };
};

const isMethodUnsupportedError = (error: unknown) => {
  const code =
    error && typeof error === 'object' && 'code' in error
      ? (error as { code?: unknown }).code
      : undefined;
  const message = error instanceof Error ? error.message : String(error ?? '');
  const lower = message.toLowerCase();
  return (
    code === -32601 ||
    lower.includes('method not found') ||
    lower.includes('not supported') ||
    lower.includes('unsupported') ||
    lower.includes('not available') ||
    lower.includes('not implemented') ||
    lower.includes('request function is not implemented')
  );
};

const isUserCancelledError = (error: unknown) => {
  if (error && typeof error === 'object') {
    const code = 'code' in error ? (error as { code?: unknown }).code : undefined;
    if (typeof code === 'number' && USER_CANCEL_ERROR_CODES.has(code)) {
      return true;
    }
  }
  const message = error instanceof Error ? error.message : String(error ?? '');
  const lower = message.trim().toLowerCase();
  return (
    /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(lower) ||
    /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(lower) ||
    /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(lower) ||
    lower === 'cancelled' ||
    lower === 'canceled'
  );
};

const providerError = (value: unknown) => {
  if (value instanceof Error) {
    return value;
  }
  const candidate = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  const nested =
    candidate.error && typeof candidate.error === 'object'
      ? (candidate.error as Record<string, unknown>)
      : null;
  const message =
    toNonEmptyText(nested?.message) ??
    toNonEmptyText(candidate.message) ??
    toNonEmptyText(candidate.error) ??
    toNonEmptyText(value) ??
    'Wallet provider request failed.';
  const error = new Error(message) as Error & { code?: unknown; data?: unknown };
  error.code = nested?.code ?? candidate.code;
  error.data = nested?.data ?? candidate.data;
  return error;
};

const unwrapProviderResponse = (response: unknown) => {
  if (response && typeof response === 'object') {
    const candidate = response as Record<string, unknown>;
    if (candidate.error) {
      throw providerError(candidate);
    }
    if (candidate.status === 'error') {
      throw providerError(candidate.result ?? candidate);
    }
  }
  return response;
};

const requestProvider = async (
  provider: StacksProvider,
  method: string,
  params?: Record<string, unknown>
) => {
  if (typeof provider.request !== 'function') {
    throw new Error(`Wallet provider does not support request("${method}").`);
  }
  try {
    const response = await provider.request(method as never, params as never);
    return unwrapProviderResponse(response);
  } catch (error) {
    throw providerError(error);
  }
};

const getXverseRpcProvider = (): WalletRpcProvider | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  const walletWindow = (getWalletHostWindow() ?? window) as typeof window & {
    XverseProviders?: { BitcoinProvider?: WalletRpcProvider };
    xverseProviders?: { BitcoinProvider?: WalletRpcProvider };
    BitcoinProvider?: WalletRpcProvider;
  };
  const injected =
    walletWindow.XverseProviders?.BitcoinProvider ??
    walletWindow.xverseProviders?.BitcoinProvider ??
    walletWindow.BitcoinProvider;
  if (typeof injected?.request === 'function') {
    return injected;
  }
  for (const providerId of XVERSE_SIGNING_PROVIDER_IDS) {
    const provider = resolveProviderById(providerId) as WalletRpcProvider | undefined;
    if (typeof provider?.request === 'function') {
      return provider;
    }
  }
  return undefined;
};

const isSelectedXverseProvider = (provider: StacksProvider) => {
  if (isXverseProviderId(getSelectedProviderId())) {
    return true;
  }
  if (typeof window === 'undefined') {
    return false;
  }
  const walletWindow = (getWalletHostWindow() ?? window) as typeof window & {
    XverseProviders?: { StacksProvider?: StacksProvider };
    xverseProviders?: { StacksProvider?: StacksProvider };
  };
  return (
    provider === walletWindow.XverseProviders?.StacksProvider ||
    provider === walletWindow.xverseProviders?.StacksProvider
  );
};

const requestWalletRpc = async (
  provider: StacksProvider,
  method: string,
  params?: Record<string, unknown>
) => {
  if (!isSelectedXverseProvider(provider)) {
    return requestProvider(provider, method, params);
  }
  const rpcProvider = getXverseRpcProvider();
  if (!rpcProvider) {
    throw Object.assign(new Error('Xverse modern request provider is not available.'), {
      code: 'XVERSE_RPC_UNAVAILABLE'
    });
  }
  try {
    return unwrapProviderResponse(await rpcProvider.request(method, params));
  } catch (error) {
    throw providerError(error);
  }
};

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

const normalizeTxResultPayload = (payload: unknown, depth = 0): WalletTxResult | null => {
  if (depth > 6 || typeof payload === 'undefined' || payload === null) {
    return null;
  }

  const standaloneRawTxId = deriveTxIdFromRawPayload(payload);
  const standaloneTxId = normalizeStandaloneTxId(payload) ?? standaloneRawTxId;
  if (standaloneTxId) {
    return {
      txId: standaloneTxId,
      txid: standaloneTxId,
      txRaw: standaloneRawTxId ? (toNonEmptyText(payload) ?? undefined) : undefined
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
  let canonicalRawTx: string | null = null;
  for (const key of TX_RESULT_RAW_KEYS) {
    if (deriveTxIdFromRawPayload(candidate[key])) {
      canonicalRawTx = toNonEmptyText(candidate[key]);
      break;
    }
  }
  const explicitTxId =
    toNonEmptyText(candidate.txId) ||
    toNonEmptyText(candidate.txid) ||
    toNonEmptyText(candidate.transactionId);
  if (explicitTxId) {
    return {
      ...candidate,
      txId: explicitTxId,
      txid: explicitTxId,
      txRaw: canonicalRawTx ?? toNonEmptyText(candidate.txRaw) ?? undefined
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

const toLegacyContractCallOptions = (options: WalletContractCallOptions): ContractCallOptions =>
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

const toLegacyStxTransferOptions = (options: WalletStxTransferOptions): STXTransferOptions =>
  ({
    ...options,
    fee: normalizeBigIntLike(options.fee),
    nonce: normalizeBigIntLike(options.nonce),
    sponsored: options.sponsored === true
  }) as STXTransferOptions;

const buildContractCallParams = (options: WalletContractCallOptions) => {
  const postConditions =
    options.postConditions && options.postConditions.length > 0
      ? options.postConditions.map((entry) => normalizePostCondition(entry))
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

// Xverse validates stx_callContract against the sats-connect schema, which
// only knows contract, functionName, functionArgs/arguments, postConditions
// and postConditionMode. Out-of-spec fields are not ignored everywhere:
// Xverse mobile reads an explicit sender field as "sign as this address",
// compares it with the STX account the dapp is connected as, and rejects the
// request before any confirmation UI when they differ — including when its
// own connection record is empty ("requesting signature from a different
// address. (undefined)"). Sender correctness is enforced on our side by
// ensureXverseSigningAccount before the call is sent.
const buildXverseContractCallParams = (options: WalletContractCallOptions) => {
  const params = buildContractCallParams(options);
  return {
    contract: params.contract,
    functionName: params.functionName,
    functionArgs: params.functionArgs,
    // Older Xverse builds validate with a schema that only reads `arguments`
    // and silently drop `functionArgs`; send both spellings.
    arguments: params.functionArgs,
    postConditionMode: params.postConditionMode,
    postConditions: params.postConditions
  };
};

const buildContractDeployParams = (options: WalletContractDeployOptions) => {
  const postConditions =
    options.postConditions && options.postConditions.length > 0
      ? options.postConditions.map((entry) => normalizePostCondition(entry))
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

// Xverse tracks the dapp connection per injected provider and per browsing
// session. A session restored from our localStorage can therefore look
// connected to the app while Xverse itself (especially the mobile in-app
// browser, which starts a fresh dapp session each visit) has no active
// wallet_connect for this origin — and a signing request in that state is
// rejected before any confirmation UI. Before signing, read the active
// account on the same BitcoinProvider that will receive the call; if nothing
// is readable, re-run wallet_connect there. A different active account than
// the one the post conditions were built for aborts the call instead of
// silently re-targeting it.
const XVERSE_ACCOUNT_MISMATCH_CODE = 'WALLET_ADDRESS_MISMATCH';

// Kept below the parent bridge's 180s request timeout so the richer
// diagnostic reaches the game modal before the generic bridge timeout fires.
let xverseSigningWatchdogMs = 90_000;

// Last account Xverse confirmed for this origin on the BitcoinProvider bridge.
// Seeded by wallet_connect (connect + preflight) and successful reads; cleared
// on disconnect. Lets the pre-transaction check skip the slow wallet_getAccount
// read right after connecting.
const XVERSE_ACCOUNT_CACHE_MS = 45_000;
let xverseAccountCache: { address: string; at: number } | null = null;
const rememberXverseAccount = (address: string | null | undefined) => {
  if (address) {
    xverseAccountCache = { address, at: Date.now() };
  }
};
const clearXverseAccountCache = () => {
  xverseAccountCache = null;
};
const readXverseAccountCache = () =>
  xverseAccountCache && Date.now() - xverseAccountCache.at <= XVERSE_ACCOUNT_CACHE_MS
    ? xverseAccountCache.address
    : null;

// Xverse rejects BitcoinProvider signing requests with "Network mismatch." / "There's a
// mismatch between your active network and the network you're logged in with
// on the app." when its STORED per-origin session was created under a
// different network setting than the wallet's active network — the preflight
// can still read the right account, so only the signing request exposes it.
// Recovery: drop the stale session, re-run wallet_connect on the same bridge
// (re-binds the session to the active network) and retry the request ONCE.
const isNetworkMismatchError = (error: unknown) => {
  const message = (error instanceof Error ? error.message : String(error ?? '')).toLowerCase();
  return (
    message.includes('network mismatch') ||
    (message.includes('mismatch') && message.includes('network'))
  );
};

const refreshXverseSession = async (rpcProvider: WalletRpcProvider) => {
  clearXverseAccountCache();
  try {
    await rpcProvider.request('wallet_disconnect');
  } catch {
    // best-effort: older builds without wallet_disconnect still re-connect
  }
  const response = unwrapProviderResponse(await rpcProvider.request('wallet_connect'));
  const address = extractStacksAddress(response);
  rememberXverseAccount(address);
  return address;
};

const requestXverseSigning = async (
  rpcProvider: WalletRpcProvider,
  method: string,
  params: Record<string, unknown> | undefined,
  expectedAddress?: string
) => {
  try {
    return unwrapProviderResponse(await rpcProvider.request(method, params));
  } catch (error) {
    const failure = providerError(error);
    if (!isNetworkMismatchError(failure)) {
      throw failure;
    }
    // eslint-disable-next-line no-console
    console.info('[wallet:xverse-preflight]', {
      stage: 'NETWORK_MISMATCH_RECOVERY',
      method,
      message: failure.message
    });
    let address: string | null = null;
    try {
      address = await refreshXverseSession(rpcProvider);
    } catch (reconnectError) {
      // eslint-disable-next-line no-console
      console.info('[wallet:xverse-preflight]', {
        stage: 'RECOVERY_RECONNECT_FAILED',
        message:
          reconnectError instanceof Error ? reconnectError.message : String(reconnectError)
      });
      throw failure;
    }
    if (!address || (expectedAddress && address !== expectedAddress)) {
      throw Object.assign(
        new Error(
          address
            ? `Xverse reconnected as ${address}, not the expected ${expectedAddress}. Switch back to that account and retry.`
            : failure.message
        ),
        { code: address ? XVERSE_ACCOUNT_MISMATCH_CODE : undefined }
      );
    }
    // eslint-disable-next-line no-console
    console.info('[wallet:xverse-preflight]', { stage: 'RECOVERY_RETRY', method, address });
    try {
      return unwrapProviderResponse(await rpcProvider.request(method, params));
    } catch (retryError) {
      throw providerError(retryError);
    }
  }
};

// wallet_getAccount sometimes never answers on current Xverse; bound it so the
// preflight falls through to wallet_connect instead of hanging the payment.
let xverseAccountReadTimeoutMs = 30_000;
const withXverseReadTimeout = <T,>(promise: Promise<T>, label: string): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(
        Object.assign(
          new Error(`Xverse did not answer ${label} within ${xverseAccountReadTimeoutMs / 1000}s.`),
          { code: 'XVERSE_ACCOUNT_READ_TIMEOUT' }
        )
      );
    }, xverseAccountReadTimeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer) {
      clearTimeout(timer);
    }
  }) as Promise<T>;
};

const ensureXverseSigningAccount = async (
  rpcProvider: WalletRpcProvider,
  expectedAddress?: string
) => {
  const assertExpected = (address: string, source: string) => {
    if (expectedAddress && address !== expectedAddress) {
      throw Object.assign(
        new Error(
          `Xverse active account ${address} (via ${source}) does not match the connected address ${expectedAddress}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: XVERSE_ACCOUNT_MISMATCH_CODE }
      );
    }
    return address;
  };

  // A recently confirmed account for this origin short-circuits the read:
  // wallet_getAccount can take 12-15s (or never answer) on current Xverse, and
  // stx_getAccounts must NEVER be used here — it opens a "Mismatched Network"
  // prompt that gets rejected, surfacing as "Network mismatch" to the user
  // (canary runs 2026-07-17 and 2026-07-21).
  const cached = readXverseAccountCache();
  if (cached) {
    // eslint-disable-next-line no-console
    console.info('[wallet:xverse-preflight]', { stage: 'CACHED_SESSION', address: cached });
    return assertExpected(cached, 'cached-session');
  }

  let address: string | null = null;
  try {
    const response = unwrapProviderResponse(
      await withXverseReadTimeout(
        rpcProvider.request('wallet_getAccount'),
        'wallet_getAccount'
      )
    );
    address = extractStacksAddress(response);
    // eslint-disable-next-line no-console
    console.info('[wallet:xverse-preflight]', {
      stage: address ? 'READ_OK' : 'READ_EMPTY',
      method: 'wallet_getAccount',
      address
    });
  } catch (error) {
    if (isUserCancelledError(error)) {
      throw providerError(error);
    }
    // Access denied, unsupported and timeouts all mean this browsing session
    // has no readable account yet; fall through to wallet_connect.
    // eslint-disable-next-line no-console
    console.info('[wallet:xverse-preflight]', {
      stage: 'READ_FAILED',
      method: 'wallet_getAccount',
      message: error instanceof Error ? error.message : String(error)
    });
  }
  if (address) {
    rememberXverseAccount(address);
    return assertExpected(address, 'wallet_getAccount');
  }

  let response: unknown;
  try {
    response = unwrapProviderResponse(await rpcProvider.request('wallet_connect'));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.info('[wallet:xverse-preflight]', {
      stage: 'WALLET_CONNECT_FAILED',
      message: error instanceof Error ? error.message : String(error)
    });
    throw providerError(error);
  }
  const connected = extractStacksAddress(response);
  // eslint-disable-next-line no-console
  console.info('[wallet:xverse-preflight]', { stage: 'WALLET_CONNECT_OK', address: connected });
  if (!connected) {
    throw Object.assign(
      new Error('Xverse did not return a Stacks account from wallet_connect.'),
      { code: 'WALLET_ACCOUNT_UNAVAILABLE' }
    );
  }
  rememberXverseAccount(connected);
  return assertExpected(connected, 'wallet_connect');
};

// Keep Xverse contract calls on the same modern BitcoinProvider RPC bridge
// used by wallet_connect: account permission lives on that provider object,
// and its legacy StacksProvider has no session after a modern wallet_connect.
// The direct provider path is preserved for Leather and other wallets.
const requestWalletContractCall = async (
  provider: StacksProvider,
  options: WalletContractCallOptions
) => {
  if (!isSelectedXverseProvider(provider)) {
    const response = await requestProvider(
      provider,
      'stx_callContract',
      buildContractCallParams(options)
    );
    return normalizeTxResult(response);
  }

  const rpcProvider = getXverseRpcProvider();
  if (!rpcProvider) {
    throw Object.assign(new Error('Xverse modern request provider is not available.'), {
      code: 'XVERSE_RPC_UNAVAILABLE'
    });
  }

  // Xverse mobile can reject a request with only an in-app toast and leave
  // the RPC promise pending forever, so nothing would ever reach the caller.
  // Track which request is in flight and fail with that diagnostic if the
  // wallet neither resolves nor rejects within the watchdog window.
  let stage = 'account-preflight';
  let activeAddress: string | undefined;
  const run = async () => {
    activeAddress = await ensureXverseSigningAccount(rpcProvider, options.stxAddress);
    stage = 'stx_callContract';
    const params = buildXverseContractCallParams(options);
    // eslint-disable-next-line no-console
    console.info('[wallet:contract-call]', {
      stage: 'XVERSE_SIGNING_REQUEST',
      providerId: getSelectedProviderId(),
      contract: params.contract,
      functionName: params.functionName,
      functionArgCount: params.functionArgs.length,
      postConditionMode: params.postConditionMode,
      postConditionCount: params.postConditions?.length ?? 0,
      expectedAddress: options.stxAddress,
      activeAddress
    });
    const response = await requestXverseSigning(
      rpcProvider,
      'stx_callContract',
      params,
      options.stxAddress ?? activeAddress
    );
    return normalizeTxResult(response);
  };

  let watchdogTimer: ReturnType<typeof setTimeout> | undefined;
  const watchdog = new Promise<never>((_, reject) => {
    watchdogTimer = setTimeout(() => {
      reject(
        Object.assign(
          new Error(
            `Xverse did not answer the ${stage} request within ${Math.round(
              xverseSigningWatchdogMs / 1000
            )}s (provider=${getSelectedProviderId() ?? 'unknown'}, expected=${
              options.stxAddress ?? 'none'
            }, active=${activeAddress ?? 'unknown'}, call=${options.contractAddress}.${
              options.contractName
            }::${options.functionName}). If Xverse showed an error toast, note its exact text; if you approved a transaction, it may still broadcast.`
          ),
          { code: 'XVERSE_SIGNING_TIMEOUT', stage }
        )
      );
    }, xverseSigningWatchdogMs);
  });
  try {
    return await Promise.race([run(), watchdog]);
  } finally {
    if (watchdogTimer) {
      clearTimeout(watchdogTimer);
    }
  }
};

const WALLET_ACCOUNT_READ_METHODS = [
  'getAddresses',
  'stx_getAddresses',
  'stx_getAccounts',
  'getAccounts',
  'wallet_getAccount'
] as const;

const publicKeyMatchesAddress = (publicKey: string, address: string) => {
  try {
    return getAddressFromPublicKey(publicKey) === address;
  } catch {
    return false;
  }
};

const resolveWalletPublicKey = async (
  provider: StacksProvider,
  address: string,
  preferredPublicKey?: string
) => {
  const preferred = normalizePublicKey(preferredPublicKey);
  if (preferred && publicKeyMatchesAddress(preferred, address)) {
    return preferred;
  }

  let lastError: unknown = null;
  const accountReadMethods = isSelectedXverseProvider(provider)
    ? (['stx_getAccounts', 'wallet_getAccount', 'getAddresses'] as const)
    : WALLET_ACCOUNT_READ_METHODS;
  for (const method of accountReadMethods) {
    try {
      const response = await requestWalletRpc(provider, method);
      const publicKey = extractStacksPublicKey(response, address);
      if (publicKey && publicKeyMatchesAddress(publicKey, address)) {
        return publicKey;
      }
    } catch (error) {
      lastError = error;
      if (!isMethodUnsupportedError(error)) {
        break;
      }
    }
  }

  throw Object.assign(
    new Error(
      lastError instanceof Error
        ? `Wallet did not expose the public key for ${address}: ${lastError.message}`
        : `Wallet did not expose the public key for ${address}. Reconnect the wallet and retry.`
    ),
    { code: 'WALLET_PUBLIC_KEY_UNAVAILABLE' }
  );
};

const buildUnsignedSponsoredContractCall = async (
  options: SponsoredWalletContractCallOptions,
  publicKey?: string | null
) => {
  const transaction = await makeUnsignedContractCall({
    contractAddress: options.contractAddress,
    contractName: options.contractName,
    functionName: options.functionName,
    functionArgs: options.functionArgs,
    publicKey: publicKey ?? PLACEHOLDER_COMPRESSED_PUBLIC_KEY,
    network: normalizeNetwork(options.network),
    fee: 0n,
    nonce: options.nonce,
    anchorMode: AnchorMode.Any,
    postConditionMode: options.postConditionMode ?? PostConditionMode.Deny,
    postConditions: options.postConditions ?? [],
    sponsored: true
  } as Parameters<typeof makeUnsignedContractCall>[0]);
  // Leather's documented getAddresses response includes the STX address but
  // may omit its public key. A single-sig spending condition commits to the
  // address hash, so bind that signer directly to the already-validated,
  // connected address. The wallet still supplies the only private-key
  // signature and the page/relayer independently verify the origin address.
  transaction.auth.spendingCondition.signer = createAddress(options.stxAddress).hash160;
  return bytesToHex(transaction.serialize());
};

const requestSponsoredContractCall = async (
  provider: StacksProvider,
  options: SponsoredWalletContractCallOptions
) => {
  const providerId = getSelectedProviderId();
  const leather = isLeatherProviderId(providerId);
  const preferredPublicKey = normalizePublicKey(options.publicKey);
  let publicKey =
    preferredPublicKey && publicKeyMatchesAddress(preferredPublicKey, options.stxAddress)
      ? preferredPublicKey
      : null;
  if (!publicKey && !leather) {
    try {
      publicKey = await resolveWalletPublicKey(provider, options.stxAddress);
    } catch (error) {
      if (
        !error ||
        typeof error !== 'object' ||
        !('code' in error) ||
        error.code !== 'WALLET_PUBLIC_KEY_UNAVAILABLE'
      ) {
        throw error;
      }
    }
  }
  const unsignedTransaction = await buildUnsignedSponsoredContractCall(options, publicKey);
  // eslint-disable-next-line no-console
  console.info('[wallet:sponsored-sign]', {
    stage: 'SIGNING_REQUEST',
    provider: leather ? 'leather' : isSelectedXverseProvider(provider) ? 'xverse' : 'generic',
    originBinding: publicKey ? 'wallet-public-key' : 'connected-address-hash',
    broadcast: false
  });
  const response = leather
    ? await requestProvider(provider, 'stx_signTransaction', {
        txHex: unsignedTransaction,
        stxAddress: options.stxAddress,
        network: normalizeNetwork(options.network)
      })
    : await requestWalletRpc(provider, 'stx_signTransaction', {
        transaction: unsignedTransaction,
        broadcast: false
      });
  return normalizeTxResult(response);
};

// Xverse STX payments are the exception to the BitcoinProvider routing used by
// wallet_connect and contract calls. The production Xverse extension accepts
// this request on the selected XverseProviders.StacksProvider, including when
// that provider was resolved from the top window for the embedded wizard. The
// BitcoinProvider path can read the account but repeatedly rejects this signing
// request as "Network mismatch" even after disconnect/connect recovery. Keep
// this byte-for-byte aligned with the working main-staging-sol wizard: use the
// selected provider and the complete Stacks transfer parameter shape.
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

const requestLeatherContractDeploy = async (
  provider: StacksProvider,
  options: WalletContractDeployOptions
) => {
  const response = await requestProvider(
    provider,
    'stx_deployContract',
    buildContractDeployParams(options)
  );
  return normalizeTxResult(response);
};

const extractSupportedMethods = (payload: unknown, depth = 0): string[] => {
  if (depth > 5 || payload === null || typeof payload === 'undefined') {
    return [];
  }
  if (Array.isArray(payload)) {
    return [...new Set(payload.filter((value): value is string => typeof value === 'string'))];
  }
  if (typeof payload !== 'object') {
    return [];
  }
  const candidate = payload as Record<string, unknown>;
  for (const key of ['supportedMethods', 'methods', 'result', 'data']) {
    if (key in candidate) {
      const methods = extractSupportedMethods(candidate[key], depth + 1);
      if (methods.length > 0) {
        return methods;
      }
    }
  }
  return [];
};

const GENERIC_CONNECT_METHODS = [
  'wallet_connect',
  'stx_requestAccounts',
  'connect',
  'getAddresses',
  'stx_getAddresses',
  'stx_getAccounts',
  'getAccounts',
  'wallet_getAccount',
  'requestAccounts'
] as const;

const getConnectAttempts = async (provider: StacksProvider) => {
  const providerId = getSelectedProviderId();
  if (isSelectedXverseProvider(provider)) {
    return ['wallet_connect', 'stx_getAccounts', 'wallet_getAccount'] as const;
  }
  if (!isLeatherProviderId(providerId)) {
    return GENERIC_CONNECT_METHODS;
  }

  const leatherMethods = [
    'getAddresses',
    'stx_getAccounts',
    'stx_getAddresses',
    'stx_requestAccounts',
    'wallet_connect'
  ] as const;
  try {
    const supported = extractSupportedMethods(await requestProvider(provider, 'supportedMethods'));
    // eslint-disable-next-line no-console
    console.info('[wallet:connect]', {
      stage: 'CAPABILITIES',
      provider: 'leather',
      supportedMethods: supported
    });
    const advertised = leatherMethods.filter((method) => supported.includes(method));
    return advertised.length > 0 ? advertised : leatherMethods;
  } catch (error) {
    // Capability discovery is advisory. Older Leather builds can still expose
    // the documented getAddresses method without exposing supportedMethods.
    // eslint-disable-next-line no-console
    console.info('[wallet:connect]', {
      stage: 'CAPABILITIES_UNAVAILABLE',
      provider: 'leather',
      message: error instanceof Error ? error.message : String(error)
    });
    return leatherMethods;
  }
};

const connectViaRequest = async (provider: StacksProvider) => {
  // Xverse only shows its account chooser on a FRESH wallet_connect — while a
  // per-origin permission exists it silently reuses the previously-approved
  // account. Users must get the account choice on every connect, so drop the
  // stale permission first (best-effort: older builds without
  // wallet_disconnect just fall through and connect as before).
  if (isSelectedXverseProvider(provider)) {
    try {
      await requestWalletRpc(provider, 'wallet_disconnect');
    } catch {
      // ignore — connect proceeds with the existing permission
    }
  }
  const attempts = await getConnectAttempts(provider);

  let lastError: unknown = null;
  for (const method of attempts) {
    try {
      // eslint-disable-next-line no-console
      console.info('[wallet:connect]', { stage: 'REQUEST', method });
      const response = await requestWalletRpc(provider, method);
      const session = toWalletSession(response);
      if (session.isConnected) {
        // eslint-disable-next-line no-console
        console.info('[wallet:connect]', {
          stage: 'CONNECTED',
          method,
          hasPublicKey: Boolean(session.publicKey)
        });
        if (isSelectedXverseProvider(provider)) {
          rememberXverseAccount(session.address);
        }
        return session;
      }
      // eslint-disable-next-line no-console
      console.info('[wallet:connect]', { stage: 'EMPTY_RESPONSE', method });
    } catch (error) {
      lastError = error;
      const unsupported = isMethodUnsupportedError(error);
      // Expected capability misses are recorded without warning stack noise.
      // eslint-disable-next-line no-console
      (unsupported ? console.info : console.warn)('[wallet:connect]', {
        stage: 'REQUEST_ERROR',
        method,
        code: error && typeof error === 'object' && 'code' in error ? error.code : undefined,
        message: error instanceof Error ? error.message : String(error)
      });
      if (isUserCancelledError(error)) {
        return disconnectedSession();
      }
      if (unsupported) {
        continue;
      }
      throw error;
    }
  }

  if (lastError) {
    throw lastError;
  }
  return disconnectedSession();
};

const connectViaLegacyAuth = async (
  params: {
    appName: string;
    appIcon: string;
  },
  provider: StacksProvider
) => {
  const appConfig = new AppConfig(DEFAULT_SCOPES, undefined, '', MANIFEST_PATH);
  const userSession = new UserSession({ appConfig });

  return new Promise<WalletSession>((resolve) => {
    legacyShowConnect(
      {
        appDetails: {
          name: params.appName,
          icon: params.appIcon
        },
        manifestPath: MANIFEST_PATH,
        userSession,
        onFinish: (payload) => {
          resolve(deriveWalletSession(payload.userSession.loadUserData()));
        },
        onCancel: () => {
          resolve(disconnectedSession());
        }
      },
      provider
    );
  });
};

const resolveProviderSelection = (
  selection: string | StacksProvider,
  persistSelection = true
): StacksProvider | null => {
  if (typeof selection !== 'string') {
    return selection;
  }
  const provider = resolveProviderById(selection);
  if (!provider) {
    return null;
  }
  if (persistSelection) {
    setSelectedProviderId(selection);
  }
  return provider;
};

const selectProvider = (options?: { forceWalletSelect?: boolean; persistSelection?: boolean }) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.resolve<StacksProvider | null>(null);
  }

  const forceWalletSelect = options?.forceWalletSelect ?? false;
  const persistSelection = options?.persistSelection ?? true;

  if (!forceWalletSelect) {
    const selectedProvider = getStacksProvider();
    if (selectedProvider) {
      return Promise.resolve(selectedProvider);
    }
  }

  defineCustomElements(window);

  return new Promise<StacksProvider | null>((resolve) => {
    const modal = document.createElement('connect-modal') as unknown as ConnectModalElement;
    const defaultProviders = DEFAULT_PROVIDERS as WebBTCProvider[];
    const installedProviders = getInstalledProvidersOnHost(defaultProviders);
    const previousOverflow = document.body.style.overflow;

    const cleanup = () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      modal.remove();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }
      cleanup();
      resolve(null);
    };

    modal.defaultProviders = defaultProviders;
    modal.installedProviders = installedProviders;
    modal.persistSelection = persistSelection;
    modal.callback = (selection) => {
      const provider = resolveProviderSelection(selection, persistSelection);
      // eslint-disable-next-line no-console
      console.info('[wallet:connect]', {
        stage: 'PROVIDER_SELECTED',
        providerId:
          typeof selection === 'string'
            ? selection
            : (getSelectedProviderId() ?? 'provider-object'),
        resolved: Boolean(provider),
        requestBridge: typeof provider?.request === 'function'
      });
      cleanup();
      resolve(provider);
    };
    modal.cancelCallback = () => {
      cleanup();
      resolve(null);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    document.body.appendChild(modal);
  });
};

export const getSelectedWalletProviderId = () => getSelectedProviderId();

export const getStacksProvider = (): StacksProvider | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const selectedProviderId = getSelectedProviderId();
  const selectedProvider = selectedProviderId
    ? resolveProviderById(selectedProviderId)
    : undefined;

  if (selectedProvider) {
    return selectedProvider;
  }

  const walletWindow = (getWalletHostWindow() ?? window) as typeof window & {
    LeatherProvider?: StacksProvider;
    XverseProviders?: { StacksProvider?: StacksProvider };
    xverseProviders?: { StacksProvider?: StacksProvider };
    BlockstackProvider?: StacksProvider;
    StacksProvider?: StacksProvider;
  };

  return (
    walletWindow.LeatherProvider ??
    walletWindow.XverseProviders?.StacksProvider ??
    walletWindow.xverseProviders?.StacksProvider ??
    walletWindow.StacksProvider ??
    walletWindow.BlockstackProvider
  );
};

export const connectWallet = async (params: {
  appName: string;
  appIcon: string;
}): Promise<WalletSession> => {
  // Re-sanitize right before connecting: a forever-twins page (or another tab)
  // may have written an incompatible session after this module first loaded.
  sanitizeStoredWalletSession();
  const provider = await selectProvider({ forceWalletSelect: true });
  if (!provider) {
    return disconnectedSession();
  }

  // Prefer the wallet's interactive connect (unlock + account selection) for any
  // provider that exposes a request() bridge — both Leather and current Xverse do.
  // This restores the account picker that the silent stx_getAddresses read skipped.
  // The legacy auth popup is only a fallback when request() is unavailable or every
  // interactive method is reported unsupported.
  if (typeof provider.request === 'function') {
    try {
      const session = await connectViaRequest(provider);
      if (session.isConnected) {
        return session;
      }
    } catch (error) {
      if (isUserCancelledError(error)) {
        return disconnectedSession();
      }
      if (!isMethodUnsupportedError(error)) {
        throw error;
      }
    }
  }

  return connectViaLegacyAuth(params, provider);
};

export const disconnectWallet = async () => {
  const provider = getStacksProvider();
  if (provider && isLeatherProviderId(getSelectedProviderId())) {
    for (const method of ['stx_disconnect', 'wallet_disconnect', 'disconnect', 'deactivate']) {
      try {
        await requestProvider(provider, method);
        break;
      } catch (error) {
        if (isUserCancelledError(error) || isMethodUnsupportedError(error)) {
          continue;
        }
      }
    }
  }

  disconnectLegacyProvider();
  clearSelectedProviderId();
  clearXverseAccountCache();
};

export const showContractCall = (options: WalletContractCallOptions, provider?: StacksProvider) => {
  const activeProvider = provider ?? getStacksProvider();
  const legacyOptions = toLegacyContractCallOptions(options);

  // Prefer the modern stx_callContract request for any provider that exposes a
  // request() bridge (Xverse, Leather, other WBIP wallets). The legacy popup
  // flow is rejected by current Xverse builds, so it is only a fallback.
  if (!activeProvider || typeof activeProvider.request !== 'function') {
    return legacyShowContractCall(legacyOptions, provider);
  }

  return void requestWalletContractCall(activeProvider, options)
    .then((payload) => {
      options.onFinish?.(payload);
    })
    .catch((error) => {
      // A modern Xverse connection has no legacy UserSession to fall back to;
      // the legacy JWT popup is only for other providers that report the
      // modern method unsupported.
      if (isMethodUnsupportedError(error) && !isSelectedXverseProvider(activeProvider)) {
        legacyShowContractCall(legacyOptions, activeProvider);
        return;
      }
      // eslint-disable-next-line no-console
      console.error('[wallet] contract call request failed', error);
      if (isUserCancelledError(error)) {
        options.onCancel?.();
        return;
      }
      if (options.onError) {
        options.onError(error);
        return;
      }
      options.onCancel?.();
    });
};

// Sponsored claims must stop after the origin signature. stx_callContract
// broadcasts immediately, before the relayer can attach the sponsor signature,
// which current Xverse reports as SignatureValidation.
export const showSponsoredContractCall = (
  options: SponsoredWalletContractCallOptions,
  provider?: StacksProvider
) => {
  const activeProvider = provider ?? getStacksProvider();
  if (!activeProvider || typeof activeProvider.request !== 'function') {
    options.onError?.(
      Object.assign(
        new Error('Selected wallet does not support origin-only transaction signing.'),
        { code: 'WALLET_SIGNING_UNSUPPORTED' }
      )
    );
    return;
  }

  return void requestSponsoredContractCall(activeProvider, options)
    .then((payload) => {
      options.onFinish?.(payload);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('[wallet] sponsored contract signing failed', error);
      if (isUserCancelledError(error)) {
        options.onCancel?.();
        return;
      }
      options.onError?.(error);
    });
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

  return void requestLeatherContractDeploy(activeProvider, options)
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

export const showStxTransfer = (options: WalletStxTransferOptions, provider?: StacksProvider) => {
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
      // A modern Xverse connection has no legacy UserSession to fall back to.
      // Keep unsupported/error responses on the modern bridge and surface them
      // to the caller instead of triggering loadUserData() in @stacks/connect.
      if (isMethodUnsupportedError(error) && !isSelectedXverseProvider(activeProvider)) {
        legacyShowSTXTransfer(legacyOptions, activeProvider);
        return;
      }
      // eslint-disable-next-line no-console
      console.error('[wallet] STX transfer request failed', error);
      if (isUserCancelledError(error)) {
        options.onCancel?.();
        return;
      }
      if (options.onError) {
        options.onError(error);
        return;
      }
      options.onCancel?.();
    });
};

export const __testing = {
  buildContractCallParams,
  buildXverseContractCallParams,
  ensureXverseSigningAccount,
  setXverseSigningWatchdogMs: (value: number) => {
    xverseSigningWatchdogMs = value;
  },
  buildContractDeployParams,
  buildStxTransferParams,
  buildUnsignedSponsoredContractCall,
  connectViaRequest,
  extractStacksAddress,
  extractStacksPublicKey,
  extractSupportedMethods,
  getConnectAttempts,
  isMethodUnsupportedError,
  isUserCancelledError,
  normalizeNetwork,
  requestStxTransfer,
  toLegacyContractCallOptions,
  normalizeTxResultForCallback,
  normalizeTxResultPayload,
  normalizeTxResult,
  requestWalletContractCall,
  requestSponsoredContractCall,
  resolveProviderSelection,
  unwrapProviderResponse,
  getWalletHostWindow,
  resolveProviderById,
  getInstalledProvidersOnHost,
  clearXverseAccountCache,
  rememberXverseAccount,
  isNetworkMismatchError,
  requestXverseSigning,
  setXverseAccountReadTimeoutMs: (value: number) => {
    xverseAccountReadTimeoutMs = value;
  }
};
