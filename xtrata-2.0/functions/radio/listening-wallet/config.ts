import { gate, type PppEnv } from '../../lib/radio-listening-wallet';
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
/** GET /radio/listening-wallet/config?main=SP… → is pay-per-play on, and is this wallet in the canary? */
export async function onRequest({ request, env }: { request: Request; env: PppEnv }) {
  if (request.method !== 'GET') return reply({ error: 'GET required' }, 405);
  return reply(gate(env, new URL(request.url).searchParams.get('main'), request));
}
