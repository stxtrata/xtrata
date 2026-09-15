#!/usr/bin/env node
/** Local-only Wizard-3 collection fixtures. No wallet, network or signing access. */
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export async function prepareNumberedJpegs(output) {
  await mkdir(output, { recursive: true });
  const items = [];
  for (let number = 1; number <= 10; number++) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="white"/><text x="256" y="256" dy=".35em" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-weight="700" font-size="240" fill="black">${number}</text></svg>`;
    const bytes = await sharp(Buffer.from(svg)).jpeg({ quality: 90, chromaSubsampling: '4:4:4' }).toBuffer();
    const filename = `${String(number).padStart(2, '0')}.jpg`;
    let hash = Buffer.alloc(32);
    for (let offset = 0; offset < bytes.length; offset += 16384) hash = createHash('sha256').update(hash).update(bytes.subarray(offset, offset + 16384)).digest();
    await writeFile(join(output, filename), bytes);
    items.push({ number, filename, mimeType: 'image/jpeg', width: 512, height: 512, bytes: bytes.length, chunks: Math.ceil(bytes.length / 16384), sha256: createHash('sha256').update(bytes).digest('hex'), rollingHash: hash.toString('hex'), tokenUri: null });
  }
  const manifest = { name: 'Numbers 1–10', preparedFor: 'Wizard-3 disposable collection helper test', state: 'local-only; not uploaded, registered or minted', chunkSize: 16384, items };
  await writeFile(join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  return manifest;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const output = resolve(process.argv[2] || '../media/wizard-numbered-jpegs');
  const manifest = await prepareNumberedJpegs(output);
  console.log(JSON.stringify({ output, count: manifest.items.length, totalBytes: manifest.items.reduce((sum, item) => sum + item.bytes, 0), state: manifest.state }, null, 2));
}
