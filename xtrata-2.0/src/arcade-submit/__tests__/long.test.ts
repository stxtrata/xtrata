import { afterEach, describe, expect, it, vi } from 'vitest';
import { Cl, cvToHex, PostConditionMode, ClarityType, type ListCV, type BufferCV } from '@stacks/transactions';
import { ARCADE_BOARDS, ARCADE_CONTRACT_ID, CORE_CONTRACT, INLINE_MAX, isLongReplay, makeReplayPointer, parsePayload, replayChainHash, verifyPayload } from '../core';
import { postRun } from '../long';

const PILOT = Uint8Array.from('e55cbbaafd88b6e63b036a3a2303b029e039cbbd'.match(/../g)!.map((h) => parseInt(h, 16)));
const ADDR = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const b64 = (b: Uint8Array) => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

/** A format-2 replay of `size` bytes (raw body, so verifyPayload does not need to inflate it). */
function longReplay(size: number, score = 4321) {
  const b = new Uint8Array(size);
  b.set([88, 65, 82, 2 | 128]); b.set(PILOT, 4); b[24] = 22; b[25] = 2;
  const dv = new DataView(b.buffer);
  dv.setUint16(26, 1, true); dv.setUint32(28, 99, true); dv.setUint32(32, 400000, true); dv.setUint32(36, score, true);
  b[40] = ARCADE_BOARDS.xa_block_defence.gameIdx; b[41] = 0;
  for (let i = 44; i < size; i++) b[i] = (i * 31 + 7) & 255;
  return b;
}
const payload = (r: Uint8Array) => parsePayload({ v: 1, game: 'xtrata-arcade', network: 'mainnet', contract: ARCADE_CONTRACT_ID, board: 'xa_block_defence', period: 0, score: 4321, name: 'MOOFV', replay: b64(r) });

