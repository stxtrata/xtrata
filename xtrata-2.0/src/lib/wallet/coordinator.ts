import type { StacksProvider } from '@stacks/connect';
import {
  connectWallet as connectProvider,
  disconnectWallet as disconnectProvider,
  getSelectedWalletProviderId,
  getStacksProvider as getLegacyStacksProvider,
  readActiveWalletSession as readProviderSession,
  showContractCall as showProviderContractCall,
  showContractDeploy as showProviderContractDeploy,
  showSponsoredContractCall as showProviderSponsoredContractCall,
  showStxTransfer as showProviderStxTransfer
} from './connect';
import { asWalletError, WalletCoordinatorError } from './errors';
import { resolveWalletProvider, XVERSE_TRANSPORT_ID } from './providers';
import {
  createVersionedWalletSessionStore,
  createWalletSessionStore,
  walletSessionUtils
} from './session';
import { assertWalletWriteAllowed, type WalletWriteKind } from './transactions';
import type { WalletSession, WalletSessionChange, WalletSessionRecord } from './types';

export const WALLET_V2_FEATURE_KEY = 'xtrata.wallet.v2';

const recordStore = createVersionedWalletSessionStore();
const legacySessionStore = createWalletSessionStore();
let operation: WalletWriteKind | 'connect' | null = null;
let verificationInFlight: Promise<WalletSessionRecord> | null = null;
let localStatus = recordStore.load().status;

const walletV2Enabled = () => {
  if (typeof window === 'undefined') return true;
  return window.localStorage.getItem(WALLET_V2_FEATURE_KEY) !== '0';
};

const selectedProvider = () => {
  const record = recordStore.load();
  const providerId =
    record.providerId && record.providerId !== 'legacy-session'
      ? record.providerId
      : getSelectedWalletProviderId();
  const fallback = !providerId || providerId === 'legacy-session'
    ? getLegacyStacksProvider()
    : undefined;
  return resolveWalletProvider(providerId, fallback);
};

const connectedRecord = () => recordStore.load();

const toSession = (record: WalletSessionRecord) =>
  walletSessionUtils.recordToSession(record);

const saveConnected = (session: WalletSession) => {
  const selectedId = getSelectedWalletProviderId();
  const resolved = resolveWalletProvider(selectedId, getLegacyStacksProvider());
  const providerId = resolved?.providerId ?? selectedId ?? 'legacy-session';
  return recordStore.saveConnected({
    session,
    providerId,
    transportId:
      resolved?.transportId ??
      (providerId.toLowerCase().includes('xverse') ? XVERSE_TRANSPORT_ID : providerId),
    walletType: resolved?.family ?? 'legacy'
  });
};

const setOperation = (next: typeof operation) => {
  operation = next;
  localStatus = next === 'connect'
    ? 'CONNECTING'
    : next
      ? 'SIGNING'
      : recordStore.load().status;
};

const invalidateUnavailableProvider = (
  record: WalletSessionRecord,
  defer: boolean
) => {
  if (
    record.status === 'CONNECTED' &&
    record.providerId &&
    record.providerId !== 'legacy-session' &&
    !resolveWalletProvider(record.providerId)
  ) {
    const invalidate = () => {
      const current = recordStore.load();
      if (current.revision === record.revision && current.status === 'CONNECTED') {
        recordStore.markReconnectRequired();
      }
    };
    // Avoid a nested notification overtaking the record currently being
    // delivered to subscribers. Re-check the revision in the microtask so a
    // newer disconnect/account change always wins.
    if (defer) queueMicrotask(invalidate);
    else invalidate();
  }
};

recordStore.subscribe(({ record, source }) => {
  if (!operation) localStatus = record.status;
  if (source !== 'local') invalidateUnavailableProvider(record, true);
});

// A restored record is useful only when this tab can resolve the exact local
// provider transport that owns it.
invalidateUnavailableProvider(recordStore.load(), false);

const withOperation = async <T>(kind: Exclude<typeof operation, null>, task: () => Promise<T>) => {
  if (operation) throw new WalletCoordinatorError('BUSY');
  setOperation(kind);
  try {
    return await task();
  } finally {
    setOperation(null);
  }
};

const verifySession = async (expectedSender?: string | null) => {
  const before = connectedRecord();
  assertWalletWriteAllowed(before, { kind: 'contract-call', expectedSender });
  if (before.walletType !== 'xverse') return before;
  if (verificationInFlight) return verificationInFlight;

  localStatus = 'VERIFYING';
  const generation = before.generation;
  verificationInFlight = (async () => {
    try {
      const live = await readProviderSession();
      const current = connectedRecord();
      if (current.generation !== generation || current.status !== 'CONNECTED') {
        throw new WalletCoordinatorError('RECONNECT_REQUIRED');
      }
      // null means this provider intentionally relies on the restored session.
      if (live === null) return current;
      if (!live.isConnected || !live.address) {
        recordStore.markReconnectRequired();
        throw new WalletCoordinatorError('RECONNECT_REQUIRED');
      }
      if (live.address.toUpperCase() !== current.address?.toUpperCase()) {
        recordStore.markReconnectRequired();
        throw new WalletCoordinatorError('ACCOUNT_CHANGED');
      }
      return current;
    } catch (error) {
      throw asWalletError(error);
    } finally {
      verificationInFlight = null;
      localStatus = recordStore.load().status;
    }
  })();
  return verificationInFlight;
};

