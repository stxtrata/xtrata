/**
 * Hearing one of your own songs before you release it (releases.ts). One song at a time, on its own audio element:
 * nothing is paid, counted or signed, and the radio is asked to go quiet first so two songs never sound at once.
 * A song's inscription is either plain audio, or a page that embeds its audio (or links it from one other inscription).
 */
import { linkedAudioId } from '../lib/radio/song-sources.mjs';

export type AuditionState = 'idle' | 'loading' | 'playing' | 'error';
export interface Audition { state(id: number): AuditionState; toggle(id: number): void; stop(): void }
export interface AuditionDeps {
  changed(): void;
  /** Pause whatever else is sounding (the radio). */
  quiet?(): void;
  fetch?: typeof fetch;
  audio?: () => HTMLAudioElement;
}

const MAX_PAGE = 48 * 1024 * 1024;

/** A `data:audio/...;base64,...` address as a Blob address (a long data address is slow or refused as a `src`). */
function blobUrl(data: string): string {
  const m = /^data:(audio\/[^;,]+)[^,]*?(;base64)?,(.*)$/s.exec(data);
  if (!m) throw new Error('unreadable audio');
  if (!m[2]) return data;
  const bin = atob(m[3].replace(/\s+/g, ''));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes], { type: m[1] }));
}

export function createAudition(deps: AuditionDeps): Audition {
  const get = deps.fetch ?? ((...a: Parameters<typeof fetch>) => fetch(...a));
  let now: { id: number; state: AuditionState } | null = null;
  let player: HTMLAudioElement | null = null;
  let src = '';
  let ctl: AbortController | null = null;

  const set = (next: typeof now) => { now = next; deps.changed(); };
  const silence = () => {
    ctl?.abort(); ctl = null;
    if (player) { try { player.pause(); player.removeAttribute('src'); player.load?.(); } catch { /* already quiet */ } }
    if (src.startsWith('blob:')) URL.revokeObjectURL(src);
    src = '';
  };

  async function find(id: number, signal: AbortSignal, depth = 0): Promise<string> {
    const url = '/inscription/' + id;
    const r = await get(url, { signal });
    const type = (r.headers.get('content-type') || '').toLowerCase();
    if (!r.ok) { await r.body?.cancel(); throw new Error('not found'); }
    if (type.startsWith('audio/')) { await r.body?.cancel(); return url; }
    if (!type.includes('text/html')) { await r.body?.cancel(); throw new Error('not a song'); }
    const html = await r.text();
    if (html.length > MAX_PAGE) throw new Error('too large');
    const own = html.match(/<(?:source|audio)\b[^>]*\bsrc=["'](data:audio\/[^"']+)["']/i);
    if (own) return blobUrl(own[1].replace(/&amp;/g, '&'));
    const linked = depth === 0 ? linkedAudioId(html) : null;
    if (linked) return find(Number(linked), signal, 1);
    throw new Error('no audio');
  }

  async function start(id: number) {
    silence();
    const mine = (ctl = new AbortController());
    set({ id, state: 'loading' });
    try {
      const found = await find(id, mine.signal);
      if (mine.signal.aborted) { if (found.startsWith('blob:')) URL.revokeObjectURL(found); return; }
      src = found;
      if (!player) {
        player = deps.audio ? deps.audio() : new Audio();
        player.addEventListener('ended', () => { if (now?.state === 'playing') { silence(); set(null); } });
        player.addEventListener('error', () => { if (now?.state === 'playing') { const id = now.id; silence(); set({ id, state: 'error' }); } });
      }
      deps.quiet?.();
      player.src = found;
      await player.play();
      if (mine.signal.aborted) return;
      set({ id, state: 'playing' });
    } catch {
      if (mine.signal.aborted) return; // stopped, or another song was chosen
      silence();
      set({ id, state: 'error' });
    }
  }

  return {
    state: (id) => (now?.id === id ? now.state : 'idle'),
    toggle: (id) => { if (now?.id === id && now.state !== 'error') { silence(); set(null); } else void start(id); },
    stop: () => { if (!now) return; silence(); set(null); }
  };
}
