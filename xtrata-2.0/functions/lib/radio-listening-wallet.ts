/**
 * Pay-per-play canary gate and listening-wallet links. Public data only.
 *
 * Gate (Cloudflare Pages variables):
 *   RADIO_PPP_ENABLED = "1"          global kill switch; anything else turns pay-per-play off
 *   RADIO_PPP_ALLOWLIST = "SP…,SP…"  main wallets allowed during the canary; "all" opens it
 *   RADIO_PPP_PASSKEY_ONLY = "1"     optional: listeners without a Stacks wallet may use a passkey
 *                                    listening wallet alone (default off; returns go to the funder)
 *   RADIO_LISTENING_WALLET_ORIGIN    exact wallet origin, e.g. https://wallet.xtrata.xyz
 *   RADIO_PPP_HOST                   the only host pay-per-play runs on, e.g. radio.xtrata.xyz
 *                                    (functions/lib/radio-host.ts explains why it is not xtrata.xyz)
 * Turning the switch off stops NEW sessions and payments on the next check; it cannot
 * recall a transaction a listener's browser already broadcast.
 */
import { queryAll, run, type Env } from './db';
import { isRadioHost, radioHost, type RadioHostEnv } from './radio-host';
import { isMainnetStandardAddress, validateLinkRequest, verifyLinkSignature, type LinkRequest } from '../../src/lib/listening-wallet/link';
import { DEFAULT_PLAY_FEE, DEFAULT_RETURN_FEE, MAX_SESSION_PLAYS } from '../../src/lib/listening-wallet/policy';

export type PppEnv = RadioHostEnv & { RADIO_PPP_ENABLED?: string; RADIO_PPP_ALLOWLIST?: string; RADIO_PPP_PASSKEY_ONLY?: string; RADIO_LISTENING_WALLET_ORIGIN?: string };

export const MAX_LINKS_PER_MAIN = 5;
export const MAX_LINKS_PER_HOUR = 500;

export function walletOrigin(env: PppEnv): string | null {
  const o = typeof env.RADIO_LISTENING_WALLET_ORIGIN === 'string' ? env.RADIO_LISTENING_WALLET_ORIGIN.trim() : '';
  return /^https:\/\/[a-z0-9.-]+$/.test(o) ? o : null;
}

export function gate(env: PppEnv, main: string | null, request?: Request) {
  const origin = walletOrigin(env);
  const host = radioHost(env);
  const enabled = env.RADIO_PPP_ENABLED === '1' && origin !== null && host !== null;
  // Pay-per-play only runs on the radio host; elsewhere the panel just points there.
  const here = enabled && !!request && isRadioHost(request, env);
  const list = String(env.RADIO_PPP_ALLOWLIST || '').split(/[\s,]+/).filter(Boolean);
  const allowed = enabled && !!main && isMainnetStandardAddress(main) && (list.includes('all') || list.includes(main));
  return {
    enabled,
    allowed,
    here,
    radioUrl: host ? `https://${host}/radio.html` : null,
    walletOrigin: here ? origin : null,
    canary: !list.includes('all'),
    // Passkey-only listeners have no main wallet. Default off; "1" lets anyone on the radio host
    // use a listening wallet alone. Nothing about it is stored server-side, so this only gates the UI.
    passkeyOnly: here && env.RADIO_PPP_PASSKEY_ONLY === '1',
    limits: {
      playFee: DEFAULT_PLAY_FEE.toString(),
      returnFee: DEFAULT_RETURN_FEE.toString(),
      maxSessionPlays: MAX_SESSION_PLAYS,
      // Sessions also end when the page closes; this only bounds a tab left open for days.
      sessionHours: 168
    }
  };
}

export interface LinkSubmission extends LinkRequest {
  mainSignature: string;
  listeningSignature: string;
}

export async function saveLink(env: PppEnv, body: LinkSubmission, now = Date.now()) {
  const link = validateLinkRequest({ main: body?.main, listening: body?.listening, issued: body?.issued }, now);
  if (!verifyLinkSignature(link, body.mainSignature, link.main)) throw Object.assign(new Error('Main wallet signature is not valid for this link.'), { status: 400 });
  if (!verifyLinkSignature(link, body.listeningSignature, link.listening)) throw Object.assign(new Error('Listening wallet signature is not valid for this link.'), { status: 400 });
  // Coarse abuse guard for when the allowlist is opened to everyone: keys are free to generate.
  const recent = (await queryAll(env, 'SELECT COUNT(*) AS n FROM radio_listening_wallets WHERE updated_at>?', [now - 3600_000])).results as { n: number }[];
  if ((recent[0]?.n ?? 0) >= MAX_LINKS_PER_HOUR) throw Object.assign(new Error('Too many new links right now. Try again later.'), { status: 429 });
  // Both sides signed: re-linking a listening wallet to another main wallet is the owner's choice.
  // The WHERE makes "newer wins" atomic, so a slow older request cannot overwrite a newer link.
  const result = await run(env, `INSERT INTO radio_listening_wallets(listening,main,issued,main_signature,listening_signature,created_at,updated_at)
    VALUES(?,?,?,?,?,?,?)
    ON CONFLICT(listening) DO UPDATE SET main=excluded.main, issued=excluded.issued, main_signature=excluded.main_signature,
      listening_signature=excluded.listening_signature, updated_at=excluded.updated_at
    WHERE excluded.issued > radio_listening_wallets.issued`,
    [link.listening, link.main, link.issued, body.mainSignature, body.listeningSignature, now, now]) as { meta?: { changes?: number }; changes?: number };
  const changes = result?.meta?.changes ?? result?.changes ?? 1;
  if (!changes) throw Object.assign(new Error('A newer link already exists for this listening wallet.'), { status: 409 });
  // Keep the newest few per main wallet; an old device's link simply drops off.
  await run(env, `DELETE FROM radio_listening_wallets WHERE main=? AND listening NOT IN
    (SELECT listening FROM radio_listening_wallets WHERE main=? ORDER BY issued DESC LIMIT ?)`, [link.main, link.main, MAX_LINKS_PER_MAIN]);
  return { main: link.main, listening: link.listening, issued: link.issued };
}

/**
 * The main wallet each listening wallet is linked to (dual-signed, verified when saved), so its
 * likes and paid plays can be credited to the listener's main wallet. Up to 100 per call.
 */
export async function mainsFor(env: PppEnv, listening: string[]) {
  const list = [...new Set(listening)].filter(isMainnetStandardAddress).slice(0, 100);
  if (!list.length) return [];
  const rows = (await queryAll(env, `SELECT listening, main FROM radio_listening_wallets WHERE listening IN (${list.map(() => '?').join(',')})`, list)).results as { listening: string; main: string }[];
  return rows.map((r) => ({ listening: r.listening, main: r.main }));
}

export async function linksFor(env: PppEnv, main: string) {
  const rows = (await queryAll(env, 'SELECT listening, issued, main_signature FROM radio_listening_wallets WHERE main=? ORDER BY issued DESC LIMIT ?', [main, MAX_LINKS_PER_MAIN])).results as { listening: string; issued: number; main_signature: string }[];
  return rows.map((r) => ({ listening: r.listening, issued: r.issued, mainSignature: r.main_signature }));
}
