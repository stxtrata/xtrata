/**
 * Xtrata Agent One — sponsor relayer for STX-free marketplace buys.
 *
 * A buyer signs the market `buy` call as a Stacks sponsored transaction
 * (fee 0). This service validates the payload, attaches the mining fee from
 * its hot wallet (sponsorTransaction), broadcasts, then settles: after the
 * buy confirms it calls `claim-fee` on the sponsored market contract to
 * reimburse itself from the seller's escrowed fee budget, and
 * `settle-refund` to return the unused remainder ("dust") to the seller.
 *
 * Companion contracts: xtrata-market-sponsored-{sbtc,usdcx}-v1.0.
 * Style follows core.mjs: state-file jobs, resumable, MOCK-able. All chain
 * side effects go through an injectable `chain` object so the test suite
 * (tests/sponsor-service.test.mjs, node --test) runs fully offline.
 *
 * Wiring: server/server.mjs mounts createSponsorService(...).handlers as
 *   POST /sponsor/quote  POST /sponsor/submit  GET /sponsor/status/:jobId
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  deserializeTransaction, sponsorTransaction, broadcastTransaction,
  makeContractCall, callReadOnlyFunction, cvToJSON, uintCV, AuthType, PayloadType,
  AnchorMode, PostConditionMode, getAddressFromPrivateKey, TransactionVersion
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- config
export const DEFAULTS = {
  feeMultiplier: Number(process.env.SPONSOR_FEE_MULTIPLIER || '3'),
  minBudgetUstx: 50_000n,                 // must match MIN-FEE-BUDGET in the contracts
  maxFeeUstx: BigInt(process.env.SPONSOR_MAX_FEE_USTX || '2000000'), // never attach more than 2 STX
  quoteTtlMs: 5 * 60_000,
  lowBalanceUstx: BigInt(process.env.SPONSOR_LOW_BALANCE_USTX || '10000000'), // refuse below 10 STX
  maxUnsettledJobs: Number(process.env.SPONSOR_MAX_UNSETTLED || '20'),
  maxJobsPerAddress: Number(process.env.SPONSOR_MAX_PER_ADDRESS || '5'), // per rolling hour
  rateWindowMs: 3_600_000,
  settleTimeoutMs: Number(process.env.SPONSOR_SETTLE_TIMEOUT_MS || String(2 * 3_600_000)),
  stateDir: process.env.SPONSOR_STATE_DIR || path.join(__dirname, 'job-state', 'sponsor')
};

/** Markets this relayer will sponsor. contractId → { buyFunction } */
export const DEFAULT_MARKET_ALLOWLIST = {
  // populated at deploy time, e.g.:
  // 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-market-sponsored-sbtc-v1-1': { buyFunction: 'buy' },
  // drops contracts sponsor the free-claim function instead:
  // 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-drops-v1-0': { buyFunction: 'claim' }
};

export const JOB_STATES = ['RECEIVED', 'SPONSORED', 'CONFIRMED', 'CLAIMED', 'SETTLED', 'ABANDONED'];

// ---------------------------------------------------------------- pure helpers

/** Fee budget a seller should escrow at list time. */
export function quoteBudget(estimatedBuyFeeUstx, opts = DEFAULTS) {
  const est = BigInt(estimatedBuyFeeUstx);
  const mult = BigInt(Math.max(1, Math.round(opts.feeMultiplier)));
  let budget = est * mult;
  if (budget < opts.minBudgetUstx) budget = opts.minBudgetUstx;
  if (budget > opts.maxFeeUstx) budget = opts.maxFeeUstx;
  return budget;
}

/**
 * Validate a buyer-signed sponsored `buy` payload before we spend anything.
 * Throws Error with .code on the first violation. Returns parsed facts.
 */
