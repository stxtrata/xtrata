import { describe, expect, it } from 'vitest';
import { MIN_FUNDING, type InboundTransfer } from '../funder';
import {
  buildLedger, excessTarget, MAX_INBOUND_PAGES, parseOutgoing, planReturns, readHistory, type LedgerPart, type Outgoing
} from '../ledger';

const SELF = 'SPHRV6ESV321YCV6W990X4FKXB4S9D7F665FSCTV';
const A = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const B = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const TREASURY = 'SP1RKMSSGS3TCZW6HXFYXAM0DGHS2VNKSBTB4G183';
const GIFTER = 'SP1FVCANW8KX51C70JJAFTES86SR48CPP6F2ANQKP';
const GIFT = { sender: TREASURY, payer: GIFTER };
const FEE = 3_000n;

const inb = (sender: string, amount: bigint, blockHeight: number, txIndex = 0): InboundTransfer =>
  ({ sender, amount: String(amount), txId: `0xin${blockHeight}-${txIndex}`, blockHeight, txIndex });
const out = (recipient: string, amount: bigint, blockHeight: number, txIndex = 0): Outgoing =>
  ({ recipient, amount, txId: `0xout${blockHeight}-${txIndex}`, blockHeight, txIndex });
const partOf = (l: ReturnType<typeof buildLedger>, kind: string, to: string | null) => {
  if (!l.ok) throw new Error('ledger not ok: ' + l.reason);
  return l.parts.find((p) => p.kind === kind && p.to === to)?.amount;
};

