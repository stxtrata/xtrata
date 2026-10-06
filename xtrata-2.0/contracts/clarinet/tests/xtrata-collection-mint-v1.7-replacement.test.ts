import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Cl, ClarityType } from '@stacks/transactions';
import { describe, expect, it } from 'vitest';

/**
 * Replacing unminted files in a published, paused v1.7 collection (the
 * Audionauts case): 111 registered files, editions 84 and 90 swapped for
 * revised bytes. By default the files are synthetic stand-ins (collection
 * media stays out of Git); set AUDIONAUTS_DIR (the 111 originals) and
 * AUDIONAUTS_REVISED_DIR (revised 084.html / 090.html) to run it on the real
 * files — see canaries/audionauts-replacement/README.md.
 */
const accounts = simnet.getAccounts();
const admin = accounts.get('deployer')!;
const alice = accounts.get('wallet_1')!;
const bob = accounts.get('wallet_2')!;
const core = 'xtrata-v3-2-3';
const helper = 'xtrata-collection-mint-v1-7';
const target = Cl.contractPrincipal(admin, core);
const PRICE = 25_000_000n;
const CHUNK = 16384;
const TOKEN_URI = 'data:text/plain,xtrata-collection-default';

const chunksOf = (bytes: Buffer) => {
  const chunks: Buffer[] = [];
  for (let i = 0; i < bytes.length; i += CHUNK) chunks.push(bytes.subarray(i, i + CHUNK));
  return chunks;
};
const hashOf = (bytes: Buffer) => chunksOf(bytes).reduce(
  (hash, chunk) => createHash('sha256').update(Buffer.concat([hash, chunk])).digest(), Buffer.alloc(32));

const name = (n: number) => `${String(n).padStart(3, '0')}.html`;
const realDir = process.env.AUDIONAUTS_DIR;
const revisedDir = process.env.AUDIONAUTS_REVISED_DIR;
const useReal = Boolean(realDir && revisedDir && existsSync(join(realDir!, name(84))) && existsSync(join(revisedDir!, name(84))));
const original = (n: number) => useReal ? readFileSync(join(realDir!, name(n)))
  : Buffer.from(`<!doctype html><title>Audionaut ${String(n).padStart(3, '0')}</title><script defer src="/i/3060" data-edition="${n}"></script>`);
const revised = (n: number) => useReal ? readFileSync(join(revisedDir!, name(n)))
  : Buffer.from(`<!doctype html><title>Audionaut ${String(n).padStart(3, '0')}</title><script>/* credit */</script><script defer src="/i/3060" data-edition="${n}"></script>`);

const call = (fn: string, args: any[] = [], sender = admin) => simnet.callPublicFn(helper, fn, args, sender);
const read = (fn: string, args: any[] = []) => simnet.callReadOnlyFn(helper, fn, args, admin).result;
const paidBy = (who: string, results: Array<{ events: any[] }>) => results.flatMap(r => r.events)
  .filter(e => e.event === 'stx_transfer_event' && e.data.sender === who)
  .reduce((sum, e) => sum + BigInt(e.data.amount), 0n);
const declaration = (bytes: Buffer) => [Cl.buffer(hashOf(bytes)), Cl.stringAscii('text/html'), Cl.uint(bytes.length), Cl.uint(chunksOf(bytes).length)];
const directMint = (bytes: Buffer) => {
  simnet.callPublicFn(core, 'begin-inscription', declaration(bytes), bob);
  simnet.callPublicFn(core, 'add-chunk-batch', [Cl.buffer(hashOf(bytes)), Cl.list(chunksOf(bytes).map(Cl.buffer))], bob);
  const sealed = simnet.callPublicFn(core, 'seal-inscription', [Cl.buffer(hashOf(bytes)), Cl.stringAscii('data:text/plain,engine')], bob);
  return (sealed.result as any).value;
};
const stagedMint = (bytes: Buffer, buyer = alice) => {
  const begin = call('mint-begin', [target, ...declaration(bytes)], buyer);
  if (begin.result.type !== ClarityType.ResponseOk) return { result: begin.result, paid: 0n };
  const upload = call('mint-add-chunk-batch', [target, Cl.buffer(hashOf(bytes)), Cl.list(chunksOf(bytes).map(Cl.buffer))], buyer);
  const seal = call('mint-seal', [target, Cl.buffer(hashOf(bytes)), Cl.stringAscii('ignored')], buyer);
  return { result: seal.result, paid: paidBy(buyer, [begin, upload, seal]) };
};
const smallMint = (bytes: Buffer, buyer = alice) => {
  const result = call('mint-small-single-tx', [target, ...declaration(bytes).slice(0, 3), Cl.list(chunksOf(bytes).map(Cl.buffer)), Cl.stringAscii('ignored')], buyer);
  return { result: result.result, paid: paidBy(buyer, [result]) };
};
const registered = (bytes: Buffer) => read('get-registered-token-uri', [Cl.buffer(hashOf(bytes))]).type === ClarityType.OptionalSome;

