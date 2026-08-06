/**
 * market-run-core.mjs — scenarios 2 to 10 of the wizard test plan, minus the
 * terminal.
 *
 * run-thread-core.mjs proves the fleet can write. This proves it can trade:
 * list an inscription, buy it, cancel, relist, and fail legibly where a wizard
 * holds none of the payment token. Same discipline, different verbs.
 *
 * WHAT THE CONTRACTS ACTUALLY ALLOW, because it shapes every scenario here:
 *
 *   - Fresh v3-2-3 inscriptions can only be listed on the **sponsored** markets.
 *     `xtrata-market-{stx,sbtc,usdc}-v1-0` and `xtrata-market-v1-1` hardcode
 *     ALLOWED-NFT-CONTRACT to the retired `xtrata-v2-1-0` and reject v3-2-3 at
 *     `list-token`. The three usable markets are
 *     `xtrata-market-sponsored-{stx,sbtc,usdcx}-v1-1`. That is asserted at
 *     runtime — `is-nft-allowed(core)` must answer `(ok true)` before anything
 *     is signed — rather than trusted from this comment.
 *
 *   - `list-token` escrows the NFT **and** a fee budget, and that budget is
 *     always **STX**, on the sBTC and USDCx markets as much as the STX one.
 *     Listing therefore needs no sBTC and no USDCx. The payment token moves
 *     only in `buy`. Scenarios 3 and 4 exist to prove exactly that, so they
 *     read the wallet's token balance first and assert it is zero: a test that
 *     assumed the balance would prove nothing.
 *
 *   - `settle-refund` is sponsor-only for REFUND-DELAY (144) blocks after a
 *     sale, then the seller may self-settle. The wizards are not the sponsor,
 *     so the reachable half is the seller's, and before 144 blocks the honest
 *     answer is a skip with the count remaining, not a failure.
 *
 * The safety machinery is deliberately not reinvented. The nonce asymmetry, the
 * run-level spend cap, the journal secret check, the transaction poll and the
 * halt type are imported from run-thread-core.mjs, because two implementations
 * of "did this transaction land" is exactly one too many.
 *
 * What IS new here is the positive proof. A mint can be recovered by content
 * hash: the bytes are deterministic, so `get-id-by-hash` answers definitively.
 * A market call has no such hash, so every step carries a **probe** — a
 * read-only question whose answer is yes only if that step already landed
 * (`get-listing-id-by-token` for a listing, `get-owner` for a purchase, the
 * absence of a listing row for a cancel). The probe plays the part the content
 * hash plays there, and the nonce decides what a missing probe means, with the
 * same asymmetry:
 *
 *   - last executed nonce BELOW the intended one proves ABSENCE. Re-broadcast
 *     is safe, and only here.
 *   - AT OR ABOVE proves NOTHING. Some transaction spent it; it may have been
 *     an unrelated send. Halt and let a human look.
 *
 * Everything is injected: fetch, submit, the sponsor relayer, the clock, sleep,
 * journal read and write, the kill-switch probe and the presenter. There is no
 * terminal in this file, no direct network call and no direct disk access.
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256 } from '@noble/hashes/sha256';
import {
  FungibleConditionCode,
  NonFungibleConditionCode,
  contractPrincipalCV,
  createAssetInfo,
  cvToHex,
  cvToJSON,
  hexToCV,
  makeContractNonFungiblePostCondition,
  makeContractSTXPostCondition,
  makeStandardFungiblePostCondition,
  makeStandardNonFungiblePostCondition,
  makeStandardSTXPostCondition,
  standardPrincipalCV,
  uintCV
} from '@stacks/transactions';

import {
  CORE_ADDRESS,
  CORE_CONTRACT,
  CORE_NAME,
  DEFAULT_BALANCE_FLOOR_USTX,
  DEFAULT_HIRO_URL,
  DEFAULT_MAX_TX_FEE_USTX,
  WizardSafetyError,
  fetchStxBalance,
  groupDigits,
  killSwitchEngaged,
  microStxToStx,
  toHex
} from './inscribe.mjs';
import {
  DEFAULT_CONFIRM_POLL_MS,
  DEFAULT_CONFIRM_TIMEOUT_MS,
  DEFAULT_MEMPOOL_POLL_MS,
  DEFAULT_MEMPOOL_WAIT_MS,
  RunHalt,
  archiveIntent,
  assertJournalSecretFree,
  assertRunSpendCap,
  classifyIntentNonce,
  committedSpendUstx,
  fetchSenderNonces,
  formatDuration,
  normaliseTxid,
  optionalValue,
  pollTransaction,
  readIntendedNonce
} from './run-thread-core.mjs';
import { PERSONA_IDS, getPersona } from './personas.mjs';

export {
  DEFAULT_CONFIRM_POLL_MS,
  DEFAULT_CONFIRM_TIMEOUT_MS,
  DEFAULT_HIRO_URL,
  DEFAULT_MEMPOOL_POLL_MS,
  DEFAULT_MEMPOOL_WAIT_MS,
  RunHalt,
  WizardSafetyError,
  groupDigits,
  microStxToStx
};

const HERE = dirname(fileURLToPath(import.meta.url));

/* ------------------------------------------------------------------ */
/* the markets                                                         */
/* ------------------------------------------------------------------ */

export const MARKET_DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

/**
 * The three markets that will take a v3-2-3 inscription, and the only three.
 *
 * `feeBudgetAsset` is STX on all of them, deliberately spelled out rather than
 * left implied: the sBTC and USDCx markets escrow their fee budget in STX too,
 * and a runner that assumed otherwise would size the wrong balance check and
 * write the wrong post-condition.
 */
export const MARKETS = [
  {
    key: 'stx',
    address: MARKET_DEPLOYER,
    contractName: 'xtrata-market-sponsored-stx-v1-1',
    label: 'sponsored STX market',
    payment: { kind: 'stx', symbol: 'STX', decimals: 6, contractId: null, assetName: null },
    feeBudgetAsset: 'STX'
  },
  {
    key: 'sbtc',
    address: MARKET_DEPLOYER,
    contractName: 'xtrata-market-sponsored-sbtc-v1-1',
    label: 'sponsored sBTC market',
    payment: {
      kind: 'ft',
      symbol: 'sBTC',
      decimals: 8,
      contractId: 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token',
      assetName: 'sbtc-token'
    },
    feeBudgetAsset: 'STX'
  },
  {
    key: 'usdcx',
    address: MARKET_DEPLOYER,
    contractName: 'xtrata-market-sponsored-usdcx-v1-1',
    label: 'sponsored USDCx market',
    payment: {
      kind: 'ft',
      symbol: 'USDCx',
      decimals: 6,
      contractId: 'SP120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE.usdcx',
      assetName: 'usdcx-token'
    },
    feeBudgetAsset: 'STX'
  }
].map((market) => ({ ...market, contractId: `${market.address}.${market.contractName}` }));

export const MARKET_KEYS = MARKETS.map((market) => market.key);
const MARKET_BY_KEY = Object.fromEntries(MARKETS.map((market) => [market.key, market]));
const MARKET_BY_ID = Object.fromEntries(MARKETS.map((market) => [market.contractId, market]));

/** Resolve a market by short key or by full contract id. Throws with the list. */
export function getMarket(key) {
  const raw = String(key ?? '').trim();
  const market = MARKET_BY_KEY[raw.toLowerCase()] ?? MARKET_BY_ID[raw];
  if (!market) {
    throw new WizardSafetyError(
      `"${key}" is not one of the markets a v3-2-3 inscription can be listed on. Known: ${MARKET_KEYS.join(', ')}. ` +
        'The non-sponsored markets hardcode ALLOWED-NFT-CONTRACT to the retired xtrata-v2-1-0 and reject this core.'
    );
  }
  return market;
}

/** The contract's own minimum sponsorship budget, in microSTX. Asserted live. */
export const MIN_FEE_BUDGET_USTX = 50_000n;

/** Blocks after a sale during which only the sponsor may settle. Asserted live. */
export const REFUND_DELAY_BLOCKS = 144n;

/** Every error the sponsored markets define, so an abort reads as English. */
export const MARKET_ERRORS = {
  100: 'not-authorized: the caller is not the seller, the sponsor or the owner, or the NFT contract is not allowlisted',
  101: 'not-found: no such listing, or the nft-contract argument does not match the listing',
  102: 'already-listed: that token already has an open listing on this market',
  103: 'invalid-price: the price must be greater than zero',
  104: 'invalid-fee: fee-bps above the maximum',
  105: 'invalid-budget: the fee budget is below MIN-FEE-BUDGET',
  106: 'already-sold: this listing has been bought',
  107: 'not-sold: the listing has not been bought, so there is nothing to settle',
  108: 'claim-too-large: the claim exceeds the remaining budget or the claim cap',
  109: 'refund-locked: the seller may not settle until REFUND-DELAY blocks after the sale'
};

/** Listings priced where nothing a stranger wants is at stake. Plan 4.4. */
export const DEFAULT_PRICE_USTX = 100_000n;
export const DEFAULT_RELIST_PRICE_USTX = 150_000n;

/**
 * The cap across a whole market run. A single listing risks its budget and a
 * single buy risks its price, so a per-step cap cannot see a loop that lists
 * the same token five times.
 */
export const DEFAULT_MARKET_RUN_SPEND_CAP_USTX = 1_000_000n;

/** Where the relayer lives when nothing overrides it. */
export const DEFAULT_SPONSOR_BASE = 'https://xtrata.xyz';

/* ------------------------------------------------------------------ */
/* the scenarios                                                       */
/* ------------------------------------------------------------------ */

/**
 * Plan section 4.3, numbered as the plan numbers them. Scenario 1 (inscribe) is
 * run-thread.mjs and is not repeated here; the numbering keeps the gap so a
 * report and the plan can be read side by side.
 */
export const SCENARIOS = [
  {
    id: 'list-stx',
    number: 2,
    title: 'List on the sponsored STX market',
    proves: 'listing, NFT escrow and the STX fee budget'
  },
  {
    id: 'list-sbtc',
    number: 3,
    title: 'List on the sponsored sBTC market holding no sBTC',
    proves: 'cross-currency listing needs none of the payment token'
  },
  {
    id: 'list-usdcx',
    number: 4,
    title: 'List on the sponsored USDCx market holding no USDCx',
    proves: 'as above, on the second cross-currency market'
  },
  {
    id: 'buy-stx',
    number: 5,
    title: 'Self-paid buy of another wizard\'s STX listing',
    proves: 'the path every real buyer takes today'
  },
  {
    id: 'buy-sponsored',
    number: 6,
    title: 'Sponsored buy through the relayer',
    proves: 'quote, fee-0 signature, submit and settle, end to end'
  },
  {
    id: 'cancel',
    number: 7,
    title: 'Cancel a listing',
    proves: 'escrow recovery and a full fee-budget refund'
  },
  {
    id: 'buy-sbtc-expected-failure',
    number: 8,
    title: 'Buy an sBTC listing holding no sBTC — expected failure',
    proves: 'the failure is clean and legible, not a silent hang'
  },
  {
    id: 'relist',
    number: 9,
    title: 'Relist at a different price',
    proves: 'cancel-then-list, the only price change the contracts support'
  },
  {
    id: 'settlement',
    number: 10,
    title: 'Seller settle-refund after the delay',
    proves: 'escrowed budget minus claimed equals what comes back'
  }
];

export const SCENARIO_IDS = SCENARIOS.map((scenario) => scenario.id);
const SCENARIO_BY_ID = Object.fromEntries(SCENARIOS.map((scenario) => [scenario.id, scenario]));

export function getScenario(id) {
  const scenario = SCENARIO_BY_ID[String(id ?? '').trim()];
  if (!scenario) {
    throw new WizardSafetyError(`"${id}" is not a scenario. Known: ${SCENARIO_IDS.join(', ')}`);
  }
  return scenario;
}

/** Every outcome a scenario can have. A skip is neither a pass nor a failure. */
export const SCENARIO_STATUSES = ['passed', 'failed', 'skipped', 'blocked', 'not-run'];

/* ------------------------------------------------------------------ */
/* small shared helpers                                                */
/* ------------------------------------------------------------------ */

const trimSlash = (url) => String(url).replace(/\/+$/, '');
const errorMessage = (error) => (error instanceof Error ? error.message : String(error));
const iso = (ms) => new Date(ms).toISOString();
const big = (value, fallback = 0n) => (value === null || value === undefined ? fallback : BigInt(value));

/** A decimal amount for a token with `decimals` places. Display only. */
export function formatAmount(amount, decimals = 6, symbol = '') {
  const value = big(amount);
  const negative = value < 0n;
  const absolute = negative ? -value : value;
  const unit = 10n ** BigInt(decimals);
  const whole = absolute / unit;
  const fraction = (absolute % unit).toString().padStart(decimals, '0').replace(/0+$/, '');
  const text = `${negative ? '-' : ''}${groupDigits(whole)}${fraction ? `.${fraction}` : ''}`;
  return symbol ? `${text} ${symbol}` : text;
}

/**
 * `(err uN)` out of a transaction result, as a code and a sentence.
 *
 * Reads the Clarity hex when the API supplies it, which is authoritative, and
 * falls back to the printed repr. A result this cannot read is reported as
 * unreadable rather than guessed at: scenario 8 passes only on a *specific*
 * abort reason, so "some error happened" must never look like a match.
 */
