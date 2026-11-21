import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash, webcrypto } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import {
  applyVerifiedLegacyRepair,
  getVerifiedLegacyRepair,
  listVerifiedLegacyRepairs,
  verifyRepairCompanion
} from '../daw/js/legacy-bridge/repair-registry.js';
import { TRUTH_PATTERN_JSON } from '../daw/js/legacy-bridge/repair-pattern-data.js';
import {
  TRUTH_SOURCE_JSON,
  BUTTERFLY_SOURCE_JSON
} from '../daw/js/legacy-bridge/repair-source-data.js';

if (!globalThis.crypto) globalThis.crypto = webcrypto;
const encoder = new TextEncoder(),
  hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const tests = [];
const test = (name, run) => tests.push({ name, run });
const rejects = (run, suffix) => assert.rejects(run, { code: 'AUDIONAUT_LEGACY_REPAIR_' + suffix });
const rows = listVerifiedLegacyRepairs();
const hashById = (id) => rows.find((row) => row.id === id).originalSha256;
const truth31 = hashById('truth-pattern-companion-v1');
const truth23 = hashById('truth-numeric-source-map-v1');
const butterfly = hashById('butterfly-numeric-source-map-v1');

test('eight exact-byte registry entries expose reviewed result/provenance hashes', () => {
  assert.equal(rows.length, 8);
  assert.equal(new Set(rows.map((row) => row.originalSha256)).size, 8);
  for (const row of rows) {
    for (const value of [
      row.originalSha256,
      row.companionSha256,
      row.resultSha256,
      row.provenance.sourceSha256
    ])
      assert.match(value, /^[a-f0-9]{64}$/);
    if (row.kind === 'source-tail-padding')
      assert.equal(row.provenance.kind, 'verified-supplied-sibling');
    else assert.equal(row.provenance.commit, '194e4be90ec11431b0b9596df6dd9a3dfc2afd44');
    assert.equal(row.resultHashEncoding, 'canonical-json-sort-keys/1');
  }
});
test('returned descriptors cannot mutate the registry', () => {
  const metadata = getVerifiedLegacyRepair(truth31);
  metadata.id = 'changed';
  metadata.provenance.commit = 'changed';
  assert.equal(getVerifiedLegacyRepair(truth31).id, 'truth-pattern-companion-v1');
  assert.equal(getVerifiedLegacyRepair(truth31).provenance.commit.length, 40);
});
test('pattern companion preserves all 166 verified historical arrays', async () => {
  assert.equal(
    hash(TRUTH_PATTERN_JSON),
    rows.find((row) => row.originalSha256 === truth31).companionSha256
  );
  const patterns = await verifyRepairCompanion(truth31);
  assert.equal(Object.keys(patterns).length, 166);
  assert.deepEqual(patterns['0'], [42]);
  assert.ok(Object.values(patterns).every(Array.isArray));
});
test('source extracts contain only source/name arrays', async () => {
  for (const originalSha256 of [truth23, butterfly]) {
    const data = await verifyRepairCompanion(originalSha256);
    assert.deepEqual(Object.keys(data), ['channelURLs', 'projectChannelNames']);
    assert.equal(data.channelURLs.length, 16);
    assert.equal(data.projectChannelNames.length, 16);
    assert.ok(
      data.channelURLs.every((url) =>
        /^https:\/\/ordinals\.com\/content\/[a-f0-9]{64}i\d+#?$/.test(url)
      )
    );
  }
});
test('source-tail companions contain counts and hashes, no private musical data', async () => {
  for (const row of rows.filter((row) => row.kind === 'source-tail-padding')) {
    const proof = await verifyRepairCompanion(row.originalSha256);
    assert.deepEqual(Object.keys(proof), [
      'originalSourceCount',
      'channelCount',
      'originalSourceArraySha256',
      'donorSourceArraySha256'
    ]);
    assert.ok([3, 4, 6].includes(proof.originalSourceCount));
    assert.equal(proof.channelCount, 64);
    assert.equal(proof.originalSourceArraySha256, row.provenance.originalSourceArraySha256);
    assert.equal(proof.donorSourceArraySha256, row.provenance.donorSourceArraySha256);
  }
});
test('explicit matching companion is accepted', async () => {
  assert.deepEqual(
    await verifyRepairCompanion(truth31, encoder.encode(TRUTH_PATTERN_JSON)),
    JSON.parse(TRUTH_PATTERN_JSON)
  );
});
test('modified pattern companion is rejected before use', () =>
  rejects(
    () =>
      verifyRepairCompanion(truth31, encoder.encode(TRUTH_PATTERN_JSON.replace('[42]', '[43]'))),
    'COMPANION_MISMATCH'
  ));
