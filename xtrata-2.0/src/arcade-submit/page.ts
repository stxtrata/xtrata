// /arcade/submit — top-level page that turns an Astro Blaster 3 run into one
// `submit-score` transaction. Wallet work goes only through src/lib/wallet
// (see docs/WALLET-PLAYBOOK.md). The replay is re-played here first and the
// replayed score is what gets submitted.
import { cvToHex, cvToValue, hexToCV, Cl, principalCV, type ClarityValue } from '@stacks/transactions';
import { createStacksWalletAdapter } from '../lib/wallet/adapter';
import { showContractCall, type WalletCallProgress } from '../lib/wallet/connect';
import {
  ARCADE_CONTRACT, buildSubmitCall, isPilot, parsePayload, PayloadError, SUBMIT_ERRORS, verifyPayload,
  type BoardInfo, type SubmitPayload
} from './core';

const wallet = createStacksWalletAdapter({ appName: 'Xtrata Arcade', appIcon: '/favicon.svg' });
const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const setText = (id: string, text: string) => { el(id).textContent = text; };
const status = (text: string, kind: '' | 'ok' | 'err' = '') => { const s = el('status'); s.textContent = text; s.className = 'status ' + kind; };

const API_BASES = ['/hiro/mainnet', 'https://api.mainnet.hiro.so'];
const hostId = (() => { const m = /[#&]id=([A-Za-z0-9-]{1,64})/.exec(location.hash); return m ? m[1] : ''; })();

let payload: SubmitPayload | null = null;
let verifiedScore: number | null = null;
let board: BoardInfo | null = null;
let rank: { ok: true; value: number } | { ok: false } | null = null;
let busy = false;
let submittedTx = '';
let periodClosed = false;

const progressText: Record<WalletCallProgress, string> = {
  'provider-selected': 'Wallet selected. Preparing the request…',
  'account-read': 'Checking the active wallet account. Nothing has been signed yet…',
  'account-cached': 'Wallet account confirmed. Preparing the transaction…',
  'account-read-failed': 'The wallet did not share its account. Trying its connection flow…',
  'account-reconnect': 'Waiting for your wallet to confirm account access. Check the extension.',
  'signing-request': 'Approve the transaction in your wallet. Check the network fee before signing.',
  'legacy-request': 'Wallet popup requested. Check your extension and popup permissions.'
};

function timeoutSignal(ms: number): AbortSignal | undefined {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') return AbortSignal.timeout(ms);
  if (typeof AbortController === 'undefined') return undefined;
  const c = new AbortController(); setTimeout(() => c.abort(), ms); return c.signal;
}

async function readOnly(fn: string, args: ClarityValue[]): Promise<unknown> {
  const body = JSON.stringify({ sender: ARCADE_CONTRACT.address, arguments: args.map((a) => cvToHex(a)) });
  let lastError: unknown;
  for (const base of API_BASES) {
    try {
      const r = await fetch(`${base}/v2/contracts/call-read/${ARCADE_CONTRACT.address}/${ARCADE_CONTRACT.name}/${fn}`, {
        method: 'POST', headers: { 'content-type': 'application/json' }, body, signal: timeoutSignal(12000)
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const j = await r.json();
      if (!j.okay) throw new Error(j.cause || 'read failed');
      return cvToValue(hexToCV(j.result), true);
    } catch (e) { lastError = e; }
  }
  throw lastError instanceof Error ? lastError : new Error('Could not reach the Stacks API');
}

async function checkPeriod(p: SubmitPayload) {
  if (p.board !== 'astro3-daily') return;
  try {
    const cur = Number(await readOnly('current-period', []));
    periodClosed = p.period !== cur && p.period + 1 !== cur;
  } catch { /* unknown: the contract checks again */ }
}

async function loadBoard(p: SubmitPayload) {
  const v = (await readOnly('get-board', [Cl.stringAscii(p.board)])) as { value?: Record<string, { value: string | boolean }> } | null;
  if (!v || !v.value) throw new Error('This leaderboard does not exist yet.');
  const b = v.value;
  board = { fee: BigInt(String(b.fee.value)), enabled: Boolean(b.enabled.value), maxScore: BigInt(String(b['max-score'].value)) };
}

async function loadRank(address: string) {
  if (!payload || verifiedScore == null) return;
  if (!isPilot(payload.replay, address)) { rank = null; render(); return; }
  rank = null; render();
  try {
    const v = await readOnly('preview-rank', [Cl.stringAscii(payload.board), Cl.uint(payload.period), Cl.uint(verifiedScore), principalCV(address)]);
    rank = { ok: true, value: Number(v) };
  } catch {
    rank = { ok: false }; // a failed read is not "not in the Top 10"
  }
  render();
}

function fmt(n: number | bigint) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function stx(u: bigint) { return `${u / 1_000_000n}.${(u % 1_000_000n).toString().padStart(6, '0')}`; }

function render() {
  const session = wallet.getSession();
  const connected = session.isConnected && !!session.address;
  const mainnet = connected && session.network !== 'testnet' && /^S[PM]/.test(session.address || '');
  setText('wallet', connected ? `Wallet: ${session.address}` : 'No wallet connected.');
  el<HTMLButtonElement>('connect').textContent = connected ? 'Switch wallet' : 'Connect wallet';
  el<HTMLButtonElement>('connect').disabled = busy || !!submittedTx || !payload || verifiedScore == null;
  let canSubmit = !!payload && verifiedScore != null && !!board && mainnet && !busy && !submittedTx;
  let rankText = '';
  if (connected && !mainnet) { rankText = 'Switch your wallet to a mainnet account.'; canSubmit = false; }
  else if (connected && payload && !isPilot(payload.replay, session.address!)) { rankText = `This run was flown as ${payload.pilot}. Connect that wallet to submit it.`; canSubmit = false; }
  else if (periodClosed) { rankText = 'That day\u2019s board has closed. Daily scores must be submitted the same Bitcoin day or the next.'; canSubmit = false; }
  else if (connected && rank === null) { rankText = 'Checking your rank on-chain…'; canSubmit = false; }
  else if (rank && rank.ok && rank.value === 0) { rankText = 'The contract would refuse this score right now: it is not in the Top 10, or you already hold an equal or better entry.'; canSubmit = false; }
  else if (rank && rank.ok) rankText = `This run takes rank #${rank.value}.`;
  else if (rank && !rank.ok) rankText = 'Could not check your rank right now. You can still submit; the contract checks again before anything is charged.';
  setText('rank', rankText);
  if (board) setText('fee', board.fee > 0n ? `Entry fee: ${stx(board.fee)} STX plus the network fee.` : 'No entry fee. You pay only the network fee shown by your wallet.');
  el<HTMLButtonElement>('submit').disabled = !canSubmit;
}

async function start() {
  try {
    payload = parsePayload(location.hash);
  } catch (e) {
    status(e instanceof PayloadError ? e.message : 'The submit link is damaged.', 'err');
    el('run').hidden = true;
    return;
  }
  const p = payload;
  setText('rBoard', p.board === 'astro3-daily' ? `Daily run · day ${p.period}` : 'Campaign');
  setText('rName', p.name);
  setText('rPilot', p.pilot);
  setText('rClaimed', fmt(p.claimedScore));
  setText('rBytes', `${fmt(p.replay.length)} bytes`);
  status('Replaying your run to confirm the score…');
  render();
  // let the page paint before the replay runs
  await new Promise((r) => setTimeout(r, 30));
  const v = await verifyPayload(p);
  if (!v.ok) { status(v.reason + ' This run cannot be submitted.', 'err'); render(); return; }
  verifiedScore = v.score;
  setText('rVerified', `${fmt(v.score)} ✓`);
  status('Run verified. Connect your wallet to submit it.', 'ok');
  try { await loadBoard(p); } catch (e) { status(e instanceof Error ? e.message : 'Could not read the leaderboard.', 'err'); }
  await checkPeriod(p);
  const s = wallet.getSession();
  if (s.isConnected && s.address) await loadRank(s.address);
  render();
}

el('connect').onclick = async () => {
  if (busy) return;
  busy = true; render();
  try {
    const s = await wallet.connect();
    busy = false;
    if (s.isConnected && s.address) await loadRank(s.address);
  } catch (e) {
    status(e instanceof Error ? e.message : 'Wallet connection failed.', 'err');
  } finally { busy = false; render(); }
};

el('submit').onclick = async () => {
  if (!payload || verifiedScore == null || !board || busy || submittedTx) return;
  const session = wallet.getSession();
  if (!session.address) return;
  let call;
  try { call = buildSubmitCall(payload, verifiedScore, session.address, board); }
  catch (e) { status(e instanceof Error ? e.message : String(e), 'err'); return; }
  busy = true; render();
  status('Opening your wallet…');
  const started = Date.now();
  const waiting = setInterval(() => status(`Still waiting for your wallet (${Math.round((Date.now() - started) / 1000)} s). Check the extension. Do not submit twice.`), 30000);
  try {
    const txId = await new Promise<string>((resolve, reject) => showContractCall({
      ...call,
      onProgress: (stage) => status(progressText[stage]),
      onFinish: (result: { txId?: string; txid?: string }) => {
        const id = String(result.txId || result.txid || '');
        if (!/^(0x)?[0-9a-f]{64}$/i.test(id)) { reject(new Error('The wallet did not return a transaction ID. Check your wallet history before trying again.')); return; }
        resolve(id.startsWith('0x') ? id : '0x' + id);
      },
      onCancel: () => reject(Object.assign(new Error('Cancelled. Nothing was sent.'), { cancelled: true })),
      onError: (e: unknown) => reject(e)
    }));
    submittedTx = txId;
    const a = document.createElement('a');
    a.href = `https://explorer.hiro.so/txid/${txId}?chain=mainnet`; a.target = '_blank'; a.rel = 'noopener';
    a.textContent = 'View the transaction';
    status('Submitted. Your score appears on the board once the transaction confirms (usually a few minutes). ', 'ok');
    el('status').append(a);
    notifyHost({ txId });
  } catch (e) {
    const err = e as { message?: string; cancelled?: boolean };
    const m = /\(err u(\d+)\)/.exec(String(err?.message || ''));
    const msg = m && SUBMIT_ERRORS[+m[1]] ? SUBMIT_ERRORS[+m[1]] : (err?.message || 'The wallet request failed.');
    status(msg, err?.cancelled ? '' : 'err');
    notifyHost(err?.cancelled ? { cancelled: true } : { error: msg });
  } finally {
    clearInterval(waiting);
    busy = false; render();
  }
};

function notifyHost(result: { txId?: string; error?: string; cancelled?: boolean }) {
  if (!hostId) return;
  try { window.opener?.postMessage({ type: 'xtrata:arcade:submit-result', id: hostId, ...result }, location.origin); } catch { /* opener gone */ }
}

void start();
