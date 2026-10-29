import { describe, expect, it } from 'vitest';
import {
  CHAT_MIN_GAP_MS,
  CHAT_PER_MINUTE,
  MAX_BLOCKS,
  MAX_FRAME_BYTES,
  MAX_REPORT_LINE_CHARS,
  MAX_SOCKETS_PER_ADDRESS,
  MAX_TEXT_CHARS,
  RATE_LIMIT,
  RATE_WINDOW_MS,
  SPOTS,
  applyLeave,
  applySit,
  applyStand,
  buildReport,
  cleanText,
  deriveView,
  newPeer,
  overflowForAddress,
  parseClientMessage,
  routeDm,
  routeSay,
  setBlocks,
  shortAddress,
  takeChatRate,
  takeRate,
  upgradePeer,
  type Peer
} from '../casino-room';

const ALICE = 'ST1ALICE000000000000000000000000000000';
const BOB = 'ST2BOB00000000000000000000000000000000';
const peer = (id: string, a: string | null, now = 1000): Peer => newPeer(id, a, a ? 'k'.repeat(40) : null, now);

describe('casino room messages', () => {
  it('parses the room messages and refuses everything else', () => {
    expect(parseClientMessage('{"t":"hello"}')).toEqual({ ok: true, msg: { t: 'hello' } });
    expect(parseClientMessage('{"t":"ping"}')).toEqual({ ok: true, msg: { t: 'ping' } });
    expect(parseClientMessage('{"t":"stand"}')).toEqual({ ok: true, msg: { t: 'stand' } });
    expect(parseClientMessage('{"t":"sit","spot":"bar.1"}')).toEqual({ ok: true, msg: { t: 'sit', spot: 'bar.1' } });
    expect(parseClientMessage('{"t":"sit","spot":"vault.1"}')).toEqual({ ok: false, code: 'no-such-spot' });
    expect(parseClientMessage('{"t":"sit"}')).toEqual({ ok: false, code: 'no-such-spot' });
    expect(parseClientMessage('{"t":"dm","to":"x","text":"hi"}')).toEqual({ ok: false, code: 'no-such-player' });
    expect(parseClientMessage('{"t":"fly"}')).toEqual({ ok: false, code: 'bad-message' });
    expect(parseClientMessage('nope')).toEqual({ ok: false, code: 'bad-json' });
    expect(parseClientMessage('42')).toEqual({ ok: false, code: 'bad-message' });
    expect(parseClientMessage('null')).toEqual({ ok: false, code: 'bad-message' });
    expect(parseClientMessage(new ArrayBuffer(4))).toEqual({ ok: false, code: 'text-only' });
    expect(parseClientMessage('x'.repeat(MAX_FRAME_BYTES + 1))).toEqual({ ok: false, code: 'too-big' });
  });

  it('rate limits a busy connection and recovers after the window', () => {
    const p = peer('a', ALICE);
    for (let i = 0; i < RATE_LIMIT; i += 1) expect(takeRate(p, 5000 + i)).toBe(true);
    expect(takeRate(p, 5100)).toBe(false);
    expect(takeRate(p, 5000 + RATE_WINDOW_MS + RATE_LIMIT)).toBe(true);
    expect(p.rl.length).toBeLessThanOrEqual(RATE_LIMIT);
  });

  it('labels addresses briefly', () => {
    expect(shortAddress(null)).toBe('Guest');
    expect(shortAddress('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X')).toBe('SP3JN…743X');
    expect(shortAddress('SP1')).toBe('SP1');
  });
});

