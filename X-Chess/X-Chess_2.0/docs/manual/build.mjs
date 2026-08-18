#!/usr/bin/env node
// Build the manual as a self-contained page.
//
// SAME SOURCE AS THE TEXT MANUAL. docs/xchess-manual.txt is the content and this
// is only a renderer, so the two can never drift into saying different things —
// which is the failure mode of every project that keeps a "web version" beside a
// "plain version".
//
// Self-contained because it is inscribed: no fonts, no scripts from anywhere, no
// images. Everything a viewer needs is in the bytes.

import { readFileSync, writeFileSync } from 'node:fs';
import { build as esbuild } from 'esbuild';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');

const bundle = await esbuild({
  entryPoints: [resolve(ROOT, 'packages/protocol/docs.ts')],
  bundle: true, format: 'esm', platform: 'node', write: false, logLevel: 'error'
});
const { parseDocs, splitRefs } = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
);

const source = readFileSync(resolve(ROOT, 'docs/xchess-manual.txt'), 'utf8');
const parsed = parseDocs(source);
if (!parsed.ok) {
  console.error(`the manual does not parse: ${parsed.problem}`);
  process.exit(1);
}
const docs = parsed.docs;

/** Escaped, always. The renderer never trusts its own input either. */
const esc = (text) =>
  String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Inscription references become links that open where the viewer is served. */
const withRefs = (text) =>
  splitRefs(text)
    .map((piece) =>
      piece.inscription === null
        ? esc(piece.text)
        : `<a class="ref" href="/i/${piece.inscription}" target="_blank" rel="noopener noreferrer">${esc(piece.text)}</a>`
    )
    .join('');

/** Runs of list items become one list; definitions become one glossary grid. */
function renderBlocks(blocks) {
  const out = [];
  let at = 0;
  while (at < blocks.length) {
    const block = blocks[at];

    if (block.kind === 'item') {
      const items = [];
      while (at < blocks.length && blocks[at].kind === 'item') items.push(blocks[at++]);
      out.push(`<ul>${items.map((i) => `<li>${withRefs(i.text)}</li>`).join('')}</ul>`);
      continue;
    }
    if (block.kind === 'define') {
      const rows = [];
      while (at < blocks.length && blocks[at].kind === 'define') rows.push(blocks[at++]);
      out.push(
        `<dl class="glossary">${rows
          .map((r) => `<dt id="g-${esc(r.term.replace(/\s+/g, '-'))}">${esc(r.term)}</dt><dd>${withRefs(r.text)}</dd>`)
          .join('')}</dl>`
      );
      continue;
    }
    if (block.kind === 'command') {
      out.push(`<pre class="cmd"><code>${esc(block.text)}</code></pre>`);
      at++;
      continue;
    }
    out.push(`<p>${withRefs(block.text)}</p>`);
    at++;
  }
  return out.join('\n');
}

const contents = docs.sections
  .map(
    (s) =>
      `<li class="toc-${s.level}"><a href="#${s.id}">${esc(s.title)}</a></li>`
  )
  .join('');

const body = docs.sections
  .map((s) => {
    const tag = s.level === 2 ? 'h2' : 'h3';
    return `<section class="s${s.level}"><${tag} id="${s.id}">${esc(s.title)}` +
      `<a class="anchor" href="#${s.id}" aria-label="Link to this section">#</a></${tag}>` +
      `${renderBlocks(s.blocks)}</section>`;
  })
  .join('\n');

