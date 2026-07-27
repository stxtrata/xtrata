import { afterEach, describe, expect, it, vi } from 'vitest';
import { BRIDGE_PROTOCOL } from '../protocol';
import { BridgeClientError, WalletBridgeClient } from '../client';

const WALLET_ORIGIN = 'https://wallet.xtrata.xyz';

/** Minimal stand-in for a window that dispatches 'message' listeners. */
class FakeListenTarget {
  listeners: Array<(event: MessageEvent) => void> = [];
  addEventListener(type: string, fn: EventListener) {
    if (type === 'message') this.listeners.push(fn as (event: MessageEvent) => void);
  }
  removeEventListener(type: string, fn: EventListener) {
    if (type === 'message') this.listeners = this.listeners.filter((l) => l !== fn);
  }
  deliver(event: Partial<MessageEvent>) {
    for (const fn of [...this.listeners]) fn(event as MessageEvent);
  }
}

const setup = (opts: { timeoutMs?: number } = {}) => {
  const posted: Array<{ message: unknown; targetOrigin: string }> = [];
  const contentWindow = {
    postMessage: (message: unknown, targetOrigin: string) => posted.push({ message, targetOrigin })
  };
  const frame = { contentWindow } as unknown as HTMLIFrameElement;
  const listenTarget = new FakeListenTarget();
  const client = new WalletBridgeClient({
    walletOrigin: WALLET_ORIGIN,
    frame,
    listenTarget: listenTarget as unknown as Window,
    ...opts
  });
  const lastId = () => (posted.at(-1)!.message as { id: string }).id;
  const respond = (over: Record<string, unknown> = {}) =>
    listenTarget.deliver({
      origin: WALLET_ORIGIN,
      source: contentWindow as unknown as Window,
      data: { protocol: BRIDGE_PROTOCOL, kind: 'response', id: lastId(), ok: true, result: { ok: 1 }, ...over }
    });
  return { client, posted, listenTarget, contentWindow, lastId, respond };
};

afterEach(() => vi.useRealTimers());

