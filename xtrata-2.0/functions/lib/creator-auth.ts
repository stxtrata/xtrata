/**
 * Collection studio authorization.
 *
 * - A creator signs a SIP-018 challenge once; the server sets an HttpOnly
 *   session cookie valid for 7 days (or until "Sign out").
 * - Writes to a collection are allowed for its recorded creator
 *   (`artist_address`) or an Xtrata admin (XTRATA_ADMIN_ADDRESSES, defaulting
 *   to the Xtrata owner address).
 * - Creating drafts requires the creator allowlist (checked here, server-side).
 *
 * CREATOR_AUTH_MODE rolls this out safely:
 *   off     — no checks (emergency rollback)
 *   log     — (default) decisions are computed and would-be denials are
 *             recorded in creator_auth_audit, but nothing is blocked
 *   enforce — denials return 401/403
 */
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import type { Env } from './db';
import { queryAll, run } from './db';
import {
  CREATOR_CHALLENGE_TTL_MS,
  CREATOR_SESSION_TTL_MS,
  networkForAddress,
  validateCreatorChallenge,
  verifyCreatorProof,
  type CreatorChallenge
} from './creator-proof';

export const XTRATA_OWNER_ADDRESS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
export const SESSION_COOKIE = 'xtrata_creator';
export type CreatorAuthMode = 'off' | 'log' | 'enforce';

export const creatorAuthMode = (env: Env): CreatorAuthMode => {
  const value = String(env.CREATOR_AUTH_MODE ?? 'log').trim().toLowerCase();
  return value === 'off' || value === 'enforce' ? value : 'log';
};

const normalizeAddress = (value: unknown) => String(value ?? '').trim().toUpperCase();

export const adminAddresses = (env: Env) => {
  const configured = String(env.XTRATA_ADMIN_ADDRESSES ?? '')
    .split(/[\s,;]+/)
    .map(normalizeAddress)
    .filter((value) => networkForAddress(value) !== null);
  return new Set(configured.length ? configured : [XTRATA_OWNER_ADDRESS]);
};
export const isAdminAddress = (env: Env, address: string | null | undefined) =>
  Boolean(address) && adminAddresses(env).has(normalizeAddress(address));

const randomHex = (bytes = 32) => {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return bytesToHex(buffer);
};
export const hashToken = (token: string) => bytesToHex(sha256(new TextEncoder().encode(token)));

// ---------------------------------------------------------------- allowlist

