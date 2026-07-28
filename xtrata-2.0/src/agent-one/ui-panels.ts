// Shared wizard UI panels → window.XtrataUI, bundled into agent-one.js.
//
// Both wizard pages had their own copy of every panel below, which is why each fix
// this week had to be applied twice — and why the two pages drifted into answering
// the same question differently. One implementation, loaded by the one script tag
// both pages already have, so there is no new file to cache-bust.
//
// Each panel injects its own CSS once and depends on the host page only for the
// theme variables (--panel, --line, --mut, --acc2) and the .btn class.

import { unfinishedJobs } from './unfinished';

// Asks the DOM, not a module flag: a flag would be true while the <style> it refers to
// had been replaced, and the panel would render unstyled with no way to recover.
function styleOnce(id: string, css: string) {
  if (typeof document === 'undefined') return;
  if (document.querySelector(`style[data-xao-ui="${id}"]`)) return;
  const el = document.createElement('style');
  el.setAttribute('data-xao-ui', id);
  el.textContent = css;
  document.head.appendChild(el);
}

// ---------- confirmDanger ----------
// A blocking are-you-sure for irreversible actions. Resolves true only on an explicit
// yes: Escape, the backdrop and the safe button all resolve false, and the SAFE option
// takes focus so a stray Return never destroys anything.
export function confirmDanger(opts: {
  title: string; body: string; confirmLabel?: string; cancelLabel?: string;
}): Promise<boolean> {
  styleOnce('danger', `
  .danger-confirm{position:fixed;inset:0;z-index:95;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,.6)}
  .danger-confirm[hidden]{display:none}
  .danger-panel{width:min(440px,100%);max-height:90vh;overflow-y:auto;padding:18px;border:1px solid var(--line);border-radius:14px;background:var(--panel);box-shadow:0 18px 44px rgba(0,0,0,.45)}
  .danger-title{font-weight:800;font-size:15.5px;margin-bottom:8px}
  .danger-body{font-size:13px;line-height:1.55;color:var(--mut)}
  .danger-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;margin-top:14px}
  .danger-actions .btn{width:auto;margin:0;padding:8px 14px;font-size:13px}
  .danger-yes{background:linear-gradient(180deg,#e0603f,#c14a2c)}`);

  return new Promise((resolve) => {
    const prev = document.activeElement as HTMLElement | null;
    const wrap = document.createElement('div');
    wrap.className = 'danger-confirm';
    wrap.innerHTML = '<div class="danger-panel" role="alertdialog" aria-modal="true">'
      + '<div class="danger-title"></div><div class="danger-body"></div>'
      + '<div class="danger-actions">'
      + '<button type="button" class="btn ghost" data-x="no"></button>'
      + '<button type="button" class="btn danger-yes" data-x="yes"></button>'
      + '</div></div>';
    const q = (sel: string) => wrap.querySelector(sel) as HTMLElement;
    // textContent, never innerHTML: the body carries token ids and job text.
    q('.danger-title').textContent = opts.title;
    q('.danger-body').textContent = opts.body;
    q('[data-x="no"]').textContent = opts.cancelLabel || 'Keep going';
    q('[data-x="yes"]').textContent = opts.confirmLabel || 'Yes, stop it';

    let done = false;
    const close = (v: boolean) => {
      if (done) return;
      done = true;
      document.removeEventListener('keydown', onKey, true);
      wrap.remove();
      if (prev && prev.focus) prev.focus({ preventScroll: true });
      resolve(v);
    };
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') { e.preventDefault(); close(false); } }
    q('[data-x="no"]').onclick = () => close(false);
    q('[data-x="yes"]').onclick = () => close(true);
    wrap.addEventListener('click', (e) => { if (e.target === wrap) close(false); });
    document.addEventListener('keydown', onKey, true);
    document.body.appendChild(wrap);
    q('[data-x="no"]').focus({ preventScroll: true });
  });
}

// ---------- keep-this-tab-open banner ----------
// The agent IS the tab. While a job is live, closing it does not cancel anything —
// the work simply stops, mid-upload, with the deposit still on a wallet only this
// browser can open. The banner exists to make that visible before it happens, and to
// keep saying something concrete: a progress bar that stops moving is indistinguishable
// from a crash, while "4 of 16 chunks on-chain" is obviously alive.

