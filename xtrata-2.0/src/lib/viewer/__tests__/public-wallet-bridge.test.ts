// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installPublicWalletBridge, parsePublicPayment } from '../public-wallet-bridge';

const address = 'SP000000000000000000002Q6VF78';
const recipient = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const session = { isConnected: true, address, network: 'mainnet' as const };
const payment = {
  recipient,
  amount: '1000000',
  fee: '3000',
  address,
  memo: 'TD:WEDNESDAY:1',
  network: 'mainnet'
};
const disposals: Array<() => void> = [];
afterEach(() => {
  disposals.splice(0).forEach((fn) => fn());
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

function setup(gameSave?: any) {
  const wallet = {
    getSession: vi.fn(() => ({ ...session })),
    connect: vi.fn(async () => ({ ...session })),
    disconnect: vi.fn(async () => {})
  };
  const review = vi.fn(async () => true);
  const transfer = vi.fn((options) => options.onFinish({ txId: 'mock-tx' }));
  const changed = vi.fn();
  const isBusy = vi.fn(() => false);
  const pendingChanged = vi.fn();
  const bridge = installPublicWalletBridge({
    host: window,
    gameSave,
    wallet,
    review,
    transfer,
    sessionChanged: changed,
    isBusy,
    pendingChanged
  });
  disposals.push(bridge.dispose);
  async function frame(registered = true) {
    const element = document.createElement('iframe');
    document.body.append(element);
    await new Promise((resolve) => setTimeout(resolve, 0));
    vi.spyOn(element, 'getClientRects').mockReturnValue([{}] as any);
    if (registered) bridge.register(element, 'Inscription #123');
    const response = vi.spyOn(element.contentWindow!, 'postMessage').mockImplementation(() => {});
    const emit = (data: unknown, origin = 'null') =>
      window.dispatchEvent(
        new MessageEvent('message', { data, source: element.contentWindow, origin })
      );
    const hello = () => {
      response.mockClear();
      emit({ type: 'xtrata:wallet:hello', nonce: 'n' });
      return (response.mock.calls[0]?.[0] as any)?.bridgeToken;
    };
    let token = registered ? hello() : '';
    let seq = 0;
    const request = async (
      method: string,
      params: unknown = {},
      overrides: Record<string, unknown> = {}
    ) => {
      response.mockClear();
      emit({
        type: 'xtrata:wallet:request',
        requestId: `r-${++seq}`,
        bridgeToken: token,
        method,
        params,
        ...overrides
      });
      await vi.waitFor(() => expect(response).toHaveBeenCalled());
      return response.mock.calls[0][0] as any;
    };
    return {
      element,
      response,
      emit,
      hello,
      request,
      reconnect: () => {
        token = hello();
      },
      token: () => token
    };
  }
  return { frame, wallet, review, transfer, changed, isBusy, pendingChanged };
}

describe('public preview wallet bridge', () => {
  it('releases the shared host busy state after cancelled review', async () => {
    const h = setup();
    const f = await h.frame();
    h.review.mockResolvedValue(false);
    await f.request('stx_requestAccounts');
    expect(h.pendingChanged.mock.calls).toEqual([[true], [false]]);
  });
  it('expires grants and removes consent when a document reloads', async () => {
    const h = setup();
    const f = await h.frame();
    await f.request('stx_requestAccounts');
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(Date.now() + 11 * 60_000);
    expect(await f.request('stx_getAddresses')).toMatchObject({
      ok: false,
      error: { code: -32600 }
    });
    f.element.dispatchEvent(new Event('load'));
    f.reconnect();
    expect(await f.request('stx_getAddresses')).toMatchObject({ ok: false, error: { code: 4100 } });
  });
  it('does not grant unregistered thumbnail or foreign windows a handshake', async () => {
    const h = setup();
    const f = await h.frame(false);
    expect(f.hello()).toBeUndefined();
    const allowed = await h.frame();
    allowed.response.mockClear();
    allowed.emit({ type: 'xtrata:wallet:hello', nonce: 'n' }, 'https://unrelated.example');
    expect(allowed.response).not.toHaveBeenCalled();
    expect(h.wallet.getSession).not.toHaveBeenCalled();
  });
  it('keeps the wallet private until the user connects that preview', async () => {
    const h = setup();
    const f = await h.frame();
    expect(await f.request('stx_getAddresses')).toMatchObject({ ok: false, error: { code: 4100 } });
    expect(await f.request('stx_transferStx', payment)).toMatchObject({
      ok: false,
      error: { code: 4100 }
    });
    expect(h.transfer).not.toHaveBeenCalled();
  });
  it('requires host consent to connect and shares the selected session', async () => {
    const h = setup();
    const f = await h.frame();
    expect(await f.request('stx_requestAccounts')).toMatchObject({
      ok: true,
      result: { address, network: 'mainnet' }
    });
    expect(h.review).toHaveBeenCalledWith({ kind: 'connect', label: 'Inscription #123' });
    expect(h.changed).toHaveBeenCalledWith(session);
    f.reconnect(); // The production game performs a new hello for every request.
    expect(await f.request('stx_getAddresses')).toMatchObject({ ok: true, result: { address } });
  });
  it('does not connect when host review is cancelled', async () => {
    const h = setup();
    h.review.mockResolvedValue(false);
    const f = await h.frame();
    expect(await f.request('stx_requestAccounts')).toMatchObject({
      ok: false,
      error: { code: 4001 }
    });
    expect(h.wallet.connect).not.toHaveBeenCalled();
  });
  it('forwards the exact cafe amount, memo, requested fee and signer after review', async () => {
    const h = setup();
    const f = await h.frame();
    await f.request('stx_requestAccounts');
    expect(await f.request('stx_transferStx', payment)).toMatchObject({
      ok: true,
      result: { txId: 'mock-tx' }
    });
    expect(h.transfer.mock.calls[0][0]).toMatchObject({
      recipient,
      amount: '1000000',
      fee: '3000',
      memo: 'TD:WEDNESDAY:1',
      stxAddress: address
    });
  });
  it('supports the existing one-microSTX save memo without a fee or sender field', async () => {
    const h = setup();
    const f = await h.frame();
    await f.request('stx_requestAccounts');
    expect(
      await f.request('stx_transferStx', { recipient: address, amount: '1', memo: 'TD1:abc:1' })
    ).toMatchObject({ ok: true });
    expect(h.transfer.mock.calls[0][0]).toMatchObject({
      amount: '1',
      fee: undefined,
      stxAddress: address
    });
  });
  it.each([{ address: recipient }, { network: 'testnet' }])(
    'refuses wrong signing account or network %j',
    async (change) => {
      const h = setup();
      const f = await h.frame();
      await f.request('stx_requestAccounts');
      expect(await f.request('stx_transferStx', { ...payment, ...change })).toMatchObject({
        ok: false,
        error: { code: -32602 }
      });
      expect(h.transfer).not.toHaveBeenCalled();
    }
  );
  it('rechecks the wallet after host approval, including requests without a sender', async () => {
    const h = setup();
    const f = await h.frame();
    await f.request('stx_requestAccounts');
    h.review.mockImplementation(async () => {
      h.wallet.getSession.mockReturnValue({ ...session, address: recipient });
      return true;
    });
    expect(await f.request('stx_transferStx', { recipient, amount: '1' })).toMatchObject({
      ok: false,
      error: { code: -32602 }
    });
    expect(h.transfer).not.toHaveBeenCalled();
  });
  it.each(['cancel', 'error', 'throw'])('returns provider %s without retrying', async (outcome) => {
    const h = setup();
    const f = await h.frame();
    await f.request('stx_requestAccounts');
    h.transfer.mockImplementation((options) => {
      if (outcome === 'cancel') options.onCancel();
      else if (outcome === 'error') options.onError(new Error('Provider failure'));
      else throw Error('Provider failure');
    });
    expect(await f.request('stx_transferStx', payment)).toMatchObject({
      ok: false,
      error: { code: outcome === 'cancel' ? 4001 : -32603 }
    });
    expect(h.transfer).toHaveBeenCalledOnce();
  });
  it('refuses tokens stolen from another registered frame', async () => {
    const h = setup();
    const first = await h.frame();
    const second = await h.frame();
    expect(
      await second.request('stx_requestAccounts', {}, { bridgeToken: first.token() })
    ).toMatchObject({ ok: false, error: { code: -32600 } });
    expect(h.review).not.toHaveBeenCalled();
  });
  it('rejects replayed requests without a second payment', async () => {
    const h = setup();
    const f = await h.frame();
    await f.request('stx_requestAccounts');
    await f.request('stx_transferStx', payment, { requestId: 'same-id' });
    expect(await f.request('stx_transferStx', payment, { requestId: 'same-id' })).toMatchObject({
      ok: false,
      error: { code: -32600 }
    });
    expect(h.transfer).toHaveBeenCalledOnce();
  });
  it.each(['remove', 'load', 'hide'])('stops approval after preview %s', async (change) => {
    const h = setup();
    const f = await h.frame();
    await f.request('stx_requestAccounts');
    h.review.mockImplementation(async () => {
      if (change === 'remove') f.element.remove();
      else if (change === 'load') f.element.dispatchEvent(new Event('load'));
      else f.element.hidden = true;
      return true;
    });
    expect(await f.request('stx_transferStx', payment)).toMatchObject({
      ok: false,
      error: { code: 4001 }
    });
    expect(h.transfer).not.toHaveBeenCalled();
  });
  it('refuses operations while the host is busy and unsupported contract calls', async () => {
    const h = setup();
    const f = await h.frame();
    h.isBusy.mockReturnValue(true);
    expect(await f.request('stx_requestAccounts')).toMatchObject({
      ok: false,
      error: { code: -32002 }
    });
    expect(await f.request('stx_callContract')).toMatchObject({
      ok: false,
      error: { code: -32601 }
    });
    expect(h.review).not.toHaveBeenCalled();
  });
  it('rejects a second concurrent wallet operation', async () => {
    const h = setup();
    const f = await h.frame();
    let finish!: (value: boolean) => void;
    h.review.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        })
    );
    f.emit({
      type: 'xtrata:wallet:request',
      requestId: 'held',
      bridgeToken: f.token(),
      method: 'stx_requestAccounts'
    });
    expect(await f.request('stx_requestAccounts')).toMatchObject({
      ok: false,
      error: { code: -32002 }
    });
    finish(false);
  });
});