const CSS = `
:root{--bg:#12100e;--panel:#1b1815;--line:#2e2924;--line-2:#453d33;--ink:#e8e2d9;
--dim:#9a9187;--gold:#d8a24a;--warn:#e0733f;--good:#6fae5f;--light:#b9a98f}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);
font:15px/1.65 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
a{color:var(--gold)}
.wrap{max-width:1080px;margin:0 auto;padding:0 20px 80px}

header.top{border-bottom:1px solid var(--line);margin-bottom:28px;
padding:44px 0 26px;background:
radial-gradient(60% 120% at 12% 0%,rgba(216,162,74,.10),transparent 60%)}
header.top h1{margin:0;font-size:34px;letter-spacing:-.4px}
header.top h1 b{color:var(--gold);font-weight:800}
header.top .lede{margin:10px 0 0;color:var(--dim);max-width:62ch;font-size:16px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.chip{border:1px solid var(--line-2);border-radius:999px;padding:4px 11px;
font-size:12px;color:var(--dim);text-decoration:none}
.chip:hover{border-color:var(--gold);color:var(--gold)}
.chip b{color:var(--gold);font-weight:600}

.cols{display:grid;grid-template-columns:230px 1fr;gap:40px;align-items:start}
nav.toc{position:sticky;top:20px;max-height:calc(100vh - 40px);overflow:auto;
border-left:2px solid var(--line);padding-left:14px}
nav.toc h4{margin:0 0 8px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--gold)}
nav.toc ul{list-style:none;margin:0;padding:0}
nav.toc a{display:block;padding:3px 0;color:var(--dim);text-decoration:none;font-size:13px}
nav.toc a:hover{color:var(--gold)}
.toc-3 a{padding-left:12px;font-size:12px;color:#7f776e}

section.s2{margin:34px 0 0;padding-top:22px;border-top:1px solid var(--line)}
section.s3{margin:22px 0 0}
h2{font-size:23px;margin:0 0 10px;letter-spacing:-.2px}
h3{font-size:16px;margin:0 0 8px;color:var(--light)}
.anchor{margin-left:8px;color:var(--line-2);text-decoration:none;font-weight:400}
h2:hover .anchor,h3:hover .anchor{color:var(--gold)}
p{max-width:70ch;margin:9px 0;color:#cfc7bc}
ul{max-width:70ch;margin:9px 0;padding-left:20px}
li{margin:4px 0;color:#cfc7bc}
li::marker{color:var(--gold)}
.ref{white-space:nowrap}

pre.cmd{max-width:70ch;overflow-x:auto;background:#0d0b09;border:1px solid var(--line-2);
border-left:3px solid var(--gold);border-radius:5px;padding:11px 13px;margin:12px 0}
pre.cmd code{font:12.5px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--gold)}

dl.glossary{max-width:70ch;margin:12px 0;display:grid;
grid-template-columns:minmax(120px,190px) 1fr;gap:1px 18px}
dl.glossary dt{color:var(--gold);font-weight:600;padding:9px 0;border-top:1px solid var(--line)}
dl.glossary dd{margin:0;padding:9px 0;color:#cfc7bc;border-top:1px solid var(--line)}

footer{margin-top:52px;padding-top:20px;border-top:1px solid var(--line);
color:var(--dim);font-size:13px}
footer a{color:var(--gold)}

@media (max-width:820px){
.cols{grid-template-columns:1fr;gap:10px}
nav.toc{position:static;max-height:none;border-left:0;border-top:1px solid var(--line);
padding:14px 0 0;margin-bottom:8px}
nav.toc ul{columns:2;column-gap:18px}
header.top{padding:30px 0 20px}
header.top h1{font-size:26px}
}
`.trim();

const intro = renderBlocks(docs.intro);
const html = [
  '<!doctype html>',
  '<html lang="en">',
  '<head>',
  '<meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width, initial-scale=1">',
  `<title>${esc(docs.title)}</title>`,
  `<style>${CSS}</style>`,
  '</head>',
  '<body>',
  '<header class="top"><div class="wrap">',
  `<h1>The <b>X Chess</b> manual</h1>`,
  '<p class="lede">Chess on Bitcoin, via Stacks. Every move is a transaction, every ' +
    'position is replayed from the chain, and this page is itself an inscription.</p>',
  '<div class="chips">',
  '<a class="chip" href="#running-your-own-tournament">Run a tournament</a>',
  '<a class="chip" href="#ai-players">Program a player</a>',
  '<a class="chip" href="#fees-and-why-your-wallet-is-wrong">Fees</a>',
  '<a class="chip" href="#glossary">Glossary</a>',
  '<a class="chip" href="/i/2991" target="_blank" rel="noopener noreferrer">The engine <b>#2991</b></a>',
  '</div>',
  '</div></header>',
  '<div class="wrap"><div class="cols">',
  `<nav class="toc"><h4>Contents</h4><ul>${contents}</ul></nav>`,
  `<main>${intro}${body}</main>`,
  '</div>',
  '<footer>Inscribed on Xtrata. A correction is a new inscription, not an edit — ' +
    'the board finds the newest one by reading the wallet it was sent to.</footer>',
  '</div>',
  '</body>',
  '</html>'
].join('\n');

const out = resolve(ROOT, 'dist/xchess-manual.html');
writeFileSync(out, html);
const bytes = Buffer.byteLength(html, 'utf8');
console.log(`built dist/xchess-manual.html  ${bytes.toLocaleString()} bytes, ${Math.ceil(bytes / 16384)} chunk(s)`);
console.log(`${docs.sections.length} sections from docs/xchess-manual.txt`);
