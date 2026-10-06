import { PostConditionMode } from '@stacks/transactions';
import { describe, expect, it } from 'vitest';
import { formatArcadeScore } from '../arcade-boards';
import { ARCADE_BOARDS, ARCADE_CONTRACT_ID, buildSubmitCall, engine, isPilot, parsePayload, PayloadError, verifyPayload } from '../core';
import { describeArcadePayload } from '../../lib/viewer/arcade-submit-host';

const AB3 = engine as unknown as { toBase64Url(b: Uint8Array): string };
const ADDR = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const PILOT = Uint8Array.from('e55cbbaafd88b6e63b036a3a2303b029e039cbbd'.match(/../g)!.map((h) => parseInt(h, 16)));

/** A minimal XAR replay: 44-byte header + raw (uncompressed, bit 7) empty event stream. */
function xar(board: string, score: number, o: { steps?: number; done?: boolean; pilot?: Uint8Array } = {}) {
  const info = ARCADE_BOARDS[board];
  const b = new Uint8Array(44 + 2);
  b.set([88, 65, 82, 1 | 128]);
  b.set(o.pilot ?? PILOT, 4); b[24] = 22; b[25] = (info.time ? 1 : 0) | (o.done === false ? 0 : 2);
  const dv = new DataView(b.buffer);
  dv.setUint16(26, 1, true); dv.setUint32(28, 12345, true); dv.setUint32(32, o.steps ?? 600, true); dv.setUint32(36, score, true);
  b[40] = info.gameIdx; b[41] = info.variantIdx;
  return b;
}
const payload = (board: string, r: Uint8Array, score: number, extra: object = {}) => ({
  v: 1, game: 'xtrata-arcade', network: 'mainnet', contract: ARCADE_CONTRACT_ID, board, period: 0, score, name: 'Jim.btc', replay: AB3.toBase64Url(r), ...extra
});
const link = (o: object) => '#p=' + AB3.toBase64Url(new TextEncoder().encode(JSON.stringify(o))) + '&id=xa-1';

describe('arcade boards', () => {
  it('has the 26 registered boards', () => {
    expect(Object.keys(ARCADE_BOARDS)).toHaveLength(26);
    expect(Object.values(ARCADE_BOARDS).filter((b) => b.time)).toHaveLength(5);
    for (const id of Object.keys(ARCADE_BOARDS)) expect(id.length).toBeLessThanOrEqual(24);
  });

  it('parses, checks and builds a submit-score call for every board', async () => {
    for (const board of Object.keys(ARCADE_BOARDS)) {
      const r = xar(board, 4321);
      const p = parsePayload(link(payload(board, r, 4321)));
      expect(p.kind).toBe('xar');
      expect(await verifyPayload(p)).toEqual({ ok: true, score: 4321, frames: 600 });
      const call = buildSubmitCall(p, 4321, ADDR, { fee: 0n, enabled: true, maxScore: 999999999n });
      expect(call.functionName).toBe('submit-score');
      expect(call.postConditionMode).toBe(PostConditionMode.Deny);
      expect(call.functionArgs).toHaveLength(5);
    }
  });

  it('refuses a run for another wallet, another board, a wrong score, or a wrong mode', async () => {
    const r = xar('xa_neon_snake', 100);
    const p = parsePayload(link(payload('xa_neon_snake', r, 100)));
    expect(isPilot(p.replay, ADDR)).toBe(true);
    expect(isPilot(p.replay, 'SP000000000000000000002Q6VF78')).toBe(false);
    expect(() => buildSubmitCall(p, 100, 'SP000000000000000000002Q6VF78', { fee: 0n, enabled: true, maxScore: 10n ** 9n })).toThrow();
    expect((await verifyPayload(parsePayload(link(payload('xa_block_drop', r, 100))))).ok).toBe(false);          // wrong board
    expect((await verifyPayload(parsePayload(link(payload('xa_neon_snake', r, 101))))).ok).toBe(false);          // claimed != recorded
    expect((await verifyPayload(parsePayload(link(payload('xa_block_drop_sprint', xar('xa_block_drop_sprint', 900), 900))))).ok).toBe(true);
    const timeAsBase = xar('xa_block_drop_sprint', 900);
    expect((await verifyPayload(parsePayload(link(payload('xa_block_drop', timeAsBase, 900))))).ok).toBe(false);  // time run on score board
    expect((await verifyPayload(parsePayload(link(payload('xa_block_drop_sprint', xar('xa_block_drop_sprint', 900, { done: false }), 900))))).ok).toBe(false);
    expect((await verifyPayload(parsePayload(link(payload('xa_neon_snake', xar('xa_neon_snake', 5, { steps: 900000 }), 5))))).ok).toBe(false);
  });

  it('accepts a deflate-compressed body and refuses a damaged one', async () => {
    const raw = xar('xa_neon_snake', 77);
    const body = new Uint8Array([1, 2, 3, 4, 5, 6]);
    const z = new Uint8Array(await new Response(new Blob([body]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer());
    const good = new Uint8Array(44 + z.length); good.set(raw.subarray(0, 44)); good[3] = 1; good.set(z, 44);
    expect((await verifyPayload(parsePayload(link(payload('xa_neon_snake', good, 77))))).ok).toBe(true);
    const bad = good.slice(); bad.fill(0xff, 44);
    expect((await verifyPayload(parsePayload(link(payload('xa_neon_snake', bad, 77))))).ok).toBe(false);
  });

  it('rejects bad links', () => {
    const r = xar('xa_neon_snake', 100);
    expect(() => parsePayload(link(payload('nope', r, 100)))).toThrow(/Unknown leaderboard/);
    expect(() => parsePayload(link(payload('xa_neon_snake', r, 100, { period: 3 })))).toThrow(/period/);
    expect(() => parsePayload(link(payload('xa_neon_snake', r, 100, { contract: 'SP1.x' })))).toThrow(/different leaderboard/);
    expect(() => parsePayload(link(payload('xa_neon_snake', xar('xa_neon_snake', 100, { pilot: new Uint8Array(20) }), 100)))).toThrow(PayloadError);
    expect(() => parsePayload(link(payload('astro3', r, 100)))).toThrow(PayloadError);
  });

  it('formats time boards and describes the viewer dialog', () => {
    expect(formatArcadeScore('xa_block_drop_sprint', 12345)).toBe('2:03.45');
    expect(formatArcadeScore('xa_neon_snake', 1234567)).toBe('1,234,567');
    const r = xar('xa_tile_tap_rush', 9050);
    expect(describeArcadePayload(payload('xa_tile_tap_rush', r, 9050))).toMatchObject({ board: 'BlockBeat · Rush 100', scoreText: '1:30.50' });
    expect(() => describeArcadePayload(payload('bogus', r, 1))).toThrow();
  });
});
