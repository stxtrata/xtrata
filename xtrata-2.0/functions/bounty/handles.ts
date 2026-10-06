import { jsonResponse } from '../lib/utils';
import {
  BOUNTY_CAMPAIGNS,
  BOUNTY_HANDLE_TTL_MS,
  isMainnetAddress,
  normalizeHandle,
  verifyBountyHandle
} from '../lib/bounty-handle';

/**
 * Self-linked X handles for the bounty ticket tracker (/bounty/handles).
 *   GET  ?c=zdao-1                     -> { available, handles: { <address>: { h, t } } }
 *   POST { campaign, address, handle, issued, signature }
 *        the wallet signed bountyHandleData(); an empty handle removes that wallet's link.
 * The signature proves wallet control only. The handle is self-declared and shown as
 * "self-linked"; handles the team confirmed live in handles.json and always win.
 */
const NO_STORE = { 'Cache-Control': 'no-store' };
const hex = (bytes: Uint8Array) => Array.from(bytes, (v) => v.toString(16).padStart(2, '0')).join('');
const campaignOf = (value: unknown) => (BOUNTY_CAMPAIGNS as readonly string[]).includes(String(value)) ? String(value) : null;
const missingTable = (error: unknown) => /no such table|bounty_handles/i.test(String((error as Error)?.message || error));

async function readBody(request: Request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new Error('JSON required.');
  const text = await request.text();
  if (text.length > 4096) throw new Error('Request too large.');
  return JSON.parse(text);
}

export async function handleBountyHandles(request: Request, env: any, now = Date.now()) {
  const db = env?.DB;
  if (!db) return jsonResponse({ available: false, handles: {} }, request.method === 'GET' ? 200 : 503, NO_STORE);
  const url = new URL(request.url);
  try {
    if (request.method === 'GET') {
      const campaign = campaignOf(url.searchParams.get('c') || 'zdao-1');
      if (!campaign) return jsonResponse({ error: 'Unknown campaign.' }, 400, NO_STORE);
      let rows: Array<{ address: string; handle: string; signed_at: number }> = [];
      try {
        rows = ((await db.prepare('SELECT address, handle, signed_at FROM bounty_handles WHERE campaign=?').bind(campaign).all()).results ?? []) as typeof rows;
      } catch (error) {
        if (!missingTable(error)) throw error;
        return jsonResponse({ available: false, handles: {} }, 200, NO_STORE);
      }
      const handles: Record<string, { h: string; t: number }> = {};
      for (const row of rows) handles[row.address] = { h: row.handle, t: row.signed_at };
      return jsonResponse({ available: true, handles }, 200, { 'Cache-Control': 'public, max-age=20' });
    }
    if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405, NO_STORE);
    const origin = request.headers.get('origin');
    if (origin && origin !== url.origin) return jsonResponse({ error: 'Wrong origin' }, 403, NO_STORE);

    // Hashed-IP bucket, atomic in D1: 20 attempts a minute is plenty for a person.
    const ip = request.headers.get('CF-Connecting-IP') || 'local';
    const key = hex(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip + ':' + Math.floor(now / 60000)))));
    const rate = await db.prepare('INSERT INTO bounty_handle_rate(key,started,count) VALUES(?,?,1) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key, now).first();
    if (rate && rate.count > 20) return jsonResponse({ error: 'Too many attempts. Wait a minute and try again.' }, 429, NO_STORE);
    await db.prepare('DELETE FROM bounty_handle_rate WHERE started<?').bind(now - 3600000).run();

    const body = await readBody(request);
    const campaign = campaignOf(body.campaign);
    const handle = normalizeHandle(body.handle);
    const issued = Number(body.issued);
    if (!campaign) return jsonResponse({ error: 'Unknown campaign.' }, 400, NO_STORE);
    if (!isMainnetAddress(body.address)) return jsonResponse({ error: 'Use a Stacks mainnet address.' }, 400, NO_STORE);
    if (handle === null) return jsonResponse({ error: 'That is not a valid X handle. Use 1 to 15 letters, numbers or underscores.' }, 400, NO_STORE);
    if (!Number.isSafeInteger(issued) || Math.abs(now - issued) > BOUNTY_HANDLE_TTL_MS) return jsonResponse({ error: 'That signature has expired. Sign again.' }, 400, NO_STORE);
    // The wallet signed this exact text, so verify what we will store.
    if (!verifyBountyHandle({ campaign, address: body.address, handle, issued }, body.signature)) {
      return jsonResponse({ error: 'That signature does not match this wallet. Connect the wallet shown on the row and try again.' }, 403, NO_STORE);
    }
    const signature = String(body.signature).replace(/^0x/, '');
    if (handle === '') {
      await db.prepare('DELETE FROM bounty_handles WHERE campaign=? AND address=? AND signed_at<?').bind(campaign, body.address, issued).run();
      return jsonResponse({ ok: true, handle: '' }, 200, NO_STORE);
    }
    try {
      // A replayed or older signature cannot overwrite a newer one.
      await db.prepare(
        'INSERT INTO bounty_handles(campaign,address,handle,handle_key,signed_at,signature,updated) VALUES(?,?,?,?,?,?,?) ' +
        'ON CONFLICT(campaign,address) DO UPDATE SET handle=excluded.handle, handle_key=excluded.handle_key, signed_at=excluded.signed_at, signature=excluded.signature, updated=excluded.updated ' +
        'WHERE excluded.signed_at > bounty_handles.signed_at'
      ).bind(campaign, body.address, handle, handle.toLowerCase(), issued, signature, now).run();
    } catch (error) {
      if (/unique|constraint/i.test(String((error as Error)?.message || error))) {
        return jsonResponse({ error: 'That handle is already linked to another wallet. If it is yours, tell the team in the Telegram group.' }, 409, NO_STORE);
      }
      throw error;
    }
    return jsonResponse({ ok: true, handle }, 200, NO_STORE);
  } catch (error) {
    if (missingTable(error)) return jsonResponse({ error: 'Handle linking is not switched on yet.' }, 503, NO_STORE);
    const message = error instanceof SyntaxError ? 'Invalid request.' : (error as Error)?.message || 'Could not save that handle.';
    return jsonResponse({ error: message }, 400, NO_STORE);
  }
}

export const onRequest: PagesFunction = ({ request, env }) => handleBountyHandles(request, env);