export const getWalletCoordinatorState = () => ({
  ...recordStore.load(),
  status: localStatus,
  operation
});

export const subscribeWalletSession = (
  listener: (change: WalletSessionChange) => void
) => recordStore.subscribe(listener);

export const getWalletSession = (): WalletSession =>
  walletV2Enabled() ? toSession(recordStore.load()) : legacySessionStore.load();

export const connectWallet = async (params: { appName: string; appIcon: string }) => {
  if (!walletV2Enabled()) {
    const session = await connectProvider(params);
    legacySessionStore.save(session);
    return session;
  }
  return withOperation('connect', async () => {
    const session = await connectProvider(params);
    if (!session.isConnected) return session;
    saveConnected(session);
    return session;
  });
};

/** Opens account selection without disconnecting the established provider first. */
export const changeWalletAccount = async (params: { appName: string; appIcon: string }) => {
  if (!walletV2Enabled()) {
    const session = await connectProvider(params);
    legacySessionStore.save(session);
    return session;
  }
  return withOperation('connect', async () => {
    const previous = recordStore.load();
    const session = await connectProvider(params);
    if (!session.isConnected) return toSession(previous);
    saveConnected(session);
    return session;
  });
};

export const disconnectWallet = async () => {
  if (!walletV2Enabled()) {
    await disconnectProvider();
    legacySessionStore.clear();
    return;
  }
  if (operation) throw new WalletCoordinatorError('BUSY');
  try {
    await disconnectProvider();
  } finally {
    verificationInFlight = null;
    recordStore.clear();
    localStatus = 'DISCONNECTED';
  }
};

export const readActiveWalletSession = async (): Promise<WalletSession | null> => {
  if (!walletV2Enabled()) return readProviderSession();
  const record = recordStore.load();
  if (record.status !== 'CONNECTED') return { isConnected: false };
  try {
    return toSession(await verifySession(record.address));
  } catch (error) {
    if (asWalletError(error).code === 'PROVIDER_TIMEOUT') {
      throw error;
    }
    return { isConnected: false };
  }
};

export const getStacksProvider = (): StacksProvider | undefined =>
  selectedProvider()?.provider ?? getLegacyStacksProvider();

export { getSelectedWalletProviderId };

type ContractCallInput = Parameters<typeof showProviderContractCall>[0];
type SponsoredCallInput = Parameters<typeof showProviderSponsoredContractCall>[0];
type ContractDeployInput = Parameters<typeof showProviderContractDeploy>[0];
type StxTransferInput = Parameters<typeof showProviderStxTransfer>[0];

const beginCallbackWrite = async <T extends {
  stxAddress?: string;
  onFinish?: (payload: never) => void;
  onCancel?: () => void;
  onError?: (error: unknown) => void;
}>(
  kind: WalletWriteKind,
  options: T,
  invoke: (wrapped: T) => void
) => {
  if (!walletV2Enabled()) {
    invoke(options);
    return;
  }
  if (operation) {
    options.onError?.(new WalletCoordinatorError('BUSY'));
    return;
  }
  setOperation(kind);
  let settled = false;
  const finish = () => {
    if (settled) return;
    settled = true;
    setOperation(null);
  };
  try {
    await verifySession(options.stxAddress);
    setOperation(kind);
    const wrapped = {
      ...options,
      onFinish: (payload: never) => {
        finish();
        options.onFinish?.(payload);
      },
      onCancel: () => {
        finish();
        options.onCancel?.();
      },
      onError: (error: unknown) => {
        finish();
        options.onError?.(asWalletError(error));
      }
    } as T;
    invoke(wrapped);
  } catch (error) {
    finish();
    const normalized = asWalletError(error);
    if (normalized.code === 'USER_CANCELLED') options.onCancel?.();
    else if (options.onError) options.onError(normalized);
    else options.onCancel?.();
  }
};

export const showContractCall = (options: ContractCallInput, provider?: StacksProvider) => {
  void beginCallbackWrite('contract-call', options, (wrapped) =>
    showProviderContractCall(wrapped, provider ?? getStacksProvider())
  );
};

export const showSponsoredContractCall = (
  options: SponsoredCallInput,
  provider?: StacksProvider
) => {
  void beginCallbackWrite('sponsored-sign', options, (wrapped) =>
    showProviderSponsoredContractCall(wrapped, provider ?? getStacksProvider())
  );
};

export const showContractDeploy = (options: ContractDeployInput, provider?: StacksProvider) => {
  void beginCallbackWrite('contract-deploy', options, (wrapped) =>
    showProviderContractDeploy(wrapped, provider ?? getStacksProvider())
  );
};

export const showStxTransfer = (options: StxTransferInput, provider?: StacksProvider) => {
  void beginCallbackWrite('stx-transfer', options, (wrapped) =>
    showProviderStxTransfer(
      { ...wrapped, coordinatorVerified: true } as StxTransferInput,
      provider ?? getStacksProvider()
    )
  );
};

export const __testing = {
  recordStore,
  verifySession,
  walletV2Enabled
};

export type {
  ContractCallOptions,
  ContractDeployOptions,
  StacksProvider
} from './connect';
