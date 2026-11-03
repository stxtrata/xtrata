// Run: node --test ft-frozen-flags.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const { decodeBool, flagCandidates, classify, createReader } = require('./ft-frozen-flags.cjs');

test('decodeBool reads true and false, looking through ok(...) and some(...)', () => {
  assert.equal(decodeBool('0x03'), true);
  assert.equal(decodeBool('0x04'), false);
  assert.equal(decodeBool('0x0703'), true);
  assert.equal(decodeBool('0x0704'), false);
  assert.equal(decodeBool('0x0a03'), true);
  assert.equal(decodeBool('0x0a04'), false);
});

test('decodeBool says null, not false, for anything that is not a boolean', () => {
  for (const bad of ['0x09', '0x0d00000003616263', '0x0100000000000000000000000000000001', '0x', '', 'nope', undefined, null, 3]) {
    assert.equal(decodeBool(bad), null, String(bad));
  }
});

test('flagCandidates finds boolean freeze variables and nothing else', () => {
  const src = `
    ;; the metadata is frozen forever once this is true
    (define-data-var metadata-frozen bool false)
    (define-data-var freeze-height uint u0)
    (define-data-var base-uri (string-ascii 80) "ipfs://x/")
    (define-data-var locked bool false)
    (define-public (freeze-metadata) (ok (var-set metadata-frozen true)))`;
  assert.deepEqual(flagCandidates(src), [{ kind: 'var', name: 'metadata-frozen' }]);
});

test('flagCandidates falls back to zero-argument read-only functions only when there is no variable', () => {
  const fnOnly = `(define-read-only (is-frozen?) (contract-call? .admin frozen))
                  (define-read-only (is-frozen-for (id uint)) true)`;
  assert.deepEqual(flagCandidates(fnOnly), [{ kind: 'fn', name: 'is-frozen?' }]);
  const both = `(define-data-var frozen bool false) (define-read-only (is-frozen) (var-get frozen))`;
  assert.deepEqual(flagCandidates(both), [{ kind: 'var', name: 'frozen' }]);
});

test('a comment or string that merely mentions frozen is not a flag; neither is a missing source', () => {
  assert.deepEqual(flagCandidates(';; this collection is frozen\n(define-data-var note (string-ascii 20) "frozen")'), []);
  assert.deepEqual(flagCandidates(undefined), []);
  assert.deepEqual(flagCandidates(''), []);
});

test('classify: one true settles it; no candidates is no_flag; a failed read is never not_frozen', () => {
  const v = { kind: 'var', name: 'a' };
  assert.equal(classify([v], [{ value: true }]), 'frozen');
  assert.equal(classify([v, v], [{ value: null }, { value: true }]), 'frozen');
  assert.equal(classify([v], [{ value: false }]), 'not_frozen');
  assert.equal(classify([v, v], [{ value: false }, { value: false }]), 'not_frozen');
  assert.equal(classify([], []), 'no_flag');
  assert.equal(classify([v], [{ value: null }]), 'read_failed');
  assert.equal(classify([v, v], [{ value: false }, { value: null }]), 'read_failed');
  assert.equal(classify([v, v], [{ value: false }]), 'read_failed'); // fewer reads than candidates
});

// ---- the reader against a fake Hiro ----
const ok = (json) => ({ ok: true, status: 200, json: async () => json });
const bad = (status) => ({ ok: false, status, json: async () => ({}) });
function fakeHiro(routes) {
  const seen = [];
  const fetch = async (url, opts) => {
    const path = url.replace('https://api.hiro.so', '');
    seen.push(path);
    const hit = routes.find(([pattern]) => (pattern instanceof RegExp ? pattern.test(path) : path.startsWith(pattern)));
    if (!hit) return bad(404);
    const r = hit[1];
    return typeof r === 'function' ? r(path, opts) : r;
  };
  return { fetch, seen };
}
const reader = (routes, extra = {}) => {
  const hiro = fakeHiro(routes);
  return { hiro, r: createReader({ fetch: hiro.fetch, sleep: async () => {}, gapMs: 0, ...extra }) };
};
const A = 'SP000000000000000000002Q6VF78';

test('reads a flag that is true, one that is false, and says so', async () => {
  const { r } = reader([
    ['/v2/contracts/source/' + A + '/locked', ok({ source: '(define-data-var metadata-frozen bool false)' })],
    ['/v2/data_var/' + A + '/locked/metadata-frozen', ok({ data: '0x03' })],
    ['/v2/contracts/source/' + A + '/open', ok({ source: '(define-data-var metadata-frozen bool false)' })],
    ['/v2/data_var/' + A + '/open/metadata-frozen', ok({ data: '0x04' })],
  ]);
  assert.equal((await r.readOne(A + '.locked')).state, 'frozen');
  assert.equal((await r.readOne(A + '.open')).state, 'not_frozen');
});

