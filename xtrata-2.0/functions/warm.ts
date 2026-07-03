// /warm — pre-warms the R2 runtime-content cache so big inscriptions (films,
// long audio) are instantly streamable the first time anyone plays them.
//
//   /warm?ids=1065,1101      warm specific ids (max 5 per call)
//   /warm?auto=2             warm N random ids from the newest 200 (crowd-warming:
//                            the radio pings this from every visitor's browser, so
//                            the CHAIN-side reconstruction cost is paid once, in the
//                            background, long before playback)
//
// Reconstruction happens via the normal runtime path (which writes R2 on
// completion); this endpoint just triggers it with waitUntil and returns fast.
import { onRequest as onRuntimeContentRequest } from './runtime/content';
import type { RuntimeEnv } from './runtime/lib';

const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const MAX_IDS = 5;

export const onRequest: PagesFunction = async ({ request, env, waitUntil }) => {
  const url = new URL(request.url);
  const idsParam = (url.searchParams.get('ids') || '')
    .split(',')
    .map((value) => value.trim())
    .filter((value) => /^\d+$/.test(value))
    .slice(0, MAX_IDS);

  const auto = Math.min(3, Math.max(0, Number(url.searchParams.get('auto') || '0') || 0));
  const ids = [...idsParam];
  if (auto > 0 && ids.length < MAX_IDS) {
    // Random picks from a recent window — repeated visits converge on full coverage.
    const RECENT_WINDOW = 200;
    const FLOOR = 900; // approximate start of the media-heavy era
    for (let index = 0; index < auto; index += 1) {
      ids.push(String(FLOOR + Math.floor(Math.random() * RECENT_WINDOW)));
    }
  }
  if (!ids.length) {
    return new Response(JSON.stringify({ error: 'pass ?ids=1065,1101 or ?auto=2' }), {
      status: 400,
      headers: { 'content-type': 'application/json' }
    });
  }

  const wait = waitUntil ?? (() => {});
  for (const tokenId of ids) {
    const internal = new URL('https://internal/runtime/content');
    internal.searchParams.set('contractId', CORE);
    internal.searchParams.set('tokenId', tokenId);
    internal.searchParams.set('network', 'mainnet');
    // Fire-and-forget: reconstruction + R2 write continue after we respond.
    wait(
      onRuntimeContentRequest({
        request: new Request(internal.toString()),
        env: env as RuntimeEnv,
        waitUntil: wait
      } as Parameters<typeof onRuntimeContentRequest>[0])
        .then((response) => response.body?.cancel())
        .catch(() => undefined)
    );
  }

  return new Response(JSON.stringify({ warming: ids }), {
    status: 202,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
  });
};
