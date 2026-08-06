#!/usr/bin/env node
/**
 * market-run.mjs — scenarios 2 to 10 of the wizard test plan: the market half.
 *
 * DRY RUN BY DEFAULT. With no flags it runs every scenario against a fake
 * market inside this process: no key is read, nothing is signed, nothing is
 * sent, and no request leaves the process. `--broadcast` is the only thing that
 * spends.
 *
 * Scenario 1 is `run-thread.mjs` — inscribe. This is what happens next: list,
 * buy, cancel, relist, settle, and fail legibly where a wizard holds none of
 * the payment token.
 *
 *   # every scenario against fakes, with a pass/fail/skip table
 *   node scripts/wizard/market-run.mjs --all --dry
 *
 *   # one scenario, by name
 *   node scripts/wizard/market-run.mjs --scenario cancel --listing-id 12 --market usdcx --dry
 *
 *   # really do it (real mainnet transactions, real STX, irreversible)
 *   node scripts/wizard/market-run.mjs --all --run m-2026-07-31 \
 *     --tokens 2922,2923,2924,2925 --broadcast
 *
 * Only the three sponsored markets can take a v3-2-3 inscription; the rest
 * hardcode the retired core and refuse at list-token. That is asserted live
 * against `is-nft-allowed` before anything is signed, not assumed.
 *
 * See scripts/wizard/README.md.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { sha256 } from '@noble/hashes/sha256';
import {
  AnchorMode,
  PostConditionMode,
  TransactionVersion,
  boolCV,
  broadcastTransaction,
  contractPrincipalCV,
  cvToHex,
  cvToJSON,
  getAddressFromPrivateKey,
  hexToCV,
  makeContractCall,
  noneCV,
  responseErrorCV,
  responseOkCV,
  someCV,
  standardPrincipalCV,
  tupleCV,
  uintCV
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';

import {
  CORE_CONTRACT,
  DEFAULT_BALANCE_FLOOR_USTX,
  DEFAULT_HIRO_URL,
  DEFAULT_MAX_TX_FEE_USTX,
  WizardSafetyError,
  expectedWizardAddresses,
  groupDigits,
  killSwitchEngaged,
  loadWizardEnv,
  toHex
} from './inscribe.mjs';
import { PERSONA_IDS } from './personas.mjs';
import {
  DEFAULT_CONFIRM_POLL_MS,
  DEFAULT_CONFIRM_TIMEOUT_MS,
  DEFAULT_MARKET_RUN_SPEND_CAP_USTX,
  DEFAULT_MEMPOOL_POLL_MS,
  DEFAULT_MEMPOOL_WAIT_MS,
  DEFAULT_PRICE_USTX,
  DEFAULT_RELIST_PRICE_USTX,
  DEFAULT_SPONSOR_BASE,
  MARKETS,
  MARKET_KEYS,
  MIN_FEE_BUDGET_USTX,
  SCENARIOS,
  SCENARIO_IDS,
  formatMarketPlan,
  formatScenarioTable,
  getMarket,
  runMarketScenarios
} from './market-run-core.mjs';

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

/**
 * Which scenarios to run. `--all` is the whole plan in order; `--scenario` may
 * be repeated or comma-separated. Neither defaults to the other: a bare run
 * with no selection is `--all`, because the useful default for a test harness
 * is "check everything".
 */
export function selectScenarios({ all = false, scenarios = [] } = {}) {
  const requested = scenarios.flatMap((value) => csv(value));
  if (all || requested.length === 0) return SCENARIO_IDS.slice();
  const unknown = requested.filter((id) => !SCENARIO_IDS.includes(id));
  if (unknown.length > 0) {
    throw new WizardSafetyError(
      `unknown scenario${unknown.length > 1 ? 's' : ''} ${unknown.join(', ')}. Known: ${SCENARIO_IDS.join(', ')}`
    );
  }
  return SCENARIO_IDS.filter((id) => requested.includes(id));
}

/** The listing scenarios that need an inscription of their own, in order. */
export const TOKEN_SLOTS = ['list-stx', 'list-sbtc', 'list-usdcx', 'buy-sponsored'];

/**
 * Which inscription each listing scenario uses.
 *
 * `--tokens a,b,c,d` fills the slots in order; `--token-<slot>` overrides one.
 * A dry run falls back to synthetic ids seeded into the fake chain, and says so
 * out loud, for the same reason the thread runner does: a rehearsal that looks
 * like the real thing is worse than one that admits what it is.
 */
export function resolveTokens({ list = [], overrides = {}, fallback = null }) {
  const tokens = {};
  for (const [index, slot] of TOKEN_SLOTS.entries()) {
    const chosen = overrides[slot] ?? list[index] ?? (fallback ? fallback(index, slot) : null);
    if (chosen) tokens[slot] = String(chosen);
  }
  return tokens;
}

