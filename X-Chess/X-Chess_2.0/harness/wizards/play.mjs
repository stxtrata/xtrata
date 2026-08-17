#!/usr/bin/env node
/**
 * play.mjs — the wizards play chess at the canary contract.
 *
 *   node harness/wizards/play.mjs                 a dry run: says what it would do
 *   node harness/wizards/play.mjs --live          signs and broadcasts, for real
 *   node harness/wizards/play.mjs balances        what each wizard holds
 *   node harness/wizards/play.mjs sweep --to SP…  send the floats back
 *
 * DRY BY DEFAULT, and that is not a convenience. Every act here spends real STX
 * on mainnet and none of it can be undone, so the default has to be the one
 * that costs nothing.
 *
 * What it proves, and what it does not: a wizard signs with a raw key through
 * @stacks/transactions, and a player signs through Xverse or Leather, which
 * parse the request and forward what they choose to. Those are different paths.
 * This proves the CONTRACT accepts the call and the ENCODING is right —
 * including the contract-principal post condition — and proves nothing about
 * whether a wallet will send it. See harness/wallets/MATRIX.md, which still
 * needs a person.
 */

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build as esbuild } from 'esbuild';
import { recordBroadcast } from './fee-log.mjs';
import { createApiKeyMiddleware, createFetchFn } from '@stacks/common';
import {
  Cl,
  Pc,
  PostConditionMode,
  broadcastTransaction,
  makeContractCall,
  makeSTXTokenTransfer
} from '@stacks/transactions';

import {
  ALLOWED_CONTRACT,
  isRulesHash,
  FEE_LADDER,
  FEE_BUMP_AFTER_MS,
  DEFAULT_SPEND_CAP_USTX,
  DIRECTOR,
  PERSONAS,
  TARGET_FLOAT_USTX,
  assertTransferAllowed,
  looksLikeMainnetAddress,
  planFunding,
  SCRIPTED_GAME,
  WizardSafetyError,
  assertBroadcastAllowed,
  planRun,
  readFleet,
  scrub
} from './wizards-core.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ENV_FILE = join(HERE, '.env.wizards');
const API = 'https://api.mainnet.hiro.so';
const [CONTRACT_ADDRESS, CONTRACT_NAME] = ALLOWED_CONTRACT.split('.');

const arg = (name, fallback = null) => {
  const at = process.argv.indexOf(`--${name}`);
  return at > -1 && process.argv[at + 1] ? process.argv[at + 1] : fallback;
};
const LIVE = process.argv.includes('--live');
export const ustx = (micro) => `${(Number(micro) / 1_000_000).toFixed(6)} STX`;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Seconds between moves, for a game somebody is meant to watch.
 *
 * Zero by default: a test run wants to be quick, and the wizards' own job is to
 * answer a question rather than put on a show. `--pace 45` turns the same plan
 * into an exhibition, and on a long one it is also the cheapest defence against
 * the rate limit - forty-five seconds a move is well inside any budget, and all
 * three mainnet hosts share one.
 */
const PACE_MS = Math.max(0, Number(arg('pace', '0')) * 1000);

/**
 * The env file, read here rather than by a dependency.
 *
 * dotenv would do this in one line and would also be a dependency in a project
 * that keeps them countable, for a format this simple.
 */
function readEnvFile(path = ENV_FILE) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const found = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (found) out[found[1]] = found[2].trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

/**
 * The Hiro API key, if this machine has one.
 *
 * Anonymous is about fifty requests a minute, shared with everything else on the
 * IP — and a fleet that reads four balances, a fee and a game count trips it
 * mid-run, which is exactly how the first funded run ended: three transfers
 * sent, and a 429 reading back the third wallet.
 *
 * Same names and same places the proxy reads (xtrata-2.0/functions/lib/
 * hiro-keys.ts), so a machine set up for one is set up for both. The key is
 * NEVER printed: it is attached to a header and nothing here logs headers.
 */
