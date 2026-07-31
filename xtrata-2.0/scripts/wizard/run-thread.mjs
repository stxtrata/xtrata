#!/usr/bin/env node
/**
 * run-thread.mjs — drive the remaining entries of a wizard thread to completion.
 *
 * DRY RUN BY DEFAULT. With no flags it runs the whole loop against a fake chain:
 * no key is read, nothing is signed, nothing is sent, and no request leaves this
 * process. `--broadcast` is the only thing that spends.
 *
 * A thread is six entries plus a closing manifest, and every entry after the
 * first quotes the inscription id and the claim of the one before it. Those do
 * not exist until the previous transaction confirms, so driving a thread by hand
 * means waiting on an explorer between commands and pasting ids by eye. This
 * does it end to end: broadcast, poll to a terminal status, read the minted id
 * out of the transaction result, read that inscription's own bytes back off
 * chain, quote its claim in the next entry, and close with the manifest.
 *
 * Rehearse the remaining two entries and the manifest against fakes:
 *   node scripts/wizard/run-thread.mjs --thread t-permanence-001 \
 *     --subject cost-of-permanence --from 5 --dry
 *
 * See what is confirmed, pending or missing, without running anything:
 *   node scripts/wizard/run-thread.mjs --status t-permanence-001
 *
 * Really do it (real mainnet transactions, real STX, irreversible):
 *   node scripts/wizard/run-thread.mjs --thread t-permanence-001 \
 *     --subject cost-of-permanence --from 5 --ids 2922,2923,2924,2925 --broadcast
 *
 * Every rail inscribe.mjs applies to one mint applies to each mint here, plus:
 *
 *   - a run journal at scripts/wizard/.run-<threadId>.json, written before each
 *     broadcast and updated after, so a runner that dies mid-flight never
 *     re-broadcasts a position it already sent
 *   - a run-level spend cap across every remaining broadcast
 *   - the kill switch checked between every step
 *   - stop on the first failure, and never retry a broadcast
 *
 * See scripts/wizard/README.md.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import {
  AnchorMode,
  FungibleConditionCode,
  PostConditionMode,
  TransactionVersion,
  boolCV,
  broadcastTransaction,
  bufferCV,
  cvToHex,
  cvToJSON,
  getAddressFromPrivateKey,
  hexToCV,
  makeContractCall,
  makeStandardSTXPostCondition,
  noneCV,
  responseOkCV,
  someCV,
  standardPrincipalCV,
  tupleCV,
  uintCV
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';

import {
  CORE_ADDRESS,
  CORE_NAME,
  DEFAULT_BALANCE_FLOOR_USTX,
  DEFAULT_HIRO_URL,
  DEFAULT_MAX_TX_FEE_USTX,
  DEFAULT_SPEND_CAP_USTX,
  WizardSafetyError,
  expectedWizardAddresses,
  finalHash,
  formatPlan,
  groupDigits,
  killSwitchEngaged,
  loadWizardEnv,
  toHex
} from './inscribe.mjs';
import { composeThread } from './compose.mjs';
import { PERSONA_IDS, SUBJECT_IDS, THREAD_LENGTH } from './personas.mjs';
import {
  DEFAULT_CONFIRM_POLL_MS,
  DEFAULT_CONFIRM_TIMEOUT_MS,
  DEFAULT_RUN_SPEND_CAP_USTX,
  formatRunReport,
  formatStatusTable,
  runThread,
  statusReport
} from './run-thread-core.mjs';

/* ------------------------------------------------------------------ */
/* argv                                                                */
/* ------------------------------------------------------------------ */

const arg = (name, fallback = null) => {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) return fallback;
  const value = process.argv[index + 1];
  return value && !value.startsWith('--') ? value : true;
};
const flag = (name) => arg(name) === true;
const text = (name, fallback = null) => (typeof arg(name) === 'string' ? arg(name) : fallback);
const csv = (value) =>
  value && typeof value === 'string' ? value.split(',').map((part) => part.trim()).filter(Boolean) : [];

const say = (line = '') => console.log(line);

/* ------------------------------------------------------------------ */
/* the real ports                                                      */
/* ------------------------------------------------------------------ */

