/**
 * Xtrata Music Hero awards (contracts/live/xtrata-music-awards-v1.0.clar, docs/music/AWARDS-INSCRIPTION.md),
 * against the real Xtrata core in simulation. Nothing here touches a network.
 *
 * What is proven: a claim with a genuine note inscribes the record as the contract, pays Xtrata's fee from the
 * contract's balance, and leaves the inscription with the hero; and every way of cheating a note is refused with
 * nothing inscribed, nothing paid and nothing recorded.
 */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Cl, hash160, privateKeyToPublic, serializeCV, signMessageHashRsv } from '@stacks/transactions';
import { beforeEach, describe, expect, it } from 'vitest';

const acc = simnet.getAccounts();
const admin = acc.get('deployer')!, hero = acc.get('wallet_1')!, other = acc.get('wallet_2')!, third = acc.get('wallet_3')!;
const CORE = 'xtrata-v3-2-3';
const NAME = 'music-awards-test';
const MAINNET = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
// Test-only keys: they sign notes in this simulation and exist nowhere else.
const SIGNER = '2ae156d224f73bfee9d1d52e0210012b4ae4e85df2705f4f25b7ac62db45aa3b01';
const STRANGER = '1c83f3b0b8fc8af8c7c4e336f4f9cdf4dbc8f6b8e1f3ebec705fca8d98379e4e01';
const DROP = 1n, GOLD = 2n, DIAMOND = 1n;
const FEE = 102_000n; // the core's defaults: 100,000 for a single-transaction inscription + 2,000 for its one chunk

const sha = (b: Uint8Array) => createHash('sha256').update(b).digest();
const xtrataHash = (data: Uint8Array) => sha(Buffer.concat([Buffer.alloc(32), data]));
const stx = (who: string) => simnet.getAssetsMap().get('STX')!.get(who) ?? 0n;
const hex = (cv: any) => { const s = serializeCV(cv) as unknown as string; return s.startsWith('0x') ? s.slice(2) : s; };
const pub = (name = NAME) => (fn: string, args: any[], sender: string) => simnet.callPublicFn(name, fn, args, sender);
const ro = (fn: string, args: any[] = [], name = NAME) => simnet.callReadOnlyFn(name, fn, args, admin).result;
const core = (fn: string, args: any[]) => simnet.callReadOnlyFn(CORE, fn, args, admin).result;
const lastId = () => core('get-last-token-id', []);
const signerHash = (key: string) => Cl.buffer(Uint8Array.from(hash160(Uint8Array.from(Buffer.from(privateKeyToPublic(key) as string, 'hex')))));

let template: bigint;
let chain: bigint;

/** The record exactly as the server would build it: a tiny page that opens the class's template with this hero's details. */
const recordFor = (who: string, number: bigint, plays = 50n, bns = '') => Buffer.from(
  `<!doctype html><meta charset=utf-8><title>Xtrata Music Hero · Gold record No. ${String(number).padStart(4, '0')}</title>` +
  `<style>html,body,iframe{margin:0;width:100%;height:100%;border:0;background:#040509}</style>` +
  `<iframe src="/i/${template}#n=${number}&a=${who}${bns ? '&b=' + bns : ''}&p=${plays}&s=9f3a61c2"></iframe>`);

type Note = { drop?: bigint; class?: bigint; number: bigint; plays?: bigint; hero: string; record: Uint8Array; key?: string; contract?: string };
/** The server's side: the same tuple the contract builds, serialised the standard way, sha256, signed. */
const noteHash = (n: Note) => sha(Buffer.from(hex(Cl.tuple({
  chain: Cl.uint(chain),
  class: Cl.uint(n.class ?? GOLD),
  contract: Cl.contractPrincipal(admin, n.contract ?? NAME),
  domain: Cl.stringAscii('xtrata-music-awards-v1'),
  drop: Cl.uint(n.drop ?? DROP),
  hero: Cl.standardPrincipal(n.hero),
  number: Cl.uint(n.number),
  plays: Cl.uint(n.plays ?? 50n),
  record: Cl.buffer(xtrataHash(n.record))
})), 'hex'));
const sign = (n: Note) => Cl.bufferFromHex(signMessageHashRsv({ messageHash: noteHash(n).toString('hex'), privateKey: n.key ?? SIGNER }) as unknown as string);
/** Claim as `sender` with `said` (what the transaction says) and a note signed over `signed` (what the server agreed to). */
const claim = (sender: string, said: Note, signed: Note = said, name = NAME) => simnet.callPublicFn(name, 'claim',
  [Cl.uint(said.drop ?? DROP), Cl.uint(said.class ?? GOLD), Cl.uint(said.number), Cl.uint(said.plays ?? 50n), Cl.buffer(said.record), sign(signed)], sender);

