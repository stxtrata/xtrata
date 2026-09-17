import { parsePage, parseStatus, stx, type ReadOnlyCompanion, type Status } from './protocol';

// The caller supplies a transport. No global bridge, local port discovery or signer.
export function mountSupportPanel(host: HTMLElement, companion?: ReadOnlyCompanion, timeoutMs = 2000) {
  const doc = host.ownerDocument;
  const section = doc.createElement('section');
  section.className = 'radio-support';
  section.setAttribute('aria-label', 'Support as you listen');
  const heading = doc.createElement('h3'); heading.textContent = 'Support as you listen';
  const state = doc.createElement('p'); state.setAttribute('role', 'status');
  const balance = doc.createElement('p');
  const refresh = doc.createElement('button'); refresh.textContent = 'Check Music Wallet';
  const details = doc.createElement('details');
  const summary = doc.createElement('summary'); summary.textContent = 'Supported starts and payments';
  const list = doc.createElement('ol');
  const more = doc.createElement('button'); more.textContent = 'Older payments'; more.hidden = true;
  const historyState = doc.createElement('p'); historyState.setAttribute('role', 'status');
  details.append(summary, historyState, list, more);
  section.append(heading, state, balance, refresh, details); host.append(section);
  let revision = 0, disposed = false, loading = false, loaded = false;
  let cursor: string | null = null;
  let current: Status | null = null;
  const seen = new Set<string>(), cursors = new Set<string>();
  const controllers = new Set<AbortController>();
  async function request<T>(fn: (signal: AbortSignal) => Promise<T>): Promise<T> {
    const controller = new AbortController(); controllers.add(controller);
    let timer: ReturnType<typeof setTimeout>;
    try {
      return await Promise.race([Promise.resolve().then(() => fn(controller.signal)), new Promise<never>((_, reject) => {
        timer = setTimeout(() => { controller.abort(); reject(Error('Unavailable')); }, timeoutMs);
      })]);
    } finally { clearTimeout(timer!); controllers.delete(controller); }
  }
  async function loadHistory() {
    if (!companion || !current || loading || disposed || (loaded && cursor === null)) return;
    const version = revision; loading = true; more.disabled = true;
    historyState.textContent = 'Loading payments…';
    try {
      const page = parsePage(await request(signal => companion.history(cursor, 20, signal)));
      if (disposed || version !== revision) return;
      if (page.next !== null && cursors.has(page.next)) throw Error('Repeated cursor');
      if (page.next !== null) cursors.add(page.next);
      for (const entry of page.entries) {
        if (seen.has(entry.id)) continue;
        seen.add(entry.id);
        const li = doc.createElement('li');
        const total = entry.fee !== null && entry.holder !== null ? stx((BigInt(entry.fee) + BigInt(entry.holder)).toString()) : 'Debit not confirmed';
        li.textContent = `${entry.title || `Song #${entry.masterId}`} · ${entry.artist || 'Artist unavailable'} · core ${entry.core} / #${entry.masterId} · ${entry.startedAt} · ${entry.state} · ${total}`;
        if (entry.fee !== null && entry.holder !== null) li.append(doc.createTextNode(` (holder ${stx(entry.holder)}, network ${stx(entry.fee)})`));
        if (entry.txid) {
          const link = doc.createElement('a'); link.textContent = ' View transaction';
          link.href = `https://explorer.hiro.so/txid/${entry.txid}?chain=mainnet`;
          link.target = '_blank'; link.rel = 'noopener noreferrer'; li.append(link);
        }
        list.append(li);
      }
      loaded = true; cursor = page.next; more.hidden = cursor === null;
      historyState.textContent = seen.size ? `${seen.size} records loaded` : 'No supported starts yet.';
    } catch {
      if (!disposed && version === revision) historyState.textContent = 'Payment history unavailable. Check Music Wallet to retry.';
    } finally { if (version === revision) { loading = false; more.disabled = false; } }
  }
  async function check() {
    const version = ++revision;
    controllers.forEach(c => c.abort());
    current = null; cursor = null; loaded = false; loading = false;
    seen.clear(); cursors.clear(); list.replaceChildren(); balance.textContent = '';
    details.hidden = true; more.hidden = true;
    state.textContent = companion ? 'Checking Music Wallet…' : 'Listening free. Music Wallet integration is in development.';
    refresh.hidden = !companion;
    if (!companion) return;
    refresh.disabled = true;
    try {
      const status = parseStatus(await request(signal => companion.status(signal)));
      if (disposed || version !== revision) return;
      current = status;
      const cost = BigInt(status.fee) + 50n;
      const reason = status.attention !== 'none' ? status.attention : status.locked ? 'locked' : !status.enabled ? 'paused' : BigInt(status.usable) < cost ? 'balance empty' : 'ready';
      state.textContent = `Music Wallet ${status.address.slice(0, 7)}…${status.address.slice(-5)} · ${reason}. Listening free during this read-only preview.`;
      balance.textContent = `Confirmed ${stx(status.confirmed)} · Pending/reserved ${stx(status.reserved)} · Recovery reserve ${stx(status.reserve)} · Available ${stx(status.usable)} · Estimated starts ${BigInt(status.usable) / cost} · ${status.pending} pending`;
      details.hidden = false;
      if (details.open) void loadHistory();
    } catch {
      if (!disposed && version === revision) state.textContent = 'Music Wallet unavailable · listening free.';
    } finally { if (version === revision) refresh.disabled = false; }
  }
  refresh.onclick = () => { void check(); };
  more.onclick = () => { void loadHistory(); };
  details.ontoggle = () => { if (details.open && !loaded) void loadHistory(); };
  void check();
  return { refresh: check, dispose() { disposed = true; revision++; controllers.forEach(c => c.abort()); section.remove(); } };
}
