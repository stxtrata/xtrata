import { describe, expect, it } from 'vitest';
import {
  createStacksPrivateKey,
  getAddressFromPrivateKey,
  makeRandomPrivKey,
  privateKeyToString,
  signStructuredData,
  TransactionVersion
} from '@stacks/transactions';
import { creatorProofData } from '../creator-proof';
import {
  ROOM_CHALLENGE_TTL_MS,
  ROOM_SESSION_TTL_MS,
  clearRoomSessionCookie,
  issueRoomChallenge,
  readRoomSession,
  readRoomSessionToken,
  roomProofData,
  roomProofText,
  roomSessionCookie,
  secretUsable,
  signRoomSession,
  validateRoomChallenge,
  verifyRoomProof,
  type RoomChallenge
} from '../casino-room-proof';

const SECRET = 'test-secret-test-secret-test-secret-0123456789';
const OTHER = 'another-secret-another-secret-another-secret-1';

const wallet = (version: TransactionVersion = TransactionVersion.Testnet, rawKey?: string) => {
  const raw = rawKey ?? privateKeyToString(makeRandomPrivKey());
  const key = raw.length === 64 ? `${raw}01` : raw; // compressed, as wallets use
  return { key, address: getAddressFromPrivateKey(key, version) };
};
const sign = (challenge: RoomChallenge, key: string) =>
  signStructuredData({ ...roomProofData(challenge), privateKey: createStacksPrivateKey(key) }).data;

describe('what the player reads in the wallet', () => {
  it('is one plain sentence that names the account, the expiry and that nothing is spent', () => {
    const w = wallet(TransactionVersion.Testnet);
    const c = issueRoomChallenge(SECRET, w.address, Date.UTC(2026, 9, 29, 11, 0, 0));
    const text = roomProofText(c);
    expect(text).toContain('ParallaX Casino room sign-in');
    expect(text).toContain('sends no transaction, costs no fees and gives no permission to spend anything');
    expect(text).toContain(`Account ${c.address}.`);
    expect(text).toContain('Valid until 2026-10-29T11:02:00Z.');
    expect(text).toContain(`Request code ${c.nonce}.`);
    expect(/^[\x20-\x7e]+$/.test(text)).toBe(true);        // printable ASCII only: it is a Clarity string-ascii
    // the signed message is exactly that sentence, so what the wallet shows is what is verified
    expect((roomProofData(c).message as { data: string }).data).toBe(text);
    // a different request has a different sentence, so a signature cannot be moved to another request
    const other = issueRoomChallenge(SECRET, w.address, Date.UTC(2026, 9, 29, 11, 0, 0));
    expect(roomProofText(other)).not.toBe(text);
  });
});

describe('casino room challenge', () => {
  it('issues a fresh challenge for a testnet or mainnet address and rejects anything else', () => {
    const t = wallet(TransactionVersion.Testnet), m = wallet(TransactionVersion.Mainnet);
    const ct = issueRoomChallenge(SECRET, t.address, 1_000_000);
    const cm = issueRoomChallenge(SECRET, m.address, 1_000_000);
    expect(ct.network).toBe('testnet');
    expect(cm.network).toBe('mainnet');
    expect(ct.expires - ct.issued).toBe(ROOM_CHALLENGE_TTL_MS);
    expect(ct.nonce).toMatch(/^[a-f0-9]{64}$/);
    expect(ct.nonce).not.toBe(issueRoomChallenge(SECRET, t.address, 1_000_000).nonce);
    expect(() => issueRoomChallenge(SECRET, 'not an address')).toThrow();
    expect(() => issueRoomChallenge(SECRET, '')).toThrow();
  });

  it('validates only challenges this server issued, still fresh', () => {
    const w = wallet();
    const c = issueRoomChallenge(SECRET, w.address, 1_000_000);
    expect(validateRoomChallenge(SECRET, c, 1_000_500)).toEqual(c);
    expect(() => validateRoomChallenge(OTHER, c, 1_000_500)).toThrow(/Invalid sign-in request/);
    expect(() => validateRoomChallenge(SECRET, { ...c, nonce: 'a'.repeat(64) }, 1_000_500)).toThrow();
    expect(() => validateRoomChallenge(SECRET, { ...c, address: wallet().address }, 1_000_500)).toThrow();
    expect(() => validateRoomChallenge(SECRET, { ...c, expires: c.expires + 1 }, 1_000_500)).toThrow();
    expect(() => validateRoomChallenge(SECRET, { ...c, network: 'mainnet' }, 1_000_500)).toThrow();
    expect(() => validateRoomChallenge(SECRET, { ...c, mac: '0'.repeat(64) }, 1_000_500)).toThrow();
    expect(() => validateRoomChallenge(SECRET, c, c.expires + 1)).toThrow(/expired/);
    expect(() => validateRoomChallenge(SECRET, c, 1_000_000 - 60_000)).toThrow();   // issued in the future
    expect(() => validateRoomChallenge(SECRET, null)).toThrow();
    expect(() => validateRoomChallenge(SECRET, 'x')).toThrow();
  });
});