export function readErrorResult(txResult) {
  const hex = typeof txResult?.hex === 'string' ? txResult.hex : null;
  const repr = typeof txResult?.repr === 'string' ? txResult.repr : null;
  let code = null;
  let ok = null;

  if (hex) {
    try {
      const parsed = cvToJSON(hexToCV(hex));
      ok = parsed?.success === true;
      const inner = parsed?.value;
      if (parsed?.success === false && inner && (inner.type === 'uint' || /uint/.test(String(inner.type)))) {
        code = Number(inner.value);
      }
    } catch {
      // Unreadable hex falls through to the repr.
    }
  }
  if (code === null && repr) {
    const match = /^\(err\s+u(\d+)\)$/.exec(repr.trim());
    if (match) {
      code = Number(match[1]);
      ok = false;
    } else if (/^\(ok\b/.test(repr.trim())) {
      ok = true;
    }
  }
  return {
    ok,
    code,
    repr: repr ?? hex ?? null,
    isMarketError: code !== null && Object.prototype.hasOwnProperty.call(MARKET_ERRORS, String(code)),
    meaning: code !== null && MARKET_ERRORS[code] ? MARKET_ERRORS[code] : null
  };
}

/**
 * A stable fingerprint of the exact call about to be signed.
 *
 * The mint runner records the content hash of the bytes; a market call has no
 * bytes, so this is its equivalent: contract, function and every argument in
 * its canonical Clarity encoding, folded to one sha256. It is what a later run
 * compares against to know that the intent it found in the journal is the call
 * it is about to make, rather than a differently-priced one composed since.
 */
export function argsHashHex({ contractId, functionName, functionArgs = [] }) {
  const canonical = JSON.stringify({
    contract: String(contractId),
    function: String(functionName),
    args: functionArgs.map((argument) => cvToHex(argument))
  });
  return toHex(sha256(new Uint8Array(Buffer.from(canonical, 'utf8'))));
}

/* ------------------------------------------------------------------ */
/* the journal                                                         */
/* ------------------------------------------------------------------ */

export const MARKET_JOURNAL_VERSION = 1;

/**
 * Statuses a step can hold, and what a resumed run may do with each.
 *
 *   broadcasting        intent written, outcome unknown. NEVER re-broadcast.
 *   broadcast           txid recorded, not terminal. Poll it.
 *   confirmed           success. Skip.
 *   failed              terminal non-success. Halt — unless expectedFailure,
 *                       which is scenario 8's whole point and is settled state.
 *   timeout             polled past the window. May still confirm.
 *   abandoned           the nonce proved it never landed. Safe to compose again.
 */
export const STEP_STATUSES = ['broadcasting', 'broadcast', 'confirmed', 'failed', 'timeout', 'abandoned'];

/**
 * Where a market run's journal lives.
 *
 * Deliberately a different prefix from the thread runner's `.run-<id>.json`: a
 * market journal keys steps by scenario, a thread journal keys them by
 * position, and a file that could be loaded by the wrong runner would be read
 * as a set of positions with no ids and treated as work still to do.
 */
export function marketJournalPathFor({ dir = HERE, runId, mode = 'broadcast' } = {}) {
  const id = String(runId ?? '').trim();
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(id)) {
    throw new WizardSafetyError(
      `"${id}" is not a usable run id for a journal file name. Use letters, digits, dot, dash and underscore, ` +
        'starting with a letter or digit.'
    );
  }
  return join(dir, `.market-${id}${mode === 'dry' ? '.dry' : ''}.json`);
}

export function emptyMarketJournal({ runId, mode = 'broadcast', startedAt }) {
  return {
    version: MARKET_JOURNAL_VERSION,
    runId,
    mode,
    startedAt,
    updatedAt: startedAt,
    /** keyed `<scenario>:<action>`; shaped like a thread journal position. */
    steps: {},
    /** scenario outcomes, so a resumed run does not repeat a passed scenario. */
    scenarios: {},
    /** listings this run opened, for the cleanup report. */
    listings: {}
  };
}

/**
 * What this run has committed, in microSTX.
 *
 * Reuses the thread runner's accounting verbatim by handing it the steps under
 * the key it expects. Deliberately: the number exists to stop a loop, and two
 * ways of adding it up is two ways of getting it wrong.
 */
export const committedMarketSpendUstx = (journal) => committedSpendUstx({ positions: journal?.steps ?? {} });

/* ------------------------------------------------------------------ */
/* chain reads (every one of them a read; none can move funds)         */
/* ------------------------------------------------------------------ */

/**
 * One read-only call against ANY contract.
 *
 * inscribe.mjs has a `callReadOnly`, but it is pinned to the core contract and
 * should stay pinned: everything it guards is about the core. This is the
 * market's own read port, same endpoint, contract supplied by the caller.
 */
export async function callContractReadOnly({
  fetchImpl = globalThis.fetch,
  hiroUrl = DEFAULT_HIRO_URL,
  contractAddress,
  contractName,
  functionName,
  functionArgs = [],
  senderAddress = CORE_ADDRESS
} = {}) {
  const url = `${trimSlash(hiroUrl)}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`;
  const response = await fetchImpl(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender: senderAddress, arguments: functionArgs.map((argument) => cvToHex(argument)) })
  });
  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error(`${functionName} returned non-JSON content (HTTP ${response.status})`);
  }
  if (!response.ok) throw new Error(`${functionName} returned HTTP ${response.status}`);
  if (body.okay !== true || typeof body.result !== 'string') {
    throw new Error(`${functionName} failed: ${body.cause ?? body.result ?? 'no Clarity result'}`);
  }
  return cvToJSON(hexToCV(body.result));
}

const marketRead = (market, rest) =>
  callContractReadOnly({ contractAddress: market.address, contractName: market.contractName, ...rest });

/** `(response T ...)` unwrapped to T; anything else passes through. */
const unwrap = (parsed) =>
  typeof parsed?.type === 'string' && parsed.type.startsWith('(response') ? parsed.value : parsed;

/**
 * One listing row, decoded, or null when the map has no such id.
 *
 * `buyer` and `sold-at` are `(optional ...)` and stay optional here: "not sold"
 * and "sold at block 0" have to be distinguishable, and a decoder that
 * flattened them to 0 would make an unsold listing look settled.
 */
export function parseListing(parsed, listingId = null) {
  const inner = optionalValue(parsed);
  if (!inner) return null;
  const fields = inner.value ?? {};
  const uintOf = (name) => (fields[name]?.value === undefined ? null : BigInt(fields[name].value));
  const optionalOf = (name) => {
    const field = fields[name];
    if (!field || field.value === null || field.value === undefined) return null;
    return field.value.value ?? null;
  };
  const soldAt = optionalOf('sold-at');
  return {
    listingId: listingId === null ? null : String(listingId),
    seller: fields.seller?.value ?? null,
    nftContract: fields['nft-contract']?.value ?? null,
    tokenId: uintOf('token-id'),
    price: uintOf('price'),
    createdAt: uintOf('created-at'),
    feeBudget: uintOf('fee-budget'),
    budgetRemaining: uintOf('budget-remaining'),
    claimed: uintOf('claimed'),
    buyer: optionalOf('buyer'),
    soldAt: soldAt === null ? null : BigInt(soldAt),
    sold: soldAt !== null
  };
}

export async function readListing({ fetchImpl, hiroUrl, market, listingId, senderAddress = CORE_ADDRESS } = {}) {
  const parsed = await marketRead(market, {
    fetchImpl,
    hiroUrl,
    senderAddress,
    functionName: 'get-listing',
    functionArgs: [uintCV(BigInt(listingId))]
  });
  return parseListing(parsed, listingId);
}

export async function readListingIdByToken({ fetchImpl, hiroUrl, market, tokenId, nftContract = CORE_CONTRACT, senderAddress = CORE_ADDRESS } = {}) {
  const [address, name] = String(nftContract).split('.');
  const parsed = await marketRead(market, {
    fetchImpl,
    hiroUrl,
    senderAddress,
    functionName: 'get-listing-id-by-token',
    functionArgs: [contractPrincipalCV(address, name), uintCV(BigInt(tokenId))]
  });
  const inner = optionalValue(parsed);
  return inner === null ? null : String(inner.value);
}

export async function readLastListingId({ fetchImpl, hiroUrl, market, senderAddress = CORE_ADDRESS } = {}) {
  const parsed = await marketRead(market, { fetchImpl, hiroUrl, senderAddress, functionName: 'get-last-listing-id' });
  return BigInt(unwrap(parsed)?.value ?? 0);
}

export async function readFeeBps({ fetchImpl, hiroUrl, market, senderAddress = CORE_ADDRESS } = {}) {
  const parsed = await marketRead(market, { fetchImpl, hiroUrl, senderAddress, functionName: 'get-fee-bps' });
  return BigInt(unwrap(parsed)?.value ?? 0);
}

export async function readMinFeeBudget({ fetchImpl, hiroUrl, market, senderAddress = CORE_ADDRESS } = {}) {
  const parsed = await marketRead(market, { fetchImpl, hiroUrl, senderAddress, functionName: 'get-min-fee-budget' });
  return BigInt(unwrap(parsed)?.value ?? 0);
}

export async function readRefundDelay({ fetchImpl, hiroUrl, market, senderAddress = CORE_ADDRESS } = {}) {
  const parsed = await marketRead(market, { fetchImpl, hiroUrl, senderAddress, functionName: 'get-refund-delay' });
  return BigInt(unwrap(parsed)?.value ?? 0);
}

/** `is-nft-allowed(core)`. The rail that decides whether a market is usable. */
export async function readIsNftAllowed({ fetchImpl, hiroUrl, market, nftContract = CORE_CONTRACT, senderAddress = CORE_ADDRESS } = {}) {
  const [address, name] = String(nftContract).split('.');
  const parsed = await marketRead(market, {
    fetchImpl,
    hiroUrl,
    senderAddress,
    functionName: 'is-nft-allowed',
    functionArgs: [contractPrincipalCV(address, name)]
  });
  return unwrap(parsed)?.value === true;
}

/** SIP-009 `get-owner` on the core, as a principal string or null. */
export async function readNftOwner({ fetchImpl, hiroUrl, tokenId, senderAddress = CORE_ADDRESS } = {}) {
  const parsed = await callContractReadOnly({
    fetchImpl,
    hiroUrl,
    contractAddress: CORE_ADDRESS,
    contractName: CORE_NAME,
    senderAddress,
    functionName: 'get-owner',
    functionArgs: [uintCV(BigInt(tokenId))]
  });
  const inner = optionalValue(parsed);
  return inner === null ? null : String(inner.value);
}

/**
 * A SIP-010 balance, for the assertion scenarios 3, 4 and 8 rest on.
 *
 * Reads the token contract directly rather than an indexer's balance summary:
 * the question is "can this wallet pay", and the token contract is the only
 * thing that answers it authoritatively.
 */
export async function readTokenBalance({ fetchImpl, hiroUrl, payment, address, senderAddress = CORE_ADDRESS } = {}) {
  if (!payment || payment.kind !== 'ft' || !payment.contractId) {
    throw new WizardSafetyError('readTokenBalance needs a fungible payment token');
  }
  const [tokenAddress, tokenName] = String(payment.contractId).split('.');
  const parsed = await callContractReadOnly({
    fetchImpl,
    hiroUrl,
    contractAddress: tokenAddress,
    contractName: tokenName,
    senderAddress,
    functionName: 'get-balance',
    functionArgs: [standardPrincipalCV(address)]
  });
  return BigInt(unwrap(parsed)?.value ?? 0);
}

/** Current chain tip, for the refund-delay arithmetic. */
export async function readChainTip({ fetchImpl = globalThis.fetch, hiroUrl = DEFAULT_HIRO_URL } = {}) {
  const response = await fetchImpl(`${trimSlash(hiroUrl)}/extended/v2/blocks?limit=1`);
  const body = await response.json();
  const height = body?.results?.[0]?.height ?? body?.total;
  if (height === undefined || height === null) throw new Error('chain tip lookup returned no height');
  return BigInt(height);
}

/* ------------------------------------------------------------------ */
/* building the calls                                                  */
/* ------------------------------------------------------------------ */

const coreParts = () => [CORE_ADDRESS, CORE_NAME];

/**
 * The exact Clarity call and post-conditions for one market action.
 *
 * Post-conditions are the whole safety story for a market call: Deny mode plus
 * one condition per asset that moves. They mirror the recipe the shipped market
 * page uses (`src/lib/market/settlement.ts`), because that recipe is the one
 * proven against these contracts on mainnet.
 *
 * The STX bounds are `LessEqual`, never `Equal`. An exact-match post-condition
 * aborts and burns the miner fee the moment the contract moves a microSTX less
 * than predicted, and `LessEqual` bounds the spend just as tightly in the only
 * direction that can cost the wizard anything.
 */
export function buildMarketCall({ action, market, tokenId, listingId, priceAmount, feeBudgetUstx, senderAddress, sellerAddress = null, budgetRemainingUstx = null }) {
  const [coreAddress, coreName] = coreParts();
  const nftAsset = createAssetInfo(coreAddress, coreName, 'xtrata-inscription');
  const nftArg = contractPrincipalCV(coreAddress, coreName);

  if (action === 'list-token') {
    const budget = BigInt(feeBudgetUstx);
    return {
      contractId: market.contractId,
      contractAddress: market.address,
      contractName: market.contractName,
      functionName: 'list-token',
      functionArgs: [nftArg, uintCV(BigInt(tokenId)), uintCV(BigInt(priceAmount)), uintCV(budget)],
      postConditionMode: 'deny',
      postConditions: [
        makeStandardNonFungiblePostCondition(senderAddress, NonFungibleConditionCode.Sends, nftAsset, uintCV(BigInt(tokenId))),
        makeStandardSTXPostCondition(senderAddress, FungibleConditionCode.LessEqual, budget)
      ],
      postConditionShape: [
        `NFT ${CORE_CONTRACT}::xtrata-inscription #${tokenId} sent by ${senderAddress}`,
        `STX from ${senderAddress} <= ${groupDigits(budget)} microSTX (the fee budget, in STX on every sponsored market)`
      ],
      /** STX that leaves the wizard's wallet, refundable but at risk. */
      stxOutflowUstx: budget
    };
  }

  if (action === 'buy') {
    const amount = BigInt(priceAmount);
    const payment =
      market.payment.kind === 'stx'
        ? makeStandardSTXPostCondition(senderAddress, FungibleConditionCode.LessEqual, amount)
        : makeStandardFungiblePostCondition(
            senderAddress,
            FungibleConditionCode.LessEqual,
            amount,
            createAssetInfo(
              String(market.payment.contractId).split('.')[0],
              String(market.payment.contractId).split('.')[1],
              market.payment.assetName
            )
          );
    return {
      contractId: market.contractId,
      contractAddress: market.address,
      contractName: market.contractName,
      functionName: 'buy',
      functionArgs: [nftArg, uintCV(BigInt(listingId))],
      postConditionMode: 'deny',
      postConditions: [
        payment,
        makeContractNonFungiblePostCondition(
          market.address,
          market.contractName,
          NonFungibleConditionCode.Sends,
          nftAsset,
          uintCV(BigInt(tokenId))
        )
      ],
      postConditionShape: [
        `${market.payment.symbol} from ${senderAddress} <= ${formatAmount(amount, market.payment.decimals, market.payment.symbol)}`,
        `NFT #${tokenId} sent by ${market.contractId}`
      ],
      stxOutflowUstx: market.payment.kind === 'stx' ? amount : 0n
    };
  }

  if (action === 'cancel') {
    const remaining = big(budgetRemainingUstx);
    return {
      contractId: market.contractId,
      contractAddress: market.address,
      contractName: market.contractName,
      functionName: 'cancel',
      functionArgs: [nftArg, uintCV(BigInt(listingId))],
      postConditionMode: 'deny',
      postConditions: [
        makeContractNonFungiblePostCondition(
          market.address,
          market.contractName,
          NonFungibleConditionCode.Sends,
          nftAsset,
          uintCV(BigInt(tokenId))
        ),
        makeContractSTXPostCondition(market.address, market.contractName, FungibleConditionCode.LessEqual, remaining)
      ],
      postConditionShape: [
        `NFT #${tokenId} sent back by ${market.contractId}`,
        `STX from ${market.contractId} <= ${groupDigits(remaining)} microSTX (the remaining budget)`
      ],
      stxOutflowUstx: 0n
    };
  }

  if (action === 'settle-refund') {
    const remaining = big(budgetRemainingUstx);
    return {
      contractId: market.contractId,
      contractAddress: market.address,
      contractName: market.contractName,
      functionName: 'settle-refund',
      functionArgs: [uintCV(BigInt(listingId))],
      postConditionMode: 'deny',
      // A settle with nothing left to refund moves no assets at all, and Deny
      // mode is happy with an empty list in that case. Naming the bound anyway
      // when there IS a remainder keeps the refund inside what the listing says
      // it holds.
      postConditions:
        remaining > 0n
          ? [makeContractSTXPostCondition(market.address, market.contractName, FungibleConditionCode.LessEqual, remaining)]
          : [],
      postConditionShape:
        remaining > 0n
          ? [`STX from ${market.contractId} <= ${groupDigits(remaining)} microSTX (the unclaimed budget)`]
          : ['nothing moves: the budget is fully claimed'],
      stxOutflowUstx: 0n,
      seller: sellerAddress
    };
  }

  throw new WizardSafetyError(`"${action}" is not a market action this runner knows how to build`);
}

