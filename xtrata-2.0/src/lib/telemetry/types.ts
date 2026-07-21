export type Flow =
  | 'app'
  | 'wallet_connect'
  | 'mint'
  | 'drop_claim'
  | 'market_buy'
  | 'collection_publish'
  // Allow any other string while keeping autocomplete for the known flows.
  | (string & {});

export type Outcome = 'start' | 'success' | 'error' | 'abandon' | 'info';
export type Severity = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/** Structural handle so callers can pass a Journey without a circular import. */
export interface JourneyHandle {
  readonly id: string;
  readonly flow: Flow;
  readonly target?: string;
  attempt(): number;
}

export interface TelemetryInput {
  flow?: Flow;
  outcome: Outcome;
  step?: string;
  severity?: Severity;
  target?: string;
  attempt?: number;
  journey?: JourneyHandle;
  journeyId?: string;
  durationMs?: number;
  errorCode?: string;
  /** Error | string | unknown — message + stack are extracted and scrubbed. */
  error?: unknown;
  route?: string;
  context?: Record<string, unknown>;
}

/** The exact shape sent to POST /log. */
export interface WireEvent {
  eventId: string;
  ts: number;
  sessionId: string;
  journeyId: string | null;
  attempt: number;
  flow: string;
  step: string | null;
  outcome: string;
  severity: string;
  target: string | null;
  durationMs: number | null;
  errorCode: string | null;
  errorFingerprint: string | null;
  errorMessage: string | null;
  errorStack: string | null;
  appVersion: string;
  route: string;
  walletAddress: string | null;
  walletKind: string | null;
  network: string | null;
  context?: Record<string, unknown>;
}
