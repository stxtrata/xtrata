import { jsonResponse } from '../lib/utils';

/**
 * Requests from the preservation checker page (POST /checker/requests).
 *   POST { kind, contract, chain?, name?, note?, contact?, role?, website? }
 *     kind     'retest' (test this collection again), 'helper' (add an open Forever Twins helper for it) or
 *              'assess' (a collection the census has not covered)
 *     contract Stacks contract id, SP....name
 *     role     'holder' | 'creator' | 'other' (self-declared, optional)
 *     website  honeypot: real visitors never fill it in; a filled one is answered "ok" and dropped
 * There is no GET. Requests are read with wrangler / the D1 console (queries in migration 031).
 * Nothing about the visitor is stored: no wallet, no IP. The rate limit keeps a salted hash of the IP for the hour.
 */
const NO_STORE = { 'Cache-Control': 'no-store' };
const KINDS = ['retest', 'helper', 'assess'] as const;
const ROLES = ['holder', 'creator', 'other'] as const;
const CHAINS = ['stacks'] as const;
const MAX_BODY = 4096;
const MAX_NAME = 120;
const MAX_NOTE = 500;
const MAX_CONTACT = 200;
const PER_HOUR = 5;
const BACKLOG_LIMIT = 2000;
const DEDUPE_WINDOW_MS = 24 * 3600_000;
const HOUR_MS = 3600_000;

// Stacks mainnet contract id: c32 address (SP or SM) + "." + Clarity contract name.
const STACKS_CONTRACT = /^(S[PM][0-9ABCDEFGHJKMNPQRSTVWXYZ]{37,40})\.([A-Za-z][A-Za-z0-9_-]{0,127})$/;

const hex = (bytes: Uint8Array) => Array.from(bytes, (v) => v.toString(16).padStart(2, '0')).join('');
const missingTable = (error: unknown) => /no such table|checker_request/i.test(String((error as Error)?.message || error));

/** Trim, drop control characters (keeping newlines in notes) and cap the length. Stored as text; never render it as HTML. */
function clean(value: unknown, max: number, keepNewlines = false) {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') return null;
  const stripped = value.replace(keepNewlines ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, ' ').trim();
  return stripped.length > max ? null : stripped;
}

function normaliseContract(value: unknown) {
  if (typeof value !== 'string') return null;
  const match = STACKS_CONTRACT.exec(value.trim().replace(/^(.*?)\./, (_all, address: string) => address.toUpperCase() + '.'));
  return match ? `${match[1]}.${match[2]}` : null;
}

/** A problem with what the visitor sent (400). Anything else that throws is our fault (500) and is never shown to them. */
class BadRequest extends Error {}

async function readBody(request: Request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new BadRequest('JSON required.');
  const text = await request.text();
  if (text.length > MAX_BODY) throw new BadRequest('Request too large.');
  try {
    return JSON.parse(text);
  } catch {
    throw new BadRequest('Invalid request.');
  }
}

