import { getNetworkFromAddress } from '../network/guard';
import type { NetworkType } from '../network/types';
import type {
  WalletCoordinatorStatus,
  WalletProviderFamily,
  WalletSession,
  WalletSessionChange,
  WalletSessionRecord
} from './types';
import type { StorageLike } from './storage';
import { getDefaultStorage } from './storage';

export const WALLET_SESSION_STORAGE_KEY = 'xtrata.wallet.session.v2';
export const LEGACY_WALLET_SESSION_STORAGE_KEY = 'xtrata.v15.1.wallet.session';
export const WALLET_SESSION_CHANNEL = 'xtrata.wallet.session';
const REQUIRED_NETWORK: NetworkType = 'mainnet';
const PUBLIC_KEY_PATTERN = /^[0-9a-f]{66}$/i;

const emptySession: WalletSession = { isConnected: false };

type BroadcastLike = {
  postMessage: (value: unknown) => void;
  close: () => void;
  addEventListener: (type: 'message', listener: (event: MessageEvent) => void) => void;
  removeEventListener: (type: 'message', listener: (event: MessageEvent) => void) => void;
};

type RecordStoreOptions = {
  broadcastFactory?: (name: string) => BroadcastLike | null;
  eventTarget?: Pick<Window, 'addEventListener' | 'removeEventListener'> | null;
  now?: () => number;
};

const resolveNetwork = (session: WalletSession): NetworkType | undefined => {
  if (session.address) {
    return getNetworkFromAddress(session.address) ?? session.network;
  }
  return session.network;
};

const normalizeSession = (session: WalletSession): WalletSession => {
  if (!session.isConnected || !session.address) {
    return { ...emptySession };
  }
  const network = resolveNetwork(session);
  if (network !== REQUIRED_NETWORK) {
    return { ...emptySession };
  }
  return {
    isConnected: true,
    address: session.address.trim(),
    network: REQUIRED_NETWORK,
    ...(typeof session.publicKey === 'string' && PUBLIC_KEY_PATTERN.test(session.publicKey)
      ? { publicKey: session.publicKey }
      : {})
  };
};

const recordToSession = (record: WalletSessionRecord): WalletSession =>
  normalizeSession({
    isConnected: record.status === 'CONNECTED',
    address: record.address,
    network: record.network,
    publicKey: record.publicKey
  });

const disconnectedRecord = (
  revision = 0,
  generation = 0,
  updatedAt = 0,
  status: Extract<WalletCoordinatorStatus, 'DISCONNECTED' | 'RECONNECT_REQUIRED'> = 'DISCONNECTED'
): WalletSessionRecord => ({ version: 2, revision, generation, status, updatedAt });

const normalizeRecord = (candidate: unknown): WalletSessionRecord => {
  if (!candidate || typeof candidate !== 'object') {
    return disconnectedRecord();
  }
  const value = candidate as Partial<WalletSessionRecord>;
  const revision = Number.isSafeInteger(value.revision) && Number(value.revision) >= 0
    ? Number(value.revision)
    : 0;
  const generation = Number.isSafeInteger(value.generation) && Number(value.generation) >= 0
    ? Number(value.generation)
    : 0;
  const updatedAt = Number.isFinite(value.updatedAt) && Number(value.updatedAt) >= 0
    ? Number(value.updatedAt)
    : 0;
  if (value.status === 'RECONNECT_REQUIRED') {
    return {
      ...disconnectedRecord(revision, generation, updatedAt, 'RECONNECT_REQUIRED'),
      ...(typeof value.providerId === 'string' ? { providerId: value.providerId } : {}),
      ...(typeof value.transportId === 'string' ? { transportId: value.transportId } : {}),
      ...(typeof value.walletType === 'string' ? { walletType: value.walletType } : {}),
      ...(typeof value.address === 'string' ? { address: value.address } : {}),
      ...(value.network === 'mainnet' ? { network: value.network } : {})
    };
  }
  const session = normalizeSession({
    isConnected: value.status === 'CONNECTED',
    address: value.address,
    network: value.network,
    publicKey: value.publicKey
  });
  if (!session.isConnected || !session.address) {
    return disconnectedRecord(revision, generation, updatedAt);
  }
  return {
    version: 2,
    revision,
    generation,
    status: 'CONNECTED',
    providerId: typeof value.providerId === 'string' ? value.providerId : 'legacy-session',
    transportId: typeof value.transportId === 'string' ? value.transportId : 'legacy-session',
    walletType: value.walletType ?? 'legacy',
    address: session.address,
    network: 'mainnet',
    ...(session.publicKey ? { publicKey: session.publicKey } : {}),
    updatedAt
  };
};

const parseRecord = (raw: string | null): WalletSessionRecord => {
  if (!raw) return disconnectedRecord();
  try {
    return normalizeRecord(JSON.parse(raw));
  } catch {
    return disconnectedRecord();
  }
};

const parseSession = (raw: string | null): WalletSession => {
  if (!raw) return { ...emptySession };
  try {
    return normalizeSession(JSON.parse(raw) as WalletSession);
  } catch {
    return { ...emptySession };
  }
};

const serializeSession = (session: WalletSession): string => JSON.stringify(normalizeSession(session));

const defaultBroadcastFactory = (name: string): BroadcastLike | null =>
  typeof BroadcastChannel === 'function' ? new BroadcastChannel(name) : null;

