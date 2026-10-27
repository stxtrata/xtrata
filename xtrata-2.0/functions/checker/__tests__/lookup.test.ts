// @vitest-environment node
import { beforeEach, describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { DATASET_KEY, handleCheckerLookup, resetDatasetCache } from '../lookup';

const { DatabaseSync } = createRequire(import.meta.url)('node:sqlite');
const now = 1_790_000_000_000;
const HOUR = 3600_000;

const fixtureText = readFileSync(new URL('./fixtures/checker-data.sample.json', import.meta.url), 'utf8');
const fixture = JSON.parse(fixtureText);

const ROBOTS = 'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.megapont-robot-nft';
const SATO = 'SP6P4EJF0VG8V0RB3TQQKJBHDQKEF6NVRD1KZE3C.satoshibles';
const BIRDS = 'SPJW1XE278YMCEYMXB8ZFGJMH8ZVAAEDP2S2PJYG.bitcoin-birds';
const INVADERS = 'SPV8C2N59MA417HYQNG6372GCV0SEQE01EV4Z1RQ.stacks-invaders-v0';
const INDIGO = 'SP13FGF6PCW49BG2FB64TQ6VG5HFJ39E5S98ZM07Q.project-indigo-equipment-series-2';
const BNS = 'SP000000000000000000002Q6VF78.bns';
const PEPES = 'SP2MK912MX96JXJ5A6R92KV64P7J7ZWDWPZ9PJG6C.spacepepesbtc';
const XTRATA = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const XTRATA_OLD = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0';
const HELPER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.forever-twin-bitcoin-birds';
const UNKNOWN = 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.some-other-collection';
const WALLET = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';

// ---------- fakes ----------

function bucket(content: string | null | Error = fixtureText) {
  const fake = {
    gets: 0,
    content,
    async get(key: string) {
      fake.gets += 1;
      if (key !== DATASET_KEY) return null;
      if (fake.content instanceof Error) throw fake.content;
      return fake.content === null ? null : { text: async () => fake.content as string };
    }
  };
  return fake;
}

function database(options: { migrate?: boolean; demand?: boolean } = {}) {
  const sql = new DatabaseSync(':memory:');
  if (options.migrate !== false) {
    sql.exec(readFileSync('functions/migrations/031_checker_requests.sql', 'utf8'));
    if (options.demand !== false) sql.exec(readFileSync('functions/migrations/032_checker_demand.sql', 'utf8'));
  }
  return {
    sql,
    async batch(statements: any[]) { for (const statement of statements) await statement.run(); return []; },
    prepare(query: string) {
      let args: any[] = [];
      return {
        bind(...v: any[]) { args = v; return this; },
        async first() { return sql.prepare(query).get(...args) || null; },
        async run() { return sql.prepare(query).run(...args); },
        async all() { return { results: sql.prepare(query).all(...args) }; }
      };
    }
  };
}

const assets = (contract: string, n: number, asset = 'nft') => Array.from({ length: n }, () => `${contract}::${asset}`);
const pageOf = (all: string[], offset: number, total = all.length, limit = 200) => ({
  limit, offset, total, results: all.slice(offset, offset + limit).map((asset_identifier) => ({ asset_identifier, value: { hex: '0x01', repr: 'u1' }, block_height: 1, tx_id: '0x00' }))
});
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

type Seen = { url: URL; headers: Headers };
function hiro(handler: (seen: Seen, call: number) => Response | Promise<Response>) {
  const calls: Seen[] = [];
  const fetcher = (async (input: any, init: any) => {
    const seen = { url: new URL(String(input)), headers: new Headers(init?.headers) };
    calls.push(seen);
    return handler(seen, calls.length);
  }) as unknown as typeof fetch;
  return { calls, fetcher };
}
const walletHolding = (all: string[], total = all.length) => hiro(({ url }) => json(pageOf(all, Number(url.searchParams.get('offset')), total)));
const neverCalled = () => hiro(() => { throw new Error('Hiro should not be called'); });

type Options = { time?: number; origin?: string | null; ip?: string; type?: string; raw?: string; method?: string; fetcher?: typeof fetch; sleeps?: number[] };
const ask = async (env: any, q: unknown, o: Options = {}) => {
  const res = await handleCheckerLookup(new Request('https://xtrata.xyz/checker/lookup', {
    method: o.method ?? 'POST',
    headers: { 'content-type': o.type ?? 'application/json', 'CF-Connecting-IP': o.ip ?? '203.0.113.7', ...(o.origin === null ? {} : { origin: o.origin ?? 'https://xtrata.xyz' }) },
    ...((o.method ?? 'POST') === 'POST' ? { body: o.raw ?? JSON.stringify({ q }) } : {})
  }), env, { now: o.time ?? now, fetcher: o.fetcher, sleep: async (ms) => { o.sleeps?.push(ms); } });
  const text = await res.text();
  return { res, text, body: (text ? JSON.parse(text) : null) as any };
};
const envOf = (extra: Record<string, unknown> = {}) => ({ COLLECTION_ASSETS: bucket(), ...extra });

beforeEach(() => resetDatasetCache());

// ---------- tests ----------

describe('/checker/lookup: refusing', () => {
  it('answers only POST', async () => {
    const { res } = await ask(envOf(), 'x', { method: 'GET' });
    expect(res.status).toBe(405);
    expect(res.headers.get('Allow')).toBe('POST');
  });

  it('refuses another origin', async () => {
    expect((await ask(envOf(), BIRDS, { origin: 'https://evil.example' })).res.status).toBe(403);
    expect((await ask(envOf(), BIRDS, { origin: null })).res.status).toBe(200);
  });

  it.each([
    ['not JSON', { raw: 'hello' }],
    ['wrong content type', { type: 'text/plain' }],
    ['too large', { raw: JSON.stringify({ q: 'a'.repeat(5000) }) }],
    ['missing q', { raw: JSON.stringify({}) }],
    ['q not a string', { raw: JSON.stringify({ q: 42 }) }],
    ['blank q', { raw: JSON.stringify({ q: '   ' }) }],
    ['array body', { raw: JSON.stringify([BIRDS]) }]
  ])('rejects %s with a 400 that says what to do', async (_name, options) => {
    const { res, body } = await ask(envOf(), '', options as Options);
    expect(res.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.error).toBe('bad_request');
  });

  it('rejects a query that is too long to be a link or an address', async () => {
    const { res, body } = await ask(envOf(), 'a'.repeat(2001));
    expect(res.status).toBe(400);
    expect(body.message).toMatch(/too long/);
  });

  it('is never cached and never indexed', async () => {
    const { res } = await ask(envOf(), BIRDS);
    expect(res.headers.get('Cache-Control')).toBe('no-store');
    expect(res.headers.get('X-Robots-Tag')).toBe('noindex');
  });
});

describe('/checker/lookup: the research data', () => {
  it('says so when the checker is not switched on (no bucket)', async () => {
    const { res, body } = await ask({}, BIRDS);
    expect(res.status).toBe(503);
    expect(body.error).toBe('not_switched_on');
  });

  it('says the data is not loaded, and that this is not a result, when the object is missing', async () => {
    const { res, body } = await ask({ COLLECTION_ASSETS: bucket(null) }, BIRDS);
    expect(res.status).toBe(503);
    expect(body.error).toBe('data_not_loaded');
    expect(body.message).toMatch(/not a result/);
    expect(body.results).toBeUndefined();
  });

  it('says it cannot read the data (not "no results") when R2 fails', async () => {
    const { res, body } = await ask({ COLLECTION_ASSETS: bucket(new Error('R2 down: secret/internal/path')) }, BIRDS);
    expect(res.status).toBe(503);
    expect(body.error).toBe('data_unavailable');
    expect(body.message).not.toMatch(/secret|R2/);
  });

  it.each([
    ['broken JSON', '{not json'],
    ['wrong schema', JSON.stringify({ ...fixture, schema: 2 })],
    ['no collections', JSON.stringify({ ...fixture, collections: {} })],
    ['a record with an unknown status', JSON.stringify({ ...fixture, collections: { x: { ...fixture.collections[BIRDS], status: 'mystery' } } })],
    ['a record without a name', JSON.stringify({ ...fixture, collections: { x: { ...fixture.collections[BIRDS], name: undefined } } })]
  ])('refuses to answer from data that is %s', async (_name, content) => {
    const { res, body } = await ask({ COLLECTION_ASSETS: bucket(content) }, BIRDS);
    expect(res.status).toBe(500);
    expect(body.error).toBe('data_unreadable');
  });

  it('reads the data once per five minutes, not once per lookup', async () => {
    const r2 = bucket();
    const env = { COLLECTION_ASSETS: r2 };
    await ask(env, BIRDS);
    await ask(env, SATO, { time: now + 4 * 60_000 });
    expect(r2.gets).toBe(1);
    await ask(env, SATO, { time: now + 6 * 60_000 });
    expect(r2.gets).toBe(2);
  });

  it('uses a stale copy (under an hour old) if a refresh fails, and stops trusting it after that', async () => {
    const r2 = bucket();
    const env = { COLLECTION_ASSETS: r2 };
    expect((await ask(env, BIRDS)).res.status).toBe(200);
    r2.content = new Error('boom');
    expect((await ask(env, BIRDS, { time: now + 30 * 60_000 })).res.status).toBe(200);
    expect((await ask(env, BIRDS, { time: now + 61 * 60_000 })).res.status).toBe(503);
  });

  it('tells the page how old the data is', async () => {
    const { body } = await ask(envOf(), BIRDS);
    expect(body.dataset).toMatchObject({ generated: fixture.generated, census_date: '2026-10-13', retest_date: '2026-10-16', frozen_flags_read: false });
    expect(body.caveats.length).toBeGreaterThan(0);
  });
});

describe('/checker/lookup: a contract', () => {
  it('returns the report card for a collection we have', async () => {
    const { res, body } = await ask(envOf(), BIRDS);
    expect(res.status).toBe(200);
    expect(body.kind).toBe('contract');
    expect(body.results).toHaveLength(1);
    expect(body.results[0]).toMatchObject({ covered: true, id: BIRDS, name: 'Bitcoin Birds', status: 'marketplace_only', label: "Only the marketplace's copy still works" });
    expect(body.results[0].worry.length).toBeGreaterThan(0);
    expect(body.results[0].checked).toMatchObject({ contract: '2026-10-16' });
    expect(body.results[0].held).toBeUndefined();
  });

  it('does not leak fields the page does not need', async () => {
    const { body } = await ask(envOf(), BIRDS);
    expect(Object.keys(body.results[0]).sort()).toEqual([
      'checked', 'covered', 'deployed', 'evidence', 'evidence_level', 'good', 'headline', 'helper', 'id', 'label', 'name', 'status', 'summary', 'tags', 'tokens_approx', 'worry'
    ]);
  });

  it('says plainly when we have no report on a contract, without claiming anything about it', async () => {
    const { res, body } = await ask(envOf(), UNKNOWN);
    expect(res.status).toBe(200);
    expect(body.results).toEqual([{ covered: false, id: UNKNOWN }]);
  });

  it('finds the contract inside a link, lower-case, or an asset identifier', async () => {
    for (const q of [
      `https://explorer.hiro.so/txid/${BIRDS}?chain=mainnet`,
      `https://explorer.hiro.so/address/${BIRDS}?chain=mainnet`,
      `${BIRDS.split('.')[0].toLowerCase()}.${BIRDS.split('.')[1]}`,
      `${BIRDS}::bitcoin-bird`,
      `  my collection is ${BIRDS}, thanks `
    ]) {
      const { body } = await ask(envOf(), q);
      expect(body.kind, q).toBe('contract');
      expect(body.results[0].id, q).toBe(BIRDS);
    }
  });

  it('does not call Hiro for a contract', async () => {
    const h = neverCalled();
    expect((await ask(envOf(), BIRDS, { fetcher: h.fetcher })).res.status).toBe(200);
    expect(h.calls).toHaveLength(0);
  });

  it('gives a mistyped contract address a clear notice, not a "not found"', async () => {
    const { res, body } = await ask(envOf(), BIRDS.replace('SPJW1XE278', 'SPJW1XE279'));
    expect(res.status).toBe(200);
    expect(body).toMatchObject({ kind: 'notice', code: 'invalid_address', results: [] });
    expect(body.message).toMatch(/typo/);
  });

  it('recognises a testnet address and says the checker is mainnet only', async () => {
    const { body } = await ask(envOf(), 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
    expect(body).toMatchObject({ kind: 'notice', code: 'testnet' });
  });

  it('gives Xtrata core contracts the by-design card, flagged as not sampled', async () => {
    for (const id of [XTRATA, XTRATA_OLD]) {
      const { body } = await ask(envOf(), id);
      expect(body.results).toHaveLength(1);
      expect(body.results[0]).toMatchObject({ covered: true, special: 'xtrata', status: 'on_chain', evidence_level: 'by_design', label: 'Stored on chain' });
      expect(body.results[0].evidence).toMatch(/did not sample/);
    }
  });

  it('does not give a Forever Twins helper contract the Xtrata card', async () => {
    const { body } = await ask(envOf(), HELPER);
    expect(body.results).toEqual([{ covered: false, id: HELPER }]);
  });
});

describe('/checker/lookup: a link or a name', () => {
  it('matches a marketplace collection link by its slug', async () => {
    for (const q of ['https://gamma.io/collections/bitcoin-birds', 'gamma.io/collections/bitcoin-birds/12', 'https://gamma.io/collections/bitcoin-birds/12?sort=price#top']) {
      const { body } = await ask(envOf(), q);
      expect(body.kind, q).toBe('collection');
      expect(body.matched_from).toBe('link');
      expect(body.results.map((r: any) => r.id), q).toEqual([BIRDS]);
    }
  });

  it('matches by contract name or by a typed name, exactly', async () => {
    expect((await ask(envOf(), 'https://gamma.io/collections/spacepepesbtc')).body.results.map((r: any) => r.id)).toEqual([PEPES]);
    const typed = (await ask(envOf(), '  Bitcoin   Birds ')).body;
    expect(typed).toMatchObject({ kind: 'collection', matched_from: 'text' });
    expect(typed.results.map((r: any) => r.id)).toEqual([BIRDS]);
    expect((await ask(envOf(), 'satoshibles')).body.results.map((r: any) => r.id)).toEqual([SATO]);
  });

  it('does not turn a few letters into a list: no partial matching', async () => {
    for (const q of ['bitcoin', 'sato', 'b', 'https://gamma.io/collections/bitcoin']) {
      const { res, body } = await ask(envOf(), q);
      expect(res.status).toBe(200);
      expect(body.results, q).toEqual([]);
      expect(body.message, q).toMatch(/contract address/);
    }
  });

  it('says it could not tell, and suggests the contract or a wallet, when a link names nothing we know', async () => {
    const { body } = await ask(envOf(), 'https://gamma.io/collections/never-heard-of-it/55');
    expect(body.results).toEqual([]);
    expect(body.tried).toEqual(['never-heard-of-it']);
    expect(body.message).toMatch(/could not tell which collection/);
  });

  it('ignores generic path words and bare numbers', async () => {
    const { body } = await ask(envOf(), 'https://gamma.io/collections/42/');
    expect(body.results).toEqual([]);
    expect(body.tried).toEqual([]);
  });

  it('returns every collection that shares an exact name, capped at five', async () => {
    const clones: Record<string, any> = {};
    for (let i = 0; i < 7; i += 1) {
      const id = `${SATO.split('.')[0]}.sato-clone-${i}`;
      clones[id] = { ...fixture.collections[SATO], id, name: 'Satoshibles' };
    }
    const content = JSON.stringify({ ...fixture, collections: { ...fixture.collections, ...clones } });
    const { body } = await ask({ COLLECTION_ASSETS: bucket(content) }, 'Satoshibles');
    expect(body.results).toHaveLength(5);
    expect(body.results.every((r: any) => r.name === 'Satoshibles')).toBe(true);
  });

  it('says a BNS name or a Bitcoin address is not supported yet, and why', async () => {
    const bns = (await ask(envOf(), 'satoshi.btc')).body;
    expect(bns).toMatchObject({ kind: 'notice', code: 'bns_not_supported', results: [] });
    const btc = (await ask(envOf(), 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq')).body;
    expect(btc).toMatchObject({ kind: 'notice', code: 'bitcoin_not_supported' });
    const legacy = (await ask(envOf(), '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2')).body;
    expect(legacy).toMatchObject({ kind: 'notice', code: 'bitcoin_not_supported' });
  });
});

describe('/checker/lookup: a wallet', () => {
  const holdings = [
    ...assets(SATO, 3), ...assets(ROBOTS, 2), ...assets(BIRDS, 1), ...assets(INVADERS, 4), ...assets(INDIGO, 1),
    ...assets(BNS, 2, 'names'), ...assets(PEPES, 5), ...assets(XTRATA, 3, 'xtrata-inscription'), ...assets(XTRATA_OLD, 2, 'xtrata-inscription'),
    ...assets(UNKNOWN, 6), ...assets('SP1SCEXE6PMGPAC6B4N5P2MDKX8V4GF9QDE1FNNGJ.other-thing', 1, 'thing')
  ];

  it('groups holdings by collection, worst first, with the count held', async () => {
    const h = walletHolding(holdings);
    const { res, body } = await ask(envOf(), WALLET, { fetcher: h.fetcher });
    expect(res.status).toBe(200);
    expect(body.kind).toBe('wallet');
    expect(body.results.map((r: any) => [r.name, r.status, r.held])).toEqual([
      ['Megapont Robots', 'not_found', 2],
      ['Bitcoin Birds', 'marketplace_only', 1],
      ['Space Pepes', 'marketplace_broken', 5],
      ['Satoshibles', 'one_host', 3],
      ['Project Indigo Equipment Series 2', 'solid', 1],
      ['Stacks Invaders', 'on_chain', 4],
      ['Xtrata inscription', 'on_chain', 5],
      ['BNS: Bitcoin Name System (V1 - Legacy)', 'not_art', 2]
    ]);
    expect(body.wallet).toEqual({
      items_total: holdings.length, items_read: holdings.length, complete: true, stopped: null,
      collections_held: 11, collections_covered: 8, collections_not_covered: 2, items_in_reports: 3 + 2 + 1 + 4 + 1 + 2 + 5 + 3 + 2, items_not_covered: 7
    });
    expect(body.wallet.items_in_reports + body.wallet.items_not_covered).toBe(holdings.length);
  });

  it('lists what is not in the research separately, biggest first, and counts it', async () => {
    const { body } = await ask(envOf(), WALLET, { fetcher: walletHolding(holdings).fetcher });
    expect(body.others).toEqual([
      { id: UNKNOWN, asset: 'nft', held: 6 },
      { id: 'SP1SCEXE6PMGPAC6B4N5P2MDKX8V4GF9QDE1FNNGJ.other-thing', asset: 'thing', held: 1 }
    ]);
    expect(body.others_total).toBe(2);
  });

  it('caps the "others" list but still reports how many there are, and counts every item', async () => {
    const many = Array.from({ length: 230 }, (_v, i) => `SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.c${String(i).padStart(3, '0')}::nft`);
    const { body } = await ask(envOf(), WALLET, { fetcher: walletHolding(many).fetcher });
    expect(body.others).toHaveLength(200);
    expect(body.others_total).toBe(230);
    expect(body.wallet).toMatchObject({ collections_not_covered: 230, items_not_covered: 230, items_in_reports: 0 });
  });

  it('asks Hiro for 200 at a time and reads every page until the end', async () => {
    const big = [...assets(SATO, 450)];
    const h = walletHolding(big);
    const { body } = await ask(envOf(), WALLET, { fetcher: h.fetcher });
    expect(h.calls.map((c) => [c.url.searchParams.get('principal'), c.url.searchParams.get('limit'), c.url.searchParams.get('offset')])).toEqual([
      [WALLET, '200', '0'], [WALLET, '200', '200'], [WALLET, '200', '400']
    ]);
    expect(h.calls[0].url.origin + h.calls[0].url.pathname).toBe('https://api.hiro.so/extended/v1/tokens/nft/holdings');
    expect(body.results[0].held).toBe(450);
    expect(body.wallet).toMatchObject({ items_total: 450, items_read: 450, complete: true, stopped: null });
  });

  it('stops at 1000 items and says it did not read the rest', async () => {
    const h = walletHolding(assets(SATO, 1200));
    const { body } = await ask(envOf(), WALLET, { fetcher: h.fetcher });
    expect(h.calls).toHaveLength(5);
    expect(body.wallet).toMatchObject({ items_total: 1200, items_read: 1000, complete: false, stopped: 'cap' });
    expect(body.results[0].held).toBe(1000);
  });

  it('keeps what it read, and says so, when a later page fails', async () => {
    const all = assets(SATO, 450);
    const h = hiro(({ url }, call) => (call === 1 ? json(pageOf(all, 0)) : json({ error: 'nope' }, 500)));
    const { res, body } = await ask(envOf(), WALLET, { fetcher: h.fetcher, sleeps: [] });
    expect(res.status).toBe(200);
    expect(body.wallet).toMatchObject({ items_total: 450, items_read: 200, complete: false, stopped: 'read_failed' });
    expect(body.results[0].held).toBe(200);
  });

  it('says it could not read the wallet, not that it is empty, when the first read fails', async () => {
    for (const bad of [
      hiro(() => json({}, 500)),
      hiro(() => { throw new TypeError('fetch failed'); }),
      hiro(() => json({ results: 'nope', total: 3 })),
      hiro(() => json({ results: [{ asset_identifier: 'no-separator' }], total: 1 })),
      hiro(() => json({ results: [], total: 4 })),
      hiro(() => new Response('<html>', { status: 200 })),
      hiro(() => json({}, 400))
    ]) {
      const { res, body } = await ask(envOf(), WALLET, { fetcher: bad.fetcher, sleeps: [] });
      expect(res.status).toBe(503); // never 502/504: Cloudflare swaps those for its own page on the live domain
      expect(body).toMatchObject({ ok: false, error: 'holdings_unavailable' });
      expect(body.reason).toMatch(/^(HTTP \d{3}|network|timed out|unreadable answer|unexpected answer|inconsistent answer|no answer)$/);
      expect(body.message).toMatch(/does not mean it is empty/);
      expect(body.results).toBeUndefined();
    }
  });

  it('reports a wallet with nothing in it as empty (an answer), distinct from a failed read', async () => {
    const { res, body } = await ask(envOf(), WALLET, { fetcher: walletHolding([]).fetcher });
    expect(res.status).toBe(200);
    expect(body).toMatchObject({ kind: 'wallet', results: [], others: [], others_total: 0 });
    expect(body.wallet).toMatchObject({ items_total: 0, items_read: 0, complete: true, stopped: null });
  });

  it('rotates to the next Hiro key on 429, and sends the key', async () => {
    const h = hiro(({ headers, url }) => (headers.get('x-hiro-api-key') === 'key-one' ? json({}, 429) : json(pageOf(assets(SATO, 2), Number(url.searchParams.get('offset'))))));
    const { res, body } = await ask(envOf({ HIRO_API_KEY_1: 'key-one', HIRO_API_KEY_2: 'key-two' }), WALLET, { fetcher: h.fetcher });
    expect(res.status).toBe(200);
    expect(body.results[0].held).toBe(2);
    expect(h.calls.map((c) => c.headers.get('x-hiro-api-key'))).toEqual(['key-one', 'key-two']);
  });

  it('retries a brief upstream failure once after a pause', async () => {
    const sleeps: number[] = [];
    const h = hiro(({ url }, call) => (call === 1 ? json({}, 503) : json(pageOf(assets(SATO, 1), Number(url.searchParams.get('offset'))))));
    const { res } = await ask(envOf(), WALLET, { fetcher: h.fetcher, sleeps });
    expect(res.status).toBe(200);
    expect(h.calls).toHaveLength(2);
    expect(sleeps).toEqual([400]);
  });

  it('works without any Hiro key', async () => {
    const h = walletHolding(assets(SATO, 1));
    await ask(envOf(), WALLET, { fetcher: h.fetcher });
    expect(h.calls[0].headers.get('x-hiro-api-key')).toBeNull();
  });

  it('finds the address inside an explorer link, in lower case', async () => {
    const h = walletHolding(assets(SATO, 1));
    const { body } = await ask(envOf(), `https://explorer.hiro.so/address/${WALLET.toLowerCase()}?chain=mainnet`, { fetcher: h.fetcher });
    expect(body.kind).toBe('wallet');
    expect(h.calls[0].url.searchParams.get('principal')).toBe(WALLET);
  });

  it('does not call Hiro for a mistyped address, and says it looks mistyped', async () => {
    const h = neverCalled();
    const typo = WALLET.replace('SP2J6ZY48G', 'SP2J6ZY49G');
    const { body } = await ask(envOf(), typo, { fetcher: h.fetcher });
    expect(body).toMatchObject({ kind: 'notice', code: 'invalid_address' });
    expect(h.calls).toHaveLength(0);
    const short = (await ask(envOf(), WALLET.slice(0, 30), { fetcher: h.fetcher })).body;
    expect(short).toMatchObject({ kind: 'notice', code: 'invalid_address' });
  });

  it('never repeats the wallet address in its answer', async () => {
    const ok = await ask(envOf(), WALLET, { fetcher: walletHolding(holdings).fetcher });
    expect(ok.text).not.toContain(WALLET);
    const failed = await ask(envOf(), WALLET, { fetcher: hiro(() => json({}, 500)).fetcher, sleeps: [] });
    expect(failed.text).not.toContain(WALLET);
  });
});

describe('/checker/lookup: the rate limit', () => {
  it('allows 120 lookups an hour from one place, then says to wait', async () => {
    const env = { ...envOf(), DB: database() };
    for (let i = 0; i < 120; i += 1) expect((await ask(env, BIRDS)).res.status).toBe(200);
    const { res, body } = await ask(env, BIRDS);
    expect(res.status).toBe(429);
    expect(body.error).toBe('rate_limited');
    expect((await ask(env, BIRDS, { ip: '198.51.100.1' })).res.status).toBe(200);
    expect((await ask(env, BIRDS, { time: now + HOUR })).res.status).toBe(200);
  });

  it('allows 20 wallet lookups an hour, and keeps answering contracts after that', async () => {
    const env = { ...envOf(), DB: database() };
    const h = walletHolding([]);
    for (let i = 0; i < 20; i += 1) expect((await ask(env, WALLET, { fetcher: h.fetcher })).res.status).toBe(200);
    expect((await ask(env, WALLET, { fetcher: h.fetcher })).res.status).toBe(429);
    expect(h.calls).toHaveLength(20);
    expect((await ask(env, BIRDS)).res.status).toBe(200);
  });

  it('stores only hashed, prefixed keys, never the IP or the query', async () => {
    const env = { ...envOf({ TELEMETRY_SALT: 'pepper' }), DB: database() };
    await ask(env, WALLET, { fetcher: walletHolding([]).fetcher, ip: '203.0.113.7' });
    const keys = env.DB.sql.prepare('SELECT key FROM checker_request_rate').all().map((r: any) => r.key as string);
    expect(keys).toHaveLength(2);
    expect(keys.map((k) => k.split(':')[0]).sort()).toEqual(['lookup', 'wallet']);
    expect(keys.every((k) => /^(lookup|wallet):[0-9a-f]{64}$/.test(k))).toBe(true);
    expect(JSON.stringify(keys)).not.toMatch(/203\.0\.113\.7|SP2J6/);
  });

  it('uses a different bucket from the request form', async () => {
    const env = { ...envOf(), DB: database() };
    await ask(env, BIRDS);
    const keys = env.DB.sql.prepare('SELECT key FROM checker_request_rate').all().map((r: any) => r.key as string);
    expect(keys.every((k) => k.startsWith('lookup:'))).toBe(true);
  });

  it('still answers when the counter table is missing (a read of public-ish data), but not the other way round', async () => {
    const env = { ...envOf(), DB: database({ migrate: false }) };
    expect((await ask(env, BIRDS)).res.status).toBe(200);
    expect((await ask({ ...envOf() }, BIRDS)).res.status).toBe(200);
  });

  it('clears old counters', async () => {
    const env = { ...envOf(), DB: database() };
    env.DB.sql.prepare("INSERT INTO checker_request_rate(key,started,count) VALUES('old',?,1)").run(now - 3 * HOUR);
    await ask(env, BIRDS);
    const keys = env.DB.sql.prepare('SELECT key FROM checker_request_rate').all().map((r: any) => r.key as string);
    expect(keys).not.toContain('old');
  });
});

describe('/checker/lookup: our own failures', () => {
  it('hides internals if something unexpected throws', async () => {
    const env = { COLLECTION_ASSETS: bucket(), DB: { prepare() { throw new Error('SQLITE_CORRUPT: /secret/path'); } } };
    // the counter failing is not fatal
    expect((await ask(env, BIRDS)).res.status).toBe(200);
    const exploding = { COLLECTION_ASSETS: { get: async () => ({ text: async () => fixtureText }) }, get TELEMETRY_SALT(): string { throw new Error('boom: /secret/path'); } };
    const { res, body, text } = await ask(exploding, BIRDS);
    expect(res.status).toBe(500);
    expect(body.error).toBe('lookup_failed');
    expect(text).not.toMatch(/secret|boom/);
    expect(body.message).toMatch(/not a result/);
  });
});

describe('/checker/lookup: tags for the compact view', () => {
  it('derives short reasons from the recorded facts only', async () => {
    const tags = async (id: string) => (await ask(envOf(), id)).body.results[0].tags as string[];
    expect(await tags(BIRDS)).toEqual(['Contract link broken', 'Marketplace copy only', 'Single Pinata account']);
    expect(await tags(ROBOTS)).toEqual(['Contract link broken', 'No marketplace images loaded', "Creator's own server"]);
    expect(await tags(SATO)).toEqual(["Creator's own server"]);
    expect(await tags(INVADERS)).toContain('Stored on chain');
  });

  it('never gives more than four, and says "some failed" only when some did and some loaded', async () => {
    const rec = { ...fixture.collections[PEPES], contract: { reaches_art: false }, marketplace: { sampled: 16, loaded: 9, single_pinata_account: true }, art: { storage: 'own_server', hosts: 'pinata_only' }, status: 'marketplace_only' };
    const content = JSON.stringify({ ...fixture, collections: { ...fixture.collections, [PEPES]: rec } });
    const { body } = await ask({ COLLECTION_ASSETS: bucket(content) }, PEPES);
    expect(body.results[0].tags).toHaveLength(4);
    expect(body.results[0].tags).toContain('Some marketplace images failed');
    expect(body.results[0].tags).not.toContain('No marketplace images loaded');
  });

  it('gives the Xtrata card its own tag', async () => {
    expect((await ask(envOf(), XTRATA)).body.results[0].tags).toEqual(['Stored on chain']);
  });
});

describe('/checker/lookup: anonymous demand counters', () => {
  const today = new Date(now).toISOString().slice(0, 10);
  const demand = (env: any) => env.DB.sql.prepare('SELECT * FROM checker_demand ORDER BY contract_id, source').all() as any[];

  it('counts a contract lookup, covered or not, with no wallet and no IP', async () => {
    const env = { ...envOf(), DB: database() };
    await ask(env, BIRDS);
    await ask(env, BIRDS, { ip: '198.51.100.9' });
    await ask(env, UNKNOWN);
    expect(demand(env)).toEqual([
      { day: today, contract_id: BIRDS, source: 'contract', covered: 1, lookups: 2, items: 0 },
      { day: today, contract_id: UNKNOWN, source: 'contract', covered: 0, lookups: 1, items: 0 }
    ]);
  });

  it('counts a wallet by the collections in it, with how many NFTs, never the address', async () => {
    const env = { ...envOf(), DB: database() };
    await ask(env, WALLET, { fetcher: walletHolding([...assets(BIRDS, 3), ...assets(UNKNOWN, 5), ...assets(XTRATA, 2, 'x')]).fetcher });
    await ask(env, WALLET, { fetcher: walletHolding([...assets(UNKNOWN, 1)]).fetcher });
    expect(demand(env)).toEqual([
      { day: today, contract_id: XTRATA, source: 'wallet', covered: 1, lookups: 1, items: 2 },
      { day: today, contract_id: BIRDS, source: 'wallet', covered: 1, lookups: 1, items: 3 },
      { day: today, contract_id: UNKNOWN, source: 'wallet', covered: 0, lookups: 2, items: 6 }
    ]);
    expect(JSON.stringify(demand(env))).not.toMatch(/SP2J6|203\.0\.113/);
  });

  it('counts a day separately, and a link or name lookup as a lookup of that collection', async () => {
    const env = { ...envOf(), DB: database() };
    await ask(env, 'https://gamma.io/collections/bitcoin-birds');
    await ask(env, BIRDS, { time: now + 24 * HOUR });
    expect(demand(env).map((r) => [r.day, r.lookups])).toEqual([[today, 1], [new Date(now + 24 * HOUR).toISOString().slice(0, 10), 1]]);
  });

  it('counts nothing for notices, failed reads, empty wallets or unmatched names', async () => {
    const env = { ...envOf(), DB: database() };
    await ask(env, 'satoshi.btc');
    await ask(env, 'bitcoin');
    await ask(env, WALLET, { fetcher: hiro(() => json({}, 500)).fetcher, sleeps: [] });
    await ask(env, WALLET, { fetcher: walletHolding([]).fetcher });
    expect(demand(env)).toEqual([]);
  });

  it('ignores contract ids that are not contract ids (anything upstream sends)', async () => {
    const env = { ...envOf(), DB: database() };
    await ask(env, WALLET, { fetcher: walletHolding([`'; DROP TABLE x;--.evil::nft`, `${'A'.repeat(300)}.x::nft`, ...assets(BIRDS, 1)]).fetcher });
    expect(demand(env).map((r) => r.contract_id)).toEqual([BIRDS]);
  });

  it('records at most 100 collections per wallet, the ones held most', async () => {
    const env = { ...envOf(), DB: database() };
    const many = Array.from({ length: 130 }, (_v, i) => `SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.c${String(i).padStart(3, '0')}::nft`);
    await ask(env, WALLET, { fetcher: walletHolding([...many, ...assets(BIRDS, 4)]).fetcher });
    const rows = demand(env);
    expect(rows).toHaveLength(100);
    expect(rows.some((r) => r.contract_id === BIRDS && r.items === 4)).toBe(true);
  });

  it('never changes the answer if the counter fails, and works without the table or a database', async () => {
    const failing = { ...envOf(), DB: { prepare: () => { throw new Error('boom'); } } };
    expect((await ask(failing, BIRDS)).res.status).toBe(200);
    const noTable = { ...envOf(), DB: database({ demand: false }) };
    expect((await ask(noTable, BIRDS)).body.results[0].id).toBe(BIRDS);
    expect((await ask(envOf(), BIRDS)).res.status).toBe(200);
  });

  it('uses waitUntil when the platform gives it, so the visitor does not wait', async () => {
    const env = { ...envOf(), DB: database() };
    const pending: Promise<unknown>[] = [];
    const res = await handleCheckerLookup(new Request('https://xtrata.xyz/checker/lookup', {
      method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://xtrata.xyz' }, body: JSON.stringify({ q: BIRDS })
    }), env, { now, waitUntil: (p) => { pending.push(p); } });
    expect(res.status).toBe(200);
    expect(pending.length).toBeGreaterThan(0);
    await Promise.all(pending);
    expect(demand(env)).toHaveLength(1);
  });
});
