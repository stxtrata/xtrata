// Builds release/astro-blaster-3.html: one self-contained file, no external requests except the Stacks API.
import { readFileSync, writeFileSync } from 'node:fs';
import { simSource } from './build-sim.mjs';
import { createRequire } from 'node:module';
// The wallet layer (top-level pages only) is the shared Xtrata wallet module,
// bundled once with esbuild from the site's node_modules.
const siteRequire = createRequire(new URL('../../../package.json', import.meta.url));
const { build: esbuild } = siteRequire('esbuild');
const walletBundle = (await esbuild({
  entryPoints: [new URL('../src/client/wallet-entry.ts', import.meta.url).pathname],
  absWorkingDir: new URL('../../../', import.meta.url).pathname,
  bundle: true, format: 'iife', platform: 'browser', target: 'es2020', minify: true, write: false, legalComments: 'none',
  define: { global: 'globalThis', 'process.env.NODE_ENV': '"production"' }
})).outputFiles[0].text;
const r = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
// Production: no test hooks, and the attract-mode autopilot lives privately in
// the client scope instead of on the global AB3 object.
function page({ test }) {
  let client = ['chain', 'render', 'audio', 'input', 'main'].map((f) => r(`src/client/${f}.js`)).join('\n');
  if (!test) client = client.replace(/\/\*TEST-HOOKS-START\*\/[\s\S]*?\/\*TEST-HOOKS-END\*\//g, '');
  const botScope = test ? '' : `var CMD = AB3.CMD, W = AB3.W, H = AB3.H;\nfunction clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }\n${r('src/sim/bot.js')}\n`;
  const js = simSource({ bot: test }) + '\n' + walletBundle + `\n(function () {\n'use strict';\nvar SECTORS = AB3.SECTORS;\n${botScope}${client}\n})();\n`;
  const html = r('src/client/shell.html');
  return html.replace('/*CSS*/', () => r('src/client/style.css')).replace('/*JS*/', () => js.replace(/<\/script/gi, '<\\/script'));
}
const prod = page({ test: false });
if (/__ab3|autopilot|TEST-HOOKS/.test(prod)) throw new Error('test hooks leaked into the production build');
writeFileSync(new URL('../release/astro-blaster-3.html', import.meta.url), prod);
writeFileSync(new URL('../release/astro-blaster-3.test.html', import.meta.url), page({ test: true }));
// engine used by verifiers (submit page, tests): full sim incl. the bot for test harnesses
writeFileSync(new URL('../release/sim.js', import.meta.url), simSource({ bot: true }));
console.log('release/astro-blaster-3.html', (Buffer.byteLength(prod) / 1024).toFixed(1) + ' KB');