describe('buildLedger', () => {
  it('belongs entirely to the gifter until someone tops up', () => {
    const l = buildLedger({ self: SELF, balance: 90_000n, inbound: [inb(TREASURY, 100_000n, 10)], outgoing: [], gift: GIFT });
    expect(l).toMatchObject({ ok: true, hasTopUp: false });
    expect(partOf(l, 'gift', GIFTER)).toBe(90_000n);
  });

  it('spends the gift first, so a top-up is what is left', () => {
    // gift 0.1, topped up 0.2 by A, 0.15 spent on plays and fees: the gift is gone, A still owns 0.15
    const l = buildLedger({ self: SELF, balance: 150_000n, inbound: [inb(TREASURY, 100_000n, 10), inb(A, 200_000n, 20)], outgoing: [], gift: GIFT });
    expect(partOf(l, 'gift', GIFTER)).toBeUndefined();
    expect(partOf(l, 'deposit', A)).toBe(150_000n);
    expect(l).toMatchObject({ hasTopUp: true });
  });

  it('splits the balance between the unused gift and what a depositor added', () => {
    const l = buildLedger({ self: SELF, balance: 250_000n, inbound: [inb(TREASURY, 100_000n, 10), inb(A, 200_000n, 20)], outgoing: [], gift: GIFT });
    expect(partOf(l, 'gift', GIFTER)).toBe(50_000n);
    expect(partOf(l, 'deposit', A)).toBe(200_000n);
  });

  it('dust cannot capture anything: it counts in the arithmetic but names nobody', () => {
    const dust = MIN_FUNDING - 1n;
    const l = buildLedger({ self: SELF, balance: 90_000n + dust, inbound: [inb(TREASURY, 100_000n, 10), inb(B, dust, 30)], outgoing: [], gift: GIFT });
    expect(partOf(l, 'gift', GIFTER)).toBe(90_000n);
    expect(partOf(l, 'dust', null)).toBe(dust);
    expect(partOf(l, 'deposit', B)).toBeUndefined();
    expect(l).toMatchObject({ hasTopUp: false });
  });

  it('a contract sender and a transfer from the wallet itself name nobody', () => {
    const l = buildLedger({ self: SELF, balance: 600_000n, inbound: [inb(`${A}.bulk-send`, 500_000n, 5), inb(SELF, 7_000n, 6), inb(TREASURY, 100_000n, 10)], outgoing: [], gift: GIFT });
    expect(partOf(l, 'dust', null)).toBe(500_000n);
    expect(partOf(l, 'gift', GIFTER)).toBe(100_000n);
  });

  it('a return charges the address it went to, not the gift (the reason outgoing transfers are read)', () => {
    // gift 0.1 from the treasury, A adds 0.2, then 0.2 is returned to A. Nothing spent.
    const l = buildLedger({ self: SELF, balance: 100_000n, inbound: [inb(TREASURY, 100_000n, 10), inb(A, 200_000n, 20)], outgoing: [out(A, 200_000n, 30)], gift: GIFT });
    expect(partOf(l, 'gift', GIFTER)).toBe(100_000n);
    expect(partOf(l, 'deposit', A)).toBeUndefined();
  });

  it('keeps spending separate from returns when both happened', () => {
    // gift 0.1, A adds 0.2, 0.05 spent, 0.1 returned to A: gift left 0.05, A left 0.1
    const l = buildLedger({ self: SELF, balance: 150_000n, inbound: [inb(TREASURY, 100_000n, 10), inb(A, 200_000n, 20)], outgoing: [out(A, 100_000n, 30)], gift: GIFT });
    expect(partOf(l, 'gift', GIFTER)).toBe(50_000n);
    expect(partOf(l, 'deposit', A)).toBe(100_000n);
  });

  it('a return to an address that put nothing in comes out of the oldest money, not out of thin air', () => {
    const l = buildLedger({ self: SELF, balance: 40_000n, inbound: [inb(TREASURY, 100_000n, 10)], outgoing: [out(B, 60_000n, 30)], gift: GIFT });
    expect(partOf(l, 'gift', GIFTER)).toBe(40_000n);
  });

  it('several depositors each keep their own part, ordered oldest to newest', () => {
    const l = buildLedger({ self: SELF, balance: 500_000n, inbound: [inb(A, 200_000n, 10), inb(B, 300_000n, 20)], outgoing: [] });
    expect(l.ok && l.parts.map((p) => [p.to, p.amount])).toEqual([[A, 200_000n], [B, 300_000n]]);
  });

  it('adds the same sender twice into one part', () => {
    const l = buildLedger({ self: SELF, balance: 300_000n, inbound: [inb(A, 100_000n, 10), inb(A, 200_000n, 20)], outgoing: [] });
    expect(partOf(l, 'deposit', A)).toBe(300_000n);
  });

  it('refuses to guess when the numbers do not add up', () => {
    // balance higher than anything deposited (a transfer the list did not show)
    expect(buildLedger({ self: SELF, balance: 500_000n, inbound: [inb(A, 100_000n, 10)], outgoing: [] })).toMatchObject({ ok: false });
    // more has gone out than ever came in
    expect(buildLedger({ self: SELF, balance: 0n, inbound: [inb(A, 100_000n, 10)], outgoing: [out(B, 400_000n, 20)] })).toMatchObject({ ok: false });
    expect(buildLedger({ self: SELF, balance: -1n, inbound: [], outgoing: [] })).toMatchObject({ ok: false });
  });

  it('several gifts in one wallet each go back to the person who paid for them', () => {
    const G2 = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR';
    const inbound = [inb(TREASURY, 100_000n, 10), inb(TREASURY, 300_000n, 20)];
    const gift = { ...GIFT, gifts: [
      { txid: inbound[1].txId.replace('0x', ''), payer: G2, amount: 300_000n }, // matched by id (any case, with or without 0x)
      { txid: '0xnot-seen', payer: GIFTER, amount: 100_000n }
    ] };
    const l = buildLedger({ self: SELF, balance: 400_000n, inbound, outgoing: [], gift });
    expect(partOf(l, 'gift', GIFTER)).toBe(100_000n);
    expect(partOf(l, 'gift', G2)).toBe(300_000n);
  });

  it('falls back to equal amounts in order, then to the first payer, and spending takes the oldest gift first', () => {
    const G2 = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR';
    const inbound = [inb(TREASURY, 100_000n, 10), inb(TREASURY, 300_000n, 20), inb(TREASURY, 50_000n, 30)];
    const gift = { ...GIFT, gifts: [{ txid: '', payer: G2, amount: 300_000n }] };
    const l = buildLedger({ self: SELF, balance: 400_000n, inbound, outgoing: [], gift }); // 0.05 spent: from the oldest gift
    expect(partOf(l, 'gift', G2)).toBe(300_000n);
    expect(partOf(l, 'gift', GIFTER)).toBe(100_000n); // 0.1 + 0.05 fell back to the first payer, 0.05 spent
  });

  it('without gift details a treasury deposit is an ordinary deposit', () => {
    const l = buildLedger({ self: SELF, balance: 100_000n, inbound: [inb(TREASURY, 100_000n, 10)], outgoing: [] });
    expect(partOf(l, 'deposit', TREASURY)).toBe(100_000n);
  });
});