const ALLOWLIST_KEYS = ['ARTIST_ALLOWLIST', 'VITE_ARTIST_ALLOWLIST', 'MANAGE_ALLOWLIST'];
export const readAllowlistEntries = (env: Env) => {
  const raw = ALLOWLIST_KEYS.map((key) => String(env[key] ?? '').trim()).find(Boolean) ?? '';
  return raw
    .split(/[\s,;]+/)
    .map((entry) => entry.trim().replace(/^[\[\]'"`]+|[\[\]'"`]+$/g, '').trim())
    .filter(Boolean);
};

const bnsCache = new Map<string, { address: string | null; at: number }>();
async function resolveBns(env: Env, name: string, network: 'mainnet' | 'testnet') {
  const key = `${network}:${name}`;
  const cached = bnsCache.get(key);
  if (cached && Date.now() - cached.at < 10 * 60 * 1000) return cached.address;
  const base = String(
    (network === 'mainnet' ? env.BNSV2_API_BASE_MAINNET : env.BNSV2_API_BASE_TESTNET) ??
      (network === 'mainnet' ? 'https://api.bnsv2.com' : 'https://api.bnsv2.com/testnet')
  ).replace(/\/$/, '');
  const response = await fetch(`${base}/names/${encodeURIComponent(name)}`, {
    headers: { Accept: 'application/json' }
  });
  if (response.status === 404) {
    bnsCache.set(key, { address: null, at: Date.now() });
    return null;
  }
  if (!response.ok) throw new Error(`BNS lookup failed (HTTP ${response.status}).`);
  const body = (await response.json()) as Record<string, unknown>;
  const data = (body.data ?? body) as Record<string, unknown>;
  const candidate = [data.owner, data.address, data.owner_address, body.address]
    .map(normalizeAddress)
    .find((value) => networkForAddress(value) !== null);
  const address = candidate ?? null;
  bnsCache.set(key, { address, at: Date.now() });
  return address;
}

/** { allowed, checked } — `checked:false` means a BNS lookup failed ("could not check"). */
export async function isCreatorAllowlisted(env: Env, address: string) {
  const normalized = normalizeAddress(address);
  if (isAdminAddress(env, normalized)) return { allowed: true, checked: true };
  const network = networkForAddress(normalized);
  if (!network) return { allowed: false, checked: true };
  const entries = readAllowlistEntries(env);
  if (entries.some((entry) => normalizeAddress(entry) === normalized)) return { allowed: true, checked: true };
  let checked = true;
  for (const entry of entries.filter((value) => value.includes('.') && networkForAddress(value) === null)) {
    try {
      if ((await resolveBns(env, entry.toLowerCase(), network)) === normalized) return { allowed: true, checked: true };
    } catch {
      checked = false;
    }
  }
  return { allowed: false, checked };
}

// ------------------------------------------------------------- challenges

export async function createCreatorChallenge(env: Env, address: string, now = Date.now()) {
  const normalized = normalizeAddress(address);
  const network = networkForAddress(normalized);
  if (!network) throw new Error('Enter a valid Stacks address.');
  const challenge: CreatorChallenge = {
    id: randomHex(), address: normalized, network, nonce: randomHex(),
    issued: now, expires: now + CREATOR_CHALLENGE_TTL_MS
  };
  await run(env, 'DELETE FROM creator_challenges WHERE expires_at < ?', [now - 60 * 60 * 1000]);
  await run(env, 'INSERT INTO creator_challenges (id, address, challenge, expires_at) VALUES (?, ?, ?, ?)',
    [challenge.id, normalized, JSON.stringify(challenge), challenge.expires]);
  return challenge;
}

export async function completeCreatorSignIn(env: Env, id: string, signature: unknown, now = Date.now()) {
  if (!/^[a-f0-9]{64}$/.test(String(id))) throw new Error('Invalid sign-in request.');
  const result = await queryAll(env, 'SELECT challenge, used_at FROM creator_challenges WHERE id = ?', [id]);
  const row = (result.results ?? [])[0] as { challenge?: string; used_at?: number | null } | undefined;
  if (!row?.challenge) throw new Error('Sign-in request not found. Try again.');
  if (row.used_at) throw new Error('This sign-in request was already used. Try again.');
  const challenge = validateCreatorChallenge(JSON.parse(row.challenge) as CreatorChallenge, now);
  if (!verifyCreatorProof(challenge, signature))
    throw new Error('The signature does not match this wallet. Nothing was changed.');
  const consumed = await run(env, 'UPDATE creator_challenges SET used_at = ? WHERE id = ? AND used_at IS NULL', [now, id]);
  if (Number((consumed as { meta?: { changes?: number } })?.meta?.changes ?? 1) !== 1)
    throw new Error('This sign-in request was already used. Try again.');
  const token = randomHex();
  const expiresAt = now + CREATOR_SESSION_TTL_MS;
  await run(env, 'INSERT INTO creator_sessions (token_hash, address, created_at, expires_at) VALUES (?, ?, ?, ?)',
    [hashToken(token), challenge.address, now, expiresAt]);
  return { token, address: challenge.address, expiresAt };
}

// --------------------------------------------------------------- sessions

export const readCookie = (request: Request, name: string) => {
  const header = request.headers.get('cookie') ?? '';
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return decodeURIComponent(rest.join('='));
  }
  return null;
};

export const sessionCookie = (token: string, request: Request) => {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${Math.floor(CREATOR_SESSION_TTL_MS / 1000)}${secure}`;
};
export const clearSessionCookie = (request: Request) => {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
};

export type CreatorSession = { address: string; expiresAt: number; admin: boolean };

/** `{ session, ok }` — ok:false means the session store could not be read. */
export async function readCreatorSession(request: Request, env: Env, now = Date.now()) {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return { session: null as CreatorSession | null, ok: true };
  try {
    const result = await queryAll(env,
      'SELECT address, expires_at FROM creator_sessions WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > ?',
      [hashToken(token), now]);
    const row = (result.results ?? [])[0] as { address?: string; expires_at?: number } | undefined;
    if (!row?.address) return { session: null, ok: true };
    return { session: { address: row.address, expiresAt: Number(row.expires_at), admin: isAdminAddress(env, row.address) }, ok: true };
  } catch {
    return { session: null, ok: false };
  }
}

export async function revokeCreatorSession(request: Request, env: Env, now = Date.now()) {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return;
  await run(env, 'UPDATE creator_sessions SET revoked_at = ? WHERE token_hash = ? AND revoked_at IS NULL', [now, hashToken(token)]);
}

// ----------------------------------------------------------- authorization

export type CreatorAuthDecision = {
  allowed: boolean;
  address: string | null;
  admin: boolean;
  /** Present when the request is refused (enforce mode only). */
  response?: Response;
};

const deny = (status: number, message: string) =>
  new Response(JSON.stringify({ error: message, code: status === 401 ? 'sign-in-required' : 'forbidden' }), {
    status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store' }
  });

async function audit(env: Env, action: string, collectionId: string | null, address: string | null, reason: string) {
  try {
    await run(env, 'INSERT INTO creator_auth_audit (at, action, collection_id, address, reason, mode) VALUES (?, ?, ?, ?, ?, ?)',
      [Date.now(), action, collectionId, address, reason, creatorAuthMode(env)]);
  } catch {
    // Audit is best-effort; the decision itself is still returned.
  }
  console.warn('[creator-auth]', JSON.stringify({ action, collectionId, address, reason, mode: creatorAuthMode(env) }));
}

/**
 * Decide whether this request may act. `collection` = the target record for
 * per-collection writes (owner or admin); omit for "create a draft"
 * (allowlisted creator or admin) or `adminOnly` for admin-only routes.
 */
export async function authorizeCreator(
  request: Request,
  env: Env,
  options: {
    action: string;
    collection?: { id?: unknown; artist_address?: unknown } | null;
    adminOnly?: boolean;
    requireAllowlist?: boolean;
  }
): Promise<CreatorAuthDecision> {
  const mode = creatorAuthMode(env);
  if (mode === 'off') return { allowed: true, address: null, admin: false };
  const collectionId = options.collection?.id != null ? String(options.collection.id) : null;
  const { session, ok } = await readCreatorSession(request, env);
  const refuse = async (status: number, message: string, reason: string): Promise<CreatorAuthDecision> => {
    await audit(env, options.action, collectionId, session?.address ?? null, reason);
    return mode === 'enforce'
      ? { allowed: false, address: session?.address ?? null, admin: session?.admin ?? false, response: deny(status, message) }
      : { allowed: true, address: session?.address ?? null, admin: session?.admin ?? false };
  };
  if (!ok) return refuse(503, 'Sign-in is temporarily unavailable. Try again shortly.', 'session-store-unavailable');
  if (!session) return refuse(401, 'Sign in with your creator wallet to make changes.', 'no-session');
  if (session.admin) return { allowed: true, address: session.address, admin: true };
  if (options.adminOnly) return refuse(403, 'This action is limited to Xtrata admins.', 'not-admin');
  if (options.collection) {
    const owner = normalizeAddress(options.collection.artist_address);
    if (!owner || owner !== normalizeAddress(session.address))
      return refuse(403, 'Only the creator of this collection can change it.', `not-owner:${owner || 'none'}`);
    return { allowed: true, address: session.address, admin: false };
  }
  if (options.requireAllowlist !== false) {
    const allow = await isCreatorAllowlisted(env, session.address);
    if (!allow.allowed)
      return refuse(allow.checked ? 403 : 503,
        allow.checked ? 'This wallet is not on the creator list yet.' : 'Could not check the creator list right now. Try again shortly.',
        allow.checked ? 'not-allowlisted' : 'allowlist-unchecked');
  }
  return { allowed: true, address: session.address, admin: false };
}

/**
 * Read access to unpublished records: owner/admin in enforce mode; open otherwise.
 * Returns null when allowed, otherwise the response to send: 404 (hide the
 * record) or 503 when the session store could not be read — a failed read is
 * "could not check", never "not yours".
 */
export async function denyPrivateRead(
  request: Request,
  env: Env,
  collection: { artist_address?: unknown } | null | undefined
): Promise<Response | null> {
  if (creatorAuthMode(env) !== 'enforce') return null;
  const { session, ok } = await readCreatorSession(request, env);
  if (!ok) return deny(503, 'Sign-in is temporarily unavailable, so private collections cannot be shown. Try again shortly.');
  if (session && (session.admin || normalizeAddress(collection?.artist_address) === normalizeAddress(session.address))) return null;
  return new Response(JSON.stringify({ error: 'Collection not found.' }), {
    status: 404, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store' }
  });
}