const HIRO_KEYS = (() => {
  const found = [];
  const add = (value) => {
    for (const key of String(value ?? '').split(/[\s,]+/)) {
      const trimmed = key.trim();
      if (trimmed && !found.includes(trimmed)) found.push(trimmed);
    }
  };
  for (const name of ['HIRO_API_KEYS', 'HIRO_API_KEY', 'VITE_HIRO_API_KEY']) add(process.env[name]);
  // The wizards' own file first, then the site's, so a fleet can carry its own
  // key without touching anything else.
  for (const path of [ENV_FILE, join(HERE, '..', '..', '..', '..', 'xtrata-2.0', '.env.local')]) {
    try {
      for (const line of readFileSync(path, 'utf8').split('\n')) {
        const match = /^\s*(HIRO_API_KEYS?|VITE_HIRO_API_KEY)\s*=\s*(.*)$/.exec(line);
        if (match) add(match[2].trim().replace(/^["']|["']$/g, ''));
      }
    } catch {
      // No file, or unreadable. Anonymous is a supported way to run this.
    }
  }
  return found;
})();

/**
 * The library's OWN fetch, keyed.
 *
 * @stacks/transactions makes its own network calls - the fee estimate, the
 * nonce - through a fetch this file never sees, so keying our own requests did
 * nothing for those. The first live game got two moves in and then died on a 429
 * from `/v2/fees/transaction`, which is a call we never make and cannot header.
 *
 * `client` is the injection point the library provides for exactly this.
 */
const CLIENT = HIRO_KEYS.length
  ? {
      baseUrl: API,
      fetch: createFetchFn(createApiKeyMiddleware({ apiKey: HIRO_KEYS[0] }))
    }
  : { baseUrl: API };

/**
 * What a transaction pays the miner.
 *
 * SET, NOT ESTIMATED, and the reason is not only the rate limit. The plan says
 * every move costs 3,000 uSTX and the spend cap is checked against that - while
 * the library was quietly asking the network what to pay and using THAT. So the
 * cap was notional: it counted a number nobody was spending.
 *
 * A fixed fee makes the plan and the spend the same thing, and removes a network
 * call per transaction on the way.
 */


/** Both spellings, as the proxy sends both. */
const hiroHeaders = (extra = {}) =>
  HIRO_KEYS.length
    ? { ...extra, 'x-hiro-api-key': HIRO_KEYS[0], 'x-api-key': HIRO_KEYS[0] }
    : { ...extra };

/**
 * A read, retried.
 *
 * WAITING IS THE CORRECT RESPONSE TO A RATE LIMIT, and this used to throw on the
 * first one. That is defensible for a four-move script and wrong for anything
 * that runs for hours: a tournament makes thousands of reads, so it will meet a
 * 429, and dying on it abandons a run that had done nothing wrong. The first
 * live tournament game died exactly here — on a balance check, before a single
 * transaction was signed.
 *
 * ONLY READS COME THROUGH HERE. Broadcasting goes through the library's own
 * client, so nothing in this retry can resend a transaction — which is the one
 * thing a retry must never do.
 *
 * Backoff is generous because the budget refills on a clock rather than on
 * demand; asking again immediately is how a rate limit becomes a longer rate
 * limit.
 */
export const api = async (path, tries = 5) => {
  let last = null;
  for (let attempt = 1; attempt <= tries; attempt++) {
    const response = await fetch(`${API}${path}`, { headers: hiroHeaders() });
    if (response.ok) return response.json();

    last = new Error(
      response.status === 429
        ? `${path} -> 429 rate limited` +
          (HIRO_KEYS.length
            ? '. Even with a key, which means something is asking far too often.'
            : '. No Hiro API key found — put HIRO_API_KEY in harness/wizards/.env.wizards.')
        : `${path} -> ${response.status}`
    );
    last.status = response.status;

    // A 4xx that is not 429 is the API answering. Asking again gets the same
    // answer and spends the budget that the next real read needs.
    if (response.status !== 429 && response.status < 500) throw last;
    if (attempt === tries) break;

    const waitMs = 5_000 * 2 ** (attempt - 1);
    console.log(`  (${response.status} on ${path.slice(0, 48)}…, waiting ${waitMs / 1000}s)`);
    await new Promise((done) => setTimeout(done, waitMs));
  }
  throw last;
};

/**
 * What each wallet holds.
 *
 * THE PATH IS THE WHOLE BUG, and it looked exactly like a rate limit. Round 2
 * died three moves in on a balance check, backed off 5s, 10s, 20s, 40s, and
 * gave up - on a READ, with nothing wrong on chain. Measured afterwards against
 * api.hiro.so, same machine, same minute:
 *
 *   /extended/v1/address/{a}/balances        429   <- what this used
 *   /extended/v2/addresses/{a}/balances/stx  200
 *   /extended/v1/address/{a}/nonces          200
 *   /v2/info                                 200
 *
 * The v1 balances route is deprecated and throttled to almost nothing. It is
 * not our volume: a key made no difference (0/70 with it, 0/8 without), and
 * ninety seconds of complete silence did not refill it, while every other path
 * answered normally throughout.
 *
 * A 429 THAT NO AMOUNT OF WAITING FIXES IS NOT A RATE LIMIT, it is a wrong
 * address - and backing off is the worst possible response, because it looks
 * like patience is working right up until the run dies.
 *
 * THE SHAPE DIFFERS TOO: v2 puts the figure at `balance`, v1 at `stx.balance`.
 * Reading the wrong key yields 0, which refuses every move as unaffordable
 * rather than crashing, so both are read and v2 comes first.
 *
 * The cache stays on top because it is worth having regardless: we know exactly
 * what we spend, and a read moments after a broadcast still shows the old
 * number, since the transaction is not mined yet. Our own count is the truer one.
 */
const CACHED_BALANCE_MS = 5 * 60_000;
const balanceCache = new Map();

export const balanceOf = async (address, { maxAgeMs = CACHED_BALANCE_MS } = {}) => {
  const held = balanceCache.get(address);
  if (held && Date.now() - held.at < maxAgeMs) return held.ustx;

  try {
    const body = await api(`/extended/v2/addresses/${address}/balances/stx`);
    const ustx = BigInt(body?.balance ?? body?.stx?.balance ?? '0');
    balanceCache.set(address, { ustx, at: Date.now() });
    return ustx;
  } catch (error) {
    // A RATE LIMIT MUST NOT END A TOURNAMENT. With the path fixed this should
    // be rare, but the run that dies on a read it could have survived is the
    // failure this harness keeps repeating. If the address has ever been read,
    // the figure we hold is stale by a known amount and nothing else - every
    // debit since came from us and was subtracted - and spending stays bounded
    // because the cap is counted locally and this number only ever falls.
    if (error?.status === 429 && held) {
      console.log(`  (balance for ${address.slice(0, 8)}… rate limited, using our own count)`);
      return held.ustx;
    }
    throw error;
  }
};

/** Subtract what we just spent, so the next check needs no network call. */
export const debitBalance = (address, ustx) => {
  const held = balanceCache.get(address);
  if (!held) return;
  const left = held.ustx - BigInt(ustx);
  balanceCache.set(address, { ustx: left < 0n ? 0n : left, at: held.at });
};

/**
 * The next nonce this account may use.
 *
 * Needed because SIGNING THREE TRANSACTIONS IN A ROW DOES NOT WORK if you let
 * the library fetch the nonce each time. It asks the API, and the API answers
 * with the same number until the first one is MINED — so all three come out
 * carrying nonce 0, one is accepted and the other two are silently replaced.
 *
 * Which is not a hypothetical: the first funded run sent three transfers, and
 * exactly one arrived. The Director's balance had moved by one transfer's worth
 * and two txids simply did not exist on chain, having never been anything.
 *
 * The gates page has warned about this in its own words since it was written -
 * "two transactions signed close together take the same nonce, and the second
 * replaces the first" - and this loop was written without reading it.
 */
// NOT CACHED, unlike the balance above, and not given a 429 fallback either.
// A stale nonce is not a slightly wrong number — it is a transaction that
// silently replaces another one. This is read once per funding run and then
// incremented by hand, so there is never a previous value worth falling back
// to: the first read either works or the run has not started.
export const nextNonce = async (address) => {
  const body = await api(`/extended/v1/address/${address}/nonces`);
  return BigInt(body?.possible_next_nonce ?? 0);
};

/**
 * A read-only call, on the path that actually exists.
 *
 * `call-read`, NOT `call-read-only`. The second reads like the right name, is
 * what the docs suggest, and 404s — returning "No such file", which arrives as a
 * JSON parse error several frames away from the mistake. The board has always
 * used `call-read` (packages/chain/client.ts), so this is not a discovery so
 * much as a reminder to look at what already works.
 */
export async function readOnly(functionName, args = [], tries = 5) {
  // Retried for the same reason `api` is, and it matters more here: a
  // tournament reads the log before EVERY move, so this is the call most likely
  // to meet a rate limit and the one whose failure loses a game in progress.
  //
  // A read-only call cannot change anything, so retrying it is free of the
  // hazard that makes retrying a write unacceptable.
  let last = null;
  for (let attempt = 1; attempt <= tries; attempt++) {
    const response = await fetch(
      `${API}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/${functionName}`,
      {
        method: 'POST',
        headers: hiroHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ sender: CONTRACT_ADDRESS, arguments: args })
      }
    );
    if (response.ok) {
      const body = await response.json();
      // `okay: false` is the CONTRACT answering - a runtime error in the read.
      // Asking again produces the same answer, so it is not retried.
      if (!body?.okay) throw new Error(`${functionName}: ${body?.cause ?? 'read failed'}`);
      return Cl.deserialize(body.result);
    }

    last = new Error(`${functionName}: HTTP ${response.status}`);
    last.status = response.status;
    if (response.status !== 429 && response.status < 500) throw last;
    if (attempt === tries) break;

    const waitMs = 5_000 * 2 ** (attempt - 1);
    console.log(`  (${response.status} on ${functionName}, waiting ${waitMs / 1000}s)`);
    await new Promise((done) => setTimeout(done, waitMs));
  }
  throw last;
}

/**
 * The board's OWN rules encoding, not a second copy of it.
 *
 * A rules hash is a commitment: get one byte different and the game is opened
 * against rules no board will ever recover, permanently. So this does not
 * reimplement the encoding — it bundles `packages/protocol` on the fly and
 * imports the real thing. Same principle as the wallet track using the board's
 * connectWallet: a copy proves things about the copy.
 *
 * The cost is about fifty milliseconds at startup, once, and the alternative is
 * a duplicate of a canonical serialiser that nothing would notice drifting.
 */
let protocol = null;
export async function loadProtocol() {
  if (protocol) return protocol;
  const out = await esbuild({
    entryPoints: [join(HERE, '..', '..', 'packages', 'protocol', 'rules.ts')],
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
    logLevel: 'error'
  });
  const rules = await import(
    `data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text).toString('base64')}`
  );
  const canonicalOut = await esbuild({
    entryPoints: [join(HERE, '..', '..', 'packages', 'protocol', 'canonical.ts')],
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
    logLevel: 'error'
  });
  const canonical = await import(
    `data:text/javascript;base64,${Buffer.from(canonicalOut.outputFiles[0].text).toString('base64')}`
  );
  protocol = { ...rules, ...canonical };
  return protocol;
}

/**
 * The rules a wizard game commits to.
 *
 * Both sides NAMED, and ranked. Named because a game whose players are known is
 * the only kind a rating can come from, and because it is what makes the result
 * checkable by somebody who was not there. Ranked because the ranked index, the
 * eligibility check and elo-v1 are otherwise never touched by anything that runs
 * unattended.
 *
 * A third party can recover these once BOTH have moved: recovery builds its
 * candidates from the opener and the first few senders, so black is not a
 * candidate until black has played. Before that the game reads as "rules
 * unconfirmed", which is correct rather than a fault.
 */
export async function wizardRules(white, black) {
  const { DEFAULT_RULES, normaliseRules, rulesHash } = await loadProtocol();
  const rules = normaliseRules({ ...DEFAULT_RULES, white, black, ranked: true });
  return { rules, hash: rulesHash(rules) };
}

/** The open fee, from the contract rather than from a constant here. */
export async function readOpenFee() {
  return BigInt((await readOnly('get-open-fee')).value);
}

/**
 * Sign and send one call, or refuse.
 *
 * The gate runs FIRST and every refusal is a throw. Nothing below this line
 * happens for a dry run, which is what makes a dry run free.
 */
export async function send({
  wizard,
  functionName,
  functionArgs,
  spendUstx,
  postConditions,
  spent,
  cap,
  rulesHash,
  fee = FEE_LADDER[0],
  nonce = null,
  rung = 0,
  game = null
}) {
  const balance = await balanceOf(wizard.address);
  // THE FEE IS PART OF WHAT THIS COSTS, and it stopped being counted when the
  // ladder arrived. Before that the miner fee WAS `spendUstx`, so a submit
  // planned to spend 3,000 and the guard was satisfied. Now the fee travels
  // separately as `fee`, a submit has no contract-level spend at all, and
  // `spendUstx: 0n` tripped "a broadcast must plan to spend something" — which
  // it does, it just spends it on the miner.
  //
  // Round 3 died on this after opening three games and playing three moves.
  //
  // Counting the total also fixes the quieter half: the spend cap was ignoring
  // every miner fee, so a run that believed it had spent nothing had in fact
  // spent 3,000 uSTX a move. Game 18 alone was 1.008 STX of fees the cap never
  // saw. `debitBalance` below has always charged the total; only the cap and
  // the guard disagreed.
  const costUstx = BigInt(spendUstx) + BigInt(fee);

  const allowed = assertBroadcastAllowed({
    live: LIVE,
    contract: ALLOWED_CONTRACT,
    functionName,
    rulesHash,
    network: 'mainnet',
    senderAddress: wizard.address,
    balanceUstx: balance,
    plannedSpendUstx: costUstx,
    spentSoFarUstx: spent,
    spendCapUstx: cap
  });

  const tx = await makeContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName,
    functionArgs,
    senderKey: wizard.key,
    network: 'mainnet',
    client: CLIENT,
    fee,
    // Pinned when a ladder is climbing, so the replacement lands on the SAME
    // nonce and displaces the rung below rather than queueing behind it.
    ...(nonce === null ? {} : { nonce }),
    postConditionMode: PostConditionMode.Deny,
    postConditions
  });
  const result = await broadcastTransaction({ transaction: tx, network: 'mainnet', client: CLIENT });
  if (result.error) throw new Error(scrub(JSON.stringify(result)));

  // Booked immediately, and only after the broadcast succeeded. The next check
  // then needs no network call, and it is counting the same money the cap does.
  debitBalance(wizard.address, costUstx);
  // The one thing the chain will never know: when this was OFFERED. Written
  // before anything awaits, so the timestamp is the broadcast and not the
  // settle. See fee-log.mjs.
  recordBroadcast({ txid: result.txid, fee, rung, game, who: wizard.name });
  return { txid: result.txid, spentAfterUstx: allowed.spentAfterUstx, fee };
}

