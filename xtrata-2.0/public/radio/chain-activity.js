import {decodePaidReceipt} from './paid-receipt.mjs';
export const PAID_PLAYS_CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0';

const unsigned = (repr, name) => {
  const match = new RegExp(`\\(${name} u([0-9]+)\\)`).exec(repr);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isSafeInteger(value) ? value : null;
};

const principal = (repr, name) => {
  const match = new RegExp(`\\(${name} '([A-Z0-9]+)\\)`).exec(repr);
  return match?.[1] || null;
};

export function parsePaidPlayEvent(event) {
  if (!event || event.event_type !== 'smart_contract_log') return null;
  const log = event.contract_log;
  const repr = log?.value?.repr;
  if (log?.contract_id !== PAID_PLAYS_CONTRACT || log.topic !== 'print' || typeof repr !== 'string' || repr.length > 2000) return null;
  if (!repr.includes('(event "radio-paid-play")')) return null;
  const txid = String(event.tx_id || '').toLowerCase();
  const core = unsigned(repr, 'core');
  const id = unsigned(repr, 'id');
  const amount = unsigned(repr, 'amount');
  const total = unsigned(repr, 'total');
  const payer = principal(repr, 'payer');
  const recipient = principal(repr, 'recipient');
  if (!/^0x[0-9a-f]{64}$/.test(txid) || ![1, 2, 3].includes(core) || id === null || amount !== 50 || total === null || !payer || !recipient) return null;
  const receipt=/\(receipt 0x([a-f0-9]{32})\)/i.exec(repr)?.[1];
  const rawTime = event.block_time ?? event.burn_block_time;
  const timestamp = Number.isSafeInteger(rawTime) && rawTime > 0 ? rawTime * 1000 : null;
  return {txid, core, id, amount, total, payer, recipient, ...(timestamp ? {timestamp} : {}),...(receipt?{receipt}: {})};
}

const short = value => value.length > 16 ? `${value.slice(0, 7)}…${value.slice(-6)}` : value;
const explorer = txid => `https://explorer.hiro.so/txid/${txid}?chain=mainnet`;
const localHost = () => ['127.0.0.1', 'localhost'].includes(location.hostname);

async function json(url) {
  const response = await fetch(url, {cache: 'no-store', signal: AbortSignal.timeout(12000)});
  if (!response.ok) throw Object.assign(Error(`HTTP ${response.status}`),{status:response.status});
  return response.json();
}

async function logs(offset = 0) {
  if(localHost()){const data=await json('/chain/plays?offset='+offset);if(!Array.isArray(data.results))throw Error('Invalid contract log response');return {scanned:data.results.length,total:Number.isSafeInteger(data.total)?data.total:null,plays:data.results.map(parsePaidPlayEvent).filter(Boolean)};}
  const bases = localHost() ? ['https://api.mainnet.hiro.so'] : ['/hiro/mainnet', 'https://api.mainnet.hiro.so'];
  const paths = [
    `/extended/v2/smart-contracts/${encodeURIComponent(PAID_PLAYS_CONTRACT)}/logs?limit=20&offset=${offset}`,
    `/extended/v1/contract/${encodeURIComponent(PAID_PLAYS_CONTRACT)}/events?limit=20&offset=${offset}`
  ];
  let last;
  for (const base of bases) for (const path of paths) {
    try {
      const data = await json(base + path);
      if (!Array.isArray(data.results)) throw Error('Invalid contract log response');
      return {scanned: data.results.length, total: Number.isSafeInteger(data.total) ? data.total : null, plays: data.results.map(parsePaidPlayEvent).filter(Boolean)};
    } catch (error) {
      if(error.status===429)throw error;
      last = error;
    }
  }
  throw last || Error('Contract activity is unavailable');
}

async function catalogue(url) {
  const data = await json(url);
  return new Map((data.tracks || []).filter(track => Number.isSafeInteger(track.id)).map(track => [track.id, track]));
}

function row(play, track, fresh) {
  const article = document.createElement('article');
  article.className = `chain-play${fresh ? ' is-new' : ''}`;
  const heading = document.createElement('h3');
  heading.textContent = track?.title || `Song #${play.id}`;
  const meta = document.createElement('p');
  meta.className = 'chain-play-meta';
  meta.textContent = [decodePaidReceipt(play.receipt).label, track?.artist, `Inscription #${play.id}`, `song total ${play.total}`].filter(Boolean).join(' · ');
  const payment = document.createElement('p');
  payment.className = 'chain-play-payment';
  payment.textContent = `0.000050 STX from ${short(play.payer)} to ${short(play.recipient)}`;
  payment.title = `Payer ${play.payer} · Recipient ${play.recipient}`;
  const link = document.createElement('a');
  link.href = explorer(play.txid);
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = 'Confirmed on-chain ↗';
  article.append(heading, meta, payment, link);
  return article;
}

