// Local-only corpus audit. No song fixtures are bundled or downloaded. All
// expected musical values below are derived independently from historical raw
// documents and the separately reviewed repair evidence, not bridge adapters.
// Required environment: AUDIONAUT_LEGACY_INVENTORY, AUDIONAUT_LEGACY_REPAIR_EVIDENCE,
// AUDIONAUT_LEGACY_FILTERED_EVIDENCE, AUDIONAUT_LEGACY_HISTORICAL_REPO.
// Optional AUDIONAUT_LEGACY_CORPUS_REPORT writes
// a local summary. The inventory contains the explicitly supplied input paths.
// Set AUDIONAUT_LEGACY_CORPUS_BROWSER=1 for actual persistence import/export
// roundtrips in the selected Playwright browser, with all remote requests blocked.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash, webcrypto } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { readDocument } from '../daw/js/legacy-bridge/read-document.js';
import { detectFormat } from '../daw/js/legacy-bridge/detect-format.js';
import { selectLegacyProfile } from '../daw/js/legacy-bridge/profiles.js';
import { prepareLegacyImport } from '../daw/js/legacy-bridge/index.js';
import { legacySamplePlayback } from '../daw/js/legacy-bridge/playback.js';
import { applyVerifiedLegacyRepair } from '../daw/js/legacy-bridge/repair-registry.js';

if (!globalThis.crypto) globalThis.crypto = webcrypto;
const required = (name) => {
  assert.ok(process.env[name], `Set ${name} explicitly; private corpus discovery is disabled.`);
  return process.env[name];
};
const inventory = JSON.parse(await readFile(required('AUDIONAUT_LEGACY_INVENTORY'), 'utf8'));
const evidence = JSON.parse(await readFile(required('AUDIONAUT_LEGACY_REPAIR_EVIDENCE'), 'utf8'));
const filteredEvidence = JSON.parse(
  await readFile(required('AUDIONAUT_LEGACY_FILTERED_EVIDENCE'), 'utf8')
);
const historicalRepo = required('AUDIONAUT_LEGACY_HISTORICAL_REPO');
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const publicFile = (path) =>
  execFileSync('git', [
    '-C',
    historicalRepo,
    'show',
    evidence.patternDictionary.commit + ':' + path
  ]);
const patternBytes = publicFile(evidence.patternDictionary.path);
assert.equal(sha(patternBytes), evidence.patternDictionary.sha256);
const patterns = JSON.parse(patternBytes);
assert.equal(Object.keys(patterns).length, 166);
assert.equal(inventory.length, 99, 'The reviewed collection has 99 input paths.');
assert.equal(
  new Set(inventory.map((row) => row.sha256)).size,
  95,
  'The reviewed collection has 95 distinct original-byte hashes.'
);