// A job is live while this browser still has work to do for it.
const LIVE_STATES = ['AWAITING_DEPOSIT', 'AWAITING_PARENT', 'FUNDED', 'INSCRIBING', 'INSCRIBED', 'DELIVERING'];
let jobIsLive = false;
let guardInstalled = false;

function installLeaveGuard() {
  if (guardInstalled || typeof window === 'undefined') return;
  guardInstalled = true;
  window.addEventListener('beforeunload', (e: BeforeUnloadEvent) => {
    if (!jobIsLive) return;
    e.preventDefault();
    e.returnValue = '';
    return '';
  });
}

// EMBEDDED: tell the page hosting us whether work is in flight.
//
// A beforeunload registered inside an iframe is not reliably honoured when the PARENT
// is the page being closed — it depends on the browser and on that frame's own user
// activation. The parent's own guard always is. So the frame reports the one fact it
// knows and the host decides what to do with it.
//
// Same-origin only: the target origin is pinned, and the host checks the sender.
const isEmbedded = () => typeof window !== 'undefined' && window.parent !== window;
let lastReported: string | null = null;
function reportLiveToHost(live: boolean, detail: string, short: string) {
  if (!isEmbedded()) return;
  const signature = `${live}|${short}`;
  if (signature === lastReported) return;       // only on change
  lastReported = signature;
  try {
    window.parent.postMessage({ type: 'xtrata:job:live', live, detail, short }, window.location.origin);
  } catch { /* cross-origin host: nothing we can do, and nothing we should throw over */ }
}

// ---------- progress in the tab title ----------
// A tab you are not looking at is throttled, not stopped — but from the outside it is
// indistinguishable from a tab doing nothing, which is how a running job gets closed by
// accident. The tab strip is the one piece of UI visible without switching to it.
//
// Embedded, the frame's own title is invisible (the host's is what shows), so the frame
// hands its progress up and the host writes it. Same channel as the leave guard.
let originalTitle: string | null = null;
export function setTitleProgress(short: string | null) {
  if (typeof document === 'undefined') return;
  if (short) {
    if (originalTitle === null) originalTitle = document.title;   // capture once per job
    document.title = `${short} · ${originalTitle}`;
  } else if (originalTitle !== null) {
    document.title = originalTitle;
    originalTitle = null;   // RELEASE, so a title set for any other reason later is not
                            // overwritten by a stale capture from a job long finished.
  }
}

// ---------- notify when it finishes ----------
// Permission is asked for on a CLICK and never on load: an unprompted permission
// dialog is usually dismissed (or auto-blocked), which burns the one chance to ask.
// The offer only appears while a job is actually running, when it means something.
const NOTIFY_KEY = 'xtrata.notify.onfinish';
const notifyWanted = () => { try { return localStorage.getItem(NOTIFY_KEY) === '1'; } catch { return false; } };
const N = () => (typeof window !== 'undefined' ? (window as any).Notification : undefined);

export function notifyAvailable(): boolean {
  const n = N();
  return !!n && n.permission !== 'denied';
}

/** Returns true if notifications are now on. Must be called from a user gesture. */
export async function enableFinishNotice(): Promise<boolean> {
  const n = N();
  if (!n) return false;
  let perm = n.permission;
  if (perm === 'default') { try { perm = await n.requestPermission(); } catch { return false; } }
  if (perm !== 'granted') return false;
  try { localStorage.setItem(NOTIFY_KEY, '1'); } catch { /* private mode: on for this session only */ }
  return true;
}

