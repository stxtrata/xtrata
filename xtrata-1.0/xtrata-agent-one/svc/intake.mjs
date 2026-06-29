#!/usr/bin/env node
/**
 * Xtrata Agent One — deterministic intake (the "railroad" layer).
 *
 * Implements PROGRESSIVE_HARDENING.md: every decision is a constrained
 * multiple-choice; free text (file path, address, uri, dep ids) is validated and
 * normalised on entry. The output is a fully-enumerated job spec + the exact
 * `deposit-service.mjs create` command — no un-handled branches downstream.
 *
 *   node intake.mjs            # interactive CLI
 *   node intake.mjs --selftest # offline pure-function checks (no network)
 *
 * normalizeIntent() is pure (no fs/network) so it is trivially testable and can
 * be reused by a chat-driven agentic shell that presents the same choices.
 * Targets v3.2.3.
 */
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

// Enumerated content categories -> specific mime (constrained choices, not free text).
export const CONTENT = {
  image:    { png: 'image/png', jpeg: 'image/jpeg', gif: 'image/gif', svg: 'image/svg+xml', webp: 'image/webp' },
  video:    { mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime' },
  audio:    { weba: 'audio/webm; codecs=opus', opus: 'audio/ogg; codecs=opus', mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg' },
  document: { pdf: 'application/pdf', html: 'text/html', md: 'text/markdown', txt: 'text/plain' },
  data:     { json: 'application/json', bin: 'application/octet-stream' },
};
const ADDR_RE = /^S[PM][0-9A-HJKMNP-Z]{37,41}$/;   // mainnet standard/contract principal
const URI_RE = /^[\w:+./-]{3,256}$/;
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'asset';

/** Pure: validate + normalise an intake spec into an enumerated job spec. Throws on any invalid field. */
export function normalizeIntent(spec) {
  const { category, type, filePath, deliverAddr } = spec;
  if (!CONTENT[category]) throw new Error(`category must be one of: ${Object.keys(CONTENT).join(', ')}`);
  const mime = CONTENT[category][type];
  if (!mime) throw new Error(`type for "${category}" must be one of: ${Object.keys(CONTENT[category]).join(', ')}`);
  if (!filePath || typeof filePath !== 'string') throw new Error('filePath is required');
  const ext = (String(filePath).match(/\.([a-z0-9]+)$/i) || [])[1];
  if (ext && ['weba', 'opus'].includes(ext.toLowerCase()) && category !== 'audio')
    throw new Error(`.${ext} is an Opus audio container — choose the "audio" category, not "${category}"`);
  if (!ADDR_RE.test(deliverAddr || '')) throw new Error('deliverAddr must be a valid mainnet principal (SP… / SM…)');

  const stem = slug(path.basename(filePath).replace(/\.[^.]+$/, ''));
  const uri = (spec.uri && spec.uri.trim()) || `xtrata:${category}/${stem}`;
  if (!URI_RE.test(uri)) throw new Error('uri has invalid characters');

  const deps = (spec.deps || []).map((d) => String(d).trim()).filter(Boolean);
  for (const d of deps) if (!/^\d+$/.test(d)) throw new Error(`dependency id "${d}" must be a uint`);

  const marginUstx = String(spec.marginUstx ?? '0').trim();
  if (!/^\d+$/.test(marginUstx)) throw new Error('marginUstx must be a uint (µSTX)');

  return { category, type, mime, filePath, uri, deps, deliverAddr, marginUstx };
}

/** Build the exact, copy-pasteable create command from a normalised intent. */
export function createCommand(n) {
  const env = [
    `SVC_STEP=create`,
    `SVC_FILE=${JSON.stringify(n.filePath)}`,
    `SVC_URI=${JSON.stringify(n.uri)}`,
    `SVC_MIME=${n.mime}`,
    `SVC_USER_ADDR=${n.deliverAddr}`,
  ];
  if (n.deps.length) env.push(`SVC_DEPS=${n.deps.join(',')}`);
  if (n.marginUstx !== '0') env.push(`SVC_MARGIN_USTX=${n.marginUstx}`);
  return `${env.join(' ')} node deposit-service.mjs`;
}

// ---------- interactive CLI ----------
function rl() { return readline.createInterface({ input: process.stdin, output: process.stdout }); }
async function choose(label, options) {
  const keys = Array.isArray(options) ? options : Object.keys(options);
  const r = rl();
  try {
    for (;;) {
      console.log(`\n${label}`);
      keys.forEach((k, i) => console.log(`  ${i + 1}) ${k}`));
      const a = await new Promise((res) => r.question('> ', res));
      const i = parseInt(a.trim(), 10);
      if (i >= 1 && i <= keys.length) return keys[i - 1];
      console.log('Please enter a number from the list.');
    }
  } finally { r.close(); }
}
async function ask(label, { def = '', validate } = {}) {
  const r = rl();
  try {
    for (;;) {
      const a = await new Promise((res) => r.question(`${label}${def ? ` [${def}]` : ''}: `, res));
      const v = (a.trim() || def).trim();
      const err = validate ? validate(v) : null;
      if (!err) return v;
      console.log(err);
    }
  } finally { r.close(); }
}

async function cli() {
  console.log('Xtrata Agent One — inscription intake');
  const category = await choose('What are you inscribing?', CONTENT);
  const type = await choose(`File type (${category})?`, CONTENT[category]);
  const filePath = await ask('Path to the file', { validate: (v) => (v && fs.existsSync(v) ? null : 'File not found — enter a valid path.') });
  const deliverAddr = await ask('Delivery address (where the inscription + refund go)', { validate: (v) => (ADDR_RE.test(v) ? null : 'Enter a valid mainnet principal (SP… / SM…).') });
  const link = await choose('Link to anything?', ['none', 'dependency (existence-only)']);
  let deps = [];
  if (link.startsWith('dependency')) {
    const ids = await ask('Dependency token id(s), comma-separated', { validate: (v) => (v.split(',').every((x) => /^\d+$/.test(x.trim())) ? null : 'Use comma-separated uints.') });
    deps = ids.split(',').map((s) => s.trim()).filter(Boolean);
  }
  const stem = slug(path.basename(filePath).replace(/\.[^.]+$/, ''));
  const uri = await ask('Content URI', { def: `xtrata:${category}/${stem}`, validate: (v) => (URI_RE.test(v) ? null : 'Invalid URI characters.') });
  const marginUstx = await ask('Service margin in µSTX (0 = none)', { def: '0', validate: (v) => (/^\d+$/.test(v) ? null : 'Enter a whole number of µSTX.') });

  const n = normalizeIntent({ category, type, filePath, deliverAddr, deps, uri, marginUstx });
  console.log('\nNormalised job spec:\n' + JSON.stringify(n, null, 2));
  console.log('\nRun this to create the deposit job:\n\n  ' + createCommand(n) + '\n');
}

function selftest() {
  const ok = normalizeIntent({ category: 'video', type: 'mp4', filePath: '/x/Fear of the Dark.M4V', deliverAddr: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', deps: ['134', '90'], marginUstx: '0' });
  console.assert(ok.mime === 'video/mp4', 'mime map');
  console.assert(ok.uri === 'xtrata:video/fear-of-the-dark', 'uri slug: ' + ok.uri);
  console.assert(ok.deps.length === 2, 'deps');
  let threw = false;
  try { normalizeIntent({ category: 'video', type: 'mp4', filePath: '/x', deliverAddr: 'NOTANADDR' }); } catch { threw = true; }
  console.assert(threw, 'rejects bad address');
  try { normalizeIntent({ category: 'nope', type: 'x', filePath: '/x', deliverAddr: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X' }); threw = false; } catch { threw = true; }
  console.assert(threw, 'rejects bad category');
  console.assert(createCommand(ok).includes('SVC_DEPS=134,90'), 'command includes deps');
  const weba = normalizeIntent({ category: 'audio', type: 'weba', filePath: '/x/track.weba', deliverAddr: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X' });
  console.assert(weba.mime === 'audio/webm; codecs=opus', 'weba -> audio/webm; codecs=opus: ' + weba.mime);
  let audioGuard = false;
  try { normalizeIntent({ category: 'video', type: 'mp4', filePath: '/x/track.weba', deliverAddr: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X' }); } catch { audioGuard = true; }
  console.assert(audioGuard, 'rejects .weba tagged as video');
  console.log('intake selftest: PASS');
}

if (process.argv.includes('--selftest')) selftest();
else cli().catch((e) => { console.error(String(e)); process.exit(1); });
