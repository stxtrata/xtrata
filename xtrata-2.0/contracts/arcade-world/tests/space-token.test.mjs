// xtrata-space-token-v1 (draft): one SIP-009 token per wrapped space, proven against the real xtrata-world-v2.
// Deployed at test time from drafts/ (not part of Clarinet.toml or the launch).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { standardWorld, U, P, Cl, CAP, OK, err, pp, idOf, good } from './world2-helpers.mjs';

const SRC = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../drafts/xtrata-space-token-v1.clar'), 'utf8');
const LEASE = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../drafts/xtrata-lease-v1.clar'), 'utf8');
const REG = { NOT_AUTH: 300 };

async function tokenWorld({ wrap = true } = {}) {
  const w = await standardWorld();
  const { simnet, deployer, W } = w;
  simnet.deployContract('xtrata-space-token-v1', SRC, { clarityVersion: 4 }, deployer);
  const tok = `${deployer}.xtrata-space-token-v1`;
  const T = (fn, args, sender) => simnet.callPublicFn('xtrata-space-token-v1', fn, args, sender);
  const Tr = (fn, args = []) => simnet.callReadOnlyFn('xtrata-space-token-v1', fn, args, deployer).result;
  const [alice, bob, carol] = [W[0], W[1], W[2]];
  const shop = idOf(w.space(alice, { parent: w.ids.alice, slug: 'shop', kind: 1, runtime: 1 }));
  assert.ok(good(w.setState(alice, shop, 1)));
  const sign = idOf(w.object(alice, shop, w.kinds.sign, { name: 'sign' }));
  if (wrap) {
    assert.equal(pp(w.call('propose-space-transfer', [U(shop), P(tok)], alice).result), OK);
    assert.equal(pp(T('wrap', [U(shop)], alice).result), OK);
  }
  const mine = (who, text = 'hi', from = 0) => w.addState(who, sign, { from, patch: JSON.stringify({ text }) });
  const regOwner = () => pp(w.get(shop).owner);
  return { w, simnet, deployer, alice, bob, carol, shop, sign, tok, T, Tr, mine, regOwner };
}

test('wrapping: the contract becomes the registry owner, the token goes to the former owner, who can still build', async () => {
  const t = await tokenWorld();
  assert.equal(t.regOwner(), `'${t.tok}`);
  assert.equal(pp(t.Tr('get-owner', [U(t.shop)])), `(ok (some '${t.alice}))`);
  assert.ok(pp(t.mine(t.alice).result).startsWith('(ok'), 'the holder changes the sign through her standing grant');
  assert.equal(pp(t.mine(t.bob).result), err(REG.NOT_AUTH));
});

test('wrapping needs the registry proposal first and the right owner', async () => {
  const t = await tokenWorld({ wrap: false });
  assert.equal(pp(t.T('wrap', [U(t.shop)], t.alice).result), '(err u501)', 'no proposal yet');
  assert.equal(pp(t.w.call('propose-space-transfer', [U(t.shop), P(t.tok)], t.alice).result), OK);
  assert.equal(pp(t.T('wrap', [U(t.shop)], t.bob).result), '(err u500)', 'only the owner who proposed');
  assert.equal(pp(t.T('wrap', [U(t.shop)], t.alice).result), OK);
});

test('selling the token moves the right to build in one transaction; the old holder is out, the new one is in', async () => {
  const t = await tokenWorld();
  assert.equal(pp(t.T('transfer', [U(t.shop), P(t.alice), P(t.bob)], t.alice).result), OK);
  assert.equal(pp(t.Tr('get-owner', [U(t.shop)])), `(ok (some '${t.bob}))`);
  assert.equal(pp(t.mine(t.alice).result), err(REG.NOT_AUTH), 'the seller can no longer change anything');
  assert.ok(pp(t.mine(t.bob, 'bob').result).startsWith('(ok'), 'the buyer can');
  // only the holder moves the token
  assert.equal(pp(t.T('transfer', [U(t.shop), P(t.bob), P(t.carol)], t.alice).result), '(err u500)');
});

