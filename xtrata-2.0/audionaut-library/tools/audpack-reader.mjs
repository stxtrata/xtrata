// audpack/1 reader (provisional): "AUDP" u8 version u8 flags u16 reserved u32 indexLen | index (gzip if flags&1) | payload
export async function readAudpack(u8) {
  if (String.fromCharCode(u8[0], u8[1], u8[2], u8[3]) !== "AUDP") throw new Error("not an audpack");
  if (u8[4] !== 1) throw new Error("unsupported audpack version " + u8[4]);
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength), ilen = dv.getUint32(8, true);
  let ib = u8.subarray(12, 12 + ilen);
  if (u8[5] & 1) ib = new Uint8Array(await new Response(new Blob([ib]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer());
  const index = JSON.parse(new TextDecoder().decode(ib)), base = 12 + ilen;
  return { index, bytesFor: (s) => u8.subarray(base + s.offset, base + s.offset + s.length) };
}