/** A published Audionauts-shaped collection: engine + helmet dependencies, 111 registered files, 25 STX, paused. */
function publishedCollection() {
  expect(simnet.callPublicFn(core, 'set-paused', [Cl.bool(false)], admin).result).toBeOk(Cl.bool(true));
  const engine = directMint(Buffer.from('engine #3060 stand-in'));
  const helmets = directMint(Buffer.from('helmet pack #3059 stand-in'));
  expect(call('set-default-dependencies', [Cl.list([engine, helmets])]).result).toBeOk(Cl.bool(true));
  const entries = Array.from({ length: 111 }, (_, i) => Cl.tuple({ hash: Cl.buffer(hashOf(original(i + 1))), 'token-uri': Cl.stringAscii(TOKEN_URI) }));
  expect(call('set-registered-token-uri-batch', [Cl.list(entries)]).result).toBeOk(Cl.bool(true));
  expect(call('set-max-supply', [Cl.uint(111)]).result).toBeOk(Cl.bool(true));
  expect(call('set-mint-price', [Cl.uint(PRICE)]).result).toBeOk(Cl.bool(true));
  expect(call('set-splits', [Cl.uint(9500), Cl.uint(250), Cl.uint(250)]).result).toBeOk(Cl.bool(true));
  expect(read('is-paused')).toBeOk(Cl.bool(true));
  return { engine, helmets };
}

/** The three wallet steps the studio guides the artist through. */
function replace(editions: number[]) {
  const batch = Cl.list(editions.map(n => Cl.tuple({ hash: Cl.buffer(hashOf(revised(n))), 'token-uri': Cl.stringAscii(TOKEN_URI) })));
  expect(call('set-registered-token-uri-batch', [batch]).result).toBeOk(Cl.bool(true));
  for (const n of editions) expect(call('clear-registered-token-uri', [Cl.buffer(hashOf(original(n)))]).result).toBeOk(Cl.bool(true));
}

describe(`Audionauts replacement of 84 and 90 (${useReal ? 'real files' : 'synthetic stand-ins'})`, () => {
  it('rejects the old files, mints the replacements for exactly 25 STX, keeps 111 registered files', () => {
    const { engine, helmets } = publishedCollection();
    expect(hashOf(revised(84)).equals(hashOf(original(84)))).toBe(false);
    replace([84, 90]);
    expect(call('set-paused', [Cl.bool(false)]).result).toBeOk(Cl.bool(true));

    // Old bytes can never be minted again, staged or atomic.
    expect(stagedMint(original(84)).result).toBeErr(Cl.uint(123));
    expect(smallMint(original(90)).result).toBeErr(Cl.uint(123));

    // Replacements mint through both routes, recursive to the engine and helmets, for 25 STX in contract payments.
    const mint84 = stagedMint(revised(84));
    expect(mint84.result.type).toBe(ClarityType.ResponseOk);
    expect(mint84.paid).toBe(PRICE);
    const mint90 = smallMint(revised(90), bob);
    expect(mint90.result.type).toBe(ClarityType.ResponseOk);
    expect(mint90.paid).toBe(PRICE);
    for (const id of [(mint84.result as any).value, (mint90.result as any).value]) {
      expect(simnet.callReadOnlyFn(core, 'get-dependencies', [id], alice).result).toEqual(Cl.list([engine, helmets]));
    }

    // Inventory: 109 originals + 2 replacements registered, the 2 old ones gone — still 111 files.
    const active = Array.from({ length: 111 }, (_, i) => i + 1).map(n => (n === 84 || n === 90 ? revised(n) : original(n)));
    expect(active.filter(registered)).toHaveLength(111);
    expect(registered(original(84)) || registered(original(90))).toBe(false);
    // An unchanged edition still mints normally.
    expect(stagedMint(original(1)).paid).toBe(PRICE);
    expect(read('get-minted-count')).toBeOk(Cl.uint(3));
  });

  it('only the config admin can change registrations, and a minted file stays minted', () => {
    publishedCollection();
    expect(call('set-paused', [Cl.bool(false)]).result).toBeOk(Cl.bool(true));
    const minted = stagedMint(original(84));
    expect(minted.paid).toBe(PRICE);
    // The studio refuses minted files; on-chain the old hash is sealed in the core, so a re-mint is a duplicate.
    expect(stagedMint(original(84), bob).result).toBeErr(Cl.uint(122));
    expect(call('set-paused', [Cl.bool(true)]).result).toBeOk(Cl.bool(true));
    // The registration write requires the config admin and a non-finalized collection.
    expect(call('clear-registered-token-uri', [Cl.buffer(hashOf(original(90)))], alice).result).toBeErr(Cl.uint(100));
  });

  it('a paused collection cannot be minted during the replacement', () => {
    publishedCollection();
    replace([84]);
    expect(stagedMint(revised(84)).result).toBeErr(Cl.uint(103));
    expect(smallMint(original(90)).result).toBeErr(Cl.uint(103));
  });
});
