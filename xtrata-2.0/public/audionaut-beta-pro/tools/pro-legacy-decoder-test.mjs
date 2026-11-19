import assert from 'node:assert/strict';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import {
  prepareLegacyImport,
  prepareLegacyDocumentSync,
  readDocument,
  decodeCompactDocument,
  expandLegacySteps,
  validateLegacyImport,
  DOCUMENT_HARD_LIMITS
} from '../daw/js/legacy-bridge/index.js';
import { sha256Sync } from '../daw/js/legacy-bridge/hash-sync.js';
const textEncoder = new TextEncoder(),
  id = 'ab'.repeat(32) + 'i0',
  source = '/content/' + id,
  editor = 'audionals-editor-v1',
  standalone = 'audionals-standalone-v1';
let checks = 0;
const check = (name, fn) => {
  fn();
  checks++;
};
const load = (document, profileId = editor, options = {}) =>
  prepareLegacyImport(document, { profileId, ...options });
const fixture = (steps = [1], extra = {}) => ({
  projectName: 'Synthetic',
  projectBPM: 120,
  channelURLs: [source],
  projectSequences: { Sequence0: { ch0: { steps } } },
  ...extra
});
for (const text of ['', 'abc', 'The quick brown fox jumps over the lazy dog', 'x'.repeat(129)])
  check('SHA256 independent vector', () =>
    assert.equal(
      sha256Sync(textEncoder.encode(text)),
      createHash('sha256').update(text).digest('hex')
    )
  );
const original = fixture(),
  before = JSON.stringify(original),
  decoded = await readDocument(gzipSync(JSON.stringify(original)), {
    filename: 'deliberately-wrong.json'
  });
check('gzip magic and raw identity', () => {
  assert.equal(decoded.container, 'gzip');
  assert.deepEqual(decoded.document, original);
  assert.equal(
    decoded.sourceHash,
    createHash('sha256')
      .update(gzipSync(JSON.stringify(original)))
      .digest('hex')
  );
});
const rejects = async (name, fn, code) => {
  await assert.rejects(fn, (e) => e.code === code);
  checks++;
};
await rejects('truncated gzip', () => readDocument(gzipSync('{}').subarray(0, 8)), 'INVALID_GZIP');
await rejects(
  'expanded gzip bound',
  () =>
    readDocument(gzipSync(JSON.stringify({ x: 'a'.repeat(4000) })), {
      limits: { expandedBytes: 1024 }
    }),
  'DOCUMENT_TOO_LARGE'
);
await rejects(
  'input bound',
  () => readDocument('x'.repeat(100), { limits: { inputBytes: 10 } }),
  'DOCUMENT_TOO_LARGE'
);
await rejects('invalid UTF8', () => readDocument(new Uint8Array([0xff, 0xfe])), 'INVALID_UTF8');
await rejects('prototype key', () => readDocument('{"__proto__":{}}'), 'UNSAFE_KEY');
await rejects(
  'deep input before parse',
  () => readDocument('{"x":'.repeat(50) + '0' + '}'.repeat(50)),
  'DOCUMENT_TOO_DEEP'
);
await rejects('invalid JSON', () => readDocument('{'), 'INVALID_JSON');
await rejects(
  'accessors cannot execute',
  () =>
    readDocument(
      Object.defineProperty({}, 'x', {
        enumerable: true,
        get() {
          throw new Error('must not execute');
        }
      })
    ),
  'INVALID_JSON'
);
await rejects(
  'sparse arrays cannot lose positions',
  () => readDocument({ x: new Array(3) }),
  'INVALID_JSON'
);
await rejects(
  'array named fields cannot hide holes',
  () => readDocument({ x: Object.assign(new Array(1), { payload: 'hidden' }) }),
  'INVALID_JSON'
);
const abort = new AbortController();
abort.abort();
await assert.rejects(
  () => load(original, editor, { signal: abort.signal }),
  (e) => e.name === 'AbortError'
);
checks++;
const undecided = await prepareLegacyImport(original);
check('unknown sparse requires actual choice', () => {
  assert.equal(undecided.project, null);
  assert.equal(undecided.requiresProfileChoice, true);
  assert.deepEqual(
    undecided.profileChoices.map((x) => x.id),
    [editor, standalone]
  );
  assert.equal(JSON.stringify(original), before);
});
const dense = Array(64).fill(false);
dense[0] = dense[20] = dense[63] = true;
const early = await prepareLegacyImport({
  projectURLs: [source],
  projectBPM: 120,
  projectSequences: { Sequence0: { ch0: { steps: dense } } }
});
check('dense positions including edge64 preserved', () => {
  assert.equal(early.report.canImport, true);
  assert.deepEqual(
    early.normalized.events.map((x) => x.step),
    [0, 20, 63]
  );
  assert.equal(early.project.channels[0].source.value, id);
  assert.equal(early.project.legacyImport.profileId, 'audionals-dense-v1');
});
const arrangement = fixture([], {
  projectSequences: {
    Sequence3: { ch0: { steps: [1, '64r', { r: [2, 3] }] } },
    Sequence1: { ch0: { steps: [0, 63] } }
  }
});
const e = await load(arrangement),
  s = await load(arrangement, standalone);
