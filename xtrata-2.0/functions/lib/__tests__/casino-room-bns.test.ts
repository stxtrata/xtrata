import { beforeEach, describe, expect, it } from 'vitest';
import {
  bufferCVFromString, cvToHex, getAddressFromPrivateKey, makeRandomPrivKey, noneCV, privateKeyToString,
  responseErrorCV, responseOkCV, someCV, TransactionVersion, tupleCV, uintCV
} from '@stacks/transactions';
import { BNS_NAME_CACHE_MS, BNS_NONE_CACHE_MS, clearBnsCache, mainnetTwin, parsePrimaryResult, primaryNameOf } from '../casino-room-bns';

const keyPair = () => {
  const raw = privateKeyToString(makeRandomPrivKey());
  const key = raw.length === 64 ? `${raw}01` : raw;
  return { st: getAddressFromPrivateKey(key, TransactionVersion.Testnet), sp: getAddressFromPrivateKey(key, TransactionVersion.Mainnet) };
};
const primary = (name: string, ns: string) => cvToHex(responseOkCV(someCV(tupleCV({ name: bufferCVFromString(name), namespace: bufferCVFromString(ns) }))));
const NONE = cvToHex(responseOkCV(noneCV()));
const ERR = cvToHex(responseErrorCV(uintCV(131)));
const reply = (result: string, status = 200, okay = true) => async () => new Response(JSON.stringify({ okay, result }), { status });

beforeEach(() => clearBnsCache());

describe('the mainnet twin of an address', () => {
  it('turns ST into SP for the same key, and leaves a mainnet address as it is', () => {
    const { st, sp } = keyPair();
    expect(mainnetTwin(st)).toBe(sp);
    expect(mainnetTwin(sp)).toBe(sp);
    expect(mainnetTwin('not an address')).toBeNull();
  });
});

describe('reading get-primary', () => {
  it('a primary name', () => expect(parsePrimaryResult(primary('jim', 'btc'))).toEqual({ ok: true, name: 'jim.btc' }));
  it('lower-cases it', () => expect(parsePrimaryResult(primary('Jim', 'BTC'))).toEqual({ ok: true, name: 'jim.btc' }));
  it('no primary name: (ok none) and a contract error both mean "no name"', () => {
    expect(parsePrimaryResult(NONE)).toEqual({ ok: true, name: null });
    expect(parsePrimaryResult(ERR)).toEqual({ ok: true, name: null });
  });
  it('anything unreadable is a failed read, not "no name"', () => {
    expect(parsePrimaryResult('0xzz')).toEqual({ ok: false });
    expect(parsePrimaryResult(cvToHex(uintCV(5)))).toEqual({ ok: false });
    expect(parsePrimaryResult(primary('bad name!', 'btc'))).toEqual({ ok: false });
  });
});

