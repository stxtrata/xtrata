const ORDINAL_ID = /^[a-f0-9]{64}i\d+$/i;
const normalizeWord = (value) =>
  String(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}']/gu, "");

export function prepareWordIndex(payload) {
  if (payload?.version !== 1 || !Array.isArray(payload.sources))
    throw new Error("The word index has an unsupported format.");
  return payload.sources.map((source) => {
    if (!ORDINAL_ID.test(source.ordinalId) || !Array.isArray(source.words))
      throw new Error("The word index contains an invalid source.");
    const words = source.words.map(([word, start, end]) => {
      if (
        typeof word !== "string" ||
        !Number.isFinite(start) ||
        !Number.isFinite(end) ||
        start < 0 ||
        end <= start
      ) {
        throw new Error("The word index contains an invalid timing.");
      }
      return { word, start, end, normalized: normalizeWord(word) };
    });
    return { ordinalId: source.ordinalId.toLowerCase(), words };
  });
}

export function searchWordIndex(
  sources,
  query,
  { offset = 0, limit = 50 } = {},
) {
  const terms = String(query)
    .trim()
    .split(/\s+/)
    .map(normalizeWord)
    .filter(Boolean);
  const matches = [];
  let total = 0;
  if (!terms.length) return { matches, total };
  for (const source of sources) {
    for (let i = 0; i <= source.words.length - terms.length; i++) {
      const matched = terms.every((term, j) =>
        terms.length === 1
          ? source.words[i].normalized.includes(term)
          : source.words[i + j].normalized === term,
      );
      if (!matched) continue;
      const selected = source.words.slice(i, i + terms.length);
      if (total >= offset && matches.length < limit) {
        matches.push({
          ordinalId: source.ordinalId,
          text: selected.map((w) => w.word).join(" "),
          start: selected[0].start,
          end: selected[selected.length - 1].end,
          context: source.words
            .slice(Math.max(0, i - 4), i + terms.length + 4)
            .map((w) => w.word)
            .join(" "),
        });
      }
      total++;
    }
  }
  return { matches, total };
}

export function validateWordSelection(selection, duration = null) {
  if (!ORDINAL_ID.test(selection?.ordinalId))
    throw new Error("Choose a valid audio source.");
  const { start, end } = selection;
  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start < 0 ||
    end <= start
  )
    throw new Error("End time must be later than start time.");
  if (
    duration !== null &&
    (!Number.isFinite(duration) ||
      duration <= 0 ||
      start >= duration ||
      end > duration + 0.001)
  ) {
    throw new Error(
      "This selection extends beyond the available audio. Adjust the end time.",
    );
  }
  return {
    ...selection,
    ordinalId: selection.ordinalId.toLowerCase(),
    end: duration === null ? end : Math.min(end, duration),
  };
}

export function wordSelectionToRegion(selection, duration) {
  const valid = validateWordSelection(selection, duration);
  return { start: valid.start / duration, end: valid.end / duration };
}

let indexPromise = null;
export function loadWordIndex() {
  if (!indexPromise) {
    indexPromise = fetch(new URL("../data/word-index.json", import.meta.url))
      .then((response) => {
        if (!response.ok)
          throw new Error("The word index could not be loaded. Please retry.");
        return response.json();
      })
      .then(prepareWordIndex)
      .catch((error) => {
        indexPromise = null;
        throw error;
      });
  }
  return indexPromise;
}