/* ------------------------------------------------------------------ */
/* safety rails                                                        */
/* ------------------------------------------------------------------ */

/**
 * Every reason to refuse one market broadcast, in a fixed order so the first
 * failure reported is the most important one.
 *
 * The market analogue of `assertBroadcastAllowed`. It cannot reuse that one:
 * the mint rails are about chunk counts, fee quotes and parent quotes, and none
 * of those exist here. What it keeps is the shape — kill switch, key, chain
 * truth, then money — and the refusal type, so a caller still tells a rail from
 * a bug by catching WizardSafetyError.
 */
export function assertMarketBroadcastAllowed({
  senderKey,
  wizardId = 'unknown',
  senderAddress = null,
  balanceUstx,
  stxOutflowUstx = 0n,
  minerFeeUstx = DEFAULT_MAX_TX_FEE_USTX,
  balanceFloorUstx = DEFAULT_BALANCE_FLOOR_USTX,
  killReason = null,
  nftAllowedCheck = null,
  paymentBalanceCheck = null,
  postConditions = null
} = {}) {
  if (killReason) {
    throw new WizardSafetyError(`kill switch engaged (${killReason}). Nothing will be broadcast.`);
  }
  if (!senderKey) {
    throw new WizardSafetyError(
      `refusing to broadcast: no key. Set WIZARD_KEY_${String(wizardId).toUpperCase()} to the hex private key ` +
        'for this wizard. A dry run needs no key.'
    );
  }
  if (typeof senderKey !== 'string' || !/^[0-9a-fA-F]{64,66}$/.test(senderKey)) {
    throw new WizardSafetyError('refusing to broadcast: key is not a hex private key');
  }
  if (!senderAddress) {
    throw new WizardSafetyError('refusing to broadcast: no sender address, so no post-condition can name a principal');
  }
  if (!Array.isArray(postConditions)) {
    throw new WizardSafetyError('refusing to broadcast: the call carries no post-condition list');
  }

  // Chain truth, before the money rails. Fails closed: a market whose
  // allowlist could not be read is not a market this will sign against.
  if (nftAllowedCheck && nftAllowedCheck.ok !== true) {
    throw new WizardSafetyError(
      nftAllowedCheck.status === 'rejected'
        ? `refusing to broadcast: ${nftAllowedCheck.market} answers is-nft-allowed(${CORE_CONTRACT}) with false. ` +
          'It cannot take this core, list-token would abort, and the miner fee would still be spent.'
        : `refusing to broadcast: could not read is-nft-allowed on ${nftAllowedCheck.market} ` +
          `(${nftAllowedCheck.error ?? nftAllowedCheck.status}). This fails closed.`
    );
  }
  // A buy the wallet demonstrably cannot pay for. Scenario 8 wants exactly this
  // transaction, so it opts in explicitly rather than this rail being softened.
  if (paymentBalanceCheck && paymentBalanceCheck.ok !== true) {
    throw new WizardSafetyError(
      `refusing to broadcast: ${paymentBalanceCheck.message} Pass --prove-failure-onchain if a failing ` +
        'transaction is the thing you are trying to observe.'
    );
  }

  const outflow = big(stxOutflowUstx);
  const minerFee = BigInt(minerFeeUstx);
  const floor = BigInt(balanceFloorUstx);
  const planned = outflow + minerFee;

  if (balanceUstx === undefined || balanceUstx === null) {
    throw new WizardSafetyError('refusing to broadcast: wallet balance unknown');
  }
  const balance = BigInt(balanceUstx);
  if (balance < floor) {
    throw new WizardSafetyError(
      `refusing to broadcast: balance ${groupDigits(balance)} microSTX is below the floor of ${groupDigits(floor)}. ` +
        'Top the wizard up. Never spend the last of the float, or recovery transactions stop being affordable.'
    );
  }
  if (balance - planned < floor) {
    throw new WizardSafetyError(
      `refusing to broadcast: spending ${groupDigits(planned)} microSTX would leave ${groupDigits(balance - planned)}, ` +
        `below the floor of ${groupDigits(floor)}.`
    );
  }
  return { plannedSpendUstx: planned, stxOutflowUstx: outflow, minerFeeUstx: minerFee };
}

/* ------------------------------------------------------------------ */
/* the crash window, market edition                                    */
/* ------------------------------------------------------------------ */

/**
 * A step whose intent was written but whose txid was not, resolved against the
 * chain: first by the step's own probe, then by the nonce, then by waiting.
 *
 * Identical in shape and in rules to `resolveIntent` in run-thread-core.mjs,
 * and it imports that file's nonce classifier rather than restating it. The one
 * difference is the positive proof: there is no content hash for a market call,
 * so the caller supplies a `probe` that answers "is the chain already in the
 * state this step would produce". A probe hit is the only thing that proves a
 * step landed; the nonce only ever decides what a *missing* probe means.
 *
 *   { outcome: 'landed'    }  adopt it, never re-broadcast
 *   { outcome: 'absent'    }  proved never sent. Safe to compose again.
 *   { outcome: 'pending'   }  still in the mempool after the wait. Halt.
 *   { outcome: 'ambiguous' }  nothing proves anything. Halt.
 */
export async function resolveMarketIntent({
  fetchImpl = globalThis.fetch,
  hiroUrl = DEFAULT_HIRO_URL,
  record,
  probe,
  now = () => Date.now(),
  sleep = async () => {},
  say = () => {},
  guard = () => {},
  mempoolWaitMs = DEFAULT_MEMPOOL_WAIT_MS,
  mempoolPollMs = DEFAULT_MEMPOOL_POLL_MS
} = {}) {
  const look = async () => {
    if (typeof probe !== 'function') return null;
    const seen = await probe();
    return seen?.landed === true ? { outcome: 'landed', detail: seen.detail ?? null } : null;
  };

  const first = await look();
  if (first) return { ...first, nonce: null, waitedMs: 0 };

  const nonces = await fetchSenderNonces({ fetchImpl, hiroUrl, address: record?.senderAddress ?? null });
  const nonce = classifyIntentNonce({ intendedNonce: record?.intendedNonce ?? null, nonces });

  if (nonce.verdict === 'absent') return { outcome: 'absent', detail: null, nonce, waitedMs: 0 };
  if (nonce.verdict !== 'pending') return { outcome: 'ambiguous', detail: null, nonce, waitedMs: 0 };

  const started = now();
  const waitMs = Math.max(0, Number(mempoolWaitMs));
  const intervalMs = Math.max(0, Number(mempoolPollMs));
  if (waitMs > 0) {
    say(`    ${nonce.why}. Waiting up to ${formatDuration(waitMs)} before giving up. Nothing is being re-sent.`);
  }
  for (;;) {
    const remaining = waitMs - (now() - started);
    if (remaining <= 0) break;
    say(`    still pending at nonce ${nonce.intendedNonce}: ${formatDuration(remaining)} left`);
    await sleep(Math.min(intervalMs, remaining));
    guard('waiting for the mempool');
    const seen = await look();
    if (seen) return { ...seen, nonce, waitedMs: waitMs - remaining };
  }
  return { outcome: 'pending', detail: null, nonce, waitedMs: waitMs };
}

/* ------------------------------------------------------------------ */
/* ports                                                               */
/* ------------------------------------------------------------------ */

/**
 * Everything from outside. The defaults read nothing and refuse to broadcast,
 * so a caller that supplies no ports gets a run that spends nothing rather than
 * one that quietly uses the real network.
 */
export const NULL_PORTS = {
  fetchImpl: async () => {
    throw new WizardSafetyError('no fetch port supplied');
  },
  submit: async () => {
    throw new WizardSafetyError('no submit port supplied: nothing was signed and nothing was sent');
  },
  sponsor: null,
  readJournal: () => null,
  writeJournal: () => {},
  killSwitch: () => null,
  now: () => Date.now(),
  sleep: async () => {},
  say: () => {},
  presentPlan: () => {}
};

/* ------------------------------------------------------------------ */
/* one step                                                            */
/* ------------------------------------------------------------------ */

/**
 * Broadcast one market call and settle it, with the whole crash discipline.
 *
 * `expect` is 'success' or 'failure'. Scenario 8 wants a transaction that
 * aborts, so an abort there is the settled outcome and a success is the alarm;
 * everywhere else it is the other way round. Either way the run never retries a
 * broadcast and never treats a timeout as a failure.
 */
async function runStep({ io, ctx, key, step }) {
  const {
    scenarioId,
    label,
    call,
    wizardId,
    wallet,
    probe,
    expect = 'success',
    checks = {}
  } = step;
  const record = (patch) => ctx.recordStep(key, patch);
  const existing = ctx.journal.steps[key] ?? null;

  if (existing && existing.status === 'confirmed') {
    io.say(`    ${label}: already confirmed as ${existing.txid ?? 'a recovered step'}; nothing to broadcast`);
    return { outcome: 'success', txid: existing.txid ?? null, result: existing.result ?? null, recovered: true };
  }
  if (existing && existing.status === 'failed' && existing.expectedFailure === true) {
    io.say(`    ${label}: already recorded as the expected failure (${existing.txStatus})`);
    return { outcome: 'failed', txid: existing.txid ?? null, txStatus: existing.txStatus, result: existing.result ?? null, recovered: true };
  }

  // Intent written, txid never was. Never re-broadcast on a guess.
  if (existing && existing.status === 'broadcasting' && !existing.txid) {
    const resolved = await resolveMarketIntent({
      fetchImpl: io.fetchImpl,
      hiroUrl: ctx.hiroUrl,
      record: existing,
      probe,
      now: io.now,
      sleep: io.sleep,
      say: io.say,
      guard: ctx.guard,
      mempoolWaitMs: ctx.mempoolWaitMs,
      mempoolPollMs: ctx.mempoolPollMs
    });
    if (resolved.outcome === 'landed') {
      record({ status: 'confirmed', recovered: true, note: 'recovered by probe: the chain is already in the state this step produces' });
      io.say(`    ${label}: recovered by probe; no second broadcast`);
      return { outcome: 'success', txid: existing.txid ?? null, result: null, recovered: true };
    }
    if (resolved.outcome !== 'absent') {
      throw new RunHalt(
        'unresolved',
        `${label} has an intent record from an earlier run but no transaction id, and the chain does not yet show ` +
          `the state it would produce. ${resolved.nonce?.why ?? 'The wallet nonce says nothing about it either.'} ` +
          'This runner will not send it again. Watch ' +
          `${existing.senderAddress ?? 'the wizard wallet'} in the explorer and re-run once that nonce clears.`,
        { step: key, intendedNonce: existing.intendedNonce ?? null, nonce: resolved.nonce }
      );
    }
    // The one branch that may send this call again, and the whole reason the
    // nonce is written down: a nonce below the intended one is proof the
    // transaction never confirmed, so nothing on chain can be duplicated.
    ctx.recordStep(key, {
      status: 'abandoned',
      txid: null,
      intendedNonce: null,
      protocolFeeUstx: null,
      minerFeeUstx: null,
      actualMinerFeeUstx: null,
      resolution: 'nonce-proved-absent',
      resolvedBy: 'runner',
      resolvedAt: iso(io.now()),
      note: resolved.nonce?.why ?? 'the intended nonce had never confirmed, so nothing was sent',
      previousIntents: [
        ...(existing.previousIntents ?? []),
        archiveIntent(existing, { reason: 'nonce-proved-absent', note: resolved.nonce?.why ?? null })
      ]
    });
    io.say(`    ${label}: ${resolved.nonce.why}`);
    io.say('      the orphaned intent is cleared and this step is sent again');
  }

  // A txid exists. Poll it. Under no circumstances send another.
  if (existing && existing.txid && existing.status !== 'failed') {
    return settleStep({ io, ctx, key, label, txid: existing.txid, expect });
  }
  if (existing && existing.status === 'failed' && existing.expectedFailure !== true) {
    throw new RunHalt(
      'tx-failed',
      `${label} is recorded as failed (${existing.txStatus ?? 'unknown status'}, tx ${existing.txid ?? 'none'}). ` +
        `This runner does not retry a broadcast. Decide what happened, clear that step out of ${ctx.journalPath}, ` +
        'and start again deliberately.',
      { step: key }
    );
  }

  const plan = {
    scenarioId,
    label,
    wizard: getPersona(wizardId),
    senderAddress: wallet.address ?? null,
    call,
    minerFeeUstx: ctx.minerFeeUstx,
    stxOutflowUstx: big(call.stxOutflowUstx),
    plannedSpendUstx: big(call.stxOutflowUstx) + ctx.minerFeeUstx,
    balanceUstx: null,
    balanceError: null,
    balanceFloorUstx: ctx.balanceFloorUstx,
    killReason: killSwitchEngaged(ctx.env),
    argsHashHex: argsHashHex(call),
    expect,
    checks
  };
  try {
    plan.balanceUstx = wallet.address
      ? await fetchStxBalance({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, address: wallet.address })
      : null;
  } catch (error) {
    plan.balanceError = errorMessage(error);
  }
  io.presentPlan(plan, { broadcast: ctx.broadcast });

  ctx.guard(`broadcasting ${label}`);
  assertRunSpendCap({
    committedUstx: committedMarketSpendUstx(ctx.journal),
    plannedSpendUstx: plan.plannedSpendUstx,
    runSpendCapUstx: ctx.runSpendCapUstx,
    label
  });
  assertMarketBroadcastAllowed({
    senderKey: wallet.key,
    wizardId,
    senderAddress: wallet.address,
    balanceUstx: plan.balanceUstx,
    stxOutflowUstx: plan.stxOutflowUstx,
    minerFeeUstx: ctx.minerFeeUstx,
    balanceFloorUstx: ctx.balanceFloorUstx,
    killReason: plan.killReason,
    nftAllowedCheck: checks.nftAllowed ?? null,
    paymentBalanceCheck: checks.paymentBalance ?? null,
    postConditions: call.postConditions
  });

  // The nonce the transaction is about to be signed with, read before the
  // intent is written so the write stays adjacent to the submit below. There is
  // deliberately no kill-switch check between the two: an intent standing for a
  // transaction that was provably never sent is a manual repair, and halting
  // one line earlier costs nothing.
  const intendedNonce = await readIntendedNonce({
    fetchImpl: io.fetchImpl,
    hiroUrl: ctx.hiroUrl,
    address: wallet.address ?? null
  });

  record({
    scenarioId,
    label,
    status: 'broadcasting',
    txid: null,
    contractId: call.contractId,
    functionName: call.functionName,
    argsHashHex: plan.argsHashHex,
    senderAddress: wallet.address ?? null,
    wizard: wizardId,
    intendedNonce,
    minerFeeUstx: String(ctx.minerFeeUstx),
    protocolFeeUstx: String(plan.stxOutflowUstx),
    expectedFailure: expect === 'failure',
    broadcastAt: iso(io.now()),
    resolution: null,
    resolvedBy: null,
    resolvedAt: null,
    note: null
  });

  let txid;
  try {
    const submitted = await io.submit({
      plan,
      call,
      broadcast: ctx.broadcast,
      wizardId,
      senderKey: wallet.key,
      senderAddress: wallet.address,
      minerFeeUstx: ctx.minerFeeUstx
    });
    txid = normaliseTxid(submitted?.txid);
  } catch (error) {
    // A throw here is not proof that nothing was sent. Leave the intent
    // standing so the next run resolves it by probe rather than re-sending.
    record({ status: 'broadcasting', error: errorMessage(error) });
    throw new RunHalt(
      'unresolved',
      `broadcasting ${label} failed: ${errorMessage(error)}. Whether the node accepted it before the error is not ` +
        'knowable from here, so this runner will not send it again. Re-run once the mempool is clear.',
      { step: key }
    );
  }

  record({ status: 'broadcast', txid });
  io.say(`    txid ${txid}`);
  io.say(`    watch https://explorer.hiro.so/txid/${txid}?chain=mainnet`);
  return settleStep({ io, ctx, key, label, txid, expect });
}