export function validateSponsorPayload(txHex, { allowlist, listing, intendedFeeUstx, maxFeeUstx = DEFAULTS.maxFeeUstx, expectedListingId }) {
  const fail = (code, message) => { const e = new Error(message); e.code = code; throw e; };

  let tx;
  try { tx = deserializeTransaction(txHex); } catch { fail('BAD_TX', 'payload does not deserialize'); }

  if (tx.auth.authType !== AuthType.Sponsored) fail('NOT_SPONSORED', 'transaction is not sponsored-auth');
  const originFee = BigInt(tx.auth.spendingCondition.fee ?? 0n);
  if (originFee !== 0n) fail('NONZERO_FEE', 'origin fee must be 0');

  if (tx.payload.payloadType !== PayloadType.ContractCall) fail('NOT_CONTRACT_CALL', 'payload must be a contract call');
  const contractId = `${addrToStr(tx.payload.contractAddress)}.${tx.payload.contractName.content}`;
  const entry = allowlist[contractId];
  if (!entry) fail('CONTRACT_NOT_ALLOWED', `contract ${contractId} not allowlisted`);
  if (tx.payload.functionName.content !== entry.buyFunction) fail('FUNCTION_NOT_ALLOWED', `function must be ${entry.buyFunction}`);

  // SIGNED-ARG BINDING: buy/claim take (nft-contract <trait>, id uint).
  // The signed id must match the submitted listingId (when provided) so the
  // relayer never checks one listing's budget while broadcasting another.
  const args = tx.payload.functionArgs ?? [];
  const idArg = args[1];
  if (args.length !== 2 || typeof idArg?.value !== 'bigint') {
    fail('BAD_ARGS', 'call arguments must be (nft-contract <trait>, listing-id uint)');
  }
  if (expectedListingId !== undefined && idArg.value !== BigInt(expectedListingId)) {
    fail('LISTING_MISMATCH', 'listingId mismatch with signed transaction');
  }

  if (!tx.postConditions?.values?.length) fail('NO_POST_CONDITIONS', 'buyer post-conditions required');
  if (tx.postConditionMode !== PostConditionMode.Deny) fail('PC_MODE', 'post-condition mode must be deny');

  if (!listing) fail('LISTING_NOT_FOUND', 'listing unknown');
  if (listing.soldAt != null) fail('LISTING_SOLD', 'listing already sold');
  const remaining = BigInt(listing.budgetRemaining);
  const fee = BigInt(intendedFeeUstx);
  if (fee <= 0n) fail('BAD_FEE', 'intended fee must be positive');
  if (fee > maxFeeUstx) fail('FEE_TOO_LARGE', 'intended fee above relayer cap');
  if (remaining < fee) fail('BUDGET_TOO_SMALL', 'listing budget cannot cover the fee');

  return { tx, contractId };
}

import { addressToString as addrToStr, AddressVersion } from '@stacks/transactions';

/** c32 address of the transaction origin (the buyer) from its spending condition. */
export function txOriginAddress(tx) {
  const version = tx.version === TransactionVersion.Mainnet
    ? AddressVersion.MainnetSingleSig
    : AddressVersion.TestnetSingleSig;
  return addrToStr({ version, hash160: tx.auth.spendingCondition.signer, type: 0 });
}

// ---------------------------------------------------------------- state files

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }
function jobPath(dir, id) { return path.join(dir, `${id}.json`); }
export function loadJob(dir, id) {
  try { return JSON.parse(fs.readFileSync(jobPath(dir, id), 'utf8')); } catch { return null; }
}
export function saveJob(dir, job) {
  ensureDir(dir);
  const tmp = jobPath(dir, job.id) + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(job, (_, v) => (typeof v === 'bigint' ? v.toString() : v), 2));
  fs.renameSync(tmp, jobPath(dir, job.id));
  return job;
}
export function listJobs(dir) {
  try {
    return fs.readdirSync(dir).filter((f) => f.endsWith('.json'))
      .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
  } catch { return []; }
}

// ---------------------------------------------------------------- live chain adapter

