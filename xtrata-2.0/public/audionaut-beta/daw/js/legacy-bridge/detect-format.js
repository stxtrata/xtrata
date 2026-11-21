const object = (value) => value && typeof value === 'object' && !Array.isArray(value);
export function detectFormat(document) {
  if (!object(document)) return { kind: 'unknown', format: 'unknown' };
  if (document.audxData && object(document.audxData)) return { kind: 'og', format: 'audx-og' };
  if (
    [
      'audionaut-workstation/2',
      'audionaut-workstation/3',
      'audional-sequencer-l1xl2/1',
      'audional-sequencer-x/1',
      'audionaut-chain-song/1'
    ].includes(document.format)
  )
    return { kind: 'native', format: document.format || 'native-project' };
  if (object(document.projectSequences) || object(document['14'])) {
    const compact = Object.hasOwn(document, '14') || Object.hasOwn(document, '4');
    const sequences = document.projectSequences ?? document['14'];
    let dictionary = false,
      dense = false,
      sparse = false;
    for (const seq of Object.values(sequences))
      if (object(seq))
        for (const row of Object.values(seq))
          if (object(row)) {
            const steps = row.steps ?? row['15'];
            if (typeof steps === 'number') dictionary = true;
            else if (Array.isArray(steps)) {
              if (steps.length && steps.every((x) => typeof x === 'boolean')) dense = true;
              else if (steps.some((x) => typeof x !== 'boolean')) sparse = true;
            }
          }
    return {
      kind: 'legacy',
      format: dictionary
        ? 'dictionary-audx'
        : compact
          ? 'compact-audx'
          : dense || (Array.isArray(document.projectURLs) && !sparse)
            ? 'dense-audional'
            : 'sparse-audx',
      compact,
      dictionary,
      dense,
      mixedDenseSparse: dense && sparse
    };
  }
  return { kind: 'unknown', format: 'unknown' };
}