/** Wait for one recorded txid and turn its outcome into journal state. */
async function settleStep({ io, ctx, key, label, txid, expect }) {
  let outcome;
  try {
    outcome = await pollTransaction({
      fetchImpl: io.fetchImpl,
      hiroUrl: ctx.hiroUrl,
      txid,
      now: io.now,
      sleep: io.sleep,
      timeoutMs: ctx.confirmTimeoutMs,
      intervalMs: ctx.confirmPollMs,
      guard: ctx.guard,
      onPoll: ({ poll, elapsedMs, txStatus, known }) =>
        io.say(`    poll ${poll} (${Math.round(elapsedMs / 1000)}s): ${known ? txStatus : 'not visible yet'}`)
    });
  } catch (error) {
    if (error instanceof RunHalt && error.reason === 'kill-switch') {
      ctx.recordStep(key, { status: 'broadcast', note: 'kill switch engaged while waiting' });
      throw new RunHalt(
        'kill-switch',
        `${error.message} ${label} was already broadcast as ${txid} and may still confirm. The journal holds the ` +
          'transaction id; nothing here was undone and nothing was re-sent.',
        { step: key, txid }
      );
    }
    throw error;
  }

  if (outcome.outcome === 'timeout') {
    ctx.recordStep(key, { status: 'timeout', txid, txStatus: outcome.txStatus ?? 'pending' });
    throw new RunHalt(
      'timeout',
      `${label} did not reach a terminal status within ${Math.round(outcome.elapsedMs / 60000)} minutes. ` +
        `THIS IS NOT A FAILURE. Transaction ${txid} may still confirm, and the journal holds its id. Do not send ` +
        'this step again; re-run once it lands.',
      { step: key, txid }
    );
  }

  const feeRate = outcome.feeRate === null || outcome.feeRate === undefined ? null : String(outcome.feeRate);

  if (outcome.outcome === 'failed') {
    ctx.recordStep(key, {
      status: 'failed',
      txid,
      txStatus: outcome.txStatus,
      result: outcome.result ?? null,
      expectedFailure: expect === 'failure',
      actualMinerFeeUstx: feeRate
    });
    if (expect === 'failure') {
      io.say(`    ${label}: ended as ${outcome.txStatus}, which is what this scenario is here to observe`);
      return { outcome: 'failed', txid, txStatus: outcome.txStatus, result: outcome.result ?? null, blockHeight: outcome.blockHeight };
    }
    throw new RunHalt(
      'tx-failed',
      `${label} ended as ${outcome.txStatus} (${txid}). The run stops here and nothing is retried. ` +
        (String(outcome.txStatus).startsWith('abort')
          ? 'An abort still pays the miner fee. Read the transaction in the explorer before doing anything else.'
          : 'A dropped transaction spent nothing, but something replaced or evicted it. Find out what.'),
      { step: key, txid, txStatus: outcome.txStatus }
    );
  }

  ctx.recordStep(key, {
    status: 'confirmed',
    txid,
    txStatus: outcome.txStatus,
    result: outcome.result ?? null,
    confirmedBlock: outcome.blockHeight === null || outcome.blockHeight === undefined ? null : String(outcome.blockHeight),
    actualMinerFeeUstx: feeRate,
    confirmedAt: iso(io.now())
  });
  io.say(`    confirmed in block ${outcome.blockHeight ?? '?'}`);
  if (expect === 'failure') {
    // A silent success where a failure was expected is the single most
    // dangerous outcome scenario 8 can produce, because it means a wallet with
    // no sBTC just bought something. Say so loudly; the scenario fails on it.
    return { outcome: 'unexpected-success', txid, txStatus: outcome.txStatus, result: outcome.result ?? null, blockHeight: outcome.blockHeight };
  }
  return { outcome: 'success', txid, txStatus: outcome.txStatus, result: outcome.result ?? null, blockHeight: outcome.blockHeight };
}

/* ------------------------------------------------------------------ */
/* scenario helpers                                                    */
/* ------------------------------------------------------------------ */

const pass = (summary, detail = {}) => ({ status: 'passed', summary, ...detail });
const skip = (reason, detail = {}) => ({ status: 'skipped', reason, ...detail });
const fail = (reason, detail = {}) => ({ status: 'failed', reason, ...detail });

/**
 * Assert a market is usable for this core before anything is signed against it.
 *
 * The plan's central finding is that only the sponsored markets take v3-2-3,
 * and the whole run is built on it. Asserting it live rather than trusting the
 * table above is the difference between a runner that reports a changed
 * allowlist and one that pays a miner fee to discover it.
 */
async function checkNftAllowed({ io, ctx, market }) {
  try {
    const allowed = await readIsNftAllowed({
      fetchImpl: io.fetchImpl,
      hiroUrl: ctx.hiroUrl,
      market,
      senderAddress: ctx.senderForReads
    });
    return {
      name: 'nft allowed',
      market: market.contractId,
      ok: allowed,
      status: allowed ? 'allowed' : 'rejected',
      allowed
    };
  } catch (error) {
    return { name: 'nft allowed', market: market.contractId, ok: false, status: 'unavailable', error: errorMessage(error) };
  }
}

/** MIN-FEE-BUDGET, live, so a budget below it is refused before it is signed. */
async function checkFeeBudget({ io, ctx, market, feeBudgetUstx }) {
  let minimum = MIN_FEE_BUDGET_USTX;
  let source = 'constant';
  try {
    minimum = await readMinFeeBudget({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, market, senderAddress: ctx.senderForReads });
    source = 'live';
  } catch {
    // Unreadable: keep the compiled-in constant, and say so.
  }
  return {
    name: 'fee budget',
    ok: BigInt(feeBudgetUstx) >= minimum,
    minimumUstx: minimum,
    source,
    budgetUstx: BigInt(feeBudgetUstx)
  };
}

/** The zero-balance assertion scenarios 3, 4 and 8 exist to make. */
async function checkZeroTokenBalance({ io, ctx, market, address }) {
  if (market.payment.kind !== 'ft') {
    return { name: 'token balance', ok: true, status: 'not-applicable', note: 'this market settles in STX' };
  }
  try {
    const balance = await readTokenBalance({
      fetchImpl: io.fetchImpl,
      hiroUrl: ctx.hiroUrl,
      payment: market.payment,
      address,
      senderAddress: ctx.senderForReads
    });
    return {
      name: 'token balance',
      ok: balance === 0n,
      status: balance === 0n ? 'zero' : 'holds-token',
      balance,
      symbol: market.payment.symbol,
      address
    };
  } catch (error) {
    return { name: 'token balance', ok: false, status: 'unavailable', error: errorMessage(error), address };
  }
}

/** The listing a scenario is going to act on, verified against the chain. */
async function loadListing({ io, ctx, market, listingId }) {
  return readListing({
    fetchImpl: io.fetchImpl,
    hiroUrl: ctx.hiroUrl,
    market,
    listingId,
    senderAddress: ctx.senderForReads
  });
}

/**
 * List one token, verify the escrow on chain, and return the listing.
 *
 * Shared by scenarios 2, 3, 4, 6 and 9, because "list and check it really
 * happened" is the same work every time and a second copy of it would be a
 * second place for the verification to be weaker.
 */
/**
 * `proveZeroTokenBalance` asserts a SCENARIO's claim, not a contract rule.
 *
 * `list-token` does not care whether the seller holds any of the payment
 * token -- that is the whole point, and proving it is what the list-sbtc and
 * list-usdcx scenarios exist for. But a proof is only a proof from a wallet
 * that holds zero, so those scenarios pass `true`.
 *
 * Ordinary listing passes `false`. It has to: the Archivist earned 700 sats
 * when its sBTC plate sold, and with the assertion hardwired the runner then
 * refused to list anything else on sBTC from that wallet. Success at the thing
 * being tested made the tool refuse to do the thing. A guard that belongs to a
 * claim about the world does not belong in the code path that changes it.
 */
async function listAndVerify({ io, ctx, scenarioId, market, tokenId, priceAmount, feeBudgetUstx, sellerId, stepName = 'list', proveZeroTokenBalance = false }) {
  const wallet = ctx.walletFor(sellerId);
  const stepKey = `${scenarioId}:${stepName}`;
  // An earlier attempt at this exact step changes what the preconditions mean.
  // "The seller still owns it" and "nothing is listed yet" are true only before
  // the first attempt; after a crash mid-listing both are false precisely
  // BECAUSE the step worked, and a runner that refused on them would strand the
  // NFT in escrow and report a skip. Past that point runStep decides, by probe
  // and by nonce.
  const resuming = ctx.stepAttempted(stepKey);
  const nftAllowed = await checkNftAllowed({ io, ctx, market });
  const budgetCheck = await checkFeeBudget({ io, ctx, market, feeBudgetUstx });
  if (!budgetCheck.ok) {
    return {
      error: fail(
        `the fee budget ${groupDigits(feeBudgetUstx)} microSTX is below MIN-FEE-BUDGET ` +
          `${groupDigits(budgetCheck.minimumUstx)} (${budgetCheck.source}); list-token would abort with u105.`,
        { checks: { nftAllowed, budget: budgetCheck } }
      )
    };
  }
  // Read either way: the balance is worth reporting even when it is not
  // being asserted on, because "listed on sBTC while holding 700 sats" is a
  // fact a reader of the run report wants.
  const zeroToken = await checkZeroTokenBalance({ io, ctx, market, address: wallet.address });
  if (proveZeroTokenBalance && market.payment.kind === 'ft') {
    if (zeroToken.status === 'unavailable') {
      return { error: fail(`could not read the ${market.payment.symbol} balance of ${wallet.address}: ${zeroToken.error}`) };
    }
    if (!zeroToken.ok) {
      // Not a contract failure: the scenario's claim is "no token needed", and
      // a wallet that holds some proves nothing about that claim.
      return {
        error: fail(
          `${wallet.address} holds ${formatAmount(zeroToken.balance, market.payment.decimals, market.payment.symbol)}. ` +
            'This scenario proves a listing needs none of the payment token, so it is only meaningful from a wallet ' +
            'that holds zero. Use a wizard with no balance, or move the token out first.',
          { checks: { zeroToken } }
        )
      };
    }
  }

  if (!resuming) {
    const owner = await readNftOwner({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, tokenId, senderAddress: ctx.senderForReads });
    if (owner !== wallet.address) {
      return {
        error: skip(
          `#${tokenId} is owned by ${owner ?? 'nobody the core knows about'}, not ${wallet.address}. ` +
            'Pick a token this wizard owns, or run the inscribe scenario first.',
          { checks: { owner } }
        )
      };
    }
    const alreadyListed = await readListingIdByToken({
      fetchImpl: io.fetchImpl,
      hiroUrl: ctx.hiroUrl,
      market,
      tokenId,
      senderAddress: ctx.senderForReads
    });
    if (alreadyListed !== null) {
      return {
        error: skip(
          `#${tokenId} already has listing ${alreadyListed} open on ${market.label}; list-token would abort with u102. ` +
            `Cancel it first: ${ctx.recoveryCommand({ market, listingId: alreadyListed, sellerId })}`,
          { listingId: alreadyListed }
        )
      };
    }
  }

  const balanceBefore = await fetchStxBalance({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, address: wallet.address });
  const call = buildMarketCall({
    action: 'list-token',
    market,
    tokenId,
    priceAmount,
    feeBudgetUstx,
    senderAddress: wallet.address
  });

  const outcome = await runStep({
    io,
    ctx,
    key: stepKey,
    step: {
      scenarioId,
      label: `list #${tokenId} on the ${market.label} at ${formatAmount(priceAmount, market.payment.decimals, market.payment.symbol)}`,
      call,
      wizardId: sellerId,
      wallet,
      checks: { nftAllowed, budget: budgetCheck, zeroToken },
      // The listing exists exactly when the token maps to a listing id. That is
      // the state list-token produces and nothing else produces it.
      probe: async () => {
        const found = await readListingIdByToken({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, market, tokenId, senderAddress: ctx.senderForReads });
        return { landed: found !== null, detail: found };
      }
    }
  });
  if (outcome.outcome !== 'success') {
    return { error: fail(`the listing transaction ended as ${outcome.txStatus ?? outcome.outcome}`, { txid: outcome.txid }) };
  }

  // VERIFY ON CHAIN, not from the receipt.
  const listingId = await readListingIdByToken({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, market, tokenId, senderAddress: ctx.senderForReads });
  if (listingId === null) {
    return { error: fail(`the transaction confirmed but ${market.label} has no listing for #${tokenId}.`, { txid: outcome.txid }) };
  }
  const listing = await loadListing({ io, ctx, market, listingId });
  if (!listing) return { error: fail(`get-listing(${listingId}) returned none right after listing #${tokenId}.`) };

  const problems = [];
  if (listing.seller !== wallet.address) problems.push(`seller is ${listing.seller}, expected ${wallet.address}`);
  if (listing.tokenId !== BigInt(tokenId)) problems.push(`token-id is ${listing.tokenId}, expected ${tokenId}`);
  if (listing.price !== BigInt(priceAmount)) problems.push(`price is ${listing.price}, expected ${priceAmount}`);
  if (listing.feeBudget !== BigInt(feeBudgetUstx)) problems.push(`fee-budget is ${listing.feeBudget}, expected ${feeBudgetUstx}`);
  if (listing.budgetRemaining !== BigInt(feeBudgetUstx)) problems.push(`budget-remaining is ${listing.budgetRemaining}, expected the full ${feeBudgetUstx}`);
  if (listing.nftContract !== CORE_CONTRACT) problems.push(`nft-contract is ${listing.nftContract}, expected ${CORE_CONTRACT}`);

  const ownerAfter = await readNftOwner({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, tokenId, senderAddress: ctx.senderForReads });
  if (ownerAfter !== market.contractId) {
    problems.push(`#${tokenId} is owned by ${ownerAfter ?? 'nobody'} after listing, expected the escrow ${market.contractId}`);
  }
  const balanceAfter = await fetchStxBalance({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, address: wallet.address });
  const moved = balanceBefore - balanceAfter;
  // A recovered step moved the money before this process read the baseline, so
  // the delta is meaningless. The listing row and the escrowed owner still get
  // checked; only the arithmetic that needs a "before" is skipped, and the
  // report says which.
  if (!outcome.recovered && moved < BigInt(feeBudgetUstx)) {
    problems.push(
      `the seller's STX fell by ${groupDigits(moved)} microSTX, less than the ${groupDigits(feeBudgetUstx)} fee budget ` +
        'that should have been escrowed'
    );
  }

  ctx.rememberListing({ market, listingId, tokenId, sellerId, priceAmount, feeBudgetUstx, scenarioId });
  return {
    listing,
    listingId,
    txid: outcome.txid,
    recovered: outcome.recovered === true,
    balanceBefore,
    balanceAfter,
    budgetTakenUstx: moved,
    checks: { nftAllowed, budget: budgetCheck, zeroToken },
    problems
  };
}

