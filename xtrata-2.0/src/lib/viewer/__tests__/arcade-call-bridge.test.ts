// @vitest-environment happy-dom
// The deployed arcade (#3076) signs score posts with stx_callContract. The public viewer must accept exactly that call.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Cl, cvToHex } from '@stacks/transactions';
import { installPublicWalletBridge } from '../public-wallet-bridge';
import { arcadeCallToPayload } from '../arcade-submit-host';
// Captured from the inscribed arcade build (XAScores.submit under a host bridge), unmodified.
const realCall = {
  "contract": "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-arcade-scores-v2",
  "contractAddress": "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X",
  "contractName": "xtrata-arcade-scores-v2",
  "functionName": "submit-score",
  "functionArgs": [
    "0x0d0000000d78615f6e656f6e5f736e616b65",
    "0x0100000000000000000000000000000000",
    "0x01000000000000000000000000000010e1",
    "0x0d000000074a696d2e627463",
    "0x020000003c584152810000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
  ],
  "network": "mainnet",
  "postConditionMode": "deny",
  "postConditions": [
    {
      "type": "stx",
      "principal": "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X",
      "amount": "0",
      "conditionCode": "lte"
    }
  ]
};

const ADDR = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const CID = ADDR + '.xtrata-arcade-scores-v2';
const replay = new Uint8Array(46); replay.set([88, 65, 82, 129]);
const params = (over: Record<string, unknown> = {}) => ({
  contract: CID, contractAddress: ADDR, contractName: 'xtrata-arcade-scores-v2', functionName: 'submit-score',
  functionArgs: [Cl.stringAscii('xa_neon_snake'), Cl.uint(0), Cl.uint(4321), Cl.stringAscii('Jim.btc'), Cl.buffer(replay)].map(cvToHex),
  network: 'mainnet', ...over
});
const disposals: Array<() => void> = [];
afterEach(() => { disposals.splice(0).forEach((f) => f()); document.body.replaceChildren(); vi.restoreAllMocks(); });

describe('arcadeCallToPayload', () => {
  it('turns the arcade submit-score call into the reviewed hand-off payload', () => {
    const p = arcadeCallToPayload(params());
    expect(p).toMatchObject({ v: 1, game: 'xtrata-arcade', board: 'xa_neon_snake', period: 0, score: 4321, name: 'Jim.btc', contract: CID });
    expect(typeof p.replay).toBe('string');
  });
  it('accepts the exact call captured from the inscribed arcade (#3076) running under a host bridge', () => {
    const p = arcadeCallToPayload(realCall);
    expect(p).toMatchObject({ game: 'xtrata-arcade', board: 'xa_neon_snake', score: 4321, name: 'Jim.btc', period: 0 });
  });
  it('refuses other contracts, functions, boards and periods', () => {
    expect(() => arcadeCallToPayload(params({ contract: ADDR + '.other' }))).toThrow();
    expect(() => arcadeCallToPayload(params({ functionName: 'set-board' }))).toThrow();
    const bad = (a: any[]) => arcadeCallToPayload(params({ functionArgs: a.map(cvToHex) }));
    expect(() => bad([Cl.stringAscii('astro3'), Cl.uint(0), Cl.uint(1), Cl.stringAscii('Jim.btc'), Cl.buffer(replay)])).toThrow();
    expect(() => bad([Cl.stringAscii('xa_neon_snake'), Cl.uint(5), Cl.uint(1), Cl.stringAscii('Jim.btc'), Cl.buffer(replay)])).toThrow();
    expect(() => bad([Cl.stringAscii('xa_neon_snake'), Cl.uint(0), Cl.uint(1)])).toThrow();
  });
});

