// Launch canary: take xtrata-chess from nothing to a played first move, with
// every transaction signed by the browser wallet.
//
// No seed phrase, no private key, no environment variable. The page builds each
// request, shows it to you in full, and hands it to whichever wallet the browser
// has injected. Nothing is signed here and nothing is sent without a click.
//
// Deliberately step-gated. Each step unlocks only when the one before it has
// confirmed on chain and been read back, because the failure worth catching is
// the one where a transaction is accepted and then does not say what you meant.
//
// A note on stx_deployContract. Every other call shape here was proven across
// Xverse and Leather, desktop and mobile, by this repo's wallet canary. Contract
// deployment was not: nothing in this repo has ever deployed through a wallet.
// That is exactly why it gets shape fallbacks and why this page exists.

import {
  bytesToHex,
  deserialize,
  serializeNone,
  serializePrincipal,
  serializeSome,
  serializeStringAscii,
  serializeUint,
  sha256
} from './clarity.js';
import { CONTRACT_NAME } from './protocol.js';

// Which contracts this page can deploy. v2 leads because it is the one being
// launched; v1 stays so the canary can still verify the board already on chain.
export const CONTRACTS = {
  'xtrata-chess-log-v3': { charges: true, splitFees: true },
  'xtrata-chess-log-v2': { charges: true, splitFees: false },
  'xtrata-chess-log-v1': { charges: false, splitFees: false }
};
import { replay } from './replay.js';
import {
  collectProviders,
  connectWallet,
  disconnectWallet,
  isFramed,
  shimInstalled,
  usingHostBridge,
  walletRequest,
  walletCall,
  feePostConditions,
  callFeeParams,
  userCancelled,
  extractAddress
} from './wallet.js';

// Re-exported so the canary's own tests pin the behaviour it actually uses.
export const harvestAddress = extractAddress;

// The Clarity codec returns uints as BigInt so nothing is silently rounded.
// JSON.stringify throws on those, which meant a successful chain read could be
// reported as "read failed" purely because logging it threw, and Copy report
// died outright. Everything that stringifies goes through here.
function safeJson(value, indent) {
  return JSON.stringify(
    value,
    (_key, v) => (typeof v === 'bigint' ? `${v}` : v),
    indent
  );
}

// Contract state is written into innerHTML, and a principal or a name is not
// something to trust unescaped just because it came from a chain read.
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function short(address) {
  const value = String(address || '');
  return value.length > 14 ? `${value.slice(0, 5)}…${value.slice(-4)}` : value;
}

const API = {
  mainnet: 'https://api.mainnet.hiro.so',
  testnet: 'https://api.testnet.hiro.so'
};

const FIRST_MOVE = 'e2e4';

// Contract calls here are tiny. Left to itself a wallet suggests around 0.5 STX,
// which is roughly fifty times what this work is worth. 0.01 STX has confirmed
// on mainnet for this contract, so it is stated explicitly rather than guessed.
// The deploy is left alone: its cost scales with 8KB of source and it happens
// once, so the wallet's own estimate is the safer default there.
const CALL_FEE_USTX = 10_000;

// The contract's own fee, which is a different thing from the transaction fee.
// One is paid to the network for including the transaction; the other is paid
// to the contract's recipient for playing. Confusing them is how a post
// condition ends up permitting the wrong amount.

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Chain reads (no wallet needed)
// ---------------------------------------------------------------------------

