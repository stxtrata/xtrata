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
  serializeStringAscii,
  serializeUint,
  sha256
} from './clarity.js';
import { CONTRACT_NAME } from './protocol.js';
import { replay } from './replay.js';
import {
  collectProviders,
  connectWallet,
  isFramed,
  shimInstalled,
  usingHostBridge,
  walletRequest,
  walletCall,
  extractAddress
} from './wallet.js';

// Re-exported so the canary's own tests pin the behaviour it actually uses.
export const harvestAddress = extractAddress;

const API = {
  mainnet: 'https://api.mainnet.hiro.so',
  testnet: 'https://api.testnet.hiro.so'
};

const FIRST_MOVE = 'e2e4';

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
  A: (source, network) => ({
    name: CONTRACT_NAME,
    clarityCode: source,
    clarityVersion: 3,
    network
  }),
  B: (source, network) => ({
    name: CONTRACT_NAME,
    clarityCode: source,
    clarityVersion: 3,
    network,
    postConditionMode: 'deny',
    postConditions: []
  }),
  C: (source, network) => ({
    name: CONTRACT_NAME,
    contractName: CONTRACT_NAME,
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

    this._wire();
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
        typeof detail === 'string' ? detail : JSON.stringify(detail, null, 2);
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
    this.el.btnDeploy.disabled = this.steps[1] !== 'ok';
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
    el.btnDetect.addEventListener('click', () => this.detect());
    el.btnConnect.addEventListener('click', () => this.connect());
    el.btnPreflight.addEventListener('click', () => this.preflight());
    el.btnDeploy.addEventListener('click', () => this.deploy());
    el.btnVerifyDeploy.addEventListener('click', () => this.verifyDeploy());
    el.btnOpen.addEventListener('click', () => this.openGame());
    el.btnVerifyOpen.addEventListener('click', () => this.verifyOpen());
    el.btnMove.addEventListener('click', () => this.firstMove());
    el.btnVerifyMove.addEventListener('click', () => this.verifyMove());
    el.btnReport.addEventListener('click', () => this.copyReport());
  }

  _resetFrom(step) {
    for (let i = step; i <= 4; i++) this.mark(i, 'waiting', 'not started');
    if (step <= 2) this.deployTxid = null;
    if (step <= 3) this.openTxid = null;
    if (step <= 4) this.moveTxid = null;
    this._gate();
  }

  async _loadSource() {
    // Inlined by the build for the standalone page; fetched during development.
    const inlined = globalThis.__XTRATA_CHESS_CONTRACT__;
    this.source = inlined || (await (await fetch(`./contracts/${CONTRACT_NAME}.clar`)).text());
    this.sourceHash = bytesToHex(sha256(new TextEncoder().encode(this.source)));

    this.el.sourceInfo.textContent =
      `${CONTRACT_NAME}.clar · ${this.source.length.toLocaleString()} bytes · sha256 ${this.sourceHash}`;
    this.log('info', 'contract source loaded', `sha256 ${this.sourceHash}`);
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

  async connect() {
    try {
      const session = await connectWallet({
        preferredLabel: this.el.providers.value,
        // Always go to the wallet. Reusing a cached session here would make
        // Connect look broken: nothing appears and nothing is proven.
        forcePrompt: true,
        onLog: (level, message, detail) => this.log(level, message, detail)
      });
      this.address = session.address;
      this.provider = session.provider || this.provider;
      this.el.address.textContent = session.address;

      // The wallet panel had no way of saying it had succeeded, so a connection
      // that worked still read "not connected".
      this.mark(0, 'ok', session.network);

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
      this.log('err', `connect failed: ${error.message}`);
      if (error.code === 'NO_ADDRESS') {
        this.log(
          'info',
          'every provider was asked and none answered. If your wallet is locked, unlock it and press Connect again.'
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

    // The name must be free: contract names can never be reused.
    try {
      const response = await fetch(
        `${this.api}/v2/contracts/interface/${this.address}/${CONTRACT_NAME}`
      );
      if (response.ok) {
        this.log('err', `${this.address}.${CONTRACT_NAME} already exists — the name is spent`);
        allGood = false;
      } else {
        this.log('ok', `${CONTRACT_NAME} is free on ${this.address}`);
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
  }

  // ---- 2 · deploy ---------------------------------------------------

  async deploy() {
    const shape = this.el.deployShape.value;
    const params = DEPLOY_SHAPES[shape](this.source, this.network);

    const typed = prompt(
      `This deploys ${CONTRACT_NAME} to ${this.network} as ${this.address}.\n` +
        `It is irreversible, the name can never be reused, and the contract can never be changed.\n\n` +
        `Type the contract name to continue:`
    );
    if (typed !== CONTRACT_NAME) {
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
      this.log('err', `deploy failed: ${error.message}`);
      this.log('info', 'try another shape from the dropdown before concluding the wallet cannot do it');
      this.mark(2, 'failed', 'rejected');
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
      const response = await fetch(`${this.api}/v2/contracts/source/${this.address}/${CONTRACT_NAME}`);
      const body = await response.json();
      const onChainHash = bytesToHex(sha256(new TextEncoder().encode(body.source)));

      if (onChainHash === this.sourceHash) {
        this.log('ok', 'on-chain source matches byte for byte', `sha256 ${onChainHash}`);
        this.el.contractId.textContent = `${this.address}.${CONTRACT_NAME}`;
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

  // ---- 3 · open game #1 ---------------------------------------------

  async openGame() {
    this.mark(3, 'running', 'awaiting wallet');

    // none = the open board that anyone may play. A ruled game would pass a
    // 32-byte hash here instead.
    const params = {
      contract: `${this.address}.${CONTRACT_NAME}`,
      functionName: 'open-game',
      functionArgs: [serializeNone()],
      arguments: [serializeNone()],
      postConditionMode: 'deny',
      postConditions: [],
      network: this.network
    };

    this.log('info', 'stx_callContract open-game(none)', params);

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
      this.log('err', `open-game failed: ${error.message}`);
      this.mark(3, 'failed', 'rejected');
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
      const count = await readOnly(this.api, this.address, CONTRACT_NAME, 'get-game-count');
      const game = await readOnly(this.api, this.address, CONTRACT_NAME, 'get-game', [
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

    const args = [serializeUint(1), serializeStringAscii(FIRST_MOVE)];
    const params = {
      contract: `${this.address}.${CONTRACT_NAME}`,
      functionName: 'submit-move',
      functionArgs: args,
      arguments: args,
      postConditionMode: 'deny',
      postConditions: [],
      network: this.network
    };

    this.log('info', `stx_callContract submit-move(u1, "${FIRST_MOVE}")`, params);

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
      this.log('err', `submit-move failed: ${error.message}`);
      this.mark(4, 'failed', 'rejected');
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
      const page = await readOnly(this.api, this.address, CONTRACT_NAME, 'get-page', [
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
      `contract      ${this.address}.${CONTRACT_NAME}`,
      `source sha256 ${this.sourceHash}`,
      `deploy tx     ${this.deployTxid || '-'}`,
      `open-game tx  ${this.openTxid || '-'}`,
      `first move tx ${this.moveTxid || '-'}`,
      `steps         ${JSON.stringify(this.steps)}`,
      ``,
      ...this.entries.map(
        (e) => `[${e.at}] ${e.level.toUpperCase()} ${e.message}${e.detail === undefined ? '' : `\n${typeof e.detail === 'string' ? e.detail : JSON.stringify(e.detail)}`}`
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
