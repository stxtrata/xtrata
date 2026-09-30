import { createHash } from 'node:crypto';
import { Cl, ClarityType, cvToValue } from '@stacks/transactions';
import { beforeEach, describe, expect, it } from 'vitest';

// Roles: deployer = Xtrata core admin (and treasury: the core's deployer).
// alice = artist / collection owner. charlie = platform editor Xtrata appoints.
const accounts = simnet.getAccounts();
const xtrata = accounts.get('deployer')!;
const alice = accounts.get('wallet_1')!;
const bob = accounts.get('wallet_2')!; // collector
const charlie = accounts.get('wallet_3')!;
const dave = accounts.get('wallet_4')!; // co-artist
const erin = accounts.get('wallet_5')!; // song holder
const frank = accounts.get('wallet_6')!; // next song holder
const grace = accounts.get('wallet_7')!; // operator recipient
const heidi = accounts.get('wallet_8')!; // marketplace recipient

const core = 'xtrata-v3-2-3';
const helper = 'xtrata-collection-mint-v1-9';
const target = Cl.contractPrincipal(xtrata, core);
const PRICE = 10_000_000n;

const hashOf = (data: Buffer[]) => data.reduce(
  (hash, chunk) => createHash('sha256').update(Buffer.concat([hash, chunk])).digest(),
  Buffer.alloc(32)
);
const call = (name: string, args: any[] = [], sender = alice) =>
  simnet.callPublicFn(helper, name, args, sender);
const read = (name: string, args: any[] = []) =>
  simnet.callReadOnlyFn(helper, name, args, alice).result;
const coreCall = (name: string, args: any[], sender = bob) =>
  simnet.callPublicFn(core, name, args, sender);
const declaration = (data: Buffer[]) => [Cl.buffer(hashOf(data)), Cl.stringAscii('text/plain'),
  Cl.uint(data.reduce((n, chunk) => n + chunk.length, 0)), Cl.uint(data.length)];

const platform = (slot: number, recipient: string, bps: number, sender = xtrata, core_ = target) =>
  call('set-platform-split', [core_, Cl.uint(slot), Cl.principal(recipient), Cl.uint(bps)], sender);
const allowance = (count: number, sender = xtrata) =>
  call('set-artist-slot-allowance', [target, Cl.uint(count)], sender);
type Slot = { recipient: string; share: number; holderOf?: bigint };
const slot = (s: Slot) => Cl.tuple({
  recipient: Cl.principal(s.recipient),
  'holder-of': s.holderOf === undefined ? Cl.none() : Cl.some(Cl.uint(s.holderOf)),
  share: Cl.uint(s.share)
});
const artistSplits = (slots: Slot[], sender = alice) =>
  call('set-artist-splits', [Cl.list(slots.map(slot))], sender);

/** An inscription minted straight on the core, e.g. the song every item plays. */
let songCounter = 0;
const inscribeSong = (holder: string) => {
  const data = [Buffer.from(`song ${songCounter += 1}`)];
  expect(coreCall('begin-inscription', declaration(data), holder).result).toBeOk(Cl.bool(true));
  expect(coreCall('add-chunk-batch', [Cl.buffer(hashOf(data)), Cl.list(data.map(Cl.buffer))], holder).result)
    .toBeOk(Cl.bool(true));
  const sealed = coreCall('seal-inscription', [Cl.buffer(hashOf(data)), Cl.stringAscii('data:text/plain,song')], holder);
  expect(sealed.result.type).toBe(ClarityType.ResponseOk);
  return BigInt(cvToValue((sealed.result as any).value));
};

let itemCounter = 0;
const newItem = () => {
  const data = [Buffer.from(`collection item ${itemCounter += 1}`)];
  expect(call('set-registered-token-uri', [Cl.buffer(hashOf(data)), Cl.stringAscii('data:text/plain,item')]).result)
    .toBeOk(Cl.bool(true));
  return data;
};
// Max supply is set-once, so it is set when opening (default 50).
const open = (supply = 50) => {
  expect(call('set-max-supply', [Cl.uint(supply)]).result).toBeOk(Cl.bool(true));
  expect(call('set-paused', [Cl.bool(false)]).result).toBeOk(Cl.bool(true));
};