describe('casino room seats', () => {
  it('seats a signed-in person and shows them in the view', () => {
    const peers = [peer('a', ALICE), peer('g', null)];
    const r = applySit(peers, 'a', 'bar.1', 2000);
    expect(r.ok && r.changes.map((c) => c.kind)).toEqual(['sat']);
    const v = deriveView(peers);
    expect(v.joined).toBe(1);
    expect(v.guests).toBe(1);
    expect(v.spots['bar.1']).toMatchObject({ a: ALICE, since: 2000 });
  });

  it('refuses guests, unknown spots, and a spot someone else holds', () => {
    const peers = [peer('a', ALICE), peer('b', BOB), peer('g', null)];
    expect(applySit(peers, 'g', 'bar.1', 1)).toEqual({ ok: false, code: 'sign-in-first' });
    expect(applySit(peers, 'a', 'vault.1', 1)).toEqual({ ok: false, code: 'no-such-spot' });
    expect(applySit(peers, 'zzz', 'bar.1', 1)).toEqual({ ok: false, code: 'gone' });
    expect(applySit(peers, 'a', 'bar.1', 1).ok).toBe(true);
    expect(applySit(peers, 'b', 'bar.1', 2)).toEqual({ ok: false, code: 'taken' });
    expect(peers[0].spot).toBe('bar.1');
    expect(peers[1].spot).toBeNull();
  });

  it('one address, one seat: moving frees the old seat', () => {
    const peers = [peer('a', ALICE)];
    applySit(peers, 'a', 'bar.1', 1);
    const r = applySit(peers, 'a', 'bar.2', 2);
    expect(r.ok && r.changes).toEqual([
      { kind: 'stood', spot: 'bar.1', peerId: 'a' },
      expect.objectContaining({ kind: 'sat', spot: 'bar.2' })
    ]);
    expect(deriveView(peers).spots['bar.1']).toBeUndefined();
  });

  it('a second tab of the same address takes the seat over and the first tab is told', () => {
    const peers = [peer('a1', ALICE), peer('a2', ALICE)];
    applySit(peers, 'a1', 'bar.1', 1);
    const same = applySit(peers, 'a2', 'bar.1', 2);
    expect(same.ok && same.changes.map((c) => `${c.kind}:${c.peerId}`)).toEqual(['moved:a1', 'sat:a2']);
    expect(peers[0].spot).toBeNull();
    expect(peers[1].spot).toBe('bar.1');
    const other = applySit(peers, 'a1', 'bar.3', 3);   // first tab sits elsewhere: the second tab loses bar.1
    expect(other.ok && other.changes.map((c) => `${c.kind}:${c.peerId}:${c.spot}`)).toEqual(
      ['moved:a2:bar.1', 'stood:a2:bar.1', 'sat:a1:bar.3']);
    expect(deriveView(peers).spots).toEqual({ 'bar.3': expect.objectContaining({ a: ALICE }) });
  });

  it('standing up and leaving free the seat; both are quiet when there is nothing to free', () => {
    const peers = [peer('a', ALICE), peer('b', BOB)];
    applySit(peers, 'a', 'liars.2', 1);
    expect(applyStand(peers, 'b')).toEqual([]);
    expect(applyStand(peers, 'a')).toEqual([{ kind: 'stood', spot: 'liars.2', peerId: 'a' }]);
    expect(applyStand(peers, 'a')).toEqual([]);
    applySit(peers, 'b', 'liars.2', 2);
    expect(applyLeave(peers, 'b')).toEqual([{ kind: 'stood', spot: 'liars.2', peerId: 'b' }]);
    expect(deriveView(peers).spots).toEqual({});
  });

  it('closes the oldest extra connections of one address and ignores guests', () => {
    const peers = [peer('1', ALICE, 10), peer('2', ALICE, 20), peer('3', ALICE, 30), peer('4', BOB, 5)];
    expect(MAX_SOCKETS_PER_ADDRESS).toBe(2);
    expect(overflowForAddress(peers, ALICE).map((p) => p.id)).toEqual(['1']);
    expect(overflowForAddress(peers, BOB)).toEqual([]);
    expect(overflowForAddress(peers, null)).toEqual([]);
  });

  it('keeps the spot list free of duplicates', () => {
    expect(new Set(SPOTS).size).toBe(SPOTS.length);
  });
});


// ------------------------------------------------------------------ chat

const CAROL = 'ST3CAROL0000000000000000000000000000000';
const ZERO_WIDTH = String.fromCodePoint(0x200b);
const RIGHT_TO_LEFT_OVERRIDE = String.fromCodePoint(0x202e);
const GRIN = String.fromCodePoint(0x1f600);