// Fire once per transition into an end state, not on every poll that reports it.
let lastNotifiedStatus: string | null = null;
const FINISH_MESSAGE: Record<string, string> = {
  COMPLETE: 'Your inscription is finished and back in your wallet.',
  COMPLETE_WITH_SKIPS: 'Your batch finished — some items were skipped and refunded.',
  CANCELLED: 'Your job was stopped and your deposit returned.',
  NEEDS_FUNDS: 'Your job is paused and needs more STX to finish.',
  NEEDS_RECOVERY: 'Your job needs you: something is still in the deposit wallet.'
};
function notifyOnFinish(status: string) {
  const message = FINISH_MESSAGE[status];
  if (!message) { if (LIVE_STATES.includes(status)) lastNotifiedStatus = null; return; }
  if (status === lastNotifiedStatus) return;
  lastNotifiedStatus = status;
  const n = N();
  if (!n || n.permission !== 'granted' || !notifyWanted()) return;
  // Only worth interrupting for if they are not already looking at it.
  if (typeof document !== 'undefined' && document.visibilityState === 'visible') return;
  try { new n('Xtrata', { body: message, tag: 'xtrata-job', icon: '/favicon.svg' }); } catch { /* never break a job over a notification */ }
}

/** "96/459" or "paying" — short enough to survive a narrow tab. */
function shortProgress(job: any, status: string): string {
  const m = /(\d+)\s*\/\s*(\d+)\s*chunks/.exec((job && job.progress) || '');
  if (m) return `⬤ ${m[1]}/${m[2]}`;
  if (status === 'AWAITING_DEPOSIT') return '⬤ awaiting payment';
  if (status === 'AWAITING_PARENT') return '⬤ awaiting parent';
  if (status === 'DELIVERING') return '⬤ delivering';
  return '⬤ inscribing';
}

/** What the browser is doing right now, in words rather than a bar. */
function liveDetail(job: any, status: string): string {
  const m = /(\d+)\s*\/\s*(\d+)\s*chunks/.exec((job && job.progress) || '');
  if (m) return `uploading — ${m[1]} of ${m[2]} chunks on-chain so far`;
  if (status === 'AWAITING_DEPOSIT') return 'waiting for your payment to confirm';
  if (status === 'AWAITING_PARENT') return 'waiting for the parent inscription';
  if (status === 'DELIVERING') return 'sending your inscription and change back';
  return 'the agent is working in this browser';
}

/**
 * Renders (or hides) the keep-open banner inside `mount`, and arms the leave guard.
 * Returns whether the job is live. Call it on every status refresh.
 */
