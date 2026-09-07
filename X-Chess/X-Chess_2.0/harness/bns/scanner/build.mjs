// Builds `wallet-scanner.html`: one file, no network for its own code.
//
// Built FROM `inventory.html` rather than beside it, so the table, the
// tooltips, the totals, the retry pass and the snapshot format have one source
// of truth. What gets added is the part that page deliberately refuses to have:
// a field you can paste a recovery phrase into.
//
// THE REVERSAL IS DELIBERATE AND THE CONDITIONS ARE NARROW.
//
// `inventory.html` must never take a seed because it is generated with somebody
// else's holdings baked into it and passed around. This page is different in
// exactly one way that matters: it is READ-ONLY BY CONSTRUCTION. The bundle
// below contains derivation and address encoding and no signer, no transaction
// builder and no broadcaster - not disabled, absent. It cannot spend from an
// address it derives because the code to do that is not in the file.
//
//   node harness/bns/scanner/build.mjs

import { build as esbuild } from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';

const HERE = new URL('.', import.meta.url);
const TEMPLATE = new URL('../inventory.html', HERE);
const OUT = new URL('../wallet-scanner.html', HERE);

const bundle = await esbuild({
  entryPoints: [new URL('./crypto-entry.mjs', HERE).pathname],
  bundle: true,
  format: 'iife',
  globalName: 'XKEY',
  platform: 'browser',
  minify: true,
  write: false,
  logLevel: 'error'
});
const crypto = bundle.outputFiles[0].text;

let page = readFileSync(TEMPLATE, 'utf8');

/* -------------------------------------------------------------- */
/* what changes                                                     */
/* -------------------------------------------------------------- */

page = page.replace(
  '<title>Wallet inventory</title>',
  '<title>Wallet scanner</title>'
);

page = page.replace(
  '  <h1>Wallet inventory</h1>\n  <p class="sub">What every address holds, and what changed after you moved it.</p>',
  '  <h1>Wallet scanner</h1>\n  <p class="sub">Every address a recovery phrase reaches, and what each one holds.</p>'
);

// The notice is the opposite of the inventory page's, and has to say so plainly.
page = page.replace(
  /  <div class="never">[\s\S]*?<\/div>\n/,
  `  <div class="never">
    <strong>This page derives addresses. It cannot spend from them.</strong>
    Your phrase is used in this tab and nowhere else: it is never sent anywhere,
    never written to storage, never put in the URL, and it is wiped from the
    field when the scan ends. Only the derived <em>addresses</em> — which are
    public — are sent to the block explorers. There is no signing code in this
    file at all, so it cannot move anything even if it wanted to.
    <br><br>
    <strong>Read this before you paste anything.</strong> A page asking for a
    recovery phrase is the oldest theft on the internet, and being told it is
    safe is exactly what a fake would say. Open this file from your own disk,
    not from a link somebody sent you. Check the URL bar says
    <span class="mono">file://</span>. If you want to be certain, search this
    file for <span class="mono">fetch(</span> — every one goes to a block
    explorer with an address, and none carries a key.
    <br><br>
    <strong>Prefer not to?</strong> Then don't. Run
    <span class="mono">harness/bns/addresses.mjs</span> in a terminal, paste the
    addresses it prints into <span class="mono">inventory.html</span>, and this
    page has nothing you need.
  </div>
`
);

// The key panel, above the address box.
page = page.replace(
  '  <div class="panel">\n    <label for="addresses">Addresses, one per line</label>',
  `  <div class="panel">
    <label for="secret">Recovery phrase, or a single private key</label>
    <textarea id="secret" spellcheck="false" autocomplete="off" autocapitalize="off"
      style="min-height:4.5rem"
      placeholder="twelve or twenty-four lowercase words, separated by spaces&#10;&#10;or one private key: 64 hex characters"></textarea>
    <p class="hint">
      A phrase is scanned account by account until it finds
      <span id="gap-label">20</span> empty ones in a row — the standard gap
      limit — so a wallet with a used account at number 63 is still found. A
      single private key is one keypair with no tree beneath it, so there is
      nothing to scan and it checks that one account.
    </p>
    <div class="row">
      <button id="scan" class="primary" type="button">Scan</button>
      <button id="stop-scan" type="button" disabled>Stop</button>
      <button id="forget" type="button">Forget the phrase</button>
      <label class="hint" style="display:flex;align-items:center;gap:.4rem;font-weight:400">
        <input type="checkbox" id="keep-empty"> keep empty accounts in the list
      </label>
    </div>
    <p class="status" id="scan-status">Nothing entered.</p>
  </div>

  <div class="panel">
    <label for="addresses">Addresses, one per line</label>`
);

