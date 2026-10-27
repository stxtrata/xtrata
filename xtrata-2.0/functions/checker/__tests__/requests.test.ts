// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { handleCheckerRequest } from '../requests';

const { DatabaseSync } = createRequire(import.meta.url)('node:sqlite');
const now = 1_790_000_000_000;
const HOUR = 3600_000;
const contract = 'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.megapont-ape-club-nft';

function database(options: { migrate?: boolean; failInsert?: boolean } = {}) {
  const sql = new DatabaseSync(':memory:');
  if (options.migrate !== false) sql.exec(readFileSync('functions/migrations/031_checker_requests.sql', 'utf8'));
  return {
    sql,
    prepare(query: string) {
      let args: any[] = [];
      return {
        bind(...v: any[]) { args = v; return this; },
        async first() { return sql.prepare(query).get(...args) || null; },
        async run() {
          if (options.failInsert && /INSERT INTO checker_requests/.test(query)) throw new Error('SQLITE_CORRUPT: page 7 of /secret/path');
          return sql.prepare(query).run(...args);
        },
        async all() { return { results: sql.prepare(query).all(...args) }; }
      };
    }
  };
}

type Options = { time?: number; origin?: string | null; ip?: string; type?: string; raw?: string };
const post = (env: any, body: any, { time = now, origin = 'https://xtrata.xyz', ip = '203.0.113.7', type = 'application/json', raw }: Options = {}) =>
  handleCheckerRequest(new Request('https://xtrata.xyz/checker/requests', {
    method: 'POST',
    headers: { 'content-type': type, 'CF-Connecting-IP': ip, ...(origin ? { origin } : {}) },
    body: raw ?? JSON.stringify(body)
  }), env, time);
const rows = (env: any) => env.DB.sql.prepare('SELECT * FROM checker_requests ORDER BY created_at, id').all() as any[];
const valid = { kind: 'retest', contract };

describe('/checker/requests: storing', () => {
  it('stores the request and nothing about the visitor', async () => {
    const env = { DB: database() };
    const res = await post(env, { ...valid, name: 'Megapont Ape Club', note: 'Please re-test', contact: '@someone', role: 'holder' });
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.ok).toBe(true);
    const [row] = rows(env);
    expect(row).toMatchObject({
      id: body.id, created_at: now, chain: 'stacks', contract_id: contract, kind: 'retest',
      collection_name: 'Megapont Ape Club', note: 'Please re-test', contact: '@someone', role: 'holder', status: 'new', handled_at: null
    });
    // No column holds the visitor's address or IP, and the rate-limit key is a hash, not the IP.
    expect(Object.keys(row).sort()).toEqual(['chain', 'collection_name', 'contact', 'contract_id', 'created_at', 'handled_at', 'handled_note', 'id', 'kind', 'note', 'role', 'status']);
    const keys = env.DB.sql.prepare('SELECT key FROM checker_request_rate').all().map((r: any) => r.key);
    expect(keys).toHaveLength(1);
    expect(keys[0]).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(keys)).not.toContain('203.0.113.7');
  });

  it('accepts the three kinds, with the optional fields left out', async () => {
    const env = { DB: database() };
    for (const [i, kind] of (['retest', 'helper', 'assess'] as const).entries()) {
      expect((await post(env, { kind, contract }, { ip: `198.51.100.${i}` })).status).toBe(200);
    }
    expect(rows(env).map((r) => r.kind).sort()).toEqual(['assess', 'helper', 'retest']);
    expect(rows(env)[0]).toMatchObject({ collection_name: '', note: '', contact: '', role: '' });
  });

  it('tidies what it stores: address case, spacing, control characters; keeps newlines in notes', async () => {
    const env = { DB: database() };
    const lower = contract.replace('SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335', 'sp3d6pv2acbpekyjtcmh7hen02kp87qsp8kteh335');
    const res = await post(env, { kind: 'helper', contract: `  ${lower}  `, name: ' Ape\u0000 Club\n', note: ' line one\nline two\u0007 ', contact: ' me@example.com ' });
    expect(res.status).toBe(200);
    expect(rows(env)[0]).toMatchObject({ contract_id: contract, collection_name: 'Ape  Club', note: 'line one\nline two', contact: 'me@example.com' });
  });
});

describe('/checker/requests: refusing', () => {
  const bad: Array<[string, any]> = [
    ['an unknown kind', { ...valid, kind: 'delete' }],
    ['no kind', { contract }],
    ['another chain', { ...valid, chain: 'ethereum' }],
    ['no contract', { kind: 'retest' }],
    ['a contract with no name', { kind: 'retest', contract: 'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335' }],
    ['a short address', { kind: 'retest', contract: 'SP123.thing' }],
    ['an EVM address', { kind: 'retest', contract: '0x1234567890abcdef1234567890abcdef12345678' }],
    ['a name starting with a digit', { kind: 'retest', contract: 'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.1bad' }],
    ['a testnet address', { kind: 'retest', contract: 'ST3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.thing' }],
    ['a letter outside the address alphabet', { kind: 'retest', contract: 'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH33I.thing' }],
    ['a contract that is not text', { kind: 'retest', contract: 42 }],
    ['a note that is too long', { ...valid, note: 'x'.repeat(501) }],
    ['a name that is too long', { ...valid, name: 'x'.repeat(121) }],
    ['a contact that is too long', { ...valid, contact: 'x'.repeat(201) }],
    ['a note that is not text', { ...valid, note: { a: 1 } }],
    ['an unknown role', { ...valid, role: 'whale' }],
    ['a list instead of an object', [valid]],
    ['null', null]
  ];
  for (const [label, body] of bad) {
    it(`400 for ${label}`, async () => {
      const env = { DB: database() };
      const res = await post(env, body);
      expect(res.status).toBe(400);
      expect(typeof ((await res.json()) as any).error).toBe('string');
      expect(rows(env)).toHaveLength(0);
    });
  }

  it('400 for the wrong content type, broken JSON and an oversized body', async () => {
    const env = { DB: database() };
    expect((await post(env, valid, { type: 'text/plain' })).status).toBe(400);
    expect((await post(env, null, { raw: '{not json', ip: '198.51.100.1' })).status).toBe(400);
    expect((await post(env, null, { raw: JSON.stringify({ ...valid, note: 'x'.repeat(5000) }), ip: '198.51.100.2' })).status).toBe(400);
    expect(rows(env)).toHaveLength(0);
  });

  it('403 for another origin, 405 for anything but POST; no origin header (curl) is fine', async () => {
    const env = { DB: database() };
    expect((await post(env, valid, { origin: 'https://evil.example' })).status).toBe(403);
    const get = await handleCheckerRequest(new Request('https://xtrata.xyz/checker/requests'), env, now);
    expect(get.status).toBe(405);
    expect(get.headers.get('allow')).toBe('POST');
    expect((await post(env, valid, { origin: null })).status).toBe(200);
    expect(rows(env)).toHaveLength(1);
  });
});