/* ------------------------------------------------------------------ */
/* the real ports                                                      */
/* ------------------------------------------------------------------ */

const journalPorts = () => ({
  readJournal: (path) => (existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null),
  writeJournal: (path, journal) => writeFileSync(path, `${JSON.stringify(journal, null, 2)}\n`, 'utf8')
});

/**
 * The one port that spends.
 *
 * Deny mode always, and the post-conditions come from the core's `buildMarketCall`
 * rather than being assembled here, so the bound printed in the plan is the
 * bound the transaction carries. It refuses unless the caller passes
 * broadcast: true, so a dry run that somehow reached the live port sends nothing.
 */
const liveSubmit = ({ hiroUrl }) =>
  async function submit({ call, broadcast, senderKey, minerFeeUstx }) {
    if (broadcast !== true) {
      throw new WizardSafetyError('the live submit port was called without broadcast: true. Nothing was signed.');
    }
    const network = new StacksMainnet({ url: hiroUrl });
    const tx = await makeContractCall({
      contractAddress: call.contractAddress,
      contractName: call.contractName,
      functionName: call.functionName,
      functionArgs: call.functionArgs,
      senderKey,
      network,
      fee: BigInt(minerFeeUstx),
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Deny,
      postConditions: call.postConditions
    });
    const result = await broadcastTransaction(tx, network);
    if (result.error) throw new Error(`${result.error}${result.reason ? ` (${result.reason})` : ''}`);
    return { txid: result.txid };
  };

/**
 * Sign a sponsored `buy` at fee 0 and hand back the hex, without broadcasting.
 *
 * This is the buyer's half of a sponsored purchase: the origin signs with an
 * explicit nonce and a zero fee, the relayer attaches its own signature and
 * pays. Nothing here reaches the network — the transaction is built, signed and
 * returned, and only the relayer can turn it into a broadcast.
 */
const liveSignSponsored = ({ hiroUrl }) =>
  async function signSponsored({ call, broadcast, senderKey, nonce }) {
    if (broadcast !== true) {
      throw new WizardSafetyError('the live sponsored signer was called without broadcast: true. Nothing was signed.');
    }
    if (nonce === null || nonce === undefined) {
      throw new WizardSafetyError('a sponsored transaction needs an explicit nonce; the wallet never sees one to pick.');
    }
    const tx = await makeContractCall({
      contractAddress: call.contractAddress,
      contractName: call.contractName,
      functionName: call.functionName,
      functionArgs: call.functionArgs,
      senderKey,
      network: new StacksMainnet({ url: hiroUrl }),
      fee: 0n,
      nonce: BigInt(nonce),
      sponsored: true,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Deny,
      postConditions: call.postConditions
    });
    return { txHex: tx.serialize().toString('hex') };
  };

/**
 * The relayer, over HTTP. Same three endpoints the market page uses.
 *
 * Every failure is thrown, and the sponsored scenario turns a throw into a
 * SKIP: the relayer is separate infrastructure, and a wizard run that went red
 * because someone restarted it would train everyone to ignore a red run.
 */
export function createSponsorPort({ base = DEFAULT_SPONSOR_BASE, fetchImpl = globalThis.fetch } = {}) {
  const root = String(base).replace(/\/+$/, '');
  const request = async (path, init) => {
    let response;
    try {
      response = await fetchImpl(`${root}${path}`, init);
    } catch (error) {
      throw new Error(`sponsor relayer unreachable: ${error instanceof Error ? error.message : String(error)}`);
    }
    let body = {};
    try {
      body = await response.json();
    } catch {
      // handled below
    }
    if (!response.ok) {
      throw new Error(body?.message ?? body?.error ?? `relayer returned HTTP ${response.status}`);
    }
    return body;
  };
  return {
    async quote() {
      const body = await request('/sponsor/quote', { method: 'POST' });
      return {
        estimatedFeeUstx: BigInt(body.estimatedFeeUstx ?? 0),
        budgetUstx: BigInt(body.budgetUstx ?? 0),
        minBudgetUstx: BigInt(body.minBudgetUstx ?? 0),
        expiresAt: Number(body.expiresAt ?? 0)
      };
    },
    async submit({ txHex, contractId, listingId }) {
      return request('/sponsor/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ txHex, contractId, listingId: String(listingId) })
      });
    },
    async status(jobId) {
      return request(`/sponsor/status/${encodeURIComponent(String(jobId))}`);
    }
  };
}

/* ------------------------------------------------------------------ */
/* the fake market, for --dry                                          */
/* ------------------------------------------------------------------ */

/** Obviously-not-a-key placeholders. Dry mode never reads a real key. */
const dryKeyFor = (index) => String(index + 1).padStart(64, '0');

