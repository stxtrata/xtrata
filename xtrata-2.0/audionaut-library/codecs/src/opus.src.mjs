import { OpusDecoder } from "opus-decoder";
// codecApi 1: createDecoder(opts) -> { decode(bytes), free() }
// Payload "opus-pkt/1": u16le preSkip, u32le samples(48 kHz, after pre-skip), u8 channels, then
// repeated [LEB128 packet length][raw Opus packet]. No Ogg container.
export const codec = { id: "opus", api: 1, version: "1.0.0", payload: "opus-pkt/1", sampleRate: 48000 };
export async function createDecoder() {
  const decs = new Map();
  async function get(ch) {
    if (!decs.has(ch)) { const d = new OpusDecoder({ sampleRate: 48000, channels: ch }); await d.ready; decs.set(ch, d); }
    return decs.get(ch);
  }
  return {
    async decode(b) {
      const preSkip = b[0] | (b[1] << 8), samples = (b[2] | (b[3] << 8) | (b[4] << 16) | (b[5] << 24)) >>> 0, ch = b[6];
      const d = await get(ch); await d.reset();
      const parts = [];
      for (let p = 7; p < b.length;) {
        let n = 0, s = 0, c;
        do { c = b[p++]; n |= (c & 127) << s; s += 7; } while (c & 128);
        parts.push(d.decodeFrame(b.subarray(p, p + n)).channelData.map((a) => a.slice())); p += n;
      }
      const total = parts.reduce((a, x) => a + x[0].length, 0), channels = [];
      for (let c = 0; c < ch; c++) {
        const f = new Float32Array(total); let o = 0;
        for (const x of parts) { f.set(x[c], o); o += x[c].length; }
        channels.push(f.subarray(preSkip, preSkip + samples));
      }
      return { sampleRate: 48000, length: samples, channels };
    },
    free() { for (const d of decs.values()) d.free(); decs.clear(); },
  };
}