export function filterPaidPlays(plays, tracks, query = '', role = 'either') {
  const term = query.trim().toLowerCase();
  return plays.filter(play => {
    const track = play.core === 3 ? tracks.get(play.id) : null;
    const fields = role === 'payer' ? [play.payer] : role === 'recipient' ? [play.recipient]
      : [play.id, track?.title, track?.artist, play.payer, play.recipient, play.txid];
    return fields.some(value => String(value ?? '').toLowerCase().includes(term));
  });
}

export function rankPayers(plays) {
  const groups = new Map();
  for (const play of plays) {
    const item = groups.get(play.payer) || {payer: play.payer, count: 0, amount: 0};
    item.count++; item.amount += play.amount; groups.set(play.payer, item);
  }
  return [...groups.values()].sort((a, b) => b.count - a.count || a.payer.localeCompare(b.payer));
}

const cachedPlay = play => play && /^0x[0-9a-f]{64}$/.test(play.txid)
  && [1, 2, 3].includes(play.core)
  && Number.isSafeInteger(play.id) && play.id >= 0
  && play.amount === 50
  && Number.isSafeInteger(play.total) && play.total >= 0
  && /^[A-Z0-9]{3,64}$/.test(play.payer)
  && /^[A-Z0-9]{3,64}$/.test(play.recipient);