/** The journal is plain JSON next to the scripts, and gitignored. */
const journalPorts = () => ({
  readJournal: (path) => (existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null),
  writeJournal: (path, journal) => writeFileSync(path, `${JSON.stringify(journal, null, 2)}\n`, 'utf8')
});

/**
 * The one port that spends. It is a near-copy of the broadcast block in
 * inscribe.mjs and must stay one: same function, same fee, same Deny mode, same
 * LessEqual post-condition on the quoted protocol fee. Never Equal — an
 * exact-match post-condition aborts the transaction and burns the miner fee if
 * the fee schedule moves underneath the run.
 *
 * It refuses unless the caller passes broadcast: true, so a dry run that somehow
 * reached the live port still sends nothing.
 */
const liveSubmit = ({ hiroUrl }) =>
  async function submit({ plan, broadcast, senderKey, senderAddress, protocolFeeUstx, minerFeeUstx }) {
    if (broadcast !== true) {
      throw new WizardSafetyError('the live submit port was called without broadcast: true. Nothing was signed.');
    }
    const network = new StacksMainnet({ url: hiroUrl });
    const tx = await makeContractCall({
      contractAddress: CORE_ADDRESS,
      contractName: CORE_NAME,
      functionName: plan.call.functionName,
      functionArgs: plan.call.functionArgs,
      senderKey,
      network,
      fee: BigInt(minerFeeUstx),
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Deny,
      postConditions: [
        makeStandardSTXPostCondition(senderAddress, FungibleConditionCode.LessEqual, BigInt(protocolFeeUstx))
      ]
    });
    const result = await broadcastTransaction(tx, network);
    if (result.error) throw new Error(`${result.error}${result.reason ? ` (${result.reason})` : ''}`);
    return { txid: result.txid };
  };

/* ------------------------------------------------------------------ */
/* the fake chain, for --dry                                           */
/* ------------------------------------------------------------------ */

/** Obviously-not-a-key placeholders. Dry mode never reads a real key. */
const dryKeyFor = (index) => String(index + 1).padStart(64, '0');

/**
 * A chain that exists only in this process: inscriptions it can serve chunks
 * for, creators it can attribute them to, and transactions it can report as
 * confirmed. Enough to drive the whole loop, and incapable of spending anything.
 *
 * Ids for entries minted before this run are synthetic unless --ids supplies the
 * real ones. That is stated loudly in the output, for the same reason
 * --preview-thread states it: a rehearsal that looks like the real thing is
 * worse than one that admits what it is.
 */
function makeFakeChain({ tip, feeUstx }) {
  const inscriptions = new Map();
  const byHash = new Map();
  const transactions = new Map();
  let nextId = 0;

  const add = (id, body, creator) => {
    const key = String(id);
    inscriptions.set(key, { body, creator });
    byHash.set(toHex(finalHash(new Uint8Array(Buffer.from(body, 'utf8')))), key);
    nextId = Math.max(nextId, Number(id) || 0);
    return key;
  };

  return {
    tip,
    feeUstx,
    inscriptions,
    byHash,
    transactions,
    add,
    mint(body, creator, minerFeeUstx) {
      const id = add(String(nextId + 1), body, creator);
      const txid = toHex(finalHash(new Uint8Array(Buffer.from(body, 'utf8'))));
      transactions.set(txid.toLowerCase(), {
        tx_status: 'success',
        tx_result: {
          hex: cvToHex(responseOkCV(tupleCV({ existed: boolCV(false), 'token-id': uintCV(BigInt(id)) }))),
          repr: `(ok (tuple (existed false) (token-id u${id})))`
        },
        block_height: tip + 1,
        fee_rate: String(minerFeeUstx)
      });
      return { id, txid };
    }
  };
}

/**
 * A fetch that answers from the fake chain and refuses everything else. The
 * refusal is the point: if a dry run ever reaches a real endpoint, this throws
 * rather than quietly talking to mainnet.
 *
 * Arguments are decoded with the real Clarity decoder rather than by picking the
 * hex apart, so a fake that disagrees with the encoder shows up here instead of
 * three steps later as an inexplicable `none`.
 */
