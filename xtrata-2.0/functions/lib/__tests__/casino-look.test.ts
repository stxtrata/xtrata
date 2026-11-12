import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';
import { LOOK_FACES, LOOK_FINISHES, LOOK_FRAMES, LOOK_MAX, LOOK_PATTERN, isCubeLook, parseLook, parseLookMessage } from '../casino-look';
import { applyLook, deriveView, newPeer, parseClientMessage, roomMessage, takeLookRate, ROOM_FEATURES } from '../casino-room';

const A = 'ST2SMCB4CV776FCP9A2EK0ZM37NAXM1MFJMMX9DW8', B = 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA';

describe('look codes', () => {
  it('accepts the three bodies, presets and a custom frame colour', () => {
    for (const code of ['p000n-4ed5bd', 'h000n-4ed5bd', 'f755t-ffffff', 'hx12s-4ed5bd-e9e8e2', 'fx00n-000000-ffffff']) expect(parseLook(code)).toBe(code);
  });
  it('refuses everything else', () => {
    for (const bad of [null, 7, '', 'h', 'h000n', 'h000n-4ED5BD', 'h800n-4ed5bd', 'h060n-4ed5bd', 'h006n-4ed5bd', 'h000x-4ed5bd', 'q000n-4ed5bd',
      'hx00n-4ed5bd', 'h000n-4ed5bd-e9e8e2', 'h000n-4ed5bd ', ' h000n-4ed5bd', 'h000n-4ed5bg', 'hx00n-4ed5bd-e9e8e2-', '<b>000n-4ed5bd', 'h000n-4ed5bd\n'])
      expect(parseLook(bad)).toBeNull();
  });
  it('never lets a code grow past the limit', () => {
    expect('hx00n-aaaaaa-bbbbbb'.length).toBe(LOOK_MAX);
    expect(parseLook('hx00n-aaaaaa-bbbbbb')).not.toBeNull();
    expect(parseLook('hx00n-aaaaaa-bbbbbbb')).toBeNull();
  });
  it('treats the human figure as no code at all', () => {
    expect(parseLookMessage({ t: 'look', v: 'p000n-4ed5bd' })).toEqual({ ok: true, msg: { t: 'look', v: null } });
    expect(parseLookMessage({ t: 'look', v: null })).toEqual({ ok: true, msg: { t: 'look', v: null } });
    expect(parseLookMessage({ t: 'look' })).toEqual({ ok: true, msg: { t: 'look', v: null } });
    expect(parseLookMessage({ t: 'look', v: 'nonsense' })).toEqual({ ok: false, code: 'look-bad' });
    expect(isCubeLook('h000n-4ed5bd')).toBe(true); expect(isCubeLook('p000n-4ed5bd')).toBe(false); expect(isCubeLook(null)).toBe(false);
  });
});

describe('the page and the room agree on what a look is', () => {
  // public/casino/cube-avatars.js is a plain script for the page; it carries its own copy of the lists and the pattern.
  const source = readFileSync(join(__dirname, '../../../public/casino/cube-avatars.js'), 'utf8');
  const sandbox: any = { window: {}, console };
  vm.runInNewContext(source, sandbox);
  const PX = sandbox.window.PXCubes;
  it('has the same lists', () => {
    expect([...PX.FRAMES.map((f: any) => f.id)]).toEqual([...LOOK_FRAMES]);
    expect([...PX.FINISHES.map((f: any) => f.id)]).toEqual([...LOOK_FINISHES]);
    expect([...PX.FACES.map((f: any) => f.id)]).toEqual([...LOOK_FACES]);
  });
  it('accepts and refuses the same codes', () => {
    const samples = ['p000n-4ed5bd', 'h000n-4ed5bd', 'f755t-ffffff', 'hx12s-4ed5bd-e9e8e2', 'h800n-4ed5bd', 'hx00n-4ed5bd', 'h000n-4ED5BD', '', 'h000n-4ed5bd-e9e8e2', 'f060n-4ed5bd', 'hx00n-aaaaaa-bbbbbbb'];
    for (const s of samples) expect(!!PX.parseLook(s), s).toBe(LOOK_PATTERN.test(s));
  });
  it('writes codes the room accepts, whatever is asked of it', () => {
    for (const look of [{}, { body: 'h' }, { body: 'f', frame: 'cobalt', finish: 'crt', face: 'focus', gait: 't', accent: '#FF00aa' }, { body: 'h', frame: 'x', frameColor: '#123456' },
      { body: 'zz', frame: 'nope', finish: 9, face: 'x', gait: 'q', accent: 'red', frameColor: 'blue' }]) {
      const code = PX.encodeLook(look);
      expect(parseLook(code), JSON.stringify(look) + ' -> ' + code).toBe(code);
      expect(PX.encodeLook(PX.parseLook(code))).toBe(code);
    }
  });
});