const donors = new Map();
for (const repair of evidence.sourceMapRepairs) {
  const bytes = await readFile(repair.donor.path);
  assert.equal(sha(bytes), repair.donor.sha256, 'Source-map evidence donor changed.');
  donors.set(repair.input.sha256, JSON.parse(bytes));
}
const sourceTails = new Map();
for (const repair of filteredEvidence.repairs) {
  const bytes = await readFile(repair.donor.path);
  assert.equal(sha(bytes), repair.donor.sha256);
  const urls = JSON.parse(bytes).channelURLs;
  assert.equal(sha(JSON.stringify(urls)), repair.companion.donorSourceArraySha256);
  assert.equal(urls.length, 64);
  assert.ok(urls.slice(repair.companion.originalSourceCount).every((value) => value === ''));
  sourceTails.set(repair.input.sha256, { repair, urls });
}
const clone = (value) => structuredClone(value);
const sourceArrays = (value) => ({
  urls: value.channelURLs ?? value['4'],
  names: value.projectChannelNames ?? value['8']
});
function independentlyRepaired(document, originalSha256) {
  const data = clone(document),
    changes = [];
  if (donors.has(originalSha256)) {
    const donor = sourceArrays(donors.get(originalSha256));
    const compact = Object.hasOwn(data, '14');
    data[compact ? '4' : 'channelURLs'] = clone(donor.urls);
    data[compact ? '8' : 'projectChannelNames'] = clone(donor.names);
    changes.push('sources');
  }
  if (sourceTails.has(originalSha256)) {
    const { repair, urls } = sourceTails.get(originalSha256),
      count = repair.companion.originalSourceCount;
    assert.equal(data['4'].length, count);
    assert.equal(sha(JSON.stringify(data['4'])), repair.companion.originalSourceArraySha256);
    const identity = (value) => value.split('/content/')[1];
    assert.deepEqual(data['4'].map(identity), urls.slice(0, count).map(identity));
    data['4'].push(...Array(64 - count).fill(''));
    changes.push('verified-source-tail');
  }
  if (
    [
      evidence.patternDictionary.input.sha256,
      evidence.discardedPatternRepair.input.sha256
    ].includes(originalSha256)
  ) {
    const compact = Object.hasOwn(data, '14');
    for (const sequence of Object.values(data[compact ? '14' : 'projectSequences']))
      for (const row of Object.values(sequence)) {
        const key = compact ? '15' : 'steps';
        if (typeof row[key] === 'number') {
          assert.ok(Object.hasOwn(patterns, row[key]));
          row[key] = clone(patterns[row[key]]);
        }
      }
    changes.push('dictionary');
    if (originalSha256 === evidence.discardedPatternRepair.input.sha256) {
      assert.equal(Object.hasOwn(data.projectSequences.Sequence0, 'ch0'), false);
      data.projectSequences.Sequence0.ch0 = { steps: [42] };
      changes.push('restored-event');
    }
  }
  return { data, changes };
}
// Context-specific decoding is deliberately independent of COMPACT_KEYS and
// expandLegacySteps: these constants come from the historical serializer.
function independentDocument(raw) {
  const topNames = [
    'projectName',
    'artistName',
    'projectBPM',
    'currentSequence',
    'channelURLs',
    'channelVolume',
    'channelPlaybackSpeed',
    'trimSettings',
    'projectChannelNames'
  ];
  const data = clone(raw);
  for (let index = 0; index < topNames.length; index++)
    if (Object.hasOwn(raw, index)) data[topNames[index]] = raw[index];
  if (Object.hasOwn(raw, '14')) data.projectSequences = raw['14'];
  if (Object.hasOwn(raw, '16')) data.channelGroups = raw['16'];
  data.trimSettings = (data.trimSettings || []).map((trim) => {
    const result = { ...trim };
    for (const [key, name] of [
      [9, 'startSliderValue'],
      [10, 'endSliderValue'],
      [11, 'totalSampleDuration'],
      [12, 'start'],
      [13, 'end']
    ])
      if (Object.hasOwn(trim, key)) result[name] = trim[key];
    return result;
  });
  return data;
}
const sequenceNumber = (name) => Number(name.replace(/^(Sequence|s)/, ''));
const channelNumber = (name) =>
  /^ch/.test(name)
    ? Number(name.slice(2))
    : /^[A-Z]$/.test(name)
      ? name.charCodeAt(0) - 65
      : Number(name);
