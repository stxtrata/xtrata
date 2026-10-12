import { gate, linksFor, saveLink, type PppEnv } from '../../lib/radio-listening-wallet';
import { isMainnetStandardAddress } from '../../../src/lib/listening-wallet/link';
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

/**
 * GET  /radio/listening-wallet/link?main=SP…  → that wallet's links (public signatures), so a
 *      listener unlocking on another device can have the wallet frame re-verify its return address.
 * POST /radio/listening-wallet/link           → save a dual-signed link (same origin only).
 */
export async function onRequest({ request, env }: { request: Request; env: PppEnv }) {
  try {
    if (request.method === 'GET') {
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
    const g = gate(env, typeof body?.main === 'string' ? body.main : null);
    if (!g.enabled) return reply({ error: 'Pay-per-play is switched off right now. Listening stays free.' }, 503);
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