function fakeFetch(chain) {
  const json = (body) => Response.json(body);
  const clarity = (cv) => json({ okay: true, result: cvToHex(cv) });

  return async (input, init) => {
    const url = String(input);
    const body = init?.body ? JSON.parse(String(init.body)) : null;
    const argument = (index) => {
      const hex = body?.arguments?.[index];
      return hex === undefined ? null : cvToJSON(hexToCV(hex)).value;
    };

    if (url.includes('/quote-inscription-fee')) {
      return clarity(
        responseOkCV(
          tupleCV({
            'begin-fee': uintCV(100_000n),
            'chunk-size': uintCV(16_384n),
            mode: uintCV(2n),
            'seal-fee': uintCV(100_984n),
            'single-tx-eligible': boolCV(true),
            'single-tx-fee': uintCV(BigInt(chain.feeUstx)),
            'total-fee': uintCV(BigInt(chain.feeUstx)),
            'upload-batch-limit': uintCV(32n),
            'upload-batches': uintCV(1n)
          })
        )
      );
    }
    if (url.endsWith('/is-paused')) return clarity(responseOkCV(boolCV(false)));
    if (url.endsWith('/get-chunk')) {
      const found = chain.inscriptions.get(String(argument(0)));
      return clarity(found ? someCV(bufferCV(Buffer.from(found.body, 'utf8'))) : noneCV());
    }
    if (url.endsWith('/get-inscription-creator')) {
      const found = chain.inscriptions.get(String(argument(0)));
      return clarity(found?.creator ? someCV(standardPrincipalCV(found.creator)) : noneCV());
    }
    if (url.endsWith('/get-id-by-hash')) {
      const id = chain.byHash.get(String(argument(0)));
      return clarity(id ? someCV(uintCV(BigInt(id))) : noneCV());
    }
    if (url.includes('/extended/v2/blocks')) return json({ results: [{ height: chain.tip }] });
    if (url.includes('/balances/stx')) return json({ balance: '5000000' });
    if (url.includes('/nonces')) {
      return json({ last_executed_tx_nonce: 6, possible_next_nonce: 7, detected_missing_nonces: [] });
    }
    const tx = /\/extended\/v1\/tx\/(0x[0-9a-f]{64})/i.exec(url);
    if (tx) {
      const found = chain.transactions.get(tx[1].toLowerCase());
      return found ? json(found) : new Response('not found', { status: 404 });
    }
    throw new WizardSafetyError(`the dry run tried to reach ${url}. A dry run talks to nothing.`);
  };
}

/**
 * Every port a dry run needs: the fake chain, a submit that mints into it
 * instead of onto mainnet, a frozen clock and a sleep that returns instantly.
 *
 * The journal is held in memory and never written. A dry run invents its
 * inscription ids and its transaction ids, and a file full of invented txids
 * sitting next to the real one is an accident waiting to happen — at best a
 * later run polls a transaction that never existed, at worst it reads a position
 * as already broadcast and skips it. It also means two identical dry runs
 * produce identical output, which a rehearsal should.
 */
function dryPorts({ chain, wallets }) {
  let journal = null;
  return {
    readJournal: () => journal,
    writeJournal: (path, value) => {
      journal = value;
    },
    fetchImpl: fakeFetch(chain),
    killSwitch: (env) => killSwitchEngaged(env),
    now: () => Date.UTC(2026, 6, 31, 12, 0, 0),
    sleep: async () => {},
    say,
    presentPlan: (plan, options) => say(formatPlan(plan, options)),
    submit: async ({ plan, broadcast, wizardId, minerFeeUstx }) => {
      if (broadcast === true) {
        throw new WizardSafetyError('the dry submit port was asked to broadcast. It cannot, and it did not.');
      }
      const minted = chain.mint(plan.body, wallets[wizardId]?.address ?? null, minerFeeUstx);
      say(`    [dry] minted into the fake chain as #${minted.id}; nothing was signed and nothing was sent`);
      return { txid: minted.txid };
    }
  };
}

/* ------------------------------------------------------------------ */
/* wallets                                                             */
/* ------------------------------------------------------------------ */

/**
 * Address and key per wizard.
 *
 * A live run derives the address from the key, so a key filed under the wrong
 * wizard shows up as an address that does not match the one provisioning
 * recorded. A dry run never touches a real key: it takes the real addresses when
 * they are configured, because that makes the parent-author check meaningful,
 * and pairs them with a placeholder that could not sign anything.
 */