function deploy(name: string) {
  const source = readFileSync('../live/xtrata-music-awards-v1.0.clar', 'utf8').replaceAll(MAINNET, admin);
  expect(simnet.deployContract(name, source, { clarityVersion: 3 }, admin).result).toBeBool(true);
}
function setup() {
  deploy(NAME);
  simnet.callPublicFn(CORE, 'set-paused', [Cl.bool(false)], admin);
  // The Gold template, inscribed by the Xtrata wallet (the core's fee recipient, so it pays no fee).
  const page = Buffer.from('<!doctype html><title>Xtrata Music · Gold Record</title><p>template</p>');
  const made = simnet.callPublicFn(CORE, 'mint-single-tx', [Cl.buffer(xtrataHash(page)), Cl.stringAscii('text/html'), Cl.uint(page.length), Cl.list([Cl.buffer(page)]), Cl.stringAscii('https://xtrata.xyz/awards/gold')], admin).result as any;
  expect(made.type).toBe('ok');
  template = made.value.value['token-id'].value;
  chain = (ro('get-domain') as any).value.chain.value;
  expect(pub()('set-signer-hash', [Cl.some(signerHash(SIGNER))], admin).result).toBeOk(Cl.bool(true));
  expect(pub()('set-class', [Cl.uint(DROP), Cl.uint(GOLD), Cl.uint(template), Cl.uint(2)], admin).result).toBeOk(Cl.bool(true));
  simnet.transferSTX(1_000_000n, `${admin}.${NAME}`, admin);
}
/** Nothing was inscribed, paid or recorded. */
const untouched = (before: { id: any; bal: bigint }, who = hero) => {
  expect(lastId()).toEqual(before.id);
  expect(stx(`${admin}.${NAME}`)).toBe(before.bal);
  expect(ro('get-award-of', [Cl.uint(DROP), Cl.standardPrincipal(who)])).toBeNone();
};
const snapshot = () => ({ id: lastId(), bal: stx(`${admin}.${NAME}`) });

