// Temporary lock on inscriptions that carry page markup (HTML, styles, SVG, scripts, XML).
//
// WHY THIS EXISTS
// Since late October 2026 the Hiro mainnet API gateway refuses any `POST /v2/transactions`
// whose body contains page markup (`<script`, `<!doctype html>`, `<style`, `<meta` ...) with an
// HTTP 403. A song player, a style sheet or an HTML receipt is exactly that kind of body, so a
// job for one of them can pay its opening fee and then never get a single chunk onto the
// chain. The customer waits, then gets a refund minus the non-refundable protocol fee.
// Until the broadcast route is fixed there is no way for those jobs to finish, so the honest
// thing is to stop taking them *before* any money moves.
//
// HOW TO UNLOCK
// Set `locked: false` below (and bump AGENT_BUILD + the ?v= on the pages) once a markup-bearing
// broadcast gets through again. For testing against the live chain only, a page can set
// `window.XAO_CONFIG.inscribeLock = false` before the agent loads; nothing in the product does.
//
// WHAT IT DOES NOT TOUCH
// Refund, Cancel and resume of jobs that already exist. Those must keep working.

export const INSCRIBE_LOCK = {
  locked: true,
  since: '2026-10-29',
  title: 'Song and web page inscribing is paused',
  message:
    'Inscribing songs, players and other HTML or style pages is paused for now. '
    + 'The network gateway we send transactions through has started rejecting this kind of file, '
    + 'so a job would start, fail part-way and waste your fees. '
    + 'Nothing has been charged — you can still browse, play and manage what you already own. '
    + 'This is being fixed and inscribing will reopen as soon as it is. '
    + 'A job you already started will still refund on its own.'
} as const;

const MARKUP_MIME = /^(text\/(html|css|xml|javascript)|application\/(xhtml\+xml|xml|javascript|ecmascript)|image\/svg\+xml)(\s*;.*)?$/i;

/** True for content types whose bytes are page markup / script and so trip the gateway rule. */
export function isMarkupMime(mime: unknown): boolean {
  return MARKUP_MIME.test(String(mime || '').trim());
}

export class InscribeLockedError extends Error {
  code = 'INSCRIBE_LOCKED' as const;
  constructor(detail?: string) {
    super(`${INSCRIBE_LOCK.title}. ${detail || INSCRIBE_LOCK.message}`);
    this.name = 'InscribeLockedError';
  }
}

function lockOn(): boolean {
  try {
    const cfg = (typeof window !== 'undefined' ? (window as any).XAO_CONFIG : null) || {};
    if (cfg.inscribeLock === false) return false;
  } catch { /* fall through to the default */ }
  return INSCRIBE_LOCK.locked;
}

export function inscribeLockActive(): boolean { return lockOn(); }

/**
 * Throws InscribeLockedError for a job that cannot finish while the lock is on. Called at the
 * very top of job creation, before any deposit address exists, so no money can have moved.
 * Accepts the same options object createJob / createBatchJob receive.
 */
export function assertInscribeAllowed(opts: any): void {
  if (!lockOn()) return;
  const o = opts || {};
  const items: any[] = Array.isArray(o.items) ? o.items : [];
  const mimes = items.length ? items.map((i) => i?.mime) : [o.mime];

  // The music and Suno pages always build an HTML player, whatever type the File reports.
  if (o.origin === 'music' || o.sunoPlayer) throw new InscribeLockedError();
  if (mimes.some(isMarkupMime)) throw new InscribeLockedError();
  // The optional on-chain receipt is an HTML page too.
  if (o.receipt === true) {
    throw new InscribeLockedError(
      'The optional on-chain receipt is an HTML page, so it is paused too. Untick "Also inscribe an on-chain receipt" and try again — a readable receipt is still saved for you. '
      + 'Nothing has been charged.'
    );
  }
}
