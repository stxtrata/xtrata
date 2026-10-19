// Poster and world contracts against the real core contract (not the mock).
// Run: node scripts/make-realcore.mjs && cd integration && node --test real-core.test.mjs
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { initSimnet } from '@stacks/clarinet-sdk';
import { Cl } from '@stacks/transactions';

const pp = (cv) => Cl.prettyPrint(cv);
let simnet, deployer, other;
const finalHash = (chunks) => {
  let run = Buffer.alloc(32, 0);
  for (const c of chunks) run = createHash('sha256').update(Buffer.concat([run, c])).digest();
  return run;
};
function inscribe(sender, bytes) {
  const chunks = [Buffer.from(bytes)];
  const hash = finalHash(chunks);
  const r = simnet.callPublicFn('xtrata-v3-2-3', 'mint-single-tx',
    [Cl.buffer(hash), Cl.stringAscii('image/webp'), Cl.uint(bytes.length), Cl.list(chunks.map((c) => Cl.buffer(c))), Cl.stringAscii('data:text/plain,poster')], sender);
  return { hash, size: bytes.length, result: r.result };
}
const tpl = (extra) => Cl.tuple({
  set: Cl.uint(1), kind: Cl.uint(1), head: Cl.stringAscii('PIC'), sub: Cl.stringAscii(''), foot: Cl.stringAscii(''),
  colour: Cl.stringAscii(''), art: Cl.stringAscii(''), 'image-id': Cl.uint(extra.id), 'image-hash': Cl.buffer(extra.hash),
  'image-size': Cl.uint(extra.size), cols: Cl.uint(0), frames: Cl.uint(0), fps: Cl.uint(0), 'act-kind': Cl.uint(0),
  'act-id': Cl.uint(0), 'act-text': Cl.stringAscii(''), weight: Cl.uint(5),
  'start-day': Cl.uint(Math.floor(simnet.burnBlockHeight / 144) + 1),
  'end-day': Cl.uint(Math.floor(simnet.burnBlockHeight / 144) + 5), scope: Cl.list([]), evergreen: Cl.bool(false), payout: Cl.none(),
});

before(async () => {
  simnet = await initSimnet('./Clarinet.toml');
  const A = simnet.getAccounts();
  deployer = A.get('deployer'); other = A.get('wallet_1');
});

test('a poster can point at a real sealed inscription, and only its creator may use it', () => {
  const pic = inscribe(deployer, Buffer.from('RIFF....WEBPfake-image-bytes'));
  assert.equal(pic.result.type, 'ok', pp(pic.result));
  const id = Number(pic.result.value.value['token-id'].value);
  const args = { id, hash: pic.hash, size: pic.size };
  const r = simnet.callPublicFn('xtrata-posters-v1', 'add-poster', [tpl(args)], deployer);
  assert.match(pp(r.result), /^\(ok u\d+\)$/, pp(r.result));
  assert.equal(pp(simnet.callPublicFn('xtrata-posters-v1', 'add-poster', [tpl({ ...args, size: pic.size + 1 })], deployer).result), '(err u106)');
  assert.equal(pp(simnet.callPublicFn('xtrata-posters-v1', 'add-poster', [tpl({ ...args, hash: Buffer.alloc(32, 1) })], deployer).result), '(err u106)');
  assert.equal(pp(simnet.callPublicFn('xtrata-posters-v1', 'add-poster', [tpl({ ...args, id: id + 50 })], deployer).result), '(err u106)');
  // not the creator: make it a publisher so the creator check (not the role) is what refuses
  simnet.callPublicFn('xtrata-posters-v1', 'set-publisher', [Cl.principal(other), Cl.bool(true)], deployer);
  assert.equal(pp(simnet.callPublicFn('xtrata-posters-v1', 'add-poster', [tpl(args)], other).result), '(err u106)');
});

test('a world look can use a real sealed recipe inscription', () => {
  const rec = inscribe(deployer, Buffer.from('{"shape":"door","panels":4}'));
  const id = Number(rec.result.value.value['token-id'].value);
  const r = simnet.callPublicFn('xtrata-world-v1', 'register-look',
    [Cl.uint(0), Cl.stringAscii('Recipe door'), Cl.uint(1), Cl.stringAscii(''), Cl.uint(id), Cl.buffer(rec.hash), Cl.uint(rec.size)], deployer);
  assert.match(pp(r.result), /^\(ok u\d+\)$/, pp(r.result));
  const bad = simnet.callPublicFn('xtrata-world-v1', 'register-look',
    [Cl.uint(0), Cl.stringAscii('Wrong size'), Cl.uint(1), Cl.stringAscii(''), Cl.uint(id), Cl.buffer(rec.hash), Cl.uint(rec.size + 1)], deployer);
  assert.equal(pp(bad.result), '(err u206)');
});

test('a door skin recipe can be a real sealed inscription, and only its creator may register it', () => {
  const rec = inscribe(deployer, Buffer.from('{"format":"door-skin-recipe/1","base":"#8a5a2b"}'));
  assert.equal(rec.result.type, 'ok', pp(rec.result));
  const id = Number(rec.result.value.value['token-id'].value);
  const args = (key, o = {}) => [Cl.stringAscii(key), Cl.stringAscii('Recipe skin'), Cl.uint(0), Cl.uint(1), Cl.stringAscii(''),
    Cl.uint(o.id ?? id), Cl.buffer(o.hash ?? rec.hash), Cl.uint(o.size ?? rec.size), Cl.uint(16383), Cl.uint(0), Cl.stringAscii('wood'), Cl.stringAscii('brass'), Cl.uint(0)];
  const r = simnet.callPublicFn('xtrata-door-skins-v1', 'register-skin', args('recipe-oak'), deployer);
  assert.match(pp(r.result), /^\(ok u\d+\)$/, pp(r.result));
  assert.equal(pp(simnet.callPublicFn('xtrata-door-skins-v1', 'register-skin', args('recipe-bad-size', { size: rec.size + 1 }), deployer).result), '(err u305)');
  assert.equal(pp(simnet.callPublicFn('xtrata-door-skins-v1', 'register-skin', args('recipe-bad-hash', { hash: Buffer.alloc(32, 7) }), deployer).result), '(err u305)');
  assert.equal(pp(simnet.callPublicFn('xtrata-door-skins-v1', 'register-skin', args('recipe-no-such', { id: id + 80 }), deployer).result), '(err u305)');
  simnet.callPublicFn('xtrata-door-skins-v1', 'set-publisher', [Cl.principal(other), Cl.bool(true)], deployer);
  assert.equal(pp(simnet.callPublicFn('xtrata-door-skins-v1', 'register-skin', args('recipe-theft'), other).result), '(err u305)');
});