describe('Music Hero awards', () => {
  beforeEach(setup);

  it('a genuine claim inscribes the record as the contract, pays Xtrata from the contract balance, and the hero owns it', () => {
    const record = recordFor(hero, 412n, 50n, 'jim.btc');
    const contract = `${admin}.${NAME}`;
    const before = { contract: stx(contract), hero: stx(hero), xtrata: stx(admin) };
    const out = claim(hero, { number: 412n, hero, record });
    expect(out.result.type).toBe('ok');
    const id = (out.result as any).value.value['token-id'].value as bigint;
    expect((out.result as any).value.value.edition).toEqual(Cl.uint(1));

    // The hero holds a real Xtrata inscription...
    expect(core('get-owner', [Cl.uint(id)])).toBeOk(Cl.some(Cl.standardPrincipal(hero)));
    // ...whose bytes are exactly the record, as HTML, built from the Gold template.
    expect(core('get-chunk', [Cl.uint(id), Cl.uint(0)])).toBeSome(Cl.buffer(record));
    const meta = (core('get-inscription-meta', [Cl.uint(id)]) as any).value.value;
    expect(meta['mime-type']).toEqual(Cl.stringAscii('text/html'));
    expect(meta['total-size']).toEqual(Cl.uint(record.length));
    expect(meta['final-hash']).toEqual(Cl.buffer(xtrataHash(record)));
    expect(meta.creator).toEqual(Cl.contractPrincipal(admin, NAME));
    expect(JSON.stringify(core('get-dependencies', [Cl.uint(id)]))).toContain(String(template));

    // Xtrata's fee came out of the contract's balance and reached Xtrata. The hero paid nothing to the contract or the core.
    expect(stx(contract)).toBe(before.contract - FEE);
    expect(stx(admin)).toBe(before.xtrata + FEE);
    expect(stx(hero)).toBe(before.hero);

    // The award is written down, findable by token, by wall number and by hero.
    const award = Cl.tuple({ drop: Cl.uint(DROP), class: Cl.uint(GOLD), edition: Cl.uint(1), number: Cl.uint(412), plays: Cl.uint(50), hero: Cl.standardPrincipal(hero) });
    expect(ro('get-award', [Cl.uint(id)])).toBeSome(award);
    expect(ro('get-award-by-number', [Cl.uint(DROP), Cl.uint(412)])).toBeSome(Cl.uint(id));
    expect(ro('get-award-of', [Cl.uint(DROP), Cl.standardPrincipal(hero)])).toBeSome(Cl.uint(id));
    expect(ro('get-class', [Cl.uint(DROP), Cl.uint(GOLD)])).toBeSome(Cl.tuple({ template: Cl.uint(template), cap: Cl.uint(2), minted: Cl.uint(1) }));
    expect(out.events.some((e: any) => e.event === 'print_event' && JSON.stringify(e.data).includes('music-hero-award'))).toBe(true);
  });

  it('the server recipe for a note matches the contract, and so does the record hash', () => {
    const record = recordFor(hero, 7n);
    expect(ro('get-record-hash', [Cl.buffer(record)])).toEqual(Cl.buffer(xtrataHash(record)));
    expect(ro('get-note-hash', [Cl.uint(DROP), Cl.uint(GOLD), Cl.uint(7), Cl.uint(50), Cl.standardPrincipal(hero), Cl.buffer(xtrataHash(record))]))
      .toEqual(Cl.buffer(noteHash({ number: 7n, hero, record })));
  });

  it('refuses a note signed by anyone but the signer', () => {
    const before = snapshot(), record = recordFor(hero, 412n);
    expect(claim(hero, { number: 412n, hero, record, key: STRANGER }).result).toBeErr(Cl.uint(203));
    untouched(before);
  });

  it('refuses a note used by a different address', () => {
    const before = snapshot(), record = recordFor(hero, 412n);
    // The note says "hero"; `other` sends it.
    expect(claim(other, { number: 412n, hero: other, record }, { number: 412n, hero, record }).result).toBeErr(Cl.uint(203));
    untouched(before, other);
  });

  it('refuses a record that differs from the signed one by a single character', () => {
    const before = snapshot(), record = recordFor(hero, 412n, 50n, 'jim.btc');
    const forged = Buffer.from(record.toString().replace('jim.btc', 'jam.btc'));
    expect(forged.length).toBe(record.length);
    expect(claim(hero, { number: 412n, hero, record: forged }, { number: 412n, hero, record }).result).toBeErr(Cl.uint(203));
    untouched(before);
  });

  it('refuses a changed class, wall number, play count or drop', () => {
    const before = snapshot(), record = recordFor(hero, 412n), signed: Note = { number: 412n, hero, record };
    pub()('set-class', [Cl.uint(DROP), Cl.uint(DIAMOND), Cl.uint(template), Cl.uint(5)], admin);
    pub()('set-class', [Cl.uint(2), Cl.uint(GOLD), Cl.uint(template), Cl.uint(5)], admin);
    expect(claim(hero, { ...signed, class: DIAMOND }, signed).result).toBeErr(Cl.uint(203)); // a Gold note cannot mint a Diamond
    expect(claim(hero, { ...signed, number: 1n }, signed).result).toBeErr(Cl.uint(203));
    expect(claim(hero, { ...signed, plays: 5000n }, signed).result).toBeErr(Cl.uint(203));
    expect(claim(hero, { ...signed, drop: 2n }, signed).result).toBeErr(Cl.uint(203));
    untouched(before);
  });

  it('a note for one deployment is worthless on another', () => {
    const twin = 'music-awards-twin';
    deploy(twin);
    pub(twin)('set-signer-hash', [Cl.some(signerHash(SIGNER))], admin);
    pub(twin)('set-class', [Cl.uint(DROP), Cl.uint(GOLD), Cl.uint(template), Cl.uint(2)], admin);
    simnet.transferSTX(1_000_000n, `${admin}.${twin}`, admin);
    const record = recordFor(hero, 412n), id = lastId();
    expect(claim(hero, { number: 412n, hero, record }, { number: 412n, hero, record }, twin).result).toBeErr(Cl.uint(203));
    expect(lastId()).toEqual(id);
    // Signed for the twin itself, it is good there.
    expect(claim(hero, { number: 412n, hero, record, contract: twin }, { number: 412n, hero, record, contract: twin }, twin).result.type).toBe('ok');
  });

  it('gives one award per hero and one per wall number, and a used note cannot be used again', () => {
    const first: Note = { number: 412n, hero, record: recordFor(hero, 412n) };
    expect(claim(hero, first).result.type).toBe('ok');
    const before = snapshot();
    expect(claim(hero, first).result).toBeErr(Cl.uint(204));                                              // the same note again
    expect(claim(hero, { number: 413n, hero, record: recordFor(hero, 413n) }).result).toBeErr(Cl.uint(205)); // a second award for the same hero
    expect(claim(other, { number: 412n, hero: other, record: recordFor(other, 412n) }).result).toBeErr(Cl.uint(204)); // the same wall number for someone else
    expect(lastId()).toEqual(before.id);
    expect(stx(`${admin}.${NAME}`)).toBe(before.bal);
  });

  it('never makes more of a class than the owner allowed, and numbers the editions in order', () => {
    const a = claim(hero, { number: 1n, hero, record: recordFor(hero, 1n) }).result as any;
    const b = claim(other, { number: 2n, hero: other, record: recordFor(other, 2n) }).result as any;
    expect(a.value.value.edition).toEqual(Cl.uint(1));
    expect(b.value.value.edition).toEqual(Cl.uint(2));
    const before = snapshot();
    expect(claim(third, { number: 3n, hero: third, record: recordFor(third, 3n) }).result).toBeErr(Cl.uint(207));
    untouched(before, third);
    // The owner cannot set a cap below what exists, but can raise it.
    expect(pub()('set-class', [Cl.uint(DROP), Cl.uint(GOLD), Cl.uint(template), Cl.uint(1)], admin).result).toBeErr(Cl.uint(209));
    expect(pub()('set-class', [Cl.uint(DROP), Cl.uint(GOLD), Cl.uint(template), Cl.uint(3)], admin).result).toBeOk(Cl.bool(true));
    expect((claim(third, { number: 3n, hero: third, record: recordFor(third, 3n) }).result as any).value.value.edition).toEqual(Cl.uint(3));
  });

  it('fails cleanly when the contract cannot cover the fee: nothing inscribed, nothing recorded', () => {
    expect(pub()('withdraw', [Cl.uint(stx(`${admin}.${NAME}`) - 1000n), Cl.standardPrincipal(admin)], admin).result).toBeOk(Cl.bool(true));
    const before = snapshot();
    const out = claim(hero, { number: 412n, hero, record: recordFor(hero, 412n) }).result;
    expect(out.type).toBe('err');
    untouched(before);
    // Topped up, the very same note works.
    simnet.transferSTX(FEE, `${admin}.${NAME}`, admin);
    expect(claim(hero, { number: 412n, hero, record: recordFor(hero, 412n) }).result.type).toBe('ok');
    expect(stx(`${admin}.${NAME}`)).toBe(1000n);
  });

  it('refuses when no class, no signer or no template is set, when paused, and for an empty record or wall number 0', () => {
    const record = recordFor(hero, 412n), before = snapshot();
    expect(claim(hero, { number: 412n, hero, record, class: 4n }).result).toBeErr(Cl.uint(206));
    expect(claim(hero, { number: 0n, hero, record }).result).toBeErr(Cl.uint(209));
    expect(claim(hero, { number: 412n, hero, record: new Uint8Array(0) }).result).toBeErr(Cl.uint(208));
    pub()('set-paused', [Cl.bool(true)], admin);
    expect(claim(hero, { number: 412n, hero, record }).result).toBeErr(Cl.uint(201));
    pub()('set-paused', [Cl.bool(false)], admin);
    pub()('set-signer-hash', [Cl.none()], admin);
    expect(claim(hero, { number: 412n, hero, record }).result).toBeErr(Cl.uint(202));
    pub()('set-signer-hash', [Cl.some(signerHash(SIGNER))], admin);
    // A class pointed at a template that does not exist: the core refuses (its error 111).
    pub()('set-class', [Cl.uint(DROP), Cl.uint(3), Cl.uint(999_999), Cl.uint(5)], admin);
    expect(claim(hero, { number: 412n, hero, record, class: 3n }).result).toBeErr(Cl.uint(111));
    untouched(before);
  });

  it('stops while the Xtrata core is paused, unless Xtrata has let this contract through', () => {
    const note: Note = { number: 412n, hero, record: recordFor(hero, 412n) }, before = snapshot();
    simnet.callPublicFn(CORE, 'set-paused', [Cl.bool(true)], admin);
    expect(claim(hero, note).result).toBeErr(Cl.uint(109));
    untouched(before);
    expect(simnet.callPublicFn(CORE, 'set-allowed-caller', [Cl.contractPrincipal(admin, NAME), Cl.bool(true)], admin).result).toBeOk(Cl.bool(true));
    expect(claim(hero, note).result.type).toBe('ok');
  });

  it('the award can be sent on like any inscription, and still names the hero who earned it', () => {
    const id = (claim(hero, { number: 412n, hero, record: recordFor(hero, 412n) }).result as any).value.value['token-id'].value as bigint;
    expect(simnet.callPublicFn(CORE, 'transfer', [Cl.uint(id), Cl.standardPrincipal(hero), Cl.standardPrincipal(other)], hero).result).toBeOk(Cl.bool(true));
    expect(core('get-owner', [Cl.uint(id)])).toBeOk(Cl.some(Cl.standardPrincipal(other)));
    expect((ro('get-award', [Cl.uint(id)]) as any).value.value.hero).toEqual(Cl.standardPrincipal(hero));
    // Holding someone else's award does not use up the new holder's own claim; the first hero cannot claim twice.
    expect(claim(other, { number: 9n, hero: other, record: recordFor(other, 9n) }).result.type).toBe('ok');
    expect(claim(hero, { number: 10n, hero, record: recordFor(hero, 10n) }).result).toBeErr(Cl.uint(205));
  });

  it('only the owner can change settings or take balance out', () => {
    for (const [fn, args] of [
      ['set-signer-hash', [Cl.some(signerHash(STRANGER))]],
      ['set-class', [Cl.uint(DROP), Cl.uint(GOLD), Cl.uint(template), Cl.uint(900)]],
      ['set-paused', [Cl.bool(true)]],
      ['set-token-uri', [Cl.stringAscii('https://example.invalid')]],
      ['withdraw', [Cl.uint(1000), Cl.standardPrincipal(other)]],
      ['recover', [Cl.uint(template), Cl.standardPrincipal(other)]],
      ['transfer-contract-ownership', [Cl.standardPrincipal(other)]]
    ] as [string, any[]][]) expect(pub()(fn, args, other).result).toBeErr(Cl.uint(200));
    // Ownership handed over: the new owner can, the old one cannot.
    expect(pub()('transfer-contract-ownership', [Cl.standardPrincipal(other)], admin).result).toBeOk(Cl.bool(true));
    expect(pub()('set-paused', [Cl.bool(true)], admin).result).toBeErr(Cl.uint(200));
    const bal = stx(other);
    expect(pub()('withdraw', [Cl.uint(250_000), Cl.standardPrincipal(other)], other).result).toBeOk(Cl.bool(true));
    expect(stx(other)).toBe(bal + 250_000n);
    expect(ro('get-balance')).toBeOk(Cl.uint(750_000));
  });

  it('an inscription sent to the contract by mistake can be sent back by the owner', () => {
    expect(simnet.callPublicFn(CORE, 'transfer', [Cl.uint(template), Cl.standardPrincipal(admin), Cl.contractPrincipal(admin, NAME)], admin).result).toBeOk(Cl.bool(true));
    expect(pub()('recover', [Cl.uint(template), Cl.standardPrincipal(admin)], admin).result).toBeOk(Cl.bool(true));
    expect(core('get-owner', [Cl.uint(template)])).toBeOk(Cl.some(Cl.standardPrincipal(admin)));
  });
});