describe('planReturns', () => {
  const part = (kind: LedgerPart['kind'], to: string | null, amount: bigint, newest: number): LedgerPart => ({ kind, to, amount, newest });

  it('returns each gift to its own payer, exact amounts first, the last gift and dust in the final all', () => {
    const G2 = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR';
    const r = planReturns([part('gift', GIFTER, 100_000n, 0), part('gift', G2, 300_000n, 1), part('deposit', A, 200_000n, 2), part('dust', null, 4_000n, 3)], FEE);
    expect(r.steps).toEqual([
      { to: A, kind: 'deposit', mode: 'amount', send: 197_000n },
      { to: GIFTER, kind: 'gift', mode: 'amount', send: 97_000n },
      { to: G2, kind: 'gift', mode: 'all', send: 301_000n }
    ]);
    expect(planReturns([part('gift', GIFTER, 100_000n, 0), part('gift', G2, 2_000n, 1)], FEE).steps).toEqual([{ to: GIFTER, kind: 'gift', mode: 'all', send: 97_000n }]);
  });

  it('no top-up: one Return all to the gifter', () => {
    const r = planReturns([part('gift', GIFTER, 90_000n, 0)], FEE);
    expect(r.steps).toEqual([{ to: GIFTER, kind: 'gift', mode: 'all', send: 87_000n }]);
    expect(r.tooSmall).toEqual([]);
  });

  it('after a top-up: the depositor first (exact amount), then the gift remainder (all)', () => {
    const r = planReturns([part('gift', GIFTER, 50_000n, 0), part('deposit', A, 200_000n, 1)], FEE);
    expect(r.steps).toEqual([
      { to: A, kind: 'deposit', mode: 'amount', send: 197_000n },
      { to: GIFTER, kind: 'gift', mode: 'all', send: 47_000n }
    ]);
  });

  it('each step pays its own fee, so the total sent plus fees is the whole balance', () => {
    const parts = [part('gift', GIFTER, 50_000n, 0), part('deposit', A, 200_000n, 1), part('deposit', B, 120_000n, 2)];
    const r = planReturns(parts, FEE);
    const sent = r.steps.reduce((s, x) => s + x.send, 0n);
    expect(sent + FEE * BigInt(r.steps.length)).toBe(370_000n);
  });

  it('with no gift left, the last depositor is returned with all', () => {
    const r = planReturns([part('deposit', A, 200_000n, 1), part('deposit', B, 120_000n, 2)], FEE);
    expect(r.steps.map((s) => [s.to, s.mode])).toEqual([[A, 'amount'], [B, 'all']]);
  });

  it('dust goes with the gift remainder, or asks for an address when there is no gift', () => {
    expect(planReturns([part('gift', GIFTER, 50_000n, 0), part('dust', null, 4_000n, 1)], FEE).steps).toEqual([{ to: GIFTER, kind: 'gift', mode: 'all', send: 51_000n }]);
    expect(planReturns([part('dust', null, 40_000n, 0)], FEE).steps).toEqual([{ to: null, kind: 'rest', mode: 'all', send: 37_000n }]);
  });

  it('a part that cannot cover its own fee is not returned separately', () => {
    const r = planReturns([part('gift', GIFTER, 2_000n, 0), part('deposit', A, 200_000n, 1)], FEE);
    expect(r.steps).toEqual([{ to: A, kind: 'deposit', mode: 'all', send: 197_000n }]);
    expect(r.tooSmall.map((p) => p.kind)).toEqual(['gift']);
  });
});

describe('excessTarget', () => {
  it('is the newest depositor, never the gifter, dust or nobody', () => {
    const parts: LedgerPart[] = [
      { kind: 'gift', to: GIFTER, amount: 100_000n, newest: 0 },
      { kind: 'deposit', to: A, amount: 200_000n, newest: 1 },
      { kind: 'deposit', to: B, amount: 9_000_000n, newest: 2 },
      { kind: 'dust', to: null, amount: 5n, newest: 3 }
    ];
    expect(excessTarget(parts)).toBe(B);
    expect(excessTarget(parts.slice(0, 1))).toBeNull();
  });
});

