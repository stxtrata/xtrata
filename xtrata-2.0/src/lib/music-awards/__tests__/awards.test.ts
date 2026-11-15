import { describe, expect, it } from 'vitest';
import { createStacksPrivateKey, getPublicKey, makeRandomPrivKey, privateKeyToString, publicKeyToString } from '@stacks/transactions';
import { sha256 } from '@noble/hashes/sha256';
import { ripemd160 } from '@noble/hashes/ripemd160';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { AWARD_CLASS, awardSeed, buildRecord, cleanAwardName, recordHash } from '../record';
import { noteHash, noteSignerHash, signNote, type NoteFields } from '../note';

// What the testnet rehearsal of 14 Nov 2026 really inscribed and what its award contract really accepted
// (docs/music/AWARDS-INSCRIPTION.md). Public values only: addresses, bytes, a signature and the hash of the signer's
// public key. The claim was transaction 0x644564b98d7ac0fed7ec2e2a65ea0aaa42557107e0f7484fe503d313161754a2, result (ok (tuple (edition u1) (token-id u2))).
const GOLD = "<!doctype html><meta charset=utf-8><title>Xtrata Music Hero \u00b7 Gold record No. 0412 \u00b7 rehearsal.btc</title><style>html,body,iframe{margin:0;width:100%;height:100%;border:0;background:#040509}</style><iframe src=\"/i/0#n=412&a=STEBG9DC7MDA88G8TKKF86T9X5M0CMV4GXXV8J4B&b=rehearsal.btc&p=50&s=10e7969e\"></iframe>";
const DIAMOND = "<!doctype html><meta charset=utf-8><title>Xtrata Music Hero \u00b7 Diamond record No. 0007</title><style>html,body,iframe{margin:0;width:100%;height:100%;border:0;background:#040509}</style><iframe src=\"/i/1#n=7&a=ST2294HSREF13E7W9N7ATV92WPTWH4NM9FKHGMH41&p=100&s=e35862cf\"></iframe>";
const ACCEPTED = {
  contract: 'ST3AJFSWVCH8CGTRVH81GD1X83S7H46QZCBB0TJ1H.xtrata-music-awards-v1-0', hero: 'STEBG9DC7MDA88G8TKKF86T9X5M0CMV4GXXV8J4B', chain: 2147483648, cls: 2, drop: 1, number: 412, plays: 50,
  recordHash: 'a190640bdb80096a5e10a0fe5e324f6c90abf45f1c3723a94636a369045847d7', noteHash: '36f79c9770b97cd743a97b243c8a3a5f0fe08721bc2596da6a3450e9cba0fa50',
  signature: '7ce891dce53cd5a9a7ed9be5597d9b5461beaec191b30ed8874fa9ec5fa184226f153e73f638a5d22522e11acb2fffcb9ea3428d4874d174a78a2b82d90e279e01',
  signerHash: '1ed3a0d9df8d8336b7a0d2b531841bfea1db5e80'
};
const text = (b: Uint8Array) => new TextDecoder().decode(b);

describe('a Music Hero record', () => {
  it('is byte-for-byte the two records inscribed in the testnet rehearsal', () => {
    expect(text(buildRecord({ template: 0, cls: 'gold', hero: ACCEPTED.hero, number: 412, plays: 50, name: 'rehearsal.btc', drop: 1 }))).toBe(GOLD);
    expect(text(buildRecord({ template: 1, cls: 'diamond', hero: 'ST2294HSREF13E7W9N7ATV92WPTWH4NM9FKHGMH41', number: 7, plays: 100, name: null, drop: 1 }))).toBe(DIAMOND);
    expect(bytesToHex(recordHash(new TextEncoder().encode(GOLD)))).toBe(ACCEPTED.recordHash);
    expect(AWARD_CLASS.gold).toBe(ACCEPTED.cls);
  });

  it('the seed depends on the drop, the number and the hero, and on nothing else', () => {
    const s = awardSeed(1, 412, ACCEPTED.hero);
    expect(s).toMatch(/^[0-9a-f]{8}$/);
    expect(GOLD).toContain('&s=' + s);
    expect(awardSeed(1, 412, ACCEPTED.hero)).toBe(s);
    for (const other of [awardSeed(2, 412, ACCEPTED.hero), awardSeed(1, 413, ACCEPTED.hero), awardSeed(1, 412, 'ST2294HSREF13E7W9N7ATV92WPTWH4NM9FKHGMH41')]) expect(other).not.toBe(s);
  });

  it('only a plain name can go on a plaque, and nothing else can be smuggled into a record', () => {
    expect(cleanAwardName(' Jim.BTC ')).toBe('jim.btc');
    for (const bad of ['', 'jim', 'jim.btc&p=9999', 'a b.btc', '<b>.btc', 'jim.btc#x', 'jim..btc', '.btc', 'x'.repeat(40) + '.btc', 7, null, undefined]) expect(cleanAwardName(bad)).toBeNull();
    const ok = { template: 5, cls: 'classic' as const, hero: 'SP1SY289GQAHCH7JZ1MSS5VMPNPH8GEK2DPRKKJ6N', number: 1, plays: 5, name: null, drop: 1 };
    expect(buildRecord(ok).length).toBeLessThan(400);
    for (const bad of [{ name: 'jim.btc"><script>' }, { hero: 'SP1"onload=' }, { number: 0 }, { number: 1.5 }, { plays: 0 }, { template: -1 }, { cls: 'platinum' as never }])
      expect(() => buildRecord({ ...ok, ...bad })).toThrow();
  });
});

describe('the note the award contract checks', () => {
  const fields: NoteFields = { chain: ACCEPTED.chain, contract: ACCEPTED.contract, drop: ACCEPTED.drop, cls: ACCEPTED.cls, number: ACCEPTED.number, plays: ACCEPTED.plays, hero: ACCEPTED.hero, recordHash: hexToBytes(ACCEPTED.recordHash) };

  it('hashes exactly as the contract did on testnet: the signature it accepted recovers its signer from our hash', () => {
    expect(noteHash(fields)).toBe(ACCEPTED.noteHash);
    expect(noteSignerHash(fields, ACCEPTED.signature)).toBe(ACCEPTED.signerHash);
  });

  it('a note signed here recovers to the signing key, in the 65-byte form the contract takes', () => {
    const key = privateKeyToString(makeRandomPrivKey()).slice(0, 64) + '01'; // compressed, as the contract recovers it
    const sig = signNote(fields, key);
    expect(sig).toMatch(/^[0-9a-f]{130}$/);
    const mine = bytesToHex(ripemd160(sha256(hexToBytes(publicKeyToString(getPublicKey(createStacksPrivateKey(key)))))));
    expect(noteSignerHash(fields, sig)).toBe(mine);
  });

  it('changing any field gives a different note, so a note is good for one hero, number, class, plays and record only', () => {
    const base = noteHash(fields);
    const changed: Partial<NoteFields>[] = [{ chain: 1 }, { contract: ACCEPTED.contract + '-x' }, { drop: 2 }, { cls: 1 }, { number: 413 }, { plays: 51 },
      { hero: 'ST2294HSREF13E7W9N7ATV92WPTWH4NM9FKHGMH41' }, { recordHash: new Uint8Array(32) }];
    for (const c of changed) {
      expect(noteHash({ ...fields, ...c })).not.toBe(base);
      expect(noteSignerHash({ ...fields, ...c }, ACCEPTED.signature)).not.toBe(ACCEPTED.signerHash);
    }
  });
});