check('editor numbered gaps and onebased exact mapping', () => {
  assert.equal(e.project.sequences.length, 4);
  assert.deepEqual(
    e.normalized.events.map((x) => [x.sequence, x.step, x.reverse]),
    [
      [3, 0, false],
      [3, 63, true],
      [3, 1, false],
      [3, 2, false],
      [1, 62, false]
    ]
  );
  assert.equal(e.project.songEndStep, 256);
  assert.deepEqual(e.project.sequences[0].steps[0], Array(64).fill(0));
  assert.equal(e.project.legacyImport.inertEvents[0].index, 0);
});
check('standalone stored order, direct index and retained64', () => {
  assert.equal(s.project.sequences.length, 2);
  assert.deepEqual(
    s.normalized.events.map((x) => [x.sequence, x.step]),
    [
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 0],
      [1, 63]
    ]
  );
  assert.deepEqual(s.project.legacyImport.inertEvents, [
    { sequence: 'Sequence3', channel: 0, index: 64, reverse: true, reason: 'outside-profile-range' }
  ]);
  assert.equal(s.project.songEndStep, 128);
});
const settings = fixture([1], {
  trimSettings: [{ startSliderValue: 12.3456, endSliderValue: 78.9123, start: 5, end: 60 }],
  channelVolume: [0.98765],
  channelPlaybackSpeed: [9.03456]
});
const exact = await load(settings),
  rounded = await load(settings, standalone);