describe('bridge: stx_callContract from the arcade', () => {
  async function setup(arcadeSubmit: any, opts: { loadAfterHello?: boolean } = {}) {
    const session = { isConnected: true, address: ADDR, network: 'mainnet' };
    const wallet = { getSession: () => session, connect: vi.fn(async () => session), disconnect: vi.fn() };
    const bridge = installPublicWalletBridge({ host: window, wallet: wallet as any, review: vi.fn(async () => true), transfer: vi.fn(), sessionChanged: vi.fn(), arcadeSubmit });
    disposals.push(bridge.dispose);
    const el = document.createElement('iframe'); document.body.append(el);
    await new Promise((r) => setTimeout(r, 0));
    vi.spyOn(el, 'getClientRects').mockReturnValue([{}] as any);
    bridge.register(el, 'Inscription #3076');
    const sent = vi.spyOn(el.contentWindow!, 'postMessage').mockImplementation(() => {});
    const emit = (data: unknown) => window.dispatchEvent(new MessageEvent('message', { data, source: el.contentWindow, origin: 'null' }));
    const flush = () => new Promise((r) => setTimeout(r, 5));
    emit({ type: 'xtrata:wallet:hello', nonce: 'n1' }); await flush();
    const token = (sent.mock.calls[0][0] as any).bridgeToken;
    const load = () => el.dispatchEvent(new Event('load'));
    if (opts.loadAfterHello) load();
    let n = 0;
    const call = async (method: string, prm: unknown) => {
      sent.mockClear();
      emit({ type: 'xtrata:wallet:request', requestId: 'r' + ++n, bridgeToken: token, method, params: prm });
      await flush();
      return sent.mock.calls.at(-1)![0] as any;
    };
    if (!opts.loadAfterHello) await call('stx_requestAccounts', {});
    return { call, sent, load };
  }

  it('reviews the run in the host and returns the txid', async () => {
    const txId = '0x' + 'd'.repeat(64);
    const arcadeSubmit = vi.fn(async () => ({ kind: 'tx' as const, txId }));
    const { call } = await setup(arcadeSubmit);
    const res = await call('stx_callContract', params());
    expect(res).toMatchObject({ type: 'xtrata:wallet:response', ok: true, result: { txid: txId } });
    expect(arcadeSubmit).toHaveBeenCalledWith(expect.objectContaining({ game: 'xtrata-arcade', board: 'xa_neon_snake', score: 4321 }), 'Inscription #3076', expect.stringMatching(/^xa-call-/));
  });

  it('reports a cancelled review and refuses anything else', async () => {
    const arcadeSubmit = vi.fn(async () => null);
    const { call } = await setup(arcadeSubmit);
    expect(await call('stx_callContract', params())).toMatchObject({ ok: false, error: { code: 4001 } });
    const other = await call('stx_callContract', params({ contract: ADDR + '.xtrata-v3-2-3', functionName: 'transfer' }));
    expect(other.ok).toBe(false);
    expect(arcadeSubmit).toHaveBeenCalledTimes(1);
  });

  it('keeps working when the arcade says hello once, before its document finishes loading', async () => {
    const txId = '0x' + 'e'.repeat(64);
    const arcadeSubmit = vi.fn(async () => ({ kind: 'tx' as const, txId }));
    const { call, load } = await setup(arcadeSubmit, { loadAfterHello: true });
    // the load event that follows the app's first-script handshake must not strand its token
    expect(await call('wallet_connect', { app: 'Xtrata Arcade' })).toMatchObject({ ok: true });
    expect(await call('stx_callContract', params())).toMatchObject({ ok: true, result: { txid: txId } });
    // consent is per document: a later load drops it and the old token stops working
    load();
    expect(await call('stx_callContract', params())).toMatchObject({ ok: false });
  });

  it('renews an expired token only for a connect review or an already-connected score post', async () => {
    const txId = '0x' + 'f'.repeat(64);
    const { call } = await setup(vi.fn(async () => ({ kind: 'tx' as const, txId })));
    vi.useFakeTimers({ toFake: ['Date'] });
    try {
      vi.setSystemTime(Date.now() + 11 * 60_000);
      expect(await call('stx_getAddresses', {})).toMatchObject({ ok: false, error: { code: -32600 } });
      expect(await call('stx_callContract', params())).toMatchObject({ ok: true, result: { txid: txId } });
      vi.setSystemTime(Date.now() + 11 * 60_000);
      expect(await call('wallet_connect', {})).toMatchObject({ ok: true });
    } finally { vi.useRealTimers(); }
  });

  it('is unavailable when the host has no arcade dialog', async () => {
    const { call } = await setup(undefined);
    expect(await call('stx_callContract', params())).toMatchObject({ ok: false, error: { code: -32601 } });
  });
});