/**
 * Wait for a transaction to leave the mempool.
 *
 * THE WINDOW WAS TEN MINUTES AND THAT IS NOT LONG ENOUGH. Round 2, game 16:
 * Ledger's b2g2 was broadcast at 13:24 and mined about twenty-five minutes
 * later, having been perfectly good the whole time. The wait gave up at ten,
 * the caller threw, and that game's loop died while 17 and 18 played on. From
 * the board it looked frozen; the board was right and we were wrong.
 *
 * A SLOW CHAIN IS NOT A FAILED MOVE - the same mistake as treating a 429 as a
 * reason to stop. Our fee is not the problem either: 3,000 uSTX is exactly the
 * median confirmed contract-call fee, measured the same afternoon. Stacks was
 * simply slow.
 *
 * So the window is generous now. Waiting costs nothing but time, and time is
 * what a tournament has: the alternative is throwing away a game that was fine.
 * Progress is printed while it waits, because a silent forty-minute pause is
 * indistinguishable from a hang and that is how somebody kills a healthy run.
 */
const SETTLE_MS = 45 * 60_000;
const SETTLE_EVERY_MS = 15_000;


/**
 * Send a call, and pay more only if nobody takes it.
 *
 * Broadcasts at the bottom rung, waits, and if the transaction is still pending
 * re-signs the SAME call on the SAME nonce at the next rung. The node drops the
 * cheaper one — `dropped_replace_by_fee`, verified on this chain before this was
 * written — so exactly one of them is ever mined and exactly one fee is ever
 * paid.
 *
 * THE SAFETY GATE RUNS ON EVERY RUNG, not once at the bottom. Each broadcast is
 * a real transaction that could be mined, so each one is checked against the
 * balance floor and the spend cap at the fee it actually offers. A ladder that
 * gated only its first attempt would let the cap be exceeded by the rung that
 * finally lands.
 *
 * A replacement REFUSED is not a failure. The usual reason is that the original
 * was mined a moment earlier, which is the outcome we wanted — so it is treated
 * as "stop climbing" rather than as an error, and the settle below finds it.
 */