/** Cancel one listing and verify the NFT and the FULL budget both came back. */
async function cancelAndVerify({ io, ctx, scenarioId, market, listing, sellerId, stepName = 'cancel' }) {
  const wallet = ctx.walletFor(sellerId);
  const stepKey = `${scenarioId}:${stepName}`;
  const resuming = ctx.stepAttempted(stepKey);
  if (listing.seller !== wallet.address) {
    return { error: skip(`listing ${listing.listingId} belongs to ${listing.seller}, not ${wallet.address}; cancel is seller-only (u100).`) };
  }
  if (!resuming && listing.sold) {
    return { error: skip(`listing ${listing.listingId} is already sold; cancel would abort with u106.`) };
  }

  const balanceBefore = await fetchStxBalance({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, address: wallet.address });
  const call = buildMarketCall({
    action: 'cancel',
    market,
    tokenId: listing.tokenId,
    listingId: listing.listingId,
    senderAddress: wallet.address,
    budgetRemainingUstx: listing.budgetRemaining
  });
  const outcome = await runStep({
    io,
    ctx,
    key: stepKey,
    step: {
      scenarioId,
      label: `cancel listing ${listing.listingId} on the ${market.label}`,
      call,
      wizardId: sellerId,
      wallet,
      checks: { nftAllowed: await checkNftAllowed({ io, ctx, market }) },
      // A cancelled listing is deleted outright, so the token maps to nothing.
      probe: async () => {
        const found = await readListingIdByToken({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, market, tokenId: listing.tokenId, senderAddress: ctx.senderForReads });
        return { landed: found === null, detail: found };
      }
    }
  });
  if (outcome.outcome !== 'success') {
    return { error: fail(`the cancel transaction ended as ${outcome.txStatus ?? outcome.outcome}`, { txid: outcome.txid }) };
  }

  const problems = [];
  const after = await loadListing({ io, ctx, market, listingId: listing.listingId });
  if (after) problems.push(`listing ${listing.listingId} still exists after cancel; a cancel deletes the row`);
  const owner = await readNftOwner({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, tokenId: listing.tokenId, senderAddress: ctx.senderForReads });
  if (owner !== wallet.address) problems.push(`#${listing.tokenId} is owned by ${owner ?? 'nobody'} after cancel, expected ${wallet.address}`);
  const balanceAfter = await fetchStxBalance({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, address: wallet.address });
  const returned = balanceAfter - balanceBefore + ctx.minerFeeUstx;
  if (!outcome.recovered && returned < listing.budgetRemaining) {
    problems.push(
      `only ${groupDigits(returned)} microSTX came back (miner fee added back in) against a remaining budget of ` +
        `${groupDigits(listing.budgetRemaining)}. A cancel returns the budget in FULL.`
    );
  }
  ctx.forgetListing({ market, listingId: listing.listingId });
  return { txid: outcome.txid, returnedUstx: returned, recovered: outcome.recovered === true, balanceBefore, balanceAfter, problems };
}

/* ------------------------------------------------------------------ */
/* the scenarios themselves                                            */
/* ------------------------------------------------------------------ */

/** 2, 3, 4 — list on each sponsored market. */
const listScenario = (marketKey) => async ({ io, ctx }) => {
  const market = getMarket(marketKey);
  const scenarioId = `list-${marketKey}`;
  const tokenId = ctx.tokenFor(scenarioId);
  if (!tokenId) {
    return skip(
      `no inscription supplied to list on the ${market.label}. Pass --token-${marketKey} <id>, or --tokens with ` +
        'one id per listing scenario.'
    );
  }
  const listed = await listAndVerify({
    io,
    ctx,
    scenarioId,
    market,
    tokenId,
    priceAmount: ctx.priceFor(market),
    feeBudgetUstx: ctx.feeBudgetUstx,
    sellerId: ctx.sellerId,
    // list-sbtc and list-usdcx exist to prove a listing needs none of the
    // payment token, so from these scenarios the zero balance IS the evidence
    // -- unless the caller is listing for real and said so.
    proveZeroTokenBalance: ctx.proveZeroTokenBalance !== false && market.payment.kind === 'ft'
  });
  if (listed.error) return listed.error;
  if (listed.problems.length > 0) return fail(listed.problems.join('; '), { txid: listed.txid, listingId: listed.listingId });

  // Report the balance that was MEASURED, not the one the scenario hoped for.
  //
  // This sentence used to be hardwired to "held 0 ... throughout" for every FT
  // market. The zero-balance guard made that accidentally true; once a real
  // listing could proceed from a wallet holding some of the payment token, the
  // same sentence would have stated a falsehood in a permanent run report --
  // the Archivist holds 700 sats and the report would have said zero.
  const heldBalance = listed.checks?.zeroToken?.balance ?? null;
  const currency =
    market.payment.kind === 'ft'
      ? heldBalance === null
        ? ` The seller's ${market.payment.symbol} balance could not be read; the budget was charged in STX.`
        : ` The seller held ${formatAmount(heldBalance, market.payment.decimals, market.payment.symbol)} throughout, ` +
          'and the budget was charged in STX.'
      : '';
  return pass(
    `#${tokenId} is listing ${listed.listingId} at ${formatAmount(listed.listing.price, market.payment.decimals, market.payment.symbol)}, ` +
      `escrowed to ${market.contractId}, budget ${groupDigits(listed.listing.feeBudget)} microSTX taken from the seller.${currency}`,
    { txid: listed.txid, listingId: listed.listingId, tokenId: String(tokenId), market: market.key }
  );
};

/** 5 — a different wizard buys the STX listing, self-paid. */
const buyStxScenario = async ({ io, ctx }) => {
  const market = getMarket('stx');
  const scenarioId = 'buy-stx';
  const resolved = await ctx.resolveTargetListing({ io, ctx, scenarioId, market, source: 'list-stx' });
  if (resolved.error) return resolved.error;
  const { listing } = resolved;

  const buyerId = ctx.buyerId;
  const wallet = ctx.walletFor(buyerId);
  const stepKey = `${scenarioId}:buy`;
  const resuming = ctx.stepAttempted(stepKey);
  if (listing.seller === wallet.address) {
    return skip(`listing ${listing.listingId} was posted by the buyer wallet itself; pick a different --buyer.`);
  }
  // Sold is a refusal before the first attempt and the expected state after a
  // crashed one, so it only refuses while this run has never tried.
  if (!resuming && listing.sold) return skip(`listing ${listing.listingId} is already sold.`);

  const sellerBefore = await fetchStxBalance({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, address: listing.seller });
  const call = buildMarketCall({
    action: 'buy',
    market,
    tokenId: listing.tokenId,
    listingId: listing.listingId,
    priceAmount: listing.price,
    senderAddress: wallet.address
  });
  const outcome = await runStep({
    io,
    ctx,
    key: stepKey,
    step: {
      scenarioId,
      label: `buy listing ${listing.listingId} for ${formatAmount(listing.price, 6, 'STX')}, self-paid`,
      call,
      wizardId: buyerId,
      wallet,
      checks: { nftAllowed: await checkNftAllowed({ io, ctx, market }) },
      // A bought listing is marked sold and the token belongs to the buyer.
      probe: async () => {
        const owner = await readNftOwner({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, tokenId: listing.tokenId, senderAddress: ctx.senderForReads });
        return { landed: owner === wallet.address, detail: owner };
      }
    }
  });
  if (outcome.outcome !== 'success') return fail(`the buy transaction ended as ${outcome.txStatus ?? outcome.outcome}`, { txid: outcome.txid });

  const problems = [];
  const owner = await readNftOwner({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, tokenId: listing.tokenId, senderAddress: ctx.senderForReads });
  if (owner !== wallet.address) problems.push(`#${listing.tokenId} is owned by ${owner ?? 'nobody'} after the buy, expected the buyer ${wallet.address}`);
  const after = await loadListing({ io, ctx, market, listingId: listing.listingId });
  if (!after) {
    problems.push(`listing ${listing.listingId} was deleted; a sponsored buy keeps the row so the budget can be settled`);
  } else {
    if (!after.sold) problems.push(`listing ${listing.listingId} has no sold-at after the buy`);
    if (after.buyer !== wallet.address) problems.push(`listing ${listing.listingId} records buyer ${after.buyer}, expected ${wallet.address}`);
  }
  const sellerAfter = await fetchStxBalance({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, address: listing.seller });
  const feeBps = await readFeeBps({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, market, senderAddress: ctx.senderForReads });
  const expectedToSeller = listing.price - (listing.price * feeBps) / 10_000n;
  if (!outcome.recovered && sellerAfter - sellerBefore < expectedToSeller) {
    problems.push(
      `the seller received ${groupDigits(sellerAfter - sellerBefore)} microSTX, expected at least ${groupDigits(expectedToSeller)} ` +
        `(price ${groupDigits(listing.price)} less ${feeBps} bps)`
    );
  }
  ctx.markListingSold({ market, listingId: listing.listingId, buyerId });
  if (problems.length > 0) return fail(problems.join('; '), { txid: outcome.txid });
  return pass(
    `#${listing.tokenId} moved to ${wallet.address}, ${groupDigits(sellerAfter - sellerBefore)} microSTX moved to the seller, ` +
      `and listing ${listing.listingId} is marked sold.`,
    { txid: outcome.txid, listingId: listing.listingId, tokenId: String(listing.tokenId), market: market.key }
  );
};

/**
 * 6 — the same purchase, routed through the relayer.
 *
 * The relayer being down is a SKIP, not a failure. It is a separate service on
 * separate infrastructure, and a wizard run that went red because someone
 * restarted it would train everyone to ignore a red run.
 */
