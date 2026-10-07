/* eslint-disable @typescript-eslint/no-explicit-any */
// ui.ts: the large-token panel on a Forever Twins collection page. Plain DOM, no framework.
//
// One panel per token. It either starts a new job (fetch + verify the art, show the quote, make the
// disposable wallet, show the funding address) or re-attaches to the unfinished job for this token that is
// saved in this browser, and shows its progress. All money logic lives in the engine; this file only
// renders and forwards clicks.

const esc = (s: any) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
const stx = (u: any) => { const n = Number(BigInt(String(u ?? 0))) / 1e6; return `${n.toFixed(n >= 100 ? 1 : 3).replace(/0+$/, '').replace(/\.$/, '')} STX`; };
const mb = (n: number) => (n >= 1048576 ? `${(n / 1048576).toFixed(2)} MB` : `${(n / 1024).toFixed(0)} KB`);
const clock = (ms: number) => { const s = Math.max(0, Math.round(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const explorer = (txid: string) => `https://explorer.hiro.so/txid/${esc(txid)}?chain=mainnet`;

export interface PanelCtx {
  engine: any;                                   // createEngine(...) result
  coll: any;                                     // registry entry
  reg: any;
  tokenId: string;
  canonical: { hash: string; totalSize: number; mime: string; tokenUri: string };
  wallet: () => string | null;                   // the connected wallet right now, if any (a getter: it can change while the panel is open)
  fetchBytes: (tokenId: string, onProgress?: (m: string) => void) => Promise<Uint8Array>;   // fetch the original art from the source URI
  onTwinned?: () => void;                        // ask the page to look the token up again
  copy?: (text: string) => void;
}

const TERMINAL = new Set(['COMPLETE', 'STOPPED', 'NEEDS_RECOVERY']);

export function mountPanel(el: HTMLElement, ctx: PanelCtx) {
  const { engine, coll, tokenId } = ctx;
  let job: any = null;                           // the public job (no key) for this token, if one exists
  let plan: any = null;                          // a quote shown before any job exists
  let bytes: Uint8Array | null = null;
  let busy = '';                                 // a one-line message while something is happening
  let error = '';
  let timer: any = null;
  let wake: any = null;
  const me = () => ctx.wallet();
  const lockFunder = { on: true };

  // The newest job for this token on this helper: a live one if there is one, otherwise the last finished one.
  const pick = () => { const l = engine.list().filter((j: any) => String(j.token) === String(tokenId) && j.helper === coll.helper); const live = l.filter((j: any) => !['COMPLETE'].includes(j.status)); return (live.length ? live : l).slice(-1)[0] || null; };

  async function acquireWake() { try { if ((navigator as any).wakeLock && !wake) { wake = await (navigator as any).wakeLock.request('screen'); wake.addEventListener?.('release', () => { wake = null; }); } } catch { /* optional */ } }
  function guard(e: BeforeUnloadEvent) { if (job && ['RUNNING', 'NEEDS_FUNDS', 'SWEEP_PENDING', 'STOPPING'].includes(job.status)) { e.preventDefault(); e.returnValue = ''; } }
  window.addEventListener('beforeunload', guard);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && job && !TERMINAL.has(job.status)) void acquireWake(); });

  function refresh() { job = job ? engine.get(job.id) : pick(); render(); }
  function drive(id: string) {
    void acquireWake();
    engine.run(id).then(() => { refresh(); if (job && job.outcome === 'twinned') ctx.onTwinned && ctx.onTwinned(); }).catch((e: any) => { error = String(e && e.message || e); refresh(); });
  }

  // -------------------------------------------------------------------------------- views
  function intro() {
    const size = ctx.canonical.totalSize;
    return `<p>This token’s art is <strong>${mb(size)}</strong>, over the 512 KB that one transaction can carry. It can still be twinned from this page, using the same large-file method as the Xtrata inscription wizard:</p>
      <ol class="mute small">
        <li>A one-use wallet is made in your browser. You send it the quoted amount from your own wallet.</li>
        <li>This page uploads the art in about ${Math.ceil(size / 524288)} steps, seals it, and puts the twin into the helper’s custody.</li>
        <li>The moment the twin is confirmed, 5% of everything you sent goes to Xtrata as the processing fee and all the change goes back to the address that paid, in the same block.</li>
      </ol>
      <p class="mute small">Keep this tab open while it runs. If you close it, reopen this page on this device and it picks up where it left off; nothing is lost. The twin gives no claim on the original.</p>`;
  }
  function quoteTable(p: any) {
    const protocol = BigInt(p.protocolFee), miner = BigInt(p.minerUpload), helper = BigInt(p.helperFee), agent = BigInt(p.agentFee || 0);
    const total = BigInt(p.required);
    const reserve = total - protocol - miner - helper - agent;
    const busyNet = BigInt(p.congestionX10 || 10) > 14n ? `<div class="msg warn">Network fees are higher than usual right now. The amount below already allows for it, and the page will wait for fees to settle rather than overpay. You can also come back later.</div>` : '';
    return `${busyNet}<table class="quote" style="width:100%;border-collapse:collapse">
      <tr><td>Xtrata storage fee (live from the core contract)</td><td style="text-align:right">${stx(protocol)}</td></tr>
      <tr><td>Network (miner) fees, reserved for ${p.batches} upload step${p.batches === 1 ? '' : 's'} plus 3 small transactions</td><td style="text-align:right">${stx(miner + BigInt(p.smallFees))}</td></tr>
      <tr><td>Forever Twins fee (paid to the two collection payees, half each)</td><td style="text-align:right">${stx(helper)}</td></tr>
      <tr><td>Processing fee (${p.agentFeePct}% of everything you send; only charged if the twin is made)</td><td style="text-align:right">${stx(agent)}</td></tr>
      <tr><td>Safety reserve (returned if unused)</td><td style="text-align:right">${stx(reserve - BigInt(p.smallFees))}</td></tr>
      <tr><td><strong>Send exactly</strong></td><td style="text-align:right"><strong>${stx(total)}</strong></td></tr></table>
      <p class="mute small">Send exactly this amount: the ${p.agentFeePct}% processing fee applies to whatever arrives, so sending more only adds to the fee. A quiet network is expected to use about ${stx(p.expected)}; the rest, about ${stx(BigInt(p.required) - BigInt(p.expected))}, comes back automatically.</p>`;
  }
  function startView() {
    const w = me();
    const lock = w ? `<label class="small"><input type="checkbox" id="ftlLock" ${lockFunder.on ? 'checked' : ''}> Only accept the payment from my connected wallet (${esc(w.slice(0, 7))}…${esc(w.slice(-5))}). Anything sent from elsewhere is returned.</label>` : '<p class="mute small">Connect a wallet to lock the payment to it. Without that, the change goes back to whichever address pays.</p>';
    return `${intro()}${plan ? quoteTable(plan) + lock + `<div class="row spaced"><button type="button" id="ftlCreate">Create the one-use wallet</button></div>` : `<div class="row"><button type="button" id="ftlPrep">Fetch the art and get the exact price</button></div>`}`;
  }
  const phases = (j: any) => {
    const st = j.status, step = j.step;
    const upload = `Upload the art (${j.uploaded || 0}/${j.chunks} chunks)`;
    const idx = st === 'AWAITING_FUNDS' ? 0 : st === 'NEEDS_FUNDS' || st === 'RUNNING' ? (step === 'preflight' || step === 'begin' || step === 'upload' ? 1 : step === 'seal' ? 2 : 3) : st === 'SWEEP_PENDING' ? 4 : st === 'STOPPING' ? (j.outcome === 'twinned' ? 4 : 1) : 5;
    const items = ['Send the funds', upload, 'Seal the inscription', 'Create the twin', 'Pay the processing fee and return the change'];
    return `<ol class="steps">${items.map((t, i) => `<li class="${i < idx ? 'done' : i === idx ? 'cur' : ''}">${esc(t)}</li>`).join('')}</ol>`;
  };
  function jobView(j: any) {
    const addr = esc(j.address);
    const req = stx(j.required);
    const log = (j.log || []).slice(-8).reverse().map((l: any) => `<div class="mute small">${new Date(l.t).toLocaleTimeString()} · ${esc(l.m)}</div>`).join('');
    let head = '';
    if (j.status === 'AWAITING_FUNDS') {
      head = `<div class="msg">Send exactly <strong>${req}</strong> to this one-use address. It was made in your browser and is kept in this browser until it is emptied.</div>
        <div class="row"><code style="word-break:break-all">${addr}</code> <button type="button" class="ghost" data-copy="${addr}">Copy address</button> <button type="button" class="ghost" data-copy="${(Number(BigInt(j.required)) / 1e6).toFixed(6)}">Copy amount</button></div>
        <p class="mute small">${j.expectedFunder ? `Only a payment from ${esc(j.expectedFunder)} is accepted.` : 'The leftover is returned to whichever address pays.'} Balance seen: ${stx(j.balance || 0)}. This page checks every few seconds. Nothing has been spent yet; you can cancel and nothing is taken.</p>
        <div class="row"><button type="button" class="ghost" id="ftlCancel">Cancel</button></div>`;
    } else if (j.status === 'NEEDS_FUNDS') {
      head = `<div class="msg warn">Paused: ${esc(j.error || 'more STX is needed')}.<br>Send at least <strong>${stx(j.shortfall || 0)}</strong> more to <code style="word-break:break-all">${addr}</code> to continue. The processing fee applies to top-ups too. Nothing is lost while it waits; if nothing changes for 2 hours it stops and returns what is left.</div>
        <div class="row"><button type="button" class="ghost" data-copy="${addr}">Copy address</button></div>`;
    } else if (j.status === 'RUNNING') {
      const pct = j.chunks ? Math.round(((j.uploaded || 0) / j.chunks) * 100) : 0;
      head = `<div class="msg">Working. Please keep this tab open. ${j.error ? `<span class="mute small">Last hiccup: ${esc(j.error)} (retrying)</span>` : ''}</div>
        <div style="background:#0001;border-radius:6px;height:10px;overflow:hidden"><div style="height:10px;width:${pct}%;background:var(--accent,#1f5fe0)"></div></div>
        ${j.sealedId ? '' : '<div class="row spaced"><button type="button" class="ghost" id="ftlCancel">Cancel and return the funds</button></div>'}`;
    } else if (j.status === 'SWEEP_PENDING') {
      head = `<div class="msg ok">Twin created: token #${esc(j.token)} is now bound to inscription #${esc(j.sealedId)}. The processing fee and your change are sent automatically in <strong data-count="${j.sweepAfter}">${clock(j.sweepAfter - Date.now())}</strong>.</div>`;
    } else if (j.status === 'STOPPING') {
      head = `<div class="msg ${j.outcome === 'twinned' ? 'ok' : ''}">${j.outcome === 'twinned' ? `Twin created: token #${esc(j.token)} is bound to inscription #${esc(j.sealedId)}. Sending the processing fee and your change now.` : esc(j.message || 'Returning the leftover STX…')}</div>`;
    } else if (j.status === 'COMPLETE') {
      head = `<div class="msg ok"><strong>Done.</strong> Token #${esc(j.token)} now has a permanent twin (inscription #${esc(j.sealedId)}). ${stx(j.sweptUstx || 0)} was returned${j.agentFeePaid && j.agentFeePaid !== '0' ? `, after the ${stx(j.agentFeePaid)} processing fee` : ''}. <a href="${explorer(j.bindTx || '')}" target="_blank" rel="noopener">View the final transaction</a>.</div>`;
    } else if (j.status === 'STOPPED') {
      head = `<div class="msg ${j.outcome === 'lost-race' || j.outcome === 'twinned' ? 'warn' : 'warn'}">${esc(j.message || 'Stopped.')}</div>
        ${j.resumable && j.mnemonic ? `<div class="row"><button type="button" id="ftlResume">Add funds and resume</button> <span class="mute small">The paid-for upload is kept for about 6 hours.</span></div>` : ''}
        ${j.keepKey && !j.resumable ? `<p class="mute small">${esc(j.keepKeyReason || '')}</p>` : ''}`;
    } else if (j.status === 'NEEDS_RECOVERY') {
      head = `<div class="msg bad">${esc(j.message || 'Something is left in the one-use wallet.')} Keep this browser; the job will keep trying.</div>`;
    }
    return `${phases(j)}${head}<details class="spaced"><summary class="mute small">Details</summary>${log || '<div class="mute small">No events yet.</div>'}<p class="mute small">Wallet: ${addr}</p></details>`;
  }

  function render() {
    if (!el.isConnected) { clearInterval(timer); window.removeEventListener('beforeunload', guard); return; }
    const body = job ? jobView(job) : startView();
    el.innerHTML = `<div class="large-wizard"><h3 style="margin-top:0">Large-file twin</h3>${body}${busy ? `<div class="msg">${esc(busy)}</div>` : ''}${error ? `<div class="msg bad">${esc(error)}</div>` : ''}</div>`;
  }

  // -------------------------------------------------------------------------------- actions
  async function prepare() {
    error = ''; busy = 'Fetching the original art…'; render();
    try {
      bytes = await ctx.fetchBytes(tokenId, (m) => { busy = m; render(); });
      busy = 'Checking it against the finalised record…'; render();
      if (bytes.length !== ctx.canonical.totalSize) throw new Error(`The art is ${bytes.length} bytes but the record expects ${ctx.canonical.totalSize}. Not the canonical art; nothing was started.`);
      plan = await engine.quote({ bytes: bytes.length, chunks: Math.ceil(bytes.length / 16384) });
      plan = Object.fromEntries(Object.entries(plan).map(([k, v]) => [k, typeof v === 'bigint' ? v.toString() : v]));
      busy = '';
    } catch (e: any) { busy = ''; error = String(e && e.message || e); plan = null; bytes = null; }
    render();
  }
  async function create() {
    if (!bytes) return;
    error = ''; busy = 'Re-checking the helper and the token before anything is created…'; render();
    try {
      const lock = (document.getElementById('ftlLock') as HTMLInputElement | null);
      const expectedFunder = lock && lock.checked ? me() : null;
      const j = await engine.createJob({ token: tokenId, bytes, expectedFunder, helper: coll.helper, core: ctx.reg.core.contract });
      job = j; busy = ''; drive(j.id);
    } catch (e: any) { busy = ''; error = String(e && e.message || e); }
    render();
  }

  el.addEventListener('click', (ev) => {
    const t = (ev.target as HTMLElement).closest('button,[data-copy]') as HTMLElement | null; if (!t) return;
    if (t.dataset.copy) { try { navigator.clipboard.writeText(t.dataset.copy); t.textContent = 'Copied'; } catch { /* ignore */ } return; }
    if (t.id === 'ftlPrep') void prepare();
    else if (t.id === 'ftlCreate') void create();
    else if (t.id === 'ftlCancel' && job) { const r = engine.cancel(job.id); if (r && r.error) error = r.error; refresh(); }
    else if (t.id === 'ftlResume' && job) { const r = engine.resumeStopped(job.id); if (r && r.error) error = r.error; else drive(job.id); refresh(); }
  });
  el.addEventListener('change', (ev) => { const t = ev.target as HTMLInputElement; if (t && t.id === 'ftlLock') lockFunder.on = t.checked; });

  // Re-attach to a saved job for this token, if there is one.
  job = pick();
  if (job && !TERMINAL.has(job.status)) { engine.attach(job.id); drive(job.id); }
  else if (job && job.status === 'NEEDS_RECOVERY') { engine.attach(job.id); drive(job.id); }
  render();
  timer = setInterval(() => { if (job) { job = engine.get(job.id); render(); } }, 3000);
}
