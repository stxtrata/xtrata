import { describe, expect, it } from 'vitest';
import {
  MAX_FRAME_BYTES,
  MAX_SOCKETS_PER_ADDRESS,
  RATE_LIMIT,
  RATE_WINDOW_MS,
  SPOTS,
  applyLeave,
  applySit,
  applyStand,
  deriveView,
  newPeer,
  overflowForAddress,
  parseClientMessage,
  shortAddress,
  takeRate,
  type Peer
} from '../casino-room';

const ALICE = 'ST1ALICE000000000000000000000000000000';
const BOB = 'ST2BOB00000000000000000000000000000000';
const peer = (id: string, a: string | null, now = 1000): Peer => newPeer(id, a, a ? 'k'.repeat(40) : null, now);

describe('casino room messages', () => {
  it('parses the four messages and refuses everything else', () => {
    expect(parseClientMessage('{"t":"hello"}')).toEqual({ ok: true, msg: { t: 'hello' } });
    expect(parseClientMessage('{"t":"ping"}')).toEqual({ ok: true, msg: { t: 'ping' } });
    expect(parseClientMessage('{"t":"stand"}')).toEqual({ ok: true, msg: { t: 'stand' } });
    expect(parseClientMessage('{"t":"sit","spot":"bar.1"}')).toEqual({ ok: true, msg: { t: 'sit', spot: 'bar.1' } });
    expect(parseClientMessage('{"t":"sit","spot":"vault.1"}')).toEqual({ ok: false, code: 'no-such-spot' });
    expect(parseClientMessage('{"t":"sit"}')).toEqual({ ok: false, code: 'no-such-spot' });
    expect(parseClientMessage('{"t":"dm","to":"x","text":"hi"}')).toEqual({ ok: false, code: 'bad-message' });
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
