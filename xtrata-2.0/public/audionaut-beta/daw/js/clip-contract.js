// Source/clip adapter. Pure data contracts: no retrieval, playback or storage.
const ID = /^[a-f0-9]{64}i\d{1,10}$/;
const HASH = /^[a-f0-9]{64}$/;
export const copy = (v) => structuredClone(v);
const object = (v, label) => {
  if (!v || typeof v !== "object" || Array.isArray(v))
    throw Error(`Invalid ${label}.`);
  return v;
};
const text = (v, fallback = "") =>
  v == null ? fallback : String(v).slice(0, 10000);
function num(v, label, min = 0, max = 864000, integer = false) {
  if (v == null) return null;
  if (
    typeof v !== "number" ||
    !Number.isFinite(v) ||
    v < min ||
    v > max ||
    (integer && !Number.isInteger(v))
  )
    throw Error(`Invalid ${label}.`);
  return v;
}
const flag = (v, label) => {
  if (v == null) return null;
  if (typeof v !== "boolean") throw Error(`Invalid ${label}.`);
  return v;
};
function hash(v) {
  if (v == null) return null;
  if (typeof v !== "string" || !HASH.test(v.toLowerCase()))
    throw Error("Invalid SHA-256 hash.");
  return v.toLowerCase();
}
function region(r = {}) {
  const out = {
    startSeconds: num(r.start_seconds, "region start"),
    endSeconds: num(r.end_seconds, "region end"),
    startFrame: num(r.start_frame, "start frame", 0, 1e12, true),
    endFrame: num(r.end_frame, "end frame", 0, 1e12, true),
    frameRate: num(r.frame_rate, "frame rate", 1, 768000, true),
    endExclusive: true,
  };
  if (r.end_is_exclusive === false)
    throw Error("Clip end frames must be exclusive.");
  if (out.endSeconds != null && out.endSeconds <= (out.startSeconds ?? 0))
    throw Error("Region end must follow start.");
  if ((out.startFrame != null || out.endFrame != null) && out.frameRate == null)
    throw Error("Frame positions require a frame rate.");
  if (out.endFrame != null && out.endFrame <= (out.startFrame ?? 0))
    throw Error("End frame must follow start frame.");
  for (const [s, f] of [
    [out.startSeconds, out.startFrame],
    [out.endSeconds, out.endFrame],
  ])
    if (
      s != null &&
      f != null &&
      Math.abs(s - f / out.frameRate) > 1 / out.frameRate + 1e-9
    )
      throw Error("Seconds and frame positions disagree.");
  return out;
}
function normalizedClip(c, source, editable) {
  const r = editable ? object(c.review, "clip review") : object(c, "clip"),
    id = text(editable ? c.clip_id : c.id),
    sourceId = editable ? source.id : c.source_id;
  if (
    !id ||
    id.length > 240 ||
    !id.startsWith(source.id + ":clip:") ||
    sourceId !== source.id
  )
    throw Error("Invalid clip identity or source reference.");
  const rg = region(
    editable
      ? {
          start_seconds: r.trim_start_seconds,
          end_seconds: r.trim_end_seconds,
          start_frame: r.trim_start_frame,
          end_frame: r.trim_end_frame,
          frame_rate: r.frame_rate,
        }
      : c.region,
  );
  const lp = editable
    ? {
        start_seconds: r.loop_start_seconds,
        end_seconds: r.loop_end_seconds,
        beats: r.beats,
        bpm: r.bpm,
        seam_verified: r.loop_verified,
        tempo_verified: r.bpm_verified,
      }
    : c.loop || {};
  const tuning = editable
    ? { key: r.key, root_note: r.root_note, verified: r.key_verified }
    : c.tuning || {};
  const review = editable ? r : c.review || {};
  if (
    r.tags != null &&
    (!Array.isArray(r.tags) ||
      r.tags.length > 100 ||
      r.tags.some((x) => typeof x !== "string"))
  )
    throw Error("Invalid clip tags.");
  const loop = {
    startSeconds: num(lp.start_seconds, "loop start"),
    endSeconds: num(lp.end_seconds, "loop end"),
    beats: num(lp.beats, "beat count", 0.0001, 4096),
    bpm: num(lp.bpm, "BPM", 1, 1000),
    seamVerified: flag(lp.seam_verified, "loop review"),
    tempoVerified: flag(lp.tempo_verified, "tempo review"),
  };
  if (
    loop.endSeconds != null &&
    loop.endSeconds <= (loop.startSeconds ?? rg.startSeconds ?? 0)
  )
    throw Error("Loop end must follow start.");
  if (
    (loop.startSeconds != null && loop.startSeconds < (rg.startSeconds ?? 0)) ||
    (loop.endSeconds != null &&
      rg.endSeconds != null &&
      loop.endSeconds > rg.endSeconds)
  )
    throw Error("Loop bounds must lie inside the clip.");
  return {
    id,
    sourceId,
    title: text(r.title, source.title),
    usageType: text(r.usage_type, "unclassified"),
    category: text(r.sound_category, "unknown"),
    tags: copy(r.tags || []),
    instrument: r.instrument ?? null,
    region: rg,
    loop,
    tuning: {
      key: tuning.key ?? null,
      rootNote: tuning.root_note ?? null,
      verified: flag(tuning.verified, "tuning review"),
    },
    review: {
      ...copy(review),
      status: text(review.status, "unreviewed"),
      auditioned: flag(review.auditioned, "audition review"),
      reviewer: review.reviewer ?? null,
    },
    rights: copy(c.rights || source.rights),
    notes: text(r.notes),
    timeSignature: r.time_signature ?? null,
    proposal: copy(c.proposal || source.proposal),
    raw: copy(c),
  };
}
function normalizedSource(a, editable) {
  object(a, "source");
  const inscriptionId = text(a.inscription_id).toLowerCase(),
    id = editable ? a.record_id : a.id;
  if (!ID.test(inscriptionId) || id !== `btc:ord:${inscriptionId}`)
    throw Error("Invalid full inscription/source ID.");
  const t = editable ? a.technical || {} : a.decoded_audio || {};
  const reported = editable
    ? a.technical?.duration_ms_reported == null
      ? (a.original_note?.duration_seconds_reported ?? null)
      : num(
          a.technical.duration_ms_reported,
          "reported duration",
          0,
          864000000,
        ) / 1000
    : a.reported_duration_seconds;
  const technical = {
    ...copy(t),
    durationSeconds: num(
      editable ? t.duration_seconds_measured : t.duration_seconds,
      "measured duration",
    ),
    sampleRate: num(
      editable ? t.decoded_sample_rate : t.sample_rate,
      "decoded rate",
      1,
      768000,
      true,
    ),
    frames: num(
      editable ? t.decoded_frames : t.frames,
      "decoded frames",
      0,
      1e12,
      true,
    ),
    channels: num(
      editable ? t.decoded_channels : t.channels,
      "channels",
      1,
      32,
      true,
    ),
    sourceHash: hash(
      editable ? t.source_content_sha256 : a.source_content_sha256,
    ),
    payloadHash: hash(
      editable ? t.audio_payload_sha256 : a.audio_payload_sha256,
    ),
  };
  let workstationMeasurement = null;
  if (a.workstation_measurement != null) {
    const m = object(a.workstation_measurement, "workstation measurement");
    workstationMeasurement = {
      ...copy(m),
      duration: num(m.duration, "workstation duration"),
      frames: num(m.frames, "workstation frames", 0, 1e12, true),
      sampleRate: num(m.sampleRate, "workstation frame rate", 1, 768000, true),
      channels: num(m.channels, "workstation channels", 1, 32, true),
      sourceHash: hash(m.sourceHash),
      payloadHash: hash(m.payloadHash),
    };
  }
  return {
    id,
    inscriptionId,
    number: num(a.inscription_number, "inscription number", 0, 1e12, true),
    title: text(a.description, a.source_note?.text || inscriptionId),
    reportedDuration: num(reported, "reported duration"),
    technical,
    rights: copy(a.rights || { status: "unknown" }),
    note: copy(editable ? a.original_note : a.source_note),
    provenance: copy(a.source_urls || a.provenance || []),
    proposal: copy(
      a.curation_proposal || a.catalogue_source?.curation_proposal || null,
    ),
    workstationMeasurement,
    raw: copy(a.catalogue_source || a),
  };
}
export function migrateCatalogueV01(input) {
  const d = copy(input);
  if (
    d.schema !== "audionaut-sample-catalogue" ||
    d.schema_version !== "0.1.0" ||
    !Array.isArray(d.assets)
  )
    throw Error("Expected a v0.1 single-region catalogue.");
  for (const a of d.assets) {
    if (a.clips?.length)
      throw Error("v0.1 conversion requires single-region records.");
    a.clips = [{ clip_id: a.record_id + ":clip:001", review: copy(a.review) }];
    a.active_clip_id = a.clips[0].clip_id;
  }
  d.schema_version = "0.2.0";
  d.migration = { from: "0.1.0", method: "explicit-single-region-to-clip" };
  return d;
}
export function parseClipLibrary(input, { migrateV01 = false } = {}) {
  let d = typeof input === "string" ? JSON.parse(input) : copy(input);
  if (JSON.stringify(d).length > 20 * 1024 * 1024)
    throw Error("Catalogue exceeds the 20 MB limit.");
  object(d, "catalogue");
  if (d.schema_version === "0.1.0") {
    if (!migrateV01)
      throw Error("v0.1 requires explicit single-region migration.");
    d = migrateCatalogueV01(d);
  }
  const editable =
    d.schema === "audionaut-sample-catalogue" && d.schema_version === "0.2.0";
  if (
    !editable &&
    !(d.schema === "audionaut-clip-library-proposal" && d.version === "0.2.0")
  )
    throw Error("Unsupported catalogue schema/version.");
  const list = editable ? d.assets : d.sources;
  if (
    !Array.isArray(list) ||
    list.length > 5000 ||
    (!editable && (!Array.isArray(d.clips) || d.clips.length > 20000))
  )
    throw Error("Invalid catalogue records/count.");
  const sources = [],
    clips = [],
    errors = [],
    ids = new Set(),
    clipIds = new Set();
  list.forEach((a, i) => {
    try {
      const source = normalizedSource(
        editable
          ? a
          : {
              ...a,
              rights:
                a.rights || d.clips.find((c) => c.source_id === a.id)?.rights,
            },
        editable,
      );
      if (ids.has(source.id)) throw Error("Duplicate source identity.");
      ids.add(source.id);
      sources.push(source);
      const records = editable
        ? a.clips
        : d.clips.filter((c) => c.source_id === source.id);
      if (!Array.isArray(records) || !records.length)
        throw Error("Source has no clips.");
      for (const raw of records) {
        const c = normalizedClip(raw, source, editable);
        if (clipIds.has(c.id)) throw Error("Duplicate clip identity.");
        clipIds.add(c.id);
        clips.push(c);
      }
    } catch (e) {
      errors.push(`Source ${i + 1}: ${e.message}`);
    }
  });
  if (!editable)
    for (const c of d.clips)
      if (!ids.has(c.source_id)) errors.push(`Clip ${c.id}: missing source.`);
  if (errors.length) {
    const e = Error(errors.join("\n"));
    e.records = errors;
    throw e;
  }
  return {
    schema: "audionaut-native-clips/1",
    sources,
    clips,
    batches: copy(d.batches || []),
    metadata: {
      title: d.title,
      coverage: copy(d.coverage),
      migration: copy(d.migration),
    },
  };
}
export function resolveClipRegion(
  clip,
  buffer,
  { mode = "one-shot", gateSteps = 8, rate = 1, reverse = false } = {},
) {
  const r = clip.region,
    start =
      r.startSeconds ?? (r.startFrame == null ? 0 : r.startFrame / r.frameRate),
    end =
      r.endSeconds ??
      (r.endFrame == null ? buffer.duration : r.endFrame / r.frameRate);
  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start < 0 ||
    end <= start ||
    end > buffer.duration + 1e-9
  )
    throw Error(
      `Clip bounds must lie within decoded audio (0–${buffer.duration.toFixed(6)} s).`,
    );
  if (
    !["one-shot", "loop"].includes(mode) ||
    !Number.isFinite(rate) ||
    rate < 0.1 ||
    rate > 4 ||
    typeof reverse !== "boolean"
  )
    throw Error("Invalid playback mode/rate.");
  let loop = null;
  if (mode === "loop") {
    if (reverse)
      throw Error("Reverse loop playback is unavailable; choose one-shot.");
    if (!Number.isFinite(gateSteps) || gateSteps < 1 || gateSteps > 64)
      throw Error("Loop gate must be 1–64 steps.");
    const ls = clip.loop.startSeconds ?? start,
      le = clip.loop.endSeconds ?? end;
    if (
      !Number.isFinite(ls) ||
      !Number.isFinite(le) ||
      ls < start ||
      le > end ||
      le <= ls
    )
      throw Error("Loop bounds must lie within the playable region.");
    loop = { start: ls, end: le };
  }
  return {
    start,
    end,
    loop,
    mode,
    gateSteps: mode === "loop" ? gateSteps : 0,
    rate,
    reverse,
    frameBasis: {
      sampleRate: buffer.sampleRate,
      startFrame: Math.round(start * buffer.sampleRate),
      endFrame: Math.round(end * buffer.sampleRate),
      endExclusive: true,
    },
    endChoice:
      r.endSeconds == null && r.endFrame == null
        ? "project-local-decoded-end"
        : "selected",
    frameBasisChanged: r.frameRate != null && r.frameRate !== buffer.sampleRate,
  };
}
export function editClip(clip, patch) {
  const next = { ...copy(clip), ...copy(patch) };
  if (patch.region || patch.loop) {
    next.loop = { ...next.loop, seamVerified: false, tempoVerified: false };
    next.review.status = "unreviewed";
  }
  if (patch.tuning) {
    next.tuning = { ...next.tuning, verified: false };
    next.review.status = "unreviewed";
  }
  return next;
}
export function toDraftManifest(library) {
  return {
    schema: "audionaut-clip-library-proposal",
    version: "0.2.0",
    status: "draft",
    batches: copy(library.batches),
    sources: library.sources.map((s) => ({
      id: s.id,
      chain: "bitcoin",
      protocol: "ordinals",
      inscription_id: s.inscriptionId,
      inscription_number: s.number,
      content_path: "/content/" + s.inscriptionId,
      source_content_sha256:
        s.technical.sourceHash ??
        library.measurements?.[s.id]?.sourceHash ??
        s.workstationMeasurement?.sourceHash ??
        null,
      audio_payload_sha256:
        s.technical.payloadHash ??
        library.measurements?.[s.id]?.payloadHash ??
        s.workstationMeasurement?.payloadHash ??
        null,
      reported_duration_seconds: s.reportedDuration,
      decoded_audio: {
        duration_seconds: s.technical.durationSeconds,
        sample_rate: s.technical.sampleRate,
        frames: s.technical.frames,
        channels: s.technical.channels,
      },
      workstation_measurement: copy(
        library.measurements?.[s.id] || s.workstationMeasurement || null,
      ),
      source_note: copy(s.note),
      rights: copy(s.rights),
      provenance: copy(s.provenance),
      catalogue_source: copy(s.raw),
    })),
    clips: library.clips.map((c) => ({
      id: c.id,
      source_id: c.sourceId,
      title: c.title,
      usage_type: c.usageType,
      sound_category: c.category,
      tags: copy(c.tags),
      instrument: c.instrument,
      region: {
        start_seconds: c.region.startSeconds,
        end_seconds: c.region.endSeconds,
        start_frame: c.region.startFrame,
        end_frame: c.region.endFrame,
        frame_rate: c.region.frameRate,
        end_is_exclusive: true,
      },
      loop: {
        start_seconds: c.loop.startSeconds,
        end_seconds: c.loop.endSeconds,
        beats: c.loop.beats,
        bpm: c.loop.bpm,
        seam_verified: c.loop.seamVerified,
        tempo_verified: c.loop.tempoVerified,
      },
      tuning: {
        key: c.tuning.key,
        root_note: c.tuning.rootNote,
        verified: c.tuning.verified,
      },
      review: copy(c.review),
      notes: c.notes,
      time_signature: c.timeSignature,
      rights: copy(c.rights),
      proposal: copy(c.proposal),
      catalogue_clip: copy(c.raw),
    })),
  };
}
export function canonicalJSON(value) {
  if (Array.isArray(value))
    return "[" + value.map(canonicalJSON).join(",") + "]";
  if (value && typeof value === "object")
    return (
      "{" +
      Object.keys(value)
        .filter((k) => value[k] !== undefined)
        .sort()
        .map((k) => JSON.stringify(k) + ":" + canonicalJSON(value[k]))
        .join(",") +
      "}"
    );
  return JSON.stringify(value);
}
// Synchronous SHA-256 allows transactional validation in the existing sync project importer.
export function sha256Text(text) {
  const bytes = new TextEncoder().encode(text),
    words = [],
    bitLength = bytes.length * 8;
  for (let i = 0; i < bytes.length; i++)
    words[i >> 2] = (words[i >> 2] || 0) | (bytes[i] << (24 - (i % 4) * 8));
  words[bytes.length >> 2] =
    (words[bytes.length >> 2] || 0) | (0x80 << (24 - (bytes.length % 4) * 8));
  const total = ((bytes.length + 9 + 63) >> 6) * 16;
  words.length = total;
  words[total - 2] = Math.floor(bitLength / 4294967296);
  words[total - 1] = bitLength >>> 0;
  const primes = [],
    K = [],
    H = [];
  for (let n = 2; primes.length < 64; n++) {
    if (primes.every((p) => n % p)) {
      primes.push(n);
      K.push(((Math.cbrt(n) % 1) * 4294967296) | 0);
      if (H.length < 8) H.push(((Math.sqrt(n) % 1) * 4294967296) | 0);
    }
  }
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  for (let i = 0; i < total; i += 16) {
    const w = [];
    for (let j = 0; j < 64; j++) {
      if (j < 16) w[j] = words[i + j] | 0;
      else {
        const x = w[j - 15],
          y = w[j - 2];
        w[j] =
          (w[j - 16] +
            (rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3)) +
            w[j - 7] +
            (rotr(y, 17) ^ rotr(y, 19) ^ (y >>> 10))) |
          0;
      }
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let j = 0; j < 64; j++) {
      const t1 =
          (h +
            (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) +
            ((e & f) ^ (~e & g)) +
            K[j] +
            w[j]) |
          0,
        t2 =
          ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) +
            ((a & b) ^ (a & c) ^ (b & c))) |
          0;
      h = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }
    [a, b, c, d, e, f, g, h].forEach((v, j) => (H[j] = (H[j] + v) | 0));
  }
  return H.map((x) => (x >>> 0).toString(16).padStart(8, "0")).join("");
}
export function validateClipSnapshot(s) {
  if (
    !s ||
    s.version !== 1 ||
    !ID.test(s.source?.inscriptionId || "") ||
    s.clip?.sourceId !== s.source.id ||
    s.source.id !== `btc:ord:${s.source.inscriptionId}`
  )
    throw Error("Invalid pinned clip snapshot.");
  const { snapshotHash, ...content } = s;
  if (snapshotHash !== sha256Text(canonicalJSON(content)))
    throw Error("Pinned clip snapshot hash mismatch.");
  const lib = parseClipLibrary(
    toDraftManifest({ sources: [s.source], clips: [s.clip], batches: [] }),
  );
  num(s.decoded?.duration, "saved decoded duration", 0.000001);
  num(s.decoded?.sampleRate, "saved decoded rate", 1, 768000, true);
  if (s.decoded?.duration == null || s.decoded?.sampleRate == null)
    throw Error("Missing decoded snapshot basis.");
  if (!hash(s.retrieved?.sourceHash) || !hash(s.retrieved?.payloadHash))
    throw Error("Pinned clips require their retrieved byte hashes.");
  if (s.playback.end == null)
    throw Error("Saved playback must have an explicit decoded end.");
  resolveClipRegion(
    {
      ...lib.clips[0],
      region: {
        ...lib.clips[0].region,
        startSeconds: s.playback.start,
        endSeconds: s.playback.end,
      },
      loop: s.playback.loop
        ? {
            ...lib.clips[0].loop,
            startSeconds: s.playback.loop.start,
            endSeconds: s.playback.loop.end,
          }
        : lib.clips[0].loop,
    },
    { duration: s.decoded.duration, sampleRate: s.decoded.sampleRate },
    s.playback,
  );
  return copy(s);
}