describe('native payment validation', () => {
  it.each(['-1', '0', '1.5', '18446744073709551616', Number.MAX_SAFE_INTEGER + 1])(
    'refuses invalid amount %s',
    (amount) => {
      expect(() => parsePublicPayment({ ...payment, amount }, session)).toThrow();
    }
  );
  it.each(['0', '-1', '1000001', 'NaN'])('omits invalid fee %s', (fee) => {
    expect(parsePublicPayment({ ...payment, fee }, session).fee).toBeUndefined();
  });
  it('validates recipient, UTF-8 memo length and explicit network', () => {
    expect(() => parsePublicPayment({ ...payment, recipient: 'bad' }, session)).toThrow();
    expect(() => parsePublicPayment({ ...payment, memo: 'é'.repeat(18) }, session)).toThrow();
    expect(() => parsePublicPayment({ ...payment, network: 'unknown' }, session)).toThrow();
  });
});

describe('scoped game-save bridge', () => {
  it('requires a connected, authorized preview and rechecks account before save submission', async () => {
    let latestGuard: (() => void) | undefined;
    const gameSave = vi.fn(async (_method, _params, _session, _label, guard) => {
      latestGuard = guard;
      guard();
      return { status: 'submitted' };
    });
    const h = setup(gameSave),
      f = await h.frame();
    expect(await f.request('xtrata_saveGame', {})).toMatchObject({ ok: false });
    expect(gameSave).not.toHaveBeenCalled();
    await f.request('stx_requestAccounts');
    expect(await f.request('xtrata_saveGame', {})).toMatchObject({ ok: true });
    expect(gameSave.mock.calls[0][0]).toBe('xtrata_saveGame');
    h.wallet.getSession.mockReturnValue({ ...session, address: recipient });
    expect(() => latestGuard!()).toThrow(/changed/);
    expect(h.pendingChanged.mock.calls.at(-1)).toEqual([false]);
  });
});