describe('parseOutgoing', () => {
  const transfer = (over: Record<string, unknown> = {}) => ({
    tx_id: '0xa', tx_type: 'token_transfer', tx_status: 'success', sender_address: SELF, block_height: 7, tx_index: 2,
    token_transfer: { recipient_address: A, amount: '250000', memo: '0x' }, ...over
  });
  const call = { tx_id: '0xb', tx_type: 'contract_call', tx_status: 'success', sender_address: SELF, block_height: 8 };

  it('keeps only successful transfers sent by the wallet and skips contract calls', () => {
    const p = parseOutgoing({ total: 4, results: [transfer(), call, transfer({ tx_id: '0xc', tx_status: 'abort_by_response' }), transfer({ tx_id: '0xd', sender_address: A })] }, SELF)!;
    expect(p.sent).toEqual([{ recipient: A, amount: 250000n, txId: '0xa', blockHeight: 7, txIndex: 2 }]);
    expect(p.rows).toEqual(['0xa', '0xb', '0xc', '0xd']);
  });

  it('also reads the { tx } shape of the with-transfers endpoint', () => {
    expect(parseOutgoing({ total: 1, results: [{ tx: transfer() }] }, SELF)!.sent).toHaveLength(1);
  });

  it('one unreadable row makes the whole page unreadable', () => {
    expect(parseOutgoing(null, SELF)).toBeNull();
    expect(parseOutgoing({ total: 1, results: [{ tx_type: 'token_transfer' }] }, SELF)).toBeNull();
    expect(parseOutgoing({ total: 1, results: [transfer({ token_transfer: { recipient_address: A, amount: '1e3' } })] }, SELF)).toBeNull();
    expect(parseOutgoing({ total: 1, results: [transfer({ block_height: 'x' })] }, SELF)).toBeNull();
  });
});

describe('readHistory', () => {
  const inRow = (x: InboundTransfer) => ({ sender: x.sender, amount: x.amount, tx_id: x.txId, block_height: x.blockHeight, tx_index: x.txIndex });
  const outRow = (o: Outgoing) => ({ tx_id: o.txId, tx_type: 'token_transfer', tx_status: 'success', sender_address: SELF, block_height: o.blockHeight, tx_index: o.txIndex, token_transfer: { recipient_address: o.recipient, amount: String(o.amount) } });
  const pages = (all: unknown[], total = all.length) => (path: string) => {
    const offset = Number(new URL('https://x' + path).searchParams.get('offset'));
    return Promise.resolve({ total, results: all.slice(offset, offset + 50) });
  };
  const server = (inbound: InboundTransfer[], outgoing: Outgoing[], calls: number[] = []) => (path: string) => {
    calls.push(1);
    return path.includes('/stx_inbound') ? pages(inbound.map(inRow))(path) : pages(outgoing.map(outRow))(path);
  };

  it('reads inbound and outgoing history in full', async () => {
    const i = [inb(A, 200_000n, 10), inb(TREASURY, 100_000n, 5)], o = [out(A, 50_000n, 30)];
    const h = await readHistory(SELF, server(i, o), true);
    expect(h).toMatchObject({ ok: true });
    expect(h.ok && h.inbound).toHaveLength(2);
    expect(h.ok && h.outgoing).toEqual(o);
  });

  it('does not read outgoing history unless asked', async () => {
    const calls: number[] = [];
    const h = await readHistory(SELF, server([inb(A, 1n, 1)], [], calls), false);
    expect(h).toMatchObject({ ok: true, outgoing: [] });
    expect(calls).toHaveLength(1);
  });

  it('pages through a longer list', async () => {
    const i = Array.from({ length: 120 }, (_, n) => inb(A, 1n, n + 1, 0));
    const h = await readHistory(SELF, server(i, []), false);
    expect(h.ok && h.inbound).toHaveLength(120);
  });

  it('is "could not check" for a list that is too long, unreadable, or shifted while reading', async () => {
    const tooLong = Array.from({ length: MAX_INBOUND_PAGES * 50 + 1 }, (_, n) => inb(A, 1n, n + 1));
    expect(await readHistory(SELF, server(tooLong, []), false)).toEqual({ ok: false });
    expect(await readHistory(SELF, () => Promise.resolve({ nope: true }), false)).toEqual({ ok: false });
    expect(await readHistory(SELF, () => Promise.reject(new Error('429')), false)).toEqual({ ok: false });
    expect(await readHistory('not-an-address', server([], []), false)).toEqual({ ok: false });
    // the second page repeats a row that moved down: 60 unique rows but total says 61
    const rows = Array.from({ length: 60 }, (_, n) => inRow(inb(A, 1n, n + 1)));
    const shifted = (path: string) => {
      const offset = Number(new URL('https://x' + path).searchParams.get('offset'));
      return Promise.resolve({ total: 61, results: offset === 0 ? rows.slice(0, 50) : rows.slice(49, 60) });
    };
    expect(await readHistory(SELF, shifted, false)).toEqual({ ok: false });
  });
});
