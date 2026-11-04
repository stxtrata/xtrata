import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { readAudpack } from './tools/audpack-reader.mjs';
const u8 = new Uint8Array(readFileSync('packs/analogkit.audpack')); const { index, bytesFor } = await readAudpack(u8);
console.log('license', JSON.stringify(index.license).slice(0, 200), 'credits', JSON.stringify(index.credits).slice(0, 200), index.sampleRate, index.channels, index.bitDepth);
const hats = index.sounds.filter(s => /hat|ride|cym|shak|tamb/i.test(s.id)).map(s => s.id); console.log(hats.slice(0, 40).join(' | '));
const want = process.argv.slice(2); const out = '../_claude_scratch/xtrata-originals/kit'; mkdirSync(out, { recursive: true });
for (const w of want) { const s = index.sounds.find(x => x.id === w); if (!s) { console.log('missing', w); continue; } writeFileSync(`${out}/${w.replace('@hit@1', '')}.flac`, bytesFor(s)); console.log('wrote', w, s.length, s.filename, JSON.stringify(s.meta && s.meta.license || '')); }
