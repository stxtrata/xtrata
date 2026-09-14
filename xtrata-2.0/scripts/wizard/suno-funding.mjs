/** Local-only Suno deposit signer. No HTTP listener and no browser-held wizard key. */
import { existsSync, writeFileSync, openSync, closeSync, fsyncSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { getAddressFromPrivateKey, TransactionVersion, validateStacksAddress,
  makeSTXTokenTransfer, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { loadWizardEnv, killSwitchEngaged, DEFAULT_SPEND_CAP_USTX,
  DEFAULT_BALANCE_FLOOR_USTX, DEFAULT_MAX_TX_FEE_USTX, fetchStxBalance } from './inscribe.mjs';
import { PERSONA_IDS } from './personas.mjs';

export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const amount = value => {
  if (!/^[0-9]+$/.test(String(value))) throw new Error('Invalid microSTX amount');
  return BigInt(value);
};

export function validateFunding(request, policy) {
  if (request.network !== 'mainnet') throw new Error('Suno funding supports mainnet only');
  if (!validateStacksAddress(request.recipient) || !request.recipient.startsWith('SP') || request.recipient === policy.address)
    throw new Error('Invalid deposit address');
  if (request.expectedFunder !== policy.address || request.user !== policy.address)
    throw new Error('Wizard funding identity mismatch');
  if (!/^job-[a-zA-Z0-9-]+$/.test(request.jobId || '')) throw new Error('Invalid job ID');
  if (!Array.isArray(request.playerHashes) || !request.playerHashes.length ||
      request.playerHashes.some(h => !/^[a-f0-9]{64}$/.test(h))) throw new Error('Missing player hashes');
  if (policy.playerHashes && JSON.stringify(request.playerHashes) !== JSON.stringify(policy.playerHashes))
    throw new Error('Player differs from the approved player files');
  const deposit = amount(request.amount), fee = amount(policy.feeUstx);
  if (deposit <= 0n || fee <= 0n || fee > amount(policy.maxFeeUstx)) throw new Error('Invalid deposit or fee exceeds cap');
  if (deposit + fee > amount(policy.spendCapUstx)) throw new Error('Deposit plus miner fee exceeds run spend cap');
  return { jobId:request.jobId, recipient:request.recipient, amount:String(deposit),
    network:'mainnet', expectedFunder:policy.address, user:policy.address,
    playerHashes:[...request.playerHashes], feeUstx:String(fee), spendUstx:String(deposit+fee) };
}

/** A journal authorizes at most ONE deposit, even across concurrent calls/restarts.
 * An uncertain submission remains reserved: reconcile the recorded txid, never pay again.
 * Ports allow real transaction construction and network fault tests without real wallets.
 */
export function createFundingHandler({ policy, journal, live = false, ports }) {
  return async request => {
    const plan = validateFunding(request, policy);
    if (!live) {
      writeFileSync(journal + '.plan.json', JSON.stringify({ mode:'dry-run', ...plan }, null, 2), { mode:0o600 });
      throw new Error('Dry run: funding plan saved locally; no transaction signed or sent');
    }
    if (!policy.playerHashes?.length) throw new Error('Live funding requires approved player files');
    if (ports.kill()) throw new Error('Wizard kill switch engaged');
    if (existsSync(journal)) throw new Error('Payment journal already reserved; reconcile before another run');
    const balance = await ports.balance();
    if (BigInt(balance) - BigInt(plan.spendUstx) < amount(policy.balanceFloorUstx)) throw new Error('Wizard balance floor would be breached');
    const nonce = await ports.nonce();
    if (ports.kill()) throw new Error('Wizard kill switch engaged');
    const fd = openSync(journal, 'wx', 0o600); closeSync(fd);
    const save = data => {
      const file = openSync(journal, 'w', 0o600);
      try { writeFileSync(file, JSON.stringify({ ...plan, ...data }, null, 2)); fsyncSync(file); }
      finally { closeSync(file); }
    };
    save({ state:'reserved' });
    try {
      const tx = await ports.sign(plan, nonce);
      const txid = tx.txid();
      save({ state:'signed', txid });
      if (ports.kill()) throw new Error('Wizard kill switch engaged');
      const result = await ports.broadcast(tx);
      if (!result?.txid || result.error) throw new Error('Submission not accepted');
      save({ state:'submitted', txid });
      return { txId:txid };
    } catch {
      // Do not forward SDK errors, which can contain transaction/key material.
      throw new Error('Funding stopped; inspect the local payment journal before retrying');
    }
  };
}

export function wizardIdentity(wizard, env = process.env) {
  if (!PERSONA_IDS.includes(wizard)) throw new Error('Select an existing wizard persona');
  loadWizardEnv({env});
  const key = env[`WIZARD_KEY_${wizard.toUpperCase()}`];
  if (!key) throw new Error('Wizard key is missing from the local wizard configuration');
  return { address:getAddressFromPrivateKey(key, TransactionVersion.Mainnet), key };
}

export function livePorts(identity) {
  const network = new StacksMainnet();
  return {
    kill: () => killSwitchEngaged(),
    balance: () => fetchStxBalance({address:identity.address}),
    nonce: async () => {
      const response = await fetch(`https://api.hiro.so/extended/v1/address/${identity.address}/nonces`);
      if (!response.ok) throw new Error('Cannot check wizard nonce');
      const body = await response.json();
      const next = body.possible_next_nonce;
      if (!Number.isSafeInteger(next) || next < 0 ||
          (body.detected_missing_nonces || []).length ||
          next !== (body.last_executed_tx_nonce ?? -1) + 1)
        throw new Error('Wizard has pending or uncertain transactions');
      return BigInt(next);
    },
    sign: (plan, nonce) => makeSTXTokenTransfer({ recipient:plan.recipient,
      amount:BigInt(plan.amount), fee:BigInt(plan.feeUstx), nonce,
      senderKey:identity.key, network, anchorMode:AnchorMode.Any, memo:'Suno More wizard' }),
    broadcast: tx => broadcastTransaction(tx, network)
  };
}

export const defaultPolicy = {
  feeUstx:'3000', maxFeeUstx:String(DEFAULT_MAX_TX_FEE_USTX),
  spendCapUstx:String(DEFAULT_SPEND_CAP_USTX), balanceFloorUstx:String(DEFAULT_BALANCE_FLOOR_USTX)
};

/** Install before navigation. The exposed capability is restricted to one top-level
 * page URL. Child players, other tabs and cross-origin navigation cannot fund jobs.
 */
export async function installSunoFunding(page, { url, address, fund }) {
  const allowed = new URL(url);
  await page.exposeBinding('__xtrataWizardPay', async ({frame}, request) => {
    const actual = new URL(frame.url());
    if (frame !== page.mainFrame() || actual.origin !== allowed.origin || actual.pathname !== allowed.pathname)
      throw new Error('Funding is restricted to the configured Suno page');
    return fund(request);
  });
  await page.addInitScript(({address, origin, pathname}) => {
    if (window !== window.top || location.origin !== origin || location.pathname !== pathname) return;
    let connected = true;
    Object.defineProperty(window, 'XtrataWizardFunding', { value:Object.freeze({
      getAddress: () => connected ? address : null,
      connect: async () => { connected = true; return address; },
      disconnect: async () => { connected = false; },
      pay: async request => {
        if (!connected) throw new Error('Wizard is disconnected');
        return window.__xtrataWizardPay(request);
      }
    }), writable:false, configurable:false });
  }, {address, origin:allowed.origin, pathname:allowed.pathname});
}