test('a sale does not move the registry epoch: a scheduled state, a portal consent and the room itself carry over', async () => {
  const t = await tokenWorld();
  const h = t.simnet.burnBlockHeight;
  assert.ok(pp(t.mine(t.alice, 'later', h + 40).result).startsWith('(ok'));
  const epoch = () => pp(t.w.get(t.shop).epoch);
  const e0 = epoch();
  assert.equal(pp(t.T('transfer', [U(t.shop), P(t.alice), P(t.bob)], t.alice).result), OK);
  assert.equal(epoch(), e0, 'same epoch: scheduled states survive the sale (a registry sale would drop them)');
  assert.equal(pp(t.w.getObj(t.sign).space), pp(U(t.shop)));
});

test('a lessee\'s rights hang from the holder\'s grant: after a token sale the old holder\'s delegations lapse', async () => {
  const t = await tokenWorld();
  const { w, simnet } = t;
  // alice (holder) rents the sign out by a plain short delegated grant to carol
  assert.equal(pp(w.grant(t.alice, t.shop, t.carol, CAP.STATE, false, simnet.burnBlockHeight + 100).result), OK);
  assert.ok(pp(t.mine(t.carol).result).startsWith('(ok'));
  assert.equal(pp(t.T('transfer', [U(t.shop), P(t.alice), P(t.bob)], t.alice).result), OK);
  assert.equal(pp(t.mine(t.carol).result), err(REG.NOT_AUTH), 'what the seller delegated lapses with the seller\'s grant');
});

test('the holder can set the space policy through the token contract, nobody else can', async () => {
  const t = await tokenWorld();
  const pol = t.w.polOf(t.shop, { objects: 10 });
  assert.equal(pp(t.T('set-policy', [U(t.shop), pol], t.bob).result), '(err u503)');
  assert.equal(pp(t.T('set-policy', [U(t.shop), pol], t.alice).result), OK);
});

test('unwrapping burns the token and gives the space back through the registry\'s own two steps', async () => {
  const t = await tokenWorld();
  assert.equal(pp(t.T('unwrap', [U(t.shop)], t.bob).result), '(err u503)');
  assert.equal(pp(t.T('unwrap', [U(t.shop)], t.alice).result), OK);
  assert.equal(pp(t.Tr('get-owner', [U(t.shop)])), '(ok none)');
  assert.equal(pp(t.w.call('accept-space-transfer', [U(t.shop)], t.alice).result), OK);
  assert.equal(t.regOwner(), `'${t.alice}`);
});

test('a space whose transfer lock is on cannot be wrapped (the launch rooms are locked until the root owner unlocks them)', async () => {
  const t = await tokenWorld({ wrap: false });
  const hall = t.w.ids.hall;                      // created non-transferable, root-owned
  assert.equal(pp(t.w.call('propose-space-transfer', [U(hall), P(t.tok)], t.deployer).result), '(err u312)');
});

test('known limit: a holder cannot delegate the right to grant, so leasing a wrapped space needs forwarders in the token contract', async () => {
  const t = await tokenWorld();
  const { w, simnet, deployer } = t;
  simnet.deployContract('xtrata-lease-v1', LEASE, { clarityVersion: 4 }, deployer);
  const lease = `${deployer}.xtrata-lease-v1`;
  // the registry lets only an owner hand out GRANT, and the owner here is the token contract
  const r = pp(w.grant(t.alice, t.shop, lease, CAP.STATE | CAP.OBJECT | CAP.GRANT).result);
  assert.ok(r.startsWith('(err'), `a delegate cannot pass on GRANT (${r})`);
  // and the lease contract's offer() wants the registry owner, which is the token contract
  const o = pp(simnet.callPublicFn('xtrata-lease-v1', 'offer', [U(t.shop), U(CAP.STATE), U(1), U(1), U(10)], t.alice).result);
  assert.equal(o, '(err u400)');
});
