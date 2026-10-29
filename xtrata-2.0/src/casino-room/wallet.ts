/**
 * Wallet connect for the casino room (P1 of docs/plans/CASINO-PRESENCE-PLAN.md).
 *
 * The same way the casino pages connect (public/casino/index.html): providers are looked for on the top same-origin window
 * (WALLET-PLAYBOOK, rule 3), Leather answers getAddresses, Xverse is disconnected first and then wallet_connect asks for the
 * account, and an address of either network is accepted (the casino runs on testnet; the app's standard connect adapter only
 * takes mainnet accounts, so it cannot be used here). Signing is NOT done here: it goes through the app's own
 * requestStructuredSignature, which finds the wallet again from the provider id stored by `rememberProvider`.
 */
import { setSelectedProviderId } from '@stacks/connect-ui';

export type WalletKind = 'leather' | 'xverse';
export type LinkedWallet = { kind: WalletKind; address: string; network: 'mainnet' | 'testnet'; via: string };

const usable = (p: any) => !!p && typeof p.request === 'function';
const hostWin = (): any => {
  try { const t = window.top; if (t && t !== window.self && t.location.origin === window.location.origin) return t; } catch { /* cross-origin parent */ }
  return window;
};
const wins = (): any[] => { const h = hostWin(); return h === window ? [window] : [h, window]; };
const find = (get: (w: any) => any) => { for (const w of wins()) { const v = get(w); if (v) return v; } return null; };

export const providerFor = (kind: WalletKind): { rpc: any } | null => {
  if (kind === 'leather') {
    const le = find((w) => (usable(w.LeatherProvider) ? w.LeatherProvider : null));
    return le ? { rpc: le } : null;
  }
  const X = find((w) => { const x = w.XverseProviders || w.xverseProviders; return x && (usable(x.BitcoinProvider) || usable(x.StacksProvider)) ? x : null; });
  if (!X) return null;
  return { rpc: usable(X.BitcoinProvider) ? X.BitcoinProvider : X.StacksProvider };
};

const detect = (kind: WalletKind, ms: number) => new Promise<ReturnType<typeof providerFor>>((resolve) => {
  const started = Date.now();
  (function look() {
    const p = providerFor(kind);
    if (p || Date.now() - started >= ms) resolve(p); else window.setTimeout(look, 150);
  })();
});

const codeOf = (x: any) => x?.code ?? x?.error?.code;
const msgOf = (x: any) => String(x?.message ?? x?.error?.message ?? x ?? 'unknown error');
const cancelled = (e: any) => [4001, -31001].includes(Number(codeOf(e))) || /cancel|denied|reject|declin|closed/i.test(msgOf(e));
const unsupported = (e: any) => Number(codeOf(e)) === -32601 || /not supported|method not found|unsupported|not implemented|legacy method/i.test(msgOf(e));

/** Wallets answer as {result}, {error}, {status}, or throw. Everything comes out of here as a result or an Error. */
const call = async (p: any, method: string, params?: unknown) => {
  const r = params === undefined ? await p.request(method) : await p.request(method, params);
  if (r && typeof r === 'object') {
    if (r.error) throw Object.assign(new Error(msgOf(r.error)), { code: codeOf(r.error) });
    if (r.status === 'error') throw Object.assign(new Error(msgOf(r.error || r)), { code: codeOf(r.error || r) });
    if ('result' in r) return r.result;
  }
  return r;
};

/** Xverse mobile can reject with a toast and leave the request pending for ever: stop waiting after 90 s. */
const watchdog = <T,>(pr: Promise<T>) => new Promise<T>((resolve, reject) => {
  const t = window.setTimeout(() => reject(new Error('The wallet did not answer. Check its window.')), 90_000);
  pr.then((v) => { window.clearTimeout(t); resolve(v); }, (e) => { window.clearTimeout(t); reject(e); });
});

export const addressesIn = (res: unknown): string[] => (JSON.stringify(res) || '').match(/S[PT][0-9A-HJKMNP-TV-Z]{38,39}/g) || [];

/** What each wallet method answered, newest connect only (for a bug report). */
export const connectTrail: string[] = [];

export async function connectWallet(kind: WalletKind): Promise<LinkedWallet> {
  const pv = await detect(kind, 1500);
  if (!pv) throw new Error(`${kind === 'leather' ? 'Leather' : 'Xverse'} was not found in this browser.`);
  connectTrail.length = 0;
  let plans: string[];
  if (kind === 'xverse') {
    try { await call(pv.rpc, 'wallet_disconnect'); connectTrail.push('wallet_disconnect: ok'); } catch (e) { connectTrail.push('wallet_disconnect: ' + msgOf(e).slice(0, 80)); }
    plans = ['wallet_connect', 'wallet_getAccount'];
  } else {
    plans = ['getAddresses', 'stx_getAccounts', 'stx_getAddresses', 'stx_requestAccounts'];
  }
  let lastError: unknown = null;
  for (const method of plans) {
    try {
      const res = await (kind === 'xverse' ? watchdog(call(pv.rpc, method)) : call(pv.rpc, method));
      const found = addressesIn(res);
      if (found.length) {
        const address = found[0] as string;
        connectTrail.push(`${method}: ok`);
        return { kind, address, network: address.startsWith('SP') ? 'mainnet' : 'testnet', via: method };
      }
      connectTrail.push(`${method}: answered but no Stacks address in it`);
    } catch (e) {
      if (cancelled(e)) { connectTrail.push(`${method}: cancelled`); throw new Error('Connection cancelled.'); }
      connectTrail.push(`${method}: ${unsupported(e) ? 'not supported' : msgOf(e).slice(0, 80)}`);
      if (!unsupported(e)) lastError = e;
    }
  }
  throw new Error(lastError ? msgOf(lastError) : 'The wallet did not share a Stacks address.');
}

/** The ids the app's standard chooser stores; requestStructuredSignature uses them to reach the same wallet again. */
export const rememberProvider = (kind: WalletKind) =>
  setSelectedProviderId(kind === 'leather' ? 'LeatherProvider' : 'XverseProviders.BitcoinProvider');

export const walletMessage = (e: unknown) => (e instanceof Error ? e.message : String(e));
