// Host side of the arcade score hand-off (public viewer). The embedded game
// sends a finished run; the host shows its own dialog, re-plays the run, and
// signs `submit-score` in place with the wallet the viewer already uses
// (src/lib/wallet, docs/WALLET-PLAYBOOK.md). No inscription HTML reaches this
// dialog: everything shown is validated and set with textContent.
//
// Sandboxed inscriptions cannot open tabs or use the clipboard, so signing
// here is the primary path. Opening the top-level /arcade/submit page stays
// available as a fallback.
import type { WalletSession } from '../wallet/types';
import { hexToCV, cvToValue } from '@stacks/transactions';
import { ARCADE_BOARDS, ARCADE_GAME, ARCADE_SCORES_CONTRACT_ID, formatArcadeScore, isArcadeBoard } from '../../arcade-submit/arcade-boards';

const NAME_RE = /^[A-Za-z0-9 _.-]{3,12}$/;

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function arcadeSubmitUrl(origin: string, payload: Record<string, unknown>, id: string): string {
  return `${origin}/arcade/submit#p=${toBase64Url(JSON.stringify(payload))}&id=${encodeURIComponent(id)}`;
}

/**
 * The arcade (inscription #3076) asks its host to sign `submit-score` with a generic contract call. The public viewer
 * never signs arbitrary calls: this turns exactly that call, for exactly this contract and function, into the reviewed
 * arcade hand-off payload. Anything else is refused.
 */
export function arcadeCallToPayload(params: unknown): Record<string, unknown> {
  const p = (Array.isArray(params) ? params[0] : params) as Record<string, unknown> | null;
  if (!p || typeof p !== 'object') throw new Error('Unsupported wallet request.');
  const contract = p.contract ?? (p.contractAddress && p.contractName ? `${p.contractAddress}.${p.contractName}` : '');
  if (contract !== ARCADE_SCORES_CONTRACT_ID || p.functionName !== 'submit-score') throw new Error('This viewer only signs arcade score submissions.');
  const args = (Array.isArray(p.functionArgs) ? p.functionArgs : Array.isArray(p.arguments) ? p.arguments : []) as unknown[];
  if (args.length !== 5 || !args.every((a) => typeof a === 'string' && /^0x[0-9a-f]+$/i.test(a) && a.length < 140_000))
    throw new Error('Unsupported score submission.');
  const v = args.map((a) => cvToValue(hexToCV(a as string)) as unknown);
  const board = v[0], period = Number(v[1]), score = Number(v[2]), name = v[3];
  let replay = String(v[4]).replace(/^0x/, '');
  if (typeof board !== 'string' || !isArcadeBoard(board) || period !== 0 || typeof name !== 'string' || !/^[0-9a-f]{88,}$/i.test(replay) || replay.length % 2)
    throw new Error('Unsupported score submission.');
  const bytes = Uint8Array.from(replay.match(/../g)!, (h) => parseInt(h, 16));
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return {
    v: 1, game: ARCADE_GAME, network: 'mainnet', contract: ARCADE_SCORES_CONTRACT_ID, board, period: 0, score, name,
    replay: btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  };
}

export function describeArcadePayload(payload: Record<string, unknown>) {
  if (payload.game !== 'astro-blaster-3' && payload.game !== ARCADE_GAME) throw new Error('Unsupported arcade game.');
  const xar = payload.game === ARCADE_GAME;
  const name = typeof payload.name === 'string' && NAME_RE.test(payload.name) ? payload.name : null;
  const score = typeof payload.score === 'number' && Number.isSafeInteger(payload.score) && payload.score > 0 ? payload.score : null;
  const board = xar ? (isArcadeBoard(payload.board) ? ARCADE_BOARDS[payload.board].label : null) : payload.board === 'astro3' ? 'Campaign' : payload.board === 'astro3-daily' ? `Daily run · day ${Number(payload.period)}` : null;
  if (!name || score == null || !board || typeof payload.replay !== 'string') throw new Error('This score could not be read.');
  return { name, score, board, scoreText: xar && isArcadeBoard(payload.board) ? formatArcadeScore(payload.board, score) : fmt(score) };
}

