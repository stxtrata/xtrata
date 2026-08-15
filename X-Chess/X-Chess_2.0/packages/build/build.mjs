#!/usr/bin/env node
// The build.
//
//   node packages/build/build.mjs [--contract SP....xchess-core-v1] [--network mainnet]
//
// Output is ONE self-contained HTML file. An inscription cannot fetch anything,
// so everything the board needs has to be in its own bytes, and every one of
// those bytes is permanent.
//
// Two guards exist because of a single bug: an inlined module containing the
// text "</script>" truncated every self-contained build SILENTLY. The page
// looked like a page and stopped at the truncation. So the build escapes
// "</script" and then asserts there is exactly one unescaped closing tag in the
// output.

import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build as esbuild, transform } from 'esbuild';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const DIST = resolve(ROOT, 'dist');

const arg = (name, fallback) => {
  const at = process.argv.indexOf(`--${name}`);
  return at >= 0 ? process.argv[at + 1] : fallback;
};

const PLACEHOLDER = 'SP000000000000000000002Q6VF78.xchess-core-v1';

/**
 * The build remembers what it was last pointed at.
 *
 * Without this, `npm run build` with no arguments - which is also what the
 * verify harness runs - quietly replaces a board bound to a real deployed
 * contract with one bound to the placeholder. The placeholder does not exist on
 * any network, so the board can read nothing: every game is "no such game" and
 * the only clue is a warning several hundred lines up a harness log.
 *
 * That happened. The fix is not a louder warning. An argument-less rebuild now
 * means "the same target as last time", and the placeholder is only used when
 * nothing has ever been built here.
 *
 * `--contract` still wins, and `--contract <placeholder>` is still a way to ask
 * for an unbound board on purpose.
 *
 * KEPT OUTSIDE dist, and the location is the interesting part. It lived in
 * dist/, which this build deletes before it writes anything - so a build that
 * failed after the delete destroyed the memory of what it was building for, and
 * the next argument-less build fell back to the placeholder. The fix for the
 * problem reintroduced the problem. Gitignored: it is one machine's last
 * choice, not a fact about the project.
 */
const TARGET_PATH = resolve(ROOT, '.xchess-build-target.json');

async function rememberedTarget() {
  try {
    const saved = JSON.parse(await readFile(TARGET_PATH, 'utf8'));
    if (typeof saved?.contract === 'string' && saved.contract.includes('.')) return saved;
  } catch {
    // Nothing built here yet, or the file is not ours. Either way, no memory.
  }
  return null;
}

const ASKED = arg('contract', null);
const REMEMBERED = ASKED ? null : await rememberedTarget();
const CONTRACT = ASKED ?? REMEMBERED?.contract ?? PLACEHOLDER;
const NETWORK = arg('network', null) ?? (ASKED ? 'mainnet' : REMEMBERED?.network) ?? 'mainnet';
const VERSION = arg('version', '2.0.0-dev');

/**
 * When this build happened, to the minute.
 *
 * During a period of frequent rebuilds "2.0.0-dev" identifies nothing: every
 * build says it, and a stale page in a browser tab is indistinguishable from a
 * fresh one. The timestamp and the content hash together answer "am I looking
 * at what I just built" without anybody having to guess.
 */
/**
 * When this build says it was made.
 *
 * PINNABLE, because it is baked into the artefact and therefore into its hash.
 * Left to the clock, two builds of identical source disagree the moment they
 * straddle a minute - and the wallet matrix signs each row against
 * `manifest.htmlSha256`, while `verify` rebuilds as its last layer. So running
 * verify after the matrix silently invalidated every row that had just been
 * earned by hand, and the gate would refuse with no way to tell that from a
 * real regression.
 *
 * `SOURCE_DATE_EPOCH` is the reproducible-builds convention and is understood by
 * other toolchains; `--built` is here for a person who wants to say it plainly.
 * With neither, the clock, which is what an ordinary development build wants.
 */