test('source companion from another song is rejected', () =>
  rejects(
    () => verifyRepairCompanion(truth23, encoder.encode(BUTTERFLY_SOURCE_JSON)),
    'COMPANION_MISMATCH'
  ));
test('same parsed companion with different bytes is rejected', () =>
  rejects(
    () => verifyRepairCompanion(truth23, encoder.encode(TRUTH_SOURCE_JSON + '\n')),
    'COMPANION_MISMATCH'
  ));
test('unknown original cannot select a built-in companion', () =>
  rejects(() => verifyRepairCompanion('0'.repeat(64)), 'UNKNOWN_INPUT'));
test('title and filename never select a repair', async () => {
  const document = {
    projectName: 'TRUTH',
    channelURLs: [0],
    projectSequences: { Sequence0: { ch0: { steps: 0 } } }
  };
  const bytes = encoder.encode(JSON.stringify(document));
  const result = await applyVerifiedLegacyRepair({
    bytes,
    document,
    filename: '31 TRUTH_AUDX_17_serialized.json'
  });
  assert.equal(result.repair, null);
  assert.deepEqual(result.document, document);
  assert.notEqual(result.document, document);
  assert.notEqual(result.document.projectSequences, document.projectSequences);
});
test('claimed known hash cannot authorize unrelated bytes', () =>
  rejects(
    () => applyVerifiedLegacyRepair({ bytes: encoder.encode('{}'), document: {}, sha256: truth31 }),
    'HASH_MISMATCH'
  ));
test('unknown mutable document receives no repair', async () => {
  const bytes = encoder.encode('{"projectName":"TRUTH"}');
  const result = await applyVerifiedLegacyRepair({
    bytes,
    document: { projectName: 'TRUTH', changed: true }
  });
  assert.equal(result.repair, null);
  assert.equal(result.document.changed, true);
});
test('missing original bytes are rejected', () =>
  rejects(() => applyVerifiedLegacyRepair({ document: {} }), 'INVALID_BYTES'));
test('accessors and unsafe keys cannot execute during verification', async () => {
  let reads = 0;
  const document = {};
  Object.defineProperty(document, 'projectName', {
    enumerable: true,
    get() {
      reads++;
      return 'TRUTH';
    }
  });
  await rejects(
    () => applyVerifiedLegacyRepair({ bytes: encoder.encode('{}'), document }),
    'INVALID_DOCUMENT'
  );
  assert.equal(reads, 0);
  await rejects(
    () =>
      applyVerifiedLegacyRepair({
        bytes: encoder.encode('{}'),
        document: JSON.parse('{"__proto__":{}}')
      }),
    'INVALID_DOCUMENT'
  );
});
test('sparse and non-JSON input cannot be mistaken for original data', async () => {
  for (const document of [{ rows: [1, , 3] }, { rows: [undefined] }, { n: NaN }, new Date()])
    await rejects(
      () => applyVerifiedLegacyRepair({ bytes: encoder.encode('{}'), document }),
      'INVALID_DOCUMENT'
    );
});

