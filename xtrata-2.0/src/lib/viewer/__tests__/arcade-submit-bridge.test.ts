// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installPublicWalletBridge } from '../public-wallet-bridge';
import { arcadeSubmitUrl, describeArcadePayload } from '../arcade-submit-host';

const payload = { v: 1, game: 'astro-blaster-3', network: 'mainnet', board: 'astro3', period: 0, score: 12345, name: 'ACE', replay: 'QUIz' };
const disposals: Array<() => void> = [];
afterEach(() => { disposals.splice(0).forEach((fn) => fn()); document.body.replaceChildren(); vi.restoreAllMocks(); });

async function setup(arcadeSubmit?: any) {
  const wallet = { getSession: vi.fn(() => ({ isConnected: false })), connect: vi.fn(), disconnect: vi.fn() };
  const bridge = installPublicWalletBridge({
    host: window, wallet: wallet as any, review: vi.fn(async () => true), transfer: vi.fn(), sessionChanged: vi.fn(), arcadeSubmit
  });
  disposals.push(bridge.dispose);
  const element = document.createElement('iframe');
  document.body.append(element);
  await new Promise((r) => setTimeout(r, 0));
  vi.spyOn(element, 'getClientRects').mockReturnValue([{}] as any);
  bridge.register(element, 'Inscription #9001');
  const sent = vi.spyOn(element.contentWindow!, 'postMessage').mockImplementation(() => {});
  const emit = (data: unknown, origin = 'null', source: any = element.contentWindow) =>
    window.dispatchEvent(new MessageEvent('message', { data, source, origin }));
  return { element, sent, emit, wallet };
}
const flush = () => new Promise((r) => setTimeout(r, 0));

describe('arcade submit hand-off', () => {
  it('acknowledges, asks the host, and never touches the wallet', async () => {
    const tab = {} as Window;
    const arcadeSubmit = vi.fn(async () => ({ kind: 'tab' as const, tab }));
    const { sent, emit, wallet } = await setup(arcadeSubmit);
    emit({ type: 'xtrata:arcade:submit', id: 'ab3-1', payload });
    await flush();
    expect(sent.mock.calls[0][0]).toEqual({ type: 'xtrata:arcade:submit-opened', id: 'ab3-1' });
    expect(arcadeSubmit).toHaveBeenCalledWith(payload, 'Inscription #9001', 'ab3-1');
    expect(wallet.connect).not.toHaveBeenCalled();
    // the result from the opened tab is forwarded to the game
    emit({ type: 'xtrata:arcade:submit-result', id: 'ab3-1', txId: '0x' + 'a'.repeat(64) }, window.location.origin, tab);
    expect(sent.mock.calls.at(-1)![0]).toMatchObject({ type: 'xtrata:arcade:submit-result', id: 'ab3-1', txId: '0x' + 'a'.repeat(64) });
  });

  it('ignores results that do not come from the host origin or the opened tab', async () => {
    const tab = {} as Window;
    const { sent, emit } = await setup(vi.fn(async () => ({ kind: 'tab' as const, tab })));
    emit({ type: 'xtrata:arcade:submit', id: 'ab3-2', payload });
    await flush();
    sent.mockClear();
    emit({ type: 'xtrata:arcade:submit-result', id: 'ab3-2', txId: '0x' + 'b'.repeat(64) }); // from the game frame itself
    emit({ type: 'xtrata:arcade:submit-result', id: 'ab3-2', txId: '0x' + 'b'.repeat(64) }, 'https://evil.example', tab);
    emit({ type: 'xtrata:arcade:submit-result', id: 'ab3-2', txId: '0x' + 'b'.repeat(64) }, window.location.origin, {} as Window);
    expect(sent).not.toHaveBeenCalled();
  });

  it('forwards a transaction signed in the host dialog', async () => {
    const txId = '0x' + 'c'.repeat(64);
    const { sent, emit } = await setup(vi.fn(async () => ({ kind: 'tx' as const, txId })));
    emit({ type: 'xtrata:arcade:submit', id: 'ab3-7', payload });
    await flush();
    expect(sent.mock.calls[0][0]).toEqual({ type: 'xtrata:arcade:submit-opened', id: 'ab3-7' });
    expect(sent.mock.calls.at(-1)![0]).toEqual({ type: 'xtrata:arcade:submit-result', id: 'ab3-7', txId });
  });

  it('reports a cancelled review back to the game', async () => {
    const { sent, emit } = await setup(vi.fn(async () => null));
    emit({ type: 'xtrata:arcade:submit', id: 'ab3-3', payload });
    await flush();
    expect(sent.mock.calls.at(-1)![0]).toEqual({ type: 'xtrata:arcade:submit-result', id: 'ab3-3', cancelled: true });
  });

  it('ignores unregistered frames, bad ids and hosts without the feature', async () => {
    const arcadeSubmit = vi.fn(async () => null);
    const a = await setup(arcadeSubmit);
    a.emit({ type: 'xtrata:arcade:submit', id: 'bad id!', payload });
    a.emit({ type: 'xtrata:arcade:submit', id: 'ok-1', payload }, 'null', window); // not the registered frame
    await flush();
    expect(arcadeSubmit).not.toHaveBeenCalled();
    const b = await setup(undefined);
    b.emit({ type: 'xtrata:arcade:submit', id: 'ok-2', payload });
    await flush();
    expect(b.sent).not.toHaveBeenCalled();
  });

  it('refuses oversized payloads', async () => {
    const arcadeSubmit = vi.fn(async () => null);
    const { sent, emit } = await setup(arcadeSubmit);
    emit({ type: 'xtrata:arcade:submit', id: 'big', payload: { ...payload, replay: 'A'.repeat(130_000) } });
    await flush();
    expect(arcadeSubmit).not.toHaveBeenCalled();
    expect(sent.mock.calls[0][0]).toMatchObject({ type: 'xtrata:arcade:submit-result', id: 'big', error: expect.stringContaining('too large') });
  });

  it('builds the submit URL and validates what the host dialog shows', () => {
    const url = arcadeSubmitUrl('https://xtrata.xyz', payload, 'ab3-1');
    expect(url.startsWith('https://xtrata.xyz/arcade/submit#p=')).toBe(true);
    expect(url.endsWith('&id=ab3-1')).toBe(true);
    expect(describeArcadePayload(payload)).toEqual({ name: 'ACE', score: 12345, board: 'Campaign' });
    expect(() => describeArcadePayload({ ...payload, name: '<img>' })).toThrow();
    expect(() => describeArcadePayload({ ...payload, game: 'other' })).toThrow();
  });
});

describe('arcade dialog spam', () => {
  it('keeps one host review open at a time', async () => {
    let release: (v: null) => void = () => {};
    const arcadeSubmit = vi.fn(() => new Promise<null>((r) => { release = r; }));
    const { sent, emit } = await setup(arcadeSubmit);
    emit({ type: 'xtrata:arcade:submit', id: 'a1', payload });
    emit({ type: 'xtrata:arcade:submit', id: 'a2', payload });
    emit({ type: 'xtrata:arcade:submit', id: 'a3', payload });
    await flush();
    expect(arcadeSubmit).toHaveBeenCalledTimes(1);
    expect(sent.mock.calls.filter((c) => (c[0] as any).error?.includes('already waiting'))).toHaveLength(2);
    release(null); await flush(); await flush();
    emit({ type: 'xtrata:arcade:submit', id: 'a4', payload });
    await flush();
    expect(arcadeSubmit).toHaveBeenCalledTimes(2);
  });
});
