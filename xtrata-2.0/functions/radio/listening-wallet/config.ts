import { gate } from '../../lib/radio-listening-wallet';
import { giftsConfig, type GiftEnv } from '../../lib/radio-gifts';
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
/** GET /radio/listening-wallet/config?main=SP… → is pay-per-play on, is this wallet in the canary, and are gifts on? */
export async function onRequest({ request, env }: { request: Request; env: GiftEnv }) {
  if (request.method !== 'GET') return reply({ error: 'GET required' }, 405);
  const main = new URL(request.url).searchParams.get('main');
  return reply({ ...gate(env, main, request), gifts: giftsConfig(env, main, request) });
}
