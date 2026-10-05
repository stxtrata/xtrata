#!/usr/bin/env node
// Builds a synthetic 60-token collection ("testcol") in a scratch repo root so the launch canary can be run
// end to end against a mock chain without touching any real collection or pin.
//
//   node canaries/forever-twins-launch/make-test-collection.mjs <repoRoot> <scratchRoot> <deployerAddress>
//
// <scratchRoot> must be a fresh directory name (nothing is deleted).
// Writes <scratchRoot>/forever-twins/ft-harness/{scripts,templates,manifest/out,...}, <scratchRoot>/public/ft/data,
// <scratchRoot>/canaries (copy) and <scratchRoot>/testcol-files/<id>.png. Then build with:
//   node scripts/build-forever-twins-launch-canary.mjs --root <scratchRoot> --collection testcol --pin --deployer <address>
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [repo, scratch, deployer, groupArg] = process.argv.slice(2).map((p, i) => (i < 2 ? resolve(p) : p));
const GROUP = groupArg === 'G2' ? 'G2' : 'G1';   // optional 4th argument: G2 adds the listing read and a test token
if (!repo || !scratch || !deployer) { console.error('usage: make-test-collection.mjs <repoRoot> <scratchRoot> <deployer>'); process.exit(1); }
const sha = (b) => createHash('sha256').update(b).digest();
const hex = (b) => Buffer.from(b).toString('hex');
const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const SOURCE = 'SP1SCEXE6PMGPAC6B4N5P2MDKX8V4GF9QDE1FNNGJ.testcol';
const JIM = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7', RAPHA = 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22';
const rolling = (buf) => { let h = Buffer.alloc(32); for (let i = 0; i < buf.length; i += 16384) h = sha(Buffer.concat([h, buf.subarray(i, i + 16384)])); return h; };

// plain file copy (does not carry over directory modes, which some mounts refuse to re-create)
const copyTree = (src, dst, skip = () => false) => { mkdirSync(dst, { recursive: true }); for (const n of readdirSync(src)) { const a = resolve(src, n), b = resolve(dst, n); if (skip(a)) continue; if (statSync(a).isDirectory()) copyTree(a, b, skip); else writeFileSync(b, readFileSync(a)); } };

const h = resolve(scratch, 'forever-twins/ft-harness');
for (const d of ['scripts/configs', 'manifest/out', 'contracts']) mkdirSync(resolve(h, d), { recursive: true });
mkdirSync(resolve(scratch, 'public/ft/data'), { recursive: true });
mkdirSync(resolve(scratch, 'testcol-files'), { recursive: true });
writeFileSync(resolve(h, 'scripts/render-helper-v3.mjs'), readFileSync(resolve(repo, 'forever-twins/ft-harness/scripts/render-helper-v3.mjs')));
mkdirSync(resolve(h, 'templates'), { recursive: true });
writeFileSync(resolve(h, 'templates/forever-twin-helper-v3.clar.tmpl'), readFileSync(resolve(repo, 'forever-twins/ft-harness/templates/forever-twin-helper-v3.clar.tmpl')));
for (const d of ['forever-twins-launch', 'collection-v17']) copyTree(resolve(repo, 'canaries', d), resolve(scratch, 'canaries', d));
writeFileSync(resolve(scratch, 'canaries/forever-twins-launch/pins.json'), '{}\n');   // never inherit the real pins

const cfg = { collectionKey: 'testcol', master: CORE, source: SOURCE, sourceAsset: 'testcol', group: GROUP, ...(GROUP === 'G2' ? { listingReadFn: 'get-listing-in-ustx', testToken: 3 } : {}), payees: [JIM, RAPHA],
  initialFeeUstx: 100000, maxFeeUstx: 5000000, rescueEnabled: true, rescueDelayBurnBlocks: 432, profileTier: 'S' };
writeFileSync(resolve(h, 'scripts/configs/mainnet-testcol.v3.json'), JSON.stringify(cfg, null, 2));

const tokens = [];
for (let id = 1; id <= 60; id++) {
  const size = 1000 + ((id * 7919) % 39000);            // 1 KB .. 40 KB: one to three chunks
  const bytes = Buffer.alloc(size);
  let seed = sha(`testcol-${id}`);
  for (let i = 0; i < size; i += 32) { seed = sha(seed); seed.copy(bytes, i, 0, Math.min(32, size - i)); }
  writeFileSync(resolve(scratch, `testcol-files/${id}.png`), bytes);
  tokens.push({
    id,
    original: { metadataUri: `ipfs://QmTestMeta/${id}.json`, metadataSha256: hex(sha(`m${id}`)), mediaUris: [`ipfs://QmTestCid/${id}.png`], mediaSha256: [hex(sha(bytes))] },
    twin: { contentHash: '0x' + hex(rolling(bytes)), sha256: hex(sha(bytes)), mime: 'image/png', totalSize: size, tokenUri: `https://xtrata.xyz/ft/testcol/${id}.json` }
  });
}
const manifest = { spec: 'FT-SPEC-2', collectionKey: 'testcol', source: SOURCE, sourceAsset: 'testcol', scope: 'full collection', count: tokens.length, tokens };
const text = JSON.stringify(manifest, null, 2) + '\n';
writeFileSync(resolve(h, 'manifest/out/testcol.manifest.json'), text);
writeFileSync(resolve(h, 'manifest/out/testcol.manifest.sha256'), `${hex(sha(text))}  testcol.manifest.json\n`);
writeFileSync(resolve(scratch, 'public/ft/data/testcol.manifest.json'), text);
console.log(`testcol: ${tokens.length} tokens, manifest ${hex(sha(text))}`);