describe('long replays', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('builds exactly the pointer the arcade engine builds (XA.replay.makePointer)', () => {
    // Vector from the engine (arcade-replay.js) for a 70,000-byte replay, inscription id 31337.
    const full = new Uint8Array(70000); full.set([88, 65, 82, 2]);
    for (let i = 4; i < 44; i++) full[i] = (i * 7) & 255;
    for (let i = 44; i < full.length; i++) full[i] = (i * 31 + 7) & 255;
    const h = replayChainHash(full);
    expect(Buffer.from(h).toString('hex')).toBe('9bbef316a2db9ce22175f75b7b7f0e6e491c63d58e5f6ddaa0e1eafbba53c99d');
    expect(Buffer.from(makeReplayPointer(full, 31337, h)).toString('hex')).toBe(
      '584152831c232a31383f464d545b626970777e858c939aa1a8afb6bdc4cbd2d9e0e7eef5fc030a11181f262d01e9f4019bbef316a2db9ce22175f75b7b7f0e6e491c63d58e5f6ddaa0e1eafbba53c99df0a204');
  });

  it('accepts a long arcade replay (up to 512 KB) and a 4-hour run', async () => {
    const p = payload(longReplay(200_000));
    expect(isLongReplay(p)).toBe(true);
    expect(await verifyPayload(p)).toMatchObject({ ok: true, score: 4321 });
    expect(() => payload(longReplay(600_000))).toThrow(/1–524288/);
    expect(isLongReplay(payload(longReplay(INLINE_MAX)))).toBe(false);
  });

  it('stores the replay with mint-single-tx, waits for it, then posts a pointer', async () => {
    const r = longReplay(100_000), p = payload(r);
    let stored: number | null = null;
    vi.stubGlobal('fetch', vi.fn(async (url: string, init?: { body?: string }) => {
      const fn = String(url).split('/').pop();
      if (String(url).includes('/extended/v1/tx/')) return new Response(JSON.stringify({ tx_status: 'success' }));
      const ok = (cv: any) => new Response(JSON.stringify({ okay: true, result: cvToHex(cv) }));
      if (fn === 'quote-single-tx-fee') return ok(Cl.ok(Cl.tuple({ 'total-fee': Cl.uint(17000) })));
      if (fn === 'get-id-by-hash') return ok(stored === null ? Cl.none() : Cl.some(Cl.uint(stored)));
      throw new Error('unexpected ' + url + init?.body);
    }));
    const calls: any[] = [];
    const sign = vi.fn(async (call: any) => {
      calls.push(call);
      if (call.functionName === 'mint-single-tx') stored = 6001;
      return '0x' + String(calls.length).repeat(64);
    });
    const status: string[] = [];
    const res = await postRun({ p, score: 4321, address: ADDR, board: { fee: 0n, enabled: true, maxScore: 10n ** 12n }, sign, onStatus: (t) => status.push(t), idWaitMs: 100 });
    expect(calls.map((c) => c.functionName)).toEqual(['mint-single-tx', 'submit-score']);
    const mint = calls[0];
    expect(`${mint.contractAddress}.${mint.contractName}`).toBe(`${CORE_CONTRACT.address}.${CORE_CONTRACT.name}`);
    expect(mint.postConditionMode).toBe(PostConditionMode.Deny);
    expect(mint.postConditions).toHaveLength(1);
    const listCv: any = mint.functionArgs[3];
    const chunks = listCv.list ?? listCv.value;   // @stacks/transactions v6 (.list) or v7 (.value)
    expect(chunks).toHaveLength(Math.ceil(100_000 / 16384));
    const pointer = (calls[1].functionArgs[4] as BufferCV);
    expect(pointer.type).toBe(ClarityType.Buffer);
    const pv: any = pointer;
    const bytes = pv.buffer instanceof Uint8Array ? Buffer.from(pv.buffer) : Buffer.from(String(pv.value), 'hex');
    expect(bytes[3] & 127).toBe(3);
    expect(bytes.subarray(4, 24)).toEqual(Buffer.from(PILOT));
    expect(bytes.length).toBeLessThan(120);
    expect(res.replayId).toBe(6001);
    expect(status.join(' ')).toMatch(/Approve 1 of 2.*Approve 2 of 2/);
  });

  it('re-uses a replay that is already inscribed: one approval, nothing paid twice', async () => {
    const p = payload(longReplay(90_000));
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      const fn = String(url).split('/').pop();
      if (fn === 'get-id-by-hash') return new Response(JSON.stringify({ okay: true, result: cvToHex(Cl.some(Cl.uint(777))) }));
      throw new Error('unexpected ' + url);
    }));
    const sign = vi.fn(async () => '0x' + 'a'.repeat(64));
    const res = await postRun({ p, score: 4321, address: ADDR, board: { fee: 0n, enabled: true, maxScore: 10n ** 12n }, sign, onStatus: () => {} });
    expect(sign).toHaveBeenCalledTimes(1);
    expect(res.replayId).toBe(777);
  });

  it('refuses before signing when the wallet is not the pilot', async () => {
    const p = payload(longReplay(90_000));
    const sign = vi.fn();
    await expect(postRun({ p, score: 4321, address: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR', board: { fee: 0n, enabled: true, maxScore: 10n ** 12n }, sign, onStatus: () => {} })).rejects.toThrow(/flown as/);
    expect(sign).not.toHaveBeenCalled();
  });

  it('accepts a sealed run (header + fingerprints) and rejects a malformed seal', async () => {
    const full = longReplay(300000);
    const seal = new Uint8Array(44 + 1 + 64 + 3);
    seal.set(full.subarray(0, 44)); seal[3] = 3 | 128; seal[44] = 2;
    seal.set(replayChainHash(full), 45); seal.set(new Uint8Array(32).fill(7), 77);
    seal.set([0xe0, 0xa7, 0x12], 109);               // varint(300000)
    const p = payload(seal);
    expect(isLongReplay(p)).toBe(false);
    expect(await verifyPayload(p)).toMatchObject({ ok: true, score: 4321 });
    const bad = seal.slice(); bad[44] = 9;            // not a seal
    expect((await verifyPayload(payload(bad))).ok).toBe(false);
    const ptr = makeReplayPointer(full, 1234, replayChainHash(full));   // a bare pointer must not be submitted as-is
    expect((await verifyPayload(payload(ptr))).ok).toBe(false);
  });
});