check('editor raw gain speed and slider precedence', () => {
  assert.equal(exact.project.channels[0].trimStart, 0.123456);
  assert.equal(exact.project.channels[0].trimEnd, 0.789123);
  assert.equal(exact.project.channels[0].volume, 0.98765);
  assert.equal(exact.project.channels[0].pitch, 9.03456);
});
check('standalone independent 3decimal preprocessing', () => {
  assert.equal(rounded.project.channels[0].trimStart, 0.123);
  assert.equal(rounded.project.channels[0].trimEnd, 0.789);
  assert.equal(rounded.project.channels[0].volume, 0.988);
  assert.equal(rounded.project.channels[0].pitch, 9.035);
  assert.deepEqual(rounded.project.legacyImport.metadata.trimSettings, settings.trimSettings);
});
const zeros = await load(
  fixture([1], { channelVolume: [0], trimSettings: [{ endSliderValue: 0 }] }),
  standalone
);
check('standalone historical falsy fallbacks', () => {
  assert.equal(zeros.project.channels[0].volume, 1);
  assert.equal(zeros.project.channels[0].trimEnd, 1);
});
const aliases = await load(fixture([1], { trimSettings: [{ start: 20, end: 40 }] }), standalone);
check('standalone ignores later aliases explicitly', () => {
  assert.equal(aliases.project.channels[0].trimStart, 0);
  assert.equal(aliases.project.channels[0].trimEnd, 1);
  assert.ok(aliases.report.issues.some((x) => x.code === 'STANDALONE_TRIM_ALIASES'));
});
const textBpm = await load(fixture([1], { projectBPM: '140.0' }));
check('historical numeric-string tempo retained', () => {
  assert.equal(textBpm.project.bpm, 140);
  assert.equal(textBpm.project.legacyImport.metadata.projectBPM, '140.0');
});
const trimMetadata = await load(fixture([1], { trimSettings: [{ 15: 0.649, length: 12.5 }] }));
check('contextual trim steps and length retained', () => {
  assert.equal(trimMetadata.report.canImport, true);
  assert.deepEqual(trimMetadata.project.legacyImport.metadata.trimSettings, [
    { steps: 0.649, length: 12.5 }
  ]);
});
const longLabel = await load(fixture([1], { projectChannelNames: [id] }));
check('complete inscription label survives shorter display name', () => {
  assert.equal(id.length, 66);
  assert.equal(longLabel.normalized.channels[0].name, id);
  assert.equal(longLabel.project.channels[0].sampleName, id);
  assert.equal(longLabel.project.channels[0].name, id.slice(0, 64));
  assert.ok(longLabel.report.issues.some((x) => x.code === 'DISPLAY_NAME_SHORTENED'));
});
for (const profile of [editor, standalone]) {
  for (const point of [25, 100]) {
    const silent = await load(
      fixture([1], { trimSettings: [{ startSliderValue: point, endSliderValue: point }] }),
      profile
    );
    check('zero-width trim stays exact and silent ' + profile + point, () => {
      assert.equal(silent.report.canImport, true);
      assert.equal(silent.project.channels[0].trimStart, point / 100);
      assert.equal(silent.project.channels[0].trimEnd, point / 100);
      assert.ok(silent.report.issues.some((x) => x.code === 'SILENT_TRIM'));
    });
  }
}
const reversedTrim = await load(fixture([1], { trimSettings: [{ start: 70, end: 30 }] }));
check('reversed trim remains explicit error', () => {
  assert.equal(reversedTrim.project, null);
  assert.ok(reversedTrim.report.issues.some((x) => x.code === 'REVERSED_TRIM'));
});
const compact = {
  0: 'Compact',
  2: 120,
  4: Array(27).fill(source),
  7: [{ 9: 10, 10: 90 }],
  14: { s0: { A: { 15: [{ r: [1, 3] }, '64r'] }, 26: { 15: [2] } } },
  channelSettings: { 26: { volume: 1, pitch: 1 } },
  metadata: { 0: 'not-a-title' }
};
check('contextual key decode preserves numeric user dictionaries', () => {
  const d = decodeCompactDocument(compact);
  assert.equal(d.projectName, 'Compact');
  assert.equal(d.projectSequences.s0['26'].steps[0], 2);
  assert.deepEqual(d.metadata, { 0: 'not-a-title' });
  assert.deepEqual(d.channelSettings, { 26: { volume: 1, pitch: 1 } });
  assert.deepEqual(d.trimSettings, [{ startSliderValue: 10, endSliderValue: 90 }]);
});
const recognized = structuredClone(compact);
delete recognized.metadata;
const compactProject = await load(recognized);
check('channel26 numeric alias and compressedranges', () => {
  assert.equal(compactProject.report.canImport, true);
  assert.equal(compactProject.project.channels.length, 27);
  assert.equal(compactProject.project.sequences[0].steps[26][1], 1);
  assert.equal(compactProject.project.sequences[0].steps[0][63].rev, true);
});
const conflict = await load({ ...recognized, projectName: 'Conflicting' });
check('conflicting aliases block', () =>
  assert.ok(conflict.report.issues.some((x) => x.code === 'CONFLICTING_ALIASES'))
);
const dictionary = fixture(3),
  missing = await load(dictionary);