function independentSteps(steps) {
  assert.ok(Array.isArray(steps), 'An unresolved scalar pattern must not be guessed.');
  const events = [];
  if (steps.length && steps.every((value) => typeof value === 'boolean')) {
    steps.forEach((value, index) => {
      if (value) events.push({ index, reverse: false });
    });
    return events;
  }
  for (const value of steps) {
    if (typeof value === 'number') events.push({ index: value, reverse: false });
    else if (typeof value === 'string') {
      assert.match(value, /^\d+r$/);
      events.push({ index: Number(value.slice(0, -1)), reverse: true });
    } else if (Array.isArray(value.r))
      for (let index = value.r[0]; index <= value.r[1]; index++)
        events.push({ index, reverse: false });
    else {
      assert.ok(Number.isInteger(value.index));
      events.push({ index: value.index, reverse: value.reverse === true });
    }
  }
  return events;
}
function independentSource(value) {
  if (value == null || value === '') return null;
  assert.equal(typeof value, 'string', 'Unrepaired source-map token.');
  const match = value.match(/([a-fA-F0-9]{64}i\d+)(?:[?#].*)?$/);
  assert.ok(match, 'The reviewed legacy corpus uses immutable Ordinal identities.');
  return { type: 'ordinal', value: match[1].toLowerCase() };
}
function referenceSong(raw, profileId) {
  const data = independentDocument(raw),
    sourceRows = Object.entries(data.projectSequences);
  const standalone = profileId === 'audionals-standalone-v1',
    dense = profileId === 'audionals-dense-v1';
  const urls = data.channelURLs ?? data.projectURLs ?? [];
  const channelCount = Math.max(
    1,
    urls.length,
    ...[
      'channelVolume',
      'channelPlaybackSpeed',
      'trimSettings',
      'projectChannelNames',
      'channelGroups'
    ].map((key) => data[key]?.length || 0),
    ...sourceRows.flatMap(([, sequence]) =>
      Object.keys(sequence).map((name) => channelNumber(name) + 1)
    )
  );
  const sequenceCount = standalone
    ? sourceRows.length
    : Math.max(...sourceRows.map(([name]) => sequenceNumber(name))) + 1;
  const events = [],
    inert = [],
    emptySequences = Array.from({ length: sequenceCount }, () => true);
  let encodedEvents = 0;
  for (let ordinal = 0; ordinal < sourceRows.length; ordinal++) {
    const [name, sequence] = sourceRows[ordinal],
      destination = standalone ? ordinal : sequenceNumber(name);
    for (const [alias, row] of Object.entries(sequence)) {
      const channel = channelNumber(alias),
        expanded = independentSteps(row.steps ?? row['15'] ?? []);
      assert.ok(!row.mute && !row.url, 'The reviewed corpus has no active per-row override.');
      for (const event of expanded) {
        encodedEvents++;
        const step = event.index - (standalone || dense ? 0 : 1);
        if (step < 0 || step >= 64)
          inert.push({
            sequence: name,
            channel,
            index: event.index,
            reverse: event.reverse,
            reason: 'outside-profile-range'
          });
        else {
          events.push({ sequence: destination, channel, step, reverse: event.reverse });
          emptySequences[destination] = false;
        }
      }
    }
  }
  const channels = Array.from({ length: channelCount }, (_, index) => {
    const trim = data.trimSettings[index] || {};
    // Primary sources: historical editor audioUtils.js223–224; standalone
    // jsonLoader.js122–128 and commonUtils.js12–27 at the pinned commit.
    const start = standalone
      ? trim.startSliderValue || 0
      : (trim.startSliderValue ?? trim.start ?? 0);
    const end = standalone ? trim.endSliderValue || 100 : (trim.endSliderValue ?? trim.end ?? 100);
    const volume = standalone
      ? Math.max(0, Math.min(3, Number(Number(data.channelVolume?.[index] || 1).toFixed(3))))
      : (data.channelVolume?.[index] ?? 1);
    const pitch = standalone
      ? Number(
          Number(
            Math.max(0.1, Math.min(data.channelPlaybackSpeed?.[index] ?? 1, 100)) || 1
          ).toFixed(3)
        )
      : (data.channelPlaybackSpeed?.[index] ?? 1);
    return {
      index,
      source: independentSource(urls[index]),
      name: data.projectChannelNames?.[index] ?? `Channel ${index + 1}`,
      volume,
      pitch,
      trimStart: standalone ? Number((start / 100).toFixed(3)) : start / 100,
      trimEnd: standalone ? Number((end / 100).toFixed(3)) : end / 100
    };
  });
  return {
    title: data.projectName || 'Imported Audional song',
    bpm: Number(data.projectBPM ?? data.bpm ?? 120),
    channels,
    events,
    inert,
    encodedEvents,
    sequenceCount,
    emptySequences,
    metadata: data
  };
}

const summary = {
  inputs: 0,
  distinctHashes: 95,
  native: 0,
  legacy: 0,
  dense: 0,
  profileCases: 0,
  automaticImports: 0,
  editorDefaultChecks: 0,
  repairCases: 0,
  failures: []
};
const browserCases = [];
async function checkProfile(
  row,
  decoded,
  repaired,
  detection,
  profileId,
  reference,
  { stagedResult = null, recordProfile = true } = {}
) {
  const selection = selectLegacyProfile(detection, { profileId, sourceHash: decoded.sourceHash });
  assert.equal(selection.requiresProfileChoice, false);
  assert.equal(selection.profileSelection, 'explicit');
  const staged =
    stagedResult || (await prepareLegacyImport(decoded.bytes, { profileId, useWorker: false }));
  const { report, normalized: song, project } = staged;
  assert.equal(staged.requiresProfileChoice, false);
  assert.equal(report.profileId, profileId);
  if (!stagedResult) assert.equal(report.profileSelection, 'explicit');
  assert.equal(
    report.canImport,
    true,
    'Import blocked: ' +
      report.issues
        .filter((issue) => issue.severity === 'error')
        .map((issue) => issue.code + ': ' + issue.message)
        .join('; ')
  );
  assert.deepEqual(staged.document, decoded.document, 'Preview must retain the original document.');
  assert.deepEqual(
    song.channels,
    reference.channels,
    'channel source/name/gain/rate/trim differs from historical oracle'
  );
  assert.deepEqual(song.events, reference.events, 'exact event positions/directions differ');
  assert.deepEqual(
    song.inertEvents,
    reference.inert,
    'inactive historical entries must survive as evidence'
  );
  assert.equal(song.stats.encodedEvents, reference.encodedEvents);
  assert.equal(song.sequenceCount, reference.sequenceCount);
  assert.equal(song.title, reference.title);
  assert.equal(song.bpm, reference.bpm);
  assert.equal(song.duplicateEvents.length, 0, 'Reviewed corpus has no duplicate triggers.');
  for (const key of [
    'currentSequence',
    'channelGroups',
    'channelSettings',
    'globalPlaybackSpeed',
    'channelVolume',
    'channelPlaybackSpeed'
  ])
    if (reference.metadata[key] !== undefined)
      assert.deepEqual(
        song.metadata[key],
        reference.metadata[key],
        `Original ${key} metadata changed.`
      );
  const errors = report.issues.filter((issue) => issue.severity === 'error');
  assert.deepEqual(errors, [], 'Reviewed recoverable song has conversion blockers.');
  assert.equal(project.songEndStep, reference.sequenceCount * 64);
  assert.equal(project.playEmptySequences, true);
  assert.equal(project.continuous, false);
  assert.equal(project.choke, false);
  assert.equal(project.sequences.length, reference.sequenceCount);
  assert.equal(project.channels.length, reference.channels.length);
  assert.equal(project.timeline.loop.enabled, false);
  const actualEvents = [];
  project.sequences.forEach((sequence, sequenceIndex) =>
    sequence.steps.forEach((steps, channel) =>
      steps.forEach((value, step) => {
        if (value)
          actualEvents.push({ sequence: sequenceIndex, channel, step, reverse: !!value.rev });
      })
    )
  );
  const order = (events) =>
    [...events].sort((a, b) => a.sequence - b.sequence || a.channel - b.channel || a.step - b.step);
  assert.deepEqual(
    order(actualEvents),
    order(reference.events),
    'Native project grid changed normalized performance.'
  );
  assert.deepEqual(
    project.sequences.map((sequence) => !sequence.steps.some((steps) => steps.some(Boolean))),
    reference.emptySequences,
    'Rest/gap sequences changed.'
  );
  for (const channel of reference.channels)
    for (const reverse of [false, true]) {
      const duration = 2.375,
        offset = (reverse ? 1 - channel.trimEnd : channel.trimStart) * duration;
      const requested =
        ((channel.trimEnd - channel.trimStart) * duration) /
        (profileId === 'audionals-standalone-v1' ? channel.pitch : 1);
      const sourceDuration = Math.min(requested, duration - offset);
      const played = legacySamplePlayback(
        project,
        project.channels[channel.index],
        { rev: reverse },
        duration
      );
      assert.equal(played.offset, offset);
      assert.equal(played.sourceDuration, sourceDuration);
      assert.equal(played.audibleDuration, sourceDuration / channel.pitch);
    }
  if (repaired.repair) {
    assert.equal(project.legacyImport.repairs.length, 1);
    assert.equal(project.legacyImport.repairs[0].originalSha256, row.sha256);
  }
  if (recordProfile) {
    browserCases.push({ row, profileId, reference });
    summary.profileCases++;
  }
}

for (let index = 0; index < inventory.length; index++) {
  const row = inventory[index],
    label = `${index + 1}/${inventory.length} ${row.sha256.slice(0, 12)}`;
  try {
    const bytes = new Uint8Array(await readFile(row.file));
    assert.equal(sha(bytes), row.sha256, 'Original bytes changed since review.');
    const gzip = bytes[0] === 31 && bytes[1] === 139,
      independent = JSON.parse(new TextDecoder().decode(gzip ? gunzipSync(bytes) : bytes));
    assert.deepEqual(independent, row.document, 'Local inventory does not describe these bytes.');
    const decoded = await readDocument(bytes, { useWorker: false });
    assert.equal(decoded.sourceHash, row.sha256);
    assert.equal(decoded.container, gzip ? 'gzip' : 'json');
    assert.deepEqual(decoded.document, independent);
    const detection = detectFormat(decoded.document);
    if (independent.format) {
      assert.ok(['audionaut-workstation/2', 'audional-sequencer-x/1'].includes(independent.format));
      const native = await prepareLegacyImport(bytes, { useWorker: false });
      assert.equal(detection.kind, 'native');
      assert.equal(native.kind, 'native');
      assert.equal(native.report.canImport, true);
      assert.equal(native.project, null);
      assert.deepEqual(native.document, independent);
      browserCases.push({ row, profileId: null, reference: null });
      summary.native++;
      summary.inputs++;
      continue;
    }
    assert.equal(detection.kind, 'legacy');
    summary.legacy++;
    const oracle = independentlyRepaired(independent, row.sha256),
      repaired = await applyVerifiedLegacyRepair({
        bytes,
        document: decoded.document,
        sha256: row.sha256
      });
    assert.deepEqual(
      repaired.document,
      oracle.data,
      'Narrow repair differs from independent evidence.'
    );
    assert.equal(!!repaired.repair, oracle.changes.length > 0);
    if (repaired.repair) summary.repairCases++;
    const data = independentDocument(oracle.data),
      isDense = Array.isArray(data.projectURLs);
    const profiles = isDense
      ? ['audionals-dense-v1']
      : ['audionals-editor-v1', 'audionals-standalone-v1'];
    const implicit = await prepareLegacyImport(bytes, { useWorker: false });
    const automaticProfile = isDense ? 'audionals-dense-v1' : 'audionals-editor-v1';
    assert.equal(
      implicit.requiresProfileChoice,
      false,
      'Supported songs must load without a mandatory playback choice.'
    );
    assert.equal(implicit.report.profileId, automaticProfile);
    assert.equal(implicit.report.canImport, true);
    assert.ok(implicit.project);
    assert.ok(!implicit.report.issues.some((issue) => issue.code === 'PROFILE_CHOICE_REQUIRED'));
    if (isDense) {
      summary.dense++;
      assert.equal(implicit.report.profileSelection, 'format');
    } else {
      assert.equal(
        implicit.report.profileSelection,
        'editor-default',
        'Shared sparse/compact bytes must use the documented editor default without claiming historical intent.'
      );
      assert.deepEqual(
        implicit.profileChoices.map((profile) => profile.id),
        profiles
      );
      summary.editorDefaultChecks++;
    }
    await checkProfile(
      row,
      decoded,
      repaired,
      detection,
      automaticProfile,
      referenceSong(oracle.data, automaticProfile),
      { stagedResult: implicit, recordProfile: false }
    );
    summary.automaticImports++;
    for (const profileId of profiles) {
      try {
        await checkProfile(
          row,
          decoded,
          repaired,
          detection,
          profileId,
          referenceSong(oracle.data, profileId)
        );
      } catch (error) {
        summary.failures.push({
          index: index + 1,
          sha256: row.sha256,
          profileId,
          message: error.message
        });
        console.error(`FAIL ${label} ${profileId}: ${error.message.slice(0, 220)}`);
      }
    }
    summary.inputs++;
  } catch (error) {
    summary.failures.push({ index: index + 1, sha256: row.sha256, message: error.message });
    console.error(`FAIL ${label}: ${error.message.slice(0, 220)}`);
  }
}
assert.equal(
  summary.native,
  11,
  'All nine native AudioNaut and two Sequencer X files must retain native classification.'
);
assert.equal(summary.legacy, 88);
assert.equal(summary.dense, 3);
if (process.env.AUDIONAUT_LEGACY_CORPUS_REPORT)
  await writeFile(
    process.env.AUDIONAUT_LEGACY_CORPUS_REPORT,
    JSON.stringify(summary, null, 2) + '\n'
  );
console.log(JSON.stringify({ ...summary, failures: summary.failures.length }, null, 2));
assert.equal(
  summary.failures.length,
  0,
  'Local corpus parity failed; inspect the per-profile findings.'
);
assert.equal(summary.profileCases, 173);
assert.equal(summary.automaticImports, 88);
assert.equal(summary.editorDefaultChecks, 85);
assert.equal(summary.inputs, 99);

if (process.env.AUDIONAUT_LEGACY_CORPUS_BROWSER === '1') {
  const { serve, browser, page } = await import('./serve.mjs');
  const { srv, url } = await serve();
  let b;
  const browserResult = {
    browser: process.env.AUDIONAUT_TEST_BROWSER || 'chromium',
    cases: 0,
    nativeCases: 0,
    legacyCases: 0,
    remoteRequests: [],
    failures: []
  };
  try {
    b = await browser();
    const p = await page(b, url);
    p.on('request', (request) => {
      if (!request.url().startsWith(url) && /^https?:/.test(request.url()))
        browserResult.remoteRequests.push(request.url());
    });
    await p.goto(url + '/audionaut-beta/tools/harness.html');
    await p.evaluate(async () => {
      const P = await import('/audionaut-beta/daw/js/persistence.js'),
        B = await import('/audionaut-beta/daw/js/legacy-bridge/index.js'),
        S = await import('/audionaut-beta/daw/js/state.js');
      globalThis.corpusPersistence = { P, B, S };
    });
    for (let index = 0; index < browserCases.length; index++) {
      const { row, profileId, reference } = browserCases[index];
      const bytes = await readFile(row.file);
      const result = await p.evaluate(
        async ({ base64, profileId, reference }) => {
          const { P, B, S } = corpusPersistence;
          const ok = (condition, message) => {
            if (!condition) throw Error(message);
          };
          const equal = (actual, expected, message) =>
            ok(JSON.stringify(actual) === JSON.stringify(expected), message);
          const canonical = (value) =>
            Array.isArray(value)
              ? '[' + value.map(canonical).join(',') + ']'
              : value && typeof value === 'object'
                ? '{' +
                  Object.keys(value)
                    .sort()
                    .map((key) => JSON.stringify(key) + ':' + canonical(value[key]))
                    .join(',') +
                  '}'
                : JSON.stringify(value);
          const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
          const staged = await B.prepareLegacyImport(bytes, { profileId: profileId || undefined });
          ok(
            staged.report.canImport,
            'Browser import blocked: ' +
              staged.report.issues.map((issue) => issue.code + ':' + issue.message).join('; ')
          );
          const raw = staged.kind === 'native' ? staged.document : staged.project;
          const prepared = P.prepareProject(raw);
          function checkNative(candidate) {
            ok(candidate.channels.length === raw.channels.length, 'Native channel count changed.');
            ok(
              candidate.sequences.length === raw.sequences.length,
              'Native sequence count changed.'
            );
            for (let ch = 0; ch < raw.channels.length; ch++) {
              for (const field of [
                'volume',
                'pitch',
                'trimStart',
                'trimEnd',
                'reverse',
                'mute',
                'solo'
              ])
                if (Object.hasOwn(raw.channels[ch], field))
                  equal(
                    candidate.channels[ch][field],
                    raw.channels[ch][field],
                    `Native channel ${ch} ${field} changed.`
                  );
              const expectedSource = raw.channels[ch].source,
                actualSource = candidate.channels[ch].source;
              if (expectedSource) {
                equal(actualSource?.type, expectedSource.type, `Native source ${ch} type changed.`);
                equal(
                  actualSource?.value,
                  expectedSource.value,
                  `Native source ${ch} identity changed.`
                );
              }
            }
            for (let s = 0; s < raw.sequences.length; s++) {
              for (let ch = 0; ch < raw.sequences[s].steps.length; ch++)
                for (let step = 0; step < raw.sequences[s].steps[ch].length; step++) {
                  const a = candidate.sequences[s].steps[ch][step],
                    e = raw.sequences[s].steps[ch][step];
                  ok(!!a === !!e, `Native trigger ${s}/${ch}/${step} changed.`);
                  if (e && typeof e === 'object')
                    for (const [field, value] of Object.entries(e))
                      equal(a[field], value, `Native trigger ${s}/${ch}/${step} ${field} changed.`);
                }
              for (
                let instrument = 0;
                instrument < (raw.sequences[s].notes || []).length;
                instrument++
              ) {
                const expected = raw.sequences[s].notes[instrument],
                  actual = candidate.sequences[s].notes[instrument];
                ok(
                  actual.length === expected.length,
                  `Native MIDI notes ${s}/${instrument} changed.`
                );
                for (let note = 0; note < expected.length; note++)
                  for (const field of ['step', 'pitch', 'dur', 'vel'])
                    if (Object.hasOwn(expected[note], field))
                      equal(
                        actual[note][field],
                        expected[note][field],
                        `Native MIDI note ${s}/${instrument}/${note} ${field} changed.`
                      );
              }
            }
          }
          function checkLegacy(candidate) {
            ok(
              candidate.channels.length === reference.channels.length,
              'Legacy channel count changed.'
            );
            for (const expected of reference.channels) {
              const actual = candidate.channels[expected.index];
              for (const field of ['source', 'volume', 'pitch', 'trimStart', 'trimEnd'])
                equal(
                  actual[field],
                  expected[field],
                  `Historical channel ${expected.index} ${field} changed or clamped.`
                );
              equal(
                actual.sampleName,
                expected.name,
                `Historical channel ${expected.index} full sample label changed.`
              );
              equal(
                actual.name,
                expected.name.slice(0, 64),
                `Historical channel ${expected.index} display label changed.`
              );
            }
            equal(candidate.bpm, reference.bpm, 'Historical tempo changed.');
            equal(
              candidate.songEndStep,
              reference.sequenceCount * 64,
              'Historical ending changed.'
            );
            ok(
              candidate.playEmptySequences && !candidate.continuous && !candidate.choke,
              'Historical rest/loop/voice policy changed.'
            );
            const events = [];
            candidate.sequences.forEach((sequence, s) =>
              sequence.steps.forEach((steps, ch) =>
                steps.forEach((value, step) => {
                  if (value) events.push([s, ch, step, !!value.rev]);
                })
              )
            );
            const expected = reference.events
              .map((e) => [e.sequence, e.channel, e.step, e.reverse])
              .sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
            equal(events, expected, 'Historical trigger positions/reverse flags changed.');
            equal(
              candidate.legacyImport.sourceHash,
              staged.sourceHash,
              'Original-byte provenance changed.'
            );
            equal(
              candidate.legacyImport.profileId,
              profileId,
              'Historical playback choice changed.'
            );
          }
          try {
            const check = staged.kind === 'native' ? checkNative : checkLegacy;
            check(prepared);
            const saved = P.exportProject({ project: prepared, compact: true });
            const reopened = P.prepareProject(saved);
            check(reopened);
            const before = canonical(
              JSON.parse(P.exportProject({ project: reopened, compact: true }))
            );
            const imported = P.importProject(P.exportProject({ project: reopened, compact: true }));
            ok(
              S.store.project === imported,
              'Persistence import did not commit its validated candidate.'
            );
            check(imported);
            const after = canonical(
              JSON.parse(P.exportProject({ project: imported, compact: true }))
            );
            equal(after, before, 'A second native export/import changed persisted instructions.');
            return { ok: true, kind: staged.kind };
          } catch (error) {
            return { ok: false, message: error.message };
          }
        },
        {
          base64: bytes.toString('base64'),
          profileId,
          reference: reference
            ? {
                channels: reference.channels,
                events: reference.events,
                bpm: reference.bpm,
                sequenceCount: reference.sequenceCount
              }
            : null
        }
      );
      if (!result.ok)
        browserResult.failures.push({ sha256: row.sha256, profileId, message: result.message });
      else {
        browserResult.cases++;
        if (result.kind === 'native') browserResult.nativeCases++;
        else browserResult.legacyCases++;
      }
      if ((index + 1) % 25 === 0)
        console.log(`Browser persistence: ${index + 1}/${browserCases.length} cases checked.`);
    }
  } finally {
    await b?.close();
    srv.close();
  }
  summary.browser = browserResult;
  if (process.env.AUDIONAUT_LEGACY_CORPUS_REPORT)
    await writeFile(
      process.env.AUDIONAUT_LEGACY_CORPUS_REPORT,
      JSON.stringify(summary, null, 2) + '\n'
    );
  console.log(
    JSON.stringify({ ...browserResult, failures: browserResult.failures.length }, null, 2)
  );
  assert.equal(
    browserResult.remoteRequests.length,
    0,
    'Corpus persistence must not fetch remote sources.'
  );
  assert.equal(
    browserResult.failures.length,
    0,
    'Browser persistence changed supplied musical instructions.'
  );
  assert.equal(browserResult.cases, 184);
  assert.equal(browserResult.nativeCases, 11);
  assert.equal(browserResult.legacyCases, 173);
}