const hexTxid = (seed) => toHex(sha256(new Uint8Array(Buffer.from(String(seed), 'utf8')))).slice(2);

/**
 * A market that exists only in this process.
 *
 * It implements the sponsored contracts' real semantics rather than a happy
 * path: the same error codes, the same escrow, `buy` keeping the row and
 * marking it sold, `cancel` deleting it and returning the whole budget,
 * `settle-refund` gated on REFUND-DELAY. That fidelity is the point — the dry
 * run and the tests are only worth anything if the fake refuses what the
 * contract refuses.
 */
export function makeFakeMarket({ tip = 8_700_000, minerFeeUstx = DEFAULT_MAX_TX_FEE_USTX, blocksPerTx = 1 } = {}) {
  const owners = new Map();
  const stx = new Map();
  const tokens = new Map();
  const nonces = new Map();
  const transactions = new Map();
  const markets = new Map();
  const allowed = new Map();
  let height = BigInt(tip);
  let counter = 0;

  for (const market of MARKETS) {
    markets.set(market.contractId, { listings: new Map(), byToken: new Map(), nextId: 0n, feeBps: 0n, claimed: new Map() });
    allowed.set(market.contractId, new Set([CORE_CONTRACT]));
    stx.set(market.contractId, 0n);
  }

  const balanceOf = (address) => stx.get(address) ?? 0n;
  const move = (from, to, amount) => {
    stx.set(from, balanceOf(from) - amount);
    stx.set(to, balanceOf(to) + amount);
  };
  const tokenBalance = (contractId, address) => tokens.get(contractId)?.get(address) ?? 0n;
  const nonceOf = (address) =>
    nonces.get(address) ?? {
      last_executed_tx_nonce: -1,
      possible_next_nonce: 0,
      last_mempool_tx_nonce: null,
      detected_missing_nonces: [],
      detected_mempool_nonces: []
    };

  const chain = {
    get tip() {
      return height;
    },
    owners,
    stx,
    tokens,
    nonces,
    transactions,
    markets,
    allowed,
    minerFeeUstx: BigInt(minerFeeUstx),
    blocksPerTx: Math.max(1, Number(blocksPerTx) || 1),
    advance: (blocks) => {
      height += BigInt(blocks);
      return height;
    },
    fund: (address, amount) => stx.set(address, balanceOf(address) + BigInt(amount)),
    fundToken: (contractId, address, amount) => {
      if (!tokens.has(contractId)) tokens.set(contractId, new Map());
      tokens.get(contractId).set(address, tokenBalance(contractId, address) + BigInt(amount));
    },
    mint: (tokenId, owner) => owners.set(String(tokenId), owner),
    balanceOf,
    tokenBalance,
    nonceOf,
    listingOf: (contractId, listingId) => markets.get(contractId)?.listings.get(String(listingId)) ?? null,
    setAllowed: (contractId, nftContract, isAllowed) => {
      const set = allowed.get(contractId);
      if (isAllowed) set.add(nftContract);
      else set.delete(nftContract);
    },

    /**
     * Apply one call as the contract would, and record a transaction for it.
     * `failWith` lets a test force an abort that the fake's own rules would not
     * produce, which is how "a silent success where a failure was expected" is
     * made testable.
     */
    apply({ contractId, functionName, args, sender, feeUstx = chain.minerFeeUstx, failWith = null }) {
      counter += 1;
      const nonce = nonceOf(sender);
      const txid = `0x${hexTxid(`${sender}:${contractId}:${functionName}:${counter}`)}`;
      const finish = (ok, value, repr) => {
        // A miner fee is paid whether the call succeeds or aborts.
        stx.set(sender, balanceOf(sender) - BigInt(feeUstx));
        nonces.set(sender, {
          ...nonce,
          last_executed_tx_nonce: (nonce.last_executed_tx_nonce ?? -1) + 1,
          possible_next_nonce: (nonce.last_executed_tx_nonce ?? -1) + 2
        });
        transactions.set(txid.toLowerCase(), {
          tx_status: ok ? 'success' : 'abort_by_response',
          tx_result: { hex: cvToHex(ok ? responseOkCV(value) : responseErrorCV(value)), repr },
          block_height: ok ? Number(height) + 1 : null,
          fee_rate: String(feeUstx)
        });
        // One block per transaction by default. `--blocks-per-tx` widens it so a
        // rehearsal can reach the far side of REFUND-DELAY and exercise the
        // settlement scenario, which on mainnet takes about a day.
        height += BigInt(chain.blocksPerTx);
        return { txid, ok };
      };
      const abort = (code) => finish(false, uintCV(BigInt(code)), `(err u${code})`);
      if (failWith !== null) return abort(failWith);

      const state = markets.get(contractId);
      if (!state) throw new WizardSafetyError(`the fake market has no contract ${contractId}`);
      const market = getMarket(contractId);

      if (functionName === 'list-token') {
        const [nftContract, tokenId, price, budget] = args;
        if (!allowed.get(contractId).has(nftContract)) return abort(100);
        if (price <= 0n) return abort(103);
        if (budget < MIN_FEE_BUDGET_USTX) return abort(105);
        const tokenKey = `${nftContract}#${tokenId}`;
        if (state.byToken.has(tokenKey)) return abort(102);
        if (owners.get(String(tokenId)) !== sender) return abort(100);
        if (balanceOf(sender) < budget + BigInt(feeUstx)) return abort(1);
        owners.set(String(tokenId), contractId);
        move(sender, contractId, budget);
        const listingId = String(state.nextId);
        state.listings.set(listingId, {
          seller: sender,
          nftContract,
          tokenId: BigInt(tokenId),
          price: BigInt(price),
          createdAt: height,
          feeBudget: BigInt(budget),
          budgetRemaining: BigInt(budget),
          claimed: 0n,
          buyer: null,
          soldAt: null
        });
        state.byToken.set(tokenKey, listingId);
        state.nextId += 1n;
        return finish(true, uintCV(BigInt(listingId)), `(ok u${listingId})`);
      }

      if (functionName === 'buy') {
        const [nftContract, listingId] = args;
        const listing = state.listings.get(String(listingId));
        if (!listing) return abort(101);
        if (!allowed.get(contractId).has(listing.nftContract)) return abort(100);
        if (nftContract !== listing.nftContract) return abort(101);
        if (listing.soldAt !== null) return abort(106);
        const fee = (listing.price * state.feeBps) / 10_000n;
        const toSeller = listing.price - fee;
        if (market.payment.kind === 'stx') {
          if (balanceOf(sender) < listing.price + BigInt(feeUstx)) return abort(1);
          move(sender, listing.seller, toSeller);
          if (fee > 0n) move(sender, MARKETS[0].address, fee);
        } else {
          // The cross-currency leg, and the one scenario 8 is about: a wallet
          // with no balance gets the token contract's own insufficient-funds
          // error, not a market refusal.
          if (tokenBalance(market.payment.contractId, sender) < listing.price) return abort(1);
          const ledger = tokens.get(market.payment.contractId);
          ledger.set(sender, ledger.get(sender) - listing.price);
          ledger.set(listing.seller, (ledger.get(listing.seller) ?? 0n) + toSeller);
        }
        owners.set(String(listing.tokenId), sender);
        listing.buyer = sender;
        listing.soldAt = height;
        state.byToken.delete(`${listing.nftContract}#${listing.tokenId}`);
        return finish(true, boolCV(true), '(ok true)');
      }

      if (functionName === 'cancel') {
        const [nftContract, listingId] = args;
        const listing = state.listings.get(String(listingId));
        if (!listing) return abort(101);
        if (nftContract !== listing.nftContract) return abort(101);
        if (listing.seller !== sender) return abort(100);
        if (listing.soldAt !== null) return abort(106);
        owners.set(String(listing.tokenId), listing.seller);
        if (listing.budgetRemaining > 0n) move(contractId, listing.seller, listing.budgetRemaining);
        state.listings.delete(String(listingId));
        state.byToken.delete(`${listing.nftContract}#${listing.tokenId}`);
        return finish(true, boolCV(true), '(ok true)');
      }

      if (functionName === 'claim-fee') {
        const [listingId, amount] = args;
        const listing = state.listings.get(String(listingId));
        if (!listing) return abort(101);
        if (listing.soldAt === null) return abort(107);
        if (amount <= 0n || amount > listing.budgetRemaining) return abort(108);
        move(contractId, sender, BigInt(amount));
        listing.budgetRemaining -= BigInt(amount);
        listing.claimed += BigInt(amount);
        return finish(true, boolCV(true), '(ok true)');
      }

      if (functionName === 'settle-refund') {
        const [listingId] = args;
        const listing = state.listings.get(String(listingId));
        if (!listing) return abort(101);
        if (listing.soldAt === null) return abort(107);
        // Seller self-settle is locked for REFUND-DELAY blocks. The sponsor is
        // not modelled as a wizard, so a seller before the delay is u109.
        if (listing.seller === sender && height < listing.soldAt + 144n) return abort(109);
        if (listing.budgetRemaining > 0n) move(contractId, listing.seller, listing.budgetRemaining);
        state.listings.delete(String(listingId));
        return finish(true, boolCV(true), '(ok true)');
      }

      throw new WizardSafetyError(`the fake market does not implement ${functionName}`);
    }
  };
  return chain;
}