async function readOnly(api, address, contract, fn, args = []) {
  const response = await fetch(`${api}/v2/contracts/call-read/${address}/${contract}/${fn}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender: address, arguments: args })
  });
  const body = await response.json();
  if (!body.okay) throw new Error(body.cause || `read ${fn} failed`);
  return deserialize(body.result);
}

async function txStatus(api, txid) {
  const response = await fetch(`${api}/extended/v1/tx/${txid}`);
  if (!response.ok) return { status: 'unknown', http: response.status };
  const body = await response.json();
  return { status: body.tx_status, result: body.tx_result?.repr, body };
}

// ---------------------------------------------------------------------------
// Deploy parameter shapes
//
// Unproven territory, so the page can try more than one rather than leaving you
// guessing which spelling a wallet wanted.
// ---------------------------------------------------------------------------

export const DEPLOY_SHAPES = {
  A: (source, network, name = CONTRACT_NAME) => ({
    name,
    clarityCode: source,
    clarityVersion: 3,
    network
  }),
  B: (source, network, name = CONTRACT_NAME) => ({
    name,
    clarityCode: source,
    clarityVersion: 3,
    network,
    postConditionMode: 'deny',
    postConditions: []
  }),
  C: (source, network, name = CONTRACT_NAME) => ({
    name,
    contractName: name,
    clarityCode: source,
    codeBody: source,
    clarityVersion: 3,
    network
  })
};

export function txidFrom(result) {
  return (
    result?.txid ||
    result?.txId ||
    result?.result?.txid ||
    result?.result?.txId ||
    null
  );
}

// ---------------------------------------------------------------------------
// The canary
// ---------------------------------------------------------------------------

export class LaunchCanary {
  constructor(elements) {
    this.el = elements;
    this.provider = null;
    this.address = null;
    this.network = 'mainnet';
    this.source = '';
    this.sourceHash = '';
    this.steps = {};
    this.entries = [];

    // Adding a control to the markup and forgetting to add it to this map has
    // now cost three debugging sessions. The symptom is always the same: _wire
    // throws on an undefined element, every later step never runs, and the page
    // renders perfectly while doing nothing. Say which one is missing instead.
    const missing = Object.entries(this.el)
      .filter(([, node]) => !node)
      .map(([name]) => name);
    if (missing.length) {
      const message = `canary is missing elements: ${missing.join(', ')}`;
      if (this.el.log) {
        this.el.log.innerHTML =
          `<div class="entry err"><span class="lvl">err</span><span class="msg">${message}</span></div>`;
      }
      throw new Error(message);
    }

    this._wire();
    this._renderWallet('idle');
    this._showBuild();
    this._loadSource();
    this.detect();
  }

  // ---- which build am I? --------------------------------------------
  //
  // A browser holding a stale copy of this page is the quiet failure mode: the
  // steps still work, they just deploy yesterday's contract. So the page states
  // its build, and checks that against the manifest each build writes.

  _showBuild() {
    const build = globalThis.__XTRATA_CHESS_BUILD__;
    if (!build) {
      this.el.buildId.textContent = 'dev';
      this.el.buildAt.textContent = 'running from source, not a build';
      this.el.buildCheck.textContent = '';
      return;
    }

    this.build = build;
    this.el.buildId.textContent = `${build.version} · ${build.buildId}`;
    this.el.buildAt.textContent = new Date(build.builtAt).toLocaleString();
    this.log('info', `build ${build.version} · ${build.buildId}`, build.builtAt);

    this._checkBuild();
  }

  async _checkBuild() {
    const el = this.el;
    try {
      // Cache-busted on purpose: whether its own cached copy is current is the
      // one question a browser cache cannot answer.
      const response = await fetch(`./build-manifest.json?t=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const manifest = await response.json();
      const latest = manifest?.canary;
      if (!latest?.buildId) throw new Error('no canary entry in the manifest');

      if (latest.buildId === this.build.buildId) {
        el.buildCheck.textContent = 'current';
        el.buildCheck.className = 'vcheck ok';
        return;
      }

      el.buildCheck.textContent = `STALE — latest is ${latest.buildId}`;
      el.buildCheck.className = 'vcheck stale';
      el.versionBar.classList.add('stale');
      this.log(
        'err',
        `this page is build ${this.build.buildId} but ${latest.buildId} exists — hard reload before doing anything`,
        { thisPage: this.build, latest }
      );
    } catch {
      // Offline, inscribed, or opened from a file. Not a failure: there is
      // nothing to compare against, and saying so beats a false all-clear.
      el.buildCheck.textContent = 'no manifest to compare';
      el.buildCheck.className = 'vcheck unknown';
    }
  }

  get api() {
    return API[this.network];
  }

  log(level, message, detail) {
    const entry = { level, message, detail, at: new Date().toISOString() };
    this.entries.push(entry);

    const row = document.createElement('div');
    row.className = `entry ${level}`;
    row.innerHTML =
      `<span class="lvl">${level}</span><span class="msg"></span>` +
      (detail === undefined ? '' : `<pre></pre>`);
    row.querySelector('.msg').textContent = message;
    if (detail !== undefined) {
      row.querySelector('pre').textContent =
        typeof detail === 'string' ? detail : safeJson(detail, 2);
    }
    this.el.log.prepend(row);
  }

  mark(step, state, note) {
    this.steps[step] = state;
    const node = this.el[`step${step}`];
    if (node) {
      node.dataset.state = state;
      const badge = node.querySelector('.state');
      if (badge) badge.textContent = note || state;
    }
    this._gate();
  }

  // Each button unlocks only when the step before it has been verified on chain.
  _gate() {
    this.el.btnPreflight.disabled = !this.address;
    // Deploying again cannot work: the name is spent. Offering the button after
    // a verified deploy invites a wallet call that will only ever hang.
    this.el.btnDeploy.disabled = this.steps[1] !== 'ok' || this.steps[2] === 'ok';
    this.el.btnVerifyDeploy.disabled = !this.deployTxid;
    this.el.btnOpen.disabled = this.steps[2] !== 'ok';
    this.el.btnVerifyOpen.disabled = !this.openTxid;
    this.el.btnMove.disabled = this.steps[3] !== 'ok';
    this.el.btnVerifyMove.disabled = !this.moveTxid;
  }

  _wire() {
    const el = this.el;
    el.network.addEventListener('change', () => {
      this.network = el.network.value;
      this.log('info', `network set to ${this.network}`);
      this._resetFrom(1);
    });
    el.contractVersion.addEventListener('change', () => {
      this.log('info', `switched to ${this.contractName}`);
      this._resetFrom(1);
      this._loadSource();
    });
    el.btnDetect.addEventListener('click', () => this.detect());
    el.btnConnect.addEventListener('click', () => (this.address ? this.disconnect() : this.connect()));
    el.btnDisconnect.addEventListener('click', () => this.disconnect());
    el.providers.addEventListener('change', () => {
      if (!this.address) this.log('info', `will connect using ${el.providers.value}`);
    });
    el.btnPreflight.addEventListener('click', () => this.preflight());
    el.btnDeploy.addEventListener('click', () => this.deploy());
    el.btnVerifyDeploy.addEventListener('click', () => this.verifyDeploy());
    el.btnOpen.addEventListener('click', () => this.openGame());
    el.btnVerifyOpen.addEventListener('click', () => this.verifyOpen());
    el.btnMove.addEventListener('click', () => this.firstMove());
    el.btnVerifyMove.addEventListener('click', () => this.verifyMove());
    el.btnReport.addEventListener('click', () => this.copyReport());

    el.btnReadState.addEventListener('click', () => this.readContractState());
    el.btnSetFee.addEventListener('click', () => this.setMoveFee());
    el.btnSetOpenFee.addEventListener('click', () => this.setOpenFee());
    el.btnSetRecipient.addEventListener('click', () => this.setFeeRecipient());
    el.btnTransfer.addEventListener('click', () => this.transferOwnership());
    el.btnRenounce.addEventListener('click', () => this.renounceOwnership());
  }

  _resetFrom(step) {
    if (step <= 2) this.alreadyDeployed = false;
    for (let i = step; i <= 4; i++) this.mark(i, 'waiting', 'not started');
    if (step <= 2) this.deployTxid = null;
    if (step <= 3) this.openTxid = null;
    if (step <= 4) this.moveTxid = null;
    this._gate();
  }

  get contractName() {
    // The shared constant rather than a literal, so adding a version in one
    // place cannot leave the canary quietly offering the previous one.
    return this.el.contractVersion?.value || CONTRACT_NAME;
  }

  // The network fee to suggest, matching the board's default and editable here
  // for the same reason it is editable there.
  get callFee() {
    return Number(this.el.callFee?.value) || CALL_FEE_USTX;
  }

  get charges() {
    return CONTRACTS[this.contractName]?.charges === true;
  }

  async _loadSource() {
    // Inlined by the build for the standalone page; fetched during development.
    const inlined = globalThis.__XTRATA_CHESS_CONTRACTS__?.[this.contractName];
    this.source =
      inlined || (await (await fetch(`./contracts/${this.contractName}.clar`)).text());
    this.sourceHash = bytesToHex(sha256(new TextEncoder().encode(this.source)));

    this.el.sourceInfo.textContent =
      `${this.contractName}.clar · ${this.source.length.toLocaleString()} bytes · sha256 ${this.sourceHash}`;
    this.log('info', `${this.contractName} loaded`, `sha256 ${this.sourceHash}`);

    this.el.feeNote.hidden = !this.charges;
  }

  // ---- 0 · wallet ---------------------------------------------------

  detect() {
    const found = collectProviders();
    this.el.providers.innerHTML = '';

    // Opening the file directly is the usual reason a wallet appears to be
    // missing. Extensions do not inject into file:// pages unless the user has
    // gone out of their way to allow it.
    if (globalThis.location?.protocol === 'file:') {
      this.el.fileWarning.hidden = false;
    }

    this.log('info', 'environment', {
      framed: isFramed(),
      xtrataShim: shimInstalled(),
      hostBridge: usingHostBridge()
    });

    if (!found.length) {
      const inSandbox = isFramed();
      this.log(
        'err',
        inSandbox
          ? 'no wallet in this frame yet — under the Xtrata runtime the shim installs a moment after load, so try Re-detect'
          : 'no Stacks wallet found in this page'
      );
      this.el.providers.textContent = 'none — install a wallet, unlock it, then Re-detect';
      return;
    }

    for (const entry of found) {
      const option = document.createElement('option');
      option.value = entry.label;
      option.textContent = entry.label;
      this.el.providers.appendChild(option);
    }
    this.provider = found[0];
    this.log('ok', `found ${found.length} provider(s), best first`, found.map((p) => p.label));
  }

  // One place that decides what the wallet panel looks like, so the button can
  // never disagree with whether we are actually connected.
  _renderWallet(state, detail) {
    const el = this.el;

    if (state === 'connecting') {
      el.btnConnect.disabled = true;
      el.btnConnect.textContent = detail ? `Asking ${detail}…` : 'Connecting…';
      el.btnConnect.className = 'go';
      el.btnDisconnect.hidden = true;
      el.providers.disabled = true;
      return;
    }

    if (state === 'connected') {
      el.btnConnect.disabled = false;
      el.btnConnect.className = 'connected';
      el.btnConnect.textContent = `Connected · ${short(this.address)}`;
      el.btnConnect.title = `${this.address}\nClick to disconnect and choose another wallet`;
      el.btnDisconnect.hidden = false;
      el.providers.disabled = true;
      el.walletHint.textContent = `Signing as ${this.address} via ${this.providerLabel}. Disconnect to switch wallets.`;
      return;
    }

    el.btnConnect.disabled = false;
    el.btnConnect.className = 'go';
    el.btnConnect.textContent = 'Connect';
    el.btnConnect.title = '';
    el.btnDisconnect.hidden = true;
    el.providers.disabled = false;
    el.walletHint.textContent =
      'Pick a wallet if more than one is listed, then Connect. Your wallet should open and ask you to approve; if it does not, it may be locked.';
  }

  disconnect() {
    this.address = null;
    this.provider = null;
    this.providerLabel = null;
    try {
      delete globalThis.XtrataWalletSession;
    } catch {
      // Sandboxed pages can refuse window writes.
    }
    this.el.address.textContent = '—';
    this.mark(0, 'waiting', 'not connected');
    this._renderWallet('idle');
    this._resetFrom(1);
    this.log('info', 'disconnected — pick a provider and connect again');
  }

  async connect() {
    const chosen = this.el.providers.value || null;
    this._renderWallet('connecting', chosen ? chosen.replace(/^window\./, '') : null);

    try {
      const session = await connectWallet({
        // Whatever is selected in the dropdown, and only that. Picking a wallet
        // has to mean the page uses it.
        preferredLabel: chosen,
        // Always go to the wallet. Reusing a cached session here would make
        // Connect look broken: nothing appears and nothing is proven.
        forcePrompt: true,
        onLog: (level, message, detail) => this.log(level, message, detail)
      });

      this.address = session.address;
      this.provider = session.provider || this.provider;
      this.providerLabel = session.provider?.label || chosen || 'unknown';
      this.el.address.textContent = session.address;

      this.mark(0, 'ok', session.network);
      this._renderWallet('connected');

      // A testnet address with mainnet selected is the mistake that costs a
      // contract name, so say it loudly rather than letting the deploy fail.
      if (session.network !== this.network) {
        this.log(
          'warn',
          `wallet is on ${session.network} but this page is set to ${this.network} — change one of them before deploying`
        );
      }
      this._gate();
    } catch (error) {
      this.mark(0, 'failed', 'not connected');
      this._renderWallet('idle');
      this.log('err', `connect failed: ${error.message}`);
      if (error.code === 'NO_ADDRESS') {
        this.log(
          'info',
          'every method was tried and none answered. Unlock the wallet, or pick a different provider above, then Connect again.'
        );
      }
    }
  }

  // ---- 1 · preflight (no wallet, nothing sent) -----------------------

  async preflight() {
    this.mark(1, 'running', 'checking');
    let allGood = true;

    try {
      const info = await (await fetch(`${this.api}/v2/info`)).json();
      this.log('ok', `node reachable, tip ${info.stacks_tip_height}`);
    } catch (error) {
      this.log('err', `node unreachable: ${error.message}`);
      allGood = false;
    }

    // A spent name is not automatically a problem. If it is spent by *this*
    // deployer with *these* bytes, the contract is simply already there, and the
    // right move is to skip the deploy rather than refuse to continue. The
    // launch canary was written assuming nothing existed yet, which made it
    // useless the moment it succeeded.
    try {
      const response = await fetch(
        `${this.api}/v2/contracts/interface/${this.address}/${this.contractName}`
      );

      if (!response.ok) {
        this.log('ok', `${this.contractName} is free on ${this.address}`);
      } else {
        const source = await (
          await fetch(`${this.api}/v2/contracts/source/${this.address}/${this.contractName}`)
        ).json();
        const onChain = bytesToHex(sha256(new TextEncoder().encode(source.source)));

        if (onChain === this.sourceHash) {
          this.log('ok', 'already deployed, and the on-chain source matches byte for byte', {
            contract: `${this.address}.${this.contractName}`,
            publishedAt: source.publish_height,
            sha256: onChain
          });
          this.alreadyDeployed = true;
          this.el.contractId.textContent = `${this.address}.${this.contractName}`;
          this.mark(2, 'ok', 'already deployed');
        } else {
          // The dangerous case: a contract of this name exists but is not this
          // code. Nothing downstream can be trusted, and the name cannot be
          // reused, so this is a full stop.
          this.log('err', 'A DIFFERENT CONTRACT ALREADY HOLDS THIS NAME', {
            expected: this.sourceHash,
            onChain
          });
          allGood = false;
        }
      }
    } catch (error) {
      this.log('warn', `could not check the name: ${error.message}`);
    }

    try {
      const balances = await (
        await fetch(`${this.api}/extended/v1/address/${this.address}/balances`)
      ).json();
      const available = BigInt(balances.stx.balance) - BigInt(balances.stx.locked);
      const stx = Number(available) / 1e6;
      this.log(stx >= 1 ? 'ok' : 'warn', `balance ${stx.toFixed(6)} STX available`);
      if (stx < 1) {
        this.log('warn', 'deploy plus two calls will not fit comfortably under 1 STX');
      }
    } catch (error) {
      this.log('warn', `could not read balance: ${error.message}`);
      allGood = false;
    }

    if (!this.source) {
      this.log('err', 'contract source has not loaded');
      allGood = false;
    }

    this.mark(1, allGood ? 'ok' : 'failed', allGood ? 'ready' : 'see log');
    if (allGood && this.alreadyDeployed) {
      this.mark(2, 'ok', 'already deployed');
      this.log('info', 'nothing to deploy — carry on at step 3');
    }
  }

  // ---- 2 · deploy ---------------------------------------------------

  async deploy() {
    const shape = this.el.deployShape.value;
    const params = DEPLOY_SHAPES[shape](this.source, this.network, this.contractName);

    const typed = prompt(
      `This deploys ${this.contractName} to ${this.network} as ${this.address}.\n` +
        `It is irreversible, the name can never be reused, and the contract can never be changed.\n\n` +
        `Type the contract name to continue:`
    );
    if (typed !== this.contractName) {
      this.log('warn', 'deploy not confirmed, nothing sent');
      return;
    }

    this.mark(2, 'running', 'awaiting wallet');
    this.log('info', `stx_deployContract shape ${shape}`, {
      ...params,
      clarityCode: `[${this.source.length} bytes, sha256 ${this.sourceHash}]`,
      codeBody: params.codeBody ? '[same]' : undefined
    });

    try {
      const { result, entry } = await walletCall('stx_deployContract', params, {
        onLog: (level, message, detail) => this.log(level, message, detail)
      });
      this.log('info', `signed via ${entry.label}`);
      const txid = txidFrom(result);
      if (!txid) {
        this.log('warn', 'wallet returned no txid', result);
        this.mark(2, 'failed', 'no txid');
        return;
      }
      this.deployTxid = txid;
      this.el.deployTx.innerHTML = this._explorer(txid);
      this.log('ok', `deploy broadcast, txid ${txid}`);
      this.mark(2, 'sent', 'confirming');
      this._gate();
    } catch (error) {
      if (userCancelled(error)) {
        // Nothing was sent, so return the step to not-started. Marking it done
        // would unlock the step after it for a transaction that never happened.
        this.mark(2, 'waiting', 'not started');
        this.log('info', 'you cancelled in the wallet — nothing was sent');
        return;
      }
      this.log('err', `deploy failed: ${error.message}`);
      this.log(
        'info',
        'if the wallet refused the request itself, try another parameter shape from the dropdown before concluding it cannot deploy'
      );
      this.mark(2, 'failed', 'refused');
    }
  }

  // Confirmation is not enough on its own. The source that landed has to be the
  // source that was tested, byte for byte.
  async verifyDeploy() {
    this.log('info', 'checking the deploy transaction…');
    const status = await txStatus(this.api, this.deployTxid);
    this.log(status.status === 'success' ? 'ok' : 'info', `tx_status: ${status.status}`, status.result);

    if (status.status !== 'success') {
      this.mark(2, status.status === 'pending' ? 'sent' : 'failed', status.status);
      return;
    }

    try {
      const response = await fetch(`${this.api}/v2/contracts/source/${this.address}/${this.contractName}`);
      const body = await response.json();
      const onChainHash = bytesToHex(sha256(new TextEncoder().encode(body.source)));

      if (onChainHash === this.sourceHash) {
        this.log('ok', 'on-chain source matches byte for byte', `sha256 ${onChainHash}`);
        this.el.contractId.textContent = `${this.address}.${this.contractName}`;
        this.mark(2, 'ok', 'deployed');
      } else {
        this.log('err', 'ON-CHAIN SOURCE DOES NOT MATCH', {
          expected: this.sourceHash,
          onChain: onChainHash
        });
        this.mark(2, 'failed', 'hash mismatch');
      }
    } catch (error) {
      this.log('warn', `could not read the deployed source yet: ${error.message}`);
    }
  }

  /**
   * What the contract will charge for this call, and the post conditions that
   * permit exactly that.
   *
   * v1 charges nothing, so its calls deny every transfer. v2 charges, so its
   * calls must permit the fee and no more; denying outright would abort the very
   * transfer the contract is about to make.
   */
  async _feeGuard(functionName = 'submit-move') {
    if (!this.charges) {
      return { ...feePostConditions({ sender: this.address, fee: 0 }), contractFee: 0 };
    }

    // Which fee this call actually moves. v3 prices opening a game separately,
    // and by a hundred times, so guarding open-game with the move fee is not a
    // tighter cap — it is a transaction that aborts while still costing its
    // sender the network fee.
    const opening = functionName === 'open-game';
    let fee = 0;
    try {
      if (opening) {
        try {
          fee = Number(await readOnly(this.api, this.address, this.contractName, 'get-open-fee'));
        } catch {
          // v1 and v2 have no such function, and for v2 the move fee is the
          // right answer for both calls.
          fee = Number(await readOnly(this.api, this.address, this.contractName, 'get-move-fee'));
        }
      } else {
        fee = Number(await readOnly(this.api, this.address, this.contractName, 'get-move-fee'));
      }
    } catch (error) {
      this.log('warn', `could not read the contract fee: ${error.message}`);
      throw error;
    }

    const shape = this.el.pcShape?.value || 'strict';
    this.log(
      'info',
      `${functionName} moves ${fee} \u00b5STX (${(fee / 1e6).toFixed(6)} STX), permitting exactly that`,
      { shape, read: opening ? 'get-open-fee' : 'get-move-fee' }
    );

    return {
      ...feePostConditions({ sender: this.address, fee, shape }),
      contractFee: fee
    };
  }

  // ---- 3 · open game #1 ---------------------------------------------

  async openGame() {
    this.mark(3, 'running', 'awaiting wallet');

    // none = the open board that anyone may play. A ruled game would pass a
    // 32-byte hash here instead.
    let guard;
    try {
      guard = await this._feeGuard('open-game');
    } catch {
      this.mark(3, 'failed', 'could not read fee');
      return;
    }

    const params = {
      contract: `${this.address}.${this.contractName}`,
      functionName: 'open-game',
      functionArgs: [serializeNone()],
      arguments: [serializeNone()],
      postConditionMode: guard.postConditionMode,
      postConditions: guard.postConditions,
      network: this.network,
      ...callFeeParams(this.callFee)
    };

    this.log('info', `stx_callContract open-game(none), network fee ${this.callFee} \u00b5STX`, params);

    try {
      const { result } = await walletCall('stx_callContract', params, {
        onLog: (level, message, detail) => this.log(level, message, detail)
      });
      const txid = txidFrom(result);
      if (!txid) {
        this.log('warn', 'wallet returned no txid', result);
        this.mark(3, 'failed', 'no txid');
        return;
      }
      this.openTxid = txid;
      this.el.openTx.innerHTML = this._explorer(txid);
      this.log('ok', `open-game broadcast, txid ${txid}`);
      this.mark(3, 'sent', 'confirming');
      this._gate();
    } catch (error) {
      if (userCancelled(error)) {
        this.mark(3, 'waiting', 'not started');
        this.log('info', 'you cancelled in the wallet — nothing was sent');
        return;
      }
      this.log('err', `open-game failed: ${error.message}`);
      this.mark(3, 'failed', 'refused');
    }
  }

  async verifyOpen() {
    const status = await txStatus(this.api, this.openTxid);
    this.log(status.status === 'success' ? 'ok' : 'info', `tx_status: ${status.status}`, status.result);
    if (status.status !== 'success') {
      this.mark(3, status.status === 'pending' ? 'sent' : 'failed', status.status);
      return;
    }

    try {
      const count = await readOnly(this.api, this.address, this.contractName, 'get-game-count');
      const game = await readOnly(this.api, this.address, this.contractName, 'get-game', [
        serializeUint(1)
      ]);
      this.log('ok', `game-count is ${count}`, game);

      if (Number(count) >= 1 && game) {
        this.log('ok', `game #1 opened by ${game['opened-by']}, rules-hash ${game['rules-hash'] ? bytesToHex(game['rules-hash']) : 'none (open board)'}`);
        this.mark(3, 'ok', 'game #1 open');
      } else {
        this.log('err', 'the transaction succeeded but no game is readable');
        this.mark(3, 'failed', 'nothing readable');
      }
    } catch (error) {
      this.log('warn', `read failed: ${error.message}`);
    }
  }

  // ---- 4 · the first move -------------------------------------------

  async firstMove() {
    this.mark(4, 'running', 'awaiting wallet');

    let guard;
    try {
      guard = await this._feeGuard('submit-move');
    } catch {
      this.mark(4, 'failed', 'could not read fee');
      return;
    }

    const args = [serializeUint(1), serializeStringAscii(FIRST_MOVE)];
    const params = {
      contract: `${this.address}.${this.contractName}`,
      functionName: 'submit-move',
      functionArgs: args,
      arguments: args,
      postConditionMode: guard.postConditionMode,
      postConditions: guard.postConditions,
      network: this.network,
      ...callFeeParams(this.callFee)
    };

    this.log(
      'info',
      `stx_callContract submit-move(u1, "${FIRST_MOVE}"), network fee ${this.callFee} \u00b5STX`,
      params
    );

    try {
      const { result } = await walletCall('stx_callContract', params, {
        onLog: (level, message, detail) => this.log(level, message, detail)
      });
      const txid = txidFrom(result);
      if (!txid) {
        this.log('warn', 'wallet returned no txid', result);
        this.mark(4, 'failed', 'no txid');
        return;
      }
      this.moveTxid = txid;
      this.el.moveTx.innerHTML = this._explorer(txid);
      this.log('ok', `submit-move broadcast, txid ${txid}`);
      this.mark(4, 'sent', 'confirming');
      this._gate();
    } catch (error) {
      if (userCancelled(error)) {
        this.mark(4, 'waiting', 'not started');
        this.log('info', 'you cancelled in the wallet — nothing was sent');
        return;
      }
      this.log('err', `submit-move failed: ${error.message}`);
      this.mark(4, 'failed', 'refused');
    }
  }

  async verifyMove() {
    const status = await txStatus(this.api, this.moveTxid);
    this.log(status.status === 'success' ? 'ok' : 'info', `tx_status: ${status.status}`, status.result);
    if (status.status !== 'success') {
      this.mark(4, status.status === 'pending' ? 'sent' : 'failed', status.status);
      return;
    }

    try {
      const page = await readOnly(this.api, this.address, this.contractName, 'get-page', [
        serializeUint(1),
        serializeUint(0)
      ]);
      const moves = page
        .filter(Boolean)
        .map((entry, index) => ({
          mv: entry.mv,
          sender: entry.sender,
          height: Number(entry.height),
          seq: index
        }));

      this.log('ok', `${moves.length} submission(s) in the log`, moves);

      // The point of the whole exercise: the chain holds a string, and replaying
      // it produces a position.
      const state = replay(moves);
      this.log(
        state.accepted.length === 1 ? 'ok' : 'err',
        `replay says: ${state.accepted.length} played, ${state.rejected.length} skipped`,
        state.fen
      );

      if (state.accepted.length === 1 && state.accepted[0].san === 'e4') {
        this.log('ok', 'the board reads 1. e4 — the launch is complete');
        this.mark(4, 'ok', 'first move played');
      } else {
        this.mark(4, 'failed', 'replay disagrees');
      }
    } catch (error) {
      this.log('warn', `read failed: ${error.message}`);
    }
  }

  // ------------------------------------------------------------------
  // Contract controls
  //
  // Everything the deployed contract exposes, in one place, gated on actually
  // being its owner. The board deliberately has none of this: what a move costs
  // is the owner's to set, not a knob for whoever happens to be playing.
  // ------------------------------------------------------------------

  async readContractState() {
    const el = this.el;
    el.contractState.innerHTML = '<dt>reading…</dt><dd></dd>';

    const readers = [
      ['format version', 'get-format-version', (v) => String(v)],
      ['games opened', 'get-game-count', (v) => String(v)],
      ['log ceiling', 'get-max-seq', (v) => `${v} submissions per game`],
      ['move fee', 'get-move-fee', (v) => `${v} \u00b5STX (${(Number(v) / 1e6).toFixed(6)} STX)`],
      ['fee ceiling', 'get-fee-ceiling', (v) => `${v} \u00b5STX (${(Number(v) / 1e6).toFixed(6)} STX)`],
      // v3 only. A contract without them answers with a miss, which the loop
      // below reports as "not on this contract" rather than as a failure.
      ['open fee', 'get-open-fee', (v) => `${v} \u00b5STX (${(Number(v) / 1e6).toFixed(6)} STX)`],
      ['open fee ceiling', 'get-open-fee-ceiling', (v) => `${v} \u00b5STX (${(Number(v) / 1e6).toFixed(6)} STX)`],
      ['fee recipient', 'get-fee-recipient', (v) => String(v)],
      ['owner', 'get-owner', (v) => (v === null ? 'renounced — nobody can change anything' : String(v))]
    ];

    const rows = [];
    this.chainState = {};

    for (const [label, fn, format] of readers) {
      try {
        const value = await readOnly(this.api, this.address, this.contractName, fn);
        this.chainState[fn] = value;
        rows.push([label, format(value)]);
      } catch {
        // v1 has no fee functions at all, which is an answer rather than a fault.
        rows.push([label, '—  not on this contract']);
      }
    }

    el.contractState.innerHTML = rows
      .map(([k, v]) => `<dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd>`)
      .join('');

    const owner = this.chainState['get-owner'];
    const isOwner = owner && this.address && String(owner) === this.address;
    const hasOwnerFns = this.chainState['get-move-fee'] !== undefined;

    el.ownerControls.hidden = !hasOwnerFns || !isOwner;
    el.controlsState.textContent = !hasOwnerFns
      ? 'read only'
      : owner === null
        ? 'renounced'
        : isOwner
          ? 'you own this'
          : 'owned by someone else';

    if (hasOwnerFns && !isOwner && owner !== null) {
      this.log('info', `these controls belong to ${owner}, and you are connected as ${this.address}`);
    }

    // Only v3 prices opening separately, so the control appears only where it
    // means something rather than sitting there failing on v1 and v2.
    const hasOpenFee = this.chainState['get-open-fee'] !== undefined;
    if (el.openFeeRow) el.openFeeRow.hidden = !hasOpenFee;

    if (isOwner) {
      el.newFee.value = String(this.chainState['get-move-fee'] ?? '');
      el.newRecipient.value = String(this.chainState['get-fee-recipient'] ?? '');
      if (hasOpenFee && el.newOpenFee) {
        el.newOpenFee.value = String(this.chainState['get-open-fee'] ?? '');
        el.newOpenFee.max = String(this.chainState['get-open-fee-ceiling'] ?? '');
      }
    }
  }

  // Every owner action is the same shape: confirm, send, report.
  async _ownerCall(functionName, args, description) {
    if (!confirm(`${description}\n\nThis changes the deployed contract on ${this.network}. Continue?`)) {
      this.log('info', 'not confirmed, nothing sent');
      return;
    }

    this.log('info', `${functionName}`, { args: description });

    try {
      const { result } = await walletCall(
        'stx_callContract',
        {
          contract: `${this.address}.${this.contractName}`,
          functionName,
          functionArgs: args,
          arguments: args,
          // These move no STX, so nothing should leave the wallet.
          postConditionMode: 'deny',
          postConditions: [],
          network: this.network,
          ...callFeeParams(this.callFee)
        },
        { onLog: (level, message, detail) => this.log(level, message, detail) }
      );

      const txid = txidFrom(result);
      this.log('ok', `${functionName} sent${txid ? `, txid ${txid}` : ''}`);
      if (txid) this.log('info', this._explorer(txid).replace(/<[^>]+>/g, ''));
    } catch (error) {
      if (userCancelled(error)) {
        this.log('info', 'you cancelled in the wallet — nothing was sent');
        return;
      }
      this.log('err', `${functionName} failed: ${error.message}`);
    }
  }

  async setMoveFee() {
    const amount = Number(this.el.newFee.value);
    const ceiling = Number(this.chainState?.['get-fee-ceiling'] ?? 0);

    if (!Number.isFinite(amount) || amount < 0) {
      this.log('err', 'the fee must be a whole number of microSTX, or zero to charge nothing');
      return;
    }
    if (ceiling && amount > ceiling) {
      // The contract would refuse this anyway. Saying so here saves a fee.
      this.log('err', `${amount} is above the contract's ceiling of ${ceiling} \u00b5STX, which it would refuse`);
      return;
    }

    await this._ownerCall(
      'set-move-fee',
      [serializeUint(amount)],
      `Set the move fee to ${amount} \u00b5STX (${(amount / 1e6).toFixed(6)} STX).`
    );
  }

  // The same gate as the move fee, against a different ceiling. Zero is allowed
  // and turns the charge off, which for opening a game means anyone can create
  // one for nothing but the network fee.
  async setOpenFee() {
    const amount = Number(this.el.newOpenFee.value);
    const ceiling = Number(this.chainState?.['get-open-fee-ceiling'] ?? 0);

    if (!Number.isFinite(amount) || amount < 0 || Math.floor(amount) !== amount) {
      this.log('err', 'the open fee must be a whole number of microSTX, or zero to charge nothing');
      return;
    }
    // Checked here as well as on chain, because the contract would refuse this
    // and the refusal still costs a transaction fee.
    if (ceiling && amount > ceiling) {
      this.log('err', `${amount} is above the contract's ceiling of ${ceiling} \u00b5STX, which it would refuse`);
      return;
    }
    if (amount === 0) {
      this.log(
        'warn',
        'zero means anyone can open a game for nothing but the network fee. A junk move is skipped by replay; a junk game is permanent.'
      );
    }

    await this._ownerCall(
      'set-open-fee',
      [serializeUint(amount)],
      `Set the fee for opening a game to ${amount} \u00b5STX (${(amount / 1e6).toFixed(6)} STX).`
    );
  }

  async setFeeRecipient() {
    const who = this.el.newRecipient.value.trim();
    try {
      await this._ownerCall(
        'set-fee-recipient',
        [serializePrincipal(who)],
        `Send every future fee to ${who}.`
      );
    } catch (error) {
      this.log('err', `that is not a valid address: ${error.message}`);
    }
  }

  async transferOwnership() {
    const who = this.el.newOwner.value.trim();
    try {
      await this._ownerCall(
        'transfer-ownership',
        [serializeSome(serializePrincipal(who))],
        `Hand this contract to ${who}. They will control the fee, and you will not.`
      );
    } catch (error) {
      this.log('err', `that is not a valid address: ${error.message}`);
    }
  }

  async renounceOwnership() {
    const typed = prompt(
      'Renouncing gives this contract to nobody, permanently.\n\n' +
        `The fee stays at ${this.chainState?.['get-move-fee'] ?? '?'} \u00b5STX and the recipient stays as it is, ` +
        'forever. Nobody can ever change them again, including you. There is no way back.\n\n' +
        'Type RENOUNCE to continue:'
    );
    if (typed !== 'RENOUNCE') {
      this.log('info', 'not confirmed, nothing sent');
      return;
    }

    await this._ownerCall(
      'transfer-ownership',
      [serializeNone()],
      'Renounce ownership permanently.'
    );
  }

  // ---- report -------------------------------------------------------

  _explorer(txid) {
    const url = `https://explorer.hiro.so/txid/${txid}?chain=${this.network}`;
    return `<a href="${url}" target="_blank" rel="noopener">${txid}</a>`;
  }

  async copyReport() {
    const report = [
      `xtrata-chess launch canary`,
      `network       ${this.network}`,
      `deployer      ${this.address || '(not connected)'}`,
      `provider      ${this.provider?.id || '(none)'}`,
      `contract      ${this.address}.${this.contractName}`,
      `source sha256 ${this.sourceHash}`,
      `deploy tx     ${this.deployTxid || '-'}`,
      `open-game tx  ${this.openTxid || '-'}`,
      `first move tx ${this.moveTxid || '-'}`,
      `steps         ${safeJson(this.steps)}`,
      ``,
      ...this.entries.map(
        (e) => `[${e.at}] ${e.level.toUpperCase()} ${e.message}${e.detail === undefined ? '' : `\n${typeof e.detail === 'string' ? e.detail : safeJson(e.detail)}`}`
      )
    ].join('\n');

    try {
      await navigator.clipboard.writeText(report);
      this.log('ok', 'report copied');
    } catch {
      this.log('warn', 'clipboard refused; the report is in the console');
      console.log(report);
    }
  }
}