describe('casino room text', () => {
  it('tidies spacing and removes characters that cannot be seen', () => {
    expect(cleanText('  hello   there \n friend  ')).toEqual({ ok: true, text: 'hello there friend' });
    expect(cleanText(`hi${ZERO_WIDTH}there`)).toEqual({ ok: true, text: 'hithere' });
    expect(cleanText(`abc${RIGHT_TO_LEFT_OVERRIDE}def`)).toEqual({ ok: true, text: 'abcdef' });
    expect(cleanText('tab\tand\u0007bell')).toEqual({ ok: true, text: 'tab andbell' });
  });

  it('refuses empty, over-long and non-text input; counts characters as people do', () => {
    expect(cleanText('')).toEqual({ ok: false, code: 'empty' });
    expect(cleanText('   ')).toEqual({ ok: false, code: 'empty' });
    expect(cleanText(ZERO_WIDTH)).toEqual({ ok: false, code: 'empty' });
    expect(cleanText(42)).toEqual({ ok: false, code: 'bad-message' });
    expect(cleanText('a'.repeat(MAX_TEXT_CHARS)).ok).toBe(true);
    expect(cleanText('a'.repeat(MAX_TEXT_CHARS + 1))).toEqual({ ok: false, code: 'too-long' });
    expect(cleanText(GRIN.repeat(MAX_TEXT_CHARS)).ok).toBe(true);           // 280 emoji is 280 characters, not 560
    expect(cleanText(GRIN.repeat(MAX_TEXT_CHARS + 1))).toEqual({ ok: false, code: 'too-long' });
  });

  it('has no links, however they are dressed', () => {
    for (const text of [
      'https://evil.example/claim', 'go to www.evil now', 'claim at free-chips.xyz today', 'DISCORD.GG/abc',
      `evil${ZERO_WIDTH}.com`, 'ftp://x', 'see casino.io please'
    ]) expect(cleanText(text)).toEqual({ ok: false, code: 'no-links' });
    for (const text of ['good hand. well played', 'meet at 9.30', 'bar.1 is free', 'Nice hand.Well played', 'what a night!'])
      expect(cleanText(text).ok).toBe(true);
  });
});

