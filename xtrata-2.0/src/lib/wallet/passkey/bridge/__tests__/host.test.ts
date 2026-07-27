import { describe, expect, it, vi } from 'vitest';
import { BRIDGE_PROTOCOL, type WalletMethod } from '../protocol';
import { WalletBridgeHost, type WalletHandler } from '../host';

const PARENT = 'https://xtrata.xyz';

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

const setup = (
  handlers: Partial<Record<WalletMethod, WalletHandler>>,
  allowed: readonly string[] = [PARENT]
) => {
  const replies: Array<{ message: any; targetOrigin: string }> = [];
  const source = {
    postMessage: (message: unknown, targetOrigin: string) => replies.push({ message, targetOrigin })
  };
  const listenTarget = new FakeListenTarget();
  const host = new WalletBridgeHost({
    allowedParentOrigins: allowed,
    handlers,
    listenTarget: listenTarget as unknown as Window
  });
  const send = (method: string, params?: unknown, origin = PARENT, id = 'req-1') =>
    listenTarget.deliver({
      origin,
      source: source as unknown as Window,
      data: { protocol: BRIDGE_PROTOCOL, kind: 'request', id, method, params }
    });
  const settled = () => new Promise((r) => setTimeout(r, 0));
  return { host, replies, send, settled, listenTarget };
};

describe('WalletBridgeHost', () => {
  it('answers an allowed parent', async () => {
    const { replies, send, settled } = setup({
      'wallet.status': async () => ({ hasWallet: true, address: 'SP1' })
    });
    send('wallet.status');
    await settled();
    expect(replies[0].message).toMatchObject({ ok: true, id: 'req-1', result: { address: 'SP1' } });
  });

  it('replies to the caller origin, never a wildcard', async () => {
    const { replies, send, settled } = setup({ 'wallet.status': async () => ({ ok: true }) });
    send('wallet.status');
    await settled();
    expect(replies[0].targetOrigin).toBe(PARENT);
    expect(replies[0].targetOrigin).not.toBe('*');
  });

  describe('origin allowlist', () => {
    // Silence, not an error: an unrecognised embedder should learn nothing.
    it('ignores an unlisted origin entirely', async () => {
      const handler = vi.fn();
      const { replies, send, settled } = setup({ 'wallet.status': handler });
      send('wallet.status', undefined, 'https://evil.example');
      await settled();
      expect(replies).toHaveLength(0);
      expect(handler).not.toHaveBeenCalled();
    });

    it('ignores lookalike origins', async () => {
      const handler = vi.fn();
      const { replies, send, settled } = setup({ 'wallet.status': handler });
      for (const origin of [
        'https://xtrata.xyz.evil.com',
        'http://xtrata.xyz',
        'https://sub.xtrata.xyz',
        'https://xtrata.xyz:8443'
      ]) {
        send('wallet.status', undefined, origin);
      }
      await settled();
      expect(replies).toHaveLength(0);
      expect(handler).not.toHaveBeenCalled();
    });

    it('supports several exact origins', async () => {
      const staging = 'https://main-staging.xtrata.pages.dev';
      const { replies, send, settled } = setup(
        { 'wallet.status': async () => ({ ok: true }) },
        [PARENT, staging]
      );
      send('wallet.status', undefined, staging);
      await settled();
      expect(replies[0].targetOrigin).toBe(staging);
    });

    // A wildcard would admit any subdomain — one forgotten user-content host is
    // enough to drive somebody's wallet, so this fails at construction.
    it('refuses wildcard origins at construction', () => {
      expect(() => setup({}, ['*'])).toThrow(/wildcard/i);
      expect(() => setup({}, ['https://*.xtrata.xyz'])).toThrow(/wildcard/i);
    });

    it('passes the validated origin to the handler', async () => {
      const handler = vi.fn(async () => ({ ok: true }));
      const { send, settled } = setup({ 'wallet.status': handler });
      send('wallet.status');
      await settled();
      expect(handler).toHaveBeenCalledWith(undefined, { parentOrigin: PARENT });
    });
  });

  describe('request validation', () => {
    it('errors on a method it does not implement', async () => {
      const { replies, send, settled } = setup({});
      send('wallet.sign');
      await settled();
      expect(replies[0].message).toMatchObject({ ok: false, error: { code: 'UNKNOWN_METHOD' } });
    });

    it('ignores methods outside the protocol allowlist', async () => {
      const { replies, send, settled } = setup({});
      send('wallet.exportSeed');
      await settled();
      expect(replies).toHaveLength(0);
    });

    it('ignores malformed traffic', async () => {
      const { replies, listenTarget, settled } = setup({});
      for (const data of ['hi', null, { protocol: 'other' }, { protocol: BRIDGE_PROTOCOL }]) {
        listenTarget.deliver({ origin: PARENT, source: { postMessage: () => {} } as any, data });
      }
      await settled();
      expect(replies).toHaveLength(0);
    });
  });

  describe('handler failures', () => {
    it('converts a thrown error into an error response', async () => {
      const { replies, send, settled } = setup({
        'wallet.sign': async () => {
          throw Object.assign(new Error('User rejected the signature.'), { code: 'USER_REJECTED' });
        }
      });
      send('wallet.sign');
      await settled();
      expect(replies[0].message).toMatchObject({
        ok: false,
        error: { code: 'USER_REJECTED', message: 'User rejected the signature.' }
      });
    });

    it('still answers when an error carries no code', async () => {
      const { replies, send, settled } = setup({
        'wallet.sign': async () => {
          throw new Error('boom');
        }
      });
      send('wallet.sign');
      await settled();
      expect(replies[0].message).toMatchObject({ ok: false, error: { code: 'WALLET_ERROR' } });
    });
  });

  describe('secret leak backstop', () => {
    // The last line of defence: even if a handler is changed to return key
    // material, it must not reach the embedding page.
    it('blocks a response containing key material', async () => {
      const { replies, send, settled } = setup({
        'wallet.status': async () => ({ address: 'SP1', privateKey: 'ab12' })
      });
      send('wallet.status');
      await settled();
      expect(replies[0].message).toMatchObject({ ok: false, error: { code: 'SECRET_LEAK_BLOCKED' } });
    });

    it('does not echo the offending payload back', async () => {
      const { replies, send, settled } = setup({
        'wallet.status': async () => ({ mnemonic: 'abandon abandon art' })
      });
      send('wallet.status');
      await settled();
      expect(JSON.stringify(replies[0].message)).not.toContain('abandon');
    });

    it('blocks raw bytes', async () => {
      const { replies, send, settled } = setup({
        'wallet.status': async () => ({ blob: new Uint8Array([1, 2, 3]) })
      });
      send('wallet.status');
      await settled();
      expect(replies[0].message).toMatchObject({ ok: false, error: { code: 'SECRET_LEAK_BLOCKED' } });
    });

    it('lets legitimate signed output through', async () => {
      const { replies, send, settled } = setup({
        'wallet.sign': async () => ({ txHex: 'deadbeef', address: 'SP1' })
      });
      send('wallet.sign');
      await settled();
      expect(replies[0].message).toMatchObject({ ok: true, result: { txHex: 'deadbeef' } });
    });
  });

  it('stops listening after close', async () => {
    const handler = vi.fn(async () => ({ ok: true }));
    const { host, send, settled, replies } = setup({ 'wallet.status': handler });
    host.close();
    send('wallet.status');
    await settled();
    expect(replies).toHaveLength(0);
    expect(handler).not.toHaveBeenCalled();
  });
});