describe('looks in the room', () => {
  const peers = () => [newPeer('1', A, 'ka', 0), newPeer('2', A, 'ka', 0), newPeer('3', B, 'kb', 0), newPeer('4', null, null, 0, true), newPeer('5', null, null, 0, false)];
  it('is a feature the room lists', () => { expect(ROOM_FEATURES).toContain('look'); });
  it('parses the message', () => {
    expect(parseClientMessage(JSON.stringify({ t: 'look', v: 'f000n-4ed5bd' }))).toEqual({ ok: true, msg: { t: 'look', v: 'f000n-4ed5bd' } });
    expect(parseClientMessage(JSON.stringify({ t: 'look', v: 'f000n-4ed5bd<script>' }))).toEqual({ ok: false, code: 'look-bad' });
  });
  it('sets every tab of the player and tells everyone who can see the room', () => {
    const list = peers();
    const r = applyLook(list, '1', 'h000n-4ed5bd');
    expect(r.ok).toBe(true); if (!r.ok) return;
    expect(r.message).toEqual({ t: 'look', a: A, v: 'h000n-4ed5bd' });
    expect(r.changed.sort()).toEqual(['1', '2']);
    expect(r.to.sort()).toEqual(['2', '3', '4']);          // not the sender, and not the guest who may not watch
    expect(list[0].lk).toBe('h000n-4ed5bd'); expect(list[1].lk).toBe('h000n-4ed5bd'); expect(list[2].lk).toBeUndefined();
    const view = deriveView(list);
    expect(view.players.find((p) => p.a === A)?.lk).toBe('h000n-4ed5bd');
    expect(view.players.find((p) => p.a === B)?.lk).toBeUndefined();
    expect((roomMessage(list, list[2], 1, ROOM_FEATURES) as any).players.find((p: any) => p.a === A).lk).toBe('h000n-4ed5bd');
    expect((roomMessage(list, list[4], 1, ROOM_FEATURES) as any).players).toEqual([]);
  });
  it('goes back to the human figure with null', () => {
    const list = peers(); applyLook(list, '1', 'h000n-4ed5bd');
    const r = applyLook(list, '2', null);
    expect(r.ok && r.message.v).toBeNull();
    expect(list[0].lk).toBeUndefined(); expect(list[1].lk).toBeUndefined();
  });
  it('refuses guests and bad codes', () => {
    const list = peers();
    expect(applyLook(list, '4', 'h000n-4ed5bd')).toEqual({ ok: false, code: 'look-sign-in-first' });
    expect(applyLook(list, '1', 'whatever')).toEqual({ ok: false, code: 'look-bad' });
    expect(applyLook(list, 'nobody', null)).toEqual({ ok: false, code: 'look-gone' });
  });
  it('limits how often a look may change', () => {
    const p = newPeer('1', A, 'ka', 0);
    expect(takeLookRate(p, 10_000)).toBe(true);
    expect(takeLookRate(p, 10_500)).toBe(false);       // too soon
    let t = 12_000, ok = 1;
    for (let i = 0; i < 20; i++, t += 1_600) if (takeLookRate(p, t)) ok++;
    expect(ok).toBe(12);                                // twelve a minute
    expect(takeLookRate(p, t + 60_000)).toBe(true);
  });
});
