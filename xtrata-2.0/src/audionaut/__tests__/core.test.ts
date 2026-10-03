import { describe, expect, it } from 'vitest';
import {
  CORE_ASSET_ID,
  findAudionaut,
  isSomeResult,
  parseUintRepr,
  uintArgHex
} from '../core';

const ADDR = 'SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX';

const json = (body: unknown, ok = true) =>
  ({ ok, status: ok ? 200 : 500, json: async () => body }) as unknown as Response;

// Fake Hiro: `held` = ids in the wallet, `minted` = ids the collection contract knows.
const fakeHiro = (held: number[], minted: number[]) => {
  const calls: string[] = [];
  const fetchImpl = (async (url: string, init?: RequestInit) => {
    calls.push(String(url));
    if (String(url).includes('/nft/holdings')) {
      const offset = Number(new URL('http://x' + url).searchParams.get('offset') ?? 0);
      const page = held.slice(offset, offset + 50);
      return json({ total: held.length, results: page.map((id) => ({ value: { repr: `u${id}` } })) });
    }
    const arg = JSON.parse(String(init?.body)).arguments[0] as string;
    const id = Number(BigInt(arg.slice(4)));
    return json({ okay: true, result: minted.includes(id) ? '0x0a0c00000003' : '0x09' });
  }) as unknown as typeof fetch;
  return { fetchImpl, calls };
};

describe('audionaut gate core', () => {
  it('encodes uints and parses reprs', () => {
    expect(uintArgHex(3059)).toBe('0x01' + '0'.repeat(28) + '0bf3');
    expect(parseUintRepr('u42')).toBe(42);
    expect(parseUintRepr('42')).toBeNull();
    expect(parseUintRepr(undefined)).toBeNull();
    expect(isSomeResult('0x0a00')).toBe(true);
    expect(isSomeResult('0x09')).toBe(false);
  });

  it('queries the core inscription asset', () => {
    expect(CORE_ASSET_ID).toContain('xtrata-v3-2-3::xtrata-inscription');
  });

  it('grants when a held id was minted by the collection', async () => {
    const { fetchImpl } = fakeHiro([5, 3100, 7], [3100]);
    const r = await findAudionaut(ADDR, { fetchImpl, hiroBase: '/h' });
    expect(r).toMatchObject({ holds: true, tokenId: 3100 });
  });

  it('denies when nothing held is an Audionaut, and when nothing is held', async () => {
    expect((await findAudionaut(ADDR, { fetchImpl: fakeHiro([1, 2], [3100]).fetchImpl })).holds).toBe(false);
    const none = fakeHiro([], [3100]);
    expect((await findAudionaut(ADDR, { fetchImpl: none.fetchImpl })).holds).toBe(false);
    expect(none.calls.every((c) => c.includes('/nft/holdings'))).toBe(true);
  });

  it('pages through large wallets and stops early on a hit', async () => {
    const held = Array.from({ length: 120 }, (_, i) => i + 1);
    const { fetchImpl, calls } = fakeHiro(held, [3]);
    const r = await findAudionaut(ADDR, { fetchImpl });
    expect(r.holds).toBe(true);
    expect(calls.filter((c) => !c.includes('/nft/holdings')).length).toBe(8); // first batch only
  });

  it('rejects non-mainnet addresses and surfaces lookup failures', async () => {
    await expect(findAudionaut('ST123', {})).rejects.toThrow(/mainnet/);
    const failing = (async () => json({}, false)) as unknown as typeof fetch;
    await expect(findAudionaut(ADDR, { fetchImpl: failing })).rejects.toThrow(/Holdings lookup failed/);
  });
});