/** What the host did: signed in place, handed off to a tab, or nothing (cancelled). */
export type ArcadeOutcome = { kind: 'tx'; txId: string } | { kind: 'tab'; tab: Window } | null;

type ArcadeLogic = typeof import('../../arcade-submit/inline');
export type ArcadeSubmitPorts = {
  wallet: { getSession: () => WalletSession; connect: () => Promise<WalletSession> };
  showContractCall: (options: any) => void;
  sessionChanged?: (session: WalletSession) => void;
  /** Loaded on first use so the replay engine stays out of the main bundle. */
  loadLogic?: () => Promise<ArcadeLogic>;
};

const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const short = (a: string) => (a.length > 16 ? `${a.slice(0, 6)}…${a.slice(-5)}` : a);
const stx = (u: bigint) => `${u / 1_000_000n}.${(u % 1_000_000n).toString().padStart(6, '0')}`;

export function runArcadeSubmit(host: Window, payload: Record<string, unknown>, label: string, id: string, ports: ArcadeSubmitPorts): Promise<ArcadeOutcome> {
  const info = describeArcadePayload(payload);
  const url = arcadeSubmitUrl(host.location.origin, payload, id);
  const doc = host.document;
  const loadLogic = ports.loadLogic ?? (() => import('../../arcade-submit/inline'));

  return new Promise((resolve) => {
    const make = <K extends keyof HTMLElementTagNameMap>(tag: K, css = '', text = '') => {
      const node = doc.createElement(tag);
      if (css) node.style.cssText = css;
      if (text) node.textContent = text;
      return node;
    };
    const dialog = make('dialog', 'max-width:500px;width:calc(100% - 32px);box-sizing:border-box;padding:24px;border:1px solid #3a4a7a;border-radius:16px;background:#0c1432;color:#eaf6ff;font:16px/1.5 system-ui;overflow-wrap:anywhere');
    dialog.setAttribute('aria-label', 'Submit arcade score');
    const title = make('h2', 'margin:0 0 8px;font-size:20px', 'Submit this score on-chain');
    const facts = make('p', 'white-space:pre-line;margin:0 0 12px;color:#b8c7e6');
    const status = make('p', 'margin:0 0 4px;min-height:1.5em');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    const note = make('p', 'margin:0;font-size:13px;color:#8fa3c8');
    const btn = (text: string, primary = false) => {
      const b = make('button', `font:inherit;padding:10px 16px;margin:12px 8px 0 0;border-radius:10px;cursor:pointer;border:1px solid ${primary ? '#39e6ff' : '#3a4a7a'};background:${primary ? 'linear-gradient(90deg,#39e6ff,#8a7dff)' : 'transparent'};color:${primary ? '#061022' : '#eaf6ff'};font-weight:${primary ? 700 : 500}`, text);
      b.type = 'button';
      return b;
    };
    const cancel = btn('Not now');
    const primary = btn('Please wait…', true);
    const tabLink = make('button', 'font:inherit;font-size:13px;background:none;border:0;padding:0;margin-top:14px;color:#39e6ff;text-decoration:underline;cursor:pointer;display:block', 'Open the submit page in a new tab instead');
    tabLink.type = 'button';
    // The name is not part of the replay, so it can be fixed here (older arcade builds swallowed some keys).
    const nameLabel = make('label', 'display:block;margin:0 0 12px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#8fa3c8', 'Name on the board');
    const nameInput = make('input', 'display:block;width:100%;box-sizing:border-box;margin-top:6px;padding:10px 12px;border-radius:10px;border:1px solid #3a4a7a;background:#070d24;color:#eaf6ff;font:600 18px/1.2 ui-monospace,Menlo,monospace;letter-spacing:.06em;text-transform:none');
    nameInput.value = info.name; nameInput.maxLength = 12; nameInput.autocomplete = 'off'; nameInput.spellcheck = false;
    nameLabel.append(nameInput);
    const nameOk = () => NAME_RE.test(nameInput.value.trim());
    nameInput.addEventListener('input', () => {
      nameInput.value = nameInput.value.replace(/[^A-Za-z0-9 _.-]/g, '').slice(0, 12);
      nameInput.style.borderColor = nameOk() ? '#3a4a7a' : '#ff8c8c';
    });
    dialog.append(title, facts, nameLabel, status, note, cancel, primary, tabLink);

    const setStatus = (text: string, tone: '' | 'ok' | 'err' = '') => {
      status.textContent = text;
      status.style.color = tone === 'ok' ? '#7dffb2' : tone === 'err' ? '#ff8c8c' : '#eaf6ff';
    };
    const setPrimary = (text: string, enabled: boolean, action: (() => void) | null) => {
      primary.textContent = text;
      primary.disabled = !enabled;
      primary.style.opacity = enabled ? '1' : '.45';
      primary.style.cursor = enabled ? 'pointer' : 'not-allowed';
      primaryAction = action;
    };
    let primaryAction: (() => void) | null = null;
    primary.onclick = () => primaryAction?.();

    let settled = false;
    let signing = false;
    let idle: ReturnType<typeof setTimeout> | undefined;
    const armIdle = () => { clearTimeout(idle); idle = setTimeout(() => { if (!signing) close(null); }, 15 * 60_000); };
    const settle = (outcome: ArcadeOutcome) => { if (!settled) { settled = true; resolve(outcome); } };
    const close = (outcome: ArcadeOutcome) => {
      clearTimeout(idle);
      settle(outcome);
      if (dialog.open) dialog.close();
      dialog.remove();
    };
    cancel.onclick = () => { if (!signing) close(null); };
    dialog.addEventListener('cancel', (event) => { event.preventDefault(); if (!signing) close(null); });
    tabLink.onclick = () => {
      if (signing) return;
      // Opened without noopener so the submit page can report the result back to this host.
      const tab = host.open(url, '_blank');
      if (tab) close({ kind: 'tab', tab });
      else setStatus('Your browser blocked the new tab. Allow pop-ups for this site, or submit here.', 'err');
    };

    facts.textContent = `${label}\nBoard: ${info.board}\nScore: ${info.scoreText}`;
    doc.body.append(dialog);
    dialog.showModal();
    armIdle();

    let logic!: ArcadeLogic;
    let verifiedOnce = false;
    let parsed: ReturnType<ArcadeLogic['parsePayload']>;
    let verified = 0;
    let board: Awaited<ReturnType<ArcadeLogic['loadBoard']>>;

    const refresh = async () => {
      armIdle();
      const session = ports.wallet.getSession();
      const address = session.isConnected ? session.address : undefined;
      if (!address) {
        note.textContent = `Connect the wallet this run was flown for (${short(parsed.pilot)}).`;
        setPrimary('Connect wallet', true, connect);
        return;
      }
      if (!/^S[PM]/.test(address) || session.network === 'testnet') {
        note.textContent = 'Switch your wallet to a mainnet account.';
        setPrimary('Switch wallet', true, connect);
        return;
      }
      if (!logic.isPilot(parsed.replay, address)) {
        note.textContent = `This run was flown as ${parsed.pilot}, but the connected wallet is ${address}. Connect that wallet to submit it.`;
        setPrimary('Switch wallet', true, connect);
        return;
      }
      if (!board.enabled) { note.textContent = 'This leaderboard is closed.'; setPrimary('Submit', false, null); return; }
      setPrimary('Checking rank…', false, null);
      note.textContent = 'Checking your rank on-chain…';
      const rank = await logic.previewRank(parsed, verified, address);
      if (settled) return;
      const fee = board.fee > 0n ? `Entry fee ${stx(board.fee)} STX plus the network fee.` : 'No entry fee: you pay only the network fee your wallet shows.';
      if (rank === 0) {
        note.textContent = 'The contract would refuse this score right now: it is not in the Top 10, or you already hold an equal or better entry.';
        setPrimary('Submit', false, null);
        return;
      }
      note.textContent = `${rank === null ? 'Could not check your rank right now; the contract checks again before anything is charged.' : `This run takes rank #${rank}.`} ${fee}`;
      setPrimary('Sign and submit', true, sign);
    };

    const connect = async () => {
      setPrimary('Waiting for wallet…', false, null);
      try {
        const session = await ports.wallet.connect();
        try { ports.sessionChanged?.(session); } catch { /* host UI refresh is best effort */ }
      } catch (e) {
        setStatus(e instanceof Error ? e.message : 'Wallet connection failed.', 'err');
      }
      if (!settled) await refresh();
    };

    const sign = async () => {
      const address = ports.wallet.getSession().address;
      if (!address || signing) return;
      if (!nameOk()) { setStatus('Names are 3–12 letters, numbers, spaces, dots, dashes or underscores.', 'err'); nameInput.focus(); return; }
      parsed = { ...parsed, name: nameInput.value.trim() };
      let call;
      try { call = logic.buildSubmitCall(parsed, verified, address, board); }
      catch (e) { setStatus(e instanceof Error ? e.message : String(e), 'err'); return; }
      signing = true;
      clearTimeout(idle);
      cancel.disabled = true; tabLink.style.visibility = 'hidden';
      setPrimary('Waiting for wallet…', false, null);
      setStatus('Opening your wallet…');
      try {
        const txId = await logic.signSubmit(ports.showContractCall, call, (t) => setStatus(t));
        signing = false;
        settle({ kind: 'tx', txId });
        setStatus(`Submitted. Your score appears on the board once transaction ${txId.slice(0, 12)}… confirms (usually a few minutes).`, 'ok');
        const a = make('a', 'color:#39e6ff', 'View the transaction');
        a.setAttribute('href', `https://explorer.hiro.so/txid/${txId}?chain=mainnet`);
        a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener');
        note.replaceChildren(a);
        cancel.hidden = true; tabLink.hidden = true;
        setPrimary('Done', true, () => close({ kind: 'tx', txId }));
      } catch (e) {
        signing = false;
        cancel.disabled = false; tabLink.style.visibility = '';
        const cancelled = e instanceof logic.SubmitCancelled;
        setStatus(cancelled ? 'Cancelled in the wallet. Nothing was sent.' : logic.submitErrorMessage(e), cancelled ? '' : 'err');
        await refresh();
      }
    };

    const load = async () => {
      if (!verifiedOnce) {
        setStatus('Replaying your run to confirm the score…');
        try {
          logic = await loadLogic();
          parsed = logic.parsePayload(payload);
        } catch (e) {
          setStatus(e instanceof Error ? e.message : 'This score could not be read.', 'err');
          setPrimary('Submit', false, null);
          return;
        }
        await new Promise((r) => setTimeout(r, 30)); // let the dialog paint first
        const v = await logic.verifyPayload(parsed);
        if (settled) return;
        if (!v.ok) { setStatus(`${v.reason} This run cannot be submitted.`, 'err'); setPrimary('Submit', false, null); return; }
        verified = v.score;
        verifiedOnce = true;
      }
      setStatus('Reading the leaderboard…');
      try { board = await logic.loadBoard(parsed.board); }
      catch (e) { setStatus(e instanceof Error ? e.message : 'Could not read the leaderboard.', 'err'); setPrimary('Try again', true, () => void load()); return; }
      if (await logic.isPeriodClosed(parsed)) {
        setStatus('That day’s board has closed. Daily scores must be submitted the same Bitcoin day or the next.', 'err');
        setPrimary('Submit', false, null);
        return;
      }
      setStatus(`Run checked: ${info.scoreText}.`, 'ok');
      if (!settled) await refresh();
    };
    void load();
  });
}