function walletsFor({ env, broadcast }) {
  const addresses = expectedWizardAddresses(env);
  const wallets = {};
  for (const [index, id] of PERSONA_IDS.entries()) {
    const key = broadcast ? (env[`WIZARD_KEY_${id.toUpperCase()}`] ?? null) : dryKeyFor(index);
    const address = broadcast
      ? key
        ? getAddressFromPrivateKey(key, TransactionVersion.Mainnet)
        : (env[`WIZARD_ADDRESS_${id.toUpperCase()}`] ?? null)
      : (addresses[id] ?? getAddressFromPrivateKey(dryKeyFor(index), TransactionVersion.Mainnet));
    wallets[id] = { address, key };
  }
  return wallets;
}

/* ------------------------------------------------------------------ */
/* cli                                                                 */
/* ------------------------------------------------------------------ */

function usage() {
  say('run-thread.mjs — drive the remaining entries of a wizard thread end to end.');
  say('');
  say('  DRY RUN BY DEFAULT. --broadcast is the only flag that spends.');
  say('');
  say('  --thread <id>            the thread to run (required)');
  say('  --subject <id>           subject for the entries it composes');
  say('  --from <n>               first position to run (default 1)');
  say('  --to <n>                 last position to run (default the thread length)');
  say('  --ids <a,b,c>            inscription ids for positions already minted, in order');
  say('  --dry                    the default: the whole loop against a fake chain');
  say('  --broadcast              real mainnet transactions, real STX, irreversible');
  say('  --status <threadId>      journal plus chain, as a table. Runs nothing.');
  say('  --no-manifest            stop after the last entry, do not close the thread');
  say('  --manifest-wizard <id>   who signs the manifest (default the opening wizard)');
  say('  --thread-length <n>      entries in a thread (default ' + THREAD_LENGTH + ')');
  say('  --run-spend-cap-ustx <n> cap across the whole run (default ' + groupDigits(DEFAULT_RUN_SPEND_CAP_USTX) + ')');
  say('  --spend-cap-ustx <n>     cap for any one mint (default ' + groupDigits(DEFAULT_SPEND_CAP_USTX) + ')');
  say('  --balance-floor-ustx <n> never spend a wallet below this');
  say('  --max-tx-fee-ustx <n>    miner fee bid per transaction');
  say('  --confirm-timeout-minutes <n>  how long to wait for one transaction');
  say('  --poll-seconds <n>       gap between transaction lookups');
  say('  --hiro <url>             Hiro endpoint');
  say('');
  say(`  wizards : ${PERSONA_IDS.join(', ')}`);
  say(`  subjects: ${SUBJECT_IDS.join(', ')}`);
  say('');
  say('  See scripts/wizard/README.md.');
}