// The crypto, then the scanner. Before the page's own script, which reads
// #addresses on demand rather than at load, so order is not delicate.
page = page.replace(
  '<script>\n(() => {\n  \'use strict\';',
  `<script>${crypto}</script>
<script>
(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);

  /**
   * How many empty accounts in a row before a scan stops.
   *
   * Twenty is the BIP44 gap limit and every wallet uses it, which is what makes
   * it the right number here: a scan that stopped at the first empty account
   * would miss a wallet whose owner made accounts 1 and 40, and one that never
   * stopped would run forever on a phrase with nothing on it.
   */
  const GAP_LIMIT = 20;

  /** Derived in batches, so a long scan shows progress instead of freezing. */
  const BATCH = 5;

  let scanning = false;

  /** Anything at all, on either chain. An account with only dust still counts. */
  function populated(row) {
    return Boolean(
      (row.stx ?? 0) > 0 ||
        row.bns?.length ||
        row.nfts?.length ||
        row.fts?.length ||
        (row.btc && !row.btc.error && BigInt(row.btc.sats ?? 0) > 0n)
    );
  }

  $('scan').addEventListener('click', async () => {
    const secret = $('secret').value.trim().replace(/\\s+/g, ' ');
    if (!secret) { $('scan-status').textContent = 'Enter a phrase or a key first.'; return; }

    let found = [];
    const pairs = {};
    const sources = {};
    let gap = 0;
    let index = 0;
    scanning = true;
    $('scan').disabled = true;
    $('stop-scan').disabled = false;

    try {
      // Validated BEFORE anything is scanned, so a typo is a sentence rather
      // than a hundred empty accounts and a shrug.
      XKEY.accountsFrom(secret, 0, 1);

      while (scanning && gap < GAP_LIMIT) {
        const batch = XKEY.accountsFrom(secret, index, BATCH);
        if (!batch.length) break;
        for (const account of batch) {
          if (account.btc) pairs[account.stacks] = account.btc;
          sources[account.stacks] = { seed: 'this phrase', account: account.account };
          found.push(account);
        }
        // Only the Leather line paces the gap. The hardened shape is a
        // secondary search and its emptiness says nothing about where to stop.
        const leather = batch.filter((a) => a.convention === 'leather');
        const active = await Promise.all(
          leather.map((a) => window.__probe(a.stacks, pairs[a.stacks]))
        );
        for (const row of active) gap = populated(row) ? 0 : gap + 1;
        index += BATCH;
        $('scan-status').textContent =
          \`Scanned \${index} account(s); \${gap} empty in a row (stops at \${GAP_LIMIT}).\`;
        if (batch.length < BATCH * 2) break; // a raw key: one account, no tree
      }

      const keepEmpty = $('keep-empty').checked;
      const rows = await window.__inventoryAll(
        found.map((a) => a.stacks),
        pairs,
        sources
      );
      const shown = keepEmpty ? rows : rows.filter(populated);
      $('addresses').value = shown.map((r) => r.address).join('\\n');
      $('scan-status').textContent =
        \`Done. \${found.length} address(es) derived, \${rows.filter(populated).length} with something on them\` +
        (keepEmpty ? '.' : ', empty ones hidden.');

      // WIPED. The scan is over and the phrase has no further use, so it stops
      // existing rather than sitting in a field behind a page somebody walks
      // away from.
      $('secret').value = '';
    } catch (error) {
      $('scan-status').textContent = String(error?.message ?? error);
      $('scan-status').className = 'status bad';
    } finally {
      scanning = false;
      $('scan').disabled = false;
      $('stop-scan').disabled = true;
    }
  });

  $('stop-scan').addEventListener('click', () => {
    scanning = false;
    $('scan-status').textContent = 'Stopping after this batch…';
  });

  $('forget').addEventListener('click', () => {
    $('secret').value = '';
    $('scan-status').textContent = 'Cleared.';
  });

  $('gap-label').textContent = String(GAP_LIMIT);
})();
</script>

<script>
(() => {
  'use strict';`
);

// Expose the two hooks the scanner needs from the page's own engine.
page = page.replace(
  "  $('load').addEventListener('click', () => $('file').click());",
  `  // Two hooks for the scanner above: probe one address, and inventory a list.
  // Exposed rather than duplicated, so the scanner and the table agree about
  // what "what this wallet holds" means.
  window.__probe = async (address, btc) => {
    if (btc) BTC_PAIRS[address] = btc;
    return inventory(address);
  };
  window.__inventoryAll = async (addresses, pairs, sources) => {
    Object.assign(BTC_PAIRS, pairs);
    Object.assign(SOURCES, sources);
    const rows = [];
    await pass(addresses, rows, 'Reading');
    current = { format: SNAPSHOT_FORMAT, takenAt: new Date().toISOString(), rows };
    offerRetry(rows);
    $('save').disabled = false;
    return rows;
  };

  $('load').addEventListener('click', () => $('file').click());`
);

// HAS_BTC / HAS_SOURCES are computed at load; the scanner fills them later.
page = page.replace(
  '  const HAS_BTC = Object.keys(BTC_PAIRS).length > 0;',
  `  // Always true in the scanner: the pairing arrives after load, so a column
  // decided at load time would never appear.
  const HAS_BTC = true;`
);
page = page.replace(
  '  const HAS_SOURCES = Object.keys(SOURCES).length > 0;',
  '  const HAS_SOURCES = true;'
);

writeFileSync(OUT, page, 'utf8');
console.log(
  `wrote ${OUT.pathname}\n` +
    `  ${(page.length / 1024).toFixed(0)} KB total, ${(crypto.length / 1024).toFixed(0)} KB of it crypto\n` +
    `  self-contained: no CDN, no build step for the reader, opens from disk`
);
