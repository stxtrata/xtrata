/**
 * Telemetry seam for the copied wallet layer.
 *
 * The v15.1 app wires `connect.ts` into a batched, beacon-delivered telemetry
 * pipeline. This app has no logging endpoint, so the same call sites are kept
 * (so the wallet file stays a near-verbatim copy and stays diffable against
 * its source) but resolve to a local, no-network implementation: journeys are
 * ids, events go to `console.debug` only when explicitly enabled.
 */

export type Outcome = 'start' | 'success' | 'error' | 'abandon' | 'info';

export interface JourneyHandle {
  readonly id: string;
  readonly flow: string;
}

export interface TelemetryInput {
  flow?: string;
  journey?: JourneyHandle;
  step?: string;
  outcome: Outcome;
  errorCode?: string;
  error?: unknown;
  [key: string]: unknown;
}

let enabled = false;
export const setTelemetryEnabled = (value: boolean): void => {
  enabled = value;
};

const randomId = (): string => {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  return `xt-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
};

export const startJourney = (flow: string): JourneyHandle => ({ id: randomId(), flow });

export const event = (input: TelemetryInput): void => {
  if (!enabled) return;
  // eslint-disable-next-line no-console
  console.debug('[telemetry]', input.journey?.flow ?? input.flow, input.step, input.outcome);
};

export const setWallet = (_address: string | null, _kind?: string): void => {
  /* no-op */
};

export const setNetwork = (_network: string | null | undefined): void => {
  /* no-op */
};

/** Coarse error classification, mirroring the shape the original expects. */
export const classify = (error: unknown, _flow: string): string => {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    if (typeof code === 'string' || typeof code === 'number') return `code:${String(code)}`;
  }
  if (error instanceof Error) return error.name || 'Error';
  return 'unknown';
};
