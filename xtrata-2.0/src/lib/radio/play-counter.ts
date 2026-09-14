import { credit, mergeSpans, coverage, RULE_VERSION, IDLE_MS, type Span } from './play-rules';
export type Observation = {
  sessionId: string; browserId: string; contract: string; tokenId: number;
  source: 'radio' | 'embed'; ruleVersion: number; duration: number;
  sequence: number; seconds: number; spans: Span[]; closed: boolean;
};
type Session = { event: Observation; touched: number };
const KEY = 'xtrata.radio.counter.v1';
const BROWSER = 'xtrata.radio.browser.v1';
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
function validStoredObservation(value: unknown, browserId: string): value is Observation {
  if (!value || typeof value !== 'object') return false;
  const e = value as Observation;
  return typeof e.sessionId === 'string' && UUID.test(e.sessionId) && e.browserId === browserId &&
    typeof e.contract === 'string' && /^S[PM][0-9A-Z]+\.[a-z0-9-]+$/.test(e.contract) &&
    Number.isSafeInteger(e.tokenId) && e.tokenId > 0 && e.tokenId <= 10_000_000 &&
    ['radio', 'embed'].includes(e.source) && e.ruleVersion === RULE_VERSION &&
    Number.isSafeInteger(e.sequence) && e.sequence >= 0 && e.sequence <= 100000 &&
    Number.isFinite(e.duration) && e.duration > 0 && e.duration <= 86400 &&
    Number.isFinite(e.seconds) && e.seconds >= 0 && e.seconds <= 86400 &&
    typeof e.closed === 'boolean' && Array.isArray(e.spans) && e.spans.length <= 256 &&
    e.spans.every(span => Array.isArray(span) && span.length === 2 && span.every(Number.isFinite) &&
      span[0] >= 0 && span[1] > span[0] && span[1] <= e.duration + 0.01);
}
/** A bounded, coalescing outbox: keep the start plus latest cumulative snapshot. */
export class PlayOutbox {
  pending: Observation[] = [];
  busy = false;
  failures = 0;
  nextAttempt = 0;
  constructor(private send: (event: Observation) => Promise<number>, private changed: () => void = () => {}, private rejected: (session: string) => void = () => {}) {}
  add(event: Observation) {
    const index = this.pending.findIndex(e => e.sessionId === event.sessionId && (e.sequence === 0) === (event.sequence === 0));
    if (index >= 0) this.pending[index] = structuredClone(event);
    else this.pending.push(structuredClone(event));
    while (new Set(this.pending.map(e => e.sessionId)).size > 20) {
      const oldest = this.pending[0].sessionId;
      this.pending = this.pending.filter(e => e.sessionId !== oldest);
    }
    this.changed();
  }
  async flush(now = Date.now()) {
    if (this.busy || now < this.nextAttempt || !this.pending.length) return;
    this.busy = true;
    try {
      const event = this.pending[0];
      const status = await this.send(event);
      if (status >= 200 && status < 300) {
        // A newer cumulative snapshot may have replaced this one during the request.
        this.pending = this.pending.filter(e => !(e.sessionId === event.sessionId && e.sequence === event.sequence));
        this.failures = 0; this.nextAttempt = 0;
      } else if ([400,403,410,413,415].includes(status)) {
        this.pending = this.pending.filter(e => e.sessionId !== event.sessionId);
        this.rejected(event.sessionId);
      } else throw new Error('Retry later');
    } catch {
      if (this.failures >= 6 && this.pending.length) {
        const session = this.pending[0].sessionId;
        this.pending = this.pending.filter(e => e.sessionId !== session);
        this.rejected(session); this.failures = 0;
      }
      this.nextAttempt = now + Math.min(60000, 5000 * 2 ** Math.min(this.failures++,4));
    } finally { this.busy = false; this.changed(); }
  }
}
function createPlayCounter(player: HTMLMediaElement, source: 'radio' | 'embed' = 'radio') {
  let disabled = false;
  try { disabled = localStorage.getItem('xtrata.radio.analytics.disabled') === '1' || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true; } catch { /* session-only fallback */ }
  if (disabled || !globalThis.crypto?.randomUUID) return { select: (_contract: string, _id: number) => {}, destroy: () => {} };
  let browserId = crypto.randomUUID();
  try { const savedId = localStorage.getItem(BROWSER); if (savedId && UUID.test(savedId)) browserId = savedId as typeof browserId; localStorage.setItem(BROWSER,browserId); } catch { /* ephemeral identity */ }
  let current: Session | null = null;
  let selected: { contract: string; tokenId: number } | null = null;
  let previous = player.currentTime; let clock = performance.now(); let active = false;
  let lastSnapshot = Date.now();
  const persist = () => {
    try { sessionStorage.setItem(KEY,JSON.stringify({ at: Date.now(), current, pending: outbox.pending })); } catch { /* never interrupt music */ }
  };
  const outbox = new PlayOutbox(async event => {
    const response = await fetch('/radio/plays', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(event), keepalive: true, signal: AbortSignal.timeout(5000) });
    return response.status;
  }, persist, id => { if (current?.event.sessionId === id) { current = null; resetBaseline(); } });
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    if (saved && Number.isFinite(saved.at) && saved.at <= Date.now() && Date.now()-saved.at < IDLE_MS && Array.isArray(saved.pending) && saved.pending.length <= 40) {
      outbox.pending = saved.pending.filter((e: unknown) => validStoredObservation(e, browserId));
      if (saved.current && validStoredObservation(saved.current.event, browserId) &&
          !saved.current.event.closed && Number.isFinite(saved.current.touched) &&
          saved.current.touched <= Date.now() && Date.now()-saved.current.touched < IDLE_MS) current = saved.current;
    }
  } catch { /* corrupt storage must not break the player */ }
  function begin() {
    if (!selected || !Number.isFinite(player.duration) || player.duration <= 0 || player.duration > 86400) return;
    if (current && Date.now()-current.touched > IDLE_MS) { snapshot(true); current = null; }
    if (!current) {
      current = { touched: Date.now(), event: { ...selected, sessionId: crypto.randomUUID(), browserId, source, ruleVersion: RULE_VERSION, duration: player.duration, sequence: 0, seconds: 0, spans: [], closed: false } };
      outbox.add(current.event);
    }
  }
  function sample() {
    const now = performance.now(); const position = player.currentTime;
    if (active) begin();
    if (current) {
      const seconds = credit(previous,position,(now-clock)/1000,player.playbackRate,active);
      if (seconds > 0) {
        current.event.seconds += seconds;
        const spans = mergeSpans([...current.event.spans,[previous,Math.min(position,current.event.duration)] as Span]);
        // Preserve prior coverage when pathological seeking exceeds the size limit.
        if (spans.length <= 256 && coverage(spans) <= current.event.seconds * 4 + 0.5) current.event.spans = spans;
        current.touched = Date.now();
      }
    }
    previous = position; clock = now;
  }
  function snapshot(closed = false) {
    if (!current) return;
    current.event.sequence++;
    current.event.closed = closed;
    outbox.add(current.event);
    lastSnapshot = Date.now();
    if (closed) current = null;
    persist();
  }
  function resetBaseline() { previous = player.currentTime; clock = performance.now(); }
  function playable() { return !player.paused && !player.ended && !player.seeking && !player.muted && player.volume > 0 && player.readyState >= 3; }
  const handlers: Record<string, () => void> = {
    playing: () => { begin(); resetBaseline(); active = playable(); },
    timeupdate: () => {
      // Native looping may not emit ended. A backwards wrap opens a new session.
      if (player.loop && !player.seeking && current && previous > current.event.duration - 2 && player.currentTime < 2) { snapshot(true); begin(); resetBaseline(); }
      sample(); active = playable();
    },
    pause: () => { sample(); active = false; snapshot(); },
    waiting: () => { sample(); active = false; },
    stalled: () => { sample(); active = false; },
    seeking: () => { active = false; resetBaseline(); },
    seeked: () => { resetBaseline(); active = playable(); },
    volumechange: () => { active = false; resetBaseline(); active = playable(); },
    ratechange: () => { resetBaseline(); active = playable(); },
    ended: () => { sample(); active = false; snapshot(true); },
    emptied: () => { active = false; resetBaseline(); },
    error: () => { active = false; snapshot(true); }
  };
  for (const [event, handler] of Object.entries(handlers)) player.addEventListener(event,handler);
  const timer = setInterval(() => {
    sample();
    if (current && Date.now()-current.touched > IDLE_MS) snapshot(true);
    else if (current && Date.now()-lastSnapshot >= 10000 && active) snapshot();
    persist(); void outbox.flush();
  },1000);
  const hide = () => { sample(); snapshot(); persist(); void outbox.flush(); };
  window.addEventListener('pagehide',hide);
  return {
    select(contract: string, tokenId: number) {
      if (current && (current.event.contract !== contract || current.event.tokenId !== tokenId)) { sample(); snapshot(true); }
      selected = { contract, tokenId }; active = false; resetBaseline();
    },
    destroy() { hide(); clearInterval(timer); for (const [event,handler] of Object.entries(handlers)) player.removeEventListener(event,handler); window.removeEventListener('pagehide',hide); }
  };
}

/** Analytics initialization failure must never prevent radio initialization. */
export function attachPlayCounter(player: HTMLMediaElement, source: 'radio' | 'embed' = 'radio') {
  try { return createPlayCounter(player, source); }
  catch { return { select: (_contract: string, _id: number) => {}, destroy: () => {} }; }
}
