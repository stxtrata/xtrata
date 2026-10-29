import { describe, expect, it } from 'vitest';
import {
  CASINO_COLUMNS,
  CASINO_INSERT_SQL,
  MAX_CLIENT_TIME,
  MAX_EVENTS,
  THEORY_RTP,
  parseEnvelope,
  prepareIngest,
  utcDay,
  validateEvent,
  wholeNumber
} from '../casino-ingest';

const PID = 'p_abcdefghij12';
const SID = 's_abc123';
const ADDR = 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA';
const TX = 'a'.repeat(64);

const spin = (extra: Record<string, unknown> = {}) => ({
  seq: 0,
  t: 1_700_000_000_000,
  m: 'bf',
  k: 'spin',
  bet: 100,
  free: 0,
  win: 250,
  jp: 0,
  st: [1, 2, 3, 4, 31],
  ...extra
});

const envelope = (events: unknown[], extra: Record<string, unknown> = {}) => ({
  v: 1,
  page: 'casino',
  pid: PID,
  sid: SID,
  addr: null,
  events,
  ...extra
});

describe('wholeNumber', () => {
  it('accepts whole numbers in range and refuses everything else', () => {
    expect(wholeNumber(0)).toBe(0);
    expect(wholeNumber(1e12)).toBe(1e12);
    for (const bad of [-1, 1.5, 1e12 + 1, NaN, Infinity, '5', null, undefined, true, {}]) {
      expect(wholeNumber(bad)).toBeNull();
    }
  });
});