const buySponsoredScenario = async ({ io, ctx }) => {
  const market = getMarket('stx');
  const scenarioId = 'buy-sponsored';
  if (!io.sponsor) return skip('no sponsor relayer port was supplied to this run.');
  if (!ctx.signSponsored) return skip('no sponsored-transaction signer was supplied to this run.');

  // Ask the relayer first, before anything is listed. A quote that fails after
  // a listing exists would leave an open listing behind for a scenario that
  // never ran.
  let quote;
  try {
    quote = await io.sponsor.quote();
  } catch (error) {
    return skip(`the relayer did not answer /sponsor/quote: ${errorMessage(error)}`);
  }

  const resolved = await ctx.resolveTargetListing({
    io,
    ctx,
    scenarioId,
    market,
    source: 'buy-sponsored',
    createFrom: { tokenKey: 'buy-sponsored', sellerId: ctx.sellerId }
  });
  if (resolved.error) return resolved.error;
  const { listing } = resolved;

  const buyerId = ctx.buyerId;
  const wallet = ctx.walletFor(buyerId);
  if (listing.sold) return skip(`listing ${listing.listingId} is already sold.`);
  if (listing.budgetRemaining < quote.estimatedFeeUstx) {
    return skip(
      `listing ${listing.listingId} has ${groupDigits(listing.budgetRemaining)} microSTX of budget left against a ` +
        `relayer estimate of ${groupDigits(quote.estimatedFeeUstx)}. The relayer would refuse to sponsor it.`
    );
  }

  const call = buildMarketCall({
    action: 'buy',
    market,
    tokenId: listing.tokenId,
    listingId: listing.listingId,
    priceAmount: listing.price,
    senderAddress: wallet.address
  });

  const key = `${scenarioId}:sponsored-buy`;
  const existing = ctx.journal.steps[key] ?? null;
  if (existing && existing.status === 'confirmed') {
    io.say('    sponsored buy already recorded as confirmed; verifying against the chain only');
  } else {
    ctx.guard('the sponsored buy');
    assertRunSpendCap({
      committedUstx: committedMarketSpendUstx(ctx.journal),
      // The buyer pays the price and NOT the miner fee: that is the point.
      plannedSpendUstx: listing.price,
      runSpendCapUstx: ctx.runSpendCapUstx,
      label: 'the sponsored buy'
    });
    const balanceUstx = await fetchStxBalance({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, address: wallet.address });
    assertMarketBroadcastAllowed({
      senderKey: wallet.key,
      wizardId: buyerId,
      senderAddress: wallet.address,
      balanceUstx,
      stxOutflowUstx: listing.price,
      // The relayer pays the miner fee. Charging the buyer for it in the rail
      // would refuse purchases the whole feature exists to make possible.
      minerFeeUstx: 0n,
      balanceFloorUstx: ctx.balanceFloorUstx,
      killReason: killSwitchEngaged(ctx.env),
      nftAllowedCheck: await checkNftAllowed({ io, ctx, market }),
      postConditions: call.postConditions
    });

    const intendedNonce = await readIntendedNonce({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, address: wallet.address });
    ctx.recordStep(key, {
      scenarioId,
      label: 'sponsored buy',
      status: 'broadcasting',
      txid: null,
      contractId: call.contractId,
      functionName: call.functionName,
      argsHashHex: argsHashHex(call),
      senderAddress: wallet.address,
      wizard: buyerId,
      intendedNonce,
      minerFeeUstx: '0',
      protocolFeeUstx: String(listing.price),
      sponsored: true,
      broadcastAt: iso(io.now())
    });

    let signed;
    try {
      signed = await ctx.signSponsored({
        call,
        senderKey: wallet.key,
        senderAddress: wallet.address,
        nonce: intendedNonce,
        broadcast: ctx.broadcast
      });
    } catch (error) {
      ctx.recordStep(key, { status: 'broadcasting', error: errorMessage(error) });
      return fail(`signing the fee-0 sponsored transaction failed: ${errorMessage(error)}`);
    }
    if (!signed?.txHex) {
      ctx.recordStep(key, { status: 'broadcasting', error: 'the signer returned no transaction hex' });
      return fail('the sponsored signer returned no transaction hex.');
    }

    let job;
    try {
      job = await io.sponsor.submit({ txHex: signed.txHex, contractId: market.contractId, listingId: BigInt(listing.listingId) });
    } catch (error) {
      // A refusal is the relayer working, not the market failing. The signed
      // transaction was never broadcast by anyone, so nothing is stranded.
      ctx.recordStep(key, { status: 'abandoned', note: `relayer refused: ${errorMessage(error)}`, resolvedBy: 'relayer', resolvedAt: iso(io.now()) });
      return skip(`the relayer refused the submission: ${errorMessage(error)}`, { jobId: null });
    }
    ctx.recordStep(key, { status: 'broadcast', jobId: job?.id ?? null, jobState: job?.state ?? null, txid: job?.txids?.buy ? normaliseTxid(job.txids.buy) : null });

    const settled = await pollSponsorJob({ io, ctx, job, key });
    if (settled.status === 'skipped' || settled.status === 'failed') return settled;
  }

  // VERIFY ON CHAIN. The relayer's own job state is a claim about what it did;
  // ownership is the fact.
  const problems = [];
  const owner = await readNftOwner({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, tokenId: listing.tokenId, senderAddress: ctx.senderForReads });
  if (owner !== wallet.address) problems.push(`#${listing.tokenId} is owned by ${owner ?? 'nobody'}, expected the buyer ${wallet.address}`);
  const after = await loadListing({ io, ctx, market, listingId: listing.listingId });
  if (after && !after.sold) problems.push(`listing ${listing.listingId} has no sold-at after a settled sponsorship`);
  if (after && after.buyer && after.buyer !== wallet.address) problems.push(`listing ${listing.listingId} records buyer ${after.buyer}`);
  ctx.markListingSold({ market, listingId: listing.listingId, buyerId });
  if (problems.length > 0) return fail(problems.join('; '));

  const record = ctx.journal.steps[key] ?? {};
  return pass(
    `#${listing.tokenId} moved to ${wallet.address} through the relayer; the buyer signed at fee 0 and paid no ` +
      `network fee. Job ${record.jobId ?? 'unknown'}${record.txid ? `, buy tx ${record.txid}` : ''}.`,
    { txid: record.txid ?? null, listingId: listing.listingId, tokenId: String(listing.tokenId), market: market.key, jobId: record.jobId ?? null }
  );
};

/** Poll a relayer job to a terminal state, or say why it stopped. */
async function pollSponsorJob({ io, ctx, job, key }) {
  let current = job;
  for (let attempt = 0; attempt < ctx.sponsorPollAttempts; attempt += 1) {
    ctx.guard('polling the relayer');
    if (current?.state === 'SETTLED') {
      ctx.recordStep(key, {
        status: 'confirmed',
        jobState: 'SETTLED',
        txid: current.txids?.buy ? normaliseTxid(current.txids.buy) : null,
        confirmedAt: iso(io.now())
      });
      return { status: 'passed' };
    }
    if (current?.state === 'ABANDONED') {
      ctx.recordStep(key, { status: 'abandoned', jobState: 'ABANDONED', note: current.error ?? 'the relayer abandoned the job' });
      return skip(`the relayer abandoned the job: ${current.error ?? 'no reason given'}`);
    }
    io.say(`    relayer job ${current?.id ?? '?'}: ${current?.state ?? 'unknown'}`);
    await io.sleep(ctx.sponsorPollMs);
    try {
      current = await io.sponsor.status(current.id);
    } catch (error) {
      io.say(`    relayer status read failed: ${errorMessage(error)}`);
    }
    ctx.recordStep(key, { jobState: current?.state ?? null, txid: current?.txids?.buy ? normaliseTxid(current.txids.buy) : null });
  }
  // Out of attempts. The buy may still be in flight, so this is emphatically
  // not a failure and emphatically not a retry.
  ctx.recordStep(key, { status: 'broadcast', note: 'the relayer had not settled within the poll window' });
  return skip(
    `the relayer had not settled job ${current?.id ?? '?'} within ${ctx.sponsorPollAttempts} polls (last state ` +
      `${current?.state ?? 'unknown'}). The purchase may still complete; nothing was re-sent.`
  );
}

/** 7 — cancel a listing and prove the escrow and the full budget came back. */
const cancelScenario = async ({ io, ctx }) => {
  const scenarioId = 'cancel';
  const market = getMarket(ctx.marketFor(scenarioId, 'usdcx'));
  const resolved = await ctx.resolveTargetListing({ io, ctx, scenarioId, market, source: 'list-usdcx', requireUnsold: true });
  if (resolved.error) return resolved.error;
  const { listing } = resolved;

  const cancelled = await cancelAndVerify({ io, ctx, scenarioId, market, listing, sellerId: ctx.sellerId });
  if (cancelled.error) return cancelled.error;
  if (cancelled.problems.length > 0) return fail(cancelled.problems.join('; '), { txid: cancelled.txid });
  return pass(
    `#${listing.tokenId} came out of escrow and the full ${groupDigits(listing.budgetRemaining)} microSTX budget ` +
      'came back; the listing row is gone.',
    { txid: cancelled.txid, listingId: listing.listingId, tokenId: String(listing.tokenId), market: market.key }
  );
};

/**
 * 8 — buying an sBTC listing with no sBTC. This MUST fail.
 *
 * Two stages, and the split matters. The first is free: read the buyer's sBTC
 * balance and the listing, and establish that the payment leg cannot succeed.
 * That much needs no transaction and no miner fee.
 *
 * Cleanliness cannot be established that way. "Aborts by response with a
 * legible error, moves nothing, leaves the listing unsold" is a statement about
 * a transaction, and only a transaction can make it. So the second stage
 * broadcasts, and says so. `--no-onchain-failure-proof` stops after the first,
 * and the report records which of the two proved it.
 */
const buySbtcExpectedFailureScenario = async ({ io, ctx }) => {
  const market = getMarket('sbtc');
  const scenarioId = 'buy-sbtc-expected-failure';
  const resolved = await ctx.resolveTargetListing({ io, ctx, scenarioId, market, source: 'list-sbtc', requireUnsold: true });
  if (resolved.error) return resolved.error;
  const { listing } = resolved;

  const buyerId = ctx.buyerId;
  const wallet = ctx.walletFor(buyerId);

  // STAGE A, free.
  const zeroToken = await checkZeroTokenBalance({ io, ctx, market, address: wallet.address });
  if (zeroToken.status === 'unavailable') {
    return fail(`could not read the ${market.payment.symbol} balance of ${wallet.address}: ${zeroToken.error}`);
  }
  if (!zeroToken.ok) {
    return fail(
      `${wallet.address} holds ${formatAmount(zeroToken.balance, market.payment.decimals, market.payment.symbol)}, ` +
        'so a failed purchase would prove nothing about a wallet that cannot pay. Use a wizard holding zero.'
    );
  }
  const nftAllowed = await checkNftAllowed({ io, ctx, market });
  if (!nftAllowed.ok) {
    return fail(
      `${market.contractId} does not allow ${CORE_CONTRACT}, so a buy would fail for the wrong reason (u100) and ` +
        'this scenario would be measuring the allowlist rather than the balance.'
    );
  }
  if (listing.sold) return skip(`listing ${listing.listingId} is already sold, so there is nothing to fail at.`);
  if (listing.price <= 0n) return fail(`listing ${listing.listingId} has price ${listing.price}, so the payment leg would move nothing.`);

  const readOnlyProof =
    `${wallet.address} holds 0 ${market.payment.symbol} and listing ${listing.listingId} costs ` +
    `${formatAmount(listing.price, market.payment.decimals, market.payment.symbol)}; the ft-transfer in buy cannot succeed.`;

  if (!ctx.proveFailureOnChain) {
    return pass(`${readOnlyProof} Established read-only; no miner fee was spent. Pass --prove-failure-onchain to ` +
      'observe the abort itself, which is the only way to show the failure is clean rather than a hang.', {
      provenBy: 'read-only',
      listingId: listing.listingId,
      market: market.key
    });
  }

  // STAGE B: the transaction, deliberately.
  io.say('    this scenario now broadcasts a transaction it expects to abort. That abort costs a miner fee, and it');
  io.say('    is the only way to show the failure is clean rather than a silent hang.');
  const call = buildMarketCall({
    action: 'buy',
    market,
    tokenId: listing.tokenId,
    listingId: listing.listingId,
    priceAmount: listing.price,
    senderAddress: wallet.address
  });
  const outcome = await runStep({
    io,
    ctx,
    key: `${scenarioId}:buy`,
    step: {
      scenarioId,
      label: `buy listing ${listing.listingId} on the ${market.label} holding no ${market.payment.symbol} (expected to abort)`,
      call,
      wizardId: buyerId,
      wallet,
      expect: 'failure',
      checks: { nftAllowed, zeroToken },
      probe: async () => {
        // "Landed" for a step expected to fail means the purchase somehow
        // succeeded. Asking is what turns a lost txid into an alarm.
        const owner = await readNftOwner({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, tokenId: listing.tokenId, senderAddress: ctx.senderForReads });
        return { landed: owner === wallet.address, detail: owner };
      }
    }
  });

  if (outcome.outcome === 'unexpected-success') {
    return fail(
      `the buy SUCCEEDED from a wallet holding no ${market.payment.symbol}. That is a market bug, not a test ` +
        `failure: check ${outcome.txid} immediately.`,
      { txid: outcome.txid }
    );
  }
  if (outcome.outcome !== 'failed') {
    return fail(`the transaction ended as ${outcome.outcome}, which is neither the expected abort nor a success.`, { txid: outcome.txid });
  }

  const problems = [];
  const status = String(outcome.txStatus ?? '');
  if (!status.startsWith('abort')) {
    problems.push(`the transaction ended as ${status}, not an abort. A dropped transaction proves nothing about the contract.`);
  }
  const error = readErrorResult(outcome.result);
  if (error.code === null) {
    problems.push(`the abort carried no readable (err uN): ${error.repr ?? 'no result at all'}. A failure has to be legible.`);
  } else if (error.isMarketError) {
    problems.push(
      `the abort was (err u${error.code}) — ${error.meaning} — which is a market refusal, not the payment leg ` +
        'failing. This scenario is only meaningful when the buy gets as far as the token transfer.'
    );
  }
  // Nothing may have moved.
  const owner = await readNftOwner({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, tokenId: listing.tokenId, senderAddress: ctx.senderForReads });
  if (owner !== market.contractId) problems.push(`#${listing.tokenId} is owned by ${owner ?? 'nobody'} after the abort, expected the escrow to still hold it`);
  const after = await loadListing({ io, ctx, market, listingId: listing.listingId });
  if (!after) problems.push(`listing ${listing.listingId} disappeared after an aborted buy`);
  else if (after.sold) problems.push(`listing ${listing.listingId} is marked sold after an aborted buy`);

  if (problems.length > 0) return fail(problems.join('; '), { txid: outcome.txid });
  return pass(
    `${readOnlyProof} On chain it aborted as ${status} with (err u${error.code}), the escrow still holds ` +
      `#${listing.tokenId}, and the listing is unsold. Clean and legible, at the cost of one miner fee.`,
    { provenBy: 'broadcast', txid: outcome.txid, listingId: listing.listingId, market: market.key, errorCode: error.code }
  );
};