export async function sendClimbing({
  wizard,
  functionName,
  functionArgs,
  spendUstx,
  postConditions,
  spent,
  cap,
  rulesHash,
  label = '',
  game = null
}) {
  // Read once. Every rung reuses it, which is what makes them replacements
  // rather than a queue of separate transactions.
  const nonce = await nextNonce(wizard.address);
  let sent = null;
  let spentAfter = spent;

  for (const [rung, fee] of FEE_LADDER.entries()) {
    if (rung > 0) {
      console.log(`  ${label}fee ${FEE_LADDER[rung - 1]} did not move it — replacing at ${fee}`);
    }
    try {
      sent = await send({
        wizard,
        functionName,
        functionArgs,
        spendUstx,
        postConditions,
        spent: spentAfter,
        cap,
        rulesHash,
        fee,
        nonce,
        rung,
        game
      });
      spentAfter = sent.spentAfterUstx;
    } catch (error) {
      if (rung === 0) throw error;

      // COULD NOT REPLACE MEANS A LOWER RUNG WON, and that is the good ending —
      // but only if we then stop waiting on the transaction it beat.
      //
      // `BadNonce` says the nonce is already spent, which on a shared-nonce
      // ladder means one of the rungs below is in a block. The one we are
      // holding a receipt for is not it: it was superseded and will never
      // confirm. Falling through to the unbounded settle below therefore waits
      // for something that cannot happen.
      //
      // Round 4 did exactly that. All three games climbed 400 -> 1200 -> 3000,
      // the 3000 was refused for BadNonce, and the runner sat on the 1200 for
      // half an hour while the 400 had ALREADY LANDED and the moves were on
      // chain: d4c5, g7g5 and a4c3, all present in the log it was ignoring.
      // Every one of those txids returned 404 because it never existed.
      const why = String(error?.message ?? error);
      console.log(`  ${label}could not replace (${why.slice(0, 60)})`);
      if (/BadNonce/i.test(why)) {
        // Say so rather than guess which rung it was. The log is the record,
        // and the caller re-reads it — that is the whole resume design.
        return { ...sent, spentAfterUstx: spentAfter, status: 'superseded', nonce };
      }
      break;
    }

    const status = await settle(sent.txid, {
      maxMs: rung === FEE_LADDER.length - 1 ? undefined : FEE_BUMP_AFTER_MS
    });
    if (status === 'success') return { ...sent, spentAfterUstx: spentAfter, status, nonce };
    if (status !== 'timed out' && status !== 'pending') {
      return { ...sent, spentAfterUstx: spentAfter, status, nonce };
    }
  }

  // Out of rungs, or stopped climbing. Wait properly on whatever is out there.
  const status = await settle(sent.txid);
  return { ...sent, spentAfterUstx: spentAfter, status, nonce };
}

