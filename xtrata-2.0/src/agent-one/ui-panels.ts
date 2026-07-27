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
  w.XtrataUI = Object.assign(w.XtrataUI || {}, { confirmDanger, unfinishedBanner, dismissUnfinished });
}