const BUILT = (() => {
  const said = arg('built', '');
  if (said) return said;
  const epoch = Number(process.env.SOURCE_DATE_EPOCH);
  const when = Number.isFinite(epoch) && epoch > 0 ? new Date(epoch * 1000) : new Date();
  return when.toISOString().slice(0, 16).replace('T', ' ');
})();
const CANARY = process.argv.includes('--canary');
const CANARY_NAME = arg('canary-name', 'xchess-core-v1-canary');

const sha256 = (text) => createHash('sha256').update(text).digest('hex');

/**
 * How Xtrata hashes an upload, which is NOT a digest of the file.
 *
 * The contract cannot hold a 120 KB file to hash it, so it hashes as the chunks
 * arrive: start from thirty-two zero bytes, and for each chunk replace the
 * running value with sha256(running || chunk). What it ends up with depends on
 * the chunk SIZE as well as the bytes, so it is a different number from
 * `shasum -a 256` and always will be.
 *
 * Recording both is the point. The Inscribe page displays this one, the
 * manifest used to record only the plain digest, and the two disagreeing at one
 * in the morning looks exactly like inscribing the wrong file. They are two
 * hashes of the same bytes.
 */
const XTRATA_CHUNK_BYTES = 16384;

function xtrataChainHash(text, chunkBytes = XTRATA_CHUNK_BYTES) {
  const bytes = Buffer.from(text, 'utf8');
  let running = Buffer.alloc(32);
  for (let at = 0; at < bytes.length; at += chunkBytes) {
    running = createHash('sha256')
      .update(Buffer.concat([running, bytes.subarray(at, at + chunkBytes)]))
      .digest();
  }
  return running.toString('hex');
}

const chunkCount = (text, chunkBytes = XTRATA_CHUNK_BYTES) =>
  Math.ceil(Buffer.byteLength(text, 'utf8') / chunkBytes);

/**
 * Inside a JavaScript string `<\/script` is identical to `</script`, so
 * escaping is free: the code means exactly the same thing and the HTML parser
 * no longer sees a closing tag.
 */
function escapeForInlineScript(code) {
  return code.replace(/<\/(script)/gi, '<\\/$1');
}

/**
 * A self-contained page has exactly one script block and loads nothing. If a
 * stray `</script` ever slips through again, the build stops rather than
 * shipping a page that is silently cut in half.
 */
function assertOneScriptClose(html, label) {
  const closers = (html.match(/<\/script/gi) || []).length;
  if (closers !== 1) {
    throw new Error(
      `${label}: expected exactly one unescaped </script, found ${closers}. ` +
        'An inlined module almost certainly contains the literal text and would ' +
        'truncate the page at that point.'
    );
  }
}

/**
 * Minify the shell's CSS and HTML, which live as template literals.
 *
 * The board carries every byte of them forever, and about 12 KB of that is
 * PROSE: comments explaining why a grid row is explicit, why a ring is two-tone,
 * why there are no backticks in a comment. Every one of those is worth keeping -
 * they are the reason the same bug has not been reintroduced three times - and
 * none of them is worth inscribing.
 *
 * Done as an onLoad over shell.ts rather than by splitting the strings into
 * .css and .html files. The file split is what proposal 2 described and it costs
 * three configs (esbuild, tsc, vitest) plus module shims; this costs one plugin
 * and leaves the source exactly as a developer reads it. Nothing but the BUILD
 * sees the minified form.
 *
 * THE TRAP, and it is the reason this is not a one-line regex: the CSS literal
 * interpolates `${SCALE_CSS}` in the middle of itself, and the HTML literal
 * interpolates the explainers and the seat options. Handing any of that to a CSS
 * parser fails, and handing it to a text transform risks eating it. So the
 * literals are split on their interpolations, only the static parts are touched,
 * and the plugin asserts every interpolation survived.
 */
