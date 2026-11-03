/**
 * Small artwork for songs and albums, shared by the open album's song list and the "My albums" shelf (one cache, one
 * queue, so the page never reads two songs at once).
 */
const listeners = new Set<() => void>();
/** Called whenever artwork was found, so a view can draw again. Returns a way to stop listening. */
export const onArt = (run: () => void) => { listeners.add(run); return () => { listeners.delete(run); }; };
const notify = () => { for (const run of [...listeners]) { try { run(); } catch { /* a view that is gone */ } } };

// A song's artwork lives inside its own inscription (the audio too, so a song can be megabytes). The list therefore
// learns the artwork one song at a time, in the background, after the page has settled, never in parallel with
// itself. What is found is shrunk to a small square and remembered on this device, so the next visit costs nothing.
// The song that is playing hands over its artwork for free (the radio has it already).
const THUMB_KEY = 'xtrata:al-thumb:v1:';
const NONE = '-';
const THUMB_PX = 96;
const MAX_SCAN = 24 * 1024 * 1024;
export const thumbs = new Map<string, string>(); // song id -> small image url; '' = this song has no artwork of its own
const tried = new Set<string>();
const queue: string[] = [];
let pumping = false;
let kick: ReturnType<typeof setTimeout> | undefined;

const store = (key: string, value?: string) => {
  try { if (value === undefined) return window.localStorage.getItem(THUMB_KEY + key); window.localStorage.setItem(THUMB_KEY + key, value); } catch { /* storage blocked: memory only */ }
  return null;
};

/** A square, small copy of an image; the original url when the browser cannot draw it (never worse than before). */
export function shrink(url: string): Promise<string> {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext?.('2d');
      if (!ctx) return resolve(url);
      const img = new Image();
      const timer = setTimeout(() => resolve(url), 8000);
      img.onload = () => {
        clearTimeout(timer);
        try {
          const side = Math.min(img.naturalWidth, img.naturalHeight);
          if (!side) return resolve(url);
          canvas.width = canvas.height = THUMB_PX;
          ctx.fillStyle = '#143a40';
          ctx.fillRect(0, 0, THUMB_PX, THUMB_PX);
          ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, THUMB_PX, THUMB_PX);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        } catch { resolve(url); }
      };
      img.onerror = () => { clearTimeout(timer); resolve(url); };
      img.src = url;
    } catch { resolve(url); }
  });
}

/**
 * Reads a song's inscription as a stream and stops at the first image it embeds or links to. The page is scanned
 * piece by piece and what has been looked at is dropped, so a long song never sits in memory.
 * Returns the image url, '' (read to the end: no artwork) or null (could not tell: try again some other time).
 */
async function findArt(id: string): Promise<string | null> {
  const res = await fetch('/inscription/' + id, { signal: AbortSignal.timeout(60_000) });
  const type = (res.headers.get('content-type') || '').toLowerCase();
  if (!res.ok) { await res.body?.cancel(); return null; }
  if (type.startsWith('image/')) { await res.body?.cancel(); return '/inscription/' + id; }
  if (!type.includes('text/html')) { await res.body?.cancel(); return ''; }
  let buf = '';
  let seen = 0;
  const look = (final: boolean): string | null => {
    let from = 0;
    for (;;) {
      const rel = buf.slice(from).search(/<img\b/i);
      if (rel < 0) { buf = final ? '' : buf.slice(Math.max(0, buf.length - 4)); return null; } // keep a few characters: a tag may be split
      const open = from + rel;
      const close = buf.indexOf('>', open);
      if (close < 0) { buf = buf.slice(open); return null; }
      const tag = buf.slice(open, close + 1);
      const data = tag.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (data) return data[1].replace(/&amp;/g, '&');
      const linked = tag.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (linked) return '/inscription/' + linked[1];
      from = close + 1;
    }
  };
  const reader = res.body?.getReader?.();
  if (!reader) { buf = await res.text(); return look(true) ?? ''; }
  const decoder = new TextDecoder();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    seen += value.byteLength;
    buf += decoder.decode(value, { stream: true });
    const found = look(false);
    if (found) { await reader.cancel(); return found; }
    if (seen > MAX_SCAN) { await reader.cancel(); return null; }
  }
  buf += decoder.decode();
  return look(true) ?? '';
}

async function pump() {
  if (pumping) return;
  pumping = true;
  try {
    while (queue.length) {
      const id = queue.shift()!;
      if (thumbs.has(id)) continue;
      try {
        const art = await findArt(id);
        if (art === null) continue; // could not tell: leave it be for this visit
        if (!art) { thumbs.set(id, ''); store(id, NONE); notify(); continue; }
        const small = await shrink(art);
        thumbs.set(id, small);
        if (small.startsWith('data:image/jpeg')) store(id, small);
        notify();
      } catch { /* a hiccup: it is asked again on the next visit */ }
    }
  } finally { pumping = false; }
}

/** The song's own small artwork, or '' (none known yet, or none exists). Asks for it later when not known. */
export function thumb(id: string, known?: string): string {
  // `known`: what the radio found for the song it is playing ('' = it has none): no need to fetch the song for that
  if (known && !thumbs.get(id)) {
    thumbs.set(id, known);
    void shrink(known).then((small) => { if (small !== known) { thumbs.set(id, small); if (small.startsWith('data:image/jpeg')) store(id, small); notify(); } });
  } else if (known === '' && !thumbs.has(id)) thumbs.set(id, '');
  if (thumbs.has(id)) return thumbs.get(id)!;
  const kept = store(id);
  if (kept !== null && kept !== undefined) { const url = kept === NONE ? '' : kept; thumbs.set(id, url); return url; }
  if (!tried.has(id)) {
    tried.add(id);
    queue.push(id);
    if (!kick) kick = setTimeout(() => { kick = undefined; void pump(); }, 1200);
  }
  return '';
}

