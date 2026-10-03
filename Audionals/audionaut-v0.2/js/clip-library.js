import {
  copy,
  parseClipLibrary,
  toDraftManifest,
  editClip,
} from "./clip-contract.js";
const KEY = "audionaut.v0.2.clip-library";
let state = null,
  loading = null;
function validateState(next) {
  if (
    next?.version !== 1 ||
    !next.base ||
    !next.overlays ||
    !Array.isArray(next.personal) ||
    !Array.isArray(next.revisions) ||
    !next.measurements
  )
    throw Error("Invalid workstation clip backup.");
  parseClipLibrary(
    toDraftManifest({
      ...next.base,
      clips: [...next.base.clips, ...next.personal].map((c) =>
        next.overlays[c.id] ? editClip(c, next.overlays[c.id]) : c,
      ),
      measurements: next.measurements,
    }),
  );
}
function commit(next) {
  // Storage failure leaves both the in-memory library and the project intact.
  localStorage.setItem(KEY, JSON.stringify(next));
  state = next;
}
export async function getClipLibrary() {
  if (state) return effectiveLibrary();
  if (!loading)
    loading = (async () => {
      let saved;
      try {
        saved = JSON.parse(localStorage.getItem(KEY) || "null");
      } catch {}
      const response = await fetch(
        new URL("../data/samples-loops-catalogue.json", import.meta.url),
      );
      if (!response.ok)
        throw Error("The bundled Samples & Loops catalogue is unavailable.");
      const base = parseClipLibrary(await response.json());
      // Validate backups before adopting them; never execute stored metadata.
      if (saved?.version === 1) {
        try {
          validateState(saved);
          state = saved;
        } catch {
          state = {
            version: 1,
            base,
            overlays: {},
            personal: [],
            measurements: {},
            revisions: [],
          };
        }
      } else
        state = {
          version: 1,
          base,
          overlays: {},
          personal: [],
          measurements: {},
          revisions: [],
        };
      return effectiveLibrary();
    })().catch((e) => {
      loading = null;
      throw e;
    });
  return loading;
}
export function effectiveLibrary() {
  if (!state) throw Error("Open the catalogue first.");
  return {
    ...copy(state.base),
    sources: state.base.sources.map((s) => ({
      ...copy(s),
      workstationMeasurement: copy(
        state.measurements[s.id] || s.workstationMeasurement || null,
      ),
    })),
    clips: [...state.base.clips, ...state.personal].map((c) =>
      state.overlays[c.id] ? editClip(c, state.overlays[c.id]) : copy(c),
    ),
    measurements: copy(state.measurements),
  };
}
export function refreshClipLibrary(input, options = {}) {
  const incoming = parseClipLibrary(input, options),
    next = copy(state);
  if (!next) throw Error("Open the catalogue first.");
  const merge = (old, items) => {
    const map = new Map(old.map((x) => [x.id, x]));
    for (const item of items) map.set(item.id, item);
    return [...map.values()];
  };
  next.revisions.push({ kind: "curated-update", base: next.base });
  next.revisions = next.revisions.slice(-3);
  next.base = {
    ...next.base,
    sources: merge(next.base.sources, incoming.sources),
    clips: merge(next.base.clips, incoming.clips),
    batches: incoming.batches.length ? incoming.batches : next.base.batches,
  };
  commit(next);
  return effectiveLibrary();
}
export function saveClipEdits(id, patch) {
  const next = copy(state),
    lib = effectiveLibrary(),
    clip = lib.clips.find((c) => c.id === id);
  if (!clip) throw Error("This clip no longer exists.");
  const edited = editClip(clip, patch);
  parseClipLibrary(
    toDraftManifest({
      sources: [lib.sources.find((s) => s.id === clip.sourceId)],
      clips: [edited],
      batches: [],
    }),
  );
  next.overlays[id] = { ...next.overlays[id], ...copy(patch) };
  commit(next);
  return edited;
}
export function createPersonalClip(id, patch = {}) {
  const lib = effectiveLibrary(),
    original = lib.clips.find((c) => c.id === id);
  if (!original) throw Error("Select an existing clip.");
  const c = editClip(original, patch);
  c.id = c.sourceId + ":clip:local-" + crypto.randomUUID();
  c.review = {
    ...c.review,
    status: "unreviewed",
    auditioned: false,
    reviewer: null,
    reviewed_at: null,
  };
  c.loop.seamVerified = false;
  c.loop.tempoVerified = false;
  c.tuning.verified = false;
  c.title = patch.title || c.title + " · personal clip";
  parseClipLibrary(
    toDraftManifest({
      sources: [lib.sources.find((s) => s.id === c.sourceId)],
      clips: [c],
      batches: [],
    }),
  );
  const next = copy(state);
  next.personal.push(c);
  commit(next);
  return c;
}
export function recordClipMeasurement(sourceId, result) {
  const next = copy(state),
    source = next.base.sources.find((s) => s.id === sourceId),
    old = next.measurements[sourceId],
    rate = old?.sampleRate ?? source?.technical.sampleRate,
    frames = old?.frames ?? source?.technical.frames;
  if (
    (rate != null && rate !== result.audioBuffer.sampleRate) ||
    (frames != null && frames !== result.audioBuffer.length)
  )
    for (const c of effectiveLibrary().clips.filter(
      (c) => c.sourceId === sourceId,
    ))
      next.overlays[c.id] = {
        ...next.overlays[c.id],
        loop: { ...c.loop, seamVerified: false, tempoVerified: false },
        review: { ...c.review, status: "unreviewed" },
      };
  next.measurements[sourceId] = {
    duration: result.audioBuffer.duration,
    frames: result.audioBuffer.length,
    sampleRate: result.audioBuffer.sampleRate,
    channels: result.audioBuffer.numberOfChannels,
    sourceHash: result.sourceHash,
    payloadHash: result.payloadHash,
  };
  commit(next);
}
export function exportClipLibrary() {
  return toDraftManifest(effectiveLibrary());
}
export function exportClipBackup() {
  return copy(state);
}
export function importClipBackup(input) {
  const next = copy(input);
  validateState(next);
  if (
    next?.version !== 1 ||
    !next.overlays ||
    !Array.isArray(next.personal) ||
    !Array.isArray(next.revisions)
  )
    throw Error("Invalid workstation clip backup.");
  const lib = {
    ...next.base,
    clips: [...next.base.clips, ...next.personal].map((c) =>
      next.overlays[c.id] ? editClip(c, next.overlays[c.id]) : c,
    ),
  };
  parseClipLibrary(toDraftManifest(lib));
  commit(next);
  return effectiveLibrary();
}
export function searchClips(
  lib,
  {
    query = "",
    batch = "first22",
    use = "all",
    duration = "all",
    review = "all",
    permission = "all",
  } = {},
) {
  const sources = new Map(lib.sources.map((s) => [s.id, s])),
    first = new Set(lib.batches?.[0]?.source_record_ids || []),
    q = query.toLowerCase().trim();
  return lib.clips.filter((c) => {
    const s = sources.get(c.sourceId),
      d = s.reportedDuration,
      cd =
        c.region.endSeconds == null
          ? null
          : c.region.endSeconds - (c.region.startSeconds ?? 0);
    return (
      (batch !== "first22" || first.has(s.id)) &&
      (use === "all" || c.usageType === use) &&
      (review === "all" || c.review.status === review) &&
      (permission === "all" || c.rights.status === permission) &&
      (duration === "all" ||
        (duration === "source-short" && d != null && d < 20) ||
        (duration === "source-long" && d != null && d >= 20) ||
        (duration === "unknown" && d == null) ||
        (duration === "clip-short" && cd != null && cd < 20)) &&
      (!q ||
        [
          c.title,
          c.category,
          c.instrument,
          ...c.tags,
          s.inscriptionId,
          s.number,
          s.note?.text,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q))
    );
  });
}
export function clearedClipExport() {
  const lib = effectiveLibrary(),
    omitted = [],
    clips = lib.clips.filter((c) => {
      const s = lib.sources.find((s) => s.id === c.sourceId),
        m = lib.measurements[s.id],
        reasons = [];
      if (c.review.status !== "approved") reasons.push("not curator-approved");
      if (c.review.auditioned !== true || !c.review.reviewer)
        reasons.push("listening/reviewer missing");
      if (!m?.sourceHash || !m?.payloadHash)
        reasons.push("decoded audio/hashes missing");
      if (
        !["one_shot", "one-shot", "loop", "phrase", "texture"].includes(
          c.usageType,
        )
      )
        reasons.push("unsupported use type");
      if (
        c.region.endSeconds == null ||
        (m && c.region.endSeconds > m.duration)
      )
        reasons.push("explicit valid region missing");
      if (
        !["licensed", "public_domain"].includes(c.rights.status) ||
        !c.rights.license ||
        !/^https?:\/\//.test(c.rights.evidence_url || "")
      )
        reasons.push("permission terms/evidence missing");
      if (c.usageType === "loop") {
        const seconds =
            (c.loop.endSeconds ?? c.region.endSeconds) -
            (c.loop.startSeconds ?? c.region.startSeconds ?? 0),
          implied = (60 * c.loop.beats) / seconds;
        if (
          c.loop.seamVerified !== true ||
          c.loop.tempoVerified !== true ||
          !c.loop.beats ||
          !c.loop.bpm ||
          !Number.isFinite(implied) ||
          Math.abs(c.loop.bpm - implied) / implied > 0.02
        )
          reasons.push("loop review/timing incomplete");
      }
      if ((c.tuning.key || c.tuning.rootNote) && c.tuning.verified !== true)
        reasons.push("tuning review missing");
      if (reasons.length) omitted.push({ clipId: c.id, reasons });
      return !reasons.length;
    });
  return {
    ...toDraftManifest({
      ...lib,
      clips,
      sources: lib.sources.filter((s) =>
        clips.some((c) => c.sourceId === s.id),
      ),
    }),
    status: clips.length ? "curator-cleared" : "not-ready",
    omitted,
    verificationScope:
      "Recorded curator checks only; no independent legal or chain certification.",
  };
}