function shellAssets() {
  const SPLIT = /(\$\{[^{}]*\})/;

  const minifyCss = async (text) => {
    const out = await transform(text, { loader: 'css', minify: true });
    return out.code;
  };

  // Comments and leading indentation only. NEVER all whitespace runs: the space
  // between two inline elements is a space on screen, and collapsing it moves
  // the page.
  const minifyHtml = (text) =>
    text
      .replace(/<!--[\s\S]*?-->/g, '')
      .split('\n')
      .map((line) => line.replace(/^\s+/, ''))
      .filter((line) => line.length > 0)
      .join('\n');

  const rewrite = async (source, name, minify) => {
    const found = new RegExp(`export const ${name} = \`([\\s\\S]*?)\`;`).exec(source);
    if (!found) throw new Error(`build: shell.ts has no ${name} literal to minify`);

    const parts = found[1].split(SPLIT);
    const holes = parts.filter((part) => SPLIT.test(part));
    const done = [];
    for (const part of parts) {
      done.push(SPLIT.test(part) ? part : await minify(part));
    }
    const rebuilt = done.join('');

    // Every interpolation still there, and in order. Losing one is silent: the
    // per-piece font sizes would simply vanish and the pieces would render at
    // the default size, which looks like a design choice.
    for (const hole of holes) {
      if (!rebuilt.includes(hole)) {
        throw new Error(`build: minifying ${name} dropped the interpolation ${hole}`);
      }
    }
    return source.replace(found[0], `export const ${name} = \`${rebuilt}\`;`);
  };

  return {
    name: 'shell-assets',
    setup(build) {
      build.onLoad({ filter: /packages[\\/]ui[\\/]shell\.ts$/ }, async (args) => {
        let source = await readFile(args.path, 'utf8');
        source = await rewrite(source, 'CSS', minifyCss);
        source = await rewrite(source, 'HTML', async (text) => minifyHtml(text));
        return { contents: source, loader: 'ts' };
      });
    }
  };
}

async function bundle(entry) {
  const result = await esbuild({
    entryPoints: [resolve(ROOT, entry)],
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: ['es2022'],
    minify: true,
    write: false,
    legalComments: 'none',
    plugins: [shellAssets()],
    define: {
      // Baked in, so an inscribed board cannot be pointed somewhere else by a
      // URL parameter. See `exact` below.
      __XCHESS_BUILD__: JSON.stringify(VERSION)
    }
  });
  if (result.errors.length) throw new Error(result.errors.map((e) => e.text).join('\n'));
  return result.outputFiles[0].text;
}

/**
 * The gates canary.
 *
 * A separate artefact from the board, and deliberately so: it carries the
 * contract SOURCE, it can deploy, and none of that belongs in the thing players
 * open. Built into dist/ alongside the board so a run can check that the
 * contract it deploys is the one the board was built against.
 */