export function keepOpenBanner(opts: { job: any; status: string; mount: HTMLElement | null }) {
  installLeaveGuard();
  const mount = opts.mount;
  if (!mount) {
    jobIsLive = LIVE_STATES.includes(opts.status);
    const short = jobIsLive ? shortProgress(opts.job, opts.status) : null;
    reportLiveToHost(jobIsLive, liveDetail(opts.job, opts.status), short || '');
    if (!isEmbedded()) setTitleProgress(short);
    notifyOnFinish(opts.status);
    return { live: false };
  }

  jobIsLive = LIVE_STATES.includes(opts.status);
  const short = jobIsLive ? shortProgress(opts.job, opts.status) : null;
  reportLiveToHost(jobIsLive, liveDetail(opts.job, opts.status), short || '');
  if (!isEmbedded()) setTitleProgress(short);
  notifyOnFinish(opts.status);
  let box = mount.querySelector('.xao-keepopen') as HTMLElement | null;
  if (!jobIsLive) { box?.remove(); return { live: false }; }

  styleOnce('keepopen', `
  .xao-keepopen{margin-top:12px;padding:10px 12px;border:1px solid var(--acc2,#7c5cff);border-radius:10px;background:rgba(124,92,255,.08);font-size:12.5px;line-height:1.5}
  .xao-keepopen .xao-ko-custody{font-size:11.5px;margin-top:4px;color:var(--mut)}
  .xao-keepopen .xao-ko-notify{margin-top:8px;padding:5px 11px;font:inherit;font-size:11.5px;border-radius:8px;cursor:pointer;
    border:1px solid var(--line);background:transparent;color:var(--ink)}
  .xao-keepopen .xao-ko-notify[hidden]{display:none}
  .xao-keepopen .xao-ko-warn{font-size:11.5px;margin-top:6px;color:var(--bad,#e0603f)}`);

  if (!box) {
    box = document.createElement('div');
    box.className = 'xao-keepopen';
    box.setAttribute('role', 'status');
    // The custody sentence belongs HERE rather than in a tips rotation: this is the
    // moment the constraint bites, and the same fact that forces the tab to stay open
    // is the reason nobody else can touch the money.
    box.innerHTML = '<div><b>🔒 Keep this tab open</b> — <span class="xao-ko-steps"></span></div>'
      + '<button type="button" class="xao-ko-notify" hidden>🔔 Tell me when it is done</button>'
      + '<div class="xao-ko-custody">Your deposit sits in a one-shot wallet <b>your browser created and only it can spend from</b>'
      + ' — that is why this has to stay open, and also why nobody else can touch your funds.'
      + ' Closing pauses the job; you can resume it or take a refund when you come back.</div>'
      + '<div class="xao-ko-warn" hidden></div>';
    mount.appendChild(box);
  }
  (box.querySelector('.xao-ko-steps') as HTMLElement).textContent = liveDetail(opts.job, opts.status);

  // Offered only while something is actually running, and only if it can be granted.
  const notifyBtn = box.querySelector('.xao-ko-notify') as HTMLButtonElement;
  const showOffer = notifyAvailable() && !(N()?.permission === 'granted' && notifyWanted());
  notifyBtn.hidden = !showOffer;
  if (showOffer && !notifyBtn.dataset.wired) {
    notifyBtn.dataset.wired = '1';
    notifyBtn.onclick = async () => {
      notifyBtn.disabled = true;
      const on = await enableFinishNotice();
      notifyBtn.textContent = on ? '🔔 You will be told when it is done' : '🔔 Notifications are blocked in this browser';
      notifyBtn.disabled = false;
      if (on) setTimeout(() => { notifyBtn.hidden = true; }, 2500);
    };
  }

  // If the file could not be saved for resume, closing the tab is genuinely
  // destructive rather than merely a pause — say so plainly rather than leaving the
  // generic "keep it open" to carry a warning it cannot convey.
  const warn = box.querySelector('.xao-ko-warn') as HTMLElement;
  const agent = (window as any).XtrataAgent;
  let persistError: string | null = null;
  try { persistError = (agent && agent.getBytesPersistError && agent.getBytesPersistError()) || null; } catch { /* older bundle */ }

  if (persistError) {
    warn.hidden = false;
    warn.textContent = `⚠ This browser would not save your file for resume (${persistError}). If you close this tab the job cannot resume and will refund instead.`;
  } else if (opts.job && opts.job.storageDurability === 'refused') {
    warn.hidden = false;
    warn.textContent = '⚠ This browser declined to mark its storage as permanent, so it may clear the deposit key if disk space runs low. Try to leave this tab open until the job finishes.';
  } else {
    warn.hidden = true;
    warn.textContent = '';
  }
  return { live: true };
}

// ---------- unfinished-job reminder ----------
// The agent lives in the tab, so an unfinished job vanishes from view the moment the
// tab closes. If it was funded, its one-shot wallet is holding real money until
// somebody comes back for it — and nothing on any other page said so.
//
// What this deliberately does NOT do is assert. The status is what THIS BROWSER last
// saw; the job may have finished since. So the copy says "last seen" and the action is
// to go and look, which re-checks against the chain.

const DISMISSED = 'xtrata.unfinished.dismissed';
const readDismissed = (): string[] => {
  try { return JSON.parse(localStorage.getItem(DISMISSED) || '[]'); } catch { return []; }
};
export function dismissUnfinished(jobId: string) {
  try { localStorage.setItem(DISMISSED, JSON.stringify([...new Set([...readDismissed(), jobId])].slice(-50))); } catch { /* private mode */ }
}

const ago = (iso: string | null): string => {
  const t = iso ? Date.parse(iso) : NaN;
  if (!isFinite(t)) return 'earlier';
  const m = Math.max(0, Math.round((Date.now() - t) / 60000));
  if (m < 2) return 'just now';
  if (m < 60) return `${m} minutes ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`;
  const d = Math.round(h / 24);
  return `${d} day${d === 1 ? '' : 's'} ago`;
};

