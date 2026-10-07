import { decodeFlac } from "../flacdec.mjs";
// codecApi 1: createDecoder(opts) -> { decode(bytes), decodeInt(bytes), free() }
export const codec = { id: "flac", api: 1, version: "1.0.0", payload: "flac" };
export async function createDecoder(opts = {}) {
  const verify = opts.verify !== false; // CRC-8/CRC-16 checks on by default
  return {
    // exact integer samples: { sampleRate, channels, bitsPerSample, length, data: Int32Array[] }
    async decodeInt(bytes) { return decodeFlac(bytes, { verify }); },
    // AudioBuffer-ready floats: { sampleRate, length, channels: Float32Array[] }
    async decode(bytes) {
      const r = decodeFlac(bytes, { verify }), k = 1 / 2 ** (r.bitsPerSample - 1);
      const channels = r.data.map((a) => { const f = new Float32Array(a.length); for (let i = 0; i < a.length; i++) f[i] = a[i] * k; return f; });
      return { sampleRate: r.sampleRate, length: r.length, channels };
    },
    free() {},
  };
}