export function makeLiveChain({ network = 'mainnet', sponsorKey, hiroKey }) {
  const net = network === 'testnet' ? new StacksTestnet() : new StacksMainnet();
  const ver = network === 'testnet' ? TransactionVersion.Testnet : TransactionVersion.Mainnet;
  const sponsorAddress = getAddressFromPrivateKey(sponsorKey, ver);
  const api = net.coreApiUrl;
  const h = (u, o = {}) => fetch(u, { ...o, headers: { ...(o.headers || {}), ...(hiroKey ? { 'x-api-key': hiroKey } : {}) } });
  return {
    sponsorAddress,
    async estimateBuyFee() {
      try {
        const r = await h(`${api}/v2/fees/transfer`);
        const rate = Number(await r.json());
        return BigInt(Math.max(3000, rate * 600)); // contract-call heavier than transfer
      } catch { return 30_000n; }
    },
    async getBalance(addr) {
      // v2 + throw: the deprecated v1 route is throttled regardless of API key, and
      // a zero default turned that throttling into "the relayer is out of funds".
      const r = await h(`${api}/extended/v2/addresses/${addr}/balances/stx`);
      if (!r.ok) throw new Error(`balance lookup failed (HTTP ${r.status})`);
      const j = await r.json();
      if (j == null || j.balance == null) throw new Error('balance lookup returned no balance');
      return BigInt(j.balance);
    },
    async getNonce(addr) {
      const r = await h(`${api}/extended/v1/address/${addr}/nonces`);
      const j = await r.json();
      return BigInt(j.possible_next_nonce ?? j.last_executed_tx_nonce + 1 ?? 0);
    },
    /** Read a sponsored-market listing → { budgetRemaining, soldAt } (null when absent). */
    async getListing(contractId, listingId) {
      const [contractAddress, contractName] = contractId.split('.');
      const cv = await callReadOnlyFunction({
        contractAddress, contractName, functionName: 'get-listing',
        functionArgs: [uintCV(BigInt(listingId))], senderAddress: sponsorAddress, network: net
      });
      const j = cvToJSON(cv);
      if (!j || j.value === null) return null;
      const rec = j.value.value;
      const opt = (f) => (rec[f] && rec[f].value !== null && rec[f].value !== undefined ? rec[f].value.value ?? rec[f].value : null);
      return {
        budgetRemaining: String(rec['budget-remaining'].value),
        soldAt: opt('sold-at') === null ? null : String(opt('sold-at')),
        seller: String(rec.seller.value),
        price: String(rec.price.value)
      };
    },
    async sponsorAndBroadcast({ txHex, feeUstx, nonce }) {
      const transaction = deserializeTransaction(txHex);
      const sponsored = await sponsorTransaction({
        transaction, sponsorPrivateKey: sponsorKey, fee: feeUstx, sponsorNonce: nonce, network: net
      });
      const res = await broadcastTransaction(sponsored, net);
      if (res.error) { const e = new Error(res.reason || res.error); e.code = 'BROADCAST'; throw e; }
      return { txid: res.txid };
    },
    async getTxStatus(txid) {
      const r = await h(`${api}/extended/v1/tx/0x${txid.replace(/^0x/, '')}`);
      const j = await r.json();
      return j.tx_status; // 'pending' | 'success' | 'abort_by_response' | ...
    },
    async contractCall({ contractId, functionName, args, fee, nonce }) {
      const [contractAddress, contractName] = contractId.split('.');
      const tx = await makeContractCall({
        contractAddress, contractName, functionName, functionArgs: args,
        senderKey: sponsorKey, network: net, fee, nonce,
        anchorMode: AnchorMode.Any, postConditionMode: PostConditionMode.Allow
      });
      const res = await broadcastTransaction(tx, net);
      if (res.error) { const e = new Error(res.reason || res.error); e.code = 'BROADCAST'; throw e; }
      return { txid: res.txid };
    }
  };
}

// ---------------------------------------------------------------- service