/**
 * Renders a reminder for the most pressing unfinished job, if there is one.
 * Returns the job it showed, or null. Safe to call on any page: it does nothing when
 * XtrataAgent has not loaded, when nothing is unfinished, or when the only unfinished
 * job is the one this page is already running (`skipJobId`).
 */
export function unfinishedBanner(opts: { skipJobId?: string | null; mount?: HTMLElement } = {}) {
  if (typeof document === 'undefined') return null;
  // Reads storage directly rather than through window.XtrataAgent, so the home page can
  // warn about an abandoned job without loading the whole agent bundle.
  let jobs: any[] = [];
  try { jobs = unfinishedJobs(); } catch { return null; }
  const dismissed = readDismissed();
  const job = jobs.find((j) => j.jobId !== opts.skipJobId && !(dismissed.includes(j.jobId) && !j.funded));
  if (!job) return null;

  styleOnce('unfinished', `
  .xao-unfinished{position:fixed;left:50%;transform:translateX(-50%);bottom:16px;z-index:90;width:min(560px,calc(100% - 24px));
    padding:13px 15px;border:1px solid var(--line);border-radius:12px;background:var(--panel);box-shadow:0 14px 38px rgba(0,0,0,.5);font-size:13px;line-height:1.5}
  .xao-unfinished.funded{border-color:#e0a03f}
  .xao-unfinished b{display:block;margin-bottom:3px;font-size:13.5px}
  .xao-unfinished .xao-sub{color:var(--mut);font-size:12px}
  .xao-unfinished .xao-acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:11px;align-items:center}
  .xao-unfinished a.xao-go{padding:7px 13px;border-radius:9px;background:linear-gradient(180deg,#7c5cff,#5b3fd6);color:#fff;text-decoration:none;font-weight:600;font-size:12.5px}
  .xao-unfinished button.xao-dismiss{margin-left:auto;background:none;border:0;color:var(--mut);cursor:pointer;font-size:12px;text-decoration:underline;padding:4px}`);

  document.querySelector('.xao-unfinished')?.remove();
  const box = document.createElement('div');
  box.className = 'xao-unfinished' + (job.funded ? ' funded' : '');
  box.setAttribute('role', 'status');

  const title = document.createElement('b');
  title.textContent = job.funded
    ? 'You have an inscription still in progress'
    : 'You started an inscription but never paid for it';
  const sub = document.createElement('div');
  sub.className = 'xao-sub';
  // "last seen" is the honest framing: this is local memory, not chain state.
  sub.textContent = job.funded
    ? `${job.label} — last seen ${ago(job.lastSeenAt)}${job.needsRecovery ? ', and it stopped partway' : ''}. Your deposit is on a one-shot wallet only this browser holds the key to, so it needs you to come back and either finish it or take the refund.`
    : `${job.label} — started ${ago(job.createdAt)}. Nothing was paid, so there is nothing at stake; open it to carry on, or dismiss this.`;

  const acts = document.createElement('div');
  acts.className = 'xao-acts';
  const go = document.createElement('a');
  go.className = 'xao-go';
  go.href = job.href;
  go.textContent = job.funded ? 'Finish or refund it' : 'Pick it up';
  const dismiss = document.createElement('button');
  dismiss.type = 'button';
  dismiss.className = 'xao-dismiss';
  // A funded job is never dismissed for good — money is still on that wallet, so it
  // comes back next visit. Only the nothing-at-stake case can be silenced permanently.
  dismiss.textContent = job.funded ? 'Not now' : 'Dismiss';
  dismiss.onclick = () => { if (!job.funded) dismissUnfinished(job.jobId); box.remove(); };

  acts.append(go, dismiss);
  box.append(title, sub, acts);
  (opts.mount || document.body).appendChild(box);
  return job;
}

// Also exposed as a global for the two wizard pages, which are plain HTML with inline
// scripts and cannot import.
if (typeof window !== 'undefined') {
  const w = window as any;
  w.XtrataUI = Object.assign(w.XtrataUI || {}, { confirmDanger, unfinishedBanner, dismissUnfinished, keepOpenBanner, setTitleProgress, enableFinishNotice, notifyAvailable });
}
