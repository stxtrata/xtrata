import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';
import {
  cvToHex, getAddressFromPrivateKey, makeRandomPrivKey, noneCV, privateKeyToString, responseErrorCV, responseOkCV, someCV,
  standardPrincipalCV, TransactionVersion, uintCV
} from '@stacks/transactions';
import { SCREEN_FACES, SCREENS_CONTRACT, SCREENS_FEATURE, SCREENS_MAX, SCREENS_PATTERN, encodeScreens, normalizeScreens, parseScreens, screenIds } from '../casino-screens';
import { checkScreens, ownerOf, parseOwnerResult } from '../casino-room-screens';
import { ROOM_FEATURES, applyLook, applyScreens, deriveView, newPeer, roomMessage } from '../casino-room';
import { REACTIONS, SOCIAL_FEATURES, parseSocialMessage } from '../casino-social';

const keyPair = () => {
  const raw = privateKeyToString(makeRandomPrivKey());
  const key = raw.length === 64 ? `${raw}01` : raw;
  return { st: getAddressFromPrivateKey(key, TransactionVersion.Testnet), sp: getAddressFromPrivateKey(key, TransactionVersion.Mainnet) };
};
const owner = (address: string) => cvToHex(responseOkCV(someCV(standardPrincipalCV(address))));
const NOBODY = cvToHex(responseOkCV(noneCV()));
const CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';

describe('the screens string', () => {
  it('reads and writes one canonical form', () => {
    expect(parseScreens('b12,l340,t7')).toEqual({ b: 12, l: 340, t: 7 });
    expect(encodeScreens({ t: 7, b: 12, l: 340 })).toBe('b12,l340,t7');
    expect(normalizeScreens('t7,b12')).toBe('b12,t7');         // any order in, one order out
    expect(normalizeScreens('')).toBe(''); expect(normalizeScreens(null)).toBe(''); expect(normalizeScreens(undefined)).toBe('');
    expect(parseScreens('u0')).toEqual({ u: 0 });              // token ids start at 0
    expect(parseScreens('f9')).toEqual({ f: 9 });              // the front (the face) is a screen like the others
    expect(encodeScreens({ u: 5, b: 2, f: 1 })).toBe('f1,b2,u5');
    expect(normalizeScreens('u6,t5,r4,l3,b2,f1')).toBe('f1,b2,l3,r4,t5,u6');      // all six
    expect(screenIds({ b: 5, l: 5, t: 9 })).toEqual([5, 9]);
  });
  it('refuses everything else', () => {
    for (const bad of [7, {}, 'b', 'b-1', 'b01', 'x12', 'p12', 'F12', 'b12,', ',b12', 'b12,b13', 'f1,f2', 'b12;l3', 'b1234567890', 'b12 ', ' b12', 'B12', 'b12,l3,r4,t5,u6,b7', 'f1,b2,l3,r4,t5,u6,f7', 'b1<script>', 'b12\n'])
      expect(parseScreens(bad), String(bad)).toBeNull();
  });
  it('never grows past the limit', () => {
    const full = SCREEN_FACES.map((f) => `${f}999999999`).join(',');
    expect(full.length).toBe(SCREENS_MAX);
    expect(normalizeScreens(full)).toBe(full);
  });
  it('shows inscriptions from the newest mainnet core only', () => { expect(SCREENS_CONTRACT).toBe(CONTRACT); });
});

describe('the page and the room agree on what screens are', () => {
  const source = readFileSync(join(__dirname, '../../../public/casino/cube-avatars.js'), 'utf8');
  const sandbox: any = { window: {}, console };
  vm.runInNewContext(source, sandbox);
  const PX = sandbox.window.PXCubes;
  it('has the same faces, pattern and limit', () => {
    expect([...PX.SCREEN_FACES]).toEqual([...SCREEN_FACES]);
    expect(PX.SCREENS_PATTERN.source).toBe(SCREENS_PATTERN.source);
    expect(PX.SCREENS_MAX).toBe(SCREENS_MAX);
  });
  it('accepts, refuses and writes the same strings', () => {
    for (const s of ['', 'b12', 'f9', 'b12,l340,t7', 't7,b12,f1', 'u0', 'b12,b13', 'f1,f2', 'b01', 'x1', 'b1234567890', 'b1,l2,r3,t4,u5', 'b1,l2,r3,t4,u5,b6', 'u6,t5,r4,l3,b2,f1', 'f1,b2,l3,r4,t5,u6,f7']) {
      const room = parseScreens(s), page = PX.parseScreens(s);
      expect(page === null, s).toBe(room === null);
      if (room) { expect({ ...page }).toEqual(room); expect(PX.encodeScreens(page)).toBe(encodeScreens(room)); }
    }
  });
  it('only ever asks this site for a still picture', () => {
    const src = (t: any, lite = false) => PX.pictureSource(CONTRACT, t, lite, '');
    expect(src({ id: 5, mime: 'image/png', totalSize: 9000, thumb: '9f2c1ab4d0e57718' }).url).toBe(`/thumb/${encodeURIComponent(CONTRACT)}/5?v=9f2c1ab4d0e57718`);
    expect(src({ id: 5, mime: 'image/png', totalSize: 9000, thumb: null }).url).toBe(`/runtime/content?contractId=${encodeURIComponent(CONTRACT)}&tokenId=5&network=mainnet`);
    expect(src({ id: 5, mime: 'image/png', totalSize: 9_000_000 }).url).toBeNull();                 // too big to put on a cube
    expect(src({ id: 5, mime: 'image/png', totalSize: 900_000 }, true).url).toBeNull();            // and a phone's limit is lower
    for (const mime of ['image/svg+xml', 'text/html', 'audio/mpeg', 'video/mp4', 'application/json', '', null]) expect(src({ id: 5, mime, totalSize: 900 }).url, String(mime)).toBeNull();
    expect(src({ id: 5, mime: 'audio/mpeg', totalSize: 900 }).kind).toBe('AUDIO');
    expect(src({ id: 5, mime: 'image/png', totalSize: 900, thumb: '../../x' }).url).toContain('/runtime/content?');   // an odd version is not put in a URL
  });
});