/**
 * Decode the Clarity arguments of a read or a call into plain JS.
 *
 * Exported because the tests drive the fake market directly and must encode and
 * decode through exactly the same path the runner does. A test that hand-built
 * its arguments would agree with itself and with nothing else.
 */
export const decodeArgs = (hexes = []) =>
  hexes.map((hex) => {
    const json = cvToJSON(hexToCV(hex));
    if (json.type === 'uint') return BigInt(json.value);
    if (json.type === 'bool') return json.value === true;
    return json.value;
  });

/**
 * A fetch that answers from the fake market and refuses everything else.
 *
 * The refusal is the point: if a dry run ever reaches a real endpoint — and
 * above all `/v2/transactions`, the broadcast endpoint — this throws rather
 * than quietly talking to mainnet. Arguments are decoded with the real Clarity
 * decoder, so a fake that disagrees with the encoder shows up here rather than
 * three steps later as an inexplicable `none`.
 */
export function fakeMarketFetch(chain) {
  const json = (body) => Response.json(body);
  const clarity = (cv) => json({ okay: true, result: cvToHex(cv) });
  const listingTuple = (listing) =>
    tupleCV({
      seller: standardPrincipalCV(listing.seller),
      'nft-contract': contractPrincipalCV(...String(listing.nftContract).split('.')),
      'token-id': uintCV(listing.tokenId),
      price: uintCV(listing.price),
      'created-at': uintCV(listing.createdAt),
      'fee-budget': uintCV(listing.feeBudget),
      'budget-remaining': uintCV(listing.budgetRemaining),
      claimed: uintCV(listing.claimed),
      buyer: listing.buyer ? someCV(standardPrincipalCV(listing.buyer)) : noneCV(),
      'sold-at': listing.soldAt === null ? noneCV() : someCV(uintCV(listing.soldAt))
    });

  return async (input, init) => {
    const url = String(input);
    if (/\/v2\/transactions\b/.test(url)) {
      throw new WizardSafetyError(`the dry run tried to BROADCAST to ${url}. A dry run sends nothing.`);
    }
    const body = init?.body ? JSON.parse(String(init.body)) : null;

    const read = /\/v2\/contracts\/call-read\/([^/]+)\/([^/]+)\/([^/?]+)/.exec(url);
    if (read) {
      const [, address, name, fn] = read;
      const contractId = `${address}.${name}`;
      const args = decodeArgs(body?.arguments ?? []);
      const state = chain.markets.get(contractId);

      if (contractId === CORE_CONTRACT && fn === 'get-owner') {
        const owner = chain.owners.get(String(args[0]));
        return clarity(
          responseOkCV(
            owner ? someCV(owner.includes('.') ? contractPrincipalCV(...owner.split('.')) : standardPrincipalCV(owner)) : noneCV()
          )
        );
      }
      if (fn === 'get-balance') {
        return clarity(responseOkCV(uintCV(chain.tokenBalance(contractId, String(args[0])))));
      }
      if (state) {
        if (fn === 'is-nft-allowed') return clarity(responseOkCV(boolCV(chain.allowed.get(contractId).has(String(args[0])))));
        if (fn === 'get-fee-bps') return clarity(responseOkCV(uintCV(state.feeBps)));
        if (fn === 'get-min-fee-budget') return clarity(responseOkCV(uintCV(MIN_FEE_BUDGET_USTX)));
        if (fn === 'get-refund-delay') return clarity(responseOkCV(uintCV(144n)));
        if (fn === 'get-last-listing-id') return clarity(responseOkCV(uintCV(state.nextId > 0n ? state.nextId - 1n : 0n)));
        if (fn === 'get-listing') {
          const listing = state.listings.get(String(args[0]));
          return clarity(listing ? someCV(listingTuple(listing)) : noneCV());
        }
        if (fn === 'get-listing-id-by-token') {
          const id = state.byToken.get(`${args[0]}#${args[1]}`);
          return clarity(id === undefined ? noneCV() : someCV(uintCV(BigInt(id))));
        }
      }
      throw new WizardSafetyError(`the dry run tried to read ${fn} on ${contractId}, which the fake does not serve.`);
    }

    const balance = /\/extended\/v2\/addresses\/([^/]+)\/balances\/stx/.exec(url);
    if (balance) return json({ balance: String(chain.balanceOf(balance[1])) });

    const nonce = /\/extended\/v1\/address\/([^/]+)\/nonces/.exec(url);
    if (nonce) return json(chain.nonceOf(nonce[1]));

    if (url.includes('/extended/v2/blocks')) return json({ results: [{ height: Number(chain.tip) }] });

    const tx = /\/extended\/v1\/tx\/(0x[0-9a-f]{64})/i.exec(url);
    if (tx) {
      const found = chain.transactions.get(tx[1].toLowerCase());
      return found ? json(found) : new Response('not found', { status: 404 });
    }
    throw new WizardSafetyError(`the dry run tried to reach ${url}. A dry run talks to nothing.`);
  };
}