// Full songs remain private/local. Set this directory for the exact corpus
// regressions; no download or corpus fixture is embedded in the public suite.
const corpus = process.env.AUDIONAUT_LEGACY_REPAIR_FIXTURES;
if (corpus) {
  const paths = {
    truth31: '01 SP1 and TRUTH/31 TRUTH_AUDX_17_serialized.json',
    truth28: '01 SP1 and TRUTH/28 TRUTH_AUDX_17.json',
    truth23: '01 SP1 and TRUTH/23 TRUTH_AUDX_17_deserialized.json',
    truth30: '01 SP1 and TRUTH/30 TRUTH_AUDX_17.json',
    truth22: '01 SP1 and TRUTH/22 TRUTH_AUDX_17_DS.json',
    truth32: '01 SP1 and TRUTH/32 TRUTH_AUDX_17.json',
    butterfly06: '04 Butterfly Effect/06 butterflyEffect.json'
  };
  const fixtures = Object.fromEntries(
    await Promise.all(
      Object.entries(paths).map(async ([key, path]) => {
        const bytes = new Uint8Array(await readFile(resolve(corpus, path)));
        return [key, { bytes, document: JSON.parse(new TextDecoder().decode(bytes)) }];
      })
    )
  );
  const apply = (key) => applyVerifiedLegacyRepair(fixtures[key]);
  const expandEvents = (document) => {
    const output = {};
    for (const [sequenceName, channels] of Object.entries(
      document.projectSequences || document['14']
    )) {
      const sequence = Number(sequenceName.match(/\d+/)[0]);
      for (const [channelName, row] of Object.entries(channels)) {
        const channel = /^ch\d+$/.test(channelName)
          ? Number(channelName.slice(2))
          : /^[A-Z]$/.test(channelName)
            ? channelName.charCodeAt(0) - 65
            : Number(channelName);
        const steps = row.steps || row['15'] || [],
          expanded = [];
        assert.ok(Array.isArray(steps), 'scalar pattern IDs must be expanded');
        for (const step of steps) {
          if (typeof step === 'number') expanded.push([step, false]);
          else if (typeof step === 'string') expanded.push([Number(step.slice(0, -1)), true]);
          else if (step.r)
            for (let index = step.r[0]; index <= step.r[1]; index++) expanded.push([index, false]);
          else expanded.push([step.index, !!step.reverse]);
        }
        if (expanded.length) output[`${sequence}/${channel}`] = expanded;
      }
    }
    return output;
  };
  test('all five exact originals select only their reviewed repair', async () => {
    for (const key of ['truth31', 'truth28', 'truth23', 'truth30', 'butterfly06']) {
      const before = JSON.stringify(fixtures[key].document),
        result = await apply(key);
      assert.equal(result.repair.originalSha256, hash(fixtures[key].bytes));
      assert.equal(result.repair.format, 'audionaut-legacy-repair/1');
      assert.equal(
        JSON.stringify(fixtures[key].document),
        before,
        'repair must not mutate the input'
      );
      assert.ok(result.repair.changedFields.length > 0);
    }
  });
  test('TRUTH31 expanded events match both independent recovered siblings', async () => {
    const result = await apply('truth31'),
      events = expandEvents(result.document);
    assert.deepEqual(events, expandEvents(fixtures.truth22.document));
    assert.deepEqual(events, expandEvents(fixtures.truth32.document));
    const flat = Object.values(events).flat();
    assert.equal(flat.length, 4495);
    assert.equal(flat.filter(([i]) => i === 64).length, 70);
    assert.equal(flat.filter(([, reverse]) => reverse).length, 353);
    assert.equal(result.repair.changedFields.length, 375);
    assert.deepEqual(result.repair.restoredEvents, []);
  });
  test('TRUTH28 restores only missing pattern-zero event and reports its sibling', async () => {
    const result = await apply('truth28');
    assert.deepEqual(expandEvents(result.document), expandEvents(fixtures.truth22.document));
    assert.deepEqual(result.document.projectSequences.Sequence0.ch0.steps, [42]);
    assert.equal(result.repair.restoredEvents.length, 1);
    assert.equal(result.repair.restoredEvents[0].siblingSha256, truth31);
    assert.equal(result.repair.restoredEvents[0].index, 42);
    assert.equal(Object.hasOwn(fixtures.truth28.document.projectSequences.Sequence0, 'ch0'), false);
  });
  test('source repairs preserve every gain, trim, note and remaining field', async () => {
    for (const key of ['truth23', 'truth30', 'butterfly06']) {
      const result = await apply(key),
        source = JSON.parse(key === 'butterfly06' ? BUTTERFLY_SOURCE_JSON : TRUTH_SOURCE_JSON);
      const urls = key === 'truth30' ? '4' : 'channelURLs',
        names = key === 'truth30' ? '8' : 'projectChannelNames';
      assert.deepEqual(result.document, {
        ...fixtures[key].document,
        [urls]: source.channelURLs,
        [names]: source.projectChannelNames
      });
      assert.deepEqual(result.repair.changedFields, ['/' + urls, '/' + names]);
      assert.deepEqual(result.repair.restoredEvents, []);
    }
    assert.equal((await apply('butterfly06')).document.channelVolume[9], 1.58);
  });
  test('same original bytes with modified musical data are rejected atomically', async () => {
    const document = structuredClone(fixtures.truth23.document);
    document.channelVolume[0] += 0.01;
    const before = JSON.stringify(document);
    await rejects(
      () => applyVerifiedLegacyRepair({ bytes: fixtures.truth23.bytes, document }),
      'INPUT_MISMATCH'
    );
    assert.equal(JSON.stringify(document), before);
  });
  test('one whitespace byte prevents automatic repair despite equivalent JSON', async () => {
    const original = fixtures.truth31,
      bytes = new Uint8Array(original.bytes.length + 1);
    bytes.set(original.bytes);
    bytes[bytes.length - 1] = 32;
    const result = await applyVerifiedLegacyRepair({ bytes, document: original.document });
    assert.equal(result.repair, null);
    assert.deepEqual(result.document, original.document);
  });
  test('wrong explicit companion never falls back or changes the original', async () => {
    const before = JSON.stringify(fixtures.truth31.document);
    await rejects(
      () =>
        applyVerifiedLegacyRepair({ ...fixtures.truth31, companionBytes: encoder.encode('{}') }),
      'COMPANION_MISMATCH'
    );
    assert.equal(JSON.stringify(fixtures.truth31.document), before);
  });
  test('bytes and document are captured atomically before asynchronous hashing', async () => {
    const bytes = fixtures.truth23.bytes.slice(),
      document = structuredClone(fixtures.truth23.document);
    const pending = applyVerifiedLegacyRepair({ bytes, document });
    bytes.fill(0);
    document.channelVolume[0] = 99;
    const result = await pending;
    assert.equal(result.repair.originalSha256, truth23);
    assert.equal(result.document.channelVolume[0], fixtures.truth23.document.channelVolume[0]);
  });
}