/** 9 — cancel then list again at a different price. No contract updates one. */
const relistScenario = async ({ io, ctx }) => {
  const scenarioId = 'relist';
  const market = getMarket(ctx.marketFor(scenarioId, 'sbtc'));
  const resolved = await ctx.resolveTargetListing({ io, ctx, scenarioId, market, source: 'list-sbtc', requireUnsold: true });
  if (resolved.error) return resolved.error;
  const { listing } = resolved;

  const originalId = String(listing.listingId);
  const originalPrice = listing.price;
  const newPrice = ctx.relistPriceFor(market);
  if (newPrice === originalPrice) {
    return fail(`the relist price ${newPrice} is the same as the current price; a relist has to change something.`);
  }

  const cancelled = await cancelAndVerify({ io, ctx, scenarioId, market, listing, sellerId: ctx.sellerId, stepName: 'cancel' });
  if (cancelled.error) return cancelled.error;
  if (cancelled.problems.length > 0) return fail(`the cancel half failed: ${cancelled.problems.join('; ')}`, { txid: cancelled.txid });

  const relisted = await listAndVerify({
    io,
    ctx,
    scenarioId,
    market,
    tokenId: listing.tokenId,
    priceAmount: newPrice,
    feeBudgetUstx: ctx.feeBudgetUstx,
    sellerId: ctx.sellerId,
    stepName: 'list'
  });
  if (relisted.error) return relisted.error;
  if (relisted.problems.length > 0) return fail(`the relist half failed: ${relisted.problems.join('; ')}`, { txid: relisted.txid });

  const problems = [];
  if (String(relisted.listingId) === originalId) {
    problems.push(`the new listing id ${relisted.listingId} is the same as the old one; a relist mints a fresh id`);
  }
  if (relisted.listing.price !== newPrice) {
    problems.push(`the new listing is priced ${relisted.listing.price}, expected ${newPrice}`);
  }
  if (problems.length > 0) return fail(problems.join('; '), { txid: relisted.txid });
  return pass(
    `listing ${originalId} at ${formatAmount(originalPrice, market.payment.decimals, market.payment.symbol)} became ` +
      `listing ${relisted.listingId} at ${formatAmount(newPrice, market.payment.decimals, market.payment.symbol)}.`,
    { txid: relisted.txid, listingId: relisted.listingId, previousListingId: originalId, tokenId: String(listing.tokenId), market: market.key }
  );
};

/**
 * 10 — the seller settles the leftover budget once the delay has passed.
 *
 * `claim-fee` and `settle-refund` are both sponsor-only in the window after a
 * sale, and the wizards are not the sponsor, so the reachable half is the
 * seller's self-settle after REFUND-DELAY. Before that it is a skip with the
 * count, because a run that failed on a block height would be red every night
 * and mean nothing.
 */
const settlementScenario = async ({ io, ctx }) => {
  const scenarioId = 'settlement';
  const market = getMarket(ctx.marketFor(scenarioId, 'stx'));
  // The listing scenario 2 opened and scenario 5 bought. `buy-stx` never
  // remembers a listing of its own — it acts on one — so the source is the
  // scenario that created the row rather than the one that changed it.
  const resolved = await ctx.resolveTargetListing({ io, ctx, scenarioId, market, source: 'list-stx', requireSold: true });
  if (resolved.error) return resolved.error;
  const { listing } = resolved;

  if (!listing.sold) return skip(`listing ${listing.listingId} has not been sold, so settle-refund would abort with u107.`);
  const sellerId = ctx.wizardForAddress(listing.seller);
  if (!sellerId) {
    return skip(`listing ${listing.listingId} belongs to ${listing.seller}, which is not one of the wizards in this run.`);
  }
  const wallet = ctx.walletFor(sellerId);

  let delay = REFUND_DELAY_BLOCKS;
  try {
    delay = await readRefundDelay({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, market, senderAddress: ctx.senderForReads });
  } catch {
    // Unreadable: the compiled-in constant is the contract's own value.
  }
  const tip = await readChainTip({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl });
  const unlockAt = listing.soldAt + delay;
  if (tip < unlockAt) {
    return skip(
      `listing ${listing.listingId} sold at block ${groupDigits(listing.soldAt)} and the seller may not settle until ` +
        `${groupDigits(unlockAt)}. The tip is ${groupDigits(tip)}, so ${groupDigits(unlockAt - tip)} blocks remain ` +
        `(REFUND-DELAY is ${delay}). Settling now would abort with u109.`,
      { blocksRemaining: String(unlockAt - tip), listingId: listing.listingId, market: market.key }
    );
  }

  // The arithmetic the scenario is really about, checked before and after.
  const expectedRefund = listing.feeBudget - listing.claimed;
  const problems = [];
  if (listing.budgetRemaining !== expectedRefund) {
    problems.push(
      `the listing says fee-budget ${groupDigits(listing.feeBudget)} less claimed ${groupDigits(listing.claimed)} = ` +
        `${groupDigits(expectedRefund)}, but budget-remaining is ${groupDigits(listing.budgetRemaining)}`
    );
  }

  const balanceBefore = await fetchStxBalance({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, address: wallet.address });
  const call = buildMarketCall({
    action: 'settle-refund',
    market,
    listingId: listing.listingId,
    tokenId: listing.tokenId,
    senderAddress: wallet.address,
    sellerAddress: listing.seller,
    budgetRemainingUstx: listing.budgetRemaining
  });
  const outcome = await runStep({
    io,
    ctx,
    key: `${scenarioId}:settle-refund`,
    step: {
      scenarioId,
      label: `settle-refund listing ${listing.listingId} as the seller, ${groupDigits(listing.budgetRemaining)} microSTX unclaimed`,
      call,
      wizardId: sellerId,
      wallet,
      checks: { nftAllowed: await checkNftAllowed({ io, ctx, market }) },
      // Settling deletes the row, so its absence is the state to look for.
      probe: async () => {
        const found = await loadListing({ io, ctx, market, listingId: listing.listingId });
        return { landed: found === null, detail: found };
      }
    }
  });
  if (outcome.outcome !== 'success') return fail(`the settle transaction ended as ${outcome.txStatus ?? outcome.outcome}`, { txid: outcome.txid });

  const after = await loadListing({ io, ctx, market, listingId: listing.listingId });
  if (after) problems.push(`listing ${listing.listingId} still exists after settle-refund; settling deletes the row`);
  const balanceAfter = await fetchStxBalance({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, address: wallet.address });
  const returned = balanceAfter - balanceBefore + ctx.minerFeeUstx;
  if (!outcome.recovered && returned < expectedRefund) {
    problems.push(
      `${groupDigits(returned)} microSTX came back (miner fee added back in) against an expected ` +
        `${groupDigits(expectedRefund)} = fee-budget ${groupDigits(listing.feeBudget)} less claimed ${groupDigits(listing.claimed)}`
    );
  }
  ctx.forgetListing({ market, listingId: listing.listingId });
  if (problems.length > 0) return fail(problems.join('; '), { txid: outcome.txid });
  return pass(
    `listing ${listing.listingId} settled: budget ${groupDigits(listing.feeBudget)} less claimed ` +
      `${groupDigits(listing.claimed)} returned ${groupDigits(expectedRefund)} microSTX to the seller, and the row is gone.`,
    { txid: outcome.txid, listingId: listing.listingId, market: market.key }
  );
};

const SCENARIO_RUNNERS = {
  'list-stx': listScenario('stx'),
  'list-sbtc': listScenario('sbtc'),
  'list-usdcx': listScenario('usdcx'),
  'buy-stx': buyStxScenario,
  'buy-sponsored': buySponsoredScenario,
  cancel: cancelScenario,
  'buy-sbtc-expected-failure': buySbtcExpectedFailureScenario,
  relist: relistScenario,
  settlement: settlementScenario
};

/* ------------------------------------------------------------------ */
/* the run                                                             */
/* ------------------------------------------------------------------ */

/**
 * Run the requested scenarios in plan order.
 *
 * Never throws for a condition it expects: a refusal, a failure, a timeout and
 * a kill are all returned as `{ ok: false, halted }`, because by the time any
 * of them happens there is state worth reporting — a txid, an open listing, an
 * NFT in escrow — and an exception thrown out of the middle of that loses it.
 */
export async function runMarketScenarios({ ports = {}, options = {} } = {}) {
  const io = { ...NULL_PORTS, ...ports };
  const {
    runId,
    scenarios = SCENARIO_IDS,
    broadcast = false,
    hiroUrl = DEFAULT_HIRO_URL,
    env = {},
    wallets = {},
    tokens = {},
    markets: marketOverrides = {},
    sellerId = 'archivist',
    buyerId = 'skeptic',
    listingId = null,
    priceUstx = DEFAULT_PRICE_USTX,
    relistPriceUstx = DEFAULT_RELIST_PRICE_USTX,
    feeBudgetUstx = MIN_FEE_BUDGET_USTX,
    /**
     * Whether a cross-currency listing must come from a wallet holding none of
     * the payment token.
     *
     * True by default, so `--scenario list-sbtc` still proves what it claims.
     * The collection sweep passes false: it is listing for real, and the
     * contract has never required a zero balance. See listAndVerify.
     */
    proveZeroTokenBalance = true,
    journalDir = HERE,
    runSpendCapUstx = DEFAULT_MARKET_RUN_SPEND_CAP_USTX,
    balanceFloorUstx = DEFAULT_BALANCE_FLOOR_USTX,
    minerFeeUstx = DEFAULT_MAX_TX_FEE_USTX,
    confirmTimeoutMs = DEFAULT_CONFIRM_TIMEOUT_MS,
    confirmPollMs = DEFAULT_CONFIRM_POLL_MS,
    mempoolWaitMs = DEFAULT_MEMPOOL_WAIT_MS,
    mempoolPollMs = DEFAULT_MEMPOOL_POLL_MS,
    sponsorPollAttempts = 40,
    sponsorPollMs = 3_000,
    proveFailureOnChain = true,
    signSponsored = null
  } = options;

  if (!runId || typeof runId !== 'string') throw new WizardSafetyError('runMarketScenarios needs a run id');
  const requested = (Array.isArray(scenarios) ? scenarios : [scenarios]).map((id) => getScenario(id).id);
  const ordered = SCENARIO_IDS.filter((id) => requested.includes(id));

  const mode = broadcast ? 'broadcast' : 'dry';
  const journalPath = marketJournalPathFor({ dir: journalDir, runId, mode });
  const startedAt = iso(io.now());
  const journal = io.readJournal(journalPath) ?? emptyMarketJournal({ runId, mode, startedAt });

  if (journal.version !== MARKET_JOURNAL_VERSION) {
    throw new WizardSafetyError(
      `the market journal at ${journalPath} is version ${journal.version}, but this runner writes version ` +
        `${MARKET_JOURNAL_VERSION}. Move it aside and read it before starting again.`
    );
  }
  if (journal.runId !== runId || journal.mode !== mode) {
    throw new WizardSafetyError(
      `the market journal at ${journalPath} is for run ${journal.runId} in ${journal.mode} mode, not ${runId} in ${mode} mode.`
    );
  }
  journal.steps ??= {};
  journal.scenarios ??= {};
  journal.listings ??= {};

  const save = () => {
    journal.updatedAt = iso(io.now());
    assertJournalSecretFree(
      journal,
      Object.values(wallets).map((wallet) => wallet?.key)
    );
    io.writeJournal(journalPath, journal);
  };

  const guard = (step) => {
    const reason = io.killSwitch(env);
    if (reason) throw new RunHalt('kill-switch', `kill switch engaged (${reason}) before ${step}. The run stops here.`, { step });
  };

  const addressToWizard = {};
  for (const id of PERSONA_IDS) {
    const address = wallets[id]?.address;
    if (address) addressToWizard[address] = id;
  }

  const ctx = {
    journal,
    journalPath,
    hiroUrl,
    env,
    broadcast,
    sellerId,
    buyerId,
    feeBudgetUstx: BigInt(feeBudgetUstx),
    runSpendCapUstx: BigInt(runSpendCapUstx),
    balanceFloorUstx: BigInt(balanceFloorUstx),
    minerFeeUstx: BigInt(minerFeeUstx),
    confirmTimeoutMs,
    confirmPollMs,
    mempoolWaitMs,
    mempoolPollMs,
    sponsorPollAttempts,
    sponsorPollMs,
    proveFailureOnChain,
    signSponsored,
    guard,
    senderForReads: wallets[sellerId]?.address ?? CORE_ADDRESS,
    walletFor: (id) => wallets[id] ?? { address: null, key: null },
    wizardForAddress: (address) => addressToWizard[address] ?? null,
    tokenFor: (scenarioId) => tokens[scenarioId] ?? null,
    marketFor: (scenarioId, fallback) => marketOverrides[scenarioId] ?? marketOverrides.default ?? fallback,
    proveZeroTokenBalance,
    priceFor: (market) => priceForMarket(priceUstx, market),
    relistPriceFor: (market) => priceForMarket(relistPriceUstx, market),
    explicitListingId: listingId === null ? null : String(listingId),
    /**
     * Has this exact step been tried before by this run?
     *
     * `abandoned` is deliberately not an attempt: the nonce proved that one
     * never reached the chain, so the world is exactly as it was and every
     * precondition means what it meant the first time.
     */
    stepAttempted: (key) => {
      const step = journal.steps[key];
      return Boolean(step) && step.status !== 'abandoned';
    },
    recordStep: (key, patch) => {
      if (patch.status && !STEP_STATUSES.includes(patch.status)) {
        throw new WizardSafetyError(`"${patch.status}" is not a known market step status`);
      }
      journal.steps[key] = { ...(journal.steps[key] ?? {}), ...patch, updatedAt: iso(io.now()) };
      save();
      return journal.steps[key];
    },
    rememberListing: ({ market, listingId: id, tokenId, sellerId: seller, priceAmount, feeBudgetUstx: budget, scenarioId }) => {
      journal.listings[`${market.contractId}#${id}`] = {
        market: market.key,
        contractId: market.contractId,
        listingId: String(id),
        tokenId: String(tokenId),
        seller,
        priceAmount: String(priceAmount),
        feeBudgetUstx: String(budget),
        scenarioId,
        state: 'open',
        openedAt: iso(io.now())
      };
      save();
    },
    markListingSold: ({ market, listingId: id, buyerId: buyer }) => {
      const row = journal.listings[`${market.contractId}#${id}`];
      if (row) {
        row.state = 'sold';
        row.buyer = buyer;
        save();
      }
    },
    forgetListing: ({ market, listingId: id }) => {
      const row = journal.listings[`${market.contractId}#${id}`];
      if (row) {
        row.state = 'closed';
        save();
      }
    },
    recoveryCommand: ({ market, listingId: id, sellerId: seller }) =>
      `node scripts/wizard/market-run.mjs --run ${runId} --scenario cancel --market ${market.key} ` +
      `--listing-id ${id} --seller ${seller ?? sellerId} --broadcast`,
    resolveTargetListing
  };

  const results = [];
  let halted = null;

  try {
    guard('the first scenario');
    save();

    for (const id of ordered) {
      const scenario = getScenario(id);
      guard(`scenario ${scenario.number} (${scenario.id})`);

      const previous = journal.scenarios[id];
      if (previous?.status === 'passed') {
        io.say(`\n  ${scenario.number}. ${scenario.title}: already passed in this run's journal`);
        results.push({ ...scenario, ...previous, replayed: true });
        continue;
      }

      io.say(`\n  ${scenario.number}. ${scenario.title}`);
      let outcome;
      try {
        outcome = (await SCENARIO_RUNNERS[id]({ io, ctx })) ?? fail('the scenario returned nothing');
      } catch (error) {
        if (error instanceof RunHalt) throw error;
        if (error instanceof WizardSafetyError) {
          outcome = fail(error.message);
        } else {
          throw error;
        }
      }
      const row = {
        ...scenario,
        status: outcome.status,
        summary: outcome.summary ?? null,
        reason: outcome.reason ?? null,
        txid: outcome.txid ?? null,
        listingId: outcome.listingId ?? null,
        tokenId: outcome.tokenId ?? null,
        market: outcome.market ?? null,
        detail: outcome
      };
      journal.scenarios[id] = {
        status: row.status,
        summary: row.summary,
        reason: row.reason,
        txid: row.txid,
        listingId: row.listingId,
        finishedAt: iso(io.now())
      };
      save();
      results.push(row);
      io.say(`     ${row.status.toUpperCase()}: ${row.summary ?? row.reason ?? ''}`);

      // Stop on the first failure. A skip is not a failure and carries on.
      if (row.status === 'failed') {
        for (const later of ordered.slice(ordered.indexOf(id) + 1)) {
          results.push({ ...getScenario(later), status: 'blocked', reason: `blocked by ${scenario.id}, which failed` });
        }
        break;
      }
    }
  } catch (error) {
    if (error instanceof RunHalt || error instanceof WizardSafetyError) {
      halted = {
        reason: error instanceof RunHalt ? error.reason : 'safety',
        message: error.message,
        detail: error instanceof RunHalt ? error.detail : {}
      };
      for (const later of ordered) {
        if (!results.some((row) => row.id === later)) {
          results.push({ ...getScenario(later), status: 'blocked', reason: `blocked: the run halted (${halted.reason})` });
        }
      }
    } else {
      throw error;
    }
  }

  const cleanup = await surveyCleanup({ io, ctx });

  return {
    ok: halted === null && !results.some((row) => row.status === 'failed'),
    halted,
    runId,
    mode,
    broadcast,
    journalPath,
    journal,
    scenarios: results,
    cleanup,
    committedUstx: committedMarketSpendUstx(journal),
    runSpendCapUstx: BigInt(runSpendCapUstx)
  };
}

