//
// Fact drift detection for carried-over drafts.
//
// A draft written yesterday can be wrong today without a word of it changing.
// "Eighty seven signed transactions" was true at 21:00 on launch day and false
// by morning. Nothing in the text looks stale, which is exactly why this has to
// be mechanical rather than a thing somebody remembers to check.
//
// So a post that cites a number declares it:
//
//   "facts": [
//     { "path": "chain.xchess.value.movesTotal", "was": 87, "asWritten": "Eighty seven" }
//   ]
//
// `asWritten` matters because the corpus spells numbers out. Scanning the text
// for digits would miss every one of them.

export const resolvePath = (obj, path) =>
  String(path)
    .split('.')
    .reduce((node, key) => (node == null ? undefined : node[key]), obj);

/**
 * Compare a post's declared facts against today's signals.
 *
 * Returns one entry per fact that is no longer safe, each tagged with why:
 *
 *   changed     the signal has a different value now. The post is wrong.
 *   unreadable  the signal could not be read today. The post is not wrong, we
 *               just cannot confirm it.
 *
 * These are deliberately not collapsed. A throttled Hiro call must never be
 * reported as "the number changed", and a genuinely changed number must never
 * be waved through as "could not check". Same rule as everywhere else in this
 * harness, and the same bug class CLAUDE.md warns about.
 */
export const checkFacts = (post, signals) => {
  const drift = [];
  for (const fact of post.facts ?? []) {
    const now = resolvePath(signals, fact.path);
    if (now === undefined || now === null) {
      drift.push({ ...fact, now: null, kind: 'unreadable' });
      continue;
    }
    if (now !== fact.was) drift.push({ ...fact, now, kind: 'changed' });
  }
  return drift;
};

export const describeDrift = (drift) =>
  drift
    .map((d) =>
      d.kind === 'changed'
        ? `${d.path} was ${d.was} when this was written and is ${d.now} now. The text says "${d.asWritten ?? d.was}" and needs updating.`
        : `${d.path} could not be read today, so "${d.asWritten ?? d.was}" cannot be confirmed. This is not proof it changed.`
    )
    .join(' ');
