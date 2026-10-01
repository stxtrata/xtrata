#!/usr/bin/env node
// Builds the revised Audionauts 084.html and 090.html: the original edition
// file plus a small override that credits Χ₮¡₪¢₮ beside LIQUIDEZ. The seed,
// edition, engine reference (#3060) and everything else are untouched.
// Collection files stay out of Git: input and output live under _claude_scratch/.
//   node canaries/audionauts-replacement/make-revisions.mjs [originalsDir] [outDir]
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';

const root = resolve(import.meta.dirname, '../..');
const originals = resolve(process.argv[2] ?? join(root, '_claude_scratch/audionauts-v1-recursive'));
const out = resolve(process.argv[3] ?? join(root, '_claude_scratch/audionauts-v1-recursive-revisions'));
export const CREDIT = 'Χ₮¡₪¢₮'; // Χ₮¡₪¢₮
// The engine writes `title` or `title · artist` into #track-title; LIQUIDEZ (#2983)
// has no artist in its catalogue entry, so this appends the credit when it shows.
export const OVERRIDE = `<script>(()=>{const c=' · ${CREDIT}';new MutationObserver(()=>{const t=document.getElementById('track-title');if(t&&t.textContent==='LIQUIDEZ')t.textContent+=c}).observe(document,{subtree:true,childList:true,characterData:true})})()</script>`;
const ANCHOR = '<script defer src="/i/3060';
const canonicalHash = (bytes) => {
  let hash = Buffer.alloc(32);
  for (let i = 0; i < bytes.length; i += 16384) hash = createHash('sha256').update(Buffer.concat([hash, bytes.subarray(i, i + 16384)])).digest();
  return hash.toString('hex');
};

mkdirSync(out, { recursive: true });
for (const file of ['084.html', '090.html']) {
  const source = readFileSync(join(originals, file), 'utf8');
  if (source.split(ANCHOR).length !== 2) throw new Error(`${file}: expected exactly one engine #3060 script tag.`);
  if (source.includes('MutationObserver')) throw new Error(`${file}: already revised.`);
  const revised = source.replace(ANCHOR, OVERRIDE + ANCHOR);
  writeFileSync(join(out, file), revised);
  console.log(`${file}: ${Buffer.byteLength(source)} → ${Buffer.byteLength(revised)} bytes, hash ${canonicalHash(Buffer.from(source))} → ${canonicalHash(Buffer.from(revised))}`);
}
console.log(`Written to ${out}`);
