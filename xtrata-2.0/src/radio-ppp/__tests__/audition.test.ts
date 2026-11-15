// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { createAudition } from '../audition';

const flush = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
const res = (body: string, type: string, ok = true) => ({ ok, headers: new Headers({ 'content-type': type }), body: { cancel: async () => {} }, text: async () => body }) as unknown as Response;
const OPUS = 'data:audio/ogg;base64,' + btoa('OggS-not-really');

function setup(pages: Record<string, Response | Error>) {
  const made: any[] = [];
  const world = { changes: 0, quiet: 0, asked: [] as string[], playFails: false };
  const a = createAudition({
    changed: () => { world.changes++; },
    quiet: () => { world.quiet++; },
    fetch: (async (url: string) => { world.asked.push(url); const p = pages[url]; if (!p) return res('', 'text/plain', false); if (p instanceof Error) throw p; return p; }) as unknown as typeof fetch,
    audio: () => { const el = document.createElement('audio') as any; el.play = vi.fn(async () => { if (world.playFails) throw new Error('blocked'); }); el.pause = vi.fn(); el.load = vi.fn(); made.push(el); return el; }
  });
  return { a, world, made };
}

describe('listening to your own song before releasing it', () => {
  it('plays a plain audio inscription from its own address, after asking the radio to go quiet', async () => {
    const s = setup({ '/inscription/8': res('', 'audio/mpeg') });
    s.a.toggle(8);
    expect(s.a.state(8)).toBe('loading');
    await flush();
    expect(s.a.state(8)).toBe('playing');
    expect(s.made[0].getAttribute('src')).toBe('/inscription/8');
    expect(s.world.quiet).toBe(1);
    expect(s.a.state(9)).toBe('idle');
  });

  it('plays the audio a song page embeds', async () => {
    const s = setup({ '/inscription/315': res(`<html><audio controls><source src="${OPUS}" type="audio/ogg"></audio></html>`, 'text/html; charset=utf-8') });
    s.a.toggle(315); await flush();
    expect(s.a.state(315)).toBe('playing');
    expect(s.made[0].getAttribute('src')).toMatch(/^blob:/);
  });

  it('follows a song page to the one inscription it links its audio from, and no further', async () => {
    const s = setup({
      '/inscription/20': res('<audio><source src="/inscription/21"></audio>', 'text/html'),
      '/inscription/21': res('', 'audio/ogg'),
      '/inscription/30': res('<audio><source src="/inscription/31"></audio>', 'text/html'),
      '/inscription/31': res('<audio><source src="/inscription/32"></audio>', 'text/html'),
      '/inscription/32': res('', 'audio/ogg')
    });
    s.a.toggle(20); await flush();
    expect(s.made[0].getAttribute('src')).toBe('/inscription/21');
    s.a.toggle(30); await flush();
    expect(s.a.state(30)).toBe('error');
    expect(s.world.asked).not.toContain('/inscription/32');
  });

  it('tapping the same song stops it; tapping another moves to that one', async () => {
    const s = setup({ '/inscription/8': res('', 'audio/mpeg'), '/inscription/9': res('', 'audio/mpeg') });
    s.a.toggle(8); await flush();
    s.a.toggle(9); await flush();
    expect(s.a.state(8)).toBe('idle');
    expect(s.a.state(9)).toBe('playing');
    expect(s.made).toHaveLength(1);                                             // one audio element: never two songs at once
    s.a.toggle(9);
    expect(s.a.state(9)).toBe('idle');
    expect(s.made[0].pause).toHaveBeenCalled();
  });

  it('a song that ends goes back to idle', async () => {
    const s = setup({ '/inscription/8': res('', 'audio/mpeg') });
    s.a.toggle(8); await flush();
    s.made[0].dispatchEvent(new Event('ended'));
    expect(s.a.state(8)).toBe('idle');
  });

  it('says error, never silence, when a song is missing, is not audio, or the browser refuses to play', async () => {
    const s = setup({ '/inscription/2': res('<p>hello</p>', 'text/html'), '/inscription/3': res('', 'image/png'), '/inscription/4': new Error('offline'), '/inscription/8': res('', 'audio/mpeg') });
    for (const id of [1, 2, 3, 4]) { s.a.toggle(id); await flush(); expect(s.a.state(id)).toBe('error'); }
    expect(s.world.quiet).toBe(0);                                              // the radio is only paused once there is something to play
    s.world.playFails = true;
    s.a.toggle(8); await flush();
    expect(s.a.state(8)).toBe('error');
    s.world.playFails = false;
    s.a.toggle(8); await flush();                                               // tapping an errored song tries again
    expect(s.a.state(8)).toBe('playing');
  });

  it('stop while a song is still loading never starts it', async () => {
    let let_go!: (r: Response) => void;
    const s = setup({});
    const a = createAudition({ changed: () => {}, fetch: (() => new Promise<Response>((ok) => { let_go = ok; })) as unknown as typeof fetch, audio: () => { const el = document.createElement('audio') as any; el.play = vi.fn(async () => {}); el.pause = vi.fn(); s.made.push(el); return el; } });
    a.toggle(8);
    a.stop();
    let_go(res('', 'audio/mpeg')); await flush();
    expect(a.state(8)).toBe('idle');
    expect(s.made).toHaveLength(0);
  });
});