test('a contract with no readable flag is no_flag, not not_frozen', async () => {
  const { r } = reader([['/v2/contracts/source/', ok({ source: '(define-public (set-base-uri (u (string-ascii 80))) (ok true))' })]]);
  const res = await r.readOne(A + '.plain');
  assert.equal(res.state, 'no_flag');
  assert.deepEqual(res.flags, []);
});

test('a source that cannot be fetched, or a flag that cannot be read, is read_failed with the reason kept', async () => {
  const noSource = reader([]);
  const a = await noSource.r.readOne(A + '.gone');
  assert.equal(a.state, 'read_failed');
  assert.match(a.error, /source http404/);

  const flagFails = reader([
    ['/v2/contracts/source/', ok({ source: '(define-data-var frozen bool false)' })],
    ['/v2/data_var/', bad(500)],
  ]);
  const b = await flagFails.r.readOne(A + '.flaky');
  assert.equal(b.state, 'read_failed');
  assert.equal(b.flags[0].value, null);
  assert.equal(b.flags[0].error, 'http500');

  const notBool = reader([
    ['/v2/contracts/source/', ok({ source: '(define-data-var frozen bool false)' })],
    ['/v2/data_var/', ok({ data: '0x0100000000000000000000000000000001' })],
  ]);
  const c = await notBool.r.readOne(A + '.odd');
  assert.equal(c.state, 'read_failed');
  assert.equal(c.flags[0].error, 'not a boolean');
});

test('reads a zero-argument read-only function through call-read', async () => {
  const { r, hiro } = reader([
    ['/v2/contracts/source/', ok({ source: '(define-read-only (is-frozen) (contract-call? .admin frozen))' })],
    ['/v2/contracts/call-read/', ok({ okay: true, result: '0x0703' })],
  ]);
  assert.equal((await r.readOne(A + '.viafn')).state, 'frozen');
  assert.ok(hiro.seen.some((p) => p.startsWith('/v2/contracts/call-read/' + A + '/viafn/is-frozen')));
  const failing = reader([
    ['/v2/contracts/source/', ok({ source: '(define-read-only (is-frozen) (contract-call? .admin frozen))' })],
    ['/v2/contracts/call-read/', ok({ okay: false, cause: 'Unchecked' })],
  ]);
  assert.equal((await failing.r.readOne(A + '.viafn')).state, 'read_failed');
});

test('a rate-limited call is retried and then succeeds', async () => {
  let hits = 0;
  const { r } = reader([
    ['/v2/contracts/source/', () => (++hits === 1 ? bad(429) : ok({ source: '(define-data-var frozen bool false)' }))],
    ['/v2/data_var/', ok({ data: '0x04' })],
  ]);
  assert.equal((await r.readOne(A + '.busy')).state, 'not_frozen');
  assert.equal(hits, 2);
});

test('a network error is retried, then reported as read_failed, never as an answer', async () => {
  const r = createReader({ fetch: async () => { throw new Error('Failed to fetch'); }, sleep: async () => {}, gapMs: 0 });
  const res = await r.readOne(A + '.down');
  assert.equal(res.state, 'read_failed');
  assert.match(res.error, /network/);
});

test('run() keeps finished answers, retries read_failed, and counts honestly', async () => {
  const state = { calls: 0 };
  const { r } = reader([
    ['/v2/contracts/source/' + A + '/one', ok({ source: '(define-data-var frozen bool false)' })],
    ['/v2/data_var/' + A + '/one/', () => { state.calls++; return ok({ data: '0x04' }); }],
    ['/v2/contracts/source/' + A + '/two', bad(500)],
  ]);
  const first = await r.run([A + '.one', A + '.two']);
  assert.deepEqual(first, { frozen: 0, not_frozen: 1, no_flag: 0, read_failed: 1, not_read: 0 });
  await r.run([A + '.one', A + '.two']);
  assert.equal(state.calls, 1, 'a finished answer is not read again');
  assert.equal(r.summary([A + '.one', A + '.nope']).not_read, 1);
  const saved = JSON.parse(r.json());
  assert.equal(saved.version, 1);
  assert.equal(saved.results[A + '.one'].state, 'not_frozen');
});

test('a bad contract id is read_failed, not a crash', async () => {
  const { r } = reader([]);
  assert.equal((await r.readOne('nodothere')).state, 'read_failed');
});