async function buildCanary(boardSha256) {
  const source = await readFile(resolve(ROOT, 'contracts/xchess-core-v1.clar'), 'utf8');
  const code = await bundle('apps/canary/main.ts');

  const config = {
    contractName: CANARY_NAME,
    network: NETWORK,
    version: VERSION,
    built: BUILT,
    hash: sha256(code).slice(0, 8),
    clarityVersion: 4,
    // THE BOARD'S hash, not the canary's. A wallet matrix is signed against the
    // artefact players will open, and `harness/release.mjs` compares every
    // RESULT line to `manifest.htmlSha256`. The canary carries it so the runner
    // can stamp each row without anybody copying a hash by hand.
    boardSha256: boardSha256 ?? null,
    // WHERE THE CONTRACT ALREADY IS, which is not where the wallet track's
    // operator is standing. The launch track deploys, so it derives the address
    // from whoever is connected; the wallet track exercises a contract that
    // exists, and must point at the one the BOARD is built against or it is
    // testing something else.
    contractAddress: CONTRACT.split('.')[0],
    source
  };

  const inline = [
    `window.__XCHESS_CANARY__=${escapeForInlineScript(JSON.stringify(config))};`,
    escapeForInlineScript(code)
  ].join('\n');

  const html = [
    // An EXPLICIT head, and it is not decoration.
    //
    // The Xtrata runtime injects its base tag and support scripts by looking
    // for a <head> and inserting after it. With no literal head to match, it
    // falls back to prepending them - which puts markup BEFORE the doctype and
    // renders the whole page in QUIRKS MODE. That is a different box model,
    // permanently, on a board whose grid depends on aspect-ratio.
    //
    // Nothing about this is visible in local development: served as a file the
    // page is standards mode and correct. It only appears under the runtime,
    // which is the entire reason the rehearsal step exists.
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>X Chess 2 - gates</title>',
    '</head>',
    '<body>',
    '<script>',
    inline,
    '</script>',
    ''
  ].join('\n');

  assertOneScriptClose(html, 'the gates canary');
  await writeFile(resolve(DIST, 'xchess-gates.html'), html);

  console.log(`built dist/xchess-gates.html  ${Buffer.byteLength(html, 'utf8').toLocaleString()} bytes`);
  console.log(`  version        ${VERSION} - ${BUILT} - #${sha256(code).slice(0, 8)}`);
  console.log(`  contract name  ${CANARY_NAME}`);
  console.log(`  contract sha   ${sha256(source)}`);
  console.log(`  clarity        4`);
  return { bytes: Buffer.byteLength(html, 'utf8'), sha256: sha256(html), contractName: CANARY_NAME };
}

