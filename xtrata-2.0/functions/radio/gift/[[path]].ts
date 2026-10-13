import {
  claimGift, confirmFriendGift, createCampaign, createFriendGift, GiftError, giftForWallet, giftStatus, hiroGiftChain,
  sweepGifts, turnstilePasses, type GiftDeps, type GiftEnv
} from '../../lib/radio-gifts';

/**
 * Radio gift wallets (functions/lib/radio-gifts.ts):
 *   POST /radio/gift/status        {code}   a gift link's status (recipient; POST keeps the code out of URLs and logs)
 *   GET  /radio/gift?id=…          a friend gift's status (the friend who paid for it)
 *   GET  /radio/gift/for?wallet=…  was this listening wallet gifted, and where do returns go
 *   POST /radio/gift/claim         {code, wallet, turnstile?}   fund a brand-new listening wallet
 *   POST /radio/gift/create        {gifter, amount}             start a friend gift
 *   POST /radio/gift/confirm       {id, txid?}                  the friend's deposit (found by its memo without a txid)
 *   POST /radio/gift/campaign      {request, signature}         admin: campaign links
 * POSTs are same-origin only. Housekeeping (settling sends, expiry, refunds) runs after each request.
 */
type Ctx = { request: Request; env: GiftEnv; params?: { path?: string[] }; waitUntil?: (p: Promise<unknown>) => void };
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } });

export async function onRequest(context: Ctx) {
  const { request, env } = context;
  const action = (context.params?.path ?? []).join('/');
  const ip = request.headers.get('cf-connecting-ip');
  const deps = (): GiftDeps => ({ chain: hiroGiftChain(env), now: Date.now(), human: (token, from) => turnstilePasses(env, token, from) });
  const later = () => {
    // Through the context: detached from it the runtime refuses waitUntil ("Illegal invocation").
    const sweep = sweepGifts(env, deps()).catch(() => undefined);
    if (context.waitUntil) context.waitUntil(sweep);
  };
  try {
    if (request.method === 'GET') {
      const q = new URL(request.url).searchParams;
      // The recipient's page asks this while its gift is on its way, which also keeps the sends moving.
      if (action === 'for') { const r = reply(await giftForWallet(env, q.get('wallet') ?? '')); later(); return r; }
      if (action === '') { const r = reply(await giftStatus(env, { id: q.get('id') })); later(); return r; }
      return reply({ error: 'Not found' }, 404);
    }
    if (request.method !== 'POST') return reply({ error: 'GET or POST required' }, 405);
    const origin = request.headers.get('origin');
    if (!origin || origin !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site') return reply({ error: 'Same origin required' }, 403);
    if (!request.headers.get('content-type')?.startsWith('application/json')) return reply({ error: 'JSON required' }, 415);
    const text = await request.text();
    if (text.length > 4000) return reply({ error: 'Too large' }, 413);
    let body: any;
    try { body = JSON.parse(text); } catch { return reply({ error: 'Invalid JSON' }, 400); }
    let out: unknown;
    if (action === 'status') out = await giftStatus(env, { code: typeof body?.code === 'string' ? body.code : '' });
    else if (action === 'claim') out = await claimGift(env, body, deps(), ip, request);
    else if (action === 'create') out = await createFriendGift(env, body, deps(), ip, request);
    else if (action === 'confirm') out = await confirmFriendGift(env, body, deps(), request);
    else if (action === 'campaign') out = await createCampaign(env, body, deps(), request);
    else return reply({ error: 'Not found' }, 404);
    later();
    return reply(out);
  } catch (error) {
    if (error instanceof GiftError) return reply({ error: error.message }, error.status);
    console.warn('[radio:gifts]', { action, reason: String((error as Error)?.message || error).slice(0, 120) });
    return reply({ error: 'Gifts are unavailable right now. Nothing was sent.' }, 500);
  }
}