describe('looking a player up', () => {
  it('asks get-primary for the mainnet twin and returns the name', async () => {
    const { st, sp } = keyPair();
    let asked = '';
    const fetcher = async (url: string, init?: RequestInit) => { asked = url + ' ' + String(init?.body); return new Response(JSON.stringify({ okay: true, result: primary('jim', 'btc') })); };
    expect(await primaryNameOf(st, {}, { fetcher })).toEqual({ name: 'jim.btc', checked: true });
    expect(asked).toContain('/v2/contracts/call-read/SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF/BNS-V2/get-primary');
    expect(asked).toContain(sp);
  });

  it('no name is a checked answer', async () => {
    expect(await primaryNameOf(keyPair().st, {}, { fetcher: reply(NONE) })).toEqual({ name: null, checked: true });
  });

  it('a failing API, an unreadable answer or a network error is "could not check"', async () => {
    expect(await primaryNameOf(keyPair().st, {}, { fetcher: reply(NONE, 503) })).toEqual({ name: null, checked: false });
    expect(await primaryNameOf(keyPair().st, {}, { fetcher: reply('0x00', 200) })).toEqual({ name: null, checked: false });
    expect(await primaryNameOf(keyPair().st, {}, { fetcher: reply(NONE, 200, false) })).toEqual({ name: null, checked: false });
    expect(await primaryNameOf(keyPair().st, {}, { fetcher: async () => { throw new Error('offline'); } })).toEqual({ name: null, checked: false });
    expect(await primaryNameOf('nonsense', {}, { fetcher: reply(NONE) })).toEqual({ name: null, checked: false });
  });

  it('can be switched off: no network, "could not check"', async () => {
    let called = false;
    expect(await primaryNameOf(keyPair().st, { CASINO_ROOM_BNS_LOOKUP: 'off' }, { fetcher: async () => { called = true; return new Response(''); } })).toEqual({ name: null, checked: false });
    expect(called).toBe(false);
  });

  it('gives up after 3 seconds in all, however many ways there are left to try', async () => {
    const hang = (_url: string, init?: RequestInit) => new Promise<Response>((_r, reject) => init?.signal?.addEventListener('abort', () => reject(new Error('aborted'))));
    const t = Date.now();
    expect(await primaryNameOf(keyPair().st, {}, { fetcher: hang })).toEqual({ name: null, checked: false });
    const took = Date.now() - t;
    expect(took).toBeGreaterThanOrEqual(2_900); expect(took).toBeLessThan(4_500);
  }, 10_000);

  it('tries the second API when the first fails', async () => {
    let n = 0;
    const fetcher = async (url: string) => { n += 1; return url.startsWith('https://api.mainnet.hiro.so') ? new Response('', { status: 502 }) : new Response(JSON.stringify({ okay: true, result: primary('a', 'btc') })); };
    expect(await primaryNameOf(keyPair().st, {}, { fetcher })).toEqual({ name: 'a.btc', checked: true });
    expect(n).toBe(2);
  });

  it('sends the first Hiro key when there is one, and tries without it if that fails', async () => {
    const seen: (string | null)[] = [];
    const fetcher = async (_url: string, init?: RequestInit) => {
      const h = new Headers(init?.headers); seen.push(h.get('x-api-key') || h.get('x-hiro-api-key'));
      return seen.length === 1 ? new Response('', { status: 429 }) : new Response(JSON.stringify({ okay: true, result: NONE }));
    };
    expect(await primaryNameOf(keyPair().st, { HIRO_API_KEY: 'k1' }, { fetcher })).toEqual({ name: null, checked: true });
    expect(seen[0]).toBe('k1');
    expect(seen[1]).toBeNull();
  });

  it('remembers a name for 10 minutes and "no name" for 30 seconds; never remembers a failed read', async () => {
    const { st } = keyPair();
    let calls = 0;
    const named = async () => { calls += 1; return new Response(JSON.stringify({ okay: true, result: primary('x', 'btc') })); };
    await primaryNameOf(st, {}, { fetcher: named, now: 1_000 });
    await primaryNameOf(st, {}, { fetcher: named, now: 1_000 + BNS_NAME_CACHE_MS - 1 });
    expect(calls).toBe(1);
    await primaryNameOf(st, {}, { fetcher: named, now: 1_000 + BNS_NAME_CACHE_MS + 1 });
    expect(calls).toBe(2);
    await primaryNameOf(st, {}, { fetcher: named, now: 1_000 + BNS_NAME_CACHE_MS + 2, fresh: true });
    expect(calls).toBe(3);

    const other = keyPair().st; let n2 = 0;
    const none = async () => { n2 += 1; return new Response(JSON.stringify({ okay: true, result: NONE })); };
    await primaryNameOf(other, {}, { fetcher: none, now: 5_000 });
    await primaryNameOf(other, {}, { fetcher: none, now: 5_000 + BNS_NONE_CACHE_MS - 1 });
    expect(n2).toBe(1);
    await primaryNameOf(other, {}, { fetcher: none, now: 5_000 + BNS_NONE_CACHE_MS + 1 });
    expect(n2).toBe(2);

    const third = keyPair().st; let n3 = 0;
    const broken = async () => { n3 += 1; return new Response('', { status: 500 }); };
    await primaryNameOf(third, {}, { fetcher: broken, now: 9_000 });
    const before = n3;
    await primaryNameOf(third, {}, { fetcher: broken, now: 9_001 });
    expect(n3).toBeGreaterThan(before);
  });
});