export async function handleCheckerRequest(request: Request, env: any, now = Date.now()) {
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405, { ...NO_STORE, Allow: 'POST' });
  const db = env?.DB;
  if (!db) return jsonResponse({ error: 'Requests are not switched on yet.' }, 503, NO_STORE);
  const url = new URL(request.url);
  const origin = request.headers.get('origin');
  if (origin && origin !== url.origin) return jsonResponse({ error: 'Wrong origin' }, 403, NO_STORE);

  try {
    // Hashed-IP bucket per hour, atomic in D1. Malformed requests count too, so probing the form costs the prober.
    const ip = request.headers.get('CF-Connecting-IP') || 'local';
    const salt = typeof env?.TELEMETRY_SALT === 'string' ? env.TELEMETRY_SALT : '';
    const key = hex(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${salt}:${ip}:${Math.floor(now / HOUR_MS)}`))));
    const rate = await db.prepare('INSERT INTO checker_request_rate(key,started,count) VALUES(?,?,1) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key, now).first();
    if (rate && rate.count > PER_HOUR) return jsonResponse({ error: 'Too many requests from here. Try again in an hour.' }, 429, NO_STORE);
    await db.prepare('DELETE FROM checker_request_rate WHERE started<?').bind(now - 2 * HOUR_MS).run();

    const body = await readBody(request);
    if (!body || typeof body !== 'object' || Array.isArray(body)) return jsonResponse({ error: 'Invalid request.' }, 400, NO_STORE);

    // Honeypot: look successful, store nothing.
    if (typeof body.website === 'string' && body.website.trim() !== '') return jsonResponse({ ok: true }, 200, NO_STORE);

    const chain = body.chain === undefined ? 'stacks' : String(body.chain);
    if (!(CHAINS as readonly string[]).includes(chain)) return jsonResponse({ error: 'Only Stacks collections can be requested for now.' }, 400, NO_STORE);
    const kind = String(body.kind);
    if (!(KINDS as readonly string[]).includes(kind)) return jsonResponse({ error: 'Unknown request type.' }, 400, NO_STORE);
    const contract = normaliseContract(body.contract);
    if (!contract) return jsonResponse({ error: 'That does not look like a Stacks contract id (it should look like SP….name).' }, 400, NO_STORE);
    const role = body.role === undefined || body.role === '' ? '' : String(body.role);
    if (role !== '' && !(ROLES as readonly string[]).includes(role)) return jsonResponse({ error: 'Unknown role.' }, 400, NO_STORE);
    const name = clean(body.name, MAX_NAME);
    const note = clean(body.note, MAX_NOTE, true);
    const contact = clean(body.contact, MAX_CONTACT);
    if (name === null) return jsonResponse({ error: `The collection name must be text up to ${MAX_NAME} characters.` }, 400, NO_STORE);
    if (note === null) return jsonResponse({ error: `The note must be text up to ${MAX_NOTE} characters.` }, 400, NO_STORE);
    if (contact === null) return jsonResponse({ error: `The contact must be text up to ${MAX_CONTACT} characters.` }, 400, NO_STORE);

    // Backlog guard: if nobody has looked at the queue and it is huge, stop taking more rather than grow without limit.
    const backlog = await db.prepare("SELECT COUNT(*) AS n FROM checker_requests WHERE status='new'").first();
    if (backlog && backlog.n >= BACKLOG_LIMIT) return jsonResponse({ error: 'Requests are paused for now. Please try again later.' }, 503, NO_STORE);

    // The same person asking twice (same collection, same kind, same contact) within a day is one request.
    if (contact !== '') {
      const duplicate = await db.prepare(
        'SELECT id FROM checker_requests WHERE chain=? AND contract_id=? AND kind=? AND contact=? AND created_at>? LIMIT 1'
      ).bind(chain, contract, kind, contact, now - DEDUPE_WINDOW_MS).first();
      if (duplicate) return jsonResponse({ ok: true, id: duplicate.id, duplicate: true }, 200, NO_STORE);
    }

    const id = crypto.randomUUID();
    await db.prepare(
      'INSERT INTO checker_requests(id,created_at,chain,contract_id,kind,collection_name,note,contact,role) VALUES(?,?,?,?,?,?,?,?,?)'
    ).bind(id, now, chain, contract, kind, name, note, contact, role).run();
    return jsonResponse({ ok: true, id }, 200, NO_STORE);
  } catch (error) {
    if (error instanceof BadRequest) return jsonResponse({ error: error.message }, 400, NO_STORE);
    if (missingTable(error)) return jsonResponse({ error: 'Requests are not switched on yet.' }, 503, NO_STORE);
    // Could not check or could not save: say so, and keep the database's wording to ourselves.
    return jsonResponse({ error: 'Could not save that request right now. Please try again.' }, 500, NO_STORE);
  }
}

export const onRequest: PagesFunction = ({ request, env }) => handleCheckerRequest(request, env);