/**
 * A relayer that exists only in this process.
 *
 * It does what the real one does — accepts a fee-0 signature, broadcasts the
 * buy on the buyer's behalf, reimburses itself from the escrowed budget, then
 * refunds the dust and closes the listing — because a fake that only did the
 * buy would leave scenario 6 unable to show that a sponsored sale settles.
 */
export function makeFakeSponsor({ chain, available = true, refuse = null, estimatedFeeUstx = 30_000n } = {}) {
  const jobs = new Map();
  let counter = 0;
  return {
    calls: [],
    async quote() {
      this.calls.push('quote');
      if (!available) throw new Error('sponsor relayer unreachable');
      return {
        estimatedFeeUstx: BigInt(estimatedFeeUstx),
        budgetUstx: MIN_FEE_BUDGET_USTX,
        minBudgetUstx: MIN_FEE_BUDGET_USTX,
        expiresAt: Date.now() + 300_000
      };
    },
    async submit({ txHex, contractId, listingId }) {
      this.calls.push('submit');
      if (refuse) throw new Error(refuse);
      if (typeof txHex !== 'string' || txHex.length === 0) throw new Error('no transaction hex');
      const parsed = JSON.parse(Buffer.from(txHex, 'hex').toString('utf8'));
      // The relayer pays the fee, so the buyer's leg carries none.
      const applied = chain.apply({
        contractId,
        functionName: 'buy',
        args: [CORE_CONTRACT, BigInt(listingId)],
        sender: parsed.sender,
        feeUstx: 0n
      });
      counter += 1;
      const id = `job-${counter}`;
      jobs.set(id, { id, state: applied.ok ? 'SPONSORED' : 'ABANDONED', txids: { buy: applied.txid }, contractId, listingId: String(listingId), error: applied.ok ? undefined : 'the buy aborted' });
      return jobs.get(id);
    },
    async status(jobId) {
      this.calls.push('status');
      const job = jobs.get(String(jobId));
      if (!job) throw new Error(`no such job ${jobId}`);
      if (job.state === 'SPONSORED') {
        // Reimburse the fee out of the escrowed budget, then refund the dust
        // and delete the listing, exactly as the relayer does.
        chain.apply({
          contractId: job.contractId,
          functionName: 'claim-fee',
          args: [BigInt(job.listingId), BigInt(estimatedFeeUstx)],
          sender: 'SPONSOR',
          feeUstx: 0n
        });
        const refund = chain.apply({
          contractId: job.contractId,
          functionName: 'settle-refund',
          args: [BigInt(job.listingId)],
          sender: 'SPONSOR',
          feeUstx: 0n
        });
        job.state = 'SETTLED';
        job.txids.refund = refund.txid;
      }
      return job;
    }
  };
}

