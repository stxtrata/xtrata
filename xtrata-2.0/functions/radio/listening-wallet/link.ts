import { gate, linksFor, mainsFor, saveLink, type PppEnv } from '../../lib/radio-listening-wallet';
import { isMainnetStandardAddress } from '../../../src/lib/listening-wallet/link';
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

/**
 * GET  /radio/listening-wallet/link?main=SP…  → that wallet's links (public signatures), so a
 *      listener unlocking on another device can have the wallet frame re-verify its return address.
 * GET  /radio/listening-wallet/link?listening=SP…,SP…  → the main wallet each one is linked to
 *      (up to 100), so their likes and paid plays are credited to the listener's main wallet.
 * POST /radio/listening-wallet/link           → save a dual-signed link (same origin only).
 */
export async function onRequest({ request, env }: { request: Request; env: PppEnv }) {
  try {
    if (request.method === 'GET') {
      const listening = new URL(request.url).searchParams.get('listening');
      if (listening !== null) {
        const list = listening.split(',').filter(Boolean);
        if (!list.length || list.length > 100) return reply({ error: 'Up to 100 addresses' }, 400);
        return reply({ links: await mainsFor(env, list) });
      }
      const main = new URL(request.url).searchParams.get('main');
      if (!isMainnetStandardAddress(main)) return reply({ error: 'Mainnet wallet address required' }, 400);
      if (!gate(env, main).enabled) return reply({ links: [] });
      return reply({ links: await linksFor(env, main) });
    }
    if (request.method !== 'POST') return reply({ error: 'GET or POST required' }, 405);
    const origin = request.headers.get('origin');
    if (!origin || origin !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site') return reply({ error: 'Same origin required' }, 403);
    if (!request.headers.get('content-type')?.startsWith('application/json')) return reply({ error: 'JSON required' }, 415);
    const text = await request.text();
    if (text.length > 4000) return reply({ error: 'Too large' }, 413);
    let body: any;
    try { body = JSON.parse(text); } catch { return reply({ error: 'Invalid JSON' }, 400); }
    const g = gate(env, typeof body?.main === 'string' ? body.main : null, request);
    if (!g.enabled) return reply({ error: 'Pay-per-play is switched off right now. Listening stays free.' }, 503);
    if (!g.here) return reply({ error: 'Pay-per-play links are made on the pay-per-play radio only.' }, 403);
    if (!g.allowed) return reply({ error: 'This wallet is not in the pay-per-play canary yet.' }, 403);
    return reply({ link: await saveLink(env, body) });
  } catch (error) {
    const e = error as { status?: number; message?: string };
    if (e.status) return reply({ error: e.message }, e.status);
    if (/expired|addresses|different address/.test(e.message || '')) return reply({ error: e.message }, 400);
    console.warn('[radio:listening-wallet]', { reason: 'link-failed' });
    return reply({ error: 'Could not save the link right now. Nothing changed.' }, 500);
  }
}