describe('casino room chat messages', () => {
  it('parses say and dm, cleaning the text on the way in', () => {
    expect(parseClientMessage('{"t":"say","text":"  hi   there "}')).toEqual({ ok: true, msg: { t: 'say', text: 'hi there' } });
    expect(parseClientMessage(JSON.stringify({ t: 'dm', to: BOB, text: 'psst' }))).toEqual({ ok: true, msg: { t: 'dm', to: BOB, text: 'psst' } });
    expect(parseClientMessage('{"t":"say","text":""}')).toEqual({ ok: false, code: 'empty' });
    expect(parseClientMessage('{"t":"say"}')).toEqual({ ok: false, code: 'bad-message' });
    expect(parseClientMessage('{"t":"say","text":"see evil.com"}')).toEqual({ ok: false, code: 'no-links' });
    expect(parseClientMessage(JSON.stringify({ t: 'say', text: 'a'.repeat(281) }))).toEqual({ ok: false, code: 'too-long' });
    expect(parseClientMessage(JSON.stringify({ t: 'dm', to: 'not an address', text: 'hi' }))).toEqual({ ok: false, code: 'no-such-player' });
    expect(parseClientMessage(JSON.stringify({ t: 'dm', text: 'hi' }))).toEqual({ ok: false, code: 'no-such-player' });
  });

  it('fits the widest message and the longest block list inside one frame', () => {
    const wide = JSON.stringify({ t: 'say', text: GRIN.repeat(MAX_TEXT_CHARS) });
    expect(new TextEncoder().encode(wide).length).toBeLessThan(MAX_FRAME_BYTES);
    expect(parseClientMessage(wide).ok).toBe(true);
    const list = Array.from({ length: MAX_BLOCKS }, (_, i) => 'SP' + String(i).padStart(2, '0') + 'A'.repeat(37));
    const frame = JSON.stringify({ t: 'blocks', list });
    expect(new TextEncoder().encode(frame).length).toBeLessThan(MAX_FRAME_BYTES);
    expect(parseClientMessage(frame)).toEqual({ ok: true, msg: { t: 'blocks', list } });
  });

  it('checks block lists: addresses only, no repeats, not too many', () => {
    expect(parseClientMessage(JSON.stringify({ t: 'blocks', list: [BOB, BOB, CAROL] }))).toEqual({ ok: true, msg: { t: 'blocks', list: [BOB, CAROL] } });
    expect(parseClientMessage(JSON.stringify({ t: 'blocks', list: [] }))).toEqual({ ok: true, msg: { t: 'blocks', list: [] } });
    expect(parseClientMessage(JSON.stringify({ t: 'blocks', list: ['nope'] }))).toEqual({ ok: false, code: 'bad-message' });
    expect(parseClientMessage(JSON.stringify({ t: 'blocks', list: 'x' }))).toEqual({ ok: false, code: 'bad-message' });
    const many = Array.from({ length: MAX_BLOCKS + 1 }, (_, i) => 'SP' + String(i).padStart(2, '0') + 'A'.repeat(37));
    expect(parseClientMessage(JSON.stringify({ t: 'blocks', list: many }))).toEqual({ ok: false, code: 'too-many-blocks' });
  });

  it('checks reports: a known reason, a few short lines, links allowed as evidence', () => {
    const ok = parseClientMessage(JSON.stringify({ t: 'report', who: BOB, why: 'scam', lines: ['send me chips at evil.com', '  ', 'x'.repeat(500)] }));
    expect(ok.ok && ok.msg.t === 'report' && ok.msg.lines.map((l) => l.length)).toEqual([25, MAX_REPORT_LINE_CHARS]);
    expect(parseClientMessage(JSON.stringify({ t: 'report', who: BOB, why: 'spam' }))).toEqual({ ok: true, msg: { t: 'report', who: BOB, why: 'spam', lines: [] } });
    expect(parseClientMessage(JSON.stringify({ t: 'report', who: BOB, why: 'rude' }))).toEqual({ ok: false, code: 'bad-message' });
    expect(parseClientMessage(JSON.stringify({ t: 'report', who: 'x', why: 'spam' }))).toEqual({ ok: false, code: 'no-such-player' });
    expect(parseClientMessage(JSON.stringify({ t: 'report', who: BOB, why: 'spam', lines: ['1', '2', '3', '4', '5', '6'] }))).toEqual({ ok: false, code: 'bad-message' });
    expect(parseClientMessage(JSON.stringify({ t: 'report', who: BOB, why: 'spam', lines: [7] }))).toEqual({ ok: false, code: 'bad-message' });
  });

  it('limits chat to one message every 2 seconds and 20 a minute, and only counts messages it lets through', () => {
    const p = peer('a', ALICE);
    expect(takeChatRate(p, 10_000)).toBe(true);
    expect(takeChatRate(p, 10_000 + CHAT_MIN_GAP_MS - 1)).toBe(false);
    expect(takeChatRate(p, 10_000 + CHAT_MIN_GAP_MS)).toBe(true);
    expect(p.cl).toEqual([10_000, 12_000]);
    const q = peer('b', BOB);
    for (let i = 0; i < CHAT_PER_MINUTE; i += 1) expect(takeChatRate(q, i * CHAT_MIN_GAP_MS)).toBe(true);   // 0 .. 38 s
    expect(takeChatRate(q, 40_000)).toBe(false);
    expect(takeChatRate(q, 59_999)).toBe(false);
    expect(takeChatRate(q, 60_001)).toBe(true);                                                            // the first one has aged out
    expect(q.cl.length).toBeLessThanOrEqual(CHAT_PER_MINUTE);
  });

  it('fills in the fields a connection saved before chat existed', () => {
    const old = { id: 'o', a: ALICE, k: null, spot: null, since: 1, rl: [] } as unknown as Peer;
    upgradePeer(old);
    expect(old.cl).toEqual([]);
    expect(old.b).toEqual([]);
    expect(takeChatRate(old, 5)).toBe(true);
  });
});