describe('/checker/requests: spam controls', () => {
  it('answers a filled-in honeypot with ok and stores nothing', async () => {
    const env = { DB: database() };
    const res = await post(env, { ...valid, website: 'https://spam.example' });
    expect(res.status).toBe(200);
    expect(((await res.json()) as any).id).toBeUndefined();
    expect(rows(env)).toHaveLength(0);
  });

  it('allows 15 an hour per visitor, counts bad attempts too, and starts again next hour', async () => {
    const env = { DB: database() };
    for (let i = 0; i < 14; i++) expect((await post(env, valid)).status).toBe(200);
    expect((await post(env, { kind: 'nope', contract })).status).toBe(400); // 15th attempt, malformed, still counts
    expect((await post(env, valid)).status).toBe(429);
    expect((await post(env, valid, { ip: '198.51.100.9' })).status).toBe(200); // someone else
    expect((await post(env, valid, { time: now + HOUR })).status).toBe(200); // next hour
    expect(rows(env)).toHaveLength(16);
  });

  it('forgets rate-limit keys after two hours', async () => {
    const env = { DB: database() };
    await post(env, valid);
    await post(env, valid, { time: now + 3 * HOUR, ip: '198.51.100.9' });
    expect(env.DB.sql.prepare('SELECT COUNT(*) AS n FROM checker_request_rate').get().n).toBe(1);
  });

  it('keys the limit on a salted hash when a salt is configured', async () => {
    const a = { DB: database(), TELEMETRY_SALT: 'salt-a' };
    const b = { DB: database(), TELEMETRY_SALT: 'salt-b' };
    await post(a, valid);
    await post(b, valid);
    const keyOf = (env: any) => env.DB.sql.prepare('SELECT key FROM checker_request_rate').get().key;
    expect(keyOf(a)).not.toBe(keyOf(b));
  });

  it('treats the same person asking twice in a day as one request', async () => {
    const env = { DB: database() };
    const first = (await (await post(env, { ...valid, contact: 'me@example.com' })).json()) as any;
    const again = (await (await post(env, { ...valid, contact: 'me@example.com' }, { time: now + 60_000 })).json()) as any;
    expect(again).toMatchObject({ ok: true, id: first.id, duplicate: true });
    expect(rows(env)).toHaveLength(1);
    // A different kind, a different collection, or a day later is a new request.
    await post(env, { ...valid, kind: 'helper', contact: 'me@example.com' }, { time: now + 2 * 60_000 });
    await post(env, { ...valid, contract: 'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.other', contact: 'me@example.com' }, { time: now + 3 * 60_000 });
    await post(env, { ...valid, contact: 'me@example.com' }, { time: now + 25 * HOUR });
    expect(rows(env)).toHaveLength(4);
  });

  it('does not dedupe requests that left no contact', async () => {
    const env = { DB: database() };
    await post(env, valid);
    await post(env, valid, { time: now + 60_000 });
    expect(rows(env)).toHaveLength(2);
  });

  it('pauses when 2000 requests are waiting, and resumes once some are dealt with', async () => {
    const env = { DB: database() };
    const insert = env.DB.sql.prepare("INSERT INTO checker_requests(id,created_at,contract_id,kind) VALUES(?,?,?,'retest')");
    env.DB.sql.exec('BEGIN');
    for (let i = 0; i < 2000; i++) insert.run(`seed-${i}`, now - i - 1, contract);
    env.DB.sql.exec('COMMIT');
    const paused = await post(env, valid);
    expect(paused.status).toBe(503);
    expect(((await paused.json()) as any).error).toMatch(/paused/i);
    env.DB.sql.exec("UPDATE checker_requests SET status='done' WHERE id='seed-0'");
    expect((await post(env, valid, { ip: '198.51.100.9' })).status).toBe(200);
  });
});

describe('/checker/requests: not working is not the same as nothing', () => {
  it('503 when the table has not been created yet, and when there is no database', async () => {
    const res = await post({ DB: database({ migrate: false }) }, valid);
    expect(res.status).toBe(503);
    expect(((await res.json()) as any).error).toMatch(/not switched on/i);
    expect((await post({}, valid)).status).toBe(503);
  });

  it('500 with a plain message when saving fails, and never shows database wording', async () => {
    const env = { DB: database({ failInsert: true }) };
    const res = await post(env, valid);
    expect(res.status).toBe(500);
    const text = await res.text();
    expect(text).toMatch(/try again/i);
    expect(text).not.toMatch(/SQLITE|secret|path/i);
    expect(rows(env)).toHaveLength(0);
  });
});
