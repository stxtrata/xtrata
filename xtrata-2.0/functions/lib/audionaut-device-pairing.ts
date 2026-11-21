import { bytesToHex } from '@noble/hashes/utils';
import { hashToken, SESSION_COOKIE, readCookie, readCreatorSession } from './creator-auth';
import { checkProMembership } from './audionaut-pro-auth';
import { queryAll, run, type Env } from './db';

const origin = 'https://xtrata.xyz';
const pendingCookie = '__Secure-ANPair',
  deviceCookie = '__Secure-ANStudio';
const tenMinutes = 600,
  sessionSeconds = 8 * 3600;
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const json = (body: object, status = 200, cookie?: string) =>
  Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'private, no-store',
      Vary: 'Cookie',
      ...(cookie ? { 'Set-Cookie': cookie } : {})
    }
  });
const cookie = (name: string, value: string, age: number) =>
  `${name}=${value}; Path=/audionaut-beta-pro/; Max-Age=${age}; HttpOnly; Secure; SameSite=Strict`;
const secret = () => bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
const token = (request: Request, name: string) => {
  const value = readCookie(request, name);
  return value && /^[a-f0-9]{64}$/.test(value) ? value : null;
};
function deviceCode(nonce: string) {
  // 80 bits of the pending device's digest. The readable code can approve
  // that device but cannot redeem the approval or be used as a session cookie.
  const hash = BigInt('0x' + hashToken(nonce).slice(0, 20));
  return Array.from(
    { length: 16 },
    (_, i) => alphabet[Number((hash >> BigInt((15 - i) * 5)) & 31n)]
  ).join('');
}
const ownerFor = (request: Request, env: Env) =>
  new URL(request.url).origin === origin && typeof env.AUDIONAUT_PAIRING_WALLET === 'string'
    ? env.AUDIONAUT_PAIRING_WALLET.trim().toUpperCase()
    : '';

export async function authorizePairedStudio(request: Request, env: Env) {
  const owner = ownerFor(request, env),
    device = token(request, deviceCookie);
  if (!owner || !device) return false;
  const now = Date.now();
  // A device never acquires a creator session. Each protected read also checks
  // its original Mac session and uses the normal Audionaut ownership verifier.
  const matches = await queryAll(
    env,
    `SELECT 1 FROM audionaut_device_pairing p
    JOIN creator_sessions s ON s.token_hash=p.device_parent
    WHERE p.owner=? AND s.address=p.owner AND p.device_hash=? AND p.device_until>?
    AND s.revoked_at IS NULL AND s.expires_at>?`,
    [owner, hashToken(device), now, now]
  );
  return !!matches.results.length && (await checkProMembership(env, owner)).holds;
}

export async function pairingAction(request: Request, env: Env) {
  const owner = ownerFor(request, env);
  if (!owner) return json({ error: 'Private pairing is unavailable.' }, 404);
  if (
    request.method !== 'POST' ||
    request.headers.get('Origin') !== origin ||
    !request.headers.get('Content-Type')?.startsWith('application/json')
  )
    return json({ error: 'Open the private pairing page.' }, 403);
  const text = await request.text();
  if (text.length > 512) return json({ error: 'Pairing request is too large.' }, 413);
  let input;
  try {
    input = JSON.parse(text);
  } catch {
    return json({ error: 'Invalid pairing request.' }, 400);
  }
  const now = Date.now(),
    action = input?.action;
  if (action === 'start') {
    const nonce = now.toString(16).padStart(12, '0') + secret().slice(12);
    return json(
      { code: deviceCode(nonce), expiresAt: now + tenMinutes * 1000 },
      200,
      cookie(pendingCookie, nonce, tenMinutes)
    );
  }
  if (action === 'claim') {
    const nonce = token(request, pendingCookie);
    const issued = nonce ? parseInt(nonce.slice(0, 12), 16) : 0;
    if (!nonce || issued > now || now - issued >= tenMinutes * 1000)
      return json({ error: 'The code expired. Get a new code on this iPad.' }, 410);
    const code = deviceCode(nonce);
    const found = await queryAll(
      env,
      `SELECT s.expires_at FROM audionaut_device_pairing p
      JOIN creator_sessions s ON s.token_hash=p.pending_parent WHERE p.owner=? AND p.pending_code=?
      AND p.pending_until>? AND s.address=p.owner AND s.revoked_at IS NULL AND s.expires_at>?`,
      [owner, code, now, now]
    );
    if (!found.results.length) return json({ waiting: true });
    if (!(await checkProMembership(env, owner)).holds)
      return json({ error: 'Wallet membership is required.' }, 403);
    const device = secret(),
      until = Math.min(now + sessionSeconds * 1000, Number(found.results[0].expires_at));
    const update = await run(
      env,
      `UPDATE audionaut_device_pairing SET device_hash=?,device_until=?,device_parent=pending_parent,
      pending_code=NULL,pending_parent=NULL,pending_until=NULL WHERE owner=? AND pending_code=? AND pending_until>?`,
      [hashToken(device), until, owner, code, Date.now()]
    );
    if (update.meta.changes !== 1) return json({ waiting: true });
    return json(
      { ready: true },
      200,
      cookie(deviceCookie, device, Math.max(0, Math.floor((until - now) / 1000)))
    );
  }
  if (action === 'disconnect-device') {
    const device = token(request, deviceCookie);
    if (device)
      await run(
        env,
        'UPDATE audionaut_device_pairing SET device_hash=NULL,device_until=NULL,device_parent=NULL WHERE owner=? AND device_hash=?',
        [owner, hashToken(device)]
      );
    return json({ disconnected: true }, 200, cookie(deviceCookie, '', 0));
  }
  const { session, ok } = await readCreatorSession(request, env);
  if (!ok) return json({ error: 'Wallet sign-in is temporarily unavailable.' }, 503);
  const manager = session?.address === owner && (await checkProMembership(env, owner)).holds;
  if (action === 'status')
    return json({ manager, paired: await authorizePairedStudio(request, env) });
  if (!manager || !session)
    return json({ error: 'Unlock beta-pro with the tester wallet on your Mac.' }, 403);
  if (action === 'revoke') {
    await run(env, 'DELETE FROM audionaut_device_pairing WHERE owner=?', [owner]);
    return json({ revoked: true });
  }
  if (action !== 'approve') return json({ error: 'Unknown pairing action.' }, 400);
  const code = typeof input.code === 'string' ? input.code.toUpperCase().replace(/[\s-]/g, '') : '';
  if (code.length !== 16 || ![...code].every((c) => alphabet.includes(c)))
    return json({ error: 'Enter the four groups shown on your iPad.' }, 400);
  await run(
    env,
    `INSERT INTO audionaut_device_pairing(owner,pending_code,pending_parent,pending_until)
    VALUES(?,?,?,?) ON CONFLICT(owner) DO UPDATE SET pending_code=excluded.pending_code,
    pending_parent=excluded.pending_parent,pending_until=excluded.pending_until`,
    [
      owner,
      code,
      hashToken(token(request, SESSION_COOKIE)!),
      Math.min(now + tenMinutes * 1000, session.expiresAt)
    ]
  );
  return json({ approved: true });
}