export async function settle(txid, { maxMs = SETTLE_MS, everyMs = SETTLE_EVERY_MS } = {}) {
  const until = Date.now() + maxMs;
  const started = Date.now();
  let said = 0;
  while (Date.now() < until) {
    await new Promise((done) => setTimeout(done, everyMs));
    try {
      const body = await api(`/extended/v1/tx/0x${txid.replace(/^0x/, '')}`);
      if (body.tx_status === 'success') return 'success';
      if (body.tx_status && body.tx_status !== 'pending') return body.tx_status;
    } catch {
      // Not indexed yet. Asking again is the whole strategy.
    }
    const waited = Math.floor((Date.now() - started) / 60_000);
    if (waited >= 5 && waited > said) {
      said = waited;
      console.log(`  (still waiting on ${txid.slice(0, 10)}…, ${waited}m — the chain is slow, not stuck)`);
    }
  }
  return 'timed out';
}

async function balances(fleet) {
  console.log('');
  for (const wizard of fleet.wizards) {
    if (!wizard.address) {
      console.log(`${wizard.name.padEnd(10)} not provisioned`);
      continue;
    }
    // Per row, because one wallet that cannot be read is not a reason to stop
    // reporting the other three - and the row that failed is the one you most
    // want to see when a transfer has just gone out to it.
    try {
      const held = await balanceOf(wizard.address);
      console.log(`${wizard.name.padEnd(10)} ${wizard.address}  ${ustx(held)}`);
    } catch (error) {
      console.log(`${wizard.name.padEnd(10)} ${wizard.address}  unread: ${scrub(error.message)}`);
      process.exitCode = 1;
    }
  }
  console.log(
    HIRO_KEYS.length ? '\n(reads are keyed)' : '\n(reads are anonymous — about 50 a minute)'
  );
  console.log('');
}

