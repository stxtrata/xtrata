import { describe, expect, it } from 'vitest';
import {
  MACHINE_IDS,
  MAX_BET,
  MAX_STOP,
  MAX_STOPS,
  MIN_STOPS,
  PLAY_MIN_GAP_MS,
  PLAY_PER_MINUTE,
  ROOM_FEATURES,
  SPOTS,
  applySit,
  isMachineSpot,
  newPeer,
  parseClientMessage,
  routePlay,
  takePlayRate,
  takeRate,
  upgradePeer,
  type Peer
} from '../casino-room';
import { isChatError } from '../../../src/casino-room/chat-core';

const ALICE = 'ST1ALICE000000000000000000000000000000';
const BOB = 'ST2BOB00000000000000000000000000000000';
const peer = (id: string, a: string | null, now = 1000): Peer => newPeer(id, a, a ? 'k'.repeat(40) : null, now);
const play = (extra: Record<string, unknown> = {}) => JSON.stringify({ t: 'play', spot: 'drop.1', s: [3, 41, 0, 17, 9], b: 100, f: false, ...extra });

describe('spin replay: what counts as a spin', () => {
  it('knows the ten cabinets and nothing else', () => {
    const cabinets = SPOTS.filter((s) => isMachineSpot(s));
    expect(cabinets).toEqual(['drop.1', 'drop.2', 'twins.1', 'twins.2', 'ds.1', 'ds.2', 'bf.1', 'bf.2', 'nv.1', 'nv.2']);
    expect(MACHINE_IDS.length).toBe(5);
    for (const notACabinet of ['blackjack.1', 'roulette.pad', 'bar.1', 'drop.3', 'drop', '', null, 7]) expect(isMachineSpot(notACabinet)).toBe(false);
  });

  it('parses a spin', () => {
    expect(parseClientMessage(play())).toEqual({ ok: true, msg: { t: 'play', spot: 'drop.1', s: [3, 41, 0, 17, 9], b: 100, f: false } });
    expect(parseClientMessage(play({ f: true }))).toMatchObject({ ok: true, msg: { f: true } });
    expect(parseClientMessage(play({ f: 1 }))).toMatchObject({ ok: true, msg: { f: true } });
    expect(parseClientMessage(play({ f: 'yes' }))).toMatchObject({ ok: true, msg: { f: false } });
    expect(parseClientMessage(play({ spot: 'nv.2', s: [0, 0, 0, 0, 0], b: 1000 }))).toMatchObject({ ok: true, msg: { spot: 'nv.2' } });
  });

  it('keeps only the fields it knows', () => {
    const r = parseClientMessage(play({ a: BOB, at: 1, extra: 'x' }));
    expect(r).toEqual({ ok: true, msg: { t: 'play', spot: 'drop.1', s: [3, 41, 0, 17, 9], b: 100, f: false } });
  });

  it('refuses spins that are not from a cabinet or are malformed', () => {
    expect(parseClientMessage(play({ spot: 'blackjack.1' }))).toEqual({ ok: false, code: 'play-bad-spot' });
    expect(parseClientMessage(play({ spot: 'drop.9' }))).toEqual({ ok: false, code: 'play-bad-spot' });
    expect(parseClientMessage(play({ spot: undefined }))).toEqual({ ok: false, code: 'play-bad-spot' });
    const bad = [
      { s: 'nope' }, { s: [] }, { s: Array(MIN_STOPS - 1).fill(1) }, { s: Array(MAX_STOPS + 1).fill(1) },
      { s: [1, 2, 3, -1, 5] }, { s: [1, 2, 3, 1.5, 5] }, { s: [1, 2, 3, MAX_STOP + 1, 5] }, { s: [1, 2, 3, '4', 5] }, { s: [1, 2, null, 4, 5] },
      { b: 0 }, { b: -20 }, { b: 2.5 }, { b: '100' }, { b: MAX_BET + 1 }, { b: undefined }
    ];
    for (const extra of bad) expect(parseClientMessage(play(extra))).toEqual({ ok: false, code: 'play-bad' });
  });

  it('uses error codes the chat never shows as a chat error', () => {
    for (const code of ['play-bad-spot', 'play-bad', 'play-gone', 'play-sign-in-first', 'play-not-your-spot', 'play-too-fast']) {
      expect(isChatError(code)).toBe(false);
    }
  });

  it('tells clients the room can pass spins on', () => {
    expect(ROOM_FEATURES).toContain('play');
  });
});