export const createVersionedWalletSessionStore = (
  storage: StorageLike = getDefaultStorage(),
  options: RecordStoreOptions = {}
) => {
  const now = options.now ?? Date.now;
  const eventTarget = options.eventTarget === undefined
    ? (typeof window === 'undefined' ? null : window)
    : options.eventTarget;
  const channel = (options.broadcastFactory ?? defaultBroadcastFactory)(WALLET_SESSION_CHANNEL);
  const listeners = new Set<(change: WalletSessionChange) => void>();
  let current = parseRecord(storage.getItem(WALLET_SESSION_STORAGE_KEY));

  const notify = (change: WalletSessionChange) => {
    for (const listener of listeners) listener(change);
  };

  // One-release migration support for the old address-only record.
  if (current.revision === 0) {
    const legacy = parseSession(storage.getItem(LEGACY_WALLET_SESSION_STORAGE_KEY));
    if (legacy.isConnected && legacy.address) {
      current = {
        version: 2,
        revision: 1,
        generation: 1,
        status: 'CONNECTED',
        providerId: 'legacy-session',
        transportId: 'legacy-session',
        walletType: 'legacy',
        address: legacy.address,
        network: 'mainnet',
        ...(legacy.publicKey ? { publicKey: legacy.publicKey } : {}),
        updatedAt: now()
      };
      storage.setItem(WALLET_SESSION_STORAGE_KEY, JSON.stringify(current));
    }
  }

  const accept = (record: WalletSessionRecord, source: WalletSessionChange['source']) => {
    const normalized = normalizeRecord(record);
    if (normalized.revision <= current.revision) return false;
    current = normalized;
    notify({ record: current, source });
    return true;
  };

  const onMessage = (event: MessageEvent) => {
    accept(event.data as WalletSessionRecord, 'broadcast');
  };
  const onStorage = (event: Event) => {
    const storageEvent = event as StorageEvent;
    if (storageEvent.key !== WALLET_SESSION_STORAGE_KEY) return;
    accept(parseRecord(storageEvent.newValue), 'storage');
  };
  channel?.addEventListener('message', onMessage);
  eventTarget?.addEventListener('storage', onStorage as EventListener);

  const publish = (record: WalletSessionRecord) => {
    current = normalizeRecord(record);
    storage.setItem(WALLET_SESSION_STORAGE_KEY, JSON.stringify(current));
    channel?.postMessage(current);
    notify({ record: current, source: 'local' });
    return current;
  };
  const nextRevision = () => Math.max(current.revision + 1, now());

  return {
    load: () => ({ ...current }),
    saveConnected: (params: {
      session: WalletSession;
      providerId: string;
      transportId: string;
      walletType: WalletProviderFamily;
      generation?: number;
    }) => {
      const session = normalizeSession(params.session);
      if (!session.isConnected || !session.address) {
        return publish(disconnectedRecord(nextRevision(), current.generation + 1, now()));
      }
      return publish({
        version: 2,
        revision: nextRevision(),
        generation: params.generation ?? current.generation + 1,
        status: 'CONNECTED',
        providerId: params.providerId,
        transportId: params.transportId,
        walletType: params.walletType,
        address: session.address,
        network: 'mainnet',
        ...(session.publicKey ? { publicKey: session.publicKey } : {}),
        updatedAt: now()
      });
    },
    markReconnectRequired: () => publish({
      ...current,
      version: 2,
      revision: nextRevision(),
      generation: current.generation + 1,
      status: 'RECONNECT_REQUIRED',
      updatedAt: now()
    }),
    clear: () => publish(disconnectedRecord(nextRevision(), current.generation + 1, now())),
    subscribe: (listener: (change: WalletSessionChange) => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    destroy: () => {
      channel?.removeEventListener('message', onMessage);
      channel?.close();
      eventTarget?.removeEventListener('storage', onStorage as EventListener);
    },
    accept
  };
};

export const createWalletSessionStore = (storage?: StorageLike) => {
  const backing = storage ?? getDefaultStorage();
  const versioned = createVersionedWalletSessionStore(backing, {
    broadcastFactory: () => null,
    eventTarget: null
  });
  return {
    load: (): WalletSession => {
      const current = recordToSession(
        parseRecord(backing.getItem(WALLET_SESSION_STORAGE_KEY))
      );
      return current.isConnected
        ? current
        : parseSession(backing.getItem(LEGACY_WALLET_SESSION_STORAGE_KEY));
    },
    save: (session: WalletSession) => {
      const normalized = normalizeSession(session);
      backing.setItem(LEGACY_WALLET_SESSION_STORAGE_KEY, serializeSession(normalized));
      if (!normalized.isConnected) {
        versioned.clear();
        return;
      }
      const existing = parseRecord(backing.getItem(WALLET_SESSION_STORAGE_KEY));
      versioned.accept(existing, 'storage');
      versioned.saveConnected({
        session: normalized,
        providerId: existing.providerId ?? 'legacy-session',
        transportId: existing.transportId ?? 'legacy-session',
        walletType: existing.walletType ?? 'legacy',
        generation: existing.generation || undefined
      });
    },
    clear: () => {
      backing.removeItem(LEGACY_WALLET_SESSION_STORAGE_KEY);
      versioned.accept(
        parseRecord(backing.getItem(WALLET_SESSION_STORAGE_KEY)),
        'storage'
      );
      versioned.clear();
    }
  };
};

export const walletSessionUtils = {
  normalizeSession,
  normalizeRecord,
  parseRecord,
  parseSession,
  recordToSession,
  serializeSession
};
