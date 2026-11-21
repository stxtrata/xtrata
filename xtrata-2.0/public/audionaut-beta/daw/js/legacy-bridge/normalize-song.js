import { fail } from './read-document.js';
const object = (x) => x && typeof x === 'object' && !Array.isArray(x);
export const issue = (report, code, message, path = '', severity = 'warning') => {
  if (report.issues.length < 512) report.issues.push({ code, message, path, severity });
  else if (!report.issues.some((x) => x.code === 'ISSUE_LIMIT'))
    report.issues.push({
      code: 'ISSUE_LIMIT',
      message: 'Too many import issues; narrow the document before importing.',
      path: '',
      severity: 'error'
    });
};
const number = (value, fallback, path) => {
  if (value == null) return fallback;
  if (typeof value !== 'number' || !Number.isFinite(value))
    fail('INVALID_SETTING', 'Musical settings must be finite numbers.', path);
  return value;
};
const bounded = (value, fallback, min, max, path) => {
  const n = number(value, fallback, path);
  if (n < min || n > max)
    fail('UNSUPPORTED_SETTING', `This setting must be between ${min} and ${max}.`, path);
  return n;
};
const musicalBpm = (value) => {
  if (typeof value === 'string' && /^(?:\d+(?:\.\d*)?|\.\d+)$/.test(value.trim()))
    return Number(value);
  return value;
};
const round3 = (n) => Number(Number(n).toFixed(3));
export function legacySampleReference(value) {
  if (value == null || value === '') return null;
  if (typeof value !== 'string')
    fail('UNRESOLVED_SOURCE', 'A sample reference is a dictionary token without its source map.');
  const text = value.trim();
  if (!text) return null;
  const ordinal =
    text.match(/^(?:https?:\/\/[^/]+)?\/content\/([a-f\d]{64}i\d+)(?:[?#].*)?$/i) ||
    text.match(/^([a-f\d]{64}i\d+)$/i);
  if (ordinal) return { type: 'ordinal', value: ordinal[1].toLowerCase() };
  if (/^https?:\/\//i.test(text)) {
    let parsed;
    try {
      parsed = new URL(text);
    } catch {
      fail('UNSUPPORTED_SOURCE', 'Invalid sample URL.');
    }
    if (parsed.username || parsed.password)
      fail('UNSUPPORTED_SOURCE', 'Sample URLs may not contain credentials.');
    return { type: 'url', value: text };
  }
  if (/^data:audio\//i.test(text))
    return { type: 'file', value: text, name: 'Imported embedded audio' };
  fail(
    'UNRESOLVED_SOURCE',
    'Unsupported or unresolved sample identity. Supply its source map or relink the original sample.'
  );
}
export function normalizeSong(adapted, profile, { report = { issues: [] } } = {}) {
  const { data, sequences } = adapted,
    urls = data.channelURLs ?? data.projectURLs ?? [];
  if (
    data.channelURLs !== undefined &&
    data.projectURLs !== undefined &&
    JSON.stringify(data.channelURLs) !== JSON.stringify(data.projectURLs)
  )
    fail('CONFLICTING_ALIASES', 'channelURLs and projectURLs disagree.', '/channelURLs');
  if (
    data.projectBPM !== undefined &&
    data.bpm !== undefined &&
    musicalBpm(data.projectBPM) !== musicalBpm(data.bpm)
  )
    fail('CONFLICTING_ALIASES', 'projectBPM and bpm disagree.', '/projectBPM');
  for (const key of ['projectName', 'artistName'])
    if (data[key] != null && (typeof data[key] !== 'string' || data[key].length > 200))
      fail('INVALID_METADATA', `${key} must be text of at most 200 characters.`, '/' + key);
  if (!Array.isArray(urls))
    fail('INVALID_SOURCES', 'Sample references must be a positional array.');
  for (const name of [
    'channelVolume',
    'channelPlaybackSpeed',
    'projectChannelNames',
    'channelGroups'
  ])
    if (data[name] !== undefined && !Array.isArray(data[name]))
      fail('INVALID_SETTING', `${name} must be a positional array.`, '/' + name);
  const rowCount = Math.max(0, ...sequences.flatMap((s) => s.channels.map((r) => r.channel + 1)));
  const count = Math.max(
    1,
    urls.length,
    rowCount,
    ...[
      'channelVolume',
      'channelPlaybackSpeed',
      'trimSettings',
      'projectChannelNames',
      'channelGroups'
    ].map((k) => data[k]?.length || 0)
  );
  if (count > 64) fail('CHANNEL_LIMIT', 'A legacy song may contain at most 64 channels.');
  if (urls.length > 0 && urls.length < count)
    issue(
      report,
      'AMBIGUOUS_SOURCE_ALIGNMENT',
      'The source array is shorter than the channel settings or step rows. A filtered source map cannot safely be shifted onto these channels.',
      '/channelURLs',
      'error'
    );
  const neutralGlobal = number(data.globalPlaybackSpeed, 1, '/globalPlaybackSpeed');
  if (neutralGlobal !== 1)
    issue(
      report,
      'UNSUPPORTED_GLOBAL_SPEED',
      'This global speed has no verified multiplication rule for the selected profile.',
      '/globalPlaybackSpeed',
      'error'
    );
  if (data.channelSettings !== undefined) {
    if (!object(data.channelSettings))
      fail('INVALID_SETTING', 'channelSettings must be an object.');
    for (const [alias, settings] of Object.entries(data.channelSettings)) {
      if (!object(settings)) fail('INVALID_SETTING', 'Invalid channelSettings row.');
      for (const [key, value] of Object.entries(settings))
        if (!['volume', 'pitch'].includes(key) || value !== 1)
          issue(
            report,
            'UNSUPPORTED_CHANNEL_SETTING',
            'This channel setting has no verified combination rule. Preserve it and choose a supported version or repair.',
            '/channelSettings/' + alias + '/' + key,
            'error'
          );
    }
  }
  const standalone = profile.id === 'audionals-standalone-v1';
  const channels = Array.from({ length: count }, (_, index) => {
    let source = null;
    try {
      source = legacySampleReference(urls[index]);
    } catch (error) {
      issue(report, error.code, error.message, `/channelURLs/${index}`, 'error');
    }
    if (!source)
      issue(
        report,
        'MISSING_SAMPLE',
        'This channel has no sample identity; its events and channel position are retained.',
        `/channelURLs/${index}`
      );
    const t = data.trimSettings?.[index] || {},
      start = bounded(
        standalone ? t.startSliderValue : (t.startSliderValue ?? t.start),
        0,
        0,
        100,
        `/trimSettings/${index}/start`
      ),
      end = bounded(
        standalone ? t.endSliderValue : (t.endSliderValue ?? t.end),
        100,
        0,
        100,
        `/trimSettings/${index}/end`
      );
    if (
      (t.startSliderValue !== undefined &&
        t.start !== undefined &&
        t.startSliderValue !== t.start) ||
      (t.endSliderValue !== undefined && t.end !== undefined && t.endSliderValue !== t.end)
    )
      issue(
        report,
        'TRIM_ALIAS_PRECEDENCE',
        'Slider trim fields take precedence over start/end aliases; both original values are retained.',
        `/trimSettings/${index}`
      );
    let trimStart = start / 100,
      trimEnd = end / 100,
      volume = bounded(data.channelVolume?.[index], 1, 0, 3, `/channelVolume/${index}`),
      pitch = bounded(
        data.channelPlaybackSpeed?.[index],
        1,
        0.1,
        100,
        `/channelPlaybackSpeed/${index}`
      );
    if (
      standalone &&
      ((t.startSliderValue === undefined && t.start !== undefined) ||
        (t.endSliderValue === undefined && t.end !== undefined))
    )
      issue(
        report,
        'STANDALONE_TRIM_ALIASES',
        'The historical standalone player reads slider fields only; start/end aliases remain preserved as metadata.',
        `/trimSettings/${index}`
      );
    if (standalone) {
      trimStart = round3(trimStart);
      trimEnd = round3((end || 100) / 100);
      volume = round3(volume || 1);
      pitch = round3(pitch);
    }
    if (trimEnd < trimStart)
      issue(
        report,
        'REVERSED_TRIM',
        'The selected profile produces reversed trim bounds; correct the source settings before import.',
        `/trimSettings/${index}`,
        'error'
      );
    else if (trimEnd === trimStart)
      issue(
        report,
        'SILENT_TRIM',
        'This channel retains its exact zero-width trim and is silent; the importer does not widen its source region.',
        `/trimSettings/${index}`,
        'info'
      );
    const name = data.projectChannelNames?.[index];
    if (name !== undefined && (typeof name !== 'string' || name.length > 160))
      issue(
        report,
        'UNRESOLVED_CHANNEL_NAME',
        'A channel label must be text of at most 160 characters; dictionary tokens require their source map.',
        `/projectChannelNames/${index}`,
        'error'
      );
    else if (typeof name === 'string' && name.length > 64)
      issue(
        report,
        'DISPLAY_NAME_SHORTENED',
        'The channel display name uses the first 64 characters; the complete original label is retained as its sample name.',
        `/projectChannelNames/${index}`,
        'info'
      );
    return {
      index,
      source,
      name: typeof name === 'string' ? name : `Channel ${index + 1}`,
      volume,
      pitch,
      trimStart,
      trimEnd
    };
  });
  const mapped =
    profile.sequences === 'stored'
      ? sequences.map((s, i) => ({ ...s, destination: i }))
      : sequences.map((s) => ({ ...s, destination: s.index }));
  if (new Set(mapped.map((s) => s.destination)).size !== mapped.length)
    fail('DUPLICATE_SEQUENCE', 'Two sequence names refer to the same sequence position.');
  const sequenceCount = Math.max(1, ...mapped.map((s) => s.destination + 1)),
    events = [],
    inertEvents = [],
    duplicateEvents = [];
  for (const seq of mapped)
    for (const row of seq.channels) {
      if (row.dense !== profile.dense && row.events.length)
        fail(
          'PROFILE_MISMATCH',
          'Dense boolean rows and sparse event rows require different decoding profiles.'
        );
      if (row.raw.mute === true)
        issue(
          report,
          'UNSUPPORTED_SEQUENCE_MUTE',
          'The historical players do not share a verified per-sequence mute rule. This active mute must be resolved explicitly.',
          `/projectSequences/${seq.key}/${row.alias}/mute`,
          'error'
        );
      if (row.raw.url !== undefined && row.raw.url !== null && row.raw.url !== '') {
        let source;
        try {
          source = legacySampleReference(row.raw.url);
        } catch (error) {
          issue(
            report,
            error.code,
            error.message,
            `/projectSequences/${seq.key}/${row.alias}/url`,
            'error'
          );
        }
        if (JSON.stringify(source) !== JSON.stringify(channels[row.channel].source))
          issue(
            report,
            'UNSUPPORTED_SEQUENCE_SOURCE',
            'A sequence overrides its channel sample; this requires an explicit source mapping.',
            `/projectSequences/${seq.key}/${row.alias}/url`,
            'error'
          );
      }
      const slots = new Map();
      for (const event of row.events) {
        const position = row.dense ? event.index : event.index - profile.stepBase,
          provenance = {
            sequence: seq.key,
            channel: row.channel,
            index: event.index,
            reverse: event.reverse
          };
        if (position < 0 || position >= 64) {
          inertEvents.push({ ...provenance, reason: 'outside-profile-range' });
          continue;
        }
        const key = position,
          prior = slots.get(key);
        if (prior) {
          duplicateEvents.push({
            ...provenance,
            reason: prior.reverse === event.reverse ? 'duplicate' : 'conflicting-direction'
          });
          if (prior.reverse !== event.reverse) {
            issue(
              report,
              'UNREPRESENTABLE_OVERLAP',
              'Normal and reversed triggers occupy the same cell. The native grid cannot represent this historical overlap faithfully.',
              `/projectSequences/${seq.key}/${row.alias}/steps`,
              'error'
            );
          }
          continue;
        }
        const converted = {
          sequence: seq.destination,
          channel: row.channel,
          step: position,
          reverse: event.reverse
        };
        slots.set(key, converted);
        events.push(converted);
      }
    }
  if (inertEvents.length)
    issue(
      report,
      'INERT_STEPS',
      `${inertEvents.length} encoded triggers are outside this profile's playable range and are retained as provenance.`
    );
  if (duplicateEvents.length)
    issue(
      report,
      'DUPLICATE_STEPS',
      `${duplicateEvents.length} repeated triggers are retained as provenance.`
    );
  const metadata = { sequenceKeys: sequences.map((s) => s.key) };
  for (const key of [
    'currentSequence',
    'channelGroups',
    'channelSettings',
    'globalPlaybackSpeed',
    'trimSettings',
    'channelVolume',
    'channelPlaybackSpeed',
    'projectBPM'
  ])
    if (data[key] !== undefined) metadata[key] = structuredClone(data[key]);
  const allowed = new Set([
    'projectName',
    'artistName',
    'projectBPM',
    'bpm',
    'currentSequence',
    'channelURLs',
    'projectURLs',
    'channelVolume',
    'channelPlaybackSpeed',
    'trimSettings',
    'projectChannelNames',
    'projectSequences',
    'channelGroups',
    'channelSettings',
    'globalPlaybackSpeed'
  ]);
  const unsupportedFields = Object.keys(data)
    .filter((k) => !allowed.has(k))
    .map((k) => '/' + k);
  for (const path of unsupportedFields)
    issue(
      report,
      'UNSUPPORTED_FIELD',
      'An unrecognized field is retained in the staged document; review it before conversion.',
      path,
      'error'
    );
  for (const seq of sequences)
    for (const row of seq.channels)
      for (const key of Object.keys(row.raw))
        if (!['steps', 'mute', 'url'].includes(key)) {
          const path = `/projectSequences/${seq.key}/${row.alias}/${key}`;
          unsupportedFields.push(path);
          issue(
            report,
            'UNSUPPORTED_FIELD',
            'A sequence channel contains an unrecognized setting.',
            path,
            'error'
          );
        }
  return {
    title: String(data.projectName || 'Imported Audional song'),
    artist: String(data.artistName || ''),
    bpm: bounded(musicalBpm(data.projectBPM ?? data.bpm), 120, 20, 420, '/projectBPM'),
    channels,
    sequenceCount,
    events,
    inertEvents,
    duplicateEvents,
    metadata,
    unsupportedFields,
    profileId: profile.id,
    audioProfile: profile.audioProfile,
    stats: {
      channels: count,
      sequences: sequenceCount,
      encodedEvents: adapted.expandedEvents,
      playableEvents: events.length,
      inertEvents: inertEvents.length,
      duplicateEvents: duplicateEvents.length,
      reversedEvents: events.filter((e) => e.reverse).length
    }
  };
}