/**
 * The dry submit port: applies the call to the fake market and hands back a
 * txid. It cannot broadcast, and it refuses if asked to.
 */
function dryPorts({ chain, sponsor, minerFeeUstx }) {
  let journal = null;
  return {
    readJournal: () => journal,
    writeJournal: (path, value) => {
      journal = value;
    },
    fetchImpl: fakeMarketFetch(chain),
    sponsor,
    killSwitch: (env) => killSwitchEngaged(env),
    now: () => Date.UTC(2026, 6, 31, 12, 0, 0),
    sleep: async () => {},
    say,
    presentPlan: (plan, options) => say(formatMarketPlan(plan, options)),
    submit: async ({ call, broadcast, senderAddress }) => {
      if (broadcast === true) {
        throw new WizardSafetyError('the dry submit port was asked to broadcast. It cannot, and it did not.');
      }
      const applied = chain.apply({
        contractId: call.contractId,
        functionName: call.functionName,
        args: decodeArgs(call.functionArgs.map((argument) => cvToHex(argument))),
        sender: senderAddress,
        feeUstx: BigInt(minerFeeUstx)
      });
      say(`    [dry] applied to the fake market as ${applied.txid}; nothing was signed and nothing was sent`);
      return { txid: applied.txid };
    }
  };
}

/**
 * The dry sponsored signer. It produces a payload the fake relayer can read and
 * that is unmistakably not a Stacks transaction, so it could never be
 * broadcast by anything even if it escaped this process.
 */
const drySignSponsored = async ({ senderAddress, nonce }) => ({
  txHex: Buffer.from(JSON.stringify({ fake: true, sender: senderAddress, nonce }), 'utf8').toString('hex')
});

