import { createHash } from 'node:crypto';
import { Cl, ClarityType } from '@stacks/transactions';
import { beforeEach, describe, expect, it } from 'vitest';

const accounts = simnet.getAccounts();
const admin = accounts.get('deployer')!;
const alice = accounts.get('wallet_1')!;
const bob = accounts.get('wallet_2')!;
const core = 'xtrata-v3-2-3';
const helper = 'xtrata-collection-mint-v1-6';
const target = Cl.contractPrincipal(admin, core);
const chunks = [Buffer.from('collection asset')];
const hashOf = (data: Buffer[]) => data.reduce(
  (hash, chunk) => createHash('sha256').update(Buffer.concat([hash, chunk])).digest(),
  Buffer.alloc(32)
);
const hash = hashOf(chunks);
const call = (name: string, args: any[] = [], sender = alice) =>
  simnet.callPublicFn(helper, name, args, sender);
const read = (name: string, args: any[] = []) =>
  simnet.callReadOnlyFn(helper, name, args, alice).result;
const coreCall = (name: string, args: any[], sender = bob) =>
  simnet.callPublicFn(core, name, args, sender);
const declaration = (data = chunks) => [Cl.buffer(hashOf(data)), Cl.stringAscii('text/plain'),
  Cl.uint(data.reduce((n, chunk) => n + chunk.length, 0)), Cl.uint(data.length)];
const register = (data = chunks) => call('set-registered-token-uri',
  [Cl.buffer(hashOf(data)), Cl.stringAscii('data:text/plain,collection')], admin);
const begin = (sender = alice, data = chunks) => call('mint-begin', [target, ...declaration(data)], sender);
const upload = (sender = alice, data = chunks) => call('mint-add-chunk-batch',
  [target, Cl.buffer(hashOf(data)), Cl.list(data.map(Cl.buffer))], sender);
const seal = (sender = alice, data = chunks) => call('mint-seal',
  [target, Cl.buffer(hashOf(data)), Cl.stringAscii('ignored')], sender);
const small = (sender = alice, data = chunks) => call('mint-small-single-tx',
  [target, ...declaration(data).slice(0, 3), Cl.list(data.map(Cl.buffer)), Cl.stringAscii('ignored')], sender);
const directMint = (data = chunks, sender = bob) => {
  expect(coreCall('begin-inscription', declaration(data), sender).result).toBeOk(Cl.bool(true));
  expect(coreCall('add-chunk-batch', [Cl.buffer(hashOf(data)), Cl.list(data.map(Cl.buffer))], sender).result)
    .toBeOk(Cl.bool(true));
  return coreCall('seal-inscription', [Cl.buffer(hashOf(data)), Cl.stringAscii('data:text/plain,direct')], sender);
};
const batch = (data: Buffer[][]) => call('mint-seal-batch', [target, Cl.list(data.map(item =>
  Cl.tuple({ hash: Cl.buffer(hashOf(item)), 'token-uri': Cl.stringAscii('ignored') })))]);

beforeEach(() => {
  expect(coreCall('set-paused', [Cl.bool(false)], admin).result).toBeOk(Cl.bool(true));
  expect(call('set-max-supply', [Cl.uint(50)], admin).result).toBeOk(Cl.bool(true));
  expect(call('set-paused', [Cl.bool(false)], admin).result).toBeOk(Cl.bool(true));
  expect(register().result).toBeOk(Cl.bool(true));
});

