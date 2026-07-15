import { describe, expect, it } from 'vitest';
import { createVersionedWalletSessionStore } from '../session';
import { createMemoryStorage } from '../storage';

type Listener = (event: MessageEvent) => void;

const createBroadcastHub = () => {
  const channels = new Set<{ listeners: Set<Listener> }>();
  return () => {
    const entry = { listeners: new Set<Listener>() };
    channels.add(entry);
    return {
      postMessage(value: unknown) {
        for (const target of channels) {
          if (target === entry) continue;
          for (const listener of target.listeners) {
            listener({ data: value } as MessageEvent);
          }
        }
      },
      close() { channels.delete(entry); },
      addEventListener(_type: 'message', listener: Listener) { entry.listeners.add(listener); },
      removeEventListener(_type: 'message', listener: Listener) { entry.listeners.delete(listener); }
    };
  };
};

describe('versioned cross-tab wallet session', () => {
  it('propagates connect and disconnect while rejecting stale revisions', () => {
    const storage = createMemoryStorage();
    const factory = createBroadcastHub();
    let tick = 100;
    const a = createVersionedWalletSessionStore(storage, {
      broadcastFactory: factory,
      eventTarget: null,
      now: () => ++tick
    });
    const b = createVersionedWalletSessionStore(storage, {
      broadcastFactory: factory,
      eventTarget: null,
      now: () => ++tick
    });

    const connected = a.saveConnected({
      session: {
        isConnected: true,
        address: 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B',
        network: 'mainnet'
      },
      providerId: 'XverseProviders.StacksProvider',
      transportId: 'XverseProviders.BitcoinProvider',
      walletType: 'xverse'
    });
    expect(b.load()).toMatchObject({
      status: 'CONNECTED',
      address: connected.address,
      revision: connected.revision,
      transportId: 'XverseProviders.BitcoinProvider'
    });
    expect(JSON.stringify(b.load())).not.toContain('request');

    const disconnected = a.clear();
    expect(b.load()).toMatchObject({
      status: 'DISCONNECTED',
      revision: disconnected.revision
    });
    expect(b.accept(connected, 'broadcast')).toBe(false);
    expect(b.load().status).toBe('DISCONNECTED');

    a.destroy();
    b.destroy();
  });

  it('turns account changes into reconnect-required instead of replacing the address', () => {
    const storage = createMemoryStorage();
    const store = createVersionedWalletSessionStore(storage, {
      broadcastFactory: () => null,
      eventTarget: null,
      now: () => 500
    });
    store.saveConnected({
      session: {
        isConnected: true,
        address: 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B',
        network: 'mainnet'
      },
      providerId: 'LeatherProvider',
      transportId: 'LeatherProvider',
      walletType: 'leather'
    });
    const changed = store.markReconnectRequired();
    expect(changed).toMatchObject({
      status: 'RECONNECT_REQUIRED',
      address: 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B'
    });
    store.destroy();
  });
});
