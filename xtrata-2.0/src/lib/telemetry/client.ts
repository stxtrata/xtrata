/**
 * Client telemetry core — session, journeys/attempts, breadcrumbs, and a
 * batched, beacon-delivered queue. Public entry point is `telemetry` in
 * ./index. Everything here fails OPEN: a telemetry problem must never surface
 * to the person using the site.
 */
import type { Flow, JourneyHandle, TelemetryInput, WireEvent } from './types';
import { fingerprint } from './fingerprint';
import { errorMessage, errorStack } from './classify';

// Injected at build time (vite.config.ts define). typeof-guarded so tests and
// non-build contexts don't throw.
declare const __XTRATA_APP_VERSION__: string;
const APP_VERSION = typeof __XTRATA_APP_VERSION__ !== 'undefined' ? __XTRATA_APP_VERSION__ : 'dev';

const ENDPOINT = '/log';
const FLUSH_INTERVAL_MS = 5000;
const BATCH_SIZE = 20;
const BREADCRUMB_MAX = 20;
const SESSION_KEY = 'xt_tel_sid';

function randomId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  return `xt-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

// ---- session (one per tab, survives reloads) ----
let memSession: string | null = null;
export function sessionId(): string {
  try {
    if (typeof sessionStorage !== 'undefined') {
      let id = sessionStorage.getItem(SESSION_KEY);
      if (!id) {
        id = randomId();
        sessionStorage.setItem(SESSION_KEY, id);
      }
      return id;
    }
  } catch {
    /* private mode / storage disabled */
  }
  if (!memSession) memSession = randomId();
  return memSession;
}

// ---- wallet (address is hashed server-side and never persisted raw) ----
let wallet: { address: string | null; kind: string | null } = {
  address: null,
  kind: null
};
let network: string | null = null;
export function setWallet(address: string | null, kind?: string): void {
  if (!address) {
    wallet = { address: null, kind: kind ?? wallet.kind };
    return;
  }
  const a = address.trim();
  wallet = { address: a, kind: kind ?? wallet.kind };
}
export function setNetwork(value: string | null | undefined): void {
  network = typeof value === 'string' && value.length > 0 ? value : null;
}

// ---- breadcrumbs (in-memory ring; only ride along with error events) ----
const crumbs: Array<{ t: number; label: string; data?: unknown }> = [];
export function breadcrumb(label: string, data?: unknown): void {
  crumbs.push({ t: Date.now(), label, data });
  if (crumbs.length > BREADCRUMB_MAX) crumbs.shift();
}

// ---- journeys (one goal attempt-chain, reused across retries) ----
export class Journey implements JourneyHandle {
  readonly id: string = randomId();
  private n = 0;
  constructor(
    public readonly flow: Flow,
    public readonly target?: string
  ) {}
  attempt(): number {
    this.n += 1;
    return this.n;
  }
}
export function startJourney(flow: Flow, target?: string): Journey {
  return new Journey(flow, target);
}

// ---- queue + delivery ----
const queue: WireEvent[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
let enabled = false;

// Telemetry stays INERT until the app turns it on (installGlobalTelemetry in
// main.tsx). This keeps unit/component tests free of network I/O, and lets
// events emitted very early queue until delivery is ready.
export function setTelemetryEnabled(on: boolean): void {
  enabled = on;
  if (on) flush('enabled');
}

function scheduleFlush(): void {
  if (timer != null) return;
  timer = setTimeout(() => {
    timer = null;
    flush('timer');
  }, FLUSH_INTERVAL_MS);
  // Never let a pending flush keep a Node process (or test runner) alive.
  const t = timer as unknown as { unref?: () => void };
  if (t && typeof t.unref === 'function') t.unref();
}

export function flush(reason = 'manual'): void {
  if (timer != null) {
    clearTimeout(timer);
    timer = null;
  }
  if (!enabled) return;
  if (queue.length === 0) return;
  const batch = queue.splice(0, queue.length);
  const body = JSON.stringify({ reason, events: batch });
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const ok = navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
      if (ok) return;
    }
    if (typeof fetch === 'function') {
      void fetch(ENDPOINT, {
        method: 'POST',
        body,
        keepalive: true,
        headers: { 'Content-Type': 'application/json' }
      }).catch(() => {});
    }
  } catch {
    /* fail open */
  }
}

function enqueue(ev: WireEvent): void {
  queue.push(ev);
  if (queue.length > 200) queue.shift();
  if (!enabled) return;
  if (ev.outcome === 'error' || ev.severity === 'fatal' || ev.severity === 'error') {
    flush('error');
    return;
  }
  if (queue.length >= BATCH_SIZE) {
    flush('batch');
    return;
  }
  scheduleFlush();
}

// ---- the one public event fn ----
export function event(input: TelemetryInput): void {
  try {
    const journey = input.journey;
    const flow = (input.flow ?? journey?.flow ?? 'app') as string;
    const isError = input.outcome === 'error';
    const message = input.error != null ? errorMessage(input.error) : undefined;
    const stack = input.error != null ? errorStack(input.error) : undefined;
    const fp = isError ? fingerprint(flow, input.step, input.errorCode, message ?? '') : undefined;

    const ctx: Record<string, unknown> = { ...(input.context ?? {}) };
    if (isError && crumbs.length) ctx.breadcrumbs = crumbs.slice(-BREADCRUMB_MAX);

    const wire: WireEvent = {
      eventId: randomId(),
      ts: Date.now(),
      sessionId: sessionId(),
      journeyId: input.journeyId ?? journey?.id ?? null,
      attempt: input.attempt ?? 1,
      flow,
      step: input.step ?? null,
      outcome: input.outcome,
      severity: input.severity ?? (isError ? 'error' : 'info'),
      target: input.target ?? journey?.target ?? null,
      durationMs: input.durationMs ?? null,
      errorCode: input.errorCode ?? null,
      errorFingerprint: fp ?? null,
      errorMessage: message ?? null,
      errorStack: stack ?? null,
      appVersion: APP_VERSION,
      route: input.route ?? (typeof location !== 'undefined' ? location.pathname : ''),
      walletAddress: wallet.address,
      walletKind: wallet.kind,
      network,
      context: Object.keys(ctx).length ? ctx : undefined
    };
    enqueue(wire);
  } catch {
    /* telemetry must never throw into app code */
  }
}