/**
 * Send every float home.
 *
 * The way out. These are raw keys with no seed phrase, so a wizard cannot be
 * imported into Xverse or Leather to be emptied by hand — this is the same key
 * signing a transfer instead.
 *
 * Its own guard rather than the contract gate: a transfer is not a contract
 * call, so the function allow-list does not apply and the things worth checking
 * are different. Live, a real mainnet destination, and enough left to pay the
 * fee.
 */
async function sweep(fleet, to) {
  if (!looksLikeMainnetAddress(to)) {
    throw new WizardSafetyError(`--to ${to} is not a mainnet address`);
  }
  const fee = 3_000n;
  const fleetAddresses = fleet.wizards.map((w) => w.address).filter(Boolean);
  for (const wizard of fleet.wizards) {
    if (wizard.address === to) continue;
    if (!wizard.key) {
      console.log(`${wizard.name.padEnd(10)} not provisioned`);
      continue;
    }
    const balance = await balanceOf(wizard.address);
    const amount = balance - fee;
    if (amount <= 0n) {
      console.log(`${wizard.name.padEnd(10)} ${ustx(balance)} — nothing to send after the fee`);
      continue;
    }
    if (!LIVE) {
      console.log(`${wizard.name.padEnd(10)} would send ${ustx(amount)} to ${to}`);
      continue;
    }
    // `sweeping` is what lets this leave the fleet at all. Everything else the
    // Director does is confined to addresses it already knows.
    assertTransferAllowed({
      live: LIVE,
      from: wizard.address,
      to,
      amountUstx: amount,
      balanceUstx: balance,
      fleetAddresses,
      balanceFloorUstx: 0n,
      sweeping: true
    });
    const tx = await makeSTXTokenTransfer({
      recipient: to,
      amount,
      senderKey: wizard.key,
      network: 'mainnet',
      client: CLIENT,
      fee
    });
    const result = await broadcastTransaction({ transaction: tx, network: 'mainnet', client: CLIENT });
    if (result.error) {
      console.log(`${wizard.name.padEnd(10)} FAILED: ${scrub(JSON.stringify(result))}`);
      process.exitCode = 1;
      continue;
    }
    console.log(`${wizard.name.padEnd(10)} sent ${ustx(amount)} — ${result.txid}`);
  }
}

/**
 * The Director tops the players up.
 *
 * To a TARGET rather than by an amount, so running it twice costs nothing: a
 * wizard already at its float is skipped rather than doubled. That matters for
 * something meant to run unattended - the safe thing to do when unsure is to run
 * it again.
 */