check('scalar is not a count or note', () => {
  assert.equal(missing.project, null);
  assert.ok(missing.report.issues.some((x) => x.code === 'MISSING_COMPANION'));
});
const resolved = await load(dictionary, editor, { companion: { 3: [1, '64r'] } });
check('explicit companion expands exact pattern', () => {
  assert.equal(resolved.project.sequences[0].steps[0][0], 1);
  assert.equal(resolved.project.sequences[0].steps[0][63].rev, true);
  assert.match(resolved.report.companionHash, /^[a-f0-9]{64}$/);
});
for (const [name, steps, code] of [
  ['mixed', [true, 1], 'MIXED_STEP_ENCODING'],
  ['outofrange', [65], 'INVALID_STEP'],
  ['descending', [{ r: [4, 2] }], 'INVALID_RANGE'],
  ['unknownfields', [{ index: 1, reverse: true, velocity: 2 }], 'UNSUPPORTED_STEP_FIELD']
]) {
  const r = await load(fixture(steps));
  check(name, () => assert.ok(r.report.issues.some((x) => x.code === code)));
}
check('expansionbudget before allocation', () =>
  assert.throws(
    () => expandLegacySteps([{ r: [0, 64] }], { budget: { remaining: 3 } }),
    (e) => e.code === 'EVENT_LIMIT'
  )
);
const mismatch = await load(
  fixture([1], { channelURLs: [source], projectSequences: { Sequence0: { ch2: { steps: [1] } } } })
);
check('filtered sources never shifted', () =>
  assert.ok(mismatch.report.issues.some((x) => x.code === 'AMBIGUOUS_SOURCE_ALIGNMENT'))
);
const placeholder = await load(fixture([1], { channelURLs: [0] }));
check('numeric sample token is unresolved', () =>
  assert.ok(placeholder.report.issues.some((x) => x.code === 'UNRESOLVED_SOURCE'))
);
const rowToken = await load(
  fixture([1], { projectSequences: { Sequence0: { ch0: { steps: [1], url: 0 } } } })
);
check('falsy row source token is not ignored', () =>
  assert.ok(rowToken.report.issues.some((x) => x.code === 'UNRESOLVED_SOURCE'))
);
for (const extra of [
  { projectURLs: ['/content/' + 'cd'.repeat(32) + 'i0'] },
  { bpm: 121 },
  { projectName: { title: 'Not text' } },
  { projectChannelNames: ['x'.repeat(161)] }
]) {
  const r = await load(fixture([1], extra));
  check('ambiguous or lossy metadata blocks', () => {
    assert.equal(r.project, null);
    assert.ok(r.report.issues.some((x) => x.severity === 'error'));
  });
}
for (const [extra, code] of [
  [{ globalPlaybackSpeed: 2 }, 'UNSUPPORTED_GLOBAL_SPEED'],
  [{ channelSettings: { ch0: { volume: 0.5, pitch: 1 } } }, 'UNSUPPORTED_CHANNEL_SETTING'],
  [{ mystery: { 0: 12 } }, 'UNSUPPORTED_FIELD']
]) {
  const r = await load(fixture([1], extra));
  check(code, () => {
    assert.equal(r.project, null);
    assert.ok(r.report.issues.some((x) => x.code === code));
  });
}
const overlap = await load(fixture([1, '1r']), standalone);
check('unrepresentable simultaneousdirections block', () =>
  assert.ok(overlap.report.issues.some((x) => x.code === 'UNREPRESENTABLE_OVERLAP'))
);
const dupe = await load(fixture([1, 1]));
check('repeated event evidence preserved', () => {
  assert.equal(dupe.report.stats.playableEvents, 1);
  assert.equal(dupe.project.legacyImport.duplicateEvents.length, 1);
});
check('slim provenance excludes original payload', () => {
  assert.equal('originalDocument' in exact.project.legacyImport, false);
  assert.equal(JSON.stringify(exact.project.legacyImport).includes(id), false);
  assert.deepEqual(validateLegacyImport(exact.project.legacyImport), exact.project.legacyImport);
  assert.throws(
    () => validateLegacyImport({ ...exact.project.legacyImport, originalDocument: settings }),
    (e) => e.code === 'INVALID_PROVENANCE'
  );
});
for (const field of ['inertEvents', 'duplicateEvents'])
  check('retained event rejects hidden resource ' + field, () => {
    const value = structuredClone(s.project.legacyImport);
    value[field] = [
      {
        sequence: 'Sequence0',
        channel: 0,
        index: 64,
        reverse: false,
        reason: 'outside-profile-range',
        source: { type: 'url', value: 'https://example.invalid/audio.wav' }
      }
    ];
    assert.throws(
      () => validateLegacyImport(value),
      (e) => e.code === 'INVALID_PROVENANCE'
    );
  });