export function mountPaidPlayReaders() {
  for (const host of document.querySelectorAll('[data-xtrata-chain-plays]')) {
    const status = host.querySelector('[data-chain-status]');
    const list = host.querySelector('[data-chain-list]');
    if (!status || !list) continue;
    const button = host.querySelector('[data-chain-refresh]');
    const history = host.hasAttribute('data-chain-history');
    const catalogueUrl = host.dataset.catalogue || '/radio/counts?range=all&chainLikes=0';
    const limit = Math.min(20, Math.max(1, Number(host.dataset.limit) || 12));
    let tracks = new Map(), plays = new Map(), busy = false, offset = 0, complete = false;
    let scanning = false, cancelled = false, shown = 50;
    let search, role, view, older, all, more, summary, totals;
    const cacheKey = 'xtrata-paid-play-total-v1:' + PAID_PLAYS_CONTRACT;
    const historyCacheKey = 'xtrata-paid-play-history-v1:' + PAID_PLAYS_CONTRACT;
    let previousTotal = null;
    try { const saved = JSON.parse(localStorage.getItem(cacheKey)); if (Number.isSafeInteger(saved?.count) && saved.count >= 0) previousTotal = saved; } catch {}
    if (history) try {
      const saved = JSON.parse(localStorage.getItem(historyCacheKey));
      const cached = Array.isArray(saved?.plays) ? saved.plays.slice(0, 10000).filter(cachedPlay) : [];
      plays = new Map(cached.map(play => [play.txid, play]));
      if (!previousTotal && Number.isSafeInteger(saved?.count) && saved.count >= plays.size)
        previousTotal = {count: saved.count, checkedAt: saved.checkedAt};
    } catch {}

    if (history) {
      const disclosure = document.createElement('details');
      disclosure.className = 'chain-filter-panel';
      const toggle = document.createElement('summary'); toggle.textContent = 'Search & filters';
      const controls = document.createElement('div');
      controls.className = 'chain-history-controls';
      controls.innerHTML = `<label>Find a play<input type="search" placeholder="Song, artist, inscription ID, wallet or transaction" data-search></label>
        <label>Search in<select data-role><option value="either">All fields</option><option value="payer">Paying wallet</option><option value="recipient">Receiving wallet</option></select></label>
        <label>View<select data-view><option value="plays">Individual payments</option><option value="payers">Top supporters · most paid starts</option></select></label><button type="button" data-older>Load older payments</button><button type="button" data-all>Load full history</button>`;
      search = controls.querySelector('[data-search]'); role = controls.querySelector('[data-role]');
      view = controls.querySelector('[data-view]');
      older = controls.querySelector('[data-older]'); all = controls.querySelector('[data-all]');
      summary = document.createElement('p'); summary.setAttribute('aria-live', 'polite');
      more = document.createElement('button'); more.type = 'button'; more.textContent = 'Show more matching payments';
      totals = document.createElement('p'); totals.className = 'chain-totals'; totals.setAttribute('aria-live', 'polite');
      disclosure.append(toggle, controls);
      list.before(totals, disclosure, summary); list.after(more);
      for (const input of [search, role, view]) input.addEventListener('input', () => {shown = 50; render();});
      more.onclick = () => {shown += 50; render();};
      older.onclick = () => void refresh(true);
      all.onclick = () => {
        if (scanning) {cancelled = true; all.textContent = 'Stopping…'; return;}
        void loadHistory();
      };
    }
    function render() {
      host.dispatchEvent(new CustomEvent('paid-history', {detail: {plays: [...plays.values()], tracks, complete, busy: busy || scanning, status: status.textContent}}));
      const matches = filterPaidPlays([...plays.values()], tracks, search?.value, role?.value);
      const ranked = view?.value === 'payers';
      const results = ranked ? rankPayers(matches) : matches;
      const visible = results.slice(0, history ? shown : limit);
      list.replaceChildren(...visible.map((play, index) => {
        if (!ranked) return row(play, play.core === 3 ? tracks.get(play.id) : null, false);
        const article = document.createElement('article'); article.className = 'chain-play';
        const title = document.createElement('h3'); title.textContent = `#${index + 1} · ${play.count.toLocaleString()} paid starts`;
        const wallet = document.createElement('p'); wallet.textContent = play.payer; wallet.style.overflowWrap = 'anywhere';
        const amount = document.createElement('p'); amount.textContent = `${(play.amount / 1000000).toFixed(6)} STX paid to song holders (network fees excluded)`;
        const inspect = document.createElement('button'); inspect.type = 'button'; inspect.textContent = 'See this wallet’s payments';
        inspect.onclick = () => {search.value = play.payer; role.value = 'payer'; view.value = 'plays'; shown = 50; render();};
        article.append(title, wallet, amount, inspect); return article;
      }));
      if (!visible.length) list.textContent = 'No matching paid starts in the loaded history.';
      if (history) {
        const amount = matches.reduce((sum, play) => sum + play.amount, 0);
        // Use the same live record set as the summary, not the previous scan's total.
        totals.textContent = `${plays.size.toLocaleString()} ${complete ? 'total paid starts' : 'paid starts loaded so far'} · ${(plays.size * 50 / 1000000).toFixed(6)} STX paid to holders${complete ? '' : ' · checking full history…'}`;
        if (!complete && previousTotal?.count > plays.size)
          totals.textContent += ` (${previousTotal.count.toLocaleString()} at the previous complete check)`;
        summary.textContent = `${matches.length.toLocaleString()} matching paid starts · ${(amount / 1000000).toFixed(6)} STX to holders · showing ${visible.length} ${ranked ? 'supporters' : 'payments'}. ${complete ? 'Full history loaded.' : `${plays.size.toLocaleString()} paid starts loaded so far. ${localHost()?'Choose Load full history to fetch older payments.':'Full history loads automatically;'} Totals are provisional until complete.`}`;
        older.disabled = busy || scanning || complete;
        all.disabled = complete || (busy && !scanning);
        all.textContent = scanning ? 'Stop loading history' : 'Load full history';
        more.hidden = visible.length >= results.length;
      }
    }
    const refresh = async (olderPage = false) => {
      if (busy || (!olderPage && (document.hidden || scanning))) return false;
      busy = true; if (button) button.disabled = true; render();
      try {
        if (!tracks.size) tracks = await catalogue(catalogueUrl).catch(() => new Map());
        const pageOffset = olderPage ? offset : 0;
        const data = await logs(pageOffset);
        // Refreshes preserve loaded history. Dedupe overlapping pages by transaction.
        if (!olderPage) {
          const fresh = data.plays.filter(play => !plays.has(play.txid));
          plays = new Map([...fresh.map(play => [play.txid, play]), ...plays]);
          if (offset === 0 || fresh.length) {
            offset = data.scanned;
            complete = data.total !== null && offset >= data.total;
          }
        } else {
          for (const play of data.plays) plays.set(play.txid, play);
          offset += data.scanned;
        }
        if (olderPage || pageOffset === 0 && offset === data.scanned)
          complete = data.scanned === 0 || (data.total !== null && offset >= data.total);
        status.textContent = `Confirmed activity checked ${new Date().toLocaleTimeString()} · newest payments first`;
        return true;
      } catch {
        status.textContent = 'Activity update unavailable; loaded payments are preserved. Try again shortly.';
        return false;
      } finally {busy = false; if (button) button.disabled = false; render();}
    };
    async function loadHistory() {
      if (!history || scanning || busy) return;
      scanning = true; cancelled = false; render();
      try {
        while (!complete && !cancelled && !document.hidden) {
          if (!await refresh(true)) break;
          if (!complete) await new Promise(resolve => setTimeout(resolve, localHost()?3000:300));
        }
        if (complete) {
          previousTotal = {count: plays.size, checkedAt: Date.now()};
          try { localStorage.setItem(cacheKey, JSON.stringify(previousTotal)); } catch {}
          try { localStorage.setItem(historyCacheKey, JSON.stringify({...previousTotal, plays: [...plays.values()]})); } catch {}
        }
      } finally { scanning = false; render(); }
    }
    async function update() {
      if (await refresh() && !localHost()) await loadHistory();
    }
    button?.addEventListener('click', () => void update());
    document.addEventListener('visibilitychange', () => {if (!document.hidden) void update();});
    const timer = setInterval(() => void update(), localHost()?60000:15000);
    window.addEventListener('pagehide', () => {cancelled = true; clearInterval(timer);}, {once: true});
    void update();
  }
}

if (typeof document !== 'undefined') mountPaidPlayReaders();