async function main() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  const code = await bundle('apps/chess/main.ts');

  // ONE script block, holding the config and then the application.
  //
  // An earlier version used two blocks and escaped the closing tag of the
  // first, which meant that script never closed: the whole rest of the document
  // became string content inside it and the page died with a syntax error. The
  // "exactly one closing tag" guard PASSED, because the escape had hidden the
  // one that mattered.
  //
  // The lesson is narrow and worth keeping. Escaping applies to `</script`
  // appearing inside JavaScript SOURCE, never to the tag that actually ends a
  // block. One block means there is exactly one real closing tag and the guard
  // is checking the thing it was written to check.
  // `exact: true` is not decoration. A built board must not be able to talk to
  // a contract other than the one it was built against: a fallback chain would
  // let one failed request silently show a different log under the same game
  // number, and a reader would have no way to tell.
  const config = {
    contract: CONTRACT,
    network: NETWORK,
    version: VERSION,
    built: BUILT,
    // A short hash of the bundled code. Not of the whole page, because the page
    // contains this value: a self-referential hash is not computable. The code
    // is what changes between builds, so hashing it is the useful answer.
    hash: sha256(code).slice(0, 8),
    exact: true
  };

  const inline = [
    `window.__XCHESS__=${escapeForInlineScript(JSON.stringify(config))};`,
    escapeForInlineScript(code)
  ].join('\n');

  const html = [
    // An EXPLICIT head, and it is not decoration.
    //
    // The Xtrata runtime injects its base tag and support scripts by looking
    // for a <head> and inserting after it. With no literal head to match, it
    // falls back to prepending them - which puts markup BEFORE the doctype and
    // renders the whole page in QUIRKS MODE. That is a different box model,
    // permanently, on a board whose grid depends on aspect-ratio.
    //
    // Nothing about this is visible in local development: served as a file the
    // page is standards mode and correct. It only appears under the runtime,
    // which is the entire reason the rehearsal step exists.
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>X Chess</title>',
    '</head>',
    '<body>',
    '<script>',
    inline,
    '</script>',
    ''
  ].join('\n');

  assertOneScriptClose(html, 'the self-contained board');

  const htmlPath = resolve(DIST, 'xchess.html');
  await writeFile(htmlPath, html);

  // Protocol hashes, so a reader can tell whether two builds agree about the
  // rules of the game rather than only about their version numbers.
  const read = (path) => readFile(resolve(ROOT, path), 'utf8');
  const [replaySource, rulesSource, eloSource, contractSource] = await Promise.all([
    read('packages/replay/replay.ts'),
    read('packages/protocol/canonical.ts'),
    read('packages/ratings/elo-v1.ts'),
    read('contracts/xchess-core-v1.clar')
  ]);

  const manifest = {
    product: 'X Chess',
    build: VERSION,
    builtFrom: 'apps/chess/main.ts',
    contract: CONTRACT,
    network: NETWORK,
    built: BUILT,
    codeHash: sha256(code).slice(0, 8),
    exact: true,
    rulesProtocol: 'rules-v1',
    replayProtocol: 'replay-v1',
    eventsProtocol: 'events-v1',
    rankedProtocol: 'ranked-v1',
    ratingProtocol: 'elo-v1',
    coreFormat: 'xchess-core-v1',
    replayHash: sha256(replaySource),
    rulesHash: sha256(rulesSource),
    ratingHash: sha256(eloSource),
    contractHash: sha256(contractSource),
    htmlSha256: sha256(html),
    // What the Xtrata Inscribe page shows, and what its contract arrives at as
    // the chunks land. Compare THIS one against the upload, not htmlSha256.
    xtrataChainHash: xtrataChainHash(html),
    xtrataChunkBytes: XTRATA_CHUNK_BYTES,
    xtrataChunks: chunkCount(html),
    bytes: Buffer.byteLength(html, 'utf8')
  };

  // The canary is built by default: an artefact whose deploy page was never
  // built is an artefact nobody can get on chain.
  const canary =
    CANARY || !process.argv.includes('--board-only')
      ? await buildCanary(manifest.htmlSha256)
      : null;
  if (canary) manifest.canary = canary;

  await writeFile(resolve(DIST, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  // Written last, and only ever read by the next build. It is what makes an
  // argument-less rebuild keep pointing at the same contract.
  await writeFile(
    TARGET_PATH,
    `${JSON.stringify({ contract: CONTRACT, network: NETWORK }, null, 2)}\n`
  );

  // A board built against a contract that does not exist can read nothing at
  // all, and the symptom is whatever the visitor happens to try first. Say so
  // at the moment it is built, not at the moment somebody opens it.
  if (CONTRACT === PLACEHOLDER) {
    console.log('');
    console.log('  !! This board is bound to the PLACEHOLDER contract and can read nothing.');
    console.log('  !! Rebuild with:  npm run build -- --contract <address>.<name>');
    console.log('');
  }

  // `add-chunk-batch` takes `(list 32 (buff 16384))`, so 32 chunks go up in one
  // transaction. Print the room left inside that, because it is the figure
  // anybody deciding whether to add something actually needs, and because the
  // last two features spent 1,620 bytes between them with nothing mentioning it.
  const BATCH_CHUNKS = 32;
  const batchCeiling = BATCH_CHUNKS * XTRATA_CHUNK_BYTES;
  const headroom = batchCeiling - manifest.bytes;

  console.log(`built dist/xchess.html  ${manifest.bytes.toLocaleString()} bytes`);
  console.log(`  sha256    ${manifest.htmlSha256}  (shasum -a 256)`);
  console.log(`  xtrata    ${manifest.xtrataChainHash}  (${manifest.xtrataChunks} chunks, what Inscribe shows)`);
  console.log(
    `  budget    ${manifest.xtrataChunks}/${BATCH_CHUNKS} chunks in one upload transaction, ` +
      `${headroom.toLocaleString()} bytes to spare`
  );
  console.log(`  contract  ${CONTRACT} (${NETWORK})${REMEMBERED ? ' - kept from the last build' : ''}`);
  console.log(`  version   ${VERSION} - ${BUILT} - #${manifest.codeHash}`);
  console.log('');
  console.log(`  The page shows "${VERSION} - ${BUILT} - #${manifest.codeHash}" at the top.`);
  console.log('  If it does not, you are looking at an older build. Hard-reload it.');
}

await main();