describe('v1.6 on the actual v3.2.3 core', () => {
  it('replaces unminted inventory without leaving the superseded hash mintable', () => {
    const replacement = [Buffer.from('optimized replacement bytes')];
    expect(call('set-paused', [Cl.bool(true)], admin).result).toBeOk(Cl.bool(true));
    expect(register(replacement).result).toBeOk(Cl.bool(true));
    expect(call('clear-registered-token-uri', [Cl.buffer(hash)], admin).result).toBeOk(Cl.bool(true));
    expect(read('get-registered-token-uri', [Cl.buffer(hash)])).toBeNone();
    expect(read('get-minted-count')).toBeOk(Cl.uint(0));
    expect(read('get-reserved-count')).toBeOk(Cl.uint(0));
    expect(call('set-paused', [Cl.bool(false)], admin).result).toBeOk(Cl.bool(true));
    expect(begin().result).toBeErr(Cl.uint(123));
    expect(small(alice, replacement).result.type).toBe(ClarityType.ResponseOk);
    expect(read('get-minted-count')).toBeOk(Cl.uint(1));
  });

  it('pins the core and rejects a legacy target', () => {
    expect(read('get-locked-core-contract')).toBeOk(target);
    expect(call('mint-begin', [Cl.contractPrincipal(admin, 'xtrata-v2-1-0'), ...declaration()]).result)
      .toBeErr(Cl.uint(112));
  });

  it('requires registered collection content before reserving or paying', () => {
    const unknown = [Buffer.from('not collection inventory')];
    expect(begin(alice, unknown).result).toBeErr(Cl.uint(123));
    expect(small(alice, unknown).result).toBeErr(Cl.uint(123));
    expect(read('get-reserved-count')).toBeOk(Cl.uint(0));
  });

  it('mints to the buyer, releases the session, and emits an exact receipt', () => {
    expect(begin().result).toBeOk(Cl.bool(true));
    expect(begin().result).toBeOk(Cl.bool(true)); // resume is one reservation
    expect(read('get-reserved-count')).toBeOk(Cl.uint(1));
    expect(upload().result).toBeOk(Cl.bool(true));
    const result = seal();
    expect(result.result.type).toBe(ClarityType.ResponseOk);
    const id = (result.result as any).value;
    expect(simnet.callReadOnlyFn(core, 'get-owner', [id], alice).result)
      .toBeOk(Cl.some(Cl.principal(alice)));
    expect(read('get-minted-count')).toBeOk(Cl.uint(1));
    expect(read('get-reserved-count')).toBeOk(Cl.uint(0));
    expect(read('get-reservation', [Cl.principal(alice), Cl.buffer(hash)])).toBeNone();
    expect(result.events.filter(event => event.event === 'print_event').map(event => event.data.value))
      .toContainEqual(Cl.tuple({ event: Cl.stringAscii('collection-minted'), core: target,
        hash: Cl.buffer(hash), 'token-id': id, owner: Cl.principal(alice), 'phase-id': Cl.uint(0) }));
    // Sealed Chunks are permanent content, not garbage to purge.
    expect(simnet.callReadOnlyFn(core, 'get-chunk', [id, Cl.uint(0)], alice).result)
      .toBeSome(Cl.buffer(chunks[0]));
  });

  it('proves core begin-or-get is not a deduplication guard', () => {
    directMint();
    expect(coreCall('begin-or-get', declaration(), alice).result).toBeOk(Cl.none());
    expect(begin().result).toBeErr(Cl.uint(122));
    expect(small().result).toBeErr(Cl.uint(122));
    expect(read('get-reserved-count')).toBeOk(Cl.uint(0));
  });

  it('rejects a duplicate sealed by another uploader after begin', () => {
    begin(); upload(); directMint();
    expect(upload().result).toBeErr(Cl.uint(122));
    expect(seal().result).toBeErr(Cl.uint(122));
    expect(read('get-minted-count')).toBeOk(Cl.uint(0));
    expect(call('cancel-reservation', [Cl.buffer(hash)]).result).toBeOk(Cl.bool(true));
    expect(read('get-reserved-count')).toBeOk(Cl.uint(0));
    // Helper cancellation does not falsely claim the core upload was deleted.
    expect(simnet.callReadOnlyFn(core, 'get-upload-state', [Cl.buffer(hash), Cl.principal(alice)], alice).result.type)
      .toBe(ClarityType.OptionalSome);
  });

  it('reserves each hash for one buyer and releases it on cancellation', () => {
    expect(begin(alice).result).toBeOk(Cl.bool(true));
    expect(begin(bob).result).toBeErr(Cl.uint(124));
    expect(read('get-hash-reservation', [Cl.buffer(hash)])).toBeSome(Cl.principal(alice));
    expect(read('get-reserved-count')).toBeOk(Cl.uint(1));
    call('cancel-reservation', [Cl.buffer(hash)], alice);
    expect(begin(bob).result).toBeOk(Cl.bool(true));
    expect(upload(bob).result).toBeOk(Cl.bool(true));
    expect(seal(bob).result.type).toBe(ClarityType.ResponseOk);
    expect(read('get-hash-reservation', [Cl.buffer(hash)])).toBeNone();
    expect(read('get-reserved-count')).toBeOk(Cl.uint(0));
  });

  it('rolls back an entire batch when any hash was sealed externally', () => {
    const other = [Buffer.from('second asset')];
    register(other); begin(); upload(); begin(alice, other); upload(alice, other);
    directMint(other);
    expect(batch([chunks, other]).result).toBeErr(Cl.uint(122));
    expect(read('get-minted-count')).toBeOk(Cl.uint(0));
    expect(read('get-reserved-count')).toBeOk(Cl.uint(2));
    expect(simnet.callReadOnlyFn(core, 'get-id-by-hash', [Cl.buffer(hash)], alice).result).toBeNone();
  });

  it('mints a valid batch and records every token', () => {
    const other = [Buffer.from('second asset')];
    register(other); begin(); upload(); begin(alice, other); upload(alice, other);
    expect(batch([chunks, other]).result.type).toBe(ClarityType.ResponseOk);
    expect(read('get-minted-count')).toBeOk(Cl.uint(2));
    expect(read('get-minted-index-count')).toBeOk(Cl.uint(2));
    expect(read('get-hash-reservation', [Cl.buffer(hash)])).toBeNone();
    expect(read('get-hash-reservation', [Cl.buffer(hashOf(other))])).toBeNone();
    expect(read('get-reserved-count')).toBeOk(Cl.uint(0));
  });

  it('rejects duplicate items within a batch without consuming sessions', () => {
    begin(); upload();
    expect(batch([chunks, chunks]).result).toBeErr(Cl.uint(111));
    expect(read('get-reserved-count')).toBeOk(Cl.uint(1));
  });

  it('supports the retained atomic small mint path and rejects reminting', () => {
    expect(small().result.type).toBe(ClarityType.ResponseOk);
    expect(small(bob).result).toBeErr(Cl.uint(122));
    expect(read('get-minted-count')).toBeOk(Cl.uint(1));
  });

  it('supports a full 32-chunk upload batch with valid chunk shape', () => {
    const data = Array.from({ length: 32 }, () => Buffer.alloc(16384, 7));
    register(data);
    expect(begin(alice, data).result).toBeOk(Cl.bool(true));
    expect(upload(alice, data).result).toBeOk(Cl.bool(true));
    expect(seal(alice, data).result.type).toBe(ClarityType.ResponseOk);
  });

  it('does not collect a collection price when duplicate sealing fails', () => {
    call('set-mint-price', [Cl.uint(1000000)], admin);
    begin(); upload(); directMint();
    const before = simnet.getAssetsMap().get('STX')!.get(alice);
    expect(seal().result).toBeErr(Cl.uint(122));
    expect(simnet.getAssetsMap().get('STX')!.get(alice)).toBe(before);
  });

  it('keeps the reservation price when pricing changes after begin', () => {
    call('set-mint-price', [Cl.uint(1000000)], admin);
    begin(); upload();
    call('set-mint-price', [Cl.uint(2000000)], admin);
    const session = read('get-reservation', [Cl.principal(alice), Cl.buffer(hash)]) as any;
    expect(session.value.value['mint-price']).toEqual(Cl.uint(1000000));
    expect(seal().result.type).toBe(ClarityType.ResponseOk);
  });
  it('keeps pause, wallet limits, and cancellation accounting', () => {
    call('set-paused', [Cl.bool(true)], admin);
    expect(begin().result).toBeErr(Cl.uint(103));
    call('set-paused', [Cl.bool(false)], admin);
    call('set-max-per-wallet', [Cl.uint(1)], admin);
    const other = [Buffer.from('over wallet limit')];
    register(other); begin();
    expect(begin(alice, other).result).toBeErr(Cl.uint(107));
    expect(call('cancel-reservation', [Cl.buffer(hash)]).result).toBeOk(Cl.bool(true));
    expect(begin(alice, other).result).toBeOk(Cl.bool(true));
  });

  it('supports recursive dependencies in atomic collection minting', () => {
    const parent = directMint();
    const parentId = (parent.result as any).value;
    const child = [Buffer.from('child asset')];
    register(child);
    call('set-default-dependencies', [Cl.list([parentId])], admin);
    const result = small(alice, child);
    expect(result.result.type).toBe(ClarityType.ResponseOk);
    expect(simnet.callReadOnlyFn(core, 'get-dependencies', [(result.result as any).value], alice).result)
      .toEqual(Cl.list([parentId]));
  });

  it('rolls back seal and collection accounting if split payment fails', () => {
    call('set-mint-price', [Cl.uint(1000000000000000)], admin);
    begin(); upload();
    expect(seal().result.type).toBe(ClarityType.ResponseErr);
    expect(read('get-reserved-count')).toBeOk(Cl.uint(1));
    expect(read('get-minted-count')).toBeOk(Cl.uint(0));
    expect(simnet.callReadOnlyFn(core, 'get-id-by-hash', [Cl.buffer(hash)], alice).result).toBeNone();
  });

  it('documents why core purge must never follow a hash-only cleanup signal', () => {
    // Local reproduction of an inherited v3.2.3 storage aliasing hazard.
    // No helper/worker is allowed to automate this sequence.
    const minted = directMint(chunks, alice);
    const id = (minted.result as any).value;
    expect(coreCall('begin-inscription', declaration(), alice).result).toBeOk(Cl.bool(true));
    simnet.mineEmptyBlocks(4321);
    expect(coreCall('purge-expired-chunk-batch', [Cl.buffer(hash), Cl.principal(alice), Cl.list([Cl.uint(0)])]).result)
      .toBeOk(Cl.bool(true));
    expect(simnet.callReadOnlyFn(core, 'is-inscription-sealed', [id], alice).result).toBeSome(Cl.bool(true));
    expect(simnet.callReadOnlyFn(core, 'get-chunk', [id, Cl.uint(0)], alice).result).toBeNone();
  });

  it.each(['release-reservation', 'release-expired-reservation'])('%s releases the hash and phase counters', (method) => {
    expect(call('set-phase', [Cl.uint(1), Cl.bool(true), Cl.uint(0), Cl.uint(0),
      Cl.uint(0), Cl.uint(1), Cl.uint(1), Cl.uint(1)], admin).result).toBeOk(Cl.bool(true));
    call('set-active-phase', [Cl.uint(1)], admin);
    begin();
    expect(call(method, [Cl.principal(alice), Cl.buffer(hash)], bob).result).toBeErr(Cl.uint(100));
    if (method === 'release-expired-reservation') {
      expect(call(method, [Cl.principal(alice), Cl.buffer(hash)], admin).result).toBeErr(Cl.uint(119));
      simnet.mineEmptyBlocks(1441);
    }
    expect(call(method, [Cl.principal(alice), Cl.buffer(hash)], admin).result).toBeOk(Cl.bool(true));
    expect(read('get-hash-reservation', [Cl.buffer(hash)])).toBeNone();
    expect(read('get-phase-stats', [Cl.uint(1)])).toBeOk(Cl.tuple({ minted: Cl.uint(0), reserved: Cl.uint(0) }));
    expect(begin(bob).result).toBeOk(Cl.bool(true));
    upload(bob);
    expect(seal(bob).result.type).toBe(ClarityType.ResponseOk);
    expect(read('get-phase-stats', [Cl.uint(1)])).toBeOk(Cl.tuple({ minted: Cl.uint(1), reserved: Cl.uint(0) }));
  });

  it('rolls back the hash lock when core begin fails its shape validation', () => {
    expect(call('mint-begin', [target, Cl.buffer(hash), Cl.stringAscii('text/plain'), Cl.uint(0), Cl.uint(1)]).result.type)
      .toBe(ClarityType.ResponseErr);
    expect(read('get-hash-reservation', [Cl.buffer(hash)])).toBeNone();
    expect(read('get-reserved-count')).toBeOk(Cl.uint(0));
    expect(begin(bob).result).toBeOk(Cl.bool(true));
  });

});


describe('v1.6 atomic chunk boundary', () => {
  for (const count of [30,31,32]) it(`mints ${count} full-size chunks atomically`, () => {
    const data=Array.from({length:count},(_,i)=>Buffer.alloc(16384,i+1));
    expect(register(data).result).toBeOk(Cl.bool(true));
    expect(small(alice,data).result).toBeOk(Cl.uint(0));
    expect(read('get-max-small-mint-chunks')).toBeOk(Cl.uint(32));
  });
});