async function fund(fleet) {
  const director = fleet.wizards.find((w) => w.id === DIRECTOR.id);
  if (!director?.key) {
    console.log('\nNo Director. Generate the fleet and fund it first.\n');
    process.exitCode = 1;
    return;
  }

  const balances = {};
  for (const wizard of fleet.wizards) {
    if (wizard.address) balances[wizard.address] = await balanceOf(wizard.address);
  }
  const held = balances[director.address] ?? 0n;
  const plan = planFunding({ fleet, balances });
  const fleetAddresses = fleet.wizards.map((w) => w.address).filter(Boolean);

  console.log(`\nDirector holds ${ustx(held)}`);
  if (!plan.transfers.length) {
    console.log(`Every player is at its float of ${ustx(TARGET_FLOAT_USTX)}. Nothing to do.\n`);
    return;
  }
  for (const transfer of plan.transfers) {
    console.log(
      `  ${transfer.who.padEnd(10)} holds ${ustx(transfer.heldUstx)} -> send ${ustx(transfer.amountUstx)}`
    );
  }
  console.log(`\n  total   ${ustx(plan.totalUstx)}`);

  if (!LIVE) {
    console.log('\nDry run. Nothing was signed. Add --live to send.\n');
    return;
  }
  if (held < plan.totalUstx) {
    console.log(`\nThe Director cannot cover that. Send it more, or lower the float.\n`);
    process.exitCode = 1;
    return;
  }

  const fee = 3_000n;
  let balance = held;
  // Read ONCE and counted up by hand. Asking again between transfers returns the
  // same answer until the first is mined, which is the whole fault.
  let nonce = await nextNonce(director.address);
  for (const transfer of plan.transfers) {
    assertTransferAllowed({
      live: LIVE,
      from: director.address,
      to: transfer.to,
      amountUstx: transfer.amountUstx,
      balanceUstx: balance,
      fleetAddresses
    });
    const tx = await makeSTXTokenTransfer({
      recipient: transfer.to,
      amount: transfer.amountUstx,
      senderKey: director.key,
      network: 'mainnet',
      client: CLIENT,
      fee,
      nonce
    });
    const result = await broadcastTransaction({ transaction: tx, network: 'mainnet', client: CLIENT });
    if (result.error) {
      console.log(`  ${transfer.who} FAILED: ${scrub(JSON.stringify(result))}`);
      process.exitCode = 1;
      return;
    }
    balance -= transfer.amountUstx + fee;
    console.log(`  ${transfer.who.padEnd(10)} sent — ${result.txid}  (nonce ${nonce})`);
    nonce += 1n;
  }
  console.log('\nWait for these to confirm, then: node harness/wizards/play.mjs --live\n');
}