describe('WalletBridgeClient', () => {
  it('resolves when the wallet replies', async () => {
    const { client, respond } = setup();
    const promise = client.request('wallet.status');
    respond({ result: { hasWallet: true, address: 'SP123' } });
    await expect(promise).resolves.toEqual({ hasWallet: true, address: 'SP123' });
  });

  // With '*' the message goes to whatever occupies the frame, including a
  // hostile page after a redirect. This assertion is the whole point.
  it('never posts with a wildcard target origin', async () => {
    const { client, posted, respond } = setup();
    const promise = client.request('wallet.status');
    expect(posted[0].targetOrigin).toBe(WALLET_ORIGIN);
    expect(posted[0].targetOrigin).not.toBe('*');
    respond();
    await promise;
  });

  it('sends a well-formed request', async () => {
    const { client, posted, respond } = setup();
    const promise = client.request('wallet.sign', { txHex: 'abcd' });
    expect(posted[0].message).toMatchObject({
      protocol: BRIDGE_PROTOCOL,
      kind: 'request',
      method: 'wallet.sign',
      params: { txHex: 'abcd' }
    });
    respond();
    await promise;
  });

  describe('rejects messages it should not trust', () => {
    it('ignores a reply from a different origin', async () => {
      const { client, listenTarget, contentWindow, lastId } = setup();
      const promise = client.request('wallet.status');
      listenTarget.deliver({
        origin: 'https://evil.example',
        source: contentWindow as unknown as Window,
        data: { protocol: BRIDGE_PROTOCOL, kind: 'response', id: lastId(), ok: true, result: 'pwned' }
      });
      expect(client.pendingCount).toBe(1);
      void promise.catch(() => {});
      client.close();
    });

    // A lookalike host must not pass. Prefix/suffix matching would admit this.
    it('ignores an origin that merely looks similar', async () => {
      const { client, listenTarget, contentWindow, lastId } = setup();
      const promise = client.request('wallet.status');
      for (const origin of [
        'https://wallet.xtrata.xyz.evil.com',
        'https://evil.com/wallet.xtrata.xyz',
        'http://wallet.xtrata.xyz',
        'https://WALLET.xtrata.xyz'
      ]) {
        listenTarget.deliver({
          origin,
          source: contentWindow as unknown as Window,
          data: { protocol: BRIDGE_PROTOCOL, kind: 'response', id: lastId(), ok: true, result: 'pwned' }
        });
      }
      expect(client.pendingCount).toBe(1);
      void promise.catch(() => {});
      client.close();
    });

    // Right origin, wrong frame: any other frame on the wallet origin could
    // otherwise answer on the real wallet's behalf.
    it('ignores a reply from a different window on the right origin', async () => {
      const { client, listenTarget, lastId } = setup();
      const promise = client.request('wallet.status');
      listenTarget.deliver({
        origin: WALLET_ORIGIN,
        source: { postMessage: () => {} } as unknown as Window,
        data: { protocol: BRIDGE_PROTOCOL, kind: 'response', id: lastId(), ok: true, result: 'pwned' }
      });
      expect(client.pendingCount).toBe(1);
      void promise.catch(() => {});
      client.close();
    });

    it('ignores a reply with an unknown id', async () => {
      const { client, respond } = setup();
      const promise = client.request('wallet.status');
      respond({ id: 'some-other-id', result: 'pwned' });
      expect(client.pendingCount).toBe(1);
      void promise.catch(() => {});
      client.close();
    });

    it('ignores unrelated postMessage traffic', async () => {
      const { client, listenTarget, contentWindow } = setup();
      const promise = client.request('wallet.status');
      for (const data of ['hello', null, { type: 'webpack-hmr' }, { protocol: 'other' }]) {
        listenTarget.deliver({ origin: WALLET_ORIGIN, source: contentWindow as unknown as Window, data });
      }
      expect(client.pendingCount).toBe(1);
      void promise.catch(() => {});
      client.close();
    });

    it('settles a request only once', async () => {
      const { client, respond } = setup();
      const promise = client.request('wallet.status');
      respond({ result: 'first' });
      respond({ result: 'second' }); // same id, already settled
      await expect(promise).resolves.toBe('first');
      expect(client.pendingCount).toBe(0);
    });
  });

  it('rejects when the wallet returns an error', async () => {
    const { client, respond } = setup();
    const promise = client.request('wallet.sign');
    respond({ ok: false, result: undefined, error: { code: 'USER_REJECTED', message: 'User said no.' } });
    await expect(promise).rejects.toMatchObject({ code: 'WALLET_ERROR', message: 'User said no.' });
  });

  it('times out rather than hanging forever', async () => {
    vi.useFakeTimers();
    const { client } = setup({ timeoutMs: 1000 });
    const promise = client.request('wallet.sign');
    vi.advanceTimersByTime(1001);
    await expect(promise).rejects.toMatchObject({ code: 'TIMEOUT' });
    expect(client.pendingCount).toBe(0);
  });

  it('fails when the iframe has no content window', async () => {
    const client = new WalletBridgeClient({
      walletOrigin: WALLET_ORIGIN,
      frame: { contentWindow: null } as unknown as HTMLIFrameElement,
      listenTarget: new FakeListenTarget() as unknown as Window
    });
    await expect(client.request('wallet.status')).rejects.toMatchObject({ code: 'NO_FRAME' });
  });

  describe('close', () => {
    it('rejects outstanding requests', async () => {
      const { client } = setup();
      const promise = client.request('wallet.status');
      client.close();
      await expect(promise).rejects.toMatchObject({ code: 'CLOSED' });
    });

    it('refuses new requests', async () => {
      const { client } = setup();
      client.close();
      await expect(client.request('wallet.status')).rejects.toMatchObject({ code: 'CLOSED' });
    });

    it('removes its listener', () => {
      const { client, listenTarget } = setup();
      expect(listenTarget.listeners).toHaveLength(1);
      client.close();
      expect(listenTarget.listeners).toHaveLength(0);
    });
  });

  it('keeps concurrent requests separate', async () => {
    const { client, posted, listenTarget, contentWindow } = setup();
    const a = client.request('wallet.status');
    const b = client.request('wallet.sign');
    const idOf = (i: number) => (posted[i].message as { id: string }).id;
    const send = (id: string, result: unknown) =>
      listenTarget.deliver({
        origin: WALLET_ORIGIN,
        source: contentWindow as unknown as Window,
        data: { protocol: BRIDGE_PROTOCOL, kind: 'response', id, ok: true, result }
      });
    send(idOf(1), 'signed'); // reply out of order
    send(idOf(0), 'status');
    await expect(a).resolves.toBe('status');
    await expect(b).resolves.toBe('signed');
  });

  it('exposes BridgeClientError for callers to branch on', async () => {
    const { client } = setup();
    const promise = client.request('wallet.status');
    client.close();
    await expect(promise).rejects.toBeInstanceOf(BridgeClientError);
  });
});