if (process.env.AUDIONAUT_LEGACY_FILTERED_EVIDENCE) {
  const filtered = JSON.parse(
    await readFile(process.env.AUDIONAUT_LEGACY_FILTERED_EVIDENCE, 'utf8')
  );
  test('verified gzip source-tail repairs append only sibling-proven empty slots', async () => {
    for (const item of filtered.repairs) {
      const bytes = new Uint8Array(await readFile(item.input.matchingPaths[0])),
        document = JSON.parse(gunzipSync(bytes));
      const original = structuredClone(document),
        result = await applyVerifiedLegacyRepair({ bytes, document });
      assert.equal(result.repair.originalSha256, item.input.sha256);
      assert.equal(result.repair.provenance.sourceSha256, item.donor.sha256);
      assert.deepEqual(result.document, {
        ...original,
        4: [...original['4'], ...Array(64 - original['4'].length).fill('')]
      });
      assert.deepEqual(result.repair.changedFields, ['/4']);
      assert.deepEqual(document, original);
      const decodedBytes = new Uint8Array(gunzipSync(bytes));
      assert.equal(
        (await applyVerifiedLegacyRepair({ bytes: decodedBytes, document })).repair,
        null,
        'Equivalent uncompressed JSON is not the exact authorized original.'
      );
      const changed = structuredClone(document);
      changed['4'][0] = '/content/' + 'a'.repeat(64) + 'i0';
      await rejects(
        () => applyVerifiedLegacyRepair({ bytes, document: changed }),
        'INPUT_MISMATCH'
      );
    }
  });
}

for (const { name, run } of tests) {
  await run();
  console.log('PASS ' + name);
}
console.log(
  `Legacy repair tests passed: ${tests.length}; exact-file corpus ${corpus ? 'verified locally' : 'not requested (set AUDIONAUT_LEGACY_REPAIR_FIXTURES)'}.`
);