/**
 * One configured price, in each market's own base unit.
 *
 * A run is configured once, in microSTX, and three markets settle in three
 * different units. Carrying the number across unchanged is the expensive
 * mistake: 100,000 base units is 0.1 STX and 0.001 BTC, which at any plausible
 * price is a listing worth roughly a thousand times what was intended, on the
 * one market whose buyers are not the fleet.
 *
 * So the magnitude is held, not the nominal value: shift by the difference in
 * decimals, in whichever direction, and floor at one base unit so a price can
 * never round to zero and abort with u103. 100,000 microSTX becomes 1,000
 * satoshis and 100,000 USDCx base units.
 */
export function priceForMarket(priceUstx, market) {
  const base = BigInt(priceUstx);
  const decimals = market.payment.kind === 'stx' ? 6 : market.payment.decimals;
  if (decimals === 6) return base;
  const scaled = decimals > 6 ? base / 10n ** BigInt(decimals - 6) : base * 10n ** BigInt(6 - decimals);
  return scaled > 0n ? scaled : 1n;
}

/**
 * Which listing a scenario acts on: the flag, then this run's journal, then the
 * chain, then a skip that names what would satisfy it.
 *
 * This is what makes every scenario runnable on its own. `--scenario cancel`
 * with a `--listing-id` needs nothing else to have run; without one it looks
 * for the listing this run opened; failing that it says so rather than
 * inventing a target.
 */
async function resolveTargetListing({ io, ctx, scenarioId, market, source, requireUnsold = false, requireSold = false, createFrom = null }) {
  const from = async (id) => {
    const listing = await readListing({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, market, listingId: id, senderAddress: ctx.senderForReads });
    return listing;
  };

  let listing = null;
  let origin = null;

  if (ctx.explicitListingId !== null) {
    listing = await from(ctx.explicitListingId);
    origin = '--listing-id';
    if (!listing) {
      return { error: skip(`--listing-id ${ctx.explicitListingId} does not exist on ${market.label}.`) };
    }
  }

  if (!listing) {
    const remembered = Object.values(ctx.journal.listings ?? {}).filter(
      (row) => row.contractId === market.contractId && (row.scenarioId === source || row.scenarioId === scenarioId)
    );
    for (const row of remembered) {
      const found = await from(row.listingId);
      if (found) {
        listing = found;
        origin = `this run's ${row.scenarioId} scenario`;
        break;
      }
    }
  }

  if (!listing) {
    const tokenId = ctx.tokenFor(source) ?? ctx.tokenFor(scenarioId);
    if (tokenId) {
      const id = await readListingIdByToken({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, market, tokenId, senderAddress: ctx.senderForReads });
      if (id !== null) {
        listing = await from(id);
        origin = `the open listing for #${tokenId}`;
      }
    }
  }

  // Nothing to act on. Some scenarios are allowed to create their own subject:
  // the sponsored buy needs an unsold STX listing and the run has already
  // consumed the one scenario 2 made.
  if (!listing && createFrom) {
    const tokenId = ctx.tokenFor(createFrom.tokenKey);
    if (!tokenId) {
      return {
        error: skip(
          `no unsold listing on the ${market.label} to buy, and no --token-${createFrom.tokenKey} to make one from.`
        )
      };
    }
    const made = await listAndVerify({
      io,
      ctx,
      scenarioId,
      market,
      tokenId,
      priceAmount: ctx.priceFor(market),
      feeBudgetUstx: ctx.feeBudgetUstx,
      sellerId: createFrom.sellerId,
      stepName: 'setup-list'
    });
    if (made.error) return { error: made.error };
    if (made.problems.length > 0) return { error: fail(`setting up a listing to buy failed: ${made.problems.join('; ')}`) };
    listing = made.listing;
    origin = 'a listing this scenario created for itself';
  }

  if (!listing) {
    return {
      error: skip(
        `no listing on the ${market.label} for this scenario to act on. Run ${source} first, or pass ` +
          `--listing-id <n> --market ${market.key}.`
      )
    };
  }
  if (requireUnsold && listing.sold) {
    return { error: skip(`listing ${listing.listingId} is already sold, and this scenario needs an unsold one.`) };
  }
  if (requireSold && !listing.sold) {
    return { error: skip(`listing ${listing.listingId} has not been sold, and this scenario needs a sold one.`) };
  }
  io.say(`     acting on listing ${listing.listingId} (${origin})`);
  return { listing, origin };
}

/* ------------------------------------------------------------------ */
/* cleanup                                                             */
/* ------------------------------------------------------------------ */

/**
 * What the run is leaving behind, asked of the chain rather than the journal.
 *
 * A run that ends with an NFT in escrow and nobody told is a run that costs
 * money quietly. Everything still open is reported with the exact command that
 * recovers it, including listings a previous crashed run left.
 */
export async function surveyCleanup({ io, ctx }) {
  const open = [];
  const sold = [];
  const problems = [];
  for (const row of Object.values(ctx.journal.listings ?? {})) {
    let market;
    try {
      market = getMarket(row.contractId);
    } catch (error) {
      problems.push(errorMessage(error));
      continue;
    }
    let listing = null;
    try {
      listing = await readListing({ fetchImpl: io.fetchImpl, hiroUrl: ctx.hiroUrl, market, listingId: row.listingId, senderAddress: ctx.senderForReads });
    } catch (error) {
      problems.push(`could not read listing ${row.listingId} on ${market.label}: ${errorMessage(error)}`);
      continue;
    }
    if (!listing) continue;
    const entry = {
      market: market.key,
      contractId: market.contractId,
      listingId: String(row.listingId),
      tokenId: String(listing.tokenId),
      seller: listing.seller,
      sellerId: row.seller ?? ctx.wizardForAddress(listing.seller),
      priceAmount: String(listing.price),
      budgetRemainingUstx: String(listing.budgetRemaining),
      sold: listing.sold,
      soldAt: listing.soldAt === null ? null : String(listing.soldAt)
    };
    if (listing.sold) {
      entry.recover =
        `node scripts/wizard/market-run.mjs --run ${ctx.journal.runId} --scenario settlement --market ${market.key} ` +
        `--listing-id ${row.listingId} --broadcast  (only ${REFUND_DELAY_BLOCKS} blocks after the sale)`;
      sold.push(entry);
    } else {
      entry.recover = ctx.recoveryCommand({ market, listingId: row.listingId, sellerId: entry.sellerId });
      open.push(entry);
    }
  }
  return { open, sold, problems, clean: open.length === 0 && sold.length === 0 && problems.length === 0 };
}

/* ------------------------------------------------------------------ */
/* rendering                                                           */
/* ------------------------------------------------------------------ */

const pad = (value, width) => String(value ?? '').padEnd(width);
const STATUS_MARK = {
  passed: 'PASS',
  failed: 'FAIL',
  skipped: 'SKIP',
  blocked: 'BLOCKED',
  'not-run': '—'
};

/** One market call, as a plan a human can check before it is signed. */
export function formatMarketPlan(plan, { broadcast = false } = {}) {
  const lines = [];
  lines.push(
    broadcast
      ? `--- ${plan.label} (BROADCAST — this spends real STX and cannot be undone) ---`
      : `--- ${plan.label} (DRY RUN) ---`
  );
  lines.push(`wizard      : ${plan.wizard.name}`);
  lines.push(`wallet      : ${plan.senderAddress ?? '(none)'}`);
  lines.push(`contract    : ${plan.call.contractId}`);
  lines.push(`function    : ${plan.call.functionName}`);
  lines.push('arguments   :');
  for (const [index, argument] of plan.call.functionArgs.entries()) {
    lines.push(`  ${index}. ${cvToHex(argument)}`);
  }
  lines.push(`args hash   : ${plan.argsHashHex}`);
  lines.push(`post-conditions: ${plan.call.postConditionMode} mode`);
  for (const shape of plan.call.postConditionShape) lines.push(`  - ${shape}`);
  lines.push(
    `stx at risk : ${groupDigits(plan.stxOutflowUstx)} microSTX leaving the wallet, plus up to ` +
      `${groupDigits(plan.minerFeeUstx)} miner fee`
  );
  lines.push(
    `balance     : ${plan.balanceUstx === null ? `unknown (${plan.balanceError ?? 'not checked'})` : `${groupDigits(plan.balanceUstx)} microSTX`}` +
      `  floor ${groupDigits(plan.balanceFloorUstx)}`
  );
  if (plan.expect === 'failure') {
    lines.push('expectation : this transaction is EXPECTED TO ABORT. The scenario passes only if it does, cleanly.');
  }
  const checks = plan.checks ?? {};
  if (checks.nftAllowed) {
    lines.push(
      `is-nft-allowed: ${checks.nftAllowed.ok ? 'yes' : `NO (${checks.nftAllowed.status})`} for ${CORE_CONTRACT} on ${checks.nftAllowed.market}`
    );
  }
  if (checks.budget) {
    lines.push(
      `fee budget  : ${groupDigits(checks.budget.budgetUstx)} microSTX against a minimum of ` +
        `${groupDigits(checks.budget.minimumUstx)} (${checks.budget.source})`
    );
  }
  if (checks.zeroToken && checks.zeroToken.status !== 'not-applicable') {
    lines.push(
      `token balance: ${checks.zeroToken.status === 'zero' ? `0 ${checks.zeroToken.symbol}, which is the point of this scenario` : checks.zeroToken.status}`
    );
  }
  if (plan.killReason) lines.push(`KILL SWITCH : ENGAGED (${plan.killReason})`);
  return lines.join('\n');
}

/** The pass/fail/skip table. Pure string building. */
export function formatScenarioTable(report) {
  const lines = [];
  lines.push('');
  lines.push(
    report.broadcast
      ? `--- wizard market run ${report.runId} (BROADCAST) ---`
      : `--- wizard market run ${report.runId} (DRY RUN — injected fakes, nothing signed, nothing sent) ---`
  );
  lines.push('');
  lines.push(`  ${pad('#', 4)}${pad('scenario', 28)}${pad('result', 9)}detail`);
  lines.push(`  ${'-'.repeat(76)}`);
  for (const row of report.scenarios) {
    lines.push(`  ${pad(row.number, 4)}${pad(row.id, 28)}${pad(STATUS_MARK[row.status] ?? row.status, 9)}${row.summary ?? row.reason ?? ''}`);
  }
  const tally = (status) => report.scenarios.filter((row) => row.status === status).length;
  lines.push('');
  lines.push(
    `  ${tally('passed')} passed, ${tally('failed')} failed, ${tally('skipped')} skipped` +
      (tally('blocked') > 0 ? `, ${tally('blocked')} blocked` : '')
  );
  lines.push(
    `  committed: ${groupDigits(report.committedUstx)} microSTX (${microStxToStx(report.committedUstx)} STX) of a run cap of ` +
      `${groupDigits(report.runSpendCapUstx)}`
  );
  lines.push(
    `  journal  : ${report.journalPath}${report.broadcast ? '' : '  (a dry run keeps this in memory; the ids and txids above are invented)'}`
  );

  lines.push('');
  if (report.cleanup?.clean) {
    lines.push('  cleanup  : nothing left open. No NFT is in escrow and no listing is outstanding.');
  } else {
    lines.push('  cleanup  : this run is leaving state behind.');
    for (const row of report.cleanup?.open ?? []) {
      lines.push(`    OPEN  listing ${row.listingId} on ${row.market}: #${row.tokenId} is in escrow, ${groupDigits(row.budgetRemainingUstx)} microSTX budget held`);
      lines.push(`          recover: ${row.recover}`);
    }
    for (const row of report.cleanup?.sold ?? []) {
      lines.push(`    SOLD  listing ${row.listingId} on ${row.market}: sold, ${groupDigits(row.budgetRemainingUstx)} microSTX budget still escrowed`);
      lines.push(`          recover: ${row.recover}`);
    }
    for (const problem of report.cleanup?.problems ?? []) lines.push(`    ?     ${problem}`);
  }

  if (report.halted) {
    lines.push('');
    lines.push(`  HALTED (${report.halted.reason})`);
    for (const line of String(report.halted.message).split('\n')) lines.push(`    ${line}`);
    if (report.halted.reason === 'timeout') {
      lines.push('    A timeout is not a failed transaction. Nothing here should be re-broadcast.');
    }
  } else if (!report.broadcast) {
    lines.push('');
    lines.push('  Dry run complete. Nothing was signed and nothing was sent.');
  }
  return lines.join('\n');
}