describe('spin replay: who may send it and who hears it', () => {
  it('passes a spin from the seated player to everyone else, guests included', () => {
    const peers = [peer('a', ALICE), peer('b', BOB), peer('g', null), peer('a2', ALICE)];
    expect(applySit(peers, 'a', 'drop.1', 2000).ok).toBe(true);
    const r = routePlay(peers, 'a', { spot: 'drop.1', s: [1, 2, 3, 4, 5], b: 40, f: false }, 3000);
    expect(r).toEqual({ ok: true, message: { t: 'play', spot: 'drop.1', a: ALICE, s: [1, 2, 3, 4, 5], b: 40, f: false, at: 3000 }, to: ['b', 'g', 'a2'] });
  });

  it('refuses a spin at a cabinet the sender is not at', () => {
    const peers = [peer('a', ALICE), peer('b', BOB)];
    expect(applySit(peers, 'b', 'drop.1', 2000).ok).toBe(true);
    expect(routePlay(peers, 'a', { spot: 'drop.1', s: [1, 2, 3, 4, 5], b: 40, f: false }, 3000)).toEqual({ ok: false, code: 'play-not-your-spot' });
    expect(applySit(peers, 'a', 'twins.2', 2100).ok).toBe(true);
    expect(routePlay(peers, 'a', { spot: 'drop.1', s: [1, 2, 3, 4, 5], b: 40, f: false }, 3000)).toEqual({ ok: false, code: 'play-not-your-spot' });
    expect(routePlay(peers, 'a', { spot: 'twins.2', s: [1, 2, 3, 4, 5], b: 40, f: false }, 3000).ok).toBe(true);
  });

  it('refuses a spin from a guest or an unknown connection', () => {
    const peers = [peer('g', null), peer('b', BOB)];
    expect(routePlay(peers, 'g', { spot: 'drop.1', s: [1, 2, 3, 4, 5], b: 40, f: false }, 3000)).toEqual({ ok: false, code: 'play-sign-in-first' });
    expect(routePlay(peers, 'zz', { spot: 'drop.1', s: [1, 2, 3, 4, 5], b: 40, f: false }, 3000)).toEqual({ ok: false, code: 'play-gone' });
  });

  it('refuses a spin after the player stands up from that cabinet', () => {
    const peers = [peer('a', ALICE), peer('b', BOB)];
    applySit(peers, 'a', 'nv.1', 2000);
    peers[0].spot = null;
    expect(routePlay(peers, 'a', { spot: 'nv.1', s: [1, 2, 3, 4, 5], b: 40, f: false }, 3000)).toEqual({ ok: false, code: 'play-not-your-spot' });
  });
});

describe('spin replay: limits', () => {
  it('needs a short gap between spins and caps spins a minute', () => {
    const p = peer('a', ALICE);
    expect(takePlayRate(p, 10_000)).toBe(true);
    expect(takePlayRate(p, 10_000 + PLAY_MIN_GAP_MS - 1)).toBe(false);
    expect(takePlayRate(p, 10_000 + PLAY_MIN_GAP_MS)).toBe(true);
    const q = peer('q', ALICE);
    let t = 100_000, ok = 0;
    for (let i = 0; i < PLAY_PER_MINUTE + 20; i += 1, t += PLAY_MIN_GAP_MS) if (takePlayRate(q, t)) ok += 1;
    expect(ok).toBe(PLAY_PER_MINUTE);
    expect(takePlayRate(q, t + 60_000)).toBe(true);
  });

  it('keeps spins apart from the general message limit', () => {
    const p = peer('a', ALICE);
    for (let i = 0; i < 30; i += 1) takePlayRate(p, 10_000 + i * PLAY_MIN_GAP_MS);
    expect(p.rl).toEqual([]);
    expect(takeRate(p, 20_000)).toBe(true);
  });

  it('upgrades a connection saved before spins existed', () => {
    const old = { id: 'o', a: ALICE, k: null, spot: null, since: 1, rl: [], cl: [], b: [] } as unknown as Peer;
    expect(upgradePeer(old).pl).toEqual([]);
    expect(takePlayRate(old, 5000)).toBe(true);
  });
});
