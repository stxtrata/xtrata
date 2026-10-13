import { describe, expect, it } from 'vitest';
import { findFunder, MIN_FUNDING, parseInbound, pickFunder, type InboundTransfer } from '../funder';

const SELF = 'SPHRV6ESV321YCV6W990X4FKXB4S9D7F665FSCTV';
const A = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const B = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const t = (sender: string, amount: string | bigint, blockHeight: number, txIndex = 0): InboundTransfer => ({ sender, amount: String(amount), txId: `0x${blockHeight}-${txIndex}`, blockHeight, txIndex });
const row = (x: InboundTransfer) => ({ sender: x.sender, amount: x.amount, tx_id: x.txId, block_height: x.blockHeight, tx_index: x.txIndex, transfer_type: 'stx-transfer' });

describe('pickFunder', () => {
  it('takes the sender of the oldest meaningful deposit, whatever order Hiro lists them in', () => {
    const r = pickFunder([t(B, 1_000_000n, 20), t(A, MIN_FUNDING, 10)], SELF);
    expect(r).toMatchObject({ ok: true, funder: A, distinct: 2 });
    expect(pickFunder([t(A, MIN_FUNDING, 10, 5), t(B, MIN_FUNDING, 10, 2)], SELF)).toMatchObject({ funder: B }); // same block: lower index first
  });
  it('ignores dust (address poisoning), contracts, malformed senders, the wallet itself and bad amounts', () => {
    const dust = t(B, MIN_FUNDING - 1n, 1);
    const contract = t(`${A}.bulk-send`, 5_000_000n, 2);
    const poisoned = t('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ8', 5_000_000n, 3); // bad checksum
    const self = t(SELF, 5_000_000n, 4);
    const weird = { ...t(A, '1e9', 5) };
    expect(pickFunder([dust, contract, poisoned, self, weird], SELF)).toEqual({ ok: true, funder: null, distinct: 0 });
    expect(pickFunder([dust, t(A, 2_000_000n, 9)], SELF)).toMatchObject({ funder: A, distinct: 1 });
  });
  it('is not fooled by a later deposit from a different sender', () => {
    expect(pickFunder([t(A, 500_000n, 1), t(B, 9_000_000n, 2)], SELF).ok && (pickFunder([t(A, 500_000n, 1), t(B, 9_000_000n, 2)], SELF) as any).funder).toBe(A);
  });
});

describe('parseInbound', () => {
  it('rejects malformed bodies, and a page with any unreadable row is unreadable (never a partial list)', () => {
    expect(parseInbound(null)).toBeNull();
    expect(parseInbound({ total: 'x', results: [] })).toBeNull();
    expect(parseInbound({ total: 1 })).toBeNull();
    expect(parseInbound({ total: 2, results: [row(t(A, 1, 1)), { sender: A }] })).toBeNull();
    expect(parseInbound({ total: 1, results: [{ ...row(t(A, 1, 1)), block_height: 'later' }] })).toBeNull();
    expect(parseInbound({ total: 1, results: [row(t(A, 1, 1))] })!.transfers).toHaveLength(1);
  });
});

describe('findFunder', () => {
  const server = (all: InboundTransfer[], fail?: (offset: number) => boolean) => {
    const calls: string[] = [];
    const newestFirst = [...all].sort((x, y) => y.blockHeight - x.blockHeight || y.txIndex - x.txIndex);
    const get = async (path: string) => {
      calls.push(path);
      const q = new URL('https://x' + path).searchParams;
      const offset = Number(q.get('offset')), limit = Number(q.get('limit'));
      if (fail?.(offset)) throw new Error('503');
      return { total: all.length, limit, offset, results: newestFirst.slice(offset, offset + limit).map(row) };
    };
    return { get, calls };
  };

  it('finds the first funder in a short history with one request', async () => {
    const s = server([t(B, 3_000_000n, 30), t(A, 1_000_000n, 10)]);
    expect(await findFunder(SELF, s.get)).toMatchObject({ ok: true, funder: A, distinct: 2 });
    expect(s.calls).toHaveLength(1);
  });
  it('reports no funder for an empty history', async () => {
    expect(await findFunder(SELF, server([]).get)).toEqual({ ok: true, funder: null, distinct: 0 });
  });
  it('reads the OLDEST page of a long history, not the newest', async () => {
    const dust = Array.from({ length: 120 }, (_, i) => t(B, 1n, 100 + i));
    const s = server([t(A, 2_000_000n, 1), ...dust]);
    expect(await findFunder(SELF, s.get)).toMatchObject({ ok: true, funder: A });
    expect(s.calls[1]).toContain('offset=71'); // 121 total, last page of 50
  });
  it('walks toward newer pages when the oldest page is only dust, within a bound', async () => {
    const dust = Array.from({ length: 60 }, (_, i) => t(B, 1n, 1 + i));
    const s = server([...dust, t(A, 2_000_000n, 500)]);
    expect(await findFunder(SELF, s.get)).toMatchObject({ ok: true, funder: A });
    const endless = server(Array.from({ length: 400 }, (_, i) => t(B, 1n, i)));
    expect(await findFunder(SELF, endless.get)).toEqual({ ok: false }); // gave up: "could not tell", never a guess
  });
  it('an API shape change is "could not check", not "nobody funded this"', async () => {
    const renamed = async () => ({ total: 2, results: [{ from: A, value: '2000000' }, { from: B, value: '2000000' }] });
    expect(await findFunder(SELF, renamed)).toEqual({ ok: false });
    expect(await findFunder(SELF, async () => ({ total: 3, results: [] }))).toEqual({ ok: false });
  });
  it('never claims a single funder when newer pages were not read', async () => {
    const dust = Array.from({ length: 120 }, (_, i) => t(B, 1n, 100 + i));
    expect(await findFunder(SELF, server([t(A, 2_000_000n, 1), ...dust]).get)).toMatchObject({ funder: A, distinct: 2 });
  });
  it('a failed or malformed read is { ok:false }, never "no funder"', async () => {
    expect(await findFunder(SELF, server([t(A, 2_000_000n, 1)], () => true).get)).toEqual({ ok: false });
    expect(await findFunder(SELF, async () => ({ nope: true }))).toEqual({ ok: false });
    const longHist = Array.from({ length: 80 }, (_, i) => t(A, 2_000_000n, i));
    expect(await findFunder(SELF, server(longHist, (o) => o > 0).get)).toEqual({ ok: false });
    expect(await findFunder('not-an-address', server([]).get)).toEqual({ ok: false });
  });
});