describe('casino room who hears what', () => {
  const room = () => [peer('a1', ALICE), peer('a2', ALICE), peer('b', BOB), peer('c', CAROL), peer('g', null)];

  it('lists each signed-in person once, with their seat, and leaves guests out', () => {
    const peers = room();
    applySit(peers, 'b', 'bar.2', 5);
    const v = deriveView(peers);
    expect(v.players).toEqual([
      { a: ALICE, n: shortAddress(ALICE), spot: null },
      { a: BOB, n: shortAddress(BOB), spot: 'bar.2' },
      { a: CAROL, n: shortAddress(CAROL), spot: null }
    ]);
    expect(v.guests).toBe(1);
  });

  it('sends public messages to signed-in people only, both of the speaker\'s tabs included', () => {
    const peers = room();
    const r = routeSay(peers, 'a1', 'hello all', 9);
    expect(r).toEqual({ ok: true, message: { t: 'say', from: { a: ALICE, n: shortAddress(ALICE) }, text: 'hello all', at: 9 }, to: ['a1', 'a2', 'b', 'c'] });
    expect(routeSay(peers, 'g', 'hi', 9)).toEqual({ ok: false, code: 'sign-in-first' });
    expect(routeSay(peers, 'zzz', 'hi', 9)).toEqual({ ok: false, code: 'gone' });
  });

  it('blocking hides both people from each other and nobody else', () => {
    const peers = room();
    setBlocks(peers, 'a1', [BOB]);                                   // one of Alice's tabs is enough
    const fromBob = routeSay(peers, 'b', 'hi', 1);
    const fromAlice = routeSay(peers, 'a2', 'hi', 1);
    const fromCarol = routeSay(peers, 'c', 'hi', 1);
    expect(fromBob.ok && fromBob.to).toEqual(['b', 'c']);            // Alice does not hear Bob
    expect(fromAlice.ok && fromAlice.to).toEqual(['a1', 'a2', 'c']); // and Bob does not hear Alice
    expect(fromCarol.ok && fromCarol.to).toEqual(['a1', 'a2', 'b', 'c']);
  });

  it('sends a private message to every tab of the person it is for and back to every tab of the sender', () => {
    const peers = room();
    const r = routeDm(peers, 'b', ALICE, 'psst', 3);
    expect(r).toEqual({
      ok: true,
      message: { t: 'dm', from: { a: BOB, n: shortAddress(BOB) }, to: { a: ALICE, n: shortAddress(ALICE) }, text: 'psst', at: 3 },
      to: ['b', 'a1', 'a2']
    });
  });

  it('refuses private messages to yourself, to people who are not here, from guests, and to people you blocked', () => {
    const peers = room();
    expect(routeDm(peers, 'g', ALICE, 'hi', 1)).toEqual({ ok: false, code: 'sign-in-first' });
    expect(routeDm(peers, 'b', BOB, 'hi', 1)).toEqual({ ok: false, code: 'not-you' });
    expect(routeDm(peers, 'b', 'ST9NOBODY00000000000000000000000000000', 'hi', 1)).toEqual({ ok: false, code: 'not-here' });
    expect(routeDm(peers, 'zzz', ALICE, 'hi', 1)).toEqual({ ok: false, code: 'gone' });
    setBlocks(peers, 'b', [ALICE]);
    expect(routeDm(peers, 'b', ALICE, 'hi', 1)).toEqual({ ok: false, code: 'blocked' });
  });

  it('shows a blocked sender their own message as sent, and tells the person who blocked them nothing', () => {
    const peers = room();
    setBlocks(peers, 'a2', [BOB]);
    const r = routeDm(peers, 'b', ALICE, 'please?', 1);
    expect(r.ok && r.to).toEqual(['b']);
  });

  it('keeps a block list as the player sent it: replaced, never including themselves, never for guests', () => {
    const peers = room();
    expect(setBlocks(peers, 'a1', [BOB, ALICE, CAROL])).toEqual([BOB, CAROL]);
    expect(setBlocks(peers, 'a1', [CAROL])).toEqual([CAROL]);
    expect(peers[0].b).toEqual([CAROL]);
    expect(setBlocks(peers, 'g', [BOB])).toBeNull();
    expect(setBlocks(peers, 'zzz', [BOB])).toBeNull();
  });

  it('builds a report only for a signed-in person about someone else', () => {
    const peers = room();
    expect(buildReport(peers, 'b', ALICE, 'abuse', ['rude'], 7)).toEqual({ ok: true, report: { at: 7, by: BOB, who: ALICE, why: 'abuse', lines: ['rude'] } });
    expect(buildReport(peers, 'b', BOB, 'abuse', [], 7)).toEqual({ ok: false, code: 'not-you' });
    expect(buildReport(peers, 'g', ALICE, 'abuse', [], 7)).toEqual({ ok: false, code: 'sign-in-first' });
    expect(buildReport(peers, 'zzz', ALICE, 'abuse', [], 7)).toEqual({ ok: false, code: 'gone' });
  });
});