describe('reading who holds an inscription', () => {
  const { st, sp } = keyPair(), other = keyPair();
  it('reads an owner, nobody, and a failed read as three different answers', () => {
    expect(parseOwnerResult(owner(sp))).toEqual({ ok: true, owner: sp });
    expect(parseOwnerResult(NOBODY)).toEqual({ ok: true, owner: null });
    expect(parseOwnerResult(cvToHex(responseErrorCV(uintCV(1))))).toEqual({ ok: false });
    expect(parseOwnerResult('0xnonsense')).toEqual({ ok: false });
    expect(parseOwnerResult(cvToHex(responseOkCV(uintCV(3))))).toEqual({ ok: false });
  });
  const chain = (owners: Record<number, string | null>, fail: number[] = []) => {
    const calls: string[] = [];
    const fetcher = async (input: string, init?: RequestInit) => {
      calls.push(input);
      const id = Number(BigInt('0x' + JSON.parse(String(init?.body)).arguments[0].slice(-32)));
      if (fail.includes(id)) return new Response('busy', { status: 429 });
      const who = owners[id];
      return Response.json({ okay: true, result: who ? owner(who) : NOBODY });
    };
    return { fetcher, calls };
  };
  it('asks the newest core contract on mainnet', async () => {
    const { fetcher, calls } = chain({ 12: sp });
    expect(await ownerOf(CONTRACT, 12, {}, { fetcher })).toEqual({ ok: true, owner: sp });
    expect(calls[0]).toMatch(/^https:\/\/api\.(mainnet\.)?hiro\.so\/v2\/contracts\/call-read\/SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X\/xtrata-v3-2-3\/get-owner$/);
  });
  it('lets the mainnet twin of the signed-in address show what it holds', async () => {
    const { fetcher } = chain({ 12: sp, 340: sp });
    expect(await checkScreens(st, 'l340,b12', {}, { fetcher })).toEqual({ ok: true, sc: 'b12,l340' });
  });
  it('refuses what somebody else holds, and what nobody holds, naming them', async () => {
    const { fetcher } = chain({ 12: sp, 340: other.sp, 7: null });
    expect(await checkScreens(st, 'b12,l340,t7', {}, { fetcher })).toEqual({ ok: false, code: 'screens-not-yours', ids: [340, 7] });
  });
  it('says "could not check" when the chain cannot be read: never "not yours", never "yours"', async () => {
    const { fetcher } = chain({ 12: sp, 340: sp }, [340]);
    expect(await checkScreens(st, 'b12,l340', {}, { fetcher })).toEqual({ ok: false, code: 'screens-could-not-check' });
    const down = async () => { throw new Error('offline'); };
    expect(await checkScreens(st, 'b12', {}, { fetcher: down })).toEqual({ ok: false, code: 'screens-could-not-check' });
  });
  it('needs no chain to clear the screens, and none for a bad string', async () => {
    const never = async () => { throw new Error('must not be asked'); };
    expect(await checkScreens(st, '', {}, { fetcher: never })).toEqual({ ok: true, sc: '' });
    expect(await checkScreens(st, 'b12,b13', {}, { fetcher: never })).toEqual({ ok: false, code: 'screens-bad' });
    expect(await checkScreens('', 'b12', {}, { fetcher: never })).toEqual({ ok: false, code: 'screens-no-address' });
  });
  it('can be switched off, which still lets a player clear theirs', async () => {
    const { fetcher } = chain({ 12: sp });
    expect(await checkScreens(st, 'b12', { CASINO_SCREENS_DISABLED: '1' }, { fetcher })).toEqual({ ok: false, code: 'screens-off' });
    expect(await checkScreens(st, '', { CASINO_SCREENS_DISABLED: '1' }, { fetcher })).toEqual({ ok: true, sc: '' });
  });
});

