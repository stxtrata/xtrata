#!/usr/bin/env node
import { build } from 'esbuild';
import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
const here = path.dirname(fileURLToPath(import.meta.url)),
  root = path.resolve(here, '../../..'),
  js = path.resolve(here, '../daw/js');
const { RUNTIME_VERSION } = await import(pathToFileURL(path.join(js, 'runtime-version.js')));
const dest = path.resolve(process.argv[2] || path.join(here, '../chain-runtime'));
const resources = new Map(),
  inputs = new Set();
const hash = (value) => createHash('sha256').update(value).digest('hex');
// Every static worker/worklet URL becomes an embedded, fully bundled blob. Dynamic
// audio pack URLs remain unreachable: chain songs must bind all audio to chain refs.
const plugin = {
  name: 'embedded-audio-workers',
  setup(b) {
    b.onLoad({ filter: /\.js$/ }, async (args) => {
      if (!args.path.startsWith(js + path.sep)) return;
      let contents = await readFile(args.path, 'utf8');
      const matches = [
        ...contents.matchAll(/new URL\((['"])(\.\.?\/[^'"]+\.js)\1,\s*import\.meta\.url\)/g)
      ];
      for (const match of matches) {
        const entry = path.resolve(path.dirname(args.path), match[2]),
          id = path.relative(js, entry).replaceAll(path.sep, '/');
        if (!resources.has(id)) {
          resources.set(id, ''); // Break worker → shared module → same worker cycles.
          const result = await build({
            entryPoints: [entry],
            bundle: true,
            write: false,
            format: entry.endsWith('-worker.js') ? 'iife' : 'esm',
            platform: 'browser',
            target: 'es2022',
            minify: true,
            legalComments: 'inline',
            metafile: true,
            plugins: [plugin]
          });
          resources.set(id, result.outputFiles[0].text);
          for (const file of Object.keys(result.metafile.inputs))
            inputs.add(path.resolve(root, file));
        }
        contents = contents.replace(
          match[0],
          `globalThis.__AUDIONAUT_RUNTIME_URLS[${JSON.stringify(id)}]`
        );
      }
      if (matches.length && contents.includes('new Worker('))
        contents = contents.replace(/type:\s*(['"])module\1/g, "type:'classic'");
      return { contents, loader: 'js' };
    });
  }
};
const result = await build({
  absWorkingDir: root,
  entryPoints: [path.join(here, 'chain-player-entry.js')],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  minify: true,
  legalComments: 'inline',
  metafile: true,
  plugins: [plugin]
});
for (const file of Object.keys(result.metafile.inputs)) inputs.add(path.resolve(root, file));
const packages = new Map();
for (const file of inputs) {
  if (!file.includes('/node_modules/')) continue;
  let dir = path.dirname(file);
  while (dir.includes('/node_modules/')) {
    try {
      const p = JSON.parse(await readFile(path.join(dir, 'package.json'), 'utf8'));
      if (p.name) {
        packages.set(p.name, { dir, name: p.name, version: p.version, license: p.license });
        break;
      }
    } catch {}
    dir = path.dirname(dir);
  }
}
const notices = [];
for (const p of [...packages.values()].sort((a, b) => a.name.localeCompare(b.name))) {
  const files = (await readdir(p.dir)).filter((n) =>
    /^(license|licence|copying|notice)(\.|$)/i.test(n)
  );
  const texts = [];
  for (const f of files)
    if ((await stat(path.join(p.dir, f))).isFile())
      texts.push(await readFile(path.join(p.dir, f), 'utf8'));
  if (!texts.length)
    throw Error(`Missing redistribution notice for ${p.name}; review before packaging.`);
  notices.push(`${p.name} ${p.version} (${p.license || 'see notice'})\n${texts.join('\n')}`);
}
const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const script =
  `globalThis.__AUDIONAUT_RUNTIME_URLS={};for(const [id,code] of Object.entries(${JSON.stringify(Object.fromEntries([...resources].sort()))}))globalThis.__AUDIONAUT_RUNTIME_URLS[id]=URL.createObjectURL(new Blob([code],{type:'text/javascript'}));\n${result.outputFiles[0].text}`.replaceAll(
    '</script',
    '<\\/script'
  );
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AudioNaut chain player</title><style>body{font:16px system-ui;background:#101722;color:#edf4fc;max-width:800px;margin:5vh auto;padding:24px}button,input,textarea{font:inherit;padding:10px;margin:6px 0;box-sizing:border-box}input,textarea{width:100%}button{cursor:pointer}label{display:block;margin-top:20px}p{line-height:1.6}pre{white-space:pre-wrap;overflow-wrap:anywhere}#status{min-height:3em}</style><h1>AudioNaut chain player</h1><p>Open a song’s instruction file, or load it from its chain reference. This runtime contains its own audio engine; sounds are reconstructed from verified chain data. Version ${esc(RUNTIME_VERSION)}.</p><label>Stacks API endpoint<input id="rpc" value="https://api.mainnet.hiro.so" type="url"></label><label>Song instructions<input id="song" type="file" accept="application/json,.json"></label><details><summary>Load instructions directly from chain</summary><label>Song reference JSON<textarea id="song-ref" rows="5" placeholder='{"network":"mainnet","contractId":"…","tokenId":"…","sha256":"…","bytes":123,"mediaType":"application/json"}'></textarea></label><button id="load-chain">Load song from chain</button></details><p id="status" role="status">Choose a song. No wallet is needed for playback.</p><button id="play" disabled>Play</button> <button id="stop">Stop</button><details><summary>Bundled library notices</summary><pre>${esc(notices.join('\n\n'))}</pre></details><script type="module" id="audionaut-runtime">${script}</script></html>`;
await mkdir(dest, { recursive: true });
await writeFile(path.join(dest, 'player.html'), html);
const manifest = {
  format: 'audionaut-runtime-build/1',
  version: RUNTIME_VERSION,
  sha256: hash(html),
  bytes: Buffer.byteLength(html),
  mediaType: 'text/html',
  file: 'player.html',
  status: 'prepared-not-inscribed',
  workers: [...resources.keys()].sort(),
  packages: [...packages.values()]
    .map(({ name, version, license }) => ({ name, version, license }))
    .sort((a, b) => a.name.localeCompare(b.name))
};
await writeFile(path.join(dest, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify(manifest));