/** Mints one item for `buyer` and returns every STX payment the buyer made, by recipient. */
const mint = (buyer = bob) => {
  const data = newItem();
  expect(call('mint-begin', [target, ...declaration(data)], buyer).result).toBeOk(Cl.bool(true));
  expect(call('mint-add-chunk-batch', [target, Cl.buffer(hashOf(data)), Cl.list(data.map(Cl.buffer))], buyer).result)
    .toBeOk(Cl.bool(true));
  const sealed = call('mint-seal', [target, Cl.buffer(hashOf(data)), Cl.stringAscii('ignored')], buyer);
  expect(sealed.result.type).toBe(ClarityType.ResponseOk);
  const paid: Record<string, bigint> = {};
  for (const event of sealed.events) {
    if (event.event !== 'stx_transfer_event' || event.data.sender !== buyer) continue;
    paid[event.data.recipient] = (paid[event.data.recipient] ?? 0n) + BigInt(event.data.amount);
  }
  return paid;
};
const payout = () => BigInt(cvToValue((read('get-mint-quote', [Cl.uint(1)]) as any).value).payout.value);

beforeEach(() => {
  expect(coreCall('set-paused', [Cl.bool(false)], xtrata).result).toBeOk(Cl.bool(true));
  // The deployer hands the collection to the artist, as a creator deploy would.
  expect(call('set-finance-admin', [Cl.principal(alice)], xtrata).result).toBeOk(Cl.bool(true));
  expect(call('set-operator-admin', [Cl.principal(alice)], xtrata).result).toBeOk(Cl.bool(true));
  expect(call('initiate-contract-ownership-transfer', [Cl.principal(alice)], xtrata).result).toBeOk(Cl.bool(true));
  expect(call('accept-contract-ownership', [], alice).result).toBeOk(Cl.bool(true));
  expect(artistSplits([{ recipient: alice, share: 10000 }]).result).toBeOk(Cl.bool(true));
  expect(call('set-mint-price', [Cl.uint(PRICE)]).result).toBeOk(Cl.bool(true));
});

describe('defaults', () => {
  it('starts at 2.5% marketplace + 2.5% operator to Xtrata, one artist slot at 100%', () => {
    const treasury = Cl.principal(xtrata);
    expect(read('get-platform-splits')).toBeOk(Cl.tuple({
      marketplace: Cl.tuple({ recipient: treasury, bps: Cl.uint(250) }),
      operator: Cl.tuple({ recipient: treasury, bps: Cl.uint(250) }),
      auxiliary: Cl.tuple({ recipient: treasury, bps: Cl.uint(0) }),
      'total-bps': Cl.uint(500), 'min-bps': Cl.uint(250), 'max-bps': Cl.uint(1500),
      launched: Cl.bool(false)
    }));
    expect(read('get-splits')).toBeOk(Cl.tuple({
      artist: Cl.uint(9500), marketplace: Cl.uint(250), operator: Cl.uint(250), auxiliary: Cl.uint(0)
    }));
    expect(read('get-artist-splits')).toBeOk(Cl.tuple({
      allowance: Cl.uint(1), 'max-slots': Cl.uint(8), splits: Cl.list([slot({ recipient: alice, share: 10000 })])
    }));
    expect(read('get-payout-preview', [Cl.uint(1000)])).toBeOk(Cl.tuple({
      marketplace: Cl.uint(25), operator: Cl.uint(25), auxiliary: Cl.uint(0), 'artist-pool': Cl.uint(950)
    }));
  });

  it('has no v1.7 split or recipient setters left', () => {
    const iface = simnet.getContractsInterfaces().get(`${xtrata}.${helper}`)!;
    const names = iface.functions.map((fn: any) => fn.name);
    for (const gone of ['set-splits', 'set-recipients', 'set-marketplace-recipient', 'set-operator-recipient',
      'set-artist-recipient', 'set-recipient-editor-access']) {
      expect(names).not.toContain(gone);
    }
  });
});