describe('screens in the room', () => {
  const A = 'ST2SMCB4CV776FCP9A2EK0ZM37NAXM1MFJMMX9DW8', B = 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA';
  const peers = () => [newPeer('1', A, 'ka', 0), newPeer('2', A, 'ka', 0), newPeer('3', B, 'kb', 0), newPeer('4', null, null, 0, true), newPeer('5', null, null, 0, false)];
  it('is a feature the room lists', () => { expect(ROOM_FEATURES).toContain(SCREENS_FEATURE); });
  it('sets every connection of the player and tells everyone who can see the room, the player included', () => {
    const list = peers(); applyLook(list, '1', 'h000n-4ed5bd');
    const r = applyScreens(list, A, 't7,b12');
    expect(r.ok).toBe(true); if (!r.ok) return;
    expect(r.sc).toBe('b12,t7');
    expect(r.message).toEqual({ t: 'look', a: A, v: 'h000n-4ed5bd', sc: 'b12,t7' });
    expect(r.changed.sort()).toEqual(['1', '2']);
    expect(r.to.sort()).toEqual(['1', '2', '3', '4']);           // not the guest who may not watch
    expect(list[0].sc).toBe('b12,t7'); expect(list[1].sc).toBe('b12,t7'); expect(list[2].sc).toBeUndefined();
    expect(deriveView(list).players.find((p) => p.a === A)?.sc).toBe('b12,t7');
    expect((roomMessage(list, list[2], 1, ROOM_FEATURES) as any).players.find((p: any) => p.a === A).sc).toBe('b12,t7');
  });
  it('takes the front screen like any other', () => {
    const list = peers(); applyLook(list, '1', 'h000n-4ed5bd');
    const r = applyScreens(list, A, 'b12,f9');
    expect(r.ok && r.message).toEqual({ t: 'look', a: A, v: 'h000n-4ed5bd', sc: 'f9,b12' });
  });
  it('clears with an empty string', () => {
    const list = peers(); applyLook(list, '1', 'h000n-4ed5bd'); applyScreens(list, A, 'b12');
    const r = applyScreens(list, A, '');
    expect(r.ok && r.message).toEqual({ t: 'look', a: A, v: 'h000n-4ed5bd', sc: null });
    expect(list[0].sc).toBeUndefined();
    expect(deriveView(list).players.find((p) => p.a === A)?.sc).toBeUndefined();
  });
  it('keeps them through a change of look, and lists them only while the player is a cube', () => {
    const list = peers(); applyScreens(list, A, 'b12');
    expect(deriveView(list).players.find((p) => p.a === A)?.sc).toBeUndefined();        // a human figure has no screens to show
    const cube = applyLook(list, '1', 'f000n-4ed5bd');
    expect(cube.ok && cube.message).toEqual({ t: 'look', a: A, v: 'f000n-4ed5bd', sc: 'b12' });
    expect(deriveView(list).players.find((p) => p.a === A)?.sc).toBe('b12');
  });
  it('works for a player who is not connected (the profile is still written), and refuses a bad string', () => {
    const list = peers();
    const r = applyScreens(list, 'ST3NOTHERE', 'b12');
    expect(r.ok && r.changed).toEqual([]);
    expect(applyScreens(list, A, 'b12,b13')).toEqual({ ok: false, code: 'screens-bad' });
    expect(applyScreens(list, '', 'b12')).toEqual({ ok: false, code: 'screens-no-address' });
  });
});

describe('the later reactions', () => {
  it('are taken by a room that says so', () => {
    expect(SOCIAL_FEATURES).toContain('react-more');
    for (const e of ['heart', 'dance', 'bow']) expect(REACTIONS).toContain(e);
    expect(parseSocialMessage({ t: 'react', e: 'dance' })).toMatchObject({ ok: true });
    expect(parseSocialMessage({ t: 'react', e: 'moonwalk' })).toMatchObject({ ok: false, code: 'react-bad' });
  });
  it('are all gestures a cube character knows', () => {
    const sandbox: any = { window: {}, console };
    vm.runInNewContext(readFileSync(join(__dirname, '../../../public/casino/cube-avatars.js'), 'utf8'), sandbox);
    const page = readFileSync(join(__dirname, '../../../public/casino/index.html'), 'utf8');
    const map = /const CUBE_GEST = (\{[^}]+\});/.exec(page);
    expect(map).not.toBeNull();
    const cubeGest = vm.runInNewContext('(' + map![1] + ')') as Record<string, string>;
    expect(Object.keys(cubeGest).sort()).toEqual([...REACTIONS].sort());
    for (const g of Object.values(cubeGest)) expect(sandbox.window.PXCubes.GESTURES, g).toContain(g);
  });
});
