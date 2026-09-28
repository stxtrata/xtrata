import { describe, expect, it } from 'vitest';
import { PostConditionMode } from '@stacks/transactions';
import { ARCADE_CONTRACT_ID, buildSubmitCall, engine, parsePayload, PayloadError, verifyPayload } from '../core';

type Sim = {
  createGame(o: object): { score: number; phase: string };
  step(st: unknown, i: unknown): void;
  botInput(st: unknown): { ax: number; ay: number; cmd: number };
  Recorder: new () => { push(i: unknown): void };
  encodeReplay(st: unknown, rec: unknown): Promise<Uint8Array>;
  toBase64Url(b: Uint8Array): string;
};
const AB3 = engine as unknown as Sim;
const ADDR = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const PILOT = Uint8Array.from('e55cbbaafd88b6e63b036a3a2303b029e039cbbd'.match(/../g)!.map((h) => parseInt(h, 16)));

async function makeRun(opts: object = { seed: 5 }, frames = 3000, pilot: Uint8Array | null = PILOT) {
  const st = AB3.createGame({ ...opts, pilot, pilotVersion: 22 }); const rec = new AB3.Recorder();
  for (let f = 0; f < frames && st.phase !== 'over'; f++) { const i = AB3.botInput(st); rec.push(i); AB3.step(st, i); }
  return { score: st.score, bytes: await AB3.encodeReplay(st, rec) };
}
function link(obj: object) {
  return '#p=' + AB3.toBase64Url(new TextEncoder().encode(JSON.stringify(obj))) + '&id=ab3-1';
}
const base = (r: { score: number; bytes: Uint8Array }, extra: object = {}) => ({
  v: 1, game: 'astro-blaster-3', network: 'mainnet', contract: ARCADE_CONTRACT_ID,
  board: 'astro3', period: 0, score: r.score, name: 'Jim.btc', replay: AB3.toBase64Url(r.bytes), ...extra
});

describe('arcade submit payload', () => {
  it('parses a link from the game and verifies the replayed score', async () => {
    const r = await makeRun();
    const p = parsePayload(link(base(r)));
    expect(p.claimedScore).toBe(r.score);
    const v = await verifyPayload(p);
    expect(v).toEqual({ ok: true, score: r.score, frames: expect.any(Number) });
  });

  it('refuses a claimed score the replay does not reach', async () => {
    const r = await makeRun();
    const v = await verifyPayload(parsePayload(link(base(r, { score: r.score + 500 }))));
    expect(v.ok).toBe(false);
  });

  it('refuses a campaign run on the daily board and a daily run for another day', async () => {
    const r = await makeRun();
    expect((await verifyPayload(parsePayload(link(base(r, { board: 'astro3-daily', period: 7 }))))).ok).toBe(false);
    const d = await makeRun({ mode: 1, period: 7 }, 1500);
    expect((await verifyPayload(parsePayload(link(base(d, { board: 'astro3-daily', period: 7 }))))).ok).toBe(true);
    expect((await verifyPayload(parsePayload(link(base(d, { board: 'astro3-daily', period: 8 }))))).ok).toBe(false);
  });

  it('rejects bad links with a readable error', async () => {
    const r = await makeRun({ seed: 9 }, 300);
    expect(() => parsePayload('')).toThrow(PayloadError);
    expect(() => parsePayload('#p=%%%')).toThrow(PayloadError);
    expect(() => parsePayload(link(base(r, { contract: 'SP000.other' })))).toThrow(/different leaderboard/);
    expect(() => parsePayload(link(base(r, { board: 'other' })))).toThrow(/Unknown leaderboard/);
    expect(() => parsePayload(link(base(r, { name: '<b>' })))).toThrow(/Names/);
    expect(() => parsePayload(link(base(r, { period: 3 })))).toThrow(/period/);
    expect(() => parsePayload(link(base(r, { network: 'testnet' })))).toThrow(/mainnet/);
  });
});

describe('pilot binding', () => {
  it('reads the pilot from the replay and refuses other wallets', async () => {
    const r = await makeRun({ seed: 3 }, 500);
    const p = parsePayload(link(base(r)));
    expect(p.pilot).toBe(ADDR);
    expect(() => buildSubmitCall(p, r.score, 'SP000000000000000000002Q6VF78', { fee: 0n, enabled: true, maxScore: 10n ** 9n })).toThrow(/flown as SP3JNSEX/);
  });
  it('refuses practice runs that have no pilot', async () => {
    const r = await makeRun({ seed: 3 }, 500, null);
    expect(() => parsePayload(link(base(r)))).toThrow(/practice run/);
  });
});

describe('arcade submit contract call', () => {
  it('uses deny mode, no post-conditions and no sender when the board is free', async () => {
    const r = await makeRun({ seed: 3 }, 500);
    const call = buildSubmitCall(parsePayload(link(base(r))), r.score, ADDR, { fee: 0n, enabled: true, maxScore: 10n ** 9n });
    expect(call.functionName).toBe('submit-score');
    expect(call.postConditionMode).toBe(PostConditionMode.Deny);
    expect(call.postConditions).toEqual([]);
    expect(call.stxAddress).toBe(ADDR);
    expect(call).not.toHaveProperty('sender');
    expect(call.functionArgs).toHaveLength(5);
  });

  it('allows exactly the entry fee when the board has one', async () => {
    const r = await makeRun({ seed: 3 }, 500);
    const call = buildSubmitCall(parsePayload(link(base(r))), r.score, ADDR, { fee: 10_000n, enabled: true, maxScore: 10n ** 9n });
    expect(call.postConditions).toHaveLength(1);
    expect(JSON.stringify(call.postConditions[0], (_k, v) => (typeof v === 'bigint' ? v.toString() : v))).toContain('10000');
  });

  it('refuses testnet wallets, closed boards and over-cap scores', async () => {
    const r = await makeRun({ seed: 3 }, 500);
    const p = parsePayload(link(base(r)));
    expect(() => buildSubmitCall(p, r.score, 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', { fee: 0n, enabled: true, maxScore: 10n ** 9n })).toThrow(/mainnet/);
    expect(() => buildSubmitCall(p, r.score, ADDR, { fee: 0n, enabled: false, maxScore: 10n ** 9n })).toThrow(/closed/);
    expect(() => buildSubmitCall(p, r.score, ADDR, { fee: 0n, enabled: true, maxScore: 1n })).toThrow(/limit/);
  });
});

describe('engine parity', () => {
  it('the submit page verifies with exactly the engine the game ships', async () => {
    const { readFileSync } = await import('node:fs');
    const page = readFileSync('src/arcade-submit/ab3-engine.js', 'utf8');
    const game = readFileSync('recursive-apps/astro-blaster-3/release/sim.js', 'utf8');
    expect(page).toBe(game);
  });
});