describe('platform tier: only Xtrata', () => {
  it('refuses the artist / collection owner on every platform control', () => {
    expect(platform(0, alice, 0, alice).result).toBeErr(Cl.uint(100));
    expect(platform(0, alice, 250, alice).result).toBeErr(Cl.uint(100));
    expect(allowance(4, alice).result).toBeErr(Cl.uint(100));
    expect(call('set-platform-editor', [target, Cl.principal(alice), Cl.bool(true)], alice).result)
      .toBeErr(Cl.uint(100));
  });

  it('lets the core admin set each slot within 2.5%–15% total', () => {
    expect(platform(0, heidi, 500).result).toBeOk(Cl.bool(true));
    expect(platform(1, grace, 250).result).toBeOk(Cl.bool(true));
    expect(platform(2, charlie, 750).result).toBeOk(Cl.bool(true)); // 15% total
    expect(platform(2, charlie, 751).result).toBeErr(Cl.uint(126)); // over the ceiling
    expect(platform(0, heidi, 0).result).toBeOk(Cl.bool(true));
    expect(platform(2, charlie, 0).result).toBeOk(Cl.bool(true)); // 2.5% total
    expect(platform(1, grace, 249).result).toBeErr(Cl.uint(126)); // under the floor
    expect(read('get-splits')).toBeOk(Cl.tuple({
      artist: Cl.uint(9750), marketplace: Cl.uint(0), operator: Cl.uint(250), auxiliary: Cl.uint(0)
    }));
  });

  it('rejects an unknown slot and a foreign core', () => {
    expect(platform(3, heidi, 0).result).toBeErr(Cl.uint(129));
    expect(platform(0, heidi, 250, xtrata, Cl.contractPrincipal(xtrata, 'xtrata-v2-1-0')).result)
      .toBeErr(Cl.uint(112));
  });

  it('lets a platform editor appointed by the admin act, until removed', () => {
    const appoint = (enabled: boolean, sender = xtrata) =>
      call('set-platform-editor', [target, Cl.principal(charlie), Cl.bool(enabled)], sender);
    expect(platform(0, charlie, 300, charlie).result).toBeErr(Cl.uint(100));
    expect(appoint(true).result).toBeOk(Cl.bool(true));
    expect(read('is-platform-editor', [Cl.principal(charlie)])).toBeOk(Cl.bool(true));
    expect(platform(0, charlie, 300, charlie).result).toBeOk(Cl.bool(true));
    expect(allowance(3, charlie).result).toBeOk(Cl.bool(true));
    // An editor cannot appoint further editors.
    expect(call('set-platform-editor', [target, Cl.principal(dave), Cl.bool(true)], charlie).result)
      .toBeErr(Cl.uint(100));
    expect(appoint(false).result).toBeOk(Cl.bool(true));
    expect(platform(0, charlie, 250, charlie).result).toBeErr(Cl.uint(100));
  });

  it('once minting starts, a platform share can only go down', () => {
    open();
    expect(read('get-launched')).toBeOk(Cl.bool(true));
    expect(platform(0, xtrata, 300).result).toBeErr(Cl.uint(127));
    expect(platform(2, xtrata, 1).result).toBeErr(Cl.uint(127));
    expect(platform(0, heidi, 250).result).toBeOk(Cl.bool(true)); // new address, same share
    expect(platform(0, heidi, 100).result).toBeOk(Cl.bool(true));
    expect(platform(0, heidi, 0).result).toBeOk(Cl.bool(true));
    expect(platform(1, xtrata, 200).result).toBeErr(Cl.uint(126)); // floor still applies
    // Pausing again after a sale does not reopen increases.
    mint();
    expect(call('set-paused', [Cl.bool(true)]).result).toBeOk(Cl.bool(true));
    expect(platform(0, heidi, 50).result).toBeErr(Cl.uint(127));
  });
});

