import { run } from '../lib/db';
import type { RuntimeEnv } from '../runtime/lib';

// POST /index/verdict — the radio reports what its probe learned, so every
// listener benefits from every other listener's failed tune attempts.
//
//   { contract: 'SP…​.name', tokenId: 123, verdict: 'dud'|'ok', reason?: 'html-no-audio' }
//
// 'dud'  -> upsert (bumps the report counter)
// 'ok'   -> delete any existing dud row (self-healing: content may have been
//           warmed into R2, or an earlier report may simply have been wrong)
//
// Advisory-only by design: /index/playable subtracts duds from the station
// list, but the client probe remains the real gatekeeper, so a malicious or
// mistaken report can silence a song from the shared list yet never break
// playback of anything a listener explicitly tunes to — and any successful
// play clears it again.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'content-type'
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...CORS } });

export const onRequest = async (context: { request: Request; env: RuntimeEnv }) => {
  const { request, env } = context;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'POST') return json({ error: 'POST only.' }, 405);

  let body: { contract?: unknown; tokenId?: unknown; verdict?: unknown; reason?: unknown };
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON.' }, 400); }

  const contract = String(body.contract || '').trim();
  const tokenId = Number(body.tokenId);
  const verdict = String(body.verdict || '').trim();
  const reason = String(body.reason || '').slice(0, 120) || null;

  if (!/^S[PM][0-9A-Z]+\.[a-z0-9-]+$/.test(contract)) return json({ error: 'Invalid contract id.' }, 400);
  if (!Number.isInteger(tokenId) || tokenId < 1 || tokenId > 10_000_000) return json({ error: 'Invalid tokenId.' }, 400);
  if (verdict !== 'dud' && verdict !== 'ok') return json({ error: "verdict must be 'dud' or 'ok'." }, 400);

  try {
    if (verdict === 'ok') {
      await run(env, 'DELETE FROM radio_verdicts WHERE contract = ? AND token_id = ?', [contract, tokenId]);
    } else {
      await run(
        env,
        `INSERT INTO radio_verdicts (contract, token_id, verdict, reason, reports, updated_at)
         VALUES (?, ?, 'dud', ?, 1, ?)
         ON CONFLICT (contract, token_id) DO UPDATE SET
           reports = radio_verdicts.reports + 1,
           reason = excluded.reason,
           updated_at = excluded.updated_at`,
        [contract, tokenId, reason, Date.now()]
      );
    }
    return json({ ok: true });
  } catch (error) {
    return json({ error: String(error instanceof Error ? error.message : error) }, 500);
  }
};
