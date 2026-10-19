import {
  batchesFor, batchStatus, claimGift, confirmBatch, confirmFriendGift, createBatch, createFriendGift, createPlayer, GiftError,
  giftForWallet, giftStatus, hiroGiftChain, nextSlot, runSweep, shelfFor, sweepAuthorised, sweepGifts, turnstilePasses, type GiftDeps, type GiftEnv
} from '../../lib/radio-gifts';
import { checkSongsNow } from '../../lib/radio-metadata';
import { advance } from '../../lib/radio-giveaway';

/**
 * Radio gift wallets (functions/lib/radio-gifts.ts):
 *   POST /radio/gift/status        {code}   a gift link's status (recipient; POST keeps the code out of URLs and logs)
 *   GET  /radio/gift?id=…          a friend gift's status (the friend who paid for it)
 *   GET  /radio/gift/for?wallet=…  was this listening wallet gifted, and where do returns go
 *   GET  /radio/gift/slots?root=…  the next free numbered-wallet number for a passkey (its first wallet is the root)
 *   GET  /radio/gift/shelf?root=…&after=…&limit=…   the albums in a passkey's numbered wallets, a page at a time
 *   POST /radio/gift/claim         {code, wallet, turnstile?, binding?}   fund a brand-new listening wallet (binding: an album into a numbered wallet)
 *   POST /radio/gift/create        {gifter, amount}             start a friend gift
 *   POST /radio/gift/confirm       {id, txid?}                  the friend's deposit (found by its memo without a txid)
 *   GET  /radio/gift/batch?id=…    a prefunded batch: its bill, memo and where each copy stands (the creator who paid for it)
 *   GET  /radio/gift/batches?creator=…   a creator's recent batches (public data, never a code)
 *   POST /radio/gift/batch         {request, signature}         admin: fund a batch (one deposit pays for every copy); codes shown once
 *   POST /radio/gift/batch/confirm {id, txid?}                  the creator's deposit (found by its memo without a txid)
 *   POST /radio/gift/sweep         the scheduled housekeeping; needs `Authorization: Bearer <RADIO_GIFT_SWEEP_SECRET>` (anything else: 404)
 *   POST /radio/gift/player        {definition, request, signature}   admin: a gift player (title, songs, cover)
 * POSTs are same-origin only. Housekeeping (settling sends, expiry, refunds) runs after each request.
 */
type Ctx = { request: Request; env: GiftEnv; params?: { path?: string[] }; waitUntil?: (p: Promise<unknown>) => void };
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } });

export async function onRequest(context: Ctx) {
  const { request, env } = context;
  const action = (context.params?.path ?? []).join('/');
  const ip = request.headers.get('cf-connecting-ip');
  const deps = (): GiftDeps => ({ chain: hiroGiftChain(env), now: Date.now(), human: (token, from) => turnstilePasses(env, token, from), checkSongs: (ids) => checkSongsNow(env, ids) });
  const later = () => {
    // Through the context: detached from it the runtime refuses waitUntil ("Illegal invocation").
    const sweep = sweepGifts(env, deps()).catch(() => undefined);
    if (context.waitUntil) context.waitUntil(sweep);
  };
  // The giveaway (public/giveaway.html) moves on when a claimed link's funds have arrived: the sweep is what notices.
  const sweepAndGiveaway = async () => {
    const out = await runSweep(env, deps());
    if (env.RADIO_GIFT_ENABLED === '1') await advance(env, Date.now()).catch(() => undefined);
    return out;
  };
  try {
    if (request.method === 'GET') {
      const q = new URL(request.url).searchParams;
      // The recipient's page asks this while its gift is on its way, which also keeps the sends moving.
      if (action === 'for') { const r = reply(await giftForWallet(env, q.get('wallet') ?? '')); later(); return r; }
      if (action === 'slots') return reply(await nextSlot(env, q.get('root') ?? ''));
      if (action === 'shelf') return reply(await shelfFor(env, q.get('root') ?? '', Number(q.get('after') ?? 0), Number(q.get('limit') ?? 50)));
      if (action === '') { const r = reply(await giftStatus(env, { id: q.get('id') })); later(); return r; }
      if (action === 'batch') { const r = reply(await batchStatus(env, q.get('id') ?? '')); later(); return r; }
      if (action === 'batches') { const r = reply(await batchesFor(env, q.get('creator') ?? '')); later(); return r; }
      return reply({ error: 'Not found' }, 404);
    }
    if (request.method !== 'POST') return reply({ error: 'GET or POST required' }, 405);
    // The scheduled sweep is not a browser: it has no Origin, only the shared secret. Wrong or missing secret looks like no such page.
    if (action === 'sweep') return sweepAuthorised(env, request.headers.get('authorization')) ? reply(await sweepAndGiveaway()) : reply({ error: 'Not found' }, 404);
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
    else if (action === 'batch') out = await createBatch(env, body, deps(), request);
    else if (action === 'batch/confirm') out = await confirmBatch(env, body, deps(), request);
    else if (action === 'player') out = await createPlayer(env, body, deps(), request);
    else return reply({ error: 'Not found' }, 404);
    later();
    return reply(out);
  } catch (error) {
    if (error instanceof GiftError) return reply({ error: error.message }, error.status);
    console.warn('[radio:gifts]', { action, reason: String((error as Error)?.message || error).slice(0, 120) });
    return reply({ error: 'Gifts are unavailable right now. Nothing was sent.' }, 500);
  }
}
