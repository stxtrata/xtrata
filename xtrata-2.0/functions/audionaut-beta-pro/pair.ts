import { pairingAction } from '../lib/audionaut-device-pairing';
import { PRO_NO_STORE } from '../lib/audionaut-pro-auth';
import { devicePairingPage } from '../lib/audionaut-device-page';

export const onRequest: PagesFunction = async ({ request, env }) => {
  if (new URL(request.url).origin !== 'https://xtrata.xyz' || !env.AUDIONAUT_PAIRING_WALLET)
    return new Response('Not found', { status: 404, headers: PRO_NO_STORE });
  if (request.method === 'GET') return devicePairingPage();
  try {
    return await pairingAction(request, env);
  } catch {
    return Response.json(
      { error: 'Pairing is temporarily unavailable.' },
      { status: 503, headers: PRO_NO_STORE }
    );
  }
};