/* ------------------------------------------------------------------ */
/* wallets                                                             */
/* ------------------------------------------------------------------ */

/**
 * Address and key per wizard. A live run derives the address from the key, so a
 * key filed under the wrong wizard shows up as an address that does not match
 * the one provisioning recorded. A dry run never touches a real key.
 */
export function walletsFor({ env, broadcast }) {
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
  say('market-run.mjs — scenarios 2 to 10 of the wizard test plan: list, buy, cancel, relist, settle.');
  say('');
  say('  DRY RUN BY DEFAULT. --broadcast is the only flag that spends.');
  say('');
  say('  --all                    run every scenario in plan order (the default)');
  say('  --scenario <id>          run one scenario; repeatable, or comma-separated');
  say('  --run <id>               run id, used for the journal file name');
  say('  --dry                    the default: every scenario against a fake market');
  say('  --broadcast              real mainnet transactions, real STX, irreversible');
  say('  --tokens <a,b,c,d>       inscriptions for list-stx, list-sbtc, list-usdcx, buy-sponsored');
  say('  --token-<slot> <id>      one of the above on its own');
  say('  --seller <wizard>        who lists (default archivist)');
  say('  --buyer <wizard>         who buys (default skeptic)');
  say('  --market <key>           market for a single-scenario run: ' + MARKET_KEYS.join(', '));
  say('  --listing-id <n>         act on this listing (makes any scenario runnable alone)');
  say('  --price-ustx <n>         listing price, in microSTX, scaled per market (default ' + groupDigits(DEFAULT_PRICE_USTX) + ')');
  say('  --relist-price-ustx <n>  price for the relist scenario (default ' + groupDigits(DEFAULT_RELIST_PRICE_USTX) + ')');
  say('  --fee-budget-ustx <n>    sponsorship deposit, always STX (default ' + groupDigits(MIN_FEE_BUDGET_USTX) + ', the contract minimum)');
  say('  --no-onchain-failure-proof  scenario 8 stops at the free read-only proof');
  say('  --sponsor-api <url>      relayer base (default ' + DEFAULT_SPONSOR_BASE + ')');
  say('  --no-sponsor             skip the relayer entirely');
  say('  --blocks-per-tx <n>      dry runs only: blocks the fake tip moves per transaction,');
  say('                           so a rehearsal can reach past the 144-block refund delay');
  say('  --run-spend-cap-ustx <n> cap across the whole run (default ' + groupDigits(DEFAULT_MARKET_RUN_SPEND_CAP_USTX) + ')');
  say('  --balance-floor-ustx <n> never spend a wallet below this');
  say('  --max-tx-fee-ustx <n>    miner fee bid per transaction');
  say('  --confirm-timeout-minutes <n>  how long to wait for one transaction');
  say('  --poll-seconds <n>       gap between transaction lookups');
  say('  --hiro <url>             Hiro endpoint');
  say('');
  say('  scenarios:');
  for (const scenario of SCENARIOS) say(`    ${String(scenario.number).padStart(2)}. ${scenario.id.padEnd(28)}${scenario.proves}`);
  say('');
  say('  markets that accept ' + CORE_CONTRACT + ':');
  for (const market of MARKETS) say(`    ${market.key.padEnd(6)}${market.contractId}`);
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
  const broadcast = flag('broadcast');
  const scenarios = selectScenarios({
    all: flag('all'),
    scenarios: process.argv.reduce((out, value, index) => {
      if (value === '--scenario') out.push(process.argv[index + 1]);
      return out;
    }, [])
  });

  const runId = text('run', broadcast ? null : 'rehearsal');
  if (!runId) {
    throw new WizardSafetyError('--run <id> is required for a broadcast: it names the journal that keeps this run recoverable.');
  }
  const blocksPerTx = Number(arg('blocks-per-tx', 1));
  if (blocksPerTx !== 1 && broadcast) {
    throw new WizardSafetyError('--blocks-per-tx moves a fake chain forward. There is no such thing on mainnet.');
  }

  const wallets = walletsFor({ env, broadcast });
  const sellerId = text('seller', 'archivist');
  const buyerId = text('buyer', 'skeptic');
  const minerFeeUstx = BigInt(arg('max-tx-fee-ustx', String(DEFAULT_MAX_TX_FEE_USTX)));
  const marketKey = text('market');
  const markets = marketKey ? { default: getMarket(marketKey).key } : {};

  const tokenOverrides = Object.fromEntries(
    TOKEN_SLOTS.map((slot) => [slot, text(`token-${slot}`)]).filter(([, value]) => value)
  );
  const tokens = resolveTokens({
    list: csv(arg('tokens')),
    overrides: tokenOverrides,
    fallback: broadcast ? null : (index) => String(9001 + index)
  });

  const options = {
    runId,
    scenarios,
    broadcast,
    hiroUrl,
    env,
    wallets,
    tokens,
    markets,
    sellerId,
    buyerId,
    listingId: text('listing-id'),
    priceUstx: BigInt(arg('price-ustx', String(DEFAULT_PRICE_USTX))),
    /**
     * `--real-listing` turns list-sbtc / list-usdcx from a proof into a plain
     * listing.
     *
     * Those scenarios normally refuse from a wallet holding any of the payment
     * token, because their whole claim is "a listing needs none of it" and a
     * wallet that holds some proves nothing. The contract has never required
     * it. Once the Archivist actually earned 700 sats from an sBTC sale, that
     * assertion made the only tool with a price override refuse to list any
     * more of its work.
     */
    proveZeroTokenBalance: !flag('real-listing'),
    relistPriceUstx: BigInt(arg('relist-price-ustx', String(DEFAULT_RELIST_PRICE_USTX))),
    feeBudgetUstx: BigInt(arg('fee-budget-ustx', String(MIN_FEE_BUDGET_USTX))),
    runSpendCapUstx: BigInt(arg('run-spend-cap-ustx', String(DEFAULT_MARKET_RUN_SPEND_CAP_USTX))),
    balanceFloorUstx: BigInt(arg('balance-floor-ustx', String(DEFAULT_BALANCE_FLOOR_USTX))),
    minerFeeUstx,
    confirmTimeoutMs: arg('confirm-timeout-minutes')
      ? Number(arg('confirm-timeout-minutes')) * 60_000
      : DEFAULT_CONFIRM_TIMEOUT_MS,
    confirmPollMs: arg('poll-seconds') ? Number(arg('poll-seconds')) * 1_000 : DEFAULT_CONFIRM_POLL_MS,
    mempoolWaitMs: DEFAULT_MEMPOOL_WAIT_MS,
    mempoolPollMs: DEFAULT_MEMPOOL_POLL_MS,
    proveFailureOnChain: !flag('no-onchain-failure-proof')
  };

  let ports;
  if (broadcast) {
    const sponsor = flag('no-sponsor')
      ? null
      : createSponsorPort({ base: text('sponsor-api', DEFAULT_SPONSOR_BASE), fetchImpl: globalThis.fetch });
    options.signSponsored = liveSignSponsored({ hiroUrl });
    ports = {
      ...journalPorts(),
      fetchImpl: globalThis.fetch,
      sponsor,
      killSwitch: (killEnv) => killSwitchEngaged(killEnv),
      now: () => Date.now(),
      sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
      say,
      presentPlan: (plan, presentOptions) => say(formatMarketPlan(plan, presentOptions)),
      submit: liveSubmit({ hiroUrl })
    };
    say('');
    say('=== BROADCAST. Every transaction below is real, on mainnet, and cannot be undone. ===');
    if (Object.keys(tokens).length === 0) {
      say('    no --tokens supplied: every listing scenario will skip.');
    }
  } else {
    const chain = makeFakeMarket({ minerFeeUstx, blocksPerTx });
    for (const id of PERSONA_IDS) {
      if (wallets[id]?.address) chain.fund(wallets[id].address, 5_000_000n);
    }
    for (const tokenId of Object.values(tokens)) chain.mint(tokenId, wallets[sellerId]?.address ?? null);
    const sponsor = flag('no-sponsor') ? null : makeFakeSponsor({ chain });
    options.signSponsored = drySignSponsored;
    ports = dryPorts({ chain, sponsor, minerFeeUstx });
    say('');
    say('=== DRY RUN. A fake market in this process. No key is read, nothing is signed, nothing is sent. ===');
    say(`    tokens ${Object.entries(tokens).map(([slot, id]) => `${slot}=#${id}`).join(', ')} are SYNTHETIC unless --tokens supplied them.`);
    say('');
  }

  const report = await runMarketScenarios({ ports, options });
  say(formatScenarioTable(report));

  if (!broadcast) {
    say('');
    say('To do this for real, re-run with a run id, the real inscription ids and --broadcast:');
    say('  node scripts/wizard/market-run.mjs --all --run <runId> --tokens <a,b,c,d> --broadcast');
  }
  return report.ok ? 0 : 1;
}

const isDirectRun = Boolean(process.argv[1]) && pathToFileURL(process.argv[1]).href === import.meta.url;
if (isDirectRun) {
  main()
    .then((code) => {
      process.exitCode = code ?? 0;
    })
    .catch((error) => {
      console.error(`\n${error?.name === 'WizardSafetyError' ? error.message : error}`);
      process.exitCode = 1;
    });
}

export { drySignSponsored, dryPorts, journalPorts, liveSignSponsored, liveSubmit };
