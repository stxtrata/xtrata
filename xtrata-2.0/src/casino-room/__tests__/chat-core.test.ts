import { describe, expect, it } from 'vitest';
import {
  ChatLog, Roster, MAX_BLOCKS, MAX_CHARS, MAX_LINES, SEND_GAP_MS, checkSend, errorText, parseBlocks, parsePrefs, sanitizeBlocks, tidy
} from '../chat-core';

const A = 'ST3RKSCZP4D6Q6R43382VB6BF650KZ7QKH855FQ9P';
const B = 'ST9YQRPH9XWQJ032WH0251TRCY0DPS9BKQYGBDDA';
const texts = (log: ChatLog) => log.all().map((l) => l.text);

describe('block list', () => {
  it('keeps only address-shaped strings, once each, at most 40', () => {
    expect(sanitizeBlocks([A, A, B, 'hello', 7, null, '<script>', 'st3rk', ''])).toEqual([A, B]);
    const many = Array.from({ length: 60 }, (_, i) => `ST${String(i).padStart(30, '0')}ABCDE`);
    expect(sanitizeBlocks(many)).toHaveLength(MAX_BLOCKS);
  });
  it('treats anything that is not a list, or not JSON, as an empty list', () => {
    expect(sanitizeBlocks('x')).toEqual([]);
    expect(sanitizeBlocks({ length: 2 })).toEqual([]);
    expect(parseBlocks(null)).toEqual([]);
    expect(parseBlocks('{not json')).toEqual([]);
    expect(parseBlocks(JSON.stringify([A, 'junk']))).toEqual([A]);
  });
});

describe('saved chat settings', () => {
  it('defaults to shown and on the left, and only accepts the two sides', () => {
    expect(parsePrefs(null)).toEqual({ hidden: false, side: 'left' });
    expect(parsePrefs('garbage')).toEqual({ hidden: false, side: 'left' });
    expect(parsePrefs(JSON.stringify({ hidden: true, side: 'right' }))).toEqual({ hidden: true, side: 'right' });
    expect(parsePrefs(JSON.stringify({ hidden: 'yes', side: 'top' }))).toEqual({ hidden: false, side: 'left' });
  });
});

describe('checks before sending', () => {
  const ok = { signed: true, connected: true, now: 100_000, lastSentAt: 0 };
  it('tidies spaces and sends', () => {
    expect(tidy('  hello   room ')).toBe('hello room');
    expect(checkSend('  hello   room ', ok)).toEqual({ ok: true, text: 'hello room' });
  });
  it('refuses a guest, a lost connection and an empty line, in that order of importance', () => {
    expect(checkSend('hi', { ...ok, signed: false })).toEqual({ ok: false, code: 'sign-in-first' });
    expect(checkSend('hi', { ...ok, connected: false })).toEqual({ ok: false, code: 'offline' });
    expect(checkSend('   ', ok)).toEqual({ ok: false, code: 'empty' });
  });
  it('counts characters the way the room does (code points), not UTF-16 units', () => {
    expect(checkSend('😀'.repeat(MAX_CHARS), ok).ok).toBe(true);
    expect(checkSend('😀'.repeat(MAX_CHARS + 1), ok)).toEqual({ ok: false, code: 'too-long' });
  });
  it('keeps the two second gap, and lets the next message through once it has passed', () => {
    expect(checkSend('hi', { ...ok, lastSentAt: ok.now - (SEND_GAP_MS - 1) })).toEqual({ ok: false, code: 'slow-down' });
    expect(checkSend('hi', { ...ok, lastSentAt: ok.now - SEND_GAP_MS }).ok).toBe(true);
  });
  it('does not guess about links: the room decides', () => {
    expect(checkSend('see example.com', ok).ok).toBe(true);
  });
});

describe('the room refusing something', () => {
  it('has words for each refusal and a calm line for an unknown one', () => {
    for (const code of ['no-links', 'too-long', 'empty', 'slow-down', 'sign-in-first', 'bad-message']) expect(errorText(code)).not.toMatch(/could not take that/);
    expect(errorText('something-new')).toMatch(/could not take that/);
    expect(errorText(undefined)).toMatch(/could not take that/);
  });
});

