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

/**
 * Map an error to a stable, human-meaningful code. Unknown errors fall through
 * to UNCAUGHT but are still fingerprinted by their (normalised) message.
 */
export function classify(error: unknown, _flow?: Flow): string {
  const name = (error as { name?: string } | null)?.name ?? '';
  const msg = errorMessage(error).toLowerCase();

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