describe('artist tier: owner splits the pool across the slots Xtrata allows', () => {
  it('needs slots from Xtrata before splitting', () => {
    expect(artistSplits([{ recipient: alice, share: 5000 }, { recipient: dave, share: 5000 }]).result)
      .toBeErr(Cl.uint(129));
    expect(allowance(2).result).toBeOk(Cl.bool(true));
    expect(artistSplits([{ recipient: alice, share: 5000 }, { recipient: dave, share: 5000 }]).result)
      .toBeOk(Cl.bool(true));
    expect(allowance(1).result).toBeErr(Cl.uint(128)); // would drop dave
    expect(allowance(9).result).toBeErr(Cl.uint(129));
    expect(allowance(0).result).toBeErr(Cl.uint(129));
  });

  it('shares must be positive and total exactly 100% of the pool', () => {
    expect(allowance(3).result).toBeOk(Cl.bool(true));
    expect(artistSplits([{ recipient: alice, share: 5000 }, { recipient: dave, share: 4999 }]).result)
      .toBeErr(Cl.uint(128));
    expect(artistSplits([{ recipient: alice, share: 5000 }, { recipient: dave, share: 5001 }]).result)
      .toBeErr(Cl.uint(128));
    expect(artistSplits([{ recipient: alice, share: 10000 }, { recipient: dave, share: 0 }]).result)
      .toBeErr(Cl.uint(128));
    expect(call('set-artist-splits', [Cl.list([])]).result).toBeErr(Cl.uint(128));
  });

  it('only the owner or finance admin can split; Xtrata cannot redirect the artist pool', () => {
    expect(allowance(2).result).toBeOk(Cl.bool(true));
    const slots = [{ recipient: xtrata, share: 5000 }, { recipient: dave, share: 5000 }];
    expect(artistSplits(slots, xtrata).result).toBeErr(Cl.uint(100));
    expect(artistSplits(slots, dave).result).toBeErr(Cl.uint(100));
  });

  it('a holder slot must name an existing inscription and cannot be the primary slot', () => {
    expect(allowance(2).result).toBeOk(Cl.bool(true));
    const song = inscribeSong(erin);
    expect(artistSplits([{ recipient: alice, share: 5000, holderOf: song }, { recipient: dave, share: 5000 }]).result)
      .toBeErr(Cl.uint(128));
    expect(artistSplits([{ recipient: alice, share: 5000 }, { recipient: alice, share: 5000, holderOf: 999999n }]).result)
      .toBeErr(Cl.uint(128));
    expect(artistSplits([{ recipient: alice, share: 5000 }, { recipient: alice, share: 5000, holderOf: song }]).result)
      .toBeOk(Cl.bool(true));
  });
});

