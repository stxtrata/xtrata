import type { Flow } from './types';

export function errorMessage(error: unknown): string {
  if (error == null) return '';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  const maybe = error as { message?: unknown };
  if (typeof maybe.message === 'string') return maybe.message;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export function errorStack(error: unknown): string | undefined {
  return error instanceof Error ? (error.stack ?? undefined) : undefined;
}

const safeDiagnosticValue = (value: unknown): string | number | boolean | undefined => {
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  if (typeof value === 'string' && value.length > 0) return value.slice(0, 300);
  return undefined;
};

/**
 * Extract a small allowlist of provider diagnostics. Arbitrary wallet `data`
 * is deliberately not copied: provider payloads are not a stable API and may
 * contain transaction material or other values that do not belong in logs.
 */
export function errorDiagnosticContext(error: unknown): Record<string, unknown> | undefined {
  if (!error || typeof error !== 'object') return undefined;
  const candidate = error as Record<string, unknown>;
  const details: Record<string, unknown> = {};
  for (const key of ['code', 'stage', 'method', 'providerId', 'name']) {
    const value = safeDiagnosticValue(candidate[key]);
    if (value !== undefined) details[key] = value;
  }
  const data = candidate.data;
  if (data && typeof data === 'object') {
    const safeData: Record<string, unknown> = {};
    for (const key of ['code', 'message', 'reason']) {
      const value = safeDiagnosticValue((data as Record<string, unknown>)[key]);
      if (value !== undefined) safeData[key] = value;
    }
    if (Object.keys(safeData).length > 0) details.data = safeData;
  } else {
    const safeData = safeDiagnosticValue(data);
    if (safeData !== undefined) details.data = safeData;
  }
  return Object.keys(details).length > 0 ? details : undefined;
}

/**
 * Map an error to a stable, human-meaningful code. Unknown errors fall through
 * to UNCAUGHT but are still fingerprinted by their (normalised) message.
 */
export function classify(error: unknown, _flow?: Flow): string {
  const name = (error as { name?: string } | null)?.name ?? '';
  const code = (error as { code?: unknown } | null)?.code;
  const msg = errorMessage(error).toLowerCase();

  if (code === -32603 || msg.trim() === 'internal error.') return 'WALLET_RPC_INTERNAL';
  if (name === 'ReadOnlyBackoffError' || (msg.includes('read-only') && msg.includes('backoff'))) {
    return 'READ_ONLY_BACKOFF';
  }
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return 'NETWORK_OFFLINE';
  if (
    msg.includes('user rejected') ||
    msg.includes('user denied') ||
    msg.includes('user canceled') ||
    msg.includes('user cancelled') ||
    msg.includes('rejected the request') ||
    msg.includes('request rejected')
  ) {
    return 'WALLET_REJECTED';
  }
  if (
    msg.includes('no wallet') ||
    msg.includes('provider not found') ||
    msg.includes('not installed')
  ) {
    return 'WALLET_NOT_FOUND';
  }
  if (msg.includes('locked')) return 'WALLET_LOCKED';
  if (msg.includes('session') && msg.includes('expire')) return 'SESSION_EXPIRED';
  if (msg.includes('insufficient') && msg.includes('fee')) return 'INSUFFICIENT_FEE';
  if (msg.includes('insufficient') || msg.includes('not enough')) return 'INSUFFICIENT_FUNDS';
  if (msg.includes('nonce')) return 'NONCE_MISMATCH';
  if (
    msg.includes('postcondition') ||
    msg.includes('post-condition') ||
    msg.includes('post condition')
  ) {
    return 'POST_CONDITION_FAILED';
  }
  if (msg.includes('abort') || msg.includes('runtime error')) return 'CONTRACT_ABORT';
  if (msg.includes('429') || msg.includes('rate limit') || msg.includes('too many requests')) {
    return 'HIRO_RATE_LIMIT';
  }
  if (msg.includes('broadcast')) return 'BROADCAST_FAILED';
  if (msg.includes('timeout') || msg.includes('timed out')) return 'CONFIRM_TIMEOUT';
  if (msg.includes('upload')) return 'UPLOAD_FAILED';
  return 'UNCAUGHT';
}