describe('parseEnvelope', () => {
  it('accepts a v1 envelope and normalises a missing address to null', () => {
    const parsed = parseEnvelope(envelope([spin()]));
    expect(parsed).toMatchObject({ page: 'casino', pid: PID, sid: SID, addr: null });
    expect(parsed?.events).toHaveLength(1);
  });

  it('accepts casino-b and stores a testnet address', () => {
    expect(parseEnvelope(envelope([], { page: 'casino-b', addr: ADDR }))?.addr).toBe(ADDR);
  });

  it('keeps the batch but does not store a mainnet-shaped address', () => {
    const parsed = parseEnvelope(
      envelope([spin()], { addr: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X' })
    );
    expect(parsed).not.toBeNull();
    expect(parsed?.addr).toBeNull();
    expect(parsed?.events).toHaveLength(1);
  });

  it.each([
    ['not an object', 'nope'],
    ['an array', []],
    ['null', null],
    ['wrong version', envelope([], { v: 2 })],
    ['unknown page', envelope([], { page: 'other' })],
    ['bad pid', envelope([], { pid: 'player-1' })],
    ['pid too short', envelope([], { pid: 'p_abc' })],
    ['bad sid', envelope([], { sid: 'S_ABC123' })],
    ['bad address', envelope([], { addr: 'not-an-address' })],
    ['address of the wrong type', envelope([], { addr: 12 })],
    ['events not an array', envelope([], { events: {} })]
  ])('rejects %s', (_label, payload) => {
    expect(parseEnvelope(payload)).toBeNull();
  });

  it('keeps at most MAX_EVENTS events', () => {
    const many = Array.from({ length: MAX_EVENTS + 25 }, (_, i) => spin({ seq: i }));
    expect(parseEnvelope(envelope(many))?.events).toHaveLength(MAX_EVENTS);
  });
});

describe('validateEvent: spin', () => {
  it('maps a spin to its columns', () => {
    expect(validateEvent(spin({ jp: 40, fx: 'FV', rid: 'ABCDEF0123' }))).toMatchObject({
      seq: 0,
      machine: 'bf',
      kind: 'spin',
      bet: 100,
      win: 250,
      jp: 40,
      free: 0,
      stops: '1,2,3,4,31',
      flags: 'FV',
      rid: 'abcdef0123',
      tx: null,
      detail: null
    });
  });

  it('defaults jp to 0 and leaves flags empty when there are no triggers', () => {
    const { jp: _jp, ...noJp } = spin();
    expect(validateEvent(noJp)).toMatchObject({ jp: 0, flags: null, rid: null });
  });

  it('accepts booleans for free', () => {
    expect(validateEvent(spin({ free: true }))?.free).toBe(1);
  });

  it.each([
    ['bet below the minimum', { bet: 19 }],
    ['bet above the maximum', { bet: 100_001 }],
    ['fractional bet', { bet: 20.5 }],
    ['negative win', { win: -1 }],
    ['jackpot bigger than the win', { win: 10, jp: 11 }],
    ['missing free flag', { free: undefined }],
    ['missing stops', { st: undefined }],
    ['four stops', { st: [1, 2, 3, 4] }],
    ['six stops', { st: [1, 2, 3, 4, 5, 6] }],
    ['stop out of range', { st: [1, 2, 3, 4, 32] }],
    ['malformed round id', { rid: 'not hex!' }],
    ['unknown trigger flag', { fx: 'X' }],
    ['non-text triggers', { fx: 5 }],
    ['not a game machine', { m: 'bank' }],
    ['unknown machine', { m: 'slots' }],
    ['negative seq', { seq: -1 }],
    ['text win', { win: '250' }]
  ])('rejects a spin with %s', (_label, extra) => {
    expect(validateEvent(spin(extra))).toBeNull();
  });

  it('accepts every game machine', () => {
    for (const m of ['bf', 'drop', 'twins', 'ds', 'nv']) {
      expect(validateEvent(spin({ m }))?.machine).toBe(m);
    }
  });
});

describe('validateEvent: client timestamp', () => {
  it('accepts a real epoch-millisecond time (which is larger than the amount limit)', () => {
    expect(validateEvent(spin({ t: Date.now() }))?.ct).toBeGreaterThan(1e12);
  });

  it('refuses a time beyond 2100, a fractional time or a text time', () => {
    expect(validateEvent(spin({ t: MAX_CLIENT_TIME }))).not.toBeNull();
    expect(validateEvent(spin({ t: MAX_CLIENT_TIME + 1 }))).toBeNull();
    expect(validateEvent(spin({ t: 1.5 }))).toBeNull();
    expect(validateEvent(spin({ t: '1700000000000' }))).toBeNull();
  });
});

describe('validateEvent: bonus', () => {
  const bonus = (extra: Record<string, unknown> = {}) => ({
    seq: 1,
    t: 5,
    m: 'bf',
    k: 'bonus',
    ty: 'vault',
    bet: 100,
    win: 900,
    jp: 0,
    ...extra
  });

  it('maps a vault bonus with a whitelisted detail', () => {
    const ev = validateEvent(
      bonus({ d: { aw: [1, 2, 3, 4, 5, 6, 7, 8, 9], pk: [0, 4, 8], extra: 'ignored' }, rid: 'ab' })
    );
    expect(ev).toMatchObject({ kind: 'bonus', flags: 'vault', bet: 100, win: 900, rid: 'ab' });
    expect(JSON.parse(ev?.detail ?? '{}')).toEqual({
      aw: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      pk: [0, 4, 8]
    });
  });

  it('maps chain and pick details', () => {
    expect(
      JSON.parse(validateEvent(bonus({ ty: 'chain', d: { sum: 40, full: true } }))?.detail ?? '')
    ).toEqual({
      sum: 40,
      full: 1
    });
    expect(
      JSON.parse(validateEvent(bonus({ ty: 'pick', m: 'nv', d: { mult: 8 } }))?.detail ?? '')
    ).toEqual({
      mult: 8
    });
  });

  it('stores no detail when none is sent', () => {
    expect(validateEvent(bonus())?.detail).toBeNull();
  });

  it('drops a detail with bad contents, and the event with it', () => {
    expect(validateEvent(bonus({ d: { aw: [1, 2, 'x'] } }))).toBeNull();
    expect(validateEvent(bonus({ d: { pk: [9] } }))).toBeNull();
    expect(validateEvent(bonus({ d: 'text' }))).toBeNull();
    expect(validateEvent(bonus({ ty: 'chain', d: { sum: -1 } }))).toBeNull();
  });

  it('never stores keys outside the whitelist', () => {
    const ev = validateEvent(
      bonus({ ty: 'chain', d: { sum: 4, full: 0, secret: 'x'.repeat(1000) } })
    );
    expect(ev?.detail).toBe(JSON.stringify({ sum: 4, full: 0 }));
  });

  it.each([
    ['unknown type', { ty: 'wheel' }],
    ['missing type', { ty: undefined }],
    ['jackpot above win', { win: 5, jp: 6 }],
    ['bet too small', { bet: 1 }],
    ['not a game machine', { m: 'ex' }]
  ])('rejects a bonus with %s', (_label, extra) => {
    expect(validateEvent(bonus(extra))).toBeNull();
  });
});

describe('validateEvent: gamble', () => {
  const gamble = (extra: Record<string, unknown> = {}) => ({
    seq: 2,
    t: 5,
    m: 'ds',
    k: 'gamble',
    stake: 500,
    w: 1,
    win: 1000,
    ch: 'odd',
    ...extra
  });

  it('maps a won gamble (win is exactly twice the stake)', () => {
    const ev = validateEvent(gamble());
    expect(ev).toMatchObject({ kind: 'gamble', bet: 500, win: 1000 });
    expect(JSON.parse(ev?.detail ?? '')).toEqual({ w: 1, ch: 'odd' });
  });

  it('maps a lost gamble (win is zero)', () => {
    const ev = validateEvent(gamble({ w: 0, win: 0, ch: undefined }));
    expect(ev).toMatchObject({ bet: 500, win: 0 });
    expect(JSON.parse(ev?.detail ?? '')).toEqual({ w: 0 });
  });

  it.each([
    ['a win that is not double', { win: 999 }],
    ['a loss that still pays', { w: 0, win: 1000 }],
    ['zero stake', { stake: 0, win: 0 }],
    ['uppercase choice', { ch: 'ODD' }],
    ['over-long choice', { ch: 'abcdefghi' }],
    ['no outcome flag', { w: undefined }],
    ['a non-game machine', { m: 'bank' }]
  ])('rejects a gamble with %s', (_label, extra) => {
    expect(validateEvent(gamble(extra))).toBeNull();
  });
});

describe('validateEvent: buy and move', () => {
  it('maps a purchase and normalises the transaction id', () => {
    const ev = validateEvent({
      seq: 3,
      t: 5,
      m: 'ex',
      k: 'buy',
      tx: TX.toUpperCase(),
      layr: 100_000,
      bh: 3456
    });
    expect(ev).toMatchObject({ kind: 'buy', machine: 'ex', tx: `0x${TX}`, win: 100_000 });
    expect(JSON.parse(ev?.detail ?? '')).toEqual({ bh: 3456 });
    expect(validateEvent({ seq: 3, t: 5, m: 'ex', k: 'buy', tx: `0x${TX}`, layr: 1 })?.tx).toBe(
      `0x${TX}`
    );
  });

  it.each([
    ['short transaction id', { tx: 'abc' }],
    ['non-hex transaction id', { tx: 'z'.repeat(64) }],
    ['zero LAYR', { layr: 0 }],
    ['missing transaction id', { tx: undefined }],
    ['bad block height', { bh: -4 }]
  ])('rejects a purchase with %s', (_label, extra) => {
    expect(
      validateEvent({ seq: 3, t: 5, m: 'ex', k: 'buy', tx: TX, layr: 10, ...extra })
    ).toBeNull();
  });

  it('maps bankroll moves in both directions', () => {
    expect(validateEvent({ seq: 4, t: 5, m: 'bank', k: 'move', dir: 'in', n: 5000 })).toMatchObject(
      {
        kind: 'move',
        flags: 'in',
        win: 5000
      }
    );
    expect(validateEvent({ seq: 5, t: 5, m: 'nv', k: 'move', dir: 'out', n: 1 })?.flags).toBe(
      'out'
    );
  });

  it.each([
    ['unknown direction', { dir: 'sideways' }],
    ['zero amount', { n: 0 }],
    ['text amount', { n: '10' }]
  ])('rejects a move with %s', (_label, extra) => {
    expect(
      validateEvent({ seq: 4, t: 5, m: 'bank', k: 'move', dir: 'in', n: 10, ...extra })
    ).toBeNull();
  });
});

describe('validateEvent: anything else', () => {
  it.each([null, undefined, 'spin', 4, [], { k: 'spin' }, { seq: 0, t: 0, m: 'bf', k: 'jackpot' }])(
    'drops %j without throwing',
    (raw) => {
      expect(validateEvent(raw)).toBeNull();
    }
  );
});

describe('prepareIngest', () => {
  const now = Date.UTC(2026, 9, 29, 12, 0, 0);

  it('has one placeholder per column', () => {
    expect(CASINO_INSERT_SQL).toContain('INSERT OR IGNORE INTO casino_events');
    expect((CASINO_INSERT_SQL.match(/\?/g) ?? []).length).toBe(CASINO_COLUMNS.length);
    expect(CASINO_COLUMNS).toHaveLength(19);
  });

  it('builds binds in column order with server time, UTC day and the envelope identity', () => {
    const prepared = prepareIngest(envelope([spin({ fx: 'F' })], { addr: ADDR }), now);
    expect(prepared).toMatchObject({ accepted: 1, rejected: 0 });
    const row = prepared!.rows[0];
    expect(row).toHaveLength(CASINO_COLUMNS.length);
    const byColumn = Object.fromEntries(CASINO_COLUMNS.map((c, i) => [c, row[i]]));
    expect(byColumn).toMatchObject({
      at: now,
      ct: 1_700_000_000_000,
      day: '2026-10-29',
      page: 'casino',
      pid: PID,
      sid: SID,
      seq: 0,
      addr: ADDR,
      machine: 'bf',
      kind: 'spin',
      bet: 100,
      win: 250,
      jp: 0,
      free: 0,
      stops: '1,2,3,4,31',
      flags: 'F',
      rid: null,
      tx: null,
      detail: null
    });
  });

  it('keeps the good events and counts the bad ones', () => {
    const prepared = prepareIngest(
      envelope([spin({ seq: 0 }), { nonsense: true }, spin({ seq: 2, bet: 5 })]),
      now
    );
    expect(prepared).toMatchObject({ accepted: 1, rejected: 2 });
  });

  it('returns null for a bad envelope or when nothing is usable', () => {
    expect(prepareIngest({ v: 1 }, now)).toBeNull();
    expect(prepareIngest(envelope([{ nonsense: true }]), now)).toBeNull();
    expect(prepareIngest(envelope([]), now)).toBeNull();
    expect(prepareIngest(envelope([spin()], { addr: 'oops' }), now)).toBeNull();
  });

  it('never stores an IP, user agent or free text beyond the whitelisted fields', () => {
    const prepared = prepareIngest(
      envelope([spin({ ip: '1.2.3.4', ua: 'x', note: 'hello' })], { ip: '1.2.3.4' }),
      now
    );
    expect(JSON.stringify(prepared!.rows)).not.toMatch(/1\.2\.3\.4|hello/);
  });
});

describe('constants', () => {
  it('formats the UTC day', () => {
    expect(utcDay(Date.UTC(2026, 0, 2, 23, 59, 59))).toBe('2026-01-02');
  });

  it('keeps the design figure in step with the audited machines', () => {
    expect(THEORY_RTP).toBe(0.9438);
  });
});