describe('the session\'s chat', () => {
  it('nothing fades: every line stays until the session ends', () => {
    const log = new ChatLog();
    log.add({ a: A }, 'one', false, 0);
    log.add({ a: B }, 'two', false, 3_600_000);
    expect(texts(log)).toEqual(['one', 'two']);
  });
  it('the closed chat shows the newest few, the open chat everything', () => {
    const log = new ChatLog();
    for (let i = 0; i < 20; i += 1) log.add({ a: A }, `m${i}`, false, i);
    expect(log.tail(5).map((l) => l.text)).toEqual(['m15', 'm16', 'm17', 'm18', 'm19']);
    expect(log.tail(0)).toEqual([]);
    expect(log.all()).toHaveLength(20);
  });
  it('keeps the most recent 500 lines', () => {
    const log = new ChatLog();
    for (let i = 0; i < MAX_LINES + 30; i += 1) log.add({ a: A }, `m${i}`, false, i);
    expect(log.size).toBe(MAX_LINES);
    expect(log.all()[0].text).toBe('m30');
  });
  it('survives a reload through dump and load, people\'s lines only', () => {
    const log = new ChatLog();
    log.add({ a: A }, 'hello room', false, 1);
    log.add({ a: B }, 'to alice', true, 2, { a: A });
    log.add(null, 'Report sent.', false, 3);
    const again = new ChatLog();
    expect(again.load(log.dump())).toBe(2);
    expect(again.all().map((l) => [l.who?.a, l.mine, l.text, l.to?.a])).toEqual([[A, false, 'hello room', undefined], [B, true, 'to alice', A]]);
  });
  it('load skips junk and keeps blocked people out', () => {
    const log = new ChatLog();
    log.setBlocked([A]);
    expect(log.load('not json')).toBe(0);
    expect(log.load(JSON.stringify({ not: 'a list' }))).toBe(0);
    expect(log.load(JSON.stringify([null, { a: 5 }, { a: A, t: 'blocked', at: 1 }, { a: B, t: 'ok', at: 2 }, { a: B, t: 'no time' }]))).toBe(1);
    expect(texts(log)).toEqual(['ok']);
  });
});

describe('blocking', () => {
  it('takes what a person already said off the screen and keeps their later lines out', () => {
    const log = new ChatLog();
    log.add({ a: A }, 'before', false, 1);
    log.add({ a: B }, 'keep', false, 2);
    log.dropFrom(A);
    log.setBlocked([A]);
    expect(log.add({ a: A }, 'after', false, 3)).toBeNull();
    expect(texts(log)).toEqual(['keep']);
  });
  it('never hides your own lines, even if your address is somehow in the list', () => {
    const log = new ChatLog();
    log.setBlocked([A]);
    expect(log.add({ a: A }, 'mine', true, 1)).not.toBeNull();
  });
  it('a note from the page itself is never filtered', () => {
    const log = new ChatLog();
    log.setBlocked([A]);
    expect(log.add(null, 'Report sent.', false, 1)).not.toBeNull();
  });
});

describe('what a report carries', () => {
  it('is the last five things that person said, shortened, and nothing from anyone else', () => {
    const log = new ChatLog();
    for (let i = 0; i < 8; i += 1) log.add({ a: A }, `a${i}-${'x'.repeat(200)}`, false, i);
    log.add({ a: B }, 'bob says hi', false, 9);
    const got = log.lastFrom(A);
    expect(got).toHaveLength(5);
    expect(got[0].startsWith('a3-')).toBe(true);
    expect(got.every((t) => t.length <= 120)).toBe(true);
    expect(log.lastFrom(B)).toEqual(['bob says hi']);
  });
});

describe('direct messages', () => {
  it('blocking someone also clears the direct messages you sent them', () => {
    const log = new ChatLog();
    log.add({ a: B }, 'to alice', true, 1, { a: A });
    log.add({ a: B }, 'to the room', true, 2);
    log.dropFrom(A);
    expect(texts(log)).toEqual(['to the room']);
  });
  it('the room\'s refusals for direct messages have words', () => {
    for (const code of ['not-here', 'no-such-player', 'blocked', 'not-you']) expect(errorText(code)).not.toMatch(/could not take that/);
  });
});

describe('who is here', () => {
  it('is unknown until the room says, then follows joins and leaves, never listing you', () => {
    const r = new Roster();
    expect(r.known).toBe(false);
    r.set([{ a: A, n: 'ST3RK…FQ9P' }, { a: B, n: 'ST9YQ…BDDA' }]);
    expect(r.known).toBe(true);
    expect(r.others(A).map((p) => p.a)).toEqual([B]);
    r.leave(B);
    expect(r.others(A)).toEqual([]);
    r.join({ a: B, n: 'x' });
    expect(r.has(B)).toBe(true);
    r.forget();
    expect(r.known).toBe(false);
  });
  it('ignores junk from the wire', () => {
    const r = new Roster();
    r.set([null, 7, { a: 5 }, { a: A }]);
    r.join(null); r.join({ n: 'no address' }); r.leave(undefined);
    expect(r.others(null).map((p) => p.a)).toEqual([A]);
    r.set('not a list');
    expect(r.others(null)).toEqual([]);
  });
});