async function main() {
  const env = { ...readEnvFile(), ...process.env };
  // `--characters` widens the fleet to the six tournament characters, so
  // `balances` and `fund` cover them. Off by default: a plain run should not
  // report six wallets as missing on a fleet nobody has extended yet.
  const fleet = readFleet(env, { characters: process.argv.includes('--characters') });
  const command = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'play';

  console.log(`\nX Chess wizards — ${LIVE ? 'LIVE, spending real STX' : 'dry run, nothing is sent'}`);
  console.log(`contract  ${ALLOWED_CONTRACT}`);

  if (!fleet.ready) {
    console.log(`\nNot provisioned: ${fleet.missing.join(', ')}.`);
    console.log('Generate with: node harness/wizards/make-wizards.mjs');
    console.log('Then paste the block into harness/wizards/.env.wizards and fund each wallet.\n');
    if (LIVE) process.exitCode = 1;
  }

  if (command === 'balances') {
    if (!fleet.ready) return;
    await balances(fleet);
    return;
  }

  if (command === 'fund') {
    await fund(fleet);
    return;
  }

  if (command === 'sweep') {
    // Home to the Director by default: the players' floats belong in the one
    // wallet you already fund. --to is for taking money OUT of the fleet, which
    // is the one transfer that leaves it, and it has to be typed.
    const director = fleet.wizards.find((w) => w.id === DIRECTOR.id);
    const to = arg('to') ?? director?.address ?? null;
    if (!to) {
      console.log('\nsweep needs somewhere to send it: --to SP...\n');
      process.exitCode = 1;
      return;
    }
    console.log(`\n${LIVE ? 'Sending' : 'Would send'} every float to ${to}\n`);
    await sweep(fleet, to);
    console.log('');
    return;
  }

  // Read from the chain whenever the chain will answer, and clearly labelled as
  // a guess when it will not. Saying "read from the contract" over a constant is
  // the kind of small untruth that makes every other line suspect.
  //
  // This used to be gated on having a provisioned fleet, which was wrong twice:
  // `get-open-fee` is a read-only call and needs no key at all, and the fee is
  // an owner-settable var - so the constant here is not a fact, it is whatever
  // the fee happened to be when somebody typed it. A dry run with no .env would
  // quote that number forever, including after the fee had changed.
  let openFee = 1_000_000n;
  let priced = false;
  try {
    openFee = await readOpenFee();
    priced = true;
  } catch {
    // Left as the last known default, and said out loud below.
  }
  // A resumed run does not open anything, so it must not quote an open fee. The
  // first resume printed "total 1.015 STX" and then spent 0.010 - a plan that
  // disagrees with the spend is a plan nobody can check the cap against.
  const resuming = Boolean(arg('game'));
  const plan = planRun({ fleet, openFeeUstx: openFee, resuming, plan: arg('plan') });
  const cap = BigInt(arg('spend-cap-ustx', String(DEFAULT_SPEND_CAP_USTX)));

  console.log(
    `open fee  ${ustx(openFee)}   ` +
      (priced ? '(read from the contract)' : '(ASSUMED - the contract would not answer)')
  );
  console.log(`spend cap ${ustx(cap)}`);
  console.log(`game plan ${plan.plan} — ${plan.proves}`);
  if (PACE_MS > 0) console.log(`pace      ${PACE_MS / 1000}s between moves`);
  console.log('');
  for (const step of plan.steps) {
    console.log(
      `  ${String(step.act).padEnd(8)} ${(step.who?.name ?? '?').padEnd(10)} ` +
        `${ustx(step.spendUstx).padStart(12)}   ${step.what}`
    );
  }
  console.log(`\n  total    ${ustx(plan.totalUstx)}`);

  if (plan.totalUstx > cap) {
    console.log(`\nThat is over the cap. Raise it with --spend-cap-ustx, or shorten the run.`);
    process.exitCode = 1;
    return;
  }

  if (!LIVE) {
    console.log('\nDry run. Nothing was signed and nothing was sent.');
    console.log('Add --live to broadcast. Every act above is real and none of it can be undone.\n');
    return;
  }
  if (!fleet.ready) return;

  // ---- from here everything is real -----------------------------------

  let spent = 0n;
  const white = fleet.wizards.find((w) => w.id === 'wizard-1');
  const black = fleet.wizards.find((w) => w.id === 'wizard-2');

  // RESUME, rather than pay to start again.
  //
  // A run that dies partway has already spent the open fee, and the moves it
  // managed are on chain forever. Starting over costs another open fee to prove
  // the same thing twice - so `--game 10` skips the open, reads how far that
  // game got, and plays only what is missing. The first live run died after two
  // moves and this is what it cost to learn that.
  const resume = arg('game') ? Number(arg('game')) : null;
  let game = resume;

  if (resume) {
    const row = await readOnly('get-game', [Cl.serialize(Cl.uint(resume))]);
    if (!row?.value) {
      console.log(`\nThere is no game ${resume}.`);
      process.exitCode = 1;
      return;
    }
    console.log(`\nResuming game ${resume} rather than opening another.`);
  } else {
  console.log(`\nOpening a game: ${white.address} v ${black.address}`);
  const { rules, hash } = await wizardRules(white.address, black.address);
  console.log(`  rules  ${hash}`);
  console.log(`         white ${rules.white}`);
  console.log(`         black ${rules.black}   ranked ${rules.ranked}`);

  const opened = await send({
    wizard: white,
    functionName: 'open-game',
    functionArgs: [Cl.some(Cl.bufferFromHex(hash)), Cl.bool(rules.ranked)],
    rulesHash: hash,
    spendUstx: BigInt(openFee) + MINER_FEE_USTX,
    postConditions: [Pc.principal(white.address).willSendLte(openFee).ustx()],
    spent,
    cap
  });
  spent = opened.spentAfterUstx;
  console.log(`  txid ${opened.txid}`);
  const settled = await settle(opened.txid);
  if (settled !== 'success') {
    console.log(`  the open did not land: ${settled}`);
    process.exitCode = 1;
    return;
  }

  game = Number((await readOnly('get-game-count')).value);
  console.log(`  game ${game}`);
  }

  // How far it already got, so a resumed run plays only what is missing and a
  // fresh one plays everything.
  const played = Number((await readOnly('get-game', [Cl.serialize(Cl.uint(game))])).value.value['next-seq'].value);
  if (played > 0) console.log(`  ${played} submission(s) already on it`);

  for (const [at, move] of plan.moves.entries()) {
    if (at < played) continue;
    const wizard = fleet.wizards.find((w) => w.id === move.by);
    console.log(`\n${wizard.name}: ${move.move}${move.note ? ` — ${move.note}` : ''}`);
    // Watchable pacing. A run that blasts every move into the mempool at once
    // is a run nobody can follow, and on a long plan it is also the fastest way
    // to be rate limited. Zero by default, so the fleet's own tests stay quick.
    if (at > played && PACE_MS > 0) await sleep(PACE_MS);
    const sent = await send({
      wizard,
      functionName: 'submit',
      functionArgs: [Cl.uint(game), Cl.stringAscii(move.move)],
      spendUstx: 5_000n,
      // NOTHING MOVES. With no sponsorship the contract pays nobody, so deny
      // mode with no conditions is both the truth and the strongest claim
      // available — and it is the same claim the board now makes.
      postConditions: [],
      spent,
      cap
    });
    spent = sent.spentAfterUstx;
    console.log(`  txid ${sent.txid}`);
    const landed = await settle(sent.txid);
    console.log(`  ${landed}`);
    if (landed !== 'success') {
      process.exitCode = 1;
      return;
    }
  }

  console.log(`\nDone. Spent ${ustx(spent)} of a ${ustx(cap)} cap.`);
  console.log(`Read it back: https://xtrata.xyz/i/2988?game=${game}`);
  console.log('Two independent signers, one checkmate, derived rather than recorded.\n');
}

if (Boolean(process.argv[1]) && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main().catch((error) => {
    // By name as well as by class. A refusal raised in a module that cannot
    // import the class without a cycle is still a refusal, and printing a stack
    // trace over a sentence somebody wrote for this exact moment helps nobody.
    const refusal =
      error instanceof WizardSafetyError || error?.name === 'WizardSafetyError';
    console.error(`\n${refusal ? error.message : scrub(error?.stack ?? error)}`);
    process.exitCode = 1;
  });
}