check('provenance cannot claim another input repair', () => {
  const value = structuredClone(exact.project.legacyImport);
  value.repairs = [
    { originalSha256: '5df1ed5bf8b48d5102e892f0ac7cb4feb36c12c03b3ceec78369e18749caf21a' }
  ];
  assert.throws(
    () => validateLegacyImport(value),
    (e) => e.code === 'INVALID_PROVENANCE'
  );
});
check('provenance scalar fields require exact types', () => {
  const value = structuredClone(exact.project.legacyImport);
  value.sourceHash = [value.sourceHash];
  assert.throws(
    () => validateLegacyImport(value),
    (e) => e.code === 'INVALID_PROVENANCE'
  );
});
for (const format of [
  'audionaut-workstation/2',
  'audionaut-workstation/3',
  'audional-sequencer-x/1',
  'audionaut-chain-song/1'
]) {
  const r = await prepareLegacyImport({ format });
  check('native dispatcher ' + format, () => {
    assert.equal(r.kind, 'native');
    assert.equal(r.project, null);
    assert.equal(r.report.canImport, true);
  });
}
const large = { format: 'audionaut-workstation/3', padding: 'x'.repeat(9 * 1024 * 1024) };
await rejects('default byte limit', () => prepareLegacyImport(large), 'DOCUMENT_TOO_LARGE');
const nativeLarge = await prepareLegacyImport(large, { limits: DOCUMENT_HARD_LIMITS });
check('native larger envelope remains supported', () => assert.equal(nativeLarge.kind, 'native'));
await rejects(
  'legacy bound after permissive native reading',
  () =>
    prepareLegacyImport(fixture([1], { padding: large.padding }), {
      profileId: editor,
      limits: DOCUMENT_HARD_LIMITS
    }),
  'LEGACY_DOCUMENT_TOO_LARGE'
);
const sync = prepareLegacyDocumentSync(settings, { profileId: editor });
check('sync migration agrees with independent hash and explicit profile', () => {
  assert.equal(
    sync.sourceHash,
    createHash('sha256').update(JSON.stringify(settings)).digest('hex')
  );
  assert.deepEqual(sync.normalized, exact.normalized);
});
const og = await prepareLegacyImport(
  {
    descriptive: { title: 'OG synthetic' },
    audxData: { bpm: 120, channels: [{ url: source, triggers: [1, 64], toggleMuteSteps: [64] }] }
  },
  { provenance: { endStep: 128 } }
);
check('OG wrapper dispatch preserves toggles and endpoints', () => {
  assert.equal(og.kind, 'og');
  assert.equal(og.project.songEndStep, 128);
  assert.equal(og.project.sequences[0].steps[0][0], 1);
  assert.equal(og.project.sequences[0].steps[0][63], 1);
  assert.ok(og.project.sequences[1].steps[0].every((v) => v === 0));
  assert.equal(og.project.masterVolume, 0.9);
});
console.log(
  `PASS ${checks} independent synthetic legacy decoder checks: bytes/gzip/bounds, contexts, dense/sparse/ranges, profiles, companions, source alignment, native/OG dispatch and retained provenance`
);
