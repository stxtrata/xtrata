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
  return {txid, core, id, amount, total, payer, recipient};
}

const short = value => value.length > 16 ? `${value.slice(0, 7)}…${value.slice(-6)}` : value;
const explorer = txid => `https://explorer.hiro.so/txid/${txid}?chain=mainnet`;
const localHost = () => ['127.0.0.1', 'localhost'].includes(location.hostname);

async function json(url) {
  const response = await fetch(url, {cache: 'no-store', signal: AbortSignal.timeout(12000)});
  if (!response.ok) throw Error(`HTTP ${response.status}`);
  return response.json();
}

async function logs() {
  const bases = localHost() ? ['https://api.mainnet.hiro.so'] : ['/hiro/mainnet', 'https://api.mainnet.hiro.so'];
  const paths = [
    `/extended/v2/smart-contracts/${encodeURIComponent(PAID_PLAYS_CONTRACT)}/logs?limit=20&offset=0`,
    `/extended/v1/contract/${encodeURIComponent(PAID_PLAYS_CONTRACT)}/events?limit=20&offset=0`
  ];
  let last;
  for (const base of bases) for (const path of paths) {
    try {
      const data = await json(base + path);
      if (!Array.isArray(data.results)) throw Error('Invalid contract log response');
      return {total: Number.isSafeInteger(data.total) ? data.total : null, plays: data.results.map(parsePaidPlayEvent).filter(Boolean)};
    } catch (error) {
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
  meta.textContent = [track?.artist, `Inscription #${play.id}`, `song total ${play.total}`].filter(Boolean).join(' · ');
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

export function mountPaidPlayReaders() {
  for (const host of document.querySelectorAll('[data-xtrata-chain-plays]')) {
    const status = host.querySelector('[data-chain-status]');
    const list = host.querySelector('[data-chain-list]');
    if (!status || !list) continue;
    const button = host.querySelector('[data-chain-refresh]');
    const catalogueUrl = host.dataset.catalogue || '/radio/counts?range=all&chainLikes=0';
    const limit = Math.min(20, Math.max(1, Number(host.dataset.limit) || 12));
    let tracks = new Map();
    let known = null;
    let busy = false;

    const refresh = async () => {
      if (busy || document.hidden) return;
      busy = true;
      if (button) button.disabled = true;
      try {
        if (!tracks.size) tracks = await catalogue(catalogueUrl).catch(() => new Map());
        const data = await logs();
        const next = new Set(data.plays.map(play => play.txid));
        const fresh = known ? data.plays.filter(play => !known.has(play.txid)) : [];
        list.replaceChildren(...data.plays.slice(0, limit).map(play => row(play, tracks.get(play.id), fresh.some(item => item.txid === play.txid))));
        if (!data.plays.length) list.textContent = 'No confirmed paid starts have appeared yet.';
        const count = data.total === null ? `${data.plays.length} recent` : `${data.total.toLocaleString()} total`;
        status.textContent = `${count} confirmed paid starts · checked ${new Date().toLocaleTimeString()}`;
        if (fresh.length) status.textContent = `${fresh.length} new paid ${fresh.length === 1 ? 'start' : 'starts'} · ${status.textContent}`;
        known = next;
      } catch {
        status.textContent = known ? 'Live update unavailable; showing the last confirmed activity.' : 'Confirmed on-chain activity is temporarily unavailable.';
      } finally {
        busy = false;
        if (button) button.disabled = false;
      }
    };

    button?.addEventListener('click', refresh);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) void refresh(); });
    const timer = setInterval(refresh, 15000);
    window.addEventListener('pagehide', () => clearInterval(timer), {once: true});
    void refresh();
  }
}

if (typeof document !== 'undefined') mountPaidPlayReaders();
