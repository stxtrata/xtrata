import { describe, expect, it } from 'vitest';
import { createStacksPrivateKey, getAddressFromPrivateKey, makeRandomPrivKey, privateKeyToString, signMessageHashRsv, TransactionVersion } from '@stacks/transactions';
import { playerHash, type PlayerDefinition } from '../../listening-wallet/gift-players';
import {
  RELEASE_DOMAIN, releaseDigest, SHELF_DOMAIN, shelfDigest, signShelfRequest, validateReleaseRequest, validateShelfRequest, verifyReleaseSignature, verifyShelfSignature,
  type ReleaseRequest, type ShelfRequest
} from '../release';

const key = () => privateKeyToString(makeRandomPrivKey()).slice(0, 64) + '01';
const addr = (k: string) => getAddressFromPrivateKey(k, TransactionVersion.Mainnet);
const T = 1_800_000_000_000;
const def: PlayerDefinition = { title: 'Reload', subtitle: 'melophonic', tracks: [315, 319], cover: null };

describe('releasing music: the artist’s signature', () => {
  const k = key(), artist = addr(k);
  const req: ReleaseRequest = { artist, hash: playerHash(def), issued: T };
  const sign = (r: ReleaseRequest, pk = k) => signMessageHashRsv({ messageHash: releaseDigest(r), privateKey: createStacksPrivateKey(pk) }).data;

  it('covers the whole release and only the artist’s wallet can make it', () => {
    expect(verifyReleaseSignature(req, sign(req))).toBe(true);
    expect(verifyReleaseSignature(req, sign(req, key()))).toBe(false);
    expect(verifyReleaseSignature({ ...req, hash: playerHash({ ...def, tracks: [315] }) }, sign(req))).toBe(false);
    expect(verifyReleaseSignature({ ...req, issued: T + 1 }, sign(req))).toBe(false);
    for (const bad of [undefined, '', 'zz', 5]) expect(verifyReleaseSignature(req, bad)).toBe(false);
  });
  it('must be for this exact release, recent, and from a mainnet wallet', () => {
    expect(validateReleaseRequest(req, def, T + 1000)).toEqual(req);
    expect(() => validateReleaseRequest(req, { ...def, title: 'Other' }, T)).toThrow(/different release/);
    expect(() => validateReleaseRequest(req, def, T + 16 * 60_000)).toThrow(/expired/);
    expect(() => validateReleaseRequest({ ...req, issued: T + 120_000 }, def, T)).toThrow(/expired/);
    expect(() => validateReleaseRequest({ ...req, artist: 'ST2294HSREF13E7W9N7ATV92WPTWH4NM9FKHGMH41' }, def, T)).toThrow(/address/);
  });
});

describe('a player’s shelf: the player’s signature', () => {
  const k = key(), player = addr(k);
  const req: ShelfRequest = { action: 'add', release: '0123456789abcdef', player, issued: T };

  it('only the player’s own key can change or read its shelf, and a signature is good for one action on one album', () => {
    const sig = signShelfRequest(req, k);
    expect(verifyShelfSignature(req, sig)).toBe(true);
    expect(verifyShelfSignature(req, signShelfRequest(req, key()))).toBe(false);
    for (const other of [{ action: 'remove' as const }, { release: 'fedcba9876543210' }, { issued: T + 1 }, { player: addr(key()) }]) expect(verifyShelfSignature({ ...req, ...other }, sig)).toBe(false);
  });
  it('accepts only the five actions, a real album id (none for a list), a mainnet player and a recent time', () => {
    expect(validateShelfRequest(req, T)).toEqual(req);
    expect(validateShelfRequest({ action: 'list', release: '', player, issued: T }, T).action).toBe('list');
    for (const bad of [{ action: 'steal' }, { release: 'nope' }, { release: '' }, { player: 'jim.btc' }, { issued: T - 6 * 60_000 }, { issued: T + 120_000 }])
      expect(() => validateShelfRequest({ ...req, ...bad } as ShelfRequest, T)).toThrow();
    expect(() => validateShelfRequest({ action: 'list', release: '0123456789abcdef', player, issued: T }, T)).toThrow();
  });
  it('is its own kind of message: not a release, not a wallet link, never a transaction', () => {
    expect(SHELF_DOMAIN).not.toBe(RELEASE_DOMAIN);
    expect(shelfDigest(req)).not.toBe(releaseDigest({ artist: player, hash: req.release, issued: T }));
  });
});
