import { AwardError, awardAtNumber, awardNote, awardsConfig, awardStatus, hiroAwardChain, targetFor, type AwardsEnv } from '../../lib/radio-awards';
import { SUGGESTED_DROP } from '../../../src/lib/listening-wallet/tiers';

/**
 * Music Hero awards (functions/lib/radio-awards.ts, docs/music/AWARDS-SERVER.md). Off unless RADIO_AWARDS_ENABLED=1
 * and the contract is set.
 *   GET  /radio/awards/config             on or off, the contract, the drop, what each class needs
 *   GET  /radio/awards/status?address=    where this player stands (never a zero for something that could not be read)
 *   POST /radio/awards/note               {address, name: "auto" | "none"}: the record's bytes and their signed note
 *   GET  /radio/awards/record?number=     for the wall: whether disc N has claimed, and its inscription
 * Nothing here moves money or sends a transaction.
 */
type Ctx = { request: Request; env: AwardsEnv; params?: { path?: string[] } };
const reply = (body: unknown, status = 200, extra: Record<string, string> = {}) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...extra }
});

export async function onRequest({ request, env, params }: Ctx) {
  const action = (params?.path ?? []).join('/');
  const url = new URL(request.url);
  try {
    const cfg = awardsConfig(env);
    if (action === 'config') {
      if (request.method !== 'GET') return reply({ error: 'GET required' }, 405);
      if (!cfg.enabled) return reply({ enabled: false });
      return reply({
        enabled: true, contract: cfg.contract, drop: cfg.drop, percent: cfg.percent,
        classes: SUGGESTED_DROP.map((c) => ({ id: c.tier, plays: c.plays, need: targetFor(c.plays, cfg.percent) }))
      }, 200, { 'cache-control': 'public, max-age=0, s-maxage=30' });
    }
    if (!cfg.enabled) return reply({ state: 'off' });
    const chain = hiroAwardChain(env);
    if (action === 'status') {
      if (request.method !== 'GET') return reply({ error: 'GET required' }, 405);
      return reply(await awardStatus(env, chain, url.searchParams.get('address'), Date.now()));
    }
    if (action === 'record') {
      if (request.method !== 'GET') return reply({ error: 'GET required' }, 405);
      return reply(await awardAtNumber(env, chain, url.searchParams.get('number')), 200, { 'cache-control': 'public, max-age=0, s-maxage=20' });
    }
    if (action === 'note') {
      if (request.method !== 'POST') return reply({ error: 'POST required' }, 405);
      const origin = request.headers.get('origin');
      if (!origin || origin !== url.origin || request.headers.get('sec-fetch-site') === 'cross-site') return reply({ error: 'Same origin required' }, 403);
      const text = await request.text();
      if (text.length > 1000) return reply({ error: 'Too large' }, 413);
      let body: any;
      try { body = JSON.parse(text || '{}'); } catch { return reply({ error: 'Invalid JSON' }, 400); }
      return reply(await awardNote(env, chain, body ?? {}, Date.now()));
    }
    return reply({ error: 'Not found' }, 404);
  } catch (error) {
    if (error instanceof AwardError) return reply({ error: error.message }, error.status);
    console.warn('[radio:awards]', { action, reason: String((error as Error)?.message || error).slice(0, 120) });
    return reply({ error: 'Awards are unavailable right now.' }, 500);
  }
}