describe('payments at the moment of sale', () => {
  it('pays the platform tier, then co-artists and the song holder, dust to the primary artist', () => {
    expect(platform(0, heidi, 250).result).toBeOk(Cl.bool(true));
    expect(platform(1, grace, 250).result).toBeOk(Cl.bool(true));
    expect(platform(2, charlie, 100).result).toBeOk(Cl.bool(true));
    expect(allowance(3).result).toBeOk(Cl.bool(true));
    const song = inscribeSong(erin);
    // The song's holder earns 5% of the artist pool; the recipient field is ignored for holder slots.
    expect(artistSplits([
      { recipient: alice, share: 6500 },
      { recipient: dave, share: 3000 },
      { recipient: alice, share: 500, holderOf: song }
    ]).result).toBeOk(Cl.bool(true));
    open();
    const amount = payout();
    const paid = mint();
    const market = amount * 250n / 10000n;
    const operator = amount * 250n / 10000n;
    const auxiliary = amount * 100n / 10000n;
    const pool = amount - market - operator - auxiliary;
    const coArtist = pool * 3000n / 10000n;
    const holder = pool * 500n / 10000n;
    expect(paid[heidi]).toBe(market);
    expect(paid[grace]).toBe(operator);
    expect(paid[charlie]).toBe(auxiliary);
    expect(paid[dave]).toBe(coArtist);
    expect(paid[erin]).toBe(holder);
    expect(paid[alice]).toBe(pool - coArtist - holder);
    expect(market + operator + auxiliary + pool).toBe(amount);
  });

  it('follows the song when it changes hands, with no one updating the collection', () => {
    expect(allowance(2).result).toBeOk(Cl.bool(true));
    const song = inscribeSong(erin);
    expect(artistSplits([{ recipient: alice, share: 9500 }, { recipient: alice, share: 500, holderOf: song }]).result)
      .toBeOk(Cl.bool(true));
    open();
    expect(read('get-artist-payees')).toBeOk(Cl.list([
      Cl.tuple({ payee: Cl.principal(alice), share: Cl.uint(9500), 'holder-of': Cl.none() }),
      Cl.tuple({ payee: Cl.principal(erin), share: Cl.uint(500), 'holder-of': Cl.some(Cl.uint(song)) })
    ]));
    expect(mint()[erin]).toBeGreaterThan(0n);
    expect(coreCall('transfer', [Cl.uint(song), Cl.principal(erin), Cl.principal(frank)], erin).result)
      .toBeOk(Cl.bool(true));
    const paid = mint();
    expect(paid[frank]).toBeGreaterThan(0n);
    expect(paid[erin]).toBeUndefined();
  });

  it('sends the holder share to the primary artist when a contract holds the song', () => {
    expect(allowance(2).result).toBeOk(Cl.bool(true));
    const song = inscribeSong(erin);
    expect(artistSplits([{ recipient: alice, share: 9000 }, { recipient: dave, share: 1000, holderOf: song }]).result)
      .toBeOk(Cl.bool(true));
    // e.g. listed on a marketplace: escrowed by a contract.
    expect(coreCall('transfer', [Cl.uint(song), Cl.principal(erin), Cl.contractPrincipal(xtrata, helper)], erin).result)
      .toBeOk(Cl.bool(true));
    open();
    const amount = payout();
    const paid = mint();
    const pool = amount - 2n * (amount * 250n / 10000n);
    expect(paid[alice]).toBe(pool);
    expect(paid[dave]).toBeUndefined();
    expect(paid[`${xtrata}.${helper}`]).toBeUndefined();
  });

  it('a co-artist who is also the buyer simply keeps their share', () => {
    expect(allowance(2).result).toBeOk(Cl.bool(true));
    expect(artistSplits([{ recipient: alice, share: 5000 }, { recipient: bob, share: 5000 }]).result).toBeOk(Cl.bool(true));
    open();
    const amount = payout();
    const paid = mint(bob);
    const pool = amount - 2n * (amount * 250n / 10000n);
    expect(paid[bob]).toBeUndefined();
    expect(paid[alice]).toBe(pool - pool * 5000n / 10000n);
  });
});

describe('finalize locks both tiers', () => {
  it('rejects every split change after the collection is finalized', () => {
    open(1);
    mint();
    expect(call('finalize', []).result).toBeOk(Cl.bool(true));
    expect(platform(0, heidi, 0).result).toBeErr(Cl.uint(108));
    expect(allowance(2).result).toBeErr(Cl.uint(108));
    expect(artistSplits([{ recipient: dave, share: 10000 }]).result).toBeErr(Cl.uint(108));
    expect(call('set-platform-editor', [target, Cl.principal(charlie), Cl.bool(true)], xtrata).result)
      .toBeErr(Cl.uint(108));
  });
});