export function createSponsorService({
  chain,
  allowlist = DEFAULT_MARKET_ALLOWLIST,
  opts = DEFAULTS,
  now = () => Date.now(),
  log = () => {}
}) {
  ensureDir(opts.stateDir);
  let nonceLock = Promise.resolve(); // serialize sponsor-wallet nonce usage
  const seenPayloads = new Set(listJobs(opts.stateDir).map((j) => j.payloadHash).filter(Boolean));

  const unsettled = () => listJobs(opts.stateDir).filter((j) => !['SETTLED', 'ABANDONED'].includes(j.state));
  const recentByAddress = (addr) =>
    listJobs(opts.stateDir).filter((j) => j.buyer === addr && now() - j.createdAt < opts.rateWindowMs);

  async function quote() {
    const est = await chain.estimateBuyFee();
    return {
      estimatedFeeUstx: est.toString(),
      budgetUstx: quoteBudget(est, opts).toString(),
      minBudgetUstx: opts.minBudgetUstx.toString(),
      expiresAt: now() + opts.quoteTtlMs
    };
  }

  async function submit({ txHex, contractId, listingId, listing }) {
    // capacity + treasury guards first — cheap and abuse-resistant
    if (unsettled().length >= opts.maxUnsettledJobs) throw code('AT_CAPACITY', 'too many unsettled sponsorships');
    const balance = await chain.getBalance(chain.sponsorAddress);
    if (balance < opts.lowBalanceUstx) throw code('LOW_BALANCE', 'sponsor wallet below reserve; try self-paid buy');

    const intendedFee = await chain.estimateBuyFee();
    const { tx } = validateSponsorPayload(txHex, {
      allowlist, listing, intendedFeeUstx: intendedFee, maxFeeUstx: opts.maxFeeUstx,
      expectedListingId: listingId
    });

    const buyer = txOriginAddress(tx);
    if (recentByAddress(buyer).length >= opts.maxJobsPerAddress) throw code('RATE_LIMITED', 'too many recent sponsorships for this address');

    const payloadHash = hashHex(txHex);
    if (seenPayloads.has(payloadHash)) throw code('DUPLICATE', 'payload already sponsored');

    const id = `sp-${now().toString(36)}-${payloadHash.slice(0, 8)}`;
    let job = saveJob(opts.stateDir, {
      id, state: 'RECEIVED', createdAt: now(), contractId, listingId: String(listingId),
      buyer, payloadHash, feeUstx: intendedFee.toString(), txids: {}
    });
    seenPayloads.add(payloadHash);

    // nonce-serialized sponsorship
    const run = nonceLock.then(async () => {
      const nonce = await chain.getNonce(chain.sponsorAddress);
      const { txid } = await chain.sponsorAndBroadcast({ txHex, feeUstx: intendedFee, nonce });
      job = saveJob(opts.stateDir, { ...job, state: 'SPONSORED', txids: { ...job.txids, buy: txid } });
      return job;
    });
    nonceLock = run.catch(() => {});
    try {
      return await run;
    } catch (e) {
      saveJob(opts.stateDir, { ...job, state: 'ABANDONED', error: String(e.message || e) });
      throw e;
    }
  }

  /** One settlement step for one job; call from a poll loop. Resumable. */
  async function settleStep(jobId) {
    let job = loadJob(opts.stateDir, jobId);
    if (!job) throw code('NOT_FOUND', 'job unknown');
    switch (job.state) {
      case 'SPONSORED': {
        const status = await chain.getTxStatus(job.txids.buy);
        if (status === 'pending') {
          if (now() - job.createdAt > opts.settleTimeoutMs) {
            return saveJob(opts.stateDir, { ...job, state: 'ABANDONED', error: 'buy tx timed out' });
          }
          return job;
        }
        if (status !== 'success') {
          return saveJob(opts.stateDir, { ...job, state: 'ABANDONED', error: `buy tx ${status}` });
        }
        return saveJob(opts.stateDir, { ...job, state: 'CONFIRMED' });
      }
      case 'CONFIRMED': {
        const nonce = await chain.getNonce(chain.sponsorAddress);
        const { txid } = await chain.contractCall({
          contractId: job.contractId, functionName: 'claim-fee',
          args: [uintCV(BigInt(job.listingId)), uintCV(BigInt(job.feeUstx))],
          fee: 5_000n, nonce
        });
        return saveJob(opts.stateDir, { ...job, state: 'CLAIMED', txids: { ...job.txids, claim: txid } });
      }
      case 'CLAIMED': {
        const claimStatus = await chain.getTxStatus(job.txids.claim);
        if (claimStatus === 'pending') return job;
        // even if the claim aborted (e.g. cap race) still refund the seller
        const nonce = await chain.getNonce(chain.sponsorAddress);
        const { txid } = await chain.contractCall({
          contractId: job.contractId, functionName: 'settle-refund',
          args: [uintCV(BigInt(job.listingId))], fee: 5_000n, nonce
        });
        job = saveJob(opts.stateDir, {
          ...job, state: 'SETTLED',
          txids: { ...job.txids, refund: txid },
          receipt: {
            buyTx: job.txids.buy, claimTx: job.txids.claim, refundTx: txid,
            feeClaimedUstx: claimStatus === 'success' ? job.feeUstx : '0',
            settledAt: now()
          }
        });
        log('settled', job.id);
        return job;
      }
      default:
        return job;
    }
  }

  async function settleAll() {
    for (const j of unsettled()) {
      try { await settleStep(j.id); } catch (e) { log('settle-error', j.id, String(e.message || e)); }
    }
  }

  const status = (jobId) => loadJob(opts.stateDir, jobId);

  return { quote, submit, settleStep, settleAll, status, _internals: { unsettled } };
}

function code(c, m) { const e = new Error(m); e.code = c; return e; }
function hashHex(hex) {
  let h = 0n;
  const clean = hex.replace(/^0x/, '');
  for (let i = 0; i < clean.length; i += 8) {
    h = (h * 31n + BigInt(parseInt(clean.slice(i, i + 8).padEnd(8, '0'), 16))) % (2n ** 64n);
  }
  return h.toString(16).padStart(16, '0');
}