async function main() {
  if (flag('help')) {
    usage();
    return 0;
  }

  loadWizardEnv();
  const env = process.env;
  const hiroUrl = text('hiro', DEFAULT_HIRO_URL);
  const threadLength = Number(arg('thread-length', THREAD_LENGTH));

  if (arg('status')) {
    const threadId = typeof arg('status') === 'string' ? arg('status') : text('thread');
    if (!threadId) throw new WizardSafetyError('--status needs a thread id: --status <threadId>');
    const ids = csv(arg('ids'));
    const report = await statusReport({
      ports: { ...journalPorts(), fetchImpl: globalThis.fetch },
      options: {
        threadId,
        threadLength,
        hiroUrl,
        knownIds: Object.fromEntries(ids.map((id, index) => [String(index + 1), id]))
      }
    });
    say(formatStatusTable(report));
    return 0;
  }

  const threadId = text('thread');
  if (!threadId) throw new WizardSafetyError('--thread <id> is required. It is written into every entry.');
  const subject = text('subject', SUBJECT_IDS[0]);
  const broadcast = flag('broadcast');
  const from = Number(arg('from', 1));
  const to = Number(arg('to', threadLength));
  const ids = csv(arg('ids'));

  const options = {
    threadId,
    subject,
    threadLength,
    from,
    to,
    broadcast,
    manifest: !flag('no-manifest'),
    manifestWizard: text('manifest-wizard'),
    hiroUrl,
    env,
    runSpendCapUstx: BigInt(arg('run-spend-cap-ustx', String(DEFAULT_RUN_SPEND_CAP_USTX))),
    spendCapUstx: BigInt(arg('spend-cap-ustx', String(DEFAULT_SPEND_CAP_USTX))),
    balanceFloorUstx: BigInt(arg('balance-floor-ustx', String(DEFAULT_BALANCE_FLOOR_USTX))),
    minerFeeUstx: BigInt(arg('max-tx-fee-ustx', String(DEFAULT_MAX_TX_FEE_USTX))),
    confirmTimeoutMs: arg('confirm-timeout-minutes')
      ? Number(arg('confirm-timeout-minutes')) * 60_000
      : DEFAULT_CONFIRM_TIMEOUT_MS,
    confirmPollMs: arg('poll-seconds') ? Number(arg('poll-seconds')) * 1_000 : DEFAULT_CONFIRM_POLL_MS
  };

  const wallets = walletsFor({ env, broadcast });
  options.wallets = wallets;
  let ports;

  if (broadcast) {
    options.knownIds = Object.fromEntries(ids.map((id, index) => [String(index + 1), id]));
    ports = {
      ...journalPorts(),
      fetchImpl: globalThis.fetch,
      killSwitch: (killEnv) => killSwitchEngaged(killEnv),
      now: () => Date.now(),
      sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
      say,
      presentPlan: (plan, presentOptions) => say(formatPlan(plan, presentOptions)),
      submit: liveSubmit({ hiroUrl })
    };
    say('');
    say('=== BROADCAST. Every mint below is a real mainnet transaction and cannot be undone. ===');
  } else {
    // Positions already minted have to exist for the loop to cite them, so a dry
    // run composes them locally and serves them from a fake chain. Real ids when
    // --ids supplies them, synthetic ones otherwise, said out loud either way.
    const chain = makeFakeChain({ tip: 8_700_000, feeUstx: 11_000n });
    // Clamped to the thread, so an out-of-range --from produces no fake entries
    // at all and is refused by the runner rather than half-seeded here first.
    const priorIds = Array.from(
      { length: Math.max(0, Math.min(from, threadLength) - 1) },
      (_, index) => ids[index] ?? String(9001 + index)
    );
    options.knownIds = Object.fromEntries(priorIds.map((id, index) => [String(index + 1), id]));

    if (priorIds.length > 0) {
      const seeded = composeThread({
        threadId,
        subject,
        blockHeight: chain.tip,
        feeMicroStx: chain.feeUstx,
        ids: priorIds,
        threadLength
      });
      for (const entry of seeded.entries.slice(0, priorIds.length)) {
        chain.add(entry.id, entry.body, wallets[entry.wizard]?.address ?? null);
      }
    }

    ports = dryPorts({ chain, wallets });
    say('');
    say('=== DRY RUN. A fake chain in this process. No key is read, nothing is signed, nothing is sent. ===');
    if (priorIds.length > 0) {
      const synthetic = priorIds.filter((id, index) => ids[index] === undefined);
      say(
        `    positions 1..${from - 1} are served from locally composed bodies at ${priorIds.map((id) => `#${id}`).join(', ')}` +
          (synthetic.length > 0
            ? `. ${synthetic.map((id) => `#${id}`).join(', ')} ${synthetic.length === 1 ? 'is' : 'are'} SYNTHETIC — ` +
              'pass --ids to rehearse against the real ones.'
            : '.')
      );
    }
    say('');
  }

  const result = await runThread({ ports, options });
  say(formatRunReport(result));

  if (!result.ok) return 1;
  if (!broadcast) {
    say('');
    say('To do this for real, re-run with --broadcast and the real ids:');
    say(
      `  node scripts/wizard/run-thread.mjs --thread ${threadId} --subject ${subject} --from ${from}` +
        `${ids.length ? ` --ids ${ids.join(',')}` : ' --ids <ids for positions already minted>'} --broadcast`
    );
  }
  return 0;
}

const isDirectRun = Boolean(process.argv[1]) && pathToFileURL(process.argv[1]).href === import.meta.url;
if (isDirectRun) {
  main()
    .then((code) => {
      process.exitCode = code ?? 0;
    })
    .catch((error) => {
      console.error(`\n${error?.name === 'WizardSafetyError' || error?.name === 'WizardComposeError' ? error.message : error}`);
      process.exitCode = 1;
    });
}

export { dryPorts, fakeFetch, journalPorts, liveSubmit, makeFakeChain, walletsFor };