describe('casino room proof (SIP-018)', () => {
  it('accepts a signature made by the challenge address, on testnet and mainnet', () => {
    for (const version of [TransactionVersion.Testnet, TransactionVersion.Mainnet]) {
      const w = wallet(version);
      const c = issueRoomChallenge(SECRET, w.address);
      const proof = verifyRoomProof(c, sign(c, w.key));
      expect(proof?.address).toBe(w.address);
      expect(proof?.hash160).toMatch(/^[a-f0-9]{40}$/);
    }
  });

  it('gives the same account key hash for the testnet and mainnet form of one key', () => {
    const w = wallet();
    const main = getAddressFromPrivateKey(w.key, TransactionVersion.Mainnet);
    const ct = issueRoomChallenge(SECRET, w.address), cm = issueRoomChallenge(SECRET, main);
    expect(verifyRoomProof(ct, sign(ct, w.key))?.hash160).toBe(verifyRoomProof(cm, sign(cm, w.key))?.hash160);
  });

  it('rejects another wallet, a changed challenge, bad shapes, and a Studio-login signature', () => {
    const a = wallet(), b = wallet();
    const c = issueRoomChallenge(SECRET, a.address);
    expect(verifyRoomProof(c, sign(c, b.key))).toBeNull();
    const c2 = issueRoomChallenge(SECRET, a.address);
    expect(verifyRoomProof(c2, sign(c, a.key))).toBeNull();                       // signature for a different nonce
    expect(verifyRoomProof({ ...c, expires: c.expires + 1 }, sign(c, a.key))).toBeNull();
    expect(verifyRoomProof(c, 'nope')).toBeNull();
    expect(verifyRoomProof(c, 12)).toBeNull();
    expect(verifyRoomProof(c, '00'.repeat(65))).toBeNull();
    // Same fields signed under the Studio login domain must NOT work as a casino sign-in (domain separation).
    const studio = signStructuredData({
      ...creatorProofData({ id: 'a'.repeat(64), address: a.address, network: c.network, nonce: c.nonce, issued: c.issued, expires: c.expires }),
      privateKey: createStacksPrivateKey(a.key)
    }).data;
    expect(verifyRoomProof(c, studio)).toBeNull();
  });
});

describe('casino room session token and cookie', () => {
  const session = { a: 'ST1ABC', k: 'f'.repeat(40), n: 'e'.repeat(64), iat: 1_000_000, exp: 1_000_000 + ROOM_SESSION_TTL_MS };

  it('round-trips, and refuses a wrong secret, tampering, expiry and junk', () => {
    const token = signRoomSession(SECRET, session);
    expect(readRoomSessionToken(SECRET, token, 1_000_100)).toEqual(session);
    expect(readRoomSessionToken(OTHER, token, 1_000_100)).toBeNull();
    const [v, body, mac] = token.split('.');
    const forged = Buffer.from(JSON.stringify({ ...session, a: 'ST1EVIL' })).toString('base64url');
    expect(readRoomSessionToken(SECRET, `${v}.${forged}.${mac}`, 1_000_100)).toBeNull();
    expect(readRoomSessionToken(SECRET, `${v}.${body}.${'0'.repeat(64)}`, 1_000_100)).toBeNull();
    expect(readRoomSessionToken(SECRET, token, session.exp + 1)).toBeNull();
    expect(readRoomSessionToken(SECRET, `${token}.extra`, 1_000_100)).toBeNull();
    for (const junk of [null, undefined, '', 'a.b', 'v2.x.y', 42, {}]) expect(readRoomSessionToken(SECRET, junk, 1_000_100)).toBeNull();
  });

  it('uses a scoped, HttpOnly, SameSite=Strict cookie, Secure on https only', () => {
    const https = new Request('https://xtrata.xyz/casino/room/session');
    const http = new Request('http://localhost:8788/casino/room/session');
    const c = roomSessionCookie('tok', https);
    expect(c).toContain('px_room=tok');
    expect(c).toContain('Path=/casino/room');
    expect(c).toContain('HttpOnly');
    expect(c).toContain('SameSite=Strict');
    expect(c).toContain('Secure');
    expect(roomSessionCookie('tok', http)).not.toContain('Secure');
    expect(clearRoomSessionCookie(https)).toContain('Max-Age=0');
  });

  it('reads the session from a request cookie, ignoring other cookies', () => {
    const now = Date.now();
    const token = signRoomSession(SECRET, { ...session, iat: now, exp: now + 1000 });
    const req = new Request('https://xtrata.xyz/casino/room/ws', { headers: { cookie: `a=1; px_room=${encodeURIComponent(token)}; b=2` } });
    expect(readRoomSession(SECRET, req, now)?.a).toBe('ST1ABC');
    expect(readRoomSession(SECRET, new Request('https://xtrata.xyz/', { headers: { cookie: 'px_roomx=1' } }), now)).toBeNull();
    expect(readRoomSession(SECRET, new Request('https://xtrata.xyz/'), now)).toBeNull();
  });

  it('only accepts a long enough secret', () => {
    expect(secretUsable(SECRET)).toBe(true);
    expect(secretUsable('short')).toBe(false);
    expect(secretUsable(undefined)).toBe(false);
    expect(secretUsable(12345)).toBe(false);
  });
});
