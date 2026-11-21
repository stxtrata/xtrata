import { fail } from '../read-document.js';
export const COMPACT_KEYS = Object.freeze([
  'projectName',
  'artistName',
  'projectBPM',
  'currentSequence',
  'channelURLs',
  'channelVolume',
  'channelPlaybackSpeed',
  'trimSettings',
  'projectChannelNames',
  'startSliderValue',
  'endSliderValue',
  'totalSampleDuration',
  'start',
  'end',
  'projectSequences',
  'steps',
  'channelGroups'
]);
export const ADAPTER_LIMITS = Object.freeze({
  channels: 64,
  sequences: 64,
  events: 262144,
  patterns: 4096
});
const object = (value) => value && typeof value === 'object' && !Array.isArray(value);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function restoreObject(value, allowed, path) {
  if (!object(value)) fail('INVALID_OBJECT', 'Expected an object.', path);
  const result = {};
  for (const [key, child] of Object.entries(value)) {
    const numeric = /^(?:0|[1-9]\d*)$/.test(key),
      decoded = numeric && allowed.has(+key) ? COMPACT_KEYS[+key] : key;
    if (Object.hasOwn(result, decoded) && !same(result[decoded], child))
      fail(
        'CONFLICTING_ALIASES',
        `Both ${decoded} and its compact key disagree.`,
        path + '/' + decoded
      );
    result[decoded] = child;
  }
  return result;
}
export function decodeCompactDocument(raw) {
  const data = restoreObject(raw, new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 14, 16]), '');
  if (data.trimSettings !== undefined) {
    if (!Array.isArray(data.trimSettings))
      fail('INVALID_TRIMS', 'trimSettings must be an array.', '/trimSettings');
    data.trimSettings = data.trimSettings.map((trim, i) =>
      trim === null
        ? {}
        : restoreObject(trim, new Set([9, 10, 11, 12, 13, 15]), '/trimSettings/' + i)
    );
  }
  if (data.projectSequences !== undefined) {
    if (!object(data.projectSequences))
      fail('INVALID_SEQUENCES', 'projectSequences must be an object.');
    data.projectSequences = Object.fromEntries(
      Object.entries(data.projectSequences).map(([name, seq]) => {
        if (!object(seq))
          fail(
            'INVALID_SEQUENCE',
            'Sequence channels must be an object.',
            '/projectSequences/' + name
          );
        return [
          name,
          Object.fromEntries(
            Object.entries(seq).map(([channel, row]) => [
              channel,
              restoreObject(row, new Set([15]), `/projectSequences/${name}/${channel}`)
            ])
          )
        ];
      })
    );
  }
  // Numeric channel aliases, channelSettings and arbitrary metadata are untouched.
  return data;
}
export function channelIndex(alias) {
  if (/^ch(?:0|[1-9]\d*)$/.test(alias)) return Number(alias.slice(2));
  if (/^(?:0|[1-9]\d*)$/.test(alias)) return Number(alias);
  if (/^[A-Z]$/.test(alias)) return alias.charCodeAt(0) - 65;
  fail('INVALID_CHANNEL', `Unrecognized channel alias: ${alias}.`);
}
export function sequenceIndex(alias) {
  if (!/^(?:Sequence|s)(?:0|[1-9]\d*)$/.test(alias))
    fail('INVALID_SEQUENCE', `Unrecognized sequence name: ${alias}.`);
  const n = Number(alias.replace(/\D/g, ''));
  if (n >= 64) fail('SEQUENCE_LIMIT', 'Sequence index must be below 64.');
  return n;
}
export function normalizeCompanion(raw) {
  const patterns = raw?.patterns ?? raw;
  if (!object(patterns) || Object.keys(patterns).length > ADAPTER_LIMITS.patterns)
    fail('INVALID_COMPANION', 'Choose a bounded pattern dictionary object.');
  for (const [id, steps] of Object.entries(patterns)) {
    if (!/^(?:0|[1-9]\d*)$/.test(id) || !Array.isArray(steps))
      fail('INVALID_COMPANION', 'Pattern IDs must map directly to step arrays.');
  }
  return patterns;
}
export function expandLegacySteps(
  value,
  { path = '', companion = null, budget = { remaining: ADAPTER_LIMITS.events } } = {}
) {
  let patternId = null;
  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value) || value < 0)
      fail('INVALID_PATTERN_ID', 'Invalid pattern dictionary ID.', path);
    patternId = value;
    if (!companion || !Object.hasOwn(companion, String(value)))
      fail('MISSING_COMPANION', `Pattern ${value} needs its matching companion dictionary.`, path);
    value = companion[String(value)];
  }
  if (!Array.isArray(value))
    fail('INVALID_STEPS', 'Steps must be an array, or a resolvable pattern ID.', path);
  const dense = value.length > 0 && value.every((x) => typeof x === 'boolean');
  if (value.some((x) => typeof x === 'boolean') && !dense)
    fail('MIXED_STEP_ENCODING', 'A row cannot mix dense booleans with sparse steps.', path);
  if (dense && value.length !== 64)
    fail('INVALID_DENSE_ROW', 'A dense step row must contain exactly 64 booleans.', path);
  const events = [];
  const add = (index, reverse, entry) => {
    if (!Number.isInteger(index) || index < 0 || index > 64)
      fail('INVALID_STEP', 'Step indices must be whole numbers from 0 through 64.', path);
    if (--budget.remaining < 0)
      fail('EVENT_LIMIT', 'Expanded song exceeds the 262144-event limit.', path);
    events.push({ index, reverse, entry });
  };
  value.forEach((item, entry) => {
    if (dense) {
      if (item) add(entry, false, entry);
    } else if (typeof item === 'number') add(item, false, entry);
    else if (typeof item === 'string' && /^\d+r$/.test(item))
      add(Number(item.slice(0, -1)), true, entry);
    else if (object(item) && Array.isArray(item.r)) {
      if (item.r.length !== 2 || Object.keys(item).some((k) => k !== 'r'))
        fail('INVALID_RANGE', 'A step range must contain only an inclusive r pair.', path);
      const [a, b] = item.r;
      if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < a || b > 64)
        fail('INVALID_RANGE', 'Invalid inclusive step range.', path);
      for (let n = a; n <= b; n++) add(n, false, entry);
    } else if (object(item) && Number.isInteger(item.index)) {
      if (item.reverse !== undefined && typeof item.reverse !== 'boolean')
        fail('INVALID_REVERSE', 'Reverse flags must be booleans.', path);
      if (Object.keys(item).some((k) => !['index', 'reverse'].includes(k)))
        fail('UNSUPPORTED_STEP_FIELD', 'A step contains unsupported musical fields.', path);
      add(item.index, !!item.reverse, entry);
    } else fail('INVALID_STEP', 'Unrecognized step encoding.', path);
  });
  return { events, dense, patternId };
}
export function adaptLegacyDocument(raw, { companion = null } = {}) {
  const data = decodeCompactDocument(raw),
    sequences = data.projectSequences;
  if (!object(sequences) || !Object.keys(sequences).length)
    fail('INVALID_SEQUENCES', 'A song needs at least one sequence.');
  if (Object.keys(sequences).length > 64)
    fail('SEQUENCE_LIMIT', 'A song may contain at most 64 sequences.');
  const budget = { remaining: ADAPTER_LIMITS.events };
  const rows = Object.entries(sequences).map(([key, channels]) => {
    const index = sequenceIndex(key),
      seen = new Set();
    return {
      key,
      index,
      channels: Object.entries(channels).map(([alias, row]) => {
        const channel = channelIndex(alias);
        if (channel >= 64) fail('CHANNEL_LIMIT', 'A song may contain at most 64 channels.');
        if (seen.has(channel))
          fail(
            'DUPLICATE_CHANNEL',
            'Two aliases reference the same channel.',
            `/projectSequences/${key}`
          );
        seen.add(channel);
        if (row.mute !== undefined && typeof row.mute !== 'boolean')
          fail('INVALID_MUTE', 'Mute must be a boolean.');
        return {
          alias,
          channel,
          raw: row,
          ...expandLegacySteps(Object.hasOwn(row, 'steps') ? row.steps : [], {
            path: `/projectSequences/${key}/${alias}/steps`,
            companion,
            budget
          })
        };
      })
    };
  });
  return { data, sequences: rows, expandedEvents: ADAPTER_LIMITS.events - budget.remaining };
}
